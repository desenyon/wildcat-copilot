import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface EvidencePanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function EvidencePanel({ title = "Evidence", children, className }: EvidencePanelProps) {
  return (
    <aside
      aria-label={title}
      className={cn(
        "border-rule bg-canvas flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-l p-4",
        className,
      )}
    >
      <h2 className="text-muted text-xs font-semibold tracking-widest uppercase">{title}</h2>
      {children}
    </aside>
  );
}
