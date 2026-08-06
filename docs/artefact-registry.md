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
| PRG-STK-001 | Enterprise Stakeholder Map (41 stakeholders, 9 groups, 19 parts) | 1 | IN_REVIEW | G1 pending |
| PRG-CTX-001 | Bounded Contexts + Context Map | 2 | NOT_STARTED | G2 |
| PRG-CDM-001 | Canonical Data Model | 3 | NOT_STARTED | G3 |
| PRG-API-001 | API Standards (errors, pagination, versioning) | 4 | NOT_STARTED | G4 |
| PRG-UXS-001 | Design System + Component Catalog | 5 | NOT_STARTED | G5 |

## Identity (Sprint 1 — active)

| ID | Artefact | Stage | Status | Gate |
| --- | --- | --- | --- | --- |
| CONSENT-001 | Consent, Access Rights & Privacy for Minors | 0 | APPROVED | G0 PASSED |
| IDN-PRD-001 | Identity PRD | 1 | NOT_STARTED | G1 |
| IDN-JRN-001 | User Journeys (register, guardian consent, multi-role) | 1 | NOT_STARTED | G1 |
| IDN-DOM-001 | Domain Model (Person, FootballID, Role, Membership) | 2 | NOT_STARTED | G2 |
| IDN-EVT-001 | Domain Events | 2 | NOT_STARTED | G2 |
| IDN-ERD-001 | ERD subset + RLS design | 3 | NOT_STARTED | G3 |
| IDN-API-001 | OpenAPI contract | 4 | NOT_STARTED | G4 |
| IDN-UIC-001 | UI Contract + Dashboard Shell IA | 5 | NOT_STARTED | G5 |
| IDN-IMP-001 | Implementation | 6 | BLOCKED | G6 |

## Other contexts

All `NOT_STARTED` and out of scope until Identity reaches G6.

Organization · Team · Player · Parent · Coach · Referee · Competition · Match ·
Training · Development · Finance · Notification · Scouting · Federation

> Competition-context work is explicitly blocked: "Tidak ada fitur pertandingan
> sebelum Identity selesai."

## ADRs

See [adr/README.md](./adr/README.md).
