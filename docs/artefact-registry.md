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
| IDN-SCR-001 | Enterprise Screen Catalogue v1.0 (50 screens, 7 areas, 18 parts, full journey/command/query coverage) | 5 | IN_REVIEW | G5 |
| IDN-SCR-DETAILS-001 | Per-screen specifications (states, data dependencies, authorization, a11y) | 5 | IN_REVIEW | G5 |
| IDN-UIC-001 | UI Component Catalogue + Dashboard Shell IA | 5 | IN_REVIEW — structural shell + 47 shadcn/ui primitives + 9 layouts implemented; component-to-screen mapping (IDN-SCR-001 → UIC-001) pending G5 audit | G5 |
| IDN-DS-001 | Enterprise Design System | 5 | IN_REVIEW — theme provider, tokens, 4 semantic color groups (Navy/Football-Green/Red-Accent/Neutral), typography scale, 44px touch baseline implemented; final sign-off of token values vs spec pending G5 | G5 |
| IDN-UI-GEN-002 | Sprint 2 Public Experience (SCR-PUB-01..04 + /legal placeholder) | 5 | PROVISIONAL — presentation-only prototype built under Council waiver ahead of G5 sign-off; no backend, no business logic, no persistence. Must be re-audited at G5 and re-baselined at G6. | G5 |
| IDN-IMP-001 | Implementation (production, backend-connected) | 6 | BLOCKED | G6 |
| IDN-INFRA-001 | Enterprise Infrastructure Baseline v1.0 (18+ files: bootstrap/providers, shared API client, query layer, validation registry, adapters/mappers/services, observability scaffolding) — self-declared STATUS=Complete/Ready for Integration in file header. Resolved naming conflict: both INFRA files originally self-claimed IDN-INFRA-001 in duplicate; registry now splits → Summary = IDN-INFRA-001, Folder Structure = IDN-FOLDER-001. Derives: ADR-0001 TanStack Start + Lovable Cloud, IDN-FE-001 Frontend Architecture PART 01-04 | 6 | IN_REVIEW — self-declared complete internally; NO EFPEC Council approval on record. Owner: Principal Frontend Architect. Status reflects evidence (self-declared complete only, no governance sign-off). NOT APPROVED pending review. | G6 |
| IDN-FOLDER-001 | Enterprise Folder Structure Standard v1.0 (src/ layout definitive, feature-module 8 internal folders structure, naming conventions PascalCase/camelCase/kebab-case, import aliases list, prohibited patterns explicitly forbidden, initialization order critical sequence) — derives: EPOS-CORE-DOC-001 reference, ADR-0001, IDN-PRD-001 product domain, IDN-FE-001 Frontend 5-layer L1–L5 architecture §PART 04. Original duplicate header self-identifier IDN-INFRA-001 corrected per this registry entry to IDN-FOLDER-001. | 6 | IN_REVIEW — self-declared Enterprise Mandatory Baseline internally; NO Council governance sign-off on record. Owner: Principal Frontend Architect. NOT APPROVED pending council review per registry evidence standard. | G6 |

> Reconciliation note (10 Aug 2026): there is no `G7` in
> [lifecycle.md](./lifecycle.md); the previous `G7` label on IDN-SCR-001 was a
> typo and is corrected to `G5`. Stage 5 prototype code that already exists in
> `src/` is registered above as `IDN-UI-GEN-002` (PROVISIONAL) so the registry
> reflects reality; it does not constitute Stage 6 entry and IDN-IMP-001 stays
> `BLOCKED`.


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
