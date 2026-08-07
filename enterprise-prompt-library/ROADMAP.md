---
id: EPOS-RMP-001
version: 1.0.0
status: ACCEPTED
---

# EPOS Roadmap

## Purpose

State what EPOS will do next, so adopters can plan and contributors avoid
duplicate work.

## Scope

Releases 1.0 through 2.0.

## Inputs

Adopter feedback, validator findings, new assistant capabilities.

## Outputs

Planned releases with themes and exit criteria.

## Dependencies

`GOVERNANCE.md`, `docs/VERSIONING.md`.

## Rules

Roadmap items are themes, not promises with dates. An item ships when its exit
criteria pass, never because a date arrived.

| Release | Theme | Exit criteria |
| --- | --- | --- |
| 1.0.0 | Foundation — core, 13 adapters, 26 templates, 18 validators, 12 release prompts | All layers conformant; zero contradictions |
| 1.1.0 | Machine-checkable conformance — JSON rule index, linter for the 12-section contract | CI can fail a non-conformant file |
| 1.2.0 | Metrics — adoption, refusal rate, gate pass rate, rework rate per assistant | Dashboard spec published |
| 1.3.0 | Domain packs — regulated-industry overlays (child data, health, finance) | Overlay mechanism without core forks |
| 1.4.0 | Adapter self-test — per-tool behavioural probes | Each adapter ships a pass/fail probe suite |
| 2.0.0 | Agentic governance — multi-agent orchestration, delegated review, signed artefact provenance | Breaking changes documented with migration guide |

## Constraints

- No roadmap item may weaken the Constitution.
- Overlays extend; they never fork core.

## Success Criteria

Each release closes with a CHANGELOG entry and, if breaking, a migration guide.

## Failure Conditions

Shipping a theme with unmet exit criteria; roadmap items introduced without
governance review.

## Examples

1.3.0 child-data overlay adds `overlays/child-data/` with stricter defaults for
Article 9 — it constrains, never relaxes.

## Anti-patterns

- Date-driven releases.
- Forking core for one industry.

## References

`CHANGELOG.md`, `GOVERNANCE.md`.
