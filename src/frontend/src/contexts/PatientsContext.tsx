import { useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import {
  useAppointments,
  useClinicalNotes,
  useLabResults,
  useMedications,
  usePatients,
  usePrescriptions,
} from "../hooks/useBackendData";
import { useDemoMode } from "../hooks/useDemoMode";

export type Patient = {
  id: bigint;
  name: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  mrn: string;
};

export type Medication = {
  id: bigint;
  patientId: bigint;
  name: string;
  dose: string;
  frequency: string;
  status: string;
};

export type LabResult = {
  id: bigint;
  patientId: bigint;
  testName: string;
  result: string;
  unit: string;
  isCritical: boolean;
};

export type Appointment = {
  id: bigint;
  patientId: bigint;
  date: string;
  status: string;
  providerId: bigint;
};

export type ClinicalNote = {
  id: bigint;
  patientId: bigint;
  noteType: string;
  content: string;
  authorId: bigint;
};

export type Prescription = {
  id: bigint;
  patientId: bigint;
  medication: string;
  dose: string;
  status: string;
  prescribedBy: string;
  notes: string;
  patientName: string;
  createdAt: bigint;
};

export interface DuplicatePair {
  a: Patient;
  b: Patient;
  reason: string;
}

interface PatientsContextValue {
  patients: Patient[];
  allMedications: Medication[];
  allLabResults: LabResult[];
  allAppointments: Appointment[];
  allClinicalNotes: ClinicalNote[];
  allPrescriptions: Prescription[];
  loading: boolean;
  submitting: boolean;
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPatient: Patient | null;
  setSelectedPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
  form: {
    name: string;
    dateOfBirth: string;
    phone: string;
    email: string;
    mrn: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      dateOfBirth: string;
      phone: string;
      email: string;
      mrn: string;
    }>
  >;
  filtered: Patient[];
  duplicates: DuplicatePair[];
  abnormalPatientIds: Set<bigint>;
  handleAdd: () => Promise<void>;
  handleCancel: () => void;
  handleMerge: (pair: DuplicatePair) => void;
  handleRowClick: (
    patient: Patient,
    onSelectPatient?: (p: {
      id: bigint;
      name: string;
      mrn: string;
      dateOfBirth: string;
    }) => void,
  ) => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const PatientsContext = createContext<PatientsContextValue | null>(null);

export function usePatientsContext() {
  const ctx = useContext(PatientsContext);
  if (!ctx)
    throw new Error("usePatientsContext must be used within PatientsProvider");
  return ctx;
}

export function detectDuplicates(patients: Patient[]): DuplicatePair[] {
  const pairs: DuplicatePair[] = [];
  for (let i = 0; i < patients.length; i++) {
    for (let j = i + 1; j < patients.length; j++) {
      const a = patients[i];
      const b = patients[j];
      const sameName = a.name.toLowerCase() === b.name.toLowerCase();
      const sameDob = a.dateOfBirth === b.dateOfBirth;
      const samePhone = a.phone && b.phone && a.phone === b.phone;
      if (sameName && sameDob) {
        pairs.push({ a, b, reason: "Same name & date of birth" });
      } else if (sameName && samePhone) {
        pairs.push({ a, b, reason: "Same name & phone number" });
      }
    }
  }
  return pairs;
}

export type FlagLevel = "normal" | "low" | "high" | "critical";

export const LAB_REFERENCE_RANGES: Record<
  string,
  { display: string; getFlag: (v: number) => FlagLevel }
> = {
  HbA1c: {
    display: "4.0–5.6%",
    getFlag: (v) => (v < 5.7 ? "normal" : v < 6.5 ? "high" : "critical"),
  },
  Potassium: {
    display: "3.5–5.0 mEq/L",
    getFlag: (v) => {
      if (v < 2.5 || v > 6.5) return "critical";
      if (v < 3.5) return "low";
      if (v > 5.0) return "high";
      return "normal";
    },
  },
  Glucose: {
    display: "70–99 mg/dL",
    getFlag: (v) => {
      if (v < 40 || v > 500) return "critical";
      if (v < 70) return "low";
      if (v >= 100) return "high";
      return "normal";
    },
  },
  Sodium: {
    display: "135–145 mEq/L",
    getFlag: (v) => {
      if (v < 125 || v > 155) return "critical";
      if (v < 135) return "low";
      if (v > 145) return "high";
      return "normal";
    },
  },
  Creatinine: {
    display: "0.7–1.3 mg/dL",
    getFlag: (v) => {
      if (v > 4.0) return "critical";
      if (v > 1.3) return "high";
      if (v < 0.7) return "low";
      return "normal";
    },
  },
  Hemoglobin: {
    display: "12.0–17.5 g/dL",
    getFlag: (v) => {
      if (v < 7.0) return "critical";
      if (v < 12.0) return "low";
      if (v > 17.5) return "high";
      return "normal";
    },
  },
  WBC: {
    display: "4.5–11.0 K/µL",
    getFlag: (v) => {
      if (v < 2.0 || v > 20.0) return "critical";
      if (v < 4.5) return "low";
      if (v > 11.0) return "high";
      return "normal";
    },
  },
};

export function getLabFlag(
  testName: string,
  resultStr: string,
  isCritical: boolean,
): FlagLevel {
  if (isCritical) return "critical";
  const val = Number.parseFloat(resultStr);
  if (Number.isNaN(val)) return "normal";
  const ref = LAB_REFERENCE_RANGES[testName];
  if (ref) return ref.getFlag(val);
  return "normal";
}

export const flagVariant: Record<
  FlagLevel,
  "neutral" | "danger" | "warning" | "success"
> = {
  normal: "success",
  low: "warning",
  high: "warning",
  critical: "danger",
};

export const flagLabel: Record<FlagLevel, string> = {
  normal: "Normal",
  low: "Low",
  high: "High",
  critical: "Critical",
};

export function PatientsProvider({ children }: { children: React.ReactNode }) {
  const { isDemoMode, demoActor } = useDemoMode();
  const { actor: realActor } = useActor();
  const actor = isDemoMode ? demoActor : realActor;

  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [allMedications, setAllMedications] = useState<Medication[]>([]);
  const [allLabResults, setAllLabResults] = useState<LabResult[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [allClinicalNotes, setAllClinicalNotes] = useState<ClinicalNote[]>([]);
  const [allPrescriptions, setAllPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    mrn: "",
  });

  const queryClient = useQueryClient();

  // React Query cached hooks (non-demo mode)
  const { data: patientsData, isLoading: patientsLoading } = usePatients();
  const { data: medsData, isLoading: medsLoading } = useMedications();
  const { data: labsData, isLoading: labsLoading } = useLabResults();
  const { data: apptsData, isLoading: apptsLoading } = useAppointments();
  const { data: notesData, isLoading: notesLoading } = useClinicalNotes();
  const { data: rxData, isLoading: rxLoading } = usePrescriptions();

  useEffect(() => {
    if (isDemoMode) return;
    if (patientsData) setPatients(patientsData as Patient[]);
    if (medsData) setAllMedications(medsData as Medication[]);
    if (labsData) setAllLabResults(labsData as LabResult[]);
    if (apptsData) setAllAppointments(apptsData as Appointment[]);
    if (notesData) setAllClinicalNotes(notesData as ClinicalNote[]);
    if (rxData) setAllPrescriptions(rxData as Prescription[]);
    const anyLoading =
      patientsLoading ||
      medsLoading ||
      labsLoading ||
      apptsLoading ||
      notesLoading ||
      rxLoading;
    if (!anyLoading) setLoading(false);
  }, [
    patientsData,
    medsData,
    labsData,
    apptsData,
    notesData,
    rxData,
    patientsLoading,
    medsLoading,
    labsLoading,
    apptsLoading,
    notesLoading,
    rxLoading,
    isDemoMode,
  ]);

  // Demo mode: load via actor directly
  useEffect(() => {
    if (!isDemoMode || !actor) return;
    setLoading(true);
    Promise.all([
      actor.listPatients(),
      actor.listMedications(),
      actor.listLabResults(),
      actor.listAppointments(),
      actor.listClinicalNotes(),
      actor.listPrescriptions(),
    ])
      .then(
        ([patientData, medData, labData, apptData, noteData, rxDataRaw]) => {
          setPatients(patientData as Patient[]);
          setAllMedications(medData as Medication[]);
          setAllLabResults(labData as LabResult[]);
          setAllAppointments(apptData as Appointment[]);
          setAllClinicalNotes(noteData as ClinicalNote[]);
          setAllPrescriptions(rxDataRaw as Prescription[]);
        },
      )
      .catch(() => toast.error("Failed to load patients"))
      .finally(() => setLoading(false));
  }, [actor, isDemoMode]);

  const filtered = useMemo(
    () =>
      patients.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.mrn.includes(search) ||
          p.phone.includes(search),
      ),
    [patients, search],
  );

  const duplicates = useMemo(() => detectDuplicates(patients), [patients]);

  const abnormalPatientIds = useMemo(() => {
    const ids = new Set<bigint>();
    for (const l of allLabResults) {
      const flag = getLabFlag(l.testName, l.result, l.isCritical);
      if (flag !== "normal") ids.add(l.patientId);
    }
    return ids;
  }, [allLabResults]);

  const handleAdd = async () => {
    if (!form.name.trim() || !form.mrn.trim()) {
      toast.error("Name and MRN are required");
      return;
    }
    if (form.dateOfBirth) {
      const dob = new Date(form.dateOfBirth);
      const now = new Date();
      if (
        Number.isNaN(dob.getTime()) ||
        dob > now ||
        dob.getFullYear() < 1900
      ) {
        toast.error("Please enter a valid date of birth");
        return;
      }
    }
    if (form.phone && !/^[\d\s\-\+\(\)]{7,15}$/.test(form.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!actor) return;
    setSubmitting(true);
    try {
      await actor.createPatient(
        form.name,
        form.dateOfBirth,
        form.phone,
        form.email,
        form.mrn,
      );
      toast.success("Patient registered");
      setShowForm(false);
      setForm({ name: "", dateOfBirth: "", phone: "", email: "", mrn: "" });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    } catch {
      toast.error("Failed to register patient");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm({ name: "", dateOfBirth: "", phone: "", email: "", mrn: "" });
  };

  const handleMerge = (pair: DuplicatePair) => {
    const removeId = pair.a.id < pair.b.id ? pair.b.id : pair.a.id;
    const keepId = pair.a.id < pair.b.id ? pair.a.id : pair.b.id;
    setPatients((prev) => prev.filter((p) => p.id !== removeId));
    if (selectedPatient?.id === removeId) setSelectedPatient(null);
    toast.success(
      `Records merged — kept MRN ${patients.find((p) => p.id === keepId)?.mrn}`,
    );
  };

  const handleRowClick = (
    patient: Patient,
    onSelectPatient?: (p: {
      id: bigint;
      name: string;
      mrn: string;
      dateOfBirth: string;
    }) => void,
  ) => {
    setSelectedPatient((prev) => (prev?.id === patient.id ? null : patient));
    onSelectPatient?.({
      id: patient.id,
      name: patient.name,
      mrn: patient.mrn,
      dateOfBirth: patient.dateOfBirth,
    });
  };

  return (
    <PatientsContext.Provider
      value={{
        patients,
        allMedications,
        allLabResults,
        allAppointments,
        allClinicalNotes,
        allPrescriptions,
        loading,
        submitting,
        showForm,
        setShowForm,
        selectedPatient,
        setSelectedPatient,
        form,
        setForm,
        filtered,
        duplicates,
        abnormalPatientIds,
        handleAdd,
        handleCancel,
        handleMerge,
        handleRowClick,
        search,
        setSearch,
      }}
    >
      {children}
    </PatientsContext.Provider>
  );
}
