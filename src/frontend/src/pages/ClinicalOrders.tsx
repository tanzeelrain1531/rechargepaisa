import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FlaskConical, Pill, Scan } from "lucide-react";
import { useState } from "react";
import { PatientFilterBar } from "../components/PatientFilterBar";

interface Order {
  id: number;
  type: "Lab" | "Imaging" | "Prescription";
  patient: string;
  order: string;
  status: string;
  date: string;
}

const SEED_ORDERS: Order[] = [
  {
    id: 1,
    type: "Lab",
    patient: "Margaret Thompson",
    order: "CBC with Differential",
    status: "pending",
    date: "2026-03-15",
  },
  {
    id: 2,
    type: "Lab",
    patient: "Robert Chen",
    order: "HbA1c",
    status: "in-progress",
    date: "2026-03-15",
  },
  {
    id: 3,
    type: "Lab",
    patient: "Sarah Williams",
    order: "Comprehensive Metabolic Panel",
    status: "pending",
    date: "2026-03-14",
  },
  {
    id: 4,
    type: "Lab",
    patient: "James Mitchell",
    order: "Lipid Panel",
    status: "pending",
    date: "2026-03-14",
  },
  {
    id: 5,
    type: "Lab",
    patient: "Linda Nguyen",
    order: "Urinalysis",
    status: "in-progress",
    date: "2026-03-13",
  },
  {
    id: 6,
    type: "Imaging",
    patient: "Margaret Thompson",
    order: "Chest X-Ray PA/Lateral",
    status: "pending",
    date: "2026-03-15",
  },
  {
    id: 7,
    type: "Imaging",
    patient: "Robert Chen",
    order: "Abdominal Ultrasound",
    status: "in-progress",
    date: "2026-03-14",
  },
  {
    id: 8,
    type: "Imaging",
    patient: "David Park",
    order: "CT Head w/o Contrast",
    status: "pending",
    date: "2026-03-13",
  },
  {
    id: 9,
    type: "Prescription",
    patient: "Sarah Williams",
    order: "Metformin 500mg BID",
    status: "pending",
    date: "2026-03-15",
  },
  {
    id: 10,
    type: "Prescription",
    patient: "James Mitchell",
    order: "Lisinopril 10mg QD",
    status: "pending",
    date: "2026-03-15",
  },
  {
    id: 11,
    type: "Prescription",
    patient: "Linda Nguyen",
    order: "Atorvastatin 40mg QHS",
    status: "in-progress",
    date: "2026-03-14",
  },
  {
    id: 12,
    type: "Prescription",
    patient: "David Park",
    order: "Omeprazole 20mg QD",
    status: "pending",
    date: "2026-03-13",
  },
];

const TYPE_ICON: Record<string, React.ElementType> = {
  Lab: FlaskConical,
  Imaging: Scan,
  Prescription: Pill,
};

const TYPE_COLOR: Record<string, string> = {
  Lab: "text-primary",
  Imaging: "text-primary",
  Prescription: "text-success",
};

export default function ClinicalOrders({
  activePatientId,
  activePatientName,
  onClearFilter,
}: {
  activePatientId?: bigint;
  activePatientName?: string;
  onClearFilter?: () => void;
}) {
  const [filter, setFilter] = useState<
    "All" | "Lab" | "Imaging" | "Prescription"
  >("All");

  const filtered = SEED_ORDERS.filter(
    (o) => filter === "All" || o.type === filter,
  );
  const pendingLabs = SEED_ORDERS.filter((o) => o.type === "Lab").length;
  const pendingImaging = SEED_ORDERS.filter((o) => o.type === "Imaging").length;
  const pendingRx = SEED_ORDERS.filter((o) => o.type === "Prescription").length;

  return (
    <div className="p-5 space-y-5" data-ocid="orders.page">
      {activePatientId && activePatientName && (
        <PatientFilterBar
          patientName={activePatientName}
          onClear={onClearFilter ?? (() => {})}
        />
      )}
      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card data-ocid="orders.labs.card">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FlaskConical className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {pendingLabs}
                </p>
                <p className="text-xs text-muted-foreground">Pending Labs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-ocid="orders.imaging.card">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-primary/8 flex items-center justify-center flex-shrink-0">
                <Scan className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {pendingImaging}
                </p>
                <p className="text-xs text-muted-foreground">Pending Imaging</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-ocid="orders.rx.card">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-success/10 flex items-center justify-center flex-shrink-0">
                <Pill className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {pendingRx}
                </p>
                <p className="text-xs text-muted-foreground">Pending Rx</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card data-ocid="orders.table">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Active Orders
            </CardTitle>
            <div className="flex gap-1">
              {(["All", "Lab", "Imaging", "Prescription"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  data-ocid={`orders.${f.toLowerCase()}.tab`}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Type</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow data-ocid="orders.empty_state">
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8 text-sm"
                  >
                    No pending orders
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((order, idx) => {
                  const Icon = TYPE_ICON[order.type];
                  return (
                    <TableRow
                      key={order.id}
                      data-ocid={`orders.item.${idx + 1}`}
                    >
                      <TableCell>
                        <div
                          className={`flex items-center gap-1.5 text-xs font-medium ${TYPE_COLOR[order.type]}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {order.type}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {order.patient}
                      </TableCell>
                      <TableCell className="text-sm">{order.order}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm border ${order.status === "in-progress" ? "bg-primary/10 text-primary border-primary/30" : "bg-warning/10 text-warning border-warning/30"}`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {order.date}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
