import {
  AlertTriangle,
  CalendarCheck,
  FileText,
  FlaskConical,
  Pill,
  Play,
} from "lucide-react";
import {
  DEMO_APPOINTMENTS,
  DEMO_CLINICAL_NOTES,
  DEMO_LAB_RESULTS,
  DEMO_MEDICATIONS,
} from "../../demoData";

interface PatientSummaryTabProps {
  patient: { id: bigint; name: string; mrn: string; dateOfBirth: string };
  onStartEncounter: () => void;
}

export function PatientSummaryTab({
  patient,
  onStartEncounter,
}: PatientSummaryTabProps) {
  const pid = patient.id;
  const meds = DEMO_MEDICATIONS.filter(
    (m) => m.patientId === pid && m.status === "active",
  );
  const labs = DEMO_LAB_RESULTS.filter((l) => l.patientId === pid);
  const criticalLabs = labs.filter((l) => l.isCritical);
  const notes = DEMO_CLINICAL_NOTES.filter((n) => n.patientId === pid);
  const upcoming = DEMO_APPOINTMENTS.filter(
    (a) => a.patientId === pid && a.status === "scheduled",
  );

  return (
    <div className="space-y-5 p-1" data-ocid="patient_chart.summary.panel">
      {/* Quick stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Pill className="w-3.5 h-3.5" />
            Active Medications
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {meds.length}
          </div>
        </div>
        <div className="bg-card border border-border p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FlaskConical className="w-3.5 h-3.5" />
            Lab Results
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {labs.length}
          </div>
          {criticalLabs.length > 0 && (
            <div className="text-xs font-semibold text-destructive">
              {criticalLabs.length} critical
            </div>
          )}
        </div>
        <div className="bg-card border border-border p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileText className="w-3.5 h-3.5" />
            Clinical Notes
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {notes.length}
          </div>
        </div>
        <div className="bg-card border border-border p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarCheck className="w-3.5 h-3.5" />
            Upcoming Visits
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {upcoming.length}
          </div>
        </div>
      </div>

      {/* Active medications */}
      <div className="bg-card border border-border">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Pill className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">
            Active Medications
          </span>
        </div>
        <div className="divide-y divide-border">
          {meds.length === 0 ? (
            <div className="px-4 py-4 text-xs text-muted-foreground">
              No active medications
            </div>
          ) : (
            meds.slice(0, 5).map((med) => (
              <div
                key={String(med.id)}
                className="px-4 py-2.5 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-medium text-foreground">
                    {med.name}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {med.dose} · {med.frequency}
                  </span>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-success/10 text-success border border-success/30">
                  Active
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Critical labs */}
      {criticalLabs.length > 0 && (
        <div className="bg-card border border-destructive/40">
          <div className="px-4 py-3 border-b border-destructive/20 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
            <span className="text-sm font-semibold text-destructive">
              Critical Lab Results
            </span>
          </div>
          <div className="divide-y divide-border">
            {criticalLabs.map((lab) => (
              <div
                key={String(lab.id)}
                className="px-4 py-2.5 flex items-center justify-between"
              >
                <span className="text-xs font-medium text-foreground">
                  {lab.testName}
                </span>
                <span className="text-xs font-semibold text-destructive">
                  {lab.result} {lab.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent notes */}
      <div className="bg-card border border-border">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">
            Recent Clinical Notes
          </span>
        </div>
        <div className="divide-y divide-border">
          {notes.length === 0 ? (
            <div className="px-4 py-4 text-xs text-muted-foreground">
              No clinical notes
            </div>
          ) : (
            notes.slice(0, 3).map((note) => (
              <div key={String(note.id)} className="px-4 py-2.5">
                <div className="text-xs font-medium text-foreground">
                  {note.noteType}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {note.content.slice(0, 120)}
                  {note.content.length > 120 ? "..." : ""}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Start encounter CTA */}
      <div className="bg-primary/5 border border-primary/20 px-5 py-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-foreground">
            Start New Encounter
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Open the clinical encounter workflow for {patient.name}
          </div>
        </div>
        <button
          type="button"
          data-ocid="patient_chart.start_encounter.primary_button"
          onClick={onStartEncounter}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
        >
          <Play className="w-3.5 h-3.5" />
          Start Encounter
        </button>
      </div>
    </div>
  );
}
