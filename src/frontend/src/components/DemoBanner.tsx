import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="flex items-center justify-between gap-2 px-4 py-1 bg-warning/10 border-b border-warning/30 flex-shrink-0"
      data-ocid="demo.banner"
      role="banner"
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
        <p className="text-xs font-semibold text-foreground tracking-wide">
          DEMONSTRATION ONLY &mdash; Not for clinical use. All data is
          simulated.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        data-ocid="demo.banner.close_button"
        className="p-1 rounded hover:bg-warning/20 transition-colors flex-shrink-0"
        aria-label="Dismiss demo banner"
      >
        <X className="w-4 h-4 text-foreground/60" />
      </button>
    </div>
  );
}
