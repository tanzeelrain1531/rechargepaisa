import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DEMO_PRESCRIPTIONS } from "@/demoData";
import { useActor } from "@/hooks/useActor";
import { Pill, Plus, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../../components/StatusBadge";

import { usePortalContext } from "../../contexts/PortalContext";

type StatusVariant = "success" | "danger" | "neutral" | "warning" | "info";

function statusVariant(s: string): StatusVariant {
  if (s === "dispensed" || s === "active") return "success";
  if (s === "expired" || s === "rejected") return "danger";
  if (s === "discontinued") return "neutral";
  if (s === "pending" || s === "verified") return "info";
  return "neutral";
}

interface PendingRefill {
  id: number;
  medication: string;
  note: string;
  submittedAt: string;
}

export default function MyPrescriptions() {
  const { id: PORTAL_PATIENT_ID } = usePortalContext();
  const { actor } = useActor();
  const prescriptions = useMemo(
    () => DEMO_PRESCRIPTIONS.filter((rx) => rx.patientId === PORTAL_PATIENT_ID),
    [PORTAL_PATIENT_ID],
  );

  const activeMeds = useMemo(
    () =>
      prescriptions.filter(
        (rx) => rx.status === "dispensed" || rx.status === "verified",
      ),
    [prescriptions],
  );

  const [selectedMed, setSelectedMed] = useState("");
  const [refillNote, setRefillNote] = useState("");
  const [pendingRefills, setPendingRefills] = useState<PendingRefill[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleRefillSubmit = async () => {
    if (!selectedMed) {
      toast.error("Please select a medication.");
      return;
    }
    const med = prescriptions.find((rx) => String(rx.id) === selectedMed);
    if (!med) return;
    setSubmitting(true);
    try {
      if (actor) {
        await actor.createPrescription(
          1n,
          "Alex Johnson",
          med.medication,
          med.dose,
          "Patient Refill Request",
          refillNote || "Patient-requested refill",
        );
      }
      setPendingRefills((prev) => [
        ...prev,
        {
          id: Date.now(),
          medication: med.medication,
          note: refillNote,
          submittedAt: new Date().toLocaleString(),
        },
      ]);
      setSelectedMed("");
      setRefillNote("");
      toast.success("Refill request submitted");
    } catch {
      toast.error("Failed to submit refill request");
    } finally {
      setSubmitting(false);
    }
  };

  function formatDate(ts: bigint): string {
    try {
      return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  }

  return (
    <div className="space-y-6" data-ocid="prescriptions.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Pill className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            My Prescriptions
          </h1>
          <p className="text-sm text-muted-foreground">
            View your active medications and request refills
          </p>
        </div>
      </div>

      {/* Prescriptions list */}
      <Card className="border border-border" data-ocid="prescriptions.list">
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
            My Medications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {prescriptions.length === 0 ? (
            <div
              className="text-center py-10 text-muted-foreground text-sm"
              data-ocid="prescriptions.empty_state"
            >
              No prescriptions on file
            </div>
          ) : (
            <div className="divide-y divide-border">
              {prescriptions.map((rx, i) => (
                <div
                  key={String(rx.id)}
                  data-ocid={`prescriptions.item.${i + 1}`}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {rx.medication}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {rx.dose} &middot; Prescribed by {rx.prescribedBy}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Prescribed: {formatDate(rx.createdAt)}
                    </p>
                    {rx.notes && (
                      <p className="text-xs text-muted-foreground/70 mt-0.5 italic">
                        {rx.notes}
                      </p>
                    )}
                  </div>
                  <StatusBadge
                    variant={statusVariant(rx.status)}
                    label={rx.status}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Refill Requests */}
      {pendingRefills.length > 0 && (
        <Card
          className="border border-border"
          data-ocid="prescriptions.pending.card"
        >
          <CardHeader className="px-4 py-3 border-b border-border">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Pending Refill Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {pendingRefills.map((r, i) => (
                <div
                  key={r.id}
                  data-ocid={`prescriptions.pending.item.${i + 1}`}
                  className="flex items-center gap-4 px-4 py-3"
                >
                  <RefreshCw className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {r.medication}
                    </p>
                    {r.note && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {r.note}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Submitted {r.submittedAt}
                    </p>
                  </div>
                  <StatusBadge variant="info" label="pending" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Request Refill Form */}
      <Card
        className="border border-border"
        data-ocid="prescriptions.refill.card"
      >
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" />
            Request a Refill
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="refill-med" className="text-sm font-medium">
              Medication
            </Label>
            <Select value={selectedMed} onValueChange={setSelectedMed}>
              <SelectTrigger
                id="refill-med"
                data-ocid="prescriptions.refill.select"
                className="h-9"
              >
                <SelectValue placeholder="Select a medication\u2026" />
              </SelectTrigger>
              <SelectContent>
                {activeMeds.map((rx) => (
                  <SelectItem key={String(rx.id)} value={String(rx.id)}>
                    {rx.medication} — {rx.dose}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="refill-note" className="text-sm font-medium">
              Note{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="refill-note"
              data-ocid="prescriptions.refill.textarea"
              value={refillNote}
              onChange={(e) => setRefillNote(e.target.value)}
              placeholder="Add any notes for your provider\u2026"
              rows={3}
              className="resize-none text-sm"
            />
          </div>

          <Button
            data-ocid="prescriptions.refill.submit_button"
            onClick={handleRefillSubmit}
            disabled={submitting || !selectedMed}
            className="w-full sm:w-auto"
          >
            {submitting ? "Submitting\u2026" : "Submit Refill Request"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
