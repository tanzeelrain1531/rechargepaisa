import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, Search, ShieldAlert, Users } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "../components/StatusBadge";
import { useActor } from "../hooks/useActor";
import { useDemoMode } from "../hooks/useDemoMode";

interface PdmpRx {
  drug: string;
  schedule: string;
  prescriber: string;
  pharmacy: string;
  dateFilled: string;
  daysSupply: number;
  mmePerDay: number;
}

interface PdmpPatient {
  name: string;
  dob: string;
  mrn: string;
  riskLevel: "low" | "high";
  prescribers90: number;
  prescribers180: number;
  totalMme: number;
  lastFill: string;
  history: PdmpRx[];
  overlaps: { drug1: string; drug2: string; overlapDays: number }[];
}

const DEMO_PATIENTS: PdmpPatient[] = [
  {
    name: "James Hartwell",
    dob: "1971-04-12",
    mrn: "MRN-004",
    riskLevel: "low",
    prescribers90: 1,
    prescribers180: 1,
    totalMme: 30,
    lastFill: "12 days ago",
    history: [
      {
        drug: "Tramadol 50mg",
        schedule: "Sch IV",
        prescriber: "Dr. Sarah Johnson",
        pharmacy: "CVS #4821",
        dateFilled: "2026-03-02",
        daysSupply: 30,
        mmePerDay: 30,
      },
    ],
    overlaps: [],
  },
  {
    name: "Linda Marchetti",
    dob: "1968-09-27",
    mrn: "MRN-001",
    riskLevel: "high",
    prescribers90: 3,
    prescribers180: 4,
    totalMme: 145,
    lastFill: "8 days ago",
    history: [
      {
        drug: "Oxycodone 10mg",
        schedule: "Sch II",
        prescriber: "Dr. Sarah Johnson",
        pharmacy: "CVS #4821",
        dateFilled: "2026-03-06",
        daysSupply: 30,
        mmePerDay: 60,
      },
      {
        drug: "Hydrocodone 5mg",
        schedule: "Sch III",
        prescriber: "Dr. Kevin Park (Pain Mgmt)",
        pharmacy: "Walgreens #2019",
        dateFilled: "2026-02-20",
        daysSupply: 30,
        mmePerDay: 25,
      },
      {
        drug: "Oxycodone 10mg",
        schedule: "Sch II",
        prescriber: "Dr. Kevin Park (Pain Mgmt)",
        pharmacy: "Rite Aid #771",
        dateFilled: "2026-02-01",
        daysSupply: 28,
        mmePerDay: 60,
      },
      {
        drug: "Alprazolam 1mg",
        schedule: "Sch IV",
        prescriber: "Dr. Anita Patel (Psychiatry)",
        pharmacy: "CVS #4821",
        dateFilled: "2026-03-01",
        daysSupply: 30,
        mmePerDay: 0,
      },
      {
        drug: "Diazepam 5mg",
        schedule: "Sch IV",
        prescriber: "Dr. Sarah Johnson",
        pharmacy: "CVS #4821",
        dateFilled: "2026-02-10",
        daysSupply: 14,
        mmePerDay: 0,
      },
      {
        drug: "Carisoprodol 350mg",
        schedule: "Sch IV",
        prescriber: "Dr. Luis Torres (Ortho)",
        pharmacy: "Walgreens #2019",
        dateFilled: "2026-01-28",
        daysSupply: 21,
        mmePerDay: 0,
      },
      {
        drug: "Morphine ER 30mg",
        schedule: "Sch II",
        prescriber: "Dr. Kevin Park (Pain Mgmt)",
        pharmacy: "Rite Aid #771",
        dateFilled: "2026-01-10",
        daysSupply: 30,
        mmePerDay: 45,
      },
      {
        drug: "Hydromorphone 4mg",
        schedule: "Sch II",
        prescriber: "Dr. Sarah Johnson",
        pharmacy: "CVS #4821",
        dateFilled: "2026-01-05",
        daysSupply: 10,
        mmePerDay: 32,
      },
    ],
    overlaps: [
      {
        drug1: "Oxycodone 10mg (CVS)",
        drug2: "Oxycodone 10mg (Rite Aid)",
        overlapDays: 9,
      },
      { drug1: "Alprazolam 1mg", drug2: "Diazepam 5mg", overlapDays: 21 },
    ],
  },
];

interface PDMPProps {
  onNavigate?: (page: string) => void;
}

export default function PDMP({ onNavigate }: PDMPProps) {
  const { actor: realActor } = useActor();
  const { isDemoMode, demoActor } = useDemoMode();
  const actor = isDemoMode ? demoActor : realActor;
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<PdmpPatient | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    const found = DEMO_PATIENTS.find(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.mrn.toLowerCase().includes(query.toLowerCase()),
    );
    setResult(found ?? null);
    setSearched(true);
    if (actor && found) {
      actor
        .createClinicalNote(
          4n,
          "pdmp-lookup",
          JSON.stringify({
            query,
            patientFound: found.name,
            riskLevel: found.riskLevel,
            timestamp: new Date().toISOString(),
          }),
          0n,
        )
        .catch(() => {});
    }
  };

  return (
    <div className="space-y-5" data-ocid="pdmp.page">
      {/* Search */}
      <div className="bg-card border border-border p-4 flex gap-3 items-end">
        <div className="flex-1">
          <Label
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1"
            htmlFor="pdmp-search"
          >
            Patient Name or MRN
          </Label>
          <Input
            id="pdmp-search"
            data-ocid="pdmp.search_input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder='Search — e.g. "Linda Marchetti" or "MRN-001"'
            className="h-9 text-sm"
          />
        </div>
        <Button
          data-ocid="pdmp.primary_button"
          size="sm"
          onClick={handleSearch}
          className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Search className="w-3.5 h-3.5 mr-1.5" />
          Look Up
        </Button>
      </div>

      {/* Demo hint */}
      {!searched && (
        <div className="text-xs text-muted-foreground bg-muted/40 border border-border px-4 py-3">
          <ShieldAlert className="inline w-3.5 h-3.5 mr-1.5 text-warning" />
          Demo patients: <strong>James Hartwell</strong> (low risk) ·{" "}
          <strong>Linda Marchetti</strong> (high risk — multiple prescribers,
          opioid overlap)
        </div>
      )}

      {/* No result */}
      {searched && !result && (
        <div
          className="bg-card border border-border px-4 py-10 text-center text-sm text-muted-foreground"
          data-ocid="pdmp.empty_state"
        >
          No PDMP record found for &ldquo;{query}&rdquo;.
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4" data-ocid="pdmp.panel">
          {/* Patient header */}
          <div className="bg-card border border-border px-5 py-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <button
                  type="button"
                  onClick={() => onNavigate?.("patients")}
                  className="text-base font-bold text-primary underline-offset-2 hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  {result.name}
                </button>
                <p className="text-xs text-muted-foreground mt-0.5">
                  DOB: {result.dob} · MRN: {result.mrn}
                </p>
              </div>
              <StatusBadge
                variant={result.riskLevel === "high" ? "danger" : "success"}
                label={result.riskLevel === "high" ? "High Risk" : "Low Risk"}
              />
            </div>

            {/* Risk indicators */}
            <div className="flex flex-wrap gap-2 mt-3">
              {result.prescribers90 >= 3 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-warning/10 text-warning border border-warning/30 rounded-sm">
                  <AlertTriangle className="w-3 h-3" />
                  Multiple Prescribers ({result.prescribers90} in 90 days)
                </span>
              )}
              {result.totalMme >= 90 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded-sm">
                  <AlertTriangle className="w-3 h-3" />
                  High MME: {result.totalMme} MME/day
                </span>
              )}
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 bg-muted text-muted-foreground border border-border rounded-sm">
                Last Fill: {result.lastFill}
              </span>
            </div>
          </div>

          {/* Overlapping prescriptions */}
          {result.overlaps.length > 0 && (
            <div className="bg-destructive/5 border border-destructive/20 px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <h3 className="text-sm font-semibold text-destructive">
                  Overlapping Fills Detected
                </h3>
              </div>
              <div className="space-y-2">
                {result.overlaps.map((ov, i) => (
                  <div
                    key={`overlap-${ov.drug1}-${ov.drug2}`}
                    data-ocid={`pdmp.overlap.item.${i + 1}`}
                    className="text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2"
                  >
                    <strong>{ov.drug1}</strong> overlaps with{" "}
                    <strong>{ov.drug2}</strong> — {ov.overlapDays} days
                    concurrent
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Provider summary */}
          <div className="bg-card border border-border px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Provider Summary
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Prescribers (90 days)
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {result.prescribers90}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Prescribers (180 days)
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {result.prescribers180}
                </p>
              </div>
            </div>
          </div>

          {/* Prescription history */}
          <div className="bg-card border border-border">
            <div className="px-5 py-3 border-b border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Controlled Substance History
              </h3>
            </div>
            <Table data-ocid="pdmp.table">
              <TableHeader>
                <TableRow className="bg-muted/60 hover:bg-muted/60">
                  {[
                    "Drug Name",
                    "Schedule",
                    "Prescriber",
                    "Pharmacy",
                    "Date Filled",
                    "Days Supply",
                    "MME/Day",
                  ].map((h) => (
                    <TableHead
                      key={h}
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.history.map((rx, i) => (
                  <TableRow
                    key={`${rx.drug}-${rx.dateFilled}-${rx.pharmacy}`}
                    data-ocid={`pdmp.row.${i + 1}`}
                    className="hover:bg-muted/30 even:bg-muted/20"
                  >
                    <TableCell className="font-medium text-sm px-4 py-2.5">
                      {rx.drug}
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <StatusBadge
                        variant={
                          rx.schedule === "Sch II"
                            ? "danger"
                            : rx.schedule === "Sch III"
                              ? "warning"
                              : "neutral"
                        }
                        label={rx.schedule}
                      />
                    </TableCell>
                    <TableCell className="text-xs px-4 py-2.5 text-muted-foreground">
                      {rx.prescriber}
                    </TableCell>
                    <TableCell className="text-xs px-4 py-2.5 text-muted-foreground">
                      {rx.pharmacy}
                    </TableCell>
                    <TableCell className="font-mono text-xs px-4 py-2.5 text-muted-foreground">
                      {rx.dateFilled}
                    </TableCell>
                    <TableCell className="text-xs px-4 py-2.5 text-center">
                      {rx.daysSupply}d
                    </TableCell>
                    <TableCell className="text-xs px-4 py-2.5">
                      {rx.mmePerDay > 0 ? (
                        <span
                          className={`font-semibold ${
                            rx.mmePerDay >= 90
                              ? "text-destructive"
                              : rx.mmePerDay >= 50
                                ? "text-warning"
                                : "text-foreground"
                          }`}
                        >
                          {rx.mmePerDay}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
