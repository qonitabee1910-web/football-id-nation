# PRG-VIS-001 rev. 3 — Confirmed Phase Targets, G1 Closure

The Council has supplied the target numbers. This revision replaces every `TBC` in the
target matrix with the confirmed figures, aligns the three KPI definitions with the
Council's wording, and closes the open G1 condition. Documentation only — Stage 6
remains blocked.

## 1. Phase naming and numbering

Adopt the Council's numbering alongside the existing names:

```text
Phase 0 Founding Network -> Phase 1 Sulsel Pilot -> Phase 2 Regional Scale
     -> Phase 3 Provincial Coverage -> Phase 4 National Expansion
```

Each phase keeps its scope, entry condition, and exit condition; the exit condition of
one is the entry condition of the next. Phase intent is recorded per the Council:
Phase 0 proves the operational process, not scale; Phase 1 is where network effect
first becomes measurable.

## 2. Confirmed target matrix (§10.1)

| KPI | P0 Founding | P1 Pilot | P2 Regional | P3 Provincial | P4 National |
| --- | --- | --- | --- | --- | --- |
| SSB / Organizations | 10 | 30 | 100 | derived | pending |
| Competitions | 3 | 10 | 40 | derived | pending |
| Coaches | 80 | derived | derived | derived | pending |
| Referees | 25 | derived | derived | derived | pending |
| Verified Guardians | 1,200 | 4,000 | derived | derived | pending |
| Verified Players | 1,500 | 5,000 | 15,000 | 50,000 | pending |
| **VAP (North Star)** | 800 | 2,500 | 8,000 | 25,000 | pending |

Cells the Council did not specify are marked explicitly rather than invented:
`derived` where the artefact can compute a floor from the ratios the Council did set,
`pending` for Phase 4 — the Council stated national targets begin only after the
provincial foundation is proven, so Phase 4 is intentionally unset and its targets are
a Phase 3 exit deliverable, not a blocker for G1.

Ratio observations recorded as design signals (not new targets): VAP/Verified Players
runs 53% → 50% → 53% → 50%, and Phase 0 guardians (1,200) to players (1,500) implies
multi-child households and near-total guardian coverage. Both are used as sanity checks
in later artefacts, and the implied `NEVER_ACTIVE` ceiling is stated per phase.

## 3. KPI definitions aligned to Council wording

Rewrite §9 so each KPI matches the Council's statement while staying computable:

- **NDI** — broadened from the earlier player-only definition to the Council's:
  connectedness across players, organizations, coaches, competitions, and activities.
  Specified as a graph-density measure over the entity network within a scope, with the
  earlier multi-organization portability measure retained as its headline sub-index.
- **JCS** — restated as the Council's percentage form: the share of players holding a
  complete journey across the four dimensions (identity, organization, activity,
  development). The weighted per-player score is retained as the underlying computation
  and the percentage is the reported figure, with a stated completeness threshold.
- **CTI** — restated as the Council's percentage form: the share of player data usable
  for its intended purpose because an active, valid consent covers it. The earlier
  composite becomes the supporting diagnostic set behind the headline percentage.

The data-minimisation guardrail on JCS and the halt semantics on CTI are preserved.
Phase-level targets for NDI, JCS, and CTI are marked `to be set at Phase 0 baseline` —
they are ratio metrics with no meaningful pre-launch target, and the artefact says so
rather than guessing.

## 4. Gate and registry closure

- `PRG-VIS-001` → rev. 3, status `APPROVED`, with the confirmation date recorded.
- `docs/artefact-registry.md` → PRG-VIS-001 APPROVED, **G1 PASSED** for the programme
  vision row.
- `docs/quality-gates.md` → G1 evidence noted against the phase-target checklist item.
- `docs/glossary.md` → phase names updated to include Phase 0–4 numbering.
- Project memory → record the confirmed figures so no later artefact re-proposes them.

## 5. What unblocks

With G1 open, the next artefacts are `PRG-STK-001` (Stakeholder Map) and `IDN-PRD-001`
(Identity PRD). Both now have concrete Phase 0 volumes to design against: 10 SSBs,
80 coaches, 25 referees, 1,200 guardians, 1,500 players.

## Technical notes

Phase targets are written as a data contract the Stage 3 ERD must be able to report
against: each KPI names its inputs and its scope dimension, so the metric can be derived
from event data rather than maintained by hand. Every reported figure continues to carry
its `ActivityPolicy policy_id@version`.
