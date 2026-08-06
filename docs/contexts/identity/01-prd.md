---
id: IDN-PRD-001
title: Identity Domain — Enterprise Product Requirements Document
status: IN_REVIEW
version: 1.0
date: 2026-08-06
stage: 2
gate: G2
bounded_context: identity
classification: Enterprise Constitution Artefact
depends_on: [PRG-VIS-001, PRG-STK-001, PRG-MET-001, CONSENT-001, ADR-0001, ADR-0002, ADR-0003]
blocks: [IDN-JRN-001, IDN-DOM-001, IDN-EVT-001, IDN-ERD-001, IDN-API-001, IDN-UIC-001]
---

# IDN-PRD-001 — Identity Domain Product Requirements

> This document states **what the business requires** of the Identity Domain and
> **why**. It is not a domain model, not an ERD, not an API contract, not a UI
> specification. Every requirement carries a traceability tag; PART 21 closes the
> chain. No requirement exists here that is not derived from an approved artefact.

---

## PART 1 — Executive Summary

Indonesian youth football has no persistent record of the individual child. A
player's history lives in the WhatsApp group of the SSB that currently holds
them, in a coach's notebook, in a competition registration spreadsheet that is
discarded after the final. When the child moves — and children move constantly
between SSB, holiday camp, regional training centre and school team — the record
does not move with them. It is destroyed. The consequence is a national talent
pool that cannot be seen, cannot be developed longitudinally, and cannot be
protected.

The Identity Domain exists to end that. It issues each Person exactly one
permanent, opaque **Football ID**, attaches every organizational affiliation and
every qualifying activity to that ID rather than to the organization, and gates
all access to the resulting record behind explicit, purpose-scoped, revocable
Guardian **Consent**. The Journey belongs to the Player. Organizations hold
**Membership**, never ownership.

Identity is the first bounded context because every other context is meaningless
without it: a Match without identified players is folklore, an Assessment
without a persistent subject is a lost note, a Transfer without an authoritative
roster is a rumour. The North Star — **Verified Active Players** — is by
definition an Identity measurement: Football ID issued, Guardian Verified,
Active Football Activity recorded.

Scope of this document: Person, Football ID, User and authentication in business
terms, Guardian and Parent, Consent integration, Verification, Membership,
Roles, Identity Lifecycle, Decision Log, Privacy, Child Protection.

Exit condition: PART 20 Acceptance Criteria satisfied and Council approval, after
which `IDN-DOM-001` (Domain Model) may begin. Until then Stage 3+ work remains
blocked (Constitution #7).

---

## PART 2 — Vision Alignment

Traces to `PRG-VIS-001` rev. 3.

| PRG-VIS-001 element | Identity Domain contribution |
| --- | --- |
| Vision — a national football data infrastructure built on verified individual identity | Identity **is** the infrastructure primitive; nothing else in the platform can exist first |
| Mission — make every child's football journey visible, portable, and protected | Football ID (visible), Journey + Membership (portable), Consent + Child Protection (protected) |
| North Star — Verified Active Players | All three qualifying conditions (ID issued, Guardian Verified, Active Activity) are recorded and evaluated inside Identity |
| KPI — NDI | Portability across distinct Organizations is only measurable because Membership hangs off the Football ID (ADR-0003) |
| KPI — JCS | The identity and organization dimensions of Journey completeness are owned here |
| KPI — CTI | Consent state is an Identity-resident fact; CTI is unmeasurable outside this context |
| Non-goal — "not an SSB management tool" | Identity refuses any requirement that makes an Organization the owner of a Player record |
| Non-goal — "not a social network" | No public discovery, no follower graph, no open profile surface |
| Phase 0 — Founding Network (1,500 Verified Players, 1,200 Verified Guardians, 800 VAP) | Phase 0 volumes are the sizing basis for all NFRs in PART 9 |

**Alignment statement.** Every functional requirement in PART 8 either (a)
increases Verified Active Players, or (b) is required for compliance, child
safety, or enablement of (a). Requirements of type (b) are marked.

---

## PART 3 — Business Problems

| ID | Problem | Evidence / source | Who suffers | Cost of inaction |
| --- | --- | --- | --- | --- |
| BP-01 | **The record dies at the door.** A player's history is held by the organization, so leaving the organization erases the history. | PRG-STK-001 Player, Guardian, SSB Admin pain points | Player, Guardian | Journey Completeness structurally capped; no longitudinal development data ever accumulates |
| BP-02 | **The same child exists many times.** Re-registration at every SSB, camp and competition creates duplicate, conflicting identities. | PRG-STK-001 SSB Admin, Competition Organizer | Everyone | VAP is uncountable; NDI is noise; fraud is undetectable |
| BP-03 | **Age fraud is trivial and rampant.** Nothing binds a claimed birth date to a verified guardian or a durable identity. | PRG-STK-001 Competition Organizer, Referee, Association | Honest players, competition integrity | Competitions cannot be trusted; federation integration impossible |
| BP-04 | **Nobody asked the parents.** Children's data, photographs and assessments circulate with no recorded consent, no purpose limitation, no way to withdraw. | CONSENT-001, PRG-STK-001 Guardian | Child, Guardian | Legal and ethical exposure; CTI unmeasurable; platform indefensible |
| BP-05 | **Children are exposed to unmanaged scouting interest.** Under-13 exposure has no structural barrier. | PRG-STK-001 Scout, Child Protection concerns | Child | Safeguarding failure — unacceptable at any scale |
| BP-06 | **Multi-role humans are modelled as multiple accounts.** A coach who is also a parent and a referee has three disconnected logins and three partial truths. | Constitution #3, PRG-STK-001 Professional group | Coach, Referee, Guardian, Platform | Permission errors, duplicate persons, unauditable access |
| BP-07 | **Transfer is an untracked field edit.** Who moved, when, with whose approval — all unrecorded. | ADR-0003, PRG-STK-001 Association | Association, Organization, Player | Roster state at a past date is unreconstructable; disputes unresolvable |
| BP-08 | **Real multi-organization participation is unrecordable.** A child at an SSB plus a regional training centre must currently hide one of them. | ADR-0003 Context | Player, Guardian, Regional programme | Platform records a fiction; NDI understated |
| BP-09 | **Access is granted by trust, not by rule.** Coaches keep access after leaving; admins keep access after resignation. | PRG-STK-001 lifecycle triggers | Child | Standing privacy breach |
| BP-10 | **No one can prove anything.** No decision trail for merges, guardian changes, verification upgrades. | PRG-STK-001 Association, Federation | Association, Federation, Platform | Not federation-integrable (Decision Rule 2) |

---

## PART 4 — Product Goals

Business outcomes, not features. Each goal is measurable and phase-bound to
`PRG-VIS-001` §10.1 Phase 0.

| ID | Goal | Outcome statement | Phase 0 measure | Solves |
| --- | --- | --- | --- | --- |
| PG-01 | One human, one identity | Every Person in the ecosystem is represented exactly once and permanently | Duplicate rate below the tolerance set in PART 19; 1,500 Verified Players with no known unresolved duplicates | BP-02, BP-06 |
| PG-02 | The Journey survives the move | A Player who changes Organization loses nothing | 100% of Membership changes preserve prior Journey entries | BP-01, BP-07 |
| PG-03 | Consent is real, granular, and reversible | No player data is processed without an active, purpose-scoped consent | CTI at or above the Phase 0 floor | BP-04 |
| PG-04 | Guardians are verified, not assumed | The adult claiming responsibility for a child is checked | 1,200 Verified Guardians | BP-03, BP-04 |
| PG-05 | The child is structurally protected | Harmful capabilities do not exist, rather than being permission-denied | Zero under-13 scouting code paths (STK-INV-004) | BP-05 |
| PG-06 | Reality is recordable | Multi-organization participation is recorded truthfully without breaking eligibility | Secondary Memberships recorded; eligibility still single-valued | BP-08 |
| PG-07 | Every consequential decision is provable | Merge, guardian change, verification upgrade, transfer, promotion, recovery all leave evidence | 100% of Decision Log types in PART 17 produce an auditable record | BP-10 |
| PG-08 | Access ends when the relationship ends | Authorization is derived from live relationship + consent, never from history | Zero standing access after Membership or assignment ends | BP-09 |
| PG-09 | Identity is countable | VAP, NDI, JCS, CTI are computable from Identity-resident facts | All four metrics reportable with policy version | BP-02, and enables PRG-VIS-001 |

---

## PART 5 — Scope

### In scope

Person · Football ID · User (the authentication subject) · Authentication as a
**business capability** (who may sign in, with what assurance, and what happens
on recovery) · Guardian and Parent · Guardian–Child relationship · Consent
integration with CONSENT-001 · Verification and assurance levels · Membership
(Primary and Secondary) · Role assignment and multi-role Persons · Identity
Lifecycle (six states) · Identity Decision Log · Privacy model · Child
Protection · Identity-side inputs to VAP, NDI, JCS, CTI.

### Out of scope

Database, schema, tables, RLS policy text, ERD, migrations · API design,
endpoints, payloads, error catalogues · UI, wireframes, IA, copy, mobile
· Frontend and backend implementation, code of any kind · AI feature
implementation (AI **consent** is in scope; AI **capability** is not) ·
Competition, Match, Training, Assessment, Development, Finance, Notification,
Scouting features (Identity only defines the identity and access facts they
consume) · Identity-provider selection and cryptographic mechanism · Data
migration from legacy SSB spreadsheets (a Phase 1 concern).

### Deferred with a named owner

| Item | Deferred to | Reason |
| --- | --- | --- |
| Which authentication factors and providers | IDN-DOM-001 / stack decision | Business requirement is assurance level, not mechanism |
| Duplicate-detection algorithm | IDN-DOM-001 | PRD states the required decision and evidence, not the matching method |
| Federation identifier reconciliation (PSSI/Asprov/Askab) | Federation context, post-G6 | Requires an external counterparty decision |

---

## PART 6 — Stakeholder Mapping

Drawn from `PRG-STK-001` rev. 1. **No new stakeholders are created.** Only those
with an Identity-domain interaction are listed; the rest are unaffected by this
PRD.

| Stakeholder (PRG-STK-001 group) | Identity relationship | Identity needs | Identity constraints |
| --- | --- | --- | --- |
| **Player (child)** — Players | Subject of the Football ID; owner of the Journey | Permanent identity, portable record, visibility of own journey | Cannot self-consent while a minor; Rule 0 applies to every conflict |
| **Player (adult)** — Players | Subject and consent authority for self | Same, plus self-service consent | Guardian authority ends at majority |
| **Guardian / Parent** — Family | Consent authority; verified adult responsible for a minor | Verification, control of consent, visibility, annotation right | Consent Authority ≠ Evidence Authority (STK-INV-002) |
| **SSB Admin / Organization Admin** — Organizations | Holds Membership; initiates registration and transfer | Roster accuracy, member management | Never owns the Player; access ends with the admin's own Membership |
| **Coach** — Professionals | Assignment-scoped access to identified players | Know who is in the squad and eligible | Access requires role + active relationship + consent purpose |
| **Referee** — Professionals | Consumes identity for match participation checks | Verify eligibility of listed players | Consumes; never produces identity facts |
| **Scout** — Professionals | Restricted consumer | Discover eligible, consenting players | Under-13 capability structurally absent (STK-INV-004) |
| **Competition Organizer** — Competition | Consumes eligibility derived from Primary Membership | Trustworthy rosters and ages | Cannot alter identity records |
| **Association (Asprov / Askab)** — Association | Oversight and dispute resolution | Auditable transfer and verification trail | Read + adjudicate; cannot silently mutate |
| **Federation (PSSI)** — Federation | Future integration counterparty | Stable, opaque, mappable identifiers | Integration must not force meaning into the ID (ADR-0002) |
| **Venue Operator** — Commercial | None at player level | Booking, field, schedule, capacity only | STK-INV-001: player-level access not built |
| **Commercial Partner / Sponsor** — Commercial | Aggregate only | Anonymised, aggregate metrics | STK-INV-001: no player-level path exists |
| **Platform Operator / Support** — Platform | Custodian, not owner | Operate, recover, adjudicate merges | Every privileged action is a Decision Log entry |
| **Child Protection Officer** — Platform | Standing veto on child-affecting requirements | Visibility of exposure surfaces | Rule 0 authority |

---

## PART 7 — Domain Glossary (Identity subset)

Authoritative definitions live in `docs/glossary.md`; this is the Identity-scoped
working subset. Terms are used exactly as defined — divergence is a defect.

| Term | Meaning within Identity |
| --- | --- |
| **Person** | One human being. Exactly one Person record per human, whatever roles they hold. |
| **Football ID** | The permanent, fully opaque digital identity of a Person (ADR-0002 rev. 2). Never re-issued, never reassigned, never owned by an Organization. |
| **Display Code** | The human-communicable rendering of a Football ID. Random, meaning-free, checksum-bearing. Not a secret, not an authenticator. |
| **User** | The authentication subject bound to exactly one Person. A Person has at most one User. |
| **Role** | A capability held by a Person (Player, Guardian, Coach, Referee, Scout, Organization Admin, …). Many per Person, concurrently. Never a separate login. |
| **Guardian** | A Person legally responsible for a minor Player; the source of consent for that minor. |
| **Guardian Link** | The verified relationship between a Guardian Person and a minor Player Person. |
| **Consent** | An explicit, timestamped, purpose-scoped, revocable grant (CONSENT-001). Never generic. |
| **Consent Purpose** | One of the closed list `P1_IDENTITY` … `P8_AI_MODEL_IMPROVEMENT`. |
| **Verification** | The act of raising assurance about a claim (identity, guardianship, age). Produces an assurance level L0–L3. |
| **Membership** | A time-bounded, typed relationship between a Person and an Organization. Confers access, never ownership. |
| **Primary Membership** | The single `ACTIVE` Membership that constitutes official affiliation. Sole basis of roster, eligibility, and Transfer (ADR-0003). |
| **Secondary Membership** | A concurrent non-exclusive Membership (0..N). Recorded in the Journey; confers no eligibility; never a Transfer. |
| **Transfer** | The business event that closes one Primary Membership and opens another. Not a field update (Constitution #8). |
| **Journey** | The append-only chronological record of a Person's football activity across all Organizations. Survives every Transfer. |
| **Active Football Activity** | Qualifying, organization-recorded, adult-attested activity meeting the active `ActivityPolicy` thresholds (PRG-MET-001). |
| **ActivityPolicy** | The named, versioned configuration holding activity windows, thresholds and lifecycle timings. Never hard-coded. |
| **Verified Active Player (VAP)** | Football ID + Guardian Verified + Active Football Activity. The North Star unit. |
| **REGISTERED / VERIFIED / ACTIVE / TEMPORARILY_INACTIVE / INACTIVE / ARCHIVED** | The six Identity Lifecycle states (PART 11). |
| **NEVER_ACTIVE** | A derived flag, not a state: a Person who has never recorded qualifying activity. The registration-inflation guard. |
| **Guardian Annotation** | A first-class object attached to an immutable record: Guardian Comment → Coach Response → Resolved \| Open (STK-INV-003). |
| **Structural Prohibition** | A capability that is not implemented rather than permission-denied (STK-INV-004). |
| **Identity Decision Log** | The append-only record of consequential identity decisions (PART 17). |
| **Age Band** | The derived, coarse age classification exposed in place of a date of birth. |

Forbidden terms remain forbidden: "player account", "SSB's player", "coach login".

---

## PART 8 — Functional Requirements

Format: `FR-<area>-<n>` · **Priority**: MUST / SHOULD / MAY · **Type**: Growth
(increases VAP) or Enabling / Compliance. Every row carries a Trace.

### 8.1 Person

| ID | Requirement | Pri | Type | Trace |
| --- | --- | --- | --- | --- |
| FR-PER-01 | The platform MUST represent each human as exactly one Person, regardless of how many roles or organizations they touch. | MUST | Enabling | BP-02, BP-06, Constitution #3 |
| FR-PER-02 | A Person MUST be able to hold multiple Roles concurrently without a second identity or a second login. | MUST | Enabling | PG-01, PRG-STK-001 Professionals |
| FR-PER-03 | A Person record MUST persist beyond the end of every Membership, Role, and Organization relationship. | MUST | Compliance | BP-01, PG-02 |
| FR-PER-04 | The platform MUST detect probable duplicate Persons and route them to an explicit merge decision (PART 17, DL-01) — never an automatic silent merge. | MUST | Enabling | BP-02, PG-07 |
| FR-PER-05 | A Person MUST never be hard-deleted while any Journey entry, Consent record, or Decision Log entry references them; deletion is expressed as `ARCHIVED` plus purpose-scoped data removal (PART 16). | MUST | Compliance | CONSENT-001, PART 16 |
| FR-PER-06 | The platform MUST record the minimum personal attributes required by an active consent purpose, and no more (STK-INV-001). | MUST | Compliance | STK-INV-001 |

### 8.2 Football ID

| ID | Requirement | Pri | Type | Trace |
| --- | --- | --- | --- | --- |
| FR-FID-01 | Every Person MUST receive exactly one Football ID at creation. | MUST | Enabling | Constitution #2, ADR-0002 |
| FR-FID-02 | The Football ID MUST be fully opaque: it MUST NOT encode region, organization, birth year, sequence, or any other business fact. | MUST | Compliance | Constitution #3, ADR-0002 rev.2 |
| FR-FID-03 | A Football ID MUST be permanent: never re-issued, never transferred to another Person, never recycled after archival. | MUST | Compliance | ADR-0002 |
| FR-FID-04 | The platform MUST provide a human-communicable Display Code for offline use (registration desks, match day), which MUST also be meaning-free and MUST carry a checksum to catch transcription error. | MUST | Enabling | ADR-0002, PART 9 offline |
| FR-FID-05 | The Display Code MUST NOT function as an authenticator or as proof of authority; knowing an ID grants nothing. | MUST | Compliance | Zero Trust, RSK-04 |
| FR-FID-06 | Lookup by Football ID or Display Code MUST NOT be enumerable and MUST NOT confirm existence to an unauthorized requester. | MUST | Compliance | RSK-04 |
| FR-FID-07 | Where a merge occurs, the surviving Football ID MUST be recorded together with the retired one; the retired ID MUST remain resolvable to the survivor forever. | MUST | Enabling | FR-PER-04, DL-01 |
| FR-FID-08 | The Football ID MUST be the join key for every other context (Membership, Activity, Assessment, Competition). No context may invent its own person key. | MUST | Enabling | Constitution #1, Decision Rule 5 |

### 8.3 User & Authentication (business capability only)

| ID | Requirement | Pri | Type | Trace |
| --- | --- | --- | --- | --- |
| FR-AUT-01 | A User MUST bind to exactly one Person; one login per human (BP-06). | MUST | Enabling | Constitution #3 |
| FR-AUT-02 | Adults (Guardian, Coach, Referee, Admin, Scout, Organizer) MUST be able to authenticate directly. | MUST | Enabling | PRG-STK-001 |
| FR-AUT-03 | A minor Player MUST be registerable and fully recordable **without** the child holding credentials; a Guardian-mediated identity is the default. | MUST | Compliance | Rule 0, CONSENT-001 |
| FR-AUT-04 | Where a minor is given their own access, it MUST require Guardian authorization, MUST be revocable by the Guardian, and MUST be age-appropriate in what it exposes. | SHOULD | Compliance | Rule 0 |
| FR-AUT-05 | Account recovery MUST NOT be able to move a Football ID to a different human; every recovery is a Decision Log entry (DL-07). | MUST | Compliance | RSK-01, PG-07 |
| FR-AUT-06 | Assurance level required to authenticate MUST scale with the sensitivity of the capability exercised, not with the role name alone. | MUST | Compliance | Zero Trust |
| FR-AUT-07 | Sign-in and sign-out MUST terminate access derived from ended relationships immediately at the next authorization evaluation — no cached standing grants. | MUST | Compliance | BP-09, PG-08 |

### 8.4 Guardian

| ID | Requirement | Pri | Type | Trace |
| --- | --- | --- | --- | --- |
| FR-GRD-01 | Every minor Player MUST have at least one Guardian Link before reaching `VERIFIED`. | MUST | Growth | PG-04, VAP definition |
| FR-GRD-02 | A Guardian MAY be linked to 1..n minor Players; the Phase 0 ratio (1,200 Guardians : 1,500 Players) confirms this is the norm, not an edge case. | MUST | Enabling | PRG-VIS-001 §10.2 |
| FR-GRD-03 | A minor Player MAY have more than one Guardian; the platform MUST support multiple Guardians with equal consent authority unless a recorded decision restricts one. | SHOULD | Compliance | Family reality, DL-02 |
| FR-GRD-04 | A Guardian Link MUST be verified (PART 8.6) before it confers consent authority; a claimed but unverified link grants nothing. | MUST | Compliance | BP-03, CONSENT-001 |
| FR-GRD-05 | A Guardian MUST be able to view every category of data held about their linked minor and every party who has access to it. | MUST | Compliance | CONSENT-001, PG-03 |
| FR-GRD-06 | A Guardian MUST be able to object to any record via a Guardian Annotation; the annotated record MUST remain unmodified (STK-INV-002, STK-INV-003). | MUST | Compliance | STK-INV-002/003 |
| FR-GRD-07 | A Guardian MUST NOT be able to alter assessments, match records, referee reports, or statistics. | MUST | Compliance | STK-INV-002 |
| FR-GRD-08 | Guardian authority MUST terminate automatically when the Player reaches the age of majority, transferring consent authority to the Player; the transition MUST be a recorded event, not a silent expiry. | MUST | Compliance | CONSENT-001, DL-02 |
| FR-GRD-09 | A change of Guardian MUST be an explicit decision with evidence (DL-02), never a self-service edit. | MUST | Compliance | RSK-03 |
| FR-GRD-10 | Where two Guardians conflict, the platform MUST escalate to the recorded conflict procedure and apply Rule 0 as the deciding principle. | MUST | Compliance | Rule 0, DL-06 |

### 8.5 Consent

Integrates `CONSENT-001`; see PART 13 for the full integration surface.

| ID | Requirement | Pri | Type | Trace |
| --- | --- | --- | --- | --- |
| FR-CON-01 | All processing of a minor's personal data MUST be covered by an active Consent for a specific purpose from the closed list `P1`…`P8`. | MUST | Compliance | CONSENT-001 |
| FR-CON-02 | Consent MUST be recorded append-only: grants, refusals, and revocations are all facts, and no consent record is ever overwritten or deleted. | MUST | Compliance | CONSENT-001, PG-07 |
| FR-CON-03 | Revocation MUST take effect immediately for future processing and MUST NOT require justification. | MUST | Compliance | CONSENT-001 |
| FR-CON-04 | A **High-Risk Revocation** (affecting an active squad, scouting exposure, federation submission, or a training set) MUST take effect immediately, trigger notification and audit, and enter a review queue that can never reverse the revocation. | MUST | Compliance | CONSENT-001 |
| FR-CON-05 | `P8_AI_MODEL_IMPROVEMENT` MUST be opt-in, MUST require assurance L2, MUST be structurally unavailable under 13, and MUST honour the 90-day removal SLA on revocation. | MUST | Compliance | CONSENT-001, G0 amendment |
| FR-CON-06 | Absence of consent MUST result in the capability being unavailable, not in a partially populated record or a silent fallback. | MUST | Compliance | Privacy by Design |
| FR-CON-07 | The platform MUST be able to state, for any Person and any purpose, whether consent is currently active, when it was granted, by whom, and at what assurance level — this is the CTI input. | MUST | Enabling | PRG-VIS-001 §9, PART 19 |
| FR-CON-08 | Consent MUST be per purpose. Bundled, blanket, or "accept all" consent is prohibited. | MUST | Compliance | CONSENT-001 |

### 8.6 Verification

| ID | Requirement | Pri | Type | Trace |
| --- | --- | --- | --- | --- |
| FR-VER-01 | The platform MUST support graded assurance levels L0–L3 for Person identity and for Guardian Link. | MUST | Compliance | CONSENT-001 |
| FR-VER-02 | **Guardian Verified** MUST require Guardian Link assurance L1 or above with `P1` and `P2` consent active for the minor's Football ID. | MUST | Growth | Glossary, VAP definition |
| FR-VER-03 | Age MUST be verified before a Player can be declared eligible for any age-banded competition; unverified age MUST NOT silently pass. | MUST | Compliance | BP-03 |
| FR-VER-04 | Verification evidence MUST be retained with a purpose limitation and MUST NOT be exposed to Organizations, Coaches, Scouts, or Competition Organizers — only the resulting assurance level is shared. | MUST | Compliance | STK-INV-001, PART 16 |
| FR-VER-05 | A verification upgrade or downgrade MUST be a Decision Log entry (DL-03) with named decision owner and evidence reference. | MUST | Compliance | PG-07 |
| FR-VER-06 | Verification MUST be re-checkable and revocable; a verification proven fraudulent MUST be reversible with the full trail preserved. | MUST | Compliance | RSK-01 |
| FR-VER-07 | Verification MUST be achievable in low-connectivity, document-scarce settings; the model MUST NOT assume a national ID card is always available. | MUST | Growth | Grassroots reality, PART 9 offline |

### 8.7 Membership

Governed by `ADR-0003`; see PART 12.

| ID | Requirement | Pri | Type | Trace |
| --- | --- | --- | --- | --- |
| FR-MEM-01 | A Player MUST have at most one `ACTIVE` Primary Membership at any moment (INV-MEM-01). | MUST | Enabling | ADR-0003 |
| FR-MEM-02 | A Player MAY hold 0..N concurrent Secondary Memberships (INV-MEM-02 context). | MUST | Growth | ADR-0003, BP-08 |
| FR-MEM-03 | Competition eligibility MUST derive from the `ACTIVE` Primary Membership only. | MUST | Enabling | Constitution #9 |
| FR-MEM-04 | Starting or ending a Secondary Membership MUST NOT produce a Transfer event and MUST NOT alter eligibility. | MUST | Enabling | ADR-0003 |
| FR-MEM-05 | Zero `ACTIVE` Primary Membership MUST be a valid state; the Player becomes `TEMPORARILY_INACTIVE`-eligible and is never deleted (INV-MEM-02). | MUST | Compliance | ADR-0003, Rule 0 |
| FR-MEM-06 | Promoting a Secondary to Primary MUST be executed as a Transfer event with full audit trail, never as an edit (INV-MEM-03). | MUST | Compliance | Constitution #8, ADR-0003 |
| FR-MEM-07 | An Organization MUST hold at most one `ACTIVE` Membership of any type per Player (INV-MEM-04). | MUST | Enabling | ADR-0003 |
| FR-MEM-08 | Guardian approval MUST be required to start either Membership type (INV-MEM-05). | MUST | Compliance | ADR-0003, CONSENT-001 |
| FR-MEM-09 | Historical Memberships of both types MUST be immutable; ending a Membership closes it and never removes it (INV-MEM-06). | MUST | Compliance | ADR-0003, PG-02 |
| FR-MEM-10 | The platform MUST be able to reconstruct the exact roster of any Organization as at any past date. | MUST | Enabling | BP-07, Decision Rule 4 |
| FR-MEM-11 | Membership MUST confer bounded, revocable access to the Player's data scoped to the purpose of that Membership — never ownership, never permanence. | MUST | Compliance | Constitution #1, STK-INV-001 |

### 8.8 Roles & Authorization

Business perspective only; see PART 15.

| ID | Requirement | Pri | Type | Trace |
| --- | --- | --- | --- | --- |
| FR-ROL-01 | Roles MUST be assignable and revocable per Person per scope (Organization, Competition, Team) with a validity period. | MUST | Enabling | PRG-STK-001 |
| FR-ROL-02 | Authorization MUST be evaluated in the fixed order: Person → Role → Relationship → Consent → Age Gate → Policy. Failing any step denies. | MUST | Compliance | PRG-STK-001 PART 12, Zero Trust |
| FR-ROL-03 | A Role MUST NOT grant standing access absent an active relationship; revoking the relationship revokes the access without a separate action. | MUST | Compliance | BP-09, PG-08 |
| FR-ROL-04 | Roles MUST be stored independently of the Person profile record; role data MUST never be a self-assertable attribute of a user profile. | MUST | Compliance | Privilege-escalation prevention |
| FR-ROL-05 | Privileged Platform roles MUST be constrained, time-boxed where possible, and every privileged action MUST be logged as an identifiable decision. | MUST | Compliance | PG-07 |
| FR-ROL-06 | Under-13 scouting capability MUST NOT exist as a code path (Structural Prohibition, STK-INV-004) — it MUST NOT be expressed as a permission set to false. | MUST | Compliance | STK-INV-004, Rule 0 |

### 8.9 Identity Decision Log

| ID | Requirement | Pri | Type | Trace |
| --- | --- | --- | --- | --- |
| FR-DLG-01 | Every decision type in PART 17 MUST produce an append-only Decision Log entry. | MUST | Compliance | PG-07 |
| FR-DLG-02 | Each entry MUST record purpose, trigger, decision owner, evidence reference, outcome, and timestamp. | MUST | Compliance | Decision Rule 4 |
| FR-DLG-03 | Decision Log entries MUST be immutable; a mistaken decision is corrected by a new, linked entry. | MUST | Compliance | Auditability |
| FR-DLG-04 | An Association MUST be able to review the Decision Log for a dispute within its jurisdiction without gaining mutation rights. | MUST | Enabling | PRG-STK-001 Association |
| FR-DLG-05 | Decision Log access MUST itself be logged. | MUST | Compliance | Privacy |

### 8.10 Lifecycle

| ID | Requirement | Pri | Type | Trace |
| --- | --- | --- | --- | --- |
| FR-LFC-01 | Every Player Person MUST occupy exactly one of the six lifecycle states at all times (PART 11). | MUST | Enabling | PRG-MET-001 |
| FR-LFC-02 | Transitions MUST be driven by the versioned `ActivityPolicy` and MUST NOT be hard-coded. | MUST | Compliance | PRG-MET-001, G0 amendment |
| FR-LFC-03 | `TEMPORARILY_INACTIVE` MUST be recoverable without re-verification. | MUST | Growth | PRG-MET-001 |
| FR-LFC-04 | `ARCHIVED` MUST retain the Journey; archival is never erasure. | MUST | Compliance | PRG-MET-001, Constitution #1 |
| FR-LFC-05 | `NEVER_ACTIVE` MUST be derivable as a flag, not stored as a state, and MUST be excluded from VAP. | MUST | Enabling | PRG-MET-001 |
| FR-LFC-06 | Every state change MUST be an event carrying the `policy_id@version` under which it was evaluated. | MUST | Compliance | PRG-MET-001 |

---

## PART 9 — Non-Functional Requirements

Sized against Phase 0 (`PRG-VIS-001` §10.1: 10 SSB, 3 competitions, 80 coaches,
25 referees, 1,200 guardians, 1,500 players, 800 VAP) with a stated headroom to
Phase 1 (30 SSB, 5,000 players).

| ID | Category | Requirement | Rationale |
| --- | --- | --- | --- |
| NFR-01 | Availability | Identity resolution and authorization evaluation are the platform's hard dependency: they must remain available whenever any other capability is available. Match-day windows (weekend mornings) are the peak-criticality period. | Everything depends on Identity |
| NFR-02 | Performance | Authorization evaluation must be fast enough to be invisible in normal interaction; a registration-desk identity lookup must complete within the patience of a queue at a match venue. | Grassroots operating reality |
| NFR-03 | Scalability | The model must not require redesign between Phase 0 and Phase 4. No requirement may assume a central coordinating authority, a single region, or a sequential identifier space (ADR-0002). | Decision Rule 1 |
| NFR-04 | Privacy | Data minimisation by capability (STK-INV-001) is a build-time constraint, not a runtime filter: where player-level data is not essential to a stakeholder's primary capability, the access path is not built. | STK-INV-001 |
| NFR-05 | Auditability | Every consequential identity decision, every consent change, and every privileged access is reconstructable after the fact, with the policy version in force at that time. | Decision Rule 4 |
| NFR-06 | Security | Zero Trust: no implicit trust from network position, organization membership, prior access, or possession of a Football ID. Enumeration resistance is a first-class requirement (RSK-04). | Zero Trust |
| NFR-07 | Accessibility | Guardians include low-literacy and first-time smartphone users. Consent language must be comprehensible to a non-specialist parent in Bahasa Indonesia; consent must never be obtainable by confusion. | Rule 0, CONSENT-001 |
| NFR-08 | Offline consideration | Registration desks and match venues frequently have no reliable connectivity. Identity must be assertable offline via the Display Code and reconciled later; offline capture must never create a duplicate Person silently (it produces a merge decision, DL-01). | Grassroots reality, BP-02 |
| NFR-09 | Compliance | Indonesian personal-data protection obligations plus the platform's own stricter child-protection posture. Where they differ, the stricter applies (Rule 0). | Rule 0, CONSENT-001 |
| NFR-10 | Maintainability | Thresholds, windows, weights, and age bands are versioned policy objects (`ActivityPolicy`, `JourneyCompletenessPolicy`), never constants in logic. Changing a threshold must never require changing behaviour code. | G0 amendment 3 |
| NFR-11 | Data quality | Duplicate rate, unverified-guardian rate, and orphaned-membership rate are monitored quality signals with defined tolerances set at G3. | PG-01 |
| NFR-12 | Localisation | Bahasa Indonesia is the primary language of all consent and identity-facing content; naming conventions must accommodate mononyms and non-Latin-normalised spellings without forcing false structure. | Indonesian reality |

---

## PART 10 — Business Rules

Numbered, testable, and each traceable to an approved artefact. These are the
rules the Domain Model must express; they are stated here in business language.

### Ownership and journey

| ID | Rule | Source |
| --- | --- | --- |
| BR-01 | The Player owns the Journey. No Organization, Coach, Association, or Sponsor may claim ownership of, restrict export of, or delete a Player's Journey. | Constitution #1 |
| BR-02 | The Journey is append-only. Records are added and closed; they are never rewritten or removed. | Constitution #1, INV-MEM-06 |
| BR-03 | Ending a relationship with an Organization ends that Organization's access; it does not end, reduce, or transfer the Journey. | BR-01, PG-08 |

### Identity

| ID | Rule | Source |
| --- | --- | --- |
| BR-04 | One human → exactly one Person → exactly one Football ID. | Constitution #3 |
| BR-05 | The Football ID is fully opaque and encodes no business fact. | Constitution #3, ADR-0002 rev.2 |
| BR-06 | A Football ID is never re-issued, recycled, or reassigned. | ADR-0002 |
| BR-07 | Possession or knowledge of a Football ID confers no authority. | Zero Trust |
| BR-08 | Merging duplicates is a decision, not an automation; the retired ID stays permanently resolvable. | FR-PER-04, FR-FID-07 |

### Guardian

| ID | Rule | Source |
| --- | --- | --- |
| BR-09 | A minor's data is processed only under a verified Guardian's active consent. | CONSENT-001 |
| BR-10 | Consent Authority ≠ Evidence Authority: a Guardian governs consent, never truth. | STK-INV-002 |
| BR-11 | Guardian objection attaches to a record as an Annotation; the record is not mutated. | STK-INV-003 |
| BR-12 | Guardian authority ends at majority and transfers to the Player as a recorded event. | FR-GRD-08 |
| BR-13 | In any Guardian–Organization–Coach–Sponsor conflict, the outcome best protecting the child prevails. | Constitution #6, Rule 0 |

### Consent

| ID | Rule | Source |
| --- | --- | --- |
| BR-14 | Consent is per purpose, from the closed list P1–P8. Bundled consent is invalid. | CONSENT-001 |
| BR-15 | Consent is append-only and revocable at any time without justification. | CONSENT-001 |
| BR-16 | High-Risk Revocation is immediate and irreversible by review. | CONSENT-001 |
| BR-17 | P8 (AI training) is opt-in, L2, prohibited under 13, 90-day removal SLA. | CONSENT-001 |
| BR-18 | No consent → capability unavailable. Never a degraded silent fallback. | Privacy by Design |

### Membership and transfer

| ID | Rule | Source |
| --- | --- | --- |
| BR-19 | Exactly one `ACTIVE` Primary Membership per Player (INV-MEM-01). | ADR-0003 |
| BR-20 | Secondary Memberships are 0..N and confer no eligibility. | Constitution #9, ADR-0003 |
| BR-21 | Transfer is a business event affecting Primary Membership only; it is never a field update. | Constitution #8, ADR-0003 |
| BR-22 | Promotion of Secondary to Primary is a Transfer (INV-MEM-03). | ADR-0003 |
| BR-23 | An Organization holds at most one active Membership of any type per Player (INV-MEM-04). | ADR-0003 |
| BR-24 | Zero active Primary is valid, not an error (INV-MEM-02). | ADR-0003 |

### Activity and lifecycle

| ID | Rule | Source |
| --- | --- | --- |
| BR-25 | Activity qualifies only if organization-recorded and adult-attested, and only if it meets the active ActivityPolicy thresholds. | PRG-MET-001 |
| BR-26 | Activity thresholds, windows, and lifecycle timings are configuration, never code constants. | PRG-MET-001, G0 amendment 3 |
| BR-27 | Only `ACTIVE` counts toward VAP. `NEVER_ACTIVE` never counts. | PRG-MET-001 |
| BR-28 | Archival retains the Journey. Archival is not erasure. | PRG-MET-001 |
| BR-29 | Activity attested by the same accountable adult counts once for NDI purposes; Secondary Memberships must not manufacture network density. | PRG-VIS-001 §9.1, ADR-0003 |

### Access

| ID | Rule | Source |
| --- | --- | --- |
| BR-30 | Access = Person + Role + active Relationship + valid Consent + Age Gate + Policy. All six, evaluated in order. | PRG-STK-001 PART 12 |
| BR-31 | Where player-level data is not essential to a stakeholder's primary capability, the access path is not built. | STK-INV-001 |
| BR-32 | Under-13 scouting is structurally absent, not permission-denied. | STK-INV-004 |

---

## PART 11 — Identity Lifecycle

Six states from `PRG-MET-001` as amended at G0. A Player Person is in exactly one
state at all times. Transition timings are `ActivityPolicy` values, referenced
here by name, not by number.

| State | Business meaning | Entry | Exit | Re-entry |
| --- | --- | --- | --- | --- |
| **REGISTERED** | A Football ID exists; the human is claimed but not yet proven. Counts toward registration volume, never toward VAP. | Person created and Football ID issued | Guardian Verified achieved → `VERIFIED`; or dormancy beyond policy → `INACTIVE` | Not re-enterable — verification is not undone by inactivity; a revoked verification returns the Person to `REGISTERED` only via a Decision Log entry (DL-03) |
| **VERIFIED** | The Guardian Link is verified at L1+ with P1 and P2 active. The identity is trustworthy; the child is not yet playing. The gap between VERIFIED and ACTIVE is the platform's activation problem. | Guardian Verified achieved | Activity threshold met → `ACTIVE`; dormancy → `INACTIVE`; consent withdrawn below P1/P2 → `REGISTERED` (DL-03) | From `TEMPORARILY_INACTIVE` or `INACTIVE` when verification still holds but activity does not |
| **ACTIVE** | Meets the ActivityPolicy threshold. **The only state counted in VAP.** | Qualifying activity threshold met while `VERIFIED` | Activity falls below threshold → `TEMPORARILY_INACTIVE` | Re-enterable at any time by meeting the threshold again; no re-verification required |
| **TEMPORARILY_INACTIVE** | Recently active, currently below threshold, or a transfer is in progress. The normal state of a child between seasons or between clubs. Explicitly **not** a failure state. | Activity lapse; or zero active Primary Membership (INV-MEM-02) | Activity resumes → `ACTIVE`; lapse beyond `inactive_after_days` → `INACTIVE` | Freely, and without re-verification (FR-LFC-03) |
| **INACTIVE** | No qualifying activity beyond `inactive_after_days`. The Person and Journey are intact; the child is simply not currently in football. | Prolonged lapse | Activity resumes → `ACTIVE` (or `VERIFIED` if verification lapsed); long dormancy → `ARCHIVED` | Yes — re-entry to football must never require re-registration; the same Football ID resumes |
| **ARCHIVED** | Long-dormant, or archived at Guardian request. Journey retained. Not visible in operational surfaces. | Dormancy beyond policy, or Guardian-initiated archival | Guardian or adult Player reactivation → `VERIFIED` or `INACTIVE` per current verification standing | Yes, by explicit request. Archival is reversible; erasure is not archival |

**Derived flag — NEVER_ACTIVE.** Applied to any Person who has never recorded a
qualifying activity, regardless of state. It is the registration-inflation guard:
a Phase report showing high registration and high NEVER_ACTIVE is a failure
report, whatever the headline number says.

**Lifecycle rules.**
1. States are computed against the active `ActivityPolicy` and every transition
   event carries `policy_id@version` (FR-LFC-06).
2. A policy change re-evaluates future transitions only; historical transitions
   remain interpretable under the policy in force at the time.
3. No state transition ever deletes data.
4. No state transition happens silently to the Guardian where it affects the
   child's visibility, eligibility, or exposure.

---

## PART 12 — Membership Model

Restates `ADR-0003` in product terms. The ADR remains the normative source.

### Primary Membership

The single authoritative affiliation. Exactly one `ACTIVE` per Player. It is the
official roster basis, the sole source of competition eligibility, and the only
Membership a Transfer touches. Guardian approval is required to start it. Its
absence is valid, not broken.

### Secondary Membership

0..N concurrent. Covers football school, holiday camp, regional training centre,
talent program, national camp, academy trial. It records reality. It confers no
eligibility and no roster claim, and starting or ending it produces no Transfer
event. Guardian approval is required for it too — Secondary is not a consent
shortcut (INV-MEM-05).

### Transfer

A business event, never a field edit (Constitution #8). It closes the outgoing
Primary Membership and opens the incoming one, with an audit trail sufficient to
reconstruct the roster of both Organizations as at any past date. Promoting a
Secondary to Primary is a Transfer, not an upgrade.

### Eligibility

Derived from the `ACTIVE` Primary Membership only, combined with verified age and
active consent. A Secondary Membership never confers the right to play. Competition
context inherits this rule as binding before Competition work begins.

### History

All Memberships of both types are permanent and immutable. Type is an attribute
of a record, never a filter on history: a Journey that omits Secondary
Memberships is an incomplete Journey and a JCS defect.

### NDI protection

Both types count toward NDI portability, so genuine multi-organization
participation becomes visible. Anti-gaming constraints hold: the Organizations
counted must be independently administered, and activity attested by the same
accountable adult counts once. Secondary Memberships must not become a cheap way
to manufacture network density (`PRG-VIS-001` §9.1).

---

## PART 13 — Consent Integration

Integrates `CONSENT-001`. Identity is the context that *holds* consent state and
*enforces* it at the authorization boundary; CONSENT-001 defines the model.

| Aspect | Identity-domain requirement |
| --- | --- |
| **Purpose** | Consent is always attached to one of P1–P8. Identity stores the Person, the purpose, the granting authority, the assurance level, and the time. A capability may only run under a purpose it declares in advance. |
| **Guardian** | For minors, the granting authority is a verified Guardian Link. An unverified link cannot grant. Multiple Guardians hold equal authority unless a recorded decision (DL-02) restricts one. |
| **Verification** | Consent validity depends on assurance: `P1`+`P2` at L1+ is the Guardian Verified bar; `P8` requires L2. A downgrade in assurance invalidates consents that required the higher level. |
| **Revocation** | Immediate, unjustified, always available. High-Risk Revocation additionally fires notification, audit, and a non-reversing review queue. Revocation never deletes the consent history — it appends a revocation fact. |
| **Append-only** | Grants, refusals, revocations, and expiries are all appended. The current state is derived, never stored as a mutable flag. This is what makes CTI auditable. |
| **AI consent** | `P8_AI_MODEL_IMPROVEMENT` is separate, opt-in, L2, structurally unavailable under 13, with a 90-day removal SLA. Consent for any other purpose never implies P8. |
| **Child protection** | Age gate precedes consent evaluation. Where the age band forbids a capability, no consent — from anyone, including the Guardian — can enable it. Guardian consent is a necessary condition, never a sufficient one (Rule 0). |
| **Transparency** | A Guardian can see every active consent, every party relying on it, and every purpose under which their child's data is processed (FR-GRD-05). |

**Conflict rule.** Where a Guardian's consent and the child's interest diverge,
Rule 0 governs: the platform withholds the capability rather than proceed on
consent alone.

---

## PART 14 — Activity Integration

Integrates `PRG-MET-001`. Identity consumes activity facts produced by other
contexts and converts them into lifecycle state and VAP membership.

| Aspect | Identity-domain requirement |
| --- | --- |
| **Active Football Activity** | Qualifying activity is organization-recorded and adult-attested. Identity never invents activity and never accepts self-reported activity as qualifying. |
| **ActivityPolicy** | Exactly one GLOBAL policy is active at a time. Identity evaluates lifecycle against the active policy and stamps `policy_id@version` on every transition. Thresholds are never expressed in logic. |
| **VAP** | Football ID issued **and** Guardian Verified **and** Active Football Activity. All three, simultaneously. Identity is the only context that can assert all three, which is why VAP is reported from here. |
| **TEMPORARILY_INACTIVE** | The Phase 0 targets imply roughly half of verified players will be non-active at any moment (1,500 verified : 800 VAP). This is designed-for, not a defect. Recovery must be frictionless and re-verification-free. |
| **NEVER_ACTIVE** | Derived, reported alongside every registration figure. A registration number published without its NEVER_ACTIVE companion is a misleading number and is prohibited in Council reporting. |
| **Anti-gaming** | Activity attested by the same accountable adult across nominally distinct Organizations counts once for NDI. Seasonal adjustment is a policy parameter, not an exception granted case by case. |

---

## PART 15 — Authorization Model (business perspective)

No implementation. This states what the business requires authorization to mean.

**Evaluation order (mandatory, from PRG-STK-001 PART 12):**

```text
Person  →  Role  →  Relationship  →  Consent  →  Age Gate  →  Policy
```

Failure at any step denies. There is no bypass, no "admin override" that skips
the Consent or Age Gate steps, and no capability that evaluates fewer steps
because it is considered low risk.

| Element | Business meaning |
| --- | --- |
| **RBAC — what you are** | Role establishes the *kind* of access that could exist: Coach, Referee, Organization Admin, Scout, Guardian, Player. Role alone never grants access to a specific child. |
| **ABAC — the situation you are in** | Attributes decide the specific grant: active Membership, current squad assignment, competition assignment, age band, consent purpose, lifecycle state, policy version. This is what makes access expire when the relationship expires. |
| **Guardian Authority** | Governs consent for a linked minor: grant, revoke, object, view, archive. Explicitly excludes altering evidence (STK-INV-002). |
| **Organization Authority** | Governs its own operational records, its Memberships, and its roster. Extends to a Player only through an active Membership and only for the purposes that Membership justifies. Never extends to the Journey. |
| **Association Authority** | Oversight and adjudication within jurisdiction: read, review the Decision Log, resolve disputes, and record adjudications. Cannot silently mutate identity or evidence. |
| **Federation Authority** | Standards, recognition, and integration. Consumes stable opaque identifiers. Does not confer routine operational access to child data. |
| **Platform Authority** | Custodial only. Operates, recovers, and adjudicates merges. Every privileged act is a Decision Log entry and is itself logged when read. |

**Structural Prohibition.** Some capabilities are not authorized-and-denied; they
do not exist. Under-13 scouting is the canonical case. Where child safety depends
on a capability being unavailable, the requirement is that no code path exists to
misconfigure (STK-INV-004).

---

## PART 16 — Privacy Model

| Aspect | Requirement |
| --- | --- |
| **Data ownership** | The Player owns the Journey; the Guardian is steward of the minor's consent; the Platform is custodian, never owner; Organizations own only their own profile and operational records. |
| **Age Band** | The platform exposes a derived coarse Age Band (e.g. eligibility band) in place of a date of birth wherever a band suffices. Requiring an exact DOB where a band would do is a privacy defect. |
| **DOB protection** | The exact date of birth is verification evidence. It is visible to the Guardian, the Person, and the verification function only. Coaches, Scouts, Organizers, Venues, and Sponsors receive the Age Band and a verified/unverified indicator, never the date. |
| **Guardian data** | Guardian personal data is held for consent authority and contact only. It is never exposed to Scouts or Commercial stakeholders, and never used for marketing. |
| **Child sensitive data** | Photographs, video, medical notes, assessments, and location patterns are each bound to their own purpose. None is enabled by a general registration consent. |
| **Purpose limitation** | Data collected for one purpose may not be reused for another without a new consent under that purpose. Analytics reuse requires an aggregate, non-identifying path (STK-INV-001). |
| **Retention** | Every data class carries a retention basis tied to its purpose. Verification evidence is retained for the minimum period that supports dispute resolution and then reduced to the assurance level alone. |
| **Deletion** | Deletion is purpose-scoped removal plus archival, never Journey erasure — the Journey is a record of the child's own history and its destruction is itself a harm. Where law requires erasure of an identifying element, the Journey survives in de-identified form and the action is a Decision Log entry. |
| **Minimisation** | Collect only what an active purpose requires (FR-PER-06). Fields that no active purpose justifies carry zero JCS weight, so incomplete-by-design records are not penalised. |
| **Transparency** | Guardians and adult Players can see what is held, who accesses it, and under which purpose. |

---

## PART 17 — Identity Decision Log

Consequential decisions that must never happen implicitly. Each produces an
append-only, immutable entry (FR-DLG-01..05).

### DL-01 — Duplicate Merge
- **Purpose** — Restore the one-human-one-identity invariant without destroying either history.
- **Trigger** — Probable-duplicate detection, offline reconciliation (NFR-08), or a Guardian/Organization report.
- **Decision owner** — Platform Operator, with Guardian confirmation where a minor is involved.
- **Evidence** — Matching signals, both Football IDs, both Journeys, Guardian confirmation, and the reason the match is accepted.
- **Audit** — Retired ID remains permanently resolvable to the survivor (FR-FID-07); both Journeys are merged, never truncated; reversal is a new linked entry, never an edit.

### DL-02 — Guardian Change
- **Purpose** — Move consent authority for a minor to a different or additional adult.
- **Trigger** — Family change, majority attainment, safeguarding intervention, guardian death or incapacity.
- **Decision owner** — Platform Operator on verified evidence; safeguarding cases escalate to the Child Protection Officer.
- **Evidence** — Verification of the incoming Guardian, basis of the change, standing of the outgoing Guardian, and any Association or authority involvement.
- **Audit** — Prior consents remain in history; the new Guardian's authority begins at the recorded time and is not retroactive.

### DL-03 — Verification Upgrade or Downgrade
- **Purpose** — Change the assurance level attached to a Person or a Guardian Link.
- **Trigger** — New evidence presented, evidence found fraudulent, evidence expired, or a required re-check.
- **Decision owner** — Verification function; downgrades affecting a child escalate to the Child Protection Officer.
- **Evidence** — Evidence reference (not the evidence itself, per FR-VER-04), prior level, new level, and reason.
- **Audit** — Consents dependent on the old level are re-evaluated immediately; any that lose their basis are suspended and the Guardian is notified.

### DL-04 — Transfer
- **Purpose** — Move the authoritative Primary Membership from one Organization to another.
- **Trigger** — Player, Guardian, or Organization initiates; or promotion of a Secondary Membership (DL-05).
- **Decision owner** — Guardian approval is mandatory; the outgoing and incoming Organizations are parties; the Association adjudicates disputes.
- **Evidence** — Both Memberships, both Organizations, effective date, Guardian approval, and any objection raised.
- **Audit** — Emits the Transfer event; roster state at both Organizations must be reconstructable as at any date (FR-MEM-10).

### DL-05 — Membership Promotion (Secondary → Primary)
- **Purpose** — Recognise that a formerly non-exclusive affiliation has become the official one.
- **Trigger** — Guardian or Organization request.
- **Decision owner** — Guardian, with the receiving Organization.
- **Evidence** — The Secondary Membership being promoted, the outgoing Primary being closed, Guardian approval.
- **Audit** — Executed as a Transfer (INV-MEM-03) with the full DL-04 trail. Never recorded as a type change.

### DL-06 — Consent Conflict
- **Purpose** — Resolve contradictory consent positions — two Guardians disagreeing, Guardian against Organization interest, or child objection.
- **Trigger** — Conflicting grant/revoke, a Guardian Annotation escalated, or a child's stated objection.
- **Decision owner** — Child Protection Officer, applying Rule 0.
- **Evidence** — Both positions, the affected purposes, the child's stated view where age-appropriate, and the reasoning applied.
- **Audit** — The outcome is recorded with the principle applied; where positions conflict irreconcilably, the restrictive position stands pending resolution.

### DL-07 — Identity Recovery
- **Purpose** — Restore a Person's access without allowing an identity takeover.
- **Trigger** — Lost credentials, lost device, change of contact channel, or a suspected compromise.
- **Decision owner** — Platform Operator at the assurance level required by the sensitivity of the account.
- **Evidence** — Recovery evidence, prior assurance level, and the outcome.
- **Audit** — A recovery may never bind a Football ID to a different human (FR-AUT-05). Recovery of a Guardian account triggers re-notification to linked minors' records.

### DL-08 — Structural Exception Request
- **Purpose** — Record any request to widen a child-affecting capability, and its outcome.
- **Trigger** — A stakeholder requests access beyond STK-INV-001 or STK-INV-004.
- **Decision owner** — Child Protection Officer with the Enterprise Architect; approval requires an ADR.
- **Evidence** — The request, the capability argument, the Rule 0 assessment.
- **Audit** — Refusals are recorded as firmly as approvals, so the same request is not relitigated informally.

---

## PART 18 — Risks

| ID | Risk | Impact | Likelihood | Mitigation (requirement reference) | Residual |
| --- | --- | --- | --- | --- | --- |
| RSK-01 | **Identity fraud** — a false identity or false age enters the system | Competition integrity destroyed; federation integration impossible | High without controls | Graded verification FR-VER-01..07; age verification before eligibility FR-VER-03; reversible verification FR-VER-06; DL-03 trail | Medium — mitigated by evidence trail and reversibility, not eliminated |
| RSK-02 | **Duplicate identity** — the same child exists twice | VAP, NDI, JCS all corrupt; safeguarding gaps | High (offline registration is the norm) | FR-PER-04 detection + DL-01 explicit merge; NFR-08 offline reconciliation produces a merge decision, never a silent duplicate; NFR-11 duplicate-rate monitoring | Medium |
| RSK-03 | **Guardian conflict** — separated parents, disputed guardianship | Consent becomes unsafe or contested; child caught in the middle | Medium | FR-GRD-03 multiple guardians; FR-GRD-09 change is a decision; FR-GRD-10 + DL-06 escalation under Rule 0; restrictive position stands pending resolution | Medium — inherently social, cannot be engineered away |
| RSK-04 | **Enumeration attack** — harvesting Football IDs to discover children | Mass exposure of minors | Medium | FR-FID-02 opacity; FR-FID-06 non-enumerability and no existence confirmation; FR-FID-05 no authority from possession; NFR-06 | Low |
| RSK-05 | **Consent abuse** — coerced, bundled, or misunderstood consent | Consent is legally and ethically void; CTI is a false number | Medium | FR-CON-08 per-purpose only; NFR-07 comprehensibility; FR-CON-03 free revocation; Rule 0 conflict rule in PART 13 | Medium — comprehension is measurable only imperfectly |
| RSK-06 | **Transfer abuse** — a Player moved without Guardian knowledge, or history rewritten to hide a move | Loss of trust; unresolvable disputes | Medium | BR-21 Transfer as event; DL-04 mandatory Guardian approval; FR-MEM-09 immutable history; FR-MEM-10 point-in-time roster reconstruction | Low |
| RSK-07 | **Privacy breach** — child data reaching a party with no legitimate capability | Severe harm; existential to the platform | Medium | STK-INV-001 build-time minimisation; NFR-04; DOB protection PART 16; FR-ROL-03 access ends with relationship; access logging FR-DLG-05 | Low–Medium |
| RSK-08 | **Scouting misuse** — inappropriate approach to a child | Direct safeguarding harm — unacceptable at any level | Medium | STK-INV-004 Structural Prohibition FR-ROL-06; age gate before consent PART 13; DL-08 records every widening request | Low, and monitored as a standing Council item |
| RSK-09 | **NDI gaming** — Secondary Memberships created to inflate network density | The KPI stops measuring reality | Medium | BR-29 same-adult attestation counts once; independently-administered test; PART 12 NDI protection | Medium |
| RSK-10 | **Registration inflation** — vanity growth of never-active identities | Council decisions taken on a false picture | High (it is the easiest number to move) | FR-LFC-05 NEVER_ACTIVE derived flag; PART 14 reporting prohibition on unaccompanied registration figures | Low |
| RSK-11 | **Standing access after relationship ends** | Ongoing silent breach | High without controls | FR-ROL-03, FR-AUT-07, BR-30 evaluation order | Low |
| RSK-12 | **Policy drift** — thresholds changed without version trail, historical numbers become uninterpretable | Metrics not comparable across phases | Medium | NFR-10 policy versioning; FR-LFC-06 stamped transitions; PART 19 policy version in every report | Low |

---

## PART 19 — Success Metrics

All four come from `PRG-VIS-001` rev. 3. Identity is where three of them are
computed and where the fourth gets its portability signal.

### VAP — Verified Active Players (North Star)

- **Business meaning** — the count of children genuinely in football, verified and playing. It is deliberately hard to inflate.
- **Calculation principle** — Football ID issued **and** Guardian Verified (L1+ with P1, P2 active) **and** lifecycle state `ACTIVE` under the current ActivityPolicy. All three simultaneously.
- **Reporting** — reported for a scope and a date, always alongside total registered and NEVER_ACTIVE count. Phase 0 target: 800.
- **Policy version** — every figure carries `ActivityPolicy policy_id@version`.

### NDI — Network Density Index

- **Business meaning** — how connected the football network actually is; the headline sub-index is portability, the share of `ACTIVE` players with verified activity at two or more independently administered Organizations.
- **Calculation principle** — distinct Organizations counted across both Membership types (ADR-0003); activity attested by the same accountable adult counts once.
- **Reporting** — per scope and phase; the portability sub-index is reported explicitly, not folded into a composite.
- **Policy version** — carries the ActivityPolicy version plus the anti-gaming rule revision applied.

### JCS — Journey Completeness Score

- **Business meaning** — whether a Player's record is actually usable as a journey, across identity, organization, activity, and development.
- **Calculation principle** — per-player weighted score under the versioned `JourneyCompletenessPolicy`; fields not justified by an active consent purpose carry **zero weight**, so privacy compliance never depresses the score.
- **Reporting** — percentage of players above the completeness threshold, plus the weakest dimension.
- **Policy version** — `JourneyCompletenessPolicy policy_id@version`.

### CTI — Consent Trust Index

- **Business meaning** — how much player data is actually usable for its intended purpose because valid consent covers it. A trust measure, not a coverage trick.
- **Calculation principle** — per purpose and in aggregate, computed from the append-only consent record. Diagnostics: guardian verification rate, voluntary opt-in rate, revocation rate, DSAR fulfilment.
- **Reporting** — per purpose always; an aggregate alone is not an acceptable report.
- **Policy version** — carries the CONSENT-001 revision in force.
- **Gate power** — below its floor, CTI blocks phase exit regardless of VAP.

**Identity-specific operational metrics** (not KPIs, but G3 tolerances):
duplicate rate, unverified-Guardian-Link rate, orphaned-Membership rate,
verification-reversal rate, mean time to Decision Log resolution.

---

## PART 20 — Acceptance Criteria

`IDN-DOM-001` (Domain Model) may begin only when all of the following hold.

| # | Criterion | Verified by |
| --- | --- | --- |
| AC-01 | Every business problem BP-01…BP-10 is addressed by at least one Product Goal and one functional requirement. | PART 21 matrix |
| AC-02 | Every functional requirement traces to an approved artefact; no orphan requirements exist. | PART 8 Trace column |
| AC-03 | Every business rule BR-01…BR-32 is stated in testable business language and cites its source. | PART 10 |
| AC-04 | All nine Constitution clauses are demonstrably enforced by at least one MUST requirement. | PART 21 §21.1 |
| AC-05 | All four STK invariants (STK-INV-001…004) appear as MUST requirements, not as guidance. | FR-PER-06, FR-GRD-06/07, FR-ROL-06, BR-31 |
| AC-06 | The six lifecycle states have defined entry, exit, re-entry, and business meaning, with no unreachable or terminal-by-accident state. | PART 11 |
| AC-07 | ADR-0003 invariants INV-MEM-01…06 each map to a functional requirement. | FR-MEM-01…09 |
| AC-08 | All eight consent purposes are represented, with P8's four constraints explicit. | FR-CON-05, BR-17 |
| AC-09 | Every Decision Log type defines purpose, trigger, decision owner, evidence, and audit requirement. | PART 17 |
| AC-10 | All four KPIs have a business meaning, calculation principle, reporting rule, and policy version. | PART 19 |
| AC-11 | No requirement in this document specifies a table, endpoint, screen, or code construct. | PART 5 out-of-scope review |
| AC-12 | Rule 0 is stated as decisive in every conflict path that touches a child: guardian conflict, consent conflict, scouting, and structural exception. | FR-GRD-10, DL-06, DL-08, PART 13 |
| AC-13 | The document names its open questions rather than resolving them silently. | PART 20 open items below |
| AC-14 | Council approval recorded and the artefact registry updated to APPROVED / G2. | `docs/artefact-registry.md` |

### Open items requiring Council decision before G2 exit

| # | Open item | Why the Council, not architecture, must decide | Default if undecided |
| --- | --- | --- | --- |
| OQ-01 | **Age of majority for consent transfer.** 18 by general law, but Indonesian football age banding and the platform's protective posture may justify a different threshold or a staged handover (e.g. co-consent from 16). | It is a child-protection and legal-posture decision, not a technical one. | 18, with no staged handover — the more restrictive option. |
| OQ-02 | **Minimum verification evidence acceptable at L1 in document-scarce settings** (FR-VER-07). Family card, school letter, community attestation? | Determines both fraud exposure (RSK-01) and Phase 0 reachability of 1,200 Verified Guardians. | Blocked — cannot be defaulted; verification standard must be a recorded decision. |
| OQ-03 | **Whether a minor Player may hold their own credentials, and from what age** (FR-AUT-04). | Child-protection judgement with Rule 0 implications. | Not permitted for Phase 0; Guardian-mediated only. |
| OQ-04 | **Guardian Link cardinality ceiling and equal-authority default** (FR-GRD-03). Do two Guardians hold equal authority, or is one designated primary? | Family-law and safeguarding decision. | Equal authority; restrictive position wins on conflict (DL-06). |
| OQ-05 | **CTI Phase 0 floor value.** PRG-VIS-001 establishes CTI as a gate but the floor is unset. | Business risk appetite. | Blocked — a gate without a threshold is not a gate. |

Per the Master Prompt's conflict protocol, OQ-02 and OQ-05 are stated as
**blocking**: they cannot be defaulted by architecture without making a business
decision by omission. The remaining three carry a stated conservative default and
are non-blocking if the Council accepts that default.

---

## PART 21 — Traceability Matrix

### 21.1 Constitution → requirement

| Constitution clause | Enforced by |
| --- | --- |
| 1. Player Owns The Journey | BR-01..03, FR-PER-03, FR-MEM-09/11, PART 16 ownership |
| 2. Identity is Opaque | BR-05, FR-FID-02 |
| 3. Football ID random opaque, no region/org/birth-year/sequence | FR-FID-02, ADR-0002 rev.2, NFR-03 |
| 4. Consent by Default | FR-CON-01, FR-CON-06, BR-18 |
| 5. Privacy by Design | NFR-04, FR-PER-06, PART 16, STK-INV-001 |
| 6. The Child's Interest Prevails | BR-13, FR-GRD-10, DL-06, DL-08, PART 13 conflict rule, AC-12 |
| 7. No Implementation Before Approval | PART 5 out-of-scope, AC-11, AC-14 |
| 8. Transfer is a Business Event | BR-21, FR-MEM-06, DL-04, DL-05 |
| 9. One Active Primary Membership; Secondary ≠ eligibility | BR-19/20, FR-MEM-01/03/04 |

### 21.2 Vision → Stakeholder → Problem → Goal → Requirement → Rule → downstream

| Vision element | Stakeholder (PRG-STK-001) | Problem | Goal | Requirements | Business rules | Future Domain Model | Future API | Future Database |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Portable journey | Player, Guardian | BP-01 | PG-02 | FR-PER-03, FR-MEM-09/10 | BR-01..03 | Journey + Membership entities, `MembershipEnded` | Journey read contract | Append-only membership history |
| One identity per human | Player, SSB Admin | BP-02, BP-06 | PG-01 | FR-PER-01/02/04, FR-FID-01/07 | BR-04, BR-08 | Person aggregate root, merge policy | Person resolution contract | Person + identity-link store |
| Opaque identity | Federation, Platform | BP-03 | PG-01 | FR-FID-02/03/04/05/06 | BR-05..07 | FootballID value object | ID lookup contract w/ enumeration guard | Opaque key + display code |
| Verified guardianship | Guardian, Child Protection Officer | BP-03, BP-04 | PG-04 | FR-GRD-01/04/08, FR-VER-01..07 | BR-09, BR-12 | GuardianLink entity, assurance value object | Verification contract | Guardian link + assurance store |
| Consent-governed data | Guardian, Privacy Officer | BP-04 | PG-03 | FR-CON-01..08 | BR-14..18 | Consent entity, `ConsentGranted/Revoked` | Consent contract | Append-only consent store |
| Child protection | Child Protection Officer, Scout | BP-05 | PG-05 | FR-ROL-06, FR-CON-05 | BR-32, BR-17 | Age-gate policy; absent scouting capability | No under-13 scouting surface exists | No under-13 exposure path |
| Truthful multi-org reality | Player, Regional programme | BP-08 | PG-06 | FR-MEM-02/04 | BR-20 | MembershipType value object | Membership contract | Typed membership record |
| Auditable transfer | Association, Organization | BP-07 | PG-02, PG-07 | FR-MEM-06/10, FR-DLG-01..03 | BR-21/22 | `PlayerTransferred`, `MembershipPromotedToPrimary` | Transfer contract | Immutable transfer history |
| Access ends with relationship | Coach, Child | BP-09 | PG-08 | FR-ROL-02/03, FR-AUT-07 | BR-30 | Authorization policy object | Authorization evaluation | Relationship-scoped access rules |
| Provable decisions | Association, Federation, Platform | BP-10 | PG-07 | FR-DLG-01..05 | BR-08 | DecisionLog entity | Decision Log read contract | Append-only decision store |
| Countable North Star | Platform, Council | BP-02 | PG-09 | FR-LFC-01..06, FR-CON-07 | BR-25..29 | Lifecycle state machine + ActivityPolicy | Metrics contract | Versioned policy + state history |

### 21.3 Approved artefact → this PRD

| Artefact | Consumed in |
| --- | --- |
| PRG-VIS-001 rev.3 | PART 2, PART 9 sizing, PART 14, PART 19 |
| PRG-STK-001 rev.1 | PART 6, PART 15 evaluation order, STK-INV-001..004 throughout |
| PRG-MET-001 | PART 11, PART 14, BR-25..28, FR-LFC-* |
| CONSENT-001 | PART 13, FR-CON-*, BR-14..18, PART 16 |
| ADR-0001 | Not consumed — runtime stack is out of PRD scope by design |
| ADR-0002 rev.2 | FR-FID-*, BR-05..07 |
| ADR-0003 | PART 12, FR-MEM-*, BR-19..24 |

### 21.4 Downstream obligations created by this PRD

| Artefact | Obligation |
| --- | --- |
| IDN-JRN-001 | Must cover: registration by Guardian, guardian verification, consent grant/revoke, membership start, transfer, promotion, recovery, majority handover |
| IDN-DOM-001 | Must model Person, FootballID, User, GuardianLink, Consent, Verification, Membership (+MembershipType), Role, LifecycleState, DecisionLog; must express INV-MEM-01..06 and the six-state machine |
| IDN-EVT-001 | Must define at minimum `FootballIdIssued`, `GuardianLinkVerified`, `ConsentGranted`, `ConsentRevoked`, `MembershipStarted`, `MembershipEnded`, `MembershipPromotedToPrimary`, `PlayerTransferred`, `LifecycleStateChanged`, `IdentityDecisionRecorded` |
| IDN-ERD-001 | Must express INV-MEM-01 as a constraint, append-only consent and decision stores, and DOB access restriction |
| IDN-API-001 | Must expose Age Band rather than DOB, enforce enumeration resistance, and carry policy version on metric responses |
| IDN-UIC-001 | Must render consent in comprehensible Bahasa Indonesia (NFR-07) and never present an "accept all" control (BR-14) |

---

## Quality Gate self-check (G2 entry)

| Gate item | Status | Note |
| --- | --- | --- |
| Constitution compliance | PASS | §21.1 maps all nine clauses |
| Vision alignment | PASS | PART 2, KPIs traced to PRG-VIS-001 rev.3 |
| Stakeholder alignment | PASS | PART 6 uses PRG-STK-001 only; no new stakeholders |
| Consent alignment | PASS | PART 13 integrates CONSENT-001 including P8 and High-Risk Revocation |
| Child protection | PASS | Rule 0 decisive in every child-affecting path; STK-INV-004 as a MUST |
| Privacy by Design | PASS | PART 16 + NFR-04; minimisation is build-time |
| Identity architecture | PASS | Opacity, permanence, non-enumerability, one-person-one-ID |
| ADR compliance | PASS | ADR-0002 rev.2 and ADR-0003 fully absorbed |
| Business rule consistency | PASS | BR-01..32 cross-checked against PART 8; no contradictions found |
| Traceability completeness | PASS | Every FR carries a trace; PART 21 closes vision → future database |
| AI readiness | PASS | P8 isolated, under-13 excluded, training use never implied by other consent |
| **Open business decisions** | **BLOCKING** | OQ-02 (L1 evidence standard) and OQ-05 (CTI floor) require an Enterprise Product Council decision before G2 exit |
