import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Copy,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
type Role = string;
import { StatusBadge } from "../components/StatusBadge";
import LabIntegration from "./LabIntegration";
import PDMP from "./PDMP";
import SmartPhrases from "./SmartPhrases";
import UserManagement from "./UserManagement";

const MILESTONES = [
  {
    id: 1,
    title: "Milestone 1 — Demo Ready",
    status: "COMPLETE" as const,
    description:
      "Full clinical workflows for all 6 roles, 10 interconnected demo patients, Epic-style inline chart with 18+ tabs, MFA, session timeout, drug interaction engine, patient portal, and telehealth.",
    sprints: [
      "Sprint 1–7: Core EHR modules, patient chart, encounter workflow, pharmacy, billing, inpatient wards",
      "Sprint 8: Backend wiring, privacy controls, roadmap tab",
      "Sprint 9: Mental Health Outcomes, Caregivers tab, portal health risk score",
    ],
    items: [
      "45+ staff pages covering all major EHR modules",
      "13 patient portal pages",
      "Role-based navigation (6 roles)",
      "Full clinical loop: encounter → pharmacy → lab → imaging → billing",
      "38 backend endpoints across 14 entity types",
    ],
  },
  {
    id: 2,
    title: "Milestone 2 — Production Polish",
    status: "COMPLETE" as const,
    description:
      "Systematic elimination of technical debt: design token consistency, typography scale, backend wiring for remaining modules, performance, accessibility, and code quality.",
    sprints: [
      "Sprint 10: Mental Health + Caregivers backend wiring, portal appointments",
      "Sprint 11: Final oklch/color token pass, sub-scale text pass (300+ instances)",
      "Sprint 12: Portal MyMessages backend, prescription refills, LabIntegration patient names",
      "Sprint 13: Portal patient identity fix, stable IDs, text/color final pass",
      "Sprint 14: Navigation fixed (mental-health + caregivers), fake delays removed, flicker fixed",
      "Sprint 15: Portal patient config centralized, card shadows, star hover fixed",
    ],
    items: [
      "All hardcoded oklch literals replaced with design tokens",
      "All sub-12px text raised to readable minimums",
      "All off-palette Tailwind color classes eliminated",
      "Navigation bugs fixed across all roles",
      "Backend wiring for Mental Health, Caregivers, Consents, ResultsInbox",
    ],
  },
  {
    id: 3,
    title: "Milestone 3 — Clinical Depth & UX Quality",
    status: "COMPLETE" as const,
    description:
      "Performance optimisation, mega-file refactoring, onboarding improvements, and a fully functional multi-patient portal.",
    sprints: [
      "Sprint 16: AdvanceDirectives backend, patient list O(1) search, card shadows",
      "Sprint 17: Reporting.tsx split (2607→175 lines), Inpatient/Patients partial extraction",
      "Sprint 18: Inpatient.tsx (2801→90 lines), Patients.tsx (2666→180 lines), React.memo + context providers",
      "Sprint 19: Appointments.tsx (1862→290 lines), PatientChart.tsx (1447→210 lines), 11 sub-components",
      "Sprint 20: as-any casts removed, PrivacyControls cleaned, backend.d.ts typed",
      "Sprint 21: ConsentsTab backend wiring, registration validation, ResultsInbox types clean",
      "Sprint 22: Multi-patient portal (patient selector), sidebar flicker fixed, final color pass",
    ],
    items: [
      "All mega-files refactored (Inpatient 90 lines, Patients 180, Reporting 175)",
      "React.memo + context-provider pattern on all heavy lists",
      "Multi-patient portal with patient selector",
      "ConsentsTab, AdvanceDirectives fully persisted",
      "Registration form validation",
      "No known open bugs",
    ],
  },
  {
    id: 4,
    title: "Milestone 4 — Role Completeness & Workflow Depth",
    status: "IN_PROGRESS" as const,
    description:
      "Add missing clinical roles (Lab Technician, Radiologist), onboarding for all role types, and workflow depth improvements for existing roles.",
    sprints: [
      "Sprint 23 (current): Lab Technician + Radiologist roles, portal nav grouping, roadmap update",
      "Sprint 24 (planned): Nurse Quick Actions pointing to MAR/Assessment; ClinicalReference accessible for Doctor role in sidebar",
      "Sprint 25 (planned): Role-specific dashboard widgets (LabTech pending orders stat, Radiologist imaging queue count)",
    ],
    items: [
      "Lab Technician role (sidebar: Lab Results, Orders, Results Inbox, Clinical Reference)",
      "Radiologist role (sidebar: Imaging, Orders, Results Inbox, Clinical Reference)",
      "Portal nav visual grouping (Primary / Health / Settings)",
      "Nurse Quick Actions for MAR and Nursing Assessment",
      "Doctor sidebar access to Clinical Reference",
    ],
  },
  {
    id: 5,
    title: "Milestone 5 — Platform Readiness",
    status: "PLANNED" as const,
    description:
      "Multi-site support, FHIR R4 import/export, admin configuration UI, and enterprise security hardening for production deployment.",
    sprints: [
      "Sprint 26 (planned): Multi-site org structure, site selector in header",
      "Sprint 27 (done): PDMP lookup audit logging and inpatient admit/discharge/transfer persisted to backend",
      "Sprint 27 (done): PDMP lookup audit logging and inpatient admit/discharge/transfer persisted to backend",
      "Sprint 28 (done): VideoVisit wired to active patient, unread messages badge on sidebar, Doctor productivity stats card on Dashboard",
    ],
    items: [
      "Multi-site / multi-organization support",
      "FHIR R4 import/export with real external systems",
      "Admin-configurable module toggles",
      "Audit-ready compliance reporting (HIPAA, HL7)",
      "Performance optimization for 500+ concurrent users",
    ],
  },
];

function RoadmapTab() {
  return (
    <div className="space-y-6 max-w-3xl" data-ocid="roadmap.page">
      <div>
        <h2 className="text-base font-bold text-foreground">
          MedUnite Development Roadmap
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Current build progress and upcoming milestone plans.
        </p>
      </div>

      <div className="space-y-4">
        {MILESTONES.map((m) => (
          <div
            key={m.id}
            className="border border-border bg-card rounded-sm overflow-hidden"
            data-ocid={`roadmap.milestone.item.${m.id}`}
          >
            <div className="flex items-start gap-4 px-4 py-4">
              <div className="flex-shrink-0 mt-0.5">
                {m.status === "COMPLETE" ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : m.status === "IN_PROGRESS" ? (
                  <Clock className="w-5 h-5 text-warning" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground/40" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <p className="text-sm font-bold text-foreground">{m.title}</p>
                  <StatusBadge
                    variant={
                      m.status === "COMPLETE"
                        ? "success"
                        : m.status === "IN_PROGRESS"
                          ? "warning"
                          : "neutral"
                    }
                    label={
                      m.status === "COMPLETE"
                        ? "Complete"
                        : m.status === "IN_PROGRESS"
                          ? "In Progress"
                          : "Planned"
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {m.description}
                </p>
                {m.sprints && m.sprints.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                      Sprints
                    </p>
                    <ul className="space-y-1 pl-2 border-l border-border">
                      {m.sprints.map((s) => (
                        <li
                          key={s}
                          className="text-xs text-muted-foreground/80 pl-2"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <ul className="space-y-1">
                  {m.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      {m.status === "COMPLETE" ? (
                        <Check className="w-3 h-3 text-success flex-shrink-0 mt-0.5" />
                      ) : m.status === "IN_PROGRESS" ? (
                        <div className="w-3 h-3 flex-shrink-0 mt-0.5 border border-warning rounded-sm" />
                      ) : (
                        <div className="w-3 h-3 flex-shrink-0 mt-0.5 border border-border rounded-sm opacity-40" />
                      )}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
        {" · "}Version 123 · Sprint 23 · Admin view only
      </p>
    </div>
  );
}

interface SettingsProps {
  role: Role;
}

interface AvailabilityBlock {
  id: number;
  provider: string;
  day: string;
  startTime: string;
  endTime: string;
  type: "Available" | "Blocked";
}

const SEED_BLOCKS: AvailabilityBlock[] = [
  {
    id: 1,
    provider: "Dr. Sarah Chen",
    day: "Monday",
    startTime: "08:00",
    endTime: "12:00",
    type: "Available",
  },
  {
    id: 2,
    provider: "Dr. Sarah Chen",
    day: "Monday",
    startTime: "13:00",
    endTime: "17:00",
    type: "Available",
  },
  {
    id: 3,
    provider: "Dr. Sarah Chen",
    day: "Wednesday",
    startTime: "09:00",
    endTime: "13:00",
    type: "Blocked",
  },
  {
    id: 4,
    provider: "Dr. Marcus Williams",
    day: "Tuesday",
    startTime: "08:00",
    endTime: "17:00",
    type: "Available",
  },
  {
    id: 5,
    provider: "Dr. Marcus Williams",
    day: "Thursday",
    startTime: "08:00",
    endTime: "17:00",
    type: "Available",
  },
  {
    id: 6,
    provider: "Dr. Amara Osei",
    day: "Monday",
    startTime: "10:00",
    endTime: "15:00",
    type: "Available",
  },
  {
    id: 7,
    provider: "Dr. Amara Osei",
    day: "Friday",
    startTime: "08:00",
    endTime: "12:00",
    type: "Blocked",
  },
  {
    id: 8,
    provider: "NP Jennifer Torres",
    day: "Wednesday",
    startTime: "08:00",
    endTime: "17:00",
    type: "Available",
  },
  {
    id: 9,
    provider: "NP Jennifer Torres",
    day: "Friday",
    startTime: "08:00",
    endTime: "17:00",
    type: "Available",
  },
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function ProviderAvailabilityTab({ isAdmin }: { isAdmin: boolean }) {
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>(SEED_BLOCKS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    provider: "",
    day: "Monday",
    startTime: "08:00",
    endTime: "17:00",
    type: "Available" as "Available" | "Blocked",
  });

  const handleAdd = () => {
    if (!form.provider.trim()) return;
    const newBlock: AvailabilityBlock = {
      id: Date.now(),
      ...form,
    };
    setBlocks((prev) => [...prev, newBlock]);
    setForm({
      provider: "",
      day: "Monday",
      startTime: "08:00",
      endTime: "17:00",
      type: "Available",
    });
    setShowAddForm(false);
  };

  const handleRemove = (id: number) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-4" data-ocid="settings.provider_availability.panel">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Provider Schedule Blocks
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage when providers are available or blocked for appointments.
          </p>
        </div>
        {isAdmin && (
          <Button
            size="sm"
            variant="outline"
            data-ocid="settings.availability.open_modal_button"
            onClick={() => setShowAddForm((v) => !v)}
            className="h-8 text-xs gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add Block
          </Button>
        )}
      </div>

      {/* Inline add form */}
      {isAdmin && showAddForm && (
        <div
          className="bg-muted/40 border border-border p-4 space-y-3"
          data-ocid="settings.availability.panel"
        >
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            New Schedule Block
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="col-span-2 sm:col-span-1">
              <Label className="text-xs text-muted-foreground mb-1 block">
                Provider Name
              </Label>
              <Input
                data-ocid="settings.availability.input"
                value={form.provider}
                onChange={(e) =>
                  setForm((f) => ({ ...f, provider: e.target.value }))
                }
                placeholder="Dr. Name"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Day
              </Label>
              <select
                data-ocid="settings.availability.select"
                value={form.day}
                onChange={(e) =>
                  setForm((f) => ({ ...f, day: e.target.value }))
                }
                className="w-full h-8 text-sm border border-input bg-background px-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Type
              </Label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    type: e.target.value as "Available" | "Blocked",
                  }))
                }
                className="w-full h-8 text-sm border border-input bg-background px-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="Available">Available</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Start Time
              </Label>
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startTime: e.target.value }))
                }
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                End Time
              </Label>
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endTime: e.target.value }))
                }
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              data-ocid="settings.availability.submit_button"
              onClick={handleAdd}
              className="h-8 text-xs"
            >
              Add Block
            </Button>
            <Button
              size="sm"
              variant="outline"
              data-ocid="settings.availability.cancel_button"
              onClick={() => setShowAddForm(false)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Blocks table */}
      <div className="border border-border bg-card">
        <Table data-ocid="settings.availability.table">
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              {[
                "Provider",
                "Day",
                "Start",
                "End",
                "Type",
                ...(isAdmin ? ["Actions"] : []),
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {blocks.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 6 : 5}
                  className="text-center text-sm text-muted-foreground py-8"
                  data-ocid="settings.availability.empty_state"
                >
                  No schedule blocks configured.
                </TableCell>
              </TableRow>
            )}
            {blocks.map((block, i) => (
              <TableRow
                key={block.id}
                data-ocid={`settings.availability.row.${i + 1}`}
                className="hover:bg-muted/30 even:bg-muted/20"
              >
                <TableCell className="px-4 py-2.5 text-sm font-medium">
                  {block.provider}
                </TableCell>
                <TableCell className="px-4 py-2.5 text-sm text-muted-foreground">
                  {block.day}
                </TableCell>
                <TableCell className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                  {block.startTime}
                </TableCell>
                <TableCell className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                  {block.endTime}
                </TableCell>
                <TableCell className="px-4 py-2.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-semibold ${
                      block.type === "Available"
                        ? "bg-success/10 text-success border border-success/30"
                        : "bg-destructive/10 text-destructive border border-destructive/30"
                    }`}
                  >
                    {block.type}
                  </span>
                </TableCell>
                {isAdmin && (
                  <TableCell className="px-4 py-2.5">
                    <button
                      type="button"
                      data-ocid={`settings.availability.delete_button.${i + 1}`}
                      onClick={() => handleRemove(block.id)}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Remove
                    </button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function FhirApiExplorer() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  const endpoints = [
    {
      method: "GET",
      url: "/fhir/r4/Patient",
      description:
        "Retrieve all patient records in FHIR R4 Patient resource format.",
      sample: JSON.stringify(
        {
          resourceType: "Bundle",
          type: "searchset",
          total: 2,
          entry: [
            {
              resource: {
                resourceType: "Patient",
                id: "patient-001",
                identifier: [{ system: "urn:medunite:mrn", value: "MRN-001" }],
                name: [{ family: "Chen", given: ["Margaret"] }],
                birthDate: "1968-03-15",
                gender: "female",
                telecom: [{ system: "phone", value: "(555) 234-5678" }],
              },
            },
            {
              resource: {
                resourceType: "Patient",
                id: "patient-002",
                identifier: [{ system: "urn:medunite:mrn", value: "MRN-002" }],
                name: [{ family: "Okonkwo", given: ["Robert"] }],
                birthDate: "1954-07-22",
                gender: "male",
              },
            },
          ],
        },
        null,
        2,
      ),
    },
    {
      method: "GET",
      url: "/fhir/r4/Encounter",
      description:
        "Retrieve patient encounters (visits, admissions) as FHIR R4 Encounter resources.",
      sample: JSON.stringify(
        {
          resourceType: "Bundle",
          type: "searchset",
          entry: [
            {
              resource: {
                resourceType: "Encounter",
                id: "encounter-001",
                status: "finished",
                class: { code: "AMB", display: "Ambulatory" },
                subject: {
                  reference: "Patient/patient-001",
                  display: "Margaret Chen",
                },
                period: {
                  start: "2025-03-10T09:00:00Z",
                  end: "2025-03-10T09:45:00Z",
                },
                reasonCode: [
                  {
                    coding: [
                      {
                        system: "http://hl7.org/fhir/sid/icd-10",
                        code: "E11.9",
                        display: "Type 2 diabetes mellitus",
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        null,
        2,
      ),
    },
    {
      method: "GET",
      url: "/fhir/r4/Observation",
      description:
        "Retrieve clinical observations including vitals, lab results, and assessments.",
      sample: JSON.stringify(
        {
          resourceType: "Bundle",
          type: "searchset",
          entry: [
            {
              resource: {
                resourceType: "Observation",
                id: "obs-001",
                status: "final",
                code: {
                  coding: [
                    {
                      system: "http://loinc.org",
                      code: "4548-4",
                      display: "HbA1c",
                    },
                  ],
                },
                subject: { reference: "Patient/patient-001" },
                valueQuantity: {
                  value: 8.2,
                  unit: "%",
                  system: "http://unitsofmeasure.org",
                  code: "%",
                },
                referenceRange: [{ low: { value: 0 }, high: { value: 5.7 } }],
                interpretation: [{ coding: [{ code: "H", display: "High" }] }],
              },
            },
          ],
        },
        null,
        2,
      ),
    },
    {
      method: "GET",
      url: "/fhir/r4/MedicationRequest",
      description:
        "Retrieve active and historical medication orders and prescriptions.",
      sample: JSON.stringify(
        {
          resourceType: "Bundle",
          type: "searchset",
          entry: [
            {
              resource: {
                resourceType: "MedicationRequest",
                id: "medrx-001",
                status: "active",
                intent: "order",
                medicationCodeableConcept: {
                  coding: [
                    {
                      system: "http://www.nlm.nih.gov/research/umls/rxnorm",
                      code: "860975",
                      display: "Metformin 500 mg",
                    },
                  ],
                },
                subject: { reference: "Patient/patient-001" },
                dosageInstruction: [
                  {
                    text: "500mg twice daily with meals",
                    timing: {
                      repeat: { frequency: 2, period: 1, periodUnit: "d" },
                    },
                  },
                ],
              },
            },
          ],
        },
        null,
        2,
      ),
    },
    {
      method: "GET",
      url: "/fhir/r4/DiagnosticReport",
      description:
        "Retrieve diagnostic reports including lab panels, imaging reports, and pathology.",
      sample: JSON.stringify(
        {
          resourceType: "Bundle",
          type: "searchset",
          entry: [
            {
              resource: {
                resourceType: "DiagnosticReport",
                id: "dr-001",
                status: "final",
                category: [
                  {
                    coding: [
                      {
                        system: "http://terminology.hl7.org/CodeSystem/v2-0074",
                        code: "LAB",
                      },
                    ],
                  },
                ],
                code: { text: "Complete Metabolic Panel" },
                subject: { reference: "Patient/patient-001" },
                effectiveDateTime: "2025-03-10T08:00:00Z",
                result: [
                  { reference: "Observation/obs-001", display: "HbA1c" },
                  { reference: "Observation/obs-002", display: "Creatinine" },
                ],
              },
            },
          ],
        },
        null,
        2,
      ),
    },
  ];

  return (
    <div data-ocid="settings.fhir_api.panel" className="space-y-4 max-w-4xl">
      <div className="flex items-start gap-3 p-3 rounded-md bg-muted/40 border border-border">
        <div className="flex-1">
          <p className="text-xs font-medium text-foreground">
            FHIR R4 API Reference
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Simulated FHIR R4 endpoints for EHR interoperability. Production
            deployment would expose these via a standards-compliant FHIR server.
          </p>
        </div>
        <Badge
          variant="outline"
          className="text-xs font-semibold shrink-0 border-primary/40 text-primary"
        >
          FHIR R4
        </Badge>
      </div>

      <div className="space-y-3">
        {endpoints.map((ep) => (
          <div
            key={ep.url}
            data-ocid={`settings.fhir_api.${ep.url.replace(/\//g, "").replace(/\./g, "_").toLowerCase()}.card`}
            className="border border-border rounded-md overflow-hidden"
          >
            <div className="flex items-start gap-3 px-4 py-3 bg-card">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-success/10 text-success flex-shrink-0 mt-0.5">
                {ep.method}
              </span>
              <div className="flex-1 min-w-0">
                <code className="text-xs font-mono font-semibold text-foreground">
                  {ep.url}
                </code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {ep.description}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                data-ocid={`settings.fhir_api.${ep.url.replace(/\//g, "").toLowerCase()}.button`}
                className="h-7 text-xs flex-shrink-0 mt-0.5"
                onClick={() => copyToClipboard(ep.sample, ep.url)}
                aria-label="Copy sample response"
              >
                {copied === ep.url ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-success" />
                    <span className="text-success">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="border-t border-border bg-muted px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Sample Response
              </p>
              <pre className="text-xs font-mono text-foreground overflow-x-auto leading-relaxed max-h-48 overflow-y-auto scrollbar-none">
                {ep.sample}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const NOTIF_STORAGE_KEY = "medunite_notif_prefs";

interface NotifPrefs {
  criticalLabs: boolean;
  patientMessages: boolean;
  prescriptionReady: boolean;
  appointmentReminders: boolean;
}

function NotificationPreferences() {
  const defaultPrefs: NotifPrefs = {
    criticalLabs: true,
    patientMessages: true,
    prescriptionReady: true,
    appointmentReminders: false,
  };

  const loadPrefs = (): NotifPrefs => {
    try {
      const stored = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (stored) return { ...defaultPrefs, ...JSON.parse(stored) };
    } catch {}
    return defaultPrefs;
  };

  const [prefs, setPrefs] = useState<NotifPrefs>(loadPrefs);

  const toggle = (key: keyof NotifPrefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const savePrefs = () => {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(prefs));
    toast.success("Notification preferences saved");
  };

  const items: {
    key: keyof NotifPrefs;
    label: string;
    description: string;
    ocid: string;
  }[] = [
    {
      key: "criticalLabs",
      label: "Critical Lab Results",
      description:
        "Receive alerts when a critical lab result requires immediate attention.",
      ocid: "settings.notif.critical_labs.switch",
    },
    {
      key: "patientMessages",
      label: "New Patient Messages",
      description: "Be notified when a patient sends you a secure message.",
      ocid: "settings.notif.patient_messages.switch",
    },
    {
      key: "prescriptionReady",
      label: "Prescription Ready",
      description:
        "Alert when a patient prescription has been dispensed by pharmacy.",
      ocid: "settings.notif.prescription_ready.switch",
    },
    {
      key: "appointmentReminders",
      label: "Appointment Reminders",
      description:
        "Receive a reminder 24 hours before each scheduled appointment.",
      ocid: "settings.notif.appointment_reminders.switch",
    },
  ];

  return (
    <div
      className="max-w-xl space-y-4"
      data-ocid="settings.notifications.panel"
    >
      <p className="text-sm text-muted-foreground">
        Choose which notifications you would like to receive.
      </p>

      <div className="divide-y divide-border border border-border rounded-sm">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between px-4 py-4 gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {item.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.description}
              </p>
            </div>
            <Switch
              data-ocid={item.ocid}
              checked={prefs[item.key]}
              onCheckedChange={() => toggle(item.key)}
              aria-label={item.label}
            />
          </div>
        ))}
      </div>

      <Button
        data-ocid="settings.notif.save_button"
        onClick={savePrefs}
        size="sm"
      >
        Save Preferences
      </Button>
    </div>
  );
}

export default function Settings({ role }: SettingsProps) {
  const isAdmin = role === "Admin";
  const isDoctor = role === "Doctor";
  const isNurse = role === "Nurse";
  const isClinical = isAdmin || isDoctor || isNurse;

  const showSmartPhrases = isClinical;
  const showPdmp = isClinical;
  const showProviderAvailability = isClinical;
  const showLabIntegration = isAdmin;
  const showUserManagement = isAdmin;

  const hasAnyTab = true;

  if (!hasAnyTab) {
    return (
      <div
        className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground"
        data-ocid="settings.empty_state"
      >
        <svg
          className="w-8 h-8 opacity-30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-sm">No settings available for your role.</p>
      </div>
    );
  }

  const tabs = [
    ...(showSmartPhrases
      ? [{ value: "smart-phrases", label: "SmartPhrases" }]
      : []),
    ...(showPdmp ? [{ value: "pdmp", label: "PDMP" }] : []),
    ...(showProviderAvailability
      ? [{ value: "provider-availability", label: "Provider Availability" }]
      : []),
    ...(showLabIntegration
      ? [{ value: "lab-integration", label: "Lab Integration" }]
      : []),
    ...(showUserManagement
      ? [{ value: "user-management", label: "User Management" }]
      : []),
    { value: "fhir-api", label: "FHIR API" },
    { value: "notifications", label: "Notifications" },
    ...(isAdmin ? [{ value: "roadmap", label: "Roadmap" }] : []),
  ];

  const defaultTab = tabs[0]?.value ?? "smart-phrases";

  return (
    <div className="space-y-0" data-ocid="settings.page">
      <Tabs defaultValue={defaultTab}>
        <TabsList
          className="w-full justify-start rounded-none border-b border-border bg-transparent h-10 gap-0 px-0"
          data-ocid="settings.tabs"
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              data-ocid={`settings.${tab.value}.tab`}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-xs font-medium px-4 h-10 text-muted-foreground hover:text-foreground transition-colors"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {showSmartPhrases && (
          <TabsContent value="smart-phrases" className="mt-4">
            <SmartPhrases />
          </TabsContent>
        )}

        {showPdmp && (
          <TabsContent value="pdmp" className="mt-4">
            <PDMP />
          </TabsContent>
        )}

        {showProviderAvailability && (
          <TabsContent value="provider-availability" className="mt-4">
            <ProviderAvailabilityTab isAdmin={isAdmin} />
          </TabsContent>
        )}

        {showLabIntegration && (
          <TabsContent value="lab-integration" className="mt-4">
            <LabIntegration />
          </TabsContent>
        )}

        {showUserManagement && (
          <TabsContent value="user-management" className="mt-4">
            <UserManagement />
          </TabsContent>
        )}

        <TabsContent value="fhir-api" className="mt-4">
          <FhirApiExplorer />
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <NotificationPreferences />
        </TabsContent>
        {isAdmin && (
          <TabsContent value="roadmap" className="mt-4">
            <RoadmapTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
