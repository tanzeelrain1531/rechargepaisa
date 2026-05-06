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
import { AlertTriangle, Info, Plus, Trash2, XCircle, Zap } from "lucide-react";
import React from "react";
import type { InteractionAlert } from "../../lib/drugInteractions";
import { ORDER_SETS, type OrderSet } from "../../lib/orderSets";

const ROUTE_OPTIONS = ["PO", "IV", "IM", "SQ", "Topical", "Inhaled"];

const SEVERITY_STYLES: Record<
  InteractionAlert["severity"],
  { container: string; badge: string; icon: React.ReactNode; label: string }
> = {
  contraindicated: {
    container:
      "bg-destructive/10 border border-destructive/30 text-destructive",
    badge: "bg-destructive text-destructive-foreground",
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: "⛔ CONTRAINDICATED",
  },
  major: {
    container: "bg-warning/10 border border-warning/30 text-warning",
    badge: "bg-warning text-warning-foreground",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    label: "⚠ MAJOR",
  },
  moderate: {
    container: "bg-warning/10 border border-warning/20 text-warning",
    badge: "bg-warning text-warning-foreground",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    label: "! MODERATE",
  },
  minor: {
    container: "bg-slate-50 border border-slate-200 text-slate-700",
    badge: "bg-slate-400 text-white",
    icon: <Info className="w-3.5 h-3.5" />,
    label: "ℹ MINOR",
  },
};

function InteractionAlertCard({ alert }: { alert: InteractionAlert }) {
  const style = SEVERITY_STYLES[alert.severity];
  return (
    <div
      className={`px-3 py-2.5 text-xs ${style.container}`}
      data-ocid={`encounter.rx.interaction.${alert.severity}`}
      role="alert"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wider ${style.badge}`}
        >
          {style.icon}
          {style.label}
        </span>
        <span className="font-semibold">
          {alert.drug1} <span className="text-muted-foreground">×</span>{" "}
          {alert.drug2}
        </span>
      </div>
      <p className="mb-1">
        <span className="font-semibold">Clinical Effect:</span>{" "}
        {alert.clinicalEffect}
      </p>
      <p className="mb-1">
        <span className="font-semibold">Mechanism:</span> {alert.mechanism}
      </p>
      <p>
        <span className="font-semibold">Management:</span> {alert.management}
      </p>
    </div>
  );
}

function OrderSetsPanel({
  onApply,
  disabled,
}: {
  onApply: (set: OrderSet) => void;
  disabled?: boolean;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [applied, setApplied] = React.useState<string | null>(null);

  const handleApply = (set: OrderSet) => {
    onApply(set);
    setApplied(set.id);
    setTimeout(() => setApplied(null), 2000);
  };

  const labIcons: Record<string, string> = {
    "annual-physical": "🩺",
    "diabetic-workup": "🩸",
    "cardiac-workup": "❤️",
    "hypertension-panel": "💊",
    "pre-op-panel": "🔬",
    "thyroid-panel": "⚗️",
    "renal-panel": "💧",
  };

  return (
    <div
      className="border border-border rounded-sm mb-3 overflow-hidden"
      data-ocid="encounter.order-sets.panel"
    >
      <button
        type="button"
        data-ocid="encounter.order-sets.toggle"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/40 hover:bg-muted/60 transition-colors border-b border-border"
      >
        <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Zap className="w-3.5 h-3.5 text-warning" />
          Quick Order Sets
          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-sm text-xs font-bold bg-warning/10 text-warning border border-warning/30">
            {ORDER_SETS.length}
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {expanded ? "▲ Collapse" : "▼ Expand to apply"}
        </span>
      </button>
      {expanded && (
        <div className="p-4 bg-card">
          <p className="text-xs text-muted-foreground mb-3">
            Click any order set to automatically populate all orders. Duplicates
            are skipped.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {ORDER_SETS.map((set) => {
              const isApplied = applied === set.id;
              const labCount = set.orders.filter(
                (o) => o.type === "lab",
              ).length;
              const imgCount = set.orders.filter(
                (o) => o.type === "imaging",
              ).length;
              return (
                <button
                  key={set.id}
                  type="button"
                  data-ocid={`encounter.order-sets.${set.id}.button`}
                  disabled={disabled}
                  onClick={() => handleApply(set)}
                  title={set.description}
                  className={[
                    "group relative flex flex-col items-start gap-1 p-3 rounded-sm border text-left transition-all",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    isApplied
                      ? "border-success/40 bg-success/10 text-success"
                      : "border-border bg-card hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between w-full gap-1">
                    <span className="text-base leading-none" aria-hidden>
                      {labIcons[set.id] ?? "📋"}
                    </span>
                    {isApplied ? (
                      <span className="text-xs font-bold text-success bg-success/10 border border-success/30 px-1.5 py-0.5 rounded-sm">
                        ✓ Applied
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                        {set.orders.length} orders
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-foreground leading-tight">
                    {set.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {labCount > 0 && (
                      <span className="text-xs font-medium text-primary bg-primary/5 border border-primary/20 px-1 py-0.5 rounded-sm">
                        {labCount} lab
                      </span>
                    )}
                    {imgCount > 0 && (
                      <span className="text-xs font-medium text-primary bg-primary/8 border border-primary/20 px-1 py-0.5 rounded-sm">
                        {imgCount} imaging
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface Order {
  id: bigint;
  type: "lab" | "imaging";
  name: string;
}

interface Prescription {
  id: bigint;
  drug: string;
  dose: string;
  frequency: string;
  route: string;
}

interface AllergyAlert {
  allergen: string;
  reaction: string;
  severity: "mild" | "moderate" | "severe";
}

interface EncounterOrdersProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  prescriptions: Prescription[];
  setPrescriptions: React.Dispatch<React.SetStateAction<Prescription[]>>;
  showOrderForm: boolean;
  setShowOrderForm: (v: boolean) => void;
  newOrder: { type: "lab" | "imaging"; name: string };
  setNewOrder: React.Dispatch<
    React.SetStateAction<{ type: "lab" | "imaging"; name: string }>
  >;
  showRxForm: boolean;
  setShowRxForm: (v: boolean) => void;
  newRx: { drug: string; dose: string; frequency: string; route: string };
  setNewRx: React.Dispatch<
    React.SetStateAction<{
      drug: string;
      dose: string;
      frequency: string;
      route: string;
    }>
  >;
  interactions: InteractionAlert[];
  allergyAlert: AllergyAlert | null;
  allergyJustification: string;
  setAllergyJustification: (v: string) => void;
  allergyOverridden: boolean;
  setAllergyOverridden: (v: boolean) => void;
  addingDespiteContraindicated: boolean;
  setAddingDespiteContraindicated: (v: boolean) => void;
  isSigned: boolean;
  hasContraindicatedAlert: boolean;
  handleAddOrder: () => void;
  handleAddRx: () => void;
  handleApplyOrderSet: (set: OrderSet) => void;
}

export function EncounterOrders({
  orders,
  setOrders,
  prescriptions,
  setPrescriptions,
  showOrderForm,
  setShowOrderForm,
  newOrder,
  setNewOrder,
  showRxForm,
  setShowRxForm,
  newRx,
  setNewRx,
  interactions,
  allergyAlert,
  allergyJustification,
  setAllergyJustification,
  allergyOverridden,
  setAllergyOverridden,
  addingDespiteContraindicated,
  setAddingDespiteContraindicated,
  isSigned,
  hasContraindicatedAlert,
  handleAddOrder,
  handleAddRx,
  handleApplyOrderSet,
}: EncounterOrdersProps) {
  return (
    <>
      {/* Orders */}
      <section className="border border-border bg-card mb-5">
        <div className="px-4 py-2 border-b border-border bg-muted/20 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Orders
          </h2>
          {!isSigned && (
            <button
              type="button"
              data-ocid="encounter.orders.primary_button"
              onClick={() => setShowOrderForm(!showOrderForm)}
              className="flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
            >
              <Plus className="w-3 h-3" />
              Add Order
            </button>
          )}
        </div>

        {!isSigned && (
          <div className="px-4 pt-3">
            <OrderSetsPanel onApply={handleApplyOrderSet} disabled={isSigned} />
          </div>
        )}

        {showOrderForm && (
          <div
            className="px-4 py-3 border-b border-border bg-muted/20"
            data-ocid="encounter.orders.panel"
          >
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Type
                </Label>
                <Select
                  value={newOrder.type}
                  onValueChange={(v) =>
                    setNewOrder((p) => ({ ...p, type: v as "lab" | "imaging" }))
                  }
                >
                  <SelectTrigger
                    data-ocid="encounter.orders.type.select"
                    className="mt-1 h-7 text-xs w-28"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab">Lab</SelectItem>
                    <SelectItem value="imaging">Imaging</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-48">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Order Name
                </Label>
                <Input
                  data-ocid="encounter.orders.name.input"
                  value={newOrder.name}
                  onChange={(e) =>
                    setNewOrder((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. CBC, Chest X-Ray"
                  className="mt-1 h-7 text-xs"
                  onKeyDown={(e) => e.key === "Enter" && handleAddOrder()}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-ocid="encounter.orders.submit_button"
                  onClick={handleAddOrder}
                  className="h-7 px-3 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  data-ocid="encounter.orders.cancel_button"
                  onClick={() => setShowOrderForm(false)}
                  className="h-7 px-3 text-xs font-semibold border border-border text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="divide-y divide-border">
          {orders.length === 0 ? (
            <p
              className="px-4 py-4 text-xs text-muted-foreground"
              data-ocid="encounter.orders.empty_state"
            >
              No orders placed
            </p>
          ) : (
            orders.map((order, i) => (
              <div
                key={String(order.id)}
                data-ocid={`encounter.orders.row.${i + 1}`}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider px-1.5 py-0.5 ${
                      order.type === "lab"
                        ? "bg-primary/5 text-primary border border-primary/20"
                        : "bg-primary/8 text-primary border border-primary/20"
                    }`}
                  >
                    {order.type}
                  </span>
                  <span className="text-sm text-foreground">{order.name}</span>
                </div>
                {!isSigned && (
                  <button
                    type="button"
                    data-ocid={`encounter.orders.delete_button.${i + 1}`}
                    onClick={() =>
                      setOrders((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    aria-label="Remove order"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Prescriptions */}
      <section className="border border-border bg-card mb-5">
        <div className="px-4 py-2 border-b border-border bg-muted/20 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Prescriptions
          </h2>
          {!isSigned && (
            <button
              type="button"
              data-ocid="encounter.prescriptions.primary_button"
              onClick={() => {
                setShowRxForm(!showRxForm);
                if (!showRxForm) {
                  setAddingDespiteContraindicated(false);
                }
              }}
              className="flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
            >
              <Plus className="w-3 h-3" />
              Add Prescription
            </button>
          )}
        </div>

        {showRxForm && (
          <div
            className="px-4 py-3 border-b border-border bg-muted/20"
            data-ocid="encounter.prescriptions.panel"
          >
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-36">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Drug Name
                </Label>
                <Input
                  data-ocid="encounter.prescriptions.drug.input"
                  value={newRx.drug}
                  onChange={(e) => {
                    setNewRx((p) => ({ ...p, drug: e.target.value }));
                    setAddingDespiteContraindicated(false);
                  }}
                  placeholder="e.g. Metformin"
                  className="mt-1 h-7 text-xs"
                  autoComplete="off"
                />
              </div>
              <div className="w-24">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Dose
                </Label>
                <Input
                  data-ocid="encounter.prescriptions.dose.input"
                  value={newRx.dose}
                  onChange={(e) =>
                    setNewRx((p) => ({ ...p, dose: e.target.value }))
                  }
                  placeholder="500mg"
                  className="mt-1 h-7 text-xs"
                />
              </div>
              <div className="w-36">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Frequency
                </Label>
                <Input
                  data-ocid="encounter.prescriptions.frequency.input"
                  value={newRx.frequency}
                  onChange={(e) =>
                    setNewRx((p) => ({ ...p, frequency: e.target.value }))
                  }
                  placeholder="Once daily"
                  className="mt-1 h-7 text-xs"
                />
              </div>
              <div className="w-28">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Route
                </Label>
                <Select
                  value={newRx.route}
                  onValueChange={(v) => setNewRx((p) => ({ ...p, route: v }))}
                >
                  <SelectTrigger
                    data-ocid="encounter.prescriptions.route.select"
                    className="mt-1 h-7 text-xs"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROUTE_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {interactions.length > 0 && (
              <div
                className="mt-3 space-y-2"
                data-ocid="encounter.prescriptions.interactions.panel"
                aria-label="Drug interaction alerts"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Drug Interaction Alerts ({interactions.length})
                </p>
                {interactions.map((alert) => (
                  <InteractionAlertCard
                    key={`${alert.drug1}-${alert.drug2}-${alert.severity}`}
                    alert={alert}
                  />
                ))}
              </div>
            )}

            {allergyAlert && !allergyOverridden && (
              <div
                className="mt-3 px-3 py-3 bg-destructive/10 border border-destructive/40 text-destructive text-xs"
                data-ocid="encounter.prescriptions.allergy.error_state"
                role="alert"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-destructive text-destructive-foreground text-xs font-bold uppercase tracking-wider">
                    ⚠ ALLERGY ALERT
                  </span>
                  <span className="font-semibold capitalize text-destructive">
                    {allergyAlert.severity} severity
                  </span>
                </div>
                <div className="space-y-0.5 mb-3">
                  <p>
                    <span className="font-semibold">Allergen:</span>{" "}
                    {allergyAlert.allergen}
                  </p>
                  <p>
                    <span className="font-semibold">Reaction:</span>{" "}
                    {allergyAlert.reaction}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="font-semibold text-xs uppercase tracking-wider text-destructive">
                    Clinical Justification Required to Override
                  </p>
                  <textarea
                    data-ocid="encounter.prescriptions.allergy.textarea"
                    value={allergyJustification}
                    onChange={(e) => setAllergyJustification(e.target.value)}
                    placeholder="Enter clinical justification (minimum 10 characters)..."
                    className="w-full h-14 px-2 py-1.5 text-xs border border-destructive/30 bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-destructive resize-none"
                    rows={2}
                  />
                  {allergyJustification.length >= 10 && (
                    <button
                      type="button"
                      data-ocid="encounter.prescriptions.allergy.override_button"
                      onClick={() => setAllergyOverridden(true)}
                      className="h-7 px-3 text-xs font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                    >
                      Override and Continue
                    </button>
                  )}
                </div>
              </div>
            )}

            {allergyAlert && allergyOverridden && (
              <div
                className="mt-3 px-3 py-2 bg-warning/10 border border-warning/30 text-warning text-xs font-semibold"
                data-ocid="encounter.prescriptions.allergy.overridden.success_state"
                role="alert"
              >
                ✓ Allergy override accepted. Justification documented.
              </div>
            )}

            {addingDespiteContraindicated && (
              <div
                className="mt-3 px-3 py-2 bg-destructive/10 border border-destructive/40 text-destructive text-xs font-semibold"
                data-ocid="encounter.prescriptions.contraindicated.error_state"
                role="alert"
              >
                ⚠ You are adding a drug despite a contraindicated interaction.
                Click Add again to confirm override.
              </div>
            )}

            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                data-ocid="encounter.prescriptions.submit_button"
                onClick={handleAddRx}
                disabled={!!(allergyAlert && !allergyOverridden)}
                className={`h-7 px-3 text-xs font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  hasContraindicatedAlert
                    ? "bg-destructive hover:bg-destructive/90"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {addingDespiteContraindicated
                  ? "Confirm Override"
                  : "Add Prescription"}
              </button>
              <button
                type="button"
                data-ocid="encounter.prescriptions.cancel_button"
                onClick={() => {
                  setShowRxForm(false);
                  setAddingDespiteContraindicated(false);
                  setAllergyJustification("");
                  setAllergyOverridden(false);
                }}
                className="h-7 px-3 text-xs font-semibold border border-border text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-border">
          {prescriptions.length === 0 ? (
            <p
              className="px-4 py-4 text-xs text-muted-foreground"
              data-ocid="encounter.prescriptions.empty_state"
            >
              No prescriptions added
            </p>
          ) : (
            prescriptions.map((rx, i) => (
              <div
                key={String(rx.id)}
                data-ocid={`encounter.prescriptions.row.${i + 1}`}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-foreground">
                    {rx.drug}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {rx.dose}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {rx.frequency}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-muted text-muted-foreground border border-border">
                    {rx.route}
                  </span>
                </div>
                {!isSigned && (
                  <button
                    type="button"
                    data-ocid={`encounter.prescriptions.delete_button.${i + 1}`}
                    onClick={() =>
                      setPrescriptions((prev) =>
                        prev.filter((_, idx) => idx !== i),
                      )
                    }
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    aria-label="Remove prescription"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}

export { InteractionAlertCard };
