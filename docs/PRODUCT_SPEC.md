# Product Specification

Status: draft, distilled from `AGENTS.md` §0. Task **P-0 → M0.1 → T0.1.1** requires this to be validated against real teacher discovery interviews (T0.1.2) before it is considered final; treat this version as the working baseline that unblocks engineering, not the completed deliverable.

## 1. Primary persona

An LGHS teacher who:

- Already uses Google Drive, Google Docs, and Canvas daily.
- Has limited planning time.
- Needs outputs that reliably match their actual course, not generic material.
- Wants to stay in control of anything shown to students or entered into Canvas.

## 2. Core workflow: the weekly course pack

1. Teacher uploads course materials (syllabus, past assignments, rubrics, lesson materials) once, up front.
2. The system builds a persistent, source-grounded course memory from those materials.
3. For a given topic/unit and date range, the teacher requests a **weekly course pack**.
4. The system plans, then generates, a coherent set of artifacts (lesson sequence, assignment, rubric, formative assessment, Canvas announcement, differentiation options).
5. Every artifact is editable, cites its sources, and requires explicit teacher review/approval before export.

## 3. P-1 inputs

- Uploaded documents: PDF, DOCX, PPTX, plain text, Markdown.
- Document types: syllabus, assignment, rubric, lesson plan, slide deck, reading, assessment, department standard, other.
- Teacher style questionnaire (instruction detail, rigor, feedback length, tone, class structure).
- Pack request: course, topic/unit, date range, objectives, class duration, desired artifacts, source selection, constraints, rigor.

## 4. P-1 outputs

- Lesson sequence, assignment, rubric, formative assessment, Canvas-ready announcement, differentiation options — each with source citations and version history.
- Exports: rich-text copy, DOCX, PDF, Canvas-ready sanitized HTML.

## 5. Privacy boundaries (P-1)

No identifiable student data is required or accepted. See `docs/PRIVACY.md` for the full baseline (AGENTS.md §4.7). Enforced at upload time via explicit teacher confirmation and at the data-model level (no student PII fields exist in P-1 schema).

## 6. Measurable pilot outcomes

See AGENTS.md §2.1 and §2.2 for the full list. Headline targets:

- 3 pilot teachers onboard independently.
- Weekly pack generation completes in a median of ≤ 90 seconds.
- ≥ 70% of generated artifacts are exported or meaningfully edited.
- Pilot teachers report ≥ 1 hour saved/week after two weeks.

## 7. Explicit non-goals (P-1)

Replacing Canvas or the teacher, automated final grading, ingesting named student records, sending messages without teacher review, general student tutoring, multi-district support, a public prompt marketplace. Full list: AGENTS.md §0.7.

## 8. Open items pending discovery interviews (T0.1.2)

- Which of the P-1 artifact types teachers value most (ranking currently assumed from the spec, not validated).
- Actual time-saved baseline per artifact type.
- Department-specific variation in rubric/assignment conventions to prioritize in `CourseProfile` synthesis.
