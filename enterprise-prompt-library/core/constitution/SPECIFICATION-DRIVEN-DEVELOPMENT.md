---
id: EPOS-CORE-CON-003
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001, EPOS-CORE-CON-002]
---

# Specification-Driven Development

## Purpose

Define what constitutes a specification under EPOS, the ordered chain of
artefacts a specification is built from, what "approved" means, and the
mandatory AI behaviour when a specification is incomplete.

## Scope

All work items from initial vision through release, for every bounded
context and every assistant.

## Inputs

- A stated business need or change request
- The current artefact set for the affected bounded context

## Outputs

- A complete, approved artefact chain, or an explicit refusal per
  `core/workflow/REFUSAL-PROTOCOL.md`

## Dependencies

- `core/constitution/CONSTITUTION.md` (Article 1, 3, 4, 5)
- `core/workflow/WORKFLOW.md`
- `core/traceability/TRACEABILITY.md`

## Rules

### What a specification is

A specification is a versioned, identified, approved artefact that states
intent, constraints, and acceptance criteria precisely enough that two
independent implementers would produce interoperable results. A Slack
message, a verbal instruction, or an inferred assumption is never a
specification.

### The artefact chain

Specification is not one document; it is a chain, each link a prerequisite
for the next:

| # | Artefact | States |
| --- | --- | --- |
| 1 | Vision | Why the capability exists, who it serves |
| 2 | Stakeholders | Who is accountable, consulted, informed |
| 3 | PRD (Product Requirement Document) | Functional requirements (FR-*), business rules (BR-*) |
| 4 | ADR (Architecture Decision Record) | Structural decisions and their alternatives |
| 5 | Domain Model | Bounded contexts, aggregates, invariants (INV-*) |
| 6 | Events | Domain events (EVT-*), past tense, who reacts |
| 7 | Journeys | End-to-end actor flows crossing screens and services |
| 8 | CDM (Canonical Data Model) | Business-meaning entities, enterprise-wide |
| 9 | LDM (Logical Data Model) | Normalised entities, relationships, keys |
| 10 | PDM (Physical Data Model) | Tables, columns, types, indexes, constraints |
| 11 | API Contract | Endpoints/commands/queries, schemas, error codes |
| 12 | UX Specification | Screens (SCR-*), states, accessibility requirements |
| 13 | Implementation Plan | Task breakdown mapped to FR/BR/INV/EVT IDs |
| 14 | Release Notes | What shipped, versioned, mapped to the above |

Each link must exist and be approved before the next is authored. Skipping a
link is an Article 7 (Stage Gate Discipline) violation.

### Definition of "approved"

An artefact is approved when all of the following hold:

1. It carries `status: ACCEPTED` (or the workflow-specific equivalent) in its
   front matter.
2. The accountable approver named in `core/workflow/APPROVAL-GATES.md` has
   recorded approval with a date and evidence reference.
3. It has passed the quality gate checklist for its stage in
   `core/quality-gates/QUALITY-GATES.md` with verdict PASS or CONDITIONAL PASS
   with all conditions closed.
4. It contains no unresolved `TBD`, `TODO`, or open question.
5. It is traceable per `core/traceability/TRACEABILITY.md`.

A draft, a "looks good to me" comment, or an unreviewed pull request does not
satisfy approval.

### What an AI does when the specification is incomplete

1. Identify precisely which link in the chain is missing or unapproved.
2. Do not infer the missing content and proceed as if it existed.
3. Do not generate a "reasonable default" specification silently and build
   against it.
4. Emit the refusal template defined in `core/workflow/REFUSAL-PROTOCOL.md`,
   naming the missing artefact, the rule violated, and the shortest unblock
   path.
5. Offer to author the missing artefact itself, explicitly labelled as a
   draft pending approval, if the requester wants that path.
6. Continue only on artefacts unaffected by the gap, never on the blocked
   capability.

## Constraints

- The chain order is fixed; contexts may run stages in parallel only where
  `core/workflow/WORKFLOW.md` explicitly allows concurrency.
- No artefact may restate another artefact's content instead of referencing
  it (Article 4).

## Success Criteria

- Every implementation task can be traced to an approved artefact at every
  link of the chain.
- No code exists whose originating PRD, ADR, or contract cannot be named.

## Failure Conditions

- Code merged referencing a PRD still in draft.
- An API implemented before its contract was approved.
- A "spec" that is a single paragraph with no acceptance criteria.

## Examples

**Conformant:** "PRD-042 (Refunds) is ACCEPTED but no ADR covers the refund
ledger. I will draft ADR-019 for review before touching the schema."

**Conformant:** "The journey for guardian consent withdrawal is missing.
I can draft it now as a proposal; implementation is blocked until it is
approved."

## Anti-patterns

- Writing code first and back-filling a PRD to match it.
- Treating an ADR as optional for "small" architectural changes.
- Approving your own draft specification.

## References

- `core/constitution/CONSTITUTION.md`
- `core/workflow/WORKFLOW.md`
- `core/workflow/APPROVAL-GATES.md`
- `core/workflow/REFUSAL-PROTOCOL.md`
- `core/traceability/TRACEABILITY.md`
