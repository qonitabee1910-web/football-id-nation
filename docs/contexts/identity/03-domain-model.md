---
id: IDN-DMN-001
title: Enterprise Domain Model — Identity Bounded Context
status: IN_REVIEW
version: 1.0
date: 2026-08-06
stage: 2
gate: G3
bounded_context: identity
classification: Enterprise Constitution Artefact
depends_on: [PRG-VIS-001, PRG-STK-001, IDN-PRD-001, PRG-MET-001, CONSENT-001, ADR-0001, ADR-0002, ADR-0003]
blocks: [IDN-JRN-001, IDN-EVT-001, IDN-CDM-001, IDN-ERD-001, IDN-API-001]
---

# IDN-DMN-001 — Identity Domain Model

> Business model only. No schema, no table, no endpoint, no code. Every
> Aggregate, Entity, Value Object, Event, Policy and Invariant below carries a
> traceability tag to an approved artefact; PART 19 closes the chain. Anything
> that could not be traced was not modelled.

**Council Decision Required (carried forward, not resolved here).** `IDN-PRD-001`
was locked by the Council with two open business decisions still recorded as
blocking: **OQ-02** (minimum evidence accepted at assurance L1) and **OQ-05**
(CTI Phase 0 floor). This model is structurally complete without them: both are
*values inside a versioned Policy object* (`VerificationPolicy`, and the CTI
floor consumed by reporting), not structural elements. The model is therefore
built, the policy slots are named, and the values remain Council-owned. No
assumption has been substituted. See PART 10 and PART 18 AC-DM-12.

---

## PART 1 — Domain Purpose

### Why this domain exists

Indonesian youth football destroys the record of the individual child every time
that child moves. The Identity Domain exists to make the child — not the
organization — the durable unit of record, and to make every subsequent context
(Competition, Development, Analytics) resolvable to that unit.

It is the platform's foundational context: a Match without identified players is
folklore, an Assessment without a persistent subject is a lost note, a Transfer
without an authoritative roster is a rumour.

### Business outcome

The domain succeeds when the platform can state, for any child, with evidence:
*who they are* (Football ID), *who speaks for them* (verified Guardian), *what
may be done with their data* (Consent), *where they belong* (Primary Membership),
*where else they participate* (Secondary Memberships), *whether they are actually
playing* (lifecycle state), and *why every consequential thing that happened to
their record happened* (Decision Log). That statement is precisely the North Star
— Verified Active Players — plus its audit trail.

### Scope

Person · Football Identity · User as authentication subject · Guardian Link ·
Consent state and evaluation · Verification and assurance · Membership (Primary
and Secondary) · Role assignment · Identity Lifecycle · Identity Decision Log ·
the identity-side inputs to VAP, NDI, JCS and CTI.

### Boundaries — what this domain refuses

| Refused | Because |
| --- | --- |
| Owning the *content* of activity, assessment, match or medical records | Those belong to their own contexts; Identity consumes facts, never authors them |
| Letting an Organization own a Player | Constitution #1 — Membership confers access, never ownership |
| Letting a Guardian alter evidence | STK-INV-002 — Consent Authority ≠ Evidence Authority |
| Encoding any business fact in an identifier | Constitution #2/#3, ADR-0002 rev.2 |
| Deciding competition rules | Identity *supplies* the eligibility predicate; Competition applies it |
| Storing verification evidence for reuse by other contexts | IDN-PRD-001 FR-VER-04 — only the resulting assurance level leaves the domain |

---

## PART 2 — Bounded Context

**Context name:** `Identity`

### Responsibilities

1. Issue and protect the Football Identity (one per human, permanent, opaque).
2. Establish and verify who a Person is and who is responsible for them.
3. Hold consent state as an append-only truth and evaluate it at the access boundary.
4. Hold the typed Person↔Organization relationship and the authoritative eligibility fact.
5. Compute and publish lifecycle state against a versioned ActivityPolicy.
6. Record every consequential identity decision with evidence (Constitution #10).

### Upstream (Identity depends on)

| Upstream | What Identity consumes | Relationship pattern |
| --- | --- | --- |
| Governance / Policy (programme level) | `ActivityPolicy`, `JourneyCompletenessPolicy`, `VerificationPolicy`, `ConsentPolicy` versions | **Conformist** — Identity accepts published policy versions as given; it never redefines a threshold |
| Organization context | Existence and administrative standing of an Organization | **Customer–Supplier** — Identity requires stable organization identity and an "independently administered" signal for NDI anti-gaming |
| Activity-producing contexts (Training, Match, Competition) | `ActivityRecorded` facts: subject, organization, date, attesting adult | **Customer–Supplier** with an **Anti-Corruption Layer** (see below) |

### Downstream (depends on Identity)

Competition · Organization · Development · Medical · Finance · Scouting ·
Notification · Analytics. All consume the Published Language below. None may
reach behind it. Conceptual contracts in PART 17.

### Shared Kernel

Deliberately minimal — a shared kernel is a coupling liability, so only the
irreducible is shared:

- `FootballId` — the universal join key. Every context references a Person by this and nothing else (IDN-PRD-001 FR-FID-08).
- `AgeBand` — the coarse age classification other contexts are permitted to see instead of a date of birth.
- The six lifecycle state names.
- `ConsentPurpose` P1–P8 (closed list, owned by CONSENT-001).

Everything else — Guardian Link, Verification evidence, Decision Log internals,
consent grant records — stays inside the context.

### Published Language

What Identity publishes outward, as business facts rather than data structures:

| Published fact | Meaning to consumers |
| --- | --- |
| `FootballId` | The identity of a Person. Opaque. Confers no authority by possession. |
| `AgeBand` | Coarse age classification. **Never** the date of birth. |
| `LifecycleState` + `policy_version` | Where the Person stands: REGISTERED … ARCHIVED. |
| `GuardianVerifiedStatus` | Boolean-with-basis: verified at L1+ with P1 and P2 active. Not the evidence. |
| `AssuranceLevel` | L0–L3. Not the documents behind it. |
| `PrimaryAffiliation` | The one Organization constituting official affiliation, or explicitly none. |
| `EligibilityDecision` | The Identity-side predicate: active Primary Membership + verified age + required consents. Competition applies its own rules on top. |
| `ConsentDecision` | Per purpose: permitted / not permitted, with the purpose named. Never the consent history. |
| `IdentityDecisionRecorded` | That a consequential decision happened, with its type and time. Contents are jurisdictional. |

**Explicitly not published:** date of birth, verification evidence, guardian
contact details, consent history, decision evidence, any raw personal attribute
not justified by the consumer's own capability (STK-INV-001).

### Anti-Corruption Layer

Three ACLs, each protecting an invariant that an upstream system does not share:

1. **Activity ACL.** Incoming activity facts are translated into the domain's own
   `QualifyingActivity` concept. The ACL enforces adult attestation, organization
   provenance, and the same-attesting-adult anti-gaming rule *before* anything
   reaches lifecycle evaluation. An upstream context cannot make a Person ACTIVE
   by asserting it.
2. **Federation ACL.** Any future PSSI/Asprov/Askab identifier is held as an
   *external reference alongside* the Football ID, translated at the boundary. A
   federation identifier is never adopted as the internal identity, because
   external identifiers carry meaning and the Constitution forbids meaningful
   identity (#2, #3, ADR-0002).
3. **Legacy registration ACL.** Spreadsheet and offline-desk intake is translated
   into candidate Persons. The ACL may never silently create a duplicate: an
   ambiguous match produces a `DuplicateSuspected` fact and a merge decision, not
   a second human (IDN-PRD-001 NFR-08, RSK-02).

### Context map

```text
                 Governance / Policy  (conformist: policy versions in)
                            |
                            v
  Organization ---------> IDENTITY <--------- Activity producers
   (customer/supplier)   (core domain)        (via Activity ACL)
                            |
        published language  |  FootballId · AgeBand · LifecycleState
                            |  GuardianVerified · Assurance · PrimaryAffiliation
                            |  EligibilityDecision · ConsentDecision
      +---------+-----------+-----------+-----------+----------+
      v         v           v           v           v          v
 Competition  Development  Medical   Scouting   Analytics  Notification
                                     (no under-13 path exists at all)
                            ^
                            |
                    Federation ACL  (external identifiers translated, never adopted)
```

Identity is the **core domain**. Everything else is supporting or generic
relative to it.

---

## PART 3 — Ubiquitous Language

Terms are used exactly as defined in `docs/glossary.md` and `IDN-PRD-001` PART 7.
This section adds only the modelling-precision the domain layer requires.

| Term | Domain-layer precision |
| --- | --- |
| **Person** | Aggregate root. One human. The consistency boundary for identity facts about that human. |
| **Football Identity** | The Person's permanent, opaque identity. Modelled as an Entity inside the Person aggregate holding the immutable `FootballId` plus its issuance and merge history. |
| **User** | The authentication subject bound to exactly one Person. A property of the Person aggregate, not a separate human. |
| **Role** | A capability held by a Person within a scope, with validity. Never a login. |
| **Guardian** | The *role* an adult Person holds. Distinct from the *link* to a specific child. |
| **Guardian Link** | Aggregate root. The verified relationship between one Guardian Person and one minor Player Person. The unit of consent authority. |
| **Consent** | Aggregate root per (Person, Purpose). Append-only ledger of grant / refuse / revoke / expire facts. The current position is derived, never stored as a mutable flag. |
| **Verification** | Aggregate root. A single act of raising or lowering assurance about one claim, with evidence held internally and only the level published. |
| **Membership** | Aggregate root. Typed, time-bounded Person↔Organization relationship. |
| **Primary Membership** | The single ACTIVE Membership of type PRIMARY. Sole basis of roster, eligibility and Transfer. |
| **Secondary Membership** | Concurrent, non-exclusive Membership. Recorded in the Journey; confers no eligibility. |
| **Transfer** | A business event, produced by a Domain Service, that closes one Primary Membership and opens another. Never a state edit (Constitution #8). |
| **Journey** | A **read model**, not an aggregate: the chronological projection of Memberships, Activities, Verifications and Decisions for one Football ID. Append-only by construction because its sources are. |
| **Activity** | Not owned here. Identity holds `QualifyingActivity` — the ACL-translated, attested, policy-evaluated fact used for lifecycle. |
| **Never Active** | A derived specification result, never a stored state (Constitution #11). |
| **Temporary Inactive** | A lifecycle state, and an explicitly *normal* one — the child between seasons or between clubs. |
| **Decision** | Aggregate root. An immutable record of a consequential identity decision: purpose, trigger, owner, evidence reference, reason, outcome. |
| **Policy** | A named, versioned configuration object. Thresholds live here, never in logic (PRG-MET-001, IDN-PRD-001 NFR-10). |
| **Specification** | A named, reusable business predicate. Answers a yes/no question about a domain object and can explain its answer (Constitution #10). |

Forbidden terms remain forbidden: "player account", "SSB's player", "coach login".

---

## PART 4 — Domain Capabilities

| # | Capability | What the business can do | Realised by | Trace |
| --- | --- | --- | --- | --- |
| C-01 | **Identity Management** | Represent each human exactly once; hold roles, bind a User, detect and resolve duplicates | Person aggregate, DuplicateResolutionService, MergePolicy | FR-PER-01..06 |
| C-02 | **Football Identity** | Issue, protect and permanently resolve an opaque identity, including through merges | FootballIdentity entity, IdentityIssuancePolicy | FR-FID-01..08, ADR-0002 |
| C-03 | **Guardian Management** | Establish, verify, replace and terminate the authority of an adult over a minor | GuardianLink aggregate, GuardianResolutionService, GuardianPolicy | FR-GRD-01..10 |
| C-04 | **Consent Management** | Grant, refuse, revoke and evaluate consent per purpose, append-only | Consent aggregate, ConsentEvaluationService, ConsentPolicy | FR-CON-01..08, CONSENT-001 |
| C-05 | **Verification** | Raise and lower assurance about identity, guardianship and age, on evidence | Verification aggregate, IdentityVerificationService, VerificationPolicy | FR-VER-01..07 |
| C-06 | **Membership Management** | Start, end, promote and transfer typed affiliations; reconstruct any past roster | Membership aggregate, TransferService, TransferPolicy | FR-MEM-01..11, ADR-0003 |
| C-07 | **Identity Lifecycle** | Compute and publish where a Person stands, against versioned policy | LifecycleState VO, ActivityEvaluationService, ActivityPolicy | FR-LFC-01..06, PRG-MET-001 |
| C-08 | **Identity Recovery** | Restore access without ever moving an identity to a different human | RecoveryPolicy, IdentityVerificationService, Decision aggregate | FR-AUT-05, DL-07 |
| C-09 | **Decision Logging** | Explain, after the fact, why any consequential identity outcome occurred | Decision aggregate, all Domain Services | FR-DLG-01..05, Constitution #10 |
| C-10 | **Authorization Fact Supply** | Answer "may this actor do this to this child, now" as a single explainable decision | AccessDecisionSpecification chain | FR-ROL-01..06, PRG-STK-001 PART 12 |
| C-11 | **Metric Fact Supply** | Supply VAP, NDI-portability, JCS-identity and CTI inputs with policy version attached | Journey read model, specifications, policy stamps | PRG-VIS-001 §9, PART 19 of PRD |

---

## PART 5 — Aggregates

Seven aggregate roots. The boundaries were drawn on one question: *what must be
transactionally consistent, and what must merely be eventually consistent?*
Anything that can tolerate a moment's lag was pushed out, because a large
aggregate is an availability and contention liability at national scale
(NFR-03).

### A-01 · Person *(aggregate root)*

- **Purpose** — represent one human, permanently, as the anchor of everything else.
- **Responsibilities** — hold the Football Identity; hold role assignments; hold the User binding; hold the current lifecycle state; enforce one-identity-per-human.
- **Contains** — `FootballIdentity` (entity), `RoleAssignment` (entities), `UserBinding` (entity), `PersonAttributes` (VO set), `LifecycleState` (VO), `AgeBand` (VO, derived), `DateOfBirth` (VO, restricted).
- **References by ID only** — GuardianLink, Consent, Verification, Membership, Decision.
- **Consistency boundary** — a Person's own identity facts. Deliberately **excludes** Memberships and Consents: a roster change at one SSB must never contend with a consent change made by a parent at home.
- **Invariants** — INV-01, INV-02, INV-03, INV-04, INV-16, INV-21 (PART 12).
- **Lifecycle** — created at registration → six lifecycle states (PART 13.1) → never deleted; ARCHIVED is terminal-but-reversible.

### A-02 · FootballIdentity *(entity inside Person — deliberately NOT a separate root)*

Modelled inside Person because an identity with no person is meaningless and the
two must never diverge for even an instant. It holds the immutable `FootballId`,
`DisplayCode`, issuance fact, and — crucially — the **merge chain**: every
retired `FootballId` that resolves to this one, permanently (FR-FID-07).

- **Invariants** — INV-02 (immutable), INV-03 (never reused), INV-04 (opaque), INV-05 (retired IDs resolve forever).

### A-03 · GuardianLink *(aggregate root)*

- **Purpose** — carry the authority of a specific adult over a specific child. The unit that makes consent valid.
- **Responsibilities** — bind Guardian Person to minor Player Person; carry its own assurance level; carry its authority window; terminate at majority.
- **Contains** — `GuardianRelationship` (VO: legal basis), `AssuranceLevel` (VO), `AuthorityWindow` (VO), `LinkStatus` (VO).
- **References** — two Person IDs; Verification IDs; Decision IDs.
- **Consistency boundary** — one link. Multiple guardians of one child are separate aggregates, coordinated by GuardianResolutionService — because two parents acting simultaneously must not block each other, and their conflict is a *business* escalation (DL-06), not a lock contention.
- **Invariants** — INV-06, INV-07, INV-08, INV-09.
- **Lifecycle** — PART 13.2.

### A-04 · Consent *(aggregate root — one per Person per Purpose)*

- **Purpose** — hold the complete, append-only truth of what may be done with this Person's data for this one purpose.
- **Responsibilities** — append grant / refusal / revocation / expiry facts; derive the current position; refuse any operation that would rewrite history.
- **Contains** — ordered `ConsentEvent` entities, each with `ConsentPurpose`, granting authority reference, `AssuranceLevel` at grant, timestamp, and `ConsentPolicy` version.
- **Consistency boundary** — one Person + one Purpose. Scoping per purpose is what makes BR-14 (no bundled consent) *structurally* true: there is no object that could represent "accept all".
- **Invariants** — INV-10, INV-11, INV-12, INV-13, INV-14.
- **Lifecycle** — PART 13.4.

### A-05 · Verification *(aggregate root)*

- **Purpose** — one act of establishing or revising assurance about one claim.
- **Responsibilities** — hold the claim type (person identity / guardianship / age), the evidence reference, the resulting level, the deciding party, and reversibility.
- **Contains** — `ClaimType` (VO), `EvidenceReference` (VO), `AssuranceLevel` (VO), `VerificationOutcome` (VO).
- **Consistency boundary** — one verification act. It is a separate root because verification evidence must be retainable, restricted and expirable on its own schedule, independently of the Person it describes (FR-VER-04, PRD PART 16 retention).
- **Invariants** — INV-15, INV-16, INV-17.
- **Lifecycle** — PART 13.5.

### A-06 · Membership *(aggregate root)*

- **Purpose** — one typed, time-bounded affiliation between one Person and one Organization.
- **Responsibilities** — hold type, period, status, guardian approval reference, and the Transfer event that opened or closed it.
- **Contains** — `MembershipType` (VO), `MembershipPeriod` (VO), `MembershipStatus` (VO), approval reference.
- **Consistency boundary** — one membership. **INV-18 (one ACTIVE Primary per Player) spans aggregates**, so it is enforced by the TransferService as a domain-service-level invariant and re-asserted as a constraint at Stage 3 (ADR-0003 explicitly anticipates this). This is a recorded, deliberate trade-off: making Membership part of the Person aggregate would guarantee the invariant transactionally but would serialise every roster operation nationally.
- **Invariants** — INV-18, INV-19, INV-20, INV-21, INV-22.
- **Lifecycle** — PART 13.3.

### A-07 · Decision *(aggregate root)*

- **Purpose** — make every consequential identity outcome explainable after the fact (Constitution #10).
- **Responsibilities** — record type, purpose, trigger, decision owner, evidence reference, reason, outcome, timestamp, and links to affected aggregates.
- **Contains** — `DecisionType` (VO), `DecisionReason` (VO), `EvidenceReference` (VO), `DecisionOutcome` (VO), `Approver` (VO).
- **Consistency boundary** — one decision. Immutable on creation; a correction is a new linked Decision, never an edit.
- **Invariants** — INV-23, INV-24, INV-25.
- **Lifecycle** — created → linked → never modified. No terminal state; a decision is permanent.

### Journey *(read model — explicitly not an aggregate)*

Recorded here to prevent a future modeller from turning it into one. The Journey
is the projection of Membership, QualifyingActivity, Verification and Decision
facts over one `FootballId`. It is append-only because its sources are
append-only, not because it enforces anything. Making it an aggregate would
create a single write bottleneck on the most-read object in the platform and
would risk it diverging from the facts it summarises.

---

## PART 6 — Entities

| Entity | Aggregate | Business meaning | Responsibilities | Identity | Lifecycle | Owns | References |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Person** | A-01 (root) | One human in the ecosystem | Anchor identity, roles, lifecycle state | `FootballId` | REGISTERED → … → ARCHIVED; never deleted | FootballIdentity, RoleAssignments, UserBinding, attributes | GuardianLinks, Consents, Memberships, Verifications, Decisions (by ID) |
| **FootballIdentity** | A-01 | The permanent opaque identity and its merge chain | Guarantee immutability, permanence, resolvability of retired IDs | `FootballId` (immutable) | Issued once; extended only by absorbing retired IDs | `FootballId`, `DisplayCode`, issuance fact, merge chain | Merge Decisions |
| **RoleAssignment** | A-01 | A capability held in a scope for a period | Carry role, scope, validity | Assignment identity within Person | Assigned → active → revoked/expired | `RoleType`, `RoleScope`, `ValidityPeriod` | Organization / Competition / Team scope refs |
| **UserBinding** | A-01 | The authentication subject bound to this human | Enforce one User per Person; carry required assurance | Binding identity within Person | Bound → recovered → rebound (each a Decision) | `AuthenticationAssurance` | Recovery Decisions |
| **GuardianLink** | A-03 (root) | Who speaks for this child | Carry and terminate consent authority | Link identity | Claimed → Verified → Active → Suspended → Terminated | relationship basis, assurance, authority window | Guardian Person, Minor Person, Verifications, Decisions |
| **ConsentEvent** | A-04 | One immutable consent fact | Record grant/refuse/revoke/expire | Sequence position within the Consent ledger | Appended; never modified | purpose, authority, assurance-at-grant, policy version | Granting Person, GuardianLink |
| **Verification** | A-05 (root) | One act of establishing assurance | Hold claim, evidence reference, outcome | Verification identity | Requested → Evidence submitted → Decided → Expired/Revoked | claim, evidence ref, level, outcome | Subject Person or GuardianLink, Decision |
| **Membership** | A-06 (root) | One typed affiliation | Hold type, period, status, approval | Membership identity | Pending → Active → Ended (never removed) | type, period, status | Person, Organization, Transfer event, approval Consent/Decision |
| **Decision** | A-07 (root) | One explainable identity outcome | Record purpose, trigger, owner, evidence, reason, outcome | Decision identity | Created → linked → immutable forever | type, reason, evidence ref, outcome, approver | Every aggregate it affected |
| **QualifyingActivity** | referenced fact | An ACL-translated, attested activity relevant to lifecycle | Feed lifecycle evaluation only | Upstream activity identity | Recorded → counted → ages out of the policy window | nothing (it is a translated fact) | Person, Organization, attesting adult |

**Not entities, deliberately:** *Journey* (read model), *Role* (a value on an
assignment, not a thing with a lifecycle of its own), *Organization* (owned by
another context; referenced only), *Activity content* (owned by its producing
context).

---

## PART 7 — Value Objects

Immutable, equality-by-value, self-validating. Each exists to make an illegal
state unrepresentable rather than merely unwritten.

| Value Object | Meaning | Constraint it enforces | Trace |
| --- | --- | --- | --- |
| `FootballId` | The permanent opaque identity | Random; encodes no region, organization, birth year or sequence; immutable once constructed | ADR-0002 rev.2, INV-04 |
| `DisplayCode` | Human-communicable rendering for offline use | Meaning-free; checksum-bearing; explicitly **not** an authenticator | FR-FID-04/05, NFR-08 |
| `AgeBand` | Coarse age classification | Derived from DOB; the only age representation publishable outward | PRD PART 16, INV-26 |
| `DateOfBirth` | Exact birth date | Treated as verification evidence: readable by Person, Guardian and verification only | PRD PART 16 |
| `GuardianRelationship` | Legal basis of guardianship | Closed vocabulary of recognised bases; no free-text authority | FR-GRD-04 |
| `AuthorityWindow` | When guardian authority is effective | Ends automatically at majority; never retroactive | FR-GRD-08, INV-08 |
| `VerificationLevel` / `AssuranceLevel` | L0–L3 | Ordered; comparisons are level-aware; a downgrade invalidates dependent consents | FR-VER-01, INV-17 |
| `ClaimType` | What is being verified | Closed set: person identity, guardianship, age | FR-VER-01/03 |
| `EvidenceReference` | A pointer to evidence, not the evidence | Never publishable outside the domain | FR-VER-04, INV-16 |
| `ConsentPurpose` | P1_IDENTITY … P8_AI_MODEL_IMPROVEMENT | Closed list; bundling structurally impossible | CONSENT-001, INV-10 |
| `ConsentPosition` | Derived current position for a purpose | Derived from the ledger; never stored as a mutable flag | INV-11 |
| `MembershipType` | PRIMARY \| SECONDARY | Only PRIMARY confers eligibility; type is never edited in place | ADR-0003, INV-19 |
| `MembershipPeriod` | Time bounds of an affiliation | Closed periods are immutable | INV-22 |
| `MembershipStatus` | PENDING \| ACTIVE \| ENDED | ENDED is terminal | INV-22 |
| `LifecycleState` | The six states | Exactly one at a time; transitions only via legal edges | PRG-MET-001, INV-27 |
| `ActivityStatus` | The activity-derived signal feeding lifecycle | Always carries `policy_id@version` | PRG-MET-001, INV-28 |
| `PolicyVersion` | `policy_id@version` stamp | Mandatory on every state transition and every published metric | NFR-10, INV-28 |
| `NeverActiveFlag` | Derived, never stored | Constitution #11 — reporting must distinguish it | INV-29 |
| `RoleType` / `RoleScope` / `ValidityPeriod` | Role assignment triple | Role alone never grants access to a child | FR-ROL-01/03 |
| `DecisionType` | The eight decision kinds (DL-01…DL-08) | Closed set | PRD PART 17 |
| `DecisionReason` | Explanation of a decision in business language | Mandatory and non-empty — an unexplained decision is invalid | Constitution #10, INV-24 |
| `DecisionOutcome` / `Approver` | What was decided, by whom | Approver must be a named authority, never "system" for child-affecting decisions | INV-25 |
| `AuthenticationAssurance` | Assurance required to exercise a capability | Scales with sensitivity, not role name | FR-AUT-06 |
| `OrganizationReference` | Pointer to an Organization | Carries the "independently administered" signal used by NDI anti-gaming | BR-29 |

---

## PART 8 — Domain Events

Past-tense business facts. Producer is always an Identity aggregate or service.
Consumers listed conceptually — **no transport, no payload schema** (PART 17).

| Event | Trigger | Business meaning | Producer | Consumers | Business rules |
| --- | --- | --- | --- | --- | --- |
| `PersonRegistered` | A new human enters the ecosystem | A record now exists for a human who previously had none | Person | Analytics, Notification | Registration alone never implies verification or activity (INV-01, Constitution #11) |
| `FootballIdentityIssued` | Person created | The permanent identity now exists | Person / FootballIdentity | All contexts | Exactly one per Person, forever (INV-02, INV-03) |
| `RoleAssigned` / `RoleRevoked` | Role granted or ended in a scope | What this human may be, in this scope, from now | Person | Authorization, Organization | Role alone grants nothing without an active relationship (INV-21) |
| `UserBound` | Authentication subject attached | This human can now sign in | Person | Notification | One User per Person (INV-01) |
| `GuardianLinked` | A verified adult becomes responsible for a minor | Consent authority now exists for this child | GuardianLink | Consent, Notification, Analytics | Requires assurance L1+; a claimed link grants nothing (INV-07) |
| `GuardianLinkVerified` | Verification of the link completes | The link is now authority-bearing | GuardianLink | Consent, Metrics | Precondition of Guardian Verified (INV-07) |
| `GuardianReplaced` | Guardian change decided (DL-02) | Authority moves to a different adult | GuardianLink + Decision | Consent, Notification, Association | Never self-service; prior consents remain in history; new authority is not retroactive (INV-08, INV-09) |
| `GuardianAuthorityEnded` | Majority reached, or link terminated | The adult no longer speaks for this Person | GuardianLink | Consent, Notification | Majority transfer is a recorded event, never a silent expiry (INV-08) |
| `ConsentGranted` | Authority grants a purpose | This purpose is now permitted | Consent | Every consuming context, CTI | Per purpose only; assurance recorded at grant (INV-10, INV-12) |
| `ConsentRefused` | Authority declines | Explicit refusal is a fact worth keeping | Consent | Analytics, CTI | Refusal is appended, never inferred from silence (INV-11) |
| `ConsentRevoked` | Authority withdraws | Processing under this purpose must stop now | Consent | Every consuming context | Immediate; no justification required; never deletes history (INV-13) |
| `HighRiskRevocationRaised` | Revocation affects active squad, scouting exposure, federation submission or training set | An urgent, irreversible withdrawal | Consent | Notification, Audit, Review queue, Scouting, Competition | Immediate effect; review queue can never reverse it (INV-14) |
| `ConsentExpired` | Assurance downgrade or validity lapse | The basis for this consent no longer holds | Consent | Consuming contexts, Guardian notification | Follows automatically from `VerificationDowngraded` (INV-17) |
| `VerificationRequested` | Evidence submitted or re-check due | An assurance claim is being examined | Verification | Notification | — |
| `VerificationCompleted` | Assurance established or raised | The claim is now trusted at level L | Verification | Person, GuardianLink, Metrics | Evidence stays inside the domain; only the level is published (INV-16) |
| `VerificationDowngraded` | Evidence found fraudulent or expired | Trust is withdrawn | Verification + Decision | Consent, Competition, Child Protection | Dependent consents are suspended immediately; a Decision is mandatory (INV-17, DL-03) |
| `MembershipStarted` | Affiliation begins, guardian-approved | This Person now participates at this Organization | Membership | Organization, Competition, Journey, NDI | Guardian approval required for both types (INV-20) |
| `MembershipEnded` | Affiliation closes | Participation and the access it granted both end | Membership | Organization, Authorization, Journey | Closing never removes; access ends at once (INV-22, INV-21) |
| `PrimaryMembershipChanged` | The authoritative affiliation moves | Official affiliation, roster and eligibility all change | TransferService | Competition, Organization, Association | Only ever emitted together with `PlayerTransferred` (INV-18) |
| `MembershipTransferred` / `PlayerTransferred` | Transfer decided (DL-04) | The child's official club has changed, with approval and audit | TransferService + Decision | Competition, Organization, Association, Journey, Notification | A business event, never a field edit; roster reconstructable at any past date (Constitution #8, INV-18) |
| `MembershipPromotedToPrimary` | Secondary becomes official (DL-05) | A non-exclusive affiliation is now the authoritative one | TransferService | Same as Transfer | Executed **as** a Transfer with the full trail — never as a type change (INV-19) |
| `DuplicateSuspected` | Matching signals or offline reconciliation | Two records may be the same human | DuplicateResolutionService | Platform review queue | Never auto-merges (INV-05, NFR-08) |
| `IdentityMerged` | Merge decided (DL-01) | Two records were one human; one identity survives | Person + Decision | All contexts | Retired ID resolves to the survivor forever; both Journeys merge, neither truncates (INV-05) |
| `IdentityRecovered` | Recovery decided (DL-07) | Access restored to the same human | Person + Decision | Notification, Audit | May never bind a Football ID to a different human (INV-06) |
| `ActivityRecorded` | Qualifying activity accepted by the ACL | This child actually played or trained | Activity ACL | Lifecycle evaluation, VAP, NDI | Organization-recorded and adult-attested only; same attesting adult counts once for NDI (INV-30) |
| `LifecycleStateChanged` | Policy evaluation moves the Person | Where this child stands has changed | ActivityEvaluationService | Metrics, Notification, Competition | Carries `policy_id@version`; never deletes data; never silent where it affects the child's visibility or eligibility (INV-27, INV-28) |
| `PlayerArchived` | Long dormancy or guardian request | The record rests; the Journey is kept | Person | Analytics, Notification | Archival is never erasure; reversible (INV-31) |
| `IdentityDecisionRecorded` | Any DL-01…DL-08 decision | A consequential decision is now explainable | Decision | Association, Audit, Federation | Immutable; corrections are new linked decisions (INV-23, INV-24) |
| `StructuralExceptionRequested` | Someone asks to widen a child-affecting capability (DL-08) | The request itself is a fact worth recording | Decision | Child Protection Officer, Council | Refusals recorded as firmly as approvals, so requests are not relitigated informally |

---

## PART 9 — Domain Services

Services exist only where logic spans aggregates or requires policy the
aggregates should not own.

| Service | Why it cannot live in an aggregate | Responsibilities | Emits | Trace |
| --- | --- | --- | --- | --- |
| **IdentityVerificationService** | Coordinates Verification, Person and GuardianLink | Evaluate evidence against `VerificationPolicy`; set assurance; cascade downgrades to dependent consents | `VerificationCompleted`, `VerificationDowngraded` | FR-VER-01..07 |
| **DuplicateResolutionService** | Spans two Person aggregates | Detect probable duplicates; **never** auto-merge; prepare the merge decision; execute merge preserving both Journeys and the retired-ID resolution | `DuplicateSuspected`, `IdentityMerged` | FR-PER-04, DL-01 |
| **GuardianResolutionService** | Spans multiple GuardianLinks for one child | Determine who holds authority now; detect conflict; apply the restrictive-position rule pending resolution; escalate under Rule 0 | `GuardianReplaced`, `GuardianAuthorityEnded` | FR-GRD-03/09/10, DL-06 |
| **TransferService** | Spans two Membership aggregates and enforces the cross-aggregate INV-18 | Close outgoing Primary, open incoming Primary, atomically in business terms; execute promotion as a Transfer; guarantee point-in-time roster reconstruction | `PlayerTransferred`, `PrimaryMembershipChanged`, `MembershipPromotedToPrimary` | FR-MEM-06/10, ADR-0003 |
| **ConsentEvaluationService** | Spans Consent, GuardianLink, Verification and AgeBand | Answer "is this purpose permitted for this Person right now" with a reason; enforce age gate before consent; supply CTI inputs | (queries; no state change) | FR-CON-01..08, PRD PART 13 |
| **ActivityEvaluationService** | Spans QualifyingActivity facts and Person lifecycle | Evaluate activity against the active `ActivityPolicy`; move lifecycle state; stamp policy version; derive NEVER_ACTIVE | `LifecycleStateChanged` | FR-LFC-01..06, PRG-MET-001 |
| **AccessDecisionService** | Spans Person, Role, Membership, Consent, AgeBand | Evaluate the fixed order Person → Role → Relationship → Consent → Age Gate → Policy and return an **explainable** allow/deny | (queries; logged) | FR-ROL-02, PRD PART 15 |
| **IdentityRecoveryService** | Spans Person, Verification and Decision | Restore access at the assurance required by sensitivity; guarantee the identity never moves to another human | `IdentityRecovered` | FR-AUT-05, DL-07 |
| **JourneyProjectionService** | Reads across all aggregates | Build the Journey read model; supply JCS inputs with zero weight for consent-unjustified fields | (projection) | PRD PART 19 |

---

## PART 10 — Policies

Named, **versioned** configuration objects. Every value below is configuration,
never a constant in logic (NFR-10). Values themselves are Council-owned.

| Policy | Governs | Key parameters (values Council-owned) | Version stamped on | Trace |
| --- | --- | --- | --- | --- |
| **ActivityPolicy** | What counts as activity and when lifecycle moves | qualifying event types, window length, event and distinct-date thresholds, `inactive_after_days`, archival dormancy, seasonal adjustment | every `LifecycleStateChanged`, every published VAP/NDI figure | PRG-MET-001 |
| **VerificationPolicy** | What evidence yields what assurance | accepted evidence per claim type, minimum evidence for **L1 — Council decision OQ-02, unset**, L2 and L3 requirements, expiry and re-check intervals | every `VerificationCompleted`/`Downgraded` | FR-VER-01..07 |
| **ConsentPolicy** | How consent behaves | purpose list P1–P8 (closed), assurance required per purpose, P8 constraints (opt-in, L2, prohibited under 13, 90-day removal SLA), high-risk revocation triggers | every ConsentEvent | CONSENT-001 |
| **GuardianPolicy** | Guardian authority rules | age of majority (**default 18, OQ-01**), guardian cardinality and equal-authority default (**OQ-04**), conflict resolution = restrictive position pending Rule 0 adjudication | `GuardianLinked`, `GuardianReplaced` | FR-GRD-01..10 |
| **TransferPolicy** | How Primary Membership moves | mandatory guardian approval, effective-date rules, promotion-is-transfer rule, objection handling, association adjudication path | `PlayerTransferred` | ADR-0003, DL-04 |
| **MergePolicy** | How duplicates are resolved | matching signals and confidence bands, mandatory human decision, guardian confirmation where a minor is involved, survivor selection, reversal-by-new-decision | `IdentityMerged` | DL-01 |
| **RecoveryPolicy** | How access is restored | assurance required per capability sensitivity, guardian re-notification on guardian-account recovery, absolute prohibition on rebinding an identity to a different human | `IdentityRecovered` | FR-AUT-05, DL-07 |
| **PrivacyPolicy** | Exposure and retention | publishable attribute set per consumer capability (STK-INV-001), AgeBand-not-DOB rule, retention basis per data class, evidence reduction to assurance level after the dispute window | evaluation of every outward fact | PRD PART 16 |
| **JourneyCompletenessPolicy** | JCS weighting | component weights, zero weight for fields no active purpose justifies | every published JCS figure | PRG-VIS-001 §9 |
| **ReportingPolicy** | How metrics may be published | mandatory NEVER_ACTIVE companion to every registration figure (Constitution #11), per-purpose CTI reporting, **CTI phase floor — Council decision OQ-05, unset** | every published metric | Constitution #11, PRD PART 19 |

---

## PART 11 — Specifications

Reusable, composable, **explainable** business predicates. Every specification
must be able to state *why* it returned false — this is how Constitution #10
becomes structural rather than aspirational.

| Specification | Question | Satisfied when | Trace |
| --- | --- | --- | --- |
| `EligibleGuardian` | May this adult hold authority over this child? | Adult Person, verified at the level GuardianPolicy requires, link verified L1+, link active, not terminated, not restricted by a Decision | FR-GRD-04, INV-07 |
| `EligibleForVerification` | May this claim be verified now? | Claim type is recognised, subject exists, evidence meets `VerificationPolicy` for the target level, no active fraud finding | FR-VER-01..07 |
| `EligibleForConsent` | May consent be granted for this purpose? | Granting authority is valid (adult self, or `EligibleGuardian`), assurance meets the purpose requirement, **age gate passes**, purpose is in the closed list | FR-CON-01..08, PRD PART 13 |
| `GuardianVerified` | Does this child meet the guardian bar? | Verified GuardianLink at L1+ **and** P1 and P2 consent positions both active | Glossary, VAP definition |
| `EligibleForTransfer` | May this Player's Primary Membership move? | An ACTIVE Primary exists or is absent-and-being-filled, guardian approval recorded, no blocking objection or association hold, target Organization holds no active Membership for this Person | ADR-0003, INV-18/INV-23 |
| `EligibleForPromotion` | May this Secondary become Primary? | `EligibleForTransfer` holds **and** the Secondary is ACTIVE — promotion then executes as a Transfer, never a type change | INV-19 |
| `EligibleForCompetition` | Is the Identity-side eligibility predicate met? | Exactly one ACTIVE Primary Membership, age verified and within the competition's band, consents required for participation active, lifecycle state not ARCHIVED | Constitution #9, FR-MEM-03 |
| `EligibleForRecovery` | May access be restored to this claimant? | Recovery evidence meets `RecoveryPolicy` for the capability's sensitivity, and the claimant resolves to the **same** human | FR-AUT-05 |
| `IsActivePlayer` | Does this Person count as ACTIVE? | Qualifying activity meets the active ActivityPolicy thresholds in the window | PRG-MET-001 |
| `IsVerifiedActivePlayer` | Does this Person count toward the North Star? | Football ID issued **and** `GuardianVerified` **and** lifecycle ACTIVE — all three simultaneously | PRG-VIS-001, VAP |
| `IsNeverActive` | Has this Person ever actually played? | No qualifying activity has ever been recorded — derived, never stored | Constitution #11, INV-29 |
| `CountsTowardNdiPortability` | Does this affiliation prove portability? | Verified activity at two or more **independently administered** Organizations, with same-attesting-adult activity counted once | BR-29, ADR-0003 |
| `AccessPermitted` | May this actor do this to this child now? | Person → Role → active Relationship → valid Consent → Age Gate → Policy, all six in order, each explainable | FR-ROL-02, PRD PART 15 |
| `CapabilityExists` | Does this capability exist at all for this age band? | Returns **false structurally** for under-13 scouting — there is no path to configure it true | STK-INV-004, INV-32 |

---

## PART 12 — Invariants

Rules that must never be violated. Aggregate-scoped unless marked
**cross-aggregate**, in which case the enforcing service is named.

### Identity

| ID | Invariant | Enforced by | Trace |
| --- | --- | --- | --- |
| INV-01 | One human → exactly one Person → exactly one User binding | Person + DuplicateResolutionService | Constitution #3, FR-PER-01 |
| INV-02 | A `FootballId` is immutable once issued | FootballIdentity | Constitution #2, ADR-0002 |
| INV-03 | A `FootballId` is never re-issued, recycled or reassigned | FootballIdentity | ADR-0002, FR-FID-03 |
| INV-04 | A `FootballId` encodes no region, organization, birth year or sequence | `FootballId` VO construction | Constitution #3, ADR-0002 rev.2 |
| INV-05 | A retired `FootballId` resolves to its survivor forever; a merge never truncates either Journey | FootballIdentity + DuplicateResolutionService **(cross-aggregate)** | FR-FID-07, DL-01 |
| INV-06 | No operation may bind a `FootballId` to a different human — recovery included | IdentityRecoveryService **(cross-aggregate)** | FR-AUT-05 |

### Guardian

| ID | Invariant | Enforced by | Trace |
| --- | --- | --- | --- |
| INV-07 | An unverified Guardian Link confers no authority whatsoever | GuardianLink | FR-GRD-04 |
| INV-08 | Guardian authority ends at majority as a recorded event; new authority is never retroactive | GuardianLink + GuardianPolicy | FR-GRD-08 |
| INV-09 | A Guardian may never alter an assessment, match record, referee report or statistic | AccessDecisionService **(cross-context)** | STK-INV-002, FR-GRD-07 |
| INV-10 | Guardian objection attaches as an Annotation; the annotated record is never mutated | Cross-context contract (PART 17) | STK-INV-003 |

### Consent

| ID | Invariant | Enforced by | Trace |
| --- | --- | --- | --- |
| INV-11 | Consent is append-only; no consent fact is ever modified or deleted | Consent | CONSENT-001, FR-CON-02 |
| INV-12 | Consent is per purpose; no object can represent bundled or blanket consent | Consent aggregate scoping | FR-CON-08, BR-14 |
| INV-13 | Revocation is immediate, requires no justification, and never deletes history | Consent | FR-CON-03 |
| INV-14 | A High-Risk Revocation takes effect immediately and can never be reversed by review | Consent + review queue | FR-CON-04 |
| INV-15 | Absence of consent means the capability is unavailable — never a silent degraded result | ConsentEvaluationService | FR-CON-06, BR-18 |

### Verification and privacy

| ID | Invariant | Enforced by | Trace |
| --- | --- | --- | --- |
| INV-16 | Verification evidence never leaves the domain; only the assurance level is published | Verification + PrivacyPolicy | FR-VER-04 |
| INV-17 | An assurance downgrade immediately suspends every consent that required the higher level | IdentityVerificationService **(cross-aggregate)** | FR-VER-06, DL-03 |
| INV-26 | Exact date of birth is never published outward; consumers receive `AgeBand` | PrivacyPolicy | PRD PART 16 |
| INV-33 | Only attributes justified by an active consent purpose are held at all | Person + PrivacyPolicy | FR-PER-06, STK-INV-001 |

### Membership

| ID | Invariant | Enforced by | Trace |
| --- | --- | --- | --- |
| INV-18 | At most one ACTIVE Primary Membership per Player | TransferService **(cross-aggregate; DB constraint at Stage 3)** | Constitution #9, INV-MEM-01 |
| INV-19 | Promotion of a Secondary to Primary is a Transfer, never a type edit | TransferService | Constitution #8, INV-MEM-03 |
| INV-20 | Guardian approval is required to start either Membership type | Membership | INV-MEM-05 |
| INV-21 | Access derived from a Membership or Role ends the instant that relationship ends | AccessDecisionService **(cross-aggregate)** | FR-ROL-03, FR-AUT-07 |
| INV-22 | Historical Memberships are immutable; ending closes, never removes | Membership | INV-MEM-06 |
| INV-23 | An Organization holds at most one ACTIVE Membership of any type per Player | TransferService **(cross-aggregate)** | INV-MEM-04 |
| INV-34 | Zero ACTIVE Primary Membership is a valid state, never an error | Person + Membership | INV-MEM-02, FR-MEM-05 |
| INV-35 | The roster of any Organization at any past date must be reconstructable | Membership history + Transfer events | FR-MEM-10 |

### Decision and explainability

| ID | Invariant | Enforced by | Trace |
| --- | --- | --- | --- |
| INV-24 | Every consequential identity outcome has a Decision record | All Domain Services | Constitution #10, FR-DLG-01 |
| INV-25 | A Decision is immutable; a correction is a new linked Decision | Decision | FR-DLG-03 |
| INV-36 | A Decision without a `DecisionReason` and a named `Approver` is invalid | Decision | Constitution #10, FR-DLG-02 |

### Lifecycle and reporting

| ID | Invariant | Enforced by | Trace |
| --- | --- | --- | --- |
| INV-27 | A Person occupies exactly one lifecycle state at all times, changed only by a legal transition | Person + ActivityEvaluationService | FR-LFC-01 |
| INV-28 | Every transition and every published metric carries `policy_id@version` | ActivityEvaluationService | FR-LFC-06, NFR-10 |
| INV-29 | NEVER_ACTIVE is derived, never stored, and reporting must distinguish it | Specification + ReportingPolicy | Constitution #11, FR-LFC-05 |
| INV-30 | Qualifying activity is organization-recorded and adult-attested; the same attesting adult counts once for NDI | Activity ACL | BR-25, BR-29 |
| INV-31 | Archival retains the Journey; archival is never erasure and is reversible | Person | FR-LFC-04 |
| INV-37 | No state transition deletes data, and none that affects a child's visibility, eligibility or exposure happens silently to the Guardian | ActivityEvaluationService | PRD PART 11 |

### Overriding

| ID | Invariant | Enforced by | Trace |
| --- | --- | --- | --- |
| INV-32 | Under-13 scouting capability does not exist as a path — it is absent, not denied | `CapabilityExists` specification, structurally | Constitution #6, STK-INV-004 |
| INV-38 | Where interests conflict, the outcome best protecting the child prevails; guardian consent is necessary but never sufficient | GuardianResolutionService, ConsentEvaluationService, every escalation path | Constitution #6, Rule 0 |

---

## PART 13 — Lifecycle Models

### 13.1 Identity Lifecycle

```text
        REGISTERED --guardian verified--> VERIFIED --activity threshold--> ACTIVE
             |                               ^  |                            |
             |                               |  |                    activity lapse
        dormancy                     activity resumes                        v
             |                               |  |              TEMPORARILY_INACTIVE
             v                               |  +--dormancy-->            |
          INACTIVE <-------------------------+                            |
             |                        (inactive_after_days elapsed) <-----+
        long dormancy / guardian request
             v
          ARCHIVED --reactivation--> VERIFIED | INACTIVE
```

Business meaning per state, entry, exit and re-entry are as specified in
`IDN-PRD-001` PART 11 and are not restated. Domain-layer additions:

- Every edge is guarded by the active `ActivityPolicy`; there are no time-based edges in logic (INV-28).
- `TEMPORARILY_INACTIVE` is also entered on zero ACTIVE Primary Membership (INV-34) — a child between clubs is between clubs, not lost.
- `ARCHIVED` is reversible. There is no terminal state in this domain, because a human is never finished.
- `NEVER_ACTIVE` is orthogonal: a derived flag applicable in any state (INV-29).

### 13.2 Guardian Lifecycle

```text
CLAIMED --verification--> VERIFIED --> ACTIVE --+--> SUSPENDED --restored--> ACTIVE
                                                |
                                                +--> TERMINATED (majority | replacement | safeguarding)
```

- CLAIMED confers nothing (INV-07).
- SUSPENDED arises from an assurance downgrade (INV-17) or a safeguarding hold; consents dependent on the link suspend with it.
- TERMINATED at majority transfers authority to the Player as a recorded event (INV-08).

### 13.3 Membership Lifecycle

```text
PENDING --guardian approval--> ACTIVE --+--> ENDED (terminal, immutable)
                                        |
                                        +--> [PRIMARY only] Transfer --> ENDED + new ACTIVE elsewhere
```

- PENDING without guardian approval never becomes ACTIVE (INV-20).
- ENDED is terminal and immutable (INV-22); reinstatement is a new Membership.
- Type never changes on a record: promotion produces a Transfer (INV-19).

### 13.4 Consent Lifecycle (per Person per Purpose)

```text
NOT_GRANTED --grant--> GRANTED --revoke--> REVOKED --grant again--> GRANTED
     |                    |                                            
     +--refuse--> REFUSED |--assurance downgrade / validity lapse--> EXPIRED
```

The state names describe the **derived position**; the underlying ledger only
ever grows (INV-11). Re-granting after revocation is a new appended fact, not a
resurrection of the old one — which is what makes CTI honest over time.

### 13.5 Verification Lifecycle

```text
REQUESTED --evidence--> UNDER_REVIEW --> COMPLETED(level L)
                                              |
                          +-------------------+-------------------+
                          v                                       v
                    EXPIRED (interval elapsed)          REVOKED (fraud found)
                          \                                      /
                           +--> triggers downgrade cascade (INV-17)
```

---

## PART 14 — Business Rules Catalogue

`IDN-PRD-001` PART 10 defines BR-01…BR-32 and remains the normative catalogue.
This table maps each to its domain realisation — the proof that no rule was lost
in translation.

| BR | Rule (abbreviated) | Domain realisation | Source |
| --- | --- | --- | --- |
| BR-01 | Player owns the Journey | Journey read model keyed on FootballId; no Organization write path | Constitution #1 |
| BR-02 | Journey append-only | All sources append-only (INV-11, INV-22, INV-25) | Constitution #1 |
| BR-03 | Ending a relationship ends access, not history | INV-21 + INV-22 | PG-08 |
| BR-04 | One human, one Person, one Football ID | INV-01, INV-02 | Constitution #3 |
| BR-05 | Football ID fully opaque | `FootballId` VO, INV-04 | ADR-0002 |
| BR-06 | Never re-issued or recycled | INV-03 | ADR-0002 |
| BR-07 | Possession confers no authority | `AccessPermitted` requires all six steps; ID is not one of them | Zero Trust |
| BR-08 | Merge is a decision; retired ID stays resolvable | MergePolicy, DuplicateResolutionService, INV-05 | DL-01 |
| BR-09 | Minor data only under verified guardian consent | `EligibleForConsent`, INV-07 | CONSENT-001 |
| BR-10 | Consent Authority ≠ Evidence Authority | INV-09 | STK-INV-002 |
| BR-11 | Objection annotates, never mutates | INV-10, PART 17 contract | STK-INV-003 |
| BR-12 | Authority ends at majority, recorded | INV-08, `GuardianAuthorityEnded` | FR-GRD-08 |
| BR-13 | Child's interest prevails | INV-38 | Constitution #6 |
| BR-14 | Per-purpose consent only | INV-12 (structural: aggregate scoped per purpose) | CONSENT-001 |
| BR-15 | Append-only, freely revocable | INV-11, INV-13 | CONSENT-001 |
| BR-16 | High-Risk Revocation immediate, irreversible | INV-14, `HighRiskRevocationRaised` | CONSENT-001 |
| BR-17 | P8 opt-in, L2, under-13 prohibited, 90-day SLA | ConsentPolicy P8 parameters + age gate | CONSENT-001 |
| BR-18 | No consent → capability unavailable | INV-15 | Privacy by Design |
| BR-19 | One ACTIVE Primary | INV-18 | ADR-0003 |
| BR-20 | Secondary 0..N, no eligibility | `MembershipType`, `EligibleForCompetition` | Constitution #9 |
| BR-21 | Transfer is a business event | TransferService, `PlayerTransferred` | Constitution #8 |
| BR-22 | Promotion is a Transfer | INV-19 | ADR-0003 |
| BR-23 | One active Membership per Organization per Player | INV-23 | ADR-0003 |
| BR-24 | Zero active Primary is valid | INV-34 | ADR-0003 |
| BR-25 | Activity organization-recorded, adult-attested | Activity ACL, INV-30 | PRG-MET-001 |
| BR-26 | Thresholds are configuration | ActivityPolicy, INV-28 | PRG-MET-001 |
| BR-27 | Only ACTIVE counts to VAP; NEVER_ACTIVE never | `IsVerifiedActivePlayer`, INV-29 | PRG-MET-001 |
| BR-28 | Archival retains the Journey | INV-31 | PRG-MET-001 |
| BR-29 | Same attesting adult counts once for NDI | `CountsTowardNdiPortability`, INV-30 | PRG-VIS-001 §9.1 |
| BR-30 | Six-step access evaluation | AccessDecisionService, `AccessPermitted` | PRG-STK-001 PART 12 |
| BR-31 | Non-essential player-level access is not built | INV-33, PrivacyPolicy, Published Language | STK-INV-001 |
| BR-32 | Under-13 scouting structurally absent | INV-32, `CapabilityExists` | STK-INV-004 |

**Result: 32 of 32 business rules realised.** No rule is unmodelled; no domain
element exists without a rule behind it.

---

## PART 15 — Decision Log Model

The domain realisation of `IDN-PRD-001` PART 17 (DL-01…DL-08) and Constitution
#10.

| Element | Domain meaning | Constraint |
| --- | --- | --- |
| **Decision** | An immutable record that a consequential identity outcome was made | Aggregate root A-07; one of the eight `DecisionType` values; never modified (INV-25) |
| **Trigger** | The business circumstance that opened the decision | Mandatory; drawn from the trigger set defined per type in the PRD |
| **Evidence** | An `EvidenceReference`, never the evidence itself | Never published outward (INV-16); retention governed by PrivacyPolicy |
| **Reason** | The business explanation, in the ubiquitous language | Mandatory and non-empty (INV-36). A decision that cannot be explained in business language is not a valid decision |
| **Approver** | The named authority who decided | Mandatory. For child-affecting decisions the approver is never "system"; safeguarding cases name the Child Protection Officer (INV-36) |
| **Outcome** | What was decided and what changed | Links to every aggregate affected, so the Journey can show cause alongside effect |
| **Audit** | Access to a Decision is itself recorded | FR-DLG-05 |
| **Explainability** | Any outcome can be reconstructed as: policy version in force + specification results + decision reason | This is the structural realisation of Constitution #10 — the same three parts also make an AI-assisted recommendation auditable, since a recommendation can never *be* the approver |

**Correction model.** A mistaken decision is never edited or deleted. A new
Decision of the same type is created, linked to the original, with its own reason
and approver. The record therefore shows both the error and the correction —
which is the point.

**Association access.** An Association may read the Decision Log within its
jurisdiction to adjudicate a dispute, and may record its adjudication as a new
Decision. It gains no mutation right over identity or evidence (FR-DLG-04).

---

## PART 16 — Risk Model

Domain-layer treatment of `IDN-PRD-001` PART 18. The question here is which
modelling element makes the risk structurally harder, not merely policed.

| Risk | Structural mitigation in this model | Residual and who owns it |
| --- | --- | --- |
| **Identity fraud** (RSK-01) | Verification as its own aggregate with reversible outcomes (INV-17); `EligibleForCompetition` requires verified age; fraud produces a downgrade cascade, not a quiet edit | Medium — evidence quality is a policy value, and **OQ-02 is unresolved**. Council |
| **Duplicate identity** (RSK-02) | `DuplicateSuspected` is a first-class event; MergePolicy forbids auto-merge; INV-05 keeps the retired ID resolvable forever; the legacy/offline ACL cannot silently create a second human | Medium — offline intake volume is the driver. Platform Operator |
| **Consent abuse** (RSK-05) | Bundled consent is *unrepresentable* — the aggregate is scoped per purpose (INV-12); assurance recorded at grant; revocation always available | Medium — comprehension is measurable only imperfectly. Privacy Officer |
| **Guardian conflict** (RSK-03) | Separate GuardianLink aggregates so parents never block each other technically; conflict escalates as a business decision (DL-06); restrictive position stands pending Rule 0 adjudication (INV-38) | Medium — inherently social. Child Protection Officer |
| **Enumeration** (RSK-04) | `FootballId` opacity (INV-04); `DisplayCode` explicitly not an authenticator; possession is not a step in `AccessPermitted` | Low. Security Architect |
| **Transfer abuse** (RSK-06) | Transfer is an event with mandatory guardian approval; Memberships immutable (INV-22); point-in-time roster reconstruction is an invariant (INV-35), not a feature | Low. Association |
| **Privacy breach** (RSK-07) | Published Language is an allowlist, not a filter; DOB never leaves (INV-26); attributes unjustified by purpose are not held at all (INV-33); access dies with the relationship (INV-21) | Low–Medium. Privacy Officer |
| **Scouting misuse** (RSK-08) | `CapabilityExists` returns false structurally for under-13 (INV-32) — there is nothing to misconfigure; every widening request is recorded (DL-08) | Low, standing Council item. Child Protection Officer |
| **NDI gaming** (RSK-09) | `CountsTowardNdiPortability` embeds the independently-administered test and same-adult-counts-once rule (INV-30) | Medium. Council |
| **Registration inflation** (RSK-10) | NEVER_ACTIVE derived and mandatory in reporting (INV-29, Constitution #11) | Low. Council reporting |
| **Policy drift** (RSK-12) | Every transition and metric stamped with `policy_id@version` (INV-28) | Low. Data Architect |

---

## PART 17 — Cross-Context Contracts

Conceptual only. **No API, no payload, no transport.** Each row states what the
other context may rely on and what it may never do.

| Context | Identity provides | The context must never | Invariant protected |
| --- | --- | --- | --- |
| **Competition** | `EligibilityDecision`, `AgeBand`, `PrimaryAffiliation`, `LifecycleState` | Derive eligibility from a Secondary Membership; cache eligibility past a `PrimaryMembershipChanged`; see a date of birth | Constitution #9, INV-26 |
| **Organization** | Membership facts, roster as at any date, role assignments in its own scope | Claim ownership of a Player; retain access after `MembershipEnded`; alter a Journey | Constitution #1, INV-21 |
| **Development** (assessments, coaching) | `FootballId`, `AgeBand`, `ConsentDecision` for the development purpose, active relationship | Write identity facts; accept a Guardian edit to an assessment — objection arrives only as an Annotation | STK-INV-002, INV-09, INV-10 |
| **Medical** | `FootballId`, `GuardianVerifiedStatus`, consent for the medical purpose | Treat registration consent as medical consent; expose medical data to any other context | INV-12, INV-15 |
| **Finance** | `FootballId`, Organization reference, Guardian billing relationship | Consume child attributes beyond what billing requires | STK-INV-001, INV-33 |
| **Scouting** | For 13+ only: `FootballId`, `AgeBand`, explicit scouting consent, `PrimaryAffiliation` | Exist at all for under-13 — the path is absent, not denied; contact a child outside the sanctioned channel | INV-32, Constitution #6 |
| **Notification** | Recipient resolution, guardian contact authority, consent for the notification purpose | Notify a child directly where GuardianPolicy requires guardian mediation; use contact data for marketing | INV-38, PrivacyPolicy |
| **Analytics** | Aggregate and de-identified metrics; VAP, NDI, JCS, CTI with policy versions | Receive player-level rows where aggregate suffices; publish a registration figure without its NEVER_ACTIVE companion | STK-INV-001, Constitution #11 |
| **Federation** (future) | Stable opaque `FootballId`, verified status, transfer history | Impose a meaningful identifier as the internal identity — external IDs are held as translated references only | Constitution #2/#3, Federation ACL |

**Integration principle.** Every downstream context consumes *decisions and
facts*, never Identity's internal state. Identity publishes conclusions
(`EligibilityDecision`, `ConsentDecision`) rather than the raw material to
recompute them, because a context that recomputes eligibility from raw data will
eventually recompute it wrongly, and the child bears that error.

---

## PART 18 — Acceptance Criteria

`IDN-CDM-001` / `IDN-EVT-001` / `IDN-ERD-001` may begin when all hold.

| # | Criterion | Status | Evidence |
| --- | --- | --- | --- |
| AC-DM-01 | Every Aggregate has purpose, responsibilities, consistency boundary, invariants and lifecycle | PASS | PART 5 (7 roots) |
| AC-DM-02 | Every Entity has business meaning, responsibilities, identity, lifecycle, owned and referenced objects | PASS | PART 6 |
| AC-DM-03 | Every Value Object states the illegal state it prevents | PASS | PART 7 (25 VOs) |
| AC-DM-04 | Every Domain Event has trigger, meaning, producer, consumer and business rules | PASS | PART 8 (33 events) |
| AC-DM-05 | Every Domain Service justifies why its logic cannot live in an aggregate | PASS | PART 9 (9 services) |
| AC-DM-06 | Every Policy is named, versioned, and holds no value in logic | PASS | PART 10 (10 policies) |
| AC-DM-07 | Every Specification is explainable, not merely boolean | PASS | PART 11 (14 specifications) |
| AC-DM-08 | Cross-aggregate invariants name their enforcing service and their Stage-3 constraint | PASS | INV-05/06/17/18/21/23 |
| AC-DM-09 | All 32 PRD business rules are realised; none lost | PASS | PART 14, 32/32 |
| AC-DM-10 | All 11 Constitution clauses map to at least one invariant | PASS | PART 19 §19.1 |
| AC-DM-11 | No SQL, ERD, table, API, endpoint, schema, repository or code appears | PASS | Self-review |
| AC-DM-12 | No conflict with an approved artefact; conflicts escalated, not assumed away | PASS with note | OQ-02 and OQ-05 carried forward as Council-owned policy **values**; no structural assumption substituted |
| AC-DM-13 | Every element traces to an approved artefact | PASS | PART 19 |
| AC-DM-14 | Council approval recorded and registry updated | PENDING | This submission |

---

## PART 19 — Traceability Matrix

### 19.1 Constitution → invariant

| Clause | Invariants |
| --- | --- |
| 1. Player Owns The Journey | INV-05, INV-22, INV-31, INV-33 (+ Journey as read model, no org write path) |
| 2. Identity is Opaque | INV-02, INV-04 |
| 3. Random opaque Football ID | INV-03, INV-04, Federation ACL |
| 4. Consent by Default | INV-11, INV-12, INV-15 |
| 5. Privacy by Design | INV-16, INV-26, INV-33 |
| 6. The Child's Interest Prevails | INV-32, INV-38 |
| 7. No Implementation Before Approval | AC-DM-11, AC-DM-14 |
| 8. Transfer is Business Event | INV-19, INV-35, `PlayerTransferred` |
| 9. One Active Primary Membership | INV-18, INV-23, `EligibleForCompetition` |
| 10. Explainable Identity Decisions | INV-24, INV-25, INV-36, PART 15, explainable specifications |
| 11. Reporting distinguishes NEVER_ACTIVE | INV-29, ReportingPolicy |

### 19.2 Vision → Stakeholder → PRD → Rule → Aggregate → Entity → VO → Event → future CDM

| Vision element | Stakeholder | PRD requirement | Business rule | Aggregate | Entity | Value Object | Domain Event | Future CDM obligation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Portable journey | Player, Guardian | FR-PER-03, FR-MEM-09/10 | BR-01..03 | Person, Membership | Person, Membership | `FootballId`, `MembershipPeriod` | `MembershipStarted/Ended` | Append-only membership history, point-in-time roster |
| One identity per human | Player, SSB Admin | FR-PER-01/04, FR-FID-07 | BR-04, BR-08 | Person, Decision | FootballIdentity | `FootballId` | `DuplicateSuspected`, `IdentityMerged` | Identity-link resolution incl. retired IDs |
| Opaque identity | Federation, Platform | FR-FID-02..06 | BR-05..07 | Person | FootballIdentity | `FootballId`, `DisplayCode` | `FootballIdentityIssued` | Opaque key + non-enumerable lookup |
| Verified guardianship | Guardian, CPO | FR-GRD-01/04/08, FR-VER-* | BR-09, BR-12 | GuardianLink, Verification | GuardianLink, Verification | `AssuranceLevel`, `AuthorityWindow` | `GuardianLinked`, `VerificationCompleted` | Guardian link + assurance, evidence restricted |
| Consent-governed data | Guardian, Privacy Officer | FR-CON-01..08 | BR-14..18 | Consent | ConsentEvent | `ConsentPurpose`, `ConsentPosition` | `ConsentGranted/Revoked`, `HighRiskRevocationRaised` | Append-only consent ledger, derived position |
| Child protection | CPO, Scout | FR-ROL-06, FR-CON-05 | BR-32, BR-17 | — (structural) | — | `AgeBand` | `StructuralExceptionRequested` | No under-13 scouting path exists |
| Truthful multi-org reality | Player, regional programme | FR-MEM-02/04 | BR-20 | Membership | Membership | `MembershipType` | `MembershipStarted` | Typed membership, eligibility from Primary only |
| Auditable transfer | Association, Organization | FR-MEM-06/10 | BR-21/22 | Membership, Decision | Membership, Decision | `DecisionReason` | `PlayerTransferred`, `MembershipPromotedToPrimary` | Immutable transfer history |
| Access ends with relationship | Coach, Child | FR-ROL-02/03, FR-AUT-07 | BR-30 | Person, Membership | RoleAssignment | `RoleScope`, `ValidityPeriod` | `RoleRevoked`, `MembershipEnded` | Relationship-scoped access facts |
| Provable decisions | Association, Federation | FR-DLG-01..05 | BR-08 | Decision | Decision | `DecisionType`, `Approver` | `IdentityDecisionRecorded` | Append-only decision store + access log |
| Countable North Star | Platform, Council | FR-LFC-01..06, FR-CON-07 | BR-25..29 | Person | Person, QualifyingActivity | `LifecycleState`, `PolicyVersion`, `NeverActiveFlag` | `LifecycleStateChanged`, `ActivityRecorded` | Versioned policy + state history + metric stamps |

### 19.3 Approved artefact → this model

| Artefact | Consumed in |
| --- | --- |
| PRG-VIS-001 rev.3 | PART 1, PART 11 metric specifications, PART 19 |
| PRG-STK-001 rev.1 | PART 2 consumers, PART 12 (STK-INV-001..004), PART 17 |
| IDN-PRD-001 v1.0 | Everywhere — this model is its structural realisation; PART 14 proves 32/32 rule coverage |
| PRG-MET-001 | PART 10 ActivityPolicy, PART 13.1, INV-27..30 |
| CONSENT-001 | A-04 Consent aggregate, PART 13.4, INV-11..15 |
| ADR-0001 | Not consumed — runtime stack is out of domain-model scope by design |
| ADR-0002 rev.2 | `FootballId` VO, INV-02..04, Federation ACL |
| ADR-0003 | A-06 Membership, TransferService, INV-18..23, INV-34/35 |

### 19.4 Downstream obligations created

| Artefact | Obligation |
| --- | --- |
| IDN-EVT-001 | Catalogue all 33 events of PART 8 with versioning and ordering semantics |
| IDN-CDM-001 | Canonical model for the 7 aggregates and 25 value objects; must not flatten Consent's ledger into a flag |
| IDN-ERD-001 | Express INV-18 as a partial unique constraint; append-only enforcement for Consent and Decision; DOB access restriction |
| IDN-API-001 | Expose only the Published Language of PART 2; AgeBand not DOB; enumeration resistance; policy version on metric responses |
| Authorization Model | Implement the six-step `AccessPermitted` chain with per-step explainability |
| Security Model | Enumeration resistance, evidence containment (INV-16), decision-access logging |

---

## Quality Gate self-check (G3 entry)

| Gate item | Status | Note |
| --- | --- | --- |
| Constitution compliance | PASS | All 11 clauses mapped to invariants (§19.1) |
| DDD compliance | PASS | Aggregates sized by consistency need; Journey correctly a read model, not an aggregate |
| Aggregate consistency | PASS | 7 roots; every cross-aggregate invariant names its enforcing service and Stage-3 constraint |
| Domain event completeness | PASS | 33 events; every state-changing operation emits one |
| Policy completeness | PASS | 10 versioned policies; no threshold in logic |
| Invariant completeness | PASS | 38 invariants; all 32 PRD business rules realised |
| Child protection | PASS | INV-32 structural absence, INV-38 Rule 0 decisive, guardian conflict resolves restrictively |
| Privacy by Design | PASS | Published Language is an allowlist; DOB contained; unjustified attributes not held |
| Explainability | PASS | PART 15 + explainable specifications + policy-version stamps |
| Traceability | PASS | Every element traced; no orphan aggregates, entities, VOs, events or invariants |
| **Open business decisions** | **CARRIED** | OQ-02 and OQ-05 remain Council-owned policy values; structurally non-blocking for the model, blocking for G2/G3 exit |
