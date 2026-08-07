---
id: EPOS-ADAPTER-COPILOT-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# GitHub Copilot Adapter

## Purpose

Translate EPOS core rules into GitHub Copilot's repository-level instructions
format and its three distinct surfaces — inline completions, Copilot Chat, and
the Copilot coding agent — none of which share a plan/memory model with
agentic tools like Cursor or Claude Code.

## Scope

Repositories using Copilot inline suggestions, Copilot Chat (IDE or
github.com), and/or the asynchronous Copilot coding agent (PR-based) under
EPOS governance.

## Inputs

- `core/constitution/CONSTITUTION.md`
- Repository structure, open files, and recently edited files (Copilot's
  strongest local-inference signal)

## Outputs

- `.github/copilot-instructions.md` (repo-wide instructions, all surfaces)
- Optional `.github/instructions/*.instructions.md` with `applyTo` globs
  (path-scoped instructions, VS Code/Copilot Chat)

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`

## Rules

### Context Window Strategy

Copilot's inline completion model reasons almost entirely on local
signal — the current file, cursor position, and a handful of open tabs — with
weak long-context recall; it does not reliably "remember" a rule stated only
in chat 20 turns ago. `.github/copilot-instructions.md` is the only artefact
guaranteed to be considered on every Copilot Chat and coding-agent request in
the repo; keep it short (roughly 200-400 words of hard rules) because Copilot
truncates/deprioritises very long instruction files.

### Prompt Style

Write short, imperative, per-topic bullet rules, not narrative prose — Copilot
pattern-matches instructions against the current file's language/framework
better than it parses long conditional logic. Use path-scoped
`*.instructions.md` files with `applyTo: "**/api/**"` for layer-specific rules
(e.g., contract-first for API code) rather than one large undifferentiated
file.

### Iteration Strategy

Inline completions are single-suggestion, no iteration loop, and must be
manually accepted/rejected per line — treat them as never authoritative for
security or architecture decisions (Article 8, Article 2). Copilot Chat is a
turn-based conversational loop scoped to the open editor/workspace context;
use it for Q&A and small multi-file edits with explicit review. The Copilot
coding agent runs asynchronously in a sandboxed environment against an
assigned issue and opens a PR — this is the only Copilot surface capable of
autonomous multi-file work, and it must be assigned only tasks with an
approved spec/ADR already in the repo (Article 1).

### Memory Strategy

No persistent memory across sessions beyond
`.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`,
and (for the coding agent) the assigned GitHub issue body/comments. Do not
assume Copilot Chat "remembers" earlier chat sessions; restate task-specific
constraints in the issue or chat each time.

### File Strategy

Copilot infers heavily from files currently open in the editor and from
recently edited files in the workspace; keep spec/contract files open or
referenced explicitly when requesting related code so inline suggestions align
with the contract. For the coding agent, ensure the target issue links
directly to the spec/ADR/contract files since the agent has no chat history to
draw on beyond the issue thread.

### Validation Strategy

Copilot has no native gate runner. Configure required CI checks (lint, test,
build, and an EPOS conformance scan) as branch protection on any PR the coding
agent opens, since the agent's own self-review is not a substitute for
Article 11 no-silent-failure enforcement. Instruct via
`copilot-instructions.md` that the agent must run and report real test output
before marking a PR ready for review.

### Review Strategy

Every coding-agent PR requires human review before merge; Copilot coding agent
PRs are explicitly designed to be reviewed like any contributor's PR, not
auto-merged. Inline suggestions require the accepting developer to treat
Article 8/Article 9 (server-side authorization, data minimisation) as their
own responsibility — Copilot completion acceptance carries no governance
check.

## Constraints

- `.github/copilot-instructions.md` must not exceed roughly 2 pages; excess
  detail belongs in path-scoped `*.instructions.md` files.
- The coding agent must never be assigned an issue lacking an approved spec
  reference (Article 1/14).
- Branch protection must require CI green before any Copilot-authored PR
  merges.

## Success Criteria

- `.github/copilot-instructions.md` present and enforces Articles 8, 10, 11
  explicitly.
- Every coding-agent PR references the issue/spec it implements.
- No inline-suggestion-derived authorization code merges without human review.

## Failure Conditions

- Missing `.github/copilot-instructions.md`.
- Coding agent assigned an issue with no linked specification.
- Merged PR containing client-side-only authorization from accepted
  completions.

## Examples

**Conformant**

> Issue assigned to Copilot coding agent links `contracts/openapi.yaml#L120`
> and ADR-014; agent opens a PR implementing exactly that contract, CI passes,
> a human reviewer approves.

## Anti-patterns

- Accepting a long chain of inline completions for an auth check without
  reading each line.
- One giant `copilot-instructions.md` mixing code-style preferences with
  security rules, causing the security rules to be truncated.
- Merging a coding-agent PR because "CI is probably fine".

## References

- `adapters/README.md`
- `adapters/copilot/BOOTSTRAP.md`
- `core/constitution/CONSTITUTION.md`
