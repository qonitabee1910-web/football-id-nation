---
id: EPOS-ADAPTER-COPILOT-BOOTSTRAP-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001, EPOS-ADAPTER-COPILOT-001]
---

# GitHub Copilot Bootstrap File

## Purpose

Provide the literal `.github/copilot-instructions.md` content to install in
any repository using GitHub Copilot (inline, Chat, or coding agent).

## Scope

Every repository under EPOS governance that enables Copilot.

## Inputs

`core/constitution/CONSTITUTION.md`.

## Outputs

`.github/copilot-instructions.md` at repository root.

## Dependencies

`adapters/copilot/ADAPTER.md`.

## Rules

Create `.github/copilot-instructions.md` with exactly this content:

```markdown
# Repository instructions for GitHub Copilot (all surfaces)

This repository is governed by EPOS v1.0.0. Follow these rules in inline
completions, Copilot Chat answers, and coding-agent PRs.

## Hard rules
- Do not write implementation code for a capability that has no approved
  spec or ADR in this repo. If none exists, say so instead of guessing.
- Author or update API/data/event contracts before writing code against them.
- Enforce authorization and business-rule validation on the server only.
  Never treat a client-side check as sufficient; flag it if you see one.
- Do not add fields, endpoints, params, or screens beyond what was asked.
- Change only the files needed for the task. No incidental renames,
  refactors, formatting-only diffs, or dependency upgrades.
- Never swallow an error, return fake/mock data to mask a failure, or stub
  a broken path to look like it works. Surface and log real errors.
- Every non-trivial change must reference the issue, spec, or ADR it
  implements in the PR description or commit message.
- If a prerequisite (spec, contract, ADR, passing CI) is missing, stop and
  state exactly what is missing instead of proceeding.

## For the coding agent specifically
- Only work from an issue that links a spec/ADR/contract. If the assigned
  issue lacks one, comment asking for it instead of inventing a design.
- Run the full lint/typecheck/test suite before marking the PR ready; paste
  real output, not a summary, in the PR description.
- Keep the PR scoped to the linked issue only.

## For inline completions
- Do not accept multi-line suggestions for authorization, payment, or data
  export logic without reading every line against the rules above.
```

## Constraints

Content must not be reduced to style-only guidance; the hard rules list is
mandatory in full.

## Success Criteria

File present verbatim (plus optional project links) in every governed repo
using Copilot.

## Failure Conditions

Missing file, or file containing only formatting/style guidance without the
hard-rules section.

## Examples

See `adapters/copilot/ADAPTER.md`.

## Anti-patterns

Splitting the hard rules across many small `*.instructions.md` files such that
no single file guarantees they are all loaded together.

## References

- `adapters/copilot/ADAPTER.md`
- `core/constitution/CONSTITUTION.md`
