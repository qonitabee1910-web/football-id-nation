---
id: EPOS-CORE-EXP-001
version: 1.0.0
status: ACCEPTED
authority: DERIVED
depends_on: [EPOS-CORE-CON-001, EPOS-CORE-TRC-001]
supersedes: []
---

# Explainability Framework

## Purpose

Ensure every AI output can answer five mandatory questions: what was decided,
why, which rule authorised it, which artefact it came from, and what was
rejected. Silent choices and unexplained decisions are prohibited (Article 6,
Constitution).

## Scope

Every AI-generated artefact, recommendation, refusal, and decision across all
stages G0–G7 and all adapters must be explainable according to this framework.

## Inputs

- AI system output (code, specification, architectural decision, review comment)
- Rules that governed the decision (Constitution, Principles, Policies)
- The prior artefacts and context the AI considered
- Decision alternatives rejected and why

## Outputs

- An explanation that answers all five questions
- A decision audit trail
- Explicit rejection statements citing violated rules
- Recommendation justifications with ruled-out alternatives

## Dependencies

- `core/constitution/CONSTITUTION.md` (Article 6: Explainability)
- `core/constitution/PRINCIPLES.md` (all principles)
- `core/traceability/TRACEABILITY.md`

## Rules

### The Five Mandatory Questions

Every AI output must be able to answer:

1. **WHAT** was decided?
   - Precise statement of the choice made, recommendation given, or refusal issued

2. **WHY** was this the right choice?
   - The business or technical reasoning; root cause of the decision

3. **WHICH RULE** authorised this decision?
   - The Constitution Article, Principle, or Policy that permits this decision
   - If no rule exists, the AI refuses and cites the gap

4. **WHICH ARTEFACT** is the source of truth?
   - The specification, ADR, or approved policy that this decision implements
   - A traceability ID linking to that artefact

5. **WHAT WAS REJECTED** and why?
   - Alternative decisions considered but ruled out, and the reason each was rejected
   - This prevents silent choices and makes the decision space explicit

### Explainability Standards by Artefact Type

#### Code Comment Explainability

**Non-obvious logic must carry a "why" comment.**

```javascript
// ❌ BAD: Silent choice
const result = data.map(d => d.value * 1.15).filter(r => r > 100);

// ✅ GOOD: Explainable
// SPEC-INVOICE-001-AC-B: Apply 15% late payment penalty only to overdue invoices
// exceeding $100 to avoid noise on small balances (rejected: apply to all invoices
// because G6 code review found this created spurious notifications for test users)
const result = data
  .map(d => d.value * 1.15)  // Apply 15% penalty per SPEC-INVOICE-001-AC-B
  .filter(r => r > 100);     // Threshold decision per SPEC-INVOICE-001-THRESHOLD
```

#### Commit Message Explainability

**Every commit must explain the architectural choice.**

```
[SPEC-X-001] [ADR-0005] Add Redis cache layer for player roster queries

WHAT: Moved player roster queries from direct DB to Redis-backed cache
WHY: G5 performance testing showed 95th percentile latency at 800ms;
     cache reduces this to 45ms per load test results (TEST-ROSTER-PERF-001)
RULE: Architecture-First (Principle 2) + Performance Principle
SOURCE: ADR-0005 (approved at G1), SPEC-X-001-PERF (AC-F threshold)
REJECTED: In-process memory cache (Redis is externalized per Article 8:
          server-side authority); application-level query batching (tested,
          still hit 650ms at 95th percentile per TEST-ROSTER-PERF-002)
VERIFICATION: Performance test suite TEST-ROSTER-PERF-001 confirms <50ms p95
```

#### Architecture Decision Record (ADR) Explainability

```markdown
# ADR-0006: Event-Driven Identity Verification

## Context
[Details of the problem and constraints]

## Alternatives Considered
1. Synchronous HTTP verification
   - Pros: Simple, immediate feedback
   - Cons: Blocks registration flow; tight coupling to verification service
   - REJECTED BECAUSE: Article 8 (Server-Side Authority) requires
     verification to be server-controlled, not service-dependent synchronously

2. Message Queue with Delayed Processing
   - Pros: Asynchronous, decoupled
   - Cons: Unclear to user when verification completes
   - REJECTED BECAUSE: SPEC-IDENTITY-001-AC-C requires user notification
     within 30 seconds; message queue adds uncontrollable latency

3. Event-Driven with Streaming State ← ACCEPTED
   - Pros: Asynchronous, decoupled, state is explicit and trackable
   - Cons: Requires event log infrastructure
   - ACCEPTED BECAUSE: Meets SPEC-IDENTITY-001-AC-C (< 30s notification),
     provides full traceability per Article 5, implements Article 8
     (server-side authority over state)

## Consequences
- Event log becomes system of record for identity state
- Verification service can scale independently
- Audit trail is automatic (events are logged)
```

#### Specification Explainability

```markdown
# SPEC-PLAYER-TRANSFER-001: Player Transfer Workflow

## Acceptance Criteria

### AC-A: Admin initiates transfer
[SPEC-PLAYER-TRANSFER-001-AC-A]

**What:** Admin selects player and target club to create a transfer request
**Why:** Transfers require explicit admin action to prevent accidental
        data loss and maintain Article 8 (server-side authority)
**Rule:** Server-Side Authority (Article 8); Authorization Framework
**Source:** PRD-PLAYER-001 (Manager Workflow), PRG-STK-003 (Admin)
**Alternatives rejected:**
- Automated transfer based on player availability: REJECTED BECAUSE violates
  Article 0 (human oversight required for data mutation)
- Club self-service transfer: REJECTED BECAUSE violates Article 8 (server must
  verify club identity before accepting transfer request)

**Verification:** TEST-PLAYER-TRANSFER-001-AC-A (admin can initiate transfer)
```

#### Review Comment Explainability

**Every review comment must be actionable and rule-grounded.**

```
❌ BAD: Silent judgment
"This doesn't feel right. Refactor it."

✅ GOOD: Explainable
Code Review: SPEC-PLAYER-001 Violation

WHAT: Function parameters mutate input array
WHY: Line 45 modifies `players` array directly, violating immutability
     assumption in the specification
RULE: Immutable Data Structures (Principle 6, SPEC-PLAYER-001-INVARIANT)
SOURCE: SPEC-PLAYER-001-INVARIANT (player list is immutable after load)
ALTERNATIVE: Use const array + spread operator or Array.map()
TEST: TEST-PLAYER-001-AC-D (player mutations audited) will fail with
      current implementation; fix is required to pass G6

VERDICT: FAIL — Refactor required before merge
```

#### Refusal Explainability (Refusal Protocol)

**Every refusal must cite the violated rule.**

```
REFUSAL: Cannot write implementation code.

WHAT: Requested implementation of SPEC-X-001 Feature B
WHY: SPEC-X-001 Feature B has no approved specification; vision statement
     only, no detailed requirements or acceptance criteria
RULE: Specification-Driven Development (Principle 1, Article 1)
SOURCE: SPEC-X-001 (status: DRAFT, requires approval before implementation)
PREREQUISITE: Must gate to G2 (Specification Review) and pass before G3-G6
              can proceed with Feature B
NEXT STEPS: Get SPEC-X-001 reviewed and approved (G2); then I can write code
            that conforms to the approved specification
```

### Explainability Audit Checklist (All Gates)

At each gate, verify:

- [ ] Every code change includes commit message with WHAT, WHY, RULE, SOURCE
- [ ] Every non-obvious function has a "why" comment referencing a spec or ADR
- [ ] Every architectural decision is recorded as an ADR (not hidden in code)
- [ ] Every review comment cites a rule and proposes a remedy
- [ ] Every refusal explains which rule is violated and what's needed to proceed
- [ ] Every specification includes "why each AC" explained
- [ ] Traceability IDs link to authoritative artefacts (SSOT, not copies)
- [ ] Alternative choices are documented (what was rejected and why)
- [ ] No "because I said so" or "best practice" without a rule citation
- [ ] Test names and descriptions explain what they verify (SPEC-X-001-AC-A)

### What Breaks Explainability (Forbidden)

1. Code with no commit message or generic message ("fix bug", "update")
2. Commit message that doesn't answer all five questions
3. Non-obvious function or class with no "why" comment
4. Architecture changed without an ADR
5. Refusal without citing the violated rule
6. Review comment that rejects without proposing a solution
7. ADR without an "Alternatives Considered" section
8. Specification without "why" for each acceptance criterion
9. Code comment that explains "what" instead of "why"
   (code itself shows what; comment explains why it's needed this way)
10. Traceability ID that references a rule instead of the authoritative spec
    (commit should link to SPEC, not to PRINCIPLE)

### Anti-patterns

❌ **Implicit design** (code that reveals design but is never documented)
   Better: ADR is written first, code implements it

❌ **"Obvious" refusal** (refusal without explaining the missing prerequisite)
   Example: "Can't do this" → Better: "SPEC-X-001 is DRAFT; move to G2 approval first"

❌ **Generic commit message**
   ❌ "Update player service"
   ✅ "[SPEC-PLAYER-001-AC-B] [ADR-0003] Cache roster queries via Redis (tested < 50ms p95)"

❌ **Comment explaining code logic instead of intent**
   ❌ `// loop through players and filter`
   ✅ `// Skip players under 18 per GDPR DPA (Article 0: Child Protection Policy)`

❌ **Rejected alternative not documented**
   Better: Include "Alternatives Considered" in every ADR and spec

❌ **Rule citation without linking to authoritative source**
   ❌ "Per policy, use async/await"
   ✅ "Per SPEC-ARCHITECTURE-001-ASYNC (ADR-0002), use async/await"

### Examples

#### Example 1: Explainable Code Review
```
Artifact: Pull Request #1234
Code Change: Add email validation in PlayerService.signup()

❌ POOR EXPLANATION:
"Code review comment: Your validation is too weak."

✅ GOOD EXPLANATION:
"Code review: SPEC-IDENTITY-001-AC-C Violation

WHAT: Email validation regex doesn't enforce RFC 5322 compliance
WHY: Current regex allows invalid emails that pass validation but fail
     when attempting to send welcome email (causes silent failures per TEST-IDENTITY-001)
RULE: Contract-First (Principle 3); RFC 5322 compliance is in
      SPEC-IDENTITY-001-DATA (email field, RFC 5322 constraint)
SOURCE: SPEC-IDENTITY-001-DATA, TEST-IDENTITY-001-AC-C (welcome email delivery)
ALTERNATIVES:
  - Use npm email-validator library: REJECTED (adds dependency, conflicts
    with ADR-0004 zero-validation-dependencies)
  - Use built-in email-validator: REJECTED (not RFC 5322 compliant per TEST results)
  - Use regex from RFC 5322 ABNF: ACCEPTED ✓ (portable, no dependencies,
    passes TEST-IDENTITY-001-AC-C)
VERIFICATION: Must pass TEST-IDENTITY-001-AC-C before merge
VERDICT: CONDITIONAL PASS — Update regex per RFC 5322 ABNF, re-run tests, then approve"
```

#### Example 2: Explainable Refusal
```
Request: "Generate the database schema for the Player table"

❌ POOR EXPLANATION:
"Not ready yet."

✅ GOOD EXPLANATION:
"REFUSAL: Database schema generation blocked by specification gap.

WHAT: Cannot generate player table schema
WHY: SPEC-PLAYER-001 (current version: DRAFT) lacks required schema constraints
     - Does not define uniqueness: email, player_id, or national_id
     - Does not define nullable fields
     - Does not define range constraints on age, transfer_fee
     - Does not define audit field requirements (created_at, updated_by, etc.)
RULE: Contract-First (Principle 3); Schema is a contract per SPEC-PLAYER-001-DATA
SOURCE: SPEC-PLAYER-001 (status: DRAFT, not APPROVED)
       Blockers: Missing schema constraints per SPEC-PLAYER-001-DATA contract

PREREQUISITE UNMET:
  Gate G2 (Specification) must reach APPROVED status before G3-G6
  SPEC-PLAYER-001-DATA must define all constraints

NEXT STEPS:
  1. Request SPEC-PLAYER-001-DATA review and constraint approval
  2. Once SPEC-PLAYER-001 reaches APPROVED, I will generate schema with
     full traceability to contract constraints
  3. Schema change will be tracked as SCHEMA-PLAYER-001 in migration

ESTIMATED WAIT TIME: Depends on G2 specification review cycle"
```

### Success Criteria

✓ Every code change explains WHAT, WHY, RULE, SOURCE, REJECTED alternatives
✓ Every specification explains why each acceptance criterion exists
✓ Every refusal cites the violated rule and clarifies prerequisites
✓ Every architectural change is documented as an ADR before coding
✓ Every review comment proposes a remedy aligned to a rule
✓ Traceability IDs trace to authoritative artefacts (not duplicates)
✓ AI outputs can be audited: decision space was explicit, not hidden

### Failure Conditions

✗ Commit message lacks WHAT, WHY, RULE, SOURCE (gate fail at G6)
✗ Code review comment found without rule citation (gate fail at G6)
✗ Refusal without explanation of the violated rule (gate fail at any gate)
✗ Architectural change without ADR (gate fail at G1)
✗ Test failure traced to missing context in specification (gate fail at G5)
✗ Post-release incident where decision rationale is unknown (gate fail at G8)
