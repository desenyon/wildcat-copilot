import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type NoticeVariant = "info" | "success" | "warning" | "danger";

export interface NoticeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: NoticeVariant;
  title: string;
}

const variantStyles: Record<NoticeVariant, string> = {
  info: "border-rule text-ink",
  success: "border-success text-success",
  warning: "border-warning text-warning",
  danger: "border-danger text-danger",
};

export function Notice({ variant = "info", title, className, children, ...props }: NoticeProps) {
  return (
    <div
      role={variant === "danger" || variant === "warning" ? "alert" : "status"}
      className={cn(
        "bg-canvas rounded-sm border-l-4 px-4 py-3 text-sm",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      <p className="font-medium">{title}</p>
      {children && <div className="text-muted mt-1">{children}</div>}
    </div>
  );
}

export function InlineError({ message }: { message: string }) {
  return (
    <p role="alert" className="text-danger text-sm">
      {message}
    </p>
  );
}
