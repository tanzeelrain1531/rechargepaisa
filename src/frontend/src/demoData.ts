const now = BigInt(Date.now()) * 1_000_000n;
const day = 86_400_000_000_000n;

function daysAgo(d: number): bigint {
  return now - BigInt(d) * day;
}

function todayStr(): string {
  return new Date().toISOString();
}

function dateStr(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  return d.toISOString();
}

const demoPrincipal = { toString: () => "demo-principal-2vxsx-fae" };

export const DEMO_PATIENTS = [
  {
    id: 1n,
    name: "Margaret Chen",
    dateOfBirth: "1968-03-15",
    phone: "(555) 234-5678",
    email: "m.chen@email.com",
    mrn: "MRN-001",
  },
  {
    id: 2n,
    name: "Robert Okonkwo",
    dateOfBirth: "1954-07-22",
    phone: "(555) 345-6789",
    email: "r.okonkwo@email.com",
    mrn: "MRN-002",
  },
  {
    id: 3n,
    name: "Sophia Martinez",
    dateOfBirth: "1982-11-08",
    phone: "(555) 456-7890",
    email: "s.martinez@email.com",
    mrn: "MRN-003",
  },
  {
    id: 4n,
    name: "James Thornton",
    dateOfBirth: "1975-01-30",
    phone: "(555) 567-8901",
    email: "j.thornton@email.com",
    mrn: "MRN-004",
  },
  {
    id: 5n,
    name: "Aisha Patel",
    dateOfBirth: "1990-06-14",
    phone: "(555) 678-9012",
    email: "a.patel@email.com",
    mrn: "MRN-005",
  },
  {
    id: 6n,
    name: "William Park",
    dateOfBirth: "1961-09-17",
    phone: "(555) 789-0123",
    email: "w.park@email.com",
    mrn: "MRN-006",
  },
  {
    id: 7n,
    name: "Eleanor Walsh",
    dateOfBirth: "1948-04-03",
    phone: "(555) 890-1234",
    email: "e.walsh@email.com",
    mrn: "MRN-007",
  },
  {
    id: 8n,
    name: "Carlos Gutierrez",
    dateOfBirth: "1979-12-22",
    phone: "(555) 901-2345",
    email: "c.gutierrez@email.com",
    mrn: "MRN-008",
  },
  {
    id: 9n,
    name: "Priya Nair",
    dateOfBirth: "1965-06-11",
    phone: "(555) 012-3456",
    email: "p.nair@email.com",
    mrn: "MRN-009",
  },
  {
    id: 10n,
    name: "David Kimani",
    dateOfBirth: "1987-02-28",
    phone: "(555) 123-4567",
    email: "d.kimani@email.com",
    mrn: "MRN-010",
  },
];

export const DEMO_APPOINTMENTS = [
  {
    id: 1n,
    patientId: 1n,
    providerId: 10n,
    date: todayStr(),
    status: "scheduled",
  },
  {
    id: 2n,
    patientId: 2n,
    providerId: 10n,
    date: todayStr(),
    status: "scheduled",
  },
  {
    id: 3n,
    patientId: 3n,
    providerId: 10n,
    date: todayStr(),
    status: "completed",
  },
  {
    id: 4n,
    patientId: 4n,
    providerId: 10n,
    date: dateStr(1),
    status: "completed",
  },
  {
    id: 5n,
    patientId: 5n,
    providerId: 10n,
    date: dateStr(2),
    status: "completed",
  },
  {
    id: 6n,
    patientId: 1n,
    providerId: 10n,
    date: dateStr(7),
    status: "completed",
  },
  {
    id: 7n,
    patientId: 2n,
    providerId: 10n,
    date: dateStr(14),
    status: "no-show",
  },
  {
    id: 8n,
    patientId: 6n,
    providerId: 10n,
    date: todayStr(),
    status: "scheduled",
  },
  {
    id: 9n,
    patientId: 7n,
    providerId: 10n,
    date: dateStr(1),
    status: "completed",
  },
  {
    id: 10n,
    patientId: 8n,
    providerId: 10n,
    date: todayStr(),
    status: "scheduled",
  },
  {
    id: 11n,
    patientId: 9n,
    providerId: 10n,
    date: dateStr(3),
    status: "completed",
  },
  {
    id: 12n,
    patientId: 10n,
    providerId: 10n,
    date: dateStr(5),
    status: "completed",
  },
];

export const DEMO_LAB_RESULTS = [
  {
    id: 1n,
    patientId: 1n,
    testName: "HbA1c",
    result: "8.2",
    unit: "%",
    isCritical: false,
  },
  {
    id: 2n,
    patientId: 1n,
    testName: "Fasting Glucose",
    result: "182",
    unit: "mg/dL",
    isCritical: true,
  },
  {
    id: 3n,
    patientId: 2n,
    testName: "Serum Potassium",
    result: "2.9",
    unit: "mEq/L",
    isCritical: true,
  },
  {
    id: 4n,
    patientId: 2n,
    testName: "Creatinine",
    result: "1.1",
    unit: "mg/dL",
    isCritical: false,
  },
  {
    id: 5n,
    patientId: 3n,
    testName: "TSH",
    result: "2.4",
    unit: "mIU/L",
    isCritical: false,
  },
  {
    id: 6n,
    patientId: 4n,
    testName: "Lipid Panel - LDL",
    result: "142",
    unit: "mg/dL",
    isCritical: false,
  },
  {
    id: 7n,
    patientId: 5n,
    testName: "CBC - WBC",
    result: "7.2",
    unit: "10^3/μL",
    isCritical: false,
  },
  {
    id: 8n,
    patientId: 6n,
    testName: "Spirometry FEV1",
    result: "42",
    unit: "% predicted",
    isCritical: true,
  },
  {
    id: 9n,
    patientId: 6n,
    testName: "Oxygen Saturation",
    result: "88",
    unit: "%",
    isCritical: false,
  },
  {
    id: 10n,
    patientId: 7n,
    testName: "DEXA T-Score Spine",
    result: "-2.8",
    unit: "SD",
    isCritical: false,
  },
  {
    id: 11n,
    patientId: 7n,
    testName: "TSH",
    result: "9.4",
    unit: "mIU/L",
    isCritical: false,
  },
  {
    id: 12n,
    patientId: 8n,
    testName: "Blood Pressure",
    result: "158/96",
    unit: "mmHg",
    isCritical: false,
  },
  {
    id: 13n,
    patientId: 8n,
    testName: "Cortisol AM",
    result: "22",
    unit: "mcg/dL",
    isCritical: false,
  },
  {
    id: 14n,
    patientId: 9n,
    testName: "eGFR",
    result: "32",
    unit: "mL/min/1.73m²",
    isCritical: true,
  },
  {
    id: 15n,
    patientId: 9n,
    testName: "Hemoglobin",
    result: "8.2",
    unit: "g/dL",
    isCritical: false,
  },
  {
    id: 16n,
    patientId: 10n,
    testName: "Peak Expiratory Flow",
    result: "65",
    unit: "% predicted",
    isCritical: false,
  },
  {
    id: 17n,
    patientId: 10n,
    testName: "IgE Total",
    result: "420",
    unit: "IU/mL",
    isCritical: false,
  },
];

export const DEMO_MEDICATIONS = [
  {
    id: 1n,
    patientId: 1n,
    name: "Metformin",
    dose: "500mg",
    frequency: "Twice daily",
    status: "active",
  },
  {
    id: 2n,
    patientId: 1n,
    name: "Lisinopril",
    dose: "10mg",
    frequency: "Once daily",
    status: "active",
  },
  {
    id: 3n,
    patientId: 2n,
    name: "Furosemide",
    dose: "40mg",
    frequency: "Once daily",
    status: "active",
  },
  {
    id: 4n,
    patientId: 2n,
    name: "Potassium Chloride",
    dose: "20mEq",
    frequency: "Twice daily",
    status: "active",
  },
  {
    id: 5n,
    patientId: 3n,
    name: "Levothyroxine",
    dose: "75mcg",
    frequency: "Once daily (morning)",
    status: "active",
  },
  {
    id: 6n,
    patientId: 4n,
    name: "Atorvastatin",
    dose: "40mg",
    frequency: "Once daily (evening)",
    status: "active",
  },
  {
    id: 7n,
    patientId: 5n,
    name: "Cetirizine",
    dose: "10mg",
    frequency: "As needed",
    status: "active",
  },
  {
    id: 8n,
    patientId: 6n,
    name: "Tiotropium",
    dose: "18mcg",
    frequency: "Once daily via inhaler",
    status: "active",
  },
  {
    id: 9n,
    patientId: 6n,
    name: "Salmeterol/Fluticasone",
    dose: "50/500mcg",
    frequency: "Twice daily via inhaler",
    status: "active",
  },
  {
    id: 10n,
    patientId: 7n,
    name: "Alendronate",
    dose: "70mg",
    frequency: "Once weekly",
    status: "active",
  },
  {
    id: 11n,
    patientId: 7n,
    name: "Levothyroxine",
    dose: "100mcg",
    frequency: "Once daily (morning)",
    status: "active",
  },
  {
    id: 12n,
    patientId: 8n,
    name: "Amlodipine",
    dose: "10mg",
    frequency: "Once daily",
    status: "active",
  },
  {
    id: 13n,
    patientId: 8n,
    name: "Sertraline",
    dose: "50mg",
    frequency: "Once daily",
    status: "active",
  },
  {
    id: 14n,
    patientId: 9n,
    name: "Epoetin Alfa",
    dose: "4000 units",
    frequency: "Three times weekly SC",
    status: "active",
  },
  {
    id: 15n,
    patientId: 9n,
    name: "Ferrous Sulfate",
    dose: "325mg",
    frequency: "Three times daily",
    status: "active",
  },
  {
    id: 16n,
    patientId: 10n,
    name: "Albuterol",
    dose: "90mcg",
    frequency: "As needed (2 puffs)",
    status: "active",
  },
  {
    id: 17n,
    patientId: 10n,
    name: "Montelukast",
    dose: "10mg",
    frequency: "Once daily at bedtime",
    status: "active",
  },
];

export const DEMO_CLINICAL_NOTES = [
  {
    id: 1n,
    patientId: 1n,
    noteType: "SOAP",
    content:
      "S: Patient presents for diabetes follow-up. Reports good medication compliance. O: BP 138/88, HR 76. HbA1c 8.2%. A: Type 2 DM, poorly controlled. HTN, controlled. P: Increase Metformin to 1000mg BID. Recheck HbA1c in 3 months.",
    authorId: 10n,
  },
  {
    id: 2n,
    patientId: 2n,
    noteType: "SOAP",
    content:
      "S: 70yo male with CHF, presents with increased dyspnea on exertion. O: JVD present, bilateral leg edema 2+. BNP elevated. A: Acute CHF exacerbation. Hypokalemia. P: IV diuresis, K+ replacement, cardiology consult.",
    authorId: 10n,
  },
  {
    id: 3n,
    patientId: 3n,
    noteType: "Progress",
    content:
      "Patient reports fatigue and weight gain over past 3 months. TSH within normal limits. Consider dietary changes and exercise program. Follow up in 6 weeks.",
    authorId: 10n,
  },
  {
    id: 4n,
    patientId: 4n,
    noteType: "SOAP",
    content:
      "Annual wellness visit. LDL elevated at 142. Started Atorvastatin 40mg. Counseled on heart-healthy diet and exercise. F/U labs in 8 weeks.",
    authorId: 10n,
  },
  {
    id: 5n,
    patientId: 5n,
    noteType: "SOAP",
    content:
      "S: 36yo female with allergic rhinitis. Reports seasonal exacerbations, improved with current regimen. O: Nasal turbinates mildly congested. No wheezing. A: Allergic rhinitis, controlled. P: Continue current medications. Consider allergen testing.",
    authorId: 10n,
  },
  {
    id: 6n,
    patientId: 6n,
    noteType: "SOAP",
    content:
      "S: 64yo male with COPD and emphysema. Reports increased dyspnea and productive cough. O: SpO2 88% on room air. Decreased breath sounds bilaterally. FEV1 42% predicted. A: COPD exacerbation with emphysema. P: Increase bronchodilator frequency, add short course prednisone, O2 supplementation, pulmonology referral.",
    authorId: 10n,
  },
  {
    id: 7n,
    patientId: 7n,
    noteType: "SOAP",
    content:
      "S: 78yo female with osteoporosis and hypothyroidism. Reports back pain. No recent falls. O: Kyphotic posture. T-score spine -2.8 on DEXA. TSH 9.4 mIU/L. A: Osteoporosis, moderate severity. Hypothyroidism, undertreated. P: Increase Levothyroxine dose, continue bisphosphonate, calcium + Vit D, fall prevention counseling.",
    authorId: 10n,
  },
  {
    id: 8n,
    patientId: 8n,
    noteType: "SOAP",
    content:
      "S: 46yo male with hypertension and anxiety. BP uncontrolled despite current medication. Reports increased work stress. O: BP 158/96. Mild tremor noted. A: Hypertension, suboptimally controlled. Generalized anxiety disorder. P: Increase Amlodipine dose, continue Sertraline, lifestyle modification counseling, f/u in 4 weeks.",
    authorId: 10n,
  },
  {
    id: 9n,
    patientId: 9n,
    noteType: "SOAP",
    content:
      "S: 60yo female with CKD Stage 3 and anemia. Fatigue worsening. O: Pale conjunctiva. Hgb 8.2 g/dL. eGFR 32. A: CKD Stage 3 with anemia of chronic kidney disease. P: Continue Epoetin Alfa, iron supplementation, nephrology consult, dietary phosphorus restriction, recheck CBC and BMP in 4 weeks.",
    authorId: 10n,
  },
  {
    id: 10n,
    patientId: 10n,
    noteType: "SOAP",
    content:
      "S: 39yo male with asthma and allergic rhinitis. Reports increasing rescue inhaler use — 4x/week. O: Mild expiratory wheeze. PEF 65% predicted. IgE 420 IU/mL. A: Asthma, uncontrolled (step 3). Allergic rhinitis. P: Add inhaled corticosteroid, continue montelukast, allergen avoidance education, spirometry in 8 weeks.",
    authorId: 10n,
  },
];

export const DEMO_INVOICES = [
  { id: 1n, patientId: 1n, amount: 25000n, status: "paid" },
  { id: 2n, patientId: 2n, amount: 87500n, status: "pending" },
  { id: 3n, patientId: 3n, amount: 15000n, status: "paid" },
  { id: 4n, patientId: 4n, amount: 30000n, status: "pending" },
  { id: 5n, patientId: 5n, amount: 12500n, status: "draft" },
  { id: 6n, patientId: 6n, amount: 42500n, status: "pending" },
  { id: 7n, patientId: 7n, amount: 18000n, status: "paid" },
  { id: 8n, patientId: 8n, amount: 22000n, status: "pending" },
  { id: 9n, patientId: 9n, amount: 65000n, status: "pending" },
  { id: 10n, patientId: 10n, amount: 19500n, status: "draft" },
  // Additional invoices for patient 1 (Margaret Chen) - portal billing view
  { id: 11n, patientId: 1n, amount: 18000n, status: "pending" },
  { id: 12n, patientId: 1n, amount: 16000n, status: "pending" },
  { id: 13n, patientId: 1n, amount: 30000n, status: "paid" },
];

export const DEMO_MESSAGES = [
  {
    id: 1n,
    fromUserId: 10n,
    toUserId: 11n,
    content:
      "Please review Mr. Okonkwo's labs — potassium is critically low, needs immediate attention.",
    createdAt: 1742551200000000000n,
  },
  {
    id: 2n,
    fromUserId: 11n,
    toUserId: 10n,
    content:
      "Reviewed. I'll order IV K+ replacement and continue monitoring. Thanks for flagging.",
    createdAt: 1742553000000000000n,
  },
  {
    id: 3n,
    fromUserId: 10n,
    toUserId: 12n,
    content:
      "Ms. Chen's Metformin dose is being increased. Please confirm pharmacy has the new script.",
    createdAt: 1742554800000000000n,
  },
  {
    id: 4n,
    fromUserId: 12n,
    toUserId: 10n,
    content:
      "Confirmed — new prescription received and verified. Ready for pickup.",
    createdAt: 1742556600000000000n,
  },
  {
    id: 5n,
    fromUserId: 13n,
    toUserId: 10n,
    content:
      "Ms. Patel's spirometry results are back. FEV1/FVC ratio 0.65, consistent with moderate obstruction. Recommend step-up therapy.",
    createdAt: 1742558400000000000n,
  },
  {
    id: 6n,
    fromUserId: 10n,
    toUserId: 13n,
    content:
      "Thanks. I'll review and update her asthma action plan at next visit. Can we schedule a follow-up spirometry in 6 weeks post-therapy change?",
    createdAt: 1742560200000000000n,
  },
  {
    id: 7n,
    fromUserId: 14n,
    toUserId: 10n,
    content:
      "Radiology report for William Park (MRN-006): CT Chest — Emphysematous changes bilateral upper lobes, consistent with COPD. No new infiltrates or masses.",
    createdAt: 1742562000000000000n,
  },
  {
    id: 8n,
    fromUserId: 10n,
    toUserId: 14n,
    content:
      "Reviewed — will discuss at next visit and consider referral to pulmonary rehab. Please also send prior comparison CT if available.",
    createdAt: 1742563800000000000n,
  },
  {
    id: 9n,
    fromUserId: 15n,
    toUserId: 10n,
    content:
      "Prior auth for Jardiance (empagliflozin) for Margaret Chen has been approved by Blue Shield. Auth #BSC-2026-11402. Valid 90 days.",
    createdAt: 1742565600000000000n,
  },
  {
    id: 10n,
    fromUserId: 10n,
    toUserId: 15n,
    content:
      "Great — please send the approval to pharmacy so they can fill the prescription. Patient is eager to start.",
    createdAt: 1742567400000000000n,
  },
  {
    id: 11n,
    fromUserId: 11n,
    toUserId: 16n,
    content:
      "Eleanor Walsh needs an urgent GI consult. She has persistent rectal bleeding, hemoglobin dropped to 9.2. Please see ASAP today if possible.",
    createdAt: 1742569200000000000n,
  },
  {
    id: 12n,
    fromUserId: 16n,
    toUserId: 11n,
    content:
      "I'll see her this afternoon. Can you send over the CBC and iron studies? Also flag if she's on any anticoagulants — that will affect scope planning.",
    createdAt: 1742571000000000000n,
  },
];

export const DEMO_AUDIT_LOGS = [
  {
    id: 1n,
    actorId: demoPrincipal as any,
    action: "CREATE",
    entityType: "Patient",
    entityId: 5n,
    timestamp: daysAgo(0),
  },
  {
    id: 2n,
    actorId: demoPrincipal as any,
    action: "UPDATE",
    entityType: "Appointment",
    entityId: 3n,
    timestamp: daysAgo(0),
  },
  {
    id: 3n,
    actorId: demoPrincipal as any,
    action: "CREATE",
    entityType: "ClinicalNote",
    entityId: 4n,
    timestamp: daysAgo(1),
  },
  {
    id: 4n,
    actorId: demoPrincipal as any,
    action: "UPDATE",
    entityType: "Prescription",
    entityId: 2n,
    timestamp: daysAgo(1),
  },
  {
    id: 5n,
    actorId: demoPrincipal as any,
    action: "CREATE",
    entityType: "Invoice",
    entityId: 5n,
    timestamp: daysAgo(2),
  },
  {
    id: 6n,
    actorId: demoPrincipal as any,
    action: "VIEW",
    entityType: "LabResult",
    entityId: 3n,
    timestamp: daysAgo(2),
  },
];

export const DEMO_PRESCRIPTIONS = [
  {
    id: 1n,
    patientId: 1n,
    patientName: "Margaret Chen",
    medication: "Metformin",
    dose: "1000mg BID",
    prescribedBy: "Dr. Jordan Lee",
    notes: "Take with food",
    status: "dispensed",
    createdAt: daysAgo(0),
  },
  {
    id: 2n,
    patientId: 2n,
    patientName: "Robert Okonkwo",
    medication: "Furosemide",
    dose: "80mg IV",
    prescribedBy: "Dr. Jordan Lee",
    notes: "Monitor urine output",
    status: "verified",
    createdAt: daysAgo(0),
  },
  {
    id: 3n,
    patientId: 3n,
    patientName: "Sophia Martinez",
    medication: "Levothyroxine",
    dose: "75mcg daily",
    prescribedBy: "Dr. Jordan Lee",
    notes: "Take on empty stomach",
    status: "pending",
    createdAt: daysAgo(1),
  },
  {
    id: 4n,
    patientId: 4n,
    patientName: "James Thornton",
    medication: "Atorvastatin",
    dose: "40mg QHS",
    prescribedBy: "Dr. Jordan Lee",
    notes: "Check LFTs in 8 weeks",
    status: "dispensed",
    createdAt: daysAgo(2),
  },
  {
    id: 5n,
    patientId: 5n,
    patientName: "Aisha Patel",
    medication: "Cetirizine",
    dose: "10mg PRN",
    prescribedBy: "Dr. Jordan Lee",
    notes: "May cause drowsiness",
    status: "pending",
    createdAt: daysAgo(3),
  },
  {
    id: 6n,
    patientId: 6n,
    patientName: "William Park",
    medication: "Tiotropium",
    dose: "18mcg inhaler",
    prescribedBy: "Dr. Jordan Lee",
    notes: "One puff once daily",
    status: "dispensed",
    createdAt: daysAgo(1),
  },
  {
    id: 7n,
    patientId: 7n,
    patientName: "Eleanor Walsh",
    medication: "Alendronate",
    dose: "70mg weekly",
    prescribedBy: "Dr. Jordan Lee",
    notes: "Take with full glass of water, remain upright 30 min",
    status: "verified",
    createdAt: daysAgo(2),
  },
  {
    id: 8n,
    patientId: 8n,
    patientName: "Carlos Gutierrez",
    medication: "Amlodipine",
    dose: "10mg daily",
    prescribedBy: "Dr. Jordan Lee",
    notes: "Monitor for ankle edema",
    status: "pending",
    createdAt: daysAgo(1),
  },
  {
    id: 9n,
    patientId: 9n,
    patientName: "Priya Nair",
    medication: "Epoetin Alfa",
    dose: "4000 units SC TIW",
    prescribedBy: "Dr. Jordan Lee",
    notes: "Administer subcutaneously 3x/week",
    status: "verified",
    createdAt: daysAgo(3),
  },
  {
    id: 10n,
    patientId: 10n,
    patientName: "David Kimani",
    medication: "Albuterol",
    dose: "90mcg 2 puffs PRN",
    prescribedBy: "Dr. Jordan Lee",
    notes: "Rescue inhaler - use as needed for acute symptoms",
    status: "dispensed",
    createdAt: daysAgo(4),
  },
  // Additional prescriptions for patient 1 (Margaret Chen)
  {
    id: 11n,
    patientId: 1n,
    patientName: "Margaret Chen",
    medication: "Lisinopril",
    dose: "10mg daily",
    prescribedBy: "Dr. Jordan Lee",
    notes: "Monitor blood pressure and renal function",
    status: "dispensed",
    createdAt: daysAgo(30),
  },
  {
    id: 12n,
    patientId: 1n,
    patientName: "Margaret Chen",
    medication: "Atorvastatin",
    dose: "40mg at bedtime",
    prescribedBy: "Dr. Jordan Lee",
    notes: "Check LFTs in 8 weeks",
    status: "dispensed",
    createdAt: daysAgo(45),
  },
  {
    id: 13n,
    patientId: 1n,
    patientName: "Margaret Chen",
    medication: "Omeprazole",
    dose: "20mg daily before breakfast",
    prescribedBy: "Dr. Sarah Chen",
    notes: "Take 30 min before first meal",
    status: "pending",
    createdAt: daysAgo(90),
  },
];

export const DEMO_REFERRALS = [
  {
    id: 1n,
    patientId: 1n,
    patientName: "Margaret Chen",
    referredTo: "Dr. Sarah Kim (Endocrinology)",
    reason:
      "Poorly controlled Type 2 DM, HbA1c 8.2% — evaluate for insulin initiation or GLP-1 agonist",
    priority: "routine",
    status: "pending",
    notes:
      "Please evaluate for insulin initiation or GLP-1 agonist therapy. Patient on max dose metformin.",
    createdAt: daysAgo(0),
  },
  {
    id: 2n,
    patientId: 2n,
    patientName: "Robert Okonkwo",
    referredTo: "Dr. Michael Torres (Cardiology)",
    reason: "Acute CHF exacerbation, BNP 1,840 pg/mL, EF unknown",
    priority: "urgent",
    status: "sent",
    notes:
      "Needs urgent echo, optimization of HF guideline-directed therapy. Recent admit for decompensation.",
    createdAt: daysAgo(1),
  },
  {
    id: 3n,
    patientId: 4n,
    patientName: "James Thornton",
    referredTo: "Dr. Lisa Park (Nutrition / Dietetics)",
    reason: "Dyslipidemia with elevated LDL 168 mg/dL, mixed hyperlipidemia",
    priority: "routine",
    status: "completed",
    notes:
      "Dietary counseling for heart-healthy diet completed. Patient reports improved diet adherence.",
    createdAt: daysAgo(7),
  },
  {
    id: 4n,
    patientId: 9n,
    patientName: "Priya Nair",
    referredTo: "Dr. Amanda Reyes (Nephrology)",
    reason:
      "CKD Stage 3b, eGFR 32, worsening proteinuria — management and RRT planning",
    priority: "routine",
    status: "sent",
    notes:
      "eGFR has declined from 41 over 18 months. Increasing microalbuminuria. Optimize BP control.",
    createdAt: daysAgo(3),
  },
  {
    id: 5n,
    patientId: 10n,
    patientName: "David Kimani",
    referredTo: "Dr. Kevin Park (Orthopedic Surgery)",
    reason:
      "Bilateral knee osteoarthritis, severe, failed conservative management",
    priority: "routine",
    status: "pending",
    notes:
      "Patient has failed PT, NSAIDs, and corticosteroid injections. X-ray shows bone-on-bone changes bilaterally. TKR evaluation requested.",
    createdAt: daysAgo(2),
  },
  {
    id: 6n,
    patientId: 6n,
    patientName: "William Park",
    referredTo: "Dr. James Liu (Ophthalmology)",
    reason:
      "Annual diabetic retinopathy screening — T2DM x 11 years, overdue for dilated exam",
    priority: "routine",
    status: "completed",
    notes:
      "Retinopathy screening completed. Non-proliferative diabetic retinopathy detected. Annual follow-up recommended.",
    createdAt: daysAgo(14),
  },
  {
    id: 7n,
    patientId: 7n,
    patientName: "Eleanor Walsh",
    referredTo: "Dr. Rachel Nguyen (Pulmonology)",
    reason:
      "COPD GOLD Stage III, recurrent exacerbations — 3 hospitalizations in past 12 months",
    priority: "urgent",
    status: "sent",
    notes:
      "Escalating COPD with frequent exacerbations. On triple therapy. Consider pulmonary rehab referral and evaluation for biologic therapy.",
    createdAt: daysAgo(4),
  },
  {
    id: 8n,
    patientId: 8n,
    patientName: "Carlos Gutierrez",
    referredTo: "Dr. Brian Choi (Gastroenterology)",
    reason:
      "Screening colonoscopy overdue — age 58, family history of colorectal cancer",
    priority: "routine",
    status: "pending",
    notes:
      "Patient is 3 years overdue for colonoscopy. Father had colon cancer at 62. Average-risk guidelines suggest every 10 years but family history warrants earlier screening.",
    createdAt: daysAgo(1),
  },
];

// ── Inpatient Beds ────────────────────────────────────────────────────────────

export interface DemoInpatientBed {
  wardId: string;
  wardName: string;
  number: string;
  status: "occupied" | "available" | "reserved";
  patientName?: string;
  admittedDate?: string;
  diagnosis?: string;
  attendingPhysician?: string;
}

export const DEMO_INPATIENT_BEDS: DemoInpatientBed[] = [
  // ICU — 4 beds
  {
    wardId: "icu",
    wardName: "ICU",
    number: "ICU-01",
    status: "occupied",
    patientName: "Sarah Chen",
    admittedDate: "Mar 12",
    diagnosis: "Acute MI — STEMI, post-PCI Day 2. Monitoring for arrhythmia.",
    attendingPhysician: "Dr. Marcus Williams (Cardiology)",
  },
  {
    wardId: "icu",
    wardName: "ICU",
    number: "ICU-02",
    status: "occupied",
    patientName: "George Nakamura",
    admittedDate: "Mar 13",
    diagnosis:
      "Acute hypoxic respiratory failure — mechanically ventilated. Suspected ARDS.",
    attendingPhysician: "Dr. Rachel Nguyen (Pulmonology / Critical Care)",
  },
  {
    wardId: "icu",
    wardName: "ICU",
    number: "ICU-03",
    status: "occupied",
    patientName: "Fatima Al-Hassan",
    admittedDate: "Mar 11",
    diagnosis:
      "Septic shock secondary to urinary source. Vasopressors weaning.",
    attendingPhysician: "Dr. Rachel Nguyen (Critical Care)",
  },
  {
    wardId: "icu",
    wardName: "ICU",
    number: "ICU-04",
    status: "available",
  },
  // General Medicine — 4 beds
  {
    wardId: "general",
    wardName: "General Medicine",
    number: "GM-101",
    status: "occupied",
    patientName: "Margaret Chen",
    admittedDate: "Mar 11",
    diagnosis: "Poorly controlled Type 2 DM, HbA1c 8.2%. IV insulin protocol.",
    attendingPhysician: "Dr. Sarah Johnson (Internal Medicine)",
  },
  {
    wardId: "general",
    wardName: "General Medicine",
    number: "GM-102",
    status: "occupied",
    patientName: "Robert Okonkwo",
    admittedDate: "Mar 10",
    diagnosis:
      "Acute CHF decompensation. BNP 1,840. IV diuresis, 4L negative so far.",
    attendingPhysician: "Dr. Marcus Williams (Cardiology)",
  },
  {
    wardId: "general",
    wardName: "General Medicine",
    number: "GM-103",
    status: "occupied",
    patientName: "Priya Nair",
    admittedDate: "Mar 13",
    diagnosis:
      "Community-acquired pneumonia. IV ceftriaxone + azithromycin. SpO2 94% on 2L NC.",
    attendingPhysician: "Dr. Sarah Johnson (Internal Medicine)",
  },
  {
    wardId: "general",
    wardName: "General Medicine",
    number: "GM-104",
    status: "available",
  },
  // Surgical — 3 beds
  {
    wardId: "surgical",
    wardName: "Surgical",
    number: "SG-201",
    status: "occupied",
    patientName: "Sophia Martinez",
    admittedDate: "Mar 12",
    diagnosis:
      "Post-op laparoscopic cholecystectomy Day 1. Tolerating clears. Pain controlled.",
    attendingPhysician: "Dr. Kevin Park (General Surgery)",
  },
  {
    wardId: "surgical",
    wardName: "Surgical",
    number: "SG-202",
    status: "occupied",
    patientName: "David Kimani",
    admittedDate: "Mar 13",
    diagnosis:
      "Emergency appendectomy. Uncomplicated. Observation pending ambulation.",
    attendingPhysician: "Dr. Kevin Park (General Surgery)",
  },
  {
    wardId: "surgical",
    wardName: "Surgical",
    number: "SG-203",
    status: "reserved",
  },
];

// ── Imaging Orders ────────────────────────────────────────────────────────────

export interface DemoImagingOrder {
  id: number;
  patientId: number;
  patientName: string;
  modality: "X-Ray" | "CT" | "MRI" | "Ultrasound";
  bodyPart: string;
  status: "ordered" | "scheduled" | "completed" | "reported";
  date: string;
  reportedBy?: string;
  findings?: string;
}

export const DEMO_IMAGING_ORDERS: DemoImagingOrder[] = [
  {
    id: 101,
    patientId: 1,
    patientName: "Margaret Chen",
    modality: "X-Ray",
    bodyPart: "Chest",
    status: "reported",
    date: "2026-03-10",
    reportedBy: "Dr. Alan Park",
    findings:
      "No acute cardiopulmonary process. Heart size normal. No pleural effusion.",
  },
  {
    id: 102,
    patientId: 2,
    patientName: "Robert Okonkwo",
    modality: "CT",
    bodyPart: "Chest",
    status: "completed",
    date: "2026-03-11",
    reportedBy: "Dr. Alan Park",
    findings:
      "Bilateral pleural effusions, right greater than left. Cardiomegaly consistent with CHF. No pulmonary embolism.",
  },
  {
    id: 103,
    patientId: 3,
    patientName: "Sophia Martinez",
    modality: "Ultrasound",
    bodyPart: "Abdomen",
    status: "ordered",
    date: "2026-03-13",
  },
  {
    id: 104,
    patientId: 4,
    patientName: "James Thornton",
    modality: "MRI",
    bodyPart: "Lumbar Spine",
    status: "scheduled",
    date: "2026-03-15",
  },
  {
    id: 105,
    patientId: 5,
    patientName: "Aisha Patel",
    modality: "X-Ray",
    bodyPart: "Left Knee",
    status: "ordered",
    date: "2026-03-14",
  },
  {
    id: 106,
    patientId: 6,
    patientName: "William Park",
    modality: "CT",
    bodyPart: "Chest",
    status: "reported",
    date: "2026-03-09",
    reportedBy: "Dr. Alan Park",
    findings:
      "Emphysematous changes bilateral upper lobes consistent with COPD. No acute infiltrate, effusion, or pneumothorax. Stable compared to prior study.",
  },
  {
    id: 107,
    patientId: 7,
    patientName: "Eleanor Walsh",
    modality: "X-Ray",
    bodyPart: "Pelvis & Hip",
    status: "reported",
    date: "2026-03-08",
    reportedBy: "Dr. Lisa Tanaka",
    findings:
      "Mild degenerative joint changes bilateral hips. No acute fracture or dislocation. Moderate osteopenia noted.",
  },
  {
    id: 108,
    patientId: 8,
    patientName: "Carlos Gutierrez",
    modality: "MRI",
    bodyPart: "Brain",
    status: "scheduled",
    date: "2026-03-17",
  },
  {
    id: 109,
    patientId: 9,
    patientName: "Priya Nair",
    modality: "Ultrasound",
    bodyPart: "Renal / Kidneys",
    status: "completed",
    date: "2026-03-11",
    reportedBy: "Dr. Alan Park",
    findings:
      "Bilateral kidneys reduced in size (right 9.1 cm, left 8.8 cm). Increased echogenicity consistent with chronic kidney disease. No hydronephrosis or stones.",
  },
  {
    id: 110,
    patientId: 10,
    patientName: "David Kimani",
    modality: "MRI",
    bodyPart: "Right Knee",
    status: "ordered",
    date: "2026-03-15",
  },
];

// ── Staff Users ───────────────────────────────────────────────────────────────

export interface DemoUser {
  id: number;
  name: string;
  email: string;
  role:
    | "Doctor"
    | "Nurse"
    | "Pharmacist"
    | "Receptionist"
    | "Billing"
    | "Admin";
  status: "active" | "inactive";
  lastLogin: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 1,
    name: "Dr. Jordan Lee",
    email: "j.lee@stmichaels.org",
    role: "Doctor",
    status: "active",
    lastLogin: "Today, 8:42 AM",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "m.santos@stmichaels.org",
    role: "Nurse",
    status: "active",
    lastLogin: "Today, 7:30 AM",
  },
  {
    id: 3,
    name: "Alex Kim",
    email: "a.kim@stmichaels.org",
    role: "Pharmacist",
    status: "active",
    lastLogin: "Today, 9:15 AM",
  },
  {
    id: 4,
    name: "Taylor Brown",
    email: "t.brown@stmichaels.org",
    role: "Receptionist",
    status: "active",
    lastLogin: "Today, 8:00 AM",
  },
  {
    id: 5,
    name: "Pat Wilson",
    email: "p.wilson@stmichaels.org",
    role: "Billing",
    status: "active",
    lastLogin: "Yesterday, 5:45 PM",
  },
  {
    id: 6,
    name: "Chris Davis",
    email: "c.davis@stmichaels.org",
    role: "Admin",
    status: "active",
    lastLogin: "Today, 6:55 AM",
  },
];

// ── Results Inbox ─────────────────────────────────────────────────────────────

export type DemoResultFlag = "normal" | "low" | "high" | "critical";

export interface DemoResultInboxItem {
  id: number;
  patientId: number;
  patientName: string;
  testName: string;
  result: string;
  unit: string;
  referenceRange: string;
  flag: DemoResultFlag;
  orderedDate: string;
  resultDate: string;
  status: "pending" | "acknowledged";
  orderedBy: string;
}

export const DEMO_RESULTS_INBOX: DemoResultInboxItem[] = [
  {
    id: 1,
    patientId: 2,
    patientName: "Robert Okonkwo",
    testName: "Serum Potassium",
    result: "2.9",
    unit: "mEq/L",
    referenceRange: "3.5–5.0 mEq/L",
    flag: "critical",
    orderedDate: "2026-03-12",
    resultDate: "2026-03-13",
    status: "pending",
    orderedBy: "Dr. Jordan Lee",
  },
  {
    id: 2,
    patientId: 1,
    patientName: "Margaret Chen",
    testName: "Fasting Glucose",
    result: "182",
    unit: "mg/dL",
    referenceRange: "70–100 mg/dL",
    flag: "critical",
    orderedDate: "2026-03-12",
    resultDate: "2026-03-13",
    status: "pending",
    orderedBy: "Dr. Jordan Lee",
  },
  {
    id: 3,
    patientId: 4,
    patientName: "James Thornton",
    testName: "LDL Cholesterol",
    result: "142",
    unit: "mg/dL",
    referenceRange: "<100 mg/dL",
    flag: "high",
    orderedDate: "2026-03-11",
    resultDate: "2026-03-12",
    status: "pending",
    orderedBy: "Dr. Jordan Lee",
  },
  {
    id: 4,
    patientId: 3,
    patientName: "Sophia Martinez",
    testName: "TSH",
    result: "2.4",
    unit: "mIU/L",
    referenceRange: "0.4–4.0 mIU/L",
    flag: "normal",
    orderedDate: "2026-03-10",
    resultDate: "2026-03-11",
    status: "acknowledged",
    orderedBy: "Dr. Jordan Lee",
  },
  {
    id: 5,
    patientId: 5,
    patientName: "Aisha Patel",
    testName: "CBC — WBC",
    result: "7.2",
    unit: "10^3/μL",
    referenceRange: "4.5–11.0 10^3/μL",
    flag: "normal",
    orderedDate: "2026-03-11",
    resultDate: "2026-03-12",
    status: "acknowledged",
    orderedBy: "Dr. Jordan Lee",
  },
];

// ── Lab Connections ───────────────────────────────────────────────────────────

export interface DemoLabConnection {
  id: number;
  name: string;
  endpoint: string;
  protocol: "HL7 v2.5" | "FHIR R4";
  status: "connected" | "pending";
  lastSync: string;
}

export const DEMO_LAB_CONNECTIONS: DemoLabConnection[] = [
  {
    id: 1,
    name: "Quest Diagnostics",
    endpoint: "https://api.questdiagnostics.com/hl7",
    protocol: "HL7 v2.5",
    status: "connected",
    lastSync: "Today, 9:14 AM",
  },
  {
    id: 2,
    name: "LabCorp",
    endpoint: "https://api.labcorp.com/fhir",
    protocol: "FHIR R4",
    status: "connected",
    lastSync: "Today, 8:47 AM",
  },
];

// ── Claims ────────────────────────────────────────────────────────────────────

export interface DemoClaim {
  id: string;
  patientName: string;
  patientId: string;
  payer: string;
  claimNumber: string;
  serviceDate: string;
  submittedDate: string;
  status: "draft" | "submitted" | "adjudicated" | "paid";
  billedAmount: number;
  allowedAmount: number;
  paidAmount: number;
  adjustmentAmount: number;
  patientResponsibility: number;
  cptCodes: string[];
  diagnosisCodes: string[];
}

export const DEMO_CLAIMS: DemoClaim[] = [
  {
    id: "clm-1",
    patientName: "Margaret Chen",
    patientId: "MRN-001",
    payer: "Blue Cross",
    claimNumber: "CLM-2026-001",
    serviceDate: "2026-03-01",
    submittedDate: "2026-03-03",
    status: "paid",
    billedAmount: 320,
    allowedAmount: 280,
    paidAmount: 224,
    adjustmentAmount: 40,
    patientResponsibility: 56,
    cptCodes: ["99213", "85025"],
    diagnosisCodes: ["E11.9", "I10"],
  },
  {
    id: "clm-2",
    patientName: "Robert Okonkwo",
    patientId: "MRN-002",
    payer: "Medicare",
    claimNumber: "CLM-2026-002",
    serviceDate: "2026-03-03",
    submittedDate: "2026-03-05",
    status: "adjudicated",
    billedAmount: 580,
    allowedAmount: 490,
    paidAmount: 392,
    adjustmentAmount: 90,
    patientResponsibility: 98,
    cptCodes: ["99214", "93000", "80053"],
    diagnosisCodes: ["I50.9", "I10"],
  },
  {
    id: "clm-3",
    patientName: "Sophia Martinez",
    patientId: "MRN-003",
    payer: "Aetna",
    claimNumber: "CLM-2026-003",
    serviceDate: "2026-03-05",
    submittedDate: "2026-03-07",
    status: "submitted",
    billedAmount: 1250,
    allowedAmount: 0,
    paidAmount: 0,
    adjustmentAmount: 0,
    patientResponsibility: 0,
    cptCodes: ["47562"],
    diagnosisCodes: ["K80.20"],
  },
  {
    id: "clm-4",
    patientName: "James Thornton",
    patientId: "MRN-004",
    payer: "United Health",
    claimNumber: "CLM-2026-004",
    serviceDate: "2026-03-07",
    submittedDate: "2026-03-09",
    status: "paid",
    billedAmount: 420,
    allowedAmount: 370,
    paidAmount: 296,
    adjustmentAmount: 50,
    patientResponsibility: 74,
    cptCodes: ["99213", "72148"],
    diagnosisCodes: ["M54.5"],
  },
  {
    id: "clm-5",
    patientName: "Aisha Patel",
    patientId: "MRN-005",
    payer: "Medicaid",
    claimNumber: "CLM-2026-005",
    serviceDate: "2026-03-08",
    submittedDate: "2026-03-10",
    status: "adjudicated",
    billedAmount: 290,
    allowedAmount: 240,
    paidAmount: 240,
    adjustmentAmount: 50,
    patientResponsibility: 0,
    cptCodes: ["99213", "95165"],
    diagnosisCodes: ["J30.1"],
  },
  {
    id: "clm-6",
    patientName: "Margaret Chen",
    patientId: "MRN-001",
    payer: "Blue Cross",
    claimNumber: "CLM-2026-006",
    serviceDate: "2026-03-10",
    submittedDate: "2026-03-12",
    status: "submitted",
    billedAmount: 195,
    allowedAmount: 0,
    paidAmount: 0,
    adjustmentAmount: 0,
    patientResponsibility: 0,
    cptCodes: ["99212"],
    diagnosisCodes: ["Z00.00"],
  },
  {
    id: "clm-7",
    patientName: "Robert Okonkwo",
    patientId: "MRN-002",
    payer: "Medicare",
    claimNumber: "CLM-2026-007",
    serviceDate: "2026-03-11",
    submittedDate: "",
    status: "draft",
    billedAmount: 760,
    allowedAmount: 0,
    paidAmount: 0,
    adjustmentAmount: 0,
    patientResponsibility: 0,
    cptCodes: ["99215", "93000", "85025", "80053"],
    diagnosisCodes: ["I50.9", "N18.3"],
  },
  {
    id: "clm-8",
    patientName: "Sophia Martinez",
    patientId: "MRN-003",
    payer: "Aetna",
    claimNumber: "CLM-2026-008",
    serviceDate: "2026-03-12",
    submittedDate: "2026-03-13",
    status: "paid",
    billedAmount: 340,
    allowedAmount: 295,
    paidAmount: 236,
    adjustmentAmount: 45,
    patientResponsibility: 59,
    cptCodes: ["99213", "85025"],
    diagnosisCodes: ["K92.1"],
  },
];

// ─── PDMP Records ────────────────────────────────────────────────────────────

export interface DemoPDMPRecord {
  id: number;
  patientName: string;
  patientDOB: string;
  medication: string;
  prescriber: string;
  pharmacy: string;
  daysSupply: number;
  quantity: number;
  dispenseDate: string;
  mme: number;
  prescriberCount: number;
  pharmacyCount: number;
  riskLevel: "low" | "moderate" | "high";
  flags: string[];
}

export const DEMO_PDMP_RECORDS: DemoPDMPRecord[] = [
  {
    id: 1,
    patientName: "Linda Graves",
    patientDOB: "1976-08-14",
    medication: "Oxycodone 10mg",
    prescriber: "Dr. Marcus Webb",
    pharmacy: "CVS Pharmacy #1242",
    daysSupply: 30,
    quantity: 90,
    dispenseDate: "2026-03-01",
    mme: 135,
    prescriberCount: 3,
    pharmacyCount: 2,
    riskLevel: "high",
    flags: ["Multiple prescribers", "Overlapping fills", "High MME"],
  },
  {
    id: 2,
    patientName: "Linda Graves",
    patientDOB: "1976-08-14",
    medication: "Hydrocodone/APAP 7.5mg",
    prescriber: "Dr. Janet Rollins",
    pharmacy: "Walgreens #5071",
    daysSupply: 30,
    quantity: 60,
    dispenseDate: "2026-02-18",
    mme: 45,
    prescriberCount: 3,
    pharmacyCount: 2,
    riskLevel: "high",
    flags: ["Concurrent opioid overlap", "Multiple pharmacies"],
  },
  {
    id: 3,
    patientName: "Derek Mossman",
    patientDOB: "1988-11-03",
    medication: "Alprazolam 1mg",
    prescriber: "Dr. Rachel Kim",
    pharmacy: "Rite Aid #883",
    daysSupply: 30,
    quantity: 60,
    dispenseDate: "2026-03-05",
    mme: 0,
    prescriberCount: 2,
    pharmacyCount: 2,
    riskLevel: "moderate",
    flags: ["Benzodiazepine + opioid combo risk", "Multiple prescribers"],
  },
  {
    id: 4,
    patientName: "Margaret Chen",
    patientDOB: "1968-03-15",
    medication: "Tramadol 50mg",
    prescriber: "Dr. Sarah Chen",
    pharmacy: "CVS Pharmacy #1242",
    daysSupply: 14,
    quantity: 28,
    dispenseDate: "2026-03-10",
    mme: 25,
    prescriberCount: 1,
    pharmacyCount: 1,
    riskLevel: "low",
    flags: [],
  },
  {
    id: 5,
    patientName: "Robert Okonkwo",
    patientDOB: "1954-07-22",
    medication: "Morphine ER 15mg",
    prescriber: "Dr. David Park",
    pharmacy: "Community Pharmacy",
    daysSupply: 30,
    quantity: 60,
    dispenseDate: "2026-03-08",
    mme: 30,
    prescriberCount: 1,
    pharmacyCount: 1,
    riskLevel: "low",
    flags: ["Elderly patient — fall risk"],
  },
  {
    id: 6,
    patientName: "Terrence Bullock",
    patientDOB: "1994-02-17",
    medication: "Oxycodone 5mg",
    prescriber: "Dr. Sarah Chen",
    pharmacy: "Walgreens #5071",
    daysSupply: 7,
    quantity: 21,
    dispenseDate: "2026-03-12",
    mme: 37.5,
    prescriberCount: 1,
    pharmacyCount: 1,
    riskLevel: "low",
    flags: ["Post-surgical acute pain"],
  },
];

// ─── Prior Authorization Records ─────────────────────────────────────────────

export interface DemoPriorAuthRecord {
  id: number;
  patientName: string;
  patientId: string;
  payer: string;
  procedure: string;
  cptCode: string;
  diagnosisCode: string;
  requestedDate: string;
  decisionDate?: string;
  status: "pending" | "approved" | "denied" | "expired";
  urgency: "routine" | "urgent" | "stat";
  notes?: string;
  authNumber?: string;
}

export const DEMO_PRIOR_AUTH_RECORDS: DemoPriorAuthRecord[] = [
  {
    id: 1,
    patientName: "Margaret Chen",
    patientId: "MRN-001",
    payer: "Blue Cross",
    procedure: "MRI Brain with Contrast",
    cptCode: "70553",
    diagnosisCode: "G43.909",
    requestedDate: "2026-03-01",
    decisionDate: "2026-03-03",
    status: "approved",
    urgency: "routine",
    notes: "Approved for chronic migraine with aura — 1 study",
    authNumber: "AUTH-BC-44821",
  },
  {
    id: 2,
    patientName: "Robert Okonkwo",
    patientId: "MRN-002",
    payer: "Medicare",
    procedure: "Cardiac Catheterization",
    cptCode: "93458",
    diagnosisCode: "I50.9",
    requestedDate: "2026-03-05",
    status: "pending",
    urgency: "urgent",
    notes: "Awaiting cardiology peer review",
  },
  {
    id: 3,
    patientName: "Sophia Martinez",
    patientId: "MRN-003",
    payer: "Aetna",
    procedure: "Laparoscopic Cholecystectomy",
    cptCode: "47562",
    diagnosisCode: "K80.20",
    requestedDate: "2026-03-04",
    decisionDate: "2026-03-06",
    status: "approved",
    urgency: "routine",
    authNumber: "AUTH-AET-99034",
  },
  {
    id: 4,
    patientName: "James Thornton",
    patientId: "MRN-004",
    payer: "United Health",
    procedure: "Physical Therapy — 12 visits",
    cptCode: "97110",
    diagnosisCode: "M54.5",
    requestedDate: "2026-03-07",
    decisionDate: "2026-03-09",
    status: "denied",
    urgency: "routine",
    notes:
      "Denied: conservative treatment not yet exhausted per plan guidelines",
  },
  {
    id: 5,
    patientName: "Aisha Patel",
    patientId: "MRN-005",
    payer: "Medicaid",
    procedure: "Allergy Immunotherapy",
    cptCode: "95165",
    diagnosisCode: "J30.1",
    requestedDate: "2026-03-08",
    status: "pending",
    urgency: "routine",
  },
  {
    id: 6,
    patientName: "William Park",
    patientId: "MRN-006",
    payer: "Cigna",
    procedure: "Sleep Study (PSG)",
    cptCode: "95810",
    diagnosisCode: "G47.33",
    requestedDate: "2026-02-10",
    decisionDate: "2026-02-12",
    status: "expired",
    urgency: "routine",
    notes: "Authorization expired — study not completed within 60-day window",
    authNumber: "AUTH-CIG-30177",
  },
  {
    id: 7,
    patientName: "Margaret Chen",
    patientId: "MRN-001",
    payer: "Blue Cross",
    procedure: "Colonoscopy — diagnostic",
    cptCode: "45378",
    diagnosisCode: "K92.1",
    requestedDate: "2026-03-12",
    status: "pending",
    urgency: "stat",
    notes: "GI bleeding — expedited review requested",
  },
];

// ─── Medication Reconciliation ────────────────────────────────────────────────

export interface DemoMedReconciliation {
  id: number;
  patientName: string;
  medication: string;
  dose: string;
  frequency: string;
  source: "chart" | "patient_report" | "discharge_summary";
  action: "continue" | "discontinue" | "modify" | "pending";
  discrepancy?: string;
  reconciledBy?: string;
  reconciledAt?: string;
}

export const DEMO_MED_RECONCILIATION: DemoMedReconciliation[] = [
  {
    id: 1,
    patientName: "Margaret Chen",
    medication: "Metformin",
    dose: "1000mg",
    frequency: "Twice daily",
    source: "chart",
    action: "continue",
    reconciledBy: "Dr. Sarah Chen",
    reconciledAt: "2026-03-10T09:15:00Z",
  },
  {
    id: 2,
    patientName: "Margaret Chen",
    medication: "Lisinopril",
    dose: "10mg",
    frequency: "Once daily",
    source: "patient_report",
    action: "modify",
    discrepancy:
      "Patient reports taking 20mg — chart shows 10mg. Dose was increased at last cardiology visit not yet reflected in chart.",
    reconciledBy: "Dr. Sarah Chen",
    reconciledAt: "2026-03-10T09:18:00Z",
  },
  {
    id: 3,
    patientName: "Margaret Chen",
    medication: "Aspirin",
    dose: "81mg",
    frequency: "Once daily",
    source: "chart",
    action: "continue",
    reconciledBy: "Dr. Sarah Chen",
    reconciledAt: "2026-03-10T09:19:00Z",
  },
  {
    id: 4,
    patientName: "Robert Okonkwo",
    medication: "Furosemide",
    dose: "40mg",
    frequency: "Once daily",
    source: "discharge_summary",
    action: "continue",
    reconciledBy: "Dr. David Park",
    reconciledAt: "2026-03-11T10:00:00Z",
  },
  {
    id: 5,
    patientName: "Robert Okonkwo",
    medication: "Spironolactone",
    dose: "25mg",
    frequency: "Once daily",
    source: "patient_report",
    action: "pending",
    discrepancy:
      "Patient reports being prescribed spironolactone by cardiologist — not on current chart medications.",
  },
  {
    id: 6,
    patientName: "Robert Okonkwo",
    medication: "Carvedilol",
    dose: "6.25mg",
    frequency: "Twice daily",
    source: "chart",
    action: "continue",
    reconciledBy: "Dr. David Park",
    reconciledAt: "2026-03-11T10:05:00Z",
  },
  {
    id: 7,
    patientName: "Sophia Martinez",
    medication: "Omeprazole",
    dose: "20mg",
    frequency: "Once daily before meals",
    source: "chart",
    action: "continue",
  },
  {
    id: 8,
    patientName: "Sophia Martinez",
    medication: "Ibuprofen 600mg",
    dose: "600mg",
    frequency: "Three times daily",
    source: "patient_report",
    action: "discontinue",
    discrepancy:
      "Patient self-medicating with OTC ibuprofen — contraindicated with planned cholecystectomy and pre-existing gastritis.",
  },
  {
    id: 9,
    patientName: "James Thornton",
    medication: "Gabapentin",
    dose: "300mg",
    frequency: "Three times daily",
    source: "discharge_summary",
    action: "continue",
    reconciledBy: "Dr. Sarah Chen",
    reconciledAt: "2026-03-07T11:30:00Z",
  },
  {
    id: 10,
    patientName: "James Thornton",
    medication: "Cyclobenzaprine",
    dose: "10mg",
    frequency: "At bedtime as needed",
    source: "patient_report",
    action: "pending",
    discrepancy:
      "Patient reports taking cyclobenzaprine prescribed by urgent care 3 weeks ago — not on chart. Assess for continuation vs. taper.",
  },
  {
    id: 11,
    patientName: "Aisha Patel",
    medication: "Fluticasone nasal spray",
    dose: "50mcg",
    frequency: "2 sprays each nostril once daily",
    source: "chart",
    action: "continue",
    reconciledBy: "Dr. Sarah Chen",
    reconciledAt: "2026-03-08T14:00:00Z",
  },
  {
    id: 12,
    patientName: "Aisha Patel",
    medication: "Loratadine",
    dose: "10mg",
    frequency: "Once daily",
    source: "patient_report",
    action: "continue",
    discrepancy:
      "Patient added OTC loratadine on her own — not documented on chart. Safe to continue — add to medication list.",
    reconciledBy: "Dr. Sarah Chen",
    reconciledAt: "2026-03-08T14:05:00Z",
  },
];

// ── Provider Availability ────────────────────────────────────────────────────

export interface DemoProviderAvailability {
  id: number;
  providerId: number;
  providerName: string;
  specialty: string;
  blocks: Array<{
    day:
      | "Monday"
      | "Tuesday"
      | "Wednesday"
      | "Thursday"
      | "Friday"
      | "Saturday"
      | "Sunday";
    startTime: string;
    endTime: string;
    type: "available" | "blocked" | "vacation" | "admin";
    note?: string;
  }>;
}

export const DEMO_PROVIDER_AVAILABILITY: DemoProviderAvailability[] = [
  {
    id: 1,
    providerId: 10,
    providerName: "Dr. Sarah Johnson",
    specialty: "Internal Medicine",
    blocks: [
      {
        day: "Monday",
        startTime: "08:00",
        endTime: "12:00",
        type: "available",
      },
      {
        day: "Monday",
        startTime: "13:00",
        endTime: "17:00",
        type: "available",
      },
      {
        day: "Tuesday",
        startTime: "08:00",
        endTime: "12:00",
        type: "available",
      },
      {
        day: "Tuesday",
        startTime: "13:00",
        endTime: "15:00",
        type: "admin",
        note: "Department meeting",
      },
      {
        day: "Wednesday",
        startTime: "08:00",
        endTime: "17:00",
        type: "available",
      },
      {
        day: "Thursday",
        startTime: "08:00",
        endTime: "12:00",
        type: "available",
      },
      {
        day: "Thursday",
        startTime: "13:00",
        endTime: "17:00",
        type: "blocked",
        note: "Teaching rounds",
      },
      {
        day: "Friday",
        startTime: "08:00",
        endTime: "14:00",
        type: "available",
      },
    ],
  },
  {
    id: 2,
    providerId: 11,
    providerName: "Dr. Michael Chen",
    specialty: "Cardiology",
    blocks: [
      {
        day: "Monday",
        startTime: "09:00",
        endTime: "17:00",
        type: "available",
      },
      {
        day: "Tuesday",
        startTime: "09:00",
        endTime: "17:00",
        type: "available",
      },
      {
        day: "Wednesday",
        startTime: "09:00",
        endTime: "12:00",
        type: "available",
      },
      {
        day: "Wednesday",
        startTime: "12:00",
        endTime: "17:00",
        type: "vacation",
        note: "Out of office",
      },
      {
        day: "Thursday",
        startTime: "09:00",
        endTime: "17:00",
        type: "available",
      },
      {
        day: "Friday",
        startTime: "09:00",
        endTime: "15:00",
        type: "available",
      },
    ],
  },
  {
    id: 3,
    providerId: 12,
    providerName: "Dr. Emily Rodriguez",
    specialty: "Endocrinology",
    blocks: [
      {
        day: "Monday",
        startTime: "08:00",
        endTime: "16:00",
        type: "available",
      },
      {
        day: "Tuesday",
        startTime: "08:00",
        endTime: "16:00",
        type: "available",
      },
      {
        day: "Wednesday",
        startTime: "08:00",
        endTime: "12:00",
        type: "blocked",
        note: "Grand rounds",
      },
      {
        day: "Thursday",
        startTime: "08:00",
        endTime: "16:00",
        type: "available",
      },
      {
        day: "Friday",
        startTime: "08:00",
        endTime: "12:00",
        type: "available",
      },
    ],
  },
  {
    id: 4,
    providerId: 13,
    providerName: "Dr. James Park",
    specialty: "Pulmonology",
    blocks: [
      {
        day: "Monday",
        startTime: "07:30",
        endTime: "15:30",
        type: "available",
      },
      {
        day: "Tuesday",
        startTime: "07:30",
        endTime: "15:30",
        type: "available",
      },
      {
        day: "Wednesday",
        startTime: "07:30",
        endTime: "15:30",
        type: "available",
      },
      {
        day: "Thursday",
        startTime: "07:30",
        endTime: "11:30",
        type: "available",
      },
      {
        day: "Thursday",
        startTime: "11:30",
        endTime: "15:30",
        type: "admin",
        note: "Quality committee",
      },
      {
        day: "Friday",
        startTime: "07:30",
        endTime: "13:30",
        type: "available",
      },
    ],
  },
];

// ── Consent Forms ────────────────────────────────────────────────────────────

export interface DemoConsentForm {
  id: number;
  patientId: number;
  patientName: string;
  formType: string;
  signedDate: string;
  status: "signed" | "pending";
  witnessName?: string;
}

export const DEMO_CONSENT_FORMS: DemoConsentForm[] = [
  // Margaret Chen (id:1)
  {
    id: 1,
    patientId: 1,
    patientName: "Margaret Chen",
    formType: "General Consent to Treatment",
    signedDate: "2025-01-15",
    status: "signed",
    witnessName: "J. Adams, RN",
  },
  {
    id: 2,
    patientId: 1,
    patientName: "Margaret Chen",
    formType: "HIPAA Privacy Notice Acknowledgment",
    signedDate: "2025-01-15",
    status: "signed",
    witnessName: "J. Adams, RN",
  },
  {
    id: 3,
    patientId: 1,
    patientName: "Margaret Chen",
    formType: "Financial Responsibility Agreement",
    signedDate: "2025-01-15",
    status: "signed",
  },
  {
    id: 4,
    patientId: 1,
    patientName: "Margaret Chen",
    formType: "Research Participation Consent",
    signedDate: "",
    status: "pending",
  },
  // Robert Okonkwo (id:2)
  {
    id: 5,
    patientId: 2,
    patientName: "Robert Okonkwo",
    formType: "General Consent to Treatment",
    signedDate: "2024-11-02",
    status: "signed",
    witnessName: "M. Torres, LVN",
  },
  {
    id: 6,
    patientId: 2,
    patientName: "Robert Okonkwo",
    formType: "HIPAA Privacy Notice Acknowledgment",
    signedDate: "2024-11-02",
    status: "signed",
  },
  {
    id: 7,
    patientId: 2,
    patientName: "Robert Okonkwo",
    formType: "Cardiac Procedure Consent",
    signedDate: "2025-02-14",
    status: "signed",
    witnessName: "M. Torres, LVN",
  },
  {
    id: 8,
    patientId: 2,
    patientName: "Robert Okonkwo",
    formType: "Blood Transfusion Consent",
    signedDate: "2025-02-14",
    status: "signed",
    witnessName: "M. Torres, LVN",
  },
  // Sophia Martinez (id:3)
  {
    id: 9,
    patientId: 3,
    patientName: "Sophia Martinez",
    formType: "General Consent to Treatment",
    signedDate: "2025-03-01",
    status: "signed",
    witnessName: "K. Lee, RN",
  },
  {
    id: 10,
    patientId: 3,
    patientName: "Sophia Martinez",
    formType: "HIPAA Privacy Notice Acknowledgment",
    signedDate: "2025-03-01",
    status: "signed",
  },
  {
    id: 11,
    patientId: 3,
    patientName: "Sophia Martinez",
    formType: "Telemedicine Consent",
    signedDate: "2025-03-05",
    status: "signed",
  },
  // James Thornton (id:4)
  {
    id: 12,
    patientId: 4,
    patientName: "James Thornton",
    formType: "General Consent to Treatment",
    signedDate: "2024-09-10",
    status: "signed",
    witnessName: "R. Patel, MA",
  },
  {
    id: 13,
    patientId: 4,
    patientName: "James Thornton",
    formType: "HIPAA Privacy Notice Acknowledgment",
    signedDate: "2024-09-10",
    status: "signed",
  },
  {
    id: 14,
    patientId: 4,
    patientName: "James Thornton",
    formType: "Financial Responsibility Agreement",
    signedDate: "2024-09-10",
    status: "signed",
  },
  {
    id: 15,
    patientId: 4,
    patientName: "James Thornton",
    formType: "Advance Directive / DNR Documentation",
    signedDate: "",
    status: "pending",
  },
  // Aisha Patel (id:5)
  {
    id: 16,
    patientId: 5,
    patientName: "Aisha Patel",
    formType: "General Consent to Treatment",
    signedDate: "2025-02-20",
    status: "signed",
    witnessName: "D. Nguyen, RN",
  },
  {
    id: 17,
    patientId: 5,
    patientName: "Aisha Patel",
    formType: "HIPAA Privacy Notice Acknowledgment",
    signedDate: "2025-02-20",
    status: "signed",
  },
  {
    id: 18,
    patientId: 5,
    patientName: "Aisha Patel",
    formType: "Surgical Consent (Knee Arthroscopy)",
    signedDate: "",
    status: "pending",
  },

  {
    id: 19,
    patientId: 6,
    patientName: "William Park",
    formType: "General Consent to Treatment",
    signedDate: "2025-02-14",
    status: "signed" as const,
    witnessName: "S. Williams, RN",
  },
  {
    id: 20,
    patientId: 6,
    patientName: "William Park",
    formType: "HIPAA Privacy Notice Acknowledgment",
    signedDate: "2025-02-14",
    status: "signed" as const,
  },
  {
    id: 21,
    patientId: 6,
    patientName: "William Park",
    formType: "Hospice & Palliative Care Consent",
    signedDate: "2025-02-14",
    status: "signed" as const,
    witnessName: "S. Williams, RN",
  },
  {
    id: 22,
    patientId: 7,
    patientName: "Eleanor Walsh",
    formType: "General Consent to Treatment",
    signedDate: "2025-01-20",
    status: "signed" as const,
    witnessName: "D. Patel, RN",
  },
  {
    id: 23,
    patientId: 7,
    patientName: "Eleanor Walsh",
    formType: "HIPAA Privacy Notice Acknowledgment",
    signedDate: "2025-01-20",
    status: "signed" as const,
  },
  {
    id: 24,
    patientId: 7,
    patientName: "Eleanor Walsh",
    formType: "Blood Transfusion Consent",
    signedDate: "",
    status: "pending" as const,
  },
  {
    id: 25,
    patientId: 8,
    patientName: "Carlos Gutierrez",
    formType: "General Consent to Treatment",
    signedDate: "2025-03-02",
    status: "signed" as const,
    witnessName: "K. Chen, MA",
  },
  {
    id: 26,
    patientId: 8,
    patientName: "Carlos Gutierrez",
    formType: "HIPAA Privacy Notice Acknowledgment",
    signedDate: "2025-03-02",
    status: "signed" as const,
  },
  {
    id: 27,
    patientId: 9,
    patientName: "Priya Nair",
    formType: "General Consent to Treatment",
    signedDate: "2024-12-10",
    status: "signed" as const,
    witnessName: "A. Martinez, RN",
  },
  {
    id: 28,
    patientId: 9,
    patientName: "Priya Nair",
    formType: "HIPAA Privacy Notice Acknowledgment",
    signedDate: "2024-12-10",
    status: "signed" as const,
  },
  {
    id: 29,
    patientId: 9,
    patientName: "Priya Nair",
    formType: "Dialysis Treatment Consent",
    signedDate: "",
    status: "pending" as const,
  },
  {
    id: 30,
    patientId: 10,
    patientName: "David Kimani",
    formType: "General Consent to Treatment",
    signedDate: "2025-02-28",
    status: "signed" as const,
    witnessName: "B. Okonkwo, LVN",
  },
  {
    id: 31,
    patientId: 10,
    patientName: "David Kimani",
    formType: "HIPAA Privacy Notice Acknowledgment",
    signedDate: "2025-02-28",
    status: "signed" as const,
  },
];

export interface DemoAdvanceDirective {
  patientId: number;
  codeStatus: "Full Code" | "DNR" | "DNI" | "Comfort Care";
  documentStatus: "On File" | "Not on File" | "Pending";
  healthcareProxy: { name: string; relationship: string; phone: string };
  carePlanNotes: string;
}

export const DEMO_ADVANCE_DIRECTIVES: DemoAdvanceDirective[] = [
  {
    patientId: 1,
    codeStatus: "Full Code",
    documentStatus: "On File",
    healthcareProxy: {
      name: "David Chen",
      relationship: "Spouse",
      phone: "(555) 234-5679",
    },
    carePlanNotes:
      "Patient wishes all life-sustaining measures to be used. Has expressed desire for aggressive treatment including CPR, mechanical ventilation, and ICU care if needed. Reviewed and updated 2025-01-10.",
  },
  {
    patientId: 2,
    codeStatus: "DNR",
    documentStatus: "On File",
    healthcareProxy: {
      name: "Blessing Okonkwo",
      relationship: "Daughter",
      phone: "(555) 345-6780",
    },
    carePlanNotes:
      "Patient does not wish to be resuscitated in the event of cardiac or respiratory arrest. Comfort-focused care preferred. Discussed palliative care options. Patient is aware of prognosis related to advanced CHF.",
  },
  {
    patientId: 3,
    codeStatus: "Full Code",
    documentStatus: "Pending",
    healthcareProxy: {
      name: "Carlos Martinez",
      relationship: "Husband",
      phone: "(555) 456-7891",
    },
    carePlanNotes:
      "Patient is 32 weeks pregnant; full resuscitation desired. Advance directive paperwork initiated but awaiting patient signature. Follow up at next OB visit.",
  },
  {
    patientId: 4,
    codeStatus: "DNI",
    documentStatus: "On File",
    healthcareProxy: {
      name: "Elizabeth Thornton",
      relationship: "Wife",
      phone: "(555) 567-8902",
    },
    carePlanNotes:
      "Patient refuses intubation and mechanical ventilation but consents to CPR and other resuscitative measures. COPD-related concerns discussed at length. BiPAP acceptable as bridge therapy only.",
  },
  {
    patientId: 5,
    codeStatus: "Full Code",
    documentStatus: "Not on File",
    healthcareProxy: {
      name: "Rohan Patel",
      relationship: "Brother",
      phone: "(555) 678-9013",
    },
    carePlanNotes: "",
  },
  {
    patientId: 6,
    codeStatus: "Comfort Care",
    documentStatus: "On File",
    healthcareProxy: {
      name: "Sandra Williams",
      relationship: "Sister",
      phone: "(555) 789-0124",
    },
    carePlanNotes:
      "Terminal diagnosis confirmed. Patient has elected comfort-focused care only. No CPR, no intubation, no artificial nutrition. Hospice referral placed 2025-02-14. Patient and family educated on hospice philosophy and goals.",
  },

  {
    patientId: 7,
    codeStatus: "Full Code" as const,
    documentStatus: "On File" as const,
    healthcareProxy: {
      name: "Michael Walsh",
      relationship: "Son",
      phone: "(555) 890-1235",
    },
    carePlanNotes:
      "Patient is 77 years old with history of osteoporosis and hypothyroidism. Wishes full resuscitative measures. Family involved in all care decisions. Reviewed 2025-01-20.",
  },
  {
    patientId: 8,
    codeStatus: "Full Code" as const,
    documentStatus: "Not on File" as const,
    healthcareProxy: { name: "", relationship: "", phone: "" },
    carePlanNotes: "",
  },
  {
    patientId: 9,
    codeStatus: "DNR" as const,
    documentStatus: "On File" as const,
    healthcareProxy: {
      name: "Anita Nair",
      relationship: "Daughter",
      phone: "(555) 012-3457",
    },
    carePlanNotes:
      "Patient with CKD Stage 4 has chosen DNR status after extensive discussion with nephrology. Patient prefers comfort measures over aggressive intervention. Documented 2025-02-01.",
  },
  {
    patientId: 10,
    codeStatus: "Full Code" as const,
    documentStatus: "Pending" as const,
    healthcareProxy: {
      name: "Grace Kimani",
      relationship: "Spouse",
      phone: "(555) 123-4568",
    },
    carePlanNotes:
      "Young patient with asthma; full resuscitation desired. Advance directive paperwork pending completion.",
  },
];

// ─── Vitals ───────────────────────────────────────────────────────────────────

export interface DemoVitalReading {
  id: bigint;
  patientId: bigint;
  date: string;
  bp: string;
  hr: number;
  temp: number;
  rr: number;
  spo2: number;
  weight: number;
}

export const DEMO_VITALS: DemoVitalReading[] = [
  // Patient 1 - Margaret Chen (hypertension, diabetic)
  {
    id: 1n,
    patientId: 1n,
    date: "2025-09-05",
    bp: "132/84",
    hr: 72,
    temp: 36.8,
    rr: 16,
    spo2: 97,
    weight: 68.0,
  },
  {
    id: 2n,
    patientId: 1n,
    date: "2025-10-10",
    bp: "136/87",
    hr: 74,
    temp: 36.9,
    rr: 16,
    spo2: 97,
    weight: 68.2,
  },
  {
    id: 3n,
    patientId: 1n,
    date: "2025-11-14",
    bp: "140/90",
    hr: 76,
    temp: 37.0,
    rr: 17,
    spo2: 96,
    weight: 68.5,
  },
  {
    id: 4n,
    patientId: 1n,
    date: "2025-12-08",
    bp: "144/91",
    hr: 77,
    temp: 36.8,
    rr: 17,
    spo2: 96,
    weight: 69.0,
  },
  {
    id: 5n,
    patientId: 1n,
    date: "2026-01-12",
    bp: "147/93",
    hr: 78,
    temp: 37.1,
    rr: 17,
    spo2: 96,
    weight: 69.3,
  },
  {
    id: 6n,
    patientId: 1n,
    date: "2026-02-10",
    bp: "150/94",
    hr: 79,
    temp: 36.9,
    rr: 18,
    spo2: 96,
    weight: 69.5,
  },
  {
    id: 7n,
    patientId: 1n,
    date: "2026-03-08",
    bp: "152/95",
    hr: 80,
    temp: 37.0,
    rr: 17,
    spo2: 95,
    weight: 69.7,
  },

  // Patient 2 - Robert Okonkwo (stable chronic disease)
  {
    id: 8n,
    patientId: 2n,
    date: "2025-09-15",
    bp: "128/80",
    hr: 68,
    temp: 36.6,
    rr: 15,
    spo2: 98,
    weight: 92.0,
  },
  {
    id: 9n,
    patientId: 2n,
    date: "2025-10-18",
    bp: "126/78",
    hr: 67,
    temp: 36.7,
    rr: 15,
    spo2: 98,
    weight: 91.8,
  },
  {
    id: 10n,
    patientId: 2n,
    date: "2025-11-20",
    bp: "130/82",
    hr: 70,
    temp: 36.8,
    rr: 15,
    spo2: 98,
    weight: 91.5,
  },
  {
    id: 11n,
    patientId: 2n,
    date: "2025-12-14",
    bp: "127/79",
    hr: 66,
    temp: 36.6,
    rr: 14,
    spo2: 99,
    weight: 91.2,
  },
  {
    id: 12n,
    patientId: 2n,
    date: "2026-01-10",
    bp: "124/76",
    hr: 65,
    temp: 36.5,
    rr: 14,
    spo2: 99,
    weight: 91.0,
  },
  {
    id: 13n,
    patientId: 2n,
    date: "2026-02-08",
    bp: "126/78",
    hr: 67,
    temp: 36.7,
    rr: 15,
    spo2: 98,
    weight: 90.8,
  },
  {
    id: 14n,
    patientId: 2n,
    date: "2026-03-05",
    bp: "122/75",
    hr: 64,
    temp: 36.5,
    rr: 14,
    spo2: 99,
    weight: 90.5,
  },

  // Patient 3 - Sophia Martinez (COPD/respiratory, low SpO2)
  {
    id: 15n,
    patientId: 3n,
    date: "2025-09-10",
    bp: "118/72",
    hr: 88,
    temp: 37.1,
    rr: 20,
    spo2: 94,
    weight: 75.0,
  },
  {
    id: 16n,
    patientId: 3n,
    date: "2025-10-05",
    bp: "120/74",
    hr: 90,
    temp: 37.3,
    rr: 22,
    spo2: 93,
    weight: 75.2,
  },
  {
    id: 17n,
    patientId: 3n,
    date: "2025-11-12",
    bp: "116/70",
    hr: 86,
    temp: 36.9,
    rr: 19,
    spo2: 95,
    weight: 74.8,
  },
  {
    id: 18n,
    patientId: 3n,
    date: "2025-12-08",
    bp: "114/70",
    hr: 84,
    temp: 36.8,
    rr: 18,
    spo2: 91,
    weight: 74.5,
  },
  {
    id: 19n,
    patientId: 3n,
    date: "2026-01-15",
    bp: "118/72",
    hr: 89,
    temp: 37.2,
    rr: 21,
    spo2: 92,
    weight: 74.7,
  },
  {
    id: 20n,
    patientId: 3n,
    date: "2026-02-12",
    bp: "116/70",
    hr: 86,
    temp: 37.0,
    rr: 20,
    spo2: 94,
    weight: 74.6,
  },
  {
    id: 21n,
    patientId: 3n,
    date: "2026-03-10",
    bp: "114/68",
    hr: 82,
    temp: 36.8,
    rr: 19,
    spo2: 93,
    weight: 74.3,
  },

  // Patient 4 - James Thornton (cardiac, elevated HR/BP improving)
  {
    id: 22n,
    patientId: 4n,
    date: "2025-09-08",
    bp: "152/96",
    hr: 105,
    temp: 36.9,
    rr: 18,
    spo2: 95,
    weight: 84.0,
  },
  {
    id: 23n,
    patientId: 4n,
    date: "2025-10-12",
    bp: "148/93",
    hr: 100,
    temp: 36.8,
    rr: 17,
    spo2: 95,
    weight: 83.8,
  },
  {
    id: 24n,
    patientId: 4n,
    date: "2025-11-10",
    bp: "144/90",
    hr: 96,
    temp: 36.8,
    rr: 17,
    spo2: 96,
    weight: 83.5,
  },
  {
    id: 25n,
    patientId: 4n,
    date: "2025-12-07",
    bp: "140/88",
    hr: 90,
    temp: 36.7,
    rr: 16,
    spo2: 96,
    weight: 83.2,
  },
  {
    id: 26n,
    patientId: 4n,
    date: "2026-01-14",
    bp: "136/85",
    hr: 86,
    temp: 36.6,
    rr: 16,
    spo2: 97,
    weight: 83.0,
  },
  {
    id: 27n,
    patientId: 4n,
    date: "2026-02-11",
    bp: "133/83",
    hr: 83,
    temp: 36.7,
    rr: 16,
    spo2: 97,
    weight: 82.7,
  },
  {
    id: 28n,
    patientId: 4n,
    date: "2026-03-08",
    bp: "130/82",
    hr: 80,
    temp: 36.6,
    rr: 15,
    spo2: 97,
    weight: 82.5,
  },

  // Patient 5 - Aisha Patel (young, healthy)
  {
    id: 29n,
    patientId: 5n,
    date: "2025-09-20",
    bp: "110/68",
    hr: 62,
    temp: 36.5,
    rr: 14,
    spo2: 99,
    weight: 62.0,
  },
  {
    id: 30n,
    patientId: 5n,
    date: "2025-10-22",
    bp: "112/70",
    hr: 63,
    temp: 36.6,
    rr: 14,
    spo2: 99,
    weight: 62.1,
  },
  {
    id: 31n,
    patientId: 5n,
    date: "2025-11-18",
    bp: "110/68",
    hr: 62,
    temp: 36.5,
    rr: 14,
    spo2: 99,
    weight: 62.0,
  },
  {
    id: 32n,
    patientId: 5n,
    date: "2025-12-15",
    bp: "114/70",
    hr: 64,
    temp: 36.6,
    rr: 14,
    spo2: 99,
    weight: 62.2,
  },
  {
    id: 33n,
    patientId: 5n,
    date: "2026-01-12",
    bp: "112/70",
    hr: 63,
    temp: 36.5,
    rr: 14,
    spo2: 99,
    weight: 62.1,
  },
  {
    id: 34n,
    patientId: 5n,
    date: "2026-02-16",
    bp: "110/68",
    hr: 62,
    temp: 36.5,
    rr: 14,
    spo2: 99,
    weight: 62.0,
  },
  {
    id: 35n,
    patientId: 5n,
    date: "2026-03-10",
    bp: "110/68",
    hr: 63,
    temp: 36.5,
    rr: 14,
    spo2: 99,
    weight: 62.0,
  },

  // Patient 6 - William Park (elderly, moderate hypertension)
  {
    id: 36n,
    patientId: 6n,
    date: "2025-09-08",
    bp: "150/90",
    hr: 76,
    temp: 36.7,
    rr: 17,
    spo2: 96,
    weight: 78.0,
  },
  {
    id: 37n,
    patientId: 6n,
    date: "2025-10-14",
    bp: "148/88",
    hr: 75,
    temp: 36.8,
    rr: 17,
    spo2: 96,
    weight: 77.8,
  },
  {
    id: 38n,
    patientId: 6n,
    date: "2025-11-12",
    bp: "146/87",
    hr: 75,
    temp: 36.8,
    rr: 17,
    spo2: 97,
    weight: 77.5,
  },
  {
    id: 39n,
    patientId: 6n,
    date: "2025-12-10",
    bp: "148/88",
    hr: 76,
    temp: 36.7,
    rr: 17,
    spo2: 96,
    weight: 77.3,
  },
  {
    id: 40n,
    patientId: 6n,
    date: "2026-01-08",
    bp: "145/86",
    hr: 74,
    temp: 36.7,
    rr: 16,
    spo2: 97,
    weight: 77.0,
  },
  {
    id: 41n,
    patientId: 6n,
    date: "2026-02-12",
    bp: "142/85",
    hr: 73,
    temp: 36.8,
    rr: 16,
    spo2: 97,
    weight: 76.8,
  },
  {
    id: 42n,
    patientId: 6n,
    date: "2026-03-05",
    bp: "140/84",
    hr: 72,
    temp: 36.7,
    rr: 16,
    spo2: 97,
    weight: 76.5,
  },

  // Patient 7 - Maria Garcia (stable)
  {
    id: 43n,
    patientId: 7n,
    date: "2025-09-18",
    bp: "122/76",
    hr: 70,
    temp: 36.6,
    rr: 15,
    spo2: 98,
    weight: 66.0,
  },
  {
    id: 44n,
    patientId: 7n,
    date: "2025-10-20",
    bp: "120/74",
    hr: 69,
    temp: 36.6,
    rr: 15,
    spo2: 98,
    weight: 65.9,
  },
  {
    id: 45n,
    patientId: 7n,
    date: "2025-11-22",
    bp: "118/73",
    hr: 68,
    temp: 36.5,
    rr: 15,
    spo2: 98,
    weight: 65.8,
  },
  {
    id: 46n,
    patientId: 7n,
    date: "2025-12-18",
    bp: "120/74",
    hr: 70,
    temp: 36.6,
    rr: 15,
    spo2: 98,
    weight: 65.7,
  },
  {
    id: 47n,
    patientId: 7n,
    date: "2026-01-15",
    bp: "122/76",
    hr: 71,
    temp: 36.6,
    rr: 15,
    spo2: 98,
    weight: 65.8,
  },
  {
    id: 48n,
    patientId: 7n,
    date: "2026-02-12",
    bp: "120/74",
    hr: 69,
    temp: 36.5,
    rr: 15,
    spo2: 98,
    weight: 65.6,
  },
  {
    id: 49n,
    patientId: 7n,
    date: "2026-03-10",
    bp: "118/72",
    hr: 68,
    temp: 36.5,
    rr: 15,
    spo2: 98,
    weight: 65.5,
  },

  // Patient 8 - Kevin Nguyen (young, slightly elevated BP)
  {
    id: 50n,
    patientId: 8n,
    date: "2025-09-12",
    bp: "134/83",
    hr: 73,
    temp: 36.7,
    rr: 16,
    spo2: 98,
    weight: 80.0,
  },
  {
    id: 51n,
    patientId: 8n,
    date: "2025-10-15",
    bp: "136/84",
    hr: 74,
    temp: 36.7,
    rr: 16,
    spo2: 98,
    weight: 80.2,
  },
  {
    id: 52n,
    patientId: 8n,
    date: "2025-11-18",
    bp: "138/85",
    hr: 75,
    temp: 36.8,
    rr: 16,
    spo2: 98,
    weight: 80.5,
  },
  {
    id: 53n,
    patientId: 8n,
    date: "2025-12-12",
    bp: "137/84",
    hr: 74,
    temp: 36.7,
    rr: 16,
    spo2: 98,
    weight: 80.3,
  },
  {
    id: 54n,
    patientId: 8n,
    date: "2026-01-10",
    bp: "140/86",
    hr: 76,
    temp: 36.8,
    rr: 16,
    spo2: 98,
    weight: 80.7,
  },
  {
    id: 55n,
    patientId: 8n,
    date: "2026-02-14",
    bp: "138/85",
    hr: 75,
    temp: 36.8,
    rr: 16,
    spo2: 98,
    weight: 80.5,
  },
  {
    id: 56n,
    patientId: 8n,
    date: "2026-03-08",
    bp: "136/84",
    hr: 74,
    temp: 36.7,
    rr: 16,
    spo2: 98,
    weight: 80.4,
  },

  // Patient 9 - Priya Patel (CKD, trending worse hypertension)
  {
    id: 57n,
    patientId: 9n,
    date: "2025-09-10",
    bp: "136/82",
    hr: 72,
    temp: 36.7,
    rr: 16,
    spo2: 97,
    weight: 58.0,
  },
  {
    id: 58n,
    patientId: 9n,
    date: "2025-10-08",
    bp: "138/84",
    hr: 73,
    temp: 36.8,
    rr: 16,
    spo2: 97,
    weight: 58.2,
  },
  {
    id: 59n,
    patientId: 9n,
    date: "2025-11-12",
    bp: "140/86",
    hr: 74,
    temp: 36.8,
    rr: 17,
    spo2: 97,
    weight: 58.5,
  },
  {
    id: 60n,
    patientId: 9n,
    date: "2025-12-10",
    bp: "142/88",
    hr: 75,
    temp: 36.9,
    rr: 17,
    spo2: 96,
    weight: 58.7,
  },
  {
    id: 61n,
    patientId: 9n,
    date: "2026-01-14",
    bp: "145/90",
    hr: 76,
    temp: 37.0,
    rr: 17,
    spo2: 96,
    weight: 59.0,
  },
  {
    id: 62n,
    patientId: 9n,
    date: "2026-02-10",
    bp: "147/91",
    hr: 77,
    temp: 37.0,
    rr: 18,
    spo2: 96,
    weight: 59.2,
  },
  {
    id: 63n,
    patientId: 9n,
    date: "2026-03-08",
    bp: "149/93",
    hr: 78,
    temp: 37.1,
    rr: 18,
    spo2: 96,
    weight: 59.5,
  },

  // Patient 10 - Aisha Kamau (young, asthma)
  {
    id: 64n,
    patientId: 10n,
    date: "2025-09-15",
    bp: "114/72",
    hr: 80,
    temp: 36.9,
    rr: 18,
    spo2: 96,
    weight: 55.0,
  },
  {
    id: 65n,
    patientId: 10n,
    date: "2025-10-12",
    bp: "112/70",
    hr: 78,
    temp: 36.8,
    rr: 17,
    spo2: 97,
    weight: 55.2,
  },
  {
    id: 66n,
    patientId: 10n,
    date: "2025-11-10",
    bp: "116/72",
    hr: 82,
    temp: 37.1,
    rr: 19,
    spo2: 95,
    weight: 55.1,
  },
  {
    id: 67n,
    patientId: 10n,
    date: "2025-12-08",
    bp: "114/72",
    hr: 80,
    temp: 36.9,
    rr: 18,
    spo2: 96,
    weight: 55.0,
  },
  {
    id: 68n,
    patientId: 10n,
    date: "2026-01-14",
    bp: "112/70",
    hr: 78,
    temp: 36.8,
    rr: 17,
    spo2: 97,
    weight: 55.2,
  },
  {
    id: 69n,
    patientId: 10n,
    date: "2026-02-12",
    bp: "116/73",
    hr: 83,
    temp: 37.2,
    rr: 20,
    spo2: 92,
    weight: 55.3,
  },
  {
    id: 70n,
    patientId: 10n,
    date: "2026-03-10",
    bp: "114/72",
    hr: 81,
    temp: 37.0,
    rr: 18,
    spo2: 95,
    weight: 55.1,
  },
];
// ─── Care Gaps ────────────────────────────────────────────────────────────────

export interface DemoCareGap {
  id: bigint;
  patientId: bigint;
  item: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  category: string;
  ordered: boolean;
}

export const DEMO_CARE_GAPS: DemoCareGap[] = [
  // Patient 1 - Margaret Chen (diabetic, hypertensive, 68F)
  {
    id: 1n,
    patientId: 1n,
    item: "HbA1c (overdue 6 months)",
    dueDate: "2024-09-01",
    priority: "high",
    category: "Chronic Disease Management",
    ordered: false,
  },
  {
    id: 2n,
    patientId: 1n,
    item: "Mammogram (overdue 14 months)",
    dueDate: "2024-01-15",
    priority: "high",
    category: "Preventive Screening",
    ordered: false,
  },
  {
    id: 3n,
    patientId: 1n,
    item: "Flu Shot",
    dueDate: "2024-10-01",
    priority: "medium",
    category: "Immunizations",
    ordered: true,
  },
  {
    id: 4n,
    patientId: 1n,
    item: "Eye Exam (diabetic)",
    dueDate: "2024-12-01",
    priority: "high",
    category: "Chronic Disease Management",
    ordered: false,
  },
  {
    id: 5n,
    patientId: 1n,
    item: "Foot Exam (diabetic)",
    dueDate: "2025-01-01",
    priority: "medium",
    category: "Chronic Disease Management",
    ordered: false,
  },

  // Patient 2 - Robert Okonkwo (CHF, 71M)
  {
    id: 6n,
    patientId: 2n,
    item: "Echocardiogram (annual CHF follow-up)",
    dueDate: "2024-08-01",
    priority: "high",
    category: "Chronic Disease Management",
    ordered: false,
  },
  {
    id: 7n,
    patientId: 2n,
    item: "Pneumococcal Vaccine",
    dueDate: "2024-11-01",
    priority: "medium",
    category: "Immunizations",
    ordered: false,
  },
  {
    id: 8n,
    patientId: 2n,
    item: "Colorectal Cancer Screening",
    dueDate: "2024-06-01",
    priority: "high",
    category: "Preventive Screening",
    ordered: false,
  },
  {
    id: 9n,
    patientId: 2n,
    item: "Lipid Panel",
    dueDate: "2025-01-01",
    priority: "medium",
    category: "Chronic Disease Management",
    ordered: true,
  },

  // Patient 3 - Linda Martinez (asthma, 42F)
  {
    id: 10n,
    patientId: 3n,
    item: "Asthma Action Plan Review",
    dueDate: "2024-10-01",
    priority: "medium",
    category: "Chronic Disease Management",
    ordered: false,
  },
  {
    id: 11n,
    patientId: 3n,
    item: "Flu Shot",
    dueDate: "2024-10-01",
    priority: "medium",
    category: "Immunizations",
    ordered: false,
  },
  {
    id: 12n,
    patientId: 3n,
    item: "Cervical Cancer Screening (Pap)",
    dueDate: "2024-07-01",
    priority: "high",
    category: "Preventive Screening",
    ordered: false,
  },

  // Patient 4 - James Wilson (CAD, 61M)
  {
    id: 13n,
    patientId: 4n,
    item: "Echocardiogram",
    dueDate: "2024-09-01",
    priority: "high",
    category: "Chronic Disease Management",
    ordered: false,
  },
  {
    id: 14n,
    patientId: 4n,
    item: "Lipid Panel",
    dueDate: "2024-12-01",
    priority: "high",
    category: "Chronic Disease Management",
    ordered: false,
  },
  {
    id: 15n,
    patientId: 4n,
    item: "Colonoscopy",
    dueDate: "2024-01-01",
    priority: "high",
    category: "Preventive Screening",
    ordered: false,
  },
  {
    id: 16n,
    patientId: 4n,
    item: "BP Check (30 days)",
    dueDate: "2025-02-01",
    priority: "medium",
    category: "Chronic Disease Management",
    ordered: true,
  },

  // Patient 5 - Sarah Kim (hypothyroid, 28F)
  {
    id: 17n,
    patientId: 5n,
    item: "TSH Level Check",
    dueDate: "2025-01-01",
    priority: "medium",
    category: "Chronic Disease Management",
    ordered: false,
  },
  {
    id: 18n,
    patientId: 5n,
    item: "Flu Shot",
    dueDate: "2024-10-01",
    priority: "low",
    category: "Immunizations",
    ordered: true,
  },

  // Patient 6 - David Thompson (HTN, 72M)
  {
    id: 19n,
    patientId: 6n,
    item: "BP Check (90 days)",
    dueDate: "2024-12-01",
    priority: "high",
    category: "Chronic Disease Management",
    ordered: false,
  },
  {
    id: 20n,
    patientId: 6n,
    item: "Colonoscopy (overdue 3 years)",
    dueDate: "2022-01-01",
    priority: "high",
    category: "Preventive Screening",
    ordered: false,
  },
  {
    id: 21n,
    patientId: 6n,
    item: "Shingles Vaccine (Shingrix)",
    dueDate: "2024-06-01",
    priority: "medium",
    category: "Immunizations",
    ordered: false,
  },
  {
    id: 22n,
    patientId: 6n,
    item: "Lipid Panel",
    dueDate: "2025-01-01",
    priority: "medium",
    category: "Chronic Disease Management",
    ordered: false,
  },

  // Patient 7 - Maria Garcia (osteoporosis, 77F)
  {
    id: 23n,
    patientId: 7n,
    item: "DEXA Scan (bone density)",
    dueDate: "2024-08-01",
    priority: "high",
    category: "Preventive Screening",
    ordered: false,
  },
  {
    id: 24n,
    patientId: 7n,
    item: "Vitamin D Level",
    dueDate: "2025-01-01",
    priority: "medium",
    category: "Chronic Disease Management",
    ordered: true,
  },
  {
    id: 25n,
    patientId: 7n,
    item: "Pneumococcal Vaccine",
    dueDate: "2024-09-01",
    priority: "medium",
    category: "Immunizations",
    ordered: false,
  },

  // Patient 8 - Kevin Nguyen (HTN, 38M)
  {
    id: 26n,
    patientId: 8n,
    item: "BP Check (30 days)",
    dueDate: "2025-02-15",
    priority: "high",
    category: "Chronic Disease Management",
    ordered: false,
  },
  {
    id: 27n,
    patientId: 8n,
    item: "Lipid Panel",
    dueDate: "2025-01-01",
    priority: "medium",
    category: "Chronic Disease Management",
    ordered: false,
  },

  // Patient 9 - Priya Patel (CKD, 52F)
  {
    id: 28n,
    patientId: 9n,
    item: "GFR / Creatinine (quarterly)",
    dueDate: "2024-12-01",
    priority: "high",
    category: "Chronic Disease Management",
    ordered: false,
  },
  {
    id: 29n,
    patientId: 9n,
    item: "Potassium Level",
    dueDate: "2025-01-01",
    priority: "high",
    category: "Chronic Disease Management",
    ordered: false,
  },
  {
    id: 30n,
    patientId: 9n,
    item: "Nephrology Referral Follow-up",
    dueDate: "2025-02-01",
    priority: "medium",
    category: "Chronic Disease Management",
    ordered: true,
  },

  // Patient 10 - Aisha Kamau (asthma, 31F)
  {
    id: 31n,
    patientId: 10n,
    item: "Asthma Control Questionnaire",
    dueDate: "2025-02-01",
    priority: "medium",
    category: "Chronic Disease Management",
    ordered: false,
  },
  {
    id: 32n,
    patientId: 10n,
    item: "Flu Shot",
    dueDate: "2024-10-01",
    priority: "low",
    category: "Immunizations",
    ordered: false,
  },
];

// ─── Allergies ────────────────────────────────────────────────────────────────

export interface DemoAllergy {
  id: bigint;
  patientId: bigint;
  allergen: string;
  reaction: string;
  severity: "mild" | "moderate" | "severe";
  dateNoted: string;
}

export const DEMO_ALLERGIES: DemoAllergy[] = [
  // Patient 1 - Margaret Chen
  {
    id: 1n,
    patientId: 1n,
    allergen: "Penicillin",
    reaction: "Anaphylaxis, urticaria",
    severity: "severe",
    dateNoted: "2018-03-12",
  },
  {
    id: 2n,
    patientId: 1n,
    allergen: "Sulfonamides",
    reaction: "Maculopapular rash",
    severity: "moderate",
    dateNoted: "2020-07-01",
  },

  // Patient 2 - Robert Okonkwo
  {
    id: 3n,
    patientId: 2n,
    allergen: "NSAIDs (Ibuprofen)",
    reaction: "GI upset, gastric bleeding",
    severity: "moderate",
    dateNoted: "2019-05-20",
  },
  {
    id: 4n,
    patientId: 2n,
    allergen: "Codeine",
    reaction: "Nausea, vomiting, excessive sedation",
    severity: "moderate",
    dateNoted: "2015-11-10",
  },

  // Patient 3 - Linda Martinez
  {
    id: 5n,
    patientId: 3n,
    allergen: "Latex",
    reaction: "Contact dermatitis, urticaria",
    severity: "moderate",
    dateNoted: "2017-08-03",
  },
  {
    id: 6n,
    patientId: 3n,
    allergen: "Aspirin",
    reaction: "Bronchospasm, exacerbates asthma",
    severity: "severe",
    dateNoted: "2021-02-14",
  },

  // Patient 4 - James Wilson
  {
    id: 7n,
    patientId: 4n,
    allergen: "Shellfish",
    reaction: "Anaphylaxis, throat swelling",
    severity: "severe",
    dateNoted: "2010-06-15",
  },
  {
    id: 8n,
    patientId: 4n,
    allergen: "Lisinopril (ACE inhibitors)",
    reaction: "Angioedema, dry cough",
    severity: "moderate",
    dateNoted: "2022-04-01",
  },

  // Patient 5 - Sarah Kim (NKDA — no entries)

  // Patient 6 - David Thompson
  {
    id: 9n,
    patientId: 6n,
    allergen: "Penicillin",
    reaction: "Rash, hives",
    severity: "mild",
    dateNoted: "2005-01-20",
  },
  {
    id: 10n,
    patientId: 6n,
    allergen: "Metoclopramide",
    reaction: "Extrapyramidal symptoms, restlessness",
    severity: "moderate",
    dateNoted: "2019-09-11",
  },

  // Patient 7 - Maria Garcia
  {
    id: 11n,
    patientId: 7n,
    allergen: "Morphine",
    reaction: "Nausea, respiratory depression",
    severity: "moderate",
    dateNoted: "2014-12-05",
  },

  // Patient 8 - Kevin Nguyen
  {
    id: 12n,
    patientId: 8n,
    allergen: "Amoxicillin",
    reaction: "Maculopapular rash",
    severity: "mild",
    dateNoted: "2023-01-10",
  },
  {
    id: 13n,
    patientId: 8n,
    allergen: "Shellfish",
    reaction: "Urticaria, flushing",
    severity: "moderate",
    dateNoted: "2016-07-22",
  },

  // Patient 9 - Priya Patel
  {
    id: 14n,
    patientId: 9n,
    allergen: "Contrast Dye (Iodine)",
    reaction: "Anaphylactoid reaction",
    severity: "severe",
    dateNoted: "2020-11-30",
  },
  {
    id: 15n,
    patientId: 9n,
    allergen: "NSAIDs",
    reaction: "Acute kidney injury risk, GI bleeding",
    severity: "severe",
    dateNoted: "2021-03-15",
  },

  // Patient 10 - Aisha Kamau
  {
    id: 16n,
    patientId: 10n,
    allergen: "Pollen (seasonal)",
    reaction: "Rhinitis, conjunctivitis",
    severity: "mild",
    dateNoted: "2022-04-01",
  },
];

// ─── Refill Requests ──────────────────────────────────────────────────────────

export interface DemoRefillRequest {
  id: string;
  patientId: string;
  patientName: string;
  medication: string;
  requestedAt: string;
  status: "pending" | "approved" | "denied";
  notes: string;
  denialReason?: string;
}

export const DEMO_REFILL_REQUESTS: DemoRefillRequest[] = [
  {
    id: "rr1",
    patientId: "p1",
    patientName: "Margaret Chen",
    medication: "Metformin 500mg",
    requestedAt: "2026-03-14",
    status: "pending",
    notes: "Running low, need 90-day supply",
  },
  {
    id: "rr2",
    patientId: "p3",
    patientName: "Robert Martinez",
    medication: "Lisinopril 10mg",
    requestedAt: "2026-03-15",
    status: "pending",
    notes: "",
  },
  {
    id: "rr3",
    patientId: "p2",
    patientName: "James Wilson",
    medication: "Atorvastatin 40mg",
    requestedAt: "2026-03-13",
    status: "approved",
    notes: "Chronic use",
  },
];

// ─── Team Notes ───────────────────────────────────────────────────────────────

export interface DemoTeamNote {
  id: string;
  patientId: string;
  author: string;
  role: string;
  timestamp: string;
  note: string;
}

export const DEMO_TEAM_NOTES: DemoTeamNote[] = [
  {
    id: "tn1",
    patientId: "p1",
    author: "Dr. Sarah Johnson",
    role: "Doctor",
    timestamp: "2026-03-14T09:15:00",
    note: "Patient needs extra time during appointments due to hearing difficulty. Speak slowly and confirm understanding.",
  },
  {
    id: "tn2",
    patientId: "p1",
    author: "Nurse Mike Torres",
    role: "Nurse",
    timestamp: "2026-03-14T10:30:00",
    note: "Patient expressed anxiety about insulin injections. Recommend diabetes educator referral.",
  },
  {
    id: "tn3",
    patientId: "p2",
    author: "Dr. Sarah Johnson",
    role: "Doctor",
    timestamp: "2026-03-13T14:00:00",
    note: "Family requests to be present for all discussions about diagnosis. Contact James Wilson Jr. (son) at 555-0192.",
  },
  {
    id: "tn4",
    patientId: "p3",
    author: "Care Coordinator",
    role: "Care Coordinator",
    timestamp: "2026-03-12T11:00:00",
    note: "Referred to cardiac rehab program. Follow up needed to confirm enrollment.",
  },
  {
    id: "tn5",
    patientId: "p4",
    author: "Nurse Mike Torres",
    role: "Nurse",
    timestamp: "2026-03-13T08:45:00",
    note: "Patient reports persistent fatigue despite adequate sleep. Suggest CBC and thyroid panel at next visit.",
  },
  {
    id: "tn6",
    patientId: "p5",
    author: "Dr. Sarah Johnson",
    role: "Doctor",
    timestamp: "2026-03-14T15:20:00",
    note: "Patient has language barrier — Korean interpreter required for all appointments. Daughter (Jenny Kim) available as backup.",
  },
  {
    id: "tn7",
    patientId: "p6",
    author: "Care Coordinator",
    role: "Care Coordinator",
    timestamp: "2026-03-11T10:00:00",
    note: "Transportation assistance arranged for chemotherapy appointments. Contact social work if additional support needed.",
  },
  {
    id: "tn8",
    patientId: "p7",
    author: "Dr. Sarah Johnson",
    role: "Doctor",
    timestamp: "2026-03-12T09:30:00",
    note: "Patient is pregnant — avoid NSAIDs, fluoroquinolones, and ACE inhibitors. OB/GYN Dr. Patel coordinating care.",
  },
  {
    id: "tn9",
    patientId: "p8",
    author: "Nurse Mike Torres",
    role: "Nurse",
    timestamp: "2026-03-10T14:15:00",
    note: "Post-surgical recovery ongoing. Wound site healing well. Patient educated on signs of infection — knows to call immediately.",
  },
  {
    id: "tn10",
    patientId: "p9",
    author: "Care Coordinator",
    role: "Care Coordinator",
    timestamp: "2026-03-13T11:45:00",
    note: "Patient enrolled in chronic pain management program. Weekly check-in calls scheduled. Escalate if pain score exceeds 8/10.",
  },
  {
    id: "tn11",
    patientId: "p10",
    author: "Dr. Sarah Johnson",
    role: "Doctor",
    timestamp: "2026-03-14T16:00:00",
    note: "New patient — complex cardiac history. Obtain all records from previous cardiologist at UCSF before next appointment.",
  },
];

// ─── Waitlist ─────────────────────────────────────────────────────────────────

export interface DemoWaitlistEntry {
  id: string;
  patientName: string;
  reason: string;
  dateAdded: string;
  priority: "urgent" | "routine";
  status: "waiting" | "notified";
}

export const DEMO_WAITLIST: DemoWaitlistEntry[] = [
  {
    id: "wl1",
    patientName: "Margaret Okonkwo",
    reason: "Orthopedic consult — right knee pain, limited mobility",
    dateAdded: "2026-03-10",
    priority: "routine",
    status: "waiting",
  },
  {
    id: "wl2",
    patientName: "Thomas Brennan",
    reason: "Cardiology follow-up — post-MI medication adjustment",
    dateAdded: "2026-03-11",
    priority: "urgent",
    status: "notified",
  },
  {
    id: "wl3",
    patientName: "Yuki Tanaka",
    reason: "Annual physical — overdue, last visit 18 months ago",
    dateAdded: "2026-03-12",
    priority: "routine",
    status: "waiting",
  },
  {
    id: "wl4",
    patientName: "Aisha Oduya",
    reason: "Dermatology referral — suspicious skin lesion evaluation",
    dateAdded: "2026-03-13",
    priority: "urgent",
    status: "waiting",
  },
  {
    id: "wl5",
    patientName: "Carlos Reyes",
    reason: "Diabetes management review — HbA1c above target range",
    dateAdded: "2026-03-14",
    priority: "routine",
    status: "waiting",
  },
];

// ─── E-Prescribing ────────────────────────────────────────────────────────────
export interface DemoEPrescription {
  id: string;
  patientName: string;
  drug: string;
  dose: string;
  prescriber: string;
  deaNumber: string;
  status: "draft" | "transmitted" | "confirmed" | "failed";
  timestamp: string;
}

export const DEMO_EPRESCRIPTIONS: DemoEPrescription[] = [
  {
    id: "erx1",
    patientName: "Margaret Chen",
    drug: "Lisinopril 10mg",
    dose: "1 tab PO daily",
    prescriber: "Dr. Sarah Okonkwo",
    deaNumber: "BO1234567",
    status: "confirmed",
    timestamp: "2026-03-16T08:14:00Z",
  },
  {
    id: "erx2",
    patientName: "Robert Okonkwo",
    drug: "Metformin 500mg",
    dose: "1 tab PO BID",
    prescriber: "Dr. Sarah Okonkwo",
    deaNumber: "BO1234567",
    status: "transmitted",
    timestamp: "2026-03-16T09:02:00Z",
  },
  {
    id: "erx3",
    patientName: "Sophia Martinez",
    drug: "OxyContin 10mg",
    dose: "1 tab PO q12h PRN pain",
    prescriber: "Dr. Michael Chen",
    deaNumber: "BC9876543",
    status: "draft",
    timestamp: "2026-03-16T09:45:00Z",
  },
  {
    id: "erx4",
    patientName: "William Park",
    drug: "Atorvastatin 40mg",
    dose: "1 tab PO nightly",
    prescriber: "Dr. Sarah Okonkwo",
    deaNumber: "BO1234567",
    status: "confirmed",
    timestamp: "2026-03-15T14:30:00Z",
  },
  {
    id: "erx5",
    patientName: "Patricia Nwosu",
    drug: "Amoxicillin 500mg",
    dose: "1 cap PO TID x 10 days",
    prescriber: "Dr. Amara Patel",
    deaNumber: "BP4561234",
    status: "failed",
    timestamp: "2026-03-16T07:55:00Z",
  },
  {
    id: "erx6",
    patientName: "David Thornton",
    drug: "Albuterol Inhaler",
    dose: "2 puffs q4-6h PRN",
    prescriber: "Dr. Michael Chen",
    deaNumber: "BC9876543",
    status: "draft",
    timestamp: "2026-03-16T10:20:00Z",
  },
];

// ─── Medication Administration Record (MAR) ──────────────────────────────────
export interface DemoMAREntry {
  id: string;
  patientId: string;
  patientName: string;
  room: string;
  medication: string;
  dose: string;
  route: string;
  slots: {
    "06:00": "due" | "administered" | "held" | "refused" | "na";
    "12:00": "due" | "administered" | "held" | "refused" | "na";
    "18:00": "due" | "administered" | "held" | "refused" | "na";
    "22:00": "due" | "administered" | "held" | "refused" | "na";
  };
  administeredBy?: string;
  notes?: string;
}

export const DEMO_MAR_SCHEDULE: DemoMAREntry[] = [
  {
    id: "mar1",
    patientId: "1",
    patientName: "Margaret Chen",
    room: "ICU-1",
    medication: "Lisinopril 10mg",
    dose: "10mg",
    route: "PO",
    slots: {
      "06:00": "administered",
      "12:00": "due",
      "18:00": "due",
      "22:00": "na",
    },
    administeredBy: "Nurse Rivera",
  },
  {
    id: "mar2",
    patientId: "1",
    patientName: "Margaret Chen",
    room: "ICU-1",
    medication: "Furosemide 40mg",
    dose: "40mg",
    route: "IV",
    slots: {
      "06:00": "administered",
      "12:00": "na",
      "18:00": "due",
      "22:00": "na",
    },
    administeredBy: "Nurse Rivera",
  },
  {
    id: "mar3",
    patientId: "2",
    patientName: "Robert Okonkwo",
    room: "GM-204",
    medication: "Metformin 500mg",
    dose: "500mg",
    route: "PO",
    slots: {
      "06:00": "administered",
      "12:00": "due",
      "18:00": "due",
      "22:00": "na",
    },
    administeredBy: "Nurse Thompson",
  },
  {
    id: "mar4",
    patientId: "2",
    patientName: "Robert Okonkwo",
    room: "GM-204",
    medication: "Insulin Glargine 20 units",
    dose: "20 units",
    route: "SubQ",
    slots: { "06:00": "na", "12:00": "na", "18:00": "due", "22:00": "na" },
  },
  {
    id: "mar5",
    patientId: "3",
    patientName: "Sophia Martinez",
    room: "SU-302",
    medication: "Oxycodone 10mg",
    dose: "10mg",
    route: "PO",
    slots: {
      "06:00": "administered",
      "12:00": "held",
      "18:00": "due",
      "22:00": "due",
    },
    administeredBy: "Nurse Kim",
    notes: "Held 12pm dose — patient nauseous",
  },
  {
    id: "mar6",
    patientId: "3",
    patientName: "Sophia Martinez",
    room: "SU-302",
    medication: "Ondansetron 4mg",
    dose: "4mg",
    route: "IV",
    slots: {
      "06:00": "na",
      "12:00": "administered",
      "18:00": "due",
      "22:00": "na",
    },
  },
  {
    id: "mar7",
    patientId: "4",
    patientName: "James Thornton",
    room: "GM-207",
    medication: "Warfarin 5mg",
    dose: "5mg",
    route: "PO",
    slots: { "06:00": "na", "12:00": "na", "18:00": "due", "22:00": "na" },
  },
  {
    id: "mar8",
    patientId: "5",
    patientName: "Aisha Patel",
    room: "PED-101",
    medication: "Amoxicillin 500mg",
    dose: "500mg",
    route: "PO",
    slots: {
      "06:00": "administered",
      "12:00": "due",
      "18:00": "due",
      "22:00": "na",
    },
    administeredBy: "Nurse Lee",
  },
  {
    id: "mar9",
    patientId: "6",
    patientName: "William Park",
    room: "EM-5",
    medication: "Albuterol 2.5mg",
    dose: "2.5mg",
    route: "Neb",
    slots: { "06:00": "due", "12:00": "due", "18:00": "due", "22:00": "due" },
  },
  {
    id: "mar10",
    patientId: "6",
    patientName: "William Park",
    room: "EM-5",
    medication: "Prednisone 40mg",
    dose: "40mg",
    route: "PO",
    slots: { "06:00": "refused", "12:00": "na", "18:00": "na", "22:00": "na" },
    notes: "Patient refused morning dose — counseled on importance",
  },
];

// ─── Nursing Assessments ─────────────────────────────────────────────────────
export interface DemoNursingAssessment {
  id: string;
  patientId: string;
  patientName: string;
  assessedBy: string;
  assessedAt: string;
  pain: { score: number; location: string };
  skin: { status: "intact" | "wound" | "pressure-ulcer"; description: string };
  fallRisk: { level: "low" | "medium" | "high"; morseScore: number };
  mobility: "independent" | "assisted" | "dependent";
  neuro: { status: "alert" | "confused" | "unresponsive"; gcs?: number };
  ivAccess: { type: "peripheral" | "central" | "none"; site?: string };
  dietary: {
    type: "regular" | "soft" | "npo" | "tube-feeding";
    notes?: string;
  };
  notes: string;
}

export const DEMO_NURSING_ASSESSMENTS: DemoNursingAssessment[] = [
  {
    id: "na1",
    patientId: "1",
    patientName: "Margaret Chen",
    assessedBy: "Nurse Rivera",
    assessedAt: "2026-03-16T07:00:00Z",
    pain: { score: 3, location: "Chest, diffuse" },
    skin: {
      status: "intact",
      description: "Skin warm, dry, intact. No breakdown noted.",
    },
    fallRisk: { level: "high", morseScore: 65 },
    mobility: "assisted",
    neuro: { status: "alert", gcs: 15 },
    ivAccess: { type: "central", site: "Right subclavian CVC" },
    dietary: { type: "soft", notes: "Low sodium cardiac diet" },
    notes:
      "Patient alert and oriented x3. Cooperative with care. Encouraged ambulation with PT assist.",
  },
  {
    id: "na2",
    patientId: "2",
    patientName: "Robert Okonkwo",
    assessedBy: "Nurse Thompson",
    assessedAt: "2026-03-16T07:15:00Z",
    pain: { score: 2, location: "None reported" },
    skin: {
      status: "intact",
      description:
        "Skin intact. Feet inspected — no ulcers, calluses noted bilaterally.",
    },
    fallRisk: { level: "medium", morseScore: 40 },
    mobility: "independent",
    neuro: { status: "alert", gcs: 15 },
    ivAccess: { type: "peripheral", site: "Left antecubital 20G" },
    dietary: { type: "regular", notes: "ADA diabetic diet 1800 kcal" },
    notes:
      "Patient ambulating independently. Blood glucose monitoring QID per protocol.",
  },
  {
    id: "na3",
    patientId: "3",
    patientName: "Sophia Martinez",
    assessedBy: "Nurse Kim",
    assessedAt: "2026-03-16T07:30:00Z",
    pain: { score: 6, location: "Right lower quadrant, post-op site" },
    skin: {
      status: "wound",
      description:
        "Post-op incision site right lower quadrant — clean, dry, intact dressing. No signs of infection.",
    },
    fallRisk: { level: "high", morseScore: 70 },
    mobility: "assisted",
    neuro: { status: "alert", gcs: 15 },
    ivAccess: { type: "peripheral", site: "Right antecubital 18G, patent" },
    dietary: {
      type: "soft",
      notes: "Clear liquids advancing to full — post-op day 1",
    },
    notes:
      "Patient reports pain at 6/10 post-op. Administered scheduled analgesia. Reinforced wound care instructions.",
  },
  {
    id: "na4",
    patientId: "4",
    patientName: "James Thornton",
    assessedBy: "Nurse Thompson",
    assessedAt: "2026-03-16T06:45:00Z",
    pain: { score: 1, location: "None" },
    skin: {
      status: "intact",
      description: "Skin intact and well-perfused. No edema noted.",
    },
    fallRisk: { level: "low", morseScore: 20 },
    mobility: "independent",
    neuro: { status: "alert", gcs: 15 },
    ivAccess: { type: "peripheral", site: "Left hand 22G" },
    dietary: { type: "regular", notes: "Cardiac-friendly, low sodium diet" },
    notes:
      "Patient in good spirits. Walking in hallway twice today. INR pending — anticoagulation therapy ongoing.",
  },
  {
    id: "na5",
    patientId: "6",
    patientName: "William Park",
    assessedBy: "Nurse Lee",
    assessedAt: "2026-03-16T07:00:00Z",
    pain: { score: 4, location: "Chest tightness with inspiration" },
    skin: {
      status: "intact",
      description: "Skin intact. Mild diaphoresis noted. No cyanosis.",
    },
    fallRisk: { level: "medium", morseScore: 35 },
    mobility: "assisted",
    neuro: { status: "alert", gcs: 15 },
    ivAccess: { type: "peripheral", site: "Right forearm 20G" },
    dietary: { type: "regular", notes: "No restrictions" },
    notes:
      "Patient with acute asthma exacerbation. SpO2 92% on 2L NC. Nebs given Q4H. Respiratory therapist at bedside.",
  },
];

// ─── Appointment Reminders ────────────────────────────────────────────────────
export type DemoReminderStatus =
  | "not-sent"
  | "sent"
  | "confirmed"
  | "no-response";

export interface DemoAppointmentReminder {
  appointmentId: string;
  patientName: string;
  dateTime: string;
  method: "Email" | "SMS" | "Both";
  status: DemoReminderStatus;
}

export const DEMO_APPOINTMENT_REMINDERS: DemoAppointmentReminder[] = [
  {
    appointmentId: "apt1",
    patientName: "Margaret Chen",
    dateTime: "2026-03-17 09:00",
    method: "Email",
    status: "confirmed",
  },
  {
    appointmentId: "apt2",
    patientName: "Robert Okonkwo",
    dateTime: "2026-03-17 10:30",
    method: "SMS",
    status: "sent",
  },
  {
    appointmentId: "apt3",
    patientName: "Sophia Martinez",
    dateTime: "2026-03-17 11:00",
    method: "Both",
    status: "no-response",
  },
  {
    appointmentId: "apt4",
    patientName: "William Park",
    dateTime: "2026-03-18 08:30",
    method: "Email",
    status: "not-sent",
  },
  {
    appointmentId: "apt5",
    patientName: "Patricia Nwosu",
    dateTime: "2026-03-18 14:00",
    method: "SMS",
    status: "not-sent",
  },
  {
    appointmentId: "apt6",
    patientName: "David Thornton",
    dateTime: "2026-03-19 09:30",
    method: "Email",
    status: "not-sent",
  },
  {
    appointmentId: "apt7",
    patientName: "Angela Washington",
    dateTime: "2026-03-19 11:00",
    method: "Both",
    status: "sent",
  },
  {
    appointmentId: "apt8",
    patientName: "Samuel Park",
    dateTime: "2026-03-20 15:30",
    method: "SMS",
    status: "not-sent",
  },
];

export interface DemoProblem {
  id: number;
  patientId: bigint;
  name: string;
  icd10: string;
  dateOnset: string;
  status: string;
  severity: string;
  resolved?: boolean;
}

export const DEMO_PROBLEMS: DemoProblem[] = [
  // Margaret Chen (id:1) — HTN, DM2, CKD
  {
    id: 1,
    patientId: 1n,
    name: "Type 2 Diabetes Mellitus",
    icd10: "E11.9",
    dateOnset: "2016-04-10",
    status: "chronic",
    severity: "Moderate",
  },
  {
    id: 2,
    patientId: 1n,
    name: "Essential Hypertension",
    icd10: "I10",
    dateOnset: "2014-08-22",
    status: "chronic",
    severity: "Moderate",
  },
  {
    id: 3,
    patientId: 1n,
    name: "Chronic Kidney Disease, Stage 2",
    icd10: "N18.2",
    dateOnset: "2020-01-15",
    status: "chronic",
    severity: "Mild",
  },
  {
    id: 4,
    patientId: 1n,
    name: "Hyperlipidemia",
    icd10: "E78.5",
    dateOnset: "2015-03-09",
    status: "chronic",
    severity: "Mild",
  },
  // Robert Okonkwo (id:2) — CHF, AFib
  {
    id: 5,
    patientId: 2n,
    name: "Congestive Heart Failure, Systolic",
    icd10: "I50.20",
    dateOnset: "2019-11-03",
    status: "chronic",
    severity: "Severe",
  },
  {
    id: 6,
    patientId: 2n,
    name: "Atrial Fibrillation",
    icd10: "I48.91",
    dateOnset: "2020-06-17",
    status: "chronic",
    severity: "Moderate",
  },
  {
    id: 7,
    patientId: 2n,
    name: "Hypokalemia",
    icd10: "E87.6",
    dateOnset: "2023-03-21",
    status: "active",
    severity: "Moderate",
  },
  {
    id: 8,
    patientId: 2n,
    name: "Peripheral Edema",
    icd10: "R60.0",
    dateOnset: "2021-02-14",
    status: "active",
    severity: "Mild",
  },
  // Sophia Martinez (id:3) — Hypothyroidism, GERD
  {
    id: 9,
    patientId: 3n,
    name: "Hypothyroidism",
    icd10: "E03.9",
    dateOnset: "2015-07-20",
    status: "chronic",
    severity: "Mild",
  },
  {
    id: 10,
    patientId: 3n,
    name: "Gastroesophageal Reflux Disease",
    icd10: "K21.9",
    dateOnset: "2018-11-05",
    status: "active",
    severity: "Mild",
  },
  {
    id: 11,
    patientId: 3n,
    name: "Vitamin D Deficiency",
    icd10: "E55.9",
    dateOnset: "2022-01-10",
    status: "resolved",
    severity: "Mild",
    resolved: true,
  },
  // James Thornton (id:4) — Asthma, Obesity
  {
    id: 12,
    patientId: 4n,
    name: "Asthma, Mild Persistent",
    icd10: "J45.30",
    dateOnset: "2005-03-22",
    status: "chronic",
    severity: "Mild",
  },
  {
    id: 13,
    patientId: 4n,
    name: "Obesity",
    icd10: "E66.9",
    dateOnset: "2012-06-01",
    status: "chronic",
    severity: "Moderate",
  },
  {
    id: 14,
    patientId: 4n,
    name: "Allergic Rhinitis",
    icd10: "J30.9",
    dateOnset: "2010-04-15",
    status: "chronic",
    severity: "Mild",
  },
  // Aisha Patel (id:5) — Asthma, Depression
  {
    id: 15,
    patientId: 5n,
    name: "Asthma, Moderate Persistent",
    icd10: "J45.40",
    dateOnset: "2008-09-12",
    status: "chronic",
    severity: "Moderate",
  },
  {
    id: 16,
    patientId: 5n,
    name: "Major Depressive Disorder",
    icd10: "F32.9",
    dateOnset: "2019-05-03",
    status: "active",
    severity: "Moderate",
  },
  {
    id: 17,
    patientId: 5n,
    name: "Iron Deficiency Anemia",
    icd10: "D50.9",
    dateOnset: "2023-02-18",
    status: "resolved",
    severity: "Mild",
    resolved: true,
  },
  // William Park (id:6) — COPD, HTN
  {
    id: 18,
    patientId: 6n,
    name: "COPD, Moderate",
    icd10: "J44.1",
    dateOnset: "2017-10-05",
    status: "chronic",
    severity: "Moderate",
  },
  {
    id: 19,
    patientId: 6n,
    name: "Essential Hypertension",
    icd10: "I10",
    dateOnset: "2013-04-22",
    status: "chronic",
    severity: "Moderate",
  },
  {
    id: 20,
    patientId: 6n,
    name: "Nicotine Dependence",
    icd10: "F17.200",
    dateOnset: "2000-01-01",
    status: "active",
    severity: "Moderate",
  },
  // Eleanor Walsh (id:7) — DM2, Osteoporosis
  {
    id: 21,
    patientId: 7n,
    name: "Type 2 Diabetes Mellitus",
    icd10: "E11.9",
    dateOnset: "2010-06-14",
    status: "chronic",
    severity: "Moderate",
  },
  {
    id: 22,
    patientId: 7n,
    name: "Osteoporosis",
    icd10: "M81.0",
    dateOnset: "2018-09-28",
    status: "chronic",
    severity: "Moderate",
  },
  {
    id: 23,
    patientId: 7n,
    name: "Iron Deficiency Anemia",
    icd10: "D50.9",
    dateOnset: "2025-12-01",
    status: "active",
    severity: "Mild",
  },
  // Carlos Gutierrez (id:8) — Migraine, HTN
  {
    id: 24,
    patientId: 8n,
    name: "Migraine Without Aura",
    icd10: "G43.009",
    dateOnset: "2012-03-17",
    status: "chronic",
    severity: "Moderate",
  },
  {
    id: 25,
    patientId: 8n,
    name: "Essential Hypertension",
    icd10: "I10",
    dateOnset: "2020-11-02",
    status: "chronic",
    severity: "Mild",
  },
  // Priya Nair (id:9) — Arthritis, Fibromyalgia
  {
    id: 26,
    patientId: 9n,
    name: "Rheumatoid Arthritis",
    icd10: "M06.9",
    dateOnset: "2016-08-11",
    status: "chronic",
    severity: "Moderate",
  },
  {
    id: 27,
    patientId: 9n,
    name: "Fibromyalgia",
    icd10: "M79.7",
    dateOnset: "2018-04-25",
    status: "chronic",
    severity: "Moderate",
  },
  {
    id: 28,
    patientId: 9n,
    name: "Vitamin D Deficiency",
    icd10: "E55.9",
    dateOnset: "2022-07-08",
    status: "active",
    severity: "Mild",
  },
  // David Kimani (id:10) — DM2, Obesity
  {
    id: 29,
    patientId: 10n,
    name: "Type 2 Diabetes Mellitus, Uncontrolled",
    icd10: "E11.65",
    dateOnset: "2021-03-05",
    status: "chronic",
    severity: "Severe",
  },
  {
    id: 30,
    patientId: 10n,
    name: "Morbid Obesity",
    icd10: "E66.01",
    dateOnset: "2019-07-22",
    status: "chronic",
    severity: "Moderate",
  },
  {
    id: 31,
    patientId: 10n,
    name: "Hypertension",
    icd10: "I10",
    dateOnset: "2022-01-15",
    status: "chronic",
    severity: "Mild",
  },
];

// ─── Mental Health Assessments ────────────────────────────────────────────────

export interface DemoMentalHealthAssessment {
  id: string;
  patientId: bigint;
  type: "PHQ-9" | "GAD-7";
  date: string;
  scores: number[];
  totalScore: number;
  severity: string;
  providerId: number;
  notes: string;
}

export const DEMO_MENTAL_HEALTH_ASSESSMENTS: DemoMentalHealthAssessment[] = [
  // Margaret Chen (id:1) — depression, improving over time
  {
    id: "mha-1",
    patientId: 1n,
    type: "PHQ-9",
    date: "2025-05-10",
    scores: [3, 3, 2, 3, 2, 2, 2, 1, 0],
    totalScore: 18,
    severity: "Moderately Severe",
    providerId: 1,
    notes:
      "Patient reports significant fatigue and anhedonia. Started sertraline 50mg.",
  },
  {
    id: "mha-2",
    patientId: 1n,
    type: "PHQ-9",
    date: "2025-08-15",
    scores: [2, 2, 2, 2, 1, 1, 2, 1, 0],
    totalScore: 13,
    severity: "Moderate",
    providerId: 1,
    notes:
      "Some improvement since starting medication. Referred to CBT therapist.",
  },
  {
    id: "mha-3",
    patientId: 1n,
    type: "PHQ-9",
    date: "2025-11-20",
    scores: [1, 2, 1, 2, 1, 1, 1, 0, 0],
    totalScore: 9,
    severity: "Mild",
    providerId: 1,
    notes: "Continued improvement. Patient reports better sleep and energy.",
  },
  {
    id: "mha-4",
    patientId: 1n,
    type: "PHQ-9",
    date: "2026-02-18",
    scores: [1, 1, 1, 1, 0, 1, 1, 0, 0],
    totalScore: 6,
    severity: "Mild",
    providerId: 1,
    notes: "Responding well. Continue current plan.",
  },

  // Robert Okonkwo (id:2) — CHF with comorbid anxiety, elevated GAD-7
  {
    id: "mha-5",
    patientId: 2n,
    type: "GAD-7",
    date: "2025-06-05",
    scores: [2, 2, 2, 2, 1, 2, 1],
    totalScore: 12,
    severity: "Moderate",
    providerId: 1,
    notes:
      "Anxiety correlates with cardiac episodes. Recommend mind-body therapy.",
  },
  {
    id: "mha-6",
    patientId: 2n,
    type: "GAD-7",
    date: "2025-09-12",
    scores: [2, 2, 1, 2, 1, 2, 1],
    totalScore: 11,
    severity: "Moderate",
    providerId: 1,
    notes: "Stable but persistent. Added low-dose buspirone.",
  },
  {
    id: "mha-7",
    patientId: 2n,
    type: "GAD-7",
    date: "2025-12-08",
    scores: [2, 1, 1, 2, 1, 1, 1],
    totalScore: 9,
    severity: "Mild",
    providerId: 1,
    notes: "Mild improvement.",
  },
  {
    id: "mha-8",
    patientId: 2n,
    type: "GAD-7",
    date: "2026-03-10",
    scores: [1, 2, 1, 2, 1, 1, 1],
    totalScore: 9,
    severity: "Mild",
    providerId: 1,
    notes: "Holding steady.",
  },

  // James Thornton (id:4) — PTSD/anxiety, stable but elevated
  {
    id: "mha-9",
    patientId: 4n,
    type: "PHQ-9",
    date: "2025-04-22",
    scores: [2, 2, 2, 2, 1, 2, 2, 1, 0],
    totalScore: 14,
    severity: "Moderate",
    providerId: 1,
    notes: "PTSD symptoms contributing. Ongoing trauma-focused CBT.",
  },
  {
    id: "mha-10",
    patientId: 4n,
    type: "PHQ-9",
    date: "2025-07-18",
    scores: [2, 2, 2, 2, 1, 2, 1, 1, 0],
    totalScore: 13,
    severity: "Moderate",
    providerId: 1,
    notes: "Stable. Therapy continues.",
  },
  {
    id: "mha-11",
    patientId: 4n,
    type: "GAD-7",
    date: "2025-07-18",
    scores: [3, 2, 2, 2, 2, 2, 1],
    totalScore: 14,
    severity: "Moderate",
    providerId: 1,
    notes: "Hypervigilance prominent.",
  },
  {
    id: "mha-12",
    patientId: 4n,
    type: "PHQ-9",
    date: "2025-10-14",
    scores: [2, 2, 1, 2, 1, 2, 1, 1, 0],
    totalScore: 12,
    severity: "Moderate",
    providerId: 1,
    notes: "Slight improvement.",
  },
  {
    id: "mha-13",
    patientId: 4n,
    type: "PHQ-9",
    date: "2026-01-20",
    scores: [2, 2, 1, 2, 1, 1, 1, 1, 0],
    totalScore: 11,
    severity: "Moderate",
    providerId: 1,
    notes: "Gradual progress.",
  },

  // Eleanor Walsh (id:7) — mild anxiety, well-managed
  {
    id: "mha-14",
    patientId: 7n,
    type: "GAD-7",
    date: "2025-05-30",
    scores: [1, 1, 1, 1, 0, 1, 1],
    totalScore: 6,
    severity: "Mild",
    providerId: 1,
    notes: "Situational anxiety, work-related stressors.",
  },
  {
    id: "mha-15",
    patientId: 7n,
    type: "GAD-7",
    date: "2025-09-25",
    scores: [1, 1, 0, 1, 0, 1, 0],
    totalScore: 4,
    severity: "Minimal",
    providerId: 1,
    notes: "Improving, stress management techniques effective.",
  },
  {
    id: "mha-16",
    patientId: 7n,
    type: "GAD-7",
    date: "2026-01-15",
    scores: [1, 0, 1, 1, 0, 0, 0],
    totalScore: 3,
    severity: "Minimal",
    providerId: 1,
    notes: "Doing well, discharge from monitoring.",
  },
];

// ─── Caregivers ───────────────────────────────────────────────────────────────

export interface DemoCaregiver {
  id: string;
  patientId: bigint;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  permissions: {
    medicalDecisionMaker: boolean;
    accessToRecords: boolean;
    receiveCommunications: boolean;
    emergencyContact: boolean;
  };
}

export const DEMO_CAREGIVERS: DemoCaregiver[] = [
  // Margaret Chen (id:1)
  {
    id: "cg-1",
    patientId: 1n,
    name: "David Chen",
    relationship: "Spouse",
    phone: "(415) 555-0192",
    email: "david.chen@email.com",
    permissions: {
      medicalDecisionMaker: true,
      accessToRecords: true,
      receiveCommunications: true,
      emergencyContact: true,
    },
  },
  {
    id: "cg-2",
    patientId: 1n,
    name: "Linda Chen",
    relationship: "Child",
    phone: "(415) 555-0193",
    email: "linda.chen@email.com",
    permissions: {
      medicalDecisionMaker: false,
      accessToRecords: true,
      receiveCommunications: false,
      emergencyContact: true,
    },
  },
  // Robert Okonkwo (id:2)
  {
    id: "cg-3",
    patientId: 2n,
    name: "Grace Okonkwo",
    relationship: "Spouse",
    phone: "(212) 555-0281",
    email: "grace.okonkwo@email.com",
    permissions: {
      medicalDecisionMaker: true,
      accessToRecords: true,
      receiveCommunications: true,
      emergencyContact: true,
    },
  },
  // Sofia Ramirez (id:3)
  {
    id: "cg-4",
    patientId: 3n,
    name: "Carlos Ramirez",
    relationship: "Spouse",
    phone: "(305) 555-0174",
    email: "carlos.ramirez@email.com",
    permissions: {
      medicalDecisionMaker: true,
      accessToRecords: true,
      receiveCommunications: true,
      emergencyContact: true,
    },
  },
  // James Thornton (id:4)
  {
    id: "cg-5",
    patientId: 4n,
    name: "Rachel Thornton",
    relationship: "Sibling",
    phone: "(617) 555-0318",
    email: "rachel.thornton@email.com",
    permissions: {
      medicalDecisionMaker: false,
      accessToRecords: false,
      receiveCommunications: true,
      emergencyContact: true,
    },
  },
  // Priya Patel (id:5)
  {
    id: "cg-6",
    patientId: 5n,
    name: "Raj Patel",
    relationship: "Spouse",
    phone: "(312) 555-0425",
    email: "raj.patel@email.com",
    permissions: {
      medicalDecisionMaker: true,
      accessToRecords: true,
      receiveCommunications: true,
      emergencyContact: true,
    },
  },
  // William Park (id:6)
  {
    id: "cg-7",
    patientId: 6n,
    name: "Susan Park",
    relationship: "Spouse",
    phone: "(206) 555-0537",
    email: "susan.park@email.com",
    permissions: {
      medicalDecisionMaker: true,
      accessToRecords: true,
      receiveCommunications: true,
      emergencyContact: true,
    },
  },
  // Eleanor Walsh (id:7)
  {
    id: "cg-8",
    patientId: 7n,
    name: "Patrick Walsh",
    relationship: "Spouse",
    phone: "(617) 555-0641",
    email: "patrick.walsh@email.com",
    permissions: {
      medicalDecisionMaker: true,
      accessToRecords: true,
      receiveCommunications: false,
      emergencyContact: true,
    },
  },
  // Anita Desai (id:8)
  {
    id: "cg-9",
    patientId: 8n,
    name: "Vikram Desai",
    relationship: "Spouse",
    phone: "(312) 555-0754",
    email: "vikram.desai@email.com",
    permissions: {
      medicalDecisionMaker: true,
      accessToRecords: true,
      receiveCommunications: true,
      emergencyContact: true,
    },
  },
  // Laura Fischer (id:9)
  {
    id: "cg-10",
    patientId: 9n,
    name: "Thomas Fischer",
    relationship: "Parent",
    phone: "(415) 555-0862",
    email: "thomas.fischer@email.com",
    permissions: {
      medicalDecisionMaker: false,
      accessToRecords: true,
      receiveCommunications: true,
      emergencyContact: true,
    },
  },
  // David Kimani (id:10)
  {
    id: "cg-11",
    patientId: 10n,
    name: "Amara Kimani",
    relationship: "Spouse",
    phone: "(301) 555-0973",
    email: "amara.kimani@email.com",
    permissions: {
      medicalDecisionMaker: true,
      accessToRecords: true,
      receiveCommunications: true,
      emergencyContact: true,
    },
  },
];
