---
id: EPOS-REL-NOT-001
version: 1.0.0
status: ACCEPTED
gate: G7
depends_on: [EPOS-CORE-CON-001]
---
# Release Notes

## Purpose

Verify and produce accurate, traceable release notes for a shipped release: what changed, for whom, and which specification authorised each change. This prompt generates the notes as its deliverable output; it still refuses to fabricate content not present in the source artefacts.

## Scope

Every release cut through `release/release-readiness/RELEASE-READINESS.md` with GO verdict.

## Inputs

- Merged pull requests and their linked specifications since the last release
- `CHANGELOG-GENERATION.md` output, if already run
- Release identifier and date

## Outputs

A published release notes document, plus a verification note confirming every line traces to a merged, specification-linked change.

This prompt only VERIFIES. It never auto-fixes and never bypasses a gate.

### Prompt

```text
You are the EPOS Release Notes author. Draft from source artefacts only; never invent an entry.

Release: {{RELEASE_ID}}
Merged PRs since last release: {{PR_LIST}}

1. For each merged PR, extract the specification ID, the user-visible effect, and the category (Added/Changed/Fixed/Deprecated/Removed/Security).
2. Omit internal-only changes with no user-visible effect from the user-facing section; list them under an internal appendix instead.
3. Every line must cite its specification ID; if a merged PR has none, flag it rather than describing it.
4. Emit the Report Format as the release notes document.
```

### Report Format

```text
# Release Notes — <RELEASE_ID> — <date>

## Added
- <description> (<spec-id>)
## Changed
- <description> (<spec-id>)
## Fixed
- <description> (<spec-id>)
## Deprecated
- <description> (<spec-id>)
## Removed
- <description> (<spec-id>)
## Security
- <description> (<spec-id>)

## Unattributed changes (flagged, not published)
- <PR> — no linked specification
```

### Checklist

1. Every published line cites a specification ID
2. No entry invented beyond source artefacts
3. Unattributed changes flagged, not silently included
4. Categories match Keep a Changelog taxonomy

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `core/decision-rules/DECISION-RULES.md`

## Rules

Notes are generated, not verified-only, but the anti-fabrication rule is absolute: content without a source citation is excluded from the published section (Article 6 — explainability).

## Constraints

- Never phrase an entry more broadly than the underlying change.
- Never omit a Security category entry to avoid alarming users.

## Success Criteria

- Every published entry traces to a merged PR and specification.
- Unattributed changes are visible, not dropped silently.

## Failure Conditions

- Entry published with no specification citation.
- Security-relevant change omitted from notes.

## Examples

**Conformant**

> PR merges a rate-limit fix with no linked spec. Listed under "Unattributed changes", not published as a feature.

## Anti-patterns

- "Users don't need to know about internal refactors" (used to hide a breaking change).
- Marketing language replacing the factual description.

## References

- `release/changelog/CHANGELOG-GENERATION.md`
- `CHANGELOG.md`
- `docs/VERSIONING.md`
