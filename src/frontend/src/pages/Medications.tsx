import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronUp, Loader2, Pill, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PatientFilterBar } from "../components/PatientFilterBar";
import { StatusBadge } from "../components/StatusBadge";
import { DEMO_MEDICATIONS, DEMO_PATIENTS } from "../demoData";
import { useActor } from "../hooks/useActor";
import { useMedications, usePatients } from "../hooks/useBackendData";
import { useDemoMode } from "../hooks/useDemoMode";

type Medication = {
  id: bigint;
  patientId: bigint;
  name: string;
  dose: string;
  frequency: string;
  status: string;
};

type Patient = { id: bigint; name: string };

export default function Medications({
  activePatientId,
  activePatientName,
  onClearFilter,
  onNavigate,
}: {
  activePatientId?: bigint;
  activePatientName?: string;
  onClearFilter?: () => void;
  onNavigate?: (page: string) => void;
}) {
  const { isDemoMode, demoActor } = useDemoMode();
  const { actor: realActor } = useActor();
  const actor = isDemoMode ? demoActor : realActor;

  const [meds, setMeds] = useState<Medication[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patientId: "",
    name: "",
    dose: "",
    frequency: "",
    status: "active",
  });

  const queryClient = useQueryClient();

  // React Query cached hooks (non-demo mode)
  const { data: medsData, isLoading: medsLoading } = useMedications();
  const { data: patientsData, isLoading: patientsLoading } = usePatients();

  useEffect(() => {
    if (isDemoMode) return;
    if (medsData) setMeds(medsData as Medication[]);
    if (patientsData) setPatients(patientsData as Patient[]);
    if (!medsLoading && !patientsLoading) setLoading(false);
  }, [medsData, patientsData, medsLoading, patientsLoading, isDemoMode]);

  // Demo mode: load seed data merged with backend
  useEffect(() => {
    if (!isDemoMode || !actor) return;
    setLoading(true);
    Promise.all([actor.listMedications(), actor.listPatients()])
      .then(([medData, patientData]) => {
        const backendMeds = medData as Medication[];
        const backendIds = new Set(backendMeds.map((m) => m.id));
        const merged = [
          ...backendMeds,
          ...(DEMO_MEDICATIONS as Medication[]).filter(
            (m) => !backendIds.has(m.id),
          ),
        ];
        setMeds(merged);
        setPatients(patientData as Patient[]);
      })
      .catch(() => {
        setMeds(DEMO_MEDICATIONS as Medication[]);
        setPatients(DEMO_PATIENTS);
      })
      .finally(() => setLoading(false));
  }, [actor, isDemoMode]);

  const filteredMeds = activePatientId
    ? meds.filter((m) => m.patientId === activePatientId)
    : meds;

  const handleAdd = async () => {
    if (!form.patientId || !form.name) {
      toast.error("Patient and medication name required");
      return;
    }
    if (!actor) return;
    setSubmitting(true);
    try {
      await actor.addMedication(
        BigInt(form.patientId),
        form.name,
        form.dose,
        form.frequency,
        form.status,
      );
      toast.success("Medication added");
      setShowForm(false);
      setForm({
        patientId: "",
        name: "",
        dose: "",
        frequency: "",
        status: "active",
      });
      queryClient.invalidateQueries({ queryKey: ["medications"] });
    } catch {
      toast.error("Failed to add medication");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDiscontinue = async (id: bigint) => {
    if (!actor) return;
    try {
      await actor.updateMedicationStatus(id, "discontinued");
      setMeds((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "discontinued" } : m)),
      );
      toast.success("Medication discontinued");
    } catch {
      toast.error("Failed to update medication");
    }
  };

  const patientList = patients.length > 0 ? patients : DEMO_PATIENTS;

  if (!activePatientId) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        data-ocid="medications.empty_state"
      >
        <Pill className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Select a patient to view their medications
        </p>
        <button
          type="button"
          onClick={() => onNavigate?.("patients")}
          className="text-xs font-medium text-primary hover:underline"
        >
          Go to Patients
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="medications.page">
      {activePatientId && activePatientName && (
        <PatientFilterBar
          patientName={activePatientName}
          onClear={onClearFilter ?? (() => {})}
        />
      )}
      <div className="flex items-center justify-between">
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          data-ocid="medications.primary_button"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? (
            <ChevronUp className="w-3.5 h-3.5 mr-1.5" />
          ) : (
            <Plus className="w-3.5 h-3.5 mr-1.5" />
          )}
          Add Medication
        </Button>
      </div>

      {showForm && (
        <div
          className="border border-border bg-card p-5"
          data-ocid="medications.panel"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Add Medication
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Patient
              </Label>
              <Select
                onValueChange={(v) => setForm((p) => ({ ...p, patientId: v }))}
              >
                <SelectTrigger
                  data-ocid="medications.patient.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patientList.map((p) => (
                    <SelectItem key={String(p.id)} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(["name", "dose", "frequency"] as const).map((f) => (
              <div key={f}>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground capitalize">
                  {f}
                </Label>
                <Input
                  data-ocid={`medications.${f}.input`}
                  value={form[f]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [f]: e.target.value }))
                  }
                  className="mt-1 h-8 text-sm"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
              >
                <SelectTrigger
                  data-ocid="medications.status.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="stopped">Stopped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button
              size="sm"
              data-ocid="medications.submit_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={submitting}
              onClick={handleAdd}
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : null}
              Add Medication
            </Button>
            <Button
              size="sm"
              data-ocid="medications.cancel_button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="border border-border bg-card">
        <Table data-ocid="medications.table">
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Patient
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Medication
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Dose
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Frequency
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              ["sk-0", "sk-1", "sk-2", "sk-3"].map((k) => (
                <TableRow key={k} data-ocid="medications.loading_state">
                  {["c0", "c1", "c2", "c3", "c4", "c5"].map((c) => (
                    <TableCell key={c} className="px-4 py-2.5">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredMeds.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-sm text-muted-foreground"
                  data-ocid="medications.empty_state"
                >
                  No medications found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMeds.map((m, i) => {
                const patient = patientList.find((p) => p.id === m.patientId);
                return (
                  <TableRow
                    key={String(m.id)}
                    data-ocid={`medications.row.${i + 1}`}
                    className="hover:bg-muted/30 even:bg-muted/20 border-l-2 border-l-transparent hover:border-l-accent transition-all"
                  >
                    <TableCell className="font-medium text-sm px-4 py-2.5">
                      {patient?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm px-4 py-2.5">
                      {m.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs px-4 py-2.5">
                      {m.dose}
                    </TableCell>
                    <TableCell className="font-mono text-xs px-4 py-2.5">
                      {m.frequency}
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <StatusBadge
                        variant={
                          m.status === "active"
                            ? "success"
                            : m.status === "discontinued"
                              ? "danger"
                              : "neutral"
                        }
                        label={m.status}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      {m.status === "active" && (
                        <button
                          type="button"
                          data-ocid={`medications.delete_button.${i + 1}`}
                          onClick={() => handleDiscontinue(m.id)}
                          className="h-6 px-2 text-xs font-semibold border border-border text-muted-foreground hover:text-destructive rounded-sm"
                        >
                          Stop
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
