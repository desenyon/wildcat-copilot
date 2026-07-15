import { test, expect } from "@playwright/test";

test("unauthenticated visitor is redirected to sign-in with a callback URL", async ({ page }) => {
  await page.goto("/home");
  await expect(page).toHaveURL(/\/sign-in\?callbackUrl=%2Fhome/);
  await expect(page.getByRole("button", { name: "Sign in with Google" })).toBeVisible();
});

test("sign-in page shows the pilot access message for uninvited users", async ({ page }) => {
  await page.goto("/sign-in?error=NotInvited");
  await expect(page.getByText(/invitation-only/i)).toBeVisible();
});
