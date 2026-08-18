---
id: G7-REVIEW-002
title: Gate 7 Formal Review Findings — Identity Bounded Context Sprint 3 Remediation Framework
stage: 7
gate: G7 (Pre-Implementation Audit)
status: FRAMEWORK DEFINED — FINDINGS NOT VERIFIED
owner: EFPEC Council (Principal Security Architect · Principal QA Architect · Principal Frontend Architect · Principal Backend Architect)
derives_from: [AUD-IDN-2026-001 §4.2 Document Gap, quality-gates.md, lifecycle.md]
satisfied_by: [SEC-01, TR-04, PERF-01]
adrs: [ADR-0001, ADR-0002, ADR-0003]
north_star_impact: G7 discharge required before G6 implementation. Missing G7 findings = SEC-01/TR-04/PERF-01 cannot be audited/discharged per project memory Document Blocker statement.
---

# G7-REVIEW-002
## Gate 7 Formal Review Findings Framework
### Identity Bounded Context · Pre-Implementation Audit

---

## 1. Document Control

| Field | Value |
|---|---|
| Document ID | G7-REVIEW-002 |
| Revision | v1.0 · Sprint 3 Remediation Framework |
| Date Created | 9 Aug 2026 |
| Status | FRAMEWORK DEFINED — FINDINGS NOT VERIFIED (Implementation G6 BLOCKED) |
| Scope | Identity Bounded Context (Sprint 1 artefacts G0–G5; pre-implementation structural readiness review before G6) |
| Next Revision | Upon: (a) G2 IDN-PRD-001 APPROVED after OQ-02/OQ-05 Council decisions, (b) Deep-Dive AUD-IDN-2026-002 discharge evidence, (c) SEC-01/TR-04/PERF-01 first factual findings populated |

---

## 2. Purpose

This document is the **formal Gate 7 Pre-Implementation Review framework** for Identity Bounded Context. It is referenced by lifecycle as a governance gate between approved G5 UX specifications and authorized G6 implementation work.

Purpose:
1. Provide a **single review instrument** that aggregates Security (SEC-01), Trust & Transparency (TR-04), Performance & Scalability (PERF-01), Child-Data Risk, Consent, Authorization, RLS, API, and Opaque ID abuse reviews into one auditable document.
2. Standardize findings classification, severity taxonomy, remediation requirements, evidence standard, and disposition so every finding is traceable, dischargeable, and cannot be silently dropped.
3. Discharge the Project Memory statement: *"Document Blocker: Absence of G7-REVIEW-002 findings prevents audit/repair of SEC-01, TR-04, and PERF-01."*
4. Produce Gate Recommendation (§24) to EFPEC Council authorizing or denying entry to G6 Implementation Stage (conditional on G0–G5 all APPROVED first — this document cannot override lifecycle forbidden action matrix).

---

## 3. Scope (What This Review Covers)

IN SCOPE:
- Identity Sprint 1 specifications G0–G5 (CONSENT-001, PRD, JRN, DMN, CDM, EVT, ERD, API, SCR, DS, UIC, SCR-DETAILS, FE-001)
- ADR-0001 Runtime Stack TanStack Start + Lovable Cloud
- ADR-0002 Football ID Opaque Identifier rev.2
- ADR-0003 Membership Primary+Secondary
- INFRASTRUCTURE_SUMMARY (IDN-INFRA-001) + INFRASTRUCTURE_FOLDER_STRUCTURE (IDN-FOLDER-001) — added to registry in Sprint 3
- Programme-level lifecycle G0–G6 forbidden action matrix enforcement

OUT OF SCOPE (cannot be verified until G6):
- Production runtime behavior
- Actual database RLS policy code verification (requires G3 APPROVED + G6 implemented)
- Real Football ID lookup latency benchmarks (requires G4 APPROVED + deployment)
- All factual implementation security scanning results (not yet written = NOT IMPLEMENTED status)
- Other Bounded Contexts (Organization, Team, Competition, etc.) — explicitly blocked until Identity G6 per registry line 47-48

---

## 4. Review Authority

Reviewers named per council.md §5 Roles:

| Review Domain | Lead Reviewer | Veto Authority |
|---|---|---|
| Overall G7 Review | Principal QA Architect | Signs off §26 Approval block |
| Security (SEC-01 · §8 · §11–16) | **Principal Security Architect** | **ABSOLUTE VETO per council.md §24-28 on any child-data risk finding without compensating control** |
| Trust & Transparency (TR-04 · §9) | Chief Product Officer + Principal UX Architect | Escalate ties to CE Architect |
| Performance & Scalability (PERF-01 · §10 · §17) | Principal DevOps Architect + Principal Backend Architect | No veto; escalate to CE Architect for capacity investment decisions |
| Consent (§12) | Chief Product Officer + Principal Domain Architect | Consent definition is CONSENT-001 APPROVED G0; review cannot change consent rules |
| Child-Data Risk (§11) | **Principal Security Architect** + Principal Grassroots Dev Expert | Dual signoff required per Rule 0 override analysis |

Quorum for G7 discharge: All 4 lead reviewers listed above have signed §26 + Principal Security Architect has no active veto. Without quorum → Gate Recommendation = **BLOCKED**.

---

## 5. Source Artifacts Reviewed

Authoritative source list; review evidence MUST trace to one of these (per Sprint 3 §1 Conflict Resolution Order Approved ADR > Council Decision > Approved Governance > Approved Domain > IN_REVIEW > Draft > Agent inference):

| Group | Artefacts |
|---|---|
| Approved ADR | ADR-0001 (ACCEPTED), ADR-0002 (ACCEPTED rev.2), ADR-0003 (ACCEPTED) |
| Approved Programme G0-G1 | PRG-GOV-001 lifecycle, PRG-MET-001 ActivityPolicy, PRG-VIS-001 rev.3 APPROVED, PRG-STK-001 APPROVED |
| Approved Identity G0 | CONSENT-001 APPROVED 6 Aug 2026 |
| IN_REVIEW Identity G2-G5 | IDN-PRD-001 (IN_REVIEW — 2 OQ blocking), IDN-JRN-001, IDN-DMN-001, IDN-CDM-001, IDN-EVT-001, IDN-ERD-001, IDN-API-001, IDN-SCR-001, IDN-DS-001, IDN-UIC-001, IDN-SCR-DETAILS-001 |
| DRAFT Stage 6 | IDN-FE-001 Frontend Architecture (DRAFT Stage 6), INFRASTRUCTURE_SUMMARY, INFRASTRUCTURE_FOLDER_STRUCTURE |
| Governance | council.md, decision-rules.md (incl. STK-INV), quality-gates.md, glossary.md, artefact-registry.md, output-format.md |
| Sprint 3 Remediation | S3-OQ-02-BRIEF (OPEN), S3-OQ-05-BRIEF (OPEN), SEC-01, TR-04, PERF-01 |
| Audit | AUD-IDN-2026-001 (Full Doc Review 8 Aug 2026) |

---

## 6. Review Method

Standard 8-step finding discharge process applied to every finding in §8–§17:

1. **READ** the source artifact requirement
2. **TRACE** to downstream implementation specification (domain rule → API → UX screen → component)
3. **IDENTIFY** expected control that would verify the requirement in implementation
4. **COLLECT** evidence: if implementation exists = factual observation; if only spec exists = SPECIFIED citation; if neither = NOT IMPLEMENTED
5. **CLASSIFY** finding severity (§19)
6. **ASSIGN** owner (§20)
7. **STATE** remediation requirement (§21) and evidence standard (§22)
8. **MARK** disposition (§23): OPEN · IN_PROGRESS · DISCHARGED · ACCEPTED_RISK (accepted risk requires ADR per ADR process)

Application across review phases:
- **Sprint 3 v1.0 (this version):** All review sections §7–§17 populated at framework-level with Status = NOT VERIFIED / SPECIFIED / NOT IMPLEMENTED, consistent with current lifecycle position (G6 BLOCKED → no implementation runtime evidence).
- **Post-Council OQ decisions, pre-AUD-IDN-2026-002 deep-dive:** OQ-02 and OQ-05 policy parameter populated as DECIDED; status of G2/G3/G4/G5 review items moved to SPECIFIED once PRD is APPROVED.
- **AUD-IDN-2026-002 Deep Dive completion:** FE-001 PART 06–27, PRD PART 8+ tail, API C-11..C-22/Q-05..Q-12, remaining SCR details, STK PART 15–18 coverage fully evidence-backed → status changes accordingly.
- **Entry to G6 Implementation:** Every BLOCKER/CRITICAL finding must be DISCHARGED; MAJOR findings require remediation plan with date; MINOR/OBSERVATION findings can be tracked to G6 discharge with remediation scheduled within implementation sprint.

---

## 7. Universal Gate Verification (quality-gates.md §Universal)

Status applied to quality-gates.md Universal Gate 10-item check as the precondition of ALL downstream review sections. Universal Gate must PASS before any other gate is considered (per quality-gates.md line 3-5: "A gate is PASSED only when every checklist item is satisfied and the universal gate passes").

| # | Checklist Item | Evidence Source | Current Status | Notes |
|---|---|---|---|---|
| UG-01 | The Child's Interest Prevails | decision-rules.md Rule 0 · council.md §6 rule | SPECIFIED · PASS at governance policy level; NOT VERIFIED at implementation behavior level | Rule 0 override analysis documented in OQ-02/OQ-05 briefs; implementation behavior requires G6 code review |
| UG-02 | Consistent with six Non-Negotiable Principles (P0=Rule0, P1=Player Owns Journey, P2=FID First, P3=OnePerson→ManyRoles, P4=API-First, P5=Contract-First) | PRG-VIS-001 rev.3 §Principles · council.md §Standing Constraints | SPECIFIED · PASS at spec level; NOT VERIFIED implementation | 6P enumerated and traced in AUD-IDN-2026-001 §Consistency Report; cross-artifact verified KONSISTEN |
| UG-03 | Football ID remains the SSOT; no module invents player identity | council.md §37 constraint · ADR-0002 rev.2 opaque · ERD identity pattern (football_id uuid FK everywhere) | SPECIFIED · PASS at spec level; NOT VERIFIED implementation · ERD §structural commitment #2: FootballId opaque FK-only pattern | STK-INV + Standing Constraint #2 FID First confirmed consistent 3+ sources |
| UG-04 | No separate account introduced for an additional role | ERD §structural commitment note Player/Coach/etc are RoleAssignment values on Person, NOT separate entities · glossary Forbidden Terms "coach login" / "referee login" | SPECIFIED · PASS spec level · ERD Player NOT an entity note; NOT VERIFIED implementation login flow | Constitution #3 One Person→Many Roles Standing Constraint council.md |
| UG-05 | Traceability front-matter complete, no dangling derives_from | Lifecycle §Traceability YAML · Registry artefact list cross-check | SPECIFIED · front-matter verified for 34+ reviewed artefacts; PRG-CTX/CDM/API/UXS NOT_STARTED so no front-matter to verify | 2 INFRA files added to registry via Sprint 3 P6 to fix dangling status |
| UG-06 | Ubiquitous language matches glossary.md | glossary.md 52 terms + 5 Forbidden · Sprint 3 P7e Forbidden Vocab Scan output | IN_REVIEW at spec level; partial findings from P7e scan; Final PASS requires zero open MAJOR+ severity forbidden-vocab findings | — |
| UG-07 | Child-data impact assessed; consent model referenced where applicable | CONSENT-001 G0 APPROVED · PRD §U13 structural prohibition of scouting · STK-INV-004 structural absent over denied | SPECIFIED · child-data impact explicit in every artefact; NOT VERIFIED implementation RLS enforcement | U13 scouting capability modelable? ERD says NO structural absence |
| UG-08 | Any architectural deviation captured in accepted ADR | adr/README.md 3 ADR entries; ADR-0001 deviation TanStack vs Next.js/Supabase original; ADR-0002 rev1→rev2 G0 reject encoded; ADR-0003 Primary+Secondary membership | SPECIFIED · 3 deviations captured in ACCEPTED ADRs; NO unrecorded deviation detected in Sprint 3 scan | ADR lifecycle PROPOSED→Council→ACCEPTED/REJECTED · adr/README.md line 14 |
| UG-09 | North Star impact stated (VAP = FID + GuardianVerified + ActiveFootballActivity) | PRG-MET-001 counting rule APPROVED · glossary §VERIFIED_ACTIVE · PRD §Product Goals PG-01 | SPECIFIED · metric counting rule unambiguous per ActivityPolicy named+versioned (default GLOBAL.v1); NOT VERIFIED runtime metric computation | All published metrics mandate policy_id@version traceability |
| UG-10 | Nationally scalable (Sulsel → Indonesia Timur → Nasional) | decision-rules.md tie-break #1 National Scalability first priority; PRG-VIS-001 P0–P4 phases | SPECIFIED · architectural choices (opaque FID non-encoded regional/year = no regional breaking change at P3/P4); NOT VERIFIED implementation scalability under load | PHASE 0–4 scaling target numbers confirmed G1 PASSED 6 Aug |

**Aggregate Universal Gate Status (v1.0 Sprint 3 Framework):** **SPECIFIED — 6 items PASS at governance policy; 4 items NOT VERIFIED requiring implementation-level evidence + 1 item IN_REVIEW vocab scan.** Universal Gate does NOT PASS until all 10 are VERIFIED.

---

## 8. Security Review (Cross-Reference to SEC-01)

This section is an index; **factual findings are in [SEC-01.md](./SEC-01.md)**. Populated findings below link back to SEC-01 Finding ID. Severity classification uses §19 taxonomy.

| Area (Sprint 3 §6 P1 SEC-01 list) | Expected Controls Specified? | Implementation Evidence | Link to SEC-01 Finding | Current Status |
|---|---|---|---|---|
| 8.1 Child-data authorization perimeter (6 roles × 12 data classes from CONSENT-001 Access Rights matrix) | SPECIFIED CONSENT-001 §Access Rights Matrix · IDN-API-001 P-10 AuthZ eval order | NOT IMPLEMENTED (G6 blocked) | SEC-01-F01 through SEC-01-F12 | SPECIFIED · NOT IMPLEMENTED · NOT VERIFIED runtime behavior |
| 8.2 Guardian authorization (L0–L3 unlock mapping per consent purpose) | SPECIFIED CONSENT-001 §Guardian Verification Levels · P8 requires L2 minimum explicit rule | NOT IMPLEMENTED | SEC-01-F13–F16 | SPECIFIED · NOT IMPLEMENTED |
| 8.3 Organization authorization boundary (Membership end = Coach access end; Journey remains read-only for historical) | SPECIFIED ADR-0003 INV-MEM-05 End Date immediate access rule · ERD note coach access ends with membership | NOT IMPLEMENTED | SEC-01-F17 | SPECIFIED · NOT IMPLEMENTED |
| 8.4 Association authorization | SPECIFIED STK-001 Part 10 Permission matrix F section | NOT IMPLEMENTED | SEC-01-F18 | SPECIFIED · NOT IMPLEMENTED |
| 8.5 Federation authorization (L3 Fed verify unlocks; Federation ACL Reference domain) | SPECIFIED CONSENT-001 L3 · ERD Reference Domains list Federation Ref | NOT IMPLEMENTED | SEC-01-F19 | SPECIFIED · NOT IMPLEMENTED |
| 8.6 System authorization (System actor only JRN-06 FID issuance — no human discretion) | SPECIFIED JRN-06 Issue FID = System actor ONLY explicit · IDN-API-001 C-05 IssueFID = system-invoked only endpoint property | NOT IMPLEMENTED · critical path review; enumeration resistance | SEC-01-F20 | SPECIFIED · NOT IMPLEMENTED |

---

## 9. Trust & Transparency Review (Cross-Reference to TR-04)

Index; **full findings in [TR-04.md](./TR-04.md)**.

| Area (Sprint 3 §7 P1 TR-04 list 14 areas) | Specified in Approved/IN_REVIEW Artifacts? | Evidence from Implementation | Link to TR-04 Finding | Status |
|---|---|---|---|---|
| 9.1 Consent presentation (closed 8 purpose P1–P8; no accept all) | SPECIFIED CONSENT-001 §Consent one per Person+Purpose structural rule (cannot accept all) · IDN-SCR-001 SCR-GRD-02 screens | NOT IMPLEMENTED UX | TR-04-F01–F05 | SPECIFIED · NOT IMPLEMENTED |
| 9.2 Guardian authority separation (annotate never mutate) | SPECIFIED STK-INV-003 annotation lifecycle · IDN-EVT-001 GRD-06 GuardianAnnotationRecorded event name | NOT IMPLEMENTED | TR-04-F06–F09 | SPECIFIED · NOT IMPLEMENTED |
| 9.3 Effect-before-notification (High-Risk Revocation Rule 0) | SPECIFIED CONSENT-001 §High-Risk Revocation flow 4-step: EFFECT PRECEDES NOTIFICATION emit→notify→audit→review queue NEVER reverses | NOT IMPLEMENTED event flow | TR-04-F10–F13 | SPECIFIED · NOT IMPLEMENTED |
| 9.4 P8 AI consent special rules (P7≠P8; U13 structural; 90-day SLA honest statement NOT instant removal from trained model) | SPECIFIED CONSENT-001 §3.1 P8 eight special conditions · Event CON-07 AITrainingConsentWithdrawn named in catalogue · glossary §P8 definition | NOT IMPLEMENTED (training pipeline out of scope until Phase 2) | TR-04-F14–F20 | SPECIFIED · NOT IMPLEMENTED · structural U13 unavailable |

---

## 10. Performance & Scalability Review (Cross-Reference to PERF-01)

Index; **full findings in [PERF-01.md](./PERF-01.md)**.

| Area (Sprint 3 §8 P1 PERF-01 list 16 areas) | Approved Policy / Budget Number Exists? | Specified without budget? | Link to PERF-01 Finding | Status |
|---|---|---|---|---|
| 10.1 Football ID lookup latency display_code vs football_id | ❌ NO approved latency budget (UNDEFINED) | SPECIFIED ADR-0002 display_code rate-limited lookups; football_id PK lookups normal | PERF-01-F01 | UNDEFINED budget — requires approved policy decision; pattern SPECIFIED |
| 10.2 National roster scalability (Primary Membership INV-18: One Active Primary serialisation trade-off EXPLICIT in IDN-DMN-001) | ❌ NO approved roster size budget | SPECIFIED Domain Model note INV-18 trade-off "serialize national roster bad → explicit TransferService domain service" · NOT serialised via DB constraint at this stage | PERF-01-F02 | UNDEFINED — INV-18 trade-off documented SPECIFIED not decided |
| 10.3 Journey projection read scaling (EDEC-01 projection not authoritative; EventStore = source of truth) | ❌ NO read latency budget | SPECIFIED IDN-EVT-001 JourneyUpdated EXCLUDED as event (technical projection refresh = not domain event) | PERF-01-F03 | SPECIFIED architecture pattern (CQRS read-side projection); budget UNDEFINED |
| 10.4 CQRS query scaling · 22 commands / 12 queries strict separation | SPECIFIED IDN-API-001 P-04 Strict CQRS | ❌ No query throughput budget | PERF-01-F04 | SPECIFIED pattern; no SLA numbers |

---

## 11. Child-Data Risk Review (Principal Security Architect mandatory review)

Rule 0 override analysis per finding. This section cannot discharge without dual signoff (§4).

| Risk Area | Expected Control Specified? | Evidence | Finding Severity (§19) | Status |
|---|---|---|---|---|
| 11.1 U13 scouting capability structural absence (STK-INV-004 canonical example) | ✅ SPECIFIED ABSENCE: CONSENT-001 P5 Scouting structural unavailable U13; ERD structural commitment #4; IDN-SCR-001 No screens for U13 scouting; catalogue commitment #4 "structural prohibition = screens tidak exists (bukan disabled)" | Domain-level evidence 4 sources; Implementation-level code-path absent NOT VERIFIABLE (G6 blocked) | BLOCKER if code path found at G6 code review | SPECIFIED ABSENT (structural); NOT VERIFIED implementation. Will be reviewed at G6 SEC-01 security review with actual code paths. |
| 11.2 Minor data RLS boundary (anonym = ZERO minor table access per CONSENT-001 Stage3 RLS invariant) | ✅ SPECIFIED RLS invariant CONSENT-001 Appendix Stage3 RLS rules; ERD RLS design logical only | No actual Postgres policy code (G3 APPROVAL prerequisite) | CRITICAL if anon access granted at G6 RLS verify | SPECIFIED · NOT IMPLEMENTED · NOT VERIFIED runtime |
| 11.3 Consent revocability permanent audit trail (DSAR fulfilment part of CTI halt diagnostics) | ✅ SPECIFIED CONSENT-001 §Consent revocation audit trail mandatory; PRG-VIS-001 CTI halt diagnostics includes DSAR fulfilment SLA | No audit log code | CRITICAL | SPECIFIED · NOT IMPLEMENTED |
| 11.4 High-risk revocation review queue never reverses effect (Rule 0 effect first) | ✅ SPECIFIED CONSENT-001 §High-Risk Revocation 4-step flow; JRN-09 precondition = "revocation SUDAH efektif" (Rule 0 effect precedes notification explicit) | No review queue implementation | BLOCKER if implementation permits review to reverse effect | SPECIFIED · NOT IMPLEMENTED |

---

## 12. Consent Review (Referenced to CONSENT-001 APPROVED G0)

Consent model is **APPROVED G0 6 Aug 2026**. Review scope = downstream specifications correctly implement CONSENT-001; no review can change consent rules.

| Area | CONSENT-001 Source Reference | Implementation in Downstream Specs? | Status |
|---|---|---|---|
| 12.1 Closed 8 Purposes P1–P8; no "consent all" structural rule (one Consent Aggregate Root per Person+Purpose = cannot accept all) | CONSENT-001 §Purpose Closed List P1..P8; §Aggregate Root per Person+Purpose | IDN-DMN-001 A-04 Consent = one per Person+Purpose explicit invariant; IDN-API-001 C-06 GrantConsent operation takes exactly one purpose as per-purpose = cannot batch | ✅ SPECIFIED · structural cannot-accept-all invariant |
| 12.2 P8 AI special: P7 analytics ≠ P8 training; never imply P7→P8 | CONSENT-001 §3.1 P8 conditions #5: "P7 TIDAK menyiratkan P8" explicit | PRD FR-CON-05 P8 special; IDN-EVT-001 CON-07 AITrainingConsentWithdrawn specific event distinct from analytics events; Event family CON 7 events separate Revoke/Expired/AITrainingWithdrawn | ✅ SPECIFIED · P8 treated independently everywhere detected |
| 12.3 High-Risk Revocation: P4/P5/P8 revocation = high-risk → JRN-09 flow trigger; EFFECT BEFORE NOTIFICATION mandatory | CONSENT-001 §High-Risk Revocation §Flow | IDN-API-001 C-07 RevokeConsent triggers JRN-09 on high-risk purposes per spec; JRN-09 precondition = already effective | ✅ SPECIFIED · JRN precondition enforces effect-first |
| 12.4 L0–L3 unlock mappings per purpose (P8 requires L2 min; L1 cannot grant P8) | CONSENT-001 §Guardian Levels unlock table | ERD Verification Evidence schema supports levels; API C-17 SubmitEvidence populates level | ✅ SPECIFIED · purpose→level unlock matrix explicit |
| 12.5 OQ-02 L1 evidence floor parameter NOT defaulted | CONSENT-001 L1 basis states "one evidence document (floor Council policy = OQ-02 OPEN)" | IDN-PRD-001 OQ-02 OPEN; S3-OQ-02-BRIEF OPEN status maintained no invented value | ✅ SPECIFIED · parameter NOT substituted — compliance with Enterprise Refusal Protocol |

Consent Review Overall: **5/5 items SPECIFIED correctly downstream; 0 drift from CONSENT-001 detected.**

---

## 13. Authorization Boundary Review (Typed Evaluation Order)

Source: IDN-API-001 Principle P-10 Secure-by-Default authorization evaluation order:
**Person (authn) → Role (active assignment) → Relationship (in-scope Membership/GuardianLink) → Consent (valid purpose active) → Age Gate → Policy → Scope**

| Eval Step | Downstream Spec Implements Order? | Evidence | Status |
|---|---|---|---|
| 13.1 7-step ordered eval, never skip early steps | SPECIFIED P-10 API Principle list order typed exactly | IDN-FE-001 §Auth Guards (PART 06) = TBD in AUD-IDN-2026-002 | SPECIFIED at API level; NOT VERIFIED frontend guard application order |
| 13.2 Age gate applied BEFORE policy; U13 structural prohibition before later checks | SPECIFIED Age Gate position = step 5 (after consent, before policy = early reject structural) | STK-INV-004 canonical U13 | SPECIFIED |
| 13.3 Unauthorized 403 indistinguishable from 404 (no existence leak — deep link rule 6 IDN-SCR-001) | SPECIFIED SCR Catalogue Deep Link Rules §Rule 6 unauthorized → SCR-SYS-02 Access Denied payload shape same as not-exist | Frontend implementation = NOT IMPLEMENTED | SPECIFIED in UX; NOT IMPLEMENTED |
| 13.4 Anon access: ZERO minor data rows (CONSENT-001 Stage3 RLS rule) — step 1 failed (no Person authn) → reject all | SPECIFIED | RLS code = G3/G6 | SPECIFIED rule; NOT IMPLEMENTED policy |

---

## 14. Opaque Football ID Abuse Review (ADR-0002 rev.2 safeguards)

Source: ADR-0002 rev.2 ACCEPTED G0; specific guardrails from decision document.

| Guardrail from ADR-0002 rev.2 | Downstream Spec Implements? | Status |
|---|---|---|
| 14.1 display_code NEVER used as FK / NEVER auth subject | ERD FK everywhere = football_id UUID; API auth uses UserBinding Person ref NOT display_code; IDN-FE-001 route params use $playerRef (opaque token) NOT display_code or football_id in URL | ✅ 3 sources SPECIFIED compliant; review: football_id vs display_code separation consistent across 3 layers |
| 14.2 Lookups by display_code are rate-limited + authenticated (cannot enumerate publicly) | IDN-API-001 Q-03 QueryFIDByDisplayCode operation has rate-limit metadata; IDN-SCR-001 Lookup screen requires OrgAdmin role context not public | ✅ SPECIFIED |
| 14.3 Issuance facts (issued_at, issuing_org) stored in data columns, NEVER encoded in identifier | ADR-0002 §Issuance facts explicit; ERD FootballIdentity entity issued_at, issuing_org_ref explicit columns separate from display_code/football_id | ✅ SPECIFIED · Opaque = fully, no semantically encoded bits |
| 14.4 Rejection-sampling collision, never sequential, display_code non-sequential ~40bit entropy 2 blocks | ADR-0002 algorithm spec; FID Issuance JRN-06 = System actor only (no human input to sequence) | ✅ SPECIFIED algorithm · implementation NOT VERIFIED (CSPRNG at runtime) |
| 14.5 Deep link rules: opaque route params, no display_code in browser URL, 403/404 indistinguishable | IDN-FE-001 §5 Routing Tree param rules; IDN-SCR-001 Deep Link Rules 6 | ✅ SPECIFIED · NOT IMPLEMENTED runtime |

---

## 15. RLS / Data Access Review (Logical ERD Stage 3 RLS)

Source: CONSENT-001 Appendix RLS rules; ERD logical only (no SQL).

| Policy | Specified? | Implementation Status |
|---|---|---|
| 15.1 Person records: anon=deny all; self=read own; GuardianLink.read=read child Person summary fields only (data minimised STK-INV-001); OrgAdmin/Membership=read roster fields NOT ALL | RLS rules SPECIFIED text in CONSENT-001; ERD logical RLS section | NOT IMPLEMENTED Postgres policy code |
| 15.2 FootballIdentity: display_code lookup only RATE LIMITED authenticated; football_id read bound to person ownership | ADR-0002 guardrails §14 + RLS row-level matches Person access | NOT IMPLEMENTED |
| 15.3 GuardianLink.evidence and Verification.evidentiary fields (R4 Evidence Retention) = accessible only by Principal Security role, not OrgAdmin/Coach/Guardian | CONSENT-001 sensitivity classification R4 Evidence Retention; STK-001 permission matrix I5 Security role | SPECIFIED sensitivity category applied |
| 15.4 Membership end = coach access ends immediately, historical Journey read retained for record (never coach can edit Journey) | ADR-0003 INV-MEM-05 membership end; EDEC-01 Journey immutable append-only read | SPECIFIED boundary |

---

## 16. API Security Review (IDN-API-001 Principles P-01..P-13)

| Principle | Expected Behavior | Evidence Status |
|---|---|---|
| 16.1 P-02 No business logic at API edge (domain invariant enforcement = aggregates, NOT API edge) | IDN-API-001 P-02 explicit; Transfer complex in TransferService domain service NOT C-14 endpoint | SPECIFIED pattern |
| 16.2 P-04 Strict CQRS 22 Commands / 12 Queries; Journey ZERO commands (EDEC-01) | API Catalogue resources: Journey resource has 0 operations in Commands section (only queries) | ✅ SPECIFIED · EDEC-01 verified consistent Journey read-only |
| 16.3 P-06 Idempotent · P-05 Stateless | C-* commands use idempotency_key header explicit in spec | SPECIFIED |
| 16.4 P-10 Secure-by-Default typed eval order Person→Role→Relationship→Consent→Age→Policy→Scope | Already §13 AuthZ boundary review | SPECIFIED |
| 16.5 P-12 Uniform Error Envelope code/message/field/policy_ver/correlation_ref; policy_ver auditability; correlation traceable | Error envelope fields listed in P-12; no leaked PII in errors | SPECIFIED P-11 privacy projections PII minimised; error response leakage = NOT VERIFIED runtime code behavior |
| 16.6 C-06 GrantConsent: **no officer may grant on behalf of Person** (STK-INV-002 Record≠Consent) | IDN-API-001 C-06 operation constraints | ✅ SPECIFIED constraint STK-INV-002 cross-reference |
| 16.7 C-07 RevokeConsent P4/P5/P8 = JRN-09 high-risk flow (Rule 0 effect-first) | C-07 operation notes high-risk purposes | ✅ SPECIFIED |

---

## 17. Performance Scalability Review (PERF-01 Details)

Additional PERF-01 areas (see [PERF-01.md](./PERF-01.md) for findings):

| Area | Approved Budget? | Status |
|---|---|---|
| 17.1 EventStore append-only read pattern → projection scalability | ❌ UNDEFINED | SPECIFIED CQRS pattern (§10.3); no throughput budget approved |
| 17.2 Rate limiting configuration values (FID lookup, general API rate) | ❌ UNDEFINED | SPECIFIED concept only; values = COUNCIL-OWNED policy parameter (not invented) |
| 17.3 Cache invalidation CQRS side: write invalidates read projection rules | ❌ UNDEFINED | SPECIFIED general pattern in IDN-FE-001; invalidation exact rules in PART 08 = AUD-IDN-2026-002 coverage |
| 17.4 Regional → National scale at P2/P3: opaque FID (ADR-0002) zero encoded info = no breaking change when cross-region | ✅ SPECIFIED structural (ADR-0002 opaque) | SPECIFIED architecture scale-safe; load test budget UNDEFINED |

---

## 18. Findings Classification

Standard classification applied to every finding in SEC-01/TR-04/PERF-01 and review sections above:

| Finding Type Code | Definition | Example |
|---|---|---|
| SPEC-GAP | Specification Incomplete / Ambiguous — downstream implementation would need to invent rule | API C-22 description missing scope boundary → would need agent to fill → specification gap |
| CONSISTENCY-DRIFT | Inconsistency between 2 approved/IN_REVIEW artefacts (violates cross-artifact traceability) | If ERD Primary Many cardinality contradicts ADR-0003 → drift |
| INVENTED-RULE-DETECTED | Detection of business policy/value/threshold defaulted by agent without Council decision | OQ-02 assigned "KK = accepted" default → invented rule critical |
| IMPLEMENTATION-DEFECT | Runtime code defect detected (NOT populated until G6 code review phase) | RLS policy anon can read minor rows → defect blocker |
| EVIDENCE-REQUIRED | Missing evidence for something that should be verifiable in current stage | Glossary Forbidden scan says "coach login" found 3x but no line numbers cited → evidence weak → re-scan with evidence |
| TRACEABILITY-DANGLING | Derives_from/satisfied_by points to non-existent artefact or wrong stage | Artefact says derives IDN-API-002 (never defined) → dangling |
| VOCAB-DEVIATION | Forbidden Term in use per glossary.md §Forbidden Terms (from §P7e Vocab scan) | File uses "SSB's player" → vocab deviation |

---

## 19. Finding Severity

| Severity | Definition | Gate Impact If Left OPEN at Gate Review |
|---|---|---|
| **BLOCKER** | Violates Constitutional Rule 0, or creates structural child-data harm path, or violates STK-INV, or is INVENTED-RULE-DETECTED (agent wrote policy), or blocks Universal Gate (UG-01..UG-10) PASS | **GATE CANNOT PASS**. Cannot move to next stage. Remediation mandatory BEFORE gate signoff. |
| **CRITICAL** | Violates approved ADR decision, or breaks authorization perimeter, or breaks membership eligibility, or breaks VAP counting correctness | Gate CANNOT PASS before remediation plan APPROVED + scheduled + owner assigned WITHIN 7 days; implementation blocked until remediation lands in code. |
| **MAJOR** | Breaks traceability chain, or drifts from approved specification, or impacts audit trail completeness, or violates non-role-based forbidden vocabulary pattern at scale (5+ instances) | Gate cannot PASS without explicit remediation plan and Gantt chart milestone in sprint plan (before next Phase exit). Remediation can proceed in parallel with implementation if plan is approved. |
| **MINOR** | Minor vocab deviation (1–3 isolated instances), documentation typo, traceability field incomplete but salvageable, front-matter formatting issue | Gate can PASS if remediation tracked in issue list with owner; no structural gate impact. |
| **OBSERVATION** | Suggestion for future consideration, no impact on current gate, not a violation | Gate passes regardless; tracked in backlog for future stage. |

---

## 20. Finding Owner

Every finding has ONE owner. Ownership per council.md roles.

| Finding Scope | Default Owner |
|---|---|
| Security / Child-data / RLS / AuthZ perimeter | **Principal Security Architect** |
| Specification gap / Ambiguity / PRD wording / Functional rules | Chief Product Officer + affected context owner (Identity = Principal Domain Architect for DMN/ERD/EVT/CDM; API = Principal Backend Architect; UX/SCR/UIC/DS = Principal UX Architect) |
| Vocabulary deviation / Forbidden Terms | Documentation Owner; final approved wording by Principal Domain Architect (ubiquitous language governance) |
| Performance / Scalability budget undefined / Throughput question | Principal DevOps Architect; escalate to CE Architect for capacity investment decisions |
| Trust & Transparency / Consent presentation / Rule 0 in UX | Chief Product Officer + Principal UX Architect |
| ADR drift / Architectural change | Chief Enterprise Architect (ADR lifecycle owner) |
| Traceability / Registry / Documentation drift | Governance Registrar (updates registry + docs/README drift) |
| OQ-02 / OQ-05 Undecided Policy | **EFPEC Council** (quorate session; not delegated) |
| G7-REVIEW-002 framework itself | Principal QA Architect |

---

## 21. Remediation Requirement (Standard Format per Finding)

Every finding remediation includes:
1. Root cause stated
2. Exact artefact and line(s) to change
3. Change owner (§20)
4. Reviewer / Approver of the change
5. Due date
6. Post-remediation verification method (§22 evidence standard)
7. Post-remediation disposition (§23)

Remediation requirement applies to OPEN / IN_PROGRESS findings. DISCHARGED / ACCEPTED_RISK: remediation field = N/A.

---

## 22. Evidence Required per Finding Disposition

| Disposition Target | Required Evidence Standard |
|---|---|
| DISCHARGED | (a) Updated specification commit hash referencing change, (b) traceability cross-reference to at least 2 downstream artefacts confirming propagation, (c) reviewer signoff per approval matrix, (d) OQ-02/OQ-05 type items → Council resolution .lovable/plan document hash |
| ACCEPTED_RISK | (a) PROPOSED ADR documenting the accepted risk, compensating controls, Rule 0 analysis, (b) Council review, (c) ADR status changed to ACCEPTED per adr/README.md lifecycle, (d) veto-discharge note from Principal Security Architect if child-data involved |
| NOT VERIFIED → VERIFIED | (a) Implementation evidence (commit hash for code; test suite run report with PASS status; RLS anon check SQL executed SHOW search_path=anon, SELECT * FROM minor_table EXPECT 0 rows output log; screenshot proof attachment of visual state for UX screens) |
| IN_REVIEW → PASS | (a) Council quorum minutes / sign-off sheet, (b) gate checklist fully checked (no unchecked items), (c) BLOCKER/CRITICAL findings count = 0 |

---

## 23. Disposition (State Machine per Finding)

Finding lifecycle state transitions:

```
NOT VERIFIED (default, no evidence)
  → evidence collection
SPECIFIED (exists in spec only, no implementation yet)
  → after G6 implementation, becomes:
      - IMPLEMENTED (with evidence)
      - NOT IMPLEMENTED (evidence shows missing code)
NOT IMPLEMENTED
  → remediation code
IMPLEMENTATION-DEFECT (evidence shows runtime incorrect)
  → remediation (fix + retest)
IN_PROGRESS (remediation ongoing, owner assigned, due date set)
  → completion review → one of:
DISCHARGED (remediation verified)
ACCEPTED_RISK (via ADR, not fixed intentionally — BLOCKER severity finding CANNOT be accepted risk; requires superseding ADR with new Council decision on severity)
WON'T_FIX (only valid for OBSERVATION + MINOR findings with documentation)
```

---

## 24. Gate Recommendation

Final G7 recommendation to EFPEC Council based on aggregate status of all preceding sections. Recommendation values = **PASS / CONDITIONAL_PASS / BLOCKED** (one of three only).

**v1.0 Sprint 3 Initial Framework Recommendation:**

```yaml
GATE_7_RECOMMENDATION: BLOCKED
RATIONALE:
  1. G2 IDN-PRD-001 not APPROVED (OQ-02 + OQ-05 OPEN Council decisions, Universal Gate G2-06 policy values undecided fails → cannot authorize implementation specs.)
  2. Universal Gate aggregate status (§7): 6 items SPECIFIED PASS policy; 4 items NOT VERIFIED implementation; 1 item (UG-06 vocab) IN_REVIEW. → Universal Gate cannot PASS yet.
  3. 3 findings from §11 (Child-Data Risk) are SPECIFIED but NOT IMPLEMENTED — no structural harm path detected YET, but per severity rule BLOCKER if code path deviates, gate must re-evaluate after implementation evidence.
  4. 2 INFRASTRUCTURE files (IDN-INFRA-001, IDN-FOLDER-001) newly registered in Sprint 3 P6 as DRAFT/IN_REVIEW — not approved yet for implementation authority.
  5. Implementation Forbidden Action Matrix per lifecycle; Production code requires G0–G5 ALL APPROVED. Current status: G0 APPROVED, G1 APPROVED, G2 IN_REVIEW (blocked OQ), G3 IN_REVIEW depends G2, G4 IN_REVIEW depends G3, G5 IN_REVIEW depends G4. → Only 2/5 APPROVED prerequisites.
REQUIRED_BEFORE_RECOMMENDATION_CHANGED:
  1. OQ-02 Council decision RESOLVED + IDN-PRD-001 G2 APPROVED
  2. OQ-05 Council decision RESOLVED (affects G0 Phase Exit not direct gate but PRD completeness)
  3. G3/G4/G5 APPROVED status per registry (cannot happen until G2)
  4. AUD-IDN-2026-002 Deep-Dive Review PART coverage: FE-001 06-27; PRD 8+; API C11-22/Q5-12; SCR details 49/50; STK 15-18 DISCHARGED
  5. Vocab scan (§UG-06): MAJOR+ findings = 0 (discharged)
  6. Universal Gate 10/10 VERIFIED (not just SPECIFIED)
```

---

## 25. Traceability Matrix (Findings to Artefacts)

High-level coverage (detailed per-finding traceability in per-finding records SEC-01/TR-04/PERF-01). Coverage of mandatory chains per Sprint 3 §12:

| Traceability Chain | Coverage Status v1.0 | Notes |
|---|---|---|
| PRD → Journey (JRN) | SPECIFIED IDN-PRD-001 Business Problems → JRN-XX (21 journeys); individual FR-level mapping TBD at AUD-IDN-2026-002 PRD tail PART 8 | MISSING detail-level until PRD PART 8+ fully reviewed |
| PRD → Domain (DMN) | SPECIFIED PG-01..PG-09 → A-01..A-07 Aggregates; FR-PER → Person Aggregate etc. | IN_REVIEW (detail requires AUD-IDN-2026-002 PART tail) |
| Domain → Event (EVT) | SPECIFIED Family Event Catalogue (IDE 8, GRD 6, ..., POL 3 — 49 total) · EDEC-01 JourneyUpdated excluded (technical not domain) | ✅ Verified consistent EDEC-01 not event |
| Domain → Data (ERD) | SPECIFIED 7 Aggregates → 15 entities mapping (A-01 Person → Person/FootballIdentity/RoleAssignment/UserBinding/LifecycleTransition 5 entities etc.) | SPECIFIED |
| API → Authorization | SPECIFIED P-10 typed eval order; JRN-09/C-07 high-risk; C-06 STK-INV-02 | SPECIFIED |
| API → Consent enforcement | SPECIFIED C-06 Grant/C-07 Revoke purpose-mandatory; P8 special rules per purpose access checks | SPECIFIED |
| Invariant → API | SPECIFIED STK-INV-002 → C-06 constraint note; EDEC-01 → 0 commands Journey resource | ✅ 2 sample verified; full 38 invariants × API = PENDING |
| Invariant → UX enforcement | SPECIFIED STK-INV-003 annotate-never-mutate → SCR GRD screens; structural U13 scouting prohibition = NO SCREEN exists (SCR catalogue checks) | PENDING full invariant-to-screen mapping (50 screens SCR-UIC will include) |
| ADR → Implementation Constraint | SPECIFIED ADR-0001 src/lib/*.functions.ts location constraint (INFRASTRUCTURE_FOLDER docs/); ADR-0002 display_code route no URL; ADR-0003 Primary/Secondary types everywhere | SPECIFIED · 3 ADR constraints downstream in registry INFRA files newly added |

---

## 26. Approval

| Reviewer Role | Name | Signature | Date | Disposition Vote (PASS / BLOCKED / CONDITIONAL) |
|---|---|---|---|---|
| Principal QA Architect — G7 Overall Review Lead | _(pending Council assignment)_ | | | |
| Principal Security Architect — Security + Child-Data VETO Holder | _(pending)_ | | | |
| Chief Product Officer — Trust + Transparency | _(pending)_ | | | |
| Principal UX Architect — UX Component + Screen Review | _(pending)_ | | | |
| Principal Backend Architect — API + Data Review | _(pending)_ | | | |
| Principal DevOps Architect — Performance + Scalability | _(pending)_ | | | |
| Chief Enterprise Architect — Final Decision If Tied | _(pending)_ | | | |

**Approval Status v1.0 Sprint 3 Framework:** **UNSIGNED** — Framework only; Council review session required once OQ-02/05 resolved + AUD-IDN-2026-002 discharged to populate factual findings with implementation evidence or discharge-verified evidence from specs.

---

*Document created 9 Aug 2026 per Sprint 3 P1 G7-REVIEW-002 mandate. NO FINDINGS IN THIS DOCUMENT REPRESENT RUNTIME VERIFICATION — all statuses reflect SPECIFIED / NOT IMPLEMENTED / NOT VERIFIED state consistent with current G6 BLOCKED lifecycle position. No invented business policy values appear in this document; OQ-02 and OQ-05 remain OPEN throughout (cross-reference to S3-OQ-02-BRIEF and S3-OQ-05-BRIEF).*
