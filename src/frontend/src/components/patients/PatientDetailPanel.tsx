import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Calendar,
  ClipboardList,
  FlaskConical,
  Pill,
  Plus,
  ShieldAlert,
  Stethoscope,
  X,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import {
  type Appointment,
  type ClinicalNote,
  type FlagLevel,
  type LabResult,
  type Medication,
  type Patient,
  type Prescription,
  flagLabel,
  flagVariant,
  getLabFlag,
} from "../../contexts/PatientsContext";
import { StatusBadge } from "../StatusBadge";
import { ConsentsTab } from "./ConsentsTab";

// ── Care Gaps ─────────────────────────────────────────────────────────────
interface CareGap {
  screening: string;
  recommendedFor: string;
  lastCompleted: string | null;
  dueDate: string;
  status: "overdue" | "due-soon" | "up-to-date";
}

export function computeCareGaps(patient: Patient): CareGap[] {
  const dob = new Date(patient.dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  if (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate())) age--;
  const isFemale =
    patient.name.match(
      /^(Eleanor|Linda|Diana|Natalie|Amanda|Lisa|Sarah|Rebecca)/i,
    ) !== null;

  const gaps: CareGap[] = [];
  gaps.push({
    screening: "Flu Vaccine",
    recommendedFor: "All adults, annually",
    lastCompleted: null,
    dueDate: "2025-10-01",
    status: "overdue",
  });
  gaps.push({
    screening: "Blood Pressure Check",
    recommendedFor: "All adults, annually",
    lastCompleted: "2025-09-15",
    dueDate: "2026-09-15",
    status: "up-to-date",
  });
  if (isFemale && age >= 40)
    gaps.push({
      screening: "Mammogram",
      recommendedFor: "Women 40+, annually",
      lastCompleted: "2024-11-20",
      dueDate: "2025-11-20",
      status: "overdue",
    });
  if (isFemale && age >= 21)
    gaps.push({
      screening: "Pap Smear",
      recommendedFor: "Women 21+, every 3 years",
      lastCompleted: "2024-06-01",
      dueDate: "2027-06-01",
      status: "up-to-date",
    });
  if (age >= 50)
    gaps.push({
      screening: "Colonoscopy",
      recommendedFor: "Adults 50+, every 10 years",
      lastCompleted: null,
      dueDate: "2024-01-01",
      status: "overdue",
    });
  gaps.push({
    screening: "HbA1c",
    recommendedFor: "Diabetic patients, every 6 months",
    lastCompleted: "2025-12-01",
    dueDate: "2026-06-01",
    status: age > 45 ? "due-soon" : "up-to-date",
  });
  return gaps;
}

export function getCareGapOverdueNames(patient: Patient): string[] {
  return computeCareGaps(patient)
    .filter((g) => g.status === "overdue")
    .map((g) => g.screening);
}

// ── Shared ─────────────────────────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  count,
}: { icon: React.ElementType; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-primary" />
      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h4>
      {count !== undefined && (
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {count} item{count !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}

function EmptySection({ message }: { message: string }) {
  return <p className="text-xs text-muted-foreground italic py-2">{message}</p>;
}

// ── Chart Summary Tab ─────────────────────────────────────────────────────
function ChartSummaryTab({
  patient,
  medications,
  labResults,
  appointments,
  clinicalNotes,
  prescriptions,
}: {
  patient: Patient;
  medications: Medication[];
  labResults: LabResult[];
  appointments: Appointment[];
  clinicalNotes: ClinicalNote[];
  prescriptions: Prescription[];
}) {
  const activeMeds = medications.filter(
    (m) => m.patientId === patient.id && m.status === "active",
  );
  const abnormalLabs = labResults.filter(
    (l) =>
      l.patientId === patient.id &&
      getLabFlag(l.testName, l.result, l.isCritical) !== "normal",
  );
  const today = new Date().toISOString().slice(0, 10);
  const upcomingAppts = appointments
    .filter(
      (a) =>
        a.patientId === patient.id &&
        a.date >= today &&
        a.status === "scheduled",
    )
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);
  const recentNotes = clinicalNotes
    .filter((n) => n.patientId === patient.id)
    .slice(-3)
    .reverse();
  const pendingPrescriptions = prescriptions.filter(
    (p) =>
      p.patientId === patient.id &&
      (p.status === "pending" || p.status === "dispensing"),
  );
  const overdueGaps = computeCareGaps(patient).filter(
    (g) => g.status === "overdue",
  );
  const [gapBannerDismissed, setGapBannerDismissed] = React.useState(false);

  return (
    <div className="space-y-4">
      {overdueGaps.length > 0 && !gapBannerDismissed && (
        <div
          className="flex items-start justify-between gap-3 px-4 py-3 border border-warning/30 bg-warning/10 rounded-sm"
          data-ocid="chart.caregap.panel"
        >
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-warning flex-shrink-0 mt-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {overdueGaps.length} Overdue Screening
                {overdueGaps.length !== 1 ? "s" : ""} Due
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {overdueGaps.map((g) => g.screening).join(" · ")}
              </p>
            </div>
          </div>
          <button
            type="button"
            data-ocid="chart.caregap.close_button"
            onClick={() => setGapBannerDismissed(true)}
            className="text-warning hover:text-warning/80 flex-shrink-0 transition-colors"
            aria-label="Dismiss"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pt-1"
        data-ocid="chart.summary.panel"
      >
        <div className="bg-muted/30 border border-border p-4">
          <SectionHeader
            icon={Pill}
            title="Active Medications"
            count={activeMeds.length}
          />
          {activeMeds.length === 0 ? (
            <EmptySection message="No active medications on record" />
          ) : (
            <ul className="space-y-2">
              {activeMeds.slice(0, 5).map((m, i) => (
                <li
                  key={String(m.id)}
                  data-ocid={`chart.medication.item.${i + 1}`}
                  className="flex items-start justify-between gap-2"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">
                      {m.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {m.dose} · {m.frequency}
                    </p>
                  </div>
                  <StatusBadge variant="success" label="Active" />
                </li>
              ))}
              {activeMeds.length > 5 && (
                <p className="text-xs text-muted-foreground">
                  +{activeMeds.length - 5} more
                </p>
              )}
            </ul>
          )}
        </div>
        <div className="bg-muted/30 border border-border p-4">
          <SectionHeader
            icon={FlaskConical}
            title="Abnormal Lab Flags"
            count={abnormalLabs.length}
          />
          {abnormalLabs.length === 0 ? (
            <EmptySection message="All results within normal range" />
          ) : (
            <ul className="space-y-2">
              {abnormalLabs.slice(0, 5).map((l, i) => {
                const flag = getLabFlag(l.testName, l.result, l.isCritical);
                return (
                  <li
                    key={String(l.id)}
                    data-ocid={`chart.lab.item.${i + 1}`}
                    className="flex items-start justify-between gap-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground leading-tight">
                        {l.testName}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {l.result} {l.unit}
                      </p>
                    </div>
                    <StatusBadge
                      variant={flagVariant[flag as FlagLevel]}
                      label={flagLabel[flag as FlagLevel]}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="bg-muted/30 border border-border p-4">
          <SectionHeader
            icon={Calendar}
            title="Upcoming Appointments"
            count={upcomingAppts.length}
          />
          {upcomingAppts.length === 0 ? (
            <EmptySection message="No upcoming appointments scheduled" />
          ) : (
            <ul className="space-y-2">
              {upcomingAppts.map((a, i) => {
                const date = a.date.slice(0, 10);
                const time = a.date.includes("T")
                  ? a.date.split("T")[1].substring(0, 5)
                  : null;
                return (
                  <li
                    key={String(a.id)}
                    data-ocid={`chart.appointment.item.${i + 1}`}
                    className="flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {date}
                      </p>
                      {time && (
                        <p className="text-xs text-muted-foreground font-mono">
                          {time}
                        </p>
                      )}
                    </div>
                    <StatusBadge variant="info" label={a.status} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="bg-muted/30 border border-border p-4">
          <SectionHeader
            icon={ClipboardList}
            title="Recent Clinical Notes"
            count={recentNotes.length}
          />
          {recentNotes.length === 0 ? (
            <EmptySection message="No clinical notes on record" />
          ) : (
            <ul className="space-y-2">
              {recentNotes.map((n, i) => (
                <li
                  key={String(n.id)}
                  data-ocid={`chart.note.item.${i + 1}`}
                  className="border-l-2 border-primary/30 pl-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {n.noteType}
                  </p>
                  <p className="text-sm text-foreground line-clamp-2 mt-0.5">
                    {n.content}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-muted/30 border border-border p-4">
          <SectionHeader
            icon={Stethoscope}
            title="Pending Prescriptions"
            count={pendingPrescriptions.length}
          />
          {pendingPrescriptions.length === 0 ? (
            <EmptySection message="No pending prescriptions" />
          ) : (
            <ul className="space-y-2">
              {pendingPrescriptions.map((p, i) => (
                <li
                  key={String(p.id)}
                  data-ocid={`chart.prescription.item.${i + 1}`}
                  className="flex items-start justify-between gap-2"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">
                      {p.medication}
                    </p>
                    <p className="text-xs text-muted-foreground">{p.dose}</p>
                  </div>
                  <StatusBadge variant="warning" label={p.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Care Gaps Tab ─────────────────────────────────────────────────────────
function CareGapsTab({ patient }: { patient: Patient }) {
  const gaps = computeCareGaps(patient);
  const gapStatusVariant = (
    s: CareGap["status"],
  ): "danger" | "warning" | "success" => {
    if (s === "overdue") return "danger";
    if (s === "due-soon") return "warning";
    return "success";
  };
  const gapStatusLabel = (s: CareGap["status"]) => {
    if (s === "overdue") return "Overdue";
    if (s === "due-soon") return "Due Soon";
    return "Up to Date";
  };
  return (
    <div data-ocid="patients.caregaps.panel">
      <div className="border border-border rounded-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Screening
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Recommended For
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Last Completed
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Due Date
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Status
              </TableHead>
              <TableHead className="px-4 py-2.5" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {gaps.map((g, i) => (
              <TableRow
                key={g.screening}
                data-ocid={`patients.caregap.row.${i + 1}`}
                className="hover:bg-muted/30 even:bg-muted/20"
              >
                <TableCell className="font-medium text-sm px-4 py-2.5">
                  {g.screening}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground px-4 py-2.5">
                  {g.recommendedFor}
                </TableCell>
                <TableCell className="text-sm px-4 py-2.5">
                  {g.lastCompleted ?? (
                    <span className="text-muted-foreground italic">Never</span>
                  )}
                </TableCell>
                <TableCell className="text-sm px-4 py-2.5 font-mono">
                  {g.dueDate}
                </TableCell>
                <TableCell className="px-4 py-2.5">
                  <StatusBadge
                    variant={gapStatusVariant(g.status)}
                    label={gapStatusLabel(g.status)}
                  />
                </TableCell>
                <TableCell className="px-4 py-2.5">
                  {g.status === "overdue" && (
                    <button
                      type="button"
                      data-ocid={`patients.caregap.schedule.button.${i + 1}`}
                      className="text-xs font-semibold px-2 py-1 rounded-sm border transition-colors hover:bg-muted/40"
                      style={{
                        color: "var(--primary)",
                        borderColor: "var(--border)",
                      }}
                    >
                      Schedule
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Problem List Tab ──────────────────────────────────────────────────────
interface Problem {
  id: number;
  name: string;
  icd10: string;
  onset: string;
  severity: "Mild" | "Moderate" | "Severe";
  status: "Active" | "Resolved";
}

const SEED_PROBLEMS: Record<string, Problem[]> = {
  "1": [
    {
      id: 1,
      name: "Type 2 Diabetes Mellitus",
      icd10: "E11.9",
      onset: "2018-04-12",
      severity: "Moderate",
      status: "Active",
    },
    {
      id: 2,
      name: "Hypertension, Essential",
      icd10: "I10",
      onset: "2016-08-01",
      severity: "Mild",
      status: "Active",
    },
    {
      id: 3,
      name: "Obesity, Class I",
      icd10: "E66.9",
      onset: "2019-01-15",
      severity: "Mild",
      status: "Active",
    },
  ],
  "2": [
    {
      id: 1,
      name: "Congestive Heart Failure, Systolic",
      icd10: "I50.20",
      onset: "2021-06-22",
      severity: "Severe",
      status: "Active",
    },
    {
      id: 2,
      name: "Hypokalemia",
      icd10: "E87.6",
      onset: "2026-01-10",
      severity: "Moderate",
      status: "Active",
    },
    {
      id: 3,
      name: "Type 2 Diabetes Mellitus",
      icd10: "E11.9",
      onset: "2015-03-05",
      severity: "Moderate",
      status: "Active",
    },
  ],
  "3": [
    {
      id: 1,
      name: "Hypothyroidism",
      icd10: "E03.9",
      onset: "2020-09-18",
      severity: "Mild",
      status: "Active",
    },
    {
      id: 2,
      name: "Iron Deficiency Anemia",
      icd10: "D50.9",
      onset: "2022-11-30",
      severity: "Mild",
      status: "Resolved",
    },
  ],
  "4": [
    {
      id: 1,
      name: "Dyslipidemia",
      icd10: "E78.5",
      onset: "2019-07-20",
      severity: "Moderate",
      status: "Active",
    },
    {
      id: 2,
      name: "Hypertension, Essential",
      icd10: "I10",
      onset: "2020-02-14",
      severity: "Mild",
      status: "Active",
    },
    {
      id: 3,
      name: "Obesity, Class I",
      icd10: "E66.9",
      onset: "2021-05-01",
      severity: "Mild",
      status: "Active",
    },
  ],
  "5": [
    {
      id: 1,
      name: "Seasonal Allergic Rhinitis",
      icd10: "J30.1",
      onset: "2015-04-10",
      severity: "Mild",
      status: "Active",
    },
    {
      id: 2,
      name: "Asthma, Mild Intermittent",
      icd10: "J45.20",
      onset: "2016-09-25",
      severity: "Mild",
      status: "Active",
    },
  ],
};

function ProblemListTab({ patient }: { patient: Patient }) {
  const patientKey = String(Number(patient.id));
  const [problems, setProblems] = React.useState<Problem[]>(
    () => SEED_PROBLEMS[patientKey] ?? [],
  );
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newProblem, setNewProblem] = React.useState({
    name: "",
    icd10: "",
    onset: new Date().toISOString().slice(0, 10),
    severity: "Mild" as Problem["severity"],
    status: "Active" as Problem["status"],
  });

  const handleMarkResolved = (id: number) =>
    setProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Resolved" } : p)),
    );

  const handleAddProblem = () => {
    if (!newProblem.name.trim()) return;
    setProblems((prev) => [...prev, { ...newProblem, id: Date.now() }]);
    setNewProblem({
      name: "",
      icd10: "",
      onset: new Date().toISOString().slice(0, 10),
      severity: "Mild",
      status: "Active",
    });
    setShowAddForm(false);
    toast.success("Problem added to problem list");
  };

  const active = problems.filter((p) => p.status === "Active");
  const resolved = problems.filter((p) => p.status === "Resolved");
  const severityVariant = (
    s: Problem["severity"],
  ): "success" | "warning" | "danger" =>
    s === "Mild" ? "success" : s === "Moderate" ? "warning" : "danger";

  return (
    <div className="space-y-4" data-ocid="patients.problems.panel">
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          data-ocid="patients.problems.open_modal_button"
          onClick={() => setShowAddForm((v) => !v)}
          className="h-7 text-xs gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Problem
        </Button>
      </div>
      {showAddForm && (
        <div
          className="bg-muted/30 border border-border rounded-sm p-4 space-y-3"
          data-ocid="patients.problems.add.panel"
        >
          <p className="text-xs font-semibold text-foreground">
            New Problem / Diagnosis
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="prob-name"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
              >
                Problem / Diagnosis
              </label>
              <Input
                id="prob-name"
                data-ocid="patients.problems.name.input"
                value={newProblem.name}
                onChange={(e) =>
                  setNewProblem((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Type 2 Diabetes Mellitus"
                className="h-7 text-xs"
              />
            </div>
            <div>
              <label
                htmlFor="prob-icd10"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
              >
                ICD-10 Code
              </label>
              <Input
                id="prob-icd10"
                data-ocid="patients.problems.icd10.input"
                value={newProblem.icd10}
                onChange={(e) =>
                  setNewProblem((p) => ({ ...p, icd10: e.target.value }))
                }
                placeholder="e.g. E11.9"
                className="h-7 text-xs font-mono"
              />
            </div>
            <div>
              <label
                htmlFor="prob-onset"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
              >
                Onset Date
              </label>
              <Input
                id="prob-onset"
                type="date"
                data-ocid="patients.problems.onset.input"
                value={newProblem.onset}
                onChange={(e) =>
                  setNewProblem((p) => ({ ...p, onset: e.target.value }))
                }
                className="h-7 text-xs"
              />
            </div>
            <div>
              <label
                htmlFor="prob-severity"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
              >
                Severity
              </label>
              <select
                id="prob-severity"
                data-ocid="patients.problems.severity.select"
                value={newProblem.severity}
                onChange={(e) =>
                  setNewProblem((p) => ({
                    ...p,
                    severity: e.target.value as Problem["severity"],
                  }))
                }
                className="w-full h-7 px-2 text-xs bg-background border border-input rounded-sm focus:outline-none"
              >
                {(["Mild", "Moderate", "Severe"] as Problem["severity"][]).map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              data-ocid="patients.problems.submit_button"
              className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleAddProblem}
            >
              Add
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              data-ocid="patients.problems.cancel_button"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Active ({active.length})
        </p>
        <div className="border border-border rounded-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-muted/60">
                {["Problem", "ICD-10", "Onset", "Severity", "Status", ""].map(
                  (h) => (
                    <TableHead
                      key={h}
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4"
                    >
                      {h}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {active.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-muted-foreground py-8"
                    data-ocid="patients.problems.active.empty_state"
                  >
                    No active problems recorded
                  </TableCell>
                </TableRow>
              ) : (
                active.map((prob, i) => (
                  <TableRow
                    key={prob.id}
                    data-ocid={`patients.problems.active.item.${i + 1}`}
                    className="hover:bg-muted/30"
                  >
                    <TableCell className="px-4 py-2.5 font-medium text-sm">
                      {prob.name}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 font-mono text-sm text-muted-foreground">
                      {prob.icd10}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 text-sm text-muted-foreground">
                      {prob.onset}
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <StatusBadge
                        variant={severityVariant(prob.severity)}
                        label={prob.severity}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <StatusBadge variant="info" label={prob.status} />
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <button
                        type="button"
                        data-ocid={`patients.problems.resolve.button.${i + 1}`}
                        onClick={() => handleMarkResolved(prob.id)}
                        className="text-xs font-semibold px-2 py-1 rounded-sm border transition-colors hover:bg-muted/40"
                        style={{
                          color: "var(--primary)",
                          borderColor: "var(--border)",
                        }}
                      >
                        Mark Resolved
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {resolved.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Resolved ({resolved.length})
          </p>
          <div className="border border-border rounded-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60 hover:bg-muted/60">
                  {["Problem", "ICD-10", "Onset", "Severity", "Status"].map(
                    (h) => (
                      <TableHead
                        key={h}
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4"
                      >
                        {h}
                      </TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {resolved.map((prob, i) => (
                  <TableRow
                    key={prob.id}
                    data-ocid={`patients.problems.resolved.item.${i + 1}`}
                    className="hover:bg-muted/30 opacity-75"
                  >
                    <TableCell className="px-4 py-2.5 text-sm text-muted-foreground line-through">
                      {prob.name}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 font-mono text-sm text-muted-foreground">
                      {prob.icd10}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 text-sm text-muted-foreground">
                      {prob.onset}
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <StatusBadge
                        variant={severityVariant(prob.severity)}
                        label={prob.severity}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <StatusBadge variant="neutral" label="Resolved" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Advance Directives ────────────────────────────────────────────────────
type DnrStatus = "Full Code" | "DNR" | "DNI" | "Comfort Care Only";
type IsolationFlagType =
  | "MRSA"
  | "C. Diff"
  | "Contact Precautions"
  | "Droplet Precautions"
  | "Airborne Precautions"
  | "Neutropenic Precautions";
type IsolationType = "Contact" | "Droplet" | "Airborne" | null;

interface AdvanceDirectiveData {
  dnrStatus: DnrStatus;
  dnrLastUpdated: string;
  dnrNote: string;
  proxyName: string;
  proxyRelationship: string;
  proxyPhone: string;
  livingWillOnFile: boolean;
  livingWillDate: string;
  careGoals: string;
  polstOnFile: boolean;
  polstDate: string;
}

interface IsolationData {
  type: IsolationType;
  flags: IsolationFlagType[];
  notes: string;
  setDate: string;
}

const SEED_ADVANCE_DIRECTIVES: Record<string, AdvanceDirectiveData> = {
  "1": {
    dnrStatus: "DNR",
    dnrLastUpdated: "2026-01-15",
    dnrNote: "Patient expressed wishes clearly. Family informed and agreed.",
    proxyName: "Mary Johnson",
    proxyRelationship: "Daughter",
    proxyPhone: "(555) 234-5678",
    livingWillOnFile: true,
    livingWillDate: "2025-11-20",
    careGoals:
      "Patient wishes to remain comfortable and at home. Declined aggressive interventions. Prefers palliative focus if condition deteriorates.",
    polstOnFile: true,
    polstDate: "2026-01-15",
  },
  "2": {
    dnrStatus: "Full Code",
    dnrLastUpdated: "2026-02-10",
    dnrNote: "",
    proxyName: "David Okonkwo",
    proxyRelationship: "Spouse",
    proxyPhone: "(555) 876-5432",
    livingWillOnFile: false,
    livingWillDate: "",
    careGoals: "Wants all interventions pursued. Active father of three.",
    polstOnFile: false,
    polstDate: "",
  },
};

const SEED_ISOLATION: Record<string, IsolationData> = {
  "1": {
    type: "Contact",
    flags: ["MRSA", "Contact Precautions"],
    notes: "MRSA wound culture positive — contact precautions in place",
    setDate: "2026-03-08",
  },
  "3": {
    type: "Contact",
    flags: ["MRSA", "Contact Precautions"],
    notes: "MRSA precautions — wound culture positive",
    setDate: "2026-03-10",
  },
  "5": {
    type: "Airborne",
    flags: ["Airborne Precautions", "Neutropenic Precautions"],
    notes:
      "Rule out active TB — pending sputum culture; also neutropenic post-chemo",
    setDate: "2026-03-12",
  },
};

const ISOLATION_FLAG_COLORS: Record<IsolationFlagType, string> = {
  MRSA: "bg-destructive/10 text-destructive border-destructive/20",
  "C. Diff": "bg-warning/15 text-warning border-warning/30",
  "Contact Precautions": "bg-warning/15 text-warning border-warning/30",
  "Droplet Precautions": "bg-primary/10 text-primary border-primary/20",
  "Airborne Precautions":
    "bg-destructive/10 text-destructive border-destructive/20",
  "Neutropenic Precautions": "bg-accent/10 text-accent border-accent/20",
};

const ALL_ISOLATION_FLAGS: IsolationFlagType[] = [
  "MRSA",
  "C. Diff",
  "Contact Precautions",
  "Droplet Precautions",
  "Airborne Precautions",
  "Neutropenic Precautions",
];

const defaultAdvanceDirective = (): AdvanceDirectiveData => ({
  dnrStatus: "Full Code",
  dnrLastUpdated: "",
  dnrNote: "",
  proxyName: "",
  proxyRelationship: "",
  proxyPhone: "",
  livingWillOnFile: false,
  livingWillDate: "",
  careGoals: "",
  polstOnFile: false,
  polstDate: "",
});

function AdvanceDirectivesTab({ patient }: { patient: Patient }) {
  const key = String(Number(patient.id));
  const [data, setData] = React.useState<AdvanceDirectiveData>(
    SEED_ADVANCE_DIRECTIVES[key] ?? defaultAdvanceDirective(),
  );
  const [editingDnr, setEditingDnr] = React.useState(false);
  const [editingProxy, setEditingProxy] = React.useState(false);
  const [editingGoals, setEditingGoals] = React.useState(false);
  const [draft, setDraft] = React.useState<AdvanceDirectiveData>(data);

  const dnrVariant = (s: DnrStatus) => {
    if (s === "Full Code") return "success";
    if (s === "DNR") return "danger";
    if (s === "DNI") return "warning";
    return "neutral";
  };
  const handleSave = (section: "dnr" | "proxy" | "goals") => {
    setData(draft);
    if (section === "dnr") setEditingDnr(false);
    if (section === "proxy") setEditingProxy(false);
    if (section === "goals") setEditingGoals(false);
    toast.success("Advance directive updated");
  };
  const startEdit = (section: "dnr" | "proxy" | "goals") => {
    setDraft(data);
    if (section === "dnr") setEditingDnr(true);
    if (section === "proxy") setEditingProxy(true);
    if (section === "goals") setEditingGoals(true);
  };

  return (
    <div className="space-y-4" data-ocid="patients.directives.panel">
      <div className="border border-border bg-muted/10 rounded-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Code Status / DNR
            </h4>
          </div>
          {!editingDnr && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-xs px-2"
              data-ocid="patients.directives.dnr.edit_button"
              onClick={() => startEdit("dnr")}
            >
              Edit
            </Button>
          )}
        </div>
        {editingDnr ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="dir-dnr-status"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
                >
                  Code Status
                </label>
                <select
                  id="dir-dnr-status"
                  data-ocid="patients.directives.dnr.select"
                  value={draft.dnrStatus}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      dnrStatus: e.target.value as DnrStatus,
                    }))
                  }
                  className="w-full h-8 px-2.5 text-sm bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring"
                >
                  {(
                    [
                      "Full Code",
                      "DNR",
                      "DNI",
                      "Comfort Care Only",
                    ] as DnrStatus[]
                  ).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="dir-dnr-date"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
                >
                  Date
                </label>
                <Input
                  data-ocid="patients.directives.dnr.date.input"
                  type="date"
                  value={draft.dnrLastUpdated}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, dnrLastUpdated: e.target.value }))
                  }
                  className="h-8 text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="dir-dnr-notes-ta"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
              >
                Notes
              </label>
              <Textarea
                id="dir-dnr-notes-ta"
                data-ocid="patients.directives.dnr.textarea"
                value={draft.dnrNote}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, dnrNote: e.target.value }))
                }
                rows={2}
                className="text-sm resize-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Switch
                  data-ocid="patients.directives.polst.switch"
                  checked={draft.polstOnFile}
                  onCheckedChange={(v) =>
                    setDraft((p) => ({ ...p, polstOnFile: v }))
                  }
                />
                <span className="text-xs text-foreground">POLST on File</span>
              </div>
              {draft.polstOnFile && (
                <Input
                  data-ocid="patients.directives.polst.input"
                  type="date"
                  value={draft.polstDate}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, polstDate: e.target.value }))
                  }
                  className="h-7 text-xs w-36"
                />
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-2">
                <Switch
                  data-ocid="patients.directives.living_will.switch"
                  checked={draft.livingWillOnFile}
                  onCheckedChange={(v) =>
                    setDraft((p) => ({ ...p, livingWillOnFile: v }))
                  }
                />
                <span className="text-xs text-foreground">
                  Living Will on File
                </span>
              </div>
              {draft.livingWillOnFile && (
                <Input
                  type="date"
                  value={draft.livingWillDate}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, livingWillDate: e.target.value }))
                  }
                  className="h-7 text-xs w-36"
                />
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                data-ocid="patients.directives.dnr.save_button"
                className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => handleSave("dnr")}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                data-ocid="patients.directives.dnr.cancel_button"
                onClick={() => setEditingDnr(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <StatusBadge
                variant={
                  dnrVariant(data.dnrStatus) as
                    | "success"
                    | "danger"
                    | "warning"
                    | "neutral"
                }
                label={data.dnrStatus}
              />
              {data.dnrLastUpdated && (
                <span className="text-xs text-muted-foreground">
                  Last updated: {data.dnrLastUpdated}
                </span>
              )}
            </div>
            {data.dnrNote && (
              <p className="text-xs text-foreground/80 italic mt-1">
                {data.dnrNote}
              </p>
            )}
            <div className="flex gap-4 mt-2">
              <span
                className={`text-xs ${data.polstOnFile ? "text-success font-medium" : "text-muted-foreground"}`}
              >
                POLST:{" "}
                {data.polstOnFile
                  ? `On File (${data.polstDate})`
                  : "Not on file"}
              </span>
              <span
                className={`text-xs ${data.livingWillOnFile ? "text-success font-medium" : "text-muted-foreground"}`}
              >
                Living Will:{" "}
                {data.livingWillOnFile
                  ? `On File (${data.livingWillDate})`
                  : "Not on file"}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="border border-border bg-muted/10 rounded-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Healthcare Proxy
          </h4>
          {!editingProxy && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-xs px-2"
              data-ocid="patients.directives.proxy.edit_button"
              onClick={() => startEdit("proxy")}
            >
              Edit
            </Button>
          )}
        </div>
        {editingProxy ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="dir-proxy-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
                >
                  Name
                </label>
                <Input
                  data-ocid="patients.directives.proxy.name.input"
                  value={draft.proxyName}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, proxyName: e.target.value }))
                  }
                  className="h-8 text-sm"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label
                  htmlFor="dir-proxy-rel"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
                >
                  Relationship
                </label>
                <Input
                  data-ocid="patients.directives.proxy.relationship.input"
                  value={draft.proxyRelationship}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      proxyRelationship: e.target.value,
                    }))
                  }
                  className="h-8 text-sm"
                  placeholder="e.g. Daughter"
                />
              </div>
              <div>
                <label
                  htmlFor="dir-proxy-phone"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
                >
                  Phone
                </label>
                <Input
                  data-ocid="patients.directives.proxy.phone.input"
                  value={draft.proxyPhone}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, proxyPhone: e.target.value }))
                  }
                  className="h-8 text-sm"
                  placeholder="(555) 000-0000"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                data-ocid="patients.directives.proxy.save_button"
                className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => handleSave("proxy")}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                data-ocid="patients.directives.proxy.cancel_button"
                onClick={() => setEditingProxy(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : data.proxyName ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {data.proxyName}
            </p>
            <p className="text-xs text-muted-foreground">
              {data.proxyRelationship} · {data.proxyPhone}
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No healthcare proxy on record
          </p>
        )}
      </div>
      <div className="border border-border bg-muted/10 rounded-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Care Goals & Patient Wishes
          </h4>
          {!editingGoals && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-xs px-2"
              data-ocid="patients.directives.goals.edit_button"
              onClick={() => startEdit("goals")}
            >
              Edit
            </Button>
          )}
        </div>
        {editingGoals ? (
          <div className="space-y-3">
            <Textarea
              data-ocid="patients.directives.goals.textarea"
              value={draft.careGoals}
              onChange={(e) =>
                setDraft((p) => ({ ...p, careGoals: e.target.value }))
              }
              rows={4}
              className="text-sm resize-none"
              placeholder="Document patient's expressed goals of care, values, and wishes..."
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                data-ocid="patients.directives.goals.save_button"
                className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => handleSave("goals")}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                data-ocid="patients.directives.goals.cancel_button"
                onClick={() => setEditingGoals(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : data.careGoals ? (
          <p className="text-sm text-foreground/80 whitespace-pre-wrap">
            {data.careGoals}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No care goals documented
          </p>
        )}
      </div>
    </div>
  );
}

// ── Isolation Section ─────────────────────────────────────────────────────
function IsolationSection({ patient }: { patient: Patient }) {
  const key = String(Number(patient.id));
  const [isolation, setIsolation] = React.useState<IsolationData>(
    SEED_ISOLATION[key] ?? { type: null, flags: [], notes: "", setDate: "" },
  );
  const [expanded, setExpanded] = React.useState(false);
  const [draft, setDraft] = React.useState<IsolationData>(isolation);
  const hasFlags = isolation.flags && isolation.flags.length > 0;

  const handleSave = () => {
    setIsolation(draft);
    setExpanded(false);
    toast.success(
      draft.flags.length > 0
        ? `Isolation flags updated: ${draft.flags.join(", ")}`
        : "Isolation precautions cleared",
    );
  };

  const toggleFlag = (flag: IsolationFlagType) =>
    setDraft((p) => ({
      ...p,
      flags: p.flags.includes(flag)
        ? p.flags.filter((f) => f !== flag)
        : [...p.flags, flag],
    }));

  return (
    <div data-ocid="patients.isolation.panel">
      {hasFlags && (
        <div className="flex items-start gap-3 px-4 py-2 border-b bg-destructive/5">
          <ShieldAlert className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-destructive mr-1">
              Isolation:
            </span>
            {isolation.flags.map((flag) => (
              <span
                key={flag}
                className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${ISOLATION_FLAG_COLORS[flag]}`}
              >
                {flag}
              </span>
            ))}
            {isolation.setDate && (
              <span className="text-xs text-muted-foreground ml-1">
                since {isolation.setDate}
              </span>
            )}
          </div>
          <button
            type="button"
            data-ocid="patients.isolation.toggle"
            onClick={() => {
              setDraft(isolation);
              setExpanded((v) => !v);
            }}
            className="text-xs text-muted-foreground hover:text-foreground underline flex-shrink-0"
          >
            {expanded ? "Hide" : "Manage"}
          </button>
        </div>
      )}
      {!hasFlags && (
        <div className="flex items-center px-4 py-1.5 border-b bg-muted/10">
          <button
            type="button"
            data-ocid="patients.isolation.toggle"
            onClick={() => {
              setDraft(isolation);
              setExpanded((v) => !v);
            }}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            {expanded
              ? "▲ Hide isolation precautions"
              : "▼ Set isolation precautions"}
          </button>
        </div>
      )}
      {expanded && (
        <div
          className="bg-muted/10 border-b border-border px-5 py-4 space-y-3"
          data-ocid="patients.isolation.form.panel"
        >
          <p className="text-xs font-semibold text-foreground">
            Isolation Precautions
          </p>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Select Applicable Flags
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {ALL_ISOLATION_FLAGS.map((flag) => (
                <label
                  key={flag}
                  className="flex items-center gap-2 cursor-pointer select-none"
                  data-ocid="patients.isolation.flag.checkbox"
                >
                  <input
                    type="checkbox"
                    checked={draft.flags.includes(flag)}
                    onChange={() => toggleFlag(flag)}
                    className="rounded border-input"
                  />
                  <span
                    className={`inline-flex items-center text-xs font-medium px-1.5 py-0.5 rounded border ${ISOLATION_FLAG_COLORS[flag]}`}
                  >
                    {flag}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="isolation-date-input"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
              >
                Date Set
              </label>
              <Input
                id="isolation-date-input"
                data-ocid="patients.isolation.date.input"
                type="date"
                value={draft.setDate}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, setDate: e.target.value }))
                }
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="isolation-notes-input"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
            >
              Notes / Reason
            </label>
            <Input
              id="isolation-notes-input"
              data-ocid="patients.isolation.notes.input"
              value={draft.notes}
              onChange={(e) =>
                setDraft((p) => ({ ...p, notes: e.target.value }))
              }
              className="h-8 text-sm"
              placeholder="e.g. MRSA positive wound culture"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              data-ocid="patients.isolation.save_button"
              className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              data-ocid="patients.isolation.cancel_button"
              onClick={() => setExpanded(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Patient Detail Panel ──────────────────────────────────────────────────
export const PatientDetailPanel = React.memo(function PatientDetailPanel({
  patient,
  allMedications,
  allLabResults,
  allAppointments,
  allClinicalNotes,
  allPrescriptions,
  onClose,
}: {
  patient: Patient;
  allMedications: Medication[];
  allLabResults: LabResult[];
  allAppointments: Appointment[];
  allClinicalNotes: ClinicalNote[];
  allPrescriptions: Prescription[];
  onClose: () => void;
}) {
  const patientMeds = allMedications.filter((m) => m.patientId === patient.id);
  const patientLabs = allLabResults.filter((l) => l.patientId === patient.id);
  const patientAppts = allAppointments
    .filter((a) => a.patientId === patient.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const patientNotes = allClinicalNotes.filter(
    (n) => n.patientId === patient.id,
  );
  const patientRx = allPrescriptions.filter((p) => p.patientId === patient.id);
  const abnormalCount = patientLabs.filter(
    (l) => getLabFlag(l.testName, l.result, l.isCritical) !== "normal",
  ).length;

  return (
    <div
      className="border border-border bg-card mt-1"
      data-ocid="patients.detail.panel"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3 bg-muted/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-bold">
            {patient.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {patient.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              MRN: {patient.mrn} · DOB: {patient.dateOfBirth}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {abnormalCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-destructive bg-destructive/10 border border-destructive/20 px-2.5 py-1 rounded">
              <AlertTriangle className="w-3 h-3" />
              {abnormalCount} Abnormal Result{abnormalCount !== 1 ? "s" : ""}
            </span>
          )}
          <button
            type="button"
            data-ocid="patients.detail.close_button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Close chart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <IsolationSection patient={patient} />
      <Tabs defaultValue="summary" className="w-full">
        <TabsList
          className="w-full justify-start rounded-none border-b border-border bg-transparent px-5 h-10 gap-0"
          data-ocid="patients.detail.tab"
        >
          {[
            { value: "summary", label: "Chart Summary" },
            {
              value: "medications",
              label: `Medications (${patientMeds.length})`,
            },
            { value: "labs", label: `Lab Results (${patientLabs.length})` },
            {
              value: "appointments",
              label: `Appointments (${patientAppts.length})`,
            },
            {
              value: "notes",
              label: `Clinical Notes (${patientNotes.length})`,
            },
            {
              value: "prescriptions",
              label: `Prescriptions (${patientRx.length})`,
            },
            { value: "problems", label: "Problem List" },
            { value: "caregaps", label: "Care Gaps" },
            { value: "safety", label: "Safety" },
            { value: "directives", label: "Advance Directives" },
            { value: "consents", label: "Consents" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              data-ocid={`patients.detail.${tab.value}.tab`}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-xs font-medium px-4 h-10"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="p-5">
          <TabsContent value="summary" className="mt-0">
            <ChartSummaryTab
              patient={patient}
              medications={allMedications}
              labResults={allLabResults}
              appointments={allAppointments}
              clinicalNotes={allClinicalNotes}
              prescriptions={allPrescriptions}
            />
          </TabsContent>
          <TabsContent value="medications" className="mt-0">
            {patientMeds.length === 0 ? (
              <p
                className="text-sm text-muted-foreground text-center py-8"
                data-ocid="patients.medications.empty_state"
              >
                No medications recorded
              </p>
            ) : (
              <div className="border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/60 hover:bg-muted/60">
                      {["Name", "Dose", "Frequency", "Status"].map((h) => (
                        <TableHead
                          key={h}
                          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4"
                        >
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientMeds.map((m, i) => (
                      <TableRow
                        key={String(m.id)}
                        data-ocid={`patients.medication.row.${i + 1}`}
                        className="hover:bg-muted/30 even:bg-muted/20"
                      >
                        <TableCell className="font-medium text-sm px-4 py-2.5">
                          {m.name}
                        </TableCell>
                        <TableCell className="text-sm px-4 py-2.5">
                          {m.dose}
                        </TableCell>
                        <TableCell className="text-sm px-4 py-2.5">
                          {m.frequency}
                        </TableCell>
                        <TableCell className="px-4 py-2.5">
                          <StatusBadge
                            variant={
                              m.status === "active" ? "success" : "neutral"
                            }
                            label={m.status}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          <TabsContent value="labs" className="mt-0">
            {patientLabs.length === 0 ? (
              <p
                className="text-sm text-muted-foreground text-center py-8"
                data-ocid="patients.labs.empty_state"
              >
                No lab results recorded
              </p>
            ) : (
              <div className="border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/60 hover:bg-muted/60">
                      {["Test", "Result", "Unit", "Flag"].map((h) => (
                        <TableHead
                          key={h}
                          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4"
                        >
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientLabs.map((l, i) => {
                      const flag = getLabFlag(
                        l.testName,
                        l.result,
                        l.isCritical,
                      );
                      return (
                        <TableRow
                          key={String(l.id)}
                          data-ocid={`patients.lab.row.${i + 1}`}
                          className="hover:bg-muted/30 even:bg-muted/20"
                        >
                          <TableCell className="font-medium text-sm px-4 py-2.5">
                            {l.testName}
                          </TableCell>
                          <TableCell className="text-sm px-4 py-2.5 font-mono">
                            {l.result}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground px-4 py-2.5">
                            {l.unit}
                          </TableCell>
                          <TableCell className="px-4 py-2.5">
                            <StatusBadge
                              variant={flagVariant[flag as FlagLevel]}
                              label={flagLabel[flag as FlagLevel]}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          <TabsContent value="appointments" className="mt-0">
            {patientAppts.length === 0 ? (
              <p
                className="text-sm text-muted-foreground text-center py-8"
                data-ocid="patients.appointments.empty_state"
              >
                No appointments on record
              </p>
            ) : (
              <div className="border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/60 hover:bg-muted/60">
                      {["Date", "Status"].map((h) => (
                        <TableHead
                          key={h}
                          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4"
                        >
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientAppts.map((a, i) => (
                      <TableRow
                        key={String(a.id)}
                        data-ocid={`patients.appointment.row.${i + 1}`}
                        className="hover:bg-muted/30 even:bg-muted/20"
                      >
                        <TableCell className="font-medium text-sm px-4 py-2.5">
                          {a.date.slice(0, 16).replace("T", " ")}
                        </TableCell>
                        <TableCell className="px-4 py-2.5">
                          <StatusBadge
                            variant={
                              a.status === "completed"
                                ? "success"
                                : a.status === "cancelled"
                                  ? "danger"
                                  : "info"
                            }
                            label={a.status}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          <TabsContent value="notes" className="mt-0">
            {patientNotes.length === 0 ? (
              <p
                className="text-sm text-muted-foreground text-center py-8"
                data-ocid="patients.notes.empty_state"
              >
                No clinical notes on record
              </p>
            ) : (
              <div className="space-y-3">
                {patientNotes.map((n, i) => (
                  <div
                    key={String(n.id)}
                    data-ocid={`patients.note.item.${i + 1}`}
                    className="border border-border bg-muted/20 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      {n.noteType}
                    </p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {n.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="prescriptions" className="mt-0">
            {patientRx.length === 0 ? (
              <p
                className="text-sm text-muted-foreground text-center py-8"
                data-ocid="patients.prescriptions.empty_state"
              >
                No prescriptions on record
              </p>
            ) : (
              <div className="border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/60 hover:bg-muted/60">
                      {["Medication", "Dose", "Prescribed By", "Status"].map(
                        (h) => (
                          <TableHead
                            key={h}
                            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4"
                          >
                            {h}
                          </TableHead>
                        ),
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientRx.map((p, i) => (
                      <TableRow
                        key={String(p.id)}
                        data-ocid={`patients.prescription.row.${i + 1}`}
                        className="hover:bg-muted/30 even:bg-muted/20"
                      >
                        <TableCell className="font-medium text-sm px-4 py-2.5">
                          {p.medication}
                        </TableCell>
                        <TableCell className="text-sm px-4 py-2.5">
                          {p.dose}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground px-4 py-2.5">
                          {p.prescribedBy}
                        </TableCell>
                        <TableCell className="px-4 py-2.5">
                          <StatusBadge
                            variant={
                              p.status === "dispensed"
                                ? "success"
                                : p.status === "pending"
                                  ? "warning"
                                  : "neutral"
                            }
                            label={p.status}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          <TabsContent value="problems" className="mt-0">
            <ProblemListTab patient={patient} />
          </TabsContent>
          <TabsContent value="caregaps" className="mt-0">
            <CareGapsTab patient={patient} />
          </TabsContent>
          <TabsContent value="safety" className="mt-0">
            <IsolationSection patient={patient} />
          </TabsContent>
          <TabsContent value="directives" className="mt-0">
            <AdvanceDirectivesTab patient={patient} />
          </TabsContent>
          <TabsContent value="consents" className="mt-0">
            <ConsentsTab patientId={patient.id} patientName={patient.name} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
});
