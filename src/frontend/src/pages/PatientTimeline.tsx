import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClipboardList,
  FileImage,
  FlaskConical,
  GitBranch,
  Pill,
  Stethoscope,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  DEMO_CLINICAL_NOTES,
  DEMO_IMAGING_ORDERS,
  DEMO_LAB_RESULTS,
  DEMO_PATIENTS,
  DEMO_PRESCRIPTIONS,
  DEMO_REFERRALS,
} from "../demoData";

type EventType = "encounter" | "lab" | "imaging" | "prescription" | "referral";

interface TimelineEvent {
  id: string;
  type: EventType;
  date: Date;
  title: string;
  subtitle: string;
  status: string;
  statusVariant: "success" | "warning" | "danger" | "info" | "neutral";
  detail: string;
}

const TYPE_CONFIG: Record<
  EventType,
  { icon: React.ElementType; label: string }
> = {
  encounter: { icon: Stethoscope, label: "Encounter" },
  lab: { icon: FlaskConical, label: "Lab" },
  imaging: { icon: FileImage, label: "Imaging" },
  prescription: { icon: Pill, label: "Rx" },
  referral: { icon: GitBranch, label: "Referral" },
};

const TYPE_ICON_CLASSES: Record<EventType, { color: string; bg: string }> = {
  encounter: { color: "text-primary", bg: "bg-primary/10" },
  lab: { color: "text-primary", bg: "bg-primary/8" },
  imaging: { color: "text-muted-foreground", bg: "bg-muted/60" },
  prescription: { color: "text-muted-foreground", bg: "bg-muted/40" },
  referral: { color: "text-muted-foreground", bg: "bg-muted/50" },
};

const NOTE_DATES = [
  new Date(Date.now() - 2 * 86400000),
  new Date(Date.now() - 8 * 86400000),
  new Date(Date.now() - 14 * 86400000),
  new Date(Date.now() - 21 * 86400000),
  new Date(Date.now() - 30 * 86400000),
  new Date(Date.now() - 45 * 86400000),
  new Date(Date.now() - 60 * 86400000),
  new Date(Date.now() - 75 * 86400000),
  new Date(Date.now() - 90 * 86400000),
  new Date(Date.now() - 105 * 86400000),
];

const LAB_DATES = [
  new Date(Date.now() - 3 * 86400000),
  new Date(Date.now() - 3 * 86400000),
  new Date(Date.now() - 9 * 86400000),
  new Date(Date.now() - 9 * 86400000),
  new Date(Date.now() - 15 * 86400000),
  new Date(Date.now() - 22 * 86400000),
  new Date(Date.now() - 31 * 86400000),
  new Date(Date.now() - 46 * 86400000),
  new Date(Date.now() - 61 * 86400000),
  new Date(Date.now() - 76 * 86400000),
  new Date(Date.now() - 91 * 86400000),
  new Date(Date.now() - 106 * 86400000),
  new Date(Date.now() - 91 * 86400000),
  new Date(Date.now() - 61 * 86400000),
  new Date(Date.now() - 76 * 86400000),
  new Date(Date.now() - 46 * 86400000),
  new Date(Date.now() - 46 * 86400000),
];

function noteTypeLabel(noteType: string): string {
  if (noteType === "SOAP") return "SOAP Note";
  if (noteType === "Progress") return "Progress Note";
  return noteType;
}

function statusVariantForPrescription(
  status: string,
): TimelineEvent["statusVariant"] {
  if (status === "dispensed") return "success";
  if (status === "verified") return "info";
  if (status === "pending") return "warning";
  if (status === "rejected") return "danger";
  return "neutral";
}

function statusVariantForReferral(
  status: string,
): TimelineEvent["statusVariant"] {
  if (status === "completed") return "success";
  if (status === "sent") return "info";
  if (status === "pending") return "warning";
  return "neutral";
}

function statusVariantForImaging(
  status: string,
): TimelineEvent["statusVariant"] {
  if (status === "reported") return "success";
  if (status === "completed") return "info";
  if (status === "ordered") return "warning";
  return "neutral";
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const ALL_TYPES: EventType[] = [
  "encounter",
  "lab",
  "imaging",
  "prescription",
  "referral",
];

interface PatientTimelineProps {
  activePatientId?: bigint;
  activePatientName?: string;
}

export default function PatientTimeline({
  activePatientId,
  activePatientName,
}: PatientTimelineProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<EventType | "all">("all");
  const [loading] = useState(false);

  const mrn = useMemo(() => {
    if (!activePatientId) return "";
    return DEMO_PATIENTS.find((p) => p.id === activePatientId)?.mrn ?? "";
  }, [activePatientId]);

  const events = useMemo<TimelineEvent[]>(() => {
    if (!activePatientId) return [];
    const pid = activePatientId;
    const result: TimelineEvent[] = [];

    let noteIdx = 0;
    for (const n of DEMO_CLINICAL_NOTES.filter((n) => n.patientId === pid)) {
      result.push({
        id: `enc-${String(n.id)}`,
        type: "encounter",
        date:
          NOTE_DATES[Number(n.id) - 1] ??
          new Date(Date.now() - noteIdx * 86400000 * 14),
        title: `Encounter \u2014 ${noteTypeLabel(n.noteType)}`,
        subtitle: "Dr. Jordan Lee \u00b7 St. Michael\u2019s Medical Center",
        status: "Signed",
        statusVariant: "success",
        detail: n.content,
      });
      noteIdx++;
    }

    let labIdx = 0;
    for (const l of DEMO_LAB_RESULTS.filter((l) => l.patientId === pid)) {
      result.push({
        id: `lab-${String(l.id)}`,
        type: "lab",
        date:
          LAB_DATES[Number(l.id) - 1] ??
          new Date(Date.now() - labIdx * 86400000 * 7),
        title: `Lab Result \u2014 ${l.testName}`,
        subtitle: `${l.result} ${l.unit}`,
        status: l.isCritical ? "Critical" : "Normal",
        statusVariant: l.isCritical ? "danger" : "success",
        detail: `Result: ${l.result} ${l.unit}${
          l.isCritical
            ? " \u2014 CRITICAL VALUE, provider notification required"
            : ""
        }`,
      });
      labIdx++;
    }

    for (const img of DEMO_IMAGING_ORDERS.filter(
      (img) => BigInt(img.patientId) === pid,
    )) {
      result.push({
        id: `img-${img.id}`,
        type: "imaging",
        date: new Date(img.date),
        title: `Imaging \u2014 ${img.modality} ${img.bodyPart}`,
        subtitle: img.reportedBy
          ? `Reported by ${img.reportedBy}`
          : "Awaiting report",
        status: img.status,
        statusVariant: statusVariantForImaging(img.status),
        detail: img.findings ? img.findings : "No findings reported yet.",
      });
    }

    for (const rx of DEMO_PRESCRIPTIONS.filter((rx) => rx.patientId === pid)) {
      result.push({
        id: `rx-${String(rx.id)}`,
        type: "prescription",
        date: new Date(Number(rx.createdAt) / 1_000_000),
        title: `Prescription \u2014 ${rx.medication}`,
        subtitle: `${rx.dose} \u00b7 ${rx.prescribedBy}`,
        status: rx.status,
        statusVariant: statusVariantForPrescription(rx.status),
        detail: rx.notes ?? "",
      });
    }

    for (const r of DEMO_REFERRALS.filter((r) => r.patientId === pid)) {
      result.push({
        id: `ref-${String(r.id)}`,
        type: "referral",
        date: new Date(Number(r.createdAt) / 1_000_000),
        title: `Referral \u2014 ${r.referredTo}`,
        subtitle:
          r.reason.slice(0, 80) + (r.reason.length > 80 ? "\u2026" : ""),
        status: r.status,
        statusVariant: statusVariantForReferral(r.status),
        detail: r.notes ?? r.reason,
      });
    }

    return result.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [activePatientId]);

  const filtered =
    filterType === "all" ? events : events.filter((e) => e.type === filterType);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!activePatientId) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 text-center"
        data-ocid="patient_timeline.empty_state"
      >
        <ClipboardList className="w-10 h-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">
          No patient selected
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Open a patient from the Patients page to view their timeline
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0" data-ocid="patient_timeline.page">
      {/* In-page patient context subheader */}
      {activePatientName && (
        <div className="bg-muted/30 border-b px-6 py-2 text-sm flex items-center gap-2 -mx-6 mb-4">
          <span className="font-semibold text-foreground">
            {activePatientName}
          </span>
          {mrn && <span className="text-muted-foreground text-xs">{mrn}</span>}
          <span className="text-muted-foreground/40 text-xs">›</span>
          <span className="text-muted-foreground text-xs">Timeline</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            data-ocid="patient_timeline.all.tab"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
              filterType === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            All ({events.length})
          </button>
          {ALL_TYPES.map((t) => {
            const count = events.filter((e) => e.type === t).length;
            if (count === 0) return null;
            const cfg = TYPE_ICON_CLASSES[t];
            const Icon = TYPE_CONFIG[t].icon;
            return (
              <button
                key={t}
                type="button"
                data-ocid={`patient_timeline.${t}.tab`}
                onClick={() => setFilterType(t)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                  filterType === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon
                  className={`w-3 h-3 ${filterType === t ? "" : cfg.color}`}
                />
                {t.charAt(0).toUpperCase() + t.slice(1)}s ({count})
              </button>
            );
          })}
        </div>

        {/* Loading state */}
        {loading && (
          <div data-ocid="patient_timeline.loading_state" className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex gap-4">
                <Skeleton className="w-11 h-11 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="patient_timeline.events.empty_state"
          >
            <ClipboardList className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">
              No {filterType === "all" ? "" : filterType} events found for{" "}
              {activePatientName ?? "this patient"}
            </p>
          </div>
        ) : (
          !loading && (
            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[22px] top-0 bottom-0 w-px bg-border" />

                <div className="space-y-0">
                  {filtered.map((event, i) => {
                    const cfg = TYPE_ICON_CLASSES[event.type];
                    const Icon = TYPE_CONFIG[event.type].icon;
                    const isExpanded = expandedIds.has(event.id);

                    return (
                      <div
                        key={event.id}
                        data-ocid={`patient_timeline.item.${i + 1}`}
                        className="relative flex gap-4 pb-4"
                      >
                        {/* Icon node */}
                        <div
                          className={`relative z-10 flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center border-2 border-background ${cfg.bg} mt-0.5`}
                        >
                          <Icon className={`w-4 h-4 ${cfg.color}`} />
                        </div>

                        {/* Content card */}
                        <Card className="flex-1 border border-border shadow-card bg-card">
                          <CardHeader className="px-4 py-3 pb-2">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-foreground leading-tight">
                                    {event.title}
                                  </p>
                                  <StatusBadge
                                    variant={event.statusVariant}
                                    label={event.status}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {event.subtitle}
                                </p>
                              </div>
                              <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
                                {formatDate(event.date)}
                              </span>
                            </div>
                          </CardHeader>
                          {event.detail && (
                            <CardContent className="px-4 pb-3 pt-0">
                              <button
                                type="button"
                                data-ocid={`patient_timeline.expand.button.${i + 1}`}
                                onClick={() => toggleExpand(event.id)}
                                className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                              >
                                {isExpanded
                                  ? "Hide details \u2191"
                                  : "Show details \u2193"}
                              </button>
                              {isExpanded && (
                                <p className="mt-2 text-xs text-muted-foreground leading-relaxed border-t border-border pt-2">
                                  {event.detail}
                                </p>
                              )}
                            </CardContent>
                          )}
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          )
        )}
      </div>
    </div>
  );
}
