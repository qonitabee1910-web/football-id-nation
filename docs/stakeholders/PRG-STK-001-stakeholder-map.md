---
id: PRG-STK-001
title: Enterprise Stakeholder Map — Youth Football Ecosystem Platform
context: programme
stage: 1
status: APPROVED
revision: 1
approved_on: 2026-08-06
gate: G1 PASSED
owner: Chief Product Officer
co_owner: Chief Enterprise Architect
derives_from: [PRG-VIS-001, CONSENT-001, PRG-MET-001]
satisfied_by: [IDN-PRD-001, PRG-CTX-001, PRG-CDM-001]
adrs: [ADR-0001, ADR-0002, ADR-0003]
north_star_impact: "Names every actor that can create, verify, or destroy a Verified Active Player, and the authority each holds over child data."
---

# PRG-STK-001 — Enterprise Stakeholder Map

**One Identity. One Journey. One Football Ecosystem.**

Stage 1 artefact. The single official reference for who exists in the ecosystem,
what authority each actor holds, and what data each may own, produce, or consume.
Every later artefact — Identity PRD, domain model, canonical model, authorization
model, consent model, AI interaction model — resolves actor questions here and
nowhere else.

---

## PART 1 — Executive Summary

The platform is Football Data Infrastructure, not SSB management software. That
positioning decides the stakeholder architecture: the **Player is the data
subject and the journey owner**, every organizational actor is a *participant
with a bounded, revocable authority*, and no actor — including the Federation —
holds absolute rights over a child's record.

Forty-one stakeholder types are catalogued across nine groups. Three findings
shape everything downstream:

1. **Authority is delegated, never inherent.** A Coach can see a child's record
   because an active Membership plus an unrevoked consent purpose grants it, not
   because they are a Coach. Removing the Membership removes the access the same
   day. This is the operational form of Zero Trust.
2. **Consent authority is held by the Guardian, exercised for the Player, and
   transfers to the Player at 18.** Guardian ÷ Player ratio of 0.80 (PRG-VIS-001
   §10.2) means one Guardian holding authority for several Players is the normal
   case, present from day one.
3. **Commercial stakeholders are deliberately weak actors.** Sponsors, equipment
   partners, insurers, and stores receive aggregated or explicitly consented data
   only, never child-level scouting data, and hold no write authority over a
   Journey. No consent purpose permits advertising or profiling, and none may be
   added (PRG-VIS-001 §7).

The hard constraint applied throughout: **The Child's Interest Prevails**. Where
an SSB's retention interest, a Scout's discovery interest, an Association's
reporting interest, or a Sponsor's marketing interest conflicts with the child's,
the child's outcome wins and the conflicting capability is dropped, not
negotiated.

---

## PART 2 — Stakeholder Principles

| # | Principle | Consequence for this map |
| --- | --- | --- |
| S0 | **The Child's Interest Prevails** | Any capability that cannot be justified as serving the child Player is removed from the stakeholder's permission set. |
| S1 | **Data Subject ≠ Data Owner ≠ Data Custodian** | Every data class names all three separately (PART 7). The platform is Custodian for almost everything and Owner of almost nothing. |
| S2 | **Authority is delegated and revocable** | No permission is granted by role alone; each requires role + active relationship + valid consent. |
| S3 | **Identity before relationship** | Every human actor is one Person with one Football ID-scoped account; relationships hang off that Person (Principle 3). |
| S4 | **Organizations hold Membership, never ownership** | Transfer changes Membership; the Journey is untouched (Principle 1). |
| S5 | **Read is the default, write is exceptional** | Most stakeholders consume; only Coach, Organization Admin, Match Official, and the Player/Guardian produce record-level data. |
| S6 | **No stakeholder may be created that requires under-13 scouting access** | Structural, not policy: the capability does not exist to grant. |
| S7 | **Aggregation is the escape valve** | Where a stakeholder has a legitimate need but no lawful child-level basis, it receives k-anonymised aggregates, never rows. |
| S8 | **Every actor is observable** | Access to child-sensitive data writes an access-log entry the Guardian can read (CONSENT-001 §8). |
| S9 | **Membership is typed** | One `ACTIVE` Primary Membership, `0..N` Secondary. Eligibility and Transfer follow Primary only; the Journey records both (ADR-0003). |

### PART 2.1 — Named invariants (Council-adopted, 6 Aug 2026)

These four rules are citable by ID from every downstream artefact.

**STK-INV-001 — Data Minimisation by Capability** *(constitutional invariant)*

> No stakeholder may consume player-level data unless player data is essential
> to fulfil its primary business capability.

Privacy by Architecture, not Privacy by Policy: where the capability does not
require player-level data, the access path is not built, so no configuration can
open it. Applied here:

| Stakeholder | Sees | Never sees |
| --- | --- | --- |
| Venue | Booking, field, schedule, capacity, fixture times | Roster, player identity, any player-level record |
| Commercial Partner (sponsor, equipment, insurer, store) | Aggregate analytics, k-anonymised metrics, sponsorship context | Any child-level row, contact detail, or development record |

**STK-INV-002 — Record Authority Principle**

> Consent Authority ≠ Evidence Authority. *Guardian owns consent, not truth.*

| Guardian may | Guardian may never |
| --- | --- |
| Grant consent | Change an Assessment result |
| Revoke consent | Delete match history |
| Object to a record, in writing | Edit a Referee report |
| Request export, correction of factual identity data, and erasure per CONSENT-001 | Alter statistics or activity records |

Objection never mutates evidence. It attaches to it.

**STK-INV-003 — Guardian Annotation** *(first-class object)*

A Guardian objection creates a `GuardianAnnotation` with its own lifecycle,
attached to — never merged into — the underlying immutable record:

```text
Assessment ──▶ Guardian Comment ──▶ Coach Response ──▶ Resolved
                                                  └──▶ Open (escalates to
                                                       Compliance Officer)
```

Rules: the annotated record is unchanged and remains authoritative; the
annotation is always visible alongside the record to anyone entitled to read the
record; an unresolved annotation is reported in the Guardian's access log; no
role may delete an annotation.

**STK-INV-004 — Structural Prohibition**

> Under-13 × Scouting Capability = **Not Implemented**. Never `permission = false`.

A permission can be misconfigured; an absent capability cannot. Every "denied"
in this document that concerns under-13 scouting exposure means the capability is
not built. This is the official term and supersedes the wording "explicitly
denied" wherever it appears (PART 4 E-group, PART 8, PART 14 R1, PART 18 §5).

---



---

## PART 3 — Stakeholder Taxonomy

```text
Ecosystem
├── A. Players                 (data subjects)
│     ├── Youth Player (6–17)
│     └── Amateur Player (18+)
├── B. Family                  (consent authority)
│     ├── Parent
│     └── Legal Guardian
├── C. Football Organizations  (membership holders)
│     ├── SSB · Club · Academy
│     └── Organization Admin (person acting for org)
├── D. Football Professionals  (activity producers)
│     ├── Head Coach · Assistant Coach · Goalkeeper Coach · Fitness Coach
│     ├── Scout                (restricted consumer)
│     └── Referee · Match Official
├── E. Competition             (context providers)
│     ├── Tournament Organizer · League Organizer
│     └── Venue · Match Commissioner
├── F. Association             (governing, regional)
│     └── APSSI · Askab · Askot · Asprov
├── G. Federation              (governing, national)
│     └── PSSI
├── H. Commercial              (weak consumers)
│     └── Sponsor · Equipment Partner · Insurance · Football Store
└── I. Platform                (custodian)
      └── Super Admin · Customer Success · Support · Compliance · Security
```

Classification axes used throughout:

- **Nature:** Human Actor · Organizational Actor · System Actor.
- **Authority class:** Subject · Consent Authority · Producer · Consumer ·
  Governing · Custodian.
- **Child-data posture:** Direct (child-level, consented) · Aggregate-only · None.

| Group | Nature | Authority class | Child-data posture |
| --- | --- | --- | --- |
| A Players | Human | Subject | Own record |
| B Family | Human | Consent Authority | Direct, full, for their own children |
| C Organizations | Organizational | Producer + Consumer | Direct, membership-scoped |
| D Professionals | Human | Producer / Consumer | Direct, assignment-scoped (Scout: 13+ only) |
| E Competition | Organizational | Producer + Consumer | Eligibility-minimum only |
| F Association | Organizational | Governing | Aggregate + eligibility |
| G Federation | Organizational | Governing | Aggregate only |
| H Commercial | Organizational | Consumer | Aggregate-only, never child-level |
| I Platform | System/Human | Custodian | Break-glass, logged, never routine |

---

## PART 4 — Stakeholder Catalogue

Each entry uses the 18-field Council schema. Fields are abbreviated where the
group-level statement already covers them; nothing is omitted.

### A1. Youth Player (6–17) — primary data subject

1. **Purpose** — To play football and accumulate a permanent, portable record of
   having done so.
2. **Goals** — Be seen and developed; keep their history when they change SSB;
   understand their own progress in age-appropriate terms.
3. **Pain Points** — History lost at every move; no record they can show; no
   visibility into what adults record about them.
4. **Needs** — A permanent Football ID; an age-appropriate view of their Journey;
   protection from exposure they did not choose.
5. **Responsibilities** — Attend and participate; from 13, acknowledge (not
   authorise) how their data is used.
6. **Permissions** — Read own profile, own Journey, own activity, own
   assessments (age-appropriate rendering). No write to assessments. No consent
   authority under 18.
7. **Owned Data** — The Journey. Ownership is constitutional and does not
   transfer to any Organization.
8. **Consumed Data** — Own record; schedules and results of teams they belong to.
9. **Produced Data** — Attendance and performance signals, produced *about* them
   by Coach and Match Official; self-produced content is out of scope.
10. **Relationships** — `belongs to` Organization (Membership) · `has` Guardian ·
    `trained by` Coach · `participates in` Match · `observed by` Scout (13+ only).
11. **Lifecycle** — `REGISTERED → VERIFIED → ACTIVE ⇄ TEMPORARILY_INACTIVE →
    INACTIVE → ARCHIVED` (PRG-MET-001). At 18 the Person transitions to A2 with
    the Journey unbroken.
12. **KPIs** — Contribution to VAP; JCS for their own Journey; number of distinct
    Organizations in their Journey (portability realised).
13. **Risks** — Over-exposure; identification via combined fields; pressure from
    adults to consent; record loss on transfer. Mitigations: minimisation,
    purpose-bound consent, immutable Journey.
14. **Privacy Classification** — **Child Sensitive** by default; identity fields
    Confidential; nothing Public, ever.
15. **Consent Requirements** — All processing requires a Guardian grant under a
    named purpose (`P1`–`P8`). Under 13: `P5` scouting and `P8` AI training are
    **prohibited**, not merely unconsented.
16. **Identity Requirements** — One Person, one opaque Football ID (ADR-0002
    rev. 2). Under 13 may have no independent login; access is through the
    Guardian.
17. **Verification Requirements** — Guardian verification at L2 is required
    before the Player counts as Verified.
18. **Future AI Interaction** — Age-appropriate development summaries only, and
    only where `P7` is granted; their data enters training sets only under `P8`,
    never under 13.

### A2. Amateur Player (18+)

Differs from A1 on exactly four fields: **6 Permissions** — holds their own
consent authority, may grant/revoke every purpose themselves; **14 Privacy** —
Confidential rather than Child Sensitive; **15 Consent** — self-granted, `P5`
and `P8` permitted; **17 Verification** — self-verified at L2. All other fields
inherit A1, including Journey ownership and portability. Consent authority
transfer at the 18th birthday is an event, not a re-registration.

### B1. Parent / B2. Legal Guardian

1. **Purpose** — Protect and enable their child's football participation.
2. **Goals** — Know exactly who holds what data about their child; consent
   selectively; move SSB without losing history.
3. **Pain Points** — Today: zero visibility, zero portability, consent is a
   signature on a paper form nobody keeps.
4. **Needs** — Per-purpose consent controls, an access log, export, and one
   account covering all their children.
5. **Responsibilities** — Grant/revoke consent honestly; keep verification
   current; act in the child's interest. Where Guardian and child interest
   conflict, S0 applies and the platform sides with the child.
6. **Permissions** — Full read of their child's record; grant/revoke `P1`–`P8`;
   request export and erasure; read the access log; approve Membership and
   transfer. **No** write to Coach assessments — they may annotate/dispute, not
   overwrite (assessment integrity).
7. **Owned Data** — Their own identity data and the consent grants they issue.
   They are **Data Steward** for the child's data, not Owner.
8. **Consumed Data** — Child's Journey, attendance, assessments, schedules,
   access log.
9. **Produced Data** — Consent grants and revocations; verification evidence;
   guardianship relationship.
10. **Relationships** — `owns consent for` Player (1..n — multi-child is the
    default case) · `contracts with` Organization · `communicates with` Coach.
11. **Lifecycle** — `INVITED → REGISTERED → VERIFIED (L1/L2/L3) → ACTIVE →
    DORMANT → REVOKED_AUTHORITY (child turns 18, or legal change)`.
12. **KPIs** — Guardian verified rate; consent grant/revocation rates; access
    request fulfilment within SLA (100%, guardrail).
13. **Risks** — Coerced consent; contested guardianship; a non-guardian claiming
    authority. Mitigations: L2 evidence, dual-record disputes escalated to
    Compliance, never auto-resolved in the adult's favour.
14. **Privacy Classification** — Guardian Only for the child view; Confidential
    for their own identity.
15. **Consent Requirements** — They *are* the consent authority; their own
    processing basis is contract/legitimate interest, minimal.
16. **Identity Requirements** — One Person; Guardian is a role, commonly held
    alongside Coach or Referee.
17. **Verification Requirements** — L2 minimum to hold authority; L3 for
    high-risk purposes per CONSENT-001.
18. **Future AI Interaction** — AI Parent Assistant explaining the child's
    development and consent posture in plain language; never a recommendation to
    grant a purpose.

### C1. SSB · C2. Club · C3. Academy (Organizational Actor)

1. **Purpose** — Train young players and operate teams.
2. **Goals** — Less administration; verified rosters; credibility that attracts
   families; eligibility that holds up at competition.
3. **Pain Points** — Paper registration, duplicated entry, no way to prove
   development quality.
4. **Needs** — Roster management, attendance, session records, eligibility
   checks, competition entry.
5. **Responsibilities** — Accurate activity records; safeguarding; honouring
   transfers without obstruction; never conditioning participation on excess
   consent.
6. **Permissions** — Read member Players' membership-scoped data while
   Membership is active; write attendance, sessions, team assignment; **never**
   delete or edit a Journey; **never** block a transfer.
7. **Owned Data** — Organization profile, teams, sessions, its own operational
   records.
8. **Consumed Data** — Member Player identity minimum, membership status,
   attendance, eligibility state.
9. **Produced Data** — Membership, attendance, sessions, assessments (via Coach),
   competition entries.
10. **Relationships** — `holds membership of` Player · `employs` Coach ·
    `governed by` Association · `enters` Competition.
11. **Lifecycle** — `APPLIED → VERIFIED → ACTIVE → SUSPENDED → INACTIVE →
    ARCHIVED`. Suspension freezes writes; it never deletes member Journeys.
12. **KPIs** — Verified members; VAP within the organization; JCS of its members;
    transfer-out obstruction incidents (target zero).
13. **Risks** — Data hoarding attempts; retention pressure on families;
    misreporting activity to inflate metrics. Mitigations: portability by
    construction, ActivityPolicy anti-gaming, independent-administration test.
14. **Privacy Classification** — Organization profile Internal/Public-lite;
    member data Restricted, membership-scoped.
15. **Consent Requirements** — Operates under `P1`–`P3`; may request `P4` media;
    may never require `P5`–`P8` as a condition of membership.
16. **Identity Requirements** — Organization identity separate from the Persons
    who administer it; actions attributed to the acting Person.
17. **Verification Requirements** — Association or platform verification before
    it may hold Memberships.
18. **Future AI Interaction** — Operational assistance (scheduling, attendance
    anomalies); no AI ranking of children for retention purposes.

### C4. Organization Admin (Human Actor)

Acts for C1–C3. Permissions are the organization's permissions, exercised by a
named Person and logged as such. Lifecycle `INVITED → ACTIVE → REVOKED`, revoked
immediately on leaving the organization. Highest-risk insider role in group C;
all member-data reads are access-logged.

### D1–D4. Coach (Head, Assistant, Goalkeeper, Fitness)

1. **Purpose** — Develop players.
2. **Goals** — A real record instead of a notebook; see progress over time; prove
   their own coaching impact.
3. **Pain Points** — Attendance on paper, assessments in memory, nothing carries
   over when a player joins from elsewhere.
4. **Needs** — Attendance capture, session planning, structured assessment, an
   age-appropriate view of prior history where consented.
5. **Responsibilities** — Accurate, fair, non-derogatory records; safeguarding;
   attesting activity truthfully (attestation is what makes VAP hard to game).
6. **Permissions** — Read/write attendance, sessions, assessments for
   **assigned** teams only. Read prior Journey only where `P3` is granted.
   Never edit another Coach's assessment; corrections are additive.
7. **Owned Data** — Own professional profile, licences, session plans.
8. **Consumed Data** — Assigned Players' identity minimum, attendance history,
   prior assessments (consented).
9. **Produced Data** — Attendance, sessions, assessments, development notes —
   the primary raw material of the Journey.
10. **Relationships** — `trains` Player · `employed by` Organization ·
    `assigned to` Team · often also `is` Parent (multi-role, one account).
11. **Lifecycle** — `REGISTERED → VERIFIED → LICENSED → ASSIGNED → ACTIVE →
    UNASSIGNED → INACTIVE`. Access is bound to ASSIGNED, not to LICENSED.
12. **KPIs** — Attendance completeness; assessment coverage; contribution to JCS;
    proportion of their players reaching ACTIVE.
13. **Risks** — Insider misuse; derogatory or discriminatory notes; false
    attestation. Mitigations: assignment scoping, access log, immutable
    correction trail, dual-attestation for anomalous activity spikes.
14. **Privacy Classification** — Restricted; assessments about a minor are Child
    Sensitive.
15. **Consent Requirements** — Operates under `P2`/`P3`; media capture requires
    `P4`; nothing they record may be repurposed to `P5` without a separate grant.
16. **Identity Requirements** — One Person, multi-role capable; coaching licence
    is an attribute, not an identity.
17. **Verification Requirements** — L2 identity + safeguarding check before
    assignment to minors. Non-negotiable under S0.
18. **Future AI Interaction** — AI Coach Assistant for session suggestions and
    development summaries; AI must never generate an evaluative judgement about a
    child that is stored without human attestation.

### D5. Scout — most constrained consumer

1. **Purpose** — Identify talent for a receiving organization.
2. **Goals** — Find players; verify what they are told about a player.
3. **Pain Points** — Word of mouth; unverifiable claims.
4. **Needs** — Consented, verified development records for players aged 13+.
5. **Responsibilities** — Approach only through the Guardian; never contact a
   minor directly.
6. **Permissions** — Read a **`P5`-consented, age-13+** development subset only.
   **Structurally impossible**: any access to under-13 records, bulk export,
   contact details without a separate grant, or discovery browsing of
   unconsented players.
7. **Owned Data** — Own profile, own watchlists (their own data, not the
   player's).
8. **Consumed Data** — Consented development subset.
9. **Produced Data** — Interest records — visible to the Guardian by design.
10. **Relationships** — `observes` Player (13+, consented) · `represents`
    Organization.
11. **Lifecycle** — `APPLIED → VERIFIED → ACCREDITED → ACTIVE → SUSPENDED →
    REVOKED`. Accreditation is renewable and revocable on a single breach.
12. **KPIs** — Consented views; Guardian-reported complaint rate (target zero);
    revocation-triggering breaches (target zero).
13. **Risks** — The single highest child-protection risk in the ecosystem:
    grooming vector, data harvesting, circumvention via a friendly SSB.
    Mitigations: hard age gate, per-view consent check, full access log surfaced
    to the Guardian, no bulk endpoints, accreditation revocation.
14. **Privacy Classification** — Their access surface is Restricted and
    per-record; under-13 data is not classified for them at all — it is absent.
15. **Consent Requirements** — `P5` only, explicit opt-in, L2 guardian
    verification, never bundled, never a membership condition.
16. **Identity Requirements** — Verified real identity; anonymous scouting is not
    supported.
17. **Verification Requirements** — L3 plus organizational accreditation.
18. **Future AI Interaction** — **Prohibited** from AI-generated ranking or
    shortlisting of minors. AI may summarise a record the Scout is already
    entitled to read; it may not surface players to them.

### D6. Referee / D7. Match Official

Purpose: officiate fairly and produce a trustworthy match record. Permissions:
read the eligibility-minimum roster for assigned matches; write match events,
cards, and the match report. No access to development, assessment, or contact
data. Owned: own licence and assignment history. Produced: match events,
disciplinary records — high-integrity, append-only, correction by addendum only.
Lifecycle `REGISTERED → LICENSED → ASSIGNED → ACTIVE → INACTIVE`. Risks: bias,
retrospective alteration — mitigated by append-only records and commissioner
review. Privacy: Restricted, match-scoped; sees a minor's name and eligibility,
nothing more (minimisation in action). Consent: `P6` competition participation.
Verification: L2 + licence. AI: assistive report drafting only, never automated
disciplinary decisions.

### E1. Tournament Organizer / E2. League Organizer

Purpose: run competitions with verifiable eligibility. Permissions: read
eligibility results (a boolean plus reason code, **not** the underlying identity
documents); write fixtures, results, standings. Owned: competition structure,
fixtures, standings. Consumed: eligibility verdicts, verified rosters. Produced:
the competition record that gives activity its context — the main NDI input.
Relationships: `contains` Match · `entered by` Organization · `sanctioned by`
Association. Lifecycle `PLANNED → SANCTIONED → OPEN → RUNNING → COMPLETED →
ARCHIVED`. Risks: age fraud, over-collection of documents to prove age.
Mitigation: the platform returns verified verdicts so organizers never need to
hold birth certificates. Privacy: Restricted; standings are Public, rosters are
not. Consent: `P6`. Verification: association sanction. AI: scheduling
optimisation only.

### E3. Venue

Organizational actor with the smallest footprint: owns facility data, consumes
fixtures, produces availability. **No access to any player data.** Lifecycle
`REGISTERED → VERIFIED → ACTIVE → INACTIVE`. Privacy: Public/Internal only.
Consent: none required — it never touches personal data. Included in the map
precisely so that later designs do not quietly grant it roster access.

### E4. Match Commissioner

Purpose: assure competition integrity. Permissions: read match record, officials'
reports, and eligibility verdicts for assigned matches; write commissioner
reports and integrity flags. Cannot alter results — escalates to the Association.
Lifecycle `ACCREDITED → ASSIGNED → ACTIVE → INACTIVE`. Privacy: Restricted.
Consent: `P6`. Verification: L2 + association accreditation. Risks: authority
creep into player-development data — explicitly denied.

### F1–F4. Association (APSSI · Askab · Askot · Asprov)

1. **Purpose** — Govern organized football in a territory.
2. **Goals** — Sanction competitions; verify organizations; know real
   participation in their territory.
3. **Pain Points** — Paper entries; unverifiable eligibility; no reliable count.
4. **Needs** — Verified organization registry, eligibility assurance, aggregated
   participation.
5. **Responsibilities** — Sanction fairly; act on integrity escalations; protect
   the data they receive.
6. **Permissions** — Read organization registry and competition records in their
   territory; read **aggregated** participation; read child-level data **only**
   for a specific eligibility dispute they are adjudicating, time-boxed and
   logged. No bulk export of minors. No consent-granting power. **No authority to
   restore a revoked consent grant** (CONSENT-001).
7. **Owned Data** — Sanctions, territorial registry, disciplinary rulings.
8. **Consumed Data** — Aggregates; eligibility verdicts; dispute-scoped records.
9. **Produced Data** — Sanctions, accreditations, rulings.
10. **Relationships** — `governs` Organization · `sanctions` Competition ·
    `reports to` Federation.
11. **Lifecycle** — `RECOGNISED → INTEGRATED (API) → ACTIVE → DORMANT`.
12. **KPIs** — Sanctioned competitions; verified organizations; territory NDI;
    reconciliation variance against platform records.
13. **Risks** — Requesting bulk child data by administrative authority. Mitigation
    (S0): the endpoints return aggregates; an administrative request cannot
    manufacture a lawful basis.
14. **Privacy Classification** — Federation Only / Restricted aggregates.
15. **Consent Requirements** — `P6` covers competition participation; governance
    aggregates are k-anonymised, so no individual grant is required.
16. **Identity Requirements** — Organizational identity + named delegate Persons.
17. **Verification Requirements** — Formal recognition + API integration
    agreement.
18. **Future AI Interaction** — Aggregate analytics and planning; never
    individual-level AI inference about a child.

### G1. Federation (PSSI)

Same shape as F, one territory wider and one step further from the child:
**aggregate-only by default, nationally scoped**. Purpose: a trustworthy national
picture of youth participation for planning, funding, and pathway selection.
Permissions: national and provincial aggregates; the organization/competition
registry; child-level access only through a documented national-team selection
process with an explicit Guardian grant. Produced: national standards, pathway
criteria. Relationships: `governs` Association · `recognises` Competition.
Lifecycle `RECOGNISED → INTEGRATED → ACTIVE`. Risk: the assumption that national
authority implies data ownership — rejected under Principle 1 and S0.
Verification: highest, with a formal data-sharing agreement. Integration is by
**API contract, never database sharing** (PRG-VIS-001 §8).

### H1. Sponsor · H2. Equipment Partner · H3. Insurance · H4. Football Store

Grouped because their posture is identical and deliberately minimal.

- **Permissions** — Aggregated, k-anonymised ecosystem data only. **Zero**
  child-level records. No contact data. No profiling. No advertising purpose
  exists on the consent list and none may be added.
- **Owned/Produced** — Their own commercial entities, offers, and (for Insurance)
  policy records where a Guardian has separately contracted. Insurance is the one
  case that may touch identity fields — and only under an explicit, separate
  `P7`-class grant naming the insurer, initiated by the Guardian, never by the
  insurer.
- **Consumed** — Aggregate reach and participation figures; sponsored-competition
  results.
- **Relationships** — `sponsors` Competition/Organization · `supplies`
  Organization · `insures` Player (guardian-initiated) · `sells to` Guardian.
- **Lifecycle** — `PROSPECT → CONTRACTED → ACTIVE → EXPIRED`.
- **Risks** — The primary commercial-pressure vector on child data. Mitigation:
  no purpose exists that would permit it; a request for player lists is refused
  at the architecture level, not the sales level.
- **Privacy** — Public/Internal aggregates only.
- **AI** — No AI access to child data, ever, including for audience modelling.

### I1. Super Admin · I2. Customer Success · I3. Support · I4. Compliance · I5. Security

The platform is **Data Custodian**, never Data Owner. Baseline for all five:
default read of child data is **none**; elevated access is break-glass —
justified, time-boxed, access-logged, and surfaced in the Guardian access log.

| Role | Purpose | Distinctive permission | Distinctive risk |
| --- | --- | --- | --- |
| Super Admin | Keep the platform operable | Configuration, role grants, ActivityPolicy publication | Unbounded power — mitigated by dual control on policy changes and role grants |
| Customer Success | Onboard organizations | Organization-level operational data | Convenience creep into member data |
| Support | Resolve user issues | Break-glass, per-ticket, user-initiated where possible | Social engineering |
| Compliance | Consent, DSAR, retention | Consent and access-log administration; cannot restore a revoked grant | Conflict of interest if merged with Success |
| Security | Detect and respond | Security telemetry, not content | Over-collection under a security label |

Lifecycle for all: `ONBOARDED → ACTIVE → SUSPENDED → OFFBOARDED`, with access
revoked within one hour of offboarding. KPIs: break-glass count (trend to zero),
DSAR SLA (100%), unauthorised-disclosure incidents (zero — guardrail).
Verification: highest internal, background-checked for any role with break-glass.
AI: no platform role may use child data for model development outside `P8`.

---

## PART 5 — Relationship Model

```text
Guardian ──owns consent for──▶ Player ◀──holds membership of── Organization
    │                            │  ▲                                │
    │                            │  └──trains────── Coach ◀──employs─┘
    │                            │                                   │
    │                            ├──observed by (13+, P5)── Scout     │
    │                            │                                   │
    │                            └──participates in──▶ Match          │
    │                                                   ▲            │
    └──contracts with──────────────────────────────────┐│            │
                                     Referee ──officiates┘            │
                                     Commissioner ──assures──┘        │
                                                                      │
Competition ──contains──▶ Match      Competition ◀──enters────────────┘
    ▲                                     ▲
    └──sanctions── Association ──governs──┴──▶ Organization
                        ▲
                        └──governs── Federation

Venue ──hosts──▶ Match          Sponsor ──sponsors──▶ Competition | Organization
Platform ──custodian of──▶ all records (never owner)
```

Cardinalities and rules that later artefacts must honour:

| From | Relationship | To | Cardinality | Rule |
| --- | --- | --- | --- | --- |
| Guardian | owns consent for | Player | 1..n | Multi-child is the default (ratio 0.80) |
| Player | has | Guardian | 1..n | Two guardians may both hold authority; conflict escalates to Compliance |
| Organization | holds membership of | Player | 0..n | Membership, never ownership; historical memberships persist |
| Player | belongs to | Organization | 1 active Primary, 0..n active Secondary, 0..n historical | Typed Membership per ADR-0003: eligibility and Transfer follow Primary only; every Membership is recorded in the Journey |
| Coach | trains | Player | n..n | Only while assigned to a shared Team |
| Scout | observes | Player | n..n | Only where age ≥ 13 **and** `P5` active |
| Referee | officiates | Match | 1..n | Assignment-scoped |
| Competition | contains | Match | 1..n | |
| Association | governs | Organization | 1..n | Territorial |
| Federation | governs | Association | 1..n | National |
| Person | holds | Role | 1..n | One account, many roles (Principle 3) |

**Multi-role rule.** A Person who is a Parent, a Coach, and a Referee holds three
roles on one identity. Permissions are the *union* of role scopes, each evaluated
independently — being a Coach never grants access to their own child's record
outside their assigned team, and being a Parent never grants coach-level access.

---

## PART 6 — Value Exchange Matrix

| Stakeholder | Gives to the ecosystem | Receives | Net trade |
| --- | --- | --- | --- |
| Youth Player | Participation, activity signal | Permanent identity, portable Journey | Strongly positive — the reason the platform exists |
| Guardian | Verification, consent, accurate data | Visibility, control, portability, export | Positive — control replaces blind trust |
| SSB/Club/Academy | Activity records, verified rosters | Less admin, credibility, eligibility assurance | Positive on operations, **negative on control** — deliberate |
| Coach | Attendance, assessments, attestation | Structured tools, development history, proof of impact | Positive |
| Scout | Accreditation, accountability | Consented, verified 13+ records | Narrow but real |
| Referee/Official | Trustworthy match records | Assignments, clean process | Positive |
| Competition Organizer | Fixtures, results, structure | Verified eligibility without holding documents | Strongly positive |
| Venue | Availability | Utilisation | Neutral-positive |
| Association | Sanction, recognition, integration | Verified territorial participation data | Positive |
| Federation | Standards, recognition | Trustworthy national dataset | Strongly positive |
| Commercial | Funding, equipment, cover | Aggregate reach, sponsorship context | Bounded by design |
| Platform | Infrastructure, custody, protection | Sustainability | Custodial |

The asymmetry is intentional and is the product thesis: the SSB trades control
for usefulness. Any future feature that reverses this trade is out of scope.

---

## PART 7 — Data Ownership Matrix

Roles per ISO/IEC 38505 usage: **Subject** (whom it is about) · **Owner**
(accountable for it) · **Steward** (exercises rights on the Owner's behalf) ·
**Custodian** (operates the store) · **Consumer** (reads under a basis).

| Data class | Subject | Owner | Steward | Custodian | Primary Consumers |
| --- | --- | --- | --- | --- | --- |
| Football ID + identity core | Player | Player | Guardian (until 18) | Platform | Organization, Competition (minimum fields) |
| Journey (aggregate history) | Player | Player | Guardian | Platform | Coach (consented), Scout (13+, `P5`) |
| Consent grants | Player | Guardian (as authority) | — | Platform | Compliance |
| Membership | Player + Organization | Joint | Guardian approves | Platform | Association, Competition |
| Attendance & sessions | Player | Player (as Journey part) | Coach produces | Platform | Organization, Guardian |
| Assessments | Player | Player | Coach is author, not owner | Platform | Guardian, Coach, Scout (consented) |
| Match records | Match | Competition Organizer | Referee/Commissioner | Platform | Association, public standings |
| Organization profile | Organization | Organization | Org Admin | Platform | Association, public-lite |
| Professional licences | Coach/Referee | The professional | Association verifies | Platform | Organization |
| Competition structure | Competition | Organizer | — | Platform | All participants |
| Aggregates & KPIs | Population | Platform | — | Platform | Association, Federation, Commercial |
| Access logs | Player | Player | Guardian | Platform | Compliance |
| Media | Player | Player | Guardian (`P4`) | Platform | Organization |

Two invariants: **the Platform is Custodian of everything and Owner only of
derived aggregates**, and **no Organization appears as Owner of any
player-subject class** — the single most important line in this artefact.

---

## PART 8 — Permission Matrix

`R` read · `W` write · `—` none · `A` aggregate only · `C` consent-gated ·
`S` scope-gated (membership/assignment/territory) · `BG` break-glass, logged.

| Stakeholder | Own profile | Player identity | Journey | Attendance | Assessment | Match | Consent | Aggregates |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Youth Player | R | R (own) | R (own) | R | R (age-appropriate) | R | — | — |
| Amateur Player | RW | R (own) | R (own) | R | R | R | RW (own) | — |
| Guardian | RW | R (child) | R (child) | R | R + annotate | R | RW | — |
| Org Admin | RW | R (S) | R (S,C) | RW (S) | R (S) | R (S) | — | A (own org) |
| Coach | RW | R (S) | R (S,C) | RW (S) | RW (S, own) | R (S) | — | A (own teams) |
| Scout | RW | R (C, 13+) | R (C, 13+ subset) | — | R (C, 13+) | R | — | — |
| Referee / Official | RW | R (S, minimum) | — | — | — | RW (S) | — | — |
| Commissioner | RW | R (S, minimum) | — | — | — | R + W report | — | A |
| Competition Organizer | RW | R (eligibility verdict) | — | — | — | RW | — | A |
| Venue | RW | — | — | — | — | R (fixtures) | — | — |
| Association | RW | R (dispute-scoped, BG) | — | — | — | R (S) | — | A (territory) |
| Federation | RW | — (except selection, C) | — | — | — | R | — | A (national) |
| Commercial | RW | — | — | — | — | R (public) | — | A |
| Super Admin | RW | BG | BG | BG | BG | BG | R | A |
| Support | RW | BG | BG | BG | — | BG | R | — |
| Compliance | RW | BG | BG | — | — | — | RW (revoke/administer) | A |
| Security | RW | — | — | — | — | — | — | A |

**Evaluation order (Zero Trust).** Every request is evaluated as
`authenticated Person → active Role → in-scope relationship → valid consent
purpose → age gate → policy decision → access log`. Failure at any step denies;
there is no role that short-circuits the chain. Deny is the default.

Access model composition:

- **RBAC** — coarse capability by role (Coach may write attendance).
- **ABAC** — the decisive layer: subject age, consent purpose state, membership
  status, assignment, territory, competition, verification level.
- **Delegated Access** — Guardian → Player; Organization → Org Admin; Association
  → delegate.
- **Guardian Authority** — grant/revoke consent, approve membership and transfer,
  request export/erasure. Bounded by S0: it cannot be used against the child.
- **Organization Authority** — membership-scoped operations only; expires with
  the Membership; never extends to the Journey.
- **Federation Authority** — governance and aggregates; explicitly *not* a data
  ownership right.

---

## PART 9 — Privacy Matrix

Classes: Public · Internal · Restricted · Confidential · Child Sensitive ·
Guardian Only · Federation Only.

| Data / view | Class | Notes |
| --- | --- | --- |
| Competition standings, fixtures | Public | No minor identity beyond first name + team where the Guardian permits |
| Organization profile, venue | Public / Internal | No child data |
| Minor identity core | Child Sensitive | `anon` access is zero, permanently |
| Minor assessment, development notes | Child Sensitive | Consent-gated even internally |
| Minor media | Child Sensitive | `P4`, revocable, take-down on revocation |
| Guardian contact details | Confidential | Never exposed to Scout or Commercial |
| Consent grants, access log | Guardian Only | Compliance may read for administration |
| Adult professional profile | Internal / Restricted | Licence status may be Internal |
| Match record | Restricted | Public derivative is results only |
| Eligibility verdict | Restricted | Boolean + reason code; never the documents |
| Territorial / national aggregates | Federation Only | k-anonymised, suppression below threshold |
| Security telemetry | Confidential | No content |

Rules: minor data is **Child Sensitive until proven otherwise**; no aggregate may
be published where a cell would permit re-identification; classification is
attached to the data class, so a change of consumer never downgrades it.

---

## PART 10 — Consent Matrix

Purposes are defined in CONSENT-001 (`P1`–`P8`) and are not redefined here.
Required = the stakeholder cannot operate without it; Optional = capability is
degraded without it; Prohibited = may not be granted for this subject.

| Stakeholder | P1 core identity | P2 membership ops | P3 development | P4 media | P5 scouting | P6 competition | P7 AI assist | P8 AI training |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Player (subject) | Required | Required | Optional | Optional | Optional 13+ / **Prohibited <13** | Required to compete | Optional | Optional 13+ / **Prohibited <13** |
| Guardian | Grants all | Grants | Grants | Grants | Grants (13+ only) | Grants | Grants | Grants (13+, L2) |
| Organization | Required | Required | Optional | Optional | — | Required | — | — |
| Coach | Required | Required | Required | Optional | — | Optional | Optional | — |
| Scout | — | — | — | — | **Required, 13+, L2** | — | — | — |
| Referee / Official | Minimum only | — | — | — | — | Required | — | — |
| Competition Organizer | Verdict only | — | — | — | — | Required | — | — |
| Association / Federation | Aggregate | — | — | — | — | Required | — | — |
| Commercial | — | — | — | — | — | — | — | — |
| Platform | Lawful basis: custody | — | — | — | — | — | — | Only under `P8` |

Non-negotiables: consent is **per purpose, never bundled**; membership may never
be conditioned on `P4`–`P8`; revocation takes effect immediately, and for
high-risk purposes triggers the CONSENT-001 notification/audit flow; **no
stakeholder, including Association and Federation, may restore a revoked grant**.

---

## PART 11 — Identity Matrix

| Stakeholder | Identity type | Identifier | Auth | Min verification | Multi-role |
| --- | --- | --- | --- | --- | --- |
| Youth Player <13 | Person | Football ID (opaque) | None — guardian-mediated | Guardian L2 | Yes, later |
| Youth Player 13–17 | Person | Football ID | Own login, guardian-approved | Guardian L2 | Yes |
| Amateur Player 18+ | Person | Football ID | Own login | Self L2 | Yes |
| Guardian | Person | Person ID | Own login | L2 (L3 high-risk) | Yes |
| Org Admin / Coach / Referee / Commissioner / Scout | Person | Person ID | Own login | L2 + safeguarding (Scout: L3 + accreditation) | Yes |
| Organization / Competition / Venue | Organizational | Org ID | Acts via Person | Association or platform verification | n/a |
| Association / Federation | Organizational | Org ID + delegates | API + delegate login | Formal recognition + agreement | n/a |
| Commercial | Organizational | Org ID | Portal login | Contract | n/a |
| Platform staff | Person | Staff ID | SSO + MFA | Internal highest | n/a |

Invariants: identifiers are **opaque and meaning-free** (ADR-0002 rev. 2) — no
region, year, organization, or age is encoded, and identifiers are never
sequential. **One Person = one account**; a second role never creates a second
account. Football ID is issued once and is never revoked, re-issued, or
transferred to another Person.

---

## PART 12 — Lifecycle Matrix

| Stakeholder | States | Terminal | Access-revocation trigger |
| --- | --- | --- | --- |
| Player | REGISTERED → VERIFIED → ACTIVE ⇄ TEMPORARILY_INACTIVE → INACTIVE → ARCHIVED | ARCHIVED (record retained, access closed) | n/a — subject |
| Guardian | INVITED → REGISTERED → VERIFIED → ACTIVE → DORMANT → AUTHORITY_ENDED | AUTHORITY_ENDED at child's 18th | Child turns 18; legal change |
| Organization | APPLIED → VERIFIED → ACTIVE → SUSPENDED → INACTIVE → ARCHIVED | ARCHIVED | Suspension freezes writes immediately |
| Org Admin | INVITED → ACTIVE → REVOKED | REVOKED | Leaves organization — same day |
| Coach | REGISTERED → VERIFIED → LICENSED → ASSIGNED → ACTIVE → UNASSIGNED → INACTIVE | INACTIVE | Unassignment removes player access immediately |
| Scout | APPLIED → VERIFIED → ACCREDITED → ACTIVE → SUSPENDED → REVOKED | REVOKED | Any breach; single-strike |
| Referee / Official | REGISTERED → LICENSED → ASSIGNED → ACTIVE → INACTIVE | INACTIVE | Match completion + report window |
| Competition | PLANNED → SANCTIONED → OPEN → RUNNING → COMPLETED → ARCHIVED | ARCHIVED | Completion closes write access |
| Venue | REGISTERED → VERIFIED → ACTIVE → INACTIVE | INACTIVE | — |
| Association / Federation | RECOGNISED → INTEGRATED → ACTIVE → DORMANT | DORMANT | Agreement lapse |
| Commercial | PROSPECT → CONTRACTED → ACTIVE → EXPIRED | EXPIRED | Contract end |
| Platform staff | ONBOARDED → ACTIVE → SUSPENDED → OFFBOARDED | OFFBOARDED | Within one hour of offboarding |

Cross-cutting rule: **ending a relationship ends access, never the record.** No
lifecycle transition of any non-subject stakeholder may delete, truncate, or
detach a Player's Journey.

---

## PART 13 — Stakeholder Journey

**Guardian → first Verified Active Player (the founding loop).**

```text
1 Invited by SSB          2 Registers Person       3 Verifies to L2
        │                        │                        │
        ▼                        ▼                        ▼
4 Registers child ──▶ 5 Football ID issued (opaque) ──▶ 6 Grants P1,P2,P6
        │                                                 │
        ▼                                                 ▼
7 Membership approved ──▶ 8 Coach records attendance ──▶ 9 ActivityPolicy
        │                        (2 events / 2 dates)      evaluates
        ▼                                                 ▼
10 Player becomes ACTIVE ──▶ 11 Counted as VAP ──▶ 12 Guardian sees access log
```

**Coach:** verified and safeguarding-checked → licensed → assigned to a team →
records attendance and sessions → writes assessments → team ends → unassigned and
access closes, with authored records remaining attributed and immutable.

**Transfer (the promise under test):** Guardian initiates → outgoing Membership
closes → Player enters `TEMPORARILY_INACTIVE`, not lost → incoming Membership
opens → new Coach sees prior Journey only where `P3` is active → first activity
returns the Player to `ACTIVE`. The outgoing SSB has no approval right and no
ability to obstruct. This journey is the concrete test of Principle 1.

**Scout:** accredited → Guardian grants `P5` for a 13+ player → views the
consented subset → the view appears in the Guardian's access log → Guardian
revokes → access ends immediately.

**Association:** recognised → API integration → sanctions a competition →
receives verified eligibility verdicts and territorial aggregates — and at no
point receives a list of children.

---

## PART 14 — Risk Assessment

| # | Risk | Stakeholder | Likelihood | Impact | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | Under-13 scouting exposure | Scout | Low | Catastrophic | Structural age gate; capability absent, not merely denied | Child Protection Officer |
| R2 | SSB obstructs transfer to retain a player | Organization | High | High | No approval right in the model; Guardian-initiated transfer | Domain Architect |
| R3 | Coerced or bundled consent | Organization, Guardian | Medium | High | Per-purpose grants; membership may not require `P4`–`P8` | Privacy Officer |
| R4 | Insider misuse by Coach or Org Admin | D, C4 | Medium | High | Assignment scoping, access log surfaced to Guardian, same-day revocation | Security Architect |
| R5 | Association/Federation bulk-data request by authority | F, G | Medium | High | Aggregate-only endpoints; authority ≠ lawful basis | Chief Enterprise Architect |
| R6 | Commercial pressure for child-level data | H | Medium | Catastrophic | No permitting purpose exists and none may be added | Chief Product Officer |
| R7 | Activity inflation to hit VAP targets | Organization, Coach | Medium | Medium | ActivityPolicy anti-gaming; independent-administration test | Data Architect |
| R8 | Contested guardianship | B | Low | High | Dual-record dispute → Compliance; never auto-resolved for the adult | Compliance |
| R9 | Platform break-glass creep | I | Medium | High | Justification, time-box, dual control, Guardian-visible log | Security Architect |
| R10 | Re-identification via aggregates | F, G, H | Low | High | k-anonymity with suppression below threshold | Data Architect |
| R11 | AI inference about a child without a basis | AI actors | Medium | High | `P7`/`P8` separation; no AI-generated stored judgement without human attestation | AI Governance Architect |
| R12 | Role explosion / duplicate accounts | All human | Medium | Medium | One Person, many roles; identity resolution at registration | Domain Architect |

R1, R6, and R10 map directly to the PRG-VIS-001 §10.4 guardrails: breach halts
the roadmap regardless of KPI performance.

---

## PART 15 — Future AI Interaction

| Stakeholder | Permitted AI interaction | Prohibited |
| --- | --- | --- |
| Youth Player | Age-appropriate summary of own progress (`P7`) | Any ranking, comparison to peers, or predictive labelling |
| Guardian | Plain-language explanation of the child's record and consent posture (`P7`) | Nudging toward granting a purpose |
| Coach | Session suggestions, attendance anomaly detection, draft development summaries (`P7`) | Storing an AI-generated evaluative judgement about a child without human attestation |
| Organization | Operational optimisation | AI ranking of children for retention or fee-setting |
| Scout | Summarising a record they already lawfully see | Surfacing, ranking, or shortlisting players — absolutely |
| Referee / Commissioner | Report drafting assistance | Automated disciplinary decisions |
| Association / Federation | Aggregate planning analytics | Individual-level inference about a minor |
| Commercial | None involving player data | All |
| Platform | Abuse and anomaly detection on telemetry | Training on child data outside `P8` |

Governing rules: AI is **assistive, never decisional**, for anything affecting a
child; every AI-touched record carries provenance; `P8` is required for training
and is prohibited under 13; and `P7` never implies `P8`.

---

## PART 16 — Governance Alignment

| Framework / rule | How this artefact satisfies it |
| --- | --- |
| TOGAF (Business Architecture) | Stakeholder catalogue, value exchange, and relationship model precede application and data architecture |
| ISO/IEC/IEEE 42010 | Each stakeholder is an architectural concern holder; PARTS 4–12 are the concern-to-viewpoint mapping |
| DDD | PART 5 relationships and PART 12 lifecycles are the input to PRG-CTX-001 bounded contexts; no ubiquitous-language term is invented here that contradicts the glossary |
| Privacy by Design | Default-deny permissions, minimisation per consumer, Child Sensitive default |
| Consent by Default | PART 10; no processing without a named purpose |
| Zero Trust | PART 8 evaluation order; no role short-circuits the chain |
| Constitution — Player Owns The Journey | PART 7: no Organization is Owner of any player-subject class |
| Constitution — Identity is Opaque | PART 11 invariants |
| Constitution — Child's Interest Prevails | S0, PART 14, and every Prohibited cell |
| Constitution — No Implementation Before Approval | This artefact contains no schema, API, migration, or UI |
| UU 27/2022 (PDP) | Data subject, controller-equivalent (Owner/Steward), and processor (Custodian) roles named per class |

Council decision rights: Chief Product Officer and Chief Enterprise Architect
co-own; Principal Security Architect and Child Protection Officer hold veto on
PARTS 8–10 and 14.

---

## PART 17 — Success Metrics

The artefact is successful if the stakeholder model measurably serves the North
Star and its qualifiers:

| Metric | Definition | Target |
| --- | --- | --- |
| Actor coverage | Share of production authorization decisions resolvable from this catalogue without a new stakeholder type | ≥ 95% at Phase 0 exit |
| Unmodelled-actor incidents | New stakeholder types discovered during Identity implementation | ≤ 2 |
| Permission drift | Implemented permissions differing from PART 8 without an ADR | 0 |
| Transfer obstruction | Transfers blocked or delayed by an outgoing Organization | 0 |
| Under-13 scouting exposure | Any | 0 (guardrail) |
| Break-glass frequency | Platform elevated accesses per month | Declining trend |
| Guardian access-log usage | Share of verified Guardians who view their log at least once per quarter | ≥ 30% at Phase 1 |
| Multi-role accounts | Persons holding ≥ 2 roles on one identity vs duplicate registrations | Duplicates < 2% |

NDI depends on the Organization–Player–Coach–Competition relationships defined in
PART 5; JCS depends on the data classes in PART 7; CTI depends on PART 10 — this
artefact is where those three KPIs become computable.

---

## PART 18 — Acceptance Criteria

G1 acceptance for PRG-STK-001 requires all of:

1. Every stakeholder group A–I is catalogued with all 18 fields addressed.
2. Every stakeholder has an explicit permission row (PART 8) and privacy
   classification (PART 9) — no stakeholder is left undefined by omission.
3. No stakeholder holds absolute rights over player data; no Organization appears
   as Owner of a player-subject data class.
4. No stakeholder can read child data without a named consent purpose or a
   logged, time-boxed break-glass justification.
5. Under-13 scouting access is structurally absent, not policy-denied
   (STK-INV-004 Structural Prohibition).
6. Consent authority is held only by Guardian (<18) and Player (18+), and
   transfers as an event.
7. Every relationship in PART 5 has a stated cardinality and rule.
8. Each of Data Owner, Steward, Custodian, Consumer, and Subject is assigned for
   every data class.
9. RBAC, ABAC, delegated, guardian, organization, and federation authority are
   each defined with an evaluation order.
10. Lifecycle states exist for every stakeholder, each with an access-revocation
    trigger.
11. Every AI interaction is classified permitted or prohibited.
12. The document contains no code, ERD, API, schema, migration, or UI.
13. Every part traces to the Constitution, PRG-VIS-001, or CONSENT-001 (PART 19).
14. STK-INV-001 to STK-INV-004 are stated as named, citable invariants (PART 2.1).

**Closed item.** The Council resolved the concurrent-Membership question on
6 August 2026: Primary (exactly one active) + Secondary (`0..N`), eligibility and
Transfer on Primary only, all Memberships recorded in the Journey. Binding as
[ADR-0003](../adr/ADR-0003-organization-membership-model.md). PART 5 is updated
accordingly; no open items remain.


---

## PART 19 — Traceability

| Element | Traces up to | Traces down to |
| --- | --- | --- |
| S0 Child's Interest Prevails | Constitution #6; decision-rules Rule 0 | PARTS 8, 9, 10, 14, 15 |
| Player Owns The Journey | Constitution #1; PRG-VIS-001 §4 | PART 7 ownership matrix; PART 13 transfer journey |
| Identity is Opaque | ADR-0002 rev. 2 | PART 11 |
| One Person → Multiple Roles | PRG-VIS-001 §4 Principle 3 | PART 11; PART 5 multi-role rule |
| Consent purposes `P1`–`P8` | CONSENT-001 | PART 10 |
| Verification levels L0–L3 | CONSENT-001 | PART 11, PART 12 |
| Lifecycle 6 states | PRG-MET-001 | PART 12 |
| ActivityPolicy | PRG-MET-001 | PART 14 R7; PART 17 |
| VAP / NDI / JCS / CTI | PRG-VIS-001 §3, §9 | PART 17 |
| Phase 0 volumes | PRG-VIS-001 §10.1 | Catalogue sizing; guardian multi-child default |
| Stack boundary | ADR-0001 | No implementation content in this artefact |

**Downstream consumers:** `IDN-PRD-001` (actors and permissions), `PRG-CTX-001`
(bounded contexts from PART 5), `PRG-CDM-001` (canonical model from PART 7),
authorization model (PART 8), consent model extension (PART 10), identity model
(PART 11), AI interaction model (PART 15).

**Status:** IN_REVIEW — submitted for Council approval at G1.
