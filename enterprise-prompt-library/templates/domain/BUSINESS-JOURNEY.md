---
id: EPOS-TPL-DOMAIN-BUSINESS-JOURNEY-001
version: 1.0.0
status: ACCEPTED
stage: 2
gate: G2
depends_on: [EPOS-CORE-CON-001]
---

# Business Journey

## Purpose

Document the end-to-end business process as a sequence of domain-level steps, actor interactions, and state transitions, independent of screens or APIs, to validate the Domain Model against real usage.

## Scope

Applies to a PRD-approved user or system journey. One journey per document; complex journeys may reference sub-journeys.

## Inputs

- Approved PRD requirements the journey satisfies
- Approved Domain Model entities and events involved

## Outputs

Primary artefact: **Business Journey**, uniquely identified, versioned, and traceable to
the business requirement that authorised it.

```PROMPT
You are producing the artefact **Business Journey** for bounded context {{BOUNDED_CONTEXT}}
at Stage 2, Gate G2.

Before writing anything, emit the EPOS preamble:
- Stage: 2
- Bounded Context: {{BOUNDED_CONTEXT}}
- Prerequisites: {{PREREQUISITE_ARTEFACTS}}
- Artefacts produced: Business Journey ({{ARTEFACT_ID}})
- Quality Gate: G2

If any prerequisite in {{PREREQUISITE_ARTEFACTS}} is missing, unapproved, or
inconsistent, refuse. State the missing prerequisite, the article violated, and
the exact path to unblock. Do not proceed on assumptions.

Inputs supplied: {{INPUT_ARTEFACTS}}
Business/technical context: {{CONTEXT_SUMMARY}}
Target identifier prefix: {{ID_PREFIX}}

Produce the Business Journey artefact with these required sections:
- Journey Overview and Trigger
- Actors Involved
- Step-by-Step Flow (step id, actor, domain action, resulting state/event)
- Alternate and Exception Paths
- Preconditions and Postconditions
- Traceability to FR-NNN, domain entities, and domain events

Mandatory prohibitions — the output MUST NOT:
- Reference specific screens or UI copy (belongs to SCREEN-CATALOGUE)
- Reference API endpoints or HTTP methods
- Specify database queries

Traceability requirements:
- Every step traces to a domain entity or event id
- Journey id traces to at least one PRD FR-NNN

Format: markdown, dense enterprise English, every element carries an
identifier of form {{ID_PREFIX}}-NNN. Close with an explicit statement of
what was decided, why, and what was rejected (Article 6).
```

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `templates/architecture/PRD.md`
- `templates/domain/DOMAIN-MODEL.md`
- `templates/domain/DOMAIN-EVENTS.md`

## Rules

This template applies Constitution rules; it invents none.

### Applied Article 5
Each journey step is individually traceable; a step with no domain artefact backing it flags a gap in the Domain Model.

### Applied Article 0
Journeys touching a vulnerable stakeholder class flag the safeguarding checkpoint explicitly.

## Constraints

- Every alternate path terminates in a defined domain state, never left open.
- Journeys are versioned alongside the Domain Model they depend on.

## Success Criteria

- G2 exit requires every primary PRD journey to have a corresponding Business Journey document with no orphaned steps.

## Failure Conditions

- Step referencing a UI button label.
- Exception path with no resulting state.

## Examples

**Conformant**: The 'Request Refund' journey shows Customer initiating RefundRequested, System validating against INV-003, and either RefundApproved or RefundRejected as terminal domain events.

## Anti-patterns

- Describing the journey purely as UI clicks.
- Leaving exception paths unresolved ('then something goes wrong').

## References

- `core/constitution/CONSTITUTION.md` Articles 0, 5
- `templates/domain/DOMAIN-MODEL.md`
- `templates/domain/DOMAIN-EVENTS.md`
