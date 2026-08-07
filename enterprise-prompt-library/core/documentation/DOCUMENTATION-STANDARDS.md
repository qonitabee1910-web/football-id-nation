---
id: EPOS-CORE-DOC-002
version: 1.0.0
status: ACCEPTED
authority: DERIVED
depends_on: [EPOS-CORE-CON-001, EPOS-CORE-EXP-001]
supersedes: []
---

# Documentation Standards

## Purpose

Establish mandatory standards for all written documentation (specifications,
ADRs, API docs, README files, comments) to ensure documentation is
discoverable, maintainable, traceable, and authoritative. Documentation is
a first-class artefact; poor documentation is a defect.

## Scope

All documentation produced under EPOS across all stages G0–G7:
- Specifications (SPEC-X-001 artefacts)
- Architecture Decision Records (ADRs)
- README and setup documentation
- API documentation (OpenAPI, inline comments)
- Domain model documentation
- Database schema documentation
- Migration and rollback plans
- Release notes and changelogs

## Inputs

- Constitution and Principles (core rules)
- Traceability framework (TRACEABILITY.md)
- Explainability framework (EXPLAINABILITY.md)
- The artefact being documented

## Outputs

- Documentation that passes the gate documentation checklist
- Clear authorship and version information
- Traceability to specifications and approval gates
- Discoverable and searchable documentation
- No orphaned or obsolete documentation

## Dependencies

- `core/constitution/CONSTITUTION.md` (Articles 4, 5, 6)
- `core/traceability/TRACEABILITY.md`
- `core/traceability/EXPLAINABILITY.md`

## Rules

### Universal Documentation Standards

#### 0.1 YAML Frontmatter (All Formal Documents)

Every formal document (specification, ADR, policy, framework) must include
YAML frontmatter with metadata:

```yaml
---
id: EPOS-CORE-DOC-002              # Global unique identifier
version: 1.0.0                      # Semantic versioning
status: DRAFT | ACCEPTED | SUPERSEDED
authority: SUPREME | DERIVED        # Where this rule originates
depends_on: [EPOS-CORE-CON-001]    # Explicit dependencies
supersedes: [EPOS-CORE-DOC-001]    # If replacing a prior doc
created_date: 2024-08-07            # When first published
updated_date: 2024-08-07            # Last updated
authored_by: Name or team
approved_by: Approval authority
next_review_date: 2025-08-07        # Review cycle
---
```

#### 0.2 Section Structure

Every document must include these sections in order (at minimum):

1. **Purpose** (2–3 sentences)
   - What problem does this document solve?
   - Why is it necessary?

2. **Scope** (bullet list or paragraph)
   - To whom does this apply?
   - What is included and excluded?

3. **Inputs** (bullet list)
   - What information is required to use this document?

4. **Outputs** (bullet list)
   - What will you have after following this document?

5. **Dependencies** (bullet list)
   - Which other documents must you read first?
   - What artefacts must exist?

6. **Rules / Checklist / Framework**
   - The core content

7. **Examples** (at least one complete worked example)
   - How would you apply this in practice?

8. **Anti-patterns** (what NOT to do)
   - Common mistakes and why they're wrong

9. **Success Criteria** (checkmark list)
   - How do you know you've done it right?

10. **Failure Conditions** (X-mark list)
    - When would this fail a gate?

#### 0.3 Traceability and Linking

All documentation must:
- Include traceability IDs in YAML frontmatter (id field)
- Link to dependent documents via their ID
- Link to examples showing how rules are applied
- Link to gate checklists that verify compliance

```markdown
---
id: SPEC-PLAYER-001
depends_on: [PRG-VIS-001, PRG-STK-001]
---

# Player Onboarding Specification

See also:
- [Vision](docs/vision/PRG-VIS-001.md)
- [Stakeholder Map](docs/stakeholders/PRG-STK-001.md)
- [Domain Model](docs/identity/03-domain-model.md)
- [Gate G2 Checklist](docs/quality-gates/G2-SPECIFICATION.md)
```

#### 0.4 Table of Contents

Any document longer than 2,000 words must include an automatic table of
contents at the top:

```markdown
## Contents

1. [Purpose](#purpose)
2. [Scope](#scope)
3. [Rules](#rules)
   - 3.1 [Naming](#naming)
   - 3.2 [Validation](#validation)
4. [Examples](#examples)
5. [Success Criteria](#success-criteria)
```

#### 0.5 Version Management

- MAJOR version for breaking changes (format, structure, fundamentals)
- MINOR version for new rules or sections
- PATCH version for clarifications, examples, corrections
- Document when you're reading an outdated version (mark in header)

```markdown
---
version: 2.1.0      # Major.Minor.Patch
status: SUPERSEDED  # If it's been replaced
supersedes: [1.0.0, 1.1.0, 1.2.0, 1.3.0, 2.0.0]
replaces_url: /docs/old-location/OLD-SPEC.md
migration_guide: /docs/migration/FROM-SPEC-V1-TO-V2.md
---

# Player Onboarding Specification

⚠️ **SUPERSEDED** — This is version 2.1.0.
- If you're reading this, make sure you want version 2.x (breaking changes)
- For version 1.x docs, see [Player Onboarding v1.0](OLD-SPEC.md)
- [Migration guide from v1 to v2](migration/FROM-SPEC-V1-TO-V2.md)
```

#### 0.6 Code Examples

Code examples must:
- Be complete and runnable (or explicitly marked as pseudo-code)
- Include traceability references
- Show both "good" and "bad" patterns
- Use realistic domain language
- Include comments explaining "why", not "what"

```typescript
// ✅ GOOD EXAMPLE
// SPEC-PLAYER-001-AC-A: Admin creates player onboarding workflow
async function createPlayerOnboarding(input: PlayerOnboardingInput): Promise<Player> {
  // Validate per SPEC-PLAYER-001-DATA contract
  // Throws InvalidPlayerAge if age not in 16–45 range
  validatePlayerAge(input.age);
  
  // Create transaction to ensure atomicity (Article 8: Server-Side Authority)
  const player = await db.transaction(async () => {
    const newPlayer = await Player.create(input);
    await AuditLog.create({ /* ... */ }); // Traceability
    return newPlayer;
  });
  
  return player;
}

// ❌ BAD EXAMPLE (for comparison)
// This violates several standards:
// 1. No specification reference
// 2. No error handling
// 3. Silent success assumption
// 4. No "why" explanation
async function createPlayer(input: any) {
  return Player.create(input);
}
```

### 1. Specification Document Standards (SPEC-X-001)

#### 1.1 Specification Anatomy

```markdown
---
id: SPEC-PLAYER-001
version: 1.0.0
status: ACCEPTED
depends_on: [PRG-VIS-001, ADR-0003]
---

# SPEC-PLAYER-001: Player Onboarding Workflow

## Purpose
[2–3 sentences describing what capability this spec defines]

## Scope
[Who can do this? What contexts apply? What's out of scope?]

## Stakeholders
- PRG-STK-001: Club Admin
- PRG-STK-002: Head Coach
- [Link to stakeholder map]

## Acceptance Criteria

### AC-A: Admin initiates player onboarding
[Detailed description of the step]

**Specification.**
[Formatted description with all details, constraints, and rules]

**Acceptance.**
- Condition 1
- Condition 2

**Related.**
- Vision: PRG-VIS-001
- Data Contract: SPEC-PLAYER-001-DATA
- API Contract: SPEC-PLAYER-001-API
- Test: TEST-PLAYER-001-AC-A

### AC-B: System validates player eligibility
[Similarly detailed]

## Data Contract (SPEC-PLAYER-001-DATA)

### Entities
[Define all entities involved]

### Fields
[Each field with type, constraints, and spec reference]

### Validation Rules
[Business rules encoded in schema]

## API Contract (SPEC-PLAYER-001-API)

### Endpoints

#### POST /players
[OpenAPI definition with traceability]

## Related Documents
- Domain Model: [link]
- Logical Data Model: [link]
- Canonical Data Model: [link]
- Glossary: [link to ubiquitous language]

## Examples

### Example 1: Happy Path
[Worked example with actual data]

### Example 2: Validation Failure
[Example of what happens when validation fails]

## Anti-patterns
❌ [Common mistake and why it's wrong]
✅ [Correct approach]

## Success Criteria
✓ [Gate G2 passes]
✓ [Acceptance criteria are SMART]
✓ [All AC are traceable to tests]

## Failure Conditions
✗ [Gate fails if]
✗ [Gate fails if]
```

#### 1.2 Acceptance Criteria Format

Each acceptance criterion must:
- Have a unique ID (AC-A, AC-B, etc.)
- Be testable (not vague)
- Link to domain rules and data constraints
- Include examples of success and failure
- Reference related acceptance criteria if dependent

```markdown
### AC-B: System validates player age

**Definition.** When an admin attempts to create a player record, the system
validates that the age is between 16 and 45 years inclusive. This constraint
implements the business rule that professional football players are typically
in this age range (PRG-VIS-001).

**Acceptance.**
- If age is provided and is between 16 and 45 (inclusive), accept
- If age is < 16 or > 45, reject with error code INVALID_PLAYER_AGE
- If age is not provided, reject with error code MISSING_REQUIRED_FIELD

**Related To.**
- Domain model: Player.age constraint
- Data contract: SPEC-PLAYER-001-DATA.age
- API contract: SPEC-PLAYER-001-API POST /players
- Tests: TEST-PLAYER-001-AC-B-1, TEST-PLAYER-001-AC-B-2
- Principle: Contract-First (Principle 3)

**Example: Valid Age**
```
Input: { age: 28 }
Result: ✓ Accepted
```

**Example: Invalid Age (Too Old)**
```
Input: { age: 50 }
Result: ✗ Rejected
Error: {
  code: "INVALID_PLAYER_AGE",
  message: "Player age must be between 16 and 45",
  constraint: { min: 16, max: 45, received: 50 }
}
```
```

### 2. Architecture Decision Record (ADR) Standards

#### 2.1 ADR Anatomy

```markdown
# ADR-0003: Event-Driven Identity Verification

**Date:** 2024-08-07

**Status:** ACCEPTED (was: PROPOSED)

**Context**
[Describe the technical issue that motivated this decision]
[Reference the specification or gate that requires this decision]
[State the constraints and trade-offs]

**Alternatives Considered**

1. Synchronous HTTP verification
   - Pros: Immediate feedback
   - Cons: Blocks registration flow; tight coupling
   - Rejected because: [Cite the rule or principle that forbids this]

2. Message Queue with Delayed Processing
   - Pros: Asynchronous, decoupled
   - Cons: Unclear completion timing
   - Rejected because: [SPEC-IDENTITY-001-AC-C requires < 30s notification]

3. Event-Driven with Streaming State ← **ACCEPTED**
   - Pros: Async, decoupled, full traceability
   - Cons: Requires event log infrastructure
   - Accepted because: [Cites Article 8, Principle 5, SPEC-IDENTITY-001]

**Decision**
[State the chosen solution clearly]
[Link to specification that this decision implements]

**Consequences**
- [Implication 1 and mitigation]
- [Implication 2 and mitigation]

**Related**
- Specification: SPEC-IDENTITY-001
- Principles: Server-Side Authority (Article 8)
- Tests: TEST-IDENTITY-EVENTS-001
- Traceability: ADR-0003 → SPEC-IDENTITY-001 → [requirements]
```

### 3. README Standards

Every repository and every major folder must include a README with:

#### 3.1 README Structure

```markdown
# Project Name

## Purpose
[One sentence: what is this?]

## Quick Start
[2–5 steps to get running locally]

## Structure
```
src/
  components/   [Description]
  routes/       [Description]
  lib/          [Description]
docs/
  [Description of docs]
tests/
  [Description of test structure]
```

## Documentation Index
- [Setup Guide](docs/setup.md)
- [Architecture](docs/architecture.md)
- [Specifications](docs/specifications)
- [API Reference](docs/api-reference.md)

## Key Files
- [package.json](package.json) — Dependencies, build scripts
- [CONTRIBUTING.md](CONTRIBUTING.md) — How to contribute
- [CHANGELOG.md](CHANGELOG.md) — What changed in each version

## Status
- [Open Issues](link)
- [Quality Gates](docs/quality-gates.md)
- [Roadmap](ROADMAP.md)
```

### 4. API Documentation Standards

#### 4.1 OpenAPI / Swagger

All APIs must be documented in OpenAPI 3.0+ with:
- Traceability tags linking to specifications
- Complete request and response schemas
- All error responses documented
- Examples of successful and error responses

```yaml
openapi: 3.0.0
info:
  title: Football Player API
  version: 1.0.0
  description: SPEC-PLAYER-001-API

paths:
  /players:
    post:
      summary: Create a player (SPEC-PLAYER-001-AC-A)
      operationId: createPlayer
      tags:
        - SPEC-PLAYER-001
        - SPEC-PLAYER-001-AC-A
      requestBody:
        description: Player data per SPEC-PLAYER-001-DATA
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PlayerInput'
      responses:
        '201':
          description: Player created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Player'
        '400':
          description: Validation error per SPEC-PLAYER-001-DATA
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationError'
        '401':
          description: Unauthorized (missing auth token)
        '403':
          description: Forbidden (insufficient permissions per SPEC-AUTH-001)
```

### 5. Database Documentation Standards

Every database table and column must be documented:

```sql
-- Table: players
-- Purpose: SPEC-PLAYER-001-DATA
-- Bounded Context: Player Management
-- Lifecycle: Created during onboarding, updated on field changes, archived on retirement

CREATE TABLE players (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- SPEC-PLAYER-001-DATA: Unique football identification number
  -- Format: [COUNTRY]-[SEQUENCE] (e.g., ID-12345)
  -- Constraint: UNIQUE, NOT NULL, validated at API layer
  football_id VARCHAR(20) NOT NULL UNIQUE,
  
  -- SPEC-PLAYER-001-DATA: Email address for contact
  -- Constraint: RFC 5322 compliant, UNIQUE, NOT NULL
  -- Validation: Server-side per SPEC-PLAYER-001-AC-B
  email VARCHAR(255) NOT NULL UNIQUE,
  
  -- Audit fields (standard across all tables)
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by UUID NOT NULL REFERENCES users(id)
);

-- Indexes
-- Performance: SPEC-PLAYER-001-PERF requires roster queries < 50ms p95
CREATE INDEX idx_players_email ON players(email);

-- Constraints
-- Article 8: Server-side authority over player data
ALTER TABLE players ADD CONSTRAINT players_created_by_fk
  FOREIGN KEY (created_by) REFERENCES users(id);
```

### 6. Changelog Standards

Changelogs must be maintained per [Keep a Changelog](https://keepachangelog.com/)
with traceability:

```markdown
# Changelog

All notable changes to this project are documented here.

## [2.1.0] — 2024-08-07

### Added
- SPEC-PLAYER-001-AC-C: Player invitation email on onboarding
  - Sends welcome email with login credentials
  - Tested by TEST-PLAYER-001-AC-C
  - Commits: [list with IDs]

### Fixed
- ADR-0003: Event-driven verification race condition
  - Fixes: [Incident link]
  - Tested by: TEST-PLAYER-EVENTS-RACE-001

### Changed
- SPEC-AUTH-001-V2: Login timeout reduced from 30 to 15 minutes
  - Migration: See [migration guide](docs/migration/v2-login-timeout.md)
  - Tests: TEST-AUTH-001-TIMEOUT-CHANGED

## [2.0.0] — 2024-07-15

### Breaking Changes
- SPEC-PLAYER-001: Changed email field from `player_email` to `email`
  - Migration required: See [migration guide](docs/migration/v2-email-field.md)
  - Commits: [list]
```

## Validation Checklist (All Documents)

At each gate, documents must pass:

- [ ] YAML frontmatter present and complete
- [ ] Purpose section answers "what and why"
- [ ] Scope section defines applicability
- [ ] All sections in expected order
- [ ] Traceability IDs present and correct
- [ ] Dependencies are accurate
- [ ] At least one worked example included
- [ ] Anti-patterns documented
- [ ] Success and failure criteria defined
- [ ] Links are correct and discoverable
- [ ] No orphaned documents (unreferenced)
- [ ] Version and status clearly marked
- [ ] Updated date is current

## Success Criteria

✓ All documents include required sections
✓ All formal documents have YAML frontmatter
✓ All traceability IDs are correct and unique
✓ All documents pass documentation gate checklist
✓ All examples are complete and runnable (or clearly marked as pseudo-code)
✓ All links are functional
✓ Documentation is discoverable via search

## Failure Conditions

✗ Document lacks YAML frontmatter (gate fail at all gates)
✗ Document lacks Purpose, Scope, Dependencies sections (gate fail)
✗ Traceability ID is incorrect or not unique (gate fail)
✗ Acceptance criteria are vague or untestable (gate fail at G2)
✗ API documentation lacks error responses (gate fail at G4)
✗ Database schema lacks comments (gate fail at G6)
✗ Example code is non-runnable and not marked as pseudo-code (gate fail)
✗ Documentation is out of date (marked as superseded but still referenced)
