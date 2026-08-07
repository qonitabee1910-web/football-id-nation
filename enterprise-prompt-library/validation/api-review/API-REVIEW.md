---
id: EPOS-VAL-API-001
version: 1.0.0
status: ACCEPTED
gate: G4
depends_on: [EPOS-CORE-CON-001]
---

# API Review Validator

## Purpose

Reads API contracts (OpenAPI/GraphQL schemas, endpoint specs, versioning
policy) produced at Gate G4 and detects conflicts, gaps, and unauthorised
deviations before application implementation proceeds. This validator never
designs or corrects an API; it reports defects for a human or an authorised
authoring prompt to resolve.

## Scope

All REST/GraphQL contracts, request/response schemas, error taxonomies,
authentication/authorization declarations, versioning and deprecation
policy submitted at G4. Excludes UI contracts (`ui-review/`) and data
storage schemas (`data-review/`).

## Inputs

- `{{API_CONTRACT}}` — OpenAPI/GraphQL schema set for the work item
- `{{DOMAIN_MODEL}}` — accepted domain model from G2
- `{{AUTH_POLICY}}` — authentication/authorization requirements
- `{{PRIOR_API_VERSIONS}}` — previously published API contracts
- Constitution `EPOS-CORE-CON-001`

## Outputs

- A structured finding report (see format below) with a PASS / CONDITIONAL
  PASS / FAIL verdict
- No API contract is modified

## Dependencies

- `core/constitution/CONSTITUTION.md` (Articles 4, 6, 8, 10, 12, 13)
- `core/quality-gates/QUALITY-GATES.md` (G4 checklist)
- `EPOS-CORE-CON-001`

## Rules

1. Every endpoint must enforce server-side authorization; client-side-only
   checks are a BLOCKER (Article 8).
2. Every request/response schema must trace to an accepted domain entity or
   value object; untraced fields are MAJOR (Article 4).
3. Breaking changes to a published contract require a major version bump and
   deprecation notice; silent breaking change is a BLOCKER (Article 12).
4. Error responses must use a consistent, documented error taxonomy; ad hoc
   error shapes are MAJOR.
5. Idempotency must be declared for all unsafe methods exposed for retry
   (Article 5); absence on payment/state-mutating endpoints is CRITICAL.
6. Pagination, filtering, and rate-limit behaviour must be explicit for
   collection endpoints; undocumented behaviour is MINOR.
7. Sensitive fields (PII, secrets) must declare classification and masking
   policy (Article 10); absence is CRITICAL.
8. No two endpoints may expose conflicting semantics for the same resource
   without a documented reason (Article 13); conflict is CRITICAL.

## Constraints

- The validator never proposes a replacement schema; it names the gap and
  cites the rule.
- The validator never approves a contract; it only reports conformance
  status.
- The validator does not evaluate UI rendering or persistence mapping.

## Success Criteria

- Every endpoint in `{{API_CONTRACT}}` is checked against Rules 1-8.
- Every finding cites an article or a prior contract version as evidence.
- The verdict is reproducible: identical inputs yield an identical verdict
  (Article 13).

## Failure Conditions

- A finding without a cited rule or artefact location.
- A verdict of PASS issued while a BLOCKER or CRITICAL finding is open.
- The validator editing or rewriting the API contract.

## Examples

**Conformant finding**

> Finding API-011, CRITICAL. `POST /payments/{id}/capture` lacks an
> `Idempotency-Key` requirement despite mutating financial state. Article 5
> (Reliability) violated. Recommendation: require idempotency key handling
> before this endpoint proceeds to implementation.

## Anti-patterns

- "The API looks RESTful enough" without itemised findings.
- Approving because the schema "matches the mockup" without checking
  authorization enforcement.
- Suggesting specific handler code to fix a gap (validators detect, they do
  not implement).

## Checklist

1. Every endpoint declares required authentication and authorization.
2. Authorization is enforced server-side, not inferred from client state.
3. All schema fields trace to an accepted domain entity or DTO mapping.
4. Breaking changes carry a major version bump and deprecation notice.
5. Error taxonomy is consistent across all endpoints.
6. Unsafe/mutating methods declare idempotency behaviour.
7. Collection endpoints document pagination and filtering.
8. Rate limits are stated for public or high-cost endpoints.
9. Sensitive fields declare classification and masking/redaction policy.
10. No conflicting semantics exist across endpoints for the same resource.
11. Versioning strategy (URI, header, media type) is explicit and consistent.
12. Contract examples match declared schemas exactly.
13. Deprecation timeline is stated for any endpoint marked deprecated.
14. Cross-service calls document timeout and retry/circuit-breaker behaviour.
15. Webhooks/callbacks declare signature verification requirements.

## References

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `EPOS-CORE-CON-001`
