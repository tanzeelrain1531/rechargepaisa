import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

interface PatientFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const PatientFilters = React.memo(function PatientFilters({
  search,
  onSearchChange,
}: PatientFiltersProps) {
  return (
    <div className="relative max-w-sm w-full">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
      <Input
        data-ocid="patients.search_input"
        placeholder="Search by name, MRN, or phone..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8 h-8 text-sm"
      />
    </div>
  );
});
