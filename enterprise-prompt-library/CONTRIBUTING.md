---
id: EPOS-CTB-001
version: 1.0.0
status: ACCEPTED
---

# Contributing to EPOS

## Purpose

Explain how to add or change a prompt without breaking the Single Source of
Truth.

## Scope

All contributions to `core/`, `adapters/`, `templates/`, `validation/`,
`release/`, `docs/`, `examples/`, `assets/`.

## Inputs

A concrete problem: a rule that is missing, ambiguous, duplicated, or violated
in practice.

## Outputs

A change request containing: the affected layer, the new or edited file, the
impact scan, and the version bump proposal.

## Dependencies

- `GOVERNANCE.md`
- `docs/AUTHORING-GUIDE.md`
- `docs/VERSIONING.md`

## Rules

1. **Locate the right layer first.** New rule → `core/`. New way of expressing
   an existing rule for one tool → `adapters/`. New reusable task → `templates/`.
   New detection → `validation/`. New shipping check → `release/`.
2. **No duplication.** Search before writing. If the rule exists, reference it.
3. **Twelve sections.** Every file uses the mandatory section contract.
4. **Front matter.** `id`, `version`, `status`, and `depends_on` where relevant.
5. **Stable IDs.** IDs are never reused or renumbered.
6. **Impact scan.** List every file affected and update them in the same change.
7. **Examples and anti-patterns are mandatory**, and must be realistic.
8. **Validators never auto-fix.** A contribution that adds auto-repair to a
   validator is rejected.
9. **Language.** English for rule text; adapters may add localised examples.
10. **Prove it.** Include the before/after assistant behaviour the change
    produces.

## Constraints

- Maximum one rule per numbered item.
- No tool-specific detail inside `core/`.
- No new dependencies on proprietary formats in `core/`.

## Success Criteria

- `validation/traceability-review/` passes on the changed files.
- `validation/quality-gate/G0-G7.md` finds no contradiction.
- The change is smaller than the problem it solves.

## Failure Conditions

- A rule added in two layers.
- A section omitted.
- An adapter change that alters meaning rather than form.

## Examples

**Good** — "Cursor ignores long system rules after ~500 lines; split
`adapters/cursor/` bootstrap into always-on core and on-demand references."
Form changed, meaning preserved.

**Bad** — "Cursor users find ADRs slow, so the Cursor adapter allows skipping
them." Meaning changed in a derived layer.

## Anti-patterns

- Copy-pasting a core rule into a template "for convenience".
- Silent renumbering of IDs.
- Adding a template that overlaps an existing one by 80%.

## References

- `GOVERNANCE.md`
- `docs/AUTHORING-GUIDE.md`
