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
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

const PROVIDERS = [
  "Dr. Sarah Johnson",
  "Dr. Michael Chen",
  "Dr. Emily Rodriguez",
  "Dr. James Hartwell",
  "Dr. Anita Patel",
];

interface AvailabilityBlock {
  id: number;
  provider: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  recurrence: "one-time" | "weekly";
}

interface AvailForm {
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  recurrence: "one-time" | "weekly";
}

interface ProviderAvailabilityPanelProps {
  showAvailability: boolean;
  setShowAvailability: React.Dispatch<React.SetStateAction<boolean>>;
  availBlocks: AvailabilityBlock[];
  availForm: AvailForm;
  setAvailForm: React.Dispatch<React.SetStateAction<AvailForm>>;
  selectedProvider: string;
  setSelectedProvider: React.Dispatch<React.SetStateAction<string>>;
  showAvailForm: boolean;
  setShowAvailForm: React.Dispatch<React.SetStateAction<boolean>>;
  onAddBlock: () => void;
  onRemoveBlock: (id: number) => void;
}

export function ProviderAvailabilityPanel({
  showAvailability,
  setShowAvailability,
  availBlocks,
  availForm,
  setAvailForm,
  selectedProvider,
  setSelectedProvider,
  showAvailForm,
  setShowAvailForm,
  onAddBlock,
  onRemoveBlock,
}: ProviderAvailabilityPanelProps) {
  const providerBlocks = availBlocks.filter(
    (b) => b.provider === selectedProvider,
  );

  return (
    <div
      className="bg-card border border-border"
      data-ocid="appointments.availability.panel"
    >
      <button
        type="button"
        data-ocid="appointments.availability.toggle"
        onClick={() => setShowAvailability((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Manage Provider Availability
          </span>
        </div>
        {showAvailability ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {showAvailability && (
        <div className="px-4 pb-4 border-t border-border space-y-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Provider
              </Label>
              <Select
                value={selectedProvider}
                onValueChange={setSelectedProvider}
              >
                <SelectTrigger
                  data-ocid="appointments.availability.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDERS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="pt-5">
              <Button
                size="sm"
                data-ocid="appointments.availability.primary_button"
                onClick={() => setShowAvailForm((v) => !v)}
                className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Block
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {selectedProvider} has {providerBlocks.length} block
            {providerBlocks.length !== 1 ? "s" : ""} this period.
          </p>

          {showAvailForm && (
            <div
              className="bg-muted/30 border border-border p-3 space-y-3"
              data-ocid="appointments.availability.form.panel"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Date / Label
                  </Label>
                  <Input
                    data-ocid="appointments.availability.date.input"
                    value={availForm.date}
                    onChange={(e) =>
                      setAvailForm((p) => ({ ...p, date: e.target.value }))
                    }
                    placeholder="e.g. Jan 3"
                    className="mt-1 h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Start
                  </Label>
                  <Input
                    data-ocid="appointments.availability.start.input"
                    type="time"
                    value={availForm.startTime}
                    onChange={(e) =>
                      setAvailForm((p) => ({
                        ...p,
                        startTime: e.target.value,
                      }))
                    }
                    className="mt-1 h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    End
                  </Label>
                  <Input
                    data-ocid="appointments.availability.end.input"
                    type="time"
                    value={availForm.endTime}
                    onChange={(e) =>
                      setAvailForm((p) => ({ ...p, endTime: e.target.value }))
                    }
                    className="mt-1 h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Recurrence
                  </Label>
                  <Select
                    value={availForm.recurrence}
                    onValueChange={(v) =>
                      setAvailForm((p) => ({
                        ...p,
                        recurrence: v as "one-time" | "weekly",
                      }))
                    }
                  >
                    <SelectTrigger
                      data-ocid="appointments.availability.recurrence.select"
                      className="mt-1 h-8 text-sm"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One-time</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Reason
                </Label>
                <Input
                  data-ocid="appointments.availability.reason.input"
                  value={availForm.reason}
                  onChange={(e) =>
                    setAvailForm((p) => ({ ...p, reason: e.target.value }))
                  }
                  placeholder="Holiday, Conference, Admin Time..."
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  data-ocid="appointments.availability.submit_button"
                  onClick={onAddBlock}
                  className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Save Block
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid="appointments.availability.cancel_button"
                  onClick={() => setShowAvailForm(false)}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {providerBlocks.length === 0 ? (
              <p
                className="text-xs text-muted-foreground py-2"
                data-ocid="appointments.availability.empty_state"
              >
                No blocks set for this provider.
              </p>
            ) : (
              providerBlocks.map((block, idx) => (
                <div
                  key={block.id}
                  data-ocid={`appointments.availability.item.${idx + 1}`}
                  className="flex items-center justify-between px-3 py-2 bg-muted/30 border border-border text-xs"
                >
                  <div>
                    <span className="font-medium text-foreground">
                      {block.date}
                    </span>
                    {block.startTime && (
                      <span className="text-muted-foreground ml-2">
                        {block.startTime}–{block.endTime}
                      </span>
                    )}
                    <span className="ml-2 text-muted-foreground">
                      — {block.reason}
                    </span>
                    {block.recurrence === "weekly" && (
                      <span className="ml-1.5 text-xs bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full font-semibold">
                        Weekly
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    data-ocid={`appointments.availability.delete_button.${idx + 1}`}
                    onClick={() => onRemoveBlock(block.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors text-xs font-medium ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
