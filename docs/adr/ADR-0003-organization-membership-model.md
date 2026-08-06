---
id: ADR-0003
title: Organization Membership Model — Primary and Secondary Membership
status: ACCEPTED
date: 2026-08-06
deciders: [Chief Enterprise Architect, Chief Product Officer, Principal Domain Architect, Principal Data Architect, Principal Security Architect, Principal Competition Systems Expert, Principal Grassroots Development Expert]
context_scope: [identity, competition, transfer, development, analytics, scouting]
stage: 2
supersedes: []
---

# ADR-0003 — Organization Membership Model

## Context

`PRG-STK-001` rev. 1 left exactly one question open that architecture may not
answer alone: may a Player hold concurrent active Memberships at more than one
Organization? PART 5 of the stakeholder map assumed *no* as a placeholder, and
flagged that the answer changes NDI portability measurement, competition
eligibility, and the transfer flow.

Forces in play:

- **Grassroots reality.** An Indonesian youth player commonly trains at an SSB
  while also attending a holiday camp, a regional training centre, an academy
  trial, or a national camp. A single-membership model would make the platform
  record a fiction.
- **Competition integrity.** Unbounded membership destroys roster
  authority, eligibility checking, double-registration control, and transfer
  semantics.
- **Principle 1 — Player Owns The Journey.** Every real affiliation belongs in
  the Journey regardless of which organization is "primary".
- **Rule 0 — The Child's Interest Prevails.** A child must never be forced to
  hide a genuine development opportunity in order to stay eligible, and must
  never be locked to one Organization to preserve their record.
- **NDI (PRG-VIS-001 §9.1).** Portability is measured across distinct
  Organizations; the membership model determines whether that measure reflects
  reality or an artefact of the schema.

Council resolution of 6 August 2026 directs a Primary/Secondary model and
requires this ADR before `IDN-PRD-001` is finalised.

## Decision

A Player's affiliation to an Organization is a **Membership** with a
**MembershipType** of `PRIMARY` or `SECONDARY`.

**Primary Membership**

- Exactly **one** `ACTIVE` Primary Membership per Player at any point in time.
- Mandatory for competition participation; it is the official roster basis.
- The only Membership affected by a Transfer.

**Secondary Membership**

- **0..N** concurrent per Player.
- Covers football school, holiday camp, regional training centre, talent
  program, national camp, academy trial, and equivalent non-exclusive programmes.
- Confers **no** competition eligibility and **no** roster claim.

**Derived rules**

| Concern | Rule |
| --- | --- |
| Competition eligibility | Derived from the `ACTIVE` Primary Membership only. A Secondary Membership never grants the right to play. |
| Transfer | Operates on Primary Membership only. Starting or ending a Secondary Membership is not a Transfer and produces no Transfer event. |
| Journey | **All** Memberships of both types are recorded permanently. Type is an attribute of the record, never a filter on history. |
| Consent & access | Unchanged. Both types are `Membership` for authorization purposes: role + active relationship + valid consent purpose. A Secondary Membership grants a Coach exactly the same bounded, revocable access, scoped to that programme. |
| Analytics | Both types count toward NDI; only Primary counts toward roster, eligibility, and transfer analytics. |
| Scouting | Unchanged and unaffected. Under-13 scouting capability remains structurally absent (Structural Prohibition). |

**Invariants**

1. `INV-MEM-01` — At most one `ACTIVE` Primary Membership per Player. Enforced
   as a domain invariant and, at Stage 3, as a database constraint.
2. `INV-MEM-02` — A Player with zero `ACTIVE` Primary Membership is a valid
   state (between clubs). They become eligible for `TEMPORARILY_INACTIVE` under
   PRG-MET-001; they are never deleted and their Journey is untouched.
3. `INV-MEM-03` — Promoting a Secondary Membership to Primary is a **Transfer
   event**, not an edit. It closes the outgoing Primary and opens a new one,
   with the full transfer audit trail.
4. `INV-MEM-04` — An Organization may hold at most one `ACTIVE` Membership of
   any type per Player.
5. `INV-MEM-05` — Guardian approval is required for both types (CONSENT-001);
   Secondary Membership is not a consent shortcut.
6. `INV-MEM-06` — Historical Memberships of both types are immutable. Ending a
   Membership closes it; it is never removed.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| A. Single exclusive Membership (1 Player → 1 Organization) | Trivial eligibility; unambiguous roster; simplest transfer | Contradicts grassroots reality; forces under-recording; understates NDI; pressures families to conceal genuine development activity |
| B. Unlimited flat Membership (N concurrent, no type) | Maximum fidelity to reality; highest raw NDI | No roster authority; double-registration and eligibility break; transfer becomes meaningless; invites NDI gaming |
| C. **Primary (1) + Secondary (0..N)** — chosen | Records reality without losing roster authority; eligibility and transfer stay crisp; Journey complete; NDI accurate and still anti-gameable | One extra concept; requires an invariant and a promotion (transfer) flow |

## Decision-rule evaluation

| Rule | A | B | C | Winner |
| --- | --- | --- | --- | --- |
| 0. The Child's Interest Prevails | Forces concealment or lock-in | Neutral | Child may pursue any programme without losing eligibility or record | **C** |
| 1. Nationally scalable | Yes | Yes | Yes — type is an attribute, no central coordination | Tie → C |
| 2. Federation-integrable | Roster clear but data false | Roster undefined; unusable for eligibility | Exactly one authoritative roster per Player, plus full context | **C** |
| 3. Safe for child data | Neutral | More organizations with access, unbounded | Same access rules per Membership; bounded, revocable, logged | **C** |
| 4. Auditable | Yes | Weak — no authoritative relationship | Primary changes emit Transfer events; all memberships immutable | **C** |
| 5. Football ID as single source of truth | Yes | Yes | Yes — Membership hangs off the Football ID, never replaces it | Tie → C |

## Consequences

**Positive**

- The Journey finally matches lived reality: SSB + academy + regional programme
  all recorded, none of them owning the Player.
- Competition eligibility remains a single, checkable predicate.
- NDI becomes a more honest portability measure: distinct Organizations across
  both types count, so genuine multi-organization participation is visible
  without inflating rosters.
- Transfer keeps a narrow, auditable definition.

**Negative / accepted cost**

- One additional concept in every downstream artefact.
- Promotion of a Secondary to Primary needs an explicit flow rather than a field
  update.
- NDI anti-gaming must be restated: the Organizations counted must be
  independently administered, and activity attested by the same accountable
  adult still counts once (PRG-VIS-001 §9.1). Secondary Memberships must not
  become a cheap way to manufacture network density.

**Follow-up work created**

- `PRG-STK-001` PART 5 cardinality updated to cite this ADR (done in this
  change).
- `IDN-PRD-001` must specify the Primary/Secondary lifecycle, the promotion
  flow, and guardian approval for both.
- `IDN-DOM-001` must model `MembershipType`, `INV-MEM-01`–`06`, and the events
  `MembershipStarted`, `MembershipEnded`, `MembershipPromotedToPrimary`,
  `PlayerTransferred`.
- `IDN-ERD-001` must express `INV-MEM-01` as a partial unique constraint.
- Competition context inherits eligibility = Primary only; this is binding
  before Competition work begins.

## Compliance impact

- **DDD** — Membership is an entity within the Player/Identity aggregate
  boundary; `MembershipType` is a value object; `INV-MEM-01` is an aggregate
  invariant, which is what keeps single-writer consistency achievable.
- **TOGAF / ArchiMate** — the Player↔Organization relationship is now a single
  typed relationship rather than two competing ones, so the business layer maps
  cleanly to one application-layer concept.
- **ISO 42010** — a stakeholder concern raised in PRG-STK-001 PART 18 is
  resolved by a recorded decision, not an assumption.
- **Event-driven readiness** — promotion emits a Transfer event, keeping the
  event stream sufficient to reconstruct roster state at any past date.
- **Privacy** — no new data class, no new consumer, no widening of scope. Access
  granted by a Secondary Membership is bounded and revocable exactly as Primary.

## North Star impact

Neutral-positive on VAP counting: qualifying activity counts regardless of
Membership type, so a child active only at a regional programme is correctly
counted as a Verified Active Player instead of falling out of the population.
Positive on NDI accuracy and JCS completeness (the organization dimension is
satisfiable by real affiliations). No effect on CTI.
