---
id: EPOS-QUICK-REFERENCE-001
version: 1.0.0
status: ACTIVE
audience: All Users
---

# EPOS Quick Reference Guide

## What Is EPOS?

**Enterprise Prompt Operating System** is a governance system that ensures all AI coding assistants produce consistent, traceable, explainable implementations aligned to business requirements and enterprise architecture.

---

## The 5-Minute Intro

### 1. Core Rules (Read First)
```
enterprise-prompt-library/core/
├── constitution/CONSTITUTION.md          ← The 14 Articles (law)
├── constitution/PRINCIPLES.md            ← 11 Principles (how to apply law)
├── quality-gates/QUALITY-GATES.md        ← G0–G7 gates (enforcement points)
└── traceability/TRACEABILITY.md          ← How to link requirement → code → test
```

**Minimum read:** Constitution (5 min) + Principles (5 min) = 10 minutes

### 2. Your AI Tool's Adapter
```
Find your tool:
- GitHub Copilot → adapters/copilot/
- Cursor → adapters/cursor/
- Lovable → adapters/lovable/
- Claude Code → adapters/claude-code/
- ...etc

Read: ADAPTER.md (understand how your tool works under EPOS)
      BOOTSTRAP.md (literal setup instructions)
```

### 3. Templates for Your Task
```
If building an API → templates/api/TEMPLATE.md
If building a domain → templates/domain/TEMPLATE.md
If designing architecture → templates/architecture/TEMPLATE.md
...etc
```

### 4. Quality Gate for Your Stage
```
Stage 0-2 (Business & Specification) → core/quality-gates/QUALITY-GATES.md
  ↓
Stage 3-4 (Data & Application) → Same file, different gate criteria
  ↓
Stage 5-6 (UX & Implementation) → Same file, different gate criteria
  ↓
Stage 7 (Release) → Same file, final gate criteria
```

---

## The Workflow

### For Any Feature

```
1. HAVE A SPECIFICATION
   ✓ Spec exists (SPEC-CONTEXT-001.md)
   ✓ Status is ACCEPTED (not DRAFT)
   ✓ All AC are defined
   → If missing: STOP → Escalate to gate G2 (Specification Review)

2. USE YOUR AI TOOL
   ✓ Open your AI tool (Copilot, Cursor, etc.)
   ✓ Reference the specification: "Implement SPEC-X-001"
   ✓ AI assistant implements per the spec
   ✓ AI adds tests for each AC (AC-A, AC-B, ...)
   ✓ Commit message includes [SPEC-ID] [ADR-ID]

3. PASS CODE REVIEW
   ✓ npm test (all tests pass)
   ✓ npm run lint (no lint errors)
   ✓ npm run gate:check G6 (checklist passes)
   → Review passes → Merge

4. DEPLOY
   ✓ Run migrations (with traceability ID)
   ✓ Deploy to staging
   ✓ Verify health checks
   ✓ Deploy to production
   → Release passed → Done
```

---

## The Three Absolute Rules

### 1. Specification-Driven
**No code before spec.** Every feature has a SPEC-CONTEXT-001.md. If it doesn't exist, AI assistants refuse and escalate to gate G2.

### 2. Server-Side Authority
**Authorization and validation happen server-side, never client-side.** Client-side checks are presentation only. This is Article 8. Non-negotiable.

### 3. Traceability
**Every change links to a requirement.** Commit message includes [SPEC-ID]. Code comments reference the spec. Tests reference the AC they verify. This enables audit and root-cause analysis.

---

## Gate Checklist Quick Reference

### G0: Business Integrity
- [ ] Problem statement is specific
- [ ] Target beneficiaries are named
- [ ] Success metrics are quantified
- [ ] Sponsor assigned
- [ ] Article 0 impact assessment (if minors involved)

### G1: Architecture Integrity
- [ ] All architectural changes have ADRs
- [ ] ADRs are approved
- [ ] Alternatives were considered

### G2: Specification Integrity
- [ ] Spec exists and status is ACCEPTED
- [ ] All AC are testable
- [ ] Data contract is complete
- [ ] API contract is OpenAPI-compliant

### G3: Data Integrity
- [ ] Schema matches data contract
- [ ] Constraints are explicit (NOT NULL, UNIQUE, FOREIGN KEY, CHECK)
- [ ] Audit fields present (created_at, updated_at, etc.)

### G4: Application Integrity
- [ ] API implementation matches OpenAPI spec
- [ ] Data structures match schema
- [ ] Validation is server-side
- [ ] Authorization is server-side
- [ ] Error codes reference spec
- [ ] No secrets in code

### G5: UX Integrity (if UI changes)
- [ ] Screens match screen catalogue
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Labels reference spec

### G6: Implementation Integrity
- [ ] Code conforms to CODING-STANDARDS.md
- [ ] Linting passes (npm run lint)
- [ ] Tests pass (npm run test)
- [ ] Coverage >= 100% for business logic
- [ ] Traceability complete (npm run trace:validate)
- [ ] Commit messages include [SPEC-ID]
- [ ] No incidental refactors or formatting changes

### G7: Release Integrity
- [ ] Migrations have traceability IDs
- [ ] Rollback plan documented and tested
- [ ] Release notes link to specs and commits
- [ ] No known security issues
- [ ] Health checks defined and passing

---

## Common Tasks

### "I Want to Build a Feature"

```bash
1. Read the specification
   cat spec/SPEC-CONTEXT-001.md

2. Open your AI tool (Copilot, Cursor, Claude Code, etc.)

3. Ask it: "Implement SPEC-CONTEXT-001"

4. AI will:
   - Read the spec
   - Implement the functions/endpoints
   - Write tests
   - Run tests
   - Report when gate G6 is ready

5. You review and approve → Merge

6. Deploy following gate G7 checklist
```

### "Code Review Feedback Is Slow"

```bash
Use the gate G6 checklist:
1. npm test (must pass)
2. npm run lint (must pass)
3. npm run gate:check G6 (must pass)
4. npm run trace:validate (must pass)
5. Check: [SPEC-ID] in commit message? (yes/no)

Binary checklist → Binary verdict → Fast

No: "Does this look right?" (subjective)
Yes: "Does this pass the checklist?" (objective)
```

### "I Don't Know What to Build"

```bash
1. Read SPEC-CONTEXT-001
2. If it doesn't exist: This is a gap. Escalate to gate G2.
3. If it's DRAFT: Not approved yet. Request approval.
4. If it's ACCEPTED: Build it.

Specification-driven means:
- SPEC defines exactly what to build
- You implement to the spec, not guess
- No "build something cool"
- Yes "implement this AC"
```

### "How Do I Know If This Is Secure?"

```bash
Check gate G4 (Application Integrity) and G6 (Implementation):

Security checklist:
- [ ] All authorization server-side? (check server code)
- [ ] All validation server-side? (check server code)
- [ ] No secrets in code? (npm run check:secrets)
- [ ] Is PII minimized? (check data contract)
- [ ] Does error handling leak information? (review error messages)

Gate reviews will catch this. Submit and let reviewers verify.
```

### "How Do I Ensure Traceability?"

```bash
3 steps:

1. Commit message header:
   [SPEC-CONTEXT-001] [ADR-N] Description

2. Code comment:
   // SPEC-CONTEXT-001-AC-A: Description
   function implementFeature() { ... }

3. Test naming:
   test("SPEC-CONTEXT-001-AC-A: verify behavior", () => { ... })

Run: npm run trace:validate
Should show: "All artefacts traced from SPEC → CODE → TEST"
```

---

## Common Refusals (And What They Mean)

### "I cannot write code without an approved specification"
**Translation:** SPEC-CONTEXT-001 is missing or DRAFT.
**Action:** Write the spec and get it approved at gate G2.

### "Authorization must be server-side, not client-side"
**Translation:** You're checking permissions in the browser.
**Action:** Move the auth check to the backend server.

### "This violates Article 0 (human safety)"
**Translation:** The change could harm vulnerable people (usually minors).
**Action:** Escalate to security/privacy team for review.

### "Which rule requires this change?"
**Translation:** The change doesn't trace back to a spec or ADR.
**Action:** Link it to SPEC-CONTEXT-001 or create an ADR if architectural.

---

## File Structure You'll Use

```
your-repository/
├── spec/
│   └── SPEC-CONTEXT-001.md              ← Your specification
├── docs/
│   ├── adr/
│   │   └── ADR-0001-[name].md           ← Architectural decisions
│   └── glossary/
│       └── GLOSSARY.md                  ← Domain vocabulary
├── src/
│   ├── functions.ts                     ← Implementation
│   ├── validators.ts                    ← Validation logic
│   └── ...
├── tests/
│   └── features.test.ts                 ← Test suite
├── migrations/
│   └── 2024-08-07-001-create-table.sql  ← DB changes
└── .github/
    └── copilot-instructions.md          ← AI tool rules (if using Copilot)
```

---

## Links to Core Documents

| Document | Purpose | Read When |
| --- | --- | --- |
| [Constitution](enterprise-prompt-library/core/constitution/CONSTITUTION.md) | The 14 Articles | First onboarding |
| [Principles](enterprise-prompt-library/core/constitution/PRINCIPLES.md) | 11 Engineering Principles | After Constitution |
| [Quality Gates](enterprise-prompt-library/core/quality-gates/QUALITY-GATES.md) | G0–G7 checklists | Before each gate |
| [Traceability](enterprise-prompt-library/core/traceability/TRACEABILITY.md) | How to link requirement → code | When writing specs or code |
| [Explainability](enterprise-prompt-library/core/traceability/EXPLAINABILITY.md) | Decision recording format | When reviewing code |
| [Coding Standards](enterprise-prompt-library/core/documentation/CODING-STANDARDS.md) | Code quality requirements | Before code review |
| [Documentation Standards](enterprise-prompt-library/core/documentation/DOCUMENTATION-STANDARDS.md) | Spec and doc format | When writing specs |
| [Your AI Tool Adapter](enterprise-prompt-library/adapters/) | How your tool works with EPOS | After onboarding |

---

## Key Contacts

| Role | Responsibility | Contact |
| --- | --- | --- |
| **Governance Council** | Approves changes to core rules | [To be assigned] |
| **Specification Author** | Writes and approves specs | Product team |
| **Architecture Lead** | Reviews and approves ADRs | Architecture team |
| **Security Reviewer** | Reviews security concerns | Security team |
| **Gate Reviewer** | Reviews and approves gates | Engineering leads |

---

## Success Indicators

✅ You're using EPOS successfully if:
- Specs are written before code (100% of features)
- Commits include [SPEC-ID] in the message (100%)
- Code review uses the gate checklist (binary verdict, no "looks good")
- All acceptance criteria are tested (100%)
- Gate reviews pass on first attempt (80%+)
- Post-release bugs decrease (30%+ improvement)

❌ You're struggling if:
- Specs are written after code
- Commits lack traceability IDs
- Code review is slow and subjective
- Test coverage is incomplete
- Gate reviews bounce back frequently
- Post-release bugs are high

---

## Next Steps

1. **Read the Constitution** (5 min) — Understand the 14 Articles
2. **Read Your AI Tool's Adapter** (10 min) — Understand how your tool works
3. **Read the Quality Gates** (10 min) — Understand what gates you'll pass through
4. **Start Your First Feature** — Follow the workflow above

---

**EPOS is designed to be simple: Specification → Implementation → Test → Gate → Release.**

**Questions? Escalate to the Governance Council.**
