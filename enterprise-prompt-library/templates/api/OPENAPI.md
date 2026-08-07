---
id: EPOS-TPL-API-OPENAPI-001
version: 1.0.0
status: ACCEPTED
stage: 4
gate: G4
depends_on: [EPOS-CORE-CON-001]
---

# OpenAPI Specification

## Purpose

Formalise the accepted API Contract into a machine-readable OpenAPI 3.x document that code generators and validators consume directly.

## Scope

Applies once API-CONTRACT.md is accepted for the bounded context. Produces the artefact from which server stubs and client SDKs are generated.

## Inputs

- Approved API Contract (OP-NNN operations)
- Approved Authorization roles for security schemes

## Outputs

Primary artefact: **OpenAPI Specification**, uniquely identified, versioned, and traceable to
the business requirement that authorised it.

```PROMPT
You are producing the artefact **OpenAPI Specification** for bounded context {{BOUNDED_CONTEXT}}
at Stage 4, Gate G4.

Before writing anything, emit the EPOS preamble:
- Stage: 4
- Bounded Context: {{BOUNDED_CONTEXT}}
- Prerequisites: {{PREREQUISITE_ARTEFACTS}}
- Artefacts produced: OpenAPI Specification ({{ARTEFACT_ID}})
- Quality Gate: G4

If any prerequisite in {{PREREQUISITE_ARTEFACTS}} is missing, unapproved, or
inconsistent, refuse. State the missing prerequisite, the article violated, and
the exact path to unblock. Do not proceed on assumptions.

Inputs supplied: {{INPUT_ARTEFACTS}}
Business/technical context: {{CONTEXT_SUMMARY}}
Target identifier prefix: {{ID_PREFIX}}

Produce the OpenAPI Specification artefact with these required sections:
- OpenAPI Metadata (info, servers, version)
- Paths and Operations (1:1 with OP-NNN ids, via `operationId`)
- Component Schemas (request/response, matching API Contract semantic types)
- Security Schemes (referencing Authorization model, not defining new rules)
- Error Response Schemas per taxonomy entry
- Traceability comment block mapping `operationId` to OP-NNN

Mandatory prohibitions — the output MUST NOT:
- Add an operation absent from the accepted API Contract
- Contain implementation code, SDK code, or server stubs
- Define new authorization logic not present in AUTHORIZATION.md

Traceability requirements:
- Every `operationId` maps 1:1 to an API Contract OP-NNN id
- Every schema traces to a Domain Model entity or value object

Format: markdown, dense enterprise English, every element carries an
identifier of form {{ID_PREFIX}}-NNN. Close with an explicit statement of
what was decided, why, and what was rejected (Article 6).
```

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `templates/api/API-CONTRACT.md`
- `templates/api/AUTHORIZATION.md`

## Rules

This template applies Constitution rules; it invents none.

### Applied Article 3
The OpenAPI document is a formalisation, not a new source of truth; any operation here without an OP-NNN counterpart is defective.

### Applied Article 12
Version field increments on any breaking schema change.

## Constraints

- The document validates against the OpenAPI 3.x schema.
- No orphaned schema components with zero references.

## Success Criteria

- G4 exit requires the OpenAPI document to lint clean and cover 100% of accepted API Contract operations.

## Failure Conditions

- OpenAPI paths with no matching API Contract operation.
- Security scheme defining a role hierarchy not present in AUTHORIZATION.md.

## Examples

**Conformant**: `POST /refunds` has `operationId: RequestRefund` mapped to OP-014, request/response schemas matching the API Contract's semantic types exactly.

## Anti-patterns

- Auto-generating the OpenAPI file from existing code and calling it the contract.
- Adding convenience fields 'the frontend might want'.

## References

- `core/constitution/CONSTITUTION.md` Articles 3, 12
- `templates/api/API-CONTRACT.md`
