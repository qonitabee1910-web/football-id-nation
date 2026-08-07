---
id: EPOS-TPL-DOMAIN-EVENTS-001
version: 1.0.0
status: ACCEPTED
stage: 2
gate: G2
depends_on: [EPOS-CORE-CON-001]
---

# Domain Events

## Purpose

Define the catalogue of business-significant events emitted by aggregates, their payload contracts, and consumers, establishing the event contract before any messaging implementation.

## Scope

Applies once Domain Model aggregates and invariants are accepted. Precedes any event-driven integration implementation.

## Inputs

- Approved Domain Model (aggregates, invariants)
- ADRs selecting event-driven integration where applicable

## Outputs

Primary artefact: **Domain Events**, uniquely identified, versioned, and traceable to
the business requirement that authorised it.

```PROMPT
You are producing the artefact **Domain Events** for bounded context {{BOUNDED_CONTEXT}}
at Stage 2, Gate G2.

Before writing anything, emit the EPOS preamble:
- Stage: 2
- Bounded Context: {{BOUNDED_CONTEXT}}
- Prerequisites: {{PREREQUISITE_ARTEFACTS}}
- Artefacts produced: Domain Events ({{ARTEFACT_ID}})
- Quality Gate: G2

If any prerequisite in {{PREREQUISITE_ARTEFACTS}} is missing, unapproved, or
inconsistent, refuse. State the missing prerequisite, the article violated, and
the exact path to unblock. Do not proceed on assumptions.

Inputs supplied: {{INPUT_ARTEFACTS}}
Business/technical context: {{CONTEXT_SUMMARY}}
Target identifier prefix: {{ID_PREFIX}}

Produce the Domain Events artefact with these required sections:
- Event Catalogue (id EVT-NNN, name in past tense, triggering aggregate)
- Event Payload Schema (semantic types, not wire format)
- Producers and Consumers
- Ordering and Idempotency Requirements
- Event Versioning Policy
- Traceability to Domain Model invariants

Mandatory prohibitions — the output MUST NOT:
- Contain message broker configuration (topic names, partitions, queue depth)
- Contain serialization code
- Define retry/backoff implementation detail

Traceability requirements:
- Every event traces to the aggregate and invariant it reflects
- Every consumer reference traces to a bounded context in the Domain Model context map

Format: markdown, dense enterprise English, every element carries an
identifier of form {{ID_PREFIX}}-NNN. Close with an explicit statement of
what was decided, why, and what was rejected (Article 6).
```

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `templates/domain/DOMAIN-MODEL.md`
- `templates/api/API-CONTRACT.md` (may reference events as async operations)

## Rules

This template applies Constitution rules; it invents none.

### Applied Article 3
Event payload contracts are authored before the producer or consumer code exists.

### Applied Article 12
Breaking payload changes increment the event major version and both versions coexist during migration.

## Constraints

- Event names are past-tense business facts (`OrderShipped`), never commands.
- Every event has at least one declared consumer or is marked speculative and rejected.

## Success Criteria

- G2 exit requires every state transition with cross-context impact to have a corresponding domain event.

## Failure Conditions

- Event named as a command (`ShipOrder`).
- Event with no consumer and no justification.
- Payload schema expressed as JSON wire format instead of semantic types.

## Examples

**Conformant**: `OrderShipped` (EVT-014) carries `orderId`, `shippedAt`, `carrier` and is consumed by the Notifications and Analytics contexts, traceable to invariant INV-003.

## Anti-patterns

- Modelling CRUD table changes as events ('CustomerRowUpdated').
- Embedding retry logic detail in the event definition.

## References

- `core/constitution/CONSTITUTION.md` Articles 3, 12
- `templates/domain/DOMAIN-MODEL.md`
