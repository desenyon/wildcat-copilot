import { Button, Notice } from "@/components/design-system";
import { signInWithGoogle } from "@/lib/auth/actions";

const errorMessages: Record<string, string> = {
  NotInvited:
    "This pilot is invitation-only right now. If you're expecting access, check with your Wildcat Copilot pilot contact.",
  default: "Something went wrong signing you in. Please try again.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;

  return (
    <div className="bg-canvas flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-ink text-2xl font-semibold tracking-tight">Wildcat Copilot</h1>
        <p className="text-muted mt-2 text-sm">
          A private, course-aware workspace for teachers. Sign in with your school Google account.
        </p>

        {error && (
          <div className="mt-6">
            <Notice variant="warning" title="Can't sign you in">
              {errorMessages[error] ?? errorMessages.default}
            </Notice>
          </div>
        )}

        <form
          className="mt-6"
          action={async () => {
            "use server";
            await signInWithGoogle(callbackUrl);
          }}
        >
          <Button type="submit" variant="primary" className="w-full">
            Sign in with Google
          </Button>
        </form>

        <p className="text-muted mt-6 text-xs">
          Outputs always require your review before they leave this workspace. No
          student-identifying data is required to use Wildcat Copilot.
        </p>
      </div>
    </div>
  );
}
