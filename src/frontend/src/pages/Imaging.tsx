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
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronUp,
  Contrast,
  Info,
  Maximize2,
  Minus,
  Move,
  Plus,
  Printer,
  SlidersHorizontal,
  Sun,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { PatientFilterBar } from "../components/PatientFilterBar";
import { StatusBadge } from "../components/StatusBadge";
import { DEMO_IMAGING_ORDERS } from "../demoData";
import { DEMO_PATIENTS } from "../demoData";
import { useActor } from "../hooks/useActor";
import { useDemoMode } from "../hooks/useDemoMode";

type ImagingStatus = "ordered" | "scheduled" | "completed" | "reported";
type Modality = "X-Ray" | "CT" | "MRI" | "Ultrasound";

interface ImagingOrder {
  id: number;
  patientName: string;
  modality: Modality;
  bodyPart: string;
  status: ImagingStatus;
  date: string;
  reportedBy?: string;
  findings?: string;
}

const mockReports: Record<number, string> = {
  1: "CT chest demonstrates bilateral hilar adenopathy with mediastinal widening. No pleural effusion or pneumothorax identified. The lung parenchyma shows scattered ground-glass opacities predominantly in the right lower lobe, consistent with early consolidation. Impression: Findings suggestive of infectious or inflammatory process; clinical correlation recommended.",
  5: "Plain radiograph of the right hand demonstrates no acute fracture or dislocation. Bone mineralization is normal for age. Mild soft tissue swelling noted around the proximal interphalangeal joint of the index finger. Impression: No osseous injury identified; soft tissue contusion cannot be excluded.",
};

const statusVariant: Record<
  ImagingStatus,
  "warning" | "info" | "success" | "neutral"
> = {
  ordered: "warning",
  scheduled: "info",
  completed: "success",
  reported: "success",
};

function DicomPlaceholder({
  modality,
  bodyPart,
}: { modality: Modality; bodyPart: string }) {
  // SVG body silhouettes keyed by modality context
  const silhouette = (() => {
    const lowerBodyPart = bodyPart.toLowerCase();
    if (lowerBodyPart.includes("chest") || modality === "CT") {
      // Chest/torso outline
      return (
        <g stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none">
          <ellipse cx="300" cy="140" rx="70" ry="40" />
          <path d="M230 140 Q230 260 260 300 L340 300 Q370 260 370 140" />
          <line x1="270" y1="145" x2="270" y2="295" strokeDasharray="4 3" />
          <line x1="330" y1="145" x2="330" y2="295" strokeDasharray="4 3" />
          <ellipse cx="285" cy="220" rx="28" ry="38" />
          <ellipse cx="315" cy="220" rx="28" ry="38" />
        </g>
      );
    }
    if (
      lowerBodyPart.includes("knee") ||
      lowerBodyPart.includes("hand") ||
      lowerBodyPart.includes("spine") ||
      lowerBodyPart.includes("lumbar")
    ) {
      // Skeletal outline
      return (
        <g stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none">
          <rect x="260" y="100" width="80" height="120" rx="10" />
          <rect x="260" y="240" width="80" height="110" rx="10" />
          <ellipse cx="300" cy="230" rx="30" ry="15" />
          <line
            x1="300"
            y1="100"
            x2="300"
            y2="350"
            stroke="rgba(255,255,255,0.08)"
          />
        </g>
      );
    }
    // Generic body/abdomen
    return (
      <g stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none">
        <ellipse cx="300" cy="120" rx="45" ry="50" />
        <path d="M255 160 Q240 200 245 300 L355 300 Q360 200 345 160" />
        <ellipse cx="300" cy="240" rx="50" ry="55" />
      </g>
    );
  })();

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 600 420"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`DICOM placeholder — ${modality} ${bodyPart}`}
    >
      {/* Subtle scan-line texture */}
      <defs>
        <pattern
          id="scanlines"
          width="1"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="600"
            y2="0"
            stroke="rgba(255,255,255,0.025)"
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(82,180,200,0.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="600" height="420" fill="url(#scanlines)" />
      <ellipse cx="300" cy="210" rx="220" ry="180" fill="url(#glow)" />
      {silhouette}
      {/* Crosshair */}
      <line
        x1="295"
        y1="205"
        x2="305"
        y2="205"
        stroke="rgba(82,180,200,0.5)"
        strokeWidth="1"
      />
      <line
        x1="300"
        y1="200"
        x2="300"
        y2="210"
        stroke="rgba(82,180,200,0.5)"
        strokeWidth="1"
      />
      {/* Corner markers */}
      <g stroke="rgba(82,180,200,0.35)" strokeWidth="1" fill="none">
        <path d="M30 30 L30 50 M30 30 L50 30" />
        <path d="M570 30 L570 50 M570 30 L550 30" />
        <path d="M30 390 L30 370 M30 390 L50 390" />
        <path d="M570 390 L570 370 M570 390 L550 390" />
      </g>
      {/* Label top-left */}
      <text
        x="38"
        y="78"
        fill="rgba(82,180,200,0.7)"
        fontSize="10"
        fontFamily="monospace"
      >
        ST. MICHAEL'S MEDICAL CENTER
      </text>
      <text
        x="38"
        y="92"
        fill="rgba(255,255,255,0.4)"
        fontSize="9"
        fontFamily="monospace"
      >
        {modality} | {bodyPart.toUpperCase()}
      </text>
    </svg>
  );
}

interface ImagingProps {
  activePatientId?: bigint;
  activePatientName?: string;
  onClearFilter?: () => void;
  onNavigate?: (page: string) => void;
}

export default function Imaging({
  onNavigate,
  activePatientId,
  activePatientName,
  onClearFilter,
}: ImagingProps) {
  const { isDemoMode, demoActor } = useDemoMode();
  const { actor: realActor, isFetching } = useActor();
  const actor = isDemoMode ? demoActor : realActor;
  const [encounterOrders, setEncounterOrders] = useState<ImagingOrder[]>([]);
  const [orders, setOrders] = useState<ImagingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadData = useCallback(async () => {
    if (!actor) return;
    try {
      const backendOrders = await actor.listImagingOrders();
      const mapped: ImagingOrder[] = (
        backendOrders as Array<{
          id: bigint;
          patientName: string;
          modality: string;
          bodyPart: string;
          status: string;
          createdAt: bigint;
        }>
      ).map((o) => ({
        id: Number(o.id),
        patientName: o.patientName,
        modality: o.modality as Modality,
        bodyPart: o.bodyPart,
        status: o.status as ImagingStatus,
        date: new Date(Number(o.createdAt) / 1_000_000)
          .toISOString()
          .slice(0, 10),
      }));
      if (isDemoMode) {
        const backendIds = new Set(mapped.map((o) => o.id));
        const demoMapped: ImagingOrder[] = DEMO_IMAGING_ORDERS.map((o) => ({
          id: o.id,
          patientName: o.patientName,
          modality: o.modality as ImagingOrder["modality"],
          bodyPart: o.bodyPart,
          status: o.status as ImagingOrder["status"],
          date: o.date,
        }));
        const merged = [
          ...mapped,
          ...demoMapped.filter((o) => !backendIds.has(o.id)),
        ];
        setOrders(merged);
      } else {
        setOrders(mapped);
      }
      // Also load localStorage encounter orders
      const raw = localStorage.getItem("medunite_imaging_orders");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const localMapped: ImagingOrder[] = parsed.map(
            (entry: {
              id: number;
              patientName: string;
              modality: string;
              bodyPart: string;
              status: string;
              date: string;
            }) => ({
              id: entry.id,
              patientName: entry.patientName,
              modality: entry.modality as Modality,
              bodyPart: entry.bodyPart,
              status: "ordered" as ImagingStatus,
              date: entry.date,
            }),
          );
          setEncounterOrders(localMapped);
        } catch {
          /* ignore */
        }
      }
    } catch {
      toast.error("Failed to load imaging orders");
      if (isDemoMode) {
        setOrders(
          DEMO_IMAGING_ORDERS.map((o) => ({
            id: o.id,
            patientName: o.patientName,
            modality: o.modality as Modality,
            bodyPart: o.bodyPart,
            status: o.status as ImagingStatus,
            date: o.date,
          })),
        );
      }
    } finally {
      setLoading(false);
    }
  }, [actor, isDemoMode]);

  useEffect(() => {
    if (!actor) return;
    if (!isDemoMode && isFetching) return;
    setLoading(true);
    loadData();
  }, [actor, isFetching, loadData, isDemoMode]);
  const [expandedRequisition, setExpandedRequisition] = useState<number | null>(
    null,
  );
  const [viewerOrderId, setViewerOrderId] = useState<number | null>(null);
  const [panActive, setPanActive] = useState(false);
  const [windowLevelActive, setWindowLevelActive] = useState(false);
  const [brightness, setBrightness] = useState([50]);
  const [contrastVal, setContrastVal] = useState([50]);
  const [reportExpanded, setReportExpanded] = useState<Record<number, boolean>>(
    {},
  );
  const [form, setForm] = useState({
    patientId: "",
    modality: "X-Ray",
    bodyPart: "",
    status: "ordered",
  });

  const handleAdd = async () => {
    if (!form.patientId || !form.bodyPart) {
      toast.error("Patient and body part required");
      return;
    }
    if (!actor) return;
    try {
      const patient = DEMO_PATIENTS.find(
        (p) => String(p.id) === form.patientId,
      );
      await actor.createImagingOrder(
        BigInt(form.patientId),
        patient?.name ?? "Unknown",
        form.modality,
        form.bodyPart,
        form.status,
        "Dr. Sarah Chen",
        form.bodyPart,
      );
      toast.success("Imaging order created");
      setShowForm(false);
      setForm({
        patientId: "",
        modality: "X-Ray",
        bodyPart: "",
        status: "ordered",
      });
      await loadData();
    } catch {
      toast.error("Failed to create imaging order");
    }
  };

  const handleAdvanceStatus = async (
    orderId: number,
    currentStatus: string,
  ) => {
    const statusFlow: Record<string, string> = {
      ordered: "scheduled",
      scheduled: "completed",
      completed: "reported",
    };
    const next = statusFlow[currentStatus];
    if (!next || !actor) return;
    try {
      await actor.updateImagingOrderStatus(BigInt(orderId), next);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: next as ImagingStatus } : o,
        ),
      );
      toast.success(`Status updated to ${next}`);
    } catch {
      toast.error("Failed to update imaging order status");
    }
  };

  const handleRowClick = (order: ImagingOrder) => {
    if (order.status !== "completed" && order.status !== "reported") return;
    setViewerOrderId((prev) => (prev === order.id ? null : order.id));
  };

  const viewerOrder = orders.find((o) => o.id === viewerOrderId) ?? null;

  const [modalityFilter, setModalityFilter] = useState<string>(() => {
    try {
      const p = JSON.parse(
        localStorage.getItem("medunite_prefs_Radiologist") || "{}",
      );
      if (p.modality && p.modality !== "All Modalities") return p.modality;
    } catch {
      /* ignore */
    }
    return "All";
  });

  const modalityOptions = ["All", "X-Ray", "CT", "MRI", "Ultrasound"];

  const filteredImagingOrders =
    modalityFilter === "All"
      ? orders
      : orders.filter(
          (o) =>
            o.modality.toLowerCase() === modalityFilter.toLowerCase() ||
            (modalityFilter === "X-ray" && o.modality === "X-Ray"),
        );

  const toggleRawReport = (id: number) => {
    setReportExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-5" data-ocid="imaging.page">
      {activePatientId && activePatientName && (
        <PatientFilterBar
          patientName={activePatientName}
          onClear={onClearFilter ?? (() => {})}
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-foreground">
            {modalityFilter && modalityFilter !== "All"
              ? `Imaging — ${modalityFilter}`
              : "Imaging"}
          </h1>
        </div>
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          data-ocid="imaging.primary_button"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? (
            <ChevronUp className="w-3.5 h-3.5 mr-1.5" />
          ) : (
            <Plus className="w-3.5 h-3.5 mr-1.5" />
          )}
          New Order
        </Button>
      </div>

      {showForm && (
        <div
          className="border border-border bg-card p-5"
          data-ocid="imaging.panel"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4">
            New Imaging Order
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Patient
              </Label>
              <Select
                onValueChange={(v) => setForm((p) => ({ ...p, patientId: v }))}
              >
                <SelectTrigger
                  data-ocid="imaging.patient.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {DEMO_PATIENTS.map((p) => (
                    <SelectItem key={String(p.id)} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Modality
              </Label>
              <Select
                value={form.modality}
                onValueChange={(v) => setForm((p) => ({ ...p, modality: v }))}
              >
                <SelectTrigger
                  data-ocid="imaging.modality.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="X-Ray">X-Ray</SelectItem>
                  <SelectItem value="CT">CT</SelectItem>
                  <SelectItem value="MRI">MRI</SelectItem>
                  <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Body Part
              </Label>
              <Input
                data-ocid="imaging.bodypart.input"
                value={form.bodyPart}
                onChange={(e) =>
                  setForm((p) => ({ ...p, bodyPart: e.target.value }))
                }
                className="mt-1 h-8 text-sm"
                placeholder="e.g. Chest"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
              >
                <SelectTrigger
                  data-ocid="imaging.status.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ordered">Ordered</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button
              size="sm"
              data-ocid="imaging.submit_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleAdd}
            >
              Create Order
            </Button>
            <Button
              size="sm"
              data-ocid="imaging.cancel_button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Modality filter */}
      <div className="flex gap-1 flex-wrap">
        {modalityOptions.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setModalityFilter(m)}
            className={[
              "px-3 py-1 text-xs rounded border transition-colors",
              modalityFilter === m
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            ].join(" ")}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="border border-border bg-card">
        <Table data-ocid="imaging.table">
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Patient
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Modality
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Body Part
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Date
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {encounterOrders.length > 0 && (
              <div
                className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs px-4 py-2 rounded mb-2"
                data-ocid="imaging.info_state"
              >
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Showing {encounterOrders.length} order
                  {encounterOrders.length > 1 ? "s" : ""} submitted from recent
                  encounters.
                </span>
              </div>
            )}
            {loading ? (
              ["sk-0", "sk-1", "sk-2", "sk-3"].map((k) => (
                <TableRow key={k} data-ocid="imaging.loading_state">
                  {["c0", "c1", "c2", "c3", "c4", "c5"].map((c) => (
                    <TableCell key={c} className="px-4 py-2.5">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : [...encounterOrders, ...filteredImagingOrders].length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-sm text-muted-foreground"
                  data-ocid="imaging.empty_state"
                >
                  No imaging orders found.
                </TableCell>
              </TableRow>
            ) : (
              [...encounterOrders, ...filteredImagingOrders].map((order, i) => (
                <>
                  <TableRow
                    key={order.id}
                    data-ocid={`imaging.row.${i + 1}`}
                    className={`hover:bg-muted/30 even:bg-muted/20 border-l-2 border-l-transparent hover:border-l-accent transition-all ${
                      order.status === "completed" ||
                      order.status === "reported"
                        ? "cursor-pointer"
                        : ""
                    } ${viewerOrderId === order.id ? "bg-muted/40 border-l-accent" : ""}`}
                    onClick={() => handleRowClick(order)}
                  >
                    <TableCell className="font-medium text-sm px-4 py-2.5">
                      <button
                        type="button"
                        className="cursor-pointer text-primary hover:underline font-medium"
                        data-ocid="imaging.patient.link"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate?.("patients");
                        }}
                      >
                        {order.patientName}
                      </button>
                    </TableCell>
                    <TableCell className="font-mono text-sm px-4 py-2.5">
                      {order.modality}
                    </TableCell>
                    <TableCell className="text-sm px-4 py-2.5">
                      {order.bodyPart}
                    </TableCell>
                    <TableCell className="text-sm px-4 py-2.5 text-muted-foreground">
                      {order.date}
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          variant={statusVariant[order.status]}
                          label={order.status}
                        />
                        {(order.status === "completed" ||
                          order.status === "reported") && (
                          <span className="text-xs text-muted-foreground">
                            {viewerOrderId === order.id ? "▲ close" : "▼ view"}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      className="px-4 py-2.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(order.status === "ordered" ||
                          order.status === "scheduled") && (
                          <button
                            type="button"
                            data-ocid={`imaging.requisition.button.${i + 1}`}
                            onClick={() =>
                              setExpandedRequisition((prev) =>
                                prev === order.id ? null : order.id,
                              )
                            }
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded-sm px-2 py-1 hover:bg-muted/40 transition-colors"
                          >
                            <Printer className="w-3 h-3" />
                            Requisition
                          </button>
                        )}
                        {["ordered", "scheduled", "completed"].includes(
                          order.status,
                        ) && (
                          <button
                            type="button"
                            data-ocid={`imaging.edit_button.${i + 1}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvanceStatus(order.id, order.status);
                            }}
                            className="text-xs font-semibold bg-primary text-primary-foreground rounded-sm px-2 py-1 hover:bg-primary/90"
                          >
                            Advance
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Inline Requisition Preview */}
                  {expandedRequisition === order.id && (
                    <TableRow
                      key={`req-${order.id}`}
                      data-ocid={`imaging.requisition.panel.${i + 1}`}
                    >
                      <TableCell colSpan={6} className="p-0">
                        <style>
                          {
                            "@media print { .no-print { display: none !important; } .print-only { display: block !important; } }"
                          }
                        </style>
                        <div className="print-only bg-white border border-border mx-4 my-3 p-6 rounded-sm text-sm">
                          <div className="border-b border-gray-300 pb-4 mb-4">
                            <h2 className="text-lg font-bold text-gray-900">
                              MedUnite Medical Center
                            </h2>
                            <p className="text-xs text-gray-600">
                              1200 Healthcare Blvd, Suite 400 · Springfield, ST
                              00100
                            </p>
                            <p className="text-xs text-gray-600">
                              Tel: (555) 800-4000 · Fax: (555) 800-4001
                            </p>
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                            Imaging Requisition
                          </h3>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                Patient
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                {order.patientName}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                Ordering Provider
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                {order.reportedBy ?? "Attending Physician"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                Date Ordered
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                {order.date}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                Priority
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                Routine
                              </p>
                            </div>
                          </div>
                          <div className="border border-gray-200 rounded-sm p-3 mb-4">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                              Study Ordered
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {order.modality} — {order.bodyPart}
                            </p>
                            {order.findings && (
                              <p className="text-xs text-gray-600 mt-1">
                                Clinical Indication: {order.findings}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <p className="text-xs text-gray-500 italic">
                              Generated electronically via MedUnite.
                            </p>
                            <button
                              type="button"
                              data-ocid={`imaging.requisition.print_button.${i + 1}`}
                              onClick={() => window.print()}
                              className="no-print flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-sm hover:bg-primary/90"
                            >
                              <Printer className="w-3 h-3" /> Print
                            </button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Inline DICOM Viewer */}
                  {viewerOrderId === order.id && viewerOrder && (
                    <TableRow key={`viewer-${order.id}`}>
                      <TableCell
                        colSpan={5}
                        className="p-0 border-t border-border"
                      >
                        <div
                          className="border-b border-border bg-neutral-950"
                          data-ocid="imaging.viewer.panel"
                        >
                          {/* Viewer Header */}
                          <div
                            className="flex items-center justify-between px-4 py-2.5"
                            style={{
                              borderBottom: "1px solid rgb(55 65 81)",
                              background: "rgb(17 24 39)",
                            }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm"
                                  style={{
                                    background: "var(--primary)",
                                    color: "white",
                                  }}
                                >
                                  {viewerOrder.modality}
                                </span>
                                <span className="text-sm font-semibold text-neutral-100">
                                  {viewerOrder.patientName}
                                </span>
                              </div>
                              <span className="text-xs text-neutral-400">
                                {viewerOrder.bodyPart}
                              </span>
                              <span className="text-xs text-neutral-400">
                                {viewerOrder.date}
                              </span>
                            </div>
                            <button
                              type="button"
                              data-ocid="imaging.viewer.close_button"
                              onClick={() => setViewerOrderId(null)}
                              className="p-1 rounded transition-colors text-neutral-400"
                              aria-label="Close viewer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Toolbar */}
                          <div
                            className="flex items-center gap-1 px-4 py-2"
                            style={{
                              borderBottom: "1px solid rgb(55 65 81)",
                              background: "rgb(17 24 39)",
                            }}
                          >
                            <button
                              type="button"
                              data-ocid="imaging.viewer.zoom_in.button"
                              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors"
                              style={{
                                color: "rgb(209 213 219)",
                                border: "1px solid rgb(55 65 81)",
                              }}
                              onClick={() => toast("Zoom In")}
                            >
                              <ZoomIn className="w-3 h-3" /> Zoom In
                            </button>
                            <button
                              type="button"
                              data-ocid="imaging.viewer.zoom_out.button"
                              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors"
                              style={{
                                color: "rgb(209 213 219)",
                                border: "1px solid rgb(55 65 81)",
                              }}
                              onClick={() => toast("Zoom Out")}
                            >
                              <ZoomOut className="w-3 h-3" /> Zoom Out
                            </button>
                            <button
                              type="button"
                              data-ocid="imaging.viewer.pan.toggle"
                              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors"
                              style={{
                                color: panActive ? "white" : "rgb(209 213 219)",
                                background: panActive
                                  ? "var(--primary)"
                                  : "transparent",
                                border: `1px solid ${panActive ? "var(--primary)" : "rgb(55 65 81)"}`,
                              }}
                              onClick={() => setPanActive((v) => !v)}
                            >
                              <Move className="w-3 h-3" /> Pan
                            </button>
                            <button
                              type="button"
                              data-ocid="imaging.viewer.windowlevel.toggle"
                              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors"
                              style={{
                                color: windowLevelActive
                                  ? "white"
                                  : "rgb(209 213 219)",
                                background: windowLevelActive
                                  ? "var(--primary)"
                                  : "transparent",
                                border: `1px solid ${windowLevelActive ? "var(--primary)" : "rgb(55 65 81)"}`,
                              }}
                              onClick={() => setWindowLevelActive((v) => !v)}
                            >
                              <SlidersHorizontal className="w-3 h-3" /> W/L
                            </button>

                            <div
                              className="w-px h-4 mx-1"
                              style={{ background: "rgb(55 65 81)" }}
                            />

                            <div className="flex items-center gap-2">
                              <Sun className="w-3 h-3 text-neutral-400" />
                              <span className="text-xs text-neutral-400">
                                Brightness
                              </span>
                              <div className="w-24">
                                <Slider
                                  value={brightness}
                                  onValueChange={setBrightness}
                                  min={0}
                                  max={100}
                                  step={1}
                                  data-ocid="imaging.viewer.brightness.input"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2 ml-2">
                              <Contrast className="w-3 h-3 text-neutral-400" />
                              <span className="text-xs text-neutral-400">
                                Contrast
                              </span>
                              <div className="w-24">
                                <Slider
                                  value={contrastVal}
                                  onValueChange={setContrastVal}
                                  min={0}
                                  max={100}
                                  step={1}
                                  data-ocid="imaging.viewer.contrast.input"
                                />
                              </div>
                            </div>

                            <div className="ml-auto">
                              <button
                                type="button"
                                data-ocid="imaging.viewer.fullscreen.button"
                                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors"
                                style={{
                                  color: "rgb(209 213 219)",
                                  border: "1px solid rgb(55 65 81)",
                                }}
                                onClick={() => toast("Fullscreen view")}
                              >
                                <Maximize2 className="w-3 h-3" /> Fullscreen
                              </button>
                            </div>
                          </div>

                          {/* Image Area */}
                          <div
                            className="relative flex items-center justify-center"
                            style={{
                              height: "420px",
                              background: "rgb(3 7 18)",
                              cursor: panActive ? "grab" : "crosshair",
                              filter: `brightness(${0.5 + brightness[0] / 100}) contrast(${0.5 + contrastVal[0] / 100})`,
                            }}
                          >
                            <DicomPlaceholder
                              modality={viewerOrder.modality}
                              bodyPart={viewerOrder.bodyPart}
                            />
                            <div
                              className="absolute bottom-3 right-3 text-xs font-mono"
                              style={{
                                color: "var(--primary)",
                                opacity: 0.7,
                              }}
                            >
                              DICOM Image — {viewerOrder.modality}{" "}
                              {viewerOrder.bodyPart}
                            </div>
                            <div className="absolute bottom-3 left-3 text-xs font-mono text-neutral-500">
                              WL: {windowLevelActive ? "ACTIVE" : "---"} | PAN:{" "}
                              {panActive ? "ON" : "OFF"}
                            </div>
                          </div>

                          {/* Radiology Report (if reported) */}
                          {viewerOrder.status === "reported" &&
                            mockReports[viewerOrder.id] && (
                              <div
                                style={{
                                  background: "rgb(17 24 39)",
                                  borderTop: "1px solid rgb(55 65 81)",
                                }}
                                data-ocid="imaging.viewer.report.panel"
                              >
                                <button
                                  type="button"
                                  data-ocid="imaging.viewer.report.toggle"
                                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold"
                                  style={{ color: "rgb(125 211 252)" }}
                                  onClick={() =>
                                    toggleRawReport(viewerOrder.id)
                                  }
                                >
                                  <span>Radiology Report</span>
                                  {reportExpanded[viewerOrder.id] ? (
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                {reportExpanded[viewerOrder.id] && (
                                  <div className="px-4 pb-4">
                                    <div
                                      className="rounded-sm p-3 text-xs leading-relaxed"
                                      style={{
                                        background: "rgb(3 7 18)",
                                        border: "1px solid rgb(55 65 81)",
                                        color: "rgb(209 213 219)",
                                      }}
                                    >
                                      <p
                                        className="font-semibold mb-1"
                                        style={{
                                          color: "rgb(229 231 235)",
                                        }}
                                      >
                                        Findings &amp; Impression
                                      </p>
                                      <p>{mockReports[viewerOrder.id]}</p>
                                      <p
                                        className="mt-2 text-xs"
                                        style={{
                                          color: "rgb(107 114 128)",
                                        }}
                                      >
                                        Reported by: Dr. M. Patel, MD, Radiology
                                        &bull; {viewerOrder.date}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
