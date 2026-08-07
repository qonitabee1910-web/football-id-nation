---
id: EPOS-TPL-DATA-RLS-001
version: 1.0.0
status: ACCEPTED
stage: 4/3
gate: G4/G3
depends_on: [EPOS-CORE-CON-001]
---

# Row-Level Security Policy

## Purpose

Define server-enforced row-level access policies per table, mapping authorization roles to data visibility and mutation rights at the database layer, per Article 8.

## Scope

Applies to every table in the Physical Data Model holding multi-tenant or role-scoped data. Precedes or accompanies API authorization implementation.

## Inputs

- Approved Physical Data Model
- Approved Authorization roles from AUTHORIZATION.md

## Outputs

Primary artefact: **Row-Level Security Policy**, uniquely identified, versioned, and traceable to
the business requirement that authorised it.

```PROMPT
You are producing the artefact **Row-Level Security Policy** for bounded context {{BOUNDED_CONTEXT}}
at Stage 4/3, Gate G4/G3.

Before writing anything, emit the EPOS preamble:
- Stage: 4/3
- Bounded Context: {{BOUNDED_CONTEXT}}
- Prerequisites: {{PREREQUISITE_ARTEFACTS}}
- Artefacts produced: Row-Level Security Policy ({{ARTEFACT_ID}})
- Quality Gate: G4/G3

If any prerequisite in {{PREREQUISITE_ARTEFACTS}} is missing, unapproved, or
inconsistent, refuse. State the missing prerequisite, the article violated, and
the exact path to unblock. Do not proceed on assumptions.

Inputs supplied: {{INPUT_ARTEFACTS}}
Business/technical context: {{CONTEXT_SUMMARY}}
Target identifier prefix: {{ID_PREFIX}}

Produce the Row-Level Security Policy artefact with these required sections:
- Policy Catalogue (table, policy id, role, operation, predicate)
- Tenant Isolation Strategy
- Bypass/Service-Role Justification (if any, must be minimal)
- Testing Strategy for Policy Enforcement
- Traceability to Physical Data Model tables and Authorization roles

Mandatory prohibitions — the output MUST NOT:
- Rely on client-side filtering as a substitute for a database policy
- Grant a bypass role without an explicit, time-bound justification
- Contain UI conditional rendering logic

Traceability requirements:
- Every policy traces to a table id and an Authorization role id
- Every bypass grant traces to an approved exception record

Format: markdown, dense enterprise English, every element carries an
identifier of form {{ID_PREFIX}}-NNN. Close with an explicit statement of
what was decided, why, and what was rejected (Article 6).
```

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `templates/data/PHYSICAL-DATA-MODEL.md`
- `templates/api/AUTHORIZATION.md`

## Rules

This template applies Constitution rules; it invents none.

### Applied Article 8
Row-level security is enforced in the database engine itself; application-layer filtering is defence-in-depth, never the sole control.

### Applied Article 9
A role with no legitimate need for a data category has no policy granting it access — absence, not denial after read.

## Constraints

- Every table with tenant-scoped data has at least one enforcing policy.
- Bypass roles are logged and reviewed at G7.

## Success Criteria

- G3/G4 exit requires a policy test suite proving cross-tenant access fails.

## Failure Conditions

- Policy relying on the client to send the correct tenant id unchecked.
- Blanket bypass role used by default application connections.

## Examples

**Conformant**: Policy RLS-009 on `invoice` restricts `SELECT`/`UPDATE` to rows where `tenant_id = current_tenant()`, tested against a cross-tenant access attempt that must fail.

## Anti-patterns

- 'We filter by tenant in the API, so RLS is optional.'
- Using the database superuser connection for the application.

## References

- `core/constitution/CONSTITUTION.md` Articles 8, 9
- `templates/data/PHYSICAL-DATA-MODEL.md`
- `templates/api/AUTHORIZATION.md`
