# Football Ecosystem Platform — Architecture Documentation

**One Identity. One Journey. One Football Ecosystem.**

This directory is the governed source of truth for all architecture artefacts.
No production code may be written for a bounded context until its prerequisite
artefacts are approved (see [lifecycle.md](./lifecycle.md)).

## Structure

```text
docs/
  README.md                 <- you are here
  lifecycle.md              <- Stage 0-6 definitions + stage gates
  quality-gates.md          <- pass/fail checklists per gate
  artefact-registry.md      <- status of every artefact, per context
  glossary.md               <- ubiquitous language (DDD)
  governance/
    council.md              <- roles, decision rights, escalation
    output-format.md        <- mandatory 14-section feature response format
    decision-rules.md       <- tie-breaker rules
  adr/
    README.md               <- ADR index
    _template.md            <- ADR template (MADR-style)
    ADR-0001-*.md ...
  metrics/
    active-football-activity.md   <- PRG-MET-001, North Star counting rule
  vision/
    PRG-VIS-001-vision-positioning.md
  contexts/
    _template/              <- per-context artefact skeleton
    identity/               <- Sprint 1 (incl. CONSENT-001)
    ...
```

## Bounded contexts

Identity · Organization · Team · Player · Parent · Coach · Referee ·
Competition · Match · Training · Development · Finance · Notification ·
Scouting · Federation

Each context owns: PRD, Domain Model, ERD subset, API Contract, UI Contract, ADRs.

## Current position

Evidence sources below verified against [artefact-registry.md](./artefact-registry.md) and .lovable/plan/ Council resolutions 6 Aug 2026 (drift corrected Sprint 3 P6b remediation):

- **Stage:** 2 (Domain Engineering) — **G0 PASSED** 6 Aug 2026 · **G1 PASSED** 6 Aug 2026 (see artefact-registry lines 15–16)
- **G0 PASSED artefacts (3):**
  - ADR-0002 rev. 2 Football ID fully opaque identifier (ACCEPTED)
  - PRG-MET-001 Active Football Activity counting spec / VAP rule (APPROVED)
  - CONSENT-001 Consent, Access Rights & Privacy for Minors foundational (APPROVED)
- **G1 PASSED artefacts (2 APPROVED 6 Aug 2026 per Council .lovable/plan resolutions):**
  - PRG-VIS-001 rev.3 Vision, Positioning, North Star + Phase 0–4 targets + NDI/JCS/CTI triad (APPROVED; G1 PASSED 6 Aug 2026; registry line 15)
  - PRG-STK-001 Enterprise Stakeholder Map 41 stakeholders 9 groups + STK-INV-001..004 named (APPROVED; G1 PASSED 6 Aug 2026; registry line 16)
- **Active artefact now (Stage 2 Domain current work):** `IDN-PRD-001` — [Identity Product Requirements Document v1.0](./contexts/identity/01-prd.md) (**IN_REVIEW — 2 blocking Council-owned business decisions OPEN: OQ-02 L1 evidence floor, OQ-05 CTI Phase 0 halt threshold**; see registry line 27 + governance decision briefs `docs/governance/S3-OQ-02-DECISION-BRIEF.md` and `docs/governance/S3-OQ-05-DECISION-BRIEF.md`)
- **G2–G5 Identity artefacts status:** ALL IN_REVIEW (see Identity artefact-registry lines 28–37). Not approved.
- **Active context:** Identity (Sprint 1 active; all other contexts NOT_STARTED until Identity G6 per registry lines 42–48)
- **Implementation Gate G6:** **BLOCKED** (registry IDN-IMP-001 line 38; Enterprise Development Lifecycle forbidden-action-matrix: production code requires Approved G0–G5 for the context; currently only G0/G1 APPROVED → G2/G3/G4/G5 not APPROVED yet → G6 correctly BLOCKED)
- **Sprint 3 current work:** Audit Remediation, Traceability Hardening, Gate Readiness (no implementation code allowed this sprint; governance-only per Sprint 3 mandate §0 Absolute Governance Rule)
- **Sprint 1 future scope when G0–G5 APPROVED:** Authentication · Person · Football ID · Role & Permission · Organization Membership · Dashboard Shell

## North Star

**Verified Active Players** = Football ID + Guardian Verified + Active Football Activity.
Counting rule: [PRG-MET-001](./metrics/active-football-activity.md).

## Overriding principle

**The Child's Interest Prevails.** Where Organization, Coach, Guardian, Sponsor,
or Association interests conflict, the outcome that best protects the child Player
wins. Adopted at G0; outranks every other decision rule.
