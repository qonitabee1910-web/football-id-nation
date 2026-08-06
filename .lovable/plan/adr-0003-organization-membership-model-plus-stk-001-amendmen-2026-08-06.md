# ADR-0003 — Organization Membership Model (plus STK-001 amendments)

Council resolution recorded: PRG-STK-001 rev.1 APPROVED, G1 PASSED. Next mandatory artefact is ADR-0003, which locks the Player↔Organization relationship before IDN-PRD-001 is written. Documentation only — no code, no schema, no UI.

## 1. New artefact: `docs/adr/ADR-0003-organization-membership-model.md`

Status ACCEPTED, dated 6 Aug 2026, scope: identity + competition + transfer + analytics + scouting, stage 2 pre-binding.

Decision content:

- **Primary Membership** — exactly one `ACTIVE` per Player at any time. Mandatory. Basis of official roster, competition eligibility, and transfer.
- **Secondary Membership** — `0..N` concurrent. Covers football school, holiday camp, regional training centre, talent program, national camp, academy trial. Non-exclusive, non-eligibility-bearing.
- **Competition eligibility** — derived from Primary Membership only. A Secondary Membership never confers the right to play.
- **Transfer** — operates on Primary Membership only. Secondary memberships start and end independently and are not transfers.
- **Journey** — every membership of both types is recorded permanently. The Journey is complete regardless of type; Membership type is an attribute of the record, never a filter on history.
- **Invariants** to state explicitly: at most one ACTIVE Primary; a Player with zero ACTIVE Primary is `TEMPORARILY_INACTIVE`-eligible, not deleted; promoting a Secondary to Primary is a transfer event, not an edit; an Organization may hold only one active Membership of any type per Player.
- **NDI consequence** — multi-organization portability now counts distinct Organizations across both types, while the anti-gaming rule (independently administered organizations, distinct accountable adult) still applies.
- Options considered: single exclusive membership / unlimited flat membership / primary+secondary (chosen), each scored against the five decision rules plus Rule 0 (Child's Interest Prevails).

## 2. Amendments to `docs/stakeholders/PRG-STK-001-stakeholder-map.md`

Promote the three approved review outcomes into named, citable rules and mark the artefact APPROVED / G1 PASSED:

- **STK-INV-001 — Data Minimisation by Capability** (constitutional invariant): no stakeholder may consume player-level data unless player data is essential to its primary business capability. Venue sees booking/field/schedule/capacity only; Commercial Partner sees aggregate and anonymized metrics only.
- **Record Authority Principle**: Consent Authority ≠ Evidence Authority. Guardian may grant, revoke, and object; may never alter assessments, match history, referee reports, or statistics.
- **Guardian Annotation**: introduce as a first-class object with its own lifecycle — `Assessment → Guardian Comment → Coach Response → Resolved | Open`. Underlying record stays immutable.
- **Structural Prohibition**: under-13 scouting capability is *not implemented*, never `permission = false`. Restate as the official term and apply it wherever the map currently says "denied".
- Membership section updated from "concurrent memberships disallowed (assumed)" to the Primary/Secondary model, citing ADR-0003.

## 3. Supporting registry and glossary updates

- `docs/adr/README.md` — add the ADR-0003 row.
- `docs/artefact-registry.md` — PRG-STK-001 → APPROVED / G1 PASSED; add ADR-0003 as ACCEPTED; mark IDN-PRD-001 unblocked and next.
- `docs/glossary.md` — add Primary Membership, Secondary Membership, STK-INV-001, Record Authority Principle, Guardian Annotation, Structural Prohibition.
- `docs/governance/decision-rules.md` — reference STK-INV-001 alongside Rule 0 as a standing invariant.

## 4. Not in this step

IDN-PRD-001 is the next artefact after ADR-0003 is on file; it is not written here. No database, API, RLS, or UI work — Stage 6 remains blocked.
