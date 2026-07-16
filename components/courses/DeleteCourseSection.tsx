"use client";

import { useState } from "react";
import { Button, ConfirmDialog, Panel } from "@/components/design-system";
import { deleteCourseAction } from "@/lib/courses/actions";

export function DeleteCourseSection({
  courseId,
  courseName,
}: {
  courseId: string;
  courseName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Panel className="border-danger/40">
      <h2 className="text-ink text-sm font-semibold">Delete course</h2>
      <p className="text-muted mt-1 text-sm">
        Permanently deletes &quot;{courseName}&quot; and every document, artifact, and generated
        pack that belongs to it. This cannot be undone.
      </p>
      <Button variant="danger" size="sm" className="mt-4" onClick={() => setOpen(true)}>
        Delete course…
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Delete "${courseName}"?`}
        description="This permanently removes the course and everything in it. This cannot be undone."
        confirmLabel="Delete course"
        destructive
        onConfirm={() => {
          void deleteCourseAction(courseId);
        }}
      />
    </Panel>
  );
}
