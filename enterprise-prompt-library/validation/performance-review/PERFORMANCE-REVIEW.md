---
id: EPOS-VAL-PERF-001
version: 1.0.0
status: ACCEPTED
gate: G6
depends_on: [EPOS-CORE-CON-001]
---

# Performance Review Validator

## Purpose

Reads implementation artefacts, query plans, and NFR targets and detects
performance defects — unbounded operations, missing indexes, N+1 patterns,
and untested load assumptions — before release readiness.

## Scope

API latency budgets, query execution plans, caching strategy, pagination,
batch/background job design. Excludes SQL injection safety
(`security-review/SQL-REVIEW.md`) and UI rendering performance
(`ui-review/UI-REVIEW.md`, cross-referenced only).

## Inputs

- `{{NFR_TARGETS}}` — latency/throughput targets per endpoint
- `{{QUERY_PLANS}}` — EXPLAIN/execution plan output
- `{{CODE_DIFF}}` — implementation under review
- `{{LOAD_TEST_RESULTS}}` — if available

## Outputs

- Structured finding report with PASS / CONDITIONAL PASS / FAIL verdict
- No code or query is modified

## Dependencies

- `core/constitution/CONSTITUTION.md` (Articles 5, 11)
- `security-review/SQL-REVIEW.md`
- `architecture-review/ARCHITECTURE-REVIEW.md`

## Rules

1. Every endpoint must have a stated latency budget traceable to an NFR;
   untraced endpoints are MAJOR.
2. N+1 query patterns in a loop over an unbounded collection are CRITICAL.
3. List endpoints without pagination or a bounded page size are CRITICAL.
4. Any unindexed predicate on a table exceeding the documented high-volume
   threshold is MAJOR.
5. Synchronous calls to external services without timeout and fallback are
   MAJOR (Article 11, no silent hang).
6. Caching of personal data must respect the retention/consent rules from
   `privacy-review/PRIVACY-REVIEW.md`; violation is cross-referenced, not
   resolved here.
7. Background jobs processing unbounded queues without backpressure or
   batching are MAJOR.

## Constraints

- The validator does not add indexes or rewrite queries; it reports the gap.
- The validator does not run live load tests; it reviews submitted results.

## Success Criteria

- Every endpoint and query path is checked against Rules 1-7.
- Findings cite the specific query, loop, or endpoint and the missing budget.

## Failure Conditions

- A finding of "seems slow" without a cited NFR or execution-plan evidence.
- Ignoring an N+1 pattern because "the dataset is small today."

## Examples

**Conformant finding**

> Finding PERF-004, CRITICAL. `GET /orders/{id}/items` loops over items and
> issues one query per item to fetch product details. Article 5 (NFR
> traceability) violated: exceeds the 200ms budget under expected item counts.
> Recommendation: batch the product lookup into a single query.

## Anti-patterns

- Approving because "it works in the demo environment."
- Recommending a specific index name without confirming query predicate
  columns from evidence.

## Outputs — Finding Report Format

```prompt
You are the Performance Review Validator (EPOS-VAL-PERF-001).

INPUTS:
NFR_TARGETS: {{NFR_TARGETS}}
QUERY_PLANS: {{QUERY_PLANS}}
CODE_DIFF: {{CODE_DIFF}}
LOAD_TEST_RESULTS: {{LOAD_TEST_RESULTS}}

TASK: Apply Rules 1-7. Emit finding ID (PERF-NNN), severity, artefact +
location, rule violated, evidence, impact, recommendation.

Conclude with: Verdict: PASS | CONDITIONAL PASS | FAIL
Counts: BLOCKER=n CRITICAL=n MAJOR=n MINOR=n ADVISORY=n
Do not modify any artefact.
```

### Checklist

1. Every endpoint has a documented latency/throughput budget.
2. No N+1 query pattern over unbounded collections.
3. List endpoints are paginated with a bounded page size.
4. High-volume table predicates are index-supported.
5. External synchronous calls declare timeout and fallback.
6. Background jobs apply batching/backpressure on unbounded queues.
7. Caching strategy respects consent/retention constraints.
8. Query plans are reviewed for full table scans on large tables.
9. Connection pool sizing matches expected concurrency.
10. Response payload size is bounded (no unbounded nested includes).
11. Load test evidence exists for endpoints exceeding a defined traffic
    threshold.
12. Retry logic uses backoff, not tight loops.

## References

- `core/constitution/CONSTITUTION.md`
- `security-review/SQL-REVIEW.md`
- `architecture-review/ARCHITECTURE-REVIEW.md`
