export interface EducationHandout {
  id: string;
  title: string;
  description: string;
  topics: string[];
  icdPrefixes: string[];
}

export const educationHandouts: EducationHandout[] = [
  {
    id: "diabetes-t2",
    title: "Managing Type 2 Diabetes",
    description:
      "Understand how to control blood sugar through diet, exercise, and medication to prevent complications.",
    topics: [
      "Blood sugar monitoring",
      "Carbohydrate counting",
      "Exercise guidelines",
      "Foot care",
      "When to call your doctor",
    ],
    icdPrefixes: ["E11", "E13"],
  },
  {
    id: "diabetes-t1",
    title: "Living with Type 1 Diabetes",
    description:
      "Learn about insulin management, continuous glucose monitoring, and preventing hypoglycemia.",
    topics: [
      "Insulin types and timing",
      "CGM use",
      "Sick-day management",
      "Hypoglycemia treatment",
      "HbA1c goals",
    ],
    icdPrefixes: ["E10"],
  },
  {
    id: "hypertension",
    title: "Understanding High Blood Pressure",
    description:
      "Learn how to manage hypertension with lifestyle changes and medications to protect your heart and kidneys.",
    topics: [
      "DASH diet",
      "Sodium reduction",
      "Home BP monitoring",
      "Medication schedule",
      "Stress reduction",
    ],
    icdPrefixes: ["I10", "I11", "I12", "I13"],
  },
  {
    id: "heart-failure",
    title: "Heart Failure Self-Management",
    description:
      "Daily weight monitoring, fluid restrictions, and warning signs that require immediate attention.",
    topics: [
      "Daily weigh-ins",
      "Fluid restrictions",
      "Salt limits",
      "Activity pacing",
      "Emergency warning signs",
    ],
    icdPrefixes: ["I50"],
  },
  {
    id: "copd",
    title: "Living Better with COPD",
    description:
      "Breathing techniques, inhaler use, and avoiding triggers to manage chronic obstructive pulmonary disease.",
    topics: [
      "Pursed-lip breathing",
      "Inhaler technique",
      "Oxygen therapy",
      "Pulmonary rehab",
      "Smoking cessation",
    ],
    icdPrefixes: ["J44", "J43", "J41", "J42"],
  },
  {
    id: "asthma",
    title: "Asthma Action Plan",
    description:
      "Know your triggers, use your inhalers correctly, and follow your personalized asthma action plan.",
    topics: [
      "Trigger avoidance",
      "Rescue vs. controller inhalers",
      "Peak flow monitoring",
      "Spacer technique",
      "When to seek emergency care",
    ],
    icdPrefixes: ["J45", "J46"],
  },
  {
    id: "depression-anxiety",
    title: "Mental Health: Depression & Anxiety",
    description:
      "Understanding your diagnosis, treatment options, and strategies to support your mental well-being.",
    topics: [
      "Medication basics",
      "Therapy options (CBT)",
      "Sleep hygiene",
      "Mindfulness",
      "Crisis resources",
    ],
    icdPrefixes: ["F32", "F33", "F34", "F40", "F41"],
  },
  {
    id: "hyperlipidemia",
    title: "Managing High Cholesterol",
    description:
      "Diet, exercise, and statin therapy to reduce cardiovascular risk from high LDL cholesterol.",
    topics: [
      "Heart-healthy diet",
      "Saturated fat limits",
      "Exercise recommendations",
      "Statin side effects",
      "Target LDL levels",
    ],
    icdPrefixes: ["E78"],
  },
  {
    id: "hypothyroidism",
    title: "Hypothyroidism & Thyroid Health",
    description:
      "How to take levothyroxine correctly, what symptoms to monitor, and when to have your TSH rechecked.",
    topics: [
      "Medication timing",
      "Food/drug interactions",
      "TSH monitoring schedule",
      "Symptoms to watch",
      "Pregnancy considerations",
    ],
    icdPrefixes: ["E03", "E02", "E01"],
  },
  {
    id: "gerd",
    title: "GERD & Acid Reflux Management",
    description:
      "Lifestyle modifications, dietary changes, and medication guidance to control acid reflux symptoms.",
    topics: [
      "Trigger foods to avoid",
      "Eating habits",
      "Elevating head of bed",
      "PPI use guidance",
      "When to see a specialist",
    ],
    icdPrefixes: ["K21", "K20"],
  },
  {
    id: "ckd",
    title: "Chronic Kidney Disease Care",
    description:
      "Protecting your kidney function through diet, blood pressure control, and regular lab monitoring.",
    topics: [
      "Protein and potassium limits",
      "Fluid intake",
      "BP target < 130/80",
      "Medication safety",
      "Nephrology referral criteria",
    ],
    icdPrefixes: ["N18"],
  },
  {
    id: "afib",
    title: "Atrial Fibrillation & Anticoagulation",
    description:
      "Understanding AFib, taking blood thinners safely, and recognizing signs of stroke.",
    topics: [
      "What AFib feels like",
      "Anticoagulant options",
      "Stroke warning signs (FAST)",
      "Activity guidelines",
      "INR monitoring (warfarin)",
    ],
    icdPrefixes: ["I48"],
  },
  {
    id: "osteoporosis",
    title: "Osteoporosis & Bone Health",
    description:
      "Calcium, vitamin D, weight-bearing exercise, and medications to prevent fractures.",
    topics: [
      "Calcium and vitamin D intake",
      "Weight-bearing exercise",
      "Fall prevention",
      "Bisphosphonate use",
      "DEXA scan schedule",
    ],
    icdPrefixes: ["M80", "M81", "M82"],
  },
  {
    id: "obesity",
    title: "Weight Management & Healthy Lifestyle",
    description:
      "Practical strategies for sustainable weight loss, physical activity, and behavioral change.",
    topics: [
      "Calorie awareness",
      "Portion control",
      "150 min/week activity goal",
      "Behavioral strategies",
      "Medication options",
    ],
    icdPrefixes: ["E66", "Z68"],
  },
  {
    id: "postop",
    title: "Post-Operative Care Instructions",
    description:
      "Wound care, activity restrictions, signs of infection, and follow-up appointment reminders after surgery.",
    topics: [
      "Wound care and dressing changes",
      "Activity restrictions",
      "Pain management",
      "Signs of infection",
      "When to call the office",
    ],
    icdPrefixes: ["Z48", "Z87"],
  },
  {
    id: "med-adherence",
    title: "Medication Adherence & Safety",
    description:
      "Tips for taking your medications consistently, avoiding interactions, and what to do if you miss a dose.",
    topics: [
      "Pill organizers and reminders",
      "Refill planning",
      "Drug interaction basics",
      "Common side effects",
      "Pharmacy resources",
    ],
    icdPrefixes: [],
  },
];

export function getHandoutsForDiagnoses(
  icdCodes: string[],
): EducationHandout[] {
  if (!icdCodes || icdCodes.length === 0) {
    return [educationHandouts.find((h) => h.id === "med-adherence")!].filter(
      Boolean,
    );
  }

  const matched = new Set<string>();
  const result: EducationHandout[] = [];

  for (const code of icdCodes) {
    const prefix = code.trim().toUpperCase();
    for (const handout of educationHandouts) {
      if (matched.has(handout.id)) continue;
      if (
        handout.icdPrefixes.some(
          (p) => prefix.startsWith(p) || p.startsWith(prefix.slice(0, 3)),
        )
      ) {
        matched.add(handout.id);
        result.push(handout);
      }
    }
  }

  if (result.length === 0) {
    const fallback = educationHandouts.find((h) => h.id === "med-adherence");
    if (fallback) result.push(fallback);
  }

  return result;
}
