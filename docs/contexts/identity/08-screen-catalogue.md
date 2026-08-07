---
id: IDN-SCR-001
title: Enterprise Screen Catalogue — Identity Domain
version: 1.0
status: IN_REVIEW
date: 2026-08-07
stage: 5
gate: G7
context_scope: [identity]
authors: [Enterprise UX Architecture Council]
derives_from:
  [PRG-VIS-001, PRG-STK-001, PRG-MET-001, CONSENT-001, IDN-PRD-001, IDN-DMN-001,
   IDN-CDM-001, IDN-EVT-001, IDN-JRN-001, IDN-ERD-001, IDN-API-001]
satisfied_by: [IDN-UIC-001, IDN-DS-001]
adrs: [ADR-0001, ADR-0002, ADR-0003]
north_star_impact: "Defines every surface through which a Verified Active Player is registered, verified, affiliated, consented for, and kept active — and forbids surfaces that would harm the child."
---

# IDN-SCR-001 — Enterprise Screen Catalogue, Identity Domain

> **Scope guard.** This artefact contains no React, TanStack, Vite, HTML, CSS,
> Tailwind, Figma JSON, mockup, wireframe, database design, new API, or new
> business rule. A Screen here is a **UX contract**: a named, traceable binding
> between a business journey, a set of API commands and queries, an
> authorization scope, a privacy classification, and an accessibility
> obligation. Visual design is deliberately absent and belongs to IDN-DS-001.

---

## PART 1 — Executive Summary

**Purpose.** The Screen Catalogue is the single authoritative list of every
surface the Identity bounded context exposes to a human being. It converts the
21 business journeys of IDN-JRN-001 and the 22 commands / 12 queries of
IDN-API-001 into named screens, so that UI component work, design-system work,
routing, and implementation all descend from one governed source instead of
from invention.

**Scope.** 50 screens across 7 application areas (PUBLIC, PLAYER, GUARDIAN,
ORGANIZATION, ASSOCIATION, FEDERATION, SYSTEM). Every screen carries a business
goal, a primary journey, related commands and queries, referenced components, an
authorization scope, a privacy classification, accessibility requirements,
responsive behaviour, and traceability.

**Out of scope.** Competition, Match, Training, Development, Scouting, Finance,
and Notification screens. Those contexts are blocked until Identity reaches G6.
Visual design, colour, typography, spacing, iconography, and motion are out of
scope — they are IDN-DS-001 concerns.

**Bounded context.** Identity. No screen defined here may create, rename, or
reinterpret player identity outside Identity (Constitution: Football ID First).

**Position in the artefact chain.**

```text
PRG-VIS-001 (why we exist)         ─┐
PRG-STK-001 (who is involved)      ─┤
IDN-PRD-001 (what is required)     ─┤
IDN-DMN-001 (what the domain is)   ─┼─► IDN-SCR-001 (what a human sees and can do)
IDN-CDM-001 (what things mean)     ─┤        │
IDN-EVT-001 (what happened)        ─┤        ├─► IDN-UIC-001 (components)
IDN-JRN-001 (how goals are reached)─┤        └─► IDN-DS-001 (design system)
IDN-ERD-001 (what is stored)       ─┤
IDN-API-001 (how any client asks)  ─┘
```

**Five catalogue commitments.**

1. **No orphan screen.** Every screen names a journey and a business goal.
2. **No invented capability.** A screen may only invoke commands and queries
   that already exist in IDN-API-001. If a screen appears to need a new one, the
   response is *Enterprise UX Council Decision Required*, never a new endpoint.
3. **The Journey is read-only everywhere.** No screen writes the Journey
   projection (EDEC-01, Constitution #8).
4. **Structural prohibition is structural.** Where STK-INV-004 forbids a
   capability, the screen does not exist. There is no disabled button, no
   greyed menu item, no "you do not have permission" path — the surface is
   absent.
5. **Rule 0 is visible.** Where a screen mediates a stakeholder conflict, the
   catalogue states the resolution that favours the child Player.

---

## PART 2 — Navigation Architecture

### 2.1 Public navigation

Available without a session. Contains exactly: Landing, Login, Register, Forgot
Password, and Legal & Consent Information. No directory, no search, no player
data, and no Football ID resolution is reachable here — Football ID Lookup is
authenticated, rate-limited, and audited (ADR-0002).

### 2.2 Authenticated navigation

One person, one account, many roles (Constitution #3). After authentication the
person lands on a **role-resolved home**. Where a person holds more than one
role (e.g. a Coach who is also a Guardian), navigation exposes a **role context
switcher**; it switches the visible area, never the identity. The Football ID
never changes with the role.

### 2.3 Role-based navigation

| Actor | Home screen | Areas reachable |
| --- | --- | --- |
| Player (adult) | SCR-PLY-01 | PLAYER |
| Player (minor) | SCR-PLY-01 (age-adapted) | PLAYER, reduced per CONSENT-001 |
| Guardian | SCR-GRD-01 | GUARDIAN, and read-only child views inside PLAYER |
| Coach | SCR-ORG-01 | ORGANIZATION (activity + directory subset) |
| Club Administrator | SCR-ORG-01 | ORGANIZATION |
| Verification Authority | SCR-ASC-01 | ASSOCIATION (verification subset) |
| Association Officer | SCR-ASC-01 | ASSOCIATION |
| Data Steward | SCR-ASC-01 | ASSOCIATION (merge subset) |
| Privacy Officer | SCR-FED-01 | FEDERATION (lifecycle + audit subset) |
| Child Protection Officer | SCR-FED-08 | FEDERATION (revocation review + audit) |
| Federation Officer | SCR-FED-01 | FEDERATION |

Areas not granted to an actor are **absent from navigation**, not disabled.

### 2.4 Dashboard navigation

Every area home is a dashboard composed of: an identity/context header, a
small set of state summaries, an action queue ("what needs you"), and shortcuts
to that area's screens. A dashboard never carries a command that is unavailable
elsewhere; it is an entry surface, not a privileged path.

### 2.5 Context navigation

Within a person-scoped area, screens share a persistent **person context**
(Football ID display code, lifecycle state, verification level). Within an
organization-scoped area, screens share an **organization context**. Switching
context resets the sub-navigation but never the session identity.

### 2.6 Deep link rules

1. Every screen except SYSTEM screens is directly addressable.
2. A deep link resolves references opaquely: `personRef`, `membershipRef`,
   `verificationRef`. No deep link may embed a name, a birth date, a region, or
   any decodable business fact (ADR-0002).
3. A deep link to a resource the actor may not see resolves to **SCR-SYS-02
   Access Denied**, never to a partial render and never to a message that
   confirms the resource exists.
4. A deep link to a resource that does not exist and a deep link to a resource
   the actor may not see are **indistinguishable** to the actor.
5. Deep links into a child's data are additionally consent-evaluated at open
   time, not only at navigation time.
6. Deep links to prohibited capabilities do not resolve because the screen does
   not exist (STK-INV-004).

### 2.7 Breadcrumb strategy

- Breadcrumbs appear on screens nested two levels or deeper below an area home.
- A breadcrumb label never discloses more than the destination screen would.
  Where a person is a minor, the breadcrumb uses the masked display form.
- Breadcrumbs are navigation, never state: they never carry unsaved input and
  never trigger a command.
- On mobile the breadcrumb collapses to a single "up one level" control with an
  accessible name naming the parent screen.

---

## PART 3 — Screen Catalogue

### PUBLIC (6)

| ID | Screen |
| --- | --- |
| SCR-PUB-01 | Landing |
| SCR-PUB-02 | Login |
| SCR-PUB-03 | Register |
| SCR-PUB-04 | Forgot Password / Access Recovery Entry |
| SCR-PUB-05 | Football ID Lookup (authenticated gate) |
| SCR-PUB-06 | Legal, Privacy & Consent Information |

### PLAYER (11)

| ID | Screen |
| --- | --- |
| SCR-PLY-01 | Player Dashboard |
| SCR-PLY-02 | Player Profile |
| SCR-PLY-03 | Football Identity |
| SCR-PLY-04 | Journey Timeline |
| SCR-PLY-05 | Membership |
| SCR-PLY-06 | Activities |
| SCR-PLY-07 | Consent |
| SCR-PLY-08 | Verification |
| SCR-PLY-09 | Notifications |
| SCR-PLY-10 | Settings |
| SCR-PLY-11 | Identity Recovery |

### GUARDIAN (7)

| ID | Screen |
| --- | --- |
| SCR-GRD-01 | Guardian Dashboard |
| SCR-GRD-02 | Linked Players |
| SCR-GRD-03 | Guardian Link Request |
| SCR-GRD-04 | Consent Management |
| SCR-GRD-05 | Guardian Verification |
| SCR-GRD-06 | Guardian Annotation |
| SCR-GRD-07 | Guardian Notifications |

### ORGANIZATION / CLUB (6)

| ID | Screen |
| --- | --- |
| SCR-ORG-01 | Organization Dashboard |
| SCR-ORG-02 | Player Directory |
| SCR-ORG-03 | Membership Management |
| SCR-ORG-04 | Transfer & Promotion Initiation |
| SCR-ORG-05 | Activity Management |
| SCR-ORG-06 | Verification Queue |

### ASSOCIATION (6)

| ID | Screen |
| --- | --- |
| SCR-ASC-01 | Association Dashboard |
| SCR-ASC-02 | Football ID Administration |
| SCR-ASC-03 | Verification Adjudication |
| SCR-ASC-04 | Membership Transfer Review |
| SCR-ASC-05 | Duplicate Resolution (Merge) |
| SCR-ASC-06 | Policy Monitoring |

### FEDERATION (8)

| ID | Screen |
| --- | --- |
| SCR-FED-01 | Federation Dashboard |
| SCR-FED-02 | National Directory & Record Lifecycle |
| SCR-FED-03 | Policy Administration |
| SCR-FED-04 | Analytics (VAP · NDI · JCS · CTI) |
| SCR-FED-05 | Audit |
| SCR-FED-06 | Search |
| SCR-FED-07 | Event Ledger |
| SCR-FED-08 | High-Risk Revocation Review |

### SYSTEM (6)

| ID | Screen |
| --- | --- |
| SCR-SYS-01 | Error |
| SCR-SYS-02 | Access Denied |
| SCR-SYS-03 | Maintenance |
| SCR-SYS-04 | Session Expired |
| SCR-SYS-05 | Offline |
| SCR-SYS-06 | Archived Record |

**Absent by design (STK-INV-004).** There is no scouting screen, no talent
shortlist, no under-13 discovery surface, no cross-club prospect browser, and no
export of a minor's profile for commercial evaluation. These are not disabled
screens; they are not in the catalogue at all.

---

## PART 4 — Screen Definition

Every row below is a complete screen contract. `ADR` column: 1 = ADR-0001,
2 = ADR-0002, 3 = ADR-0003.

### 4.1 PUBLIC

| ID | Name | Business Goal | Primary Actor | Supporting Actors | Entry Conditions | Exit Conditions | Primary Journey | Commands | Queries | Produced Events | Policies | ADR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCR-PUB-01 | Landing | Explain the platform and route a visitor to register or sign in | Visitor | — | No session | Visitor enters PUB-02 or PUB-03 | — (entry surface) | — | — | — | — | 1 |
| SCR-PUB-02 | Login | Authenticate a person into their single account | Person | — | No valid session | Session established, role-resolved home | JRN-17 (fallback) | — (authentication, not an Identity command) | — | `AuthenticationSucceeded` / `AuthenticationFailed` (auth surface) | AccessPolicy | 1 |
| SCR-PUB-03 | Register | Create a Person record and begin the identity lifecycle | Guardian / adult Player | Association Officer | No session; age self-declaration captured | Person `REGISTERED`; guardian path required when minor | JRN-01, JRN-02 | C-01 | — | `PersonRegistered` | RegistrationPolicy, AgePolicy | 2 |
| SCR-PUB-04 | Forgot Password / Access Recovery Entry | Begin lawful restoration of access without changing identity | Player / Guardian | Association Officer | Person claims an existing account | Recovery request raised; Football ID unchanged | JRN-17 | C-18 | — | `IdentityRecoveryRequested` | RecoveryPolicy | 2 |
| SCR-PUB-05 | Football ID Lookup | Confirm that a display code resolves to a valid identity, nothing more | Authenticated Officer / Club Administrator | Association Officer | Valid session; rate limit not exceeded | Validity confirmed or not; every attempt audited | JRN-06 (downstream use) | — | display-code lookup (IDN-API-001) | `FootballIdentityLookupPerformed` (audit) | LookupPolicy | 2 |
| SCR-PUB-06 | Legal, Privacy & Consent Information | Make the consent model, purposes P1–P8, and child protections understandable before anyone consents | Visitor / Guardian | Privacy Officer | None | Reader proceeds informed | JRN-07 (precondition) | — | Q-10 (published policy versions) | — | ConsentPolicy | — |

### 4.2 PLAYER

| ID | Name | Business Goal | Primary Actor | Supporting Actors | Entry Conditions | Exit Conditions | Primary Journey | Commands | Queries | Produced Events | Policies | ADR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCR-PLY-01 | Player Dashboard | Show the player their own standing and what needs their attention | Player | Guardian (for a minor) | Session; person is a Player | Player navigates to the acting screen | JRN-16 | — | Q-01, Q-03, Q-04, Q-07, Q-08 | — | ActivityPolicy | 2, 3 |
| SCR-PLY-02 | Player Profile | Present and maintain the person's own identity attributes | Player | Guardian | Session; self or guardian-linked | Profile accurate | JRN-01 | — (profile maintenance under C-01 contract) | Q-01, Q-05 | `PersonProfileUpdated` | DataMinimisationPolicy | 2 |
| SCR-PLY-03 | Football Identity | Give the player durable, portable proof of who they are in football | Player | Club Administrator | Football ID issued | Identity presented / shared under consent | JRN-06 | — | Q-01 | `FootballIdentityPresented` (audit) | LookupPolicy | 2 |
| SCR-PLY-04 | Journey Timeline | Show the player their whole football history, independent of any club | Player | Guardian, Coach | Session; journey projection available | Player understands their record | JRN-15, JRN-16 | — (**read-only**, EDEC-01) | Q-03, Q-12 | *(none — Journey never produces)* | ActivityPolicy | 3 |
| SCR-PLY-05 | Membership | Show which organization holds the Primary membership and which Secondaries exist | Player | Club Administrator | Session | Player understands affiliation and eligibility | JRN-10, JRN-13 | — (view side) | Q-04, Q-11 | — | MembershipPolicy, TransferPolicy | 3 |
| SCR-PLY-06 | Activities | Show attested football activity and how it feeds active status | Player | Coach | Session | Player sees counted vs. rejected activity | JRN-15, JRN-16 | — (view side) | Q-08 | — | ActivityPolicy | — |
| SCR-PLY-07 | Consent | Let an adult player govern their own purposes P1–P8 | Adult Player | Privacy Officer | Session; person is of age (CONSENT-001) | Consent state changed and effective immediately | JRN-07, JRN-08 | C-06, C-07 | Q-06, Q-10 | `ConsentGranted`, `ConsentRevoked` | ConsentPolicy | — |
| SCR-PLY-08 | Verification | Let the player request and follow verification of who they are | Player | Guardian, Verification Authority | Session | Verification requested / outcome understood | JRN-05 | C-08 | Q-07, Q-12 | `VerificationRequested` | VerificationPolicy (OQ-02 value) | 2 |
| SCR-PLY-09 | Notifications | Deliver events that require the player's awareness or action | Player | Guardian | Session | Notification read or acted upon | JRN-08, JRN-13, JRN-16 | — | Q-12 | `NotificationRead` | NotificationPolicy | — |
| SCR-PLY-10 | Settings | Control account, language, accessibility, and communication preferences | Player | Guardian | Session | Preferences saved | — (supporting) | — | Q-01 | `PreferencesUpdated` | AccessPolicy | — |
| SCR-PLY-11 | Identity Recovery | Restore access to the same Football ID after loss of credentials | Player / Guardian | Association Officer | Recovery request exists | Access restored; Football ID unchanged | JRN-17 | C-18 | Q-12 | `IdentityRecovered` | RecoveryPolicy | 2 |

### 4.3 GUARDIAN

| ID | Name | Business Goal | Primary Actor | Supporting Actors | Entry Conditions | Exit Conditions | Primary Journey | Commands | Queries | Produced Events | Policies | ADR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCR-GRD-01 | Guardian Dashboard | Show the guardian every child in their care and every decision awaiting them | Guardian | Child Protection Officer | Session; at least one guardian link | Guardian acts on the queue | JRN-03, JRN-07 | — | Q-05, Q-06, Q-07 | — | GuardianPolicy | — |
| SCR-GRD-02 | Linked Players | Manage the set of children a guardian is responsible for | Guardian | Association Officer | Session | Link set accurate | JRN-03, JRN-21 | C-04, C-05 | Q-05 | `GuardianReplaced`, `GuardianRemoved` | GuardianPolicy | — |
| SCR-GRD-03 | Guardian Link Request | Claim guardianship of a child so consent authority is lawful | Guardian | Verification Authority | Session; child person exists | Link claimed, pending verification | JRN-03 | C-03 | Q-05 | `GuardianLinkClaimed` | GuardianPolicy | — |
| SCR-GRD-04 | Consent Management | Let the guardian grant and withdraw purposes on behalf of a minor | Guardian | Privacy Officer, Child Protection Officer | Verified guardian link (level per CONSENT-001) | Purpose state changed, effective immediately | JRN-07, JRN-08, JRN-09 | C-06, C-07 | Q-06, Q-10 | `ConsentGranted`, `ConsentRevoked`, `HighRiskRevocationRaised` | ConsentPolicy | — |
| SCR-GRD-05 | Guardian Verification | Prove the guardian relationship to the required level | Guardian | Verification Authority | Link claimed | Link verified L1..L3 or rejected | JRN-04 | C-08 | Q-07 | `VerificationRequested` | VerificationPolicy (OQ-02 value) | — |
| SCR-GRD-06 | Guardian Annotation | Let the guardian attach their perspective to a record without altering it | Guardian | Data Steward | Verified guardian link | Annotation attached; underlying record unchanged (STK-INV-003) | JRN-04, JRN-18 | Guardian Annotation command (IDN-API-001) | Q-05, Q-12 | `GuardianAnnotationRecorded` | GuardianPolicy | — |
| SCR-GRD-07 | Guardian Notifications | Deliver child-affecting events to the responsible adult | Guardian | Child Protection Officer | Session | Notification read or acted upon | JRN-09, JRN-13 | — | Q-12 | `NotificationRead` | NotificationPolicy | — |

### 4.4 ORGANIZATION / CLUB

| ID | Name | Business Goal | Primary Actor | Supporting Actors | Entry Conditions | Exit Conditions | Primary Journey | Commands | Queries | Produced Events | Policies | ADR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCR-ORG-01 | Organization Dashboard | Show the club its membership standing and outstanding obligations | Club Administrator | Coach | Session; organization role | Administrator acts on the queue | JRN-10, JRN-16 | — | Q-04, Q-08, Q-11 | — | MembershipPolicy | 3 |
| SCR-ORG-02 | Player Directory | Let the club see only the players it is entitled to see | Club Administrator | Coach | Session; organization scope | Player record opened within entitlement | JRN-10 | — | Q-01, Q-02, Q-04 | `PlayerRecordViewed` (audit) | DataMinimisationPolicy | 3 |
| SCR-ORG-03 | Membership Management | Establish and end memberships correctly typed | Club Administrator | Association Officer | Session; organization scope | Exactly one ACTIVE Primary; Secondaries typed | JRN-10, JRN-11, JRN-12 | C-11, C-14, C-15 | Q-04, Q-11 | `MembershipCreated`, `SecondaryMembershipAdded`, `SecondaryMembershipRemoved` | MembershipPolicy | 3 |
| SCR-ORG-04 | Transfer & Promotion Initiation | Move a Primary membership with a complete trail | Club Administrator (receiving) | Association Officer, Guardian | Session; target person identified | Transfer requested; review raised | JRN-13, JRN-14 | C-12, C-13 | Q-04, Q-12 | `MembershipTransferRequested`, `MembershipPromotedToPrimary` | TransferPolicy | 3 |
| SCR-ORG-05 | Activity Management | Record attested football activity that determines active status | Coach | Club Administrator | Session; coach is affiliated | Activity recorded or rejected | JRN-15 | C-16 | Q-08 | `ActivityRecorded`, `ActivityRejected` | ActivityPolicy | — |
| SCR-ORG-06 | Verification Queue | Complete or reject verification requests the club is authorised to handle | Verification Authority (club-delegated) | Club Administrator | Session; delegated verification authority | Verification completed or rejected with reason | JRN-04, JRN-05 | C-09, C-10 | Q-07, Q-12 | `VerificationCompleted`, `VerificationRejected` | VerificationPolicy (OQ-02 value) | 2 |

### 4.5 ASSOCIATION

| ID | Name | Business Goal | Primary Actor | Supporting Actors | Entry Conditions | Exit Conditions | Primary Journey | Commands | Queries | Produced Events | Policies | ADR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCR-ASC-01 | Association Dashboard | Show the association its verification, transfer, and integrity workload | Association Officer | Verification Authority, Data Steward | Session; association role | Officer acts on the queue | JRN-04, JRN-13, JRN-18 | — | Q-07, Q-11, Q-12 | — | — | 3 |
| SCR-ASC-02 | Football ID Administration | Ensure every eligible verified person holds exactly one opaque, immutable Football ID | Association Officer | System | Person `VERIFIED`; no Football ID yet | Football ID issued, immutable | JRN-06 | C-02 | Q-01, Q-02 | `FootballIdentityIssued` | IdentityPolicy | 2 |
| SCR-ASC-03 | Verification Adjudication | Decide verification outcomes with an explainable trail | Verification Authority | Association Officer, Guardian | Verification pending | Outcome recorded with reason and level | JRN-04, JRN-05, JRN-21 | C-09, C-10, C-04 | Q-07, Q-05, Q-12 | `VerificationCompleted`, `VerificationRejected`, `GuardianReplaced` | VerificationPolicy (OQ-02 value), GuardianPolicy | 2 |
| SCR-ASC-04 | Membership Transfer Review | Approve or refuse a Primary transfer, protecting the child's continuity | Association Officer | Club Administrator, Guardian | Transfer requested | Transfer approved or refused; trail complete | JRN-13, JRN-14 | C-12 | Q-04, Q-12 | `MembershipTransferred`, `MembershipTransferRefused` | TransferPolicy | 3 |
| SCR-ASC-05 | Duplicate Resolution (Merge) | Guarantee that one human being holds one identity, without losing history | Data Steward | Association Officer, Guardian | Duplicate candidate raised | Single surviving identity; history preserved | JRN-18 | C-17 | Q-01, Q-02, Q-12 | `IdentityMerged` | IdentityPolicy | 2 |
| SCR-ASC-06 | Policy Monitoring | Show which policy version governed which outcome | Association Officer | Privacy Officer | Session | Officer can explain any decision | JRN-16, JRN-09 | — | Q-10, Q-12 | — | all versioned policies | — |

### 4.6 FEDERATION

| ID | Name | Business Goal | Primary Actor | Supporting Actors | Entry Conditions | Exit Conditions | Primary Journey | Commands | Queries | Produced Events | Policies | ADR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCR-FED-01 | Federation Dashboard | Show national identity health against the North Star | Federation Officer | Privacy Officer | Session; federation role | Officer navigates to the relevant instrument | JRN-16 | — | Q-10, Q-11 | — | ActivityPolicy | — |
| SCR-FED-02 | National Directory & Record Lifecycle | Maintain the lawful lifecycle state of records nationally | Privacy Officer | Federation Officer, Data Steward | Session; lifecycle authority | Record archived or restored; same Football ID | JRN-19, JRN-20 | C-19, C-20 | Q-01, Q-02 | `IdentityArchived`, `IdentityRestored` | RetentionPolicy | 2 |
| SCR-FED-03 | Policy Administration | Govern the versioned policies the whole domain obeys | Federation Officer | Privacy Officer, Child Protection Officer | Session; policy authority | Policy version activated or retired | JRN-16 | C-21, C-22 | Q-10 | `PolicyVersionActivated`, `PolicyVersionRetired` | all versioned policies | — |
| SCR-FED-04 | Analytics | Report VAP, NDI, JCS, CTI with the policy version used | Federation Officer | Association Representative | Session; analytics scope | Figures read with `policy_id@version` | JRN-16 | — | Q-10, aggregate projections | — | ActivityPolicy, ConsentPolicy | — |
| SCR-FED-05 | Audit | Prove who did what, when, and under which authority | Privacy Officer | Federation Officer, Council | Session; audit scope | Question answered from the record | JRN-09, JRN-18, JRN-19 | — | Q-09, Q-12 | `AuditQueried` (audit) | RetentionPolicy | — |
| SCR-FED-06 | Search | Find a person nationally within entitlement | Federation Officer | Association Officer | Session; national scope | Record opened within entitlement | JRN-18 | — | Q-02 | `PersonSearchPerformed` (audit) | DataMinimisationPolicy | 2 |
| SCR-FED-07 | Event Ledger | Give the Council and auditors a read-only view of domain facts | Federation Officer | Council, Auditor | Session; ledger scope | Ledger read | — (governance surface) | — | governed event read (IDN-API-001) | — | — | — |
| SCR-FED-08 | High-Risk Revocation Review | Stop downstream use of a child's data immediately and review it | Child Protection Officer | Privacy Officer, Guardian | High-risk revocation raised | Downstream use stopped; review closed | JRN-09 | C-07 (effect review) | Q-06, Q-12 | `HighRiskRevocationReviewed` | ConsentPolicy | — |

### 4.7 SYSTEM

| ID | Name | Business Goal | Primary Actor | Entry Conditions | Exit Conditions | Primary Journey | Commands | Queries |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCR-SYS-01 | Error | Tell the actor that the request failed and how to proceed, without leaking internals | Any | Unhandled failure | Retry or return to a safe screen | — (cross-cutting) | — | — |
| SCR-SYS-02 | Access Denied | Refuse without confirming the existence of the resource | Any | Authorization refusal | Actor returns to their own area | — | — | — |
| SCR-SYS-03 | Maintenance | Communicate planned unavailability | Any | Maintenance window | Actor retries after the window | — | — | — |
| SCR-SYS-04 | Session Expired | End a stale session safely and offer re-authentication | Any | Session invalid | Re-authenticated, returned to the intended screen | JRN-17 (fallback) | — | — |
| SCR-SYS-05 | Offline | Keep the actor oriented with no connectivity | Any | Network unavailable | Connectivity restored; queued reads replayed | — | — | — |
| SCR-SYS-06 | Archived Record | Explain that a record is archived and what may lawfully be done | Privacy Officer / Any entitled actor | Record `ARCHIVED` | Restore requested or actor exits | JRN-19, JRN-20 | C-20 (entitled actors only) | Q-01 |

---

## PART 5 — Screen Layout Structure

Structural regions only. `—` means the region is absent on that screen.

| Screen | Header | Navigation | Sidebar | Toolbar | Main Content | Detail Panel | Action Panel | Footer |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCR-PUB-01 | Brand + sign-in entry | Public | — | — | Value proposition sections | — | Register / Login | Legal links |
| SCR-PUB-02 | Brand | Public | — | — | Credential form | — | Submit, recover | Legal links |
| SCR-PUB-03 | Brand | Public | — | Step indicator | Registration wizard | Guidance for the current step | Continue / back | Legal links |
| SCR-PUB-04 | Brand | Public | — | — | Recovery request form | — | Submit | Legal links |
| SCR-PUB-05 | Person context (actor) | Authenticated | Area | Rate-limit notice | Lookup field + validity result | — | Lookup | — |
| SCR-PUB-06 | Brand | Public | Section index | — | Policy narrative, purposes P1–P8 | — | — | Legal links |
| SCR-PLY-01 | Person context | Authenticated | Player area | — | Status summary + action queue | — | Shortcuts | Support |
| SCR-PLY-02 | Person context | Authenticated | Player area | Edit control | Attribute groups | Field provenance | Save / cancel | Support |
| SCR-PLY-03 | Person context | Authenticated | Player area | Share control | Identity card + display code | Issuance metadata | Share under consent | Support |
| SCR-PLY-04 | Person context | Authenticated | Player area | Range + type filter | Chronological timeline | Entry detail (read-only) | — (read-only) | Support |
| SCR-PLY-05 | Person context | Authenticated | Player area | Type filter | Primary block + Secondary list | Membership detail | — (view side) | Support |
| SCR-PLY-06 | Person context | Authenticated | Player area | Period filter | Activity list + counting explanation | Activity detail | — | Support |
| SCR-PLY-07 | Person context | Authenticated | Player area | Purpose filter | Purpose list P1–P8 with state | Purpose explanation + history | Grant / revoke | Support |
| SCR-PLY-08 | Person context | Authenticated | Player area | — | Verification status + evidence requirements | Decision reason | Request verification | Support |
| SCR-PLY-09 | Person context | Authenticated | Player area | Read/unread filter | Notification list | Notification detail | Mark read | Support |
| SCR-PLY-10 | Person context | Authenticated | Player area | — | Preference groups | — | Save | Support |
| SCR-PLY-11 | Person context (limited) | Recovery | — | Step indicator | Recovery wizard | Guidance | Continue | Support |
| SCR-GRD-01 | Guardian context | Authenticated | Guardian area | — | Children summary + decision queue | — | Shortcuts | Support |
| SCR-GRD-02 | Guardian context | Authenticated | Guardian area | Search | Linked child list | Link detail + verification level | Replace / remove | Support |
| SCR-GRD-03 | Guardian context | Authenticated | Guardian area | Step indicator | Link claim wizard | Evidence guidance | Submit claim | Support |
| SCR-GRD-04 | Child context (masked) | Authenticated | Guardian area | Child selector | Purpose list per child | Purpose explanation + consequences | Grant / revoke | Support |
| SCR-GRD-05 | Guardian context | Authenticated | Guardian area | — | Verification status + evidence | Decision reason | Submit evidence | Support |
| SCR-GRD-06 | Child context (masked) | Authenticated | Guardian area | — | Existing record (read-only) + annotation composer | Annotation history | Attach annotation | Support |
| SCR-GRD-07 | Guardian context | Authenticated | Guardian area | Filter | Notification list | Notification detail | Mark read | Support |
| SCR-ORG-01 | Organization context | Authenticated | Organization area | — | Membership + activity summary, obligations | — | Shortcuts | Support |
| SCR-ORG-02 | Organization context | Authenticated | Organization area | Search + filter | Entitled player table | Player summary (minimised) | Open record | Support |
| SCR-ORG-03 | Organization context | Authenticated | Organization area | Type filter | Primary + Secondary membership tables | Membership detail | Create / end membership | Support |
| SCR-ORG-04 | Organization context | Authenticated | Organization area | Step indicator | Transfer wizard | Eligibility + consequence explanation | Request transfer / promote | Support |
| SCR-ORG-05 | Organization context | Authenticated | Organization area | Session/date selector | Attendance + activity entry | Activity detail | Record activity | Support |
| SCR-ORG-06 | Organization context | Authenticated | Organization area | Queue filter | Verification request queue | Evidence + decision form | Complete / reject | Support |
| SCR-ASC-01 | Association context | Authenticated | Association area | — | Workload summary | — | Shortcuts | Support |
| SCR-ASC-02 | Association context | Authenticated | Association area | Search | Issuance queue | Person eligibility detail | Issue Football ID | Support |
| SCR-ASC-03 | Association context | Authenticated | Association area | Queue filter | Adjudication queue | Evidence, level, reason | Complete / reject | Support |
| SCR-ASC-04 | Association context | Authenticated | Association area | Queue filter | Transfer review queue | Transfer trail + child impact | Approve / refuse | Support |
| SCR-ASC-05 | Association context | Authenticated | Association area | Candidate filter | Duplicate candidate pairs | Side-by-side comparison | Merge / dismiss | Support |
| SCR-ASC-06 | Association context | Authenticated | Association area | Policy selector | Policy version list + effect | Version detail | — (read-only) | Support |
| SCR-FED-01 | Federation context | Authenticated | Federation area | — | National indicators | — | Shortcuts | Support |
| SCR-FED-02 | Federation context | Authenticated | Federation area | Search + lifecycle filter | National record table | Record lifecycle detail | Archive / restore | Support |
| SCR-FED-03 | Federation context | Authenticated | Federation area | Policy type selector | Version table | Version detail + impact | Activate / retire | Support |
| SCR-FED-04 | Federation context | Authenticated | Federation area | Period + scope filter | VAP / NDI / JCS / CTI panels | Metric definition + policy version | Export (aggregate only) | Support |
| SCR-FED-05 | Federation context | Authenticated | Federation area | Range + actor filter | Audit entry list | Entry detail | — (read-only) | Support |
| SCR-FED-06 | Federation context | Authenticated | Federation area | Search + scope filter | Result list (minimised) | Result summary | Open record | Support |
| SCR-FED-07 | Federation context | Authenticated | Federation area | Family + range filter | Event ledger list | Event detail | — (read-only) | Support |
| SCR-FED-08 | Child protection context | Authenticated | Federation area | Severity filter | Revocation review queue | Downstream-use impact | Confirm stop / close review | Support |
| SCR-SYS-01..06 | Minimal brand | Contextual return only | — | — | Explanation + next step | — | Retry / return / re-authenticate | Legal links |

---

## PART 6 — Component Composition

Components are **referenced only**; their definition belongs to IDN-UIC-001.

| Screen | Components |
| --- | --- |
| SCR-PUB-01 | Card, Badge, Status Banner, Empty State (no-session) |
| SCR-PUB-02 | Form, Status Banner, Dialog (recovery entry) |
| SCR-PUB-03 | Wizard, Form, Status Banner, Dialog (age-gate consequence) |
| SCR-PUB-04 | Form, Status Banner |
| SCR-PUB-05 | Search, Badge, Status Banner (rate limit), Empty State |
| SCR-PUB-06 | Card, Badge, Timeline (policy versions) |
| SCR-PLY-01 | Card, Badge, Avatar, Timeline (recent), Empty State, Status Banner |
| SCR-PLY-02 | Form, Card, Avatar, Badge, Masked Field, Dialog |
| SCR-PLY-03 | QR Card, Badge, Card, Dialog (share consent) |
| SCR-PLY-04 | Timeline, Filter, Card, Badge, Empty State |
| SCR-PLY-05 | Card, Badge, Table, Status Banner (eligibility) |
| SCR-PLY-06 | Table, Filter, Badge, Empty State, Card (counting explanation) |
| SCR-PLY-07 | Card, Toggle-style Consent Control, Badge, Dialog (confirm revoke), Status Banner |
| SCR-PLY-08 | Card, Badge, Status Banner, Form (request), Empty State |
| SCR-PLY-09 | Table, Badge, Filter, Empty State |
| SCR-PLY-10 | Form, Card |
| SCR-PLY-11 | Wizard, Form, Status Banner |
| SCR-GRD-01 | Card, Avatar, Badge, Empty State, Status Banner |
| SCR-GRD-02 | Table, Avatar, Badge, Masked Field, Dialog, Search |
| SCR-GRD-03 | Wizard, Form, Status Banner |
| SCR-GRD-04 | Card, Consent Control, Badge, Dialog, Status Banner, Masked Field |
| SCR-GRD-05 | Form, Card, Badge, Status Banner |
| SCR-GRD-06 | Card (read-only record), Form (annotation), Timeline (annotations), Badge |
| SCR-GRD-07 | Table, Badge, Filter, Empty State |
| SCR-ORG-01 | Card, Badge, Table, Empty State |
| SCR-ORG-02 | Table, Search, Filter, Avatar, Masked Field, Badge, Empty State |
| SCR-ORG-03 | Table, Badge, Dialog, Form, Status Banner |
| SCR-ORG-04 | Wizard, Form, Dialog, Status Banner, Badge |
| SCR-ORG-05 | Table, Form, Filter, Badge, Empty State |
| SCR-ORG-06 | Table, Filter, Card (evidence), Form (decision), Dialog, Badge |
| SCR-ASC-01 | Card, Badge, Table, Empty State |
| SCR-ASC-02 | Table, Search, Badge, Dialog, QR Card (preview) |
| SCR-ASC-03 | Table, Filter, Card, Form, Dialog, Badge, Timeline (decision trail) |
| SCR-ASC-04 | Table, Filter, Card, Dialog, Timeline (transfer trail), Status Banner |
| SCR-ASC-05 | Table, Comparison Card, Dialog, Status Banner, Badge |
| SCR-ASC-06 | Table, Filter, Badge, Card |
| SCR-FED-01 | Card, Badge, Chart-free Metric Panel |
| SCR-FED-02 | Table, Search, Filter, Dialog, Badge, Status Banner |
| SCR-FED-03 | Table, Form, Dialog, Badge, Status Banner |
| SCR-FED-04 | Metric Panel, Filter, Card, Badge |
| SCR-FED-05 | Table, Filter, Card, Empty State |
| SCR-FED-06 | Search, Filter, Table, Masked Field, Empty State |
| SCR-FED-07 | Table, Filter, Card, Empty State |
| SCR-FED-08 | Table, Filter, Card, Dialog, Status Banner, Badge |
| SCR-SYS-01..06 | Status Banner, Card, Empty State |

---

## PART 7 — Interaction Summary

| Screen | Primary Actions | Secondary Actions | Confirmation Required | Cancellation Rules | Recovery Behaviour | Read-only Areas |
| --- | --- | --- | --- | --- | --- | --- |
| SCR-PUB-02 | Sign in | Recover access | No | Leaving abandons input | Failed attempt preserves the identifier, never the secret | — |
| SCR-PUB-03 | Complete registration | Save-and-continue per step | Yes — age declaration and guardian requirement | Cancel discards the whole wizard after explicit confirmation | Step state restored on return | Declared-age consequences |
| SCR-PUB-05 | Look up a display code | — | No | — | Rate-limit notice with wait guidance | Result (validity only) |
| SCR-PLY-02 | Save profile changes | Cancel | Yes — when changing a verified attribute | Cancel restores last saved values | Unsaved-change warning before navigation | Football ID, verification level, issuance metadata |
| SCR-PLY-03 | Share identity | Regenerate presentation | Yes — sharing invokes a consent check | — | Share failure leaves nothing shared | Football ID and display code (immutable, ADR-0002) |
| SCR-PLY-04 | — | Filter, open entry | No | — | Retry load | **Entire screen** (EDEC-01) |
| SCR-PLY-07 | Grant purpose, revoke purpose | View history | Yes — every revoke, with consequence stated | Cancel leaves state unchanged | Revocation is effective immediately; failure is reported, never silently retried | Purpose definitions, policy version |
| SCR-PLY-08 | Request verification | Withdraw request | Yes — submitting evidence | Withdraw before adjudication | Rejected request explains what is missing | Decision reason, level |
| SCR-GRD-02 | Replace guardian, remove guardian | Search | Yes — both, with child-impact statement | Cancel leaves the link set unchanged | Failed change leaves prior link intact | Verification level, child identity attributes |
| SCR-GRD-04 | Grant, revoke | Compare purposes | Yes — every action on a minor's data | Cancel leaves state unchanged | High-risk revocation raises a review automatically | Purpose definitions, child Football ID |
| SCR-GRD-06 | Attach annotation | View annotation history | Yes — annotation is permanent | Cancel discards the draft | Draft preserved on failure | **The underlying record** (STK-INV-003) |
| SCR-ORG-03 | Create membership, end secondary | Filter | Yes — anything affecting Primary | Cancel leaves membership unchanged | Conflicting Primary is refused with the reason | Player identity attributes |
| SCR-ORG-04 | Request transfer, promote secondary | Save draft | Yes — with continuity and eligibility consequences shown | Cancel before submission only | Refusal states the reason and the appeal path | Eligibility computation |
| SCR-ORG-05 | Record activity | Correct a draft entry | Yes — submission is attestation | Cancel discards unsubmitted entries | Rejected activity states why it does not count | Counting rule, policy version |
| SCR-ORG-06 | Complete verification, reject | Request more evidence | Yes — both outcomes | Cancel leaves the request pending | Decision failure keeps the request in queue | Evidence provenance |
| SCR-ASC-02 | Issue Football ID | — | Yes — issuance is irreversible | Cancel before issuance only | Failure leaves the person without an ID and in queue | Issued Football ID (immutable) |
| SCR-ASC-04 | Approve transfer, refuse transfer | Request clarification | Yes — both, with child-impact statement | Cancel leaves the request pending | Refusal is recorded with reason | Transfer trail |
| SCR-ASC-05 | Merge identities, dismiss candidate | Compare | Yes — merge is irreversible in effect | Cancel leaves both records | Merge failure leaves both records untouched | Surviving Football ID |
| SCR-FED-02 | Archive record, restore record | Search | Yes — both, with retention consequence | Cancel leaves lifecycle unchanged | Failure leaves the prior state | Football ID (unchanged across archive/restore) |
| SCR-FED-03 | Activate version, retire version | Compare versions | Yes — activation changes domain-wide behaviour | Cancel leaves the active version | Failure leaves the prior version active | Historical versions |
| SCR-FED-05 / 07 | — | Filter, open entry | No | — | Retry load | **Entire screen** |
| SCR-FED-08 | Confirm downstream stop, close review | Escalate | Yes — closing a review | Cannot cancel the stop; it is already in effect | Stop is immediate and independent of review completion | Revocation record |
| SCR-SYS-01..06 | Retry, return, re-authenticate | — | No | — | Returns the actor to a safe screen | Explanation text |

Screens not listed carry read, filter, and navigate interactions only.

---

## PART 8 — Data Dependency

| Screen | Required Queries | Required Commands | Required Projections | Required Reference Data |
| --- | --- | --- | --- | --- |
| SCR-PUB-03 | — | C-01 | — | Age bands, guardian requirement, consent purposes |
| SCR-PUB-04 | — | C-18 | — | Recovery evidence types |
| SCR-PUB-05 | display-code lookup | — | Identity validity projection | Lookup rate-limit policy |
| SCR-PUB-06 | Q-10 | — | — | Purposes P1–P8, policy versions |
| SCR-PLY-01 | Q-01, Q-03, Q-04, Q-07, Q-08 | — | Journey, Activity status | Lifecycle states, ActivityPolicy version |
| SCR-PLY-02 | Q-01, Q-05 | — | Person profile | Attribute catalogue, sensitivity classes |
| SCR-PLY-03 | Q-01 | — | Football identity | Display-code format (ADR-0002) |
| SCR-PLY-04 | Q-03, Q-12 | — | **Journey read model**, Decision history | Event families |
| SCR-PLY-05 | Q-04, Q-11 | — | Membership | Organization reference, membership types (ADR-0003) |
| SCR-PLY-06 | Q-08 | — | Activity | ActivityPolicy thresholds |
| SCR-PLY-07 | Q-06, Q-10 | C-06, C-07 | Consent state | Purposes P1–P8, ConsentPolicy version |
| SCR-PLY-08 | Q-07, Q-12 | C-08 | Verification | Verification levels L0–L3, evidence types |
| SCR-PLY-09 | Q-12 | — | Notification | Notification categories |
| SCR-PLY-11 | Q-12 | C-18 | Recovery | Recovery evidence types |
| SCR-GRD-01 | Q-05, Q-06, Q-07 | — | Guardian links, Consent, Verification | Guardian levels |
| SCR-GRD-02 | Q-05 | C-04, C-05 | Guardian links | Guardian relationship types |
| SCR-GRD-03 | Q-05 | C-03 | Guardian links | Evidence types |
| SCR-GRD-04 | Q-06, Q-10 | C-06, C-07 | Consent state | Purposes P1–P8, high-risk classification |
| SCR-GRD-05 | Q-07 | C-08 | Verification | Levels L1–L3 |
| SCR-GRD-06 | Q-05, Q-12 | Guardian Annotation command | Annotation history | Annotation types |
| SCR-ORG-01 | Q-04, Q-08, Q-11 | — | Membership, Activity | Organization reference |
| SCR-ORG-02 | Q-01, Q-02, Q-04 | — | Entitled person list | Organization scope, minimisation rules |
| SCR-ORG-03 | Q-04, Q-11 | C-11, C-14, C-15 | Membership | Membership types (ADR-0003) |
| SCR-ORG-04 | Q-04, Q-12 | C-12, C-13 | Membership, Decision | TransferPolicy, eligibility rules |
| SCR-ORG-05 | Q-08 | C-16 | Activity | Activity types, ActivityPolicy |
| SCR-ORG-06 | Q-07, Q-12 | C-09, C-10 | Verification queue | Evidence types, levels |
| SCR-ASC-01 | Q-07, Q-11, Q-12 | — | Workload queues | Association scope |
| SCR-ASC-02 | Q-01, Q-02 | C-02 | Issuance queue | Issuance eligibility |
| SCR-ASC-03 | Q-05, Q-07, Q-12 | C-04, C-09, C-10 | Verification, Guardian | Evidence types, levels |
| SCR-ASC-04 | Q-04, Q-12 | C-12 | Membership, Decision | TransferPolicy |
| SCR-ASC-05 | Q-01, Q-02, Q-12 | C-17 | Duplicate candidates | Match criteria |
| SCR-ASC-06 | Q-10, Q-12 | — | Policy application | All policy versions |
| SCR-FED-01 | Q-10, Q-11 | — | National aggregates | Phase targets (PRG-VIS-001) |
| SCR-FED-02 | Q-01, Q-02 | C-19, C-20 | National record list | Lifecycle states, RetentionPolicy |
| SCR-FED-03 | Q-10 | C-21, C-22 | Policy versions | Policy types |
| SCR-FED-04 | Q-10 + aggregate projections | — | VAP, NDI, JCS, CTI | Metric definitions (PRG-MET-001, PRG-VIS-001) |
| SCR-FED-05 | Q-09, Q-12 | — | Audit | Audit categories |
| SCR-FED-06 | Q-02 | — | Search projection | National scope rules |
| SCR-FED-07 | governed event read | — | Event ledger | Event families (IDN-EVT-001) |
| SCR-FED-08 | Q-06, Q-12 | C-07 (effect review) | Consent, Decision | High-risk classification |
| SCR-SYS-06 | Q-01 | C-20 | Lifecycle state | Retention schedule |

---

## PART 9 — Authorization Matrix

Actor → visible screens → allowed actions. This is a UX visibility contract, not
an RBAC implementation; enforcement is IDN-API-001 and IDN-ERD-001.

| Actor | Visible Screens | Allowed Actions |
| --- | --- | --- |
| Visitor | PUB-01..04, PUB-06, SYS-01/03/05 | Register, sign in, request recovery, read policy |
| Player (adult) | PLY-01..11, PUB-05, PUB-06, SYS-* | Maintain own profile, request verification, grant/revoke own consent, present identity, read own journey |
| Player (minor) | PLY-01..06, PLY-08 (view), PLY-09, PLY-10, SYS-* | Read own record in age-appropriate form; **no consent command** (authority is the guardian's, CONSENT-001) |
| Guardian | GRD-01..07, PLY-01..09 (as child, masked), SYS-* | Claim/replace/remove links, grant/revoke child consent, submit evidence, attach annotations |
| Coach | ORG-01, ORG-02 (own squad subset), ORG-05, SYS-* | Record activity, read entitled players |
| Club Administrator | ORG-01..06, PUB-05, SYS-* | Create/end memberships, request transfers, promote secondary, read entitled players |
| Verification Authority | ORG-06, ASC-01, ASC-03, SYS-* | Complete/reject verification, set level |
| Association Officer | ASC-01..06, PUB-05, SYS-* | Issue Football ID, review transfers, replace guardian, read policy application |
| Data Steward | ASC-01, ASC-05, SYS-* | Merge identities, dismiss duplicate candidates |
| Privacy Officer | FED-01, FED-02, FED-05, ASC-06, SYS-06 | Archive/restore records, read audit |
| Child Protection Officer | FED-08, FED-05, GRD-04 (review view), SYS-* | Confirm downstream stop, close revocation review, escalate |
| Federation Officer | FED-01..07, SYS-* | Activate/retire policy, read national directory, analytics, audit, ledger |

**Absent for every actor:** any scouting, shortlist, prospect-discovery, or
commercial-evaluation screen for a person under 13 (STK-INV-004).

**Rule 0 resolutions recorded here.** Where a club's interest in continuity
conflicts with a child's interest in moving (ASC-04), where a guardian's consent
preference conflicts with a child's protection (GRD-04, FED-08), and where an
association's throughput conflicts with evidence quality (ASC-03), the screen
presents the child-protective option as the default path and records the
trade-off in the decision trail.

---

## PART 10 — Privacy & Child Protection

| Screen | Personal Data Exposure | Child Data Exposure | Consent Requirement | Masking Rules | Visibility Rules |
| --- | --- | --- | --- | --- | --- |
| SCR-PUB-01/06 | None | None | None | — | Public |
| SCR-PUB-02/04 | Identifier only | None | None | Secret never echoed | Public |
| SCR-PUB-03 | Self-declared attributes | Declared age band only | Guardian consent required before a minor record proceeds | Nothing rendered back beyond what the actor typed | Public |
| SCR-PUB-05 | None beyond validity | None | None (validity only) | No name, no attributes, ever | Authenticated, rate-limited, audited |
| SCR-PLY-01..06 | Own data, full | Own data, age-appropriate presentation | None for self-view | Guardian contact partially masked | Self only, or verified guardian |
| SCR-PLY-03 | Football ID display code | Same | Consent required to share externally | Display code hidden until deliberately revealed | Self, guardian, entitled officer |
| SCR-PLY-07 / GRD-04 | Consent state | Purposes affecting the child | This is the consent surface itself | Purpose consequences stated in plain language | Consent authority only (CONSENT-001) |
| SCR-PLY-08 / GRD-05 | Evidence metadata | Evidence about a minor | Evidence authority ≠ consent authority (STK-INV-002) | Evidence content never rendered to non-authorities | Requester and verification authority |
| SCR-GRD-02/06 | Child identity subset | Yes | Verified link required | Child display code masked by default | Verified guardian only |
| SCR-ORG-02 | Minimised player subset | Yes, minimised | Membership entitlement, not consent, governs the subset | Birth date reduced to age band; contact hidden | Entitled organization scope only |
| SCR-ORG-05 | Attendance and activity | Yes | Activity recording is a membership obligation, not a consent purpose | No commentary fields on minors beyond attestation | Affiliated coach only |
| SCR-ORG-06 / ASC-03 | Evidence | Yes | Evidence authority | Evidence viewable only during adjudication, audited | Verification authority only |
| SCR-ASC-02/04/05 | Identity attributes | Yes | Officer entitlement | Comparison views mask non-decisive attributes | Association scope only |
| SCR-FED-02/06 | Identity attributes | Yes | Officer entitlement | Default masked; unmasking is an audited action | National scope only |
| SCR-FED-04 | None (aggregate) | None | None | Small-cohort suppression | Analytics scope |
| SCR-FED-05/07 | Actor and action metadata | References only | None | Payload content not rendered | Audit scope |
| SCR-FED-08 | Consent and downstream-use records | Yes | Immediate effect precedes review | Downstream consumers named, child attributes not re-exposed | Child Protection Officer only |
| SCR-SYS-* | None | None | None | Never restate the requested resource | Any |

**Standing rules.** (a) Data minimisation by capability — a screen renders only
what its capability requires (STK-INV-001). (b) Consent authority is never
inferred from evidence authority (STK-INV-002). (c) A guardian annotation
attaches and never mutates (STK-INV-003). (d) Where a capability is forbidden,
the screen is absent (STK-INV-004). (e) Revocation takes effect on the surface
immediately, before any review completes.

---

## PART 11 — Accessibility Requirements

Baseline for **every** screen (WCAG 2.2 AA):

- Full keyboard operation; no pointer-only action; visible focus on every
  interactive element; no keyboard trap.
- One `main` landmark per screen; correct heading order without skipped levels.
- Accessible name on every control, including icon-only controls.
- Text contrast ≥ 4.5:1, large text and non-text UI ≥ 3:1.
- Status changes announced politely; errors announced assertively and
  programmatically associated with the offending field.
- Target size ≥ 24×24 CSS px minimum, ≥ 44×44 for primary touch actions.
- Bahasa Indonesia is the primary language; the document language is declared.
- No information conveyed by colour alone — every state carries text or shape.

Screen-specific obligations:

| Screen group | Focus order | Screen reader | Additional |
| --- | --- | --- | --- |
| Wizards (PUB-03, PLY-11, GRD-03, ORG-04) | Focus moves to the new step heading on advance; back returns focus to the control that advanced | Step position announced ("Langkah 2 dari 4"); validation summary is a labelled region | Progress is never conveyed by colour alone; no time limit on a step |
| Tables (ORG-02/03/05/06, ASC-*, FED-02/05/06/07) | Header → toolbar → table → row detail | Row and column headers associated; sort state announced; result count announced on filter change | Horizontal scroll is keyboard reachable; row actions have unique accessible names |
| Timelines (PLY-04, ASC-03/04, GRD-06) | Chronological, matching visual order | Ordered list semantics; each entry names date, event, and actor | Read-only nature announced |
| Consent surfaces (PLY-07, GRD-04) | Purpose → state → explanation → action | Purpose name, current state, and consequence read as one unit; revocation confirmation announced | Consequence text is never a tooltip only |
| Dialogs (confirmations everywhere) | Focus enters the dialog, returns to the trigger on close | Dialog labelled and described; destructive action named explicitly, never "OK" | Escape cancels; cancel is never the destructive path |
| QR Card (PLY-03, ASC-02) | Card → reveal → share | Display code available as readable text, not image-only | Reveal is deliberate, never automatic |
| SYSTEM screens | Focus moves to the explanation heading | Explanation announced on arrival; the return action is first in tab order | No auto-redirect without a user-cancellable notice |

---

## PART 12 — Responsive Behaviour

Mobile-first. A capability available on a large display is available on mobile;
only the arrangement changes.

| Breakpoint class | Navigation | Sidebar | Tables | Detail Panel | Action Panel |
| --- | --- | --- | --- | --- | --- |
| Mobile (single column) | Bottom or collapsed area navigation; breadcrumb collapses to "up one level" | Off-canvas, closed by default | Become stacked record cards with the decisive attributes first | Full-screen view pushed on top | Sticky at the bottom, one primary action visible |
| Tablet (two zones) | Persistent area navigation | Collapsible icon rail | Table with prioritised columns; secondary columns behind a column control | Slide-over panel | Inline with the content, primary action right-aligned |
| Desktop (three zones) | Persistent top + sidebar | Expanded, labelled | Full table with sort and filter | Docked side panel | Docked, primary and secondary visible |
| Large display | Same as desktop | Expanded | Table plus summary rail; no line length beyond comfortable reading | Docked, wider | Docked |

Standing rules: content reflows at 320 CSS px width without loss; no horizontal
scrolling of the page itself; orientation is never locked; queues (ORG-06,
ASC-03/04, FED-08) keep the decision action reachable without scrolling past the
evidence on every class; low-bandwidth behaviour degrades to text before images.

---

## PART 13 — Navigation Flow

Screen → Journey → Destination.

**Registration and identity establishment**

```text
SCR-PUB-01  → (visitor decides)        → SCR-PUB-03
SCR-PUB-03  → JRN-01 Register Person   → SCR-PLY-01 (adult) | SCR-GRD-03 (minor)
SCR-GRD-03  → JRN-03 Link Guardian     → SCR-GRD-05
SCR-GRD-05  → JRN-04 Verify Link       → SCR-ASC-03
SCR-ASC-03  → JRN-05 Verify Player     → SCR-ASC-02
SCR-ASC-02  → JRN-06 Issue Football ID → SCR-PLY-03
```

**Consent**

```text
SCR-GRD-01 → JRN-07 Grant Consent       → SCR-GRD-04 → SCR-GRD-01
SCR-GRD-04 → JRN-08 Revoke Consent      → SCR-GRD-04 (immediate effect) → SCR-GRD-07
SCR-GRD-04 → JRN-09 High-Risk Revocation→ SCR-FED-08 → SCR-FED-05
SCR-PLY-07 → JRN-07 / JRN-08 (adult)    → SCR-PLY-07 → SCR-PLY-09
```

**Membership and portability**

```text
SCR-ORG-01 → JRN-10 Join Organization   → SCR-ORG-03 → SCR-PLY-05
SCR-ORG-03 → JRN-11 Add Secondary       → SCR-ORG-03
SCR-ORG-03 → JRN-12 Remove Secondary    → SCR-ORG-03
SCR-ORG-04 → JRN-13 Transfer Primary    → SCR-ASC-04 → SCR-PLY-05
SCR-ORG-04 → JRN-14 Promote Secondary   → SCR-ASC-04 (executed as a transfer, INV-19)
```

**Activity and active status**

```text
SCR-ORG-05 → JRN-15 Record Activity          → SCR-PLY-06 → SCR-PLY-04
SCR-FED-01 → JRN-16 Evaluate Activity Status → SCR-FED-04 → SCR-ASC-06
```

**Integrity and lifecycle**

```text
SCR-PUB-04 → JRN-17 Recover Identity  → SCR-PLY-11 → SCR-PLY-01
SCR-ASC-05 → JRN-18 Merge Duplicate   → SCR-FED-05
SCR-FED-02 → JRN-19 Archive Identity  → SCR-SYS-06
SCR-SYS-06 → JRN-20 Restore Identity  → SCR-FED-02
SCR-ASC-03 → JRN-21 Guardian Transition → SCR-GRD-02
```

**System interception.** Any screen may be replaced at request time by
SCR-SYS-01/02/03/04/05. On resolution the actor returns to the intended screen,
never to a partially rendered one.

---

## PART 14 — Screen State Catalogue

Standard state contract applied to every screen unless overridden below.

| State | Meaning | Contract |
| --- | --- | --- |
| Initial | Screen entered, no data requested yet | Structure visible, no fabricated values |
| Loading | Data in flight | Non-blocking indication; layout does not jump; announced politely |
| Empty | Query succeeded, nothing to show | Explains why it is empty and what would fill it; never an error |
| Success | Data present, or a command completed | Result stated in business terms, not technical ones |
| Error | Query or command failed | Cause in plain language, next step, retry where safe |
| Offline | No connectivity | Read-only cached context; commands disabled with an explanation, never silently queued |
| Forbidden | Actor not entitled | Replaced by SCR-SYS-02; existence of the resource is not confirmed |
| Archived | Record lifecycle is `ARCHIVED` | Replaced by SCR-SYS-06; restore offered only to entitled actors |

Overrides:

| Screen | Override |
| --- | --- |
| SCR-PLY-04 Journey Timeline | Empty state explains that the journey begins with the first recorded activity; no Archived state — an archived person's journey is reached only through SCR-SYS-06 |
| SCR-PLY-07 / SCR-GRD-04 Consent | No Offline command state: consent changes are never queued offline, because revocation must be immediate |
| SCR-ASC-02 Football ID Administration | No Archived state — issuance is not offered for archived records |
| SCR-FED-04 Analytics | Empty state reports insufficient cohort size rather than "no data", and suppresses small cohorts |
| SCR-FED-05 / 07 Audit, Ledger | No Empty "nothing happened" phrasing — states the filter window explicitly |
| SCR-SYS-* | Only Initial and Success apply |

---

## PART 15 — Error & Recovery

**Validation errors.** Reported at field level and summarised at the top of the
form; the summary links to the first offending field; language is business
language, never a schema or code reference; a wizard never loses completed
steps because a later step failed.

**Authorization errors.** Always resolve to SCR-SYS-02. The message never
confirms whether the resource exists, never names the entitled role, and never
suggests requesting access from a named individual. Every refusal is audited.

**Consent-related refusals.** Stated as a consent fact ("purpose is not active"),
with the consent authority named by role, never by personal contact details.

**Structural refusals.** When a request corresponds to a prohibited capability,
the response is a plain statement that the capability does not exist. It is
never framed as a permission the actor might later obtain (STK-INV-004).

**Network failure.** Reads: automatic retry with backoff, at most three
attempts, then SCR-SYS-05 with a manual retry. Commands: **never** retried
automatically; the actor is told the outcome is unknown and is offered a safe
re-check that reads current state before allowing a resubmission. Idempotency
keys defined in IDN-API-001 make a deliberate resubmission safe.

**Retry behaviour by command class.**

| Class | Screens | Retry rule |
| --- | --- | --- |
| Irreversible (issue ID, merge, archive) | ASC-02, ASC-05, FED-02 | No automatic retry; re-check state, then explicit re-confirmation |
| Immediate-effect (revoke consent) | PLY-07, GRD-04 | Effect is asserted first; a reporting failure never reverses the effect |
| Queue decisions (verification, transfer) | ORG-06, ASC-03, ASC-04 | Item returns to the queue unchanged on failure |
| Recording (activity) | ORG-05 | Draft preserved locally; resubmission is idempotent |

**Recovery flow.** Session expiry → SCR-SYS-04 → re-authenticate → return to the
intended screen with unsubmitted input preserved only where it contains no
sensitive value. Lost credentials → SCR-PUB-04 → SCR-PLY-11 → JRN-17, same
Football ID throughout (ADR-0002). Wrongly archived record → SCR-SYS-06 →
SCR-FED-02 → JRN-20.

---

## PART 16 — Analytics Mapping

| Screen | VAP | NDI | JCS | CTI | Contribution |
| --- | --- | --- | --- | --- | --- |
| SCR-PUB-03 Register | ● | — | ● | — | Creates the population from which VAP is drawn; establishes Identity dimension of JCS |
| SCR-ASC-03 / ORG-06 Verification | ● | — | ● | — | Verification is a VAP precondition |
| SCR-ASC-02 Football ID | ● | — | ● | — | Football ID is a VAP precondition |
| SCR-ORG-03 Membership | ● | ● | ● | — | Organization dimension of JCS; first edge of the network graph |
| SCR-ORG-04 / ASC-04 Transfer | — | ● | ● | — | Portability across organizations is the NDI signal |
| SCR-ORG-05 / PLY-06 Activity | ● | ● | ● | — | Active Football Activity per PRG-MET-001 |
| SCR-PLY-04 Journey | — | ● | ● | — | Journey completeness is measured on this projection, never written by it |
| SCR-PLY-07 / GRD-04 Consent | — | — | ● | ● | Active, valid purposes determine CTI |
| SCR-FED-08 High-Risk Revocation | — | — | — | ● | Downstream stop lowers usable-consent surface deliberately, and that is a healthy signal |
| SCR-FED-04 Analytics | ● | ● | ● | ● | Reports all four with the `policy_id@version` used |
| SCR-ASC-06 Policy Monitoring | ● | ● | ● | ● | Explains which policy version produced which figure |

Screens not listed have no metric contribution and must not be justified by one.

---

## PART 17 — Acceptance Criteria

### 17.1 Journey coverage — all 21 journeys have a screen

| Journey | Screens |
| --- | --- |
| JRN-01 Register Person | SCR-PUB-03 |
| JRN-02 Register Guardian | SCR-PUB-03 |
| JRN-03 Link Guardian | SCR-GRD-03, SCR-GRD-02 |
| JRN-04 Verify Guardian Link | SCR-GRD-05, SCR-ORG-06, SCR-ASC-03 |
| JRN-05 Verify Player | SCR-PLY-08, SCR-ORG-06, SCR-ASC-03 |
| JRN-06 Issue Football ID | SCR-ASC-02, SCR-PLY-03 |
| JRN-07 Grant Consent | SCR-PLY-07, SCR-GRD-04 |
| JRN-08 Revoke Consent | SCR-PLY-07, SCR-GRD-04 |
| JRN-09 High-Risk Revocation | SCR-FED-08, SCR-GRD-07 |
| JRN-10 Join Organization | SCR-ORG-03 |
| JRN-11 Add Secondary | SCR-ORG-03 |
| JRN-12 Remove Secondary | SCR-ORG-03 |
| JRN-13 Transfer Primary | SCR-ORG-04, SCR-ASC-04 |
| JRN-14 Promote Secondary | SCR-ORG-04, SCR-ASC-04 |
| JRN-15 Record Activity | SCR-ORG-05, SCR-PLY-06 |
| JRN-16 Evaluate Activity Status | SCR-PLY-01, SCR-FED-01, SCR-FED-04, SCR-ASC-06 |
| JRN-17 Recover Identity | SCR-PUB-04, SCR-PLY-11, SCR-SYS-04 |
| JRN-18 Merge Duplicate | SCR-ASC-05 |
| JRN-19 Archive Identity | SCR-FED-02, SCR-SYS-06 |
| JRN-20 Restore Identity | SCR-SYS-06, SCR-FED-02 |
| JRN-21 Guardian Authority Transition | SCR-ASC-03, SCR-GRD-02 |

**Result: 21 / 21 covered.**

### 17.2 Command coverage — all 22 commands are invoked

| Command | Screens |
| --- | --- |
| C-01 RegisterPerson | SCR-PUB-03 |
| C-02 IssueFootballIdentity | SCR-ASC-02 |
| C-03 LinkGuardian | SCR-GRD-03 |
| C-04 ReplaceGuardian | SCR-GRD-02, SCR-ASC-03 |
| C-05 RemoveGuardian | SCR-GRD-02 |
| C-06 GrantConsent | SCR-PLY-07, SCR-GRD-04 |
| C-07 RevokeConsent | SCR-PLY-07, SCR-GRD-04, SCR-FED-08 |
| C-08 RequestVerification | SCR-PLY-08, SCR-GRD-05 |
| C-09 CompleteVerification | SCR-ORG-06, SCR-ASC-03 |
| C-10 RejectVerification | SCR-ORG-06, SCR-ASC-03 |
| C-11 CreateMembership | SCR-ORG-03 |
| C-12 TransferMembership | SCR-ORG-04, SCR-ASC-04 |
| C-13 PromoteSecondaryMembership | SCR-ORG-04 |
| C-14 AddSecondaryMembership | SCR-ORG-03 |
| C-15 RemoveSecondaryMembership | SCR-ORG-03 |
| C-16 RecordActivity | SCR-ORG-05 |
| C-17 MergeIdentity | SCR-ASC-05 |
| C-18 RecoverIdentity | SCR-PUB-04, SCR-PLY-11 |
| C-19 ArchiveIdentity | SCR-FED-02 |
| C-20 RestoreIdentity | SCR-FED-02, SCR-SYS-06 |
| C-21 ActivatePolicy | SCR-FED-03 |
| C-22 RetirePolicy | SCR-FED-03 |
| Guardian Annotation command | SCR-GRD-06 |

**Result: 22 / 22 covered, plus the annotation command.**

### 17.3 Query coverage — all 12 queries back a screen

| Query | Screens |
| --- | --- |
| Q-01 GetPerson | SCR-PLY-02, SCR-ORG-02, SCR-ASC-02, SCR-ASC-05, SCR-FED-02, SCR-SYS-06 |
| Q-02 SearchPersons | SCR-ORG-02, SCR-ASC-02, SCR-ASC-05, SCR-FED-02, SCR-FED-06 |
| Q-03 GetJourney | SCR-PLY-04, SCR-PLY-01 |
| Q-04 GetMemberships | SCR-PLY-05, SCR-ORG-01, SCR-ORG-03, SCR-ORG-04, SCR-ASC-04 |
| Q-05 GetGuardianLinks | SCR-GRD-01, SCR-GRD-02, SCR-GRD-03, SCR-GRD-06, SCR-PLY-02, SCR-ASC-03 |
| Q-06 GetConsents | SCR-PLY-07, SCR-GRD-01, SCR-GRD-04, SCR-FED-08 |
| Q-07 GetVerification | SCR-PLY-08, SCR-GRD-01, SCR-GRD-05, SCR-ORG-06, SCR-ASC-01, SCR-ASC-03 |
| Q-08 GetActivities | SCR-PLY-06, SCR-PLY-01, SCR-ORG-01, SCR-ORG-05 |
| Q-09 GetAuditHistory | SCR-FED-05 |
| Q-10 GetPolicies | SCR-PUB-06, SCR-PLY-07, SCR-GRD-04, SCR-ASC-06, SCR-FED-01, SCR-FED-03, SCR-FED-04 |
| Q-11 GetOrganizations / references | SCR-PLY-05, SCR-ORG-01, SCR-ORG-03, SCR-ASC-01, SCR-FED-01 |
| Q-12 GetDecisionHistory | SCR-PLY-04, SCR-PLY-09, SCR-ORG-04, SCR-ORG-06, SCR-ASC-03, SCR-ASC-04, SCR-ASC-05, SCR-ASC-06, SCR-FED-05, SCR-FED-08 |

**Result: 12 / 12 covered.**

### 17.4 Actor completeness

Every actor in PART 9 has an entry screen, at least one action screen, and a
resolution path (success and refusal). Verified for all 12 actor rows.

### 17.5 Remaining criteria

- [x] No orphan screen — every screen in PART 3 appears in PART 4 with a journey.
- [x] No screen without a business goal — PART 4 column populated for all 50.
- [x] No screen violating the Constitution — Journey is read-only (EDEC-01);
  Football ID is opaque and immutable (ADR-0002); one Primary membership
  (ADR-0003); no second account per role; no prohibited capability rendered.
- [x] Accessibility, privacy, responsive, and analytics contracts stated for
  every screen or every screen group.

---

## PART 18 — Traceability Matrix

Representative end-to-end threads. Every screen inherits the chain of its
journey; the threads below prove each link is unbroken.

| Vision | Stakeholder | PRD | Domain | CDM | Event | Journey | ERD | API | Screen | Future Component | Future Page |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PRG-VIS-001 §Identity | Player, Guardian | BP-01, FR-Register | `Person` aggregate | Person | `PersonRegistered` | JRN-01 | Person entity | C-01 | SCR-PUB-03 | Wizard, Form | Registration page |
| PRG-VIS-001 §Portability | Player, Club | BP-02 | `Membership` | Membership | `MembershipTransferred` | JRN-13 | Membership entity | C-12 | SCR-ORG-04, SCR-ASC-04 | Wizard, Table, Timeline | Transfer pages |
| PRG-VIS-001 §Trust | Guardian, CPO | BP-05 | `Consent` | Consent Purpose | `ConsentRevoked` | JRN-08, JRN-09 | Consent entity | C-07 | SCR-GRD-04, SCR-FED-08 | Consent Control, Dialog | Consent pages |
| PRG-VIS-001 §Integrity | Data Steward | BP-07 | `Person` | Person | `IdentityMerged` | JRN-18 | Person entity | C-17 | SCR-ASC-05 | Comparison Card | Merge page |
| PRG-VIS-001 §North Star | Coach, Federation | BP-03 | `Journey` (read model) | Activity | `ActivityRecorded` | JRN-15, JRN-16 | Activity entity | C-16, Q-03 | SCR-ORG-05, SCR-PLY-04 | Table, Timeline | Activity + Journey pages |
| PRG-VIS-001 §Governance | Federation | BP-09 | policies | Policy | `PolicyVersionActivated` | JRN-16 | Policy entity | C-21 | SCR-FED-03 | Table, Dialog | Policy page |
| PRG-VIS-001 §Identity | Association | BP-01 | `FootballIdentity` | Football Identity | `FootballIdentityIssued` | JRN-06 | FootballIdentity entity | C-02 | SCR-ASC-02, SCR-PLY-03 | QR Card | Football ID pages |

Downward links (`satisfied_by`): IDN-UIC-001 defines every component named in
PART 6; IDN-DS-001 defines the visual expression of PART 11 and PART 12.

---

## Quality Gate Verification — G7

| Check | Result | Evidence |
| --- | --- | --- |
| Constitution compliance | PASS | §17.5; Journey read-only, opaque Football ID, one Primary membership, one account per person |
| Journey coverage | PASS | §17.1 — 21/21 |
| Screen coverage | PASS | PART 3 + PART 4 — 50 screens, no orphan |
| Command coverage | PASS | §17.2 — 22/22 plus annotation |
| Query coverage | PASS | §17.3 — 12/12 |
| Accessibility | PASS | PART 11 — WCAG 2.2 AA baseline plus per-group obligations |
| Privacy | PASS | PART 10 — exposure, masking, and visibility per screen |
| Child protection | PASS | PART 10 standing rules; PART 9 Rule 0 resolutions; PART 3 structural absence |
| Responsive readiness | PASS | PART 12 — four breakpoint classes, capability parity |
| Traceability | PASS | PART 18 — no dangling links |

**Open items carried forward (non-blocking):** OQ-02 (minimum L1 verification
evidence) and OQ-05 (CTI Phase 0 floor) appear on SCR-PLY-08, SCR-GRD-05,
SCR-ORG-06, SCR-ASC-03, and SCR-FED-04 as policy references only. No screen
restates their values.

**Status:** IN_REVIEW at G7. Next artefact: IDN-UIC-001 (UI Component
Catalogue). Implementation (Stage 6, IDN-IMP-001) remains BLOCKED.
