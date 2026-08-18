---
id: S3-OQ-02-BRIEF
title: Decision-Ready Briefing — OQ-02 L1 Guardian Verification Minimum Evidence Floor
stage: 2
gate: G2
status: OPEN
owner: EFPEC Council
decision_required: YES
implementation: BLOCKED until decision
derives_from: [IDN-PRD-001 §Open Questions, CONSENT-001 §Guardian Verification Levels, PRG-VIS-001 §10.1 Phase 0]
satisfied_by: NONE until Council Decision
adrs: []
north_star_impact: Guardian Verified is a component of VAP. Decision on evidence floor directly determines how many of 1,200 Phase 0 target guardians reach L1 and how many Players can progress from REGISTERED → VERIFIED lifecycle state, hence VAP reachability.
---

# OQ-02 Decision-Ready Briefing
## Guardian Verification Level L1 — Minimum Accepted Evidence Floor

---

## 1. Decision Context

Source: IDN-PRD-001 v1.0 §Open Questions — Council-Owned Business Policy.

Guardian Verification Levels (defined in CONSENT-001 APPROVED G0 6 Aug 2026):

| Level | Name | Basis | Unlocks |
|---|---|---|---|
| L0 | Unverified | Self-declared Person record | Nothing; no minor data readable |
| L1 | Contact-Verified | Phone number + Email contact verification + **ONE piece of relationship evidence** (floor = OQ-02 UNDECIDED) | P1 Identity, P2 Participation consents; access to own child's basic profile |
| L2 | Document-Verified | Official government-issued identity documents of Guardian + proof of legal guardianship | P3 Development, P4 Media, P6 Federation; unlocks AI-training eligibility (P8 requires L2 min) |
| L3 | Federation-Verified | Federation cross-check against Asprov/Askab official records | All applicable purposes; highest audit trust |

OQ-02 is the minimum evidence required to graduate a Guardian from L0 → L1. Without this decision, IDN-PRD-001 cannot be APPROVED at G2, which cascades to block G3–G5.

---

## 2. Child-Data Risk Analysis

The L1 floor trades child-data safety (fraudulent guardian claims = third party can access child PII + grant/withdraw consents on minor's behalf) against Phase 0 reachability (see §4 below).

Child-data risks if evidence floor is TOO LOW:
- **Impersonation:** A person unrelated to the child (ex-coach, ex-spouse, estranged relative, commercial data collector) attains L1 and:
  - Grants consent that exposes child data (P3 Development, P4 Media, P6 Federation)
  - Withholds legitimate consent (blocks child participation in SSB roster/competition entry)
  - Accesses journey history, assessment records, match attendance, development notes (all PII)
  - Transfers GuardianLink to a new GuardianLink holder using fraudulent authority
- **Audit trail corruption:** Record Authority ≠ Consent Authority (STK-INV-002) — a fraudulent L1 Guardian cannot mutate immutable assessments, but CAN grant/revoke consents that CONTROL what downstream systems can legally process. This creates audit-corruptible provenance without mutating records directly.
- **Secondary impact on VAP count:** If an attacker obtains L1 for a large batch of registrations, then P1/P2 consents are fraudulently granted → Players incorrectly appear as Guardian Verified → inflates VAP metrics artificially until detected.

Child-data risks if evidence floor is TOO HIGH:
- Legitimate primary-care guardians (especially in Phase 0 SSB grassroots settings — rural, low-formal-documentation households) cannot attain L1 → P1/P2 consents CANNOT be granted lawfully → children stuck in REGISTERED state indefinitely → NEVER_ACTIVE derived flag becomes normal case → VAP counts collapse well below 800 Phase 0 target.
- Constitutional Rule 0: Preventing child participation due to overly rigid documentation requirement indirectly harms the child (rule 0 override test: best outcome for child = ability to participate SAFELY).

---

## 3. Fraud Risk Analysis

Fraud dimensions considered:
1. **Document forgery:** Which options are easier to forge? (scale to 10 SSB sites, no forensic document examiners on Phase 0 SSB staff)
2. **Collusion risk:** Can SSB officials manufacture evidence for own relatives/players? (STK-INV-002 Guard: no officer may grant consent on behalf of a Person — but evidence submission sits upstream of that guard)
3. **Bulk attack:** Can an attacker submit 50 L1 claims from one phone/email? (rate-limiting is an upstream defense; the floor itself should have structural resistance)
4. **Post-verification fraud review regime:** Every floor option requires a post-attainment fraud review queue; a weaker floor demands a larger review queue SLA; this is a downstream operational cost not modelled in this brief.

---

## 4. Phase 0 Reachability Analysis — Target 1,200 Guardians

From PRG-VIS-001 rev.3 APPROVED G1 PASSED (6 Aug 2026) §10.1 Phase 0 Founding Network confirmed targets matrix:

| Stakeholder Type | Phase 0 Count |
|---|---|
| SSB Organizations | 10 |
| Coaches | 80 |
| Referees | 25 |
| Guardians | 1,200 |
| Players | 1,500 |
| VAP (North Star) | 800 |
| Province Coverage | 1 partial (Sulsel pilot extended) |

Guardian-to-Player ratio = 1,200 ÷ 1,500 = 0.80. This ratio deliberately reflects that multi-child households are the normal case (one Guardian covering multiple Players at the same SSB) — it is NOT a documentation-capability estimate.

**Reachability risk is structural in Phase 0 context:**
- Phase 0 SSB are grassroots. A high fraction of guardian households do not carry formal documents as a norm.
- Digital literacy is variable. Evidence submission methods must work over WhatsApp photo at minimum (approved Phase 0 channel — stated in PRG-VIS-001 §G1 evidence capture protocol).
- Any floor that requires physical visits to government offices to obtain fresh printouts will drop attainment sharply within Phase 0 3-month operational window.
- Any floor that requires sworn notary/official stamping outside SSB premises is incompatible with 1,200 target within the window.

Reachability impact is assessed WITHOUT selecting options; each option in §5 carries its own consequences description.

---

## 5. Option Analysis — CONSEQUENCES ONLY (No Recommendation)

Source options: PRD §OQ-02 enumerated 4. Each option described as: evidence type claimed → operational capture method → child-data risk profile → fraud risk profile → projected reachability impact against 1,200 guardians.

### Option 1: Family Card (KK / Kartu Keluarga)
Evidence: Photo/capture of page of Kartu Keluarga showing the guardian's name + the child Player's name + legal relationship field.
- Capture: Photo upload via WhatsApp/web capture at SSB premise during registration.
- Child-data risk: Lower per submission (government-issued document). However: KK forgeries are known obtainable at informal sector scale; KK not updated after divorce/separation — risk of non-custodial parent holding relationship.
- Fraud risk: Moderate — forgery possible; KK photo capture cannot be cross-checked against Dukcapil realtime in Phase 0 (no approved interface).
- Reachability: Medium — household KK ownership is high; BUT not all guardians carry KK at SSB registration, and not all households can produce it same-day.
- Tie-break position (per decision-rules.md priority): Safest for child data = good; Most auditable = moderate (paper trail but no digital verification); National scalability = high (nationally standard document); Federation integrable = high (KK format standard Asprov-wide); Consistency with FID SSOT = neutral.

### Option 2: Surat Keterangan Sekolah
Evidence: Official letter from Sekolah Dasar/Madrasah/SMP of the child, on school letterhead, signed by Head Master/Wali Kelas, stating that the named Guardian is listed as the child's parent/guardian in school records.
- Capture: Physical letter viewed and photo-captured by SSB official at SSB premise OR submitted by guardian via WhatsApp.
- Child-data risk: Medium — school records are written in good faith but relationship may be stale (e.g. guardian changed); school officials have no legal duty to verify custody.
- Fraud risk: Higher — letterhead creation is easier than KK forgery; collusion between parents and school staff possible at scale.
- Reachability: Higher — every child Player aged 6-12 in Phase 0 is in school; school letters obtainable within 1-3 school days at most schools (cultural norm in Sulsel pilot area).
- Tie-break position: National scalability = medium (every school is independent); Federation integrable = low (not standard data object); Safest = medium; Auditable = low; SSOT = neutral.

### Option 3: Surat Pernyataan RT / RW
Evidence: Letter of attestation from Ketua RT or Ketua RW (neighborhood official with statutory community role) stating that the Guardian is the known parent/guardian of the child, on RT/RW letterhead with stamp and signature.
- Capture: Physical letter viewed + photo captured.
- Child-data risk: Medium-High — RT/RW officials have no legal investigative authority; they attest to community reputation, not documentary proof of custody. Divorce/remarriage/kinship complexities can be missed.
- Fraud risk: Higher — RT/RW stamp is often informal; issuance standards vary wildly by neighborhood. Collusion with known RT officials is trivial in small communities.
- Reachability: Highest — RT/RW officials are accessible in every kelurahan; letter issuance is same-day or next-day as a standard community service; nearly 100% of Phase 0 households can produce this.
- Tie-break position: National scalability = high (RT/RW exist everywhere); Federation integrable = low/no; Safest = low; Auditable = low; SSOT = neutral.

### Option 4: Attestation 2 Parents + 1 SSB Official
Evidence: (a) Signed statement from Guardian claiming relationship, (b) co-signing second attestation by ONE additional parent/household adult (if available — single-parent households need workaround), (c) signed witnessed attestation of SSB Organization Admin (registered SSB staff member) stating they have met the guardian and the guardian is known to the SSB staff as the child's parent/guardian through personal introduction.
- Capture: In-person at SSB registration desk; three physical signatures on printed form + form photo capture.
- Child-data risk: Varies — SSB official personal knowledge is high at established SSB with long-standing roster, but LOW at newly-formed Phase 0 SSB where official has <1 month tenure. Cannot substitute for legal verification. "2 parents" requirement excludes single-parent households (17-30% of households in pilot areas per STK-001 stakeholder demographics).
- Fraud risk: High for new SSB — SSB official has personal incentive to approve registrations to meet roster/phase targets (conflict of interest). Collusion = inherent.
- Reachability: Medium-low — single-parent households need documented exemption; in-person requirement clashes with guardian work schedules; NOT all 10 SSB have established roster-knowledgeable staff.
- Tie-break position: National scalability = medium; Federation integrable = low; Safest = medium in long-tenure SSB, LOW in new SSB; Auditable = medium (tri-signature paper trail); SSOT = neutral.

**Decision Note:** Tie-break priority (decision-rules.md §11) requires: National Scalability > Federation Integrable > Safest for Child Data > Most Auditable > Most Consistent with FID SSOT. Council must apply this priority explicitly in their decision record and document the Rule 0 override analysis if any option risks child harm.

---

## 6. Decision Owner Identification

Per council.md §5 Roles + §24-28 Veto:

| Party | Role in Decision |
|---|---|
| **Principal Security Architect** | **MANDATORY VETO HOLDER** — any L1 evidence floor increases child-data risk; veto if compensating control absent (per council.md line 15). Must sign off on compensating post-fraud-review SLA for the selected option. |
| **Principal Grassroots Development Expert** | Must certify reachability compatibility with 1,200 Phase 0 target and SSB on-the-ground operational capacity. |
| **Chief Product Officer** | Owns PRD approval. Decision recorded in IDN-PRD-001 Decision Log. |
| **Principal Football Operations Expert** | Must certify eligibility/roster/competition downstream risk for options that may produce later guardianship disputes. |
| **Principal Domain Architect** | Ensures L1/L2/L3 state machine remains logically consistent with IDN-DMN-001 Verification Aggregate invariants. |
| **Chief Enterprise Architect** | Final decision if tie remains after decision-rules priority applied. Recorded in ADR if decision is architectural. |

---

## 7. Downstream Dependency Impact (EDEC Cascading Blocker)

| Artefact | Gate | Impact if OQ-02 Undecided Beyond Council Session Date |
|---|---|---|
| IDN-PRD-001 | G2 | **CANNOT BE APPROVED** — G2-06 "all business policy values DECIDED" fails (quality-gates.md G2 item). |
| IDN-DMN-001 (L1/L2/L3 VerificationPolicy VO values) | G3 | OQ-02 value is referenced as parameter. Does NOT block Domain Model structure correctness per registry note; but blocks parameter population in Implementation. |
| IDN-ERD-001 (evidence_type_code reference domain) | G3 | Evidence types are a logical reference domain; OQ-02 decision populates valid code values. Reference domain can be declared with empty set until decision (not blocking model structure). |
| IDN-API-001 C-17 SubmitVerificationEvidence request schema | G4 | Valid accepted_document_type enum is parameterized by OQ-02. Spec can declare "enum populated per Council policy value" — non-breaking change. |
| IDN-SCR-001 SCR-GRD-03 Guardian Evidence Upload | G7 | Screen Help Text, Accepted Document List, Evidence Guidance component = parameterized. Structure is not blocked; content is. |
| IDN-UIC-001 EvidenceGuidance.tsx component props | G5 | Policy-bound display props, not structural component props. |
| IDN-FE-001 §7 Forms / Evidence submission patterns | G6 | Implementation patterns can be designed generically; specific accepted list is parameter. |

None of G3/G4/G5 structural artefak correctness are blocked by OQ-02 if they treat OQ-02 as an injected parameter value. The only HARD GATE BLOCK is **G2 IDN-PRD-001 APPROVAL**. This is confirmed correct per lifecycle rules.

---

## 8. Decision Required Status

```yaml
STATUS: OPEN
OWNER: EFPEC Council (quorate session with Principal Security Architect present)
DECISION REQUIRED: YES
IMPLEMENTATION: BLOCKED (parameter cannot be defaulted; no invented business rule acceptable per Enterprise Refusal Protocol)
PRIORITY: P0 — Prerequisite to G2 IDN-PRD-001 APPROVAL → cascades all downstream gates
RECOMMENDED SESSION: Before AUD-IDN-2026-002 deep-dive review closes
DECISION FORMAT: Council Resolution document added to .lovable/plan referencing this brief with explicit option selected AND Rule 0 child-protection analysis recorded AND Principal Security Architect veto-discharge note
```

---

*Decision Briefing prepared 9 Aug 2026 per Sprint 3 S3-O2 Council Decision Readiness mandate. NO OPTION IS ENDORSED IN THIS DOCUMENT. This document is NOT a Council Decision. Council Decision is authoritative only when recorded per council.md escalation/veto procedure and referenced in updated IDN-PRD-001 Decision Log § with matching status = DECIDED.*
