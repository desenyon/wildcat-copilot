import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { signInAsTestTeacher } from "./helpers/auth";

test.beforeEach(async ({ page }) => {
  await signInAsTestTeacher(page);
});

test("workspace shell navigation works without full page reloads", async ({ page }) => {
  await page.goto("/home");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

  await page.getByRole("link", { name: "Documents" }).click();
  await expect(page.getByRole("heading", { name: "Documents" })).toBeVisible();
  await expect(page).toHaveURL(/\/documents$/);

  const results = await new AxeBuilder({ page }).analyze();
  const critical = results.violations.filter((v) => v.impact === "critical");
  expect(critical).toEqual([]);
});

test("course switcher opens and selects a course", async ({ page }) => {
  await page.goto("/home");
  await page.getByRole("button", { name: "Introduction to Biology" }).click();
  await page.getByRole("option", { name: "AP English Language" }).click();
  await expect(page.getByRole("button", { name: "AP English Language" })).toBeVisible();
});

test("mobile viewport collapses nav behind a menu toggle", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/home");
  await expect(page.getByRole("link", { name: "Documents" })).toBeHidden();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("link", { name: "Documents" })).toBeVisible();
});
