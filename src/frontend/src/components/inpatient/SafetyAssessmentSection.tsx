import { StatusBadge } from "@/components/StatusBadge";
import React from "react";
import { toast } from "sonner";
import type { Bed, SafetyAssessment } from "./inpatientTypes";

export function morseTotalScore(a: SafetyAssessment) {
  return (
    a.morseHistory +
    a.morseSecondary +
    a.morseAid +
    a.morseIV +
    a.morseGait +
    a.morseMental
  );
}

export function morseRiskLevel(score: number): {
  label: string;
  variant: "success" | "warning" | "danger";
} {
  if (score < 25) return { label: "Low Risk", variant: "success" };
  if (score < 45) return { label: "Moderate Risk", variant: "warning" };
  return { label: "High Risk", variant: "danger" };
}

export function bradenTotalScore(a: SafetyAssessment) {
  return (
    a.bradenSensory +
    a.bradenMoisture +
    a.bradenActivity +
    a.bradenMobility +
    a.bradenNutrition +
    a.bradenFriction
  );
}

export function bradenRiskLevel(score: number): {
  label: string;
  variant: "success" | "warning" | "danger";
} {
  if (score <= 9) return { label: "Very High Risk", variant: "danger" };
  if (score <= 12) return { label: "High Risk", variant: "danger" };
  if (score <= 14) return { label: "Moderate Risk", variant: "warning" };
  return { label: "Low Risk", variant: "success" };
}

function riskClass(variant: "success" | "warning" | "danger") {
  if (variant === "success")
    return "bg-success/10 text-success border-success/20";
  if (variant === "warning")
    return "bg-warning/15 text-warning border-warning/30";
  return "bg-destructive/10 text-destructive border-destructive/20";
}

export function SafetyAssessmentSection({
  bed,
  onSave,
}: { bed: Bed; onSave: (assessment: SafetyAssessment) => void }) {
  const defaultAssessment: SafetyAssessment = {
    morseHistory: 0,
    morseSecondary: 0,
    morseAid: 0,
    morseIV: 0,
    morseGait: 0,
    morseMental: 0,
    bradenSensory: 3,
    bradenMoisture: 3,
    bradenActivity: 3,
    bradenMobility: 3,
    bradenNutrition: 3,
    bradenFriction: 2,
    assessedDate: new Date().toISOString().slice(0, 10),
  };
  const [expanded, setExpanded] = React.useState(false);
  const [assessing, setAssessing] = React.useState(false);
  const [draft, setDraft] = React.useState<SafetyAssessment>(
    bed.safetyAssessment ?? defaultAssessment,
  );
  const existing = bed.safetyAssessment;

  const handleSave = () => {
    onSave(draft);
    setAssessing(false);
    toast.success("Safety assessment saved");
  };

  return (
    <div
      className="border-t border-border"
      data-ocid={`inpatient.safety.${bed.number}.panel`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        data-ocid={`inpatient.safety.${bed.number}.toggle`}
      >
        <span>Safety Assessments</span>
        {existing ? (
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${riskClass(morseRiskLevel(morseTotalScore(existing)).variant)}`}
            >
              MFS: {morseTotalScore(existing)}
            </span>
            <span
              className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${riskClass(bradenRiskLevel(bradenTotalScore(existing)).variant)}`}
            >
              Braden: {bradenTotalScore(existing)}
            </span>
          </div>
        ) : (
          <span className="text-xs text-warning font-medium">Not assessed</span>
        )}
      </button>

      {expanded && (
        <div className="px-2.5 pb-2.5 space-y-2 bg-muted/20">
          {existing && !assessing ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <StatusBadge
                  variant={morseRiskLevel(morseTotalScore(existing)).variant}
                  label={`Fall: ${morseRiskLevel(morseTotalScore(existing)).label} (${morseTotalScore(existing)})`}
                />
                <StatusBadge
                  variant={bradenRiskLevel(bradenTotalScore(existing)).variant}
                  label={`PU: ${bradenRiskLevel(bradenTotalScore(existing)).label} (${bradenTotalScore(existing)})`}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Assessed: {existing.assessedDate}
              </p>
              <button
                type="button"
                onClick={() => {
                  setDraft(existing);
                  setAssessing(true);
                }}
                className="text-xs text-primary underline"
                data-ocid={`inpatient.safety.${bed.number}.edit_button`}
              >
                Reassess
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <p className="text-xs font-semibold text-foreground">
                Morse Fall Scale
              </p>
              <div className="space-y-1">
                {[
                  {
                    label: "History of falling",
                    field: "morseHistory" as const,
                    opts: [
                      { label: "No", v: 0 },
                      { label: "Yes", v: 25 },
                    ],
                  },
                  {
                    label: "Secondary diagnosis",
                    field: "morseSecondary" as const,
                    opts: [
                      { label: "No", v: 0 },
                      { label: "Yes", v: 15 },
                    ],
                  },
                  {
                    label: "IV / Heparin lock",
                    field: "morseIV" as const,
                    opts: [
                      { label: "No", v: 0 },
                      { label: "Yes", v: 20 },
                    ],
                  },
                  {
                    label: "Mental status",
                    field: "morseMental" as const,
                    opts: [
                      { label: "Knows ability", v: 0 },
                      { label: "Forgets limits", v: 15 },
                    ],
                  },
                ].map(({ label, field, opts }) => (
                  <div
                    key={field}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-muted-foreground flex-1 pr-1">
                      {label}
                    </span>
                    <div className="flex gap-1">
                      {opts.map(({ label: ol, v }) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() =>
                            setDraft((p) => ({ ...p, [field]: v }))
                          }
                          className={`text-xs px-1.5 py-0.5 rounded border transition-colors ${draft[field] === v ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:text-foreground"}`}
                        >
                          {ol}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Ambulatory aid
                  </span>
                  <div className="flex gap-1">
                    {[
                      { label: "None", v: 0 },
                      { label: "Cane", v: 15 },
                      { label: "Furniture", v: 30 },
                    ].map(({ label: ol, v }) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setDraft((p) => ({ ...p, morseAid: v }))}
                        className={`text-xs px-1.5 py-0.5 rounded border transition-colors ${draft.morseAid === v ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:text-foreground"}`}
                      >
                        {ol}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Gait</span>
                  <div className="flex gap-1">
                    {[
                      { label: "Normal", v: 0 },
                      { label: "Weak", v: 10 },
                      { label: "Impaired", v: 20 },
                    ].map(({ label: ol, v }) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() =>
                          setDraft((p) => ({ ...p, morseGait: v }))
                        }
                        className={`text-xs px-1.5 py-0.5 rounded border transition-colors ${draft.morseGait === v ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:text-foreground"}`}
                      >
                        {ol}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-xs font-medium text-foreground">
                MFS Total:{" "}
                <span className="font-bold">{morseTotalScore(draft)}</span> —{" "}
                {morseRiskLevel(morseTotalScore(draft)).label}
              </div>

              <p className="text-xs font-semibold text-foreground mt-2">
                Braden Scale
              </p>
              <div className="space-y-1">
                {[
                  {
                    label: "Sensory Perception",
                    field: "bradenSensory" as const,
                    max: 4,
                  },
                  {
                    label: "Moisture",
                    field: "bradenMoisture" as const,
                    max: 4,
                  },
                  {
                    label: "Activity",
                    field: "bradenActivity" as const,
                    max: 4,
                  },
                  {
                    label: "Mobility",
                    field: "bradenMobility" as const,
                    max: 4,
                  },
                  {
                    label: "Nutrition",
                    field: "bradenNutrition" as const,
                    max: 4,
                  },
                  {
                    label: "Friction/Shear",
                    field: "bradenFriction" as const,
                    max: 3,
                  },
                ].map(({ label, field, max }) => (
                  <div
                    key={field}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-muted-foreground flex-1 pr-1">
                      {label}
                    </span>
                    <div className="flex gap-1">
                      {Array.from({ length: max }, (_, i) => i + 1).map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() =>
                            setDraft((p) => ({ ...p, [field]: v }))
                          }
                          className={`text-xs w-6 h-5 rounded border transition-colors ${draft[field] === v ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:text-foreground"}`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs font-medium text-foreground">
                Braden Total:{" "}
                <span className="font-bold">{bradenTotalScore(draft)}</span> —{" "}
                {bradenRiskLevel(bradenTotalScore(draft)).label}
              </div>

              <input
                type="date"
                value={draft.assessedDate}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, assessedDate: e.target.value }))
                }
                className="h-7 px-2 text-xs bg-background border border-input rounded-sm focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-2.5 py-1 text-xs font-semibold rounded-sm text-white"
                  style={{ background: "var(--primary)" }}
                >
                  Save Assessment
                </button>
                <button
                  type="button"
                  onClick={() => setAssessing(false)}
                  className="px-2 py-1 text-xs rounded-sm text-muted-foreground border border-border"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
