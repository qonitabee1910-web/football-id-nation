# PRG-VIS-001 rev. 2 — Phased Targets + Strategic KPIs

Council approved the Vision architecturally. This revision replaces the three-horizon
metric table with a five-phase ramp and adds three strategic KPIs. All work is
documentation under `docs/`. No code, no schema — Stage 6 remains blocked.

## 1. Five-phase target model (replaces §9 table)

```text
Founding -> Pilot -> Regional -> Provincial -> National
```

Each phase gets: scope (geography + organizations), duration, entry condition,
exit condition, and a target row per metric. Exit condition of a phase is the
entry condition of the next — no phase is declared complete on date alone.

| Phase | Scope | Purpose |
| --- | --- | --- |
| Founding | 1 city, hand-picked SSBs | Prove the identity + consent loop end to end |
| Pilot | Sulawesi Selatan | Prove repeatability without founder involvement |
| Regional | Indonesia Timur | Prove multi-association operation |
| Provincial | 12 provinces | Prove federation-grade data quality |
| National | Nasional | Prove scale economics |

Metrics carried across every phase: Verified Active Players, participating
organizations, `NEVER_ACTIVE` share, guardian-verified rate, median
registration-to-first-activity, plus the three new KPIs below.

All numeric targets are entered as `TBC — business decision` placeholders.
G1 cannot pass until the Council confirms them; that is stated as the explicit
G1 blocking condition.

## 2. Network Density Index (NDI)

Measures whether the ecosystem is a network or a set of isolated silos.

- Definition: share of ACTIVE players whose Journey contains verified activity
  recorded by two or more distinct Organizations, within a scope.
- Why it matters: portability is the core promise; NDI is the only metric that
  proves it happened in production rather than on paper.
- Computed per scope (city / association / province / national) and always
  reported with the `ActivityPolicy policy_id@version` used, matching PRG-MET-001.
- Anti-gaming: the two Organizations must be independently administered; activity
  recorded by the same accountable adult does not count as two.

## 3. Journey Completeness Score (JCS)

Measures whether a Football ID is a real record or an empty shell.

- Definition: per-player weighted completeness across identity, guardian
  verification, membership, activity history, and assessment coverage; reported
  as a population median and a distribution, never as a bare average.
- Component weights are a versioned policy object (`JourneyCompletenessPolicy`),
  same pattern as ActivityPolicy — configurable, never hard-coded.
- Guardrail: JCS must never reward collecting more child data than a purpose
  requires. Data-minimisation check written into the definition, so a high JCS
  cannot be achieved by over-collection.

## 4. Consent Trust Index (CTI)

Measures whether guardians actually trust the platform, not just tolerate it.

- Composite of: guardian-verified rate, voluntary opt-in rate on non-essential
  purposes, consent revocation rate (inverted), high-risk revocation count
  (inverted), and data-access-request fulfilment within SLA.
- Falling CTI is a halt signal, not a dashboard number: a defined floor triggers
  Council review regardless of VAP performance.
- Ties directly to CONSENT-001 purposes P1–P8 and the high-risk revocation flow.

## 5. Counter-metric and guardrail alignment

Existing counter-metrics stay. The guardrails section is restated so the
relationship is unambiguous: NDI, JCS, CTI qualify the North Star; they never
substitute for it, and no phase may be exited on KPI strength while a guardrail
(zero unauthorised minor-data disclosure, zero under-13 scouting exposure) is
breached.

## 6. Registry, glossary, and gate updates

- `docs/vision/PRG-VIS-001-vision-positioning.md` → rev. 2, status
  `APPROVED (architecture) / PENDING TARGET CONFIRMATION`.
- `docs/artefact-registry.md` → record the architectural approval and the single
  open G1 condition (phase target numbers).
- `docs/glossary.md` → add Founding/Pilot/Regional/Provincial/National phases,
  NDI, JCS, CTI, JourneyCompletenessPolicy.
- `docs/quality-gates.md` G1 → add a checklist item that every phase target is a
  confirmed business decision, not a proposal.

## 7. What comes after

Once the Council returns the numbers, PRG-VIS-001 goes to APPROVED and G1 opens
for `PRG-STK-001` (Stakeholder Map) and `IDN-PRD-001` (Identity PRD).

## Technical notes

NDI, JCS, and CTI are specified as computable definitions with named inputs so the
Stage 3 ERD can derive them from event data rather than from a reporting-only table.
Each carries a policy version in its output, consistent with the PRG-MET-001 rule
that no figure is comparable across policy versions.
