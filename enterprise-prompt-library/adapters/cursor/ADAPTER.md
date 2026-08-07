---
id: EPOS-ADAPTER-CURSOR-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Cursor Adapter

## Purpose

Translate EPOS core rules into Cursor's native rules format
(`.cursor/rules/*.mdc`), composer/agent conventions, and @-mention context
model, without adding, removing, or softening any Constitution article.

## Scope

All repositories opened in Cursor (Composer, Agent mode, Tab/inline edits)
under EPOS governance.

## Inputs

- `core/constitution/CONSTITUTION.md` and core principles/workflow
- Existing `.cursor/rules/*.mdc` files and `.cursorignore`
- Repository file tree for @-mention targeting

## Outputs

- `.cursor/rules/epos-core.mdc` (always-applied constitution digest)
- Scoped `.cursor/rules/*.mdc` files with `globs` for specific stages/layers

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`

## Rules

### Context Window Strategy

Cursor injects `.mdc` rules with `alwaysApply: true` into every request
regardless of window size, plus glob-matched rules for touched files, plus
whatever the user @-mentions. Long-context degradation is real: Cursor
silently drops or deprioritises far-back chat turns and large files beyond its
effective attention budget even inside a large nominal context window. Put
non-negotiable rules in an always-applied rule (small, <150 lines); put
stage/layer-specific detail in glob-scoped rules so they load only when
relevant, keeping total injected context small.

### Prompt Style

Use imperative, testable statements in `.mdc` files ("Never call the DB from a
React component"; not "try to keep layers separate"). Cursor's agent treats
rules as system-level constraints it checks before acting, so vague or
opinion-toned rules are frequently ignored. Reference specific paths/globs
rather than prose descriptions of "the API layer".

### Iteration Strategy

Composer/Agent mode executes multi-file agentic loops with an in-editor diff
review per file. Use Agent mode for cross-file governance-driven work (new
endpoint plus contract plus test) and Tab/inline edit only for local,
already-approved changes. Require the agent to stop and present a plan before
multi-file changes on capabilities not yet covered by an ADR (Article 2);
encode this as a rule with `alwaysApply: true`, since Cursor has no separate
plan-mode toggle distinct from asking for one.

### Memory Strategy

Cursor has no persistent cross-session memory beyond `.cursor/rules/*.mdc`,
`.cursorrules` (legacy, superseded by rules dir), and the codebase-indexed
embeddings used for @codebase search. Treat `.cursor/rules/` as the only
durable memory; anything needed on every task must live there, not in chat.

### File Strategy

Use `.cursorignore` to exclude generated artefacts, secrets, and large
vendored code from indexing and from being pulled into context accidentally.
Use `globs:` in each `.mdc` rule to scope applicability (e.g.
`globs: ["src/api/**/*.ts"]` for contract-first API rules) so unrelated file
edits do not load unrelated governance text. Use `@filename`/`@folder`
mentions to force-include specs/ADRs/contracts that live outside the glob
scope of the current edit.

### Validation Strategy

Cursor has no built-in gate runner; wire a rule that instructs the agent to
run the matching `validation/` prompt (as a chat request) and the project's
lint/test/build commands via the integrated terminal before declaring a task
complete. Require the agent to paste command output, not summarise it,
satisfying Article 11 (no silent failure).

### Review Strategy

Every agent-produced change surfaces as a per-file diff in the Cursor editor;
require human approval of each diff before accepting, especially for
server-side authorization files (Article 8) and schema/migration files
(Article 9). Do not enable auto-accept-all for changes touching `core/`
adapters, security, or database migrations.

## Constraints

- `.cursor/rules/epos-core.mdc` must never be marked `alwaysApply: false`.
- Glob-scoped rules must not restate core rules with different wording;
  they may only add tool-specific enforcement detail.
- `.cursorignore` must never exclude files required for a quality gate review.

## Success Criteria

- `.cursor/rules/epos-core.mdc` present and always-applied in every repo.
- Agent-mode multi-file changes are always presented as reviewable diffs.
- No repository has a `.cursorrules` file contradicting `.cursor/rules/`.

## Failure Conditions

- Missing or non-`alwaysApply` core rule file.
- Agent auto-accepting authorization or migration changes without review.
- A glob-scoped rule that softens an always-applied rule for its file set.

## Examples

**Conformant**

> Rule (`globs: ["src/api/**"]`): "Before adding a route, verify
> `contracts/openapi.yaml` defines it. If not, stop and request the contract
> be authored first (Article 3)."

## Anti-patterns

- One giant `.cursorrules` file mixing style preferences with governance.
- Marking security-relevant rules `alwaysApply: false` "to save context".
- Accepting all agent diffs in one click on a security-sensitive PR.

## References

- `adapters/README.md`
- `adapters/cursor/BOOTSTRAP.md`
- `core/constitution/CONSTITUTION.md`
