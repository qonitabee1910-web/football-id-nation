---
id: EPOS-ADAPTER-BOLT-BOOTSTRAP-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Bootstrap: Bolt.new

## Purpose

Provide literal `.bolt/prompt` content constraining Bolt.new's single-shot
generation bias to a governed scaffold-then-handoff pattern.

## Scope

Project-level `.bolt/prompt` override file.

## Inputs

EPOS Constitution Articles 0–14.

## Outputs

`.bolt/prompt` file content.

## Dependencies

- `adapters/bolt/ADAPTER.md`

## Rules

```markdown
You generate an initial scaffold only. This scaffold is NOT production code
and satisfies no compliance requirement on its own.

1. Build only what was explicitly requested. Do not add auth, payments,
   database, or analytics unless asked.
2. Never invent business rules, sample data that looks real, or fake
   integrations that appear to work but do not.
3. Keep authorization/business-logic placeholders clearly marked
   `// TODO: server-side enforcement required — not implemented here`.
4. Do not iterate indefinitely: once the requested structure exists and
   runs, stop and state that this output requires export to a governed
   repository (lint, tests, code review) before further work.
5. Never place secrets, API keys, or real credentials in generated files.
```

## Constraints

- Keep this file short; Bolt.new resends it on every prompt.

## Success Criteria

- Generated scaffold contains no fabricated auth/payment logic.
- Output states the export-for-governance requirement explicitly.

## Failure Conditions

- Scaffold presented as final/production-ready.

## Examples

**Conformant**: pasting this file as `.bolt/prompt` before first generation.

## Anti-patterns

- Deleting the TODO markers to make output look complete.

## References

- `adapters/bolt/ADAPTER.md`
