---
id: EPOS-ADAPTER-AIDER-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Adapter: Aider

## Purpose

Translate EPOS core rules into Aider's convention-file, repo-map, and
architect/editor model-pairing workflow, preserving Article 1 (spec-first)
and Article 10 (least change) inside Aider's diff-oriented edit loop.

## Scope

Applies to Aider CLI sessions using `CONVENTIONS.md`, `.aider.conf.yml`,
`/read-only`, `/architect`, and git-integrated auto-commit behaviour.

## Inputs

- `CONVENTIONS.md` (loaded via `--read` or `.aider.conf.yml` `read:`)
- Aider's automatic repo map (ctags-based file/symbol summary)
- `.aider.conf.yml` model configuration (architect model, editor model)
- EPOS quality gate status

## Outputs

- One git commit per approved, scoped change
- Diffs constrained to files explicitly added to the chat
- Refusal to proceed when no approved contract/spec is in context

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `BOOTSTRAP.md` (this directory)

## Rules

### Context Window Strategy

Aider's repo map gives the model a compressed structural view of the whole
repository without full file contents, so the model "knows" what exists
without spending tokens on it. Only files added with `/add` enter full-text
context and become editable; everything else stays map-only. Use `/read-only`
for contracts, ADRs, and `CONVENTIONS.md` itself so they inform the model
without being candidates for edits.

### Prompt Style

`CONVENTIONS.md` is plain, imperative, project-agnostic-then-specific:
constitution rules first, then repo conventions (naming, test locations,
commit message format). Aider concatenates it into every prompt, so keep it
terse — long conventions files degrade diff quality on weaker editor models.

### Iteration Strategy

Aider's edit loop is: propose diff → auto-apply → auto-commit. This
collapses Article 6 (explainability) and Article 10 (least change) into a
pre-diff discipline, not a post-hoc review:

- Add only the files relevant to the current task with `/add`.
- Add contracts/specs with `/read-only` so they are visible but not edited.
- One logical change per message; require a git commit per accepted change
  (`--auto-commits` on, with descriptive messages referencing the spec ID).
- Never accept a diff that touches a file not explicitly added.

### Memory Strategy

Aider retains conversation history within a session (`.aider.chat.history.md`)
and can restore it, but this is a chat log, not a source of truth. Durable
decisions live in `CONVENTIONS.md`, ADRs, and contracts under version
control per Article 4 — never in the chat history alone.

### File Strategy

- `CONVENTIONS.md` — EPOS rules + repo conventions, loaded via
  `.aider.conf.yml: read: [CONVENTIONS.md]`.
- `.aider.conf.yml` — model routing: `architect-model` (planning/reasoning)
  paired with `editor-model` (fast, precise diff application) via Aider's
  `--architect` mode.
- `.aiderignore` — excludes secrets, generated files, large fixtures from
  the repo map and context, mirroring Article 9.

### Validation Strategy

Configure `.aider.conf.yml` `lint-cmd`/`test-cmd` so Aider runs them
automatically after each edit and surfaces failures before the commit is
finalised (Article 11); a failing test blocks the auto-commit.

### Review Strategy

Architect+editor pairing is itself a review gate: the architect model
proposes the change in prose/pseudo-diff, a human or the editor model
confirms scope before the editor model writes the actual diff. Reject any
architect proposal that expands scope beyond the files added to the chat.

## Constraints

- `/add` only files the current task is authorised to change; never
  `/add *` or whole-directory globs for implementation tasks.
- Auto-commit must remain on with one commit per change — squashing defeats
  Article 5 traceability.
- `CONVENTIONS.md` may not restate constitution articles with altered wording.

## Success Criteria

- Every commit message references the authorising spec/contract ID.
- No commit touches a file that was not explicitly `/add`-ed for that task.
- Test/lint command runs and passes before each commit.

## Failure Conditions

- A diff touching files never added to the chat.
- Auto-commit disabled, producing an unreviewable multi-change blob.
- `CONVENTIONS.md` exceeding a size that visibly degrades editor-model diffs.

## Examples

**Conformant**

> `/read-only contracts/orders-api.yaml`
> `/add src/api/orders/handler.ts`
> "Implement POST /orders per contract §3.2." → single scoped diff, one commit
> `feat(orders): implement POST /orders per ORD-API-003`.

## Anti-patterns

- `/add src/**` to "make sure the model has everything."
- Batching five unrelated fixes into one commit to save time.
- Skipping `/read-only` on the contract and letting the model infer the API shape.

## References

- `core/constitution/CONSTITUTION.md`
- `adapters/aider/BOOTSTRAP.md`
