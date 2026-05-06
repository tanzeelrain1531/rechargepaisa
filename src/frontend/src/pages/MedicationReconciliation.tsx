import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PatientFilterBar } from "../components/PatientFilterBar";

type ReconcileStatus = "pending" | "continued" | "discontinued" | "modified";

interface MedEntry {
  id: number;
  name: string;
  dose: string;
  frequency: string;
  prescriber: string;
  lastFilled: string;
}

interface ReconcileRow {
  id: number;
  current: MedEntry | null;
  prior: MedEntry | null;
  status: ReconcileStatus;
  notes: string;
  showNoteInput: boolean;
}

interface PatientData {
  id: string;
  name: string;
  dob: string;
  mrn: string;
  rows: ReconcileRow[];
}

const DEMO_PATIENTS: PatientData[] = [
  {
    id: "1",
    name: "Margaret Chen",
    dob: "1968-03-15",
    mrn: "MRN-001",
    rows: [
      {
        id: 1,
        current: {
          id: 1,
          name: "Metformin",
          dose: "1000mg",
          frequency: "Twice daily",
          prescriber: "Dr. Sarah Chen",
          lastFilled: "2026-02-20",
        },
        prior: {
          id: 1,
          name: "Metformin",
          dose: "500mg",
          frequency: "Twice daily",
          prescriber: "Dr. Jordan Lee",
          lastFilled: "2025-11-10",
        },
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
      {
        id: 2,
        current: {
          id: 2,
          name: "Lisinopril",
          dose: "10mg",
          frequency: "Once daily",
          prescriber: "Dr. Sarah Chen",
          lastFilled: "2026-02-20",
        },
        prior: {
          id: 2,
          name: "Lisinopril",
          dose: "10mg",
          frequency: "Once daily",
          prescriber: "Dr. Jordan Lee",
          lastFilled: "2025-11-10",
        },
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
      {
        id: 3,
        current: {
          id: 3,
          name: "Aspirin",
          dose: "81mg",
          frequency: "Once daily",
          prescriber: "Dr. Sarah Chen",
          lastFilled: "2026-02-15",
        },
        prior: null,
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
      {
        id: 4,
        current: null,
        prior: {
          id: 4,
          name: "Glipizide",
          dose: "5mg",
          frequency: "Once daily",
          prescriber: "Dr. Jordan Lee",
          lastFilled: "2025-09-01",
        },
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
    ],
  },
  {
    id: "2",
    name: "Robert Okonkwo",
    dob: "1954-07-22",
    mrn: "MRN-002",
    rows: [
      {
        id: 1,
        current: {
          id: 1,
          name: "Furosemide",
          dose: "40mg",
          frequency: "Once daily",
          prescriber: "Dr. Sarah Chen",
          lastFilled: "2026-03-01",
        },
        prior: {
          id: 1,
          name: "Furosemide",
          dose: "20mg",
          frequency: "Once daily",
          prescriber: "Dr. Williams",
          lastFilled: "2025-12-01",
        },
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
      {
        id: 2,
        current: {
          id: 2,
          name: "Potassium Chloride",
          dose: "20mEq",
          frequency: "Twice daily",
          prescriber: "Dr. Sarah Chen",
          lastFilled: "2026-03-01",
        },
        prior: {
          id: 2,
          name: "Potassium Chloride",
          dose: "20mEq",
          frequency: "Once daily",
          prescriber: "Dr. Williams",
          lastFilled: "2025-12-01",
        },
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
      {
        id: 3,
        current: {
          id: 3,
          name: "Carvedilol",
          dose: "6.25mg",
          frequency: "Twice daily",
          prescriber: "Dr. Sarah Chen",
          lastFilled: "2026-03-01",
        },
        prior: {
          id: 3,
          name: "Carvedilol",
          dose: "6.25mg",
          frequency: "Twice daily",
          prescriber: "Dr. Williams",
          lastFilled: "2025-12-01",
        },
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
    ],
  },
  {
    id: "3",
    name: "Sophia Martinez",
    dob: "1982-11-08",
    mrn: "MRN-003",
    rows: [
      {
        id: 1,
        current: {
          id: 1,
          name: "Levothyroxine",
          dose: "75mcg",
          frequency: "Once daily (morning)",
          prescriber: "Dr. Sarah Chen",
          lastFilled: "2026-02-10",
        },
        prior: {
          id: 1,
          name: "Levothyroxine",
          dose: "50mcg",
          frequency: "Once daily (morning)",
          prescriber: "Dr. Park",
          lastFilled: "2025-08-10",
        },
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
      {
        id: 2,
        current: {
          id: 2,
          name: "Vitamin D3",
          dose: "2000 IU",
          frequency: "Once daily",
          prescriber: "Dr. Sarah Chen",
          lastFilled: "2026-02-10",
        },
        prior: null,
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
      {
        id: 3,
        current: null,
        prior: {
          id: 3,
          name: "Atenolol",
          dose: "25mg",
          frequency: "Once daily",
          prescriber: "Dr. Park",
          lastFilled: "2025-06-01",
        },
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
    ],
  },
  {
    id: "4",
    name: "William Park",
    dob: "1947-02-14",
    mrn: "MRN-007",
    rows: [
      {
        id: 1,
        current: {
          id: 1,
          name: "Amlodipine",
          dose: "10mg",
          frequency: "Once daily",
          prescriber: "Dr. Sarah Johnson",
          lastFilled: "2026-03-05",
        },
        prior: {
          id: 1,
          name: "Amlodipine",
          dose: "5mg",
          frequency: "Once daily",
          prescriber: "Dr. Chen",
          lastFilled: "2025-10-12",
        },
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
      {
        id: 2,
        current: {
          id: 2,
          name: "Tiotropium",
          dose: "18mcg",
          frequency: "Once daily (inhaled)",
          prescriber: "Dr. Sarah Johnson",
          lastFilled: "2026-03-05",
        },
        prior: {
          id: 2,
          name: "Tiotropium",
          dose: "18mcg",
          frequency: "Once daily (inhaled)",
          prescriber: "Dr. Chen",
          lastFilled: "2025-10-12",
        },
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
      {
        id: 3,
        current: {
          id: 3,
          name: "Fluticasone/Salmeterol",
          dose: "250/50mcg",
          frequency: "Twice daily (inhaled)",
          prescriber: "Dr. Sarah Johnson",
          lastFilled: "2026-02-28",
        },
        prior: {
          id: 3,
          name: "Fluticasone/Salmeterol",
          dose: "250/50mcg",
          frequency: "Twice daily (inhaled)",
          prescriber: "Dr. Chen",
          lastFilled: "2025-10-12",
        },
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
      {
        id: 4,
        current: {
          id: 4,
          name: "Pantoprazole",
          dose: "40mg",
          frequency: "Once daily",
          prescriber: "Dr. Sarah Johnson",
          lastFilled: "2026-02-20",
        },
        prior: null,
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
      {
        id: 5,
        current: null,
        prior: {
          id: 5,
          name: "Theophylline",
          dose: "200mg",
          frequency: "Twice daily",
          prescriber: "Dr. Chen",
          lastFilled: "2025-08-01",
        },
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
    ],
  },
  {
    id: "5",
    name: "Eleanor Walsh",
    dob: "1967-09-03",
    mrn: "MRN-008",
    rows: [
      {
        id: 1,
        current: {
          id: 1,
          name: "Atorvastatin",
          dose: "40mg",
          frequency: "Once daily (evening)",
          prescriber: "Dr. Sarah Johnson",
          lastFilled: "2026-03-01",
        },
        prior: {
          id: 1,
          name: "Atorvastatin",
          dose: "20mg",
          frequency: "Once daily (evening)",
          prescriber: "Dr. Osei",
          lastFilled: "2025-09-15",
        },
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
      {
        id: 2,
        current: {
          id: 2,
          name: "Sertraline",
          dose: "100mg",
          frequency: "Once daily",
          prescriber: "Dr. Sarah Johnson",
          lastFilled: "2026-03-01",
        },
        prior: {
          id: 2,
          name: "Sertraline",
          dose: "50mg",
          frequency: "Once daily",
          prescriber: "Dr. Osei",
          lastFilled: "2025-09-15",
        },
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
      {
        id: 3,
        current: {
          id: 3,
          name: "Metoprolol Succinate",
          dose: "50mg",
          frequency: "Once daily",
          prescriber: "Dr. Sarah Johnson",
          lastFilled: "2026-02-25",
        },
        prior: {
          id: 3,
          name: "Metoprolol Succinate",
          dose: "50mg",
          frequency: "Once daily",
          prescriber: "Dr. Osei",
          lastFilled: "2025-09-15",
        },
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
      {
        id: 4,
        current: {
          id: 4,
          name: "Escitalopram",
          dose: "10mg",
          frequency: "Once daily",
          prescriber: "Dr. Sarah Johnson",
          lastFilled: "2026-03-01",
        },
        prior: null,
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
      {
        id: 5,
        current: null,
        prior: {
          id: 5,
          name: "Alprazolam",
          dose: "0.5mg",
          frequency: "Three times daily PRN",
          prescriber: "Dr. Osei",
          lastFilled: "2025-07-10",
        },
        status: "pending",
        notes: "Discontinued per patient request — replaced with SSRI therapy",
        showNoteInput: false,
      },
      {
        id: 6,
        current: {
          id: 6,
          name: "Folic Acid",
          dose: "1mg",
          frequency: "Once daily",
          prescriber: "Dr. Sarah Johnson",
          lastFilled: "2026-02-15",
        },
        prior: null,
        status: "pending",
        notes: "",
        showNoteInput: false,
      },
    ],
  },
];

const statusVariant = (
  s: ReconcileStatus,
): "success" | "warning" | "danger" | "info" | "neutral" => {
  switch (s) {
    case "continued":
      return "success";
    case "discontinued":
      return "danger";
    case "modified":
      return "warning";
    default:
      return "neutral";
  }
};

function MedCell({ med }: { med: MedEntry | null }) {
  if (!med) {
    return (
      <span className="text-[12px] text-muted-foreground italic">
        Not on list
      </span>
    );
  }
  return (
    <div>
      <p className="text-[13px] font-semibold text-foreground">{med.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {med.dose} &middot; {med.frequency}
      </p>
      <p className="text-xs text-muted-foreground">
        {med.prescriber} &middot; {med.lastFilled}
      </p>
    </div>
  );
}

export default function MedicationReconciliation({
  activePatientId,
  activePatientName,
  onClearFilter,
}: {
  activePatientId?: bigint;
  activePatientName?: string;
  onClearFilter?: () => void;
}) {
  const loading = false;

  const [selectedPatientId, setSelectedPatientId] = useState<string>("1");
  const [patients, setPatients] = useState<PatientData[]>(DEMO_PATIENTS);
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const patient = patients.find((p) => p.id === selectedPatientId)!;
  const rows = patient?.rows ?? [];

  const updateRow = (rowId: number, update: Partial<ReconcileRow>) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id !== selectedPatientId
          ? p
          : {
              ...p,
              rows: p.rows.map((r) =>
                r.id === rowId ? { ...r, ...update } : r,
              ),
            },
      ),
    );
  };

  const handleContinue = (rowId: number) => {
    updateRow(rowId, { status: "continued", showNoteInput: false });
  };

  const handleDiscontinue = (rowId: number) => {
    updateRow(rowId, { status: "discontinued", showNoteInput: false });
  };

  const handleModify = (rowId: number) => {
    updateRow(rowId, { status: "modified", showNoteInput: true });
  };

  const handleSave = () => {
    setSaved((prev) => ({ ...prev, [selectedPatientId]: true }));
    toast.success(`Medication reconciliation saved for ${patient.name}`);
  };

  const pendingCount = rows.filter((r) => r.status === "pending").length;
  const isSaved = saved[selectedPatientId];

  if (loading) {
    return (
      <div className="space-y-4" data-ocid="medrec.loading_state">
        {activePatientId && activePatientName && (
          <PatientFilterBar
            patientName={activePatientName}
            onClear={onClearFilter ?? (() => {})}
          />
        )}
        <Skeleton className="h-10 w-64" />
        {[1, 2, 3, 4].map((k) => (
          <Skeleton key={k} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="medrec.page">
      {/* Patient selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Label
            htmlFor="medrec-patient-select"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
          >
            Patient
          </Label>
          <select
            id="medrec-patient-select"
            data-ocid="medrec.patient.select"
            value={selectedPatientId}
            onChange={(e) => {
              setSelectedPatientId(e.target.value);
              setSaved((prev) => ({ ...prev, [e.target.value]: false }));
            }}
            className="h-8 px-2 text-[13px] bg-background border border-input rounded-sm min-w-[200px]"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        {patient && (
          <div className="text-xs text-muted-foreground">
            DOB: {patient.dob} &middot; MRN: {patient.mrn}
          </div>
        )}
        <div className="ml-auto flex items-center gap-3">
          {pendingCount > 0 && (
            <span className="text-[12px] text-warning font-medium">
              {pendingCount} medication{pendingCount !== 1 ? "s" : ""} need
              review
            </span>
          )}
          <Button
            size="sm"
            data-ocid="medrec.save_button"
            onClick={handleSave}
            disabled={pendingCount > 0}
            className="h-8 text-xs gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Save Reconciliation
          </Button>
        </div>
      </div>

      {isSaved && (
        <div
          className="flex items-center gap-2.5 px-4 py-3 bg-success/10 border border-success/30 rounded-sm"
          data-ocid="medrec.success_state"
        >
          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
          <p className="text-[13px] text-success font-medium">
            Reconciliation saved &mdash;{" "}
            {rows.filter((r) => r.status === "continued").length} continued,{" "}
            {rows.filter((r) => r.status === "discontinued").length}{" "}
            discontinued, {rows.filter((r) => r.status === "modified").length}{" "}
            modified
          </p>
        </div>
      )}

      {/* Side-by-side table */}
      <div
        className="bg-card border border-border rounded-sm overflow-hidden"
        data-ocid="medrec.table"
      >
        {/* Table header */}
        <div className="grid grid-cols-[2fr_2fr_1fr_2fr] border-b border-border bg-muted/30">
          <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-r border-border">
            Current Medications
          </div>
          <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-r border-border">
            Last Reconciled (Prior Visit)
          </div>
          <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-r border-border">
            Status
          </div>
          <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Action
          </div>
        </div>

        {/* Rows */}
        {rows.length === 0 ? (
          <div
            className="px-4 py-10 text-center text-[13px] text-muted-foreground"
            data-ocid="medrec.empty_state"
          >
            No medications to reconcile.
          </div>
        ) : (
          rows.map((row, idx) => (
            <div
              key={row.id}
              className="grid grid-cols-[2fr_2fr_1fr_2fr] border-b border-border last:border-0"
              data-ocid={`medrec.row.${idx + 1}`}
            >
              {/* Current */}
              <div className="px-4 py-3 border-r border-border">
                <MedCell med={row.current} />
              </div>
              {/* Prior */}
              <div className="px-4 py-3 border-r border-border">
                <MedCell med={row.prior} />
              </div>
              {/* Status */}
              <div className="px-4 py-3 border-r border-border flex items-start pt-3.5">
                <StatusBadge
                  variant={statusVariant(row.status)}
                  label={
                    row.status.charAt(0).toUpperCase() + row.status.slice(1)
                  }
                />
              </div>
              {/* Actions */}
              <div className="px-4 py-3 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    size="sm"
                    variant={row.status === "continued" ? "default" : "outline"}
                    data-ocid={`medrec.continue.button.${idx + 1}`}
                    onClick={() => handleContinue(row.id)}
                    className="h-6 text-xs px-2"
                  >
                    Continue
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      row.status === "discontinued" ? "destructive" : "outline"
                    }
                    data-ocid={`medrec.discontinue.button.${idx + 1}`}
                    onClick={() => handleDiscontinue(row.id)}
                    className="h-6 text-xs px-2"
                  >
                    Discontinue
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      row.status === "modified" ? "secondary" : "outline"
                    }
                    data-ocid={`medrec.modify.button.${idx + 1}`}
                    onClick={() => handleModify(row.id)}
                    className="h-6 text-xs px-2 gap-1"
                  >
                    <Edit2 className="w-3 h-3" /> Modify
                  </Button>
                </div>
                {/* Inline note form */}
                {row.showNoteInput && (
                  <div className="space-y-1.5">
                    <Input
                      data-ocid={`medrec.note.input.${idx + 1}`}
                      placeholder="New dose or instructions..."
                      value={row.notes}
                      onChange={(e) =>
                        updateRow(row.id, { notes: e.target.value })
                      }
                      className="h-6 text-xs"
                    />
                    <Textarea
                      data-ocid={`medrec.reason.textarea.${idx + 1}`}
                      placeholder="Reason for modification..."
                      rows={2}
                      className="text-xs min-h-0"
                    />
                    <Button
                      size="sm"
                      data-ocid={`medrec.note.save_button.${idx + 1}`}
                      onClick={() =>
                        updateRow(row.id, { showNoteInput: false })
                      }
                      className="h-6 text-xs px-2"
                    >
                      Save Note
                    </Button>
                  </div>
                )}
                {row.notes && !row.showNoteInput && (
                  <p className="text-xs text-muted-foreground italic">
                    {row.notes}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="bg-muted/30 border border-border rounded-sm px-4 py-3 flex items-center gap-6">
        <span className="text-[12px] text-muted-foreground font-medium">
          Reconciliation Summary
        </span>
        {(
          [
            "continued",
            "discontinued",
            "modified",
            "pending",
          ] as ReconcileStatus[]
        ).map((s) => {
          const count = rows.filter((r) => r.status === s).length;
          if (count === 0) return null;
          return (
            <span key={s} className="flex items-center gap-1.5 text-[12px]">
              <StatusBadge
                variant={statusVariant(s)}
                label={`${count} ${s.charAt(0).toUpperCase() + s.slice(1)}`}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}
