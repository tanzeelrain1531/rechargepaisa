import { StatusBadge } from "@/components/StatusBadge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { ChevronDown, ChevronUp, Phone } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type ResultFlag = "normal" | "low" | "high" | "critical";
type ResultType = "lab" | "imaging";

interface InboxResult {
  id: number;
  patientName: string;
  testName: string;
  resultSummary: string;
  flag: ResultFlag;
  orderedDate: string;
  receivedDate: string;
  type: ResultType;
  provider: string;
  acknowledged: boolean;
  note: string;
  callbackProvider: string;
  callbackMethod: string;
  callbackDateTime: string;
  callbackNotes: string;
  forwardedTo: string;
}

const SEED_RESULTS_SEED = [
  {
    id: 1,
    patientName: "Eleanor Vasquez",
    testName: "HbA1c",
    resultSummary: "8.9% (Ref: 4.0–5.6%)",
    flag: "critical" as ResultFlag,
    orderedDate: "2026-03-10",
    receivedDate: "2026-03-12",
    type: "lab" as ResultType,
    provider: "Dr. Sarah Chen",
  },
  {
    id: 2,
    patientName: "Marcus Webb",
    testName: "Troponin I",
    resultSummary: "0.18 ng/mL (Ref: <0.04)",
    flag: "critical" as ResultFlag,
    orderedDate: "2026-03-11",
    receivedDate: "2026-03-12",
    type: "lab" as ResultType,
    provider: "Dr. Sarah Chen",
  },
  {
    id: 3,
    patientName: "Diana Cho",
    testName: "Potassium",
    resultSummary: "6.2 mEq/L (Ref: 3.5–5.0)",
    flag: "critical" as ResultFlag,
    orderedDate: "2026-03-11",
    receivedDate: "2026-03-13",
    type: "lab" as ResultType,
    provider: "Dr. Sarah Chen",
  },
  {
    id: 4,
    patientName: "Robert Kim",
    testName: "Chest X-Ray",
    resultSummary:
      "Bilateral infiltrates consistent with pneumonia. No pleural effusion.",
    flag: "high" as ResultFlag,
    orderedDate: "2026-03-10",
    receivedDate: "2026-03-11",
    type: "imaging" as ResultType,
    provider: "Dr. Sarah Chen",
  },
  {
    id: 5,
    patientName: "Eleanor Vasquez",
    testName: "Fasting Glucose",
    resultSummary: "186 mg/dL (Ref: 70–99)",
    flag: "high" as ResultFlag,
    orderedDate: "2026-03-09",
    receivedDate: "2026-03-11",
    type: "lab" as ResultType,
    provider: "Dr. Sarah Chen",
  },
  {
    id: 6,
    patientName: "James Okafor",
    testName: "CT Abdomen/Pelvis",
    resultSummary: "No acute findings. Mild hepatic steatosis noted.",
    flag: "normal" as ResultFlag,
    orderedDate: "2026-03-08",
    receivedDate: "2026-03-10",
    type: "imaging" as ResultType,
    provider: "Dr. Sarah Chen",
  },
  {
    id: 7,
    patientName: "Linda Park",
    testName: "Complete Metabolic Panel",
    resultSummary: "Creatinine 1.8 mg/dL (Ref: 0.7–1.3). Remaining values WNL.",
    flag: "high" as ResultFlag,
    orderedDate: "2026-03-09",
    receivedDate: "2026-03-12",
    type: "lab" as ResultType,
    provider: "Dr. Sarah Chen",
  },
  {
    id: 8,
    patientName: "Samuel Torres",
    testName: "CBC with Differential",
    resultSummary: "WBC 11.2 K/uL (Ref: 4.5–11.0). All other values normal.",
    flag: "high" as ResultFlag,
    orderedDate: "2026-03-10",
    receivedDate: "2026-03-12",
    type: "lab" as ResultType,
    provider: "Dr. Sarah Chen",
  },
  {
    id: 9,
    patientName: "Natalie Osei",
    testName: "Thyroid Panel (TSH/T4)",
    resultSummary: "TSH 0.12 mIU/L (Ref: 0.4–4.0). Free T4 normal.",
    flag: "low" as ResultFlag,
    orderedDate: "2026-03-08",
    receivedDate: "2026-03-11",
    type: "lab" as ResultType,
    provider: "Dr. Sarah Chen",
  },
  {
    id: 10,
    patientName: "Carlos Mendez",
    testName: "Urinalysis",
    resultSummary: "No significant abnormalities detected.",
    flag: "normal" as ResultFlag,
    orderedDate: "2026-03-11",
    receivedDate: "2026-03-13",
    type: "lab" as ResultType,
    provider: "Dr. Sarah Chen",
  },
];

const COLLEAGUES = [
  "Dr. Marcus Williams — Cardiology",
  "Dr. Lisa Park — Endocrinology",
  "Dr. James Okafor — Internal Medicine",
  "Dr. Amanda Torres — Nephrology",
  "Nurse Rebecca Hall",
];

const flagVariant = (
  f: ResultFlag,
): "success" | "warning" | "critical" | "danger" | "info" => {
  switch (f) {
    case "normal":
      return "success";
    case "low":
      return "info";
    case "high":
      return "warning";
    case "critical":
      return "critical";
  }
};

export default function ResultsInbox() {
  const { actor, isFetching } = useActor();
  const [results, setResults] = useState<InboxResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Callback UI state (local, derived from backend data via callbackOpen)
  const [expandedNote, setExpandedNote] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState<Record<number, string>>({});
  const [expandedForward, setExpandedForward] = useState<number | null>(null);
  const [forwardTarget, setForwardTarget] = useState<Record<number, string>>(
    {},
  );
  const [callbackOpen, setCallbackOpen] = useState<Record<number, boolean>>({});
  const [callbackDraft, setCallbackDraft] = useState<
    Record<
      number,
      {
        providerNotified: string;
        method: "Phone" | "Page" | "In-Person" | "Text";
        dateTime: string;
        notes: string;
      }
    >
  >({});

  type InboxActor = typeof actor & {
    listInboxResults: () => Promise<any[]>;
    createInboxResult: (...args: any[]) => Promise<any>;
    acknowledgeResult: (id: bigint) => Promise<void>;
    saveResultNote: (id: bigint, note: string) => Promise<void>;
    saveResultCallback: (
      id: bigint,
      provider: string,
      method: string,
      dateTime: string,
      notes: string,
    ) => Promise<void>;
    forwardResult: (id: bigint, target: string) => Promise<void>;
  };

  const loadResults = useCallback(async () => {
    if (!actor) return;
    const typedActor = actor as InboxActor;
    try {
      const raw = await typedActor.listInboxResults();
      if (raw.length === 0) {
        // Seed on first load
        await Promise.all(
          SEED_RESULTS_SEED.map((r) =>
            (actor as InboxActor).createInboxResult(
              r.patientName,
              r.testName,
              r.resultSummary,
              r.flag,
              r.type,
              r.orderedDate,
              r.receivedDate,
              r.provider,
            ),
          ),
        );
        const seeded = await (actor as InboxActor).listInboxResults();
        setResults(mapResults(seeded));
      } else {
        setResults(mapResults(raw));
      }
    } catch (err) {
      console.error("Failed to load inbox results", err);
      // Fallback to seed data locally
      setResults(
        SEED_RESULTS_SEED.map((r) => ({
          ...r,
          acknowledged: false,
          note: "",
          callbackProvider: "",
          callbackMethod: "",
          callbackDateTime: "",
          callbackNotes: "",
          forwardedTo: "",
        })),
      );
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (!isFetching && actor) {
      loadResults();
    }
  }, [actor, isFetching, loadResults]);

  function mapResults(raw: InboxResult[]): InboxResult[] {
    return raw.map((r: any) => ({
      id: Number(r.id),
      patientName: r.patientName,
      testName: r.testName,
      resultSummary: r.resultSummary,
      flag: r.flag as ResultFlag,
      type: r.resultType as ResultType,
      orderedDate: r.orderedDate,
      receivedDate: r.receivedDate,
      provider: r.provider,
      acknowledged: r.acknowledged,
      note: r.note,
      callbackProvider: r.callbackProvider,
      callbackMethod: r.callbackMethod,
      callbackDateTime: r.callbackDateTime,
      callbackNotes: r.callbackNotes,
      forwardedTo: r.forwardedTo,
    }));
  }

  const handleAcknowledge = async (id: number) => {
    if (!actor) return;
    try {
      await (actor as InboxActor).acknowledgeResult(BigInt(id));
      toast.success("Result acknowledged");
      setExpandedNote(null);
      setExpandedForward(null);
      await loadResults();
    } catch {
      toast.error("Failed to acknowledge result");
    }
  };

  const handleSaveNote = async (id: number, note: string) => {
    if (!actor) return;
    try {
      await (actor as InboxActor).saveResultNote(BigInt(id), note);
      toast.success("Note saved");
      setExpandedNote(null);
      await loadResults();
    } catch {
      toast.error("Failed to save note");
    }
  };

  const handleSaveCallback = async (id: number) => {
    if (!actor) return;
    const draft = callbackDraft[id];
    if (!draft?.providerNotified || !draft?.dateTime) {
      toast.error("Provider notified and date/time are required");
      return;
    }
    try {
      await (actor as InboxActor).saveResultCallback(
        BigInt(id),
        draft.providerNotified,
        draft.method,
        draft.dateTime,
        draft.notes,
      );
      toast.success("Callback documented");
      setCallbackOpen((prev) => ({ ...prev, [id]: false }));
      await loadResults();
    } catch {
      toast.error("Failed to save callback");
    }
  };

  const handleForward = async (id: number) => {
    if (!actor) return;
    const target = forwardTarget[id];
    if (!target) {
      toast.error("Please select a recipient");
      return;
    }
    try {
      await (actor as InboxActor).forwardResult(BigInt(id), target);
      toast.success("Result forwarded");
      setExpandedForward(null);
      await loadResults();
    } catch {
      toast.error("Failed to forward result");
    }
  };

  const toggleCallback = (id: number) => {
    setCallbackOpen((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!callbackDraft[id]) {
      setCallbackDraft((prev) => ({
        ...prev,
        [id]: {
          providerNotified: "",
          method: "Phone",
          dateTime: "",
          notes: "",
        },
      }));
    }
  };

  const pending = results.filter((r) => !r.acknowledged);
  const ackList = results.filter((r) => r.acknowledged);

  const ResultRow = ({
    result,
    idx,
    showAckButton,
  }: { result: InboxResult; idx: number; showAckButton: boolean }) => {
    const isCbOpen = callbackOpen[result.id] ?? false;
    const cbDraft = callbackDraft[result.id] ?? {
      providerNotified: "",
      method: "Phone" as const,
      dateTime: "",
      notes: "",
    };
    const hasCallback = !!result.callbackProvider;
    const hasNote = !!result.note;
    const isForwarded = !!result.forwardedTo;
    const currentNoteDraft = noteDraft[result.id] ?? result.note ?? "";

    return (
      <tr
        key={result.id}
        data-ocid={`inbox.result.item.${idx + 1}`}
        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
      >
        <td className="px-4 py-3">
          <button
            type="button"
            data-ocid={`inbox.patient.link.${idx + 1}`}
            className="text-[13px] font-semibold text-primary hover:underline"
          >
            {result.patientName}
          </button>
        </td>
        <td className="px-4 py-3">
          <p className="text-[13px] font-medium text-foreground">
            {result.testName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">
            {result.type}
          </p>
        </td>
        <td className="px-4 py-3 max-w-xs">
          <p className="text-[13px] text-foreground">{result.resultSummary}</p>
        </td>
        <td className="px-4 py-3">
          <StatusBadge variant={flagVariant(result.flag)} label={result.flag} />
        </td>
        <td className="px-4 py-3 text-[12px] text-muted-foreground">
          {result.orderedDate}
        </td>
        <td className="px-4 py-3 text-[12px] text-muted-foreground">
          {result.receivedDate}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {showAckButton && (
              <Button
                size="sm"
                variant="outline"
                data-ocid={`inbox.acknowledge.button.${idx + 1}`}
                onClick={() => handleAcknowledge(result.id)}
                className="h-6 text-xs px-2 border-success/0.4 text-success hover:bg-success/0.05"
              >
                Acknowledge
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              data-ocid={`inbox.note.button.${idx + 1}`}
              onClick={() =>
                setExpandedNote(expandedNote === result.id ? null : result.id)
              }
              className="h-6 text-xs px-2"
            >
              {expandedNote === result.id ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              Note
            </Button>
            {!isForwarded ? (
              <Button
                size="sm"
                variant="outline"
                data-ocid={`inbox.forward.button.${idx + 1}`}
                onClick={() =>
                  setExpandedForward(
                    expandedForward === result.id ? null : result.id,
                  )
                }
                className="h-6 text-xs px-2"
              >
                Forward
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground italic">
                Forwarded
              </span>
            )}
            {result.flag === "critical" &&
              (hasCallback ? (
                <StatusBadge variant="success" label="Callback Logged" />
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid={`inbox.callback.button.${idx + 1}`}
                  onClick={() => toggleCallback(result.id)}
                  className="h-6 text-xs px-2 border-warning/0.4 text-warning hover:bg-warning/0.05"
                >
                  <Phone className="w-3 h-3 mr-1" />
                  {isCbOpen ? "Close" : "Log Callback"}
                </Button>
              ))}
          </div>

          {/* Callback logged info */}
          {hasCallback && (
            <div className="mt-2 p-2.5 bg-success/0.08 border border-success/0.3 rounded-sm text-xs space-y-0.5">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-success" />
                <span className="font-semibold text-success">
                  Callback documented
                </span>
              </div>
              <div className="text-success">
                <span className="font-medium">Provider:</span>{" "}
                {result.callbackProvider} ·{" "}
                <span className="font-medium">Method:</span>{" "}
                {result.callbackMethod} ·{" "}
                <span className="font-medium">Time:</span>{" "}
                {result.callbackDateTime}
              </div>
              {result.callbackNotes && (
                <div className="text-muted-foreground">
                  {result.callbackNotes}
                </div>
              )}
            </div>
          )}

          {/* Inline callback form */}
          {isCbOpen && !hasCallback && (
            <div
              className="mt-2 p-3 bg-warning/0.06 border border-warning/0.3 rounded-sm space-y-2"
              data-ocid={`inbox.callback.panel.${idx + 1}`}
            >
              <p className="text-xs font-semibold text-warning">
                Log Critical Value Callback
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Provider Notified
                  </Label>
                  <Input
                    data-ocid={`inbox.callback.provider.input.${idx + 1}`}
                    placeholder="Provider name..."
                    value={cbDraft.providerNotified}
                    onChange={(e) =>
                      setCallbackDraft((prev) => ({
                        ...prev,
                        [result.id]: {
                          ...cbDraft,
                          providerNotified: e.target.value,
                        },
                      }))
                    }
                    className="h-7 text-xs mt-0.5"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Method
                  </Label>
                  <Select
                    value={cbDraft.method}
                    onValueChange={(v) =>
                      setCallbackDraft((prev) => ({
                        ...prev,
                        [result.id]: {
                          ...cbDraft,
                          method: v as "Phone" | "Page" | "In-Person" | "Text",
                        },
                      }))
                    }
                  >
                    <SelectTrigger
                      data-ocid={`inbox.callback.method.select.${idx + 1}`}
                      className="h-7 text-xs mt-0.5"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="Page">Page</SelectItem>
                      <SelectItem value="In-Person">In-Person</SelectItem>
                      <SelectItem value="Text">Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Date / Time
                </Label>
                <Input
                  data-ocid={`inbox.callback.datetime.input.${idx + 1}`}
                  type="datetime-local"
                  value={cbDraft.dateTime}
                  onChange={(e) =>
                    setCallbackDraft((prev) => ({
                      ...prev,
                      [result.id]: { ...cbDraft, dateTime: e.target.value },
                    }))
                  }
                  className="h-7 text-xs mt-0.5"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Notes
                </Label>
                <Textarea
                  data-ocid={`inbox.callback.notes.textarea.${idx + 1}`}
                  placeholder="Additional notes..."
                  value={cbDraft.notes}
                  onChange={(e) =>
                    setCallbackDraft((prev) => ({
                      ...prev,
                      [result.id]: { ...cbDraft, notes: e.target.value },
                    }))
                  }
                  className="text-xs mt-0.5 h-16 resize-none"
                />
              </div>
              <div className="flex justify-end gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid={`inbox.callback.cancel.button.${idx + 1}`}
                  onClick={() =>
                    setCallbackOpen((prev) => ({ ...prev, [result.id]: false }))
                  }
                  className="h-7 text-xs px-3"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  data-ocid={`inbox.callback.save.button.${idx + 1}`}
                  onClick={() => handleSaveCallback(result.id)}
                  className="h-7 text-xs px-3"
                >
                  Save Callback
                </Button>
              </div>
            </div>
          )}

          {/* Note form */}
          {expandedNote === result.id && (
            <div
              className="mt-2 p-3 bg-muted/30 border border-border rounded-sm space-y-2"
              data-ocid={`inbox.note.panel.${idx + 1}`}
            >
              {hasNote && (
                <p className="text-xs text-muted-foreground italic">
                  Saved note: {result.note}
                </p>
              )}
              <Textarea
                data-ocid={`inbox.note.textarea.${idx + 1}`}
                placeholder="Add a clinical note..."
                value={currentNoteDraft}
                onChange={(e) =>
                  setNoteDraft((prev) => ({
                    ...prev,
                    [result.id]: e.target.value,
                  }))
                }
                className="text-xs h-16 resize-none"
              />
              <div className="flex justify-end gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid={`inbox.note.cancel.button.${idx + 1}`}
                  onClick={() => setExpandedNote(null)}
                  className="h-7 text-xs px-3"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  data-ocid={`inbox.note.save.button.${idx + 1}`}
                  onClick={() => handleSaveNote(result.id, currentNoteDraft)}
                  className="h-7 text-xs px-3"
                >
                  Save Note
                </Button>
              </div>
            </div>
          )}

          {/* Forward form */}
          {expandedForward === result.id && !isForwarded && (
            <div
              className="mt-2 p-3 bg-muted/30 border border-border rounded-sm space-y-2"
              data-ocid={`inbox.forward.panel.${idx + 1}`}
            >
              <p className="text-xs font-semibold text-foreground">
                Forward to colleague
              </p>
              <Select
                value={forwardTarget[result.id] ?? ""}
                onValueChange={(v) =>
                  setForwardTarget((prev) => ({ ...prev, [result.id]: v }))
                }
              >
                <SelectTrigger
                  data-ocid={`inbox.forward.select.${idx + 1}`}
                  className="h-7 text-xs"
                >
                  <SelectValue placeholder="Select recipient..." />
                </SelectTrigger>
                <SelectContent>
                  {COLLEAGUES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid={`inbox.forward.cancel.button.${idx + 1}`}
                  onClick={() => setExpandedForward(null)}
                  className="h-7 text-xs px-3"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  data-ocid={`inbox.forward.confirm.button.${idx + 1}`}
                  onClick={() => handleForward(result.id)}
                  className="h-7 text-xs px-3"
                >
                  Forward
                </Button>
              </div>
            </div>
          )}
        </td>
      </tr>
    );
  };

  const ResultTable = ({
    results: tableResults,
    showAck,
  }: { results: InboxResult[]; showAck: boolean }) => (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      {tableResults.length === 0 ? (
        <p
          className="px-4 py-10 text-center text-[13px] text-muted-foreground"
          data-ocid="inbox.empty_state"
        >
          {showAck
            ? "No pending results to review."
            : "No acknowledged results yet."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/60">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Patient
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Test / Study
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Result
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Flag
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Ordered
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Received
                </th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {tableResults.map((r, idx) => (
                <ResultRow
                  key={r.id}
                  result={r}
                  idx={idx}
                  showAckButton={showAck}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4" data-ocid="inbox.loading_state">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="inbox.page">
      {/* Critical banner */}
      {pending.filter((r) => r.flag === "critical").length > 0 && (
        <div
          className="flex items-start gap-3 px-4 py-3 border border-destructive/30 bg-destructive/5 rounded-sm"
          data-ocid="inbox.critical.panel"
        >
          <svg
            className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-destructive">
              {pending.filter((r) => r.flag === "critical").length} Critical
              Result
              {pending.filter((r) => r.flag === "critical").length !== 1
                ? "s"
                : ""}{" "}
              Require Immediate Attention
            </p>
            <p className="text-xs text-destructive mt-0.5">
              {pending
                .filter((r) => r.flag === "critical")
                .map((r) => `${r.patientName} — ${r.testName}`)
                .join(" · ")}
            </p>
          </div>
        </div>
      )}

      <Tabs defaultValue="pending">
        <TabsList
          className="w-full justify-start rounded-none border-b border-border bg-transparent px-0 h-10 gap-0"
          data-ocid="inbox.tab"
        >
          <TabsTrigger
            value="pending"
            data-ocid="inbox.pending.tab"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-xs font-medium px-4 h-10"
          >
            Pending Review
            {pending.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full text-xs font-bold bg-destructive text-destructive-foreground">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="acknowledged"
            data-ocid="inbox.acknowledged.tab"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-xs font-medium px-4 h-10"
          >
            Acknowledged ({ackList.length})
          </TabsTrigger>
        </TabsList>

        <div className="pt-4">
          <TabsContent value="pending" className="mt-0">
            <ResultTable results={pending} showAck={true} />
          </TabsContent>
          <TabsContent value="acknowledged" className="mt-0">
            <ResultTable results={ackList} showAck={false} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
