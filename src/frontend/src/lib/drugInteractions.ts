export type InteractionSeverity =
  | "contraindicated"
  | "major"
  | "moderate"
  | "minor";

export interface InteractionAlert {
  drug1: string;
  drug2: string;
  severity: InteractionSeverity;
  mechanism: string;
  clinicalEffect: string;
  management: string;
}

type InteractionDef = [
  string[], // group A
  string[], // group B
  InteractionSeverity,
  string, // mechanism
  string, // clinicalEffect
  string, // management
];

const MAOIS = [
  "phenelzine",
  "tranylcypromine",
  "selegiline",
  "isocarboxazid",
  "rasagiline",
  "moclobemide",
  "maoi",
];
const SSRIS = [
  "fluoxetine",
  "sertraline",
  "paroxetine",
  "escitalopram",
  "citalopram",
  "fluvoxamine",
];
const SNRIS = ["venlafaxine", "duloxetine", "desvenlafaxine"];
const SIMVASTATIN_LOVASTATIN = ["simvastatin", "lovastatin"];
const STRONG_CYP3A4 = [
  "clarithromycin",
  "erythromycin",
  "itraconazole",
  "ketoconazole",
];
const QT_PROLONGERS = [
  "haloperidol",
  "sotalol",
  "quetiapine",
  "azithromycin",
  "ciprofloxacin",
  "ondansetron",
  "methadone",
];
const NSAIDS = [
  "ibuprofen",
  "naproxen",
  "ketorolac",
  "diclofenac",
  "celecoxib",
  "indomethacin",
  "meloxicam",
  "piroxicam",
];
const WARFARIN_POTENTIATORS = [
  "fluconazole",
  "metronidazole",
  "trimethoprim",
  "sulfamethoxazole",
  "co-trimoxazole",
];
const ACE_INHIBITORS = [
  "lisinopril",
  "enalapril",
  "ramipril",
  "captopril",
  "benazepril",
  "quinapril",
  "fosinopril",
  "perindopril",
  "trandolapril",
];
const K_SPARING_DIURETICS = [
  "spironolactone",
  "eplerenone",
  "triamterene",
  "amiloride",
];
const ARBS = [
  "losartan",
  "valsartan",
  "irbesartan",
  "olmesartan",
  "telmisartan",
  "candesartan",
  "azilsartan",
];
const BENZODIAZEPINES = [
  "diazepam",
  "lorazepam",
  "alprazolam",
  "clonazepam",
  "temazepam",
  "midazolam",
  "oxazepam",
  "triazolam",
  "chlordiazepoxide",
];
const OPIOIDS = [
  "morphine",
  "oxycodone",
  "hydrocodone",
  "fentanyl",
  "hydromorphone",
  "codeine",
  "oxymorphone",
  "buprenorphine",
  "methadone",
  "tapentadol",
];
const FLUOROQUINOLONES = [
  "ciprofloxacin",
  "levofloxacin",
  "moxifloxacin",
  "norfloxacin",
  "ofloxacin",
];
const TRIPTANS = [
  "sumatriptan",
  "rizatriptan",
  "eletriptan",
  "almotriptan",
  "naratriptan",
  "zolmitriptan",
  "frovatriptan",
];
const BETA_BLOCKERS = [
  "metoprolol",
  "atenolol",
  "carvedilol",
  "bisoprolol",
  "propranolol",
  "labetalol",
  "nadolol",
  "nebivolol",
];
const NON_DHP_CCB = ["verapamil", "diltiazem"];
const STATINS_ALL = [
  "simvastatin",
  "lovastatin",
  "atorvastatin",
  "rosuvastatin",
  "pravastatin",
  "fluvastatin",
  "pitavastatin",
];
const CORTICOSTEROIDS = [
  "prednisone",
  "prednisolone",
  "methylprednisolone",
  "dexamethasone",
  "hydrocortisone",
  "budesonide",
  "triamcinolone",
  "betamethasone",
];
const ANTIHYPERTENSIVES = [
  ...ACE_INHIBITORS,
  ...ARBS,
  ...BETA_BLOCKERS,
  "amlodipine",
  "nifedipine",
  "hydrochlorothiazide",
  "chlorthalidone",
  "furosemide",
  "clonidine",
  "doxazosin",
  "prazosin",
];

const INTERACTION_DATABASE: InteractionDef[] = [
  // === CONTRAINDICATED ===
  [
    MAOIS,
    SSRIS,
    "contraindicated",
    "Excessive serotonergic activity via MAO inhibition and serotonin reuptake inhibition",
    "Serotonin Syndrome: hyperthermia, agitation, tremor, myoclonus, hyperreflexia — potentially fatal",
    "CONTRAINDICATED. Allow ≥14 days washout after stopping MAOI before starting SSRI; ≥14 days (or 5 weeks for fluoxetine) after SSRI before starting MAOI.",
  ],
  [
    MAOIS,
    SNRIS,
    "contraindicated",
    "MAO inhibition combined with norepinephrine/serotonin reuptake inhibition",
    "Serotonin Syndrome / hypertensive crisis — potentially fatal",
    "CONTRAINDICATED. Allow ≥14 days washout in both directions.",
  ],
  [
    MAOIS,
    ["tramadol"],
    "contraindicated",
    "Tramadol inhibits serotonin/norepinephrine reuptake; MAOIs amplify this effect",
    "Severe Serotonin Syndrome and seizures",
    "CONTRAINDICATED. Use alternative analgesic.",
  ],
  [
    MAOIS,
    ["meperidine", "pethidine"],
    "contraindicated",
    "Meperidine inhibits serotonin reuptake; synergistic with MAOI",
    "Severe Serotonin Syndrome: excitation, hyperpyrexia, convulsions, coma",
    "CONTRAINDICATED. Use morphine cautiously if opioid required.",
  ],
  [
    MAOIS,
    ["linezolid"],
    "contraindicated",
    "Linezolid has MAOI properties; additive serotonergic effect",
    "Serotonin Syndrome",
    "CONTRAINDICATED. If linezolid is required, discontinue serotonergic agents first.",
  ],
  [
    ["clopidogrel"],
    ["omeprazole", "esomeprazole"],
    "contraindicated",
    "CYP2C19 inhibition reduces conversion of clopidogrel to active metabolite",
    "Significantly reduced antiplatelet effect — increased thrombotic risk (MI, stroke)",
    "Use pantoprazole or famotidine instead; avoid omeprazole/esomeprazole in patients on clopidogrel.",
  ],
  [
    SIMVASTATIN_LOVASTATIN,
    STRONG_CYP3A4,
    "contraindicated",
    "CYP3A4 inhibition dramatically increases statin plasma levels",
    "Severe myopathy and rhabdomyolysis — risk of acute kidney injury",
    "CONTRAINDICATED. Switch to pravastatin or rosuvastatin (not CYP3A4-dependent).",
  ],
  [
    ["warfarin"],
    ["aspirin"],
    "contraindicated",
    "Anticoagulant + antiplatelet synergy plus aspirin's GI mucosal effects",
    "Major bleeding risk including intracranial hemorrhage and severe GI bleeding",
    "Avoid high-dose aspirin with warfarin. Low-dose (81mg) may be used only when clearly indicated with close monitoring.",
  ],
  [
    ["amiodarone"],
    QT_PROLONGERS,
    "contraindicated",
    "Additive QT prolongation via multiple ion channel effects",
    "Torsades de Pointes (TdP) and fatal ventricular arrhythmia",
    "CONTRAINDICATED combination. If unavoidable, continuous cardiac monitoring required. Correct electrolytes.",
  ],

  // === MAJOR ===
  [
    ["warfarin"],
    NSAIDS,
    "major",
    "NSAIDs inhibit platelet aggregation and damage GI mucosa; warfarin anticoagulates",
    "Significantly increased bleeding risk — GI, urinary, intracranial",
    "Avoid combination. Use acetaminophen for analgesia. If NSAID necessary, reduce warfarin dose, monitor INR closely, add PPI.",
  ],
  [
    ["warfarin"],
    [...WARFARIN_POTENTIATORS, "ciprofloxacin"],
    "major",
    "CYP2C9 inhibition reduces warfarin metabolism; some alter gut flora affecting Vitamin K production",
    "Elevated INR and serious bleeding risk",
    "Monitor INR closely within 3–5 days of starting antibiotic. Anticipate dose reduction. Counsel patient on bleeding signs.",
  ],
  [
    ACE_INHIBITORS,
    K_SPARING_DIURETICS,
    "major",
    "Both mechanisms reduce aldosterone-mediated potassium excretion",
    "Severe hyperkalemia — risk of cardiac arrhythmia and arrest",
    "Monitor potassium and renal function within 1 week. Avoid in CKD unless closely monitored. Reduce dose of one agent.",
  ],
  [
    ACE_INHIBITORS,
    ARBS,
    "major",
    "Dual RAAS blockade with additive effects on angiotensin II suppression",
    "Acute kidney injury, severe hypotension, hyperkalemia",
    "Generally contraindicated as combination therapy. Use single RAAS agent.",
  ],
  [
    ["lithium"],
    NSAIDS,
    "major",
    "NSAIDs reduce renal prostaglandin synthesis, decreasing lithium excretion",
    "Lithium toxicity: tremor, ataxia, confusion, renal failure",
    "Avoid NSAIDs with lithium. Use acetaminophen. If NSAID required, check lithium levels within 1 week.",
  ],
  [
    ["lithium"],
    [...ACE_INHIBITORS, ...ARBS],
    "major",
    "Reduced renal lithium clearance via hemodynamic effects on glomerular filtration",
    "Lithium toxicity",
    "Monitor lithium levels closely after starting/changing RAAS therapy. May need lithium dose reduction.",
  ],
  [
    ["digoxin"],
    ["amiodarone"],
    "major",
    "Amiodarone inhibits P-glycoprotein and CYP3A4, reducing digoxin clearance",
    "Digoxin toxicity: nausea, bradycardia, AV block, visual disturbance",
    "Reduce digoxin dose by 30–50% when starting amiodarone. Monitor digoxin levels and ECG.",
  ],
  [
    ["digoxin"],
    NON_DHP_CCB,
    "major",
    "Verapamil/diltiazem reduce digoxin renal clearance and add AV nodal depression",
    "Digoxin toxicity and AV block — bradycardia, heart block",
    "Reduce digoxin dose by 25–50%. Monitor levels and ECG. Consider alternative rate control.",
  ],
  [
    ["metformin"],
    ["contrast", "iodinated contrast", "iv contrast"],
    "major",
    "IV contrast can cause acute kidney injury reducing metformin clearance",
    "Lactic acidosis risk in the setting of contrast-induced nephropathy",
    "Hold metformin 48 hours before IV contrast administration. Resume after confirming renal function is stable.",
  ],
  [
    FLUOROQUINOLONES,
    CORTICOSTEROIDS,
    "major",
    "Fluoroquinolones inhibit tenocyte repair; corticosteroids impair collagen synthesis",
    "Tendon rupture — particularly Achilles — risk increases with age and renal failure",
    "Avoid combination when possible. If necessary, instruct patient to stop exercise and report tendon pain immediately.",
  ],
  [
    SSRIS,
    ["tramadol"],
    "major",
    "SSRI inhibits serotonin reuptake; tramadol is a weak serotonin reuptake inhibitor and increases serotonin release",
    "Serotonin Syndrome and seizure threshold reduction",
    "Avoid if possible. If used together, start tramadol at lowest dose, monitor for serotonin syndrome signs. Consider alternatives.",
  ],
  [
    SSRIS,
    TRIPTANS,
    "major",
    "Additive serotonergic stimulation at 5-HT1 receptors",
    "Serotonin Syndrome: agitation, incoordination, rapid heart rate",
    "Use with caution if benefit outweighs risk. Counsel patient on symptoms. Short-acting triptans preferred. Limit frequency.",
  ],
  [
    BENZODIAZEPINES,
    OPIOIDS,
    "major",
    "Synergistic CNS depression affecting brainstem respiratory centers",
    "Profound respiratory depression, loss of consciousness, death — high-alert combination",
    "AVOID combination. If unavoidable, use lowest doses, shortest duration, ensure naloxone is available, counsel patient strongly.",
  ],
  [
    ["methotrexate"],
    NSAIDS,
    "major",
    "NSAIDs reduce renal clearance of methotrexate and may displace it from protein binding",
    "Methotrexate toxicity: severe mucositis, bone marrow suppression, nephrotoxicity",
    "Avoid NSAIDs with methotrexate. If unavoidable, hold NSAID around MTX dose days, monitor CBC and renal function.",
  ],
  [
    ["cimetidine"],
    ["warfarin"],
    "major",
    "Cimetidine inhibits CYP1A2, CYP2C9, CYP3A4 reducing warfarin metabolism",
    "Elevated INR and bleeding risk",
    "Use ranitidine or famotidine instead. If cimetidine required, monitor INR closely.",
  ],

  // === MODERATE ===
  [
    ["simvastatin"],
    ["amlodipine"],
    "moderate",
    "Amlodipine is a weak CYP3A4 inhibitor; modestly increases simvastatin exposure",
    "Increased myopathy risk with simvastatin doses above 20mg",
    "Cap simvastatin at 20mg/day when used with amlodipine. Consider switching to atorvastatin.",
  ],
  [
    [...ACE_INHIBITORS, ...ARBS],
    NSAIDS,
    "moderate",
    "NSAIDs blunt prostaglandin-mediated renal vasodilation; RAAS inhibitors reduce efferent tone",
    "Reduced antihypertensive effect and nephrotoxicity — acute kidney injury especially in elderly or volume-depleted",
    "Monitor BP and renal function. Minimize NSAID use. Ensure adequate hydration. Consider switching to acetaminophen.",
  ],
  [
    BETA_BLOCKERS,
    NON_DHP_CCB,
    "moderate",
    "Additive negative chronotropic and dromotropic effects on the AV node",
    "Bradycardia and AV block — potentially hemodynamically significant",
    "Monitor heart rate and PR interval. Avoid in patients with pre-existing conduction disease. Start with low doses.",
  ],
  [
    SSRIS,
    NSAIDS,
    "moderate",
    "SSRIs deplete platelet serotonin; NSAIDs inhibit platelet COX-1 and damage GI mucosa",
    "Increased GI bleeding risk (2–15x with combination)",
    "Add PPI if combination necessary. Consider acetaminophen instead of NSAID. Monitor for GI bleeding signs.",
  ],
  [
    ["metformin"],
    ["alcohol", "ethanol"],
    "moderate",
    "Alcohol inhibits hepatic lactate clearance and impairs gluconeogenesis",
    "Lactic acidosis risk, especially with binge drinking or chronic alcohol use",
    "Advise patient to avoid excessive alcohol. Counsel on signs of lactic acidosis (myalgia, GI upset, weakness, drowsiness).",
  ],
  [
    CORTICOSTEROIDS,
    NSAIDS,
    "moderate",
    "Both increase GI mucosal injury and inhibit prostaglandin cytoprotection",
    "GI ulceration, perforation, and bleeding",
    "Add PPI (omeprazole or pantoprazole). Use lowest effective doses and shortest duration.",
  ],
  [
    FLUOROQUINOLONES,
    [
      "antacid",
      "antacids",
      "calcium",
      "iron",
      "magnesium",
      "aluminum",
      "sucralfate",
      "zinc",
    ],
    "moderate",
    "Divalent/trivalent cations chelate fluoroquinolone in GI tract",
    "Reduced quinolone absorption — up to 50% decrease in bioavailability",
    "Separate administration by ≥2 hours (antacid after quinolone) or ≥6 hours (quinolone after supplement).",
  ],
  [
    ["warfarin"],
    ["carbamazepine", "phenytoin", "rifampin", "rifampicin"],
    "moderate",
    "Enzyme induction of CYP2C9 and CYP1A2 increases warfarin metabolism",
    "Reduced warfarin effect — subtherapeutic anticoagulation and thrombosis risk",
    "Increase warfarin dose and monitor INR frequently during initiation and discontinuation of inducer.",
  ],
  [
    ["metoprolol"],
    ["fluoxetine", "paroxetine"],
    "moderate",
    "Fluoxetine and paroxetine are potent CYP2D6 inhibitors; metoprolol is primarily metabolized by CYP2D6",
    "Up to 5-fold increase in metoprolol plasma levels — bradycardia, hypotension, fatigue",
    "Use lower metoprolol dose. Monitor heart rate. Consider atenolol (not CYP2D6-dependent) as alternative.",
  ],
  [
    STATINS_ALL,
    ["grapefruit", "grapefruit juice"],
    "minor",
    "Furanocoumarins in grapefruit inhibit intestinal CYP3A4, increasing statin absorption",
    "Modestly elevated statin plasma levels — slight myopathy risk increase",
    "Advise patient to avoid large amounts of grapefruit/juice. Rosuvastatin and pravastatin are minimally affected.",
  ],
  [
    ANTIHYPERTENSIVES,
    ["alcohol", "ethanol"],
    "minor",
    "Alcohol causes peripheral vasodilation, additive with antihypertensive effect",
    "Enhanced hypotensive effect — dizziness, falls, syncope especially on standing",
    "Advise patient to limit alcohol intake and rise slowly. Monitor for orthostatic symptoms.",
  ],
];

/**
 * Normalize a drug name for matching: lowercase, trim, remove extra spaces.
 * Also handles "Lisinopril 10mg" -> matches "lisinopril" via includes().
 */
function normalizeDrug(name: string): string {
  return name.toLowerCase().trim();
}

function drugMatches(drugName: string, groupMember: string): boolean {
  const normalized = normalizeDrug(drugName);
  const member = normalizeDrug(groupMember);
  return normalized.includes(member) || member.includes(normalized);
}

function drugInGroup(drugName: string, group: string[]): boolean {
  return group.some((member) => drugMatches(drugName, member));
}

export function checkInteractions(
  newDrug: string,
  currentMedications: string[],
): InteractionAlert[] {
  if (!newDrug.trim()) return [];

  const alerts: InteractionAlert[] = [];
  const seen = new Set<string>();

  for (const [
    groupA,
    groupB,
    severity,
    mechanism,
    clinicalEffect,
    management,
  ] of INTERACTION_DATABASE) {
    const newDrugInA = drugInGroup(newDrug, groupA);
    const newDrugInB = drugInGroup(newDrug, groupB);

    if (!newDrugInA && !newDrugInB) continue;

    for (const currentMed of currentMedications) {
      if (!currentMed.trim()) continue;

      const currentInA = drugInGroup(currentMed, groupA);
      const currentInB = drugInGroup(currentMed, groupB);

      const match = (newDrugInA && currentInB) || (newDrugInB && currentInA);
      if (!match) continue;

      const key = `${normalizeDrug(newDrug)}|${normalizeDrug(currentMed)}|${severity}`;
      const reverseKey = `${normalizeDrug(currentMed)}|${normalizeDrug(newDrug)}|${severity}`;
      if (seen.has(key) || seen.has(reverseKey)) continue;
      seen.add(key);

      alerts.push({
        drug1: newDrug,
        drug2: currentMed,
        severity,
        mechanism,
        clinicalEffect,
        management,
      });
    }
  }

  // Sort: contraindicated first, then major, moderate, minor
  const order: Record<InteractionSeverity, number> = {
    contraindicated: 0,
    major: 1,
    moderate: 2,
    minor: 3,
  };
  alerts.sort((a, b) => order[a.severity] - order[b.severity]);

  return alerts;
}
