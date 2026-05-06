import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { StatusBadge } from "../components/StatusBadge";

interface QualityMetric {
  id: string;
  name: string;
  current: number;
  target: number;
  category: string;
}

const metrics: QualityMetric[] = [
  {
    id: "hba1c",
    name: "Diabetic HbA1c Control (<8%)",
    current: 68,
    target: 80,
    category: "Diabetes",
  },
  {
    id: "htn",
    name: "Hypertension Control (<140/90)",
    current: 74,
    target: 75,
    category: "Cardiovascular",
  },
  {
    id: "mammo",
    name: "Preventive Care – Mammography",
    current: 61,
    target: 70,
    category: "Preventive",
  },
  {
    id: "cervical",
    name: "Cervical Cancer Screening",
    current: 79,
    target: 85,
    category: "Preventive",
  },
  {
    id: "immun",
    name: "Childhood Immunizations",
    current: 92,
    target: 90,
    category: "Preventive",
  },
  {
    id: "colorectal",
    name: "Colorectal Cancer Screening",
    current: 55,
    target: 68,
    category: "Preventive",
  },
];

function getMetricStatus(
  current: number,
  target: number,
): { variant: "success" | "warning" | "danger"; label: string } {
  if (current >= target) return { variant: "success", label: "Met" };
  if (current >= target - 10)
    return { variant: "warning", label: "Near Target" };
  return { variant: "danger", label: "Below Target" };
}

function getBarColor(current: number, target: number): string {
  if (current >= target) return "bg-success";
  if (current >= target - 10) return "bg-warning";
  return "bg-destructive";
}

const mipsBreakdown = [
  { label: "Quality", weight: 45, score: 38 },
  { label: "Promoting Interoperability", weight: 25, score: 22 },
  { label: "Improvement Activities", weight: 15, score: 13 },
  { label: "Cost", weight: 15, score: 9 },
];

const measuresTable = [
  {
    measure: "HbA1c Poor Control (>9%)",
    category: "Diabetes",
    eligible: 145,
    meeting: 98,
    rate: 67.6,
    target: 75,
    status: "warning" as const,
  },
  {
    measure: "Blood Pressure Control (<140/90)",
    category: "Cardiovascular",
    eligible: 210,
    meeting: 155,
    rate: 73.8,
    target: 75,
    status: "warning" as const,
  },
  {
    measure: "Statin Therapy – Cardiovascular",
    category: "Cardiovascular",
    eligible: 88,
    meeting: 72,
    rate: 81.8,
    target: 80,
    status: "success" as const,
  },
  {
    measure: "Annual Mammography 50-74",
    category: "Preventive",
    eligible: 92,
    meeting: 56,
    rate: 60.9,
    target: 70,
    status: "danger" as const,
  },
  {
    measure: "Cervical Cancer Screening",
    category: "Preventive",
    eligible: 118,
    meeting: 93,
    rate: 78.8,
    target: 85,
    status: "warning" as const,
  },
  {
    measure: "Colorectal Cancer Screening",
    category: "Preventive",
    eligible: 203,
    meeting: 112,
    rate: 55.2,
    target: 68,
    status: "danger" as const,
  },
  {
    measure: "Childhood Immunization Status",
    category: "Preventive",
    eligible: 78,
    meeting: 72,
    rate: 92.3,
    target: 90,
    status: "success" as const,
  },
  {
    measure: "Depression Screening (PHQ-9)",
    category: "Behavioral Health",
    eligible: 340,
    meeting: 289,
    rate: 85.0,
    target: 80,
    status: "success" as const,
  },
  {
    measure: "Tobacco Use Screening",
    category: "Behavioral Health",
    eligible: 520,
    meeting: 498,
    rate: 95.8,
    target: 90,
    status: "success" as const,
  },
  {
    measure: "Diabetic Eye Exam",
    category: "Diabetes",
    eligible: 145,
    meeting: 88,
    rate: 60.7,
    target: 75,
    status: "danger" as const,
  },
];

export default function QualityMeasures() {
  const [loading] = useState(false);
  const mipsTotal = mipsBreakdown.reduce((s, b) => s + b.score, 0);

  if (loading) {
    return (
      <div className="space-y-5" data-ocid="quality.loading_state">
        {["sk-1", "sk-2", "sk-3"].map((k) => (
          <Skeleton key={k} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="quality.page">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {metrics.map((m, i) => {
          const status = getMetricStatus(m.current, m.target);
          const barColor = getBarColor(m.current, m.target);
          return (
            <Card key={m.id} data-ocid={`quality.card.${i + 1}`}>
              <CardContent className="pt-4 pb-4 space-y-2">
                <p className="text-xs text-muted-foreground font-medium leading-tight">
                  {m.name}
                </p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-foreground">
                    {m.current}%
                  </span>
                  <StatusBadge variant={status.variant} label={status.label} />
                </div>
                <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all ${barColor}`}
                    style={{ width: `${m.current}%` }}
                  />
                  {/* Target marker */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-foreground/40"
                    style={{ left: `${m.target}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Target: {m.target}%
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* MIPS Score */}
      <Card data-ocid="quality.mips.card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              MIPS Composite Score
            </CardTitle>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">
                {mipsTotal}
              </span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {mipsBreakdown.map((b) => (
            <div key={b.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">{b.label}</span>
                <span className="text-xs text-muted-foreground">
                  {b.score}/{b.weight} pts
                </span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(b.score / b.weight) * 100}%` }}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-1">
            2025 performance year · Reporting period: Jan – Dec
          </p>
        </CardContent>
      </Card>

      {/* Measures Table */}
      <Card data-ocid="quality.measures.table">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Detailed Measures
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Measure</TableHead>
                <TableHead className="text-xs">Category</TableHead>
                <TableHead className="text-xs text-right">Eligible</TableHead>
                <TableHead className="text-xs text-right">Meeting</TableHead>
                <TableHead className="text-xs text-right">Rate</TableHead>
                <TableHead className="text-xs text-right">Target</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {measuresTable.map((row, i) => (
                <TableRow
                  key={row.measure}
                  data-ocid={`quality.measures.row.${i + 1}`}
                >
                  <TableCell className="text-xs font-medium">
                    {row.measure}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {row.category}
                  </TableCell>
                  <TableCell className="text-xs text-right">
                    {row.eligible}
                  </TableCell>
                  <TableCell className="text-xs text-right">
                    {row.meeting}
                  </TableCell>
                  <TableCell className="text-xs text-right font-semibold">
                    {row.rate.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-xs text-right text-muted-foreground">
                    {row.target}%
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      variant={
                        row.status === "success"
                          ? "success"
                          : row.status === "warning"
                            ? "warning"
                            : "danger"
                      }
                      label={
                        row.status === "success"
                          ? "Met"
                          : row.status === "warning"
                            ? "Near Target"
                            : "Below Target"
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
