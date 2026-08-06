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
  contexts/
    _template/              <- per-context artefact skeleton
    identity/               <- Sprint 1
    ...
```

## Bounded contexts

Identity · Organization · Team · Player · Parent · Coach · Referee ·
Competition · Match · Training · Development · Finance · Notification ·
Scouting · Federation

Each context owns: PRD, Domain Model, ERD subset, API Contract, UI Contract, ADRs.

## Current position

- **Stage:** 0 (Vision) — not yet approved
- **Active context:** Identity
- **Sprint 1:** Authentication · Person · Football ID · Role & Permission ·
  Organization Membership · Dashboard Shell

## North Star

**Verified Active Players** = Football ID + Guardian Verified + Active Football Activity.
