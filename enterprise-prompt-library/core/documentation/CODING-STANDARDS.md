---
id: EPOS-CORE-DOC-001
version: 1.0.0
status: ACCEPTED
authority: DERIVED
depends_on: [EPOS-CORE-CON-001, EPOS-CORE-EXP-001, EPOS-CORE-TRC-001]
supersedes: []
---

# Coding Standards

## Purpose

Establish mandatory coding standards for all implementation across all
languages and platforms that ensure code is readable, maintainable, secure,
and aligned with EPOS principles. Standards apply to production code, tests,
migrations, and infrastructure code.

## Scope

All source code, test suites, database migrations, infrastructure-as-code, and
scripts produced by or reviewed under EPOS, regardless of language.

## Inputs

- Constitution and Principles (core rules)
- Traceability and Explainability frameworks
- Specification for the feature being implemented
- Approved coding standards from the bounded context

## Outputs

- Code that passes automated linting and formatting checks
- Code that passes manual code review conformance checks
- Code review verdicts citing specific standards violated
- Updated configuration files for linters and formatters

## Dependencies

- `core/constitution/CONSTITUTION.md` (Articles 1–6, 8–9)
- `core/constitution/PRINCIPLES.md`
- `core/traceability/TRACEABILITY.md`
- `core/traceability/EXPLAINABILITY.md`
- `.eslintrc`, `.prettier.json`, or equivalent linting config per language

## Rules

### 0. Universal Standards (All Languages)

#### 0.1 Specification and Traceability
- Every function, class, or component must carry a reference to the
  specification it implements (SPEC-ID in docstring/comment)
- Commit message header must include traceability ID: `[SPEC-X-001] Description`
- Database migrations must reference the schema change ID and specification
- OpenAPI/GraphQL definitions must carry traceability tags

#### 0.2 Explainability
- Non-obvious business logic must have a "why" comment referencing a
  specification or ADR, not a "what" comment
- Every architectural decision must be documented as an ADR, not hidden
  in code or commit history
- Refusals must cite the violated rule and prerequisite
- Code review comments must propose a remedy aligned to a rule

#### 0.3 Naming Conventions (Ubiquitous Language)
- Names must use the ubiquitous language from the bounded context's
  domain model (SPEC-CONTEXT-DDD-001)
- Names must not leak database table names, implementation frameworks,
  or temporary design choices
- Functions and classes use domain terminology, not programmer convenience

**Examples:**
```
❌ BAD:
  table: users (leaks db naming)
  function: getUserById (uses implementation rather than domain)
  class: PlayerController (mixes pattern/language)

✅ GOOD:
  class: Player (domain entity)
  table: players (consistent with domain language)
  function: findPlayerById (domain language + verb)
  record: FootballPlayer (specific domain type if needed)
```

#### 0.4 Error Handling
- All errors must include:
  - Error type or code (e.g., InvalidPlayerAge, ResourceNotFound)
  - Human-readable message in the context language
  - Machine-readable code for traceability
  - Internal context (stack trace, request ID) for debugging, not shown to users

```javascript
// ✅ GOOD: Explainable error
throw new InvalidPlayerAgeError({
  code: "INVALID_PLAYER_AGE",
  message: "Player age must be between 16 and 45 per SPEC-PLAYER-001-AC-D",
  specRef: "SPEC-PLAYER-001-AC-D",
  details: { received: 50, minimum: 16, maximum: 45 },
  traceId: requestId,
});
```

#### 0.5 Immutability Defaults
- Default to immutable data structures and const bindings
- Mutate only when explicitly necessary and documented
- When mutating, include a "why" comment explaining why immutability is violated

```javascript
// ✅ GOOD: Immutable by default
const players = [/* ... */];
const filtered = players.filter(p => p.age >= 16); // Immutable

// ✅ OK: Mutation documented
const roster = roster || [];
roster.push(newPlayer); // MUTATION: Justified by SPEC-X-001-AC-B (batch load)
```

#### 0.6 No Magic Numbers or Strings
- Every numeric or string constant must be named and sourced from specification
- If the constant comes from a spec, include the spec reference

```javascript
// ❌ BAD: Magic number
if (age > 45) { /* ... */ }

// ✅ GOOD: Named constant with spec reference
const MAX_PLAYER_AGE = 45; // SPEC-PLAYER-001-AC-D: maximum transferable age
if (age > MAX_PLAYER_AGE) { /* ... */ }
```

#### 0.7 Secrets and Sensitive Data
- No secrets in code, environment files, or comments
- Use environment variables, secrets managers, or external vaults
- Connection strings, API keys, and credentials are never logged or printed
- Log entries must not include PII (personally identifiable information)

#### 0.8 Validation
- All user input and external data is validated server-side
- Client-side validation is presentation only and never trusted (Article 8)
- Validation rules are sourced from specification (SPEC-X-001-DATA contract)
- Validation failures include the rule that was violated

```javascript
// ✅ GOOD: Server-side validation
app.post("/players", (req, res) => {
  // Parse input
  const { email, age } = req.body;
  
  // Validate per SPEC-PLAYER-001-DATA
  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: "INVALID_EMAIL",
      message: "Email must be RFC 5322 compliant per SPEC-PLAYER-001-DATA",
      specRef: "SPEC-PLAYER-001-DATA",
    });
  }
  
  if (age < 16 || age > 45) {
    return res.status(400).json({
      error: "INVALID_AGE",
      message: "Age must be between 16 and 45 per SPEC-PLAYER-001-AC-D",
      specRef: "SPEC-PLAYER-001-AC-D",
      constraint: { min: 16, max: 45 },
    });
  }
  // ... continue
});
```

#### 0.9 Testing
- Every acceptance criterion must have a test (TEST-X-001-AC-A, etc.)
- Test names must reference the specification they verify
- Tests must not depend on test execution order
- 100% code coverage for business logic (not required for boilerplate)

```javascript
// ✅ GOOD: Explainable test name
describe("SPEC-PLAYER-001: Player Onboarding", () => {
  it("AC-A: Admin can upload CSV file with valid players", () => {
    // TEST-PLAYER-001-AC-A
  });
  
  it("AC-B: System validates email uniqueness per SPEC-PLAYER-001-AC-B", () => {
    // TEST-PLAYER-001-AC-B
  });
});
```

### 1. JavaScript / TypeScript Standards

#### 1.1 Type Safety
- All code must be written in TypeScript (no `any` except at boundary layers)
- Types are inferred from specifications (SPEC-X-001-DATA)
- Generic types must be named explicitly (avoid `T`, use `TEntity` or domain type)

```typescript
// ❌ BAD
function createPlayer(data: any): any {
  return data;
}

// ✅ GOOD
interface Player {
  id: string; // SPEC-PLAYER-001-DATA: unique football_id
  email: string; // SPEC-PLAYER-001-DATA: RFC 5322, unique
  age: number; // SPEC-PLAYER-001-DATA: 16–45
  // ... per SPEC-PLAYER-001-DATA contract
}

function createPlayer(data: Player): Player {
  return data;
}
```

#### 1.2 Async/Await
- Use async/await instead of `.then().catch()`
- Always await promises; never create unhandled rejections
- Error handling must use try/catch or error boundaries

```typescript
// ❌ BAD: Unhandled promise
async function loadPlayers() {
  fetch("/players").then(r => r.json()); // Unhandled rejection risk
}

// ✅ GOOD: Error handling
async function loadPlayers() {
  try {
    const response = await fetch("/players");
    const players = await response.json();
    return players;
  } catch (error) {
    throw new DataLoadError({
      message: "Failed to load players from API",
      cause: error,
      specRef: "SPEC-PLAYER-001-API",
    });
  }
}
```

#### 1.3 Linting & Formatting
- ESLint config must enforce these standards (not optional suggestions)
- Prettier must format all code consistently
- CI/CD must fail if linting or formatting checks don't pass
- All rules are documented with justification and specification reference

#### 1.4 Function Size
- Functions should be small (<50 lines) and single-purpose
- If a function is doing multiple things, split per specification acceptance criteria
- Each function should implement exactly one acceptance criterion or helper

#### 1.5 Exports and Dependencies
- Explicit exports only (no `export *`)
- Circular dependencies are forbidden
- Import only what is needed
- Dependencies are managed in package.json and locked via package-lock.json

### 2. Database Standards (SQL / Postgres)

#### 2.1 Schema Design
- Table and column names use ubiquitous language, not programmer convenience
- Every table and column must have a comment linking to SPEC-X-001-DATA
- Constraints are explicit (NOT NULL, UNIQUE, FOREIGN KEY, CHECK) per spec
- No "magic" columns except audit fields (created_at, updated_at, created_by)

```sql
-- ✅ GOOD: Explicit schema with traceability
CREATE TABLE players (
  id UUID PRIMARY KEY,
  -- SPEC-PLAYER-001-DATA: unique football identification number
  football_id VARCHAR(20) NOT NULL UNIQUE,
  
  -- SPEC-PLAYER-001-DATA: RFC 5322 compliant email
  email VARCHAR(255) NOT NULL UNIQUE,
  
  -- SPEC-PLAYER-001-DATA: full name
  full_name VARCHAR(255) NOT NULL,
  
  -- SPEC-PLAYER-001-DATA: age must be 16–45
  age INT NOT NULL CHECK (age >= 16 AND age <= 45),
  
  -- Audit fields
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by UUID NOT NULL REFERENCES users(id),
  
  CONSTRAINT players_pkey PRIMARY KEY (id)
);

COMMENT ON TABLE players IS 'SPEC-PLAYER-001-DATA: Football player entity';
COMMENT ON COLUMN players.football_id IS 'SPEC-PLAYER-001-DATA: unique identifier';
```

#### 2.2 Migrations
- Every migration must have a traceability ID in the filename and header comment
- Filename: `YYYY-MM-DD-SEQ-schema-operation.sql`
- Header comment: `-- SCHEMA-X-001: Description, SPEC-X-001-DATA reference`
- Rollback scripts must be tested and included

```sql
-- Migration: 2024-08-07-001
-- SCHEMA-PLAYER-001: Create players table
-- SPEC-PLAYER-001-DATA: Implements player entity schema
-- Rollback: DROP TABLE IF EXISTS players CASCADE;

CREATE TABLE players (
  -- ... as above
);

-- Verification: SELECT COUNT(*) FROM players;
```

#### 2.3 Indexes
- Indexes must be explicitly created with justification
- Index naming: `idx_<table>_<columns>`
- Comment with reason: performance test reference or query pattern

```sql
-- Performance: SPEC-PLAYER-001-PERF requires roster queries < 50ms p95
-- TEST-PLAYER-PERF-001: roster query uses email lookup
CREATE INDEX idx_players_email ON players(email);
```

#### 2.4 Views and Materialized Views
- Use views only for authorization (RLS) or common query patterns
- Views must be documented with their purpose and specification reference
- Materialized views must include refresh strategy and performance SLA

#### 2.5 Stored Procedures
- Stored procedures are forbidden unless required by policy
  (Rationale: code should be in application layer, version-controlled)
- If required: must be version-controlled, tested, and traced

### 3. API Standards (OpenAPI / REST)

#### 3.1 Contracts
- API contracts must be authored in OpenAPI 3.0+ before implementation
- Contracts are stored in version control alongside code
- Contracts must include traceability tags linking to specifications

```yaml
# openapi.yaml — SPEC-PLAYER-001-API
paths:
  /players:
    post:
      operationId: createPlayer # SPEC-PLAYER-001-API-OP-1
      tags: [SPEC-PLAYER-001, SPEC-PLAYER-001-AC-A]
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PlayerInput'
      responses:
        '201':
          description: Player created (SPEC-PLAYER-001-AC-A)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Player'
        '400':
          description: Validation error per SPEC-PLAYER-001-DATA
```

#### 3.2 Endpoint Naming
- RESTful resource naming using ubiquitous language
- Plural nouns for collections: `/players`, `/clubs`
- Specific resource: `/players/{playerId}`
- Actions: use HTTP verbs (GET, POST, PATCH, DELETE), not action names

```
❌ BAD:
  POST /getPlayer (should be GET)
  POST /createPlayer (should use POST /players)
  POST /player/activate (action in URL)

✅ GOOD:
  GET /players
  GET /players/{playerId}
  POST /players (create)
  PATCH /players/{playerId} (update)
  DELETE /players/{playerId} (delete)
```

#### 3.3 Error Responses
- All error responses must include:
  - HTTP status code
  - Error code (e.g., "INVALID_PLAYER_AGE")
  - Human-readable message
  - Specification reference (specRef)
  - Field errors (for validation errors)

```json
{
  "error": {
    "code": "INVALID_PLAYER_AGE",
    "message": "Player age must be between 16 and 45 per SPEC-PLAYER-001-AC-D",
    "specRef": "SPEC-PLAYER-001-AC-D",
    "timestamp": "2024-08-07T10:30:00Z",
    "traceId": "abc123",
    "fields": [
      {
        "name": "age",
        "value": 50,
        "error": "CONSTRAINT_VIOLATION",
        "constraint": "max_age",
        "limit": 45
      }
    ]
  }
}
```

#### 3.4 Authentication & Authorization
- Authentication credentials are never passed in URL or request body
- Use Authorization header with Bearer tokens (JWT, OAuth2, etc.)
- Authorization is enforced server-side, never trusted from client
- RLS (Row-Level Security) is implemented in the database where applicable

### 4. Testing Standards

#### 4.1 Test Structure
- Tests are organized per specification section
- Test file naming: `<feature>.spec.ts` or `<feature>.test.ts`
- Test names reference the spec and acceptance criterion

```typescript
// SPEC-PLAYER-001: Player Onboarding Workflow
describe("Player Onboarding (SPEC-PLAYER-001)", () => {
  describe("AC-A: Admin initiates transfer", () => {
    it("should create transfer request with valid club ID", async () => {
      // TEST-PLAYER-001-AC-A-1
    });
    
    it("should reject transfer if club does not exist", async () => {
      // TEST-PLAYER-001-AC-A-2: Verification of constraint
    });
  });
  
  describe("AC-B: System validates player eligibility", () => {
    it("should reject player if age > 45", async () => {
      // TEST-PLAYER-001-AC-B-1: SPEC-PLAYER-001-AC-D constraint
    });
  });
});
```

#### 4.2 Assertion Clarity
- Assertions must be clear about what is being verified
- Use descriptive matchers or include comments

```javascript
// ❌ BAD: Unclear assertion
expect(result).toBe(true);

// ✅ GOOD: Clear assertion with spec reference
expect(player.age).toBeLessThanOrEqual(45); // SPEC-PLAYER-001-AC-D
```

#### 4.3 No Test Interdependence
- Tests must be runnable in any order
- Setup/teardown must be isolated per test
- Shared state is forbidden (use beforeEach, not shared variables)

#### 4.4 Coverage Targets
- Business logic: 100% code coverage
- Controllers/handlers: 80%+ coverage
- Utility functions: 90%+ coverage
- Framework boilerplate: 0% required

### 5. Documentation Standards

All code must be documented such that it is understandable without reading
implementation details. See `core/documentation/DOCUMENTATION-STANDARDS.md`.

## Success Criteria

✓ All code passes ESLint/language-specific linter without warnings
✓ All code is formatted via Prettier/language-specific formatter
✓ Every function carries traceability to a specification
✓ Every commit message includes traceability ID and explanation
✓ All non-obvious logic includes a "why" comment
✓ All validation is server-side
✓ No secrets in version control
✓ Database schema is documented with spec references
✓ API contracts are OpenAPI compliant
✓ Tests pass with 100% business logic coverage (or documented exception)
✓ Code review passes conformance checklist

## Failure Conditions

✗ Code fails linting checks (gate fail at G6)
✗ Commit message lacks traceability ID (gate fail at G6)
✗ Non-obvious logic lacks a "why" comment (gate fail at G4 code review)
✗ Validation is client-side only (gate fail at G6)
✗ Secrets found in commit (gate fail and rollback at G7)
✗ API contract is missing or inconsistent with code (gate fail at G4)
✗ Test coverage < 80% for business logic (gate fail at G5)
✗ Database schema lacks comments or constraints (gate fail at G6)
