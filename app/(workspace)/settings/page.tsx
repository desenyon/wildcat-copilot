import { EditorialHeader, EmptyState, Panel } from "@/components/design-system";
import { DeleteAccountSection } from "@/components/design-system/DeleteAccountSection";
import { EditCourseForm } from "@/components/courses/EditCourseForm";
import { DeleteCourseSection } from "@/components/courses/DeleteCourseSection";
import { CourseDataUsage } from "@/components/courses/CourseDataUsage";
import { requireActor } from "@/lib/auth/authorization";
import { getCourseDataUsage, listCoursesForActor } from "@/lib/courses/queries";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const actor = await requireActor();
  const courses = await listCoursesForActor(actor);
  const { course: courseIdParam } = await searchParams;
  const course = courses.find((c) => c.id === courseIdParam) ?? courses[0];

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <EditorialHeader
        eyebrow="Course"
        title="Settings"
        description="Course metadata, teacher preferences, data usage, and deletion controls."
      />

      {course ? (
        <div className="mt-8 flex flex-col gap-6">
          <Panel>
            <h2 className="text-ink mb-4 text-sm font-semibold">Course details</h2>
            <EditCourseForm
              course={{
                id: course.id,
                name: course.name,
                subject: course.subject,
                gradeBand: course.gradeBand,
                academicTerm: course.academicTerm,
                defaultClassDurationMinutes: course.defaultClassDurationMinutes,
                description: course.description,
              }}
            />
          </Panel>

          <Panel>
            <h2 className="text-ink text-sm font-semibold">Teacher preferences</h2>
            <p className="text-muted mt-1 text-sm">
              Instruction style, rigor, feedback length, and tone preferences ship in T1.1.3.
            </p>
          </Panel>

          <CourseDataUsageSection courseId={course.id} createdAt={course.createdAt} />

          <DeleteCourseSection courseId={course.id} courseName={course.name} />
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="No course selected"
            description="Create a course first, then its settings will appear here."
          />
        </div>
      )}

      <div className="mt-8 max-w-lg">
        <DeleteAccountSection />
      </div>
    </div>
  );
}

async function CourseDataUsageSection({
  courseId,
  createdAt,
}: {
  courseId: string;
  createdAt: Date;
}) {
  const usage = await getCourseDataUsage(courseId);
  return (
    <CourseDataUsage
      courseId={courseId}
      createdAt={createdAt}
      documentCount={usage.documentCount}
      artifactCount={usage.artifactCount}
    />
  );
}
