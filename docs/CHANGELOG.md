# Changelog

Format: date, phase/milestone/task reference, summary. Newest first.

## 2026-07-15 — P-1 → M1.1 → T1.1.4: Course settings

- `/settings` is now course-scoped (reads `?course=`): edit metadata, view data usage, export, and delete a course.
- `updateCourseAction` + `EditCourseForm`: prefilled, Zod-validated, `revalidatePath`s so the course switcher reflects a rename immediately.
- `getCourseDataUsage`: real per-course document/artifact counts (0/0 today, will be accurate as M1.2/M1.4 land).
- `GET /api/courses/[courseId]/export`: downloads the course's own metadata as JSON.
- `deleteCourseAction` + `DeleteCourseSection`: hard delete gated by `ConfirmDialog`, enforced through `requireCourseAccess` so a teacher can only delete their own course.
- Verified end-to-end in a real browser: renamed a course and watched the switcher update live, downloaded a real export, and created + deleted a disposable course — confirmed via a direct Postgres query that exactly that row was removed and nothing else.

## 2026-07-15 — P-1 → M1.1 → T1.1.1: Pilot welcome flow

- `/welcome`: one-screen intro (product explanation, teacher-control notice, no-student-data notice, "outputs require review" warning) with an opt-in pilot analytics consent checkbox and a direct "Get started" CTA.
- Added `users.onboardedAt` / `users.pilot_analytics_consent` (migration `0003`). The `(workspace)` layout now redirects any signed-in teacher who hasn't completed onboarding to `/welcome` before they can reach any workspace page.
- `completeOnboardingAction` records the consent choice, marks onboarding complete, then routes to `/courses/new` or `/home` depending on whether the teacher already has courses.
- Verified end-to-end in a real browser: redirect-to-welcome for an unonboarded teacher, and correct consent persistence (`false`) after submitting without checking the box.

## 2026-07-15 — P-1 → M1.1 → T1.1.2: Course creation

- Real course creation: `/courses/new` form (Zod-validated server action) inserts an actual `courses` row owned by the signed-in teacher and redirects to `/home?course=<id>`.
- `WorkspaceShell` now runs on real data — the `(workspace)` layout fetches the teacher's courses server-side and passes them down, replacing the hardcoded placeholder list. The course switcher drives a `?course=` query param via client-side navigation.
- `/home` redirects a teacher with zero courses straight to `/courses/new`.
- Verified end-to-end in a real browser with a real Google sign-in through Clerk (not a test double): created two courses, confirmed both appear in the switcher with the right one selected after each creation.
- Found and fixed a real bug while doing that manual verification: creating a course succeeded, but the switcher kept showing "Create a course" instead of the new course — Next.js's client router cache was serving a stale layout render across the `/courses/new` → `/home` redirect. Fixed with `revalidatePath("/", "layout")` in the server action before redirecting.
- Repo is now pushed to GitHub (`desenyon/wildcat-copilot`, public) with CI passing; `CLERK_SECRET_KEY` is set via `gh secret set` rather than committed.

## 2026-07-15 — Switch identity provider to Clerk

- Replaced Auth.js v5 with Clerk (`@clerk/nextjs`) at the user's request, using real Clerk dev-instance keys. Root `/` now redirects to `/home`, which the auth proxy correctly bounces unauthenticated visitors to `/sign-in` (fixed the leftover `create-next-app` boilerplate that was showing on first run).
- Added `users.clerkUserId` (migration `0002`), the join key between Clerk sessions and our internal `User` rows. `requireActor()` upserts on every request.
- `PILOT_ALLOWLIST` enforcement moved to `requireActor()`/the `(workspace)` layout, redirecting non-allowlisted signed-in users to a new `/not-invited` page — Clerk's hosted sign-up doesn't know about our allowlist.
- Renamed `AUTH_SECRET` → `APP_SECRET` (it only ever signed storage tokens, never tied to session auth).
- Discovered this Clerk instance is configured OAuth-only (Google/GitHub/LinkedIn, no email/password), which blocks `@clerk/testing`'s headless Playwright sign-in helper. Skipped the e2e tests that need an authenticated session (`workspace-shell.spec.ts`, `storage.spec.ts`) with a clear comment and a documented path to re-enable (`docs/DECISIONS.md`, `docs/TEST_PLAN.md`), rather than silently leaving them broken.
- Full pipeline (lint, typecheck, unit/integration tests, real production build with real Clerk keys, e2e) verified green after the swap.

## 2026-07-15 — P-0 → M0.4 → T0.4.1–T0.4.5

- Database schema (AGENTS.md §4.3): all 14 entities in `lib/db/schema/`, Drizzle + `postgres` driver, migrations against local Postgres 16 + pgvector (`docker-compose.yml`), cascading deletes, generation-request idempotency-key uniqueness. Integration tests run against real Postgres with transaction-rollback isolation.
- Authentication: Auth.js v5, Google OAuth, JWT sessions, `PILOT_ALLOWLIST`-gated pilot access, lazy per-email-domain organization creation, user upsert on sign-in, sign-out and hard account deletion entry points. Route protection via `proxy.ts` (renamed from `middleware.ts` per Next 16 convention).
- Authorization: `lib/auth/authorization.ts` enforces org/course-scoped access server-side; pure `checkCourseAccess` logic is unit-testable without the NextAuth runtime. Verified: owner allowed, cross-org denied, cross-owner-same-org denied.
- Object storage: provider-agnostic `StorageProvider` interface with a local filesystem implementation; HMAC-signed, 5-minute "signed URLs" via `/api/storage/upload` and `/api/storage/download`. Verified end-to-end: byte-exact upload/download round trip, unsupported MIME type rejected, expired token rejected.
- Background jobs: pg-boss on the same Postgres instance, queues for document-processing/generation/export with bounded retries + backoff + dead-letter queues, `singletonKey`-based idempotency. `npm run workers` entrypoint. Verified against real Postgres: job reaches `completed` state, duplicate idempotency key is a no-op.
- CI now provisions a `pgvector/pgvector:pg16` service container and runs migrations before tests.

## 2026-07-15 — P-0 → M0.3 → T0.3.1, T0.3.2, T0.3.3

- Design tokens (AGENTS.md §3.3–3.4): semantic color/spacing/typography/motion tokens via Tailwind v4 `@theme` in `app/globals.css`. All foreground/background color pairs contrast-checked ≥4.5:1. Light/dark supported via `prefers-color-scheme` and a `data-theme` override.
- Foundational components in `components/design-system/`: Button, Input, Select, Dialog, ConfirmDialog, Tabs, Table, Panel/DarkPanel, Notice/InlineError, EditorialHeader, MetricPanel, EmptyState, LoadingState. Dialog/Tabs built on Radix primitives for correct keyboard/focus semantics. Visual dev page at `/dev/design-system`.
- Authenticated application shell (`WorkspaceShell`) under `app/(workspace)/`: nav rail, course switcher, top context bar with save-state indicator, main workspace, right evidence panel. Responsive collapse to drawers below `md`/`lg`. Placeholder pages for home/documents/packs/artifacts/settings.
- Added Playwright e2e coverage for the design system page and the workspace shell (navigation, course switcher, mobile drawer), each with an axe accessibility scan. Found and fixed a real overlap bug where a duplicated `NavRail` render blocked the mobile menu button.

## 2026-07-15 — P-0 → M0.2 → T0.2.1, T0.2.2, T0.2.3

- Scaffolded Next.js 16 (App Router) + TypeScript strict + Tailwind v4 project.
- Repository shape from AGENTS.md §4.2 created under `app/`, `components/`, `lib/`, `workers/`, `prompts/`, `tests/`.
- Added Zod-based env validation (`lib/validation/env.ts`) with a clear-error contract on missing vars.
- Added Prettier, ESLint (via `create-next-app` defaults), Husky pre-commit + lint-staged.
- Added GitHub Actions CI (`.github/workflows/ci.yml`): format check, lint, typecheck, unit tests, build, e2e.
- Added Vitest (unit/integration) and Playwright + axe-core (e2e/accessibility) with passing example tests and synthetic-only fixtures.
- Added Drizzle ORM + `postgres` driver + `drizzle-kit` as the chosen ORM (decision logged in `docs/DECISIONS.md`).
- Created all required docs from AGENTS.md §1.3: this file, `README.md`, `docs/PRODUCT_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/PRIVACY.md`, `docs/TEST_PLAN.md`, `docs/PILOT_PLAN.md`, `docs/PROGRESS.md`.
