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

Next artefacts after approval: `02-journeys.md` (IDN-JRN-001), `IDN-EVT-001`
(Domain Event Catalogue) and `IDN-CDM-001` (Canonical Data Model).


Governing decisions:
[ADR-0002 rev. 2 — Football ID fully opaque](../../adr/ADR-0002-football-id-format.md) ·
[ADR-0003 — Primary/Secondary Membership](../../adr/ADR-0003-organization-membership-model.md).

Blocking rule: no Competition, Match, or Training artefacts may begin until this
context reaches G6.

