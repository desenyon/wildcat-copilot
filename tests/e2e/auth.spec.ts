import { test, expect } from "@playwright/test";

test("unauthenticated visitor is redirected to sign-in", async ({ page }) => {
  await page.goto("/home");
  await expect(page).toHaveURL(/\/sign-in/);
});

// A "signed-in teacher can reach the workspace" test would go here, but this
// Clerk instance is OAuth-only (Google/GitHub/LinkedIn) with no email-based
// identification strategy, so headless test sign-in isn't available. See
// tests/e2e/helpers/auth.ts and docs/TEST_PLAN.md. Verify manually in a
// browser for now.
