"use client";

import { useState } from "react";
import { Button, ConfirmDialog, Dialog, Input, Table } from "@/components/design-system";
import {
  changeDocumentType,
  deleteDocument,
  getDocumentPreviewAction,
  renameDocument,
  reprocessDocument,
} from "@/lib/documents/actions";
import type { DocumentType } from "@/lib/documents/classify";

export interface DocumentListRow {
  id: string;
  title: string;
  documentType: DocumentType;
  documentTypeConfidence: number | null;
  processingStatus: "pending" | "processing" | "processed" | "failed";
  processingErrorCode: string | null;
  createdAt: Date;
}

const STATUS_LABEL: Record<DocumentListRow["processingStatus"], string> = {
  pending: "Pending",
  processing: "Processing…",
  processed: "Processed",
  failed: "Failed",
};

const STATUS_COLOR: Record<DocumentListRow["processingStatus"], string> = {
  pending: "text-muted",
  processing: "text-accent",
  processed: "text-success",
  failed: "text-danger",
};

const DOCUMENT_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
  { value: "syllabus", label: "Syllabus" },
  { value: "assignment", label: "Assignment" },
  { value: "rubric", label: "Rubric" },
  { value: "lesson_plan", label: "Lesson plan" },
  { value: "slide_deck", label: "Slide deck" },
  { value: "reading", label: "Reading" },
  { value: "assessment", label: "Assessment" },
  { value: "department_standard", label: "Department standard" },
  { value: "other", label: "Other" },
];

export function DocumentList({ documents }: { documents: DocumentListRow[] }) {
  const [search, setSearch] = useState("");
  const [renameTarget, setRenameTarget] = useState<DocumentListRow | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<DocumentListRow | null>(null);
  const [previewTarget, setPreviewTarget] = useState<DocumentListRow | null>(null);
  const [previewText, setPreviewText] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);

  const filtered = documents.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));

  async function openPreview(row: DocumentListRow) {
    setPreviewTarget(row);
    setPreviewLoading(true);
    setPreviewText("");
    try {
      const text = await getDocumentPreviewAction(row.id);
      setPreviewText(text || "No extracted text yet.");
    } finally {
      setPreviewLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Search documents"
        placeholder="Filter by title…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

      <Table
        caption="Course documents"
        rowKey={(row) => row.id}
        rows={filtered}
        columns={[
          {
            key: "title",
            header: "Title",
            render: (row) => (
              <button
                type="button"
                className="text-ink text-left hover:underline"
                onClick={() => void openPreview(row)}
              >
                {row.title}
              </button>
            ),
          },
          {
            key: "type",
            header: "Type",
            render: (row) => (
              <select
                value={row.documentType}
                onChange={(e) => void changeDocumentType(row.id, e.target.value as DocumentType)}
                className="border-rule bg-canvas text-ink h-8 rounded-sm border px-2 text-xs"
                aria-label={`Document type for ${row.title}`}
              >
                {DOCUMENT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (row) => (
              <span
                className={STATUS_COLOR[row.processingStatus]}
                title={row.processingErrorCode ?? undefined}
              >
                {STATUS_LABEL[row.processingStatus]}
              </span>
            ),
          },
          {
            key: "uploaded",
            header: "Uploaded",
            render: (row) =>
              new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(row.createdAt),
          },
          {
            key: "actions",
            header: "",
            render: (row) => (
              <div className="flex justify-end gap-2">
                {(row.processingStatus === "processed" || row.processingStatus === "failed") && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => void reprocessDocument(row.id)}
                  >
                    Reprocess
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRenameTarget(row);
                    setRenameValue(row.title);
                  }}
                >
                  Rename
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTarget(row)}
                >
                  Remove
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Dialog
        open={renameTarget !== null}
        onOpenChange={(open) => !open && setRenameTarget(null)}
        title="Rename document"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRenameTarget(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (renameTarget) void renameDocument(renameTarget.id, renameValue);
                setRenameTarget(null);
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <Input
          label="Title"
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          autoFocus
        />
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={deleteTarget ? `Remove "${deleteTarget.title}"?` : "Remove document?"}
        description="This permanently removes the file and its extracted content. This cannot be undone."
        confirmLabel="Remove"
        destructive
        onConfirm={() => {
          if (deleteTarget) void deleteDocument(deleteTarget.id);
        }}
      />

      <Dialog
        open={previewTarget !== null}
        onOpenChange={(open) => !open && setPreviewTarget(null)}
        title={previewTarget ? previewTarget.title : "Preview"}
      >
        {previewLoading ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : (
          <pre className="text-ink max-h-96 overflow-y-auto text-sm whitespace-pre-wrap">
            {previewText}
          </pre>
        )}
      </Dialog>
    </div>
  );
}
