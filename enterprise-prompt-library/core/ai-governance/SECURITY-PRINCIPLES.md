---
id: EPOS-CORE-AIG-003
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001, EPOS-CORE-ARC-001]
---

# Security Principles

## Purpose

Bind every implementation to a zero-trust security posture, implementing
Article 8 (Server-Side Authority) and Article 11 (No Silent Failure).

## Scope

All services, APIs, data stores, and client applications under EPOS.

## Inputs

- API contracts, authorization matrices, deployment topology

## Outputs

- A security-conformant design/implementation, or a refusal citing the
  violated principle

## Dependencies

- `core/architecture/ARCHITECTURE-RULES.md`
- `core/ai-governance/PRIVACY-PRINCIPLES.md`

## Rules

### Zero trust

No request is trusted by network origin, prior session state alone, or
client-asserted identity/role. Every request is authenticated and
authorized on every server-side entry point, including internal
service-to-service calls.

### Server-side authorization

All authorization decisions are evaluated server-side against the current,
authoritative role/permission state at request time. Client-side checks are
UX affordances only and are never the sole control (Article 8).

### Least privilege

Every service account, API key, and role is granted the minimum
permissions needed for its function, scoped to the narrowest resource set,
and reviewed at each major release.

### Input validation

All external input is validated server-side against the contract schema
before use: type, range, length, format, and business-rule constraints.
Client-side validation is a UX convenience, never a substitute.

### Secret management

Secrets are stored in a managed secret store or environment configuration,
never committed to source control, never logged, never returned in API
responses. Rotation procedures are documented per secret class.

### Dependency hygiene

Dependencies are pinned, sourced from vetted registries, and scanned for
known vulnerabilities before release. Unreviewed transitive dependency
additions are flagged at G6.

### Audit logging

Every authorization decision, privilege escalation, and data mutation on
sensitive data is logged with actor, timestamp, action, and outcome,
immutable and retained per the applicable retention class.

### Threat-model-before-feature

Any feature that introduces a new external input, new data flow across a
trust boundary, or new privilege level requires a threat model review
before implementation, covering at minimum: spoofing, tampering,
repudiation, information disclosure, denial of service, elevation of
privilege (STRIDE) or an equivalent enterprise-approved method.

## Constraints

- Security principles cannot be waived for internal tools, prototypes, or
  "temporary" endpoints; temporary code carries the same posture.
- Any exception requires a recorded, time-boxed risk acceptance approved by
  the Security Lead.

## Success Criteria

- Penetration test / security review finds no client-only authorization
  control.
- 100% of sensitive-data mutations produce an audit log entry.

## Failure Conditions

- An endpoint that trusts a client-supplied `role` or `userId` field for
  authorization.
- A secret value present in a repository, log, or error message.
- A new external-facing input shipped with no threat model review.

## Examples

**Conformant:** "The `/admin/users` endpoint re-validates the caller's role
against the database on every request, independent of the JWT claim
cached client-side."

**Conformant:** "Added `RATE_LIMIT_KEY` to the secret store; the API reads
it via environment variable, never logs it."

## Anti-patterns

- "The UI already hides the delete button for non-admins, so the API
  doesn't need to check."
- Committing a `.env` file with live credentials "temporarily."
- Skipping the threat model because the feature "is just a form."

## References

- `core/constitution/CONSTITUTION.md`
- `core/architecture/ARCHITECTURE-RULES.md`
- `core/ai-governance/PRIVACY-PRINCIPLES.md`
