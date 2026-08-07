---
id: EPOS-ADAPTER-WINDSURF-BOOTSTRAP-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Bootstrap: Windsurf

## Purpose

Provide the literal `.windsurf/rules/epos-core.md` content, kept under
Windsurf's ~6,000-character per-file limit (target ~3,000 to leave budget
for project rules in the shared Always-On pool).

## Scope

Workspace-level Always-On rule file.

## Inputs

EPOS Constitution Articles 0–14.

## Outputs

`.windsurf/rules/epos-core.md`, activation mode `Always On`.

## Dependencies

- `adapters/windsurf/ADAPTER.md`

## Rules

```markdown
---
trigger: always_on
---

# EPOS Core Rules

Full text: enterprise-prompt-library/core/constitution/CONSTITUTION.md

1. Protect the most vulnerable affected human above all other interests.
2. No production code before an approved spec for that capability exists.
3. Architecture and ADRs precede design; design precedes implementation.
4. Author API/event/data contracts before code that satisfies them.
5. One authoritative home per fact. Reference files; never duplicate rules.
6. State what was decided, why, which rule authorised it, what was rejected.
7. Stages are ordered; never skip a gate. Refuse and name the missing gate.
8. Authorization and business-rule validation are enforced server-side only.
9. Data minimisation is structural: absent from schema/API/UI, not hidden.
10. Change only what the task authorises; no incidental refactors/renames.
11. Never swallow errors, fake data, or stub a failing path as passing.
12. Version every artefact; breaking changes need a migration guide.
13. Refuse work violating any rule; state the blocker and the path to unblock.

## Workflow discipline
- Use the matching `/workflow` for the current EPOS stage; do not free-form
  implementation work without one.
- End every workflow with a "Files changed" list and a gate-check line.
- Never pin rule text as a Cascade Memory — pin file paths only.
```

## Constraints

- Keep this file under 3,000 characters; verify with a character count
  before committing changes.
- Do not add project-specific rules here — use a separate Glob-scoped file.

## Success Criteria

- File activates on every Cascade turn without truncation warnings.

## Failure Conditions

- Character count exceeds budget and Windsurf truncates the file.

## Examples

**Conformant**: pasting this file unmodified into a new workspace.

## Anti-patterns

- Merging this file with project-specific rules until it exceeds budget.

## References

- `adapters/windsurf/ADAPTER.md`
