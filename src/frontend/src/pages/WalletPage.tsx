import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyWallet, useTransactionHistory } from "@/hooks/useBackend";
import {
  formatPaisa,
  nanosToDate,
  txTypeLabel,
  txTypeSign,
} from "@/lib/backendTypes";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Gamepad2,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { AppPage } from "../App";

interface WalletPageProps {
  setPage: (p: AppPage) => void;
}

export default function WalletPage({ setPage }: WalletPageProps) {
  const { data: wallet, isLoading: walletLoading } = useMyWallet();
  const { data: txs, isLoading: txLoading } = useTransactionHistory();

  const recentTxs = (txs ?? []).slice(0, 10);

  return (
    <div className="space-y-6" data-ocid="wallet.page">
      {/* Balance Card */}
      {walletLoading ? (
        <Skeleton className="h-48 w-full rounded-2xl" />
      ) : (
        <div className="bg-gradient-to-br from-primary/25 via-primary/10 to-secondary/15 border border-primary/35 rounded-2xl p-6">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
            Total Balance
          </p>
          <div className="flex items-end gap-3 mb-5">
            <p
              className="text-5xl font-black text-primary"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              data-ocid="wallet.balance"
            >
              {wallet ? formatPaisa(wallet.balance) : "—"}
            </p>
            <Wallet className="w-7 h-7 text-primary/60 mb-1" />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/30 rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                <span className="text-xs">Total Invested</span>
              </div>
              <p
                className="text-lg font-bold text-foreground"
                data-ocid="wallet.total_invested"
              >
                {wallet ? formatPaisa(wallet.totalInvested) : "—"}
              </p>
            </div>
            <div className="bg-background/30 rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-secondary" />
                <span className="text-xs">Total Earned</span>
              </div>
              <p
                className="text-lg font-bold text-secondary"
                data-ocid="wallet.total_earned"
              >
                {wallet ? formatPaisa(wallet.totalEarned) : "—"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-14 flex items-center gap-2 border-secondary/40 text-secondary hover:bg-secondary/10 rounded-xl font-semibold"
          data-ocid="wallet.withdraw_button"
          onClick={() => setPage("withdraw")}
        >
          <ArrowUpRight className="w-5 h-5" />
          Request Withdrawal
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-14 flex items-center gap-2 border-primary/40 text-primary hover:bg-primary/10 rounded-xl font-semibold"
          data-ocid="wallet.play_button"
          onClick={() => setPage("games")}
        >
          <Gamepad2 className="w-5 h-5" />
          Play Games
        </Button>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3
            className="font-bold text-lg text-foreground"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Recent Transactions
          </h3>
          <button
            type="button"
            className="text-xs text-primary hover:underline"
            data-ocid="wallet.view_all_button"
            onClick={() => setPage("transactions")}
          >
            View All →
          </button>
        </div>

        {txLoading ? (
          <div className="space-y-2">
            {["a", "b", "c"].map((k) => (
              <Skeleton key={k} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : recentTxs.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="wallet.empty_state"
          >
            <Wallet className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No transactions yet</p>
            <p className="text-sm mt-1">Play a game to get started!</p>
          </div>
        ) : (
          <div className="space-y-2" data-ocid="wallet.tx_list">
            {recentTxs.map((tx, idx) => {
              const sign = txTypeSign(tx.txType);
              const label = txTypeLabel(tx.txType);
              const date = nanosToDate(tx.timestamp);
              return (
                <div
                  key={String(tx.id)}
                  className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:border-border/80 transition-colors"
                  data-ocid={`wallet.tx_item.${idx + 1}`}
                >
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      sign === "+"
                        ? "bg-secondary/15 text-secondary"
                        : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    {sign === "+" ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {date.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })}
                      {tx.note ? ` · ${tx.note}` : ""}
                    </p>
                  </div>
                  {/* Amount */}
                  <p
                    className={`text-base font-bold flex-shrink-0 ${
                      sign === "+" ? "text-secondary" : "text-destructive"
                    }`}
                  >
                    {sign}
                    {formatPaisa(tx.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
