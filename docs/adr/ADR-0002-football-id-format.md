---
id: ADR-0002
title: Football ID format — opaque UUID identifier with human-readable display code
status: PROPOSED
date: 2026-08-06
deciders: [Chief Enterprise Architect, Principal Domain Architect, Principal Data Architect, Principal Security Architect, Principal Football Operations Expert]
context_scope: [identity]
stage: 2
supersedes: []
---

# ADR-0002 — Football ID format: opaque UUID + human-readable display code

## Context

Football ID is the single source of truth for a Person's football identity and
must last a lifetime, across SSB, club, academy, association, and federation.
Two conflicting needs:

- **Machine identity** must be non-guessable, non-enumerable, and meaning-free —
  most of the subjects are minors, and an enumerable ID exposes the whole
  population to scraping.
- **Human identity** must be readable aloud at a registration desk, printed on a
  match sheet, and typed by a referee on a pitch with poor connectivity.

Any identifier carrying region or birth year embeds mutable facts: players move
provinces, and a Football ID must never be re-issued when they do.

## Decision

Two attributes, one identity:

1. **`football_id`** — an opaque, immutable, database-generated `uuid` (v4).
   The only value used in foreign keys, API paths, tokens, and events. Never
   parsed, never carries meaning, never changes.
2. **`display_code`** — an immutable, human-readable code derived at issuance:
   `FID-<YY><issuance-region><checksum-suffix>`, e.g. `FID-26SS-7K3M-92`.
   - `<YY>` — year of issuance (a historical fact, never updated).
   - `<issuance-region>` — 2-letter code of the **issuing** association at
     first registration (a historical fact, never updated on transfer).
   - random Crockford Base32 block (no `I`, `L`, `O`, `U`) — non-sequential, so
     the population size and registration order are not disclosed.
   - 2-character check suffix (ISO 7064 mod 97-10) to catch transcription errors
     at pitch-side data entry.

`display_code` is a lookup and verification aid only. It is **never** a foreign
key and **never** an authorization subject. Both values are unique and immutable
for the lifetime of the Person.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| A. Opaque UUID only | Maximum safety, zero semantics | Unusable verbally/on paper; SSB staff will invent their own codes — a shadow identity system |
| B. Sequential human code (`FID-SS-2026-000123`) | Very readable | Enumerable — reveals total registrations and enables scraping of minors; region becomes stale on transfer |
| C. UUID + non-sequential checksummed display code | Safe machine identity, usable human identity, transcription-error resistant | Two columns, two uniqueness constraints, slightly more issuance logic |

## Decision-rule evaluation

| Rule | A | B | C | Winner |
| --- | --- | --- | --- | --- |
| 1. Nationally scalable | yes | collides across provinces at scale | yes, no central sequence needed | **C** |
| 2. Federation-integrable | poor (unspeakable) | good | good (printable on federation documents) | **C** |
| 3. Safe for child data | best | worst (enumerable) | strong (non-sequential, meaning-light) | A / **C** |
| 4. Auditable | good | good | best (checksum catches bad data entry) | **C** |
| 5. SSOT | yes | risks parsing semantics out of the code | yes (code is non-authoritative) | **C** |

## Consequences

- Schema: `football_id uuid primary key default gen_random_uuid()` and
  `display_code text unique not null`, both immutable — enforced by a trigger
  that rejects `UPDATE` on either column.
- Issuance is a domain operation on the Person aggregate emitting
  `FootballIdIssued { football_id, display_code, issued_at, issuing_region }`.
- Lookup by `display_code` must be **rate-limited and authenticated** — it is a
  convenience index over minors and must not be an open public endpoint.
- Transfers change Membership only. Neither identifier is touched; `Journey`
  entries accumulate. This is the technical guarantee of "Player Owns The Journey".
- Region-based reporting reads Membership history, never the display code.
- Region code registry must be defined in the Identity ERD (G3).

## Compliance impact

DDD: Football ID is a Value Object owned by the Person aggregate root.
Event-driven readiness: `FootballIdIssued` is the anchor event of the ecosystem.

## North Star impact

Directly enables the "Football ID" component of Verified Active Players, and
protects the metric from inflation by making duplicate issuance detectable.
