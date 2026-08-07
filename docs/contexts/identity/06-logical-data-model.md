---
id: IDN-ERD-001
title: Enterprise Logical Data Model — Identity Domain (Logical ERD + RLS Concept)
version: 1.0
status: IN_REVIEW
date: 2026-08-07
stage: 3
gate: G3
context_scope: [identity]
authors: [Enterprise Data Architecture Council]
sources:
  [PRG-VIS-001, PRG-STK-001, PRG-MET-001, CONSENT-001, IDN-PRD-001, IDN-DMN-001,
   IDN-CDM-001, IDN-EVT-001, IDN-JRN-001, ADR-0001, ADR-0002, ADR-0003]
north_star_impact: "Defines the logical structures from which Verified Active Players, NDI, JCS and CTI are computed, without allowing any of them to be stored as authoritative facts."
---

# IDN-ERD-001 — Enterprise Logical Data Model, Identity Domain

> **Scope guard.** This is a *logical* model. It contains no DDL, no SQL, no
> migration, no ORM mapping, no trigger, no function, no API and no code.
> Physical data types, index syntax, and policy syntax are deliberately absent
> and are the subject of a later Stage 6 artefact.

---

## PART 1 — Executive Summary

The Identity Domain persists **who a person is in football**, **who may speak for
them**, **what has been permitted**, **where they belong**, **what has been
verified**, **what has been decided**, and **what actually happened** — and
nothing else.

This model realises the 7 aggregates of IDN-DMN-001 and the 13 canonical objects
of IDN-CDM-001 as **15 logical entities** plus **9 reference domains**, governed
by four structural commitments:

1. **Opaque identity.** `FootballIdentity` carries a meaning-free machine
   identifier and a meaning-free display code (ADR-0002 rev. 2). No entity in
   this model derives a business fact from an identifier.
2. **Events are the business history.** `EventStore` is append-only and is the
   authoritative record of what happened. `JourneyProjection` is a derived read
   model and is *never* a source of truth (EDEC-01, Constitution #8).
3. **Typed membership.** `Membership` realises ADR-0003: exactly one ACTIVE
   Primary, zero-to-many Secondary. Eligibility and transfer read Primary only;
   the Journey records both.
4. **Child protection is structural.** Under-13 scouting exposure is not a
   permission that evaluates to false — no entity, attribute, scope, or index in
   this model can express it (STK-INV-004).

Consent is modelled as an *authority record*, never as an evidence record
(STK-INV-002): revoking consent changes what may be *used*, never what was
*recorded*. Guardian commentary attaches as an annotation and never mutates an
assessment or a decision (STK-INV-003).

Data minimisation by capability (STK-INV-001) is expressed in Part 13 and Part 14:
each entity carries a classification, and each consuming boundary receives a
scope, not a table.

**Open items carried forward, not resolved here:** OQ-02 (minimum L1 verification
evidence floor) and OQ-05 (CTI Phase 0 floor). Both are *policy values* held in
`PolicyReference`; this model is correct regardless of their eventual value.

---

## PART 2 — Entity Catalogue

| # | Entity | Kind | Aggregate | Mutability |
| --- | --- | --- | --- | --- |
| E-01 | Person | Aggregate root entity | Person | Mutable (audited) |
| E-02 | FootballIdentity | Entity within Person | Person | Immutable |
| E-03 | GuardianLink | Aggregate root entity | GuardianLink | Mutable state, immutable history |
| E-04 | Consent | Aggregate root entity | Consent | Append-only state transitions |
| E-05 | Membership | Aggregate root entity | Membership | Mutable state, immutable history |
| E-06 | Verification | Aggregate root entity | Verification | Append-only |
| E-07 | Decision | Aggregate root entity | Decision | Immutable |
| E-08 | ActivityRecord | Entity | Activity (Person-scoped) | Append-only |
| E-09 | JourneyProjection | Derived read model | Journey (read model) | Rebuildable |
| E-10 | OrganizationReference | Reference entity | external (Organization ctx) | Replicated, read-only here |
| E-11 | AssociationReference | Reference entity | external (Federation ctx) | Replicated, read-only here |
| E-12 | FederationReference | Reference entity | external (Federation ctx) | Replicated, read-only here |
| E-13 | PolicyReference | Reference entity | Policy | Versioned, append-only |
| E-14 | AuditLog | Entity | cross-aggregate | Append-only, immutable |
| E-15 | EventStore | Entity | cross-aggregate | Append-only, immutable |

Supporting structures that are *parts* of the above, not independent aggregates:

| # | Structure | Belongs to |
| --- | --- | --- |
| S-01 | RoleAssignment | Person |
| S-02 | ConsentPurposeGrant | Consent |
| S-03 | VerificationEvidence | Verification |
| S-04 | GuardianAnnotation | GuardianLink (attaches to a Decision or Verification) |
| S-05 | LifecycleTransition | Person, Membership |
| S-06 | ReferenceDataItem | PolicyReference / reference domains (Part 12) |

**No duplicate entity check:** `Player`, `Coach`, `Referee`, `Guardian`,
`Scout`, `Official` are **not** entities. They are `RoleAssignment` values on a
single `Person` (Constitution #3, "one Person, one account, many roles"). Any
model that reintroduces them as tables violates Football ID First.

---

## PART 3 — Entity Definition

Format: Purpose · Business Owner · Data Steward · Aggregate Owner · Source
Artefact · Canonical Object · Lifecycle.

### E-01 Person
- **Purpose** — The single record of one human being in the football ecosystem, independent of any role, organization, or competition.
- **Business Owner** — The natural person (or their Guardian while a minor).
- **Data Steward** — Platform Identity Steward.
- **Aggregate Owner** — Person aggregate root.
- **Source Artefact** — IDN-DMN-001 §Person; IDN-PRD-001 FR-01..12; PRG-STK-001 G1.
- **Canonical Object** — `Person`.
- **Lifecycle** — REGISTERED → VERIFIED → ACTIVE → TEMPORARILY_INACTIVE → INACTIVE → ARCHIVED (PRG-MET-001). Never hard-deleted while a Journey exists.

### E-02 FootballIdentity
- **Purpose** — The lifetime football identifier of a Person: opaque machine identity plus meaning-free human display code.
- **Business Owner** — The Person.
- **Data Steward** — Platform Identity Steward; issuance stewarded by the issuing Association.
- **Aggregate Owner** — Person (value-object-like entity, one per Person).
- **Source Artefact** — ADR-0002 rev. 2; IDN-DMN-001 §FootballIdentity.
- **Canonical Object** — `Football Identity`.
- **Lifecycle** — ISSUED → (never modified) → ARCHIVED with the Person. No reissue; a replacement is a duplicate-resolution merge, recorded as such.

### E-03 GuardianLink
- **Purpose** — The recorded authority of one Person (Guardian) to act for another Person (minor), with relationship type and verification standing.
- **Business Owner** — Guardian and minor jointly; the minor's interest prevails.
- **Data Steward** — Child Protection Officer.
- **Aggregate Owner** — GuardianLink root.
- **Source Artefact** — CONSENT-001; IDN-DMN-001 §GuardianLink; IDN-JRN-001 J-04..J-07.
- **Canonical Object** — `Guardian Link`.
- **Lifecycle** — CLAIMED → VERIFIED → ACTIVE → SUSPENDED → REVOKED → EXPIRED_BY_MAJORITY (automatic at age of majority).

### E-04 Consent
- **Purpose** — The authority record stating which purposes a Person's data may be used for, by whom granted, at what verification level, and until when.
- **Business Owner** — Person if of age; otherwise the verified Guardian.
- **Data Steward** — Privacy Officer.
- **Aggregate Owner** — Consent root (one per Person, containing per-purpose grants).
- **Source Artefact** — CONSENT-001 P1..P8; IDN-PRD-001 BR-CON-*; IDN-EVT-001 Consent family.
- **Canonical Object** — `Consent`.
- **Lifecycle** — Per purpose: NOT_GRANTED → GRANTED → (RENEWED) → REVOKED | EXPIRED | WITHDRAWN_BY_MAJORITY_REVIEW. High-risk purposes revoke with immediate effect.

### E-05 Membership
- **Purpose** — The affiliation of a Person with an Organization, typed Primary or Secondary, bearing (or not bearing) competition eligibility.
- **Business Owner** — Organization for the affiliation fact; Person for the Journey fact.
- **Data Steward** — Association Officer of the governing Association.
- **Aggregate Owner** — Membership root.
- **Source Artefact** — ADR-0003; IDN-DMN-001 §Membership; IDN-JRN-001 J-10..J-13.
- **Canonical Object** — `Membership`.
- **Lifecycle** — REQUESTED → ACTIVE → SUSPENDED → ENDED → ARCHIVED. Ended memberships are retained permanently as Journey history.

### E-06 Verification
- **Purpose** — The record that an identity, age, guardianship, or organizational claim was checked, by whom, against what evidence, reaching what level.
- **Business Owner** — The verifying authority (Association / Federation / Platform).
- **Data Steward** — Security Architect + Association Officer.
- **Aggregate Owner** — Verification root.
- **Source Artefact** — CONSENT-001 L0..L3; IDN-PRD-001 OQ-02; IDN-DMN-001 §Verification.
- **Canonical Object** — `Verification`.
- **Lifecycle** — SUBMITTED → UNDER_REVIEW → APPROVED | REJECTED | EXPIRED. Append-only: a re-verification is a new record, never an edit.

### E-07 Decision
- **Purpose** — The immutable record of a governed judgement (registration, transfer approval, merge, revocation, exception refusal) with reason, policy version, and explainability trail.
- **Business Owner** — The deciding authority.
- **Data Steward** — Enterprise Governance Steward.
- **Aggregate Owner** — Decision root.
- **Source Artefact** — IDN-JRN-001 DEC-REG..DEC-CPO; IDN-DMN-001 §Decision.
- **Canonical Object** — `Decision`.
- **Lifecycle** — RECORDED (terminal). Reversal is a new Decision that supersedes, never an update.

### E-08 ActivityRecord
- **Purpose** — A single countable football activity attributable to a Person, used to derive activity status and the North Star.
- **Business Owner** — The Organization or Competition that produced it.
- **Data Steward** — Platform Metrics Steward.
- **Aggregate Owner** — Person-scoped; not independently mutable.
- **Source Artefact** — PRG-MET-001; IDN-EVT-001 Activity family.
- **Canonical Object** — `Activity Record`.
- **Lifecycle** — RECORDED → COUNTED | DISCOUNTED (anti-gaming) → ARCHIVED. Never deleted; discounting is annotation, not erasure.

### E-09 JourneyProjection
- **Purpose** — The Person's readable football life story, assembled from events. Enables "Player Owns The Journey" as an experience.
- **Business Owner** — The Person.
- **Data Steward** — Platform Read-Model Steward.
- **Aggregate Owner** — None. **Derived read model. Never a source of truth.**
- **Source Artefact** — IDN-DMN-001 §Journey (read model); IDN-EVT-001 EDEC-01.
- **Canonical Object** — `Journey`.
- **Lifecycle** — BUILT → REFRESHED → REBUILT. Fully reconstructible from `EventStore`; discarding it loses nothing.

### E-10 OrganizationReference
- **Purpose** — A local, read-only reference to an Organization owned by the Organization context, so Identity can affiliate without owning organizational data.
- **Business Owner** — Organization context.
- **Data Steward** — Organization Data Steward.
- **Aggregate Owner** — External.
- **Source Artefact** — IDN-CDM-001 §Cross-context contracts.
- **Canonical Object** — `Organization Reference`.
- **Lifecycle** — REPLICATED → UPDATED → DEPRECATED. Never authored here.

### E-11 AssociationReference
- **Purpose** — Read-only reference to the governing Association used for issuance authority, jurisdiction, and reporting boundary.
- **Business Owner** — Federation context.
- **Data Steward** — Association Representative.
- **Aggregate Owner** — External.
- **Source Artefact** — PRG-STK-001 G6; IDN-CDM-001.
- **Canonical Object** — `Association Reference`.
- **Lifecycle** — REPLICATED → UPDATED → DEPRECATED.

### E-12 FederationReference
- **Purpose** — Read-only reference to the national federation, defining the outermost recognition and reporting boundary.
- **Business Owner** — Federation context.
- **Data Steward** — Federation Representative.
- **Aggregate Owner** — External.
- **Source Artefact** — PRG-STK-001 G7.
- **Canonical Object** — `Federation Reference`.
- **Lifecycle** — REPLICATED → UPDATED.

### E-13 PolicyReference
- **Purpose** — The versioned, configurable rule set applied to a decision, so that every outcome can be re-explained against the exact rules in force at that moment.
- **Business Owner** — Enterprise Architecture Council.
- **Data Steward** — Governance Steward.
- **Aggregate Owner** — Policy.
- **Source Artefact** — IDN-DMN-001 §10 policies; PRG-MET-001 ActivityPolicy.
- **Canonical Object** — `Policy`.
- **Lifecycle** — DRAFT → ACTIVE → SUPERSEDED → RETIRED. Never edited in place; a change is a new version.

### E-14 AuditLog
- **Purpose** — The tamper-evident record of *who accessed or attempted what*, distinct from what happened in the business.
- **Business Owner** — Platform.
- **Data Steward** — Security Architect.
- **Aggregate Owner** — Cross-aggregate.
- **Source Artefact** — IDN-PRD-001 NFR-SEC-*; CONSENT-001 high-risk revocation flow.
- **Canonical Object** — `Audit Entry`.
- **Lifecycle** — WRITTEN (terminal) → ARCHIVED. Retained under R5 Permanent Audit.

### E-15 EventStore
- **Purpose** — The append-only ledger of the 49 business events of IDN-EVT-001. The authoritative business history of the domain.
- **Business Owner** — Platform, as custodian on behalf of the Person.
- **Data Steward** — Enterprise Data Architect.
- **Aggregate Owner** — Cross-aggregate.
- **Source Artefact** — IDN-EVT-001 (all 9 families).
- **Canonical Object** — `Domain Event`.
- **Lifecycle** — APPENDED (terminal) → ARCHIVED to cold history. Never updated, never deleted.

---

## PART 4 — Logical Attributes

Legend — **M** mandatory · **O** optional · **D** derived · **I** immutable ·
**S** sensitive. Classification per Part 13. No SQL types are stated.

### E-01 Person

| Logical name | Business meaning | M/O/D | I | S | Classification | Source of truth |
| --- | --- | --- | --- | --- | --- | --- |
| person_identifier | Opaque internal identity of the human | M | I | — | Internal | Person |
| legal_name | Name as it appears on legal evidence | M | — | S | Confidential | Verification evidence |
| preferred_name | Name the person wishes to be called | O | — | — | Internal | Person |
| date_of_birth | Birth date; drives every age gate | M | — | S | Child Sensitive | Verification |
| age_band | Coarse age band used for capability gating | D | — | — | Internal | derived from date_of_birth |
| is_minor | Whether the person is below majority | D | — | S | Child Sensitive | derived |
| sex_category | Football participation category | O | — | S | Confidential | Verification |
| nationality | Nationality claim | O | — | S | Confidential | Verification |
| contact_channel | Means of reaching the person or guardian | O | — | S | Confidential | Person |
| lifecycle_status | Current 6-state lifecycle position | M | — | — | Internal | LifecycleTransition |
| registered_at | Moment of first entry into the ecosystem | M | I | — | Internal | Event |
| duplicate_resolution_state | Whether this record was merged or superseded | D | — | — | Internal | Decision |

**Not attributes of Person, deliberately:** role, organization, team, position,
rating, scout interest. Roles are `RoleAssignment`; affiliation is `Membership`.

**S-01 RoleAssignment** — role_kind (M), scope_reference (M, org/association/federation), granted_by (M), effective_from (M, I), effective_until (O), status (M). Classification Internal. *No role is ever stored on Person, and no role table stores privileges — privileges derive from role + relationship + consent (Part 14).*

### E-02 FootballIdentity

| Logical name | Business meaning | M/O/D | I | S | Classification | Source of truth |
| --- | --- | --- | --- | --- | --- | --- |
| football_identifier | Opaque lifetime machine identity | M | I | — | Internal | FootballIdentity |
| display_code | Meaning-free human-readable code with structural check suffix | M | I | — | Restricted | FootballIdentity |
| issued_at | When identity was issued | M | I | — | Internal | Event |
| issuing_association_reference | Which association issued it | M | I | — | Internal | AssociationReference |
| person_reference | The human this identity belongs to | M | I | — | Internal | Person |

**Constraint of meaning:** no attribute here may be parsed. Year and region are
data columns, never characters in a code (ADR-0002).

### E-03 GuardianLink

| Logical name | Business meaning | M/O/D | I | S | Classification | Source of truth |
| --- | --- | --- | --- | --- | --- | --- |
| link_identifier | Identity of the guardianship record | M | I | — | Internal | GuardianLink |
| guardian_person_reference | The adult | M | I | S | Guardian Only | Person |
| dependent_person_reference | The minor | M | I | S | Child Sensitive | Person |
| relationship_kind | Nature of the guardianship | M | — | S | Guardian Only | reference data |
| verification_reference | The check that established authority | M | — | S | Restricted | Verification |
| authority_scope | Which consent purposes this guardian may act on | M | — | S | Guardian Only | Policy |
| status | Current standing of the link | M | — | — | Restricted | LifecycleTransition |
| effective_from / effective_until | Period of authority | M / O | — | — | Restricted | Event |
| conflict_flag | Whether a competing guardian claim exists | D | — | S | Child Sensitive | Decision |

**S-04 GuardianAnnotation** — annotation_identifier (M, I), author_guardian_reference (M, I), target_record_reference (M, I — a Decision or Verification), comment_text (M, I, S), response_text (O), annotation_state (M: OPEN → COACH_RESPONDED → RESOLVED). Classification Child Sensitive. *Attaches to, never mutates, the target (STK-INV-003).*

### E-04 Consent

| Logical name | Business meaning | M/O/D | I | S | Classification | Source of truth |
| --- | --- | --- | --- | --- | --- | --- |
| consent_identifier | Identity of the consent record for a Person | M | I | — | Internal | Consent |
| subject_person_reference | Whose data is concerned | M | I | S | Child Sensitive | Person |
| granting_actor_reference | Person or Guardian who granted | M | I | S | Restricted | Person |
| granting_authority_basis | Self / Guardian / Legal | M | I | — | Restricted | Policy |
| verification_level_at_grant | L0..L3 standing at the moment of grant | M | I | — | Restricted | Verification |
| policy_version_applied | Consent policy in force | M | I | — | Internal | PolicyReference |

**S-02 ConsentPurposeGrant** (one per purpose P1..P8):

| Logical name | Business meaning | M/O/D | I | S | Classification |
| --- | --- | --- | --- | --- | --- |
| purpose_code | Which purpose | M | I | — | Restricted |
| grant_state | Current authority state | M | — | S | Restricted |
| granted_at / revoked_at / expires_at | Timing of authority | M / O / O | I | — | Restricted |
| is_high_risk | Whether revocation takes immediate effect | D | — | — | Restricted |
| minimum_verification_required | Level required for this purpose | D | — | — | Internal |
| age_eligibility | Whether the subject's age permits this purpose at all | D | — | S | Child Sensitive |

**P8 (AI model improvement)** is opt-in, requires L2, and is *structurally
unavailable* below 13 — `age_eligibility` cannot evaluate to permitted, and no
grant row may exist.

### E-05 Membership

| Logical name | Business meaning | M/O/D | I | S | Classification | Source of truth |
| --- | --- | --- | --- | --- | --- | --- |
| membership_identifier | Identity of the affiliation record | M | I | — | Internal | Membership |
| person_reference | Who is affiliated | M | I | S | Restricted | Person |
| organization_reference | With whom | M | I | — | Internal | OrganizationReference |
| membership_type | PRIMARY or SECONDARY | M | — | — | Internal | reference data |
| status | Current standing | M | — | — | Internal | LifecycleTransition |
| joined_at / ended_at | Period of affiliation | M / O | I / — | — | Internal | Event |
| end_reason | Why it ended | O | — | S | Restricted | DecisionReason |
| confers_eligibility | Whether this membership grants competition eligibility | D | — | — | Internal | derived: PRIMARY ∧ ACTIVE |
| originating_transfer_reference | Transfer that created it, if any | O | I | — | Restricted | Decision |

### E-06 Verification

| Logical name | Business meaning | M/O/D | I | S | Classification |
| --- | --- | --- | --- | --- | --- |
| verification_identifier | Identity of the check | M | I | — | Internal |
| subject_person_reference | Who was checked | M | I | S | Child Sensitive |
| verification_kind | Identity / Age / Guardianship / Organizational | M | I | — | Internal |
| level_reached | L0..L3 | M | I | — | Restricted |
| verifying_actor_reference | Who performed it | M | I | — | Restricted |
| verifying_authority_reference | Under whose authority | M | I | — | Internal |
| outcome | Approved / Rejected / Expired | M | — | — | Restricted |
| outcome_reason | Why | M | I | S | Restricted |
| policy_version_applied | Verification policy in force | M | I | — | Internal |
| expires_at | When re-verification becomes due | O | — | — | Internal |

**S-03 VerificationEvidence** — evidence_identifier (M, I), evidence_kind (M, I), evidence_holder (M — the custodian, not the platform where avoidable), evidence_reference (M, I, S), captured_at (M, I), retention_class (D). Classification **Child Sensitive**. *Evidence is minimised: the model records that a check occurred and against what class of evidence, and prefers a custodial reference over a stored copy.*

### E-07 Decision

| Logical name | Business meaning | M/O/D | I | S | Classification |
| --- | --- | --- | --- | --- | --- |
| decision_identifier | Identity of the judgement | M | I | — | Internal |
| decision_kind | Which of DEC-REG..DEC-CPO | M | I | — | Internal |
| subject_reference | Person, Membership, or Consent concerned | M | I | S | Restricted |
| deciding_actor_reference | Who decided | M | I | — | Restricted |
| deciding_authority_reference | Under what authority | M | I | — | Internal |
| outcome | The judgement | M | I | — | Restricted |
| decision_reason_code | Coded reason | M | I | — | Restricted |
| explanation_narrative | Human-readable justification | M | I | S | Restricted |
| policy_version_applied | Rules in force | M | I | — | Internal |
| child_interest_assessment | How Rule 0 was applied where interests conflicted | M | I | S | Child Sensitive |
| supersedes_decision_reference | Prior decision reversed | O | I | — | Restricted |
| decided_at | When | M | I | — | Internal |

`child_interest_assessment` is **mandatory on every Decision**. A Decision that
cannot state how the child's interest was weighed is not a valid Decision.

### E-08 ActivityRecord

| Logical name | Business meaning | M/O/D | I | S | Classification |
| --- | --- | --- | --- | --- | --- |
| activity_identifier | Identity of the activity fact | M | I | — | Internal |
| person_reference | Who participated | M | I | S | Restricted |
| activity_kind | Match / Training / Assessment / Competition appearance | M | I | — | Internal |
| occurred_on | Business date of the activity | M | I | — | Internal |
| attributed_organization_reference | Which organization produced it | M | I | — | Internal |
| recorded_by_actor_reference | Who recorded it | M | I | — | Restricted |
| counting_state | Counted or discounted | D | — | — | Internal |
| discount_reason | Anti-gaming reason where discounted | O | I | — | Restricted |
| activity_policy_version | Counting rules in force | M | I | — | Internal |

### E-09 JourneyProjection

| Logical name | Business meaning | M/O/D | I | S | Classification |
| --- | --- | --- | --- | --- | --- |
| projection_identifier | Identity of the projection instance | M | — | — | Internal |
| person_reference | Whose journey | M | — | S | Restricted |
| timeline_entries | Ordered, readable life-story entries | D | — | S | Restricted |
| completeness_dimensions | Identity / Organization / Activity / Development coverage | D | — | — | Internal |
| journey_completeness_score | JCS for this person | D | — | — | Internal |
| network_breadth | Distinct organizations across both membership types | D | — | — | Internal |
| consent_trust_indicator | CTI contribution for this person | D | — | — | Restricted |
| built_from_event_position | Ledger position the projection is current to | D | — | — | Internal |
| last_rebuilt_at | Freshness marker | D | — | — | Internal |

**Every attribute is derived.** Nothing here may be written directly.

### E-10/E-11/E-12 Reference entities

Common shape: reference_identifier (M, I), canonical_name (M), parent_reference
(O — Organization → Association → Federation), jurisdiction (M), status (M),
replicated_at (D), source_context (M, I). Classification **Internal**; the
Federation reference is additionally **Federation Only** for reporting scope.

### E-13 PolicyReference

| Logical name | Business meaning | M/O/D | I | S | Classification |
| --- | --- | --- | --- | --- | --- |
| policy_identifier | Which policy | M | I | — | Internal |
| policy_type | Verification / Consent / Membership / Guardian / Reporting / Activity / Transfer / Duplicate / Lifecycle / Explainability | M | I | — | Internal |
| version | Monotonic version marker | M | I | — | Internal |
| parameters | Named, configurable rule values | M | I | — | Internal |
| effective_from / effective_until | Period in force | M / O | I | — | Internal |
| approved_by_reference | Council approval | M | I | — | Internal |
| status | Draft / Active / Superseded / Retired | M | — | — | Internal |

OQ-02 and OQ-05 are **parameters**, not schema. Their resolution changes a
policy version, never this model.

### E-14 AuditLog

| Logical name | Business meaning | M/O/D | I | S | Classification |
| --- | --- | --- | --- | --- | --- |
| audit_identifier | Identity of the audit entry | M | I | — | Internal |
| actor_reference | Who acted or attempted | M | I | — | Restricted |
| acting_role | Under which role assignment | M | I | — | Restricted |
| action_kind | Read / Write / Export / Decision / Access-Denied | M | I | — | Restricted |
| resource_reference | What was touched | M | I | S | Restricted |
| access_basis | Role + relationship + consent basis relied upon | M | I | — | Restricted |
| outcome | Permitted or refused | M | I | — | Restricted |
| child_data_involved | Whether child-sensitive data was in scope | D | I | S | Child Sensitive |
| occurred_at | When | M | I | — | Internal |

Access to child-sensitive resources is audited **including refusals** — a refusal
pattern is itself a child-protection signal.

### E-15 EventStore

| Logical name | Business meaning | M/O/D | I | S | Classification |
| --- | --- | --- | --- | --- | --- |
| event_identifier | Identity of the recorded fact | M | I | — | Internal |
| event_name | Past-tense business event name | M | I | — | Internal |
| event_family | One of the 9 families | M | I | — | Internal |
| producing_aggregate | Which aggregate asserted it | M | I | — | Internal |
| subject_person_reference | Whose life this concerns, where applicable | O | I | S | Restricted |
| occurred_at | Business time | M | I | — | Internal |
| recorded_at | Ledger time | M | I | — | Internal |
| sequence_position | Total order within the ledger | M | I | — | Internal |
| causation_reference | The event or command that caused it | O | I | — | Internal |
| correlation_reference | The journey instance it belongs to | O | I | — | Internal |
| policy_version_applied | Rules in force when asserted | O | I | — | Internal |
| business_facts | The minimal facts the event asserts | M | I | S | Restricted |

---

## PART 5 — Relationship Model

No foreign keys are declared; these are business relationships.

| # | From | Relationship | To | Business cardinality | Logical cardinality |
| --- | --- | --- | --- | --- | --- |
| R-01 | Person | **Composition** — identity cannot exist without the person | FootballIdentity | one person has exactly one football identity | 1 : 1 |
| R-02 | Person | **Aggregation** — roles are held by, not part of | RoleAssignment | a person holds many roles over life | 1 : 0..N |
| R-03 | Person (guardian) | **Association** | GuardianLink | an adult may protect several minors | 1 : 0..N |
| R-04 | Person (minor) | **Association** | GuardianLink | a minor may have several guardians | 1 : 0..N |
| R-05 | Person | **Composition** | Consent | one consent record per person | 1 : 1 |
| R-06 | Consent | **Composition** | ConsentPurposeGrant | one grant per purpose P1..P8 | 1 : 0..8 |
| R-07 | Person | **Association** | Membership | many memberships over life | 1 : 0..N |
| R-08 | Membership | **Reference** | OrganizationReference | affiliation target | N : 1 |
| R-09 | Person | **Association** | Verification | many checks over time | 1 : 0..N |
| R-10 | Verification | **Composition** | VerificationEvidence | evidence belongs to the check | 1 : 1..N |
| R-11 | Decision | **Reference** | Person / Membership / Consent | one subject per decision | N : 1 |
| R-12 | Decision | **Reference** | PolicyReference | rules relied upon | N : 1 |
| R-13 | GuardianAnnotation | **Association** | Decision / Verification | attaches without mutating | N : 1 |
| R-14 | Person | **Association** | ActivityRecord | activities accumulate | 1 : 0..N |
| R-15 | ActivityRecord | **Reference** | OrganizationReference | attribution | N : 1 |
| R-16 | EventStore | **Reference** | Person | events concern a person | N : 0..1 |
| R-17 | JourneyProjection | **Derivation** (not ownership) | EventStore | built from the ledger | 1 : N |
| R-18 | Person | **Association** | JourneyProjection | one projection per person | 1 : 0..1 |
| R-19 | OrganizationReference | **Reference** | AssociationReference | governance hierarchy | N : 1 |
| R-20 | AssociationReference | **Reference** | FederationReference | governance hierarchy | N : 1 |
| R-21 | AuditLog | **Reference** | any resource | audit points at everything | N : 1 |
| R-22 | Membership / Verification / Consent / Decision / Activity | **Reference** | PolicyReference | versioned rule application | N : 1 |
| R-23 | Person | **Composition** | LifecycleTransition | state history belongs to the person | 1 : 1..N |
| R-24 | Decision | **Self-reference** | Decision | supersession chain | N : 0..1 |

**Ownership statements.** The Person owns their Journey. The Organization owns
the affiliation fact but not the Person. The Association owns issuance and
verification authority but not the identity. The Platform is **custodian**, never
owner, of personal information (IDN-CDM-001).

**Forbidden relationships** — asserted here so a later physical model cannot
introduce them: Organization → Person (ownership); Scout → Person under 13 (any
relationship); Commercial Partner → any person-level entity; Venue → any
person-level entity beyond a booking count.

---

## PART 6 — Aggregate Mapping

| Aggregate (IDN-DMN-001) | Root entity | Contained entities/structures | Reference entities consulted |
| --- | --- | --- | --- |
| Person | E-01 Person | E-02 FootballIdentity, S-01 RoleAssignment, S-05 LifecycleTransition | AssociationReference, PolicyReference |
| GuardianLink | E-03 GuardianLink | S-04 GuardianAnnotation | Person, Verification, PolicyReference |
| Consent | E-04 Consent | S-02 ConsentPurposeGrant | Person, GuardianLink, Verification, PolicyReference |
| Verification | E-06 Verification | S-03 VerificationEvidence | Person, AssociationReference, PolicyReference |
| Membership | E-05 Membership | S-05 LifecycleTransition | Person, OrganizationReference, Decision, PolicyReference |
| Decision | E-07 Decision | — | all subjects, PolicyReference |
| Journey (read model) | E-09 JourneyProjection | — | EventStore (source), Person |
| *(cross-aggregate)* | E-15 EventStore, E-14 AuditLog | — | all |
| *(policy)* | E-13 PolicyReference | S-06 ReferenceDataItem | — |
| *(metrics)* | E-08 ActivityRecord | — | Person, OrganizationReference, PolicyReference |

**Aggregate integrity rule:** no entity inside one aggregate is read or written
through another aggregate's internals. Cross-aggregate contact is by reference
identifier and by event only.

---

## PART 7 — Invariant Mapping

### INV-IDN — Identity

| Invariant | Statement | Enforcing entity |
| --- | --- | --- |
| INV-IDN-01 | One human being has exactly one Person record | Person + Decision (merge) |
| INV-IDN-02 | Every ACTIVE Person has exactly one FootballIdentity | Person ⊕ FootballIdentity |
| INV-IDN-03 | `football_identifier` and `display_code` are immutable for life | FootballIdentity |
| INV-IDN-04 | `display_code` is unique and non-sequential | FootballIdentity |
| INV-IDN-05 | No identifier encodes a business fact | FootballIdentity |
| INV-IDN-06 | An additional role never creates an additional Person | RoleAssignment |
| INV-IDN-07 | Lifecycle transitions follow the 6-state order and are recorded | LifecycleTransition |
| INV-IDN-08 | A merged Person is superseded, never deleted | Person + Decision |

### INV-MEM — Membership (ADR-0003)

| Invariant | Statement | Enforcing entity |
| --- | --- | --- |
| INV-MEM-01 | At most one ACTIVE Primary Membership per Person | Membership |
| INV-MEM-02 | Zero-to-many Secondary Memberships concurrently | Membership |
| INV-MEM-03 | Only Primary confers competition eligibility | Membership (`confers_eligibility`) |
| INV-MEM-04 | Transfer operates on Primary only | Decision + Membership |
| INV-MEM-05 | Promoting Secondary to Primary is a transfer, not an edit | Decision + EventStore |
| INV-MEM-06 | One Organization holds at most one active Membership per Person | Membership |
| INV-MEM-07 | Ended memberships persist permanently in history | Membership + EventStore |
| INV-MEM-08 | Zero ACTIVE Primary makes a Person TEMPORARILY_INACTIVE-eligible, never deleted | Person + Membership |

### INV-CON — Consent

| Invariant | Statement | Enforcing entity |
| --- | --- | --- |
| INV-CON-01 | A minor's consent is granted by a verified Guardian only | Consent + GuardianLink |
| INV-CON-02 | Each purpose has its own grant; no bundling | ConsentPurposeGrant |
| INV-CON-03 | P8 requires opt-in and L2, and is structurally absent under 13 | ConsentPurposeGrant |
| INV-CON-04 | High-risk revocation takes effect immediately, then notifies, then audits | ConsentPurposeGrant + AuditLog |
| INV-CON-05 | Revocation changes usability, never the evidence record | Consent vs Verification/EventStore |
| INV-CON-06 | Consent Authority ≠ Evidence Authority | Consent, Decision (STK-INV-002) |
| INV-CON-07 | Every grant records the verification level in force at grant time | Consent |
| INV-CON-08 | Data minimisation by capability governs every read | Consent + Part 14 scopes (STK-INV-001) |

### INV-INF — Information / structural

| Invariant | Statement | Enforcing entity |
| --- | --- | --- |
| INV-INF-01 | No context defines its own player identity | FootballIdentity |
| INV-INF-02 | Reference entities are read-only replicas | Organization/Association/Federation Reference |
| INV-INF-03 | Roles are never stored on the Person record | RoleAssignment |
| INV-INF-04 | Guardian annotation attaches, never mutates | GuardianAnnotation (STK-INV-003) |
| INV-INF-05 | Under-13 scouting capability is absent, not denied | *no entity, no scope, no index* (STK-INV-004) |
| INV-INF-06 | Every Decision states its child-interest assessment | Decision (Rule 0) |
| INV-INF-07 | Every rule application names a policy version | PolicyReference on all consumers |
| INV-INF-08 | The Journey is derived and never authoritative | JourneyProjection |

### INV-EVT — Event

| Invariant | Statement | Enforcing entity |
| --- | --- | --- |
| INV-EVT-01 | Events are immutable once appended | EventStore |
| INV-EVT-02 | Event names are past tense and never CRUD | EventStore |
| INV-EVT-03 | Every event names a producing aggregate | EventStore |
| INV-EVT-04 | Ledger order is total and gap-free | EventStore (`sequence_position`) |
| INV-EVT-05 | Correction is a compensating event, never an update | EventStore |
| INV-EVT-06 | `JourneyUpdated` does not exist (EDEC-01) | EventStore exclusion |
| INV-EVT-07 | Every business state change has a corresponding event | EventStore + Part 9 |
| INV-EVT-08 | Event facts are minimised — no payload beyond the asserted fact | EventStore |

---

## PART 8 — Policy Mapping

| Policy | Applies to entity | Governs | Parameter examples (values live in PolicyReference) |
| --- | --- | --- | --- |
| **Verification Policy** | Verification, VerificationEvidence, Consent | Which evidence classes reach L0..L3; expiry intervals | minimum L1 evidence floor (**OQ-02, open**), re-verification interval |
| **Consent Policy** | Consent, ConsentPurposeGrant | Purpose catalogue P1..P8, high-risk classification, minimum level per purpose, age gates | high-risk purpose set, P8 minimum age and level, revocation SLA |
| **Membership Policy** | Membership | Primary uniqueness, secondary limits, end reasons, transfer windows | max concurrent secondary, cooling-off window |
| **Guardian Policy** | GuardianLink, GuardianAnnotation | Relationship kinds, authority scope, conflict resolution, majority expiry | age of majority, competing-claim resolution order |
| **Reporting Policy** | JourneyProjection, ActivityRecord, references | Aggregation floors, anonymisation thresholds, boundary visibility | minimum cohort size for aggregate release (**OQ-05 CTI floor, open**) |
| **Activity Policy** | ActivityRecord | Counting rule, window, anti-gaming, seasonal adjustment | ≥2 events on ≥2 distinct dates within the window; window length |
| Transfer Policy | Membership, Decision | Approval chain for primary transfer | approver roles, notice period |
| Duplicate Resolution Policy | Person, Decision | Merge criteria and supersession | match confidence threshold |
| Lifecycle Policy | Person, LifecycleTransition | Transition eligibility and dormancy | inactivity threshold |
| Explainability Policy | Decision | Required narrative depth and retention | mandatory child-interest statement |

**Coverage assertion:** every policy in IDN-DMN-001 §10 binds to at least one
entity; every entity that applies a rule stores `policy_version_applied`.

---

## PART 9 — Event Persistence

No broker. Persistence only.

```text
Aggregate asserts a business fact
        │
        ▼
   EventStore (append-only, totally ordered)
        │
        ├──► Projection    → JourneyProjection, analytics read models
        ├──► Audit         → AuditLog (access), distinct from business fact
        └──► Business History → permanent, queryable record of the domain
```

| Event family (IDN-EVT-001) | Primary persistence | Derived structures |
| --- | --- | --- |
| Identity (issuance, merge, lifecycle) | EventStore | Person state, JourneyProjection Identity dimension |
| Guardian | EventStore | GuardianLink state, Journey Guardian entries |
| Consent | EventStore | ConsentPurposeGrant state, CTI inputs |
| Membership | EventStore | Membership state, NDI inputs, Journey Organization dimension |
| Verification | EventStore | Verification state, JCS Identity dimension |
| Decision | EventStore | Decision records, explainability trail |
| Activity | EventStore | ActivityRecord counting state, VAP inputs |
| Lifecycle | EventStore | Person/Membership status, dormancy reporting |
| Policy | EventStore | PolicyReference version history |

**Separation of ledgers.** `EventStore` answers *what happened in football*.
`AuditLog` answers *who looked and who tried*. Neither substitutes for the other;
both are append-only, and only the audit ledger records refusals.

**Replay contract.** Applying the ledger in `sequence_position` order to an empty
state reconstructs every derived structure identically. Any structure that cannot
be reconstructed this way is, by definition, a source of truth and must be an
entity — not a projection.

---

## PART 10 — Journey Projection

**Constitutional position.** The Journey is the Person's story and the Person owns
it — but the *record* is derived. `JourneyProjection` holds no fact that is not
already in `EventStore`. It may be dropped and rebuilt at any time with zero
business loss. Nothing writes to it except the projector. It is never an
authorization subject, never a decision input, and never exported as evidence.

**Construction.**

```text
EventStore  ──filter: events with subject_person_reference = P
            ──order:  sequence_position ascending
            ──fold:   event → timeline entry (business language, not system language)
            ──enrich: OrganizationReference / AssociationReference names
            ──gate:   ConsentPurposeGrant + age band decide what a given viewer may see
            ──score:  JCS dimensions, network breadth, CTI contribution
            ──stamp:  built_from_event_position, last_rebuilt_at
                      ▼
              JourneyProjection(P)
```

**Dimensions of completeness (JCS):** Identity (person + football identity +
verification), Organization (membership history), Activity (countable records),
Development (assessments and progression recorded elsewhere, referenced here).

**Portability proof (G2 requirement).** Because the projection folds the event
ledger and never the current membership, ending every membership changes nothing
in the history. The story survives the door.

**Consent-gated rendering.** Revoking a purpose changes what the projection
*shows a given viewer*, never what the ledger contains. The rebuild after a
revocation is immediate for high-risk purposes.

**Excluded by decision (EDEC-01):** there is no `JourneyUpdated` event. A refresh
is a projection checkpoint, not a business fact.

---

## PART 11 — Audit Model

| Entity | Append only | Mutable | Immutable | Soft delete | Archive | Legal hold |
| --- | --- | --- | --- | --- | --- | --- |
| Person | — | yes (audited) | identifiers only | yes (ARCHIVED state) | yes | applicable |
| FootballIdentity | — | — | **yes, fully** | no | with Person | applicable |
| GuardianLink | state history | status fields | history entries | yes (REVOKED) | yes | applicable |
| Consent | **yes** | — | grants once written | no | yes | applicable |
| Membership | state history | status fields | joined_at, type change via transfer | no (ENDED, not deleted) | yes | applicable |
| Verification | **yes** | — | **yes** | no | yes | **yes** |
| Decision | **yes** | — | **yes** | no | yes | **yes** |
| ActivityRecord | **yes** | counting_state only | occurrence facts | no | yes | applicable |
| JourneyProjection | — | rebuildable | — | discardable | no | no |
| OrganizationReference | — | replica refresh | — | deprecation | yes | no |
| AssociationReference | — | replica refresh | — | deprecation | yes | no |
| FederationReference | — | replica refresh | — | deprecation | yes | no |
| PolicyReference | **yes** (new version) | status only | parameters | no | yes | **yes** |
| AuditLog | **yes** | — | **yes** | no | yes | **yes** |
| EventStore | **yes** | — | **yes** | no | cold history | **yes** |

**Erasure semantics.** A valid erasure request suppresses *personal identifiers*
and *contact data* while preserving the anonymised skeleton of decisions,
verifications, and events required for competition integrity and child
protection. Erasure never removes a decision that protected a child.

---

## PART 12 — Reference Data Model

Each reference domain is a governed, versioned code list owned by the Council.
Values are business vocabulary, not enumerated types in code.

**VerificationLevel** — L0 Unverified · L1 Basic · L2 Verified · L3 Authoritative. Ordered; L2 is the floor for high-risk purposes. L1's evidence floor is **OQ-02, open**.

**ConsentPurpose** — P1 Platform participation · P2 Organization membership administration · P3 Competition participation · P4 Development and assessment · P5 Federation and association reporting · P6 Aggregate analytics · P7 Talent visibility (age-gated) · P8 AI model improvement (opt-in, L2, structurally absent under 13).

**MembershipType** — PRIMARY (exactly one active, eligibility-bearing) · SECONDARY (0..N, non-eligibility-bearing).

**DecisionReason** — Registration approved/refused · Verification insufficient · Guardian authority unproven · Guardian conflict resolved · Transfer approved/refused · Duplicate merged · Consent revoked (high-risk) · Structural exception refused · Lifecycle transition applied · Activity discounted (anti-gaming) · Policy change applied.

**GuardianRelationship** — Parent · Legal guardian · Court-appointed representative · Institutional guardian · Other verified caregiver.

**ActivityStatus** — Recorded · Counted · Discounted · Archived.

**LifecycleStatus** — REGISTERED · VERIFIED · ACTIVE · TEMPORARILY_INACTIVE · INACTIVE · ARCHIVED (PRG-MET-001; order is mandatory).

**PolicyType** — Verification · Consent · Membership · Guardian · Reporting · Activity · Transfer · Duplicate Resolution · Lifecycle · Explainability.

**AgeBand** — UNDER_13 (structural protections apply) · 13_TO_15 · 16_TO_17 · ADULT. Derived from date of birth, never entered. `UNDER_13` is the band at which scouting capability is *absent*.

---

## PART 13 — Security Classification

| Entity | Public | Internal | Restricted | Confidential | Child Sensitive | Guardian Only | Federation Only |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Person | — | structure | status, roles | legal name, contact, nationality | DOB, is_minor | — | — |
| FootballIdentity | — | machine id | display_code | — | — | — | — |
| GuardianLink | — | — | status, period | — | dependent reference, conflict flag | relationship, guardian identity | — |
| Consent | — | policy version | grant states | — | subject reference, age eligibility | granting actor | — |
| Membership | — | organization, type | person reference, end reason | — | — | — | roster reporting |
| Verification | — | kind, policy | level, outcome | verifying actor | subject, evidence | — | authority reporting |
| Decision | — | kind, policy | outcome, reason, narrative | — | child-interest assessment | annotations | appeal reporting |
| ActivityRecord | — | kind, date, org | person reference, discount reason | — | — | — | aggregate reporting |
| JourneyProjection | — | — | full projection | — | minor's timeline | guardian view | — |
| OrganizationReference | name | full record | — | — | — | — | — |
| AssociationReference | name | full record | — | — | — | — | — |
| FederationReference | name | full record | — | — | — | — | jurisdiction data |
| PolicyReference | type, version | parameters | — | — | — | — | — |
| AuditLog | — | — | full record | — | child_data_involved | — | — |
| EventStore | — | family, order | facts | — | subject-linked facts | — | — |

**Data minimisation by capability (STK-INV-001).** Venue-type stakeholders reach
booking, field, schedule and capacity only — no row in this model. Commercial
partners reach aggregate, anonymised counts only, above the reporting-policy
cohort floor. Neither appears anywhere in Part 14 scopes.

---

## PART 14 — Logical RLS Model

Expressed as boundaries and scopes. No SQL, no policy syntax.

**Evaluation order (Zero Trust, PRG-STK-001):**

```text
Person → Role → Relationship → Consent → Age Gate → Policy → Scope → Decision
```

Every step can only *narrow*. No step can widen a scope that a prior step denied.
Absence of an applicable scope is denial by default.

### Resource / Actor / Ownership

| Resource | Owner | Actor classes with any scope |
| --- | --- | --- |
| Person, FootballIdentity | the Person (Guardian while minor) | Self, Guardian, Association Officer (jurisdiction), Platform Steward |
| GuardianLink | the minor's interest | Guardian party, Child Protection Officer, Association Officer |
| Consent | Person or verified Guardian | Self, Guardian, Privacy Officer |
| Membership | Organization (fact) / Person (history) | Self, Guardian, Organization Officer, Association Officer |
| Verification | verifying authority | Subject, Guardian, Verifying Officer, Association |
| Decision | deciding authority | Subject, Guardian, Deciding Officer, Council auditor |
| ActivityRecord | producing Organization | Self, Guardian, Organization Officer, Metrics Steward (aggregate) |
| JourneyProjection | the Person | Self, Guardian, actors with an active relationship + consent |
| EventStore, AuditLog | Platform custodian | Platform Steward, Council auditor (no ordinary read path) |
| PolicyReference | Council | all actors, read-only |

### Boundaries

- **Player Boundary** — a Person always reaches their own record, their own identity, their own consent, their own memberships, their own journey. This boundary is never narrowed by an organization.
- **Guardian Boundary** — a verified, ACTIVE GuardianLink projects the Player Boundary of the dependent onto the Guardian, limited by `authority_scope`, and it terminates automatically at majority. A revoked or suspended link collapses the boundary immediately.
- **Organization Boundary** — an Organization Officer reaches person-level data only for Persons with an ACTIVE Membership in that Organization, only for attributes their capability requires, and only for the duration of that membership. Membership end collapses the boundary; the history remains with the Person, not the Organization.
- **Association Boundary** — an Association Officer reaches Persons and Memberships within its jurisdiction for issuance, verification, transfer and integrity purposes. Reads are audited and never include evidence artefacts beyond the verification outcome unless the officer is the verifying authority.
- **Federation Boundary** — the Federation reaches **aggregate and roster-level** reporting within national scope. Person-level access requires an explicit governed purpose (competition integrity, safeguarding) and is audited individually.
- **Isolation** — Organizations are mutually invisible. No Organization can enumerate, search, or infer another Organization's roster. Cross-organization visibility exists only through the Person's own Journey, shown by the Person.
- **Inheritance** — Organization ⊂ Association ⊂ Federation for *reporting scope only*. Authority does **not** inherit downward: a Federation scope never grants an Organization scope, and no ancestor inherits the Guardian Boundary.
- **Visibility of the Journey** — the Journey is visible in full to Self and Guardian; to everyone else it is filtered by relationship, consent purpose, and age band, computed per viewer, never stored per viewer.

### Structural prohibitions (capability absent, not denied)

- No actor class exists that reaches a Person in AgeBand `UNDER_13` for a scouting or talent-visibility purpose. There is no scope to grant, no flag to flip, and no policy parameter that enables it.
- No commercial-partner actor class reaches any person-level resource.
- No venue actor class reaches any person-level resource.
- No actor class may write to `EventStore`, `AuditLog`, or `JourneyProjection` through an application path.

---

## PART 15 — Logical Index Strategy

Conceptual access paths only.

| Access path | Purpose | Logical key | Notes |
| --- | --- | --- | --- |
| **Natural Lookup** | Find a person at a registration desk | name + date of birth + organization scope | Fuzzy, rate-limited, always audited; never a bulk enumeration path |
| **Identity Lookup** | Resolve a football identity | football identifier; display code | Display-code lookup is authenticated and rate-limited (ADR-0002) |
| **Membership Lookup** | Current roster; a person's affiliations | organization + status + type; person + status | Must make "the one active primary" cheap to assert |
| **Consent Lookup** | May this use proceed, right now? | person + purpose + state | Must be fast enough to gate every read; revocation visible immediately |
| **Event Lookup** | Replay and history | sequence position; subject person + occurred_at; family | Ordered scan is the primary pattern |
| **Audit Lookup** | Who accessed this child's data? | resource + occurred_at; actor + occurred_at | Child-sensitive investigations are a first-class query |
| **Reporting Lookup** | VAP, NDI, JCS, CTI | person + occurred_on window; organization; policy version | Reads projections, never aggregates the ledger live |

**Anti-pattern, prohibited:** any access path that permits enumeration of minors
— sequential scan by identifier, alphabetical browse without scope, or
display-code range query. Enumerability is a child-protection failure, not a
performance concern.

---

## PART 16 — Partition Strategy

Conceptual; the physical model decides mechanism.

| Data class | Partition dimension | Rationale |
| --- | --- | --- |
| Event history | Time (business period), with family as a secondary grouping | Ledger grows monotonically and is read mostly by recency and by subject |
| Audit | Time, with child-sensitive access separable | Retention differs; investigations are recency-biased; permanent audit must be cheaply archivable |
| Activity | Season / competition period | Counting windows are periodic; VAP is computed per window |
| History (ended memberships, expired verifications, closed decisions) | Time of closure | Cold data dominates volume and is rarely read |
| Person and current-state entities | **Not partitioned** | Small, hot, and always accessed by identity |
| JourneyProjection | Not partitioned; rebuildable per person | Derived and disposable |

Jurisdiction (association/federation) is a **scope**, not a partition: partitioning
by region would re-encode a mutable business fact into physical layout, the same
error ADR-0002 rejected for identifiers.

---

## PART 17 — Performance Considerations

- **Projection over aggregation.** VAP, NDI, JCS and CTI are read from maintained projections. Live aggregation over the ledger is a reporting fallback, never the product path.
- **Caching.** Cache only derived, consent-gated views, and key the cache on the consent state and policy version so a revocation invalidates rather than lingers. Never cache an authorization decision beyond the request.
- **Read models.** Roster view, guardian dashboard, and journey timeline are distinct read models with distinct refresh expectations; identity and consent state refresh immediately, analytics may lag within the reporting policy.
- **Aggregate boundary.** Transactional consistency is required *inside* an aggregate (one active primary membership; one identity per person). Across aggregates, eventual consistency through the ledger is acceptable and expected — except for consent revocation of high-risk purposes, which is immediate by constitutional requirement.
- **History.** Closed records are read rarely and in bulk; keep them out of hot paths so a large Journey never slows a registration desk.
- **Archiving.** Archive by moving to cold history with the same immutability guarantees. Archiving is never deletion and never breaks replay.
- **Low-bandwidth reality.** Pitch-side and registration-desk paths (identity lookup, roster, consent check) are the paths that must be cheap; analytics may be expensive.

---

## PART 18 — Data Retention

| Class | Retention | Archive | Delete | Legal hold |
| --- | --- | --- | --- | --- |
| **R1 Journey lifetime** — Person, FootballIdentity, Membership history, Journey-bearing events | Lifetime of the Journey | On lifecycle ARCHIVED | Never while the Journey exists | Yes |
| **R2 Child data** — DOB, guardian links, child-sensitive attributes | Minimum necessary; reviewed at majority | On majority + review | Identifiers erasable on valid request; protective decisions retained anonymised | Yes |
| **R3 Consent data** — grants, revocations, purpose history | Retained beyond revocation as proof of authority | Yes | Never (revocation is a state, not a deletion) | Yes |
| **R4 Verification evidence** | Shortest period that sustains the level; prefer custodial reference over stored copy | Yes | Evidence artefacts deletable after level is established, per policy | Yes |
| **R5 Permanent audit** — AuditLog, EventStore, Decision | Permanent | Cold history | Never | Yes |
| **R6 Derived** — JourneyProjection, analytics read models | Disposable | No | Freely rebuilt | No |
| **R7 Reference replicas** | While the source exists | On deprecation | Yes | No |

**Majority review.** At the age of majority the Guardian Boundary expires
automatically, and the now-adult Person is offered a review of purposes granted
on their behalf as a minor — including the right to withdraw P7 and P8.

**Right to erasure vs. child protection.** Where they conflict, Rule 0 decides:
records that exist to protect a child are retained in anonymised form, and the
retention decision itself is recorded as a `Decision` with a child-interest
assessment.

---

## PART 19 — Data Quality

| Dimension | Rule | Measured on |
| --- | --- | --- |
| **Completeness** | An ACTIVE Person has identity, verification level ≥ L1, one active primary membership, and a consent record | Person, JCS |
| **Consistency** | Membership type counts satisfy INV-MEM-01 at all times; lifecycle status matches the latest transition | Membership, Person |
| **Accuracy** | Date of birth is supported by verification evidence at the claimed level | Verification |
| **Uniqueness** | One human → one Person; one Person → one display code; no duplicate active membership per organization | Person, FootballIdentity, Membership |
| **Integrity** | Every reference resolves; no decision without a policy version; no event without a producing aggregate | all |
| **Explainability** | Every Decision carries reason code, narrative, policy version, and child-interest assessment | Decision |
| **Traceability** | Every entity traces to an approved artefact (Part 21); every derived value traces to its events | all |
| **Timeliness** | High-risk consent revocation is reflected in every read path immediately; projections state their freshness | Consent, JourneyProjection |
| **Minimisation** | No entity stores an attribute no capability requires | all (STK-INV-001) |

---

## PART 20 — Acceptance Criteria

| Criterion | Status | Evidence |
| --- | --- | --- |
| All 7 aggregates realised | ✓ | Part 6 |
| All 13 canonical objects realised | ✓ | Part 3 (canonical object per entity) |
| All business rules realised | ✓ | Part 7 (INV-IDN, INV-MEM, INV-CON, INV-INF, INV-EVT) |
| All 49 events have persistence | ✓ | Part 9 (9 families → EventStore, no exception) |
| All 21 journeys have a projection path | ✓ | Part 10 (fold over subject-linked events) |
| All 10 policies have an entity | ✓ | Part 8 → PolicyReference + consumer entities |
| Every entity has a business owner and steward | ✓ | Part 3 |
| No orphan entity | ✓ | Every entity appears in ≥1 relationship in Part 5 |
| No duplicate entity | ✓ | Part 2 note — roles are assignments, not entities |
| Privacy by Design | ✓ | Parts 13, 14, 18 |
| Child Protection by Design | ✓ | STK-INV-004 structural absence, Parts 5, 13, 14, 15 |
| Zero Trust | ✓ | Part 14 evaluation order, deny-by-default |
| Football ID single source of truth | ✓ | INV-IDN-01..05, INV-INF-01 |
| Journey is derived, never authoritative | ✓ | Part 10, INV-INF-08, EDEC-01 |
| Rule 0 enforced structurally | ✓ | Decision.child_interest_assessment mandatory |
| No SQL/DDL/migration/ORM/API/code emitted | ✓ | Whole document |

**Carried forward, not blocking this artefact:** OQ-02 and OQ-05 remain open
policy *values* held in `PolicyReference`. Their resolution changes no entity,
attribute, relationship, or boundary in this model.

---

## PART 21 — Traceability Matrix

```text
PRG-VIS-001 (Vision, North Star, phases, NDI/JCS/CTI)
   └─ PRG-STK-001 (41 stakeholders, STK-INV-001..004)
        └─ IDN-PRD-001 (BP-01..10, FR×58, BR×32)
             └─ IDN-DMN-001 (7 aggregates, 38 invariants, 10 policies)
                  └─ IDN-CDM-001 (13 canonical objects, vocabulary)
                       └─ IDN-EVT-001 (49 events, 9 families, EDEC-01)
                            └─ IDN-JRN-001 (21 journeys, 12 decisions)
                                 └─ IDN-ERD-001 (15 entities, 9 reference domains)  ← this artefact
                                      └─ Future: Physical Data Model
                                           └─ Future: Migration
```

| Logical entity | Aggregate | Canonical object | Key events | Key journeys | Policies | Future physical intent |
| --- | --- | --- | --- | --- | --- | --- |
| Person | Person | Person | Identity, Lifecycle families | J-01 Register, J-20 Merge | Lifecycle, Duplicate | person table |
| FootballIdentity | Person | Football Identity | FootballIdentityIssued | J-02 Issue identity | Verification | football_identity table |
| GuardianLink | GuardianLink | Guardian Link | Guardian family | J-04..J-07 | Guardian | guardian_link + annotation tables |
| Consent | Consent | Consent | Consent family | J-08 Grant, J-09 Revoke | Consent | consent + purpose_grant tables |
| Membership | Membership | Membership | Membership family | J-10..J-13 Transfer | Membership, Transfer | membership table |
| Verification | Verification | Verification | Verification family | J-03, J-14 | Verification | verification + evidence tables |
| Decision | Decision | Decision | Decision family | all decision points | Explainability | decision table |
| ActivityRecord | Activity | Activity Record | Activity family | J-16 Record activity | Activity | activity_record table (partitioned) |
| JourneyProjection | Journey (read model) | Journey | *(consumer only)* | J-18 View journey | Reporting | materialised read model |
| OrganizationReference | external | Organization Reference | *(replication)* | J-10..J-13 | — | organization_reference table |
| AssociationReference | external | Association Reference | *(replication)* | J-02, J-14 | Reporting | association_reference table |
| FederationReference | external | Federation Reference | *(replication)* | J-19 Report | Reporting | federation_reference table |
| PolicyReference | Policy | Policy | Policy family | all | all | policy_version table |
| AuditLog | cross | Audit Entry | *(access, not business)* | J-21 Investigate | — | audit_log table (partitioned) |
| EventStore | cross | Domain Event | all 49 | all 21 | all | event_store table (partitioned) |

---

## Council sign-off block

| Council role | Concern | Position |
| --- | --- | --- |
| Chief Enterprise Architect | Stage discipline, no implementation leakage | Satisfied |
| Enterprise Data Architect | Aggregate and canonical realisation | Satisfied |
| Domain Architect | Aggregate integrity, no reach-through | Satisfied |
| Information Architect | Vocabulary consistency with IDN-CDM-001 | Satisfied |
| PostgreSQL Architect | Conceptual index/partition strategy is implementable | Satisfied; physical model deferred |
| Security Architect | Zero Trust boundaries, deny-by-default, audit of refusals | Satisfied |
| Privacy Officer | Minimisation, retention, erasure semantics | Satisfied |
| Child Protection Officer | Structural absence of under-13 exposure; Rule 0 on every Decision | Satisfied |
| AI Governance Architect | P8 isolation and under-13 structural exclusion | Satisfied |
| Federation Representative | Reporting boundary without person-level default access | Satisfied |
| Association Representative | Issuance and verification authority represented | Satisfied |

**Gate G3 recommendation:** IDN-ERD-001 v1.0 submitted for Council review.
Next artefact after approval: **IDN-API-001** (OpenAPI contract, Stage 4, G4).
