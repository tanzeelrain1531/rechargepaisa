import { useInpatientContext } from "../../contexts/InpatientContext";
import { BedCard } from "./BedCard";

export function WardSection({ wardId }: { wardId: string }) {
  const { wards, admitForm, setAdmitForm, handleAdmit } = useInpatientContext();
  const ward = wards.find((w) => w.id === wardId);
  if (!ward) return null;

  const wardOccupied = ward.beds.filter((b) => b.status === "occupied").length;
  const wardAvail = ward.beds.filter((b) => b.status === "available").length;
  const isAdmitting = admitForm?.wardId === ward.id;

  return (
    <section
      className="bg-card border border-border rounded-sm overflow-hidden"
      data-ocid={`inpatient.${ward.id}.panel`}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-border"
        style={{ background: "var(--muted)" }}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground">{ward.name}</h2>
          <span className="text-xs text-muted-foreground">
            {ward.beds.length} beds &mdash; {wardOccupied} occupied, {wardAvail}{" "}
            available
          </span>
        </div>
        {wardAvail > 0 && (
          <button
            type="button"
            data-ocid={`inpatient.${ward.id}.admit.button`}
            onClick={() =>
              setAdmitForm(
                isAdmitting
                  ? null
                  : { wardId: ward.id, name: "", diagnosis: "" },
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-medium text-white"
            style={{
              background: "var(--primary)",
              border: "1px solid var(--primary)",
            }}
          >
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Admit Patient
          </button>
        )}
      </div>

      {/* Quick Admit Form */}
      {isAdmitting && admitForm && (
        <div className="px-4 py-3 border-b border-border bg-muted/20">
          <p className="text-xs font-semibold text-foreground mb-2">
            Admit Patient to {ward.name}
          </p>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label
                htmlFor={`admit-name-${ward.id}`}
                className="block text-xs text-muted-foreground mb-0.5"
              >
                Patient Name
              </label>
              <input
                id={`admit-name-${ward.id}`}
                type="text"
                data-ocid={`inpatient.${ward.id}.admit.name.input`}
                value={admitForm.name}
                onChange={(e) =>
                  setAdmitForm((f) => (f ? { ...f, name: e.target.value } : f))
                }
                placeholder="Full name"
                className="w-full h-7 px-2 text-xs bg-background border border-input rounded-sm focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor={`admit-diag-${ward.id}`}
                className="block text-xs text-muted-foreground mb-0.5"
              >
                Diagnosis
              </label>
              <input
                id={`admit-diag-${ward.id}`}
                type="text"
                data-ocid={`inpatient.${ward.id}.admit.diagnosis.input`}
                value={admitForm.diagnosis}
                onChange={(e) =>
                  setAdmitForm((f) =>
                    f ? { ...f, diagnosis: e.target.value } : f,
                  )
                }
                placeholder="Primary diagnosis"
                className="w-full h-7 px-2 text-xs bg-background border border-input rounded-sm focus:outline-none"
              />
            </div>
            <button
              type="button"
              data-ocid={`inpatient.${ward.id}.admit.submit_button`}
              onClick={handleAdmit}
              className="h-7 px-3 text-xs font-semibold text-white rounded-sm"
              style={{ background: "var(--primary)" }}
            >
              Admit
            </button>
            <button
              type="button"
              data-ocid={`inpatient.${ward.id}.admit.cancel_button`}
              onClick={() => setAdmitForm(null)}
              className="h-7 px-2 text-xs text-muted-foreground border border-border rounded-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bed Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 p-3">
        {ward.beds.map((bed, idx) => (
          <BedCard key={bed.number} ward={ward} bed={bed} idx={idx} />
        ))}
      </div>
    </section>
  );
}
