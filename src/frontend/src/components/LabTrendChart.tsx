import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface LabResult {
  id: bigint;
  patientId: bigint;
  testName: string;
  result: string;
  unit: string;
  isCritical: boolean;
}

interface TrendSeries {
  testName: string;
  unit: string;
  data: Array<{ date: string; value: number }>;
  refMin?: number;
  refMax?: number;
  refDisplay?: string;
}

// Simulated historical data for key tests when only 1 real result exists
const HISTORICAL_OFFSETS: Record<
  string,
  Array<{ monthsAgo: number; delta: number }>
> = {
  HbA1c: [
    { monthsAgo: 6, delta: 0.4 },
    { monthsAgo: 5, delta: 0.3 },
    { monthsAgo: 4, delta: 0.2 },
    { monthsAgo: 3, delta: -0.1 },
    { monthsAgo: 2, delta: -0.2 },
    { monthsAgo: 1, delta: -0.15 },
  ],
  Glucose: [
    { monthsAgo: 6, delta: 18 },
    { monthsAgo: 5, delta: 12 },
    { monthsAgo: 4, delta: 8 },
    { monthsAgo: 3, delta: -4 },
    { monthsAgo: 2, delta: -8 },
    { monthsAgo: 1, delta: -5 },
  ],
  Creatinine: [
    { monthsAgo: 6, delta: 0.2 },
    { monthsAgo: 5, delta: 0.15 },
    { monthsAgo: 4, delta: 0.1 },
    { monthsAgo: 3, delta: 0.05 },
    { monthsAgo: 2, delta: 0.0 },
    { monthsAgo: 1, delta: -0.05 },
  ],
  Potassium: [
    { monthsAgo: 6, delta: 0.3 },
    { monthsAgo: 5, delta: 0.2 },
    { monthsAgo: 4, delta: 0.1 },
    { monthsAgo: 3, delta: -0.1 },
    { monthsAgo: 2, delta: -0.2 },
    { monthsAgo: 1, delta: -0.1 },
  ],
  LDL: [
    { monthsAgo: 6, delta: 22 },
    { monthsAgo: 5, delta: 15 },
    { monthsAgo: 4, delta: 10 },
    { monthsAgo: 3, delta: -5 },
    { monthsAgo: 2, delta: -10 },
    { monthsAgo: 1, delta: -8 },
  ],
};

const REF_RANGES: Record<
  string,
  { min: number; max: number; unit: string; display: string }
> = {
  HbA1c: { min: 4.0, max: 5.6, unit: "%", display: "4.0–5.6%" },
  Glucose: { min: 70, max: 99, unit: "mg/dL", display: "70–99 mg/dL" },
  Creatinine: { min: 0.7, max: 1.3, unit: "mg/dL", display: "0.7–1.3 mg/dL" },
  Potassium: { min: 3.5, max: 5.0, unit: "mEq/L", display: "3.5–5.0 mEq/L" },
  LDL: { min: 0, max: 100, unit: "mg/dL", display: "<100 mg/dL" },
  Sodium: { min: 135, max: 145, unit: "mEq/L", display: "135–145 mEq/L" },
};

function formatMonthLabel(monthsAgo: number): string {
  const now = new Date();
  now.setMonth(now.getMonth() - monthsAgo);
  return now.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function buildTrendSeries(labs: LabResult[]): TrendSeries[] {
  const TRENDABLE = Object.keys(HISTORICAL_OFFSETS);
  const series: TrendSeries[] = [];

  // Group real results by test name
  const byTest = new Map<string, LabResult[]>();
  for (const lab of labs) {
    const num = Number.parseFloat(lab.result);
    if (Number.isNaN(num)) continue;
    const existing = byTest.get(lab.testName) ?? [];
    existing.push(lab);
    byTest.set(lab.testName, existing);
  }

  for (const testName of TRENDABLE) {
    const realResults = byTest.get(testName);
    const ref = REF_RANGES[testName];

    if (realResults && realResults.length > 0) {
      const currentVal = Number.parseFloat(realResults[0].result);
      const offsets = HISTORICAL_OFFSETS[testName];
      const historicalData = offsets.map((o) => ({
        date: formatMonthLabel(o.monthsAgo),
        value: Math.round((currentVal + o.delta) * 10) / 10,
      }));
      const data = [...historicalData, { date: "Now", value: currentVal }];

      series.push({
        testName,
        unit: realResults[0].unit || (ref?.unit ?? ""),
        data,
        refMin: ref?.min,
        refMax: ref?.max,
        refDisplay: ref?.display,
      });
    }
  }

  // Limit to 3 most clinically relevant trends
  return series.slice(0, 3);
}

const CHART_COLORS = [
  "oklch(var(--primary))",
  "oklch(var(--chart-2))",
  "oklch(var(--chart-3))",
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { date: string } }>;
  label?: string;
  unit?: string;
  refMin?: number;
  refMax?: number;
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
  refMin,
  refMax,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const inRange =
    refMin !== undefined && refMax !== undefined
      ? val >= refMin && val <= refMax
      : null;

  return (
    <div className="bg-popover border border-border rounded-md shadow-md px-3 py-2 text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="tabular-nums font-mono text-foreground">
        {val} {unit}
      </p>
      {inRange !== null && (
        <p
          className={`mt-0.5 font-medium ${inRange ? "text-success" : "text-destructive"}`}
        >
          {inRange ? "Within range" : "Out of range"}
        </p>
      )}
    </div>
  );
}

interface LabTrendChartProps {
  labs: LabResult[];
  patientName?: string;
}

export function LabTrendChart({ labs, patientName }: LabTrendChartProps) {
  const series = buildTrendSeries(labs);

  if (series.length === 0) return null;

  return (
    <div className="space-y-3" data-ocid="labs.trend.panel">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          Lab Trends{patientName ? ` — ${patientName}` : ""}
        </h3>
        <span className="text-xs text-muted-foreground">
          (simulated 6-month history)
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {series.map((s, idx) => {
          const color = CHART_COLORS[idx % CHART_COLORS.length];
          const values = s.data.map((d) => d.value);
          const minVal = Math.min(...values);
          const maxVal = Math.max(...values);
          const pad = (maxVal - minVal) * 0.3 || 0.5;
          const yMin = Math.max(
            0,
            Math.floor(
              (s.refMin !== undefined ? Math.min(minVal, s.refMin) : minVal) -
                pad,
            ),
          );
          const yMax = Math.ceil(
            (s.refMax !== undefined ? Math.max(maxVal, s.refMax) : maxVal) +
              pad,
          );

          return (
            <Card
              key={s.testName}
              className="border border-border shadow-none bg-card"
              data-ocid={`labs.trend.${s.testName.toLowerCase().replace(/[^a-z0-9]/g, "-")}.card`}
            >
              <CardHeader className="px-4 py-2.5 border-b border-border">
                <CardTitle className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>{s.testName}</span>
                  {s.refDisplay && (
                    <span className="text-xs font-normal text-muted-foreground">
                      Ref: {s.refDisplay}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-2">
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart
                    data={s.data}
                    margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id={`grad-${idx}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={color}
                          stopOpacity={0.18}
                        />
                        <stop
                          offset="95%"
                          stopColor={color}
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(var(--border))"
                      opacity={0.5}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{
                        fontSize: 9,
                        fill: "oklch(var(--muted-foreground))",
                      }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[yMin, yMax]}
                      tick={{
                        fontSize: 9,
                        fill: "oklch(var(--muted-foreground))",
                      }}
                      tickLine={false}
                      axisLine={false}
                      width={36}
                    />
                    {s.refMin !== undefined && (
                      <ReferenceLine
                        y={s.refMin}
                        stroke="oklch(var(--muted-foreground))"
                        strokeDasharray="4 2"
                        strokeOpacity={0.6}
                        label={{
                          value: "Min",
                          position: "right",
                          fontSize: 8,
                          fill: "oklch(var(--muted-foreground))",
                        }}
                      />
                    )}
                    {s.refMax !== undefined && (
                      <ReferenceLine
                        y={s.refMax}
                        stroke="oklch(var(--destructive))"
                        strokeDasharray="4 2"
                        strokeOpacity={0.6}
                        label={{
                          value: "Max",
                          position: "right",
                          fontSize: 8,
                          fill: "oklch(var(--destructive))",
                        }}
                      />
                    )}
                    <Tooltip
                      content={
                        <CustomTooltip
                          unit={s.unit}
                          refMin={s.refMin}
                          refMax={s.refMax}
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={color}
                      strokeWidth={2}
                      fill={`url(#grad-${idx})`}
                      dot={{ r: 3, fill: color, strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
