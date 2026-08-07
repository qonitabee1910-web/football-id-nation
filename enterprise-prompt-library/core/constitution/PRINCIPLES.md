---
id: EPOS-CORE-CON-002
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Engineering Principles

## Purpose

Translate the fifteen Articles of `core/constitution/CONSTITUTION.md` into
enduring engineering principles that any AI assistant can apply to a concrete
task without re-deriving constitutional reasoning each time.

## Scope

Applies to every artefact and every line of code produced under EPOS, across
all stages G0–G7 and all adapters.

## Inputs

- `core/constitution/CONSTITUTION.md`
- The bounded context and stage of the current task

## Outputs

- A principle-conformant design or refusal citing the violated principle

## Dependencies

- `core/constitution/CONSTITUTION.md` (Articles 0–14, supreme)
- `core/workflow/WORKFLOW.md`
- `core/quality-gates/QUALITY-GATES.md`

## Rules

Each principle below states: the statement, its rationale, what it forbids,
and how it is verified.

### 1. Specification-Driven

**Statement.** No implementation begins without an approved specification for
the exact capability being built (Article 1).
**Rationale.** Specifications are cheaper to correct than code and create the
traceable intent that later verification depends on.
**Forbids.** "Build it and we'll write the spec after"; inferring requirements
from code comments; treating a chat message as a specification.
**Verified by.** G0–G4 gate checklists; presence of an approved artefact ID
referenced in the commit.

### 2. Architecture-First

**Statement.** Structural decisions precede design decisions; design precedes
code (Article 2).
**Rationale.** Reversing this order embeds architecture inside implementation
details, making it invisible and unreviewable.
**Forbids.** Introducing a new service, queue, or storage technology inside a
feature branch without an ADR.
**Verified by.** ADR existence check at G1; architecture conformance review at
G6.

### 3. Contract-First

**Statement.** API, event, and data contracts are authored and approved before
the code that satisfies them (Article 3).
**Forbids.** Generating an OpenAPI file by introspecting running code;
renaming a field in code without updating the contract first.
**Verified by.** Contract diff review at G4; contract-to-code conformance test
at G6.

### 4. Domain-Driven

**Statement.** Business language, bounded contexts, aggregates, and invariants
are modelled explicitly before persistence or transport concerns.
**Rationale.** A domain model that leaks into infrastructure naming causes
Single Source of Truth violations (Article 4).
**Forbids.** Naming tables or endpoints after database convenience rather
than ubiquitous language; anaemic models with logic in controllers.
**Verified by.** Domain model review at G2; naming conformance at G6.

### 5. Secure-by-Default

**Statement.** Every capability is denied until explicitly authorised, and
authorization is enforced server-side (Article 8).
**Forbids.** Client-only role checks; default-allow endpoints; trusting
client-supplied identifiers for authorization decisions.
**Verified by.** `core/ai-governance/SECURITY-PRINCIPLES.md` checklist at G4
and G6.

### 6. Privacy-by-Architecture

**Statement.** Data minimisation and consent are structural properties of the
schema, API, and role model, not runtime checks (Article 9).
**Forbids.** Storing a field "just in case"; a capability that is
permission-denied but still present in the schema.
**Verified by.** `core/ai-governance/PRIVACY-PRINCIPLES.md` checklist at G3.

### 7. Observable

**Statement.** Errors are typed, surfaced, and logged; state changes are
traceable to their cause (Article 11).
**Forbids.** Swallowed exceptions, silent retries without logging, fabricated
success responses.
**Verified by.** No-silent-failure checklist at G6.

### 8. Reversible

**Statement.** Every change carries a rollback or compensating path and a
migration guide for breaking changes (Article 12).
**Forbids.** Irreversible destructive migrations without a backup or
compensating script.
**Verified by.** `release/rollback/` review at G7.

### 9. Least-Change

**Statement.** An assistant changes only what the task authorises (Article
10).
**Forbids.** Drive-by refactors, renames, or dependency bumps outside task
scope.
**Verified by.** Diff review against task scope at every gate.

### 10. Explainable

**Statement.** Every output states what was decided, why, the authorising
rule, and what was rejected (Article 6).
**Forbids.** Unexplained architectural choices; "trust me" outputs.
**Verified by.** `core/ai-governance/AI-OUTPUT-FORMAT.md` preamble presence.

## Constraints

- Principles never override Articles; they operationalise them.
- A principle conflict is resolved by `core/decision-rules/DECISION-RULES.md`.

## Success Criteria

- Every design review cites the principle it satisfies.
- No artefact contradicts a principle without a recorded exception decision.

## Failure Conditions

- A principle is cited that has no corresponding Article.
- Two principles are applied inconsistently across bounded contexts.

## Examples

**Conformant:** "Adding `soft_delete_at` requires a data model ADR (Principle
2, Architecture-First) before the migration is written."

**Conformant:** "The `isAdmin` flag stays in Redux for display only; the
delete endpoint re-checks role server-side (Principle 5)."

## Anti-patterns

- Treating principles as optional style preferences.
- Applying a principle literally while violating its rationale.
- Citing a principle without naming the Article it derives from.

## References

- `core/constitution/CONSTITUTION.md`
- `core/constitution/SPECIFICATION-DRIVEN-DEVELOPMENT.md`
- `core/decision-rules/DECISION-RULES.md`
