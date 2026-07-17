import Link from "next/link";
import { EditorialHeader, EmptyState } from "@/components/design-system";
import { CourseProfileView } from "@/components/course-profile/CourseProfileView";
import { requireActor } from "@/lib/auth/authorization";
import { listCoursesForActor } from "@/lib/courses/queries";
import { listDocumentsForCourse } from "@/lib/documents/queries";
import { getCourseProfile } from "@/lib/course-profile/queries";

export default async function CourseProfilePage({
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
        title="Course profile"
        description="What this course's documents reveal about your objectives, patterns, and style — used to make generated materials sound like you."
      />

      {course ? (
        <div className="mt-8">
          <CourseProfileSection courseId={course.id} />
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="No course yet"
            description="Create a course first, then upload documents to build its profile."
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

async function CourseProfileSection({ courseId }: { courseId: string }) {
  const [profile, documents] = await Promise.all([
    getCourseProfile(courseId),
    listDocumentsForCourse(courseId),
  ]);

  const documentTitleById = Object.fromEntries(documents.map((d) => [d.id, d.title]));
  const processedCount = documents.filter((d) => d.processingStatus === "processed").length;

  if (processedCount === 0) {
    return (
      <EmptyState
        title="No processed documents yet"
        description="Upload and process at least one document to synthesize a course profile."
        action={
          <Link href="/documents" className="text-accent text-sm font-medium">
            Go to documents
          </Link>
        }
      />
    );
  }

  return (
    <CourseProfileView
      profile={
        profile
          ? {
              courseId,
              learningObjectives: profile.learningObjectives,
              instructionStyle: profile.instructionStyle,
              assignmentPatterns: profile.assignmentPatterns,
              rubricPatterns: profile.rubricPatterns,
              communicationTone: profile.communicationTone,
              difficultyProfile: profile.difficultyProfile,
              formatPreferences: profile.formatPreferences,
              confidenceByField: profile.confidenceByField as Record<string, number> | null,
              sourceDocumentIds: profile.sourceDocumentIds as Record<string, string[]> | null,
              version: profile.version,
              documentTitleById,
            }
          : {
              courseId,
              learningObjectives: null,
              instructionStyle: null,
              assignmentPatterns: null,
              rubricPatterns: null,
              communicationTone: null,
              difficultyProfile: null,
              formatPreferences: null,
              confidenceByField: null,
              sourceDocumentIds: null,
              version: 0,
              documentTitleById,
            }
      }
    />
  );
}
