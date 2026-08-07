---
id: EPOS-ADAPTER-CONTINUE-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Adapter: Continue

## Purpose

Translate EPOS core rules into Continue's `config.yaml` rule blocks and model
routing so that autocomplete, chat, and agent modes all operate under the
same governance regardless of which local or hosted model is selected.

## Scope

Applies to Continue (VS Code / JetBrains extension) using `config.yaml`
(v1 schema) or legacy `.continuerc.json`, including `rules` blocks, custom
`assistant` blocks, and slash commands.

## Inputs

- `config.yaml` `rules:` array (global and per-model)
- `.continue/rules/*.md` reusable rule blocks
- Model routing table (chat model, autocomplete model, embeddings model)
- EPOS quality gate status

## Outputs

- Rule-scoped behaviour per interaction mode (autocomplete vs chat vs agent)
- Refusals when a model without agentic tool access is asked to perform
  actions requiring file writes or shell access

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/workflow/WORKFLOW.md`
- `BOOTSTRAP.md` (this directory)

## Rules

### Context Window Strategy

`config.yaml` `rules` entries are injected as system-prompt fragments on
every chat/agent turn; keep the always-on block short (~120 lines) and use
`rules` with `globs` to scope longer, file-type-specific guidance (e.g. a
rule that only loads when editing `**/*.sql`) so token budget scales with
the local model's actual context window, which is often far smaller than
hosted-model defaults.

### Prompt Style

Short declarative rules, one per bullet. Continue supports per-rule
`name`/`description` metadata — use it so the rule picker and any
model-side rule-selection heuristic can identify EPOS rules distinctly from
project style rules.

### Iteration Strategy

Continue separates three interaction surfaces with different iteration
loops:

| Surface | Iteration model | EPOS constraint |
| --- | --- | --- |
| Autocomplete (Tab) | Single-shot, no review step | Never trusted for anything crossing Article 8/9 boundaries; suppress via `.continueignore` on auth/schema files if the local model is unreliable |
| Chat | Multi-turn, no file writes | Used for Ask/Architect-equivalent work: spec/ADR discussion |
| Agent | Multi-turn with tool calls (read/edit/terminal) | Used for Code/Debug-equivalent work; gated the same as any other implementation surface |

### Memory Strategy

Continue has no cross-session memory by default. Durable facts (contracts,
ADRs) must live in the repository, referenced by rule `globs`, not
restated. `@codebase` and `@docs` context providers are the retrieval path
for prior decisions — configure `docs` context providers to index
`core/` and `templates/` so agent mode can cite article numbers.

### File Strategy

- `config.yaml` at repo root — model routing + global `rules`.
- `.continue/rules/epos-core.md` — constitution excerpt (always on).
- `.continue/rules/stage-*.md` — per-stage rule, scoped with `globs` to the
  relevant directories (e.g. `stage-api.md` scoped to `**/api/**`).
- `.continueignore` — excludes generated/secret files from context and
  autocomplete, mirroring Article 9 data-minimisation at the tool level.

### Validation Strategy

Agent mode's terminal tool is the enforcement point: require it to run the
repository's test/lint command before declaring a task complete, and to
paste failures verbatim rather than summarising them away (Article 11).

### Review Strategy

Route implementation work to a routing target with an explicit "editor"
role model (see `models:` block) distinct from the "chat" role model where
local-model quality varies; require agent-mode diffs to be reviewed against
the contract path referenced in the triggering rule before acceptance.

## Constraints

- Autocomplete must never be the sole mechanism for producing
  authorization/validation logic (Article 8).
- `.continueignore` must exclude `.env*`, credential files, and PII fixtures.
- No `rules` entry may soften a constitution article's wording.

## Success Criteria

- Every rule file declares its `globs` scope explicitly; none rely on
  accidental always-on inclusion.
- Agent-mode sessions report test/lint output before closing a task.

## Failure Conditions

- A security-relevant rule scoped so narrowly it never loads.
- Autocomplete-generated authorization code merged without an agent/chat
  review pass.

## Examples

**Conformant**

> Agent mode, before finishing: "Ran `npm test`: 42 passed, 0 failed. Files
> changed: 3, all within `src/api/orders/` as authorised by `API-ORD-014`."

## Anti-patterns

- One monolithic always-on rule file duplicating the whole constitution.
- Using autocomplete to fill in a permissions check "because it's faster."

## References

- `core/constitution/CONSTITUTION.md`
- `adapters/continue/BOOTSTRAP.md`
