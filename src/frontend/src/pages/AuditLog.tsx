import { Button } from "@/components/ui/button";
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
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Download } from "lucide-react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import { useDemoMode } from "../hooks/useDemoMode";

const actionBadge: Record<string, string> = {
  CREATE: "bg-success/10 text-success border border-success/30",
  UPDATE: "bg-primary/10 text-primary border border-primary/30",
  DELETE: "bg-destructive/10 text-destructive border border-destructive/30",
  READ: "bg-muted text-muted-foreground border border-border",
};

const ACTION_OPTIONS = ["ALL", "CREATE", "UPDATE", "DELETE", "READ"];
const ENTITY_OPTIONS = [
  "ALL",
  "Patient",
  "Encounter",
  "Appointment",
  "Prescription",
  "Invoice",
  "Claim",
  "Lab",
  "Imaging",
  "User",
];

export default function AuditLog() {
  const { isDemoMode, demoActor } = useDemoMode();
  const { actor: realActor, isFetching } = useActor();
  const actor = isDemoMode ? demoActor : realActor;

  const [actionFilter, setActionFilter] = useState("ALL");
  const [entityFilter, setEntityFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["auditLogs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAuditLogs();
    },
    enabled: !!actor && (isDemoMode || !isFetching),
  });

  const loading = isLoading || (!isDemoMode && isFetching);

  // Apply filters
  const filteredLogs = logs.filter((log) => {
    const action = String(log.action).toUpperCase();
    if (actionFilter !== "ALL" && action !== actionFilter) return false;
    if (
      entityFilter !== "ALL" &&
      !String(log.entityType).toLowerCase().includes(entityFilter.toLowerCase())
    )
      return false;
    if (dateFrom) {
      const ts = new Date(Number(log.timestamp) / 1_000_000);
      if (ts < new Date(dateFrom)) return false;
    }
    if (dateTo) {
      const ts = new Date(Number(log.timestamp) / 1_000_000);
      const toDate = new Date(dateTo);
      toDate.setDate(toDate.getDate() + 1);
      if (ts > toDate) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = [
      "Actor",
      "Role",
      "Action",
      "Entity",
      "Entity ID",
      "Timestamp",
    ];
    const rows = filteredLogs.map((log) => [
      String(log.actorId),
      (log as { role?: string }).role ?? "—",
      String(log.action).toUpperCase(),
      log.entityType,
      String(log.entityId),
      new Date(Number(log.timestamp) / 1_000_000).toLocaleString(),
    ]);
    const csvContent = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4" data-ocid="audit.page">
      {/* Filter bar */}
      <div className="border border-border bg-card px-4 py-3 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Action
          </span>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger
              className="h-7 text-xs w-36"
              data-ocid="audit.filter.action.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTION_OPTIONS.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Entity Type
          </span>
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger
              className="h-7 text-xs w-36"
              data-ocid="audit.filter.entity.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ENTITY_OPTIONS.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Date From
          </span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            data-ocid="audit.filter.date_from.input"
            className="h-7 px-2 text-xs border border-input bg-background text-foreground rounded-none focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Date To
          </span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            data-ocid="audit.filter.date_to.input"
            className="h-7 px-2 text-xs border border-input bg-background text-foreground rounded-none focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="ml-auto flex items-end">
          <Button
            variant="outline"
            size="sm"
            data-ocid="audit.export.button"
            onClick={handleExportCSV}
            className="h-7 text-xs gap-1.5"
          >
            <Download className="w-3 h-3" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div
          className="border border-border bg-card"
          data-ocid="audit.loading_state"
        >
          <div className="px-4 py-2 border-b border-border bg-muted/40">
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="divide-y divide-border">
            {["a", "b", "c", "d", "e", "f", "g", "h"].map((sk) => (
              <div key={sk} className="flex items-center gap-4 px-4 py-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredLogs.length === 0 && (
        <div
          className="border border-border bg-card flex flex-col items-center justify-center py-16 gap-3"
          data-ocid="audit.empty_state"
        >
          <ClipboardList className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            No audit log entries
          </p>
          <p className="text-xs text-muted-foreground/70">
            {logs.length > 0
              ? "No entries match the current filters."
              : "Audit entries will appear here as users interact with the system."}
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && filteredLogs.length > 0 && (
        <div className="border border-border bg-card">
          <Table data-ocid="audit.table">
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-muted/60">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Actor
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Role
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Action
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Entity
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Entity ID
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                  Timestamp
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log, i) => {
                const action = String(log.action).toUpperCase();
                return (
                  <TableRow
                    key={String(log.id)}
                    data-ocid={`audit.row.${i + 1}`}
                    className="hover:bg-muted/30 even:bg-muted/20 border-l-2 border-l-transparent hover:border-l-accent transition-all"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground px-4 py-2.5">
                      {String(log.actorId)}
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <span className="text-xs text-muted-foreground">
                        {(log as { role?: string }).role ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center text-xs font-semibold uppercase tracking-wide px-1.5 py-0.5 ${
                          actionBadge[action] ?? actionBadge.READ
                        }`}
                      >
                        {action}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <span className="inline-flex items-center bg-muted text-muted-foreground text-xs font-medium uppercase tracking-wide px-1.5 py-0.5">
                        {log.entityType}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground px-4 py-2.5">
                      {String(log.entityId)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground px-4 py-2.5">
                      {new Date(
                        Number(log.timestamp) / 1_000_000,
                      ).toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
