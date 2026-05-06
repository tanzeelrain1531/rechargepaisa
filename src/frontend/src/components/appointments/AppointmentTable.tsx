import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Bell, CheckSquare, Stethoscope, Video } from "lucide-react";

type StatusVariant = "info" | "warning" | "success" | "danger" | "neutral";

const statusVariant: Record<string, StatusVariant> = {
  scheduled: "info",
  "in-progress": "warning",
  completed: "success",
  cancelled: "danger",
  "no-show": "neutral",
};

type ReminderStatus = "sent" | "scheduled" | "failed" | "not-set";

interface ReminderInfo {
  method: "SMS" | "Email" | "Both";
  scheduledTime: string;
  status: ReminderStatus;
  lastSent?: string;
}

const REMINDER_VARIANTS: Record<
  ReminderStatus,
  "success" | "info" | "danger" | "neutral"
> = {
  sent: "success",
  scheduled: "info",
  failed: "danger",
  "not-set": "neutral",
};

const REMINDER_LABELS: Record<ReminderStatus, string> = {
  sent: "Sent ✓",
  scheduled: "Scheduled",
  failed: "Failed",
  "not-set": "Not Set",
};

interface Appointment {
  id: bigint;
  patientId: bigint;
  providerId: bigint;
  date: string;
  status: string;
  reason?: string;
}

interface AppointmentTableProps {
  appts: Appointment[];
  loading: boolean;
  selectedIds: Set<string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  toggleSelectAll: () => void;
  reminders: Record<string, ReminderInfo>;
  setReminder: (id: string, info: Partial<ReminderInfo>) => void;
  expandedReminder: string | null;
  setExpandedReminder: React.Dispatch<React.SetStateAction<string | null>>;
  videoApptIds: Set<string>;
  getPatientName: (patientId: bigint) => string;
  handleStatusChange: (id: bigint, newStatus: string) => void;
  handleBulkStatusChange: (newStatus: string) => void;
  handleSendNow: (id: string) => void;
  onStartEncounter: (appointmentId: bigint, patientId: bigint) => void;
  onNavigate?: (page: string) => void;
}

export function AppointmentTable({
  appts,
  loading,
  selectedIds,
  setSelectedIds,
  toggleSelectAll,
  reminders,
  setReminder,
  expandedReminder,
  setExpandedReminder,
  videoApptIds,
  getPatientName,
  handleStatusChange,
  handleBulkStatusChange,
  handleSendNow,
  onStartEncounter,
  onNavigate,
}: AppointmentTableProps) {
  const getReminder = (id: string): ReminderInfo =>
    reminders[id] ?? {
      method: "Email",
      scheduledTime: "24 hours before",
      status: "not-set",
    };

  return (
    <div className="bg-card border border-border">
      {/* Bulk action toolbar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-primary/5">
          <span className="text-xs font-semibold text-foreground">
            {selectedIds.size} selected
          </span>
          <Button
            size="sm"
            variant="outline"
            data-ocid="appointments.bulk_complete_button"
            onClick={() => handleBulkStatusChange("completed")}
            className="h-7 text-xs text-success border-success/30 hover:bg-success/10"
          >
            <CheckSquare className="w-3 h-3 mr-1" />
            Complete All
          </Button>
          <Button
            size="sm"
            variant="outline"
            data-ocid="appointments.bulk_cancel_button"
            onClick={() => handleBulkStatusChange("cancelled")}
            className="h-7 text-xs"
          >
            Cancel All
          </Button>
          <Button
            size="sm"
            variant="outline"
            data-ocid="appointments.bulk_noshow_button"
            onClick={() => handleBulkStatusChange("no-show")}
            className="h-7 text-xs text-warning border-warning/30 hover:bg-warning/10"
          >
            No-Show All
          </Button>
          <Button
            size="sm"
            variant="ghost"
            data-ocid="appointments.bulk_clear_button"
            onClick={() => setSelectedIds(new Set())}
            className="h-7 text-xs ml-auto"
          >
            Clear Selection
          </Button>
        </div>
      )}
      {loading ? (
        <div
          className="py-12 text-center text-sm text-muted-foreground"
          data-ocid="appointments.loading_state"
        >
          Loading appointments...
        </div>
      ) : (
        <Table data-ocid="appointments.table">
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="w-10 px-4">
                <Checkbox
                  data-ocid="appointments.select_all.checkbox"
                  checked={
                    appts.filter((a) => a.status === "scheduled").length > 0 &&
                    appts
                      .filter((a) => a.status === "scheduled")
                      .every((a) => selectedIds.has(String(a.id)))
                  }
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all scheduled"
                />
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Patient
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Date &amp; Time
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Provider ID
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4 w-32">
                Reason
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Reminder
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4 text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-sm text-muted-foreground"
                  data-ocid="appointments.empty_state"
                >
                  No appointments found. Book one above.
                </TableCell>
              </TableRow>
            ) : (
              appts.map((a, i) => (
                <TableRow
                  key={String(a.id)}
                  data-ocid={`appointments.row.${i + 1}`}
                  className="hover:bg-muted/30 even:bg-muted/20 border-l-2 border-l-transparent hover:border-l-accent transition-all"
                >
                  <TableCell className="w-10 px-4">
                    {a.status === "scheduled" && (
                      <Checkbox
                        data-ocid={`appointments.checkbox.${i + 1}`}
                        checked={selectedIds.has(String(a.id))}
                        onCheckedChange={(checked) => {
                          setSelectedIds((prev) => {
                            const next = new Set(prev);
                            if (checked) next.add(String(a.id));
                            else next.delete(String(a.id));
                            return next;
                          });
                        }}
                        aria-label={`Select appointment ${i + 1}`}
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-sm px-4 py-2.5">
                    <button
                      type="button"
                      className="cursor-pointer text-primary hover:underline font-medium"
                      data-ocid="appointments.patient.link"
                      onClick={() => onNavigate?.("patients")}
                    >
                      {getPatientName(a.patientId)}
                    </button>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground px-4 py-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>{a.date.replace("T", " ")}</span>
                      {(a as any).seriesId && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-sm">
                          ↻ Recurring
                        </span>
                      )}
                      {videoApptIds.has(String(a.id)) && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-sm">
                          <Video className="w-2.5 h-2.5" />
                          Video
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground px-4 py-2.5">
                    {String(a.providerId)}
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    <StatusBadge
                      variant={statusVariant[a.status] ?? "neutral"}
                      label={a.status}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-2.5 text-xs text-muted-foreground max-w-[128px] truncate">
                    {a.reason || "—"}
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    {(() => {
                      const rid = String(a.id);
                      const rem = getReminder(rid);
                      return (
                        <div>
                          <button
                            type="button"
                            data-ocid={`appointments.reminder.toggle.${i + 1}`}
                            onClick={() =>
                              setExpandedReminder(
                                expandedReminder === rid ? null : rid,
                              )
                            }
                            className="inline-flex items-center gap-1"
                          >
                            <StatusBadge
                              variant={REMINDER_VARIANTS[rem.status]}
                              label={REMINDER_LABELS[rem.status]}
                            />
                            <Bell className="w-3 h-3 text-muted-foreground ml-0.5" />
                          </button>
                          {expandedReminder === rid && (
                            <div className="mt-2 bg-muted/30 border border-border p-2.5 text-xs space-y-2 min-w-[220px]">
                              <div>
                                <span className="font-semibold text-muted-foreground">
                                  Method:{" "}
                                </span>
                                <Select
                                  value={rem.method}
                                  onValueChange={(v) =>
                                    setReminder(rid, {
                                      method: v as "SMS" | "Email" | "Both",
                                    })
                                  }
                                >
                                  <SelectTrigger
                                    data-ocid={`appointments.reminder.method.select.${i + 1}`}
                                    className="mt-0.5 h-6 text-xs w-28 inline-flex"
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="SMS">SMS</SelectItem>
                                    <SelectItem value="Email">Email</SelectItem>
                                    <SelectItem value="Both">Both</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <p>
                                <span className="font-semibold text-muted-foreground">
                                  Scheduled:{" "}
                                </span>
                                {rem.scheduledTime}
                              </p>
                              {rem.lastSent && (
                                <p>
                                  <span className="font-semibold text-muted-foreground">
                                    Last sent:{" "}
                                  </span>
                                  {rem.lastSent}
                                </p>
                              )}
                              <div className="flex gap-1.5 pt-1">
                                <Button
                                  size="sm"
                                  data-ocid={`appointments.reminder.primary_button.${i + 1}`}
                                  onClick={() => handleSendNow(rid)}
                                  className="h-6 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                  Send Now
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  data-ocid={`appointments.reminder.secondary_button.${i + 1}`}
                                  onClick={() =>
                                    setReminder(rid, { status: "scheduled" })
                                  }
                                  className="h-6 text-xs"
                                >
                                  Schedule
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="px-4 py-2.5 text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      {(a.status === "scheduled" ||
                        a.status === "in-progress") && (
                        <Button
                          size="sm"
                          variant="default"
                          data-ocid={`appointments.primary_button.${i + 1}`}
                          onClick={() => onStartEncounter(a.id, a.patientId)}
                          className="h-7 text-xs"
                        >
                          <Stethoscope className="w-3 h-3 mr-1.5" />
                          Start
                        </Button>
                      )}
                      {videoApptIds.has(String(a.id)) && (
                        <Button
                          size="sm"
                          variant="outline"
                          data-ocid={`appointments.video.button.${i + 1}`}
                          onClick={() => onNavigate?.("video-visit")}
                          className="h-7 text-xs border-primary/30 text-primary hover:bg-primary/5"
                        >
                          <Video className="w-3 h-3 mr-1" />
                          Join
                        </Button>
                      )}
                      {a.status === "scheduled" && (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            data-ocid={`appointments.complete_button.${i + 1}`}
                            onClick={() =>
                              handleStatusChange(a.id, "completed")
                            }
                            className="h-7 text-xs text-success border-success/30 hover:bg-success/10"
                          >
                            Complete
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            data-ocid={`appointments.cancel_button.${i + 1}`}
                            onClick={() =>
                              handleStatusChange(a.id, "cancelled")
                            }
                            className="h-7 text-xs"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            data-ocid={`appointments.secondary_button.${i + 1}`}
                            onClick={() => handleStatusChange(a.id, "no-show")}
                            className="h-7 text-xs text-warning border-warning/30 hover:bg-warning/10"
                          >
                            No-Show
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
