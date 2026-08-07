---
id: EPOS-CORE-DEC-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Decision Rules

## Purpose

Provide an ordered, deterministic tie-breaker sequence for resolving
conflicts between valid engineering options, implementing Article 0 and
Article 13 (Determinism of Governance).

## Scope

Any decision point where two or more architecturally, domain, or
implementation options each satisfy stated requirements but conflict with
each other.

## Inputs

- A decision with two or more viable options
- The bounded context's risk classification (does it touch minors/vulnerable
  parties, sensitive data)

## Outputs

- A ranked decision with rationale traceable to the tie-breaker that decided
  it

## Dependencies

- `core/constitution/CONSTITUTION.md` (Article 0 supreme)
- `core/traceability/EXPLAINABILITY.md`

## Rules

### The ordered tie-breakers

Apply in strict order; stop at the first rule that produces a clear winner.

1. **Rule 0 — Vulnerable party prevails.** Any option that better protects
   a child or vulnerable party's safety, privacy, or interest wins outright,
   regardless of cost, effort, or all other rules below.
2. **Scalability.** Prefer the option that sustains required load and growth
   without architectural rework.
3. **Integrability.** Prefer the option that integrates cleanly with
   existing bounded contexts and published contracts, minimising new
   coupling.
4. **Safety of sensitive data.** Prefer the option that reduces exposure,
   storage, or transmission of sensitive/regulated data.
5. **Auditability.** Prefer the option that produces a clearer, more
   complete audit trail of who did what and when.
6. **Single source of truth.** Prefer the option that avoids duplicating a
   fact or rule across systems.
7. **Reversibility.** Prefer the option that is easier to roll back or
   undo if it proves wrong.
8. **Simplicity.** Among remaining ties, prefer the option with the fewest
   moving parts, dependencies, and cognitive load.

If all eight tie-breakers remain tied, escalate to the Architecture Council
for a recorded human decision; an AI assistant does not guess.

### Worked evaluation matrix

Decision: "How should order confirmation be delivered to the customer?"
Options: (A) synchronous API response only; (B) synchronous response plus
async `OrderConfirmed` event triggering email/SMS; (C) fire-and-forget
webhook to a third-party marketing tool.

| Tie-breaker | Option A | Option B | Option C |
| --- | --- | --- | --- |
| 0. Vulnerable party | Neutral | Neutral | Risk: shares data with third party without minimisation review — eliminated |
| 1. Scalability | Weak (blocks on notification latency) | Strong (async) | N/A (eliminated) |
| 2. Integrability | Weak | Strong (published event reusable) | N/A |
| 3. Sensitive data safety | Neutral | Neutral | N/A |
| 4. Auditability | Weak | Strong (event log) | N/A |
| **Winner** | | **Option B** | |

Result: Option B wins at tie-breaker 1 after Option C is eliminated at Rule
0 for insufficient data minimisation review.

## Constraints

- Rule 0 cannot be traded off against cost, timeline, or convenience under
  any circumstance.
- The tie-breaker sequence itself is not reorderable per decision; reorder
  requires a Constitution amendment.
- Every decision produced this way is recorded per
  `core/traceability/EXPLAINABILITY.md`.

## Success Criteria

- Two independent reviewers applying this sequence to the same options reach
  the same ranked decision.
- Every architecturally significant decision cites the deciding tie-breaker
  number.

## Failure Conditions

- A decision justified by "team preference" with no tie-breaker cited.
- Rule 0 overridden by a cost or deadline argument.
- A decision record that cites a tie-breaker not actually decisive (post-hoc
  rationalisation).

## Examples

**Conformant:** "Option C is eliminated at Rule 0 (vulnerable party data
minimisation); Option B wins at Rule 1 (scalability)."

**Conformant:** "Both options tie through Rule 6; Option A wins at Rule 7
(reversibility) because its migration is additive-only."

## Anti-patterns

- Applying tie-breakers out of order to reach a preferred conclusion.
- Skipping Rule 0 because "this feature doesn't involve children" without
  checking the actual user base.
- Declaring a decision "obvious" without running the matrix when options
  genuinely conflict.

## References

- `core/constitution/CONSTITUTION.md`
- `core/traceability/EXPLAINABILITY.md`
- `core/architecture/ARCHITECTURE-RULES.md`
