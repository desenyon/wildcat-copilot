# Changelog

Format: date, phase/milestone/task reference, summary. Newest first.

## 2026-07-17 — P-1 → M1.7 → T1.7.1: Real teacher home dashboard

- Replaced the `/home` placeholder with a real dashboard driven by `lib/dashboard/queries.ts` (`getHomeDashboardData`): time-saved metric (real sum over `teacher_feedback.estimated_minutes_saved`), recent exports (real `export_records` joined to `artifacts`), course cards with real per-course document/artifact counts, "continue recent work" (real recent documents), documents needing attention (real failed-processing rows), artifacts needing review (real `artifacts.status = 'needs_review'`), and a "Create weekly course pack" primary CTA placed so it's visible without scrolling on desktop, per the AGENTS.md acceptance criterion.
- Every section queries real tables scoped to the actor's own courses — no mocked or seeded data. The artifact/export/feedback tables are legitimately empty until M1.3's generation pipeline ships, so those sections render genuine empty states with a next-action link rather than fake placeholder rows.
- Verified in a real browser against real Postgres: two real courses render with accurate counts (2 documents / 0 artifacts and 0 / 0), recent documents list real uploaded titles, and empty-state sections correctly point toward `/documents` and `/packs`.
- `npm run typecheck`, `npm run lint`, and `npm run build` all clean before shipping.

## 2026-07-17 — P-1 → M1.2 → T1.2.6: Course profile synthesis (rule-based)

- Completes M1.2. New `lib/course-profile/synthesize.ts`: seven pure, unit-tested extractors (learning objectives, instruction style/vocabulary, assignment patterns, rubric patterns, communication tone, difficulty profile via Flesch reading ease, format preferences) that run over a course's already-extracted `document_chunks` text using keyword/regex/statistical heuristics — no LLM call, since no provider was chosen yet at the time (see docs/DECISIONS.md). Each field returns a confidence score and the real source document ids it was derived from.
- New `/course-profile` page (added to `NavRail`): renders every field with a color-coded confidence badge (not-yet-observed / low / medium / teacher-confirmed) and its source documents. `synthesizeCourseProfileAction` upserts `course_profiles` and bumps `version`; `updateCourseProfileFieldAction` lets a teacher correct any field via a raw-JSON edit dialog, which locks that field's confidence at exactly `1.0` so future re-synthesis skips it — the AGENTS.md acceptance criterion that "teacher corrections override inferred values."
- Verified end-to-end against the real app and real Postgres: ran synthesis against real uploaded documents (version 1, correct confidence levels, correct source attribution), corrected the low-confidence "Rubric patterns" field to a specific scale, re-ran synthesis (version bumped to 3), and confirmed via a direct `psql` query that the corrected field's confidence stayed `1` and its value was untouched while every other field recomputed normally.
- Found and fixed two real bugs while adding test coverage: (1) the point-of-view detector (`extractInstructionStyle`) skipped "you"/"your"/"I"/"we" entirely because they were being filtered out by the same stopword check used for vocabulary extraction, before the point-of-view counters ran; (2) the "common section" threshold in `extractAssignmentPatterns` used `count >= ceil(n/2)`, which for 2 documents let a section appearing in just one of them count as "common" — changed to a strict majority (`count > n/2`).
- `npm run typecheck`, `npm run lint`, `npm test` (40/40 passing, 11 new), and `npm run build` all clean before shipping.

## 2026-07-16 — P-1 → M1.2 → T1.2.3/T1.2.5: Document classification suggestions + interactive document library

- T1.2.3: added a filename-based keyword classifier (`lib/documents/classify.ts`) that suggests a document type per file at upload time. `DocumentUploadZone` no longer has one batch-level type selector — each queued file shows its own suggested type in an editable per-row `<select>`. Added `course_documents.document_type_confidence` (migration `0004`): `null` until classified, the suggestion's own confidence when accepted, `1.0` when the teacher explicitly picks or changes the type — mirroring how the rest of the product treats explicit teacher corrections vs. inferred values.
- T1.2.5: rebuilt `DocumentList` as an interactive client component, completing the AGENTS.md acceptance criteria beyond the original read-only table: client-side search by title, per-row document-type change, rename via dialog, reprocess (clears old chunks and re-enqueues a real pg-boss job) for processed/failed documents, remove gated by a destructive `ConfirmDialog`, and a preview dialog that fetches up to 1000 characters of real extracted text on open.
- Verified end-to-end against the real running app and real Postgres/pg-boss, not mocked: previewed real extracted PDF text in the dialog; renamed a document and watched the row update immediately; changed a document's type and confirmed via a direct Postgres query that `document_type_confidence` was set to exactly `1`; removed a document via the confirm dialog and confirmed the row was actually gone from Postgres; reprocessed a document and confirmed via the worker's own logs and a DB query that a real job ran and repopulated `document_chunks`.
- `npm run typecheck`, `npm run lint`, `npm test` (29/29 passing), and `npm run build` all clean before shipping.

## 2026-07-16 — P-1 → M1.2 → T1.2.2/T1.2.4: Real PDF/DOCX/PPTX extraction

- Added real (not mocked) text extraction for PDF, DOCX, and PPTX via `officeparser`, completing T1.2.2 (all 5 required formats now both accepted and extractable) and extending T1.2.4's extraction/chunking coverage from text/Markdown-only to all 5 formats.
- Verified with real files at every layer before wiring into the app: a standalone Node smoke test against hand-built real PDF/DOCX/PPTX buffers, then unit tests using the same fixtures, then a real end-to-end integration test (real file on disk → real worker → real chunk in Postgres), then a real upload through the actual running app in a browser — confirmed the exact extracted text in `document_chunks` via a direct Postgres query.
- Found and fixed two real bugs while building this out, neither of which were application bugs: (1) `officeparser`'s buffer auto-detection silently failed under Vitest's jsdom environment (fixed by passing an explicit `fileType` hint, which is more robust anyway); (2) a hand-built PDF test fixture used a page (`MediaBox`) too narrow for its text, causing `pdfjs-dist` to legitimately clip the extracted text at the page boundary — traced by testing with a plain Node script before assuming it was a code bug, then fixed the fixture.
- Embedding generation remains not implemented — needs a real LLM/embedding provider API key that hasn't been chosen or supplied yet (see `docs/DECISIONS.md`).

## 2026-07-16 — P-1 → M1.2 → T1.2.1: Document upload interface + real processing pipeline

- `/documents` is now course-scoped and functional: drag-and-drop + file picker + batch upload, allowed-formats list, a mandatory "no identifiable student data" confirmation gating the whole dropzone, real per-file upload progress (`XMLHttpRequest`), and per-file retry.
- Extended the T0.4.4 storage token to optionally carry a `documentId`, so `/api/storage/upload` can update the right `course_documents` row and enqueue a document-processing job on a successful upload — no separate "confirm upload" round trip needed.
- Implemented real (not mocked) text extraction + fixed-size overlapping chunking for plain text/Markdown in `workers/document-processing`, replacing the log-only stub from T0.4.5. PDF/DOCX/PPTX correctly fail with an honest `processing_error_code` (no parser library added yet) instead of being silently marked processed.
- Added a basic course-scoped document list (title/type/status/upload date).
- Verified end-to-end in a real browser against the real running app: a `.txt` upload reached "Processed" and its exact extracted text was confirmed in `document_chunks` via a direct Postgres query; a `.pdf` upload correctly reached "Failed". (Browser file-picker automation was sandboxed in this environment, so the upload itself was driven via a real `DataTransfer`-constructed `File` dispatched to the actual file input — same code path a real user drag-and-drop or file-picker selection triggers, not a shortcut around the app.)
- Found a real test-isolation bug while adding coverage: the new document-processing worker and an existing generic job test both registered on the same queue, and pg-boss round-robins jobs between every worker on a queue, causing flaky cross-test contamination. Fixed by moving the generic test to a queue with no other worker registered on it.

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
