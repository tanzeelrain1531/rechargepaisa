import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export interface SmartPhrase {
  id: number;
  trigger: string;
  title: string;
  expansion: string;
  scope: "personal" | "clinic";
}

export const CLINIC_PHRASES: SmartPhrase[] = [
  {
    id: 1,
    trigger: ".normexam",
    title: "Normal Physical Exam",
    expansion:
      "General: Alert and oriented x3, in no acute distress. HEENT: Normocephalic, atraumatic. Pupils equal, round, and reactive to light. PERRLA. Neck: Supple, no lymphadenopathy. Cardiovascular: Regular rate and rhythm. No murmurs, rubs, or gallops. Pulmonary: Clear to auscultation bilaterally. No wheezes, rales, or rhonchi. Abdomen: Soft, non-tender, non-distended. Normoactive bowel sounds. Extremities: No cyanosis, clubbing, or edema. Neuro: Cranial nerves II–XII intact.",
    scope: "clinic",
  },
  {
    id: 2,
    trigger: ".ros",
    title: "Review of Systems — Negative",
    expansion:
      "Constitutional: Denies fever, chills, weight loss, or fatigue. HEENT: Denies headache, vision changes, hearing loss, or sore throat. Cardiovascular: Denies chest pain, palpitations, or lower extremity edema. Pulmonary: Denies shortness of breath, cough, or hemoptysis. GI: Denies nausea, vomiting, diarrhea, constipation, or abdominal pain. GU: Denies dysuria, hematuria, or frequency. Musculoskeletal: Denies joint pain, muscle pain, or stiffness. Neurological: Denies headache, dizziness, syncope, or numbness. Psychiatric: Denies depression, anxiety, or suicidal ideation.",
    scope: "clinic",
  },
  {
    id: 3,
    trigger: ".medrec",
    title: "Medication Reconciliation Note",
    expansion:
      "Medication reconciliation performed today. Patient's current medication list was reviewed and reconciled with pharmacy records and previous encounter documentation. Patient verbally confirmed all medications, doses, and frequencies. Discrepancies identified and resolved. Updated medication list provided to patient.",
    scope: "clinic",
  },
  {
    id: 4,
    trigger: ".dm2",
    title: "Type 2 Diabetes Management Plan",
    expansion:
      "Type 2 diabetes mellitus: HbA1c reviewed and discussed with patient. Current glycemic control assessed. Dietary counseling provided emphasizing low-glycemic index foods, portion control, and carbohydrate counting. Exercise recommendations: 150 minutes moderate-intensity activity per week. Medication compliance reviewed. Foot exam performed. Ophthalmology referral ordered for annual dilated eye exam. Nephrology follow-up arranged if indicated.",
    scope: "clinic",
  },
  {
    id: 5,
    trigger: ".htnplan",
    title: "Hypertension Management Plan",
    expansion:
      "Hypertension: Blood pressure reviewed and compared to prior values. DASH diet counseling provided — emphasis on sodium restriction (<1500 mg/day), increased potassium-rich foods, and weight management if applicable. Alcohol and tobacco cessation discussed. Home blood pressure monitoring encouraged. Medication compliance and side effects reviewed. Follow-up in 4–6 weeks for BP recheck.",
    scope: "clinic",
  },
  {
    id: 6,
    trigger: ".followup",
    title: "Standard Follow-up Instructions",
    expansion:
      "Patient instructed to follow up in 2 weeks. Patient to return sooner or go to the emergency department if symptoms worsen, new symptoms develop, or if there is any concern for acute change in condition. Patient verbalized understanding of instructions and has no further questions at this time. All questions addressed.",
    scope: "clinic",
  },
  {
    id: 7,
    trigger: ".dxplan",
    title: "Discharge Planning Note",
    expansion:
      "Patient meets criteria for discharge today. Discharge instructions reviewed with patient and family in detail. Medications reconciled and explained. Warning signs and return precautions clearly communicated. Follow-up appointment scheduled. Patient demonstrates understanding and agrees to the plan. All questions answered satisfactorily.",
    scope: "clinic",
  },
  {
    id: 8,
    trigger: ".preventive",
    title: "Preventive Care Review",
    expansion:
      "Preventive care review completed. Immunization status updated. Age-appropriate cancer screenings reviewed and ordered as indicated. Cholesterol screening discussed. BMI calculated and nutritional counseling provided as appropriate. Tobacco, alcohol, and substance use assessed. Mental health screening completed using PHQ-9 and GAD-7. Patient counseled on importance of ongoing preventive care.",
    scope: "clinic",
  },
  {
    id: 9,
    trigger: ".consent",
    title: "Informed Consent Documentation",
    expansion:
      "Informed consent obtained. The nature of the proposed procedure/treatment, expected benefits, material risks, alternatives, and consequences of refusal were discussed in detail with the patient. The patient had the opportunity to ask questions, which were answered to their satisfaction. The patient demonstrated understanding and provided verbal/written consent to proceed.",
    scope: "clinic",
  },
  {
    id: 10,
    trigger: ".noshow",
    title: "No-Show / Missed Appointment Note",
    expansion:
      "Patient did not appear for scheduled appointment today. Clinic staff attempted to contact patient by telephone — [leave/no answer/spoke to patient]. Appointment rescheduled / patient instructed to call to reschedule. Patient's medications will not be refilled until follow-up appointment is completed. Patient advised to contact clinic if symptoms worsen or if urgent care is needed.",
    scope: "clinic",
  },
  {
    id: 11,
    trigger: ".normcv",
    title: "Normal Cardiovascular Exam",
    expansion:
      "Cardiovascular: Regular rate and rhythm. S1 and S2 present, normal intensity. No S3 or S4 gallop. No murmurs, rubs, or clicks appreciated. Point of maximal impulse non-displaced. Jugular venous pressure not elevated. Peripheral pulses 2+ bilaterally. No lower extremity edema, cyanosis, or clubbing. Capillary refill less than 2 seconds.",
    scope: "clinic",
  },
  {
    id: 12,
    trigger: ".normpulm",
    title: "Normal Pulmonary Exam",
    expansion:
      "Pulmonary: Respiratory rate within normal limits. No accessory muscle use or nasal flaring. Trachea midline. Chest expansion symmetric bilaterally. Percussion resonant throughout. Breath sounds clear to auscultation in all lung fields. No wheezes, rales, rhonchi, or pleural friction rub. No dullness to percussion.",
    scope: "clinic",
  },
  {
    id: 13,
    trigger: ".normabdo",
    title: "Normal Abdominal Exam",
    expansion:
      "Abdomen: Soft, non-tender, non-distended. No voluntary or involuntary guarding. No rigidity. Normoactive bowel sounds in all four quadrants. No hepatosplenomegaly appreciated on palpation. No masses. No rebound tenderness. Murphy's sign negative. No costovertebral angle tenderness.",
    scope: "clinic",
  },
  {
    id: 14,
    trigger: ".normneurо",
    title: "Normal Neurological Exam",
    expansion:
      "Neurological: Alert and oriented to person, place, and time. Cranial nerves II–XII grossly intact. Motor strength 5/5 in all four extremities. Sensation intact to light touch and proprioception. Deep tendon reflexes 2+ and symmetric. Coordination intact. Gait normal, steady, without ataxia. No tremor. Babinski sign downgoing bilaterally.",
    scope: "clinic",
  },
  {
    id: 15,
    trigger: ".dm2plan",
    title: "Type 2 DM Assessment & Plan",
    expansion:
      "Assessment: Type 2 diabetes mellitus (E11.9). HbA1c [value]% — [above/at/below] target. Plan: (1) Continue/adjust [medication] as below. (2) Reinforce low-glycemic index diet and 150 min/week moderate exercise. (3) Self-monitoring blood glucose — target fasting 80–130, post-prandial <180. (4) Foot exam performed today. (5) Order HbA1c in 3 months. (6) Refer ophthalmology if not seen in past 12 months. (7) Annual urine microalbumin and renal function panel ordered. Return in 3 months.",
    scope: "clinic",
  },
  {
    id: 16,
    trigger: ".chfplan",
    title: "Congestive Heart Failure Plan",
    expansion:
      "Assessment: Congestive heart failure (I50.9) — [NYHA class I/II/III/IV]. Last echo EF [value]%. Plan: (1) Optimize guideline-directed medical therapy: ACE inhibitor/ARB/ARNI, beta-blocker, mineralocorticoid receptor antagonist, SGLT2 inhibitor as tolerated. (2) Strict daily weights — contact clinic if gain >2 lbs in 24h or >5 lbs in one week. (3) Fluid restriction 1.5–2 L/day. Sodium <2 g/day. (4) Adjust diuretic dose based on volume status. (5) BMP in 1–2 weeks to monitor electrolytes and renal function. (6) Cardiology follow-up in 4 weeks or sooner if decompensation.",
    scope: "clinic",
  },
  {
    id: 17,
    trigger: ".copdplan",
    title: "COPD Management Plan",
    expansion:
      "Assessment: Chronic obstructive pulmonary disease (J44.1), [GOLD stage I/II/III/IV]. Plan: (1) Optimize bronchodilator therapy — LABA/LAMA combination as first line; consider ICS if frequent exacerbations. (2) Smoking cessation strongly recommended — NRT/pharmacotherapy offered. (3) Pulmonary rehabilitation referral placed. (4) Influenza and pneumococcal vaccines up to date. (5) Oxygen therapy if SpO2 ≤88% at rest. (6) Action plan for exacerbations reviewed with patient — oral corticosteroids and antibiotics at home if criteria met. Pulmonology follow-up in 3 months.",
    scope: "clinic",
  },
  {
    id: 18,
    trigger: ".followup2wk",
    title: "Follow-up in 2 Weeks",
    expansion:
      "Patient instructed to follow up in 2 weeks. Appointment scheduled. Patient to return sooner or present to the emergency department if symptoms worsen, new symptoms develop, fever exceeds 101°F, or if there is any acute change in condition. Patient verbalized understanding of return precautions and has no further questions at this time.",
    scope: "clinic",
  },
  {
    id: 19,
    trigger: ".followup1mo",
    title: "Follow-up in 1 Month",
    expansion:
      "Patient instructed to follow up in approximately 4 weeks. Labs ordered today — results will be available for review at the follow-up visit. Patient to call the clinic if results require earlier attention or if symptoms change in the interim. After-visit summary provided. Patient confirmed understanding of instructions.",
    scope: "clinic",
  },
  {
    id: 20,
    trigger: ".discharge",
    title: "Discharge Instructions",
    expansion:
      "Discharge instructions reviewed in detail with patient and family member/caregiver present. Diagnoses explained in patient-appropriate language. New medications reviewed — name, purpose, dose, frequency, and common side effects discussed. Activity restrictions: [specify]. Diet instructions: [specify]. Wound care instructions provided if applicable. Follow-up appointment scheduled with [provider] on [date]. Patient advised to call 911 or go to nearest ER for [list warning signs]. Patient demonstrated understanding and agreement with the discharge plan. Questions addressed satisfactorily.",
    scope: "clinic",
  },
  {
    id: 21,
    trigger: ".ccchestpain",
    title: "Chief Complaint — Chest Pain",
    expansion:
      "Chief Complaint: Chest pain. HPI: Patient presents with [onset] chest pain. Character: [sharp/dull/pressure/tightness/burning]. Location: [substernal/left-sided/right-sided/diffuse]. Radiation: [to left arm/jaw/back/none]. Severity: [X/10]. Duration: [duration]. Aggravating factors: [exertion/inspiration/palpation/lying flat]. Relieving factors: [rest/nitroglycerin/antacids/position change]. Associated symptoms: [diaphoresis/dyspnea/nausea/palpitations/syncope/none]. Cardiac history: [relevant PMH]. Risk factors: [HTN/DM/smoking/hyperlipidemia/family history].",
    scope: "clinic",
  },
  {
    id: 22,
    trigger: ".ccdyspnea",
    title: "Chief Complaint — Dyspnea",
    expansion:
      "Chief Complaint: Shortness of breath / dyspnea. HPI: Patient presents with shortness of breath onset [acute/subacute/gradual] over [duration]. Severity: [X/10]; [ambulatory/limits activity/at rest]. Orthopnea: [pillows]. PND: [yes/no]. Pleuritic quality: [yes/no]. Associated symptoms: [cough/fever/wheezing/hemoptysis/leg swelling/chest pain/palpitations/none]. Baseline pulmonary/cardiac function: [prior diagnosis/baseline exercise tolerance]. Exposures: [sick contacts/travel/allergens/occupational].",
    scope: "clinic",
  },
  {
    id: 23,
    trigger: ".ccfatigue",
    title: "Chief Complaint — Fatigue",
    expansion:
      "Chief Complaint: Fatigue / low energy. HPI: Patient reports fatigue and decreased energy level, onset [duration], [progressive/stable/fluctuating]. Severity impacts [work/daily activities/exercise tolerance]. Associated symptoms: [insomnia/hypersomnia/weight change/appetite change/depressed mood/anhedonia/cold/heat intolerance/polyuria/polydipsia/dyspnea on exertion/pallor/none]. Review of systems: [per full ROS]. Pertinent PMH: [thyroid disease/anemia/DM/depression/CHF/CKD/malignancy]. Current medications reviewed for fatigue as side effect.",
    scope: "clinic",
  },
];

export const PERSONAL_PHRASES: SmartPhrase[] = [
  {
    id: 101,
    trigger: ".myexam",
    title: "My Standard Exam Template",
    expansion:
      "General: Patient appears well-nourished, well-developed, and in no acute distress. Alert and cooperative. Vital signs stable. Focused exam performed as relevant to chief complaint. Detailed findings documented in subsequent sections.",
    scope: "personal",
  },
  {
    id: 102,
    trigger: ".tbfu",
    title: "TB Follow-up Note",
    expansion:
      "Tuberculosis follow-up visit. Patient tolerated therapy well. No significant side effects reported. Sputum cultures reviewed. Adherence to directly observed therapy confirmed. Patient counseled on importance of completing full course of therapy and infection control measures.",
    scope: "personal",
  },
  {
    id: 103,
    trigger: ".ckdnote",
    title: "CKD Progress Note",
    expansion:
      "Chronic kidney disease: eGFR and creatinine reviewed and trended. Blood pressure control assessed. ACE inhibitor/ARB therapy optimized. Dietary protein restriction discussed. Nephrotoxic medications avoided. Anemia of CKD assessed. Phosphorus, calcium, and PTH levels reviewed. Patient referred for nephrology follow-up as indicated.",
    scope: "personal",
  },
  {
    id: 104,
    trigger: ".codestat",
    title: "Code Status Discussion",
    expansion:
      "Goals of care and code status discussed with patient [and family/healthcare proxy]. Patient's values, wishes, and understanding of prognosis reviewed in detail. Questions addressed. Patient expressed [wishes regarding CPR, intubation, mechanical ventilation, and other life-sustaining measures]. Advance directive reviewed and [updated / maintained as previously documented]. POLST form completed as appropriate.",
    scope: "personal",
  },
  {
    id: 105,
    trigger: ".painassess",
    title: "Pain Assessment Note",
    expansion:
      "Pain assessment performed. Location: [location]. Character: [sharp/dull/burning/aching]. Severity: [X/10] on numeric rating scale. Onset: [date/duration]. Radiation: [yes/no — describe]. Aggravating factors: [factors]. Relieving factors: [factors]. Associated symptoms: [nausea/vomiting/fever/other]. Current pain medications reviewed. Functional impact assessed. Plan for pain management discussed with patient.",
    scope: "personal",
  },
  {
    id: 106,
    trigger: ".preop",
    title: "Pre-operative Assessment",
    expansion:
      "Pre-operative assessment completed. Patient scheduled for [procedure] on [date]. ASA class: [I/II/III/IV]. Cardiac risk: [low/intermediate/high] — [Lee RCRI score]. Pulmonary risk: [low/intermediate/high]. Medications reviewed: [held/continued]. NPO instructions communicated: nothing after midnight for solids; clear liquids until 2h before procedure. Anesthesia pre-assessment referral placed if indicated. Labs/EKG/imaging reviewed as appropriate. Patient consented and questions answered.",
    scope: "personal",
  },
  {
    id: 107,
    trigger: ".asthmaplan",
    title: "Asthma Assessment & Plan",
    expansion:
      "Assessment: Asthma (J45.xx) — [intermittent/mild persistent/moderate persistent/severe persistent], [well-controlled/partially controlled/uncontrolled]. Spirometry/PFTs last done [date]. Plan: (1) Rescue inhaler: albuterol MDI 2 puffs PRN every 4h. (2) Controller: [ICS/ICS-LABA as appropriate]. (3) Trigger avoidance counseling. (4) Written asthma action plan updated. (5) Referral to pulmonology if uncontrolled. (6) FeNO or spirometry ordered. Follow-up in 4–6 weeks.",
    scope: "personal",
  },
  {
    id: 108,
    trigger: ".ckdplan",
    title: "CKD Assessment & Plan",
    expansion:
      "Assessment: Chronic kidney disease (N18.x), stage [1–5], eGFR [value] mL/min/1.73m². Plan: (1) Optimize BP to <130/80; prefer ACE inhibitor/ARB for proteinuria. (2) Restrict dietary protein 0.8 g/kg/day and sodium <2 g/day. (3) Avoid NSAIDs and nephrotoxins. (4) Monitor BMP, CBC, phosphorus, PTH every [3/6] months. (5) Anemia management if Hgb <10 — iron studies, erythropoietin as indicated. (6) Nephrology referral if eGFR <30 or complex management. (7) Prepare for renal replacement therapy discussion if eGFR trending downward.",
    scope: "personal",
  },
];

interface PhraseRowProps {
  phrase: SmartPhrase;
  idx: number;
  canEdit: boolean;
  onDelete?: (id: number) => void;
  onSave?: (phrase: SmartPhrase) => void;
}

function PhraseRow({ phrase, idx, canEdit, onDelete, onSave }: PhraseRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    trigger: phrase.trigger,
    title: phrase.title,
    expansion: phrase.expansion,
  });

  const handleSave = () => {
    onSave?.({ ...phrase, ...editForm });
    setEditing(false);
  };

  return (
    <div
      className="border-b border-border last:border-0"
      data-ocid={`smartphrases.item.${idx + 1}`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <code className="text-xs font-mono font-semibold px-2 py-0.5 rounded-sm flex-shrink-0 bg-primary/10 text-primary">
          {phrase.trigger}
        </code>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-foreground truncate">
            {phrase.title}
          </p>
          {!expanded && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {phrase.expansion.slice(0, 80)}...
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            data-ocid={`smartphrases.toggle.${idx + 1}`}
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-muted/40"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {canEdit && (
            <>
              <button
                type="button"
                data-ocid={`smartphrases.edit_button.${idx + 1}`}
                onClick={() => {
                  setEditing((v) => !v);
                  setExpanded(true);
                }}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-muted/40"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                data-ocid={`smartphrases.delete_button.${idx + 1}`}
                onClick={() => onDelete?.(phrase.id)}
                className="p-1.5 text-destructive hover:text-destructive transition-colors rounded-sm hover:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          {editing ? (
            <div className="space-y-3 bg-muted/30 border border-border rounded-sm p-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor={`sp-trigger-${idx}`}
                    className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
                  >
                    Trigger
                  </label>
                  <Input
                    id={`sp-trigger-${idx}`}
                    data-ocid={`smartphrases.trigger.input.${idx + 1}`}
                    value={editForm.trigger}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, trigger: e.target.value }))
                    }
                    className="h-7 text-xs font-mono"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`sp-title-${idx}`}
                    className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
                  >
                    Title
                  </label>
                  <Input
                    id={`sp-title-${idx}`}
                    data-ocid={`smartphrases.title.input.${idx + 1}`}
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, title: e.target.value }))
                    }
                    className="h-7 text-xs"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor={`sp-expansion-${idx}`}
                  className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
                >
                  Expansion Text
                </label>
                <Textarea
                  id={`sp-expansion-${idx}`}
                  data-ocid={`smartphrases.expansion.textarea.${idx + 1}`}
                  value={editForm.expansion}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, expansion: e.target.value }))
                  }
                  rows={4}
                  className="text-xs"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  data-ocid={`smartphrases.save_button.${idx + 1}`}
                  onClick={handleSave}
                  className="h-6 text-xs px-3"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  data-ocid={`smartphrases.cancel_button.${idx + 1}`}
                  onClick={() => setEditing(false)}
                  className="h-6 text-xs px-3"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="px-3 py-2.5 bg-muted/30 border border-border rounded-sm text-[12px] text-foreground leading-relaxed whitespace-pre-wrap"
              data-ocid={`smartphrases.expansion.panel.${idx + 1}`}
            >
              {phrase.expansion}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AddPhraseForm({
  onSave,
  onCancel,
}: {
  onSave: (p: Omit<SmartPhrase, "id" | "scope">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ trigger: ".", title: "", expansion: "" });

  return (
    <div
      className="p-4 bg-muted/30 border border-border rounded-sm space-y-3"
      data-ocid="smartphrases.add.panel"
    >
      <p className="text-xs font-semibold text-foreground">New SmartPhrase</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="sp-add-trigger"
            className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
          >
            Trigger (starts with .)
          </label>
          <Input
            id="sp-add-trigger"
            data-ocid="smartphrases.add.trigger.input"
            value={form.trigger}
            onChange={(e) =>
              setForm((p) => ({ ...p, trigger: e.target.value }))
            }
            placeholder=".mytrigger"
            className="h-7 text-xs font-mono"
          />
        </div>
        <div>
          <label
            htmlFor="sp-add-title"
            className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
          >
            Title
          </label>
          <Input
            id="sp-add-title"
            data-ocid="smartphrases.add.title.input"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Phrase name"
            className="h-7 text-xs"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="sp-add-expansion"
          className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1"
        >
          Expansion Text
        </label>
        <Textarea
          id="sp-add-expansion"
          data-ocid="smartphrases.add.expansion.textarea"
          value={form.expansion}
          onChange={(e) =>
            setForm((p) => ({ ...p, expansion: e.target.value }))
          }
          placeholder="Type the full text that will be inserted..."
          rows={4}
          className="text-xs"
        />
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          data-ocid="smartphrases.add.save_button"
          onClick={() => {
            if (
              form.trigger.trim() &&
              form.title.trim() &&
              form.expansion.trim()
            ) {
              onSave(form);
            }
          }}
          className="h-7 text-xs"
        >
          Save Phrase
        </Button>
        <Button
          size="sm"
          variant="ghost"
          data-ocid="smartphrases.add.cancel_button"
          onClick={onCancel}
          className="h-7 text-xs"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function SmartPhrases() {
  const loading = false;
  const [clinicPhrases, setClinicPhrases] =
    useState<SmartPhrase[]>(CLINIC_PHRASES);
  const [personalPhrases, setPersonalPhrases] =
    useState<SmartPhrase[]>(PERSONAL_PHRASES);
  const [showAddPersonal, setShowAddPersonal] = useState(false);
  const [showAddClinic, setShowAddClinic] = useState(false);

  // In a real app, role would come from context
  const isAdmin = false; // Default to Doctor role; admins would have this = true

  const handleDeletePersonal = (id: number) => {
    setPersonalPhrases((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDeleteClinic = (id: number) => {
    setClinicPhrases((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddPersonal = (p: Omit<SmartPhrase, "id" | "scope">) => {
    setPersonalPhrases((prev) => [
      ...prev,
      { ...p, id: Date.now(), scope: "personal" },
    ]);
    setShowAddPersonal(false);
  };

  const handleAddClinic = (p: Omit<SmartPhrase, "id" | "scope">) => {
    setClinicPhrases((prev) => [
      ...prev,
      { ...p, id: Date.now(), scope: "clinic" },
    ]);
    setShowAddClinic(false);
  };

  const handleSavePersonal = (updated: SmartPhrase) => {
    setPersonalPhrases((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p)),
    );
  };

  const handleSaveClinic = (updated: SmartPhrase) => {
    setClinicPhrases((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p)),
    );
  };

  if (loading) {
    return (
      <div className="space-y-4" data-ocid="smart_phrases.loading_state">
        <Skeleton className="h-9 w-48" />
        {[1, 2, 3, 4, 5].map((k) => (
          <Skeleton key={k} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="smartphrases.page">
      <p className="text-[13px] text-muted-foreground">
        SmartPhrases let you insert pre-built text snippets into clinical notes.
        Type <code className="text-xs bg-muted px-1 py-0.5 rounded">.</code> in
        any SOAP note field to browse your phrases.
      </p>

      <Tabs defaultValue="personal">
        <TabsList
          className="w-full justify-start rounded-none border-b border-border bg-transparent px-0 h-10 gap-0"
          data-ocid="smartphrases.tab"
        >
          <TabsTrigger
            value="personal"
            data-ocid="smartphrases.personal.tab"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-xs font-medium px-4 h-10"
          >
            My Phrases ({personalPhrases.length})
          </TabsTrigger>
          <TabsTrigger
            value="clinic"
            data-ocid="smartphrases.clinic.tab"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-xs font-medium px-4 h-10"
          >
            Clinic Phrases ({clinicPhrases.length})
          </TabsTrigger>
        </TabsList>

        <div className="pt-4">
          {/* Personal phrases */}
          <TabsContent value="personal" className="mt-0 space-y-4">
            <div className="flex justify-end">
              <Button
                size="sm"
                data-ocid="smartphrases.personal.open_modal_button"
                onClick={() => setShowAddPersonal((v) => !v)}
                variant="outline"
                className="h-7 text-xs gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> New Phrase
              </Button>
            </div>
            {showAddPersonal && (
              <AddPhraseForm
                onSave={handleAddPersonal}
                onCancel={() => setShowAddPersonal(false)}
              />
            )}
            <div className="bg-card border border-border rounded-sm divide-y divide-border">
              {personalPhrases.length === 0 ? (
                <p
                  className="px-4 py-8 text-center text-[13px] text-muted-foreground"
                  data-ocid="smartphrases.personal.empty_state"
                >
                  No personal phrases yet. Click &quot;New Phrase&quot; to
                  create your first one.
                </p>
              ) : (
                personalPhrases.map((p, idx) => (
                  <PhraseRow
                    key={p.id}
                    phrase={p}
                    idx={idx}
                    canEdit={true}
                    onDelete={handleDeletePersonal}
                    onSave={handleSavePersonal}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* Clinic phrases */}
          <TabsContent value="clinic" className="mt-0 space-y-4">
            <div className="flex justify-end">
              {isAdmin && (
                <Button
                  size="sm"
                  data-ocid="smartphrases.clinic.open_modal_button"
                  onClick={() => setShowAddClinic((v) => !v)}
                  variant="outline"
                  className="h-7 text-xs gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> New Clinic Phrase
                </Button>
              )}
            </div>
            {showAddClinic && (
              <AddPhraseForm
                onSave={handleAddClinic}
                onCancel={() => setShowAddClinic(false)}
              />
            )}
            <div className="bg-card border border-border rounded-sm">
              {clinicPhrases.length === 0 ? (
                <p
                  className="px-4 py-8 text-center text-[13px] text-muted-foreground"
                  data-ocid="smartphrases.clinic.empty_state"
                >
                  No clinic phrases defined.
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {clinicPhrases.map((p, idx) => (
                    <PhraseRow
                      key={p.id}
                      phrase={p}
                      idx={idx}
                      canEdit={isAdmin}
                      onSave={handleSaveClinic}
                      onDelete={isAdmin ? handleDeleteClinic : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
