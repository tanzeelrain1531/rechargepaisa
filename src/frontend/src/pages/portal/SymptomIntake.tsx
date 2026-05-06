import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useActor } from "../../hooks/useActor";

// Simulated upcoming appointments for check-in selection
const UPCOMING_APPOINTMENTS = [
  {
    id: "appt-1",
    date: "Mar 16, 2026 at 9:00 AM",
    provider: "Dr. Emily Carter",
    reason: "Follow-up visit",
  },
  {
    id: "appt-3",
    date: "Mar 17, 2026 at 2:30 PM",
    provider: "Dr. Michael Ross",
    reason: "Cardiology consult",
  },
  {
    id: "appt-8",
    date: "Mar 19, 2026 at 11:00 AM",
    provider: "Dr. Sarah Kim",
    reason: "Annual physical",
  },
];

const SYMPTOMS = [
  "Fever",
  "Cough",
  "Shortness of breath",
  "Fatigue",
  "Nausea",
  "Headache",
  "Chest pain",
  "Dizziness",
  "Abdominal pain",
  "Joint pain",
  "Rash",
  "Sore throat",
];

const DURATION_OPTIONS = [
  { value: "today", label: "Just today" },
  { value: "1-3d", label: "1\u20133 days" },
  { value: "4-7d", label: "4\u20137 days" },
  { value: "1-2w", label: "1\u20132 weeks" },
  { value: "2w+", label: "More than 2 weeks" },
];

export default function SymptomIntake() {
  const { actor } = useActor();
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState(3);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(
    UPCOMING_APPOINTMENTS[0]?.id ?? "",
  );
  const [duration, setDuration] = useState("");
  const [currentMeds, setCurrentMeds] = useState("");
  const [allergies, setAllergies] = useState("");
  const [recentChanges, setRecentChanges] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  const handleSubmit = async () => {
    if (!chiefComplaint.trim()) return;
    const payload = {
      chiefComplaint,
      symptoms: selectedSymptoms,
      severity,
      duration,
      currentMeds,
      allergies,
      recentChanges,
      additionalNotes,
      checkedIn: true,
      submittedAt: new Date().toISOString(),
    };
    // Save to localStorage keyed by appointment ID for encounter workflow
    const apptKey = selectedAppointmentId || "general";
    localStorage.setItem(`previsit_intake_${apptKey}`, JSON.stringify(payload));
    try {
      if (actor) {
        await actor.createClinicalNote(
          BigInt(1),
          "symptom-intake",
          JSON.stringify(payload),
          BigInt(10),
        );
      }
    } catch {
      // best-effort; don't block UX
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setChiefComplaint("");
    setSelectedSymptoms([]);
    setSeverity(3);
    setDuration("");
    setCurrentMeds("");
    setAllergies("");
    setRecentChanges("");
    setAdditionalNotes("");
    setSubmitted(false);
  };

  const severityLabel = (v: number) => {
    if (v <= 2) return "Mild";
    if (v <= 4) return "Moderate";
    if (v <= 6) return "Significant";
    if (v <= 8) return "Severe";
    return "Very Severe";
  };

  const severityColor = (v: number) => {
    if (v <= 3) return "var(--success)";
    if (v <= 6) return "var(--warning)";
    return "var(--destructive)";
  };

  if (submitted) {
    return (
      <div
        className="max-w-lg mx-auto mt-12"
        data-ocid="symptoms.success_state"
      >
        <div className="bg-card border border-border rounded-sm px-8 py-10 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-success/10">
            <svg
              className="w-7 h-7 text-success"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-foreground">
              You're Checked In! ✓
            </h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Your pre-visit information has been submitted and your care team
              will review it before your appointment.
            </p>
          </div>
          {(() => {
            const appt = UPCOMING_APPOINTMENTS.find(
              (a) => a.id === selectedAppointmentId,
            );
            return appt ? (
              <div className="w-full bg-muted/40 rounded-sm p-3 text-left text-sm space-y-1">
                <p className="font-semibold text-foreground">{appt.date}</p>
                <p className="text-muted-foreground">{appt.provider}</p>
                <p className="text-muted-foreground">{appt.reason}</p>
              </div>
            ) : null;
          })()}
          <button
            type="button"
            data-ocid="symptoms.reset.button"
            onClick={handleReset}
            className="mt-2 px-5 py-2 rounded-sm text-sm font-medium text-muted-foreground border border-border hover:text-foreground transition-colors"
          >
            Submit another intake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl" data-ocid="symptoms.page">
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
        Please complete this form before your upcoming visit. Your care team
        will review your responses.
      </p>

      <div className="space-y-5">
        {/* Appointment Selection */}
        <div className="bg-card border border-border rounded-sm p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Check In For Appointment
          </h3>
          <div
            className="space-y-2"
            role="radiogroup"
            aria-label="Select appointment"
          >
            {UPCOMING_APPOINTMENTS.map((a) => {
              const selected = selectedAppointmentId === a.id;
              const inputId = `appt-radio-${a.id}`;
              return (
                <label
                  key={a.id}
                  htmlFor={inputId}
                  data-ocid={`symptoms.appointment.${a.id}.toggle`}
                  className={`flex items-start gap-3 p-3 rounded-sm cursor-pointer transition-all border ${
                    selected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/30"
                  }`}
                >
                  <input
                    id={inputId}
                    type="radio"
                    name="appointment"
                    value={a.id}
                    checked={selected}
                    onChange={() => setSelectedAppointmentId(a.id)}
                    className="sr-only"
                  />
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                      selected
                        ? "border-primary bg-primary"
                        : "border-border bg-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    {selected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {a.date}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {a.provider} — {a.reason}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Chief Complaint */}
        <div className="bg-card border border-border rounded-sm p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Chief Complaint
          </h3>
          <label
            htmlFor="chief-complaint"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            What is the main reason for your visit today?
          </label>
          <input
            id="chief-complaint"
            type="text"
            data-ocid="symptoms.complaint.input"
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            placeholder="e.g., chest tightness and shortness of breath for 3 days"
            className="w-full h-9 px-3 text-sm bg-background border border-input rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Symptoms */}
        <div className="bg-card border border-border rounded-sm p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Current Symptoms
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Select all that apply:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {SYMPTOMS.map((symptom) => {
              const checked = selectedSymptoms.includes(symptom);
              return (
                <button
                  key={symptom}
                  type="button"
                  data-ocid={`symptoms.${symptom.toLowerCase().replace(/\s+/g, "-")}.toggle`}
                  onClick={() => toggleSymptom(symptom)}
                  className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm font-medium text-left transition-all border"
                  style={{
                    borderColor: checked ? "var(--accent)" : "var(--border)",
                    background: checked ? "var(--background)" : "transparent",
                    color: checked
                      ? "var(--foreground)"
                      : "var(--muted-foreground)",
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0"
                    style={{
                      background: checked ? "var(--accent)" : "var(--muted)",
                      border: checked ? "none" : "1px solid var(--border)",
                    }}
                  >
                    {checked && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        aria-hidden="true"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </span>
                  {symptom}
                </button>
              );
            })}
          </div>
        </div>

        {/* Severity */}
        <div className="bg-card border border-border rounded-sm p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Symptom Severity
          </h3>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">
              How severe are your symptoms?
            </p>
            <span
              className="text-sm font-bold"
              style={{ color: severityColor(severity) }}
            >
              {severity}/10 &mdash; {severityLabel(severity)}
            </span>
          </div>
          <input
            type="range"
            id="severity-slider"
            data-ocid="symptoms.severity.input"
            min={1}
            max={10}
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            className="w-full"
            aria-label="Symptom severity"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1 &#8212; Mild</span>
            <span>5 &#8212; Moderate</span>
            <span>10 &#8212; Severe</span>
          </div>
        </div>

        {/* Duration */}
        <div className="bg-card border border-border rounded-sm p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Duration
          </h3>
          <label
            htmlFor="symptom-duration"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            How long have you had these symptoms?
          </label>
          <select
            id="symptom-duration"
            data-ocid="symptoms.duration.select"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full h-9 px-3 text-sm bg-background border border-input rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select duration...</option>
            {DURATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Current Meds & Allergies */}
        <div className="bg-card border border-border rounded-sm p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Medications &amp; Allergies
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="current-meds"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Current medications
              </label>
              <textarea
                id="current-meds"
                data-ocid="symptoms.medications.textarea"
                value={currentMeds}
                onChange={(e) => setCurrentMeds(e.target.value)}
                rows={3}
                placeholder="List all current medications and doses..."
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>
            <div>
              <label
                htmlFor="known-allergies"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Known allergies
              </label>
              <textarea
                id="known-allergies"
                data-ocid="symptoms.allergies.textarea"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                rows={3}
                placeholder="List any known drug or food allergies..."
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>
          </div>
        </div>

        {/* Recent Changes */}
        <div className="bg-card border border-border rounded-sm p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Recent Changes
          </h3>
          <label
            htmlFor="recent-changes"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Any recent changes? (new medications, travel, unusual stress,
            dietary changes, etc.)
          </label>
          <textarea
            id="recent-changes"
            data-ocid="symptoms.recent-changes.textarea"
            value={recentChanges}
            onChange={(e) => setRecentChanges(e.target.value)}
            rows={3}
            placeholder="Describe any recent changes that may be relevant..."
            className="w-full px-3 py-2 text-sm bg-background border border-input rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>

        {/* Additional Notes */}
        <div className="bg-card border border-border rounded-sm p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Additional Notes
          </h3>
          <label
            htmlFor="additional-notes"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Anything else you&#39;d like your care team to know?
          </label>
          <textarea
            id="additional-notes"
            data-ocid="symptoms.notes.textarea"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={3}
            placeholder="Any additional information for your provider..."
            className="w-full px-3 py-2 text-sm bg-background border border-input rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="symptoms.submit_button"
            onClick={handleSubmit}
            disabled={!chiefComplaint.trim()}
            className="px-6 py-2.5 rounded-sm text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: "var(--accent)" }}
          >
            Submit Intake Form
          </button>
          <p className="text-xs text-muted-foreground">
            Chief complaint is required to submit
          </p>
        </div>
      </div>
    </div>
  );
}
