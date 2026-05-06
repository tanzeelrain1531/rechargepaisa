export interface OrderSetItem {
  type: "lab" | "imaging";
  name: string;
}

export interface OrderSet {
  id: string;
  name: string;
  description: string;
  orders: OrderSetItem[];
}

export const ORDER_SETS: OrderSet[] = [
  {
    id: "annual-physical",
    name: "Annual Physical",
    description: "Standard preventive health screening panel",
    orders: [
      { type: "lab", name: "CBC" },
      { type: "lab", name: "CMP (Comprehensive Metabolic Panel)" },
      { type: "lab", name: "Lipid Panel" },
      { type: "lab", name: "HbA1c" },
      { type: "lab", name: "TSH" },
      { type: "lab", name: "Urinalysis" },
      { type: "imaging", name: "12-Lead ECG" },
    ],
  },
  {
    id: "diabetic-workup",
    name: "Diabetic Workup",
    description: "Comprehensive diabetes monitoring and complication screening",
    orders: [
      { type: "lab", name: "HbA1c" },
      { type: "lab", name: "Fasting Glucose" },
      { type: "lab", name: "CMP (Comprehensive Metabolic Panel)" },
      { type: "lab", name: "Urine Microalbumin" },
      { type: "lab", name: "Lipid Panel" },
      { type: "imaging", name: "Ophthalmology Referral" },
    ],
  },
  {
    id: "cardiac-workup",
    name: "Cardiac Workup",
    description: "Acute and baseline cardiac evaluation panel",
    orders: [
      { type: "imaging", name: "12-Lead ECG" },
      { type: "lab", name: "Troponin I (High Sensitivity)" },
      { type: "lab", name: "BMP (Basic Metabolic Panel)" },
      { type: "imaging", name: "Chest X-Ray" },
      { type: "lab", name: "BNP (B-type Natriuretic Peptide)" },
    ],
  },
  {
    id: "hypertension-panel",
    name: "Hypertension Panel",
    description:
      "Evaluate secondary causes and end-organ effects of hypertension",
    orders: [
      { type: "lab", name: "BMP (Basic Metabolic Panel)" },
      { type: "lab", name: "CBC" },
      { type: "lab", name: "Urinalysis" },
      { type: "lab", name: "Lipid Panel" },
      { type: "imaging", name: "12-Lead ECG" },
      { type: "imaging", name: "Renal Ultrasound" },
    ],
  },
  {
    id: "pre-op-panel",
    name: "Pre-op Panel",
    description: "Preoperative clearance laboratory and imaging workup",
    orders: [
      { type: "lab", name: "CBC" },
      { type: "lab", name: "BMP (Basic Metabolic Panel)" },
      { type: "lab", name: "PT/INR" },
      { type: "lab", name: "PTT" },
      { type: "lab", name: "Type & Screen" },
      { type: "imaging", name: "12-Lead ECG" },
      { type: "imaging", name: "Chest X-Ray" },
    ],
  },
  {
    id: "thyroid-panel",
    name: "Thyroid Panel",
    description: "Comprehensive thyroid function and autoimmune evaluation",
    orders: [
      { type: "lab", name: "TSH" },
      { type: "lab", name: "Free T4" },
      { type: "lab", name: "Free T3" },
      { type: "lab", name: "Anti-TPO Antibodies" },
    ],
  },
  {
    id: "renal-panel",
    name: "Renal Panel",
    description: "Assess renal function and detect early kidney disease",
    orders: [
      { type: "lab", name: "BMP (Basic Metabolic Panel)" },
      { type: "lab", name: "Urinalysis" },
      { type: "lab", name: "Urine Microalbumin/Creatinine Ratio" },
      { type: "imaging", name: "Renal Ultrasound" },
    ],
  },
];
