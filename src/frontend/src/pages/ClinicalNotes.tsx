import { Button } from "@/components/ui/button";
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
import { ChevronDown, ChevronUp, FileText, Loader2, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { PatientFilterBar } from "../components/PatientFilterBar";
import { DEMO_CLINICAL_NOTES, DEMO_PATIENTS } from "../demoData";
import { useActor } from "../hooks/useActor";
import { useDemoMode } from "../hooks/useDemoMode";

const noteTypeBadge: Record<string, string> = {
  clinical: "bg-primary/10 text-primary border border-primary/30",
  nursing: "bg-success/10 text-success border border-success/30",
  procedure: "bg-warning/10 text-warning border border-warning/30",
};

const soapLabels = [
  { key: "S", label: "Subjective" },
  { key: "O", label: "Objective" },
  { key: "A", label: "Assessment" },
  { key: "P", label: "Plan" },
] as const;

type NoteEntry = {
  id: bigint;
  patientId: bigint;
  noteType: string;
  authorId: bigint;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  content?: string;
};

type Patient = { id: bigint; name: string };

const toNoteEntry = (n: {
  id: bigint;
  patientId: bigint;
  noteType: string;
  authorId: bigint;
  content: string;
}): NoteEntry => ({
  id: n.id,
  patientId: n.patientId,
  noteType: n.noteType,
  authorId: n.authorId,
  content: n.content,
  subjective: n.content ?? "",
  objective: "",
  assessment: "",
  plan: "",
});

export default function ClinicalNotes({
  activePatientId,
  activePatientName,
  onClearFilter,
  onNavigate,
}: {
  activePatientId?: bigint;
  activePatientName?: string;
  onClearFilter?: () => void;
  onNavigate?: (page: string) => void;
}) {
  const { isDemoMode, demoActor } = useDemoMode();
  const { actor: realActor, isFetching } = useActor();
  const actor = isDemoMode ? demoActor : realActor;

  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [form, setForm] = useState({
    patientId: "",
    noteType: "clinical",
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });

  const loadData = useCallback(async () => {
    if (!actor) return;
    try {
      const [noteData, patientData] = await Promise.all([
        actor.listClinicalNotes(),
        actor.listPatients(),
      ]);
      const mapped = (noteData as typeof DEMO_CLINICAL_NOTES).map(toNoteEntry);
      if (isDemoMode) {
        // Merge backend with seed data, deduplicate by id
        const seedMapped = DEMO_CLINICAL_NOTES.map(toNoteEntry);
        const backendIds = new Set(mapped.map((n) => n.id));
        const merged = [
          ...mapped,
          ...seedMapped.filter((n) => !backendIds.has(n.id)),
        ];
        setNotes(merged);
      } else {
        setNotes(mapped);
      }
      setPatients(patientData as Patient[]);
    } catch {
      toast.error("Failed to load clinical notes");
      if (isDemoMode) {
        setNotes(DEMO_CLINICAL_NOTES.map(toNoteEntry));
        setPatients(DEMO_PATIENTS);
      }
    } finally {
      setLoading(false);
    }
  }, [actor, isDemoMode]);

  useEffect(() => {
    if (!actor) return;
    if (!isDemoMode && isFetching) return;
    setLoading(true);
    loadData();
  }, [actor, isFetching, loadData, isDemoMode]);

  const filteredNotes = activePatientId
    ? notes.filter((n) => n.patientId === activePatientId)
    : notes;

  const handleAdd = async () => {
    if (!form.patientId || !form.subjective) {
      toast.error("Patient and subjective note required");
      return;
    }
    if (!actor) return;
    setSubmitting(true);
    try {
      const content = JSON.stringify({
        subjective: form.subjective,
        objective: form.objective,
        assessment: form.assessment,
        plan: form.plan,
      });
      await actor.createClinicalNote(
        BigInt(form.patientId),
        form.noteType,
        content,
        1n,
      );
      toast.success("Note saved");
      setShowForm(false);
      setForm({
        patientId: "",
        noteType: "clinical",
        subjective: "",
        objective: "",
        assessment: "",
        plan: "",
      });
      await loadData();
    } catch {
      toast.error("Failed to save note");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleRow = (i: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const patientList = patients.length > 0 ? patients : DEMO_PATIENTS;

  if (!activePatientId) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        data-ocid="notes.empty_state"
      >
        <FileText className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Select a patient to view their clinical notes
        </p>
        <button
          type="button"
          onClick={() => onNavigate?.("patients")}
          className="text-xs font-medium text-primary hover:underline"
        >
          Go to Patients
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="notes.page">
      {activePatientId && activePatientName && (
        <PatientFilterBar
          patientName={activePatientName}
          onClear={onClearFilter ?? (() => {})}
        />
      )}
      {/* Page header */}
      <div className="flex items-center justify-between">
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          data-ocid="notes.primary_button"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? (
            <ChevronUp className="w-3.5 h-3.5 mr-1.5" />
          ) : (
            <Plus className="w-3.5 h-3.5 mr-1.5" />
          )}
          Add Note
        </Button>
      </div>

      {/* Inline SOAP form */}
      {showForm && (
        <div
          className="border border-border bg-card p-5"
          data-ocid="notes.panel"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Add Clinical Note
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Patient
              </Label>
              <Select
                onValueChange={(v) => setForm((p) => ({ ...p, patientId: v }))}
              >
                <SelectTrigger
                  data-ocid="notes.patient.select"
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
                Note Type
              </Label>
              <Select
                value={form.noteType}
                onValueChange={(v) => setForm((p) => ({ ...p, noteType: v }))}
              >
                <SelectTrigger
                  data-ocid="notes.type.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clinical">Clinical</SelectItem>
                  <SelectItem value="nursing">Nursing</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {soapLabels.map(({ key, label }) => (
              <div key={key}>
                <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-accent">
                    {key}
                  </span>
                  {label}
                </Label>
                <Textarea
                  data-ocid={`notes.${label.toLowerCase()}.textarea`}
                  value={form[label.toLowerCase() as keyof typeof form]}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      [label.toLowerCase()]: e.target.value,
                    }))
                  }
                  rows={3}
                  className="text-sm"
                  placeholder={`Enter ${label.toLowerCase()} findings...`}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              data-ocid="notes.submit_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={submitting}
              onClick={handleAdd}
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : null}
              Save Note
            </Button>
            <Button
              size="sm"
              variant="outline"
              data-ocid="notes.cancel_button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-border bg-card">
        <Table data-ocid="notes.table">
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Patient
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Type
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                S — Subjective
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                A — Assessment
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4 w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              ["sk-0", "sk-1", "sk-2", "sk-3"].map((k) => (
                <TableRow key={k} data-ocid="notes.loading_state">
                  {["c0", "c1", "c2", "c3", "c4"].map((c) => (
                    <TableCell key={c} className="px-4 py-2.5">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredNotes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-sm text-muted-foreground"
                  data-ocid="notes.empty_state"
                >
                  No clinical notes found.
                </TableCell>
              </TableRow>
            ) : (
              filteredNotes.map((n, i) => {
                const patient = patientList.find((p) => p.id === n.patientId);
                const isExpanded = expandedRows.has(i);
                return (
                  <>
                    <TableRow
                      key={String(n.id)}
                      data-ocid={`notes.row.${i + 1}`}
                      className="hover:bg-muted/30 even:bg-muted/20 border-l-2 border-l-transparent hover:border-l-accent transition-all cursor-pointer"
                      onClick={() => toggleRow(i)}
                    >
                      <TableCell className="font-medium text-sm px-4 py-2.5">
                        {patient?.name ?? "—"}
                      </TableCell>
                      <TableCell className="px-4 py-2.5">
                        <span
                          className={`inline-flex items-center text-xs font-semibold uppercase tracking-wide px-1.5 py-0.5 ${
                            noteTypeBadge[n.noteType] ?? noteTypeBadge.clinical
                          }`}
                        >
                          {n.noteType}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs px-4 py-2.5 truncate">
                        {n.subjective.length > 60
                          ? `${n.subjective.slice(0, 60)}\u2026`
                          : n.subjective}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs px-4 py-2.5 truncate">
                        {n.assessment.length > 60
                          ? `${n.assessment.slice(0, 60)}\u2026`
                          : n.assessment}
                      </TableCell>
                      <TableCell className="px-4 py-2.5">
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow
                        key={`${String(n.id)}-expanded`}
                        className="bg-muted/10"
                      >
                        <TableCell colSpan={5} className="px-4 py-3">
                          <div className="grid grid-cols-2 gap-4">
                            {soapLabels.map(({ key, label }) => (
                              <div key={key}>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-accent">
                                    {key}
                                  </span>
                                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    {label}
                                  </span>
                                </div>
                                <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                                  {
                                    n[
                                      label.toLowerCase() as keyof typeof n
                                    ] as string
                                  }
                                </p>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
