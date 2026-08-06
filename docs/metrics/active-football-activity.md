---
id: PRG-MET-001
title: Active Football Activity — counting specification
context: programme
stage: 0
status: APPROVED (G0, 6 Aug 2026, with lifecycle + configurable-policy amendments)
owner: Chief Product Officer
co_owner: Principal Data Architect
derives_from: []
satisfied_by: [PRG-VIS-001]
adrs: [ADR-0002]
north_star_impact: "Defines the third and final term of Verified Active Players."
---

# PRG-MET-001 — Active Football Activity

Required by G0: the North Star Metric cannot be implemented until "active" has an
unambiguous, machine-computable counting rule. This document defines it.

**Amendment note (G0 approval):** the Council approved the counting rule and added
two requirements — a six-state player lifecycle (§5) and a configurable, versioned
`ActivityPolicy` (§3) rather than hard-coded thresholds.

## 1. North Star restated

```text
Verified Active Player (VAP) =
    has Football ID
  AND is Guardian Verified (or is an adult Person with own consent)
  AND has Active Football Activity
```

All three terms are evaluated **as of an evaluation date `D`**, per Person, **under a
named `ActivityPolicy` version**.

## 2. Qualifying activity events

An activity qualifies only if it is (a) recorded by an Organization the Person
holds an active Membership with, (b) attributed to that Person individually, and
(c) attested by an accountable adult role.

| # | Activity type | Recorded by | Minimum evidence |
| --- | --- | --- | --- |
| A1 | Training session attendance | Coach (Organization) | Session record + per-player attendance mark |
| A2 | Match participation | Match Official or Coach | Match sheet entry (starting XI, substitute used, or bench listed as present) |
| A3 | Player assessment | Coach or Scout | Assessment record with at least one scored attribute |
| A4 | Competition registration confirmed | Organization Admin | Confirmed squad entry for a fixture within the window |

Non-qualifying, explicitly: account creation, login, profile edit, guardian
consent, payment, message read, app open, follow/like, parent-only actions, and
any activity self-reported by the Player without an organizational record.

## 3. ActivityPolicy — the counting rule is configuration, not code

The rule is a named, versioned object. No threshold may be hard-coded in a query,
server function, dashboard, or migration.

```text
ActivityPolicy
  policy_id                        uuid
  version                          integer          -- monotonic, forward-only
  scope                            GLOBAL | ASSOCIATION | COMPETITION
  scope_ref                        uuid | null      -- null only when scope = GLOBAL
  effective_from                   timestamptz
  rolling_window_days              default 90
  minimum_events                   default 2
  minimum_distinct_dates           default 2
  adult_attestation_required       default true
  qualifying_activity_types        default [A1, A2, A3, A4]
  seasonal_adjustment_days         default 180
  temporarily_inactive_after_days  default 90
  inactive_after_days              default 180
  archived_after_days              default 1095     -- 3 years
  reporting_timezone               default Asia/Makassar
```

Evaluation under a policy:

```text
ActiveFootballActivity(person, D, policy) = TRUE
  iff  count(qualifying events for person
             with occurred_at in (D - policy.rolling_window_days, D])
       >= policy.minimum_events
       and those events fall on >= policy.minimum_distinct_dates distinct
           calendar dates in policy.reporting_timezone
```

National default (`GLOBAL v1`): 90-day window, 2 events, 2 distinct dates,
adult attestation required. This is the number reported as *the* VAP figure.

Policy invariants:

1. Exactly **one** `GLOBAL` policy is active at any instant; associations and
   competitions may override only within their own scope.
2. A Person is evaluated under the narrowest policy whose scope they fall in;
   national reporting always re-evaluates under `GLOBAL`.
3. Every published VAP figure carries `policy_id@version`. Figures computed under
   different policy versions are never compared, charted, or summed without the
   version label shown.
4. Policy changes are **forward-only**. A new version never retro-alters a
   published historical figure; historical snapshots keep the version they were
   computed under.
5. Changing the `GLOBAL` policy requires an ADR — it redefines the North Star.

## 4. Attribution and deduplication

- **Attribution date:** `occurred_at` = when the football activity happened,
  never when it was entered. Backdated entries count toward the date they occurred.
- **Timezone:** date bucketing in `policy.reporting_timezone` (default
  `Asia/Makassar`); stored as `timestamptz` in UTC.
- **Deduplication:** multiple records of the same activity type by the same
  Organization on the same calendar date count once.

## 5. Player lifecycle states

Adopted at G0 on Council amendment. Replaces the earlier ACTIVE/LAPSING/DORMANT
set. The purpose is to let a national dashboard and downstream AI distinguish a
player on school holiday from a player in transfer from a player who has quit.

```text
REGISTERED ──▶ VERIFIED ──▶ ACTIVE ⇄ TEMPORARILY_INACTIVE ──▶ INACTIVE ──▶ ARCHIVED
     │             │            ▲             │                  │            │
     └─────────────┴────────────┴─────────────┴──────────────────┘            │
                        re-entry on qualifying activity                        │
                                    (re-verification required from ARCHIVED) ──┘
```

| State | Entry condition | Exit condition |
| --- | --- | --- |
| `REGISTERED` | Football ID issued; guardian verification incomplete | Guardian Verified achieved → `VERIFIED` |
| `VERIFIED` | Guardian Verified (L1+ with `P1`+`P2` active) but activity rule not yet met | Activity rule met → `ACTIVE`; consent revoked → back to `REGISTERED` |
| `ACTIVE` | Meets the activity rule under the applicable policy at `D` | Rule not met at `D` → `TEMPORARILY_INACTIVE` |
| `TEMPORARILY_INACTIVE` | Was `ACTIVE` within `temporarily_inactive_after_days`, or a transfer is in progress | Any qualifying event → `ACTIVE` (no re-verification); exceeds `inactive_after_days` → `INACTIVE` |
| `INACTIVE` | No qualifying activity for `inactive_after_days` | Any qualifying event → `ACTIVE`; exceeds `archived_after_days` → `ARCHIVED` |
| `ARCHIVED` | No qualifying activity for `archived_after_days`, or Guardian requests archival | Person or Guardian reactivates → `VERIFIED` after consent re-affirmation |

Rules:

1. The machine is **not one-directional**. Players return; every state except
   `ARCHIVED` re-enters `ACTIVE` on a single qualifying event, and `ARCHIVED`
   re-enters at `VERIFIED` after consent re-affirmation.
2. `TEMPORARILY_INACTIVE` is entered on lapse **and** while a transfer between
   Organizations is in progress — a transferring player is never counted as lost.
3. **`NEVER_ACTIVE` is a derived boolean flag**, not a state. It is true for any
   Person in `REGISTERED` or `VERIFIED` who has never recorded a qualifying event.
   It remains the registration-inflation guard: rising Football ID counts with a
   rising `NEVER_ACTIVE` share mean the platform is issuing identities, not
   creating football.
4. Only `ACTIVE` counts toward VAP. `TEMPORARILY_INACTIVE` is reported alongside
   as the recoverable population.
5. `ARCHIVED` never deletes the Journey. Archival is a lifecycle state, not erasure;
   erasure is a consent right governed by CONSENT-001 §8.

## 6. Seasonality guard

Indonesian grassroots football pauses (Ramadan, school holidays, extended rainy
season). A rigid window would report a false collapse.

- `VAP` is reported as the headline number, under `GLOBAL` policy.
- `VAP-Seasonally-Adjusted` is reported alongside it, using
  `policy.seasonal_adjustment_days` (default 180) and the same thresholds, and is
  the number used for trend and target setting.
- Never substitute one for the other in the same chart without labelling.

## 7. Anti-gaming rules

1. An Organization may not mark attendance for a Person whose Membership was
   created less than 24 hours before `occurred_at` **and** never renewed.
2. Bulk attendance marking for an entire squad on a single date is recorded with
   `entry_mode = 'bulk'` and is counted, but flagged in the integrity report.
3. Activity recorded by a user whose only role is Organization Admin does not
   qualify for A1/A2/A3 — those require Coach, Scout, or Match Official.
4. A Person's activity in a single Organization cannot exceed 1 qualifying event
   per activity type per calendar date (see deduplication).
5. Any Organization whose `NEVER_ACTIVE → ACTIVE` conversion spikes above 3σ of
   the national distribution in one week is queued for review, not auto-blocked.

## 8. Reporting contract

- Recomputed nightly; also computable on demand for any historical `D` and any
  policy version.
- Materialised as a `person_activity_snapshot` read model (Stage 3 artefact)
  carrying `lifecycle_state`, `never_active`, and `policy_id@version`. Never
  computed by scanning raw events in the UI.
- Published dimensions: Organization, Association, Province, age band, gender,
  role. Age band and gender are **aggregate-only** and suppressed below a cell
  count of 5, per [CONSENT-001](../contexts/identity/00-consent-model.md).

## 9. Open items for G1

- Baseline VAP target for Sulawesi Selatan pilot (needs pilot SSB list).
- Whether futsal and school-competition activity qualify as A2 in year one.

## 10. Traceability

Satisfies G0 checklist item "North Star Metric defined with an unambiguous
counting rule". Consumed by [`PRG-VIS-001`](../vision/PRG-VIS-001-vision-positioning.md)
and the Identity and Training/Match ERDs (Stage 3).
