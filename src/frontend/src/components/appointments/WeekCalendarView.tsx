import { cn } from "@/lib/utils";

const WEEK_COLORS: Record<string, string> = {
  scheduled: "bg-primary/10 border-primary/30 text-primary",
  completed: "bg-success/10 border-success/30 text-success",
  cancelled:
    "bg-muted border-muted-foreground/20 text-muted-foreground opacity-60",
  "in-progress": "bg-warning/10 border-warning/30 text-warning",
  "no-show": "bg-slate-50 border-slate-300 text-slate-600 opacity-60",
};

function getWeekDays(referenceDate: Date): Date[] {
  const day = referenceDate.getDay();
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() - ((day + 6) % 7));
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatHour(h: number): string {
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:00 ${ampm}`;
}

interface Appointment {
  id: bigint;
  patientId: bigint;
  date: string;
  status: string;
}

interface WeekCalendarViewProps {
  appts: Appointment[];
  getPatientName: (patientId: bigint) => string;
}

export function WeekCalendarView({
  appts,
  getPatientName,
}: WeekCalendarViewProps) {
  const weekDays = getWeekDays(new Date());
  const today = toDateStr(new Date());
  const HOURS = Array.from({ length: 11 }, (_, i) => i + 8);

  return (
    <div
      className="bg-card border border-border overflow-x-auto"
      data-ocid="appointments.week.panel"
    >
      <div className="min-w-[700px]">
        {/* Header row */}
        <div
          className="grid border-b border-border"
          style={{ gridTemplateColumns: "60px repeat(5, 1fr)" }}
        >
          <div className="border-r border-border" />
          {weekDays.map((day) => {
            const ds = toDateStr(day);
            const isToday = ds === today;
            return (
              <div
                key={ds}
                className={cn(
                  "px-2 py-2 text-center text-xs font-semibold border-r border-border last:border-r-0",
                  isToday
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground",
                )}
              >
                <div>
                  {["Mon", "Tue", "Wed", "Thu", "Fri"][weekDays.indexOf(day)]}
                </div>
                <div
                  className={cn(
                    "text-sm font-bold mt-0.5",
                    isToday ? "text-primary" : "text-foreground",
                  )}
                >
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        {/* Time rows */}
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="grid border-b border-border last:border-b-0"
            style={{
              gridTemplateColumns: "60px repeat(5, 1fr)",
              minHeight: 52,
            }}
          >
            <div className="border-r border-border px-2 flex items-start pt-1">
              <span className="text-xs text-muted-foreground">
                {formatHour(hour)}
              </span>
            </div>
            {weekDays.map((day) => {
              const ds = toDateStr(day);
              const isToday = ds === today;
              const slotAppts = appts.filter((a) => {
                if (!a.date.startsWith(ds)) return false;
                const h = Number.parseInt(a.date.slice(11, 13) || "9", 10);
                return h === hour;
              });
              return (
                <div
                  key={ds}
                  className={cn(
                    "border-r border-border last:border-r-0 p-1 space-y-1",
                    isToday ? "bg-primary/5" : "",
                  )}
                >
                  {slotAppts.map((a) => (
                    <div
                      key={String(a.id)}
                      className={cn(
                        "border rounded-sm px-1.5 py-1 text-xs leading-tight cursor-pointer transition-opacity hover:opacity-80",
                        WEEK_COLORS[a.status] ??
                          "bg-slate-50 border-slate-300 text-slate-700",
                      )}
                      title={`${getPatientName(a.patientId)} — ${a.status}`}
                    >
                      <div className="font-semibold truncate">
                        {getPatientName(a.patientId)}
                      </div>
                      <div className="text-xs opacity-70">
                        {a.date.slice(11, 16)}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
