import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useRevenueStats } from "@/hooks/useBackend";
import { formatPaisa } from "@/lib/backendTypes";
import {
  BarChart3,
  CircleDollarSign,
  Info,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

function BigStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  variant?: "default" | "profit" | "payout";
}) {
  const variantClasses = {
    default: {
      card: "border-border bg-card",
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
      value: "text-foreground",
    },
    profit: {
      card: "border-primary/40 bg-gradient-to-br from-primary/15 to-primary/5",
      iconBg: "bg-primary/20",
      iconColor: "text-primary",
      value: "text-primary",
    },
    payout: {
      card: "border-destructive/30 bg-gradient-to-br from-destructive/10 to-transparent",
      iconBg: "bg-destructive/15",
      iconColor: "text-destructive",
      value: "text-destructive",
    },
  };
  const cls = variantClasses[variant];

  return (
    <Card className={`border ${cls.card}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <div className={`p-2.5 rounded-xl ${cls.iconBg}`}>
            <Icon className={`w-5 h-5 ${cls.iconColor}`} />
          </div>
        </div>
        <p
          className={`text-4xl font-black mb-1 ${cls.value}`}
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          {value}
        </p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminRevenue() {
  const { data: stats, isLoading } = useRevenueStats();

  const totalRevenue = stats?.totalRevenue ?? BigInt(0);
  const totalPaidOut = stats?.totalPaidOut ?? BigInt(0);
  const netProfit = stats?.netProfit ?? BigInt(0);
  const totalUsers = stats ? Number(stats.totalUsers) : 0;
  const activeGames = stats ? Number(stats.totalActiveGames) : 0;

  const marginPct =
    totalRevenue > BigInt(0)
      ? ((Number(netProfit) / Number(totalRevenue)) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6" data-ocid="admin-revenue.page">
      {/* Big number cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BigStatCard
            title="Total Collected"
            value={formatPaisa(totalRevenue)}
            subtitle="From game entry fees"
            icon={CircleDollarSign}
          />
          <BigStatCard
            title="Total Paid Out"
            value={formatPaisa(totalPaidOut)}
            subtitle="Prize winnings to players"
            icon={TrendingDown}
            variant="payout"
          />
          <BigStatCard
            title="Net Profit"
            value={formatPaisa(netProfit)}
            subtitle={`${marginPct}% profit margin`}
            icon={TrendingUp}
            variant="profit"
          />
        </div>
      )}

      {/* Secondary stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: isLoading ? "—" : String(totalUsers),
            icon: Users,
            color: "text-secondary",
            bg: "bg-secondary/15",
          },
          {
            label: "Active Games",
            value: isLoading ? "—" : String(activeGames),
            icon: BarChart3,
            color: "text-accent",
            bg: "bg-accent/15",
          },
          {
            label: "Avg Entry/User",
            value:
              isLoading || totalUsers === 0
                ? "—"
                : formatPaisa(totalRevenue / BigInt(totalUsers)),
            icon: TrendingUp,
            color: "text-primary",
            bg: "bg-primary/15",
          },
          {
            label: "Profit Margin",
            value: isLoading ? "—" : `${marginPct}%`,
            icon: TrendingUp,
            color: "text-primary",
            bg: "bg-primary/15",
          },
        ].map((item) => (
          <Card key={item.label} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${item.bg}`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p
                    className="text-lg font-black text-foreground"
                    style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profit model explanation */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-card">
        <CardHeader className="pb-3 border-b border-primary/20">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-semibold text-foreground">
              Admin Profit Model
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/30 border border-border p-4">
              <h3 className="font-semibold text-foreground mb-2 text-sm">
                💰 How Profit is Generated
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  All entry fees flow to the platform first
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Winners receive less than the total pool collected
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  The difference is admin commission / platform profit
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Withdrawal requests require manual approval
                </li>
              </ul>
            </div>
            <div className="rounded-xl bg-muted/30 border border-border p-4">
              <h3 className="font-semibold text-foreground mb-2 text-sm">
                📊 Revenue Formula
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">
                    Total Entry Fees
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatPaisa(totalRevenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">− Prize Payouts</span>
                  <span className="font-semibold text-destructive">
                    − {formatPaisa(totalPaidOut)}
                  </span>
                </div>
                <Separator className="bg-primary/30" />
                <div className="flex justify-between items-center text-sm py-1.5">
                  <span className="font-semibold text-primary">
                    = Net Profit
                  </span>
                  <span
                    className="font-black text-primary text-base"
                    style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                  >
                    {formatPaisa(netProfit)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
