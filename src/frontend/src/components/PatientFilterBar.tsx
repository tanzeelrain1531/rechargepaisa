import { X } from "lucide-react";

interface PatientFilterBarProps {
  patientName: string;
  onClear: () => void;
}

export function PatientFilterBar({
  patientName,
  onClear,
}: PatientFilterBarProps) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 text-sm border-b bg-primary/5 border-primary/20"
      data-ocid="patient_filter.panel"
    >
      <span className="text-muted-foreground">
        Showing records for{" "}
        <span className="font-semibold text-foreground">{patientName}</span>
      </span>
      <button
        type="button"
        onClick={onClear}
        className="ml-1 inline-flex items-center gap-1 text-xs text-primary hover:text-primary/70 transition-colors underline underline-offset-2"
        data-ocid="patient_filter.close_button"
      >
        <X className="w-3 h-3" />
        clear filter
      </button>
    </div>
  );
}
