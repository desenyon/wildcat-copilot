import { SignOutButton } from "@clerk/nextjs";
import { Button, Notice } from "@/components/design-system";

export default function NotInvitedPage() {
  return (
    <div className="bg-canvas flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-ink text-2xl font-semibold tracking-tight">Wildcat Copilot</h1>
        <div className="mt-6">
          <Notice variant="warning" title="This pilot is invitation-only">
            Your account isn&apos;t on the pilot list yet. Check with your Wildcat Copilot pilot
            contact, or try a different account.
          </Notice>
        </div>
        <div className="mt-6">
          <SignOutButton redirectUrl="/">
            <Button variant="secondary">Sign out</Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
