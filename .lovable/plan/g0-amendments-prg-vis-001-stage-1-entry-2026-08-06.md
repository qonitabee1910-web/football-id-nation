# G0 Amendments + PRG-VIS-001 (Stage 1 entry)

Council passed G0 with five amendments. This plan applies all five to the approved
artefacts, records the new constitutional principle, and produces the first Stage 1
artefact: Vision & Positioning.

All work is documentation under `docs/`. No application code, no database, no migration —
Stage 6 remains blocked.

## 1. Constitutional principle: The Child's Interest Prevails

Add as principle #6 to the standing constraints in `docs/governance/council.md`, and as a
tie-breaker rule in `docs/governance/decision-rules.md`:

> Where the interests of Organization, Coach, Guardian, Sponsor, or Association conflict,
> the decision that best protects the child Player prevails.

Add it to the universal checklist in `docs/quality-gates.md` so every future gate tests
against it, and to the Core section of project memory so it governs every response.

## 2. PRG-MET-001: six-state player lifecycle

Replace the four states (ACTIVE / LAPSING / DORMANT / NEVER_ACTIVE) with the Council's
sequence, keeping each state machine-computable rather than descriptive:

```text
REGISTERED -> VERIFIED -> ACTIVE -> TEMPORARILY_INACTIVE -> INACTIVE -> ARCHIVED
```

Each state gets an entry condition, an exit condition, and a re-entry path (players return;
the machine is not one-directional). `NEVER_ACTIVE` is retained as a derived flag on
REGISTERED/VERIFIED rather than a state, because it remains the registration-inflation
guard for the North Star.

`TEMPORARILY_INACTIVE` is the state that distinguishes a player on school holiday from a
player who quit — it is entered on lapse and on transfer-in-progress, and exits back to
ACTIVE without re-verification.

## 3. PRG-MET-001: ActivityPolicy becomes configurable

Convert the 90-day rule from a constant into a named, versioned policy object with a
national default and per-scope overrides:

```text
ActivityPolicy
  policy_id, version, scope (GLOBAL | ASSOCIATION | COMPETITION)
  rolling_window_days          default 90
  minimum_events               default 2
  minimum_distinct_dates       default 2
  adult_attestation_required   default true
  seasonal_adjustment_days     default 180
  temporarily_inactive_after_days
  inactive_after_days
  archived_after_days
```

Rules to state explicitly: exactly one GLOBAL policy is active at a time; every reported
VAP figure carries the `policy_id@version` used to compute it, so numbers from different
policies are never compared silently; policy changes are forward-only and never retro-alter
a published figure.

## 4. CONSENT-001: add P8_AI_MODEL_IMPROVEMENT

Add an eighth purpose to the closed list, with the strictest settings on the list:

- Opt-in, off by default, never required to use the platform.
- Requires guardian verification L2.
- Unavailable for under-13 regardless of guardian level (matching P5).
- Revocation removes the Person from future training sets and from the next retraining
  cycle; state a retraining SLA rather than claiming instant removal from a trained model.
- Covers Player Development AI, Coach Assistant, Scouting AI, Analytics, and Training
  Recommendation. Any AI use outside this list needs a new purpose and a revised artefact.
- Distinct from P7_ANALYTICS: P7 is de-identified aggregate reporting, P8 is row-level data
  entering a model. Grant of P7 never implies P8.

New event `AITrainingSetMembershipChanged`. Add an acceptance criterion for the under-13
prohibition and one for revocation-to-retraining.

## 5. CONSENT-001: high-risk revocation flow

Revocation stays immediate — the flow adds notification and audit, never a hold.

Classify a revocation as high-risk when the Person is in an active competition squad, an
in-flight scouting exposure, or an in-flight federation submission. High-risk revocations:
take effect immediately, emit `HighRiskConsentRevoked`, notify Guardian, the affected
Organization, and the Association, and enter a review queue for operational follow-up
(squad withdrawal, media takedown, submission recall).

Add a rule that the review queue can never reverse or delay the revocation, and an
acceptance criterion proving effect precedes notification.

## 6. PRG-VIS-001 — Vision & Positioning (new artefact)

New file `docs/vision/PRG-VIS-001-vision-positioning.md`, Stage 1 entry, with the nine
sections the Council named: Vision Statement, Mission, North Star, Strategic Principles,
Target Stakeholders, Value Proposition, Non-Goals, Strategic Boundaries, Success Metrics.

Content anchors: North Star references PRG-MET-001 rather than restating the rule;
Strategic Principles are the five non-negotiables plus The Child's Interest Prevails;
Non-Goals state plainly what this is not (not an SSB management tool, not a social network,
not a marketplace, not a talent-agency intermediary); Strategic Boundaries state the
national scaling path Sulsel -> Indonesia Timur -> Nasional and the Identity-before-
Competition sequencing; Success Metrics are time-bound and tied to the VAP counting rule.

## 7. Registry and index updates

- `docs/artefact-registry.md`: ADR-0002, PRG-MET-001, CONSENT-001 -> APPROVED with G0
  PASSED; add PRG-VIS-001 as DRAFT (Stage 1, G1).
- `docs/adr/README.md`: ADR-0002 -> ACCEPTED.
- `docs/README.md`: current position -> Stage 1, G0 passed.
- `docs/glossary.md`: add the six lifecycle states, ActivityPolicy, and P8 terms.
- Project memory: record the new principle and the amended specs.

## Technical notes

Everything here is markdown under `docs/`. The lifecycle states and ActivityPolicy fields
are specified as a data contract for the Stage 3 ERD; no tables are created now. P8 and the
high-risk revocation flow add columns and events to the CONSENT-001 model that the Stage 3
RLS design will have to enforce, so both are written as testable invariants rather than
prose.
