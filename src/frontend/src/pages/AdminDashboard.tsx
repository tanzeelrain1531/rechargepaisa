import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllUsers,
  usePendingWithdrawals,
  useRevenueStats,
} from "@/hooks/useBackend";
import { formatPaisa, nanosToDate } from "@/lib/backendTypes";
import {
  ArrowDownLeft,
  BarChart3,
  Clock,
  Gamepad2,
  TrendingUp,
  Users,
} from "lucide-react";
import type { AppPage } from "../App";

interface Props {
  setPage: (p: AppPage) => void;
}

function StatCard({
  title,
  value,
  icon: Icon,
  highlight = false,
  subtitle,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  highlight?: boolean;
  subtitle?: string;
}) {
  return (
    <Card
      className={`border ${
        highlight
          ? "border-primary/40 bg-gradient-to-br from-primary/20 to-primary/5"
          : "border-border bg-card"
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <div
            className={`p-2 rounded-lg ${
              highlight ? "bg-primary/20" : "bg-muted"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${highlight ? "text-primary" : "text-muted-foreground"}`}
            />
          </div>
        </div>
        <p
          className={`text-2xl font-black ${
            highlight ? "text-primary" : "text-foreground"
          }`}
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard({ setPage }: Props) {
  const { data: revenue, isLoading: loadingRevenue } = useRevenueStats();
  const { data: users, isLoading: loadingUsers } = useAllUsers();
  const { data: pending, isLoading: loadingPending } = usePendingWithdrawals();

  const totalUsers = revenue ? Number(revenue.totalUsers) : 0;
  const totalRevenue = revenue?.totalRevenue ?? BigInt(0);
  const totalPaidOut = revenue?.totalPaidOut ?? BigInt(0);
  const netProfit = revenue?.netProfit ?? BigInt(0);
  const pendingCount = pending?.length ?? 0;

  // Recent sessions: take last 5 users sorted by joinTime
  const recentSessions =
    users
      ?.slice()
      .sort((a, b) => Number(b.joinTime - a.joinTime))
      .slice(0, 5) ?? [];

  return (
    <div className="space-y-6" data-ocid="admin-dashboard.page">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingRevenue ? (
          <>
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={String(totalUsers)}
              icon={Users}
              subtitle="Registered players"
            />
            <StatCard
              title="Total Revenue"
              value={formatPaisa(totalRevenue)}
              icon={TrendingUp}
              subtitle="From game entries"
            />
            <StatCard
              title="Total Paid Out"
              value={formatPaisa(totalPaidOut)}
              icon={BarChart3}
              subtitle="To winners"
            />
            <StatCard
              title="Net Profit"
              value={formatPaisa(netProfit)}
              icon={TrendingUp}
              highlight
              subtitle="Admin earnings"
            />
          </>
        )}
      </div>

      {/* Pending withdrawals alert */}
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-warning/15">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Pending Withdrawals
                </p>
                <p className="text-sm text-muted-foreground">
                  {loadingPending ? (
                    <Skeleton className="h-4 w-24 inline-block" />
                  ) : (
                    <>
                      <span
                        className="font-bold text-warning"
                        data-ocid="admin-dashboard.pending_count"
                      >
                        {pendingCount}
                      </span>{" "}
                      request{pendingCount !== 1 ? "s" : ""} awaiting approval
                    </>
                  )}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-ocid="admin-dashboard.view_withdrawals_button"
              onClick={() => setPage("admin-withdrawals")}
              className="border-warning/40 text-warning hover:bg-warning/10"
            >
              <ArrowDownLeft className="w-4 h-4 mr-1" />
              View All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent sessions */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-secondary" />
            <CardTitle className="text-sm font-semibold text-foreground">
              Recent User Activity
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loadingUsers ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
            </div>
          ) : recentSessions.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 text-center"
              data-ocid="admin-dashboard.empty_state"
            >
              <Gamepad2 className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-sm">
                No user activity yet
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Principal
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Invested
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((u, idx) => {
                  const pid = u.owner.toString();
                  const short = `${pid.slice(0, 8)}…${pid.slice(-4)}`;
                  const principalKey = u.owner.toString();
                  return (
                    <tr
                      key={principalKey}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      data-ocid={`admin-dashboard.item.${idx + 1}`}
                    >
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                        {short}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-foreground">
                        {formatPaisa(u.balance)}
                      </td>
                      <td className="px-5 py-3 text-right text-muted-foreground">
                        {formatPaisa(u.totalInvested)}
                      </td>
                      <td className="px-5 py-3 text-right text-muted-foreground">
                        {nanosToDate(u.joinTime).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
