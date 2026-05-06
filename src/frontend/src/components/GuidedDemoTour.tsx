import { useState } from "react";

const STEPS = [
  {
    title: "Find a Patient",
    desc: "Go to the Patients list and select a patient to open their chart.",
    page: "patients",
  },
  {
    title: "Schedule an Appointment",
    desc: "Book an appointment for the patient with an available provider.",
    page: "appointments",
  },
  {
    title: "Start an Encounter",
    desc: "From the appointment, click 'Start Encounter' to document the visit.",
    page: "appointments",
  },
  {
    title: "Pharmacy Queue",
    desc: "After prescribing, view the order in the Pharmacy queue.",
    page: "pharmacy",
  },
  {
    title: "Billing & Claims",
    desc: "Once the encounter is signed, generate a claim in the Claims module.",
    page: "claims",
  },
];

const DISMISSED_KEY = "medunite-demo-tour-dismissed";

interface GuidedDemoTourProps {
  isDemoMode: boolean;
  onNavigate: (page: string) => void;
}

export default function GuidedDemoTour({
  isDemoMode,
  onNavigate,
}: GuidedDemoTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISSED_KEY) === "1",
  );

  if (!isDemoMode || dismissed) return null;

  const step = STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  function handleDismiss() {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="flex items-center gap-4 bg-primary/5 border-b border-border px-4 py-2.5 text-sm">
      {/* Step info */}
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium text-muted-foreground mr-2">
          Step {currentStep + 1} of {STEPS.length}
        </span>
        <span className="font-semibold text-foreground mr-2">{step.title}</span>
        <span className="text-muted-foreground hidden sm:inline">
          {step.desc}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5 shrink-0">
        {STEPS.map((_, i) => (
          <button
            key={STEPS[i].title}
            type="button"
            onClick={() => setCurrentStep(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentStep
                ? "bg-primary"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setCurrentStep((s) => s - 1)}
          disabled={isFirst}
          className="px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          data-ocid="demo_tour.prev_button"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => onNavigate(step.page)}
          className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
          data-ocid="demo_tour.go_button"
        >
          Go →
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep((s) => s + 1)}
          disabled={isLast}
          className="px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          data-ocid="demo_tour.next_button"
        >
          Next →
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="demo_tour.skip_button"
        >
          Skip tour ×
        </button>
      </div>
    </div>
  );
}
