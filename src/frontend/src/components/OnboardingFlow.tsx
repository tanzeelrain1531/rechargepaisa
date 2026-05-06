import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  ConciergeBell,
  FlaskConical,
  HeartPulse,
  Microscope,
  Receipt,
  ScanLine,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
type Role = string;

interface OnboardingFlowProps {
  role: Role;
  userName: string;
  onComplete: (prefs: Record<string, unknown>) => void;
}

function getFirstName(name: string) {
  const parts = name.split(" ");
  if (name.startsWith("Dr.")) return `${parts[0]} ${parts[1]}`;
  return parts[0];
}

function ChipSelector({
  options,
  value,
  onChange,
  multi = false,
}: {
  options: string[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multi?: boolean;
}) {
  const isSelected = (opt: string) =>
    multi ? (value as string[]).includes(opt) : value === opt;

  const handleClick = (opt: string) => {
    if (multi) {
      const arr = value as string[];
      onChange(
        arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt],
      );
    } else {
      onChange(opt);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => handleClick(opt)}
          className={[
            "px-3 py-1.5 text-sm rounded border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            isSelected(opt)
              ? "border-primary bg-primary/10 text-primary font-medium"
              : "border-border text-foreground hover:border-primary/40 hover:bg-muted/50",
          ].join(" ")}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function ShiftCard({
  label,
  sublabel,
  selected,
  onClick,
}: {
  label: string;
  sublabel: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex-1 p-5 rounded border text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        selected
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary/40 hover:bg-muted/30",
      ].join(" ")}
    >
      <div
        className={[
          "text-base font-semibold",
          selected ? "text-primary" : "text-foreground",
        ].join(" ")}
      >
        {label}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{sublabel}</div>
    </button>
  );
}

// ------- Doctor -------
function DoctorFlow({
  firstName,
  onComplete,
  onSkip,
}: {
  firstName: string;
  onComplete: (prefs: Record<string, unknown>) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [specialty, setSpecialty] = useState("");
  const [panelSize, setPanelSize] = useState("");
  const [error, setError] = useState("");

  const totalSteps = 4;

  const advance = (nextStep: number) => {
    setDir(1);
    setError("");
    setStep(nextStep);
  };

  const handleNext = () => {
    if (step === 1 && !specialty) {
      setError("Please select one to continue.");
      return;
    }
    if (step < 3) advance(step + 1);
    else onComplete({ specialty, panelSize });
  };

  const SPECIALTIES = [
    "Family Medicine",
    "Internal Medicine",
    "Cardiology",
    "Orthopedics",
    "Pediatrics",
    "Oncology",
    "Psychiatry",
    "Other",
  ];
  const PANEL_SIZES = ["Fewer than 10", "10–30", "More than 30"];

  return (
    <FlowShell step={step} totalSteps={totalSteps} dir={dir} onSkip={onSkip}>
      {step === 0 && (
        <WelcomeStep
          icon={Stethoscope}
          heading={`Welcome, ${firstName}`}
          body="Let's personalise your workspace. It takes 60 seconds and shapes what you see every day."
          cta="Get started →"
          onCta={() => advance(1)}
        />
      )}
      {step === 1 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            What is your primary specialty?
          </h2>
          <p className="text-sm text-muted-foreground">
            This shapes your care gap protocols, order sets, and dashboard.
          </p>
          <ChipSelector
            options={SPECIALTIES}
            value={specialty}
            onChange={(v) => {
              setSpecialty(v as string);
              setError("");
            }}
          />
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
          <NavRow
            onNext={handleNext}
            onBack={() => {
              setDir(-1);
              setStep(0);
            }}
          />
        </div>
      )}
      {step === 2 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            How many patients do you typically follow?
          </h2>
          <p className="text-sm text-muted-foreground">
            Helps us calibrate your dashboard defaults.
          </p>
          <ChipSelector
            options={PANEL_SIZES}
            value={panelSize}
            onChange={(v) => setPanelSize(v as string)}
          />
          <NavRow
            onNext={handleNext}
            onBack={() => {
              setDir(-1);
              setStep(1);
            }}
            skipLabel="Skip this step →"
            onSkipStep={() => advance(3)}
          />
        </div>
      )}
      {step === 3 && (
        <ReadyStep
          summary={`Specialty: ${specialty || "Not set"}. Your care gap protocols, order sets, and dashboard will reflect your specialty.`}
          onEnter={() => onComplete({ specialty, panelSize })}
          onBack={() => {
            setDir(-1);
            setStep(2);
          }}
        />
      )}
    </FlowShell>
  );
}

// ------- Nurse -------
function NurseFlow({
  firstName,
  onComplete,
  onSkip,
}: {
  firstName: string;
  onComplete: (prefs: Record<string, unknown>) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [ward, setWard] = useState("");
  const [shift, setShift] = useState<"day" | "night" | "">(
    "" as "day" | "night" | "",
  );
  const [error, setError] = useState("");

  const WARDS = [
    "ICU",
    "General Medicine",
    "Surgical",
    "Pediatric",
    "Emergency",
  ];

  const handleNext = () => {
    if (step === 1 && !ward) {
      setError("Please select a ward to continue.");
      return;
    }
    if (step === 2 && !shift) {
      setError("Please select a shift to continue.");
      return;
    }
    setError("");
    if (step < 3) {
      setDir(1);
      setStep(step + 1);
    } else onComplete({ ward, shift });
  };

  return (
    <FlowShell step={step} totalSteps={4} dir={dir} onSkip={onSkip}>
      {step === 0 && (
        <WelcomeStep
          icon={HeartPulse}
          heading={`Welcome, ${firstName}`}
          body="Your workspace brings together patient monitoring, medication administration, and care coordination."
          cta="Get started →"
          onCta={() => {
            setDir(1);
            setStep(1);
          }}
        />
      )}
      {step === 1 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Which ward are you assigned to?
          </h2>
          <p className="text-sm text-muted-foreground">
            Sets the default view in your Medication Administration Record.
          </p>
          <ChipSelector
            options={WARDS}
            value={ward}
            onChange={(v) => {
              setWard(v as string);
              setError("");
            }}
          />
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
          <NavRow
            onNext={handleNext}
            onBack={() => {
              setDir(-1);
              setStep(0);
            }}
          />
        </div>
      )}
      {step === 2 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Which shift do you work?
          </h2>
          <p className="text-sm text-muted-foreground">
            Pre-fills your shift handoff window.
          </p>
          <div className="flex gap-3 mt-3">
            <ShiftCard
              label="Day Shift"
              sublabel="7:00 am to 7:00 pm"
              selected={shift === "day"}
              onClick={() => {
                setShift("day");
                setError("");
              }}
            />
            <ShiftCard
              label="Night Shift"
              sublabel="7:00 pm to 7:00 am"
              selected={shift === "night"}
              onClick={() => {
                setShift("night");
                setError("");
              }}
            />
          </div>
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
          <NavRow
            onNext={handleNext}
            onBack={() => {
              setDir(-1);
              setStep(1);
            }}
          />
        </div>
      )}
      {step === 3 && (
        <ReadyStep
          summary={`Ward: ${ward}. Shift: ${shift === "day" ? "Day (7am–7pm)" : "Night (7pm–7am)"}. Your MAR will default to your ward and your shift handoff will pre-fill your window.`}
          onEnter={() => onComplete({ ward, shift })}
          onBack={() => {
            setDir(-1);
            setStep(2);
          }}
        />
      )}
    </FlowShell>
  );
}

// ------- Pharmacist -------
function PharmacistFlow({
  firstName,
  onComplete,
  onSkip,
}: {
  firstName: string;
  onComplete: (prefs: Record<string, unknown>) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [formulary, setFormulary] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (step === 1 && !formulary) {
      setError("Please select one to continue.");
      return;
    }
    setError("");
    if (step < 2) {
      setDir(1);
      setStep(step + 1);
    } else onComplete({ formulary });
  };

  return (
    <FlowShell step={step} totalSteps={3} dir={dir} onSkip={onSkip}>
      {step === 0 && (
        <WelcomeStep
          icon={FlaskConical}
          heading={`Welcome, ${firstName}`}
          body="Your Pharmacy queue centralises all incoming prescriptions awaiting verification or dispensing."
          cta="Get started →"
          onCta={() => {
            setDir(1);
            setStep(1);
          }}
        />
      )}
      {step === 1 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Which prescription type do you primarily handle?
          </h2>
          <p className="text-sm text-muted-foreground">
            Sets the default queue filter when you open Pharmacy.
          </p>
          <ChipSelector
            options={["Retail", "Mail Order", "Specialty", "All"]}
            value={formulary}
            onChange={(v) => {
              setFormulary(v as string);
              setError("");
            }}
          />
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
          <NavRow
            onNext={handleNext}
            onBack={() => {
              setDir(-1);
              setStep(0);
            }}
          />
        </div>
      )}
      {step === 2 && (
        <ReadyStep
          summary={`Queue will default to ${formulary} prescriptions.`}
          onEnter={() => onComplete({ formulary })}
          onBack={() => {
            setDir(-1);
            setStep(1);
          }}
        />
      )}
    </FlowShell>
  );
}

// ------- Receptionist -------
function ReceptionistFlow({
  firstName,
  onComplete,
  onSkip,
}: {
  firstName: string;
  onComplete: (prefs: Record<string, unknown>) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [providers, setProviders] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const PROVIDERS = [
    "Dr. Sarah Chen",
    "Dr. James Wilson",
    "Dr. Emily Rodriguez",
    "Dr. Michael Thompson",
    "Dr. Lisa Park",
  ];
  const LOCATIONS = [
    "Main Campus",
    "North Clinic",
    "South Clinic",
    "Telehealth Only",
  ];

  const handleNext = () => {
    if (step === 1 && providers.length === 0) {
      setError("Please select at least one provider.");
      return;
    }
    setError("");
    if (step < 3) {
      setDir(1);
      setStep(step + 1);
    } else onComplete({ providers, location });
  };

  return (
    <FlowShell step={step} totalSteps={4} dir={dir} onSkip={onSkip}>
      {step === 0 && (
        <WelcomeStep
          icon={ConciergeBell}
          heading={`Welcome, ${firstName}`}
          body="Your workflow covers patient registration, appointment scheduling, and front-desk check-in."
          cta="Get started →"
          onCta={() => {
            setDir(1);
            setStep(1);
          }}
        />
      )}
      {step === 1 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Which providers do you schedule for?
          </h2>
          <p className="text-sm text-muted-foreground">
            Select all that apply. You can change this anytime in Settings.
          </p>
          <ChipSelector
            options={PROVIDERS}
            value={providers}
            onChange={(v) => {
              setProviders(v as string[]);
              setError("");
            }}
            multi
          />
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
          <NavRow
            onNext={handleNext}
            onBack={() => {
              setDir(-1);
              setStep(0);
            }}
          />
        </div>
      )}
      {step === 2 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Which location are you based at?
          </h2>
          <p className="text-sm text-muted-foreground">
            Helps filter the appointment calendar by default.
          </p>
          <ChipSelector
            options={LOCATIONS}
            value={location}
            onChange={(v) => setLocation(v as string)}
          />
          <NavRow
            onNext={handleNext}
            onBack={() => {
              setDir(-1);
              setStep(1);
            }}
            skipLabel="Skip →"
            onSkipStep={() => {
              setDir(1);
              setStep(3);
            }}
          />
        </div>
      )}
      {step === 3 && (
        <ReadyStep
          summary={`Appointments will default to showing schedules for ${providers.length > 0 ? providers.join(", ") : "all providers"}.`}
          onEnter={() => onComplete({ providers, location })}
          onBack={() => {
            setDir(-1);
            setStep(2);
          }}
        />
      )}
    </FlowShell>
  );
}

// ------- Billing -------
function BillingFlow({
  firstName,
  onComplete,
  onSkip,
}: {
  firstName: string;
  onComplete: (prefs: Record<string, unknown>) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [payer, setPayer] = useState("");
  const [aging, setAging] = useState("60");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (step === 1 && !payer) {
      setError("Please select a payer focus to continue.");
      return;
    }
    setError("");
    if (step < 2) {
      setDir(1);
      setStep(step + 1);
    } else onComplete({ payer, agingThreshold: Number(aging) });
  };

  return (
    <FlowShell step={step} totalSteps={3} dir={dir} onSkip={onSkip}>
      {step === 0 && (
        <WelcomeStep
          icon={Receipt}
          heading={`Welcome, ${firstName}`}
          body="The Billing module manages the full revenue cycle from invoice creation to payment collection."
          cta="Get started →"
          onCta={() => {
            setDir(1);
            setStep(1);
          }}
        />
      )}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Which payers do you primarily work with?
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sets the default Claims queue filter.
            </p>
            <ChipSelector
              options={[
                "Medicare",
                "Medicaid",
                "Commercial",
                "Self-Pay",
                "All",
              ]}
              value={payer}
              onChange={(v) => {
                setPayer(v as string);
                setError("");
              }}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Flag claims older than:
            </p>
            <ChipSelector
              options={["30 days", "60 days", "90 days"]}
              value={`${aging} days`}
              onChange={(v) => setAging((v as string).split(" ")[0])}
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <NavRow
            onNext={handleNext}
            onBack={() => {
              setDir(-1);
              setStep(0);
            }}
          />
        </div>
      )}
      {step === 2 && (
        <ReadyStep
          summary={`Claims will default to ${payer}. Aging alerts fire after ${aging} days.`}
          onEnter={() => onComplete({ payer, agingThreshold: Number(aging) })}
          onBack={() => {
            setDir(-1);
            setStep(1);
          }}
        />
      )}
    </FlowShell>
  );
}

// ------- Admin -------
type InvitedStaff = { name: string; role: string };
function AdminFlow({
  firstName,
  onComplete,
  onSkip,
}: {
  firstName: string;
  onComplete: (prefs: Record<string, unknown>) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [invitedList, setInvitedList] = useState<InvitedStaff[]>([]);
  const [inviteError, setInviteError] = useState("");
  const [skipInviteWarning, setSkipInviteWarning] = useState(false);
  const [staffSkipped, setStaffSkipped] = useState(false);
  // Availability grid: 5 days x 2 sessions (AM/PM)
  const [availability, setAvailability] = useState<boolean[][]>([
    [true, true],
    [true, true],
    [true, true],
    [true, true],
    [true, true],
  ]);
  const [availSkipped, setAvailSkipped] = useState(false);

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const STAFF_ROLES = [
    "Doctor",
    "Nurse",
    "Pharmacist",
    "Receptionist",
    "Billing",
    "LabTech",
    "Radiologist",
  ];

  const handleAddStaff = () => {
    if (!staffName.trim() || !staffRole) {
      setInviteError("Please enter a name and select a role.");
      return;
    }
    const entry = { name: staffName.trim(), role: staffRole };
    const updated = [...invitedList, entry];
    setInvitedList(updated);
    try {
      const existing = JSON.parse(
        localStorage.getItem("medunite_admin_invited_staff") || "[]",
      );
      localStorage.setItem(
        "medunite_admin_invited_staff",
        JSON.stringify([...existing, entry]),
      );
    } catch {
      /* ignore */
    }
    setStaffName("");
    setStaffRole("");
    setInviteError("");
  };

  const saveAvailability = () => {
    try {
      localStorage.setItem(
        "medunite_admin_provider_availability",
        JSON.stringify(availability),
      );
    } catch {
      /* ignore */
    }
    setDir(1);
    setStep(3);
  };

  const prefs = {
    setupComplete: invitedList.length > 0 && !availSkipped,
    staffInvited: invitedList.length > 0,
    availabilitySet: !availSkipped,
  };

  return (
    <FlowShell step={step} totalSteps={5} dir={dir} onSkip={onSkip}>
      {step === 0 && (
        <WelcomeStep
          icon={ShieldCheck}
          heading={`Welcome, ${firstName}`}
          body="Two quick setup tasks will make the system useful for your team. You can skip either, but we recommend completing both."
          cta="Get started →"
          onCta={() => {
            setDir(1);
            setStep(1);
          }}
        />
      )}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Invite your first team member
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add clinical and admin staff to the system.
            </p>
          </div>
          <div className="space-y-3 border border-border rounded p-4 bg-muted/30">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Name
              </p>
              <Input
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="Full name"
                className="h-9 text-sm"
                data-ocid="onboarding.staff_name.input"
              />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Role
              </p>
              <Select value={staffRole} onValueChange={setStaffRole}>
                <SelectTrigger
                  className="mt-1 h-9 text-sm"
                  data-ocid="onboarding.staff_role.select"
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {STAFF_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {inviteError && (
              <p className="text-xs text-destructive">{inviteError}</p>
            )}
            <Button
              size="sm"
              onClick={handleAddStaff}
              data-ocid="onboarding.add_staff.button"
            >
              Add staff member
            </Button>
          </div>
          {invitedList.length > 0 && (
            <div className="space-y-1">
              {invitedList.map((s) => (
                <div
                  key={`${s.name}-${s.role}`}
                  className="flex items-center gap-2 text-sm text-success"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {s.name} added as {s.role}
                  </span>
                </div>
              ))}
            </div>
          )}
          {skipInviteWarning ? (
            <div className="border border-warning/30 bg-warning/10 rounded p-3 space-y-2">
              <p className="text-sm text-foreground">
                Without staff accounts, your clinical team won't be able to log
                in.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                  onClick={() => {
                    setStaffSkipped(true);
                    setDir(1);
                    setStep(2);
                  }}
                >
                  Confirm skip
                </button>
                <button
                  type="button"
                  className="text-xs text-foreground font-medium"
                  onClick={() => setSkipInviteWarning(false)}
                >
                  Go back
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setSkipInviteWarning(true)}
              >
                Skip this step (not recommended)
              </button>
              {invitedList.length > 0 && (
                <Button
                  size="sm"
                  onClick={() => {
                    setDir(1);
                    setStep(2);
                  }}
                  data-ocid="onboarding.next.button"
                >
                  Continue →
                </Button>
              )}
            </div>
          )}
          {invitedList.length === 0 && !skipInviteWarning && (
            <NavRow
              onNext={() => {
                setDir(1);
                setStep(2);
              }}
              onBack={() => {
                setDir(-1);
                setStep(0);
              }}
              nextLabel="Continue →"
            />
          )}
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Set provider availability
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Configure default office hours for scheduling.
            </p>
          </div>
          <div className="border border-border rounded p-4 bg-muted/30">
            <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground mb-2">
              <div>Day</div>
              <div className="text-center">AM</div>
              <div className="text-center">PM</div>
            </div>
            {DAYS.map((day, di) => (
              <div
                key={day}
                className="grid grid-cols-3 gap-2 items-center py-1 border-t border-border/40"
              >
                <span className="text-sm text-foreground">{day}</span>
                {[0, 1].map((si) => (
                  <div key={si} className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={availability[di][si]}
                      onChange={(e) => {
                        const next = availability.map((row, r) =>
                          row.map((cell, c) =>
                            r === di && c === si ? e.target.checked : cell,
                          ),
                        );
                        setAvailability(next);
                      }}
                      className="h-4 w-4 accent-primary"
                      data-ocid={`onboarding.avail.${day.toLowerCase()}.checkbox`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                setAvailSkipped(true);
                setDir(1);
                setStep(3);
              }}
            >
              Skip →
            </button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDir(-1);
                  setStep(1);
                }}
              >
                ← Back
              </Button>
              <Button
                size="sm"
                onClick={saveAvailability}
                data-ocid="onboarding.save_avail.button"
              >
                Save availability →
              </Button>
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Setup summary
          </h2>
          <div className="space-y-2">
            <div
              className={`flex items-center gap-2 text-sm ${!staffSkipped ? "text-success" : "text-warning"}`}
            >
              {!staffSkipped ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <span className="w-4 h-4 text-center">⚠</span>
              )}
              <span>
                {!staffSkipped
                  ? `${invitedList.length} staff member(s) invited`
                  : "Staff invitation skipped"}
              </span>
              {staffSkipped && (
                <button
                  type="button"
                  className="text-xs underline text-muted-foreground hover:text-foreground ml-1"
                  onClick={() => {
                    setDir(-1);
                    setStep(1);
                  }}
                >
                  Fix now
                </button>
              )}
            </div>
            <div
              className={`flex items-center gap-2 text-sm ${!availSkipped ? "text-success" : "text-warning"}`}
            >
              {!availSkipped ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <span className="w-4 h-4 text-center">⚠</span>
              )}
              <span>
                {!availSkipped
                  ? "Provider availability configured"
                  : "Provider availability skipped"}
              </span>
              {availSkipped && (
                <button
                  type="button"
                  className="text-xs underline text-muted-foreground hover:text-foreground ml-1"
                  onClick={() => {
                    setDir(-1);
                    setStep(2);
                  }}
                >
                  Fix now
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDir(-1);
                setStep(2);
              }}
            >
              ← Back
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setDir(1);
                setStep(4);
              }}
              data-ocid="onboarding.summary.next.button"
            >
              Continue →
            </Button>
          </div>
        </div>
      )}
      {step === 4 && (
        <ReadyStep
          summary={`System setup ${prefs.setupComplete ? "complete" : "partially complete"}. Staff invited: ${prefs.staffInvited ? "yes" : "no"}. Provider availability: ${prefs.availabilitySet ? "configured" : "skipped"}.`}
          onEnter={() => onComplete(prefs)}
          onBack={() => {
            setDir(-1);
            setStep(3);
          }}
        />
      )}
    </FlowShell>
  );
}

// ------- LabTech -------
function LabTechFlow({
  firstName,
  onComplete,
  onSkip,
}: {
  firstName: string;
  onComplete: (prefs: Record<string, unknown>) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [section, setSection] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (step === 1 && !section) {
      setError("Please select a section to continue.");
      return;
    }
    setError("");
    if (step < 2) {
      setDir(1);
      setStep(step + 1);
    } else onComplete({ section });
  };

  return (
    <FlowShell step={step} totalSteps={3} dir={dir} onSkip={onSkip}>
      {step === 0 && (
        <WelcomeStep
          icon={Microscope}
          heading={`Welcome, ${firstName}`}
          body="Your workspace focuses on processing incoming lab orders and reporting results back to ordering providers."
          cta="Get started →"
          onCta={() => {
            setDir(1);
            setStep(1);
          }}
        />
      )}
      {step === 1 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Which section do you work in?
          </h2>
          <p className="text-sm text-muted-foreground">
            Filters your default lab worklist view.
          </p>
          <ChipSelector
            options={[
              "Chemistry",
              "Hematology",
              "Microbiology",
              "Pathology",
              "All Sections",
            ]}
            value={section}
            onChange={(v) => {
              setSection(v as string);
              setError("");
            }}
          />
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
          <NavRow
            onNext={handleNext}
            onBack={() => {
              setDir(-1);
              setStep(0);
            }}
          />
        </div>
      )}
      {step === 2 && (
        <ReadyStep
          summary={`Your lab worklist will default to ${section} orders.`}
          onEnter={() => onComplete({ section })}
          onBack={() => {
            setDir(-1);
            setStep(1);
          }}
        />
      )}
    </FlowShell>
  );
}

// ------- Radiologist -------
function RadiologistFlow({
  firstName,
  onComplete,
  onSkip,
}: {
  firstName: string;
  onComplete: (prefs: Record<string, unknown>) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [modality, setModality] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (step === 1 && !modality) {
      setError("Please select a modality to continue.");
      return;
    }
    setError("");
    if (step < 2) {
      setDir(1);
      setStep(step + 1);
    } else onComplete({ modality });
  };

  return (
    <FlowShell step={step} totalSteps={3} dir={dir} onSkip={onSkip}>
      {step === 0 && (
        <WelcomeStep
          icon={ScanLine}
          heading={`Welcome, ${firstName}`}
          body="Your workspace covers imaging order management, DICOM viewing, and radiology report generation."
          cta="Get started →"
          onCta={() => {
            setDir(1);
            setStep(1);
          }}
        />
      )}
      {step === 1 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            What is your primary imaging modality?
          </h2>
          <p className="text-sm text-muted-foreground">
            Filters your default imaging queue.
          </p>
          <ChipSelector
            options={[
              "X-ray",
              "CT",
              "MRI",
              "Ultrasound",
              "Nuclear",
              "All Modalities",
            ]}
            value={modality}
            onChange={(v) => {
              setModality(v as string);
              setError("");
            }}
          />
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
          <NavRow
            onNext={handleNext}
            onBack={() => {
              setDir(-1);
              setStep(0);
            }}
          />
        </div>
      )}
      {step === 2 && (
        <ReadyStep
          summary={`Your imaging queue will default to ${modality} orders.`}
          onEnter={() => onComplete({ modality })}
          onBack={() => {
            setDir(-1);
            setStep(1);
          }}
        />
      )}
    </FlowShell>
  );
}

// ------- Shared sub-components -------

function WelcomeStep({
  icon: Icon,
  heading,
  body,
  cta,
  onCta,
}: {
  icon: React.ElementType;
  heading: string;
  body: string;
  cta: string;
  onCta: () => void;
}) {
  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">{heading}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          {body}
        </p>
      </div>
      <Button
        onClick={onCta}
        data-ocid="onboarding.welcome.button"
        className="min-w-[140px]"
      >
        {cta}
      </Button>
    </div>
  );
}

function ReadyStep({
  summary,
  onEnter,
  onBack,
}: {
  summary: string;
  onEnter: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7 text-success" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">
          You're all set
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto border border-border/60 rounded p-3 bg-muted/30 text-left">
          {summary}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back
        </Button>
        <Button onClick={onEnter} data-ocid="onboarding.enter.button">
          Enter MedUnite →
        </Button>
      </div>
    </div>
  );
}

function NavRow({
  onNext,
  onBack,
  nextLabel = "Continue →",
  skipLabel,
  onSkipStep,
}: {
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  skipLabel?: string;
  onSkipStep?: () => void;
}) {
  return (
    <div className="flex items-center justify-between pt-3">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Back
          </Button>
        )}
        {skipLabel && onSkipStep && (
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={onSkipStep}
          >
            {skipLabel}
          </button>
        )}
      </div>
      <Button size="sm" onClick={onNext} data-ocid="onboarding.next.button">
        {nextLabel}
      </Button>
    </div>
  );
}

function FlowShell({
  step,
  totalSteps,
  dir,
  onSkip,
  children,
}: {
  step: number;
  totalSteps: number;
  dir: number;
  onSkip: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="onboarding.page"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary flex items-center justify-center rounded">
            <svg
              className="w-4 h-4 text-primary-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">
            MedUnite
          </span>
        </div>
        {totalSteps > 1 && (
          <span className="text-xs text-muted-foreground">
            Step {step + 1} of {totalSteps}
          </span>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[480px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: dir * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -24 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Skip escape hatch */}
      <div className="px-6 pb-6">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          data-ocid="onboarding.skip.button"
        >
          Skip all setup →
        </button>
      </div>
    </div>
  );
}

// ------- Main export -------
export default function OnboardingFlow({
  role,
  userName,
  onComplete,
}: OnboardingFlowProps) {
  const firstName = getFirstName(userName);
  const handleSkip = () => onComplete({});

  switch (role) {
    case "Doctor":
      return (
        <DoctorFlow
          firstName={firstName}
          onComplete={onComplete}
          onSkip={handleSkip}
        />
      );
    case "Nurse":
      return (
        <NurseFlow
          firstName={firstName}
          onComplete={onComplete}
          onSkip={handleSkip}
        />
      );
    case "Pharmacist":
      return (
        <PharmacistFlow
          firstName={firstName}
          onComplete={onComplete}
          onSkip={handleSkip}
        />
      );
    case "Receptionist":
      return (
        <ReceptionistFlow
          firstName={firstName}
          onComplete={onComplete}
          onSkip={handleSkip}
        />
      );
    case "Billing":
      return (
        <BillingFlow
          firstName={firstName}
          onComplete={onComplete}
          onSkip={handleSkip}
        />
      );
    case "Admin":
      return (
        <AdminFlow
          firstName={firstName}
          onComplete={onComplete}
          onSkip={handleSkip}
        />
      );
    case "LabTech":
      return (
        <LabTechFlow
          firstName={firstName}
          onComplete={onComplete}
          onSkip={handleSkip}
        />
      );
    case "Radiologist":
      return (
        <RadiologistFlow
          firstName={firstName}
          onComplete={onComplete}
          onSkip={handleSkip}
        />
      );
    default:
      return null;
  }
}
