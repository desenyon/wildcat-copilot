import { type ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="border-rule flex flex-col items-center gap-3 rounded-sm border border-dashed px-6 py-16 text-center">
      <p className="text-ink text-base font-medium">{title}</p>
      {description && <p className="text-muted max-w-md text-sm">{description}</p>}
      {action}
    </div>
  );
}
