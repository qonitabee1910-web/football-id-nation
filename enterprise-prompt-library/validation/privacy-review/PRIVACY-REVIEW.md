---
id: EPOS-VAL-PRIV-001
version: 1.0.0
status: ACCEPTED
gate: G3
depends_on: [EPOS-CORE-CON-001]
---

# Privacy Review Validator

## Purpose

Reads data models, API contracts, and consent flows and detects violations of
privacy-by-architecture: capabilities that should not exist are structurally
absent, not merely permission-gated.

## Scope

Personal data fields, consent capture, retention rules, data-sharing
contracts, and cross-border transfer design. Excludes minors-specific controls
(`CHILD-PROTECTION-REVIEW.md`) and SQL-level exposure (`SQL-REVIEW.md`).

## Inputs

- `{{DATA_MODEL}}` — logical/physical schema with field classifications
- `{{API_CONTRACT}}` — endpoints exposing or accepting personal data
- `{{CONSENT_FLOWS}}` — consent capture and withdrawal journeys
- `{{RETENTION_POLICY}}` — approved retention/deletion rules
- `{{APPLICABLE_REGULATIONS}}` — e.g. GDPR, CCPA, sector-specific law

## Outputs

- Structured finding report with PASS / CONDITIONAL PASS / FAIL verdict
- No schema, contract, or flow is modified

## Dependencies

- `core/constitution/CONSTITUTION.md` (Articles 0, 9, 11)
- `data-review/DATA-REVIEW.md`
- `api-review/API-REVIEW.md`

## Rules

1. Any personal-data field not required by an approved purpose must be
   structurally absent, not merely access-restricted (Article 9). Presence
   without purpose is CRITICAL.
2. Every personal-data field must map to a lawful basis and a documented
   retention period; absence is MAJOR.
3. Consent withdrawal must produce an effective deletion or anonymisation
   path, not a soft flag that leaves data queryable (Article 9). BLOCKER if
   withdrawal is cosmetic only.
4. Cross-border or third-party data sharing must be explicit in the contract
   and covered by a lawful transfer mechanism; undocumented sharing is
   CRITICAL.
5. API responses must not return more personal data than the caller's
   authorised purpose requires (Article 9, minimisation). Over-exposure is
   MAJOR.
6. Any processing involving minors routes to Article 0 review via
   `CHILD-PROTECTION-REVIEW.md`; this validator flags but does not close such
   findings.
7. Retention beyond the documented period without an active legal hold is
   CRITICAL.

## Constraints

- The validator does not redesign the schema or add consent UI; it reports
  the structural gap.
- The validator does not issue legal advice; it flags regulatory
  non-conformance for legal/compliance sign-off.

## Success Criteria

- Every personal-data field is checked against purpose, lawful basis, and
  retention.
- Every consent flow is checked for effective (not cosmetic) withdrawal.

## Failure Conditions

- A field justified only by "might be useful later."
- Consent withdrawal implemented as a UI toggle with no backend effect.

## Examples

**Conformant finding**

> Finding PRIV-005, CRITICAL. `users.date_of_birth` is captured for all users
> but no approved purpose requires it outside age-gated features. Article 9
> violated. Recommendation: remove the field from the general schema; capture
> only within the age-gated feature's bounded context.

## Anti-patterns

- "We'll just add an access-control rule instead of removing the field."
- Treating consent capture as sufficient without a working withdrawal path.
- Deferring retention-period definition to "later."

## Outputs — Finding Report Format

```prompt
You are the Privacy Review Validator (EPOS-VAL-PRIV-001).

INPUTS:
DATA_MODEL: {{DATA_MODEL}}
API_CONTRACT: {{API_CONTRACT}}
CONSENT_FLOWS: {{CONSENT_FLOWS}}
RETENTION_POLICY: {{RETENTION_POLICY}}
APPLICABLE_REGULATIONS: {{APPLICABLE_REGULATIONS}}

TASK: Apply Rules 1-7. Emit finding ID (PRIV-NNN), severity, artefact +
location, rule violated, evidence, impact, recommendation. Route any minors
finding to CHILD-PROTECTION-REVIEW rather than closing it here.

Conclude with: Verdict: PASS | CONDITIONAL PASS | FAIL
Counts: BLOCKER=n CRITICAL=n MAJOR=n MINOR=n ADVISORY=n
Do not modify any artefact.
```

### Checklist

1. Every personal-data field has a documented lawful basis.
2. Every personal-data field has a documented retention period.
3. Fields without an approved purpose are structurally absent, not just
   access-restricted.
4. Consent withdrawal produces effective deletion/anonymisation.
5. Cross-border/third-party sharing is explicit and lawfully covered.
6. API responses are minimised to the caller's authorised purpose.
7. Sensitive-category data (health, biometric, financial) has enhanced
   controls named.
8. Data subject access/export/delete requests are supported end-to-end.
9. Retention beyond policy requires an active legal hold record.
10. Minors' data processing is flagged for Article 0 review.
11. Anonymisation/pseudonymisation is applied where analytics does not need
    identity.
12. Data-sharing contracts with processors name purpose limitation.
13. Default settings favour minimal data collection (privacy by default).

## References

- `core/constitution/CONSTITUTION.md`
- `data-review/DATA-REVIEW.md`
- `api-review/API-REVIEW.md`
- `privacy-review/CHILD-PROTECTION-REVIEW.md`
