---
id: EPOS-REL-DEP-001
version: 1.0.0
status: ACCEPTED
gate: G7
depends_on: [EPOS-CORE-CON-001]
---
# Deployment Readiness

## Purpose

Verify that the release candidate, its infrastructure, and its operational surroundings are ready for production deployment: environment parity, configuration completeness, health checks, and observability.

## Scope

The full deployment pipeline for the release candidate: build artefacts, environment configuration, infrastructure-as-code, feature flags.

## Inputs

- Release candidate build artefact
- Environment configuration for target environment
- `core/observability` requirements
- Prior deployment incident history for the context

## Outputs

A go/no-go deployment verdict with a findings list per readiness dimension.

This prompt only VERIFIES. It never auto-fixes and never bypasses a gate.

### Prompt

```text
You are the EPOS Deployment Readiness Reviewer. Verify only; do not fix.

Release candidate: {{RC_REF}}
Target environment: {{ENVIRONMENT}}

1. Confirm build artefact is immutable and identical to what passed `CODE-REVIEW.md` and `SECURITY-SCAN.md`.
2. Confirm all required configuration and secrets exist in {{ENVIRONMENT}} and none is defaulted insecurely.
3. Confirm health checks, readiness probes, and observability (logs, metrics, traces) are wired per `core/observability` standard.
4. Confirm feature flags default to the pre-release safe state.
5. Confirm a rollback path exists and references `release/rollback/ROLLBACK-PLAN.md`.
6. Emit the Report Format. Do not deploy or change configuration.
```

### Report Format

```text
DEPLOYMENT READINESS REPORT
Release candidate: <ref>
Environment: <name>

Findings:
[SEVERITY] <dimension> — <description>
...

Verdict: GO | NO-GO
```

### Checklist

1. Artefact identity confirmed unchanged since prior gates
2. Configuration/secrets complete
3. Health/observability wired
4. Feature flags safe by default
5. Rollback path referenced and valid
6. Verdict recorded

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `core/decision-rules/DECISION-RULES.md`

## Rules

Any missing configuration, absent rollback path, or unobservable service forces `NO-GO`. This is the final G7 checkpoint before `release/release-readiness/RELEASE-READINESS.md`.

## Constraints

- Never deploy as part of this review.
- Never mark GO with a placeholder rollback plan.

## Success Criteria

- Verdict GO only when every dimension passes.
- Every NO-GO cites the missing item.

## Failure Conditions

- Deployment proceeds despite a missing rollback reference.
- Health checks assumed present without verification.

## Examples

**Conformant**

> No `/healthz` endpoint wired for new service. `[BLOCKER] observability — no readiness probe`. Verdict: NO-GO.

## Anti-patterns

- "We'll add monitoring after launch."
- "Config is fine, we tested locally."

## References

- `release/migration/MIGRATION-READINESS.md`
- `release/rollback/ROLLBACK-PLAN.md`
- `release/release-readiness/RELEASE-READINESS.md`
