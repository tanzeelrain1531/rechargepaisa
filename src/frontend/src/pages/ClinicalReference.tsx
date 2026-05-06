import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useState } from "react";
import { ICD_CODES } from "../data/icdCodes";
import { MEDICATIONS } from "../data/medications";
import { SYMPTOMS } from "../data/symptoms";

// Alias for internal use
const medications = MEDICATIONS;
const icdCodes = ICD_CODES;
const symptoms = SYMPTOMS;

// ─── Badge color helpers ─────────────────────────────────────────────────────
const routeColor: Record<string, string> = {
  PO: "bg-primary/10 text-primary",
  IV: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
  "PO/IV":
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  Inhaled: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  "Inhaled/NEB":
    "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  SQ: "bg-warning/15 text-warning-foreground dark:bg-warning/20 dark:text-warning",
  "PO/SQ":
    "bg-warning/15 text-warning-foreground dark:bg-warning/20 dark:text-warning",
  "IV/SQ":
    "bg-warning/15 text-warning-foreground dark:bg-warning/20 dark:text-warning",
  "IV/IM": "bg-destructive/10 text-destructive",
  "PO/IV/IM": "bg-destructive/10 text-destructive",
  IM: "bg-destructive/10 text-destructive",
  "PO/IM": "bg-destructive/10 text-destructive",
  "TD/IV": "bg-warning/10 text-warning",
  "IM/IV/IN":
    "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  "PO/PR": "bg-success/0.1 text-success",
};

const categoryColorMap: Record<string, string> = {
  Cardiovascular: "bg-destructive/10 text-destructive",
  Endocrine: "bg-warning/10 text-warning",
  Respiratory: "bg-accent/10 text-accent",
  Gastrointestinal: "bg-success/0.1 text-success",
  Musculoskeletal:
    "bg-warning/15 text-warning-foreground dark:bg-warning/20 dark:text-warning",
  "Mental Health":
    "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
  Neurological:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  Infectious:
    "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  Genitourinary:
    "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  Obstetric: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  Symptoms: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
  Preventive: "bg-success/0.1 text-success",
};

export default function ClinicalReference() {
  const [medSearch, setMedSearch] = useState("");
  const [icdSearch, setIcdSearch] = useState("");
  const [symptomSearch, setSymptomSearch] = useState("");

  const filteredMeds = medications.filter((m) => {
    const q = medSearch.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.drugClass.toLowerCase().includes(q) ||
      m.indication.toLowerCase().includes(q)
    );
  });

  const filteredIcd = icdCodes.filter((c) => {
    const q = icdSearch.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  const filteredSymptoms = symptoms.filter((s) => {
    const q = symptomSearch.toLowerCase();
    return (
      s.symptom.toLowerCase().includes(q) ||
      s.causes.some((c) => c.toLowerCase().includes(q)) ||
      s.workup.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4" data-ocid="clinical_reference.page">
      <Tabs defaultValue="medications" data-ocid="clinical_reference.tab">
        <TabsList className="h-9">
          <TabsTrigger
            value="medications"
            data-ocid="clinical_reference.medications.tab"
            className="text-xs px-4"
          >
            Medications ({medications.length})
          </TabsTrigger>
          <TabsTrigger
            value="icd10"
            data-ocid="clinical_reference.icd10.tab"
            className="text-xs px-4"
          >
            ICD-10 Codes ({icdCodes.length})
          </TabsTrigger>
          <TabsTrigger
            value="symptoms"
            data-ocid="clinical_reference.symptoms.tab"
            className="text-xs px-4"
          >
            Symptoms ({symptoms.length})
          </TabsTrigger>
        </TabsList>

        {/* ── Medications Tab ─────────────────────────────────────────── */}
        <TabsContent value="medications" className="mt-4 space-y-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              data-ocid="clinical_reference.medications.search_input"
              placeholder="Search by name, class, or indication..."
              value={medSearch}
              onChange={(e) => setMedSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          <div className="bg-card border border-border overflow-hidden">
            <Table data-ocid="clinical_reference.medications.table">
              <TableHeader>
                <TableRow className="bg-muted/60 hover:bg-muted/60">
                  {[
                    "Drug Name",
                    "Class",
                    "Indication",
                    "Dose",
                    "Route",
                    "Key Notes",
                  ].map((h) => (
                    <TableHead
                      key={h}
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-3"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeds.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-sm text-muted-foreground"
                      data-ocid="clinical_reference.medications.empty_state"
                    >
                      No medications match your search
                    </TableCell>
                  </TableRow>
                )}
                {filteredMeds.map((m, i) => (
                  <TableRow
                    key={m.name}
                    data-ocid={`clinical_reference.medications.row.${i + 1}`}
                    className="hover:bg-muted/30 even:bg-muted/20 border-l-2 border-l-transparent hover:border-l-accent transition-all"
                  >
                    <TableCell className="px-3 py-2.5 font-semibold text-sm text-foreground">
                      {m.name}
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-xs text-muted-foreground">
                      {m.drugClass}
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-xs text-foreground">
                      {m.indication}
                    </TableCell>
                    <TableCell className="px-3 py-2.5 font-mono text-xs text-foreground">
                      {m.dose}
                    </TableCell>
                    <TableCell className="px-3 py-2.5">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold ${routeColor[m.route] ?? "bg-gray-100 text-gray-700"}`}
                      >
                        {m.route}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-xs text-muted-foreground max-w-[220px]">
                      {m.notes}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ── ICD-10 Tab ──────────────────────────────────────────────── */}
        <TabsContent value="icd10" className="mt-4 space-y-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              data-ocid="clinical_reference.icd10.search_input"
              placeholder="Search by code, description, or category..."
              value={icdSearch}
              onChange={(e) => setIcdSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          <div className="bg-card border border-border overflow-hidden">
            <Table data-ocid="clinical_reference.icd10.table">
              <TableHeader>
                <TableRow className="bg-muted/60 hover:bg-muted/60">
                  {["Code", "Description", "Category"].map((h) => (
                    <TableHead
                      key={h}
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-3"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIcd.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-10 text-sm text-muted-foreground"
                      data-ocid="clinical_reference.icd10.empty_state"
                    >
                      No ICD-10 codes match your search
                    </TableCell>
                  </TableRow>
                )}
                {filteredIcd.map((c, i) => (
                  <TableRow
                    key={c.code}
                    data-ocid={`clinical_reference.icd10.row.${i + 1}`}
                    className="hover:bg-muted/30 even:bg-muted/20 border-l-2 border-l-transparent hover:border-l-accent transition-all"
                  >
                    <TableCell className="px-3 py-2.5 font-mono text-sm font-semibold text-foreground">
                      {c.code}
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-sm text-foreground">
                      {c.description}
                    </TableCell>
                    <TableCell className="px-3 py-2.5">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold ${categoryColorMap[c.category] ?? "bg-gray-100 text-gray-700"}`}
                      >
                        {c.category}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ── Symptoms Tab ────────────────────────────────────────────── */}
        <TabsContent value="symptoms" className="mt-4 space-y-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              data-ocid="clinical_reference.symptoms.search_input"
              placeholder="Search symptoms, causes, or workup..."
              value={symptomSearch}
              onChange={(e) => setSymptomSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          {filteredSymptoms.length === 0 && (
            <div
              className="text-center py-10 text-sm text-muted-foreground"
              data-ocid="clinical_reference.symptoms.empty_state"
            >
              No symptoms match your search
            </div>
          )}
          <div className="grid gap-3">
            {filteredSymptoms.map((s, i) => (
              <div
                key={s.symptom}
                data-ocid={`clinical_reference.symptoms.card.${i + 1}`}
                className="bg-card border border-border p-4 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    {s.symptom}
                  </h3>
                </div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Common Causes
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {s.causes.map((cause) => (
                        <Badge
                          key={cause}
                          variant="secondary"
                          className="text-xs px-1.5 py-0"
                        >
                          {cause}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Suggested Workup
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {s.workup}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
