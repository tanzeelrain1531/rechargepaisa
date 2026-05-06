import { useEffect, useRef } from "react";

const WARN_AFTER_MS = 28 * 60 * 1000; // 28 minutes
const TIMEOUT_AFTER_MS = 30 * 60 * 1000; // 30 minutes

export function useSessionTimeout({
  onWarn,
  onTimeout,
}: {
  onWarn: () => void;
  onTimeout: () => void;
}) {
  const warnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onWarnRef = useRef(onWarn);
  const onTimeoutRef = useRef(onTimeout);

  // Keep refs current without re-registering listeners
  useEffect(() => {
    onWarnRef.current = onWarn;
  });
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  });

  useEffect(() => {
    const reset = () => {
      if (warnTimerRef.current) clearTimeout(warnTimerRef.current);
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
      warnTimerRef.current = setTimeout(() => {
        onWarnRef.current();
      }, WARN_AFTER_MS);
      timeoutTimerRef.current = setTimeout(() => {
        onTimeoutRef.current();
      }, TIMEOUT_AFTER_MS);
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ] as const;
    for (const evt of events) {
      document.addEventListener(evt, reset, { passive: true });
    }

    // Start timers initially
    reset();

    return () => {
      for (const evt of events) {
        document.removeEventListener(evt, reset);
      }
      if (warnTimerRef.current) clearTimeout(warnTimerRef.current);
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    };
  }, []);

  // Expose a manual reset function
  const resetTimers = () => {
    // Trigger a synthetic activity event to reset
    document.dispatchEvent(new Event("mousemove"));
  };

  return { resetTimers };
}
