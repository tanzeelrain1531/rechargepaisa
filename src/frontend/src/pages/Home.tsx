import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FALLBACK_GAMES,
  useActiveGames,
  useMyWallet,
  useTransactionHistory,
} from "@/hooks/useBackend";
import {
  formatPaisa,
  nanosToDate,
  txTypeLabel,
  txTypeSign,
} from "@/lib/backendTypes";
import type { GameInfo } from "@/lib/backendTypes";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  Coins,
  Play,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import type { AppPage } from "../App";

const GAME_EMOJIS: Record<string, string> = {
  "Ludo Pro": "🎲",
  "Teen Patti Master": "🃏",
  "Slots Fortune": "🎰",
  "Cricket Trivia": "🏏",
  "Rummy Star": "♟️",
  "Number King": "🔢",
};

const GAME_COLORS: string[] = [
  "from-primary/30 to-secondary/20 border-primary/40",
  "from-secondary/30 to-primary/20 border-secondary/40",
  "from-accent/30 to-primary/20 border-accent/40",
  "from-primary/25 to-accent/20 border-primary/30",
  "from-secondary/25 to-accent/20 border-secondary/30",
  "from-accent/25 to-secondary/20 border-accent/30",
];

function GameCard({
  game,
  index,
  onPlay,
}: { game: GameInfo; index: number; onPlay: (id: bigint) => void }) {
  const emoji = GAME_EMOJIS[game.name] ?? "🎮";
  const colorClass = GAME_COLORS[index % GAME_COLORS.length];

  return (
    <div
      className={`bg-gradient-to-br ${colorClass} border rounded-2xl p-4 flex flex-col gap-3 hover:scale-[1.02] transition-transform cursor-pointer`}
      data-ocid={`games.item.${index + 1}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-4xl">{emoji}</span>
        {game.maxWinnings > BigInt(5000) && (
          <Badge className="bg-accent/20 text-accent border-accent/30 border text-[10px]">
            <Trophy className="w-2.5 h-2.5 mr-1" />
            BIG WIN
          </Badge>
        )}
      </div>
      <div>
        <h3
          className="font-black text-sm text-foreground leading-tight"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          {game.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
          {game.description}
        </p>
      </div>
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-muted-foreground">Entry: </span>
          <span className="text-accent font-bold">
            {formatPaisa(game.entryFee)}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Win: </span>
          <span className="text-primary font-bold">
            {formatPaisa(game.maxWinnings)}
          </span>
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs h-8"
        data-ocid={`games.play_button.${index + 1}`}
        onClick={() => onPlay(game.id)}
      >
        <Play className="w-3 h-3 mr-1" />
        PLAY NOW
      </Button>
    </div>
  );
}

export default function Home({
  page: _page,
  setPage,
}: { page: AppPage; setPage: (p: AppPage) => void }) {
  const { data: wallet, isLoading: walletLoading } = useMyWallet();
  const { data: txs, isLoading: txLoading } = useTransactionHistory();
  const { data: games } = useActiveGames();

  const featuredGames = (games ?? FALLBACK_GAMES).slice(0, 3);
  const recentTxs = (txs ?? []).slice(0, 5);

  // Show new user bonus banner if wallet was just created
  const isNewUser =
    wallet && wallet.joinTime > BigInt(0) && wallet.totalInvested === BigInt(0);

  return (
    <div className="space-y-6 page-enter">
      {/* New user bonus banner */}
      {isNewUser && (
        <div
          className="rounded-2xl bg-gradient-to-r from-primary/25 to-accent/20 border border-primary/40 p-4 flex items-center gap-4"
          data-ocid="home.bonus_banner"
        >
          <span className="text-3xl">🎁</span>
          <div className="flex-1 min-w-0">
            <p
              className="font-black text-foreground text-sm"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              NEW USER BONUS!
            </p>
            <p className="text-muted-foreground text-xs mt-0.5">
              Pehle recharge par paao{" "}
              <span className="text-primary font-bold">10 Paisa FREE</span>{" "}
              instantly!
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs flex-shrink-0"
            data-ocid="home.claim_bonus_button"
            onClick={() => setPage("wallet")}
          >
            CLAIM NOW
          </Button>
        </div>
      )}

      {/* Top row: wallet + today's earnings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Wallet card */}
        <div
          className="md:col-span-2 rounded-2xl bg-gradient-to-br from-secondary/25 to-primary/15 border border-secondary/40 p-5"
          data-ocid="home.wallet_card"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Your Wallet
            </p>
            <button
              type="button"
              className="text-xs text-secondary font-medium hover:text-secondary/80 transition-colors flex items-center gap-1"
              data-ocid="home.wallet_details_link"
              onClick={() => setPage("wallet")}
            >
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {walletLoading ? (
            <Skeleton className="h-10 w-40 mb-2" />
          ) : (
            <p
              className="text-4xl font-black text-primary mb-1"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              {wallet ? formatPaisa(wallet.balance) : "\u20b90.00"}
            </p>
          )}
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            PAISA BALANCE
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              type="button"
              className="flex-1 bg-primary/80 hover:bg-primary text-primary-foreground font-bold text-sm"
              data-ocid="home.add_cash_button"
              onClick={() => setPage("wallet")}
            >
              <ArrowDownLeft className="w-4 h-4 mr-1" />
              ADD CASH
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-secondary/50 text-secondary hover:bg-secondary/10 font-bold text-sm"
              data-ocid="home.withdraw_button"
              onClick={() => setPage("withdraw")}
            >
              <ArrowUpRight className="w-4 h-4 mr-1" />
              WITHDRAW
            </Button>
          </div>
        </div>

        {/* Stats column */}
        <div className="space-y-3">
          <div
            className="rounded-2xl bg-card border border-border p-4"
            data-ocid="home.earnings_card"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Total Earned
              </p>
            </div>
            {walletLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <p
                className="text-2xl font-black text-secondary"
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                {wallet ? formatPaisa(wallet.totalEarned) : "\u20b90.00"}
              </p>
            )}
          </div>
          <div
            className="rounded-2xl bg-card border border-border p-4"
            data-ocid="home.invested_card"
          >
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-accent" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Invested
              </p>
            </div>
            {walletLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <p
                className="text-2xl font-black text-accent"
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                {wallet ? formatPaisa(wallet.totalInvested) : "\u20b90.00"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Featured games */}
      <div data-ocid="home.games_section">
        <div className="flex items-center justify-between mb-3">
          <h2
            className="font-black text-foreground flex items-center gap-2"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            <Zap className="w-5 h-5 text-primary" />
            GAME LIBRARY
          </h2>
          <button
            type="button"
            className="text-xs text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1"
            data-ocid="home.view_all_games_link"
            onClick={() => setPage("games")}
          >
            Sabhi games <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredGames.map((game, i) => (
            <GameCard
              key={game.id.toString()}
              game={game}
              index={i}
              onPlay={() => setPage("games")}
            />
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div data-ocid="home.transactions_section">
        <div className="flex items-center justify-between mb-3">
          <h2
            className="font-black text-foreground"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            RECENT ACTIVITY
          </h2>
          <button
            type="button"
            className="text-xs text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1"
            data-ocid="home.view_all_transactions_link"
            onClick={() => setPage("transactions")}
          >
            Sab dekho <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="rounded-2xl bg-card border border-border divide-y divide-border">
          {txLoading ? (
            ["tx-skel-a", "tx-skel-b", "tx-skel-c"].map((key) => (
              <div key={key} className="flex items-center gap-3 p-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))
          ) : recentTxs.length === 0 ? (
            <div
              className="flex flex-col items-center gap-3 py-10"
              data-ocid="home.no_transactions_empty_state"
            >
              <span className="text-4xl">📋</span>
              <p className="text-muted-foreground text-sm">
                Koi transaction nahi hua abhi tak
              </p>
              <Button
                type="button"
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="home.start_playing_button"
                onClick={() => setPage("games")}
              >
                Game Khelna Shuru Karo!
              </Button>
            </div>
          ) : (
            recentTxs.map((tx, i) => {
              const sign = txTypeSign(tx.txType);
              const label = txTypeLabel(tx.txType);
              const isCredit = sign === "+";
              const date = nanosToDate(tx.timestamp);
              return (
                <div
                  key={tx.id.toString()}
                  className="flex items-center gap-3 p-4"
                  data-ocid={`home.transaction.item.${i + 1}`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCredit
                        ? "bg-secondary/20 text-secondary"
                        : "bg-accent/20 text-accent"
                    }`}
                  >
                    {isCredit ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {date.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      isCredit ? "text-secondary" : "text-accent"
                    }`}
                  >
                    {sign}
                    {formatPaisa(tx.amount)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Hero image promo */}
      <div
        className="rounded-2xl overflow-hidden border border-border relative"
        data-ocid="home.promo_banner"
      >
        <img
          src="/assets/generated/hero-gaming.dim_800x500.jpg"
          alt="Play and Earn"
          className="w-full h-48 object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent flex items-center px-6">
          <div>
            <h3
              className="font-black text-2xl text-foreground"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              Play &amp; Earn
              <br />
              <span className="text-primary">Real Paisa!</span>
            </h3>
            <p className="text-muted-foreground text-sm mt-1 mb-3">
              India's premier real-money gaming platform
            </p>
            <Button
              type="button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
              data-ocid="home.explore_games_button"
              onClick={() => setPage("games")}
            >
              <Play className="w-4 h-4 mr-2" />
              Abhi Khelo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
