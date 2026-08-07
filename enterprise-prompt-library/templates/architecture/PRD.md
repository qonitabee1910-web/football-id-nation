---
id: EPOS-TPL-ARCH-PRD-001
version: 1.0.0
status: ACCEPTED
stage: 1
gate: G0-G1
depends_on: [EPOS-CORE-CON-001]
---

# Product Requirements Document

## Purpose

Translate approved Business Vision and Stakeholder Map into functional and non-functional requirements precise enough to drive architecture decisions and domain modelling. Bridges G0 to G1.

## Scope

Applies to a feature set or release scoped within an approved bounded context. Does not replace ADRs, which record the resulting architecture decisions.

## Inputs

- Approved Business Vision (BV-OBJ ids)
- Approved Stakeholder Map (STK ids)
- Prior PRDs being extended, if any

## Outputs

Primary artefact: **Product Requirements Document**, uniquely identified, versioned, and traceable to
the business requirement that authorised it.

```PROMPT
You are producing the artefact **Product Requirements Document** for bounded context {{BOUNDED_CONTEXT}}
at Stage 1, Gate G0-G1.

Before writing anything, emit the EPOS preamble:
- Stage: 1
- Bounded Context: {{BOUNDED_CONTEXT}}
- Prerequisites: {{PREREQUISITE_ARTEFACTS}}
- Artefacts produced: Product Requirements Document ({{ARTEFACT_ID}})
- Quality Gate: G0-G1

If any prerequisite in {{PREREQUISITE_ARTEFACTS}} is missing, unapproved, or
inconsistent, refuse. State the missing prerequisite, the article violated, and
the exact path to unblock. Do not proceed on assumptions.

Inputs supplied: {{INPUT_ARTEFACTS}}
Business/technical context: {{CONTEXT_SUMMARY}}
Target identifier prefix: {{ID_PREFIX}}

Produce the Product Requirements Document artefact with these required sections:
- Functional Requirements (id FR-NNN, actor, trigger, outcome)
- Non-Functional Requirements (performance, availability, compliance)
- User Journeys (reference only; detail lives in BUSINESS-JOURNEY.md)
- Acceptance Criteria per requirement
- Out-of-Scope
- Open Questions
- Traceability Matrix (FR -> BV-OBJ -> STK)

Mandatory prohibitions — the output MUST NOT:
- Prescribe a specific database, framework, or library
- Contain API endpoint signatures (belongs to API-CONTRACT)
- Contain UI layout detail (belongs to SCREEN-CATALOGUE)
- Leave a functional requirement without acceptance criteria

Traceability requirements:
- Every FR-NNN traces to a BV-OBJ-NNN and at least one STK-NNN
- Every FR-NNN is later referenced by an ADR or Domain Model entity

Format: markdown, dense enterprise English, every element carries an
identifier of form {{ID_PREFIX}}-NNN. Close with an explicit statement of
what was decided, why, and what was rejected (Article 6).
```

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `templates/architecture/BUSINESS-VISION.md`
- `templates/architecture/STAKEHOLDER-MAP.md`
- `templates/architecture/ADR.md` (consumer)
- `templates/domain/DOMAIN-MODEL.md` (consumer)

## Rules

This template applies Constitution rules; it invents none.

### Applied Article 1
The PRD is the specification gate: no implementation may cite this PRD as authority until it is marked ACCEPTED.

### Applied Article 5
Every requirement id is immutable once accepted; changes create a new versioned requirement with a superseded-by link.

## Constraints

- Requirements are testable; untestable requirements are rejected.
- Non-functional requirements state a measurable threshold.

## Success Criteria

- G1 exit requires every FR to have at least one linked ADR or an explicit 'no architecture decision required' note.

## Failure Conditions

- Requirement with no acceptance criteria.
- Requirement not traceable to Business Vision.
- NFR stated without a threshold (e.g. 'fast' instead of 'p95 < 300ms').

## Examples

**Conformant**: FR-014 'Customer can request a refund within 30 days' traces to BV-OBJ-002 and STK-004, with acceptance criteria enumerating the refund state machine boundary.

## Anti-patterns

- Requirements phrased as implementation tasks ('add a refund button').
- NFRs with no measurable threshold.

## References

- `core/constitution/CONSTITUTION.md` Articles 1, 3, 5
- `templates/architecture/ADR.md`
- `templates/domain/DOMAIN-MODEL.md`
