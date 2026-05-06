import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Mic } from "lucide-react";
import { CLINIC_PHRASES, PERSONAL_PHRASES } from "../../pages/SmartPhrases";

const SOAP_SECTIONS = [
  {
    key: "subjective" as const,
    letter: "S",
    label: "Subjective",
    hint: "Chief complaint, history of present illness, review of systems",
  },
  {
    key: "objective" as const,
    letter: "O",
    label: "Objective",
    hint: "Exam findings, vitals summary, relevant test results",
  },
  {
    key: "assessment" as const,
    letter: "A",
    label: "Assessment",
    hint: "Diagnosis / differential diagnoses",
  },
  {
    key: "plan" as const,
    letter: "P",
    label: "Plan",
    hint: "Treatment, medications, orders, referrals, follow-up",
  },
] as const;

type SoapKey = "subjective" | "objective" | "assessment" | "plan";

export const ROS_SYSTEMS = [
  {
    system: "Constitutional",
    symptoms: ["Fever", "Chills", "Fatigue", "Weight loss"],
  },
  {
    system: "Cardiovascular",
    symptoms: ["Chest pain", "Palpitations", "Edema", "Dyspnea on exertion"],
  },
  {
    system: "Respiratory",
    symptoms: ["Shortness of breath", "Cough", "Wheezing", "Hemoptysis"],
  },
  {
    system: "GI",
    symptoms: [
      "Nausea",
      "Vomiting",
      "Abdominal pain",
      "Diarrhea",
      "Constipation",
    ],
  },
  {
    system: "Musculoskeletal",
    symptoms: ["Joint pain", "Muscle aches", "Back pain", "Weakness"],
  },
  {
    system: "Neurological",
    symptoms: ["Headache", "Dizziness", "Numbness/tingling", "Vision changes"],
  },
  {
    system: "Psychiatric",
    symptoms: ["Anxiety", "Depression", "Sleep disturbance", "Confusion"],
  },
] as const;

const DIFF_DX_MAP: Record<string, Array<{ code: string; name: string }>> = {
  chest: [
    { code: "I20.9", name: "Angina pectoris, unspecified" },
    { code: "I21.9", name: "Acute myocardial infarction, unspecified" },
    { code: "K21.0", name: "GERD with esophagitis" },
    { code: "M94.0", name: "Costochondritis" },
    { code: "F41.1", name: "Generalized anxiety disorder" },
  ],
  diabetes: [
    { code: "E11.9", name: "Type 2 diabetes mellitus without complications" },
    { code: "E10.9", name: "Type 1 diabetes mellitus without complications" },
    { code: "E16.0", name: "Drug-induced hypoglycemia without coma" },
    { code: "N08", name: "Glomerular disorders (diabetic nephropathy)" },
    { code: "E88.81", name: "Metabolic syndrome" },
  ],
  fever: [
    { code: "J11.1", name: "Influenza with other respiratory manifestations" },
    { code: "J18.9", name: "Pneumonia, unspecified organism" },
    { code: "N39.0", name: "Urinary tract infection, site not specified" },
    { code: "A41.9", name: "Sepsis, unspecified organism" },
    { code: "U07.1", name: "COVID-19" },
  ],
  headache: [
    { code: "G43.909", name: "Migraine, unspecified, not intractable" },
    { code: "G44.309", name: "Post-traumatic headache, unspecified" },
    { code: "G44.209", name: "Tension-type headache, unspecified" },
    { code: "I10", name: "Essential (primary) hypertension" },
    { code: "G03.9", name: "Meningitis, unspecified" },
  ],
  default: [
    {
      code: "Z00.00",
      name: "Encounter for general adult medical examination",
    },
    { code: "J06.9", name: "Acute upper respiratory infection, unspecified" },
    { code: "R53.83", name: "Other fatigue" },
    { code: "K30", name: "Functional dyspepsia" },
    { code: "M79.3", name: "Panniculitis, unspecified" },
  ],
};

function getDiffDxSuggestions(text: string) {
  const lower = text.toLowerCase();
  for (const [keyword, suggestions] of Object.entries(DIFF_DX_MAP)) {
    if (keyword !== "default" && lower.includes(keyword)) {
      return suggestions;
    }
  }
  return DIFF_DX_MAP.default;
}

function DiffDxPanel({
  subjective,
  onUse,
  disabled,
}: {
  subjective: string;
  onUse: (code: string, name: string) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const suggestions = getDiffDxSuggestions(subjective);

  if (!subjective.trim()) return null;

  return (
    <div
      className="border border-primary/20 bg-primary/5 overflow-hidden mt-2"
      data-ocid="encounter.diffDx.panel"
    >
      <button
        type="button"
        data-ocid="encounter.diffDx.toggle"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-primary/10 transition-colors"
      >
        <span className="text-xs font-semibold text-primary uppercase tracking-wide flex items-center gap-1.5">
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
          </svg>
          Suggested Diagnoses
        </span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-primary/60" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-primary/60" />
        )}
      </button>
      {open && (
        <div className="border-t border-blue-200 divide-y divide-blue-100">
          {suggestions.map((s) => (
            <div
              key={s.code}
              className="flex items-center justify-between px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-semibold text-primary bg-primary/15 px-1.5 py-0.5 rounded-sm">
                  {s.code}
                </span>
                <span className="text-xs text-foreground">{s.name}</span>
              </div>
              {!disabled && (
                <button
                  type="button"
                  data-ocid="encounter.diffDx.use_button"
                  onClick={() => onUse(s.code, s.name)}
                  className="text-xs font-semibold px-2 py-0.5 rounded-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex-shrink-0 ml-3"
                >
                  Use
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React from "react";

interface SoapState {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

interface EncounterSOAPProps {
  soap: SoapState;
  setSoap: React.Dispatch<React.SetStateAction<SoapState>>;
  isSigned: boolean;
  appointmentId?: bigint | null;
  appointmentReason?: string;
  spActive: string | null;
  setSpActive: (v: string | null) => void;
  spFilter: string;
  setSpFilter: (v: string) => void;
  dictating: Record<string, boolean>;
  handleDictate: (sectionKey: string) => void;
  showRos: boolean;
  setShowRos: (v: boolean) => void;
  rosFindings: Record<string, Record<string, boolean>>;
  setRosFindings: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, boolean>>>
  >;
  rosChecked: number;
  rosText: string;
}

// Pre-Visit Patient Intake Panel
const DEFAULT_PRE_VISIT_INTAKE = {
  chiefComplaint: "Chest pain and shortness of breath",
  symptoms: [
    "Chest tightness",
    "Shortness of breath",
    "Fatigue",
    "Mild dizziness",
  ],
  painScale: 6,
  duration: "2 days",
  notes:
    "Pain worsens with exertion. No fever. Taking ibuprofen with minimal relief.",
};

function getPreVisitIntake(appointmentId?: bigint | null) {
  // Check localStorage for patient-submitted intake data for this appointment
  if (appointmentId) {
    const key = `previsit_intake_appt-${appointmentId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        return {
          chiefComplaint: data.chiefComplaint || "",
          symptoms: data.symptoms || [],
          painScale: data.severity || 5,
          duration: data.duration || "",
          notes: [data.recentChanges, data.additionalNotes]
            .filter(Boolean)
            .join(" "),
          fromPortal: true,
          allergies: data.allergies || "",
          currentMeds: data.currentMeds || "",
        };
      } catch {
        /* ignore */
      }
    }
  }
  // Also check for the general key
  const generalRaw = localStorage.getItem("previsit_intake_general");
  if (generalRaw) {
    try {
      const data = JSON.parse(generalRaw);
      return {
        chiefComplaint: data.chiefComplaint || "",
        symptoms: data.symptoms || [],
        painScale: data.severity || 5,
        duration: data.duration || "",
        notes: [data.recentChanges, data.additionalNotes]
          .filter(Boolean)
          .join(" "),
        fromPortal: true,
        allergies: data.allergies || "",
        currentMeds: data.currentMeds || "",
      };
    } catch {
      /* ignore */
    }
  }
  return {
    ...DEFAULT_PRE_VISIT_INTAKE,
    fromPortal: false,
    allergies: "",
    currentMeds: "",
  };
}

interface PreVisitIntakePanelProps {
  isSigned: boolean;
  setSoap: React.Dispatch<React.SetStateAction<SoapState>>;
  appointmentId?: bigint | null;
}

function PreVisitIntakePanel({
  isSigned,
  setSoap,
  appointmentId,
}: PreVisitIntakePanelProps) {
  const [open, setOpen] = React.useState(false);
  const intake = getPreVisitIntake(appointmentId);

  const copyToSubjective = () => {
    const text = [
      `Chief Complaint: ${intake.chiefComplaint}`,
      `Symptoms: ${intake.symptoms.join(", ")}`,
      `Pain Scale: ${intake.painScale}/10`,
      intake.duration ? `Duration: ${intake.duration}` : null,
      intake.notes ? `Patient Notes: ${intake.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    setSoap((prev) => ({
      ...prev,
      subjective: prev.subjective ? `${prev.subjective}\n\n${text}` : text,
    }));
    setOpen(false);
  };

  return (
    <div
      className="border border-border bg-card mb-5 overflow-hidden"
      data-ocid="encounter.previsit.panel"
    >
      <button
        type="button"
        data-ocid="encounter.previsit.toggle.button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-primary/5 border-b border-transparent hover:bg-primary/10 transition-colors"
        disabled={isSigned}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
            Pre-Visit Patient Intake
          </h2>
          <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
            Patient submitted pre-visit intake
          </span>
        </div>
        <span className="text-muted-foreground">
          {open ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
      </button>
      {open && (
        <div className="px-4 py-4 space-y-4">
          {/* Chief complaint */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Chief Complaint
            </p>
            <p className="text-sm font-semibold text-foreground">
              {intake.chiefComplaint}
            </p>
          </div>

          {/* Symptoms */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
              Reported Symptoms
            </p>
            <div className="flex flex-wrap gap-1.5">
              {intake.symptoms.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/15 text-foreground border border-warning/20"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Pain scale & duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                Pain Scale (0–10)
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(intake.painScale / 10) * 100}%`,
                      background:
                        intake.painScale >= 7
                          ? "var(--destructive)"
                          : intake.painScale >= 4
                            ? "var(--warning)"
                            : "var(--success)",
                    }}
                  />
                </div>
                <span className="text-sm font-bold tabular-nums text-foreground w-8 text-right">
                  {intake.painScale}/10
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                Duration
              </p>
              <p className="text-sm text-foreground font-medium">
                {intake.duration}
              </p>
            </div>
          </div>

          {/* Patient notes */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Patient Notes
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              &ldquo;{intake.notes}&rdquo;
            </p>
          </div>

          {/* Copy to Subjective */}
          {!isSigned && (
            <button
              type="button"
              data-ocid="encounter.previsit.copy.button"
              onClick={copyToSubjective}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-semibold border border-primary/30 text-primary hover:bg-primary/5 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy to Subjective
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function AppointmentReasonChip({
  reason,
  currentValue,
  isSigned,
  onUse,
}: {
  reason?: string;
  currentValue: string;
  isSigned: boolean;
  onUse: () => void;
}) {
  const [dismissed, setDismissed] = React.useState(false);

  if (!reason || currentValue.trim() !== "" || isSigned || dismissed) {
    return null;
  }

  return (
    <div className="mb-2 flex items-center gap-1.5">
      <button
        type="button"
        data-ocid="encounter.soap.subjective.prefill.button"
        onClick={onUse}
        className="inline-flex items-center gap-1.5 text-xs bg-primary/8 text-primary border border-primary/20 rounded px-2.5 py-1 cursor-pointer hover:bg-primary/15 transition-colors"
      >
        <span className="text-primary/70">✦</span>
        Use appointment reason:{" "}
        <span className="font-medium italic">"{reason}"</span>
      </button>
      <button
        type="button"
        data-ocid="encounter.soap.subjective.prefill.close_button"
        onClick={() => setDismissed(true)}
        className="text-muted-foreground/60 hover:text-muted-foreground transition-colors text-xs leading-none"
        aria-label="Dismiss suggestion"
      >
        ×
      </button>
    </div>
  );
}

export function EncounterSOAP({
  soap,
  setSoap,
  isSigned,
  appointmentId,
  appointmentReason,
  spActive,
  setSpActive,
  spFilter,
  setSpFilter,
  dictating,
  handleDictate,
  showRos,
  setShowRos,
  rosFindings,
  setRosFindings,
  rosChecked,
  rosText,
}: EncounterSOAPProps) {
  return (
    <>
      {/* Pre-Visit Patient Intake Panel */}
      <PreVisitIntakePanel
        isSigned={isSigned}
        setSoap={setSoap}
        appointmentId={appointmentId}
      />

      {/* Review of Systems */}
      <section
        className="border border-border bg-card mb-5"
        data-ocid="encounter.ros.panel"
      >
        <button
          type="button"
          data-ocid="encounter.ros.toggle.button"
          onClick={() => setShowRos(!showRos)}
          className="w-full flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-transparent hover:bg-muted/40 transition-colors"
          disabled={isSigned}
        >
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Review of Systems
          </h2>
          <span className="flex items-center gap-2">
            {rosChecked > 0 && (
              <span className="text-xs font-semibold text-primary">
                {rosChecked} positive finding{rosChecked !== 1 ? "s" : ""}
              </span>
            )}
            {showRos ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </span>
        </button>
        {showRos && (
          <div className="px-4 py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ROS_SYSTEMS.map(({ system, symptoms }) => (
                <div key={system} className="space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {system}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {symptoms.map((symptom) => (
                      <label
                        key={symptom}
                        className="flex items-center gap-1.5 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          disabled={isSigned}
                          checked={rosFindings[system]?.[symptom] ?? false}
                          onChange={(e) =>
                            setRosFindings((prev) => ({
                              ...prev,
                              [system]: {
                                ...(prev[system] ?? {}),
                                [symptom]: e.target.checked,
                              },
                            }))
                          }
                          className="w-3.5 h-3.5 accent-primary"
                          data-ocid="encounter.ros.checkbox"
                        />
                        <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                          {symptom}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-1 border-t border-border">
              {!isSigned && (
                <button
                  type="button"
                  data-ocid="encounter.ros.secondary_button"
                  onClick={() =>
                    setRosFindings(
                      Object.fromEntries(
                        ROS_SYSTEMS.map(({ system, symptoms }) => [
                          system,
                          Object.fromEntries(symptoms.map((s) => [s, false])),
                        ]),
                      ),
                    )
                  }
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 border border-border rounded-sm hover:bg-muted/40"
                >
                  Mark all negative
                </button>
              )}
            </div>
            {rosText && (
              <div className="bg-muted/30 border border-border rounded-sm p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Generated ROS Text
                </p>
                <p className="text-xs text-foreground leading-relaxed font-mono">
                  {rosText}
                </p>
                {!isSigned && (
                  <button
                    type="button"
                    data-ocid="encounter.ros.primary_button"
                    onClick={() =>
                      setSoap((prev) => ({
                        ...prev,
                        subjective: prev.subjective
                          ? `${prev.subjective}\n\n${rosText}`
                          : rosText,
                      }))
                    }
                    className="mt-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    ↑ Copy to Subjective
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* SOAP Note */}
      <section className="border border-border bg-card mb-5">
        <div className="px-4 py-2 border-b border-border bg-muted/20">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            SOAP Note
          </h2>
        </div>
        <div className="divide-y divide-border">
          {SOAP_SECTIONS.map(({ key, letter, label, hint }) => (
            <div key={key} className="px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <span className="w-6 h-6 flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground">
                    {letter}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="mb-1.5 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-foreground">
                        {label}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {hint}
                      </span>
                    </div>
                    {!isSigned && (
                      <button
                        type="button"
                        data-ocid={`encounter.soap.${key}.button`}
                        onClick={() => handleDictate(key)}
                        disabled={dictating[key]}
                        title="Dictate"
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors disabled:opacity-60"
                      >
                        {dictating[key] ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                            <span className="text-xs text-destructive">
                              Listening...
                            </span>
                          </>
                        ) : (
                          <Mic className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                  {key === "subjective" && (
                    <AppointmentReasonChip
                      reason={appointmentReason}
                      currentValue={soap.subjective}
                      isSigned={isSigned}
                      onUse={() =>
                        setSoap((prev) => ({
                          ...prev,
                          subjective: appointmentReason ?? "",
                        }))
                      }
                    />
                  )}
                  <div className="relative">
                    <Textarea
                      data-ocid={`encounter.soap.${key}.textarea`}
                      value={soap[key as SoapKey]}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSoap((prev) => ({ ...prev, [key]: val }));
                        const lastDot = val.lastIndexOf(".");
                        if (lastDot !== -1 && lastDot === val.length - 1) {
                          setSpActive(key);
                          setSpFilter("");
                        } else if (
                          lastDot !== -1 &&
                          lastDot < val.length - 1 &&
                          spActive === key
                        ) {
                          const typed = val.slice(lastDot + 1);
                          if (typed.length > 0 && !typed.includes(" ")) {
                            setSpFilter(typed.toLowerCase());
                          } else {
                            setSpActive(null);
                          }
                        } else {
                          setSpActive(null);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setSpActive(null);
                      }}
                      disabled={isSigned}
                      rows={4}
                      className="text-sm leading-relaxed font-mono resize-y"
                      placeholder={`Enter ${label.toLowerCase()}...`}
                    />
                    {!isSigned && spActive === key && (
                      <div
                        className="absolute z-10 left-0 top-full mt-1 w-full max-w-sm bg-card border border-border rounded-sm shadow-lg overflow-hidden"
                        data-ocid={`encounter.smartphrase.${key}.dropdown_menu`}
                      >
                        <div className="px-3 py-1.5 border-b border-border bg-muted/30">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            SmartPhrases
                          </p>
                        </div>
                        {[...PERSONAL_PHRASES, ...CLINIC_PHRASES]
                          .filter((p) =>
                            spFilter === ""
                              ? true
                              : p.trigger.toLowerCase().includes(spFilter) ||
                                p.title.toLowerCase().includes(spFilter),
                          )
                          .slice(0, 6)
                          .map((p, pi) => (
                            <button
                              key={p.id}
                              type="button"
                              data-ocid={`encounter.smartphrase.item.${pi + 1}`}
                              className="w-full flex items-start gap-2 px-3 py-2 text-left hover:bg-muted/40 transition-colors border-b border-border/50 last:border-0"
                              onClick={() => {
                                setSoap((prev) => {
                                  const current = prev[key as SoapKey];
                                  const lastDot = current.lastIndexOf(
                                    `.${spFilter}`,
                                  );
                                  const before = current.slice(0, lastDot);
                                  return {
                                    ...prev,
                                    [key]: before + p.expansion,
                                  };
                                });
                                setSpActive(null);
                                setSpFilter("");
                              }}
                            >
                              <code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 bg-muted text-muted-foreground">
                                {p.trigger}
                              </code>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground">
                                  {p.title}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {p.expansion.slice(0, 60)}...
                                </p>
                              </div>
                            </button>
                          ))}
                        {[...PERSONAL_PHRASES, ...CLINIC_PHRASES].filter((p) =>
                          spFilter === ""
                            ? true
                            : p.trigger.toLowerCase().includes(spFilter) ||
                              p.title.toLowerCase().includes(spFilter),
                        ).length === 0 && (
                          <p className="px-3 py-2 text-xs text-muted-foreground">
                            No matching phrases
                          </p>
                        )}
                        <button
                          type="button"
                          data-ocid={`encounter.smartphrase.${key}.close_button`}
                          onClick={() => setSpActive(null)}
                          className="w-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors text-center border-t border-border"
                        >
                          Dismiss (Esc)
                        </button>
                      </div>
                    )}
                  </div>
                  {!isSigned && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Type{" "}
                      <code className="bg-muted px-1 rounded text-xs">.</code>{" "}
                      to insert a SmartPhrase
                    </p>
                  )}
                  {key === "subjective" && (
                    <DiffDxPanel
                      subjective={soap.subjective}
                      onUse={(code, name) =>
                        setSoap((prev) => ({
                          ...prev,
                          assessment: prev.assessment
                            ? `${prev.assessment}\n${code} - ${name}`
                            : `${code} - ${name}`,
                        }))
                      }
                      disabled={isSigned}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
