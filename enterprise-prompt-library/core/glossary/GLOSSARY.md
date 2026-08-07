---
id: EPOS-CORE-GLOSS-001
version: 1.0.0
status: ACCEPTED
authority: DERIVED
depends_on: [EPOS-CORE-CON-001, EPOS-CORE-CON-002]
supersedes: []
---

# Glossary & Ubiquitous Language

## Purpose

Define the single, authoritative vocabulary for each bounded context, ensuring
all stakeholders (business, product, architecture, engineering) use the same
terms with the same meanings. Glossary entries prevent ambiguity, enforce
naming consistency, and document domain knowledge.

## Scope

Every bounded context within the enterprise has its own glossary section.
New terms introduced in specifications (SPEC-X-001) must be added to the
relevant glossary.

## Inputs

- Domain models (SPEC-X-DDD-001)
- Specifications (SPEC-X-001)
- Architecture Decision Records (ADRs)
- API contracts and data schemas
- Stakeholder interviews and requirements

## Outputs

- Glossary entries for each bounded context
- Ubiquitous language dictionary shared across stakeholders
- Naming conventions for code, tables, APIs, and documentation
- Consistency enforcement in code review and documentation review

## Dependencies

- `core/constitution/CONSTITUTION.md` (Article 4: Single Source of Truth)
- `core/constitution/PRINCIPLES.md` (Principle 4: Domain-Driven)
- Domain models (SPEC-X-DDD-001)

## Rules

### 0. Glossary Entry Format

Each glossary entry must include:

```markdown
## Term: <Domain Term>

**Abbreviated as:** [ABBR] (optional)

**Definition:** [1–2 sentences defining the term in business language]

**Context:** [Which bounded context(s) use this term?]

**Related Terms:** [Other terms that connect to this one]

**Specification Reference:** [SPEC-X-001 or SPEC-X-DDD-001]

**Code/Schema Names:** [How this maps to code, table, class, or function names]

**Examples:**

[2–3 concrete examples showing the term in use]

**Not to be confused with:** [Related but different terms that might cause confusion]

**See also:** [Links to related glossary entries, specs, or ADRs]
```

### 1. Core Enterprise Glossary

#### 1.1 EPOS & Governance Terms

```markdown
## Term: EPOS (Enterprise Prompt Operating System)

**Definition:** The single source of truth for all AI coding assistant rules,
templates, and validators. EPOS ensures all AI assistants (Lovable, Cursor,
Copilot, etc.) produce consistent, traceable, explainable implementations
aligned to enterprise architecture.

**Context:** Enterprise-wide, applies to all bounded contexts

**Related Terms:** Constitution, Principles, Platform Adapter, Quality Gate

**Code Names:**
- Repository: `enterprise-prompt-library/`
- Core rules: `core/`
- Adapters: `adapters/`

**Specification Reference:** None (EPOS is itself the authority)

**Examples:**
- "When using Copilot, reference the EPOS Constitution"
- "The adapter translates EPOS core rules into Lovable's prompt format"

---

## Term: Bounded Context

**Definition:** A logically cohesive, independently deployable domain with
a clearly defined boundary, its own ubiquitous language, data model, and API.

**Context:** Architecture, Domain-Driven Design

**Related Terms:** Domain, Aggregate, Ubiquitous Language

**Specification Reference:** ADR-0003, SPEC-ARCHITECTURE-001-DDD

**Code Names:**
- In folder structure: `src/contexts/<bounded-context>/`
- In database: schemas or table prefixes (e.g., `identity_*`, `player_*`)
- In API: path segments (e.g., `/identity/`, `/players/`)

**Examples:**
- Identity Context: player authentication and identity verification
- Player Context: player profile, roster management
- Competition Context: league, tournament, match scheduling

**Not to be confused with:**
- Module: smaller unit of code organization within a context
- Service: software component; a context may include multiple services
- Microservice: deployment unit; one context may map to multiple services
```

#### 1.2 Specification & Gate Terms

```markdown
## Term: Specification (SPEC-X-001)

**Abbreviated as:** SPEC

**Definition:** A formal, approved document defining the exact capability to
be built, including acceptance criteria, data contracts, API contracts, and
validation rules.

**Context:** Enterprise-wide, required for every feature

**Related Terms:** Acceptance Criterion, Data Contract, API Contract

**Specification Reference:** SPEC-SPECIFICATION-DRIVEN-001

**Code Names:**
- File pattern: `docs/specifications/SPEC-*.md` or `SPEC-*.yml`
- Traceability ID: `SPEC-<context>-<sequence>` (e.g., SPEC-PLAYER-001)
- In commits: referenced in commit message header

**Examples:**
- SPEC-PLAYER-001: Player Onboarding Workflow
- SPEC-IDENTITY-001-AC-B: Email validation acceptance criterion
- SPEC-PLAYER-001-DATA: Player entity data contract

**Not to be confused with:**
- Requirements: informal, often vague requests (specs operationalize requirements)
- Design: how something is built (specs define what to build)
- API documentation: reverse-engineered after code (specs are written before)
```

#### 1.3 Approval & Gate Terms

```markdown
## Term: Quality Gate (G0–G7)

**Abbreviated as:** Gate, GN (e.g., G6)

**Definition:** A mandatory stage checkpoint where artefacts are reviewed and
must pass an explicit checklist before proceeding to the next stage. Gates
enforce sequential progression and prevent defective artefacts from advancing.

**Context:** Enterprise-wide, every feature passes G0–G7

**Related Terms:** Gate Verdict, Stage, Approval

**Specification Reference:** QUALITY-GATES.md

**Examples:**
- G0: Vision passes Business Integrity review
- G2: Specification passes completeness and testability review
- G6: Code passes security, performance, and standards review
- G7: Release passes production readiness review

**Not to be confused with:**
- Review: informal feedback (gates are formal with a verdict)
- Approval: sign-off (gates include approval as part of verdict)

---

## Term: Gate Verdict

**Definition:** The recorded outcome of a gate review: PASS, CONDITIONAL PASS
(with conditions and due date), or FAIL (with blocking findings).

**Context:** Every gate

**Related Terms:** Quality Gate, Approval, Blocking Finding

**Code Names:**
- In gate logs: `GATE_<N>_VERDICT`
- Stored in: `docs/gate-verdicts/` or release notes

**Examples:**
- "GATE G2 — Specification Review: PASS"
- "GATE G6 — Code Review: CONDITIONAL PASS (fix: Security scan issues, due Friday)"
- "GATE G4 — API Review: FAIL (blocking: OpenAPI contract missing)"
```

#### 1.4 Traceability Terms

```markdown
## Term: Traceability ID

**Definition:** A globally unique identifier attached to an artefact,
decision, code change, or test that links it upward to a business requirement
and downward to verification.

**Abbreviated as:** ID, Trace ID

**Context:** Enterprise-wide, every artefact

**Related Terms:** Traceability Matrix, Upward Tracing, Downward Verification

**Specification Reference:** TRACEABILITY.md

**Code Names:**
- Format: `[CONTEXT]-[TYPE]-[SEQUENCE]` (e.g., `PLAYER-SPEC-001`)
- In code: JSDoc, docstring, or function comment
- In commits: message header (e.g., `[SPEC-PLAYER-001]`)
- In URLs/tags: OpenAPI tags, database comments

**Examples:**
- `PRG-VIS-001`: Vision Positioning Statement
- `SPEC-PLAYER-001`: Player Onboarding Specification
- `ADR-0003`: Architecture Decision Record 3
- `TEST-PLAYER-001-AC-A`: Test for AC-A

**Not to be confused with:**
- Version: semantic version of a document (traces are stable)
- Ticket ID: Jira or issue tracking (traces are specification-driven)
```

### 2. Identity Bounded Context Glossary

(This is an example; each context has its own glossary)

```markdown
## Term: Player

**Definition:** A human individual who participates in football activities
within the federation. A player has identity verification, age constraints
(16–45), and permission to participate in clubs and competitions.

**Context:** Identity, Player, Competition

**Related Terms:** User, Account, Club, Coach

**Specification Reference:** SPEC-PLAYER-001, SPEC-IDENTITY-001-DDD

**Code Names:**
- Table: `players`
- Class: `Player`
- API endpoint: `/players`
- Schema: `SPEC-PLAYER-001-DATA`

**Examples:**
- "When a player is onboarded, their email is verified"
- "A player can transfer to a different club"
- "Players aged 16–45 are eligible for professional leagues"

**Not to be confused with:**
- User: system login account (a player may have 0+ user accounts)
- Account: billing or organizational account (a player is an individual)

---

## Term: Identity Verification

**Definition:** The process of confirming that a player's identity (name, age,
nationality) is legitimate and authentic, typically via email confirmation
and optional document upload.

**Context:** Identity

**Related Terms:** Authentication, Authorization, Onboarding, Email Confirmation

**Specification Reference:** SPEC-IDENTITY-001-AC-C

**Code Names:**
- Status field: `identity_verified` (boolean)
- Event: `IdentityVerified` (domain event)
- API: `POST /identity/verify`
- Validation rule: `IDENTITY_VERIFIED_CONSTRAINT`

**Examples:**
- "Identity verification requires email confirmation within 30 days"
- "Players with unverified identity cannot participate in competitions"

**Not to be confused with:**
- Authentication: proving you are who you claim (identity verification)
- Authorization: what you're allowed to do (separate permission system)
```

### 3. Glossary Maintenance

#### 3.1 Adding New Terms

When a specification introduces a new term:

1. Define it in the relevant bounded context glossary
2. Add to EPOS glossary PR review checklist
3. Update related terms (bi-directional links)
4. Reference the specification that introduced it
5. Ensure code uses this term consistently

#### 3.2 Retiring Terms

When a term is no longer used:

1. Mark as "DEPRECATED" in glossary
2. Suggest replacement term
3. Document the change in changelog
4. Give 2 release cycles for migration
5. Then remove the glossary entry

### 4. Naming Conventions

Every bounded context must establish naming conventions derived from its
glossary:

```markdown
## Identity Context — Naming Conventions

### Entities (Classes)
- Prefix: None (use domain term directly)
- Convention: PascalCase
- Examples: `Player`, `Club`, `Account`, `IdentityVerification`

### Collections (Tables, Variables)
- Prefix: None
- Convention: PascalCase plural or singular as appropriate
- Examples: `players`, `clubs`, `accounts`

### APIs (Endpoints, Operations)
- Convention: lowercase with hyphens, resource-oriented
- Examples: `/players`, `/players/{playerId}`, `/identity/verify`

### Database Columns
- Convention: snake_case
- Examples: `player_id`, `identity_verified`, `verified_at`

### Enums & Constants
- Convention: UPPER_SNAKE_CASE
- Examples: `IDENTITY_VERIFIED`, `PLAYER_INACTIVE`

### Events (Domain Events)
- Convention: PastTense + "Event"
- Examples: `PlayerCreated`, `IdentityVerified`, `TransferInitiated`

### Variables (Code)
- Convention: camelCase for public, _camelCase for private
- Examples: `playerName`, `_internalCache`
```

## Glossary Update Checklist (G2–G3)

At Specification review gates, verify:

- [ ] All new terms are in the glossary
- [ ] Glossary entry follows the standard format
- [ ] Related terms are linked bidirectionally
- [ ] Code names are consistent with naming conventions
- [ ] No duplicate or overlapping term definitions
- [ ] Terms use domain language, not programmer convenience
- [ ] Specification references are correct
- [ ] At least one example provided for each term

## Success Criteria

✓ Every bounded context has a glossary
✓ Every specification introduces terms to the glossary
✓ Code, tables, APIs, and tests use glossary terms consistently
✓ No ambiguous or duplicated term definitions
✓ Glossary is discoverable and searchable
✓ Code review catches naming that violates glossary

## Failure Conditions

✗ New term introduced in spec without glossary entry (gate fail at G2)
✗ Code uses name that doesn't match glossary (gate fail at G6)
✗ Duplicate term definitions (gate fail at all gates)
✗ Glossary term differs from ubiquitous language spoken by stakeholders
✗ Database table or API endpoint uses name not in glossary
