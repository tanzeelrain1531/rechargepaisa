import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DEMO_APPOINTMENTS,
  DEMO_CARE_GAPS,
  DEMO_LAB_RESULTS,
  DEMO_MEDICATIONS,
  DEMO_PATIENTS,
  DEMO_VITALS,
} from "@/demoData";
import {
  AlertTriangle,
  Calendar,
  Download,
  FlaskConical,
  Heart,
  Pill,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { usePortalContext } from "../../contexts/PortalContext";

function buildLabTrends(patientId: bigint) {
  const PORTAL_PATIENT_ID = patientId;
  const labs = DEMO_LAB_RESULTS.filter(
    (l) => l.patientId === PORTAL_PATIENT_ID,
  );
  // Group by test name with simulated time series
  const hba1cSeries = [
    { month: "Sep '25", value: 8.8 },
    { month: "Nov '25", value: 8.4 },
    { month: "Jan '26", value: 8.2 },
    { month: "Mar '26", value: 7.9 },
  ];
  const glucoseSeries = [
    { month: "Sep '25", value: 210 },
    { month: "Nov '25", value: 195 },
    { month: "Jan '26", value: 182 },
    { month: "Mar '26", value: 168 },
  ];
  const creatinineSeries = [
    { month: "Sep '25", value: 0.95 },
    { month: "Nov '25", value: 0.98 },
    { month: "Jan '26", value: 1.02 },
    { month: "Mar '26", value: 0.99 },
  ];

  // Mark abnormals from real data
  const abnormalCount = labs.filter((l) => l.isCritical).length;
  return {
    hba1cSeries,
    glucoseSeries,
    creatinineSeries,
    abnormalCount,
    totalLabs: labs.length,
  };
}

function buildVitalsTrends(patientId: bigint) {
  const PORTAL_PATIENT_ID = patientId;
  const vitals = DEMO_VITALS.filter((v) => v.patientId === PORTAL_PATIENT_ID)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((v) => ({
      date: new Date(v.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      systolic: Number.parseInt(v.bp.split("/")[0] ?? "0"),
      weight: Math.round(v.weight * 2.205), // kg to lbs
    }));
  return vitals;
}

function buildMedTimeline(patientId: bigint) {
  const PORTAL_PATIENT_ID = patientId;
  return DEMO_MEDICATIONS.filter(
    (m) => m.patientId === PORTAL_PATIENT_ID && m.status === "active",
  );
}

interface RiskFactor {
  label: string;
  contribution: number;
  detail: string;
}

function computeHealthRisk(patientId: bigint): {
  score: number;
  factors: RiskFactor[];
  summary: string;
} {
  const PORTAL_PATIENT_ID = patientId;
  const patient = DEMO_PATIENTS.find((p) => p.id === PORTAL_PATIENT_ID);
  const factors: RiskFactor[] = [];
  let riskPoints = 0;

  // Age factor
  if (patient?.dateOfBirth) {
    const age =
      new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
    const ageFactor =
      age >= 70 ? 20 : age >= 60 ? 14 : age >= 50 ? 8 : age >= 40 ? 4 : 0;
    if (ageFactor > 0) {
      riskPoints += ageFactor;
      factors.push({
        label: "Age",
        contribution: ageFactor,
        detail: `Age ${age} adds baseline risk`,
      });
    }
  }

  // Conditions factor
  const patientMeds = DEMO_MEDICATIONS.filter(
    (m) => m.patientId === PORTAL_PATIENT_ID && m.status === "active",
  );
  const medCount = patientMeds.length;
  const conditionRisk = Math.min(25, medCount * 3);
  if (conditionRisk > 0) {
    riskPoints += conditionRisk;
    factors.push({
      label: "Active Conditions",
      contribution: conditionRisk,
      detail: `${medCount} active medications indicate managed conditions`,
    });
  }

  // Abnormal labs factor
  const abnormalLabs = DEMO_LAB_RESULTS.filter(
    (l) => l.patientId === PORTAL_PATIENT_ID && l.isCritical,
  ).length;
  const labRisk = Math.min(20, abnormalLabs * 8);
  if (labRisk > 0) {
    riskPoints += labRisk;
    factors.push({
      label: "Abnormal Labs",
      contribution: labRisk,
      detail: `${abnormalLabs} critical result${abnormalLabs > 1 ? "s" : ""}`,
    });
  }

  // Care gaps factor
  const overdueGaps = DEMO_CARE_GAPS.filter(
    (g) =>
      g.patientId === PORTAL_PATIENT_ID && new Date(g.dueDate) < new Date(),
  ).length;
  const gapRisk = Math.min(15, overdueGaps * 5);
  if (gapRisk > 0) {
    riskPoints += gapRisk;
    factors.push({
      label: "Missed Screenings",
      contribution: gapRisk,
      detail: `${overdueGaps} overdue preventive care item${overdueGaps > 1 ? "s" : ""}`,
    });
  }

  const score = Math.min(100, Math.max(5, riskPoints));

  let summary = "";
  if (score < 30) {
    summary =
      "Your overall health risk is low. Keep up with your preventive care schedule.";
  } else if (score < 60) {
    summary =
      "Your overall health risk is moderate. Your HbA1c has been improving over the past 6 months. Consider scheduling your annual eye exam.";
  } else {
    summary =
      "Your overall health risk is elevated. Several factors need attention. Discuss a care plan with your provider at your next visit.";
  }

  return { score, factors, summary };
}

function computeHealthScore(abnormalLabs: number, overdueGaps: number): number {
  let score = 100;
  score -= abnormalLabs * 8;
  score -= overdueGaps * 6;
  return Math.max(20, Math.min(100, score));
}

function HealthScoreArc({ score }: { score: number }) {
  const angle = (score / 100) * 180;
  const color =
    score >= 75
      ? "var(--success)"
      : score >= 50
        ? "var(--warning)"
        : "var(--destructive)";
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-14 overflow-hidden">
        {/* Background arc */}
        <div
          className="absolute inset-0 rounded-t-full border-8 border-muted"
          style={{ borderBottom: "none" }}
        />
        {/* Score arc */}
        <div
          className="absolute inset-0 rounded-t-full border-8"
          style={{
            borderColor: color,
            borderBottom: "none",
            transform: `rotate(${angle - 180}deg)`,
            transformOrigin: "50% 100%",
            transition: "transform 1s ease",
          }}
        />
      </div>
      <div className="-mt-2 text-center">
        <span className="text-3xl font-bold tabular-nums" style={{ color }}>
          {score}
        </span>
        <span className="text-sm text-muted-foreground">/100</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {score >= 75
          ? "Good"
          : score >= 50
            ? "Needs attention"
            : "Action required"}
      </p>
    </div>
  );
}

export default function MyData() {
  const { id: PORTAL_PATIENT_ID } = usePortalContext();
  const loaded = true;

  const { hba1cSeries, glucoseSeries, creatinineSeries, abnormalCount } =
    buildLabTrends(PORTAL_PATIENT_ID);
  const vitalsData = buildVitalsTrends(PORTAL_PATIENT_ID);
  const activeMeds = buildMedTimeline(PORTAL_PATIENT_ID);
  // Count care gaps with past due dates
  const overdueGaps = DEMO_CARE_GAPS.filter(
    (g) =>
      g.patientId === PORTAL_PATIENT_ID && new Date(g.dueDate) < new Date(),
  ).length;
  const healthScore = computeHealthScore(abnormalCount, overdueGaps);
  const riskData = computeHealthRisk(PORTAL_PATIENT_ID);

  // Combined lab trend data
  const labChartData = hba1cSeries.map((row, i) => ({
    month: row.month,
    hba1c: row.value,
    glucose: glucoseSeries[i]?.value,
    creatinine: creatinineSeries[i]?.value,
  }));

  function handleDownload() {
    const data = {
      exportedAt: new Date().toISOString(),
      patient: { id: 4, name: "Aisha Patel", mrn: "MRN-004" },
      labs: DEMO_LAB_RESULTS.filter(
        (l) => l.patientId === PORTAL_PATIENT_ID,
      ).map((l) => ({ test: l.testName, result: l.result, unit: l.unit })),
      vitals: DEMO_VITALS.filter((v) => v.patientId === PORTAL_PATIENT_ID).map(
        (v) => ({ date: v.date, bp: v.bp, hr: v.hr, weight: v.weight }),
      ),
      medications: DEMO_MEDICATIONS.filter(
        (m) => m.patientId === PORTAL_PATIENT_ID,
      ).map((m) => ({
        name: m.name,
        dose: m.dose,
        frequency: m.frequency,
        status: m.status,
      })),
      appointments: DEMO_APPOINTMENTS.filter(
        (a) => a.patientId === PORTAL_PATIENT_ID,
      ).map((a) => ({ date: a.date, status: a.status })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-health-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Health data downloaded successfully");
  }

  if (!loaded) {
    return (
      <div className="space-y-4" data-ocid="mydata.loading_state">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="mydata.page">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-foreground">My Health Data</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your complete health picture, owned by you.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          data-ocid="mydata.download_button"
          onClick={handleDownload}
          className="gap-1.5 flex-shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          Download My Data
        </Button>
      </div>

      {/* Health Risk Score Panel */}
      <Card data-ocid="mydata.health_risk.panel" className="border-border">
        <CardHeader className="px-5 py-4 border-b border-border">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            Health Risk Score
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 py-4">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex flex-col items-center min-w-[120px]">
              <HealthScoreArc score={riskData.score} />
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-sm text-muted-foreground">
                {riskData.summary}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {riskData.factors.map((f) => (
                  <div
                    key={f.label}
                    className="bg-muted rounded p-2 space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">
                        {f.label}
                      </span>
                      <span className="text-xs font-bold text-destructive">
                        +{f.contribution}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {f.detail}
                    </p>
                  </div>
                ))}
                {riskData.factors.length === 0 && (
                  <div className="col-span-4 text-xs text-muted-foreground">
                    No significant risk factors identified.
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card data-ocid="mydata.health_score.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Health Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pt-0">
            <HealthScoreArc score={healthScore} />
          </CardContent>
        </Card>

        <Card data-ocid="mydata.abnormal_labs.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-warning" />
              Abnormal Labs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tabular-nums text-foreground">
              {abnormalCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {abnormalCount === 0
                ? "All results within range"
                : `${abnormalCount} result${abnormalCount > 1 ? "s" : ""} outside normal range`}
            </p>
            {abnormalCount > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-warning">
                <AlertTriangle className="w-3 h-3" />
                Review with your provider
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-ocid="mydata.care_gaps.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Heart className="w-4 h-4 text-destructive" />
              Care Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tabular-nums text-foreground">
              {overdueGaps}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {overdueGaps === 0
                ? "All screenings up to date"
                : `${overdueGaps} overdue screening${overdueGaps > 1 ? "s" : ""}`}
            </p>
            {overdueGaps > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                <AlertTriangle className="w-3 h-3" />
                Schedule with your provider
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lab Trends */}
      <Card data-ocid="mydata.lab_trends.card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-primary" />
            Lab Trends
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Key results tracked over time
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={labChartData}
                margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="hba1c"
                  domain={[4, 12]}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <YAxis
                  yAxisId="glucose"
                  orientation="right"
                  domain={[60, 300]}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                {/* Reference band for normal HbA1c */}
                <ReferenceArea
                  yAxisId="hba1c"
                  y1={4}
                  y2={5.7}
                  fill="var(--success)"
                  fillOpacity={0.06}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    fontSize: 12,
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: 11,
                    color: "var(--muted-foreground)",
                  }}
                />
                <Line
                  yAxisId="hba1c"
                  type="monotone"
                  dataKey="hba1c"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="HbA1c (%)"
                />
                <Line
                  yAxisId="glucose"
                  type="monotone"
                  dataKey="glucose"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Glucose (mg/dL)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Vitals Trends */}
      <Card data-ocid="mydata.vitals_trends.card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            Vitals Trends
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Blood pressure and weight over time
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={vitalsData}
                margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="bp"
                  domain={[60, 180]}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <YAxis
                  yAxisId="weight"
                  orientation="right"
                  domain={[140, 165]}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                {/* Normal BP reference */}
                <ReferenceArea
                  yAxisId="bp"
                  y1={100}
                  y2={130}
                  fill="var(--success)"
                  fillOpacity={0.06}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    fontSize: 12,
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: 11,
                    color: "var(--muted-foreground)",
                  }}
                />
                <Line
                  yAxisId="bp"
                  type="monotone"
                  dataKey="systolic"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Systolic BP (mmHg)"
                />
                <Line
                  yAxisId="weight"
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Weight (lbs)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Active Medications Timeline */}
      <Card data-ocid="mydata.medications.card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Pill className="w-4 h-4 text-primary" />
            Active Medications
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Current medication schedule
          </p>
        </CardHeader>
        <CardContent>
          {activeMeds.length === 0 ? (
            <p
              className="text-sm text-muted-foreground py-4 text-center"
              data-ocid="mydata.medications.empty_state"
            >
              No active medications on file.
            </p>
          ) : (
            <div className="space-y-3" data-ocid="mydata.medications.list">
              {activeMeds.map((med, idx) => (
                <div
                  key={String(med.id)}
                  data-ocid={`mydata.medications.item.${idx + 1}`}
                  className="flex items-center gap-3"
                >
                  <div className="w-28 flex-shrink-0">
                    <p className="text-xs font-semibold text-foreground leading-tight">
                      {med.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {med.dose} · {med.frequency}
                    </p>
                  </div>
                  <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden relative">
                    {/* Timeline bar — simulates ongoing from ~6 months ago */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: "100%",
                        background: `var(--chart-${(idx % 5) + 1})`,
                        opacity: 0.4,
                      }}
                    />
                    <div
                      className="absolute inset-y-0 rounded-full"
                      style={{
                        left: `${10 + ((idx * 5) % 20)}%`,
                        right: "0%",
                        background: `var(--chart-${(idx % 5) + 1})`,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0 w-12 text-right">
                    Present
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-2 mt-1">
                <span>6 months ago</span>
                <span>Today</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Health Timeline */}
      <Card data-ocid="mydata.timeline.card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Health Timeline
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Your recent health events in chronological order
          </p>
        </CardHeader>
        <CardContent>
          <HealthTimeline />
        </CardContent>
      </Card>
    </div>
  );
}

function HealthTimeline() {
  type TimelineEvent =
    | { type: "visit"; date: Date; label: string; sub: string }
    | { type: "lab"; date: Date; label: string; sub: string }
    | { type: "medication"; date: Date; label: string; sub: string };

  const events: TimelineEvent[] = [];

  // Visits from appointments
  for (const a of DEMO_APPOINTMENTS.filter((a) => a.patientId === 1n)) {
    events.push({
      type: "visit",
      date: new Date(a.date),
      label: `Visit: ${a.status}`,
      sub: new Date(a.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });
  }

  // Lab results
  for (const l of DEMO_LAB_RESULTS.filter((l) => l.patientId === 1n)) {
    const critical = l.isCritical ? " (CRITICAL)" : "";
    events.push({
      type: "lab",
      date: new Date(),
      label: `Lab: ${l.testName} ${l.result}${l.unit ? ` ${l.unit}` : ""}${critical}`,
      sub: "On file",
    });
  }

  // Medications
  for (const m of DEMO_MEDICATIONS.filter((m) => m.patientId === 1n)) {
    events.push({
      type: "medication",
      date: new Date(),
      label: `Med: ${m.name} ${m.dose ?? ""}`,
      sub: m.status === "active" ? "Active" : (m.status ?? "On file"),
    });
  }

  const sorted = events
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 12);

  if (sorted.length === 0) {
    return (
      <p
        className="text-sm text-muted-foreground py-4 text-center"
        data-ocid="mydata.timeline.empty_state"
      >
        No timeline events found.
      </p>
    );
  }

  return (
    <div
      className="relative ml-4 pl-4 border-l-2 border-border space-y-4"
      data-ocid="mydata.timeline.list"
    >
      {sorted.map((event, i) => {
        const iconClass =
          event.type === "visit"
            ? "bg-primary/10 text-primary"
            : event.type === "lab"
              ? "bg-warning/10 text-warning"
              : "bg-success/10 text-success";
        const Icon =
          event.type === "visit"
            ? Calendar
            : event.type === "lab"
              ? FlaskConical
              : Pill;
        return (
          <div
            key={`${event.type}-${String(i)}`}
            data-ocid={`mydata.timeline.item.${i + 1}`}
            className="flex items-start gap-3 relative"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[22px] top-0.5 w-3 h-3 rounded-full border-2 border-background bg-border" />
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${iconClass}`}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground leading-snug">
                {event.label}
              </p>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0 text-right">
              {event.sub}
            </span>
          </div>
        );
      })}
    </div>
  );
}
