---
id: EPOS-ADAPTER-WINDSURF-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Adapter: Windsurf

## Purpose

Translate EPOS core rules into Windsurf's `.windsurf/rules/*.md` files,
Cascade memories, and workflows, respecting Windsurf's character-limited
activation modes so governance survives truncation instead of failing
silently.

## Scope

Applies to Windsurf's Cascade agent, `.windsurf/rules/` (workspace and
global), `.windsurf/workflows/*.md`, and Cascade Memories.

## Inputs

- `.windsurf/rules/*.md`, each with an activation-mode header
  (`Always On`, `Manual`, `Model Decision`, `Glob`)
- `.windsurf/workflows/*.md` (slash-invokable multi-step procedures)
- Cascade Memories (auto-generated and manually pinned)
- EPOS quality gate status

## Outputs

- Rule activation matched to task type without exceeding character budgets
- Workflow-driven stage execution (one workflow per EPOS stage)
- Refusal when Cascade Memories conflict with current repository state

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/workflow/WORKFLOW.md`
- `BOOTSTRAP.md` (this directory)

## Rules

### Context Window Strategy

Each Windsurf rule file has a **6,000-character limit**; the combined
"Always On" rule set has a workspace-wide cap (character budget shared
across all Always-On files). Keep the EPOS core rule file near 3,000
characters and push stage/domain detail into `Glob`-scoped or
`Model Decision`-scoped files so they load only when relevant, protecting
budget for project-specific rules.

### Prompt Style

Terse imperative bullets; Cascade's rule engine performs best with short,
independently-true statements rather than prose paragraphs, since rules are
concatenated and truncated at the character boundary if oversized.

### Iteration Strategy

Map EPOS stages to Windsurf **workflows** (`.windsurf/workflows/*.md`,
invoked with `/workflow-name`), each a numbered procedure ending in an
explicit gate check:

| EPOS Stage | Workflow file | Gate check at end |
| --- | --- | --- |
| G1 Architecture | `architecture-adr.md` | ADR recorded before exit |
| G3–G4 Data/API | `contract-first.md` | Contract file exists and is referenced |
| G6 Implementation | `implement-scoped.md` | Diff limited to files named in the contract |
| G7 Release | `release-readiness.md` | Checklist in `release/` fully green |

### Memory Strategy

Cascade auto-generates Memories from session activity; treat them as
**cache, not truth**. Pin only durable, reference-safe facts (e.g. "contract
for Orders API lives at `templates/api/orders.md`") and never pin business
logic or rule text that already lives in `core/` — that duplicates Article 4.
Purge memories that reference deleted or superseded artefacts.

### File Strategy

- `.windsurf/rules/epos-core.md` — Always On, constitution digest (~3,000
  chars).
- `.windsurf/rules/stage-*.md` — Glob-scoped (e.g. `**/api/**`) or
  Model-Decision-scoped, loaded contextually.
- `.windsurf/workflows/*.md` — one per EPOS stage transition.
- Global rules (`~/.codeium/windsurf/memories/global_rules.md`) reserved for
  organisation-wide EPOS defaults shared across repositories; workspace
  rules override/extend, never contradict, the global file.

### Validation Strategy

Each workflow's final step invokes the project's lint/test command via
Cascade's terminal tool and requires pasting the result before the workflow
is marked complete (Article 11).

### Review Strategy

Cascade's diff view is the review surface: workflows must end with a
"Files changed" summary listing only files declared in-scope at workflow
start, flagging any Cascade attempted to touch outside that list.

## Constraints

- No single rule file may exceed Windsurf's per-file character limit;
  files that would exceed it must be split by Glob scope.
- Cascade Memories must never store the constitution text itself, only
  pointers to it.
- Global rules may not be overridden by a workspace rule to weaken them.

## Success Criteria

- `epos-core.md` fits within budget with room for one project-specific
  Always-On rule file.
- Every stage transition runs through its named workflow, ending in a
  logged gate check.

## Failure Conditions

- Always-On rule set silently truncated because combined size exceeded budget.
- A Memory persisting a rule that later diverges from `core/`.
- A workflow completing without a "Files changed" summary.

## Examples

**Conformant**

> `/contract-first` workflow run for the Orders API produces
> `templates/api/orders.md`, references `ORD-API-003`, and ends with
> "Gate check: contract file present — G4 exit conditions met."

## Anti-patterns

- Pinning the full constitution text as a Cascade Memory.
- One 8,000-character Always-On rule file that gets silently truncated.

## References

- `core/constitution/CONSTITUTION.md`
- `adapters/windsurf/BOOTSTRAP.md`
