import { Input } from "@/components/ui/input";

type VitalsKey = "bp" | "hr" | "temp" | "weight" | "spo2" | "rr";

interface VitalsState {
  bp: string;
  hr: string;
  temp: string;
  weight: string;
  spo2: string;
  rr: string;
}

interface CdsAlert {
  id: string;
  message: string;
  dismissed: boolean;
}

interface EncounterVitalsProps {
  vitals: VitalsState;
  setVitals: React.Dispatch<React.SetStateAction<VitalsState>>;
  cdsAlerts: CdsAlert[];
  setCdsAlerts: React.Dispatch<React.SetStateAction<CdsAlert[]>>;
  isSigned: boolean;
  checkVitalsAlerts: (key: string, value: string) => void;
}

const VITALS_FIELDS: Array<{
  key: VitalsKey;
  label: string;
  unit: string;
  placeholder: string;
}> = [
  { key: "bp", label: "BP", unit: "mmHg", placeholder: "120/80" },
  { key: "hr", label: "HR", unit: "bpm", placeholder: "72" },
  { key: "temp", label: "Temp", unit: "°F", placeholder: "98.6" },
  { key: "weight", label: "Weight", unit: "lbs", placeholder: "160" },
  { key: "spo2", label: "SpO₂", unit: "%", placeholder: "98" },
  { key: "rr", label: "RR", unit: "br/min", placeholder: "16" },
];

export function EncounterVitals({
  vitals,
  setVitals,
  cdsAlerts,
  setCdsAlerts,
  isSigned,
  checkVitalsAlerts,
}: EncounterVitalsProps) {
  return (
    <section className="border border-border bg-card mb-5">
      <div className="px-4 py-2 border-b border-border bg-muted/20">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Vitals
        </h2>
      </div>
      <div className="px-4 py-3">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {VITALS_FIELDS.map(({ key, label, unit, placeholder }) => (
            <div key={key}>
              <label
                htmlFor={`vitals-${key}`}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
              >
                {label}
                <span className="text-muted-foreground/60 ml-1 normal-case font-normal">
                  {unit}
                </span>
              </label>
              <Input
                id={`vitals-${key}`}
                data-ocid={`encounter.vitals.${key}.input`}
                value={vitals[key]}
                onChange={(e) =>
                  setVitals((prev) => ({ ...prev, [key]: e.target.value }))
                }
                onBlur={(e) => checkVitalsAlerts(key, e.target.value)}
                placeholder={placeholder}
                disabled={isSigned}
                className="h-8 text-sm font-mono"
              />
            </div>
          ))}
        </div>

        {/* CDS Vitals Alerts */}
        {cdsAlerts.filter((a) => !a.dismissed).length > 0 && (
          <div
            className="mt-3 space-y-2"
            data-ocid="encounter.vitals.cds.panel"
          >
            {cdsAlerts
              .filter((a) => !a.dismissed)
              .map((alert) => (
                <div
                  key={alert.id}
                  data-ocid={`encounter.vitals.${alert.id}.error_state`}
                  className="flex items-start gap-2 px-3 py-2.5 bg-warning/10 border border-warning/30 text-warning rounded-sm"
                  role="alert"
                >
                  <span className="flex-1 text-xs leading-relaxed">
                    {alert.message}
                  </span>
                  <button
                    type="button"
                    aria-label="Dismiss alert"
                    onClick={() =>
                      setCdsAlerts((prev) =>
                        prev.map((a) =>
                          a.id === alert.id ? { ...a, dismissed: true } : a,
                        ),
                      )
                    }
                    className="flex-shrink-0 text-warning hover:text-warning/80 transition-colors text-sm font-bold leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
