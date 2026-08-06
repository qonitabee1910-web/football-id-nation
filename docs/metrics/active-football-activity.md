---
id: PRG-MET-001
title: Active Football Activity — counting specification
context: programme
stage: 0
status: DRAFT
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

## 1. North Star restated

```text
Verified Active Player (VAP) =
    has Football ID
  AND is Guardian Verified (or is an adult Person with own consent)
  AND has Active Football Activity
```

All three terms are evaluated **as of an evaluation date `D`**, per Person.

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

## 3. Counting rule

```text
ActiveFootballActivity(person, D) = TRUE
  iff  count(qualifying activity events for person
             with occurred_at in (D - 90 days, D])
       >= 2
       and those events fall on >= 2 distinct calendar dates
```

- **Window:** 90 days, trailing, inclusive of `D`.
- **Threshold:** 2 events on 2 distinct dates. One event is noise (a trial
  session, a single friendly); two on separate dates is a pattern.
- **Timezone:** all date bucketing in `Asia/Makassar` (WITA) for reporting,
  stored as `timestamptz` in UTC.
- **Attribution date:** `occurred_at` = when the football activity happened,
  never when it was entered into the system. Backdated entries count toward the
  date they occurred.
- **Deduplication:** multiple records of the same activity type by the same
  Organization on the same calendar date count once.

## 4. Seasonality guard

Indonesian grassroots football pauses (Ramadan, school holidays, extended rainy
season). A rigid 90-day window would report a false collapse.

- `VAP` is reported as the headline number.
- `VAP-Seasonally-Adjusted` is reported alongside it, using a 180-day window and
  the same threshold, and is the number used for trend and target setting.
- Never substitute one for the other in the same chart without labelling.

## 5. Lifecycle states

| State | Definition |
| --- | --- |
| `ACTIVE` | Meets the rule at `D` |
| `LAPSING` | Met the rule at `D - 30` but not at `D` |
| `DORMANT` | No qualifying activity in the trailing 180 days |
| `NEVER_ACTIVE` | Football ID issued, zero qualifying activity ever |

`NEVER_ACTIVE` is tracked separately as the registration-inflation guard: a rising
Football ID count with a rising `NEVER_ACTIVE` share means the platform is
issuing identities, not creating football.

## 6. Anti-gaming rules

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

## 7. Reporting contract

- Recomputed nightly; also computable on demand for any historical `D`.
- Materialised as a `person_activity_snapshot` read model (Stage 3 artefact),
  never computed by scanning raw events in the UI.
- Published dimensions: Organization, Association, Province, age band, gender,
  role. Age band and gender are **aggregate-only** and suppressed below a cell
  count of 5, per [CONSENT-001](../contexts/identity/00-consent-model.md).

## 8. Open items for G1

- Baseline VAP target for Sulawesi Selatan pilot (needs pilot SSB list).
- Whether futsal and school-competition activity qualify as A2 in year one.

## 9. Traceability

Satisfies G0 checklist item "North Star Metric defined with an unambiguous
counting rule". Consumed by `PRG-VIS-001` (Stage 0) and the Identity and
Training/Match ERDs (Stage 3).
