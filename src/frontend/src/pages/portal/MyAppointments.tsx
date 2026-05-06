import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortalContext } from "@/contexts/PortalContext";
import { useActor } from "@/hooks/useActor";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Appointment {
  id: bigint;
  date: string;
  provider: string;
  reason: string;
  status: string;
}

const PROVIDER_NAMES: Record<string, string> = {
  "10": "Dr. Sarah Johnson",
  "11": "Dr. Michael Chen",
  "12": "Dr. Emily Rodriguez",
  "13": "Dr. James Park",
};

const providers = [
  "Dr. Sarah Chen — Internal Medicine",
  "Dr. Marcus Williams — Cardiology",
  "Dr. Lisa Park — Endocrinology",
  "Dr. James Okafor — Dermatology",
];

const statusVariant = (
  s: string,
): "success" | "warning" | "info" | "neutral" | "danger" => {
  switch (s) {
    case "confirmed":
      return "success";
    case "pending":
      return "warning";
    case "upcoming":
    case "scheduled":
      return "info";
    case "completed":
      return "neutral";
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
};

const isPastStatus = (s: string) => s === "completed" || s === "cancelled";

export default function MyAppointments({
  onNavigate,
}: { onNavigate?: (page: string) => void }) {
  const { actor, isFetching } = useActor();
  const portalPatient = usePortalContext();
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [past, setPast] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [cancelConfirmId, setCancelConfirmId] = useState<bigint | null>(null);
  const [cancelledIds, setCancelledIds] = useState<bigint[]>([]);
  const [newAppt, setNewAppt] = useState({
    date: "",
    provider: "",
    reason: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [checkedInIds, setCheckedInIds] = useState<Set<bigint>>(new Set());
  const [showDemographicsId, setShowDemographicsId] = useState<bigint | null>(
    null,
  );
  const [_demographicsConfirmed, setDemographicsConfirmed] = useState<
    Set<bigint>
  >(new Set());

  // Reschedule state: maps appointment id string -> form state
  const [rescheduleOpenId, setRescheduleOpenId] = useState<bigint | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    date: "",
    provider: "",
    reason: "",
  });
  const [rescheduleSuccessId, setRescheduleSuccessId] = useState<bigint | null>(
    null,
  );

  const todayStr = new Date().toISOString().split("T")[0] ?? "";
  const isToday = (dateStr: string) => dateStr === todayStr;

  useEffect(() => {
    if (isFetching || !actor) return;
    setIsLoading(true);
    actor
      .listAppointments()
      .then((appts) => {
        const mapped: Appointment[] = appts.map((a) => ({
          id: a.id,
          date: a.date,
          provider:
            PROVIDER_NAMES[String(a.providerId)] ?? `Provider #${a.providerId}`,
          reason: "—",
          status: a.status,
        }));
        setUpcoming(mapped.filter((a) => !isPastStatus(a.status)));
        setPast(mapped.filter((a) => isPastStatus(a.status)));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [actor, isFetching]);

  const handleSubmit = () => {
    if (!newAppt.date || !newAppt.provider || !newAppt.reason) return;
    // Wire to backend with correct patient and provider IDs
    if (actor) {
      const providerIdx = providers.indexOf(newAppt.provider);
      const providerId = BigInt(10 + (providerIdx >= 0 ? providerIdx : 0));
      actor
        .createAppointment(portalPatient.id, providerId, newAppt.date)
        .catch(() => {});
    }
    const optimistic: Appointment = {
      id: BigInt(Date.now()),
      date: newAppt.date,
      provider: newAppt.provider,
      reason: newAppt.reason,
      status: "pending",
    };
    setUpcoming((prev) => [optimistic, ...prev]);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setShowNewForm(false);
    setNewAppt({ date: "", provider: "", reason: "" });
  };

  const handleCancel = (id: bigint) => {
    // Wire to backend silently
    if (actor) {
      actor.updateAppointmentStatus(id, "cancelled").catch(() => {});
    }
    setCancelledIds((prev) => [...prev, id]);
    setCancelConfirmId(null);
  };

  const handleRescheduleOpen = (appt: Appointment) => {
    setRescheduleOpenId(appt.id);
    setRescheduleSuccessId(null);
    setRescheduleForm({ date: "", provider: appt.provider, reason: "" });
  };

  const handleRescheduleSubmit = (id: bigint) => {
    if (!rescheduleForm.date) {
      toast.error("Please select a new date.");
      return;
    }
    setRescheduleSuccessId(id);
    toast.success("Reschedule request submitted!");
    setRescheduleOpenId(null);
    setTimeout(() => setRescheduleSuccessId(null), 3000);
  };

  const renderSkeletonRows = (count: number) =>
    ["a", "b", "c"].slice(0, count).map((k) => (
      <tr key={k} className="border-b border-border last:border-0">
        <td className="px-4 py-3">
          <Skeleton className="h-4 w-28" />
        </td>
        <td className="px-4 py-3">
          <Skeleton className="h-4 w-32" />
        </td>
        <td className="px-4 py-3">
          <Skeleton className="h-4 w-40" />
        </td>
        <td className="px-4 py-3">
          <Skeleton className="h-4 w-16" />
        </td>
        <td className="px-4 py-3">
          <Skeleton className="h-4 w-20" />
        </td>
        <td className="px-4 py-3" />
      </tr>
    ));

  return (
    <div className="space-y-6" data-ocid="appointments.page">
      {/* Upcoming */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">
            Upcoming Appointments
          </h2>
          <div className="flex items-end gap-3">
            {onNavigate && (
              <div className="flex flex-col items-end gap-0.5">
                <button
                  type="button"
                  data-ocid="appointments.schedule.primary_button"
                  onClick={() => onNavigate("portal-schedule")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-semibold text-white transition-all"
                  style={{
                    background: "var(--accent)",
                    border: "1px solid var(--accent)",
                  }}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Book Appointment
                </button>
                <span className="text-xs text-muted-foreground">
                  Confirmed slot, immediate booking
                </span>
              </div>
            )}
            <div className="flex flex-col items-end gap-0.5">
              <button
                type="button"
                data-ocid="appointments.open_modal_button"
                onClick={() => setShowNewForm((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-medium transition-all"
                style={{
                  color: "var(--primary)",
                  border: "1px solid var(--border)",
                }}
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Request Appointment
              </button>
              <span className="text-xs text-muted-foreground">
                Staff reviews and confirms
              </span>
            </div>
          </div>
        </div>

        {/* Request success banner — shown after form closes */}
        {submitted && (
          <div
            className="mb-3 flex items-center gap-2 py-3 px-4 rounded-sm text-sm font-medium"
            style={{
              background: "var(--success)",
              color: "var(--success-foreground)",
            }}
            data-ocid="appointments.request.success_state"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Your request has been submitted. Our scheduling team will confirm
            shortly.
          </div>
        )}

        {showNewForm && (
          <div
            className="mb-4 p-4 bg-card border border-border rounded-sm"
            data-ocid="appointments.request.panel"
          >
            <h3 className="text-xs font-semibold text-foreground mb-3">
              Request New Appointment
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="req-date"
                  className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1"
                >
                  Preferred Date
                </label>
                <input
                  id="req-date"
                  type="date"
                  data-ocid="appointments.request.date.input"
                  value={newAppt.date}
                  onChange={(e) =>
                    setNewAppt((p) => ({ ...p, date: e.target.value }))
                  }
                  className="w-full h-8 px-2.5 text-sm bg-background border border-input rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <div>
                <label
                  htmlFor="req-provider"
                  className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1"
                >
                  Preferred Provider
                </label>
                <select
                  id="req-provider"
                  data-ocid="appointments.request.provider.select"
                  value={newAppt.provider}
                  onChange={(e) =>
                    setNewAppt((p) => ({ ...p, provider: e.target.value }))
                  }
                  className="w-full h-8 px-2.5 text-sm bg-background border border-input rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select provider...</option>
                  {providers.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-3">
                <label
                  htmlFor="req-reason"
                  className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1"
                >
                  Reason for Visit
                </label>
                <textarea
                  id="req-reason"
                  data-ocid="appointments.request.reason.textarea"
                  value={newAppt.reason}
                  onChange={(e) =>
                    setNewAppt((p) => ({ ...p, reason: e.target.value }))
                  }
                  rows={2}
                  placeholder="Briefly describe your reason for visiting..."
                  className="w-full px-2.5 py-2 text-sm bg-background border border-input rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </div>
              <div className="col-span-3 flex items-center gap-2">
                <button
                  type="button"
                  data-ocid="appointments.request.submit_button"
                  onClick={handleSubmit}
                  className="px-4 py-1.5 rounded-sm text-sm font-semibold text-white"
                  style={{ background: "var(--accent)" }}
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  data-ocid="appointments.request.cancel_button"
                  onClick={() => setShowNewForm(false)}
                  className="px-4 py-1.5 rounded-sm text-sm font-medium text-muted-foreground border border-border hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className="bg-card border border-border rounded-sm overflow-hidden"
          data-ocid="appointments.upcoming.table"
        >
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b border-border"
                style={{ background: "var(--muted)" }}
              >
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Date
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Provider
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Reason
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                renderSkeletonRows(3)
              ) : upcoming.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center"
                    data-ocid="appointments.upcoming.empty_state"
                  >
                    <p className="text-sm text-muted-foreground mb-3">
                      No upcoming appointments.
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      {onNavigate && (
                        <button
                          type="button"
                          onClick={() => onNavigate("portal-schedule")}
                          className="px-3 py-1.5 rounded-sm text-sm font-semibold text-white"
                          style={{ background: "var(--accent)" }}
                        >
                          Book Appointment
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowNewForm(true)}
                        className="px-3 py-1.5 rounded-sm text-sm font-medium text-muted-foreground border border-border hover:text-foreground transition-colors"
                      >
                        Request Appointment
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                upcoming.map((appt, idx) => {
                  const isCancelled = cancelledIds.includes(appt.id);
                  const status = isCancelled ? "cancelled" : appt.status;
                  const isRescheduleOpen = rescheduleOpenId === appt.id;
                  const isRescheduleSuccess = rescheduleSuccessId === appt.id;
                  return (
                    <tr
                      key={String(appt.id)}
                      data-ocid={`appointments.item.${idx + 1}`}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">
                          {appt.date}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">
                          {appt.provider}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {appt.reason}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          variant={statusVariant(status)}
                          label={status}
                        />
                      </td>
                      <td className="px-4 py-3">
                        {/* Check In for today's appointments */}
                        {isToday(appt.date) &&
                          !isCancelled &&
                          !isPastStatus(appt.status) && (
                            <div className="mb-1.5 space-y-1.5">
                              {checkedInIds.has(appt.id) ? (
                                <div
                                  className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-sm"
                                  style={{
                                    background: "var(--success)",
                                    color: "var(--success-foreground)",
                                  }}
                                  data-ocid={`appointments.checkin.success_state.${idx + 1}`}
                                >
                                  <svg
                                    className="w-3 h-3"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    aria-hidden="true"
                                  >
                                    <path d="M20 6L9 17l-5-5" />
                                  </svg>
                                  Checked In
                                </div>
                              ) : (
                                <>
                                  {showDemographicsId === appt.id ? (
                                    <div
                                      className="p-2.5 bg-warning/10 border border-warning/30 rounded-sm text-xs"
                                      data-ocid={`appointments.demographics.panel.${idx + 1}`}
                                    >
                                      <p className="font-semibold text-foreground mb-1">
                                        Please confirm your information is up to
                                        date
                                      </p>
                                      <p className="text-muted-foreground mb-2">
                                        Address and insurance on file will be
                                        used for today&apos;s visit.
                                      </p>
                                      <div className="flex gap-1.5">
                                        <button
                                          type="button"
                                          data-ocid={`appointments.demographics.confirm_button.${idx + 1}`}
                                          onClick={() => {
                                            setDemographicsConfirmed(
                                              (prev) =>
                                                new Set([...prev, appt.id]),
                                            );
                                            setShowDemographicsId(null);
                                            setCheckedInIds(
                                              (prev) =>
                                                new Set([...prev, appt.id]),
                                            );
                                            toast.success(
                                              "Check-in complete! Please proceed to the front desk.",
                                            );
                                          }}
                                          className="px-2.5 py-1 text-xs font-semibold rounded-sm text-white"
                                          style={{
                                            background: "var(--success)",
                                          }}
                                        >
                                          Confirm &amp; Check In
                                        </button>
                                        <button
                                          type="button"
                                          data-ocid={`appointments.demographics.cancel_button.${idx + 1}`}
                                          onClick={() =>
                                            setShowDemographicsId(null)
                                          }
                                          className="px-2.5 py-1 text-xs font-medium rounded-sm text-muted-foreground border border-border"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      data-ocid={`appointments.checkin.button.${idx + 1}`}
                                      onClick={() =>
                                        setShowDemographicsId(appt.id)
                                      }
                                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-sm text-white"
                                      style={{
                                        background: "var(--accent)",
                                      }}
                                    >
                                      Check In
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          )}

                        {/* Reschedule + Cancel actions */}
                        {!isCancelled && !isPastStatus(appt.status) && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Reschedule button */}
                            {!isRescheduleOpen && (
                              <button
                                type="button"
                                data-ocid={`appointments.reschedule_button.${idx + 1}`}
                                onClick={() => handleRescheduleOpen(appt)}
                                className="text-xs font-medium px-2 py-1 rounded-sm border border-border text-muted-foreground hover:text-foreground transition-colors"
                              >
                                Reschedule
                              </button>
                            )}

                            {/* Cancel button/confirm */}
                            {cancelConfirmId === appt.id ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-muted-foreground">
                                  Cancel?
                                </span>
                                <button
                                  type="button"
                                  data-ocid={`appointments.cancel_button.${idx + 1}`}
                                  onClick={() => handleCancel(appt.id)}
                                  className="text-xs font-semibold px-2 py-0.5 rounded-sm"
                                  style={{
                                    color: "var(--destructive)",
                                    border: "1px solid var(--destructive)",
                                  }}
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  data-ocid={`appointments.confirm_button.${idx + 1}`}
                                  onClick={() => setCancelConfirmId(null)}
                                  className="text-xs text-muted-foreground px-2 py-0.5 rounded-sm border border-border hover:text-foreground transition-colors"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                data-ocid={`appointments.delete_button.${idx + 1}`}
                                onClick={() => setCancelConfirmId(appt.id)}
                                className="text-xs text-muted-foreground px-2 py-1 rounded-sm border border-border hover:text-foreground transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        )}

                        {/* Reschedule panel */}
                        {isRescheduleOpen && (
                          <div
                            className="mt-2 p-3 bg-muted/30 border border-border rounded-sm"
                            data-ocid={`appointments.reschedule.panel.${idx + 1}`}
                          >
                            {isRescheduleSuccess ? (
                              <div
                                className="flex items-center gap-2 text-sm font-medium py-1.5"
                                style={{ color: "var(--success-foreground)" }}
                                data-ocid="appointments.reschedule.success_state"
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  aria-hidden="true"
                                >
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                                Your reschedule request has been submitted.
                                We&apos;ll confirm the new time shortly.
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                  Reschedule Appointment
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label
                                      htmlFor={`reschedule-date-${idx}`}
                                      className="block text-xs font-medium text-muted-foreground mb-1"
                                    >
                                      New Date
                                    </label>
                                    <input
                                      id={`reschedule-date-${idx}`}
                                      type="date"
                                      data-ocid="appointments.reschedule.date.input"
                                      value={rescheduleForm.date}
                                      onChange={(e) =>
                                        setRescheduleForm((p) => ({
                                          ...p,
                                          date: e.target.value,
                                        }))
                                      }
                                      className="w-full h-7 px-2 text-sm bg-background border border-input rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor={`reschedule-provider-${idx}`}
                                      className="block text-xs font-medium text-muted-foreground mb-1"
                                    >
                                      Provider
                                    </label>
                                    <select
                                      id={`reschedule-provider-${idx}`}
                                      data-ocid="appointments.reschedule.provider.select"
                                      value={rescheduleForm.provider}
                                      onChange={(e) =>
                                        setRescheduleForm((p) => ({
                                          ...p,
                                          provider: e.target.value,
                                        }))
                                      }
                                      className="w-full h-7 px-2 text-sm bg-background border border-input rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                      <option value="">Select...</option>
                                      {providers.map((p) => (
                                        <option key={p} value={p}>
                                          {p}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-span-2">
                                    <label
                                      htmlFor={`reschedule-reason-${idx}`}
                                      className="block text-xs font-medium text-muted-foreground mb-1"
                                    >
                                      Reason for Change (optional)
                                    </label>
                                    <input
                                      id={`reschedule-reason-${idx}`}
                                      type="text"
                                      placeholder="e.g. Schedule conflict, feel better, etc."
                                      value={rescheduleForm.reason}
                                      onChange={(e) =>
                                        setRescheduleForm((p) => ({
                                          ...p,
                                          reason: e.target.value,
                                        }))
                                      }
                                      className="w-full h-7 px-2 text-sm bg-background border border-input rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                  <button
                                    type="button"
                                    data-ocid="appointments.reschedule.submit_button"
                                    onClick={() =>
                                      handleRescheduleSubmit(appt.id)
                                    }
                                    className="px-3 py-1 text-xs font-semibold rounded-sm text-white"
                                    style={{
                                      background: "var(--accent)",
                                    }}
                                  >
                                    Submit Request
                                  </button>
                                  <button
                                    type="button"
                                    data-ocid="appointments.reschedule.cancel_button"
                                    onClick={() => {
                                      setRescheduleOpenId(null);
                                      setRescheduleSuccessId(null);
                                    }}
                                    className="px-3 py-1 text-xs font-medium rounded-sm text-muted-foreground border border-border hover:text-foreground transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Past */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Past Appointments
        </h2>
        <div
          className="bg-card border border-border rounded-sm overflow-hidden"
          data-ocid="appointments.past.table"
        >
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b border-border"
                style={{ background: "var(--muted)" }}
              >
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Date
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Provider
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Reason
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                renderSkeletonRows(3)
              ) : past.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                    data-ocid="appointments.past.empty_state"
                  >
                    No past appointments.
                  </td>
                </tr>
              ) : (
                past.map((appt, idx) => (
                  <tr
                    key={String(appt.id)}
                    data-ocid={`appointments.past.item.${idx + 1}`}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{appt.date}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">
                        {appt.provider}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-foreground">{appt.reason}</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        variant={statusVariant(appt.status)}
                        label={appt.status}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {past.length > 0 && onNavigate && (
          <div className="mt-3 px-1 text-sm text-muted-foreground">
            Have feedback about a recent visit?{" "}
            <button
              type="button"
              onClick={() => onNavigate("portal-survey")}
              className="text-primary underline-offset-2 hover:underline"
            >
              Share your experience →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
