# Identity Context
# Identity Context

**Status:** active (Sprint 1) · **Stage:** 2 · **Gate:** G2 in review

Sprint 1 deliverables: Authentication · Person · Football ID · Role & Permission ·
Organization Membership · Dashboard Shell.

Artefacts follow [the context template](../_template/README.md).
Produced so far:
- [`00-consent-model.md` (CONSENT-001)](./00-consent-model.md) — APPROVED, G0 PASSED.
- [`01-prd.md` (IDN-PRD-001 v1.0)](./01-prd.md) — IN_REVIEW at G2. Two blocking
  business decisions remain: OQ-02 (minimum L1 verification evidence) and
  OQ-05 (CTI Phase 0 floor).
- [`03-domain-model.md` (IDN-DMN-001 v1.0)](./03-domain-model.md) — IN_REVIEW at
  G3. 7 aggregates, 25 value objects, 33 domain events, 38 invariants, 10
  versioned policies. Carries OQ-02 and OQ-05 forward as policy values.
- [`04-canonical-data-model.md` (IDN-CDM-001 v1.0)](./04-canonical-data-model.md)
  — IN_REVIEW at G4. 13 canonical business objects, canonical vocabulary,
  semantic relationships, attribute semantics, reference data, ownership,
  privacy classification, cross-context information contracts, governance.
- [`05-domain-event-catalogue.md` (IDN-EVT-001 v1.0)](./05-domain-event-catalogue.md)
  — IN_REVIEW at G4. 49 business events across 9 families, event principles and
  invariants, aggregate and cross-context matrices, policy triggers, journey and
  analytics projection mapping, privacy and information governance. One
  structural decision open: EDEC-01 (`JourneyUpdated` excluded — Journey is a
  derived read model and never a producer).
- [`02-journeys.md` (IDN-JRN-001 v1.0)](./02-journeys.md) — IN_REVIEW at G5.
  21 business journeys, 11 actors, 12 business decisions, 9 exceptions, policy
  application matrix over all 10 policies, domain event mapping, projection,
  privacy/child-protection, audit, analytics, and traceability. Carries OQ-02 and
  OQ-05 forward as policy values only.

- [`06-logical-data-model.md` (IDN-ERD-001 v1.0)](./06-logical-data-model.md) —
  IN_REVIEW at G3. Stage 3 Logical Data Design: 15 logical entities, 6 supporting
  structures, 9 reference domains, relationship model, invariant and policy
  mapping, event persistence, journey projection, audit model, security
  classification, logical RLS boundaries, index/partition/retention/quality
  strategy, and full traceability. No SQL, DDL, migration, ORM, API, or code.

- [`07-api-contract.md` (IDN-API-001 v1.0)](./07-api-contract.md) — IN_REVIEW at
  G4. Stage 4 Application Contract: 13 API principles, 15 resources, 22 commands,
  12 queries, conceptual endpoint catalogue, request/response contracts, uniform
  error catalogue, idempotency strategy, authentication and authorization
  mapping, business-rule and event-publication mapping, audit mapping,
  versioning, security/privacy, and traceability. No code, SQL, ORM, or UI.

- [`08-screen-catalogue.md` (IDN-SCR-001 v1.0)](./08-screen-catalogue.md) —
  IN_REVIEW at G7. Stage 5 UX Architecture: 50 screens across PUBLIC, PLAYER,
  GUARDIAN, ORGANIZATION, ASSOCIATION, FEDERATION and SYSTEM areas, navigation
  architecture, per-screen definition, layout structure, component composition,
  interaction, data dependency, authorization matrix, privacy and child
  protection, WCAG 2.2 AA requirements, responsive behaviour, navigation flow,
  screen states, error and recovery, analytics mapping, and full traceability.
  Coverage verified: 21/21 journeys, 22/22 commands, 12/12 queries. Prohibited
  capabilities have no screen at all (STK-INV-004). No React, CSS, HTML,
  wireframe, mockup, database, or new API.

Next artefact after approval: `IDN-UIC-001` (UI Component Catalogue), then
`IDN-DS-001` (Enterprise Design System). Implementation (Stage 6) remains
blocked.



Governing decisions:
[ADR-0002 rev. 2 — Football ID fully opaque](../../adr/ADR-0002-football-id-format.md) ·
[ADR-0003 — Primary/Secondary Membership](../../adr/ADR-0003-organization-membership-model.md).

Blocking rule: no Competition, Match, or Training artefacts may begin until this
context reaches G6.

