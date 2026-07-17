import Link from "next/link";
import { redirect } from "next/navigation";
import { EditorialHeader, EmptyState } from "@/components/design-system";
import { requireActor } from "@/lib/auth/authorization";
import { getHomeDashboardData } from "@/lib/dashboard/queries";

export default async function HomePage() {
  const actor = await requireActor();
  const data = await getHomeDashboardData(actor);

  if (data.courses.length === 0) {
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
            href="/packs"
            className="bg-ink text-canvas hover:bg-ink/90 inline-flex h-10 items-center justify-center rounded-sm px-4 text-sm font-medium transition-colors"
          >
            Create weekly course pack
          </Link>
        }
      />

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <section
          aria-labelledby="time-saved-heading"
          className="border-rule bg-canvas rounded-sm border p-4"
        >
          <h2
            id="time-saved-heading"
            className="text-muted text-xs font-semibold tracking-wide uppercase"
          >
            Time saved
          </h2>
          <p className="text-ink mt-2 text-2xl font-semibold">
            {data.timeSavedMinutes > 0 ? `${data.timeSavedMinutes} min` : "Not tracked yet"}
          </p>
          <p className="text-muted mt-1 text-xs">
            {data.timeSavedMinutes > 0
              ? "Based on your feedback on generated artifacts."
              : "Rate a generated artifact to start tracking this."}
          </p>
        </section>

        <section
          aria-labelledby="recent-exports-heading"
          className="border-rule bg-canvas rounded-sm border p-4"
        >
          <h2
            id="recent-exports-heading"
            className="text-muted text-xs font-semibold tracking-wide uppercase"
          >
            Recent exports
          </h2>
          {data.recentExports.length === 0 ? (
            <p className="text-muted mt-2 text-sm">No exports yet.</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-1">
              {data.recentExports.map((exp) => (
                <li key={exp.id} className="text-ink text-sm">
                  {exp.artifactTitle}{" "}
                  <span className="text-muted">
                    ({exp.exportType},{" "}
                    {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                      exp.createdAt,
                    )}
                    )
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section aria-labelledby="courses-heading" className="mt-8">
        <h2 id="courses-heading" className="text-ink mb-3 text-sm font-semibold">
          Your courses
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.courses.map((course) => {
            const usage = data.courseUsage[course.id];
            return (
              <Link
                key={course.id}
                href={`/documents?course=${course.id}`}
                className="border-rule bg-canvas hover:border-accent flex flex-col gap-1 rounded-sm border p-4 transition-colors"
              >
                <p className="text-ink text-sm font-semibold">{course.name}</p>
                <p className="text-muted text-xs">
                  {usage?.documentCount ?? 0} document{usage?.documentCount === 1 ? "" : "s"} ·{" "}
                  {usage?.artifactCount ?? 0} artifact{usage?.artifactCount === 1 ? "" : "s"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <section
          aria-labelledby="continue-work-heading"
          className="border-rule bg-canvas rounded-sm border p-4"
        >
          <h2 id="continue-work-heading" className="text-ink mb-2 text-sm font-semibold">
            Continue recent work
          </h2>
          {data.recentDocuments.length === 0 ? (
            <EmptyState
              title="No documents yet"
              description="Upload your syllabus or a past assignment to get started."
              action={
                <Link href="/documents" className="text-accent text-sm font-medium">
                  Go to documents
                </Link>
              }
            />
          ) : (
            <ul className="flex flex-col gap-1">
              {data.recentDocuments.map((doc) => (
                <li key={doc.id}>
                  <Link
                    href={`/documents?course=${doc.courseId}`}
                    className="text-ink text-sm hover:underline"
                  >
                    {doc.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          aria-labelledby="attention-heading"
          className="border-rule bg-canvas rounded-sm border p-4"
        >
          <h2 id="attention-heading" className="text-ink mb-2 text-sm font-semibold">
            Documents needing attention
          </h2>
          {data.documentsNeedingAttention.length === 0 ? (
            <p className="text-muted text-sm">Nothing needs attention right now.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {data.documentsNeedingAttention.map((doc) => (
                <li key={doc.id}>
                  <Link
                    href={`/documents?course=${doc.courseId}`}
                    className="text-danger text-sm hover:underline"
                  >
                    {doc.title} — {doc.processingErrorCode ?? "processing failed"}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section aria-labelledby="review-heading" className="mt-8">
        <h2 id="review-heading" className="text-ink mb-2 text-sm font-semibold">
          Artifacts needing review
        </h2>
        {data.artifactsNeedingReview.length === 0 ? (
          <EmptyState
            title="No artifacts to review yet"
            description="Generated course packs will show up here once you create one."
            action={
              <Link href="/packs" className="text-accent text-sm font-medium">
                Create a course pack
              </Link>
            }
          />
        ) : (
          <ul className="flex flex-col gap-1">
            {data.artifactsNeedingReview.map((artifact) => (
              <li key={artifact.id}>
                <Link href="/artifacts" className="text-ink text-sm hover:underline">
                  {artifact.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
