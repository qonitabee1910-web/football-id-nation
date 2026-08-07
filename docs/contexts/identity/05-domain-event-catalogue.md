---
id: IDN-EVT-001
title: Enterprise Domain Event Catalogue — Identity Bounded Context
context: identity
stage: 2
status: IN_REVIEW
version: 1.0
gate: G4
owner: Enterprise Event Architect
co_owner: Chief Enterprise Architect
derives_from: [PRG-VIS-001, PRG-STK-001, PRG-MET-001, CONSENT-001, IDN-PRD-001, IDN-DMN-001, IDN-CDM-001]
adrs: [ADR-0001, ADR-0002, ADR-0003]
north_star_impact: "Every VAP, NDI, JCS and CTI figure is derived from the events catalogued here; no metric may read from a source not listed in PART 13."
---

# IDN-EVT-001 — Enterprise Domain Event Catalogue (Identity)

Business events only. No transport, no schema, no payload, no broker, no API.
Every event below is a past-tense business fact traceable to an approved artefact.

---

## PART 1 — Executive Summary

**Purpose.** This catalogue is the official register of what *happens* in the
Identity domain, expressed as business facts. It is the connective tissue between
the Domain Model (what exists), the Canonical Data Model (what things mean), and
every future contract (API, integration, analytics, audit).

**Business scope.** All facts about a human entering the ecosystem, receiving a
Football ID, being verified, having a guardian, granting or withdrawing consent,
holding membership, transferring, being merged or recovered, becoming active or
dormant, and the decisions taken about them. Anything outside Identity appears
only as a *consumer*.

**Relationship with IDN-DMN-001.** The Domain Model's PART 8 listed 33 events as
part of the aggregate design. This catalogue takes that list as authoritative,
adds the events required for completeness (policy lifecycle, journey projection,
consent conflict, structural exception outcomes) and gives every event the full
governance record: owner, producers, consumers, policy, rules, privacy, child
protection, journey impact, analytics impact, audit and traceability. Where a
name here differs from IDN-DMN-001 it is recorded as an **alias**, never as a
replacement — the Domain Model is locked.

**Why this matters commercially and ethically.** Because the child owns the
Journey, the Journey must be reconstructable from facts, not from the current
state of an organization's records. An event catalogue is how that promise is
made technically inevitable rather than merely stated.

---

## PART 2 — Event Principles

| # | Principle | Meaning in practice |
| --- | --- | --- |
| EP-01 | **Business Event only** | An event records something a football stakeholder would recognise as having happened. "A child transferred club" is an event. "A row was updated" is not. |
| EP-02 | **Past tense** | Names state a completed fact: `ConsentRevoked`, not `RevokeConsent`. A name that reads like a command is a defect. |
| EP-03 | **Immutable** | Once recorded, an event is never edited or deleted. A mistake is corrected by a *new* event that references the erroneous one. |
| EP-04 | **Historical fact** | An event remains true forever, even after its consequences are reversed. `ConsentGranted` stays true after `ConsentRevoked`. |
| EP-05 | **No technical event** | No `CacheInvalidated`, `JobStarted`, `RetryAttempted`, `SyncCompleted`. Operational telemetry is not domain history. |
| EP-06 | **No CRUD event** | No `PersonCreated/Updated/Deleted`. If the only business meaning is "a record changed", there is no event. Change is expressed by the specific business fact that caused it. |
| EP-07 | **No API event** | Events are not requests, responses, callbacks or webhooks. Delivery is out of scope for this artefact. |
| EP-08 | **One meaning, one event** | Two names may not carry the same business meaning. Duplicated meaning is a catalogue defect (PART 16, INV-EVT-04). |
| EP-09 | **Explainability is intrinsic** | Any event with a consequence for a child carries a reason and, where a policy decided it, the `policy_id@version` under which it was decided. |
| EP-10 | **Silence is not a fact** | Absence of consent, absence of activity and absence of objection are never events. Only affirmative facts are recorded. |

---

## PART 3 — Event Taxonomy

Nine business families. Every event belongs to exactly one.

| Family | Code | Business question it answers | Count |
| --- | --- | --- | --- |
| Identity Events | `IDE` | Who is this human, and what is their permanent identity? | 8 |
| Guardian Events | `GRD` | Who speaks for this child, and since when? | 6 |
| Consent Events | `CON` | What may be done with this child's data, and on whose authority? | 7 |
| Membership Events | `MEM` | Where does this player belong, officially and otherwise? | 7 |
| Verification Events | `VER` | How much is a claim about this human trusted? | 5 |
| Decision Events | `DEC` | What consequential judgement was made, by whom, on what evidence? | 5 |
| Activity Events | `ACT` | Did this child actually play football? | 3 |
| Lifecycle Events | `LFC` | Where does this player stand right now? | 5 |
| Policy Events | `POL` | Under what rules was any of the above decided? | 3 |

Total: **49 catalogued events**.

Family assignment is a governance fact, not a filing convenience: retention,
privacy classification and audit obligation are inherited from the family unless
the individual event states otherwise.

---

## PART 4 — Event Catalogue (Register)

Naming convention: `PascalCase`, subject first, past-tense verb last, no
technical suffixes. Aliases carry the IDN-DMN-001 name where it differs.

### 4.1 Identity Events (IDE)

| ID | Canonical Name | Alias (IDN-DMN-001) | One-line fact |
| --- | --- | --- | --- |
| EVT-IDE-01 | `PersonRegistered` | same | A human who had no record now has one |
| EVT-IDE-02 | `FootballIdentityIssued` | same | The permanent, opaque Football ID now exists |
| EVT-IDE-03 | `UserBound` | same | An authentication subject was attached to this human |
| EVT-IDE-04 | `RoleAssigned` | same | This human may act in a named capacity within a scope |
| EVT-IDE-05 | `RoleRevoked` | same | That capacity has ended |
| EVT-IDE-06 | `DuplicateSuspected` | same | Two records may describe one human |
| EVT-IDE-07 | `IdentityMerged` | same | Two records were one human; one identity survives |
| EVT-IDE-08 | `IdentityRecovered` | same | The same human regained access to their identity |

### 4.2 Guardian Events (GRD)

| ID | Canonical Name | Alias | One-line fact |
| --- | --- | --- | --- |
| EVT-GRD-01 | `GuardianLinked` | same | A named adult claims responsibility for a child |
| EVT-GRD-02 | `GuardianLinkVerified` | same | That responsibility is now authority-bearing |
| EVT-GRD-03 | `GuardianReplaced` | same | Authority moved to a different adult by decision |
| EVT-GRD-04 | `GuardianAuthorityEnded` | `GuardianRemoved` | The adult no longer speaks for this human |
| EVT-GRD-05 | `GuardianConflictRaised` | (new) | Two authority-bearing adults hold opposing positions |
| EVT-GRD-06 | `GuardianAnnotationRecorded` | (new, STK-INV-003) | An objection was attached without mutating any record |

### 4.3 Consent Events (CON)

| ID | Canonical Name | Alias | One-line fact |
| --- | --- | --- | --- |
| EVT-CON-01 | `ConsentGranted` | same | A purpose is permitted, on stated authority and assurance |
| EVT-CON-02 | `ConsentRefused` | same | A purpose was explicitly declined |
| EVT-CON-03 | `ConsentRevoked` | same | Processing under a purpose must stop now |
| EVT-CON-04 | `ConsentExpired` | same | The basis for a permission lapsed |
| EVT-CON-05 | `HighRiskRevocationRaised` | same | An urgent withdrawal with live downstream exposure |
| EVT-CON-06 | `ConsentPurposeSuspended` | (new) | A permission is inoperative pending restored assurance |
| EVT-CON-07 | `AITrainingConsentWithdrawn` | (new, CONSENT-001 P8) | Data must leave the training population within the SLA |

### 4.4 Membership Events (MEM)

| ID | Canonical Name | Alias | One-line fact |
| --- | --- | --- | --- |
| EVT-MEM-01 | `MembershipStarted` | `MembershipCreated` | Affiliation with an organization began |
| EVT-MEM-02 | `MembershipEnded` | `SecondaryMembershipRemoved` (secondary case) | Affiliation closed; the access it granted ended |
| EVT-MEM-03 | `SecondaryMembershipAdded` | same | A non-exclusive affiliation began |
| EVT-MEM-04 | `PlayerTransferred` | `MembershipTransferred` | The official club changed, with approval and audit |
| EVT-MEM-05 | `PrimaryMembershipChanged` | same | The authoritative affiliation moved |
| EVT-MEM-06 | `MembershipPromotedToPrimary` | same | A secondary affiliation became the official one |
| EVT-MEM-07 | `MembershipSuspended` | (new) | Participation is paused without ending affiliation |

### 4.5 Verification Events (VER)

| ID | Canonical Name | Alias | One-line fact |
| --- | --- | --- | --- |
| EVT-VER-01 | `VerificationRequested` | same | An assurance claim is being examined |
| EVT-VER-02 | `VerificationCompleted` | same | The claim is trusted at a stated level |
| EVT-VER-03 | `VerificationRejected` | same | The claim was not accepted; assurance is unchanged |
| EVT-VER-04 | `VerificationDowngraded` | same | Trust previously granted has been withdrawn |
| EVT-VER-05 | `VerificationUpgraded` | (new) | Assurance moved to a higher level on new evidence |

### 4.6 Decision Events (DEC)

| ID | Canonical Name | Alias | One-line fact |
| --- | --- | --- | --- |
| EVT-DEC-01 | `IdentityDecisionRecorded` | `DecisionRecorded` | A DL-01…DL-08 decision is now explainable and permanent |
| EVT-DEC-02 | `DecisionCorrectionRecorded` | (new) | An earlier decision was superseded by a linked new one |
| EVT-DEC-03 | `StructuralExceptionRequested` | same | Someone asked to widen a child-affecting capability |
| EVT-DEC-04 | `StructuralExceptionRefused` | (new) | The request was refused; refusal is recorded as firmly as approval |
| EVT-DEC-05 | `PolicyExceptionGranted` | (new) | A time-boxed departure from a policy was authorised |

### 4.7 Activity Events (ACT)

| ID | Canonical Name | Alias | One-line fact |
| --- | --- | --- | --- |
| EVT-ACT-01 | `ActivityRecorded` | same | A child actually trained or played, attested by an accountable adult |
| EVT-ACT-02 | `ActivityRejected` | (new) | A submitted activity failed the anti-gaming test |
| EVT-ACT-03 | `ActivityRetracted` | (new) | A previously accepted activity was withdrawn by its attester |

### 4.8 Lifecycle Events (LFC)

| ID | Canonical Name | Alias | One-line fact |
| --- | --- | --- | --- |
| EVT-LFC-01 | `PlayerVerified` | (new; from `LifecycleStateChanged`) | Identity and guardian verification are both satisfied |
| EVT-LFC-02 | `PlayerActivated` | same | The player met the active-activity threshold |
| EVT-LFC-03 | `PlayerTemporarilyInactivated` | same | Qualifying activity lapsed within the tolerance window |
| EVT-LFC-04 | `PlayerInactivated` | same | Dormancy passed the policy threshold |
| EVT-LFC-05 | `PlayerArchived` | same | The record rests; the Journey is kept intact |

`LifecycleStateChanged` (IDN-DMN-001) is retained as the **family umbrella name**;
EVT-LFC-01..05 are its named business specialisations. No lifecycle move may be
recorded without one of the five specialisations.

### 4.9 Policy Events (POL)

| ID | Canonical Name | Alias | One-line fact |
| --- | --- | --- | --- |
| EVT-POL-01 | `PolicyVersionActivated` | same | A named policy version now governs decisions |
| EVT-POL-02 | `PolicyVersionRetired` | same | A version no longer governs new decisions |
| EVT-POL-03 | `PolicyBreachDetected` | (new) | A guardrail in PRG-VIS-001 §10.4 was breached |

### 4.10 Journey

`JourneyUpdated` — **deliberately excluded as a domain event.** The Journey is a
derived read model (Constitution #8, IDN-DMN-001 PART 9). A projection refresh is
a technical consequence, not a business fact. Journey change is always explained
by the upstream event that caused it (PART 12). Recording `JourneyUpdated` would
create a second, competing source of truth for the child's history — the exact
failure the platform exists to prevent.

> **Council note.** The Master Prompt lists `JourneyUpdated` in the minimum set.
> The exclusion above is a reasoned constitutional objection, not an omission. If
> the Council wishes the name retained, it should be retained as a *projection
> checkpoint* outside the event catalogue. Tagged: **Enterprise Domain Event
> Council Decision Required (EDEC-01).**

---

## PART 5 — Event Definitions

Full record per event. Fields: Business Meaning · Business Purpose · Past-Tense
Statement · Business Owner · Producer Aggregate · Primary Consumers · Related
Policies · Related Business Rules · Related Canonical Objects · Affected Journey ·
Audit · Child Protection Impact · Privacy Impact · Traceability.

Privacy classification uses IDN-CDM-001 bands: `PUBLIC` · `INTERNAL` ·
`SENSITIVE` · `CHILD-SENSITIVE`.

### EVT-IDE-01 · PersonRegistered
- **Business meaning.** A human who previously had no presence in Indonesian youth football now has a record.
- **Business purpose.** Establish the subject of every later fact; start the onboarding-friction clock.
- **Past-tense statement.** "A person was registered in the ecosystem."
- **Business owner.** Chief Product Officer. **Producer.** `Person`.
- **Primary consumers.** Analytics (registration inflation counter-metric), Notification, Guardian onboarding.
- **Policies.** `PrivacyPolicy`, `GuardianPolicy` (minor branch).
- **Business rules.** BR-01, BR-02 · INV-01 · Constitution #11 (registration implies nothing).
- **Canonical objects.** Person.
- **Journey.** Creates the Journey shell; contributes to JCS identity dimension only after verification.
- **Audit.** Required — origin actor, channel, age band asserted.
- **Child protection.** Where the subject is a minor, the record is inert until a guardian link exists; no capability is enabled by registration alone.
- **Privacy.** `CHILD-SENSITIVE` when the subject is a minor; otherwise `SENSITIVE`.
- **Traceability.** PRG-VIS-001 §2 · FR-PER-01 · IDN-DMN-001 A-01 · IDN-CDM-001 CBO-01.

### EVT-IDE-02 · FootballIdentityIssued
- **Business meaning.** The permanent, opaque identity that will follow this human for life now exists.
- **Business purpose.** Deliver the platform's central promise: an identity no organization can revoke or own.
- **Past-tense statement.** "A Football ID was issued."
- **Owner.** Chief Enterprise Architect. **Producer.** `Person` / `FootballIdentity`.
- **Consumers.** All contexts; Federation ACL; Analytics.
- **Policies.** `PrivacyPolicy`. **Rules.** BR-03..05 · INV-02, INV-03 · ADR-0002 rev.2 (fully opaque).
- **Canonical objects.** Football Identity.
- **Journey.** Anchors the Journey permanently. Never re-anchored, including after merge.
- **Audit.** Required and permanent; issuance is never deleted, only superseded by merge resolution.
- **Child protection.** The identifier encodes no age, region or year, so possession of an ID leaks nothing about the child.
- **Privacy.** `INTERNAL` (the identifier itself is meaning-free); its *linkage* is `CHILD-SENSITIVE`.
- **Traceability.** ADR-0002 · FR-FID-01..04 · IDN-DMN-001 E-01 · CBO-02.

### EVT-IDE-03 · UserBound
- **Meaning.** An authentication subject was attached to a person, so this human can now sign in.
- **Purpose.** Separate *who someone is* from *how they log in* (Constitution #3, one person many roles).
- **Statement.** "A user account was bound to a person."
- **Owner.** Security Architect. **Producer.** `Person`. **Consumers.** Notification, Authorization.
- **Policies.** `RecoveryPolicy`, `VerificationPolicy`. **Rules.** INV-01 (one user per person) · FR-AUT-01..04.
- **Journey.** None. **Audit.** Required. **Child protection.** A minor's account never carries consent authority.
- **Privacy.** `SENSITIVE`. **Trace.** FR-AUT-01 · A-01.

### EVT-IDE-04 · RoleAssigned / EVT-IDE-05 · RoleRevoked
- **Meaning.** A capacity (coach, referee, org admin, guardian, player) began or ended within a named scope.
- **Purpose.** Make authorization derive from facts with a start and an end, never from a static profile field.
- **Statements.** "A role was assigned in a scope." / "A role was revoked in a scope."
- **Owner.** Security Architect. **Producer.** `Person`. **Consumers.** Authorization, Organization, Association, Audit.
- **Policies.** `PrivacyPolicy` (capability-scoped minimisation, STK-INV-001). **Rules.** INV-21 (role alone grants nothing) · FR-ROL-01..05.
- **Journey.** Only for football-meaningful roles (coach, referee) on the *adult's* own Journey.
- **Audit.** Required; revocation is same-day for departing org admins (PRG-STK-001).
- **Child protection.** No role assignment may create a path to under-13 scouting data — that capability is structurally absent (STK-INV-004).
- **Privacy.** `INTERNAL`. **Trace.** FR-ROL-01 · PRG-STK-001 PART 2.1.

### EVT-IDE-06 · DuplicateSuspected
- **Meaning.** Signals suggest two records describe the same human.
- **Purpose.** Protect Journey continuity without ever auto-merging a child's history.
- **Statement.** "A duplicate identity was suspected."
- **Owner.** Data Steward (Platform). **Producer.** `DuplicateResolutionService`. **Consumers.** Platform review queue.
- **Policies.** `MergePolicy`. **Rules.** INV-05 · NFR-08 · FR-PER-04.
- **Journey.** None until a decision. **Audit.** Required.
- **Child protection.** Suspicion never suspends a child's participation.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** DL-01 · IDN-DMN-001 PART 9.

### EVT-IDE-07 · IdentityMerged
- **Meaning.** Two records were one human; one Football ID survives and the retired one resolves to it forever.
- **Purpose.** Repair fragmented history without losing a single day of it.
- **Statement.** "Two identities were merged."
- **Owner.** Chief Enterprise Architect. **Producer.** `Person` + `Decision`. **Consumers.** All contexts, Federation ACL, Analytics.
- **Policies.** `MergePolicy`. **Rules.** INV-05 · BR-06 · DL-01. Always accompanied by EVT-DEC-01.
- **Journey.** Both Journeys combine; neither truncates; ordering by occurrence, not by record age.
- **Audit.** Permanent, with evidence reference and decision owner.
- **Child protection.** A merge that would lose any activity or consent history is refused under Rule 0.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** DL-01 · ADR-0002 · CBO-01/02.

### EVT-IDE-08 · IdentityRecovered
- **Meaning.** The same human regained access to their identity after losing it.
- **Purpose.** Make loss of a phone or email survivable without inventing a new identity.
- **Statement.** "An identity was recovered."
- **Owner.** Security Architect. **Producer.** `Person` + `Decision`. **Consumers.** Notification, Audit.
- **Policies.** `RecoveryPolicy` (assurance scales with sensitivity). **Rules.** INV-06 (never binds to a different human) · DL-07.
- **Journey.** Unchanged — recovery is access, not history. **Audit.** Required with evidence.
- **Child protection.** Guardian is notified on every recovery affecting a minor.
- **Privacy.** `SENSITIVE`. **Trace.** FR-AUT-05 · DL-07.

### EVT-GRD-01 · GuardianLinked
- **Meaning.** A named adult claims responsibility for a specific child.
- **Purpose.** Create the only lawful route to consent for a minor.
- **Statement.** "A guardian was linked to a child."
- **Owner.** Privacy Officer. **Producer.** `GuardianLink`. **Consumers.** Consent, Notification, Analytics (CTI diagnostics).
- **Policies.** `GuardianPolicy`, `VerificationPolicy` (L1+ required). **Rules.** INV-07 · BR-07..09 · FR-GRD-01..04.
- **Journey.** Contributes to the JCS identity dimension only once verified.
- **Audit.** Required. **Child protection.** A claimed but unverified link confers zero authority.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** CONSENT-001 §3 · PRG-VIS-001 §10.2 (one guardian, many children).

### EVT-GRD-02 · GuardianLinkVerified
- **Meaning.** The claimed responsibility has been checked and now bears authority.
- **Purpose.** Make "Verified Guardian" a fact rather than an assertion — a North Star input.
- **Statement.** "A guardian link was verified."
- **Owner.** Privacy Officer. **Producer.** `GuardianLink`. **Consumers.** Consent, VAP/CTI metrics, Notification.
- **Policies.** `VerificationPolicy`, `GuardianPolicy`. **Rules.** INV-07 · precondition of VAP.
- **Journey.** Satisfies the guardian half of the identity dimension.
- **Audit.** Required, with assurance level and policy version. **Child protection.** Central control.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** PRG-MET-001 · CONSENT-001 L0–L3.

### EVT-GRD-03 · GuardianReplaced
- **Meaning.** Consent authority moved from one adult to another by recorded decision.
- **Purpose.** Handle separation, bereavement, and legal custody change without silent overwriting.
- **Statement.** "A guardian was replaced."
- **Owner.** Child Protection Officer. **Producer.** `GuardianLink` + `Decision`. **Consumers.** Consent, Notification, Association.
- **Policies.** `GuardianPolicy`. **Rules.** INV-08, INV-09 (never self-service; new authority is not retroactive) · DL-02.
- **Journey.** No change to football history; the authority record changes.
- **Audit.** Permanent, with evidence and decision owner. **Child protection.** Highest sensitivity; Rule 0 governs contested cases.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** DL-02 · CONSENT-001 §5.

### EVT-GRD-04 · GuardianAuthorityEnded
- **Meaning.** An adult no longer speaks for this human — by majority, by replacement, or by termination.
- **Purpose.** Ensure authority transfer at 18 is an event, never a silent expiry.
- **Statement.** "Guardian authority ended."
- **Owner.** Privacy Officer. **Producer.** `GuardianLink`. **Consumers.** Consent, Notification, Analytics.
- **Policies.** `GuardianPolicy`, `ConsentPolicy`. **Rules.** INV-08 · CONSENT-001 majority transfer.
- **Journey.** Unchanged. **Audit.** Required. **Child protection.** The former minor gains their own consent authority as a recorded fact.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** FR-GRD-08 · CONSENT-001 §6.

### EVT-GRD-05 · GuardianConflictRaised
- **Meaning.** Two authority-bearing adults hold opposing positions on the same purpose or decision.
- **Purpose.** Make conflict visible and resolvable rather than resolved by whoever acted last.
- **Statement.** "A guardian conflict was raised."
- **Owner.** Child Protection Officer. **Producer.** `GuardianResolutionService`. **Consumers.** Review queue, Consent, Notification.
- **Policies.** `GuardianPolicy` (restrictive-position rule applies pending resolution).
- **Rules.** DL-06 · Rule 0. **Journey.** None.
- **Audit.** Required. **Child protection.** The more protective position prevails while unresolved.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** DL-06 · IDN-DMN-001 PART 9.

### EVT-GRD-06 · GuardianAnnotationRecorded
- **Meaning.** A guardian's objection or comment was attached to a record without altering it.
- **Purpose.** Honour STK-INV-003: the guardian owns consent, not the truth of what an organization observed.
- **Statement.** "A guardian annotation was recorded."
- **Owner.** Privacy Officer. **Producer.** `GuardianLink`. **Consumers.** Organization, Development, Audit, Journey.
- **Policies.** `PrivacyPolicy`. **Rules.** STK-INV-003 (attaches, never mutates).
- **Journey.** Annotation is displayed alongside the annotated fact, never replacing it.
- **Audit.** Required. **Child protection.** Gives the family voice without letting either side rewrite history.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** PRG-STK-001 PART 2.1.

### EVT-CON-01 · ConsentGranted
- **Meaning.** A named purpose (P1–P8) is permitted, on stated authority, at a stated assurance level.
- **Purpose.** Make every downstream use of a child's data lawful, specific and revocable.
- **Statement.** "Consent was granted for a purpose."
- **Owner.** Privacy Officer. **Producer.** `Consent`. **Consumers.** Every consuming context; CTI.
- **Policies.** `ConsentPolicy` (closed purpose list; P8 opt-in, L2, prohibited under 13).
- **Rules.** INV-10, INV-12 · BR-14..18 · FR-CON-01..08.
- **Journey.** Unlocks which Journey facets are visible to which audience.
- **Audit.** Required — purpose, authority, assurance at grant, policy version.
- **Child protection.** The age gate is evaluated before consent; an impossible purpose cannot be granted.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** CONSENT-001 P1–P8 · CBO-04.

### EVT-CON-02 · ConsentRefused
- **Meaning.** Authority explicitly declined a purpose.
- **Purpose.** Distinguish refusal from silence, so no one may infer permission from inaction (EP-10).
- **Statement.** "Consent was refused for a purpose."
- **Owner.** Privacy Officer. **Producer.** `Consent`. **Consumers.** Analytics (opt-in rate), CTI.
- **Policies.** `ConsentPolicy`. **Rules.** INV-11. **Journey.** Restricts visibility.
- **Audit.** Required. **Child protection.** Refusal must never degrade the child's football participation.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** CONSENT-001 §4.

### EVT-CON-03 · ConsentRevoked
- **Meaning.** Authority withdrew a previously granted purpose; processing must stop immediately.
- **Purpose.** Make consent genuinely revocable rather than nominally revocable.
- **Statement.** "Consent was revoked for a purpose."
- **Owner.** Privacy Officer. **Producer.** `Consent`. **Consumers.** Every consuming context; Notification; CTI.
- **Policies.** `ConsentPolicy`. **Rules.** INV-13 (immediate; no justification required; history preserved).
- **Journey.** Facets become invisible; the underlying facts remain for the child.
- **Audit.** Required. **Child protection.** Effective on record, not after a batch cycle.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** CONSENT-001 §7 · FR-CON-05.

### EVT-CON-04 · ConsentExpired
- **Meaning.** The basis for a permission lapsed — validity period ended, or assurance fell below the level the purpose requires.
- **Purpose.** Prevent stale consent from silently authorising present-day processing.
- **Statement.** "Consent expired."
- **Owner.** Privacy Officer. **Producer.** `Consent`. **Consumers.** Consuming contexts, Guardian notification, CTI.
- **Policies.** `ConsentPolicy`, `VerificationPolicy`. **Rules.** INV-17 (follows `VerificationDowngraded`).
- **Journey.** As revocation. **Audit.** Required, citing the cause event.
- **Child protection.** Expiry is notified, never silent. **Privacy.** `CHILD-SENSITIVE`.
- **Trace.** CTI validity test, PRG-VIS-001 §9.3.

### EVT-CON-05 · HighRiskRevocationRaised
- **Meaning.** A revocation touches live exposure — an active squad, scouting visibility, a federation submission, or an AI training set.
- **Purpose.** Escalate the cases where delay would cause real harm to a child.
- **Statement.** "A high-risk revocation was raised."
- **Owner.** Child Protection Officer. **Producer.** `Consent`. **Consumers.** Notification, Audit, Review queue, Scouting, Competition, Federation.
- **Policies.** `ConsentPolicy` high-risk triggers. **Rules.** INV-14 — immediate effect; the review queue can never reverse it.
- **Journey.** Immediate visibility withdrawal. **Audit.** Permanent, escalated.
- **Child protection.** Highest priority path in the domain. **Privacy.** `CHILD-SENSITIVE`.
- **Trace.** CONSENT-001 high-risk revocation flow (G0 amendment 4).

### EVT-CON-06 · ConsentPurposeSuspended
- **Meaning.** A permission is inoperative pending restored assurance, without being revoked by the guardian.
- **Purpose.** Distinguish "the family withdrew" from "we no longer trust the basis" — different facts, different remedies.
- **Statement.** "A consent purpose was suspended."
- **Owner.** Privacy Officer. **Producer.** `Consent`. **Consumers.** Consuming contexts, Notification, CTI.
- **Policies.** `ConsentPolicy`, `VerificationPolicy`. **Rules.** INV-17. **Journey.** Facet hidden while suspended.
- **Audit.** Required. **Child protection.** Suspension defaults to the restrictive position. **Privacy.** `CHILD-SENSITIVE`.
- **Trace.** IDN-DMN-001 INV-17 · CTI.

### EVT-CON-07 · AITrainingConsentWithdrawn
- **Meaning.** P8 authority was withdrawn; the child's data must leave the training population within the SLA.
- **Purpose.** Make AI governance an enforceable commitment with a clock, not a policy statement.
- **Statement.** "AI training consent was withdrawn."
- **Owner.** AI Governance Architect. **Producer.** `Consent`. **Consumers.** AI Governance, Audit, Notification.
- **Policies.** `ConsentPolicy` P8 (90-day removal SLA). **Rules.** CONSENT-001 P8 · prohibited under 13.
- **Journey.** None visible. **Audit.** Permanent, with SLA completion evidence.
- **Child protection.** Under-13 data is never in the population to begin with (structural prohibition).
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** CONSENT-001 P8 · Core memory rule.

### EVT-MEM-01 · MembershipStarted
- **Meaning.** A person's affiliation with an organization began, with guardian approval where the person is a minor.
- **Purpose.** Record participation without conceding ownership (Constitution #1).
- **Statement.** "A membership started."
- **Owner.** Football Operations. **Producer.** `Membership`. **Consumers.** Organization, Competition, Journey, NDI.
- **Policies.** `TransferPolicy`, `GuardianPolicy`. **Rules.** INV-20 (guardian approval for both types) · ADR-0003.
- **Journey.** Satisfies the organization dimension of JCS; a second distinct organization contributes to NDI portability.
- **Audit.** Required. **Child protection.** Membership grants an organization access, never ownership.
- **Privacy.** `SENSITIVE`. **Trace.** ADR-0003 · FR-MEM-01..05 · CBO-05.

### EVT-MEM-02 · MembershipEnded
- **Meaning.** Affiliation closed; the access it granted ended at the same moment.
- **Purpose.** Make "the player left" remove access instantly while leaving history untouched.
- **Statement.** "A membership ended."
- **Owner.** Football Operations. **Producer.** `Membership`. **Consumers.** Organization, Authorization, Journey.
- **Policies.** `TransferPolicy`. **Rules.** INV-21, INV-22 (closing never removes history; access ends at once).
- **Journey.** Becomes a historical membership; JCS still credits it.
- **Audit.** Required. **Child protection.** Departure must never cost the child their record.
- **Privacy.** `SENSITIVE`. **Trace.** ADR-0003 · Constitution #1.

### EVT-MEM-03 · SecondaryMembershipAdded
- **Meaning.** A non-exclusive affiliation (camp, academy, school programme) began.
- **Purpose.** Reflect how Indonesian youth football actually works, without diluting eligibility.
- **Statement.** "A secondary membership was added."
- **Owner.** Football Operations. **Producer.** `Membership`. **Consumers.** Organization, Journey, NDI.
- **Policies.** `TransferPolicy`. **Rules.** ADR-0003 (0..N secondary; confers no eligibility or transfer rights).
- **Journey.** Recorded; contributes to NDI where the organizations are independently administered.
- **Audit.** Required. **Child protection.** No secondary affiliation may claim roster rights over the child.
- **Privacy.** `SENSITIVE`. **Trace.** ADR-0003 INV-MEM-01..06.

### EVT-MEM-04 · PlayerTransferred
- **Meaning.** The child's official club changed, with approval and a complete audit trail.
- **Purpose.** Honour Constitution #7 — transfer is a business event, never a field edit.
- **Statement.** "A player was transferred."
- **Owner.** Football Operations + Association Representative. **Producer.** `TransferService` + `Decision`.
- **Consumers.** Competition, Organization, Association, Journey, Notification, NDI.
- **Policies.** `TransferPolicy`, `GuardianPolicy`. **Rules.** INV-18 · DL-04 · ADR-0003. Always paired with EVT-MEM-05 and EVT-DEC-01.
- **Journey.** The defining portability event; roster reconstructable at any past date.
- **Audit.** Permanent, with approving parties. **Child protection.** Guardian approval is mandatory; the child's continuity of play governs disputes.
- **Privacy.** `SENSITIVE`. **Trace.** ADR-0003 · FR-MEM-06/10 · PRG-VIS-001 §4 principle 1.

### EVT-MEM-05 · PrimaryMembershipChanged
- **Meaning.** The single authoritative affiliation moved from one organization to another.
- **Purpose.** Keep the "exactly one active Primary" invariant observable rather than merely asserted.
- **Statement.** "The primary membership changed."
- **Owner.** Football Operations. **Producer.** `TransferService`. **Consumers.** Competition, Organization, Association.
- **Policies.** `TransferPolicy`. **Rules.** INV-18 — never emitted alone; always with EVT-MEM-04.
- **Journey.** Updates current affiliation. **Audit.** Required.
- **Child protection.** Eligibility follows Primary only, so this event is the eligibility hinge.
- **Privacy.** `SENSITIVE`. **Trace.** ADR-0003.

### EVT-MEM-06 · MembershipPromotedToPrimary
- **Meaning.** An existing secondary affiliation became the official one.
- **Purpose.** Prevent a "type change" backdoor around the transfer trail.
- **Statement.** "A secondary membership was promoted to primary."
- **Owner.** Football Operations. **Producer.** `TransferService`. **Consumers.** as EVT-MEM-04.
- **Policies.** `TransferPolicy`. **Rules.** INV-19 — executed **as** a transfer with the full trail · DL-05.
- **Journey.** As transfer. **Audit.** Permanent. **Child protection.** Same guardian approval as any transfer.
- **Privacy.** `SENSITIVE`. **Trace.** ADR-0003.

### EVT-MEM-07 · MembershipSuspended
- **Meaning.** Participation is paused — discipline, safeguarding, or administrative hold — without ending the affiliation.
- **Purpose.** Avoid organizations using deletion as a disciplinary tool.
- **Statement.** "A membership was suspended."
- **Owner.** Association Representative. **Producer.** `Membership`. **Consumers.** Competition, Organization, Notification, Journey.
- **Policies.** `TransferPolicy`, `ReportingPolicy`. **Rules.** Rule 0 governs safeguarding suspensions.
- **Journey.** Recorded as a period, with reason category only. **Audit.** Required.
- **Child protection.** A suspension may never remove the child's Journey or block a transfer to safety.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** PRG-STK-001 lifecycle triggers.

### EVT-VER-01 · VerificationRequested
- **Meaning.** An assurance claim is being examined, either on submission or on a scheduled re-check.
- **Purpose.** Make verification a visible process with a start, not an invisible attribute.
- **Statement.** "Verification was requested." **Owner.** Privacy Officer. **Producer.** `Verification`.
- **Consumers.** Notification, Review queue. **Policies.** `VerificationPolicy`.
- **Rules.** FR-VER-01. **Journey.** None. **Audit.** Required.
- **Child protection.** Evidence never leaves the domain. **Privacy.** `CHILD-SENSITIVE`.
- **Trace.** CONSENT-001 L0–L3 · OQ-02 (open: minimum L1 evidence).

### EVT-VER-02 · VerificationCompleted
- **Meaning.** A claim is now trusted at a stated assurance level.
- **Purpose.** Supply the assurance input every consent and eligibility decision depends on.
- **Statement.** "Verification was completed at a level." **Owner.** Privacy Officer.
- **Producer.** `Verification`. **Consumers.** Person, GuardianLink, Consent, VAP/CTI metrics.
- **Policies.** `VerificationPolicy`. **Rules.** INV-16 — only the level is published, never the evidence.
- **Journey.** Satisfies identity dimension. **Audit.** Required with policy version.
- **Child protection.** Central. **Privacy.** `CHILD-SENSITIVE`. **Trace.** FR-VER-02..05.

### EVT-VER-03 · VerificationRejected
- **Meaning.** The claim was not accepted; the prior assurance level stands unchanged.
- **Purpose.** Distinguish rejection from downgrade — one denies a raise, the other removes trust.
- **Statement.** "Verification was rejected." **Owner.** Privacy Officer. **Producer.** `Verification`.
- **Consumers.** Notification, Review queue. **Policies.** `VerificationPolicy`. **Rules.** FR-VER-06.
- **Journey.** None. **Audit.** Required with reason category.
- **Child protection.** Rejection may never block a child from playing; it limits data purposes only.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** OQ-02.

### EVT-VER-04 · VerificationDowngraded
- **Meaning.** Trust previously granted has been withdrawn — evidence found fraudulent, expired, or superseded.
- **Purpose.** Ensure trust can fall, not only rise.
- **Statement.** "Verification was downgraded." **Owner.** Security Architect.
- **Producer.** `Verification` + `Decision`. **Consumers.** Consent, Competition, Child Protection, Federation.
- **Policies.** `VerificationPolicy`, `ConsentPolicy`. **Rules.** INV-17 · DL-03 — dependent consents suspend immediately; a Decision is mandatory.
- **Journey.** May hide consent-dependent facets. **Audit.** Permanent.
- **Child protection.** Age-fraud remediation path. **Privacy.** `CHILD-SENSITIVE`. **Trace.** DL-03 · BP-04.

### EVT-VER-05 · VerificationUpgraded
- **Meaning.** Assurance moved to a higher level on new evidence.
- **Purpose.** Let families unlock higher-assurance purposes over time without re-registering.
- **Statement.** "Verification was upgraded." **Owner.** Privacy Officer. **Producer.** `Verification`.
- **Consumers.** Consent, CTI, Notification. **Policies.** `VerificationPolicy`, `ConsentPolicy`.
- **Rules.** Consent granted at a lower level is not retroactively upgraded — a new grant is required.
- **Journey.** May reveal previously gated facets. **Audit.** Required.
- **Child protection.** Neutral. **Privacy.** `CHILD-SENSITIVE`. **Trace.** CONSENT-001 assurance ladder.

### EVT-DEC-01 · IdentityDecisionRecorded
- **Meaning.** A consequential DL-01…DL-08 judgement is now permanent and explainable.
- **Purpose.** Honour Constitution #10 — decisions about a child are never unexplained.
- **Statement.** "An identity decision was recorded." **Owner.** Chief Enterprise Architect.
- **Producer.** `Decision`. **Consumers.** Association, Audit, Federation, Journey.
- **Policies.** every policy, by reference. **Rules.** INV-23, INV-24 — immutable; corrections are new linked decisions.
- **Journey.** Decisions affecting the child appear in the Journey in plain language.
- **Audit.** Permanent, with decision owner, evidence reference, and reasoning.
- **Child protection.** Explainability is the child's protection against arbitrary judgement.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** IDN-PRD-001 PART 17 · IDN-DMN-001 A-06.

### EVT-DEC-02 · DecisionCorrectionRecorded
- **Meaning.** An earlier decision was superseded by a new, linked decision.
- **Purpose.** Correct without erasing (EP-03).
- **Statement.** "A decision correction was recorded." **Owner.** Chief Enterprise Architect.
- **Producer.** `Decision`. **Consumers.** Audit, Association, Journey. **Policies.** all, by reference.
- **Rules.** INV-24. **Journey.** Both decisions visible, in order. **Audit.** Permanent.
- **Child protection.** The child sees that a wrong call was fixed, not that it never happened.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** INV-24.

### EVT-DEC-03 · StructuralExceptionRequested / EVT-DEC-04 · StructuralExceptionRefused
- **Meaning.** Someone asked to widen a child-affecting capability; or that request was refused.
- **Purpose.** Stop prohibited capabilities from being relitigated informally (STK-INV-004).
- **Statements.** "A structural exception was requested." / "A structural exception was refused."
- **Owner.** Child Protection Officer. **Producer.** `Decision`. **Consumers.** Council, Child Protection Officer, Audit.
- **Policies.** `PrivacyPolicy`. **Rules.** Refusals recorded as firmly as approvals · Rule 0.
- **Journey.** None. **Audit.** Permanent. **Child protection.** The primary guard on scope creep.
- **Privacy.** `INTERNAL`. **Trace.** PRG-STK-001 STK-INV-004 · DL-08.

### EVT-DEC-05 · PolicyExceptionGranted
- **Meaning.** A time-boxed, named departure from a policy was authorised.
- **Purpose.** Make exceptions visible, bounded and expiring — never permanent silent drift.
- **Statement.** "A policy exception was granted." **Owner.** Chief Enterprise Architect.
- **Producer.** `Decision`. **Consumers.** Audit, Council, affected contexts. **Policies.** the policy departed from.
- **Rules.** An exception may never widen a child-protection prohibition (Rule 0 / STK-INV-004).
- **Journey.** None. **Audit.** Permanent, with expiry. **Privacy.** `INTERNAL`. **Trace.** DL-08.

### EVT-ACT-01 · ActivityRecorded
- **Meaning.** A child actually trained or played, attested by an accountable adult at an organization.
- **Purpose.** The single input that makes the North Star hard to inflate.
- **Statement.** "A qualifying activity was recorded." **Owner.** Football Operations.
- **Producer.** Activity ACL. **Consumers.** Lifecycle evaluation, VAP, NDI, JCS, Journey.
- **Policies.** `ActivityPolicy` (thresholds configurable, never hard-coded).
- **Rules.** INV-30 — organization-recorded and adult-attested only; the same attesting adult counts once for NDI.
- **Journey.** Primary content of the activity dimension. **Audit.** Required, with attester.
- **Child protection.** Attribution to a real accountable adult is a safeguarding control, not only an anti-gaming one.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** PRG-MET-001 · CBO-08.

### EVT-ACT-02 · ActivityRejected
- **Meaning.** A submitted activity failed the anti-corruption/anti-gaming test.
- **Purpose.** Make inflation attempts a recorded fact rather than a silent discard.
- **Statement.** "A submitted activity was rejected." **Owner.** Football Operations.
- **Producer.** Activity ACL. **Consumers.** Analytics (integrity), Review queue, Organization.
- **Policies.** `ActivityPolicy`. **Rules.** PRG-MET-001 anti-gaming rules. **Journey.** None.
- **Audit.** Required. **Child protection.** Never attributed to the child; the organization is accountable.
- **Privacy.** `INTERNAL`. **Trace.** PRG-MET-001 §anti-gaming.

### EVT-ACT-03 · ActivityRetracted
- **Meaning.** A previously accepted activity was withdrawn by its attester or by decision.
- **Purpose.** Allow honest correction without deleting the original attestation.
- **Statement.** "A recorded activity was retracted." **Owner.** Football Operations.
- **Producer.** Activity ACL. **Consumers.** Lifecycle evaluation, VAP, Journey, Audit.
- **Policies.** `ActivityPolicy`, `ReportingPolicy`. **Rules.** Retraction may re-evaluate lifecycle state and must emit the resulting LFC event.
- **Journey.** The activity is shown as retracted, not removed. **Audit.** Required with reason.
- **Child protection.** Mass retraction affecting a child's ACTIVE status triggers Council review.
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** PRG-MET-001.

### EVT-LFC-01..05 · Lifecycle specialisations
Common record for `PlayerVerified`, `PlayerActivated`, `PlayerTemporarilyInactivated`,
`PlayerInactivated`, `PlayerArchived`:
- **Meaning.** The player's standing in the ecosystem moved to a named state under a named policy version.
- **Purpose.** Make VAP computable and auditable; make dormancy visible before it becomes attrition.
- **Statements.** "A player was verified / activated / temporarily inactivated / inactivated / archived."
- **Owner.** Chief Product Officer. **Producer.** `ActivityEvaluationService` (LFC-05 also `Person` on guardian request).
- **Consumers.** VAP, NDI, JCS, CTI reporting; Notification; Competition eligibility; Journey.
- **Policies.** `ActivityPolicy` (window, thresholds, `inactive_after_days`, dormancy, seasonal adjustment), `ReportingPolicy`.
- **Rules.** INV-27, INV-28 — carries `policy_id@version`; never deletes data; never silent where visibility or eligibility is affected. INV-31 — archival is never erasure and is reversible.
- **Journey.** State band shown across the timeline; no facts removed at any state.
- **Audit.** Required, including the policy version each state was computed under.
- **Child protection.** Inactivity is never presented as failure; ~50% non-active is the designed norm (PRG-VIS-001 §10.2).
- **Privacy.** `CHILD-SENSITIVE`. **Trace.** PRG-MET-001 six-state lifecycle · PRG-VIS-001 §3.

### EVT-POL-01 · PolicyVersionActivated / EVT-POL-02 · PolicyVersionRetired
- **Meaning.** A named policy version began, or ceased, governing new decisions.
- **Purpose.** Make every metric and decision reproducible against the rules in force at the time.
- **Statements.** "A policy version was activated." / "A policy version was retired."
- **Owner.** Chief Enterprise Architect. **Producer.** Policy registry (governance aggregate).
- **Consumers.** Every service and every published metric. **Policies.** the policy itself.
- **Rules.** No metric may be published without its `policy_id@version` (PRG-MET-001). Retiring a version never re-computes historical facts.
- **Journey.** None directly; explains why comparable periods differ.
- **Audit.** Permanent. **Child protection.** A policy change that reduces child protection requires Council approval and an ADR.
- **Privacy.** `PUBLIC` (policy metadata), values `INTERNAL`. **Trace.** PRG-MET-001 · NFR-10.

### EVT-POL-03 · PolicyBreachDetected
- **Meaning.** A PRG-VIS-001 §10.4 guardrail was breached — unauthorised minor-data disclosure, an under-13 scouting exposure, or a missed guardian access SLA.
- **Purpose.** Turn the roadmap-halt guardrails into observable facts rather than after-the-fact discoveries.
- **Statement.** "A policy breach was detected." **Owner.** Child Protection Officer.
- **Producer.** Governance aggregate. **Consumers.** Council, Child Protection Officer, Audit, Federation where applicable.
- **Policies.** all. **Rules.** PRG-VIS-001 §10.4 — halts the roadmap regardless of VAP, NDI, JCS or CTI.
- **Journey.** None. **Audit.** Permanent, escalated. **Privacy.** `INTERNAL`.
- **Trace.** PRG-VIS-001 §10.4.

---

## PART 6 — Event Lifecycle

Business stages only. No transport semantics.

| Stage | Business meaning | Governance obligation |
| --- | --- | --- |
| **Created** | The business fact occurred in the real world (a child trained; a guardian signed). | The occurrence time is the business time, not the recording time. |
| **Recorded** | The fact was captured by the platform under an accountable actor. | Attribution and policy version are fixed here and never change. |
| **Observed** | Interested parties became aware of the fact within their permitted view. | Visibility is filtered by consent, role, relationship and age gate. |
| **Consumed** | A context acted on the fact (eligibility recomputed, notification sent, metric updated). | Consumption never mutates the event. |
| **Projected** | The fact contributed to a read model — the Journey, or a metric. | Projections are rebuildable from events alone (PART 12). |
| **Archived** | The fact passed its active retention window but remains available for audit and for the child. | Archival never erases; erasure follows only a lawful, recorded deletion decision. |

A gap between Created and Recorded is normal in Indonesian grassroots football
(paper attendance, offline sessions). The catalogue therefore treats late
recording as expected, not exceptional — but the business time governs every
activity and eligibility computation.

---

## PART 7 — Aggregate Event Matrix

| Aggregate / Service | Publishes | Consumes |
| --- | --- | --- |
| **Person** | IDE-01, IDE-02, IDE-03, IDE-04, IDE-05, IDE-07, IDE-08, LFC-05 | VER-02, VER-04, GRD-02, ACT-01 |
| **GuardianLink** | GRD-01, GRD-02, GRD-03, GRD-04, GRD-06 | VER-02, VER-04, IDE-01, LFC-* (majority) |
| **Consent** | CON-01..CON-07 | GRD-02, GRD-03, GRD-04, GRD-05, VER-02, VER-04, VER-05, POL-01 |
| **Verification** | VER-01..VER-05 | IDE-01, GRD-01, POL-01 |
| **Membership** | MEM-01, MEM-02, MEM-03, MEM-07 | GRD-02, CON-01, VER-02, DEC-01 |
| **Decision** | DEC-01..DEC-05 | IDE-06, GRD-05, VER-04, MEM-04 |
| **TransferService** | MEM-04, MEM-05, MEM-06 | MEM-01, MEM-02, GRD-02, DEC-01, POL-01 |
| **DuplicateResolutionService** | IDE-06, IDE-07 | IDE-01, IDE-02, ACT-01 |
| **GuardianResolutionService** | GRD-03, GRD-04, GRD-05 | GRD-01, GRD-02, CON-01, CON-03 |
| **ActivityEvaluationService** | LFC-01..LFC-05 | ACT-01, ACT-03, VER-02, GRD-02, POL-01 |
| **IdentityRecoveryService** | IDE-08 | VER-02, DEC-01 |
| **Activity ACL** | ACT-01, ACT-02, ACT-03 | MEM-01, IDE-02, POL-01 |
| **Policy registry (governance)** | POL-01, POL-02, POL-03 | — |
| **Journey (read model)** | **nothing — never a producer** | all of the above (PART 12) |

---

## PART 8 — Cross-Context Event Matrix

Business relationships only.

| Consuming context | Events it depends on | Business reason |
| --- | --- | --- |
| **Organization** | IDE-04/05, MEM-01..07, GRD-02 | Know who is affiliated, in what capacity, right now |
| **Competition** | MEM-04, MEM-05, MEM-07, VER-02, VER-04, LFC-02..04, CON-03/05 | Eligibility follows Primary membership plus valid verification and consent |
| **Development** | ACT-01, ACT-03, CON-01/03, GRD-06 | Assessments attach to real, consented activity; guardian objections are visible |
| **Medical** | GRD-01/02/03/04, CON-01/03/05, IDE-02 | Consent authority and identity only; medical facts never enter Identity |
| **Scouting** | CON-01/03/05, VER-02, LFC-02, MEM-04 | Exposure exists only under active consent; under-13 has no path at all (STK-INV-004) |
| **Finance** | MEM-01/02/07, IDE-02 | Participation-driven only; no purpose permits commercial profiling of a child |
| **Notification** | GRD-*, CON-03/05/07, VER-*, MEM-04, IDE-08, LFC-* | Families are told about anything consequential to their child |
| **Analytics** | all except DEC-03/04 | VAP, NDI, JCS, CTI and counter-metrics derive from events only (PART 13) |
| **Federation** | IDE-02, IDE-07, VER-02/04, MEM-04, CON-03/05 | Reference-only identity translation; the federation never receives raw child data outside consented purposes |
| **Association** | MEM-04/05/07, DEC-01, VER-04, LFC-02 | Eligibility verification and dispute resolution |

---

## PART 9 — Business Rules Mapping

| Event family | PRD requirements | Business rules / invariants | Constitution | ADR | Policies |
| --- | --- | --- | --- | --- | --- |
| Identity (IDE) | FR-PER-01..04, FR-FID-01..04, FR-AUT-01..05, FR-ROL-01..05 | BR-01..06, INV-01..06, INV-21 | #2, #3, #11 | ADR-0002 | Privacy, Merge, Recovery |
| Guardian (GRD) | FR-GRD-01..10 | BR-07..13, INV-07..09, STK-INV-003 | #4, #6 | — | Guardian, Verification |
| Consent (CON) | FR-CON-01..08 | BR-14..18, INV-10..14, INV-17 | #4, #5, #6 | — | Consent, Privacy |
| Membership (MEM) | FR-MEM-01..10 | BR-19..24, INV-18..22 | #1, #7, #9 | ADR-0003 | Transfer, Guardian |
| Verification (VER) | FR-VER-01..07 | BR-25..27, INV-15..17 | #4, #6 | — | Verification |
| Decision (DEC) | PART 17 DL-01..08 | INV-23, INV-24, INV-32, INV-38, STK-INV-004 | #10, #6 | ADR-0002/0003 | all (by reference) |
| Activity (ACT) | FR-ACT-01..05 | INV-29, INV-30 | #1, #8 | — | Activity |
| Lifecycle (LFC) | FR-LFC-01..06 | INV-27, INV-28, INV-31 | #6, #8 | — | Activity, Reporting |
| Policy (POL) | NFR-10 | INV-25, INV-26 | #10, #12 | ADR-0001 | all |

---

## PART 10 — Policy Triggers

| Policy | Activated / re-evaluated by | Business consequence |
| --- | --- | --- |
| **VerificationPolicy** | VER-01, VER-02, VER-03, VER-04, VER-05, GRD-01, POL-01 | Sets or withdraws assurance; cascades to consent |
| **ConsentPolicy** | CON-01..07, GRD-02/03/04/05, VER-02/04/05, POL-01 | Determines which purposes are lawful right now |
| **TransferPolicy** | MEM-01, MEM-02, MEM-04, MEM-05, MEM-06, MEM-07, DEC-01 | Governs windows, approvals and the one-active-Primary invariant |
| **ActivityPolicy** | ACT-01, ACT-02, ACT-03, POL-01 | Determines qualifying activity and every lifecycle move |
| **ReportingPolicy** | LFC-01..05, POL-01, POL-02 | Governs how and when metrics are published, with the version stamp |
| **GuardianPolicy** | GRD-01..06, MEM-01, CON-01 | Determines who may act for the child, and the restrictive-position rule |
| **MergePolicy** | IDE-06, IDE-07 | Governs evidence and survivorship in a merge |
| **RecoveryPolicy** | IDE-08, IDE-03 | Governs the assurance required to restore access |
| **PrivacyPolicy** | IDE-01, IDE-04, GRD-06, DEC-03/04 | Governs minimisation and capability scope |
| **JourneyCompletenessPolicy** | LFC-*, ACT-01, MEM-01, VER-02, CON-01 | Governs JCS weighting; consent-unjustified fields weigh zero |

Every policy in IDN-DMN-001 PART 10 has at least one triggering event — see the
completeness check in PART 17.

---

## PART 11 — Decision Events (Detail)

| Decision | Event(s) | Decision owner | Evidence required | Explainability | Audit |
| --- | --- | --- | --- | --- | --- |
| **Identity merge (DL-01)** | IDE-07 + DEC-01 | Platform Data Steward, countersigned by Chief Enterprise Architect | Matching evidence, both Journeys reviewed, survivorship rationale | Plain-language reason on both identities; retired ID resolves forever | Permanent |
| **Guardian conflict (DL-06)** | GRD-05 + DEC-01 | Child Protection Officer | Both positions, relationship evidence, any legal instrument | The restrictive position applied, and why | Permanent |
| **Guardian replacement (DL-02)** | GRD-03 + DEC-01 | Child Protection Officer | Legal or verified custody evidence at required assurance | Why authority moved, and from when — never retroactive | Permanent |
| **Transfer approval (DL-04)** | MEM-04 + MEM-05 + DEC-01 | Organizations + Guardian; Association where disputed | Guardian approval; outgoing acknowledgement or policy override | Point-in-time roster reconstruction for any past date | Permanent |
| **Verification upgrade (DL-03 inverse)** | VER-05 + DEC-01 where discretionary | Privacy Officer | Evidence meeting the target level | Level and policy version published; evidence withheld | Required |
| **Recovery (DL-07)** | IDE-08 + DEC-01 | Security Architect | Assurance proportional to sensitivity | Same-human guarantee stated | Permanent |
| **Consent conflict** | GRD-05, CON-06 + DEC-01 | Privacy Officer, escalating to Child Protection Officer | Both consent positions and their assurance levels | Restrictive position stated as the operative one | Permanent |
| **Policy exception (DL-08)** | DEC-05, or DEC-03/DEC-04 for structural | Council; Child Protection Officer holds a veto | Written justification, expiry, blast radius | Recorded whether granted or refused | Permanent |

Rule 0 applies to every row: where the decision owner's interest and the child's
interest diverge, the child's interest determines the outcome and that reasoning
is written into the decision record.

---

## PART 12 — Journey Projection Mapping

The Journey is a **derived read model**. It publishes nothing (PART 7). It must be
fully rebuildable from the events below and from nothing else.

| Journey dimension | Built from | Removed by | Never affected by |
| --- | --- | --- | --- |
| **Identity** | IDE-01, IDE-02, IDE-07, VER-02 | nothing (identity facts persist) | organization departure |
| **Guardian** | GRD-01, GRD-02, GRD-03, GRD-04, GRD-06 | nothing; authority changes are additive | membership change |
| **Organization** | MEM-01, MEM-03, MEM-04, MEM-05, MEM-06 | nothing; MEM-02/07 mark periods, never delete | consent revocation (visibility only) |
| **Activity** | ACT-01 (ACT-03 marks retraction) | nothing | transfer |
| **Development** | Development-context events referencing ACT-01, annotated by GRD-06 | nothing | transfer |
| **Standing** | LFC-01..LFC-05 | nothing; states are a timeline, not a flag | archival (LFC-05 preserves everything) |
| **Decisions** | DEC-01, DEC-02 affecting the subject | nothing | — |
| **Visibility layer** | CON-01..CON-07 | consent revocation hides facets from third parties, never from the child or guardian | — |

Two constitutional consequences, stated explicitly so no later artefact can
weaken them: **transfer never truncates the Journey**, and **consent revocation
changes who can see the Journey, never what the Journey contains for the child.**

---

## PART 13 — Analytics Projection Mapping

No formulas — those live in PRG-MET-001 and the named policies.

| Metric | Derived from | Guard |
| --- | --- | --- |
| **VAP (North Star)** | IDE-02 + GRD-02 + ACT-01 → LFC-02 | Published only with the `ActivityPolicy` version it was computed under |
| **NDI** | MEM-01, MEM-03, MEM-04, ACT-01 across independently administered organizations | Activity attested by the same adult counts once |
| **JCS** | VER-02, GRD-02, MEM-01, ACT-01, plus Development assessment events | Fields without a justifying consent purpose weigh zero |
| **CTI** | CON-01..CON-07 combined with VER-02/04/05 and age band | An expired or under-assured grant counts as zero, never as consent |
| **NEVER_ACTIVE** | IDE-02 with no qualifying ACT-01 in the window | Counter-metric against registration inflation |
| **TEMPORARILY_INACTIVE → INACTIVE** | LFC-03 → LFC-04 | Silent-attrition counter-metric; not an error state |
| **Onboarding friction** | IDE-01 → first ACT-01 elapsed time | Median, never mean |
| **Consent trust diagnostics** | CON-02, CON-03, CON-05, CON-07, GRD-02 | High-risk revocation count reported separately |
| **Integrity diagnostics** | ACT-02, ACT-03, IDE-06 | Attributed to organizations, never to children |
| **Reporting reproducibility** | POL-01, POL-02 | Any period comparison spanning a policy change is labelled as such |

---

## PART 14 — Privacy & Child Protection

| Event family | Personal data impact | Child-sensitive | Guardian impact | Retention category | Visibility | Purpose limitation |
| --- | --- | --- | --- | --- | --- | --- |
| IDE | High (subject identification) | Yes when the subject is a minor | Notified on IDE-07, IDE-08 | Permanent (identity spine) | Subject, guardian, platform custodian | Identity operation only |
| GRD | High (family relationships) | Yes | Direct — the guardian is a party | Permanent | Subject, guardians, platform | Consent authority only |
| CON | High (lawful basis record) | Yes | Direct — guardian is the grantor for minors | Permanent (ledger, append-only) | Subject, guardian, auditor | Only the purpose named in the grant |
| MEM | Medium | Yes for minors | Approval required | Long-term (Journey) | Subject, guardian, affiliated organizations, association | Participation and eligibility |
| VER | High (assurance about a person) | Yes | Guardian verification included | Long-term; evidence retained separately and minimally | Level published; evidence never | Verification only |
| DEC | High (judgement about a child) | Yes | Notified where affected | Permanent | Subject, guardian, association, auditor | Explainability and audit |
| ACT | Medium | Yes | Visible to guardian | Long-term (Journey) | Subject, guardian, recording organization, aggregate analytics | Participation record |
| LFC | Low-medium (derived standing) | Yes | Notified on visibility/eligibility change | Long-term | Subject, guardian, association aggregates | Metrics and eligibility |
| POL | None (no data subject) | No | No | Permanent | Internal + Council | Governance |

Standing prohibitions restated: no event may carry a child's data into an
advertising, profiling or resale purpose — no such purpose exists on the closed
list and none may be added (PRG-VIS-001 §7.5). No event may create an under-13
scouting exposure; that capability is structurally absent, not permission-denied.

---

## PART 15 — Information Governance

| Event family | Business owner | Data steward | Custodian | Retention | Archiving | Legal hold | Audit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| IDE | Chief Enterprise Architect | Platform Data Steward | Platform | Permanent | Never before majority + statutory period | Suspends all disposal | Permanent |
| GRD | Privacy Officer | Platform Data Steward | Platform | Permanent | With the identity spine | Yes | Permanent |
| CON | Privacy Officer | Privacy Officer | Platform | Permanent, append-only | Never; the ledger is the lawful-basis proof | Yes | Permanent |
| MEM | Football Operations | Organization Data Steward | Platform | Journey lifetime | On LFC-05 | Yes | Required |
| VER | Privacy Officer | Privacy Officer | Platform | Level permanent; evidence minimal-period only | Evidence archived separately | Yes | Required |
| DEC | Chief Enterprise Architect | Governance Steward | Platform | Permanent | Never | Yes | Permanent |
| ACT | Football Operations | Organization Data Steward | Platform | Journey lifetime | On LFC-05 | Yes | Required |
| LFC | Chief Product Officer | Platform Data Steward | Platform | Journey lifetime | With the Journey | Yes | Required |
| POL | Chief Enterprise Architect | Governance Steward | Platform | Permanent | Never | Yes | Permanent |

The platform is **custodian**, never owner, of every child-subject event
(PRG-STK-001 ownership matrix). Guardian data-access requests are fulfilled from
these events within the CONSENT-001 §8 SLA; the fulfilment itself is audited.

---

## PART 16 — Event Invariants

| ID | Invariant | Enforcement |
| --- | --- | --- |
| INV-EVT-01 | An event is immutable once recorded | Corrections are new events (DEC-02) |
| INV-EVT-02 | An event is never updated or deleted | Erasure requires a lawful, recorded decision, and even then a tombstone decision remains |
| INV-EVT-03 | Every event name is past tense | Catalogue review; a command-shaped name fails the gate |
| INV-EVT-04 | No two events carry the same business meaning | Alias table in PART 4, not duplicate entries |
| INV-EVT-05 | The Journey never emits an event | PART 7 — Journey is projection only (Constitution #8) |
| INV-EVT-06 | Every transfer emits MEM-04 **and** MEM-05 **and** DEC-01 | INV-18; a Primary change without a transfer is a defect |
| INV-EVT-07 | Every consent action emits a consent event | Append-only ledger; silence is never a fact (EP-10) |
| INV-EVT-08 | Every verification outcome emits a verification event | Assurance never changes invisibly |
| INV-EVT-09 | Every DL-01..DL-08 decision emits DEC-01 | Explainability (Constitution #10) |
| INV-EVT-10 | Every lifecycle move carries `policy_id@version` | PRG-MET-001; unversioned metrics are unpublishable |
| INV-EVT-11 | No event encodes business meaning in an identifier | ADR-0002 rev.2 |
| INV-EVT-12 | No event may create a capability prohibited for the subject's age band | STK-INV-004; the path is absent, not denied |
| INV-EVT-13 | Business time governs; recording time is metadata | Late recording is expected in grassroots football (PART 6) |
| INV-EVT-14 | An event affecting a child's visibility or eligibility is never silent | INV-28; notification is mandatory |

---

## PART 17 — Completeness Verification

**Every aggregate publishes at least one event.** Person ✓ · GuardianLink ✓ ·
Consent ✓ · Verification ✓ · Membership ✓ · Decision ✓ · Journey — *deliberately
none* (INV-EVT-05, Constitution #8).

**Every policy has a trigger.** Activity ✓ · Verification ✓ · Consent ✓ ·
Guardian ✓ · Transfer ✓ · Merge ✓ · Recovery ✓ · Privacy ✓ · JCS Weighting ✓ ·
Reporting ✓ (PART 10, all ten IDN-DMN-001 policies covered).

**Every Journey dimension derives from events.** Identity · Guardian ·
Organization · Activity · Development · Standing · Decisions · Visibility — all
mapped in PART 12.

**Every metric derives from events.** VAP · NDI · JCS · CTI and all four
counter-metrics — PART 13.

**Orphan check.** No event in PART 4 lacks a consumer in PART 7 or PART 8. No
consumer in PART 8 depends on an event absent from PART 4.

**Coverage gaps closed relative to IDN-DMN-001.** Lifecycle specialisations
(LFC-01..05), guardian conflict and annotation (GRD-05/06), verification upgrade
(VER-05), consent suspension and P8 withdrawal (CON-06/07), activity rejection and
retraction (ACT-02/03), decision correction and exception outcomes (DEC-02/04/05),
membership suspension (MEM-07), and policy lifecycle plus breach (POL-01..03).

**Open items carried forward, not defects:** OQ-02 (minimum L1 evidence) binds to
`VerificationPolicy` values consumed by VER-01..03; OQ-05 (CTI Phase 0 floor) binds
to `ReportingPolicy` values consumed by POL-03. Both are value decisions, not
structural ones.

---

## PART 18 — Acceptance Criteria

| # | Criterion | Status | Evidence |
| --- | --- | --- | --- |
| AC-EVT-01 | Every aggregate has published events | PASS | PART 7 (Journey excepted by constitution) |
| AC-EVT-02 | Every event has a business meaning | PASS | PART 5 |
| AC-EVT-03 | Every event has a producer | PASS | PART 5, PART 7 |
| AC-EVT-04 | Every event has at least one consumer | PASS | PART 7, PART 8 |
| AC-EVT-05 | Every event maps to a policy | PASS | PART 5, PART 10 |
| AC-EVT-06 | Every event has traceability to an approved artefact | PASS | PART 5, PART 9, PART 19 |
| AC-EVT-07 | No CRUD events | PASS | EP-06; no Created/Updated/Deleted names except business-meaningful issuance |
| AC-EVT-08 | No technical events | PASS | EP-05, EP-07; no transport, broker, schema or endpoint content |
| AC-EVT-09 | Child protection impact stated per event | PASS | PART 5, PART 14 |
| AC-EVT-10 | Analytics traceability complete | PASS | PART 13 |
| AC-EVT-11 | Journey never a producer | PASS | PART 7, PART 12, INV-EVT-05 |
| AC-EVT-12 | Constitution items 1–12 each mapped | PASS | PART 19.1 |

---

## PART 19 — Traceability

### 19.1 Constitution → Event

| Constitution item | Enforced by |
| --- | --- |
| 1. Player Owns The Journey | MEM-02, MEM-04 (history untouched) · PART 12 |
| 2. Identity is Opaque | IDE-02 · INV-EVT-11 |
| 3. Football ID Immutable | IDE-02, IDE-07 (retired ID resolves forever) |
| 4. Consent by Default | CON-01..07 · EP-10 |
| 5. Privacy by Design | PART 14 · GRD-06 · VER-02 (level, never evidence) |
| 6. The Child's Interest Prevails | GRD-05, DEC-03/04, CON-05, MEM-07, PART 11 |
| 7. Transfer is Business Event | MEM-04 + MEM-05 + DEC-01 · INV-EVT-06 |
| 8. Journey is Derived Read Model | INV-EVT-05 · PART 12 · exclusion of `JourneyUpdated` |
| 9. One Active Primary Membership | MEM-05, MEM-06 · INV-18 |
| 10. Explainable Decisions | DEC-01, DEC-02 · INV-EVT-09 |
| 11. External Identity is Reference Only | Federation row, PART 8 · IDE-02 |
| 12. No Implementation Before Approval | This artefact contains no schema, transport or code |

### 19.2 Vertical chain

| Layer | Artefact | Link into this catalogue |
| --- | --- | --- |
| Vision | PRG-VIS-001 | North Star and KPIs derive only from PART 13 events |
| Stakeholder | PRG-STK-001 | Consumers in PART 8; STK-INV-001..004 in PART 5 and PART 14 |
| PRD | IDN-PRD-001 | FR/BR mapped in PART 9; DL-01..08 in PART 11 |
| Domain Model | IDN-DMN-001 | Producers in PART 7; 33 events adopted, aliases recorded |
| Canonical Data Model | IDN-CDM-001 | Canonical objects named per event in PART 5 |
| Business Rule | BR-01..32, INV-01..38 | PART 9, PART 16 |
| **Domain Event** | **IDN-EVT-001 (this)** | — |
| Future API Contract | IDN-API-001 | Every state-changing operation must correspond to an event here |
| Future Event Schema | out of scope | Names and meanings fixed here; structure defined later |
| Future Analytics | IDN-ANL-001 | May read only from PART 13 sources |

---

## PART 20 — Council Decisions Required

| ID | Item | Impact if unresolved |
| --- | --- | --- |
| **EDEC-01** | `JourneyUpdated` excluded as a domain event (PART 4.10). Confirm the exclusion or direct that it be retained as a projection checkpoint outside the catalogue. | Structural; affects Constitution #8 interpretation |
| **OQ-02** (carried) | Minimum L1 verification evidence in document-scarce settings | Value only; binds to `VerificationPolicy` |
| **OQ-05** (carried) | CTI Phase 0 floor | Value only; binds to `ReportingPolicy` and POL-03 |

No conflicts with locked artefacts were found. IDN-EVT-001 v1.0 is submitted for
G4 ratification.
