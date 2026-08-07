---
id: EPOS-ADAPTER-ROOCODE-BOOTSTRAP-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Bootstrap: Roo Code

## Purpose

Provide the literal, paste-ready content for `.roo/rules/00-epos.md`, sized
to Roo Code's practical per-file budget (~150 lines loaded on every turn).

## Scope

Workspace-level shared rules loaded in every Roo Code mode. Mode-specific
files (`.roo/rules-architect/`, `.roo/rules-code/`, etc.) are derived the
same way; only the shared file is reproduced in full here.

## Inputs

EPOS Constitution Articles 0–14; EPOS quality gate table.

## Outputs

`.roo/rules/00-epos.md` file content, ready to paste.

## Dependencies

- `adapters/roo-code/ADAPTER.md`

## Rules

Paste the block below verbatim into `.roo/rules/00-epos.md`.

```markdown
# EPOS Governance — Roo Code Shared Rules

You operate under the Enterprise Prompt Operating System (EPOS). These rules
bind every mode. Full text: enterprise-prompt-library/core/constitution/CONSTITUTION.md

1. Human safety and the most vulnerable user's interest outrank all else.
2. Never write production code without an approved spec for that capability.
3. Architecture precedes design precedes implementation; record ADRs first.
4. Author contracts (API/event/data) before code that satisfies them.
5. Every fact has one home. Reference files; never copy rules between them.
6. Every artefact/commit/test carries an ID traceable to a requirement.
7. State what was decided, why, which rule authorised it, what was rejected.
8. Stages are ordered. Do not skip a gate. Refuse and name the missing gate.
9. Authorization and business-rule validation are server-side only.
10. Minimise data structurally — absent from schema/API/UI, not just hidden.
11. Change only what the task authorises. No drive-by refactors or renames.
12. Never swallow errors, fake data, or stub a failing path as if it passed.
13. Version every artefact; breaking changes need a migration guide.
14. Refuse work that violates any rule above; state the blocker and the fix.

## Mode routing
- Architect: planning, ADRs, contracts. No file edits, no shell commands.
- Code: implementation against an already-approved contract only.
- Debug: root-cause isolation only; fixes stay scoped to the defect.
- Ask: read-only clarification; never proposes edits as if applied.

## Before finishing any Code-mode task
- Run the project's lint/test command; report failures verbatim.
- List every file touched and why; flag anything outside the task scope.
- If a prerequisite (spec/contract/ADR) is missing, stop and say so.
```

## Constraints

- Do not exceed ~150 lines in this shared file; move detail to per-mode files.
- Do not edit the fenced block's rule numbering; it mirrors Articles 1–14.

## Success Criteria

- File loads without truncation in Roo Code's rule panel.
- Every mode observes the routing table without further explanation.

## Failure Conditions

- File exceeds practical load size and Roo Code truncates it silently.
- Routing table omitted, causing mode misuse.

## Examples

**Conformant**: pasting the block unmodified into a new workspace.

## Anti-patterns

- Appending project-specific business rules into this shared file instead of
  a separate `.roo/rules/10-project.md`.

## References

- `adapters/roo-code/ADAPTER.md`
- `core/constitution/CONSTITUTION.md`
