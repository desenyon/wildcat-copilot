import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-rule bg-canvas rounded-sm border p-6", className)} {...props} />
  );
}

export function DarkPanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-panel text-panel-text rounded-sm p-6", className)} {...props} />;
}
