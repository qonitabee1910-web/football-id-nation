# Decision Rules

## Rule 0 — The Child's Interest Prevails (overriding)

Where the interests of Organization, Coach, Guardian, Sponsor, or Association
conflict, the decision that best protects the child Player prevails. This rule
overrides every rule below it and cannot be traded away by an ADR; an ADR may
only document *how* the child's interest is protected, never that it was
subordinated.

When two or more options are viable, choose in this priority order:

1. **Nationally scalable** — works from Sulawesi Selatan to Indonesia Timur to Nasional.
2. **Integrable with PSSI / Asprov / Askab** — federation-ready data and identifiers.
3. **Safest for child data** — minimisation, consent, guardian control.
4. **Most auditable** — event trail, immutable history, clear provenance.
5. **Most consistent with Football ID as single source of truth.**

If a lower rule contradicts a higher rule, the higher rule wins and the
trade-off is recorded in an ADR. Rule 0 outranks all five.

## Tie-break heuristics

- Prefer **additive** schema/contract change over breaking change.
- Prefer **event emission** over cross-context synchronous coupling.
- Prefer **explicit consent record** over implied permission.
- Prefer **portable history** over organization-scoped data ownership.
- Prefer **fewer identities** over convenience-driven duplication.

## North Star test

Every decision must answer: *does this increase Verified Active Players*
(Football ID + Guardian Verified + Active Football Activity)? If not, state why
it is still necessary (compliance, safety, enablement) or drop it.
