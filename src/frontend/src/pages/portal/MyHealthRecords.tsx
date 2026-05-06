import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DEMO_REFILL_REQUESTS, type DemoRefillRequest } from "@/demoData";
import { useActor } from "@/hooks/useActor";
import { printClinicalSummary } from "@/utils/ccdExport";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type LabFlag = "normal" | "high" | "low" | "critical";

interface LabResult {
  id: bigint;
  test: string;
  result: string;
  unit: string;
  referenceRange: string;
  flag: LabFlag;
}

interface VisitNote {
  id: bigint;
  title: string;
  content: string;
  noteType: string;
}

interface Medication {
  id: bigint;
  name: string;
  dose: string;
  frequency: string;
  status: string;
}

const labFlagVariant = (
  f: LabFlag,
): "success" | "danger" | "warning" | "info" => {
  switch (f) {
    case "normal":
      return "success";
    case "high":
      return "warning";
    case "low":
      return "info";
    case "critical":
      return "danger";
  }
};

const medStatusVariant = (s: string): "success" | "neutral" | "warning" => {
  switch (s) {
    case "active":
      return "success";
    case "discontinued":
      return "neutral";
    case "on-hold":
      return "warning";
    default:
      return "neutral";
  }
};

const resultColor = (flag: LabFlag) => {
  switch (flag) {
    case "normal":
      return "var(--success)";
    case "critical":
      return "var(--destructive)";
    default:
      return "var(--warning)";
  }
};

const SKEL_KEYS = ["a", "b", "c", "d", "e", "f"];
const SkeletonRows = ({ cols, count }: { cols: number; count: number }) => (
  <>
    {SKEL_KEYS.slice(0, count).map((rk) => (
      <tr key={rk} className="border-b border-border last:border-0">
        {SKEL_KEYS.slice(0, cols).map((ck) => (
          <td key={ck} className="px-4 py-3">
            <Skeleton className="h-4 w-24" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const VISIT_SUMMARIES = [
  {
    id: 1,
    date: "2026-02-14",
    provider: "Dr. Sarah Chen",
    visitType: "Follow-up Visit",
    diagnoses: [
      "E11.9 - Type 2 Diabetes Mellitus",
      "I10 - Essential Hypertension",
    ],
    medications: ["Metformin 1000mg twice daily", "Lisinopril 10mg once daily"],
    orders: ["HbA1c", "Comprehensive Metabolic Panel"],
    followUp: "Return in 3 months for repeat HbA1c and blood pressure check.",
    education:
      "Discussed DASH diet, home blood pressure monitoring, and foot care for diabetes.",
  },
  {
    id: 2,
    date: "2025-11-05",
    provider: "Dr. Sarah Chen",
    visitType: "Annual Physical",
    diagnoses: ["Z00.00 - Encounter for general adult medical exam"],
    medications: ["Atorvastatin 20mg once daily"],
    orders: ["CBC", "Lipid Panel", "TSH"],
    followUp: "Follow up in 12 months or sooner if any new concerns arise.",
    education:
      "Discussed preventive care, vaccinations, and healthy lifestyle modifications.",
  },
  {
    id: 3,
    date: "2025-08-20",
    provider: "Dr. Marcus Williams",
    visitType: "Specialist Consultation",
    diagnoses: ["I25.10 - Coronary artery disease"],
    medications: ["Aspirin 81mg once daily", "Atorvastatin 40mg once daily"],
    orders: ["Stress test", "Echocardiogram"],
    followUp: "Cardiology follow-up in 6 weeks after stress test results.",
    education:
      "Reviewed cardiac risk factors, activity restrictions, and when to seek emergency care.",
  },
];

export default function MyHealthRecords() {
  const { actor, isFetching } = useActor();
  const [tab, setTab] = useState<
    "labs" | "notes" | "meds" | "summaries" | "history"
  >("labs");
  const [expandedNote, setExpandedNote] = useState<bigint | null>(null);
  const [expandedSummary, setExpandedSummary] = useState<number | null>(null);

  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [labsLoading, setLabsLoading] = useState(true);

  const [visitNotes, setVisitNotes] = useState<VisitNote[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);

  const [medications, setMedications] = useState<Medication[]>([]);
  const [refillOpen, setRefillOpen] = useState<string | null>(null);
  const [refillNotes, setRefillNotes] = useState("");
  const [refillSubmitted, setRefillSubmitted] = useState<Set<string>>(
    new Set(),
  );
  const [medsLoading, setMedsLoading] = useState(true);

  useEffect(() => {
    if (isFetching || !actor) return;

    // Fetch all three in parallel
    Promise.all([
      actor.listLabResults(),
      actor.listClinicalNotes(),
      actor.listMedications(),
    ])
      .then(([labs, notes, meds]) => {
        setLabResults(
          labs.map((r) => ({
            id: r.id,
            test: r.testName,
            result: r.result,
            unit: r.unit,
            referenceRange: "\u2014",
            flag: r.isCritical ? "critical" : "normal",
          })),
        );
        setLabsLoading(false);

        setVisitNotes(
          notes.map((n) => ({
            id: n.id,
            title: n.noteType || "Visit Note",
            content: n.content,
            noteType: n.noteType,
          })),
        );
        setNotesLoading(false);

        setMedications(
          meds.map((m) => ({
            id: m.id,
            name: m.name,
            dose: m.dose,
            frequency: m.frequency,
            status: m.status,
          })),
        );
        setMedsLoading(false);
      })
      .catch(() => {
        setLabsLoading(false);
        setNotesLoading(false);
        setMedsLoading(false);
      });
  }, [actor, isFetching]);

  return (
    <div data-ocid="records.page">
      {/* Download Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[12px] text-muted-foreground">
          Your personal health records from MedUnite Clinic
        </p>
        <Button
          variant="outline"
          size="sm"
          data-ocid="records.download.button"
          onClick={() =>
            printClinicalSummary({
              name: "Alex Johnson",
              dob: "1985-06-14",
              mrn: "PTL-001",
              diagnoses: [
                "E11.9 - Type 2 Diabetes Mellitus",
                "I10 - Essential Hypertension",
              ],
              medications: [
                { name: "Metformin", dose: "1000mg", frequency: "Twice daily" },
                { name: "Lisinopril", dose: "10mg", frequency: "Once daily" },
                { name: "Atorvastatin", dose: "20mg", frequency: "Once daily" },
              ],
              allergies: ["Penicillin — Hives", "Sulfa drugs — Rash"],
              recentLabs: labResults.slice(0, 5).map((l) => ({
                test: l.test,
                result: l.result,
                date: "Mar 2026",
                flag: l.flag,
              })),
              activeOrders: [],
            })
          }
          className="h-7 text-xs gap-1.5"
        >
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download My Health Summary
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border mb-5">
        {(
          [
            { id: "labs", label: "Lab Results" },
            { id: "notes", label: "Visit Notes" },
            { id: "meds", label: "Medications" },
            { id: "summaries", label: "Visit Summaries" },
            { id: "history", label: "Visit History" },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            data-ocid={`records.${id}.tab`}
            onClick={() => setTab(id)}
            className={[
              "px-5 py-2.5 text-[13px] font-medium transition-all border-b-2 -mb-px",
              tab === id
                ? "text-primary border-b-primary"
                : "text-muted-foreground border-b-transparent hover:text-foreground",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lab Results */}
      {tab === "labs" && (
        <div
          className="bg-card border border-border rounded-sm overflow-hidden"
          data-ocid="records.labs.table"
        >
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Test
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Result
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Reference Range
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Flag
                </th>
              </tr>
            </thead>
            <tbody>
              {labsLoading ? (
                <SkeletonRows cols={4} count={3} />
              ) : labResults.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-[13px] text-muted-foreground"
                    data-ocid="records.labs.empty_state"
                  >
                    No lab results on file.
                  </td>
                </tr>
              ) : (
                labResults.map((r, idx) => (
                  <tr
                    key={String(r.id)}
                    data-ocid={`records.labs.item.${idx + 1}`}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {r.test}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="font-semibold"
                        style={{ color: resultColor(r.flag) }}
                      >
                        {r.result} {r.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.referenceRange}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        variant={labFlagVariant(r.flag)}
                        label={r.flag}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Visit Notes */}
      {tab === "notes" && (
        <div className="space-y-2" data-ocid="records.notes.list">
          {notesLoading ? (
            <div className="space-y-2">
              {["a", "b", "c"].map((k) => (
                <div
                  key={k}
                  className="bg-card border border-border rounded-sm p-4"
                >
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>
          ) : visitNotes.length === 0 ? (
            <div
              className="py-8 text-center text-[13px] text-muted-foreground bg-card border border-border rounded-sm"
              data-ocid="records.notes.empty_state"
            >
              No records have been shared yet. After your first appointment,
              your provider will add a clinical summary here.
            </div>
          ) : (
            visitNotes.map((note, idx) => (
              <div
                key={String(note.id)}
                data-ocid={`records.notes.item.${idx + 1}`}
                className="bg-card border border-border rounded-sm overflow-hidden"
              >
                <button
                  type="button"
                  data-ocid={`records.notes.toggle.${idx + 1}`}
                  onClick={() =>
                    setExpandedNote(expandedNote === note.id ? null : note.id)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">
                      {note.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {note.noteType}
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform"
                    style={{
                      transform:
                        expandedNote === note.id
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {expandedNote === note.id && (
                  <div className="px-4 pb-4 border-t border-border">
                    <p className="text-[13px] text-foreground leading-relaxed mt-3">
                      {note.content}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Visit Summaries */}
      {tab === "summaries" && (
        <div className="space-y-2" data-ocid="records.summaries.list">
          {VISIT_SUMMARIES.map((summary, idx) => (
            <div
              key={summary.id}
              data-ocid={`records.summaries.item.${idx + 1}`}
              className="bg-card border border-border rounded-sm overflow-hidden"
            >
              <button
                type="button"
                data-ocid={`records.summaries.toggle.${idx + 1}`}
                onClick={() =>
                  setExpandedSummary(
                    expandedSummary === summary.id ? null : summary.id,
                  )
                }
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="text-[13px] font-semibold text-foreground">
                    {summary.visitType}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {summary.date} · {summary.provider}
                  </p>
                </div>
                <svg
                  className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform"
                  style={{
                    transform:
                      expandedSummary === summary.id
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {expandedSummary === summary.id && (
                <div className="px-4 pb-4 border-t border-border space-y-3 mt-0">
                  <div className="pt-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Diagnoses
                    </p>
                    {summary.diagnoses.map((d) => (
                      <p key={d} className="text-[13px] text-foreground">
                        {d}
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Medications
                    </p>
                    {summary.medications.map((m) => (
                      <p key={m} className="text-[13px] text-foreground">
                        {m}
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Orders
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {summary.orders.map((o) => (
                        <span
                          key={o}
                          className="text-xs px-2 py-0.5 bg-muted border border-border rounded-sm font-medium text-foreground"
                        >
                          {o}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Follow-up Instructions
                    </p>
                    <p className="text-[13px] text-foreground">
                      {summary.followUp}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Patient Education
                    </p>
                    <p className="text-[13px] text-foreground">
                      {summary.education}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Medications */}
      {tab === "meds" && (
        <div
          className="bg-card border border-border rounded-sm overflow-hidden"
          data-ocid="records.meds.table"
        >
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Medication
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Dose
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Frequency
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {medsLoading ? (
                <SkeletonRows cols={4} count={3} />
              ) : medications.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-[13px] text-muted-foreground"
                    data-ocid="records.meds.empty_state"
                  >
                    No medications on file.
                  </td>
                </tr>
              ) : (
                medications.map((med, idx) => (
                  <tr
                    key={String(med.id)}
                    data-ocid={`records.meds.item.${idx + 1}`}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {med.name}
                    </td>
                    <td className="px-4 py-3 text-foreground">{med.dose}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {med.frequency}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        variant={medStatusVariant(med.status)}
                        label={med.status}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {med.status === "active" && (
                        <div className="inline-block">
                          {refillSubmitted.has(String(med.id)) ? (
                            <span
                              className="text-xs text-success font-medium"
                              data-ocid={`records.refill.success_state.${idx + 1}`}
                            >
                              ✓ Requested
                            </span>
                          ) : (
                            <button
                              type="button"
                              data-ocid={`records.refill.button.${idx + 1}`}
                              onClick={() =>
                                setRefillOpen(
                                  refillOpen === String(med.id)
                                    ? null
                                    : String(med.id),
                                )
                              }
                              className="text-xs px-2 py-0.5 font-semibold text-primary border border-primary/30 rounded-sm hover:bg-primary/10 transition-colors"
                            >
                              {refillOpen === String(med.id)
                                ? "Cancel"
                                : "Request Refill"}
                            </button>
                          )}
                          {refillOpen === String(med.id) &&
                            !refillSubmitted.has(String(med.id)) && (
                              <div className="mt-2 min-w-[220px] text-left">
                                <textarea
                                  data-ocid={`records.refill.textarea.${idx + 1}`}
                                  value={refillNotes}
                                  onChange={(e) =>
                                    setRefillNotes(e.target.value)
                                  }
                                  placeholder="Notes to pharmacist (optional)"
                                  rows={2}
                                  className="w-full text-xs border border-border bg-background p-1.5 rounded-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                                <button
                                  type="button"
                                  data-ocid={`records.refill.submit_button.${idx + 1}`}
                                  onClick={() => {
                                    const newReq: DemoRefillRequest = {
                                      id: `rr${Date.now()}`,
                                      patientId: "portal",
                                      patientName: "Portal Patient",
                                      medication: `${med.name}${med.dose ? ` ${med.dose}` : ""}`,
                                      requestedAt:
                                        new Date()
                                          .toISOString()
                                          .split("T")[0] ?? "",
                                      status: "pending",
                                      notes: refillNotes,
                                    };
                                    void newReq;
                                    setRefillSubmitted(
                                      (prev) =>
                                        new Set([...prev, String(med.id)]),
                                    );
                                    setRefillOpen(null);
                                    setRefillNotes("");
                                  }}
                                  className="mt-1.5 w-full text-xs font-semibold py-1 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
                                >
                                  Submit Request
                                </button>
                              </div>
                            )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Visit History */}
      {tab === "history" && (
        <div className="space-y-3" data-ocid="records.history.list">
          <p className="text-[12px] text-muted-foreground">
            Your complete visit history. Download an After-Visit Summary for any
            past encounter.
          </p>
          {VISIT_SUMMARIES.map((visit, idx) => (
            <div
              key={visit.id}
              data-ocid={`records.history.item.${idx + 1}`}
              className="bg-card border border-border rounded-sm px-4 py-3 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground">
                  {visit.visitType}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {visit.date} · {visit.provider}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {visit.diagnoses.map((d) => (
                    <span
                      key={d}
                      className="text-xs px-1.5 py-0.5 bg-muted border border-border rounded-sm text-muted-foreground"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                data-ocid={`records.history.download.button.${idx + 1}`}
                onClick={() => {
                  toast.success(
                    `After-Visit Summary downloaded for ${visit.date} — ${visit.visitType}`,
                  );
                  window.print();
                }}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download AVS
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
