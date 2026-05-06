import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Calendar, DollarSign, TrendingUp } from "lucide-react";
type Role = string;
import { StatCard } from "./StatCard";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const MOCK_MONTHLY_REVENUE = [18400, 21200, 19800, 23500, 22100, 24800];
const MOCK_TOP_MEDS = [
  { name: "Lisinopril", count: 34 },
  { name: "Metformin", count: 29 },
  { name: "Atorvastatin", count: 22 },
  { name: "Amlodipine", count: 18 },
  { name: "Omeprazole", count: 15 },
  { name: "Levothyroxine", count: 12 },
];

interface ReportingAnalyticsProps {
  loading: boolean;
  totalPatients: number;
  weekAppts: number;
  pendingRevenue: number;
  noShowRate: number;
  weeklyVol: number[];
  statusBreakdown: {
    scheduled: number;
    completed: number;
    cancelled: number;
    noShow: number;
    total: number;
  };
  role: Role;
  todayPatients: number;
  pendingNotes: number;
  upcomingAppts: number;
}

export function ReportingAnalytics({
  loading,
  totalPatients,
  weekAppts,
  pendingRevenue,
  noShowRate,
  weeklyVol,
  statusBreakdown,
  role,
  todayPatients,
  pendingNotes,
  upcomingAppts,
}: ReportingAnalyticsProps) {
  const maxWeekly = Math.max(...weeklyVol, 1);
  const maxRevenue = Math.max(...MOCK_MONTHLY_REVENUE, 1);
  const maxMed = MOCK_TOP_MEDS[0]?.count ?? 1;

  const colorPrimary = "oklch(var(--primary))";
  const colorScheduled = "hsl(210 80% 50%)";
  const colorCompleted = "hsl(142 70% 40%)";
  const colorCancelled = "oklch(var(--destructive))";
  const colorNoShow = "hsl(38 92% 50%)";
  const colorEmpty = "oklch(var(--muted))";

  return (
    <div className="space-y-4">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        data-ocid="reporting.summary.section"
      >
        <StatCard
          ocid="reporting.patients.card"
          title="Patients This Month"
          value={loading ? "—" : totalPatients}
          sub="total registered"
          icon={Calendar}
          iconClass="text-muted-foreground"
        />
        <StatCard
          ocid="reporting.appointments.card"
          title="Appts This Week"
          value={loading ? "—" : weekAppts}
          sub="last 7 days"
          icon={TrendingUp}
          iconClass="text-muted-foreground"
        />
        <StatCard
          ocid="reporting.revenue.card"
          title="Outstanding Revenue"
          value={loading ? "—" : `$${pendingRevenue.toLocaleString()}`}
          sub="pending invoices"
          icon={DollarSign}
          iconClass="text-muted-foreground"
        />
        <StatCard
          ocid="reporting.noshow.card"
          title="No-Show Rate"
          value={loading ? "—" : `${noShowRate}%`}
          sub="of all appointments"
          icon={TrendingUp}
          iconClass="text-muted-foreground"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card
          className="border border-border shadow-card bg-card"
          data-ocid="reporting.weekly.panel"
        >
          <CardHeader className="px-4 py-3 border-b border-border">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Weekly Appointment Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {DAYS.map((day, i) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-mono w-8 flex-shrink-0">
                    {day}
                  </span>
                  <div className="flex-1 bg-muted/40 rounded-sm h-5 relative overflow-hidden">
                    <div
                      className="h-full rounded-sm transition-all duration-500"
                      style={{
                        width: `${(weeklyVol[i] / maxWeekly) * 100}%`,
                        background: colorPrimary,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono tabular-nums text-muted-foreground w-5 text-right flex-shrink-0">
                    {weeklyVol[i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card
          className="border border-border shadow-card bg-card"
          data-ocid="reporting.revenue.panel"
        >
          <CardHeader className="px-4 py-3 border-b border-border">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Monthly Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-end gap-2 h-32">
              {MOCK_MONTHLY_REVENUE.map((v, i) => (
                <div
                  key={MONTHS[i]}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t-sm transition-all duration-500"
                    style={{
                      height: `${(v / maxRevenue) * 112}px`,
                      background: colorPrimary,
                      opacity: i === MONTHS.length - 1 ? 1 : 0.6,
                    }}
                  />
                  <span className="text-xs text-muted-foreground font-mono">
                    {MONTHS[i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                This month:{" "}
                <span className="font-semibold text-foreground">
                  ${(MOCK_MONTHLY_REVENUE[5] ?? 0).toLocaleString()}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card
          className="border border-border shadow-card bg-card"
          data-ocid="reporting.status.panel"
        >
          <CardHeader className="px-4 py-3 border-b border-border">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Appointment Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex h-5 rounded-sm overflow-hidden gap-px">
              {statusBreakdown.scheduled > 0 && (
                <div
                  className="h-full"
                  style={{
                    width: `${(statusBreakdown.scheduled / statusBreakdown.total) * 100}%`,
                    background: colorScheduled,
                  }}
                  title={`Scheduled: ${statusBreakdown.scheduled}`}
                />
              )}
              {statusBreakdown.completed > 0 && (
                <div
                  className="h-full"
                  style={{
                    width: `${(statusBreakdown.completed / statusBreakdown.total) * 100}%`,
                    background: colorCompleted,
                  }}
                  title={`Completed: ${statusBreakdown.completed}`}
                />
              )}
              {statusBreakdown.cancelled > 0 && (
                <div
                  className="h-full"
                  style={{
                    width: `${(statusBreakdown.cancelled / statusBreakdown.total) * 100}%`,
                    background: colorCancelled,
                  }}
                  title={`Cancelled: ${statusBreakdown.cancelled}`}
                />
              )}
              {statusBreakdown.noShow > 0 && (
                <div
                  className="h-full"
                  style={{
                    width: `${(statusBreakdown.noShow / statusBreakdown.total) * 100}%`,
                    background: colorNoShow,
                  }}
                  title={`No-show: ${statusBreakdown.noShow}`}
                />
              )}
              {statusBreakdown.total <= 1 && (
                <div
                  className="h-full flex-1"
                  style={{ background: colorEmpty }}
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  [colorScheduled, "Scheduled", statusBreakdown.scheduled],
                  [colorCompleted, "Completed", statusBreakdown.completed],
                  [colorCancelled, "Cancelled", statusBreakdown.cancelled],
                  [colorNoShow, "No-Show", statusBreakdown.noShow],
                ] as [string, string, number][]
              ).map(([color, label, count]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                    style={{ background: color }}
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-xs font-mono font-semibold text-foreground ml-auto">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card
          className="border border-border shadow-card bg-card"
          data-ocid="reporting.medications.panel"
        >
          <CardHeader className="px-4 py-3 border-b border-border">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Top Medications Prescribed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {MOCK_TOP_MEDS.map((med, i) => (
                <div
                  key={med.name}
                  data-ocid={`reporting.medications.item.${i + 1}`}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <span className="text-xs font-mono text-muted-foreground w-4 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {med.name}
                    </p>
                    <div className="mt-1 h-1 bg-muted/40 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(med.count / maxMed) * 100}%`,
                          background: colorPrimary,
                          opacity: 0.8,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-foreground flex-shrink-0">
                    {med.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {role === "Doctor" && (
        <Card
          className="border border-border shadow-card bg-card"
          data-ocid="reporting.clinician.panel"
        >
          <CardHeader className="px-4 py-3 border-b border-border">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
              <BarChart2 className="w-3.5 h-3.5 inline mr-1.5 opacity-60" />{" "}
              Your Summary — Today
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold tabular-nums text-foreground">
                  {loading ? "—" : todayPatients}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Patients Seen
                </p>
              </div>
              <div className="text-center border-x border-border">
                <p className="text-3xl font-bold tabular-nums text-foreground">
                  {loading ? "—" : pendingNotes}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Notes In System
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold tabular-nums text-foreground">
                  {loading ? "—" : upcomingAppts}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upcoming Appts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
