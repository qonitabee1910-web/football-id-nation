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

The North Star remains **Verified Active Players (VAP)**. Three strategic KPIs qualify
it, because a Football Data Infrastructure is judged by the connectedness, completeness,
and lawfulness of its data — not by a user count.

They never substitute for the North Star: a phase cannot be exited on KPI strength
alone, and no KPI is reported without the `ActivityPolicy policy_id@version` it was
computed under (PRG-MET-001 rule).

### 9.1 Network Density Index (NDI)

Is this an ecosystem, or a set of silos?

- **Definition:** the connectedness of the football network within a scope — players,
  Organizations, coaches, competitions, and recorded activities as a single graph.
  NDI is the realised share of meaningful connections against the connections the
  population makes possible.
- **Headline sub-index (portability):** share of `ACTIVE` players whose Journey contains
  verified activity recorded by two or more distinct Organizations. Portability is the
  core promise, and this is the only figure that proves it happened in production rather
  than on paper.
- **Supporting sub-indices:** players per competition; Organizations sharing at least one
  competition; coaches linked to more than one Organization; share of activity records
  attached to a competition rather than isolated.
- **Scope:** computed per city, association, province, and nationally.
- **Anti-gaming:** the two Organizations must be independently administered. Activity
  attested by the same accountable adult never counts as two connections.

### 9.2 Journey Completeness Score (JCS)

Is a Football ID a real record, or an empty shell?

- **Headline figure (Council definition):** the **percentage of players whose football
  journey is complete** across four dimensions — identity, organization, activity, and
  development.
- **Completeness threshold:** a Journey counts as complete when all four dimensions are
  present: verified identity + guardian verification; an active or historical Membership;
  qualifying activity within the ActivityPolicy window; and at least one recorded
  Assessment.
- **Underlying computation:** a per-player weighted score whose component weights live in
  a named, versioned `JourneyCompletenessPolicy` object, same pattern as `ActivityPolicy`.
  Never hard-coded.
- **Reporting:** the percentage is the headline; the score **median plus distribution** is
  reported beneath it, never a bare average — an average hides a population of empty
  shells behind a few rich records.
- **Guardrail (Child's Interest Prevails):** JCS must never reward collecting more child
  data than a purpose requires. Any field not justified by an active consent purpose
  contributes **zero** weight, so a high JCS cannot be bought with over-collection.

### 9.3 Consent Trust Index (CTI)

Is the data we hold actually usable, lawfully?

- **Headline figure (Council definition):** the **percentage of player data that may be
  used for its intended purpose** because an active, valid consent covers it — measured
  per purpose (`P1`–`P8`) and in aggregate.
- **Validity test:** a grant counts only when it is unrevoked, unexpired, given at the
  required guardian verification level, and permitted for the subject's age band. An
  expired L1 grant on a `P5` purpose counts as zero, not as consent.
- **Supporting diagnostics:** guardian-verified rate; voluntary opt-in rate on
  non-essential purposes (`P4`–`P8`); consent revocation rate; high-risk revocation count;
  data-access-request fulfilment within SLA.
- **Halt semantics:** CTI is not a dashboard number. Falling below the defined floor
  triggers mandatory Council review and blocks phase exit **regardless of VAP
  performance**.
- **Traces to:** CONSENT-001 purposes `P1`–`P8` and the high-risk revocation flow.

## 10. Phased Targets

Five phases. Each has a scope, an entry condition, and an exit condition; the exit
condition of one phase is the entry condition of the next. **No phase is complete on
elapsed time alone.**

```text
Phase 0 Founding Network -> Phase 1 Sulsel Pilot -> Phase 2 Regional Scale
  -> Phase 3 Provincial Coverage -> Phase 4 National Expansion
```

| Phase | Name | Scope | Purpose |
| --- | --- | --- | --- |
| **0** | Founding Network | 1 city, hand-picked SSBs | Prove the **operational process**, not scale |
| **1** | Sulsel Pilot | Sulawesi Selatan | Repeatability without founder involvement; network effect first becomes measurable |
| **2** | Regional Scale | Indonesia Timur | Multi-association operation |
| **3** | Provincial Coverage | 12 provinces | Federation-grade data quality |
| **4** | National Expansion | Nasional | Scale economics — begins only once the provincial foundation is proven |

### 10.1 Confirmed target matrix

Confirmed as a business decision by the Council on **6 August 2026**. These are
commitments, not proposals.

| KPI | P0 Founding | P1 Pilot | P2 Regional | P3 Provincial | P4 National |
| --- | --- | --- | --- | --- | --- |
| Founding / participating SSBs | **10** | **30** | **100** | derived | pending |
| Competitions | **3** | **10** | **40** | derived | pending |
| Coaches | **80** | derived | derived | derived | pending |
| Referees | **25** | derived | derived | derived | pending |
| Verified Guardians | **1,200** | **4,000** | derived | derived | pending |
| Verified Players | **1,500** | **5,000** | **15,000** | **50,000** | pending |
| **VAP (North Star)** | **800** | **2,500** | **8,000** | **25,000** | pending |
| Provinces live | 1 (partial) | 1 | ≥3 | 12 | pending |
| NDI | baseline | target set at P0 baseline | " | " | " |
| JCS (% complete) | baseline | target set at P0 baseline | " | " | " |
| CTI (% usable) | baseline | target set at P0 baseline | " | " | " |

Cells the Council did not specify are marked honestly rather than invented:

- **`derived`** — the artefact computes a floor from the ratios the Council did set
  (e.g. coaches and referees scale with Organizations and Competitions). Derived floors
  are planning figures, not Council commitments, and are labelled as such wherever used.
- **`pending`** — Phase 4 national targets are intentionally unset. The Council stated
  national expansion begins only after the provincial foundation is proven, so setting
  Phase 4 numbers is a **Phase 3 exit deliverable**, not a G1 blocker.
- **`baseline`** — NDI, JCS, and CTI are ratio metrics with no meaningful pre-launch
  target. Phase 0 establishes the baseline; Phase 1 onwards carries a Council-set floor.

### 10.2 Ratio signals derived from the confirmed targets

Recorded as design sanity checks for later artefacts, **not** as additional targets:

| Signal | P0 | P1 | P2 | P3 |
| --- | --- | --- | --- | --- |
| VAP ÷ Verified Players | 53% | 50% | 53% | 50% |
| Implied `NEVER_ACTIVE` + inactive ceiling | 47% | 50% | 47% | 50% |
| Verified Players ÷ SSB | 150 | 167 | 150 | — |
| Guardians ÷ Verified Players | 0.80 | 0.80 | — | — |

Two consequences the design must absorb: a guardian-to-player ratio of 0.80 means
multi-child households are the norm, so **one Guardian must hold consent for several
Players from day one** — not as a later enhancement. And a steady ~50% VAP conversion
means `TEMPORARILY_INACTIVE`/`INACTIVE` is the expected majority-adjacent case, so
lifecycle reporting cannot treat non-active as an error state.

### 10.3 Entry and exit conditions

| Phase | Entry condition | Exit condition |
| --- | --- | --- |
| 0 Founding | Identity context passes G6 | Full loop proven — Football ID issued → guardian verified → activity recorded → `ACTIVE` computed → export produced — at 10 SSBs / 1,500 Verified Players / 800 VAP, with NDI, JCS, CTI baselines published |
| 1 Pilot | P0 exit met | 30 SSBs / 5,000 Verified Players / 2,500 VAP, onboarded **without founder involvement**; measurable network effect (NDI above P0 baseline) |
| 2 Regional | P1 exit met, ≥1 association integrated by API | 100 SSBs / 40 competitions / 15,000 Verified Players / 8,000 VAP across ≥2 associations |
| 3 Provincial | P2 exit met | 50,000 Verified Players / 25,000 VAP across 12 provinces; `P6` records reconcile with association records within tolerance; **Phase 4 targets set and approved** |
| 4 National | P3 exit met and P4 targets approved | Scale economics proven at the national target with all guardrails intact |

### 10.4 Guardrails (override every target)

Breach of any guardrail halts the roadmap regardless of VAP, NDI, JCS, or CTI:

- Any unauthorised disclosure of minor data: **zero tolerance**.
- Under-13 scouting exposures: **zero**, structurally enforced.
- Guardian data-access request fulfilment: 100% within SLA (CONSENT-001 §8).

Counter-metrics from §3 continue to be reported per phase alongside the KPIs.

## 11. Gate Status

`PRG-VIS-001` rev. 3 is **APPROVED**. The single open G1 condition — Council
confirmation of the phase targets — was closed on 6 August 2026. **G1 is PASSED** for
this artefact.

Two follow-ups are tracked as scheduled work rather than open conditions:

1. Phase 4 national targets — due as a Phase 3 exit deliverable.
2. NDI / JCS / CTI floors for Phase 1 onwards — due once the Phase 0 baseline exists.

## 12. Traceability

Satisfies `PRG-VIS-001` rev. 3 (Stage 1, G1 PASSED). Derives from
[PRG-MET-001](../metrics/active-football-activity.md) and
[CONSENT-001](../contexts/identity/00-consent-model.md). NDI, JCS, and CTI are specified
as computable definitions with named inputs and a named scope dimension, so the Stage 3
ERD derives them from event data rather than from a reporting-only table. Next artefacts:
`PRG-STK-001` (Stakeholder Map) and `IDN-PRD-001` (Identity PRD), both now unblocked and
designed against Phase 0 volumes: 10 SSBs, 3 competitions, 80 coaches, 25 referees,
1,200 guardians, 1,500 players, 800 VAP.
