---
id: EPOS-ADAPTER-CLINE-BOOTSTRAP-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-ADAPTER-CLINE-001]
---

# Cline Bootstrap

## Installation & Configuration

1. **Install Cline in VS Code**
   - Open VS Code Extensions
   - Search for "Cline"
   - Install the extension by Anthropic

2. **Create `.cline/` directory**
   ```bash
   mkdir -p .cline
   touch .cline/system-prompt.md
   touch .cline/work-log.md
   touch .cline/gate-status.md
   ```

3. **Copy system prompt**
   - Copy the system prompt from `adapters/cline/ADAPTER.md`
   - Paste into Cline settings > System Prompt
   - Verify it's active by opening Cline in VS Code

4. **Configure Cline context**
   - In Cline, set initial context: `@spec/SPEC-[CONTEXT]-001.md`
   - Cline will load the specification as context
   - Reference other files with `@src/file.js` syntax

## Cline Workflow for EPOS

### Step 1: Start a Task

```
You: Open Cline and provide this prompt:

Task: Implement specification feature

Specification: @spec/SPEC-[CONTEXT]-001.md

Please:
1. Read and summarize the specification
2. List the acceptance criteria (AC-A, AC-B, ...)
3. Show me the data contract (SPEC-[CONTEXT]-001-DATA)
4. Show me the API contract (SPEC-[CONTEXT]-001-API)
5. Ask me to confirm these are correct
```

### Step 2: Design Phase

```
You: Provide this to Cline:

Now design the implementation:
1. Which files need to change?
2. Which functions need to be added/modified?
3. How does this map to the data model?
4. Where is authorization enforced?
5. What validation rules apply?
6. What errors can occur?

Show me your design plan as a checklist.
```

### Step 3: Implementation Phase

```
You: Provide this to Cline:

Implement the feature:
1. Add type definitions for data contract
2. Add validation function per SPEC-[CONTEXT]-001-DATA
3. Add API endpoint per SPEC-[CONTEXT]-001-API
4. Add server-side authorization checks
5. Include error handling with spec-referenced error codes

As you implement:
- Reference the spec in comments (// SPEC-[CONTEXT]-001-AC-A)
- Each function has a spec reference
- All business logic has explanatory comments (WHY, not WHAT)
```

### Step 4: Testing Phase

```
You: Provide this to Cline:

Write tests for each acceptance criterion:
1. TEST-[CONTEXT]-001-AC-A: Test AC-A behavior
2. TEST-[CONTEXT]-001-AC-B: Test AC-B behavior
3. TEST-[CONTEXT]-001-[X]: Test validation rules
4. TEST-[CONTEXT]-001-[X]: Test error cases
5. TEST-[CONTEXT]-001-[X]: Test authorization

After each test file:
- Cline runs: npm test
- Cline shows me the test output
- I confirm tests pass
```

### Step 5: Gate Review Preparation

```
You: Provide this to Cline:

Prepare for gate G6 review:
1. Run: npm run lint
2. Run: npm run test:coverage (show coverage report)
3. Run: npm run gate:check G6
4. Run: npm run trace:validate
5. Check all commits include [SPEC-ID] [ADR-ID]

Show me the gate review summary.
If any checks fail, fix them now.
```

### Step 6: Gate Approval

```
You: Provide this to Cline:

Show me the gate G6 review summary:
- [ ] Code conforms to CODING-STANDARDS.md
- [ ] All linting passes
- [ ] All tests pass
- [ ] Coverage >= 100% for business logic
- [ ] All traceability is complete
- [ ] No secrets in code

Is everything ready for human review?

[If YES, copy the summary for the PR and share with reviewer]
[If NO, what needs to be fixed?]
```

## Work Log Template

Keep `.cline/work-log.md` updated during each session:

```markdown
# Cline Work Log

## Session: [Date] - [Feature Name]

### Task
Implement @spec/SPEC-[CONTEXT]-001.md

### Commits Made
- [SPEC-[CONTEXT]-001] [ADR-N] Description

### Implementation
- Function 1: `src/feature.ts`
- Function 2: `src/validators.ts`
- Endpoint: `POST /api/resource`

### Tests Added
- TEST-[CONTEXT]-001-AC-A ✓
- TEST-[CONTEXT]-001-AC-B ✓

### Gate Status
- [ ] G2: Specification Review — PASSED
- [ ] G4: Application Integrity — Ready for review
- [ ] G6: Implementation Integrity — Ready for review
- [ ] G7: Release Integrity — Not yet

### Verification
- npm test: ✓ PASSED
- npm run lint: ✓ PASSED
- npm run gate:check G6: ✓ PASSED
- npm run trace:validate: ✓ PASSED

### Next Steps
Ready for human gate review (G6).
```

## Gate Status Template

Keep `.cline/gate-status.md` updated:

```markdown
# Gate Status

## Current Stage
G6: Implementation Integrity Review

## Last Verified Commit
[SPEC-CONTEXT-001] [ADR-N] Implementation complete

## Gate Checklist (G6)
- [x] Code conforms to CODING-STANDARDS.md
- [x] All linting passes (npm run lint)
- [x] All tests pass (npm run test)
- [x] Coverage >= 100% for business logic
- [x] Traceability complete (npm run trace:validate)
- [x] No secrets in code
- [x] Commit messages include [SPEC-ID] [ADR-ID]

## Verdict
PASS — Ready for human review

## Reviewer Assignment
[Name/team]

## Review Date
[Date]
```

## Common Cline Commands

### Ask Cline to Review Against Spec

```
"Read @spec/SPEC-[CONTEXT]-001.md and verify my implementation matches:
- Does my code implement all AC (AC-A, AC-B, ...)?
- Does my validation match the data contract?
- Does my API match the API contract?

Show me any mismatches or missing pieces."
```

### Ask Cline to Validate Security

```
"Security review: Check my implementation for:
1. Are all auth checks server-side? Show me where.
2. Are all validations server-side? Show me where.
3. Are any secrets in the code? (npm run check:secrets)
4. Is any PII stored unnecessarily?

Report any violations."
```

### Ask Cline to Prepare Release Notes

```
"Generate release notes for this feature:
- Feature name: [Feature name]
- Specification: @spec/SPEC-[CONTEXT]-001.md
- Tests: Show links to test files
- Migration: Show any database migrations
- Rollback: Show rollback instructions

Format as markdown suitable for release notes."
```

### Ask Cline to Write a Migration

```
"Write a database migration:
- Spec: @spec/SPEC-[CONTEXT]-001-DATA.md
- Create tables/fields per schema
- Add constraints and indexes
- Add rollback script
- Include traceability: SCHEMA-[CONTEXT]-001

File: migrations/YYYY-MM-DD-###-[description].sql"
```

## Best Practices

1. **Always reference files with @**
   - `@spec/SPEC-*.md` (specifications)
   - `@src/file.ts` (implementation)
   - `@tests/file.test.ts` (tests)

2. **Verify specification readiness first**
   - Before implementation, confirm spec is ACCEPTED
   - All AC are defined and testable
   - All contracts are complete

3. **Implement step-by-step**
   - Types first
   - Validation second
   - Endpoints/functions third
   - Tests fourth
   - Verify fifth

4. **Run gate checks before requesting review**
   - npm test (must pass)
   - npm run lint (must pass)
   - npm run gate:check G6 (must pass)
   - npm run trace:validate (must pass)

5. **Update work log after each major step**
   - What was implemented?
   - What tests were added?
   - What commits were made?
   - What's the next gate?

6. **Keep gate status current**
   - Record which gate you're in
   - Show gate checklist status
   - List blocker if any
   - Request review when ready

## Troubleshooting

### Cline Refuses the Task

**Likely cause:** Missing or incomplete specification

**Solution:**
```
"Why did you refuse this task?
Specification: @spec/SPEC-[CONTEXT]-001.md

Is the spec:
- Present?
- Status is ACCEPTED?
- All AC are defined?
- Data contract is complete?
- API contract is complete?

Which item is missing?"
```

### Tests Fail

**Solution:**
```
"Tests are failing. Show me:
1. The failing test and expected vs. actual
2. The specification that defines this behavior
3. My implementation that's not matching
4. What needs to change?

Let's fix this step-by-step."
```

### Gate Check Fails

**Solution:**
```
"Gate check failed. Show me:
1. Which check failed?
2. What was the output?
3. How do I fix it?

npm run gate:check G6 output:
[paste output]"
```

## Support

For issues with EPOS:
- Review `core/documentation/CODING-STANDARDS.md` for coding standards
- Review `core/traceability/TRACEABILITY.md` for traceability format
- Review `core/traceability/EXPLAINABILITY.md` for explainability requirements
- Escalate specification issues to specification author
- Escalate architecture issues to architecture review
