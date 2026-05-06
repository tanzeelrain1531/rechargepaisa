import { c as createLucideIcon, o as usePendingWithdrawals, z as useApproveWithdrawal, D as useRejectWithdrawal, r as reactExports, j as jsxRuntimeExports, A as ArrowDownLeft, f as formatPaisa, h as ue, E as withdrawalStatusLabel, n as nanosToDate, B as Badge } from "./index-Csum0tV7.js";
import { B as Button } from "./button-ABhIitEP.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-BOt1EvFn.js";
import { S as Skeleton } from "./skeleton-CTzmvrjX.js";
import { C as Clock } from "./clock-CNgtAKci.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode);
function WithdrawalRow({
  req,
  index,
  onApprove,
  onReject,
  pending
}) {
  const pid = req.userId.toString();
  const short = `${pid.slice(0, 10)}…${pid.slice(-4)}`;
  const statusLabel = withdrawalStatusLabel(req.status);
  const isProcessing = pending === req.id;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: "border-b border-border/50 hover:bg-muted/20 transition-colors",
      "data-ocid": `admin-withdrawals.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: short }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-bold text-foreground",
            style: { fontFamily: "Bricolage Grotesque, sans-serif" },
            children: formatPaisa(req.amount)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 text-right text-sm text-muted-foreground", children: nanosToDate(req.requestedAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric"
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            className: `text-xs border ${"Pending" === statusLabel ? "bg-warning/15 text-warning border-warning/30" : "Approved" === statusLabel ? "bg-success/15 text-success border-success/30" : "bg-destructive/15 text-destructive border-destructive/30"}`,
            children: statusLabel
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              disabled: isProcessing,
              "data-ocid": `admin-withdrawals.confirm_button.${index + 1}`,
              onClick: () => onApprove(req.id),
              className: "bg-success/15 text-success hover:bg-success/25 border border-success/30 gap-1",
              variant: "ghost",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5" }),
                "Approve"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              disabled: isProcessing,
              "data-ocid": `admin-withdrawals.delete_button.${index + 1}`,
              onClick: () => onReject(req.id),
              className: "bg-destructive/15 text-destructive hover:bg-destructive/25 border border-destructive/30 gap-1",
              variant: "ghost",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" }),
                "Reject"
              ]
            }
          )
        ] }) })
      ]
    }
  );
}
function AdminWithdrawals() {
  const { data: requests, isLoading } = usePendingWithdrawals();
  const approve = useApproveWithdrawal();
  const reject = useRejectWithdrawal();
  const [processingId, setProcessingId] = reactExports.useState(null);
  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await approve.mutateAsync(id);
      ue.success("Withdrawal approved!");
    } catch {
      ue.error("Failed to approve withdrawal.");
    } finally {
      setProcessingId(null);
    }
  };
  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await reject.mutateAsync(id);
      ue.error("Withdrawal rejected.");
    } catch {
      ue.error("Failed to reject withdrawal.");
    } finally {
      setProcessingId(null);
    }
  };
  const pending = requests ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "admin-withdrawals.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-warning/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-warning" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Pending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xl font-black text-warning",
              style: { fontFamily: "Bricolage Grotesque, sans-serif" },
              "data-ocid": "admin-withdrawals.pending_count",
              children: isLoading ? "—" : pending.length
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "w-4 h-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Requested" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xl font-black text-foreground",
              style: { fontFamily: "Bricolage Grotesque, sans-serif" },
              children: isLoading ? "—" : formatPaisa(
                pending.reduce((s, r) => s + r.amount, BigInt(0))
              )
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-secondary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-secondary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Avg Request" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xl font-black text-foreground",
              style: { fontFamily: "Bricolage Grotesque, sans-serif" },
              children: isLoading || pending.length === 0 ? "—" : formatPaisa(
                pending.reduce((s, r) => s + r.amount, BigInt(0)) / BigInt(pending.length)
              )
            }
          )
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "w-4 h-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: "Withdrawal Requests" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" })
      ] }) : pending.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-16 text-center",
          "data-ocid": "admin-withdrawals.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-10 h-10 text-success/50 mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: "All clear!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No pending withdrawals at the moment." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Requested" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: pending.map((req, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          WithdrawalRow,
          {
            req,
            index: idx,
            onApprove: handleApprove,
            onReject: handleReject,
            pending: processingId
          },
          `wr-${Number(req.id)}`
        )) })
      ] }) })
    ] })
  ] });
}
export {
  AdminWithdrawals as default
};
