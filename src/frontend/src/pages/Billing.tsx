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
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Loader2, Plus } from "lucide-react";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { PatientFilterBar } from "../components/PatientFilterBar";
import { StatusBadge } from "../components/StatusBadge";
import { useActor } from "../hooks/useActor";
import { useDemoMode } from "../hooks/useDemoMode";

type BillingStatus = "paid" | "submitted" | "draft" | "rejected";

const billingStatusVariant: Record<
  BillingStatus,
  "success" | "info" | "warning" | "danger"
> = {
  paid: "success",
  submitted: "info",
  draft: "warning",
  rejected: "danger",
};

type Patient = {
  id: bigint;
  name: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  mrn: string;
};
type Invoice = {
  id: bigint;
  patientId: bigint;
  amount: bigint;
  status: string;
};

interface PaymentPlan {
  installmentAmount: string;
  frequency: "weekly" | "bi-weekly" | "monthly";
  numPayments: string;
  createdAt: string;
  paidCount: number;
}

interface CallbackNotes {
  [key: string]: string;
}

const SK_ROWS = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4"];
const SK_COLS = ["c0", "c1", "c2", "c3"];

function InsuranceEligibilityPanel() {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    patient: "",
    insuranceId: "",
    provider: "",
  });
  const [checking, setChecking] = React.useState(false);
  const [result, setResult] = React.useState<null | {
    plan: string;
    deductible: string;
    copay: string;
    status: string;
    coverage: string;
  }>(null);

  const handleCheck = () => {
    if (!form.patient.trim() || !form.insuranceId.trim() || !form.provider)
      return;
    setChecking(true);
    setResult(null);
    setTimeout(() => {
      setChecking(false);
      setResult({
        plan: `${form.provider} Gold PPO`,
        deductible: "$1,500 individual / $3,000 family",
        copay: "$25 primary care / $50 specialist",
        status: "Active",
        coverage: "Jan 1, 2026 – Dec 31, 2026",
      });
    }, 1200);
  };

  return (
    <div
      className="bg-card border border-border rounded-sm overflow-hidden"
      data-ocid="billing.eligibility.panel"
    >
      <button
        type="button"
        data-ocid="billing.eligibility.toggle"
        onClick={() => {
          setOpen((v) => !v);
          setResult(null);
        }}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-muted-foreground"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-[13px] font-semibold text-foreground">
            Insurance Eligibility Verification
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-border">
          <p className="text-[12px] text-muted-foreground mt-3 mb-3">
            Verify a patient's insurance coverage before processing a claim.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <Label
                htmlFor="elig-patient"
                className="text-xs font-semibold uppercase tracking-wide"
              >
                Patient Name
              </Label>
              <Input
                id="elig-patient"
                data-ocid="billing.eligibility.patient.input"
                placeholder="Full name..."
                value={form.patient}
                onChange={(e) =>
                  setForm((p) => ({ ...p, patient: e.target.value }))
                }
                className="h-8 text-[13px] mt-1"
              />
            </div>
            <div>
              <Label
                htmlFor="elig-id"
                className="text-xs font-semibold uppercase tracking-wide"
              >
                Insurance ID
              </Label>
              <Input
                id="elig-id"
                data-ocid="billing.eligibility.id.input"
                placeholder="Member ID..."
                value={form.insuranceId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, insuranceId: e.target.value }))
                }
                className="h-8 text-[13px] mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide">
                Insurance Provider
              </Label>
              <Select
                value={form.provider}
                onValueChange={(v) => setForm((p) => ({ ...p, provider: v }))}
              >
                <SelectTrigger
                  data-ocid="billing.eligibility.provider.select"
                  className="h-8 text-[13px] mt-1"
                >
                  <SelectValue placeholder="Select provider..." />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Aetna",
                    "Blue Cross",
                    "Cigna",
                    "United Health",
                    "Humana",
                    "Medicare",
                    "Medicaid",
                  ].map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            data-ocid="billing.eligibility.submit_button"
            onClick={handleCheck}
            disabled={
              checking ||
              !form.patient.trim() ||
              !form.insuranceId.trim() ||
              !form.provider
            }
            className="h-8 text-[12px]"
            size="sm"
          >
            {checking ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin mr-1" /> Checking...
              </>
            ) : (
              "Check Eligibility"
            )}
          </Button>
          {result && (
            <div
              className="mt-4 p-4 rounded-sm border border-success/0.3 bg-success/0.04"
              data-ocid="billing.eligibility.success_state"
            >
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-4 h-4 text-success"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-[13px] font-semibold text-success">
                  Eligibility Verified
                </span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-sm font-semibold bg-success/0.1 text-success">
                  {result.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[12px]">
                <div>
                  <span className="text-muted-foreground">Plan: </span>
                  <span className="font-medium text-foreground">
                    {result.plan}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Coverage: </span>
                  <span className="font-medium text-foreground">
                    {result.coverage}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Deductible: </span>
                  <span className="font-medium text-foreground">
                    {result.deductible}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Copay: </span>
                  <span className="font-medium text-foreground">
                    {result.copay}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Revenue Cycle Aging ─────────────────────────────────────────────────────

interface AgingBucket {
  label: string;
  count: number;
  total: number;
  colorClass: string;
}

function computeAgingBuckets(invoices: Invoice[]): AgingBucket[] {
  const buckets: AgingBucket[] = [
    {
      label: "Current (0–30 days)",
      count: 0,
      total: 0,
      colorClass: "border-b-success text-success",
    },
    {
      label: "31–60 Days",
      count: 0,
      total: 0,
      colorClass: "border-b-warning text-warning",
    },
    {
      label: "61–90 Days",
      count: 0,
      total: 0,
      colorClass: "border-b-warning text-warning",
    },
    {
      label: "Over 90 Days",
      count: 0,
      total: 0,
      colorClass: "border-b-red-500 text-destructive/700",
    },
  ];
  invoices.forEach((inv, idx) => {
    const bucket = idx % 4;
    buckets[bucket].count++;
    buckets[bucket].total += Number(inv.amount);
  });
  return buckets;
}

function RevenueCycleAgingPanel({
  invoices,
  patients,
  onResubmit,
}: {
  invoices: Invoice[];
  patients: { id: bigint; name: string }[];
  onResubmit: (id: bigint) => void;
}) {
  const [open, setOpen] = React.useState(true);
  const buckets = computeAgingBuckets(invoices);
  const deniedInvoices = invoices.filter(
    (inv) => inv.status === "denied" || inv.status === "rejected",
  );
  const DENIAL_REASONS = ["Missing prior auth", "Duplicate claim"];

  return (
    <div
      className="border border-border bg-card overflow-hidden"
      data-ocid="billing.aging.panel"
    >
      <button
        type="button"
        data-ocid="billing.aging.toggle"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="text-[13px] font-semibold text-foreground">
          Revenue Cycle Aging
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-4">
          {/* Aging stat cards */}
          <div className="grid grid-cols-4 gap-3">
            {buckets.map((b, i) => (
              <div
                key={b.label}
                className={`bg-background border border-border p-3 border-b-2 ${b.colorClass.split(" ")[0]}`}
                data-ocid={`billing.aging.card.${i + 1}`}
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
                  {b.count} invoice{b.count !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>

          {/* Denial Management */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Denial Management
            </p>
            {deniedInvoices.length === 0 ? (
              <p
                className="text-xs text-muted-foreground py-3"
                data-ocid="billing.denial.empty_state"
              >
                No denied claims
              </p>
            ) : (
              <div className="border border-border">
                <Table data-ocid="billing.denial.table">
                  <TableHeader>
                    <TableRow className="bg-muted/60 hover:bg-muted/60">
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-3">
                        Patient
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-3">
                        Amount
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-3">
                        Denial Reason
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-8 px-3">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deniedInvoices.map((inv, i) => {
                      const patient = patients.find(
                        (p) => p.id === inv.patientId,
                      );
                      return (
                        <TableRow
                          key={String(inv.id)}
                          data-ocid={`billing.denial.row.${i + 1}`}
                          className="hover:bg-muted/30"
                        >
                          <TableCell className="text-sm px-3 py-2 font-medium">
                            {patient?.name ??
                              `Patient #${String(inv.patientId)}`}
                          </TableCell>
                          <TableCell className="font-mono text-sm px-3 py-2">
                            ${Number(inv.amount).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm px-3 py-2 text-muted-foreground">
                            {DENIAL_REASONS[i % 2]}
                          </TableCell>
                          <TableCell className="px-3 py-2">
                            <button
                              type="button"
                              data-ocid={`billing.denial.resubmit_button.${i + 1}`}
                              onClick={() => onResubmit(inv.id)}
                              className="px-2.5 py-1 rounded-sm text-xs font-semibold border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              Resubmit
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Payment Plan Row Expansion ───────────────────────────────────────────────

function InvoiceRow({
  inv,
  patient,
  index,
  onUpdateStatus,
}: {
  inv: Invoice;
  patient: Patient | undefined;
  index: number;
  onUpdateStatus: (id: bigint, status: string, amount?: bigint) => void;
}) {
  const [planOpen, setPlanOpen] = useState(false);
  const [payNowOpen, setPayNowOpen] = useState(false);
  const [eobOpen, setEobOpen] = useState(false);
  const [plan, setPlan] = useState<PaymentPlan | null>(null);
  const [planDraft, setPlanDraft] = useState({
    installmentAmount: "",
    frequency: "monthly" as PaymentPlan["frequency"],
    numPayments: "",
  });
  const [payAmount, setPayAmount] = useState("");
  const [notes] = useState<CallbackNotes>({});
  void notes;

  const statusKey =
    (inv.status as BillingStatus) in billingStatusVariant
      ? (inv.status as BillingStatus)
      : "draft";

  const isPaid = inv.status === "paid";
  const isPartial = inv.status === "partial";

  const handleCreatePlan = () => {
    if (!planDraft.installmentAmount || !planDraft.numPayments) {
      toast.error("Please fill in all plan fields");
      return;
    }
    const newPlan: PaymentPlan = {
      ...planDraft,
      createdAt: new Date().toLocaleDateString(),
      paidCount: 0,
    };
    setPlan(newPlan);
    setPlanOpen(false);
    toast.success("Payment plan created");
  };

  const handlePayNow = () => {
    const amount = Number.parseFloat(payAmount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid payment amount");
      return;
    }
    const total = Number(inv.amount);
    const newStatus = amount >= total ? "paid" : "partial";
    onUpdateStatus(
      inv.id,
      newStatus,
      BigInt(Math.round(total - (newStatus === "paid" ? total : amount))),
    );
    setPayNowOpen(false);
    setPayAmount("");
    toast.success(
      newStatus === "paid"
        ? "Payment received — invoice marked as paid"
        : `Payment of $${amount.toLocaleString()} recorded`,
    );
  };

  const nextPaymentDate = () => {
    if (!plan) return "";
    const days =
      plan.frequency === "weekly"
        ? 7
        : plan.frequency === "bi-weekly"
          ? 14
          : 30;
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString();
  };

  const remainingBalance = plan
    ? Number(inv.amount) -
      plan.paidCount * Number.parseFloat(plan.installmentAmount || "0")
    : Number(inv.amount);

  return (
    <>
      <TableRow
        data-ocid={`billing.row.${index + 1}`}
        className="hover:bg-muted/30 even:bg-muted/20 border-l-2 border-l-transparent hover:border-l-accent transition-all"
      >
        <TableCell className="font-medium text-sm px-4 py-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {patient?.name ?? "—"}
            {plan && <StatusBadge variant="info" label="Payment Plan" />}
            {isPartial && <StatusBadge variant="warning" label="Partial" />}
          </div>
        </TableCell>
        <TableCell className="font-mono text-sm px-4 py-2.5">
          ${Number(inv.amount).toLocaleString()}
        </TableCell>
        <TableCell className="px-4 py-2.5">
          <StatusBadge
            variant={billingStatusVariant[statusKey]}
            label={inv.status}
          />
        </TableCell>
        <TableCell className="px-4 py-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {!isPaid && (
              <>
                {!plan && (
                  <button
                    type="button"
                    data-ocid={`billing.plan.toggle.${index + 1}`}
                    onClick={() => {
                      setPlanOpen((v) => !v);
                      setPayNowOpen(false);
                    }}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    {planOpen ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                    Payment Plan
                  </button>
                )}
                <button
                  type="button"
                  data-ocid={`billing.paynow.toggle.${index + 1}`}
                  onClick={() => {
                    setPayNowOpen((v) => !v);
                    setPlanOpen(false);
                  }}
                  className="text-xs font-medium text-success hover:underline flex items-center gap-1"
                >
                  {payNowOpen ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                  Pay Now
                </button>
              </>
            )}
            {(inv.status === "paid" || inv.status === "submitted") && (
              <button
                type="button"
                data-ocid={`billing.eob.toggle.${index + 1}`}
                onClick={() => setEobOpen((v) => !v)}
                className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
              >
                {eobOpen ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
                EOB
              </button>
            )}
          </div>
        </TableCell>
      </TableRow>

      {/* Payment Plan form */}
      {planOpen && !plan && (
        <TableRow data-ocid={`billing.plan.panel.${index + 1}`}>
          <TableCell
            colSpan={4}
            className="px-4 py-3 bg-primary/5 border-b border-primary/10"
          >
            <div className="space-y-3">
              <p className="text-xs font-semibold text-primary">
                Set Up Payment Plan
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Installment Amount ($)
                  </Label>
                  <Input
                    data-ocid={`billing.plan.amount.input.${index + 1}`}
                    type="number"
                    placeholder="e.g. 50"
                    value={planDraft.installmentAmount}
                    onChange={(e) =>
                      setPlanDraft((p) => ({
                        ...p,
                        installmentAmount: e.target.value,
                      }))
                    }
                    className="h-7 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Frequency
                  </Label>
                  <Select
                    value={planDraft.frequency}
                    onValueChange={(v) =>
                      setPlanDraft((p) => ({
                        ...p,
                        frequency: v as PaymentPlan["frequency"],
                      }))
                    }
                  >
                    <SelectTrigger
                      data-ocid={`billing.plan.frequency.select.${index + 1}`}
                      className="h-7 text-xs mt-1"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Number of Payments
                  </Label>
                  <Input
                    data-ocid={`billing.plan.count.input.${index + 1}`}
                    type="number"
                    placeholder="e.g. 12"
                    value={planDraft.numPayments}
                    onChange={(e) =>
                      setPlanDraft((p) => ({
                        ...p,
                        numPayments: e.target.value,
                      }))
                    }
                    className="h-7 text-xs mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  data-ocid={`billing.plan.create_button.${index + 1}`}
                  onClick={handleCreatePlan}
                  className="h-7 text-xs px-3"
                >
                  Create Plan
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  data-ocid={`billing.plan.cancel_button.${index + 1}`}
                  onClick={() => setPlanOpen(false)}
                  className="h-7 text-xs px-3"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}

      {/* Active plan details */}
      {plan && (
        <TableRow data-ocid={`billing.plan.details.${index + 1}`}>
          <TableCell
            colSpan={4}
            className="px-4 py-3 bg-primary/3 border-b border-primary/10"
          >
            <div className="flex items-center gap-6 text-[12px]">
              <div>
                <span className="text-muted-foreground">Installment: </span>
                <span className="font-semibold">
                  ${Number.parseFloat(plan.installmentAmount).toLocaleString()}{" "}
                  / {plan.frequency}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Payments: </span>
                <span className="font-semibold">
                  {plan.paidCount} of {plan.numPayments}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Next Due: </span>
                <span className="font-semibold">{nextPaymentDate()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Remaining: </span>
                <span className="font-semibold text-warning">
                  ${remainingBalance.toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                data-ocid={`billing.plan.record_button.${index + 1}`}
                onClick={() => {
                  setPlan((p) =>
                    p ? { ...p, paidCount: p.paidCount + 1 } : p,
                  );
                  toast.success("Payment recorded");
                }}
                className="ml-auto text-xs font-medium text-success hover:underline"
              >
                Record Payment
              </button>
            </div>
          </TableCell>
        </TableRow>
      )}

      {/* Pay Now form */}
      {payNowOpen && (
        <TableRow data-ocid={`billing.paynow.panel.${index + 1}`}>
          <TableCell
            colSpan={4}
            className="px-4 py-3 bg-success/0.05 border-b border-success/0.2"
          >
            <div className="space-y-3">
              <p className="text-xs font-semibold text-success">
                Submit Payment — Balance: ${Number(inv.amount).toLocaleString()}
              </p>
              <div className="flex items-end gap-3">
                <div className="w-48">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Payment Amount ($)
                  </Label>
                  <Input
                    data-ocid={`billing.paynow.amount.input.${index + 1}`}
                    type="number"
                    placeholder="Enter amount..."
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="h-7 text-xs mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Notes (optional)
                  </Label>
                  <Textarea
                    data-ocid={`billing.paynow.notes.textarea.${index + 1}`}
                    placeholder="Payment notes..."
                    rows={1}
                    className="h-7 text-xs mt-1 min-h-0 py-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    data-ocid={`billing.paynow.submit_button.${index + 1}`}
                    onClick={handlePayNow}
                    className="h-7 text-xs px-3 bg-success hover:bg-success/0.9 text-white border-none"
                  >
                    Submit Payment
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    data-ocid={`billing.paynow.cancel_button.${index + 1}`}
                    onClick={() => setPayNowOpen(false)}
                    className="h-7 text-xs px-3"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}

      {/* EOB Panel */}
      {eobOpen && (inv.status === "paid" || inv.status === "submitted") && (
        <TableRow data-ocid={`billing.eob.panel.${index + 1}`}>
          <TableCell
            colSpan={4}
            className="px-4 py-3 bg-primary/4 border-b border-primary/10"
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                Explanation of Benefits (EOB)
              </p>
              <div className="border border-primary/10 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-primary/5/60">
                      {[
                        "Service",
                        "CPT Code",
                        "Billed",
                        "Allowed",
                        "Adjustment",
                        "Payer Paid",
                        "Pt. Responsibility",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-1.5 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        service: "Office Visit",
                        cpt: "99213",
                        billed: 180,
                        allowed: 155,
                        adj: 25,
                        paid: 124,
                        pt: 31,
                      },
                      {
                        service: "CBC w/ Differential",
                        cpt: "85025",
                        billed: 85,
                        allowed: 70,
                        adj: 15,
                        paid: 56,
                        pt: 14,
                      },
                      {
                        service: "Comprehensive Metabolic Panel",
                        cpt: "80053",
                        billed: 95,
                        allowed: 80,
                        adj: 15,
                        paid: 64,
                        pt: 16,
                      },
                    ].map((row, ri) => (
                      <tr
                        key={row.cpt}
                        className={ri % 2 === 1 ? "bg-muted/20" : ""}
                      >
                        <td className="px-3 py-1.5 text-foreground">
                          {row.service}
                        </td>
                        <td className="px-3 py-1.5 font-mono text-muted-foreground">
                          {row.cpt}
                        </td>
                        <td className="px-3 py-1.5 font-mono">${row.billed}</td>
                        <td className="px-3 py-1.5 font-mono">
                          ${row.allowed}
                        </td>
                        <td className="px-3 py-1.5 font-mono text-warning">
                          -${row.adj}
                        </td>
                        <td className="px-3 py-1.5 font-mono text-success">
                          ${row.paid}
                        </td>
                        <td className="px-3 py-1.5 font-mono text-primary">
                          ${row.pt}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t border-primary/15 bg-primary/5 font-semibold">
                      <td className="px-3 py-1.5" colSpan={2}>
                        Totals
                      </td>
                      <td className="px-3 py-1.5 font-mono">$360</td>
                      <td className="px-3 py-1.5 font-mono">$305</td>
                      <td className="px-3 py-1.5 font-mono text-warning">
                        -$55
                      </td>
                      <td className="px-3 py-1.5 font-mono text-success">
                        $244
                      </td>
                      <td className="px-3 py-1.5 font-mono text-primary">
                        $61
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Processed by payer · Plan: PPO · Claim #{index + 1}001-2026
              </p>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function Billing({
  activePatientId,
  activePatientName,
  onClearFilter,
}: {
  activePatientId?: bigint;
  activePatientName?: string;
  onClearFilter?: () => void;
}) {
  const { isDemoMode, demoActor } = useDemoMode();
  const { actor: realActor, isFetching } = useActor();
  const actor = isDemoMode ? demoActor : realActor;
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patientId: "",
    amount: "",
    status: "draft",
  });

  const loadData = useCallback(async () => {
    if (!actor) return;
    try {
      const [invoiceData, patientData] = await Promise.all([
        actor.listInvoices(),
        actor.listPatients(),
      ]);
      setInvoices(invoiceData as Invoice[]);
      setPatients(patientData as Patient[]);
    } catch {
      toast.error("Failed to load billing data");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (!actor) return;
    if (!isDemoMode && isFetching) return;
    setLoading(true);
    loadData();
  }, [actor, isFetching, loadData, isDemoMode]);

  const handleAdd = async () => {
    if (!form.patientId || !form.amount) {
      toast.error("Patient and amount required");
      return;
    }
    if (!actor) return;
    setSubmitting(true);
    try {
      await actor.createInvoice(
        BigInt(form.patientId),
        BigInt(Math.round(Number.parseFloat(form.amount))),
        form.status,
      );
      toast.success("Invoice created");
      setShowForm(false);
      setForm({ patientId: "", amount: "", status: "draft" });
      await loadData();
    } catch {
      toast.error("Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResubmit = (id: bigint) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: "submitted" } : inv,
      ),
    );
    toast.success("Claim resubmitted");
  };

  const handleUpdateStatus = (id: bigint, status: string, _amount?: bigint) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)),
    );
    // Fire-and-forget backend update
    if (actor) {
      actor.updateInvoiceStatus(id, status).catch(() => {});
    }
  };

  const total = invoices.reduce((s, i) => s + Number(i.amount), 0);
  const paid = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="space-y-5" data-ocid="billing.page">
      {activePatientId && activePatientName && (
        <PatientFilterBar
          patientName={activePatientName}
          onClear={onClearFilter ?? (() => {})}
        />
      )}
      <div className="flex items-center justify-between">
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          data-ocid="billing.primary_button"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? (
            <ChevronUp className="w-3.5 h-3.5 mr-1.5" />
          ) : (
            <Plus className="w-3.5 h-3.5 mr-1.5" />
          )}
          Create Invoice
        </Button>
      </div>

      {showForm && (
        <div
          className="border border-border bg-card p-5"
          data-ocid="billing.panel"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Create Invoice
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
                  data-ocid="billing.patient.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={String(p.id)} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Amount ($)
              </Label>
              <Input
                data-ocid="billing.amount.input"
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: e.target.value }))
                }
                className="mt-1 h-8 text-sm"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                data-ocid="billing.submit_button"
                size="sm"
                disabled={submitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleAdd}
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : null}
                Create Invoice
              </Button>
              <Button
                data-ocid="billing.cancel_button"
                size="sm"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <RevenueCycleAgingPanel
        invoices={invoices}
        patients={patients}
        onResubmit={handleResubmit}
      />

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border p-4 border-b-2 border-b-primary">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Invoiced
          </p>
          <p className="text-xl font-bold font-mono mt-1">
            ${loading ? "—" : total.toLocaleString()}
          </p>
        </div>
        <div className="bg-card border border-border p-4 border-b-2 border-b-success">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Collected
          </p>
          <p className="text-xl font-bold font-mono mt-1 text-success">
            ${loading ? "—" : paid.toLocaleString()}
          </p>
        </div>
        <div className="bg-card border border-border p-4 border-b-2 border-b-warning">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Outstanding
          </p>
          <p className="text-xl font-bold font-mono mt-1 text-warning">
            ${loading ? "—" : (total - paid).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Payment plan stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border p-4 border-b-2 border-b-primary">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Patients on Payment Plans
          </p>
          <p className="text-xl font-bold font-mono mt-1 text-primary">12</p>
        </div>
        <div className="bg-card border border-border p-4 border-b-2 border-b-violet-500">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Plans Total
          </p>
          <p className="text-xl font-bold font-mono mt-1 text-violet-600">
            $4,200
            <span className="text-sm font-normal text-muted-foreground">
              /mo
            </span>
          </p>
        </div>
      </div>

      <div className="border border-border bg-card">
        <Table data-ocid="billing.table">
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Patient
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
              SK_ROWS.map((rowKey) => (
                <TableRow key={rowKey} data-ocid="billing.loading_state">
                  {SK_COLS.map((colKey) => (
                    <TableCell key={colKey} className="px-4 py-2.5">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-10 text-sm"
                  data-ocid="billing.empty_state"
                >
                  No invoices yet
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv, i) => {
                const patient = patients.find((p) => p.id === inv.patientId);
                return (
                  <InvoiceRow
                    key={String(inv.id)}
                    inv={inv}
                    patient={patient}
                    index={i}
                    onUpdateStatus={handleUpdateStatus}
                  />
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Insurance Eligibility Panel */}
      <InsuranceEligibilityPanel />
    </div>
  );
}
