---
id: EPOS-TPL-ARCH-BUSINESS-VISION-001
version: 1.0.0
status: ACCEPTED
stage: 0
gate: G0
depends_on: [EPOS-CORE-CON-001]
---

# Business Vision

## Purpose

Establish the authoritative statement of business intent, problem, target users, and success measures that every downstream artefact must trace to. This is the root of Article 5 traceability for the bounded context.

## Scope

Applies to a new product, a new bounded context, or a material strategic pivot. Precedes stakeholder mapping and all architecture work.

## Inputs

- Business problem statement from sponsor
- Market/competitive context
- Constraints (budget, regulatory, timeline)
- Any prior vision documents being superseded

## Outputs

Primary artefact: **Business Vision**, uniquely identified, versioned, and traceable to
the business requirement that authorised it.

```PROMPT
You are producing the artefact **Business Vision** for bounded context {{BOUNDED_CONTEXT}}
at Stage 0, Gate G0.

Before writing anything, emit the EPOS preamble:
- Stage: 0
- Bounded Context: {{BOUNDED_CONTEXT}}
- Prerequisites: {{PREREQUISITE_ARTEFACTS}}
- Artefacts produced: Business Vision ({{ARTEFACT_ID}})
- Quality Gate: G0

If any prerequisite in {{PREREQUISITE_ARTEFACTS}} is missing, unapproved, or
inconsistent, refuse. State the missing prerequisite, the article violated, and
the exact path to unblock. Do not proceed on assumptions.

Inputs supplied: {{INPUT_ARTEFACTS}}
Business/technical context: {{CONTEXT_SUMMARY}}
Target identifier prefix: {{ID_PREFIX}}

Produce the Business Vision artefact with these required sections:
- Problem Statement
- Target Users and Personas (summary, detailed personas belong to STAKEHOLDER-MAP)
- Business Objectives
- North-Star Metric and Supporting Metrics
- Success Measures and Time Horizon
- Out-of-Scope Statement
- Risks and Assumptions
- Traceability Table (objective -> metric -> future artefact)

Mandatory prohibitions — the output MUST NOT:
- Contain solution architecture, technology choices, or data models
- Contain UI wireframes or screen names
- Assert metrics without a measurement method
- Skip the Out-of-Scope Statement

Traceability requirements:
- Every objective carries an id BV-OBJ-NNN referenced later by STAKEHOLDER-MAP and PRD
- North-Star Metric id is referenced by ANALYTICS-INSTRUMENTATION

Format: markdown, dense enterprise English, every element carries an
identifier of form {{ID_PREFIX}}-NNN. Close with an explicit statement of
what was decided, why, and what was rejected (Article 6).
```

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `templates/architecture/STAKEHOLDER-MAP.md` (next stage)
- `templates/architecture/PRD.md` (consumes this artefact)

## Rules

This template applies Constitution rules; it invents none.

### Applied Article 0
Vulnerable-party impact is assessed explicitly if the product touches minors, health, or financial vulnerability data.

### Applied Article 1
No capability described here authorises code; it authorises further specification only.

## Constraints

- One Business Vision per bounded context; supersession requires a new version and a changelog entry.
- Metrics without a measurement method are rejected.

## Success Criteria

- G0 exit requires sponsor sign-off recorded in the artefact.
- Every objective traces to at least one metric.

## Failure Conditions

- Vision containing technology or UI decisions.
- Metric with no owner or no measurement method.
- Missing Out-of-Scope Statement.

## Examples

**Conformant**: A Business Vision for a lending platform states the objective 'reduce loan approval time', the North-Star Metric 'median approval hours', and explicitly excludes 'automated credit scoring model' as out of scope for v1.

## Anti-patterns

- Writing a vision that already prescribes microservices or a specific database.
- Vague objectives such as 'improve the platform' with no metric.

## References

- `core/constitution/CONSTITUTION.md` Articles 1, 5, 6
- `templates/architecture/STAKEHOLDER-MAP.md`
- `templates/architecture/PRD.md`
