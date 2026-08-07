---
id: EPOS-TPL-DATA-PHYSICAL-001
version: 1.0.0
status: ACCEPTED
stage: 3
gate: G3
depends_on: [EPOS-CORE-CON-001]
---

# Physical Data Model

## Purpose

Translate the accepted Logical Data Model into engine-specific schema design: tables, columns, types, keys, indexes, and partitioning.

## Scope

Applies once Logical Data Model is accepted and a database engine is chosen by ADR. Produces the schema design that MIGRATION.md will implement.

## Inputs

- Approved Logical Data Model
- ADR selecting the database engine

## Outputs

Primary artefact: **Physical Data Model**, uniquely identified, versioned, and traceable to
the business requirement that authorised it.

```PROMPT
You are producing the artefact **Physical Data Model** for bounded context {{BOUNDED_CONTEXT}}
at Stage 3, Gate G3.

Before writing anything, emit the EPOS preamble:
- Stage: 3
- Bounded Context: {{BOUNDED_CONTEXT}}
- Prerequisites: {{PREREQUISITE_ARTEFACTS}}
- Artefacts produced: Physical Data Model ({{ARTEFACT_ID}})
- Quality Gate: G3

If any prerequisite in {{PREREQUISITE_ARTEFACTS}} is missing, unapproved, or
inconsistent, refuse. State the missing prerequisite, the article violated, and
the exact path to unblock. Do not proceed on assumptions.

Inputs supplied: {{INPUT_ARTEFACTS}}
Business/technical context: {{CONTEXT_SUMMARY}}
Target identifier prefix: {{ID_PREFIX}}

Produce the Physical Data Model artefact with these required sections:
- Table Definitions (name, columns, types, nullability)
- Primary and Foreign Keys
- Indexes and Rationale
- Partitioning/Sharding Strategy (if any)
- Constraints (check, unique)
- Traceability to Logical Data Model entities

Mandatory prohibitions — the output MUST NOT:
- Contain executable migration scripts (belongs to MIGRATION.md)
- Contain application code or ORM model classes
- Introduce an entity absent from the Logical Data Model

Traceability requirements:
- Every table traces to a Logical Data Model entity id
- Every index states the query pattern it serves

Format: markdown, dense enterprise English, every element carries an
identifier of form {{ID_PREFIX}}-NNN. Close with an explicit statement of
what was decided, why, and what was rejected (Article 6).
```

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `templates/data/LOGICAL-DATA-MODEL.md`
- `templates/data/MIGRATION.md` (consumer)
- `templates/data/RLS.md` (sibling)

## Rules

This template applies Constitution rules; it invents none.

### Applied Article 3
Schema is derived from the logical contract; no table exists that cannot be traced upward.

### Applied Article 9
Columns enabling out-of-scope capabilities are absent, not merely unused.

## Constraints

- Every foreign key enforces a Logical Data Model relationship.
- No index without a stated query justification.

## Success Criteria

- G3 exit requires schema review confirming full Logical Data Model coverage with no undocumented tables.

## Failure Conditions

- Table with no traceable logical entity ('just in case' columns).
- Index added with no query justification.

## Examples

**Conformant**: Table `invoice_line` carries `invoice_id` FK to `invoice.id`, an index on `(invoice_id, line_number)` justified by the line-listing query, traced to the Logical Data Model's InvoiceLine entity.

## Anti-patterns

- Denormalising for 'performance' without an ADR.
- Adding a soft-delete column not present in the logical model.

## References

- `core/constitution/CONSTITUTION.md` Articles 3, 9
- `templates/data/LOGICAL-DATA-MODEL.md`
