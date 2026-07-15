# Architectural Decision Log

Record format: date, decision, context, alternatives considered, consequences. Append only; do not delete superseded decisions, mark them superseded instead.

---

## 2026-07-15 — ORM: Drizzle over Prisma

**Decision:** Use Drizzle ORM with the `postgres` (postgres.js) driver.

**Context:** AGENTS.md §4.1 requires selecting one ORM and documenting it.

**Alternatives considered:** Prisma (heavier runtime, separate schema DSL, less direct SQL/pgvector control).

**Consequences:** Schema defined in TypeScript colocated with app code (`lib/db`). Migrations via `drizzle-kit`. pgvector column types will need a custom Drizzle column type or raw SQL extension when M1.2 lands.

---

## 2026-07-15 — Repository scaffolded via create-next-app, merged into existing directory

**Decision:** Scaffolded the Next.js app in a scratch directory with `create-next-app` (package name restrictions blocked scaffolding directly into `TeacherAssit`, which contains an uppercase letter), then moved generated files into the project root, excluding the `AGENTS.md`/`CLAUDE.md` boilerplate the scaffold generates so the project's real `AGENTS.md` was not overwritten.

**Consequences:** `package.json` name is `wildcat-copilot`, distinct from the directory name. No functional impact.

---

## 2026-07-15 — Known moderate npm audit findings accepted for now

**Decision:** Left 6 moderate-severity `npm audit` findings unresolved (`@esbuild-kit/*` pulled in transitively by `drizzle-kit`'s CLI bundler, and `postcss` pulled in transitively by Next.js's internal Turbopack tooling).

**Context:** Both are on the latest published major version already; `npm audit fix --force` would downgrade `next` to a pre-9.4 canary, an unacceptable regression. Both vulnerable paths are dev/build-time tooling only (drizzle-kit CLI, Next's internal CSS pipeline), not code shipped to the browser or reachable at runtime.

**Consequences:** Re-check on each dependency bump; revisit if either package publishes a fix.

---

## 2026-07-15 — Object storage and LLM provider left as abstract env vars

**Decision:** `.env.example` and `lib/validation/env.ts` declare generic `OBJECT_STORAGE_*` and `LLM_PROVIDER_API_KEY` variables rather than committing to a specific vendor (S3 vs. GCS vs. R2; OpenAI vs. Anthropic vs. other) at repo-init time.

**Context:** AGENTS.md §4.1 requires "a provider abstraction for large language models" and object storage without naming a vendor. Vendor selection is deferred to the M0.4 tasks that actually implement storage and the AI pipeline.

**Consequences:** `lib/ai` and `lib/documents`/object storage code must be written against an internal interface, not a vendor SDK directly, so the concrete provider can be swapped without touching call sites.

---

## 2026-07-15 — Auth.js v5 with JWT sessions, no DB adapter (SUPERSEDED — see 2026-07-15 "Switch to Clerk" below)

**Decision:** Use `next-auth` (Auth.js) v5 beta with the Google provider and JWT-strategy sessions. No Auth.js DB adapter is used.

**Context:** Auth.js's official Drizzle/DB adapters expect a specific schema (`accounts`, `sessions`, `verificationTokens` tables) that doesn't match the `User`/`Organization` entities AGENTS.md §4.3 specifies. Rather than bend our schema to the adapter, sign-in callbacks upsert directly into our own `users`/`organizations` tables (`lib/auth/user.ts`, `lib/auth/organization.ts`), and the JWT carries `userId`/`organizationId`/`role` so authorization checks never need a DB round trip just to read the session.

**Consequences:** `trustHost: true` is required in `lib/auth/config.ts` since we're self-hosted, not deployed on Vercel (Auth.js can't infer a trusted host otherwise, and refuses non-trusted hosts once `next start` runs in production mode). Organizations are created lazily, one per teacher email domain — there is no manual org-provisioning step yet; revisit for P-5 multi-org administration.

---

## 2026-07-15 — Object storage: local filesystem adapter, custom HMAC "signed URLs"

**Decision:** `lib/documents/storage/local.ts` implements the `StorageProvider` interface against the local filesystem (path from `OBJECT_STORAGE_BUCKET`), with "signed URLs" being our own `/api/storage/upload` and `/api/storage/download` routes gated by a short-lived HMAC token (`lib/documents/storage/token.ts`), not real cloud presigned URLs.

**Context:** No cloud storage vendor is chosen yet (see the "Object storage and LLM provider left as abstract env vars" decision above). The token shape (storageKey + action + expiry, signed with `APP_SECRET`) mirrors what a presigned URL provides closely enough that swapping in S3/GCS later should only touch `local.ts` and the two route handlers, not callers.

**Consequences:** A `/api/storage/test-ticket` route exists purely to let e2e tests exercise the real upload/download routes without a document-upload UI (that ships in T1.2.1); it's gated behind `ALLOW_TEST_ROUTES=true`, which must never be set in a real deployment.

---

## 2026-07-15 — Background jobs: pg-boss on the same Postgres instance

**Decision:** Use `pg-boss` (queues live in a `pgboss` schema on the same Postgres database) rather than standing up Redis/SQS for P-0/P-1.

**Context:** AGENTS.md §4.1/§4.4.5 requires a background job system with retries, dead-letter handling, and idempotency keys, but doesn't mandate a specific technology. One fewer piece of infrastructure to run locally and in CI.

**Consequences:** pg-boss v12's queue `policy` is immutable after creation — changing `QUEUE_CONFIG`'s policy for an existing queue requires deleting and recreating it (`boss.deleteQueue`), not just redeploying code. `policy: "stately"` is required for `singletonKey`-based idempotency to actually dedupe; the default `"standard"` policy allows unlimited jobs per key. Revisit if job volume or fan-out needs outgrow a single Postgres instance.

---

## 2026-07-15 — Switch from Auth.js to Clerk

**Decision:** Replace Auth.js v5 with Clerk (`@clerk/nextjs`) as the identity provider, at the user's explicit request. Clerk owns sign-in UI, sessions, and OAuth; our own `users`/`organizations` tables (AGENTS.md §4.3) remain the authorization source of truth.

**Context:** User supplied real Clerk API keys and asked to use Clerk instead of the from-scratch Auth.js + Google OAuth setup.

**Consequences:**

- `users.clerkUserId` (unique) is the join key between a Clerk session and our internal `User` row (migration `0002_lame_doctor_octopus.sql`). `requireActor()` (`lib/auth/authorization.ts`) upserts on every authenticated request — no Clerk webhook sync yet, so a user's display name only updates in our DB on their next request, not instantly on Clerk profile edits. Revisit with a Clerk webhook if that lag matters.
- `PILOT_ALLOWLIST` enforcement moved out of the sign-in flow (Clerk doesn't know about it) and into `requireActor()` / the `(workspace)` layout, which redirects non-allowlisted signed-in users to `/not-invited`. Clerk's own hosted sign-up would otherwise let anyone with a Google account in.
- `AUTH_SECRET` was renamed to `APP_SECRET` — it's now a general-purpose HMAC secret (used for storage tokens) with no connection to any auth provider's session signing.
- **This specific Clerk instance is configured OAuth-only** (Google/GitHub/LinkedIn) with no email/password/username identification enabled. Fine for real sign-in, but it means `@clerk/testing`'s headless Playwright sign-in helper (which needs an email-based identity to mint a test session) can't be used as-is. e2e tests requiring an authenticated session are `test.skip()`-ed for now (`tests/e2e/workspace-shell.spec.ts`, `tests/e2e/storage.spec.ts`) — re-enable once an email-based identification strategy is added in the Clerk dashboard for test purposes, and restore the `signInAsTestTeacher` implementation in `tests/e2e/helpers/auth.ts` (previous working version used `clerk.signIn({ page, emailAddress })` after provisioning a test user via the Backend API in `tests/e2e/global-setup.ts`).
- `CLERK_SECRET_KEY` is read from a GitHub Actions encrypted secret (`${{ secrets.CLERK_SECRET_KEY }}`) in `.github/workflows/ci.yml`, not hardcoded — a first pass at this hardcoded the test-mode secret key directly in the workflow file, which the harness's auto-mode classifier correctly flagged before it reached git history. The publishable key (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`) is safe to keep literal in the workflow — it's meant to be public and ships in the client bundle regardless. **Action required:** add `CLERK_SECRET_KEY` as a repository secret (Settings → Secrets and variables → Actions → New repository secret) before CI will pass.
