# Enterprise Prompt Operating System (EPOS)

**Version 1.0.0** · Single Source of Truth for every AI Coding Assistant.

EPOS is a product, not a prompt collection. It is the AI Governance Layer that
makes Lovable, Cursor, Copilot, Claude Code, Codex, Gemini CLI, Cline, Roo Code,
Continue, Windsurf, Aider, Bolt.new, v0, and Replit AI produce implementations
that are consistent, traceable, explainable, and aligned to the approved
Enterprise Architecture.

## Why EPOS exists

Different assistants, given the same task, produce different architectures,
different naming, different security postures, and different levels of
documentation. That variance is the defect EPOS removes. EPOS fixes the rules
once in `core/`, and each `adapters/<tool>/` translates those rules into the
prompt format, memory model, and iteration style that the tool actually honours.

## Structure

```text
enterprise-prompt-library/
├── README.md · LICENSE · CHANGELOG.md · VERSION
├── CONTRIBUTING.md · GOVERNANCE.md · ROADMAP.md
├── core/          rules that bind every assistant (SSOT)
├── adapters/      per-tool translations of core (never new rules)
├── templates/     reusable task prompts, Vision → Release
├── validation/    read-only reviewers that report, never auto-fix
├── release/       PR, deployment, migration, rollback, post-release
├── assets/        reusable fragments, matrices, checklists
├── examples/      worked end-to-end usage
└── docs/          how to adopt, extend, and version EPOS
```

## The five layers

| Layer | Directory | Authority | May introduce rules? |
| --- | --- | --- | --- |
| 1. Core Rules | `core/` | Supreme | Yes — this is the SSOT |
| 2. Platform Adapters | `adapters/` | Derived | No — translation only |
| 3. Task Templates | `templates/` | Derived | No — application only |
| 4. Validation Prompts | `validation/` | Derived | No — detection only |
| 5. Release Prompts | `release/` | Derived | No — verification only |

If a derived layer disagrees with `core/`, the derived file is defective.

## Quality gates

| Gate | Name | Exits |
| --- | --- | --- |
| G0 | Business Integrity | Vision, stakeholders, metrics |
| G1 | Architecture Integrity | ADRs, architecture rules |
| G2 | Domain Integrity | Domain model, events, journeys |
| G3 | Data Integrity | Canonical, logical, physical data models |
| G4 | Application Integrity | API contract, authorization model |
| G5 | UX Integrity | Screen catalogue, design system, accessibility |
| G6 | Implementation Integrity | Code, tests, migrations, observability |
| G7 | Release Integrity | Readiness, rollback, release notes |

Full checklists: [`core/quality-gates/QUALITY-GATES.md`](core/quality-gates/QUALITY-GATES.md).

## Quick start

1. Read [`core/constitution/CONSTITUTION.md`](core/constitution/CONSTITUTION.md).
   Article 0 and Articles 1–3 decide most disputes on their own.
2. Pick your tool's adapter, e.g.
   [`adapters/cursor/ADAPTER.md`](adapters/cursor/ADAPTER.md), and install the
   bootstrap file it specifies (`.cursor/rules`, `AGENTS.md`, `CLAUDE.md`, …).
3. Pick the template for the stage you are in, e.g.
   [`templates/api/API-CONTRACT.md`](templates/api/API-CONTRACT.md).
4. Before requesting the next stage, run the matching validator in
   `validation/` and the gate checklist in `validation/quality-gate/`.
5. At release, run `release/release-readiness/` and
   `release/rollback/`.

## File contract

Every EPOS file contains, in order: Purpose · Scope · Inputs · Outputs ·
Dependencies · Rules · Constraints · Success Criteria · Failure Conditions ·
Examples · Anti-patterns · References. A file missing a section is
non-conformant — see [`docs/AUTHORING-GUIDE.md`](docs/AUTHORING-GUIDE.md).

## Versioning

Semantic Versioning with a published deprecation policy and migration guides.
See [`docs/VERSIONING.md`](docs/VERSIONING.md) and [`CHANGELOG.md`](CHANGELOG.md).

## Governance

Amendments to `core/` require a recorded decision. See
[`GOVERNANCE.md`](GOVERNANCE.md) and [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Licence

[MIT](LICENSE).
