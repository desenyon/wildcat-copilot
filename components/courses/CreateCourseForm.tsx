"use client";

import { useActionState } from "react";
import { Button, Input, Select } from "@/components/design-system";
import { createCourseAction, type CreateCourseFormState } from "@/lib/courses/actions";

const initialState: CreateCourseFormState = {};

export function CreateCourseForm() {
  const [state, formAction, pending] = useActionState(createCourseAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Input
        name="name"
        label="Course name"
        placeholder="Introduction to Biology"
        error={state.errors?.name}
        required
      />
      <Input
        name="subject"
        label="Subject"
        placeholder="Science"
        error={state.errors?.subject}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          name="gradeBand"
          label="Grade band"
          error={state.errors?.gradeBand}
          options={[
            { value: "", label: "Select…" },
            { value: "6-8", label: "6–8" },
            { value: "9-10", label: "9–10" },
            { value: "11-12", label: "11–12" },
            { value: "9-12", label: "9–12" },
          ]}
        />
        <Input
          name="academicTerm"
          label="Academic term"
          placeholder="Fall 2026"
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
        defaultValue={50}
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
          className="border-rule bg-canvas text-ink focus-visible:ring-accent rounded-sm border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>
      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Creating…" : "Create course"}
      </Button>
    </form>
  );
}
