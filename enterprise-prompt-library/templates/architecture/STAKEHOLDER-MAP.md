---
id: EPOS-TPL-ARCH-STAKEHOLDER-MAP-001
version: 1.0.0
status: ACCEPTED
stage: 0
gate: G0
depends_on: [EPOS-CORE-CON-001]
---

# Stakeholder Map

## Purpose

Identify every human and system actor with an interest in the bounded context, their power, interest, and the vulnerability class that Article 0 must weigh.

## Scope

Applies once Business Vision exists. Feeds PRD, Domain Model, and Authorization design.

## Inputs

- Approved Business Vision (BV-OBJ ids)
- Organisational chart or actor list for the domain

## Outputs

Primary artefact: **Stakeholder Map**, uniquely identified, versioned, and traceable to
the business requirement that authorised it.

```PROMPT
You are producing the artefact **Stakeholder Map** for bounded context {{BOUNDED_CONTEXT}}
at Stage 0, Gate G0.

Before writing anything, emit the EPOS preamble:
- Stage: 0
- Bounded Context: {{BOUNDED_CONTEXT}}
- Prerequisites: {{PREREQUISITE_ARTEFACTS}}
- Artefacts produced: Stakeholder Map ({{ARTEFACT_ID}})
- Quality Gate: G0

If any prerequisite in {{PREREQUISITE_ARTEFACTS}} is missing, unapproved, or
inconsistent, refuse. State the missing prerequisite, the article violated, and
the exact path to unblock. Do not proceed on assumptions.

Inputs supplied: {{INPUT_ARTEFACTS}}
Business/technical context: {{CONTEXT_SUMMARY}}
Target identifier prefix: {{ID_PREFIX}}

Produce the Stakeholder Map artefact with these required sections:
- Stakeholder Register (name/role, interest, influence, vulnerability class)
- RACI per major decision area
- Vulnerable Party Assessment (Article 0)
- External System Actors
- Escalation and Conflict Resolution Path
- Traceability to Business Vision objectives

Mandatory prohibitions — the output MUST NOT:
- Assign technical roles or team structures (out of EPOS scope)
- Omit the Vulnerable Party Assessment even when the answer is 'none identified'
- Reference personas that do not exist in Business Vision

Traceability requirements:
- Every stakeholder id STK-NNN traces to at least one BV-OBJ-NNN
- Vulnerable Party Assessment id feeds THREAT-MODEL and AUTHORIZATION

Format: markdown, dense enterprise English, every element carries an
identifier of form {{ID_PREFIX}}-NNN. Close with an explicit statement of
what was decided, why, and what was rejected (Article 6).
```

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `templates/architecture/BUSINESS-VISION.md` (input)
- `templates/architecture/PRD.md` (consumer)

## Rules

This template applies Constitution rules; it invents none.

### Applied Article 0
Every stakeholder is scored for vulnerability; the highest-vulnerability stakeholder's interest is flagged as override-capable over commercial interest.

## Constraints

- No stakeholder is added without a named or role-based owner.
- The map is reviewed at every major scope change.

## Success Criteria

- G0 exit requires zero stakeholders with an unassigned RACI role.
- Vulnerable Party Assessment is explicit, not implied.

## Failure Conditions

- Stakeholder with no traceability to a Business Vision objective.
- Missing vulnerability assessment.

## Examples

**Conformant**: A stakeholder map for a children's education app flags 'child learner' as the highest vulnerability actor and records that consent and data minimisation decisions defer to that actor's interest.

## Anti-patterns

- Treating 'the business' as the only stakeholder.
- Skipping vulnerability scoring because 'this is a B2B tool'.

## References

- `core/constitution/CONSTITUTION.md` Article 0
- `templates/architecture/BUSINESS-VISION.md`
- `templates/security/THREAT-MODEL.md`
