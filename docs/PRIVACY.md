# Privacy Baseline

Authoritative source: AGENTS.md §4.7 and §0.7. This document restates the baseline and will be updated to reflect _actual_ implemented behavior (not just intent) as each control ships — required before the P-1 release gate (T1.10.2 privacy review).

## P-1 must enforce

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
13. Short-lived signed URLs for uploaded files.
14. Encryption in transit and at rest.
15. Least privilege service access.

## Implementation status

| Control                                                | Status                                                              | Where                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------ |
| Env validation prevents startup with missing secrets   | Done                                                                | `lib/validation/env.ts`                          |
| Google OAuth restricted to an explicit pilot allowlist | Done                                                                | `lib/auth/config.ts` (`PILOT_ALLOWLIST`)         |
| Server-side cross-course/cross-org access prevention   | Done                                                                | `lib/auth/authorization.ts`                      |
| Account deletion entry point (hard delete, cascades)   | Done                                                                | `lib/auth/actions.ts` (`deleteOwnAccountAction`) |
| Upload confirmation ("no identifiable student data")   | Not started                                                         | T1.2.1                                           |
| No raw uploaded text in logs                           | Not started (no logging pipeline yet)                               | T7.1.1                                           |
| No raw uploaded text in analytics                      | Not started (no analytics pipeline yet)                             | T1.9.1                                           |
| Signed, short-lived upload/download URLs               | Done (5 min expiry, HMAC-signed, local filesystem backend)          | `lib/documents/storage/`, `app/api/storage/*`    |
| File/course deletion                                   | Account deletion done; per-document/per-course deletion not started | T1.1.4, T1.2.5                                   |
| Encryption in transit/at rest                          | Deferred to hosting/DB provider config                              | T0.4.3, T0.4.4                                   |

## Fixtures and test data

All fixtures under `tests/fixtures/` must be synthetic. No production data, export, or screenshot may be committed to the repository. See `tests/fixtures/course.ts` for the pattern (explicit comment banning real data).

## P-3 note

Phase P-3 (student work analysis) requires a separate privacy review and explicit deployment approval before any milestone in that phase begins (AGENTS.md §"Phase P-3" preamble).
