import Link from "next/link";
import { redirect } from "next/navigation";
import { EditorialHeader, EmptyState } from "@/components/design-system";
import { requireActor } from "@/lib/auth/authorization";
import { listCoursesForActor } from "@/lib/courses/queries";

export default async function HomePage() {
  const actor = await requireActor();
  const courses = await listCoursesForActor(actor);

  if (courses.length === 0) {
    redirect("/courses/new");
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <EditorialHeader
        eyebrow="Dashboard"
        title="Welcome back"
        description="Continue recent work, create a weekly course pack, or review artifacts awaiting your approval."
        actions={
          <Link
            href="/courses/new"
            className="bg-ink text-canvas hover:bg-ink/90 inline-flex h-10 items-center justify-center rounded-sm px-4 text-sm font-medium transition-colors"
          >
            New course
          </Link>
        }
      />
      <div className="mt-8">
        <EmptyState
          title="No course packs yet"
          description="Upload course documents and generate your first weekly course pack once M1.2/M1.3 ship."
        />
      </div>
    </div>
  );
}
