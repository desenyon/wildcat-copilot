import { EditorialHeader, EmptyState } from "@/components/design-system";

export default function ArtifactsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <EditorialHeader
        eyebrow="Workspace"
        title="Artifacts"
        description="Every generated lesson, assignment, rubric, and assessment lives here for editing and review."
      />
      <div className="mt-8">
        <EmptyState title="No artifacts yet" description="The artifact workspace ships in M1.4." />
      </div>
    </div>
  );
}
