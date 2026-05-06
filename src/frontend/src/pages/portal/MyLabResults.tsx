import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FlaskConical } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusBadge } from "../../components/StatusBadge";
import { useActor } from "../../hooks/useActor";

interface LabResult {
  id: bigint;
  testName: string;
  result: string;
  unit: string;
  isCritical: boolean;
  patientId: bigint;
}

interface RefRange {
  low: number;
  high: number;
  unit: string;
  label: string;
}

const REFERENCE_RANGES: Record<string, RefRange> = {
  Glucose: { low: 70, high: 99, unit: "mg/dL", label: "70-99 mg/dL" },
  Hemoglobin: { low: 12, high: 17, unit: "g/dL", label: "12-17 g/dL" },
  WBC: { low: 4.5, high: 11.0, unit: "K/uL", label: "4.5-11.0 K/uL" },
  Creatinine: { low: 0.6, high: 1.2, unit: "mg/dL", label: "0.6-1.2 mg/dL" },
  Cholesterol: { low: 0, high: 200, unit: "mg/dL", label: "<200 mg/dL" },
  Platelets: { low: 150, high: 400, unit: "K/uL", label: "150-400 K/uL" },
  HbA1c: { low: 0, high: 5.7, unit: "%", label: "<5.7%" },
};

function getFlag(
  testName: string,
  result: string,
  isCritical: boolean,
): { variant: "success" | "warning" | "danger" | "critical"; label: string } {
  if (isCritical) return { variant: "critical", label: "Critical" };

  const ref = REFERENCE_RANGES[testName];
  const num = Number.parseFloat(result);
  if (!ref || Number.isNaN(num))
    return { variant: "neutral" as "success", label: "Normal" };

  const range = ref.high - ref.low;
  const criticalMargin = range * 0.2;

  if (num < ref.low) {
    if (num < ref.low - criticalMargin)
      return { variant: "critical", label: "Critical" };
    return { variant: "warning", label: "Low" };
  }
  if (num > ref.high) {
    if (num > ref.high + criticalMargin)
      return { variant: "critical", label: "Critical" };
    return { variant: "danger", label: "High" };
  }
  return { variant: "success", label: "Normal" };
}

// ── Sparkline trend data ─────────────────────────────────────────────────────

interface TrendReading {
  month: string;
  value: number;
}

const HBA1C_TREND: TrendReading[] = [
  { month: "Oct", value: 8.1 },
  { month: "Nov", value: 7.9 },
  { month: "Dec", value: 7.6 },
  { month: "Jan", value: 7.4 },
  { month: "Feb", value: 7.2 },
  { month: "Mar", value: 7.0 },
];

const GLUCOSE_TREND: TrendReading[] = [
  { month: "Oct", value: 142 },
  { month: "Nov", value: 138 },
  { month: "Dec", value: 131 },
  { month: "Jan", value: 127 },
  { month: "Feb", value: 118 },
  { month: "Mar", value: 112 },
];

const CREATININE_TREND: TrendReading[] = [
  { month: "Oct", value: 1.1 },
  { month: "Nov", value: 1.15 },
  { month: "Dec", value: 1.2 },
  { month: "Jan", value: 1.28 },
  { month: "Feb", value: 1.32 },
  { month: "Mar", value: 1.38 },
];

function buildPolyline(data: TrendReading[], w: number, h: number): string {
  const values = data.map((d) => d.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const rangeV = maxV === minV ? 1 : maxV - minV;
  const padH = 4;
  const padV = 4;
  return data
    .map((d, i) => {
      const x = padH + (i / (data.length - 1)) * (w - padH * 2);
      const y = padV + (1 - (d.value - minV) / rangeV) * (h - padV * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function TrendArrow({ direction }: { direction: "up" | "down" | "stable" }) {
  if (direction === "up")
    return (
      <svg
        className="w-3 h-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden="true"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    );
  if (direction === "down")
    return (
      <svg
        className="w-3 h-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    );
  return (
    <svg
      className="w-3 h-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

interface SparkCardProps {
  label: string;
  unit: string;
  currentValue: number;
  refRange: string;
  trendDirection: "up" | "down" | "stable";
  trendMeaning: "good" | "bad" | "neutral";
  data: TrendReading[];
}

function SparkCard({
  label,
  unit,
  currentValue,
  refRange,
  trendDirection,
  trendMeaning,
  data,
}: SparkCardProps) {
  const W = 120;
  const H = 50;
  const polyline = buildPolyline(data, W, H);
  const lineColor =
    trendMeaning === "good"
      ? "var(--success)"
      : trendMeaning === "bad"
        ? "var(--destructive)"
        : "var(--primary)";
  const arrowColor =
    trendMeaning === "good"
      ? "var(--success)"
      : trendMeaning === "bad"
        ? "var(--destructive)"
        : "var(--primary)";

  return (
    <div
      className="flex items-center gap-3 p-3 bg-card border border-border rounded-sm min-w-0"
      style={{ minWidth: 200 }}
    >
      {/* Sparkline */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="flex-shrink-0"
        role="img"
        aria-label={`${label} trend chart`}
      >
        <polyline
          points={polyline}
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Dots for each reading */}
        {data.map((d, i) => {
          const values = data.map((x) => x.value);
          const minV = Math.min(...values);
          const maxV = Math.max(...values);
          const rangeV = maxV === minV ? 1 : maxV - minV;
          const padH = 4;
          const padV = 4;
          const x = padH + (i / (data.length - 1)) * (W - padH * 2);
          const y = padV + (1 - (d.value - minV) / rangeV) * (H - padV * 2);
          return <circle key={d.month} cx={x} cy={y} r="2" fill={lineColor} />;
        })}
      </svg>

      {/* Label + Value */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide truncate">
          {label}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-lg font-bold tabular-nums text-foreground leading-none">
            {currentValue}
          </span>
          <span className="text-xs text-muted-foreground leading-none mt-0.5">
            {unit}
          </span>
          <span
            className="ml-1"
            style={{ color: arrowColor }}
            aria-label={`Trend: ${trendDirection}`}
          >
            <TrendArrow direction={trendDirection} />
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Ref: {refRange}</p>
      </div>
    </div>
  );
}

export default function MyLabResults() {
  const { actor, isFetching } = useActor();
  const [results, setResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .listLabResults()
      .then((data) => setResults(data as LabResult[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actor, isFetching]);

  return (
    <div className="space-y-5" data-ocid="portal.labs.page">
      {/* Trend Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SparkCard
          label="HbA1c"
          unit="%"
          currentValue={7.0}
          refRange="<5.7%"
          trendDirection="down"
          trendMeaning="good"
          data={HBA1C_TREND}
        />
        <SparkCard
          label="Glucose"
          unit="mg/dL"
          currentValue={112}
          refRange="70-99 mg/dL"
          trendDirection="down"
          trendMeaning="good"
          data={GLUCOSE_TREND}
        />
        <SparkCard
          label="Creatinine"
          unit="mg/dL"
          currentValue={1.38}
          refRange="0.6-1.2 mg/dL"
          trendDirection="up"
          trendMeaning="bad"
          data={CREATININE_TREND}
        />
      </div>

      {/* Results Table */}
      {loading ? (
        <div className="space-y-2" data-ocid="portal.labs.loading_state">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-10 w-full" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div
          className="border border-border bg-card rounded-sm p-12 flex flex-col items-center gap-3 text-center"
          data-ocid="portal.labs.empty_state"
        >
          <FlaskConical className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            No results available yet
          </p>
          <p className="text-xs text-muted-foreground">
            Results will appear here after your provider orders and completes a
            lab test.
          </p>
        </div>
      ) : (
        <div className="border border-border bg-card">
          <Table data-ocid="portal.labs.table">
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-muted/60">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Test Name
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((r, i) => {
                const ref = REFERENCE_RANGES[r.testName];
                const flag = getFlag(r.testName, r.result, r.isCritical);
                return (
                  <TableRow
                    key={String(r.id)}
                    data-ocid={`portal.labs.row.${i + 1}`}
                    className="hover:bg-muted/30 even:bg-muted/20 border-l-2 border-l-transparent hover:border-l-accent transition-all"
                  >
                    <TableCell className="font-medium text-sm px-4 py-2.5">
                      {r.testName}
                    </TableCell>
                    <TableCell className="font-mono text-sm px-4 py-2.5">
                      {r.result}
                    </TableCell>
                    <TableCell className="text-sm px-4 py-2.5 text-muted-foreground">
                      {r.unit || "—"}
                    </TableCell>
                    <TableCell className="text-sm px-4 py-2.5 text-muted-foreground">
                      {ref ? ref.label : "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <StatusBadge variant={flag.variant} label={flag.label} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
