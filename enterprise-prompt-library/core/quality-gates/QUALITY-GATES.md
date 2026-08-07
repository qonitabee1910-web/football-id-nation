---
id: EPOS-CORE-QG-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-WFL-001]
---

# Quality Gates G0–G7

## Purpose

Define the entry criteria, pass/fail checklist, required evidence, and
verdict format for each of the eight quality gates that operationalise
Article 7 (Stage Gate Discipline).

## Scope

Every artefact produced in Stages 0–7 of `core/workflow/WORKFLOW.md`.

## Inputs

- The artefact set produced for the stage under review

## Outputs

- A recorded verdict: PASS, CONDITIONAL PASS with conditions, or FAIL with
  blocking findings

## Dependencies

- `core/workflow/WORKFLOW.md`
- `core/workflow/APPROVAL-GATES.md`
- `core/traceability/TRACEABILITY.md`

## Rules

### Verdict format (applies to every gate)

```text
GATE <Gn> — <name>
Verdict: PASS | CONDITIONAL PASS | FAIL
Evidence: <artefact IDs and links reviewed>
Findings: <numbered list; empty if PASS>
Conditions (if CONDITIONAL PASS): <owner, due date, per condition>
```

### G0 — Business Integrity

**Entry criteria.** Vision draft and named sponsor exist.
**Checklist.**
1. Problem statement is specific and falsifiable.
2. Target beneficiaries are named, including vulnerable parties if any.
3. Success metrics are quantified with baseline and target.
4. Out-of-scope boundaries are stated.
5. Article 0 impact assessment completed (children/vulnerable parties).
6. Stakeholder map drafted with accountable/consulted/informed roles.
7. No solution/technology named prematurely.
8. Sponsor identity recorded.
**Evidence.** Vision document, stakeholder map draft.

### G1 — Architecture Integrity

**Entry criteria.** G0 PASS; at least one architectural question identified.
**Checklist.**
1. Every structural decision has a corresponding ADR.
2. Alternatives considered and rejection rationale recorded per ADR.
3. Bounded context boundaries are explicit.
4. Dependency direction conforms to `core/architecture/ARCHITECTURE-RULES.md`.
5. Integration style (sync/async/event) is justified.
6. Non-functional requirements (scale, latency, availability) addressed.
7. Security implications reviewed for each ADR.
8. No ADR contradicts an existing accepted ADR without superseding it.
**Evidence.** ADR set, architecture diagram-as-code.

### G2 — Domain Integrity

**Entry criteria.** G1 PASS.
**Checklist.**
1. Bounded contexts named and scoped.
2. Aggregates identified with invariants (INV-*).
3. Domain events (EVT-*) are past tense and complete for the domain.
4. Ubiquitous language glossary entries added for new terms.
5. Journeys cover primary and edge-case actor paths.
6. No persistence or transport detail present.
7. Invariants map to at least one business rule (BR-*).
8. Vulnerable-party-specific invariants explicitly modelled where relevant.
**Evidence.** Domain model, event catalogue, journey maps.

### G3 — Data Integrity

**Entry criteria.** G2 PASS.
**Checklist.**
1. CDM entities map 1:1 to domain aggregates or explain divergence.
2. LDM normalised to at least 3NF unless a documented exception exists.
3. PDM specifies types, constraints, indexes, and keys.
4. Every field has a data classification (public/internal/confidential/
   sensitive).
5. Retention class assigned per field group.
6. Minimisation reviewed: no field exists without a named consumer.
7. PII/PHI/minor-data fields flagged and cross-referenced to
   `core/ai-governance/PRIVACY-PRINCIPLES.md`.
8. Migration reversibility confirmed.
**Evidence.** CDM, LDM, PDM, classification register.

### G4 — Application Integrity

**Entry criteria.** G3 PASS.
**Checklist.**
1. Every endpoint/command/query has a contract entry with schema.
2. Error responses are typed and enumerated.
3. Authorization matrix covers every endpoint and role.
4. Idempotency defined for unsafe operations.
5. Versioning strategy stated for the contract.
6. No business logic described as residing in the client.
7. Rate limiting/abuse controls addressed where relevant.
8. Contract reviewed against domain events for consistency.
**Evidence.** API contract, authorization matrix.

### G5 — UX Integrity

**Entry criteria.** G4 PASS.
**Checklist.**
1. Screen catalogue (SCR-*) covers every journey step.
2. States defined: loading, empty, error, success, permission-denied.
3. Accessibility requirements (WCAG level) stated per screen.
4. Content design reviewed for banned/ambiguous terms.
5. No screen exposes data not present in the approved API contract.
6. Age-appropriate design reviewed where minors may be users.
7. Design system components referenced, not redefined.
8. Error states map to API contract error codes.
**Evidence.** UX specification, accessibility checklist.

### G6 — Implementation Integrity

**Entry criteria.** G5 PASS.
**Checklist.**
1. Every FR/BR/INV/EVT/SCR ID has at least one implementing commit.
2. Tests exist for every acceptance criterion and pass.
3. No swallowed exceptions or fabricated success paths (Article 11).
4. Server-side authorization enforced for every state-changing operation.
5. No unrequested refactor, rename, or dependency outside task scope.
6. Observability (logs/metrics/traces) present for new critical paths.
7. Secrets are not hardcoded or logged.
8. Migration scripts are reversible or explicitly justified otherwise.
9. Code conforms to `core/documentation/CODING-STANDARDS.md`.
10. Commit messages carry traceability IDs.
**Evidence.** Source diff, test run output, traceability matrix update.

### G7 — Release Integrity

**Entry criteria.** G6 PASS.
**Checklist.**
1. Release notes map every change to its FR/BR IDs.
2. Rollback plan defined and tested where feasible.
3. Migration runbook reviewed for production data volumes.
4. Monitoring/alerting plan defined for the release window.
5. Stakeholder communication sent per `core/workflow/APPROVAL-GATES.md`.
6. No new unapproved scope introduced at release.
7. Post-release verification checklist defined.
8. Data classification/retention unaffected or re-approved if changed.
**Evidence.** Release notes, rollback plan, deployment checklist.

## Constraints

- A gate cannot be marked PASS with an open FAIL-severity finding.
- CONDITIONAL PASS conditions follow the rules in
  `core/workflow/APPROVAL-GATES.md`.
- Gate verdicts are recorded artefacts, not verbal statements.

## Success Criteria

- Every stage transition has a recorded gate verdict with evidence.
- Independent reviewers reach the same verdict given the same evidence
  (Article 13).

## Failure Conditions

- A gate marked PASS with unresolved checklist items.
- A CONDITIONAL PASS with no owner or due date on its conditions.
- Implementation proceeding while its stage's gate is FAIL.

## Examples

**Conformant:**
```text
GATE G4 — Application Integrity
Verdict: CONDITIONAL PASS
Evidence: API-CONTRACT-014 v1.2
Findings: 1. Rate limiting undefined for /exports endpoint.
Conditions: Add rate limit spec — owner: API Lead — due: 2024-06-10
```

## Anti-patterns

- Skipping checklist items deemed "obviously fine."
- Recording a gate verdict without evidence links.
- Reusing a prior gate's verdict for materially changed artefacts.

## References

- `core/workflow/WORKFLOW.md`
- `core/workflow/APPROVAL-GATES.md`
- `core/traceability/TRACEABILITY.md`
