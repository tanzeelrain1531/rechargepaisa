import { l as useRevenueStats, m as useAllUsers, o as usePendingWithdrawals, j as jsxRuntimeExports, U as Users, T as TrendingUp, f as formatPaisa, p as ChartColumn, A as ArrowDownLeft, G as Gamepad2, n as nanosToDate } from "./index-Csum0tV7.js";
import { B as Button } from "./button-ABhIitEP.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-BOt1EvFn.js";
import { S as Skeleton } from "./skeleton-CTzmvrjX.js";
import { C as Clock } from "./clock-CNgtAKci.js";
function StatCard({
  title,
  value,
  icon: Icon,
  highlight = false,
  subtitle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: `border ${highlight ? "border-primary/40 bg-gradient-to-br from-primary/20 to-primary/5" : "border-border bg-card"}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `p-2 rounded-lg ${highlight ? "bg-primary/20" : "bg-muted"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Icon,
                {
                  className: `w-4 h-4 ${highlight ? "text-primary" : "text-muted-foreground"}`
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: `text-2xl font-black ${highlight ? "text-primary" : "text-foreground"}`,
            style: { fontFamily: "Bricolage Grotesque, sans-serif" },
            children: value
          }
        ),
        subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: subtitle })
      ] })
    }
  );
}
function AdminDashboard({ setPage }) {
  const { data: revenue, isLoading: loadingRevenue } = useRevenueStats();
  const { data: users, isLoading: loadingUsers } = useAllUsers();
  const { data: pending, isLoading: loadingPending } = usePendingWithdrawals();
  const totalUsers = revenue ? Number(revenue.totalUsers) : 0;
  const totalRevenue = (revenue == null ? void 0 : revenue.totalRevenue) ?? BigInt(0);
  const totalPaidOut = (revenue == null ? void 0 : revenue.totalPaidOut) ?? BigInt(0);
  const netProfit = (revenue == null ? void 0 : revenue.netProfit) ?? BigInt(0);
  const pendingCount = (pending == null ? void 0 : pending.length) ?? 0;
  const recentSessions = (users == null ? void 0 : users.slice().sort((a, b) => Number(b.joinTime - a.joinTime)).slice(0, 5)) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin-dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: loadingRevenue ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          title: "Total Users",
          value: String(totalUsers),
          icon: Users,
          subtitle: "Registered players"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          title: "Total Revenue",
          value: formatPaisa(totalRevenue),
          icon: TrendingUp,
          subtitle: "From game entries"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          title: "Total Paid Out",
          value: formatPaisa(totalPaidOut),
          icon: ChartColumn,
          subtitle: "To winners"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          title: "Net Profit",
          value: formatPaisa(netProfit),
          icon: TrendingUp,
          highlight: true,
          subtitle: "Admin earnings"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 rounded-xl bg-warning/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5 text-warning" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Pending Withdrawals" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: loadingPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 inline-block" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-bold text-warning",
                "data-ocid": "admin-dashboard.pending_count",
                children: pendingCount
              }
            ),
            " ",
            "request",
            pendingCount !== 1 ? "s" : "",
            " awaiting approval"
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          "data-ocid": "admin-dashboard.view_withdrawals_button",
          onClick: () => setPage("admin-withdrawals"),
          className: "border-warning/40 text-warning hover:bg-warning/10",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "w-4 h-4 mr-1" }),
            "View All"
          ]
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Gamepad2, { className: "w-4 h-4 text-secondary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Recent User Activity" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: loadingUsers ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded-lg" })
      ] }) : recentSessions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-12 text-center",
          "data-ocid": "admin-dashboard.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gamepad2, { className: "w-10 h-10 text-muted-foreground/40 mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No user activity yet" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Principal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Invested" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Joined" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: recentSessions.map((u, idx) => {
          const pid = u.owner.toString();
          const short = `${pid.slice(0, 8)}…${pid.slice(-4)}`;
          const principalKey = u.owner.toString();
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border/50 hover:bg-muted/20 transition-colors",
              "data-ocid": `admin-dashboard.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-mono text-xs text-muted-foreground", children: short }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right font-semibold text-foreground", children: formatPaisa(u.balance) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right text-muted-foreground", children: formatPaisa(u.totalInvested) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right text-muted-foreground", children: nanosToDate(u.joinTime).toLocaleDateString("en-IN") })
              ]
            },
            principalKey
          );
        }) })
      ] }) })
    ] })
  ] });
}
export {
  AdminDashboard as default
};
