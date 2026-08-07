---
id: EPOS-TPL-API-AUTHORIZATION-001
version: 1.0.0
status: ACCEPTED
stage: 4
gate: G4
depends_on: [EPOS-CORE-CON-001]
---

# Authorization Model

## Purpose

Define roles, permissions, and enforcement points for every API operation and data access path, establishing server-side authority per Article 8 before any endpoint or UI conditional is built.

## Scope

Applies to every bounded context exposing an API. Consumed by RLS.md and by server-side middleware, never by client-side logic alone.

## Inputs

- Approved Stakeholder Map (roles/actors)
- Approved API Contract operations
- Approved Domain Model invariants requiring protection

## Outputs

Primary artefact: **Authorization Model**, uniquely identified, versioned, and traceable to
the business requirement that authorised it.

```PROMPT
You are producing the artefact **Authorization Model** for bounded context {{BOUNDED_CONTEXT}}
at Stage 4, Gate G4.

Before writing anything, emit the EPOS preamble:
- Stage: 4
- Bounded Context: {{BOUNDED_CONTEXT}}
- Prerequisites: {{PREREQUISITE_ARTEFACTS}}
- Artefacts produced: Authorization Model ({{ARTEFACT_ID}})
- Quality Gate: G4

If any prerequisite in {{PREREQUISITE_ARTEFACTS}} is missing, unapproved, or
inconsistent, refuse. State the missing prerequisite, the article violated, and
the exact path to unblock. Do not proceed on assumptions.

Inputs supplied: {{INPUT_ARTEFACTS}}
Business/technical context: {{CONTEXT_SUMMARY}}
Target identifier prefix: {{ID_PREFIX}}

Produce the Authorization Model artefact with these required sections:
- Role Catalogue (id ROLE-NNN, description, vulnerability considerations)
- Permission Matrix (role x operation x allow/deny)
- Enforcement Point per Operation (server-side only)
- Data-Scoping Rules (feeds RLS.md)
- Escalation/Break-Glass Procedure with Audit Requirement
- Traceability to API Contract operations and Stakeholder Map

Mandatory prohibitions — the output MUST NOT:
- Describe client-side conditional rendering as an authorization control
- Grant a permission with no corresponding role in the Stakeholder Map
- Contain middleware code

Traceability requirements:
- Every permission entry traces to an API Contract OP-NNN and a Stakeholder Map STK-NNN
- Every break-glass procedure traces to an audit log requirement

Format: markdown, dense enterprise English, every element carries an
identifier of form {{ID_PREFIX}}-NNN. Close with an explicit statement of
what was decided, why, and what was rejected (Article 6).
```

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `templates/architecture/STAKEHOLDER-MAP.md`
- `templates/api/API-CONTRACT.md`
- `templates/data/RLS.md` (consumer)

## Rules

This template applies Constitution rules; it invents none.

### Applied Article 8
Every permission is enforced server-side; a client-side check referenced here is presentation-only and explicitly labelled as non-authoritative.

### Applied Article 0
Roles with power over a vulnerable stakeholder's data carry additional audit and consent requirements.

## Constraints

- Default-deny: an operation with no explicit allow entry is denied.
- Break-glass access is time-bound and always audited.

## Success Criteria

- G4 exit requires every API Contract operation to have at least one explicit permission entry.

## Failure Conditions

- Operation with no entry in the Permission Matrix (implicit allow).
- Break-glass procedure with no audit trail.

## Examples

**Conformant**: ROLE-002 `SupportAgent` is denied `RequestRefund` but permitted `ViewRefundStatus`, enforced server-side in the Refunds service, traced to OP-014 and OP-015.

## Anti-patterns

- 'We hide the button for non-admins' as the sole control.
- A default `allow all` permission with denials added later.

## References

- `core/constitution/CONSTITUTION.md` Articles 0, 8
- `templates/api/API-CONTRACT.md`
- `templates/data/RLS.md`
