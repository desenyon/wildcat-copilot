import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="bg-canvas flex min-h-dvh flex-col items-center justify-center gap-6 px-6 py-12">
      <div className="text-center">
        <h1 className="text-ink text-2xl font-semibold tracking-tight">Wildcat Copilot</h1>
        <p className="text-muted mt-2 max-w-sm text-sm">
          A private, course-aware workspace for teachers. Sign in with your school account.
        </p>
      </div>

      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#1e5eff",
            colorBackground: "#fbfaf7",
            colorForeground: "#14161a",
            borderRadius: "2px",
          },
        }}
      />

      <p className="text-muted max-w-sm text-center text-xs">
        Outputs always require your review before they leave this workspace. No student-identifying
        data is required to use Wildcat Copilot. This pilot is invitation-only.
      </p>
    </div>
  );
}
