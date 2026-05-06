import { Button } from "@/components/ui/button";
import { AlertTriangle, GitMerge } from "lucide-react";
import React from "react";

interface Patient {
  id: bigint;
  name: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  mrn: string;
}

interface DuplicatePair {
  a: Patient;
  b: Patient;
  reason: string;
}

interface PatientMergePanelProps {
  duplicates: DuplicatePair[];
  onMerge: (pair: DuplicatePair) => void;
}

export function PatientMergePanel({
  duplicates,
  onMerge,
}: PatientMergePanelProps) {
  if (duplicates.length === 0) return null;

  return (
    <div
      className="border border-warning/30 bg-warning/10 p-4 space-y-3"
      data-ocid="patients.panel"
    >
      <div className="flex items-center gap-2 text-foreground">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span className="text-sm font-semibold">
          {duplicates.length} potential duplicate record
          {duplicates.length > 1 ? "s" : ""} detected
        </span>
      </div>
      <div className="space-y-2">
        {duplicates.map((pair, i) => (
          <div
            key={`${String(pair.a.id)}-${String(pair.b.id)}`}
            className="flex items-center justify-between bg-white border border-warning/20 px-4 py-3 gap-4"
            data-ocid={`patients.duplicate.row.${i + 1}`}
          >
            <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-foreground">{pair.a.name}</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {pair.a.mrn} · {pair.a.dateOfBirth}
                </div>
              </div>
              <div>
                <div className="font-medium text-foreground">{pair.b.name}</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {pair.b.mrn} · {pair.b.dateOfBirth}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-foreground bg-warning/20 px-2 py-0.5 rounded-full">
                {pair.reason}
              </span>
              <Button
                size="sm"
                variant="outline"
                data-ocid={`patients.confirm_button.${i + 1}`}
                className="border-warning/30 text-foreground hover:bg-warning/10 h-7 text-xs"
                onClick={() => onMerge(pair)}
              >
                <GitMerge className="w-3 h-3 mr-1" />
                Merge
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
