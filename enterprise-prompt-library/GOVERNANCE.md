---
id: EPOS-GOV-001
version: 1.0.0
status: ACCEPTED
---

# EPOS Governance

## Purpose

Define who may change EPOS, how changes are decided, and how conflicts between
layers are resolved.

## Scope

Every file in this repository, and every downstream repository that installs an
EPOS adapter.

## Inputs

Change proposals, incident reports, validator findings, adopter feedback.

## Outputs

Accepted amendments, rejected proposals with reasons, version bumps, migration
guides.

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/decision-rules/DECISION-RULES.md`
- `CONTRIBUTING.md`

## Rules

### Bodies

| Body | Composition | Decision rights |
| --- | --- | --- |
| Governance Council | Chief Enterprise Architect (chair), Principal Domain, Data, Security, Frontend, Backend, DevOps Architects | Amend `core/`; approve major versions |
| Adapter Maintainers | One owner per tool in `adapters/` | Adapter minor/patch; propose core changes |
| Template Owners | Discipline leads | Template minor/patch |
| Validator Owners | Security, Privacy, QA leads | Validator severity calibration |

### Authority order

1. `core/constitution/CONSTITUTION.md`
2. `core/` (other rule files)
3. `templates/`, `validation/`, `release/`
4. `adapters/`

A lower layer that contradicts a higher layer is defective and is fixed in the
lower layer, never by weakening the higher one.

### Amendment process

1. **Propose** — open a change request stating the article or rule affected,
   the problem, and the evidence.
2. **Impact scan** — list every derived file that must change.
3. **Council review** — evaluated against `core/decision-rules/DECISION-RULES.md`.
4. **Decision** — ACCEPTED, REJECTED, or DEFERRED, recorded with reasons.
5. **Propagate** — update derived layers in the same change.
6. **Version** — bump per `docs/VERSIONING.md`; write the migration guide if
   the change is breaking.

Constitution amendments require unanimous Council consent and a superseding
record; accepted articles are never silently edited.

### Conflict resolution

Conflicts are resolved by, in order: Article 0 (vulnerable party prevails),
authority order above, then `core/decision-rules/DECISION-RULES.md`.

### Deprecation

Nothing is deleted without a deprecation cycle: mark `DEPRECATED` with the
replacement and removal version, keep for at least one minor version, then
remove at the next major.

## Constraints

- No emergency bypass of the Constitution exists.
- Adapters may not add, remove, or soften rules.
- A rule may live in exactly one file.

## Success Criteria

- Every accepted change has a recorded rationale and an impact scan.
- Zero contradictions between layers at release time.
- Every breaking change ships with a migration guide.

## Failure Conditions

- Core edited without Council decision.
- Derived layer silently diverging from core.
- Removal without deprecation.

## Examples

> A team wants Copilot to skip ADRs for "small" changes. Rejected: Article 2
> has no size exemption. The Council instead accepts a *lightweight ADR* form
> in `templates/architecture/ADR.md` — same rule, smaller artefact.

## Anti-patterns

- "Just tweak the adapter, it's faster than changing core."
- Adding a rule directly to a template because core review is slow.
- Editing an ACCEPTED decision in place.

## References

- `CONTRIBUTING.md`
- `docs/VERSIONING.md`
- `docs/DEPRECATION-POLICY.md`
