import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { CheckCircle, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PatientFilterBar } from "../components/PatientFilterBar";
import { DEMO_PROBLEMS, type DemoProblem } from "../demoData";

type Problem = DemoProblem;

export default function ProblemList({
  activePatientId,
  activePatientName,
  onClearFilter,
}: {
  activePatientId?: bigint;
  activePatientName?: string;
  onClearFilter?: () => void;
}) {
  const [problems, setProblems] = useState<Problem[]>(DEMO_PROBLEMS);
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({
    name: "",
    icd10: "",
    dateOnset: "",
    status: "active",
    severity: "Moderate",
  });

  const displayedProblems = activePatientId
    ? problems.filter((p) => p.patientId === activePatientId)
    : problems;

  const handleAddProblem = () => {
    if (!form.name.trim()) {
      toast.error("Problem name is required");
      return;
    }
    const newProblem: Problem = {
      id: Date.now(),
      patientId: activePatientId ?? 1n,
      ...form,
    };
    setProblems((prev) => [newProblem, ...prev]);
    setForm({
      name: "",
      icd10: "",
      dateOnset: "",
      status: "active",
      severity: "Moderate",
    });
    setExpanded(false);
    toast.success(`Problem "${form.name}" added`);
  };

  const handleResolve = (id: number) => {
    setProblems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "resolved", resolved: true } : p,
      ),
    );
    toast.success("Problem marked as resolved");
  };

  return (
    <div className="p-5 space-y-5" data-ocid="problem_list.page">
      {activePatientId && activePatientName && (
        <PatientFilterBar
          patientName={activePatientName}
          onClear={onClearFilter ?? (() => {})}
        />
      )}
      {/* Add Problem Form */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Problem List
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              data-ocid="problem_list.open_modal_button"
              onClick={() => setExpanded((v) => !v)}
              className="gap-1.5"
            >
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              {expanded ? "Cancel" : "Add Problem"}
            </Button>
          </div>
        </CardHeader>

        {expanded && (
          <CardContent className="border-t border-border pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="prob-name" className="text-xs">
                  Problem Name
                </Label>
                <Input
                  id="prob-name"
                  data-ocid="problem_list.input"
                  placeholder="e.g. Type 2 Diabetes"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prob-icd" className="text-xs">
                  ICD-10 Code
                </Label>
                <Input
                  id="prob-icd"
                  data-ocid="problem_list.icd10.input"
                  placeholder="e.g. E11.9"
                  value={form.icd10}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, icd10: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prob-onset" className="text-xs">
                  Date of Onset
                </Label>
                <Input
                  id="prob-onset"
                  type="date"
                  data-ocid="problem_list.date.input"
                  value={form.dateOnset}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dateOnset: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
                >
                  <SelectTrigger data-ocid="problem_list.status.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="chronic">Chronic</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Severity</Label>
                <Select
                  value={form.severity}
                  onValueChange={(v) => setForm((f) => ({ ...f, severity: v }))}
                >
                  <SelectTrigger data-ocid="problem_list.severity.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mild">Mild</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                size="sm"
                data-ocid="problem_list.submit_button"
                onClick={handleAddProblem}
              >
                Save Problem
              </Button>
            </div>
          </CardContent>
        )}

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {!activePatientId && (
                  <TableHead className="w-36">Patient</TableHead>
                )}
                <TableHead>Problem</TableHead>
                <TableHead className="w-24">ICD-10</TableHead>
                <TableHead className="w-28">Date Onset</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="w-24">Severity</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedProblems.length === 0 ? (
                <TableRow data-ocid="problem_list.empty_state">
                  <TableCell
                    colSpan={activePatientId ? 6 : 7}
                    className="text-center text-muted-foreground py-8 text-sm"
                  >
                    No problems recorded
                  </TableCell>
                </TableRow>
              ) : (
                displayedProblems.map((p, idx) => (
                  <TableRow
                    key={p.id}
                    data-ocid={`problem_list.item.${idx + 1}`}
                    className={p.status === "resolved" ? "opacity-50" : ""}
                  >
                    {!activePatientId && (
                      <TableCell className="text-xs text-muted-foreground">
                        #{String(p.patientId)}
                      </TableCell>
                    )}
                    <TableCell className="text-sm font-medium">
                      {p.name}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {p.icd10}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {p.dateOnset || "\u2014"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm border ${
                          p.status === "active"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : p.status === "chronic"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {p.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {p.severity}
                    </TableCell>
                    <TableCell>
                      {p.status !== "resolved" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          data-ocid={`problem_list.resolve_button.${idx + 1}`}
                          onClick={() => handleResolve(p.id)}
                          className="h-7 gap-1 text-xs"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Resolve
                        </Button>
                      )}
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
