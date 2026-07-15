import { describe, expect, it } from "vitest";
import { createCourseSchema } from "@/lib/courses/schema";

describe("createCourseSchema", () => {
  it("accepts a valid course", () => {
    const result = createCourseSchema.safeParse({
      name: "Introduction to Biology",
      subject: "Science",
      gradeBand: "9-10",
      academicTerm: "Fall 2026",
      defaultClassDurationMinutes: "50",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.defaultClassDurationMinutes).toBe(50);
    }
  });

  it("rejects a missing course name", () => {
    const result = createCourseSchema.safeParse({
      name: "",
      subject: "Science",
      gradeBand: "9-10",
      academicTerm: "Fall 2026",
      defaultClassDurationMinutes: "50",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an out-of-range class duration", () => {
    const result = createCourseSchema.safeParse({
      name: "Introduction to Biology",
      subject: "Science",
      gradeBand: "9-10",
      academicTerm: "Fall 2026",
      defaultClassDurationMinutes: "9999",
    });
    expect(result.success).toBe(false);
  });
});
