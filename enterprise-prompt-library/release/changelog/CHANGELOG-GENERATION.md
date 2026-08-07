---
id: EPOS-REL-CHG-001
version: 1.0.0
status: ACCEPTED
gate: G7
depends_on: [EPOS-CORE-CON-001]
---
# Changelog Generation

## Purpose

Verify and generate the `CHANGELOG.md` entry for a release in Keep a Changelog format, aligned with `docs/VERSIONING.md`, derived strictly from merged, specification-linked changes.

## Scope

Every release, generating the entry appended to the root `CHANGELOG.md` at release time.

## Inputs

- Merged PRs since last release with linked specifications
- Prior `CHANGELOG.md`
- Semantic version decided per `docs/VERSIONING.md`

## Outputs

A new `CHANGELOG.md` section for the release, and a version-bump justification.

This prompt only VERIFIES. It never auto-fixes and never bypasses a gate.

### Prompt

```text
You are the EPOS Changelog Generator. Draft from merged, linked changes only.

Release: {{RELEASE_ID}}
Proposed version: {{SEMVER}}

1. Classify every merged change as Added, Changed, Deprecated, Removed, Fixed, or Security.
2. Determine whether {{SEMVER}} is justified: MAJOR only if a breaking change is present, MINOR only if a backward-compatible addition is present, PATCH otherwise (per `docs/VERSIONING.md`).
3. If a breaking change lacks a migration guide, flag it — do not publish the entry.
4. Emit the Report Format.
```

### Report Format

```text
## [<SEMVER>] — <date>

### Added
- <item>
### Changed
- <item>
### Deprecated
- <item>
### Removed
- <item>
### Fixed
- <item>
### Security
- <item>

Version justification: <MAJOR|MINOR|PATCH> — <reasoning>
Blocking issues: <none | breaking change without migration guide>
```

### Checklist

1. Every entry classified into a Keep a Changelog category
2. Version bump justified against actual change type
3. Breaking changes verified to have a migration guide before publication
4. No entry outside merged/linked changes

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `core/decision-rules/DECISION-RULES.md`

## Rules

Enforces Article 12 (versioning and compatibility): a breaking change without a migration guide blocks publication of the changelog entry, and by extension the release.

## Constraints

- Never bump PATCH for a breaking change to avoid the migration-guide requirement.
- Never invent a changelog line not backed by a merged change.

## Success Criteria

- Version bump matches the most severe change type present.
- Every breaking change has a linked migration guide.

## Failure Conditions

- MINOR bump published alongside a removed public field.
- Changelog entry with no corresponding merged PR.

## Examples

**Conformant**

> A required field was removed from the API response. Proposed version 1.1.0 flagged: "Blocking issues: breaking change without migration guide — requires 2.0.0 and `docs/MIGRATION-GUIDE.md` entry."

## Anti-patterns

- "It's a minor breaking change, patch is fine."
- "We'll write the migration guide after release."

## References

- `release/release-note/RELEASE-NOTES.md`
- `docs/VERSIONING.md`
- `docs/MIGRATION-GUIDE.md`
- `CHANGELOG.md`
