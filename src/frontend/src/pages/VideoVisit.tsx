import { Button } from "@/components/ui/button";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  Wifi,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface VideoVisitProps {
  onBack: () => void;
  appointmentId?: bigint | null;
  patientName?: string;
  providerName?: string;
}

// Dark theme constants — intentional fixed values for dark-mode telehealth UI
const DARK = {
  bg: "hsl(230 15% 7%)",
  header: "hsl(230 15% 9%)",
  headerBorder: "hsl(230 12% 14%)",
  panelLg: "hsl(230 15% 11%)",
  panelSm: "hsl(230 12% 14%)",
  avatarRing: "hsl(220 15% 20%)",
  avatarFill: "hsl(230 12% 16%)",
  avatarFillSm: "hsl(210 15% 22%)",
  divider: "hsl(230 10% 18%)",
  controlsBg: "hsl(230 15% 9%)",
  labelBg: "rgba(0,0,0,0.85)",
  gradientLg:
    "linear-gradient(135deg, hsl(230 15% 12%) 0%, hsl(220 18% 16%) 50%, hsl(240 12% 11%) 100%)",
  gradientSm:
    "linear-gradient(135deg, hsl(210 12% 15%) 0%, hsl(200 14% 12%) 100%)",
};

function ControlButton({
  active,
  danger,
  onClick,
  label,
  ocid,
  children,
  large,
}: {
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
  label: string;
  ocid: string;
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 group"
      aria-label={label}
    >
      <div
        className={`${
          large ? "w-14 h-14" : "w-12 h-12"
        } rounded-full flex items-center justify-center transition-all duration-150 ${
          danger
            ? "bg-destructive hover:bg-destructive/90"
            : active
              ? "bg-primary/40 hover:bg-primary/60"
              : "bg-white/10 hover:bg-white/20"
        }`}
      >
        {children}
      </div>
      <span className="text-xs font-medium text-white/50 group-hover:text-white/70 transition-colors">
        {label}
      </span>
    </button>
  );
}

export default function VideoVisit({
  onBack,
  patientName = "Sarah Johnson",
  providerName = "Dr. Emily Carter",
}: VideoVisitProps) {
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState<"connecting" | "connected">(
    "connecting",
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const connectTimeout = setTimeout(() => setStatus("connected"), 1800);
    return () => clearTimeout(connectTimeout);
  }, []);

  useEffect(() => {
    if (status === "connected") {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // Escape key to end call
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleEnd();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleEnd = () => {
    toast.success("Video visit ended");
    onBack();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: DARK.bg }}
      data-ocid="videovisit.page"
    >
      {/* ── Header bar ── */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{
          background: DARK.header,
          borderColor: DARK.headerBorder,
        }}
      >
        <div className="flex items-center gap-3">
          {/* Connection status pill */}
          <div
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
              status === "connected"
                ? "bg-success/20 text-success"
                : "bg-warning/20 text-warning"
            }`}
          >
            <Wifi className="w-3 h-3" />
            {status === "connected" ? "Connected" : "Connecting..."}
          </div>
          {status === "connected" && (
            <span className="text-xs tabular-nums font-mono text-white/40">
              {formatDuration(seconds)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-white/40 uppercase">
            MedUnite Telehealth
          </span>
        </div>

        {/* Empty balanced spacer */}
        <div className="w-24" />
      </div>

      {/* ── Video panels ── */}
      <div className="flex-1 flex gap-3 p-4 min-h-0">
        {/* Provider video — large */}
        <div
          className="flex-1 rounded-lg flex items-center justify-center relative overflow-hidden"
          style={{ background: DARK.panelLg }}
          data-ocid="videovisit.canvas_target"
        >
          {!cameraOn ? (
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: DARK.avatarFill }}
              >
                <span className="text-2xl font-bold text-white/40">
                  {providerName.charAt(0)}
                </span>
              </div>
              <span className="text-sm text-white/40">Camera Off</span>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="absolute inset-0"
                style={{ background: DARK.gradientLg }}
              />
              <div className="relative flex flex-col items-center gap-3">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ background: DARK.avatarRing }}
                >
                  <span className="text-3xl font-bold text-white/60">
                    {providerName.charAt(3)}
                  </span>
                </div>
              </div>
            </div>
          )}
          {/* Provider name label */}
          <div
            className="absolute bottom-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-sm text-white/90"
            style={{
              background: DARK.labelBg,
              backdropFilter: "blur(8px)",
            }}
          >
            {providerName}
          </div>
        </div>

        {/* Patient video — small PiP in corner */}
        <div
          className="w-48 h-36 rounded-lg flex items-center justify-center relative overflow-hidden flex-shrink-0 self-start ring-1 ring-white/10"
          style={{ background: DARK.panelSm }}
        >
          <div className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{ background: DARK.gradientSm }}
            />
          </div>
          <div className="relative">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: DARK.avatarFillSm }}
            >
              <span className="text-xl font-bold text-white/60">
                {patientName.charAt(0)}
              </span>
            </div>
          </div>
          <div
            className="absolute bottom-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-sm text-white/85"
            style={{ background: DARK.labelBg }}
          >
            {patientName}
          </div>
        </div>
      </div>

      {/* ── Controls bar ── */}
      <div
        className="flex items-center justify-center gap-5 py-5 border-t"
        style={{
          background: DARK.controlsBg,
          borderColor: DARK.headerBorder,
        }}
        data-ocid="videovisit.panel"
      >
        <ControlButton
          ocid="videovisit.toggle"
          active={muted}
          onClick={() => setMuted((m) => !m)}
          label={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <MicOff className="w-5 h-5 text-white" />
          ) : (
            <Mic className="w-5 h-5 text-white/70" />
          )}
        </ControlButton>

        <ControlButton
          ocid="videovisit.secondary_button"
          active={!cameraOn}
          onClick={() => setCameraOn((c) => !c)}
          label={cameraOn ? "Stop Cam" : "Start Cam"}
        >
          {cameraOn ? (
            <Camera className="w-5 h-5 text-white/70" />
          ) : (
            <CameraOff className="w-5 h-5 text-white" />
          )}
        </ControlButton>

        <ControlButton
          ocid="videovisit.screen_share.toggle"
          active={screenShare}
          onClick={() => {
            setScreenShare((s) => !s);
            toast.success(
              screenShare ? "Screen sharing stopped" : "Screen sharing started",
            );
          }}
          label={screenShare ? "Stop Share" : "Share Screen"}
        >
          {screenShare ? (
            <MonitorOff className="w-5 h-5 text-primary" />
          ) : (
            <Monitor className="w-5 h-5 text-white/70" />
          )}
        </ControlButton>

        {/* Divider */}
        <div className="w-px h-10" style={{ background: DARK.divider }} />

        <ControlButton
          ocid="videovisit.delete_button"
          danger
          large
          onClick={handleEnd}
          label="End Call"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </ControlButton>
      </div>
    </div>
  );
}
