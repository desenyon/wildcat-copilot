import { Panel } from "@/components/design-system";

export interface CourseDataUsageProps {
  documentCount: number;
  artifactCount: number;
  createdAt: Date;
  courseId: string;
}

export function CourseDataUsage({
  documentCount,
  artifactCount,
  createdAt,
  courseId,
}: CourseDataUsageProps) {
  return (
    <Panel>
      <h2 className="text-ink text-sm font-semibold">Data usage</h2>
      <dl className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted">Documents</dt>
          <dd className="text-ink mt-1 text-lg tabular-nums">{documentCount}</dd>
        </div>
        <div>
          <dt className="text-muted">Artifacts</dt>
          <dd className="text-ink mt-1 text-lg tabular-nums">{artifactCount}</dd>
        </div>
        <div>
          <dt className="text-muted">Created</dt>
          <dd className="text-ink mt-1">
            {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(createdAt)}
          </dd>
        </div>
      </dl>
      <a
        href={`/api/courses/${courseId}/export`}
        className="border-rule bg-canvas text-ink hover:bg-rule/40 mt-4 inline-flex h-9 items-center rounded-sm border px-3 text-sm font-medium"
      >
        Export course data (JSON)
      </a>
    </Panel>
  );
}
