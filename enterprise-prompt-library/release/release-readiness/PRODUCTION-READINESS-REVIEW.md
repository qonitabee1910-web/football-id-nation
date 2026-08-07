---
id: EPOS-REL-RDY-001
version: 1.0.0
status: ACCEPTED
gate: G7
depends_on: [EPOS-CORE-CON-001]
---
# Production Readiness Review

## Purpose

Verify, at a service or capability's first production exposure, that it meets the full operational bar: reliability, scalability, security, support runbooks, and on-call ownership — beyond the single-release checks.

## Scope

A service or capability being exposed to production traffic for the first time, or after a material architectural change.

## Inputs

- Service architecture and SLOs
- Runbook / on-call documentation
- Load and failure-mode test results
- `core/architecture-rules`, `core/security-principles`

## Outputs

A production-readiness verdict with dimension-by-dimension findings, distinct from a single release's deployment checklist.

This prompt only VERIFIES. It never auto-fixes and never bypasses a gate.

### Prompt

```text
You are the EPOS Production Readiness Reviewer. Verify only; do not fix.

Service/capability: {{SERVICE_NAME}}
First production exposure: {{YES_NO}}

1. Confirm SLOs are defined and instrumented (latency, availability, error budget).
2. Confirm failure modes (dependency outage, overload, data corruption) have documented and tested responses.
3. Confirm a runbook exists covering incident response, escalation, and on-call ownership.
4. Confirm capacity/load testing was performed at expected peak plus margin.
5. Confirm security and privacy reviews for this service are on file and current.
6. Emit the Report Format. Do not author the runbook or SLOs.
```

### Report Format

```text
PRODUCTION READINESS REVIEW
Service: <name>

Dimension: SLOs | Failure modes | Runbook | Capacity | Security/Privacy
[SEVERITY] <dimension> — <description>
...

Verdict: PRODUCTION READY | NOT READY
```

### Checklist

1. SLOs defined and instrumented
2. Failure modes tested and documented
3. Runbook and on-call owner exist
4. Capacity tested at peak+margin
5. Security/privacy review current
6. Verdict recorded

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `core/decision-rules/DECISION-RULES.md`

## Rules

Distinct from `DEPLOYMENT-READINESS.md`, which governs a single release; this prompt governs the service's fitness to bear production load and incidents at all. Applies at first exposure and at material architecture change.

## Constraints

- Never author the missing runbook.
- Never approve without evidence of load testing.

## Success Criteria

- Every dimension has explicit evidence, not assertion.
- Verdict NOT READY blocks first production traffic.

## Failure Conditions

- "We'll write the runbook after the incident happens."
- SLOs claimed with no instrumentation.

## Examples

**Conformant**

> No documented response to database failover. `[CRITICAL] failure modes — no tested response to primary DB loss`. Verdict: NOT READY.

## Anti-patterns

- "It's a small service, it'll be fine."
- "On-call will figure it out."

## References

- `release/deployment/DEPLOYMENT-READINESS.md`
- `release/release-readiness/RELEASE-READINESS.md`
- `core/architecture-rules/ARCHITECTURE-RULES.md`
