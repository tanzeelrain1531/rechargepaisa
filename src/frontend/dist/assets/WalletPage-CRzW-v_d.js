import { u as useMyWallet, a as useTransactionHistory, j as jsxRuntimeExports, f as formatPaisa, W as Wallet, T as TrendingUp, d as ArrowUpRight, G as Gamepad2, t as txTypeSign, e as txTypeLabel, n as nanosToDate, A as ArrowDownLeft } from "./index-Csum0tV7.js";
import { B as Button } from "./button-ABhIitEP.js";
import { S as Skeleton } from "./skeleton-CTzmvrjX.js";
import { T as TrendingDown } from "./trending-down-DIEZIZaQ.js";
function WalletPage({ setPage }) {
  const { data: wallet, isLoading: walletLoading } = useMyWallet();
  const { data: txs, isLoading: txLoading } = useTransactionHistory();
  const recentTxs = (txs ?? []).slice(0, 10);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "wallet.page", children: [
    walletLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-2xl" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-primary/25 via-primary/10 to-secondary/15 border border-primary/35 rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-1", children: "Total Balance" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-3 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-5xl font-black text-primary",
            style: { fontFamily: "Bricolage Grotesque, sans-serif" },
            "data-ocid": "wallet.balance",
            children: wallet ? formatPaisa(wallet.balance) : "—"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-7 h-7 text-primary/60 mb-1" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background/30 rounded-xl px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-3.5 h-3.5 text-destructive" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Total Invested" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-lg font-bold text-foreground",
              "data-ocid": "wallet.total_invested",
              children: wallet ? formatPaisa(wallet.totalInvested) : "—"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background/30 rounded-xl px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3.5 h-3.5 text-secondary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Total Earned" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-lg font-bold text-secondary",
              "data-ocid": "wallet.total_earned",
              children: wallet ? formatPaisa(wallet.totalEarned) : "—"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          className: "h-14 flex items-center gap-2 border-secondary/40 text-secondary hover:bg-secondary/10 rounded-xl font-semibold",
          "data-ocid": "wallet.withdraw_button",
          onClick: () => setPage("withdraw"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-5 h-5" }),
            "Request Withdrawal"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          className: "h-14 flex items-center gap-2 border-primary/40 text-primary hover:bg-primary/10 rounded-xl font-semibold",
          "data-ocid": "wallet.play_button",
          onClick: () => setPage("games"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gamepad2, { className: "w-5 h-5" }),
            "Play Games"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h3",
          {
            className: "font-bold text-lg text-foreground",
            style: { fontFamily: "Bricolage Grotesque, sans-serif" },
            children: "Recent Transactions"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "text-xs text-primary hover:underline",
            "data-ocid": "wallet.view_all_button",
            onClick: () => setPage("transactions"),
            children: "View All →"
          }
        )
      ] }),
      txLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-xl" }, k)) }) : recentTxs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-12 text-muted-foreground",
          "data-ocid": "wallet.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-10 h-10 mx-auto mb-3 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No transactions yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Play a game to get started!" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "wallet.tx_list", children: recentTxs.map((tx, idx) => {
        const sign = txTypeSign(tx.txType);
        const label = txTypeLabel(tx.txType);
        const date = nanosToDate(tx.timestamp);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:border-border/80 transition-colors",
            "data-ocid": `wallet.tx_item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${sign === "+" ? "bg-secondary/15 text-secondary" : "bg-destructive/15 text-destructive"}`,
                  children: sign === "+" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  date.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit"
                  }),
                  tx.note ? ` · ${tx.note}` : ""
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: `text-base font-bold flex-shrink-0 ${sign === "+" ? "text-secondary" : "text-destructive"}`,
                  children: [
                    sign,
                    formatPaisa(tx.amount)
                  ]
                }
              )
            ]
          },
          String(tx.id)
        );
      }) })
    ] })
  ] });
}
export {
  WalletPage as default
};
