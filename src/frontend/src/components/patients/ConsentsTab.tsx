import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useActor } from "@/hooks/useActor";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../StatusBadge";

interface ConsentRecord {
  id: number;
  type: string;
  dateSigned: string;
  signedBy: string;
  provider: string;
  status: "Active" | "Expired" | "Pending";
  notes: string;
  witnessed: boolean;
}

interface ConsentsTabProps {
  patientId: bigint;
  patientName: string;
}

const CONSENT_TYPES = [
  "HIPAA Notice of Privacy Practices",
  "General Treatment Consent",
  "Surgical Consent",
  "Research Participation Consent",
  "Financial Responsibility Agreement",
  "Blood Transfusion Consent",
  "Advance Directive / DNR",
  "Telemedicine Consent",
  "Photography / Recording Consent",
];

export function ConsentsTab({ patientId, patientName }: ConsentsTabProps) {
  const { actor, isFetching } = useActor();
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [form, setForm] = useState({
    type: "",
    dateSigned: new Date().toISOString().slice(0, 10),
    signedBy: "Patient",
    notes: "",
    witnessed: false,
  });

  const loadConsents = useCallback(async () => {
    if (!actor) return;
    try {
      const notes = await actor.listClinicalNotes();
      const filtered = notes.filter(
        (n) => n.noteType === "consent" && n.patientId === patientId,
      );
      const records: ConsentRecord[] = filtered.map((n, idx) => {
        try {
          const parsed = JSON.parse(n.content) as ConsentRecord;
          return { ...parsed, id: idx + 1 };
        } catch {
          return {
            id: idx + 1,
            type: n.content,
            dateSigned: "",
            signedBy: "",
            provider: "",
            status: "Pending" as const,
            notes: "",
            witnessed: false,
          };
        }
      });
      setConsents(records);
    } catch (err) {
      console.error("Failed to load consents", err);
    } finally {
      setLoading(false);
    }
  }, [actor, patientId]);

  useEffect(() => {
    if (!isFetching && actor) {
      loadConsents();
    }
  }, [actor, isFetching, loadConsents]);

  const handleSave = async () => {
    if (!form.type) {
      toast.error("Consent type required");
      return;
    }
    if (!actor) return;
    const consentData = {
      type: form.type,
      dateSigned: form.dateSigned,
      signedBy: form.signedBy,
      provider: "Dr. Sarah Johnson",
      status: form.dateSigned ? "Active" : "Pending",
      notes: form.notes,
      witnessed: form.witnessed,
    };
    try {
      await actor.createClinicalNote(
        patientId,
        "consent",
        JSON.stringify(consentData),
        0n,
      );
      await loadConsents();
      setShowForm(false);
      setForm({
        type: "",
        dateSigned: new Date().toISOString().slice(0, 10),
        signedBy: "Patient",
        notes: "",
        witnessed: false,
      });
      toast.success(`Consent recorded for ${patientName}`);
    } catch (err) {
      console.error("Failed to save consent", err);
      toast.error("Failed to save consent");
    }
  };

  const statusVariant = (s: ConsentRecord["status"]) =>
    s === "Active" ? "success" : s === "Expired" ? "danger" : "warning";

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="patients.consents.panel">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {consents.length} consent record{consents.length !== 1 ? "s" : ""} on
          file
        </p>
        <Button
          size="sm"
          data-ocid="patients.consents.primary_button"
          className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? (
            <ChevronUp className="w-3 h-3 mr-1" />
          ) : (
            <Plus className="w-3 h-3 mr-1" />
          )}
          Record New Consent
        </Button>
      </div>

      {showForm && (
        <div
          className="border border-border bg-muted/20 p-4 space-y-3"
          data-ocid="patients.consents.panel"
        >
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            New Consent Form
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Consent Type
              </Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}
              >
                <SelectTrigger
                  data-ocid="patients.consents.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {CONSENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date Signed
              </Label>
              <Input
                data-ocid="patients.consents.input"
                type="date"
                value={form.dateSigned}
                onChange={(e) =>
                  setForm((p) => ({ ...p, dateSigned: e.target.value }))
                }
                className="mt-1 h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Signed By
              </Label>
              <Input
                data-ocid="patients.consents.signedby.input"
                value={form.signedBy}
                onChange={(e) =>
                  setForm((p) => ({ ...p, signedBy: e.target.value }))
                }
                className="mt-1 h-8 text-sm"
                placeholder="Patient / Legal Guardian"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex items-center gap-2 pb-1">
                <Checkbox
                  id="witnessed"
                  data-ocid="patients.consents.checkbox"
                  checked={form.witnessed}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, witnessed: !!v }))
                  }
                />
                <Label htmlFor="witnessed" className="text-sm cursor-pointer">
                  Witnessed
                </Label>
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Notes
              </Label>
              <Textarea
                data-ocid="patients.consents.textarea"
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                className="mt-1 text-sm min-h-[64px]"
                placeholder="Optional notes..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              data-ocid="patients.consents.submit_button"
              onClick={handleSave}
              className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Consent
            </Button>
            <Button
              size="sm"
              variant="outline"
              data-ocid="patients.consents.cancel_button"
              onClick={() => setShowForm(false)}
              className="h-7 text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="border border-border bg-card">
        <Table data-ocid="patients.consents.table">
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              {[
                "Consent Type",
                "Date Signed",
                "Signed By",
                "Provider",
                "Status",
                "",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {consents.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-xs text-muted-foreground py-8"
                  data-ocid="patients.consents.empty_state"
                >
                  No consent records on file
                </TableCell>
              </TableRow>
            )}
            {consents.map((c, i) => (
              <>
                <TableRow
                  key={c.id}
                  data-ocid={`patients.consents.row.${i + 1}`}
                  className="hover:bg-muted/30 even:bg-muted/20 cursor-pointer"
                >
                  <TableCell className="font-medium text-sm px-4 py-2.5">
                    {c.type}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground px-4 py-2.5">
                    {c.dateSigned || "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground px-4 py-2.5">
                    {c.signedBy || "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground px-4 py-2.5">
                    {c.provider}
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    <StatusBadge
                      variant={statusVariant(c.status)}
                      label={c.status}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      data-ocid={`patients.consents.edit_button.${i + 1}`}
                      onClick={() =>
                        setExpandedId(expandedId === c.id ? null : c.id)
                      }
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      View{" "}
                      {expandedId === c.id ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </TableCell>
                </TableRow>
                {expandedId === c.id && (
                  <TableRow key={`expand-${c.id}`}>
                    <TableCell colSpan={6} className="px-4 py-3 bg-muted/30">
                      <div className="text-xs space-y-1.5">
                        <p>
                          <span className="font-semibold text-muted-foreground">
                            Date:{" "}
                          </span>
                          {c.dateSigned || "Not yet signed"}
                        </p>
                        <p>
                          <span className="font-semibold text-muted-foreground">
                            Provider:{" "}
                          </span>
                          {c.provider}
                        </p>
                        <p>
                          <span className="font-semibold text-muted-foreground">
                            Witnessed:{" "}
                          </span>
                          {c.witnessed ? "Yes" : "No"}
                        </p>
                        {c.notes && (
                          <p>
                            <span className="font-semibold text-muted-foreground">
                              Notes:{" "}
                            </span>
                            {c.notes}
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
