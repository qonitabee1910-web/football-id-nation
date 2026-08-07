---
id: EPOS-TPL-API-CONTRACT-001
version: 1.0.0
status: ACCEPTED
stage: 4
gate: G4
depends_on: [EPOS-CORE-CON-001]
---

# API Contract

## Purpose

Define the business-facing contract of operations, requests, responses, and error semantics for a bounded context, authored before any endpoint implementation, per Article 3.

## Scope

Applies to every API surface exposed by a bounded context, whether REST, GraphQL, or async/event-triggered. Precedes OPENAPI.md formalisation.

## Inputs

- Approved Domain Model and Domain Events
- Approved PRD requirements the API satisfies

## Outputs

Primary artefact: **API Contract**, uniquely identified, versioned, and traceable to
the business requirement that authorised it.

```PROMPT
You are producing the artefact **API Contract** for bounded context {{BOUNDED_CONTEXT}}
at Stage 4, Gate G4.

Before writing anything, emit the EPOS preamble:
- Stage: 4
- Bounded Context: {{BOUNDED_CONTEXT}}
- Prerequisites: {{PREREQUISITE_ARTEFACTS}}
- Artefacts produced: API Contract ({{ARTEFACT_ID}})
- Quality Gate: G4

If any prerequisite in {{PREREQUISITE_ARTEFACTS}} is missing, unapproved, or
inconsistent, refuse. State the missing prerequisite, the article violated, and
the exact path to unblock. Do not proceed on assumptions.

Inputs supplied: {{INPUT_ARTEFACTS}}
Business/technical context: {{CONTEXT_SUMMARY}}
Target identifier prefix: {{ID_PREFIX}}

Produce the API Contract artefact with these required sections:
- Operation Catalogue (id OP-NNN, verb/intent, purpose, actor)
- Request/Response Semantic Schema (business types, not wire format)
- Error Taxonomy (business error codes and meaning)
- Idempotency and Concurrency Semantics
- Versioning Policy
- Traceability to Domain Model entities and PRD FR-NNN

Mandatory prohibitions — the output MUST NOT:
- Contain controller code, route handlers, or middleware
- Contain framework-specific decorators or annotations
- Define authorization rules in-line (belongs to AUTHORIZATION.md)
- Expose an internal domain field with no PRD justification

Traceability requirements:
- Every operation traces to a Domain Model entity/aggregate and a PRD FR-NNN
- Every error code traces to a documented domain failure condition

Format: markdown, dense enterprise English, every element carries an
identifier of form {{ID_PREFIX}}-NNN. Close with an explicit statement of
what was decided, why, and what was rejected (Article 6).
```

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `templates/domain/DOMAIN-MODEL.md`
- `templates/api/OPENAPI.md` (formalises this)
- `templates/api/AUTHORIZATION.md` (sibling)

## Rules

This template applies Constitution rules; it invents none.

### Applied Article 3
The contract exists and is accepted before any handler code is written; generated code must match it, never the reverse.

### Applied Article 9
No operation returns a field not required by an approved consumer.

## Constraints

- Every operation has a defined success and failure response shape.
- Breaking changes require a new major version per Article 12.

## Success Criteria

- G4 exit requires every PRD requirement with an API surface to have a corresponding operation with full error taxonomy.

## Failure Conditions

- Contract describing `app.post('/orders', ...)` handler code.
- Response shape 'whatever the ORM returns'.

## Examples

**Conformant**: OP-014 `RequestRefund` accepts `orderId`, `reason`, returns `RefundRequestAccepted` or error `REFUND_WINDOW_EXPIRED`, traced to FR-014 and the Order aggregate.

## Anti-patterns

- Writing the Express route first and reverse-documenting it as the contract.
- Returning full database rows instead of the approved response shape.

## References

- `core/constitution/CONSTITUTION.md` Articles 3, 9
- `templates/domain/DOMAIN-MODEL.md`
- `templates/api/OPENAPI.md`
