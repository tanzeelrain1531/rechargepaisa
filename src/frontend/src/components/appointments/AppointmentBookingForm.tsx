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
import { Video } from "lucide-react";

interface Patient {
  id: bigint;
  name: string;
}

interface BookingForm {
  patientId: string;
  date: string;
  providerId: string;
  recurrence: string;
  occurrences: string;
  videoVisit: boolean;
}

interface AppointmentBookingFormProps {
  form: BookingForm;
  setForm: React.Dispatch<React.SetStateAction<BookingForm>>;
  patients: Patient[];
  submitting: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export function AppointmentBookingForm({
  form,
  setForm,
  patients,
  submitting,
  onSubmit,
  onClose,
}: AppointmentBookingFormProps) {
  return (
    <div
      className="border border-border bg-card p-5"
      data-ocid="appointments.panel"
    >
      <h2 className="text-sm font-semibold text-foreground mb-4">
        Book New Appointment
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Patient
          </Label>
          <Select
            value={form.patientId}
            onValueChange={(v) => setForm((p) => ({ ...p, patientId: v }))}
          >
            <SelectTrigger
              data-ocid="appointments.patient.select"
              className="mt-1 h-8 text-sm"
            >
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((p) => (
                <SelectItem key={String(p.id)} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Date &amp; Time
          </Label>
          <Input
            data-ocid="appointments.date.input"
            type="datetime-local"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            className="mt-1 h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recurrence
          </Label>
          <Select
            value={form.recurrence}
            onValueChange={(v) => setForm((p) => ({ ...p, recurrence: v }))}
          >
            <SelectTrigger
              data-ocid="appointments.recurrence.select"
              className="mt-1 h-8 text-sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (one-time)</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Biweekly (Every 2 Weeks)</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {form.recurrence !== "none" && (
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Occurrences
            </Label>
            <Input
              data-ocid="appointments.occurrences.input"
              type="number"
              min="2"
              max="12"
              value={form.occurrences}
              onChange={(e) =>
                setForm((p) => ({ ...p, occurrences: e.target.value }))
              }
              className="mt-1 h-8 text-sm"
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 mt-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            data-ocid="appointments.video.checkbox"
            checked={form.videoVisit}
            onChange={(e) =>
              setForm((p) => ({ ...p, videoVisit: e.target.checked }))
            }
            className="w-4 h-4 accent-primary"
          />
          <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Video className="w-3.5 h-3.5 text-primary" />
            Video Visit (Telehealth)
          </span>
        </label>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Button
          data-ocid="appointments.submit_button"
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={onSubmit}
          disabled={submitting}
        >
          {submitting
            ? "Booking..."
            : form.recurrence !== "none"
              ? `Book ${form.occurrences} Appointments`
              : "Book Appointment"}
        </Button>
        <Button
          data-ocid="appointments.cancel_button"
          size="sm"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
