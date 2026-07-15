# Test Plan

## Layers

- **Unit** (`tests/unit`, Vitest + Testing Library): pure functions, individual components, prompt-adjacent logic (schema validation, citation checks) once they exist.
- **Integration** (`tests/integration`, Vitest): cross-module behavior — e.g., retrieval + citation mapping, authorization helpers against a test database once `lib/db` exists.
- **End-to-end** (`tests/e2e`, Playwright): full teacher journeys through the running app, plus accessibility checks (`@axe-core/playwright`) on major pages.

## Current coverage

- `tests/unit/example.test.tsx` — proves the Vitest + Testing Library + fixture pipeline works.
- `tests/integration/schema.test.ts` — runs against a real local Postgres, verifies cascading deletion (course → artifacts) and the generation-request idempotency-key uniqueness constraint.
- `tests/e2e/homepage.spec.ts`, `design-system.spec.ts` — boot the real app and run an axe scan with zero critical violations.
- `tests/e2e/auth.spec.ts` — unauthenticated visitors are redirected to sign-in.

These are real coverage of what exists so far, not placeholders — extend them as each task adds behavior, don't leave gaps.

## Known gap: authenticated e2e coverage

`tests/e2e/workspace-shell.spec.ts` and `tests/e2e/storage.spec.ts` are currently `test.skip()`-ed. They need a signed-in Clerk session, but this Clerk instance is configured OAuth-only (Google/GitHub/LinkedIn) with no email/password/username identification enabled, so `@clerk/testing`'s headless Playwright sign-in helper (`clerk.signIn({ page, emailAddress })`) can't mint a test session. See `docs/DECISIONS.md` (2026-07-15, "Switch from Auth.js to Clerk") for how to re-enable: add an email-based identification strategy for testing in the Clerk dashboard, then restore `tests/e2e/global-setup.ts`'s test-user provisioning and `tests/e2e/helpers/auth.ts`'s `signInAsTestTeacher` implementation. Verify these flows manually in a browser until then.

## Running integration tests locally

Integration tests need a running Postgres: `docker compose up -d && npm run db:migrate`, then `npm test` (or set `TEST_DATABASE_URL` to point elsewhere). CI provisions a `pgvector/pgvector:pg16` service container automatically.

## Required end-to-end journeys (T1.10.1)

Sign in and create course; upload and process documents; generate weekly course pack; edit an artifact; view sources; submit feedback; export artifact; delete a document; delete a course. None implemented yet — add as each corresponding milestone ships.

## Test data policy

No real student, teacher, or school data in any fixture, test, screenshot, or log — ever, including local development. Use `tests/fixtures/` synthetic fixtures. See `docs/PRIVACY.md`.

## Database test isolation

Each integration test runs inside a Postgres transaction that is always rolled back (`tests/integration/db-helpers.ts`), against the already-migrated `public` schema of a local/CI Postgres instance. (A per-test-schema approach was tried first but doesn't work here: `drizzle-kit generate` emits `public`-qualified `CREATE TYPE` statements for enums, so re-running migrations into a fresh schema per test collides on those types. Transaction rollback avoids the problem entirely and is the standard pattern.) No test may run against a database containing real data.

## CI gates

`.github/workflows/ci.yml` runs, in order: Prettier check, ESLint, `tsc --noEmit`, Vitest, `next build`, then Playwright e2e in a separate job. A task is not `DONE` if any of these fail on its branch.
