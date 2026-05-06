import { StatusBadge } from "@/components/StatusBadge";
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
import { Textarea } from "@/components/ui/textarea";
import { DEMO_TEAM_NOTES, type DemoTeamNote } from "@/demoData";
import { useActor } from "@/hooks/useActor";
import { useDemoMode } from "@/hooks/useDemoMode";
import { StickyNote, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TeamNotesProps {
  patientId: bigint;
  onNavigate?: (page: string) => void;
}

const ROLE_OPTIONS = ["Doctor", "Nurse", "Care Coordinator"] as const;
type RoleOption = (typeof ROLE_OPTIONS)[number];

const roleVariant = (
  role: string,
): "info" | "success" | "warning" | "neutral" => {
  if (role === "Doctor") return "info";
  if (role === "Nurse") return "success";
  if (role === "Care Coordinator") return "warning";
  return "neutral";
};

function formatTimestamp(ts: string): string {
  try {
    return new Date(ts).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return ts;
  }
}

interface BackendNote {
  id: bigint;
  patientId: bigint;
  noteType: string;
  authorId: bigint;
  content?: string;
}

export default function TeamNotes({ patientId }: TeamNotesProps) {
  const { isDemoMode, demoActor } = useDemoMode();
  const { actor: realActor, isFetching } = useActor();
  const actor = isDemoMode ? demoActor : realActor;

  // Map bigint patientId -> demo string id (p1 = id 1n, etc)
  const pidStr = `p${String(patientId)}`;

  // Local display notes (unified type for demo + backend)
  const [notes, setNotes] = useState<DemoTeamNote[]>(() =>
    isDemoMode ? DEMO_TEAM_NOTES.filter((n) => n.patientId === pidStr) : [],
  );
  const [loading, setLoading] = useState(!isDemoMode);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    role: "Doctor" as RoleOption,
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Load from backend
  useEffect(() => {
    if (isDemoMode || !actor || isFetching) return;
    setLoading(true);
    actor
      .listClinicalNotes()
      .then((backendNotes: BackendNote[]) => {
        const filtered = backendNotes.filter(
          (n) => n.noteType === "team-note" && n.patientId === patientId,
        );
        const mapped: DemoTeamNote[] = filtered.map((n) => ({
          id: `tn${String(n.id)}`,
          patientId: pidStr,
          author: "Care Team",
          role: "Doctor",
          timestamp: new Date().toISOString(),
          note: n.content ?? "(no content)",
        }));
        setNotes(mapped);
      })
      .catch(() => {
        setNotes([]);
      })
      .finally(() => setLoading(false));
  }, [actor, isFetching, isDemoMode, patientId, pidStr]);

  const handleSubmit = async () => {
    if (!form.note.trim()) {
      toast.error("Please enter a note");
      return;
    }
    setSubmitting(true);
    try {
      if (!isDemoMode && actor) {
        await actor.createClinicalNote(
          patientId,
          "team-note",
          form.note.trim(),
          BigInt(1),
        );
      }
      const newNote: DemoTeamNote = {
        id: `tn${Date.now()}`,
        patientId: pidStr,
        author:
          form.role === "Doctor"
            ? "Dr. Sarah Johnson"
            : form.role === "Nurse"
              ? "Nurse Mike Torres"
              : "Care Coordinator",
        role: form.role,
        timestamp: new Date().toISOString(),
        note: form.note.trim(),
      };
      setNotes((prev) => [newNote, ...prev]);
      setForm({ role: "Doctor", note: "" });
      setShowForm(false);
      toast.success("Team note added");
    } catch {
      toast.error("Failed to save note");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4" data-ocid="team_notes.page">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <StickyNote className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              Team Notes
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Internal notes — not part of the official patient chart
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          data-ocid="team_notes.open_modal_button"
          onClick={() => setShowForm((v) => !v)}
          className="text-xs h-7"
        >
          {showForm ? "Cancel" : "+ Add Note"}
        </Button>
      </div>

      {/* Inline Add Form */}
      {showForm && (
        <div
          className="border border-border bg-muted/20 p-4 space-y-3"
          data-ocid="team_notes.panel"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            New Team Note
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Role
              </Label>
              <Select
                value={form.role}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, role: v as RoleOption }))
                }
              >
                <SelectTrigger
                  data-ocid="team_notes.role.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Note
              </Label>
              <Textarea
                data-ocid="team_notes.textarea"
                value={form.note}
                onChange={(e) =>
                  setForm((p) => ({ ...p, note: e.target.value }))
                }
                placeholder="Enter internal care team note..."
                rows={3}
                className="mt-1 text-sm resize-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              data-ocid="team_notes.submit_button"
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-7 text-xs"
            >
              {submitting ? "Saving..." : "Save Note"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              data-ocid="team_notes.cancel_button"
              onClick={() => setShowForm(false)}
              className="h-7 text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-2" data-ocid="team_notes.loading_state">
          {[1, 2].map((i) => (
            <div key={i} className="border border-border p-4 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Notes List */}
      {!loading && notes.length === 0 ? (
        <div
          className="border border-border bg-muted/10 py-12 text-center"
          data-ocid="team_notes.empty_state"
        >
          <UserCircle2 className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
          <p className="text-sm text-muted-foreground">
            No team notes for this patient yet
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Add a note above to share internal context with the care team
          </p>
        </div>
      ) : (
        !loading && (
          <div className="space-y-2">
            {notes.map((note, idx) => (
              <div
                key={note.id}
                data-ocid={`team_notes.item.${idx + 1}`}
                className="border border-border bg-card p-4 space-y-2"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-foreground">
                    {note.author}
                  </span>
                  <StatusBadge
                    variant={roleVariant(note.role)}
                    label={note.role}
                  />
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatTimestamp(note.timestamp)}
                  </span>
                </div>
                <p className="text-[13px] text-foreground leading-relaxed">
                  {note.note}
                </p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
