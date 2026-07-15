import { cn } from "@/lib/cn";

export interface MetricPanelProps {
  label: string;
  value: string;
  caption?: string;
  className?: string;
}

export function MetricPanel({ label, value, caption, className }: MetricPanelProps) {
  return (
    <div className={cn("bg-panel text-panel-text rounded-sm p-6", className)}>
      <p className="text-panel-text/60 text-xs font-medium tracking-widest uppercase">{label}</p>
      <p className="mt-2 text-4xl font-semibold tracking-tight tabular-nums">{value}</p>
      {caption && <p className="text-panel-text/70 mt-2 text-sm">{caption}</p>}
    </div>
  );
}
