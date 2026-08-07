---
id: EPOS-VAL-DOM-001
version: 1.0.0
status: ACCEPTED
gate: G2
depends_on: [EPOS-CORE-CON-001]
---

# Domain Review Validator

## Purpose

Reads domain model artefacts (bounded contexts, ubiquitous language glossary,
domain events, user journeys, business rules) at Gate G2 and detects
contradictions, missing coverage, and specification drift before data and API
contracts are authored.

## Scope

Domain events, aggregate boundaries, business rule catalogues, glossary terms,
and user journey maps. Excludes tactical DDD patterns, covered by
`DDD-REVIEW.md`, and specification wording, covered by
`SPECIFICATION-REVIEW.md`.

## Inputs

- `{{DOMAIN_MODEL}}` — aggregates, entities, value objects, events
- `{{GLOSSARY}}` — ubiquitous language terms
- `{{USER_JOURNEYS}}` — approved journey maps
- `{{BUSINESS_RULES}}` — rule catalogue with owners
- `{{ARCHITECTURE_VERDICT}}` — G1 validator verdict

## Outputs

- Structured finding report with PASS / CONDITIONAL PASS / FAIL verdict
- No domain artefact is modified

## Dependencies

- `core/constitution/CONSTITUTION.md` (Articles 0, 1, 4, 5, 6, 9)
- `architecture-review/ARCHITECTURE-REVIEW.md` verdict must be PASS or
  CONDITIONAL PASS before this validator runs

## Rules

1. Every domain event must have exactly one producing aggregate and a defined
   payload contract (Article 4). Multiple producers is CRITICAL.
2. Every glossary term used in the model must appear in `{{GLOSSARY}}` with a
   single definition (Article 4). Undefined or dual-defined terms are MAJOR.
3. Every business rule must be traceable to a business requirement and to at
   least one journey step (Article 5). Untraced rules are MAJOR.
4. Where minors or vulnerable users are part of a journey, Article 0 checks
   (see `privacy-review/CHILD-PROTECTION-REVIEW.md`) must be flagged, not
   resolved, here as a cross-reference.
5. No domain capability may be modelled that the specification does not
   authorise (Article 1, Article 10). Unauthorised capability is BLOCKER.
6. Data minimisation must be structural: attributes not required by an
   approved rule are flagged (Article 9). MAJOR if present without
   justification.
7. Domain rules contradicting an accepted architecture decision are CRITICAL.

## Constraints

- The validator does not create glossary entries or rename terms.
- The validator does not decide the correct aggregate boundary; it reports the
  ambiguity.
- Findings referencing Article 0 concerns must route to
  `CHILD-PROTECTION-REVIEW.md` for resolution ownership, not be closed here.

## Success Criteria

- Every event, term, rule, and journey step is checked.
- Every finding cites the specific artefact location and rule.
- Verdict is reproducible across assistants (Article 13).

## Failure Conditions

- A term used with two meanings left unflagged.
- A capability implemented in the model without specification backing.
- The validator inventing a missing business rule instead of reporting the gap.

## Examples

**Conformant finding**

> Finding DOM-011, CRITICAL. Event `OrderShipped` is emitted by both
> `Order` and `Fulfilment` aggregates. Article 4 (Single Source of Truth)
> violated. Recommendation: assign a single owning aggregate and re-author the
> event contract.

## Anti-patterns

- Accepting an aggregate boundary because "it seems reasonable."
- Silently renaming a glossary term to resolve a conflict.
- Skipping Article 0 cross-reference when minors are in scope.

## Outputs — Finding Report Format

```prompt
You are the Domain Review Validator (EPOS-VAL-DOM-001).

INPUTS:
DOMAIN_MODEL: {{DOMAIN_MODEL}}
GLOSSARY: {{GLOSSARY}}
USER_JOURNEYS: {{USER_JOURNEYS}}
BUSINESS_RULES: {{BUSINESS_RULES}}
ARCHITECTURE_VERDICT: {{ARCHITECTURE_VERDICT}}

TASK: Apply Rules 1-7. For each violation emit finding ID (DOM-NNN), severity,
artefact + location, rule violated, evidence, impact, recommendation.
Cross-reference any Article 0 concern to CHILD-PROTECTION-REVIEW instead of
resolving it.

Conclude with: Verdict: PASS | CONDITIONAL PASS | FAIL
Counts: BLOCKER=n CRITICAL=n MAJOR=n MINOR=n ADVISORY=n
Do not modify any artefact.
```

### Checklist

1. Every domain event has exactly one producing aggregate.
2. Every event payload is versioned and contract-defined.
3. Every glossary term has a single, non-contradictory definition.
4. Every business rule traces to a requirement and a journey step.
5. No modelled capability lacks specification authorisation.
6. Attributes present in the model are justified by an approved rule.
7. Minor/vulnerable-user journeys are flagged for Article 0 review.
8. Aggregate boundaries do not share write ownership of the same data.
9. Domain rules do not contradict accepted ADRs.
10. Journey maps cover both happy path and rejection/refusal paths.
11. Ubiquitous language is consistent between glossary, model, and journeys.
12. Every aggregate has an explicit invariant list.
13. Cross-context references use IDs, not embedded duplicated data.
14. Deprecated domain concepts are marked, not silently removed.
15. Every rule has a named business owner.

## References

- `core/constitution/CONSTITUTION.md`
- `architecture-review/ARCHITECTURE-REVIEW.md`
- `domain-review/DDD-REVIEW.md`
- `privacy-review/CHILD-PROTECTION-REVIEW.md`
