---
id: IDN-CDM-001
title: Enterprise Canonical Data Model — Identity Domain
version: 1.0
status: IN_REVIEW
date: 2026-08-07
stage: 2
gate: G4
context: identity
depends_on: [PRG-VIS-001, PRG-STK-001, PRG-MET-001, CONSENT-001, IDN-PRD-001, IDN-DMN-001, ADR-0001, ADR-0002, ADR-0003]
governs: [IDN-EVT-001, IDN-API-001, IDN-ERD-001]
---

# IDN-CDM-001 — Enterprise Canonical Data Model (Identity)

> Scope note. This artefact defines **business meaning of information**. It contains
> no schema, no datatype, no ERD, no API and no code. Physical representation is
> decided later in IDN-ERD-001 (G3 physical) and IDN-API-001 (G4 contract).

---

## PART 1 — Executive Summary

The Identity Canonical Data Model is the enterprise vocabulary that every other
bounded context must speak when it refers to a human being in Indonesian youth
football. It exists because the same real-world fact — "this child plays here" —
is today recorded in a dozen incompatible local vocabularies, none portable, none
owned by the child.

The model fixes thirteen canonical business objects, their meaning, their owner,
their data subject and their semantic relationships. It is deliberately smaller
than the domain model: IDN-DMN-001 describes *behaviour* (aggregates, services,
invariants); IDN-CDM-001 describes *information* — what an enterprise consumer is
allowed to understand a piece of data to mean, and who is accountable for it.

Three consequences follow and are non-negotiable:

1. **Meaning does not travel with permission.** A context may know that a
   canonical object exists without being entitled to its attributes
   (STK-INV-001).
2. **The Journey is a derived view, never a source.** No context may treat the
   Journey as authoritative input (Constitution #9).
3. **External identifiers are references, never identity.** Federation and
   association numbers are attributes of a relationship, never a substitute for
   Football Identity (Constitution #11).

No conflict with an approved artefact was found while producing this model. Two
values remain Council-owned and are carried forward unchanged from IDN-PRD-001:
**OQ-02** (minimum L1 evidence) and **OQ-05** (CTI Phase 0 floor). Neither blocks
the semantics below; both bind to Reference Data value sets in PART 8.

---

## PART 2 — Canonical Principles

| ID | Principle | Statement |
| --- | --- | --- |
| CDM-P-01 | One Meaning, One Name | Every business concept has exactly one canonical name. Local names are synonyms, never alternatives. |
| CDM-P-02 | Meaning Before Structure | A term enters the model only with a business definition an SSB administrator could read aloud and agree with. |
| CDM-P-03 | Subject Before System | Every object declares its data subject before it declares its owner. Where the subject is a child, Rule 0 governs every unresolved question. |
| CDM-P-04 | Opacity Is Semantic | Identifiers carry no business fact (ADR-0002). Any consumer deriving meaning from an identifier's shape is in violation. |
| CDM-P-05 | Authoritative or Derived, Never Both | Each attribute is declared once as authoritative or derived. Derived values may never be written back. |
| CDM-P-06 | Consent Qualifies Meaning | Data lawfully held is not therefore usable. Usability is per Consent Purpose (CONSENT-001). |
| CDM-P-07 | Explainability Is Information | A decision that changed identity information is itself canonical information, retained with its reason. |
| CDM-P-08 | Reference, Don't Absorb | Organization, Association and Federation are referenced by Identity, never mastered by it. |
| CDM-P-09 | Absence Over Denial | Where child protection forbids a use, the information is not modelled for that consumer at all (STK-INV-004). |
| CDM-P-10 | Retention Is a Business Property | Every attribute carries a retention category assigned by business meaning, not by storage convenience. |

---

## PART 3 — Canonical Vocabulary

Format: **Canonical Name** — definition · *synonyms* · ❌ forbidden · owner · lifecycle.

| Canonical Name | Business Definition | Synonyms (accepted, non-canonical) | Forbidden Terms | Business Owner | Lifecycle |
| --- | --- | --- | --- | --- | --- |
| **Person** | A single human being in the ecosystem, one record per human regardless of roles held. | individual, human, member | "user account", "player account" | Platform Governance | Registered → Archived |
| **Football Identity** | The permanent, opaque football identity of a Person, plus its human-readable display code. | Football ID, FID | "player number", "registration number" | Platform Governance (custodian); Person (subject) | Issued → Immutable for life |
| **Guardian Link** | The recorded, verified protective relationship between an adult Person and a minor Person. | parent link, wali | "parent account", "child sub-account" | Guardian | Claimed → Verified → Ended |
| **Consent** | An explicit, timestamped, revocable authorization for one Consent Purpose. | permission, izin | "terms acceptance", "blanket consent" | Guardian (minor) or Person (adult) | Granted → Active → Revoked / Expired |
| **Membership** | A time-bounded, typed affiliation between a Person and an Organization Reference. Confers access, never ownership. | affiliation, keanggotaan | "SSB's player", "owned player", "contract" | Organization (record) / Person (journey fact) | Pending → Active → Ended |
| **Verification** | The recorded outcome of an evidence-based assessment of a claim about a Person. | KYC, validasi | "approval", "activation" | Verifying Organization / Association | Requested → Assessed → Level held → Revoked |
| **Decision** | An immutable record of an identity-affecting judgement, its reason and its actor. | ruling, keputusan | "audit log entry", "note" | Platform Governance | Raised → Decided → Immutable |
| **Journey** | The derived chronological view of a Person's football life across all organizations. | passport history, riwayat | "journey table", "journey master" | Person (subject); Platform (projection) | Continuously re-derived |
| **Activity Record** | A qualifying, organization-recorded, adult-attested football event involving a Person. | attendance, kehadiran | "check-in", "log" | Recording Organization | Recorded → Attested → Counted / Disqualified |
| **Organization Reference** | Identity's read-only handle on an SSB, club, or academy mastered by the Organization context. | org, SSB ref | "organization table" | Organization Context | Mirrors source lifecycle |
| **Association Reference** | Identity's read-only handle on a provincial/regional governing body. | asosiasi | — | Association | Mirrors source lifecycle |
| **Federation Reference** | Identity's read-only handle on a national federation body and its external identifier. | federasi, PSSI ref | "federation ID as identity" | Federation | Mirrors source lifecycle |
| **Policy Reference** | A named, versioned configuration object whose values qualify a published fact. | ruleset, config | "hard-coded threshold", "constant" | Platform Governance + Council | Drafted → Active → Superseded |
| **Consent Purpose** | One of the eight closed-list lawful reasons for processing (P1…P8). | purpose, tujuan | "general use", "improvement" | Privacy Officer | Fixed by CONSENT-001 |
| **Age Band** | The business-meaningful bracket of a Person's age governing capability presence. | age gate | "birthdate check" | Child Protection Officer | Derived, re-evaluated over time |
| **Lifecycle Status** | The current state of a Person in the six-state model (PRG-MET-001). | status | "active flag", "deleted" | Platform Governance | State machine |

Enterprise-wide forbidden terms from `docs/glossary.md` remain in force and are
not restated here.

---

## PART 4 — Canonical Business Objects

Thirteen objects, each traceable to an approved artefact. Nothing in Identity may
be modelled outside this list without a Council amendment.

| # | Canonical Object | Category | Justification (traceability) |
| --- | --- | --- | --- |
| CBO-01 | Person | Master | IDN-DMN-001 §Aggregates; PRD BP-01 |
| CBO-02 | Football Identity | Master | ADR-0002 rev.2; Constitution #2, #3 |
| CBO-03 | Guardian Link | Master | CONSENT-001; PRD BP-04 |
| CBO-04 | Consent | Master | CONSENT-001 P1..P8 |
| CBO-05 | Membership | Master | ADR-0003; Constitution #8 |
| CBO-06 | Verification | Master | PRD FR-VER-*; OQ-02 |
| CBO-07 | Decision | Master (immutable) | Constitution #10; PRD DL-01..08 |
| CBO-08 | Journey | Derived (read model) | Constitution #1, #9 |
| CBO-09 | Activity Record | Transactional | PRG-MET-001 |
| CBO-10 | Organization Reference | Reference | PRG-STK-001; ADR-0003 |
| CBO-11 | Association Reference | Reference | PRG-STK-001 |
| CBO-12 | Federation Reference | Reference | Constitution #11 |
| CBO-13 | Policy Reference | Governance | PRG-MET-001 ActivityPolicy; JCS policy |

No orphan objects: every object above appears in at least one relationship in
PART 6 and at least one cross-context contract in PART 13.

---

## PART 5 — Business Meaning

| Object | Purpose | Business Meaning | Owner | Consumers | Business Responsibility |
| --- | --- | --- | --- | --- | --- |
| **Person** | Anchor every football fact to one human | "This is one human being, and only one" | Platform Governance | All contexts | Guarantee singularity; prevent duplicate humans and prevent wrongful merge |
| **Football Identity** | Make the human referenceable for life | "This human's football identity, unchanged by any move" | Platform Governance | All contexts, Federation | Issue once, never re-issue, never encode facts |
| **Guardian Link** | Locate the adult accountable for a child | "This adult is legally responsible for this child" | Guardian | Identity, Notification, Competition, Development | Keep protection current; end it when it ends in reality |
| **Consent** | Make lawful use decidable per purpose | "This use of this child's data is authorized right now" | Guardian / adult Person | All contexts before any use | Honour revocation immediately; never infer consent |
| **Membership** | State where a Person plays and on what terms | "This Person is affiliated here, primarily or additionally" | Organization | Competition, Analytics, Scouting, Finance | Keep exactly one active Primary; never claim ownership |
| **Verification** | State how strongly a claim is evidenced | "We know this to level Ln, on this evidence" | Verifying body | Identity, Competition, Federation | Never overstate a level; record the evidence basis |
| **Decision** | Explain every identity change | "This changed, for this reason, by this actor" | Platform Governance | Guardian, Association, Audit | Immutable; readable by the affected Guardian |
| **Journey** | Give the child a portable record | "Everything this Person has done in football" | Person (subject) | Player, Guardian, Scout (age-gated), Federation | Complete and derived; never edited directly |
| **Activity Record** | Prove football actually happened | "A real, attested football event took place" | Recording Organization | Metrics, Analytics, Development | Attest honestly; disqualification is a business outcome |
| **Organization Reference** | Point at an organization without owning it | "The place, as the Organization context defines it" | Organization Context | Identity | Never fork the definition |
| **Association Reference** | Point at a governing body | "The regional authority for this scope" | Association | Identity, Competition | Keep scope current |
| **Federation Reference** | Carry an external federation handle | "How the federation refers to this Person, externally" | Federation | Identity, Federation integration | Never treated as identity |
| **Policy Reference** | Qualify every published number | "This figure means what this policy version says" | Platform Governance + Council | Metrics, Analytics, Reporting | Version everything; never publish a bare number |

---

## PART 6 — Canonical Relationships

Semantic statements only. No cardinality notation, no keys.

```text
Person                 has                      Football Identity
Person                 holds                    Role
Person                 is subject of            Journey
Guardian (Person)      protects                 Person (minor)
Guardian Link          is evidenced by          Verification
Guardian               authorizes               Consent
Consent                authorizes               Consent Purpose
Consent                qualifies                use of Person information
Membership             affiliates               Person with Organization Reference
Membership             is typed as              Membership Type
Membership             confers                  Competition Eligibility (Primary only)
Verification           asserts                  a claim about Person
Verification           grants                   Verification Level
Activity Record        evidences                football participation of Person
Activity Record        is attested by           an accountable adult Person
Activity Record        is counted under         Policy Reference (ActivityPolicy)
Journey                is derived from          Membership, Activity Record, Verification, Decision
Decision               explains                 an identity change
Decision               cites                    Policy Reference
Organization Reference is mastered by           Organization Context
Association Reference  governs scope of         Organization Reference
Federation Reference   externally names         Person
Policy Reference       qualifies                every published metric
Age Band               governs                  capability presence for Person
Lifecycle Status       summarises               Person participation state
```

Prohibited semantic statements — these must never appear in any downstream model:

```text
Organization           owns                     Person          ❌ (Constitution #1)
Football Identity      encodes                  region | year   ❌ (ADR-0002)
Federation Reference   identifies               Person          ❌ (Constitution #11)
Journey                is written by            any context     ❌ (Constitution #9)
Membership (Secondary) confers                  eligibility     ❌ (ADR-0003)
```

---

## PART 7 — Canonical Attributes

Columns: Classification (Identifying / Descriptive / Relational / Evidential /
Derived / Governance) · Sensitivity (PART 12 value) · Mutability (Immutable /
Correctable / Mutable / Append-only) · Source of Truth · Derived or Authoritative
· Visibility · Retention Category (R1 Lifetime-of-Journey · R2 Duration-of-
Relationship · R3 Policy-Window · R4 Evidence-Retention · R5 Permanent-Audit).

### CBO-01 Person

| Canonical Attribute | Business Meaning | Class | Sensitivity | Mutability | Owner | Source of Truth | A/D | Visibility | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Person Reference | The one handle for this human | Identifying | Restricted | Immutable | Platform | Identity | A | All contexts | R1 |
| Legal Name | Name as evidenced | Descriptive | Child Sensitive | Correctable | Person/Guardian | Identity | A | Consent-scoped | R1 |
| Preferred Name | Name used in daily football | Descriptive | Restricted | Mutable | Person | Identity | A | Broad | R1 |
| Date of Birth | Birth date as evidenced | Descriptive | Child Sensitive | Correctable (Decision required) | Person/Guardian | Identity | A | Guardian Only + age gate | R1 |
| Age Band | Business age bracket | Derived | Restricted | Derived | Child Protection | Identity | D | Broad | R3 |
| Sex/Category | Competition category basis | Descriptive | Child Sensitive | Correctable | Person/Guardian | Identity | A | Competition-scoped | R1 |
| Contact Point | Reachable channel | Descriptive | Confidential | Mutable | Person/Guardian | Identity | A | Guardian Only | R2 |
| Locality | Area of participation | Descriptive | Restricted | Mutable | Person | Identity | A | Aggregate for partners | R2 |
| Lifecycle Status | Six-state participation state | Derived | Internal | Derived | Platform | Metrics | D | Broad | R3 |
| Never Active Flag | Registration-inflation guard | Derived | Internal | Derived | Platform | Metrics | D | Internal | R3 |

### CBO-02 Football Identity

| Canonical Attribute | Business Meaning | Class | Sensitivity | Mutability | Owner | Source of Truth | A/D | Visibility | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Football Identity Reference | Lifetime opaque football identity | Identifying | Restricted | Immutable | Platform | Identity | A | All contexts | R1 |
| Display Code | Human-speakable, meaning-free code | Identifying | Restricted | Immutable | Platform | Identity | A | Rate-limited, authenticated lookup | R1 |
| Issuance Moment | When identity was issued | Evidential | Internal | Immutable | Platform | Identity | A | Governance | R5 |
| Issuing Organization | Who issued it | Evidential | Internal | Immutable | Platform | Identity | A | Governance | R5 |
| Identity Standing | Active / suspended-by-decision | Governance | Internal | Mutable via Decision | Platform | Identity | A | Broad | R1 |

### CBO-03 Guardian Link

| Canonical Attribute | Business Meaning | Class | Sensitivity | Mutability | Owner | Source of Truth | A/D | Visibility | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Protected Person | The child protected | Relational | Child Sensitive | Immutable | Guardian | Identity | A | Guardian Only | R2 |
| Guardian Person | The accountable adult | Relational | Confidential | Immutable | Guardian | Identity | A | Guardian Only | R2 |
| Guardian Relationship | Nature of responsibility | Descriptive | Confidential | Correctable | Guardian | Identity | A | Guardian Only | R2 |
| Protection Standing | Claimed / verified / ended | Governance | Confidential | Mutable | Guardian | Identity | A | Guardian Only | R2 |
| Evidence Basis | What established the link | Evidential | Confidential | Append-only | Verifying body | Verification | A | Governance | R4 |
| Consent Authority Flag | May this guardian grant consent | Governance | Confidential | Mutable via Decision | Privacy Officer | Identity | A | Guardian Only | R2 |

### CBO-04 Consent

| Canonical Attribute | Business Meaning | Class | Sensitivity | Mutability | Owner | Source of Truth | A/D | Visibility | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Consent Subject | Whose data | Relational | Child Sensitive | Immutable | Person/Guardian | Identity | A | Guardian Only | R5 |
| Granting Authority | Who granted | Relational | Confidential | Immutable | Guardian | Identity | A | Guardian Only | R5 |
| Consent Purpose | Which of P1..P8 | Descriptive | Restricted | Immutable | Privacy Officer | CONSENT-001 | A | All contexts (as gate) | R5 |
| Consent Standing | Active / revoked / expired | Governance | Restricted | Append-only | Guardian | Identity | A | All contexts (as gate) | R5 |
| Grant Moment / Revocation Moment | When it changed | Evidential | Restricted | Append-only | Guardian | Identity | A | Governance | R5 |
| Required Verification Level | Level needed for this purpose | Governance | Internal | Policy-driven | Privacy Officer | Policy | D | Governance | R3 |
| High-Risk Indicator | Whether revocation is high-risk | Derived | Restricted | Derived | Privacy Officer | Identity | D | Governance | R5 |

### CBO-05 Membership

| Canonical Attribute | Business Meaning | Class | Sensitivity | Mutability | Owner | Source of Truth | A/D | Visibility | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Member Person | Who is affiliated | Relational | Child Sensitive | Immutable | Organization | Identity | A | Org-scoped + Guardian | R1 |
| Organization Reference | Where | Relational | Internal | Immutable | Organization | Organization ctx | A | Broad | R1 |
| Membership Type | Primary or Secondary | Descriptive | Internal | Mutable via Decision | Organization | Identity | A | Broad | R1 |
| Membership Standing | Pending / active / ended | Governance | Internal | Mutable | Organization | Identity | A | Broad | R1 |
| Start Moment / End Moment | Affiliation window | Evidential | Internal | Correctable | Organization | Identity | A | Broad | R1 |
| Eligibility Conferred | Whether it grants play rights | Derived | Internal | Derived | Competition | Identity | D | Competition | R3 |
| Ending Reason | Why it ended | Evidential | Restricted | Immutable | Organization | Decision | A | Guardian + Governance | R5 |

### CBO-06 Verification

| Canonical Attribute | Business Meaning | Class | Sensitivity | Mutability | Owner | Source of Truth | A/D | Visibility | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Verified Claim | What was checked | Descriptive | Restricted | Immutable | Verifying body | Verification | A | Governance | R4 |
| Verification Level | Strength attained (L0..L3) | Descriptive | Restricted | Append-only | Verifying body | Verification | A | Broad (level only) | R1 |
| Evidence Category | Kind of evidence relied on | Evidential | Confidential | Immutable | Verifying body | Verification | A | Governance | R4 |
| Assessing Actor | Who assessed | Relational | Confidential | Immutable | Verifying body | Verification | A | Governance | R5 |
| Assessment Moment | When | Evidential | Internal | Immutable | Verifying body | Verification | A | Governance | R5 |
| Verification Standing | Held / lapsed / revoked | Governance | Restricted | Mutable via Decision | Verifying body | Verification | A | Broad | R1 |

### CBO-07 Decision

| Canonical Attribute | Business Meaning | Class | Sensitivity | Mutability | Owner | Source of Truth | A/D | Visibility | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Decision Subject | What changed | Relational | Restricted | Immutable | Platform | Identity | A | Affected Guardian + Governance | R5 |
| Decision Reason | Why, in business terms | Descriptive | Restricted | Immutable | Platform | Identity | A | Affected Guardian | R5 |
| Deciding Actor | Who decided | Relational | Confidential | Immutable | Platform | Identity | A | Governance | R5 |
| Cited Policy | Which policy version applied | Governance | Internal | Immutable | Platform | Policy | A | Governance | R5 |
| Decision Moment | When | Evidential | Internal | Immutable | Platform | Identity | A | Governance | R5 |
| Child Interest Statement | How Rule 0 was applied when in conflict | Descriptive | Child Sensitive | Immutable | Child Protection Officer | Identity | A | Guardian + Governance | R5 |

### CBO-08 Journey (all attributes Derived; none authoritative)

| Canonical Attribute | Business Meaning | Sensitivity | Visibility | Retention |
| --- | --- | --- | --- | --- |
| Journey Subject | Whose journey | Child Sensitive | Person + Guardian | R1 |
| Affiliation History | Every membership, both types | Restricted | Person + Guardian; age-gated externally | R1 |
| Participation History | Attested activity over time | Restricted | Person + Guardian | R1 |
| Verification History | Levels attained over time | Restricted | Person + Guardian | R1 |
| Decision History | Identity changes and reasons | Restricted | Person + Guardian | R5 |
| Journey Completeness Score | Completeness against JCS policy | Internal | Analytics (aggregate) | R3 |

### CBO-09 Activity Record

| Canonical Attribute | Business Meaning | Class | Sensitivity | Mutability | Owner | A/D | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Participant Person | Who took part | Relational | Child Sensitive | Immutable | Recording Org | A | R1 |
| Recording Organization | Who recorded it | Relational | Internal | Immutable | Recording Org | A | R1 |
| Activity Kind | Training, match, assessment, camp | Descriptive | Internal | Immutable | Recording Org | A | R1 |
| Occurrence Date | Distinct calendar date of the event | Evidential | Internal | Correctable | Recording Org | A | R1 |
| Attesting Adult | Accountable adult who attested | Relational | Confidential | Immutable | Recording Org | A | R5 |
| Counting Standing | Counted / disqualified / pending | Derived | Internal | Derived | Platform | D | R3 |
| Applied Activity Policy | Policy version used to count | Governance | Internal | Immutable | Platform | A | R5 |

### CBO-10..12 Organization / Association / Federation Reference

| Canonical Attribute | Business Meaning | Class | Sensitivity | Mutability | Source of Truth | A/D | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Referenced Body | The body being pointed at | Identifying | Internal | Immutable | Owning context | A | R1 |
| Body Name | Its name as published by its owner | Descriptive | Public | Mirrored | Owning context | D | R2 |
| Governing Scope | Territory or competence | Descriptive | Public | Mirrored | Association | D | R2 |
| Standing | Recognised / suspended / dissolved | Governance | Internal | Mirrored | Owning context | D | R2 |
| External Identifier (Federation only) | How the federation names the Person externally | Relational | Federation Only | Correctable | Federation | A | R2 |

### CBO-13 Policy Reference

| Canonical Attribute | Business Meaning | Class | Sensitivity | Mutability | Owner | A/D | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Policy Name | Named configuration object | Identifying | Internal | Immutable | Platform + Council | A | R5 |
| Policy Version | The version that applied | Identifying | Internal | Immutable | Platform + Council | A | R5 |
| Policy Standing | Draft / active / superseded | Governance | Internal | Mutable | Council | A | R5 |
| Effective Window | When it governed | Evidential | Internal | Immutable | Council | A | R5 |
| Approval Record | Which Council decision approved it | Evidential | Internal | Immutable | Council | A | R5 |

---

## PART 8 — Reference Data

Closed value sets. Each is owned, versioned, and may only change by Council
decision. Values are business terms, not codes.

| Reference Set | Owner | Values | Notes |
| --- | --- | --- | --- |
| **Verification Level** | Security Architect + Privacy Officer | L0 Unverified · L1 Basic-evidenced · L2 Strongly-evidenced · L3 Institution-attested | L1 minimum evidence = **OQ-02, Council-owned** |
| **Consent Purpose** | Privacy Officer | P1 Identity · P2 Participation · P3 Development · P4 Competition · P5 Federation · P6 Communication · P7 Aggregate Insight · P8 AI Model Improvement | Closed by CONSENT-001; P8 opt-in, L2, prohibited under 13 |
| **Membership Type** | Domain Architect | Primary · Secondary | ADR-0003 |
| **Membership Standing** | Domain Architect | Pending · Active · Ended | — |
| **Guardian Relationship** | Child Protection Officer | Parent · Legal Guardian · Institutional Guardian · Court-appointed | Extension requires child-protection review |
| **Activity Kind** | Football Operations | Training Session · Match · Assessment · Camp · Trial | Only adult-attested kinds count |
| **Activity Counting Standing** | Platform Governance | Counted · Pending Attestation · Disqualified | Disqualification requires a Decision |
| **Decision Reason** | Platform Governance | Transfer · Guardian Change · Verification Upgrade · Verification Revocation · Merge · Split · Recovery · Consent Conflict · Child Protection Intervention | Extensible only by Council |
| **Age Band** | Child Protection Officer | Under 13 · 13–15 · 16–17 · Adult | Under 13 governs Structural Prohibition |
| **Lifecycle Status** | Platform Governance | REGISTERED · VERIFIED · ACTIVE · TEMPORARILY_INACTIVE · INACTIVE · ARCHIVED | PRG-MET-001 |
| **Policy Type** | Council | ActivityPolicy · VerificationPolicy · ConsentPolicy · GuardianPolicy · TransferPolicy · MergePolicy · RecoveryPolicy · PrivacyPolicy · JourneyCompletenessPolicy · ReportingPolicy | IDN-DMN-001 §Policies |
| **Privacy Classification** | Privacy Officer | Public · Internal · Restricted · Confidential · Child Sensitive · Guardian Only · Federation Only | PART 12 |
| **Retention Category** | Privacy Officer | R1 · R2 · R3 · R4 · R5 | PART 17 |

---

## PART 9 — Master Data Ownership

| Object | Business Owner | Data Steward | Data Custodian | Data Subject | Primary Publisher | Primary Consumer |
| --- | --- | --- | --- | --- | --- | --- |
| Person | Platform Governance | Identity Steward | Platform | The Person | Identity | All contexts |
| Football Identity | Platform Governance | Identity Steward | Platform | The Person | Identity | All contexts, Federation |
| Guardian Link | Guardian | Child Protection Officer | Platform | Minor Person (+ Guardian) | Identity | Notification, Competition |
| Consent | Guardian / adult Person | Privacy Officer | Platform | The Person | Identity | Every context, pre-use |
| Membership | Organization | Organization Admin | Platform | The Person | Identity | Competition, Analytics |
| Verification | Verifying body | Identity Architect | Platform | The Person | Identity | Competition, Federation |
| Decision | Platform Governance | Enterprise Documentation Architect | Platform | The affected Person | Identity | Guardian, Association, Audit |
| Journey | The Person | Identity Steward | Platform | The Person | Identity (projection) | Player, Guardian, Federation |
| Activity Record | Recording Organization | Football Operations | Platform | The Person | Organization | Metrics, Development |
| Organization Reference | Organization context | Organization Admin | Platform | — (not personal) | Organization | Identity |
| Association Reference | Association | Association Officer | Platform | — | Association | Identity, Competition |
| Federation Reference | Federation | Federation Officer | Platform | The Person (external id) | Federation | Identity |
| Policy Reference | Council | Platform Governance | Platform | — | Governance | Metrics, Analytics |

The Platform is never an owner of personal information; it is custodian only.
This is the information-architecture expression of "Player Owns The Journey".

---

## PART 10 — Information Lifecycle

Business-level state progression, per object.

```text
Person
  Registered ──► Verified ──► Active ──► Temporarily Inactive ──► Inactive ──► Archived
                    ▲                          │
                    └──── re-verification ─────┘        (archival ≠ erasure)

Football Identity
  Issued ──► Held for life ──► (Standing may be suspended by Decision; never re-issued)

Guardian Link
  Claimed ──► Evidence assessed ──► Verified ──► (Changed by Decision) ──► Ended

Consent
  Granted ──► Active ──► Revoked | Expired ──► Retained as evidence of the grant
                 └──► High-Risk Revocation: immediate effect, notification, audit,
                      review queue that can never reverse the revocation

Membership
  Pending ──► Active ──► Ended
     Secondary ──(Decision: Transfer)──► Primary
     Primary   ──(Decision: Transfer)──► Ended, new Primary begins elsewhere

Verification
  Requested ──► Assessed ──► Level held ──► Lapsed | Revoked (by Decision)

Activity Record
  Recorded ──► Attested ──► Counted under a Policy version ──► (Disqualified by Decision)

Decision
  Raised ──► Decided ──► Immutable, permanently retained

Journey
  Continuously re-derived. Has no independent lifecycle and is never edited.
```

---

## PART 11 — Information Quality Rules

| ID | Dimension | Rule | Applies to |
| --- | --- | --- | --- |
| IQ-01 | Uniqueness | One human, one Person. A suspected duplicate is resolved by Decision, never by silent overwrite. | Person |
| IQ-02 | Uniqueness | At most one Active Primary Membership per Person at any moment. | Membership |
| IQ-03 | Completeness | A minor Person is not Verified without a verified Guardian Link and active P1 and P2 consent. | Person, Guardian Link, Consent |
| IQ-04 | Validity | Every information use cites an active Consent Purpose that permits it. | All personal attributes |
| IQ-05 | Accuracy | Date of Birth changes only through a Decision citing evidence. | Person |
| IQ-06 | Consistency | Membership, Activity and Verification histories must not contradict the Journey they derive. | Journey |
| IQ-07 | Timeliness | Revocation takes effect at the moment of revocation, not at next refresh. | Consent |
| IQ-08 | Timeliness | Activity is counted only within the active ActivityPolicy window. | Activity Record |
| IQ-09 | Traceability | Every derived figure carries its policy name and version. | Journey, metrics |
| IQ-10 | Explainability | Every identity change is answerable to the Guardian in plain language. | Decision |
| IQ-11 | Integrity | Attested activity requires a named accountable adult; unattested activity is never counted. | Activity Record |
| IQ-12 | Minimisation | An attribute exists for a consumer only where its capability requires it. | All objects |
| IQ-13 | Non-repudiation | Evidence and decision records are append-only. | Verification, Decision, Consent |
| IQ-14 | Opacity | No consumer derives meaning from the structure of an identifier. | Football Identity |

---

## PART 12 — Privacy Classification

| Class | Meaning | Examples | Default rule |
| --- | --- | --- | --- |
| **Public** | Publishable without consent | Organization name, competition name | No personal data ever |
| **Internal** | Operational, non-personal | Lifecycle status counts, policy versions | Platform staff and governance |
| **Restricted** | Personal, purpose-bound | Preferred name, verification level, membership type | Requires active purpose |
| **Confidential** | Personal, high harm on disclosure | Contact point, evidence category, assessing actor | Narrow, named consumers |
| **Child Sensitive** | Personal data of a minor | Legal name, date of birth, participation history | Rule 0 governs; minimisation is default; aggregate wherever possible |
| **Guardian Only** | Visible solely to the verified Guardian and the Person | Consent records, decision reasons, contact detail | Never exposed to organizations or partners |
| **Federation Only** | Exchanged solely with a recognised federation body under P5 | External identifier, federation submission set | Never onward-shared |

Structural Prohibition: for consumers whose capability is forbidden (under-13
scouting being canonical), Child Sensitive attributes are **absent from the
information contract entirely** — not present-and-denied.

---

## PART 13 — Cross Context Information Contracts

What each context is entitled to *understand*, expressed as meaning only.

| Consuming Context | Receives (meaning) | Never receives | Consent basis |
| --- | --- | --- | --- |
| **Organization** | That a Person holds a membership here, with type and window; verification level | Other organizations' memberships beyond journey visibility rules; guardian contact beyond operational need | P1, P2 |
| **Competition** | Eligibility outcome derived from Primary Membership, age band, verification level | Evidence documents, consent internals, guardian identity detail | P1, P2, P4 |
| **Development** | Participation history and assessment linkage for members it coaches | Guardian contact, consent internals, other organizations' assessments | P3 |
| **Medical** | Existence of a Person and the accountable Guardian for emergency contact | Assessment content, scouting interest, commercial data | P1, P2, explicit medical purpose |
| **Scouting** | For 13+ only, and only where consent permits: journey summary and verified participation | Anything about an under-13 Person — capability does not exist; contact details ever | P3 + explicit scouting consent, age-gated |
| **Finance** | That an obligation attaches to a membership | Child Sensitive attributes; participation detail | Operational, non-personal wherever possible |
| **Notification** | Reachable channel for the verified Guardian and the message purpose | Journey content, assessments, decisions beyond notice text | P6 |
| **Analytics** | Aggregate, policy-qualified counts and indices | Row-level child data unless P7/P8 explicitly permits, never under 13 for P8 | P7 (aggregate), P8 (AI training, opt-in, L2, 13+) |
| **Federation** | Football Identity reference, verification level, eligibility-relevant facts | Guardian annotations, internal decisions, evidence images | P5 |
| **Identity (source)** | — | — | Publishes all of the above |

---

## PART 14 — Policy Bindings

| Object | Bound Policies and Decisions |
| --- | --- |
| Person | PRG-MET-001 lifecycle · PrivacyPolicy · MergePolicy · RecoveryPolicy |
| Football Identity | ADR-0002 rev.2 · PrivacyPolicy (display-code lookup rate limits) |
| Guardian Link | CONSENT-001 · GuardianPolicy · VerificationPolicy |
| Consent | CONSENT-001 (P1..P8) · ConsentPolicy · PrivacyPolicy · high-risk revocation flow |
| Membership | ADR-0003 · TransferPolicy · ReportingPolicy (NDI portability counting) |
| Verification | VerificationPolicy · OQ-02 (Council-owned L1 evidence floor) |
| Decision | Decision Rules incl. Rule 0 · MergePolicy · TransferPolicy · RecoveryPolicy |
| Journey | JourneyCompletenessPolicy · PrivacyPolicy · ReportingPolicy |
| Activity Record | PRG-MET-001 ActivityPolicy (window, thresholds, anti-gaming) |
| Organization / Association Reference | ADR-0003 · STK-INV-001 |
| Federation Reference | Constitution #11 · CONSENT-001 P5 |
| Policy Reference | Quality gate governance; every published figure carries policy@version |
| All objects | STK-INV-001..004; ADR-0001 (runtime stack) constrains later stages only |

---

## PART 15 — Canonical Decision Catalogue

Objects change through decisions, and each decision is itself canonical
information.

| Decision | Trigger | Objects affected | Reason recorded | Rule 0 relevance |
| --- | --- | --- | --- | --- |
| **Transfer** | Player moves official affiliation | Membership (Primary ends, new Primary begins), Journey | Transfer | Continuity of play for the child overrides organizational dispute |
| **Guardian Change** | Legal responsibility changes | Guardian Link, Consent (authority re-based), Person standing | Guardian Change | Protection must never lapse in the gap |
| **Verification Upgrade** | New evidence assessed | Verification, Person lifecycle status | Verification Upgrade | Never overstated for convenience |
| **Verification Revocation** | Evidence discredited | Verification, eligibility, memberships | Verification Revocation | Child not penalised for adult error |
| **Merge** | Two Person records prove to be one human | Person, Football Identity (one retained, other retired by Decision), Journey | Merge | Journey completeness preserved end to end |
| **Split** | A merge proves wrong | Person, Journey | Merge (reversal) | Restore the child's true record |
| **Recovery** | Person loses access to their identity | Person access standing, Verification | Recovery | Access restored without re-issuing identity |
| **Consent Conflict** | Two authorities disagree, or a revocation collides with active use | Consent, downstream usability, notification | Consent Conflict | Most protective interpretation applies immediately |
| **Child Protection Intervention** | Safeguarding concern | Any object, capability suspension | Child Protection Intervention | Rule 0 applied explicitly and recorded |

Every row requires a Child Interest Statement where a conflict existed.

---

## PART 16 — Canonical Event Mapping

Business objects mapped to the domain events of IDN-DMN-001. Messaging,
transport and schema are out of scope.

| Object | Related Domain Events (business facts) |
| --- | --- |
| Person | PersonRegistered · PersonLifecycleStateChanged · PersonArchived · PersonRecordsMerged · PersonMergeReversed |
| Football Identity | FootballIdIssued · DisplayCodeIssued · IdentityStandingSuspended |
| Guardian Link | GuardianLinkClaimed · GuardianLinkVerified · GuardianLinkEnded · GuardianAuthorityTransferred |
| Consent | ConsentGranted · ConsentRevoked · ConsentExpired · HighRiskRevocationRaised · ConsentConflictDetected |
| Membership | MembershipStarted · MembershipEnded · MembershipPromotedToPrimary · TransferCompleted |
| Verification | VerificationRequested · VerificationLevelGranted · VerificationLapsed · VerificationRevoked |
| Decision | DecisionRecorded · ChildInterestApplied |
| Journey | JourneyProjectionUpdated (derived; never a source of truth) |
| Activity Record | ActivityRecorded · ActivityAttested · ActivityDisqualified · ActivityCounted |
| Organization / Association / Federation Reference | ReferenceMirrored · ReferenceStandingChanged · FederationIdentifierLinked |
| Policy Reference | PolicyVersionActivated · PolicyVersionSuperseded |

The full authoritative catalogue is IDN-EVT-001, which must not introduce an
event whose subject is not a canonical object listed in PART 4.

---

## PART 17 — Information Governance

**Ownership.** Personal information is owned by its subject; the Platform is
custodian. Organizations own their own operational records only.

**Stewardship.** Each object names a steward in PART 9 who is accountable for
definition, quality rules, and reference-data changes.

**Retention categories.**

| Category | Meaning | Applies to |
| --- | --- | --- |
| R1 Lifetime of Journey | Retained while the Journey exists, because the child's record must survive every move | Identity, membership, participation, verification level |
| R2 Duration of Relationship | Retained while the relationship is live, plus a short wind-down | Contact points, guardian details, reference mirrors |
| R3 Policy Window | Retained for the analytical window defined by the applicable policy | Derived statuses, scores, counts |
| R4 Evidence Retention | Retained for the evidentiary period, then reduced to the assessment outcome | Evidence categories and supporting material |
| R5 Permanent Audit | Retained permanently, non-erasable, because accountability cannot expire | Decisions, consent grants and revocations, attestations |

**Archiving.** Archival changes visibility and processing, never existence.
Archival is never erasure (PRG-MET-001).

**Deletion.** Erasure requests are honoured against R2/R3/R4 material and against
purpose-bound use. R5 accountability records and the minimal facts required to
prove the Journey's integrity are retained, with the request itself recorded as a
Decision. P8 revocation carries a 90-day removal obligation from training sets.

**Audit.** Every read of Child Sensitive information for a non-obvious purpose,
and every write to any object, is auditable to an actor, a moment and a purpose.

**Legal Hold.** A hold suspends deletion and archival for named objects, is
itself a Decision, has an owner and an expiry, and is reported to the Council.

---

## PART 18 — Acceptance Criteria

| # | Criterion | Status |
| --- | --- | --- |
| AC-01 | No ambiguous business term: every canonical term has one definition | MET — PART 3 |
| AC-02 | No conflicting synonyms: synonyms are declared and subordinate | MET — PART 3 |
| AC-03 | No orphan object: every object appears in a relationship and a contract | MET — PARTS 6, 13 |
| AC-04 | Every object has a business owner, steward, custodian and data subject | MET — PART 9 |
| AC-05 | Every object has a business meaning statement | MET — PART 5 |
| AC-06 | Every object traces to an approved artefact | MET — PART 4, PART 19 |
| AC-07 | Every object declares information classification and retention | MET — PARTS 7, 12, 17 |
| AC-08 | Every object maps to at least one domain event | MET — PART 16 |
| AC-09 | Every object binds to at least one policy or ADR | MET — PART 14 |
| AC-10 | Child protection expressed structurally, not by permission | MET — PART 12, CDM-P-09 |
| AC-11 | No physical artefact present (schema, type, API, code) | MET — whole document |
| AC-12 | Council-owned values isolated and visible | MET — OQ-02, OQ-05 in PART 8 |

Gate G4 exit requires Council ratification of this artefact and closure of OQ-02
and OQ-05 as values in the Verification and Reporting policies. Neither is a
semantic defect; both are business numbers.

---

## PART 19 — Traceability Matrix

| Canonical Object | Vision (PRG-VIS-001) | Stakeholder (PRG-STK-001) | PRD (IDN-PRD-001) | Domain Model (IDN-DMN-001) | Vocabulary | Future Event | Future API | Future Data Model |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Person | VAP North Star | Players, Family | BP-01, FR-PER-* | Person aggregate | Person | PersonRegistered | IDN-API-001 | IDN-ERD-001 |
| Football Identity | Football ID First | All groups | FR-FID-*, BR-FID-* | FootballIdentity entity | Football Identity | FootballIdIssued | IDN-API-001 | IDN-ERD-001 |
| Guardian Link | Guardian Verified | Family | BP-04, FR-GRD-* | GuardianLink aggregate | Guardian Link | GuardianLinkVerified | IDN-API-001 | IDN-ERD-001 |
| Consent | CTI | Family, Privacy | CONSENT-001, FR-CON-* | Consent aggregate | Consent | ConsentGranted | IDN-API-001 | IDN-ERD-001 |
| Membership | NDI portability | Organizations | ADR-0003, FR-MEM-* | Membership aggregate | Membership | TransferCompleted | IDN-API-001 | IDN-ERD-001 |
| Verification | Verified Players | Association, Federation | FR-VER-*, OQ-02 | Verification aggregate | Verification | VerificationLevelGranted | IDN-API-001 | IDN-ERD-001 |
| Decision | Explainable Decisions | Governance | DL-01..08 | Decision aggregate | Decision | DecisionRecorded | IDN-API-001 | IDN-ERD-001 |
| Journey | Player Owns The Journey, JCS | Players, Scouts | FR-JRN-* | Journey read model | Journey | JourneyProjectionUpdated | IDN-API-001 | IDN-ERD-001 |
| Activity Record | VAP, Phase targets | Organizations, Coaches | PRG-MET-001 | Activity ACL | Activity Record | ActivityCounted | IDN-API-001 | IDN-ERD-001 |
| Organization Reference | Phase 0 10 SSB | Organizations | ADR-0003 | Organization ACL | Organization Reference | ReferenceMirrored | IDN-API-001 | IDN-ERD-001 |
| Association Reference | Regional scale | Association | PRD PART 6 | Federation ACL | Association Reference | ReferenceStandingChanged | IDN-API-001 | IDN-ERD-001 |
| Federation Reference | Federation-integrable | Federation | Constitution #11 | Federation ACL | Federation Reference | FederationIdentifierLinked | IDN-API-001 | IDN-ERD-001 |
| Policy Reference | Configurable thresholds | Governance | PRG-MET-001 | Policies §10 | Policy Reference | PolicyVersionActivated | IDN-API-001 | IDN-ERD-001 |

---

## Council items

No **Enterprise Information Council Decision Required** conflicts were raised:
this model is consistent with all nine locked artefacts. Two pre-existing
Council-owned values carry forward: **OQ-02** and **OQ-05**.
