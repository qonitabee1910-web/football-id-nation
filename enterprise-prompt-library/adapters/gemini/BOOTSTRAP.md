---
id: EPOS-ADAPTER-GEMINI-BOOTSTRAP-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-ADAPTER-GEMINI-001]
---

# Google Gemini CLI Bootstrap

## Installation & Setup

```bash
# Install Google Cloud CLI with Gemini
gcloud init
gcloud auth application-default login

# Verify Gemini CLI is available
gemini --version

# Navigate to your repository
cd your-repository

# Create .gemini directory for session tracking
mkdir -p .gemini
touch .gemini/session-log.md
```

## Gemini CLI System Instructions

Create `.gemini/system-instructions.txt` with:

```
You are an AI development agent governed by the Enterprise Prompt Operating
System (EPOS v1.0.0).

ABSOLUTE RULES:
1. Specification-First: Never implement without an approved spec (SPEC-*.md)
2. Server-Side Authority: All authorization and validation happens on the server
3. Traceability: Every change links to a specification (SPEC-ID in commit)
4. Explainability: Every change explains WHAT, WHY, RULE, SOURCE, REJECTED

REFUSALS:
- No spec exists? → Escalate to gate G2 (Specification Review)
- No ADR for architecture? → Escalate to gate G1 (Architecture Review)
- Client-side security only? → SECURITY VIOLATION. Refuse.

VERIFICATION:
Before declaring done:
1. npm test (all tests pass)
2. npm run lint (no linting errors)
3. npm run gate:check G6 (gate checklist passes)
4. npm run trace:validate (all changes traced)
```

## Workflow Templates

### Template 1: Implement Specification

```bash
gemini "
Task: Implement specification feature

Specification: @spec/SPEC-[CONTEXT]-001.md
Acceptance criteria: AC-A, AC-B, AC-C

My plan:
1. Read specification and contracts
2. Design implementation approach
3. Write tests for each AC
4. Implement functions/endpoints
5. Run tests and verify
6. Check gate G6 criteria

Please guide me through these steps. For each step:
- Show me what to do
- Have me show you the code
- Verify against the spec

Let's start with step 1: reading the specification and understanding requirements.
"
```

### Template 2: Fix Security Issue

```bash
gemini "
Security review finding: [Issue description from review]

Specification: @spec/SPEC-[CONTEXT]-001.md
Rule violated: [EPOS rule, e.g., Article 8: Server-Side Authority]

Current implementation: @src/[file].js

What needs to change:
- [Describe the fix needed]

Steps:
1. Show me the security fix
2. Write test to verify the fix
3. Run tests
4. Verify no regression

Start with step 1: Show me how to fix [issue].
"
```

### Template 3: Code Review Follow-up

```bash
gemini "
Gate G6 Code Review feedback:

Finding: [Code review comment]
Specification: @spec/SPEC-[CONTEXT]-001.md
Current code: @src/[file].js

Remediation:
1. Show me the corrected code
2. Explain why this fix is correct per spec
3. Show test coverage for this change
4. Verify the fix passes gate criteria

Start: Show me the corrected implementation.
"
```

## Common Gemini CLI Commands

### Check Current Status

```bash
gemini "
What's the current status of this implementation?

Files to check:
- @src/[feature-name].js (implementation)
- @tests/[feature-name].test.js (tests)
- @spec/SPEC-[CONTEXT]-001.md (specification)

Tell me:
1. Is implementation complete?
2. Do tests pass? (I'll run npm test)
3. Are all AC covered?
4. What's blocking completion?
"
```

### Run Gate Checklist

```bash
gemini "
We're ready for gate G6 review. Let's verify:

Checklist to check:
- Code conforms to CODING-STANDARDS.md
- All linting passes (npm run lint)
- All tests pass (npm run test)
- Code coverage >= 100% for business logic (npm run test:coverage)
- Traceability is complete (npm run trace:validate)
- Commit message includes [SPEC-ID]
- No secrets in code (npm run check:secrets)

Please verify each item. If all pass, generate the gate review summary.
"
```

## Session Log Template

Keep `.gemini/session-log.md` updated:

```markdown
# Gemini CLI Session Log

## Session: [Date] - [Feature Name]

### Specification
SPEC-[CONTEXT]-001-AC-[X]: [Description]

### Commits Made
1. [SPEC-X-001] [ADR-N] Description of change
2. [SPEC-X-001] Additional change

### Tests Added
- TEST-[CONTEXT]-001-AC-A ✓
- TEST-[CONTEXT]-001-AC-B ✓

### Gate Status
G6 Code Review: Ready for human review

### Notes
- [Any blockers or questions]
- [Alternative approaches considered]

### Next Steps
[What remains]
```

## Troubleshooting

### Gemini Refuses to Implement

**Likely cause:** Missing specification or unclear spec

**Solution:**
```bash
gemini "
Why did you refuse this task?
Specification file: @spec/SPEC-[CONTEXT]-001.md

Is the specification:
- Present? (file exists)
- Approved? (status: ACCEPTED)
- Complete? (all AC defined)
- Testable? (acceptance criteria are specific)

If any of these is no, let me know which and we'll escalate to gate G2.
"
```

### Tests Fail After Implementation

**Solution:**
```bash
gemini "
Tests are failing:
Failed test: [test name]
Expected: [expected behavior]
Actual: [actual behavior]

Specification reference: @spec/SPEC-[CONTEXT]-001.md
Test file: @tests/[feature].test.js

Is my implementation correct per the specification?
What needs to change to make the test pass?
"
```

## Best Practices

1. **Always reference files with @**
   - `@spec/SPEC-CONTEXT-001.md` (specification)
   - `@src/file.js` (implementation)
   - `@tests/file.test.js` (tests)

2. **Include gate checklist in prompts**
   - Copy relevant gate criteria into the prompt
   - Ask Gemini to verify each criteria
   - Request gate review summary when all pass

3. **Update session log after each command**
   - Record what was implemented
   - List commits made (with traceability IDs)
   - Note tests added

4. **Run verification commands explicitly**
   - Ask Gemini to run: `npm test`, `npm run lint`, `npm run gate:check G6`
   - Copy output into the conversation if it fails
   - Ask Gemini to fix issues step-by-step

5. **Escalate when blocked**
   - Missing spec? → Gate G2
   - Missing ADR? → Gate G1
   - Security issue? → Security review
   - Unclear requirement? → Ask product owner
