interface StatusBadgeProps {
  variant: "success" | "warning" | "danger" | "info" | "neutral" | "critical";
  label: string;
}

const variantClasses: Record<StatusBadgeProps["variant"], string> = {
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-danger/10 text-danger border-danger/30",
  info: "bg-primary/10 text-primary border-primary/20",
  neutral: "bg-muted text-muted-foreground border-border",
  critical: "bg-danger text-danger-foreground border-danger",
};

export function StatusBadge({ variant, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm border ${
        variantClasses[variant]
      }`}
    >
      {label}
    </span>
  );
}
