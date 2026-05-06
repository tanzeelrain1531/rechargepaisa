import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Heart,
  Plus,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Wind,
} from "lucide-react";
import { useState } from "react";
import {
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { DEMO_VITALS, type DemoVitalReading } from "../../demoData";

function parseSystolic(bp: string): number {
  return Number.parseInt(bp.split("/")[0] ?? "0");
}

type Trend = "up" | "down" | "stable";

function numTrend(prev: number, curr: number, delta = 2): Trend {
  if (curr - prev > delta) return "up";
  if (prev - curr > delta) return "down";
  return "stable";
}

function TrendIcon({
  trend,
  invertColors = false,
}: { trend: Trend; invertColors?: boolean }) {
  if (trend === "up") {
    const cls = invertColors ? "text-success" : "text-warning";
    return <TrendingUp className={cn("w-3 h-3 inline", cls)} />;
  }
  if (trend === "down") {
    const cls = invertColors ? "text-warning" : "text-success";
    return <TrendingDown className={cn("w-3 h-3 inline", cls)} />;
  }
  return <span className="text-muted-foreground text-xs">→</span>;
}

export function VitalsTab({ patientId }: { patientId: bigint }) {
  const vitals = DEMO_VITALS.filter((v) => v.patientId === patientId).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [newVitals, setNewVitals] = useState({
    bp: "",
    hr: "",
    temp: "",
    rr: "",
    spo2: "",
    weight: "",
  });
  const [localVitals, setLocalVitals] = useState<DemoVitalReading[]>([]);

  const allVitals = [...localVitals, ...vitals].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  function handleAddVitals() {
    if (!newVitals.bp) return;
    const entry: DemoVitalReading = {
      id: BigInt(Date.now()),
      patientId,
      date: new Date().toISOString().slice(0, 10),
      bp: newVitals.bp,
      hr: Number(newVitals.hr) || 0,
      temp: Number(newVitals.temp) || 0,
      rr: Number(newVitals.rr) || 0,
      spo2: Number(newVitals.spo2) || 0,
      weight: Number(newVitals.weight) || 0,
    };
    setLocalVitals((prev) => [entry, ...prev]);
    setNewVitals({ bp: "", hr: "", temp: "", rr: "", spo2: "", weight: "" });
    setShowAddForm(false);
  }

  const latest = allVitals[0];
  const prev = allVitals[1];

  function bpColor(bp: string) {
    const s = parseSystolic(bp);
    if (s >= 140) return "text-warning font-semibold";
    return "text-foreground";
  }
  function hrColor(hr: number) {
    if (hr > 100 || hr < 60) return "text-warning font-semibold";
    return "text-foreground";
  }
  function spo2Color(spo2: number) {
    if (spo2 < 95) return "text-destructive font-semibold";
    return "text-foreground";
  }
  function tempColor(temp: number) {
    if (temp > 37.8) return "text-warning font-semibold";
    return "text-foreground";
  }

  return (
    <div className="space-y-4" data-ocid="patient_chart.vitals.panel">
      {/* Sparkline trend charts */}
      {allVitals.length >= 2 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "BP Systolic (mmHg)",
              data: [...allVitals].reverse().map((v) => ({
                date: v.date,
                value: parseSystolic(v.bp),
              })),
              color: "var(--primary)",
              isAlertFn: (val: number) => val >= 140,
              latestValue: `${parseSystolic(allVitals[0].bp)} mmHg`,
              status:
                parseSystolic(allVitals[0].bp) >= 140
                  ? ("danger" as const)
                  : parseSystolic(allVitals[0].bp) >= 130
                    ? ("warning" as const)
                    : ("success" as const),
              statusLabel:
                parseSystolic(allVitals[0].bp) >= 140
                  ? "Elevated"
                  : parseSystolic(allVitals[0].bp) >= 130
                    ? "Borderline"
                    : "Normal",
            },
            {
              label: "Heart Rate (bpm)",
              data: [...allVitals].reverse().map((v) => ({
                date: v.date,
                value: v.hr,
              })),
              color: "var(--success)",
              isAlertFn: (val: number) => val < 60 || val > 100,
              latestValue: `${allVitals[0].hr} bpm`,
              status:
                allVitals[0].hr > 100 || allVitals[0].hr < 60
                  ? ("danger" as const)
                  : ("success" as const),
              statusLabel:
                allVitals[0].hr > 100
                  ? "Tachycardia"
                  : allVitals[0].hr < 60
                    ? "Bradycardia"
                    : "Normal",
            },
            {
              label: "SpO\u2082 (%)",
              data: [...allVitals].reverse().map((v) => ({
                date: v.date,
                value: v.spo2,
              })),
              color: "var(--warning)",
              isAlertFn: (val: number) => val < 95,
              latestValue: `${allVitals[0].spo2}%`,
              status:
                allVitals[0].spo2 < 90
                  ? ("danger" as const)
                  : allVitals[0].spo2 < 95
                    ? ("warning" as const)
                    : ("success" as const),
              statusLabel:
                allVitals[0].spo2 < 90
                  ? "Critical Low"
                  : allVitals[0].spo2 < 95
                    ? "Low"
                    : "Normal",
            },
          ].map(
            ({
              label,
              data,
              color,
              isAlertFn,
              latestValue,
              status,
              statusLabel,
            }) => (
              <div key={label} className="bg-card border border-border p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </span>
                  <StatusBadge variant={status} label={statusLabel} />
                </div>
                <div className="text-lg font-bold text-foreground tabular-nums mb-2">
                  {latestValue}
                </div>
                <ResponsiveContainer width="100%" height={48}>
                  <LineChart data={data}>
                    <RechartsTooltip
                      contentStyle={{
                        fontSize: 10,
                        padding: "2px 6px",
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                      }}
                      formatter={(val: number) => [val, label]}
                      labelFormatter={(l: string) => l}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={color}
                      strokeWidth={1.5}
                      dot={(props) => {
                        const { cx, cy, value } = props as {
                          cx: number;
                          cy: number;
                          value: number;
                        };
                        if (isAlertFn(value)) {
                          return (
                            <circle
                              key={`dot-${cx}-${cy}`}
                              cx={cx}
                              cy={cy}
                              r={3}
                              fill="var(--destructive)"
                              stroke="none"
                            />
                          );
                        }
                        return (
                          <circle
                            key={`dot-${cx}-${cy}`}
                            cx={cx}
                            cy={cy}
                            r={2}
                            fill={color}
                            stroke="none"
                            opacity={0.5}
                          />
                        );
                      }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ),
          )}
        </div>
      )}

      {/* Add Vitals collapsible */}
      <div className="bg-card border border-border">
        <button
          type="button"
          data-ocid="patient_chart.vitals.open_modal_button"
          onClick={() => setShowAddForm((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/30 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-3.5 h-3.5 text-primary" />
            Add Vitals Reading
          </span>
          {showAddForm ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {showAddForm && (
          <div className="border-t border-border px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {[
                { label: "BP (e.g. 120/80)", key: "bp" },
                { label: "HR (bpm)", key: "hr" },
                { label: "Temp (°C)", key: "temp" },
                { label: "RR (/min)", key: "rr" },
                { label: "SpO₂ (%)", key: "spo2" },
                { label: "Weight (kg)", key: "weight" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label
                    htmlFor={`vitals-field-${key}`}
                    className="text-xs text-muted-foreground block mb-1"
                  >
                    {label}
                  </label>
                  <input
                    id={`vitals-field-${key}`}
                    type="text"
                    data-ocid={`patient_chart.vitals.${key}.input`}
                    className="w-full h-8 px-2 text-xs border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    value={newVitals[key as keyof typeof newVitals]}
                    onChange={(e) =>
                      setNewVitals((v) => ({ ...v, [key]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                data-ocid="patient_chart.vitals.submit_button"
                onClick={handleAddVitals}
                className="text-xs h-7"
              >
                Save Vitals
              </Button>
              <Button
                size="sm"
                variant="ghost"
                data-ocid="patient_chart.vitals.cancel_button"
                onClick={() => setShowAddForm(false)}
                className="text-xs h-7"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Current vitals summary cards */}
      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            {
              label: "Blood Pressure",
              icon: <Heart className="w-3.5 h-3.5" />,
              value: latest.bp,
              cls: bpColor(latest.bp),
              trend: prev
                ? numTrend(parseSystolic(prev.bp), parseSystolic(latest.bp))
                : ("stable" as Trend),
              unit: "mmHg",
            },
            {
              label: "Heart Rate",
              icon: <Activity className="w-3.5 h-3.5" />,
              value: String(latest.hr),
              cls: hrColor(latest.hr),
              trend: prev ? numTrend(prev.hr, latest.hr) : ("stable" as Trend),
              unit: "bpm",
            },
            {
              label: "Temperature",
              icon: <Thermometer className="w-3.5 h-3.5" />,
              value: String(latest.temp),
              cls: tempColor(latest.temp),
              trend: prev
                ? numTrend(prev.temp, latest.temp, 0.2)
                : ("stable" as Trend),
              unit: "°C",
            },
            {
              label: "Resp. Rate",
              icon: <Wind className="w-3.5 h-3.5" />,
              value: String(latest.rr),
              cls:
                latest.rr > 20
                  ? "text-warning font-semibold"
                  : "text-foreground",
              trend: prev
                ? numTrend(prev.rr, latest.rr, 1)
                : ("stable" as Trend),
              unit: "/min",
            },
            {
              label: "SpO₂",
              icon: <Activity className="w-3.5 h-3.5" />,
              value: String(latest.spo2),
              cls: spo2Color(latest.spo2),
              trend: prev
                ? numTrend(prev.spo2, latest.spo2, 1)
                : ("stable" as Trend),
              unit: "%",
              invertColors: true,
            },
            {
              label: "Weight",
              icon: <Activity className="w-3.5 h-3.5" />,
              value: String(latest.weight),
              cls: "text-foreground",
              trend: prev
                ? numTrend(prev.weight, latest.weight, 0.5)
                : ("stable" as Trend),
              unit: "kg",
            },
          ].map(({ label, icon, value, cls, trend, unit, invertColors }) => (
            <div
              key={label}
              className="bg-card border border-border p-3 space-y-1"
            >
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {icon}
                {label}
              </div>
              <div className={cn("text-xl font-bold tabular-nums", cls)}>
                {value}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  {unit}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                <TrendIcon trend={trend} invertColors={invertColors} />{" "}
                {trend === "stable"
                  ? "Stable"
                  : trend === "up"
                    ? "Increasing"
                    : "Decreasing"}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Historical table */}
      <div className="bg-card border border-border">
        <div className="px-4 py-3 border-b border-border">
          <span className="text-sm font-semibold text-foreground">
            Vitals History
          </span>
        </div>
        {allVitals.length === 0 ? (
          <div
            className="px-4 py-8 text-center"
            data-ocid="patient_chart.vitals.empty_state"
          >
            <p className="text-sm text-muted-foreground">
              No vitals recorded yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="w-full text-xs"
              data-ocid="patient_chart.vitals.table"
            >
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {[
                    "Date",
                    "BP (mmHg)",
                    "HR (bpm)",
                    "Temp (°C)",
                    "RR (/min)",
                    "SpO₂ (%)",
                    "Weight (kg)",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left font-medium text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allVitals.map((v, idx) => {
                  const p = allVitals[idx + 1];
                  return (
                    <tr
                      key={String(v.id)}
                      className="hover:bg-muted/20"
                      data-ocid={`patient_chart.vitals.item.${idx + 1}`}
                    >
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {v.date}
                      </td>
                      <td className={cn("px-4 py-2.5", bpColor(v.bp))}>
                        {v.bp}{" "}
                        {p && (
                          <TrendIcon
                            trend={numTrend(
                              parseSystolic(p.bp),
                              parseSystolic(v.bp),
                            )}
                          />
                        )}
                      </td>
                      <td className={cn("px-4 py-2.5", hrColor(v.hr))}>
                        {v.hr} {p && <TrendIcon trend={numTrend(p.hr, v.hr)} />}
                      </td>
                      <td className={cn("px-4 py-2.5", tempColor(v.temp))}>
                        {v.temp}{" "}
                        {p && (
                          <TrendIcon trend={numTrend(p.temp, v.temp, 0.2)} />
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-foreground">{v.rr}</td>
                      <td className={cn("px-4 py-2.5", spo2Color(v.spo2))}>
                        {v.spo2}{" "}
                        {p && (
                          <TrendIcon
                            trend={numTrend(p.spo2, v.spo2, 1)}
                            invertColors
                          />
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-foreground">
                        {v.weight}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
