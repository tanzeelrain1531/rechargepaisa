import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CheckCircle2, ClipboardList } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/StatusBadge";
import { DEMO_MAR_SCHEDULE, type DemoMAREntry } from "../demoData";
import { useDemoMode } from "../hooks/useDemoMode";

type SlotKey = "06:00" | "12:00" | "18:00" | "22:00";
type SlotStatus = "due" | "administered" | "held" | "refused" | "na";
type ShiftFilter = "all" | "day" | "evening" | "night";

const SLOTS: SlotKey[] = ["06:00", "12:00", "18:00", "22:00"];

// Shift definitions
const SHIFT_SLOTS: Record<ShiftFilter, SlotKey[]> = {
  all: ["06:00", "12:00", "18:00", "22:00"],
  day: ["06:00", "12:00"],
  evening: ["18:00"],
  night: ["22:00"],
};

const SHIFT_LABELS: Record<ShiftFilter, string> = {
  all: "All Shifts",
  day: "Day (06:00–14:00)",
  evening: "Evening (14:00–22:00)",
  night: "Night (22:00–06:00)",
};

type WardFilter = "All" | "ICU" | "General" | "Surgical" | "Pediatric";
const PATIENT_WARD_MAP: Record<string, WardFilter> = {
  "1": "ICU",
  "2": "ICU",
  "3": "ICU",
  "4": "General",
  "5": "General",
  "6": "General",
  "7": "Surgical",
  "8": "Surgical",
  "9": "Surgical",
  "10": "Pediatric",
  "11": "Pediatric",
  "12": "Pediatric",
};
const WARDS: WardFilter[] = ["All", "ICU", "General", "Surgical", "Pediatric"];

const slotVariant: Record<
  SlotStatus,
  "success" | "warning" | "danger" | "neutral" | "info"
> = {
  administered: "success",
  due: "warning",
  held: "neutral",
  refused: "danger",
  na: "neutral",
};

const slotLabel: Record<SlotStatus, string> = {
  administered: "Administered",
  due: "Due",
  held: "Held",
  refused: "Refused",
  na: "N/A",
};

function isOverdue(slot: SlotKey): boolean {
  const currentHour = new Date().getHours();
  const slotHour = Number.parseInt(slot.split(":")[0]);
  return currentHour > slotHour;
}

function isDueWithinOneHour(slot: SlotKey): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTotalMins = currentHour * 60 + currentMinutes;
  const slotHour = Number.parseInt(slot.split(":")[0]);
  const slotMins = slotHour * 60;
  return slotMins >= currentTotalMins && slotMins <= currentTotalMins + 60;
}

export default function MedicationAdminRecord() {
  const { isDemoMode } = useDemoMode();
  const [entries, setEntries] = useState<DemoMAREntry[]>(
    isDemoMode ? DEMO_MAR_SCHEDULE : [],
  );
  const [expandedCell, setExpandedCell] = useState<string | null>(null);
  const [actionForm, setActionForm] = useState<{
    action: "administered" | "held" | "refused";
    reason: string;
  }>({ action: "administered", reason: "" });
  const [shiftFilter, setShiftFilter] = useState<ShiftFilter>("all");
  const [wardFilter, setWardFilter] = useState<WardFilter>(() => {
    try {
      const prefs = JSON.parse(
        localStorage.getItem("medunite_prefs_Nurse") || "{}",
      );
      const w = prefs.ward as WardFilter;
      return WARDS.includes(w) ? w : "All";
    } catch {
      return "All";
    }
  });

  const visibleSlots = SHIFT_SLOTS[shiftFilter];

  const totalDue = entries.reduce(
    (acc, e) => acc + SLOTS.filter((s) => e.slots[s] === "due").length,
    0,
  );
  const totalAdministered = entries.reduce(
    (acc, e) => acc + SLOTS.filter((s) => e.slots[s] === "administered").length,
    0,
  );
  const currentHour = new Date().getHours();
  const overdue = entries.reduce((acc, e) => {
    return (
      acc +
      SLOTS.filter((s) => {
        if (e.slots[s] !== "due") return false;
        const slotHour = Number.parseInt(s.split(":")[0]);
        return currentHour > slotHour;
      }).length
    );
  }, 0);

  const cellKey = (entryId: string, slot: SlotKey) => `${entryId}:${slot}`;

  const handleCellClick = (entry: DemoMAREntry, slot: SlotKey) => {
    if (entry.slots[slot] !== "due") return;
    const key = cellKey(entry.id, slot);
    setExpandedCell((prev) => (prev === key ? null : key));
    setActionForm({ action: "administered", reason: "" });
  };

  const handleRecord = (entryId: string, slot: SlotKey) => {
    const entry = entries.find((e) => e.id === entryId);
    if (!entry) return;
    if (
      (actionForm.action === "held" || actionForm.action === "refused") &&
      !actionForm.reason.trim()
    ) {
      toast.error("A reason is required for Held or Refused status.");
      return;
    }
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? { ...e, slots: { ...e.slots, [slot]: actionForm.action } }
          : e,
      ),
    );
    setExpandedCell(null);
    toast.success(
      `${entry.medication} — ${slotLabel[actionForm.action]} at ${slot}`,
    );
  };

  // Ward filter
  const wardFilteredEntries =
    wardFilter === "All"
      ? entries
      : entries.filter(
          (e) => PATIENT_WARD_MAP[String(e.patientId)] === wardFilter,
        );

  // Group entries by patient
  const byPatient: Record<string, DemoMAREntry[]> = {};
  for (const e of wardFilteredEntries) {
    if (!byPatient[e.patientName]) byPatient[e.patientName] = [];
    byPatient[e.patientName].push(e);
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-foreground flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary" />
              Medication Administration Record
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Today —{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-3 border-b border-border bg-muted/20 flex gap-6">
        <div className="text-center">
          <div className="text-xl font-bold text-warning tabular-nums">
            {totalDue}
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Due
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-danger tabular-nums">
            {overdue}
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Overdue
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-success tabular-nums">
            {totalAdministered}
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Administered Today
          </div>
        </div>
      </div>

      {/* Shift Filter Tabs */}
      <div className="px-6 py-2.5 border-b border-border bg-card flex items-center gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2">
          Shift:
        </span>
        {(["all", "day", "evening", "night"] as ShiftFilter[]).map((s) => (
          <button
            key={s}
            type="button"
            data-ocid="mar.shift.tab"
            onClick={() => setShiftFilter(s)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-sm border transition-colors capitalize",
              shiftFilter === s
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            {s === "all"
              ? "All Shifts"
              : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        {shiftFilter !== "all" && (
          <span className="ml-2 text-xs text-muted-foreground">
            {SHIFT_LABELS[shiftFilter]}
          </span>
        )}
      </div>

      {/* Ward filter */}
      <div className="px-6 py-2.5 border-b border-border bg-card flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2">
          Ward:
        </span>
        {WARDS.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => setWardFilter(w)}
            className={[
              "px-2.5 py-1 text-xs rounded border transition-colors",
              wardFilter === w
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border text-muted-foreground hover:border-primary/40",
            ].join(" ")}
          >
            {w}
          </button>
        ))}
      </div>

      {/* MAR Grid */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {wardFilteredEntries.length === 0 ? (
          <div className="text-center py-16" data-ocid="mar.empty_state">
            <ClipboardList className="w-8 h-8 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No medications scheduled for today
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(byPatient).map(([patientName, patientEntries]) => (
              <div
                key={patientName}
                className="border border-border rounded-sm bg-card"
              >
                {/* Patient header */}
                <div className="px-4 py-2 border-b border-border bg-muted/50 flex items-center gap-3">
                  <span className="text-xs font-semibold text-foreground">
                    {patientName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {patientEntries[0].room}
                  </span>
                </div>

                {/* Table header */}
                <div
                  className="grid items-center px-4 py-2 bg-muted/50 border-b border-border"
                  style={{
                    gridTemplateColumns: `1fr 80px 60px repeat(${visibleSlots.length}, 120px)`,
                  }}
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Medication
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Nurse
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Notes
                  </div>
                  {visibleSlots.map((slot) => (
                    <div
                      key={slot}
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {slot}
                    </div>
                  ))}
                </div>

                {/* Medication rows */}
                <div className="divide-y divide-border">
                  {patientEntries.map((entry, ei) => {
                    // Check if any visible slot's due dose is within 1 hour
                    const hasDueSoon = visibleSlots.some(
                      (s) => entry.slots[s] === "due" && isDueWithinOneHour(s),
                    );
                    // Check if any slot is overdue and still "due" (not administered)
                    const hasOverdue = visibleSlots.some(
                      (s) => entry.slots[s] === "due" && isOverdue(s),
                    );
                    return (
                      <div key={entry.id}>
                        <div
                          className={cn(
                            "grid items-center px-4 py-2.5",
                            hasOverdue
                              ? "border-l-2 border-warning bg-warning/5"
                              : hasDueSoon && "border-l-4 border-amber-400",
                          )}
                          style={{
                            gridTemplateColumns: `1fr 80px 60px repeat(${visibleSlots.length}, 120px)`,
                          }}
                          data-ocid={`mar.row.${ei + 1}`}
                        >
                          {/* Medication */}
                          <div>
                            <div className="text-xs font-medium text-foreground">
                              {entry.medication}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {entry.dose} · {entry.route}
                            </div>
                          </div>

                          {/* Administered by */}
                          <div className="text-xs text-muted-foreground truncate pr-2">
                            {entry.administeredBy ?? "—"}
                          </div>

                          {/* Notes indicator */}
                          <div>
                            {entry.notes && (
                              <span className="text-xs text-warning font-medium">
                                Note
                              </span>
                            )}
                          </div>

                          {/* Slot cells */}
                          {visibleSlots.map((slot) => {
                            const status = (entry.slots[slot] ??
                              "na") as SlotStatus;
                            const isDue = status === "due";
                            const isOverdueSlot = isDue && isOverdue(slot);
                            const variant = isOverdueSlot
                              ? "danger"
                              : slotVariant[status];
                            const label = isOverdueSlot
                              ? "Overdue"
                              : slotLabel[status];
                            return (
                              <div key={slot} className="pr-2">
                                <button
                                  type="button"
                                  data-ocid="mar.slot.button"
                                  disabled={status !== "due"}
                                  onClick={() => handleCellClick(entry, slot)}
                                  className={cn(
                                    "flex items-center",
                                    isDue &&
                                      !isOverdueSlot &&
                                      "cursor-pointer hover:opacity-80",
                                  )}
                                >
                                  <StatusBadge
                                    variant={variant}
                                    label={label}
                                  />
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Inline action rows for each expanded slot */}
                        {SLOTS.map((slot) => {
                          const key = cellKey(entry.id, slot);
                          if (expandedCell !== key) return null;
                          return (
                            <div
                              key={key}
                              className="px-4 pb-3 pt-1 bg-muted/20 border-t border-border"
                              data-ocid="mar.action.panel"
                            >
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                Record Administration — {slot}
                              </p>
                              <div className="flex flex-wrap gap-3 items-end">
                                <div className="flex gap-2">
                                  {(
                                    ["administered", "held", "refused"] as const
                                  ).map((act) => (
                                    <button
                                      key={act}
                                      type="button"
                                      data-ocid={`mar.action.${act}_button`}
                                      onClick={() =>
                                        setActionForm((p) => ({
                                          ...p,
                                          action: act,
                                        }))
                                      }
                                      className={cn(
                                        "h-7 px-3 text-xs font-semibold rounded-sm border transition-all capitalize",
                                        actionForm.action === act
                                          ? act === "administered"
                                            ? "bg-success text-success-foreground border-success"
                                            : "bg-danger text-danger-foreground border-danger"
                                          : "border-border text-foreground hover:bg-muted",
                                      )}
                                    >
                                      {act}
                                    </button>
                                  ))}
                                </div>
                                {(actionForm.action === "held" ||
                                  actionForm.action === "refused") && (
                                  <div className="flex-1 min-w-48">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                      Reason (required)
                                    </Label>
                                    <Textarea
                                      data-ocid="mar.action.textarea"
                                      value={actionForm.reason}
                                      onChange={(e) =>
                                        setActionForm((p) => ({
                                          ...p,
                                          reason: e.target.value,
                                        }))
                                      }
                                      rows={2}
                                      className="mt-1 text-xs resize-none"
                                      placeholder="Document reason..."
                                    />
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    data-ocid="mar.action.save_button"
                                    onClick={() => handleRecord(entry.id, slot)}
                                    className="h-7 text-xs"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    data-ocid="mar.action.cancel_button"
                                    onClick={() => setExpandedCell(null)}
                                    className="h-7 text-xs"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
