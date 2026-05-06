import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  FlaskConical,
  Plus,
  Receipt,
  Save,
  Trash2,
} from "lucide-react";
import type React from "react";
import type { EducationHandout } from "../../data/educationHandouts";
import { getHandoutsForDiagnoses } from "../../data/educationHandouts";

const EM_CODES = [
  {
    code: "99213",
    description: "Office visit, established — low complexity",
    unitPrice: 150,
  },
  {
    code: "99214",
    description: "Office visit, established — moderate complexity",
    unitPrice: 220,
  },
];

function suggestCpts(orders: Array<{ type: "lab" | "imaging"; name: string }>) {
  const suggestions: Array<{
    id: number;
    code: string;
    description: string;
    qty: number;
    unitPrice: number;
  }> = [
    {
      id: 1,
      code: EM_CODES[1].code,
      description: EM_CODES[1].description,
      qty: 1,
      unitPrice: EM_CODES[1].unitPrice,
    },
  ];
  const hasLab = orders.some((o) => o.type === "lab");
  const hasImaging = orders.some((o) => o.type === "imaging");
  if (hasLab) {
    suggestions.push({
      id: 2,
      code: "80053",
      description: "Comprehensive metabolic panel",
      qty: 1,
      unitPrice: 85,
    });
  }
  if (hasImaging) {
    const firstImg = orders.find((o) => o.type === "imaging");
    const name = firstImg?.name.toLowerCase() ?? "";
    if (name.includes("chest") || name.includes("x-ray")) {
      suggestions.push({
        id: 3,
        code: "71046",
        description: "Chest X-Ray, 2 views",
        qty: 1,
        unitPrice: 125,
      });
    } else if (name.includes("mri")) {
      suggestions.push({
        id: 4,
        code: "70553",
        description: "MRI Brain with contrast",
        qty: 1,
        unitPrice: 950,
      });
    } else if (name.includes("ct")) {
      suggestions.push({
        id: 5,
        code: "74177",
        description: "CT Abdomen & Pelvis with contrast",
        qty: 1,
        unitPrice: 780,
      });
    } else {
      suggestions.push({
        id: 6,
        code: "76700",
        description: "Abdominal ultrasound, complete",
        qty: 1,
        unitPrice: 320,
      });
    }
  }
  return suggestions;
}

type CptCode = {
  id: number;
  code: string;
  description: string;
  qty: number;
  unitPrice: number;
};

interface Patient {
  id: bigint;
  name: string;
  mrn: string;
  dateOfBirth: string;
  email: string;
  phone: string;
}

interface Order {
  id: bigint;
  type: "lab" | "imaging";
  name: string;
}

interface Prescription {
  id: bigint;
  drug: string;
  dose: string;
  frequency: string;
  route: string;
}

interface SoapState {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

interface EncounterSignOffProps {
  isSigned: boolean;
  showAVS: boolean;
  setShowAVS: (v: boolean) => void;
  patient: Patient | null;
  soap: SoapState;
  prescriptions: Prescription[];
  orders: Order[];
  avsFollowUp: string;
  setAvsFollowUp: (v: string) => void;
  avsPatientEd: string;
  setAvsPatientEd: (v: string) => void;
  educationChecked: Record<string, boolean>;
  setEducationChecked: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  showEducation: boolean;
  setShowEducation: (v: boolean) => void;
  capturedCpts: CptCode[];
  setCapturedCpts: React.Dispatch<React.SetStateAction<CptCode[]>>;
  newCptCode: string;
  setNewCptCode: (v: string) => void;
  newCptDesc: string;
  setNewCptDesc: (v: string) => void;
  showChargeCapture: boolean;
  setShowChargeCapture: (v: boolean) => void;
  isSaving: boolean;
  isSigning: boolean;
  signedLabCount: number;
  signedImgCount: number;
  signedRxCount: number;
  handleSaveDraft: () => void;
  handleSignClose: () => void;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export function EncounterSignOff({
  isSigned,
  showAVS,
  setShowAVS,
  patient,
  soap,
  prescriptions,
  orders,
  avsFollowUp,
  setAvsFollowUp,
  avsPatientEd,
  setAvsPatientEd,
  educationChecked,
  setEducationChecked,
  showEducation,
  setShowEducation,
  capturedCpts,
  setCapturedCpts,
  newCptCode,
  setNewCptCode,
  newCptDesc,
  setNewCptDesc,
  showChargeCapture,
  setShowChargeCapture,
  isSaving,
  isSigning,
  signedLabCount,
  signedImgCount,
  signedRxCount,
  handleSaveDraft,
  handleSignClose,
  onBack,
  onNavigate,
}: EncounterSignOffProps) {
  const total = capturedCpts.reduce((sum, c) => sum + c.qty * c.unitPrice, 0);

  const handleAutoSuggest = () => {
    const suggestions = suggestCpts(orders);
    setCapturedCpts(suggestions);
  };

  const handleRemoveCpt = (id: number) => {
    setCapturedCpts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddCustomCpt = () => {
    if (!newCptCode.trim()) return;
    setCapturedCpts((prev) => [
      ...prev,
      {
        id: Date.now(),
        code: newCptCode.trim(),
        description: newCptDesc.trim() || "Custom procedure",
        qty: 1,
        unitPrice: 0,
      },
    ]);
    setNewCptCode("");
    setNewCptDesc("");
  };

  return (
    <>
      {/* Signed confirmation panel */}
      {isSigned && (
        <div
          className="border border-success/30 bg-success/10 px-5 py-4 mb-5 space-y-3"
          data-ocid="encounter.success_state"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
            <p className="text-sm font-semibold text-success">
              Encounter Signed &amp; Closed
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-success">
            {signedLabCount > 0 && (
              <span className="flex items-center gap-1.5 bg-success/5 border border-success/25 px-2.5 py-1 rounded-sm">
                <FlaskConical className="w-3 h-3" />
                {signedLabCount} lab order{signedLabCount !== 1 ? "s" : ""}{" "}
                submitted
              </span>
            )}
            {signedImgCount > 0 && (
              <span className="flex items-center gap-1.5 bg-success/5 border border-success/25 px-2.5 py-1 rounded-sm">
                <ClipboardList className="w-3 h-3" />
                {signedImgCount} imaging order{signedImgCount !== 1 ? "s" : ""}{" "}
                submitted
              </span>
            )}
            {signedRxCount > 0 && (
              <span className="flex items-center gap-1.5 bg-success/5 border border-success/25 px-2.5 py-1 rounded-sm">
                <CheckCircle2 className="w-3 h-3" />
                {signedRxCount} prescription{signedRxCount !== 1 ? "s" : ""}{" "}
                sent to pharmacy
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {signedRxCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                data-ocid="encounter.pharmacy.button"
                onClick={() => onNavigate?.("pharmacy")}
                className="h-7 text-xs border-success/30 text-success hover:bg-success/10"
              >
                Go to Pharmacy Queue
              </Button>
            )}
            {signedLabCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                data-ocid="encounter.labs.button"
                onClick={() => onNavigate?.("labs")}
                className="h-7 text-xs border-success/30 text-success hover:bg-success/10"
              >
                View Lab Results
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              data-ocid="encounter.back_to_appointments.button"
              onClick={onBack}
              className="h-7 text-xs text-muted-foreground"
            >
              Back to Appointments
            </Button>
          </div>
        </div>
      )}

      {/* After-Visit Summary (AVS) */}
      {isSigned && showAVS && (
        <div
          className="border border-primary/20 bg-primary/5 mb-5 rounded-sm"
          data-ocid="encounter.avs.panel"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-primary/20">
            <div className="flex items-center gap-2.5">
              <svg
                className="w-4 h-4 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <p className="text-sm font-bold text-primary">
                After-Visit Summary
              </p>
            </div>
            <button
              type="button"
              data-ocid="encounter.avs.close_button"
              onClick={() => setShowAVS(false)}
              className="text-primary hover:text-primary/70 transition-colors"
              aria-label="Close AVS"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-[12px]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                  Patient
                </p>
                <p className="font-semibold text-foreground">{patient?.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                  Visit Date
                </p>
                <p className="font-semibold text-foreground">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                  Provider
                </p>
                <p className="font-semibold text-foreground">Dr. Sarah Chen</p>
              </div>
            </div>

            {soap.assessment && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Diagnoses
                </p>
                <div className="text-[13px] text-foreground bg-card border border-border rounded-sm px-3 py-2 whitespace-pre-wrap">
                  {soap.assessment}
                </div>
              </div>
            )}

            {prescriptions.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Medications Prescribed
                </p>
                <div className="space-y-1">
                  {prescriptions.map((rx, i) => (
                    <div
                      key={`${rx.drug}-${i}`}
                      className="text-[13px] text-foreground flex gap-2"
                    >
                      <span className="font-medium">{rx.drug}</span>
                      <span className="text-muted-foreground">
                        {rx.dose} — {rx.frequency} ({rx.route})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {orders.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Orders Placed
                </p>
                <div className="flex flex-wrap gap-2">
                  {orders.map((o, i) => (
                    <span
                      key={`${o.name}-${i}`}
                      className="text-xs px-2 py-0.5 bg-card border border-border rounded-sm font-medium text-foreground"
                    >
                      {o.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="avs-followup"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
              >
                Follow-up Instructions
              </label>
              <textarea
                id="avs-followup"
                data-ocid="encounter.avs.followup.textarea"
                value={avsFollowUp}
                onChange={(e) => setAvsFollowUp(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-[13px] bg-card border border-border rounded-sm focus:outline-none focus:ring-1 ring-primary/50 resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="avs-education"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
              >
                Patient Education Notes
              </label>
              <textarea
                id="avs-education"
                data-ocid="encounter.avs.education.textarea"
                value={avsPatientEd}
                onChange={(e) => setAvsPatientEd(e.target.value)}
                rows={2}
                placeholder="e.g. Review medication instructions. Monitor blood sugar daily..."
                className="w-full px-3 py-2 text-[13px] bg-card border border-border rounded-sm focus:outline-none focus:ring-1 ring-primary/50 resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                data-ocid="encounter.avs.print_button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-white rounded-sm transition-opacity hover:opacity-90 bg-primary"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                Print Summary
              </button>
              <button
                type="button"
                data-ocid="encounter.avs.done_button"
                onClick={onBack}
                className="px-4 py-2 text-[12px] font-medium border border-border text-muted-foreground rounded-sm hover:text-foreground transition-colors"
              >
                Done — Back to Appointments
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Education Handouts */}
      {!isSigned && (
        <section
          className="border border-border bg-card"
          data-ocid="encounter.education.panel"
        >
          <button
            type="button"
            data-ocid="encounter.education.toggle"
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
            onClick={() => setShowEducation(!showEducation)}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              Patient Education Handouts
              <span className="text-xs font-normal text-muted-foreground ml-1">
                Select materials to include in after-visit summary
              </span>
            </div>
            {showEducation ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          {showEducation &&
            (() => {
              const icdCodes = soap.assessment
                .split("\n")
                .map((l) => l.match(/^([A-Z][\d.]+[A-Z0-9]*)/)?.[1] ?? "")
                .filter(Boolean);
              const handouts = getHandoutsForDiagnoses(icdCodes);
              return (
                <div className="px-5 pb-5 pt-2 space-y-3">
                  {icdCodes.length === 0 && (
                    <p className="text-xs text-muted-foreground mb-2">
                      No diagnoses entered yet — showing general handout.
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {handouts.map((h: EducationHandout, idx: number) => {
                      const checked = educationChecked[h.id] !== false;
                      return (
                        <div
                          key={h.id}
                          data-ocid={`encounter.education.item.${idx + 1}`}
                          className={`border rounded-sm p-3 transition-colors ${
                            checked
                              ? "border-primary/30 bg-primary/5"
                              : "border-border bg-muted/20"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <input
                              type="checkbox"
                              id={`edu-${h.id}`}
                              data-ocid={`encounter.education.checkbox.${idx + 1}`}
                              checked={checked}
                              onChange={(e) =>
                                setEducationChecked((prev) => ({
                                  ...prev,
                                  [h.id]: e.target.checked,
                                }))
                              }
                              className="mt-0.5 accent-primary"
                            />
                            <div className="flex-1 min-w-0">
                              <label
                                htmlFor={`edu-${h.id}`}
                                className="block text-[12px] font-semibold text-foreground cursor-pointer"
                              >
                                {h.title}
                              </label>
                              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                {h.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {h.topics.slice(0, 3).map((topic) => (
                                  <span
                                    key={topic}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-medium bg-muted text-muted-foreground"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
        </section>
      )}

      {/* Charge Capture */}
      {!isSigned && (
        <section
          className="border border-border bg-card"
          data-ocid="encounter.charge-capture.panel"
        >
          <button
            type="button"
            data-ocid="encounter.charge-capture.toggle"
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
            onClick={() => setShowChargeCapture(!showChargeCapture)}
          >
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-muted-foreground" />
              Charge Capture
              <span className="text-xs font-normal text-muted-foreground ml-1">
                Review and confirm CPT codes before signing
              </span>
            </div>
            {showChargeCapture ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          {showChargeCapture && (
            <div className="border-t border-border px-5 py-4 space-y-4">
              {capturedCpts.length === 0 ? (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground py-2">
                    No CPT codes. Auto-suggest based on orders or add manually.
                  </p>
                  <Button
                    data-ocid="encounter.cpt.suggest_button"
                    size="sm"
                    variant="outline"
                    onClick={handleAutoSuggest}
                    className="h-7 text-xs"
                  >
                    Auto-Suggest
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {capturedCpts.map((cpt, idx) => (
                    <div
                      key={cpt.id}
                      className="flex items-center justify-between text-xs bg-muted/30 px-3 py-2 border border-border"
                      data-ocid={`encounter.cpt.item.${idx + 1}`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="font-mono font-semibold text-foreground flex-shrink-0">
                          {cpt.code}
                        </span>
                        <span className="text-muted-foreground truncate">
                          {cpt.description}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                        <span className="text-muted-foreground">
                          ×{cpt.qty}
                        </span>
                        <span className="font-medium text-foreground w-16 text-right">
                          {cpt.unitPrice > 0
                            ? `$${(cpt.qty * cpt.unitPrice).toFixed(2)}`
                            : "—"}
                        </span>
                        <button
                          type="button"
                          data-ocid={`encounter.cpt.delete_button.${idx + 1}`}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => handleRemoveCpt(cpt.id)}
                          aria-label="Remove CPT code"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                <div className="space-y-1 w-28">
                  <label
                    htmlFor="cpt-code"
                    className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    CPT Code
                  </label>
                  <Input
                    id="cpt-code"
                    data-ocid="encounter.cpt.code.input"
                    placeholder="e.g. 99214"
                    value={newCptCode}
                    onChange={(e) => setNewCptCode(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <label
                    htmlFor="cpt-desc"
                    className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    Description
                  </label>
                  <Input
                    id="cpt-desc"
                    data-ocid="encounter.cpt.desc.input"
                    placeholder="Procedure description"
                    value={newCptDesc}
                    onChange={(e) => setNewCptDesc(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <Button
                  data-ocid="encounter.cpt.add_button"
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddCustomCpt}
                  disabled={!newCptCode.trim()}
                  className="h-8 gap-1.5 flex-shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </Button>
              </div>

              {total > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs font-medium text-muted-foreground">
                    Estimated Total
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    ${total.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Actions bar */}
      {!isSigned && (
        <div
          className="border border-border bg-card px-5 py-3 flex items-center justify-between"
          data-ocid="encounter.actions.panel"
        >
          <p className="text-xs text-muted-foreground">
            Document thoroughly before signing. Signed notes cannot be edited.
          </p>
          <div className="flex items-center gap-3">
            <Button
              data-ocid="encounter.save_button"
              size="sm"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              data-ocid="encounter.primary_button"
              onClick={handleSignClose}
              disabled={isSigning}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              {isSigning ? "Signing..." : "Sign & Close Encounter"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
