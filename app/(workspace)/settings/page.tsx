import { EditorialHeader } from "@/components/design-system";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <EditorialHeader
        eyebrow="Course"
        title="Settings"
        description="Course metadata, teacher preferences, data usage, and deletion controls."
      />
    </div>
  );
}
