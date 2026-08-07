---
id: EPOS-CORE-WFL-002
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-WFL-001]
---

# Approval Gates

## Purpose

Distinguish approval gates (human accountability decisions) from quality
gates (checklist conformance verdicts), and define who approves what,
evidence required, conditional approval, expiry, and re-approval triggers.

## Scope

All artefacts requiring sign-off across Stages 0–7.

## Inputs

- A candidate artefact reaching PASS or CONDITIONAL PASS at its quality gate

## Outputs

- A recorded approval decision with approver identity, date, and evidence

## Dependencies

- `core/workflow/WORKFLOW.md`
- `core/quality-gates/QUALITY-GATES.md`

## Rules

### Approval gate vs. quality gate

A **quality gate** (G0–G7) is a checklist verdict on artefact conformance,
producible by an AI or human reviewer. An **approval gate** is the human
accountability act that authorises the artefact to bind downstream work. An
artefact needs both: it cannot be approved without first passing its quality
gate, and passing the quality gate does not itself constitute approval.

### Who approves what

| Artefact | Approver role | Consulted |
| --- | --- | --- |
| Vision | Business Sponsor | Product Lead |
| PRD | Product Owner | Business Sponsor, Engineering Lead |
| ADR | Architecture Council | Engineering Lead, Security Lead |
| Domain Model | Domain Lead | Product Owner |
| CDM/LDM/PDM | Data Architect | Domain Lead, Security Lead |
| API Contract | Engineering Lead | Domain Lead, Consuming Teams |
| UX Specification | Design Lead | Product Owner, Accessibility Reviewer |
| Implementation | Engineering Lead | QA Lead |
| Release | Release Manager | Business Sponsor, Engineering Lead |

Where a minor or vulnerable party is affected, Article 0 requires the
Safeguarding/Trust & Safety role as a mandatory co-approver regardless of the
table above.

### Evidence required

An approval record states: artefact ID and version, approver identity,
date/time, quality gate verdict referenced by ID, and a one-line rationale.
Verbal or undocumented approval does not satisfy this requirement.

### Conditional approval

An approver may issue CONDITIONAL APPROVAL when the artefact is materially
sound but carries named, bounded conditions (e.g., "pending Security Lead
sign-off on field-level encryption"). Conditional approval:

- Lists each condition with an owner and a due date.
- Permits downstream work only on parts unaffected by the open conditions.
- Converts automatically to blocked status if a condition's due date passes
  unresolved.

### Expiry of approval

An approval expires when any of the following occurs:

- The approved artefact's dependencies change materially (a referenced ADR
  is superseded, a regulation changes).
- 180 days elapse with no implementation activity referencing the artefact.
- The bounded context's data classification or risk tier changes.

An expired approval reverts the artefact to draft status; work must not
proceed against it until re-approved.

### Re-approval triggers

- Any change to Rules, Constraints, or Success Criteria sections of the
  artefact.
- A downstream gate failure attributable to an ambiguity in the artefact.
- A security or privacy incident implicating the artefact's domain.
- A major version bump per `core/constitution/CONSTITUTION.md` Article 12.

## Constraints

- No individual approves their own artefact.
- AI assistants never grant approval; they may only prepare artefacts for
  human approval and report quality gate verdicts.
- Approval records are immutable; corrections are new dated entries.

## Success Criteria

- Every ACCEPTED artefact has a retrievable approval record satisfying the
  evidence requirement.
- No expired approval is referenced as current in downstream work.

## Failure Conditions

- An artefact marked ACCEPTED with no approver identity recorded.
- Work proceeding against a condition that is overdue and unresolved.
- An AI assistant self-declaring an artefact "approved."

## Examples

**Conformant:** "ADR-019 is CONDITIONAL APPROVAL pending Security Lead
review of key rotation, due 2024-07-01. I will proceed with the parts of the
migration unaffected by key rotation only."

**Conformant:** "PRD-042's approval expired after the retention regulation
changed; re-approval by Product Owner is required before Stage 2 resumes."

## Anti-patterns

- Treating a quality gate PASS as equivalent to approval.
- Letting conditional approvals persist indefinitely with no due date.
- An engineer approving their own architecture decision record.

## References

- `core/workflow/WORKFLOW.md`
- `core/quality-gates/QUALITY-GATES.md`
- `core/constitution/CONSTITUTION.md`
