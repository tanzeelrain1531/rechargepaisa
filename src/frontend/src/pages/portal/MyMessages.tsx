import { useActor } from "@/hooks/useActor";
import { useEffect, useState } from "react";

interface Message {
  id: number;
  sender: string;
  senderType: "patient" | "staff";
  content: string;
  timestamp: string;
}

interface Thread {
  id: number;
  subject: string;
  category: string;
  lastMessage: string;
  lastTimestamp: string;
  unread: boolean;
  messages: Message[];
}

const initialThreads: Thread[] = [
  {
    id: 1,
    subject: "Follow-up on blood pressure results",
    category: "Dr. Sarah Johnson",
    lastMessage:
      "Your blood pressure readings have improved. Continue with the current medication.",
    lastTimestamp: "Mar 12, 2026",
    unread: true,
    messages: [
      {
        id: 1,
        sender: "Alex Johnson",
        senderType: "patient",
        content:
          "Hi, I wanted to ask about my latest blood pressure readings. My home monitor has been showing values around 140/90. Should I be concerned?",
        timestamp: "Mar 10, 2026 at 2:15 PM",
      },
      {
        id: 2,
        sender: "Dr. Sarah Johnson",
        senderType: "staff",
        content:
          "Thank you for reaching out. Readings of 140/90 are mildly elevated. Given that we recently adjusted your lisinopril dose, this is expected while the medication reaches steady state. Please continue monitoring daily and log the readings.",
        timestamp: "Mar 11, 2026 at 9:30 AM",
      },
      {
        id: 3,
        sender: "Alex Johnson",
        senderType: "patient",
        content:
          "Thank you, that's reassuring. I've been logging them — the past 3 days have been 138/86, 135/84, and 132/82. It does seem to be coming down.",
        timestamp: "Mar 11, 2026 at 4:00 PM",
      },
      {
        id: 4,
        sender: "Dr. Sarah Johnson",
        senderType: "staff",
        content:
          "Your blood pressure readings have improved. Continue with the current medication dose and the low-sodium diet. See you at our scheduled follow-up on March 25th.",
        timestamp: "Mar 12, 2026 at 11:00 AM",
      },
    ],
  },
  {
    id: 2,
    subject: "Appointment reminder — March 20th",
    category: "Reception",
    lastMessage:
      "Your appointment is confirmed for March 20 at 10:00 AM with Dr. Johnson.",
    lastTimestamp: "Mar 11, 2026",
    unread: false,
    messages: [
      {
        id: 1,
        sender: "Reception",
        senderType: "staff",
        content:
          "This is a reminder that you have an upcoming appointment on Friday, March 20th at 10:00 AM with Dr. Sarah Johnson. Please arrive 10 minutes early to complete any updated intake forms. Reply to confirm or request a reschedule.",
        timestamp: "Mar 11, 2026 at 8:00 AM",
      },
      {
        id: 2,
        sender: "Alex Johnson",
        senderType: "patient",
        content: "Confirmed, thank you!",
        timestamp: "Mar 11, 2026 at 9:15 AM",
      },
      {
        id: 3,
        sender: "Reception",
        senderType: "staff",
        content:
          "Your appointment is confirmed for March 20 at 10:00 AM with Dr. Johnson. See you then!",
        timestamp: "Mar 11, 2026 at 9:30 AM",
      },
    ],
  },
];

const providers = [
  "Dr. Sarah Johnson — Primary Care",
  "Dr. Marcus Williams — Cardiology",
  "Dr. Emily Chen — Endocrinology",
  "Dr. Amanda Reyes — Nephrology",
  "Dr. Rachel Nguyen — Pulmonology",
  "Dr. Kevin Park — General Surgery",
  "Nurse Patricia Lee — Care Team",
  "Reception / Scheduling",
];

export default function MyMessages() {
  const { actor, isFetching } = useActor();
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [replyText, setReplyText] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeForm, setComposeForm] = useState({
    provider: "",
    subject: "",
    body: "",
  });
  const [_loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (!actor || isFetching) return;
    setLoadingMessages(true);
    actor
      .listMessages()
      .then((msgs) => {
        if (Array.isArray(msgs) && msgs.length > 0) {
          const backendThreads = msgs.map((m: any, i: number) => ({
            id: initialThreads.length + i + 1,
            subject: "Secure Message",
            category: "Care Team",
            lastMessage: m.content ?? "",
            lastTimestamp: m.createdAt
              ? new Date(Number(m.createdAt) / 1_000_000).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" },
                )
              : "Recently",
            unread: false,
            messages: [
              {
                id: 1,
                sender: "Care Team",
                senderType: "staff" as const,
                content: m.content ?? "",
                timestamp: m.createdAt
                  ? new Date(Number(m.createdAt) / 1_000_000).toLocaleString()
                  : new Date().toLocaleString(),
              },
            ],
          }));
          if (backendThreads.length > 0) {
            setThreads([...initialThreads, ...backendThreads]);
          }
        }
      })
      .catch(() => {
        // silently continue with seed data
      })
      .finally(() => {
        setLoadingMessages(false);
      });
  }, [actor, isFetching]);

  const selectedThread = threads.find((t) => t.id === selectedId) ?? threads[0];
  const localMessages = selectedThread.messages;

  const handleSend = () => {
    if (!replyText.trim()) return;
    if (actor) {
      actor.sendMessage(1n, 10n, replyText).catch(() => {});
    }
    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedId
          ? {
              ...t,
              messages: [
                ...t.messages,
                {
                  id: t.messages.length + 1,
                  sender: "Alex Johnson",
                  senderType: "patient",
                  content: replyText,
                  timestamp: new Date().toLocaleString(),
                },
              ],
              lastMessage: replyText,
              lastTimestamp: "Just now",
            }
          : t,
      ),
    );
    setReplyText("");
  };

  const handleNewMessage = () => {
    if (!composeForm.provider || !composeForm.subject || !composeForm.body)
      return;
    if (actor) {
      actor.sendMessage(1n, 10n, composeForm.body).catch(() => {});
    }
    const newThread: Thread = {
      id: threads.length + 1,
      subject: composeForm.subject,
      category: composeForm.provider,
      lastMessage: composeForm.body,
      lastTimestamp: "Just now",
      unread: false,
      messages: [
        {
          id: 1,
          sender: "Alex Johnson",
          senderType: "patient",
          content: composeForm.body,
          timestamp: new Date().toLocaleString(),
        },
      ],
    };
    setThreads((prev) => [newThread, ...prev]);
    setSelectedId(newThread.id);
    setComposeOpen(false);
    setComposeForm({ provider: "", subject: "", body: "" });
  };

  return (
    <div className="space-y-3" data-ocid="messages.page">
      {/* Info banner */}
      <div
        className="flex items-start gap-3 px-4 py-3 border border-border bg-muted/40 rounded-sm"
        data-ocid="messages.info.panel"
      >
        <svg
          className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-sm text-foreground">
          <strong>Messages are reviewed by your care team.</strong> For urgent
          medical concerns, please call the clinic directly or call 911 in an
          emergency. Response times are typically within 1 business day.
        </p>
      </div>

      {/* New Message button */}
      <div>
        <button
          type="button"
          data-ocid="messages.compose.button"
          onClick={() => setComposeOpen(!composeOpen)}
          className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium bg-primary text-primary-foreground transition-colors rounded-sm hover:bg-primary/90"
        >
          + New Message
        </button>

        {composeOpen && (
          <div
            className="mt-2 p-4 border border-border bg-card rounded-sm space-y-3"
            data-ocid="messages.compose.panel"
          >
            <p className="text-sm font-semibold">New Message to Care Team</p>
            <div>
              <label
                htmlFor="compose-provider"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Provider
              </label>
              <select
                id="compose-provider"
                value={composeForm.provider}
                onChange={(e) =>
                  setComposeForm((p) => ({ ...p, provider: e.target.value }))
                }
                data-ocid="messages.compose.select"
                className="mt-1 w-full h-8 px-2 text-sm border border-input bg-background rounded-sm focus:outline-none focus:ring-1 ring-ring"
              >
                <option value="">Select provider...</option>
                {providers.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="compose-subject"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Subject
              </label>
              <input
                id="compose-subject"
                value={composeForm.subject}
                onChange={(e) =>
                  setComposeForm((p) => ({ ...p, subject: e.target.value }))
                }
                placeholder="e.g. Question about my medication"
                data-ocid="messages.compose.input"
                className="mt-1 w-full h-8 px-2 text-sm border border-input bg-background rounded-sm focus:outline-none focus:ring-1 ring-ring"
              />
            </div>
            <div>
              <label
                htmlFor="compose-body"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Message
              </label>
              <textarea
                id="compose-body"
                value={composeForm.body}
                onChange={(e) =>
                  setComposeForm((p) => ({ ...p, body: e.target.value }))
                }
                rows={3}
                data-ocid="messages.compose.textarea"
                className="mt-1 w-full px-3 py-2 text-sm border border-input bg-background rounded-sm focus:outline-none focus:ring-1 ring-ring resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleNewMessage}
                data-ocid="messages.compose.submit_button"
                className="h-8 px-4 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-sm transition-colors"
              >
                Send Message
              </button>
              <button
                type="button"
                onClick={() => setComposeOpen(false)}
                data-ocid="messages.compose.cancel_button"
                className="h-8 px-4 text-sm font-medium border border-border rounded-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 h-[580px]" data-ocid="messages.panel">
        {/* Thread list */}
        <div
          className="w-72 flex-shrink-0 bg-card border border-border rounded-sm overflow-hidden flex flex-col"
          data-ocid="messages.list"
        >
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <p className="text-xs font-semibold text-foreground">Inbox</p>
            <p className="text-xs text-muted-foreground">
              {threads.filter((t) => t.unread).length} unread
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {threads.length === 0 && (
              <div
                className="flex flex-col items-center justify-center h-full gap-2 px-4 py-8 text-center"
                data-ocid="messages.empty_state"
              >
                <p className="text-sm font-medium text-muted-foreground">
                  No messages yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Send a message to your care team.
                </p>
                <button
                  type="button"
                  onClick={() => setComposeOpen(true)}
                  data-ocid="messages.compose.open_modal_button"
                  className="mt-1 inline-flex items-center gap-1.5 h-7 px-3 text-xs font-medium bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
                >
                  Message My Provider
                </button>
              </div>
            )}
            {threads.map((thread, i) => (
              <button
                type="button"
                key={thread.id}
                data-ocid={`messages.item.${i + 1}`}
                onClick={() => setSelectedId(thread.id)}
                className={`w-full text-left px-4 py-3 border-b border-border transition-colors hover:bg-muted/40 border-l-2 ${
                  selectedId === thread.id
                    ? "border-l-primary bg-primary/5"
                    : "border-l-transparent"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-xs font-semibold text-muted-foreground">
                    {thread.category}
                  </p>
                  {thread.unread && (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm font-medium text-foreground truncate">
                  {thread.subject}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {thread.lastMessage}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {thread.lastTimestamp}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Thread panel */}
        <div
          className="flex-1 bg-card border border-border rounded-sm flex flex-col overflow-hidden"
          data-ocid="messages.thread.panel"
        >
          <div className="px-5 py-3 border-b border-border flex-shrink-0 bg-muted/30">
            <p className="text-sm font-semibold text-foreground">
              {selectedThread.subject}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedThread.category}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {localMessages.map((msg) => {
              const isPatient = msg.senderType === "patient";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isPatient ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-sm px-4 py-2.5 ${isPatient ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border border-border"}`}
                  >
                    <p
                      className="text-xs font-semibold mb-1"
                      style={{ opacity: 0.85 }}
                    >
                      {msg.sender}
                    </p>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-1">
                    {msg.timestamp}
                  </p>
                </div>
              );
            })}
          </div>

          <div
            className="px-5 py-3 border-t border-border flex-shrink-0"
            data-ocid="messages.reply.panel"
          >
            <textarea
              data-ocid="messages.reply.textarea"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              placeholder="Type a message to your care team..."
              className="w-full px-3 py-2 text-sm bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend();
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Ctrl+Enter to send
              </p>
              <button
                type="button"
                data-ocid="messages.reply.submit_button"
                onClick={handleSend}
                disabled={!replyText.trim()}
                className="h-8 px-4 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-sm transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
