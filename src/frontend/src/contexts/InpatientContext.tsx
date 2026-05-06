import type React from "react";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { DEMO_INPATIENT_BEDS } from "../demoData";
import { useActor } from "../hooks/useActor";
import { useDemoMode } from "../hooks/useDemoMode";

export type BedStatus = "occupied" | "available" | "reserved";

export interface BedHistoryEntry {
  date: string;
  action: "admitted" | "discharged" | "transferred";
  patientName: string;
  diagnosis?: string;
}

export type IsolationType = "Contact" | "Droplet" | "Airborne" | null;

export interface SafetyAssessment {
  morseHistory: number;
  morseSecondary: number;
  morseAid: number;
  morseIV: number;
  morseGait: number;
  morseMental: number;
  bradenSensory: number;
  bradenMoisture: number;
  bradenActivity: number;
  bradenMobility: number;
  bradenNutrition: number;
  bradenFriction: number;
  assessedDate: string;
}

export interface TransferEvent {
  timestamp: string;
  fromWard: string;
  fromBed: string;
  toWard: string;
  toBed: string;
  reason: string;
  orderingProvider: string;
}

export interface Bed {
  number: string;
  status: BedStatus;
  patientName?: string;
  admittedDate?: string;
  diagnosis?: string;
  history?: BedHistoryEntry[];
  isolation?: IsolationType;
  isolationNotes?: string;
  safetyAssessment?: SafetyAssessment;
  transferHistory?: TransferEvent[];
}

export interface RoundingNote {
  id: string;
  timestamp: string;
  provider: string;
  note: string;
}

export interface Ward {
  id: string;
  name: string;
  beds: Bed[];
}

export interface DietaryOrder {
  dietType: string;
  texture: string;
  foodAllergies: string;
  supplements: string;
}

// ── Helper functions ─────────────────────────────────────────────────
export function morseTotalScore(a: SafetyAssessment) {
  return (
    a.morseHistory +
    a.morseSecondary +
    a.morseAid +
    a.morseIV +
    a.morseGait +
    a.morseMental
  );
}
export function morseRiskLevel(score: number): {
  label: string;
  variant: "success" | "warning" | "danger";
} {
  if (score < 25) return { label: "Low Risk", variant: "success" };
  if (score < 51) return { label: "Medium Risk", variant: "warning" };
  return { label: "High Risk", variant: "danger" };
}
export function bradenTotalScore(a: SafetyAssessment) {
  return (
    a.bradenSensory +
    a.bradenMoisture +
    a.bradenActivity +
    a.bradenMobility +
    a.bradenNutrition +
    a.bradenFriction
  );
}
export function bradenRiskLevel(score: number): {
  label: string;
  variant: "success" | "warning" | "danger";
} {
  if (score <= 9) return { label: "Very High Risk", variant: "danger" };
  if (score <= 12) return { label: "High Risk", variant: "danger" };
  if (score <= 14) return { label: "Moderate Risk", variant: "warning" };
  return { label: "Low Risk", variant: "success" };
}

export const ISOLATION_BADGE: Record<
  NonNullable<IsolationType>,
  { label: string; color: string }
> = {
  Contact: {
    label: "C",
    color: "bg-warning/15 text-warning border-warning/30",
  },
  Droplet: {
    label: "D",
    color: "bg-primary/10 text-primary border-primary/20",
  },
  Airborne: {
    label: "A",
    color: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function bedStatusVariant(s: BedStatus): "success" | "warning" | "info" {
  if (s === "available") return "success";
  if (s === "reserved") return "warning";
  return "info";
}

export function historyActionVariant(
  a: BedHistoryEntry["action"],
): "info" | "success" | "warning" {
  if (a === "admitted") return "info";
  if (a === "discharged") return "success";
  return "warning";
}

// ── Context ───────────────────────────────────────────────────────────────
interface InpatientContextValue {
  wards: Ward[];
  setWards: React.Dispatch<React.SetStateAction<Ward[]>>;
  admitForm: { wardId: string; name: string; diagnosis: string } | null;
  setAdmitForm: React.Dispatch<
    React.SetStateAction<{
      wardId: string;
      name: string;
      diagnosis: string;
    } | null>
  >;
  dischargeConfirm: { wardId: string; bedNumber: string } | null;
  setDischargeConfirm: React.Dispatch<
    React.SetStateAction<{ wardId: string; bedNumber: string } | null>
  >;
  expandedHistory: Set<string>;
  expandedTransferHistory: Set<string>;
  expandedRounding: Set<string>;
  roundingNotes: Record<string, RoundingNote[]>;
  roundingFormKey: string | null;
  setRoundingFormKey: React.Dispatch<React.SetStateAction<string | null>>;
  roundingFormText: string;
  setRoundingFormText: React.Dispatch<React.SetStateAction<string>>;
  transferForm: {
    wardId: string;
    bedNumber: string;
    destWardId: string;
    destBedNumber: string;
  } | null;
  setTransferForm: React.Dispatch<
    React.SetStateAction<{
      wardId: string;
      bedNumber: string;
      destWardId: string;
      destBedNumber: string;
    } | null>
  >;
  dietaryOrders: Record<string, DietaryOrder>;
  editingDiet: string | null;
  setEditingDiet: React.Dispatch<React.SetStateAction<string | null>>;
  dischargeChecklists: Record<string, Record<string, boolean>>;
  setDischargeChecklists: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, boolean>>>
  >;
  expandedChecklist: Set<string>;
  setExpandedChecklist: React.Dispatch<React.SetStateAction<Set<string>>>;
  globalAdmitOpen: boolean;
  setGlobalAdmitOpen: React.Dispatch<React.SetStateAction<boolean>>;
  globalAdmitForm: {
    patientName: string;
    age: string;
    diagnosis: string;
    wardId: string;
    bedNumber: string;
    attendingPhysician: string;
  };
  setGlobalAdmitForm: React.Dispatch<
    React.SetStateAction<{
      patientName: string;
      age: string;
      diagnosis: string;
      wardId: string;
      bedNumber: string;
      attendingPhysician: string;
    }>
  >;
  dietForm: DietaryOrder;
  setDietForm: React.Dispatch<React.SetStateAction<DietaryOrder>>;
  toggleHistory: (wardId: string, bedNumber: string) => void;
  toggleTransferHistory: (wardId: string, bedNum: string) => void;
  toggleRounding: (wardId: string, bedNum: string) => void;
  handleAdmit: () => void;
  handleDischarge: () => void;
  handleTransfer: () => void;
  handleGlobalAdmit: () => void;
  handleAddRoundingNote: (wardId: string, bedNum: string) => void;
  saveDietaryOrder: (key: string, order: DietaryOrder) => void;
}

const InpatientContext = createContext<InpatientContextValue | null>(null);

export function useInpatientContext() {
  const ctx = useContext(InpatientContext);
  if (!ctx)
    throw new Error(
      "useInpatientContext must be used within InpatientProvider",
    );
  return ctx;
}

const INITIAL_WARDS: Ward[] = [
  {
    id: "icu",
    name: "ICU",
    beds: [
      {
        number: "ICU-01",
        status: "occupied",
        patientName: "James Harrington",
        admittedDate: "Mar 10",
        diagnosis: "Post-operative cardiac",
        isolation: "Contact",
        isolationNotes: "MRSA wound infection — contact precautions",
        safetyAssessment: {
          morseHistory: 25,
          morseSecondary: 15,
          morseAid: 0,
          morseIV: 20,
          morseGait: 10,
          morseMental: 15,
          bradenSensory: 2,
          bradenMoisture: 3,
          bradenActivity: 1,
          bradenMobility: 2,
          bradenNutrition: 3,
          bradenFriction: 2,
          assessedDate: "2026-03-13",
        },
        history: [
          {
            date: "Mar 10",
            action: "admitted",
            patientName: "James Harrington",
            diagnosis: "Post-operative cardiac",
          },
        ],
      },
      {
        number: "ICU-02",
        status: "occupied",
        patientName: "Maria Gonzalez",
        admittedDate: "Mar 11",
        diagnosis: "Respiratory failure",
        isolation: "Airborne",
        isolationNotes: "Rule out TB — pending cultures",
        safetyAssessment: {
          morseHistory: 0,
          morseSecondary: 15,
          morseAid: 15,
          morseIV: 20,
          morseGait: 20,
          morseMental: 15,
          bradenSensory: 3,
          bradenMoisture: 2,
          bradenActivity: 1,
          bradenMobility: 2,
          bradenNutrition: 2,
          bradenFriction: 1,
          assessedDate: "2026-03-13",
        },
        history: [
          {
            date: "Mar 11",
            action: "admitted",
            patientName: "Maria Gonzalez",
            diagnosis: "Respiratory failure",
          },
        ],
      },
      { number: "ICU-03", status: "available" },
      { number: "ICU-04", status: "reserved" },
      {
        number: "ICU-05",
        status: "occupied",
        patientName: "Robert Chen",
        admittedDate: "Mar 12",
        diagnosis: "Septic shock",
        history: [
          {
            date: "Mar 12",
            action: "admitted",
            patientName: "Robert Chen",
            diagnosis: "Septic shock",
          },
        ],
      },
      { number: "ICU-06", status: "available" },
    ],
  },
  {
    id: "general",
    name: "General Medicine",
    beds: [
      {
        number: "GEN-01",
        status: "occupied",
        patientName: "Eleanor Voss",
        admittedDate: "Mar 08",
        diagnosis: "Pneumonia",
        history: [
          {
            date: "Mar 08",
            action: "admitted",
            patientName: "Eleanor Voss",
            diagnosis: "Pneumonia",
          },
        ],
      },
      {
        number: "GEN-02",
        status: "occupied",
        patientName: "Michael Torres",
        admittedDate: "Mar 09",
        diagnosis: "COPD exacerbation",
        history: [
          {
            date: "Mar 09",
            action: "admitted",
            patientName: "Michael Torres",
            diagnosis: "COPD exacerbation",
          },
        ],
      },
      { number: "GEN-03", status: "available" },
      {
        number: "GEN-04",
        status: "occupied",
        patientName: "Sandra Kim",
        admittedDate: "Mar 10",
        diagnosis: "Cellulitis",
        history: [
          {
            date: "Mar 10",
            action: "admitted",
            patientName: "Sandra Kim",
            diagnosis: "Cellulitis",
          },
        ],
      },
      { number: "GEN-05", status: "available" },
      { number: "GEN-06", status: "reserved" },
      {
        number: "GEN-07",
        status: "occupied",
        patientName: "Frank Nguyen",
        admittedDate: "Mar 11",
        diagnosis: "Heart failure exacerbation",
        history: [
          {
            date: "Mar 11",
            action: "admitted",
            patientName: "Frank Nguyen",
            diagnosis: "Heart failure exacerbation",
          },
        ],
      },
      { number: "GEN-08", status: "available" },
    ],
  },
  {
    id: "surgical",
    name: "Surgical",
    beds: [
      {
        number: "SUR-11",
        status: "occupied",
        patientName: "Raymond Cho",
        admittedDate: "Mar 11",
        diagnosis: "Knee arthroscopy",
        history: [
          {
            date: "Mar 11",
            action: "admitted",
            patientName: "Raymond Cho",
            diagnosis: "Knee arthroscopy",
          },
        ],
      },
      { number: "SUR-12", status: "reserved" },
      { number: "SUR-13", status: "available" },
      {
        number: "SUR-14",
        status: "occupied",
        patientName: "Evelyn Carter",
        admittedDate: "Mar 12",
        diagnosis: "Thyroidectomy",
        history: [
          {
            date: "Mar 12",
            action: "admitted",
            patientName: "Evelyn Carter",
            diagnosis: "Thyroidectomy",
          },
        ],
      },
      { number: "SUR-15", status: "available" },
    ],
  },
  {
    id: "pediatric",
    name: "Pediatric",
    beds: [
      {
        number: "PED-01",
        status: "occupied",
        patientName: "Emma Wilson (8y)",
        admittedDate: "Mar 11",
        diagnosis: "Asthma exacerbation",
        history: [
          {
            date: "Mar 11",
            action: "admitted",
            patientName: "Emma Wilson (8y)",
            diagnosis: "Asthma exacerbation",
          },
        ],
      },
      {
        number: "PED-02",
        status: "occupied",
        patientName: "Liam Brown (4y)",
        admittedDate: "Mar 12",
        diagnosis: "Febrile seizure",
        history: [
          {
            date: "Mar 12",
            action: "admitted",
            patientName: "Liam Brown (4y)",
            diagnosis: "Febrile seizure",
          },
        ],
      },
      { number: "PED-03", status: "available" },
      {
        number: "PED-04",
        status: "occupied",
        patientName: "Sofia Martinez (12y)",
        admittedDate: "Mar 10",
        diagnosis: "Appendicitis",
        history: [
          {
            date: "Mar 10",
            action: "admitted",
            patientName: "Sofia Martinez (12y)",
            diagnosis: "Appendicitis",
          },
        ],
      },
      { number: "PED-05", status: "available" },
      { number: "PED-06", status: "reserved" },
      {
        number: "PED-07",
        status: "occupied",
        patientName: "Noah Davis (6y)",
        admittedDate: "Mar 13",
        diagnosis: "RSV bronchiolitis",
        history: [
          {
            date: "Mar 13",
            action: "admitted",
            patientName: "Noah Davis (6y)",
            diagnosis: "RSV bronchiolitis",
          },
        ],
      },
    ],
  },
  {
    id: "emergency",
    name: "Emergency",
    beds: [
      {
        number: "ER-01",
        status: "occupied",
        patientName: "Unknown (Trauma)",
        admittedDate: "Mar 13",
        diagnosis: "MVA injuries",
        history: [
          {
            date: "Mar 13",
            action: "admitted",
            patientName: "Unknown (Trauma)",
            diagnosis: "MVA injuries",
          },
        ],
      },
      {
        number: "ER-02",
        status: "occupied",
        patientName: "Marcus Hill",
        admittedDate: "Mar 13",
        diagnosis: "Acute MI",
        history: [
          {
            date: "Mar 13",
            action: "admitted",
            patientName: "Marcus Hill",
            diagnosis: "Acute MI",
          },
        ],
      },
      { number: "ER-03", status: "available" },
      { number: "ER-04", status: "available" },
    ],
  },
];

const INITIAL_ROUNDING_NOTES: Record<string, RoundingNote[]> = {
  "icu:ICU-01": [
    {
      id: "r1",
      timestamp: "Mar 16, 07:30",
      provider: "Dr. Sarah Chen",
      note: "Patient stable post-op. BP 118/76, HR 72. Wound site clean. Plan to reduce vasopressor support today.",
    },
    {
      id: "r2",
      timestamp: "Mar 15, 19:00",
      provider: "Dr. Marcus Williams",
      note: "Evening rounds. Patient alert and oriented x3. Pain 3/10. Continue current management.",
    },
  ],
  "icu:ICU-02": [
    {
      id: "r3",
      timestamp: "Mar 16, 08:00",
      provider: "Dr. James Rodriguez",
      note: "Respiratory status improved. FiO2 weaned to 0.4. Plan for possible extubation tomorrow.",
    },
  ],
  "general:GEN-01": [
    {
      id: "r4",
      timestamp: "Mar 16, 09:00",
      provider: "NP Maria Santos",
      note: "Ambulating with assist x2. Diet advanced to soft. Social work consult placed for discharge planning.",
    },
  ],
};

export function InpatientProvider({ children }: { children: React.ReactNode }) {
  const { actor: realActor } = useActor();
  const { isDemoMode, demoActor } = useDemoMode();
  const actor = isDemoMode ? demoActor : realActor;

  const [wards, setWards] = useState<Ward[]>(() => {
    if (isDemoMode) {
      const wardMap: Record<string, Ward> = {
        icu: { id: "icu", name: "ICU", beds: [] },
        general: { id: "general", name: "General Medicine", beds: [] },
        surgical: { id: "surgical", name: "Surgical", beds: [] },
        pediatric: { id: "pediatric", name: "Pediatric", beds: [] },
        emergency: { id: "emergency", name: "Emergency", beds: [] },
      };
      for (const bed of DEMO_INPATIENT_BEDS) {
        if (wardMap[bed.wardId]) {
          wardMap[bed.wardId].beds.push({
            number: bed.number,
            status: bed.status,
            patientName: bed.patientName,
            admittedDate: bed.admittedDate,
            diagnosis: bed.diagnosis,
            history: [],
          });
        }
      }
      const result = Object.values(wardMap).filter((w) => w.beds.length > 0);
      return result.length > 0 ? result : INITIAL_WARDS;
    }
    return INITIAL_WARDS;
  });

  const [admitForm, setAdmitForm] = useState<{
    wardId: string;
    name: string;
    diagnosis: string;
  } | null>(null);
  const [dischargeConfirm, setDischargeConfirm] = useState<{
    wardId: string;
    bedNumber: string;
  } | null>(null);
  const [expandedHistory, setExpandedHistory] = useState<Set<string>>(
    new Set(),
  );
  const [expandedTransferHistory, setExpandedTransferHistory] = useState<
    Set<string>
  >(new Set());
  const [expandedRounding, setExpandedRounding] = useState<Set<string>>(
    new Set(),
  );
  const [roundingNotes, setRoundingNotes] = useState<
    Record<string, RoundingNote[]>
  >(INITIAL_ROUNDING_NOTES);
  const [roundingFormKey, setRoundingFormKey] = useState<string | null>(null);
  const [roundingFormText, setRoundingFormText] = useState("");
  const [transferForm, setTransferForm] = useState<{
    wardId: string;
    bedNumber: string;
    destWardId: string;
    destBedNumber: string;
  } | null>(null);
  const [dietaryOrders, setDietaryOrders] = useState<
    Record<string, DietaryOrder>
  >({});
  const [editingDiet, setEditingDiet] = useState<string | null>(null);
  const [dischargeChecklists, setDischargeChecklists] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [expandedChecklist, setExpandedChecklist] = useState<Set<string>>(
    new Set(),
  );
  const [globalAdmitOpen, setGlobalAdmitOpen] = useState(false);
  const [globalAdmitForm, setGlobalAdmitForm] = useState({
    patientName: "",
    age: "",
    diagnosis: "",
    wardId: "",
    bedNumber: "",
    attendingPhysician: "",
  });
  const [dietForm, setDietForm] = useState<DietaryOrder>({
    dietType: "Regular",
    texture: "Regular",
    foodAllergies: "",
    supplements: "",
  });

  const toggleHistory = (wardId: string, bedNumber: string) => {
    const key = `${wardId}:${bedNumber}`;
    setExpandedHistory((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleTransferHistory = (wardId: string, bedNum: string) => {
    const key = `${wardId}:${bedNum}`;
    setExpandedTransferHistory((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleRounding = (wardId: string, bedNum: string) => {
    const key = `${wardId}:${bedNum}`;
    setExpandedRounding((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleAddRoundingNote = (wardId: string, bedNum: string) => {
    if (!roundingFormText.trim()) return;
    const key = `${wardId}:${bedNum}`;
    const newNote: RoundingNote = {
      id: `rn-${Date.now()}`,
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      provider: "Dr. Sarah Chen",
      note: roundingFormText.trim(),
    };
    setRoundingNotes((prev) => ({
      ...prev,
      [key]: [newNote, ...(prev[key] ?? [])],
    }));
    setRoundingFormText("");
    setRoundingFormKey(null);
  };

  const handleAdmit = () => {
    if (!admitForm || !admitForm.name.trim()) return;
    setWards((prev) =>
      prev.map((w) => {
        if (w.id !== admitForm.wardId) return w;
        const firstAvail = w.beds.findIndex((b) => b.status === "available");
        if (firstAvail === -1) return w;
        const newBeds = [...w.beds];
        const entry: BedHistoryEntry = {
          date: "Mar 13",
          action: "admitted",
          patientName: admitForm.name,
          diagnosis: admitForm.diagnosis || "Pending assessment",
        };
        newBeds[firstAvail] = {
          ...newBeds[firstAvail],
          status: "occupied",
          patientName: admitForm.name,
          admittedDate: "Mar 13",
          diagnosis: admitForm.diagnosis || "Pending assessment",
          history: [...(newBeds[firstAvail].history ?? []), entry],
        };
        return { ...w, beds: newBeds };
      }),
    );
    setAdmitForm(null);
    if (actor && admitForm) {
      actor
        .createClinicalNote(
          1n,
          "inpatient-admission",
          JSON.stringify({
            ward: admitForm.wardId,
            patientName: admitForm.name,
            diagnosis: admitForm.diagnosis,
            date: new Date().toISOString(),
          }),
          0n,
        )
        .catch(() => {});
    }
  };

  const handleDischarge = () => {
    if (!dischargeConfirm) return;
    setWards((prev) =>
      prev.map((w) => {
        if (w.id !== dischargeConfirm.wardId) return w;
        return {
          ...w,
          beds: w.beds.map((b) => {
            if (b.number !== dischargeConfirm.bedNumber) return b;
            const entry: BedHistoryEntry = {
              date: "Mar 13",
              action: "discharged",
              patientName: b.patientName ?? "Unknown",
              diagnosis: b.diagnosis,
            };
            return {
              number: b.number,
              status: "available" as const,
              history: [...(b.history ?? []), entry],
            };
          }),
        };
      }),
    );
    if (actor && dischargeConfirm) {
      actor
        .createClinicalNote(
          1n,
          "inpatient-discharge",
          JSON.stringify({
            ward: dischargeConfirm.wardId,
            bed: dischargeConfirm.bedNumber,
            date: new Date().toISOString(),
          }),
          0n,
        )
        .catch(() => {});
    }
    setDischargeConfirm(null);
  };

  const handleTransfer = () => {
    if (
      !transferForm ||
      !transferForm.destWardId ||
      !transferForm.destBedNumber
    )
      return;
    const { wardId, bedNumber, destWardId, destBedNumber } = transferForm;
    setWards((prev) => {
      const srcWard = prev.find((w) => w.id === wardId);
      const srcBed = srcWard?.beds.find((b) => b.number === bedNumber);
      if (!srcBed) return prev;
      return prev.map((w) => {
        if (w.id === wardId) {
          return {
            ...w,
            beds: w.beds.map((b) => {
              if (b.number !== bedNumber) return b;
              return {
                number: b.number,
                status: "available" as const,
                history: [
                  ...(b.history ?? []),
                  {
                    date: "Mar 13",
                    action: "transferred" as const,
                    patientName: b.patientName ?? "Unknown",
                    diagnosis: `Transferred to ${destBedNumber}`,
                  },
                ],
              };
            }),
          };
        }
        if (w.id === destWardId) {
          return {
            ...w,
            beds: w.beds.map((b) => {
              if (b.number !== destBedNumber) return b;
              return {
                ...b,
                status: "occupied" as const,
                patientName: srcBed.patientName,
                admittedDate: srcBed.admittedDate,
                diagnosis: srcBed.diagnosis,
                history: [
                  ...(b.history ?? []),
                  {
                    date: "Mar 13",
                    action: "transferred" as const,
                    patientName: srcBed.patientName ?? "Unknown",
                    diagnosis: `Transferred from ${bedNumber}`,
                  },
                ],
              };
            }),
          };
        }
        return w;
      });
    });
    toast.success(`Patient transferred to ${destBedNumber}`);
    setTransferForm(null);
    if (actor) {
      actor
        .createClinicalNote(
          1n,
          "inpatient-transfer",
          JSON.stringify({ transferForm, date: new Date().toISOString() }),
          0n,
        )
        .catch(() => {});
    }
  };

  const handleGlobalAdmit = () => {
    if (
      !globalAdmitForm.patientName ||
      !globalAdmitForm.wardId ||
      !globalAdmitForm.bedNumber
    ) {
      toast.error("Patient name, ward, and bed are required.");
      return;
    }
    setWards((prev) =>
      prev.map((w) => {
        if (w.id !== globalAdmitForm.wardId) return w;
        return {
          ...w,
          beds: w.beds.map((b) => {
            if (b.number !== globalAdmitForm.bedNumber) return b;
            return {
              ...b,
              status: "occupied" as const,
              patientName: globalAdmitForm.patientName,
              diagnosis: globalAdmitForm.diagnosis,
              admittedDate: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              history: [
                ...(b.history ?? []),
                {
                  date: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  }),
                  action: "admitted" as const,
                  patientName: globalAdmitForm.patientName,
                  diagnosis: globalAdmitForm.diagnosis,
                },
              ],
            };
          }),
        };
      }),
    );
    toast.success(
      `${globalAdmitForm.patientName} admitted to ${globalAdmitForm.bedNumber}`,
    );
    setGlobalAdmitOpen(false);
    setGlobalAdmitForm({
      patientName: "",
      age: "",
      diagnosis: "",
      wardId: "",
      bedNumber: "",
      attendingPhysician: "",
    });
  };

  const saveDietaryOrder = (key: string, order: DietaryOrder) => {
    setDietaryOrders((prev) => ({ ...prev, [key]: { ...order } }));
    setEditingDiet(null);
  };

  return (
    <InpatientContext.Provider
      value={{
        wards,
        setWards,
        admitForm,
        setAdmitForm,
        dischargeConfirm,
        setDischargeConfirm,
        expandedHistory,
        expandedTransferHistory,
        expandedRounding,
        roundingNotes,
        roundingFormKey,
        setRoundingFormKey,
        roundingFormText,
        setRoundingFormText,
        transferForm,
        setTransferForm,
        dietaryOrders,
        editingDiet,
        setEditingDiet,
        dischargeChecklists,
        setDischargeChecklists,
        expandedChecklist,
        setExpandedChecklist,
        globalAdmitOpen,
        setGlobalAdmitOpen,
        globalAdmitForm,
        setGlobalAdmitForm,
        dietForm,
        setDietForm,
        toggleHistory,
        toggleTransferHistory,
        toggleRounding,
        handleAddRoundingNote,
        handleAdmit,
        handleDischarge,
        handleTransfer,
        handleGlobalAdmit,
        saveDietaryOrder,
      }}
    >
      {children}
    </InpatientContext.Provider>
  );
}
