import { AllergiesTab } from "@/components/chart/AllergiesTab";
import { CareGapsTab } from "@/components/chart/CareGapsTab";
import { EncounterTab } from "@/components/chart/EncounterTab";
import { PatientSummaryTab } from "@/components/chart/PatientSummaryTab";
import { VitalsTab } from "@/components/chart/VitalsTab";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  Brain,
  CalendarCheck,
  ClipboardList,
  FileText,
  FlaskConical,
  History,
  Lock,
  Pill,
  Play,
  Printer,
  Shield,
  StickyNote,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import AdvanceDirectives from "./AdvanceDirectives";
import Billing from "./Billing";
import CaregiversTab from "./CaregiversTab";
import ClinicalNotes from "./ClinicalNotes";
import ClinicalOrders from "./ClinicalOrders";
import ConsentsPage from "./ConsentsPage";
import Imaging from "./Imaging";
import LabResults from "./LabResults";
import MedicationReconciliation from "./MedicationReconciliation";
import Medications from "./Medications";
import MentalHealth from "./MentalHealth";
import PatientEncounters from "./PatientEncounters";
import PatientTimeline from "./PatientTimeline";
import ProblemList from "./ProblemList";
import SafetyPage from "./SafetyPage";
import TeamNotes from "./TeamNotes";

interface PatientChartProps {
  activePatient: {
    id: bigint;
    name: string;
    mrn: string;
    dateOfBirth: string;
  };
  onNavigate: (page: string) => void;
  onStartEncounter: () => void;
  initialTab?: string;
}

const CHART_TABS = [
  { key: "summary", label: "Summary", icon: Activity },
  { key: "vitals", label: "Vitals", icon: Activity },
  { key: "notes", label: "Notes", icon: FileText },
  { key: "medications", label: "Medications", icon: Pill },
  { key: "allergies", label: "Allergies", icon: AlertTriangle },
  { key: "labs", label: "Labs", icon: FlaskConical },
  { key: "orders", label: "Orders", icon: ClipboardList },
  { key: "imaging", label: "Imaging", icon: null },
  { key: "billing", label: "Billing", icon: null },
  { key: "problem-list", label: "Problem List", icon: null },
  { key: "care-gaps", label: "Care Gaps", icon: CalendarCheck },
  { key: "consents", label: "Consents", icon: Shield },
  { key: "safety", label: "Safety", icon: AlertTriangle },
  { key: "directives", label: "Directives", icon: null },
  { key: "reconcile", label: "Reconcile", icon: null },
  { key: "timeline", label: "Timeline", icon: History },
  { key: "encounters", label: "Encounters", icon: ClipboardList },
  { key: "encounter", label: "Encounter", icon: Play },
  { key: "team-notes", label: "Team Notes", icon: StickyNote },
  { key: "mental-health", label: "Mental Health", icon: Brain },
  { key: "caregivers", label: "Caregivers", icon: Users },
] as const;

type ChartTab = (typeof CHART_TABS)[number]["key"];

export default function PatientChart({
  activePatient,
  onNavigate,
  onStartEncounter,
  initialTab,
}: PatientChartProps) {
  const [activeTab, setActiveTab] = useState<ChartTab>(
    (initialTab as ChartTab) ?? "summary",
  );

  // Consent state from localStorage
  const [restrictedCategories, setRestrictedCategories] = useState<Set<string>>(
    new Set(),
  );
  useEffect(() => {
    try {
      const patId = Number(activePatient.id);
      const raw = localStorage.getItem(`medunite_consent_${patId}`);
      if (raw) {
        const consent = JSON.parse(raw) as Record<string, boolean>;
        const restricted = new Set<string>();
        if (consent.labs === false) restricted.add("labs");
        if (consent.medications === false) restricted.add("medications");
        if (consent.vitals === false) restricted.add("vitals");
        if (consent.billing === false) restricted.add("billing");
        setRestrictedCategories(restricted);
      }
    } catch {
      // ignore
    }
  }, [activePatient.id]);

  // Map tab key to consent category
  const TAB_CONSENT_MAP: Record<string, string> = {
    labs: "labs",
    medications: "medications",
    vitals: "vitals",
    billing: "billing",
  };

  const renderTab = () => {
    switch (activeTab) {
      case "summary":
        return (
          <PatientSummaryTab
            patient={activePatient}
            onStartEncounter={onStartEncounter}
          />
        );
      case "vitals":
        return <VitalsTab patientId={activePatient.id} />;
      case "notes":
        return (
          <ClinicalNotes
            activePatientId={activePatient.id}
            activePatientName={activePatient.name}
          />
        );
      case "medications":
        return (
          <Medications
            activePatientId={activePatient.id}
            activePatientName={activePatient.name}
          />
        );
      case "allergies":
        return <AllergiesTab patientId={activePatient.id} />;
      case "labs":
        return (
          <LabResults
            activePatientId={activePatient.id}
            activePatientName={activePatient.name}
          />
        );
      case "orders":
        return (
          <ClinicalOrders
            activePatientId={activePatient.id}
            activePatientName={activePatient.name}
          />
        );
      case "imaging":
        return (
          <Imaging
            onNavigate={onNavigate}
            activePatientId={activePatient.id}
            activePatientName={activePatient.name}
          />
        );
      case "billing":
        return (
          <Billing
            activePatientId={activePatient.id}
            activePatientName={activePatient.name}
          />
        );
      case "problem-list":
        return (
          <ProblemList
            activePatientId={activePatient.id}
            activePatientName={activePatient.name}
          />
        );
      case "care-gaps":
        return <CareGapsTab patientId={activePatient.id} />;
      case "consents":
        return (
          <ConsentsPage
            activePatientId={activePatient.id}
            activePatientName={activePatient.name}
          />
        );
      case "safety":
        return (
          <SafetyPage
            activePatientId={activePatient.id}
            activePatientName={activePatient.name}
          />
        );
      case "directives":
        return (
          <AdvanceDirectives
            activePatientId={activePatient.id}
            activePatientName={activePatient.name}
          />
        );
      case "reconcile":
        return (
          <MedicationReconciliation
            activePatientId={activePatient.id}
            activePatientName={activePatient.name}
          />
        );
      case "timeline":
        return (
          <PatientTimeline
            activePatientId={activePatient.id}
            activePatientName={activePatient.name}
          />
        );
      case "encounters":
        return (
          <PatientEncounters
            activePatientId={activePatient.id}
            activePatientName={activePatient.name}
            onNavigate={onNavigate}
          />
        );
      case "encounter":
        return <EncounterTab onStartEncounter={onStartEncounter} />;
      case "team-notes":
        return (
          <TeamNotes patientId={activePatient.id} onNavigate={onNavigate} />
        );
      case "mental-health":
        return (
          <MentalHealth
            activePatientId={activePatient.id}
            activePatientName={activePatient.name}
            compact
          />
        );
      case "caregivers":
        return <CaregiversTab activePatientId={activePatient.id} />;
      default:
        return null;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full -m-6" data-ocid="patient_chart.page">
      {/* Print styles */}
      <style>{`
        @media print {
          header, nav, aside, [data-sidebar], [data-ocid="demo_banner"], [data-ocid="session_warning"], [data-ocid="patient_context_banner"],
          [class*="sidebar"], .print-hide { display: none !important; }
          [data-ocid="patient_chart.page"] { margin: 0 !important; height: auto !important; }
          .flex-col.h-full.-m-6 > div:first-child { display: none !important; }
        }
      `}</style>
      {/* Tab strip */}
      <div
        className="flex-shrink-0 border-b border-border bg-card overflow-x-auto scrollbar-none"
        style={{ height: "38px" }}
      >
        <div className="flex items-end h-full justify-between">
          <div className="flex items-end h-full overflow-x-auto scrollbar-none">
            {CHART_TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const isEncounter = tab.key === "encounter";
              const IconComponent = tab.icon;
              const consentKey = TAB_CONSENT_MAP[tab.key];
              const isRestricted = consentKey
                ? restrictedCategories.has(consentKey)
                : false;
              return (
                <button
                  key={tab.key}
                  type="button"
                  data-ocid={`patient_chart.${tab.key.replace(/-/g, "_")}.tab`}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3.5 h-full text-xs font-medium transition-all flex-shrink-0 border-b-2 whitespace-nowrap",
                    isActive
                      ? "text-primary border-primary bg-primary/5"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/40",
                    isEncounter && !isActive
                      ? "font-semibold text-primary/70"
                      : "",
                  )}
                >
                  {IconComponent && (
                    <IconComponent className="w-3 h-3 flex-shrink-0" />
                  )}
                  {tab.label}
                  {isRestricted && (
                    <Lock className="w-3 h-3 text-warning ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center pr-2 flex-shrink-0 h-full">
            <Button
              variant="outline"
              size="sm"
              data-ocid="patient_chart.print_button"
              onClick={handlePrint}
              className="h-7 text-xs gap-1.5 print-hide"
            >
              <Printer className="w-3 h-3" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        {TAB_CONSENT_MAP[activeTab] &&
          restrictedCategories.has(TAB_CONSENT_MAP[activeTab] as string) && (
            <div
              className="mb-4 flex items-start gap-2.5 px-4 py-3 rounded border text-sm"
              style={{
                background: "var(--warning)/10",
                borderColor: "var(--warning)",
                color: "var(--warning)",
              }}
              data-ocid="patient_chart.restriction_banner"
            >
              <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                This patient has restricted provider access to this data
                category. Contact the patient to update their privacy settings.
              </span>
            </div>
          )}
        {renderTab()}
      </div>
    </div>
  );
}
