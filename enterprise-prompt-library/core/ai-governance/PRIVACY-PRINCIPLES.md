---
id: EPOS-CORE-AIG-004
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Privacy Principles

## Purpose

Bind data handling to lawful, minimal, purpose-limited, and structurally
enforced privacy controls, implementing Article 9 (Privacy by Architecture).

## Scope

All personal data, sensitive data, and minor-related data across all
bounded contexts.

## Inputs

- The data classification register from Stage 3 (Data)
- Applicable legal/regulatory basis for processing

## Outputs

- A privacy-conformant data model, or a refusal citing the missing lawful
  basis or minimisation gap

## Dependencies

- `core/constitution/CONSTITUTION.md` (Article 9)
- `core/ai-governance/CHILD-PROTECTION.md`
- `core/ai-governance/SECURITY-PRINCIPLES.md`

## Rules

### Lawful basis

No personal data field is collected, stored, or processed without an
identified lawful basis (consent, contract, legal obligation, legitimate
interest, vital interest) recorded against the field in the data
classification register before the field exists in any schema.

### Purpose limitation

Each field's approved purposes are enumerated explicitly. Use of a field
for a purpose not on its list requires a new lawful-basis review before the
new use ships — reusing data "because it's already there" is prohibited.

### Data minimisation by capability

If a capability does not require a field, the field is structurally absent
from the schema, API, and UI for that capability — not present-but-hidden
(Article 9). Minimisation is assessed per capability, not per system.

### Consent authority vs. evidence authority

Consent authority (who may grant/withdraw consent — e.g., the data subject
or their guardian) is modelled separately from consent evidence (the
timestamped record that consent was given). The system never infers
authority from the presence of evidence alone; authority is checked first.

### Retention classes

Every field group is assigned a retention class (e.g., transient,
operational, statutory-minimum, indefinite-with-review) with a defined
deletion or anonymisation trigger. No field group defaults to indefinite
retention without an explicit, approved justification.

### Revocation with immediate effect

Withdrawal of consent takes effect immediately for all future processing;
dependent capabilities relying on that consent are disabled at the same
time, not on the next batch cycle. Historical records required for legal
obligations are retained only in the extent and form the lawful basis
permits.

### Cross-context data contracts

When one bounded context shares personal data with another, the sharing is
governed by an explicit data contract stating: fields shared, purpose,
lawful basis, retention on the receiving side, and revocation propagation
mechanism. Ad hoc database reads across contexts are prohibited (also see
`core/architecture/ARCHITECTURE-RULES.md`).

## Constraints

- Privacy principles apply regardless of jurisdiction defaults; the
  strictest applicable regime governs a cross-border capability.
- Article 0 (vulnerable party) and `CHILD-PROTECTION.md` take precedence
  over these principles wherever a minor is the data subject.

## Success Criteria

- Every personal-data field in the PDM has a recorded lawful basis, purpose
  list, and retention class.
- A consent withdrawal test shows dependent capabilities disabled within
  the same request/transaction.

## Failure Conditions

- A field with no recorded lawful basis present in production schema.
- Consent evidence used as a proxy for consent authority.
- A cross-context data share with no data contract.

## Examples

**Conformant:** "The `marketing_opt_in` field is a separate boolean from
`terms_accepted`; withdrawing the former immediately excludes the user from
the next campaign query."

**Conformant:** "The `analytics` capability does not receive `full_name`
at all — the field is absent from its API contract, not filtered at
render time."

## Anti-patterns

- "We already collect the phone number for support, let's reuse it for
  SMS marketing" without a new lawful basis.
- Keeping a "soft delete" of personal data indefinitely with no anonymise
  trigger.
- A guardian-consent flag that is really just "an adult clicked something
  once," with no authority verification.

## References

- `core/constitution/CONSTITUTION.md`
- `core/ai-governance/CHILD-PROTECTION.md`
- `core/ai-governance/SECURITY-PRINCIPLES.md`
