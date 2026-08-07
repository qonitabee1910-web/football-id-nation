---
id: EPOS-TPL-DATA-LOGICAL-001
version: 1.0.0
status: ACCEPTED
stage: 3
gate: G3
depends_on: [EPOS-CORE-CON-001]
---

# Logical Data Model

## Purpose

Define entities, attributes, relationships, and cardinalities in database-agnostic form, mapped from the Canonical Data Model, ready for physical implementation.

## Scope

Applies once Canonical Data Model is accepted. Precedes Physical Data Model.

## Inputs

- Approved Canonical Data Model
- Approved Domain Model invariants

## Outputs

Primary artefact: **Logical Data Model**, uniquely identified, versioned, and traceable to
the business requirement that authorised it.

```PROMPT
You are producing the artefact **Logical Data Model** for bounded context {{BOUNDED_CONTEXT}}
at Stage 3, Gate G3.

Before writing anything, emit the EPOS preamble:
- Stage: 3
- Bounded Context: {{BOUNDED_CONTEXT}}
- Prerequisites: {{PREREQUISITE_ARTEFACTS}}
- Artefacts produced: Logical Data Model ({{ARTEFACT_ID}})
- Quality Gate: G3

If any prerequisite in {{PREREQUISITE_ARTEFACTS}} is missing, unapproved, or
inconsistent, refuse. State the missing prerequisite, the article violated, and
the exact path to unblock. Do not proceed on assumptions.

Inputs supplied: {{INPUT_ARTEFACTS}}
Business/technical context: {{CONTEXT_SUMMARY}}
Target identifier prefix: {{ID_PREFIX}}

Produce the Logical Data Model artefact with these required sections:
- Entities and Attributes (semantic types, nullability, uniqueness)
- Relationships and Cardinalities
- Normalisation Level and Rationale
- Business Keys vs Surrogate Keys (conceptual)
- Traceability to Canonical Data Model entities

Mandatory prohibitions — the output MUST NOT:
- Contain SQL DDL of any kind
- Specify a database engine or storage technology
- Contain index or partition strategy (belongs to Physical Data Model)
- Contain row-level security policy (belongs to RLS)

Traceability requirements:
- Every entity traces to a Canonical Data Model entity id
- Every relationship traces to a Domain Model invariant where one exists

Format: markdown, dense enterprise English, every element carries an
identifier of form {{ID_PREFIX}}-NNN. Close with an explicit statement of
what was decided, why, and what was rejected (Article 6).
```

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `templates/domain/CANONICAL-DATA-MODEL.md`
- `templates/data/PHYSICAL-DATA-MODEL.md` (consumer)

## Rules

This template applies Constitution rules; it invents none.

### Applied Article 3
The logical model is the contract; physical DDL is generated from it, never authored first.

### Applied Article 4
No attribute duplicates a Canonical Data Model field under a different name.

## Constraints

- Logical model contains zero engine-specific syntax.
- Every many-to-many relationship is explicitly justified.

## Success Criteria

- G3 exit requires every logical entity to map to a Canonical Data Model entity with no unmapped attributes.

## Failure Conditions

- Logical model containing `CREATE TABLE` statements.
- Attribute with an engine-specific type (`SERIAL`, `JSONB`).

## Examples

**Conformant**: The logical model defines `Invoice` with a 1:N relationship to `InvoiceLine`, cardinality enforced, with no SQL present.

## Anti-patterns

- Writing DDL 'to save time' inside the logical model.
- Skipping cardinality definition ('probably one-to-many').

## References

- `core/constitution/CONSTITUTION.md` Articles 3, 4
- `templates/domain/CANONICAL-DATA-MODEL.md`
