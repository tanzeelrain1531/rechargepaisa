import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const CENSUS_DATA = [
  {
    ward: "ICU",
    totalBeds: 12,
    occupied: 9,
    available: 3,
    todayAdmits: 2,
    todayDischarges: 1,
    avgLOS: 4.2,
  },
  {
    ward: "General Medicine",
    totalBeds: 30,
    occupied: 22,
    available: 8,
    todayAdmits: 5,
    todayDischarges: 3,
    avgLOS: 3.8,
  },
  {
    ward: "Surgical",
    totalBeds: 20,
    occupied: 15,
    available: 5,
    todayAdmits: 3,
    todayDischarges: 2,
    avgLOS: 2.9,
  },
  {
    ward: "Pediatric",
    totalBeds: 15,
    occupied: 7,
    available: 8,
    todayAdmits: 1,
    todayDischarges: 1,
    avgLOS: 2.1,
  },
  {
    ward: "Emergency",
    totalBeds: 25,
    occupied: 18,
    available: 7,
    todayAdmits: 12,
    todayDischarges: 10,
    avgLOS: 0.5,
  },
];

const OCCUPANCY_TREND = [
  {
    day: "Mon",
    ICU: 95,
    General: 82,
    Surgical: 78,
    Pediatric: 71,
    Emergency: 88,
  },
  {
    day: "Tue",
    ICU: 92,
    General: 85,
    Surgical: 80,
    Pediatric: 74,
    Emergency: 91,
  },
  {
    day: "Wed",
    ICU: 88,
    General: 80,
    Surgical: 76,
    Pediatric: 70,
    Emergency: 85,
  },
  {
    day: "Thu",
    ICU: 94,
    General: 87,
    Surgical: 82,
    Pediatric: 73,
    Emergency: 93,
  },
  {
    day: "Fri",
    ICU: 91,
    General: 84,
    Surgical: 79,
    Pediatric: 75,
    Emergency: 89,
  },
  {
    day: "Sat",
    ICU: 87,
    General: 78,
    Surgical: 74,
    Pediatric: 68,
    Emergency: 82,
  },
  {
    day: "Sun",
    ICU: 90,
    General: 81,
    Surgical: 77,
    Pediatric: 72,
    Emergency: 86,
  },
];

export function ReportingCensusTab() {
  const totalBeds = CENSUS_DATA.reduce((s, w) => s + w.totalBeds, 0);
  const totalOccupied = CENSUS_DATA.reduce((s, w) => s + w.occupied, 0);
  const totalAvailable = CENSUS_DATA.reduce((s, w) => s + w.available, 0);
  const occupancyRate = Math.round((totalOccupied / totalBeds) * 100);

  return (
    <div className="space-y-4" data-ocid="reporting.census.section">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Beds", value: totalBeds, color: "text-foreground" },
          { label: "Occupied", value: totalOccupied, color: "text-foreground" },
          { label: "Available", value: totalAvailable, color: "text-success" },
          {
            label: "Occupancy Rate",
            value: `${occupancyRate}%`,
            color: occupancyRate > 85 ? "text-destructive" : "text-foreground",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-sm px-4 py-3"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-sm p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Occupancy by Ward
        </p>
        <BarChart
          width={600}
          height={200}
          data={CENSUS_DATA}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="ward" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <RechartsTooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 4,
              border: "1px solid #e2e8f0",
            }}
          />
          <Bar
            dataKey="occupied"
            fill="var(--chart-1)"
            name="Occupied"
            radius={[3, 3, 0, 0]}
          />
          <Bar
            dataKey="available"
            fill="var(--chart-2)"
            name="Available"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </div>

      <div
        className="bg-card border border-border rounded-sm p-4"
        data-ocid="reporting.census.trend.card"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          7-Day Bed Occupancy Trend (%)
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={OCCUPANCY_TREND}
            margin={{ top: 8, right: 16, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(var(--border))"
              opacity={0.5}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "oklch(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[60, 100]}
              tick={{ fontSize: 10, fill: "oklch(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              unit="%"
            />
            <RechartsTooltip
              contentStyle={{
                fontSize: 11,
                background: "oklch(var(--popover))",
                border: "1px solid oklch(var(--border))",
                borderRadius: 6,
              }}
              formatter={(value: number) => [`${value}%`]}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line
              type="monotone"
              dataKey="ICU"
              name="ICU"
              stroke="var(--destructive)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="General"
              name="General"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Surgical"
              name="Surgical"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Pediatric"
              name="Pediatric"
              stroke="var(--chart-4)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Emergency"
              name="Emergency"
              stroke="var(--warning)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        className="bg-card border border-border rounded-sm overflow-hidden"
        data-ocid="reporting.census.table"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {[
                "Ward",
                "Total Beds",
                "Occupied",
                "Available",
                "Today's Admits",
                "Today's Discharges",
                "Avg LOS (days)",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CENSUS_DATA.map((ward, idx) => (
              <tr
                key={ward.ward}
                data-ocid={`reporting.census.row.${idx + 1}`}
                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-foreground">
                  {ward.ward}
                </td>
                <td className="px-4 py-3 text-foreground">{ward.totalBeds}</td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-foreground">
                    {ward.occupied}
                  </span>
                  <span className="text-muted-foreground text-xs ml-1">
                    ({Math.round((ward.occupied / ward.totalBeds) * 100)}%)
                  </span>
                </td>
                <td className="px-4 py-3 text-success">{ward.available}</td>
                <td className="px-4 py-3 text-foreground">
                  {ward.todayAdmits}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {ward.todayDischarges}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {ward.avgLOS}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/30">
              <td className="px-4 py-2.5 font-semibold text-foreground text-sm">
                Total
              </td>
              <td className="px-4 py-2.5 font-semibold text-foreground">
                {totalBeds}
              </td>
              <td className="px-4 py-2.5 font-semibold text-foreground">
                {totalOccupied}
              </td>
              <td className="px-4 py-2.5 font-semibold text-success">
                {totalAvailable}
              </td>
              <td className="px-4 py-2.5 font-semibold text-foreground">
                {CENSUS_DATA.reduce((s, w) => s + w.todayAdmits, 0)}
              </td>
              <td className="px-4 py-2.5 font-semibold text-foreground">
                {CENSUS_DATA.reduce((s, w) => s + w.todayDischarges, 0)}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">—</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
