---
id: EPOS-ADAPTER-AIDER-BOOTSTRAP-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Bootstrap: Aider

## Purpose

Provide the literal `CONVENTIONS.md` content and `.aider.conf.yml` skeleton
for Aider, sized for concatenation into every prompt without degrading
editor-model diff quality.

## Scope

Repository-root `CONVENTIONS.md` and `.aider.conf.yml`.

## Inputs

EPOS Constitution Articles 0–14.

## Outputs

Two paste-ready files.

## Dependencies

- `adapters/aider/ADAPTER.md`

## Rules

Create `CONVENTIONS.md` with the block below.

```markdown
# Conventions (EPOS-governed)

1. No code without an approved spec/contract for this exact capability.
2. Contracts are authored before the code that satisfies them; never infer
   an API shape from existing code alone.
3. Change only files explicitly added to this chat session.
4. One logical change per commit; commit message cites the spec/contract ID.
5. Authorization and business-rule checks are server-side only.
6. Do not fake data, stub a failing path, or swallow errors to look done.
7. If a prerequisite (spec, ADR, contract) is missing, stop and say so —
   do not guess and proceed.
8. State which rule/contract authorised each change before writing the diff.
9. Run the project's lint and test commands after every change; report
   failures verbatim.
```

Add to `.aider.conf.yml`:

```yaml
read:
  - CONVENTIONS.md
auto-commits: true
architect: true
model: <your-architect-model>
editor-model: <your-editor-model>
lint-cmd: "<project lint command>"
test-cmd: "<project test command>"
```

## Constraints

- `CONVENTIONS.md` stays under ~60 lines; longer content should live in
  `/read-only`-loaded contract files, not here.

## Success Criteria

- Aider prints `CONVENTIONS.md` inclusion in `/tokens` output.
- Auto-commit produces one commit per accepted diff with a spec ID in the
  message.

## Failure Conditions

- `read:` omitted from `.aider.conf.yml`, silently dropping the conventions.

## Examples

**Conformant**: fresh repo, paste both blocks, run `aider --architect`.

## Anti-patterns

- Embedding entire API contracts inside `CONVENTIONS.md` instead of
  `/read-only`-loading them per session.

## References

- `adapters/aider/ADAPTER.md`
