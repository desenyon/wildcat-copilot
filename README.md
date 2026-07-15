# Wildcat Copilot

Private, course-aware teacher operations workspace. Working product name; see `AGENTS.md` for the full product mandate and phase plan.

## Stack

- Next.js (App Router) + TypeScript (strict)
- Tailwind CSS v4
- PostgreSQL + Drizzle ORM (`postgres` driver) + pgvector
- Clerk (identity/sessions) + our own `users`/`organizations` tables for authorization, pilot allowlist
- pg-boss for background jobs (document processing / generation / export queues)
- Local filesystem object storage adapter behind a provider-agnostic interface
- Zod for env and request/response validation
- Vitest (unit/integration) + Testing Library
- Playwright + axe-core (e2e + accessibility)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values
docker compose up -d          # local Postgres + pgvector
npm run db:migrate
npm run dev
```

Open http://localhost:3000. Run `npm run workers` in a separate terminal to process background jobs (document processing, generation, export).

## Scripts

| Script                                             | Purpose                                    |
| -------------------------------------------------- | ------------------------------------------ |
| `npm run dev`                                      | Start the dev server                       |
| `npm run build`                                    | Production build                           |
| `npm run lint`                                     | ESLint                                     |
| `npm run typecheck`                                | `tsc --noEmit`                             |
| `npm run format` / `format:check`                  | Prettier                                   |
| `npm test` / `test:watch`                          | Vitest unit + integration tests            |
| `npm run test:e2e`                                 | Playwright end-to-end tests                |
| `npm run db:generate` / `db:migrate` / `db:studio` | Drizzle Kit                                |
| `npm run workers`                                  | Start the background job workers (pg-boss) |

A pre-commit hook (Husky + lint-staged) runs lint/format on staged files. CI (`.github/workflows/ci.yml`) runs format check, lint, typecheck, migrations, unit/integration tests against a real Postgres service container, build, and e2e tests on every push/PR.

## Documentation

See `docs/` for the product spec, architecture, decision log, privacy baseline, test plan, pilot plan, progress log, and changelog. `AGENTS.md` is the authoritative phase/milestone/task plan and agent operating contract.
