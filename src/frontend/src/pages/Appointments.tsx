import { AppointmentBookingForm } from "@/components/appointments/AppointmentBookingForm";
import { AppointmentRemindersPanel } from "@/components/appointments/AppointmentRemindersPanel";
import { AppointmentTable } from "@/components/appointments/AppointmentTable";
import { ProviderAvailabilityPanel } from "@/components/appointments/ProviderAvailabilityPanel";
import { WaitlistPanel } from "@/components/appointments/WaitlistPanel";
import { WeekCalendarView } from "@/components/appointments/WeekCalendarView";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronUp, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  DEMO_APPOINTMENT_REMINDERS,
  DEMO_WAITLIST,
  type DemoAppointmentReminder,
  type DemoReminderStatus,
  type DemoWaitlistEntry,
} from "../demoData";
import { useActor } from "../hooks/useActor";
import { useAppointments, usePatients } from "../hooks/useBackendData";
import { useDemoMode } from "../hooks/useDemoMode";

type ReminderStatus = "sent" | "scheduled" | "failed" | "not-set";

interface ReminderInfo {
  method: "SMS" | "Email" | "Both";
  scheduledTime: string;
  status: ReminderStatus;
  lastSent?: string;
}

interface Appointment {
  id: bigint;
  patientId: bigint;
  providerId: bigint;
  date: string;
  status: string;
}

interface Patient {
  id: bigint;
  name: string;
  mrn: string;
  dateOfBirth: string;
  phone: string;
  email: string;
}

interface AvailabilityBlock {
  id: number;
  provider: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  recurrence: "one-time" | "weekly";
}

const INITIAL_BLOCKS: AvailabilityBlock[] = [
  {
    id: 1,
    provider: "Dr. Sarah Johnson",
    date: "Dec 25",
    startTime: "",
    endTime: "",
    reason: "Holiday",
    recurrence: "one-time",
  },
  {
    id: 2,
    provider: "Dr. Sarah Johnson",
    date: "Jan 3",
    startTime: "13:00",
    endTime: "15:00",
    reason: "Conference",
    recurrence: "one-time",
  },
  {
    id: 3,
    provider: "Dr. Sarah Johnson",
    date: "Every Friday",
    startTime: "16:00",
    endTime: "17:00",
    reason: "Admin Time",
    recurrence: "weekly",
  },
  {
    id: 4,
    provider: "Dr. Michael Chen",
    date: "Jan 10",
    startTime: "09:00",
    endTime: "12:00",
    reason: "CME Training",
    recurrence: "one-time",
  },
];

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 16);
}

function addWeeks(dateStr: string, weeks: number): string {
  return addDays(dateStr, weeks * 7);
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 16);
}

interface AppointmentsProps {
  onStartEncounter: (appointmentId: bigint, patientId: bigint) => void;
  onNavigate?: (page: string) => void;
}

export default function Appointments({
  onStartEncounter,
  onNavigate,
}: AppointmentsProps) {
  const { isDemoMode, demoActor } = useDemoMode();
  const { actor: realActor } = useActor();
  const actor = isDemoMode ? demoActor : realActor;
  const queryClient = useQueryClient();
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    patientId: "",
    date: "",
    providerId: "10",
    recurrence: "none",
    occurrences: "4",
    videoVisit: false,
  });
  const videoApptIds = new Set(["1", "3", "8"]);
  const [showAvailability, setShowAvailability] = useState(false);
  const [availBlocks, setAvailBlocks] =
    useState<AvailabilityBlock[]>(INITIAL_BLOCKS);
  const [selectedProvider, setSelectedProvider] = useState(() => {
    try {
      const p = JSON.parse(
        localStorage.getItem("medunite_prefs_Receptionist") || "{}",
      );
      if (p.providers && Array.isArray(p.providers) && p.providers.length > 0)
        return p.providers[0];
    } catch {
      /* ignore */
    }
    return "Dr. Sarah Johnson";
  });
  const [availForm, setAvailForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    reason: "",
    recurrence: "one-time" as "one-time" | "weekly",
  });
  const [showAvailForm, setShowAvailForm] = useState(false);
  const [reminders, setReminders] = useState<Record<string, ReminderInfo>>({});
  const [expandedReminder, setExpandedReminder] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState<"list" | "week">("list");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [waitlist, setWaitlist] = useState<DemoWaitlistEntry[]>(DEMO_WAITLIST);
  const [apptReminders, setApptReminders] = useState<DemoAppointmentReminder[]>(
    isDemoMode ? DEMO_APPOINTMENT_REMINDERS : [],
  );
  const [showApptRemindersPanel, setShowApptRemindersPanel] = useState(true);
  const [sendingApptReminderId, setSendingApptReminderId] = useState<
    string | null
  >(null);
  const [sendingAllApptReminders, setSendingAllApptReminders] = useState(false);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [waitlistExpanded, setWaitlistExpanded] = useState(true);
  const [waitlistForm, setWaitlistForm] = useState({
    patientName: "",
    reason: "",
    priority: "routine" as "urgent" | "routine",
  });

  const getReminder = (id: string): ReminderInfo =>
    reminders[id] ?? {
      method: "Email",
      scheduledTime: "24 hours before",
      status: "not-set",
    };
  const setReminder = (id: string, info: Partial<ReminderInfo>) =>
    setReminders((prev) => ({
      ...prev,
      [id]: { ...getReminder(id), ...info },
    }));
  const handleSendNow = (id: string) => {
    setReminder(id, {
      status: "sent",
      lastSent: new Date().toLocaleTimeString(),
    });
    toast.success("Reminder sent");
  };
  const handleAddBlock = () => {
    if (!availForm.date || !availForm.reason) {
      toast.error("Date and reason required");
      return;
    }
    setAvailBlocks((prev) => [
      ...prev,
      {
        id: Date.now(),
        provider: selectedProvider,
        date: availForm.date,
        startTime: availForm.startTime,
        endTime: availForm.endTime,
        reason: availForm.reason,
        recurrence: availForm.recurrence,
      },
    ]);
    setAvailForm({
      date: "",
      startTime: "",
      endTime: "",
      reason: "",
      recurrence: "one-time",
    });
    setShowAvailForm(false);
    toast.success("Block added");
  };
  const handleRemoveBlock = (id: number) => {
    setAvailBlocks((prev) => prev.filter((b) => b.id !== id));
    toast.success("Block removed");
  };

  const remindersSentToday =
    Object.values(reminders).filter((r) => r.status === "sent").length + 8;
  const remindersPending =
    Object.values(reminders).filter((r) => r.status === "scheduled").length + 3;
  const remindersFailed =
    Object.values(reminders).filter((r) => r.status === "failed").length + 1;

  const { data: appointmentsData, isLoading: appointmentsLoading } =
    useAppointments();
  const { data: patientsData, isLoading: patientsLoading } = usePatients();

  useEffect(() => {
    if (isDemoMode) return; // demo mode uses local state
    if (appointmentsData) setAppts(appointmentsData as Appointment[]);
    if (patientsData) setPatients(patientsData as Patient[]);
    if (!appointmentsLoading && !patientsLoading) setLoading(false);
  }, [
    appointmentsData,
    patientsData,
    appointmentsLoading,
    patientsLoading,
    isDemoMode,
  ]);

  // Demo mode: use actor directly for initial load
  useEffect(() => {
    if (!isDemoMode || !actor) return;
    setLoading(true);
    Promise.all([actor.listAppointments(), actor.listPatients()])
      .then(([a, p]) => {
        setAppts(a);
        setPatients(p);
      })
      .catch(() => toast.error("Failed to load appointments"))
      .finally(() => setLoading(false));
  }, [actor, isDemoMode]);

  const getPatientName = (patientId: bigint) => {
    const p = patients.find((pt) => pt.id === patientId);
    return p?.name ?? `Patient #${patientId}`;
  };

  const buildDateSequence = (
    baseDate: string,
    recurrence: string,
    occurrences: number,
  ): string[] => {
    const dates: string[] = [baseDate];
    for (let i = 1; i < occurrences; i++) {
      if (recurrence === "daily") dates.push(addDays(baseDate, i));
      else if (recurrence === "weekly") dates.push(addWeeks(baseDate, i));
      else if (recurrence === "biweekly") dates.push(addWeeks(baseDate, i * 2));
      else if (recurrence === "monthly") dates.push(addMonths(baseDate, i));
    }
    return dates;
  };

  const handleStatusChange = (id: bigint, newStatus: string) => {
    setAppts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );
    toast.success(`Appointment marked as ${newStatus}`);
    if (actor) {
      actor.updateAppointmentStatus(id, newStatus).catch(() => {});
    }
  };

  const handleBulkStatusChange = (newStatus: string) => {
    const idsToUpdate = Array.from(selectedIds)
      .map((sid) => appts.find((a) => String(a.id) === sid))
      .filter((a) => a && a.status === "scheduled")
      .map((a) => a!.id);
    setAppts((prev) =>
      prev.map((a) =>
        selectedIds.has(String(a.id)) && a.status === "scheduled"
          ? { ...a, status: newStatus }
          : a,
      ),
    );
    toast.success(`${selectedIds.size} appointment(s) marked as ${newStatus}`);
    setSelectedIds(new Set());
    if (actor) {
      for (const id of idsToUpdate) {
        actor.updateAppointmentStatus(id, newStatus).catch(() => {});
      }
    }
  };

  const toggleSelectAll = () => {
    const scheduledIds = appts
      .filter((a) => a.status === "scheduled")
      .map((a) => String(a.id));
    if (
      scheduledIds.every((id) => selectedIds.has(id)) &&
      scheduledIds.length > 0
    ) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(scheduledIds));
    }
  };

  const handleAdd = async (prefillPatientId?: string) => {
    const pid = prefillPatientId ?? form.patientId;
    if (!pid || !form.date) {
      toast.error("Patient and date required");
      return;
    }
    if (!actor) {
      toast.error("Not connected to backend");
      return;
    }
    setSubmitting(true);
    try {
      const dates =
        form.recurrence !== "none"
          ? buildDateSequence(
              form.date,
              form.recurrence,
              Number.parseInt(form.occurrences, 10),
            )
          : [form.date];

      for (const date of dates) {
        await actor.createAppointment(
          BigInt(pid),
          BigInt(form.providerId),
          date,
        );
      }

      queryClient.invalidateQueries({ queryKey: ["appointments"] });

      setForm({
        patientId: "",
        date: "",
        providerId: "10",
        recurrence: "none",
        occurrences: "4",
        videoVisit: false,
      });
      setShowForm(false);
      toast.success(
        dates.length > 1
          ? `${dates.length} appointments booked`
          : "Appointment booked",
      );
    } catch {
      toast.error("Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleScheduleFromWaitlist = (entry: DemoWaitlistEntry) => {
    setForm((prev) => ({ ...prev, date: `${entry.dateAdded}T09:00` }));
    setShowForm(true);
    toast.info(`Pre-filled for ${entry.patientName}`);
  };

  const handleNotifyWaitlist = (id: string) => {
    setWaitlist((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "notified" } : e)),
    );
    const entry = waitlist.find((e) => e.id === id);
    toast.success(`Notification sent to ${entry?.patientName ?? "patient"}`);
  };

  const handleRemoveWaitlist = (id: string) => {
    setWaitlist((prev) => prev.filter((e) => e.id !== id));
    toast.success("Removed from waitlist");
  };

  const handleAddToWaitlist = () => {
    if (!waitlistForm.patientName.trim() || !waitlistForm.reason.trim()) {
      toast.error("Patient name and reason are required");
      return;
    }
    const newEntry: DemoWaitlistEntry = {
      id: `wl${Date.now()}`,
      patientName: waitlistForm.patientName.trim(),
      reason: waitlistForm.reason.trim(),
      dateAdded: new Date().toISOString().slice(0, 10),
      priority: waitlistForm.priority,
      status: "waiting",
    };
    setWaitlist((prev) => [newEntry, ...prev]);
    setWaitlistForm({ patientName: "", reason: "", priority: "routine" });
    setShowWaitlistForm(false);
    toast.success(`${newEntry.patientName} added to waitlist`);
  };

  const notSentCount = useMemo(
    () => apptReminders.filter((r) => r.status === "not-sent").length,
    [apptReminders],
  );

  const handleSendAllReminders = async () => {
    setSendingAllApptReminders(true);
    setApptReminders((prev) =>
      prev.map((r) =>
        r.status === "not-sent"
          ? { ...r, status: "sent" as DemoReminderStatus }
          : r,
      ),
    );
    setSendingAllApptReminders(false);
    toast.success("All pending reminders sent.");
  };

  const handleSendOneReminder = (appointmentId: string) => {
    setSendingApptReminderId(appointmentId);
    const rem = apptReminders.find((r) => r.appointmentId === appointmentId);
    setApptReminders((prev) =>
      prev.map((r) =>
        r.appointmentId === appointmentId
          ? { ...r, status: "sent" as DemoReminderStatus }
          : r,
      ),
    );
    setSendingApptReminderId(null);
    toast.success(`Reminder sent to ${rem?.patientName ?? "patient"}`);
  };

  return (
    <div className="space-y-5" data-ocid="appointments.page">
      {/* Reminders Summary */}
      <div
        className="grid grid-cols-3 gap-3"
        data-ocid="appointments.reminders.card"
      >
        <div className="bg-card border border-border px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Reminders Sent Today
          </p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {remindersSentToday}
          </p>
        </div>
        <div className="bg-card border border-border px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pending
          </p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {remindersPending}
          </p>
        </div>
        <div className="bg-card border border-border px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Failed
          </p>
          <p className="text-2xl font-bold text-destructive mt-1">
            {remindersFailed}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          data-ocid="appointments.primary_button"
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? (
            <ChevronUp className="w-3.5 h-3.5 mr-1.5" />
          ) : (
            <Plus className="w-3.5 h-3.5 mr-1.5" />
          )}
          New Appointment
        </Button>
        <div className="flex items-center gap-1 border border-border rounded-sm overflow-hidden bg-muted/30">
          <button
            type="button"
            data-ocid="appointments.list.tab"
            onClick={() => setCalendarView("list")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold transition-colors",
              calendarView === "list"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
            )}
          >
            List
          </button>
          <button
            type="button"
            data-ocid="appointments.week.tab"
            onClick={() => setCalendarView("week")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold transition-colors",
              calendarView === "week"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
            )}
          >
            Week
          </button>
        </div>
      </div>

      {showForm && (
        <AppointmentBookingForm
          form={form}
          setForm={setForm}
          patients={patients}
          submitting={submitting}
          onSubmit={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}

      <ProviderAvailabilityPanel
        showAvailability={showAvailability}
        setShowAvailability={setShowAvailability}
        availBlocks={availBlocks}
        availForm={availForm}
        setAvailForm={setAvailForm}
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
        showAvailForm={showAvailForm}
        setShowAvailForm={setShowAvailForm}
        onAddBlock={handleAddBlock}
        onRemoveBlock={handleRemoveBlock}
      />

      {calendarView === "week" && (
        <WeekCalendarView appts={appts} getPatientName={getPatientName} />
      )}

      {calendarView === "list" && (
        <AppointmentTable
          appts={appts}
          loading={loading}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          toggleSelectAll={toggleSelectAll}
          reminders={reminders}
          setReminder={setReminder}
          expandedReminder={expandedReminder}
          setExpandedReminder={setExpandedReminder}
          videoApptIds={videoApptIds}
          getPatientName={getPatientName}
          handleStatusChange={handleStatusChange}
          handleBulkStatusChange={handleBulkStatusChange}
          handleSendNow={handleSendNow}
          onStartEncounter={onStartEncounter}
          onNavigate={onNavigate}
        />
      )}

      <WaitlistPanel
        waitlist={waitlist}
        waitlistForm={waitlistForm}
        setWaitlistForm={setWaitlistForm}
        waitlistExpanded={waitlistExpanded}
        setWaitlistExpanded={setWaitlistExpanded}
        showWaitlistForm={showWaitlistForm}
        setShowWaitlistForm={setShowWaitlistForm}
        onAddToWaitlist={handleAddToWaitlist}
        onNotify={handleNotifyWaitlist}
        onSchedule={handleScheduleFromWaitlist}
        onRemove={handleRemoveWaitlist}
      />

      <AppointmentRemindersPanel
        apptReminders={apptReminders}
        showApptRemindersPanel={showApptRemindersPanel}
        setShowApptRemindersPanel={setShowApptRemindersPanel}
        sendingApptReminderId={sendingApptReminderId}
        sendingAllApptReminders={sendingAllApptReminders}
        notSentCount={notSentCount}
        onSendAll={handleSendAllReminders}
        onSendOne={handleSendOneReminder}
      />
    </div>
  );
}
