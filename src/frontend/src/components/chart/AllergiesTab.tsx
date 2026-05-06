import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useState } from "react";
import { DEMO_ALLERGIES, type DemoAllergy } from "../../demoData";

export function AllergiesTab({ patientId }: { patientId: bigint }) {
  const allergies = DEMO_ALLERGIES.filter((a) => a.patientId === patientId);
  const [showForm, setShowForm] = useState(false);
  const [local, setLocal] = useState<DemoAllergy[]>([]);
  const [form, setForm] = useState({
    allergen: "",
    reaction: "",
    severity: "mild" as DemoAllergy["severity"],
    dateNoted: "",
  });

  const all = [...local, ...allergies];

  function handleAdd() {
    if (!form.allergen) return;
    setLocal((prev) => [
      ...prev,
      {
        id: BigInt(Date.now()),
        patientId,
        ...form,
        dateNoted: form.dateNoted || new Date().toISOString().slice(0, 10),
      },
    ]);
    setForm({ allergen: "", reaction: "", severity: "mild", dateNoted: "" });
    setShowForm(false);
  }

  const severityVariant = (s: DemoAllergy["severity"]) =>
    s === "severe" ? "danger" : s === "moderate" ? "warning" : "neutral";

  return (
    <div className="space-y-4" data-ocid="patient_chart.allergies.panel">
      {/* Add Allergy */}
      <div className="bg-card border border-border">
        <button
          type="button"
          data-ocid="patient_chart.allergies.open_modal_button"
          onClick={() => setShowForm((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/30 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-3.5 h-3.5 text-primary" />
            Add Allergy
          </span>
          {showForm ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {showForm && (
          <div className="border-t border-border px-4 py-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="col-span-2 md:col-span-1">
                <label
                  htmlFor="allergy-allergen"
                  className="text-xs text-muted-foreground block mb-1"
                >
                  Allergen
                </label>
                <input
                  id="allergy-allergen"
                  type="text"
                  data-ocid="patient_chart.allergies.allergen.input"
                  className="w-full h-8 px-2 text-xs border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  value={form.allergen}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, allergen: e.target.value }))
                  }
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label
                  htmlFor="allergy-reaction"
                  className="text-xs text-muted-foreground block mb-1"
                >
                  Reaction
                </label>
                <input
                  id="allergy-reaction"
                  type="text"
                  data-ocid="patient_chart.allergies.reaction.input"
                  className="w-full h-8 px-2 text-xs border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  value={form.reaction}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, reaction: e.target.value }))
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="allergy-severity"
                  className="text-xs text-muted-foreground block mb-1"
                >
                  Severity
                </label>
                <select
                  id="allergy-severity"
                  data-ocid="patient_chart.allergies.severity.select"
                  className="w-full h-8 px-2 text-xs border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  value={form.severity}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      severity: e.target.value as DemoAllergy["severity"],
                    }))
                  }
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="allergy-date"
                  className="text-xs text-muted-foreground block mb-1"
                >
                  Date Noted
                </label>
                <input
                  id="allergy-date"
                  type="date"
                  data-ocid="patient_chart.allergies.date.input"
                  className="w-full h-8 px-2 text-xs border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  value={form.dateNoted}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dateNoted: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                data-ocid="patient_chart.allergies.submit_button"
                onClick={handleAdd}
                className="text-xs h-7"
              >
                Save Allergy
              </Button>
              <Button
                size="sm"
                variant="ghost"
                data-ocid="patient_chart.allergies.cancel_button"
                onClick={() => setShowForm(false)}
                className="text-xs h-7"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Allergy list */}
      {all.length === 0 ? (
        <div
          className="bg-card border border-border px-4 py-8 flex flex-col items-center gap-3"
          data-ocid="patient_chart.allergies.empty_state"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-sm">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="text-sm font-semibold text-success">
              NKDA — No Known Drug Allergies
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            No allergies have been recorded for this patient.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {all.map((allergy, idx) => (
            <div
              key={String(allergy.id)}
              data-ocid={`patient_chart.allergies.item.${idx + 1}`}
              className="bg-card border border-border px-4 py-3 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-foreground">
                    {allergy.allergen}
                  </span>
                  <StatusBadge
                    variant={severityVariant(allergy.severity)}
                    label={
                      allergy.severity.charAt(0).toUpperCase() +
                      allergy.severity.slice(1)
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {allergy.reaction}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Noted: {allergy.dateNoted}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
