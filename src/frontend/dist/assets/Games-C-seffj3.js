import { b as useActiveGames, u as useMyWallet, g as usePlayGame, r as reactExports, j as jsxRuntimeExports, W as Wallet, f as formatPaisa, G as Gamepad2, h as ue, B as Badge } from "./index-Csum0tV7.js";
import { B as Button } from "./button-ABhIitEP.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-C4-dBSUl.js";
import { S as Skeleton } from "./skeleton-CTzmvrjX.js";
import { C as Coins, Z as Zap } from "./zap-Dmi1oklT.js";
import { T as Trophy } from "./trophy-h2TNu0ZV.js";
import "./index-CNB6nFOn.js";
const GAME_EMOJIS = {
  "Ludo Pro": "🎲",
  "Teen Patti Master": "🃏",
  "Slots Fortune": "🎰",
  "Cricket Trivia": "🏏",
  "Rummy Star": "⭐",
  "Number King": "🔢"
};
function GameCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-10 rounded-xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-32" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-24 rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-24 rounded-lg" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-xl" })
  ] });
}
function GameCard({
  game,
  onPlay
}) {
  const emoji = GAME_EMOJIS[game.name] ?? "🎮";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/50 hover:bg-card/80 transition-all duration-200 group",
      "data-ocid": `games.card.${Number(game.id)}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform", children: emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-foreground text-base leading-tight truncate", children: game.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-0.5 line-clamp-2", children: game.description })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "border-primary/40 text-primary bg-primary/10 flex items-center gap-1 text-xs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-3 h-3" }),
                "Entry: ",
                formatPaisa(game.entryFee)
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "border-secondary/40 text-secondary bg-secondary/10 flex items-center gap-1 text-xs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-3 h-3" }),
                "Win: ",
                formatPaisa(game.maxWinnings)
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 text-accent" }),
          "Up to",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent font-semibold", children: [
            (Number(game.maxWinnings) / Number(game.entryFee)).toFixed(1),
            "x"
          ] }),
          " ",
          "return"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            className: "w-full mt-auto bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl transition-all active:scale-95",
            "data-ocid": `games.play_button.${Number(game.id)}`,
            onClick: () => onPlay(game),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Gamepad2, { className: "w-4 h-4 mr-1.5" }),
              "Play Now"
            ]
          }
        )
      ]
    }
  );
}
function Games() {
  const { data: games, isLoading } = useActiveGames();
  const { data: wallet } = useMyWallet();
  const playGame = usePlayGame();
  const [selected, setSelected] = reactExports.useState(null);
  const [resultMsg, setResultMsg] = reactExports.useState(null);
  const handlePlay = (game) => {
    setSelected(game);
    setResultMsg(null);
  };
  const handleConfirm = () => {
    if (!selected) return;
    playGame.mutate(selected.id, {
      onSuccess: () => {
        setResultMsg("Game submitted! Admin will process result.");
        ue.success("Game entry recorded!");
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : "Failed to enter game";
        ue.error(msg);
        setSelected(null);
      }
    });
  };
  const handleClose = () => {
    setSelected(null);
    setResultMsg(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "games.page", children: [
    wallet && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-gradient-to-r from-primary/20 to-secondary/15 border border-primary/30 rounded-2xl px-5 py-3.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-5 h-5 text-primary flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Current Balance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-2xl font-black text-primary",
            style: { fontFamily: "Bricolage Grotesque, sans-serif" },
            children: formatPaisa(wallet.balance)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Games available" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-foreground", children: (games == null ? void 0 : games.length) ?? 0 })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h2",
        {
          className: "text-xl font-black text-foreground",
          style: { fontFamily: "Bricolage Grotesque, sans-serif" },
          children: "🎮 Game Library"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Entry fee deducted on play · Admin marks win/loss · Winnings credited instantly" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
        "data-ocid": "games.list",
        children: isLoading ? ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(GameCardSkeleton, {}, k)) : (games ?? []).map((game) => /* @__PURE__ */ jsxRuntimeExports.jsx(GameCard, { game, onPlay: handlePlay }, String(game.id)))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!selected, onOpenChange: (open) => !open && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContent,
      {
        className: "bg-card border-border max-w-sm",
        "data-ocid": "games.dialog",
        children: resultMsg ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-center text-xl", children: "🎉 Entry Recorded!" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-4 space-y-2",
              "data-ocid": "games.success_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center mx-auto text-3xl", children: "✅" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold", children: resultMsg }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Hamare admin aapke result ko process karenge. Balance update ho jayega jeetne par!" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              className: "w-full",
              "data-ocid": "games.close_button",
              onClick: handleClose,
              children: "Got it!"
            }
          ) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gamepad2, { className: "w-5 h-5 text-primary" }),
            "Confirm Entry"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-xl p-4 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: "Game" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: selected == null ? void 0 : selected.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: "Entry Fee" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-primary", children: selected ? formatPaisa(selected.entryFee) : "" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: "Max Win" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-secondary", children: selected ? formatPaisa(selected.maxWinnings) : "" })
              ] }),
              wallet && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-border pt-2 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: "After deduction" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `font-bold text-sm ${selected && wallet.balance >= selected.entryFee ? "text-foreground" : "text-destructive"}`,
                    children: selected ? formatPaisa(
                      wallet.balance >= selected.entryFee ? wallet.balance - selected.entryFee : BigInt(0)
                    ) : ""
                  }
                )
              ] })
            ] }),
            selected && wallet && wallet.balance < selected.entryFee && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive text-sm text-center", children: "⚠️ Insufficient balance!" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "flex-1",
                "data-ocid": "games.cancel_button",
                onClick: handleClose,
                disabled: playGame.isPending,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                className: "flex-1 bg-primary text-primary-foreground font-bold",
                "data-ocid": "games.confirm_button",
                onClick: handleConfirm,
                disabled: playGame.isPending || !!selected && !!wallet && wallet.balance < selected.entryFee,
                children: playGame.isPending ? "Processing..." : "Confirm Play"
              }
            )
          ] })
        ] })
      }
    ) })
  ] });
}
export {
  Games as default
};
