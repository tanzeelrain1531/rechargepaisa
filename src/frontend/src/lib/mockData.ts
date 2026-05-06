export const mockPatients = [
  {
    id: BigInt(1),
    mrn: "MRN001",
    name: "Alice Johnson",
    dateOfBirth: "1985-03-12",
    phone: "555-0101",
    email: "alice@example.com",
  },
  {
    id: BigInt(2),
    mrn: "MRN002",
    name: "Bob Martinez",
    dateOfBirth: "1972-07-24",
    phone: "555-0102",
    email: "bob@example.com",
  },
  {
    id: BigInt(3),
    mrn: "MRN003",
    name: "Carol White",
    dateOfBirth: "1990-11-05",
    phone: "555-0103",
    email: "carol@example.com",
  },
  {
    id: BigInt(4),
    mrn: "MRN004",
    name: "David Lee",
    dateOfBirth: "1965-01-30",
    phone: "555-0104",
    email: "david@example.com",
  },
];

export const mockAppointments = [
  {
    id: BigInt(1),
    patientId: BigInt(1),
    providerId: BigInt(10),
    date: "2026-03-12T09:00",
    status: "scheduled",
  },
  {
    id: BigInt(2),
    patientId: BigInt(2),
    providerId: BigInt(10),
    date: "2026-03-12T10:30",
    status: "completed",
  },
  {
    id: BigInt(3),
    patientId: BigInt(3),
    providerId: BigInt(11),
    date: "2026-03-13T14:00",
    status: "in-progress",
  },
  {
    id: BigInt(4),
    patientId: BigInt(4),
    providerId: BigInt(11),
    date: "2026-03-11T08:00",
    status: "cancelled",
  },
];

export const mockEncounters = [
  {
    id: BigInt(1),
    appointmentId: BigInt(1),
    patientId: BigInt(1),
    status: "draft" as const,
    vitals: {
      bp: "128/82",
      hr: "72",
      temp: "98.6",
      weight: "145",
      spo2: "98",
      rr: "16",
    },
    soap: {
      subjective:
        "Patient presents with mild chest discomfort for 2 days. Denies radiation. Associated with exertion. No shortness of breath at rest.",
      objective:
        "BP 128/82, HR 72 bpm. Heart sounds regular, no murmurs. Lungs clear to auscultation bilaterally. No peripheral edema.",
      assessment:
        "1. Atypical chest pain — likely musculoskeletal. ACS less likely given presentation.\n2. Hypertension, well-controlled on current regimen.",
      plan: "1. Order ECG and troponin panel.\n2. Continue Lisinopril 10mg daily.\n3. Return to clinic in 1 week or sooner if symptoms worsen.\n4. Advised to avoid strenuous exercise until results reviewed.",
    },
    orders: [
      {
        id: BigInt(1),
        type: "lab" as const,
        name: "Troponin I (High Sensitivity)",
      },
      {
        id: BigInt(2),
        type: "lab" as const,
        name: "BMP (Basic Metabolic Panel)",
      },
      { id: BigInt(3), type: "imaging" as const, name: "12-Lead ECG" },
    ],
    prescriptions: [
      {
        id: BigInt(1),
        drug: "Lisinopril",
        dose: "10mg",
        frequency: "Once daily",
        route: "PO",
      },
    ],
  },
  {
    id: BigInt(2),
    appointmentId: BigInt(2),
    patientId: BigInt(2),
    status: "signed" as const,
    vitals: {
      bp: "148/94",
      hr: "88",
      temp: "98.4",
      weight: "212",
      spo2: "97",
      rr: "18",
    },
    soap: {
      subjective:
        "Patient with Type 2 DM here for 3-month follow-up. Reports occasional dizziness, especially in the morning. Adherent to Metformin.",
      objective:
        "BP 148/94 (elevated). BMI 31.2. Random glucose 187 mg/dL. HbA1c 8.1% (last draw 6 weeks ago). No signs of peripheral neuropathy.",
      assessment:
        "1. Type 2 Diabetes Mellitus — suboptimal control.\n2. Hypertension — uncontrolled, new finding today.",
      plan: "1. Increase Metformin to 1000mg BID.\n2. Start Amlodipine 5mg daily for hypertension.\n3. Repeat HbA1c in 3 months.\n4. Dietary counseling referral placed.\n5. Home BP monitoring instructions given.",
    },
    orders: [
      { id: BigInt(4), type: "lab" as const, name: "HbA1c" },
      { id: BigInt(5), type: "lab" as const, name: "Lipid Panel" },
    ],
    prescriptions: [
      {
        id: BigInt(2),
        drug: "Metformin",
        dose: "1000mg",
        frequency: "Twice daily",
        route: "PO",
      },
      {
        id: BigInt(3),
        drug: "Amlodipine",
        dose: "5mg",
        frequency: "Once daily",
        route: "PO",
      },
    ],
  },
];

export const mockNotes = [
  {
    id: BigInt(1),
    patientId: BigInt(1),
    noteType: "clinical",
    subjective:
      "Patient reports mild chest discomfort. History of hypertension.",
    objective: "BP 128/82, HR 72. Heart sounds regular. Lungs clear.",
    assessment: "Atypical chest pain. Hypertension, well-controlled.",
    plan: "ECG ordered. Continue Lisinopril. Follow up in 1 week.",
    authorId: BigInt(10),
  },
  {
    id: BigInt(2),
    patientId: BigInt(2),
    noteType: "nursing",
    subjective: "Patient reports occasional dizziness in the morning.",
    objective: "BP 140/90. SpO2 98%. Alert and oriented x3.",
    assessment:
      "Hypertension, suboptimal control. Patient educated on medication compliance.",
    plan: "Medication compliance reinforced. BP log provided.",
    authorId: BigInt(20),
  },
  {
    id: BigInt(3),
    patientId: BigInt(3),
    noteType: "procedure",
    subjective: "Wound care follow-up. No pain at site.",
    objective:
      "Wound cleaned and re-dressed. No signs of infection. Granulation tissue present.",
    assessment: "Wound healing appropriately.",
    plan: "Continue daily dressing changes. Return in 3 days for recheck.",
    authorId: BigInt(10),
  },
];

export const mockMedications = [
  {
    id: BigInt(1),
    patientId: BigInt(1),
    name: "Lisinopril",
    dose: "10mg",
    frequency: "Once daily",
    status: "active",
  },
  {
    id: BigInt(2),
    patientId: BigInt(2),
    name: "Metformin",
    dose: "500mg",
    frequency: "Twice daily",
    status: "active",
  },
  {
    id: BigInt(3),
    patientId: BigInt(3),
    name: "Amoxicillin",
    dose: "250mg",
    frequency: "Three times daily",
    status: "stopped",
  },
  {
    id: BigInt(4),
    patientId: BigInt(1),
    name: "Atorvastatin",
    dose: "20mg",
    frequency: "Once nightly",
    status: "active",
  },
];

export const mockLabResults = [
  {
    id: BigInt(1),
    patientId: BigInt(1),
    testName: "HbA1c",
    result: "7.2",
    unit: "%",
    isCritical: false,
  },
  {
    id: BigInt(2),
    patientId: BigInt(2),
    testName: "Potassium",
    result: "6.8",
    unit: "mEq/L",
    isCritical: true,
  },
  {
    id: BigInt(3),
    patientId: BigInt(3),
    testName: "CBC",
    result: "WBC 11.2",
    unit: "k/uL",
    isCritical: false,
  },
  {
    id: BigInt(4),
    patientId: BigInt(4),
    testName: "Troponin",
    result: "0.92",
    unit: "ng/mL",
    isCritical: true,
  },
];

export const mockInvoices = [
  { id: BigInt(1), patientId: BigInt(1), amount: BigInt(350), status: "paid" },
  {
    id: BigInt(2),
    patientId: BigInt(2),
    amount: BigInt(1200),
    status: "submitted",
  },
  { id: BigInt(3), patientId: BigInt(3), amount: BigInt(85), status: "draft" },
  {
    id: BigInt(4),
    patientId: BigInt(4),
    amount: BigInt(540),
    status: "submitted",
  },
];

export const mockMessages = [
  {
    id: BigInt(1),
    fromUserId: BigInt(10),
    toUserId: BigInt(20),
    content: "Please review Alice's ECG results when available.",
  },
  {
    id: BigInt(2),
    fromUserId: BigInt(20),
    toUserId: BigInt(10),
    content: "Noted. Will complete chart by end of shift.",
  },
  {
    id: BigInt(3),
    fromUserId: BigInt(11),
    toUserId: BigInt(10),
    content: "Pharmacy flagged Amoxicillin allergy conflict for Carol.",
  },
];

export const mockAuditLogs = [
  {
    id: BigInt(1),
    actorId: "dr-001",
    action: "CREATE",
    entityType: "Patient",
    entityId: BigInt(1),
    timestamp: BigInt(Date.now() - 3600000),
  },
  {
    id: BigInt(2),
    actorId: "dr-001",
    action: "CREATE",
    entityType: "Appointment",
    entityId: BigInt(1),
    timestamp: BigInt(Date.now() - 3000000),
  },
  {
    id: BigInt(3),
    actorId: "nurse-001",
    action: "CREATE",
    entityType: "ClinicalNote",
    entityId: BigInt(2),
    timestamp: BigInt(Date.now() - 1800000),
  },
  {
    id: BigInt(4),
    actorId: "dr-001",
    action: "CREATE",
    entityType: "LabResult",
    entityId: BigInt(2),
    timestamp: BigInt(Date.now() - 900000),
  },
];
