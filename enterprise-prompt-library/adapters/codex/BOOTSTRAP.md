---
id: EPOS-ADAPTER-CODEX-BOOTSTRAP-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-ADAPTER-CODEX-001]
---

# Codex Bootstrap

## Purpose

Provide reusable prompt templates for Codex API requests that enforce EPOS rules.

## Usage

1. Install OpenAI SDK: `npm install openai`
2. Use the template functions below in your workflow
3. All Codex completions must pass gate review before merge

## Codex Prompt Template Library

### Template 1: Function Implementation

```javascript
async function generateCodeCompletion(spec, functionSignature) {
  const prompt = `
# Task: Implement function per specification

## Specification
${spec.id}: ${spec.description}

## Constraints
- Validate all inputs per spec contract
- Enforce authorization server-side
- Throw errors with spec-referenced codes
- No client-side security checks

## Function signature
\`\`\`
${functionSignature}
\`\`\`

## Type definitions
\`\`\`
${spec.types}
\`\`\`

## Example: Correct implementation
\`\`\`
${spec.goodExample}
\`\`\`

## Implementation
\`\`\`
`;

  const completion = await openai.createCompletion({
    engine: "code-davinci-002",
    prompt: prompt,
    max_tokens: 500,
    temperature: 0.2, // Low randomness for consistency
    stop: ["\`\`\`"], // Stop at code fence
  });

  return completion.choices[0].text;
}
```

### Template 2: API Endpoint Implementation

```javascript
async function generateApiEndpoint(spec) {
  const prompt = `
# Task: Implement API endpoint per specification

## Specification
${spec.id}: ${spec.description}

## API Contract (OpenAPI)
${spec.openapi}

## Validation Rules
- ${spec.validationRules.join("\n- ")}

## Authorization
Server-side only. Check: ${spec.authorizationRule}

## Error Responses
${spec.errorExamples}

## Implementation: ${spec.method} ${spec.path}
`;

  const completion = await openai.createCompletion({
    engine: "code-davinci-002",
    prompt: prompt,
    max_tokens: 1000,
    temperature: 0.2,
    stop: ["// END ENDPOINT"],
  });

  return completion.choices[0].text;
}
```

### Template 3: Validation Function

```javascript
async function generateValidationFunction(spec) {
  const prompt = `
# Task: Generate validation function per specification

## Specification
${spec.id}: ${spec.description}

## Data Contract
${spec.dataContract}

## Validation Rules
${spec.validationRules}

## Example: Valid input
${spec.validExample}

## Example: Invalid input (should throw)
${spec.invalidExample}

## Function: validate${spec.entityName}
function validate${spec.entityName}(input) {
  // TODO: Implement validation per spec
`;

  const completion = await openai.createCompletion({
    engine: "code-davinci-002",
    prompt: prompt,
    max_tokens: 500,
    temperature: 0.1, // Very low randomness for validation
    stop: ["\n}"],
  });

  return completion.choices[0].text + "\n}";
}
```

## Prompt Template: General Rule Enforcement

```markdown
# EPOS Rule Enforcement for Codex

Always include this in Codex prompts:

## Hard Constraints
1. Authorization must be server-side. Never implement permission checks in
   client-side code or frontend requests.
2. All validation rules come from the specification (SPEC-[CONTEXT]-001-DATA).
   Do not invent validation rules.
3. All errors must include error codes (e.g., INVALID_PLAYER_AGE) that link
   to the specification.
4. Do not add fields, parameters, or endpoints beyond what the specification
   requires.
5. All secrets (API keys, passwords, connection strings) must be in environment
   variables, not hardcoded.

## Traceability
Include a comment referencing the specification:
```
// SPEC-[CONTEXT]-001-AC-[X]: [Description]
```

## After Generation
- [ ] Run linter: `npm lint`
- [ ] Run tests: `npm test` (should pass)
- [ ] Check code coverage: `npm run test:coverage` (should be 100% for business logic)
- [ ] Verify no secrets: `npm run check:secrets`
- [ ] Request human review before merge
```

## Refusal Rules

Codex should be prompted to refuse:

1. **Implementing without a spec**
   - Prompt: "SPECIFICATION REQUIRED: Before completing this function, reference
     the SPEC-[CONTEXT]-001 specification. If none exists, I cannot proceed."

2. **Security checks client-side only**
   - Prompt: "SECURITY VIOLATION: Authorization must be server-side. This
     implementation enforces business rules on the server, not the client."

3. **Adding features beyond specification**
   - Prompt: "OUT OF SCOPE: The specification (SPEC-[CONTEXT]-001) does not
     request this field/parameter/endpoint. Adding it would violate
     Specification-Driven Development (Article 1). Implement only what the spec
     requires."

## Gate Review Checklist

Every Codex completion must be reviewed before merge:

- [ ] Authorization is server-side only
- [ ] Validation rules match spec contract
- [ ] Error codes reference specification
- [ ] No secrets in code
- [ ] All tests pass
- [ ] Code coverage ≥ 80% (business logic 100%)
- [ ] No incidental refactors or formatting changes
