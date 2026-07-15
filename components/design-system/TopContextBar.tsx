import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SaveState = "saved" | "saving" | "error" | "idle";

const saveStateLabel: Record<SaveState, string> = {
  saved: "All changes saved",
  saving: "Saving…",
  error: "Save failed",
  idle: "",
};

const saveStateColor: Record<SaveState, string> = {
  saved: "text-success",
  saving: "text-muted",
  error: "text-danger",
  idle: "text-muted",
};

export interface TopContextBarProps {
  courseSwitcher: ReactNode;
  currentTask?: string;
  saveState?: SaveState;
  actions?: ReactNode;
  className?: string;
}

export function TopContextBar({
  courseSwitcher,
  currentTask,
  saveState = "idle",
  actions,
  className,
}: TopContextBarProps) {
  return (
    <div
      className={cn(
        "border-rule bg-canvas flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="w-40 min-w-0 sm:w-56">{courseSwitcher}</div>
        {currentTask && (
          <p className="text-muted hidden truncate text-sm sm:block">{currentTask}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {saveState !== "idle" && (
          <p role="status" className={cn("text-xs", saveStateColor[saveState])}>
            {saveStateLabel[saveState]}
          </p>
        )}
        {actions}
      </div>
    </div>
  );
}
