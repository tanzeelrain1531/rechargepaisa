import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  DEMO_MENTAL_HEALTH_ASSESSMENTS,
  DEMO_PATIENTS,
  type DemoMentalHealthAssessment,
} from "@/demoData";
import { useActor } from "@/hooks/useActor";
import { Brain, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself or that you are a failure",
  "Trouble concentrating on things, such as reading or watching television",
  "Moving or speaking so slowly that other people could have noticed",
  "Thoughts that you would be better off dead, or thoughts of hurting yourself",
];

const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen",
];

const SCORE_LABELS = [
  "Not at all",
  "Several days",
  "More than half the days",
  "Nearly every day",
];

function getPHQ9Severity(score: number): {
  label: string;
  variant: "success" | "info" | "warning" | "danger";
} {
  if (score <= 4) return { label: "Minimal", variant: "success" };
  if (score <= 9) return { label: "Mild", variant: "info" };
  if (score <= 14) return { label: "Moderate", variant: "warning" };
  if (score <= 19) return { label: "Moderately Severe", variant: "danger" };
  return { label: "Severe", variant: "danger" };
}

function getGAD7Severity(score: number): {
  label: string;
  variant: "success" | "info" | "warning" | "danger";
} {
  if (score <= 4) return { label: "Minimal", variant: "success" };
  if (score <= 9) return { label: "Mild", variant: "info" };
  if (score <= 14) return { label: "Moderate", variant: "warning" };
  return { label: "Severe", variant: "danger" };
}

function getSeverity(type: "PHQ-9" | "GAD-7", score: number) {
  return type === "PHQ-9" ? getPHQ9Severity(score) : getGAD7Severity(score);
}

function getCareRecommendation(type: "PHQ-9" | "GAD-7", score: number): string {
  const sev = getSeverity(type, score);
  if (sev.label === "Minimal")
    return "Score indicates minimal symptoms. Continue monitoring at routine visits.";
  if (sev.label === "Mild") {
    return type === "PHQ-9"
      ? "Score suggests mild depression. Consider watchful waiting and follow-up in 2–4 weeks."
      : "Score suggests mild anxiety. Psychoeducation and lifestyle modifications recommended.";
  }
  if (sev.label === "Moderate") {
    return type === "PHQ-9"
      ? "Score suggests moderate depression — consider therapy referral or medication evaluation."
      : "Score suggests moderate anxiety — consider therapy referral (CBT) or medication review.";
  }
  return type === "PHQ-9"
    ? "Score suggests severe depression — urgent mental health referral and safety assessment indicated."
    : "Score suggests severe anxiety — urgent referral to mental health specialist recommended.";
}

interface MentalHealthTrendPoint {
  date: string;
  phq9?: number;
  gad7?: number;
}

function buildTrendData(
  assessments: DemoMentalHealthAssessment[],
): MentalHealthTrendPoint[] {
  const byDate: Record<string, MentalHealthTrendPoint> = {};
  for (const a of assessments) {
    const key = a.date;
    if (!byDate[key]) byDate[key] = { date: key };
    if (a.type === "PHQ-9") byDate[key].phq9 = a.totalScore;
    else byDate[key].gad7 = a.totalScore;
  }
  return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
}

interface AssessmentTableProps {
  assessments: DemoMentalHealthAssessment[];
  compact?: boolean;
}

function AssessmentTable({ assessments, compact }: AssessmentTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  if (assessments.length === 0) {
    return (
      <div
        className="py-8 text-center text-muted-foreground text-sm"
        data-ocid="mental_health.empty_state"
      >
        No assessments on record.
      </div>
    );
  }

  return (
    <Table data-ocid="mental_health.table">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Severity</TableHead>
          {!compact && <TableHead>Provider</TableHead>}
          {!compact && <TableHead />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {assessments.map((a, idx) => {
          const sev = getSeverity(a.type, a.totalScore);
          const isOpen = expanded.has(a.id);
          return (
            <>
              <TableRow key={a.id} data-ocid={`mental_health.item.${idx + 1}`}>
                <TableCell className="text-sm">{a.date}</TableCell>
                <TableCell>
                  <span className="text-xs font-semibold bg-muted px-2 py-0.5 rounded">
                    {a.type}
                  </span>
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  {a.totalScore}
                </TableCell>
                <TableCell>
                  <StatusBadge variant={sev.variant} label={sev.label} />
                </TableCell>
                {!compact && (
                  <TableCell className="text-sm text-muted-foreground">
                    Dr. {a.providerId === 1 ? "Williams" : "Chen"}
                  </TableCell>
                )}
                {!compact && (
                  <TableCell>
                    <button
                      type="button"
                      className="text-primary text-xs font-medium flex items-center gap-1 hover:underline"
                      onClick={() => {
                        const next = new Set(expanded);
                        if (isOpen) next.delete(a.id);
                        else next.add(a.id);
                        setExpanded(next);
                      }}
                      data-ocid={`mental_health.item.${idx + 1}.toggle`}
                    >
                      {isOpen ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                      {isOpen ? "Hide" : "Detail"}
                    </button>
                  </TableCell>
                )}
              </TableRow>
              {!compact && isOpen && (
                <TableRow key={`${a.id}-detail`}>
                  <TableCell colSpan={6} className="bg-muted/30 py-3 px-4">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Question Scores
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        {a.scores.map((s, scoreIdx) => (
                          <div
                            key={`q${scoreIdx + 1}`}
                            className="flex gap-2 text-xs"
                          >
                            <span className="font-semibold text-foreground">
                              Q{scoreIdx + 1}:
                            </span>
                            <span className="text-muted-foreground">
                              {s} — {SCORE_LABELS[s]}
                            </span>
                          </div>
                        ))}
                      </div>
                      {a.notes && (
                        <p className="text-xs text-muted-foreground mt-2">
                          <span className="font-semibold">Notes:</span>{" "}
                          {a.notes}
                        </p>
                      )}
                      <p className="text-xs text-warning-foreground bg-warning/10 border border-warning/20 rounded p-2 mt-2">
                        💡 {getCareRecommendation(a.type, a.totalScore)}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          );
        })}
      </TableBody>
    </Table>
  );
}

interface TrendChartProps {
  data: MentalHealthTrendPoint[];
}

function TrendChart({ data }: TrendChartProps) {
  if (data.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
        />
        <YAxis
          domain={[0, 27]}
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <ReferenceLine
          y={10}
          stroke="var(--warning)"
          strokeDasharray="4 4"
          label={{
            value: "Moderate",
            position: "right",
            fontSize: 11,
            fill: "var(--warning)",
          }}
        />
        <ReferenceLine
          y={20}
          stroke="var(--destructive)"
          strokeDasharray="4 4"
          label={{
            value: "Severe",
            position: "right",
            fontSize: 11,
            fill: "var(--destructive)",
          }}
        />
        <Line
          type="monotone"
          dataKey="phq9"
          name="PHQ-9"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={{ r: 3 }}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="gad7"
          name="GAD-7"
          stroke="var(--chart-2)"
          strokeWidth={2}
          dot={{ r: 3 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface NewAssessmentFormProps {
  patientId: bigint;
  onSaved: (a: DemoMentalHealthAssessment) => void;
  actor: any;
}

function NewAssessmentForm({
  patientId,
  onSaved,
  actor,
}: NewAssessmentFormProps) {
  const [type, setType] = useState<"PHQ-9" | "GAD-7">("PHQ-9");
  const questions = type === "PHQ-9" ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
  const [scores, setScores] = useState<number[]>(questions.map(() => 0));
  const [notes, setNotes] = useState("");

  const totalScore = scores.reduce((s, v) => s + v, 0);
  const sev = getSeverity(type, totalScore);

  function handleTypeChange(t: "PHQ-9" | "GAD-7") {
    setType(t);
    const qs = t === "PHQ-9" ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
    setScores(qs.map(() => 0));
  }

  function handleSave() {
    const date = new Date().toISOString().slice(0, 10);
    const a: DemoMentalHealthAssessment = {
      id: `mha-new-${Date.now()}`,
      patientId,
      type,
      date,
      scores,
      totalScore,
      severity: sev.label,
      providerId: 1,
      notes,
    };
    onSaved(a);

    // Wire to backend silently
    if (actor) {
      actor
        .createMentalHealthAssessment({
          id: 0n,
          scoresJson: JSON.stringify(scores),
          patientId,
          date,
          assessmentType: type,
          totalScore: BigInt(totalScore),
          notes,
          severity: sev.label,
          providerId: 1n,
        })
        .catch(() => {});
    }

    setScores(questions.map(() => 0));
    setNotes("");
  }

  return (
    <div
      className="border border-border rounded p-4 bg-muted/20 space-y-4"
      data-ocid="mental_health.new_assessment_panel"
    >
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1">
          <Label className="text-xs">Assessment Type</Label>
          <Select
            value={type}
            onValueChange={(v) => handleTypeChange(v as "PHQ-9" | "GAD-7")}
          >
            <SelectTrigger
              className="w-36"
              data-ocid="mental_health.type.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PHQ-9">PHQ-9</SelectItem>
              <SelectItem value="GAD-7">GAD-7</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Live score:</span>
          <span className="text-xl font-bold text-foreground">
            {totalScore}
          </span>
          <StatusBadge variant={sev.variant} label={sev.label} />
        </div>
      </div>

      <div className="space-y-2">
        {questions.map((q, qIdx) => (
          <div key={q} className="flex flex-col gap-1">
            <p className="text-xs text-foreground">
              <span className="font-semibold">Q{qIdx + 1}.</span> {q}
            </p>
            <div className="flex gap-2">
              {SCORE_LABELS.map((label, scoreVal) => (
                <label
                  key={label}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`q-${qIdx}`}
                    value={scoreVal}
                    checked={scores[qIdx] === scoreVal}
                    onChange={() => {
                      const next = [...scores];
                      next[qIdx] = scoreVal;
                      setScores(next);
                    }}
                    className="accent-primary"
                    data-ocid={`mental_health.q${qIdx + 1}.radio`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {scoreVal} — {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Clinical Notes</Label>
        <Textarea
          placeholder="Optional clinical observations..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          data-ocid="mental_health.notes.textarea"
        />
      </div>

      <div className="p-3 bg-muted rounded border border-border">
        <p className="text-xs text-muted-foreground">
          💡 <span className="font-semibold">Care pathway:</span>{" "}
          {getCareRecommendation(type, totalScore)}
        </p>
      </div>

      <Button
        onClick={handleSave}
        data-ocid="mental_health.save_assessment.button"
      >
        Save Assessment
      </Button>
    </div>
  );
}

interface MentalHealthProps {
  activePatientId?: bigint;
  activePatientName?: string;
  compact?: boolean;
}

export default function MentalHealth({
  activePatientId,
  activePatientName,
  compact,
}: MentalHealthProps) {
  const { actor, isFetching } = useActor();
  const [selectedPatientId, setSelectedPatientId] = useState<bigint>(
    activePatientId ?? DEMO_PATIENTS[0].id,
  );
  const [localAssessments, setLocalAssessments] = useState<
    DemoMentalHealthAssessment[]
  >([]);
  const [backendAssessments, setBackendAssessments] = useState<
    DemoMentalHealthAssessment[]
  >([]);
  const [isLoadingBackend, setIsLoadingBackend] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const patientId = activePatientId ?? selectedPatientId;

  useEffect(() => {
    if (isFetching || !actor) return;
    setIsLoadingBackend(true);
    actor
      .listMentalHealthAssessments()
      .then((results) => {
        const filtered = results
          .filter((a) => a.patientId === patientId)
          .map((a) => ({
            id: String(a.id),
            patientId: a.patientId,
            type: a.assessmentType as "PHQ-9" | "GAD-7",
            date: a.date,
            scores: (() => {
              try {
                return JSON.parse(a.scoresJson) as number[];
              } catch {
                return [];
              }
            })(),
            totalScore: Number(a.totalScore),
            severity: a.severity,
            providerId: Number(a.providerId),
            notes: a.notes,
          }));
        setBackendAssessments(filtered);
      })
      .catch(() => {})
      .finally(() => setIsLoadingBackend(false));
  }, [actor, isFetching, patientId]);

  // Merge: seed data + backend (deduplicate by date+type+patientId, prefer backend)
  const seedFiltered = DEMO_MENTAL_HEALTH_ASSESSMENTS.filter(
    (a) => a.patientId === patientId,
  ).filter(
    (seed) =>
      !backendAssessments.some(
        (b) => b.date === seed.date && b.type === seed.type,
      ),
  );

  const allAssessments = [
    ...localAssessments,
    ...backendAssessments,
    ...seedFiltered,
  ]
    .filter((a) => a.patientId === patientId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const trendData = buildTrendData(
    [...allAssessments].sort((a, b) => a.date.localeCompare(b.date)),
  );

  const patientName =
    activePatientName ??
    DEMO_PATIENTS.find((p) => p.id === selectedPatientId)?.name ??
    "Unknown Patient";

  return (
    <div className="p-5 space-y-5" data-ocid="mental_health.page">
      <div className="flex flex-wrap items-center gap-3">
        <Brain className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-semibold text-foreground">
          Mental Health Outcomes
        </h1>

        {!activePatientId && (
          <Select
            value={String(selectedPatientId)}
            onValueChange={(v) => setSelectedPatientId(BigInt(v))}
          >
            <SelectTrigger
              className="w-52"
              data-ocid="mental_health.patient.select"
            >
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {DEMO_PATIENTS.map((p) => (
                <SelectItem key={String(p.id)} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {activePatientId && (
          <span className="text-sm text-muted-foreground">— {patientName}</span>
        )}

        {!compact && (
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => setShowForm((v) => !v)}
            data-ocid="mental_health.new_assessment.open_modal_button"
          >
            <Plus className="w-3 h-3 mr-1" />
            {showForm ? "Cancel" : "New Assessment"}
          </Button>
        )}
      </div>

      {showForm && !compact && (
        <NewAssessmentForm
          patientId={patientId}
          actor={actor}
          onSaved={(a) => {
            setLocalAssessments((prev) => [a, ...prev]);
            setShowForm(false);
          }}
        />
      )}

      {isLoadingBackend ? (
        <div className="space-y-3" data-ocid="mental_health.loading_state">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <>
          {trendData.length > 0 && (
            <Card>
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-sm font-semibold">
                  Score Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <TrendChart data={trendData} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-sm font-semibold">
                Assessment History
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <AssessmentTable assessments={allAssessments} compact={compact} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
