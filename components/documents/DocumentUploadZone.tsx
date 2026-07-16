"use client";

import { useRef, useState } from "react";
import { Button, Notice } from "@/components/design-system";
import { requestDocumentUpload, markDocumentUploadFailed } from "@/lib/documents/actions";
import { suggestDocumentType, type DocumentType } from "@/lib/documents/classify";
import { MAX_UPLOAD_BYTES } from "@/lib/documents/storage/types";

const ACCEPT = ".pdf,.docx,.pptx,.txt,.md";

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

interface UploadItem {
  id: string;
  file: File;
  documentType: DocumentType;
  status: "queued" | "uploading" | "done" | "error";
  progress: number;
  documentId?: string;
  uploadUrl?: string;
  error?: string;
}

function uploadWithProgress(url: string, file: File, onProgress: (pct: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });
}

export function DocumentUploadZone({ courseId }: { courseId: string }) {
  const [confirmed, setConfirmed] = useState(false);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadOne(item: UploadItem) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, status: "uploading", progress: 0, error: undefined } : i,
      ),
    );

    try {
      let documentId = item.documentId;
      let uploadUrl = item.uploadUrl;

      if (!documentId || !uploadUrl) {
        const ticket = await requestDocumentUpload({
          courseId,
          filename: item.file.name,
          // Runtime-validated against the allowed list server-side (Zod);
          // File.type is an untyped string in the DOM lib.
          mimeType: item.file.type as Parameters<typeof requestDocumentUpload>[0]["mimeType"],
          sizeBytes: item.file.size,
          documentType: item.documentType,
          confirmedNoStudentData: true,
        });
        documentId = ticket.documentId;
        uploadUrl = ticket.uploadUrl;
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, documentId, uploadUrl } : i)),
        );
      }

      await uploadWithProgress(uploadUrl, item.file, (pct) => {
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, progress: pct } : i)));
      });

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "done", progress: 100 } : i)),
      );
    } catch (error) {
      if (item.documentId) void markDocumentUploadFailed(item.documentId);
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                status: "error",
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : i,
        ),
      );
    }
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const newItems: UploadItem[] = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      documentType: suggestDocumentType(file.name).documentType,
      status: "queued",
      progress: 0,
    }));
    setItems((prev) => [...prev, ...newItems]);
    for (const item of newItems) void uploadOne(item);
  }

  return (
    <div className="flex flex-col gap-4">
      <Notice variant="warning" title="No identifiable student data">
        Only upload your own course materials — syllabi, assignments, rubrics, lesson plans. Do not
        upload files containing student names, grades tied to names, or other identifiable student
        information.
      </Notice>

      <label className="text-ink flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="border-rule accent-accent mt-1 h-4 w-4 rounded-sm"
        />
        <span>I confirm these files do not contain identifiable student data.</span>
      </label>

      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragActive ? "border-accent bg-accent/5" : "border-rule"
        } ${confirmed ? "" : "opacity-50"}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (confirmed) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (confirmed) addFiles(e.dataTransfer.files);
        }}
      >
        <p className="text-ink text-sm">Drag and drop files here, or</p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!confirmed}
          onClick={() => inputRef.current?.click()}
        >
          Choose files
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="hidden"
          disabled={!confirmed}
          onChange={(e) => addFiles(e.target.files)}
        />
        <p className="text-muted mt-2 text-xs">
          Allowed: PDF, DOCX, PPTX, plain text, Markdown. Up to{" "}
          {Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}
          MB per file. We&apos;ll suggest a document type per file — change it if we guessed wrong.
        </p>
      </div>

      {items.length > 0 && (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="border-rule bg-canvas flex items-center justify-between gap-3 rounded-sm border px-3 py-2 text-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="text-ink truncate">{item.file.name}</p>
                {item.status === "uploading" && (
                  <div className="bg-rule mt-1 h-1 w-full overflow-hidden rounded-full">
                    <div
                      className="bg-accent h-full transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
                {item.status === "error" && (
                  <p className="text-danger mt-1 text-xs">{item.error}</p>
                )}
              </div>
              {item.status === "queued" || item.status === "uploading" ? (
                <select
                  value={item.documentType}
                  disabled={item.status === "uploading"}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((i) =>
                        i.id === item.id
                          ? { ...i, documentType: e.target.value as DocumentType }
                          : i,
                      ),
                    )
                  }
                  className="border-rule bg-canvas text-ink h-8 shrink-0 rounded-sm border px-2 text-xs"
                >
                  {DOCUMENT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : null}
              {item.status === "done" && (
                <span className="text-success shrink-0 text-xs">Uploaded</span>
              )}
              {item.status === "error" && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => void uploadOne(item)}
                >
                  Retry
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
