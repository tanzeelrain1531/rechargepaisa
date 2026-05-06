import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Bell,
  ClipboardList,
  FlaskConical,
  MessageSquare,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface Notification {
  id: number;
  type: "critical" | "message" | "order";
  message: string;
  time: string;
  read: boolean;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "critical",
    message: "Critical lab result: Potassium 6.2 mEq/L — John Smith",
    time: "2h ago",
    read: false,
  },
  {
    id: 2,
    type: "message",
    message: "New message from Dr. Marcus Williams",
    time: "14m ago",
    read: false,
  },
  {
    id: 3,
    type: "order",
    message: "Pending order approval: CBC — Maria Garcia",
    time: "1h ago",
    read: false,
  },
  {
    id: 4,
    type: "critical",
    message: "Critical lab result: Troponin elevated — Robert Lee",
    time: "2h ago",
    read: true,
  },
  {
    id: 5,
    type: "message",
    message: "Secure message: Prescription renewal request",
    time: "3h ago",
    read: true,
  },
];

type FilterType = "all" | "results" | "messages";

function TypeIcon({ type }: { type: Notification["type"] }) {
  if (type === "critical") {
    return (
      <span className="flex-shrink-0 w-6 h-6 rounded bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="w-3 h-3 text-destructive" />
      </span>
    );
  }
  if (type === "message") {
    return (
      <span className="flex-shrink-0 w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
        <MessageSquare className="w-3 h-3 text-primary" />
      </span>
    );
  }
  return (
    <span className="flex-shrink-0 w-6 h-6 rounded bg-muted flex items-center justify-center">
      <ClipboardList className="w-3 h-3 text-muted-foreground" />
    </span>
  );
}

const FILTER_TABS: {
  id: FilterType;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "all", label: "All", icon: Bell },
  { id: "results", label: "Results", icon: FlaskConical },
  { id: "messages", label: "Messages", icon: MessageSquare },
];

export default function NotificationDropdown() {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const filtered = notifications.filter((n) => {
    if (filter === "results")
      return n.type === "critical" || n.type === "order";
    if (filter === "messages") return n.type === "message";
    return true;
  });

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell trigger */}
      <button
        type="button"
        className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-muted/50"
        aria-label="Notifications"
        data-ocid="header.bell.button"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-sm shadow-lg z-50 overflow-hidden"
          data-ocid="notifications.panel"
        >
          {/* Header row */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold text-foreground">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-xs font-bold bg-destructive text-white px-1.5 py-0.5 rounded-full leading-none">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              type="button"
              data-ocid="notifications.mark_all.button"
              onClick={markAllRead}
              className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Mark all read
            </button>
          </div>

          {/* Filter tabs — compact pill style */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-background">
            {FILTER_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                data-ocid={`notifications.${id}.tab`}
                onClick={() => setFilter(id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium transition-colors",
                  filter === id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>

          {/* Notification list */}
          <div className="max-h-72 overflow-y-auto">
            {filtered.length === 0 ? (
              <div
                className="px-4 py-8 text-center text-[12px] text-muted-foreground"
                data-ocid="notifications.empty_state"
              >
                No notifications
              </div>
            ) : (
              (() => {
                const SECTION_ORDER: Array<{
                  type: Notification["type"];
                  label: string;
                }> = [
                  { type: "critical", label: "Critical Results" },
                  { type: "message", label: "Messages" },
                  { type: "order", label: "Orders" },
                ];
                let globalIndex = 0;
                return SECTION_ORDER.flatMap(({ type, label }) => {
                  const group = filtered.filter((n) => n.type === type);
                  if (group.length === 0) return [];
                  return [
                    <div
                      key={`section-${type}`}
                      className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 py-1 mt-2 bg-muted/20 border-b border-border"
                    >
                      {label}
                    </div>,
                    ...group.map((n) => {
                      const idx = ++globalIndex;
                      return (
                        <div
                          key={n.id}
                          data-ocid={`notifications.item.${idx}`}
                          className={cn(
                            "flex items-start gap-2.5 px-4 py-2.5 border-b border-border last:border-b-0 transition-colors hover:bg-muted/20",
                            !n.read && "bg-primary/3",
                          )}
                        >
                          <TypeIcon type={n.type} />
                          <div className="flex-1 min-w-0 py-0.5">
                            <p
                              className={cn(
                                "text-[12px] leading-snug",
                                n.read
                                  ? "text-muted-foreground"
                                  : "text-foreground font-medium",
                              )}
                            >
                              {n.message}
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-0.5">
                              {n.time}
                            </p>
                          </div>
                          {!n.read && (
                            <button
                              type="button"
                              onClick={() => markOneRead(n.id)}
                              className="flex-shrink-0 p-0.5 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                              aria-label="Mark as read"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    }),
                  ];
                });
              })()
            )}
          </div>
        </div>
      )}
    </div>
  );
}
