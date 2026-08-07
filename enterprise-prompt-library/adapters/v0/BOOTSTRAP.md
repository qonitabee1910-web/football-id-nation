---
id: EPOS-ADAPTER-V0-BOOTSTRAP-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Bootstrap: v0

## Purpose

Provide the literal prompt preamble to paste at the start of every v0.dev
generation session to enforce design-system conformance and hand-off
discipline.

## Scope

Per-session v0.dev chat preamble (v0 has no persistent config file).

## Inputs

EPOS Constitution Articles 0–14; project design-system token reference.

## Outputs

Paste-ready preamble text.

## Dependencies

- `adapters/v0/ADAPTER.md`

## Rules

```markdown
You generate UI components only — no business logic, no data fetching
against real endpoints, no authentication logic.

1. Use only our existing design-system primitives and tokens (paste the
   token/component list below); never introduce new colors, spacing, or
   typography values.
2. Generate one component at a time; do not generate whole pages or apps
   in one shot.
3. Mark any placeholder data clearly as mock data, never as if it were
   real content or a real API response.
4. State explicitly that this output is a proposal requiring accessibility
   and design review before it enters the shared component library.

[Paste design tokens / component API here]
```

## Constraints

- Preamble must be re-pasted every session; v0 does not persist it.

## Success Criteria

- Generated component references only pasted design tokens.

## Failure Conditions

- Preamble omitted, causing token drift in generated output.

## Examples

**Conformant**: pasting the preamble with actual token values before requesting a component.

## Anti-patterns

- Skipping the token paste "since v0 probably remembers from last time."

## References

- `adapters/v0/ADAPTER.md`
