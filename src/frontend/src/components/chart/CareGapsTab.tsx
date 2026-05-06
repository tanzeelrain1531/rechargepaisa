import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { DEMO_CARE_GAPS, type DemoCareGap } from "../../demoData";

const CARE_GAP_CATEGORIES = [
  "Preventive Screening",
  "Chronic Disease Management",
  "Immunizations",
];

export function CareGapsTab({ patientId }: { patientId: bigint }) {
  const base = DEMO_CARE_GAPS.filter((g) => g.patientId === patientId);
  const [orderedIds, setOrderedIds] = useState<Set<bigint>>(
    new Set(base.filter((g) => g.ordered).map((g) => g.id)),
  );

  const all = base.map((g) => ({ ...g, ordered: orderedIds.has(g.id) }));
  const addressed = all.filter((g) => g.ordered).length;
  const total = all.length;

  const priorityVariant = (p: DemoCareGap["priority"]) =>
    p === "high" ? "danger" : p === "medium" ? "warning" : "info";

  return (
    <div className="space-y-4" data-ocid="patient_chart.care_gaps.panel">
      {/* Summary */}
      <div className="bg-card border border-border px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          Care Gaps Summary
        </span>
        {total === 0 ? (
          <StatusBadge variant="success" label="All gaps addressed" />
        ) : (
          <span className="text-sm text-muted-foreground">
            <span
              className={cn(
                "font-bold",
                addressed === total ? "text-success" : "text-warning",
              )}
            >
              {addressed}
            </span>
            {" of "}
            <span className="font-bold text-foreground">{total}</span>
            {" care gaps addressed"}
          </span>
        )}
      </div>

      {total === 0 ? (
        <div
          className="bg-card border border-border px-4 py-8 text-center"
          data-ocid="patient_chart.care_gaps.empty_state"
        >
          <p className="text-sm text-muted-foreground">
            No outstanding care gaps for this patient.
          </p>
        </div>
      ) : (
        CARE_GAP_CATEGORIES.map((category) => {
          const items = all.filter((g) => g.category === category);
          if (items.length === 0) return null;
          return (
            <div key={category} className="bg-card border border-border">
              <div className="px-4 py-2.5 border-b border-border bg-muted/20">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  {category}
                </span>
              </div>
              <table
                className="w-full text-xs"
                data-ocid={`patient_chart.care_gaps.${category.toLowerCase().replace(/ /g, "_")}.table`}
              >
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Item
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Due Date
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Priority
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((gap, idx) => (
                    <tr
                      key={String(gap.id)}
                      className="hover:bg-muted/20"
                      data-ocid={`patient_chart.care_gaps.item.${idx + 1}`}
                    >
                      <td className="px-4 py-2.5 font-medium text-foreground">
                        {gap.item}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {gap.dueDate}
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge
                          variant={priorityVariant(gap.priority)}
                          label={gap.priority}
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge
                          variant={gap.ordered ? "success" : "neutral"}
                          label={gap.ordered ? "Ordered" : "Open"}
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        {!gap.ordered && (
                          <button
                            type="button"
                            data-ocid={`patient_chart.care_gaps.order_button.${idx + 1}`}
                            onClick={() =>
                              setOrderedIds((prev) => {
                                const next = new Set(prev);
                                next.add(gap.id);
                                return next;
                              })
                            }
                            className="px-2.5 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                          >
                            Order
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </div>
  );
}
