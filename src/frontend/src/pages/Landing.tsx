import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, ShieldCheck, Stethoscope } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

interface LandingProps {
  onSignIn: () => void;
  onTryDemo: () => void;
  onPatientPortal: () => void;
}

// ── Design constants (no hardcoded oklch) ─────────────────────────────────────
const BRAND_DARK_HEX = "#1a2744";
const BRAND_DARK2_HEX = "#1e2d4a";
const BRAND_GRADIENT = "linear-gradient(90deg, #2563eb, #4f46e5, #2563eb)";

// ── ECG Canvas Animation ──────────────────────────────────────────────────────
function ECGCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let offset = 0;
    const W = canvas.width;
    const H = canvas.height;
    const mid = H / 2;
    const speed = 1.5;

    function ecgY(x: number): number {
      const t = ((x % 120) + 120) % 120;
      if (t < 10) return mid + Math.sin((t / 10) * Math.PI) * 4;
      if (t < 20) return mid;
      if (t < 25) return mid - Math.sin(((t - 20) / 5) * Math.PI) * 6;
      if (t < 28) return mid + 28;
      if (t < 32) return mid - 36;
      if (t < 36) return mid + 28;
      if (t < 40) return mid;
      if (t < 60) return mid - Math.sin(((t - 40) / 20) * Math.PI) * 6;
      return mid;
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      ctx!.strokeStyle = "rgba(99,190,155,0.08)";
      ctx!.lineWidth = 0.5;
      for (let x = 0; x < W; x += 20) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, H);
        ctx!.stroke();
      }
      for (let y = 0; y < H; y += 10) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(W, y);
        ctx!.stroke();
      }
      ctx!.shadowColor = "rgba(99,190,155,0.7)";
      ctx!.shadowBlur = 6;
      ctx!.strokeStyle = "rgba(99,190,155,0.9)";
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      for (let i = 0; i <= W; i++) {
        const y = ecgY(i - offset);
        if (i === 0) ctx!.moveTo(i, y);
        else ctx!.lineTo(i, y);
      }
      ctx!.stroke();
      ctx!.shadowBlur = 0;
      offset += speed;
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={60}
      className="w-full h-full"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

// ── Typewriter Effect ─────────────────────────────────────────────────────────
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      el.textContent = text;
      return;
    }
    el.textContent = "";
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        el.textContent = text.slice(0, i + 1);
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 35);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span ref={elRef} />;
}

// ── Count-Up Chip ─────────────────────────────────────────────────────────────
function CountChip({
  value,
  label,
  delay = 0,
}: { value: number; label: string; delay?: number }) {
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const start = performance.now();
    const duration = 1200;
    const timeout = setTimeout(() => {
      function step(now: number) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        el!.textContent = String(Math.round(eased * value));
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10">
      <span ref={elRef} className="text-sm font-bold text-white tabular-nums">
        0
      </span>
      <span className="text-xs text-white/70">{label}</span>
    </div>
  );
}

// ── Hero Animation Panel ──────────────────────────────────────────────────────
function HeroVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 60% 50%, rgba(99,190,155,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-sm space-y-3">
        {/* Patient card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-lg p-3.5 border"
          style={{
            background: "rgba(255,255,255,0.05)",
            borderColor: "rgba(255,255,255,0.12)",
          }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "var(--primary)" }}
              >
                MC
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-none">
                  Catherine Lee
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  MRN-002 · 58 yrs · F
                </p>
              </div>
            </div>
            <div className="px-2 py-0.5 rounded-sm text-xs font-semibold bg-danger/20 text-danger">
              Critical
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "BP", value: "158/95" },
              { label: "HR", value: "88 bpm" },
              { label: "SpO₂", value: "97%" },
            ].map((v) => (
              <div
                key={v.label}
                className="rounded p-1.5 text-center"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <p
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {v.label}
                </p>
                <p className="text-xs font-semibold text-white mt-0.5">
                  {v.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ECG Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-lg p-3 border"
          style={{
            background: "rgba(0,0,0,0.3)",
            borderColor: "rgba(99,190,155,0.2)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "rgba(99,190,155,0.9)" }}
            >
              Live ECG
            </p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span
                className="text-xs"
                style={{ color: "rgba(99,190,155,0.7)" }}
              >
                Normal Sinus
              </span>
            </div>
          </div>
          <div className="h-[60px]">
            <ECGCanvas />
          </div>
        </motion.div>

        {/* SOAP Note card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="rounded-lg p-3.5 border"
          style={{
            background: "rgba(255,255,255,0.05)",
            borderColor: "rgba(255,255,255,0.12)",
          }}
        >
          <p
            className="text-xs uppercase tracking-wider font-semibold mb-1.5"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            SOAP Note
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            <span
              className="font-semibold"
              style={{ color: "rgba(99,190,155,0.9)" }}
            >
              S:{" "}
            </span>
            <TypewriterText
              text="Chest pain, exertional onset, 3/10 severity..."
              delay={600}
            />
          </p>
        </motion.div>

        {/* Stat chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex flex-wrap gap-2"
        >
          <CountChip value={98} label="Patients" delay={600} />
          <CountChip value={12} label="Pending Orders" delay={800} />
          <CountChip value={3} label="Critical Labs" delay={1000} />
        </motion.div>
      </div>
    </div>
  );
}

// ── Main Landing Page ─────────────────────────────────────────────────────────
export default function Landing({
  onSignIn,
  onTryDemo,
  onPatientPortal,
}: LandingProps) {
  return (
    <div
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      {/* ── Section 1: Hero ─────────────────────────────────────── */}
      <section
        style={{
          height: "100vh",
          scrollSnapAlign: "start",
          overflow: "hidden",
          position: "relative",
          background: BRAND_DARK_HEX,
        }}
      >
        {/* Grid pattern overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        {/* Radial glow top-right */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,190,155,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="relative h-full flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-10 pt-8 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-sm flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: "var(--primary)" }}
              >
                M
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                MedUnite
              </span>
            </div>
            <button
              type="button"
              onClick={onSignIn}
              className="text-sm font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.6)" }}
              data-ocid="landing.signin.link"
            >
              Sign In →
            </button>
          </div>

          {/* Main split layout */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[55%_45%] px-10">
            {/* Left: content */}
            <div className="flex flex-col justify-center gap-6 py-12 max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 border"
                  style={{
                    background: "rgba(99,190,155,0.15)",
                    borderColor: "rgba(99,190,155,0.3)",
                    color: "rgba(99,190,155,0.9)",
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Enterprise EHR Platform
                </div>

                <h1
                  className="text-5xl xl:text-6xl font-bold leading-tight text-white"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Healthcare management built for how clinicians{" "}
                  <span style={{ color: "rgba(99,190,155,0.9)" }}>
                    actually work
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-base leading-relaxed max-w-md"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Unify patient records, clinical workflows, pharmacy, billing,
                and reporting in one role-based platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <button
                  type="button"
                  data-ocid="landing.try_demo.primary_button"
                  onClick={onTryDemo}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{
                    background: "white",
                    color: BRAND_DARK_HEX,
                  }}
                >
                  Try Demo — No login required
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  data-ocid="landing.signin.button"
                  onClick={onSignIn}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded font-semibold text-sm border transition-all hover:bg-white/10 active:scale-95"
                  style={{
                    borderColor: "rgba(255,255,255,0.3)",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  Sign In
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.45 }}
              >
                <button
                  type="button"
                  data-ocid="landing.patient_portal.link"
                  onClick={onPatientPortal}
                  className="text-sm transition-colors hover:underline"
                  style={{ color: "rgba(99,190,155,0.8)" }}
                >
                  Patient Portal →
                </button>
              </motion.div>
            </div>

            {/* Right: animated visual (hidden on mobile) */}
            <div className="hidden lg:flex items-center justify-center">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Features ─────────────────────────────────── */}
      <section
        style={{
          height: "100vh",
          scrollSnapAlign: "start",
          overflow: "hidden",
          background: "var(--background)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Subtle top border accent */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: BRAND_GRADIENT,
          }}
        />

        <div className="w-full max-w-4xl px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-primary">
              Why MedUnite
            </p>
            <h2
              className="text-3xl font-bold text-foreground mb-12"
              style={{ letterSpacing: "-0.02em" }}
            >
              Everything your team needs,{" "}
              <span className="text-muted-foreground font-medium">
                nothing they don't
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Stethoscope,
                iconBgClass: "bg-primary/10",
                iconColorClass: "text-primary",
                title: "Clinical clarity",
                desc: "One unified chart. Every provider sees the same complete picture — meds, labs, notes, and alerts.",
                delay: 0.1,
              },
              {
                icon: ShieldCheck,
                iconBgClass: "bg-success/10",
                iconColorClass: "text-success",
                title: "Built-in safety",
                desc: "Drug interaction checks, allergy alerts, and care gap reminders catch issues before they reach the patient.",
                delay: 0.2,
              },
              {
                icon: BarChart3,
                iconBgClass: "bg-primary/15",
                iconColorClass: "text-primary",
                title: "Smarter decisions",
                desc: "Real-time analytics and population health views turn clinical data into actionable insights.",
                delay: 0.3,
              },
            ].map(
              ({
                icon: Icon,
                iconBgClass,
                iconColorClass,
                title,
                desc,
                delay,
              }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay }}
                  viewport={{ once: true }}
                  className="rounded-lg p-6 text-left border bg-card"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className={`w-10 h-10 rounded-md flex items-center justify-center mb-4 ${iconBgClass}`}
                  >
                    <Icon className={`w-5 h-5 ${iconColorClass}`} />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {desc}
                  </p>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── Section 3: Final CTA ─────────────────────────────────── */}
      <section
        style={{
          height: "100vh",
          scrollSnapAlign: "start",
          overflow: "hidden",
          background: BRAND_DARK2_HEX,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0",
          position: "relative",
          textAlign: "center",
        }}
      >
        {/* Grid pattern */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />

        {/* Glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(99,190,155,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="relative px-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "rgba(99,190,155,0.7)" }}
            >
              Live Demo
            </p>

            <h2
              className="text-5xl font-bold text-white leading-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              Ready to see MedUnite{" "}
              <span style={{ color: "rgba(99,190,155,0.9)" }}>in action?</span>
            </h2>

            <p
              className="text-base leading-relaxed"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Explore every module — no login, no setup. The full platform, live
              in your browser.
            </p>

            <button
              type="button"
              data-ocid="landing.cta.primary_button"
              onClick={onTryDemo}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
              style={{
                background: "white",
                color: BRAND_DARK_HEX,
              }}
            >
              Try the Demo
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs pt-2 text-white/30">
              For demonstration purposes only. Not for clinical use.
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center h-10 border-t"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} MedUnite Health Systems
          </p>
        </div>
      </section>
    </div>
  );
}
