---
id: EPOS-TPL-DOMAIN-MODEL-001
version: 1.0.0
status: ACCEPTED
stage: 2
gate: G2
depends_on: [EPOS-CORE-CON-001]
---

# Domain Model

## Purpose

Define the ubiquitous language: entities, value objects, aggregates, invariants, and bounded context boundaries that all downstream data, API, and UI artefacts must reuse verbatim.

## Scope

Applies to the bounded context defined in the approved PRD. Precedes canonical data model, domain events, and API contract.

## Inputs

- Approved PRD (FR-NNN ids)
- Approved ADRs affecting domain boundaries

## Outputs

Primary artefact: **Domain Model**, uniquely identified, versioned, and traceable to
the business requirement that authorised it.

```PROMPT
You are producing the artefact **Domain Model** for bounded context {{BOUNDED_CONTEXT}}
at Stage 2, Gate G2.

Before writing anything, emit the EPOS preamble:
- Stage: 2
- Bounded Context: {{BOUNDED_CONTEXT}}
- Prerequisites: {{PREREQUISITE_ARTEFACTS}}
- Artefacts produced: Domain Model ({{ARTEFACT_ID}})
- Quality Gate: G2

If any prerequisite in {{PREREQUISITE_ARTEFACTS}} is missing, unapproved, or
inconsistent, refuse. State the missing prerequisite, the article violated, and
the exact path to unblock. Do not proceed on assumptions.

Inputs supplied: {{INPUT_ARTEFACTS}}
Business/technical context: {{CONTEXT_SUMMARY}}
Target identifier prefix: {{ID_PREFIX}}

Produce the Domain Model artefact with these required sections:
- Ubiquitous Language Glossary
- Entities and Value Objects (id, attributes, invariants)
- Aggregates and Aggregate Roots
- Bounded Context Boundary and Context Map
- Business Invariants (id INV-NNN)
- Traceability to PRD FR-NNN

Mandatory prohibitions — the output MUST NOT:
- Contain SQL, table names, or column types (belongs to data templates)
- Contain API endpoints or HTTP verbs
- Contain UI component names
- Introduce a term not present in the Ubiquitous Language Glossary

Traceability requirements:
- Every entity references the FR-NNN that requires it
- Every invariant INV-NNN is later referenced by CANONICAL-DATA-MODEL and API-CONTRACT validation rules

Format: markdown, dense enterprise English, every element carries an
identifier of form {{ID_PREFIX}}-NNN. Close with an explicit statement of
what was decided, why, and what was rejected (Article 6).
```

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `templates/architecture/PRD.md`
- `templates/domain/DOMAIN-EVENTS.md` (sibling)
- `templates/domain/CANONICAL-DATA-MODEL.md` (consumer)

## Rules

This template applies Constitution rules; it invents none.

### Applied Article 4
Each business term is defined exactly once in the Glossary; every other artefact references it, none redefines it.

### Applied Article 2
Aggregate boundaries are architecture decisions; a boundary change requires an ADR.

## Constraints

- No entity exists without at least one invariant or explicit 'no invariant' note.
- Aggregate roots are the only entry point for state mutation.

## Success Criteria

- G2 exit requires every FR-NNN with domain impact to map to at least one entity or aggregate.

## Failure Conditions

- Entity with a database column list instead of business attributes.
- Two entities defining the same business concept differently.

## Examples

**Conformant**: The `Order` aggregate root enforces invariant INV-003 'total cannot be modified after Shipped status', referenced later by the API contract's state-transition validation.

## Anti-patterns

- Naming entities after database tables (`orders_tbl`).
- Modelling UI screens as domain entities.

## References

- `core/constitution/CONSTITUTION.md` Articles 2, 4
- `templates/architecture/PRD.md`
- `templates/domain/DOMAIN-EVENTS.md`
