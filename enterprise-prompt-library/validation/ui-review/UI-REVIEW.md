---
id: EPOS-VAL-UI-001
version: 1.0.0
status: ACCEPTED
gate: G5
depends_on: [EPOS-CORE-CON-001]
---

# UX/UI Review Validator

## Purpose

Reads UX artefacts (wireframes, interaction specs, accessibility annotations,
content copy) produced at Gate G5 and detects conflicts, gaps, and
unauthorised deviations before implementation begins. This validator never
designs or corrects a UI; it reports defects for a human or an authorised
authoring prompt to resolve.

## Scope

All wireframes, prototypes, interaction flows, accessibility annotations,
error/empty/loading states, and content copy submitted at G5. Excludes API
contract shape (`api-review/`) and persistence design (`data-review/`).

## Inputs

- `{{UX_ARTEFACTS}}` — wireframes/prototypes for the work item
- `{{INTERACTION_SPEC}}` — flows, states, and transitions
- `{{ACCESSIBILITY_REQS}}` — WCAG target level and annotations
- `{{DESIGN_SYSTEM}}` — accepted component library and tokens
- Constitution `EPOS-CORE-CON-001`

## Outputs

- A structured finding report (see format below) with a PASS / CONDITIONAL
  PASS / FAIL verdict
- No UX artefact is modified

## Dependencies

- `core/constitution/CONSTITUTION.md` (Articles 5, 8, 9, 10, 13)
- `core/quality-gates/QUALITY-GATES.md` (G5 checklist)
- `EPOS-CORE-CON-001`

## Rules

1. Every screen must define loading, empty, error, and success states;
   missing states are MAJOR.
2. Every interactive element must have an accessible name and keyboard path;
   absence is a BLOCKER (Article 9).
3. Client-side validation must mirror server-side rules, never replace them
   (Article 8); UI-only enforcement of a business rule is a BLOCKER.
4. Components must reuse `{{DESIGN_SYSTEM}}` tokens; ad hoc styling divergent
   from the system is MINOR unless it breaks contrast/consistency (MAJOR).
5. Destructive actions must include confirmation or undo (Article 5); absence
   is CRITICAL.
6. Colour must not be the sole means of conveying state or error (Article 9);
   violation is MAJOR.
7. Copy must be free of placeholder/lorem text at G5 exit; presence is
   MINOR unless user-facing in the reviewed flow (MAJOR).
8. Responsive/adaptive behaviour must be specified for all target
   breakpoints; absence is MAJOR.

## Constraints

- The validator never proposes redesigns; it names the gap and cites the
  rule.
- The validator never approves a design; it only reports conformance status.
- The validator does not evaluate backend logic or API shape.

## Success Criteria

- Every screen/flow in `{{UX_ARTEFACTS}}` is checked against Rules 1-8.
- Every finding cites an article, WCAG criterion, or design-system rule.
- The verdict is reproducible across identical inputs (Article 13).

## Failure Conditions

- A finding without a cited rule or artefact location.
- A verdict of PASS issued while a BLOCKER or CRITICAL finding is open.
- The validator editing wireframes or copy directly.

## Examples

**Conformant finding**

> Finding UI-007, BLOCKER. The "Delete account" button in `Settings.fig`
> frame 12 has no confirmation step or undo path. Article 5 (Reliability/Safe
> defaults) violated. Recommendation: add a confirmation dialog or reversible
> action before this flow proceeds.

## Anti-patterns

- "Looks clean" without itemised findings.
- Approving because it "matches the brand" without checking keyboard/
  screen-reader access.
- Prescribing exact pixel values or copy text to fix a gap (validators
  detect, they do not implement).

## Checklist

1. Every screen defines loading, empty, error, and success states.
2. Every interactive control has an accessible name and visible focus state.
3. Full keyboard navigation path exists for each flow.
4. Client-side validation mirrors, not replaces, server-side rules.
5. Destructive actions require confirmation or provide undo.
6. Colour is never the sole signal for state, error, or required fields.
7. Contrast ratios meet the stated WCAG target level.
8. Components use approved design-system tokens and variants.
9. Responsive behaviour is specified for all declared breakpoints.
10. No placeholder/lorem copy remains in reviewed user-facing flows.
11. Form error messages are specific, in-context, and actionable.
12. Internationalisation/localisation constraints are respected (text
    expansion, RTL).
13. Motion/animation respects reduced-motion preferences.
14. Navigation and information architecture match approved sitemap.
15. Consent/legal disclosures appear where required by policy.

## References

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `EPOS-CORE-CON-001`
