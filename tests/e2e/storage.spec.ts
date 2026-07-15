import { test, expect } from "@playwright/test";

// /api/storage/* requires a signed-in Clerk session (requireActor()), and
// this Clerk instance is OAuth-only (Google/GitHub/LinkedIn) with no
// email-based identification strategy, so headless test sign-in isn't
// available yet. See tests/e2e/helpers/auth.ts and docs/TEST_PLAN.md.
// Verify manually in a browser for now.
test.skip(true, "requires a signed-in session; see docs/TEST_PLAN.md");

test("uploads a file via a signed URL and downloads it back", async ({ page }) => {
  const key = `e2e-${Date.now()}/test.pdf`;
  const ticketRes = await page.request.get(
    `/api/storage/test-ticket?key=${encodeURIComponent(key)}`,
  );
  const ticket = await ticketRes.json();

  const bytes = new Uint8Array([37, 80, 68, 70, 45]); // "%PDF-"
  const uploadRes = await page.request.post(ticket.uploadUrl, { data: Buffer.from(bytes) });
  expect(uploadRes.status()).toBe(200);

  const downloadRes = await page.request.get(ticket.downloadUrl);
  expect(downloadRes.status()).toBe(200);
  const body = await downloadRes.body();
  expect(new Uint8Array(body)).toEqual(bytes);
});

test("rejects an unsupported file type", async ({ page }) => {
  const key = `e2e-${Date.now()}/test.exe`;
  const ticketRes = await page.request.get(
    `/api/storage/test-ticket?key=${encodeURIComponent(key)}&mimeType=application/x-msdownload`,
  );
  const ticket = await ticketRes.json();

  const uploadRes = await page.request.post(ticket.uploadUrl, { data: Buffer.from([1, 2, 3]) });
  expect(uploadRes.status()).toBe(415);
});

test("rejects an expired upload token", async ({ page }) => {
  const key = `e2e-${Date.now()}/test.pdf`;
  const ticketRes = await page.request.get(
    `/api/storage/test-ticket?key=${encodeURIComponent(key)}&expired=true`,
  );
  const ticket = await ticketRes.json();

  const uploadRes = await page.request.post(ticket.uploadUrl, { data: Buffer.from([1, 2, 3]) });
  expect(uploadRes.status()).toBe(410);
});
