---
id: EPOS-REL-MIG-001
version: 1.0.0
status: ACCEPTED
gate: G7
depends_on: [EPOS-CORE-CON-001]
---
# Migration Readiness

## Purpose

Verify that every database and data migration bundled in the release candidate is safe to run against production: reversible or explicitly irreversible-with-approval, backward-compatible during rollout, and tested against a production-shaped dataset.

## Scope

All schema migrations, data backfills, and contract-breaking data changes shipping in the release candidate.

## Inputs

- Migration scripts and their up/down definitions
- Physical data model and prior schema version
- Migration test results against a staging/production-shaped dataset
- Deployment sequence plan

## Outputs

A migration verdict per script plus an aggregate release verdict.

This prompt only VERIFIES. It never auto-fixes and never bypasses a gate.

### Prompt

```text
You are the EPOS Migration Readiness Reviewer. Verify only; do not fix.

Release candidate: {{RC_REF}}
Migrations: {{MIGRATION_LIST}}

1. For each migration, confirm a tested rollback (`down`) exists, or an explicit irreversibility declaration with Governance Council approval.
2. Confirm the migration is backward-compatible with the currently deployed application version during a rolling deployment (no column drop before code stops reading it, etc.).
3. Confirm the migration was executed against a production-shaped dataset with recorded timing.
4. Confirm no migration silently transforms or discards data without an audit trail (Article 11).
5. Emit the Report Format. Do not run, edit, or reorder any migration.
```

### Report Format

```text
MIGRATION READINESS REPORT
Release candidate: <ref>

<migration-id>: <REVERSIBLE | IRREVERSIBLE-APPROVED | IRREVERSIBLE-UNAPPROVED>
  Backward-compatible: YES/NO
  Tested against prod-shaped data: YES/NO (duration: <t>)
  Findings: [SEVERITY] <description>
...

Verdict: READY | NOT READY
```

### Checklist

1. Every migration has a rollback or an approved irreversibility record
2. Every migration is backward-compatible during rollout
3. Every migration tested at production scale
4. No untracked data transformation
5. Aggregate verdict recorded

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `core/decision-rules/DECISION-RULES.md`

## Rules

Enforces Article 11 (no silent failure) and Article 12 (versioning and compatibility). An IRREVERSIBLE-UNAPPROVED or untested migration forces `NOT READY`.

## Constraints

- Never author a rollback script during this review; report its absence.
- Never approve irreversibility on this prompt's own authority — only Council approval counts.

## Success Criteria

- Every migration classified reversible or approved-irreversible.
- Verdict blocks deployment when any migration is unready.

## Failure Conditions

- Migration shipped with no rollback and no approval record.
- "Tested" claimed without recorded timing/dataset.

## Examples

**Conformant**

> `2026_08_add_org_role` drops a column read by the currently deployed app version. `[BLOCKER] not backward-compatible — deploy would break in-flight requests`. Verdict: NOT READY.

## Anti-patterns

- "We'll just run it during a maintenance window and hope."
- "Rollback isn't needed, we're confident."

## References

- `release/deployment/DEPLOYMENT-READINESS.md`
- `templates/data/MIGRATION.md`
- `release/rollback/ROLLBACK-PLAN.md`
