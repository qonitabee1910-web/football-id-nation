# Quality Gates

A gate is PASSED only when every checklist item is satisfied **and** the
[universal gate](#universal-gate-applies-to-every-stage) passes. Record the
result in the [artefact registry](./artefact-registry.md).

## Universal gate (applies to every stage)

- [ ] Consistent with the five Non-Negotiable Principles
- [ ] Football ID remains the single source of truth for player identity
- [ ] No separate account is introduced for an additional role
- [ ] Traceability front-matter complete, no dangling links
- [ ] Ubiquitous language matches [glossary.md](./glossary.md)
- [ ] Child-data impact assessed; consent model referenced where applicable
- [ ] Any architectural deviation captured in an accepted ADR
- [ ] North Star impact stated (Verified Active Players)
- [ ] Nationally scalable (Sulsel → Indonesia Timur → Nasional)

## G0 — Vision
- [ ] North Star Metric defined with an unambiguous counting rule
- [ ] Success metrics are measurable and time-bound
- [ ] Positioning distinguishes the platform from SSB management tools

## G1 — Product
- [ ] Every persona appears in at least one journey
- [ ] Every feature traces to a journey step and a business problem
- [ ] Release plan sequenced so Identity precedes Competition
- [ ] Guardian/consent journey explicitly covered for minors

## G2 — Domain Engineering
- [ ] Bounded contexts have explicit boundaries and a context map
- [ ] Each aggregate has one root and a stated invariant set
- [ ] No aggregate reaches inside another aggregate's internals
- [ ] Domain events named in past tense, with payload and publisher
- [ ] Player history survives organization membership change (portability proven)
- [ ] No context defines its own player identity

## G3 — Data Engineering
- [ ] ERD derived from the approved domain model, one table per persisted entity
- [ ] Every public table has GRANTs, RLS enabled, and explicit policies
- [ ] Roles stored in a dedicated role table, never on profiles/users
- [ ] Minor data fields flagged and covered by consent + RLS design
- [ ] Migration plan is forward-only and reversible-by-compensation
- [ ] Audit columns and event-outbox readiness present

## G4 — API Engineering
- [ ] OpenAPI validates; every operation has an operationId
- [ ] Uniform error model and pagination contract
- [ ] Versioning strategy stated; no breaking change without a new version
- [ ] AuthZ documented per operation, matching RLS design
- [ ] API covers 100% of the capability — UI is only one client

## G5 — UX Engineering
- [ ] IA maps to journeys; no orphan screen
- [ ] Every screen binds to API contract operations only
- [ ] Design system tokens defined; no ad-hoc colors in components
- [ ] WCAG 2.2 AA; Bahasa Indonesia primary, low-bandwidth/mobile-first
- [ ] Child-safety UX: guardian consent surfaces, data minimisation

## G6 — Implementation
- [ ] Code traces to an approved contract; no undocumented endpoint or table
- [ ] Automated tests cover acceptance criteria
- [ ] Security scan clean; RLS verified with a signed-in and anon check
- [ ] CI/CD green; observability and rollback in place
