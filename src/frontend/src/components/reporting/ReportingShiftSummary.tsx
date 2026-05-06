import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  BarChart2,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
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

const SHIFT_ACTIVITY = {
  day: [
    { hour: "7am", patients: 4, vitals: 8, meds: 12 },
    { hour: "8am", patients: 8, vitals: 16, meds: 22 },
    { hour: "9am", patients: 11, vitals: 22, meds: 30 },
    { hour: "10am", patients: 9, vitals: 18, meds: 25 },
    { hour: "11am", patients: 10, vitals: 20, meds: 28 },
    { hour: "12pm", patients: 7, vitals: 14, meds: 18 },
    { hour: "1pm", patients: 9, vitals: 17, meds: 23 },
    { hour: "2pm", patients: 12, vitals: 24, meds: 32 },
    { hour: "3pm", patients: 8, vitals: 16, meds: 21 },
  ],
  evening: [
    { hour: "3pm", patients: 6, vitals: 11, meds: 15 },
    { hour: "4pm", patients: 7, vitals: 13, meds: 18 },
    { hour: "5pm", patients: 8, vitals: 15, meds: 20 },
    { hour: "6pm", patients: 5, vitals: 9, meds: 13 },
    { hour: "7pm", patients: 4, vitals: 7, meds: 11 },
    { hour: "8pm", patients: 6, vitals: 10, meds: 14 },
    { hour: "9pm", patients: 3, vitals: 5, meds: 8 },
    { hour: "10pm", patients: 2, vitals: 4, meds: 7 },
    { hour: "11pm", patients: 1, vitals: 3, meds: 5 },
  ],
  night: [
    { hour: "11pm", patients: 1, vitals: 3, meds: 4 },
    { hour: "12am", patients: 2, vitals: 4, meds: 6 },
    { hour: "1am", patients: 1, vitals: 2, meds: 3 },
    { hour: "2am", patients: 1, vitals: 2, meds: 3 },
    { hour: "3am", patients: 2, vitals: 4, meds: 5 },
    { hour: "4am", patients: 1, vitals: 3, meds: 4 },
    { hour: "5am", patients: 2, vitals: 4, meds: 6 },
    { hour: "6am", patients: 3, vitals: 6, meds: 9 },
    { hour: "7am", patients: 4, vitals: 8, meds: 12 },
  ],
};

const ACTIVE_CARE_PLANS = [
  {
    patient: "Margaret Chen",
    condition: "Type 2 Diabetes",
    nurse: "R. Williams, RN",
    priority: "High",
    updated: "Today 09:15",
  },
  {
    patient: "James Okafor",
    condition: "Hypertension / CHF",
    nurse: "T. Davis, RN",
    priority: "High",
    updated: "Today 08:30",
  },
  {
    patient: "Linda Torres",
    condition: "Post-op Day 2",
    nurse: "S. Johnson, RN",
    priority: "Medium",
    updated: "Today 10:00",
  },
  {
    patient: "Robert Kim",
    condition: "Asthma exacerbation",
    nurse: "K. Martinez, RN",
    priority: "Medium",
    updated: "Yesterday 16:45",
  },
  {
    patient: "Priya Nair",
    condition: "Chronic Kidney Disease",
    nurse: "R. Williams, RN",
    priority: "Low",
    updated: "Yesterday 14:20",
  },
];

export function ReportingShiftSummary() {
  const [activeShift, setActiveShift] = useState<"day" | "evening" | "night">(
    "day",
  );
  const shiftData = SHIFT_ACTIVITY[activeShift];
  const shiftLabels: Record<"day" | "evening" | "night", string> = {
    day: "Day Shift (7am–3pm)",
    evening: "Evening Shift (3pm–11pm)",
    night: "Night Shift (11pm–7am)",
  };

  return (
    <div className="space-y-4" data-ocid="reporting.shift-summary.panel">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          {
            label: "Patients Today",
            value: "47",
            icon: Users,
            color: "text-chart-1",
            sub: "14 inpatient, 33 outpatient",
          },
          {
            label: "Vitals Recorded",
            value: "128",
            icon: Activity,
            color: "text-chart-2",
            sub: "across all units",
          },
          {
            label: "Meds Administered",
            value: "214",
            icon: TrendingUp,
            color: "text-chart-3",
            sub: "98.1% on schedule",
          },
          {
            label: "New Orders",
            value: "63",
            icon: BarChart2,
            color: "text-chart-4",
            sub: "31 lab, 18 imaging, 14 Rx",
          },
          {
            label: "Critical Alerts",
            value: "3",
            icon: DollarSign,
            color: "text-destructive",
            sub: "2 acknowledged",
          },
        ].map((s, i) => (
          <Card
            key={s.label}
            data-ocid={`reporting.shift.stat.${i + 1}`}
            className="border border-border shadow-card bg-card"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </CardHeader>
            <CardContent className="pb-4 px-4 pt-1">
              <p className="text-3xl font-bold tabular-nums leading-none text-foreground">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card
        className="border border-border shadow-card bg-card"
        data-ocid="reporting.shift.chart.card"
      >
        <CardHeader className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Hourly Activity — {shiftLabels[activeShift]}
            </CardTitle>
            <div className="flex items-center gap-1">
              {(["day", "evening", "night"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  data-ocid={`reporting.shift.${s}.tab`}
                  onClick={() => setActiveShift(s)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-sm transition-all capitalize"
                  style={{
                    background:
                      activeShift === s ? "var(--chart-1)" : "var(--muted)",
                    color:
                      activeShift === s
                        ? "var(--primary-foreground)"
                        : "var(--muted-foreground)",
                    border:
                      activeShift === s
                        ? "1px solid var(--primary)"
                        : "1px solid var(--border)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={shiftData}
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 10, fill: "oklch(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "oklch(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <RechartsTooltip
                contentStyle={{
                  fontSize: 11,
                  background: "oklch(var(--popover))",
                  border: "1px solid oklch(var(--border))",
                  borderRadius: 6,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar
                dataKey="patients"
                name="Patients"
                fill="oklch(var(--primary))"
                radius={[2, 2, 0, 0]}
                opacity={0.85}
              />
              <Bar
                dataKey="vitals"
                name="Vitals"
                fill="hsl(142 70% 40%)"
                radius={[2, 2, 0, 0]}
                opacity={0.7}
              />
              <Bar
                dataKey="meds"
                name="Medications"
                fill="hsl(275 70% 55%)"
                radius={[2, 2, 0, 0]}
                opacity={0.6}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card
          className="border border-border shadow-card bg-card"
          data-ocid="reporting.shift.staff.card"
        >
          <CardHeader className="px-4 py-3 border-b border-border">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-muted-foreground" /> Staff on
              Duty
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {[
                {
                  role: "Registered Nurses (RN)",
                  count: 12,
                  color: "bg-chart-1",
                },
                { role: "Physicians (MD/DO)", count: 4, color: "bg-chart-2" },
                { role: "Pharmacists", count: 2, color: "bg-chart-3" },
                { role: "Technicians", count: 8, color: "bg-chart-4" },
              ].map((s) => (
                <div key={s.role} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${s.color}`} />
                    <span className="text-sm text-foreground">{s.role}</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {s.count}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  Total Staff
                </span>
                <span className="text-sm font-bold tabular-nums text-foreground">
                  26
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border border-border shadow-card bg-card"
          data-ocid="reporting.shift.incidents.card"
        >
          <CardHeader className="px-4 py-3 border-b border-border">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-muted-foreground" />{" "}
              Incidents Today
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl font-bold tabular-nums text-foreground">
                2
              </span>
              <div>
                <p className="text-xs text-muted-foreground">
                  reported incidents
                </p>
                <p className="text-xs text-success font-medium">
                  Down 2 from yesterday
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                {
                  type: "Near-fall event",
                  unit: "General Med — Bed GM-04",
                  time: "08:42",
                },
                {
                  type: "Medication delay",
                  unit: "ICU — Bed ICU-02",
                  time: "11:15",
                },
              ].map((inc) => (
                <div
                  key={inc.type}
                  className="flex items-start gap-2 p-2 bg-muted/30 rounded-sm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">
                      {inc.type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {inc.unit} · {inc.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card
        className="border border-border shadow-card bg-card"
        data-ocid="reporting.shift.careplans.table"
      >
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Active Nursing Care Plans
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-muted/60">
                {[
                  "Patient",
                  "Condition",
                  "Assigned Nurse",
                  "Priority",
                  "Last Updated",
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
              {ACTIVE_CARE_PLANS.map((plan, i) => (
                <TableRow
                  key={plan.patient}
                  data-ocid={`reporting.shift.careplan.row.${i + 1}`}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="px-4 py-3 text-sm font-medium text-foreground">
                    {plan.patient}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-foreground">
                    {plan.condition}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                    {plan.nurse}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold border ${
                        plan.priority === "High"
                          ? "bg-destructive/8 text-destructive border-destructive/20"
                          : plan.priority === "Medium"
                            ? "bg-warning/10 text-warning-foreground border-warning/20"
                            : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {plan.priority}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                    {plan.updated}
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
