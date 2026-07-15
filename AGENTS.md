# AGENTS.md

## 0. Project mandate

### 0.1 Product name

Working product name: **Wildcat Copilot**

The name is provisional. Product behavior, architecture, and teacher value are not provisional.

### 0.2 Mission

Build a private, course aware teacher operations workspace that learns from each teacher's existing curriculum, preferences, and school context, then converts that context into editable lesson materials, assessments, rubrics, feedback, communications, and Canvas ready workflows.

The product must save teachers measurable time without removing teacher judgment.

### 0.3 Core product thesis

Generic teacher chatbots require the teacher to repeatedly explain the course. Wildcat Copilot maintains a persistent, source grounded course memory and uses it to create complete teacher workflows rather than isolated AI responses.

### 0.4 Primary user

The primary user is an LGHS teacher who already uses Google Drive, Google Docs, and Canvas, has limited time, and needs reliable outputs that match an existing course.

### 0.5 Initial user promise

A teacher can upload a syllabus, previous assignments, rubrics, and lesson materials, then generate a complete weekly course pack that reflects the teacher's actual course and can be edited, traced to sources, and exported.

### 0.6 Product principles

1. Teacher control is mandatory.
2. Every generated artifact is editable.
3. Every artifact must show which course sources informed it.
4. The system must prefer grounded context over generic model knowledge.
5. No automated final grading in P-1.
6. No identifiable student data in P-1.
7. The interface must feel like a professional teacher workspace, not a blank chatbot.
8. Time saved is the primary success metric.
9. Fewer deeply used workflows are better than many shallow generators.
10. The product must be useful before Canvas or district level integration is approved.

### 0.7 Non goals for P-1

1. Replacing Canvas.
2. Replacing the teacher.
3. Automatically assigning final grades.
4. Ingesting named student records.
5. Sending parent or student messages without explicit teacher review.
6. Building a general student tutoring product.
7. Supporting every school district before the LGHS pilot succeeds.
8. Creating a marketplace of public prompts.

## 1. Agent operating contract

### 1.1 Required execution hierarchy

Every implementation unit must belong to exactly one hierarchy:

**Phase → Milestone → Task**

Examples:

**P-1 → M1.3 → T1.3.2**

A task may not begin until its parent milestone has clear acceptance criteria and all blocking dependencies are complete.

### 1.2 Status values

Each task must use one status:

1. `NOT_STARTED`
2. `IN_PROGRESS`
3. `BLOCKED`
4. `IN_REVIEW`
5. `DONE`

### 1.3 Required project files

Agents must maintain the following files:

1. `AGENTS.md`
2. `README.md`
3. `docs/PRODUCT_SPEC.md`
4. `docs/ARCHITECTURE.md`
5. `docs/DECISIONS.md`
6. `docs/PRIVACY.md`
7. `docs/TEST_PLAN.md`
8. `docs/PILOT_PLAN.md`
9. `docs/PROGRESS.md`
10. `docs/CHANGELOG.md`

### 1.4 Task completion rule

A task is complete only when all applicable items are true:

1. The implementation exists.
2. The implementation is reachable through the product.
3. Unit tests exist for core logic.
4. Integration tests exist for important cross component behavior.
5. The user facing state includes loading, empty, success, and error behavior.
6. Accessibility is checked.
7. Analytics events are emitted where required.
8. Documentation is updated.
9. No student personally identifiable information appears in logs, fixtures, screenshots, or analytics.
10. The task acceptance criteria pass.

### 1.5 Agent behavior rules

1. Work on one task at a time unless parallel work is explicitly safe.
2. Do not silently expand scope.
3. Do not replace a required feature with a mock and mark it complete.
4. Do not claim an integration works until it has been tested against the target API or a contract accurate local emulator.
5. Do not put model prompts directly in page components.
6. Do not call model providers directly from the browser.
7. Do not persist raw model reasoning.
8. Do not log uploaded document text.
9. Do not use real student information in development.
10. Do not allow generated content to bypass teacher review.
11. Record architectural decisions in `docs/DECISIONS.md`.
12. Record blocked work with the exact blocker and proposed resolution.
13. Preserve backwards compatibility for stored course data unless a migration is included.
14. Prefer small composable modules over monolithic services.
15. Verify before refactoring.

## 2. Product success criteria

### 2.1 P-1 success criteria

P-1 is successful when all of the following are true:

1. Three pilot teachers can independently create accounts and courses.
2. Each teacher can upload and process course materials.
3. Each teacher can generate a weekly course pack containing at least five useful artifacts.
4. Every generated artifact includes source references.
5. Every artifact can be edited and exported.
6. Teacher edits and explicit ratings are captured.
7. No identifiable student data is required.
8. Median weekly pack generation completes within 90 seconds.
9. At least 70 percent of generated artifacts are exported or meaningfully edited.
10. Pilot teachers report at least one hour saved per week after two weeks of use.

### 2.2 Pilot metrics

Track the following metrics from the beginning:

1. Weekly active teachers.
2. Courses created.
3. Documents processed.
4. Weekly packs generated.
5. Artifacts generated.
6. Artifact export rate.
7. Artifact edit rate.
8. Artifact regeneration rate.
9. Explicit usefulness rating.
10. Estimated minutes saved.
11. Four week teacher retention.
12. Generation error rate.
13. Source citation coverage.
14. Average time to first useful artifact.
15. Percentage of teacher sessions that begin from a structured action rather than free chat.

## 3. Visual direction

### 3.1 Reference character

Use the attached Poetic reference as inspiration for visual discipline, not as a template to copy.

The visual language must contain:

1. Strong black and white contrast.
2. Large editorial typography.
3. Generous white space.
4. Thin structural rules.
5. Dense black information panels.
6. A restrained electric blue accent.
7. Minimal rounded corners.
8. Direct language.
9. Large numbers for measurable outcomes.
10. Clear hierarchy with very little decoration.

### 3.2 Brand tone

The product should feel precise, trustworthy, calm, and technically capable.

Avoid:

1. Cartoon school graphics.
2. Gradient heavy AI visuals.
3. Robot illustrations.
4. Decorative glass effects.
5. Excessive shadows.
6. Floating cards without hierarchy.
7. Generic purple AI branding.
8. Dense chat bubbles as the primary interface.
9. Childlike education design.
10. Copy that overstates what AI can do.

### 3.3 Color system

Use semantic tokens rather than hard coded values.

1. `canvas`: warm white or near white.
2. `ink`: near black.
3. `panel`: true black.
4. `panelText`: white.
5. `accent`: electric blue.
6. `muted`: neutral gray.
7. `rule`: light neutral gray.
8. `success`: accessible green.
9. `warning`: accessible amber.
10. `danger`: accessible red.

The accent must be used sparingly for focus, state, selection, progress, and key actions.

### 3.4 Typography

1. Use a high quality sans serif system.
2. Display headings should be tightly spaced and large.
3. Body copy should remain highly readable.
4. Use tabular numerals for metrics.
5. Limit the type scale to a small, consistent set.
6. Do not use more than two font families.
7. Support 200 percent browser zoom without content loss.

### 3.5 Layout system

1. Use a twelve column desktop grid.
2. Use consistent page margins.
3. Keep high value content aligned to the grid.
4. Use thin horizontal rules to separate sections.
5. Use four column metric or workflow grids on large screens.
6. Collapse to two columns on tablets and one column on mobile.
7. Avoid excessive maximum width constraints on data rich pages.
8. Maintain comfortable line lengths for prose and generated artifacts.

### 3.6 Marketing page structure

The public landing page should contain:

1. Minimal top navigation.
2. Large direct hero statement.
3. One sentence product explanation.
4. Primary call to action for teacher pilot access.
5. Four black metric panels showing real pilot outcomes once available.
6. Course memory explanation.
7. Weekly course pack workflow.
8. Teacher control and source trace section.
9. Privacy section.
10. Pilot testimonials.
11. Final call to action.

Before real metrics exist, use capability panels rather than invented numbers.

### 3.7 Application shell

The authenticated product should use:

1. A narrow left navigation rail.
2. A clear course switcher.
3. A top context bar with current course, current task, and save state.
4. A main workspace optimized for documents and structured actions.
5. A right evidence panel for sources, constraints, and version history.
6. Black summary panels for metrics and high priority actions.
7. White document surfaces for editing.
8. Blue accent for selection and progress.

### 3.8 Core interface components

Build reusable components for:

1. `EditorialHeader`
2. `MetricPanel`
3. `CourseCard`
4. `ActionTile`
5. `ArtifactCard`
6. `ArtifactEditor`
7. `SourceTracePanel`
8. `DocumentUploadZone`
9. `ProcessingStatus`
10. `GenerationProgress`
11. `VersionTimeline`
12. `TeacherFeedbackBar`
13. `PrivacyNotice`
14. `EmptyState`
15. `InlineError`
16. `ConfirmDialog`
17. `ExportMenu`
18. `CommandPalette`
19. `CourseSwitcher`
20. `MilestoneProgressPanel`

## 4. Technical architecture

### 4.1 Recommended stack

1. Next.js with App Router.
2. TypeScript with strict mode.
3. React Server Components where appropriate.
4. Tailwind CSS with design tokens.
5. PostgreSQL.
6. pgvector for semantic retrieval.
7. Drizzle ORM or Prisma, selected once and documented.
8. Object storage for uploaded files.
9. A background job system for parsing and generation.
10. A provider abstraction for large language models.
11. OpenTelemetry compatible observability.
12. Playwright for end to end tests.
13. Vitest for unit and integration tests.
14. Zod for request and response validation.
15. Google OAuth for teacher authentication.

### 4.2 Repository shape

```text
app/
  (marketing)/
  (auth)/
  (workspace)/
components/
  design-system/
  courses/
  artifacts/
  generation/
  sources/
  analytics/
lib/
  ai/
  auth/
  db/
  documents/
  retrieval/
  exports/
  privacy/
  analytics/
  validation/
workers/
  document-processing/
  generation/
  export/
prompts/
  shared/
  artifacts/
  evaluators/
docs/
tests/
  unit/
  integration/
  e2e/
```

### 4.3 Core domain entities

#### Organization

Fields:

1. `id`
2. `name`
3. `slug`
4. `timezone`
5. `dataRetentionPolicy`
6. `createdAt`
7. `updatedAt`

#### User

Fields:

1. `id`
2. `organizationId`
3. `email`
4. `displayName`
5. `role`
6. `authProvider`
7. `createdAt`
8. `lastActiveAt`

#### Course

Fields:

1. `id`
2. `organizationId`
3. `ownerUserId`
4. `name`
5. `subject`
6. `gradeBand`
7. `academicTerm`
8. `description`
9. `defaultClassDurationMinutes`
10. `status`
11. `createdAt`
12. `updatedAt`

#### CourseDocument

Fields:

1. `id`
2. `courseId`
3. `uploadedByUserId`
4. `title`
5. `documentType`
6. `mimeType`
7. `storageKey`
8. `checksum`
9. `processingStatus`
10. `processingErrorCode`
11. `containsStudentData`
12. `createdAt`
13. `updatedAt`

#### DocumentChunk

Fields:

1. `id`
2. `courseDocumentId`
3. `courseId`
4. `sequenceNumber`
5. `text`
6. `embedding`
7. `pageNumber`
8. `sectionTitle`
9. `metadata`
10. `createdAt`

#### CourseProfile

Fields:

1. `id`
2. `courseId`
3. `learningObjectives`
4. `instructionStyle`
5. `assignmentPatterns`
6. `rubricPatterns`
7. `communicationTone`
8. `difficultyProfile`
9. `formatPreferences`
10. `confidenceByField`
11. `sourceDocumentIds`
12. `version`
13. `updatedAt`

#### GenerationRequest

Fields:

1. `id`
2. `courseId`
3. `requestedByUserId`
4. `generationType`
5. `inputPayload`
6. `status`
7. `modelProvider`
8. `modelName`
9. `promptVersion`
10. `startedAt`
11. `completedAt`
12. `errorCode`
13. `costMetadata`

#### Artifact

Fields:

1. `id`
2. `courseId`
3. `generationRequestId`
4. `artifactType`
5. `title`
6. `contentJson`
7. `contentText`
8. `status`
9. `currentVersionId`
10. `createdAt`
11. `updatedAt`

#### ArtifactVersion

Fields:

1. `id`
2. `artifactId`
3. `versionNumber`
4. `contentJson`
5. `contentText`
6. `createdByType`
7. `createdByUserId`
8. `changeSummary`
9. `createdAt`

#### SourceCitation

Fields:

1. `id`
2. `artifactVersionId`
3. `courseDocumentId`
4. `documentChunkId`
5. `artifactSectionId`
6. `relevanceScore`
7. `quotedExcerpt`
8. `createdAt`

#### TeacherFeedback

Fields:

1. `id`
2. `artifactId`
3. `artifactVersionId`
4. `userId`
5. `rating`
6. `reasonCodes`
7. `freeText`
8. `estimatedMinutesSaved`
9. `createdAt`

#### TeacherPreference

Fields:

1. `id`
2. `userId`
3. `courseId`
4. `preferenceKey`
5. `preferenceValue`
6. `confidence`
7. `evidenceCount`
8. `sourceType`
9. `updatedAt`

#### ExportRecord

Fields:

1. `id`
2. `artifactId`
3. `artifactVersionId`
4. `userId`
5. `exportType`
6. `destinationMetadata`
7. `createdAt`

#### AuditEvent

Fields:

1. `id`
2. `organizationId`
3. `actorUserId`
4. `action`
5. `resourceType`
6. `resourceId`
7. `metadata`
8. `createdAt`

### 4.4 AI pipeline

Every generation request must follow this pipeline:

1. Validate user permissions.
2. Validate that the request does not contain prohibited student data for the current phase.
3. Classify the requested artifact set.
4. Retrieve relevant course documents.
5. Extract explicit constraints.
6. Build a structured generation plan.
7. Generate artifacts section by section.
8. Validate required fields.
9. Run source support checks.
10. Run policy and privacy checks.
11. Save artifact versions and citations.
12. Stream progress to the user.
13. Request teacher review.
14. Capture teacher edits and feedback.

### 4.5 Retrieval rules

1. Retrieval must be scoped to the active course.
2. Prefer explicit teacher selected sources.
3. Prefer recent approved course materials when conflicts exist.
4. Preserve page and section metadata.
5. Never cite a source that was not retrieved.
6. Every citation must map to an actual stored chunk.
7. Use hybrid retrieval that combines semantic similarity and keyword matching.
8. Rerank retrieved chunks before generation.
9. Keep retrieval traces for internal debugging without exposing hidden model reasoning.
10. Allow the teacher to remove a source and regenerate.

### 4.6 Prompt rules

1. Prompts live in versioned files under `prompts/`.
2. Prompts use structured inputs and structured outputs.
3. Prompts must distinguish source facts from model suggestions.
4. Prompts must not ask the model to infer protected student attributes.
5. Prompts must require uncertainty when sources are insufficient.
6. Prompt versions must be attached to generation requests.
7. Prompt changes require evaluation against a fixed test set.
8. No prompt should claim an artifact is correct without verification.

### 4.7 Privacy baseline

P-1 must enforce the following:

1. No student names.
2. No grades tied to names.
3. No parent contact information.
4. No health information.
5. No disability or accommodation records.
6. No discipline records.
7. No student identifiers.
8. No raw uploaded text in analytics.
9. No raw uploaded text in application logs.
10. No model training on customer content by default.
11. Clear file deletion controls.
12. Clear course deletion controls.
13. Short lived signed URLs for uploaded files.
14. Encryption in transit and at rest.
15. Least privilege service access.

## 5. Phase plan

# Phase P-0: Foundation and discovery

## Milestone M0.1: Product definition

### Goal

Convert the product thesis into a testable and constrained specification before implementation expands.

### Tasks

#### Task T0.1.1: Write the product specification

Status: `NOT_STARTED`

Requirements:

1. Define the primary teacher persona.
2. Define the weekly course pack workflow.
3. Define P-1 inputs and outputs.
4. Define P-1 privacy boundaries.
5. Define measurable pilot outcomes.
6. Define explicit non goals.

Acceptance criteria:

1. `docs/PRODUCT_SPEC.md` exists.
2. Every P-1 feature maps to a teacher problem.
3. Every feature has a measurable outcome.
4. Scope does not require Canvas approval.

#### Task T0.1.2: Conduct teacher discovery interviews

Status: `NOT_STARTED`

Requirements:

1. Interview at least ten teachers.
2. Include at least three departments.
3. Ask about repetitive work, current AI use, trust, privacy, and Canvas friction.
4. Record themes without storing student data.
5. Rank workflows by frequency, pain, and feasibility.

Acceptance criteria:

1. A summarized findings document exists.
2. The top three workflows are supported by repeated evidence.
3. P-1 scope is updated based on findings.

#### Task T0.1.3: Define pilot cohort

Status: `NOT_STARTED`

Requirements:

1. Recruit three initial design partners.
2. Include one writing intensive teacher.
3. Include one quantitative or laboratory teacher.
4. Include one elective or world language teacher.
5. Establish weekly feedback sessions.

Acceptance criteria:

1. Three teachers have agreed to participate.
2. Each teacher has a scheduled onboarding session.
3. Pilot expectations are documented.

## Milestone M0.2: Repository and engineering baseline

### Goal

Create a reliable implementation environment with strict quality controls.

### Tasks

#### Task T0.2.1: Initialize repository

Status: `NOT_STARTED`

Requirements:

1. Create the Next.js application.
2. Enable TypeScript strict mode.
3. Configure linting and formatting.
4. Add environment validation.
5. Add commit hooks.
6. Add CI for type checks, tests, and builds.

Acceptance criteria:

1. A clean checkout builds successfully.
2. CI passes on the default branch.
3. Missing environment variables fail with clear errors.

#### Task T0.2.2: Create documentation system

Status: `NOT_STARTED`

Requirements:

1. Create all required documentation files.
2. Add a decision record template.
3. Add a task progress template.
4. Add release notes structure.

Acceptance criteria:

1. Required files exist.
2. Agents can locate current scope, architecture, and progress without searching chat history.

#### Task T0.2.3: Add test infrastructure

Status: `NOT_STARTED`

Requirements:

1. Configure Vitest.
2. Configure Playwright.
3. Add test database isolation.
4. Add deterministic fixtures.
5. Add accessibility checks to major page tests.

Acceptance criteria:

1. Unit, integration, and end to end test examples pass.
2. Tests run in CI.
3. No fixture contains real student information.

## Milestone M0.3: Design system

### Goal

Translate the visual reference into a reusable and accessible product system.

### Tasks

#### Task T0.3.1: Implement design tokens

Status: `NOT_STARTED`

Requirements:

1. Define color tokens.
2. Define spacing tokens.
3. Define typography tokens.
4. Define border and rule tokens.
5. Define motion tokens.
6. Define light and dark panel behavior.

Acceptance criteria:

1. No feature component uses arbitrary color values.
2. Contrast meets WCAG AA.
3. The system supports responsive layouts.

#### Task T0.3.2: Build foundational components

Status: `NOT_STARTED`

Requirements:

1. Build buttons, inputs, selects, dialogs, tabs, tables, panels, and notices.
2. Build editorial headings and metric panels.
3. Build loading and error states.
4. Build keyboard focus states.

Acceptance criteria:

1. Components are documented in a visual development page.
2. Components work with keyboard navigation.
3. Components remain usable at 200 percent zoom.

#### Task T0.3.3: Build authenticated application shell

Status: `NOT_STARTED`

Requirements:

1. Add left navigation.
2. Add course switcher.
3. Add top context bar.
4. Add main editor workspace.
5. Add right evidence panel.
6. Add responsive behavior.

Acceptance criteria:

1. Shell supports all planned P-1 pages.
2. Navigation works without full page reloads.
3. Mobile layout remains functional.

## Milestone M0.4: Data and service foundation

### Goal

Establish durable data storage, authentication, authorization, file storage, and background processing.

### Tasks

#### Task T0.4.1: Implement authentication

Status: `NOT_STARTED`

Requirements:

1. Add Google OAuth.
2. Restrict pilot access by allowlist or invitation.
3. Create user records on first sign in.
4. Add secure session handling.
5. Add sign out and account deletion entry points.

Acceptance criteria:

1. Invited teachers can sign in.
2. Uninvited users receive a clear pilot access message.
3. Session expiry behaves correctly.

#### Task T0.4.2: Implement authorization

Status: `NOT_STARTED`

Requirements:

1. Add organization roles.
2. Add course ownership checks.
3. Prevent cross course and cross organization access.
4. Add server side authorization helpers.
5. Add authorization tests.

Acceptance criteria:

1. A user cannot access another teacher's course by changing a URL.
2. All protected operations enforce server side authorization.

#### Task T0.4.3: Implement database schema

Status: `NOT_STARTED`

Requirements:

1. Create core entities.
2. Add migrations.
3. Add indexes for course, document, artifact, and analytics queries.
4. Add soft deletion only where justified.
5. Add cascading deletion behavior.

Acceptance criteria:

1. Migrations apply on a clean database.
2. Schema tests verify constraints.
3. Course deletion removes or schedules deletion of dependent data.

#### Task T0.4.4: Implement object storage

Status: `NOT_STARTED`

Requirements:

1. Add private upload storage.
2. Add signed upload URLs.
3. Add signed download URLs.
4. Validate file type and size.
5. Add malware scanning integration point.
6. Add deletion behavior.

Acceptance criteria:

1. Uploaded files are not public.
2. Expired signed URLs stop working.
3. Unsupported files are rejected with a useful message.

#### Task T0.4.5: Implement background jobs

Status: `NOT_STARTED`

Requirements:

1. Add queues for document parsing, embedding, generation, and export.
2. Add retries with bounded backoff.
3. Add dead letter handling.
4. Add idempotency keys.
5. Add job status events.

Acceptance criteria:

1. Duplicate requests do not create duplicate artifacts.
2. Failed jobs can be retried.
3. Users can see accurate processing state.

# Phase P-1: MVP

P-1 is the first teacher usable product. Do not add advanced student data workflows before all P-1 acceptance criteria pass.

## Milestone M1.1: Teacher onboarding and course creation

### Goal

Allow a teacher to reach a useful course workspace in less than five minutes.

### Tasks

#### Task T1.1.1: Build pilot welcome flow

Status: `NOT_STARTED`

Requirements:

1. Explain the product in one screen.
2. State the privacy boundaries.
3. Explain that outputs require teacher review.
4. Collect consent to pilot analytics.
5. Provide a direct create course action.

Acceptance criteria:

1. A first time teacher understands what the product does.
2. No critical information is hidden in legal language.
3. The flow is keyboard accessible.

#### Task T1.1.2: Build course creation

Status: `NOT_STARTED`

Requirements:

1. Collect course name.
2. Collect subject.
3. Collect grade band.
4. Collect academic term.
5. Collect typical class duration.
6. Collect optional course description.

Acceptance criteria:

1. Course creation takes less than two minutes.
2. Required fields are validated.
3. The teacher lands in the course setup workflow.

#### Task T1.1.3: Build teacher style questionnaire

Status: `NOT_STARTED`

Requirements:

1. Ask preferred instruction detail.
2. Ask preferred assignment rigor.
3. Ask preferred feedback length.
4. Ask preferred communication tone.
5. Ask common class structure.
6. Allow skipping and later editing.

Acceptance criteria:

1. Questionnaire completion updates the course profile.
2. Skipping does not block the teacher.
3. Preferences appear in generation previews.

#### Task T1.1.4: Build course settings

Status: `NOT_STARTED`

Requirements:

1. Edit course metadata.
2. Edit teacher preferences.
3. View data usage.
4. Delete course.
5. Export course data.

Acceptance criteria:

1. Destructive actions require confirmation.
2. Course deletion behavior matches the privacy policy.

## Milestone M1.2: Course material ingestion

### Goal

Turn teacher owned materials into a searchable and inspectable course memory.

### Tasks

#### Task T1.2.1: Build upload interface

Status: `NOT_STARTED`

Requirements:

1. Support drag and drop.
2. Support file picker.
3. Support batch upload.
4. Show allowed formats.
5. Show privacy warning.
6. Require confirmation that files do not contain identifiable student data.

Acceptance criteria:

1. Teacher can upload multiple supported documents.
2. Upload progress is visible.
3. Failed files can be retried individually.

#### Task T1.2.2: Support initial document formats

Status: `NOT_STARTED`

Required formats:

1. PDF.
2. DOCX.
3. PPTX.
4. Plain text.
5. Markdown.

Acceptance criteria:

1. Text is extracted with page or slide references where available.
2. Empty or image only files receive a clear status.
3. Extraction failures do not block other files.

#### Task T1.2.3: Classify uploaded documents

Status: `NOT_STARTED`

Document types:

1. Syllabus.
2. Assignment.
3. Rubric.
4. Lesson plan.
5. Slide deck.
6. Reading.
7. Assessment.
8. Department standard.
9. Other.

Acceptance criteria:

1. The system suggests a type.
2. The teacher can override the type.
3. Classification confidence is stored.

#### Task T1.2.4: Parse, chunk, and embed documents

Status: `NOT_STARTED`

Requirements:

1. Preserve headings.
2. Preserve page or slide numbers.
3. Preserve list and table text where feasible.
4. Create overlapping chunks.
5. Generate embeddings.
6. Store processing diagnostics.

Acceptance criteria:

1. Search returns relevant sections from pilot documents.
2. Every chunk maps back to an original document location.
3. Processing is idempotent by file checksum.

#### Task T1.2.5: Build document library

Status: `NOT_STARTED`

Requirements:

1. Show processing state.
2. Filter by document type.
3. Search by title and content.
4. Preview extracted text.
5. Rename document.
6. Change document type.
7. Remove document.
8. Reprocess document.

Acceptance criteria:

1. Teacher can understand what the system has processed.
2. Removed documents are excluded from future retrieval.

#### Task T1.2.6: Build course profile synthesis

Status: `NOT_STARTED`

Requirements:

1. Extract recurring learning objectives.
2. Extract assignment patterns.
3. Extract rubric patterns.
4. Extract tone and formatting preferences.
5. Extract course vocabulary.
6. Attach sources and confidence to each profile field.
7. Allow teacher correction.

Acceptance criteria:

1. The profile shows source backed observations.
2. Teacher corrections override inferred values.
3. Low confidence fields are visibly marked.

## Milestone M1.3: Weekly Course Pack

### Goal

Generate a complete and coherent set of teacher ready materials for a defined instructional period.

### Tasks

#### Task T1.3.1: Build pack request form

Status: `NOT_STARTED`

Requirements:

1. Select course.
2. Enter topic or unit.
3. Select date range.
4. Enter learning objectives.
5. Select class duration.
6. Select desired artifacts.
7. Select source documents.
8. Enter constraints.
9. Select rigor level.
10. Review active course preferences.

Acceptance criteria:

1. Teacher can create a request without writing a complex prompt.
2. Required inputs are clearly distinguished.
3. The form can be saved as a draft.

#### Task T1.3.2: Implement pack planning stage

Status: `NOT_STARTED`

Requirements:

1. Convert teacher input into a structured plan.
2. Map objectives to class sessions.
3. Identify required source context.
4. Identify missing information.
5. Ask at most three high value clarification questions.
6. Allow the teacher to approve or edit the plan.

Acceptance criteria:

1. The teacher sees the plan before full generation.
2. The plan contains no invented school schedule information.
3. Missing evidence is disclosed.

#### Task T1.3.3: Generate lesson sequence

Status: `NOT_STARTED`

Each lesson must include:

1. Objective.
2. Materials.
3. Warmup.
4. Direct instruction or guided activity.
5. Student practice.
6. Formative check.
7. Closure.
8. Estimated timing.
9. Teacher notes.
10. Source citations.

Acceptance criteria:

1. Session times fit the configured class duration.
2. Activities align with stated objectives.
3. Citations are attached to source dependent content.

#### Task T1.3.4: Generate assignment

Status: `NOT_STARTED`

Each assignment must include:

1. Student facing title.
2. Purpose.
3. Instructions.
4. Required deliverables.
5. Success criteria.
6. Estimated completion time.
7. Academic integrity note.
8. Teacher notes.
9. Source citations.

Acceptance criteria:

1. Instructions are complete enough to assign.
2. Requirements align with the generated rubric.
3. The artifact is fully editable.

#### Task T1.3.5: Generate rubric

Status: `NOT_STARTED`

Requirements:

1. Criteria align with assignment requirements.
2. Performance levels are distinct.
3. Descriptors are observable.
4. Point values are optional.
5. Total points are validated when enabled.
6. Teacher can change scale and weights.
7. Source citations show related prior rubrics.

Acceptance criteria:

1. No criterion evaluates a requirement absent from the assignment.
2. Point totals are mathematically correct.
3. Teacher can add, remove, and reorder criteria.

#### Task T1.3.6: Generate formative assessment

Status: `NOT_STARTED`

Requirements:

1. Create an exit ticket or short check.
2. Include answer guidance.
3. Map each item to an objective.
4. Include common misconception notes.
5. Support selected response and constructed response items.

Acceptance criteria:

1. Every item has a valid answer or scoring guide.
2. Items fit within the requested time.
3. Questions do not depend on unsupported facts.

#### Task T1.3.7: Generate Canvas announcement

Status: `NOT_STARTED`

Requirements:

1. Summarize the upcoming work.
2. State dates only from teacher provided information.
3. Include preparation expectations.
4. Use the teacher's communication tone.
5. Provide concise and detailed versions.

Acceptance criteria:

1. No message is sent automatically.
2. Teacher can copy or export the message.

#### Task T1.3.8: Generate differentiation options

Status: `NOT_STARTED`

Initial options:

1. Scaffolded version.
2. Advanced extension.
3. Vocabulary support.
4. Shortened task structure.

Acceptance criteria:

1. The core learning objective remains constant.
2. The system explains what changed.
3. The system does not claim to satisfy an individual accommodation plan.

#### Task T1.3.9: Stream generation progress

Status: `NOT_STARTED`

Requirements:

1. Show current generation stage.
2. Show completed artifacts.
3. Allow leaving and returning.
4. Preserve partial success.
5. Allow retrying failed artifacts.

Acceptance criteria:

1. The user never sees a frozen interface during long work.
2. One artifact failure does not discard completed artifacts.

## Milestone M1.4: Artifact workspace

### Goal

Make generated work easy to inspect, revise, compare, and approve.

### Tasks

#### Task T1.4.1: Build artifact collection view

Status: `NOT_STARTED`

Requirements:

1. Show all artifacts in a pack.
2. Show type, status, edit state, and export state.
3. Allow reorder.
4. Allow hide or delete.
5. Allow regenerate one artifact.

Acceptance criteria:

1. Teacher can understand the pack at a glance.
2. Regeneration does not alter other artifacts.

#### Task T1.4.2: Build structured artifact editor

Status: `NOT_STARTED`

Requirements:

1. Rich text editing.
2. Headings, lists, tables, callouts, and links.
3. Autosave.
4. Keyboard shortcuts.
5. Undo and redo.
6. Paste cleanup.
7. Section level regeneration.
8. Plain text fallback.

Acceptance criteria:

1. Teacher edits are never overwritten by background generation.
2. Autosave state is visible.
3. Editor works with keyboard only.

#### Task T1.4.3: Build section level actions

Status: `NOT_STARTED`

Actions:

1. Make more concise.
2. Add detail.
3. Increase rigor.
4. Reduce complexity.
5. Change tone.
6. Align more closely to selected source.
7. Regenerate section.
8. Revert section.

Acceptance criteria:

1. Actions apply only to the selected section.
2. Existing teacher edits outside the section remain unchanged.
3. A new artifact version is created.

#### Task T1.4.4: Build version history

Status: `NOT_STARTED`

Requirements:

1. Save model and teacher versions.
2. Show timestamps.
3. Show change summaries.
4. Compare two versions.
5. Restore a prior version.

Acceptance criteria:

1. Restore creates a new version rather than deleting history.
2. Teacher can distinguish model changes from manual changes.

#### Task T1.4.5: Build artifact approval state

Status: `NOT_STARTED`

States:

1. Draft.
2. Needs review.
3. Approved.
4. Exported.
5. Archived.

Acceptance criteria:

1. No artifact is represented as teacher approved before explicit action.
2. Approval state is visible in pack and artifact views.

## Milestone M1.5: Source trace and trust

### Goal

Make generated content inspectable and grounded in teacher owned materials.

### Tasks

#### Task T1.5.1: Build source citation rendering

Status: `NOT_STARTED`

Requirements:

1. Show source markers inline or at section level.
2. Display document title.
3. Display page, slide, or section location.
4. Display a short supporting excerpt.
5. Open the related document preview.

Acceptance criteria:

1. Every citation points to a stored source chunk.
2. Unsupported content is marked as a model suggestion.

#### Task T1.5.2: Build evidence side panel

Status: `NOT_STARTED`

Requirements:

1. Show sources for the selected section.
2. Show active teacher preferences.
3. Show generation constraints.
4. Show model suggestion warnings.
5. Allow removing a source and regenerating.

Acceptance criteria:

1. The teacher can determine why a section was generated.
2. Evidence updates as the selection changes.

#### Task T1.5.3: Implement citation coverage checks

Status: `NOT_STARTED`

Requirements:

1. Detect factual or source dependent sections.
2. Verify citation presence.
3. Flag unsupported claims.
4. Prevent false citation IDs.
5. Record citation coverage metrics.

Acceptance criteria:

1. Fabricated citation references fail validation.
2. Source dependent artifacts meet the configured citation threshold.

#### Task T1.5.4: Implement uncertainty language

Status: `NOT_STARTED`

Requirements:

1. Mark missing course information.
2. Avoid inventing dates, policies, or prior teacher preferences.
3. Suggest teacher review when evidence is weak.
4. Distinguish course sourced content from general suggestions.

Acceptance criteria:

1. Low evidence generations are visibly different from strongly grounded generations.

## Milestone M1.6: Teacher feedback and preference learning

### Goal

Capture explicit teacher judgment and use it to improve future outputs safely.

### Tasks

#### Task T1.6.1: Build feedback bar

Status: `NOT_STARTED`

Feedback options:

1. Useful as written.
2. Too difficult.
3. Too easy.
4. Too verbose.
5. Too brief.
6. Wrong tone.
7. Not aligned.
8. Incorrect.
9. Other.

Acceptance criteria:

1. Feedback can be submitted in under ten seconds.
2. Feedback is attached to the exact artifact version.

#### Task T1.6.2: Capture estimated time saved

Status: `NOT_STARTED`

Requirements:

1. Ask after export or approval.
2. Offer quick ranges and optional exact minutes.
3. Avoid asking repeatedly within one session.
4. Store metric by artifact and pack.

Acceptance criteria:

1. Time saved estimates are available in pilot analytics.
2. The prompt does not interrupt editing.

#### Task T1.6.3: Infer stable preferences

Status: `NOT_STARTED`

Requirements:

1. Detect repeated teacher edits.
2. Require multiple evidence points before raising confidence.
3. Separate course preferences from global teacher preferences.
4. Allow teacher review and deletion.
5. Never infer protected student attributes.

Acceptance criteria:

1. A single edit does not create a high confidence preference.
2. Teachers can see what the system has learned.

#### Task T1.6.4: Apply preferences to future generations

Status: `NOT_STARTED`

Requirements:

1. Include approved high confidence preferences in generation context.
2. Show applied preferences before generation.
3. Allow one request to ignore a preference.
4. Track whether preference application improves feedback.

Acceptance criteria:

1. Applied preferences are auditable.
2. Teacher can disable learned personalization.

## Milestone M1.7: Dashboard and daily workspace

### Goal

Replace the empty chatbot home screen with a useful teacher command center.

### Tasks

#### Task T1.7.1: Build teacher home dashboard

Status: `NOT_STARTED`

Sections:

1. Continue recent work.
2. Create weekly course pack.
3. Course cards.
4. Documents needing attention.
5. Artifacts needing review.
6. Time saved metric.
7. Recent exports.

Acceptance criteria:

1. The primary action is visible without scrolling on desktop.
2. Empty states direct the teacher toward course setup.

#### Task T1.7.2: Build course dashboard

Status: `NOT_STARTED`

Sections:

1. Course summary.
2. Course memory status.
3. Recent packs.
4. Recent artifacts.
5. Source library.
6. Applied preferences.
7. Quick actions.

Acceptance criteria:

1. Teacher can reach any P-1 workflow within two actions.

#### Task T1.7.3: Build global command palette

Status: `NOT_STARTED`

Commands:

1. Switch course.
2. Create pack.
3. Upload document.
4. Search artifacts.
5. Search sources.
6. Open settings.
7. View recent work.

Acceptance criteria:

1. Commands are keyboard accessible.
2. Results respect course permissions.

#### Task T1.7.4: Build global search

Status: `NOT_STARTED`

Search across:

1. Courses.
2. Documents.
3. Artifacts.
4. Packs.

Acceptance criteria:

1. Search returns results in under one second for pilot scale data.
2. Search never crosses organization boundaries.

## Milestone M1.8: Export and sharing

### Goal

Allow teachers to move approved materials into existing workflows without reformatting everything.

### Tasks

#### Task T1.8.1: Copy formatted content

Status: `NOT_STARTED`

Requirements:

1. Copy rich text.
2. Copy plain text.
3. Preserve headings, lists, and tables where possible.
4. Confirm successful copy.

Acceptance criteria:

1. Content pastes cleanly into Google Docs and Canvas rich text fields.

#### Task T1.8.2: Export DOCX

Status: `NOT_STARTED`

Requirements:

1. Support individual artifact export.
2. Support full pack export.
3. Preserve document hierarchy.
4. Add optional teacher name and course header.

Acceptance criteria:

1. Export opens correctly in Google Docs and Microsoft Word.
2. Tables and rubric structures remain legible.

#### Task T1.8.3: Export PDF

Status: `NOT_STARTED`

Requirements:

1. Use print safe styles.
2. Avoid orphaned headings where feasible.
3. Support student facing and teacher facing versions.
4. Exclude internal citations from student version unless selected.

Acceptance criteria:

1. PDF is readable and paginated correctly.
2. Teacher can preview before export.

#### Task T1.8.4: Export Canvas ready HTML

Status: `NOT_STARTED`

Requirements:

1. Generate sanitized HTML.
2. Preserve semantic headings.
3. Avoid unsupported scripts or styles.
4. Provide copy action.
5. Provide a plain text fallback.

Acceptance criteria:

1. Exported HTML pastes into a Canvas rich content editor with usable formatting.

## Milestone M1.9: Pilot analytics and internal operations

### Goal

Measure whether the product is used, useful, reliable, and safe.

### Tasks

#### Task T1.9.1: Define event taxonomy

Status: `NOT_STARTED`

Required events:

1. Account created.
2. Course created.
3. Document uploaded.
4. Document processed.
5. Pack requested.
6. Pack completed.
7. Artifact opened.
8. Artifact edited.
9. Artifact regenerated.
10. Artifact approved.
11. Artifact exported.
12. Feedback submitted.
13. Error encountered.
14. Course deleted.

Acceptance criteria:

1. Events contain no raw uploaded content.
2. Events use stable names and schemas.

#### Task T1.9.2: Build internal pilot dashboard

Status: `NOT_STARTED`

Metrics:

1. Weekly active teachers.
2. Retention.
3. Pack completion.
4. Export rate.
5. Edit rate.
6. Ratings.
7. Estimated time saved.
8. Error rate.
9. Citation coverage.
10. Model cost.

Acceptance criteria:

1. Dashboard data matches source records.
2. Access is restricted to authorized administrators.

#### Task T1.9.3: Add teacher feedback collection

Status: `NOT_STARTED`

Requirements:

1. In product feedback form.
2. Optional screenshot attachment.
3. Category selection.
4. Consent aware diagnostic metadata.
5. Pilot interview notes link.

Acceptance criteria:

1. Feedback reaches the project team.
2. No course content is attached without explicit teacher action.

## Milestone M1.10: MVP hardening

### Goal

Make P-1 reliable enough for real teacher use.

### Tasks

#### Task T1.10.1: Complete end to end test suite

Status: `NOT_STARTED`

Required journeys:

1. Sign in and create course.
2. Upload and process documents.
3. Generate weekly course pack.
4. Edit an artifact.
5. View sources.
6. Submit feedback.
7. Export artifact.
8. Delete a document.
9. Delete a course.

Acceptance criteria:

1. All required journeys pass in CI.
2. Failures produce diagnosable output.

#### Task T1.10.2: Run privacy review

Status: `NOT_STARTED`

Requirements:

1. Review logs.
2. Review analytics payloads.
3. Review file storage.
4. Review deletion behavior.
5. Review access controls.
6. Review model provider settings.
7. Review test data.

Acceptance criteria:

1. `docs/PRIVACY.md` reflects actual behavior.
2. No known P-1 privacy boundary violations remain.

#### Task T1.10.3: Run accessibility review

Status: `NOT_STARTED`

Requirements:

1. Keyboard navigation.
2. Screen reader labels.
3. Focus management.
4. Contrast.
5. Zoom.
6. Reduced motion.
7. Error identification.

Acceptance criteria:

1. Major workflows meet WCAG AA targets.
2. Critical accessibility defects are resolved.

#### Task T1.10.4: Run performance review

Status: `NOT_STARTED`

Targets:

1. Fast initial dashboard load.
2. Responsive editor interactions.
3. Visible progress during long jobs.
4. Efficient document search.
5. Bounded model request cost.

Acceptance criteria:

1. Performance budgets are documented.
2. No major workflow is blocked by synchronous long running work.

#### Task T1.10.5: Complete P-1 release gate

Status: `NOT_STARTED`

Acceptance criteria:

1. All P-1 milestone acceptance criteria pass.
2. Three pilot teachers complete onboarding.
3. No critical security or privacy issue remains.
4. Rollback procedure is documented.
5. Support contact and incident process exist.

# Phase P-2: Teacher workflow expansion

## Milestone M2.1: Standalone assignment builder

### Goal

Allow teachers to create a single assignment without generating a full weekly pack.

### Tasks

#### Task T2.1.1: Build assignment request flow

Status: `NOT_STARTED`

Requirements:

1. Objective.
2. Assignment type.
3. Time expectation.
4. Deliverable format.
5. Difficulty.
6. Selected sources.
7. Required rubric behavior.

Acceptance criteria:

1. Teacher can create an assignment in under three minutes of input time.

#### Task T2.1.2: Add assignment templates

Status: `NOT_STARTED`

Templates:

1. Essay.
2. Problem set.
3. Laboratory report.
4. Project.
5. Presentation.
6. Discussion.
7. Reflection.
8. Document analysis.

Acceptance criteria:

1. Templates remain editable and course aware.
2. Templates do not force irrelevant sections.

#### Task T2.1.3: Add exemplars and misconception guidance

Status: `NOT_STARTED`

Requirements:

1. Teacher facing exemplar.
2. Student facing sample when enabled.
3. Common mistakes.
4. Scoring notes.
5. Clear labels distinguishing examples from required answers.

Acceptance criteria:

1. Exemplar does not introduce criteria absent from the rubric.

## Milestone M2.2: Advanced rubric builder

### Goal

Create reliable, customizable rubrics aligned to existing assignments and teacher history.

### Tasks

#### Task T2.2.1: Import assignment text

Status: `NOT_STARTED`

Requirements:

1. Paste text.
2. Upload file.
3. Select existing artifact.
4. Select existing course assignment source.

Acceptance criteria:

1. Imported assignment requirements are parsed into explicit objectives and deliverables.

#### Task T2.2.2: Add rubric scale controls

Status: `NOT_STARTED`

Requirements:

1. Three to six performance levels.
2. Points or no points.
3. Weighted criteria.
4. Holistic or analytic mode.
5. Custom level labels.

Acceptance criteria:

1. Point and weight math is validated.
2. Teacher can change the structure after generation.

#### Task T2.2.3: Add rubric quality checks

Status: `NOT_STARTED`

Checks:

1. Criteria overlap.
2. Vague descriptors.
3. Missing assignment requirements.
4. Unmeasurable language.
5. Weight imbalance.
6. Inconsistent level progression.

Acceptance criteria:

1. Warnings explain the issue and proposed correction.
2. Teacher remains in control of changes.

## Milestone M2.3: Assessment builder

### Goal

Create formative and summative assessment materials with answer guidance and objective mapping.

### Tasks

#### Task T2.3.1: Build assessment specification flow

Status: `NOT_STARTED`

Requirements:

1. Objectives.
2. Question count.
3. Question types.
4. Difficulty distribution.
5. Time limit.
6. Source boundaries.
7. Retake variant preference.

Acceptance criteria:

1. Specification preview shows objective coverage before generation.

#### Task T2.3.2: Generate question bank

Status: `NOT_STARTED`

Requirements:

1. Selected response.
2. Short answer.
3. Extended response.
4. Calculation.
5. Source analysis.
6. Answer key.
7. Scoring notes.
8. Difficulty labels.

Acceptance criteria:

1. Each question maps to an objective.
2. Each answer is checked for internal consistency.

#### Task T2.3.3: Generate parallel versions

Status: `NOT_STARTED`

Requirements:

1. Preserve objective coverage.
2. Preserve difficulty distribution.
3. Vary surface details.
4. Avoid changing core knowledge demands.

Acceptance criteria:

1. Teacher receives a comparison report showing equivalence and differences.

#### Task T2.3.4: Add assessment quality evaluator

Status: `NOT_STARTED`

Checks:

1. Ambiguity.
2. Duplicate answer choices.
3. Multiple correct answers.
4. Unsupported facts.
5. Mismatch between question and key.
6. Excessive reading burden.

Acceptance criteria:

1. Failed checks block automatic approval state.

## Milestone M2.4: Differentiation studio

### Goal

Help teachers adapt materials while preserving instructional objectives and teacher review.

### Tasks

#### Task T2.4.1: Build adaptation controls

Status: `NOT_STARTED`

Controls:

1. Reading support.
2. Vocabulary support.
3. Step by step scaffolding.
4. Reduced task length.
5. Extension challenge.
6. Alternative response format.
7. Chunked deadlines.

Acceptance criteria:

1. Teacher can select multiple adaptations.
2. The system states what changed and what remained constant.

#### Task T2.4.2: Add side by side comparison

Status: `NOT_STARTED`

Requirements:

1. Original and adapted views.
2. Highlight changes.
3. Objective preservation summary.
4. Teacher notes.

Acceptance criteria:

1. Teacher can accept or reject changes by section.

#### Task T2.4.3: Add differentiation safeguards

Status: `NOT_STARTED`

Requirements:

1. Do not claim legal compliance with an accommodation plan.
2. Do not infer a student's disability.
3. Do not lower the stated objective without teacher confirmation.
4. Warn when an adaptation materially changes the assessed skill.

Acceptance criteria:

1. Unsafe or overconfident claims are blocked.

## Milestone M2.5: Communication assistant

### Goal

Create editable teacher communications grounded in real course information.

### Tasks

#### Task T2.5.1: Add communication scenarios

Status: `NOT_STARTED`

Scenarios:

1. Upcoming assessment.
2. Missing work reminder template.
3. Positive progress note template.
4. Schedule change.
5. Class update.
6. Project launch.
7. Field trip information.
8. General parent update.

Acceptance criteria:

1. No message includes a fabricated date or policy.
2. Teacher approval is required before copy or export.

#### Task T2.5.2: Add tone and length controls

Status: `NOT_STARTED`

Controls:

1. Concise.
2. Detailed.
3. Formal.
4. Warm.
5. Direct.
6. Student facing.
7. Parent facing.

Acceptance criteria:

1. Tone changes do not alter factual details.

#### Task T2.5.3: Add translation support

Status: `NOT_STARTED`

Requirements:

1. Teacher selects target language.
2. Display original and translation side by side.
3. Preserve names, dates, and course terminology.
4. Show translation review notice.

Acceptance criteria:

1. Translation is never sent automatically.
2. Teacher can edit either version.

## Milestone M2.6: Reusable templates and planning

### Goal

Reduce repeated setup for recurring teacher workflows.

### Tasks

#### Task T2.6.1: Save artifact as template

Status: `NOT_STARTED`

Requirements:

1. Save structure without student data.
2. Name and categorize template.
3. Mark course specific or personal.
4. Duplicate and edit.

Acceptance criteria:

1. Template reuse does not overwrite the original artifact.

#### Task T2.6.2: Build recurring weekly plan

Status: `NOT_STARTED`

Requirements:

1. Default weekly structure.
2. Reusable lesson rhythm.
3. Preferred recurring artifacts.
4. Default source sets.
5. Default timing.

Acceptance criteria:

1. Teacher can generate a new week from prior structure without copying old content blindly.

#### Task T2.6.3: Add internal course calendar

Status: `NOT_STARTED`

Requirements:

1. Add instructional dates.
2. Add assessment dates.
3. Add no school days manually.
4. Attach packs and artifacts.
5. Warn about date conflicts.

Acceptance criteria:

1. The system uses only confirmed dates.
2. Calendar items are editable.

# Phase P-3: Feedback and class insight

P-3 introduces student work analysis. This phase requires a separate privacy review and explicit deployment approval.

## Milestone M3.1: Privacy safe student work intake

### Goal

Allow teachers to analyze student work without requiring named student identities.

### Tasks

#### Task T3.1.1: Build anonymized upload workflow

Status: `NOT_STARTED`

Requirements:

1. Require teacher confirmation that names are removed.
2. Detect likely names and identifiers.
3. Allow redaction before upload completes.
4. Use anonymous submission labels.
5. Set a short retention default.

Acceptance criteria:

1. Likely identifiers trigger review.
2. Uploaded submissions do not require student names.

#### Task T3.1.2: Build submission parser

Status: `NOT_STARTED`

Requirements:

1. Support text and common document formats.
2. Preserve submission boundaries.
3. Detect empty or unreadable files.
4. Avoid placing raw text in logs.

Acceptance criteria:

1. Each anonymous submission can be independently reviewed and deleted.

#### Task T3.1.3: Add retention controls

Status: `NOT_STARTED`

Requirements:

1. Choose deletion after analysis.
2. Choose fixed short retention.
3. Delete all submissions for an analysis run.
4. Show current retention state.

Acceptance criteria:

1. Deletion removes stored files and derived text according to policy.

## Milestone M3.2: Rubric aligned feedback studio

### Goal

Draft evidence based feedback for teacher review without automatically assigning final grades.

### Tasks

#### Task T3.2.1: Select assignment and rubric

Status: `NOT_STARTED`

Requirements:

1. Select existing assignment.
2. Select existing rubric.
3. Upload external rubric.
4. Validate alignment.
5. Allow teacher to choose feedback focus.

Acceptance criteria:

1. Analysis cannot begin without a defined rubric or feedback criteria.

#### Task T3.2.2: Generate criterion level evidence

Status: `NOT_STARTED`

Requirements:

1. Identify relevant excerpts.
2. Map evidence to rubric criteria.
3. Separate observed evidence from interpretation.
4. Show uncertainty.
5. Avoid final grade assignment.

Acceptance criteria:

1. Every suggestion links to submission evidence.
2. Unsupported rubric judgments are flagged.

#### Task T3.2.3: Draft student feedback

Status: `NOT_STARTED`

Requirements:

1. Strengths.
2. Highest priority revision.
3. Specific next step.
4. Optional conference question.
5. Teacher controlled tone and length.

Acceptance criteria:

1. Feedback is editable.
2. Feedback avoids insulting, diagnostic, or identity based language.

#### Task T3.2.4: Build teacher review queue

Status: `NOT_STARTED`

Requirements:

1. Show anonymous submissions.
2. Show evidence and draft feedback.
3. Approve, edit, skip, or flag.
4. Track review completion.
5. Export approved feedback.

Acceptance criteria:

1. No feedback is delivered without teacher approval.

## Milestone M3.3: Class insight view

### Goal

Identify class level patterns using evidence from anonymous submissions.

### Tasks

#### Task T3.3.1: Aggregate rubric patterns

Status: `NOT_STARTED`

Requirements:

1. Count criterion level strengths.
2. Count criterion level difficulties.
3. Show distribution without student names.
4. Link patterns to anonymous examples.

Acceptance criteria:

1. Counts match the reviewed submissions.
2. Small group privacy thresholds are enforced.

#### Task T3.3.2: Detect common misconceptions

Status: `NOT_STARTED`

Requirements:

1. Cluster similar errors.
2. Provide representative anonymous evidence.
3. State confidence.
4. Allow teacher correction.

Acceptance criteria:

1. Misconception labels are not presented as unquestionable facts.

#### Task T3.3.3: Suggest reteaching actions

Status: `NOT_STARTED`

Requirements:

1. Suggest mini lesson.
2. Suggest practice activity.
3. Suggest discussion prompt.
4. Suggest grouping strategy without identity assumptions.
5. Link each suggestion to observed evidence.

Acceptance criteria:

1. Suggestions preserve teacher control.
2. Suggestions do not infer protected attributes.

#### Task T3.3.4: Build insight report export

Status: `NOT_STARTED`

Requirements:

1. Teacher facing summary.
2. Evidence appendix.
3. Suggested next actions.
4. Optional anonymized examples.
5. Privacy notice.

Acceptance criteria:

1. Report contains no student identifiers.

# Phase P-4: Google and Canvas integrations

## Milestone M4.1: Google Drive import

### Goal

Allow teachers to select course materials from Google Drive without manual download and upload.

### Tasks

#### Task T4.1.1: Add scoped Google authorization

Status: `NOT_STARTED`

Requirements:

1. Request the minimum required scopes.
2. Explain requested permissions.
3. Support disconnect.
4. Handle token refresh securely.

Acceptance criteria:

1. Disconnect stops future access.
2. Tokens are encrypted.

#### Task T4.1.2: Build Drive picker

Status: `NOT_STARTED`

Requirements:

1. Select files.
2. Select folders when supported.
3. Show supported file types.
4. Avoid importing without explicit selection.

Acceptance criteria:

1. Teacher sees exactly which files will be imported.

#### Task T4.1.3: Import Google native files

Status: `NOT_STARTED`

Requirements:

1. Google Docs.
2. Google Slides.
3. Google Sheets where useful.
4. Preserve titles and source metadata.
5. Handle permissions changes.

Acceptance criteria:

1. Imported content maps back to the original Drive file.

#### Task T4.1.4: Add manual refresh and sync state

Status: `NOT_STARTED`

Requirements:

1. Show last synced time.
2. Detect changed content.
3. Reprocess changed files.
4. Preserve prior artifact citations by version.

Acceptance criteria:

1. Refresh does not create duplicate documents.

## Milestone M4.2: Google Docs export

### Goal

Create editable Google Docs from approved artifacts and packs.

### Tasks

#### Task T4.2.1: Export single artifact to Google Docs

Status: `NOT_STARTED`

Requirements:

1. Preserve heading structure.
2. Preserve lists and tables.
3. Set document title.
4. Return a direct open action.
5. Record export metadata.

Acceptance criteria:

1. Exported document is editable in the teacher's Drive.

#### Task T4.2.2: Export full pack to folder

Status: `NOT_STARTED`

Requirements:

1. Create or select destination folder.
2. Create one document per artifact or one combined document.
3. Use consistent naming.
4. Include teacher only notes separately.

Acceptance criteria:

1. Student facing and teacher facing materials are not accidentally merged.

## Milestone M4.3: Canvas read integration

### Goal

Import teacher selected course structure and materials from Canvas after district approval.

### Tasks

#### Task T4.3.1: Implement Canvas integration boundary

Status: `NOT_STARTED`

Requirements:

1. Use an adapter interface.
2. Support OAuth or LTI configuration.
3. Separate institution credentials from user tokens.
4. Feature flag all Canvas behavior.

Acceptance criteria:

1. The core product operates when Canvas is disabled.

#### Task T4.3.2: Import course metadata

Status: `NOT_STARTED`

Requirements:

1. Course name.
2. Sections.
3. Term.
4. Modules.
5. Assignments.
6. Rubrics.
7. Announcements.

Acceptance criteria:

1. Teacher selects the Canvas course to connect.
2. Imported records maintain source identifiers.

#### Task T4.3.3: Import selected course content

Status: `NOT_STARTED`

Requirements:

1. Teacher chooses modules or assignments.
2. Do not ingest submissions in this milestone.
3. Show scope before import.
4. Support refresh.

Acceptance criteria:

1. No student submission data is accessed.

## Milestone M4.4: Canvas write integration

### Goal

Create teacher approved drafts in Canvas while preventing silent publication.

### Tasks

#### Task T4.4.1: Create assignment draft

Status: `NOT_STARTED`

Requirements:

1. Map title, description, points, dates, and submission type.
2. Validate dates.
3. Create unpublished by default.
4. Return a Canvas review link.

Acceptance criteria:

1. The product cannot publish without explicit teacher action.

#### Task T4.4.2: Create rubric draft

Status: `NOT_STARTED`

Requirements:

1. Map rubric criteria.
2. Map rating levels.
3. Validate point totals.
4. Attach to selected draft assignment when supported.

Acceptance criteria:

1. Canvas representation matches the approved artifact.

#### Task T4.4.3: Create announcement draft

Status: `NOT_STARTED`

Requirements:

1. Map title and body.
2. Validate dates.
3. Keep unpublished or delayed according to Canvas capability.
4. Require confirmation.

Acceptance criteria:

1. No announcement is sent automatically.

#### Task T4.4.4: Add integration audit trail

Status: `NOT_STARTED`

Requirements:

1. Record user action.
2. Record destination course.
3. Record created Canvas object.
4. Record success or failure.
5. Exclude sensitive content from logs.

Acceptance criteria:

1. Administrators can trace write operations without viewing full artifact text.

# Phase P-5: School deployment and administration

## Milestone M5.1: Organization administration

### Goal

Support safe school level deployment with clear roles, controls, and visibility.

### Tasks

#### Task T5.1.1: Build organization admin console

Status: `NOT_STARTED`

Requirements:

1. User list.
2. Invitation management.
3. Role management.
4. Course count.
5. Storage usage.
6. Model usage.
7. Integration status.
8. Audit events.

Acceptance criteria:

1. Teachers cannot access administrative data.
2. Admin actions are audited.

#### Task T5.1.2: Implement roles

Status: `NOT_STARTED`

Roles:

1. Teacher.
2. Department lead.
3. School administrator.
4. Technical administrator.
5. Support operator with restricted access.

Acceptance criteria:

1. Role permissions are explicit and tested.
2. Support operators cannot read course content by default.

#### Task T5.1.3: Add organization policy settings

Status: `NOT_STARTED`

Settings:

1. Allowed model providers.
2. Data retention.
3. Allowed file types.
4. Student data features.
5. Integration availability.
6. Export restrictions.
7. Pilot analytics consent.

Acceptance criteria:

1. Organization policy overrides individual settings where required.

## Milestone M5.2: Department collaboration

### Goal

Allow teachers to share approved resources without exposing private course content by default.

### Tasks

#### Task T5.2.1: Build department libraries

Status: `NOT_STARTED`

Requirements:

1. Share approved templates.
2. Share approved rubrics.
3. Share unit structures.
4. Set view or duplicate permissions.
5. Keep source course private unless explicitly shared.

Acceptance criteria:

1. Shared items are copies or permission controlled references.
2. No private teacher draft is shared automatically.

#### Task T5.2.2: Add shared standards collection

Status: `NOT_STARTED`

Requirements:

1. Upload department standards.
2. Version standards.
3. Mark active version.
4. Cite standards in generated artifacts.
5. Notify teachers of changed standards.

Acceptance criteria:

1. New generations use the active standards version.
2. Existing artifacts retain their original source version.

#### Task T5.2.3: Add collaborative pack review

Status: `NOT_STARTED`

Requirements:

1. Invite reviewer.
2. Comment by section.
3. Suggest edits.
4. Resolve comments.
5. Maintain version history.

Acceptance criteria:

1. Collaboration permissions are course or artifact specific.

## Milestone M5.3: Governance and compliance controls

### Goal

Provide the controls required for responsible institutional use.

### Tasks

#### Task T5.3.1: Build data inventory

Status: `NOT_STARTED`

Requirements:

1. Document every stored data class.
2. Document retention.
3. Document access roles.
4. Document model provider flow.
5. Document deletion behavior.

Acceptance criteria:

1. Inventory matches actual production behavior.

#### Task T5.3.2: Add audit log viewer

Status: `NOT_STARTED`

Requirements:

1. Filter by actor.
2. Filter by action.
3. Filter by resource type.
4. Export audit records.
5. Avoid exposing full content.

Acceptance criteria:

1. Critical changes are traceable.

#### Task T5.3.3: Add retention enforcement jobs

Status: `NOT_STARTED`

Requirements:

1. Delete expired student work.
2. Delete expired temporary exports.
3. Delete orphaned uploads.
4. Produce deletion receipts.
5. Alert on failures.

Acceptance criteria:

1. Retention is enforced automatically.
2. Failed deletions are visible to administrators.

#### Task T5.3.4: Add incident response controls

Status: `NOT_STARTED`

Requirements:

1. Suspend integration.
2. Suspend model calls.
3. Revoke sessions.
4. Disable exports.
5. View affected resources.
6. Record incident timeline.

Acceptance criteria:

1. Critical external access can be disabled quickly.

## Milestone M5.4: Identity and deployment controls

### Goal

Support district managed identity and reliable deployment.

### Tasks

#### Task T5.4.1: Add domain restricted access

Status: `NOT_STARTED`

Requirements:

1. Allow approved domains.
2. Allow explicit exceptions.
3. Prevent personal accounts when policy requires.
4. Audit access denials.

Acceptance criteria:

1. Domain restrictions are enforced server side.

#### Task T5.4.2: Add SSO integration path

Status: `NOT_STARTED`

Requirements:

1. Support standard identity provider configuration.
2. Support role mapping.
3. Support account deactivation.
4. Document setup.

Acceptance criteria:

1. Deactivated accounts lose access promptly.

#### Task T5.4.3: Add environment separation

Status: `NOT_STARTED`

Requirements:

1. Local.
2. Development.
3. Staging.
4. Production.
5. Separate databases and storage.
6. Separate secrets.

Acceptance criteria:

1. Production content cannot be accessed from development.

# Phase P-6: Context learning and research quality

## Milestone M6.1: Teacher preference engine

### Goal

Improve personalization through explicit feedback and repeated edits while remaining transparent and reversible.

### Tasks

#### Task T6.1.1: Build preference evidence model

Status: `NOT_STARTED`

Requirements:

1. Store edit patterns.
2. Store explicit ratings.
3. Store direct teacher statements.
4. Assign confidence by source type.
5. Apply decay to weak old evidence.

Acceptance criteria:

1. Direct teacher statements outweigh weak inferred patterns.
2. Preference provenance is inspectable.

#### Task T6.1.2: Build preference review center

Status: `NOT_STARTED`

Requirements:

1. Show learned preferences.
2. Show confidence.
3. Show supporting evidence type.
4. Edit preference.
5. Delete preference.
6. Lock preference.

Acceptance criteria:

1. Teacher can fully control stored preferences.

#### Task T6.1.3: Add controlled personalization experiments

Status: `NOT_STARTED`

Requirements:

1. Compare baseline generation with personalized generation.
2. Use teacher ratings and edit distance.
3. Randomize only with consent.
4. Avoid degrading the active teacher workflow.

Acceptance criteria:

1. Personalization is promoted only when measured quality improves.

## Milestone M6.2: Course context compiler

### Goal

Create a structured and efficient representation of a course rather than relying on undifferentiated retrieval.

### Tasks

#### Task T6.2.1: Build typed course memory

Status: `NOT_STARTED`

Memory types:

1. Stable course facts.
2. Current unit context.
3. Teacher preferences.
4. Assignment conventions.
5. Rubric conventions.
6. Vocabulary.
7. Schedule constraints.
8. Approved exemplars.
9. Rejected patterns.
10. Department standards.

Acceptance criteria:

1. Every memory item has provenance, confidence, scope, and update time.

#### Task T6.2.2: Build context selection planner

Status: `NOT_STARTED`

Requirements:

1. Select memory by artifact type.
2. Select documents by objective and teacher choice.
3. Enforce token budgets.
4. Prefer concise structured context.
5. Record selected context IDs.

Acceptance criteria:

1. Context selection is reproducible from stored inputs.
2. Irrelevant course materials are reduced.

#### Task T6.2.3: Add conflict detection

Status: `NOT_STARTED`

Requirements:

1. Detect conflicting dates.
2. Detect conflicting rubric conventions.
3. Detect conflicting assignment expectations.
4. Prefer teacher corrected values.
5. Ask for clarification when necessary.

Acceptance criteria:

1. The system does not silently choose between high confidence conflicts.

#### Task T6.2.4: Add context freshness rules

Status: `NOT_STARTED`

Requirements:

1. Mark current term materials.
2. Mark archived materials.
3. Prefer active unit sources.
4. Preserve historical versions.
5. Allow teacher pinning.

Acceptance criteria:

1. Archived documents are not treated as current without explicit selection.

## Milestone M6.3: Evaluation harness

### Goal

Measure generation quality before prompt, model, or retrieval changes reach teachers.

### Tasks

#### Task T6.3.1: Build fixed evaluation set

Status: `NOT_STARTED`

Requirements:

1. Use synthetic or permissioned course materials.
2. Cover multiple subjects.
3. Cover all major artifact types.
4. Include conflicting context cases.
5. Include missing evidence cases.
6. Include privacy boundary cases.

Acceptance criteria:

1. The evaluation set contains no real student records.
2. Inputs and expected properties are versioned.

#### Task T6.3.2: Define quality dimensions

Status: `NOT_STARTED`

Dimensions:

1. Objective alignment.
2. Source grounding.
3. Internal consistency.
4. Teacher style match.
5. Rubric alignment.
6. Timing feasibility.
7. Editability.
8. Privacy compliance.
9. Citation precision.
10. Citation coverage.

Acceptance criteria:

1. Each dimension has a measurable rubric.

#### Task T6.3.3: Add automated evaluators

Status: `NOT_STARTED`

Requirements:

1. Schema validation.
2. Citation validity.
3. Assignment and rubric alignment.
4. Timing arithmetic.
5. Point total arithmetic.
6. Prohibited data patterns.
7. Regression comparison.

Acceptance criteria:

1. Deterministic checks run on every relevant change.
2. Model based evaluators are calibrated against human review.

#### Task T6.3.4: Add human evaluation workflow

Status: `NOT_STARTED`

Requirements:

1. Blind comparison.
2. Teacher rating form.
3. Error taxonomy.
4. Preference capture.
5. Exportable results.

Acceptance criteria:

1. Teacher evaluators can compare versions without seeing model identity.

#### Task T6.3.5: Add release quality gates

Status: `NOT_STARTED`

Requirements:

1. No drop in grounding.
2. No privacy regression.
3. No major artifact alignment regression.
4. Cost and latency within budget.
5. Human quality threshold for major prompt changes.

Acceptance criteria:

1. Failing changes cannot be promoted to production.

## Milestone M6.4: Research output and benchmark

### Goal

Convert product learning into a rigorous evaluation of course aware teacher AI.

### Tasks

#### Task T6.4.1: Define benchmark research questions

Status: `NOT_STARTED`

Questions:

1. Does persistent course context improve teacher rated usefulness?
2. Does structured context outperform simple retrieval?
3. Does preference learning reduce teacher edit distance?
4. Does source trace improve trust and error detection?
5. Which artifact types benefit most from course context?

Acceptance criteria:

1. Questions are answerable from consented pilot data or synthetic evaluation.

#### Task T6.4.2: Define experimental protocol

Status: `NOT_STARTED`

Requirements:

1. Baseline generic prompt.
2. Retrieval baseline.
3. Structured context condition.
4. Personalized context condition.
5. Blind teacher evaluation.
6. Statistical analysis plan.
7. Privacy plan.

Acceptance criteria:

1. Protocol is documented before final evaluation.

#### Task T6.4.3: Build benchmark runner

Status: `NOT_STARTED`

Requirements:

1. Run all conditions on fixed inputs.
2. Store prompt and model versions.
3. Store cost and latency.
4. Export anonymized results.
5. Generate reproducible reports.

Acceptance criteria:

1. A second developer can reproduce benchmark results.

#### Task T6.4.4: Create technical report

Status: `NOT_STARTED`

Sections:

1. Problem.
2. System design.
3. Evaluation protocol.
4. Results.
5. Failure analysis.
6. Privacy and limitations.
7. Future work.

Acceptance criteria:

1. Claims are bounded by evidence.
2. Teacher pilot participation is described accurately.

# Phase P-7: Reliability, scale, and cost control

## Milestone M7.1: Observability

### Goal

Make failures diagnosable without exposing private content.

### Tasks

#### Task T7.1.1: Add structured logging

Status: `NOT_STARTED`

Requirements:

1. Request ID.
2. User and organization IDs using internal identifiers.
3. Job ID.
4. Error code.
5. Latency.
6. Model provider metadata.
7. No raw course content.

Acceptance criteria:

1. Production errors can be traced across services.
2. Sensitive text is excluded.

#### Task T7.1.2: Add metrics and alerts

Status: `NOT_STARTED`

Metrics:

1. Request rate.
2. Error rate.
3. Queue depth.
4. Generation latency.
5. Document processing latency.
6. Model cost.
7. Storage failures.
8. Export failures.
9. Authentication failures.

Acceptance criteria:

1. Critical thresholds trigger alerts.
2. Alert messages identify the affected service and severity.

#### Task T7.1.3: Add distributed tracing

Status: `NOT_STARTED`

Requirements:

1. Trace upload to processing.
2. Trace generation planning to artifacts.
3. Trace export jobs.
4. Redact sensitive attributes.

Acceptance criteria:

1. Slow stages are visible without logging private content.

## Milestone M7.2: Generation reliability

### Goal

Reduce incomplete, inconsistent, and duplicated AI work.

### Tasks

#### Task T7.2.1: Add structured output repair

Status: `NOT_STARTED`

Requirements:

1. Validate schema.
2. Attempt bounded repair.
3. Preserve valid sections.
4. Fail clearly after repair limit.

Acceptance criteria:

1. Invalid output never reaches the artifact editor as if valid.

#### Task T7.2.2: Add provider fallback

Status: `NOT_STARTED`

Requirements:

1. Provider abstraction.
2. Approved fallback models.
3. Privacy compatible routing.
4. Cost and latency limits.
5. Failure audit events.

Acceptance criteria:

1. Fallback never violates organization model policy.

#### Task T7.2.3: Add generation caching

Status: `NOT_STARTED`

Requirements:

1. Cache deterministic support operations.
2. Avoid caching sensitive outputs across users.
3. Invalidate by source and prompt version.
4. Record cache hit metrics.

Acceptance criteria:

1. Cache cannot leak one teacher's content to another.

#### Task T7.2.4: Add cost budgets

Status: `NOT_STARTED`

Requirements:

1. Per request estimate.
2. Per organization budget.
3. Warning thresholds.
4. Hard limits where configured.
5. Lower cost model for eligible support tasks.

Acceptance criteria:

1. Unexpected usage spikes are bounded.

## Milestone M7.3: Data resilience

### Goal

Protect teacher work from accidental loss and support recovery.

### Tasks

#### Task T7.3.1: Add database backups

Status: `NOT_STARTED`

Requirements:

1. Automated backups.
2. Encryption.
3. Retention policy.
4. Restore testing.
5. Access restrictions.

Acceptance criteria:

1. A documented restore test succeeds.

#### Task T7.3.2: Add artifact recovery

Status: `NOT_STARTED`

Requirements:

1. Autosave drafts.
2. Recover interrupted edits.
3. Restore recent deleted drafts within policy window.
4. Preserve version history.

Acceptance criteria:

1. Browser refresh does not lose recent saved work.

#### Task T7.3.3: Add disaster recovery plan

Status: `NOT_STARTED`

Requirements:

1. Recovery objectives.
2. Service dependency list.
3. Restore procedure.
4. Communication procedure.
5. Annual test schedule.

Acceptance criteria:

1. Recovery steps are executable by someone other than the original developer.

# Phase P-8: Public launch and adoption

## Milestone M8.1: Marketing site

### Goal

Explain the product with the same disciplined editorial visual language as the reference image.

### Tasks

#### Task T8.1.1: Build hero section

Status: `NOT_STARTED`

Requirements:

1. Direct product claim.
2. One sentence explanation.
3. Teacher pilot call to action.
4. Minimal navigation.
5. Strong typography and white space.

Acceptance criteria:

1. Visitor understands the user and value within ten seconds.

#### Task T8.1.2: Build metric panel grid

Status: `NOT_STARTED`

Requirements:

1. Four large black panels.
2. Use real pilot metrics only.
3. Support a capability mode before metrics exist.
4. Include concise captions.
5. Use restrained blue accents.

Acceptance criteria:

1. No invented usage or outcome numbers appear.

#### Task T8.1.3: Build product workflow section

Status: `NOT_STARTED`

Steps:

1. Add course materials.
2. Create course memory.
3. Generate weekly pack.
4. Review sources.
5. Edit and export.

Acceptance criteria:

1. Workflow matches the actual product.

#### Task T8.1.4: Build trust section

Status: `NOT_STARTED`

Content:

1. Teacher control.
2. Source trace.
3. Privacy boundaries.
4. No automatic final grading.
5. No automatic sending.
6. Data deletion controls.

Acceptance criteria:

1. Claims match production behavior.

#### Task T8.1.5: Build responsive and accessible page

Status: `NOT_STARTED`

Acceptance criteria:

1. Works on desktop, tablet, and mobile.
2. Meets accessibility targets.
3. Preserves editorial hierarchy at all sizes.

## Milestone M8.2: Pilot operations

### Goal

Run a disciplined pilot that produces credible evidence of value.

### Tasks

#### Task T8.2.1: Build teacher onboarding guide

Status: `NOT_STARTED`

Requirements:

1. Ten minute setup path.
2. Safe upload guidance.
3. Weekly pack tutorial.
4. Source trace tutorial.
5. Export tutorial.
6. Support contact.

Acceptance criteria:

1. A new pilot teacher can complete setup without developer intervention.

#### Task T8.2.2: Run weekly pilot review

Status: `NOT_STARTED`

Requirements:

1. Usage review.
2. Failure review.
3. Teacher interview.
4. Feature request ranking.
5. Privacy issue review.
6. Next week decision log.

Acceptance criteria:

1. Each weekly review produces documented decisions.

#### Task T8.2.3: Publish pilot outcome report

Status: `NOT_STARTED`

Metrics:

1. Participating teachers.
2. Departments.
3. Weekly retention.
4. Artifacts created.
5. Export rate.
6. Estimated time saved.
7. Quality ratings.
8. Failure categories.
9. Limitations.

Acceptance criteria:

1. All claims are supported by recorded data.
2. Teacher quotes are used only with permission.

## Milestone M8.3: Case study and application ready evidence

### Goal

Create a concise, accurate record of technical work and community impact.

### Tasks

#### Task T8.3.1: Build public case study

Status: `NOT_STARTED`

Sections:

1. Teacher problem.
2. Discovery process.
3. Product design.
4. Context architecture.
5. Privacy decisions.
6. Pilot results.
7. Teacher feedback.
8. Limitations and next steps.

Acceptance criteria:

1. Case study avoids exaggerated claims.
2. Screenshots contain no private course content without permission.

#### Task T8.3.2: Create technical architecture summary

Status: `NOT_STARTED`

Requirements:

1. Course memory model.
2. Retrieval pipeline.
3. Artifact planning.
4. Source citation system.
5. Preference learning.
6. Evaluation harness.

Acceptance criteria:

1. Summary is technically accurate and understandable to a technical reviewer.

#### Task T8.3.3: Create verified impact summary

Status: `NOT_STARTED`

Requirements:

1. Teacher count.
2. Weekly active count.
3. Department count.
4. Artifact count.
5. Time saved.
6. Retention.
7. Testimonials with permission.

Acceptance criteria:

1. Every number maps to a recorded metric.
2. Registered users are not presented as active users.

# Phase P-9: Future capabilities

P-9 is intentionally deferred. No P-9 work should displace P-1 through P-3 quality, privacy, or adoption goals.

## Milestone M9.1: School schedule intelligence

### Tasks

#### Task T9.1.1: Import approved bell schedules

Status: `NOT_STARTED`

#### Task T9.1.2: Import school calendar events

Status: `NOT_STARTED`

#### Task T9.1.3: Detect shortened instructional periods

Status: `NOT_STARTED`

#### Task T9.1.4: Adjust lesson timing with teacher confirmation

Status: `NOT_STARTED`

## Milestone M9.2: Department curriculum mapping

### Tasks

#### Task T9.2.1: Map artifacts to department standards

Status: `NOT_STARTED`

#### Task T9.2.2: Identify objective coverage gaps

Status: `NOT_STARTED`

#### Task T9.2.3: Compare planned and completed units

Status: `NOT_STARTED`

#### Task T9.2.4: Generate department level reports with privacy thresholds

Status: `NOT_STARTED`

## Milestone M9.3: Teacher collaboration intelligence

### Tasks

#### Task T9.3.1: Recommend approved department resources

Status: `NOT_STARTED`

#### Task T9.3.2: Suggest reusable shared templates

Status: `NOT_STARTED`

#### Task T9.3.3: Detect duplicate curriculum work without exposing private drafts

Status: `NOT_STARTED`

#### Task T9.3.4: Support coauthoring of unit packs

Status: `NOT_STARTED`

## Milestone M9.4: Mobile companion

### Tasks

#### Task T9.4.1: Review pending artifacts

Status: `NOT_STARTED`

#### Task T9.4.2: Approve or reject draft sections

Status: `NOT_STARTED`

#### Task T9.4.3: Capture voice notes into teacher reviewed requests

Status: `NOT_STARTED`

#### Task T9.4.4: Receive job completion notifications

Status: `NOT_STARTED`

## 6. Cross phase quality requirements

### 6.1 Accessibility

1. All interactive controls must be keyboard accessible.
2. Focus state must be visible.
3. Form errors must be announced and associated with fields.
4. Color cannot be the only state indicator.
5. Generated documents must use semantic headings.
6. Motion must respect reduced motion preferences.
7. Tables require headers and readable responsive behavior.

### 6.2 Security

1. Validate all input on the server.
2. Sanitize generated HTML.
3. Use content security policy.
4. Use secure cookies.
5. Rotate secrets.
6. Rate limit authentication and generation endpoints.
7. Protect signed URL issuance.
8. Scan dependencies.
9. Restrict service credentials.
10. Keep audit trails for sensitive operations.

### 6.3 AI safety and reliability

1. Model output is untrusted input.
2. Validate every structured output.
3. Require source support for course dependent claims.
4. Require teacher approval before export to external systems.
5. Do not infer student diagnoses, disabilities, or protected attributes.
6. Do not produce final disciplinary decisions.
7. Do not present automated feedback as objective truth.
8. Show uncertainty.
9. Preserve teacher edits.
10. Keep model and prompt versions for reproducibility.

### 6.4 Performance

1. Dashboard interactions should feel immediate.
2. Upload and generation work should be asynchronous.
3. Long operations must show progress.
4. Search should use indexed queries.
5. Rich editor input should not block on network calls.
6. Autosave should be debounced and resilient.
7. Large documents should be processed incrementally.

### 6.5 Analytics

1. Analytics must never contain raw course content.
2. Use internal IDs rather than email where possible.
3. Record explicit consent state.
4. Allow pilot analytics to be disabled when policy requires.
5. Document every event and property.
6. Distinguish registered, active, retained, and exported usage.

## 7. Required release checklist

Before any production release:

1. All tasks in the release milestone are `DONE`.
2. Type checks pass.
3. Unit tests pass.
4. Integration tests pass.
5. End to end tests pass.
6. Accessibility checks pass for changed workflows.
7. Database migrations are reviewed.
8. Rollback plan exists.
9. Privacy impact is reviewed.
10. Analytics schemas are reviewed.
11. No secrets are committed.
12. Documentation is updated.
13. Changelog is updated.
14. Pilot support instructions are updated.
15. The release has an accountable owner.

## 8. Definition of product completion

Wildcat Copilot is not complete when it has many features. It is complete when teachers repeatedly use it, trust its sources, retain control over its output, and save measurable time.

The priority order is:

1. Teacher usefulness.
2. Privacy and trust.
3. Reliability.
4. Source grounding.
5. Editing quality.
6. Workflow integration.
7. Personalization.
8. Expansion.

When priorities conflict, follow this order.
