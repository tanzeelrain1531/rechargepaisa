import { InpatientCapacityStats } from "@/components/inpatient/InpatientCapacityStats";
import { Skeleton } from "@/components/ui/skeleton";
import { WardSection } from "../components/inpatient/WardSection";
import {
  InpatientProvider,
  useInpatientContext,
} from "../contexts/InpatientContext";

function InpatientInner() {
  const {
    wards,
    globalAdmitOpen,
    setGlobalAdmitOpen,
    globalAdmitForm,
    setGlobalAdmitForm,
    handleGlobalAdmit,
  } = useInpatientContext();

  return (
    <div className="space-y-5" data-ocid="inpatient.page">
      {/* Global Admit Patient Form */}
      <div
        className="bg-card border border-border rounded-sm overflow-hidden"
        data-ocid="inpatient.global-admit.panel"
      >
        <button
          type="button"
          data-ocid="inpatient.global-admit.open_modal_button"
          onClick={() => setGlobalAdmitOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="text-sm font-semibold text-foreground">
              Admit New Patient
            </span>
            <span className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded-sm font-medium">
              Select Ward &amp; Bed
            </span>
          </div>
          <svg
            className={`w-4 h-4 text-muted-foreground transition-transform ${globalAdmitOpen ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {globalAdmitOpen && (
          <div className="px-4 pb-4 pt-1 border-t border-border bg-muted/10 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                {
                  id: "ga-name",
                  label: "Patient Name",
                  key: "patientName" as const,
                  placeholder: "Full name",
                },
                {
                  id: "ga-age",
                  label: "Age",
                  key: "age" as const,
                  placeholder: "e.g. 64",
                },
                {
                  id: "ga-diag",
                  label: "Diagnosis",
                  key: "diagnosis" as const,
                  placeholder: "Primary diagnosis...",
                },
                {
                  id: "ga-physician",
                  label: "Attending Physician",
                  key: "attendingPhysician" as const,
                  placeholder: "Dr. Name",
                },
              ].map(({ id, label, key, placeholder }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                  >
                    {label}
                  </label>
                  <input
                    type="text"
                    id={id}
                    data-ocid={`inpatient.global-admit.${key.toLowerCase()}.input`}
                    value={globalAdmitForm[key]}
                    onChange={(e) =>
                      setGlobalAdmitForm((f) => ({
                        ...f,
                        [key]: e.target.value,
                      }))
                    }
                    placeholder={placeholder}
                    className="w-full h-8 px-2.5 text-sm bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring"
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="ga-ward"
                  className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                >
                  Ward
                </label>
                <select
                  id="ga-ward"
                  data-ocid="inpatient.global-admit.ward.select"
                  value={globalAdmitForm.wardId}
                  onChange={(e) =>
                    setGlobalAdmitForm((f) => ({
                      ...f,
                      wardId: e.target.value,
                      bedNumber: "",
                    }))
                  }
                  className="w-full h-8 px-2 text-sm bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring"
                >
                  <option value="">Select ward...</option>
                  {wards.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="ga-bed"
                  className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                >
                  Bed
                </label>
                <select
                  id="ga-bed"
                  data-ocid="inpatient.global-admit.bed.select"
                  value={globalAdmitForm.bedNumber}
                  onChange={(e) =>
                    setGlobalAdmitForm((f) => ({
                      ...f,
                      bedNumber: e.target.value,
                    }))
                  }
                  className="w-full h-8 px-2 text-sm bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring"
                  disabled={!globalAdmitForm.wardId}
                >
                  <option value="">Select bed...</option>
                  {(
                    wards.find((w) => w.id === globalAdmitForm.wardId)?.beds ??
                    []
                  )
                    .filter((b) => b.status === "available")
                    .map((b) => (
                      <option key={b.number} value={b.number}>
                        {b.number}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                data-ocid="inpatient.global-admit.submit_button"
                onClick={handleGlobalAdmit}
                className="h-8 px-4 rounded-sm text-sm font-semibold text-white"
                style={{ background: "var(--primary)" }}
              >
                Confirm Admission
              </button>
              <button
                type="button"
                data-ocid="inpatient.global-admit.cancel_button"
                onClick={() => setGlobalAdmitOpen(false)}
                className="h-8 px-3 rounded-sm text-sm font-medium text-muted-foreground border border-border hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Capacity Overview */}
      <InpatientCapacityStats wards={wards} />

      {/* Ward Sections */}
      {wards.map((ward) => (
        <WardSection key={ward.id} wardId={ward.id} />
      ))}
    </div>
  );
}

export default function Inpatient() {
  return (
    <InpatientProvider>
      <InpatientInner />
    </InpatientProvider>
  );
}
