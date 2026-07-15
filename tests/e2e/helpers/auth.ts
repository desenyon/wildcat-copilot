import type { Page } from "@playwright/test";

/**
 * This Clerk instance is configured OAuth-only (Google/GitHub/LinkedIn),
 * with no email/password/username identification enabled. @clerk/testing's
 * headless sign-in helper needs an email-based identity to mint a test
 * session, so it can't drive real Google OAuth here. Until an email-based
 * identification strategy is added for testing (see docs/TEST_PLAN.md),
 * tests that need an authenticated session are skipped — see
 * tests/e2e/workspace-shell.spec.ts and tests/e2e/storage.spec.ts.
 */
export async function signInAsTestTeacher(page: Page): Promise<never> {
  void page;
  throw new Error(
    "signInAsTestTeacher is unavailable: this Clerk instance has no email-based " +
      "identification strategy enabled for headless test sign-in. See docs/TEST_PLAN.md.",
  );
}
