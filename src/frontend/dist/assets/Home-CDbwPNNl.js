import { c as createLucideIcon, u as useMyWallet, a as useTransactionHistory, b as useActiveGames, F as FALLBACK_GAMES, j as jsxRuntimeExports, C as ChevronRight, f as formatPaisa, A as ArrowDownLeft, d as ArrowUpRight, T as TrendingUp, t as txTypeSign, e as txTypeLabel, n as nanosToDate, B as Badge } from "./index-Csum0tV7.js";
import { B as Button } from "./button-ABhIitEP.js";
import { S as Skeleton } from "./skeleton-CTzmvrjX.js";
import { C as Coins, Z as Zap } from "./zap-Dmi1oklT.js";
import { T as Trophy } from "./trophy-h2TNu0ZV.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode);
const GAME_EMOJIS = {
  "Ludo Pro": "🎲",
  "Teen Patti Master": "🃏",
  "Slots Fortune": "🎰",
  "Cricket Trivia": "🏏",
  "Rummy Star": "♟️",
  "Number King": "🔢"
};
const GAME_COLORS = [
  "from-primary/30 to-secondary/20 border-primary/40",
  "from-secondary/30 to-primary/20 border-secondary/40",
  "from-accent/30 to-primary/20 border-accent/40",
  "from-primary/25 to-accent/20 border-primary/30",
  "from-secondary/25 to-accent/20 border-secondary/30",
  "from-accent/25 to-secondary/20 border-accent/30"
];
function GameCard({
  game,
  index,
  onPlay
}) {
  const emoji = GAME_EMOJIS[game.name] ?? "🎮";
  const colorClass = GAME_COLORS[index % GAME_COLORS.length];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `bg-gradient-to-br ${colorClass} border rounded-2xl p-4 flex flex-col gap-3 hover:scale-[1.02] transition-transform cursor-pointer`,
      "data-ocid": `games.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", children: emoji }),
          game.maxWinnings > BigInt(5e3) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-accent/20 text-accent border-accent/30 border text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-2.5 h-2.5 mr-1" }),
            "BIG WIN"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h3",
            {
              className: "font-black text-sm text-foreground leading-tight",
              style: { fontFamily: "Bricolage Grotesque, sans-serif" },
              children: game.name
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: game.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Entry: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-bold", children: formatPaisa(game.entryFee) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Win: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: formatPaisa(game.maxWinnings) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs h-8",
            "data-ocid": `games.play_button.${index + 1}`,
            onClick: () => onPlay(game.id),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3 mr-1" }),
              "PLAY NOW"
            ]
          }
        )
      ]
    }
  );
}
function Home({
  page: _page,
  setPage
}) {
  const { data: wallet, isLoading: walletLoading } = useMyWallet();
  const { data: txs, isLoading: txLoading } = useTransactionHistory();
  const { data: games } = useActiveGames();
  const featuredGames = (games ?? FALLBACK_GAMES).slice(0, 3);
  const recentTxs = (txs ?? []).slice(0, 5);
  const isNewUser = wallet && wallet.joinTime > BigInt(0) && wallet.totalInvested === BigInt(0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 page-enter", children: [
    isNewUser && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl bg-gradient-to-r from-primary/25 to-accent/20 border border-primary/40 p-4 flex items-center gap-4",
        "data-ocid": "home.bonus_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "🎁" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-black text-foreground text-sm",
                style: { fontFamily: "Bricolage Grotesque, sans-serif" },
                children: "NEW USER BONUS!"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-xs mt-0.5", children: [
              "Pehle recharge par paao",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: "10 Paisa FREE" }),
              " ",
              "instantly!"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              className: "bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs flex-shrink-0",
              "data-ocid": "home.claim_bonus_button",
              onClick: () => setPage("wallet"),
              children: "CLAIM NOW"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "md:col-span-2 rounded-2xl bg-gradient-to-br from-secondary/25 to-primary/15 border border-secondary/40 p-5",
          "data-ocid": "home.wallet_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "Your Wallet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "text-xs text-secondary font-medium hover:text-secondary/80 transition-colors flex items-center gap-1",
                  "data-ocid": "home.wallet_details_link",
                  onClick: () => setPage("wallet"),
                  children: [
                    "Details ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
                  ]
                }
              )
            ] }),
            walletLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-40 mb-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-4xl font-black text-primary mb-1",
                style: { fontFamily: "Bricolage Grotesque, sans-serif" },
                children: wallet ? formatPaisa(wallet.balance) : "₹0.00"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "PAISA BALANCE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  className: "flex-1 bg-primary/80 hover:bg-primary text-primary-foreground font-bold text-sm",
                  "data-ocid": "home.add_cash_button",
                  onClick: () => setPage("wallet"),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "w-4 h-4 mr-1" }),
                    "ADD CASH"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  className: "flex-1 border-secondary/50 text-secondary hover:bg-secondary/10 font-bold text-sm",
                  "data-ocid": "home.withdraw_button",
                  onClick: () => setPage("withdraw"),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-4 h-4 mr-1" }),
                    "WITHDRAW"
                  ]
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-2xl bg-card border border-border p-4",
            "data-ocid": "home.earnings_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-secondary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "Total Earned" })
              ] }),
              walletLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-24" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-2xl font-black text-secondary",
                  style: { fontFamily: "Bricolage Grotesque, sans-serif" },
                  children: wallet ? formatPaisa(wallet.totalEarned) : "₹0.00"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-2xl bg-card border border-border p-4",
            "data-ocid": "home.invested_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-4 h-4 text-accent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "Invested" })
              ] }),
              walletLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-24" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-2xl font-black text-accent",
                  style: { fontFamily: "Bricolage Grotesque, sans-serif" },
                  children: wallet ? formatPaisa(wallet.totalInvested) : "₹0.00"
                }
              )
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "home.games_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "h2",
          {
            className: "font-black text-foreground flex items-center gap-2",
            style: { fontFamily: "Bricolage Grotesque, sans-serif" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-primary" }),
              "GAME LIBRARY"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "text-xs text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1",
            "data-ocid": "home.view_all_games_link",
            onClick: () => setPage("games"),
            children: [
              "Sabhi games ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: featuredGames.map((game, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        GameCard,
        {
          game,
          index: i,
          onPlay: () => setPage("games")
        },
        game.id.toString()
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "home.transactions_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "font-black text-foreground",
            style: { fontFamily: "Bricolage Grotesque, sans-serif" },
            children: "RECENT ACTIVITY"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "text-xs text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1",
            "data-ocid": "home.view_all_transactions_link",
            onClick: () => setPage("transactions"),
            children: [
              "Sab dekho ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card border border-border divide-y divide-border", children: txLoading ? ["tx-skel-a", "tx-skel-b", "tx-skel-c"].map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-8 h-8 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-32" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16" })
      ] }, key)) : recentTxs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-3 py-10",
          "data-ocid": "home.no_transactions_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", children: "📋" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Koi transaction nahi hua abhi tak" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                className: "bg-primary text-primary-foreground hover:bg-primary/90",
                "data-ocid": "home.start_playing_button",
                onClick: () => setPage("games"),
                children: "Game Khelna Shuru Karo!"
              }
            )
          ]
        }
      ) : recentTxs.map((tx, i) => {
        const sign = txTypeSign(tx.txType);
        const label = txTypeLabel(tx.txType);
        const isCredit = sign === "+";
        const date = nanosToDate(tx.timestamp);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 p-4",
            "data-ocid": `home.transaction.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isCredit ? "bg-secondary/20 text-secondary" : "bg-accent/20 text-accent"}`,
                  children: isCredit ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: date.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit"
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `text-sm font-bold tabular-nums ${isCredit ? "text-secondary" : "text-accent"}`,
                  children: [
                    sign,
                    formatPaisa(tx.amount)
                  ]
                }
              )
            ]
          },
          tx.id.toString()
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl overflow-hidden border border-border relative",
        "data-ocid": "home.promo_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/assets/generated/hero-gaming.dim_800x500.jpg",
              alt: "Play and Earn",
              className: "w-full h-48 object-cover object-center"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent flex items-center px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "h3",
              {
                className: "font-black text-2xl text-foreground",
                style: { fontFamily: "Bricolage Grotesque, sans-serif" },
                children: [
                  "Play & Earn",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Real Paisa!" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1 mb-3", children: "India's premier real-money gaming platform" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                className: "bg-primary text-primary-foreground hover:bg-primary/90 font-bold",
                "data-ocid": "home.explore_games_button",
                onClick: () => setPage("games"),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4 mr-2" }),
                  "Abhi Khelo"
                ]
              }
            )
          ] }) })
        ]
      }
    )
  ] });
}
export {
  Home as default
};
