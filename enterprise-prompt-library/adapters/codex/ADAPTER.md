---
id: EPOS-ADAPTER-CODEX-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Codex Adapter

## Purpose

Translate EPOS core rules into OpenAI Codex format, which operates as a
completion engine with limited context window, no persistent memory across
requests, and no built-in revision capability.

## Scope

Projects and repositories using Codex (API or plugin) under EPOS governance
for code completion and generation tasks.

## Context Window Strategy

Codex has a 4K context window with no session memory. Strategy:
- Embed rules in the prompt for every request (no reliance on prior context)
- Use concise examples (2–3 lines per example, not full files)
- Include specification summary inline (not as separate document)
- Focus on completion, not full implementation

## Prompt Style

Codex responds to:
- Natural language instructions followed by code skeleton
- Docstrings and comments as hints
- Code examples showing the pattern expected

## Iteration Strategy

Codex completes once; no revision loop. **Strategy:**
- Provide complete specification in the prompt
- Show both good and bad examples
- Request explicit completions for validation rules, error handling, and security

## Memory Strategy

No memory across requests. **Strategy:**
- Every request must be self-contained
- Include spec summary and key rules in every prompt
- Use contract and schema references that are stable across time

## File Strategy

Works with individual files or code snippets, not entire repositories.
**Strategy:**
- Provide function signature and docstring
- Include relevant type definitions inline
- Reference external contracts as comments

## Validation Strategy

Codex output requires human review before use. **Strategy:**
- All Codex completions are code suggestions, not production code
- Security and authorization must be verified by human
- Generated code must pass linting and tests before merge

---

## `.codex-prompt-template.md`

Use this template for Codex prompts:

```markdown
# Task: Implement [capability from SPEC]

## Specification
SPEC-[CONTEXT]-001-AC-[X]: [One-sentence acceptance criterion]

Contract: [Schema or API definition]

## Rules
- Authorization: [Where is it enforced?]
- Validation: [Which constraints apply?]
- Error handling: [What errors can occur?]

## Example: Good Implementation
[2–3 line example showing correct pattern]

## Example: What NOT to Do
[Common mistake and why it's wrong]

## Now implement:
[Code skeleton with docstring]
// TODO: Implement this function

---

**Check the implementation:**
- Authorization is server-side (not client-side)
- All validation rules from spec are enforced
- All errors include error codes
- No secrets in code
```
