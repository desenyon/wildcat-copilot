import { config } from "dotenv";
import { encode } from "next-auth/jwt";
import type { Page } from "@playwright/test";

config({ path: ".env.local" });

/**
 * Real OAuth (Google) can't run headless in e2e, so we mint a session JWT
 * the same way Auth.js does and inject it as a cookie. This is only for
 * exercising authenticated pages/routes in tests — never a production
 * sign-in path.
 */
export async function signInAsTestTeacher(page: Page) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET must be set (see .env.local) to sign in test sessions");

  const token = await encode({
    secret,
    salt: "authjs.session-token",
    token: {
      email: "test-teacher@example.com",
      name: "Test Teacher",
      userId: "00000000-0000-0000-0000-000000000001",
      organizationId: "00000000-0000-0000-0000-000000000002",
      role: "teacher",
    },
  });

  await page.context().addCookies([
    {
      name: "authjs.session-token",
      value: token,
      url: "http://localhost:3000",
    },
  ]);
}
