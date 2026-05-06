import { c as createLucideIcon, a as useTransactionHistory, r as reactExports, j as jsxRuntimeExports, i as ClipboardList, t as txTypeSign, e as txTypeLabel, n as nanosToDate, B as Badge, f as formatPaisa } from "./index-Csum0tV7.js";
import { S as Skeleton } from "./skeleton-CTzmvrjX.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m3 16 4 4 4-4", key: "1co6wj" }],
  ["path", { d: "M7 20V4", key: "1yoxec" }],
  ["path", { d: "m21 8-4-4-4 4", key: "1c9v7m" }],
  ["path", { d: "M17 4v16", key: "7dpous" }]
];
const ArrowDownUp = createLucideIcon("arrow-down-up", __iconNode);
const TX_TYPE_COLORS = {
  Deposit: "border-secondary/40 text-secondary bg-secondary/10",
  Withdrawal: "border-destructive/40 text-destructive bg-destructive/10",
  "Game Entry": "border-primary/40 text-primary bg-primary/10",
  "Game Win": "border-secondary/40 text-secondary bg-secondary/10",
  Refund: "border-secondary/40 text-secondary bg-secondary/10",
  Bonus: "border-accent/40 text-accent bg-accent/10",
  Commission: "border-muted-foreground/40 text-muted-foreground bg-muted/10"
};
function TxRow({ tx, idx }) {
  const sign = txTypeSign(tx.txType);
  const label = txTypeLabel(tx.txType);
  const colorClass = TX_TYPE_COLORS[label] ?? "border-border text-foreground bg-muted/10";
  const date = nanosToDate(tx.timestamp);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: "border-b border-border hover:bg-card/60 transition-colors",
      "data-ocid": `transactions.item.${idx + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-sm text-muted-foreground whitespace-nowrap", children: [
          date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "2-digit"
          }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs opacity-60", children: date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: `text-xs font-semibold ${colorClass}`,
            children: label
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "td",
          {
            className: `px-4 py-3 text-right font-bold text-sm tabular-nums ${sign === "+" ? "text-secondary" : "text-destructive"}`,
            children: [
              sign,
              formatPaisa(tx.amount)
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground", children: tx.gameId !== null ? `Game #${String(tx.gameId)}` : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground max-w-[180px] truncate", children: tx.note || "—" })
      ]
    }
  );
}
function TransactionsPage() {
  const { data: txs, isLoading } = useTransactionHistory();
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const sorted = reactExports.useMemo(() => {
    if (!txs) return [];
    return [...txs].sort(
      (a, b) => sortDir === "desc" ? Number(b.timestamp - a.timestamp) : Number(a.timestamp - b.timestamp)
    );
  }, [txs, sortDir]);
  const toggleSort = () => setSortDir((d) => d === "desc" ? "asc" : "desc");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "transactions.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "text-xl font-black text-foreground",
            style: { fontFamily: "Bricolage Grotesque, sans-serif" },
            children: "Transaction History"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          sorted.length,
          " transactions total"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: toggleSort,
          "data-ocid": "transactions.sort_toggle",
          className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors bg-card border border-border rounded-lg px-3 py-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownUp, { className: "w-4 h-4" }),
            sortDir === "desc" ? "Newest first" : "Oldest first"
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ["a", "b", "c", "d", "e"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" }, k)) }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 text-muted-foreground bg-card border border-border rounded-2xl",
        "data-ocid": "transactions.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-12 h-12 mx-auto mb-3 opacity-25" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No transactions yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Play games aur paise kamao!" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-card border border-border rounded-2xl overflow-hidden",
        "data-ocid": "transactions.table",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/30 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors",
                onClick: toggleSort,
                onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && toggleSort(),
                "data-ocid": "transactions.date_sort",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  "Date",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownUp, { className: "w-3 h-3" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Game" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Note" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sorted.map((tx, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(TxRow, { tx, idx }, String(tx.id))) })
        ] }) })
      }
    )
  ] });
}
export {
  TransactionsPage as default
};
