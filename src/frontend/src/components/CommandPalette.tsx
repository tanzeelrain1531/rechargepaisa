import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DEMO_CLINICAL_NOTES,
  DEMO_LAB_RESULTS,
  DEMO_PATIENTS,
  DEMO_PRESCRIPTIONS,
} from "@/demoData";
import {
  BarChart2,
  BedDouble,
  CalendarDays,
  ClipboardList,
  FileCheck,
  FlaskConical,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Pill,
  Receipt,
  Scan,
  Settings,
  ShieldCheck,
  Syringe,
  User,
  Users,
} from "lucide-react";
import { useEffect, useRef } from "react";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onSelectPatient: (patient: {
    id: bigint;
    name: string;
    mrn: string;
    dateOfBirth: string;
  }) => void;
  patients: Array<{
    id: bigint;
    name: string;
    mrn: string;
    dateOfBirth: string;
  }>;
}

const PAGES = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "patients", label: "Patients", icon: Users },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "labs", label: "Lab Results", icon: FlaskConical },
  { id: "imaging", label: "Imaging", icon: Scan },
  { id: "pharmacy", label: "Pharmacy", icon: Syringe },
  { id: "referrals", label: "Referrals", icon: User },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "results-inbox", label: "Results Inbox", icon: Inbox },
  { id: "reporting", label: "Reporting", icon: BarChart2 },
  { id: "billing", label: "Billing", icon: Receipt },
  { id: "claims", label: "Claims", icon: FileCheck },
  { id: "inpatient", label: "Inpatient / Wards", icon: BedDouble },
  { id: "prior-auth", label: "Prior Authorization", icon: ShieldCheck },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function CommandPalette({
  open,
  onClose,
  onNavigate,
  onSelectPatient,
  patients,
}: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      data-ocid="command_palette.modal"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        role="presentation"
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg mx-4 rounded-lg border border-border bg-card shadow-2xl overflow-hidden"
        aria-modal="true"
        aria-label="Command Palette"
      >
        <Command className="rounded-lg">
          <CommandInput
            ref={inputRef}
            placeholder="Search patients and pages..."
            data-ocid="command_palette.search_input"
            className="border-0 focus:ring-0"
          />
          <CommandList className="max-h-[360px]">
            <CommandEmpty>
              <span className="text-sm text-muted-foreground">
                No results found.
              </span>
            </CommandEmpty>

            {patients.length > 0 && (
              <CommandGroup heading="Patients">
                {patients.map((patient, i) => (
                  <CommandItem
                    key={String(patient.id)}
                    value={`patient ${patient.name} ${patient.mrn}`}
                    data-ocid={`command_palette.patient.item.${i + 1}`}
                    onSelect={() => {
                      onSelectPatient(patient);
                      onNavigate("patients");
                      onClose();
                    }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {patient.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {patient.mrn} · DOB {patient.dateOfBirth}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            <CommandGroup heading="Go to">
              {PAGES.map((page, i) => {
                const Icon = page.icon;
                return (
                  <CommandItem
                    key={page.id}
                    value={`page ${page.label}`}
                    data-ocid={`command_palette.page.item.${i + 1}`}
                    onSelect={() => {
                      onNavigate(page.id);
                      onClose();
                    }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-foreground">
                      {page.label}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {/* Encounters */}
            <CommandGroup heading="Recent Encounters">
              {DEMO_CLINICAL_NOTES.slice(0, 5).map((note, i) => {
                const patient = DEMO_PATIENTS.find(
                  (p) => String(p.id) === String(note.patientId),
                );
                return (
                  <CommandItem
                    key={String(note.id)}
                    value={`encounter ${patient?.name ?? ""} ${note.noteType}`}
                    data-ocid={`command_palette.encounter.item.${i + 1}`}
                    onSelect={() => {
                      onNavigate("notes");
                      onClose();
                    }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {note.noteType || "Clinical Note"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {patient?.name ?? "Unknown Patient"}
                      </p>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {/* Lab Results */}
            <CommandGroup heading="Lab Results">
              {DEMO_LAB_RESULTS.filter((r) => r.isCritical)
                .slice(0, 5)
                .map((lab, i) => {
                  const patient = DEMO_PATIENTS.find(
                    (p) => String(p.id) === String(lab.patientId),
                  );
                  return (
                    <CommandItem
                      key={String(lab.id)}
                      value={`lab ${patient?.name ?? ""} ${lab.testName} ${lab.result}`}
                      data-ocid={`command_palette.lab.item.${i + 1}`}
                      onSelect={() => {
                        onNavigate("labs");
                        onClose();
                      }}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <FlaskConical className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {lab.testName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {patient?.name ?? "Unknown"} · {lab.result} {lab.unit}
                          {lab.isCritical ? " · ⚠ Critical" : ""}
                        </p>
                      </div>
                    </CommandItem>
                  );
                })}
            </CommandGroup>

            {/* Orders (Prescriptions) */}
            <CommandGroup heading="Recent Orders">
              {DEMO_PRESCRIPTIONS.slice(0, 5).map((rx, i) => {
                const patient = DEMO_PATIENTS.find(
                  (p) => String(p.id) === String(rx.patientId),
                );
                return (
                  <CommandItem
                    key={String(rx.id)}
                    value={`order ${patient?.name ?? ""} ${rx.medication}`}
                    data-ocid={`command_palette.order.item.${i + 1}`}
                    onSelect={() => {
                      onNavigate("pharmacy");
                      onClose();
                    }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                      <Pill className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {rx.medication}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {patient?.name ?? "Unknown"} · {rx.dose} · {rx.status}
                      </p>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>

        {/* Hint footer */}
        <div className="px-3 py-2 border-t border-border flex items-center gap-3 bg-muted/30">
          <span className="text-xs text-muted-foreground font-mono">
            ↑↓ navigate
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            ↵ select
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            Esc close
          </span>
        </div>
      </div>
    </div>
  );
}
