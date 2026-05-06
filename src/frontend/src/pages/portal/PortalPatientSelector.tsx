import { DEMO_PATIENTS } from "@/demoData";
import { Calendar, User } from "lucide-react";
import type { PortalPatient } from "../../contexts/PortalContext";

function formatDOB(dob: string): string {
  const d = new Date(`${dob}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface Props {
  onSelect: (patient: PortalPatient) => void;
}

export default function PortalPatientSelector({ onSelect }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 flex-shrink-0 flex items-center px-6 gap-3 bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex items-center justify-center">
            <img
              src="/assets/generated/medunite-logo-transparent.dim_48x48.png"
              alt="MedUnite"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight leading-none text-sidebar-foreground">
              MedUnite
            </p>
            <p className="text-xs mt-0.5 tracking-wider text-white/50">
              Patient Portal
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
              <User className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Select Your Profile
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose a patient to access the portal experience.
            </p>
          </div>

          {/* Patient grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            data-ocid="portal_selector.list"
          >
            {DEMO_PATIENTS.map((patient, idx) => {
              const initials = getInitials(patient.name);
              return (
                <button
                  key={String(patient.id)}
                  type="button"
                  data-ocid={`portal_selector.item.${idx + 1}`}
                  onClick={() =>
                    onSelect({
                      id: patient.id,
                      name: patient.name,
                      mrn: patient.mrn,
                      dateOfBirth: patient.dateOfBirth,
                    })
                  }
                  className="group text-left flex items-start gap-3 p-4 rounded border border-border bg-card shadow-sm transition-all hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded bg-primary/10 text-primary text-sm font-bold">
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {patient.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                      {patient.mrn}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">
                        {formatDOB(patient.dateOfBirth)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Demo mode — select any patient to preview their portal experience.
          </p>
        </div>
      </main>
    </div>
  );
}
