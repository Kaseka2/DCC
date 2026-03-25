import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  helper,
  className,
}: {
  label: string;
  value: string;
  helper?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-[var(--surface)] p-5 shadow-[0_10px_24px_rgba(22,18,11,0.08)]",
        className
      )}
    >
      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {helper && <p className="mt-1 text-sm text-muted-foreground">{helper}</p>}
    </div>
  );
}
