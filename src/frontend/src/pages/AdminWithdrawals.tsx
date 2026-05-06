import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useApproveWithdrawal,
  usePendingWithdrawals,
  useRejectWithdrawal,
} from "@/hooks/useBackend";
import {
  formatPaisa,
  nanosToDate,
  withdrawalStatusLabel,
} from "@/lib/backendTypes";
import type { WithdrawalRequestInfo } from "@/lib/backendTypes";
import { ArrowDownLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function WithdrawalRow({
  req,
  index,
  onApprove,
  onReject,
  pending,
}: {
  req: WithdrawalRequestInfo;
  index: number;
  onApprove: (id: bigint) => void;
  onReject: (id: bigint) => void;
  pending: bigint | null;
}) {
  const pid = req.userId.toString();
  const short = `${pid.slice(0, 10)}…${pid.slice(-4)}`;
  const statusLabel = withdrawalStatusLabel(req.status);
  const isProcessing = pending === req.id;

  return (
    <tr
      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
      data-ocid={`admin-withdrawals.item.${index + 1}`}
    >
      <td className="px-5 py-4">
        <p className="font-mono text-xs text-muted-foreground">{short}</p>
      </td>
      <td className="px-5 py-4 text-right">
        <span
          className="font-bold text-foreground"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          {formatPaisa(req.amount)}
        </span>
      </td>
      <td className="px-5 py-4 text-right text-sm text-muted-foreground">
        {nanosToDate(req.requestedAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="px-5 py-4 text-center">
        <Badge
          className={`text-xs border ${
            "Pending" === statusLabel
              ? "bg-warning/15 text-warning border-warning/30"
              : "Approved" === statusLabel
                ? "bg-success/15 text-success border-success/30"
                : "bg-destructive/15 text-destructive border-destructive/30"
          }`}
        >
          {statusLabel}
        </Badge>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2 justify-end">
          <Button
            type="button"
            size="sm"
            disabled={isProcessing}
            data-ocid={`admin-withdrawals.confirm_button.${index + 1}`}
            onClick={() => onApprove(req.id)}
            className="bg-success/15 text-success hover:bg-success/25 border border-success/30 gap-1"
            variant="ghost"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Approve
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isProcessing}
            data-ocid={`admin-withdrawals.delete_button.${index + 1}`}
            onClick={() => onReject(req.id)}
            className="bg-destructive/15 text-destructive hover:bg-destructive/25 border border-destructive/30 gap-1"
            variant="ghost"
          >
            <XCircle className="w-3.5 h-3.5" />
            Reject
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminWithdrawals() {
  const { data: requests, isLoading } = usePendingWithdrawals();
  const approve = useApproveWithdrawal();
  const reject = useRejectWithdrawal();
  const [processingId, setProcessingId] = useState<bigint | null>(null);

  const handleApprove = async (id: bigint) => {
    setProcessingId(id);
    try {
      await approve.mutateAsync(id);
      toast.success("Withdrawal approved!");
    } catch {
      toast.error("Failed to approve withdrawal.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: bigint) => {
    setProcessingId(id);
    try {
      await reject.mutateAsync(id);
      toast.error("Withdrawal rejected.");
    } catch {
      toast.error("Failed to reject withdrawal.");
    } finally {
      setProcessingId(null);
    }
  };

  const pending = requests ?? [];

  return (
    <div className="space-y-5" data-ocid="admin-withdrawals.page">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/15">
                <Clock className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p
                  className="text-xl font-black text-warning"
                  style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                  data-ocid="admin-withdrawals.pending_count"
                >
                  {isLoading ? "—" : pending.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/15">
                <ArrowDownLeft className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Requested</p>
                <p
                  className="text-xl font-black text-foreground"
                  style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                >
                  {isLoading
                    ? "—"
                    : formatPaisa(
                        pending.reduce((s, r) => s + r.amount, BigInt(0)),
                      )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/15">
                <CheckCircle className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Request</p>
                <p
                  className="text-xl font-black text-foreground"
                  style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                >
                  {isLoading || pending.length === 0
                    ? "—"
                    : formatPaisa(
                        pending.reduce((s, r) => s + r.amount, BigInt(0)) /
                          BigInt(pending.length),
                      )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-semibold">
              Withdrawal Requests
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-5 space-y-3">
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
            </div>
          ) : pending.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              data-ocid="admin-withdrawals.empty_state"
            >
              <CheckCircle className="w-10 h-10 text-success/50 mb-3" />
              <p className="font-semibold text-foreground mb-1">All clear!</p>
              <p className="text-muted-foreground text-sm">
                No pending withdrawals at the moment.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Requested
                  </th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pending.map((req, idx) => (
                  <WithdrawalRow
                    key={`wr-${Number(req.id)}`}
                    req={req}
                    index={idx}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    pending={processingId}
                  />
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
