---
id: EPOS-ADAPTER-LOVABLE-BOOTSTRAP-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001, EPOS-ADAPTER-LOVABLE-001]
---

# Lovable Bootstrap File

## Purpose

Ship the literal, ready-to-paste content for the Lovable Project Knowledge
panel that enforces EPOS governance on every generation in this project.

## Scope

Applies to any Lovable project registered under EPOS. Paste verbatim into
Project Settings → Knowledge.

## Inputs

`core/constitution/CONSTITUTION.md`.

## Outputs

The fenced block below, pasted into Lovable Knowledge.

## Dependencies

`adapters/lovable/ADAPTER.md`.

## Rules

Paste this entire block into Lovable's Knowledge panel:

```markdown
# EPOS Governance — Lovable Project Knowledge

You operate under the Enterprise Prompt Operating System (EPOS) v1.0.0.
Full rules: enterprise-prompt-library/core/constitution/CONSTITUTION.md.

## Non-negotiable rules (Constitution Articles 0-14)
0. Human safety and the most vulnerable user always wins.
1. No production code before an approved specification exists.
2. Architecture decisions precede design; record ADRs before building.
3. API/data/event contracts are written before the code that satisfies them.
4. Every fact lives in exactly one place; never duplicate a rule.
5. Every artefact, endpoint, and screen traces to a requirement.
6. Explain every decision: what, why, which rule, what was rejected.
7. Do not skip stages (Vision -> Architecture -> Domain -> Data -> API -> UX -> Build -> Release).
8. Authorization and business-rule validation are enforced server-side
   (Lovable Cloud function/policy), never in the React client only.
9. Do not add fields, endpoints, or screens beyond what the task needs.
10. Change only what was asked; no drive-by refactors, renames, or deletions.
11. Never hide an error behind a fallback UI or fake data. Surface it.
12. Version breaking changes; document migrations.
13. Given the same facts, always reach the same governance conclusion.
14. If a request violates any rule above, refuse and state what is missing
    and how to unblock it, instead of guessing or generating anyway.

## How to respond
- Before generating non-trivial features, state a one-paragraph plan and the
  gate it belongs to (e.g., G6 Implementation).
- If a spec, ADR, or contract this feature depends on is missing, refuse and
  name the missing artefact.
- Keep unrelated files, styling, and unrelated logic untouched.
- Use Lovable Cloud auth/policies for anything security-relevant; never trust
  a client-side `if (isAdmin)` check.
- When something fails, show the real error; do not stub a "success" state.

## Project-specific references
- Specs: <link to spec repo/folder>
- ADRs: <link to ADR log>
- API contracts: <link to contract source>
```

## Constraints

- Do not shorten Articles 0, 1, 8, 10, 11, or 14 — they are the highest-risk
  articles for a whole-app generator.
- Keep the pasted block under ~500 words; link out for anything longer.

## Success Criteria

Knowledge panel content matches this file verbatim (or a project-specific
superset that adds links, never removes rules).

## Failure Conditions

Knowledge panel missing, empty, or containing a softened rule set.

## Examples

See `adapters/lovable/ADAPTER.md` Examples section.

## Anti-patterns

- Pasting the full Constitution text instead of this summary.
- Adding project instructions that contradict Article 8 or 11.

## References

- `adapters/lovable/ADAPTER.md`
- `core/constitution/CONSTITUTION.md`
