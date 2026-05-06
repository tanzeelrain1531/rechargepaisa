import { StatusBadge } from "@/components/StatusBadge";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { DEMO_ADVANCE_DIRECTIVES, DEMO_PATIENTS } from "@/demoData";
import { useDemoMode } from "@/hooks/useDemoMode";
import {
  AlertTriangle,
  FileText,
  Heart,
  Phone,
  Save,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type CodeStatus = "Full Code" | "DNR" | "DNI" | "Comfort Care";
type DocumentStatus = "On File" | "Not on File" | "Pending";

interface AdvanceDirectiveRecord {
  patientId: number;
  codeStatus: CodeStatus;
  documentStatus: DocumentStatus;
  healthcareProxy: { name: string; relationship: string; phone: string };
  carePlanNotes: string;
}

interface Props {
  activePatientId?: bigint;
  activePatientName?: string;
}

function codeStatusVariant(
  cs: CodeStatus,
): "danger" | "warning" | "neutral" | "success" {
  if (cs === "DNR") return "danger";
  if (cs === "DNI") return "warning";
  if (cs === "Comfort Care") return "neutral";
  return "success";
}

function docStatusVariant(
  ds: DocumentStatus,
): "success" | "warning" | "neutral" {
  if (ds === "On File") return "success";
  if (ds === "Pending") return "warning";
  return "neutral";
}

export default function AdvanceDirectives({
  activePatientId,
  activePatientName,
}: Props) {
  const { isDemoMode } = useDemoMode();
  const [record, setRecord] = useState<AdvanceDirectiveRecord | null>(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [editingProxy, setEditingProxy] = useState(false);
  const [proxyDraft, setProxyDraft] = useState({
    name: "",
    relationship: "",
    phone: "",
  });
  const [editingCodeStatus, setEditingCodeStatus] = useState(false);
  const [codeStatusDraft, setCodeStatusDraft] =
    useState<CodeStatus>("Full Code");
  const [editingDocStatus, setEditingDocStatus] = useState(false);
  const [docStatusDraft, setDocStatusDraft] =
    useState<DocumentStatus>("Not on File");

  const mrn = useMemo(() => {
    if (!activePatientId) return "";
    return DEMO_PATIENTS.find((p) => p.id === activePatientId)?.mrn ?? "";
  }, [activePatientId]);

  useEffect(() => {
    if (!activePatientId) {
      setRecord(null);
      return;
    }
    if (isDemoMode) {
      const found = DEMO_ADVANCE_DIRECTIVES.find(
        (d) => BigInt(d.patientId) === activePatientId,
      );
      setRecord(
        found ?? {
          patientId: Number(activePatientId),
          codeStatus: "Full Code",
          documentStatus: "Not on File",
          healthcareProxy: { name: "", relationship: "", phone: "" },
          carePlanNotes: "",
        },
      );
      return;
    }
    // Non-demo: use localStorage
    const storageKey = `medunite_adv_dir_${Number(activePatientId)}`;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setRecord(JSON.parse(raw) as AdvanceDirectiveRecord);
      } else {
        setRecord({
          patientId: Number(activePatientId),
          codeStatus: "Full Code",
          documentStatus: "Not on File",
          healthcareProxy: { name: "", relationship: "", phone: "" },
          carePlanNotes: "",
        });
      }
    } catch {
      setRecord({
        patientId: Number(activePatientId),
        codeStatus: "Full Code",
        documentStatus: "Not on File",
        healthcareProxy: { name: "", relationship: "", phone: "" },
        carePlanNotes: "",
      });
    }
  }, [activePatientId, isDemoMode]);

  if (!activePatientId) {
    return (
      <div
        data-ocid="advance_directives.empty_state"
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <Shield className="w-10 h-10 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-muted-foreground">
          No patient selected
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Select a patient to view their advance directives and care plan.
        </p>
      </div>
    );
  }

  if (!record) {
    return (
      <div
        data-ocid="advance_directives.error_state"
        className="py-12 text-center"
      >
        <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Failed to load advance directives.
        </p>
      </div>
    );
  }

  const persistRecord = (updated: AdvanceDirectiveRecord) => {
    if (!activePatientId || isDemoMode) return;
    const storageKey = `medunite_adv_dir_${Number(activePatientId)}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // storage failure is non-blocking
    }
  };

  const handleSaveNotes = () => {
    const updated = record ? { ...record, carePlanNotes: notesDraft } : null;
    if (updated) {
      setRecord(updated);
      persistRecord(updated);
    }
    setEditingNotes(false);
    toast.success("Care plan notes saved");
  };

  const handleSaveProxy = () => {
    const updated = record ? { ...record, healthcareProxy: proxyDraft } : null;
    if (updated) {
      setRecord(updated);
      persistRecord(updated);
    }
    setEditingProxy(false);
    toast.success("Healthcare proxy updated");
  };

  const handleSaveCodeStatus = () => {
    const updated = record ? { ...record, codeStatus: codeStatusDraft } : null;
    if (updated) {
      setRecord(updated);
      persistRecord(updated);
    }
    setEditingCodeStatus(false);
    toast.success("Code status updated");
  };

  const handleSaveDocStatus = () => {
    const updated = record
      ? { ...record, documentStatus: docStatusDraft }
      : null;
    if (updated) {
      setRecord(updated);
      persistRecord(updated);
    }
    setEditingDocStatus(false);
    toast.success("Document status updated");
  };

  return (
    <div data-ocid="advance_directives.page" className="space-y-0">
      {/* In-page patient context subheader */}
      {activePatientName && (
        <div className="bg-muted/30 border-b px-6 py-2 text-sm flex items-center gap-2 -mx-6 mb-4">
          <span className="font-semibold text-foreground">
            {activePatientName}
          </span>
          {mrn && <span className="text-muted-foreground text-xs">{mrn}</span>}
          <span className="text-muted-foreground/40 text-xs">›</span>
          <span className="text-muted-foreground text-xs">
            Advance Directives
          </span>
        </div>
      )}

      <div className="space-y-4 max-w-3xl">
        {/* Code Status */}
        <Card data-ocid="advance_directives.code_status.card">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              Code Status
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {!editingCodeStatus ? (
              <div className="flex items-center gap-3">
                <StatusBadge
                  variant={codeStatusVariant(record.codeStatus)}
                  label={record.codeStatus}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="advance_directives.code_status.edit_button"
                  className="text-xs text-muted-foreground h-7"
                  onClick={() => {
                    setCodeStatusDraft(record.codeStatus);
                    setEditingCodeStatus(true);
                  }}
                >
                  Change
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Select
                  value={codeStatusDraft}
                  onValueChange={(v) => setCodeStatusDraft(v as CodeStatus)}
                >
                  <SelectTrigger
                    className="w-44 h-8 text-xs"
                    data-ocid="advance_directives.code_status.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Code">Full Code</SelectItem>
                    <SelectItem value="DNR">
                      DNR — Do Not Resuscitate
                    </SelectItem>
                    <SelectItem value="DNI">DNI — Do Not Intubate</SelectItem>
                    <SelectItem value="Comfort Care">Comfort Care</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  data-ocid="advance_directives.code_status.save_button"
                  onClick={handleSaveCodeStatus}
                  disabled={false}
                >
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  data-ocid="advance_directives.code_status.cancel_button"
                  onClick={() => setEditingCodeStatus(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Advance Directive Document */}
        <Card data-ocid="advance_directives.document.card">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Advance Directive Document
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {!editingDocStatus ? (
              <div className="flex items-center gap-3">
                <StatusBadge
                  variant={docStatusVariant(record.documentStatus)}
                  label={record.documentStatus}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="advance_directives.document.edit_button"
                  className="text-xs text-muted-foreground h-7"
                  onClick={() => {
                    setDocStatusDraft(record.documentStatus);
                    setEditingDocStatus(true);
                  }}
                >
                  Update
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Select
                  value={docStatusDraft}
                  onValueChange={(v) => setDocStatusDraft(v as DocumentStatus)}
                >
                  <SelectTrigger
                    className="w-40 h-8 text-xs"
                    data-ocid="advance_directives.document.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="On File">On File</SelectItem>
                    <SelectItem value="Not on File">Not on File</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  data-ocid="advance_directives.document.save_button"
                  onClick={handleSaveDocStatus}
                  disabled={false}
                >
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  data-ocid="advance_directives.document.cancel_button"
                  onClick={() => setEditingDocStatus(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Healthcare Proxy */}
        <Card data-ocid="advance_directives.proxy.card">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Healthcare Proxy
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {!editingProxy ? (
              record.healthcareProxy.name ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {record.healthcareProxy.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {record.healthcareProxy.relationship}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {record.healthcareProxy.phone}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-ocid="advance_directives.proxy.edit_button"
                    className="text-xs text-muted-foreground h-7 px-0"
                    onClick={() => {
                      setProxyDraft(record.healthcareProxy);
                      setEditingProxy(true);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    No healthcare proxy on file.
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-ocid="advance_directives.proxy.edit_button"
                    className="text-xs text-muted-foreground h-7"
                    onClick={() => {
                      setProxyDraft({ name: "", relationship: "", phone: "" });
                      setEditingProxy(true);
                    }}
                  >
                    Add
                  </Button>
                </div>
              )
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Name
                    </Label>
                    <input
                      type="text"
                      data-ocid="advance_directives.proxy.name.input"
                      value={proxyDraft.name}
                      onChange={(e) =>
                        setProxyDraft((d) => ({ ...d, name: e.target.value }))
                      }
                      className="w-full text-xs h-8 rounded-md border border-input bg-background px-2.5 focus:outline-none focus:ring-1 focus:ring-ring"
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Relationship
                    </Label>
                    <input
                      type="text"
                      data-ocid="advance_directives.proxy.relationship.input"
                      value={proxyDraft.relationship}
                      onChange={(e) =>
                        setProxyDraft((d) => ({
                          ...d,
                          relationship: e.target.value,
                        }))
                      }
                      className="w-full text-xs h-8 rounded-md border border-input bg-background px-2.5 focus:outline-none focus:ring-1 focus:ring-ring"
                      placeholder="e.g. Spouse"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Phone
                    </Label>
                    <input
                      type="text"
                      data-ocid="advance_directives.proxy.phone.input"
                      value={proxyDraft.phone}
                      onChange={(e) =>
                        setProxyDraft((d) => ({ ...d, phone: e.target.value }))
                      }
                      className="w-full text-xs h-8 rounded-md border border-input bg-background px-2.5 focus:outline-none focus:ring-1 focus:ring-ring"
                      placeholder="(555) 000-0000"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    data-ocid="advance_directives.proxy.save_button"
                    onClick={handleSaveProxy}
                    disabled={false}
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    data-ocid="advance_directives.proxy.cancel_button"
                    onClick={() => setEditingProxy(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Care Plan Notes */}
        <Card data-ocid="advance_directives.care_plan.card">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Care Plan Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {!editingNotes ? (
              <div className="space-y-2">
                {record.carePlanNotes ? (
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {record.carePlanNotes}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No care plan notes documented.
                  </p>
                )}
                <Separator className="my-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="advance_directives.care_plan.edit_button"
                  className="text-xs text-muted-foreground h-7 px-0"
                  onClick={() => {
                    setNotesDraft(record.carePlanNotes);
                    setEditingNotes(true);
                  }}
                >
                  {record.carePlanNotes ? "Edit notes" : "Add notes"}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Textarea
                  data-ocid="advance_directives.care_plan.textarea"
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  rows={5}
                  className="text-sm resize-none"
                  placeholder="Document the patient's care goals, preferences, and end-of-life wishes\u2026"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    data-ocid="advance_directives.care_plan.save_button"
                    onClick={handleSaveNotes}
                    disabled={false}
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save Notes
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    data-ocid="advance_directives.care_plan.cancel_button"
                    onClick={() => setEditingNotes(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
