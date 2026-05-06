import { Activity, Calendar, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
type PortalPage = string;

type NavGroup = {
  label: string;
  links: { id: PortalPage; label: string }[];
};

const navGroups: NavGroup[] = [
  {
    label: "Primary",
    links: [
      { id: "portal-appointments", label: "Appointments" },
      { id: "portal-records", label: "Health Records" },
      { id: "portal-messages", label: "Messages" },
    ],
  },
  {
    label: "Health",
    links: [
      { id: "portal-symptoms", label: "Pre-Visit Intake" },
      { id: "portal-prescriptions", label: "My Prescriptions" },
      { id: "portal-vitals", label: "My Vitals" },
      { id: "portal-billing", label: "Billing & Payments" },
    ],
  },
  {
    label: "Settings",
    links: [
      { id: "portal-mydata", label: "My Data" },
      { id: "portal-privacy", label: "Privacy Controls" },
      { id: "portal-profile", label: "My Profile" },
    ],
  },
];

// Flat list for backward compat
const navLinks = navGroups.flatMap((g) => g.links);

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function WelcomeBanner({
  patientName,
  setPage,
}: {
  patientName: string;
  setPage: (p: PortalPage) => void;
}) {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    const s = localStorage.getItem("portal-welcome-dismissed");
    return s ? Date.now() < Number(s) : false;
  });

  if (dismissed) return null;

  const firstName = patientName.split(" ")[0] ?? "there";

  const actions: {
    label: string;
    sub: string;
    icon: React.ElementType;
    page: PortalPage;
    ocid: string;
  }[] = [
    {
      label: "Book an Appointment",
      sub: "Schedule with your provider",
      icon: Calendar,
      page: "portal-appointments",
      ocid: "portal.welcome.appointments.button",
    },
    {
      label: "Message Your Provider",
      sub: "Secure, private messaging",
      icon: MessageSquare,
      page: "portal-messages",
      ocid: "portal.welcome.messages.button",
    },
    {
      label: "View Your Results",
      sub: "Lab results and reports",
      icon: Activity,
      page: "portal-labs",
      ocid: "portal.welcome.labs.button",
    },
  ];

  return (
    <div
      className="border border-border rounded-sm bg-card mb-6"
      data-ocid="portal.welcome.card"
    >
      <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-foreground">
            Welcome to your health portal
            {firstName !== "there" ? `, ${firstName}` : ""}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your health in one place — appointments, records, messages,
            and more.
          </p>
        </div>
        <button
          type="button"
          data-ocid="portal.welcome.close_button"
          onClick={() => {
            localStorage.setItem(
              "portal-welcome-dismissed",
              String(Date.now() + 30 * 24 * 60 * 60 * 1000),
            );
            setDismissed(true);
          }}
          className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-0.5"
          aria-label="Dismiss welcome banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.page}
              type="button"
              data-ocid={action.ocid}
              onClick={() => setPage(action.page)}
              className="flex items-center gap-3 px-5 py-4 bg-card hover:bg-muted/30 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0 bg-primary/10">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {action.label}
                </p>
                <p className="text-xs text-muted-foreground">{action.sub}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PatientPortalLayout({
  page,
  setPage,
  children,
  onLogout,
  patientName = "Patient",
  onSwitchPatient,
}: {
  page: PortalPage;
  setPage: (p: PortalPage) => void;
  children: ReactNode;
  onLogout: () => void;
  patientName?: string;
  onSwitchPatient?: () => void;
}) {
  const initials = getInitials(patientName);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top nav */}
      <header className="h-14 flex-shrink-0 flex items-center px-6 gap-6 bg-sidebar border-b border-sidebar-border">
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
            <img
              src="/assets/generated/medunite-logo-transparent.dim_48x48.png"
              alt="MedUnite"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight leading-none text-sidebar-foreground">
              MedUnite
            </p>
            <p className="text-xs mt-0.5 tracking-wider text-white/50">
              Patient Portal
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 flex-shrink-0 bg-white/10" />

        {/* Nav links grouped */}
        <div className="relative flex-1 min-w-0">
          <nav
            className="flex items-center gap-0.5 overflow-x-auto scrollbar-none"
            data-ocid="portal.nav.panel"
          >
            {navGroups.map((group, gi) => (
              <div key={group.label} className="flex items-center gap-0">
                {/* Group separator (not before first group) */}
                {gi > 0 && (
                  <div className="flex items-center mx-2 flex-shrink-0">
                    <div className="w-px h-5 bg-white/20" />
                  </div>
                )}
                <div className="flex flex-col gap-0 flex-shrink-0">
                  <span className="text-xs font-semibold text-white/35 uppercase tracking-widest px-1 pb-0.5 leading-none">
                    {group.label}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {group.links.map(({ id, label }) => {
                      const isActive = page === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          data-ocid={`portal.nav.${id.replace("portal-", "")}.link`}
                          onClick={() => setPage(id)}
                          className={[
                            "px-3 py-1.5 text-sm font-medium rounded-sm transition-all flex-shrink-0",
                            isActive
                              ? "bg-white/20 text-white font-semibold"
                              : "text-white/60 bg-transparent hover:text-white hover:bg-white/10",
                          ].join(" ")}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </nav>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-sidebar to-transparent pointer-events-none" />
        </div>

        {/* Patient info + logout */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center rounded-sm text-primary-foreground text-xs font-bold flex-shrink-0 bg-primary">
              {initials}
            </div>
            <div>
              <p className="text-xs font-semibold leading-none text-sidebar-foreground">
                {patientName}
              </p>
              <p className="text-xs mt-0.5 text-white/50">Patient</p>
            </div>
          </div>

          <div className="w-px h-5 bg-white/10" />

          {onSwitchPatient && (
            <button
              type="button"
              data-ocid="portal.switch_patient.button"
              onClick={onSwitchPatient}
              className="flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-medium transition-all text-white/60 hover:text-white"
            >
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Switch
            </button>
          )}

          <button
            type="button"
            data-ocid="portal.logout.button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-all text-white/60 border border-white/15 hover:text-white hover:border-white/40"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <WelcomeBanner patientName={patientName} setPage={setPage} />
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="h-9 flex items-center justify-center border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} MedUnite. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export { navLinks };
