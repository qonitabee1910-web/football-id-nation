---
id: EPOS-CORE-AIG-005
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001, EPOS-CORE-AIG-004]
---

# Child Protection

## Purpose

Operationalise Article 0 (the vulnerable party's interest prevails) for
systems that may involve minors, defining structural — not procedural —
protections.

## Scope

Any bounded context where a user, data subject, or affected party may be a
minor, including systems that do not explicitly target minors but could be
accessed by them.

## Inputs

- The stakeholder map and data classification for the bounded context
- Applicable child-protection regulation for the operating jurisdiction(s)

## Outputs

- A structurally compliant design, or a refusal citing Article 0

## Dependencies

- `core/constitution/CONSTITUTION.md` (Article 0, supreme)
- `core/ai-governance/PRIVACY-PRINCIPLES.md`

## Rules

### Age gates

Every capability accessible without prior identity verification implements
an age-assurance step appropriate to its risk tier before granting access
to features carrying elevated risk to minors (social contact, content
exposure, purchasing, data collection beyond the minimum). Age gates are
enforced server-side; a client-side date-of-birth field alone is not an age
gate.

### Guardian model

Where a user is identified or reasonably believed to be a minor, a
guardian relationship is modelled explicitly: guardian identity, the
authority the guardian holds (consent, oversight, data access), and the
scope of that authority. The guardian model is a first-class part of the
domain model, not a workaround bolted onto the adult user model.

### Structural prohibition, not permission denial

Where a capability must not be available to minors (e.g., direct
messaging with unverified adults, targeted advertising, location
broadcasting), the capability's code path, database field, and API
endpoint are absent for that user class — not present and blocked by a
runtime permission check. A capability that "exists but is denied" is a
violation: it remains an attack surface and a future defect risk (Article
9 applied to Article 0).

### No profiling or scouting of under-13 users

No behavioural profiling, recommendation targeting, or third-party
"scouting"/contact-discovery feature processes data belonging to a user
known or reasonably believed to be under 13. This applies even where a
lawful basis nominally exists elsewhere in the system; Article 0 overrides.

### AI training consent as a separate opt-in

Use of any user-originated data (including a minor's, via guardian
authority) to train, fine-tune, or evaluate AI/ML models is governed by a
purpose entry distinct from operational consent. It defaults to opted out,
requires an explicit, separately presented opt-in, and is revocable with
immediate effect per `core/ai-governance/PRIVACY-PRINCIPLES.md`.

### Escalation on conflict

Where a business, product, or technical decision conflicts with a child's
safety or privacy interest, the conflict is escalated to the
Safeguarding/Trust & Safety role before proceeding; an AI assistant does
not resolve this conflict itself and does not proceed on the
business-favouring option while escalation is pending.

## Constraints

- These rules cannot be waived by commercial agreement, growth targets, or
  engineering convenience.
- Any exception requires documented, time-boxed sign-off from the
  Safeguarding/Trust & Safety role and legal counsel, not engineering
  leadership alone.

## Success Criteria

- A code/schema audit finds zero latent fields or endpoints implementing a
  prohibited capability for minors, even in disabled form.
- Guardian authority is enforced server-side and independently testable
  from consent evidence.

## Failure Conditions

- A "hide from minors" feature flag guarding an otherwise-present
  messaging endpoint.
- AI-training data use enabled by default for any user, minor or adult,
  without separate opt-in.
- A product decision proceeding despite a flagged child-safety conflict.

## Examples

**Conformant:** "Direct messaging is a capability the under-13 profile
type does not expose in its API surface at all; there is no `/messages`
route reachable by that actor type."

**Conformant:** "The recommendation engine excludes under-13 profiles from
its input pipeline entirely, not just from receiving recommendations."

## Anti-patterns

- "We'll just hide the button for kids and check server-side later."
- Treating a checkbox ticked by "someone" as guardian consent without
  verifying guardian identity.
- Including minors' interaction data in a shared training dataset "unless
  they opt out."

## References

- `core/constitution/CONSTITUTION.md`
- `core/ai-governance/PRIVACY-PRINCIPLES.md`
- `core/ai-governance/SECURITY-PRINCIPLES.md`
