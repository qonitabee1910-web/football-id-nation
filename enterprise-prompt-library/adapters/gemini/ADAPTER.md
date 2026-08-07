---
id: EPOS-ADAPTER-GEMINI-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Google Gemini CLI Adapter

## Purpose

Translate EPOS core rules into Google Gemini CLI format, which operates as a
conversational interface with file system access, but limited project-wide
memory and no persistent session state.

## Scope

Projects and repositories using Gemini CLI (command-line and terminal
integration) under EPOS governance.

## Context Window Strategy

Gemini CLI has limited context per message but can access files. Strategy:
- Provide specification as inline reference or file path
- Use `@file` syntax to include contracts and schemas directly
- Request explicit confirmations before major changes
- Summarize progress between commands

## Prompt Style

Gemini CLI accepts:
- Natural language commands in terminal style
- File references with `@` syntax
- Markdown code blocks
- Structured JSON for specifications

## Iteration Strategy

Gemini CLI supports iterative refinement. **Strategy:**
- Start with specification: `@spec/SPEC-CONTEXT-001.md`
- Request step-by-step implementation
- Ask Gemini to verify each step against acceptance criteria
- Request final gate checklist before completion

## Memory Strategy

No persistent memory across sessions. **Strategy:**
- Keep session notes in `.gemini/session-log.md`
- Include specification reference in every command
- Copy relevant gate checklist into each prompt

## File Strategy

Reads and writes files directly. **Strategy:**
- Use `@src/` to reference files
- Use `@spec/` to reference specifications
- Create `.gemini/` directory for session tracking
- All changes are immediate (no preview mode)

## Validation Strategy

Gemini CLI can run commands and scripts. **Strategy:**
- Ask Gemini to run `npm test` after each change
- Request `npm run lint` to check conformance
- Ask for `npm run gate:check` before final approval

---

## CLI Command Template

Use this pattern for Gemini CLI commands:

```bash
gemini "
Task: Implement [feature from @spec/SPEC-CONTEXT-001.md AC-X]

Specification reference: @spec/SPEC-CONTEXT-001.md
Data contract: @spec/SPEC-CONTEXT-001-DATA.md
API contract: @spec/SPEC-CONTEXT-001-API.md

Rules:
- Implement only what the spec requires
- Validate server-side per SPEC-[CONTEXT]-001-DATA
- Include error codes that reference the spec
- Include traceability: SPEC-[CONTEXT]-001

Step 1: Read the specification and acceptance criteria
Step 2: Show me the implementation plan (3-4 bullets)
Step 3: Implement the function/endpoint
Step 4: Write tests for each AC
Step 5: Run npm test to verify
Step 6: Review against gate G6 checklist
"
```
