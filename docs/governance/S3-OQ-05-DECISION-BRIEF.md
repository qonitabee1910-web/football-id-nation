---
id: S3-OQ-05-BRIEF
title: Decision-Ready Briefing — OQ-05 CTI Phase 0 Halt Threshold (Floor)
stage: 0
gate: G0 (Phase Exit Halt Semantics)
status: OPEN
owner: EFPEC Council + Metrics Working Group
decision_required: YES
phase_exit: BLOCKED UNTIL DECISION
derives_from: [glossary.md §Consent Trust Index, IDN-PRD-001 §Open Questions OQ-05, PRG-MET-001, PRG-VIS-001 §10.3 Phase Exit Conditions]
satisfied_by: NONE until Council Decision
adrs: []
north_star_impact: CTI operates INDEPENDENTLY of VAP as a HALT semantic. CTI below floor = PHASE EXIT BLOCKED regardless VAP=800 attained. Therefore CTI threshold does NOT reduce VAP target — it sets a trust floor that MUST be met ADDITIONALLY.
---

# OQ-05 Decision-Ready Briefing
## Consent Trust Index (CTI) — Phase 0 Halt Threshold Floor Value

---

## 1. CTI Authoritative Definition (NOT Invented Here)

Source: [glossary.md](file:///d:/PROYEK%20WEB%20MASTER/football-id-nation/docs/glossary.md) line 46 (APPROVED G0 vocabulary, authoritative ubiquitous language):

> **Consent Trust Index (CTI)** — Percentage of player data usable for its intended purpose because an active, valid consent covers it, measured per purpose and in aggregate. Diagnostics: guardian verification, voluntary opt-in, revocation rates, DSAR fulfilment. **Below its floor it blocks phase exit regardless of VAP.**

This definition has THREE binding properties that CANNOT be changed without Council amending glossary (approved artifact):
1. **Measurement unit**: Percentage (0–100%), per-Purpose + in-aggregate headline figure
2. **Diagnostic pillars**: Guardian verification rate · Voluntary opt-in rate · Revocation rate · Data Subject Access Request (DSAR) fulfilment SLA compliance
3. **Halt semantic (critical, non-negotiable)**: Below floor → PHASE EXIT BLOCKED. VAP attainment alone NEVER circumvents CTI halt.

**Corollary (OQ-05 purpose):** "Below its floor" in glossary definition requires an EXPLICIT numerical threshold. Without a threshold the halt semantics is unexecutable, hence the gate definition is incomplete (a gate without a measurable value = not a gate). This is the core OQ-05 problem statement.

---

## 2. CTI in Programme Lifecycle — Relationship with Phase Exit

From PRG-VIS-001 rev.3 APPROVED G1 PASSED (6 Aug 2026) §10.3 Phase Exit Conditions:

> "A phase exit requires BOTH:
> (a) Quantitative North Star VAP target attained per §10.1 matrix;
> (b) Strategic KPI Triad (NDI · JCS · CTI) baseline established; no phase proceeds to next phase until current phase's CTI floor met (halt semantics).
> (c) All critical blocker-findings discharged in the previous phase's Gate Review."
>
> Phase 0–4 are never complete on elapsed time alone.

From PRG-MET-001 (APPROVED G0, VAP counting rule) ActivityPolicy pattern precedent: ActivityPolicy is a **named + versioned configuration object** (policy_id@version), with rolling_window_days and thresholds as properties of the policy object. CTI follows the same governance pattern: CTIThresholdPolicy is a named, versioned, council-owned configuration object.

Therefore **OQ-05 = the CTIThresholdPolicy.GLOBAL.v1.phase_0_floor value** — an explicit number assigned by council decision; never hardcoded; every published CTI figure and every phase-exit gate check carries the `cti_policy_id@version` used to evaluate it.

---

## 3. CTI vs VAP — Independent Dual-Gate Model

Critical distinction (OQ-05 does not adjust VAP):

| Metric | Gate Type | Unit | Source | Phase 0 Target |
|---|---|---|---|---|
| VAP (North Star) | Attainment gate (count ≥ target) | Absolute count: #Players | PRG-MET-001 APPROVED G0 counting rule | 800 |
| CTI (Strategic KPI Triad) | **Halt gate** (% ≥ floor) | Percentage 0–100% | glossary §halt semantics + PRG-VIS KPI triad declaration | **UNDEFINED — OQ-05 = THIS VALUE** |

Example scenario (illustrative, thresholds NOT assigned here):

> Phase 0 operational end of window scenario:
> - VAP attained = 842 (> 800 target)
> - If CTI headline = 55%
> - If council-assigned CTI floor Phase 0 = XX%
>   - Case A: 55 ≥ XX (floor met) → Phase 0 Exit PROCEEDS, enter Phase 1 Sulsel Pilot
>   - Case B: 55 < XX (floor NOT met) → Phase 0 Exit **HALTED**, regardless VAP=842. Remediate: consent presentation clarity, guardian outreach, DSAR SLA improvement, or re-evaluate floor via Council ADR. Cannot move to Phase 1.

Constitutional Rule 0 child-protection analysis on CTI halt: A low CTI means a significant fraction of data cannot be legally used. Moving to Phase 1 Sulsel Pilot with CTI below floor = scaling a system that has not yet established a minimally trustworthy consent base. This creates:
- Legal risk at scale (consent-deficient data flowing to Federation competition/roster systems)
- Reputational risk to platform when the child data trust deficit is discovered later
- Rule 0 conflict: Children's data is being processed under defective consent, harming the child's legal position regardless of operational utility.

---

## 4. Why Threshold Must Be Formal Council Decision

Why agent/infrastructure CANNOT default CTI floor internally:

1. **Governance chain of authority:** CTI floor is a KPI in the KPI triad approved by PRG-VIS-001 G1. KPI values are owned by EFPEC Council Metrics Working Group — not owned by implementation team, not invented in specification.
2. **Per §1 OQ-05 brief statement:** Glossary definition says "below its floor blocks phase exit". No value anywhere in approved artefacts. Inventing a value = Agent inference > Approved Artifact, which violates the SOURCE OF TRUTH CONFLICT RESOLUTION order at Sprint 3 §1:
   > Approved ADR > Council Decision > Approved Governance Artifact > Approved Domain Artifact > IN_REVIEW Artifact > Draft > **Agent inference**
3. **Auditability requirement:** Every CTI halt/no-halt decision at phase exit must be traceable to an explicit council-assigned value. If the value defaults to a random assumption (e.g. 50%, 60%, 70%) the audit trail is corrupted.
4. **Phase 0 baseline reference:** Per PRG-VIS-001 §10 KPI Triad footnote: "NDI JCS CTI Phase 0 = baseline measurement; Phase 1+ floor values re-calibrated against Phase 0 baseline after measurement". This means Phase 0 itself has an INITIAL floor (OQ-05). Phase 0 exit uses OQ-05 floor; then Phase 1+ floors are reset using actual baseline data in a Council-approved CTIThresholdPolicy v2 via formal review. Council must consciously set Phase 0 initial floor knowing this iterative pattern.
5. **Halt semantics is irreversible without Council override:** If floor accidentally too high, Phase 0 exit blocks even with healthy platform. If floor accidentally too low, defective consent base scales to Phase 1+ with compounding trust debt. Only Council has authority to accept either risk with Rule 0 analysis recorded.

---

## 5. Downstream Impact of Undecided Threshold Across Artefacts

| Artefact | Gate | OQ-05 Impact | Hard Block? |
|---|---|---|---|
| IDN-PRD-001 §OQ-05 Decision Log | G2 | Decision record populates here | **YES — G2-06 all policy values decided** fails without |
| PRG-MET-001 ActivityPolicy pattern CTIThresholdPolicy reference | G0 | Policy object schema defines phase_floor property; property value is OQ-05 | Soft block (schema correct without value) — APPROVED G0 already passed so OK as parameter |
| PRG-VIS-001 §10.3 Phase Exit Conditions | G1 | Text requires CTI floor; value injected via reference to CTIThresholdPolicy | G1 ALREADY PASSED, value is downstream parameter |
| IDN-API-001 Q-11 QueryMetrics (CTI headline figure response) | G4 | Returns current CTI + cti_policy_id@version used; no threshold in response schema | Soft block (policy version is reference, value is config injected at runtime) |
| IDN-SCR-001 SCR-SYS-04 Metrics Dashboard | G7 | CTI tile displays floor for current phase + current% + pass/fail indicator | Content block — floor label value |
| IDN-DS-001 Color token semantics (Red = HALTED, Green = PASSED) | G5 | Structural, not value-dependent | PASS |
| IDN-FE-001 §22 Observability phase-exit hook | G6 | Reads CTIThresholdPolicy at phase-exit gate check; halt condition: `agg_cti_pct < policy.current_phase_floor` → BLOCK; value read from policy object | Structural pattern OK; value at runtime = policy config |
| Programme Phase Transition Lifecycle Automation | Programme-wide | CTI floor = binary comparator in gate automation | **YES — Phase 0 exit gate cannot run without comparator value** |

HARD BLOCK LOCATIONS:
1. IDN-PRD-001 G2 APPROVAL (policy completeness rule — same vector as OQ-02)
2. Programme Phase 0 Exit Gate Automation (phase exit cannot be programmatically evaluated)

Soft blocks in G3/G4/G5/G6 structural artefacts: acceptable as parameterized policy value (not structural blocker, consistent with EDEC pattern for configurable thresholds).

---

## 6. Decision Owner Identification

| Party | Role in Decision |
|---|---|
| **EFPEC Metrics Working Group** | Propose 2–3 candidate values with analytical justification. Working Group members: Principal Data Architect (chair), Principal QA Architect, Chief Product Officer, Principal DevOps Architect (observability). The Working Group DOES NOT DECIDE; it proposes candidates with analysis. |
| **Chief Enterprise Architect** | Chairs Council session approving threshold value. |
| **Chief Product Officer** | Validates compatibility with PRD scope. |
| **Principal Security Architect** | Veto holder: must evaluate whether threshold too low creates trust-scaling data protection debt (Rule 0 override check). |
| **Principal AI Systems Architect** | CTI P8 AI consent sub-metric is in-scope; validates floor does not accidentally enable premature AI training scaling. |
| **Principal Grassroots Development Expert** + **Principal Football Operations Expert** | Operational realism validation — can the Phase 0 pilot cohort realistically attain the proposed floor in consent-culture context of grassroots Indonesia? |
| **Full EFPEC Council** | Final vote/decision with recorded Rule 0 analysis, tied vote resolved per decision-rules.md priority. |

---

## 7. Programme Lifecycle Impact Summary

Phase 0–4 lifecycle progression model with CTI halt gating superimposed:

```
Phase 0 Founding Network
  Run window (operational duration)
  ↓
  Measurement at window end:
  (1) VAP >= 800 ?
      AND
  (2) NDI baseline captured?
  AND JCS baseline captured?
  AND CTI >= OQ-05-FLOOR ?   <---- OQ-05 IS THIS VALUE
  AND
  (3) All prior gate review findings discharged?
  ↓ YES → ALL THREE
Phase 1 Sulsel Pilot Entry APPROVED
  ↓
Phase 1 exit:
  CTI threshold NEW value from CTIThresholdPolicy.GLOBAL.v2 (council re-calibrated using actual Phase 0 baseline data)
  ...repeats...
```

Without OQ-05: Arrow (2) CTI check is indeterminate. Council must decide value BEFORE the operational window of Phase 0 reaches measurement checkpoint; ideally at G2 PRD approval so the value is communicated to pilot SSB during onboarding and consent-culture can be set appropriately.

---

## 8. Decision Required Status

```yaml
STATUS: OPEN
OWNER: EFPEC Council + Metrics Working Group (proposal)
DECISION REQUIRED: YES
PHASE EXIT: BLOCKED UNTIL DECISION — CTI halt semantic without threshold value is not executable
THRESHOLD SCOPE: CTIThresholdPolicy.GLOBAL.v1.phase_0_floor = < COUNCIL ASSIGNED % VALUE, NOT BY AGENT >
PRIORITY: P0 — parallel with OQ-02; both required for G2 IDN-PRD-001 APPROVAL
DECISION FORMAT: Council Resolution added to .lovable/plan:
  - Explicit assigned threshold percentage VALUE for Phase 0 (single number)
  - Rule 0 analysis: Why this value does not accept undue child-data trust debt OR does not unreasonably block phase progress — explicit trade-off documented
  - Veto discharge from Principal Security Architect
  - Reference to glossary.md §CTI halt semantics (authoritative source)
  - Link to updated IDN-PRD-001 Decision Log §OQ-05 line
  - Metrics Working Group proposal record attachment
POST-DECISION: Update docs/metrics/active-football-activity.md (PRG-MET-001) with new §CTIThresholdPolicy reference section (non-breaking; value is parameter added per approved decision)
```

---

*Decision Briefing prepared 9 Aug 2026 per Sprint 3 S3-O2 Council Decision Readiness mandate. NO THRESHOLD VALUE IS STATED, IMPLIED, OR RECOMMENDED IN THIS DOCUMENT. Any numerical value for CTI floor requires explicit EFPEC Council resolution per decision-rules.md priority order with Rule 0 analysis on record. Agent is forbidden from inventing threshold. Decision Briefing is NOT binding; binding only when Council Resolution supersedes.*
