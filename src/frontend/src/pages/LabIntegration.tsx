let _labIdCounter = Date.now();
const nextLabId = () => (++_labIdCounter).toString(36);
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Plus, RefreshCw, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/StatusBadge";
import { DEMO_LAB_CONNECTIONS, DEMO_PATIENTS } from "../demoData";
import { useDemoMode } from "../hooks/useDemoMode";

type InterfaceType = "HL7 v2.5" | "FHIR R4";
type ConnectionStatus = "active" | "inactive";
type TransmitStatus = "Sent" | "Acknowledged" | "Failed";
type MessageType = "HL7 ACK" | "FHIR Bundle";

interface LabConnection {
  id: number;
  name: string;
  interfaceType: InterfaceType;
  endpoint: string;
  status: ConnectionStatus;
}

interface Transmission {
  id: number;
  timestamp: string;
  patient: string;
  test: string;
  lab: string;
  status: TransmitStatus;
}

interface IncomingResult {
  id: number;
  timestamp: string;
  lab: string;
  patient: string;
  test: string;
  result: string;
  messageType: MessageType;
  rawMessage: string;
  expanded: boolean;
}

const initialConnections: LabConnection[] = [
  {
    id: 1,
    name: "Quest Diagnostics",
    interfaceType: "HL7 v2.5",
    endpoint: "https://api.questdiagnostics.com/hl7",
    status: "active",
  },
  {
    id: 2,
    name: "LabCorp",
    interfaceType: "FHIR R4",
    endpoint: "https://api.labcorp.com/fhir",
    status: "active",
  },
  {
    id: 3,
    name: "Bio Reference",
    interfaceType: "HL7 v2.5",
    endpoint: "https://api.bioreference.com/hl7",
    status: "inactive",
  },
];

const pendingOrders = [
  { id: "ord-1", label: `CBC Panel — ${DEMO_PATIENTS[0]?.name ?? "Patient"}` },
  { id: "ord-2", label: `HbA1c — ${DEMO_PATIENTS[1]?.name ?? "Patient"}` },
  {
    id: "ord-3",
    label: `Lipid Panel — ${DEMO_PATIENTS[2]?.name ?? "Patient"}`,
  },
];

const mockHl7Message = (patient: string, test: string) =>
  `MSH|^~\\&|MEDUNITE|ST_MICHAEL|QUEST|LABINFO|${new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(
      0,
      14,
    )}||ORM^O01|${(Date.now() % 100000000).toString(16).toUpperCase().padStart(8, "0")}|P|2.5\nPID|1||MRN-${100000 + (Date.now() % 90000)}^^^MedUnite^MR||${patient.split(" ").reverse().join("^")}||19780315|F\nORC|NW|ORD-2026-${1000 + (Date.now() % 9000)}||||||20260313120000\nOBR|1|||${test}^${test}^L|||20260313120000`;

const mockFhirBundle = (patient: string, test: string) =>
  JSON.stringify(
    {
      resourceType: "Bundle",
      id: `bundle-${nextLabId()}`,
      type: "message",
      entry: [
        {
          resource: {
            resourceType: "ServiceRequest",
            status: "active",
            intent: "order",
            code: { text: test },
            subject: { display: patient },
            authoredOn: new Date().toISOString(),
          },
        },
      ],
    },
    null,
    2,
  );

const mockIncomingResults: IncomingResult[] = [
  {
    id: 1,
    timestamp: "2026-03-13 08:14",
    lab: "Quest Diagnostics",
    patient: DEMO_PATIENTS[0]?.name ?? "Alice Johnson",
    test: "CBC Panel",
    result: "WBC 5.2, RBC 4.8, Hgb 13.4 — Normal",
    messageType: "HL7 ACK",
    rawMessage: mockHl7Message(
      DEMO_PATIENTS[0]?.name ?? "Alice Johnson",
      "CBC Panel",
    ),
    expanded: false,
  },
  {
    id: 2,
    timestamp: "2026-03-13 07:50",
    lab: "LabCorp",
    patient: DEMO_PATIENTS[1]?.name ?? "Bob Martinez",
    test: "HbA1c",
    result: "7.8% — Elevated",
    messageType: "FHIR Bundle",
    rawMessage: mockFhirBundle(
      DEMO_PATIENTS[1]?.name ?? "Bob Martinez",
      "HbA1c",
    ),
    expanded: false,
  },
];

const connectionStatusVariant: Record<ConnectionStatus, "success" | "neutral"> =
  {
    active: "success",
    inactive: "neutral",
  };

const transmitStatusVariant: Record<
  TransmitStatus,
  "success" | "info" | "danger"
> = {
  Sent: "info",
  Acknowledged: "success",
  Failed: "danger",
};

export default function LabIntegration() {
  const { isDemoMode } = useDemoMode();

  const SECTION_LABELS: Record<string, string> = {
    chemistry: "Chemistry",
    hematology: "Hematology",
    microbiology: "Microbiology",
    pathology: "Pathology",
  };

  const sectionPref = useMemo(() => {
    try {
      const p = JSON.parse(
        localStorage.getItem("medunite_prefs_LabTech") || "{}",
      );
      return p.labSection || "";
    } catch {
      return "";
    }
  }, []);
  const loading = false;
  const [connections, setConnections] = useState<LabConnection[]>(() =>
    isDemoMode
      ? DEMO_LAB_CONNECTIONS.map((c) => ({
          id: c.id,
          name: c.name,
          interfaceType: c.protocol as LabConnection["interfaceType"],
          endpoint: c.endpoint,
          status: (c.status === "connected"
            ? "active"
            : "inactive") as LabConnection["status"],
        }))
      : initialConnections,
  );

  const [showAddConnection, setShowAddConnection] = useState(false);
  const [newConn, setNewConn] = useState({
    name: "",
    interfaceType: "HL7 v2.5" as InterfaceType,
    endpoint: "",
    status: "active" as ConnectionStatus,
  });

  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedLab, setSelectedLab] = useState("");
  const [transmissions, setTransmissions] = useState<Transmission[]>([
    {
      id: 1,
      timestamp: "2026-03-13 09:02",
      patient: DEMO_PATIENTS[0]?.name ?? "Alice Johnson",
      test: "CBC Panel",
      lab: "Quest Diagnostics",
      status: "Acknowledged",
    },
    {
      id: 2,
      timestamp: "2026-03-13 08:47",
      patient: DEMO_PATIENTS[1]?.name ?? "Bob Martinez",
      test: "HbA1c",
      lab: "LabCorp",
      status: "Acknowledged",
    },
    {
      id: 3,
      timestamp: "2026-03-12 16:30",
      patient: DEMO_PATIENTS[2]?.name ?? "Carol White",
      test: "Lipid Panel",
      lab: "Bio Reference",
      status: "Failed",
    },
  ]);

  const [incomingResults, setIncomingResults] =
    useState<IncomingResult[]>(mockIncomingResults);

  const handleToggleConnection = (id: number) => {
    setConnections((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c,
      ),
    );
    toast.success("Connection status updated");
  };

  const handleAddConnection = () => {
    if (!newConn.name || !newConn.endpoint) {
      toast.error("Lab name and endpoint are required");
      return;
    }
    setConnections((prev) => [...prev, { id: prev.length + 1, ...newConn }]);
    toast.success(`Lab connection "${newConn.name}" added`);
    setShowAddConnection(false);
    setNewConn({
      name: "",
      interfaceType: "HL7 v2.5",
      endpoint: "",
      status: "active",
    });
  };

  const handleTransmit = () => {
    if (!selectedOrder || !selectedLab) {
      toast.error("Select an order and target lab");
      return;
    }
    const order = pendingOrders.find((o) => o.id === selectedOrder);
    const [testPart, patientPart] = (order?.label ?? "").split(" — ");
    setTransmissions((prev) => [
      {
        id: prev.length + 1,
        timestamp: new Date()
          .toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
          .replace(",", ""),
        patient: patientPart ?? "Unknown",
        test: testPart ?? selectedOrder,
        lab: selectedLab,
        status: "Sent",
      },
      ...prev,
    ]);
    toast.success(`Order transmitted to ${selectedLab}`);
    setSelectedOrder("");
    setSelectedLab("");
  };

  const simulateIncoming = () => {
    const labs = ["Quest Diagnostics", "LabCorp"];
    const patients = [
      DEMO_PATIENTS[3]?.name ?? "James Thornton",
      DEMO_PATIENTS[4]?.name ?? "Aisha Patel",
      DEMO_PATIENTS[5]?.name ?? "William Park",
    ];
    const tests = [
      "Metabolic Panel",
      "Thyroid Panel",
      "Urinalysis",
      "Vitamin D",
    ];
    const results = [
      "Within normal limits",
      "Mildly elevated — see full report",
      "Low — clinical review advised",
    ];
    const types: MessageType[] = ["HL7 ACK", "FHIR Bundle"];
    const seed = Date.now();
    const lab = labs[seed % labs.length];
    const patient = patients[(seed >> 2) % patients.length];
    const test = tests[(seed >> 4) % tests.length];
    const result = results[(seed >> 6) % results.length];
    const messageType = types[(seed >> 8) % types.length];
    const rawMessage =
      messageType === "HL7 ACK"
        ? mockHl7Message(patient, test)
        : mockFhirBundle(patient, test);
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setIncomingResults((prev) => [
      {
        id: prev.length + 1,
        timestamp,
        lab,
        patient,
        test,
        result,
        messageType,
        rawMessage,
        expanded: true,
      },
      ...prev,
    ]);
    toast.success("Incoming result received");
  };

  const toggleExpanded = (id: number) => {
    setIncomingResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, expanded: !r.expanded } : r)),
    );
  };

  if (loading) {
    return (
      <div className="space-y-4" data-ocid="labintegration.loading_state">
        <Skeleton className="h-10 w-64" />
        {[1, 2, 3].map((k) => (
          <Skeleton key={k} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="labintegration.page">
      {sectionPref && (
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted-foreground">Showing:</span>
          <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-sm">
            {SECTION_LABELS[sectionPref] ?? sectionPref}
          </span>
        </div>
      )}
      {/* Section 1: Lab Connections */}
      <section data-ocid="labintegration.connections.section">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Lab Connections
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage external laboratory system integrations
            </p>
          </div>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="labintegration.connections.primary_button"
            onClick={() => setShowAddConnection((v) => !v)}
          >
            {showAddConnection ? (
              <ChevronUp className="w-3.5 h-3.5 mr-1.5" />
            ) : (
              <Plus className="w-3.5 h-3.5 mr-1.5" />
            )}
            Add Connection
          </Button>
        </div>

        {showAddConnection && (
          <div
            className="border border-border bg-card p-5 mb-3"
            data-ocid="labintegration.connections.panel"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              New Lab Connection
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Lab Name
                </Label>
                <Input
                  data-ocid="labintegration.connections.name.input"
                  value={newConn.name}
                  onChange={(e) =>
                    setNewConn((p) => ({ ...p, name: e.target.value }))
                  }
                  className="mt-1 h-8 text-sm"
                  placeholder="e.g. Sonic Healthcare"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Interface Type
                </Label>
                <Select
                  value={newConn.interfaceType}
                  onValueChange={(v) =>
                    setNewConn((p) => ({
                      ...p,
                      interfaceType: v as InterfaceType,
                    }))
                  }
                >
                  <SelectTrigger
                    data-ocid="labintegration.connections.interface.select"
                    className="mt-1 h-8 text-sm"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HL7 v2.5">HL7 v2.5</SelectItem>
                    <SelectItem value="FHIR R4">FHIR R4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Endpoint URL
                </Label>
                <Input
                  data-ocid="labintegration.connections.endpoint.input"
                  value={newConn.endpoint}
                  onChange={(e) =>
                    setNewConn((p) => ({ ...p, endpoint: e.target.value }))
                  }
                  className="mt-1 h-8 text-sm"
                  placeholder="https://api.lab.com/hl7"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </Label>
                <Select
                  value={newConn.status}
                  onValueChange={(v) =>
                    setNewConn((p) => ({ ...p, status: v as ConnectionStatus }))
                  }
                >
                  <SelectTrigger
                    data-ocid="labintegration.connections.status.select"
                    className="mt-1 h-8 text-sm"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button
                size="sm"
                data-ocid="labintegration.connections.submit_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleAddConnection}
              >
                Save Connection
              </Button>
              <Button
                size="sm"
                data-ocid="labintegration.connections.cancel_button"
                variant="outline"
                onClick={() => setShowAddConnection(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="border border-border bg-card">
          <Table data-ocid="labintegration.connections.table">
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-muted/60">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Lab Name
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Interface
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Endpoint
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connections.map((conn, i) => (
                <TableRow
                  key={conn.id}
                  data-ocid={`labintegration.connections.row.${i + 1}`}
                  className="hover:bg-muted/30 even:bg-muted/20"
                >
                  <TableCell className="font-medium text-sm px-4 py-2.5">
                    {conn.name}
                  </TableCell>
                  <TableCell className="text-sm px-4 py-2.5">
                    <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                      {conn.interfaceType}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs px-4 py-2.5 text-muted-foreground font-mono">
                    {conn.endpoint}
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    <StatusBadge
                      variant={connectionStatusVariant[conn.status]}
                      label={conn.status}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs px-2"
                      data-ocid={`labintegration.connections.toggle.${i + 1}`}
                      onClick={() => handleToggleConnection(conn.id)}
                    >
                      {conn.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Section 2: Order Transmission */}
      <section data-ocid="labintegration.transmission.section">
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Transmit Lab Orders
        </h2>

        <div className="border border-border bg-card p-5 mb-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pending Order
              </Label>
              <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                <SelectTrigger
                  data-ocid="labintegration.transmission.order.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent>
                  {pendingOrders.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Target Lab
              </Label>
              <Select value={selectedLab} onValueChange={setSelectedLab}>
                <SelectTrigger
                  data-ocid="labintegration.transmission.lab.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue placeholder="Select lab" />
                </SelectTrigger>
                <SelectContent>
                  {connections
                    .filter((c) => c.status === "active")
                    .map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                data-ocid="labintegration.transmission.submit_button"
                onClick={handleTransmit}
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Transmit Order
              </Button>
            </div>
          </div>
        </div>

        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Transmission Log
        </h3>
        <div className="border border-border bg-card">
          <Table data-ocid="labintegration.transmission.table">
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-muted/60">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Timestamp
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Patient
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Test
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Lab
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transmissions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-sm text-muted-foreground"
                    data-ocid="labintegration.transmission.empty_state"
                  >
                    No transmissions yet.
                  </TableCell>
                </TableRow>
              ) : (
                transmissions.map((tx, i) => (
                  <TableRow
                    key={tx.id}
                    data-ocid={`labintegration.transmission.row.${i + 1}`}
                    className="hover:bg-muted/30 even:bg-muted/20"
                  >
                    <TableCell className="text-xs font-mono px-4 py-2.5 text-muted-foreground">
                      {tx.timestamp}
                    </TableCell>
                    <TableCell className="font-medium text-sm px-4 py-2.5">
                      {tx.patient}
                    </TableCell>
                    <TableCell className="text-sm px-4 py-2.5">
                      {tx.test}
                    </TableCell>
                    <TableCell className="text-sm px-4 py-2.5">
                      {tx.lab}
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <StatusBadge
                        variant={transmitStatusVariant[tx.status]}
                        label={tx.status}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Section 3: Result Receipt */}
      <section data-ocid="labintegration.results.section">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Incoming Results Feed
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              HL7 and FHIR messages received from connected labs
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            data-ocid="labintegration.results.primary_button"
            onClick={simulateIncoming}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Simulate Incoming Result
          </Button>
        </div>

        <div className="border border-border bg-card">
          <Table data-ocid="labintegration.results.table">
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-muted/60">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Timestamp
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Lab
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Patient
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Test
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Result
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Msg Type
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Raw
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomingResults.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-sm text-muted-foreground"
                    data-ocid="labintegration.results.empty_state"
                  >
                    No incoming results yet.
                  </TableCell>
                </TableRow>
              ) : (
                incomingResults.map((res, i) => (
                  <>
                    <TableRow
                      key={res.id}
                      data-ocid={`labintegration.results.row.${i + 1}`}
                      className="hover:bg-muted/30 even:bg-muted/20"
                    >
                      <TableCell className="text-xs font-mono px-4 py-2.5 text-muted-foreground">
                        {res.timestamp}
                      </TableCell>
                      <TableCell className="text-sm px-4 py-2.5">
                        {res.lab}
                      </TableCell>
                      <TableCell className="font-medium text-sm px-4 py-2.5">
                        {res.patient}
                      </TableCell>
                      <TableCell className="text-sm px-4 py-2.5">
                        {res.test}
                      </TableCell>
                      <TableCell
                        className="text-sm px-4 py-2.5 max-w-[200px] truncate"
                        title={res.result}
                      >
                        {res.result}
                      </TableCell>
                      <TableCell className="px-4 py-2.5">
                        <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                          {res.messageType}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-2.5">
                        <button
                          type="button"
                          data-ocid={`labintegration.results.toggle.${i + 1}`}
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                          onClick={() => toggleExpanded(res.id)}
                        >
                          {res.expanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                          {res.expanded ? "Hide" : "View"}
                        </button>
                      </TableCell>
                    </TableRow>
                    {res.expanded && (
                      <TableRow key={`raw-${res.id}`}>
                        <TableCell colSpan={7} className="px-4 pb-3 pt-0">
                          <div className="rounded border border-border bg-muted/40 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                              Raw Message — {res.messageType}
                            </p>
                            <pre className="text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                              {res.rawMessage}
                            </pre>
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
      </section>
    </div>
  );
}
