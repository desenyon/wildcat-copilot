import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("design system page renders components with no critical accessibility violations", async ({
  page,
}) => {
  await page.goto("/dev/design-system");
  await expect(page.getByRole("heading", { name: "Design system" })).toBeVisible();

  await page.getByRole("button", { name: "Open dialog" }).click();
  await expect(page.getByRole("dialog", { name: "Regenerate section" })).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();

  const results = await new AxeBuilder({ page }).analyze();
  const critical = results.violations.filter((v) => v.impact === "critical");
  expect(critical).toEqual([]);
});
