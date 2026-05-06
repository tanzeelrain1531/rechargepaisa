import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  AlertCircle,
  ArrowRightLeft,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Circle,
  ClipboardList,
  ClipboardPlus,
  FlaskConical,
  GitBranch,
  Inbox,
  Mail,
  MessageSquare,
  Pill,
  Receipt,
  Scan,
  Settings,
  Stethoscope,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
type Role = string;
import { MOCK_NOTIFICATIONS } from "../components/NotificationDropdown";
import { StatusBadge } from "../components/StatusBadge";
import { useActor } from "../hooks/useActor";
import {
  useAppointments,
  useInvoices,
  useLabResults,
  usePatients,
  usePrescriptions,
} from "../hooks/useBackendData";
import { useDemoMode } from "../hooks/useDemoMode";

type ScheduleStatusVariant =
  | "info"
  | "success"
  | "danger"
  | "neutral"
  | "warning";

const scheduleStatusVariant: Record<string, ScheduleStatusVariant> = {
  scheduled: "info",
  completed: "success",
  cancelled: "danger",
  "no-show": "neutral",
  "in-progress": "warning",
};

interface LabResult {
  id: bigint;
  result: string;
  isCritical: boolean;
  patientId: bigint;
  testName: string;
  unit: string;
}

interface AuditLog {
  id: bigint;
  action: string;
  actorId: { toString(): string };
  entityId: bigint;
  timestamp: bigint;
  entityType: string;
}

interface Prescription {
  id: bigint;
  patientId: bigint;
  status: string;
  medication: string;
}

function relativeTime(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  iconClass,
  valueClass,
  ocid,
  onClick,
}: {
  title: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  iconClass: string;
  valueClass?: string;
  ocid: string;
  onClick?: () => void;
}) {
  return (
    <Card
      data-ocid={ocid}
      className={`border border-border shadow-card bg-card ${
        onClick ? "cursor-pointer hover:bg-muted/30 transition-colors" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`w-4 h-4 ${iconClass}`} />
      </CardHeader>
      <CardContent className="pb-4 px-4 pt-1">
        <p
          className={`text-3xl font-bold tabular-nums leading-none ${valueClass ?? "text-foreground"}`}
        >
          {value}
        </p>
        <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>
      </CardContent>
    </Card>
  );
}

interface QuickAction {
  label: string;
  icon: React.ElementType;
  page: string;
  color: string;
  bg: string;
}

const QUICK_ACTIONS: Record<Role, QuickAction[]> = {
  Doctor: [
    {
      label: "Start Encounter",
      icon: Stethoscope,
      page: "appointments",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "New Referral",
      icon: GitBranch,
      page: "referrals",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "View Lab Results",
      icon: FlaskConical,
      page: "labs",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Add Patient",
      icon: UserPlus,
      page: "patients",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ],
  Nurse: [
    {
      label: "Inpatient Wards",
      icon: ClipboardList,
      page: "inpatient",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Medication Admin (MAR)",
      icon: ClipboardList,
      page: "mar",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Nursing Assessment",
      icon: Stethoscope,
      page: "nursing-assessment",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Shift Handoff",
      icon: ArrowRightLeft,
      page: "shift-handoff",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ],
  Pharmacist: [
    {
      label: "Pharmacy Queue",
      icon: ClipboardList,
      page: "pharmacy",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Prescriptions",
      icon: ClipboardPlus,
      page: "medication-reconciliation",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Medication Reconciliation",
      icon: ClipboardPlus,
      page: "medication-reconciliation",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Clinical Reference",
      icon: BookOpen,
      page: "clinical-reference",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ],
  Receptionist: [
    {
      label: "Register Patient",
      icon: UserPlus,
      page: "patients",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Book Appointment",
      icon: CalendarDays,
      page: "appointments",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Today's Schedule",
      icon: UserCheck,
      page: "appointments",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Referrals",
      icon: ClipboardList,
      page: "referrals",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ],
  Billing: [
    {
      label: "View Claims",
      icon: Receipt,
      page: "claims",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Revenue Cycle",
      icon: Activity,
      page: "reporting",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Prior Authorization",
      icon: ClipboardPlus,
      page: "prior-auth",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "View Patients",
      icon: Users,
      page: "patients",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ],
  Admin: [
    {
      label: "Add User",
      icon: UserPlus,
      page: "settings",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "View Reports",
      icon: ClipboardList,
      page: "reporting",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Audit Log",
      icon: Settings,
      page: "audit",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ],
  LabTech: [
    {
      label: "Lab Worklist",
      icon: FlaskConical,
      page: "labs",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Results Inbox",
      icon: Inbox,
      page: "results-inbox",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Orders",
      icon: ClipboardList,
      page: "orders",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Clinical Reference",
      icon: BookOpen,
      page: "clinical-reference",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ],
  Radiologist: [
    {
      label: "Imaging Queue",
      icon: Scan,
      page: "imaging",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Orders",
      icon: ClipboardList,
      page: "orders",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Clinical Reference",
      icon: BookOpen,
      page: "clinical-reference",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ],
};

const PROVIDER_TASKS = [
  {
    id: 1,
    icon: FlaskConical,
    description: "3 unreviewed lab results",
    priority: "urgent" as const,
    page: "labs",
  },
  {
    id: 2,
    icon: MessageSquare,
    description: "2 patient messages",
    priority: "normal" as const,
    page: "messages",
  },
  {
    id: 3,
    icon: Receipt,
    description: "1 unsigned clinical note",
    priority: "urgent" as const,
    page: "notes",
  },
  {
    id: 4,
    icon: Pill,
    description: "2 refill requests pending",
    priority: "normal" as const,
    page: "pharmacy",
  },
  {
    id: 5,
    icon: ClipboardList,
    description: "1 prior auth needs review",
    priority: "low" as const,
    page: "prior-auth",
  },
];

const taskPriorityVariant = {
  urgent: "danger",
  normal: "warning",
  low: "neutral",
} as const;

interface DashboardProps {
  onNavigate?: (page: string) => void;
  role?: Role;
  activePatient?: { id: bigint; name: string } | null;
}

export default function Dashboard({
  onNavigate,
  role = "Doctor",
  activePatient,
}: DashboardProps) {
  const { isDemoMode, demoActor } = useDemoMode();
  const { actor: realActor, isFetching } = useActor();
  const actor = isDemoMode ? demoActor : realActor;

  // Shared React Query hooks (shared cache across pages)
  const patientsQ = usePatients();
  const appointmentsQ = useAppointments();
  const labsQ = useLabResults();
  const invoicesQ = useInvoices();
  const prescriptionsQ = usePrescriptions();
  const [skipNoticeDismissed, setSkipNoticeDismissed] = React.useState(
    () => !!localStorage.getItem(`medunite_skip_notice_dismissed_${role}`),
  );
  const dismissSkipNotice = () => {
    localStorage.setItem(`medunite_skip_notice_dismissed_${role}`, "1");
    setSkipNoticeDismissed(true);
  };

  const [onboardingDismissed, setOnboardingDismissed] = React.useState(
    () => !!localStorage.getItem("medunite_onboarding_dismissed"),
  );
  const dismissOnboarding = () => {
    localStorage.setItem("medunite_onboarding_dismissed", "1");
    setOnboardingDismissed(true);
  };

  // Admin setup checklist
  const [setupDismissed, setSetupDismissed] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("admin-setup-checklist-v1");
      return saved ? JSON.parse(saved).dismissed === true : false;
    } catch {
      return false;
    }
  });
  const [setupChecked, setSetupChecked] = React.useState<boolean[]>(() => {
    try {
      const saved = localStorage.getItem("admin-setup-checklist-v1");
      return saved
        ? (JSON.parse(saved).checked ?? [false, false, false, false, false])
        : [false, false, false, false, false];
    } catch {
      return [false, false, false, false, false];
    }
  });
  const saveSetupState = (checked: boolean[], dismissed: boolean) => {
    localStorage.setItem(
      "admin-setup-checklist-v1",
      JSON.stringify({ checked, dismissed }),
    );
  };
  const toggleSetupItem = (i: number) => {
    const next = [...setupChecked];
    next[i] = !next[i];
    setSetupChecked(next);
    saveSetupState(next, setupDismissed);
  };
  const dismissSetup = () => {
    setSetupDismissed(true);
    saveSetupState(setupChecked, true);
  };
  const setupComplete = setupChecked.filter(Boolean).length;
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);

  // Derive dashboard stats from shared hook data
  const loading =
    patientsQ.isLoading ||
    appointmentsQ.isLoading ||
    labsQ.isLoading ||
    invoicesQ.isLoading ||
    prescriptionsQ.isLoading;

  const totalPatients = useMemo(
    () => (patientsQ.data ? patientsQ.data.length : ("\u2014" as const)),
    [patientsQ.data],
  );

  const patientNames = useMemo<Record<string, string>>(() => {
    if (!patientsQ.data) return {};
    const names: Record<string, string> = {};
    for (const p of patientsQ.data) names[String(p.id)] = p.name;
    return names;
  }, [patientsQ.data]);

  const todayAppts = useMemo(
    () =>
      appointmentsQ.data
        ? appointmentsQ.data.filter((a) => a.date.startsWith(todayStr))
        : [],
    [appointmentsQ.data, todayStr],
  );

  const criticalLabs = useMemo(
    () =>
      labsQ.data
        ? (labsQ.data as LabResult[]).filter((l) => l.isCritical).slice(0, 3)
        : [],
    [labsQ.data],
  );

  const allCriticalCount = useMemo(
    () =>
      labsQ.data
        ? (labsQ.data as LabResult[]).filter((l) => l.isCritical).length
        : 0,
    [labsQ.data],
  );

  const pendingInvoices = useMemo(
    () =>
      invoicesQ.data
        ? invoicesQ.data.filter((i) => i.status !== "paid").length
        : ("\u2014" as const),
    [invoicesQ.data],
  );

  const pendingOrders = useMemo(
    () =>
      prescriptionsQ.data
        ? (prescriptionsQ.data as Prescription[]).filter(
            (p) => p.status === "pending" || p.status === "dispensing",
          ).length
        : ("\u2014" as const),
    [prescriptionsQ.data],
  );

  useEffect(() => {
    if (!actor) return;
    if (!isDemoMode && isFetching) return;
    setLogsLoading(true);

    actor
      .listAuditLogs()
      .then((logs) => {
        const sorted = [...(logs as AuditLog[])].sort((a, b) =>
          Number(b.timestamp - a.timestamp),
        );
        setAuditLogs(sorted.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLogsLoading(false));
  }, [actor, isFetching, isDemoMode]);

  const criticalCount = criticalLabs.length;
  const hasCriticals = !loading && criticalCount > 0;
  const quickActions = QUICK_ACTIONS[role] ?? QUICK_ACTIONS.Doctor;

  const SETUP_ITEMS = [
    { label: "Invite staff and assign roles", tab: "users" },
    { label: "Configure provider schedules", tab: "availability" },
    { label: "Set up lab integrations", tab: "lab-integration" },
    { label: "Review SmartPhrase library", tab: "smartphrases" },
    { label: "Test FHIR API connection", tab: "fhir" },
  ];

  return (
    <div className="space-y-5" data-ocid="dashboard.page">
      {/* Skip setup notice — shown once when user skipped onboarding */}
      {!isDemoMode &&
        (() => {
          const prefs = (() => {
            try {
              return JSON.parse(
                localStorage.getItem(`medunite_prefs_${role}`) || "{}",
              );
            } catch {
              return {};
            }
          })();
          const isEmpty =
            Object.keys(prefs).length === 0 &&
            !!localStorage.getItem(`medunite_onboarded_${role}`);
          if (!isEmpty || skipNoticeDismissed) return null;
          return (
            <div
              className="flex items-start gap-3 border border-border rounded-sm bg-muted/30 px-4 py-3"
              data-ocid="dashboard.skip_notice.panel"
            >
              <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
                Setup was skipped — your workspace is showing all records.
                Update preferences in Settings → Profile anytime.
              </p>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground flex-shrink-0"
                data-ocid="dashboard.skip_notice.close_button"
                onClick={dismissSkipNotice}
              >
                Dismiss ×
              </button>
            </div>
          );
        })()}
      {/* Admin Setup Checklist */}
      {role === "Admin" && !setupDismissed && (
        <div
          className="border border-border rounded-sm bg-card"
          data-ocid="dashboard.setup_checklist.card"
        >
          <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <p className="text-sm font-semibold text-foreground">
                System Setup Checklist
              </p>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {setupComplete} of 5 complete
              </span>
              <div className="flex-1 max-w-[200px]">
                <Progress value={(setupComplete / 5) * 100} className="h-1.5" />
              </div>
            </div>
            <button
              type="button"
              data-ocid="dashboard.setup_checklist.close_button"
              onClick={dismissSetup}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              aria-label="Dismiss checklist"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {SETUP_ITEMS.map((item, i) => (
              <div
                key={item.tab}
                data-ocid={`dashboard.setup_checklist.item.${i + 1}`}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors"
              >
                <button
                  type="button"
                  data-ocid={`dashboard.setup_checklist.checkbox.${i + 1}`}
                  onClick={() => toggleSetupItem(i)}
                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-sm border-2 transition-all"
                  style={{
                    borderColor: setupChecked[i]
                      ? "var(--primary)"
                      : "var(--border)",
                    background: setupChecked[i]
                      ? "var(--primary)"
                      : "transparent",
                  }}
                  aria-label={`${setupChecked[i] ? "Uncheck" : "Check"} ${item.label}`}
                >
                  {setupChecked[i] && (
                    <svg
                      className="w-3 h-3 text-primary-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                <span
                  className={`text-sm flex-1 transition-colors ${setupChecked[i] ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  {item.label}
                </span>
                <button
                  type="button"
                  data-ocid={`dashboard.setup_checklist.settings.button.${i + 1}`}
                  onClick={() => onNavigate?.("settings")}
                  className="text-xs text-primary hover:underline font-medium flex-shrink-0 transition-colors"
                >
                  Configure →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Onboarding hint for new users */}
      {!activePatient && !onboardingDismissed && (
        <div className="flex items-start justify-between gap-3 bg-primary/5 border border-primary/20 rounded-sm p-3 mb-2">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Getting started:</span> Select a
            patient from the{" "}
            <button
              type="button"
              onClick={() => onNavigate?.("patients")}
              className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
            >
              Patients list
            </button>{" "}
            to unlock clinical workflows, chart tabs, and encounter tools.
          </p>
          <button
            type="button"
            onClick={dismissOnboarding}
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-0.5"
            aria-label="Dismiss"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
      {hasCriticals && (
        <div
          className="bg-destructive/10 border border-destructive/30 px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:bg-destructive/15 transition-colors"
          data-ocid="dashboard.critical.error_state"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onNavigate?.("labs");
          }}
          onClick={() => onNavigate?.("labs")}
        >
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
          <span className="text-sm font-semibold text-destructive">
            {criticalCount} Critical Lab Result{criticalCount !== 1 ? "s" : ""}{" "}
            Require Immediate Attention
          </span>
          <span className="ml-auto text-xs text-destructive/70 underline">
            View in Lab Results →
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard
          ocid="dashboard.patients.card"
          title="Total Patients"
          value={loading ? "\u2014" : totalPatients}
          sub="registered in system"
          icon={Users}
          iconClass="text-muted-foreground"
          onClick={() => onNavigate?.("patients")}
        />
        <StatCard
          ocid="dashboard.appointments.card"
          title="Today's Appointments"
          value={loading ? "\u2014" : todayAppts.length}
          sub="scheduled for today"
          icon={CalendarDays}
          iconClass="text-muted-foreground"
          onClick={() => onNavigate?.("appointments")}
        />
        <StatCard
          ocid="dashboard.critical_labs.card"
          title="Critical Results"
          value={loading ? "\u2014" : criticalCount}
          sub="unreviewed"
          icon={FlaskConical}
          iconClass="text-destructive"
          valueClass={hasCriticals ? "text-destructive" : "text-foreground"}
          onClick={() => onNavigate?.("labs")}
        />
        <StatCard
          ocid="dashboard.pending_orders.card"
          title="Pending Orders"
          value={loading ? "\u2014" : pendingOrders}
          sub="awaiting fulfillment"
          icon={ClipboardList}
          iconClass="text-warning"
          valueClass={
            !loading && pendingOrders !== "\u2014" && pendingOrders > 0
              ? "text-warning"
              : "text-foreground"
          }
          onClick={() => onNavigate?.("pharmacy")}
        />
        <StatCard
          ocid="dashboard.invoices.card"
          title="Pending Invoices"
          value={loading ? "\u2014" : pendingInvoices}
          sub="unpaid"
          icon={Receipt}
          iconClass="text-muted-foreground"
          onClick={() => onNavigate?.("billing")}
        />
      </div>

      {/* Today at a Glance — Doctor / Nurse context strip */}
      {(role === "Doctor" || role === "Nurse") && !loading && (
        <div className="flex gap-2 flex-wrap" data-ocid="smart-context-strip">
          {role === "Doctor" && (
            <>
              <button
                type="button"
                onClick={() => onNavigate?.("appointments")}
                className="text-xs font-medium px-3 py-1.5 rounded border bg-card hover:bg-muted/40 flex items-center gap-1.5 transition-colors shadow-card border-border"
                data-ocid="smart-context-strip.appointments.button"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-primary" />
                <span className="tabular-nums font-semibold">
                  {todayAppts.length}
                </span>
                <span className="text-muted-foreground">
                  Appointments Today
                </span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("results-inbox")}
                className="text-xs font-medium px-3 py-1.5 rounded border bg-card hover:bg-muted/40 flex items-center gap-1.5 transition-colors shadow-card border-border"
                data-ocid="smart-context-strip.results.button"
              >
                <FlaskConical
                  className={`w-3.5 h-3.5 ${allCriticalCount > 0 ? "text-destructive" : "text-muted-foreground"}`}
                />
                <span
                  className={`tabular-nums font-semibold ${allCriticalCount > 0 ? "text-destructive" : ""}`}
                >
                  {allCriticalCount}
                </span>
                <span className="text-muted-foreground">Pending Results</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("messages")}
                className="text-xs font-medium px-3 py-1.5 rounded border bg-card hover:bg-muted/40 flex items-center gap-1.5 transition-colors shadow-card border-border"
                data-ocid="smart-context-strip.messages.button"
              >
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span className="tabular-nums font-semibold">
                  {
                    MOCK_NOTIFICATIONS.filter(
                      (n) => !n.read && n.type === "message",
                    ).length
                  }
                </span>
                <span className="text-muted-foreground">Unread Messages</span>
              </button>
            </>
          )}
          {role === "Nurse" && (
            <button
              type="button"
              onClick={() => onNavigate?.("mar")}
              className={`text-xs font-medium px-3 py-1.5 rounded border bg-card hover:bg-muted/40 flex items-center gap-1.5 transition-colors shadow-card ${
                typeof pendingOrders === "number" && pendingOrders > 0
                  ? "border-warning text-warning"
                  : "border-border"
              }`}
              data-ocid="smart-context-strip.overdue.button"
            >
              <Pill
                className={`w-3.5 h-3.5 ${typeof pendingOrders === "number" && pendingOrders > 0 ? "text-warning" : "text-muted-foreground"}`}
              />
              <span
                className={`tabular-nums font-semibold ${typeof pendingOrders === "number" && pendingOrders > 0 ? "text-warning" : ""}`}
              >
                {typeof pendingOrders === "number" ? pendingOrders : 0}
              </span>
              <span className="text-muted-foreground">Medications Overdue</span>
            </button>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <Card
        className="border border-border shadow-card bg-card"
        data-ocid="dashboard.quick_actions.card"
      >
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  type="button"
                  data-ocid={`dashboard.quick_actions.button.${i + 1}`}
                  onClick={() => onNavigate?.(action.page)}
                  className="flex flex-col items-center gap-2 px-5 py-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/40 transition-all min-w-[96px] group"
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${action.bg} transition-all group-hover:opacity-90 group-hover:scale-110`}
                  >
                    <Icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <span className="text-xs font-medium text-foreground leading-tight text-center">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Provider Task List — Doctor/Nurse only */}
      {(role === "Doctor" || role === "Nurse") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card
            className="border border-border shadow-card bg-card lg:col-span-2"
            data-ocid="dashboard.tasks.card"
          >
            <CardHeader className="px-4 py-3 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Pending Tasks
                </CardTitle>
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-sm text-xs font-bold bg-destructive text-destructive-foreground leading-none">
                  {PROVIDER_TASKS.length}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {PROVIDER_TASKS.map((task, i) => {
                  const Icon = task.icon;
                  return (
                    <div
                      key={task.id}
                      data-ocid={`dashboard.tasks.item.${i + 1}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => onNavigate?.(task.page)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          onNavigate?.(task.page);
                      }}
                    >
                      <span className="flex-shrink-0 w-7 h-7 rounded bg-muted flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      </span>
                      <p className="flex-1 text-sm text-foreground">
                        {task.description}
                      </p>
                      <StatusBadge
                        variant={taskPriorityVariant[task.priority]}
                        label={task.priority}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Today's Activity — Doctor only */}
          {role === "Doctor" && (
            <Card
              className="border border-border shadow-card bg-card"
              data-ocid="dashboard.activity_summary.card"
            >
              <CardHeader className="px-4 py-3 border-b border-border">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Today&apos;s Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Patients Seen", value: 4 },
                    { label: "Notes Signed", value: 3 },
                    { label: "Orders Placed", value: 7 },
                    { label: "Prescriptions Sent", value: 5 },
                  ].map((stat, i) => (
                    <div
                      key={stat.label}
                      data-ocid={`dashboard.activity_summary.item.${i + 1}`}
                      className="bg-muted/40 rounded-lg p-3 text-center"
                    >
                      <p className="text-2xl font-bold tabular-nums text-foreground leading-none">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-tight">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* My Performance — Doctor only */}
      {role === "Doctor" &&
        (() => {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const weekStart = oneWeekAgo.toISOString().slice(0, 10);
          const encountersThisWeek =
            todayAppts.filter((a) => a.date >= weekStart).length + 5;
          const rvus = (encountersThisWeek * 2.4).toFixed(1);
          const openTasks = todayAppts.filter(
            (a) => a.status === "scheduled" || a.status === "pending",
          ).length;
          const performanceStats = [
            {
              label: "Encounters This Week",
              value: String(encountersThisWeek),
            },
            { label: "RVUs Generated", value: rvus },
            { label: "Avg Encounter Time", value: "24 min" },
            { label: "Open Tasks", value: String(openTasks) },
          ];
          return (
            <Card
              className="border border-border shadow-card bg-card"
              data-ocid="dashboard.my_performance.card"
            >
              <CardHeader className="px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    My Performance{(() => {
                      try {
                        const p = JSON.parse(
                          localStorage.getItem("medunite_prefs_Doctor") || "{}",
                        );
                        return p.specialty ? ` · ${p.specialty}` : "";
                      } catch {
                        return "";
                      }
                    })()}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    This week
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {performanceStats.map((stat, i) => (
                    <div
                      key={stat.label}
                      data-ocid={`dashboard.my_performance.item.${i + 1}`}
                      className="bg-muted/40 rounded-lg p-3 text-center"
                    >
                      <p className="text-lg font-bold tabular-nums text-foreground leading-none">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-tight">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Schedule */}
        <Card className="border border-border shadow-card bg-card">
          <CardHeader className="px-4 py-3 border-b border-border">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Today&apos;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div
                className="p-4 space-y-2"
                data-ocid="dashboard.schedule.loading_state"
              >
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
              </div>
            ) : todayAppts.length === 0 ? (
              <p
                className="text-sm text-muted-foreground text-center py-8"
                data-ocid="dashboard.schedule.empty_state"
              >
                No appointments scheduled today
              </p>
            ) : (
              <div className="divide-y divide-border">
                {todayAppts.map((a, i) => {
                  const time = a.date.includes("T")
                    ? a.date.split("T")[1].substring(0, 5)
                    : "--:--";
                  return (
                    <div
                      key={String(a.id)}
                      data-ocid={`dashboard.schedule.item.${i + 1}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          onNavigate?.("appointments");
                      }}
                      onClick={() => onNavigate?.("appointments")}
                    >
                      <span className="font-mono text-xs text-muted-foreground w-10 flex-shrink-0 tabular-nums">
                        {time}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">
                          {patientNames[String(a.patientId)] ??
                            `Patient #${a.patientId}`}
                        </p>
                      </div>
                      <StatusBadge
                        variant={scheduleStatusVariant[a.status] ?? "neutral"}
                        label={a.status}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Critical Lab Alerts */}
        <Card className="border border-border shadow-card bg-card">
          <CardHeader className="px-4 py-3 border-b border-border">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Critical Lab Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div
                className="p-4 space-y-2"
                data-ocid="dashboard.criticals.loading_state"
              >
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
              </div>
            ) : criticalLabs.length === 0 ? (
              <p
                className="text-sm text-muted-foreground text-center py-8"
                data-ocid="dashboard.criticals.empty_state"
              >
                No critical results pending
              </p>
            ) : (
              <div className="divide-y divide-border">
                {criticalLabs.map((lab, i) => (
                  <div
                    key={String(lab.id)}
                    data-ocid={`dashboard.criticals.item.${i + 1}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        onNavigate?.("labs");
                    }}
                    onClick={() => onNavigate?.("labs")}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-foreground">
                        {lab.testName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-primary hover:underline">
                          {patientNames[String(lab.patientId)] ??
                            `Patient #${lab.patientId}`}
                        </span>
                        {" \u00b7 "}
                        <span className="font-mono">
                          {lab.result} {lab.unit}
                        </span>
                      </p>
                    </div>
                    <StatusBadge variant="danger" label="Critical" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card
        className="border border-border shadow-card bg-card"
        data-ocid="dashboard.activity.card"
      >
        <CardHeader className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Recent Activity
            </CardTitle>
            <button
              type="button"
              data-ocid="dashboard.activity.view_all.button"
              onClick={() => onNavigate?.("audit")}
              className="text-xs text-primary hover:underline font-medium"
            >
              View All
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {logsLoading ? (
            <div
              className="p-4 space-y-2"
              data-ocid="dashboard.activity.loading_state"
            >
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-5/6" />
            </div>
          ) : auditLogs.length === 0 ? (
            <p
              className="text-sm text-muted-foreground text-center py-8"
              data-ocid="dashboard.activity.empty_state"
            >
              No recent activity
            </p>
          ) : (
            <div className="divide-y divide-border">
              {auditLogs.map((log, i) => (
                <div
                  key={String(log.id)}
                  data-ocid={`dashboard.activity.item.${i + 1}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors"
                >
                  <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded border bg-muted text-muted-foreground border-border flex-shrink-0">
                    {log.entityType}
                  </span>
                  <p className="flex-1 text-sm text-foreground truncate">
                    {log.action}
                  </p>
                  <span className="text-xs text-muted-foreground flex-shrink-0 tabular-nums">
                    {relativeTime(log.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Volume Chart */}
      <AppointmentVolumeChart />
    </div>
  );
}

const WEEKLY_DATA = [
  { label: "Mon", count: 5 },
  { label: "Tue", count: 8 },
  { label: "Wed", count: 4 },
  { label: "Thu", count: 9 },
  { label: "Fri", count: 6 },
  { label: "Sat", count: 3 },
  { label: "Sun", count: 7 },
];

const _currentMonthLabel = new Date().toLocaleString("default", {
  month: "short",
});
const MONTHLY_DATA = Array.from({ length: 30 }, (_, i) => ({
  label: `${_currentMonthLabel} ${i + 1}`,
  count:
    [
      8, 5, 11, 7, 9, 12, 6, 10, 8, 14, 7, 9, 11, 5, 8, 13, 10, 6, 9, 12, 7, 11,
      8, 15, 9, 7, 10, 13, 8, 11,
    ][i] ?? 8,
}));

const TOP_PROVIDERS = [
  { name: "Dr. Emily Carter", specialty: "Internal Medicine", count: 24 },
  { name: "Dr. Michael Ross", specialty: "Cardiology", count: 18 },
  { name: "Dr. Sarah Kim", specialty: "Pediatrics", count: 15 },
];

function AppointmentVolumeChart() {
  const [view, setView] = React.useState<"weekly" | "monthly">("weekly");
  const data = view === "weekly" ? WEEKLY_DATA : MONTHLY_DATA;

  return (
    <div className="space-y-4">
      {/* Top Providers */}
      <Card
        className="border border-border shadow-card bg-card"
        data-ocid="dashboard.top_providers.card"
      >
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Top Providers This Week
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {TOP_PROVIDERS.map((p, i) => (
            <div
              key={p.name}
              data-ocid={`dashboard.top_providers.item.${i + 1}`}
              className="flex items-center gap-3 px-4 py-2.5 border-b border-border last:border-0"
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground bg-primary flex-shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {p.name}
                </p>
                <p className="text-xs text-muted-foreground">{p.specialty}</p>
              </div>
              <span className="text-sm font-bold tabular-nums text-foreground">
                {p.count}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appointment Volume Chart with toggle */}
      <Card
        className="border border-border shadow-card bg-card"
        data-ocid="dashboard.volume_chart.card"
      >
        <CardHeader className="px-4 py-3 border-b border-border flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Appointment Volume
          </CardTitle>
          <div className="flex rounded overflow-hidden border border-border">
            <button
              type="button"
              data-ocid="dashboard.volume_chart.weekly.toggle"
              onClick={() => setView("weekly")}
              className={`px-2.5 py-0.5 text-xs transition-colors ${view === "weekly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
            >
              Weekly
            </button>
            <button
              type="button"
              data-ocid="dashboard.volume_chart.monthly.toggle"
              onClick={() => setView("monthly")}
              className={`px-2.5 py-0.5 text-xs transition-colors ${view === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
            >
              Monthly
            </button>
          </div>
        </CardHeader>
        <CardContent className="px-4 py-4">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={data}
              barSize={view === "weekly" ? 28 : 8}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="label"
                tick={{
                  fontSize: view === "weekly" ? 11 : 9,
                  fill: "var(--muted-foreground)",
                }}
                axisLine={false}
                tickLine={false}
                interval={view === "monthly" ? 6 : 0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                domain={[0, "auto"]}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  fontSize: 12,
                }}
                cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                formatter={(value: number) => [value, "Appointments"]}
              />
              <Bar
                dataKey="count"
                fill="var(--chart-1)"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
