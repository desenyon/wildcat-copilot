"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

export function Dialog({ open, onOpenChange, title, description, children, footer }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="bg-ink/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in fixed inset-0 z-40" />
        <RadixDialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
            "border-rule bg-canvas rounded-sm border p-6 shadow-lg focus:outline-none",
          )}
        >
          <RadixDialog.Title className="text-ink text-lg font-semibold">{title}</RadixDialog.Title>
          {description && (
            <RadixDialog.Description className="text-muted mt-1 text-sm">
              {description}
            </RadixDialog.Description>
          )}
          {children && <div className="mt-4">{children}</div>}
          {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
          <RadixDialog.Close
            aria-label="Close dialog"
            className="text-muted hover:text-ink focus-visible:ring-accent absolute top-4 right-4 rounded-sm p-1 focus-visible:ring-2 focus-visible:outline-none"
          >
            ✕
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
