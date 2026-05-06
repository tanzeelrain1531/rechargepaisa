import { StatusBadge } from "@/components/StatusBadge";
import { DEMO_VITALS } from "@/demoData";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { usePortalContext } from "../../contexts/PortalContext";

type ReadingType = "Blood Pressure" | "Weight" | "Blood Glucose" | "Heart Rate";

interface VitalReading {
  id: string;
  date: string;
  time: string;
  type: ReadingType;
  value: string;
  unit: string;
  notes: string;
}

const READING_CONFIGS: Record<
  ReadingType,
  { placeholder: string; unit: string }
> = {
  "Blood Pressure": {
    placeholder: "e.g. 118/76",
    unit: "mmHg",
  },
  Weight: { placeholder: "e.g. 165.4", unit: "lbs" },
  "Blood Glucose": {
    placeholder: "e.g. 98",
    unit: "mg/dL",
  },
  "Heart Rate": { placeholder: "e.g. 72", unit: "bpm" },
};

function getStatusVariant(
  type: ReadingType,
  value: string,
): "success" | "warning" | "danger" | "neutral" {
  if (type === "Blood Pressure") {
    const parts = value.split("/").map(Number);
    if (parts.length !== 2) return "neutral";
    const [sys, dia] = parts;
    if ((sys ?? 0) >= 140 || (dia ?? 0) >= 90) return "danger";
    if ((sys ?? 0) >= 130 || (dia ?? 0) >= 80) return "warning";
    return "success";
  }
  if (type === "Blood Glucose") {
    const n = Number(value);
    if (n > 180 || n < 70) return "danger";
    if (n > 140) return "warning";
    return "success";
  }
  if (type === "Heart Rate") {
    const n = Number(value);
    if (n > 100 || n < 50) return "warning";
    return "success";
  }
  return "neutral";
}

/** Convert DEMO_VITALS records (multi-field) to flat VitalReading rows */
function demovitalsToReadings(patientId: bigint): VitalReading[] {
  const rows: VitalReading[] = [];
  const patientVitals = DEMO_VITALS.filter((v) => v.patientId === patientId);
  for (const v of patientVitals) {
    const dateStr = v.date;
    rows.push({
      id: `${String(v.id)}-bp`,
      date: dateStr,
      time: "08:00",
      type: "Blood Pressure",
      value: v.bp,
      unit: "mmHg",
      notes: "",
    });
    rows.push({
      id: `${String(v.id)}-hr`,
      date: dateStr,
      time: "08:00",
      type: "Heart Rate",
      value: String(v.hr),
      unit: "bpm",
      notes: "",
    });
    rows.push({
      id: `${String(v.id)}-wt`,
      date: dateStr,
      time: "07:30",
      type: "Weight",
      // convert kg to lbs
      value: (v.weight * 2.205).toFixed(1),
      unit: "lbs",
      notes: "",
    });
  }
  // sort descending by date
  rows.sort((a, b) => (a.date < b.date ? 1 : -1));
  return rows;
}

export default function MyVitals() {
  const { id: PORTAL_PATIENT_ID } = usePortalContext();
  const seedVitals = useMemo(
    () => demovitalsToReadings(PORTAL_PATIENT_ID),
    [PORTAL_PATIENT_ID],
  );
  const [sessionReadings, setSessionReadings] = useState<VitalReading[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0] ?? "",
    time: new Date().toTimeString().slice(0, 5),
    type: "Blood Pressure" as ReadingType,
    value: "",
    notes: "",
  });

  const vitals = useMemo(
    () => [...sessionReadings, ...seedVitals],
    [sessionReadings, seedVitals],
  );

  const handleSubmit = () => {
    if (!form.date || !form.value.trim()) {
      toast.error("Please fill in the date and value.");
      return;
    }
    const cfg = READING_CONFIGS[form.type];
    const newReading: VitalReading = {
      id: `v${Date.now()}`,
      date: form.date,
      time: form.time,
      type: form.type,
      value: form.value.trim(),
      unit: cfg.unit,
      notes: form.notes,
    };
    setSessionReadings((prev) => [newReading, ...prev]);
    setForm({
      date: new Date().toISOString().split("T")[0] ?? "",
      time: new Date().toTimeString().slice(0, 5),
      type: "Blood Pressure",
      value: "",
      notes: "",
    });
    setShowForm(false);
    toast.success("Vital reading logged!");
  };

  const cfg = READING_CONFIGS[form.type];

  return (
    <div className="space-y-5" data-ocid="vitals.page">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">My Vitals</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track your home readings between clinic visits.
          </p>
        </div>
        <button
          type="button"
          data-ocid="vitals.log_button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Log New Reading
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div
          className="p-4 bg-card border border-border rounded-sm"
          data-ocid="vitals.form.panel"
        >
          <h3 className="text-xs font-semibold text-foreground mb-3">
            Log New Vital Reading
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label
                htmlFor="vitals-date"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1"
              >
                Date
              </label>
              <input
                id="vitals-date"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                className="w-full h-8 px-2.5 text-sm bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="vitals-time"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1"
              >
                Time
              </label>
              <input
                id="vitals-time"
                type="time"
                value={form.time}
                onChange={(e) =>
                  setForm((p) => ({ ...p, time: e.target.value }))
                }
                className="w-full h-8 px-2.5 text-sm bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="vitals-type"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1"
              >
                Reading Type
              </label>
              <select
                id="vitals-type"
                data-ocid="vitals.type.select"
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    type: e.target.value as ReadingType,
                    value: "",
                  }))
                }
                className="w-full h-8 px-2.5 text-sm bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring"
              >
                <option>Blood Pressure</option>
                <option>Weight</option>
                <option>Blood Glucose</option>
                <option>Heart Rate</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="vitals-value"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1"
              >
                Value ({cfg.unit})
              </label>
              <input
                id="vitals-value"
                type="text"
                data-ocid="vitals.value.input"
                value={form.value}
                onChange={(e) =>
                  setForm((p) => ({ ...p, value: e.target.value }))
                }
                placeholder={cfg.placeholder}
                className="w-full h-8 px-2.5 text-sm bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring"
              />
            </div>
            <div className="col-span-2 sm:col-span-4">
              <label
                htmlFor="vitals-notes"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1"
              >
                Notes (optional)
              </label>
              <input
                id="vitals-notes"
                type="text"
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="e.g. fasting, after exercise, stressed..."
                className="w-full h-8 px-2.5 text-sm bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              data-ocid="vitals.submit_button"
              onClick={handleSubmit}
              className="px-4 py-1.5 rounded-sm text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Save Reading
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-1.5 rounded-sm text-xs font-medium text-muted-foreground border border-border hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Readings table */}
      <div
        className="bg-card border border-border rounded-sm overflow-hidden"
        data-ocid="vitals.table"
      >
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Date
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Time
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Type
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Value
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {vitals.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                  data-ocid="vitals.empty_state"
                >
                  <p className="mb-2">No readings logged yet.</p>
                  <p className="text-xs mb-3">
                    Track your blood pressure, weight, and glucose at home.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    data-ocid="vitals.log.button"
                    className="inline-flex items-center gap-1.5 h-7 px-3 text-xs font-medium bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
                  >
                    Log a Reading
                  </button>
                </td>
              </tr>
            ) : (
              vitals.map((v, idx) => (
                <tr
                  key={v.id}
                  data-ocid={`vitals.item.${idx + 1}`}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-2.5 font-medium text-foreground">
                    {v.date}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {v.time}
                  </td>
                  <td className="px-4 py-2.5 text-foreground">{v.type}</td>
                  <td className="px-4 py-2.5 font-mono font-semibold text-foreground">
                    {v.value}{" "}
                    <span className="font-normal text-muted-foreground text-xs">
                      {v.unit}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge
                      variant={getStatusVariant(v.type, v.value)}
                      label={
                        getStatusVariant(v.type, v.value) === "success"
                          ? "Normal"
                          : getStatusVariant(v.type, v.value) === "warning"
                            ? "Elevated"
                            : getStatusVariant(v.type, v.value) === "danger"
                              ? "High"
                              : "\u2014"
                      }
                    />
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs max-w-[180px] truncate">
                    {v.notes || "\u2014"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
