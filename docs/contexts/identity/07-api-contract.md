---
id: IDN-API-001
title: Enterprise Contract-First Application API Specification — Identity Domain
version: 1.0
status: IN_REVIEW
date: 2026-08-07
stage: 4
gate: G4
context_scope: [identity]
authors: [Enterprise Application Architecture Council]
sources:
  [PRG-VIS-001, PRG-STK-001, PRG-MET-001, CONSENT-001, IDN-PRD-001, IDN-DMN-001,
   IDN-CDM-001, IDN-EVT-001, IDN-JRN-001, IDN-ERD-001, ADR-0001, ADR-0002, ADR-0003]
north_star_impact: "Defines the only contract through which a Verified Active Player can be created, verified, affiliated, and counted."
---

# IDN-API-001 — Enterprise Contract-First Application API Specification, Identity Domain

> **Scope guard.** This artefact contains no controller, service, repository,
> SQL, migration, ORM, DDL, React, TanStack, server function, authentication
> implementation, authorization implementation, UI, or wireframe. URI patterns
> are *conceptual contract surface*, not routes. No business rule is invented
> here: every rule cited traces to a locked artefact.

---

## PART 1 — Executive Summary

**Purpose.** The Identity API is the *complete* application contract for the
Identity bounded context. Every capability of the domain is reachable through it.
The web application, the mobile application, association back-office tooling,
federation integrations, and AI agents are all **clients of equal standing** —
the UI is one client, never a privileged path (Constitution #4, API-First).

**Scope.** Fifteen resources, twenty-two commands, twelve queries, realising the
7 aggregates of IDN-DMN-001, the 13 canonical objects of IDN-CDM-001, the 49
events of IDN-EVT-001, and the 21 journeys of IDN-JRN-001 over the 15 logical
entities of IDN-ERD-001.

**Out of scope.** Competition, Match, Training, Development, Scouting, Finance,
Notification. Those contexts consume Identity through the cross-context contracts
of IDN-CDM-001 and are blocked until Identity reaches G6.

**Position in the chain.**

```text
IDN-JRN-001 (what actors do)      ─┐
IDN-DMN-001 (what the domain is)  ─┼─► IDN-API-001 (how any client asks)
IDN-EVT-001 (what happened)       ─┤
IDN-ERD-001 (what is stored)      ─┘
```

**Four contract commitments.**

1. **Commands change the world and emit events; queries read projections.** No
   endpoint does both.
2. **The API validates shape and authority, never business truth.** Business
   truth is asserted by the domain and is cited, not restated.
3. **Every command names its journey, its event, its policy, and its audit
   obligation.** A command that cannot name all four is not admissible.
4. **Child protection is expressed as absence.** There is no command, query,
   endpoint, parameter, or error code by which an under-13 Person can be exposed
   for scouting or talent visibility (STK-INV-004).

---

## PART 2 — API Principles

| # | Principle | Contract expression |
| --- | --- | --- |
| P-01 | **Contract First** | The contract is authored before any implementation. Implementation conforms to it; it never conforms to implementation. A capability absent from this document does not exist. |
| P-02 | **No Business Logic in the API** | The API layer performs shape validation, authority evaluation, and idempotency handling only. Eligibility, uniqueness, age gating, and policy outcomes are asserted by the domain and surfaced as errors, never computed at the edge. |
| P-03 | **Resource Oriented** | Every URI names a business resource from Part 3. No verbs in resource paths; commands are named sub-resources of the resource they act upon. |
| P-04 | **Command / Query Separation** | Commands mutate and emit events. Queries are side-effect free and read projections. A query never emits a domain event; a command never returns a projection as its primary result. |
| P-05 | **Stateless** | No server-side conversational state. Every request carries its own authority context. Multi-step journeys are modelled as a sequence of independently authorised commands, each with its own precondition. |
| P-06 | **Idempotent where applicable** | All commands accept an idempotency key. Replays return the original outcome. See Part 10. |
| P-07 | **Versioned** | Major version in the contract surface; additive change only within a major. See Part 16. |
| P-08 | **Explainable** | Every command that produces a Decision returns the reason code, the narrative, the policy version applied, and the child-interest assessment. An unexplainable outcome is a contract violation. |
| P-09 | **Auditable** | Every command and every child-sensitive query writes an audit entry, **including refusals** (IDN-ERD-001 Part 11). |
| P-10 | **Secure by Default** | Deny by default. Absence of an applicable scope is refusal. Authority is evaluated per request in the order Person → Role → Relationship → Consent → Age Gate → Policy → Scope. |
| P-11 | **Privacy by Default** | Responses are minimised to the consuming capability (STK-INV-001). The same resource returns different projections to different actors; the narrowest applicable projection is the default. |
| P-12 | **Error Consistency** | One uniform error envelope for the whole context: stable code, business message, offending field, policy version, correlation reference. See Part 9. |
| P-13 | **Traceability** | Every command and query in this document carries its journey, event, canonical object, policy, and source artefact. See Part 19. |

**Richardson maturity.** The contract targets Level 3 for resources and Level 2
plus named command sub-resources for state transitions — a deliberate choice:
transfers, merges, and revocations are *business acts*, not field edits, and must
never be expressible as a partial update.

---

## PART 3 — Resource Catalogue

| Resource | Business meaning | Owner | Aggregate | Canonical object |
| --- | --- | --- | --- | --- |
| **Person** | One human being in football, independent of role | The Person (Guardian while minor) | Person | Person |
| **FootballIdentity** | The lifetime opaque identity and display code | The Person | Person | Football Identity |
| **Guardian** | The recorded authority of an adult to act for a minor | The minor's interest | GuardianLink | Guardian Link |
| **Consent** | Authority for stated purposes of data use | Person or verified Guardian | Consent | Consent |
| **Membership** | Typed affiliation with an Organization | Organization (fact) / Person (history) | Membership | Membership |
| **Verification** | Record that a claim was checked and to what level | Verifying authority | Verification | Verification |
| **Decision** | Immutable governed judgement with explanation | Deciding authority | Decision | Decision |
| **Activity** | A countable football activity of a Person | Producing Organization | Activity | Activity Record |
| **Journey** | The Person's readable football life story | The Person | Journey (read model) | Journey |
| **Organization** | Reference to an SSB/club/academy | Organization context | external | Organization Reference |
| **Association** | Reference to a governing association | Federation context | external | Association Reference |
| **Federation** | Reference to the national federation | Federation context | external | Federation Reference |
| **Policy** | Versioned configurable rule set | Enterprise Architecture Council | Policy | Policy |
| **Audit** | Record of who accessed or attempted what | Platform | cross-aggregate | Audit Entry |
| **Event** | Append-only ledger of business facts | Platform as custodian | cross-aggregate | Domain Event |

**Not resources, by decision:** `Player`, `Coach`, `Referee`, `Scout`, `Parent`.
These are role assignments on `Person`. Exposing them as resources would create a
second identity surface and violate Constitution #2 and #3.

**Journey is a read-only resource.** It exposes no command. It cannot be written,
patched, corrected, or deleted through the API (EDEC-01, INV-INF-08).

**Event and Audit are read-only resources.** No client may append to either
through an application path (IDN-ERD-001 Part 14).

---

## PART 4 — Command Catalogue

Common obligations, applying to every command below and not repeated per entry:
authority is evaluated in the P-10 order; the applied `policy_version` is
returned; an audit entry is written on success **and** on refusal; the produced
event carries `causation` and `correlation` references.

### C-01 RegisterPerson
- **Business goal** — Bring a human being into the ecosystem exactly once.
- **Trigger** — Self-registration, guardian registration of a minor, or organization-assisted registration at a desk (J-01).
- **Preconditions** — No unresolved duplicate match above the duplicate-policy threshold; if the subject is a minor, a guardian claim accompanies the registration.
- **Validation source** — IDN-PRD-001 FR-01..05; Duplicate Resolution Policy; Lifecycle Policy.
- **Related journey** — J-01 Register Person.
- **Produced event** — `PersonRegistered`.
- **Idempotency** — Idempotent by key; a replay returns the original Person reference, never a second Person.
- **Authorization** — Self (adult), Guardian, Organization Officer, Association Officer.
- **Audit** — Mandatory; child-sensitive when the subject is a minor.

### C-02 IssueFootballIdentity
- **Business goal** — Grant the lifetime football identity that makes the Person addressable across the ecosystem.
- **Trigger** — Registration completed and issuance authority satisfied (J-02).
- **Preconditions** — Person exists; no FootballIdentity already issued (INV-IDN-02); issuing association is in jurisdiction.
- **Validation source** — ADR-0002 rev. 2; Verification Policy.
- **Related journey** — J-02 Issue Football Identity.
- **Produced event** — `FootballIdentityIssued`.
- **Idempotency** — Strictly idempotent; a second issuance for the same Person is refused, not silently duplicated.
- **Authorization** — Association Officer (issuing authority) or Platform Steward under delegation.
- **Audit** — Mandatory; issuance is an anchor fact of the ecosystem.

### C-03 LinkGuardian
- **Business goal** — Record who may lawfully speak for a minor.
- **Trigger** — Guardian claim submitted (J-04).
- **Preconditions** — Dependent is a minor; guardian is an adult Person; relationship kind is in the reference domain; no conflicting ACTIVE link that the guardian policy forbids.
- **Validation source** — CONSENT-001; Guardian Policy.
- **Related journey** — J-04 Claim Guardianship, J-05 Verify Guardianship.
- **Produced events** — `GuardianLinkClaimed`, then `GuardianLinkVerified` on completion of the accompanying verification.
- **Idempotency** — Idempotent by (guardian, dependent, relationship kind).
- **Authorization** — Claiming Guardian; confirmation requires Association Officer or Child Protection Officer.
- **Audit** — Mandatory, child-sensitive.

### C-04 ReplaceGuardian
- **Business goal** — Transfer guardianship authority from one adult to another without leaving the minor unrepresented.
- **Trigger** — Legal change of guardianship, or resolution of a guardian conflict (J-06).
- **Preconditions** — Incoming guardian verified to the required level; outgoing link ACTIVE; child-interest assessment recorded.
- **Validation source** — Guardian Policy; Rule 0.
- **Related journey** — J-06 Replace Guardian.
- **Produced events** — `GuardianLinkReplaced` (composite: prior link revoked, new link activated), `DecisionRecorded`.
- **Idempotency** — Idempotent by key; replay returns the original decision.
- **Authorization** — Association Officer with Child Protection Officer concurrence.
- **Audit** — Mandatory, child-sensitive, decision trail required.

### C-05 RemoveGuardian
- **Business goal** — End a guardianship authority that is no longer valid.
- **Trigger** — Revocation, expiry, or attainment of majority (J-07).
- **Preconditions** — Link is ACTIVE; removal does not leave a minor with zero guardians unless majority is reached or a replacement is concurrent.
- **Validation source** — Guardian Policy; Rule 0.
- **Related journey** — J-07 End Guardianship.
- **Produced event** — `GuardianLinkRevoked` or `GuardianLinkExpiredByMajority`.
- **Idempotency** — Idempotent; removing an already-removed link returns the original outcome.
- **Authorization** — Association Officer, Child Protection Officer; automatic for majority expiry (system actor).
- **Audit** — Mandatory, child-sensitive.

### C-06 GrantConsent
- **Business goal** — Establish authority for a stated purpose of data use.
- **Trigger** — Person or verified Guardian grants a purpose (J-08).
- **Preconditions** — Granting actor has authority; verification level meets the purpose minimum; the subject's age band permits the purpose at all. **P8 below 13 has no admissible request** — the purpose is not offered and no grant can exist.
- **Validation source** — CONSENT-001 P1..P8; Consent Policy.
- **Related journey** — J-08 Grant Consent.
- **Produced event** — `ConsentGranted`.
- **Idempotency** — Idempotent per (subject, purpose, granting actor); re-granting an active purpose is a no-op returning the existing grant.
- **Authorization** — Self (adult) or verified Guardian only. No officer may grant on a Person's behalf (STK-INV-002).
- **Audit** — Mandatory, child-sensitive.

### C-07 RevokeConsent
- **Business goal** — Withdraw authority for a purpose, with immediate effect where the purpose is high risk.
- **Trigger** — Person or Guardian revokes (J-09).
- **Preconditions** — Purpose currently granted.
- **Validation source** — CONSENT-001 high-risk revocation flow (immediate effect → notification → audit).
- **Related journey** — J-09 Revoke Consent.
- **Produced events** — `ConsentRevoked`; additionally `HighRiskRevocationRaised` for high-risk purposes.
- **Idempotency** — Idempotent; revoking an already-revoked purpose returns the original revocation.
- **Authorization** — Self or verified Guardian. Revocation is never refused for lack of an officer's approval.
- **Audit** — Mandatory; the effect timestamp and the notification dispatch are both recorded.

### C-08 RequestVerification
- **Business goal** — Ask an authority to check an identity, age, guardianship, or organizational claim.
- **Trigger** — Registration, issuance, guardianship claim, transfer, or expiry of a prior verification (J-03).
- **Preconditions** — Subject exists; evidence class is admissible for the requested level.
- **Validation source** — Verification Policy (L1 evidence floor is **OQ-02, open** — a policy value, not a contract change).
- **Related journey** — J-03 Request Verification.
- **Produced event** — `VerificationRequested`.
- **Idempotency** — Idempotent by key; concurrent duplicate requests collapse to one open verification.
- **Authorization** — Self, Guardian, Organization Officer, Association Officer.
- **Audit** — Mandatory, child-sensitive where evidence concerns a minor.

### C-09 CompleteVerification
- **Business goal** — Record that a check succeeded and at what level.
- **Trigger** — Verifying officer concludes review (J-14).
- **Preconditions** — Verification is UNDER_REVIEW; evidence satisfies the policy for the level claimed; the officer holds verifying authority.
- **Validation source** — Verification Policy; CONSENT-001 L0..L3.
- **Related journey** — J-14 Complete Verification.
- **Produced events** — `VerificationCompleted`, `PersonVerificationLevelRaised` where applicable.
- **Idempotency** — Idempotent; a completed verification cannot be completed twice. Re-verification is a **new** Verification (append-only).
- **Authorization** — Verifying Officer of the authority in jurisdiction.
- **Audit** — Mandatory; evidence reference recorded, evidence artefact minimised.

### C-10 RejectVerification
- **Business goal** — Record that a check failed, with a reason the subject can act on.
- **Trigger** — Verifying officer refuses (J-14 exception path).
- **Preconditions** — Verification is UNDER_REVIEW; a coded reason is supplied.
- **Validation source** — Verification Policy; Explainability Policy.
- **Related journey** — J-14 exception E-03 Verification Insufficient.
- **Produced events** — `VerificationRejected`, `DecisionRecorded`.
- **Idempotency** — Idempotent.
- **Authorization** — Verifying Officer.
- **Audit** — Mandatory; rejection reason is disclosable to subject and guardian.

### C-11 CreateMembership
- **Business goal** — Affiliate a Person with an Organization under a stated type.
- **Trigger** — Organization enrols a Person, or a Person joins (J-10).
- **Preconditions** — For PRIMARY: the Person has no ACTIVE Primary (INV-MEM-01) — otherwise the correct command is C-12. For any type: the Organization holds no other active membership for this Person (INV-MEM-06). Consent purpose for organization administration is active.
- **Validation source** — ADR-0003; Membership Policy.
- **Related journey** — J-10 Join Organization.
- **Produced events** — `MembershipCreated`, plus `PrimaryMembershipEstablished` when the type is Primary.
- **Idempotency** — Idempotent by (person, organization, type, requested period).
- **Authorization** — Organization Officer; Self or Guardian consent required.
- **Audit** — Mandatory.

### C-12 TransferMembership
- **Business goal** — Move the Person's single Primary Membership from one Organization to another, without touching identity or history.
- **Trigger** — Transfer request approved (J-11).
- **Preconditions** — An ACTIVE Primary exists; transfer window and cooling-off satisfied by the Transfer Policy; releasing and receiving organizations both represented; child-interest assessment recorded.
- **Validation source** — ADR-0003; Transfer Policy; Rule 0.
- **Related journey** — J-11 Transfer Primary Membership.
- **Produced events** — `PrimaryMembershipEnded`, `PrimaryMembershipEstablished`, `MembershipTransferred`, `DecisionRecorded`.
- **Idempotency** — Idempotent by key; a replay never produces a second transfer.
- **Authorization** — Association Officer approves; both Organization Officers participate; Guardian consent required for a minor.
- **Audit** — Mandatory; full decision trail; neither identifier is touched (ADR-0002).

### C-13 PromoteSecondaryMembership
- **Business goal** — Make an existing Secondary Membership the Person's Primary.
- **Trigger** — Organization and Person agree to formalise the affiliation (J-12).
- **Preconditions** — The Secondary Membership is ACTIVE; approval chain of the Transfer Policy satisfied — **promotion is a transfer, never an edit** (INV-MEM-05).
- **Validation source** — ADR-0003; Transfer Policy.
- **Related journey** — J-12 Promote Secondary to Primary.
- **Produced events** — `MembershipPromotedToPrimary`, `PrimaryMembershipEnded` (prior, if any), `PrimaryMembershipEstablished`, `DecisionRecorded`.
- **Idempotency** — Idempotent by key.
- **Authorization** — Association Officer; Organization Officer; Guardian consent for a minor.
- **Audit** — Mandatory; recorded as a transfer event, not a type correction.

### C-14 AddSecondaryMembership
- **Business goal** — Record a non-exclusive affiliation such as a camp, training centre, or talent programme.
- **Trigger** — Person enrols in an additional programme (J-13).
- **Preconditions** — Organization holds no other active membership for this Person; the secondary count is within the Membership Policy limit. **Confers no eligibility** (INV-MEM-03).
- **Validation source** — ADR-0003; Membership Policy.
- **Related journey** — J-13 Add Secondary Membership.
- **Produced event** — `SecondaryMembershipAdded`.
- **Idempotency** — Idempotent by (person, organization, period).
- **Authorization** — Organization Officer; Self or Guardian consent.
- **Audit** — Mandatory; contributes to NDI network breadth.

### C-15 RemoveSecondaryMembership
- **Business goal** — End a non-exclusive affiliation, preserving it in the Journey.
- **Trigger** — Programme ends or the Person withdraws (J-13 exit).
- **Preconditions** — Membership is ACTIVE and of type SECONDARY. Ending is never deletion (INV-MEM-07).
- **Validation source** — Membership Policy.
- **Related journey** — J-13 Add/End Secondary Membership.
- **Produced event** — `SecondaryMembershipEnded`.
- **Idempotency** — Idempotent.
- **Authorization** — Organization Officer, Self, or Guardian.
- **Audit** — Mandatory.

### C-16 RecordActivity
- **Business goal** — Record a countable football activity so the Person's participation is real and measurable.
- **Trigger** — Match appearance, training session, assessment, or competition appearance (J-16).
- **Preconditions** — Person exists; attributed organization holds an active membership relationship for the Person at the activity date; activity date is not in the future.
- **Validation source** — PRG-MET-001 ActivityPolicy (counting rule and anti-gaming are policy values, applied by the domain — never computed at the edge).
- **Related journey** — J-16 Record Activity.
- **Produced events** — `ActivityRecorded`; `ActivityDiscounted` where the anti-gaming rule applies.
- **Idempotency** — Idempotent by (person, organization, activity kind, occurred_on, external reference). Duplicate submission must never inflate the North Star.
- **Authorization** — Organization Officer, Coach role, Referee role, or Competition system actor.
- **Audit** — Mandatory; the recording actor is always identified.

### C-17 MergeIdentity
- **Business goal** — Collapse two records that describe the same human into one, preserving both histories.
- **Trigger** — Duplicate detected or reported (J-20).
- **Preconditions** — Match confidence above the Duplicate Resolution Policy threshold, or an officer decision with narrative; neither record is under legal hold that forbids merge.
- **Validation source** — Duplicate Resolution Policy; INV-IDN-01, INV-IDN-08.
- **Related journey** — J-20 Resolve Duplicate.
- **Produced events** — `PersonRecordsMerged`, `PersonRecordSuperseded`, `DecisionRecorded`.
- **Idempotency** — Strictly idempotent by key; a merge is irreversible except by a superseding Decision.
- **Authorization** — Association Officer with Platform Identity Steward concurrence.
- **Audit** — Mandatory; the superseded record is retained, never deleted.

### C-18 RecoverIdentity
- **Business goal** — Restore a Person's access to their own identity when credentials or contact are lost.
- **Trigger** — Recovery request (J-17).
- **Preconditions** — Recovery evidence meets the Verification Policy floor for recovery; for a minor, the verified Guardian initiates.
- **Validation source** — Verification Policy; IDN-PRD-001 FR-recovery.
- **Related journey** — J-17 Recover Identity.
- **Produced events** — `IdentityRecoveryRequested`, `IdentityRecoveryCompleted`, `DecisionRecorded`.
- **Idempotency** — Idempotent by key; recovery never issues a new FootballIdentity (ADR-0002).
- **Authorization** — Self with evidence, verified Guardian, or Association Officer.
- **Audit** — Mandatory; a high-value target for abuse, so refusals are audited with equal detail.

### C-19 ArchiveIdentity
- **Business goal** — Move a Person to the terminal lifecycle state while preserving the Journey.
- **Trigger** — Prolonged inactivity, death, or a governed request (J-15).
- **Preconditions** — Lifecycle Policy permits the transition from the current state; no ACTIVE Primary Membership; the Journey is preserved, never erased.
- **Validation source** — PRG-MET-001 six-state lifecycle; Lifecycle Policy.
- **Related journey** — J-15 Lifecycle Transition.
- **Produced events** — `PersonArchived`, `PersonLifecycleTransitioned`.
- **Idempotency** — Idempotent.
- **Authorization** — Association Officer or Platform Steward; Self or Guardian may request.
- **Audit** — Mandatory.

### C-20 RestoreIdentity
- **Business goal** — Return an archived or inactive Person to active participation.
- **Trigger** — Return to football (J-15).
- **Preconditions** — Lifecycle Policy permits; verification standing still valid or re-verified; consent record reviewed.
- **Validation source** — Lifecycle Policy; Consent Policy.
- **Related journey** — J-15 Lifecycle Transition.
- **Produced events** — `PersonRestored`, `PersonLifecycleTransitioned`.
- **Idempotency** — Idempotent.
- **Authorization** — Association Officer; Self or Guardian may request.
- **Audit** — Mandatory.

### C-21 ActivatePolicy
- **Business goal** — Bring a new version of a governed rule set into force.
- **Trigger** — Council approval (J-21 governance path).
- **Preconditions** — Policy version is DRAFT and Council-approved; effective period does not overlap a conflicting active version.
- **Validation source** — IDN-DMN-001 §10; Explainability Policy.
- **Related journey** — J-21 Govern Policy.
- **Produced events** — `PolicyVersionActivated`, `PolicyVersionSuperseded` for the outgoing version.
- **Idempotency** — Idempotent by (policy type, version).
- **Authorization** — Council role only. No officer, organization, or system actor may activate a policy.
- **Audit** — Mandatory; policy history is permanent (R5).

### C-22 RetirePolicy
- **Business goal** — Withdraw a rule set from force without rewriting the decisions it governed.
- **Trigger** — Council resolution (J-21).
- **Preconditions** — Policy is ACTIVE or SUPERSEDED; a successor is in force where the policy type is mandatory.
- **Validation source** — IDN-DMN-001 §10.
- **Related journey** — J-21 Govern Policy.
- **Produced event** — `PolicyVersionRetired`.
- **Idempotency** — Idempotent.
- **Authorization** — Council role only.
- **Audit** — Mandatory; prior decisions retain their original policy version reference forever.

**Commands that deliberately do not exist:**
`UpdateFootballIdentity`, `DeletePerson`, `EditDecision`, `WriteJourney`,
`AppendEvent`, `OverrideConsent`, `ExposeMinorToScout`. Each is absent because a
locked artefact forbids it — not because it is unimplemented.

---

## PART 5 — Query Catalogue

| Query | Business purpose | Source projection | Visibility | Authorization | Privacy classification |
| --- | --- | --- | --- | --- | --- |
| **Q-01 GetPerson** | Retrieve one Person as the caller is entitled to see them | Person current-state read model | Per-viewer projection: Self/Guardian full; Organization Officer limited to membership-relevant attributes; Association limited to jurisdiction purpose | Player, Guardian, Organization, Association boundaries | Confidential; Child Sensitive when minor |
| **Q-02 SearchPersons** | Find a Person at a registration desk or during verification | Natural-lookup index projection | Scoped, rate-limited, never enumerable; results are always within the caller's boundary | Organization Officer (own roster scope), Association Officer (jurisdiction), Platform Steward | Confidential; every call audited |
| **Q-03 GetJourney** | Show the Person their football life story | JourneyProjection | Self/Guardian full; others filtered by relationship, consent purpose, and age band, computed per viewer | Player and Guardian boundaries; others require active relationship + consent | Restricted; Child Sensitive for minors |
| **Q-04 GetMemberships** | See current affiliations and history | Membership read model | Self/Guardian full history; Organization sees only its own memberships; Association sees jurisdiction | All boundaries; organizations mutually isolated | Restricted |
| **Q-05 GetGuardianLinks** | See who may act for a minor | GuardianLink read model | Guardian party, Child Protection Officer, Association Officer | Guardian boundary | Guardian Only; Child Sensitive |
| **Q-06 GetConsents** | See which purposes are currently permitted | Consent purpose-grant read model | Self/Guardian full; a capability may query only whether *its own* purpose is permitted | Player and Guardian boundaries; Privacy Officer | Restricted |
| **Q-07 GetVerification** | See verification standing and outcome | Verification read model | Subject, Guardian, verifying officer, Association. **Evidence artefacts are not returned** — only the class of evidence and the outcome | Association boundary | Restricted; evidence Child Sensitive |
| **Q-08 GetActivities** | See countable participation | Activity read model | Self/Guardian full; Organization sees activities it attributed; Metrics Steward sees aggregate only | All boundaries | Restricted; aggregate above reporting floor for others |
| **Q-09 GetAuditHistory** | Answer "who accessed this child's data?" | Audit read model | Subject and Guardian for their own record; Security Architect and Council auditor for investigations | Guardian boundary; audit role | Restricted; Child Sensitive |
| **Q-10 GetPolicies** | Read the rules in force and their history | Policy version read model | All authenticated actors | Any authenticated actor | Internal — policy transparency is deliberate |
| **Q-11 GetOrganizations** | Resolve organizations, associations, federation | Reference read model | Public names; full record internal | Any authenticated actor | Public / Internal |
| **Q-12 GetDecisionHistory** | Understand why an outcome happened | Decision read model | Subject and Guardian for decisions about them; deciding authority; Council auditor. Returns reason, narrative, policy version, and child-interest assessment | Player, Guardian, Association boundaries | Restricted; Child Sensitive |

**Query invariants.** No query emits an event. No query returns an attribute the
caller's capability does not require (STK-INV-001). No query accepts a parameter
that would permit enumeration of minors (IDN-ERD-001 Part 15 anti-pattern). No
query reads the event ledger directly for product paths — the ledger is a
governed read for auditors, not a product API (`Q-09` and Council access only).

---

## PART 6 — Endpoint Catalogue

Conceptual URI patterns. Commands are named sub-resources; the resource path
identifies *what* is acted upon and the sub-resource identifies *the business
act*. No framework, router, or handler is implied.

| Resource | URI pattern (conceptual) | Method | Scope | Commands | Queries |
| --- | --- | --- | --- | --- | --- |
| Person | `/identity/persons` | POST | collection | C-01 RegisterPerson | — |
| Person | `/identity/persons` | GET | collection | — | Q-02 SearchPersons |
| Person | `/identity/persons/{personRef}` | GET | instance | — | Q-01 GetPerson |
| Person | `/identity/persons/{personRef}/merge` | POST | command | C-17 MergeIdentity | — |
| Person | `/identity/persons/{personRef}/recovery` | POST | command | C-18 RecoverIdentity | — |
| Person | `/identity/persons/{personRef}/archive` | POST | command | C-19 ArchiveIdentity | — |
| Person | `/identity/persons/{personRef}/restore` | POST | command | C-20 RestoreIdentity | — |
| FootballIdentity | `/identity/persons/{personRef}/football-identity` | POST | command | C-02 IssueFootballIdentity | — |
| FootballIdentity | `/identity/persons/{personRef}/football-identity` | GET | instance | — | part of Q-01 |
| FootballIdentity | `/identity/football-identities/lookup` | GET | lookup | — | display-code lookup (authenticated, rate-limited, audited — ADR-0002) |
| Guardian | `/identity/persons/{personRef}/guardians` | POST | collection | C-03 LinkGuardian | — |
| Guardian | `/identity/persons/{personRef}/guardians` | GET | collection | — | Q-05 GetGuardianLinks |
| Guardian | `/identity/guardian-links/{linkRef}/replace` | POST | command | C-04 ReplaceGuardian | — |
| Guardian | `/identity/guardian-links/{linkRef}/removal` | POST | command | C-05 RemoveGuardian | — |
| Guardian | `/identity/guardian-links/{linkRef}/annotations` | POST | command | record a Guardian Annotation (attaches, never mutates — STK-INV-003) | GET annotations |
| Consent | `/identity/persons/{personRef}/consents` | GET | collection | — | Q-06 GetConsents |
| Consent | `/identity/persons/{personRef}/consents/{purpose}/grant` | POST | command | C-06 GrantConsent | — |
| Consent | `/identity/persons/{personRef}/consents/{purpose}/revocation` | POST | command | C-07 RevokeConsent | — |
| Membership | `/identity/persons/{personRef}/memberships` | POST | collection | C-11 CreateMembership, C-14 AddSecondaryMembership | — |
| Membership | `/identity/persons/{personRef}/memberships` | GET | collection | — | Q-04 GetMemberships |
| Membership | `/identity/memberships/{membershipRef}/transfer` | POST | command | C-12 TransferMembership | — |
| Membership | `/identity/memberships/{membershipRef}/promotion` | POST | command | C-13 PromoteSecondaryMembership | — |
| Membership | `/identity/memberships/{membershipRef}/termination` | POST | command | C-15 RemoveSecondaryMembership | — |
| Verification | `/identity/persons/{personRef}/verifications` | POST | collection | C-08 RequestVerification | — |
| Verification | `/identity/persons/{personRef}/verifications` | GET | collection | — | Q-07 GetVerification |
| Verification | `/identity/verifications/{verificationRef}/completion` | POST | command | C-09 CompleteVerification | — |
| Verification | `/identity/verifications/{verificationRef}/rejection` | POST | command | C-10 RejectVerification | — |
| Decision | `/identity/persons/{personRef}/decisions` | GET | collection | — | Q-12 GetDecisionHistory |
| Decision | `/identity/decisions/{decisionRef}` | GET | instance | — | Q-12 detail |
| Activity | `/identity/persons/{personRef}/activities` | POST | collection | C-16 RecordActivity | — |
| Activity | `/identity/persons/{personRef}/activities` | GET | collection | — | Q-08 GetActivities |
| Journey | `/identity/persons/{personRef}/journey` | GET | instance, **read-only** | *(none, by decision)* | Q-03 GetJourney |
| Organization | `/identity/organizations` · `/{orgRef}` | GET | reference | — | Q-11 GetOrganizations |
| Association | `/identity/associations` · `/{assocRef}` | GET | reference | — | Q-11 |
| Federation | `/identity/federations/{fedRef}` | GET | reference | — | Q-11 |
| Policy | `/identity/policies` · `/{policyType}/versions` | GET | collection | — | Q-10 GetPolicies |
| Policy | `/identity/policies/{policyType}/versions/{version}/activation` | POST | command | C-21 ActivatePolicy | — |
| Policy | `/identity/policies/{policyType}/versions/{version}/retirement` | POST | command | C-22 RetirePolicy | — |
| Audit | `/identity/persons/{personRef}/audit-entries` | GET | collection, **read-only** | *(none)* | Q-09 GetAuditHistory |
| Event | `/identity/events` | GET | governed read-only | *(none)* | Council/auditor ledger read |

**No endpoint exists for:** exposing minors to talent search, bulk export of
person-level data to commercial partners, venue access to person-level data, or
writing to Journey, Event, or Audit. The absence is structural.

**External integration surface.** Federation and association integrations,
webhooks, and scheduled jobs are exposed through the public integration prefix
established by ADR-0001; each such endpoint verifies its caller inside the
handler and is subject to the same authority evaluation. No integration endpoint
receives a wider scope than an equivalent internal one.

---

## PART 7 — Request Contract

Field semantics only; no implementation types. Every command request additionally
carries: `idempotencyKey` (required), `actingRoleReference` (required — which of
the caller's roles is being exercised), `correlationReference` (optional),
`requestedAt` (required).

| Command | Required | Optional | Business constraints | Validation rules |
| --- | --- | --- | --- | --- |
| C-01 RegisterPerson | legal name, date of birth, registration context (self/guardian/organization) | preferred name, contact channel, sex category, nationality, guardian claim | A minor registration must carry a guardian claim | Name present; DOB not in the future; DOB plausible for football participation; duplicate check invoked |
| C-02 IssueFootballIdentity | person reference, issuing association reference | — | Exactly one identity per Person | Person exists and is at least REGISTERED; no existing identity |
| C-03 LinkGuardian | guardian person reference, dependent person reference, relationship kind | supporting evidence reference | Dependent must be a minor | Both persons exist; relationship kind in reference domain; guardian is adult |
| C-04 ReplaceGuardian | outgoing link reference, incoming guardian reference, relationship kind, reason code, child-interest assessment | narrative | Minor must never be left unrepresented | Outgoing link ACTIVE; incoming guardian verified; assessment present |
| C-05 RemoveGuardian | link reference, reason code | effective date, narrative | Removal must not orphan a minor | Link ACTIVE; majority or replacement or governed exception |
| C-06 GrantConsent | subject person reference, purpose code, granting authority basis | expiry preference | Purpose must be age-admissible; P8 requires opt-in and L2 | Granting actor authorised; verification level ≥ purpose minimum; purpose in catalogue |
| C-07 RevokeConsent | subject person reference, purpose code | reason | High-risk revocation takes effect before notification | Purpose currently granted |
| C-08 RequestVerification | subject person reference, verification kind, requested level, evidence class | evidence reference, note | Evidence class must be admissible for the requested level | Subject exists; kind and level in reference domains |
| C-09 CompleteVerification | verification reference, level reached, outcome reason | evidence notes, expiry | Level reached cannot exceed what the evidence supports | Verification UNDER_REVIEW; officer holds authority |
| C-10 RejectVerification | verification reference, reason code | narrative | Reason must be disclosable to subject and guardian | Verification UNDER_REVIEW |
| C-11 CreateMembership | person reference, organization reference, membership type, joined date | note | Primary requires no existing active Primary | Organization exists; no duplicate active membership for this organization |
| C-12 TransferMembership | current membership reference, receiving organization reference, reason code, child-interest assessment | effective date, narrative | Primary only; window and cooling-off apply | Membership is ACTIVE and PRIMARY; approval chain complete |
| C-13 PromoteSecondaryMembership | secondary membership reference, reason code, child-interest assessment | effective date | Treated as a transfer, never an attribute change | Membership ACTIVE and SECONDARY; approval chain complete |
| C-14 AddSecondaryMembership | person reference, organization reference, joined date, programme kind | expected end date | Confers no eligibility | Within secondary limit; no other active membership for this organization |
| C-15 RemoveSecondaryMembership | membership reference, end reason, ended date | narrative | Ending never deletes | Membership ACTIVE and SECONDARY |
| C-16 RecordActivity | person reference, activity kind, occurred-on date, attributed organization reference | external reference, note | Activity date not in the future; attribution must be a real relationship | Person exists; relationship valid at the date; counting decided by policy, not by request |
| C-17 MergeIdentity | surviving person reference, superseded person reference, reason code, narrative, child-interest assessment | evidence reference | Both histories preserved | Both persons exist; neither under a merge-blocking legal hold |
| C-18 RecoverIdentity | subject person reference or display code, recovery evidence class | contact channel | Never issues a new identity | Recovery evidence meets policy floor |
| C-19 ArchiveIdentity | person reference, reason code | effective date | Journey preserved | Lifecycle transition permitted; no ACTIVE Primary |
| C-20 RestoreIdentity | person reference, reason code | effective date | Consent record reviewed on restore | Lifecycle transition permitted |
| C-21 ActivatePolicy | policy type, version, effective from, Council approval reference | effective until | No overlapping conflicting active version | Version DRAFT and approved |
| C-22 RetirePolicy | policy type, version, reason | effective date | Mandatory types require a successor in force | Version ACTIVE or SUPERSEDED |

**Universal request rules.** Unknown fields are rejected, not ignored — a
tolerant parser hides contract drift. No request may carry a computed business
outcome (eligibility, activity counting state, verification level entitlement);
supplying one is a validation error, not an override.

---

## PART 8 — Response Contract

**Command success** — returns: the affected resource reference, the resulting
business state, the produced event references, the applied policy version, the
decision reference where a Decision was recorded, the idempotency outcome
(`created` or `replayed`), and any warnings. It does **not** return a full
projection; the client queries for that.

**Query success** — returns: the per-viewer projection, the projection freshness
marker (for Journey and analytics reads), the applied visibility basis
(relationship + consent + age band, as a summary, never as raw policy internals),
and pagination continuation where the result is a collection.

**Failure** — one uniform envelope for the whole context:

| Element | Meaning |
| --- | --- |
| `errorCode` | Stable code from Part 9. Never a free-text discriminator. |
| `errorCategory` | Business / Validation / Authorization / Policy / Conflict / Idempotency / Privacy / ChildProtection |
| `businessMessage` | Human-readable, Bahasa Indonesia primary, actionable, never leaking another person's data |
| `offendingFields` | Which inputs failed, where applicable |
| `policyVersionApplied` | Which rules produced the outcome, where a policy decided it |
| `decisionReference` | Where a Decision was recorded (refusals are often decisions) |
| `correlationReference` | For support and audit |
| `retryable` | Whether the same request may succeed later |

**Warnings** — non-blocking advisories returned alongside success: verification
approaching expiry; consent purpose approaching expiry; secondary membership
count approaching the policy limit; activity recorded but not yet counted under
the current window; projection is stale beyond the reporting policy freshness.

**Business messages** — refusals speak in business language, not system language.
"Transfer cannot proceed while the cooling-off period is in force" — never
"constraint violated". Messages about a minor are addressed to the guardian
context and never disclose another guardian's personal details.

---

## PART 9 — Error Catalogue

| Code | Category | Meaning | Typical source |
| --- | --- | --- | --- |
| `IDN-BUS-001` | Business | Person already has a Football Identity | INV-IDN-02 |
| `IDN-BUS-002` | Business | Person already has an active Primary Membership | INV-MEM-01 |
| `IDN-BUS-003` | Business | Organization already holds an active membership for this Person | INV-MEM-06 |
| `IDN-BUS-004` | Business | Secondary membership confers no eligibility for this operation | INV-MEM-03 |
| `IDN-BUS-005` | Business | Lifecycle transition not permitted from the current state | Lifecycle Policy |
| `IDN-BUS-006` | Business | Verification already concluded; submit a new verification | Verification append-only |
| `IDN-BUS-007` | Business | Decision is immutable; record a superseding decision | INV-INF (Decision) |
| `IDN-VAL-001` | Validation | Required field missing | Part 7 |
| `IDN-VAL-002` | Validation | Unknown field supplied | Universal request rule |
| `IDN-VAL-003` | Validation | Value outside the reference domain | Part 12 of IDN-ERD-001 |
| `IDN-VAL-004` | Validation | Date is implausible or in the future | Part 7 |
| `IDN-VAL-005` | Validation | Computed business outcome supplied by client | P-02 |
| `IDN-AUT-001` | Authorization | No authenticated actor | Part 11 |
| `IDN-AUT-002` | Authorization | Acting role does not permit this command | Part 12 |
| `IDN-AUT-003` | Authorization | No relationship to the subject within any boundary | IDN-ERD-001 Part 14 |
| `IDN-AUT-004` | Authorization | Organization isolation prevents this read | Isolation boundary |
| `IDN-AUT-005` | Authorization | Guardian authority is not verified, suspended, or expired | Guardian boundary |
| `IDN-POL-001` | Policy | Verification level below the required minimum | Verification/Consent Policy |
| `IDN-POL-002` | Policy | Transfer window or cooling-off in force | Transfer Policy |
| `IDN-POL-003` | Policy | Secondary membership limit reached | Membership Policy |
| `IDN-POL-004` | Policy | Reporting cohort floor not met; aggregate withheld | Reporting Policy |
| `IDN-POL-005` | Policy | No active policy version for this decision type | Policy governance |
| `IDN-CON-001` | Conflict | Competing guardian claim unresolved | Guardian conflict exception |
| `IDN-CON-002` | Conflict | Concurrent modification of the same aggregate | Aggregate boundary |
| `IDN-CON-003` | Conflict | Unresolved duplicate blocks this operation | Duplicate Resolution Policy |
| `IDN-IDM-001` | Idempotency | Idempotency key reused with a different request body | Part 10 |
| `IDN-IDM-002` | Idempotency | Original request still in progress; retry later | Part 10 |
| `IDN-PRV-001` | Privacy | Required consent purpose is not granted | CONSENT-001 |
| `IDN-PRV-002` | Privacy | Consent purpose revoked; access withdrawn with immediate effect | High-risk revocation |
| `IDN-PRV-003` | Privacy | Attribute withheld by data minimisation for this capability | STK-INV-001 |
| `IDN-PRV-004` | Privacy | Enumeration-shaped request refused | IDN-ERD-001 Part 15 |
| `IDN-CHP-001` | Child Protection | Operation is not available for this age band — **capability absent, not denied** | STK-INV-004 |
| `IDN-CHP-002` | Child Protection | Guardian authority required for a minor | CONSENT-001 |
| `IDN-CHP-003` | Child Protection | Child-interest assessment missing from a decision-bearing command | Rule 0 |
| `IDN-CHP-004` | Child Protection | Evidence artefact cannot be returned; only outcome is disclosable | Minimisation |

**`IDN-CHP-001` wording rule.** The message must not imply that a permission
could be granted. Under-13 talent visibility is not a locked door; there is no
door. Client applications must not render it as a request-access affordance.

---

## PART 10 — Idempotency Strategy

Every command accepts a client-supplied `idempotencyKey`. The key scopes to
(actor, command, key) and is retained for the retention window of the Idempotency
handling defined by platform policy.

| Command | Nature | Duplicate handling | Retry behaviour |
| --- | --- | --- | --- |
| C-01 RegisterPerson | Idempotent by key | Replay returns the original Person; never a second human record | Safe to retry indefinitely |
| C-02 IssueFootballIdentity | Strictly idempotent | Second attempt for the same Person refused with `IDN-BUS-001` | Safe; refusal is stable |
| C-03 LinkGuardian | Idempotent by (guardian, dependent, kind) | Returns existing link | Safe |
| C-04 ReplaceGuardian | Idempotent by key | Replay returns original decision | Safe |
| C-05 RemoveGuardian | Idempotent | Already-removed returns original outcome | Safe |
| C-06 GrantConsent | Idempotent per purpose | Re-grant of an active purpose is a no-op returning the grant | Safe |
| C-07 RevokeConsent | Idempotent | Already-revoked returns original revocation and effect time | Safe; **must be retried aggressively** — revocation must not fail silently |
| C-08 RequestVerification | Idempotent by key | Concurrent duplicates collapse to one open verification | Safe |
| C-09 CompleteVerification | Idempotent | Already-completed returns `IDN-BUS-006` | Safe |
| C-10 RejectVerification | Idempotent | Already-rejected returns original | Safe |
| C-11 CreateMembership | Idempotent by key | Replay returns the original membership | Safe |
| C-12 TransferMembership | Strictly idempotent | Replay never produces a second transfer or a second decision | Safe |
| C-13 PromoteSecondaryMembership | Strictly idempotent | Replay returns the original promotion decision | Safe |
| C-14 AddSecondaryMembership | Idempotent | Replay returns existing | Safe |
| C-15 RemoveSecondaryMembership | Idempotent | Replay returns existing end | Safe |
| C-16 RecordActivity | **Idempotent by natural key** (person, kind, date, organization, external reference) in addition to the key | Duplicate returns the original activity and does **not** increment counting | Safe; this is the primary defence of the North Star against inflation |
| C-17 MergeIdentity | Strictly idempotent | Replay returns the original merge decision; merge is never repeated | Safe |
| C-18 RecoverIdentity | Idempotent by key | Replay returns original recovery outcome | Safe |
| C-19 ArchiveIdentity | Idempotent | Already-archived returns original | Safe |
| C-20 RestoreIdentity | Idempotent | Already-restored returns original | Safe |
| C-21 ActivatePolicy | Idempotent by (type, version) | Replay returns existing activation | Safe |
| C-22 RetirePolicy | Idempotent | Replay returns existing retirement | Safe |

**Key reuse with a different body** returns `IDN-IDM-001` — never the original
result, and never a new operation. **In-flight replay** returns `IDN-IDM-002`
with `retryable = true`.

**Queries** are inherently safe and repeatable, subject to rate limits on
`Q-02 SearchPersons` and display-code lookup.

---

## PART 11 — Authentication Model

Conceptual only. No mechanism, library, token format, or flow is specified here.

| Actor class | Who it is | Identity basis | Authority basis | Constraints |
| --- | --- | --- | --- | --- |
| **Person (self)** | An adult acting for themselves | Their own Person and Football Identity | Player boundary | Full authority over own identity, consent, and journey visibility |
| **Guardian** | A verified adult acting for a minor | Their own Person, plus an ACTIVE verified GuardianLink | Guardian boundary, limited by `authority_scope` | Terminates automatically at the dependent's majority; never becomes an evidence authority (STK-INV-002) |
| **Organization actor** | Officer, coach, or administrator of an SSB/club/academy | Person + RoleAssignment scoped to the Organization | Organization boundary | Reaches only Persons with an active membership in that Organization; organizations are mutually invisible |
| **Association actor** | Officer of a governing association | Person + RoleAssignment scoped to the Association | Association boundary | Issuance, verification, transfer approval, integrity within jurisdiction |
| **Federation actor** | Representative of the national federation | Person + RoleAssignment scoped to the Federation | Federation boundary | Aggregate and roster reporting by default; person-level access requires an explicit governed purpose and is individually audited |
| **System actor** | Platform-internal automation (majority expiry, projection rebuild, policy effective-date transitions) | Non-human principal with a declared capability set | Narrow, named capabilities only | Cannot grant consent, cannot decide a transfer, cannot merge identities without a human decision reference |
| **AI Agent** | An automated consumer of Identity data | Non-human principal, always attributable to a sponsoring human authority | Explicit purpose binding | Bound to purposes with active consent; **P8 required for model-improvement use, opt-in, L2, structurally unavailable under 13**; may never act as a decision authority; every access audited with the sponsoring authority named |

**Universal rules.** Every request is authenticated; there is no anonymous
surface in this context, including reference lookups. Every request declares the
role being exercised — holding a role is not exercising it. A single Person
holding several roles authenticates once and must still select the acting role
per request (Constitution #3 with Zero Trust).

---

## PART 12 — Authorization Mapping

Evaluation order (never widening): **Person → Role → Relationship → Consent →
Age Gate → Policy → Scope**. Absence of an applicable scope is refusal.

| Actor | Commands permitted | Queries permitted | Governing policy | RLS boundary (IDN-ERD-001 Part 14) |
| --- | --- | --- | --- | --- |
| **Self (adult)** | C-01, C-06, C-07, C-08, C-18; may *request* C-19/C-20 | Q-01, Q-03, Q-04, Q-06, Q-07, Q-08, Q-09, Q-10, Q-11, Q-12 (own) | Consent, Lifecycle | Player Boundary |
| **Minor (self)** | C-08 (request only); no consent grant | Q-01, Q-03, Q-04, Q-08 (own, age-appropriate rendering) | Consent, Guardian | Player Boundary, guardian-supervised |
| **Guardian** | C-03, C-05, C-06, C-07, C-08, C-18 on behalf of dependent; guardian annotations | Q-01, Q-03..Q-09, Q-12 for the dependent | Guardian, Consent | Guardian Boundary (scope-limited, majority-terminated) |
| **Organization actor** | C-01 (assisted), C-08, C-11, C-14, C-15, C-16 | Q-01 (limited attributes), Q-02 (own scope), Q-04 (own memberships), Q-08 (own attributions), Q-11 | Membership, Activity | Organization Boundary + Isolation |
| **Association actor** | C-02, C-04, C-05, C-09, C-10, C-12, C-13, C-17, C-19, C-20 | Q-01, Q-02, Q-04, Q-05, Q-07, Q-12 within jurisdiction | Verification, Transfer, Guardian, Lifecycle, Duplicate | Association Boundary |
| **Federation actor** | — (no person-level command) | Q-04, Q-08, Q-11 aggregate/roster; person-level only under a governed purpose | Reporting | Federation Boundary |
| **Child Protection Officer** | C-04, C-05 concurrence | Q-05, Q-09, Q-12 | Guardian, Explainability | Guardian Boundary + audit role |
| **Privacy Officer** | — | Q-06, Q-09 | Consent | Audit role |
| **Council** | C-21, C-22 | Q-10, Q-12, ledger read | all | Governance scope |
| **System actor** | C-05 (majority expiry), C-16 (competition-sourced) | projection rebuild reads | Guardian, Activity | Narrow named capability |
| **AI Agent** | — (no command) | Q-08, Q-11 aggregate; person-level strictly purpose-bound with active consent | Consent (P6, P8), Reporting | Purpose scope; **no under-13 scope exists** |
| **Commercial partner** | — | aggregate, anonymised, above reporting floor only | Reporting | **No person-level scope exists** (STK-INV-001) |
| **Venue** | — | booking/field/schedule/capacity only — outside this context | — | **No scope in Identity at all** |
| **Scout role** | — | Q-01/Q-03 talent-visibility projection for age bands ≥13 **with P7 granted** only | Consent P7, Reporting | **No under-13 scope exists** (STK-INV-004) |

**Structural note.** The final three rows describe capabilities that are *absent
from the contract*, not permissions evaluated to false. There is no parameter,
role, policy value, or escalation path that produces them.

---

## PART 13 — Business Rule Mapping

Every contract element traces upward; none originates here.

| Contract element | PRD | Business rule / invariant | ADR | Canonical object | Journey | Domain event |
| --- | --- | --- | --- | --- | --- | --- |
| C-01 RegisterPerson | FR-01..05 | INV-IDN-01, INV-IDN-07 | — | Person | J-01 | PersonRegistered |
| C-02 IssueFootballIdentity | FR-06..09 | INV-IDN-02..05 | ADR-0002 | Football Identity | J-02 | FootballIdentityIssued |
| C-03/04/05 Guardian commands | FR-13..20 | INV-CON-01, INV-INF-04 | — | Guardian Link | J-04..J-07 | GuardianLink* family |
| C-06 GrantConsent | FR-21..28 | INV-CON-02, INV-CON-03, INV-CON-07 | — | Consent | J-08 | ConsentGranted |
| C-07 RevokeConsent | FR-29..32 | INV-CON-04, INV-CON-05 | — | Consent | J-09 | ConsentRevoked, HighRiskRevocationRaised |
| C-08/09/10 Verification | FR-33..40 | INV-CON-07, data quality accuracy | — | Verification | J-03, J-14 | Verification* family |
| C-11 CreateMembership | FR-41..45 | INV-MEM-01, INV-MEM-06 | ADR-0003 | Membership | J-10 | MembershipCreated |
| C-12 TransferMembership | FR-46..49 | INV-MEM-04, INV-MEM-07 | ADR-0003, ADR-0002 | Membership | J-11 | MembershipTransferred |
| C-13 PromoteSecondary | FR-50 | INV-MEM-05 | ADR-0003 | Membership | J-12 | MembershipPromotedToPrimary |
| C-14/15 Secondary lifecycle | FR-51..52 | INV-MEM-02, INV-MEM-03 | ADR-0003 | Membership | J-13 | SecondaryMembership* |
| C-16 RecordActivity | FR-53..55 | PRG-MET-001 counting rule | — | Activity Record | J-16 | ActivityRecorded |
| C-17 MergeIdentity | FR-56 | INV-IDN-01, INV-IDN-08 | — | Person, Decision | J-20 | PersonRecordsMerged |
| C-18 RecoverIdentity | FR-57 | INV-IDN-03 (no new identity) | ADR-0002 | Person | J-17 | IdentityRecovery* |
| C-19/20 Lifecycle | FR-58 | INV-IDN-07, INV-MEM-08 | — | Person | J-15 | PersonArchived / PersonRestored |
| C-21/22 Policy governance | NFR-GOV | INV-INF-07 | — | Policy | J-21 | PolicyVersion* |
| Q-03 GetJourney | FR-journey | INV-INF-08, EDEC-01 | — | Journey | J-18 | *(consumer only)* |
| Q-09 GetAuditHistory | NFR-SEC | audit of refusals | — | Audit Entry | J-21 | *(access, not business)* |
| Error `IDN-CHP-001` | BP-child-protection | STK-INV-004 | — | — | *(no journey exists)* | *(no event exists)* |
| Every decision-bearing command | — | Rule 0 mandatory assessment | — | Decision | all decision points | DecisionRecorded |

**No new business rule is introduced by this artefact.** Any behaviour a client
observes that is not traceable in this table is a defect in the implementation,
not an undocumented feature.

---

## PART 14 — Event Publication Mapping

```text
Command → domain asserts fact → EventStore (append-only) → projections
```

| Command | Produced events | Affected projections |
| --- | --- | --- |
| C-01 | PersonRegistered | Person state, JourneyProjection (Identity), JCS |
| C-02 | FootballIdentityIssued | Person state, JourneyProjection (Identity), VAP eligibility |
| C-03 | GuardianLinkClaimed, GuardianLinkVerified | GuardianLink state, JourneyProjection (Guardian), CTI |
| C-04 | GuardianLinkReplaced, DecisionRecorded | GuardianLink state, Decision history, JourneyProjection |
| C-05 | GuardianLinkRevoked / GuardianLinkExpiredByMajority | GuardianLink state, consent authority recomputation |
| C-06 | ConsentGranted | Consent grant state, CTI, per-viewer Journey visibility |
| C-07 | ConsentRevoked, HighRiskRevocationRaised | Consent grant state, **immediate** Journey visibility rebuild, CTI |
| C-08 | VerificationRequested | Verification state, JCS (Identity dimension) |
| C-09 | VerificationCompleted, PersonVerificationLevelRaised | Person verification standing, VAP eligibility, JCS, CTI |
| C-10 | VerificationRejected, DecisionRecorded | Verification state, Decision history |
| C-11 | MembershipCreated, PrimaryMembershipEstablished | Membership state, roster read model, JourneyProjection (Organization), NDI |
| C-12 | PrimaryMembershipEnded, PrimaryMembershipEstablished, MembershipTransferred, DecisionRecorded | Membership state, both rosters, JourneyProjection, NDI, Decision history |
| C-13 | MembershipPromotedToPrimary, PrimaryMembershipEnded, PrimaryMembershipEstablished, DecisionRecorded | as C-12 |
| C-14 | SecondaryMembershipAdded | Membership state, JourneyProjection, **NDI network breadth** |
| C-15 | SecondaryMembershipEnded | Membership state, JourneyProjection |
| C-16 | ActivityRecorded / ActivityDiscounted | Activity read model, **VAP**, JCS (Activity dimension) |
| C-17 | PersonRecordsMerged, PersonRecordSuperseded, DecisionRecorded | Person state, JourneyProjection rebuild for both, duplicate metrics |
| C-18 | IdentityRecoveryRequested, IdentityRecoveryCompleted, DecisionRecorded | Person access state, Decision history |
| C-19 | PersonArchived, PersonLifecycleTransitioned | Person state, VAP eligibility, dormancy reporting |
| C-20 | PersonRestored, PersonLifecycleTransitioned | Person state, VAP eligibility |
| C-21 | PolicyVersionActivated, PolicyVersionSuperseded | Policy read model; future decisions cite the new version |
| C-22 | PolicyVersionRetired | Policy read model; historical decisions retain their original version |

**Journey is never a producer.** `GetJourney` reads; no command targets Journey;
`JourneyUpdated` does not exist (EDEC-01). Journey appears in this table only in
the *affected projections* column, never in the events column.

**No broker.** Publication means *appended to the event ledger*. Projection
refresh is a checkpoint, not a business fact.

---

## PART 15 — Audit Mapping

| Command | Audit requirement | Evidence retained | Decision trail | Explainability obligation |
| --- | --- | --- | --- | --- |
| C-01 | Mandatory; child-sensitive for minors | Registration context, acting role | Duplicate check outcome | Reason if refused |
| C-02 | Mandatory (anchor fact) | Issuing authority, issuance moment | — | Refusal reason if already issued |
| C-03 | Mandatory, child-sensitive | Relationship claim, evidence class | Verification linkage | Guardian informed of standing |
| C-04 | Mandatory, child-sensitive | Both links, incoming verification | **Required** | Child-interest assessment mandatory |
| C-05 | Mandatory, child-sensitive | Reason, effective date | Required where contested | Reason disclosable to both parties |
| C-06 | Mandatory, child-sensitive | Granting authority basis, verification level at grant | — | Purpose stated in plain language |
| C-07 | Mandatory; **effect time and notification dispatch both recorded** | Revocation moment, high-risk flag | Required for high-risk | Subject told what stopped and when |
| C-08 | Mandatory | Evidence class only, not artefact where avoidable | — | — |
| C-09 | Mandatory | Evidence reference, level justification | — | Level reached must be justified |
| C-10 | Mandatory | Reason code | **Required** | Actionable reason for the subject |
| C-11 | Mandatory | Membership type, consent basis | — | — |
| C-12 | Mandatory; full trail | Approval chain, both organizations | **Required** | Child-interest assessment mandatory |
| C-13 | Mandatory; recorded as transfer | Approval chain | **Required** | Child-interest assessment mandatory |
| C-14 | Mandatory | Programme kind | — | — |
| C-15 | Mandatory | End reason | — | — |
| C-16 | Mandatory | Recording actor, attribution basis | Required where discounted | Discount reason explainable to the Person |
| C-17 | Mandatory; irreversible | Match evidence, both records | **Required** | Full narrative; superseded record retained |
| C-18 | Mandatory; **refusals audited in equal detail** | Recovery evidence class | **Required** | Reason disclosable without leaking account state |
| C-19 / C-20 | Mandatory | Lifecycle reason | Required for contested cases | — |
| C-21 / C-22 | Mandatory; permanent (R5) | Council approval reference | **Required** | Rationale published to all actors |
| **All queries touching child-sensitive data** | Mandatory, **including refusals** | Actor, acting role, access basis, resource | — | Answerable via Q-09 to subject and guardian |

**Two ledgers, never merged.** The event ledger records what happened in
football; the audit ledger records who looked and who tried. Only the audit
ledger records refusals — a refusal pattern against a child's record is itself a
safeguarding signal.

---

## PART 16 — Versioning Strategy

| Change class | Definition | Contract effect |
| --- | --- | --- |
| **Major** | Removing or renaming a resource, command, query, or field; narrowing a response; changing an error code's meaning; changing an idempotency guarantee; tightening an authorization scope in a way that breaks an existing legitimate client | New major version. Both versions run concurrently for the deprecation period. |
| **Minor** | Adding a resource, command, query, optional request field, response field, warning, or error code within an existing category | Additive, backward compatible. No client change required. |
| **Patch** | Clarifying a business message, correcting documentation, tightening validation to what the contract already stated | No client change required. |
| **Deprecation** | A published, dated notice naming the successor, the removal date, and the migration path. Minimum one full phase (PRG-VIS-001) of overlap. Deprecated elements continue to behave exactly as documented until removal — never degraded. | Announced through the contract and to registered integrators. |
| **Compatibility** | Clients must tolerate additive response fields and unknown warning codes. The API rejects unknown *request* fields (P-02 discipline) while clients tolerate unknown *response* fields (robustness where it is safe). | Stated obligation on both sides. |

**Exceptions that bypass deprecation.** A change required for child protection or
lawful privacy compliance takes effect immediately under Rule 0, is recorded as a
Decision with a child-interest assessment, and is communicated rather than
negotiated. This is the only permitted breaking change without notice.

**Policy changes are not API versions.** Resolving OQ-02 or OQ-05 changes a
policy version, not the contract. Clients read the applied policy version from
responses; they never encode policy values.

---

## PART 17 — Security & Privacy

| Resource | Classification | Visibility | Consent requirement | Child protection rule |
| --- | --- | --- | --- | --- |
| Person | Confidential; Child Sensitive when minor | Player, Guardian, Organization (limited), Association (jurisdiction) | P1 platform participation; P2 for organization administration | DOB and age band drive every gate; minors are never enumerable |
| FootballIdentity | Restricted (display code) | Self, Guardian, Association; lookup authenticated and rate-limited | P1 | Display code is meaning-free; parsing it is an ADR-0002 violation |
| Guardian | Guardian Only; Child Sensitive | Guardian party, Child Protection Officer, Association | — (authority record, not a use of data) | Guardian is a consent authority, never an evidence authority |
| Consent | Restricted | Self, Guardian, Privacy Officer | self-referential | P8 structurally absent under 13; high-risk revocation immediate |
| Membership | Restricted | Self, Guardian, own Organization, Association | P2 | Organizations mutually isolated; history stays with the Person |
| Verification | Restricted; evidence Child Sensitive | Subject, Guardian, verifying officer, Association | — | Evidence artefacts never returned; only class and outcome |
| Decision | Restricted; Child Sensitive assessment | Subject, Guardian, deciding authority, Council auditor | — | Child-interest assessment mandatory and disclosable to the guardian |
| Activity | Restricted | Self, Guardian, attributing Organization; aggregate to others | P3 competition, P6 analytics | Counting rules never expose a minor's schedule to unrelated parties |
| Journey | Restricted; Child Sensitive for minors | Self and Guardian full; others filtered per viewer | P4, P5, P7 per section | Under-13 talent-visibility section does not exist |
| Organization / Association / Federation | Public name, Internal record | All authenticated actors | — | No person-level data attaches to a reference |
| Policy | Internal | All authenticated actors | — | Transparency of rules is a protection, not a risk |
| Audit | Restricted; Child Sensitive marker | Subject, Guardian, security and audit roles | — | "Who accessed my child's data" is a first-class, answerable question |
| Event | Restricted | Council auditor and platform steward only | — | No product path reads the ledger |

**Cross-cutting.** Responses are minimised per capability by default (STK-INV-001).
Consent revocation propagates to read paths immediately for high-risk purposes.
Rate limiting applies to every lookup and search surface, and the limit is a
child-protection control, not a capacity control.

---

## PART 18 — Acceptance Criteria

| Criterion | Status | Evidence |
| --- | --- | --- |
| Every business journey has at least one command or query | ✓ | Part 4 and Part 5 name J-01..J-21; read-only journeys (J-18 view journey) map to queries |
| Every domain event is produced by a command | ✓ | Part 14 covers all 9 families; `JourneyUpdated` correctly has no producer because it does not exist |
| Every query reads a projection | ✓ | Part 5 "Source projection" column; no query reads an aggregate's internals |
| No business rule defined in the API | ✓ | Part 13 traces every rule to PRD/DMN/ADR/CONSENT/MET; P-02 |
| No endpoint without a resource | ✓ | Part 6; every URI roots in a Part 3 resource |
| No command without a journey | ✓ | Part 4 per-command "Related journey" |
| No query without a projection | ✓ | Part 5 |
| No resource without a canonical object | ✓ | Part 3 |
| Command coverage of all 7 aggregates | ✓ | Person, GuardianLink, Consent, Membership, Verification, Decision, Policy; Journey read-only by decision |
| Uniform error model | ✓ | Part 8 envelope, Part 9 catalogue |
| Idempotency defined for every command | ✓ | Part 10 |
| Authorization mapped for every actor | ✓ | Part 12 |
| Audit obligation stated for every command | ✓ | Part 15 |
| Privacy by Design | ✓ | Parts 5, 8, 12, 17 |
| Child Protection by Design | ✓ | Structural absence in Parts 4, 6, 9, 12, 17 |
| Zero Trust | ✓ | P-10 evaluation order, Part 11, Part 12 |
| No code, SQL, DDL, migration, ORM, UI, or framework artefact | ✓ | Whole document |

**Carried forward, non-blocking:** OQ-02 (L1 evidence floor) and OQ-05 (CTI Phase 0
floor) remain open **policy values**. The contract is complete and correct at any
value they take; neither changes a command, query, resource, or error code.

---

## PART 19 — Traceability Matrix

```text
PRG-VIS-001  Vision, North Star, phases, NDI/JCS/CTI
   └─ PRG-STK-001  41 stakeholders, STK-INV-001..004
        └─ IDN-PRD-001  BP-01..10, FR×58, BR×32
             └─ IDN-DMN-001  7 aggregates, 38 invariants, 10 policies
                  └─ IDN-CDM-001  13 canonical objects
                       └─ IDN-EVT-001  49 events, 9 families, EDEC-01
                            └─ IDN-JRN-001  21 journeys, 12 decisions
                                 └─ IDN-ERD-001  15 entities, logical RLS
                                      └─ IDN-API-001  15 resources, 22 commands, 12 queries  ← this artefact
                                           └─ Future: OpenAPI specification
                                                └─ Future: implementation, tests, RLS policies
```

| Journey | Command(s) | Query(ies) | Resource | Event family | Entity |
| --- | --- | --- | --- | --- | --- |
| J-01 Register Person | C-01 | Q-01, Q-02 | Person | Identity | Person |
| J-02 Issue Football Identity | C-02 | Q-01 | FootballIdentity | Identity | FootballIdentity |
| J-03 Request Verification | C-08 | Q-07 | Verification | Verification | Verification |
| J-04 Claim Guardianship | C-03 | Q-05 | Guardian | Guardian | GuardianLink |
| J-05 Verify Guardianship | C-03, C-09 | Q-05, Q-07 | Guardian, Verification | Guardian, Verification | GuardianLink, Verification |
| J-06 Replace Guardian | C-04 | Q-05, Q-12 | Guardian, Decision | Guardian, Decision | GuardianLink, Decision |
| J-07 End Guardianship | C-05 | Q-05 | Guardian | Guardian | GuardianLink |
| J-08 Grant Consent | C-06 | Q-06 | Consent | Consent | Consent |
| J-09 Revoke Consent | C-07 | Q-06 | Consent | Consent | Consent |
| J-10 Join Organization | C-11 | Q-04 | Membership | Membership | Membership |
| J-11 Transfer Primary | C-12 | Q-04, Q-12 | Membership, Decision | Membership, Decision | Membership, Decision |
| J-12 Promote Secondary | C-13 | Q-04, Q-12 | Membership | Membership | Membership |
| J-13 Secondary lifecycle | C-14, C-15 | Q-04 | Membership | Membership | Membership |
| J-14 Complete/Reject Verification | C-09, C-10 | Q-07, Q-12 | Verification | Verification | Verification |
| J-15 Lifecycle Transition | C-19, C-20 | Q-01 | Person | Lifecycle | Person |
| J-16 Record Activity | C-16 | Q-08 | Activity | Activity | ActivityRecord |
| J-17 Recover Identity | C-18 | Q-01 | Person | Identity | Person |
| J-18 View Journey | *(none — read only)* | Q-03 | Journey | *(consumer)* | JourneyProjection |
| J-19 Federation Reporting | *(none)* | Q-04, Q-08, Q-11 aggregate | Federation | *(consumer)* | FederationReference |
| J-20 Resolve Duplicate | C-17 | Q-02, Q-12 | Person, Decision | Identity, Decision | Person, Decision |
| J-21 Govern Policy / Investigate | C-21, C-22 | Q-09, Q-10, Q-12 | Policy, Audit | Policy | PolicyReference, AuditLog |

---

## Council sign-off block

| Council role | Concern | Position |
| --- | --- | --- |
| Chief Enterprise Architect | Stage discipline; no implementation leakage | Satisfied |
| Enterprise Application Architect | Complete capability coverage; UI is one client | Satisfied |
| API Architect | Resource orientation, CQS, uniform errors, versioning | Satisfied |
| Domain Architect | Commands map to aggregates without reach-through | Satisfied |
| Information Architect | Canonical vocabulary preserved in resource and field naming | Satisfied |
| Security Architect | Deny-by-default, per-request role selection, audited refusals | Satisfied |
| Integration Architect | Federation/association surface bounded and caller-verified | Satisfied |
| Identity Architect | One Person, many roles; no second identity surface | Satisfied |
| Privacy Officer | Minimisation per capability; consent-gated responses | Satisfied |
| Child Protection Officer | Under-13 exposure structurally absent; Rule 0 mandatory on decision commands | Satisfied |
| AI Governance Architect | AI Agent is purpose-bound, never a decision authority; P8 isolated | Satisfied |
| Federation Representative | Aggregate-first reporting with governed person-level exception | Satisfied |
| Association Representative | Issuance, verification, transfer authority fully expressed | Satisfied |
| Enterprise Documentation Architect | Every element traceable; no orphan command, query, or endpoint | Satisfied |

**Gate G4 recommendation:** IDN-API-001 v1.0 submitted for Council review.
Next artefact after approval: **IDN-UIC-001** (UI Contract + Dashboard Shell IA,
Stage 5, G5). Implementation (Stage 6) remains blocked.
