"use client";

import { useActionState } from "react";
import { Button, Input, Select } from "@/components/design-system";
import { updateCourseAction, type CreateCourseFormState } from "@/lib/courses/actions";

const initialState: CreateCourseFormState = {};

export interface EditCourseFormProps {
  course: {
    id: string;
    name: string;
    subject: string;
    gradeBand: string;
    academicTerm: string;
    defaultClassDurationMinutes: number;
    description: string | null;
  };
}

export function EditCourseForm({ course }: EditCourseFormProps) {
  const boundAction = updateCourseAction.bind(null, course.id);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Input
        name="name"
        label="Course name"
        defaultValue={course.name}
        error={state.errors?.name}
        required
      />
      <Input
        name="subject"
        label="Subject"
        defaultValue={course.subject}
        error={state.errors?.subject}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          name="gradeBand"
          label="Grade band"
          defaultValue={course.gradeBand}
          error={state.errors?.gradeBand}
          options={[
            { value: "6-8", label: "6–8" },
            { value: "9-10", label: "9–10" },
            { value: "11-12", label: "11–12" },
            { value: "9-12", label: "9–12" },
          ]}
        />
        <Input
          name="academicTerm"
          label="Academic term"
          defaultValue={course.academicTerm}
          error={state.errors?.academicTerm}
          required
        />
      </div>
      <Input
        name="defaultClassDurationMinutes"
        label="Class duration (minutes)"
        type="number"
        min={5}
        max={300}
        defaultValue={course.defaultClassDurationMinutes}
        error={state.errors?.defaultClassDurationMinutes}
        required
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-ink text-sm font-medium">
          Description <span className="text-muted">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={course.description ?? ""}
          className="border-rule bg-canvas text-ink focus-visible:ring-accent rounded-sm border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>
      <div className="mt-2 flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        {state.saved && <span className="text-success text-sm">Saved.</span>}
      </div>
    </form>
  );
}
