import { ArrowLeft, CheckCircle, Clock } from "lucide-react";

interface Patient {
  id: bigint;
  name: string;
  mrn: string;
  dateOfBirth: string;
  email: string;
  phone: string;
}

interface Appointment {
  id: bigint;
  status: string;
  patientId: bigint;
  date: string;
  providerId: bigint;
}

interface ActiveMed {
  id: bigint;
  name: string;
  dose: string;
  frequency: string;
  status: string;
  patientId: bigint;
}

function calcAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

interface EncounterHeaderProps {
  patient: Patient | null;
  appointment: Appointment | null;
  activeMeds: ActiveMed[];
  activeAppointmentId: bigint | null;
  isSigned: boolean;
  autosaveStatus: "saved" | "pending" | "idle";
  onBack: () => void;
}

export function EncounterHeader({
  patient,
  appointment,
  activeMeds,
  activeAppointmentId,
  isSigned,
  autosaveStatus,
  onBack,
}: EncounterHeaderProps) {
  return (
    <>
      {/* Back nav */}
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          data-ocid="encounter.back_button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Appointments
        </button>
        {isSigned && (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-success/10 text-success border border-success/20">
            Signed
          </span>
        )}
        {!isSigned && autosaveStatus !== "idle" && (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded border ${
              autosaveStatus === "saved"
                ? "bg-success/10 text-success border-success/25"
                : "bg-muted text-muted-foreground border-border"
            }`}
            data-ocid="encounter.autosave.indicator"
            aria-live="polite"
          >
            {autosaveStatus === "saved" ? (
              <CheckCircle className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
            {autosaveStatus === "saved" ? "All changes saved" : "Saving..."}
          </span>
        )}
      </div>

      {/* Patient Banner */}
      <div
        data-ocid="encounter.panel"
        className="border border-border px-5 py-3 mb-5 flex flex-wrap items-start gap-6 bg-muted/30"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
            Patient
          </p>
          <p className="text-sm font-bold text-foreground">{patient?.name}</p>
          <p className="text-xs text-muted-foreground font-mono">
            {patient?.mrn}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
            Appt Date
          </p>
          <p className="text-sm text-foreground">
            {appointment ? appointment.date.replace("T", " ") : "\u2014"}
          </p>
          <p className="text-xs text-muted-foreground">
            #{String(activeAppointmentId)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
            DOB / Age
          </p>
          <p className="text-sm text-foreground">
            {patient?.dateOfBirth ?? "\u2014"}
          </p>
          <p className="text-xs text-muted-foreground">
            {patient ? `${calcAge(patient.dateOfBirth)} yrs` : "\u2014"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
            Allergies
          </p>
          <p className="text-sm text-foreground font-medium">Review chart</p>
        </div>
        <div className="flex-1 min-w-48">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
            Active Medications
          </p>
          {activeMeds.length > 0 ? (
            <p className="text-xs text-foreground">
              {activeMeds.map((m) => `${m.name} ${m.dose}`).join(" · ")}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">None on file</p>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
            Blood Type
          </p>
          <p className="text-sm text-muted-foreground">\u2014</p>
        </div>
      </div>
    </>
  );
}
