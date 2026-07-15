import { EditorialHeader } from "@/components/design-system";
import { DeleteAccountSection } from "@/components/design-system/DeleteAccountSection";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <EditorialHeader
        eyebrow="Course"
        title="Settings"
        description="Course metadata, teacher preferences, data usage, and deletion controls."
      />
      <div className="mt-8 max-w-lg">
        <DeleteAccountSection />
      </div>
    </div>
  );
}
