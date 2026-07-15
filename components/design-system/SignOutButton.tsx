"use client";

import { Button } from "@/components/design-system/Button";
import { signOutAction } from "@/lib/auth/actions";

export function SignOutButton() {
  return (
    <Button variant="ghost" size="sm" onClick={() => signOutAction()}>
      Sign out
    </Button>
  );
}
