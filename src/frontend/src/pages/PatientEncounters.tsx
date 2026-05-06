import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { DEMO_CLINICAL_NOTES, DEMO_PATIENTS } from "../demoData";

const ENCOUNTER_VISIT_TYPES = [
  "Annual Wellness Visit",
  "Follow-up",
  "Acute Visit",
  "Chronic Disease Management",
  "Post-Hospital Follow-up",
  "Preventive Care",
  "Urgent Care",
  "Consultation",
];

const PROVIDERS = [
  "Dr. Jordan Lee",
  "Dr. Sarah Chen",
  "Dr. Michael Torres",
  "Dr. Lisa Park",
];

const CHIEF_COMPLAINTS: Record<number, string> = {
  1: "Diabetes follow-up, medication review",
  2: "Shortness of breath, lower extremity edema",
  3: "Fatigue, weight gain, thyroid check",
  4: "Annual physical, lipid panel review",
  5: "Allergic rhinitis, seasonal symptoms",
  6: "Worsening dyspnea, productive cough",
  7: "Back pain, osteoporosis management",
  8: "Uncontrolled blood pressure, anxiety",
  9: "Fatigue, worsening anemia",
  10: "Increased rescue inhaler use, asthma review",
};

const DIAGNOSES: Record<number, string> = {
  1: "Type 2 Diabetes Mellitus (E11.9), Hypertension (I10)",
  2: "Acute CHF Exacerbation (I50.9), Hypokalemia (E87.6)",
  3: "Hypothyroidism (E03.9), Fatigue (R53.83)",
  4: "Dyslipidemia (E78.5), Obesity (E66.9)",
  5: "Allergic Rhinitis (J30.9), Asthma (J45.909)",
  6: "COPD Exacerbation (J44.1), Emphysema (J43.9)",
  7: "Osteoporosis (M81.0), Hypothyroidism (E03.9)",
  8: "Essential Hypertension (I10), GAD (F41.1)",
  9: "CKD Stage 3 (N18.3), Anemia of CKD (D63.1)",
  10: "Uncontrolled Asthma (J45.51), Allergic Rhinitis (J30.9)",
};

const NOTE_DATES = [
  "2026-03-13",
  "2026-03-07",
  "2026-02-28",
  "2026-02-20",
  "2026-02-13",
  "2026-01-29",
  "2026-01-14",
  "2025-12-31",
  "2025-12-16",
  "2025-12-01",
];

interface PatientEncountersProps {
  activePatientId?: bigint;
  activePatientName?: string;
  onNavigate?: (page: string) => void;
}

export default function PatientEncounters({
  activePatientId,
  activePatientName,
  onNavigate,
}: PatientEncountersProps) {
  const [expandedId, setExpandedId] = useState<bigint | null>(null);

  const mrn = useMemo(() => {
    if (!activePatientId) return "";
    return DEMO_PATIENTS.find((p) => p.id === activePatientId)?.mrn ?? "";
  }, [activePatientId]);

  const encounters = useMemo(() => {
    if (!activePatientId) return [];
    return DEMO_CLINICAL_NOTES.filter((n) => n.patientId === activePatientId)
      .map((note, i) => ({
        id: note.id,
        date:
          NOTE_DATES[Number(note.id) - 1] ??
          `2025-${String(12 - i).padStart(2, "0")}-01`,
        provider: PROVIDERS[Number(note.id) % PROVIDERS.length],
        visitType:
          ENCOUNTER_VISIT_TYPES[Number(note.id) % ENCOUNTER_VISIT_TYPES.length],
        chiefComplaint:
          CHIEF_COMPLAINTS[Number(note.id)] ?? "General consultation",
        diagnosis: DIAGNOSES[Number(note.id)] ?? "See note",
        noteType: note.noteType,
        content: note.content,
        status: "Signed",
      }))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [activePatientId]);

  if (!activePatientId) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 text-center"
        data-ocid="patient_encounters.empty_state"
      >
        <ClipboardList className="w-10 h-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">
          No patient selected
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Open a patient from the Patients page to view their encounters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0" data-ocid="patient_encounters.page">
      {/* In-page patient context subheader */}
      {activePatientName && (
        <div className="bg-muted/30 border-b px-6 py-2 text-sm flex items-center gap-2 -mx-6 mb-4">
          <span className="font-semibold text-foreground">
            {activePatientName}
          </span>
          {mrn && <span className="text-muted-foreground text-xs">{mrn}</span>}
          <span className="text-muted-foreground/40 text-xs">›</span>
          <span className="text-muted-foreground text-xs">Encounters</span>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {encounters.length} encounter{encounters.length !== 1 ? "s" : ""} on
            record
            {activePatientName ? ` for ${activePatientName}` : ""}
          </p>
          <Button
            size="sm"
            variant="outline"
            data-ocid="patient_encounters.new_encounter.button"
            onClick={() => onNavigate?.("encounter")}
            className="h-7 text-xs"
          >
            Start New Encounter
            <ExternalLink className="w-3 h-3 ml-1.5" />
          </Button>
        </div>

        {encounters.length === 0 ? (
          <div
            className="py-16 text-center"
            data-ocid="patient_encounters.list.empty_state"
          >
            <ClipboardList className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No encounters recorded for this patient
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {encounters.length === 0 && (
              <div
                data-ocid="patient_encounters.loading_state"
                className="space-y-2"
              >
                {[1, 2, 3].map((n) => (
                  <Skeleton key={n} className="h-24 w-full rounded-md" />
                ))}
              </div>
            )}
            {encounters.map((enc, i) => {
              const isExpanded = expandedId === enc.id;
              return (
                <Card
                  key={String(enc.id)}
                  data-ocid={`patient_encounters.item.${i + 1}`}
                  className="border border-border shadow-card bg-card"
                >
                  <CardHeader className="px-4 py-3 pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">
                            {enc.visitType}
                          </span>
                          <StatusBadge variant="success" label={enc.status} />
                          <StatusBadge variant="neutral" label={enc.noteType} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {enc.provider} ·{" "}
                          {new Date(enc.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          data-ocid={`patient_encounters.open_note.button.${i + 1}`}
                          onClick={() => onNavigate?.("notes")}
                          className="h-7 text-xs"
                        >
                          Open Note
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-3 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Chief Complaint
                        </span>
                        <p className="text-xs text-foreground mt-0.5">
                          {enc.chiefComplaint}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Diagnosis
                        </span>
                        <p className="text-xs text-foreground mt-0.5">
                          {enc.diagnosis}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      data-ocid={`patient_encounters.expand.button.${i + 1}`}
                      onClick={() => setExpandedId(isExpanded ? null : enc.id)}
                      className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      {isExpanded ? "Hide note ↑" : "View SOAP note ↓"}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 border-t border-border pt-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                          Note
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {enc.content}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
