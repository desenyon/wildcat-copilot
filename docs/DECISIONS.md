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
