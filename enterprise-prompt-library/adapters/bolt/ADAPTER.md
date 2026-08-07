---
id: EPOS-ADAPTER-BOLT.NEW-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Adapter: Bolt.new

## Purpose

Translate EPOS core rules into Bolt.new's `.bolt/prompt` file and constrain its single-shot, in-browser WebContainer generation bias so scaffolds are governed before they multiply.

## Scope

Applies to Bolt.new sessions running in the browser WebContainer, including `.bolt/prompt`, `.bolt/ignore`, and the diff-preview/apply loop.

## Inputs

- `.bolt/prompt` (project-level system prompt override)
- `.bolt/ignore` (files excluded from context)
- WebContainer file tree state
- EPOS quality gate status

## Outputs

- A scaffold explicitly marked ungoverned until handed off
- Refusal to keep iterating token-expensively on unapproved architecture

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `BOOTSTRAP.md` (this directory)

## Rules

### Context Window Strategy
Bolt.new sends the full current file tree (minus `.bolt/ignore`) on every
generation; token cost scales with project size, so `.bolt/ignore` must
exclude `node_modules`, build output, and large fixtures aggressively —
this is a cost control, not optional hygiene.

### Prompt Style
`.bolt/prompt` is a single override file replacing Bolt's default system
prompt; keep it short and directive: scaffold-then-stop, not
scaffold-then-embellish.

### Iteration Strategy
Bolt.new is biased toward single-shot full-app generation. Treat the first
generation strictly as an **unreviewed scaffold**: it satisfies no EPOS gate.
Every subsequent prompt is expensive (full tree re-sent) — batch intended
changes into one instruction rather than iterating turn-by-turn, and stop
generating once the scaffold reaches the point where governed tooling
(a real repo, linter, CI) should take over.

### Memory Strategy
No persistent memory between sessions beyond the file tree itself and
`.bolt/prompt`. Nothing else survives — do not rely on conversation history
for governance; bake constraints into `.bolt/prompt`.

### File Strategy
`.bolt/prompt` carries the EPOS scaffold constraints; `.bolt/ignore`
excludes secrets and build artefacts; no other Bolt-specific config exists.

### Validation Strategy
Bolt.new has no built-in test runner beyond what the WebContainer can
execute; require the generated scaffold to include a working
lint/test script, and treat "it renders in the preview" as insufficient
verification (Article 11 — visual success without test evidence is not
success).

### Review Strategy
Mandatory human export-and-review step: no Bolt.new scaffold is treated as
implementation-ready until exported (via StackBlitz/GitHub push) into a
governed repository where the full adapter stack (lint, CI, code review)
applies.

## Constraints

- `.bolt/prompt` may not claim the scaffold satisfies any EPOS gate.
- Secrets must never enter WebContainer context; `.bolt/ignore` excludes `.env*`.
- No multi-turn iteration loop may substitute for governed code review.

## Success Criteria

- Every Bolt.new output is exported to a governed repo before merge.
- `.bolt/ignore` excludes all secret and build-artefact paths.

## Failure Conditions

- A scaffold generated, then never used for compliance sign-off directly — it is imported into a governed repo and re-validated there.

## Examples

**Conformant**

> Bolt.new generates a scaffold; `.bolt/prompt` instructs "produce the requested structure only, do not add authentication, payments, or database logic beyond what was asked"; output is exported to GitHub for governed review.

## Anti-patterns

- Treating a Bolt.new preview as production-ready because it visually works.
- Iterating ten times inside Bolt.new instead of exporting after the first viable scaffold.
- Letting `.env` values leak into WebContainer context.

## References

- `core/constitution/CONSTITUTION.md`
- `adapters/bolt/BOOTSTRAP.md`
