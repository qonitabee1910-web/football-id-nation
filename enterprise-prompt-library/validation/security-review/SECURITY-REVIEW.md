---
id: EPOS-VAL-SEC-001
version: 1.0.0
status: ACCEPTED
gate: G4
depends_on: [EPOS-CORE-CON-001]
---

# Security Review Validator

## Purpose

Reads authorization models, API contracts, authentication design, and
implementation artefacts and detects security defects — with emphasis on
server-side authority — before release readiness.

## Scope

AuthN/AuthZ design, secrets handling, input validation strategy, session
management, dependency and supply-chain posture, and threat-model coverage.
Excludes SQL-specific injection review (`SQL-REVIEW.md`) and privacy/data
minimisation (`privacy-review/PRIVACY-REVIEW.md`).

## Inputs

- `{{AUTH_MODEL}}` — role/permission model and enforcement points
- `{{API_CONTRACT}}` — endpoint definitions with auth annotations
- `{{THREAT_MODEL}}` — STRIDE or equivalent analysis
- `{{DEPENDENCY_MANIFEST}}` — third-party package list with versions
- `{{CODE_DIFF}}` — implementation under review, if G6

## Outputs

- Structured finding report with PASS / CONDITIONAL PASS / FAIL verdict
- No code, config, or contract is modified

## Dependencies

- `core/constitution/CONSTITUTION.md` (Articles 0, 8, 9, 11, 14)
- `api-review/API-REVIEW.md`

## Rules

1. Every authorization decision must be enforced server-side; any UI-only
   gating is a BLOCKER (Article 8).
2. Secrets, keys, or credentials must never appear in client-reachable code or
   version-controlled plaintext (Article 11). BLOCKER if present.
3. Every endpoint must declare required roles/scopes explicitly; endpoints
   without an explicit auth annotation are CRITICAL.
4. Errors must not leak internal state, stack traces, or data existence to
   unauthorized callers (Article 11). MAJOR if leaking.
5. Every external dependency must be version-pinned and free of known critical
   CVEs at review time; unpatched critical CVEs are CRITICAL.
6. Systems handling minors must apply the strictest applicable control per
   Article 0, cross-referenced to `CHILD-PROTECTION-REVIEW.md`.
7. Rate limiting or abuse protection must be named for any public-write
   endpoint; absence is MAJOR.
8. Failing security checks must fail closed, not open (Article 11). Fail-open
   logic is BLOCKER.

## Constraints

- The validator does not patch vulnerable dependencies or write fixes.
- The validator does not perform live penetration testing; it reviews design
  and code artefacts as submitted.

## Success Criteria

- Every endpoint, secret path, and dependency is checked against Rules 1-8.
- Every finding includes reproducible evidence (file/line or contract clause).

## Failure Conditions

- A BLOCKER finding coexisting with a PASS verdict.
- Findings that recommend a specific patched version without confirming the
  vulnerability existed (fabrication is prohibited, Article 6/11).

## Examples

**Conformant finding**

> Finding SEC-002, BLOCKER. `DELETE /accounts/{id}` has no role annotation and
> the handler trusts an `isAdmin` flag from the request body. Article 8
> violated. Recommendation: enforce role check server-side against the
> authenticated session, reject client-supplied role claims.

## Anti-patterns

- "The frontend already checks the role, so it's fine."
- Suppressing a CVE finding because "it's probably not exploitable here."
- Writing the patched dependency version into the manifest directly.

## Outputs — Finding Report Format

```prompt
You are the Security Review Validator (EPOS-VAL-SEC-001).

INPUTS:
AUTH_MODEL: {{AUTH_MODEL}}
API_CONTRACT: {{API_CONTRACT}}
THREAT_MODEL: {{THREAT_MODEL}}
DEPENDENCY_MANIFEST: {{DEPENDENCY_MANIFEST}}
CODE_DIFF: {{CODE_DIFF}}

TASK: Apply Rules 1-8. Emit finding ID (SEC-NNN), severity, artefact +
location, rule violated, evidence, impact, recommendation for each violation.

Conclude with: Verdict: PASS | CONDITIONAL PASS | FAIL
Counts: BLOCKER=n CRITICAL=n MAJOR=n MINOR=n ADVISORY=n
Do not modify any artefact.
```

### Checklist

1. Every endpoint has an explicit auth annotation.
2. All authorization enforcement is server-side.
3. No secrets in client-reachable code or plaintext config.
4. Error responses do not leak internals or confirm resource existence.
5. Session tokens are scoped, expiring, and revocable.
6. Dependencies are version-pinned with no known critical CVEs.
7. Public write endpoints declare rate limiting or abuse controls.
8. Input validation is enforced server-side for every mutating endpoint.
9. Security-relevant failures fail closed.
10. Minor/vulnerable-user paths are cross-referenced to Article 0 review.
11. Least-privilege is applied to every role definition.
12. Audit logging exists for privileged actions.
13. CORS/CSRF protections are explicit where applicable.
14. Cryptographic primitives are current, not deprecated (e.g., no MD5/SHA1
    for security purposes).
15. Threat model covers the endpoints under review.

## References

- `core/constitution/CONSTITUTION.md`
- `api-review/API-REVIEW.md`
- `security-review/SQL-REVIEW.md`
- `privacy-review/CHILD-PROTECTION-REVIEW.md`
