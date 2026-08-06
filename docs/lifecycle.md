# Enterprise Development Lifecycle (EDL)

Mandatory. Stages may not be skipped. Each stage ends in a **Quality Gate**
(see [quality-gates.md](./quality-gates.md)) that must be recorded as PASSED in
the [artefact registry](./artefact-registry.md) before the next stage begins.

Contract-first order: **PRD → Domain → ERD → API Contract → UI Contract → Implementation**

| Stage | Name | Artefacts | Gate |
| --- | --- | --- | --- |
| 0 | Vision | Vision, Mission, Positioning, North Star Metric, Success Metrics | G0 |
| 1 | Product | PRD, Stakeholder Map, Personas, User Journeys, Feature Map, Release Plan | G1 |
| 2 | Domain Engineering | Bounded Contexts, Context Map, Aggregates, Entities, Value Objects, Domain Events, Business Rules | G2 |
| 3 | Data Engineering | ERD, Canonical Data Model, DB Standards, Migration Plan, RLS Design | G3 |
| 4 | API Engineering | OpenAPI, Contracts, DTOs, Error Model, Pagination, Versioning | G4 |
| 5 | UX Engineering | Information Architecture, Wireframes, Design System, Component Catalog, Accessibility | G5 |
| 6 | Implementation | Backend, Frontend, Mobile, Testing, CI/CD, Deployment | G6 |

## Stage entry rule

A stage may start only when **all** artefacts of the previous stage for the
same bounded context are `APPROVED`.

## Refusal protocol

If implementation is requested before prerequisites are approved, the response is:

> "Implementasi ditunda sampai artefak prerequisite disetujui sesuai Enterprise
> Development Lifecycle."

followed by the list of missing artefacts and the fastest path to approval.

## Forbidden without prerequisite

| Action | Requires |
| --- | --- |
| Production code | Approved G0–G5 for that context |
| Database table | Approved Domain Model (G2) |
| Migration | Approved ERD (G3) |
| API endpoint | Approved API Contract (G4) |
| UI screen | Approved User Journey (G1) + UI Contract (G5) |
| Architecture change | Accepted ADR |
| Any feature | Presence in the approved Release Plan |
| Sensitive/child data field | Approved Consent Model + RLS Design |

## Standards alignment

TOGAF · ArchiMate · ISO/IEC/IEEE 42010 · Domain-Driven Design ·
Event-Driven Readiness · EEOS · EKS · EAR

## Traceability

Every artefact carries front-matter linking upward and downward:

```yaml
id: IDN-PRD-001
context: identity
stage: 1
status: DRAFT | IN_REVIEW | APPROVED | SUPERSEDED
owner: Chief Product Officer
derives_from: [IDN-VIS-001]
satisfied_by: [IDN-DOM-001]
adrs: [ADR-0002]
north_star_impact: "..."
```

No artefact may be `APPROVED` with a dangling `derives_from`.
