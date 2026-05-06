import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEMO_PATIENTS } from "@/demoData";
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Plus,
  ShieldAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PatientFilterBar } from "../components/PatientFilterBar";

interface IsolationFlag {
  id: number;
  patientId?: bigint;
  patient: string;
  type: string;
  dateApplied: string;
  reason: string;
}

interface FallRisk {
  patientId?: bigint;
  patient: string;
  morseScore: number;
  level: string;
  lastAssessed: string;
}

interface PressureRisk {
  patientId?: bigint;
  patient: string;
  bradenScore: number;
  level: string;
  lastAssessed: string;
}

function patientName(id: bigint): string {
  return DEMO_PATIENTS.find((p) => p.id === id)?.name ?? "Unknown Patient";
}

const INITIAL_FLAGS: IsolationFlag[] = [
  {
    id: 1,
    patientId: 1n,
    patient: patientName(1n),
    type: "Contact",
    dateApplied: "2026-03-13",
    reason: "MRSA positive culture",
  },
  {
    id: 2,
    patientId: 2n,
    patient: patientName(2n),
    type: "Droplet",
    dateApplied: "2026-03-14",
    reason: "Influenza A diagnosis",
  },
  {
    id: 3,
    patientId: 6n,
    patient: patientName(6n),
    type: "Airborne",
    dateApplied: "2026-03-15",
    reason: "Suspected pulmonary TB",
  },
];

const FALL_RISKS: FallRisk[] = [
  {
    patientId: 1n,
    patient: patientName(1n),
    morseScore: 65,
    level: "High",
    lastAssessed: "2026-03-15",
  },
  {
    patientId: 3n,
    patient: patientName(3n),
    morseScore: 35,
    level: "Medium",
    lastAssessed: "2026-03-14",
  },
  {
    patientId: 2n,
    patient: patientName(2n),
    morseScore: 15,
    level: "Low",
    lastAssessed: "2026-03-15",
  },
  {
    patientId: 6n,
    patient: patientName(6n),
    morseScore: 50,
    level: "Medium",
    lastAssessed: "2026-03-13",
  },
];

const PRESSURE_RISKS: PressureRisk[] = [
  {
    patientId: 1n,
    patient: patientName(1n),
    bradenScore: 14,
    level: "Moderate Risk",
    lastAssessed: "2026-03-15",
  },
  {
    patientId: 2n,
    patient: patientName(2n),
    bradenScore: 19,
    level: "Low Risk",
    lastAssessed: "2026-03-14",
  },
  {
    patientId: 6n,
    patient: patientName(6n),
    bradenScore: 12,
    level: "High Risk",
    lastAssessed: "2026-03-15",
  },
];

function getFallBadgeVariant(level: string) {
  if (level === "High") return "destructive";
  if (level === "Medium") return "secondary";
  return "outline";
}

function getPressureBadgeVariant(level: string) {
  if (level === "High Risk") return "destructive";
  if (level === "Moderate Risk") return "secondary";
  return "outline";
}

function getIsolationBg(type: string): string {
  if (type === "Airborne")
    return "bg-destructive/10 text-destructive border-destructive/30";
  if (type === "Droplet")
    return "bg-warning/10 text-warning-foreground border-warning/30";
  return "bg-muted text-muted-foreground border-border";
}

export default function SafetyPage({
  activePatientId,
  activePatientName,
  onClearFilter,
}: {
  activePatientId?: bigint;
  activePatientName?: string;
  onClearFilter?: () => void;
}) {
  const [flags, setFlags] = useState<IsolationFlag[]>(INITIAL_FLAGS);
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({
    patient: "",
    type: "Contact",
    dateApplied: "",
    reason: "",
  });

  // Filter to active patient when one is selected
  const filteredFlags = useMemo(() => {
    if (!activePatientId) return flags;
    return flags.filter((f) => !f.patientId || f.patientId === activePatientId);
  }, [flags, activePatientId]);

  const filteredFallRisks = useMemo(() => {
    if (!activePatientId) return FALL_RISKS;
    return FALL_RISKS.filter(
      (r) => !r.patientId || r.patientId === activePatientId,
    );
  }, [activePatientId]);

  const filteredPressureRisks = useMemo(() => {
    if (!activePatientId) return PRESSURE_RISKS;
    return PRESSURE_RISKS.filter(
      (r) => !r.patientId || r.patientId === activePatientId,
    );
  }, [activePatientId]);

  const handleAddFlag = () => {
    if (!form.patient.trim()) {
      toast.error("Patient name is required");
      return;
    }
    const newFlag: IsolationFlag = { id: Date.now(), ...form };
    setFlags((prev) => [newFlag, ...prev]);
    setForm({ patient: "", type: "Contact", dateApplied: "", reason: "" });
    setExpanded(false);
    toast.success(`Isolation flag added for ${form.patient}`);
  };

  const handleRemoveFlag = (id: number) => {
    setFlags((prev) => prev.filter((f) => f.id !== id));
    toast.success("Isolation flag removed");
  };

  return (
    <div className="p-5 space-y-5" data-ocid="safety.page">
      {activePatientId && activePatientName && (
        <PatientFilterBar
          patientName={activePatientName}
          onClear={onClearFilter ?? (() => {})}
        />
      )}
      {/* Isolation Flags */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-destructive" />
              <CardTitle className="text-sm font-semibold">
                Infection Control / Isolation Flags
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              data-ocid="safety.isolation.open_modal_button"
              onClick={() => setExpanded((v) => !v)}
              className="gap-1.5"
            >
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              {expanded ? "Cancel" : "Add Flag"}
            </Button>
          </div>
        </CardHeader>

        {expanded && (
          <CardContent className="border-t border-border pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="flag-patient" className="text-xs">
                  Patient Name
                </Label>
                <Input
                  id="flag-patient"
                  data-ocid="safety.patient.input"
                  placeholder="Patient name"
                  value={form.patient}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, patient: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Isolation Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}
                >
                  <SelectTrigger data-ocid="safety.type.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contact">Contact</SelectItem>
                    <SelectItem value="Droplet">Droplet</SelectItem>
                    <SelectItem value="Airborne">Airborne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="flag-date" className="text-xs">
                  Date Applied
                </Label>
                <Input
                  id="flag-date"
                  type="date"
                  data-ocid="safety.date.input"
                  value={form.dateApplied}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dateApplied: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="flag-reason" className="text-xs">
                  Reason / Notes
                </Label>
                <Input
                  id="flag-reason"
                  data-ocid="safety.reason.input"
                  placeholder="Clinical reason for isolation"
                  value={form.reason}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, reason: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                size="sm"
                data-ocid="safety.submit_button"
                onClick={handleAddFlag}
              >
                Add Isolation Flag
              </Button>
            </div>
          </CardContent>
        )}

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead className="w-32">Type</TableHead>
                <TableHead className="w-32">Date Applied</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFlags.length === 0 ? (
                <TableRow data-ocid="safety.isolation.empty_state">
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8 text-sm"
                  >
                    No active isolation flags
                  </TableCell>
                </TableRow>
              ) : (
                filteredFlags.map((flag, idx) => (
                  <TableRow
                    key={flag.id}
                    data-ocid={`safety.isolation.item.${idx + 1}`}
                  >
                    <TableCell className="text-sm font-medium">
                      {flag.patient}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getIsolationBg(flag.type)}`}
                      >
                        {flag.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {flag.dateApplied}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {flag.reason}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        data-ocid={`safety.isolation.delete_button.${idx + 1}`}
                        onClick={() => handleRemoveFlag(flag.id)}
                        className="h-7 text-xs text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Fall Risk */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <CardTitle className="text-sm font-semibold">
              Fall Risk Assessment — Morse Fall Scale
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead className="w-40">Morse Score (0–125)</TableHead>
                <TableHead className="w-28">Risk Level</TableHead>
                <TableHead className="w-32">Last Assessed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFallRisks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-8 text-sm"
                  >
                    No fall risk assessments on record
                  </TableCell>
                </TableRow>
              ) : (
                filteredFallRisks.map((r, idx) => (
                  <TableRow
                    key={r.patient}
                    data-ocid={`safety.fall_risk.item.${idx + 1}`}
                  >
                    <TableCell className="text-sm font-medium">
                      {r.patient}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={(r.morseScore / 125) * 100}
                          className="h-1.5 w-24"
                        />
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {r.morseScore}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getFallBadgeVariant(r.level)}>
                        {r.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.lastAssessed}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pressure Ulcer Risk */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-semibold">
              Pressure Ulcer Risk — Braden Scale
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead className="w-40">Braden Score (6–23)</TableHead>
                <TableHead className="w-36">Risk Level</TableHead>
                <TableHead className="w-32">Last Assessed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPressureRisks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-8 text-sm"
                  >
                    No pressure risk assessments on record
                  </TableCell>
                </TableRow>
              ) : (
                filteredPressureRisks.map((r, idx) => (
                  <TableRow
                    key={r.patient}
                    data-ocid={`safety.pressure.item.${idx + 1}`}
                  >
                    <TableCell className="text-sm font-medium">
                      {r.patient}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={((r.bradenScore - 6) / 17) * 100}
                          className="h-1.5 w-24"
                        />
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {r.bradenScore}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPressureBadgeVariant(r.level)}>
                        {r.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.lastAssessed}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
