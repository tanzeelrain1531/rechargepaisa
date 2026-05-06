import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface PatientFormState {
  name: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  mrn: string;
}

interface PatientRegistrationFormProps {
  form: PatientFormState;
  setForm: React.Dispatch<React.SetStateAction<PatientFormState>>;
  submitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export function PatientRegistrationForm({
  form,
  setForm,
  submitting,
  onSubmit,
  onCancel,
}: PatientRegistrationFormProps) {
  const [errors, setErrors] = useState<Partial<PatientFormState>>({});

  const handleSubmit = () => {
    const newErrors: Partial<PatientFormState> = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!form.mrn.trim()) {
      newErrors.mrn = "MRN is required";
    }
    if (form.dateOfBirth) {
      const dob = new Date(form.dateOfBirth);
      if (Number.isNaN(dob.getTime()) || dob >= new Date()) {
        newErrors.dateOfBirth = "Enter a valid past date";
      }
    }
    if (form.phone && form.phone.replace(/\D/g, "").length < 7) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit();
  };

  return (
    <div
      className="border border-border bg-card p-5"
      data-ocid="patients.registration.panel"
    >
      <h2 className="text-sm font-semibold text-foreground mb-4">
        Register New Patient
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Full Name *
          </Label>
          <Input
            data-ocid="patients.name.input"
            value={form.name}
            onChange={(e) => {
              setForm((p) => ({ ...p, name: e.target.value }));
              if (errors.name)
                setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="e.g. Jane Smith"
            className="mt-1 h-8 text-sm"
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Date of Birth
          </Label>
          <Input
            data-ocid="patients.dob.input"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => {
              setForm((p) => ({ ...p, dateOfBirth: e.target.value }));
              if (errors.dateOfBirth)
                setErrors((prev) => ({ ...prev, dateOfBirth: undefined }));
            }}
            className="mt-1 h-8 text-sm"
          />
          {errors.dateOfBirth && (
            <p className="text-xs text-destructive mt-1">
              {errors.dateOfBirth}
            </p>
          )}
        </div>
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Phone
          </Label>
          <Input
            data-ocid="patients.phone.input"
            value={form.phone}
            onChange={(e) => {
              setForm((p) => ({ ...p, phone: e.target.value }));
              if (errors.phone)
                setErrors((prev) => ({ ...prev, phone: undefined }));
            }}
            placeholder="(555) 555-5555"
            className="mt-1 h-8 text-sm"
          />
          {errors.phone && (
            <p className="text-xs text-destructive mt-1">{errors.phone}</p>
          )}
        </div>
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email
          </Label>
          <Input
            data-ocid="patients.email.input"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="patient@email.com"
            className="mt-1 h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            MRN *
          </Label>
          <Input
            data-ocid="patients.mrn.input"
            value={form.mrn}
            onChange={(e) => {
              setForm((p) => ({ ...p, mrn: e.target.value }));
              if (errors.mrn)
                setErrors((prev) => ({ ...prev, mrn: undefined }));
            }}
            placeholder="MRN-XXX"
            className="mt-1 h-8 text-sm font-mono"
          />
          {errors.mrn && (
            <p className="text-xs text-destructive mt-1">{errors.mrn}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Button
          data-ocid="patients.submit_button"
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
              Registering...
            </>
          ) : (
            "Register Patient"
          )}
        </Button>
        <Button
          data-ocid="patients.cancel_button"
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
