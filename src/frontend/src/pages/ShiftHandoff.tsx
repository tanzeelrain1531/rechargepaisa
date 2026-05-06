import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardCheck,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DEMO_PATIENTS } from "../demoData";

type Shift = "day" | "evening" | "night";

const SHIFT_LABELS: Record<Shift, string> = {
  day: "Day (7am–3pm)",
  evening: "Evening (3pm–11pm)",
  night: "Night (11pm–7am)",
};

interface HandoffNote {
  id: string;
  fromNurse: string;
  toNurse: string;
  shift: Shift;
  patientName: string;
  timestamp: string;
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
  readBy?: string;
}

const INITIAL_NOTES: HandoffNote[] = [
  {
    id: "ho-1",
    fromNurse: "RN. Sarah Park",
    toNurse: "RN. David Torres",
    shift: "day",
    patientName: "James Harrington",
    timestamp: "2026-03-16 14:55",
    situation:
      "Post-op day 2, cardiac surgery. Patient is alert and oriented x3. BP 138/82, HR 78, SpO2 96% on 2L NC. Wound site intact, no signs of dehiscence.",
    background:
      "68-year-old male admitted for CABG x3. PMH: CAD, HTN, DM2. No known drug allergies. Currently on Metoprolol, aspirin, and IV Vancomycin for MRSA prophylaxis.",
    assessment:
      "Stable. Mild incisional pain rated 3/10. Lung sounds clear bilaterally. Lower extremity edema 1+ bilateral. Urine output adequate at 45 mL/hr over last 4 hours.",
    recommendation:
      "Continue cardiac monitoring. Assess incision site at 1900. Pain reassessment in 2 hours. PT consult scheduled for tomorrow. Notify MD if HR > 110 or SpO2 < 92%.",
  },
  {
    id: "ho-2",
    fromNurse: "RN. Maria Gonzalez",
    toNurse: "RN. Kevin Brown",
    shift: "evening",
    patientName: "Margaret Chen",
    timestamp: "2026-03-15 22:50",
    situation:
      "71-year-old female admitted for hypertensive urgency. BP improved from 190/110 to 152/94 after IV labetalol. Now switched to PO antihypertensives.",
    background:
      "Chronic hypertension x 20 years. Also manages T2DM. Last HbA1c 8.4%. Current medications: Lisinopril 20mg, Amlodipine 10mg, Metformin 1000mg.",
    assessment:
      "Hemodynamically improved. Complaining of mild headache 2/10. Neurological exam intact. FS glucose 152 at 1800.",
    recommendation:
      "Continue BP monitoring every 2 hours overnight. Bedside glucose check at 2200 and 0200. Call MD if SBP > 170 or < 90.",
  },
  {
    id: "ho-3",
    fromNurse: "RN. Angela Reyes",
    toNurse: "RN. Sarah Park",
    shift: "night",
    patientName: "Linda Washington",
    timestamp: "2026-03-15 06:45",
    situation:
      "56-year-old female, T2DM admission for glucose management. Glucose trended from 310 to 185 overnight on insulin drip per protocol.",
    background:
      "Hx of DM2 x 15 years. Also on dialysis for CKD Stage 4. Insulin drip started at 2300 per MD order. No allergies.",
    assessment:
      "Glucose improving. No hypoglycemia overnight (nadir 142 at 0400). Stable vitals. IV site intact, no infiltration. Urine output 15 mL/hr — consistent with renal baseline.",
    recommendation:
      "Transition to SQ insulin per endocrinology recommendation when glucose < 150 x2. Continue hourly glucose checks. Dietary consult needed — request low-carb renal diet.",
  },
];

const patientNames = DEMO_PATIENTS.slice(0, 10).map((p) => p.name);

const SBAR_SECTIONS = [
  {
    key: "situation" as const,
    letter: "S",
    label: "Situation",
    color: "text-primary",
  },
  {
    key: "background" as const,
    letter: "B",
    label: "Background",
    color: "text-primary",
  },
  {
    key: "assessment" as const,
    letter: "A",
    label: "Assessment",
    color: "text-warning",
  },
  {
    key: "recommendation" as const,
    letter: "R",
    label: "Recommendation",
    color: "text-success",
  },
] as const;

export default function ShiftHandoff({
  onNavigate: _onNavigate,
}: { onNavigate: (page: string) => void }) {
  const [notes, setNotes] = useState<HandoffNote[]>(INITIAL_NOTES);
  const [loading] = useState(false);
  const { actor, isFetching } = useActor();
  // Load backend shift-handoff notes on mount
  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .listClinicalNotes()
      .then((notes) => {
        const backendNotes = notes
          .filter((n) => n.noteType === "shift-handoff")
          .map((n) => {
            try {
              return JSON.parse(n.content) as HandoffNote;
            } catch {
              return null;
            }
          })
          .filter(Boolean) as HandoffNote[];
        if (backendNotes.length > 0) {
          setNotes((prev) => [...backendNotes, ...prev]);
        }
      })
      .catch(() => {});
  }, [actor, isFetching]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [shiftFilter, setShiftFilter] = useState<Shift | "all">(() => {
    try {
      const p = JSON.parse(
        localStorage.getItem("medunite_prefs_Nurse") || "{}",
      );
      if (p.shift === "day" || p.shift === "night") return p.shift;
    } catch {
      /* ignore */
    }
    return "all";
  });
  const [openSections, setOpenSections] = useState<Record<string, Set<string>>>(
    {},
  );

  const [form, setForm] = useState({
    patientName: "",
    fromNurse: "",
    toNurse: "",
    shift: "day" as Shift,
    situation: "",
    background: "",
    assessment: "",
    recommendation: "",
  });

  const filtered = notes.filter(
    (n) => shiftFilter === "all" || n.shift === shiftFilter,
  );

  const toggleSection = (noteId: string, section: string) => {
    setOpenSections((prev) => {
      const current = new Set(prev[noteId] ?? ["situation"]);
      if (current.has(section)) {
        current.delete(section);
      } else {
        current.add(section);
      }
      return { ...prev, [noteId]: current };
    });
  };

  const isSectionOpen = (noteId: string, section: string) => {
    // Default: situation is open
    const sections = openSections[noteId];
    if (!sections) return section === "situation";
    return sections.has(section);
  };

  const handleMarkRead = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId ? { ...n, readBy: "RN. Current User" } : n,
      ),
    );
  };

  const handleSubmit = () => {
    if (
      !form.patientName ||
      !form.fromNurse ||
      !form.toNurse ||
      !form.situation
    )
      return;
    const note: HandoffNote = {
      id: `ho-${Date.now()}`,
      ...form,
      timestamp: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
    setNotes((prev) => [note, ...prev]);
    setForm({
      patientName: "",
      fromNurse: "",
      toNurse: "",
      shift: "day",
      situation: "",
      background: "",
      assessment: "",
      recommendation: "",
    });
    setShowForm(false);
    if (actor) {
      actor
        .createClinicalNote(1n, "shift-handoff", JSON.stringify(note), 1n)
        .then(() => toast.success("Handoff note saved"))
        .catch(() => {});
    }
  };

  return (
    <div className="space-y-4" data-ocid="shift-handoff.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Shift Handoff Notes
          </h2>
          <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-sm font-medium">
            SBAR Format
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-sm overflow-hidden">
            {(["all", "day", "evening", "night"] as const).map((s) => (
              <button
                key={s}
                type="button"
                data-ocid={`shift-handoff.filter.${s}.tab`}
                onClick={() => setShiftFilter(s)}
                className={`px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  shiftFilter === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            data-ocid="shift-handoff.open_modal_button"
            onClick={() => setShowForm((v) => !v)}
            className="h-7 text-xs gap-1"
          >
            <Plus className="w-3 h-3" />
            {showForm ? "Cancel" : "New Handoff Note"}
          </Button>
        </div>
      </div>

      {/* New Note Form */}
      {showForm && (
        <Card
          data-ocid="shift-handoff.add.panel"
          className="border-primary/20 bg-primary/5"
        >
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-foreground">
              New Handoff Note — SBAR
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="sh-patient"
                  className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                >
                  Patient
                </label>
                <select
                  id="sh-patient"
                  data-ocid="shift-handoff.patient.select"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, patientName: e.target.value }))
                  }
                  className="w-full h-8 px-2 text-[12px] bg-background border border-input rounded-sm focus:outline-none"
                >
                  <option value="">Select patient...</option>
                  {patientNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="sh-shift"
                  className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                >
                  Shift
                </label>
                <select
                  id="sh-shift"
                  data-ocid="shift-handoff.shift.select"
                  value={form.shift}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, shift: e.target.value as Shift }))
                  }
                  className="w-full h-8 px-2 text-[12px] bg-background border border-input rounded-sm focus:outline-none"
                >
                  <option value="day">Day (7am–3pm)</option>
                  <option value="evening">Evening (3pm–11pm)</option>
                  <option value="night">Night (11pm–7am)</option>
                </select>
              </div>
              <div />
              <div>
                <label
                  htmlFor="sh-from-nurse"
                  className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                >
                  From Nurse
                </label>
                <input
                  type="text"
                  id="sh-from-nurse"
                  data-ocid="shift-handoff.from-nurse.input"
                  value={form.fromNurse}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fromNurse: e.target.value }))
                  }
                  placeholder="RN. Name"
                  className="w-full h-8 px-2 text-[12px] bg-background border border-input rounded-sm focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="sh-to-nurse"
                  className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                >
                  To Nurse
                </label>
                <input
                  type="text"
                  id="sh-to-nurse"
                  data-ocid="shift-handoff.to-nurse.input"
                  value={form.toNurse}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, toNurse: e.target.value }))
                  }
                  placeholder="RN. Name"
                  className="w-full h-8 px-2 text-[12px] bg-background border border-input rounded-sm focus:outline-none"
                />
              </div>
            </div>
            {(
              [
                {
                  key: "situation",
                  label: "S — Situation",
                  placeholder: "Current patient condition...",
                },
                {
                  key: "background",
                  label: "B — Background",
                  placeholder: "Relevant medical history...",
                },
                {
                  key: "assessment",
                  label: "A — Assessment",
                  placeholder: "Nurse's clinical assessment...",
                },
                {
                  key: "recommendation",
                  label: "R — Recommendation",
                  placeholder: "What actions should the incoming nurse take...",
                },
              ] as const
            ).map(({ key, label, placeholder }) => (
              <div key={key}>
                <label
                  htmlFor={`sh-${key}`}
                  className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                >
                  {label}
                </label>
                <textarea
                  id={`sh-${key}`}
                  data-ocid={`shift-handoff.${key}.textarea`}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  rows={2}
                  placeholder={placeholder}
                  className="w-full px-2 py-1.5 text-[12px] bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring resize-none"
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button
                size="sm"
                data-ocid="shift-handoff.add.submit_button"
                onClick={handleSubmit}
                className="h-7 text-xs"
              >
                Submit Handoff
              </Button>
              <Button
                size="sm"
                variant="ghost"
                data-ocid="shift-handoff.add.cancel_button"
                onClick={() => setShowForm(false)}
                className="h-7 text-xs"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes list */}
      {loading ? (
        <div className="space-y-2" data-ocid="shift-handoff.loading_state">
          {[1, 2, 3].map((k) => (
            <div
              key={k}
              className="bg-card border border-border rounded-sm p-4"
            >
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-3 w-64" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="py-12 text-center text-[13px] text-muted-foreground bg-card border border-border rounded-sm"
          data-ocid="shift-handoff.empty_state"
        >
          <ClipboardCheck className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p>No handoff notes found.</p>
        </div>
      ) : (
        <div className="space-y-2" data-ocid="shift-handoff.list">
          {filtered.map((note, idx) => (
            <div
              key={note.id}
              data-ocid={`shift-handoff.item.${idx + 1}`}
              className="bg-card border border-border rounded-sm overflow-hidden"
            >
              {/* Header row */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-3 min-w-0">
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">
                      {note.patientName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {note.timestamp}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {note.fromNurse}
                    </span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="font-medium text-foreground">
                      {note.toNurse}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge
                    variant={
                      note.shift === "day"
                        ? "info"
                        : note.shift === "evening"
                          ? "warning"
                          : "neutral"
                    }
                    label={SHIFT_LABELS[note.shift]}
                  />
                  {note.readBy ? (
                    <span className="flex items-center gap-1 text-xs text-success font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Read
                    </span>
                  ) : (
                    <button
                      type="button"
                      data-ocid="handoff.mark_read.button"
                      onClick={() => handleMarkRead(note.id)}
                      className="text-xs font-medium px-2 py-0.5 rounded-sm border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    type="button"
                    data-ocid={`shift-handoff.toggle.${idx + 1}`}
                    onClick={() =>
                      setExpandedId(expandedId === note.id ? null : note.id)
                    }
                    className="p-0.5 hover:bg-muted/40 rounded-sm transition-colors"
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expandedId === note.id ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* SBAR Collapsible Sections */}
              {expandedId === note.id && (
                <div className="divide-y divide-border">
                  {SBAR_SECTIONS.map(({ key, letter, label, color }) => (
                    <Collapsible
                      key={key}
                      open={isSectionOpen(note.id, key)}
                      onOpenChange={() => toggleSection(note.id, key)}
                    >
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/20 transition-colors text-left"
                          data-ocid={`shift-handoff.sbar.${key}.toggle`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold uppercase tracking-widest ${color} w-5`}
                            >
                              {letter}
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              {label}
                            </span>
                          </div>
                          {isSectionOpen(note.id, key) ? (
                            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-4 pb-3 pt-1">
                          <p className="text-sm text-foreground leading-relaxed">
                            {note[key]}
                          </p>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
