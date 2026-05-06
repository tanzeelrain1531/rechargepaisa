import { Play } from "lucide-react";

export function EncounterTab({
  onStartEncounter,
}: { onStartEncounter: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 space-y-4"
      data-ocid="patient_chart.encounter.panel"
    >
      <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
        <Play className="w-5 h-5 text-primary" />
      </div>
      <div className="text-center">
        <div className="text-base font-semibold text-foreground">
          Start Clinical Encounter
        </div>
        <div className="text-sm text-muted-foreground mt-1 max-w-xs">
          Open the full encounter workflow to document vitals, SOAP notes,
          orders, and prescriptions.
        </div>
      </div>
      <button
        type="button"
        data-ocid="patient_chart.encounter.start_encounter.primary_button"
        onClick={onStartEncounter}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        <Play className="w-4 h-4" />
        Start Encounter
      </button>
    </div>
  );
}
