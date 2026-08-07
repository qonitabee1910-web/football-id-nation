---
id: EPOS-CORE-TRC-001
version: 1.0.0
status: ACCEPTED
authority: DERIVED
depends_on: [EPOS-CORE-CON-001, EPOS-CORE-WFL-001]
supersedes: []
---

# Traceability Framework

## Purpose

Establish the single, mandatory system for ensuring every artefact, decision,
code change, test, and deployment is traceable upward to a business requirement
and downward to verification. Traceability is not optional; it is Article 5 of
the Constitution.

## Scope

Every artefact produced from Vision (G0) through Release (G7) must carry at
least one traceability identifier that links it to:
- A business outcome or requirement (upward)
- A test, review, or verification event (downward)
- An approval checkpoint (gate verdict)

## Inputs

- Business requirements and story maps (from Vision, G0)
- Specifications (from Spec, G2–G3)
- Architectural decisions (ADRs)
- Source commits
- Test results and release logs
- Code review and gate verdicts

## Outputs

- Traceability matrix: requirement → spec → code → test → release
- Traceability IDs on every artefact and commit message
- Untraced work is identified as defective at each gate
- Traceability audit reports

## Dependencies

- `core/constitution/CONSTITUTION.md` (Article 5)
- `core/workflow/WORKFLOW.md`
- `core/quality-gates/QUALITY-GATES.md`

## Rules

### Traceability ID Format

```
[CONTEXT]-[TYPE]-[STAGE]-[SEQUENCE]

Examples:
PRG-STK-001         Stakeholder Map entry
PRG-VIS-001         Vision Positioning Statement
IDENTITY-PRD-001    Product Requirement, Identity Context
ADR-0003            Architecture Decision Record 3
SPEC-IDENTITY-001   Specification, Identity feature
DB-IDENTITY-001     Schema or migration identifier
API-IDENTITY-001    Endpoint or contract identifier
TEST-IDENTITY-001   Test case identifier
REL-IDENTITY-001    Release artefact identifier
COMMIT-12345        Commit carrying traceability tag
```

### Mandatory Traceability Locations

1. **Vision Artefacts (G0)**
   - Each stakeholder map entry: `PRG-STK-{seq}`
   - Each vision statement: `PRG-VIS-{seq}`
   - Each success metric: `PRG-VIS-{seq}-METRIC`

2. **Specification Artefacts (G2–G3)**
   - Each requirement: `SPEC-{context}-{seq}`
   - Each acceptance criterion: `SPEC-{context}-{seq}-AC-{letter}`
   - Each data contract: `SPEC-{context}-{seq}-DATA`
   - Each API contract: `SPEC-{context}-{seq}-API`

3. **Architectural Artefacts**
   - Each ADR: `ADR-{seq}` (global sequence)
   - Each schema change: `SCHEMA-{context}-{seq}`
   - Each infrastructure change: `INFRA-{context}-{seq}`

4. **Source Code**
   - Commit message header: `[SPEC-ID] [ADR-ID] Short description`
   - Each function: JSDoc or docstring header with traceability
   - Database migration: filename and comment header with traceability
   - Each test: test name includes traceability ID
   - Each endpoint: OpenAPI tag with traceability ID

5. **Deployment & Release**
   - Release notes: linked to requirements and commits
   - Migration checklist: linked to schema change and test
   - Rollback plan: linked to release and health checks
   - Post-release review: linked to deployment artefacts

### Upward Traceability Chain

Every piece of code traces backward through:

```
Code (SPEC-X-001)
  ↑ Specification (SPEC-X-001)
  ↑ PRD Requirement (PRG-VIS-001)
  ↑ Business Objective (PRG-VIS-001)
  ↑ Stakeholder Need (PRG-STK-001)
```

No code is written without this chain complete.

### Downward Verification Chain

Every requirement verifies forward through:

```
Requirement (SPEC-X-001)
  ↓ Acceptance Test (TEST-X-001)
  ↓ Integration Test (TEST-INTEG-001)
  ↓ E2E Test (TEST-E2E-001)
  ↓ Performance Test (TEST-PERF-001)
  ↓ Security Scan (SEC-SCAN-001)
  ↓ Release Verification (REL-VERIFY-001)
```

No requirement is considered satisfied without this chain.

### Traceability Matrix Requirements

The traceability matrix must be updated at each gate and must show:

1. **Requirement ID** → **Specification ID** → **ADR ID** (if applicable)
2. **Specification ID** → **Code Location** (file, function, line range)
3. **Code Location** → **Test ID** (unit, integration, E2E, security, performance)
4. **Test ID** → **Gate Verdict** (G0–G7, pass/fail)
5. **Gate Verdict** → **Release Notes Entry**

Matrix is updated at each stage gate completion.

### What Breaks Traceability (Forbidden)

1. Code without a linked specification
2. Specification without a linked requirement or vision
3. Test without a linked specification
4. Commit message without traceability ID in header
5. Database schema change without migration ID and traceability
6. Endpoint deployed without OpenAPI contract bearing traceability ID
7. Release notes without traceability links to commits, specs, and tests
8. Migration or breaking change without rollback plan and trace to release
9. Security scan result without trace to code location and remediation spec
10. Post-release bug without trace to specification or test gap

### Traceability Review Checklist (G1–G7)

Each gate must verify:

- [ ] All artefacts carry valid traceability IDs
- [ ] Traceability matrix is current and gapless
- [ ] Each requirement has at least one test
- [ ] Each test references a specification
- [ ] Each specification references a vision or stakeholder need
- [ ] Each commit message carries a traceability ID in the header
- [ ] Each code change references its specification in JSDoc/docstring
- [ ] Release notes link back to commits via traceability IDs
- [ ] No orphaned artefacts exist (unlinked to any requirement)
- [ ] No orphaned requirements exist (unlinked to any test or code)

### Anti-patterns

❌ **Copying requirement text into commit message** → violates Article 4 (SSOT)
   Better: commit message references the requirement ID

❌ **Inferring specification from code comments** → violates Specification-Driven
   Better: specification is a first-class artefact with its own ID

❌ **Skipping traceability ID in commit message** → violates Article 5
   Better: `[SPEC-ID] [ADR-ID] Short description` mandatory

❌ **Creating "micro" traceability IDs for every line** → noise and unmaintainable
   Better: group logically at function/feature/requirement level

❌ **Orphaned tests (test without spec)** → violates chain integrity
   Better: every test references the spec it verifies

### Examples

#### Example 1: Vision → Spec → Code → Test → Release

**Vision Artefact (G0)**
```
PRG-VIS-001: Football Clubs can onboard new players via automated workflow
  - Reduces onboarding time by 80%
  - PRG-STK-001 (Admin), PRG-STK-002 (Coach)
```

**Specification (G2)**
```
SPEC-ONBOARDING-001: Player Onboarding Workflow
  AC-A: Admin uploads player CSV file
  AC-B: System validates email uniqueness  [SPEC-ONBOARDING-001-AC-B]
  AC-C: Player receives invitation email   [SPEC-ONBOARDING-001-AC-C]

Data Contract:
  SPEC-ONBOARDING-001-DATA: Player entity with fields (id, email, name, ...)
  
API Contract:
  SPEC-ONBOARDING-001-API: POST /onboarding/players (upload CSV)
```

**Code (commits)**
```
[SPEC-ONBOARDING-001] [ADR-0008] Add player onboarding endpoint

  - POST /onboarding/players implementation
  - CSV parsing and validation per SPEC-ONBOARDING-001-AC-B
  - Email invitation per SPEC-ONBOARDING-001-AC-C
```

**Database Migration**
```
filename: 2024-08-01-001-create-player-table.sql
-- SPEC-ONBOARDING-001-DATA
-- Creates players table with email unique constraint
```

**Test**
```
TEST-ONBOARDING-001: Player Onboarding Workflow
  TEST-ONBOARDING-001-AC-B: Email validation ✓
  TEST-ONBOARDING-001-AC-C: Invitation sent ✓
  TEST-ONBOARDING-001-PERF: CSV upload < 5s for 10K rows ✓
```

**Release Notes**
```
v2.1.0: Player Onboarding Automation
  Implements: SPEC-ONBOARDING-001
  Commits: [list with SPEC IDs]
  Tests: TEST-ONBOARDING-001 (all AC verified)
  Migration: 2024-08-01-001 [SPEC-ONBOARDING-001-DATA]
```

### Tooling & Automation

The traceability matrix should be:
- Maintained in a single file (e.g., `docs/traceability-matrix.csv`)
- Updated automatically if CI/CD parses commit messages
- Reviewed at each gate as part of the gate verdict
- Included in release notes and deployment checklists

### Success Criteria

✓ Every artefact (spec, test, code, release doc) carries a valid traceability ID
✓ Traceability matrix is gapless: every requirement has tests, every test verifies specs
✓ No orphaned requirements (spec with no test)
✓ No orphaned code (code with no linked spec)
✓ Gate verdicts record traceability matrix status
✓ Release notes link back to specifications and commits
✓ Post-release incidents trace back to root cause and test gaps

### Failure Conditions

✗ Commit message lacks traceability ID in header (gate fail at G6)
✗ Code review finds code not referenced in a specification (gate fail at G4)
✗ Test written without a specification (gate fail at G5)
✗ Release notes lack traceability links (gate fail at G7)
✗ Traceability matrix shows orphaned requirements or code (gate fail at all gates)
