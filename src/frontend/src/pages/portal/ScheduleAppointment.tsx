import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const PROVIDERS = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    specialty: "Internal Medicine",
    nextAvailable: "Tomorrow, Mar 14",
    avatar: "SC",
  },
  {
    id: 2,
    name: "Dr. Marcus Williams",
    specialty: "Cardiology",
    nextAvailable: "Mar 15",
    avatar: "MW",
  },
  {
    id: 3,
    name: "Dr. Lisa Park",
    specialty: "Endocrinology",
    nextAvailable: "Mar 17",
    avatar: "LP",
  },
  {
    id: 4,
    name: "Dr. James Okafor",
    specialty: "Dermatology",
    nextAvailable: "Mar 18",
    avatar: "JO",
  },
];

const APPOINTMENT_TYPES = [
  "Annual Physical",
  "Follow-up Visit",
  "Sick Visit",
  "Preventive Care",
  "Specialist Consultation",
  "Lab Review",
  "Medication Management",
  "Mental Health",
];

function deterministicFilter(dateKey: string, slots: string[]): string[] {
  const seed = dateKey
    .split("-")
    .reduce((acc, n) => acc + Number.parseInt(n), 0);
  return slots.filter((_, i) => (seed + i) % 3 !== 0);
}

function generateSlots() {
  const result: Record<string, { morning: string[]; afternoon: string[] }> = {};
  const today = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      result[key] = { morning: [], afternoon: [] };
    } else {
      result[key] = {
        morning: deterministicFilter(key, [
          "8:00 AM",
          "8:30 AM",
          "9:00 AM",
          "10:30 AM",
          "11:00 AM",
        ]),
        afternoon: deterministicFilter(key, [
          "1:00 PM",
          "1:30 PM",
          "2:30 PM",
          "3:00 PM",
          "4:00 PM",
        ]),
      };
    }
  }
  return result;
}

const SLOTS = generateSlots();

const STEPS = ["Provider", "Date & Time", "Details", "Confirm"];

interface BookingData {
  provider: (typeof PROVIDERS)[0] | null;
  date: string;
  time: string;
  appointmentType: string;
  reason: string;
}

export default function ScheduleAppointment({
  onBack,
}: { onBack?: () => void }) {
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState<BookingData>({
    provider: null,
    date: "",
    time: "",
    appointmentType: "",
    reason: "",
  });
  const [confirmed, setConfirmed] = useState(false);

  const dates = Object.keys(SLOTS);
  const selectedSlots = booking.date ? SLOTS[booking.date] : null;

  const formatDate = (d: string) => {
    if (!d) return "";
    return new Date(`${d}T12:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="space-y-6" data-ocid="schedule.page">
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              Appointment Confirmed!
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              You will receive a confirmation email shortly.
            </p>
          </div>
          <div className="bg-card border border-border rounded-sm p-5 text-left w-full max-w-sm space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-semibold text-foreground">
                {booking.provider?.name}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-semibold text-foreground">
                {formatDate(booking.date)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time</span>
              <span className="font-semibold text-foreground">
                {booking.time}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Type</span>
              <span className="font-semibold text-foreground">
                {booking.appointmentType}
              </span>
            </div>
          </div>
          <button
            type="button"
            data-ocid="schedule.back.button"
            onClick={onBack}
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--primary)" }}
          >
            ← Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="schedule.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            data-ocid="schedule.back.button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back
          </button>
        )}
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0" data-ocid="schedule.step.panel">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-1.5">
              <div
                className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 transition-all"
                style={{
                  background:
                    i < step
                      ? "var(--accent)"
                      : i === step
                        ? "var(--sidebar)"
                        : "var(--muted)",
                  color: i <= step ? "var(--card)" : "var(--muted-foreground)",
                }}
              >
                {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className="text-sm font-medium hidden sm:inline"
                style={{
                  color:
                    i === step ? "var(--sidebar)" : "var(--muted-foreground)",
                }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="mx-3 h-px w-8 bg-border flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Provider selection */}
      {step === 0 && (
        <div className="space-y-3" data-ocid="schedule.provider.section">
          <h3 className="text-sm font-semibold text-foreground">
            Select a Provider
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROVIDERS.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                data-ocid={`schedule.provider.item.${idx + 1}`}
                onClick={() => {
                  setBooking((prev) => ({ ...prev, provider: p }));
                  setStep(1);
                }}
                className="flex items-start gap-3 p-4 text-left border rounded-sm transition-all hover:bg-muted/40"
                style={{
                  borderColor:
                    booking.provider?.id === p.id
                      ? "var(--accent)"
                      : "var(--border)",
                  background:
                    booking.provider?.id === p.id
                      ? "var(--primary)" + " / 0.1"
                      : "var(--card)",
                }}
              >
                <div
                  className="w-9 h-9 flex items-center justify-center rounded-sm text-white text-sm font-bold flex-shrink-0"
                  style={{ background: "var(--accent)" }}
                >
                  {p.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {p.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{p.specialty}</p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--success)" }}
                  >
                    Next available: {p.nextAvailable}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Date & time */}
      {step === 1 && (
        <div className="space-y-4" data-ocid="schedule.datetime.section">
          <h3 className="text-sm font-semibold text-foreground">
            Select Date & Time
          </h3>
          <p className="text-sm text-muted-foreground">
            Booking with {booking.provider?.name} —{" "}
            {booking.provider?.specialty}
          </p>

          {/* Date grid */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {dates.map((d) => {
              const slots = SLOTS[d];
              const hasSlots =
                slots.morning.length + slots.afternoon.length > 0;
              return (
                <button
                  key={d}
                  type="button"
                  data-ocid="schedule.date.button"
                  disabled={!hasSlots}
                  onClick={() =>
                    setBooking((prev) => ({ ...prev, date: d, time: "" }))
                  }
                  className="flex flex-col items-center gap-0.5 p-2 border rounded-sm text-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    borderColor:
                      booking.date === d ? "var(--accent)" : "var(--border)",
                    background:
                      booking.date === d
                        ? "var(--primary)" + " / 0.1"
                        : hasSlots
                          ? "var(--card)"
                          : "var(--muted)",
                  }}
                >
                  <span className="text-xs text-muted-foreground">
                    {new Date(`${d}T12:00:00`).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {new Date(`${d}T12:00:00`).getDate()}
                  </span>
                  {hasSlots && (
                    <span className="text-xs text-muted-foreground">
                      {slots.morning.length + slots.afternoon.length} slots
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Time slots */}
          {booking.date && selectedSlots && (
            <div className="space-y-3">
              {selectedSlots.morning.length === 0 &&
                selectedSlots.afternoon.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No availability on this date. Please select another day.
                  </p>
                )}
              {selectedSlots.morning.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Morning
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSlots.morning.map((t) => (
                      <button
                        key={t}
                        type="button"
                        data-ocid="schedule.time.button"
                        onClick={() =>
                          setBooking((prev) => ({ ...prev, time: t }))
                        }
                        className="px-3 py-1.5 text-sm font-medium border rounded-sm transition-all"
                        style={{
                          borderColor:
                            booking.time === t
                              ? "var(--accent)"
                              : "var(--border)",
                          background:
                            booking.time === t
                              ? "var(--accent)"
                              : "var(--card)",
                          color:
                            booking.time === t
                              ? "var(--card)"
                              : "var(--foreground)",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {selectedSlots.afternoon.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Afternoon
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSlots.afternoon.map((t) => (
                      <button
                        key={t}
                        type="button"
                        data-ocid="schedule.time.button"
                        onClick={() =>
                          setBooking((prev) => ({ ...prev, time: t }))
                        }
                        className="px-3 py-1.5 text-sm font-medium border rounded-sm transition-all"
                        style={{
                          borderColor:
                            booking.time === t
                              ? "var(--accent)"
                              : "var(--border)",
                          background:
                            booking.time === t
                              ? "var(--accent)"
                              : "var(--card)",
                          color:
                            booking.time === t
                              ? "var(--card)"
                              : "var(--foreground)",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              data-ocid="schedule.prev.button"
              onClick={() => setStep(0)}
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Back
            </Button>
            <Button
              size="sm"
              data-ocid="schedule.next.button"
              disabled={!booking.date || !booking.time}
              onClick={() => setStep(2)}
            >
              Continue <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Details */}
      {step === 2 && (
        <div className="space-y-4" data-ocid="schedule.details.section">
          <h3 className="text-sm font-semibold text-foreground">
            Appointment Details
          </h3>

          <div className="space-y-4 max-w-md">
            <div>
              <label
                htmlFor="schedule-type"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5"
              >
                Appointment Type
              </label>
              <select
                id="schedule-type"
                data-ocid="schedule.type.select"
                value={booking.appointmentType}
                onChange={(e) =>
                  setBooking((prev) => ({
                    ...prev,
                    appointmentType: e.target.value,
                  }))
                }
                className="w-full h-9 px-3 text-sm bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring"
              >
                <option value="">Select type...</option>
                {APPOINTMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="schedule-reason"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5"
              >
                Reason for Visit
              </label>
              <Textarea
                id="schedule-reason"
                data-ocid="schedule.reason.textarea"
                value={booking.reason}
                onChange={(e) =>
                  setBooking((prev) => ({ ...prev, reason: e.target.value }))
                }
                placeholder="Briefly describe your symptoms or the purpose of your visit..."
                rows={3}
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              data-ocid="schedule.prev.button"
              onClick={() => setStep(1)}
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Back
            </Button>
            <Button
              size="sm"
              data-ocid="schedule.next.button"
              disabled={!booking.appointmentType || !booking.reason.trim()}
              onClick={() => setStep(3)}
            >
              Review <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 3 && (
        <div className="space-y-4" data-ocid="schedule.confirm.section">
          <h3 className="text-sm font-semibold text-foreground">
            Confirm Your Appointment
          </h3>

          <div className="bg-card border border-border rounded-sm divide-y divide-border">
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-semibold text-foreground">
                {booking.provider?.name}
              </span>
            </div>
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-muted-foreground">Specialty</span>
              <span className="text-foreground">
                {booking.provider?.specialty}
              </span>
            </div>
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-semibold text-foreground">
                {formatDate(booking.date)}
              </span>
            </div>
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-muted-foreground">Time</span>
              <span className="font-semibold text-foreground">
                {booking.time}
              </span>
            </div>
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-muted-foreground">Type</span>
              <span className="text-foreground">{booking.appointmentType}</span>
            </div>
            <div className="px-4 py-3 text-sm">
              <p className="text-muted-foreground mb-1">Reason</p>
              <p className="text-foreground">{booking.reason}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              data-ocid="schedule.prev.button"
              onClick={() => setStep(2)}
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Back
            </Button>
            <Button
              size="sm"
              data-ocid="schedule.confirm.primary_button"
              onClick={handleConfirm}
              className="gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Confirm Booking
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
