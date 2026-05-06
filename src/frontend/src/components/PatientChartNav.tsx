import { cn } from "@/lib/utils";
import { ClipboardList, History, Play } from "lucide-react";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { DEMO_ALLERGIES } from "../demoData";

interface PatientChartNavProps {
  patient: { id: bigint; name: string; mrn: string; dateOfBirth: string };
  currentPage: string;
  onNavigate: (page: string) => void;
  onClear: () => void;
}

const TABS = [
  { label: "Summary", page: "patient-chart", icon: null },
  { label: "Notes", page: "notes", icon: null },
  { label: "Medications", page: "medications", icon: null },
  { label: "Labs", page: "labs", icon: null },
  { label: "Orders", page: "orders", icon: null },
  { label: "Imaging", page: "imaging", icon: null },
  { label: "Billing", page: "billing", icon: null },
  { label: "Problem List", page: "problem-list", icon: null },
  { label: "Consents", page: "consents", icon: null },
  { label: "Safety", page: "safety", icon: null },
  { label: "Directives", page: "advance-directives", icon: null },
  { label: "Reconcile", page: "medication-reconciliation", icon: null },
  { label: "Timeline", page: "patient-timeline", icon: History },
  { label: "Encounters", page: "patient-encounters", icon: ClipboardList },
  { label: "Encounter", page: "encounter", icon: Play },
  { label: "Vitals", page: "patient-vitals", icon: null },
  { label: "Allergies", page: "patient-allergies", icon: null },
  { label: "Care Gaps", page: "patient-care-gaps", icon: null },
  { label: "Team Notes", page: "patient-team-notes", icon: null },
  { label: "Documents", page: "patient-documents", icon: null },
];

function calcAge(dob: string): number | string {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return "?";
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (now < new Date(now.getFullYear(), d.getMonth(), d.getDate())) age--;
  return age;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PatientChartNav({
  patient,
  currentPage,
  onNavigate,
  onClear,
}: PatientChartNavProps) {
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const el = tabRefs.current.get(currentPage);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [currentPage]);

  const age = calcAge(patient.dateOfBirth);
  const allergyCount = DEMO_ALLERGIES.filter(
    (a) => a.patientId === patient.id,
  ).length;

  return (
    <div
      data-ocid="patient_chart_nav.panel"
      className="flex-shrink-0 border-b border-border border-l-[3px] border-l-primary h-11 flex items-stretch"
    >
      {/* Left: patient identity — fixed ~280px */}
      <div className="flex items-center gap-2 px-3 bg-primary/5 flex-shrink-0 w-[280px] border-r border-border">
        <div
          className="w-6 h-6 rounded-sm flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0 bg-primary"
          aria-hidden="true"
        >
          {initials(patient.name)}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <button
            type="button"
            data-ocid="patient_chart_nav.name.button"
            onClick={() => onNavigate("patient-chart")}
            className="text-sm font-semibold text-foreground leading-tight truncate text-left hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {patient.name}
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground truncate">
              MRN {patient.mrn} · {age}y
            </span>
            {allergyCount > 0 ? (
              <span className="inline-flex items-center px-1.5 py-px rounded-sm text-[10px] font-semibold flex-shrink-0 bg-warning/20 text-warning-foreground border border-warning/30 leading-none">
                {allergyCount}A
              </span>
            ) : (
              <span className="inline-flex items-center px-1.5 py-px rounded-sm text-[10px] font-semibold flex-shrink-0 bg-success/10 text-success border border-success/20 leading-none">
                NKDA
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          data-ocid="patient_chart_nav.close_button"
          onClick={onClear}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 rounded-sm hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label="Clear active patient"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: scrollable tab strip */}
      <div className="relative flex-1 min-w-0">
        <div className="flex items-end overflow-x-auto bg-card scrollbar-none h-full">
          {TABS.map((tab) => {
            const isActive = currentPage === tab.page;
            const isEncounter = tab.label === "Encounter";
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.label}
                type="button"
                ref={(el) => {
                  if (el) tabRefs.current.set(tab.page, el);
                  else tabRefs.current.delete(tab.page);
                }}
                data-ocid={`patient_chart_nav.${tab.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}.tab`}
                onClick={() => onNavigate(tab.page)}
                className={cn(
                  "inline-flex items-center gap-1 px-3.5 h-full text-xs font-medium transition-all flex-shrink-0 border-b-2 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isActive
                    ? "text-primary border-primary bg-primary/5"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/40",
                  isEncounter && !isActive
                    ? "font-semibold text-primary/70 border-transparent hover:border-primary/30"
                    : "",
                )}
              >
                {IconComponent && (
                  <IconComponent className="w-3 h-3 flex-shrink-0" />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
