---
id: EPOS-TPL-ARCH-ADR-001
version: 1.0.0
status: ACCEPTED
stage: 1
gate: G1
depends_on: [EPOS-CORE-CON-001]
---

# Architecture Decision Record

## Purpose

Record a single architecture decision, its context, alternatives considered, and consequences, per Article 2. Every material architecture change produces exactly one ADR.

## Scope

Applies to any decision affecting system structure, technology selection, integration pattern, or cross-cutting concern. One ADR per decision.

## Inputs

- Approved PRD requirement(s) driving the decision
- Constraints from prior ADRs not yet superseded

## Outputs

Primary artefact: **Architecture Decision Record**, uniquely identified, versioned, and traceable to
the business requirement that authorised it.

```PROMPT
You are producing the artefact **Architecture Decision Record** for bounded context {{BOUNDED_CONTEXT}}
at Stage 1, Gate G1.

Before writing anything, emit the EPOS preamble:
- Stage: 1
- Bounded Context: {{BOUNDED_CONTEXT}}
- Prerequisites: {{PREREQUISITE_ARTEFACTS}}
- Artefacts produced: Architecture Decision Record ({{ARTEFACT_ID}})
- Quality Gate: G1

If any prerequisite in {{PREREQUISITE_ARTEFACTS}} is missing, unapproved, or
inconsistent, refuse. State the missing prerequisite, the article violated, and
the exact path to unblock. Do not proceed on assumptions.

Inputs supplied: {{INPUT_ARTEFACTS}}
Business/technical context: {{CONTEXT_SUMMARY}}
Target identifier prefix: {{ID_PREFIX}}

Produce the Architecture Decision Record artefact with these required sections:
- Title and Status (Proposed/Accepted/Superseded)
- Context (business and technical forces)
- Decision
- Alternatives Considered (at least two, with rejection reason)
- Consequences (positive, negative, follow-up work)
- Traceability to PRD FR-NNN
- Supersession Link (if replacing a prior ADR)

Mandatory prohibitions — the output MUST NOT:
- Contain implementation code or pseudocode
- Leave 'Alternatives Considered' empty or single-option
- Omit negative consequences
- Decide UI or data schema detail owned by other templates

Traceability requirements:
- ADR id ADR-NNN traces to at least one FR-NNN
- Superseding ADR references the superseded ADR id explicitly

Format: markdown, dense enterprise English, every element carries an
identifier of form {{ID_PREFIX}}-NNN. Close with an explicit statement of
what was decided, why, and what was rejected (Article 6).
```

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `templates/architecture/PRD.md`
- `templates/domain/DOMAIN-MODEL.md` (may consume)
- `templates/data/LOGICAL-DATA-MODEL.md` (may consume)

## Rules

This template applies Constitution rules; it invents none.

### Applied Article 2
No structural change is built before its ADR is Accepted.

### Applied Article 12
A decision that breaks a prior ADR creates a new ADR with a Supersession Link; the old ADR is marked Superseded, never deleted.

## Constraints

- Exactly one decision per ADR.
- Status transitions are append-only (never rewrite history).

## Success Criteria

- G1 exit requires every ADR to be Accepted and every consequence to be either resolved or tracked as an open follow-up.

## Failure Conditions

- ADR with a single alternative ('we chose X, no other option existed').
- ADR deleted rather than superseded.

## Examples

**Conformant**: ADR-007 'Use event-driven integration between Billing and Notifications' documents synchronous REST as a rejected alternative due to coupling risk, and traces to FR-021.

## Anti-patterns

- Writing the ADR after the code is merged.
- Bundling five decisions into one ADR.

## References

- `core/constitution/CONSTITUTION.md` Articles 2, 12
- `templates/architecture/PRD.md`
