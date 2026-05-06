import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { Activity, Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { DEMO_PATIENTS } from "../demoData";

type IOType = "intake" | "output";

interface IOEntry {
  id: string;
  type: IOType;
  category: string;
  amount: number;
  time: string;
  nurse: string;
  note?: string;
}

const INTAKE_CATEGORIES = [
  "IV Fluids",
  "Oral",
  "Tube Feed",
  "Blood Product",
  "TPN",
];
const OUTPUT_CATEGORIES = [
  "Urine",
  "Drain",
  "Emesis",
  "Stool",
  "Nasogastric",
  "Wound",
];

const SEED_DATA: Record<string, IOEntry[]> = {
  "James Harrington": [
    {
      id: "io-1",
      type: "intake",
      category: "IV Fluids",
      amount: 250,
      time: "07:00",
      nurse: "RN. Sarah Park",
    },
    {
      id: "io-2",
      type: "intake",
      category: "IV Fluids",
      amount: 250,
      time: "11:00",
      nurse: "RN. Sarah Park",
    },
    {
      id: "io-3",
      type: "intake",
      category: "Oral",
      amount: 180,
      time: "08:30",
      nurse: "RN. Sarah Park",
    },
    {
      id: "io-4",
      type: "intake",
      category: "Oral",
      amount: 120,
      time: "13:00",
      nurse: "RN. Sarah Park",
    },
    {
      id: "io-5",
      type: "output",
      category: "Urine",
      amount: 200,
      time: "08:00",
      nurse: "RN. Sarah Park",
    },
    {
      id: "io-6",
      type: "output",
      category: "Urine",
      amount: 175,
      time: "11:30",
      nurse: "RN. Sarah Park",
    },
    {
      id: "io-7",
      type: "output",
      category: "Drain",
      amount: 45,
      time: "09:00",
      nurse: "RN. Sarah Park",
      note: "JP drain — serosanguineous",
    },
    {
      id: "io-8",
      type: "output",
      category: "Drain",
      amount: 30,
      time: "13:00",
      nurse: "RN. Sarah Park",
    },
  ],
  "Margaret Chen": [
    {
      id: "io-9",
      type: "intake",
      category: "Oral",
      amount: 240,
      time: "07:30",
      nurse: "RN. Maria Gonzalez",
    },
    {
      id: "io-10",
      type: "intake",
      category: "Oral",
      amount: 180,
      time: "12:00",
      nurse: "RN. Maria Gonzalez",
    },
    {
      id: "io-11",
      type: "intake",
      category: "IV Fluids",
      amount: 125,
      time: "10:00",
      nurse: "RN. Maria Gonzalez",
    },
    {
      id: "io-12",
      type: "output",
      category: "Urine",
      amount: 320,
      time: "09:00",
      nurse: "RN. Maria Gonzalez",
    },
    {
      id: "io-13",
      type: "output",
      category: "Urine",
      amount: 280,
      time: "13:00",
      nurse: "RN. Maria Gonzalez",
    },
  ],
  "Linda Washington": [
    {
      id: "io-14",
      type: "intake",
      category: "IV Fluids",
      amount: 500,
      time: "06:00",
      nurse: "RN. Angela Reyes",
      note: "Normal saline 0.9%",
    },
    {
      id: "io-15",
      type: "intake",
      category: "IV Fluids",
      amount: 500,
      time: "10:00",
      nurse: "RN. Angela Reyes",
    },
    {
      id: "io-16",
      type: "output",
      category: "Urine",
      amount: 60,
      time: "08:00",
      nurse: "RN. Angela Reyes",
      note: "Dialysis patient — low UO expected",
    },
    {
      id: "io-17",
      type: "output",
      category: "Urine",
      amount: 40,
      time: "12:00",
      nurse: "RN. Angela Reyes",
    },
  ],
};

const patientNames = DEMO_PATIENTS.slice(0, 10).map((p) => p.name);

// Get 8-hour period label for a time
function get8HourPeriod(time: string): string {
  const hour = Number.parseInt(time.split(":")[0] ?? "0");
  if (hour >= 7 && hour < 15) return "07:00–15:00";
  if (hour >= 15 && hour < 23) return "15:00–23:00";
  return "23:00–07:00";
}

export default function IOTracking({
  onNavigate: _onNavigate,
}: { onNavigate: (page: string) => void }) {
  const [selectedPatient, setSelectedPatient] = useState(patientNames[0] ?? "");
  const [entries, setEntries] = useState<Record<string, IOEntry[]>>(SEED_DATA);
  const [loading] = useState(false);
  const { actor } = useActor();
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [showOutputForm, setShowOutputForm] = useState(false);

  const [intakeForm, setIntakeForm] = useState({
    category: "IV Fluids",
    amount: "",
    time: "",
    nurse: "",
    note: "",
  });
  const [outputForm, setOutputForm] = useState({
    category: "Urine",
    amount: "",
    time: "",
    nurse: "",
    note: "",
  });

  const patientEntries = entries[selectedPatient] ?? [];
  const intakeEntries = patientEntries
    .filter((e) => e.type === "intake")
    .sort((a, b) => a.time.localeCompare(b.time));
  const outputEntries = patientEntries
    .filter((e) => e.type === "output")
    .sort((a, b) => a.time.localeCompare(b.time));
  const totalIntake = intakeEntries.reduce((s, e) => s + e.amount, 0);
  const totalOutput = outputEntries.reduce((s, e) => s + e.amount, 0);
  const fluidBalance = totalIntake - totalOutput;

  const addEntry = (type: IOType, form: typeof intakeForm) => {
    if (!form.amount || !form.time || !form.nurse) return;
    const entry: IOEntry = {
      id: `io-${Date.now()}`,
      type,
      category: form.category,
      amount: Number(form.amount),
      time: form.time,
      nurse: form.nurse,
      note: form.note || undefined,
    };
    setEntries((prev) => ({
      ...prev,
      [selectedPatient]: [...(prev[selectedPatient] ?? []), entry],
    }));
    if (actor) {
      actor
        .createClinicalNote(1n, "io-tracking", JSON.stringify(entry), 1n)
        .then(() => toast.success("I&O entry saved"))
        .catch(() => {});
    }
    if (type === "intake") {
      setIntakeForm({
        category: "IV Fluids",
        amount: "",
        time: "",
        nurse: "",
        note: "",
      });
      setShowIntakeForm(false);
    } else {
      setOutputForm({
        category: "Urine",
        amount: "",
        time: "",
        nurse: "",
        note: "",
      });
      setShowOutputForm(false);
    }
  };

  const IOForm = ({
    type,
    form,
    setForm,
    onClose,
  }: {
    type: IOType;
    form: typeof intakeForm;
    setForm: React.Dispatch<React.SetStateAction<typeof intakeForm>>;
    onClose: () => void;
  }) => (
    <div
      className="mt-2 p-3 bg-muted/30 border border-border rounded-sm space-y-2"
      data-ocid={`io.${type}-form.panel`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Log {type === "intake" ? "Intake" : "Output"} Entry
      </p>
      <div className="grid grid-cols-4 gap-2">
        <div>
          <label
            htmlFor={`io-${type}-cat`}
            className="block text-xs text-muted-foreground mb-0.5"
          >
            Type
          </label>
          <select
            id={`io-${type}-cat`}
            data-ocid={`io.${type}-category.select`}
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
            className="w-full h-7 px-1.5 text-xs bg-background border border-input rounded-sm focus:outline-none"
          >
            {(type === "intake" ? INTAKE_CATEGORIES : OUTPUT_CATEGORIES).map(
              (c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ),
            )}
          </select>
        </div>
        <div>
          <label
            htmlFor={`io-${type}-amt`}
            className="block text-xs text-muted-foreground mb-0.5"
          >
            Amount (mL)
          </label>
          <input
            type="number"
            id={`io-${type}-amt`}
            data-ocid={`io.${type}-amount.input`}
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            placeholder="0"
            className="w-full h-7 px-1.5 text-xs bg-background border border-input rounded-sm focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor={`io-${type}-time`}
            className="block text-xs text-muted-foreground mb-0.5"
          >
            Time
          </label>
          <input
            type="time"
            id={`io-${type}-time`}
            data-ocid={`io.${type}-time.input`}
            value={form.time}
            onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
            className="w-full h-7 px-1.5 text-xs bg-background border border-input rounded-sm focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor={`io-${type}-nurse`}
            className="block text-xs text-muted-foreground mb-0.5"
          >
            Nurse
          </label>
          <input
            type="text"
            id={`io-${type}-nurse`}
            data-ocid={`io.${type}-nurse.input`}
            value={form.nurse}
            onChange={(e) => setForm((f) => ({ ...f, nurse: e.target.value }))}
            placeholder="RN. Name"
            className="w-full h-7 px-1.5 text-xs bg-background border border-input rounded-sm focus:outline-none"
          />
        </div>
        <div className="col-span-4">
          <label
            htmlFor={`io-${type}-note`}
            className="block text-xs text-muted-foreground mb-0.5"
          >
            Notes (optional)
          </label>
          <input
            type="text"
            id={`io-${type}-note`}
            data-ocid={`io.${type}-note.input`}
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            placeholder="Additional notes..."
            className="w-full h-7 px-1.5 text-xs bg-background border border-input rounded-sm focus:outline-none"
          />
        </div>
      </div>
      <div className="flex gap-1.5">
        <Button
          size="sm"
          data-ocid={`io.${type}-submit.button`}
          onClick={() => addEntry(type, form)}
          className="h-6 text-xs"
        >
          Save Entry
        </Button>
        <Button
          size="sm"
          variant="ghost"
          data-ocid={`io.${type}-cancel.button`}
          onClick={onClose}
          className="h-6 text-xs"
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  // Group entries by 8-hour period
  function renderEntryTable(entriesList: IOEntry[], type: IOType) {
    const periods: Record<string, IOEntry[]> = {};
    for (const e of entriesList) {
      const period = get8HourPeriod(e.time);
      if (!periods[period]) periods[period] = [];
      periods[period].push(e);
    }
    const periodOrder = ["07:00–15:00", "15:00–23:00", "23:00–07:00"];
    const sortedPeriods = periodOrder.filter((p) => periods[p]);

    return (
      <div className="overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Type
              </th>
              <th className="text-right px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Amount (mL)
              </th>
              <th className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Time
              </th>
              <th className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Nurse
              </th>
              <th className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Note
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPeriods.map((period) => {
              const periodEntries = periods[period] ?? [];
              const subtotal = periodEntries.reduce((s, e) => s + e.amount, 0);
              return (
                <React.Fragment key={period}>
                  {periodEntries.map((e, ei) => (
                    <tr
                      key={e.id}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      data-ocid={`io.${type}.item.${ei + 1}`}
                    >
                      <td className="px-3 py-2 text-foreground">
                        {e.category}
                      </td>
                      <td className="px-3 py-2 text-right font-medium tabular-nums text-foreground">
                        {e.amount}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {e.time}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {e.nurse}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground italic text-xs">
                        {e.note ?? ""}
                      </td>
                    </tr>
                  ))}
                  {/* 8-hour subtotal row */}
                  <tr className="bg-muted/30 border-b border-border">
                    <td className="px-3 py-1.5" colSpan={1}>
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {period} Subtotal
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-right font-bold text-foreground tabular-nums">
                      {subtotal} mL
                    </td>
                    <td colSpan={3} />
                  </tr>
                </React.Fragment>
              );
            })}
            {entriesList.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-[12px] text-muted-foreground italic"
                >
                  No {type} entries recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="io-tracking.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Intake &amp; Output Tracking
          </h2>
          <span className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded-sm font-medium">
            24-Hour
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            data-ocid="io.patient.select"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="h-7 px-2 text-[12px] bg-background border border-input rounded-sm focus:outline-none min-w-[160px]"
          >
            {patientNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fluid Balance Summary Card */}
      <div className="grid grid-cols-3 gap-3" data-ocid="io.balance.section">
        <Card className="border shadow-card">
          <CardContent className="px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
              Total Intake
            </p>
            <p className="text-2xl font-bold tabular-nums text-primary">
              {totalIntake}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                mL
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {intakeEntries.length} entries
            </p>
          </CardContent>
        </Card>
        <Card className="border shadow-card">
          <CardContent className="px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-warning mb-1">
              Total Output
            </p>
            <p className="text-2xl font-bold tabular-nums text-warning">
              {totalOutput}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                mL
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {outputEntries.length} entries
            </p>
          </CardContent>
        </Card>
        <Card className="border shadow-card">
          <CardContent className="px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Net Balance
            </p>
            <p
              className={`text-2xl font-bold tabular-nums ${fluidBalance >= 0 ? "text-success" : "text-destructive"}`}
            >
              {fluidBalance >= 0 ? "+" : ""}
              {fluidBalance}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                mL
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {fluidBalance >= 0 ? "Positive balance" : "Negative balance"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-2" data-ocid="io-tracking.loading_state">
          {[1, 2, 3].map((k) => (
            <div
              key={k}
              className="bg-card border border-border rounded-sm p-4"
            >
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* Intake Panel */}
          <Card className="border shadow-card" data-ocid="io.intake.panel">
            <CardHeader className="px-4 py-3 border-b border-border flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-primary" />
                Intake
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary tabular-nums">
                  {totalIntake} mL
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid="io.add-intake.button"
                  onClick={() => setShowIntakeForm((v) => !v)}
                  className="h-6 text-xs gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {showIntakeForm && (
                <div className="p-3 border-b border-border">
                  <IOForm
                    type="intake"
                    form={intakeForm}
                    setForm={setIntakeForm}
                    onClose={() => setShowIntakeForm(false)}
                  />
                </div>
              )}
              {renderEntryTable(intakeEntries, "intake")}
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card className="border shadow-card" data-ocid="io.output.panel">
            <CardHeader className="px-4 py-3 border-b border-border flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Minus className="w-3.5 h-3.5 text-warning" />
                Output
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-warning tabular-nums">
                  {totalOutput} mL
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid="io.add-output.button"
                  onClick={() => setShowOutputForm((v) => !v)}
                  className="h-6 text-xs gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {showOutputForm && (
                <div className="p-3 border-b border-border">
                  <IOForm
                    type="output"
                    form={outputForm}
                    setForm={setOutputForm}
                    onClose={() => setShowOutputForm(false)}
                  />
                </div>
              )}
              {renderEntryTable(outputEntries, "output")}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
