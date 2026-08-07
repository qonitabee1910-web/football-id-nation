---
id: IDN-JRN-001
context: identity
stage: 2
status: IN_REVIEW
owner: Enterprise Business Journey Council
version: 1.0
derives_from: [PRG-VIS-001, PRG-STK-001, PRG-MET-001, CONSENT-001, IDN-PRD-001, IDN-DMN-001, IDN-CDM-001, IDN-EVT-001]
satisfied_by: [IDN-API-001, IDN-SEC-001, IDN-UIC-001, IDN-ERD-001, IDN-TEST-001]
adrs: [ADR-0001, ADR-0002, ADR-0003]
north_star_impact: "Every journey either creates, verifies, activates, or protects a Verified Active Player; no journey exists that does not move VAP, NDI, JCS or CTI."
---

# IDN-JRN-001 — Enterprise Business Journey Catalogue

**Identity Bounded Context · Version 1.0 · Stage 2 — Domain · Gate G5 (submitted)**

Business perspective only. This document contains no UI flow, wireframe, BPMN XML,
API, endpoint, schema, or code. It describes how actors reach business outcomes
through business activities, decisions, policies, and Domain Events already
approved in IDN-EVT-001.

---

## PART 1 — Executive Summary

The Identity context exists so that a child's football record is created once,
owned by the child, portable across organizations, and usable only with valid
consent. This catalogue is the behavioural view of that promise: **21 business
journeys** that together cover every actor, every approved policy, and every
business-meaningful Domain Event in IDN-EVT-001.

A journey here is a chain of business activities ending in a **business outcome**
— a fact about the real world, not a screen transition. Each step names the
responsible actor, the policy that governs it, the decision it may force, and the
Domain Event it publishes. Nothing is state-changing unless an event says so.

Three structural facts shape the whole catalogue:

1. **Journey (the read model) is never a source of truth.** Journeys in this
   document produce events; the Journey projection consumes them. Constitution #8.
2. **The Football ID is issued once and never re-issued.** Recovery, merge, and
   restore journeys all preserve the identifier. Constitution #2, #3, ADR-0002.
3. **Membership is typed.** Exactly one ACTIVE Primary, 0..N Secondary. Only the
   Primary moves through a Transfer journey. ADR-0003, Constitution #7, #9.

Where a journey touches a child, the Child Protection Officer holds a standing
veto: any step that cannot be justified as being in the child's interest is not
merely denied — it is **absent** from the journey (STK-INV-004).

Two Council-owned values still carry forward and bind to policy *values*, not to
journey structure: **OQ-02** (minimum L1 verification evidence) and **OQ-05**
(CTI Phase 0 floor).

---

## PART 2 — Journey Principles

| # | Principle | Statement |
| --- | --- | --- |
| JP-01 | **Business Outcome Driven** | A journey ends in a stated change to the real world (a person is verified, a membership is active, a consent is withdrawn). "The user saw a page" is not an outcome. |
| JP-02 | **Event Driven** | Every state change inside a journey is published as an approved business Domain Event. No silent mutation, no technical event (Constitution #8, IDN-EVT-001 PART 2). |
| JP-03 | **Policy Driven** | Thresholds, windows, evidence levels, and expiries are read from versioned policies at the moment of decision, and the `policy_id@version` is recorded with the outcome. No number is hard-coded in a journey. |
| JP-04 | **Actor Centric** | Every step names exactly one responsible actor with the authority to perform it. "The platform decides" is only valid where `System` is a declared actor executing a policy. |
| JP-05 | **Traceable** | Every journey traces upward to a PRD requirement and a business problem, and downward to the events, policies, and decisions it uses. No orphan journeys (PART 19). |
| JP-06 | **Explainable** | Any decision affecting a person can be re-stated in plain language: what was decided, on what evidence, under which policy version, by whom. Constitution #10. |
| JP-07 | **Child First** | Where actors conflict inside a journey, the branch protecting the child Player is taken, and the trade-off is recorded. Rule 0 overrides JP-01..06. |

Derived operating rules:

- **No journey may proceed past a step whose consent precondition is unmet** (PART 17, JINV-06).
- **A journey may be abandoned; it may not be half-committed.** Partial progress is
  represented by lifecycle state, not by an implied outcome.
- **A refusal is a legitimate outcome.** Failure paths are catalogued in PART 12 and
  carry the same audit weight as success paths.

---

## PART 3 — Actor Catalogue

| Actor | Business Role | Responsibilities | Authority | Restrictions |
| --- | --- | --- | --- | --- |
| **Player (child)** | Subject and owner of the journey | Participates; confirms own data as age permits; requests own record | Owns the Journey record; may request access, correction, and portability at any age | Cannot grant own consent while a minor; cannot alter assessments or match records (STK-INV-002) |
| **Player (adult)** | Subject, owner, and consent authority | As above, plus own consent | Full consent authority on reaching majority; guardian authority ends automatically | Cannot alter evidence records; cannot self-verify |
| **Guardian** | Consent authority for a minor | Grants, refuses, revokes consent; approves membership and transfer; annotates records | Consent Authority for the linked child; approval right over Primary and Secondary membership | **Not** Evidence Authority — may never mutate assessments, match history, referee reports, or statistics (STK-INV-002, STK-INV-003) |
| **Coach** | Records football activity and development | Submits attendance and activity attestations; records development notes within assignment scope | Assignment-scoped read/write on assigned players only | No access outside assignment; no consent authority; no verification authority |
| **Club / SSB Administrator** | Operates the organization's membership | Proposes membership; maintains roster; submits organizational evidence; closes memberships on departure | May propose, never unilaterally confirm, a membership involving a minor | Cannot create identities; cannot approve their own transfer requests; cannot see data outside their memberships |
| **Association Officer** | Competition-level governance (Askab / Asprov) | Adjudicates transfer disputes and eligibility; ratifies verification at competition level | Decision Owner for contested Primary Membership transfers | Cannot alter Football ID; cannot grant consent on behalf of a guardian |
| **Federation Officer** | National governance (PSSI) | Consumes verified identity as reference; issues federation-side identifiers | Reference-only interaction — external identity is a reference, never a source (Constitution #11) | Cannot overwrite platform identity; cannot force merge |
| **System** | Policy executor and projector | Applies versioned policies, evaluates activity, projects the Journey read model, raises expiry and conflict signals | Acts only where a policy explicitly delegates the action | Cannot make a discretionary decision; every automated outcome names its policy version and is reversible by a human Decision Owner |
| **Auditor** | Independent assurance | Reviews decision trails, consent validity, and high-risk revocations | Read-only across decision and consent history | No write authority anywhere; cannot see raw child data beyond what the audit purpose requires (STK-INV-001) |
| **Child Protection Officer** | Standing safeguarding authority | Reviews high-risk revocations, safeguarding suspensions, structural exception requests | Veto over any journey step affecting a child; may suspend membership or a role immediately | Must record reasoning; suspension is reviewable |
| **Privacy Officer** | Consent and retention assurance | Owns consent purpose definitions, retention categories, CTI reporting | Halt authority when CTI falls below the Phase floor | Cannot grant consent; cannot extend retention beyond category |

Actor coverage is verified in PART 18: every actor above is the Primary Actor of at
least one journey.

---

## PART 4 — Journey Catalogue

| ID | Journey | Primary Actor | Family | Terminal Outcome |
| --- | --- | --- | --- | --- |
| JRN-01 | Register Person (Player) | Guardian / adult Player | Identity | Person exists, `REGISTERED` |
| JRN-02 | Register Guardian | Guardian | Identity | Guardian person exists, unverified |
| JRN-03 | Link Guardian to Player | Guardian | Guardian | Guardian link claimed |
| JRN-04 | Verify Guardian Link | Verification Authority | Verification | Link verified at level L1..L3 |
| JRN-05 | Verify Player | Verification Authority | Verification | Player `VERIFIED` |
| JRN-06 | Issue Football ID | System | Identity | Opaque, immutable Football ID issued |
| JRN-07 | Grant Consent | Guardian / adult Player | Consent | Purpose-scoped consent active |
| JRN-08 | Revoke Consent | Guardian / adult Player | Consent | Purpose withdrawn, effective immediately |
| JRN-09 | Handle High-Risk Revocation | Child Protection Officer | Consent | Downstream use stopped and reviewed |
| JRN-10 | Join Organization (Primary) | Club Administrator | Membership | Exactly one ACTIVE Primary |
| JRN-11 | Add Secondary Membership | Club Administrator | Membership | Secondary active, no eligibility conferred |
| JRN-12 | Remove Secondary Membership | Club Administrator | Membership | Secondary ended, history retained |
| JRN-13 | Transfer Primary Membership | Club Administrator (receiving) | Membership | Primary moved with full trail |
| JRN-14 | Promote Secondary to Primary | Club Administrator | Membership | Executed **as** a transfer (INV-19) |
| JRN-15 | Record Activity | Coach | Activity | Attested activity counted or rejected |
| JRN-16 | Evaluate Activity Status | System | Activity | Lifecycle moves ACTIVE ↔ TEMPORARILY_INACTIVE |
| JRN-17 | Recover Identity | Player / Guardian | Identity | Access restored, same Football ID |
| JRN-18 | Resolve Duplicate Identity (Merge) | Data Steward | Identity | Single surviving identity, history preserved |
| JRN-19 | Archive Identity | Privacy Officer | Lifecycle | Record archived, retention clock set |
| JRN-20 | Restore Identity | Privacy Officer | Lifecycle | Record reinstated, same Football ID |
| JRN-21 | Guardian Authority Transition (majority / change) | System / Association Officer | Guardian | Consent authority moves lawfully |

Additional journeys beyond the mandated list — JRN-09, JRN-14, JRN-16, JRN-21 —
were added because approved events (`HighRiskRevocationRaised`,
`MembershipPromotedToPrimary`, `PlayerTemporarilyInactivated`,
`GuardianAuthorityEnded`) would otherwise have no producing journey, which PART 18
forbids.

---

## PART 5 — Journey Definitions

Each definition carries: Business Goal · Primary Actor · Supporting Actors ·
Trigger · Preconditions · Success Outcome · Failure Outcome · Completion Criteria.

### JRN-01 · Register Person (Player)
- **Goal.** Bring a child into the ecosystem as a person, before any club claims them.
- **Primary actor.** Guardian (minor) or the Player themselves (adult).
- **Supporting.** System, Club Administrator (may initiate an invitation only).
- **Trigger.** A guardian decides to register a child, or a club invites a family.
- **Preconditions.** Minimum data set available; no confirmed duplicate on the declared identity attributes.
- **Success.** A `Person` exists in `REGISTERED` state, owned by the child.
- **Failure.** Registration refused as a suspected duplicate → JRN-18, or abandoned.
- **Completion.** `PersonRegistered` published and the person is addressable.

### JRN-02 · Register Guardian
- **Goal.** Establish the adult who will hold consent authority.
- **Primary actor.** Guardian. **Supporting.** System.
- **Trigger.** Guardian self-registers or accepts an invitation.
- **Preconditions.** Adult; contactable.
- **Success.** Guardian person exists; no authority yet.
- **Failure.** Refused (age or identity doubt) → guardian cannot proceed to JRN-03.
- **Completion.** `PersonRegistered` (+ `RoleAssigned` for the guardian role).

### JRN-03 · Link Guardian to Player
- **Goal.** Claim the guardian relationship over a named child.
- **Primary actor.** Guardian. **Supporting.** Club Administrator (may witness), System.
- **Trigger.** Guardian claims the child, or the child's registration names them.
- **Preconditions.** Both persons exist; child is a minor; no conflicting verified link.
- **Success.** A claimed, unverified `GuardianLink` exists.
- **Failure.** `GuardianConflictRaised` where another verified guardian disputes it → EXC-02.
- **Completion.** `GuardianLinked` published.

### JRN-04 · Verify Guardian Link
- **Goal.** Raise the link from claimed to trusted so consent becomes valid.
- **Primary actor.** Verification Authority (platform-side, under GuardianPolicy).
- **Supporting.** Guardian, Club Administrator, Association Officer, Auditor.
- **Trigger.** Evidence submitted, or an event requires a trusted guardian.
- **Preconditions.** `GuardianLinked` exists; evidence meets the level being claimed.
- **Success.** Link verified at L1, L2, or L3; consent capabilities unlock by level.
- **Failure.** `VerificationRejected` — link stays claimed; consent stays invalid.
- **Completion.** `GuardianLinkVerified` with level and `policy_id@version`.

### JRN-05 · Verify Player
- **Goal.** Establish that the record describes a real child of the stated age.
- **Primary actor.** Verification Authority. **Supporting.** Guardian, Club Administrator, Association Officer.
- **Trigger.** Verification requested at registration, at competition entry, or on re-check.
- **Preconditions.** Person `REGISTERED`; guardian link verified for a minor; consent P-scope for evidence handling active.
- **Success.** Player `VERIFIED`; counts toward Verified Players.
- **Failure.** Rejected or downgraded; player remains `REGISTERED`, still owns their record.
- **Completion.** `PlayerVerified` + `VerificationCompleted`.

### JRN-06 · Issue Football ID
- **Goal.** Give the person one opaque, immutable, lifelong identifier.
- **Primary actor.** System (policy-executed). **Supporting.** none — no human discretion.
- **Trigger.** Person registration accepted.
- **Preconditions.** Person exists; no Football ID already issued to this person.
- **Success.** A fully opaque ID and display code exist and never change (ADR-0002).
- **Failure.** Not possible by design; a collision is a defect, never a business branch.
- **Completion.** `FootballIdentityIssued`.

### JRN-07 · Grant Consent
- **Goal.** Make a specific purpose lawful for a specific scope and period.
- **Primary actor.** Guardian (minor) or Player (adult). **Supporting.** Privacy Officer, System.
- **Trigger.** A capability requires a purpose that is not yet consented.
- **Preconditions.** Guardian link verified to the level the purpose demands; purpose permitted for the child's age band (P8 prohibited under 13).
- **Success.** Purpose-scoped consent active with an expiry; CTI rises.
- **Failure.** `ConsentRefused` — the capability is simply unavailable; no degradation of other purposes.
- **Completion.** `ConsentGranted` with purpose, scope, expiry, and policy version.

### JRN-08 · Revoke Consent
- **Goal.** Stop a lawful use at the consent holder's discretion, immediately.
- **Primary actor.** Guardian or adult Player. **Supporting.** Privacy Officer, System, Auditor.
- **Trigger.** Holder withdraws; or `ConsentExpired` fires.
- **Preconditions.** An active consent for that purpose exists.
- **Success.** Purpose inactive from the moment of revocation; dependent capabilities close.
- **Failure.** None — revocation cannot be refused. It may be *escalated* (JRN-09).
- **Completion.** `ConsentRevoked` (or `AITrainingConsentWithdrawn` for P8, with the removal SLA started).

### JRN-09 · Handle High-Risk Revocation
- **Goal.** Ensure a revocation with safeguarding or downstream impact is stopped, notified, audited, and reviewed.
- **Primary actor.** Child Protection Officer. **Supporting.** Privacy Officer, Auditor, System.
- **Trigger.** `HighRiskRevocationRaised` during JRN-08.
- **Preconditions.** Revocation already effective (effect precedes review — Rule 0).
- **Success.** Downstream consumers notified, review closed with a recorded decision.
- **Failure.** Review overdue → escalation to the Council; the block stays in place.
- **Completion.** `DecisionRecorded` closing the review queue item.

### JRN-10 · Join Organization (Primary Membership)
- **Goal.** Give the player an official club so eligibility and roster exist.
- **Primary actor.** Club Administrator. **Supporting.** Guardian (approves), Association Officer, System.
- **Trigger.** Club proposes membership; family accepts.
- **Preconditions.** Player exists; guardian approval obtained; **no other ACTIVE Primary** (INV-18); no active membership of any type with the same organization.
- **Success.** One ACTIVE Primary Membership; eligibility derivable.
- **Failure.** Conflict with an existing Primary → this is a Transfer (JRN-13), not a join.
- **Completion.** `MembershipCreated` + `MembershipStarted` + `PrimaryMembershipChanged`.

### JRN-11 · Add Secondary Membership
- **Goal.** Record camps, academies, and training centres without touching eligibility.
- **Primary actor.** Club / programme Administrator. **Supporting.** Guardian, System.
- **Trigger.** The child joins a non-exclusive programme.
- **Preconditions.** Guardian approval; no active membership of any type with that organization.
- **Success.** Secondary Membership active; NDI portability may rise; **no** eligibility change.
- **Failure.** Refused where the organization already holds a membership for that player.
- **Completion.** `MembershipCreated` + `SecondaryMembershipAdded`.

### JRN-12 · Remove Secondary Membership
- **Goal.** End a non-exclusive programme cleanly while keeping the history.
- **Primary actor.** Club Administrator or Guardian. **Supporting.** System.
- **Trigger.** Programme ends or the family withdraws.
- **Preconditions.** An active Secondary exists.
- **Success.** Membership ended; access ends at once; Journey retains the period (INV-21).
- **Failure.** None; ending is always permitted.
- **Completion.** `MembershipEnded` + `SecondaryMembershipRemoved`.

### JRN-13 · Transfer Primary Membership
- **Goal.** Move the official club as an auditable business event, never an edit.
- **Primary actor.** Receiving Club Administrator. **Supporting.** Releasing Club, Guardian, Association Officer, Auditor.
- **Trigger.** Family and receiving club agree to move.
- **Preconditions.** ACTIVE Primary exists; guardian approves; transfer window open per `TransferPolicy`; no unresolved safeguarding block.
- **Success.** Old Primary ended, new Primary active, one decision record explaining it.
- **Failure.** Rejected (window, dispute, safeguarding) → EXC-05; the original Primary stands.
- **Completion.** `PlayerTransferred` + `MembershipTransferred` + `PrimaryMembershipChanged` + `IdentityDecisionRecorded`.

### JRN-14 · Promote Secondary to Primary
- **Goal.** Turn an existing non-exclusive relationship into the official one, without pretending it is an edit.
- **Primary actor.** Club Administrator. **Supporting.** Guardian, Association Officer.
- **Trigger.** The programme becomes the child's club.
- **Preconditions.** Active Secondary with that organization; transfer conditions of JRN-13 satisfied in full (INV-19).
- **Success.** Prior Primary ended; the promoted membership is the Primary.
- **Failure.** Treated exactly as a rejected transfer.
- **Completion.** `MembershipPromotedToPrimary` + `PlayerTransferred` + `PrimaryMembershipChanged`.

### JRN-15 · Record Activity
- **Goal.** Capture attested football activity so participation is real, not claimed.
- **Primary actor.** Coach. **Supporting.** Club Administrator, System, Auditor.
- **Trigger.** A training session, match, or programme activity occurs.
- **Preconditions.** Coach assignment covers the player; activity consent scope active; the attesting adult is accountable and distinct from the beneficiary organization's gaming pattern.
- **Success.** Activity recorded and eligible for the ActivityPolicy count.
- **Failure.** `ActivityRejected` under anti-gaming rules; the submitter is told why.
- **Completion.** `ActivityRecorded` (or `ActivityRejected`) with the policy version.

### JRN-16 · Evaluate Activity Status
- **Goal.** Keep the lifecycle honest: active means recently, verifiably playing.
- **Primary actor.** System under `ActivityPolicy`. **Supporting.** Privacy Officer (reporting), Auditor.
- **Trigger.** Scheduled evaluation, or a qualifying `ActivityRecorded` / `ActivityRetracted`.
- **Preconditions.** Player `VERIFIED`; a policy version is in force.
- **Success.** State reflects reality: ACTIVE, TEMPORARILY_INACTIVE, or INACTIVE; VAP recomputed.
- **Failure.** Evaluation cannot run without an active policy version — a halt, not a guess.
- **Completion.** `PlayerActivated` / `PlayerTemporarilyInactivated` / `PlayerInactivated` + `LifecycleStateChanged`.

### JRN-17 · Recover Identity
- **Goal.** Restore access to the *same* human without ever re-issuing the Football ID.
- **Primary actor.** Player or Guardian. **Supporting.** Verification Authority, Auditor.
- **Trigger.** Lost access to the account bound to the person.
- **Preconditions.** Assurance evidence proportional to the sensitivity of what is recovered (`RecoveryPolicy`).
- **Success.** Access restored; Football ID unchanged (INV-06).
- **Failure.** Recovery refused → EXC-07; never resolved by creating a second identity.
- **Completion.** `IdentityRecovered` + `DecisionRecorded`.

### JRN-18 · Resolve Duplicate Identity (Merge)
- **Goal.** One human, one Football ID — with no lost history.
- **Primary actor.** Data Steward (platform). **Supporting.** Guardian, Club Administrator, Association Officer, Auditor.
- **Trigger.** `DuplicateSuspected` from the duplicate-resolution service or a human report.
- **Preconditions.** Evidence meets `MergePolicy`; guardian consulted where a minor is involved.
- **Success.** One surviving Football ID; the superseded ID is retired, never reused; all journey history reattached.
- **Failure.** Merge refused as unsafe — both records remain, flagged, and re-reviewed.
- **Completion.** `IdentityMerged` + `IdentityDecisionRecorded`.

### JRN-19 · Archive Identity
- **Goal.** Honour withdrawal or retention rules without destroying the child's own history.
- **Primary actor.** Privacy Officer. **Supporting.** Guardian, Child Protection Officer, Auditor.
- **Trigger.** Withdrawal request, retention trigger, or prolonged inactivity per policy.
- **Preconditions.** No active safeguarding hold requiring the record to remain live.
- **Success.** Record archived; visibility closed; the player keeps access to their own journey.
- **Failure.** Archive blocked by a safeguarding or legal hold, with the reason recorded.
- **Completion.** `PlayerArchived` + `LifecycleStateChanged`.

### JRN-20 · Restore Identity
- **Goal.** Bring an archived person back with continuity intact.
- **Primary actor.** Privacy Officer. **Supporting.** Guardian, Verification Authority.
- **Trigger.** The person returns to football, or an archive was applied in error.
- **Preconditions.** Retention period not elapsed; identity re-assured per `RecoveryPolicy`.
- **Success.** Person live again on the **same** Football ID; consents must be re-granted, never revived silently.
- **Failure.** Restore refused after retention elapsed → a new registration, explicitly not a merge.
- **Completion.** `LifecycleStateChanged` (+ `PlayerActivated` once activity resumes).

### JRN-21 · Guardian Authority Transition
- **Goal.** Move consent authority lawfully when a child reaches majority or guardianship changes.
- **Primary actor.** System (majority) or Association Officer / Child Protection Officer (change).
- **Supporting.** Guardian, Player, Auditor.
- **Trigger.** Age of majority reached, guardian replaced, or guardian removed.
- **Preconditions.** For a change: evidence per `GuardianPolicy`; for majority: date of birth verified.
- **Success.** Authority sits with the correct person; prior consents are re-confirmed by the new authority, not inherited blindly.
- **Failure.** Conflict → EXC-02, decided by the Child Protection Officer.
- **Completion.** `GuardianAuthorityEnded` (+ `GuardianReplaced` / `GuardianRemoved`).

---

## PART 6 — Business Flow

Format per step: *Step · Business Activity · Responsible Actor · Applied Policy ·
Business Decision · Produced Domain Event*. Steps that produce no event change no
state.

### JRN-01 Register Person
| # | Activity | Actor | Policy | Decision | Event |
| --- | --- | --- | --- | --- | --- |
| 1 | Capture the minimum data set | Guardian | PrivacyPolicy | — | — |
| 2 | Screen for an existing person | System | MergePolicy | DEC-DUP | `DuplicateSuspected` (if matched) |
| 3 | Accept the person | System | PrivacyPolicy | DEC-REG | `PersonRegistered` |
| 4 | Assign the player role | System | — | — | `RoleAssigned` |
| 5 | Hand off to JRN-06 | System | — | — | (see JRN-06) |

### JRN-03 + JRN-04 Guardian Link and Verification
| # | Activity | Actor | Policy | Decision | Event |
| --- | --- | --- | --- | --- | --- |
| 1 | Claim the relationship | Guardian | GuardianPolicy | — | `GuardianLinked` |
| 2 | Detect a competing verified link | System | GuardianPolicy | DEC-GRD | `GuardianConflictRaised` |
| 3 | Submit relationship evidence | Guardian | VerificationPolicy | — | `VerificationRequested` |
| 4 | Assess evidence against the claimed level | Verification Authority | VerificationPolicy (OQ-02) | DEC-VER | `GuardianLinkVerified` or `VerificationRejected` |
| 5 | Unlock consent capability by level | System | ConsentPolicy | — | — |

### JRN-05 Verify Player
| # | Activity | Actor | Policy | Decision | Event |
| --- | --- | --- | --- | --- | --- |
| 1 | Request verification | Guardian / Club Admin | VerificationPolicy | — | `VerificationRequested` |
| 2 | Check consent covers evidence handling | System | ConsentPolicy | — | — |
| 3 | Assess age and identity evidence | Verification Authority | VerificationPolicy | DEC-VER | `VerificationCompleted` |
| 4 | Confirm verified status | System | — | DEC-VER | `PlayerVerified` + `LifecycleStateChanged` |
| 5 | Downgrade on later doubt | Verification Authority | VerificationPolicy | DEC-VER | `VerificationDowngraded` |

### JRN-07 / JRN-08 / JRN-09 Consent
| # | Activity | Actor | Policy | Decision | Event |
| --- | --- | --- | --- | --- | --- |
| 1 | Present the purpose in plain language | System | ConsentPolicy | — | — |
| 2 | Check age band and required verification level | System | ConsentPolicy, GuardianPolicy | DEC-CON | — |
| 3 | Decide | Guardian / adult Player | ConsentPolicy | DEC-CON | `ConsentGranted` or `ConsentRefused` |
| 4 | Withdraw | Guardian / adult Player | ConsentPolicy | — | `ConsentRevoked` / `AITrainingConsentWithdrawn` |
| 5 | Classify the withdrawal | System | PrivacyPolicy | DEC-HRR | `HighRiskRevocationRaised` (if high risk) |
| 6 | Suspend a purpose pending review | Privacy Officer | ConsentPolicy | DEC-HRR | `ConsentPurposeSuspended` |
| 7 | Close the review | Child Protection Officer | ReportingPolicy | DEC-HRR | `DecisionRecorded` |
| 8 | Expire on term | System | ConsentPolicy | — | `ConsentExpired` |

### JRN-10 / JRN-11 / JRN-12 Membership
| # | Activity | Actor | Policy | Decision | Event |
| --- | --- | --- | --- | --- | --- |
| 1 | Propose membership with type | Club Administrator | TransferPolicy | — | — |
| 2 | Obtain guardian approval | Guardian | GuardianPolicy | DEC-MEM | — |
| 3 | Test the one-active-Primary invariant | System | TransferPolicy | DEC-MEM | — (routes to JRN-13 if breached) |
| 4 | Create the membership | System | TransferPolicy | DEC-MEM | `MembershipCreated` |
| 5 | Start it | System | — | — | `MembershipStarted` (+ `PrimaryMembershipChanged` or `SecondaryMembershipAdded`) |
| 6 | End it | Club Administrator / Guardian | TransferPolicy | DEC-MEM | `MembershipEnded` (+ `SecondaryMembershipRemoved`) |
| 7 | Suspend for safeguarding | Child Protection Officer | ReportingPolicy | DEC-CPO | `MembershipSuspended` |

### JRN-13 / JRN-14 Transfer
| # | Activity | Actor | Policy | Decision | Event |
| --- | --- | --- | --- | --- | --- |
| 1 | Request the move | Receiving Club Administrator | TransferPolicy | — | — |
| 2 | Approve as consent authority | Guardian | GuardianPolicy | DEC-TRF | — |
| 3 | Check window, disputes, safeguarding holds | System | TransferPolicy | DEC-TRF | — |
| 4 | Adjudicate a dispute | Association Officer | TransferPolicy | DEC-TRF | `IdentityDecisionRecorded` |
| 5 | End the releasing Primary | System | TransferPolicy | — | `MembershipEnded` |
| 6 | Start the receiving Primary | System | TransferPolicy | — | `MembershipStarted` + `MembershipTransferred` + `PrimaryMembershipChanged` |
| 7 | Publish the business fact | System | — | — | `PlayerTransferred` (+ `MembershipPromotedToPrimary` for JRN-14) |
| 8 | Record the explanation | System | ReportingPolicy | — | `DecisionRecorded` |

### JRN-15 / JRN-16 Activity
| # | Activity | Actor | Policy | Decision | Event |
| --- | --- | --- | --- | --- | --- |
| 1 | Attest the session | Coach | ActivityPolicy | — | — |
| 2 | Check assignment scope and consent | System | ConsentPolicy | DEC-ACT | — |
| 3 | Apply anti-gaming rules | System | ActivityPolicy | DEC-ACT | `ActivityRecorded` or `ActivityRejected` |
| 4 | Retract an erroneous record | Coach / Club Administrator | ActivityPolicy | DEC-ACT | `ActivityRetracted` |
| 5 | Evaluate the activity window | System | ActivityPolicy | DEC-ACT | `PlayerActivated` / `PlayerTemporarilyInactivated` / `PlayerInactivated` |
| 6 | Publish the lifecycle move | System | — | — | `LifecycleStateChanged` |

### JRN-17 / JRN-18 Recovery and Merge
| # | Activity | Actor | Policy | Decision | Event |
| --- | --- | --- | --- | --- | --- |
| 1 | Claim loss of access | Player / Guardian | RecoveryPolicy | — | — |
| 2 | Scale assurance to sensitivity | System | RecoveryPolicy | DEC-REC | `VerificationRequested` |
| 3 | Restore access on the same identity | Verification Authority | RecoveryPolicy | DEC-REC | `IdentityRecovered` |
| 4 | Detect or receive a duplicate report | System / any actor | MergePolicy | DEC-DUP | `DuplicateSuspected` |
| 5 | Assemble merge evidence and consult the guardian | Data Steward | MergePolicy, GuardianPolicy | DEC-DUP | — |
| 6 | Merge, retiring the superseded ID | Data Steward | MergePolicy | DEC-DUP | `IdentityMerged` |
| 7 | Record the reasoning | System | ReportingPolicy | — | `IdentityDecisionRecorded` |

### JRN-19 / JRN-20 / JRN-21 Lifecycle and Authority
| # | Activity | Actor | Policy | Decision | Event |
| --- | --- | --- | --- | --- | --- |
| 1 | Trigger archive (request, retention, dormancy) | Privacy Officer / System | PrivacyPolicy | DEC-ARC | — |
| 2 | Check safeguarding and legal holds | Child Protection Officer | ReportingPolicy | DEC-ARC | — |
| 3 | Archive | System | PrivacyPolicy | DEC-ARC | `PlayerArchived` + `LifecycleStateChanged` |
| 4 | Restore within retention | Privacy Officer | RecoveryPolicy | DEC-ARC | `LifecycleStateChanged` |
| 5 | Reach majority | System | GuardianPolicy | DEC-GRD | `GuardianAuthorityEnded` |
| 6 | Replace or remove a guardian | Association / Child Protection Officer | GuardianPolicy | DEC-GRD | `GuardianReplaced` / `GuardianRemoved` |
| 7 | Re-confirm consents under the new authority | New authority | ConsentPolicy | DEC-CON | `ConsentGranted` / `ConsentRevoked` |

---

## PART 7 — Decision Catalogue

| ID | Decision | Trigger | Owner | Required Evidence | Outcomes | ADR | Explainability |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DEC-REG | Accept a person into the ecosystem | Registration submitted | System (policy) | Minimum data set; duplicate screen clear | Accepted · Held as suspected duplicate | ADR-0002 | State which attributes were screened and the screen outcome |
| DEC-VER | Assign or change a verification level | Evidence submitted or doubt raised | Verification Authority | Evidence set per level (OQ-02 pending for L1) | L1 · L2 · L3 · Rejected · Downgraded | ADR-0002 | Name the level, the evidence class accepted, and the policy version |
| DEC-GRD | Establish or move guardian authority | Link claim, conflict, majority, guardianship change | Child Protection Officer (contested) / System (majority) | Relationship evidence; official documentation for a change | Verified · Rejected · Replaced · Ended | — | State who holds authority now and on what basis |
| DEC-CON | Grant, refuse, or suspend a consent purpose | Purpose requested or reviewed | Guardian / adult Player (grant) · Privacy Officer (suspend) | Verified guardian link at the required level; age band check | Granted · Refused · Suspended · Revoked · Expired | — | State the purpose, scope, expiry, and the age-band rule applied |
| DEC-HRR | Classify and close a high-risk revocation | `ConsentRevoked` with downstream impact | Child Protection Officer | Downstream usage inventory; notification record | Closed · Escalated · Purpose suspended | — | State what was stopped, when, and who was told |
| DEC-MEM | Create, end, or suspend a membership | Membership proposed or ended | Club Administrator + Guardian; Child Protection Officer for suspension | Guardian approval; type declared; invariant check | Created · Refused · Ended · Suspended | ADR-0003 | State the type, the organization, and the invariant result |
| DEC-TRF | Approve or reject a Primary Membership move | Transfer or promotion requested | Association Officer (contested), else Club + Guardian | Guardian approval; window status; no safeguarding hold | Approved · Rejected · Deferred to window | ADR-0003 | State the releasing and receiving clubs, the window, and the approver |
| DEC-ACT | Count or reject an attested activity | Activity submitted | System under `ActivityPolicy` | Attesting adult; assignment scope; anti-gaming checks | Counted · Rejected · Retracted | — | State which anti-gaming rule applied and the policy version |
| DEC-DUP | Merge or keep separate two identities | Duplicate suspected | Data Steward | Match evidence per `MergePolicy`; guardian consultation for minors | Merged · Kept separate · Deferred | ADR-0002 | State which ID survived, which was retired, and why |
| DEC-REC | Grant or refuse identity recovery | Access loss claimed | Verification Authority | Assurance proportional to what is recovered | Recovered · Refused · Escalated | ADR-0002 | State the assurance level met and that the Football ID was unchanged |
| DEC-ARC | Archive or restore a record | Withdrawal, retention, dormancy, return | Privacy Officer | Hold check; retention category; retention clock | Archived · Blocked by hold · Restored · Retention elapsed | — | State the retention category and the hold status |
| DEC-CPO | Exercise the child-interest override | Any step conflicting with the child's interest | Child Protection Officer | Safeguarding rationale | Step blocked · Membership suspended · Role revoked · Structural exception refused | — | Rule 0 invoked explicitly, with the competing interests named |

Every decision above is recorded through the `Decision` aggregate and reaches
analytics as `DecisionRecorded` / `IdentityDecisionRecorded`; corrections use
`DecisionCorrectionRecorded` and never overwrite the original.

---

## PART 8 — Policy Application Matrix

Legend: ● applied and decisive · ○ consulted · — not applicable.

| Journey | Consent | Verification | Membership (Transfer) | Activity | Reporting | Guardian |
| --- | --- | --- | --- | --- | --- | --- |
| JRN-01 Register Person | ○ | ○ | — | — | ○ | ○ |
| JRN-02 Register Guardian | — | ○ | — | — | — | ● |
| JRN-03 Link Guardian | ○ | ○ | — | — | — | ● |
| JRN-04 Verify Guardian Link | ● | ● | — | — | ○ | ● |
| JRN-05 Verify Player | ● | ● | ○ | — | ○ | ● |
| JRN-06 Issue Football ID | — | — | — | — | ○ | — |
| JRN-07 Grant Consent | ● | ● | — | — | ○ | ● |
| JRN-08 Revoke Consent | ● | — | ○ | ○ | ● | ● |
| JRN-09 High-Risk Revocation | ● | — | ○ | — | ● | ● |
| JRN-10 Join Organization | ○ | ○ | ● | — | ○ | ● |
| JRN-11 Add Secondary | ○ | — | ● | — | ○ | ● |
| JRN-12 Remove Secondary | — | — | ● | ○ | ○ | ○ |
| JRN-13 Transfer Primary | ○ | ○ | ● | ○ | ● | ● |
| JRN-14 Promote Secondary | ○ | ○ | ● | ○ | ● | ● |
| JRN-15 Record Activity | ● | ○ | ○ | ● | ○ | ○ |
| JRN-16 Evaluate Activity Status | — | ○ | ○ | ● | ● | — |
| JRN-17 Recover Identity | ○ | ● | — | — | ○ | ● |
| JRN-18 Merge Duplicate | ○ | ● | ○ | ○ | ● | ● |
| JRN-19 Archive Identity | ● | — | ○ | ○ | ● | ● |
| JRN-20 Restore Identity | ● | ● | ○ | ○ | ● | ● |
| JRN-21 Guardian Authority Transition | ● | ● | — | — | ● | ● |

`PrivacyPolicy`, `MergePolicy`, `RecoveryPolicy`, and `JCS Weighting Policy` are the
four additional IDN-DMN-001 policies not in the mandated six; they are applied in
JRN-01/19 (Privacy), JRN-18 (Merge), JRN-17/20 (Recovery), and JRN-16 (JCS
weighting) respectively, so all ten approved policies have a journey.

Policy version discipline: every ● cell records `policy_id@version` on the
resulting event and decision. A journey may not proceed if no version of a
decisive policy is in force.

---

## PART 9 — Domain Event Mapping

| Journey | Produced Events | Consumed Events |
| --- | --- | --- |
| JRN-01 | `PersonRegistered`, `RoleAssigned`, `DuplicateSuspected` | — |
| JRN-02 | `PersonRegistered`, `RoleAssigned` | — |
| JRN-03 | `GuardianLinked`, `GuardianConflictRaised` | `PersonRegistered` |
| JRN-04 | `VerificationRequested`, `GuardianLinkVerified`, `VerificationRejected` | `GuardianLinked` |
| JRN-05 | `VerificationRequested`, `VerificationCompleted`, `PlayerVerified`, `VerificationDowngraded`, `VerificationUpgraded`, `LifecycleStateChanged` | `GuardianLinkVerified`, `ConsentGranted` |
| JRN-06 | `FootballIdentityIssued` | `PersonRegistered` |
| JRN-07 | `ConsentGranted`, `ConsentRefused` | `GuardianLinkVerified`, `PersonRegistered` |
| JRN-08 | `ConsentRevoked`, `AITrainingConsentWithdrawn`, `ConsentExpired` | `ConsentGranted` |
| JRN-09 | `HighRiskRevocationRaised`, `ConsentPurposeSuspended`, `DecisionRecorded` | `ConsentRevoked` |
| JRN-10 | `MembershipCreated`, `MembershipStarted`, `PrimaryMembershipChanged` | `PlayerVerified`, `ConsentGranted` |
| JRN-11 | `MembershipCreated`, `SecondaryMembershipAdded`, `MembershipStarted` | `PlayerVerified` |
| JRN-12 | `MembershipEnded`, `SecondaryMembershipRemoved` | `MembershipStarted` |
| JRN-13 | `MembershipEnded`, `MembershipStarted`, `MembershipTransferred`, `PlayerTransferred`, `PrimaryMembershipChanged`, `IdentityDecisionRecorded`, `DecisionRecorded` | `MembershipStarted`, `GuardianLinkVerified` |
| JRN-14 | `MembershipPromotedToPrimary`, plus the full JRN-13 set | `SecondaryMembershipAdded` |
| JRN-15 | `ActivityRecorded`, `ActivityRejected`, `ActivityRetracted` | `MembershipStarted`, `ConsentGranted` |
| JRN-16 | `PlayerActivated`, `PlayerTemporarilyInactivated`, `PlayerInactivated`, `LifecycleStateChanged` | `ActivityRecorded`, `ActivityRetracted`, `PolicyVersionActivated` |
| JRN-17 | `VerificationRequested`, `IdentityRecovered`, `DecisionRecorded` | `UserBound`, `PersonRegistered` |
| JRN-18 | `IdentityMerged`, `IdentityDecisionRecorded` | `DuplicateSuspected` |
| JRN-19 | `PlayerArchived`, `LifecycleStateChanged` | `ConsentRevoked`, `PlayerInactivated` |
| JRN-20 | `LifecycleStateChanged`, `PlayerActivated` | `PlayerArchived` |
| JRN-21 | `GuardianAuthorityEnded`, `GuardianReplaced`, `GuardianRemoved`, `RoleRevoked` | `PersonRegistered`, `GuardianLinkVerified` |

Governance notes:

- `JourneyUpdated` is **not** produced by any journey (EDEC-01): the Journey read
  model is a consumer, never a producer.
- Operational signals (`JobStarted`, `SyncCompleted`, `RetryAttempted`,
  `CacheInvalidated`) are explicitly excluded — journeys publish business facts only.
- `PolicyVersionActivated` / `PolicyVersionRetired`, `PolicyBreachDetected`,
  `PolicyExceptionGranted`, `StructuralExceptionRequested` /
  `StructuralExceptionRefused`, and `GuardianAnnotationRecorded` belong to the
  governance journeys carried by JRN-09, JRN-16, and JRN-21 as consumed or
  produced signals; none is orphaned.

---

## PART 10 — Journey Projection Mapping

How each journey changes the four derived views. The projection is always downstream.

| Journey | Journey Read Model | Activity Status | Membership Status | Verification Status |
| --- | --- | --- | --- | --- |
| JRN-01 | Journey created, empty timeline | NEVER_ACTIVE | none | UNVERIFIED |
| JRN-04 | Guardian block populated | — | — | Guardian level L1..L3 |
| JRN-05 | Identity block completed | — | — | VERIFIED / REJECTED / DOWNGRADED |
| JRN-06 | Football ID pinned to the timeline root | — | — | — |
| JRN-07 / JRN-08 | Visibility of blocks widens or narrows | — | — | — |
| JRN-10 | Organization block opens with a Primary entry | — | ACTIVE Primary | — |
| JRN-11 | Additional organization entry, typed Secondary | — | ACTIVE Secondary | — |
| JRN-12 | Entry closed with an end date, retained | — | ENDED | — |
| JRN-13 / JRN-14 | Two adjacent organization entries plus a transfer marker | — | Primary moves | — |
| JRN-15 | Activity block gains an attested entry | contributes to the window | — | — |
| JRN-16 | Activity block status recomputed | ACTIVE / TEMPORARILY_INACTIVE / INACTIVE | — | — |
| JRN-17 | No timeline change — access only | — | — | assurance recorded |
| JRN-18 | Two timelines become one, ordered, with a merge marker | recomputed | union of memberships, invariant re-tested | highest surviving level |
| JRN-19 | Timeline frozen and hidden from third parties; the player keeps their copy | INACTIVE → archived | memberships ended | frozen |
| JRN-20 | Timeline unfrozen, continuous with the pre-archive history | NEVER_ACTIVE until new activity | none until re-joined | re-assured |
| JRN-21 | Guardian block gains a new authority period | — | — | new authority's level applies |

Invariant: no journey writes the Journey read model directly. Any inconsistency
between the projection and the events is resolved in favour of the events.

---

## PART 11 — Business Rule Mapping

| Journey | PRD Requirements | Domain Rules (IDN-DMN-001) | Constitution | ADR | Policies |
| --- | --- | --- | --- | --- | --- |
| JRN-01 | FR-PER-01..04 | INV-01..05 | #1, #2 | ADR-0002 | Privacy, Merge |
| JRN-02 | FR-PER-02, FR-ROL-01 | INV-07 | #3 | — | Guardian |
| JRN-03 | FR-GRD-01..03 | INV-07..09 | #6 | — | Guardian |
| JRN-04 | FR-GRD-04..06 | INV-09, INV-10 | #6, #10 | — | Guardian, Verification |
| JRN-05 | FR-VER-01..05 | INV-11..14 | #6, #10 | ADR-0002 | Verification, Consent |
| JRN-06 | FR-FID-01..04 | INV-02..06 | #2, #3 | ADR-0002 | — |
| JRN-07 | FR-CON-01..05 | INV-15..17 | #4, #5, #6 | — | Consent, Guardian |
| JRN-08 | FR-CON-02, FR-CON-06 | INV-16, INV-17 | #4, #6 | — | Consent, Reporting |
| JRN-09 | FR-CON-07 | INV-17, INV-38 | #6, #10 | — | Consent, Reporting, Privacy |
| JRN-10 | FR-MEM-01..04 | INV-18, INV-20 | #7, #9 | ADR-0003 | Transfer, Guardian |
| JRN-11 | FR-MEM-05..06 | INV-20, INV-22 | #9 | ADR-0003 | Transfer, Guardian |
| JRN-12 | FR-MEM-07 | INV-21 | #1 | ADR-0003 | Transfer |
| JRN-13 | FR-MEM-08..10 | INV-18, INV-19 | #7, #9, #10 | ADR-0003 | Transfer, Guardian, Reporting |
| JRN-14 | FR-MEM-09 | INV-19 | #7, #9 | ADR-0003 | Transfer |
| JRN-15 | FR-ACT-01..04 | INV-23..26 | #1, #10 | — | Activity, Consent |
| JRN-16 | FR-ACT-05..07 | INV-26, INV-27 | #8 | — | Activity, Reporting, JCS Weighting |
| JRN-17 | FR-AUT-01..05 | INV-01, INV-06 | #2, #3 | ADR-0002 | Recovery, Verification |
| JRN-18 | FR-PER-05, FR-FID-04 | INV-03..06 | #2, #3 | ADR-0002 | Merge, Guardian |
| JRN-19 | FR-LFC-01..04 | INV-28..31 | #5, #1 | — | Privacy, Reporting |
| JRN-20 | FR-LFC-05 | INV-06, INV-31 | #2, #3 | ADR-0002 | Recovery, Privacy |
| JRN-21 | FR-GRD-07..08 | INV-08, INV-10 | #4, #6 | — | Guardian, Consent |

Standing invariants applied to every row: STK-INV-001 (data minimisation by
capability), STK-INV-002 (consent authority ≠ evidence authority), STK-INV-003
(guardian annotation never mutates a record), STK-INV-004 (structural prohibition),
and INV-38 (Rule 0 as a structural invariant).

---

## PART 12 — Exception Catalogue

| ID | Exception | Cause | Business Handling | Escalation | Decision Owner |
| --- | --- | --- | --- | --- | --- |
| EXC-01 | **Duplicate Identity** | The same human registered twice (school drive, club bulk import, recovery attempt) | Hold the newer record, run JRN-18, retire the superseded ID, reattach history | Association Officer where two clubs both claim the record | Data Steward |
| EXC-02 | **Guardian Conflict** | Two adults claim authority; separation, custody change, or fraud | Freeze consent-dependent capabilities; require documentary evidence; the child's safety decides, not who claimed first | Child Protection Officer, then Council | Child Protection Officer |
| EXC-03 | **Consent Conflict** | An organization needs a purpose the guardian refuses, or two purposes overlap in scope | The capability is not delivered. No negotiation, no partial data use, no re-asking outside the policy cooldown | Privacy Officer | Guardian / adult Player |
| EXC-04 | **Verification Failure** | Evidence absent, inconsistent, or below the claimed level | Stay at the lower level; the player keeps their record and their journey; state exactly what evidence would resolve it | Association Officer for competition-critical cases | Verification Authority |
| EXC-05 | **Transfer Rejected** | Window closed, dispute open, guardian approval absent, safeguarding hold | The releasing Primary stands; the reason is recorded and shown to the family | Association Officer | Association Officer |
| EXC-06 | **Membership Conflict** | A second ACTIVE Primary attempted, or an organization holds two memberships for one player | Refuse and re-route: a second Primary is a transfer, a second membership at one organization is a type change | Association Officer | System under `TransferPolicy`, escalated to human on dispute |
| EXC-07 | **Identity Recovery Failure** | Assurance evidence insufficient; the claimant may not be the subject | Refuse recovery. **Never** resolve by issuing a second identity — that would break Constitution #3 | Verification Authority, then Child Protection Officer for minors | Verification Authority |
| EXC-08 | **Policy Absent or Expired** | No policy version in force for a decisive policy | Halt the journey; do not fall back to defaults | Council | Enterprise Architect |
| EXC-09 | **Structural Exception Requested** | An actor asks for a capability that is deliberately absent (e.g. under-13 scouting) | Refuse structurally; record the request and the refusal | Child Protection Officer | Child Protection Officer |

Every exception produces an auditable record. A refused journey is a completed
journey with a negative outcome, never an unfinished one.

---

## PART 13 — Privacy & Child Protection

| Journey | Personal Data Impact | Child Data Impact | Guardian Impact | Consent Requirement | Visibility | Retention Category |
| --- | --- | --- | --- | --- | --- | --- |
| JRN-01 | Minimum data set created | High — a child record is born | Guardian is the registrant for a minor | Registration basis; no secondary purpose | Player + Guardian only | Identity core (long) |
| JRN-02 | Adult contact data | None directly | Guardian's own data | Registration basis | Self only | Identity core |
| JRN-03 | Relationship assertion | High — determines who speaks for the child | Establishes authority | None required to claim; verification required to act | Player + claimant | Guardian record (long) |
| JRN-04 | Relationship evidence, possibly sensitive | High | Unlocks consent authority | Consent for evidence handling | Verification Authority + Guardian | Evidence (short, minimised) |
| JRN-05 | Age and identity evidence | High | Guardian supplies and consents | Explicit, evidence-scoped | Verification Authority; result visible to the club | Evidence (short); result (long) |
| JRN-06 | Identifier only, meaning-free | Low by design (ADR-0002) | None | None | Player, Guardian, and organizations with active membership | Permanent |
| JRN-07 | Defines what may be used | High | Guardian is the decision maker | The journey *is* the consent | Player + Guardian | Consent record (long, append-only) |
| JRN-08 | Reduces lawful use | High — protective | Guardian exercises control | — | Player + Guardian + Auditor | Consent record (long) |
| JRN-09 | Downstream inventory reviewed | High | Guardian notified | — | Child Protection Officer + Auditor | Safeguarding (long) |
| JRN-10 | Membership becomes visible to the club | Medium | Guardian approves | Membership-scope consent | Club, Association (eligibility only) | Membership (long) |
| JRN-11 | Programme relationship visible | Medium | Guardian approves | Membership-scope consent | The programme only | Membership (long) |
| JRN-12 | Access ends immediately | Low | Guardian may initiate | — | Historic entry only | Membership (long) |
| JRN-13 / JRN-14 | Two clubs see the move | Medium | Guardian approves | Membership + transfer scope | Both clubs, Association | Transfer decision (long) |
| JRN-15 | Attendance and participation | Medium | Guardian consented at membership | Activity-scope consent | Coach + Club; aggregate elsewhere | Activity (medium) |
| JRN-16 | Derived status only | Low | Visible to the guardian | — | Player, Guardian, Club (status only) | Derived (recomputable) |
| JRN-17 | Assurance evidence | Medium | Guardian may act for a minor | Evidence-scope consent | Verification Authority | Evidence (short) |
| JRN-18 | Two records converge | High | Guardian consulted for a minor | Consulted, not overridden | Data Steward + Auditor | Merge decision (permanent) |
| JRN-19 | Visibility closed to third parties | High — protective | Guardian may request | Withdrawal honoured | Player only | Per retention category |
| JRN-20 | Visibility reopened | Medium | Guardian re-assures | Consents re-granted, never revived | As before archive | Per retention category |
| JRN-21 | Authority reassigned | High | Authority gained or lost | New authority re-confirms consents | Player + both authorities | Guardian record (long) |

Child-protection constants across the catalogue:

- **P8 (AI model improvement) is unavailable under 13** and is never bundled with
  another purpose in any journey.
- **Under-13 scouting has no journey.** The capability is absent, not denied
  (STK-INV-004); a request for it produces EXC-09.
- **Guardian objection** enters through `GuardianAnnotationRecorded` and attaches
  to the record; no journey lets a guardian mutate evidence (STK-INV-002/003).
- **Effect precedes review** in JRN-08/JRN-09: protection is applied first,
  adjudicated after.

---

## PART 14 — Audit & Explainability

| Journey | Audit Trigger | Evidence Required | Decision Trail | Explainability Requirement |
| --- | --- | --- | --- | --- |
| JRN-01 | Every registration | Minimum data set, duplicate screen result | `PersonRegistered` | Why this person was accepted as new |
| JRN-04 / JRN-05 | Every level assignment or change | Evidence class, assessor, policy version | `VerificationCompleted` / `VerificationRejected` | Which evidence produced which level |
| JRN-06 | Every issuance | Issuance record | `FootballIdentityIssued` | That the ID carries no business meaning |
| JRN-07 / JRN-08 | Every consent state change | Purpose, scope, expiry, authority | Append-only consent history | What became lawful or unlawful, and when |
| JRN-09 | Every high-risk revocation | Downstream inventory, notification log, closure | `HighRiskRevocationRaised` → `DecisionRecorded` | What was stopped and who was informed |
| JRN-10..JRN-12 | Every membership state change | Type, approvals, invariant check | `MembershipCreated`/`Started`/`Ended` | Why this type and this organization |
| JRN-13 / JRN-14 | Every Primary move | Both clubs, guardian approval, window, adjudication | `IdentityDecisionRecorded` | The full chain from request to move |
| JRN-15 / JRN-16 | Sampled and on rejection | Attestation, assignment, anti-gaming result, policy version | `ActivityRecorded` / `ActivityRejected` | Which rule counted or discarded the activity |
| JRN-17 | Every recovery attempt | Assurance level met or missed | `IdentityRecovered` / refusal | That the same human regained the same ID |
| JRN-18 | Every merge, always | Match evidence, guardian consultation, surviving ID | `IdentityMerged` + `IdentityDecisionRecorded` | Which record survived and why |
| JRN-19 / JRN-20 | Every archive and restore | Trigger, hold check, retention category | `PlayerArchived`, `LifecycleStateChanged` | Why the record was closed or reopened |
| JRN-21 | Every authority change | Majority date or official documentation | `GuardianAuthorityEnded` + successor event | Who holds authority now and since when |

Universal rules: every automated outcome names its `policy_id@version`; every
correction is additive (`DecisionCorrectionRecorded`), never destructive; the
Auditor can reconstruct any outcome from events alone, without querying the Journey
read model.

---

## PART 15 — Cross-Context Interaction

Business-level interaction only. Contexts learn about Identity through published
business facts; Identity never reaches into another context.

| Context | Consumes from Identity | Business Meaning |
| --- | --- | --- |
| **Organization** | JRN-10..JRN-14 membership facts | Roster composition and staff assignment; the organization holds membership, never ownership of the player |
| **Competition** | `PlayerVerified`, `PrimaryMembershipChanged`, `MembershipSuspended` | Eligibility derives from the Primary Membership only (ADR-0003); a Secondary never confers the right to play |
| **Development** | `ActivityRecorded`, `PlayerVerified`, membership periods | Attaches assessments to a verified, attributable player; records remain the player's on transfer |
| **Medical** | `GuardianLinkVerified`, consent facts | Highly restricted; acts only on an explicit purpose consent and a verified guardian authority |
| **Finance** | Membership start and end facts | Billing follows membership periods; never receives child profile data (STK-INV-001) |
| **Scouting** | `PlayerVerified` plus age band and consent | For under-13 the interaction **does not exist** — no contract, no feed, no filter (STK-INV-004) |
| **Notification** | Every journey producing a family-visible outcome | Guardians are informed of verification, membership, transfer, and revocation outcomes |
| **Analytics** | All business events in PART 9 | Computes VAP, NDI, JCS, CTI from events, always carrying the policy version |
| **Federation / Association** | Verified identity as reference | External identifiers are references only; they never override the Football ID (Constitution #11) |

---

## PART 16 — Analytics Mapping

| Journey | VAP | NDI | JCS | CTI | NEVER_ACTIVE | TEMPORARILY_INACTIVE |
| --- | --- | --- | --- | --- | --- | --- |
| JRN-01 | denominator + | node + | starts the score | — | enters the pool | — |
| JRN-04 / JRN-05 | precondition met | — | identity dimension complete | — | — | — |
| JRN-06 | — | node identity fixed | root of the timeline | — | — | — |
| JRN-07 | — | — | enables dimensions | **raises** | — | — |
| JRN-08 | may reduce usable base | — | may reduce reportable dimensions | **lowers** | — | — |
| JRN-09 | — | — | — | lowers until closed | — | — |
| JRN-10 | precondition met | edge + (player↔org) | organization dimension complete | — | — | — |
| JRN-11 | — | edge + (distinct org, anti-gaming applied) | organization dimension enriched | — | — | — |
| JRN-12 | — | edge closes, history retained | unchanged (history counts) | — | — | — |
| JRN-13 / JRN-14 | unchanged | portability signal + | organization dimension shows continuity | — | — | — |
| JRN-15 | numerator input | edge + (player↔coach↔activity) | activity dimension | — | leaves the pool | may exit |
| JRN-16 | **recomputes VAP** | — | activity dimension recomputed | — | resolves | **sets or clears** |
| JRN-17 | restores participation | — | — | — | — | — |
| JRN-18 | corrects double counting | de-duplicates nodes and edges | merges into one complete journey | consents consolidated | corrects | corrects |
| JRN-19 | removes from VAP | node dormant | frozen | consents ended | — | terminal exit |
| JRN-20 | eligible again | node live | resumes | consents re-granted | re-enters until activity | — |
| JRN-21 | — | — | — | re-confirmation may dip then recover | — | — |

Reporting discipline: every figure is published with the `ActivityPolicy` and
`JourneyCompletenessPolicy` versions used. NDI counts distinct organizations across
both membership types, with the anti-gaming rule (independently administered
organizations, distinct accountable adult) applied. CTI falling below the Phase
floor (**OQ-05 pending**) halts roadmap expansion, per PRG-VIS-001.

---

## PART 17 — Journey Invariants

| ID | Invariant |
| --- | --- |
| JINV-01 | Every journey terminates in a stated business outcome — success or explicit failure. There is no "in progress forever". |
| JINV-02 | Every state change inside a journey is published as an approved business Domain Event; no state changes silently. |
| JINV-03 | The Journey read model is never a source of truth and is never written by a journey step. |
| JINV-04 | Every decision is auditable: actor, evidence, policy version, outcome, timestamp — reconstructable from events alone. |
| JINV-05 | Where interests conflict, the child's interest prevails, and the trade-off is recorded (Rule 0 / INV-38). |
| JINV-06 | No step proceeds where a required consent is absent, expired, suspended, or revoked. |
| JINV-07 | The Football ID is never re-issued, re-used, or changed by any journey — including merge, recovery, archive, and restore. |
| JINV-08 | At most one ACTIVE Primary Membership exists at any moment; every move of the Primary is a Transfer journey. |
| JINV-09 | Every journey names a single responsible actor per step; no step is performed by "the platform" unless a policy delegates it explicitly. |
| JINV-10 | A refusal is a first-class outcome and carries the same audit and explainability obligations as an approval. |
| JINV-11 | No journey exists for a structurally prohibited capability; a request for one produces a recorded refusal, not a permission check. |
| JINV-12 | Ending a membership never deletes history; access ends immediately, the record persists. |

---

## PART 18 — Acceptance Criteria

| Criterion | Status | Evidence |
| --- | --- | --- |
| Every actor has at least one journey | ✓ | Player JRN-01/17 · Guardian JRN-02/03/07/08 · Coach JRN-15 · Club Administrator JRN-10..14 · Association Officer JRN-13 · Federation Officer PART 15 (reference interaction) · System JRN-06/16/21 · Auditor PART 14 (review authority in JRN-09/18) · Child Protection Officer JRN-09 · Privacy Officer JRN-19/20 |
| Every business goal covered | ✓ | The 17 mandated journeys plus 4 derived ones (PART 4) |
| Every business Domain Event used | ✓ | PART 9 maps all IDN-EVT-001 business events; the four operational signals and `JourneyUpdated` are excluded by rule, with reasons stated |
| Every policy applied | ✓ | PART 8 covers all ten IDN-DMN-001 policies |
| Every decision documented | ✓ | 12 decisions in PART 7, each referenced from at least one flow step in PART 6 |
| No orphan journey | ✓ | PART 11 traces each journey to PRD requirements and domain rules |
| No UI dependency | ✓ | No screen, component, or interaction pattern appears in this document |
| No API dependency | ✓ | No endpoint, method, payload, or protocol appears in this document |
| Privacy by Design | ✓ | PART 13 per journey; STK-INV-001 applied throughout |
| Child Protection | ✓ | Rule 0 as JINV-05; structural prohibition as JINV-11; JRN-09 as a dedicated safeguarding journey |
| Explainability | ✓ | PART 7 explainability column + PART 14 |
| Constitution compliance | ✓ | All twelve locked principles mapped in PART 11 |

Open items carried forward (values, not structure): **OQ-02** — minimum L1
verification evidence, binding to `VerificationPolicy` in JRN-04/05. **OQ-05** —
CTI Phase 0 floor, binding to `ReportingPolicy` in PART 16.

---

## PART 19 — Traceability Matrix

```text
PRG-VIS-001  Vision, North Star, phase targets
      |
PRG-STK-001  Stakeholders, STK-INV-001..004
      |
IDN-PRD-001  Requirements FR/BR, decision log
      |
IDN-DMN-001  Aggregates, invariants, policies, services
      |
IDN-CDM-001  Canonical business objects, classification
      |
IDN-EVT-001  Domain Event Catalogue (49 events, 9 families)
      |
IDN-JRN-001  Business Journey Catalogue  <-- this artefact
      |
      +--> IDN-API-001   Contract-first API specification
      +--> IDN-SEC-001   Authorization and security model
      +--> IDN-UIC-001   UX flow and interaction model
      +--> IDN-ERD-001   Enterprise data model + RLS design
      +--> IDN-TEST-001  Business acceptance tests
```

| Upstream artefact | Consumed as | Downstream obligation created |
| --- | --- | --- |
| PRG-VIS-001 | Phase volumes, VAP/NDI/JCS/CTI definitions | PART 16 analytics mapping; CTI halt rule |
| PRG-STK-001 | Actor authority and restrictions | PART 3, PART 13 |
| PRG-MET-001 | ActivityPolicy and the 6-state lifecycle | JRN-15, JRN-16 |
| CONSENT-001 | Purposes P1..P8, levels L0..L3, high-risk revocation | JRN-07, JRN-08, JRN-09 |
| IDN-PRD-001 | FR/BR set, decision log DL-01..08 | PART 11 |
| IDN-DMN-001 | Aggregates, 38 invariants, 10 policies, 9 services | PART 6, PART 8 |
| IDN-CDM-001 | Canonical vocabulary and classification | PART 13 |
| IDN-EVT-001 | The only permitted event vocabulary | PART 9 |
| ADR-0002 | Opaque, immutable identifier | JRN-06, JRN-17, JRN-18, JINV-07 |
| ADR-0003 | Primary/Secondary membership model | JRN-10..JRN-14, JINV-08 |

**Downstream binding.** IDN-API-001 must expose an operation for every business
decision in PART 7 and nothing that is not reachable from a journey step.
IDN-SEC-001 must implement the six-step authorization model against the actor
authority in PART 3. IDN-ERD-001 must persist every event in PART 9 and no state
that no journey produces. IDN-TEST-001 derives its Given/When/Then set from PART 5
success and failure outcomes plus the PART 12 exceptions.

---

**Status:** IN_REVIEW · submitted to the Enterprise Business Journey Council for G5
ratification. No implementation is authorised by this artefact.
