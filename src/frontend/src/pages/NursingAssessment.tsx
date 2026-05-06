import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Stethoscope } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/StatusBadge";
import {
  DEMO_NURSING_ASSESSMENTS,
  DEMO_PATIENTS,
  type DemoNursingAssessment,
} from "../demoData";
import { useDemoMode } from "../hooks/useDemoMode";

const PAIN_SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const PAIN_FACE_LABELS = [
  "No Pain",
  "Minimal",
  "Mild",
  "Mild-Moderate",
  "Moderate",
  "Moderate+",
  "Moderate-Severe",
  "Severe",
  "Very Severe",
  "Excruciating",
  "Worst Possible",
];

function PainSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5 flex-wrap">
      {PAIN_SCORES.map((score) => (
        <button
          key={score}
          type="button"
          data-ocid={`nursing.pain.button.${score + 1}`}
          onClick={() => onChange(score)}
          className={`w-10 h-10 rounded-sm text-sm font-bold flex items-center justify-center transition-all border ${
            value === score
              ? "border-primary bg-primary/10 ring-1 ring-primary text-primary"
              : "border-border hover:bg-muted text-foreground"
          }`}
          title={PAIN_FACE_LABELS[score]}
        >
          {score}
        </button>
      ))}
      <span className="ml-2 text-sm font-semibold text-foreground tabular-nums">
        {value}/10 &mdash; {PAIN_FACE_LABELS[value]}
      </span>
    </div>
  );
}

function RadioRow<T extends string>({
  options,
  value,
  onChange,
  ocidPrefix,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  ocidPrefix: string;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt, i) => (
        <button
          key={opt.value}
          type="button"
          data-ocid={`${ocidPrefix}.radio.${i + 1}`}
          onClick={() => onChange(opt.value)}
          className={`h-7 px-3 text-xs font-medium rounded-sm border transition-all ${
            value === opt.value
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-foreground hover:bg-muted"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

type FormState = Omit<
  DemoNursingAssessment,
  "id" | "assessedBy" | "assessedAt"
>;

const DEFAULT_FORM: FormState = {
  patientId: "",
  patientName: "",
  pain: { score: 0, location: "" },
  skin: { status: "intact", description: "" },
  fallRisk: { level: "low", morseScore: 0 },
  mobility: "independent",
  neuro: { status: "alert", gcs: 15 },
  ivAccess: { type: "none", site: "" },
  dietary: { type: "regular", notes: "" },
  notes: "",
};

export default function NursingAssessment() {
  const { isDemoMode } = useDemoMode();
  const patients = isDemoMode ? DEMO_PATIENTS : [];

  const WARD_LABELS: Record<string, string> = {
    icu: "ICU",
    general: "General Medicine",
    surgical: "Surgical",
    pediatric: "Pediatric",
  };

  const wardPref = useMemo(() => {
    try {
      const p = JSON.parse(
        localStorage.getItem("medunite_prefs_Nurse") || "{}",
      );
      return p.ward || "";
    } catch {
      return "";
    }
  }, []);

  const filteredPatients = useMemo(
    () => patients.filter((p) => !wardPref || (p as any).wardId === wardPref),
    [patients, wardPref],
  );

  const assessmentHeading = wardPref
    ? `${WARD_LABELS[wardPref] || ""} Nursing Assessment`.trim()
    : "Nursing Assessment";
  const [savedAssessments, setSavedAssessments] = useState<
    DemoNursingAssessment[]
  >(isDemoMode ? DEMO_NURSING_ASSESSMENTS : []);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const handleSelectPatient = (pid: string) => {
    setSelectedPatientId(pid);
    const patient = patients.find((p) => String(p.id) === pid);
    const existing = savedAssessments.find((a) => a.patientId === pid);
    if (existing) {
      const { id: _id, assessedBy: _by, assessedAt: _at, ...rest } = existing;
      setForm(rest);
    } else if (patient) {
      setForm({ ...DEFAULT_FORM, patientId: pid, patientName: patient.name });
    } else {
      setForm(DEFAULT_FORM);
    }
  };

  const handleSave = async () => {
    if (!selectedPatientId) {
      toast.error("Please select a patient first.");
      return;
    }
    setSaving(true);
    const assessment: DemoNursingAssessment = {
      ...form,
      id: `na-${Date.now()}`,
      assessedBy: "Current Nurse",
      assessedAt: new Date().toISOString(),
    };
    setSavedAssessments((prev) => [
      ...prev.filter((a) => a.patientId !== selectedPatientId),
      assessment,
    ]);
    setSaving(false);
    toast.success("Assessment saved successfully.");
  };

  const selectedPatient = patients.find(
    (p) => String(p.id) === selectedPatientId,
  );

  const fallVariant =
    form.fallRisk.level === "high"
      ? "danger"
      : form.fallRisk.level === "medium"
        ? "warning"
        : "success";

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card">
        <h1 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-primary" />
          {assessmentHeading}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Complete a structured nursing assessment for the selected patient
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-5 space-y-5">
          {/* Patient Selector */}
          <div className="border border-border rounded-sm bg-card">
            <div className="px-4 py-2.5 border-b border-border bg-muted/40">
              <span className="text-xs font-semibold text-foreground">
                Patient
              </span>
            </div>
            <div className="px-4 py-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select Patient
              </Label>
              <Select
                value={selectedPatientId}
                onValueChange={handleSelectPatient}
              >
                <SelectTrigger
                  data-ocid="nursing.patient.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue placeholder="Choose a patient..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredPatients.map((p) => (
                    <SelectItem key={String(p.id)} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPatient && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  MRN: {selectedPatient.mrn} &middot; DOB:{" "}
                  {selectedPatient.dateOfBirth}
                </p>
              )}
            </div>
          </div>

          {selectedPatientId && (
            <>
              {/* Pain Assessment */}
              <div className="border border-border rounded-sm bg-card">
                <div className="px-4 py-2.5 border-b border-border bg-muted/40">
                  <span className="text-xs font-semibold text-foreground">
                    Pain Assessment
                  </span>
                </div>
                <div className="px-4 py-3 space-y-3">
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Pain Score (0 = No Pain, 10 = Worst Possible)
                    </Label>
                    <div className="mt-2">
                      <PainSelector
                        value={form.pain.score}
                        onChange={(v) =>
                          setForm((p) => ({
                            ...p,
                            pain: { ...p.pain, score: v },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Location
                    </Label>
                    <input
                      type="text"
                      data-ocid="nursing.pain.input"
                      value={form.pain.location}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          pain: { ...p.pain, location: e.target.value },
                        }))
                      }
                      className="mt-1 w-full h-8 px-3 text-sm border border-input rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                      placeholder="e.g. Left lower back"
                    />
                  </div>
                </div>
              </div>

              {/* Skin Integrity */}
              <div className="border border-border rounded-sm bg-card">
                <div className="px-4 py-2.5 border-b border-border bg-muted/40">
                  <span className="text-xs font-semibold text-foreground">
                    Skin Integrity
                  </span>
                </div>
                <div className="px-4 py-3 space-y-3">
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </Label>
                    <div className="mt-2">
                      <RadioRow
                        options={[
                          { label: "Intact", value: "intact" },
                          { label: "Wound", value: "wound" },
                          { label: "Pressure Ulcer", value: "pressure-ulcer" },
                        ]}
                        value={form.skin.status}
                        onChange={(v) =>
                          setForm((p) => ({
                            ...p,
                            skin: { ...p.skin, status: v },
                          }))
                        }
                        ocidPrefix="nursing.skin"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Description
                    </Label>
                    <Textarea
                      data-ocid="nursing.skin.textarea"
                      value={form.skin.description}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          skin: { ...p.skin, description: e.target.value },
                        }))
                      }
                      rows={2}
                      className="mt-1 text-sm resize-none"
                      placeholder="Describe skin condition..."
                    />
                  </div>
                </div>
              </div>

              {/* Fall Risk */}
              <div className="border border-border rounded-sm bg-card">
                <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    Fall Risk
                  </span>
                  <StatusBadge
                    variant={fallVariant}
                    label={form.fallRisk.level}
                  />
                </div>
                <div className="px-4 py-3 space-y-3">
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Risk Level
                    </Label>
                    <div className="mt-2">
                      <RadioRow
                        options={[
                          { label: "Low", value: "low" },
                          { label: "Medium", value: "medium" },
                          { label: "High", value: "high" },
                        ]}
                        value={form.fallRisk.level}
                        onChange={(v) =>
                          setForm((p) => ({
                            ...p,
                            fallRisk: { ...p.fallRisk, level: v },
                          }))
                        }
                        ocidPrefix="nursing.fall"
                      />
                    </div>
                  </div>
                  <div className="w-28">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Morse Score
                    </Label>
                    <input
                      type="number"
                      data-ocid="nursing.fall.input"
                      min={0}
                      max={125}
                      value={form.fallRisk.morseScore}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          fallRisk: {
                            ...p.fallRisk,
                            morseScore: Number.parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      className="mt-1 w-full h-8 px-3 text-sm border border-input rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Mobility, Neuro, IV, Dietary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mobility */}
                <div className="border border-border rounded-sm bg-card">
                  <div className="px-4 py-2.5 border-b border-border bg-muted/40">
                    <span className="text-xs font-semibold text-foreground">
                      Mobility
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <RadioRow
                      options={[
                        { label: "Independent", value: "independent" },
                        { label: "Assisted", value: "assisted" },
                        { label: "Dependent", value: "dependent" },
                      ]}
                      value={form.mobility}
                      onChange={(v) => setForm((p) => ({ ...p, mobility: v }))}
                      ocidPrefix="nursing.mobility"
                    />
                  </div>
                </div>

                {/* Neuro */}
                <div className="border border-border rounded-sm bg-card">
                  <div className="px-4 py-2.5 border-b border-border bg-muted/40">
                    <span className="text-xs font-semibold text-foreground">
                      Neuro Status
                    </span>
                  </div>
                  <div className="px-4 py-3 space-y-2">
                    <RadioRow
                      options={[
                        { label: "Alert", value: "alert" },
                        { label: "Confused", value: "confused" },
                        { label: "Unresponsive", value: "unresponsive" },
                      ]}
                      value={form.neuro.status}
                      onChange={(v) =>
                        setForm((p) => ({
                          ...p,
                          neuro: { ...p.neuro, status: v },
                        }))
                      }
                      ocidPrefix="nursing.neuro"
                    />
                    <div>
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        GCS (optional)
                      </Label>
                      <input
                        type="number"
                        data-ocid="nursing.neuro.input"
                        min={3}
                        max={15}
                        value={form.neuro.gcs ?? ""}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            neuro: {
                              ...p.neuro,
                              gcs: e.target.value
                                ? Number.parseInt(e.target.value)
                                : undefined,
                            },
                          }))
                        }
                        className="mt-1 w-20 h-8 px-3 text-sm border border-input rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        placeholder="3-15"
                      />
                    </div>
                  </div>
                </div>

                {/* IV Access */}
                <div className="border border-border rounded-sm bg-card">
                  <div className="px-4 py-2.5 border-b border-border bg-muted/40">
                    <span className="text-xs font-semibold text-foreground">
                      IV Access
                    </span>
                  </div>
                  <div className="px-4 py-3 space-y-2">
                    <RadioRow
                      options={[
                        { label: "Peripheral", value: "peripheral" },
                        { label: "Central", value: "central" },
                        { label: "None", value: "none" },
                      ]}
                      value={form.ivAccess.type}
                      onChange={(v) =>
                        setForm((p) => ({
                          ...p,
                          ivAccess: { ...p.ivAccess, type: v },
                        }))
                      }
                      ocidPrefix="nursing.iv"
                    />
                    {form.ivAccess.type !== "none" && (
                      <input
                        type="text"
                        data-ocid="nursing.iv.input"
                        value={form.ivAccess.site ?? ""}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            ivAccess: { ...p.ivAccess, site: e.target.value },
                          }))
                        }
                        className="w-full h-8 px-3 text-sm border border-input rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        placeholder="Site description..."
                      />
                    )}
                  </div>
                </div>

                {/* Dietary */}
                <div className="border border-border rounded-sm bg-card">
                  <div className="px-4 py-2.5 border-b border-border bg-muted/40">
                    <span className="text-xs font-semibold text-foreground">
                      Dietary
                    </span>
                  </div>
                  <div className="px-4 py-3 space-y-2">
                    <RadioRow
                      options={[
                        { label: "Regular", value: "regular" },
                        { label: "Soft", value: "soft" },
                        { label: "NPO", value: "npo" },
                        { label: "Tube Feeding", value: "tube-feeding" },
                      ]}
                      value={form.dietary.type}
                      onChange={(v) =>
                        setForm((p) => ({
                          ...p,
                          dietary: { ...p.dietary, type: v },
                        }))
                      }
                      ocidPrefix="nursing.dietary"
                    />
                    <input
                      type="text"
                      data-ocid="nursing.dietary.input"
                      value={form.dietary.notes ?? ""}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          dietary: { ...p.dietary, notes: e.target.value },
                        }))
                      }
                      className="w-full h-8 px-3 text-sm border border-input rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                      placeholder="Diet notes..."
                    />
                  </div>
                </div>
              </div>

              {/* Nursing Notes */}
              <div className="border border-border rounded-sm bg-card">
                <div className="px-4 py-2.5 border-b border-border bg-muted/40">
                  <span className="text-xs font-semibold text-foreground">
                    Nursing Notes
                  </span>
                </div>
                <div className="px-4 py-3">
                  <Textarea
                    data-ocid="nursing.notes.textarea"
                    value={form.notes}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, notes: e.target.value }))
                    }
                    rows={4}
                    className="text-sm resize-none"
                    placeholder="Enter free-text nursing notes, observations, patient responses..."
                  />
                </div>
              </div>

              {/* Save */}
              <div className="flex justify-end gap-3 pb-4">
                <Button
                  data-ocid="nursing.save_button"
                  onClick={handleSave}
                  disabled={saving}
                  className="h-8 text-sm px-6"
                >
                  {saving ? "Saving..." : "Save Assessment"}
                </Button>
              </div>
            </>
          )}

          {!selectedPatientId && (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="nursing.empty_state"
            >
              <Stethoscope className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm">
                Select a patient above to begin the assessment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
