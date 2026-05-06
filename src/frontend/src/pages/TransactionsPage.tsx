import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactionHistory } from "@/hooks/useBackend";
import {
  formatPaisa,
  nanosToDate,
  txTypeLabel,
  txTypeSign,
} from "@/lib/backendTypes";
import type { TransactionInfo } from "@/lib/backendTypes";
import {
  ArrowDownLeft,
  ArrowDownUp,
  ArrowUpRight,
  ClipboardList,
} from "lucide-react";
import { useMemo, useState } from "react";

type SortDir = "asc" | "desc";

const TX_TYPE_COLORS: Record<string, string> = {
  Deposit: "border-secondary/40 text-secondary bg-secondary/10",
  Withdrawal: "border-destructive/40 text-destructive bg-destructive/10",
  "Game Entry": "border-primary/40 text-primary bg-primary/10",
  "Game Win": "border-secondary/40 text-secondary bg-secondary/10",
  Refund: "border-secondary/40 text-secondary bg-secondary/10",
  Bonus: "border-accent/40 text-accent bg-accent/10",
  Commission: "border-muted-foreground/40 text-muted-foreground bg-muted/10",
};

function TxRow({ tx, idx }: { tx: TransactionInfo; idx: number }) {
  const sign = txTypeSign(tx.txType);
  const label = txTypeLabel(tx.txType);
  const colorClass =
    TX_TYPE_COLORS[label] ?? "border-border text-foreground bg-muted/10";
  const date = nanosToDate(tx.timestamp);

  return (
    <tr
      className="border-b border-border hover:bg-card/60 transition-colors"
      data-ocid={`transactions.item.${idx + 1}`}
    >
      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
        {date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        })}{" "}
        <span className="text-xs opacity-60">
          {date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </td>
      <td className="px-4 py-3">
        <Badge
          variant="outline"
          className={`text-xs font-semibold ${colorClass}`}
        >
          {label}
        </Badge>
      </td>
      <td
        className={`px-4 py-3 text-right font-bold text-sm tabular-nums ${
          sign === "+" ? "text-secondary" : "text-destructive"
        }`}
      >
        {sign}
        {formatPaisa(tx.amount)}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {tx.gameId !== null ? `Game #${String(tx.gameId)}` : "—"}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground max-w-[180px] truncate">
        {tx.note || "—"}
      </td>
    </tr>
  );
}

export default function TransactionsPage() {
  const { data: txs, isLoading } = useTransactionHistory();
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    if (!txs) return [];
    return [...txs].sort((a, b) =>
      sortDir === "desc"
        ? Number(b.timestamp - a.timestamp)
        : Number(a.timestamp - b.timestamp),
    );
  }, [txs, sortDir]);

  const toggleSort = () => setSortDir((d) => (d === "desc" ? "asc" : "desc"));

  return (
    <div className="space-y-5" data-ocid="transactions.page">
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-xl font-black text-foreground"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Transaction History
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {sorted.length} transactions total
          </p>
        </div>
        <button
          type="button"
          onClick={toggleSort}
          data-ocid="transactions.sort_toggle"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors bg-card border border-border rounded-lg px-3 py-2"
        >
          <ArrowDownUp className="w-4 h-4" />
          {sortDir === "desc" ? "Newest first" : "Oldest first"}
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {["a", "b", "c", "d", "e"].map((k) => (
            <Skeleton key={k} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground bg-card border border-border rounded-2xl"
          data-ocid="transactions.empty_state"
        >
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-25" />
          <p className="font-semibold text-foreground">No transactions yet</p>
          <p className="text-sm mt-1">Play games aur paise kamao!</p>
        </div>
      ) : (
        <div
          className="bg-card border border-border rounded-2xl overflow-hidden"
          data-ocid="transactions.table"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                    onClick={toggleSort}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") && toggleSort()
                    }
                    data-ocid="transactions.date_sort"
                  >
                    <span className="flex items-center gap-1">
                      Date
                      <ArrowDownUp className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Game
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((tx, idx) => (
                  <TxRow key={String(tx.id)} tx={tx} idx={idx} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
