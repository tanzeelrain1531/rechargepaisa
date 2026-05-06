import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMyWallet,
  useRequestWithdrawal,
  useTransactionHistory,
} from "@/hooks/useBackend";
import { formatPaisa, nanosToDate } from "@/lib/backendTypes";
import type { TransactionInfo } from "@/lib/backendTypes";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MIN_WITHDRAW = 50;

const _STATUS_CONFIG = {
  Pending: {
    color: "border-warning/40 text-warning bg-warning/10",
    icon: Clock,
  },
  Approved: {
    color: "border-secondary/40 text-secondary bg-secondary/10",
    icon: CheckCircle2,
  },
  Rejected: {
    color: "border-destructive/40 text-destructive bg-destructive/10",
    icon: XCircle,
  },
  Unknown: {
    color: "border-border text-muted-foreground bg-muted/10",
    icon: AlertCircle,
  },
};

function WithdrawalRow({ tx, idx }: { tx: TransactionInfo; idx: number }) {
  const date = nanosToDate(tx.timestamp);

  return (
    <tr
      className="border-b border-border hover:bg-card/60 transition-colors"
      data-ocid={`withdraw.request_item.${idx + 1}`}
    >
      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
        {date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        })}
      </td>
      <td className="px-4 py-3 text-sm font-bold text-foreground">
        {formatPaisa(tx.amount)}
      </td>
      <td className="px-4 py-3">
        <Badge
          variant="outline"
          className="text-xs flex items-center gap-1 w-fit border-warning/40 text-warning bg-warning/10"
        >
          <Clock className="w-3 h-3" />
          Submitted
        </Badge>
      </td>
    </tr>
  );
}

export default function WithdrawPage() {
  const { data: wallet, isLoading: walletLoading } = useMyWallet();
  const { data: txs } = useTransactionHistory();
  const requestWithdrawal = useRequestWithdrawal();

  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);

  const amountNum = Number(amount) || 0;
  const balance = wallet ? Number(wallet.balance) : 0;

  const error =
    touched && amount !== ""
      ? amountNum < MIN_WITHDRAW
        ? `Minimum withdrawal is ${MIN_WITHDRAW} paisa`
        : amountNum > balance
          ? `Insufficient balance (max: ${formatPaisa(wallet?.balance ?? BigInt(0))})`
          : null
      : null;

  const canSubmit =
    amountNum >= MIN_WITHDRAW &&
    amountNum <= balance &&
    !requestWithdrawal.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    requestWithdrawal.mutate(BigInt(amountNum), {
      onSuccess: () => {
        toast.success("Withdrawal request submitted!");
        setAmount("");
        setTouched(false);
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : "Failed to submit";
        toast.error(msg);
      },
    });
  };

  // Withdrawal requests from transaction history (Withdrawal type)
  const withdrawalRequests = (txs ?? []).filter(
    (tx) => "Withdrawal" in tx.txType,
  );

  return (
    <div className="space-y-6 max-w-2xl" data-ocid="withdraw.page">
      {/* Balance display */}
      {walletLoading ? (
        <Skeleton className="h-24 w-full rounded-2xl" />
      ) : (
        <div className="bg-gradient-to-r from-secondary/20 to-secondary/5 border border-secondary/30 rounded-2xl px-6 py-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center flex-shrink-0">
            <ArrowUpRight className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Available to Withdraw
            </p>
            <p
              className="text-3xl font-black text-secondary"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              data-ocid="withdraw.balance"
            >
              {wallet ? formatPaisa(wallet.balance) : "—"}
            </p>
          </div>
        </div>
      )}

      {/* Withdrawal form */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3
          className="font-bold text-lg text-foreground mb-4"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Request Withdrawal
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="withdraw-amount" className="text-sm font-medium">
              Amount (in Paisa)
            </Label>
            <div className="relative">
              <Input
                id="withdraw-amount"
                type="number"
                min={MIN_WITHDRAW}
                max={balance}
                placeholder={`Min ${MIN_WITHDRAW} paisa`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onBlur={() => setTouched(true)}
                className="bg-input border-input pr-16 text-foreground placeholder:text-muted-foreground/50"
                data-ocid="withdraw.amount_input"
                disabled={requestWithdrawal.isPending}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                paisa
              </span>
            </div>
            {error && (
              <p
                className="text-destructive text-xs flex items-center gap-1 mt-1"
                data-ocid="withdraw.field_error"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Minimum: {MIN_WITHDRAW} paisa · Balance:{" "}
              {wallet ? formatPaisa(wallet.balance) : "—"}
            </p>
          </div>

          {/* Quick fill buttons */}
          <div className="flex gap-2">
            {[100, 500, 1000].map((v) => (
              <button
                key={v}
                type="button"
                disabled={v > balance}
                onClick={() => {
                  setAmount(String(v));
                  setTouched(true);
                }}
                className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {formatPaisa(BigInt(v))}
              </button>
            ))}
            <button
              type="button"
              disabled={balance < MIN_WITHDRAW}
              onClick={() => {
                setAmount(String(balance));
                setTouched(true);
              }}
              className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Max
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold rounded-xl transition-all active:scale-95"
            data-ocid="withdraw.submit_button"
            disabled={!canSubmit || requestWithdrawal.isPending}
          >
            {requestWithdrawal.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" />
                Request Withdrawal
              </span>
            )}
          </Button>
        </form>
      </div>

      {/* Past withdrawal requests */}
      <div>
        <h3
          className="font-bold text-lg text-foreground mb-3"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Past Requests
        </h3>

        {withdrawalRequests.length === 0 ? (
          <div
            className="text-center py-10 text-muted-foreground bg-card border border-border rounded-2xl"
            data-ocid="withdraw.empty_state"
          >
            <ArrowUpRight className="w-10 h-10 mx-auto mb-3 opacity-25" />
            <p className="font-medium">No withdrawal requests yet</p>
            <p className="text-sm mt-1">Pehla request bhejein!</p>
          </div>
        ) : (
          <div
            className="bg-card border border-border rounded-2xl overflow-hidden"
            data-ocid="withdraw.requests_table"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {withdrawalRequests.map((tx, idx) => (
                  <WithdrawalRow key={String(tx.id)} tx={tx} idx={idx} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
