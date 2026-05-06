import { c as createLucideIcon, u as useMyWallet, a as useTransactionHistory, k as useRequestWithdrawal, r as reactExports, f as formatPaisa, j as jsxRuntimeExports, d as ArrowUpRight, h as ue, n as nanosToDate, B as Badge } from "./index-Csum0tV7.js";
import { B as Button } from "./button-ABhIitEP.js";
import { I as Input } from "./input-Q83YYU7m.js";
import { L as Label } from "./label-BOm3eC7_.js";
import { S as Skeleton } from "./skeleton-CTzmvrjX.js";
import { C as Clock } from "./clock-CNgtAKci.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode);
const MIN_WITHDRAW = 50;
function WithdrawalRow({ tx, idx }) {
  const date = nanosToDate(tx.timestamp);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: "border-b border-border hover:bg-card/60 transition-colors",
      "data-ocid": `withdraw.request_item.${idx + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground whitespace-nowrap", children: date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "2-digit"
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm font-bold text-foreground", children: formatPaisa(tx.amount) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: "text-xs flex items-center gap-1 w-fit border-warning/40 text-warning bg-warning/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
              "Submitted"
            ]
          }
        ) })
      ]
    }
  );
}
function WithdrawPage() {
  const { data: wallet, isLoading: walletLoading } = useMyWallet();
  const { data: txs } = useTransactionHistory();
  const requestWithdrawal = useRequestWithdrawal();
  const [amount, setAmount] = reactExports.useState("");
  const [touched, setTouched] = reactExports.useState(false);
  const amountNum = Number(amount) || 0;
  const balance = wallet ? Number(wallet.balance) : 0;
  const error = touched && amount !== "" ? amountNum < MIN_WITHDRAW ? `Minimum withdrawal is ${MIN_WITHDRAW} paisa` : amountNum > balance ? `Insufficient balance (max: ${formatPaisa((wallet == null ? void 0 : wallet.balance) ?? BigInt(0))})` : null : null;
  const canSubmit = amountNum >= MIN_WITHDRAW && amountNum <= balance && !requestWithdrawal.isPending;
  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    requestWithdrawal.mutate(BigInt(amountNum), {
      onSuccess: () => {
        ue.success("Withdrawal request submitted!");
        setAmount("");
        setTouched(false);
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : "Failed to submit";
        ue.error(msg);
      }
    });
  };
  const withdrawalRequests = (txs ?? []).filter(
    (tx) => "Withdrawal" in tx.txType
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-2xl", "data-ocid": "withdraw.page", children: [
    walletLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-2xl" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-secondary/20 to-secondary/5 border border-secondary/30 rounded-2xl px-6 py-4 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-6 h-6 text-secondary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest", children: "Available to Withdraw" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-3xl font-black text-secondary",
            style: { fontFamily: "Bricolage Grotesque, sans-serif" },
            "data-ocid": "withdraw.balance",
            children: wallet ? formatPaisa(wallet.balance) : "—"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h3",
        {
          className: "font-bold text-lg text-foreground mb-4",
          style: { fontFamily: "Bricolage Grotesque, sans-serif" },
          children: "Request Withdrawal"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "withdraw-amount", className: "text-sm font-medium", children: "Amount (in Paisa)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "withdraw-amount",
                type: "number",
                min: MIN_WITHDRAW,
                max: balance,
                placeholder: `Min ${MIN_WITHDRAW} paisa`,
                value: amount,
                onChange: (e) => setAmount(e.target.value),
                onBlur: () => setTouched(true),
                className: "bg-input border-input pr-16 text-foreground placeholder:text-muted-foreground/50",
                "data-ocid": "withdraw.amount_input",
                disabled: requestWithdrawal.isPending
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium", children: "paisa" })
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-destructive text-xs flex items-center gap-1 mt-1",
              "data-ocid": "withdraw.field_error",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5" }),
                error
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Minimum: ",
            MIN_WITHDRAW,
            " paisa · Balance:",
            " ",
            wallet ? formatPaisa(wallet.balance) : "—"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          [100, 500, 1e3].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              disabled: v > balance,
              onClick: () => {
                setAmount(String(v));
                setTouched(true);
              },
              className: "flex-1 py-1.5 text-xs font-semibold rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed",
              children: formatPaisa(BigInt(v))
            },
            v
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              disabled: balance < MIN_WITHDRAW,
              onClick: () => {
                setAmount(String(balance));
                setTouched(true);
              },
              className: "flex-1 py-1.5 text-xs font-semibold rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed",
              children: "Max"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            className: "w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold rounded-xl transition-all active:scale-95",
            "data-ocid": "withdraw.submit_button",
            disabled: !canSubmit || requestWithdrawal.isPending,
            children: requestWithdrawal.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
              "Processing..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-4 h-4" }),
              "Request Withdrawal"
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h3",
        {
          className: "font-bold text-lg text-foreground mb-3",
          style: { fontFamily: "Bricolage Grotesque, sans-serif" },
          children: "Past Requests"
        }
      ),
      withdrawalRequests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-10 text-muted-foreground bg-card border border-border rounded-2xl",
          "data-ocid": "withdraw.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-10 h-10 mx-auto mb-3 opacity-25" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No withdrawal requests yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Pehla request bhejein!" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "bg-card border border-border rounded-2xl overflow-hidden",
          "data-ocid": "withdraw.requests_table",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/30 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: withdrawalRequests.map((tx, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(WithdrawalRow, { tx, idx }, String(tx.id))) })
          ] })
        }
      )
    ] })
  ] });
}
export {
  WithdrawPage as default
};
