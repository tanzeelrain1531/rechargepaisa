import { Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const WARN_DURATION_SECONDS = 2 * 60; // 2 minutes countdown

export default function SessionWarningBanner({
  onStay,
  onLogout,
}: {
  onStay: () => void;
  onLogout: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(WARN_DURATION_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSecondsLeft(WARN_DURATION_SECONDS);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onLogout();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onLogout]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(1, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-1.5 bg-destructive/10 border-b border-destructive/30 flex-shrink-0"
      data-ocid="session.warning.panel"
      role="alert"
    >
      <div className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
        <p className="text-xs font-semibold text-destructive">
          Your session will expire in{" "}
          <span className="font-bold font-mono">
            {mm}:{ss}
          </span>{" "}
          due to inactivity.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          data-ocid="session.stay.button"
          onClick={onStay}
          className="h-6 px-3 text-xs font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors rounded-sm"
        >
          Stay logged in
        </button>
        <button
          type="button"
          data-ocid="session.logout.button"
          onClick={onLogout}
          className="h-6 px-3 text-xs font-semibold border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors rounded-sm"
        >
          Logout now
        </button>
      </div>
    </div>
  );
}
