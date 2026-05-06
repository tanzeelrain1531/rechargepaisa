let _encIdCounter = Date.now();
const nextEncId = () => ++_encIdCounter;
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { EncounterHeader } from "../components/encounter/EncounterHeader";
import { EncounterOrders } from "../components/encounter/EncounterOrders";
import { EncounterSOAP } from "../components/encounter/EncounterSOAP";
import { EncounterSignOff } from "../components/encounter/EncounterSignOff";
import { EncounterVitals } from "../components/encounter/EncounterVitals";
import { DEMO_ALLERGIES } from "../demoData";
import { useActor } from "../hooks/useActor";
import {
  type InteractionAlert,
  checkInteractions,
} from "../lib/drugInteractions";
import type { OrderSet } from "../lib/orderSets";

interface EncounterProps {
  activeAppointmentId: bigint | null;
  activePatientId: bigint | null;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export default function Encounter({
  activeAppointmentId,
  activePatientId,
  onBack,
  onNavigate,
}: EncounterProps) {
  const { actor, isFetching } = useActor();

  // Live data state
  const [patient, setPatient] = useState<{
    id: bigint;
    name: string;
    mrn: string;
    dateOfBirth: string;
    email: string;
    phone: string;
  } | null>(null);
  const [appointment, setAppointment] = useState<{
    id: bigint;
    status: string;
    patientId: bigint;
    date: string;
    providerId: bigint;
    reason?: string;
  } | null>(null);
  const [activeMeds, setActiveMeds] = useState<
    Array<{
      id: bigint;
      name: string;
      dose: string;
      frequency: string;
      status: string;
      patientId: bigint;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (isFetching || !actor) return;
    if (!activePatientId || !activeAppointmentId) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    Promise.all([
      actor.listPatients(),
      actor.listAppointments(),
      actor.listMedications(),
    ])
      .then(([patients, appointments, medications]) => {
        if (cancelled) return;
        const foundPatient =
          patients.find((p) => p.id === activePatientId) ?? null;
        const foundAppt =
          appointments.find((a) => a.id === activeAppointmentId) ?? null;
        const meds = medications.filter(
          (m) => m.patientId === activePatientId && m.status === "active",
        );
        setPatient(foundPatient);
        setAppointment(foundAppt);
        setActiveMeds(meds);
        if (!foundPatient || !foundAppt) setNotFound(true);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setNotFound(true);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [actor, isFetching, activePatientId, activeAppointmentId]);

  // ROS state
  const [showRos, setShowRos] = useState(false);
  const [rosFindings, setRosFindings] = useState<
    Record<string, Record<string, boolean>>
  >({});

  const rosChecked = Object.values(rosFindings).reduce(
    (total, systemFindings) =>
      total + Object.values(systemFindings).filter(Boolean).length,
    0,
  );

  const ROS_SYSTEMS = [
    {
      system: "Constitutional",
      symptoms: ["Fever", "Chills", "Fatigue", "Weight loss"],
    },
    {
      system: "Cardiovascular",
      symptoms: ["Chest pain", "Palpitations", "Edema", "Dyspnea on exertion"],
    },
    {
      system: "Respiratory",
      symptoms: ["Shortness of breath", "Cough", "Wheezing", "Hemoptysis"],
    },
    {
      system: "GI",
      symptoms: [
        "Nausea",
        "Vomiting",
        "Abdominal pain",
        "Diarrhea",
        "Constipation",
      ],
    },
    {
      system: "Musculoskeletal",
      symptoms: ["Joint pain", "Muscle aches", "Back pain", "Weakness"],
    },
    {
      system: "Neurological",
      symptoms: [
        "Headache",
        "Dizziness",
        "Numbness/tingling",
        "Vision changes",
      ],
    },
    {
      system: "Psychiatric",
      symptoms: ["Anxiety", "Depression", "Sleep disturbance", "Confusion"],
    },
  ] as const;

  const rosText = (() => {
    if (Object.keys(rosFindings).length === 0) return "";
    const parts = ROS_SYSTEMS.map(({ system, symptoms }) => {
      const positives = symptoms.filter(
        (s) => rosFindings[system]?.[s] === true,
      );
      if (positives.length === 0) return `${system}: negative`;
      return `${system}: ${positives.map((s) => s.toLowerCase()).join(", ")}`;
    });
    return `ROS: ${parts.join(". ")}.`;
  })();

  // Vitals state
  const [vitals, setVitals] = useState({
    bp: "",
    hr: "",
    temp: "",
    weight: "",
    spo2: "",
    rr: "",
  });
  const [cdsAlerts, setCdsAlerts] = useState<
    { id: string; message: string; dismissed: boolean }[]
  >([]);

  // SOAP state
  const [soap, setSoap] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });

  // Orders state
  const [orders, setOrders] = useState<
    Array<{ id: bigint; type: "lab" | "imaging"; name: string }>
  >([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [newOrder, setNewOrder] = useState<{
    type: "lab" | "imaging";
    name: string;
  }>({ type: "lab", name: "" });

  // Prescriptions state
  const [prescriptions, setPrescriptions] = useState<
    Array<{
      id: bigint;
      drug: string;
      dose: string;
      frequency: string;
      route: string;
    }>
  >([]);
  const [showRxForm, setShowRxForm] = useState(false);
  const [newRx, setNewRx] = useState({
    drug: "",
    dose: "",
    frequency: "",
    route: "PO",
  });

  // Drug interaction state
  const [interactions, setInteractions] = useState<InteractionAlert[]>([]);
  const [addingDespiteContraindicated, setAddingDespiteContraindicated] =
    useState(false);

  // Allergy cross-check state
  const [allergyAlert, setAllergyAlert] = useState<{
    allergen: string;
    reaction: string;
    severity: "mild" | "moderate" | "severe";
  } | null>(null);
  const [allergyJustification, setAllergyJustification] = useState("");
  const [allergyOverridden, setAllergyOverridden] = useState(false);

  const [isSigned, setIsSigned] = useState(false);

  // Autosave state
  const [autosaveStatus, setAutosaveStatus] = useState<
    "saved" | "pending" | "idle"
  >("idle");
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftKey = `encounter-draft-${activePatientId != null ? String(Number(activePatientId)) : "new"}`;

  // Restore draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          soap?: typeof soap;
          vitals?: typeof vitals;
          orders?: Array<{ id: string; type: "lab" | "imaging"; name: string }>;
          prescriptions?: Array<{
            id: string;
            drug: string;
            dose: string;
            frequency: string;
            route: string;
          }>;
        };
        if (parsed.soap) setSoap(parsed.soap);
        if (parsed.vitals) setVitals(parsed.vitals);
        if (parsed.orders)
          setOrders(parsed.orders.map((o) => ({ ...o, id: BigInt(o.id) })));
        if (parsed.prescriptions)
          setPrescriptions(
            parsed.prescriptions.map((rx) => ({ ...rx, id: BigInt(rx.id) })),
          );
        toast.info("Draft restored — unsaved note found", { duration: 4000 });
      }
    } catch {
      // Ignore invalid drafts
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  // Safety net: always clear draft when encounter is signed
  useEffect(() => {
    if (isSigned) {
      localStorage.removeItem(draftKey);
    }
  }, [isSigned, draftKey]);

  const triggerAutosave = useCallback(() => {
    if (isSigned) return;
    setAutosaveStatus("pending");
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      try {
        const draft = {
          soap,
          vitals,
          orders: orders.map((o) => ({ ...o, id: String(o.id) })),
          prescriptions: prescriptions.map((rx) => ({
            ...rx,
            id: String(rx.id),
          })),
        };
        localStorage.setItem(draftKey, JSON.stringify(draft));
        setAutosaveStatus("saved");
      } catch {
        // ignore
      }
    }, 2000);
  }, [isSigned, soap, vitals, orders, prescriptions, draftKey]);

  useEffect(() => {
    if (isSigned) return;
    triggerAutosave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSigned, triggerAutosave]);

  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, []);

  const [showAVS, setShowAVS] = useState(false);
  const [avsFollowUp, setAvsFollowUp] = useState("Follow up in 2 weeks");
  const [avsPatientEd, setAvsPatientEd] = useState("");
  const [spActive, setSpActive] = useState<string | null>(null);
  const [spFilter, setSpFilter] = useState("");
  const [dictating, setDictating] = useState<Record<string, boolean>>({});

  const DICTATION_SAMPLES: Record<string, string> = {
    subjective:
      "Patient presents with a 3-day history of worsening chest tightness and shortness of breath on exertion. Denies fever, cough, or pleuritic pain. Reports similar episode 6 months ago that resolved with bronchodilator use. No recent travel or sick contacts.",
    objective:
      "Vital signs stable. Blood pressure 138/86 mmHg, heart rate 82 bpm, respiratory rate 16, oxygen saturation 97% on room air, temperature 98.6°F. Lung auscultation reveals mild expiratory wheeze bilaterally. No use of accessory muscles. Heart sounds regular, no murmurs.",
    assessment:
      "1. Mild intermittent asthma exacerbation, likely triggered by seasonal allergens. 2. Hypertension, currently suboptimally controlled. 3. Consider GERD as contributing factor given reported post-meal symptom worsening.",
    plan: "1. Albuterol inhaler 2 puffs every 4-6 hours as needed for bronchospasm. 2. Increase lisinopril from 10mg to 20mg daily for blood pressure optimization. 3. Order spirometry to assess lung function. 4. Follow-up in 2 weeks or sooner if symptoms worsen. 5. Patient education provided on asthma triggers and proper inhaler technique.",
  };

  const handleDictate = (sectionKey: string) => {
    if (isSigned) return;
    setDictating((prev) => ({ ...prev, [sectionKey]: true }));
    setTimeout(() => {
      const sample = DICTATION_SAMPLES[sectionKey] ?? "";
      setSoap((prev) => ({
        ...prev,
        [sectionKey]: prev[sectionKey as keyof typeof prev]
          ? `${prev[sectionKey as keyof typeof prev]} ${sample}`
          : sample,
      }));
      setDictating((prev) => ({ ...prev, [sectionKey]: false }));
    }, 2500);
  };

  const [signedLabCount, setSignedLabCount] = useState(0);
  const [signedImgCount, setSignedImgCount] = useState(0);
  const [signedRxCount, setSignedRxCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [showEducation, setShowEducation] = useState(true);
  const [educationChecked, setEducationChecked] = useState<
    Record<string, boolean>
  >({});
  const [showChargeCapture, setShowChargeCapture] = useState(true);
  const [capturedCpts, setCapturedCpts] = useState<
    Array<{
      id: number;
      code: string;
      description: string;
      qty: number;
      unitPrice: number;
    }>
  >([]);
  const [newCptCode, setNewCptCode] = useState("");
  const [newCptDesc, setNewCptDesc] = useState("");

  // Drug interaction effect
  useEffect(() => {
    if (!newRx.drug.trim()) {
      setInteractions([]);
      setAddingDespiteContraindicated(false);
      setAllergyAlert(null);
      setAllergyJustification("");
      setAllergyOverridden(false);
      return;
    }

    if (activePatientId) {
      const patientAllergies = DEMO_ALLERGIES.filter(
        (a) => a.patientId === activePatientId,
      );
      const drugLower = newRx.drug.toLowerCase();
      const matched = patientAllergies.find((a) => {
        const allergenBase = a.allergen
          .toLowerCase()
          .replace(/\s*\(.*?\)/g, "")
          .trim();
        return (
          drugLower.includes(allergenBase) ||
          allergenBase.includes(drugLower.split(" ")[0])
        );
      });
      if (matched) {
        setAllergyAlert({
          allergen: matched.allergen,
          reaction: matched.reaction,
          severity: matched.severity,
        });
      } else {
        setAllergyAlert(null);
        setAllergyJustification("");
        setAllergyOverridden(false);
      }
    }
    const timeout = setTimeout(() => {
      const currentMedNames = [
        ...activeMeds.map((m) => `${m.name} ${m.dose}`),
        ...prescriptions.map((rx) => rx.drug),
      ];
      const found = checkInteractions(newRx.drug, currentMedNames);
      setInteractions(found);
    }, 300);
    return () => clearTimeout(timeout);
  }, [newRx.drug, activeMeds, prescriptions, activePatientId]);

  const handleApplyOrderSet = (set: OrderSet) => {
    const existingNames = new Set(orders.map((o) => o.name.toLowerCase()));
    const toAdd = set.orders.filter(
      (item) => !existingNames.has(item.name.toLowerCase()),
    );
    if (toAdd.length === 0) {
      toast.info(`All orders from ${set.name} already added`);
      return;
    }
    setOrders((prev) => [
      ...prev,
      ...toAdd.map((item, idx) => ({
        id: BigInt(Date.now() + idx),
        type: item.type,
        name: item.name,
      })),
    ]);
    toast.success(
      `${toAdd.length} order${toAdd.length > 1 ? "s" : ""} added from ${set.name}`,
      { icon: <CheckCircle2 className="w-4 h-4 text-success" /> },
    );
    setShowOrderForm(false);
  };

  const handleAddOrder = () => {
    if (!newOrder.name.trim()) {
      toast.error("Order name required");
      return;
    }
    setOrders((prev) => [
      ...prev,
      { id: BigInt(prev.length + Date.now()), ...newOrder },
    ]);
    setNewOrder({ type: "lab", name: "" });
    setShowOrderForm(false);
  };

  const handleAddRx = () => {
    if (!newRx.drug.trim()) {
      toast.error("Drug name required");
      return;
    }
    const hasContraindicated = interactions.some(
      (ia) => ia.severity === "contraindicated",
    );
    if (hasContraindicated && !addingDespiteContraindicated) {
      setAddingDespiteContraindicated(true);
      return;
    }
    if (allergyAlert && !allergyOverridden) {
      toast.error("Allergy alert: provide clinical justification to override");
      return;
    }
    setPrescriptions((prev) => [
      ...prev,
      { id: BigInt(prev.length + Date.now()), ...newRx },
    ]);
    setNewRx({ drug: "", dose: "", frequency: "", route: "PO" });
    setShowRxForm(false);
    setInteractions([]);
    setAddingDespiteContraindicated(false);
    setAllergyAlert(null);
    setAllergyJustification("");
    setAllergyOverridden(false);
  };

  const checkVitalsAlerts = (key: string, value: string) => {
    const newAlerts: { id: string; message: string; dismissed: boolean }[] = [];
    if (key === "bp") {
      const systolic = Number.parseInt(value.split("/")[0] ?? "0");
      if (!Number.isNaN(systolic)) {
        if (systolic > 180) {
          newAlerts.push({
            id: "bp-high",
            message: `⚠ Hypertensive Crisis — Systolic BP ${systolic} mmHg. Consider immediate evaluation, IV antihypertensive if symptomatic.`,
            dismissed: false,
          });
        } else if (systolic < 90 && systolic > 0) {
          newAlerts.push({
            id: "bp-low",
            message: `⚠ Hypotension — Systolic BP ${systolic} mmHg. Assess for shock, dehydration, or cardiac cause.`,
            dismissed: false,
          });
        }
      }
    }
    if (key === "spo2") {
      const spo2 = Number.parseFloat(value);
      if (!Number.isNaN(spo2) && spo2 < 92 && spo2 > 0) {
        newAlerts.push({
          id: "spo2-low",
          message: `⚠ Hypoxemia — SpO₂ ${spo2}%. Apply supplemental oxygen. Consider ABG, chest X-ray, and pulmonology consult.`,
          dismissed: false,
        });
      }
    }
    if (key === "hr") {
      const hr = Number.parseFloat(value);
      if (!Number.isNaN(hr)) {
        if (hr > 130) {
          newAlerts.push({
            id: "hr-high",
            message: `⚠ Tachycardia — HR ${hr} bpm. Evaluate for arrhythmia, infection, dehydration.`,
            dismissed: false,
          });
        } else if (hr < 40 && hr > 0) {
          newAlerts.push({
            id: "hr-low",
            message: `⚠ Bradycardia — HR ${hr} bpm. Obtain 12-lead ECG. Consider cardiology consult.`,
            dismissed: false,
          });
        }
      }
    }
    if (key === "temp") {
      const temp = Number.parseFloat(value);
      if (!Number.isNaN(temp) && temp > 102 && temp > 0) {
        newAlerts.push({
          id: "temp-high",
          message: `⚠ Fever — Temperature ${temp}°F. Consider infection workup: CBC, CMP, blood cultures, UA.`,
          dismissed: false,
        });
      }
    }
    if (newAlerts.length > 0) {
      setCdsAlerts((prev) => {
        const notDismissedIds = prev
          .filter((a) => !a.dismissed)
          .map((a) => a.id);
        const toAdd = newAlerts.filter((a) => !notDismissedIds.includes(a.id));
        return [
          ...prev.filter((a) => a.dismissed),
          ...prev.filter(
            (a) => !a.dismissed && !newAlerts.find((na) => na.id === a.id),
          ),
          ...toAdd,
        ];
      });
    }
  };

  const handleSaveDraft = async () => {
    if (!actor || !activePatientId) {
      toast.error("Cannot save: encounter data not available");
      return;
    }
    setIsSaving(true);
    try {
      await actor.createClinicalNote(
        activePatientId,
        "encounter-draft",
        JSON.stringify({ vitals, soap, orders, prescriptions }),
        BigInt(0),
      );
      toast.success("Encounter draft saved");
      localStorage.removeItem(draftKey);
      setAutosaveStatus("idle");
    } catch {
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignClose = async () => {
    if (!actor || !activePatientId) {
      toast.error("Cannot sign: encounter data not available");
      return;
    }
    setIsSigning(true);
    try {
      await actor.createClinicalNote(
        activePatientId,
        "encounter-signed",
        JSON.stringify({
          vitals,
          soap,
          orders,
          prescriptions,
          status: "signed",
        }),
        BigInt(0),
      );
      if (prescriptions.length > 0) {
        await Promise.all(
          prescriptions.map((rx) =>
            actor.createPrescription(
              activePatientId,
              rx.drug,
              rx.dose,
              rx.frequency,
              "pending",
              patient?.name ?? "Provider",
            ),
          ),
        );
      }
      const labOrders = orders.filter((o) => o.type === "lab");
      if (labOrders.length > 0) {
        await Promise.all(
          labOrders.map((o) =>
            actor.addLabResult(
              activePatientId,
              o.name,
              "Pending / In Progress",
              "pending",
              false,
            ),
          ),
        );
      }
      const inferModality = (name: string): string => {
        if (name.includes("CT")) return "CT";
        if (name.includes("MRI")) return "MRI";
        if (name.includes("Ultrasound") || name.includes("US"))
          return "Ultrasound";
        return "X-Ray";
      };
      const inferBodyPart = (name: string): string => {
        const match = name.match(/(?:CT|MRI|Ultrasound|US|X-Ray)\s+(.+)/);
        return match ? match[1].trim() : name.trim();
      };
      const imagingOrders = orders.filter((o) => o.type === "imaging");
      if (imagingOrders.length > 0) {
        // Persist imaging orders to backend
        await Promise.all(
          imagingOrders.map((o) =>
            actor.createImagingOrder(
              activePatientId,
              patient?.name ?? "Unknown",
              inferModality(o.name),
              inferBodyPart(o.name),
              "routine",
              "Dr. Sarah Chen",
              o.name,
            ),
          ),
        );
        // Also keep localStorage as a local cache for the Imaging page
        const existing = JSON.parse(
          localStorage.getItem("medunite_imaging_orders") ?? "[]",
        );
        const newEntries = imagingOrders.map((o, idx) => ({
          id: Date.now() + idx,
          patientName: patient?.name ?? "Unknown",
          orderName: o.name,
          modality: inferModality(o.name),
          bodyPart: inferBodyPart(o.name),
          status: "ordered",
          date: new Date().toISOString().slice(0, 10),
        }));
        localStorage.setItem(
          "medunite_imaging_orders",
          JSON.stringify([...existing, ...newEntries]),
        );
      }
      const labCount = labOrders.length;
      const imgCount = imagingOrders.length;
      const parts: string[] = [];
      if (labCount > 0)
        parts.push(`${labCount} lab order${labCount > 1 ? "s" : ""}`);
      if (imgCount > 0)
        parts.push(`${imgCount} imaging order${imgCount > 1 ? "s" : ""}`);
      const orderSummary =
        parts.length > 0 ? ` — ${parts.join(", ")} submitted` : "";

      const diagnosisText = soap.assessment.trim();
      let diagAddedCount = 0;
      if (diagnosisText && activePatientId) {
        const patientKey = String(Number(activePatientId));
        try {
          const existing = JSON.parse(
            localStorage.getItem(`medunite_problems_${patientKey}`) ?? "[]",
          ) as Array<{
            id: number;
            name: string;
            icd10: string;
            onset: string;
            severity: string;
            status: string;
          }>;
          const lines = diagnosisText.split("\n").filter((l) => l.trim());
          const newEntries = lines
            .map((line) => {
              const match = line.match(
                /^([A-Z][\d.]+[A-Z0-9]*)\s*[-–]\s*(.+)$/,
              );
              if (match) {
                return {
                  id: nextEncId(),
                  name: match[2].trim(),
                  icd10: match[1].trim(),
                  onset: new Date().toISOString().slice(0, 10),
                  severity: "Moderate",
                  status: "Active",
                };
              }
              return {
                id: nextEncId(),
                name: line.trim(),
                icd10: "",
                onset: new Date().toISOString().slice(0, 10),
                severity: "Moderate",
                status: "Active",
              };
            })
            .filter(
              (e) => e.name && !existing.find((ex) => ex.name === e.name),
            );
          if (newEntries.length > 0) {
            localStorage.setItem(
              `medunite_problems_${patientKey}`,
              JSON.stringify([...existing, ...newEntries]),
            );
            diagAddedCount = newEntries.length;
          }
        } catch {
          // ignore
        }
      }

      const diagNote =
        diagAddedCount > 0
          ? ` — ${diagAddedCount} diagnosis${diagAddedCount !== 1 ? "es" : ""} added to problem list`
          : "";
      toast.success(`Encounter signed and closed${orderSummary}${diagNote}`);
      setSignedLabCount(labCount);
      setSignedImgCount(imgCount);
      setSignedRxCount(prescriptions.length);
      setAutosaveStatus("idle");
      setIsSigned(true);
      setShowAVS(true);
    } catch {
      toast.error("Failed to sign encounter");
    } finally {
      localStorage.removeItem(draftKey);
      setIsSigning(false);
    }
  };

  const hasContraindicatedAlert = interactions.some(
    (ia) => ia.severity === "contraindicated",
  );

  if (isLoading || isFetching) {
    return (
      <div className="space-y-4" data-ocid="encounter.loading_state">
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            data-ocid="encounter.back_button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to Appointments
          </button>
        </div>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="space-y-4" data-ocid="encounter.error_state">
        <button
          type="button"
          data-ocid="encounter.back_button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to Appointments
        </button>
        <div className="border border-border bg-card px-5 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Encounter data not found.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            The patient or appointment record could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const encounterStep = (() => {
    if (isSigned) return 4;
    if (orders.length > 0 || prescriptions.length > 0) return 3;
    if (soap.subjective || soap.objective || soap.assessment || soap.plan)
      return 2;
    return 1;
  })();

  const STEPS = ["Vitals", "Assessment & Plan", "Orders", "Sign Off"];

  return (
    <div className="space-y-0" data-ocid="encounter.page">
      {/* Step progress bar */}
      <div
        className="flex items-center gap-0 px-5 py-3 bg-card border-b border-border"
        data-ocid="encounter.progress.panel"
      >
        {STEPS.map((label, idx) => {
          const stepNum = idx + 1;
          const isComplete = encounterStep > stepNum;
          const isCurrent = encounterStep === stepNum;
          return (
            <div
              key={label}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors",
                    isComplete
                      ? "bg-success text-success-foreground"
                      : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground border-2 border-border",
                  )}
                >
                  {isComplete ? <CheckCircle2 className="w-3 h-3" /> : stepNum}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap",
                    isCurrent
                      ? "text-foreground"
                      : isComplete
                        ? "text-success"
                        : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-2",
                    isComplete ? "bg-success/40" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      <EncounterHeader
        patient={patient}
        appointment={appointment}
        activeMeds={activeMeds}
        activeAppointmentId={activeAppointmentId}
        isSigned={isSigned}
        autosaveStatus={autosaveStatus}
        onBack={onBack}
      />

      <EncounterVitals
        vitals={vitals}
        setVitals={setVitals}
        cdsAlerts={cdsAlerts}
        setCdsAlerts={setCdsAlerts}
        isSigned={isSigned}
        checkVitalsAlerts={checkVitalsAlerts}
      />

      <EncounterSOAP
        soap={soap}
        setSoap={setSoap}
        isSigned={isSigned}
        appointmentId={activeAppointmentId}
        appointmentReason={appointment?.reason ?? ""}
        spActive={spActive}
        setSpActive={setSpActive}
        spFilter={spFilter}
        setSpFilter={setSpFilter}
        dictating={dictating}
        handleDictate={handleDictate}
        showRos={showRos}
        setShowRos={setShowRos}
        rosFindings={rosFindings}
        setRosFindings={setRosFindings}
        rosChecked={rosChecked}
        rosText={rosText}
      />

      <EncounterOrders
        orders={orders}
        setOrders={setOrders}
        prescriptions={prescriptions}
        setPrescriptions={setPrescriptions}
        showOrderForm={showOrderForm}
        setShowOrderForm={setShowOrderForm}
        newOrder={newOrder}
        setNewOrder={setNewOrder}
        showRxForm={showRxForm}
        setShowRxForm={setShowRxForm}
        newRx={newRx}
        setNewRx={setNewRx}
        interactions={interactions}
        allergyAlert={allergyAlert}
        allergyJustification={allergyJustification}
        setAllergyJustification={setAllergyJustification}
        allergyOverridden={allergyOverridden}
        setAllergyOverridden={setAllergyOverridden}
        addingDespiteContraindicated={addingDespiteContraindicated}
        setAddingDespiteContraindicated={setAddingDespiteContraindicated}
        isSigned={isSigned}
        hasContraindicatedAlert={hasContraindicatedAlert}
        handleAddOrder={handleAddOrder}
        handleAddRx={handleAddRx}
        handleApplyOrderSet={handleApplyOrderSet}
      />

      <EncounterSignOff
        isSigned={isSigned}
        showAVS={showAVS}
        setShowAVS={setShowAVS}
        patient={patient}
        soap={soap}
        prescriptions={prescriptions}
        orders={orders}
        avsFollowUp={avsFollowUp}
        setAvsFollowUp={setAvsFollowUp}
        avsPatientEd={avsPatientEd}
        setAvsPatientEd={setAvsPatientEd}
        educationChecked={educationChecked}
        setEducationChecked={setEducationChecked}
        showEducation={showEducation}
        setShowEducation={setShowEducation}
        capturedCpts={capturedCpts}
        setCapturedCpts={setCapturedCpts}
        newCptCode={newCptCode}
        setNewCptCode={setNewCptCode}
        newCptDesc={newCptDesc}
        setNewCptDesc={setNewCptDesc}
        showChargeCapture={showChargeCapture}
        setShowChargeCapture={setShowChargeCapture}
        isSaving={isSaving}
        isSigning={isSigning}
        signedLabCount={signedLabCount}
        signedImgCount={signedImgCount}
        signedRxCount={signedRxCount}
        handleSaveDraft={handleSaveDraft}
        handleSignClose={handleSignClose}
        onBack={onBack}
        onNavigate={onNavigate}
      />
    </div>
  );
}
