---
id: EPOS-CORE-ARC-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001, EPOS-CORE-WFL-001]
---

# Architecture Rules

## Purpose

State the binding structural rules for every system built under EPOS:
layering, bounded contexts, dependency direction, integration styles,
event-readiness, idempotency, API-first design, logic placement, framework
independence, and the ADR requirement, implementing Article 2 and Article 3.

## Scope

All services, applications, and integrations across all bounded contexts.

## Inputs

- The domain model and PRD for the capability under design

## Outputs

- An ADR-backed architecture conforming to these rules, or a refusal

## Dependencies

- `core/constitution/CONSTITUTION.md` (Articles 2, 3, 4, 8, 10)
- `core/decision-rules/DECISION-RULES.md`

## Rules

### Layering

Systems are structured in strict layers: presentation → application →
domain → infrastructure. Each layer depends only on layers beneath it in the
domain direction; infrastructure never dictates domain shape.

### Bounded contexts

Each bounded context owns its own model, its own data, and exposes access
only through published contracts. No bounded context reaches into another's
database or internal types directly.

### Dependency direction

Dependencies point inward: infrastructure depends on domain abstractions,
never the reverse. Domain code has no import of framework, ORM, or transport
libraries.

### Integration styles

- Synchronous request/response for user-facing, latency-sensitive reads.
- Asynchronous events for cross-context state propagation and side effects.
- The choice is justified in an ADR referencing latency, consistency, and
  failure-isolation requirements — never chosen by developer preference
  alone.

### Event-driven readiness

Every domain event (EVT-*) is designed to be publishable even if currently
consumed synchronously, so a context can move to async integration without
a domain model change. Event payloads carry enough context to be processed
without a callback to the publisher.

### Idempotency

Every command that causes a state change external effects (payment,
notification, provisioning) is idempotent via a client-supplied or
deterministic idempotency key. Retried commands never duplicate effects.

### API-first

Contracts are authored before implementation (Article 3). Generated clients
and server stubs derive from the contract; the contract is never reverse
engineered from a running implementation.

### No business logic in UI or controllers

Presentation components and HTTP controllers perform only: input shaping,
delegation to domain/application services, and output formatting. Business
rules, invariants, and authorization decisions live in domain/application
layers and are enforced server-side (Article 8).

### Framework independence

Domain and application logic is expressible and testable without a running
web framework, database, or UI framework. Framework code is a replaceable
adapter around the domain core.

### ADR requirement

Any decision that changes bounded context boundaries, introduces a new
integration style, a new storage technology, a new external dependency, or
alters a security/privacy control requires an ADR before implementation.

## Constraints

- No ADR may be superseded silently; supersession is recorded with a link
  to the successor.
- Architecture rules override tool defaults and scaffolding conventions.

## Success Criteria

- A dependency graph analysis shows no inward-layer or cross-context
  violations.
- Every unsafe command has a documented idempotency mechanism.

## Failure Conditions

- Domain code importing an ORM or HTTP client type directly.
- A controller containing a discount-calculation rule.
- A new message queue introduced without an ADR.
- A payment endpoint without an idempotency key.

## Examples

**Conformant:** "The `ApplyDiscount` rule lives in `domain/pricing`; the
controller only maps the HTTP request to the `ApplyDiscountCommand`."

**Conformant:** "Cross-context order-to-billing sync uses the
`OrderPlaced` event, per ADR-011, rather than a direct database read."

## Anti-patterns

- "It's faster to just query the other service's table directly."
- Putting a tax calculation in a React component for "instant" UI feedback
  with no server-side re-check.
- Choosing a message broker because a tutorial used it, with no ADR.

## References

- `core/constitution/CONSTITUTION.md`
- `core/decision-rules/DECISION-RULES.md`
- `core/quality-gates/QUALITY-GATES.md`
