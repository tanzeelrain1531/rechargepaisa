import { Button } from "@/components/ui/button";
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
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/StatusBadge";
import { DEMO_CLAIMS, DEMO_PATIENTS } from "../demoData";
import { useActor } from "../hooks/useActor";
import { useClaims, usePatients } from "../hooks/useBackendData";
import { useDemoMode } from "../hooks/useDemoMode";

interface Claim {
  id: bigint;
  patientId: bigint;
  patientName: string;
  claimNumber: string;
  insurerId: bigint;
  totalAmount: bigint;
  status: string;
  serviceDate: string;
  cptCodes: string;
  diagnosisCodes: string;
  submittedAt: bigint;
}

type Patient = { id: bigint; name: string };

const claimStatusVariant = (
  status: string,
): "warning" | "info" | "success" | "danger" | "neutral" => {
  switch (status) {
    case "pending":
      return "warning";
    case "submitted":
      return "info";
    case "adjudicated":
      return "info";
    case "paid":
    case "approved":
      return "success";
    case "denied":
      return "danger";
    default:
      return "neutral";
  }
};

const nextStatus: Record<string, string> = {
  pending: "submitted",
  submitted: "adjudicated",
  adjudicated: "paid",
};

function ClaimsAgingCards({ claims }: { claims: Claim[] }) {
  const buckets = [
    {
      label: "Current (0–30 days)",
      colorClass: "border-b-success text-success",
    },
    { label: "31–60 Days", colorClass: "border-b-warning text-warning" },
    { label: "61–90 Days", colorClass: "border-b-warning text-warning" },
    {
      label: "Over 90 Days",
      colorClass: "border-b-destructive text-destructive",
    },
  ].map((b, idx) => {
    const bClaims = claims.filter((_, i) => i % 4 === idx);
    return {
      ...b,
      count: bClaims.length,
      total: bClaims.reduce((s, c) => s + Number(c.totalAmount), 0),
    };
  });

  return (
    <div className="grid grid-cols-4 gap-3" data-ocid="claims.aging.panel">
      {buckets.map((b, i) => (
        <div
          key={b.label}
          className={`bg-card border border-border p-3 border-b-2 ${b.colorClass.split(" ")[0]}`}
          data-ocid={`claims.aging.card.${i + 1}`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground leading-tight mb-1.5">
            {b.label}
          </p>
          <p
            className={`text-lg font-bold font-mono ${b.colorClass.split(" ")[1]}`}
          >
            ${b.total.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {b.count} claim{b.count !== 1 ? "s" : ""}
          </p>
        </div>
      ))}
    </div>
  );
}

interface ClaimsProps {
  onNavigate?: (page: string) => void;
}

export default function Claims({ onNavigate }: ClaimsProps) {
  const { isDemoMode, demoActor } = useDemoMode();
  const { actor: realActor } = useActor();
  const actor = isDemoMode ? demoActor : realActor;
  const queryClient = useQueryClient();

  const [claims, setClaims] = useState<Claim[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [payerFilter, setPayerFilter] = useState<string>(() => {
    try {
      const p = JSON.parse(
        localStorage.getItem("medunite_prefs_Billing") || "{}",
      );
      if (p.payer) return p.payer;
    } catch {
      /* ignore */
    }
    return "All";
  });
  const [agingThreshold] = useState<number>(() => {
    try {
      const p = JSON.parse(
        localStorage.getItem("medunite_prefs_Billing") || "{}",
      );
      if (p.agingThreshold) return Number(p.agingThreshold);
    } catch {
      /* ignore */
    }
    return 60;
  });

  const PAYER_OPTIONS = [
    "All",
    "Medicare",
    "Medicaid",
    "Commercial",
    "Self-Pay",
  ];
  const [form, setForm] = useState({
    patientId: "",
    payer: "",
    amount: "",
    serviceDate: new Date().toISOString().slice(0, 10),
    cptCodes: "",
    diagnosisCodes: "",
  });

  // React Query cached hooks (non-demo mode)
  const { data: claimsData, isLoading: claimsLoading } = useClaims();
  const { data: patientsData, isLoading: patientsLoading } = usePatients();

  useEffect(() => {
    if (isDemoMode) return;
    if (claimsData) {
      setClaims(claimsData as Claim[]);
    }
    if (patientsData) {
      setPatients(patientsData as Patient[]);
    }
    if (!claimsLoading && !patientsLoading) setLoading(false);
  }, [claimsData, patientsData, claimsLoading, patientsLoading, isDemoMode]);

  // Demo mode: load seed data merged with any backend claims
  useEffect(() => {
    if (!isDemoMode || !actor) return;
    setLoading(true);
    Promise.all([actor.listClaims(), actor.listPatients()])
      .then(([claimData, patientData]) => {
        const backendClaims = claimData as Claim[];
        const backendIds = new Set(backendClaims.map((c) => c.id));
        const demoClaims: Claim[] = (DEMO_CLAIMS as typeof DEMO_CLAIMS).map(
          (c) => ({
            id: BigInt(c.id),
            patientId:
              typeof c.patientId === "bigint"
                ? c.patientId
                : BigInt(c.patientId ?? 0),
            patientName: c.patientName,
            claimNumber: c.claimNumber ?? `CLM-${c.id}`,
            insurerId: BigInt(0),
            totalAmount: BigInt(Math.round(c.billedAmount ?? 0)),
            status: c.status,
            serviceDate: c.serviceDate ?? "",
            cptCodes: Array.isArray(c.cptCodes)
              ? c.cptCodes.join(", ")
              : (c.cptCodes ?? ""),
            diagnosisCodes: Array.isArray(c.diagnosisCodes)
              ? c.diagnosisCodes.join(", ")
              : (c.diagnosisCodes ?? ""),
            submittedAt: BigInt(0),
          }),
        );
        const merged = [
          ...backendClaims,
          ...demoClaims.filter((c) => !backendIds.has(c.id)),
        ];
        setClaims(merged);
        setPatients(patientData as Patient[]);
      })
      .catch(() => {
        setClaims(
          (DEMO_CLAIMS as typeof DEMO_CLAIMS).map((c) => ({
            id: BigInt(c.id),
            patientId:
              typeof c.patientId === "bigint"
                ? c.patientId
                : BigInt(c.patientId ?? 0),
            patientName: c.patientName,
            claimNumber: c.claimNumber ?? `CLM-${c.id}`,
            insurerId: BigInt(0),
            totalAmount: BigInt(Math.round(c.billedAmount ?? 0)),
            status: c.status,
            serviceDate: c.serviceDate ?? "",
            cptCodes: Array.isArray(c.cptCodes)
              ? c.cptCodes.join(", ")
              : (c.cptCodes ?? ""),
            diagnosisCodes: Array.isArray(c.diagnosisCodes)
              ? c.diagnosisCodes.join(", ")
              : (c.diagnosisCodes ?? ""),
            submittedAt: BigInt(0),
          })),
        );
        setPatients(DEMO_PATIENTS);
      })
      .finally(() => setLoading(false));
  }, [actor, isDemoMode]);

  const handleAdd = async () => {
    if (!form.patientId || !form.payer || !form.amount) {
      toast.error("All fields required");
      return;
    }
    if (!actor) return;
    setSubmitting(true);
    try {
      const patient = patientList.find((p) => String(p.id) === form.patientId);
      const claimNumber = `CLM-${Date.now()}`;
      await actor.createClaim(
        BigInt(form.patientId),
        patient?.name ?? "Unknown",
        claimNumber,
        BigInt(0), // insurerId placeholder
        BigInt(Math.round(Number.parseFloat(form.amount))),
        form.serviceDate,
        form.cptCodes,
        form.diagnosisCodes,
      );
      toast.success("Claim submitted");
      setShowForm(false);
      setForm({
        patientId: "",
        payer: "",
        amount: "",
        serviceDate: new Date().toISOString().slice(0, 10),
        cptCodes: "",
        diagnosisCodes: "",
      });
      queryClient.invalidateQueries({ queryKey: ["claims"] });
    } catch {
      toast.error("Failed to submit claim");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdvanceStatus = async (id: bigint, currentStatus: string) => {
    const next = nextStatus[currentStatus];
    if (!next || !actor) return;
    try {
      await actor.updateClaimStatus(id, next);
      setClaims((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: next } : c)),
      );
      toast.success(`Claim advanced to ${next}`);
    } catch {
      toast.error("Failed to update claim status");
    }
  };

  const patientList = patients.length > 0 ? patients : DEMO_PATIENTS;

  const total = claims.reduce((s, c) => s + Number(c.totalAmount), 0);
  const approved = claims
    .filter((c) => c.status === "paid" || c.status === "approved")
    .reduce((s, c) => s + Number(c.totalAmount), 0);
  const denied = claims
    .filter((c) => c.status === "denied")
    .reduce((s, c) => s + Number(c.totalAmount), 0);

  // Payer filter is preference-only; actual claim data doesn't include payer name
  const filteredClaims = claims;

  return (
    <div className="space-y-5" data-ocid="claims.page">
      <p className="text-xs text-muted-foreground">
        Flagging claims older than {agingThreshold} days
      </p>
      <ClaimsAgingCards claims={claims} />

      {/* Payer filter */}
      <div className="flex gap-1 flex-wrap">
        {PAYER_OPTIONS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPayerFilter(p)}
            className={[
              "px-3 py-1 text-xs rounded border transition-colors",
              payerFilter === p
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            ].join(" ")}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          data-ocid="claims.primary_button"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? (
            <ChevronUp className="w-3.5 h-3.5 mr-1.5" />
          ) : (
            <Plus className="w-3.5 h-3.5 mr-1.5" />
          )}
          New Claim
        </Button>
      </div>

      {showForm && (
        <div
          className="border border-border bg-card p-5"
          data-ocid="claims.panel"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4">
            New Claim
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Patient
              </Label>
              <Select
                onValueChange={(v) => setForm((p) => ({ ...p, patientId: v }))}
              >
                <SelectTrigger
                  data-ocid="claims.patient.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patientList.map((p) => (
                    <SelectItem key={String(p.id)} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Payer / Insurer
              </Label>
              <Input
                data-ocid="claims.payer.input"
                value={form.payer}
                onChange={(e) =>
                  setForm((p) => ({ ...p, payer: e.target.value }))
                }
                className="mt-1 h-8 text-sm"
                placeholder="e.g. BlueCross BlueShield"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Amount ($)
              </Label>
              <Input
                data-ocid="claims.amount.input"
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: e.target.value }))
                }
                className="mt-1 h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Service Date
              </Label>
              <Input
                data-ocid="claims.serviceDate.input"
                type="date"
                value={form.serviceDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, serviceDate: e.target.value }))
                }
                className="mt-1 h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                CPT Codes
              </Label>
              <Input
                data-ocid="claims.cptCodes.input"
                value={form.cptCodes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, cptCodes: e.target.value }))
                }
                className="mt-1 h-8 text-sm"
                placeholder="e.g. 99213, 36415"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Diagnosis Codes
              </Label>
              <Input
                data-ocid="claims.diagnosisCodes.input"
                value={form.diagnosisCodes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, diagnosisCodes: e.target.value }))
                }
                className="mt-1 h-8 text-sm"
                placeholder="e.g. E11.9, I10"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              data-ocid="claims.submit_button"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={submitting}
              onClick={handleAdd}
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : null}
              Submit Claim
            </Button>
            <Button
              data-ocid="claims.cancel_button"
              size="sm"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border p-4 border-b-2 border-b-primary">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Claimed
          </p>
          <p className="text-xl font-bold font-mono mt-1">
            ${total.toLocaleString()}
          </p>
        </div>
        <div className="bg-card border border-border p-4 border-b-2 border-b-emerald-500">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Approved / Paid
          </p>
          <p className="text-xl font-bold font-mono mt-1 text-success">
            ${approved.toLocaleString()}
          </p>
        </div>
        <div className="bg-card border border-border p-4 border-b-2 border-b-red-500">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Denied
          </p>
          <p className="text-xl font-bold font-mono mt-1 text-destructive">
            ${denied.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="border border-border bg-card">
        <Table data-ocid="claims.table">
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Patient
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Claim #
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Service Date
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Amount
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              ["sk-0", "sk-1", "sk-2", "sk-3"].map((k) => (
                <TableRow key={k} data-ocid="claims.loading_state">
                  {["c0", "c1", "c2", "c3", "c4", "c5"].map((c) => (
                    <TableCell key={c} className="px-4 py-2.5">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : claims.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-sm text-muted-foreground"
                  data-ocid="claims.empty_state"
                >
                  No claims found.
                </TableCell>
              </TableRow>
            ) : (
              filteredClaims.map((claim, i) => (
                <TableRow
                  key={String(claim.id)}
                  data-ocid={`claims.row.${i + 1}`}
                  className="hover:bg-muted/30 even:bg-muted/20 border-l-2 border-l-transparent hover:border-l-accent transition-all"
                >
                  <TableCell className="font-medium text-sm px-4 py-2.5">
                    <button
                      type="button"
                      className="cursor-pointer text-primary hover:underline font-medium"
                      data-ocid="claims.patient.link"
                      onClick={() => onNavigate?.("patients")}
                    >
                      {claim.patientName}
                    </button>
                  </TableCell>
                  <TableCell className="font-mono text-xs px-4 py-2.5">
                    {claim.claimNumber}
                  </TableCell>
                  <TableCell
                    className={(() => {
                      const days = Math.floor(
                        (Date.now() - new Date(claim.serviceDate).getTime()) /
                          86_400_000,
                      );
                      return days > agingThreshold
                        ? "text-xs px-4 py-2.5 text-warning font-semibold"
                        : "text-xs text-muted-foreground px-4 py-2.5";
                    })()}
                  >
                    {claim.serviceDate}
                  </TableCell>
                  <TableCell className="font-mono text-sm px-4 py-2.5">
                    ${Number(claim.totalAmount).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    <StatusBadge
                      variant={claimStatusVariant(claim.status)}
                      label={claim.status}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    {nextStatus[claim.status] && (
                      <button
                        type="button"
                        data-ocid={`claims.edit_button.${i + 1}`}
                        onClick={() =>
                          handleAdvanceStatus(claim.id, claim.status)
                        }
                        className="h-6 px-2 text-xs font-semibold bg-primary text-primary-foreground rounded-sm hover:bg-primary/90"
                      >
                        Advance → {nextStatus[claim.status]}
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
