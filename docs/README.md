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

- **Stage:** 1 (Product) — **G0 PASSED** 6 Aug 2026
- **G0 artefacts:** ADR-0002 rev. 2 (ACCEPTED) · PRG-MET-001 (APPROVED) ·
  CONSENT-001 (APPROVED)
- **Active artefact:** `PRG-VIS-001` — [Vision & Positioning](./vision/PRG-VIS-001-vision-positioning.md) (DRAFT)
- **Active context:** Identity
- **Sprint 1:** Authentication · Person · Football ID · Role & Permission ·
  Organization Membership · Dashboard Shell

## North Star

**Verified Active Players** = Football ID + Guardian Verified + Active Football Activity.
Counting rule: [PRG-MET-001](./metrics/active-football-activity.md).

## Overriding principle

**The Child's Interest Prevails.** Where Organization, Coach, Guardian, Sponsor,
or Association interests conflict, the outcome that best protects the child Player
wins. Adopted at G0; outranks every other decision rule.
