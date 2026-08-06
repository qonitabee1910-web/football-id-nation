# Ubiquitous Language

Authoritative vocabulary. Code, contracts, and UI copy must use these terms.

| Term | Definition |
| --- | --- |
| **Person** | A single human being in the ecosystem. Exactly one Person record per human, regardless of roles held. |
| **Football ID** | The permanent digital identity of a Person within football. Single source of truth. Never re-issued, never owned by an organization. |
| **Football Passport** | The rendered, shareable view of a Football ID: identity, verified status, journey summary. |
| **Journey** | The append-only chronological record of a Person's football activity across all organizations. Survives every transfer. |
| **Role** | A capability a Person holds (Player, Parent/Guardian, Coach, Referee, Scout, Organization Admin). A Person may hold many, concurrently. |
| **Guardian** | A Person legally responsible for a minor Player. Source of consent. |
| **Consent** | An explicit, timestamped, revocable grant by a Guardian (or adult Person) permitting a defined data use. |
| **Organization** | SSB, Club, Academy, Association, or Federation body. |
| **Membership** | A time-bounded, typed relationship between a Person and an Organization. Confers access, never ownership. Type is `PRIMARY` or `SECONDARY` (ADR-0003). |
| **Primary Membership** | The one `ACTIVE` Membership that constitutes a Player's official affiliation. Exactly one per Player at a time. Sole basis of roster, competition eligibility, and Transfer. |
| **Secondary Membership** | A concurrent, non-exclusive Membership (`0..N`): holiday camp, regional training centre, talent program, national camp, academy trial. Recorded in the Journey; confers no competition eligibility and is never a Transfer. |
| **SSB** | Sekolah Sepak Bola — grassroots football school. |
| **Team** | A squad fielded by an Organization for training or competition. |
| **Competition** | Tournament or League run by an Organization or Association. |
| **Match** | A single fixture within a Competition. |
| **Assessment** | A recorded evaluation of a Player's development attributes. |
| **Verified Active Player** | Football ID + Guardian Verified + Active Football Activity. The North Star unit. |
| **Guardian Verified** | Guardian identity confirmed at level L1 or above with `P1` and `P2` consent active for the minor's Football ID. |
| **Active Football Activity** | Qualifying, organization-recorded, adult-attested activity meeting the thresholds of the applicable ActivityPolicy (default: ≥2 events on ≥2 distinct dates in 90 days). |
| **ActivityPolicy** | The named, versioned configuration object holding the activity window, thresholds, and lifecycle timings. Exactly one GLOBAL policy is active at a time; every published metric carries its `policy_id@version`. |
| **REGISTERED** | Lifecycle state: Football ID issued, guardian verification incomplete. |
| **VERIFIED** | Lifecycle state: Guardian Verified, activity threshold not yet met. |
| **ACTIVE** | Lifecycle state: meets the ActivityPolicy threshold. The only state counted in VAP. |
| **TEMPORARILY_INACTIVE** | Lifecycle state: recently active but currently below threshold, or transfer in progress. Recoverable without re-verification. |
| **INACTIVE** | Lifecycle state: no qualifying activity beyond `inactive_after_days`. |
| **ARCHIVED** | Lifecycle state: long-dormant or guardian-archived. Journey is retained; archival is never erasure. |
| **NEVER_ACTIVE** | Derived flag (not a state) on a Person who has never recorded a qualifying activity. The registration-inflation guard. |
| **Consent Purpose** | One of the eight closed-list reasons for processing (`P1_IDENTITY` … `P8_AI_MODEL_IMPROVEMENT`). Consent is always per purpose, never generic. |
| **P8_AI_MODEL_IMPROVEMENT** | Consent purpose permitting row-level data as platform AI training input. Opt-in, L2 required, prohibited under 13, 90-day removal SLA on revocation. |
| **High-Risk Revocation** | A revocation affecting an active squad, scouting exposure, federation submission, or training set. Takes effect immediately; triggers notification, audit, and a review queue that can never reverse it. |
| **The Child's Interest Prevails** | Overriding constitutional principle: in any conflict between Organization, Coach, Guardian, Sponsor, or Association, the outcome best protecting the child Player wins. |
| **STK-INV-001 (Data Minimisation by Capability)** | No stakeholder may consume player-level data unless player data is essential to fulfil its primary business capability. Venue sees booking/field/schedule/capacity; Commercial Partner sees aggregate and anonymised metrics only. Privacy by Architecture, not by policy. |
| **Record Authority Principle (STK-INV-002)** | Consent Authority ≠ Evidence Authority. A Guardian owns consent, not truth: they may grant, revoke, and object, never alter assessments, match history, referee reports, or statistics. |
| **Guardian Annotation (STK-INV-003)** | A first-class object attached to an immutable record, with its own lifecycle: Guardian Comment → Coach Response → Resolved or Open. The annotated record is never modified. |
| **Structural Prohibition (STK-INV-004)** | A capability that is not implemented rather than permission-denied. Under-13 scouting is the canonical case: there is no code path to misconfigure. |
| **Phase 0–4** | The five programme phases: 0 Founding Network, 1 Sulsel Pilot, 2 Regional Scale, 3 Provincial Coverage, 4 National Expansion. Each has a scope, entry condition, and exit condition; the exit condition of one is the entry condition of the next. A phase is never complete on elapsed time alone. |
| **Network Density Index (NDI)** | Connectedness of the football network in a scope — players, Organizations, coaches, competitions, and activities as one graph. Headline sub-index: share of `ACTIVE` players with verified activity from two or more independently administered Organizations, proving portability in production. |
| **Journey Completeness Score (JCS)** | Percentage of players holding a complete journey across identity, organization, activity, and development. Underlying per-player weighted score uses the versioned `JourneyCompletenessPolicy`; fields not justified by an active consent purpose carry zero weight. |
| **JourneyCompletenessPolicy** | The named, versioned configuration object holding JCS component weights. Configurable, never hard-coded; every JCS figure carries its `policy_id@version`. |
| **Consent Trust Index (CTI)** | Percentage of player data usable for its intended purpose because an active, valid consent covers it, measured per purpose and in aggregate. Diagnostics: guardian verification, voluntary opt-in, revocation rates, DSAR fulfilment. Below its floor it blocks phase exit regardless of VAP. |
| **Bounded Context** | A DDD boundary owning its model and language. |
| **Aggregate** | A consistency boundary with a single root entity. |
| **Domain Event** | A past-tense fact published by an aggregate, e.g. `FootballIdIssued`. |
| **ADR** | Architecture Decision Record. |
| **Quality Gate** | Stage-exit checklist that must pass before the next stage. |

## Forbidden terms

- "player account" — a Player is a Role on a Person, not an account.
- "SSB's player" / "owns player" — violates Player Owns The Journey; say "member".
- "coach login" / "referee login" — one login per Person; roles are not logins.
