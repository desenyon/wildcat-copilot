"use client";

import { useState, useTransition } from "react";
import { Button, Dialog, Notice } from "@/components/design-system";
import {
  synthesizeCourseProfileAction,
  updateCourseProfileFieldAction,
  type ProfileFieldKey,
} from "@/lib/course-profile/actions";

export interface CourseProfileData {
  courseId: string;
  learningObjectives: unknown;
  instructionStyle: unknown;
  assignmentPatterns: unknown;
  rubricPatterns: unknown;
  communicationTone: unknown;
  difficultyProfile: unknown;
  formatPreferences: unknown;
  confidenceByField: Record<string, number> | null;
  sourceDocumentIds: Record<string, string[]> | null;
  version: number;
  documentTitleById: Record<string, string>;
}

const FIELD_LABELS: Record<ProfileFieldKey, string> = {
  learningObjectives: "Learning objectives",
  instructionStyle: "Instruction style & vocabulary",
  assignmentPatterns: "Assignment patterns",
  rubricPatterns: "Rubric patterns",
  communicationTone: "Communication tone",
  difficultyProfile: "Difficulty profile",
  formatPreferences: "Format preferences",
};

const FIELD_ORDER: ProfileFieldKey[] = [
  "learningObjectives",
  "instructionStyle",
  "assignmentPatterns",
  "rubricPatterns",
  "communicationTone",
  "difficultyProfile",
  "formatPreferences",
];

function confidenceLabel(confidence: number | undefined): { text: string; className: string } {
  if (confidence === undefined || confidence === 0) {
    return { text: "Not yet observed", className: "text-muted" };
  }
  if (confidence >= 1) return { text: "Teacher confirmed", className: "text-success" };
  if (confidence >= 0.6) return { text: "Medium confidence", className: "text-ink" };
  return { text: "Low confidence", className: "text-warning" };
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (Array.isArray(value)) {
    return value.length === 0 ? "—" : value.map((v) => `• ${String(v)}`).join("\n");
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "—";
    return entries
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") || "—" : String(v)}`)
      .join("\n");
  }
  return String(value);
}

export function CourseProfileView({ profile }: { profile: CourseProfileData | null }) {
  const [isPending, startTransition] = useTransition();
  const [editField, setEditField] = useState<ProfileFieldKey | null>(null);
  const [editText, setEditText] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  function openEdit(field: ProfileFieldKey) {
    const current = profile ? (profile as unknown as Record<string, unknown>)[field] : null;
    setEditField(field);
    setEditText(JSON.stringify(current ?? null, null, 2));
    setEditError(null);
  }

  function saveEdit() {
    if (!editField || !profile) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(editText);
    } catch {
      setEditError("Not valid JSON — check the formatting and try again.");
      return;
    }
    setEditError(null);
    startTransition(() => {
      void updateCourseProfileFieldAction(profile.courseId, editField, parsed).then(() => {
        setEditField(null);
      });
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-muted text-sm">
          {profile ? `Version ${profile.version}` : "No profile synthesized yet"}
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isPending}
          onClick={() => {
            if (!profile) return;
            startTransition(() => {
              void synthesizeCourseProfileAction(profile.courseId);
            });
          }}
        >
          {isPending ? "Synthesizing…" : "Re-synthesize from documents"}
        </Button>
      </div>

      <Notice variant="info" title="How this works">
        Fields are inferred from your uploaded documents using keyword and text-pattern heuristics —
        not an AI model yet. Correct any field that looks wrong; corrections are locked and survive
        future re-synthesis.
      </Notice>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {FIELD_ORDER.map((field) => {
          const value = profile ? (profile as unknown as Record<string, unknown>)[field] : null;
          const confidence = profile?.confidenceByField?.[field];
          const sources = profile?.sourceDocumentIds?.[field] ?? [];
          const { text: confText, className: confClassName } = confidenceLabel(confidence);

          return (
            <div
              key={field}
              className="border-rule bg-canvas flex flex-col gap-2 rounded-sm border p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-ink text-sm font-semibold">{FIELD_LABELS[field]}</h3>
                <Button type="button" variant="ghost" size="sm" onClick={() => openEdit(field)}>
                  Correct
                </Button>
              </div>
              <p className={`text-xs font-medium ${confClassName}`}>{confText}</p>
              <pre className="text-ink max-h-40 overflow-y-auto text-xs whitespace-pre-wrap">
                {formatValue(value)}
              </pre>
              {sources.length > 0 && profile && (
                <p className="text-muted text-xs">
                  Sourced from:{" "}
                  {sources.map((id) => profile.documentTitleById[id] ?? id).join(", ")}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <Dialog
        open={editField !== null}
        onOpenChange={(open) => !open && setEditField(null)}
        title={editField ? `Correct: ${FIELD_LABELS[editField]}` : "Correct field"}
        description="Edit the raw value as JSON. Saving marks this field as teacher-confirmed."
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditField(null)}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={isPending}>
              Save
            </Button>
          </>
        }
      >
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          rows={10}
          className="border-rule bg-canvas text-ink w-full rounded-sm border px-3 py-2 font-mono text-xs"
        />
        {editError && <p className="text-danger mt-2 text-xs">{editError}</p>}
      </Dialog>
    </div>
  );
}
