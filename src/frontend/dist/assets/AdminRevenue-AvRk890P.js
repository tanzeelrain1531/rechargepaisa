import { c as createLucideIcon, l as useRevenueStats, j as jsxRuntimeExports, f as formatPaisa, T as TrendingUp, U as Users, p as ChartColumn, S as Separator } from "./index-Csum0tV7.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-BOt1EvFn.js";
import { S as Skeleton } from "./skeleton-CTzmvrjX.js";
import { T as TrendingDown } from "./trending-down-DIEZIZaQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8", key: "1h4pet" }],
  ["path", { d: "M12 18V6", key: "zqpxq5" }]
];
const CircleDollarSign = createLucideIcon("circle-dollar-sign", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode);
function BigStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default"
}) {
  const variantClasses = {
    default: {
      card: "border-border bg-card",
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
      value: "text-foreground"
    },
    profit: {
      card: "border-primary/40 bg-gradient-to-br from-primary/15 to-primary/5",
      iconBg: "bg-primary/20",
      iconColor: "text-primary",
      value: "text-primary"
    },
    payout: {
      card: "border-destructive/30 bg-gradient-to-br from-destructive/10 to-transparent",
      iconBg: "bg-destructive/15",
      iconColor: "text-destructive",
      value: "text-destructive"
    }
  };
  const cls = variantClasses[variant];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: `border ${cls.card}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2.5 rounded-xl ${cls.iconBg}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5 h-5 ${cls.iconColor}` }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: `text-4xl font-black mb-1 ${cls.value}`,
        style: { fontFamily: "Bricolage Grotesque, sans-serif" },
        children: value
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: subtitle })
  ] }) });
}
function AdminRevenue() {
  const { data: stats, isLoading } = useRevenueStats();
  const totalRevenue = (stats == null ? void 0 : stats.totalRevenue) ?? BigInt(0);
  const totalPaidOut = (stats == null ? void 0 : stats.totalPaidOut) ?? BigInt(0);
  const netProfit = (stats == null ? void 0 : stats.netProfit) ?? BigInt(0);
  const totalUsers = stats ? Number(stats.totalUsers) : 0;
  const activeGames = stats ? Number(stats.totalActiveGames) : 0;
  const marginPct = totalRevenue > BigInt(0) ? (Number(netProfit) / Number(totalRevenue) * 100).toFixed(1) : "0.0";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin-revenue.page", children: [
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 rounded-xl" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        BigStatCard,
        {
          title: "Total Collected",
          value: formatPaisa(totalRevenue),
          subtitle: "From game entry fees",
          icon: CircleDollarSign
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        BigStatCard,
        {
          title: "Total Paid Out",
          value: formatPaisa(totalPaidOut),
          subtitle: "Prize winnings to players",
          icon: TrendingDown,
          variant: "payout"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        BigStatCard,
        {
          title: "Net Profit",
          value: formatPaisa(netProfit),
          subtitle: `${marginPct}% profit margin`,
          icon: TrendingUp,
          variant: "profit"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      {
        label: "Total Users",
        value: isLoading ? "—" : String(totalUsers),
        icon: Users,
        color: "text-secondary",
        bg: "bg-secondary/15"
      },
      {
        label: "Active Games",
        value: isLoading ? "—" : String(activeGames),
        icon: ChartColumn,
        color: "text-accent",
        bg: "bg-accent/15"
      },
      {
        label: "Avg Entry/User",
        value: isLoading || totalUsers === 0 ? "—" : formatPaisa(totalRevenue / BigInt(totalUsers)),
        icon: TrendingUp,
        color: "text-primary",
        bg: "bg-primary/15"
      },
      {
        label: "Profit Margin",
        value: isLoading ? "—" : `${marginPct}%`,
        icon: TrendingUp,
        color: "text-primary",
        bg: "bg-primary/15"
      }
    ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-lg ${item.bg}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: `w-4 h-4 ${item.color}` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: item.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-lg font-black text-foreground",
            style: { fontFamily: "Bricolage Grotesque, sans-serif" },
            children: item.value
          }
        )
      ] })
    ] }) }) }, item.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/30 bg-gradient-to-br from-primary/10 to-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Admin Profit Model" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/30 border border-border p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground mb-2 text-sm", children: "💰 How Profit is Generated" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1.5 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mt-0.5", children: "•" }),
              "All entry fees flow to the platform first"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mt-0.5", children: "•" }),
              "Winners receive less than the total pool collected"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mt-0.5", children: "•" }),
              "The difference is admin commission / platform profit"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mt-0.5", children: "•" }),
              "Withdrawal requests require manual approval"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/30 border border-border p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground mb-2 text-sm", children: "📊 Revenue Formula" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm py-1.5 border-b border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total Entry Fees" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: formatPaisa(totalRevenue) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm py-1.5 border-b border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "− Prize Payouts" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-destructive", children: [
                "− ",
                formatPaisa(totalPaidOut)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-primary/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm py-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: "= Net Profit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-black text-primary text-base",
                  style: { fontFamily: "Bricolage Grotesque, sans-serif" },
                  children: formatPaisa(netProfit)
                }
              )
            ] })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  AdminRevenue as default
};
