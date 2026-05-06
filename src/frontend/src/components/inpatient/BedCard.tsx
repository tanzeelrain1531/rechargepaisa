import React from "react";
import { toast } from "sonner";
import {
  type Bed,
  ISOLATION_BADGE,
  type RoundingNote,
  type SafetyAssessment,
  type Ward,
  bedStatusVariant,
  bradenRiskLevel,
  bradenTotalScore,
  historyActionVariant,
  morseRiskLevel,
  morseTotalScore,
  useInpatientContext,
} from "../../contexts/InpatientContext";
import { StatusBadge } from "../StatusBadge";

// ── Safety Assessment Section ─────────────────────────────────────────────
function SafetyAssessmentSection({
  bed,
  onSave,
}: {
  bed: Bed;
  onSave: (assessment: SafetyAssessment) => void;
}) {
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

  const morseFields = [
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
  ];

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
              className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${morseRiskLevel(morseTotalScore(existing)).variant === "success" ? "bg-success/10 text-success border-success/20" : morseRiskLevel(morseTotalScore(existing)).variant === "warning" ? "bg-warning/15 text-warning border-warning/30" : "bg-destructive/10 text-destructive border-destructive/20"}`}
            >
              MFS: {morseTotalScore(existing)}
            </span>
            <span
              className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${bradenRiskLevel(bradenTotalScore(existing)).variant === "success" ? "bg-success/10 text-success border-success/20" : bradenRiskLevel(bradenTotalScore(existing)).variant === "warning" ? "bg-warning/15 text-warning border-warning/30" : "bg-destructive/10 text-destructive border-destructive/20"}`}
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
                {morseFields.map(({ label, field, opts }) => (
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
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 text-xs font-semibold py-1 rounded-sm text-white"
                  style={{ background: "var(--primary)" }}
                >
                  Save Assessment
                </button>
                {existing && (
                  <button
                    type="button"
                    onClick={() => setAssessing(false)}
                    className="text-xs text-muted-foreground px-2 py-1 rounded-sm border border-border"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── BedCard ───────────────────────────────────────────────────────────────────
export const BedCard = React.memo(function BedCard({
  ward,
  bed,
  idx,
}: {
  ward: Ward;
  bed: Bed;
  idx: number;
}) {
  const {
    wards,
    setWards,
    dischargeConfirm,
    setDischargeConfirm,
    expandedHistory,
    expandedTransferHistory,
    expandedRounding,
    roundingNotes,
    roundingFormKey,
    setRoundingFormKey,
    roundingFormText,
    setRoundingFormText,
    transferForm,
    setTransferForm,
    dietaryOrders,
    editingDiet,
    setEditingDiet,
    dischargeChecklists,
    setDischargeChecklists,
    expandedChecklist,
    setExpandedChecklist,
    dietForm,
    setDietForm,
    toggleHistory,
    toggleTransferHistory,
    toggleRounding,
    handleAddRoundingNote,
    handleDischarge,
    handleTransfer,
    saveDietaryOrder,
  } = useInpatientContext();

  const historyOpen = expandedHistory.has(`${ward.id}:${bed.number}`);
  const isTransferring =
    transferForm?.wardId === ward.id && transferForm?.bedNumber === bed.number;
  const dietKey = `${ward.id}:${bed.number}`;
  const currentDiet = dietaryOrders[dietKey];
  const isEditingThisDiet = editingDiet === dietKey;
  const statKey = `${ward.id}:${bed.number}`;
  const checklist = dischargeChecklists[statKey] ?? {};
  const checklistOpen = expandedChecklist.has(statKey);
  const STAT_ORDERS = ["CBC", "BMP", "12-lead ECG", "Chest X-Ray"];
  const DISCHARGE_ITEMS = [
    "Medications reconciled",
    "Follow-up scheduled",
    "Patient education provided",
    "Transportation arranged",
  ];
  const allChecked = DISCHARGE_ITEMS.every((item) => checklist[item]);
  const destWard = transferForm?.destWardId
    ? wards.find((w) => w.id === transferForm.destWardId)
    : null;
  const availableDestBeds = destWard
    ? destWard.beds.filter(
        (b) => b.status === "available" && b.number !== bed.number,
      )
    : [];
  const borderColor =
    bed.status === "available"
      ? "rgb(187 247 208)"
      : bed.status === "reserved"
        ? "rgb(253 230 138)"
        : "rgb(191 219 254)";
  const bgColor =
    bed.status === "available"
      ? "rgba(187,247,208,0.3)"
      : bed.status === "reserved"
        ? "rgba(253,230,138,0.3)"
        : "rgb(248 250 252)";

  const handleToggleDietEdit = () => {
    if (isEditingThisDiet) {
      setEditingDiet(null);
    } else {
      setEditingDiet(dietKey);
      setDietForm(
        currentDiet ?? {
          dietType: "Regular",
          texture: "Regular",
          foodAllergies: "",
          supplements: "",
        },
      );
    }
  };

  return (
    <div
      data-ocid={`inpatient.${ward.id}.bed.${idx + 1}`}
      className="border border-border rounded-sm overflow-hidden"
      style={{
        borderColor,
        borderLeftWidth: bed.isolation ? "3px" : undefined,
        borderLeftColor:
          bed.isolation === "Contact"
            ? "rgb(217 119 6)"
            : bed.isolation === "Droplet"
              ? "rgb(37 99 235)"
              : bed.isolation === "Airborne"
                ? "rgb(220 38 38)"
                : undefined,
      }}
    >
      {/* Bed header */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-2.5 py-2 text-left"
        style={{ background: bgColor }}
        onClick={() => toggleHistory(ward.id, bed.number)}
        data-ocid={`inpatient.${ward.id}.history.panel.${idx + 1}`}
        aria-expanded={historyOpen}
      >
        <span className="text-xs font-semibold text-muted-foreground">
          {bed.number}
        </span>
        <div className="flex items-center gap-1">
          {bed.isolation && ISOLATION_BADGE[bed.isolation] && (
            <span
              className={`text-xs font-bold px-1 py-0.5 rounded border ${ISOLATION_BADGE[bed.isolation].color}`}
              title={`${bed.isolation} isolation`}
            >
              {ISOLATION_BADGE[bed.isolation].label}
            </span>
          )}
          <StatusBadge
            variant={bedStatusVariant(bed.status)}
            label={bed.status}
          />
        </div>
      </button>

      {/* Bed body */}
      <div className="p-2.5">
        {bed.status === "occupied" ? (
          <>
            <p className="text-sm font-medium text-foreground leading-snug truncate">
              {bed.patientName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              {bed.diagnosis}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Admitted {bed.admittedDate}
            </p>
            {bed.safetyAssessment && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${morseRiskLevel(morseTotalScore(bed.safetyAssessment)).variant === "success" ? "bg-success/10 text-success border-success/20" : morseRiskLevel(morseTotalScore(bed.safetyAssessment)).variant === "warning" ? "bg-warning/15 text-warning border-warning/30" : "bg-destructive/10 text-destructive border-destructive/20"}`}
                >
                  Fall:{" "}
                  {morseRiskLevel(morseTotalScore(bed.safetyAssessment)).label}
                </span>
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${bradenRiskLevel(bradenTotalScore(bed.safetyAssessment)).variant === "success" ? "bg-success/10 text-success border-success/20" : bradenRiskLevel(bradenTotalScore(bed.safetyAssessment)).variant === "warning" ? "bg-warning/15 text-warning border-warning/30" : "bg-destructive/10 text-destructive border-destructive/20"}`}
                >
                  Braden: {bradenTotalScore(bed.safetyAssessment)}
                </span>
              </div>
            )}
            {dischargeConfirm?.wardId === ward.id &&
            dischargeConfirm.bedNumber === bed.number ? (
              <div className="mt-2 flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  Discharge?
                </span>
                <button
                  type="button"
                  data-ocid={`inpatient.${ward.id}.discharge.confirm_button.${idx + 1}`}
                  onClick={handleDischarge}
                  className="text-xs font-semibold px-1.5 py-0.5 rounded-sm"
                  style={{
                    color: "var(--destructive)",
                    border: "1px solid rgb(252 165 165)",
                  }}
                >
                  Yes
                </button>
                <button
                  type="button"
                  data-ocid={`inpatient.${ward.id}.discharge.cancel_button.${idx + 1}`}
                  onClick={() => setDischargeConfirm(null)}
                  className="text-xs text-muted-foreground px-1.5 py-0.5 rounded-sm border border-border"
                >
                  No
                </button>
              </div>
            ) : (
              <div className="mt-2 flex gap-1">
                <button
                  type="button"
                  data-ocid={`inpatient.${ward.id}.discharge.button.${idx + 1}`}
                  onClick={() =>
                    setDischargeConfirm({
                      wardId: ward.id,
                      bedNumber: bed.number,
                    })
                  }
                  className="flex-1 text-xs font-medium text-muted-foreground px-1.5 py-1 rounded-sm border border-border hover:text-foreground transition-colors"
                >
                  Discharge
                </button>
                <button
                  type="button"
                  data-ocid={`inpatient.${ward.id}.transfer.button.${idx + 1}`}
                  onClick={() =>
                    isTransferring
                      ? setTransferForm(null)
                      : setTransferForm({
                          wardId: ward.id,
                          bedNumber: bed.number,
                          destWardId: "",
                          destBedNumber: "",
                        })
                  }
                  className="flex-1 text-xs font-medium px-1.5 py-1 rounded-sm border transition-colors"
                  style={{
                    color: "var(--chart-4)",
                    borderColor: "var(--chart-4)",
                  }}
                >
                  Transfer
                </button>
              </div>
            )}
          </>
        ) : bed.status === "reserved" ? (
          <p className="text-xs text-muted-foreground mt-1">Reserved</p>
        ) : (
          <p className="text-xs mt-1" style={{ color: "var(--success)" }}>
            Available
          </p>
        )}
      </div>

      {/* Safety Assessments */}
      {bed.status === "occupied" && (
        <SafetyAssessmentSection
          bed={bed}
          onSave={(assessment) => {
            setWards((prev) =>
              prev.map((w) =>
                w.id !== ward.id
                  ? w
                  : {
                      ...w,
                      beds: w.beds.map((b) =>
                        b.number !== bed.number
                          ? b
                          : { ...b, safetyAssessment: assessment },
                      ),
                    },
              ),
            );
          }}
        />
      )}

      {/* Dietary Orders */}
      {bed.status === "occupied" && (
        <div className="border-t border-border px-2.5 py-2 bg-muted/10">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
              Dietary Orders
            </p>
            <button
              type="button"
              data-ocid={`inpatient.${ward.id}.diet.edit_button.${idx + 1}`}
              onClick={handleToggleDietEdit}
              className="text-xs font-medium text-primary hover:underline"
            >
              {isEditingThisDiet ? "Cancel" : "Edit Diet"}
            </button>
          </div>
          {!isEditingThisDiet ? (
            currentDiet ? (
              <p className="text-xs text-muted-foreground">
                {currentDiet.dietType}
                {currentDiet.texture !== "Regular"
                  ? ` / ${currentDiet.texture}`
                  : ""}
                {currentDiet.foodAllergies
                  ? ` · Allergies: ${currentDiet.foodAllergies}`
                  : ""}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No dietary order on file
              </p>
            )
          ) : (
            <div
              className="space-y-1.5 mt-1"
              data-ocid={`inpatient.${ward.id}.diet.panel.${idx + 1}`}
            >
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label
                    htmlFor={`diet-type-${ward.id}-${idx}`}
                    className="block text-xs text-muted-foreground mb-0.5"
                  >
                    Diet Type
                  </label>
                  <select
                    id={`diet-type-${ward.id}-${idx}`}
                    data-ocid={`inpatient.${ward.id}.diet.type.select.${idx + 1}`}
                    value={dietForm.dietType}
                    onChange={(e) =>
                      setDietForm((f) => ({ ...f, dietType: e.target.value }))
                    }
                    className="w-full h-6 px-1 text-xs bg-background border border-input rounded-sm focus:outline-none"
                  >
                    {[
                      "Regular",
                      "Low-Sodium",
                      "Diabetic",
                      "Clear Liquids",
                      "NPO",
                      "Renal",
                      "Cardiac",
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor={`diet-texture-${ward.id}-${idx}`}
                    className="block text-xs text-muted-foreground mb-0.5"
                  >
                    Texture
                  </label>
                  <select
                    id={`diet-texture-${ward.id}-${idx}`}
                    data-ocid={`inpatient.${ward.id}.diet.texture.select.${idx + 1}`}
                    value={dietForm.texture}
                    onChange={(e) =>
                      setDietForm((f) => ({ ...f, texture: e.target.value }))
                    }
                    className="w-full h-6 px-1 text-xs bg-background border border-input rounded-sm focus:outline-none"
                  >
                    {["Regular", "Soft", "Pureed", "Mechanical Soft"].map(
                      (t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor={`diet-allergy-${ward.id}-${idx}`}
                    className="block text-xs text-muted-foreground mb-0.5"
                  >
                    Food Allergies
                  </label>
                  <input
                    type="text"
                    id={`diet-allergy-${ward.id}-${idx}`}
                    data-ocid={`inpatient.${ward.id}.diet.allergies.input.${idx + 1}`}
                    value={dietForm.foodAllergies}
                    onChange={(e) =>
                      setDietForm((f) => ({
                        ...f,
                        foodAllergies: e.target.value,
                      }))
                    }
                    placeholder="e.g. Shellfish, Nuts"
                    className="w-full h-6 px-1 text-xs bg-background border border-input rounded-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`diet-supp-${ward.id}-${idx}`}
                    className="block text-xs text-muted-foreground mb-0.5"
                  >
                    Supplements
                  </label>
                  <input
                    type="text"
                    id={`diet-supp-${ward.id}-${idx}`}
                    data-ocid={`inpatient.${ward.id}.diet.supplements.input.${idx + 1}`}
                    value={dietForm.supplements}
                    onChange={(e) =>
                      setDietForm((f) => ({
                        ...f,
                        supplements: e.target.value,
                      }))
                    }
                    placeholder="e.g. Ensure, Vitamin D"
                    className="w-full h-6 px-1 text-xs bg-background border border-input rounded-sm focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="button"
                data-ocid={`inpatient.${ward.id}.diet.save_button.${idx + 1}`}
                onClick={() => saveDietaryOrder(dietKey, dietForm)}
                className="text-xs font-semibold px-2 py-0.5 rounded-sm text-white"
                style={{ background: "var(--primary)" }}
              >
                Save
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stat Orders + Discharge Checklist */}
      {bed.status === "occupied" && (
        <>
          <div className="border-t border-border px-2.5 py-2 bg-muted/5">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1.5">
              Stat Orders
            </p>
            <div className="flex flex-wrap gap-1">
              {STAT_ORDERS.map((test) => (
                <button
                  key={test}
                  type="button"
                  data-ocid={`inpatient.${ward.id}.stat.button.${idx + 1}`}
                  onClick={() =>
                    toast.success(`Stat order placed: ${test}`, {
                      duration: 3000,
                    })
                  }
                  className="text-xs font-semibold px-2 py-0.5 rounded-sm border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                >
                  {test}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-border">
            <button
              type="button"
              data-ocid={`inpatient.${ward.id}.checklist.toggle.${idx + 1}`}
              onClick={() =>
                setExpandedChecklist((prev) => {
                  const next = new Set(prev);
                  if (next.has(statKey)) next.delete(statKey);
                  else next.add(statKey);
                  return next;
                })
              }
              className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-muted/20 transition-colors text-left"
            >
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Discharge Checklist
                </p>
                {allChecked && (
                  <span className="text-xs font-semibold text-success bg-success/10 px-1.5 py-0.5 rounded-sm border border-success/20">
                    Complete
                  </span>
                )}
              </div>
              <svg
                className={`w-3 h-3 text-muted-foreground transition-transform ${checklistOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {checklistOpen && (
              <div
                className="px-2.5 pb-2 space-y-1.5 bg-muted/10"
                data-ocid={`inpatient.${ward.id}.checklist.panel.${idx + 1}`}
              >
                {DISCHARGE_ITEMS.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checklist[item] ?? false}
                      onChange={(e) =>
                        setDischargeChecklists((prev) => ({
                          ...prev,
                          [statKey]: {
                            ...(prev[statKey] ?? {}),
                            [item]: e.target.checked,
                          },
                        }))
                      }
                      className="w-3 h-3 accent-primary"
                      data-ocid={`inpatient.${ward.id}.checklist.checkbox.${idx + 1}`}
                    />
                    <span
                      className={`text-xs ${checklist[item] ? "line-through text-muted-foreground" : "text-foreground"}`}
                    >
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Inline Transfer Form */}
      {isTransferring && transferForm && (
        <div
          className="border-t border-border px-2.5 py-2 bg-muted/20"
          data-ocid={`inpatient.${ward.id}.transfer.panel`}
        >
          <p className="text-xs font-semibold text-foreground mb-1.5">
            Transfer Patient
          </p>
          <div className="space-y-1.5">
            <div>
              <label
                htmlFor="dest-ward-select"
                className="block text-xs text-muted-foreground mb-0.5"
              >
                Destination Ward
              </label>
              <select
                id="dest-ward-select"
                value={transferForm.destWardId}
                onChange={(e) =>
                  setTransferForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          destWardId: e.target.value,
                          destBedNumber: "",
                        }
                      : prev,
                  )
                }
                className="w-full h-7 px-1.5 text-xs bg-background border border-input rounded-sm focus:outline-none"
              >
                <option value="">Select ward...</option>
                {wards
                  .filter((w) => w.id !== ward.id)
                  .map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
              </select>
            </div>
            {transferForm.destWardId && (
              <div>
                <label
                  htmlFor="dest-bed-select"
                  className="block text-xs text-muted-foreground mb-0.5"
                >
                  Destination Bed
                </label>
                <select
                  id="dest-bed-select"
                  value={transferForm.destBedNumber}
                  onChange={(e) =>
                    setTransferForm((prev) =>
                      prev ? { ...prev, destBedNumber: e.target.value } : prev,
                    )
                  }
                  className="w-full h-7 px-1.5 text-xs bg-background border border-input rounded-sm focus:outline-none"
                >
                  <option value="">Select bed...</option>
                  {availableDestBeds.map((b) => (
                    <option key={b.number} value={b.number}>
                      {b.number}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex gap-1 pt-0.5">
              <button
                type="button"
                data-ocid={`inpatient.${ward.id}.transfer.confirm_button.${idx + 1}`}
                onClick={handleTransfer}
                disabled={
                  !transferForm.destWardId || !transferForm.destBedNumber
                }
                className="flex-1 text-xs font-semibold py-1 rounded-sm text-white disabled:opacity-40"
                style={{ background: "var(--chart-4)" }}
              >
                Confirm
              </button>
              <button
                type="button"
                data-ocid={`inpatient.${ward.id}.transfer.cancel_button.${idx + 1}`}
                onClick={() => setTransferForm(null)}
                className="flex-1 text-xs text-muted-foreground py-1 rounded-sm border border-border"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bed History */}
      {historyOpen && (bed.history ?? []).length > 0 && (
        <div
          className="border-t border-border px-2.5 py-2 bg-muted/10"
          data-ocid={`inpatient.${ward.id}.history.panel.${idx + 1}`}
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            Bed History
          </p>
          <div className="space-y-1">
            {(bed.history ?? []).map((entry, hi) => (
              <div
                key={`${entry.date}-${entry.action}-${hi}`}
                className="flex items-start gap-1.5"
              >
                <span className="text-xs text-muted-foreground w-12 shrink-0 pt-0.5">
                  {entry.date}
                </span>
                <StatusBadge
                  variant={historyActionVariant(entry.action)}
                  label={entry.action}
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground leading-snug truncate">
                    {entry.patientName}
                  </p>
                  {entry.diagnosis && (
                    <p className="text-xs text-muted-foreground leading-snug truncate">
                      {entry.diagnosis}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transfer History */}
      {bed.status === "occupied" && (bed.transferHistory ?? []).length > 0 && (
        <div
          className="border-t border-border"
          data-ocid={`inpatient.${ward.id}.transfer_history.panel.${idx + 1}`}
        >
          <button
            type="button"
            data-ocid={`inpatient.${ward.id}.transfer_history.toggle.${idx + 1}`}
            onClick={() => toggleTransferHistory(ward.id, bed.number)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 text-left hover:bg-muted/20 transition-colors"
          >
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Transfer History ({(bed.transferHistory ?? []).length})
            </span>
            <span className="text-xs text-muted-foreground">
              {expandedTransferHistory.has(`${ward.id}:${bed.number}`)
                ? "▲"
                : "▼"}
            </span>
          </button>
          {expandedTransferHistory.has(`${ward.id}:${bed.number}`) && (
            <div className="px-2.5 pb-2 space-y-2 bg-muted/5">
              {(bed.transferHistory ?? []).map((ev, ti) => (
                <div
                  key={`${ev.timestamp}-${ti}`}
                  className="border border-border rounded-sm p-2 text-xs space-y-0.5"
                >
                  <div className="flex items-center gap-1 mb-1">
                    <StatusBadge variant="info" label="transfer" />
                    <span className="text-muted-foreground font-medium">
                      {ev.timestamp}
                    </span>
                  </div>
                  <p className="text-foreground">
                    <span className="text-muted-foreground">From:</span>{" "}
                    {ev.fromWard} / {ev.fromBed}
                  </p>
                  <p className="text-foreground">
                    <span className="text-muted-foreground">To:</span>{" "}
                    {ev.toWard} / {ev.toBed}
                  </p>
                  <p className="text-foreground">
                    <span className="text-muted-foreground">Reason:</span>{" "}
                    {ev.reason}
                  </p>
                  <p className="text-foreground">
                    <span className="text-muted-foreground">Provider:</span>{" "}
                    {ev.orderingProvider}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rounding Notes */}
      {bed.status === "occupied" && (
        <div
          className="border-t border-border"
          data-ocid={`inpatient.rounding.panel.${idx + 1}`}
        >
          <button
            type="button"
            data-ocid={`inpatient.rounding.toggle.${idx + 1}`}
            onClick={() => toggleRounding(ward.id, bed.number)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 text-left hover:bg-muted/20 transition-colors"
          >
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Rounding Notes (
              {(roundingNotes[`${ward.id}:${bed.number}`] ?? []).length})
            </span>
            <span className="text-xs text-muted-foreground">
              {expandedRounding.has(`${ward.id}:${bed.number}`) ? "▲" : "▼"}
            </span>
          </button>
          {expandedRounding.has(`${ward.id}:${bed.number}`) && (
            <div className="px-2.5 pb-3 space-y-2 bg-muted/5">
              {(roundingNotes[`${ward.id}:${bed.number}`] ?? []).map(
                (rn: RoundingNote) => (
                  <div
                    key={rn.id}
                    className="border border-border rounded-sm p-2 text-xs space-y-0.5"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-semibold text-foreground">
                        {rn.provider}
                      </span>
                      <span className="text-muted-foreground">
                        {rn.timestamp}
                      </span>
                    </div>
                    <p className="text-foreground leading-relaxed">{rn.note}</p>
                  </div>
                ),
              )}
              {roundingFormKey === `${ward.id}:${bed.number}` ? (
                <div className="space-y-1.5 pt-1">
                  <textarea
                    data-ocid="inpatient.rounding.note.textarea"
                    value={roundingFormText}
                    onChange={(e) => setRoundingFormText(e.target.value)}
                    rows={3}
                    placeholder="Enter rounding note..."
                    className="w-full px-2 py-1.5 text-xs bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring resize-none"
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      data-ocid="inpatient.rounding.submit_button"
                      onClick={() => handleAddRoundingNote(ward.id, bed.number)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-sm text-white"
                      style={{ background: "var(--primary)" }}
                    >
                      Save Note
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRoundingFormKey(null);
                        setRoundingFormText("");
                      }}
                      className="px-2.5 py-1 text-xs font-medium rounded-sm text-muted-foreground border border-border"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setRoundingFormKey(`${ward.id}:${bed.number}`);
                    setRoundingFormText("");
                  }}
                  className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors pt-0.5"
                >
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Rounding Note
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
