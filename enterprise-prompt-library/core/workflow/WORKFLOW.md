---
id: EPOS-CORE-WFL-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001, EPOS-CORE-CON-003]
---

# EPOS Workflow

## Purpose

Define the eight ordered stages every capability passes through, from vision
to release, with entry conditions, activities, artefacts, exit gates, and
prohibited outputs per stage, implementing Article 7 (Stage Gate Discipline).

## Scope

All bounded contexts, all assistants, all repositories under EPOS governance.

## Inputs

- A business need, change request, or incident driving new work
- Current artefact and gate status of the target bounded context

## Outputs

- A stage-appropriate artefact set, or a refusal if entry conditions fail

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `core/workflow/APPROVAL-GATES.md`

## Rules

### Stage 0 — Vision

**Entry conditions.** A named business sponsor and a problem statement exist.
**Activities.** Define why the capability should exist, who benefits, success
metrics, and out-of-scope boundaries.
**Artefacts.** Vision document, success metrics, stakeholder map draft.
**Exit gate.** G0 Business Integrity.
**Prohibited outputs.** Feature lists, UI mockups, technology choices.

### Stage 1 — Product

**Entry conditions.** G0 PASS.
**Activities.** Elaborate stakeholders, author PRD with FR-*/BR-* IDs,
define acceptance criteria and non-functional requirements.
**Artefacts.** Stakeholder register, PRD, NFR register.
**Exit gate.** G0 close-out review (PRD accepted before G1 architecture work
starts).
**Prohibited outputs.** Database schemas, API contracts, code.

### Stage 2 — Domain

**Entry conditions.** PRD ACCEPTED.
**Activities.** Model bounded contexts, aggregates, invariants (INV-*),
domain events (EVT-*, past tense), and end-to-end journeys.
**Artefacts.** Domain model, event catalogue, journey maps.
**Exit gate.** G2 Domain Integrity.
**Prohibited outputs.** Table definitions, endpoint paths, UI components.

### Stage 3 — Data

**Entry conditions.** G2 PASS and at least one ADR for storage strategy.
**Activities.** Build Canonical, Logical, and Physical Data Models; define
retention classes and privacy classification.
**Artefacts.** CDM, LDM, PDM, retention/classification register.
**Exit gate.** G3 Data Integrity.
**Prohibited outputs.** Application code, API implementations.

### Stage 4 — Application

**Entry conditions.** G3 PASS.
**Activities.** Author API/event/command/query contracts, authorization
model, integration patterns.
**Artefacts.** API contract, authorization matrix, integration design.
**Exit gate.** G4 Application Integrity.
**Prohibited outputs.** Frontend components, styling, copy.

### Stage 5 — UX

**Entry conditions.** G4 PASS.
**Activities.** Define screen catalogue (SCR-*), states, accessibility
requirements, content design.
**Artefacts.** UX specification, design system references, accessibility
checklist.
**Exit gate.** G5 UX Integrity.
**Prohibited outputs.** Production code, database migrations.

### Stage 6 — Implementation

**Entry conditions.** G5 PASS.
**Activities.** Write code, migrations, tests, observability
instrumentation, all mapped to FR/BR/INV/EVT/SCR IDs.
**Artefacts.** Source code, test suite, migration scripts, traceability
matrix entries.
**Exit gate.** G6 Implementation Integrity.
**Prohibited outputs.** New unapproved architecture, unapproved schema
changes, undocumented dependencies.

### Stage 7 — Release

**Entry conditions.** G6 PASS.
**Activities.** Readiness review, rollback plan, release notes, migration
runbook, post-release monitoring plan.
**Artefacts.** Release notes, rollback plan, deployment checklist.
**Exit gate.** G7 Release Integrity.
**Prohibited outputs.** New feature scope introduced at release time.

## Constraints

- Stages execute in order; concurrency between Stage 3 and Stage 4 is
  permitted only for independent sub-capabilities with no shared contract.
- No stage may be marked complete without its gate verdict recorded per
  `core/quality-gates/QUALITY-GATES.md`.
- Re-entry into an earlier stage requires re-running that stage's gate.

## Success Criteria

- Every artefact in a bounded context is attributable to exactly one stage.
- No gate is bypassed; every gate verdict is recorded with evidence.

## Failure Conditions

- Implementation started while G4 or G5 is open.
- A stage's prohibited output appears in that stage's artefact set.
- A gate marked PASS with no evidence reference.

## Examples

**Conformant:** "Stage 4 (Application) is open pending API contract review;
I will not scaffold React components until G4 passes."

**Conformant:** "The PRD lacks acceptance criteria for the refund flow;
Stage 1 is not exit-ready. Drafting the missing criteria now."

## Anti-patterns

- "Let's build the UI in parallel to save time" while G4 is still open.
- Treating stage gates as a formality to be filled in after the fact.
- Merging Stage 2 domain modelling into Stage 4 API design to save a
  meeting.

## References

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `core/workflow/APPROVAL-GATES.md`
- `core/workflow/REFUSAL-PROTOCOL.md`
