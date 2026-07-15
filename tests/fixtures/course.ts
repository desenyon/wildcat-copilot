// Deterministic, synthetic fixtures only. No real student, teacher, or school data.

export const fixtureCourse = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Introduction to Biology",
  subject: "Science",
  gradeBand: "9-10",
  academicTerm: "Fall 2026",
  defaultClassDurationMinutes: 50,
};

export const fixtureCourseDocument = {
  id: "00000000-0000-0000-0000-000000000002",
  courseId: fixtureCourse.id,
  title: "Unit 1 Syllabus",
  documentType: "syllabus" as const,
  mimeType: "application/pdf",
};
