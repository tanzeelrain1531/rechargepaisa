import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Loader2,
  Package,
  Plus,
  Send,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/StatusBadge";
import {
  DEMO_EPRESCRIPTIONS,
  DEMO_REFILL_REQUESTS,
  type DemoEPrescription,
  type DemoRefillRequest,
} from "../demoData";
import { useActor } from "../hooks/useActor";
import { useDemoMode } from "../hooks/useDemoMode";
import {
  type InteractionAlert,
  checkInteractions,
} from "../lib/drugInteractions";

interface Prescription {
  id: bigint;
  patientId: bigint;
  patientName: string;
  medication: string;
  dose: string;
  prescribedBy: string;
  notes: string;
  status: string;
  createdAt: bigint;
}

const MOCK_PATIENT_MEDS: Record<string, string[]> = {
  "Alice Johnson": ["Lisinopril 10mg", "Metformin 500mg", "Aspirin 81mg"],
  "Bob Martinez": ["Warfarin 5mg", "Metformin 1000mg"],
  "Carol White": ["Amoxicillin 250mg"],
};

type RxStatusVariant = "warning" | "info" | "success" | "danger" | "neutral";

const rxStatusVariant: Record<string, RxStatusVariant> = {
  pending: "warning",
  verified: "info",
  dispensed: "success",
  rejected: "danger",
};

const SEVERITY_STYLES: Record<
  InteractionAlert["severity"],
  { container: string; badge: string; icon: React.ReactNode; label: string }
> = {
  contraindicated: {
    container: "bg-destructive/8 border border-destructive/30 text-destructive",
    badge: "bg-destructive text-destructive-foreground",
    icon: <XCircle className="w-3 h-3" />,
    label: "⛔ CONTRAINDICATED",
  },
  major: {
    container: "bg-warning/10 border border-warning/40 text-warning-foreground",
    badge: "bg-warning/100 text-white",
    icon: <AlertTriangle className="w-3 h-3" />,
    label: "⚠ MAJOR",
  },
  moderate: {
    container: "bg-warning/0.08 border border-warning/0.3 text-warning",
    badge: "bg-warning text-white",
    icon: <AlertTriangle className="w-3 h-3" />,
    label: "! MODERATE",
  },
  minor: {
    container: "bg-slate-50 border border-slate-200 text-slate-700",
    badge: "bg-slate-400 text-white",
    icon: <Info className="w-3 h-3" />,
    label: "ℹ MINOR",
  },
};

function InteractionAlertCard({ alert }: { alert: InteractionAlert }) {
  const style = SEVERITY_STYLES[alert.severity];
  return (
    <div
      className={`px-3 py-2.5 text-xs rounded-sm ${style.container}`}
      role="alert"
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-sm ${style.badge}`}
        >
          {style.icon}
          {style.label}
        </span>
        <span className="font-semibold">
          {alert.drug1} <span className="opacity-60">×</span> {alert.drug2}
        </span>
      </div>
      <p className="mb-0.5">
        <span className="font-semibold">Effect:</span> {alert.clinicalEffect}
      </p>
      <p>
        <span className="font-semibold">Management:</span> {alert.management}
      </p>
    </div>
  );
}

function AddPrescriptionForm({
  onAdd,
  onCancel,
  loading,
}: {
  onAdd: (data: {
    patientName: string;
    medication: string;
    dose: string;
    prescribedBy: string;
    notes: string;
  }) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    patientName: "",
    medication: "",
    dose: "",
    prescribedBy: "",
    notes: "",
  });
  const [interactions, setInteractions] = useState<InteractionAlert[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!form.medication.trim() || !form.patientName.trim()) {
      setInteractions([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const currentMeds = MOCK_PATIENT_MEDS[form.patientName] ?? [];
      const found = checkInteractions(form.medication, currentMeds);
      setInteractions(found);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form.medication, form.patientName]);

  const handleSubmit = async () => {
    if (
      !form.patientName ||
      !form.medication ||
      !form.dose ||
      !form.prescribedBy
    ) {
      toast.error(
        "Patient name, medication, dose, and prescriber are required",
      );
      return;
    }
    await onAdd(form);
  };

  return (
    <div
      className="px-4 py-3 border-b border-border bg-muted/20"
      data-ocid="pharmacy.add.panel"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        New Prescription
      </p>
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-44">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Patient Name
          </Label>
          <Input
            data-ocid="pharmacy.add.patient_name.input"
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
            Medication
          </Label>
          <Input
            data-ocid="pharmacy.add.medication.input"
            value={form.medication}
            onChange={(e) =>
              setForm((p) => ({ ...p, medication: e.target.value }))
            }
            className="mt-1 h-7 text-xs"
            placeholder="e.g. Lisinopril"
            autoComplete="off"
          />
        </div>
        <div className="w-28">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Dose
          </Label>
          <Input
            data-ocid="pharmacy.add.dose.input"
            value={form.dose}
            onChange={(e) => setForm((p) => ({ ...p, dose: e.target.value }))}
            className="mt-1 h-7 text-xs"
            placeholder="e.g. 10mg daily"
          />
        </div>
        <div className="w-36">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Prescribed By
          </Label>
          <Input
            data-ocid="pharmacy.add.prescriber.input"
            value={form.prescribedBy}
            onChange={(e) =>
              setForm((p) => ({ ...p, prescribedBy: e.target.value }))
            }
            className="mt-1 h-7 text-xs"
            placeholder="Dr. Name"
          />
        </div>
      </div>
      <div className="mt-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Notes
        </Label>
        <Textarea
          data-ocid="pharmacy.add.notes.textarea"
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          className="mt-1 text-xs min-h-[48px] resize-none"
          placeholder="Optional notes..."
        />
      </div>

      {interactions.length > 0 && (
        <div
          className="mt-3 space-y-2"
          data-ocid="pharmacy.add.interactions.panel"
          aria-label="Drug interaction alerts"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Drug Interaction Alerts ({interactions.length})
          </p>
          {interactions.map((alert) => (
            <InteractionAlertCard
              key={`${alert.drug1}-${alert.drug2}-${alert.severity}`}
              alert={alert}
            />
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <button
          type="button"
          data-ocid="pharmacy.add.submit_button"
          onClick={handleSubmit}
          disabled={loading}
          className="h-7 px-3 text-xs font-semibold bg-primary text-primary-foreground rounded-sm flex items-center gap-1.5 disabled:opacity-60"
        >
          {loading && <Loader2 className="w-3 h-3 animate-spin" />}
          Add Prescription
        </button>
        <button
          type="button"
          data-ocid="pharmacy.add.cancel_button"
          onClick={onCancel}
          className="h-7 px-3 text-xs font-semibold border border-border text-muted-foreground hover:text-foreground rounded-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function Pharmacy() {
  const { isDemoMode, demoActor } = useDemoMode();
  const { actor: realActor, isFetching } = useActor();
  const actor = isDemoMode ? demoActor : realActor;
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [addingRx, setAddingRx] = useState(false);
  const [updatingId, setUpdatingId] = useState<bigint | null>(null);
  const [refillRequests, setRefillRequests] =
    useState<DemoRefillRequest[]>(DEMO_REFILL_REQUESTS);
  const [expandedDeny, setExpandedDeny] = useState<string | null>(null);
  const [denyReason, setDenyReason] = useState("");

  const [reloadTick, setReloadTick] = useState(0);
  const [ePrescriptions, setEPrescriptions] = useState<DemoEPrescription[]>(
    isDemoMode ? DEMO_EPRESCRIPTIONS : [],
  );
  const [showERxPanel, setShowERxPanel] = useState(true);

  const [formularyFilter, setFormularyFilter] = useState<string>(() => {
    try {
      const p = JSON.parse(
        localStorage.getItem("medunite_prefs_Pharmacist") || "{}",
      );
      if (p.formulary && p.formulary !== "All") return p.formulary;
    } catch {
      /* ignore */
    }
    return "All";
  });
  const FORMULARY_OPTIONS = ["All", "Retail", "Mail Order", "Specialty"];
  const [transmittingId, setTransmittingId] = useState<string | null>(null);

  useEffect(() => {
    void reloadTick; // trigger re-fetch
    if (!actor) return;
    if (!isDemoMode && isFetching) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await actor.listPrescriptions();
        if (!cancelled) setPrescriptions(data as Prescription[]);
      } catch {
        if (!cancelled) toast.error("Failed to load prescriptions");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching, reloadTick, isDemoMode]);

  const handleAdd = async (data: {
    patientName: string;
    medication: string;
    dose: string;
    prescribedBy: string;
    notes: string;
  }) => {
    if (!actor) return;
    setAddingRx(true);
    try {
      await actor.createPrescription(
        BigInt(0),
        data.patientName,
        data.medication,
        data.dose,
        data.prescribedBy,
        data.notes,
      );
      toast.success("Prescription added");
      setShowForm(false);
      setReloadTick((t) => t + 1);
    } catch {
      toast.error("Failed to add prescription");
    } finally {
      setAddingRx(false);
    }
  };

  const handleStatusChange = async (id: bigint, newStatus: string) => {
    if (!actor) return;
    setUpdatingId(id);
    try {
      await actor.updatePrescriptionStatus(id, newStatus);
      setPrescriptions((prev) =>
        prev.map((rx) => (rx.id === id ? { ...rx, status: newStatus } : rx)),
      );
      toast.success(`Prescription ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingQueue = prescriptions.filter((rx) => rx.status === "pending");
  const verifiedQueue = prescriptions.filter((rx) => rx.status === "verified");

  const pendingRefills = refillRequests.filter((r) => r.status === "pending");

  const handleTransmit = async (id: string) => {
    setTransmittingId(id);
    setEPrescriptions((prev) =>
      prev.map((rx) =>
        rx.id === id ? { ...rx, status: "transmitted" as const } : rx,
      ),
    );
    setTransmittingId(null);
    toast.success("Prescription transmitted to pharmacy network.");
  };

  const handleApproveRefill = (req: DemoRefillRequest) => {
    setRefillRequests((prev) =>
      prev.map((r) =>
        r.id === req.id ? { ...r, status: "approved" as const } : r,
      ),
    );
    // Convert to prescription entry in queue
    setPrescriptions((prev) => [
      ...prev,
      {
        id: BigInt(Date.now()),
        patientId: BigInt(0),
        patientName: req.patientName,
        medication: req.medication,
        dose: "As directed",
        prescribedBy: "Refill Request",
        notes: req.notes || "Patient refill request",
        status: "pending",
        createdAt: BigInt(Date.now()) * 1_000_000n,
      },
    ]);
    toast.success(`Refill approved for ${req.medication}`);
    // Persist to backend (fire-and-forget)
    if (actor) {
      actor
        .createPrescription(
          BigInt(0),
          req.patientName,
          req.medication,
          "As directed",
          "Dr. Auto-Approved",
          "Refill request approved",
        )
        .catch(() => {});
    }
  };

  const handleDenyRefill = (req: DemoRefillRequest) => {
    if (!denyReason.trim()) {
      toast.error("Please enter a denial reason");
      return;
    }
    setRefillRequests((prev) =>
      prev.map((r) =>
        r.id === req.id
          ? { ...r, status: "denied" as const, denialReason: denyReason }
          : r,
      ),
    );
    setExpandedDeny(null);
    setDenyReason("");
    toast.success("Refill request denied");
  };

  return (
    <div className="space-y-5" data-ocid="pharmacy.page">
      {/* Formulary filter */}
      <div className="flex gap-1 flex-wrap">
        {FORMULARY_OPTIONS.map((fo) => (
          <button
            key={fo}
            type="button"
            onClick={() => setFormularyFilter(fo)}
            className={[
              "px-3 py-1 text-xs rounded border transition-colors",
              formularyFilter === fo
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            ].join(" ")}
          >
            {fo}
          </button>
        ))}
        {formularyFilter !== "All" && (
          <span className="px-2 py-1 text-xs text-muted-foreground">
            Showing {formularyFilter} queue
          </span>
        )}
      </div>
      {/* E-Prescribing Queue */}
      <div
        className="border border-border bg-card rounded-sm"
        data-ocid="pharmacy.erx.panel"
      >
        <button
          type="button"
          data-ocid="pharmacy.erx.toggle"
          onClick={() => setShowERxPanel((v) => !v)}
          className="w-full px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2 hover:bg-muted/60 transition-colors"
        >
          <Send className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground flex-1 text-left">
            E-Prescribing
          </span>
          {ePrescriptions.filter((r) => r.status === "draft").length > 0 && (
            <span className="px-1.5 py-0.5 text-xs font-bold bg-warning/15 text-warning border border-warning/30 rounded-sm">
              {ePrescriptions.filter((r) => r.status === "draft").length} draft
            </span>
          )}
          {showERxPanel ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>
        {showERxPanel && (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Patient
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Drug
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4 hidden sm:table-cell">
                  Prescriber
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4 hidden md:table-cell">
                  DEA#
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4 hidden md:table-cell">
                  Timestamp
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ePrescriptions.map((rx, i) => {
                const statusVariant: Record<
                  string,
                  "warning" | "info" | "success" | "danger" | "neutral"
                > = {
                  draft: "warning",
                  transmitted: "info",
                  confirmed: "success",
                  failed: "danger",
                };
                return (
                  <TableRow
                    key={rx.id}
                    data-ocid={`pharmacy.erx.row.${i + 1}`}
                    className="hover:bg-muted/30 border-l-2 border-l-transparent hover:border-l-accent transition-all"
                  >
                    <TableCell className="font-medium text-sm px-4 py-2">
                      {rx.patientName}
                    </TableCell>
                    <TableCell className="text-sm px-4 py-2">
                      <div className="font-medium">{rx.drug}</div>
                      <div className="text-xs text-muted-foreground">
                        {rx.dose}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm px-4 py-2 hidden sm:table-cell">
                      {rx.prescriber}
                    </TableCell>
                    <TableCell className="font-mono text-xs px-4 py-2 hidden md:table-cell text-muted-foreground">
                      {rx.deaNumber}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <StatusBadge
                        variant={statusVariant[rx.status] ?? "neutral"}
                        label={rx.status}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs px-4 py-2 hidden md:table-cell text-muted-foreground">
                      {new Date(rx.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {rx.status === "draft" && (
                        <button
                          type="button"
                          data-ocid={`pharmacy.erx.transmit_button.${i + 1}`}
                          onClick={() => handleTransmit(rx.id)}
                          disabled={transmittingId === rx.id}
                          className="h-6 px-2.5 text-xs font-semibold bg-primary text-primary-foreground rounded-sm flex items-center gap-1 disabled:opacity-60 hover:bg-primary/90 transition-colors"
                        >
                          {transmittingId === rx.id ? (
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          ) : (
                            <Send className="w-2.5 h-2.5" />
                          )}
                          {transmittingId === rx.id ? "Sending..." : "Transmit"}
                        </button>
                      )}
                      {rx.status === "failed" && (
                        <button
                          type="button"
                          data-ocid={`pharmacy.erx.retry_button.${i + 1}`}
                          onClick={() => handleTransmit(rx.id)}
                          disabled={transmittingId === rx.id}
                          className="h-6 px-2.5 text-xs font-semibold border border-danger/30 text-danger rounded-sm hover:bg-danger/10 disabled:opacity-60 transition-colors"
                        >
                          Retry
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Refill Requests */}
      {refillRequests.length > 0 && (
        <div
          className="border border-border bg-card rounded-sm"
          data-ocid="pharmacy.refills.panel"
        >
          <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">
              Refill Requests
            </span>
            {pendingRefills.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded-sm">
                {pendingRefills.length} pending
              </span>
            )}
          </div>
          <div className="divide-y divide-border">
            {refillRequests.map((req, idx) => (
              <div
                key={req.id}
                data-ocid={`pharmacy.refill.item.${idx + 1}`}
                className="px-4 py-3 space-y-2"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {req.medication}
                      </span>
                      <StatusBadge
                        variant={
                          req.status === "pending"
                            ? "warning"
                            : req.status === "approved"
                              ? "success"
                              : "danger"
                        }
                        label={req.status}
                      />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{req.patientName}</span>
                      <span>·</span>
                      <span>Requested {req.requestedAt}</span>
                      {req.notes && <span>· {req.notes}</span>}
                    </div>
                    {req.denialReason && (
                      <p className="text-xs text-danger/80">
                        Denied: {req.denialReason}
                      </p>
                    )}
                  </div>
                  {req.status === "pending" && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        data-ocid={`pharmacy.refill.approve_button.${idx + 1}`}
                        onClick={() => handleApproveRefill(req)}
                        className="px-2.5 py-1 text-xs font-semibold bg-success/10 text-success border border-success/20 rounded-sm hover:bg-success/20 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        data-ocid={`pharmacy.refill.delete_button.${idx + 1}`}
                        onClick={() => {
                          setExpandedDeny(
                            expandedDeny === req.id ? null : req.id,
                          );
                          setDenyReason("");
                        }}
                        className="px-2.5 py-1 text-xs font-semibold bg-danger/10 text-danger border border-danger/20 rounded-sm hover:bg-danger/20 transition-colors"
                      >
                        Deny
                      </button>
                    </div>
                  )}
                </div>
                {expandedDeny === req.id && (
                  <div className="flex items-end gap-2 pt-1">
                    <div className="flex-1">
                      <label
                        htmlFor={`deny-reason-${req.id}`}
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
                      >
                        Denial Reason
                      </label>
                      <input
                        id={`deny-reason-${req.id}`}
                        data-ocid={`pharmacy.refill.deny_reason.input.${idx + 1}`}
                        value={denyReason}
                        onChange={(e) => setDenyReason(e.target.value)}
                        placeholder="e.g. Requires prior authorization"
                        className="h-7 w-full text-xs border border-border bg-background px-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                    <button
                      type="button"
                      data-ocid={`pharmacy.refill.confirm_button.${idx + 1}`}
                      onClick={() => handleDenyRefill(req)}
                      className="h-7 px-2.5 text-xs font-semibold bg-danger text-white rounded-sm hover:bg-danger/90 transition-colors"
                    >
                      Confirm Deny
                    </button>
                    <button
                      type="button"
                      data-ocid={`pharmacy.refill.cancel_button.${idx + 1}`}
                      onClick={() => setExpandedDeny(null)}
                      className="h-7 px-2.5 text-xs font-semibold border border-border text-muted-foreground rounded-sm hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          data-ocid="pharmacy.primary_button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Prescription
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="border border-border bg-card rounded-sm">
          <AddPrescriptionForm
            onAdd={handleAdd}
            onCancel={() => setShowForm(false)}
            loading={addingRx}
          />
        </div>
      )}

      {/* Verification Queue */}
      <div className="border border-border bg-card rounded-sm">
        <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-warning" />
          <span className="text-xs font-semibold text-foreground">
            Verification Queue
          </span>
          {pendingQueue.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-warning/0.1 text-warning border border-warning/0.25 rounded-sm">
              {pendingQueue.length} pending
            </span>
          )}
          {verifiedQueue.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded-sm">
              {verifiedQueue.length} to dispense
            </span>
          )}
        </div>

        {isLoading ? (
          <div
            className="p-4 space-y-2"
            data-ocid="pharmacy.queue.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : pendingQueue.length === 0 && verifiedQueue.length === 0 ? (
          <div
            className="px-4 py-6 text-center"
            data-ocid="pharmacy.queue.empty_state"
          >
            <Package className="w-7 h-7 mx-auto mb-2 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">
              No prescriptions pending verification
            </p>
          </div>
        ) : (
          <Table data-ocid="pharmacy.queue.table">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Patient
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Medication
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Dose
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Prescribed By
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...pendingQueue, ...verifiedQueue].map((rx, i) => (
                <TableRow
                  key={String(rx.id)}
                  data-ocid={`pharmacy.queue.row.${i + 1}`}
                  className="hover:bg-muted/30 border-l-2 border-l-transparent hover:border-l-accent transition-all"
                >
                  <TableCell className="font-medium text-sm px-4 py-2">
                    {rx.patientName}
                  </TableCell>
                  <TableCell className="text-sm px-4 py-2">
                    {rx.medication}
                  </TableCell>
                  <TableCell className="font-mono text-sm px-4 py-2">
                    {rx.dose}
                  </TableCell>
                  <TableCell className="text-sm px-4 py-2">
                    {rx.prescribedBy}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <StatusBadge
                      variant={rxStatusVariant[rx.status] ?? "neutral"}
                      label={rx.status}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="flex items-center gap-1.5">
                      {rx.status === "pending" && (
                        <>
                          <button
                            type="button"
                            data-ocid={`pharmacy.queue.verify_button.${i + 1}`}
                            onClick={() =>
                              handleStatusChange(rx.id, "verified")
                            }
                            disabled={updatingId === rx.id}
                            className="h-6 px-2 text-xs font-semibold bg-primary text-primary-foreground rounded-sm disabled:opacity-60 flex items-center gap-1"
                          >
                            {updatingId === rx.id ? (
                              <Loader2 className="w-2.5 h-2.5 animate-spin" />
                            ) : null}
                            Verify
                          </button>
                          <button
                            type="button"
                            data-ocid={`pharmacy.queue.reject_button.${i + 1}`}
                            onClick={() =>
                              handleStatusChange(rx.id, "rejected")
                            }
                            disabled={updatingId === rx.id}
                            className="h-6 px-2 text-xs font-semibold border border-border text-destructive hover:bg-destructive/5 rounded-sm disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {rx.status === "verified" && (
                        <button
                          type="button"
                          data-ocid={`pharmacy.queue.dispense_button.${i + 1}`}
                          onClick={() => handleStatusChange(rx.id, "dispensed")}
                          disabled={updatingId === rx.id}
                          className="h-6 px-2 text-xs font-semibold bg-success text-white rounded-sm disabled:opacity-60 flex items-center gap-1 hover:bg-success/0.85"
                        >
                          {updatingId === rx.id ? (
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          ) : null}
                          Dispense
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* All Prescriptions */}
      <div className="border border-border bg-card rounded-sm">
        <div className="px-4 py-2.5 border-b border-border bg-muted/40">
          <span className="text-xs font-semibold text-foreground">
            All Prescriptions
          </span>
          <span className="ml-2 text-xs text-muted-foreground">
            ({prescriptions.length})
          </span>
        </div>

        {isLoading ? (
          <div
            className="p-4 space-y-2"
            data-ocid="pharmacy.table.loading_state"
          >
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : prescriptions.length === 0 ? (
          <div
            className="px-4 py-6 text-center"
            data-ocid="pharmacy.table.empty_state"
          >
            <p className="text-xs text-muted-foreground">
              No prescriptions yet
            </p>
          </div>
        ) : (
          <Table data-ocid="pharmacy.table">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Patient
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Medication
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Dose
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Prescribed By
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-4">
                  Notes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((rx, i) => (
                <TableRow
                  key={String(rx.id)}
                  data-ocid={`pharmacy.row.${i + 1}`}
                  className="hover:bg-muted/30 even:bg-muted/20 border-l-2 border-l-transparent hover:border-l-accent transition-all"
                >
                  <TableCell className="font-medium text-sm px-4 py-2.5">
                    {rx.patientName}
                  </TableCell>
                  <TableCell className="text-sm px-4 py-2.5">
                    {rx.medication}
                  </TableCell>
                  <TableCell className="font-mono text-sm px-4 py-2.5">
                    {rx.dose}
                  </TableCell>
                  <TableCell className="text-sm px-4 py-2.5">
                    {rx.prescribedBy}
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    <StatusBadge
                      variant={rxStatusVariant[rx.status] ?? "neutral"}
                      label={rx.status}
                    />
                  </TableCell>
                  <TableCell className="text-xs px-4 py-2.5 text-muted-foreground max-w-xs truncate">
                    {rx.notes || "—"}
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
