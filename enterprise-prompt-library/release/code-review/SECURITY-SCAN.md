---
id: EPOS-REL-COD-004
version: 1.0.0
status: ACCEPTED
gate: G7
depends_on: [EPOS-CORE-CON-001]
---
# Security Scan

## Purpose

Verify, before release, that the release candidate contains no known security defect class prohibited by `core/security-principles` and no unresolved finding above the accepted severity threshold.

## Scope

Application code, infrastructure-as-code, secrets handling, and dependency manifests of the release candidate.

## Inputs

- Release candidate source tree
- `core/security-principles/SECURITY-PRINCIPLES.md`
- Prior security scan results, if any
- Threat model / authorization model for the bounded context

## Outputs

A severity-ranked security findings report with a release-blocking verdict.

This prompt only VERIFIES. It never auto-fixes and never bypasses a gate.

### Prompt

```text
You are the EPOS Security Scanner. Verify only; do not fix.

Release candidate: {{RC_REF}}
Bounded context: {{CONTEXT_NAME}}

1. Confirm all authorization checks in {{CONTEXT_NAME}} are server-side (Article 8).
2. Confirm no secret, key, or credential is present in source, config, or logs.
3. Confirm input validation exists on every external-facing endpoint.
4. Confirm data minimisation per `core/privacy-principles`: no field, endpoint, or UI control exists for a capability not in the approved scope (Article 9).
5. Confirm no error message leaks internal implementation detail to the client.
6. Emit the Report Format. Do not remediate.
```

### Report Format

```text
SECURITY SCAN REPORT
Release candidate: <ref>
Context: <name>

Findings:
[SEVERITY] <location> — <principle/CWE class> — <description>
...

Verdict: CLEAR | BLOCKED — <n> BLOCKER/CRITICAL findings
```

### Checklist

1. No client-side-only authorization
2. No hardcoded secret or credential
3. Input validation present on all external endpoints
4. No structural over-collection of data
5. No implementation-detail leakage in errors
6. Verdict recorded

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `core/decision-rules/DECISION-RULES.md`

## Rules

Any BLOCKER or CRITICAL forces `BLOCKED`; the release candidate does not proceed to `release/deployment/DEPLOYMENT-READINESS.md`. Findings map to Article 8, Article 9, Article 11.

## Constraints

- Never patch the vulnerability as part of the scan.
- Never accept a BLOCKER with only a verbal exception.

## Success Criteria

- Every finding names a principle or defect class.
- Verdict is BLOCKED whenever a BLOCKER/CRITICAL is open.

## Failure Conditions

- Scan skipped because "nothing changed in security-relevant code."
- Findings without severity.

## Examples

**Conformant**

> `[BLOCKER] config/.env.example — hardcoded API key committed`. Verdict: BLOCKED.

**Conformant**

> All endpoints validated, no secrets found, minimal data exposure confirmed. Verdict: CLEAR.

## Anti-patterns

- "It's just a staging key."
- "We'll rotate the secret after release."

## References

- `core/security-principles/SECURITY-PRINCIPLES.md`
- `core/child-protection/CHILD-PROTECTION.md`
- `release/code-review/DEPENDENCY-REVIEW.md`
