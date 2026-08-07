---
id: EPOS-VAL-DDD-001
version: 1.0.0
status: ACCEPTED
gate: G2
depends_on: [EPOS-CORE-CON-001]
---

# Tactical DDD Review Validator

## Purpose

Reads tactical Domain-Driven Design artefacts — aggregates, entities, value
objects, repositories, domain services, factories — and detects violations of
DDD tactical patterns and Article-level governance rules before contracts are
authored.

## Scope

Aggregate root design, entity/value-object classification, repository
contracts, domain service boundaries, invariant enforcement. Excludes
strategic domain modelling (`DOMAIN-REVIEW.md`) and physical data modelling
(`data-review/DATA-REVIEW.md`).

## Inputs

- `{{AGGREGATE_SPECS}}` — aggregate root definitions with invariants
- `{{ENTITY_VO_LIST}}` — entities and value objects with identity rules
- `{{REPOSITORY_CONTRACTS}}` — repository interface definitions
- `{{DOMAIN_SERVICES}}` — cross-aggregate operations
- `{{DOMAIN_REVIEW_VERDICT}}` — output of `DOMAIN-REVIEW.md`

## Outputs

- Structured finding report with PASS / CONDITIONAL PASS / FAIL verdict
- No tactical artefact is modified

## Dependencies

- `core/constitution/CONSTITUTION.md` (Articles 1, 4, 8, 10)
- `domain-review/DOMAIN-REVIEW.md`

## Rules

1. Every aggregate must enforce its invariants internally; no invariant may
   depend on client-side checks (Article 8). Violation is BLOCKER.
2. Value objects must be immutable and defined by structural equality; mutable
   value objects are MAJOR.
3. An aggregate must not hold a direct object reference to another aggregate
   root; cross-aggregate references use identity only (Article 4). CRITICAL if
   violated.
4. Repository contracts must expose aggregate-level operations only, not
   internal entity CRUD (Article 4). MAJOR if violated.
5. Domain services must be stateless and used only when an operation does not
   naturally belong to a single aggregate (Article 10, avoid unauthorised
   complexity). MINOR if misused.
6. Every invariant must be traceable to a business rule approved in
   `DOMAIN-REVIEW.md` (Article 5). Untraced invariants are MAJOR.

## Constraints

- The validator does not refactor class structures; it reports the deviation.
- The validator assumes `DOMAIN-REVIEW.md` has already validated strategic
  boundaries; it does not re-litigate bounded-context assignment.

## Success Criteria

- Every aggregate, entity, value object, repository, and service is checked
  against Rules 1-6.
- Findings cite the exact artefact and pattern violated.

## Failure Conditions

- An aggregate exposing a public setter that bypasses an invariant.
- A repository with per-field update methods.
- The validator writing corrected code instead of reporting the defect.

## Examples

**Conformant finding**

> Finding DDD-006, CRITICAL. `Invoice` aggregate holds a direct reference to
> `Customer` aggregate root instead of `CustomerId`. Article 4 violated
> (duplicated authority over customer state). Recommendation: replace the
> reference with an identity value object.

## Anti-patterns

- Treating an anemic domain model (all getters/setters, no invariants) as
  acceptable because "it compiles."
- Allowing a domain service to mutate aggregate internals directly.

## Outputs — Finding Report Format

```prompt
You are the Tactical DDD Review Validator (EPOS-VAL-DDD-001).

INPUTS:
AGGREGATE_SPECS: {{AGGREGATE_SPECS}}
ENTITY_VO_LIST: {{ENTITY_VO_LIST}}
REPOSITORY_CONTRACTS: {{REPOSITORY_CONTRACTS}}
DOMAIN_SERVICES: {{DOMAIN_SERVICES}}
DOMAIN_REVIEW_VERDICT: {{DOMAIN_REVIEW_VERDICT}}

TASK: Apply Rules 1-6. Emit finding ID (DDD-NNN), severity, artefact +
location, rule violated, evidence, impact, recommendation for each violation.

Conclude with: Verdict: PASS | CONDITIONAL PASS | FAIL
Counts: BLOCKER=n CRITICAL=n MAJOR=n MINOR=n ADVISORY=n
Do not modify any artefact.
```

### Checklist

1. Every aggregate enforces its invariants internally.
2. No client-side-only invariant enforcement exists.
3. Value objects are immutable with structural equality.
4. No aggregate holds a direct reference to another aggregate root.
5. Cross-aggregate references use identity values only.
6. Repository contracts expose aggregate-level operations only.
7. No repository exposes per-field CRUD bypassing the aggregate root.
8. Domain services are stateless.
9. Domain services are used only for genuinely cross-aggregate operations.
10. Every invariant traces to an approved business rule.
11. Entities have explicit identity distinct from value objects.
12. Factories, not public constructors, enforce creation invariants where
    creation is non-trivial.
13. No anemic aggregates (data holders with no behaviour).
14. Aggregate boundaries are transaction-consistency boundaries only.

## References

- `core/constitution/CONSTITUTION.md`
- `domain-review/DOMAIN-REVIEW.md`
