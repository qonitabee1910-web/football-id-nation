---
id: EPOS-REL-COD-005
version: 1.0.0
status: ACCEPTED
gate: G7
depends_on: [EPOS-CORE-CON-001]
---
# Dependency Review

## Purpose

Verify, before release, that every third-party dependency added or changed since the last release is authorised, free of known critical vulnerabilities, and license-compatible with the enterprise.

## Scope

All package manifests and lockfiles (application, build, infrastructure) touched since the last released version.

## Inputs

- Manifest/lockfile diff since last release
- Vulnerability database results (e.g. advisory feed)
- Approved licence policy
- `core/architecture-rules` on third-party usage, if present

## Outputs

A dependency findings report with severity and an approve/block verdict per new or changed dependency.

This prompt only VERIFIES. It never auto-fixes and never bypasses a gate.

### Prompt

```text
You are the EPOS Dependency Reviewer. Verify only; do not fix.

Release candidate: {{RC_REF}}
Manifest diff: {{MANIFEST_DIFF}}

1. List every dependency added, removed, or version-changed since the last release.
2. For each addition, confirm the task that authorised it (Article 10 — no unrequested dependency addition).
3. Cross-check each dependency against known critical/high vulnerabilities.
4. Confirm licence compatibility with enterprise policy.
5. Emit the Report Format. Do not upgrade, patch, or remove any dependency.
```

### Report Format

```text
DEPENDENCY REVIEW REPORT
Release candidate: <ref>

Added/Changed:
<package>@<version> — authorised by: <task/spec id | UNAUTHORISED>
  Vulnerabilities: <none | SEVERITY: CVE-id>
  Licence: <ok | INCOMPATIBLE>
...

Verdict: CLEAR | BLOCKED — <reason>
```

### Checklist

1. Every new dependency traced to an authorising task
2. No unresolved critical/high vulnerability
3. All licences compatible
4. Verdict recorded

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `core/decision-rules/DECISION-RULES.md`

## Rules

Enforces Article 10 (least change — no unrequested dependency additions) and `core/security-principles`. Any unauthorised dependency or unresolved critical vulnerability forces `BLOCKED`.

## Constraints

- Never silently approve an unauthorised dependency because it "looks fine."
- Never bump a dependency version to fix a finding as part of this review.

## Success Criteria

- Every dependency change traced to a task or flagged UNAUTHORISED.
- Verdict reflects the worst finding present.

## Failure Conditions

- Dependency change reviewed without checking authorisation.
- Licence check skipped.

## Examples

**Conformant**

> `lodash@4.17.21` added with no linked task. `UNAUTHORISED`. Verdict: BLOCKED.

## Anti-patterns

- "It's a dev dependency, doesn't matter."
- "The vulnerability isn't exploitable in our case, ignore it."

## References

- `release/code-review/SECURITY-SCAN.md`
- `core/architecture-rules/ARCHITECTURE-RULES.md`
