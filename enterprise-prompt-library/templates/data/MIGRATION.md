---
id: EPOS-TPL-DATA-MIGRATION-001
version: 1.0.0
status: ACCEPTED
stage: 6
gate: G6
depends_on: [EPOS-CORE-CON-001]
---

# Data Migration

## Purpose

Specify the migration script plan implementing an accepted Physical Data Model change: forward migration, rollback, and data backfill strategy.

## Scope

Applies to any schema change reaching implementation. One migration document per deployable schema change set.

## Inputs

- Approved Physical Data Model change
- Current production schema version

## Outputs

Primary artefact: **Data Migration**, uniquely identified, versioned, and traceable to
the business requirement that authorised it.

```PROMPT
You are producing the artefact **Data Migration** for bounded context {{BOUNDED_CONTEXT}}
at Stage 6, Gate G6.

Before writing anything, emit the EPOS preamble:
- Stage: 6
- Bounded Context: {{BOUNDED_CONTEXT}}
- Prerequisites: {{PREREQUISITE_ARTEFACTS}}
- Artefacts produced: Data Migration ({{ARTEFACT_ID}})
- Quality Gate: G6

If any prerequisite in {{PREREQUISITE_ARTEFACTS}} is missing, unapproved, or
inconsistent, refuse. State the missing prerequisite, the article violated, and
the exact path to unblock. Do not proceed on assumptions.

Inputs supplied: {{INPUT_ARTEFACTS}}
Business/technical context: {{CONTEXT_SUMMARY}}
Target identifier prefix: {{ID_PREFIX}}

Produce the Data Migration artefact with these required sections:
- Migration Identifier and Target Schema Version
- Forward Migration Steps
- Rollback Steps
- Data Backfill/Transformation Plan
- Downtime/Locking Impact
- Validation Queries Post-Migration
- Traceability to Physical Data Model change

Mandatory prohibitions — the output MUST NOT:
- Introduce schema elements not present in the approved Physical Data Model
- Omit a rollback plan
- Contain application code changes

Traceability requirements:
- Migration id traces to the Physical Data Model version it implements
- Rollback step traces one-to-one to each forward step

Format: markdown, dense enterprise English, every element carries an
identifier of form {{ID_PREFIX}}-NNN. Close with an explicit statement of
what was decided, why, and what was rejected (Article 6).
```

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `templates/data/PHYSICAL-DATA-MODEL.md`
- `templates/devops/CI-CD.md` (executes this)

## Rules

This template applies Constitution rules; it invents none.

### Applied Article 11
Every migration includes validation queries; a migration with no verification step is incomplete.

### Applied Article 12
Breaking migrations are versioned and include a documented deprecation window for dependent consumers.

## Constraints

- Every forward step has a corresponding rollback step.
- Destructive steps (drop column/table) run only after a deprecation window.

## Success Criteria

- G6 exit requires the migration to be executed in a non-production environment with validation queries passing.

## Failure Conditions

- Migration with no rollback.
- Dropping a column in the same migration that introduces its replacement (no deprecation window).

## Examples

**Conformant**: Migration MIG-042 adds `customer.loyalty_tier` nullable, backfills from `loyalty_ledger`, and rolls back by dropping the column, traced to Physical Data Model v1.3.

## Anti-patterns

- Combining unrelated schema changes into one migration.
- Migration with a rollback that silently loses data with no warning.

## References

- `core/constitution/CONSTITUTION.md` Articles 11, 12
- `templates/data/PHYSICAL-DATA-MODEL.md`
