# Artefact Registry

Single index of every artefact and its approval state. The Council updates this
file whenever an artefact changes status. Implementation is permitted only for
contexts whose G0–G5 rows are all `APPROVED`.

Status values: `NOT_STARTED` · `DRAFT` · `IN_REVIEW` · `APPROVED` · `SUPERSEDED`

## Programme-level

| ID | Artefact | Stage | Status | Gate |
| --- | --- | --- | --- | --- |
| PRG-GOV-001 | Governance scaffolding (this docs tree) | — | APPROVED | — |
| PRG-MET-001 | Active Football Activity counting spec | 0 | APPROVED | G0 PASSED |
| PRG-VIS-001 | Vision, Positioning, North Star (rev. 3 — Phase 0–4 targets + NDI/JCS/CTI) | 1 | APPROVED | G1 PASSED (6 Aug 2026) |
| PRG-STK-001 | Enterprise Stakeholder Map (41 stakeholders, 9 groups, 19 parts, STK-INV-001..004) | 1 | APPROVED | G1 PASSED (6 Aug 2026) |
| PRG-CTX-001 | Bounded Contexts + Context Map | 2 | NOT_STARTED | G2 |
| PRG-CDM-001 | Canonical Data Model | 3 | NOT_STARTED | G3 |
| PRG-API-001 | API Standards (errors, pagination, versioning) | 4 | NOT_STARTED | G4 |
| PRG-UXS-001 | Design System + Component Catalog | 5 | NOT_STARTED | G5 |

## Identity (Sprint 1 — active)

| ID | Artefact | Stage | Status | Gate |
| --- | --- | --- | --- | --- |
| CONSENT-001 | Consent, Access Rights & Privacy for Minors | 0 | APPROVED | G0 PASSED |
| IDN-PRD-001 | Identity PRD v1.0 (21 parts, FR/BR/NFR + Decision Log + traceability) | 2 | IN_REVIEW — 2 blocking business decisions (OQ-02, OQ-05) | G2 |
| IDN-JRN-001 | Enterprise Business Journey Catalogue v1.0 (21 journeys, 12 decisions, 9 exceptions, 19 parts) | 2 | IN_REVIEW | G5 |
| IDN-DMN-001 | Identity Domain Model v1.0 (7 aggregates, 25 VOs, 33 events, 38 invariants) | 2 | IN_REVIEW | G3 |
| IDN-DOM-001 | superseded by IDN-DMN-001 | 2 | SUPERSEDED | G3 |
| IDN-CDM-001 | Canonical Data Model v1.0 (13 canonical business objects, 19 parts) | 2 | IN_REVIEW | G4 |
| IDN-EVT-001 | Domain Event Catalogue v1.0 (49 events, 9 families, 20 parts) | 2 | IN_REVIEW — 1 structural decision (EDEC-01) | G4 |
| IDN-ERD-001 | Enterprise Logical Data Model v1.0 (15 entities, 9 reference domains, logical RLS, 21 parts) | 3 | IN_REVIEW | G3 |
| IDN-API-001 | Contract-First Application API Spec v1.0 (15 resources, 22 commands, 12 queries, 19 parts) | 4 | IN_REVIEW | G4 |
| IDN-UIC-001 | UI Contract + Dashboard Shell IA | 5 | NOT_STARTED | G5 |
| IDN-IMP-001 | Implementation | 6 | BLOCKED | G6 |

## Other contexts

All `NOT_STARTED` and out of scope until Identity reaches G6.

Organization · Team · Player · Parent · Coach · Referee · Competition · Match ·
Training · Development · Finance · Notification · Scouting · Federation

> Competition-context work is explicitly blocked: "Tidak ada fitur pertandingan
> sebelum Identity selesai."

## ADRs

| ID | Title | Status |
| --- | --- | --- |
| ADR-0001 | Runtime stack deviation: TanStack Start + Lovable Cloud | ACCEPTED |
| ADR-0002 | Football ID: fully opaque identifier (rev. 2) | ACCEPTED |
| ADR-0003 | Organization Membership Model: Primary (1) + Secondary (0..N) | ACCEPTED (6 Aug 2026) |

See [adr/README.md](./adr/README.md).
