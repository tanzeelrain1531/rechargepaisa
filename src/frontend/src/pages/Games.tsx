import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveGames, useMyWallet, usePlayGame } from "@/hooks/useBackend";
import type { GameInfo } from "@/lib/backendTypes";
import { formatPaisa } from "@/lib/backendTypes";
import { Coins, Gamepad2, Trophy, Wallet, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const GAME_EMOJIS: Record<string, string> = {
  "Ludo Pro": "🎲",
  "Teen Patti Master": "🃏",
  "Slots Fortune": "🎰",
  "Cricket Trivia": "🏏",
  "Rummy Star": "⭐",
  "Number King": "🔢",
};

function GameCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-48" />
      <div className="flex gap-2">
        <Skeleton className="h-7 w-24 rounded-lg" />
        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

function GameCard({
  game,
  onPlay,
}: { game: GameInfo; onPlay: (g: GameInfo) => void }) {
  const emoji = GAME_EMOJIS[game.name] ?? "🎮";
  return (
    <div
      className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/50 hover:bg-card/80 transition-all duration-200 group"
      data-ocid={`games.card.${Number(game.id)}`}
    >
      {/* Icon + name */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
          {emoji}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-foreground text-base leading-tight truncate">
            {game.name}
          </h3>
          <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">
            {game.description}
          </p>
        </div>
      </div>

      {/* Fees */}
      <div className="flex gap-2">
        <Badge
          variant="outline"
          className="border-primary/40 text-primary bg-primary/10 flex items-center gap-1 text-xs"
        >
          <Coins className="w-3 h-3" />
          Entry: {formatPaisa(game.entryFee)}
        </Badge>
        <Badge
          variant="outline"
          className="border-secondary/40 text-secondary bg-secondary/10 flex items-center gap-1 text-xs"
        >
          <Trophy className="w-3 h-3" />
          Win: {formatPaisa(game.maxWinnings)}
        </Badge>
      </div>

      {/* Multiplier */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Zap className="w-3.5 h-3.5 text-accent" />
        Up to{" "}
        <span className="text-accent font-semibold">
          {(Number(game.maxWinnings) / Number(game.entryFee)).toFixed(1)}x
        </span>{" "}
        return
      </div>

      {/* Play button */}
      <Button
        type="button"
        className="w-full mt-auto bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl transition-all active:scale-95"
        data-ocid={`games.play_button.${Number(game.id)}`}
        onClick={() => onPlay(game)}
      >
        <Gamepad2 className="w-4 h-4 mr-1.5" />
        Play Now
      </Button>
    </div>
  );
}

export default function Games() {
  const { data: games, isLoading } = useActiveGames();
  const { data: wallet } = useMyWallet();
  const playGame = usePlayGame();

  const [selected, setSelected] = useState<GameInfo | null>(null);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  const handlePlay = (game: GameInfo) => {
    setSelected(game);
    setResultMsg(null);
  };

  const handleConfirm = () => {
    if (!selected) return;
    playGame.mutate(selected.id, {
      onSuccess: () => {
        setResultMsg("Game submitted! Admin will process result.");
        toast.success("Game entry recorded!");
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : "Failed to enter game";
        toast.error(msg);
        setSelected(null);
      },
    });
  };

  const handleClose = () => {
    setSelected(null);
    setResultMsg(null);
  };

  return (
    <div className="space-y-6" data-ocid="games.page">
      {/* Balance banner */}
      {wallet && (
        <div className="flex items-center gap-3 bg-gradient-to-r from-primary/20 to-secondary/15 border border-primary/30 rounded-2xl px-5 py-3.5">
          <Wallet className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Current Balance</p>
            <p
              className="text-2xl font-black text-primary"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              {formatPaisa(wallet.balance)}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-muted-foreground">Games available</p>
            <p className="text-lg font-bold text-foreground">
              {games?.length ?? 0}
            </p>
          </div>
        </div>
      )}

      {/* Section heading */}
      <div>
        <h2
          className="text-xl font-black text-foreground"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          🎮 Game Library
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Entry fee deducted on play · Admin marks win/loss · Winnings credited
          instantly
        </p>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        data-ocid="games.list"
      >
        {isLoading
          ? ["a", "b", "c", "d", "e", "f"].map((k) => (
              <GameCardSkeleton key={k} />
            ))
          : (games ?? []).map((game) => (
              <GameCard key={String(game.id)} game={game} onPlay={handlePlay} />
            ))}
      </div>

      {/* Confirm modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent
          className="bg-card border-border max-w-sm"
          data-ocid="games.dialog"
        >
          {resultMsg ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-xl">
                  🎉 Entry Recorded!
                </DialogTitle>
              </DialogHeader>
              <div
                className="text-center py-4 space-y-2"
                data-ocid="games.success_state"
              >
                <div className="w-16 h-16 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center mx-auto text-3xl">
                  ✅
                </div>
                <p className="text-foreground font-semibold">{resultMsg}</p>
                <p className="text-muted-foreground text-sm">
                  Hamare admin aapke result ko process karenge. Balance update
                  ho jayega jeetne par!
                </p>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  className="w-full"
                  data-ocid="games.close_button"
                  onClick={handleClose}
                >
                  Got it!
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-primary" />
                  Confirm Entry
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="bg-muted/40 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Game</span>
                    <span className="font-semibold text-sm">
                      {selected?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Entry Fee
                    </span>
                    <span className="font-bold text-primary">
                      {selected ? formatPaisa(selected.entryFee) : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Max Win
                    </span>
                    <span className="font-bold text-secondary">
                      {selected ? formatPaisa(selected.maxWinnings) : ""}
                    </span>
                  </div>
                  {wallet && (
                    <div className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="text-muted-foreground text-sm">
                        After deduction
                      </span>
                      <span
                        className={`font-bold text-sm ${
                          selected && wallet.balance >= selected.entryFee
                            ? "text-foreground"
                            : "text-destructive"
                        }`}
                      >
                        {selected
                          ? formatPaisa(
                              wallet.balance >= selected.entryFee
                                ? wallet.balance - selected.entryFee
                                : BigInt(0),
                            )
                          : ""}
                      </span>
                    </div>
                  )}
                </div>
                {selected && wallet && wallet.balance < selected.entryFee && (
                  <p className="text-destructive text-sm text-center">
                    ⚠️ Insufficient balance!
                  </p>
                )}
              </div>
              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  data-ocid="games.cancel_button"
                  onClick={handleClose}
                  disabled={playGame.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-primary text-primary-foreground font-bold"
                  data-ocid="games.confirm_button"
                  onClick={handleConfirm}
                  disabled={
                    playGame.isPending ||
                    (!!selected &&
                      !!wallet &&
                      wallet.balance < selected.entryFee)
                  }
                >
                  {playGame.isPending ? "Processing..." : "Confirm Play"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
