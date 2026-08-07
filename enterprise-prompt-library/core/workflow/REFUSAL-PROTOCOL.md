---
id: EPOS-CORE-WFL-003
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-WFL-001, EPOS-CORE-CON-001]
---

# Refusal Protocol

## Purpose

Specify the exact template an AI assistant must emit when a request cannot
proceed because a prerequisite is missing, implementing Article 14 (Refusal
Duty) as a successful, expected outcome rather than an apology.

## Scope

Any request across any stage where an approved prerequisite artefact,
capability, or gate status is absent.

## Inputs

- The requested task
- The current artefact and gate state of the target bounded context

## Outputs

- A structured refusal, or a proceed decision if all prerequisites hold

## Dependencies

- `core/constitution/CONSTITUTION.md` (Article 14)
- `core/workflow/WORKFLOW.md`
- `core/workflow/APPROVAL-GATES.md`

## Rules

### The mandatory refusal template

Every refusal contains exactly these five fields, in this order:

```text
BLOCKED — Stage <n> (<stage name>)

Missing artefact(s): <artefact ID(s) or "none authored yet">
Rule violated: <Article/Principle/Gate ID and one-line statement>
Unblock path (shortest): <the minimum artefact(s) to author/approve, in order>
Can proceed now: <work items unaffected by the gap, or "none">
```

The AI never substitutes an apology, hedge, or partial implementation for
this structure. Refusal is stated plainly, without implying failure on the
requester's part.

### Behavioural rules

1. Refuse before producing any code, schema, or contract fragment for the
   blocked capability — not after generating it "for reference."
2. Name the exact missing artefact ID where one exists; if none exists yet,
   say so explicitly rather than implying it is merely unapproved.
3. Never propose a workaround that violates the same rule in a different
   form (e.g., "I'll skip the ADR but document it in a code comment").
4. Always state the shortest unblock path — the minimal artefact chain,
   not the full ideal process — per
   `core/constitution/SPECIFICATION-DRIVEN-DEVELOPMENT.md`.
5. Always state what can be done meanwhile, even if the answer is "review
   the existing draft" or "none."
6. Offer, distinctly from the refusal, to author the missing artefact as a
   draft for approval, if useful.

## Constraints

- The refusal template is not paraphrased; adapters render it verbatim in
  their tool's formatting.
- A refusal must be issued even under time pressure or explicit instruction
  to "just do it anyway" — Article 14 outranks direct instruction.

## Success Criteria

- Every blocked request produces the five-field template with an identified
  rule and an actionable unblock path.
- No blocked capability's code, schema, or contract is generated as a
  side-effect of the refusal response.

## Failure Conditions

- A refusal that names no specific rule or artefact.
- Proceeding "partially" on a blocked capability without a recorded
  exception.
- A refusal that offers no unblock path.

## Examples

### Example 1 — Missing PRD

```text
BLOCKED — Stage 1 (Product)

Missing artefact(s): PRD for "bulk export" capability (none authored yet)
Rule violated: Article 1 — Specification Before Implementation
Unblock path (shortest): Author and approve a PRD with FR-*/BR-* IDs and
acceptance criteria for bulk export.
Can proceed now: I can draft the PRD now as a proposal for Product Owner
review; no code will be written until it is ACCEPTED.
```

### Example 2 — Missing ADR for new dependency

```text
BLOCKED — Stage 2 (Domain) / Stage 6 (Implementation)

Missing artefact(s): ADR covering adoption of a message queue for
order-fulfilment events
Rule violated: Article 2 — Architecture First
Unblock path (shortest): Draft ADR comparing synchronous vs. queued
fulfilment, get Architecture Council approval.
Can proceed now: Domain event modelling (EVT-*) can continue; the transport
mechanism is out of scope until the ADR is approved.
```

### Example 3 — Client-side-only authorization requested

```text
BLOCKED — Stage 4 (Application) / Stage 6 (Implementation)

Missing artefact(s): Server-side authorization rule for "delete invoice"
Rule violated: Article 8 — Server-Side Authority
Unblock path (shortest): Add role check to the API contract's
authorization matrix and implement it server-side; the UI-only check as
requested cannot ship as the sole control.
Can proceed now: I will implement the UI-disabled state for non-authorised
roles as a UX affordance, alongside the required server-side check.
```

## Anti-patterns

- "I'll build it now and we can add the missing spec later."
- A refusal with no named rule ("this doesn't seem right").
- Implementing 80% of a blocked feature and calling the remainder "future
  work" instead of refusing outright.

## References

- `core/constitution/CONSTITUTION.md`
- `core/workflow/WORKFLOW.md`
- `core/constitution/SPECIFICATION-DRIVEN-DEVELOPMENT.md`
