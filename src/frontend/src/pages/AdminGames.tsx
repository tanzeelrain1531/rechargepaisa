import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useActiveGames, useAdminAddGame } from "@/hooks/useBackend";
import { formatPaisa } from "@/lib/backendTypes";
import type { GameInfo } from "@/lib/backendTypes";
import { Gamepad2, Pencil, Plus, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const GAME_EMOJIS: string[] = ["🎮", "🃏", "🎰", "🏏", "♟️", "🔢", "🎲", "⚡"];

interface GameFormData {
  name: string;
  description: string;
  entryFee: string;
  maxWinnings: string;
  isActive: boolean;
}

const EMPTY_FORM: GameFormData = {
  name: "",
  description: "",
  entryFee: "",
  maxWinnings: "",
  isActive: true,
};

function GameFormModal({
  open,
  onClose,
  onSubmit,
  submitting,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: GameFormData) => void;
  submitting: boolean;
  initial?: GameFormData;
}) {
  const [form, setForm] = useState<GameFormData>(initial ?? EMPTY_FORM);

  const set = (k: keyof GameFormData, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.entryFee || !form.maxWinnings) {
      toast.error("Please fill all required fields");
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="admin-games.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {initial ? "Edit Game" : "Add New Game"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="game-name" className="text-sm text-foreground">
              Game Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="game-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Teen Patti Master"
              className="bg-background border-input"
              data-ocid="admin-games.name_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="game-desc" className="text-sm text-foreground">
              Description
            </Label>
            <Textarea
              id="game-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Short description of the game..."
              className="bg-background border-input resize-none text-sm"
              rows={2}
              data-ocid="admin-games.description_textarea"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="entry-fee" className="text-sm text-foreground">
                Entry Fee (paisa) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="entry-fee"
                type="number"
                min="1"
                value={form.entryFee}
                onChange={(e) => set("entryFee", e.target.value)}
                placeholder="e.g. 1000"
                className="bg-background border-input"
                data-ocid="admin-games.entry_fee_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="max-winnings" className="text-sm text-foreground">
                Max Winnings (paisa) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="max-winnings"
                type="number"
                min="1"
                value={form.maxWinnings}
                onChange={(e) => set("maxWinnings", e.target.value)}
                placeholder="e.g. 5000"
                className="bg-background border-input"
                data-ocid="admin-games.max_winnings_input"
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted/30 border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Active</p>
              <p className="text-xs text-muted-foreground">
                Visible to players?
              </p>
            </div>
            <Switch
              checked={form.isActive}
              onCheckedChange={(v) => set("isActive", v)}
              data-ocid="admin-games.active_switch"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-border"
              onClick={onClose}
              data-ocid="admin-games.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground"
              disabled={submitting}
              data-ocid="admin-games.submit_button"
            >
              {submitting ? "Saving..." : initial ? "Save Changes" : "Add Game"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function GameRow({
  game,
  index,
  onEdit,
}: { game: GameInfo; index: number; onEdit: (g: GameInfo) => void }) {
  const emoji = GAME_EMOJIS[Number(game.id) % GAME_EMOJIS.length];
  return (
    <tr
      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
      data-ocid={`admin-games.item.${index + 1}`}
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{emoji}</span>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">
              {game.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {game.description}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-right">
        <span className="font-mono text-sm text-foreground">
          {formatPaisa(game.entryFee)}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <span className="font-mono text-sm text-primary font-semibold">
          {formatPaisa(game.maxWinnings)}
        </span>
      </td>
      <td className="px-5 py-4 text-center">
        <Badge
          variant={game.isActive ? "default" : "secondary"}
          className={`text-xs ${
            game.isActive
              ? "bg-success/20 text-success border border-success/30"
              : "bg-muted text-muted-foreground border-border"
          }`}
        >
          {game.isActive ? "Active" : "Inactive"}
        </Badge>
      </td>
      <td className="px-5 py-4 text-right">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          data-ocid={`admin-games.edit_button.${index + 1}`}
          onClick={() => onEdit(game)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Pencil className="w-3.5 h-3.5 mr-1" />
          Edit
        </Button>
      </td>
    </tr>
  );
}

export default function AdminGames() {
  const { data: games, isLoading } = useActiveGames();
  const addGame = useAdminAddGame();
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState<GameInfo | null>(null);

  const handleAdd = async (form: GameFormData) => {
    try {
      await addGame.mutateAsync({
        name: form.name,
        description: form.description,
        entryFee: BigInt(Number(form.entryFee)),
        maxWinnings: BigInt(Number(form.maxWinnings)),
      });
      toast.success("Game added successfully!");
      setShowModal(false);
    } catch {
      toast.error("Failed to add game. Try again.");
    }
  };

  return (
    <div className="space-y-5" data-ocid="admin-games.page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-secondary" />
          <h2
            className="text-base font-bold text-foreground"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Game Library
          </h2>
          {!isLoading && (
            <Badge variant="secondary" className="text-xs">
              {games?.length ?? 0} games
            </Badge>
          )}
        </div>
        <Button
          type="button"
          data-ocid="admin-games.open_modal_button"
          onClick={() => setShowModal(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Game
        </Button>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-5 space-y-3">
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
            </div>
          ) : !games || games.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              data-ocid="admin-games.empty_state"
            >
              <Trophy className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-sm mb-3">
                No games yet. Add your first game!
              </p>
              <Button
                type="button"
                onClick={() => setShowModal(true)}
                className="bg-primary text-primary-foreground"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Game
              </Button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Game
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Entry Fee
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Max Win
                  </th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {games.map((g, idx) => (
                  <GameRow
                    key={`game-${Number(g.id)}`}
                    game={g}
                    index={idx}
                    onEdit={(game) => setEditingGame(game)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Add game modal */}
      <GameFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAdd}
        submitting={addGame.isPending}
      />

      {/* Edit game modal (UI only — no mutation for edit in contracts) */}
      {editingGame && (
        <GameFormModal
          open={!!editingGame}
          onClose={() => setEditingGame(null)}
          onSubmit={() => {
            toast.info("Edit saved locally (backend mutation coming soon)");
            setEditingGame(null);
          }}
          submitting={false}
          initial={{
            name: editingGame.name,
            description: editingGame.description,
            entryFee: String(Number(editingGame.entryFee)),
            maxWinnings: String(Number(editingGame.maxWinnings)),
            isActive: editingGame.isActive,
          }}
        />
      )}
    </div>
  );
}
