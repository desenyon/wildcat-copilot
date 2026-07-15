import { EditorialHeader, Panel } from "@/components/design-system";
import { CreateCourseForm } from "@/components/courses/CreateCourseForm";

export default function NewCoursePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <EditorialHeader
        eyebrow="Course setup"
        title="Create a course"
        description="Takes under two minutes. You can add documents and preferences after."
      />
      <div className="mt-8">
        <Panel>
          <CreateCourseForm />
        </Panel>
      </div>
    </div>
  );
}
