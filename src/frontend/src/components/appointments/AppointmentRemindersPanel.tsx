import { StatusBadge } from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
  Mail,
} from "lucide-react";
import type {
  DemoAppointmentReminder,
  DemoReminderStatus,
} from "../../demoData";

interface AppointmentRemindersPanelProps {
  apptReminders: DemoAppointmentReminder[];
  showApptRemindersPanel: boolean;
  setShowApptRemindersPanel: React.Dispatch<React.SetStateAction<boolean>>;
  sendingApptReminderId: string | null;
  sendingAllApptReminders: boolean;
  notSentCount: number;
  onSendAll: () => void;
  onSendOne: (appointmentId: string) => void;
}

const statusVariantMap: Record<
  DemoReminderStatus,
  "success" | "warning" | "info" | "neutral"
> = {
  confirmed: "success",
  sent: "info",
  "not-sent": "neutral",
  "no-response": "warning",
};

export function AppointmentRemindersPanel({
  apptReminders,
  showApptRemindersPanel,
  setShowApptRemindersPanel,
  sendingApptReminderId,
  sendingAllApptReminders,
  notSentCount,
  onSendAll,
  onSendOne,
}: AppointmentRemindersPanelProps) {
  return (
    <div
      className="border border-border bg-card rounded-sm"
      data-ocid="appointments.reminders.panel"
    >
      <button
        type="button"
        data-ocid="appointments.reminders.toggle"
        onClick={() => setShowApptRemindersPanel((v) => !v)}
        className="w-full px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2 hover:bg-muted/60 transition-colors"
      >
        <Mail className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-semibold text-foreground flex-1 text-left">
          Appointment Reminders
        </span>
        {notSentCount > 0 && (
          <span className="px-1.5 py-0.5 text-xs font-bold bg-warning/15 text-warning border border-warning/30 rounded-full">
            {notSentCount} not sent
          </span>
        )}
        {showApptRemindersPanel ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>
      {showApptRemindersPanel && (
        <>
          {notSentCount > 0 && (
            <div className="px-4 py-2 border-b border-border bg-muted/20 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {notSentCount} reminders pending
              </span>
              <button
                type="button"
                data-ocid="appointments.reminders.primary_button"
                disabled={sendingAllApptReminders}
                onClick={onSendAll}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-sm disabled:opacity-60 hover:bg-primary/90 transition-colors"
              >
                {sendingAllApptReminders ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCheck className="w-3 h-3" />
                )}
                {sendingAllApptReminders ? "Sending..." : "Send All Pending"}
              </button>
            </div>
          )}
          {apptReminders.length === 0 ? (
            <div
              className="px-4 py-8 text-center"
              data-ocid="appointments.reminders.empty_state"
            >
              <Mail className="w-6 h-6 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No reminders configured
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
                    Appointment
                  </TableHead>
                  <TableHead className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Method
                  </TableHead>
                  <TableHead className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apptReminders.map((rem, i) => (
                  <TableRow
                    key={rem.appointmentId}
                    data-ocid={`appointments.reminders.item.${i + 1}`}
                    className="hover:bg-muted/20"
                  >
                    <TableCell className="px-4 py-2.5 font-medium text-sm">
                      {rem.patientName}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                      {rem.dateTime}
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {rem.method}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <StatusBadge
                        variant={statusVariantMap[rem.status]}
                        label={
                          rem.status === "not-sent"
                            ? "Not Sent"
                            : rem.status === "no-response"
                              ? "No Response"
                              : rem.status
                        }
                      />
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      {rem.status === "not-sent" && (
                        <button
                          type="button"
                          data-ocid={`appointments.reminders.secondary_button.${i + 1}`}
                          disabled={sendingApptReminderId === rem.appointmentId}
                          onClick={() => onSendOne(rem.appointmentId)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-sm hover:bg-primary/20 disabled:opacity-60 transition-colors"
                        >
                          {sendingApptReminderId === rem.appointmentId ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Mail className="w-3 h-3" />
                          )}
                          {sendingApptReminderId === rem.appointmentId
                            ? "Sending..."
                            : "Send"}
                        </button>
                      )}
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
