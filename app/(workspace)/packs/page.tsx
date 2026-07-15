import { EditorialHeader, EmptyState } from "@/components/design-system";

export default function PacksPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <EditorialHeader
        eyebrow="Generation"
        title="Weekly course packs"
        description="Request a complete set of lesson materials, assignments, and assessments for a unit."
      />
      <div className="mt-8">
        <EmptyState
          title="No course packs yet"
          description="The pack request flow ships in M1.3."
        />
      </div>
    </div>
  );
}
