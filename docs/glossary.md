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
| **Membership** | A time-bounded relationship between a Person and an Organization. Confers access, never ownership. |
| **SSB** | Sekolah Sepak Bola — grassroots football school. |
| **Team** | A squad fielded by an Organization for training or competition. |
| **Competition** | Tournament or League run by an Organization or Association. |
| **Match** | A single fixture within a Competition. |
| **Assessment** | A recorded evaluation of a Player's development attributes. |
| **Verified Active Player** | Football ID + Guardian Verified + Active Football Activity. The North Star unit. |
| **Guardian Verified** | Guardian identity confirmed and consent recorded for the minor's Football ID. |
| **Active Football Activity** | At least one recorded training, match, or assessment within the trailing activity window (window defined at G0). |
| **Bounded Context** | A DDD boundary owning its model and language. |
| **Aggregate** | A consistency boundary with a single root entity. |
| **Domain Event** | A past-tense fact published by an aggregate, e.g. `FootballIdIssued`. |
| **ADR** | Architecture Decision Record. |
| **Quality Gate** | Stage-exit checklist that must pass before the next stage. |

## Forbidden terms

- "player account" — a Player is a Role on a Person, not an account.
- "SSB's player" / "owns player" — violates Player Owns The Journey; say "member".
- "coach login" / "referee login" — one login per Person; roles are not logins.
