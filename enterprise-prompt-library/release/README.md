# Release Prompts

Index of `release/` verification prompts and the order they run in during G7
Release Integrity. Each prompt VERIFIES only — it never auto-fixes and never
bypasses a gate.

## Index

| Prompt | Path | Verifies |
| --- | --- | --- |
| Pull Request Review | `code-review/PULL-REQUEST-REVIEW.md` | PR traceability, scope, Constitution conformance |
| Code Review | `code-review/CODE-REVIEW.md` | Coding standards and contract conformance on the release candidate |
| Architecture Review at Release | `code-review/ARCHITECTURE-REVIEW-AT-RELEASE.md` | No undocumented architectural drift since G1 |
| Security Scan | `code-review/SECURITY-SCAN.md` | No prohibited security defect class |
| Dependency Review | `code-review/DEPENDENCY-REVIEW.md` | Authorised, vulnerability-free, licence-compatible dependencies |
| Migration Readiness | `migration/MIGRATION-READINESS.md` | Reversible, backward-compatible, tested migrations |
| Deployment Readiness | `deployment/DEPLOYMENT-READINESS.md` | Environment, config, observability, rollback path |
| Production Readiness Review | `release-readiness/PRODUCTION-READINESS-REVIEW.md` | Operational bar for first production exposure |
| Rollback Plan | `rollback/ROLLBACK-PLAN.md` | Tested rollback for application, migration, and flags |
| Release Readiness | `release-readiness/RELEASE-READINESS.md` | Aggregate go/no-go across all prior verdicts |
| Release Notes | `release-note/RELEASE-NOTES.md` | Traceable, non-fabricated user-facing notes |
| Changelog Generation | `changelog/CHANGELOG-GENERATION.md` | Keep a Changelog entry and correct SemVer bump |
| Post-Release Review | `release-readiness/POST-RELEASE-REVIEW.md` | Post-deployment stability and lessons learned |

## Release Sequence

1. `code-review/PULL-REQUEST-REVIEW.md` — per pull request, continuously.
2. `code-review/CODE-REVIEW.md` — on the cut release candidate.
3. `code-review/ARCHITECTURE-REVIEW-AT-RELEASE.md`
4. `code-review/SECURITY-SCAN.md`
5. `code-review/DEPENDENCY-REVIEW.md`
6. `migration/MIGRATION-READINESS.md`
7. `deployment/DEPLOYMENT-READINESS.md`
8. `release-readiness/PRODUCTION-READINESS-REVIEW.md` — only on first production exposure or material architecture change.
9. `rollback/ROLLBACK-PLAN.md`
10. `release-readiness/RELEASE-READINESS.md` — aggregates 1–9; any NO-GO/FAIL/BLOCKED input forces NO-GO.
11. `changelog/CHANGELOG-GENERATION.md`
12. `release-note/RELEASE-NOTES.md`
13. Deploy (outside EPOS — the enterprise's own pipeline).
14. `release-readiness/POST-RELEASE-REVIEW.md` — after the observation window.

## References

- `core/quality-gates/QUALITY-GATES.md`
- `core/constitution/CONSTITUTION.md`
