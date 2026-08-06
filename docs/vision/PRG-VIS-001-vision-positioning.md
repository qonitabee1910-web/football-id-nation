---
id: PRG-VIS-001
title: Vision & Positioning — Football Ecosystem Platform Indonesia
context: programme
stage: 1
status: APPROVED
revision: 3
approved_on: 2026-08-06
gate: G1 PASSED
owner: Chief Product Officer
co_owner: Chief Enterprise Architect
derives_from: [PRG-MET-001, CONSENT-001]
satisfied_by: [PRG-STK-001, IDN-PRD-001]
adrs: [ADR-0001, ADR-0002]
north_star_impact: "Defines the North Star and the strategic frame every later artefact traces to."
---

# PRG-VIS-001 — Vision & Positioning

First official Stage 1 artefact. Every later artefact — PRD, domain model, ERD,
API contract, UI contract — must trace upward to a statement in this document.

**One Identity. One Journey. One Football Ecosystem.**

## 1. Vision Statement

> Every young footballer in Indonesia owns a single, permanent, verifiable
> football identity — and the complete record of their journey — regardless of
> which school, club, academy, or association they pass through.

Today an Indonesian child's football history is scattered across WhatsApp groups,
paper registration forms, and the private spreadsheets of whichever SSB they
happened to join. When they leave, the history stays behind. Talent is invisible
beyond the district that produced it, and the national federation cannot see the
population it is responsible for developing.

The vision is the inverse: the record follows the child, not the organization.

## 2. Mission

Build the national identity and journey infrastructure for Indonesian youth
football, such that:

1. Every player has one Football ID that no organization can revoke, re-issue, or
   own.
2. Every training session, match, and assessment accumulates into a portable
   Journey that survives every transfer.
3. Every piece of a child's data is processed only under an explicit, revocable,
   purpose-specific guardian consent.
4. Every association and the federation can see verified, current participation
   data — aggregated, consented, and trustworthy.
5. Every SSB gets more operational value from participating than from holding
   data hostage.

## 3. North Star

**Verified Active Players (VAP)** = Football ID + Guardian Verified + Active
Football Activity.

The counting rule, lifecycle states, seasonal adjustment, and anti-gaming rules
are defined in [PRG-MET-001](../metrics/active-football-activity.md) and are not
restated here. Any change to the counting rule is a change to this vision and
requires an ADR.

Why this metric and not registrations: registrations measure our sales effort.
VAP measures whether children are actually playing football with a verified,
protected identity. It is deliberately hard to inflate — it requires a real
organization to record real activity attested by a real accountable adult.

Counter-metrics tracked alongside, so the North Star cannot be gamed into
meaninglessness:

- `NEVER_ACTIVE` share of issued Football IDs (registration inflation).
- Consent revocation rate (trust erosion).
- `TEMPORARILY_INACTIVE → INACTIVE` conversion (silent attrition).
- Median time from registration to first qualifying activity (onboarding friction).

## 4. Strategic Principles

Non-negotiable. These govern every artefact and every trade-off.

| # | Principle | Meaning in practice |
| --- | --- | --- |
| 0 | **The Child's Interest Prevails** | Where Organization, Coach, Guardian, Sponsor, or Association interests conflict, the outcome that best protects the child Player wins. Overrides all other rules. |
| 1 | **Player Owns The Journey** | An Organization holds Membership, never ownership. Transfer changes Membership only; the Journey is untouched. |
| 2 | **Football ID First** | No module, context, or partner invents its own player identity. Identity is opaque and meaning-free (ADR-0002 rev. 2). |
| 3 | **One Person → Multiple Roles** | A coach who is also a parent and a referee has one account. Roles are capabilities, never separate logins. |
| 4 | **API-First** | Every capability exists in the API before it exists in a screen. The web app is one client among web, mobile, association, and federation integrations. |
| 5 | **Contract-First Engineering** | No code before approved contracts. PRD → Domain → ERD → API → UI → Implementation. |

Supporting architectural stances: Privacy by Design, Consent by Default, Zero
Trust, Event-Driven Readiness, AI-Native (with AI training gated behind its own
consent purpose, CONSENT-001 `P8`).

## 5. Target Stakeholders

| Stakeholder | What they have today | What the platform gives them |
| --- | --- | --- |
| **Player (child, 6–17)** | No record they control; history lost on every move | A permanent Football ID and a Journey that is theirs for life |
| **Guardian / Parent** | No visibility into what is recorded about their child, or by whom | Verified control: per-purpose consent, an access log, and portable export |
| **Coach** | Attendance in a notebook; assessments in their head | Structured session, attendance, and development records tied to a real identity |
| **SSB / Club / Academy** | Manual registration, duplicated data entry, no credibility signal | Verified rosters, less admin, and a demonstrable development record that attracts families |
| **Association (Askab / Asprov)** | Paper competition entries; unverifiable eligibility | Verified participation data and eligibility checks that hold up |
| **Federation (PSSI)** | No reliable national picture of youth participation | A trustworthy, consented national participation dataset |
| **Scout** | Word of mouth, limited to their own network | Consented, verified access to development records — never for under-13s |
| **Player (adult, 18+)** | — | Consent authority transfers to them; the Journey continues, unbroken |

## 6. Value Proposition

**For the child and guardian:** an identity nobody can take away, and real control
over who sees what.

**For the SSB:** the administrative burden of registration, attendance, and
eligibility drops, and participation makes the SSB more attractive to families
rather than locking them in. The platform deliberately gives the SSB *less*
ownership and *more* usefulness — that trade is the product.

**For the association and federation:** for the first time, verified national
participation data that can be trusted for planning, funding, and eligibility.

**Positioning statement:** this is national football identity infrastructure with
management tools attached — not an SSB management tool with an identity feature
attached. The distinction determines every design decision: when a feature would
strengthen the organization's grip on the player, it is out of scope.

## 7. Non-Goals

Explicitly out of scope. Naming these protects the roadmap.

1. **Not an SSB administration suite.** No payroll, accounting, inventory, or
   facility booking. Finance is limited to what participation requires.
2. **Not a social network.** No public profiles, no feeds, no follower counts, no
   public directory of children. `anon` access to minor data is zero, permanently.
3. **Not a marketplace.** No player listings, no transfer fees, no brokerage.
4. **Not a talent-agency intermediary.** The platform never represents a player,
   takes a commission, or brokers a move.
5. **Not an advertising business.** No purpose on the consent list permits
   marketing, profiling for ads, or third-party data sale — and none may be added.
6. **Not a live-streaming or media platform.** Media exists only as consented
   evidence attached to activity (`P4`).
7. **Not a senior-professional system** in the initial horizon. Adults exist as
   Persons and roles; professional club operations are not the target.

## 8. Strategic Boundaries

**Geographic sequencing:** Sulawesi Selatan (pilot) → Indonesia Timur → Nasional.
Every schema, identifier, and policy decision is evaluated against national scale
from day one, but go-to-market is sequential. Nothing may assume a single
province, and nothing may require a central sequence generator.

**Domain sequencing:** Identity before everything.
`Tidak ada fitur pertandingan sebelum Identity selesai.` Competition, Match,
Training, and Development artefacts are blocked until the Identity context passes
G6.

**Age boundary:** the platform is designed for minors first. Adult flows are the
special case, not the default — every screen, policy, and endpoint assumes the
subject may be a child until proven otherwise.

**Technical boundary:** TanStack Start + Lovable Cloud (ADR-0001). Federation
integration is by API contract, never by database sharing.

**Regulatory boundary:** UU No. 27/2022 (PDP) as the floor, GDPR-equivalent
practice as the design target, so the platform is export- and federation-ready.

## 9. Strategic KPIs

Three KPIs qualify the North Star. They never substitute for it: a phase cannot be
exited on KPI strength alone, and no KPI may be reported without the
`ActivityPolicy policy_id@version` it was computed under (PRG-MET-001 rule).

### 9.1 Network Density Index (NDI)

Is this an ecosystem, or a set of silos?

- **Definition:** share of `ACTIVE` players, within a scope, whose Journey contains
  verified activity recorded by two or more distinct Organizations.
- **Why:** portability is the core promise. NDI is the only metric that proves it
  happened in production rather than on paper.
- **Scope:** computed per city, association, province, and nationally.
- **Anti-gaming:** the two Organizations must be independently administered.
  Activity attested by the same accountable adult never counts as two.

### 9.2 Journey Completeness Score (JCS)

Is a Football ID a real record, or an empty shell?

- **Definition:** per-player weighted completeness across identity, guardian
  verification, membership, activity history, and assessment coverage.
- **Reporting:** population **median plus distribution**, never a bare average — an
  average hides a population of empty shells behind a few rich records.
- **Configurability:** component weights live in a named, versioned
  `JourneyCompletenessPolicy` object, same pattern as `ActivityPolicy`. Never
  hard-coded.
- **Guardrail (Child's Interest Prevails):** JCS must never reward collecting more
  child data than a purpose requires. Any field not justified by an active consent
  purpose contributes **zero** weight, so a high JCS cannot be bought with
  over-collection.

### 9.3 Consent Trust Index (CTI)

Do guardians trust the platform, or merely tolerate it?

- **Composite of:** guardian-verified rate; voluntary opt-in rate on non-essential
  purposes (`P4`–`P8`); consent revocation rate (inverted); high-risk revocation
  count (inverted); data-access-request fulfilment within SLA.
- **Halt semantics:** CTI is not a dashboard number. Falling below the defined floor
  triggers mandatory Council review and blocks phase exit **regardless of VAP
  performance**.
- **Traces to:** CONSENT-001 purposes `P1`–`P8` and the high-risk revocation flow.

## 10. Phased Targets

Five phases replace the earlier three horizons. Each phase has a scope, an entry
condition, and an exit condition; the exit condition of one phase is the entry
condition of the next. **No phase is complete on elapsed time alone.**

```text
Founding -> Pilot -> Regional -> Provincial -> National
```

| Phase | Scope | Purpose |
| --- | --- | --- |
| **Founding** | 1 city, hand-picked SSBs | Prove the identity + consent loop end to end |
| **Pilot** | Sulawesi Selatan | Prove repeatability without founder involvement |
| **Regional** | Indonesia Timur | Prove multi-association operation |
| **Provincial** | 12 provinces | Prove federation-grade data quality |
| **National** | Nasional | Prove scale economics |

### 10.1 Target matrix

All figures below are **`TBC — business decision`**. They are deliberately blank:
targets are a business commitment, not an architectural proposal.

| Metric | Founding | Pilot | Regional | Provincial | National |
| --- | --- | --- | --- | --- | --- |
| Verified Active Players (VAP) | TBC | TBC | TBC | TBC | TBC |
| Participating Organizations with ≥1 `ACTIVE` player | TBC | TBC | TBC | TBC | TBC |
| Provinces live | 1 (part) | 1 | TBC | 12 | TBC |
| `NEVER_ACTIVE` share of issued Football IDs | TBC | TBC | TBC | TBC | TBC |
| Guardian Verified rate among registered minors | TBC | TBC | TBC | TBC | TBC |
| Median registration → first qualifying activity | TBC | TBC | TBC | TBC | TBC |
| **NDI** | TBC | TBC | TBC | TBC | TBC |
| **JCS** (median) | TBC | TBC | TBC | TBC | TBC |
| **CTI** (floor) | TBC | TBC | TBC | TBC | TBC |

### 10.2 Entry and exit conditions

| Phase | Entry condition | Exit condition |
| --- | --- | --- |
| Founding | Identity context passes G6 | Full loop proven: Football ID issued → guardian verified → activity recorded → `ACTIVE` computed → export produced; VAP/CTI targets met |
| Pilot | Founding exit met | Provincial targets met with organizations onboarded without founder involvement |
| Regional | Pilot exit met, ≥1 association integrated by API | Multi-association operation proven; NDI target met across ≥2 associations |
| Provincial | Regional exit met | Federation-grade data quality: `P6` records reconcile with association records within tolerance |
| National | Provincial exit met | Scale economics proven at national VAP target with all guardrails intact |

### 10.3 Guardrails (override every target)

Breach of any guardrail halts the roadmap regardless of VAP, NDI, JCS, or CTI:

- Any unauthorised disclosure of minor data: **zero tolerance**.
- Under-13 scouting exposures: **zero**, structurally enforced.
- Guardian data-access request fulfilment: 100% within SLA (CONSENT-001 §8).

Counter-metrics from §3 continue to be reported per phase alongside the KPIs.

## 11. Open G1 Condition

`PRG-VIS-001` is **architecturally approved**. One condition remains before G1 can
be declared PASSED:

> Every `TBC` in the §10.1 target matrix must be confirmed as a business decision
> by the Chief Product Officer and recorded here with the confirmation date.

Until then no Stage 1 artefact that depends on target numbers may be approved.

## 12. Traceability

Satisfies `PRG-VIS-001` rev. 2 (Stage 1). Derives from
[PRG-MET-001](../metrics/active-football-activity.md) and
[CONSENT-001](../contexts/identity/00-consent-model.md). NDI, JCS, and CTI are
specified as computable definitions with named inputs so the Stage 3 ERD derives
them from event data, not from a reporting-only table. Next artefacts:
`PRG-STK-001` (Stakeholder Map) and `IDN-PRD-001` (Identity PRD), both G1.
