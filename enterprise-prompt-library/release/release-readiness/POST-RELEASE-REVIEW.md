---
id: EPOS-REL-RDY-003
version: 1.0.0
status: ACCEPTED
gate: G7
depends_on: [EPOS-CORE-CON-001]
---
# Post-Release Review

## Purpose

Verify, after a release has been live for its observation window, whether it performed as predicted: SLOs held, no rollback was triggered, no unresolved incident traces back to the release, and lessons are captured.

## Scope

The release identified by `{{RELEASE_ID}}`, observed for its defined post-release window (default: 72 hours or as set by the bounded context's SLO policy).

## Inputs

- Production metrics/SLO dashboards for the observation window
- Incident and alert history since deployment
- The GO verdict and rollback plan from the release

## Outputs

A post-release verdict and a lessons-learned record feeding future `PRODUCTION-READINESS-REVIEW.md` runs.

This prompt only VERIFIES. It never auto-fixes and never bypasses a gate.

### Prompt

```text
You are the EPOS Post-Release Reviewer. Verify only; do not remediate.

Release: {{RELEASE_ID}}
Observation window: {{WINDOW}}

1. Confirm SLOs stayed within the error budget for {{WINDOW}}.
2. Confirm no rollback was triggered; if one was, capture why the pre-release verdicts did not catch it.
3. Confirm every incident or alert during {{WINDOW}} is triaged and, if release-caused, root-caused.
4. Record lessons learned and any gate or checklist gap they expose.
5. Emit the Report Format.
```

### Report Format

```text
POST-RELEASE REVIEW
Release: <id>
Window: <duration>

SLOs held: YES/NO — <detail>
Rollback triggered: YES/NO — <reason if YES>
Incidents linked to release: <list, each with root cause or OPEN>

Verdict: STABLE | UNSTABLE — <follow-up required>
Gate/checklist gap identified: <none | description>
```

### Checklist

1. SLO status confirmed for the full window
2. Rollback status confirmed and explained if triggered
3. Every linked incident triaged with a root cause or explicitly OPEN
4. Lessons learned recorded and routed to the owning gate/checklist
5. Verdict recorded

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `core/decision-rules/DECISION-RULES.md`

## Rules

Findings that reveal a gate or checklist gap are routed to `GOVERNANCE.md`'s amendment process, not patched ad hoc in this prompt's own scope.

## Constraints

- Never close an OPEN incident without a root cause to make the verdict look STABLE.
- Never skip the review because the release "felt fine."

## Success Criteria

- Verdict backed by actual metrics, not impression.
- Every gap identified is routed to governance for a fix.

## Failure Conditions

- STABLE verdict issued with an unresolved release-linked incident.
- Review skipped entirely.

## Examples

**Conformant**

> Error budget breached twice during window, root cause: untested migration performance. Verdict: UNSTABLE — follow-up: amend `MIGRATION-READINESS.md` checklist to require load-tested timing.

## Anti-patterns

- "No news is good news, skip the review."
- Declaring STABLE before the observation window ends.

## References

- `release/release-readiness/PRODUCTION-READINESS-REVIEW.md`
- `release/rollback/ROLLBACK-PLAN.md`
- `GOVERNANCE.md`
