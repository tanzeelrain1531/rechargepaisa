import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, ChevronDown, ChevronUp, Plus } from "lucide-react";
import React from "react";
import { PatientDetailPanel } from "../components/patients/PatientDetailPanel";
import { PatientFilters } from "../components/patients/PatientFilters";
import { PatientMergePanel } from "../components/patients/PatientMergePanel";
import { PatientRegistrationForm } from "../components/patients/PatientRegistrationForm";
import {
  PatientsProvider,
  usePatientsContext,
} from "../contexts/PatientsContext";

// Isolation flags for table row indicator (SEED data kept local)
const ISOLATION_SEED_IDS = new Set(["1", "3", "5"]);

const PatientRow = React.memo(function PatientRow({
  patient,
  index,
  isSelected,
  hasAbnormal,
  onRowClick,
}: {
  patient: {
    id: bigint;
    name: string;
    mrn: string;
    dateOfBirth: string;
    phone: string;
    email: string;
  };
  index: number;
  isSelected: boolean;
  hasAbnormal: boolean;
  onRowClick: () => void;
}) {
  const patientKey = String(Number(patient.id));
  return (
    <TableRow
      key={String(patient.id)}
      data-ocid={`patients.row.${index + 1}`}
      className={`cursor-pointer transition-all ${
        isSelected
          ? "bg-primary/5 border-l-2 border-l-primary"
          : "hover:bg-muted/30 even:bg-muted/20 border-l-2 border-l-transparent hover:border-l-accent"
      }`}
      onClick={onRowClick}
    >
      <TableCell className="px-3 py-2.5 text-muted-foreground">
        {isSelected ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </TableCell>
      <TableCell className="font-medium text-sm px-4 py-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          {patient.name}
          {hasAbnormal && (
            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
          )}
          {ISOLATION_SEED_IDS.has(patientKey) && (
            <span className="inline-flex items-center text-xs font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border bg-destructive/10 text-destructive border-destructive/20">
              Isolation
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground px-4 py-2.5">
        {patient.mrn}
      </TableCell>
      <TableCell className="text-sm px-4 py-2.5">
        {patient.dateOfBirth}
      </TableCell>
      <TableCell className="text-sm px-4 py-2.5">{patient.phone}</TableCell>
      <TableCell className="text-sm text-muted-foreground px-4 py-2.5">
        {patient.email}
      </TableCell>
    </TableRow>
  );
});

function PatientsInner({
  onSelectPatient,
}: {
  onSelectPatient?: (p: {
    id: bigint;
    name: string;
    mrn: string;
    dateOfBirth: string;
  }) => void;
}) {
  const {
    loading,
    submitting,
    showForm,
    setShowForm,
    selectedPatient,
    setSelectedPatient,
    form,
    setForm,
    filtered,
    duplicates,
    abnormalPatientIds,
    handleAdd,
    handleCancel,
    handleMerge,
    handleRowClick,
    search,
    setSearch,
    allMedications,
    allLabResults,
    allAppointments,
    allClinicalNotes,
    allPrescriptions,
  } = usePatientsContext();

  return (
    <div className="space-y-5" data-ocid="patients.page">
      <div className="flex items-center justify-between">
        <PatientFilters search={search} onSearchChange={setSearch} />
        <Button
          data-ocid="patients.primary_button"
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowForm((v) => !v)}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Register Patient
        </Button>
      </div>

      {showForm && (
        <PatientRegistrationForm
          form={form}
          setForm={setForm}
          submitting={submitting}
          onSubmit={handleAdd}
          onCancel={handleCancel}
        />
      )}

      <PatientMergePanel duplicates={duplicates} onMerge={handleMerge} />

      <div className="border border-border bg-card">
        <Table data-ocid="patients.table">
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4 w-6" />
              {["Name", "MRN", "Date of Birth", "Phone", "Email"].map((h) => (
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
            {loading ? (
              ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4"].map((rowKey) => (
                <TableRow key={rowKey} data-ocid="patients.loading_state">
                  {["c0", "c1", "c2", "c3", "c4", "c5"].map((colKey) => (
                    <TableCell key={colKey} className="px-4 py-2.5">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-10 text-sm"
                  data-ocid="patients.empty_state"
                >
                  No patients found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p, i) => (
                <PatientRow
                  key={String(p.id)}
                  patient={p}
                  index={i}
                  isSelected={selectedPatient?.id === p.id}
                  hasAbnormal={abnormalPatientIds.has(p.id)}
                  onRowClick={() => handleRowClick(p, onSelectPatient)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedPatient && (
        <PatientDetailPanel
          patient={selectedPatient}
          allMedications={allMedications}
          allLabResults={allLabResults}
          allAppointments={allAppointments}
          allClinicalNotes={allClinicalNotes}
          allPrescriptions={allPrescriptions}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}

export default function Patients({
  onSelectPatient,
}: {
  onSelectPatient?: (p: {
    id: bigint;
    name: string;
    mrn: string;
    dateOfBirth: string;
  }) => void;
} = {}) {
  return (
    <PatientsProvider>
      <PatientsInner onSelectPatient={onSelectPatient} />
    </PatientsProvider>
  );
}

// Re-export for compatibility with pages that import from here
export { getCareGapOverdueNames } from "../components/patients/PatientDetailPanel";
export { getLabFlag } from "../contexts/PatientsContext";
