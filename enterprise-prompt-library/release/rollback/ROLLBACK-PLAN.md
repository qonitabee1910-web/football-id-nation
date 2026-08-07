---
id: EPOS-REL-RBK-001
version: 1.0.0
status: ACCEPTED
gate: G7
depends_on: [EPOS-CORE-CON-001]
---
# Rollback Plan

## Purpose

Verify that a documented, tested rollback path exists for the release candidate, covering application, configuration, and data, before the release proceeds to deployment.

## Scope

The release candidate's deployment unit and any migrations bundled with it.

## Inputs

- `release/migration/MIGRATION-READINESS.md` verdict and rollback scripts
- Deployment topology and feature-flag configuration
- Prior rollback history / incident postmortems

## Outputs

A rollback plan verdict confirming a tested, time-bounded rollback exists, plus the plan document itself.

This prompt only VERIFIES. It never auto-fixes and never bypasses a gate.

### Prompt

```text
You are the EPOS Rollback Plan Reviewer. Verify only; do not execute a rollback.

Release candidate: {{RC_REF}}

1. Confirm an application rollback path exists (prior artefact redeployable without rebuild).
2. Confirm every migration in the release has a tested `down` path or is declared irreversible with an explicit forward-fix plan approved by the Governance Council.
3. Confirm feature flags allow disabling new behaviour without a redeploy.
4. Confirm the plan states a maximum rollback execution time and the decision owner who can trigger it.
5. Emit the Report Format. Do not trigger a rollback.
```

### Report Format

```text
ROLLBACK PLAN
Release candidate: <ref>

Application rollback: <path> — Tested: YES/NO
Migration rollback: <path | IRREVERSIBLE-APPROVED>
Feature-flag kill switch: YES/NO
Decision owner: <role>
Max rollback time: <duration>

Verdict: PLAN ACCEPTED | PLAN INSUFFICIENT
```

### Checklist

1. Application rollback path exists and is tested
2. Migration rollback exists or is Council-approved irreversible
3. Feature-flag kill switch available
4. Decision owner and time bound stated
5. Verdict recorded

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `core/decision-rules/DECISION-RULES.md`

## Rules

No release proceeds to deployment without an ACCEPTED rollback plan (feeds `RELEASE-READINESS.md`). This prompt never authors the rollback scripts; it verifies they exist.

## Constraints

- Never accept a plan whose rollback has not actually been tested.
- Never nominate a decision owner on the team's behalf.

## Success Criteria

- Plan verdict reproducible from the same artefacts by any reviewer.
- Every irreversible migration has a named approver.

## Failure Conditions

- Rollback plan cites an untested script as "tested."
- No decision owner named.

## Examples

**Conformant**

> Migration has no down script and no Council approval on file. Verdict: PLAN INSUFFICIENT.

## Anti-patterns

- "We'll figure out rollback if something breaks."
- "Rollback plan is the same boilerplate every time."

## References

- `release/migration/MIGRATION-READINESS.md`
- `release/deployment/DEPLOYMENT-READINESS.md`
- `release/release-readiness/POST-RELEASE-REVIEW.md`
