import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart2, Calendar, DollarSign, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard } from "./StatCard";

const PROVIDER_WEEKLY_TREND = [
  { week: "W1", chen: 6, patel: 7, santos: 5, liu: 4 },
  { week: "W2", chen: 8, patel: 9, santos: 7, liu: 5 },
  { week: "W3", chen: 7, patel: 8, santos: 6, liu: 5 },
  { week: "W4", chen: 9, patel: 10, santos: 8, liu: 6 },
];

const PROVIDER_STATS = [
  {
    name: "Dr. Sarah Chen",
    role: "Physician",
    encounters: 28,
    notesCompleted: 25,
    notesPending: 3,
    avgDuration: "22 min",
    rvus: 94.2,
  },
  {
    name: "Dr. James Patel",
    role: "Physician",
    encounters: 31,
    notesCompleted: 31,
    notesPending: 0,
    avgDuration: "18 min",
    rvus: 108.4,
  },
  {
    name: "Dr. Maria Santos",
    role: "Physician",
    encounters: 24,
    notesCompleted: 22,
    notesPending: 2,
    avgDuration: "25 min",
    rvus: 81.6,
  },
  {
    name: "NP Kevin Liu",
    role: "Nurse Practitioner",
    encounters: 19,
    notesCompleted: 18,
    notesPending: 1,
    avgDuration: "20 min",
    rvus: 52.3,
  },
];

const PROVIDER_MONTHLY = [
  {
    name: "Dr. Sarah Chen",
    role: "Doctor",
    encounters: 142,
    avgDay: 6.8,
    avgVisit: "22 min",
    topDx: "Type 2 Diabetes",
    rvus: 284,
    satisfaction: 4.8,
    weekly: [32, 38, 35, 37],
  },
  {
    name: "Dr. James Rodriguez",
    role: "Doctor",
    encounters: 118,
    avgDay: 5.6,
    avgVisit: "28 min",
    topDx: "Hypertension",
    rvus: 236,
    satisfaction: 4.6,
    weekly: [28, 31, 29, 30],
  },
  {
    name: "Dr. Emily Park",
    role: "Doctor",
    encounters: 97,
    avgDay: 4.6,
    avgVisit: "31 min",
    topDx: "Anxiety/Depression",
    rvus: 194,
    satisfaction: 4.9,
    weekly: [22, 26, 24, 25],
  },
  {
    name: "Dr. Marcus Lee",
    role: "Doctor",
    encounters: 88,
    avgDay: 4.2,
    avgVisit: "26 min",
    topDx: "Chest Pain / CAD",
    rvus: 176,
    satisfaction: 4.7,
    weekly: [20, 22, 23, 23],
  },
  {
    name: "NP Maria Santos",
    role: "Nurse Practitioner",
    encounters: 76,
    avgDay: 3.6,
    avgVisit: "19 min",
    topDx: "URI/Cold",
    rvus: 114,
    satisfaction: 4.5,
    weekly: [18, 20, 19, 19],
  },
  {
    name: "PA Tom Wilson",
    role: "Physician Assistant",
    encounters: 63,
    avgDay: 3.0,
    avgVisit: "17 min",
    topDx: "Diabetes Follow-up",
    rvus: 95,
    satisfaction: 4.4,
    weekly: [15, 16, 16, 16],
  },
];

export function ReportingProductivity() {
  const totalEncounters = PROVIDER_STATS.reduce((s, p) => s + p.encounters, 0);
  const avgRVUs = (
    PROVIDER_STATS.reduce((s, p) => s + p.rvus, 0) / PROVIDER_STATS.length
  ).toFixed(1);
  const completionRate = Math.round(
    (PROVIDER_STATS.reduce((s, p) => s + p.notesCompleted, 0) /
      PROVIDER_STATS.reduce((s, p) => s + p.encounters, 0)) *
      100,
  );

  return (
    <div className="space-y-4">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        data-ocid="reporting.productivity.monthly.section"
      >
        <StatCard
          ocid="reporting.productivity.monthly.encounters.card"
          title="Total Encounters This Month"
          value={PROVIDER_MONTHLY.reduce((s, p) => s + p.encounters, 0)}
          sub="across all providers"
          icon={Calendar}
          iconClass="text-muted-foreground"
        />
        <StatCard
          ocid="reporting.productivity.monthly.avgday.card"
          title="Avg Encounters / Day"
          value={(
            PROVIDER_MONTHLY.reduce((s, p) => s + p.avgDay, 0) /
            PROVIDER_MONTHLY.length
          ).toFixed(1)}
          sub="per provider average"
          icon={TrendingUp}
          iconClass="text-muted-foreground"
        />
        <StatCard
          ocid="reporting.productivity.monthly.rvus.card"
          title="Total RVUs This Month"
          value={PROVIDER_MONTHLY.reduce((s, p) => s + p.rvus, 0)}
          sub="relative value units"
          icon={BarChart2}
          iconClass="text-muted-foreground"
        />
        <StatCard
          ocid="reporting.productivity.monthly.visitlength.card"
          title="Avg Visit Length"
          value="23 min"
          sub="across all encounter types"
          icon={DollarSign}
          iconClass="text-muted-foreground"
        />
      </div>

      <Card
        className="border border-border shadow-card bg-card"
        data-ocid="reporting.productivity.trend.card"
      >
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Weekly Encounter Trend by Provider
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={PROVIDER_WEEKLY_TREND}
              margin={{ top: 8, right: 16, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="prodGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(var(--primary))"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="prodGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(var(--chart-2))"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(var(--chart-2))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="week"
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
              <Area
                type="monotone"
                dataKey="chen"
                name="Dr. Chen"
                stroke="oklch(var(--primary))"
                fill="url(#prodGrad1)"
                strokeWidth={2}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="patel"
                name="Dr. Patel"
                stroke="oklch(var(--chart-2))"
                fill="url(#prodGrad2)"
                strokeWidth={2}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="santos"
                name="Dr. Santos"
                stroke="oklch(var(--chart-3))"
                fill="none"
                strokeWidth={2}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="liu"
                name="NP Liu"
                stroke="oklch(var(--chart-4))"
                fill="none"
                strokeWidth={1.5}
                strokeDasharray="4 2"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card
        className="border border-border shadow-card bg-card"
        data-ocid="reporting.productivity.monthly.table"
      >
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Provider Performance — This Month
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-muted/60">
                {[
                  "Provider",
                  "Role",
                  "Encounters",
                  "Avg/Day",
                  "Avg Visit",
                  "Top Diagnosis",
                  "Est. RVUs",
                  "Satisfaction",
                  "Weekly Trend",
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
              {PROVIDER_MONTHLY.map((p, i) => {
                const maxW = Math.max(...p.weekly);
                return (
                  <TableRow
                    key={p.name}
                    data-ocid={`reporting.productivity.row.${i + 1}`}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="px-4 py-3 text-sm font-semibold text-foreground">
                      {p.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {p.role}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm tabular-nums text-right font-medium">
                      {p.encounters}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm tabular-nums text-right">
                      {p.avgDay}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm tabular-nums text-right text-muted-foreground">
                      {p.avgVisit}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground max-w-[140px] truncate">
                      {p.topDx}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm tabular-nums text-right font-semibold text-success">
                      {p.rvus}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <span
                        className="text-sm tabular-nums font-semibold"
                        style={{
                          color:
                            (p.satisfaction ?? 0) >= 4.7
                              ? "var(--chart-2)"
                              : (p.satisfaction ?? 0) >= 4.4
                                ? "var(--chart-5)"
                                : "var(--destructive)",
                        }}
                      >
                        {(p.satisfaction ?? 0).toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-0.5">
                        /5
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <svg
                        width="60"
                        height="24"
                        viewBox="0 0 60 24"
                        className="overflow-visible"
                        role="img"
                        aria-label={`Weekly trend for ${p.name}`}
                      >
                        {p.weekly.map((v, wi) => {
                          const barH = Math.round((v / maxW) * 18);
                          const x = wi * 16;
                          return (
                            <rect
                              key={`w${wi}-${v}`}
                              x={x}
                              y={24 - barH}
                              width="12"
                              height={barH}
                              rx="2"
                              className="fill-primary opacity-70"
                            />
                          );
                        })}
                      </svg>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        data-ocid="reporting.productivity.weekly.section"
      >
        <Card
          className="border border-border shadow-card bg-card"
          data-ocid="reporting.productivity.encounters.card"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Encounters
            </CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-4 px-4 pt-1">
            <p className="text-3xl font-bold tabular-nums text-foreground">
              {totalEncounters}
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              this week, all providers
            </p>
          </CardContent>
        </Card>
        <Card
          className="border border-border shadow-card bg-card"
          data-ocid="reporting.productivity.rvus.card"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Avg RVUs / Provider
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-4 px-4 pt-1">
            <p className="text-3xl font-bold tabular-nums text-foreground">
              {avgRVUs}
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              relative value units
            </p>
          </CardContent>
        </Card>
        <Card
          className="border border-border shadow-card bg-card"
          data-ocid="reporting.productivity.completion.card"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Note Completion Rate
            </CardTitle>
            <BarChart2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-4 px-4 pt-1">
            <p className="text-3xl font-bold tabular-nums text-foreground">
              {completionRate}%
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              notes signed / encounters
            </p>
          </CardContent>
        </Card>
      </div>

      <Card
        className="border border-border shadow-card bg-card"
        data-ocid="reporting.productivity.table"
      >
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Provider Performance — This Week
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-muted/60">
                {[
                  "Provider",
                  "Role",
                  "Encounters",
                  "Notes Done",
                  "Pending",
                  "Avg Duration",
                  "RVUs",
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
              {PROVIDER_STATS.map((p, i) => (
                <TableRow
                  key={p.name}
                  data-ocid={`reporting.productivity.row.${i + 1}`}
                >
                  <TableCell className="px-4 py-3 font-medium text-sm text-foreground">
                    {p.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                    {p.role}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-right tabular-nums">
                    {p.encounters}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-right tabular-nums text-success">
                    {p.notesCompleted}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-right tabular-nums">
                    {p.notesPending > 0 ? (
                      <span className="text-warning font-medium">
                        {p.notesPending}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-right text-muted-foreground">
                    {p.avgDuration}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-right tabular-nums font-semibold">
                    {p.rvus}
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
