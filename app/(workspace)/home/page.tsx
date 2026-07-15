import { EditorialHeader } from "@/components/design-system";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <EditorialHeader
        eyebrow="Dashboard"
        title="Welcome back"
        description="Continue recent work, create a weekly course pack, or review artifacts awaiting your approval."
      />
    </div>
  );
}
