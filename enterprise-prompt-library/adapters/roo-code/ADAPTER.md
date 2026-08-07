---
id: EPOS-ADAPTER-ROOCODE-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Adapter: Roo Code

## Purpose

Translate the EPOS Constitution and core rules into Roo Code's native
configuration surface: `.roo/rules/`, custom modes, and mode-scoped
instruction files. This adapter binds Roo Code's multi-mode architecture to
EPOS stage-gate discipline without adding or softening any article.

## Scope

Applies to all Roo Code sessions (VS Code extension) operating on a
repository governed by EPOS. Covers Architect, Code, Ask, and Debug modes and
any custom mode derived from them.

## Inputs

- `.roo/rules/*.md` (workspace-level, always loaded)
- `.roomodes` (custom mode definitions, YAML)
- Mode-specific `.roo/rules-{mode}/*.md`
- Current EPOS quality gate status for the bounded context

## Outputs

- Mode selection that matches the current EPOS stage
- Roo Code responses that cite the article/rule authorising an action
- Explicit mode-switch refusal when the requested action belongs to another
  stage/mode

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/workflow/WORKFLOW.md`
- `core/quality-gates/QUALITY-GATES.md`
- `BOOTSTRAP.md` (this directory)

## Rules

### Context Window Strategy

Roo Code loads `.roo/rules/*.md` in full on every request plus the active
mode's `.roo/rules-{mode}/*.md`. Keep the shared file under ~150 lines;
push stage-specific detail into per-mode rule files so the model is never
carrying Architect-only detail while in Code mode. Reference EPOS templates
by path rather than pasting them; Roo Code can open files on demand via its
file-read tool.

### Prompt Style

Imperative, numbered, one rule per line. Roo Code's system prompt already
injects tool schemas and mode definitions, so `.roo/rules` content must stay
declarative (what is forbidden/required), not tool-usage instructions.

### Iteration Strategy

Map EPOS stages to modes 1:1 where possible:

| EPOS Stage | Roo Mode | Rationale |
| --- | --- | --- |
| G1 Architecture | Architect | Read-only planning, ADR authoring, no code edits |
| G2–G4 Domain/Data/API | Architect → Code handoff | Contracts drafted in Architect, implemented in Code |
| G6 Implementation | Code | Edits gated by approved contracts only |
| Any stage, investigation | Debug | Root-cause only, no unrelated fixes (Article 10) |
| Any stage, clarification | Ask | Read-only, no file writes |

A mode switch request that skips a required upstream gate is refused under
Article 7, citing the missing artefact.

### Memory Strategy

Roo Code has no long-term memory beyond the current session and the rule
files it reads each turn. Durable decisions (ADRs, contracts) live in the
repository per Article 4; `.roo/rules` must never restate them, only
reference their path. Session summaries are not persisted — re-load context
via `.roo/rules` + repository files at the start of every session.

### File Strategy

- `.roo/rules/` — constitution excerpt + workflow gate map (all modes).
- `.roo/rules-architect/` — ADR template pointer, contract-first mandate.
- `.roo/rules-code/` — least-change discipline, no stubbing, test mandate.
- `.roo/rules-debug/` — root-cause-only, explicit anti-scope-creep rule.
- `.roo/rules-ask/` — read-only enforcement, no code edits ever.
- `.roomodes` defines each custom mode's `groups` (tool permissions) so
  Architect and Ask cannot invoke `edit`/`command` groups — this is the
  mechanical enforcement of Article 8/Article 10, not merely a suggestion.

### Validation Strategy

Before exiting Code mode, Roo Code must run the project's lint/test command
and report failures verbatim (Article 11, no silent failure). Use the
`command` tool restricted to the allow-listed scripts in `.roomodes`.

### Review Strategy

Every Code-mode diff is summarized against the approved contract before
being presented; unrequested file changes are flagged, not silently
included, per Article 10. Architect mode output (ADRs) is treated as a
proposal until a human or the designated approval step accepts it.

## Constraints

- `.roomodes` tool groups must never grant Ask or Architect the `edit` group.
- Rule files may not restate constitution text verbatim beyond short quotes
  needed for the model to recognise the citation.
- No custom mode may bypass the mode-per-stage mapping without a recorded
  exception in the workspace `.roo/rules`.

## Success Criteria

- Mode used at any point in a session matches the current EPOS stage.
- Every Code-mode change cites the contract/spec it implements.
- Debug-mode sessions produce zero unrelated diffs.

## Failure Conditions

- Code mode invoked before an approved contract exists.
- Ask or Architect mode configured with edit/command tool groups.
- A rule duplicated with different wording across `.roo/rules-*` files.

## Examples

**Conformant**

> User in Code mode: "Add the endpoint." Roo Code: "No approved API contract
> for this endpoint under `templates/api/`. Switching to Architect mode to
> draft the contract first (Article 3)."

**Conformant**

> Debug mode isolates a null-pointer defect and proposes a single-line fix,
> declining to "clean up" adjacent unrelated code (Article 10).

## Anti-patterns

- Granting Architect mode the `edit` tool group "for convenience."
- One giant `.roo/rules` file duplicating the entire constitution.
- Switching to Code mode mid-conversation without an explicit gate check.

## References

- `core/constitution/CONSTITUTION.md`
- `core/workflow/WORKFLOW.md`
- `adapters/roo-code/BOOTSTRAP.md`
