import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Plus,
  Target,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DEMO_PATIENTS } from "../demoData";

interface CarePlan {
  id: string;
  patientId: string;
  patientName: string;
  problem: string;
  goals: Array<{ text: string; status: "Met" | "In Progress" | "Not Met" }>;
  interventions: string[];
  targetDate: string;
  status: "active" | "resolved";
  createdBy: string;
  createdAt: string;
}

const INITIAL_CARE_PLANS: CarePlan[] = [
  {
    id: "cp-1",
    patientId: "p1",
    patientName: "Margaret Chen",
    problem: "Ineffective tissue perfusion related to hypertension",
    goals: [
      { text: "BP < 140/90 mmHg within 2 weeks", status: "In Progress" },
      {
        text: "Patient verbalize understanding of antihypertensive regimen",
        status: "Not Met",
      },
    ],
    interventions: [
      "Monitor BP every 4 hours",
      "Administer Lisinopril 10mg as ordered",
      "Educate patient on DASH diet and sodium restriction",
      "Encourage daily 30-minute ambulation",
    ],
    targetDate: "2026-03-30",
    status: "active",
    createdBy: "RN. Sarah Park",
    createdAt: "2026-03-10",
  },
  {
    id: "cp-2",
    patientId: "p2",
    patientName: "James Harrington",
    problem: "Risk for infection related to post-operative wound",
    goals: [
      {
        text: "Wound remains free of infection signs through discharge",
        status: "In Progress",
      },
      { text: "Temperature < 38.0°C by post-op day 3", status: "Met" },
    ],
    interventions: [
      "Wound assessment and dressing change every 12 hours",
      "Administer prophylactic antibiotics per protocol",
      "Monitor CBC and WBC for infection indicators",
      "Maintain contact precautions per MRSA protocol",
    ],
    targetDate: "2026-03-25",
    status: "active",
    createdBy: "RN. David Torres",
    createdAt: "2026-03-12",
  },
  {
    id: "cp-3",
    patientId: "p3",
    patientName: "Linda Washington",
    problem: "Impaired glucose regulation related to Type 2 Diabetes",
    goals: [
      { text: "Fasting glucose 80–130 mg/dL", status: "In Progress" },
      { text: "HbA1c < 7.0% at next lab draw", status: "Not Met" },
    ],
    interventions: [
      "Monitor blood glucose before meals and at bedtime",
      "Administer insulin per sliding scale",
      "Provide diabetic diet education",
      "Consult dietary services for meal planning",
    ],
    targetDate: "2026-04-15",
    status: "active",
    createdBy: "RN. Maria Gonzalez",
    createdAt: "2026-03-05",
  },
  {
    id: "cp-4",
    patientId: "p4",
    patientName: "Robert Kim",
    problem: "Acute pain related to coronary artery disease",
    goals: [
      {
        text: "Pain level ≤ 2/10 within 30 minutes of intervention",
        status: "Met",
      },
      {
        text: "Patient demonstrates non-pharmacological pain relief techniques",
        status: "Met",
      },
    ],
    interventions: [
      "Assess pain using 0–10 numeric scale every 2 hours",
      "Administer nitroglycerin as ordered for chest pain",
      "Position patient for comfort — semi-Fowler's",
      "Provide oxygen therapy to maintain SpO2 ≥ 94%",
    ],
    targetDate: "2026-03-20",
    status: "resolved",
    createdBy: "RN. Angela Reyes",
    createdAt: "2026-03-01",
  },
  {
    id: "cp-5",
    patientId: "p5",
    patientName: "Sarah Mitchell",
    problem: "Activity intolerance related to chronic fatigue and CKD",
    goals: [
      {
        text: "Patient ambulates 50 feet with minimal assistance by discharge",
        status: "In Progress",
      },
      {
        text: "Verbalize strategies for energy conservation",
        status: "Not Met",
      },
    ],
    interventions: [
      "Progressive ambulation program: increase by 10 feet each shift",
      "Rest periods between activities — no more than 15 min activity at once",
      "Physical therapy consult ordered",
      "Monitor HR and SpO2 during activity; stop if HR > 110 or SpO2 < 92%",
    ],
    targetDate: "2026-04-01",
    status: "active",
    createdBy: "RN. Kevin Brown",
    createdAt: "2026-03-08",
  },
];

const goalStatusVariant = {
  Met: "success" as const,
  "In Progress": "warning" as const,
  "Not Met": "danger" as const,
};

const patientNames = DEMO_PATIENTS.slice(0, 10).map((p) => p.name);

export default function NursingCarePlans({
  onNavigate: _onNavigate,
}: { onNavigate: (page: string) => void }) {
  const [carePlans, setCarePlans] = useState<CarePlan[]>(INITIAL_CARE_PLANS);
  const [loading] = useState(false);
  const { actor } = useActor();
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "resolved"
  >("all");
  const [addGoalFor, setAddGoalFor] = useState<string | null>(null);
  const [newGoalText, setNewGoalText] = useState("");
  const [newGoalStatus, setNewGoalStatus] = useState<
    "Met" | "In Progress" | "Not Met"
  >("In Progress");

  const [newPlan, setNewPlan] = useState({
    patientName: "",
    problem: "",
    goals: "",
    interventions: "",
    targetDate: "",
  });

  const filtered = carePlans.filter(
    (cp) => filterStatus === "all" || cp.status === filterStatus,
  );

  const handleAdd = () => {
    if (!newPlan.patientName || !newPlan.problem) return;
    const plan: CarePlan = {
      id: `cp-${Date.now()}`,
      patientId: `p-${Date.now()}`,
      patientName: newPlan.patientName,
      problem: newPlan.problem,
      goals: newPlan.goals
        .split("\n")
        .filter(Boolean)
        .map((t) => ({ text: t, status: "In Progress" as const })),
      interventions: newPlan.interventions.split("\n").filter(Boolean),
      targetDate: newPlan.targetDate,
      status: "active",
      createdBy: "RN. Current User",
      createdAt: new Date().toISOString().split("T")[0] ?? "",
    };
    setCarePlans((prev) => [plan, ...prev]);
    setNewPlan({
      patientName: "",
      problem: "",
      goals: "",
      interventions: "",
      targetDate: "",
    });
    setShowAddForm(false);
    if (actor) {
      actor
        .createClinicalNote(1n, "care-plan", JSON.stringify(plan), 1n)
        .then(() => toast.success("Care plan saved"))
        .catch(() => toast.error("Failed to save care plan"));
    } else {
      toast.success("Care plan saved");
    }
  };

  const handleMarkResolved = (id: string) => {
    setCarePlans((prev) =>
      prev.map((cp) =>
        cp.id === id ? { ...cp, status: "resolved" as const } : cp,
      ),
    );
  };

  const handleAddGoal = (planId: string) => {
    if (!newGoalText.trim()) return;
    setCarePlans((prev) =>
      prev.map((cp) =>
        cp.id !== planId
          ? cp
          : {
              ...cp,
              goals: [
                ...cp.goals,
                { text: newGoalText, status: newGoalStatus },
              ],
            },
      ),
    );
    setNewGoalText("");
    setNewGoalStatus("In Progress");
    setAddGoalFor(null);
  };

  const handleGoalStatusChange = (
    planId: string,
    goalIdx: number,
    status: "Met" | "In Progress" | "Not Met",
  ) => {
    setCarePlans((prev) =>
      prev.map((cp) =>
        cp.id !== planId
          ? cp
          : {
              ...cp,
              goals: cp.goals.map((g, i) =>
                i === goalIdx ? { ...g, status } : g,
              ),
            },
      ),
    );
  };

  return (
    <div className="space-y-4" data-ocid="care-plans.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Nursing Care Plans
          </h2>
          <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-sm font-medium">
            {carePlans.filter((c) => c.status === "active").length} Active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-sm overflow-hidden">
            {(["all", "active", "resolved"] as const).map((f) => (
              <button
                key={f}
                type="button"
                data-ocid={`care-plans.filter.${f}.tab`}
                onClick={() => setFilterStatus(f)}
                className={`px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  filterStatus === f
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            data-ocid="care-plans.open_modal_button"
            onClick={() => setShowAddForm((v) => !v)}
            className="h-7 text-xs gap-1"
          >
            <Plus className="w-3 h-3" />
            {showAddForm ? "Cancel" : "Add Care Plan"}
          </Button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card
          data-ocid="care-plans.add.panel"
          className="border-primary/20 bg-primary/5"
        >
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-foreground">
              New Care Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                  htmlFor="cp-patient"
                >
                  Patient
                </label>
                <select
                  id="cp-patient"
                  data-ocid="care-plans.patient.select"
                  value={newPlan.patientName}
                  onChange={(e) =>
                    setNewPlan((p) => ({ ...p, patientName: e.target.value }))
                  }
                  className="w-full h-8 px-2 text-[12px] bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring"
                >
                  <option value="">Select patient...</option>
                  {patientNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                  htmlFor="cp-target-date"
                >
                  Target Date
                </label>
                <input
                  type="date"
                  id="cp-target-date"
                  data-ocid="care-plans.target-date.input"
                  value={newPlan.targetDate}
                  onChange={(e) =>
                    setNewPlan((p) => ({ ...p, targetDate: e.target.value }))
                  }
                  className="w-full h-8 px-2 text-[12px] bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring"
                />
              </div>
              <div className="col-span-2">
                <label
                  className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                  htmlFor="cp-problem"
                >
                  Problem / Nursing Diagnosis
                </label>
                <input
                  type="text"
                  id="cp-problem"
                  data-ocid="care-plans.problem.input"
                  value={newPlan.problem}
                  onChange={(e) =>
                    setNewPlan((p) => ({ ...p, problem: e.target.value }))
                  }
                  placeholder="e.g. Risk for infection related to IV catheter"
                  className="w-full h-8 px-2 text-[12px] bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring"
                />
              </div>
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                  htmlFor="cp-goals"
                >
                  Goals (one per line)
                </label>
                <textarea
                  id="cp-goals"
                  data-ocid="care-plans.goals.textarea"
                  value={newPlan.goals}
                  onChange={(e) =>
                    setNewPlan((p) => ({ ...p, goals: e.target.value }))
                  }
                  rows={3}
                  placeholder="Patient will ambulate 50ft by discharge"
                  className="w-full px-2 py-1.5 text-[12px] bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring resize-none"
                />
              </div>
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1"
                  htmlFor="cp-interventions"
                >
                  Interventions (one per line)
                </label>
                <textarea
                  id="cp-interventions"
                  data-ocid="care-plans.interventions.textarea"
                  value={newPlan.interventions}
                  onChange={(e) =>
                    setNewPlan((p) => ({ ...p, interventions: e.target.value }))
                  }
                  rows={3}
                  placeholder="Assess vital signs every 4 hours"
                  className="w-full px-2 py-1.5 text-[12px] bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                data-ocid="care-plans.add.submit_button"
                onClick={handleAdd}
                className="h-7 text-xs"
              >
                Save Care Plan
              </Button>
              <Button
                size="sm"
                variant="ghost"
                data-ocid="care-plans.add.cancel_button"
                onClick={() => setShowAddForm(false)}
                className="h-7 text-xs"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Care Plans Card Grid */}
      {loading ? (
        <div className="space-y-2" data-ocid="care-plans.loading_state">
          {[1, 2, 3].map((k) => (
            <div
              key={k}
              className="bg-card border border-border rounded-sm p-4"
            >
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-3 w-64 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="py-16 flex flex-col items-center justify-center gap-3 text-center bg-card border border-border rounded-sm"
          data-ocid="care-plans.empty_state"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-muted-foreground/50" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              No care plans found
            </p>
            <p className="text-[12px] text-muted-foreground">
              Add a care plan to get started tracking patient goals and
              interventions.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3" data-ocid="care-plans.list">
          {filtered.map((cp, idx) => (
            <Card
              key={cp.id}
              data-ocid={`care-plans.item.${idx + 1}`}
              className={`border transition-all ${
                cp.status === "resolved" ? "opacity-75 bg-muted/20" : "bg-card"
              }`}
            >
              <CardHeader className="px-4 pt-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[13px] font-semibold text-foreground">
                        {cp.patientName}
                      </p>
                      <StatusBadge
                        variant={cp.status === "active" ? "success" : "neutral"}
                        label={cp.status}
                      />
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-2">
                      {cp.problem}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">
                      Target: {cp.targetDate}
                    </span>
                    {cp.status === "active" && (
                      <button
                        type="button"
                        data-ocid={`care-plans.resolve.button.${idx + 1}`}
                        onClick={() => handleMarkResolved(cp.id)}
                        className="text-xs font-medium px-2 py-0.5 rounded-sm border text-success border-success/30 hover:bg-success/10 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      type="button"
                      data-ocid={`care-plans.toggle.button.${idx + 1}`}
                      onClick={() =>
                        setExpandedId(expandedId === cp.id ? null : cp.id)
                      }
                      className="p-1 rounded-sm hover:bg-muted/40 transition-colors"
                    >
                      {expandedId === cp.id ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              </CardHeader>

              {expandedId === cp.id && (
                <CardContent className="px-4 pb-4 space-y-4 border-t border-border pt-3">
                  {/* Goals */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                        <Target className="w-3 h-3" />
                        Goals
                      </p>
                      {cp.status === "active" && (
                        <button
                          type="button"
                          data-ocid={`care-plans.add-goal.button.${idx + 1}`}
                          onClick={() =>
                            setAddGoalFor(addGoalFor === cp.id ? null : cp.id)
                          }
                          className="text-xs font-medium text-primary flex items-center gap-1 hover:underline"
                        >
                          <Plus className="w-3 h-3" />
                          {addGoalFor === cp.id ? "Cancel" : "Add Goal"}
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {cp.goals.map((goal, gi) => (
                        <div
                          key={`${cp.id}-goal-${gi}`}
                          className="flex items-start gap-2"
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                              goal.status === "Met"
                                ? "text-success"
                                : "text-muted-foreground/40"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] text-foreground leading-snug">
                              {goal.text}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            {cp.status === "active" ? (
                              <select
                                value={goal.status}
                                onChange={(e) =>
                                  handleGoalStatusChange(
                                    cp.id,
                                    gi,
                                    e.target.value as
                                      | "Met"
                                      | "In Progress"
                                      | "Not Met",
                                  )
                                }
                                className="text-xs px-1.5 py-0.5 border border-border rounded-sm bg-background"
                                data-ocid={`care-plans.goal.select.${idx + 1}`}
                              >
                                <option value="Met">Met</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Not Met">Not Met</option>
                              </select>
                            ) : (
                              <StatusBadge
                                variant={goalStatusVariant[goal.status]}
                                label={goal.status}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Goal Inline Form */}
                    {addGoalFor === cp.id && (
                      <div
                        className="mt-3 p-3 bg-muted/30 border border-border rounded-sm space-y-2"
                        data-ocid={`care-plans.add-goal.panel.${idx + 1}`}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          New Goal
                        </p>
                        <input
                          type="text"
                          data-ocid={`care-plans.goal.input.${idx + 1}`}
                          value={newGoalText}
                          onChange={(e) => setNewGoalText(e.target.value)}
                          placeholder="Enter goal description..."
                          className="w-full h-8 px-2 text-[12px] bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring"
                        />
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor="new-goal-status"
                            className="text-xs text-muted-foreground"
                          >
                            Status:
                          </label>
                          <select
                            id="new-goal-status"
                            value={newGoalStatus}
                            onChange={(e) =>
                              setNewGoalStatus(
                                e.target.value as
                                  | "Met"
                                  | "In Progress"
                                  | "Not Met",
                              )
                            }
                            className="text-xs px-1.5 h-6 border border-border rounded-sm bg-background"
                            data-ocid={`care-plans.new-goal.select.${idx + 1}`}
                          >
                            <option value="In Progress">In Progress</option>
                            <option value="Met">Met</option>
                            <option value="Not Met">Not Met</option>
                          </select>
                          <Button
                            size="sm"
                            className="h-6 text-xs"
                            data-ocid={`care-plans.goal.save_button.${idx + 1}`}
                            onClick={() => handleAddGoal(cp.id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-xs"
                            data-ocid={`care-plans.goal.cancel_button.${idx + 1}`}
                            onClick={() => {
                              setAddGoalFor(null);
                              setNewGoalText("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interventions */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Interventions
                    </p>
                    <ul className="space-y-1">
                      {cp.interventions.map((iv) => (
                        <li
                          key={iv}
                          className="flex items-start gap-1.5 text-[12px] text-foreground"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/50 flex-shrink-0" />
                          {iv}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border">
                    <span>Created by: {cp.createdBy}</span>
                    <span>Date: {cp.createdAt}</span>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
