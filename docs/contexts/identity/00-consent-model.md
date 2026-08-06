---
id: CONSENT-001
title: Consent, Access Rights, and Privacy Model for Minors
context: identity
stage: 0
status: DRAFT
owner: Principal Security Architect
co_owner: Principal Domain Architect
derives_from: []
satisfied_by: [IDN-DOM-001, IDN-ERD-001, IDN-API-001, IDN-UIC-001]
adrs: [ADR-0002]
north_star_impact: "Defines Guardian Verified — the second term of Verified Active Players."
---

# CONSENT-001 — Consent, Access Rights & Privacy for Minors

Foundational artefact. No table, endpoint, or screen touching a minor's data may
be designed before this is APPROVED. Applies across every bounded context, not
only Identity.

## 1. Why this is foundational

The majority of Persons on this platform are children aged 6–17. Their data is
created by adults (coaches, SSB admins, parents) and consumed by adults (scouts,
associations). The child is the data subject but rarely the actor. Consent is
therefore not a signup checkbox — it is a **first-class, versioned, revocable
domain object** that gates reads, writes, and exports for the child's lifetime.

Legal frame: UU No. 27/2022 (Pelindungan Data Pribadi, PDP) — processing a
child's data requires verified parent/guardian consent; the child gains rights
on reaching majority. Design targets PDP plus GDPR-Art.8-equivalent practice so
the platform is federation- and export-ready.

## 2. Definitions

| Term | Definition |
| --- | --- |
| **Minor** | Person under 18 years at the evaluation date (PDP threshold). |
| **Guardian** | Adult Person with a verified legal-responsibility Relationship to a Minor. Source of consent. |
| **Guardian Verified** | Guardian identity verified **and** at least the Baseline consent grant active for that Minor. |
| **Consent Grant** | Timestamped, versioned, revocable permission for one Purpose. |
| **Purpose** | A named, narrow reason for processing. Consent is never generic. |
| **Assent** | Non-binding acknowledgement by a Minor aged 13+. Recorded, never a substitute for guardian consent. |
| **Majority Transition** | On the 18th birthday, consent authority moves from Guardian to the Person. |

## 3. Consent purposes (closed list)

Consent is per purpose. No purpose may be added without a superseding revision
of this artefact.

| Code | Purpose | Required for | Default | Revocable |
| --- | --- | --- | --- | --- |
| `P1_IDENTITY` | Issue and maintain Football ID and core Person record | Any participation | Must be granted | Revoke = account closure |
| `P2_PARTICIPATION` | Record Membership, training, match, competition activity | SSB/club participation | Must be granted | Yes (ends participation) |
| `P3_DEVELOPMENT` | Store coach assessments and development records | Player development features | Opt-in | Yes |
| `P4_MEDIA` | Store and display photo/video of the Minor | Profile photo, match media | Opt-in, off by default | Yes (triggers takedown) |
| `P5_SCOUTING` | Expose profile to verified Scouts outside own Organization | Scouting context | Opt-in, off by default, **never** for under-13 | Yes |
| `P6_FEDERATION` | Share identity + participation with an Association/Federation | Official competition entry | Opt-in per competition | Yes, before submission only |
| `P7_ANALYTICS` | Aggregate, de-identified ecosystem reporting | North Star metrics | Opt-out | Yes (removes from row-level, not from historical aggregates) |

Hard rules:
1. `P1` and `P2` are the only purposes that may be required to use the platform.
2. Bundling purposes into a single accept action is forbidden — each is a
   separate, independently revocable grant.
3. No purpose grants marketing, third-party sale, or advertising. Those are not
   on the list and may not be added.
4. Under-13 Minors: `P5_SCOUTING` is unavailable regardless of guardian consent.

## 4. Consent grant object

```yaml
ConsentGrant:
  id: uuid
  subject_person_id: uuid        # the Minor (or adult Person)
  granted_by_person_id: uuid     # Guardian, or subject if adult
  purpose: P1..P7
  policy_version: text           # version of the notice text shown
  status: ACTIVE | REVOKED | EXPIRED | SUPERSEDED
  granted_at: timestamptz
  revoked_at: timestamptz | null
  expires_at: timestamptz | null # required for P6
  evidence:
    method: IN_APP | SIGNED_DOCUMENT | ORG_ASSISTED
    verification_ref: text       # guardian verification record id
    ip_hash: text
    user_agent_hash: text
```

Append-only. A change of mind writes a new row and supersedes the old one; rows
are never updated in place and never deleted. This is the audit trail.

## 5. Guardian verification

Verification levels, ascending:

| Level | Method | Unlocks |
| --- | --- | --- |
| `L0_UNVERIFIED` | Claimed relationship only | Nothing; Minor is `PENDING` |
| `L1_CONTACT` | Verified phone/email owned by the Guardian | `P1`, `P2` |
| `L2_DOCUMENT` | Guardian identity document + relationship evidence, reviewed by Organization Admin | `P3`, `P4`, `P6` |
| `L3_FEDERATION` | Association-level verification | `P5`, official competition submission |

- "Guardian Verified" in the North Star means **L1 or above with `P1` and `P2`
  active**.
- A Minor may have up to two Guardians. Either may grant; **either may revoke**
  (revocation is deliberately easier than granting).
- An Organization Admin may *assist* a Guardian (`ORG_ASSISTED`) but may never
  be the granting party. An SSB cannot consent on behalf of a child.

## 6. Access rights matrix

Read access to a Minor's data, by role. Write is narrower and stated separately.

| Data | Guardian | Own Coach | Org Admin (own org) | Scout | Association | Other Person |
| --- | --- | --- | --- | --- | --- | --- |
| Football ID + display code | R | R | R | if `P5` | if `P6` | – |
| Name, photo | R/W | R | R | if `P5`+`P4` | if `P6` | – |
| Date of birth | R/W | age band only | age band only | age band only | R if `P6` | – |
| Contact details | R/W | – | – | – | – | – |
| Address | R/W | – | – | – | – | – |
| Health/medical notes | R/W | emergency fields only | – | – | – | – |
| Membership (own org) | R | R | R/W | – | if `P6` | – |
| Membership history (all orgs) | R | – | – | if `P5` | if `P6` | – |
| Training/match activity | R | R/W (own org) | R (own org) | if `P5`, aggregate | if `P6` | – |
| Assessments | R if `P3` | R/W if `P3` | – | if `P5`+`P3` | – | – |
| Journey timeline | R | own-org slice | own-org slice | if `P5` | if `P6` | – |
| Consent grants | R/W | – | R (status only) | – | – | – |

Enforcement invariants for the Stage 3 RLS design:
1. Every policy on a Minor-bearing table checks (a) an active Membership or
   Guardian relationship **and** (b) an `ACTIVE` ConsentGrant for the purpose.
2. Consent revocation takes effect on the next request — no cached grants beyond
   the request lifetime.
3. Roles come from the dedicated role table via a `security definer` function;
   never from a column on a profile.
4. `anon` has **zero** read access to any table containing Minor data. No public
   player directory, ever.
5. Coaches see the child's data only for the period of an active Membership.
   Membership end revokes access; historical activity remains in the Journey,
   owned by the Player.

## 7. Data minimisation

- Collect date of birth once; expose **age band** everywhere except to Guardian
  and Association. Age band: U8, U10, U12, U14, U16, U18, Senior.
- No national ID number (NIK) for Minors. Ever.
- Health data limited to an emergency-relevant subset (allergies, conditions
  affecting play, emergency contact); no general medical history.
- Free-text fields on Minors are reviewable and reportable, never public.
- Aggregate reporting suppresses cells with fewer than 5 Persons.

## 8. Subject rights

| Right | Implementation | SLA |
| --- | --- | --- |
| Access | Guardian exports the full Football Passport + raw record (JSON + PDF) | Self-service, immediate |
| Rectification | Guardian edits, or requests correction of org-recorded facts | 7 days for org-recorded |
| Erasure | Person record and identifying data deleted; activity retained de-identified for aggregate integrity | 30 days |
| Restriction | Suspend `P3`–`P7` while keeping `P1`/`P2` | Immediate |
| Portability | Machine-readable Journey export, org-independent | Self-service |
| Objection | Revoke any opt-in purpose | Immediate |

Erasure never deletes another Person's data (e.g. a match result), and never
deletes the audit trail of consent itself.

## 9. Majority transition

On the Person's 18th birthday:
1. Guardian consent authority is frozen; existing grants remain `ACTIVE` but
   Guardian may no longer create new ones.
2. The Person is prompted at next sign-in to re-affirm each purpose.
3. Purposes not re-affirmed within 90 days move to `EXPIRED` (except `P1`).
4. Guardian read access downgrades to none unless the adult Person re-grants it.
5. Emits `ConsentAuthorityTransferred { person_id, occurred_at }`.

## 10. Domain events

| Event | Payload | Publisher |
| --- | --- | --- |
| `GuardianRelationshipClaimed` | person_id, guardian_person_id, claimed_at | Person aggregate |
| `GuardianVerified` | guardian_person_id, subject_person_id, level, verified_at | Person aggregate |
| `ConsentGranted` | grant_id, subject_person_id, purpose, policy_version, granted_at | Consent aggregate |
| `ConsentRevoked` | grant_id, subject_person_id, purpose, revoked_at | Consent aggregate |
| `ConsentExpired` | grant_id, subject_person_id, purpose, expired_at | Consent aggregate |
| `ConsentAuthorityTransferred` | person_id, occurred_at | Person aggregate |
| `MinorDataExported` | subject_person_id, requested_by, scope, exported_at | Consent aggregate |

`MinorDataExported` is an audit event — every export of a child's data is logged
and visible to the Guardian.

## 11. UX obligations (binding on G5)

- Consent notices in Bahasa Indonesia, plain language, ≤ 8th-grade reading level,
  with a per-purpose one-line explanation of "what this means for my child".
- Each purpose is a separate toggle. No pre-ticked opt-ins. No dark patterns.
- Revocation is reachable in ≤ 2 taps from the child's profile.
- Guardian dashboard shows: who accessed my child's data, when, and under which
  purpose.
- A Minor aged 13+ sees an age-appropriate assent screen and can see, but not
  change, their own consent state.

## 12. Acceptance criteria (G0 exit)

1. Given a Minor with no guardian verification, when any Organization attempts to
   read their profile, then only Football ID and age band are returned.
2. Given a Guardian revokes `P4_MEDIA`, when any client requests the Minor's
   photo, then the request returns 403 and cached media is purged within 24h.
3. Given a Membership ends, when the former Coach requests the Minor's
   assessments, then access is denied while the Journey entry remains readable
   to the Guardian.
4. Given a Person turns 18, when they sign in, then re-affirmation is required
   and Guardian read access is removed on completion.
5. Given an under-13 Minor, when `P5_SCOUTING` is requested, then the grant is
   rejected regardless of guardian level.

## 13. Traceability

Satisfies the G0 universal-gate item "child-data impact assessed; consent model
referenced where applicable". Blocks IDN-ERD-001 and IDN-API-001 until APPROVED.
Referenced by [ADR-0002 rev. 2](../../adr/ADR-0002-football-id-format.md) and
[PRG-MET-001](../../metrics/active-football-activity.md).
