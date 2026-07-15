# Changelog

Format: date, phase/milestone/task reference, summary. Newest first.

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
