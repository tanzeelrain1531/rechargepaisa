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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { ChevronDown, ChevronUp, Plus, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/StatusBadge";
import { DEMO_PATIENTS } from "../demoData";

export interface DemoPriorAuth {
  id: number;
  patientName: string;
  procedure: string;
  payer: string;
  urgency: "routine" | "urgent" | "emergent";
  status: "pending" | "approved" | "denied" | "expired";
  submittedDate: string;
  decisionDate?: string;
  requestedBy: string;
  justification: string;
}

const SEED_PRIOR_AUTH: DemoPriorAuth[] = [
  {
    id: 1,
    patientName: "Margaret Chen",
    procedure: "Continuous Glucose Monitor",
    payer: "BlueCross BlueShield",
    urgency: "routine",
    status: "approved",
    submittedDate: "2026-03-05",
    decisionDate: "2026-03-08",
    requestedBy: "Dr. Jordan Lee",
    justification: "Type 2 DM poorly controlled, HbA1c 8.2%",
  },
  {
    id: 2,
    patientName: "Robert Okonkwo",
    procedure: "IV Diuresis (Furosemide 80mg)",
    payer: "Medicare Part B",
    urgency: "urgent",
    status: "approved",
    submittedDate: "2026-03-10",
    decisionDate: "2026-03-10",
    requestedBy: "Dr. Jordan Lee",
    justification: "Acute CHF exacerbation, respiratory distress",
  },
  {
    id: 3,
    patientName: "James Thornton",
    procedure: "MRI Lumbar Spine",
    payer: "Aetna",
    urgency: "routine",
    status: "pending",
    submittedDate: "2026-03-12",
    requestedBy: "Dr. Jordan Lee",
    justification: "Lower back pain > 6 weeks, failed conservative therapy",
  },
  {
    id: 4,
    patientName: "Sophia Martinez",
    procedure: "Laparoscopic Cholecystectomy",
    payer: "UnitedHealthcare",
    urgency: "urgent",
    status: "approved",
    submittedDate: "2026-03-11",
    decisionDate: "2026-03-12",
    requestedBy: "Dr. Jordan Lee",
    justification: "Symptomatic cholelithiasis with acute episode",
  },
  {
    id: 5,
    patientName: "Aisha Patel",
    procedure: "Allergy Immunotherapy",
    payer: "Cigna",
    urgency: "routine",
    status: "denied",
    submittedDate: "2026-03-01",
    decisionDate: "2026-03-07",
    requestedBy: "Dr. Jordan Lee",
    justification: "Allergic rhinitis not responding to antihistamines",
  },
];

const NOTE_TYPE = "prior-auth-v1";
// Use a stable patient ID for the global prior auth list (not patient-specific)
const GLOBAL_PATIENT_ID = BigInt(0);

const statusVariant = (
  s: DemoPriorAuth["status"],
): "success" | "warning" | "danger" | "neutral" => {
  switch (s) {
    case "approved":
      return "success";
    case "pending":
      return "warning";
    case "denied":
      return "danger";
    case "expired":
      return "neutral";
  }
};

const urgencyVariant = (
  u: DemoPriorAuth["urgency"],
): "warning" | "danger" | "neutral" => {
  switch (u) {
    case "urgent":
      return "warning";
    case "emergent":
      return "danger";
    case "routine":
      return "neutral";
  }
};

interface PriorAuthProps {
  onNavigate?: (page: string) => void;
}

export default function PriorAuth({ onNavigate }: PriorAuthProps) {
  const { actor, isFetching } = useActor();
  const [requests, setRequests] = useState<DemoPriorAuth[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [noteOpenId, setNoteOpenId] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  const [form, setForm] = useState({
    patientName: "",
    procedure: "",
    payer: "",
    urgency: "routine" as DemoPriorAuth["urgency"],
    justification: "",
    requestedBy: "Dr. Jordan Lee",
  });

  // Load from backend
  const loadData = useCallback(async () => {
    if (isFetching || !actor) return;
    setLoading(true);
    try {
      const notes = await actor.listClinicalNotes();
      const paRecords = notes
        .filter((n) => n.noteType === NOTE_TYPE)
        .map((n) => {
          try {
            return JSON.parse(n.content) as DemoPriorAuth;
          } catch {
            return null;
          }
        })
        .filter((r): r is DemoPriorAuth => r !== null);
      setRequests(paRecords.length > 0 ? paRecords : SEED_PRIOR_AUTH);
    } catch {
      setRequests(SEED_PRIOR_AUTH);
    } finally {
      setLoading(false);
    }
  }, [actor, isFetching]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Persist entire list as one note per record
  const persistRecord = useCallback(
    async (record: DemoPriorAuth) => {
      if (!actor) return;
      try {
        await actor.createClinicalNote(
          GLOBAL_PATIENT_ID,
          NOTE_TYPE,
          JSON.stringify(record),
          BigInt(0),
        );
      } catch {
        // silently fail — local state already updated
      }
    },
    [actor],
  );

  const total = requests.length;
  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;
  const denied = requests.filter((r) => r.status === "denied").length;

  const handleSubmit = async () => {
    if (!form.patientName || !form.procedure || !form.payer) {
      toast.error("Patient, procedure, and payer are required");
      return;
    }
    const newItem: DemoPriorAuth = {
      id: Date.now(),
      ...form,
      status: "pending",
      submittedDate: new Date().toISOString().split("T")[0],
    };
    setRequests((prev) => [newItem, ...prev]);
    setForm({
      patientName: "",
      procedure: "",
      payer: "",
      urgency: "routine",
      justification: "",
      requestedBy: "Dr. Jordan Lee",
    });
    setShowNewForm(false);
    await persistRecord(newItem);
    toast.success("Prior authorization request submitted");
  };

  const handleDecision = async (
    id: number,
    decision: "approved" | "denied",
  ) => {
    let updated: DemoPriorAuth | undefined;
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          updated = {
            ...r,
            status: decision,
            decisionDate: new Date().toISOString().split("T")[0],
          };
          return updated;
        }
        return r;
      }),
    );
    if (updated) await persistRecord(updated);
    toast.success(
      `Prior auth ${decision === "approved" ? "approved" : "denied"} for request #${id}`,
    );
  };

  const handleSaveNote = (_id: number) => {
    toast.success("Note saved to prior auth request");
    setNoteOpenId(null);
    setNoteText("");
  };

  if (loading) {
    return (
      <div className="space-y-4" data-ocid="prior-auth.page">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="prior-auth.page">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Requests",
            value: total,
            variant: "neutral" as const,
          },
          { label: "Pending", value: pending, variant: "warning" as const },
          { label: "Approved", value: approved, variant: "success" as const },
          { label: "Denied", value: denied, variant: "danger" as const },
        ].map((stat, idx) => (
          <div
            key={stat.label}
            className="bg-card border border-border px-4 py-3 shadow-card"
            data-ocid={`prior-auth.stat.card.${idx + 1}`}
          >
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* New Request Form */}
      <section className="border border-border bg-card shadow-card">
        <button
          type="button"
          data-ocid="prior-auth.open_modal_button"
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
          onClick={() => setShowNewForm((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-muted-foreground" />
            New Prior Authorization Request
          </div>
          {showNewForm ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {showNewForm && (
          <div className="border-t border-border px-4 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Patient *</Label>
                <Select
                  value={form.patientName}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, patientName: v }))
                  }
                >
                  <SelectTrigger
                    data-ocid="prior-auth.patient.select"
                    className="h-8 text-xs"
                  >
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEMO_PATIENTS.map((p) => (
                      <SelectItem key={String(p.id)} value={p.name}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Urgency</Label>
                <Select
                  value={form.urgency}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      urgency: v as DemoPriorAuth["urgency"],
                    }))
                  }
                >
                  <SelectTrigger
                    data-ocid="prior-auth.urgency.select"
                    className="h-8 text-xs"
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
              <div className="space-y-1.5">
                <Label className="text-xs">Procedure / Medication *</Label>
                <Input
                  data-ocid="prior-auth.procedure.input"
                  placeholder="e.g. MRI Brain, Dupixent 300mg"
                  value={form.procedure}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, procedure: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Insurance / Payer *</Label>
                <Input
                  data-ocid="prior-auth.payer.input"
                  placeholder="e.g. BlueCross BlueShield"
                  value={form.payer}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, payer: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs">Clinical Justification</Label>
                <Textarea
                  data-ocid="prior-auth.justification.textarea"
                  placeholder="Brief clinical rationale for this authorization..."
                  value={form.justification}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, justification: e.target.value }))
                  }
                  className="text-xs resize-none"
                  rows={3}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Requested By</Label>
                <Input
                  data-ocid="prior-auth.requested-by.input"
                  value={form.requestedBy}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, requestedBy: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button
                data-ocid="prior-auth.submit_button"
                size="sm"
                onClick={handleSubmit}
                className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Submit Request
              </Button>
              <Button
                data-ocid="prior-auth.cancel_button"
                size="sm"
                variant="ghost"
                onClick={() => setShowNewForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Requests Table */}
      <section className="border border-border bg-card shadow-card">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">
            Authorization Requests
          </p>
          <span className="text-xs text-muted-foreground">
            {requests.length} total
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="py-12 text-center" data-ocid="prior-auth.empty_state">
            <ShieldCheck className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              No prior authorization requests yet
            </p>
          </div>
        ) : (
          <Table data-ocid="prior-auth.table">
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Patient</TableHead>
                <TableHead className="text-xs">Procedure / Med</TableHead>
                <TableHead className="text-xs">Payer</TableHead>
                <TableHead className="text-xs">Urgency</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Submitted</TableHead>
                <TableHead className="text-xs">Decision</TableHead>
                <TableHead className="text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r, idx) => (
                <TableRow key={r.id} data-ocid={`prior-auth.item.${idx + 1}`}>
                  <TableCell className="text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => onNavigate?.("patients")}
                      className="text-primary underline-offset-2 hover:underline cursor-pointer bg-transparent border-none p-0 font-medium"
                    >
                      {r.patientName}
                    </button>
                  </TableCell>
                  <TableCell className="text-xs max-w-[180px]">
                    <p className="truncate" title={r.procedure}>
                      {r.procedure}
                    </p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {r.payer}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      variant={urgencyVariant(r.urgency)}
                      label={r.urgency}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      variant={statusVariant(r.status)}
                      label={r.status}
                    />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {r.submittedDate}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {r.decisionDate ?? (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {r.status === "pending" && (
                        <>
                          <Button
                            data-ocid={`prior-auth.approve.button.${idx + 1}`}
                            size="sm"
                            variant="outline"
                            className="h-6 text-xs px-2 text-success border-success/30 hover:bg-success/10"
                            onClick={() => handleDecision(r.id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            data-ocid={`prior-auth.deny.button.${idx + 1}`}
                            size="sm"
                            variant="outline"
                            className="h-6 text-xs px-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                            onClick={() => handleDecision(r.id, "denied")}
                          >
                            Deny
                          </Button>
                        </>
                      )}
                      <Button
                        data-ocid={`prior-auth.notes.button.${idx + 1}`}
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs px-2 text-muted-foreground"
                        onClick={() =>
                          setNoteOpenId(noteOpenId === r.id ? null : r.id)
                        }
                      >
                        Notes
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {/* Inline note expansion rows */}
              {requests.map((r, idx) =>
                noteOpenId === r.id ? (
                  <TableRow key={`note-${r.id}`}>
                    <TableCell colSpan={8} className="bg-muted/30 px-4 py-3">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Justification
                        </p>
                        <p className="text-xs text-foreground">
                          {r.justification}
                        </p>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-3">
                          Add Note
                        </p>
                        <Textarea
                          data-ocid={`prior-auth.note.textarea.${idx + 1}`}
                          placeholder="Add a note or follow-up comment..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          className="text-xs resize-none h-16"
                        />
                        <Button
                          data-ocid={`prior-auth.note.save_button.${idx + 1}`}
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleSaveNote(r.id)}
                        >
                          Save Note
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null,
              )}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}
