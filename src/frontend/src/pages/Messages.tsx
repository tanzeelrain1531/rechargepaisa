import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Plus,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/StatusBadge";
import { useActor } from "../hooks/useActor";
import { useMessages } from "../hooks/useBackendData";
import { useDemoMode } from "../hooks/useDemoMode";

const patientMessages = [
  {
    id: 1,
    patientName: "Sarah Mitchell",
    subject: "Question about my prescription refill",
    preview: "Hi, I wanted to check on the status of my lisinopril refill...",
    timestamp: "Mar 13, 2026 at 10:22 AM",
    unread: true,
    thread: [
      {
        sender: "Sarah Mitchell",
        isPatient: true,
        content:
          "Hi, I wanted to check on the status of my lisinopril refill. I called the pharmacy and they said it hasn't been sent over yet. Can you please look into this?",
        time: "Mar 13, 2026 at 10:22 AM",
      },
    ],
  },
  {
    id: 2,
    patientName: "Robert Chen",
    subject: "Lab results question",
    preview: "I saw my HbA1c was elevated. Should I be worried?",
    timestamp: "Mar 12, 2026 at 3:45 PM",
    unread: true,
    thread: [
      {
        sender: "Robert Chen",
        isPatient: true,
        content:
          "I received my lab results and noticed my HbA1c was 8.2%. I saw online that this is considered elevated. Should I be worried? Do I need to change my diet or medication?",
        time: "Mar 12, 2026 at 3:45 PM",
      },
      {
        sender: "Dr. Sarah Johnson",
        isPatient: false,
        content:
          "Thank you for reaching out, Robert. Yes, 8.2% is mildly elevated above our target of 7.5%. I'd like to schedule a short follow-up call to discuss adjusting your metformin dosage and reviewing your meal plan. Please book a telehealth slot through the portal.",
        time: "Mar 12, 2026 at 4:30 PM",
      },
    ],
  },
  {
    id: 3,
    patientName: "Emily Torres",
    subject: "Pre-op instructions clarification",
    preview: "Can I eat breakfast the morning before my procedure?",
    timestamp: "Mar 11, 2026 at 9:00 AM",
    unread: false,
    thread: [
      {
        sender: "Emily Torres",
        isPatient: true,
        content:
          "I have my colonoscopy scheduled for Thursday. The prep instructions say nothing after midnight, but can I take my blood pressure medication with a small sip of water in the morning?",
        time: "Mar 11, 2026 at 9:00 AM",
      },
      {
        sender: "Nurse Patricia Lee",
        isPatient: false,
        content:
          "Yes, you may take your blood pressure medication with a small sip of water the morning of the procedure. Please hold all other medications until after the procedure. Bring your medication list with you.",
        time: "Mar 11, 2026 at 9:45 AM",
      },
    ],
  },
];

const STAFF_MESSAGES_SEED = [
  {
    id: BigInt(1),
    fromUserId: BigInt(10),
    toUserId: BigInt(20),
    fromName: "Dr. Sarah Chen",
    toName: "Dr. James Rivera",
    content:
      "Please review Margaret Chen\u2019s latest ECG results \u2014 elevated ST segments in leads II, III, and aVF. May need cath consult today.",
    timestamp: "Mar 21, 2026 at 09:14 AM",
  },
  {
    id: BigInt(2),
    fromUserId: BigInt(20),
    toUserId: BigInt(10),
    fromName: "Dr. James Rivera",
    toName: "Dr. Sarah Chen",
    content:
      "Reviewed. Agree with cath consult. I'll place the order now. Keep her on aspirin and heparin drip in the meantime.",
    timestamp: "Mar 21, 2026 at 09:42 AM",
  },
  {
    id: BigInt(3),
    fromUserId: BigInt(11),
    toUserId: BigInt(10),
    fromName: "Nurse Thompson",
    toName: "Dr. Sarah Chen",
    content:
      "Robert Okonkwo\u2019s potassium came back at 3.1 mEq/L. Per standing orders, initiating KCl 40 mEq PO x2 doses. Will recheck in 4 hours.",
    timestamp: "Mar 21, 2026 at 10:05 AM",
  },
  {
    id: BigInt(4),
    fromUserId: BigInt(12),
    toUserId: BigInt(10),
    fromName: "Pharmacy \u2014 Carlos Mendez",
    toName: "Dr. Sarah Chen",
    content:
      "Drug interaction alert for Sophia Martinez: Levothyroxine + Calcium carbonate (antacid) may reduce absorption. Consider separating doses by 4 hours. Please confirm or adjust.",
    timestamp: "Mar 21, 2026 at 11:30 AM",
  },
  {
    id: BigInt(5),
    fromUserId: BigInt(13),
    toUserId: BigInt(10),
    fromName: "Lab \u2014 Amara Osei",
    toName: "Dr. Sarah Chen",
    content:
      "Critical value callback: David Kimani HbA1c 11.2% (ref: <5.7%). Specimen collected Mar 20, 2026. Please acknowledge.",
    timestamp: "Mar 21, 2026 at 12:18 PM",
  },
];

function PatientMessagesTab() {
  const { isDemoMode, demoActor } = useDemoMode();
  const { actor: realActor } = useActor();
  const actor = isDemoMode ? demoActor : realActor;
  const [selected, setSelected] = useState<number | null>(null);
  const [replyExpanded, setReplyExpanded] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [msgs, setMsgs] = useState(patientMessages);

  const selectedMsg = selected !== null ? msgs[selected] : null;

  const handleReply = () => {
    if (!replyText.trim()) return;
    if (selected === null) return;
    const msg = msgs[selected];
    setMsgs((prev) =>
      prev.map((m, i) =>
        i === selected
          ? {
              ...m,
              thread: [
                ...m.thread,
                {
                  sender: "Dr. Sarah Johnson",
                  isPatient: false,
                  content: replyText,
                  time: new Date().toLocaleString(),
                },
              ],
            }
          : m,
      ),
    );
    toast.success("Reply sent to patient");
    // Persist to backend (fire-and-forget)
    if (actor) {
      actor
        .sendMessage(BigInt(10), BigInt(msg?.id ?? 0), replyText)
        .catch(() => {});
    }
    setReplyText("");
    setReplyExpanded(false);
  };

  return (
    <div
      className="flex gap-0 border border-border bg-card"
      style={{ height: "calc(100vh - 20rem)" }}
    >
      {/* List */}
      <div className="w-72 border-r border-border flex flex-col flex-shrink-0">
        <div className="px-3 py-2 border-b border-border bg-muted/30">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Patient Messages
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {msgs.map((m, i) => (
            <button
              type="button"
              key={m.id}
              data-ocid={`patient-messages.item.${i + 1}`}
              onClick={() => {
                setSelected(i);
                setReplyExpanded(false);
              }}
              className={cn(
                "w-full text-left px-3 py-3 border-b border-border hover:bg-muted/40 transition-colors border-l-2",
                selected === i
                  ? "border-l-primary bg-primary/5"
                  : "border-l-transparent",
              )}
            >
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <p className="text-xs font-semibold text-foreground">
                    {m.patientName}
                  </p>
                </div>
                {m.unread && (
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                )}
              </div>
              <p className="text-xs font-medium text-foreground truncate">
                {m.subject}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {m.preview}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {m.timestamp}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedMsg ? (
          <>
            <div className="px-5 py-3 border-b border-border bg-muted/20 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-sm font-semibold">{selectedMsg.subject}</p>
                <p className="text-xs text-muted-foreground">
                  From: {selectedMsg.patientName}
                </p>
              </div>
              <StatusBadge
                variant={selectedMsg.unread ? "info" : "neutral"}
                label={selectedMsg.unread ? "Unread" : "Read"}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedMsg.thread.map((t) => (
                <div
                  key={`${t.sender}-${t.content.slice(0, 20)}`}
                  className={cn(
                    "flex",
                    t.isPatient ? "justify-start" : "justify-end",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-sm rounded p-3 text-sm",
                      t.isPatient
                        ? "bg-muted text-foreground"
                        : "bg-primary text-primary-foreground",
                    )}
                  >
                    <p className="text-xs font-semibold mb-1 opacity-70">
                      {t.sender} \u00b7 {t.time}
                    </p>
                    <p>{t.content}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Reply */}
            <div className="border-t border-border p-3">
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium"
                data-ocid="patient-messages.reply.toggle"
                onClick={() => setReplyExpanded(!replyExpanded)}
              >
                {replyExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
                {replyExpanded ? "Cancel Reply" : "Reply to Patient"}
              </button>
              {replyExpanded && (
                <div className="mt-2 space-y-2">
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    data-ocid="patient-messages.reply.textarea"
                    className="text-sm"
                  />
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleReply}
                    data-ocid="patient-messages.reply.submit_button"
                  >
                    Send Reply
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            className="flex-1 flex items-center justify-center"
            data-ocid="patient-messages.empty_state"
          >
            <div className="text-center space-y-2">
              <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                Select a patient message to view
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Messages() {
  type StaffMessage = {
    id: bigint;
    fromUserId: bigint;
    toUserId: bigint;
    content: string;
    fromName?: string;
    toName?: string;
    timestamp?: string;
    createdAt?: bigint;
  };

  const { isDemoMode, demoActor } = useDemoMode();
  const { actor: realActor } = useActor();
  const actor = isDemoMode ? demoActor : realActor;

  const [messages, setMessages] = useState<StaffMessage[]>(
    isDemoMode ? STAFF_MESSAGES_SEED : [],
  );
  const [loading, setLoading] = useState(!isDemoMode);
  const [selected, setSelected] = useState<number>(0);
  const [composeExpanded, setComposeExpanded] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ toUserId: "", content: "" });

  const { data: messagesData, isLoading: messagesLoading } = useMessages();

  useEffect(() => {
    if (isDemoMode) {
      setMessages(STAFF_MESSAGES_SEED);
      setLoading(false);
      return;
    }
    if (messagesData) {
      setMessages(
        (messagesData as StaffMessage[]).map((m) => ({
          ...m,
          timestamp: m.createdAt
            ? new Date(Number(m.createdAt) / 1_000_000).toLocaleString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                },
              )
            : undefined,
          fromName: undefined,
          toName: undefined,
        })),
      );
    }
    if (!messagesLoading) setLoading(false);
  }, [messagesData, messagesLoading, isDemoMode]);

  const handleSend = async () => {
    if (!form.toUserId || !form.content) {
      toast.error("Recipient and message required");
      return;
    }
    setSending(true);
    try {
      if (actor && !isDemoMode) {
        await actor.sendMessage(
          BigInt(10),
          BigInt(form.toUserId),
          form.content,
        );
      }
      const newMsg: StaffMessage = {
        id: BigInt(messages.length + 1),
        fromUserId: BigInt(10),
        toUserId: BigInt(form.toUserId),
        fromName: "Dr. Sarah Chen",
        toName: `User ${form.toUserId}`,
        content: form.content,
        timestamp: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
      setMessages((prev) => [...prev, newMsg]);
      toast.success("Message sent");
      setComposeExpanded(false);
      setForm({ toUserId: "", content: "" });
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const msg = messages[selected];

  return (
    <div className="space-y-4" data-ocid="messages.page">
      <Tabs defaultValue="staff">
        <div className="flex items-center justify-between mb-3">
          <TabsList className="h-8">
            <TabsTrigger
              value="staff"
              className="text-xs h-7"
              data-ocid="messages.staff.tab"
            >
              Staff Messages
            </TabsTrigger>
            <TabsTrigger
              value="patient"
              className="text-xs h-7"
              data-ocid="messages.patient.tab"
            >
              Patient Messages
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {patientMessages.filter((m) => m.unread).length}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="staff" className="mt-0">
          <div className="mb-3">
            <button
              type="button"
              data-ocid="messages.compose.button"
              onClick={() => setComposeExpanded(!composeExpanded)}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded"
            >
              <Plus className="w-3.5 h-3.5" />
              Compose
            </button>

            {composeExpanded && (
              <div
                className="mt-3 p-4 border border-border bg-card rounded space-y-3"
                data-ocid="messages.compose.panel"
              >
                <p className="text-sm font-medium">New Message</p>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    To (User ID)
                  </Label>
                  <Input
                    data-ocid="messages.to.input"
                    value={form.toUserId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, toUserId: e.target.value }))
                    }
                    placeholder="User ID"
                    className="mt-1 h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Message
                  </Label>
                  <Textarea
                    data-ocid="messages.content.textarea"
                    value={form.content}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, content: e.target.value }))
                    }
                    rows={3}
                    className="mt-1 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    data-ocid="messages.submit_button"
                    disabled={sending}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleSend}
                  >
                    {sending ? "Sending..." : "Send"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setComposeExpanded(false)}
                    data-ocid="messages.compose.cancel_button"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div
              className="border border-border bg-card"
              style={{ height: "calc(100vh - 22rem)" }}
              data-ocid="messages.loading_state"
            >
              <div className="p-4 space-y-3">
                {["sk1", "sk2", "sk3", "sk4", "sk5"].map((sk) => (
                  <div key={sk} className="flex gap-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="flex gap-0 border border-border bg-card"
              style={{ height: "calc(100vh - 22rem)" }}
            >
              {/* Inbox list */}
              <div className="w-72 border-r border-border flex flex-col flex-shrink-0">
                <div className="px-3 py-2 border-b border-border bg-muted/30">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Inbox
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {messages.length === 0 ? (
                    <div
                      className="flex items-center justify-center h-32"
                      data-ocid="messages.empty_state"
                    >
                      <p className="text-sm text-muted-foreground">
                        No messages
                      </p>
                    </div>
                  ) : (
                    messages.map((m, i) => (
                      <button
                        type="button"
                        key={String(m.id)}
                        data-ocid={`messages.item.${i + 1}`}
                        onClick={() => setSelected(i)}
                        className={cn(
                          "w-full text-left px-3 py-3 border-b border-border hover:bg-muted/40 transition-colors border-l-2",
                          selected === i
                            ? "border-l-primary bg-primary/5"
                            : "border-l-transparent",
                        )}
                      >
                        <p className="text-xs font-semibold text-foreground truncate">
                          {"fromName" in m && m.fromName
                            ? (m as { fromName: string }).fromName
                            : `User ${String(m.fromUserId)}`}
                        </p>
                        <p className="truncate text-sm text-foreground">
                          {m.content}
                        </p>
                        {"timestamp" in m && m.timestamp && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {(m as { timestamp: string }).timestamp}
                          </p>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Message body */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {msg ? (
                  <>
                    <div className="px-5 py-3 border-b border-border bg-muted/20 flex items-center gap-6 flex-shrink-0">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          From:{" "}
                        </span>
                        <span className="text-xs font-medium text-foreground">
                          {"fromName" in msg && msg.fromName
                            ? (msg as { fromName: string }).fromName
                            : `User ${String(msg.fromUserId)}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          To:{" "}
                        </span>
                        <span className="text-xs font-medium text-foreground">
                          {"toName" in msg && msg.toName
                            ? (msg as { toName: string }).toName
                            : `User ${String(msg.toUserId)}`}
                        </span>
                      </div>
                      {"timestamp" in msg && msg.timestamp && (
                        <div className="ml-auto">
                          <span className="text-xs text-muted-foreground">
                            {(msg as { timestamp: string }).timestamp}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 overflow-y-auto">
                      <p className="text-sm text-foreground leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  </>
                ) : (
                  <div
                    className="flex-1 flex items-center justify-center"
                    data-ocid="messages.empty_state"
                  >
                    <p className="text-sm text-muted-foreground">
                      Select a message to read
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="patient" className="mt-0">
          <PatientMessagesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
