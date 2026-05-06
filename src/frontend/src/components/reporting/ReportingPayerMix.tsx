import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, TrendingUp, Users } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const PAYER_MIX = [
  {
    name: "Medicare",
    pct: 34,
    claims: 142,
    billed: 218400,
    collected: 174720,
    rate: 80,
  },
  {
    name: "Blue Cross",
    pct: 22,
    claims: 92,
    billed: 156800,
    collected: 141120,
    rate: 90,
  },
  {
    name: "Medicaid",
    pct: 18,
    claims: 75,
    billed: 98600,
    collected: 68020,
    rate: 69,
  },
  {
    name: "Aetna",
    pct: 12,
    claims: 50,
    billed: 89200,
    collected: 80280,
    rate: 90,
  },
  {
    name: "United",
    pct: 8,
    claims: 33,
    billed: 62400,
    collected: 53040,
    rate: 85,
  },
  {
    name: "Self-Pay",
    pct: 6,
    claims: 25,
    billed: 41600,
    collected: 12480,
    rate: 30,
  },
];

const PIE_COLORS: Record<string, string> = {
  Medicare: "oklch(var(--primary))",
  "Blue Cross": "oklch(var(--chart-2))",
  Medicaid: "oklch(var(--chart-3))",
  Aetna: "oklch(var(--chart-4))",
  "Self-Pay": "oklch(var(--chart-5))",
};

export function ReportingPayerMix() {
  const totalClaims = PAYER_MIX.reduce((s, p) => s + p.claims, 0);
  const totalCollected = PAYER_MIX.reduce((s, p) => s + p.collected, 0);
  const totalBilled = PAYER_MIX.reduce((s, p) => s + p.billed, 0);
  const avgCollectionRate = Math.round((totalCollected / totalBilled) * 100);
  const colorPrimary = "oklch(var(--primary))";

  return (
    <div className="space-y-4">
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        data-ocid="reporting.payermix.summary.section"
      >
        <Card
          className="border border-border shadow-card bg-card"
          data-ocid="reporting.payermix.claims.card"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Claims
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-4 px-4 pt-1">
            <p className="text-3xl font-bold tabular-nums text-foreground">
              {totalClaims}
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              across all payers
            </p>
          </CardContent>
        </Card>
        <Card
          className="border border-border shadow-card bg-card"
          data-ocid="reporting.payermix.collection.card"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Avg Collection Rate
            </CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-4 px-4 pt-1">
            <p className="text-3xl font-bold tabular-nums text-foreground">
              {avgCollectionRate}%
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              collected / billed
            </p>
          </CardContent>
        </Card>
        <Card
          className="border border-border shadow-card bg-card"
          data-ocid="reporting.payermix.toppayer.card"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Top Payer by Volume
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-4 px-4 pt-1">
            <p className="text-2xl font-bold tabular-nums text-foreground">
              Medicare
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              34% of claims
            </p>
          </CardContent>
        </Card>
      </div>

      <Card
        className="border border-border shadow-card bg-card"
        data-ocid="reporting.payermix.chart.card"
      >
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Revenue by Payer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={PAYER_MIX}
                dataKey="pct"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={45}
                paddingAngle={3}
                label={({ name, pct }: { name: string; pct: number }) =>
                  `${name} ${pct}%`
                }
                labelLine={false}
              >
                {PAYER_MIX.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={
                      PIE_COLORS[entry.name] ?? "oklch(var(--muted-foreground))"
                    }
                    opacity={0.85}
                  />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(v: number, name: string) => [`${v}%`, name]}
                contentStyle={{
                  fontSize: 11,
                  background: "oklch(var(--popover))",
                  border: "1px solid oklch(var(--border))",
                  borderRadius: 6,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card
        className="border border-border shadow-card bg-card"
        data-ocid="reporting.payermix.bars.panel"
      >
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Payer Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {PAYER_MIX.map((payer) => (
            <div key={payer.name} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-24 flex-shrink-0">
                {payer.name}
              </span>
              <div className="flex-1 bg-muted/40 rounded-sm h-5 relative overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all duration-500"
                  style={{
                    width: `${payer.pct}%`,
                    background: colorPrimary,
                    opacity: 0.8,
                  }}
                />
              </div>
              <span className="text-xs font-mono tabular-nums font-semibold text-foreground w-10 text-right flex-shrink-0">
                {payer.pct}%
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card
        className="border border-border shadow-card bg-card"
        data-ocid="reporting.payermix.table"
      >
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Payer Detail
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-muted/60">
                {[
                  "Payer",
                  "Claims",
                  "Total Billed",
                  "Total Collected",
                  "Collection Rate",
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
              {PAYER_MIX.map((payer, i) => (
                <TableRow
                  key={payer.name}
                  data-ocid={`reporting.payermix.row.${i + 1}`}
                >
                  <TableCell className="px-4 py-3 font-medium text-sm text-foreground">
                    {payer.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-right tabular-nums">
                    {payer.claims}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-right tabular-nums">
                    ${payer.billed.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-right tabular-nums">
                    ${payer.collected.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        payer.rate >= 85
                          ? "bg-success/8 text-success border-success/20"
                          : payer.rate >= 70
                            ? "bg-warning/10 text-warning border-warning/20"
                            : "bg-destructive/8 text-destructive border-destructive/20"
                      }`}
                    >
                      {payer.rate}%
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
