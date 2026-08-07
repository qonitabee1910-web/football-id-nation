---
id: EPOS-ADAPTER-V0-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Adapter: v0

## Purpose

Translate EPOS core rules into v0's UI-generation-first, component-level workflow, enforcing design-system conformance and a clean hand-off boundary into a governed repository.

## Scope

Applies to v0.dev sessions producing React/Next.js/shadcn components, including generation prompts, component regeneration, and code export.

## Inputs

- Design system tokens/components (approved, from `templates/design-system/` or equivalent)
- Component-level generation prompt
- EPOS quality gate status (specifically G5 UX Integrity)

## Outputs

- Components conformant to the approved design system
- Explicit boundary marker where generated output must be reviewed before entering the governed repo

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `BOOTSTRAP.md` (this directory)

## Rules

### Context Window Strategy
v0 operates per-component or per-screen, not per-repository; it has no
visibility into the wider codebase unless pasted in. Always paste the
relevant design-system tokens/component API into the prompt rather than
assuming v0 infers them, since it has no persistent project context.

### Prompt Style
Describe UI in terms of existing design-system primitives ("use `Button`
variant=primary from our system, not a new button"), not raw visual
description — this is the mechanism that prevents design-system drift.

### Iteration Strategy
Generate at component granularity, review, then compose; do not ask for a
full-page or full-app generation in one shot when a design system exists —
large single-shot generations bypass component reuse and duplicate styling
logic (Article 4 duplication risk applied to UI).

### Memory Strategy
No persistent memory; each generation is stateless apart from the visible
chat thread. Design-system constraints must be restated or referenced
every session; store the canonical constraint file in the repository, not
in v0 chat history.

### File Strategy
Exported components land in a designated `components/generated/` staging
path pending review; nothing from v0 is imported directly into shared
component directories without passing design-system and accessibility
review.

### Validation Strategy
Run the generated component through the project's existing accessibility
and visual-regression tooling before promoting it out of staging; v0 has
no built-in test runner.

### Review Strategy
Hand-off boundary: v0 output is a proposal. A human or a governed CI check
verifies design-token usage, accessibility, and responsiveness before the
component leaves `components/generated/` and enters the shared library.

## Constraints

- Generated components may not introduce new colour/spacing/typography values outside approved design tokens.
- No generated component is imported directly into shared libraries without passing through staging review.
- v0 must never be asked to implement business logic or data access — UI only.

## Success Criteria

- 100% of generated components use approved design tokens, zero raw hex/px overrides.
- Every component passes through `components/generated/` staging before promotion.

## Failure Conditions

- A component promoted to the shared library without an accessibility check.
- Business logic or API calls embedded directly in v0-generated component code.

## Examples

**Conformant**

> Prompt: "Generate an OrderCard using our `Card`, `Badge`, and `Button` primitives per `templates/design-system/tokens.md`." Output staged in `components/generated/order-card.tsx`, reviewed, then promoted.

## Anti-patterns

- Asking v0 to "just build the whole dashboard" without design-system constraints.
- Wiring v0 output directly to production API calls.
- Skipping the staging directory because the component "looks fine."

## References

- `core/constitution/CONSTITUTION.md`
- `adapters/v0/BOOTSTRAP.md`
