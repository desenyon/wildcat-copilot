"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ConfirmDialog, Panel } from "@/components/design-system";
import { deleteOwnAccountAction } from "@/lib/auth/actions";

export function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Panel className="border-danger/40">
      <h2 className="text-ink text-sm font-semibold">Delete account</h2>
      <p className="text-muted mt-1 text-sm">
        Permanently deletes your account and every course, document, and artifact you own. This
        cannot be undone.
      </p>
      <Button variant="danger" size="sm" className="mt-4" onClick={() => setOpen(true)}>
        Delete my account…
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete your account?"
        description="This permanently removes your account and everything you own. This cannot be undone."
        confirmLabel="Delete account"
        destructive
        onConfirm={() => {
          void deleteOwnAccountAction().then(() => router.push("/"));
        }}
      />
    </Panel>
  );
}
