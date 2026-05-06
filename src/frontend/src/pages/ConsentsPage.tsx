import { ConsentsTab } from "@/components/patients/ConsentsTab";
import { PatientFilterBar } from "../components/PatientFilterBar";

export default function ConsentsPage({
  activePatientId,
  activePatientName,
  onClearFilter,
}: {
  activePatientId?: bigint;
  activePatientName?: string;
  onClearFilter?: () => void;
}) {
  const patientId = activePatientId ?? 1n;
  const patientName = activePatientName ?? "Demo Patient";

  return (
    <div className="p-5" data-ocid="consents.page">
      {activePatientId && activePatientName && (
        <PatientFilterBar
          patientName={activePatientName}
          onClear={onClearFilter ?? (() => {})}
        />
      )}
      <ConsentsTab patientId={patientId} patientName={patientName} />
    </div>
  );
}
