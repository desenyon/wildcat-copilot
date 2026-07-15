import { type SelectHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  hint?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, hint, error, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const hintId = hint ? `${selectId}-hint` : undefined;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={selectId} className="text-ink text-sm font-medium">
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          aria-describedby={cn(hintId, errorId) || undefined}
          aria-invalid={!!error}
          className={cn(
            "border-rule bg-canvas text-ink h-10 rounded-sm border px-3 text-sm",
            "focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none",
            error && "border-danger",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
Select.displayName = "Select";
