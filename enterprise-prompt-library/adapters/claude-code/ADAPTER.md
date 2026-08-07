---
id: EPOS-ADAPTER-CLAUDE-CODE-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Claude Code Adapter

## Purpose

Translate EPOS core rules into Claude Code's autonomous agent format, which
combines a persistent system prompt, long-context window (200K), agentic
iteration with file reading/writing, and browser automation. Claude Code
runs continuously until task completion or explicit halt.

## Scope

Projects and repositories using Claude Code (browser-based IDE agent) under
EPOS governance.

## Inputs

- `core/constitution/CONSTITUTION.md`
- `core/traceability/TRACEABILITY.md`
- `core/traceability/EXPLAINABILITY.md`
- Repository root structure and key files

## Outputs

- System prompt for Claude Code sessions
- Project context guide (placed in repo as `.claude-code/context.md`)
- Refusal rules and gate enforcement
- Integration with EPOS gate checklists

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/quality-gates/QUALITY-GATES.md`
- `core/traceability/TRACEABILITY.md`

## Rules

### Context Window Strategy

Claude Code has a 200K token context window that includes:
- The entire system prompt (1-2K)
- The file tree and open files (up to 50K)
- Conversation history (remaining tokens)

**Strategy:**
- System prompt is the enforcement layer (hard rules)
- Open only the specification, contract, and implementation file (not the entire codebase)
- Reference external docs via links and summaries, not copies
- Use tool calls (file read, grep) to search without loading full files

### Prompt Style

Claude Code accepts markdown and structured text. Use:
- **Bold** for emphasis and rule names
- Code fences for specifications and examples
- Bullet lists for checklist and alternatives
- Explicit "REFUSAL:" sections for blocked patterns

### Iteration Strategy

Claude Code iterates autonomously by:
1. Reading specification and contracts
2. Proposing implementation
3. Running tests
4. Revising based on test feedback
5. Checking against gate criteria
6. Requesting human approval for gate progression

**Our strategy:** Provide clear gate criteria and refusal rules; let Claude Code
iterate until gate passage conditions are met.

### Memory Strategy

Claude Code maintains conversation history within a session but loses context
between sessions. **Strategy:**
- Place gate verdicts and approval status in `.claude-code/gate-status.md`
- System prompt includes core rules (not session-dependent)
- End each session with a summary of what was completed and what gate it passed

### File Strategy

Claude Code can read and write files. **Strategy:**
- Keep specifications and contracts in `specs/` directory
- Implementation in `src/`
- Tests in `tests/`
- Gate verdicts in `.claude-code/gate-verdicts/`
- Do not store secrets or private keys in `.claude-code/` (use env vars)

### Validation Strategy

Claude Code can run tests, linters, and formatters. **Strategy:**
- Provide clear test commands in package.json scripts
- Linting/formatting is automated (ESLint, Prettier)
- Gate checklist includes specific commands to validate compliance
- Gate pass/fail is determined by script exit codes and human review

### Review Strategy

Human review happens at gates (G2, G4, G6, G7). **Strategy:**
- Claude Code generates artefacts ready for gate review
- Gate reviewer checks against gate checklist (automation + manual)
- Conditional pass or fail is recorded in `.claude-code/gate-verdicts/`
- Claude Code reads gate verdict and continues accordingly
