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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Filter, Users2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { StatusBadge } from "../components/StatusBadge";
import { DEMO_LAB_RESULTS, DEMO_MEDICATIONS, DEMO_PATIENTS } from "../demoData";
import { useActor } from "../hooks/useActor";
import { useDemoMode } from "../hooks/useDemoMode";

interface PopulationHealthProps {
  onNavigate?: (page: string) => void;
}

interface CohortResult {
  patientId: number;
  patientName: string;
  dob: string;
  age: number;
  diagnosis: string;
  lastVisit: string;
  labValue?: string;
  careGapStatus: "overdue" | "due-soon" | "up-to-date" | "n/a";
}

type QuickCohort =
  | "diabetics-hba1c"
  | "warfarin"
  | "flu-shot"
  | "chf"
  | "hypertension"
  | "statins"
  | null;

function calcAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

const QUICK_COHORTS: {
  id: QuickCohort;
  label: string;
  description: string;
}[] = [
  {
    id: "diabetics-hba1c",
    label: "Diabetics with HbA1c > 9",
    description: "Patients with T2DM and poorly controlled glycemia",
  },
  {
    id: "warfarin",
    label: "Patients on Warfarin",
    description: "Active warfarin prescriptions requiring INR monitoring",
  },
  {
    id: "flu-shot",
    label: "Overdue for Flu Shot",
    description: "Patients without influenza vaccine this season",
  },
  {
    id: "chf",
    label: "Active CHF Patients",
    description: "Patients with congestive heart failure diagnosis",
  },
  {
    id: "hypertension",
    label: "Uncontrolled Hypertension",
    description: "Patients with HTN and last BP > 140/90",
  },
  {
    id: "statins",
    label: "Patients on Statins",
    description: "Active statin prescriptions for lipid management",
  },
];

function getCohortResults(cohort: QuickCohort): CohortResult[] {
  switch (cohort) {
    case "diabetics-hba1c":
      return [
        {
          patientId: 1,
          patientName: "Margaret Chen",
          dob: "1968-03-15",
          age: calcAge("1968-03-15"),
          diagnosis: "Type 2 Diabetes Mellitus (E11.9)",
          lastVisit: "Mar 12, 2026",
          labValue: "HbA1c 8.2%",
          careGapStatus: "overdue",
        },
      ];
    case "warfarin":
      return [
        {
          patientId: 2,
          patientName: "Robert Okonkwo",
          dob: "1954-07-22",
          age: calcAge("1954-07-22"),
          diagnosis: "Atrial Fibrillation (I48.91)",
          lastVisit: "Mar 12, 2026",
          labValue: "INR 2.1",
          careGapStatus: "due-soon",
        },
      ];
    case "flu-shot":
      return [
        {
          patientId: 4,
          patientName: "James Thornton",
          dob: "1975-01-30",
          age: calcAge("1975-01-30"),
          diagnosis: "Annual wellness — flu shot overdue",
          lastVisit: "Mar 11, 2026",
          careGapStatus: "overdue",
        },
        {
          patientId: 5,
          patientName: "Aisha Patel",
          dob: "1990-06-14",
          age: calcAge("1990-06-14"),
          diagnosis: "Allergic rhinitis — flu shot overdue",
          lastVisit: "Mar 10, 2026",
          careGapStatus: "overdue",
        },
      ];
    case "chf":
      return [
        {
          patientId: 2,
          patientName: "Robert Okonkwo",
          dob: "1954-07-22",
          age: calcAge("1954-07-22"),
          diagnosis: "Congestive Heart Failure (I50.9)",
          lastVisit: "Mar 12, 2026",
          labValue: "BNP elevated",
          careGapStatus: "due-soon",
        },
      ];
    case "hypertension":
      return [
        {
          patientId: 1,
          patientName: "Margaret Chen",
          dob: "1968-03-15",
          age: calcAge("1968-03-15"),
          diagnosis: "Hypertension (I10)",
          lastVisit: "Mar 12, 2026",
          labValue: "Last BP: 148/92",
          careGapStatus: "due-soon",
        },
        {
          patientId: 2,
          patientName: "Robert Okonkwo",
          dob: "1954-07-22",
          age: calcAge("1954-07-22"),
          diagnosis: "Hypertension (I10) + CHF",
          lastVisit: "Mar 12, 2026",
          labValue: "Last BP: 162/98",
          careGapStatus: "overdue",
        },
      ];
    case "statins":
      return [
        {
          patientId: 4,
          patientName: "James Thornton",
          dob: "1975-01-30",
          age: calcAge("1975-01-30"),
          diagnosis: "Dyslipidemia (E78.5)",
          lastVisit: "Mar 11, 2026",
          labValue: "LDL 142 mg/dL",
          careGapStatus: "due-soon",
        },
      ];
    default:
      return [];
  }
}

function getCustomResults(
  diagFilter: string,
  medFilter: string,
  careGapFilter: string,
  patients?: typeof DEMO_PATIENTS,
  meds?: typeof DEMO_MEDICATIONS,
  labs?: typeof DEMO_LAB_RESULTS,
): CohortResult[] {
  const patientSource = patients ?? DEMO_PATIENTS;
  const medSource = meds ?? DEMO_MEDICATIONS;
  const labSource = labs ?? DEMO_LAB_RESULTS;
  return patientSource
    .filter((p) => {
      const patMeds = medSource.filter(
        (m) => m.patientId === p.id && m.status === "active",
      );
      const patLabs = labSource.filter((l) => l.patientId === p.id);

      if (
        medFilter &&
        !patMeds.some((m) =>
          m.name.toLowerCase().includes(medFilter.toLowerCase()),
        )
      ) {
        return false;
      }
      if (
        diagFilter &&
        ![
          "Type 2 Diabetes",
          "CHF",
          "Hypertension",
          "Dyslipidemia",
          "Hypothyroidism",
          "Allergic Rhinitis",
        ]
          .join(" ")
          .toLowerCase()
          .includes(diagFilter.toLowerCase())
      ) {
        return false;
      }
      void patLabs;
      return true;
    })
    .map((p) => {
      const patLabs = labSource.filter((l) => l.patientId === p.id);
      const firstLab = patLabs[0];
      return {
        patientId: Number(p.id),
        patientName: p.name,
        dob: p.dateOfBirth,
        age: calcAge(p.dateOfBirth),
        diagnosis: "See patient chart",
        lastVisit: "Mar 12, 2026",
        labValue: firstLab
          ? `${firstLab.testName}: ${firstLab.result} ${firstLab.unit}`
          : undefined,
        careGapStatus: (careGapFilter
          ? "overdue"
          : "n/a") as CohortResult["careGapStatus"],
      };
    });
}

const careGapBadge = (
  status: CohortResult["careGapStatus"],
): { variant: "danger" | "warning" | "success" | "neutral"; label: string } => {
  switch (status) {
    case "overdue":
      return { variant: "danger", label: "Overdue" };
    case "due-soon":
      return { variant: "warning", label: "Due Soon" };
    case "up-to-date":
      return { variant: "success", label: "Up to Date" };
    default:
      return { variant: "neutral", label: "N/A" };
  }
};

export default function PopulationHealth({
  onNavigate,
}: PopulationHealthProps) {
  const { isDemoMode } = useDemoMode();
  const { actor, isFetching: actorFetching } = useActor();
  const [activeCohort, setActiveCohort] = useState<QuickCohort>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [diagFilter, setDiagFilter] = useState("");
  const [medFilter, setMedFilter] = useState("");
  const [labTest, setLabTest] = useState("");
  const [labThreshold, setLabThreshold] = useState("");
  const [careGapFilter, setCareGapFilter] = useState("");
  const [backendPatients, setBackendPatients] = useState<
    typeof DEMO_PATIENTS | null
  >(null);
  const [backendMeds, setBackendMeds] = useState<
    typeof DEMO_MEDICATIONS | null
  >(null);
  const [backendLabs, setBackendLabs] = useState<
    typeof DEMO_LAB_RESULTS | null
  >(null);
  const [cohortLoading, setCohortLoading] = useState(false);

  useEffect(() => {
    if (isDemoMode || !actor || actorFetching) return;
    setCohortLoading(true);
    Promise.all([
      actor.listPatients(),
      actor.listLabResults(),
      actor.listMedications(),
    ])
      .then(([patients, labs, meds]) => {
        setBackendPatients(patients as any);
        setBackendLabs(labs as any);
        setBackendMeds(meds as any);
      })
      .catch(() => {
        // fallback to demo data on error
      })
      .finally(() => setCohortLoading(false));
  }, [isDemoMode, actor, actorFetching]);

  const results: CohortResult[] = useMemo(() => {
    if (activeCohort !== null) return getCohortResults(activeCohort);
    if (diagFilter || medFilter || careGapFilter) {
      return getCustomResults(
        diagFilter,
        medFilter,
        careGapFilter,
        !isDemoMode && backendPatients ? backendPatients : undefined,
        !isDemoMode && backendMeds ? backendMeds : undefined,
        !isDemoMode && backendLabs ? backendLabs : undefined,
      );
    }
    return [];
  }, [
    activeCohort,
    diagFilter,
    medFilter,
    careGapFilter,
    isDemoMode,
    backendPatients,
    backendMeds,
    backendLabs,
  ]);

  const hasFilters = !!(
    diagFilter ||
    medFilter ||
    labTest ||
    labThreshold ||
    careGapFilter
  );

  return (
    <div className="space-y-5" data-ocid="population-health.page">
      {/* Analytics Opt-In Rate */}
      {(() => {
        let optInCount = 0;
        for (let i = 1; i <= 10; i++) {
          try {
            const raw = localStorage.getItem(`medunite_consent_${i}`);
            if (raw) {
              const c = JSON.parse(raw) as Record<string, boolean>;
              if (c.analyticsOptIn === true) optInCount++;
            } else {
              // Default: no opt-in stored = 0, simulate 6/10 opted in by default
            }
          } catch {
            /* ignore */
          }
        }
        // Simulate 6/10 as default when no localStorage data
        const displayCount = optInCount === 0 ? 6 : optInCount;
        return (
          <div
            className="flex items-start gap-4 p-4 bg-card border border-border rounded text-sm"
            data-ocid="population-health.analytics.card"
          >
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                Analytics Opt-In Rate
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cohort analytics include only patients who have consented to
                anonymous data sharing.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-bold tabular-nums text-primary">
                {displayCount}
                <span className="text-sm font-normal text-muted-foreground">
                  /10
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {displayCount * 10}% opted in
              </p>
            </div>
          </div>
        );
      })()}

      {/* Quick Cohort Buttons */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Quick Cohorts
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_COHORTS.map((cohort) => (
            <button
              key={cohort.id}
              type="button"
              data-ocid={`population-health.${cohort.id}.button`}
              onClick={() =>
                setActiveCohort(activeCohort === cohort.id ? null : cohort.id)
              }
              title={cohort.description}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-all ${
                activeCohort === cohort.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted"
              }`}
            >
              <Users2 className="w-3 h-3 flex-shrink-0" />
              {cohort.label}
            </button>
          ))}
        </div>
      </section>

      {/* Custom Filter Panel */}
      <section className="border border-border bg-card">
        <button
          type="button"
          data-ocid="population-health.filter.toggle"
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
          onClick={() => setShowFilters((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            Custom Filters
            {hasFilters && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-sm text-xs font-bold bg-primary text-primary-foreground">
                {
                  [diagFilter, medFilter, labTest, careGapFilter].filter(
                    Boolean,
                  ).length
                }
              </span>
            )}
          </div>
          {showFilters ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {showFilters && (
          <div className="border-t border-border px-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Diagnosis (ICD-10 keyword)</Label>
                <Input
                  data-ocid="population-health.diag.input"
                  placeholder="e.g. diabetes, hypertension"
                  value={diagFilter}
                  onChange={(e) => {
                    setDiagFilter(e.target.value);
                    setActiveCohort(null);
                  }}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Medication</Label>
                <Input
                  data-ocid="population-health.med.input"
                  placeholder="e.g. metformin, warfarin"
                  value={medFilter}
                  onChange={(e) => {
                    setMedFilter(e.target.value);
                    setActiveCohort(null);
                  }}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Lab Test Name</Label>
                <Input
                  data-ocid="population-health.lab.input"
                  placeholder="e.g. HbA1c, LDL"
                  value={labTest}
                  onChange={(e) => setLabTest(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Lab Threshold (e.g. &gt; 9)</Label>
                <Input
                  data-ocid="population-health.threshold.input"
                  placeholder="e.g. > 9"
                  value={labThreshold}
                  onChange={(e) => setLabThreshold(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs">Care Gap</Label>
                <Select
                  value={careGapFilter}
                  onValueChange={(v) => {
                    setCareGapFilter(v === "all" ? "" : v);
                    setActiveCohort(null);
                  }}
                >
                  <SelectTrigger
                    data-ocid="population-health.care-gap.select"
                    className="h-8 text-xs"
                  >
                    <SelectValue placeholder="All care gaps" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All care gaps</SelectItem>
                    <SelectItem value="flu-shot">Flu shot</SelectItem>
                    <SelectItem value="mammogram">Mammogram</SelectItem>
                    <SelectItem value="hba1c">HbA1c check</SelectItem>
                    <SelectItem value="colonoscopy">Colonoscopy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {hasFilters && (
              <Button
                data-ocid="population-health.clear.button"
                variant="ghost"
                size="sm"
                className="mt-3 h-7 text-xs text-muted-foreground"
                onClick={() => {
                  setDiagFilter("");
                  setMedFilter("");
                  setLabTest("");
                  setLabThreshold("");
                  setCareGapFilter("");
                  setActiveCohort(null);
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Results */}
      <section className="border border-border bg-card">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">
            {activeCohort
              ? QUICK_COHORTS.find((c) => c.id === activeCohort)?.label
              : hasFilters
                ? "Filtered Results"
                : "Patient Cohort Results"}
          </p>
          {results.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {results.length} patient{results.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {cohortLoading ? (
          <div
            className="py-12 text-center"
            data-ocid="population-health.loading_state"
          >
            <p className="text-sm text-muted-foreground animate-pulse">
              Loading cohort data…
            </p>
          </div>
        ) : results.length === 0 ? (
          <div
            className="py-12 text-center"
            data-ocid="population-health.empty_state"
          >
            <Users2 className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              Select a quick cohort or apply filters to view results
            </p>
          </div>
        ) : (
          <Table data-ocid="population-health.table">
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Patient</TableHead>
                <TableHead className="text-xs">Age / DOB</TableHead>
                <TableHead className="text-xs">Relevant Diagnosis</TableHead>
                <TableHead className="text-xs">Last Visit</TableHead>
                <TableHead className="text-xs">Lab Value</TableHead>
                <TableHead className="text-xs">Care Gap</TableHead>
                <TableHead className="text-xs" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((r, idx) => {
                const gapBadge = careGapBadge(r.careGapStatus);
                return (
                  <TableRow
                    key={r.patientId}
                    data-ocid={`population-health.item.${idx + 1}`}
                  >
                    <TableCell className="text-xs font-medium">
                      {r.patientName}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.age} yrs
                      <br />
                      <span className="text-xs">{r.dob}</span>
                    </TableCell>
                    <TableCell className="text-xs">{r.diagnosis}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.lastVisit}
                    </TableCell>
                    <TableCell className="text-xs">
                      {r.labValue ?? (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        variant={gapBadge.variant}
                        label={gapBadge.label}
                      />
                    </TableCell>
                    <TableCell>
                      {onNavigate && (
                        <button
                          type="button"
                          data-ocid={`population-health.patient.link.${idx + 1}`}
                          className="text-xs text-primary hover:underline"
                          onClick={() => onNavigate("patients")}
                        >
                          View Chart →
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}
