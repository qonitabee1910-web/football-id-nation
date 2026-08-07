---
id: EPOS-ADAPTER-CURSOR-BOOTSTRAP-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001, EPOS-ADAPTER-CURSOR-001]
---

# Cursor Bootstrap File

## Purpose

Provide the literal `.cursor/rules/epos-core.mdc` file content to install in
any repository opened with Cursor.

## Scope

Every Cursor-managed repository under EPOS governance.

## Inputs

`core/constitution/CONSTITUTION.md`.

## Outputs

`.cursor/rules/epos-core.mdc` at repository root.

## Dependencies

`adapters/cursor/ADAPTER.md`.

## Rules

Create `.cursor/rules/epos-core.mdc` with exactly this content:

```markdown
---
description: EPOS core governance — always enforced, all files
alwaysApply: true
---

# EPOS Core Rules (Constitution v1.0.0)

You must obey these rules on every request in this repository. If a request
conflicts with a rule, refuse and state which rule blocks it and what is
missing to unblock it (do not proceed anyway).

1. Human safety and the most vulnerable affected user outrank all else.
2. Never write production code without an approved spec for that capability.
3. Architecture/design decisions precede implementation; record an ADR first
   for any new architectural decision.
4. Contracts (API/data/event) are authored before the code implementing them.
5. Never duplicate a rule or fact across files; reference the single source.
6. Every change traces to a requirement, ADR, or contract; state it.
7. Do not skip pipeline stages (spec -> design -> contract -> code -> test).
8. Enforce authorization and business validation server-side only; treat any
   client-side check as presentation-only, never as the real guard.
9. Do not add data fields, endpoints, or UI beyond what the task requires.
10. Change only the files/lines the task requires. No incidental refactors,
    renames, dependency bumps, or deletions.
11. Never swallow, ignore, or fake around an error. Surface it typed and
    logged. Do not stub a failing path to look successful.
12. Version breaking changes; add a migration note.
13. Apply these rules identically regardless of framework or file type.
14. If a prerequisite (spec, ADR, contract, passing tests) is missing, refuse
    the task and name exactly what is missing.

## Before finishing any multi-file task
- Run the project's lint, typecheck, and test commands in the terminal.
- Paste the actual command output; do not summarise a failure as a pass.
- List every file changed and why, mapped to the rule or ticket that required it.
```

## Constraints

File must remain at `.cursor/rules/epos-core.mdc` with `alwaysApply: true`;
do not split its content into a lower-priority glob-scoped rule.

## Success Criteria

File exists verbatim (or with only added project-specific reference links) in
every governed repository.

## Failure Conditions

File missing, renamed, or `alwaysApply` set to false.

## Examples

See `adapters/cursor/ADAPTER.md`.

## Anti-patterns

Merging this file's content into `.cursorrules` (legacy, deprecated by Cursor)
instead of `.cursor/rules/`.

## References

- `adapters/cursor/ADAPTER.md`
- `core/constitution/CONSTITUTION.md`
