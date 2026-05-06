import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllUsers } from "@/hooks/useBackend";
import { formatPaisa, nanosToDate } from "@/lib/backendTypes";
import type { UserSummary } from "@/lib/backendTypes";
import { Search, User, X } from "lucide-react";
import { useState } from "react";

export default function AdminUsers() {
  const { data: users, isLoading } = useAllUsers();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<UserSummary | null>(null);

  const filtered = (users ?? []).filter((u) => {
    const pid = u.owner.toString().toLowerCase();
    return pid.includes(search.toLowerCase());
  });

  return (
    <div className="flex gap-5 h-full" data-ocid="admin-users.page">
      {/* User table */}
      <div className="flex-1 min-w-0">
        <Card className="border-border bg-card h-full flex flex-col">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">All Users</CardTitle>
              {!isLoading && (
                <Badge variant="secondary" className="text-xs">
                  {users?.length ?? 0} total
                </Badge>
              )}
            </div>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by principal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background border-input text-sm"
                data-ocid="admin-users.search_input"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            {isLoading ? (
              <div className="p-4 space-y-3">
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16 text-center"
                data-ocid="admin-users.empty_state"
              >
                <User className="w-10 h-10 text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground text-sm">No users found</p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-sm">
                    <tr className="border-b border-border">
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Principal
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Invested
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Earned
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u, idx) => {
                      const pid = u.owner.toString();
                      const short = `${pid.slice(0, 10)}…${pid.slice(-4)}`;
                      const isSelected = selected?.owner.toString() === pid;
                      const handleSelect = () =>
                        setSelected(isSelected ? null : u);
                      return (
                        <tr
                          key={pid}
                          onClick={handleSelect}
                          onKeyDown={(e) =>
                            (e.key === "Enter" || e.key === " ") &&
                            handleSelect()
                          }
                          className={`border-b border-border/50 cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-primary/10 border-primary/30"
                              : "hover:bg-muted/20"
                          }`}
                          data-ocid={`admin-users.item.${idx + 1}`}
                        >
                          <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                            {short}
                          </td>
                          <td className="px-5 py-3 text-right font-semibold text-foreground">
                            {formatPaisa(u.balance)}
                          </td>
                          <td className="px-5 py-3 text-right text-muted-foreground">
                            {formatPaisa(u.totalInvested)}
                          </td>
                          <td className="px-5 py-3 text-right text-muted-foreground">
                            {formatPaisa(u.totalEarned)}
                          </td>
                          <td className="px-5 py-3 text-right text-muted-foreground">
                            {nanosToDate(u.joinTime).toLocaleDateString(
                              "en-IN",
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Side panel */}
      {selected && (
        <div className="w-80 flex-shrink-0">
          <Card className="border-border bg-card h-full">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  User Detail
                </CardTitle>
                <button
                  type="button"
                  aria-label="Close panel"
                  data-ocid="admin-users.close_button"
                  onClick={() => setSelected(null)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Principal ID
                </p>
                <p className="font-mono text-xs text-foreground break-all">
                  {selected.owner.toString()}
                </p>
              </div>
              <Separator className="bg-border" />
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Balance",
                    value: formatPaisa(selected.balance),
                    highlight: true,
                  },
                  {
                    label: "Invested",
                    value: formatPaisa(selected.totalInvested),
                    highlight: false,
                  },
                  {
                    label: "Earned",
                    value: formatPaisa(selected.totalEarned),
                    highlight: false,
                  },
                  {
                    label: "Net P/L",
                    value: formatPaisa(
                      selected.totalEarned - selected.totalInvested,
                    ),
                    highlight: false,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-xl p-3 border ${
                      stat.highlight
                        ? "bg-primary/10 border-primary/30"
                        : "bg-muted/30 border-border"
                    }`}
                  >
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                      {stat.label}
                    </p>
                    <p
                      className={`text-base font-black ${
                        stat.highlight ? "text-primary" : "text-foreground"
                      }`}
                      style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
              <Separator className="bg-border" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Joined
                </p>
                <p className="text-sm text-foreground">
                  {nanosToDate(selected.joinTime).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div
                className="rounded-xl bg-muted/30 border border-border p-3 text-center"
                data-ocid="admin-users.empty_state"
              >
                <p className="text-xs text-muted-foreground">
                  Transaction history will be added in the next release.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
