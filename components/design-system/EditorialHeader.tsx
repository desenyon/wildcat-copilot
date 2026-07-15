import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface EditorialHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function EditorialHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: EditorialHeaderProps) {
  return (
    <header
      className={cn(
        "border-rule flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        {eyebrow && (
          <p className="text-accent text-xs font-semibold tracking-widest uppercase">{eyebrow}</p>
        )}
        <h1 className="text-ink mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="text-muted mt-2 max-w-2xl text-sm">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </header>
  );
}
