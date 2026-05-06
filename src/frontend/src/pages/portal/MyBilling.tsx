import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEMO_INVOICES } from "@/demoData";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../../components/StatusBadge";

import { usePortalContext } from "../../contexts/PortalContext";

const INVOICE_DESCRIPTIONS: Record<
  string,
  { description: string; details: string }
> = {
  "11": {
    description: "Office Visit — Dr. Jordan Lee",
    details:
      "CPT 99213 – Level 3 Office Visit. Diabetes follow-up with medication review. Date of service: Feb 28, 2026.",
  },
  "12": {
    description: "Lab Services — Comprehensive Metabolic Panel",
    details:
      "CPT 80053 – Comprehensive Metabolic Panel. CPT 85025 – CBC with Differential. HbA1c check. Date of service: Jan 10, 2026.",
  },
  "1": {
    description: "Copay — Annual Wellness Visit",
    details:
      "CPT 99395 – Annual wellness examination. Preventive care visit. Date of service: Sep 5, 2025.",
  },
  "13": {
    description: "Specialist Consultation — Endocrinology",
    details:
      "CPT 99243 – Level 3 consultation. Referral from Dr. Jordan Lee for insulin therapy evaluation. Date of service: Dec 8, 2025.",
  },
};

const DUE_DATE = "April 15, 2026";

export default function MyBilling() {
  const { id: PORTAL_PATIENT_ID } = usePortalContext();
  const portalInvoices = useMemo(
    () => DEMO_INVOICES.filter((inv) => inv.patientId === PORTAL_PATIENT_ID),
    [PORTAL_PATIENT_ID],
  );

  const pendingInvoices = useMemo(
    () => portalInvoices.filter((inv) => inv.status !== "paid"),
    [portalInvoices],
  );

  const paidInvoices = useMemo(
    () => portalInvoices.filter((inv) => inv.status === "paid"),
    [portalInvoices],
  );

  const outstandingBalance = useMemo(
    () =>
      pendingInvoices.reduce((sum, inv) => sum + Number(inv.amount) / 100, 0),
    [pendingInvoices],
  );

  const [payExpanded, setPayExpanded] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [planExpanded, setPlanExpanded] = useState(false);
  const [planSuccess, setPlanSuccess] = useState(false);
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);
  const [payForm, setPayForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    amount: outstandingBalance.toFixed(2),
  });
  const [installments, setInstallments] = useState<3 | 6 | 12>(3);
  const monthlyAmount = (outstandingBalance / installments).toFixed(2);

  const handlePay = () => {
    if (!payForm.cardNumber || !payForm.expiry || !payForm.cvv) {
      toast.error("Please fill in all payment fields");
      return;
    }
    setPaySuccess(true);
  };

  const handlePlanSetup = () => {
    setPlanSuccess(true);
  };

  function invoiceLabel(id: bigint): string {
    return (
      INVOICE_DESCRIPTIONS[String(id)]?.description ?? `Invoice #${String(id)}`
    );
  }

  function invoiceDetails(id: bigint): string {
    return (
      INVOICE_DESCRIPTIONS[String(id)]?.details ??
      "No additional details available."
    );
  }

  return (
    <div className="space-y-6" data-ocid="billing.page">
      {/* Outstanding Balance */}
      <Card
        data-ocid="billing.balance.card"
        className="border-2 border-destructive/20 bg-destructive/5"
      >
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-destructive/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                  Outstanding Balance
                </p>
                <p className="text-3xl font-bold text-foreground">
                  ${outstandingBalance.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Due by {DUE_DATE}
                </p>
              </div>
            </div>
            {!paySuccess && outstandingBalance > 0 && (
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="billing.pay_now.button"
                onClick={() => {
                  setPayExpanded(!payExpanded);
                  setPlanExpanded(false);
                }}
              >
                {payExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 mr-1.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 mr-1.5" />
                )}
                Pay Now
              </Button>
            )}
          </div>

          {/* Pay success state */}
          {paySuccess && (
            <div
              className="mt-4 pt-4 border-t border-border flex items-center gap-3 text-success"
              data-ocid="billing.pay.success_state"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">
                  Payment Submitted Successfully
                </p>
                <p className="text-xs text-muted-foreground">
                  ${payForm.amount} payment confirmed. A receipt has been sent
                  to your email.
                </p>
              </div>
            </div>
          )}

          {payExpanded && !paySuccess && (
            <div
              className="mt-4 pt-4 border-t border-border space-y-3"
              data-ocid="billing.pay.panel"
            >
              <p className="text-sm font-medium">Payment Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Card Number</Label>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={payForm.cardNumber}
                    onChange={(e) =>
                      setPayForm({ ...payForm, cardNumber: e.target.value })
                    }
                    data-ocid="billing.card_number.input"
                    className="text-sm h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Expiry</Label>
                  <Input
                    placeholder="MM/YY"
                    value={payForm.expiry}
                    onChange={(e) =>
                      setPayForm({ ...payForm, expiry: e.target.value })
                    }
                    data-ocid="billing.expiry.input"
                    className="text-sm h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">CVV</Label>
                  <Input
                    placeholder="123"
                    value={payForm.cvv}
                    onChange={(e) =>
                      setPayForm({ ...payForm, cvv: e.target.value })
                    }
                    data-ocid="billing.cvv.input"
                    className="text-sm h-8"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Amount</Label>
                  <Input
                    value={payForm.amount}
                    onChange={(e) =>
                      setPayForm({ ...payForm, amount: e.target.value })
                    }
                    data-ocid="billing.amount.input"
                    className="text-sm h-8"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handlePay}
                  data-ocid="billing.pay.submit_button"
                >
                  Submit Payment
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPayExpanded(false)}
                  data-ocid="billing.pay.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Plans */}
      {outstandingBalance > 0 && (
        <Card data-ocid="billing.plans.card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Payment Plans
              </CardTitle>
              {!planSuccess && (
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid="billing.setup_plan.button"
                  onClick={() => {
                    setPlanExpanded(!planExpanded);
                    setPayExpanded(false);
                  }}
                >
                  {planExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 mr-1.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Set Up Payment Plan
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              className="flex items-center justify-between p-3 bg-muted/40 rounded border border-border"
              data-ocid="billing.plan.item.1"
            >
              <div>
                <p className="text-sm font-medium">$50 / month</p>
                <p className="text-xs text-muted-foreground">
                  4 remaining payments · Next due: Apr 1, 2026
                </p>
              </div>
              <StatusBadge variant="success" label="Active" />
            </div>

            {planSuccess && (
              <div
                className="flex items-center gap-3 p-3 bg-success/10 border border-success/25 rounded text-success"
                data-ocid="billing.plan.success_state"
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold">
                    Payment Plan Confirmed
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${monthlyAmount}/month for {installments} months starting
                    next billing cycle.
                  </p>
                </div>
              </div>
            )}

            {planExpanded && !planSuccess && (
              <div
                className="pt-3 border-t border-border space-y-4"
                data-ocid="billing.plan.panel"
              >
                <p className="text-sm font-medium">New Payment Plan</p>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2 block">
                    Choose Installments
                  </Label>
                  <div className="flex gap-2">
                    {([3, 6, 12] as const).map((n) => (
                      <button
                        key={n}
                        type="button"
                        data-ocid={`billing.plan.installments.${n}.toggle`}
                        onClick={() => setInstallments(n)}
                        className={`flex-1 py-2.5 text-sm font-medium rounded border transition-colors ${
                          installments === n
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground border-border hover:bg-muted/40"
                        }`}
                      >
                        {n} months
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-muted/30 rounded border border-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Total balance
                    </span>
                    <span className="text-sm font-medium">
                      ${outstandingBalance.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Installments
                    </span>
                    <span className="text-sm font-medium">
                      {installments} payments
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-1 mt-1">
                    <span className="text-xs font-semibold text-foreground">
                      Monthly payment
                    </span>
                    <span className="text-base font-bold text-primary">
                      ${monthlyAmount}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handlePlanSetup}
                    data-ocid="billing.plan.submit_button"
                  >
                    Confirm Plan — ${monthlyAmount}/mo
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPlanExpanded(false)}
                    data-ocid="billing.plan.cancel_button"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      {paidInvoices.length > 0 && (
        <Card data-ocid="billing.history.card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paidInvoices.map((inv, i) => (
                  <TableRow
                    key={String(inv.id)}
                    data-ocid={`billing.history.row.${i + 1}`}
                  >
                    <TableCell className="text-xs">
                      {invoiceLabel(inv.id)}
                    </TableCell>
                    <TableCell className="text-xs text-right">
                      ${(Number(inv.amount) / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge variant="success" label="Paid" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Outstanding Invoices */}
      {pendingInvoices.length > 0 && (
        <Card data-ocid="billing.invoices.card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Invoices Due
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingInvoices.map((inv, i) => (
              <div
                key={String(inv.id)}
                data-ocid={`billing.invoices.item.${i + 1}`}
              >
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">
                        {invoiceLabel(inv.id)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {inv.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">
                      ${(Number(inv.amount) / 100).toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      data-ocid={`billing.invoice.button.${i + 1}`}
                      onClick={() =>
                        setExpandedInvoice(
                          expandedInvoice === String(inv.id)
                            ? null
                            : String(inv.id),
                        )
                      }
                    >
                      {expandedInvoice === String(inv.id) ? "Hide" : "View"}
                    </Button>
                  </div>
                </div>
                {expandedInvoice === String(inv.id) && (
                  <div
                    className="mt-1 p-3 bg-muted/20 border border-t-0 border-border rounded-b text-xs text-muted-foreground"
                    data-ocid={`billing.invoice.panel.${i + 1}`}
                  >
                    {invoiceDetails(inv.id)}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
