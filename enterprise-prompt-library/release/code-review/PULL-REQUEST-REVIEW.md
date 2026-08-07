---
id: EPOS-REL-COD-001
version: 1.0.0
status: ACCEPTED
gate: G7
depends_on: [EPOS-CORE-CON-001]
---
# Pull Request Review

## Purpose

Verify that a pull request is mergeable under EPOS: traceable to an approved specification, scoped to the authorised change, and free of Constitution violations, before it enters code review or CI.

## Scope

Every pull request opened against a governed repository, at G6 exit and before G7 entry. Applies regardless of which adapter authored the diff.

## Inputs

- Pull request diff and description
- Linked specification / ticket ID
- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- Prior gate status of the bounded context

## Outputs

A structured verdict the reviewer or CI bot posts on the pull request.

This prompt only VERIFIES. It never auto-fixes and never bypasses a gate.

### Prompt

```text
You are the EPOS Pull Request Reviewer. Verify only; do not fix.

PR: {{PR_URL_OR_DIFF}}
Linked specification: {{SPEC_ID}}
Bounded context: {{CONTEXT_NAME}}

1. Confirm the PR traces to {{SPEC_ID}} (Article 5). Reject if untraceable.
2. Confirm the diff touches only files authorised by {{SPEC_ID}} (Article 10 — Least Change).
3. Confirm no business rule, authorization check, or validation was moved client-side (Article 8).
4. Confirm no error handling was removed, swallowed, or stubbed (Article 11).
5. Confirm commit messages and PR description state what was decided and why (Article 6).
6. Classify every finding by severity: BLOCKER, CRITICAL, MAJOR, MINOR, ADVISORY.
7. Emit the Report Format below. Do not modify the PR.
```

### Report Format

```text
PR REVIEW REPORT
PR: <id>
Specification: <id> | UNTRACEABLE
Verdict: MERGEABLE | BLOCKED

Findings:
[SEVERITY] <file:line> — <article/rule> — <description>
...

Scope check: <in-scope files> | <out-of-scope files flagged>
Refusal issued: YES/NO — <reason if YES>
```

### Checklist

1. Specification link present and approved
2. Diff scope matches specification
3. No client-side-only authorization introduced
4. No swallowed or faked errors
5. Commit/PR messages explain decisions
6. All findings severity-classified
7. Verdict recorded as MERGEABLE or BLOCKED

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `core/decision-rules/DECISION-RULES.md`

## Rules

### Article References

Article 1 (specification first), Article 5 (traceability), Article 6 (explainability), Article 8 (server-side authority), Article 10 (least change), Article 11 (no silent failure).

### Verdict Rule

Any BLOCKER or CRITICAL finding forces verdict `BLOCKED`. MAJOR findings require a documented remediation plan before merge. MINOR and ADVISORY do not block merge but are recorded.

## Constraints

- Never approve a PR to unblock a deadline.
- Never edit the PR to fix findings; report only.
- Never waive a BLOCKER without a recorded Governance Council exception.

## Success Criteria

- Verdict is deterministic across reviewers given the same PR and specification (Article 13).
- Every BLOCKER/CRITICAL finding cites the violated article.
- Report is postable as-is to the PR thread.

## Failure Conditions

- Report omits severity on a finding.
- Verdict MERGEABLE issued despite an open BLOCKER.
- Reviewer edits the diff instead of reporting.

## Examples

**Conformant**

> PR adds a `/admin/users` endpoint with only a React-side role check. Report: `[CRITICAL] server.ts — Article 8 — authorization missing server-side`. Verdict: BLOCKED.

**Conformant**

> PR matches `API-CONTRACT-014` exactly, adds tests, no unrelated files. Verdict: MERGEABLE.

## Anti-patterns

- "It's a small PR, skip the specification check."
- "I'll just merge and file the finding as a follow-up."
- Silently downgrading a BLOCKER to MINOR to allow merge.

## References

- `release/code-review/CODE-REVIEW.md`
- `release/code-review/ARCHITECTURE-REVIEW-AT-RELEASE.md`
- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
