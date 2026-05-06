import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight, Loader2, Plus, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useDemoMode } from "../hooks/useDemoMode";

interface Referral {
  id: bigint;
  patientId: bigint;
  patientName: string;
  referredTo: string;
  reason: string;
  priority: string;
  status: string;
  notes: string;
  createdAt: bigint;
}

const priorityVariant = (p: string): "warning" | "danger" | "neutral" => {
  switch (p) {
    case "urgent":
      return "warning";
    case "emergent":
      return "danger";
    default:
      return "neutral";
  }
};

const statusVariant = (
  s: string,
): "warning" | "info" | "success" | "neutral" => {
  switch (s) {
    case "pending":
      return "warning";
    case "sent":
      return "info";
    case "completed":
      return "success";
    default:
      return "neutral";
  }
};

function formatDate(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  if (Number.isNaN(ms) || ms < 1_000_000) return "—";
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Referrals() {
  const { isDemoMode, demoActor } = useDemoMode();
  const { actor: realActor, isFetching } = useActor();
  const actor = isDemoMode ? demoActor : realActor;
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<bigint | null>(null);

  const [form, setForm] = useState({
    patientName: "",
    referredTo: "",
    reason: "",
    priority: "routine",
    notes: "",
  });

  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    void reloadTick; // trigger re-fetch
    if (!actor) return;
    if (!isDemoMode && isFetching) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await actor.listReferrals();
        if (!cancelled) setReferrals(data as Referral[]);
      } catch {
        if (!cancelled) toast.error("Failed to load referrals");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching, reloadTick, isDemoMode]);

  const handleSubmit = async () => {
    if (!form.patientName || !form.referredTo || !form.reason) {
      toast.error("Patient name, referred to, and reason are required");
      return;
    }
    if (!actor) return;
    setSubmitting(true);
    try {
      await actor.createReferral(
        BigInt(0),
        form.patientName,
        form.referredTo,
        form.reason,
        form.priority,
        form.notes,
      );
      toast.success("Referral created");
      setShowForm(false);
      setForm({
        patientName: "",
        referredTo: "",
        reason: "",
        priority: "routine",
        notes: "",
      });
      setReloadTick((t) => t + 1);
    } catch {
      toast.error("Failed to create referral");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: bigint, newStatus: string) => {
    if (!actor) return;
    setUpdatingId(id);
    try {
      await actor.updateReferralStatus(id, newStatus);
      setReferrals((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
      );
      toast.success(`Referral ${newStatus}`);
    } catch {
      toast.error("Failed to update referral");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-5" data-ocid="referrals.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          data-ocid="referrals.primary_button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          New Referral
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div
          className="border border-border bg-card rounded-sm"
          data-ocid="referrals.add.panel"
        >
          <div className="px-4 py-2.5 border-b border-border bg-muted/40">
            <span className="text-xs font-semibold text-foreground">
              New Referral
            </span>
          </div>
          <div className="px-4 py-3 space-y-3">
            <div className="flex flex-wrap gap-3">
              <div className="w-44">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Patient Name
                </Label>
                <Input
                  data-ocid="referrals.add.patient_name.input"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, patientName: e.target.value }))
                  }
                  className="mt-1 h-7 text-xs"
                  placeholder="e.g. Alice Johnson"
                />
              </div>
              <div className="flex-1 min-w-36">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Referred To
                </Label>
                <Input
                  data-ocid="referrals.add.referred_to.input"
                  value={form.referredTo}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, referredTo: e.target.value }))
                  }
                  className="mt-1 h-7 text-xs"
                  placeholder="e.g. Cardiology"
                />
              </div>
              <div className="flex-1 min-w-36">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Reason
                </Label>
                <Input
                  data-ocid="referrals.add.reason.input"
                  value={form.reason}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, reason: e.target.value }))
                  }
                  className="mt-1 h-7 text-xs"
                  placeholder="Reason for referral"
                />
              </div>
              <div className="w-32">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Priority
                </Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm((p) => ({ ...p, priority: v }))}
                >
                  <SelectTrigger
                    data-ocid="referrals.add.priority.select"
                    className="mt-1 h-7 text-xs"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergent">Emergent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Notes
              </Label>
              <Textarea
                data-ocid="referrals.add.notes.textarea"
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                className="mt-1 text-xs min-h-[48px] resize-none"
                placeholder="Additional notes..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                data-ocid="referrals.add.submit_button"
                onClick={handleSubmit}
                disabled={submitting}
                className="h-7 px-3 text-xs font-semibold bg-primary text-primary-foreground rounded-sm flex items-center gap-1.5 disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
                Create Referral
              </button>
              <button
                type="button"
                data-ocid="referrals.add.cancel_button"
                onClick={() => setShowForm(false)}
                className="h-7 px-3 text-xs font-semibold border border-border text-muted-foreground hover:text-foreground rounded-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Referrals Table */}
      <div className="border border-border bg-card rounded-sm">
        <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
          <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">
            Referrals
          </span>
          <span className="text-xs text-muted-foreground">
            ({referrals.length})
          </span>
        </div>

        {isLoading ? (
          <div
            className="p-4 space-y-2"
            data-ocid="referrals.table.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : referrals.length === 0 ? (
          <div
            className="px-4 py-10 text-center"
            data-ocid="referrals.table.empty_state"
          >
            <ArrowUpRight className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">
              No referrals yet
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Create a referral to track patient specialist consultations
            </p>
          </div>
        ) : (
          <Table data-ocid="referrals.table">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Patient
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Referred To
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Reason
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Priority
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Date
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((ref, i) => (
                <TableRow
                  key={String(ref.id)}
                  data-ocid={`referrals.row.${i + 1}`}
                  className="hover:bg-muted/30 even:bg-muted/20 border-l-2 border-l-transparent hover:border-l-accent transition-all"
                >
                  <TableCell className="font-medium text-sm px-4 py-2.5">
                    {ref.patientName}
                  </TableCell>
                  <TableCell className="text-sm px-4 py-2.5">
                    {ref.referredTo}
                  </TableCell>
                  <TableCell className="text-sm px-4 py-2.5 max-w-xs">
                    <span className="line-clamp-2">{ref.reason}</span>
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    <StatusBadge
                      variant={priorityVariant(ref.priority)}
                      label={ref.priority}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    <StatusBadge
                      variant={statusVariant(ref.status)}
                      label={ref.status}
                    />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground px-4 py-2.5">
                    {formatDate(ref.createdAt)}
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      {ref.status === "pending" && (
                        <>
                          <button
                            type="button"
                            data-ocid={`referrals.send_button.${i + 1}`}
                            onClick={() => handleStatusChange(ref.id, "sent")}
                            disabled={updatingId === ref.id}
                            className="h-6 px-2 text-xs font-semibold bg-primary text-primary-foreground rounded-sm disabled:opacity-60 flex items-center gap-1"
                          >
                            {updatingId === ref.id ? (
                              <Loader2 className="w-2.5 h-2.5 animate-spin" />
                            ) : null}
                            Mark Sent
                          </button>
                          <button
                            type="button"
                            data-ocid={`referrals.cancel_button.${i + 1}`}
                            onClick={() =>
                              handleStatusChange(ref.id, "cancelled")
                            }
                            disabled={updatingId === ref.id}
                            className="h-6 px-2 text-xs font-semibold border border-border text-muted-foreground hover:text-destructive rounded-sm disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {ref.status === "sent" && (
                        <>
                          <button
                            type="button"
                            data-ocid={`referrals.complete_button.${i + 1}`}
                            onClick={() =>
                              handleStatusChange(ref.id, "completed")
                            }
                            disabled={updatingId === ref.id}
                            className="h-6 px-2 text-xs font-semibold bg-primary text-primary-foreground rounded-sm disabled:opacity-60 flex items-center gap-1 hover:bg-primary/90"
                          >
                            {updatingId === ref.id ? (
                              <Loader2 className="w-2.5 h-2.5 animate-spin" />
                            ) : null}
                            Mark Completed
                          </button>
                          <button
                            type="button"
                            data-ocid={`referrals.cancel_button.${i + 1}`}
                            onClick={() =>
                              handleStatusChange(ref.id, "cancelled")
                            }
                            disabled={updatingId === ref.id}
                            className="h-6 px-2 text-xs font-semibold border border-border text-muted-foreground hover:text-destructive rounded-sm disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
