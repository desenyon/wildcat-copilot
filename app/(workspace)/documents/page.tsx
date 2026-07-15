import { EditorialHeader, EmptyState } from "@/components/design-system";

export default function DocumentsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <EditorialHeader
        eyebrow="Course memory"
        title="Documents"
        description="Upload a syllabus, past assignments, and rubrics to build this course's memory."
      />
      <div className="mt-8">
        <EmptyState
          title="No documents uploaded yet"
          description="Uploaded documents will appear here once M1.2 ships."
        />
      </div>
    </div>
  );
}
