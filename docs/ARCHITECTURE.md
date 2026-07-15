# Architecture

## 1. Stack

See AGENTS.md §4.1 and `README.md`. Notable choices logged in `docs/DECISIONS.md`.

## 2. Repository shape

```text
app/
  (marketing)/     public landing page routes
  (auth)/          sign-in / pilot access routes
  (workspace)/     authenticated teacher workspace routes
components/
  design-system/   tokens-driven primitives (buttons, panels, editorial headers, ...)
  courses/         course cards, switcher, dashboard sections
  artifacts/       artifact cards, editor, version timeline
  generation/       pack request flow, generation progress
  sources/         source trace panel, citation rendering
  analytics/       teacher-facing metrics/feedback widgets
lib/
  ai/              provider-agnostic LLM abstraction, prompt loading, pipeline stages
  auth/            session, authorization helpers
  db/              Drizzle schema + client
  documents/       parsing, chunking, classification
  retrieval/       hybrid retrieval + reranking over document chunks
  exports/         DOCX/PDF/Canvas HTML export
  privacy/         PII pattern detection, redaction helpers
  analytics/        event emission helpers
  validation/      Zod schemas, env validation
workers/
  document-processing/   parse/chunk/embed jobs
  generation/             pack planning + artifact generation jobs
  export/                 export rendering jobs
prompts/
  shared/          shared prompt fragments (tone, uncertainty language, ...)
  artifacts/       per-artifact-type prompt templates, versioned
  evaluators/       prompt-based quality evaluators (M6.3)
docs/
tests/
  unit/
  integration/
  e2e/
```

## 3. Core domain entities

Defined in AGENTS.md §4.3. Implemented as Drizzle schema under `lib/db/schema/` (one file per entity group), starting in **T0.4.3**. Not yet implemented as of this document's last update — see `docs/PROGRESS.md`.

## 4. AI pipeline (target shape, M1.3+)

Every generation request follows the 14-step pipeline in AGENTS.md §4.4: permission check → privacy check → artifact classification → retrieval → constraint extraction → structured plan → section-by-section generation → field validation → source support checks → policy/privacy checks → save versions + citations → stream progress → teacher review → capture feedback.

Model providers are called only from `lib/ai` / `workers/generation`, never from browser code or page components (AGENTS.md §1.5 rules 5–6).

## 5. Retrieval

Course-scoped hybrid retrieval (semantic + keyword) with reranking, per AGENTS.md §4.5. Citations must resolve to an actual stored `DocumentChunk` — never fabricated.

## 6. Environments

Local / development / staging / production with separate databases, storage, and secrets (P-5 → M5.4 → T5.4.3). Not yet implemented; local-only during P-0/P-1 development.

## 7. Status

This document describes the target architecture from AGENTS.md. Implementation status is tracked in `docs/PROGRESS.md`; update both together when a milestone changes the actual shape of the system.
