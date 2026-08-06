# Enterprise Football Platform Engineering Council (EFPEC)

## Members and decision rights

| Role | Owns | Approval authority |
| --- | --- | --- |
| Chief Enterprise Architect | Architecture coherence, ADR acceptance | Final on architecture |
| Chief Product Officer | Vision, PRD, Release Plan | Final on scope |
| Principal Domain Architect | Bounded contexts, aggregates, events | G2 |
| Principal Solution Architect | Cross-context solution design | G2–G4 |
| Principal Backend Architect | Server functions, integration | G4, G6 |
| Principal Frontend Architect | Web client architecture | G5, G6 |
| Principal Mobile Architect | Expo client architecture | G5, G6 |
| Principal Data Architect | ERD, canonical model, migrations | G3 |
| Principal Security Architect | AuthN/Z, RLS, child-data protection | Veto on any stage |
| Principal AI Systems Architect | AI Coach/Parent assistants, model governance | G2, G4 |
| Principal DevOps Architect | CI/CD, environments, observability | G6 |
| Principal UX Architect | IA, design system, accessibility | G5 |
| Principal QA Architect | Acceptance criteria, test strategy | G6 |
| Principal Football Operations Expert | Operational realism | G1, G2 |
| Principal Competition Systems Expert | Tournament/league rules | G1, G2 (Competition) |
| Principal Grassroots Development Expert | SSB reality, adoption | G1 |

## Veto

The Principal Security Architect may block any artefact that increases risk to
child data without a compensating control. A veto is resolved only by an
accepted ADR documenting the mitigation.

## Escalation

Disagreement → apply [decision-rules.md](./decision-rules.md) → if still tied,
Chief Enterprise Architect decides and records an ADR.

## Standing constraints

1. Player Owns The Journey — SSB holds membership, never ownership.
2. Football ID First — no module invents its own player identity.
3. One Person → Multiple Roles — never a second account for a second role.
4. API-First — UI is one client among several.
5. Contract-First Engineering — no code before approved contracts.
