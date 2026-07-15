"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export interface CourseSwitcherOption {
  id: string;
  name: string;
}

export interface CourseSwitcherProps {
  courses: CourseSwitcherOption[];
  activeCourseId: string;
  onSelect: (courseId: string) => void;
  className?: string;
}

export function CourseSwitcher({
  courses,
  activeCourseId,
  onSelect,
  className,
}: CourseSwitcherProps) {
  const [open, setOpen] = useState(false);
  const active = courses.find((c) => c.id === activeCourseId);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "border-rule bg-canvas text-ink flex w-full items-center justify-between gap-2 rounded-sm border px-3 py-2 text-sm font-medium",
          "focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none",
        )}
      >
        <span className="truncate">{active?.name ?? "Select a course"}</span>
        <span aria-hidden="true" className="text-muted">
          ⌄
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Courses"
          className="border-rule bg-canvas absolute z-30 mt-1 w-full rounded-sm border py-1 shadow-lg"
        >
          {courses.map((course) => (
            <li key={course.id}>
              <button
                type="button"
                role="option"
                aria-selected={course.id === activeCourseId}
                onClick={() => {
                  onSelect(course.id);
                  setOpen(false);
                }}
                className={cn(
                  "hover:bg-rule/40 block w-full px-3 py-2 text-left text-sm",
                  course.id === activeCourseId ? "text-accent" : "text-ink",
                )}
              >
                {course.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
