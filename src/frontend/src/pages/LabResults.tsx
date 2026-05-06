import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ChevronUp,
  FlaskConical,
  Loader2,
  Plus,
  Printer,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { LabTrendChart } from "../components/LabTrendChart";
import { PatientFilterBar } from "../components/PatientFilterBar";
import { StatusBadge } from "../components/StatusBadge";
import { useActor } from "../hooks/useActor";
import { useDemoMode } from "../hooks/useDemoMode";

type FlagLevel = "normal" | "low" | "high" | "critical";

interface ReferenceRange {
  display: string;
  getFlag: (value: number) => FlagLevel;
}

const LAB_REFERENCE_RANGES: Record<string, ReferenceRange> = {
  HbA1c: {
    display: "4.0–5.6%",
    getFlag: (v) => {
      if (v < 5.7) return "normal";
      if (v < 6.5) return "high";
      return "critical";
    },
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
  Troponin: {
    display: "<0.04 ng/mL",
    getFlag: (v) => {
      if (v >= 0.4) return "critical";
      if (v >= 0.04) return "high";
      return "normal";
    },
  },
  "CBC WBC": {
    display: "4.5–11.0 k/uL",
    getFlag: (v) => {
      if (v < 4.5) return "low";
      if (v > 11.0) return "high";
      return "normal";
    },
  },
  Glucose: {
    display: "70–99 mg/dL",
    getFlag: (v) => {
      if (v < 40 || v > 500) return "critical";
      if (v < 70) return "low";
      if (v >= 126) return "high";
      if (v >= 100) return "high";
      return "normal";
    },
  },
  Sodium: {
    display: "135–145 mEq/L",
    getFlag: (v) => {
      if (v < 120 || v > 160) return "critical";
      if (v < 135) return "low";
      if (v > 145) return "high";
      return "normal";
    },
  },
  Creatinine: {
    display: "0.7–1.3 mg/dL",
    getFlag: (v) => {
      if (v > 1.3) return "high";
      return "normal";
    },
  },
  LDL: {
    display: "<100 mg/dL",
    getFlag: (v) => {
      if (v >= 130) return "high";
      if (v >= 100) return "high";
      return "normal";
    },
  },
};

function getResultFlag(
  testName: string,
  result: string,
  isCritical: boolean,
): { flag: FlagLevel; refDisplay: string | null } {
  const ref = LAB_REFERENCE_RANGES[testName];
  if (!ref) {
    return {
      flag: isCritical ? "critical" : "normal",
      refDisplay: null,
    };
  }
  const num = Number.parseFloat(result);
  if (Number.isNaN(num)) {
    return {
      flag: isCritical ? "critical" : "normal",
      refDisplay: ref.display,
    };
  }
  return { flag: ref.getFlag(num), refDisplay: ref.display };
}

const flagToVariant = (
  flag: FlagLevel,
): "success" | "warning" | "critical" | "danger" => {
  if (flag === "normal") return "success";
  if (flag === "critical") return "critical";
  return "warning";
};

const flagLabel: Record<FlagLevel, string> = {
  normal: "Normal",
  low: "Low",
  high: "High",
  critical: "Critical",
};

function getFlagSeverity(flag: FlagLevel): number {
  if (flag === "normal") return 0;
  if (flag === "low" || flag === "high") return 1;
  return 2; // critical
}

function getTrend(
  current: LabResult,
  allResults: LabResult[],
): "up" | "down" | "stable" {
  const sameTest = allResults
    .filter(
      (r) =>
        r.patientId === current.patientId && r.testName === current.testName,
    )
    .sort((a, b) => Number(a.id) - Number(b.id));

  const currentIdx = sameTest.findIndex((r) => r.id === current.id);
  if (currentIdx <= 0) return "stable";

  const prev = sameTest[currentIdx - 1];
  const { flag: currentFlag } = getResultFlag(
    current.testName,
    current.result,
    current.isCritical,
  );
  const { flag: prevFlag } = getResultFlag(
    prev.testName,
    prev.result,
    prev.isCritical,
  );

  const currentSev = getFlagSeverity(currentFlag);
  const prevSev = getFlagSeverity(prevFlag);

  if (currentSev > prevSev) return "up";
  if (currentSev < prevSev) return "down";
  return "stable";
}

function TrendBadge({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") {
    return (
      <span
        className="text-sm font-bold text-destructive"
        title="Worsening trend"
      >
        ↑
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span className="text-sm font-bold text-success" title="Improving trend">
        ↓
      </span>
    );
  }
  return (
    <span className="text-sm text-muted-foreground" title="Stable">
      →
    </span>
  );
}

type Patient = {
  id: bigint;
  name: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  mrn: string;
};
type LabResult = {
  id: bigint;
  patientId: bigint;
  testName: string;
  result: string;
  unit: string;
  isCritical: boolean;
};

const SK_ROWS = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4"];
const SK_COLS = ["c0", "c1", "c2", "c3", "c4", "c5", "c6"];

interface LabResultsProps {
  onNavigate?: (page: string) => void;
  activePatientId?: bigint;
  activePatientName?: string;
  onClearFilter?: () => void;
}

type LabSection = "All" | "Chemistry" | "Hematology" | "Microbiology";
const LAB_SECTIONS: LabSection[] = [
  "All",
  "Chemistry",
  "Hematology",
  "Microbiology",
];
const LAB_SECTION_MAP: Record<string, LabSection> = {
  HbA1c: "Chemistry",
  Glucose: "Chemistry",
  BMP: "Chemistry",
  CMP: "Chemistry",
  "Lipid Panel": "Chemistry",
  Lipids: "Chemistry",
  eGFR: "Chemistry",
  Creatinine: "Chemistry",
  BUN: "Chemistry",
  Sodium: "Chemistry",
  Potassium: "Chemistry",
  Chloride: "Chemistry",
  CBC: "Hematology",
  "CBC WBC": "Hematology",
  WBC: "Hematology",
  Hemoglobin: "Hematology",
  Hematocrit: "Hematology",
  Platelets: "Hematology",
  RBC: "Hematology",
  MCV: "Hematology",
  Culture: "Microbiology",
  "Blood Culture": "Microbiology",
  "Urine Culture": "Microbiology",
  Sensitivity: "Microbiology",
};

function getLabSection(testName: string): LabSection {
  for (const [key, section] of Object.entries(LAB_SECTION_MAP)) {
    if (testName.toLowerCase().includes(key.toLowerCase())) return section;
  }
  return "Chemistry";
}

export default function LabResults({
  onNavigate,
  activePatientId,
  activePatientName,
  onClearFilter,
}: LabResultsProps) {
  const { isDemoMode, demoActor } = useDemoMode();
  const { actor: realActor, isFetching } = useActor();
  const actor = isDemoMode ? demoActor : realActor;
  const [labs, setLabs] = useState<LabResult[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPendingBanner, setShowPendingBanner] = useState(true);
  const [expandedRequisition, setExpandedRequisition] = useState<string | null>(
    null,
  );
  const [form, setForm] = useState({
    patientId: "",
    testName: "",
    result: "",
    unit: "",
    isCritical: false,
  });

  const loadData = useCallback(async () => {
    if (!actor) return;
    try {
      const [labData, patientData] = await Promise.all([
        actor.listLabResults(),
        actor.listPatients(),
      ]);
      setLabs(labData as LabResult[]);
      setPatients(patientData as Patient[]);
    } catch {
      toast.error("Failed to load lab results");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (!actor) return;
    if (!isDemoMode && isFetching) return;
    setLoading(true);
    loadData();
  }, [actor, isFetching, loadData, isDemoMode]);

  const handleAdd = async () => {
    if (!form.patientId || !form.testName) {
      toast.error("Patient and test name required");
      return;
    }
    if (!actor) return;
    setSubmitting(true);
    try {
      await actor.addLabResult(
        BigInt(form.patientId),
        form.testName,
        form.result,
        form.unit,
        form.isCritical,
      );
      toast.success(
        form.isCritical ? "Critical result recorded!" : "Lab result recorded",
      );
      setShowForm(false);
      setForm({
        patientId: "",
        testName: "",
        result: "",
        unit: "",
        isCritical: false,
      });
      await loadData();
    } catch {
      toast.error("Failed to save lab result");
    } finally {
      setSubmitting(false);
    }
  };

  const criticalCount = labs.filter((l) => {
    const { flag } = getResultFlag(l.testName, l.result, l.isCritical);
    return flag === "critical";
  }).length;

  const filteredLabs = activePatientId
    ? labs.filter((l) => l.patientId === activePatientId)
    : labs;

  const [sectionFilter, setSectionFilter] = useState<LabSection>(() => {
    try {
      const prefs = JSON.parse(
        localStorage.getItem("medunite_prefs_LabTech") || "{}",
      );
      const s = prefs.labSection as LabSection;
      return LAB_SECTIONS.includes(s) ? s : "All";
    } catch {
      return "All";
    }
  });

  const sectionFilteredLabs =
    sectionFilter === "All"
      ? filteredLabs
      : filteredLabs.filter((l) => getLabSection(l.testName) === sectionFilter);

  if (!activePatientId) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        data-ocid="labs.empty_state"
      >
        <FlaskConical className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Select a patient to view their lab results
        </p>
        <button
          type="button"
          onClick={() => onNavigate?.("patients")}
          className="text-xs font-medium text-primary hover:underline"
        >
          Go to Patients
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="labs.page">
      {activePatientId && filteredLabs.length > 0 && (
        <LabTrendChart labs={filteredLabs} patientName={activePatientName} />
      )}
      {activePatientId && activePatientName && (
        <PatientFilterBar
          patientName={activePatientName}
          onClear={onClearFilter ?? (() => {})}
        />
      )}
      {/* Pending results banner */}
      {(() => {
        const pendingCount = labs.filter(
          (r) => r.result === "Pending / In Progress",
        ).length;
        return pendingCount > 0 && showPendingBanner ? (
          <div
            className="flex items-center gap-3 bg-warning/10 border border-warning/30 text-warning-foreground rounded px-4 py-3 text-sm"
            data-ocid="lab-results.pending_banner"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 text-warning" />
            <span className="flex-1">
              {pendingCount} result{pendingCount > 1 ? "s" : ""} pending —
              awaiting lab processing
            </span>
            <button
              type="button"
              onClick={() => setShowPendingBanner(false)}
              className="ml-auto text-warning hover:text-warning font-bold leading-none"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        ) : null;
      })()}
      {/* Critical banner */}
      {criticalCount > 0 && (
        <div
          className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded px-4 py-3 text-sm font-medium"
          data-ocid="labs.error_state"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-destructive" />
          <span>
            <strong>
              {criticalCount} critical result{criticalCount > 1 ? "s" : ""}
            </strong>{" "}
            require immediate clinical review.
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          data-ocid="labs.primary_button"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? (
            <ChevronUp className="w-3.5 h-3.5 mr-1.5" />
          ) : (
            <Plus className="w-3.5 h-3.5 mr-1.5" />
          )}
          Add Result
        </Button>
      </div>

      {/* Section filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
          Section:
        </span>
        {LAB_SECTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSectionFilter(s)}
            className={[
              "px-2.5 py-1 text-xs rounded border transition-colors",
              sectionFilter === s
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border text-muted-foreground hover:border-primary/40",
            ].join(" ")}
          >
            {s}
          </button>
        ))}
      </div>

      {showForm && (
        <div
          className="border border-border bg-card p-5"
          data-ocid="labs.panel"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Add Lab Result
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Patient
              </Label>
              <Select
                onValueChange={(v) => setForm((p) => ({ ...p, patientId: v }))}
              >
                <SelectTrigger
                  data-ocid="labs.patient.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={String(p.id)} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(["testName", "result", "unit"] as const).map((f) => (
              <div key={f}>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {f === "testName"
                    ? "Test Name"
                    : f.charAt(0).toUpperCase() + f.slice(1)}
                </Label>
                <Input
                  data-ocid={`labs.${f}.input`}
                  value={form[f]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [f]: e.target.value }))
                  }
                  className="mt-1 h-8 text-sm"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-3">
              <Switch
                data-ocid="labs.critical.switch"
                checked={form.isCritical}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, isCritical: v }))
                }
              />
              <Label className="text-sm">Mark as Critical</Label>
            </div>
            <Button
              size="sm"
              data-ocid="labs.submit_button"
              disabled={submitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleAdd}
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : null}
              Save Result
            </Button>
            <Button
              size="sm"
              data-ocid="labs.cancel_button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="border border-border bg-card">
        <Table data-ocid="labs.table">
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Patient
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Test
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-2 w-12">
                Trend
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Result
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Unit
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Reference Range
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Flag
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              SK_ROWS.map((rowKey) => (
                <TableRow key={rowKey} data-ocid="labs.loading_state">
                  {SK_COLS.map((colKey) => (
                    <TableCell key={colKey} className="px-4 py-2.5">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : sectionFilteredLabs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-10 text-sm"
                  data-ocid="labs.empty_state"
                >
                  No lab results recorded
                </TableCell>
              </TableRow>
            ) : (
              sectionFilteredLabs.map((l, i) => {
                const patient = patients.find((p) => p.id === l.patientId);
                const { flag, refDisplay } = getResultFlag(
                  l.testName,
                  l.result,
                  l.isCritical,
                );
                const isCrit = flag === "critical";
                return (
                  <>
                    <TableRow
                      key={String(l.id)}
                      data-ocid={`labs.row.${i + 1}`}
                      className={cn(
                        "hover:bg-muted/30 even:bg-muted/20 transition-all",
                        isCrit
                          ? "border-l-2 border-l-destructive"
                          : "border-l-2 border-l-transparent hover:border-l-accent",
                      )}
                    >
                      <TableCell className="font-medium text-sm px-4 py-2.5">
                        <button
                          type="button"
                          className="cursor-pointer text-primary hover:underline font-medium"
                          data-ocid="labs.patient.link"
                          onClick={() => onNavigate?.("patients")}
                        >
                          {patient?.name ?? "—"}
                        </button>
                      </TableCell>
                      <TableCell className="text-sm px-4 py-2.5">
                        {l.testName}
                      </TableCell>
                      <TableCell className="px-2 py-2.5 w-12 text-center">
                        <TrendBadge trend={getTrend(l, labs)} />
                      </TableCell>
                      <TableCell
                        className={cn(
                          "px-4 py-2.5",
                          isCrit
                            ? "font-mono font-bold text-destructive text-sm"
                            : "text-sm",
                        )}
                      >
                        {l.result}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground px-4 py-2.5">
                        {l.unit}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground px-4 py-2.5">
                        {refDisplay ? (
                          <span>Ref: {refDisplay}</span>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-2.5">
                        <StatusBadge
                          variant={flagToVariant(flag)}
                          label={flagLabel[flag]}
                        />
                      </TableCell>
                      <TableCell className="px-4 py-2.5">
                        {(l.result === "Pending / In Progress" ||
                          l.result === "Ordered") && (
                          <button
                            type="button"
                            data-ocid={`labs.requisition.button.${i + 1}`}
                            onClick={() =>
                              setExpandedRequisition((prev) =>
                                prev === String(l.id) ? null : String(l.id),
                              )
                            }
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded-sm px-2 py-1 hover:bg-muted/40 transition-colors"
                          >
                            <Printer className="w-3 h-3" />
                            Requisition
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                    {expandedRequisition === String(l.id) && (
                      <TableRow
                        key={`req-${String(l.id)}`}
                        data-ocid={`labs.requisition.panel.${i + 1}`}
                      >
                        <TableCell colSpan={7} className="p-0">
                          <style>
                            {
                              "@media print { .no-print { display: none !important; } .print-only { display: block !important; } }"
                            }
                          </style>
                          <div className="print-only bg-white border border-border mx-4 my-3 p-6 rounded-sm text-sm">
                            <div className="border-b border-gray-300 pb-4 mb-4">
                              <h2 className="text-lg font-bold text-gray-900">
                                MedUnite Medical Center
                              </h2>
                              <p className="text-xs text-gray-600">
                                1200 Healthcare Blvd, Suite 400 · Springfield,
                                ST 00100
                              </p>
                              <p className="text-xs text-gray-600">
                                Tel: (555) 800-4000 · Fax: (555) 800-4001
                              </p>
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                              Laboratory Requisition
                            </h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                  Patient
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {patient?.name ?? "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                  MRN
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {patient?.mrn ?? "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                  Date of Birth
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {patient?.dateOfBirth ?? "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                  Date Ordered
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {new Date().toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="border border-gray-200 rounded-sm p-3 mb-4">
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                                Test Ordered
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {l.testName}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Unit: {l.unit || "—"} &middot; Priority:{" "}
                                <span className="font-semibold">Routine</span>
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <p className="text-xs text-gray-500 italic">
                                This requisition was generated electronically
                                via MedUnite.
                              </p>
                              <button
                                type="button"
                                data-ocid={`labs.requisition.print_button.${i + 1}`}
                                onClick={() => window.print()}
                                className="no-print flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-sm hover:bg-primary/90"
                              >
                                <Printer className="w-3 h-3" /> Print
                              </button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
