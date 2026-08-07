---
id: EPOS-TPL-DOMAIN-CANONICAL-DATA-001
version: 1.0.0
status: ACCEPTED
stage: 2/3
gate: G2/G3
depends_on: [EPOS-CORE-CON-001]
---

# Canonical Data Model

## Purpose

Define the enterprise-wide, technology-agnostic representation of domain concepts that all bounded contexts, integrations, and downstream logical models must map to. Bridges Domain (G2) and Data (G3).

## Scope

Applies once Domain Model is accepted. Serves as the single semantic reference for cross-context data exchange, distinct from any single database schema.

## Inputs

- Approved Domain Model (entities, invariants)
- Cross-context data exchange requirements from PRD/ADRs

## Outputs

Primary artefact: **Canonical Data Model**, uniquely identified, versioned, and traceable to
the business requirement that authorised it.

```PROMPT
You are producing the artefact **Canonical Data Model** for bounded context {{BOUNDED_CONTEXT}}
at Stage 2/3, Gate G2/G3.

Before writing anything, emit the EPOS preamble:
- Stage: 2/3
- Bounded Context: {{BOUNDED_CONTEXT}}
- Prerequisites: {{PREREQUISITE_ARTEFACTS}}
- Artefacts produced: Canonical Data Model ({{ARTEFACT_ID}})
- Quality Gate: G2/G3

If any prerequisite in {{PREREQUISITE_ARTEFACTS}} is missing, unapproved, or
inconsistent, refuse. State the missing prerequisite, the article violated, and
the exact path to unblock. Do not proceed on assumptions.

Inputs supplied: {{INPUT_ARTEFACTS}}
Business/technical context: {{CONTEXT_SUMMARY}}
Target identifier prefix: {{ID_PREFIX}}

Produce the Canonical Data Model artefact with these required sections:
- Canonical Entities (business-neutral names, attribute definitions, data types as semantic types not SQL types)
- Cross-Context Mappings
- Master Data vs Transactional Data Classification
- Data Ownership per Entity
- Traceability to Domain Model entities
- Change Governance for canonical fields

Mandatory prohibitions — the output MUST NOT:
- Contain SQL DDL of any kind
- Specify a physical database engine or storage format
- Contain indexes, keys, or partitioning
- Define UI validation messages

Traceability requirements:
- Every canonical entity traces to a Domain Model entity id
- Every entity has a declared owning bounded context

Format: markdown, dense enterprise English, every element carries an
identifier of form {{ID_PREFIX}}-NNN. Close with an explicit statement of
what was decided, why, and what was rejected (Article 6).
```

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `templates/domain/DOMAIN-MODEL.md`
- `templates/data/LOGICAL-DATA-MODEL.md` (consumer)

## Rules

This template applies Constitution rules; it invents none.

### Applied Article 4
A canonical field is defined once; bounded contexts reference it rather than redefining semantics.

### Applied Article 9
Fields that would enable a capability outside architectural scope are absent, not merely undocumented.

## Constraints

- Canonical model changes are versioned and require an ADR if they break an existing mapping.
- No entity without a declared owner.

## Success Criteria

- G3 exit requires every logical data model entity to map to exactly one canonical entity or declare a justified extension.

## Failure Conditions

- Canonical model containing engine-specific types (`VARCHAR(255)`).
- Entity with no owning context.

## Examples

**Conformant**: Canonical entity `Customer.emailAddress` is typed as semantic `EmailAddress`, owned by the Identity context, and referenced by three other bounded contexts rather than redefined.

## Anti-patterns

- Copy-pasting a database table as the canonical model.
- Defining the same concept twice with different field names in two contexts.

## References

- `core/constitution/CONSTITUTION.md` Articles 3, 4, 9
- `templates/domain/DOMAIN-MODEL.md`
- `templates/data/LOGICAL-DATA-MODEL.md`
