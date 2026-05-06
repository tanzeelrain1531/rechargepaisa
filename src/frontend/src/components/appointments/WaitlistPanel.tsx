import { StatusBadge } from "@/components/StatusBadge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Clock, Plus, Trash2 } from "lucide-react";
import type { DemoWaitlistEntry } from "../../demoData";

interface WaitlistForm {
  patientName: string;
  reason: string;
  priority: "urgent" | "routine";
}

interface WaitlistPanelProps {
  waitlist: DemoWaitlistEntry[];
  waitlistForm: WaitlistForm;
  setWaitlistForm: React.Dispatch<React.SetStateAction<WaitlistForm>>;
  waitlistExpanded: boolean;
  setWaitlistExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  showWaitlistForm: boolean;
  setShowWaitlistForm: React.Dispatch<React.SetStateAction<boolean>>;
  onAddToWaitlist: () => void;
  onNotify: (id: string) => void;
  onSchedule: (entry: DemoWaitlistEntry) => void;
  onRemove: (id: string) => void;
}

export function WaitlistPanel({
  waitlist,
  waitlistForm,
  setWaitlistForm,
  waitlistExpanded,
  setWaitlistExpanded,
  showWaitlistForm,
  setShowWaitlistForm,
  onAddToWaitlist,
  onNotify,
  onSchedule,
  onRemove,
}: WaitlistPanelProps) {
  return (
    <div
      className="bg-card border border-border"
      data-ocid="appointments.waitlist.panel"
    >
      <button
        type="button"
        data-ocid="appointments.waitlist.toggle"
        onClick={() => setWaitlistExpanded((v) => !v)}
        className="w-full px-4 py-3 border-b border-border flex items-center gap-2 hover:bg-muted/30 transition-colors text-left"
      >
        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground flex-1">
          Waitlist
        </h2>
        <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold bg-warning/10 text-warning border border-warning/30 rounded-sm">
          {waitlist.filter((e) => e.status === "waiting").length} waiting
        </span>
        {waitlistExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground ml-1" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground ml-1" />
        )}
      </button>

      {waitlistExpanded && (
        <>
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {waitlist.length} patient{waitlist.length !== 1 ? "s" : ""} on
              list
            </span>
            <Button
              size="sm"
              variant="outline"
              data-ocid="appointments.waitlist.open_modal_button"
              onClick={() => setShowWaitlistForm((v) => !v)}
              className="h-7 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add to Waitlist
            </Button>
          </div>

          {showWaitlistForm && (
            <div
              className="px-4 py-3 bg-muted/20 border-b border-border space-y-3"
              data-ocid="appointments.waitlist.form.panel"
            >
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Add Patient to Waitlist
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Patient Name
                  </Label>
                  <Input
                    data-ocid="appointments.waitlist.patient.input"
                    value={waitlistForm.patientName}
                    onChange={(e) =>
                      setWaitlistForm((p) => ({
                        ...p,
                        patientName: e.target.value,
                      }))
                    }
                    placeholder="Full name"
                    className="mt-1 h-8 text-sm"
                  />
                </div>
                <div className="sm:col-span-1">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Reason
                  </Label>
                  <Input
                    data-ocid="appointments.waitlist.reason.input"
                    value={waitlistForm.reason}
                    onChange={(e) =>
                      setWaitlistForm((p) => ({
                        ...p,
                        reason: e.target.value,
                      }))
                    }
                    placeholder="Reason for visit"
                    className="mt-1 h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    Priority
                  </Label>
                  <Select
                    value={waitlistForm.priority}
                    onValueChange={(v) =>
                      setWaitlistForm((p) => ({
                        ...p,
                        priority: v as "urgent" | "routine",
                      }))
                    }
                  >
                    <SelectTrigger
                      data-ocid="appointments.waitlist.priority.select"
                      className="mt-1 h-8 text-sm"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="routine">Routine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  data-ocid="appointments.waitlist.submit_button"
                  onClick={onAddToWaitlist}
                  className="h-7 text-xs"
                >
                  Add to Waitlist
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid="appointments.waitlist.cancel_button"
                  onClick={() => {
                    setShowWaitlistForm(false);
                    setWaitlistForm({
                      patientName: "",
                      reason: "",
                      priority: "routine",
                    });
                  }}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {waitlist.length === 0 ? (
            <div
              className="px-4 py-8 text-center"
              data-ocid="appointments.waitlist.empty_state"
            >
              <Clock className="w-6 h-6 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No patients on the waitlist
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Patient
                  </TableHead>
                  <TableHead className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Reason
                  </TableHead>
                  <TableHead className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Date Added
                  </TableHead>
                  <TableHead className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Priority
                  </TableHead>
                  <TableHead className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlist.map((entry, i) => (
                  <TableRow
                    key={entry.id}
                    data-ocid={`appointments.waitlist.item.${i + 1}`}
                    className="hover:bg-muted/20"
                  >
                    <TableCell className="px-4 py-2.5 font-medium text-sm text-foreground">
                      {entry.patientName}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 text-xs text-muted-foreground max-w-xs">
                      {entry.reason}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 text-xs text-muted-foreground font-mono">
                      {entry.dateAdded}
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <StatusBadge
                        variant={
                          entry.priority === "urgent" ? "danger" : "neutral"
                        }
                        label={entry.priority}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <StatusBadge
                        variant={
                          entry.status === "waiting"
                            ? "warning"
                            : entry.status === "notified"
                              ? "info"
                              : "success"
                        }
                        label={entry.status}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        {entry.status === "waiting" && (
                          <button
                            type="button"
                            data-ocid={`appointments.waitlist.primary_button.${i + 1}`}
                            onClick={() => onNotify(entry.id)}
                            className="px-2 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-sm hover:bg-primary/20 transition-colors"
                          >
                            Notify
                          </button>
                        )}
                        <button
                          type="button"
                          data-ocid={`appointments.waitlist.secondary_button.${i + 1}`}
                          onClick={() => onSchedule(entry)}
                          className="px-2 py-1 text-xs font-semibold bg-muted text-muted-foreground border border-border rounded-sm hover:bg-muted/80 transition-colors"
                        >
                          Schedule
                        </button>
                        <button
                          type="button"
                          data-ocid={`appointments.waitlist.delete_button.${i + 1}`}
                          onClick={() => onRemove(entry.id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded-sm"
                          aria-label="Remove from waitlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </div>
  );
}
