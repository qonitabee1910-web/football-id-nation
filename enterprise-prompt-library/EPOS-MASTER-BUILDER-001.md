---
id: EPOS-MASTER-BUILDER-001
version: 1.0.0
status: ACTIVE
authority: DERIVED
depends_on: [EPOS-CORE-CON-001]
---

# EPOS Master Builder Guide

## Mission

Complete the Enterprise Prompt Operating System (EPOS) v1.0.0 as a comprehensive,
production-ready AI governance system serving as the Single Source of Truth for
14 AI coding assistants.

## Current Status

✅ **COMPLETE: Core Rules Layer (100%)**
- ✅ Constitution (EPOS-CORE-CON-001)
- ✅ Principles (EPOS-CORE-CON-002)
- ✅ Specification-Driven Development
- ✅ Workflow & Approval Gates
- ✅ Quality Gates G0-G7
- ✅ Architecture Rules
- ✅ Decision Rules
- ✅ AI Behaviour
- ✅ Privacy & Security Principles
- ✅ Child Protection Policy
- ✅ Traceability Framework (EPOS-CORE-TRC-001) ← NEW
- ✅ Explainability Framework (EPOS-CORE-EXP-001) ← NEW
- ✅ Coding Standards (EPOS-CORE-DOC-001) ← NEW
- ✅ Documentation Standards (EPOS-CORE-DOC-002) ← NEW
- ✅ Glossary & Ubiquitous Language (EPOS-CORE-GLOSS-001) ← NEW

🟡 **IN PROGRESS: Platform Adapters (75%)**
- ✅ Lovable
- ✅ Cursor
- ✅ GitHub Copilot
- ✅ Continue
- ✅ Roo Code
- ✅ v0
- ✅ Windsurf
- ✅ Aider
- ✅ Bolt
- ❌ Claude Code (MISSING)
- ❌ Codex (MISSING)
- ❌ Gemini CLI (MISSING)
- ❌ Cline (MISSING)

🟡 **PARTIAL: Task Templates (40%)**
- ✅ Architecture
- ✅ API
- ✅ Data
- ✅ Domain
- ❌ UI/Components (MISSING)
- ❌ Security (MISSING)
- ❌ Testing (MISSING)
- ❌ DevOps/Infrastructure (MISSING)
- ❌ Analytics (MISSING)
- ❌ Documentation (MISSING)
- ❌ Governance (MISSING)

🟢 **COMPLETE: Validation Prompts (100%)**
- ✅ Architecture Review
- ✅ Security Review
- ✅ Privacy Review
- ✅ Accessibility Review
- ✅ Performance Review
- ✅ API Review
- ✅ UI Review
- ✅ Domain Review
- ✅ AI Governance Review

🟡 **PARTIAL: Release Prompts (50%)**
- ✅ code-review/ (exists)
- ✅ release-readiness/ (exists)
- ✅ deployment/ (exists)
- ✅ migration/ (exists)
- ✅ changelog/ (exists)
- ✅ release-note/ (exists)
- ✅ rollback/ (exists)
- ❌ post-release-review/ (MISSING)
- ❌ production-readiness/ (MISSING)

❌ **NOT STARTED: Comprehensive Assets**
- [ ] Reusable checklist fragments
- [ ] Decision matrices
- [ ] Naming convention tables
- [ ] Code snippet repositories
- [ ] Example end-to-end workflows

❌ **NOT STARTED: Examples & Adoption Guide**
- [ ] Worked end-to-end example (Vision → Release)
- [ ] Per-adapter quick-start guides
- [ ] Integration guide for existing repos
- [ ] Migration guide from old processes

## Phase 2: Complete Missing Adapters

### 4 Missing Adapters (Claude Code, Codex, Gemini CLI, Cline)

Each adapter needs:
1. ADAPTER.md (2-3 KB)
   - Purpose, Scope, Context Window Strategy
   - Prompt Style, Iteration Strategy, Memory Strategy
   - File Strategy, Validation Strategy, Review Strategy

2. BOOTSTRAP.md (1-2 KB)
   - Literal instructions to embed in project config

**Template for new adapter:**

```markdown
---
id: EPOS-ADAPTER-<NAME>-001
version: 1.0.0
status: DRAFT
depends_on: [EPOS-CORE-CON-001]
---

# <Name> Adapter

## Purpose
[How this AI works uniquely; what surfaces it provides]

## Context Window Strategy
[How much context does this AI retain? Is context session-scoped?]

## Prompt Style
[Format preferences: fenced code, markdown, XML tags, etc.]

## Iteration Strategy
[How does this AI typically revise? Does it ask questions or iterate autonomously?]

## Memory Strategy
[How does it recall rules across turns? Is system message reliable?]

## File Strategy
[Does this AI see all files? Partial files? How should we structure files for this AI?]

## Validation Strategy
[Can this AI validate its own output? What must the human validate?]

## Review Strategy
[How should reviewers validate this AI's output?]
```

## Phase 3: Complete Missing Task Templates

### 7 Missing Templates (UI, Security, Testing, DevOps, Analytics, Documentation, Governance)

Each template needs:
1. Template file (5-8 KB)
   - Purpose and structure for the task type
   - Checklist for completeness
   - Example output

**High-priority templates:**
1. **UI Template** — Component specification, design system, screen catalogue
2. **Testing Template** — Test strategy, test case specification, coverage goals
3. **Security Template** — Threat model, security controls, pen test plan
4. **DevOps Template** — Infrastructure-as-code, deployment strategy, monitoring

## Phase 4: Create Comprehensive Assets

### Reusable Checklist Fragments

Create `assets/checklists/` with:
- `G0-business-integrity.yml`
- `G1-architecture-integrity.yml`
- `G2-domain-integrity.yml`
- `G3-data-integrity.yml`
- `G4-application-integrity.yml`
- `G5-ux-integrity.yml`
- `G6-implementation-integrity.yml`
- `G7-release-integrity.yml`

### Decision Matrices

Create `assets/decision-matrices/` with:
- When to use synchronous vs. event-driven
- When to use microservices vs. monolith
- When to cache vs. compute
- When to optimize for throughput vs. latency

### Naming Convention Tables

Create `assets/naming-conventions/` with:
- API endpoint naming patterns
- Database naming conventions
- Variable naming conventions
- Event naming patterns
- Exception naming patterns

## Phase 5: Create Examples & Adoption Guide

### Example 1: End-to-End Player Onboarding (Vision → Release)

**Files needed:**
- `examples/player-onboarding/PRG-VIS-001-vision.md`
- `examples/player-onboarding/PRG-STK-001-stakeholders.md`
- `examples/player-onboarding/SPEC-PLAYER-001-specification.md`
- `examples/player-onboarding/ADR-0001-event-driven-emails.md`
- `examples/player-onboarding/db-schema.sql`
- `examples/player-onboarding/api-openapi.yaml`
- `examples/player-onboarding/implementation.ts`
- `examples/player-onboarding/tests.ts`
- `examples/player-onboarding/pr-review-comments.md`
- `examples/player-onboarding/release-notes.md`

### Example 2: Per-Adapter Adoption

For each adapter (Copilot, Cursor, Lovable, etc.):
- `adapters/<tool>/QUICK-START.md`
- `adapters/<tool>/FAQ.md`
- `adapters/<tool>/TROUBLESHOOTING.md`

### Integration Guide

- `docs/adoption/GETTING-STARTED.md`
- `docs/adoption/MIGRATE-FROM-OLD-PROCESS.md`
- `docs/adoption/GOVERNANCE-KICKOFF.md`

## Rapid Build Strategy

### Week 1: Complete Core → Ready for pilot
- Core rules: ✅ DONE
- 4 missing adapters: 4 × 1 day = 4 days
- Create example Player Onboarding: 1 day
- **PILOT-READY by end of week**

### Week 2: Complete task templates → Ready for adoption
- 7 missing templates: 7 × 0.5 day = 3-4 days
- 2 post-release prompts: 2 × 0.5 day = 1 day
- Comprehensive assets (checklists, matrices): 1-2 days
- **ADOPTION-READY**

### Week 3: Examples & docs → Production-ready
- Adoption guide & per-adapter quick starts: 2 days
- Create 2-3 additional examples: 2 days
- Final review, versioning, release notes: 1 day
- **v1.0.0 RELEASED**

## Completion Checklist

### Core Rules ✅
- [ ] All 15 core documents exist and are ACCEPTED
- [ ] All documents follow standard format (YAML frontmatter, sections, examples)
- [ ] All cross-references and dependencies are correct
- [ ] Quality gates reference all core rules
- [ ] Principles are testable and enforceable

### Platform Adapters
- [ ] All 14 adapters have ADAPTER.md
- [ ] All 14 adapters have BOOTSTRAP.md
- [ ] Each BOOTSTRAP is the literal config to install
- [ ] No adapter introduces new rules (only translates core)
- [ ] Each adapter tested with sample code

### Task Templates
- [ ] All 11 templates exist (Architecture, API, Data, Domain, UI, Security, Testing, DevOps, Analytics, Documentation, Governance)
- [ ] Each template includes Purpose, Scope, Inputs, Outputs, Dependencies, Rules, Examples, Anti-patterns, Success Criteria
- [ ] Template examples are complete and runnable (or marked as pseudo-code)
- [ ] All templates reference specifications and core rules
- [ ] Templates are language-agnostic where possible

### Validation Prompts
- [ ] All 9 validators have complete documentation
- [ ] Each validator includes a checklist that is specific and actionable
- [ ] No validator auto-fixes (read-only, report-only)
- [ ] All validators reference core rules they check against
- [ ] Validators include severity levels and recommendations

### Release Prompts
- [ ] All 9 release-stage prompts exist
- [ ] PR Review, Code Review, Architecture Review documented
- [ ] Release Readiness, Deployment, Migration, Rollback documented
- [ ] Post-Release Review and Production Readiness documented
- [ ] Each prompt includes checklist and approval criteria

### Comprehensive Assets
- [ ] Gate checklists for G0–G7 in machine-readable format
- [ ] Decision matrices for common architecture choices
- [ ] Naming convention tables for each bounded context
- [ ] Code snippet repository with traceability examples
- [ ] Glossary exports per bounded context

### Examples & Adoption
- [ ] Player Onboarding example complete (Vision → Release)
- [ ] 2+ additional examples (one domain-specific, one technical)
- [ ] Per-adapter quick-start guide (Copilot, Cursor, Lovable, etc.)
- [ ] Migration guide from old development process
- [ ] FAQ and troubleshooting guide
- [ ] GOVERNANCE-KICKOFF template

### Documentation & Versioning
- [ ] README fully documented
- [ ] CONTRIBUTING guide for extending EPOS
- [ ] GOVERNANCE document (approval process for new rules)
- [ ] ROADMAP v2.0 (next phase of enhancement)
- [ ] CHANGELOG v1.0.0 (what was built in v1)
- [ ] License (enterprise, open source, or custom)

## Success Criteria for v1.0.0

✅ **Completeness**
- ✓ All 14 AI assistants have adapters
- ✓ All 11 task template types have templates
- ✓ All 9 validation types have validators
- ✓ All 9 release stages have prompts
- ✓ All core rules are cross-referenced and consistent
- ✓ Zero contradictions between layers (core ← adapters ← templates ← validators ← release)

✅ **Usability**
- ✓ A new engineer can install EPOS in their repo in < 30 minutes
- ✓ AI assistants refuse work that violates core rules with clear explanation
- ✓ Code review feedback is fast (validation prompts give specific checklists)
- ✓ Specification-first workflow is enforced at every gate

✅ **Trustworthiness**
- ✓ Every decision is traceable (WHAT, WHY, RULE, SOURCE, REJECTED alternatives)
- ✓ Every artefact carries a traceability ID
- ✓ Every gate verdict is recorded with evidence
- ✓ Post-release incidents can be root-caused to specification gaps or test failures

✅ **Extensibility**
- ✓ New adapters can be added without changing core rules
- ✓ New task templates can be created from the standard template
- ✓ New bounded contexts can have their own glossaries without modifying core
- ✓ New validators can be added by pattern

## Next Immediate Actions

1. **Create missing 4 adapters** (Claude Code, Codex, Gemini, Cline)
   - Estimated: 4 hours
   - Owner: EPOS Governance Council

2. **Create missing 7 task templates** (UI, Security, Testing, DevOps, Analytics, Documentation, Governance)
   - Estimated: 12-16 hours
   - Owner: EPOS Governance Council + domain experts

3. **Create Player Onboarding end-to-end example**
   - Estimated: 8 hours
   - Owner: Senior engineer + product owner

4. **Create comprehensive assets** (checklists, matrices, snippets)
   - Estimated: 12 hours
   - Owner: EPOS Council + SMEs

5. **Create adoption guide and quick starts**
   - Estimated: 8 hours
   - Owner: EPOS advocacy + documentation

**Total estimated: 44-52 hours to v1.0.0 complete**

## Repository Structure Reference

```
enterprise-prompt-library/
├── README.md                           ← Main documentation
├── LICENSE                             ← Enterprise or open-source
├── VERSION                             ← Currently 1.0.0
├── CHANGELOG.md                        ← What changed in each version
├── CONTRIBUTING.md                     ← How to extend EPOS
├── GOVERNANCE.md                       ← Approval process for new rules
├── ROADMAP.md                          ← v2.0 and beyond
│
├── core/                               ← SUPREME authority (no one may override)
│   ├── constitution/
│   │   ├── CONSTITUTION.md             ✅
│   │   ├── PRINCIPLES.md               ✅
│   │   └── SPECIFICATION-DRIVEN-DEVELOPMENT.md ✅
│   ├── traceability/
│   │   ├── TRACEABILITY.md             ✅ NEW
│   │   └── EXPLAINABILITY.md           ✅ NEW
│   ├── workflow/
│   │   ├── WORKFLOW.md                 ✅
│   │   ├── APPROVAL-GATES.md           ✅
│   │   └── REFUSAL-PROTOCOL.md         ✅
│   ├── quality-gates/
│   │   └── QUALITY-GATES.md            ✅
│   ├── architecture/
│   │   └── ARCHITECTURE-RULES.md       ✅
│   ├── decision-rules/
│   │   └── DECISION-RULES.md           ✅
│   ├── ai-governance/
│   │   ├── AI-BEHAVIOUR.md             ✅
│   │   ├── AI-OUTPUT-FORMAT.md         ✅
│   │   ├── PRIVACY-PRINCIPLES.md       ✅
│   │   ├── SECURITY-PRINCIPLES.md      ✅
│   │   └── CHILD-PROTECTION.md         ✅
│   ├── documentation/
│   │   ├── CODING-STANDARDS.md         ✅ NEW
│   │   └── DOCUMENTATION-STANDARDS.md  ✅ NEW
│   └── glossary/
│       └── GLOSSARY.md                 ✅ NEW
│
├── adapters/                           ← Derived layer (no new rules)
│   ├── lovable/                        ✅
│   │   ├── ADAPTER.md
│   │   ├── BOOTSTRAP.md
│   │   ├── QUICK-START.md              🟡 TO CREATE
│   │   └── FAQ.md                      🟡 TO CREATE
│   ├── cursor/                         ✅
│   ├── copilot/                        ✅
│   ├── claude-code/                    ❌ TO CREATE
│   ├── codex/                          ❌ TO CREATE
│   ├── gemini/                         ❌ TO CREATE
│   ├── cline/                          ❌ TO CREATE
│   ├── continue/                       ✅
│   ├── roo-code/                       ✅
│   ├── windsurf/                       ✅
│   ├── aider/                          ✅
│   ├── bolt/                           ✅
│   └── v0/                             ✅
│
├── templates/                          ← Application of core rules
│   ├── architecture/                   ✅
│   ├── api/                            ✅
│   ├── data/                           ✅
│   ├── domain/                         ✅
│   ├── ui/                             ❌ TO CREATE
│   ├── security/                       ❌ TO CREATE
│   ├── testing/                        ❌ TO CREATE
│   ├── devops/                         ❌ TO CREATE
│   ├── analytics/                      ❌ TO CREATE
│   ├── documentation/                  ❌ TO CREATE
│   └── governance/                     ❌ TO CREATE
│
├── validation/                         ← Detection only (no auto-fix)
│   ├── architecture-review/            ✅
│   ├── security-review/                ✅
│   ├── privacy-review/                 ✅
│   ├── accessibility-review/           ✅
│   ├── performance-review/             ✅
│   ├── api-review/                     ✅
│   ├── ui-review/                      ✅
│   ├── domain-review/                  ✅
│   └── ai-governance-review/           ✅
│
├── release/                            ← Verification only
│   ├── code-review/                    ✅
│   ├── release-readiness/              ✅
│   ├── deployment/                     ✅
│   ├── migration/                      ✅
│   ├── changelog/                      ✅
│   ├── release-note/                   ✅
│   ├── rollback/                       ✅
│   ├── post-release-review/            ❌ TO CREATE
│   └── production-readiness/           ❌ TO CREATE
│
├── assets/                             ← Reusable fragments
│   ├── checklists/
│   │   ├── G0-business-integrity.yml   🟡 TO CREATE
│   │   ├── G1-architecture-integrity.yml 🟡 TO CREATE
│   │   └── ... (G2–G7)
│   ├── decision-matrices/              🟡 TO CREATE
│   ├── naming-conventions/             🟡 TO CREATE
│   └── code-snippets/                  🟡 TO CREATE
│
├── examples/                           ← Worked end-to-end examples
│   ├── player-onboarding/              🟡 TO CREATE
│   │   ├── 01-vision/
│   │   ├── 02-specification/
│   │   ├── 03-architecture/
│   │   ├── 04-implementation/
│   │   ├── 05-testing/
│   │   ├── 06-review/
│   │   └── 07-release/
│   └── [2+ more examples]
│
└── docs/                               ← Adoption & integration
    ├── adoption/
    │   ├── GETTING-STARTED.md
    │   ├── MIGRATE-OLD-PROCESS.md
    │   ├── GOVERNANCE-KICKOFF.md
    │   └── FAQ.md
    └── architecture/
        └── EPOS-ARCHITECTURE.md
```

## Governance & Approval

**Changes to core rules** require:
- 2/3 vote from Governance Council
- Written justification
- Impact assessment (how many adapters/templates affected?)
- New version and supersedes record
- Migration guide if breaking

**New adapters/templates** require:
- Conformance review (does it contradict core rules?)
- Traceability review (are dependencies correct?)
- Example review (is the example runnable?)
- Gate verdicts (G4–G6 pass)

**New validators/release prompts** require:
- Alignment review (does it check what core rules require?)
- Severit levels (critical, blocking, advisory?)
- False-positive assessment (rate of false positives?)

---

**EPOS v1.0.0 is the foundation. This guide maps the remaining work to a production-ready system.**

**Estimated completion: 3 weeks of focused effort.**
