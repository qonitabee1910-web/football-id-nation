---
id: EPOS-CORE-AIG-002
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-AIG-001]
---

# AI Output Format

## Purpose

Fix the mandatory response preamble and the fourteen-section feature output
format so that any assistant's output is structurally identical, satisfying
Article 6 (Explainability) and Article 13 (Determinism of Governance).

## Scope

Every substantive response that proposes, designs, or implements a
capability change.

## Inputs

- The task and its resolved Stage/Gate context

## Outputs

- A response beginning with the mandatory preamble, and, for feature work,
  the fourteen-section format

## Dependencies

- `core/ai-governance/AI-BEHAVIOUR.md`
- `core/workflow/WORKFLOW.md`
- `core/traceability/TRACEABILITY.md`

## Rules

### Mandatory response preamble

Every response opens with:

```text
Stage: <0-7 name>
Bounded Context: <name>
Prerequisites: <artefact IDs relied upon, with status> | "none required"
Artefacts produced: <IDs of new/updated artefacts this response creates>
Quality Gate: <Gn> — <PASS | CONDITIONAL PASS | FAIL | not yet evaluated>
```

If any prerequisite is missing, the preamble is replaced by the
`core/workflow/REFUSAL-PROTOCOL.md` template instead.

### The fourteen-section feature output format

Used for any response that specifies or implements a feature. Sections
appear in this order; a section stating "None" is acceptable but must not
be omitted.

1. **Objective** — one paragraph, the specific outcome this response
   delivers, tied to an FR-* ID.
2. **Business Problem** — the problem this solves and for whom, tied to the
   PRD.
3. **Stakeholders** — accountable/consulted/informed per
   `core/workflow/APPROVAL-GATES.md`.
4. **Business Rules** — enumerated BR-* rules this feature must satisfy.
5. **Domain Model** — bounded context and aggregates touched.
6. **Entities & Value Objects** — new/changed entities and value objects
   with invariants (INV-*).
7. **Aggregate** — the aggregate root and its consistency boundary.
8. **Domain Events** — EVT-* events emitted, past tense, with payload
   shape.
9. **API Contract** — endpoints/commands/queries touched, request/response
   schema, error codes.
10. **Database Impact** — tables/columns affected, migration summary,
    reversibility.
11. **UI Impact** — screens (SCR-*) affected, states added/changed.
12. **Security & RLS Impact** — authorization rules, row-level security
    policies, data exposure changes.
13. **Acceptance Criteria** — testable, enumerated, mapped to BR-*/FR-*.
14. **Implementation Checklist** — ordered task list mapped to the IDs
    above, each item markable done/not-done.

### Per-section rules

- Section 1 (Objective) never contains implementation detail.
- Section 4 (Business Rules) cites existing BR-* IDs; new rules are marked
  `PROPOSED-BR-*` pending approval.
- Section 8 (Domain Events) names are past tense verbs (`InvoiceIssued`,
  never `IssueInvoice`).
- Section 9 (API Contract) states error codes explicitly; "standard errors"
  is not acceptable.
- Section 10 (Database Impact) states reversibility explicitly: reversible,
  reversible-with-data-loss, or irreversible-with-justification.
- Section 12 (Security & RLS Impact) is never "None" for any endpoint that
  reads or writes data scoped to a specific actor.
- Section 14 (Implementation Checklist) items each carry a traceability ID
  from `core/traceability/TRACEABILITY.md`.

## Constraints

- The format is not reordered or renamed by adapters.
- A response that changes only documentation may omit sections 5–12 but
  must state "N/A — documentation only" rather than deleting the headings.

## Success Criteria

- Any two reviewers can locate the security impact of a change in the same
  section number across every response.
- Every acceptance criterion in section 13 traces to a business rule in
  section 4.

## Failure Conditions

- A response with sections reordered, merged, or omitted without
  justification.
- Section 12 marked "None" for a data-mutating endpoint.
- Domain events named in imperative form.

## Examples

**Conformant:** Section 8 lists `RefundIssued { refundId, orderId, amount,
issuedAt }`, not `IssueRefund`.

**Conformant:** Section 10 states "Reversible: adds nullable column
`refund_reason`; rollback drops the column with no data loss to existing
rows."

## Anti-patterns

- Skipping the preamble because "it's just a quick fix."
- Combining Database Impact and API Contract into one section for brevity.
- Marking Security & RLS Impact "None" without checking the endpoint's
  actor scoping.

## References

- `core/ai-governance/AI-BEHAVIOUR.md`
- `core/workflow/WORKFLOW.md`
- `core/traceability/TRACEABILITY.md`
- `core/workflow/REFUSAL-PROTOCOL.md`
