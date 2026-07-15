import { type InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-ink text-sm font-medium">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-describedby={cn(hintId, errorId) || undefined}
          aria-invalid={!!error}
          className={cn(
            "border-rule bg-canvas text-ink placeholder:text-muted h-10 rounded-sm border px-3 text-sm",
            "focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none",
            error && "border-danger",
            className,
          )}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="text-muted text-xs">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-danger text-xs">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
