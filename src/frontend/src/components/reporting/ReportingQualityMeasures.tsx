import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart2, Calendar, TrendingUp, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard } from "./StatCard";

const QUALITY_MEASURES = [
  {
    name: "Diabetic HbA1c Control (<8%)",
    category: "Diabetes",
    rate: 71,
    benchmark: 75,
    status: "Below",
    trend: "↓",
  },
  {
    name: "Blood Pressure Control (<140/90)",
    category: "Cardiovascular",
    rate: 82,
    benchmark: 80,
    status: "Meeting",
    trend: "↑",
  },
  {
    name: "Breast Cancer Screening (Mammogram)",
    category: "Preventive",
    rate: 68,
    benchmark: 70,
    status: "Below",
    trend: "→",
  },
  {
    name: "Colorectal Cancer Screening",
    category: "Preventive",
    rate: 74,
    benchmark: 75,
    status: "Below",
    trend: "↑",
  },
  {
    name: "Flu Vaccination Rate",
    category: "Immunization",
    rate: 89,
    benchmark: 80,
    status: "Above",
    trend: "↑",
  },
  {
    name: "Pneumococcal Vaccination",
    category: "Immunization",
    rate: 76,
    benchmark: 70,
    status: "Above",
    trend: "→",
  },
  {
    name: "Statin Therapy for CVD",
    category: "Cardiovascular",
    rate: 91,
    benchmark: 85,
    status: "Above",
    trend: "↑",
  },
  {
    name: "Depression Screening (PHQ-9)",
    category: "Behavioral",
    rate: 63,
    benchmark: 70,
    status: "Below",
    trend: "↓",
  },
  {
    name: "Tobacco Use Screening",
    category: "Preventive",
    rate: 94,
    benchmark: 90,
    status: "Above",
    trend: "↑",
  },
];

export function ReportingQualityMeasures() {
  return (
    <div className="space-y-4">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        data-ocid="reporting.quality.summary.section"
      >
        <StatCard
          ocid="reporting.quality.score.card"
          title="Overall Quality Score"
          value="78%"
          sub="composite across 9 measures"
          icon={TrendingUp}
          iconClass="text-muted-foreground"
        />
        <StatCard
          ocid="reporting.quality.benchmark.card"
          title="Measures Meeting Benchmark"
          value="6 / 9"
          sub="5 above, 1 at, 3 below"
          icon={BarChart2}
          iconClass="text-muted-foreground"
        />
        <StatCard
          ocid="reporting.quality.gaps.card"
          title="Patients Flagged for Gaps"
          value={23}
          sub="care gap alerts this period"
          icon={Users}
          iconClass="text-muted-foreground"
        />
        <StatCard
          ocid="reporting.quality.period.card"
          title="Reporting Period"
          value="Q1 2026"
          sub="Jan 1 – Mar 31, 2026"
          icon={Calendar}
          iconClass="text-muted-foreground"
        />
      </div>

      <Card
        className="border border-border shadow-card bg-card"
        data-ocid="reporting.quality.chart.card"
      >
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Compliance Rate vs. Benchmark
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={QUALITY_MEASURES}
              layout="vertical"
              margin={{ top: 0, right: 40, left: 140, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(var(--border))"
                horizontal={false}
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "oklch(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                unit="%"
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: "oklch(var(--foreground))" }}
                tickLine={false}
                axisLine={false}
                width={140}
              />
              <RechartsTooltip
                formatter={(v: number) => [`${v}%`]}
                contentStyle={{
                  fontSize: 11,
                  background: "oklch(var(--popover))",
                  border: "1px solid oklch(var(--border))",
                  borderRadius: 6,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar
                dataKey="rate"
                name="Rate %"
                fill="oklch(var(--primary))"
                radius={[0, 3, 3, 0]}
                opacity={0.85}
              />
              <Bar
                dataKey="benchmark"
                name="Benchmark %"
                fill="oklch(var(--muted-foreground))"
                radius={[0, 3, 3, 0]}
                opacity={0.4}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card
        className="border border-border shadow-card bg-card"
        data-ocid="reporting.quality.table"
      >
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
            HEDIS / Quality Measures — Q1 2026
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-muted/60">
                {[
                  "Measure",
                  "Category",
                  "Rate",
                  "Benchmark",
                  "Status",
                  "Trend",
                ].map((h) => (
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
              {QUALITY_MEASURES.map((m, i) => (
                <TableRow
                  key={m.name}
                  data-ocid={`reporting.quality.row.${i + 1}`}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="px-4 py-3 text-sm font-medium text-foreground max-w-[280px]">
                    {m.name}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-muted text-muted-foreground">
                      {m.category}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-semibold tabular-nums text-right">
                    <span
                      className={
                        m.status === "Above"
                          ? "text-success"
                          : m.status === "Below"
                            ? "text-destructive"
                            : "text-foreground"
                      }
                    >
                      {m.rate}%
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm tabular-nums text-right text-muted-foreground">
                    {m.benchmark}%
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold ${
                        m.status === "Above"
                          ? "bg-success/8 text-success border border-success/25"
                          : m.status === "Meeting"
                            ? "bg-primary/8 text-primary border border-primary/20"
                            : "bg-destructive/8 text-destructive border border-destructive/20"
                      }`}
                    >
                      {m.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <span
                      className={`text-base font-bold ${
                        m.trend === "↑"
                          ? "text-success"
                          : m.trend === "↓"
                            ? "text-destructive"
                            : "text-muted-foreground"
                      }`}
                    >
                      {m.trend}
                    </span>
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
