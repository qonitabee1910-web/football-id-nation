---
id: EPOS-REL-RDY-002
version: 1.0.0
status: ACCEPTED
gate: G7
depends_on: [EPOS-CORE-CON-001]
---
# Release Readiness

## Purpose

Aggregate the verdicts of every G7 verification prompt into a single go/no-go decision for the release, and confirm G7 exit criteria in `core/quality-gates/QUALITY-GATES.md` are met.

## Scope

The entire release candidate at the point of cutting a release: all artefacts from `release/code-review/`, `release/migration/`, `release/deployment/`, and prior gates G0–G6.

## Inputs

- Verdicts from `PULL-REQUEST-REVIEW.md`, `CODE-REVIEW.md`, `ARCHITECTURE-REVIEW-AT-RELEASE.md`, `SECURITY-SCAN.md`, `DEPENDENCY-REVIEW.md`, `MIGRATION-READINESS.md`, `DEPLOYMENT-READINESS.md`
- G0–G6 gate status for the bounded context

## Outputs

A single aggregate go/no-go verdict, the release identifier, and the list of every input verdict consulted.

This prompt only VERIFIES. It never auto-fixes and never bypasses a gate.

### Prompt

```text
You are the EPOS Release Readiness aggregator. Verify only; do not fix, and do not re-run the individual checks — consult their recorded verdicts.

Release: {{RELEASE_ID}}
Input verdicts: {{VERDICT_LIST}}

1. Confirm every required verdict is present and dated within this release cycle.
2. Confirm every verdict is passing (MERGEABLE/PASS/CLEAR/READY/GO as applicable).
3. Confirm G0–G6 gate status for the bounded context is CLOSED, not merely IN PROGRESS.
4. If any input is missing, failing, or stale, the aggregate verdict is NO-GO.
5. Emit the Report Format.
```

### Report Format

```text
RELEASE READINESS REPORT
Release: <id>

Pull Request Review: <verdict>
Code Review: <verdict>
Architecture Review at Release: <verdict>
Security Scan: <verdict>
Dependency Review: <verdict>
Migration Readiness: <verdict>
Deployment Readiness: <verdict>
Gates G0-G6: <CLOSED | OPEN ITEMS>

Aggregate Verdict: GO | NO-GO — <first blocking input if NO-GO>
```

### Checklist

1. All seven input verdicts present and current
2. All input verdicts passing
3. Prior gates G0-G6 closed
4. Aggregate verdict recorded with citation of any blocker

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `core/decision-rules/DECISION-RULES.md`

## Rules

This prompt never overrides an individual verdict; a single NO-GO/FAIL/BLOCKED input forces aggregate NO-GO regardless of business pressure (Article 7 — stage gate discipline).

## Constraints

- Never mark GO while an input verdict is missing.
- Never substitute judgement for a missing input's result.

## Success Criteria

- Aggregate verdict is a pure function of the input verdicts (Article 13 — determinism).
- GO issued only when every input is passing and gates are closed.

## Failure Conditions

- Aggregate GO issued with a stale or missing input verdict.
- Verdict overridden verbally outside this report.

## Examples

**Conformant**

> Security Scan verdict is BLOCKED. Aggregate Verdict: NO-GO — Security Scan blocked.

## Anti-patterns

- "Everything else passed, ship it and fix security next sprint."
- "The missing verdict is a formality."

## References

- `release/code-review/PULL-REQUEST-REVIEW.md`
- `release/deployment/DEPLOYMENT-READINESS.md`
- `core/quality-gates/QUALITY-GATES.md`
- `release/rollback/ROLLBACK-PLAN.md`
