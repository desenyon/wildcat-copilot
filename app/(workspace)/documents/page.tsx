import Link from "next/link";
import { EditorialHeader, EmptyState } from "@/components/design-system";
import { DocumentUploadZone } from "@/components/documents/DocumentUploadZone";
import { DocumentList } from "@/components/documents/DocumentList";
import { requireActor } from "@/lib/auth/authorization";
import { listCoursesForActor } from "@/lib/courses/queries";
import { listDocumentsForCourse } from "@/lib/documents/queries";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const actor = await requireActor();
  const courses = await listCoursesForActor(actor);
  const { course: courseIdParam } = await searchParams;
  const course = courses.find((c) => c.id === courseIdParam) ?? courses[0];

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <EditorialHeader
        eyebrow="Course memory"
        title="Documents"
        description="Upload a syllabus, past assignments, and rubrics to build this course's memory."
      />

      {course ? (
        <div className="mt-8 flex flex-col gap-8">
          <DocumentUploadZone courseId={course.id} />
          <DocumentListSection courseId={course.id} />
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="No course yet"
            description="Create a course first, then you can upload its documents here."
            action={
              <Link href="/courses/new" className="text-accent text-sm font-medium">
                Create a course
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}

async function DocumentListSection({ courseId }: { courseId: string }) {
  const documents = await listDocumentsForCourse(courseId);

  if (documents.length === 0) {
    return (
      <EmptyState
        title="No documents uploaded yet"
        description="Upload your syllabus, past assignments, and rubrics above."
      />
    );
  }

  return <DocumentList documents={documents} />;
}
