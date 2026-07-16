import { redirect } from "next/navigation";
import { Button, Notice } from "@/components/design-system";
import { requireActor } from "@/lib/auth/authorization";
import { completeOnboardingAction } from "@/lib/auth/actions";

export default async function WelcomePage() {
  const actor = await requireActor();
  if (actor.onboardedAt) redirect("/home");

  return (
    <div className="bg-canvas flex min-h-dvh items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <h1 className="text-ink text-3xl font-semibold tracking-tight">
          Welcome to Wildcat Copilot
        </h1>
        <p className="text-muted mt-3 text-base">
          A private, course-aware workspace that learns from your syllabus, past assignments, and
          rubrics, then helps you generate lesson materials, assessments, and communications that
          actually match your course.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <Notice variant="info" title="You stay in control">
            Every generated artifact is fully editable and shows which of your course documents
            informed it. Nothing is finalized or sent anywhere without your explicit review and
            approval.
          </Notice>
          <Notice variant="info" title="No student data">
            This pilot does not accept student names, grades tied to names, or any other
            identifiable student information. Uploads are your own course materials only.
          </Notice>
          <Notice variant="warning" title="Outputs require your review">
            Generated content can be wrong or miss context. Treat every artifact as a draft from a
            capable assistant, not a finished, verified document.
          </Notice>
        </div>

        <form action={completeOnboardingAction} className="mt-8 flex flex-col gap-4">
          <label className="text-ink flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="pilotAnalyticsConsent"
              className="border-rule accent-accent mt-1 h-4 w-4 rounded-sm"
            />
            <span>
              I agree to share pilot usage data (feature usage, edits, ratings — never uploaded
              document content) to help improve Wildcat Copilot during the pilot. Optional; you can
              change this later in Settings.
            </span>
          </label>

          <Button type="submit" size="lg" className="self-start">
            Get started
          </Button>
        </form>
      </div>
    </div>
  );
}
