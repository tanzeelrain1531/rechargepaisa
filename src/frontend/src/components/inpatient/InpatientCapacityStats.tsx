import React from "react";
import type { Ward } from "./inpatientTypes";

interface InpatientCapacityStatsProps {
  wards: Ward[];
}

export const InpatientCapacityStats = React.memo(
  function InpatientCapacityStats({ wards }: InpatientCapacityStatsProps) {
    const totalBeds = wards.reduce((sum, w) => sum + w.beds.length, 0);
    const occupied = wards.reduce(
      (sum, w) => sum + w.beds.filter((b) => b.status === "occupied").length,
      0,
    );
    const available = wards.reduce(
      (sum, w) => sum + w.beds.filter((b) => b.status === "available").length,
      0,
    );
    const reserved = wards.reduce(
      (sum, w) => sum + w.beds.filter((b) => b.status === "reserved").length,
      0,
    );

    const stats = [
      {
        label: "Total Beds",
        value: totalBeds,
        color: "var(--chart-1)",
        sub: "across all wards",
      },
      {
        label: "Occupied",
        value: occupied,
        color: "var(--destructive)",
        sub: `${Math.round((occupied / Math.max(totalBeds, 1)) * 100)}% occupancy`,
      },
      {
        label: "Available",
        value: available,
        color: "var(--success)",
        sub: "ready for admission",
      },
      {
        label: "Reserved",
        value: reserved,
        color: "var(--warning)",
        sub: "held / pending",
      },
    ];

    return (
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-sm px-4 py-3 shadow-card"
            data-ocid="inpatient.stats.card"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>
    );
  },
);
