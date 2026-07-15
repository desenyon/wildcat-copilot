# Test Plan

## Layers

- **Unit** (`tests/unit`, Vitest + Testing Library): pure functions, individual components, prompt-adjacent logic (schema validation, citation checks) once they exist.
- **Integration** (`tests/integration`, Vitest): cross-module behavior — e.g., retrieval + citation mapping, authorization helpers against a test database once `lib/db` exists.
- **End-to-end** (`tests/e2e`, Playwright): full teacher journeys through the running app, plus accessibility checks (`@axe-core/playwright`) on major pages.

## Current coverage

- `tests/unit/example.test.tsx` — proves the Vitest + Testing Library + fixture pipeline works.
- `tests/e2e/homepage.spec.ts` — proves Playwright boots the app and runs an axe scan with zero critical violations.

Both are scaffolding placeholders and should be replaced/extended as real features land in each task, not left as the only coverage.

## Required end-to-end journeys (T1.10.1)

Sign in and create course; upload and process documents; generate weekly course pack; edit an artifact; view sources; submit feedback; export artifact; delete a document; delete a course. None implemented yet — add as each corresponding milestone ships.

## Test data policy

No real student, teacher, or school data in any fixture, test, screenshot, or log — ever, including local development. Use `tests/fixtures/` synthetic fixtures. See `docs/PRIVACY.md`.

## Database test isolation

Not yet applicable (no schema exists — T0.4.3). Plan: each integration test run gets a dedicated Postgres schema or transactional rollback per test, provisioned via a test-only Drizzle client; no test may run against a database containing real data.

## CI gates

`.github/workflows/ci.yml` runs, in order: Prettier check, ESLint, `tsc --noEmit`, Vitest, `next build`, then Playwright e2e in a separate job. A task is not `DONE` if any of these fail on its branch.
