---
id: IDN-FE-001
title: Enterprise Frontend Implementation Architecture
version: 1.0
status: DRAFT
date: 2026-08-07
bounded_context: identity
stage: 6
gate: G6
authors: [Enterprise Frontend Architecture Council]
derives_from:
  [
    EPOS-CORE-CON-001,
    EPOS-CORE-CON-002,
    PRG-VIS-001,
    PRG-STK-001,
    CONSENT-001,
    IDN-PRD-001,
    IDN-JRN-001,
    IDN-DMN-001,
    IDN-CDM-001,
    IDN-EVT-001,
    IDN-ERD-001,
    IDN-API-001,
    IDN-SCR-001,
    IDN-DS-001,
    IDN-UIC-001,
    ADR-0001,
    ADR-0002,
    ADR-0003,
  ]
satisfied_by: [Implementation Code, IDN-TEST-001]
adrs: [ADR-0001, ADR-0002, ADR-0003]
north_star_impact: "Provides the ONLY architectural blueprint for implementing the 50-screen Identity front-end. Every command, query, route, guard, and component traces to an approved artefact. No AI coding assistant may deviate from this blueprint."
---

# IDN-FE-001 — Enterprise Frontend Implementation Architecture

> **Scope guard.** This document is the Single Source of Truth for TanStack Start
> implementation. It contains NO business rules that are not already in an approved
> artefact. Every structural decision traces to a cited source. An AI coding
> assistant that cannot cite a trace from this document to its code change MUST
> REFUSE that change under Constitution Article 14 (Refusal Duty).

---

## PART 01 — Frontend Vision

### Purpose
Translate the programme vision (PRG-VIS-001) and product requirements (IDN-PRD-001) into the frontend architectural stance that every screen, route, and component must embody. The frontend is the guardians' and players' primary interface to the identity and consent infrastructure — it must protect, not persuade, and it must make consent real, not theatrical.

### Scope
Frontend-wide architectural stance across all 50 screens in IDN-SCR-001 (PUBLIC, PLAYER, GUARDIAN, ORGANIZATION, ASSOCIATION, FEDERATION, SYSTEM). Applies to every bounded context that will later be built on this stack.

### Inputs
- PRG-VIS-001 §1 Vision Statement, §2 Mission, §4 Strategic Principles (0–5), §5 Target Stakeholders, §7 Non-Goals
- PRG-STK-001 §1 Executive Summary, S0–S9 stakeholder principles, STK-INV-001..004 invariants
- CONSENT-001 §12 UX obligations (binding on G5)
- IDN-PRD-001 PART 4 Product Goals (PG-01..PG-09)

### Outputs
- A stated architectural stance that every downstream Part in this document operationalises.
- Rejection of any feature or pattern that contradicts this stance (Article 14 Refusal Duty).

### Dependencies
- Constitution Articles 0 (Child Prevails), 1 (Spec Before Impl), 8 (Server-Side AuthZ), 9 (Privacy by Architecture)
- Engineering Principles 1 (Spec-Driven), 5 (Secure-by-Default), 6 (Privacy-by-Architecture)

### Architecture Decision
The frontend is **a presentation-only client of the Identity domain**. It does not own any business rule, does not verify any permission, does not validate any eligibility, and does not decide any consent outcome. It renders domain facts, collects user intent expressed as commands, and surfaces server-verified outcomes.

The frontend's architectural identity is:
1. **Child-safe first.** Every screen assumes the subject may be a minor until proven otherwise. There is no "optimistic render" of child-sensitive data.
2. **Consent-presenting, never consent-manufacturing.** Consent toggles are independent, unbundled, clearly explained, and revocation is always within two taps (CONSENT-001 §12).
3. **Server-authoritative.** A disabled button, hidden menu, or greyed action is a *convenience hint*, not a security boundary. The server re-evaluates every permission on every request (Constitution Art. 8).
4. **Journey-read-only.** No screen writes Journey. Journey is read everywhere, always from the projection consumed via Q-03 GetJourney (EDEC-01, INV-INF-08).
5. **Role-context-switching, not multi-identity.** One Person, one session, many role contexts. The role switcher changes the visible area; the Football ID in the session header never changes (IDN-PRD-001 FR-PER-02, Constitution #3).
6. **Football-ID-opaque-first.** Deep links, route params, and search results use opaque refs (`personRef`, `membershipRef`), never names, birth dates, or display codes as route primary keys (ADR-0002 rev. 2).
7. **Structural prohibitions are structural.** There is no under-13 scouting screen, no talent shortlist component, and no cross-SSB prospect browser. The routes and components do not exist (STK-INV-004). There is no `permission=false` branch to misconfigure.

### Rules
1. Any UI pattern that would pressure or deceive a guardian into granting a consent purpose is prohibited. Pattern = refusal.
2. Any UI pattern that would imply Football ID ownership by an Organization (e.g., "SSB X's player") is prohibited. Language uses "Player at SSB X" or Membership-scoped language.
3. Any UI pattern that separates consent-granting from its plain-language explanation is prohibited (CONSENT-001 §12).
4. No screen or component may short-circuit to an optimistic "success" state before the server returns an event-confirmed result for a command involving minors, consent, transfers, or verification.

### Constraints
- TanStack Start + React 19 + TypeScript only (ADR-0001). No framework change.
- Bahasa Indonesia is the primary content language. All copy begins in id-ID; en-US is secondary (IDN-PRD-001 NFR-12).
- Mobile-first; 375px is the minimum design width (IDN-DS-001 §4).

### Acceptance Criteria
1. Every screen in IDN-SCR-001 renders its content through server-verified queries only; no client-side "fill-in" of child-sensitive fields.
2. Revocation of P4, P5, or P2 from SCR-GRD-04 results in UI change (photo gone, scout view gone, squad withdrawn) on next render cycle — never after a refresh only.
3. The role-context switcher does not change the Person's displayed Football ID.
4. No route or component exists that would enable browsing under-13 players outside an active, scoped Membership.

### Risks
- R-01-01. AI assistants interpret "convenience hint" permissions as security boundaries. Mitigation: explicit dual-check pattern (client hint, server enforcement) documented in PART 09.
- R-01-02. Copy drift: English-first, Bahasa second. Mitigation: PART 24 i18n build step.

### Anti-patterns
- AP-01-01. `if (user.role === 'admin') { showDeleteBtn() }` without server re-evaluation of every delete command. (Violates Constitution Art. 8.)
- AP-01-02. Pre-ticked opt-ins on consent forms, or "Accept all + customize" (acceptance prominent, customize buried). (Violates CONSENT-001 §12.)
- AP-01-03. Scout UI rendered but "disabled for under-13". (Violates STK-INV-004 structural prohibition.)
- AP-01-04. Route params like `/player/:name/:dob/:club`. (Violates ADR-0002 opacity.)

### Traceability
| Decision | Source Artefact | Clause |
| --- | --- | --- |
| Child-safe default stance | PRG-VIS-001 §4, Strategic Principle 0 | S0 overrides all |
| Presentation-only client | Constitution | Article 8 |
| Consent unbundled + 2-tap revocation | CONSENT-001 | §12 |
| One Person, one session, many roles | Constitution | #3; IDN-PRD-001 FR-PER-02 |
| Opaque refs in routes | ADR-0002 rev. 2 | Decision §2 |
| Structural absence of scouting U13 | PRG-STK-001 | STK-INV-004 |
| Journey read-only everywhere | IDN-API-001 §3 | Journey is a read-only resource |

---

## PART 02 — Application Architecture

### Purpose
Define the layered, component/composition, and request-flow structure of the TanStack Start application that implements the 50 screens of IDN-SCR-001 without leaking business rules into presentation.

### Scope
Runtime layers, SSR/CSR boundaries, hook composition rules, server-function usage, and request lifecycle for Identity-context screens. Later contexts inherit this structure.

### Inputs
- ADR-0001 (TanStack Start + Lovable Cloud; server functions in `src/lib/*.functions.ts`; `/api/public/*` routes for external callers)
- IDN-API-001 §2 API Principles (P-02 no business logic in API edge; P-04 CQRS; P-10 authz order Person→Role→Relationship→Consent→Age→Policy→Scope)
- IDN-UIC-001 §2 Component Design Principles (stateless; no API calls in components; no business logic in components)

### Outputs
- Layered architecture diagram (textual) + folder/module-boundary rules (operationalised in PART 04).
- Request lifecycle for commands (C-01..C-22) and queries (Q-01..Q-12).

### Dependencies
- PART 04 Folder Structure
- PART 05 Routing Architecture
- PART 10 API Client Architecture

### Architecture Decision
Five-layer frontend architecture. Layers are strictly one-way downward; a lower layer never imports from a higher layer.

```
L5  Routes / Pages          (TanStack Router file routes)
 │  Composes features + layouts. Owns route-level guards.
 ▼
L4  Features                (feature modules under src/features/<area>)
 │  Orchestrates use-cases: selects hooks, composes containers, wire-up RHF+Zod.
 ▼
L3  Containers              (feature-level containers)
 │  Data-fetching, state, form state. Pass props down to presentational.
 ▼
L2  Components / UI         (src/components/ui + src/components/<domain>)
 │  Presentational only. Pure props. No fetch, no global-state write, no authz decisions.
 ▼
L1  Core / Infrastructure   (src/lib, src/hooks, src/api, src/guards)
    TanStack Query client, API client, RHF defaults, Zod schemas, auth session,
    permission resolver, design tokens, error envelope, logging.
```

CQRS separation applies within L4/L3:
- **Query path:** Route Loader (SSR) → TanStack Query `useSuspenseQuery`/`useQuery` (Q-01..Q-12) → server function → DB (RLS-checked) → projection returned.
- **Command path:** User action → React Hook Form submit (+ Zod validate client-shape only) → TanStack Mutation (C-01..C-22) → server function → Domain (invariants, events) → result envelope + emitted event keys → optimistic cache invalidation per PART 07.

SSR boundary:
- **SSR for first paint of all public routes (SCR-PUB-01..06), session-critical dashboards (SCR-GRD-01, SCR-PLY-01, SCR-ORG-01, SCR-ASC-01, SCR-FED-01), and SCR-SYS error screens.** These routes populate the TanStack Query cache via route `loader` functions using `queryClient.prefetchQuery(...)` so SSR HTML includes real data and CSR rehydrates the cache.
- **CSR-only for heavy interaction routes:** SCR-ORG-05 (activity capture), SCR-GRD-04 (consent management with immediate-toggled consequences, high-risk revocation preview), SCR-ASC-05 (side-by-side merge comparison). These use Suspense boundaries with skeletons (PART 13).

### Rules
1. No L2 presentational component may import from `@tanstack/react-query`, `@/api/*`, `@/guards/*`, or any L4/L5 module. All data arrives via props.
2. No server function (ADR-0001 `src/lib/*.functions.ts`) may be called from a presentational component. Only L3 containers or L4 feature hooks call server functions.
3. Every command invocation (C-01..C-22) passes through a typed TanStack mutation that (a) accepts a validated Zod payload, (b) returns the domain-uniform error envelope on failure, and (c) calls the `onSuccess`/`onSettled` invalidation hooks defined per PART 07.
4. Every authorization visibility decision on screen follows the "dual-hint + hard-stop" pattern: L3 container asks PART 09 resolver "may X see Y?", then hides or shows; the command path is independently guarded server-side. The UI hint is NOT the stop.
5. File-based routing is the source of truth. No imperative route registry.

### Constraints
- No global state library (Zustand, Redux, Jotai, MobX, XState). Server state = TanStack Query. Local UI state = React hooks and TanStack Router search params. Session = cookie-backed auth state. See PART 07.
- No `useEffect` cascades to chain mutations or data fetching. Use React Query dependent queries + router loader prefetch.
- No custom `fetch` wrapper outside `@/api/client` (PART 10).

### Acceptance Criteria
1. An import dependency scan finds no L2→L4 or L2→L3 reverse imports, with the single exception of type-only imports for prop typing.
2. Every C-01..C-22 command has exactly one feature-level mutation hook in L4 that calls a server function; no screen calls a server function directly.
3. Every Q-01..Q-12 query has exactly one typed Query Key factory (PART 10) and is prefetched in SSR on its originating dashboard/detail route.
4. A consent toggle rendered for P5_SCOUTING on a 12-year-old Player record returns "screen does not exist" (role/capability absent, not "toggle disabled").

### Risks
- R-02-01. Feature modules grow fat and violate single-responsibility. Mitigation: PART 04 per-feature slicing rule by area (player, guardian, org, association, federation, system).
- R-02-02. Hydration mismatches with SSR of auth-scoped content. Mitigation: PART 08 session hydration guard in `__root.tsx` before paint of user-specific chrome.

### Anti-patterns
- AP-02-01. Presentational Button component calls `useMutation` directly. (Breaks L2 purity.)
- AP-02-02. `<Route>.component` directly runs `useQuery` without an L3 container or L4 feature hook. (Breaks SSR prefetch via loader.)
- AP-02-03. `const canEdit = session.user.role === 'admin'` used to both hide the UI AND skip the server guard. (Violates dual-hint + hard-stop.)

### Traceability
| Decision | Source Artefact | Clause |
| --- | --- | --- |
| 5-layer one-way dependency | IDN-UIC-001 §2 | Component Constraints ("No API calls in components") |
| CQRS separation in L4/L3 | IDN-API-001 §2 | P-04 Command / Query Separation |
| SSR for dashboards + public; CSR for heavy interaction | ADR-0001 | Consequences: TanStack Start SSR capabilities |
| No global state lib; use React Query + Router | IDN-UIC-001 §2 | Components are Stateless (Principle 3) |
| Server functions only via L3/L4 | ADR-0001 | Decision §2 (server functions are the API layer) |

---

## PART 03 — Feature Module Architecture

### Purpose
Define how the 50 screens and 7 navigation areas (PUBLIC, PLAYER, GUARDIAN, ORGANIZATION, ASSOCIATION, FEDERATION, SYSTEM) are packaged into testable, independently tree-shakeable feature modules whose internal boundaries align with the stakeholder actor model of PRG-STK-001.

### Scope
Module slicing, module public-API rules (barrel exports / index.ts), module dependency graph, and per-module composition of commands + queries + screens.

### Inputs
- IDN-SCR-001 §3 Screen Catalogue (6 PUB, 11 PLY, 7 GRD, 6 ORG, 6 ASC, 8 FED, 6 SYS → 50 screens)
- IDN-SCR-001 §2.3 Role-based navigation (actor → area home mapping)
- IDN-API-001 §4 C-01..C-22 commands, §5 Q-01..Q-12 queries

### Outputs
Module list, module internal structure, and command/query allocation to modules.

### Dependencies
- PART 02 Layered Architecture (L4 = features layer)
- PART 04 Folder Structure

### Architecture Decision
Feature modules are sliced **by actor area**, not by technical concern. The 8 feature modules are:

| Module | Area | Screens from IDN-SCR-001 | Primary actors |
| --- | --- | --- | --- |
| `@/features/public` | PUBLIC | SCR-PUB-01..06 | Visitor, Authenticated officer (PUB-05) |
| `@/features/player` | PLAYER | SCR-PLY-01..11 | Player (minor, adult); Guardian read-only of child view |
| `@/features/guardian` | GUARDIAN | SCR-GRD-01..07 | Guardian (B1, B2 per PRG-STK-001) |
| `@/features/organization` | ORG | SCR-ORG-01..06 | Club Admin (C4), Coach (D1–D4), Delegated verification authority |
| `@/features/association` | ASC | SCR-ASC-01..06 | Association Officer, Verification Authority, Data Steward (F1–F4 per PRG-STK-001) |
| `@/features/federation` | FED | SCR-FED-01..08 | Federation Officer, Privacy Officer, CPO (G1, I4, I5 per PRG-STK-001) |
| `@/features/system` | SYS | SCR-SYS-01..06 | All actors (error, denied, maintenance, expired, offline, archived) |
| `@/features/shared` | cross-cutting | No screens; provides PersonContext, RoleSwitcher, Breadcrumb, ActionPanel, Shell layouts | consumed by all L4 modules |

Internal structure of every feature module:
```
src/features/<name>/
├── index.ts                         (barrel: only export public API — no internals)
├── types.ts                         (feature-scoped DTOs — never leak DB types)
├── queries/                         (one hook per Q-xx used by this feature)
│   ├── useGetPerson.ts
│   ├── useGetJourney.ts
│   └── ...
├── mutations/                       (one hook per C-xx used by this feature)
│   ├── useRegisterPerson.ts         (C-01)
│   ├── useGrantConsent.ts           (C-06)
│   └── ...
├── containers/                      (L3: one container per screen; data fetch + form)
│   ├── PlayerDashboardContainer.tsx
│   ├── ConsentManagementContainer.tsx
│   └── ...
├── components/                      (feature-private components; domain-only)
│   ├── ConsentPurposeToggle.tsx     (NOT in ui/ — feature-specific composition)
│   ├── MembershipRow.tsx
│   └── ...
├── routes/                          (optional: only if multiple sub-routes cluster)
│   └── ...
└── schemas/                         (Zod schemas for forms + command payload shapes)
    ├── registerPerson.schema.ts
    ├── grantConsent.schema.ts
    └── ...
```

Public API rule (`index.ts`): a feature exports exactly its public `types`, containers, and L4 hooks. It never exports an L2 private component, never exports a raw server function, and never exports a query key. The module consumer cannot bypass the L4 boundary.

Dependency graph between features (acyclic):
```
shared ← public, player, guardian, organization, association, federation, system
(no other cross-feature imports. If shared is insufficient, create a @/features/shared/* addition.)
```

Command / Query allocation (partial, 100% coverage in PART 10):
- `@/features/guardian/mutations/useGrantConsent.ts` → C-06; `useRevokeConsent.ts` → C-07; `useLinkGuardian.ts` → C-03.
- `@/features/organization/mutations/useCreateMembership.ts` → C-11; `useTransferMembership.ts` → C-12; `useRecordActivity.ts` → C-16.
- `@/features/association/mutations/useCompleteVerification.ts` → C-09; `useMergeIdentity.ts` → C-17.
- `@/features/federation/mutations/useActivatePolicy.ts` → C-21; `useRetirePolicy.ts` → C-22.
- Queries Q-01..Q-12 live in `@/features/shared/queries/` because they cross actors, each feature re-exports those it consumes from its own `index.ts` via explicit named re-export (not re-export *).

### Rules
1. A module MUST NOT import from any other feature module except `@/features/shared` and the core L1 infrastructure (`@/lib`, `@/hooks`, `@/api`, `@/guards`).
2. A module's private containers/components MUST NOT be re-exported to a sibling feature via barrel-exports — if a component is shared, it moves to `@/features/shared/components/` with a council-accepted trace.
3. A command mutation hook MUST live in exactly one feature module (the actor that PRIMARILY initiates it per IDN-JRN-001). Other features call it via `@/features/<owner>/index.ts` re-export, never by writing a duplicate hook.
4. Every feature module ships its own `schemas/` folder of Zod payloads; forms (PART 11) import from there and nowhere else.

### Constraints
- Maximum module size: ≤ 50 files before a sub-split is required (to be decided by the module owner PR + architecture review).
- No circular imports between features (enforced by ESLint import rule: `import/no-cycle` maxDepth 3).
- Shared module may not depend on any other feature — it is a pure sink.

### Acceptance Criteria
1. An ESLint `import/no-restricted-paths` rule forbids `features/player` from importing `features/guardian` (and all other non-shared pairs) and passes green.
2. Each C-01..C-22 has exactly one home mutation file; grep for its server-function call name returns exactly one implementation.
3. Every Q-01..Q-12 query hook exists in `@/features/shared/queries/` and is re-exported explicitly by each consuming feature.
4. SCR-GRD-04 Consent Management is implemented entirely within `@/features/guardian/containers/ConsentManagementContainer.tsx` + private components; no sibling feature imports the private `ConsentPurposeToggle`.

### Risks
- R-03-01. `@/features/shared` becomes a dumping ground. Mitigation: council-accepted trace required per addition; quarterly "shared sink" audit.
- R-03-02. Command ownership ambiguity between organization + association (e.g., transfer: receiving org initiates, association approves). Mitigation: owner = initiator per IDN-JRN-001 PART 5, approval hook = same mutation's callback handler receives association decision via Q-12 decision history polling.

### Anti-patterns
- AP-03-01. Barrel `index.ts` with `export * from './containers/*'`. (Leaks L3 internals; breaks encapsulation.)
- AP-03-02. Organization feature directly copies `useGrantConsent` source instead of importing guardian's. (Duplicates domain behaviour in UI — the same Zod shape is defined twice.)
- AP-03-03. Shared module imports `@/features/player/types`. (Creates cycle.)

### Traceability
| Decision | Source Artefact | Clause |
| --- | --- | --- |
| Actor-area slicing (8 modules) | IDN-SCR-001 §3 | 7 areas + shared cross-cutting |
| C-xx ownership per primary actor | IDN-JRN-001 PART 4 | Primary actor column |
| Shared queries (Q-01..Q-12 cross actors) | IDN-API-001 §3, §5 | Resources are ubiquitous, queries are per-viewer projected |
| Internal 8-file structure per feature | IDN-UIC-001 §2 | Principle 6 Domain-Aware naming; Constraints ("no undocumented props") |
| Acyclic graph w/ shared sink | Constitution Art. 4 | Single Source of Truth — no duplicate contracts |

---

## PART 04 — Folder Structure

### Purpose
Define the definitive, governed layout of files and directories under `src/` such that any AI assistant can place generated code without architectural decision. A file in the wrong place is a defect.

### Scope
Full `src/` tree. Bounded-contexts outside Identity (later) replicate the pattern under `src/features/<context>/<area>/`.

### Inputs
- PART 02 Layered Architecture (L5→L1)
- PART 03 Feature Module Architecture (8 modules + internal structure)
- ADR-0001 Consequences (monorepo intent preserved as module boundaries; routes in `src/routes`)
- IDN-SCR-001 §3 50 screens × 7 areas
- Existing codebase conventions (`@/components/ui`, `@/lib/utils`, `@/hooks/use-mobile`)

### Outputs
Definitive directory tree.

### Dependencies
- None. This Part is the physical expression of PART 02 + 03.

### Architecture Decision
**`src/` directory tree (Identity Phase 0).** Items marked `[EXISTS]` are already in the repository and MUST NOT be relocated. Items marked `[NEW]` are created by this architecture.

```
src/
├── routes/                               [EXISTS — TanStack file-based routing]
│   ├── README.md                         [EXISTS]
│   ├── __root.tsx                        [EXISTS — PART 08 root guard shell]
│   ├── routeTree.gen.ts                  [GENERATED — DO NOT HAND-EDIT]
│   │
│   ├── (public)/                         [NEW — layout group, no auth; SCR-PUB]
│   │   ├── index.tsx                     → SCR-PUB-01 Landing
│   │   ├── login.tsx                     → SCR-PUB-02 Login
│   │   ├── register.tsx                  → SCR-PUB-03 Register (JRN-01/02)
│   │   ├── forgot-password.tsx           → SCR-PUB-04 Recovery Entry (JRN-17)
│   │   ├── lookup.tsx                    → SCR-PUB-05 Football ID Lookup (auth-gated)
│   │   └── legal.tsx                     → SCR-PUB-06 Legal & Consent Info
│   │
│   ├── (player)/                         [NEW — layout group, auth + player role]
│   │   ├── _layout.tsx                   → PlayerShell (PersonContext + sidebar)
│   │   ├── index.tsx                     → SCR-PLY-01 Dashboard (JRN-16)
│   │   ├── profile.tsx                   → SCR-PLY-02 Profile
│   │   ├── identity.tsx                  → SCR-PLY-03 Football Identity
│   │   ├── journey.tsx                   → SCR-PLY-04 Journey Timeline (read-only)
│   │   ├── membership.tsx                → SCR-PLY-05 Membership (ADR-0003)
│   │   ├── activities.tsx                → SCR-PLY-06 Activities (JRN-15)
│   │   ├── consent.tsx                   → SCR-PLY-07 Consent (adult only, minors: guardian)
│   │   ├── verification.tsx              → SCR-PLY-08 Verification (JRN-04/05)
│   │   ├── notifications.tsx             → SCR-PLY-09 Notifications
│   │   ├── settings.tsx                  → SCR-PLY-10 Settings
│   │   └── recovery.tsx                  → SCR-PLY-11 Identity Recovery (JRN-17)
│   │
│   ├── (guardian)/                       [NEW — layout group, auth + guardian role]
│   │   ├── _layout.tsx                   → GuardianShell (GuardianContext + child-switcher)
│   │   ├── index.tsx                     → SCR-GRD-01 Dashboard
│   │   ├── players.tsx                   → SCR-GRD-02 Linked Players (JRN-03, JRN-21)
│   │   ├── link-request.tsx              → SCR-GRD-03 Guardian Link Request (JRN-03)
│   │   ├── players/
│   │   │   └── $playerRef/               [NEW — opaque ref per ADR-0002]
│   │   │       ├── consent.tsx           → SCR-GRD-04 Consent Management (JRN-07/08/09)
│   │   │       ├── verification.tsx      → SCR-GRD-05 Guardian Verification (JRN-04)
│   │   │       └── annotate.tsx          → SCR-GRD-06 Guardian Annotation (STK-INV-003)
│   │   └── notifications.tsx             → SCR-GRD-07 Guardian Notifications (JRN-09)
│   │
│   ├── (organization)/                   [NEW — layout group, auth + org admin/coach]
│   │   ├── _layout.tsx                   → OrgShell (OrganizationContext)
│   │   ├── index.tsx                     → SCR-ORG-01 Dashboard (JRN-10, JRN-16)
│   │   ├── players.tsx                   → SCR-ORG-02 Player Directory
│   │   ├── memberships.tsx               → SCR-ORG-03 Membership Management (JRN-10/11/12)
│   │   ├── transfer.tsx                  → SCR-ORG-04 Transfer & Promotion (JRN-13/14)
│   │   ├── activity.tsx                  → SCR-ORG-05 Activity Management (JRN-15)
│   │   └── verification-queue.tsx        → SCR-ORG-06 Verification Queue (JRN-04/05)
│   │
│   ├── (association)/                    [NEW — layout group, auth + association role]
│   │   ├── _layout.tsx                   → AssociationShell
│   │   ├── index.tsx                     → SCR-ASC-01 Dashboard
│   │   ├── identity-admin.tsx            → SCR-ASC-02 Football ID Admin (JRN-06)
│   │   ├── verification.tsx              → SCR-ASC-03 Verification Adjudication (JRN-04/05)
│   │   ├── transfers.tsx                 → SCR-ASC-04 Transfer Review (JRN-13)
│   │   ├── duplicates.tsx                → SCR-ASC-05 Duplicate Resolution (JRN-18)
│   │   └── policies.tsx                  → SCR-ASC-06 Policy Monitoring
│   │
│   ├── (federation)/                     [NEW — layout group, auth + federation/CPO]
│   │   ├── _layout.tsx                   → FederationShell
│   │   ├── index.tsx                     → SCR-FED-01 Dashboard (VAP, NDI, JCS, CTI panels)
│   │   ├── directory.tsx                 → SCR-FED-02 National Directory & Lifecycle (JRN-19/20)
│   │   ├── policies.tsx                  → SCR-FED-03 Policy Administration (JRN-16 policies)
│   │   ├── analytics.tsx                 → SCR-FED-04 Analytics (VAP, NDI, JCS, CTI)
│   │   ├── audit.tsx                     → SCR-FED-05 Audit (Q-09)
│   │   ├── search.tsx                    → SCR-FED-06 Search (Q-02 national-scope)
│   │   ├── events.tsx                    → SCR-FED-07 Event Ledger (read-only)
│   │   └── revocation-review.tsx         → SCR-FED-08 High-Risk Revocation Review (JRN-09)
│   │
│   ├── errors/                           [NEW — SCR-SYS routes]
│   │   ├── 404.tsx                       → SCR-SYS-01 (general error via NotFound)
│   │   ├── 401.tsx                       → SCR-SYS-04 Session Expired
│   │   ├── 403.tsx                       → SCR-SYS-02 Access Denied
│   │   ├── 503.tsx                       → SCR-SYS-03 Maintenance
│   │   └── offline.tsx                   → SCR-SYS-05 Offline
│   │
│   ├── archived/$ref.tsx                 [NEW] → SCR-SYS-06 Archived Record
│   └── 404.tsx                           [EXISTS, but replaces content per PART 12]
│
├── features/                             [NEW — PART 03]
│   ├── public/                           (SCR-PUB containers, mutations C-01/C-18, schemas)
│   ├── player/                           (SCR-PLY containers, schemas)
│   ├── guardian/                         (SCR-GRD containers, mutations C-03/C-04/C-05/C-06/C-07, schemas)
│   ├── organization/                     (SCR-ORG containers, mutations C-08/C-11/C-12/C-13/C-14/C-15/C-16, schemas)
│   ├── association/                      (SCR-ASC containers, mutations C-02/C-09/C-10/C-17, schemas)
│   ├── federation/                       (SCR-FED containers, mutations C-19/C-20/C-21/C-22, schemas)
│   ├── system/                           (SCR-SYS layouts + error wrappers)
│   └── shared/
│       ├── components/
│       │   ├── AppShell.tsx              (header + sidebar + role-switcher + footer)
│       │   ├── PersonContextHeader.tsx   (Football ID, lifecycle, verification — per IDN-SCR-001 PART 5)
│       │   ├── OrganizationContextHeader.tsx
│       │   ├── GuardianChildSwitcher.tsx
│       │   ├── RoleContextSwitcher.tsx   (IDN-SCR-001 §2.2)
│       │   ├── AreaSidebar.tsx          (PART 06)
│       │   ├── AreaBreadcrumb.tsx       (PART 06)
│       │   ├── ActionPanel.tsx
│       │   └── StatusBadge.tsx          (PART 18 badge variants mapped)
│       ├── contexts/
│       │   ├── PersonContext.tsx
│       │   ├── OrganizationContext.tsx
│       │   └── GuardianContext.tsx
│       ├── hooks/
│       │   ├── useRoleCheck.ts          (PART 09 RBAC wrapper)
│       │   ├── useConsentGate.ts        (PART 09 consent-gate P1..P8)
│       │   ├── usePersonRef.ts          (resolve opaque personRef)
│       │   ├── useAreaNavigation.ts     (PART 06 nav items by role)
│       │   └── useLifecycleBadge.ts
│       ├── queries/                      (Q-01..Q-12 — PART 10 typed query hooks per IDN-API-001)
│       ├── schemas/
│       │   ├── api-envelope.schema.ts    (uniform error envelope per IDN-API-001 §P-12)
│       │   └── reference-types.schema.ts (opaque refs, display code)
│       └── types/
│           └── index.ts                  (Ref types, LifecycleState, ConsentPurpose, MembershipType, VerificationLevel etc.)
│
├── components/                           [EXISTS]
│   ├── ui/                               [EXISTS — shadcn/ui atoms. Do NOT add domain components here]
│   │   ├── button.tsx                    (IDN-UIC-001 §3.1)
│   │   ├── form.tsx                      (RHF wrapper — PART 11)
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   ├── table.tsx
│   │   ├── skeleton.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── sidebar.tsx
│   │   └── ... all existing [EXISTS] shadcn atoms stay
│   └── domain/                           [NEW — reusable domain components, stateless L2]
│       ├── football/
│       │   ├── FootballIdCard.tsx        (SCR-PLY-03 identity card)
│       │   ├── DisplayCode.tsx           (monospace, copy-to-clipboard, checksum visual)
│       │   └── FootballIdQr.tsx          (share-under-consent, PART 16)
│       ├── consent/
│       │   ├── ConsentBadge.tsx
│       │   ├── PurposeIcon.tsx           (P1..P8 icons mapped, Lucide)
│       │   └── HighRiskWarningBanner.tsx (JRN-09 preview consequence)
│       ├── membership/
│       │   ├── MembershipBadge.tsx       (Primary/Secondary, ADR-0003)
│       │   ├── TransferTrail.tsx         (JRN-13 decision trail)
│       │   └── EligibilityBadge.tsx
│       ├── verification/
│       │   ├── VerificationBadge.tsx     (L0..L3)
│       │   └── EvidenceGuidance.tsx      (OQ-02 floor, policy value)
│       ├── journey/
│       │   ├── JourneyTimeline.tsx       (SCR-PLY-04)
│       │   ├── ActivityTimeline.tsx      (SCR-PLY-06)
│       │   └── AuditTimeline.tsx         (SCR-FED-05)
│       ├── metrics/
│       │   ├── VapPanel.tsx              (SCR-FED-04)
│       │   ├── NdiPanel.tsx              (SCR-FED-04)
│       │   ├── JcsPanel.tsx              (SCR-FED-04)
│       │   └── CtiPanel.tsx              (SCR-FED-04, CTI halt semantics)
│       └── lifecycle/
│           ├── LifecycleBadge.tsx        (6 states + NEVER_ACTIVE flag)
│           ├── LifecycleTransitions.tsx
│           └── ArchivedRecordBanner.tsx   (SCR-SYS-06)
│
├── lib/                                  [EXISTS]
│   ├── utils.ts                          [EXISTS — cn()]
│   ├── error-capture.ts                  [EXISTS]
│   ├── error-page.ts                     [EXISTS]
│   ├── lovable-error-reporting.ts        [EXISTS]
│   ├── api/                              [NEW — PART 10 API client]
│   │   ├── client.ts                     (typed fetch wrapper, error envelope)
│   │   ├── query-keys.ts                 (Q-01..Q-12 key factories)
│   │   └── http.ts                       (retry + timeout + auth refresh)
│   ├── auth/                             [NEW — PART 08 session]
│   │   ├── session.ts                    (cookie-backed Lovable auth session)
│   │   ├── session.server.ts             (server-side only)
│   │   └── refresh.server.ts
│   ├── guards/                           [NEW — PART 09]
│   │   ├── role.guard.ts                 (RBAC, FR-ROL-01..05)
│   │   ├── consent.guard.ts              (ABAC purpose + age P5/P8 <13 deny)
│   │   ├── relationship.guard.ts         (membership scope, assignment scope, territory)
│   │   ├── child-protection.guard.ts     (STK-INV-004 structural absence)
│   │   └── visibility.ts                 (per-data-class visibility rules per CONSENT-001 §6)
│   ├── i18n/                             [NEW — PART 24 locale]
│   │   ├── id-ID.json
│   │   └── en-US.json
│   ├── forms/                            [NEW — PART 11]
│   │   ├── rhf-defaults.ts               (RHF + Zod resolver)
│   │   ├── wizard-engine.ts
│   │   └── draft-storage.ts              (autosave drafts in sessionStorage)
│   ├── observability/                    [NEW — PART 21]
│   │   ├── logger.ts
│   │   ├── analytics.ts
│   │   └── audit-client.ts
│   ├── offline/                          [NEW — PART 23]
│   │   ├── queue.ts
│   │   ├── sync.ts
│   │   └── conflict.ts
│   ├── performance/                      [NEW — PART 14]
│   │   ├── memoization.ts
│   │   └── virtualize.ts
│   ├── pwa/                              [NEW — PWA manifest + SW registration]
│   │   └── manifest.ts
│   └── identity.functions.ts             [NEW — ALL 22 C-xx + 12 Q-xx server functions, ADR-0001]
│
├── hooks/                                [EXISTS]
│   └── use-mobile.tsx                    [EXISTS — PART 16 responsive]
│
├── styles.css                            [EXISTS — PART 17/18 design tokens via @theme]
├── router.tsx                            [EXISTS — PART 05]
├── routeTree.gen.ts                      [GENERATED]
├── start.ts                              [EXISTS]
└── server.ts                             [EXISTS — SSR error wrapper]
```

### Rules
1. A route file under `src/routes/<group>/` MUST be ≤ 80 lines. It composes exactly one `<Shell>` + one L3 feature container. All business wiring lives in L3/L4, not in the route.
2. Domain components under `src/components/domain/` must NEVER import from `@/features/*`, `@/api/*`, or `@/guards/*`. They are pure presentational. If you need data, pass it via props.
3. Server functions live in ONE file per bounded context: `src/lib/identity.functions.ts` for Identity. Later contexts add `<context>.functions.ts`. They are never co-located with features. The API server surface (ADR-0001) is `src/lib/*.functions.ts` + `/api/public/*` in routes.
4. No route file (L5) directly imports anything from `@/lib/guards/*` except through `beforeLoad` / `loader` via PART 05 routing guards. Inline `if (!canX)` checks in route bodies are prohibited.
5. Every file name uses `kebab-case` for folders, `PascalCase.tsx` for components, `camelCase.ts` for hooks/lib (matching the existing codebase convention: `use-mobile.tsx`, `utils.ts`).

### Constraints
- TanStack Router file-based convention is mandatory. The `routeTree.gen.ts` is regenerated by the dev server; it is never edited by hand.
- The 8 existing shadcn components under `components/ui/` are preserved. New shadcn atoms installed via `shadcn add <atom>` are added to `components/ui/` only.
- Opaque route params use `$` prefix (TanStack convention): `$playerRef`, `$membershipRef`, `$verificationRef`. No route param is named `$displayCode` or `$footballId` in a position where the segment value would be logged in server access logs (ADR-0002) — use `$ref` everywhere.

### Acceptance Criteria
1. `grep -r 'useQuery' src/components/ui src/components/domain` returns 0 results (no data fetch in L2).
2. Every C-xx and Q-xx has exactly one entry in `identity.functions.ts`; grep for command/query names returns single match.
3. No `const { role } = useSession(); if (role === 'SCOUT')` exists in a route component body. Guarding is in `beforeLoad`.
4. SCR-GRD-04 path is `/guardian/players/$playerRef/consent` exactly, no `/guardian/child/John-Doe-2015/consent`.

### Risks
- R-04-01. File growth of `identity.functions.ts`. Mitigation: split by internal exported function grouping (person/consent/membership/policy sub-sections); one file remains the module boundary.
- R-04-02. TanStack Router `(layout groups)` vs route nesting confusion. Mitigation: PART 05 §Routing Tree explicitly names every group.

### Anti-patterns
- AP-04-01. A 400-line route file with inline `useForm`, inline `useMutation`, inline `useEffect` chains, and inline conditional renders.
- AP-04-02. Placing `FootballIdCard.tsx` in `components/ui/`. (It is a domain component, not a shadcn atom.)
- AP-04-03. `src/lib/consent.functions.ts`, `src/lib/membership.functions.ts` separate files. (Breaks one-file-per-context ADR-0001 structure.)
- AP-04-04. `src/routes/guardian/child/John-Doe/consent.tsx` with name in path. (Violates ADR-0002 opacity.)

### Traceability
| Decision | Source Artefact | Clause |
| --- | --- | --- |
| 7 area route groups → 50 routes | IDN-SCR-001 §3 | Screen IDs PUB/PLY/GRD/ORG/ASC/FED/SYS |
| Opaque `$playerRef` in routes | ADR-0002 rev. 2 | Decision §2; IDN-SCR-001 §2.6 Deep link rule 2 |
| `identity.functions.ts` single file | ADR-0001 | Decision §2 (server functions for app-internal logic) |
| L2 `components/domain/` stateless | IDN-UIC-001 §2 | Constraints: No API calls, No business logic |
| `features/shared/` cross-area composition | IDN-SCR-001 §2.2/2.3/2.5 | Shell, role-switcher, context headers |

---

## PART 05 — Routing Architecture

### Purpose
Define the complete TanStack Router tree: every route, its grouping, its loader-level guards for auth/authz/consent/age, dynamic segment semantics, error routes, and 401/403/404/503/offline screens mapped per IDN-SCR-001 SYSTEM area.

### Scope
All 50 SCR-xxx screens mapped to TanStack file routes. Role resolution at the root route; area guards applied at layout groups.

### Inputs
- IDN-SCR-001 PART 2 (§2.1 Public, §2.2 Authenticated, §2.3 Role-based, §2.6 Deep link, §2.7 Breadcrumb)
- IDN-SCR-001 PART 3 (SCR IDs); PART 4 (entry/exit conditions)
- PART 04 Folder Structure (route groups)
- PART 08 Authentication (session cookie, refresh)
- PART 09 Authorization (RBAC + ABAC order: Person→Role→Relationship→Consent→Age→Policy)

### Outputs
Complete route tree, guard-level rules, dynamic-ref semantic rules, error-mapping.

### Dependencies
- PART 04 (file layout)
- PART 08 (session)
- PART 09 (guards)

### Architecture Decision

#### 05.1 TanStack Router Tree

```
__root/                                                       AUTH SESSION GUARD (PART 08)
│                                                               breadcrumb: []
│
├── / (public landing)                    → SCR-PUB-01
├── /login                                 → SCR-PUB-02      (redirects to role-home if authed)
├── /register                              → SCR-PUB-03      (JRN-01 flow)
├── /forgot-password                       → SCR-PUB-04      (JRN-17 entry)
├── /lookup                                → SCR-PUB-05      (AUTH REQUIRED; rate-limit hint UI)
├── /legal                                 → SCR-PUB-06      (policies + P1..P8 plain language)
│
├── (player)                                 [AUTH + PLAYER_ROLE_GUARD; adult may see full; minor sees adapted; guardian-view-of-child uses same layout but PersonContext is child]
│   ├── /player/                           → SCR-PLY-01      breadcrumb: [Home, Player]
│   ├── /player/profile                    → SCR-PLY-02      breadcrumb: [Home, Player, Profile]   data-minimised by viewer
│   ├── /player/identity                   → SCR-PLY-03      breadcrumb: [Home, Player, Identity]  never URL-bar copyable display_code without viewer auth
│   ├── /player/journey                    → SCR-PLY-04      READ-ONLY. breadcrumb: [Home, Player, Journey]
│   ├── /player/membership                 → SCR-PLY-05      breadcrumb: [Home, Player, Membership] (ADR-0003 Primary+Secondary)
│   ├── /player/activities                 → SCR-PLY-06      breadcrumb: [Home, Player, Activities]
│   ├── /player/consent                    → SCR-PLY-07      AGE_GATE: adult only. If minor → redirect /guardian/players/$ref/consent (structural for minor's own view — not disabled)
│   ├── /player/verification               → SCR-PLY-08      breadcrumb: [Home, Player, Verification]
│   ├── /player/notifications              → SCR-PLY-09
│   ├── /player/settings                   → SCR-PLY-10
│   └── /player/recovery                   → SCR-PLY-11
│
├── (guardian)                               [AUTH + GUARDIAN_ROLE_GUARD]
│   ├── /guardian/                         → SCR-GRD-01      breadcrumb: [Home, Guardian]
│   ├── /guardian/players                  → SCR-GRD-02      breadcrumb: [Home, Guardian, Children]
│   ├── /guardian/link-request             → SCR-GRD-03      breadcrumb: [Home, Guardian, Link Request]
│   ├── /guardian/players/$playerRef/      [PERSON_SCOPE_GUARD: viewing guardian must have ACTIVE GuardianLink for ref; fails → 403 indistinguishable]
│   │   ├── consent                        → SCR-GRD-04      breadcrumb: [..., Child, Consent]
│   │   ├── verification                   → SCR-GRD-05      breadcrumb: [..., Child, Verification]
│   │   └── annotate                       → SCR-GRD-06      breadcrumb: [..., Child, Annotate Record]
│   └── /guardian/notifications            → SCR-GRD-07
│
├── (organization)                           [AUTH + ORG_ROLE_GUARD (coach or admin)]
│   ├── /org/                              → SCR-ORG-01      breadcrumb: [Home, Organization]
│   ├── /org/players                       → SCR-ORG-02      [MEMBERSHIP_SCOPE_GUARD: viewers see only their org's roster]
│   ├── /org/memberships                   → SCR-ORG-03
│   ├── /org/transfer                      → SCR-ORG-04      (JRN-13/14 initiator view only; approver in ASC)
│   ├── /org/activity                      → SCR-ORG-05
│   └── /org/verification-queue            → SCR-ORG-06
│
├── (association)                            [AUTH + ASSOC_ROLE_GUARD]
│   ├── /assoc/                            → SCR-ASC-01      breadcrumb: [Home, Association]
│   ├── /assoc/identity-admin              → SCR-ASC-02
│   ├── /assoc/verification                → SCR-ASC-03
│   ├── /assoc/transfers                   → SCR-ASC-04
│   ├── /assoc/duplicates                  → SCR-ASC-05
│   └── /assoc/policies                    → SCR-ASC-06
│
├── (federation)                             [AUTH + FED_ROLE_GUARD or CPO or PRIVACY_OFFICER]
│   ├── /fed/                              → SCR-FED-01      breadcrumb: [Home, Federation]
│   ├── /fed/directory                     → SCR-FED-02      (LIFECYCLE_GUARD: Archive C-19/Restore C-20 only here)
│   ├── /fed/policies                      → SCR-FED-03      (C-21 / C-22 Council role only)
│   ├── /fed/analytics                     → SCR-FED-04      (VAP, NDI, JCS, CTI with policy_version)
│   ├── /fed/audit                         → SCR-FED-05      (Q-09 access log for investigations)
│   ├── /fed/search                        → SCR-FED-06      (Q-02, national-scope; rate-limited; audited)
│   ├── /fed/events                        → SCR-FED-07      (READ-ONLY ledger)
│   └── /fed/revocation-review             → SCR-FED-08      (CPO only; JRN-09)
│
├── /errors/
│   ├── 401                                → SCR-SYS-04       Session Expired (return URL preserved)
│   ├── 403                                → SCR-SYS-02       Access Denied (NO "resource does not exist" info leak; same payload shape as 404 for unauth)
│   ├── 503                                → SCR-SYS-03       Maintenance (pls retry window)
│   └── offline                            → SCR-SYS-05       Offline (PART 23)
│
├── /archived/$ref                         → SCR-SYS-06       (ARCHIVED state — restore only via FED-02 by entitled)
│
└── ** (*) 404 (catch-all)                 → SCR-SYS-01 via PART 12 (NOT NotFound as vanilla text)
```

#### 05.2 Protected vs Public Routes

**Public (no session required):**
- `/` (landing), `/login`, `/register`, `/forgot-password`, `/legal`
- `/errors/*` (all error screens are public-renderable; they contextualise content based on session)

**Protected (session + role guard at beforeLoad):**
- `/lookup` → auth only (any role) + rate-limit UI hint
- `/player/*` → PLAYER role (or guardian acting via PersonContext switcher)
- `/guardian/*` → GUARDIAN role
- `/org/*` → ORG_ADMIN or COACH role
- `/assoc/*` → ASSOCIATION_OFFICER or VERIFICATION_AUTH or DATA_STEWARD
- `/fed/*` → FEDERATION_OFFICER or PRIVACY_OFFICER or CHILD_PROTECTION_OFFICER
- `/archived/$ref` → see rule below: entitlement per subject or FED role

**Protected + extra guards applied via `beforeLoad` (TanStack Router):**
- Layout group `(guardian)` applies `GUARDIAN_ROLE_GUARD` once; nested `/guardian/players/$playerRef/*` additionally applies `PERSON_SCOPE_GUARD(guardian_has_link_for($playerRef))` — if this fails, redirect to `/errors/403`.
- `/player/consent` applies `AGE_GATE(>=18)` — if under-18, redirect to guardian's equivalent page (if guardian link exists) OR to `/errors/403` (not disabled toggle — structural redirect).
- `/fed/policies` applies `COUNCIL_ROLE_GUARD` (no other federation role sees C-21/C-22 activate/retire buttons).
- `/fed/revocation-review` applies `CHILD_PROTECTION_ROLE_GUARD` (CPO only).

#### 05.3 Dynamic Routes
- Every `$Ref` param (`$playerRef`, `$membershipRef`, `$verificationRef`) resolves to an opaque UUID internally. The canonical display form (Football ID display code) is rendered on the page body, never in the URL (ADR-0002 rev. 2).
- Deep link rule (IDN-SCR-001 §2.6 rules 3–4): an unauthorised actor and a non-existent ref both return `/errors/403` with the same visual payload. No existence confirmation.
- Dynamic segment resolution never parses the segment for semantics (e.g., never `region = ref.slice(4, 6)`). If a resolver needs display code, it issues a lookup query Q-01.

#### 05.4 Error Routes
- **404 / Not Found:** `__root.tsx` notFoundComponent renders SCR-SYS-01 with a generic "the page you requested is unavailable" message. It MUST NOT distinguish between "never existed" and "exists but you may not see it" for any nested player/organization URL.
- **401 / Unauthenticated:** `__root.tsx` session-guard redirects to `/errors/401` with `?return=<encoded path>`. After login → navigate to return.
- **403 / Forbidden:** Any guard failure in any route's `beforeLoad` redirects to `/errors/403`. 403 payload contains no reason codes or hints that would confirm resource existence.
- **503 / Maintenance:** Application-level flag from `__root.tsx` loader — reads a build/env flag (PART 24). If set, every route's loader short-circuits and renders SCR-SYS-03.
- **Session Expired (SCR-SYS-04):** triggered by TanStack Query's `onError` handler (401 response) for any authenticated query → redirect `/errors/401?return=`.
- **Offline (SCR-SYS-05):** triggered by the network status hook (PART 12) → in-app route change to `/errors/offline` (replace state, not push).
- **Archived Record (SCR-SYS-06):** Q-01 GetPerson returns lifecycle=ARCHIVED → route navigates to `/archived/$ref` with contextual explanation and (for entitled) restore CTA.

### Rules
1. The `__root.tsx` `beforeLoad` hook performs **session hydration** only (PART 08). It does not render role-specific chrome. Role-specific chrome is computed inside AppShell via the `useAreaNavigation` shared hook.
2. Every role guard in a layout group fires once per area entry; it never re-fires on sub-navigation unless the session changes.
3. All guard redirects preserve the deep-link `return` query parameter so login flow returns the user to their intent.
4. Redirect to 403 on a child-scoped URL must happen BEFORE any query or data fetch occurs for that URL — do not issue a query and react to its 403; do it in `beforeLoad`.
5. Catch-all 404 does not log the user-visible URL segment value to analytics (PART 21) because the segment could contain accidentally-typed display codes or PII (ADR-0002).

### Constraints
- TanStack Router `beforeLoad` is the ONLY place for authorization decisions at the routing level. Route component bodies never re-evaluate `if (!userHasRoleX)` — they assume the guard passed.
- No route param may encode a birth year, region, club name, or any business fact. Use the opaque ref.
- The 404 screen never exposes the path that was not found to user-land telemetry. Only server-side logs may record it.

### Acceptance Criteria
1. Given an unauthenticated request to `/guardian/players/any-ref/consent`, `beforeLoad` redirects to `/login?return=%2Fguardian%2Fplayers%2Fany-ref%2Fconsent`.
2. Given a verified `SCOUT` role (PRG-STK-001 D5) attempting to navigate `/fed/directory`, the layout group guard redirects to `/errors/403` and the 403 payload does not say "federation only" (leaks role enumeration).
3. A 12-year-old authenticated Player session navigates `/player/consent` → `AGE_GATE` redirects structurally to `/guardian/players/$theirRef/consent` if they have a guardian link; otherwise to `/errors/403`. The page never renders a disabled consent form.
4. Navigating to `/archived/uuid-that-exists` vs `/archived/nonexistent` as a non-entitled viewer returns visually identical 403 pages (indistinguishable test).

### Risks
- R-05-01. Route guard performance (redundant re-checks on navigation). Mitigation: guards use session cache in PART 08; guard logic is memoised per session-signature.
- R-05-02. Information-leak via redirect timing. Mitigation: 403 and 404 take the same server wall-clock via an intentional fixed-delay window at the guard boundary.

### Anti-patterns
- AP-05-01. `const canConsentSelf = person.age >= 18` in `/player/consent` body, then rendering `<DisabledPanel reason="children use guardian">`. (Structural redirection is required; disabled-panel = violation of structural absence for <18 path.)
- AP-05-02. `/player/journey/$footballId/display-code-1234` in URL. (Display code is a body-level presentation, not a routing key — ADR-0002.)
- AP-05-03. 403 payload: "Your role 'Coach' may not view Federation pages." (Leaks enumeration hints.)
- AP-05-04. `/lookup` public access. (IDN-SCR-001 §2.1: Football ID Lookup is authenticated, rate-limited, audited.)

### Traceability
| Decision | Source Artefact | Clause |
| --- | --- | --- |
| 50 routes mapped to screens | IDN-SCR-001 §3, §4.1..§4.7 | every SCR ID → route |
| Opaque refs in dynamic segments | ADR-0002 rev. 2 | §Decision |
| Age gate structural redirect on PLY-07 for minors | CONSENT-001 §3 | minors: guardian grants |
| Scout cannot see Fed pages (no federation mapping) | PRG-STK-001 PART 4, D5 row | Scout permissions column |
| C-21/C-22 only Council | IDN-API-001 §4 C-21/C-22 | Authorization |
| SCR-PUB-05 authenticated only | IDN-SCR-001 §2.1 + §4.1 SCR-PUB-05 | Lookup auth gate |
| Indistinguishable 403/404 for existence denial | IDN-SCR-001 §2.6 Deep link rule 4 | |

---

## PART 06 — Navigation Architecture

### Purpose
Define the structure, composition rules, and behaviour of every navigational element across the 7 areas: sidebar (desktop), bottom navigation (mobile), breadcrumb, search (by area), quick-action panel, and deep-link semantics for internal + external URL reference.

### Scope
All navigation patterns used in the 50 screens. Aligns with IDN-SCR-001 PART 2 (§2.2 Authenticated, §2.3 Role-based, §2.5 Context, §2.6 Deep link, §2.7 Breadcrumb) and PART 5 Screen Layout Structure.

### Inputs
- IDN-SCR-001 PART 2 Navigation Architecture (binding UX contract)
- IDN-SCR-001 PART 5 — per-screen layout regions
- PART 05 Routing Architecture (7 area groups)
- PART 16 Responsive Strategy (375 mobile / 768 tablet / 1024 desktop / 1440 xl)
- PART 18 Design Token Integration (sidebar tokens, typography)

### Outputs
Sidebar definition, bottom-nav definition, breadcrumb definition, search-by-area, quick actions, deep-link rules.

### Dependencies
- PART 16 responsive breakpoints
- PART 05 routes + area guards

### Architecture Decision

#### 06.1 Sidebar (≥1024 desktop visible; 768–1023 drawer; <768 absent → replaced by bottom-nav + hamburger)
Implemented as the `AreaSidebar` component in `@/features/shared/components/AreaSidebar.tsx`. It composes the `SidebarProvider` from `@/components/ui/sidebar.tsx` [EXISTS] with role-resolved items.

Nav items by area (item label → target route; SCR source of the menu link):

**Authenticated area root.** Every sidebar starts with the same identity strip (top): App logo → Person display name → Role-Context Switcher (IDN-SCR-001 §2.2) → Football ID display code (monospace).

**Guardian area items (GRD):**
1. Dashboard → `/guardian/` (SCR-GRD-01)
2. Children → `/guardian/players` (SCR-GRD-02)
3. Link Request → `/guardian/link-request` (SCR-GRD-03)
4. Notifications → `/guardian/notifications` (SCR-GRD-07)
5. Child-scoped quick links populated by GuardianChildSwitcher selection (dynamic): Consent / Verification / Annotate → `/guardian/players/$ref/*`
6. Settings (role-invariant) → `/player/settings`

**Player area items (PLY):**
1. Dashboard → `/player/`
2. Profile → `/player/profile`
3. Identity → `/player/identity`
4. Journey → `/player/journey`
5. Membership → `/player/membership`
6. Activities → `/player/activities`
7. Consent → `/player/consent` (rendered only if adult; item absent if <18 — structural, not disabled, per PART 05 age gate)
8. Verification → `/player/verification`
9. Notifications → `/player/notifications`
10. Settings → `/player/settings`

**Organization area items (ORG):**
1. Dashboard → `/org/`
2. Player Directory → `/org/players`
3. Memberships → `/org/memberships`
4. Transfer & Promotion → `/org/transfer`
5. Activity → `/org/activity`
6. Verification Queue → `/org/verification-queue`

**Association area items (ASC):**
1. Dashboard → `/assoc/`
2. Football ID Admin → `/assoc/identity-admin`
3. Verification → `/assoc/verification`
4. Transfer Review → `/assoc/transfers`
5. Duplicate Resolution → `/assoc/duplicates`
6. Policy Monitoring → `/assoc/policies`

**Federation area items (FED — items adapt by sub-role):**
1. Dashboard → `/fed/`
2. Directory & Lifecycle → `/fed/directory` (entitled: FED, PRIVACY)
3. Policy Administration → `/fed/policies` (entitled: COUNCIL only — structural absence for FED non-council)
4. Analytics → `/fed/analytics`
5. Audit → `/fed/audit` (entitled: AUDIT, PRIVACY, CPO, COUNCIL)
6. Search → `/fed/search`
7. Event Ledger → `/fed/events` (entitled: COUNCIL, AUDITOR)
8. Revocation Review → `/fed/revocation-review` (entitled: CPO only)

Sidebar footer: Support link + legal link + theme switcher (PART 17).

#### 06.2 Bottom Navigation (≤767 mobile; ≤1023 tablet when drawer collapsed)
Fixed 48px tall bottom bar (PART 18 touch target rule ≥44px). Maximum 5 items per area; fewer where area has fewer primary screens. Icon-only with accessible labels.

Example guardian bottom-nav: [Home, Children, Notifications, Consent (dynamic child), Menu (hamburger opens drawer)].
Example org bottom-nav: [Home, Players, Activity, Queue, Menu].

Deep-drill screens (nested 2+ levels below home) retain bottom nav but highlight the top-level ancestor tab; breadcrumb (collapsed to single "up" on mobile, per IDN-SCR-001 §2.7) sits above content.

#### 06.3 Breadcrumb
Implemented as `AreaBreadcrumb` shared component. Uses the existing shadcn `@/components/ui/breadcrumb.tsx` [EXISTS]. Rules:
- Renders on screens ≥2 levels below area home (per IDN-SCR-001 §2.7 rule 1).
- Minor-identifying breadcrumb labels always use the masked display form when the viewer is not the guardian or self of the minor. E.g., `/guardian/players/FID-XXXX-XXXX-CC/consent` breadcrumb: `[Home, Children, Player ••••-58, Consent]`. The `FID-XXXX-XXXX-CC` never appears in full to a non-entitled viewer. It would leak.
- Breadcrumb is stateless navigation. Clicking it is a route change; it never triggers a submit, cancel, or unsaved-state action.
- Mobile collapses to "← <Parent screen name>" button with aria-label.

#### 06.4 Search
Three scoped search entry points — one per scope, one component variant each. NEVER a "global" player search (violates enumeration resistance and STK-INV-001 scoping):

| Search Scope | Entry Point Screen | Hook | Query | Scope Guards |
| --- | --- | --- | --- | --- |
| Roster Lookup | SCR-ORG-02 Player Directory | `useOrgPlayerSearch` | Q-02, org-scoped | Coach/Admin see own org roster only |
| Duplicate Search | SCR-ASC-05 Duplicate Resolution | `useDuplicateCandidateSearch` | Q-02, duplicate-detection-gated | Data Steward + Association |
| National Search | SCR-FED-06 Search | `useNationalPersonSearch` | Q-02, FED-scope | Federation only; audited every call |
| Football ID Lookup | SCR-PUB-05 | `useDisplayCodeLookup` | display-code lookup per IDN-SCR-001 | Authenticated; rate-limited UI indicator; every attempt audited |

Search component rules:
- Minimum 3 characters before any request fires (anti-enumeration).
- No client-side list filtering of an already-fetched full roster on the national search. Server paginates; client requests per page (PART 10 pagination).
- Result row click opens the detail via the opaque ref route, never an inline expansion that would enumerate neighbours.
- Search input + results both render accessible loading and empty states.

#### 06.5 Quick Action Panel
Per area dashboard, the right `ActionPanel` region (per IDN-SCR-001 PART 5 "Action Panel" column) renders the "what needs you" queue. Actions are always explicit buttons, never auto-advancing flows. Each action links to the deepest relevant route with pre-filled context (e.g., `/guardian/players/$playerRef/verification` with a pending evidence banner):

- Guardian Dashboard actions: (a) Verify new link request (b) Grant P2 for child at SSB X (c) Review high-risk revocation consequence (d) Respond to guardian annotation response
- Organization Dashboard actions: (a) Approve pending new membership (b) Record today's training attendance (c) Submit transfer request
- Association Dashboard actions: (a) Adjudicate verification queue (b) Review transfer disputes (c) Resolve duplicate pair
- Federation Dashboard actions: (a) Archive expired records (b) Activate policy vNext (c) Close high-risk revocation review

#### 06.6 Deep Link
Per IDN-SCR-001 §2.6, restated with TanStack specifics:
1. Every screen except SYSTEM screens is directly addressable → true by file routing in PART 05.
2. Deep links use opaque refs in URL: `personRef`, `membershipRef`, `verificationRef`. No `$clubName/$playerName/$year/`.
3. A forbidden deep link → `/errors/403`. 403 screen carries NO distinguishing details from 404.
4. Internal navigation to a deep link that fails consent-scoping (e.g., guardian navigates to `/guardian/players/$ref/consent` but P5 is for 12yo) → the query inside container fails the server RLS and the container wraps to 403. No partial render.
5. External deep links from email (recovery link, transfer notification) go through `/d/$token` (single-use short token resolver route) → validates token server-side → redirects to the final opaque-ref URL. Tokens expire per PART 08 session-like rules. No email links contain a `personRef` or display code in the clear.

### Rules
1. Sidebar and bottom-nav items are rendered from the `useAreaNavigation` shared hook, which returns ONLY items whose role + sub-role entitlement passes. An item the user may not see is absent from the array, not rendered as `disabled: true` (structural absence).
2. Breadcrumb labels for minor Person segments: use masked display form (4 chars, checksum) to non-entitled viewers. Full display code or name is only visible to the guardian/self/org-admin-of-membership viewers.
3. Search scopes: national search never ships to ORG; never a shared "global search bar" at the app shell header that federation users could type into. The entry point lives on the area dashboard only.
4. Quick action panel never auto-redirects on click — always a navigation push so browser back works.

### Constraints
- Sidebar width token: `--sidebar-width = 260px` (mapped to Tailwind via PART 18). Collapsed drawer: `--sidebar-collapsed = 72px`.
- Bottom nav uses icons only. Labels are aria-labels on mobile ≤767; icon + short labels on 768–1023 tablet landscape.
- Breadcrumb max depth visual limit: 4 crumbs on mobile, 6 on desktop. Truncate middle with overflow menu if longer.

### Acceptance Criteria
1. Given a `VERIFICATION_AUTH` (not DATA_STEWARD) session, the ASC area sidebar does not include "Duplicate Resolution" item; DOM is absent, not `disabled`.
2. Navigating `/org/players` as a COACH (not ORG_ADMIN) the search fires Q-02 org-scoped; data returned is exactly the players of the teams the coach is assigned to (PRG-STK-001 D1 scope).
3. Breadcrumb on SCR-GRD-04 for a `SCOUT` (not guardian) role forced-navigating via URL (e.g., app state injection) returns masked labels only, and the 403 guard in `beforeLoad` already redirected away — test both preconditions.
4. A "Grant Consent" quick action from Guardian dashboard preserves the `$playerRef` in the redirect target URL (verifiable by inspecting history state).

### Risks
- R-06-01. Role-switcher with many roles (guardian + coach + referee + org admin) causes sidebar overflow. Mitigation: scrollable area with sticky header/footer.
- R-06-02. Breadcrumb label masking causes confusion for the guardian ("••••-58" vs my child). Mitigation: guardian-context renders the full masked display code, while other roles see only the 4+2.

### Anti-patterns
- AP-06-01. A single header search icon that expands to a "search anything" input federation-wide. (Leaks enumeration surface; breaks search-scope guardrails.)
- AP-06-02. Sidebar that renders all items and CSS-marks disabled ones. (Structural absence required; disabled is a hint, not a wall.)
- AP-06-03. Breadcrumb: `[Home, Guardian, "Ahmad (12)", Consent]` with child's name visible to a federation officer navigating via the audit trail. (Non-entitled viewers must see masked labels.)
- AP-06-04. External email links containing `?displayCode=FID-XXXX-XXXX-CC`. (Exposes Football ID via inbox forwarding; use short tokens.)

### Traceability
| Decision | Source Artefact | Clause |
| --- | --- | --- |
| Role-context switcher in identity strip | IDN-SCR-001 §2.2 | Authenticated nav |
| Sidebar / bottom nav by area | IDN-SCR-001 §5 | Screen Layout Structure sidebar column |
| Breadcrumb rules (masked label, collapse on mobile) | IDN-SCR-001 §2.7 | all 4 rules |
| Search per scope (3 variants + lookup) | IDN-SCR-001 §4 screens + §2.1 lookup rule | SCR-ORG-02 (search+filter), SCR-ASC-05 (candidate filter), SCR-FED-06 (national search), SCR-PUB-05 (auth-gated lookup) |
| Quick action panel region | IDN-SCR-001 §5 | Action Panel column per screen layout |
| Opaque deep links + short-token email links | IDN-SCR-001 §2.6 Deep link rules 1–6 + ADR-0002 | opacity |

---

## PART 07 — State Management

### Purpose
Define every category of state in the application, where it lives, how long it persists, how it invalidates, and how it updates optimistically. The Constitution forbids inventing rules; it does NOT forbid choosing standard, traceable storage for each state category. This Part is the single source of truth for "use which, when".

### Scope
Global, Server, Local, Form, Session. Cache Strategy, Optimistic Updates, Invalidation, Offline Cache, Persistence.

### Inputs
- Constitution Art. 8 (Server-Side Authority — client state is presentation-only)
- PART 02 CQRS (Query cache server-populated; mutations produce events)
- PART 10 Query/Mutation invalidation rules
- PART 11 Forms (draft storage)
- PART 23 Offline Strategy (offline-first queue + rehydrate)
- PART 08 Session (cookie-backed auth, not JWT in localStorage)

### Outputs
Per-category owner, storage, lifetime, invalidation, and migration rules. Matrix + patterns.

### Dependencies
- PART 10 (query keys per Q-01..Q-12; mutation hooks per C-01..C-22)
- PART 11 (RHF form state, autosave drafts)
- PART 23 (offline)

### Architecture Decision
**No global state management library.** Every state category maps to a proven platform/TanStack primitive:

| Category | Owner | Storage | Lifetime | Invalidation | Persistence |
| --- | --- | --- | --- | --- | --- |
| Server state (read projections Q-01..Q-12) | TanStack Query Client (`queryClient`) | in-memory + stale-while-revalidate + indexedDB adapter (offline, PART 23) | per-query TTL in PART 10 | event-driven + explicit after C-xx mutation | Persist to indexedDB for offline reads (PART 23) |
| Session state (auth + role + scope + csrf) | Lovable Cloud auth SDK via `@/lib/auth/session` | httpOnly Secure cookie (L1 session) + in-memory mirror (re-hydrated from cookie each request) | sliding per PART 08 | refresh on 401; full wipe on logout; server-critical not writable client | Not persistent beyond cookie. User profile NOT in localStorage. |
| Local UI ephemeral state | React `useState` / `useReducer` | component memory | component lifetime | unmount destroys | never |
| Route state (filters, sort, page, selected tab, selected playerRef in list+detail) | TanStack Router `useSearch` / `loader` context | URL search params | per-route (history stack push on change for filter interactions) | navigation destroys | Persistent in URL; shareable/deep-linkable by design |
| Wizard / multi-step state | Wizard engine (`@/lib/forms/wizard-engine`) | URL search params `?step=N` + sessionStorage for sensitive intermediate values (PART 11) | wizard lifetime | cancel destroys; complete → clear | Never indexedDB. sessionStorage only per PART 11. |
| Draft / autosave form state | `@/lib/forms/draft-storage` | sessionStorage, keyed by (command, screenRef, sessionUserId) | per-session-tab (NOT cross-tab) | explicit Submit clears; Cancel clears; expiry 1h | NEVER localStorage. NEVER indexedDB. (Risk: drafts hold minor DOB / data.) |
| Optimistic UI state | TanStack Query `onMutate` → cache `setQueryData` rollback on error | in-memory only in React Query cache | until server confirms / rejects → server value overwrites | mutation response overwrites; rollback `onError` | never persisted |
| Offline write queue | `@/lib/offline/queue` | indexedDB, append-only, signed per command (PART 23) | until network restored + server ack | each entry removed on success; conflict records in PART 23 | Persisted offline, encrypted-at-rest key derived from session |
| Theme (dark/light/system) | `@/lib/theme` (PART 17) | `localStorage['idn-theme']` + Cookie (for SSR class) | forever (user preference) | user-toggle event | Yes (both) |
| Accessibility preferences (reduced-motion, high-contrast, text-size) | `@/lib/a11y` (PART 15) | Cookie + localStorage | per-device, long-lived | user change | Yes (both) |
| Identity strip context (PersonHeader Football ID, role, selected org) | `PersonContext`, `OrganizationContext` (shared) | React Context, hydrated from loader | per-area-session | role-switch or navigation | No |

#### 07.1 Cache Strategy (server state, TanStack Query)
Per-query TTL and stale time (default policy in `queryClient.setDefaultOptions`; overridable per query — PART 10):

| Query Family | staleTime | gcTime | Prefetch |
| --- | --- | --- | --- |
| Q-01 GetPerson (identity, critical) | 30s | 5 min | Yes (dashboards + detail routes) |
| Q-03 GetJourney (append-only by events) | 1 min | 10 min | Yes |
| Q-06 GetConsents (revocation must be instant next render — CONSENT-001 §3) | 0 (always revalidate) | 30 s | Yes (SCR-GRD-04 SSR prefetch) |
| Q-04 GetMemberships | 30 s | 5 min | Yes |
| Q-08 GetActivities | 30 s | 5 min | Yes |
| Q-09 GetAuditHistory, Q-11 GetOrganizations | 1 min | 10 min | Yes |
| Q-10 GetPolicies (versioned, immutable per version) | Infinity (by policy_id@version key) | 30 min | Yes |
| Q-02 SearchPersons (rate-limit + anti-enumeration) | 0 | 1 min | No (never prefetch search) |
| Q-07 GetVerification, Q-12 GetDecisionHistory | 15 s | 3 min | Yes |

#### 07.2 Optimistic Update Rules
Optimistic updates allowed ONLY on the following safe C-xx mutations where UI consistency matters more than 100% server-truth latency. Other C-xx wait for server and render loading spinner only:

| Mutation | Optimistic Target Cache Key | Rollback Trigger |
| --- | --- | --- |
| C-06 GrantConsent | Q-06 GetConsents (append ACTIVE grant) | `onError` → previous snapshot restored; toast: "Consent could not be saved, please retry." |
| C-07 RevokeConsent | Q-06 GetConsents (mark purpose REVOKED). Also Q-03 Journey (no Journey write, but remove P4/P5-dependent media card visibility). | `onError` → restore (but note: revocation rarely fails; if it does show a modal and keep the state change only after server confirm — the "effect first" in CONSENT-001 §10 is server-side; client-side we optimistically show the new state but the actual data access decision is server re-check). |
| C-14 AddSecondaryMembership | Q-04 GetMemberships (append row) | `onError` → rollback |
| C-15 RemoveSecondaryMembership | Q-04 GetMemberships (remove row) | `onError` → rollback |
| C-16 RecordActivity | Q-08 GetActivities (append with optimistic status=pending) | `onError` → mark row as failed (retry CTA). |

Other C-xx (RegisterPerson, IssueFootballIdentity, ReplaceGuardian, Transfer, Merge, Archive, Policy) NEVER optimistic. These are identity-foundation changes and MUST render confirmed state only after server ack. Present a `loading` state and disable double-submit (PART 11).

#### 07.3 Invalidation Rules
After a mutation's `onSuccess`, `queryClient.invalidateQueries({ queryKey: [...] })` is called for exact keys from PART 10 Query Key Factories. NO broad `invalidateQueries()` wildcard. Explicit key list per C-xx in PART 10 §Invalidation Keys per Command.

#### 07.4 Offline Cache
IndexedDB adapter `@tanstack/query/persistQueryClient` with:
- Max persisted entries = 200 (older LRU evicted).
- Encryption-at-rest key derived from session keyring (never stored unencrypted).
- Consent (Q-06) is NEVER persisted offline. Re-validated on wake.
- Journey (Q-03) full timelines are truncated offline to last 6 months of entries; full is server-only.

#### 07.5 Persistence Do-Not List
NEVER write to localStorage or indexedDB:
- Guardian verification evidence references
- Minor raw DOB (age-banded only is allowed offline)
- Display codes in bulk (a single card in identity page is fine; no full list cache)
- Consent evidence payload
- Audit trail entries (server-only; never persisted client)

### Rules
1. A component or feature that needs a new state category MUST pick one row from the matrix above. Adding Zustand, Redux, Jotai, or any new library is an ADR (Constitution Art. 2).
2. Route filters (search text, sort column, page, tab) live in TanStack Router search params, not React state. "Share this filtered list" = copy URL.
3. Wizard step = URL. Step number is a query param. Do not manage step in React state; browser back must go step-backwards.
4. Drafts go to sessionStorage only. A draft after tab close is gone — do not try to restore across sessions for data-minimisation reasons (NFR-04, STK-INV-001).
5. Optimistic updates MUST roll back on error. Never leave the client in an "apparently saved but server rejected" state without a visible error + corrective CTA.

### Constraints
- TanStack Query default `retry`: 0 for all mutations. 1 automatic retry (linear backoff 300 ms) for queries only. Never retry C-06/C-07/C-12/C-17 identity mutations on 4xx (only 5xx triggers 1 retry on queries).
- `persistQueryClient` never serialises `@tanstack/react-query` `meta` fields that may contain audit-sensitive notes. White-list only `queryKey` + `data` + `dataUpdatedAt`.

### Acceptance Criteria
1. After C-06 GrantConsent for P4_MEDIA on SCR-GRD-04, the photo placeholder on SCR-PLY-03 disappears on next render cycle WITHOUT a hard refresh (Q-06 invalidation + Q-01 Person projection re-fetch triggers dependent re-render).
2. Draft a long registration in SCR-PUB-03 (wizard) → close tab → re-open tab → draft gone (sessionStorage cleared). This behaviour is correct, not a bug.
3. Disconnect network → consent toggle P4 in SCR-GRD-04 → action enters offline write queue (PART 23) → reconnect → server ACK → UI reflects. No manual refresh required.
4. `/player/membership?type=Secondary&sort=startDate:desc` → copy URL → paste in incognito (after login) → same filtered view renders. Search params are the single source of filter truth.

### Risks
- R-07-01. IndexedDB offline cache size bloat on low-end Android devices (Phase 0 grassroots phones). Mitigation: LRU eviction + 6-month Journey truncation.
- R-07-02. Optimistic consent revocation race with query revalidation. Mitigation: Revocation `onSettled` waits server return before invalidating Q-06 (no invalidation mid-flight).

### Anti-patterns
- AP-07-01. `useState({ players: [], filters: {} })` in Player Directory instead of TanStack Query + Router search params. (Duplicates truth source.)
- AP-07-02. `localStorage.setItem('minor-dob', value)`. (Stores sensitive child data persistently — forbidden.)
- AP-07-03. `invalidateQueries()` with no args after any mutation. (Kills cache hit ratio; refloods server.)
- AP-07-04. C-12 Transfer optimistic. (Identity foundational mutation — never optimistic.)
- AP-07-05. Wizard step state stored in `useState(1)`, not in URL. (Browser back does not go to prev step; share mid-wizard fails.)

### Traceability
| Decision | Source Artefact | Clause |
| --- | --- | --- |
| Client state not authoritative | Constitution | Art. 8 (server-side checks) |
| No global store; use Query + Router + React hooks | ADR-0001 (TanStack Start stack: TanStack Router + React Query in deps) | package.json confirms |
| Consent revocation next-render immediate | CONSENT-001 §3, §10 | revocation takes effect immediately; next render reflects |
| Optimistic safe-list (not identity-foundation C-xx) | IDN-API-001 §4 | commands with high UI consistency need |
| Filters in search params (shareable) | IDN-SCR-001 §2.6 Deep link rule 1 | every (non-SYSTEM) screen directly addressable |
| Drafts sessionStorage | STK-INV-001 data minimisation | — |

---

## PART 08 — Authentication

### Purpose
Define the frontend-facing session lifecycle, refresh, logout flows, and three onboarding flows (Guardian, Player-adult, Association/Org officer). Backend auth is Lovable Cloud auth; this Part governs how the frontend consumes it.

### Scope
Session state access, login flow, refresh, logout, session expiry recovery, and the three onboarding journeys mapped from IDN-JRN-001.

### Inputs
- IDN-PRD-001 §8.3 (User & Authentication business capability: FR-AUT-01..07)
- IDN-JRN-001 JRN-01 Register, JRN-17 Recover Identity
- PRG-STK-001 PART 11 Identity Matrix (Youth<13 = no login; Youth 13–17 = guardian-approved login; Adult = own login; Guardian = L2+; Org Admin/Coach = L2+safeguarding; Scout = L3+accreditation)
- ADR-0001 (Lovable Cloud auth provider)
- PART 07 State Management (session = cookie)

### Outputs
Session wrapper, login flow steps, refresh trigger, logout semantics, and three onboarding skeletons.

### Dependencies
- PART 07 session state (httpOnly cookie)
- PART 05 routing (401, 403, return URL)
- PART 09 authorization (roles are consumed after auth)

### Architecture Decision

#### 08.1 Session Lifecycle
Mechanism: Lovable Cloud-managed httpOnly Secure SameSite=Lax cookie. Client NEVER stores JWT, user id, or Football ID in localStorage.

Session stages:
1. **No session** → all area routes redirect to `/login?return=...` via root beforeLoad.
2. **Anonymous session** (login page, register, legal, landing) — session cookie absent or empty.
3. **Authenticated session, unverified Person** (e.g., registered but Guardian L2 not reached) → user may only reach: dashboard area home that shows verification CTA; any other route guarded by L2 requirement redirects to its verification screen (not 403; helpful redirect to GRD-05 or PLY-08).
4. **Authenticated session, verified Person, role assigned** → normal area operations guarded by PART 09 rules.
5. **Session stale / refresh required** → automatic refresh (see below) succeeds → transparent; fails → redirect to 401 with `return=`.
6. **Logout (user-initiated or admin-revoked)** → destroy client cookie; navigate to `/login` with `loggedOut=true` query.

Session hydration in `__root.tsx` `beforeLoad`:
- `loader` calls server-side `getSession()` via `@/lib/auth/session.server.ts`; returns `SessionContextShape { authenticated, roles, verificationLevel, csrfToken, personRef, activeRoleContexts[], consentHeldPurposes: [] }`.
- This `SessionContextShape` is exposed to the app via React Context `AuthContext` (one context, not global). It is **not writable** client-side except via the server round-trips (login, refresh, logout). Refresh updates the context after cookie rotation.

#### 08.2 Refresh
Trigger conditions:
- Any TanStack Query response status 401 with code `SESSION_STALE` (from error envelope PART 12).
- Predictive refresh: If session expiry claim (obscured, not readable — the server returns a `refreshAfter` timestamp in the session loader response) is within 2 minutes of now → schedule background refresh 1 minute before.

Refresh algorithm:
1. Call `POST /auth/refresh` (Lovable Cloud endpoint or `@/lib/auth/refresh.server.ts` server function) — request carries the cookie; response rotates cookie.
2. On success: silent; rehydrate `AuthContext` and replay failed original query with identical parameters (TanStack Query retry callback).
3. On failure: clear session cookie; redirect to `/errors/401?return=<current>`.

Max refresh attempts per failed query: 1 (never loop). If refresh itself returns 401 → hard-expired.

#### 08.3 Logout
User-initiated (avatar menu → "Sign out"):
1. Call `POST /auth/logout` server-side (cookie invalidated server-side).
2. Clear `AuthContext`.
3. Navigate `/login?loggedOut=true`.

Admin-revoked / session-compromised:
- Any command returns 401 + code `SESSION_REVOKED` → refresh attempt once; if that fails with same code → Logout flow + toast session ended by admin.

#### 08.4 Guardian Flow (IDN-JRN-01 Register Person + JRN-03/04 Guardian Link + Verify)
Screens: SCR-PUB-03 Register wizard → SCR-GRD-03 Guardian Link Request → SCR-GRD-05 Guardian Verification → (after verified) → SCR-GRD-01 Guardian Dashboard.

Flow rules (mapped from JRN-01 + JRN-03/04):
1. Step 1 (Register Person): Guardian self-registers (adult Person record). Emits `PersonRegistered` → C-01.
2. Step 2 (Register Child): Guardian enters child's minimum attributes → emits C-01 for the minor Person → emits `FootballIdentityIssued` → C-02 (deferred, after guardian verified per SCR-ASC-02 Football ID issuance).
3. Step 3 (Claim Link): Guardian claims relationship via C-03 → `GuardianLinked`.
4. Step 4 (Verify Link): Guardian submits evidence → C-08 Request Verification → L1 (contact) auto-verifies in-app; L2/L3 queue → SCR-GRD-05 → SCR-ORG-06 or SCR-ASC-03 depending on delegated authority.
5. Step 5 (Grant Consent): Guardian lands SCR-GRD-04 → Grants P1, P2 at minimum. Other P3..P8 opt-in toggles, each separate.

Guardian flow exit: Only when Guardian L2 + P1+P2 active for ≥1 child is the Guardian Dashboard (SCR-GRD-01) fully populated. Before that, Dashboard shows ActionPanel CTA "Verify link for Ahmad →" / "Grant required consent →".

#### 08.5 Player Flow
Minor Player (<13): No independent login. Access to child records is ALWAYS through Guardian session. SCR-PLY-01..11 are rendered with PersonContext set to the child, via GuardianChildSwitcher. The url `/player/...` is for adult players and guardian-mediated views both; the viewer is determined by session.

Minor Player (13–17): Own login, guardian-approved (FR-AUT-04). Login is SCR-PUB-02; on first login, a guardian-approved flag is checked server-side. Session is scoped to "may view own age-appropriate Journey; may not grant/revoke own consent". Navigating `/player/consent` for 13–17 age redirects to `/guardian/players/$ref/consent` (consent is guardian-held).

Adult Player (18+): Own login, own consent authority (FR-AUT-02, CONSENT-001 §9 majority transition). SCR-PUB-02 → `/player/`; `/player/consent` is open (AGE_GATE passes).

#### 08.6 Association / Federation / Org Admin Flow
Invited flow, not self-register. Org Admin / Coach invite link (external short-token) lands on SCR-PUB-02 Login with `?invite=<token>`. After login, a server-side join accepts the role invitation. Association and Federation roles are invited by their respective superiors only — never self-assign (FR-ROL-04).

### Rules
1. The `AuthContext` value returned by the root loader is the ONLY client-side source of role truth. Components never parse cookie claims, never trust a JWT payload, and never "guess" roles from local storage.
2. Refresh attempts must never happen more than once per 30 seconds per tab (throttle). Background tabs pause refreshes via `visibilitychange` event.
3. Logout must wipe React Query cache entirely (`queryClient.clear()`). Do not leave stale person data rendered.
4. All three flows (Guardian / Player / Association) must display the same consent explanation copy from i18n dictionary per purpose (CONSENT-001 §12). No flow re-words consent — one source of copy.
5. On first creation of a minor Person, do NOT issue Football ID synchronously in register step. Issue Football ID is C-02 performed in SCR-ASC-02 later, per JRN-06. Register shows "pending ID issuance" badge on dashboard.

### Constraints
- Authentication cookie: httpOnly, Secure, SameSite=Lax. No accessible to JS by design. If for testing the auth SDK exposes token via any JS-accessible path → wrap + sanitise before passing to Layers 2–5.
- Lovable Cloud MFA: required for PLATFORM I-group roles (Super Admin, Compliance, Security — PRG-STK-001 I1, I4, I5). Frontend must step-up if server returns 401 `MFA_REQUIRED` on accessing FED area routes. Step-up flow: redirect to `/mfa-challenge?return=...`.

### Acceptance Criteria
1. Guardian at L0 (unverified) registers a child → Dashboard child switcher shows the child row + displays "Verification required" status; any attempt to navigate `/guardian/players/$ref/consent` is blocked by verification-level guard, redirects to verification page (not 403).
2. Minor player (12yo) session opens `/player/consent` → structural redirect to `/guardian/players/$ref/consent` if guardian link active, else 403. No disabled consent page rendered.
3. A network 401 on Q-06 GetConsents triggers exactly one refresh; if refresh succeeds, query replays transparently; if refresh fails, 401 screen. (Chrome DevTools Network log shows ≤2 failed calls.)
4. Logout button → `queryClient.clear()` → Login → Dashboard renders a fresh person, not cached previous session.

### Risks
- R-08-01. Predictive refresh timing visible via CPU wakes on mobile (battery impact). Mitigation: jitter ±30s.
- R-08-02. Cookie rotation race between concurrent tabs. Mitigation: Refresh lock via BroadcastChannel for multi-tab; only one tab performs refresh.

### Anti-patterns
- AP-08-01. `const token = localStorage.getItem('auth-token')` → `Authorization: Bearer ${token}`. (Forbidden. Use cookie.)
- AP-08-02. Register step issues `FootballIdentityIssued` inline. (Violates JRN-06 as an Association-delegated authority step.)
- AP-08-03. 13–17yo session lands on `/player/consent` and renders "Ask your guardian to manage this" disabled screen. (Structural redirect required.)
- AP-08-04. Association Officer self-assigns role via `role: ['ASSOC']` POST body in register. (Violates FR-ROL-04: roles stored independently; never self-asserted.)

### Traceability
| Decision | Source Artefact | Clause |
| --- | --- | --- |
| No <13 independent login | PRG-STK-001 PART 11 Identity Matrix row Youth Player | PRG-STK-001 A1 identity |
| 13–17 guardian-approval | FR-AUT-04 | IDN-PRD-001 |
| One Person → one User (no multi-account) | FR-AUT-01, Constitution #3 | IDN-PRD-001 §8.3 |
| Guardian consent authority for minors (redirect pattern) | CONSENT-001 §5 | Guardian verification L2 |
| Roles stored independently, invited | FR-ROL-04 | IDN-PRD-001 §8.8 |
| Recovery never re-issues Football ID | JRN-17 + ADR-0002 | permanence |

---

## PART 09 — Authorization

### Purpose
Define the client-side visibility and server-side enforcement composition rules across the four guard categories (Permission, Role, Consent, Child Protection). Client decisions are PRESENTATION ONLY; server re-evaluates every call per Constitution Art. 8.

### Scope
Five guard types, visibility rules per data class (CONSENT-001 §6 matrix), and structural absence of U13 scouting capabilities.

### Inputs
- PRG-STK-001 PART 8 Permission Matrix, PART 9 Privacy Matrix, PART 10 Consent Matrix, PART 12 Lifecycle
- PRG-STK-001 STK-INV-001 (data minimisation), STK-INV-002 (evidence authority), STK-INV-004 (structural prohibition U13×Scout)
- CONSENT-001 §6 Access Rights Matrix, §3 closed purposes (P1–P8), §3.1 P8 L2 required
- IDN-PRD-001 FR-ROL-02 Authorization evaluation order: Person→Role→Relationship→Consent→Age Gate→Policy
- IDN-API-001 P-10 (same order, deny default)

### Outputs
Guard resolver hooks (client-side visibility), data-class visibility filters, structural absence rules for forbidden capabilities.

### Dependencies
- PART 08 Session context (provides authenticated Person + roles)
- PART 07 (useRoleCheck, useConsentGate shared hooks)
- PART 05 (route-level `beforeLoad` application of guards)

### Architecture Decision

#### 09.1 Guard Composition Order
Every visibility decision on the client (both route-level `beforeLoad` and container-level "should render X?") executes in a fixed order matching IDN-PRD-001 FR-ROL-02 and IDN-API-001 P-10:

```
1. PERSON_GUARD      authenticated? session active? Person record non-archived?
2. ROLE_GUARD        has the required role for this action? (RBAC coarse)
3. RELATIONSHIP_GUARD has the active Membership / Assignment / Territory / Jurisdiction scope?
4. CONSENT_GUARD     is purpose P-x ACTIVE for the subject? (ABAC fine-grained)
5. AGE_GATE          is subject >= threshold age for P5_SCOUTING / P8_AI? (structural under-13 deny)
6. POLICY_GUARD      policy version in force, time-boxed scope, transfer window, retention?
```

Failure at ANY step → the capability is not rendered. At the route guard level, this becomes a redirect. At the component level, this means:
- The element is ABSENT from the DOM (structural), not `display:none` and not `disabled`.
- An info-only banner MAY replace the action for low-stakes cases; never for a child-protection case where absence is structural (STK-INV-004).

#### 09.2 Permission Guards (fine-grained, per action)
Mapping of IDN-API-001 permissions to hooks. Each C-xx / Q-xx exposes a permission string that the server knows. The client-side resolver asks: "may session holder call C-07 on this playerRef?" → boolean. The resolver does NOT decide; it asks a memoised server-issued permission claims snapshot that was delivered in the PART 08 Session Loader response (scoped to active roles and relationships). If a permission is absent from the snapshot → visibility = hide.

Permission claims snapshot: `Record<PermissionKey, { scope?: ScopeFilter, grantedUntil: ISO8601 }>`. Example keys:
- `identity:consent:grant:self` (adult player granting own P7)
- `identity:consent:grant:guardian` (guardian granting minor P4)
- `identity:membership:create:primary`
- `identity:transfer:approve`
- `identity:merge:perform`
- `identity:policy:activate` (council only)
- `identity:scouting:view` — if the snapshot does not contain this key for a viewer → the scouting view does not exist in DOM. For U13 subjects, even if this key EXISTS → AGE_GATE returns deny (structural).

#### 09.3 Role Guards (RBAC Coarse)
Role set per IDN-PRD-001 FR-PER-02 multi-role, one account:
`'PLAYER' | 'GUARDIAN' | 'COACH' | 'ORG_ADMIN' | 'REFEREE' | 'SCOUT' | 'VERIFICATION_AUTH' | 'ASSOCIATION_OFFICER' | 'DATA_STEWARD' | 'FEDERATION_OFFICER' | 'PRIVACY_OFFICER' | 'CHILD_PROTECTION_OFFICER' | 'PLATFORM_SUPPORT' | 'PLATFORM_SUPER_ADMIN' | 'AUDITOR'`

Role check returns true if any of the OR-set matches. Multi-role union of permissions (PRG-STK-001 PART 5 multi-role rule: permissions union, each evaluated independently; Coach-of-team-A does not see own-child-as-player via coach scope).

#### 09.4 Consent Guards (ABAC Purpose + Age)
Consent Purpose enum P1..P8 from CONSENT-001 closed list.

Hook: `useConsentGate(subjectPersonRef, purpose) → { active: boolean, reason: ConsentDenyReason }`
Reasons: `NO_GRANT | WRONG_VERIFICATION_LEVEL | AGE_PROHIBITED | REVOKED | EXPIRED`.

Client-side rules:
- P8 AI Training: require verification level ≥ L2 (CONSENT-001 §3.1 rule 2). If Guardian L1, deny.
- P5 Scouting: require subject age ≥ 13 (CONSENT-001 §3 rule 4 under-13 prohibited). If age < 13, deny AND the UI does not show a P5 toggle AT ALL on SCR-GRD-04 for that child (structural absence, not disabled = STK-INV-004).
- P1 + P2: required for SSB participation (CONSENT-001 §3 rule 1). Dashboard warning tiles render if missing. Revoking P1/P2 triggers high-risk revocation flow (CONSENT-001 §10).

#### 09.5 Child Protection Guards (Structural Prohibitions STK-INV-004)
Structural absence rules — client-side code paths + routes + components do not exist. Not a runtime permission=false branch:

| Forbidden Capability | Structural Absence Enforcement |
| --- | --- |
| Under-13 × P5_SCOUTING (any access path) | (a) P5 toggle not rendered in ConsentContainer guardian panel for <13; (b) `/scout/*` route file not in route tree; (c) SCOUT role area sidebar has no "U13 Prospects" item (because it was never defined in PART 06 sidebar); (d) domain `ScoutShortlistCard` component is not in `components/domain/`. |
| U13 × P8 AI training entry | P8 toggle in ConsentContainer checks age and returns structural. |
| Venue actor accessing any player data (STK-INV-001) | Venue role has no routes in PART 05 (Venue is org-operational in a later context; no Identity UI surface exists for venue user). |
| Commercial partner player-level (STK-INV-001) | No Commercial role entry in the router. Later analytics context provides aggregate exports only. |

A feature branch that adds any of the above is a Constitution violation. An AI assistant that adds them MUST be refused at code review.

#### 09.6 Visibility Rules (per data class, mapped from CONSENT-001 §6 matrix)
Implemented as `@/lib/guards/visibility.ts`. Takes `(viewer, subject, dataClass)` → VisibilityDecision. Example decisions:

| Data Class | Guardian viewer | Own Coach viewer | Org Admin | Scout viewer | Association | Other/anon |
| --- | --- | --- | --- | --- | --- | --- |
| Name + Photo | R/W | R | R | if P4+P5+age≥13 | if P6 | — |
| DOB raw | R/W | age band only | age band only | age band only | R (if P6, dispute-scoped) | — |
| Contact details | R/W | — | — | — | — | — |
| Health/medical notes | R/W | emergency fields only | — | — | — | — |
| Membership history (all orgs) | R | — (own org only) | own org only | if P5 + age≥13 | if P6 | — |
| Assessments | R if P3 | R/W if P3, own authored | — | if P5 + P3 + age≥13 | — | — |
| Consent grants | R/W | — (status only: active/inactive) | — | — | — | — |

Data-class visibility is ALWAYS enforced at the QUERY PROJECTION level server-side via RLS (Constitution Art. 8). Client-side visibility is a secondary convenience (e.g., hide phone column from Coach in roster table); the server must STILL return `null` for Coach view of contact details even if a malicious client inspects JSON.

### Rules
1. Every C-xx mutation hook is decorated with a permission check via the claims snapshot BEFORE rendering the trigger button. If permission absent → button not rendered; tooltip explanation in Info banner only for low-stakes.
2. AGE_GATE denial of P5/P8 must hide the toggle row, not grey it. The purpose label + explanation must also be absent — the guardian must not feel that "something is being denied to them that others get" for a structural prohibition.
3. Multi-role user: union of role permissions, BUT per-relationship scoping trumps role. Being a Coach never expands a Guardian's view of their own child's data (no accidental cross-read of child via coach-role wildcard).
4. Break-glass (PLATFORM I roles) must render a persistent visual banner "Break-glass session in progress — access logged" throughout the session during any elevated action (per PART 21 audit).

### Constraints
- The permission claims snapshot has a TTL of 5 minutes. After that, a route change triggers a server re-fetch of the claims in the root loader. Client never uses a stale snapshot older than 10 minutes (force refresh).
- Permission claims snapshot does NOT contain raw list of all Football IDs the user may see. It contains scope predicates. Scope evaluation for large sets happens server-side in the query path.

### Acceptance Criteria
1. Guardian session with L1 only opens SCR-GRD-04 for 14yo child: P8 toggle row is ABSENT (render zero rows at P8 position), not disabled. Reason in audit log: WRONG_VERIFICATION_LEVEL.
2. Guardian session with L2 opens SCR-GRD-04 for 11yo child: P5 toggle row is ABSENT. Reason: AGE_PROHIBITED (structural).
3. Coach of Team A (viewer) is also Guardian of Child B (subject NOT in Team A roster): the Coach's Org Directory search DOES NOT return Child B row. (Server RLS enforced; client hook hides empty results gracefully.)
4. PLATFORM_SUPPORT accessing SCR-GRD-04 of a child during a break-glass ticket: screen shows "Break-glass access — logged" persistent banner. (PART 21 audit.)

### Risks
- R-09-01. Permission snapshot too large → slow root loader. Mitigation: scope predicates encoded, not expanded.
- R-09-02. Age band under-13 vs exact DOB off-by-one around birthday. Mitigation: age is computed server-side at query time, not client-side from a DOB field.

### Anti-patterns
- AP-09-01. `{(perms.includes('scout:view') && person.age >= 13) && <ScoutPanel />}`. The panel should not exist at all; branch in code = still a DOM path someone might force to true. Use structural absence: ScoutPanel deleted, route segment not in tree.
- AP-09-02. `<Button variant="outline" disabled>Grant P5 — not available for under-13</Button>`. (Disabled, not absent.)
- AP-09-03. `const isAdmin = session.roles.includes('ADMIN')` used to both hide the UI AND skip the server-side guard call. (Violates dual-hint + hard-stop.)
- AP-09-04. Roster table renders the Contact column for Coach viewer and just CSS-hides the values. (Server must return null for the cell; client never sees it.)

### Traceability
| Decision | Source Artefact | Clause |
| --- | --- | --- |
| 6-step guard order | FR-ROL-02 + P-10 | IDN-PRD-001; IDN-API-001 |
| Permission claims (not hard-coded role→button maps) | PRG-STK-001 PART 8 | explicit per-role, per-scope matrix |
| Visibility data class matrix | CONSENT-001 §6 | full table |
| Structural absence of U13×P5/P8 | STK-INV-004 | PRG-STK-001 PART 2.1 |
| Consent purpose-level gates P5/P8 age + level | CONSENT-001 §3, §3.1 | rules 1..4 + 3.1 rules 1..8 |
| Server re-evaluates every call | Constitution | Article 8 |

---

## PART 10 — API Client Architecture

### Purpose
Define the single canonical pattern for consuming the Identity Domain API (IDN-API-001). Enforces CQRS separation, standardised error envelopes, idempotent mutations, projection-parametrised queries, and caching rules aligned with PART 07 Server-State category.

### Scope
Every client-side call to C-01..C-22 commands and Q-01..Q-12 queries. Covers query hook signature, mutation hook signature, error envelope parsing, retry behaviour, pagination/filtering/search/sorting/projection conventions, and cache keys.

### Inputs
- IDN-API-001 PART 2 (P-01..P-13 Principles: P-02 no business logic on edge, P-04 CQRS, P-10 authz order), PART 3 Commands (C-01..C-22) and PART 4 Queries (Q-01..Q-12)
- IDN-API-001 standard error envelope, idempotency-key requirement, event emissions
- PART 07 Server-State = TanStack Query cache
- PART 08 Session (cookie transport, refresh, 401 handling)
- PART 09 Permission claims snapshot (decorates hook enablement)

### Outputs
A concrete hook factory convention `@/lib/api/queries/<resource>.ts` and `@/lib/api/mutations/<resource>.ts`; a shared `useApiClient()`; standard types `ApiError`, `ApiEnvelope<T>`, `Page<T>`.

### Dependencies
- PART 07 (cache category, invalidation, optimistic update rules)
- PART 08 (cookie-only transport; no Bearer tokens)
- PART 12 (error shape; global error boundary consumes ApiError)
- ADR-0001 (server functions live in `src/lib/<context>.functions.ts`)

### Architecture Decision

#### 10.1 Transport & Envelope
Transport: TanStack Start server functions exclusively (per ADR-0001). **No `fetch('/api/...')` from client browser code.** All network calls go through a server function module that re-exposes C-xx / Q-xx as typed async functions.

Server function location: `src/lib/identity.functions.ts` — single file per bounded context.

Client-side wrapper: `@/lib/api/client.ts` exports typed wrappers `identity.functions.ts`. This wrapper applies:
1. CSRF token (from PART 08 Session loader) on mutating calls.
2. Standard envelope deserialisation: every response = `{ ok: true, data: T } | { ok: false, error: ApiError }`. Never a naked `T`; never a naked error throw.
3. Network-offline detection: if `navigator.onLine === false` → reject with `{ ok:false, error: { code: 'NETWORK_OFFLINE', ... } }` without reaching server.

`ApiError` shape (matches IDN-API-001 error schema):
```
{
  code:          // machine-readable: SESSION_STALE, PERMISSION_DENIED, CONSENT_REQUIRED,
                 // AGE_PROHIBITED, VALIDATION_FAILED, IDEMPOTENCY_CONFLICT, ...
  message:       // Bahasa Indonesia (i18n key for client override of raw server message)
  traceId:       // audit correlation (logged, never shown to end user except PLATFORM roles)
  fieldErrors?:  // { fieldPath: i18nKey } — for FORM validation rollups (PART 11)
  retryable:     // boolean — controls retry strategy below
}
```

#### 10.2 Query Pattern (Q-01..Q-12)
Hook convention per query — one file per query in `@/lib/api/queries/useGetPerson.ts`, etc.

```ts
// Signature (pseudo) — every query hook MUST implement this pattern
function useGetPerson(args: {
  personRef: PersonRef           // NEVER display code / name / DOB — ADR-0002
  projection?: PersonProjection  // optional field-set filter (server enforces RLS over projection)
  staleTime?: number             // override default (default = per-query §10.6)
}) : UseQueryResult<PersonDto, ApiError>
```

Query key convention — always a tuple with explicit type discriminator so cache invalidation is precise:
```
['q', 'GetPerson', personRef, { projection } ]
['q', 'SearchPersons', { filters, page, sort, projection } ]
['q', 'GetJourney', journeyRef ]
```

Never a naked string key. Never `queryClient.invalidateQueries()` with no argument (wholesale cache wipe = anti-pattern).

#### 10.3 Mutation Pattern (C-01..C-22)
Hook convention per command — one file in `@/lib/api/mutations/useRegisterPerson.ts`.

```ts
function useRegisterPerson() : UseMutationResult<
  { personRef: PersonRef, event: PersonRegistered },
  ApiError,
  { payload: RegisterPersonPayload, idempotencyKey: string }
>
```

Idempotency: Every mutation hook **auto-generates** a UUID v4 idempotencyKey (attached to the server function call `X-Idempotency-Key`) and stores `{key, payloadHash, result}` in sessionStorage for 7 days. Re-submission within 7 days with identical payload → return the cached result without server round-trip. Explicit user re-try (after fix) → fresh key.

Optimistic update: Each mutation hook OPTIONALLY exports `optimisticConfig(cacheKey, draftSnapshot)` factory that TanStack Query `onMutate` consumes. Implementation rules: snapshot old cache → write draft → `onError` rollback snapshot → `onSuccess` invalidate precise keys (never full wipe). See PART 07 §07.7.

#### 10.4 Error Handling in Hooks
TanStack Query `meta` field carries:
```
meta: {
  toastOnError: boolean    // true = Sonner toast (PART 12); false = form rolls up
  toastOnSuccess?: string  // i18n key for success toast (e.g. 'consent_granted_ok')
  permissionKey?: string   // PART 09 permission snapshot key → if absent, hook.enabled = false
  rollbackFields?: string[]// which RHF fields to setError on VALIDATION_FAILED
}
```

On `SESSION_STALE` (401) → PART 08 refresh flow fires exactly once; on success → replay the failed query/mutation with identical params; on failure → 401 screen.

On `PERMISSION_DENIED` / `AGE_PROHIBITED` / `CONSENT_REQUIRED` → **never retry**; route error boundary or route `beforeLoad` guard redirects to the appropriate screen.

#### 10.5 Pagination / Filtering / Search / Sorting / Projection
All list queries (Q-02 SearchPersons, Q-10 GetPolicies, Q-12 GetOrganizations) support:

| Concern | Convention | Source |
|---|---|---|
| Pagination | Cursor-based `{ after?, first: 25, before?, last? }`. Default page size 25, max 100. Server-enforced cap. | IDN-API-001 P-07 pagination rule 2 |
| Filtering | URL searchParams → typed object. Example: `?role=PLAYER&orgRef=ORG_123&status=ACTIVE`. Shared hook `useRouteFilters<T>()` serialises/deserialises to URL (PART 07 §07.5 category Route=URL). | IDN-SCR-001 §2.6 Deep-link rule 1 shareable URL |
| Search | Free-text `q=` param, server applies RLS-scoped FTS. Debounce 300ms client-side. Empty string → no `q=` param sent. | — |
| Sorting | `sort=<field>:[asc|desc]`, multi-sort comma-separated. Server defines allowed sortable fields; unknown sort fields silently ignored (never error). | — |
| Projection | `fields=f1,f2,f3` comma list mapped to `Projection` DTO type. Server RLS trims unauthorised fields even if requested. Client defaults = standard projection per screen; opt-in expansion for detail views. | STK-INV-001 data minimisation |

#### 10.6 Caching & Invalidation
Per-query `staleTime` defaults (ms):

| Query | staleTime | gcTime | Notes |
|---|---|---|---|
| Q-01 GetPerson | 60_000 | 300_000 | Low-churn identity data |
| Q-06 GetConsents | 30_000 | 120_000 | Changes via C-06/C-07; invalidate on those mutations success |
| Q-03 GetJourney | 0 | 60_000 | Append-only event stream; always refetch on mount |
| Q-04 GetMemberships | 30_000 | 180_000 | Invalidate on C-12..C-16 membership events |
| Q-11 GetAuditHistory | 0 | 30_000 | Never cache audit — always fresh |
| Q-09 GetActivities | 15_000 | 60_000 | Attendance written frequently |

Invalidation: On mutation `onSuccess`, call precise invalidation:
```
queryClient.invalidateQueries({ queryKey: ['q', 'GetPerson', personRef] })
queryClient.invalidateQueries({ queryKey: ['q', 'GetConsents'], predicate: k => ... })
```
Never `queryClient.clear()` outside of logout.

#### 10.7 Retry Strategy
Policy — TanStack Query `retry` per-call:
- Query GET-like: `retry: (failureCount, error) => failureCount < 3 && error.retryable` — backoff exponential 500→1000→2000ms + jitter ±20%.
- Mutation: `retry: 0` **never auto-retry a command.** User must explicitly re-submit (idempotency key protects duplicate server writes; browser-native retry during POST may double-submit if we auto-retry).
- Network 5xx → retryable = true. Network 4xx (client) → retryable = false unless code = `SESSION_STALE` (handled by refresh flow).

### Rules
1. There shall be exactly ONE implementation file per C-xx and ONE per Q-xx. No ad-hoc `useEffect` + `fetch` anywhere in layers 2–5.
2. All mutation calls carry an idempotency key generated at hook invocation time (not at submit time). Re-render does not regenerate; submit-time generation only on explicit Retry action.
3. Error envelope ok/false must be the ONLY way a server function reports error. Server functions NEVER `throw new Error(...)` for domain errors; throws only for catastrophic infrastructure failure (Postgres down) → PART 12 global boundary.
4. Query hooks accept projection; default projection omits contact/health fields unless the caller explicitly opts in AND viewer has the right consent+relationship per PART 09.

### Constraints
- No `axios`, no `ky`, no raw `fetch` imports in components/features. All transport = TanStack server function → client wrapper → hook.
- TanStack Query `throwOnError` is disabled globally. Errors surface via `error` property only. (Prevents Suspense fallback swallows for domain errors.)

### Acceptance Criteria
1. `useRegisterPerson` submitted twice with identical payload → second call returns cached result, Network tab shows 0 new POST. (Verify in DevTools.)
2. Q-06 GetConsents `staleTime=30s` — re-mount ConsentContainer within 30s → 0 refetch; after 40s → 1 refetch.
3. Server returns `VALIDATION_FAILED { fieldErrors: { 'dob': 'dob_in_future' } }` → RHF form (PART 11) sets error on `dob` field with i18n message.
4. Mutation mutation.meta.permissionKey absent from session snapshot → `hook.enabled = false`; the trigger Button is not rendered (PART 09 structural, not disabled).

### Risks
- R-10-01. Idempotency key storage grows large on heavy form use. Mitigation: sessionStorage 100-entry cap; LRU eviction oldest first.
- R-10-02. Query key drift between call sites → two cache entries for same-person. Mitigation: query-key factory exported per hook; lint rule disallows literal string queryKey arrays outside `@/lib/api/queries/`.

### Anti-patterns
- AP-10-01. `fetch('/api/person/' + displayCode)` — raw fetch + wrong identifier (ADR-0002).
- AP-10-02. `onSuccess: () => queryClient.clear()` — full cache wipe on every mutation.
- AP-10-03. Mutation retry:2 — command double-submission.
- AP-10-04. `queryKey: ['person']` — non-deterministic; collides with any person.

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| CQRS Commands/Queries split | IDN-API-001 P-04 | PART 2 §P-04 |
| No business logic in edge; envelope deserialisation only | IDN-API-001 P-02 | PART 2 §P-02 |
| Idempotency on all commands | IDN-API-001 PART 3, each C-xx header spec | 22 command signatures |
| Cursor-based pagination | IDN-API-001 P-07 pagination rule 2 | PART 2 §P-07 |
| Server-side RLS projection enforcement | Constitution Art. 8 + STK-INV-001 | server-authoritative data minimisation |
| Cookie-only auth transport | PART 08 §08.1 | no localStorage JWT |

---

## PART 11 — Forms

### Purpose
Define the single canonical pattern for all user-input forms: validation, wizard flows, autosave, draft persistence, confirmation, and rollback. Ensures every input collection adheres to consent UX rules (CONSENT-001 §12), data minimisation (STK-INV-001), and server-validation round-trips.

### Scope
Every `<form>` in the app: Register (wizard), Guardian Link, Verification Upload, Consent Grant/Revoke toggles, Membership Create, Transfer Request, Activity Record, Policy Activation, Annotation creation.

### Inputs
- Tech stack: React Hook Form 7.71 + Zod 3.24 + @hookform/resolvers 5.2 (package.json)
- CONSENT-001 §12 UX obligations: ≤2-tap revoke, Bahasa plain language, per-purpose toggles, no bundling
- IDN-PRD-001 FR-PER-06 data minimisation: never collect fields not required by the active journey step
- IDN-JRN-001 every journey DEC- step produces a decision with explanation
- IDN-API-001 VALIDATION_FAILED envelope with fieldErrors rollup (PART 10)

### Outputs
- Canonical form component skeleton: `@/components/form/*` (FormProvider wrapper, Field, SubmitBar, Wizard, DraftBanner, ConfirmDialog).
- Hook convention: `usePersonForm()`, `useConsentForm()`, etc. in `@/features/<area>/forms/`.
- Draft + Autosave conventions.

### Dependencies
- PART 10 mutation hooks + error envelope (fieldErrors → RHF setError)
- PART 07 Form State + Draft (sessionStorage 1h, tab-scoped) categories
- PART 19 Component Composition (Container owns form state; Presentation receives props only)
- shadcn/ui Form primitive from IDN-UIC-001 Foundation

### Architecture Decision

#### 11.1 React Hook Form + Zod Base Pattern
Every form uses:
```
Container (L3)
  └─ <AppForm schema={z.object({...})} defaultValues={...} onSubmit={...}>
       ├─ <AppField name="fullName" label={...} required>
       │    └─ <Input />
       ├─ <FormSubmitBar
            cancelAction="back|reset|close"
            submitLabel={i18nKey}
            danger={boolean}           // high-risk revoke (CONSENT §10) = red variant
            confirmationDialog={...}  // high-risk revoke: show confirm text
          />
     </AppForm>
```

Zod schema rules:
1. **Client validation is a UX hint only.** Server re-validates identically (Constitution Art. 8). Schema version is pinned (schema SHA tagged in audit log) so client+server schemas are version-matched.
2. Bahasa error messages via Zod `issueMap` overridden to plain language per CONSENT-001 §12 (8th-grade reading level target).
3. `exactOptionalPropertyTypes: true` in tsconfig enforces explicit optional fields; no `name?: string` vs `name: string | undefined` confusion.
4. Mononym support: `givenName` + `familyName` optional, with custom refinement that at least ONE of (givenName | familyName | fullName) is non-empty (IDN-PRD-001 NFR-12 mononym support).

#### 11.2 Validation Flow
Submit order:
1. RHF `trigger()` — client Zod schema validation → if invalid, stop; focus first invalid field (WCAG).
2. On client-valid → call mutation hook (PART 10).
3. Server returns `VALIDATION_FAILED { fieldErrors }`:
   - For every key in fieldErrors → `form.setError(key, { type: 'server', message: i18n(fieldError) })`.
   - Focus first server-errored field.
4. Server returns `CONSENT_REQUIRED` or `AGE_PROHIBITED`: roll up as a root-level form error (NOT on a field) + banner; navigation guard redirects after toast.
5. Server returns success → clear form → toast success → precise cache invalidation (PART 10 §10.6).

#### 11.3 Wizard (Multi-step)
Wizards (Register Person JRN-01, Guardian Verify JRN-05, Transfer Request JRN-11) use:
- Step = URL search param `?step=<number>` (PART 07 Local-Ephemeral → URL category) so browser back/forward works, and deep-linking directly to step 3 is possible.
- Each step is its own sub-form with its own Zod sub-schema. Step progression only allowed when current-step sub-form is valid (prev button always allowed; forward = validated).
- Progress indicator (IDN-UIC-001 Timeline component) with states: completed / current / upcoming.
- Step completion: on sub-form valid, write step-data to the Draft store (below). No server call until final Submit on step N. Final Submit composes all step-data into the single C-xx payload.

#### 11.4 Autosave
Applies only to long forms: Verification Evidence upload wizard, Annotation create, Merge Identity rationale.
- Trigger: `onChange` debounce 1000ms OR blur event (whichever first).
- Autosave writes to Draft store. Shows subtle badge last-saved timestamp in header; never a toast.
- Autosave does NOT call the server. Server call occurs only on explicit Submit.

#### 11.5 Draft Persistence
Scope: Wizard step-progress + autosave fields.
- Storage: `sessionStorage` keyed by `form:{formId}:{sessionFingerprint}`. `sessionFingerprint` = session personRef hash (prevents tab-A-draft leaking into logged-in-tab-B if user switches account in same profile).
- TTL: 1 hour from last-write. On form mount, check age; if older than 1h → ignore + show soft banner "Draft expired, form reset".
- Recovery: On mount, if draft exists AND form is unedited → prompt `Continue where you left off? [Resume] [Discard]` non-blocking banner (not modal).
- Clear: On successful submit → explicit `sessionStorage.removeItem(key)`. On logout → entire sessionStorage wiped (PART 08 §08.3).

#### 11.6 Confirmation
Required for:
- Consent revocation (P1/P2 high-risk → CONSENT-001 §10 effect-immediate; P3/P8 normal → confirm text only)
- Membership transfer final step (JRN-11 DEC-TRF steps)
- Identity Merge (C-19 MergeIdentity)
- Policy activation / retirement (C-21/C-22)
- Archive / Restore Identity (C-17/C-18)

Confirmation dialog content:
1. Clear heading in Bahasa.
2. Irreversible consequence statement.
3. High-risk (P1/P2 revoke, Archive, Merge): typed-text confirmation box "Type YA SAYA SETUJU to continue" — submit disabled until exact match.
4. Audit checkbox: "I acknowledge this action is logged with timestamp and my identity." (non-pre-ticked; required).
5. Explicit Cancel + Confirm buttons; Confirm uses destructive variant (IDN-UIC-001 Button destructive) for high-risk actions.

#### 11.7 Rollback
When a mutation fails after optimistic cache write (PART 10 §10.3 `onMutate` snapshot):
1. `onError` restores the snapshot to the exact previous cache entries.
2. A form-level error banner surfaces the reason.
3. Field-level `fieldErrors` are set.
4. **No silent rollback** — user always sees that the change did not apply (Constitution Art. 11 No-Silent-Failure).

### Rules
1. Forms must only collect fields explicitly declared in the active journey step. If JRN-01 Step 1 requires givenName + email, Step 1 does not show DOB or phone. DOB/phone collected on a later step when the domain requires them (FR-PER-06).
2. Consent form toggles are **independent.** No "Accept all" button. No pre-ticked toggles (CONSENT-001 §12 rule: explicit opt-in only).
3. Revoke button/action for any consent ≤2 taps from the consent dashboard (SCR-GRD-04).
4. Every form's Zod schema is exported from a shared `@/lib/forms/schemas/<formId>.ts` so the server functions can import the identical schema for server-side re-validation (single source of validation shape; divergences caught at build).

### Constraints
- No uncontrolled components: every input is registered via `register()` or `Controller`.
- `defaultValues` must never come from a server-issued DTO directly. Map DTO→safe-default shape to avoid leaking restricted fields on a form that should only edit a subset (e.g., Edit Member form never surfaces DOB of a child the viewer can't see).
- File uploads (verification evidence SCR-GRD-05): max 10MB per file, 4 files per evidence set, types JPEG/PNG/PDF only. Client-side byte check before network upload; server re-enforces.

### Acceptance Criteria
1. Register Wizard (SCR-PUB-03) → Step 1 invalid → forward button disabled. URL `?step=3` deep-link loads step 3 data from sessionStorage draft.
2. Consent form (SCR-GRD-04): P1 revoke → "Type YA SAYA SETUJU" confirmation box. Submitted → C-07 fires. Server says ok → Toast banner "Pencabutan P1 berhasil — akses dicabut SEKARANG." (effect-immediate language per CONSENT-001 §10).
3. Mutation returns `fieldErrors.givenName: 'required'` → givenName input shows error, `aria-invalid=true`, focus moves to givenName.
4. Draft draft-age 61 min → banner "Draf kadaluarsa"; form reset.

### Risks
- R-11-01. Typed-text confirmation copy-paste defeats the purpose. Mitigation: confirmation string is a random 4-word phrase generated fresh per dialog (static "YA SAYA SETUJU" for P1/P2 only; Merge/Archive uses 4-word phrase).
- R-11-02. sessionStorage draft survives close-tab. Mitigation: sessionStorage is by-definition per-tab-session; closing tab clears. Restore-tab (Chrome "Reopen closed tab") does not restore sessionStorage in modern browsers — acceptable.

### Anti-patterns
- AP-11-01. `<button>Accept all consents</button>` — bundling forbidden.
- AP-11-02. `<input name="dob" defaultValue={person.dob}/>` uncontrolled + raw DTO default.
- AP-11-03. `<input required aria-disabled>` without client schema refinement (visual-only, no actual validation).
- AP-11-04. Optimistic write + silent rollback on error (violates Constitution Art. 11).

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| RHF + Zod combination | project stack IDN-FE-001 header | PART 03 Project Stack |
| Per-purpose toggles; no Accept all | CONSENT-001 §12 UX rules | §12 rules 1..7 |
| High-risk revoke confirmation + effect-immediate | CONSENT-001 §10 High-Risk revocation | Rule 0. Child's Interest Prevails |
| Data-minimised progressive wizard | FR-PER-06 | IDN-PRD-001 §8.1 |
| Mononym field support | NFR-12 | IDN-PRD-001 PART 9 |
| Client+server identical validation schema | Constitution Art. 8 | server-authoritative |

---

## PART 12 — Error Handling

### Purpose
Define the unified error-handling subsystem. Ensures every failure mode (global crash, route-level error, API domain error, network disconnect, permission denial) surfaces a consistent Bahasa message, is audited, and never leaves the app in a half-state.

### Scope
All error surfaces: React error boundaries (root + route), TanStack Query error callbacks, Server function infrastructure throws, form rollup errors, offline detection, 401/403/404/503 screens.

### Inputs
- Constitution Art. 11 (No-Silent-Failure — every error must be visible or audited)
- PART 10 ApiError envelope shape + retryable flag
- PART 05 Error routes (errors/401, errors/403, errors/404, errors/maintenance)
- IDN-SCR-001 PART 2.6 rule 4: non-existent≡unauthorized visual payload (no info-leak between 404 and 403)
- ADR-0001 (Lovable Cloud function errors)

### Outputs
- Root ErrorBoundary (`__root.tsx` ErrorComponent override)
- Route errorComponent per layout
- `ErrorDisplay` component (presentation) with 4 variants
- Offline banner + service-worker offline detection (PART 23)
- Standard error toast (Sonner) conventions

### Dependencies
- PART 21 Logging/Audit (all errors logged to server with traceId)
- PART 10 ApiError envelope (domain errors)
- TanStack Start ErrorComponent API (root route already has fallback ErrorComponent)

### Architecture Decision

#### 12.1 Global Error Boundary (Root)
Installed as `ErrorComponent` on the root route `__root.tsx`. Catches:
- Unhandled React render errors in any descendant (uncaught throw, invariant violations).
- Server-side SSR streaming errors (TanStack Start streaming SSR error trap).

Recovery UI:
1. Full-screen Bahasa message "Terjadi kesalahan sistem."
2. `traceId` shown only if viewer.role ∈ PLATFORM_SUPER_ADMIN / PLATFORM_SUPPORT / AUDITOR; otherwise, a generic "Kode laporan: XXXX" (last 4 chars — allows user to report without leaking full correlation).
3. Two actions: [Muat ulang] — hard location.reload(); [Beranda] — navigate `/`.
4. Side effect: error JSON `{ message, stack, traceId, path, sessionPersonRef }` sent to audit endpoint via PART 21 logger (fire-and-forget; no block user actions).

#### 12.2 Route Error Boundary
Per layout route `(public)`, `(player)`, `(guardian)`, `(org)`, `(assoc)`, `(fed)`, `(system)` each declares a per-area `errorComponent`:
- Displays area-appropriate copy (e.g., Guardian area error = "Kami tidak bisa menampilkan data anak ini saat ini. Coba lagi nanti.")
- Includes [Coba lagi] → `router.invalidate()` + TanStack Query refetch visible queries.
- Preserves AppShell (sidebar, identity strip) so the user never loses orientation — only the content region shows error (no full-page blank for a route scoped error).

#### 12.3 API Errors (PART 10 envelope)
Classification & handling:

| ApiError.code | Handled by | Surface |
|---|---|---|
| SESSION_STALE / MFA_REQUIRED | PART 08 refresh flow + step-up route | Redirect, transparent or /mfa-challenge |
| SESSION_REVOKED | PART 08 §logout | Logout + toast "Sesi diakhiri oleh administrator." |
| PERMISSION_DENIED | Route beforeLoad guard | Redirect /errors/403 — BUT visually identical payload to 404 (per IDN-SCR-001 §2.6 rule 4; no hint that resource exists but was denied) |
| AGE_PROHIBITED | ConsentGuard hook | Structural absence (AP-09-01/02 forbidden); if reached via deep-link → same 404/403 unified screen |
| CONSENT_REQUIRED | Route guard or mutation onError | Redirect to consent screen for that playerRef; banner "Perlu persetujuan untuk mengakses" |
| VALIDATION_FAILED | RHF form setError | Field-level errors (PART 11) |
| IDEMPOTENCY_CONFLICT | Mutation toast | "Permintaan ini sudah dikirimkan. Hasil: [success result]" + show result |
| * (unmatched) | Sonner toast or route error boundary | Toast for non-critical; route-level fallback if whole-page |

#### 12.4 Network Errors
Detection:
- `window.addEventListener('offline')` → set global `onlineAtom` via PART 07 Local-Ephemeral useState in root context.
- `navigator.onLine` initial check on root loader.

UI response:
1. Docked banner at top of AppShell "Tidak terhubung ke jaringan — perubahan Anda akan disimpan sementara dan dikirim saat kembali online." (PART 23 Offline Strategy)
2. All mutation triggers: if offline → disabled + tooltip "Sambungkan kembali untuk mengirim." (Exceptions: Activity attendance check-in may write to queue — PART 23 write queue.)
3. Queries: continue serving from offline cache; show stale-data badge "Data mungkin tidak terbaru."

#### 12.5 Permission Error Screens (401 / 403 / 404 / Maintenance)
Per PART 05 errors/* route tree:
- **401 Unauthenticated**: shows Login CTA. No user identifying copy.
- **403 Forbidden**: **rendered visually identical to 404 screen** (IDN-SCR-001 §2.6 rule 4 — no existence info leak). No "you don't have permission but it exists" copy. Exact same illustration, exact same heading.
- **404 Not Found**: "Halaman tidak ditemukan." + [Beranda] button.
- **Maintenance 503**: "Sistem dalam pemeliharaan. Kami akan kembali segera." + timestamp banner of expected restoration.
All 4 screens are mobile-stable, no-op navigable, no network calls.

### Rules
1. Every error surface MUST call `logger.error(...)` (PART 21) BEFORE rendering the UI. No "only-toast, no-audit".
2. 403 and 404 share the same visual template and same Bahasa heading. The only difference is the server audit log (which one happened).
3. No console.error calls outside of development. In production, console is silenced; audit endpoint is the sole destination.
4. Sonner toasts auto-dismiss after: info = 4s; warning = 6s; danger = 8s. Success = 3s. User may dismiss at any time.
5. Retry buttons do NOT increase counter that could loop. Max manual retries shown per-error context = 3.

### Constraints
- Error pages (errors/*) contain zero fetch calls. They render 100% from static copy.
- Stack traces are NEVER displayed to non-PLATFORM roles. Log only.
- The 403=404 visual identity rule must survive theme customisation — single shared React component `<UnifiedNotFound />` used by both route files.

### Acceptance Criteria
1. Force a render throw in GuardianConsentContainer → Root ErrorBoundary catches, logs to audit. Non-admin user sees no stack trace.
2. Deep-link `/guardian/players/NONEXISTENT_REF/consent` → returns 404 visual. Deep-link to existing child but viewer=Coach without guardian-relationship → returns visually identical 404 visual. (Screenshot diff test: identical pixels except URL bar.)
3. Disable Wi-Fi mid-session → top banner appears. Consent revoke button disabled. Re-enable Wi-Fi → banner dismisses automatically.

### Risks
- R-12-01. Audit log endpoint itself down → error logging fails silently → double-fault. Mitigation: logger writes to IndexedDB queue if remote fails; retries on next online event (reuses PART 23 write-queue infrastructure).
- R-12-02. Infinite re-throw inside ErrorComponent render (classic React error-boundary footgun). Mitigation: ErrorComponent is pure-presentation, no hooks, no fetches, single try-catch around the entire render with an absolute-fallback `<div>Kritis: terjadi kesalahan ganda.</div>`.

### Anti-patterns
- AP-12-01. `try { ... } catch(e) { /* empty */ }` — silent swallow (Constitution Art. 11).
- AP-12-02. 403 screen text "Anda tidak diijinkan melihat data X ini." (confirms X exists, violates IDN-SCR-001 §2.6 rule 4).
- AP-12-03. `<ErrorBoundary onReset={queryClient.clear()}>` — full cache wipe.
- AP-12-04. Dev `console.log` left in production code path.

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| No-silent-failure (audit every error) | Constitution Art. 11 | No-Silent-Failure |
| 403 visually identical to 404 | IDN-SCR-001 §2.6 Deep link rule 4 | Screen Catalogue PART 2.6 |
| ApiError envelope classification | IDN-API-001 PART 2 error schema | standard error codes |
| Offline banner shown (not hidden) | PART 23 Offline Strategy (upstream) | — |
| Stack traces for PLATFORM roles only | STK-INV-001 data minimisation + PART 9 | child-safe first |

---

## PART 13 — Loading Strategy

### Purpose
Define the unified approach to loading states so every screen communicates progress accurately, with no flash-of-empty-content, no skeleton-layout-shift, and no suspended trees that swallow domain errors.

### Scope
All data loading: route-loader data (root + area), TanStack Query mount-time fetch, lazy components, streaming SSR, wizard-step draft loads. Covers skeleton, progress, lazy loading, Suspense boundaries, and streaming.

### Inputs
- TanStack Start streaming SSR (ADR-0001 stack)
- TanStack Router defaultPendingMs / defaultPendingMinMs (router config already has scrollRestoration; extend with pendingMs)
- IDN-UIC-001 Skeleton component Foundation
- PART 07 state categories (Server-State = Query cache)
- PART 12 error boundaries (route-level fallback, never Suspense fallback for errors)

### Outputs
- `<PageSkeleton />`, `<SectionSkeleton nRows={5} />`, `<CardSkeleton />` presentation components.
- Router-level pending fallbacks via `pendingComponent` / `pendingMs`.
- TanStack Query suspense-usage policy (suspense disabled; errors via error property).

### Dependencies
- PART 14 Code/Route splitting (lazy imports produce loading fallbacks)
- PART 16 Responsive (skeleton layouts match breakpoint grids)
- shadcn/ui Skeleton primitive (IDN-UIC-001)

### Architecture Decision

#### 13.1 Skeleton
Skeleton policy:
- **Skeleton shows the exact layout shape of the eventual loaded content.** If a dashboard has 4 cards in 2×2 grid, skeleton shows 4 grey cards in same 2×2 grid. No "generic rectangle that vaguely suggests content" — layout must match so CLS (Cumulative Layout Shift) ≈ 0.
- Skeleton has no motion by default. If `prefers-reduced-motion: reduce` → shimmer animation disabled (PART 15 accessibility).
- Skeleton render condition: `query.isLoading && !query.isFetchedAfterMount`. Once any data exists (stale or fresh), render the real content plus a subtle "data refreshing" badge — never blank the already-populated UI back to skeleton on refetch.

Per-component skeleton files:
- `@/components/domain/person/PersonHeaderSkeleton.tsx`
- `@/components/domain/consent/ConsentTogglesSkeleton.tsx`
- `@/components/domain/membership/MembershipCardSkeleton.tsx`
Each sibling to the real component. Imports by containers only (L3); components never render themselves-as-skeleton.

#### 13.2 Progress
Progress bar applies to two use-cases only:
1. **File upload (verification evidence SCR-GRD-05)**: HTML5 XHR upload progress → `<Progress value={pct} />` shadcn; accessible label `aria-valuenow`.
2. **Wizard multi-step**: top-progress bar of completed steps, e.g., 2/6 = 33%. (IDN-UIC-001 Timeline component provides richer display; progress bar is an auxiliary for screen readers.)

No "loading spinner" top-of-page NProgress-style bar (TanStack Router pending fallback replaces this need).

#### 13.3 Lazy Loading
Lazy imports (`React.lazy` + `Suspense`) apply ONLY to:
1. Heavy chart components (recharts) on dashboard stats — not on first-render critical path.
2. Modals / Drawers that open on user action (e.g., TransferRequestDrawer, VerificationUploadDrawer).
3. Non-critical Secondary Route: `/player/memberships/$ref/transfer` flow screens (not on player dashboard home).

Critical first-paint screens (Dashboard home, Journey list, Consent panel) are eagerly bundled with their route code-split (PART 14 §14.2).

Lazy fallback: a skeleton matching the eventual component size (no spinner).

#### 13.4 Suspense Usage Policy
**TanStack Query suspense mode = globally OFF** (aligned with PART 10 error handling `throwOnError=false`).
- Rationale: Suspense swallows domain errors into the nearest error boundary, losing the form-level / component-level error context. (PART 12 rule: errors surface as close to the trigger as possible.)
- Exception: `React.lazy` code-split Suspense boundary is permitted — but only as a code-split mechanic, not as a data-loading mechanic.
- **SSR Suspense Streaming**: TanStack Start default streaming SSR remains on (root route `streaming` = true; this renders shell first, stream data-rendered regions later).

#### 13.5 Streaming (TanStack Start SSR)
Streaming order per page:
1. HTML shell → AppShell (sidebars identity-strip no-data placeholders).
2. Critical above-the-fold data via `loader` functions (route `loader` returns the minimum needed for above-the-fold).
3. Below-the-fold data (Audit history, Activity list, Policies list) via TanStack Query fetch-on-render on the client.
Root loader returns only PART 08 Session shape — never the full dashboard payload (keeps TTFB low).

### Rules
1. Never show both skeleton AND data at the same time. Never blank the screen and re-skeleton on background refetch.
2. Every container-level (L3) fetch has a skeleton fallback declared. No bare `{data && <Component />}` with an empty-div fallback.
3. Skeleton minimum 3 rows for table/list views (1 row skeleton does not communicate "there are more rows coming").
4. Router-level `pendingComponent` (white screen avoidance): pendingMs = 150ms; pendingMinMs = 400ms (prevents flash-of-fallback for fast navigations but ensures feedback for >150ms transitions).

### Constraints
- `<Suspense>` around a query is forbidden. Suspense around a lazy-imported chart/drawer is allowed.
- No progress bar on "page nav" (router pending visual = area skeleton, not progress bar).
- Skeleton images use CSS dimensions 1:1 with the actual image container. No `width:100%; height:auto` on skeleton (causes CLS).

### Acceptance Criteria
1. Throttle network to Slow 3G → Dashboard SCR-GRD-01 mount → 4 skeleton cards (2×2) rendered; children switcher shows skeleton row; no layout shift when data arrives. (Lighthouse CLS score < 0.05.)
2. Evidence upload 8MB file → progress bar ticks; screen reader announces progress percent.
3. Consent data refetch in background (staleTime hit) → user sees the cached P1..P8 toggles + a 2-second "Memperbarui…" badge; no skeleton re-flash.

### Risks
- R-13-01. Skeleton count mismatches actual data (skeleton 4 rows → data 1 row → layout jump). Mitigation: skeleton nRows min(actual last known page size, default); first load = default; subsequent = last-page-size cached.

### Anti-patterns
- AP-13-01. `{query.isLoading ? <Spinner /> : <Table />}` — spinner (wrong), skeleton (right).
- AP-13-02. `suspense: true` on useQuery + generic error boundary top-level (looses form-level fieldErrors).
- AP-13-03. `<div style={{height: '100%'}} className="animate-pulse bg-gray-200" />` — inline skeleton (no matching layout shape).

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| CLS constraint | PART 14 Performance section (Lighthouse targets) | downstream |
| Skeleton Foundation component | IDN-UIC-001 Foundation | §Part 3 |
| Streaming SSR default | TanStack Start (ADR-0001 stack) | default config |
| PendingMs / MinMs router policy | PART 05 Routing + existing router.tsx | router config extension |

---

## PART 14 — Performance

### Purpose
Define the frontend performance budget, optimisation strategy, and verification mechanism so the application meets its performance SLAs on low-end 375px phones (target: Samsung A05s-class device, 2GB RAM, Android 13 — PRG-VIS-001 §5 target stakeholder reach).

### Scope
All runtime and build-time optimisations: bundle/code/route splitting, prefetch strategy, image optimisation, memoization, list virtualization, and performance budgets.

### Inputs
- PRG-VIS-001 §5: target stakeholders include broad-device reach — low-end phones and rural connectivity
- IDN-DS-001 IDN-SCR-001 PART 2.1: Mobile-first @375px
- TanStack Start (vite + nitro) build pipeline (ADR-0001)
- package.json: vite, @tailwindcss/vite (no CSS module bloat; Tailwind JIT)
- Existing router.tsx: scrollRestoration=true, defaultPreloadStaleTime=0

### Outputs
- Budgets: Lighthouse scores (Performance ≥ 90, A11y ≥ 95 on mobile)
- Prefetch strategies (intent vs mount vs hover)
- Memoization rules
- Virtualization for roster tables
- Image handling conventions

### Dependencies
- PART 13 Loading (skeleton = no layout shift → CLS score contribution)
- PART 16 Responsive breakpoints
- PART 18 Design Tokens (font-display=swap; critical fonts subset)
- PART 24 Build Strategy (Vite config tweaks)

### Architecture Decision

#### 14.1 Bundle Splitting (Build-time)
Vite/Rollup configuration (vite.config.ts wrapper):
- Manual vendor chunks:
  ```
  splitVendorChunk: true
  manualChunks: {
    react: ['react', 'react-dom'],
    router: ['@tanstack/react-router', '@tanstack/router-core'],
    query: ['@tanstack/react-query', '@tanstack/query-core'],
    forms: ['react-hook-form', 'zod', '@hookform/resolvers'],
    ui: ['@radix-ui/*', 'lucide-react', 'cmdk', 'sonner', 'vaul'],
    charts: ['recharts'],       // lazy-chunk (PART 13.3)
    date: ['date-fns']
  }
  ```
- Nitro preset (ADR-0001 server build): pre-render public routes (/login, /register, /errors/*) to static HTML for instant TTFB.
- Target browserlist: defaults, not dead, >= 0.5% in ID; explicit exclusion of IE to drop polyfills.
- Source maps: hidden-source-map in production (no public map URL; available for error stack trace decode in PART 21).

Budgets:
- Initial HTML document load @3G: < 18KB gzip.
- Initial JS critical (react + router + root shell): < 90KB gzip.
- Any single route JS payload: < 45KB gzip.
- First Contentful Paint (FCP) mobile (Slow 3G, Moto G4): < 1.8s.
- Largest Contentful Paint (LCP) mobile: < 2.5s.
- Interaction to Next Paint (INP): < 200ms at p75.

#### 14.2 Code Splitting / Route Splitting
TanStack Start file-based routes = every route auto-code-splits. Additional conventions:
- Layout routes `_app` / area layouts do NOT import non-essential heavy modules. Import only what AppShell needs.
- Heavy sections inside a route (audit history tab on person detail, chart stats on dashboard) = dynamic import inside the tab render-once-user-clicks.
- The shared `features/shared/components/*` barrel export uses ES module syntax; Vite's tree-shaking eliminates unused shared components from each route chunk (verify via `vite build --analyze`).

#### 14.3 Prefetch Strategy
Three-tier:

| Tier | Trigger | What | Target |
|---|---|---|---|
| 1 (Always) | Route mount | Critical loader data of current route | Dashboard home |
| 2 (Intent) | `onMouseEnter` on nav link; `onTouchStart` on mobile (300ms before click) | Prefetch target route loader + its 2 primary queries (via `router.preloadRoute`) | Sidebar items, child-switcher rows, journey step links |
| 3 (Idle) | `requestIdleCallback` 3 s after first paint | Prefetch the next likely step of the active journey (e.g., on SCR-GRD-03 Guardian Link → preload SCR-GRD-05 Verification route) | JRN step hints |

Global prefetch disabled for unknown (never prefetch a link if we can't infer intent). Override in router: `defaultPreload: 'intent'`; individual links can opt-in to `preload="render"` for dashboard home.

#### 14.4 Image Optimization
Person profile photo / organization logo:
- Storage: Lovable Cloud Storage.
- Server-side resizing: request signed URLs with `width=128`, `width=384`, `width=768` variants; `<img srcset>` + `sizes` selects by viewport.
- Format: AVIF if supported (Accept header), else WebP, else JPEG. (Serve-level — client declares accept; server responds accordingly.)
- Loading: `<img loading="lazy" decoding="async">` for all below-the-fold; above-the-fold avatar `loading="eager" fetchpriority="high"`.
- Dimensions: explicit `width`/`height` attributes; CSS `object-cover`. Never intrinsic-layout images with auto-dimensions (CLS).
- Avatar fallback: SVG initials, colour-hashed from personRef (stable colour per person, no PII in hash seed).

No unoptimised original-resolution images ever rendered in the UI.

#### 14.5 Memoization Rules
Memoize strictly by measurement. Default: no memo. Only memo when:
1. Component renders as part of a list > 25 items (roster rows).
2. Parent re-renders 60fps (drag, scroll, filter input onchange) and children are pure.
3. Lighthouse trace shows > 10ms self-time in a component that should be pure.

Convention:
- `React.memo` with a shallow-equality comparator for L2 domain list-items.
- Container (L3) components are NEVER wrapped with `memo`. Containers call hooks and subscribe to state.
- `useMemo`/`useCallback`: only for derived values used in dependency arrays of heavy hooks or queries. Do NOT wrap every callback by habit.

#### 14.6 Virtualization
Applies to:
1. SearchPersons results table — rows > 50 → virtualize.
2. Activity history — rows > 100 → virtualize.
3. Audit history — rows > 100 → virtualize.

Library: `@tanstack/react-virtual` (aligns with stack TanStack ecosystem; no `react-window`). Row height fixed at 56px (matches IDN-UIC-001 Table row height) → no dynamic measurement cost.

### Rules
1. Every release build runs `vite build --analyze`; if any route chunk exceeds 45KB gzip the reason must be documented and approved as an exception in this Part's risk register.
2. No new npm dependency that adds > 10KB gzip to the critical initial chunk without a measured alternative-vs-cost analysis.
3. `requestIdleCallback` idle prefetch must check `navigator.connection.effectiveType === '2g'` and skip entirely on slow connections (respect user bandwidth).
4. All `<img>` tags MUST have alt text. Avatar alt = "Foto profil" + person display-code-initial (never person full name by default — STK-INV-001 data minimisation).

### Constraints
- `IntersectionObserver` is the only mechanism for scroll-based lazy-loading (no custom scroll listeners).
- No CSS-in-JS runtime. Tailwind CSS v4 is build-time only; style tag size < 15KB gzip per page (Tailwind JIT + purged unused utilities by design).
- Service Worker (PWA) caches static assets only; never caches API responses (API response cache = TanStack Query cache + PART 23 offline cache separate).

### Acceptance Criteria
1. Production build `vite build` + Lighthouse CI mobile run: Performance ≥ 90, A11y ≥ 95.
2. Slow 3G LCP (Dashboard SCR-GRD-01): < 2.5s.
3. SearchPersons 250 rows rendered → scrolling 60fps on a Samsung A05-class device; Memory snapshot shows ~260 DOM nodes (not 2500+).
4. Navigate from SCR-GRD-01 (Dashboard) → SCR-GRD-04 (Consent) via mouse: onMouseEnter triggers `router.preloadRoute` — DevTools Network shows the target route code + Q-06 GetConsents fire BEFORE the click.

### Risks
- R-14-01. Intent-prefetch on hover causes 2x bandwidth on mis-hovers. Mitigation: prefetchMinWait 80ms after enter; leave cancels.
- R-14-02. AVIF re-encoding at every fetch size (storage bill). Mitigation: CDN edge cache of each (size,format) tuple for 30 days.

### Anti-patterns
- AP-14-01. `<img src={originalSignedUrl} width={64} />` — delivering 8MP photo for a 64px avatar.
- AP-14-02. `export default memo(Container)` — memo on container (hooks break, stale closures).
- AP-14-03. `import * as dateFns from 'date-fns'` (full library). Tree-shakeable named imports: `import { format, parseISO } from 'date-fns'`.
- AP-14-04. `Router.create({ defaultPreload: 'render' })` — prefetch everything (mobile bandwidth killer).

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| Broad-device/low-end target | PRG-VIS-001 §5 Stakeholder Targets | rural / low-end reach |
| Mobile-first 375 budget | IDN-SCR-001 §2.1 Layout — mobile-first | PART 2.1 |
| TanStack ecosystem (react-virtual) | project stack declaration | header PART 03 |
| Tailwind v4 zero-runtime | stack + styles.css existing setup | @tailwindcss/vite plugin |

---

## PART 15 — Accessibility

### Purpose
Define the binding WCAG 2.1 Level AA conformance rules for every surface. Accessibility is a Child-Safety concern (Constitution Art. 0): a guardian with low vision or motor impairment must still be able to revoke P1/P2 consent within 2 taps (CONSENT-001 §12).

### Scope
All 50 screens. Covers keyboard navigation, screen reader semantics (NVDA on Windows, TalkBack on Android, VoiceOver on iOS/macOS), colour contrast minimums, touch-target sizes, and reduced-motion support.

### Inputs
- WCAG 2.1 Level AA (the explicit baseline)
- CONSENT-001 §12 UX obligations (2-tap revoke → large/tappable target)
- IDN-UIC-001 Foundation components: Button (3 sizes 32/44/56px), FormField (label/error/required), Card, Badge
- shadcn/ui → built on Radix UI primitives (accessible by construction; do not reimplement)
- IDN-PRD-001 NFR-12: Bahasa Indonesia primary; all ARIA labels Bahasa default

### Outputs
- Accessibility checklist embedded in PART 27 Implementation/QA/A11y Checklists.
- Canonical rules per component category (forms, tables, navigation, dialogs).
- Development-time lint: `eslint-plugin-jsx-a11y` strict preset.

### Dependencies
- PART 19 Component Composition (Presentation components apply aria props; Container never applies aria to Presentation)
- PART 16 Responsive (touch targets @375px)
- PART 17 Dark Mode (contrast in both themes)
- PART 18 Design Tokens (contrast ratios enforced at token level)

### Architecture Decision

#### 15.1 WCAG 2.1 AA Baseline
Every screen MUST satisfy the AA success criteria. Priority ranking (fail = block release):
1. **Critical (block G7)**: 1.1.1 Non-text Content, 1.3.1 Info & Relationships, 1.3.2 Meaningful Sequence, 1.4.1 Use of Color, 1.4.3 Contrast (Minimum) 4.5:1, 2.1.1 Keyboard, 2.1.2 No Keyboard Trap, 2.4.1 Bypass Blocks, 2.4.2 Page Titled, 2.4.3 Focus Order, 2.4.7 Focus Visible, 3.1.1 Language of Page, 3.2.1 On Focus, 3.2.2 On Input, 3.3.1 Error Identification, 3.3.2 Labels or Instructions, 4.1.1 Parsing, 4.1.2 Name, Role, Value.
2. **AA (required)**: Remaining WCAG 2.1 AA criteria, including 1.4.4 Resize Text 200%, 1.4.10 Reflow (1280×1024 no horizontal scroll), 1.4.11 Non-text Contrast 3:1, 1.4.12 Text Spacing, 2.4.6 Headings and Labels, 2.4.7 Focus Visible (extended), 3.3.3 Error Suggestion, 3.3.4 Error Prevention (Legal, Financial, Data) — applies to C-17 Archive, C-19 Merge, C-07 P1/P2 Revoke.
3. **AAA aspirational (not blocking release)**: Documented in PART 27 Acceptance checklist.

#### 15.2 Keyboard
Keyboard navigation rules:
- Skip-link anchor at top: `<a href="#main-content" className="skip-link">Lewati ke konten utama</a>` visible only on :focus. Installed once in AppShell `<main>` id=`main-content`.
- All interactive elements (buttons, links, toggles, form fields, tab stops, breadcrumbs, search box, quick-action palette) reachable via Tab in a logical DOM order. Focus order = visual reading order (1.3.2).
- Modal/drawer/confirmation dialogs: focus trap via Radix Dialog/Vaul primitive; on open: focus first focusable element inside; on close: focus returns to the trigger.
- Dropdowns (Sidebar menu expand, PersonContextHeader role-switcher): arrow-key navigation; Esc closes and returns focus.
- Table rosters: Tab into table header → arrow keys navigate cells → Enter/Space activates row action (if any).
- Consent toggles (SCR-GRD-04): Space toggles; Enter activates (keyboard parity with tap).

#### 15.3 Screen Reader
- HTML `<html lang="id">` default. (English UI = secondary language in future; current build = Bahasa Indonesia primary per NFR-12.)
- Every `<IconButton>` (lucide icon-only) has an `aria-label` in Bahasa. Never `<Button><Icon name="trash" /></Button>` naked.
- Live regions:
  - Toast notifications (Sonner) → `aria-live="polite"` on toast region.
  - Form submission in-progress → `aria-busy="true"` on SubmitBar.
  - Auto-save draft → `aria-live="polite"` announces "Draf disimpan 10:42."
  - Consent grant/revoke → `aria-live="assertive"` announces "Persetujuan P1 dicabut" (effect-immediate CONSENT-001 §10; assertive priority correct for high-risk state change).
- Headings: exactly one `<h1>` per screen; heading levels never skipped (no h1→h3 jump). Sidebar section titles use `<h2>`.
- Lists (consent toggles, journey timeline, audit rows) use `<ul>`/`<ol>` semantics — never `<div>` soup.

#### 15.4 Contrast
Enforced in PART 18 design tokens (CSS variables):
- Normal text (≤18pt or ≤14pt bold): minimum 4.5:1 on all background colours.
- Large text (>18pt or >14pt bold): minimum 3:1.
- Non-text UI components (Button border, Focus ring, Input border, Icon only): minimum 3:1.
- Error state colour (danger) must never rely on red alone (1.4.1 Use of Color): every error field has a warning-triangle lucide `AlertTriangle` icon + text error message.
- Validation: success state (green ✓) paired with text "Tersimpan" — not green alone.
- Dark mode tokens (PART 17) validated independently with same ratios; automated contrast check in build step (PART 24) uses `color-contrast` npm checker against the CSS custom property pairs.

#### 15.5 Touch
- Minimum touch-target 44×44 px (WCAG 2.5.5 Target Size). IDN-UIC-001 Button size `md` = 44 px (the default); `sm` = 32 px (used ONLY in icon-buttons inside dense tables — those 32 px targets get 6 px padding hit-slop expansion via CSS `::after` pseudo-element enlarging the hit-box to 44×44).
- No gesture without a touch-action alternative. Swipe-to-dismiss drawer → also has `(X)` close button.
- Long press (context menu) never the only trigger for any action.
- Consent revoke (2-tap): first tap = open confirmation (PART 11 §11.6); second tap = Confirm button. No single-tap revoke anywhere.

#### 15.6 Reduced Motion
- `prefers-reduced-motion: reduce` media query respected globally:
  - Disable all CSS transitions / animations except: opacity ≥ 0 → 1 (fade-in) and layout-preserving shifts.
  - Skeleton shimmer (PART 13.1) turned off (solid grey rectangles).
  - Toast slide-in replaced with fade (no horizontal translate).
  - Recharts chart animations disabled.
  - Router transition (if any) disabled.
- Respect `prefers-contrast: more` → enforce a high-contrast token override layer (extra border on buttons, focus ring 3px instead of 2px).
- User toggle: AppShell Avatar → Preferences → "Kurangi gerakan" / "Kontras lebih tinggi" toggles. Persisted per PART 17 cookie+localStorage. Toggle sets an HTML attribute; CSS layer applies.

### Rules
1. Every new shadcn/Radix primitive import retains all built-in accessibility props. Never `aria-hidden` a Radix Dialog title. Never remove the `Description` from Dialog to "make it simpler".
2. eslint-plugin-jsx-a11y runs in `strict` mode; `eslint --max-warnings=0` fails CI. No inline `// eslint-disable-next-line jsx-a11y/...` without a written ADR-style exception comment including the rationale and audit ticket.
3. ConsentContainer (SCR-GRD-04) toggle rows: label clickable, icon-only action button has aria-label, form submit on Enter key, row focused renders focus ring.

### Constraints
- Focus ring: `outline-2 outline-offset-2` — custom Tailwind utility; never `outline: none` without replacement.
- Images (PART 14.4) have empty alt (`alt=""`) if decorative, descriptive alt if meaningful. Avatar default alt = "Foto profil" (generic, no name).
- Icon-only buttons (lucide) are a code-smell; they must pass an explicit ariaLabel prop (TypeScript type-required — no optional `ariaLabel?: string`).

### Acceptance Criteria
1. Run axe-core DevTools scan of SCR-GRD-04 Consent page: zero AA violations.
2. TalkBack swipe linear navigation of Register Wizard step 1: announces label of each field in DOM order, announces required, on submit announces error count + jumps to first error.
3. User with `prefers-reduced-motion: reduce` loads dashboard — skeleton shows solid grey (no shimmer), charts render static.
4. Consent revoke trigger button: hit target expanded to 44×44 px via ::after; Chrome DevTools box-model visualises the larger hit area.

### Risks
- R-15-01. Icon-only `aria-label` language drift; copy falls behind UI. Mitigation: all `aria-label` strings sourced from i18n dictionary (never hardcoded literals); lint rule scans for bare-string aria-labels outside i18n.
- R-15-02. 3rd party library (chart, date picker) ships non-accessible component. Mitigation: wrap with accessibility layer, or replace library if gap cannot be closed.

### Anti-patterns
- AP-15-01. `<div onClick={...}>Toggle consent</div>` — non-interactive element with click handler (use `<Button>` or role=`switch` + keyboard handler).
- AP-15-02. `outline: none` on :focus (violates 2.4.7 Focus Visible).
- AP-15-03. `<Icon name="x" aria-hidden />` on close button (button loses accessible name).
- AP-15-04. `<img src="avatar.jpg" alt="Foto profil Budi Santoso 12yo" />` — alt text leaks PII (STK-INV-001 data minimisation).

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| WCAG 2.1 AA mandatory | PRG-VIS-001 §4 Strategic Principles #5 | inclusive & equitable |
| 2-tap revocation (large touch target, keyboardable) | CONSENT-001 §12 UX rule 3 | ≤2-tap |
| Radix/shadcn accessible primitives (never reimplement) | IDN-UIC-001 §Part 3 Foundation components | Component Catalogue |
| Bahasa Indonesia default for aria + labels | IDN-PRD-001 NFR-12 | primary language |
| Focus ring always visible | PART 18 tokens; WCAG 2.4.7 | design token + WCAG |

---

## PART 16 — Responsive Strategy

### Purpose
Define the breakpoint system, layout transformations, and navigation adaptation for each screen width. Mobile-first @375px is the primary design target; desktop @1440+ is the secondary enhancement.

### Scope
All 50 screens across 7 layout groups. Covers sidebar visibility, bottom-nav presence, grid column counts, typography scaling, PersonContextHeader behaviour, and Guardian child-switcher layout per breakpoint.

### Inputs
- IDN-DS-001 PART 4: 4 breakpoints 375 / 768 / 1024 / 1440
- IDN-SCR-001 §2.1 Layout: Mobile-first @375px primary
- Existing `src/hooks/use-mobile.tsx` (returns isMobile boolean at 768 threshold)
- Tailwind CSS v4 default mobile-first (`min-width` breakpoints)

### Outputs
- Breakpoint contract (min-width semantics)
- Layout region visibility rules per breakpoint
- Grid rules
- Typography scale per breakpoint
- Hook extension: `useBreakpoint()` returns one of `PHONE | TABLET | LAPTOP | DESKTOP`

### Dependencies
- PART 06 Navigation (sidebar/bottom-nav/breadcrumb/search/quick-action)
- PART 05 Routing (layout groups adapt their shell)
- PART 18 Design Tokens (fluid typography via clamp())
- PART 15 Accessibility (touch targets 44px at PHONE; can shrink visually at DESKTOP)

### Architecture Decision

#### 16.1 Breakpoint System (Mobile-first, min-width)
```
PHONE    — default (no prefix).       0   → 767  px  (375 is design target here)
TABLET   — sm: prefix in Tailwind.   768  → 1023 px
LAPTOP   — md: prefix.              1024  → 1439 px
DESKTOP  — lg: prefix.              1440+ px
```
No xl/2xl breakpoints (no ultra-wide layouts; content max-width = 1440 px centred for >1600 px — prevents stretched long lines).

Device-category hook extension `useBreakpoint()` (extends existing `use-mobile.tsx`):
```ts
type BP = 'PHONE' | 'TABLET' | 'LAPTOP' | 'DESKTOP';
const bp = useBreakpoint();
// returns the active bucket via window.matchMedia; SSR-safe (default=DESKTOP in SSR; hydrates correctly)
```

#### 16.2 Layout Region Visibility Rules
AppShell 5 regions (per PART 06 Navigation):

| Region | PHONE <768 | TABLET 768+ | LAPTOP 1024+ | DESKTOP 1440+ |
|---|---|---|---|---|
| TopBar (identity strip + search + quick-action) | ✓ Collapsed search bar; expand via tap | ✓ Full search bar visible | ✓ | ✓ |
| Primary Sidebar | ✗ Absent (opens as Vaul drawer via hamburger) | ✓ Collapsed rail (icons-only, 56px wide) | ✓ Expanded (256px) | ✓ Expanded (288px) |
| Breadcrumb | ✗ Hidden (bottom-nav + back button replaces) | ✓ | ✓ | ✓ |
| Bottom Navigation | ✓ 5 primary icons (Lucide) + labels | ✗ | ✗ | ✗ |
| Right Rail (journey progress / context actions) | ✗ (tab on person detail, swipe) | ✗ (drawer trigger) | ✓ 240px | ✓ 288px |

Rules:
- Back-button behaviour: on PHONE, every sub-screen shows `< Back` in the TopBar left-aligned (replaces hamburger on screens that are one-level deep from their area home).
- Drawer sidebar on PHONE: swipe-from-left (Vaul) + hamburger tap. Close on backdrop tap, Esc, or navigate.
- Bottom nav items exactly 5 for all PHONE screens: [Beranda, Anak (Guardian) / Aktivitas (Player) / Roster (Org) / Pengajuan (Assoc) / Dasbor (Fed), Cari, Saya]. The 2nd item changes by active area role-context.

#### 16.3 Grid Rules (Mobile-first per breakpoint)
Container padding: 16px (PHONE) → 24px (TABLET) → 32px (LAPTOP/DESKTOP).

Card dashboard (SCR-GRD-01, SCR-ORG-01, SCR-PLY-01, SCR-ASC-01, SCR-FED-01):
```
PHONE:    grid-cols-1  1 col
TABLET:   sm:grid-cols-2  2 cols
LAPTOP:   md:grid-cols-3  3 cols
DESKTOP:  lg:grid-cols-4  4 cols
```
Roster tables (SCR-ORG-02 Directory, SCR-ASC-04 Association Roster):
- PHONE: Each row becomes a 2-row Card. Field label stack on left, value on right. Swipe row for actions.
- TABLET+: Full `<table>` with column headers.

Form columns (Register, Consent, Verification):
- PHONE: grid-cols-1 single column.
- TABLET: sm:grid-cols-2. Full-name row spans 2 cols.
- LAPTOP/DESKTOP: md:grid-cols-12 with explicit col-span-{4,6,8,12} per field.

#### 16.4 Responsive Typography
Core scaling strategy: fluid type via CSS `clamp()` in PART 18 tokens:
```
--fs-xs:   clamp(0.75rem, 0.7rem + 0.2vw, 0.8125rem);
--fs-sm:   clamp(0.8125rem, 0.78rem + 0.2vw, 0.875rem);
--fs-base: clamp(0.875rem, 0.82rem + 0.3vw, 1rem);
--fs-lg:   clamp(1rem, 0.92rem + 0.5vw, 1.125rem);
--fs-xl:   clamp(1.125rem, 1.05rem + 0.7vw, 1.375rem);
--fs-2xl:  clamp(1.375rem, 1.2rem + 1.2vw, 1.875rem);
--fs-3xl:  clamp(1.875rem, 1.6rem + 2vw, 2.75rem);
```
Font stack (Oswald headings, Inter body, Roboto Mono for FootballId display code) from IDN-DS-001 typography section.
- Line-height tightens on larger breakpoints for headings; body line-height stable at 1.6.

### Rules
1. No CSS media queries with `max-width` orientation. Write styles for PHONE first, then `sm:`, `md:`, `lg:` overrides for larger (mobile-first direction only).
2. Grid counts declared in ONE place per container. If a dashboard container needs 1/2/3/4 cols, it uses `className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"` in a single declaration. Do NOT split into separate `if (bp === 'PHONE') { return <Grid1/> }` JSX forks unless the component structure fundamentally changes (table→card transformation).
3. Images: `max-w-full h-auto` by default; PersonHeader banner scales its hero gradient height from 120px (PHONE) → 160px (DESKTOP).

### Constraints
- Horizontal scrolling: forbidden globally except for `overflow-x-auto` on data tables at TABLET breakpoint, timeline components, and carousel (no carousel — use tab pattern instead). No `overflow: hidden` document-wide that hides focus ring.
- Breakpoints are fixed numeric thresholds. Never device detection (`/iPhone/.test(userAgent)`) to adapt layout. Only `matchMedia`.
- PHONE breakpoint width must never render a sidebar and content side-by-side. Sidebar = overlay drawer only.

### Acceptance Criteria
1. Chrome DevTools Device Toolbar, 375×667 (iPhone SE): SCR-GRD-01 renders 1-col dashboard, bottom-nav with 5 items, no sidebar, hamburger in TopBar. Resize → 1024 → sidebar expanded 256px, breadcrumb visible, bottom-nav absent.
2. Roster SCR-ORG-02 @375: rows are stacked cards; @768: rows are `<table>` rows.
3. Fluid base font at 375px = 14px (0.875rem); at 1440px = 16px (1.0rem); linear in between (verify computed `getComputedStyle(document.body).fontSize`).

### Risks
- R-16-01. Server-rendered mismatch between SSR breakpoint default (DESKTOP) and hydrated client breakpoint (PHONE) → flash-of-wrong-layout. Mitigation: (1) AppShell shell renders both sidebar and bottom-nav in SSR and CSS shows/hides at breakpoint (so HTML is identical; no JS-driven fork); (2) `useBreakpoint` returns undefined on first render (defer client-only decisions) to suppress hydration warning.

### Anti-patterns
- AP-16-01. `if (isMobile) return <MobileVersion />; else return <DesktopVersion />;` — full component fork causes bugs; prefer CSS classes.
- AP-16-02. `<div style={{ width: '1200px' }}>` — fixed pixel width that overflows 375.
- AP-16-03. `@media (max-width: 767px) { ... }` — desktop-first direction (wrong).
- AP-16-04. `hidden lg:block` without mobile-first visibility alternative (leaves PHONE blank).

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| 4 breakpoints 375 / 768 / 1024 / 1440 | IDN-DS-001 PART 4 | Responsive Breakpoints |
| Mobile-first @375px primary | IDN-SCR-001 §2.1 Layout | PART 2.1 |
| isMobile hook already in codebase | src/hooks/use-mobile.tsx | existing convention |
| Tailwind min-width semantics | Tailwind v4 default | stack |

---

## PART 17 — Dark Mode

### Purpose
Define the theme-strategy for supporting Light, Dark, and System-preference modes. Dark tokens must independently meet WCAG contrast ratios (PART 15 §15.4). The choice is a user-accessibility preference — never an aesthetic-only toggle.

### Scope
Theme persistence, system-preference detection, CSS token layers, component override rules, and theme-change DOM mutation.

### Inputs
- Existing `src/styles.css` setup: `:root` light tokens, `.dark` class inverted tokens, `@custom-variant dark (&:is(.dark *))`.
- IDN-DS-001 color tokens with semantic naming (primary/secondary/semantic-success/warning/danger/info/neutral grays 1–9) — never literal color name classes.
- PART 15 contrast ratios in both themes.

### Outputs
- Canonical theme store (cookie + localStorage, per PART 07 Theme category)
- Theme Toggle component (TopBar) with 3-state: Light / Dark / System
- Theme class application at root
- SSR hydration safe (no FOUC flash-of-unstyled-content)

### Dependencies
- PART 07 State Management (Theme/A11y-prefs = Cookie + localStorage category)
- PART 18 Design Token Integration (token values declared in CSS custom properties per theme)
- PART 24 Build Strategy (feature flag for "Force Light" override per tenant)

### Architecture Decision

#### 17.1 Theme Strategy (Class-based)
Class `<html class="dark">` toggles at document element. NOT `prefers-color-scheme` CSS media alone (user must be able to override system). The selector chain is:
1. If user-set preference = LIGHT → no class.
2. If user-set preference = DARK → `html.dark`.
3. If user-set preference = SYSTEM → `html` class follows `matchMedia('(prefers-color-scheme: dark)')` dynamically (live updates if user toggles OS theme while app open).

#### 17.2 System Preference
Detection:
1. First visit: no localStorage → use System preference → set cookie `preferred_theme=system` for SSR.
2. If OS reports dark → add `.dark` class; else no class.
3. Live-update listener: `window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ...)` → only triggers while preference = SYSTEM.

#### 17.3 Persistence
Dual-write (PART 07 theme category):
1. **Cookie**: `preferred_theme` SameSite=Lax, Secure, path=/ max-age=31536000 (1 year). The root loader (PART 08) reads this cookie and sets the `.dark` class BEFORE sending HTML on first SSR response — **no FOUC on first paint**.
2. **localStorage**: `theme-preference` = 'light' | 'dark' | 'system' — client JS checks this before paint (inline script in `<head>` per §17.4 below).

#### 17.4 FOUC Prevention (Critical)
Inline `<script>` in the `<head>` of index.html (TanStack Start root route HTML template):
```
<script>
  // Runs BEFORE first paint. No React. No external dep.
  (function(){
    try {
      var t = localStorage.getItem('theme-preference');
      var m = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var dark = (t === 'dark') || (t !== 'light' && m);
      if (dark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch(e) {}
  })();
</script>
```
This 180-byte script is inlined directly (not an external file) so it blocks paint until theme class is set. Prevents white-flash-then-dark on dark-preference users.

#### 17.5 User Toggle
TopBar Avatar menu → 3 radio items (not a toggle):
- ( ) Terang
- ( ) Gelap
- (*) Ikuti sistem

On change:
1. Write cookie (server-side call via `@/lib/theme/theme.server.ts` set-cookie header — so future SSR sees the new value correctly).
2. Write localStorage.
3. Toggle `html.dark` class immediately.
4. If switching TO dark: re-evaluate TanStack Query `refetchOnWindowFocus` no change. No full page reload. All components must be theme-stable via CSS custom property switching.

### Rules
1. No component may read the theme from JS (`useTheme()`) to apply conditional colours. All colour comes from CSS variables. Exception: icons (lucide) may inherit `currentColor` which is a theme-token variable — correct.
2. Dark mode tokens use the same semantic names as light. So `bg-primary` in light = navy oklch, in dark = navy-900 oklch (both defined in CSS). No `bg-blue-600 dark:bg-blue-300` one-off overrides in component classNames. Component authors only use semantic token classes.
3. Contrast validation: on every design token change (PART 18) a build step verifies `body text on bg` and `danger text on bg` 4.5:1 in both themes; fails build if below (PART 24).

### Constraints
- System preference is the DEFAULT. Never force-dark on first visit.
- If user preference cookie is missing, SSR falls back to System (and since SSR can't read matchMedia, SSR default = render both theme CSS payloads with media-tied scoping where possible; or SSR default = system-ambiguous with inline script correcting in 1 frame).
- Theme must NOT cause component structural re-render (no `if (theme==='dark') return <DarkIcon/>`). Icons are currentColor-inherited.

### Acceptance Criteria
1. Set OS → Dark mode. Hard refresh (Cmd+Shift+R) of login page. First paint = dark background (no white frame before dark). Lighthouse: no "Preload key requests" warning caused by the inline head script.
2. User selects "Terang" in menu → cookie set `preferred_theme=light`, `html.dark` removed, page not reloaded. Next SSR navigation → server renders HTML without dark class (correct).
3. axe-core scan of dark mode: zero contrast violations (4.5:1 body, 3:1 large text/non-text).

### Risks
- R-17-01. Inline script has CSP issue if future CSP policy blocks inline script (PART 22 Security). Mitigation: if strict CSP enabled, compute script hash and whitelist in Content-Security-Policy response header.
- R-17-02. Lucide icon stroke colour not inherited (some icons hard-code). Mitigation: always `<Icon className="text-icon-primary" />` where `text-icon-primary` is a semantic token variable.

### Anti-patterns
- AP-17-01. `className={'bg-white ' + (theme==='dark' ? 'dark:bg-gray-950' : '')}` — conditional classes tied to state value. Use CSS variables: `bg-surface`.
- AP-17-02. Dark toggle as 2-state switch (Light/Dark) — excludes System preference.
- AP-17-03. No SSR cookie read → every first-paint always Light then flash to Dark.
- AP-17-04. Shadcn component `.dark` override scoped to `body.dark` when our variant uses `@custom-variant dark (&:is(.dark *))` on `html.dark` (matches existing styles.css convention; stay aligned).

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| `.dark` class + `@custom-variant dark` | existing src/styles.css setup | styles.css lines 1..20 |
| Semantic tokens (not literal colour names) | IDN-DS-001 color palette section | PART 2 Colour |
| Contrast validation in both themes | PART 15 §15.4 WCAG 1.4.3 | 4.5:1 minimum |
| System preference default | accessibility (PART 15) — user auto-adapt | — |

---

## PART 18 — Design Token Integration

### Purpose
Define how IDN-DS-001 design tokens translate into CSS custom properties and Tailwind utilities. Tokens are the ONLY way components consume colour, spacing, typography, elevation, radius, and motion. There shall be no literal hex, pixel, ms, or rem values in component className props.

### Scope
All design token categories from IDN-DS-001. Covers token source-of-truth (`styles.css` `@theme inline` block), Tailwind v4 configuration, shadcn/ui cssVariables integration, and dark-mode overrides.

### Inputs
- IDN-DS-001 PART 2–6: Colours (Navy/FootballGreen/AccentRed, Semantic 6 variants, Gray 1–9), Typography (Oswald headings, Inter body, Roboto Mono for FootballId), Spacing (8pt grid), Radius (8px default constant), Elevation (Shadow 3 levels), Motion (150–300ms + reduced-motion)
- Existing `src/styles.css`: `@import "tailwindcss"; @theme inline { }` block with tokens already; `@custom-variant dark (&:is(.dark *));` and `:root` + `.dark` oklch tokens.
- components.json: `cssVariables: true` = shadcn components read from CSS vars `--color-primary`, `--color-sidebar-*`, etc.
- Tailwind CSS v4 `@tailwindcss/vite` plugin (package.json)

### Outputs
- Canonical token map: IDN-DS-001 token name → CSS custom property name → Tailwind utility.
- `@theme inline` block organisation rules.
- Validation constraints (no hardcoded values).

### Dependencies
- PART 17 Dark Mode (`:root` light tokens vs `.dark` dark tokens share same keys)
- PART 15 Accessibility (contrast ratios enforced at token level)
- PART 16 Responsive (fluid typography uses clamp in typography token values)

### Architecture Decision

#### 18.1 Token Categories & Naming Convention
Every token uses semantic naming. NEVER brand/literal names.
```
--color-{role}-{variant}       (e.g., --color-bg-surface, --color-fg-primary, --color-border-default,
                                 --color-accent-primary, --color-accent-success, --color-accent-warning,
                                 --color-accent-danger, --color-accent-info)
--spacing-{t-shirt | number}   (e.g., --spacing-1, --spacing-2, --spacing-4 ... 8pt grid multiples;
                                 1=4px; 2=8px; 3=12px; 4=16px; 6=24px; 8=32px; 12=48px; 16=64px; 24=96px)
--radius-{size}                (sm | md | lg | xl)  md = 8px default per IDN-DS-001
--shadow-{level}               (1 | 2 | 3)  IDN-DS-001 3 levels of elevation
--font-{head|body|mono}        (oswald | inter | roboto-mono — mapped to CSS font-family)
--fs-{size}                    (xs..3xl fluid clamp values per PART 16)
--fw-{weight}                  (regular 400, medium 500, semibold 600, bold 700)
--leading-{size}               (tight 1.2, normal 1.5, relaxed 1.6, loose 2)
--tracking-{size}              (tight, normal, wide)
--motion-{duration}            (fast 150ms, base 200ms, slow 300ms)
--motion-ease-{kind}           (standard: cubic-bezier(0.2,0,0,1); enter: 0,0,0.2,1; exit: 0.4,0,1,1)
--football-id-font             (Roboto Mono, semibold, tracking-wide — for FID display code rendering)
```

#### 18.2 Token Source of Truth
Single location: `src/styles.css`. Structure:
```css
@import "tailwindcss";

@theme inline {
  /* ============================================================
     TOKENS DECLARED HERE.
     Only CSS custom properties and @theme bindings.
     No component selectors, no media queries.
     Mapping: IDN-DS-001 v1.0 token list → CSS vars.
     Grep audit: "every value in components MUST come from here."
     ============================================================ */

  /* Spacing 8pt grid. Values in px become rem (16px=1rem root) */
  --spacing-1: 0.25rem;  /* 4 */
  --spacing-2: 0.5rem;   /* 8  — IDN-DS base unit */
  --spacing-3: 0.75rem;  /* 12 */
  --spacing-4: 1rem;     /* 16 */
  --spacing-5: 1.25rem;  /* 20 */
  --spacing-6: 1.5rem;   /* 24 */
  --spacing-8: 2rem;     /* 32 */
  --spacing-12: 3rem;    /* 48 */
  --spacing-16: 4rem;    /* 64 */
  --spacing-24: 6rem;    /* 96 */

  /* Radius — IDN-DS-001: 8px default constant = md */
  --radius-sm: 0.25rem;   /* 4 */
  --radius-md: 0.5rem;    /* 8  DEFAULT */
  --radius-lg: 0.75rem;   /* 12 */
  --radius-xl: 1rem;      /* 16 */

  /* Shadow / Elevation 3 levels */
  --shadow-1: 0 1px 2px 0 rgb(0 0 0 / 0.06), 0 1px 3px 0 rgb(0 0 0 / 0.08);
  --shadow-2: 0 4px 6px -2px rgb(0 0 0 / 0.08), 0 8px 16px -4px rgb(0 0 0 / 0.08);
  --shadow-3: 0 16px 32px -8px rgb(0 0 0 / 0.10), 0 32px 64px -16px rgb(0 0 0 / 0.12);
  --shadow-color: rgb(0 0 0 / 0.08);

  /* Typography — fonts declared in PART 18.3 via @font-face */
  --font-heading: 'Oswald', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'Roboto Mono', ui-monospace, monospace;
  --font-football-id: var(--font-mono);

  /* Fluid font sizes from PART 16.4 clamp() values */
  --fs-xs:   clamp(0.75rem, 0.70rem + 0.2vw, 0.8125rem);
  --fs-sm:   clamp(0.8125rem, 0.78rem + 0.2vw, 0.875rem);
  --fs-base: clamp(0.875rem, 0.82rem + 0.3vw, 1rem);
  --fs-lg:   clamp(1rem, 0.92rem + 0.5vw, 1.125rem);
  --fs-xl:   clamp(1.125rem, 1.05rem + 0.7vw, 1.375rem);
  --fs-2xl:  clamp(1.375rem, 1.2rem + 1.2vw, 1.875rem);
  --fs-3xl:  clamp(1.875rem, 1.6rem + 2vw, 2.75rem);

  /* Weights / Leading / Tracking */
  --fw-regular: 400;
  --fw-medium: 500;
  --fw-semibold: 600;
  --fw-bold: 700;
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.6;
  --tracking-tight: -0.02em;
  --tracking-normal: 0em;
  --tracking-wide: 0.06em;

  /* Motion */
  --motion-fast: 150ms;
  --motion-base: 200ms;
  --motion-slow: 300ms;
  --motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --motion-ease-enter: cubic-bezier(0, 0, 0.2, 1);
  --motion-ease-exit: cubic-bezier(0.4, 0, 1, 1);

  /*
   * Colour tokens — BINDINGS ONLY.
   * Actual per-theme values declared in :root / .dark below (PART 18.3).
   * These `--color-*` vars reference semantic theme vars so Tailwind utilities
   * like bg-surface, text-fg-primary work with theme switching.
   */
  --color-fg-primary: var(--theme-fg-primary);
  --color-fg-muted: var(--theme-fg-muted);
  --color-fg-subtle: var(--theme-fg-subtle);
  --color-fg-on-accent: var(--theme-fg-on-accent);

  --color-bg-canvas: var(--theme-bg-canvas);
  --color-bg-surface: var(--theme-bg-surface);
  --color-bg-surface-alt: var(--theme-bg-surface-alt);
  --color-bg-elevated: var(--theme-bg-elevated);
  --color-bg-accent: var(--theme-bg-accent);

  --color-border-default: var(--theme-border-default);
  --color-border-muted: var(--theme-border-muted);
  --color-border-accent: var(--theme-border-accent);

  --color-accent-primary: var(--theme-accent-primary);      /* Navy = brand */
  --color-accent-secondary: var(--theme-accent-secondary);  /* Football Green */
  --color-accent-success: var(--theme-accent-success);
  --color-accent-warning: var(--theme-accent-warning);
  --color-accent-danger: var(--theme-accent-danger);
  --color-accent-info: var(--theme-accent-info);

  /* Sidebar — shadcn/ui expects these; mapped from our tokens */
  --color-sidebar: var(--theme-bg-surface-alt);
  --color-sidebar-accent: var(--theme-bg-surface);
  --color-sidebar-foreground: var(--theme-fg-primary);
  --color-sidebar-border: var(--theme-border-default);

  /* shadcn base mapping (keeps shadcn components themed) */
  --color-background: var(--theme-bg-canvas);
  --color-foreground: var(--theme-fg-primary);
  --color-card: var(--theme-bg-surface);
  --color-card-foreground: var(--theme-fg-primary);
  --color-popover: var(--theme-bg-elevated);
  --color-popover-foreground: var(--theme-fg-primary);
  --color-primary: var(--theme-accent-primary);
  --color-primary-foreground: var(--theme-fg-on-accent);
  --color-secondary: var(--theme-bg-surface-alt);
  --color-secondary-foreground: var(--theme-fg-primary);
  --color-muted: var(--theme-bg-surface-alt);
  --color-muted-foreground: var(--theme-fg-muted);
  --color-accent: var(--theme-bg-accent);
  --color-accent-foreground: var(--theme-fg-primary);
  --color-destructive: var(--theme-accent-danger);
  --color-destructive-foreground: var(--theme-fg-on-accent);
  --color-input: var(--theme-border-default);
  --color-ring: var(--theme-accent-primary);
}

/* ============================================================
   THEME-SPECIFIC VALUES.
   Light theme: :root
   Dark theme: .dark
   All --theme-* vars bound above via @theme tokens.
   Oklch colour space (per existing styles.css convention).
   Values from IDN-DS-001 v1.0 palette.
   ============================================================ */
:root {
  /* Theme: Light */
  --theme-fg-primary:     oklch(0.15 0.01 250);
  --theme-fg-muted:       oklch(0.40 0.01 250);
  --theme-fg-subtle:      oklch(0.55 0.005 250);
  --theme-fg-on-accent:   oklch(1.0 0 0);

  --theme-bg-canvas:      oklch(0.985 0.002 250);
  --theme-bg-surface:     oklch(1.0 0 0);
  --theme-bg-surface-alt: oklch(0.97 0.002 250);
  --theme-bg-elevated:    oklch(1.0 0 0);
  --theme-bg-accent:      oklch(0.95 0.02 250);

  --theme-border-default: oklch(0.88 0.005 250);
  --theme-border-muted:   oklch(0.93 0.003 250);
  --theme-border-accent:  oklch(0.60 0.12 250);

  /* Brand + semantic */
  --theme-accent-primary:   oklch(0.45 0.16 250);  /* Navy */
  --theme-accent-secondary: oklch(0.55 0.16 145);  /* Football Green */
  --theme-accent-success:   oklch(0.58 0.16 145);
  --theme-accent-warning:   oklch(0.75 0.16 85);
  --theme-accent-danger:    oklch(0.58 0.22 25);
  --theme-accent-info:      oklch(0.58 0.14 240);
}

.dark {
  /* Theme: Dark. Contrast ratios against these values validated ≥ 4.5:1 for body. */
  --theme-fg-primary:     oklch(0.96 0.005 250);
  --theme-fg-muted:       oklch(0.75 0.01 250);
  --theme-fg-subtle:      oklch(0.60 0.01 250);
  --theme-fg-on-accent:   oklch(0.12 0.01 250);

  --theme-bg-canvas:      oklch(0.15 0.01 250);
  --theme-bg-surface:     oklch(0.20 0.01 250);
  --theme-bg-surface-alt: oklch(0.24 0.012 250);
  --theme-bg-elevated:    oklch(0.28 0.015 250);
  --theme-bg-accent:      oklch(0.30 0.05 250);

  --theme-border-default: oklch(0.35 0.01 250);
  --theme-border-muted:   oklch(0.28 0.008 250);
  --theme-border-accent:  oklch(0.60 0.12 250);

  --theme-accent-primary:   oklch(0.65 0.16 250);  /* Navy, raised L for dark */
  --theme-accent-secondary: oklch(0.65 0.16 145);
  --theme-accent-success:   oklch(0.68 0.16 145);
  --theme-accent-warning:   oklch(0.80 0.16 85);
  --theme-accent-danger:    oklch(0.68 0.22 25);
  --theme-accent-info:      oklch(0.68 0.14 240);
}

@custom-variant dark (&:is(.dark *));

/*
 * (END OF TOKEN DECLARATIONS)
 * Component selectors, utility overrides, and CSS layers go BELOW this line.
 */
```

#### 18.3 Font-face Loading & Font Display
In `@layer base` (or `@layer theme` after Tailwind base import), declare three font families with `font-display: swap` to prevent FOIT (Flash-of-Invisible-Text):
```
@font-face {
  font-family: 'Oswald';
  src: url('/fonts/oswald-variable.woff2') format('woff2-variations');
  font-weight: 300 700;
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;
}
@font-face {
  font-family: 'Roboto Mono';
  src: url('/fonts/roboto-mono-variable.woff2') format('woff2-variations');
  font-weight: 400 700;
  font-display: swap;
}
```
Preload hints in `<head>` for Inter (body) and Roboto Mono (Football ID — used on first paint identity strip):
```
<link rel="preload" href="/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/roboto-mono-variable.woff2" as="font" type="font/woff2" crossorigin />
```

#### 18.4 Motion Reduced Override (per PART 15 §15.6)
```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-fast: 0ms;
    --motion-base: 0ms;
    --motion-slow: 0ms;
  }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### 18.5 Tailwind / shadcn Binding Rules
- In component className props, NEVER use literal colour values: `bg-[#1e3a8a]` → forbidden. Always use the semantic token: `bg-accent-primary`.
- Border radius default in components: `rounded-md` (= `--radius-md` = 8px IDN-DS-001 default). Exception: `rounded-full` for badges/avatars.
- Shadows: `shadow-1` (cards, inputs), `shadow-2` (elevated panels, modals), `shadow-3` (floating navigation, top-bar elevated).
- Spacing: always multiples of `--spacing-2` (8pt). Never `gap-1` 4px inside interactive areas (touch targets need air); `gap-2` minimum between interactive elements.
- Typography classes: `font-heading`, `font-body`, `font-football-id`; `fs-3xl` style scale referenced via Tailwind alias `text-3xl` bound from `--fs-3xl` value in @theme block.

### Rules
1. All component styling (colour, spacing, radius, shadow, font, motion) MUST reference a token. If a UI requires a value not in tokens → add token to `@theme inline` block FIRST with IDN-DS-001 reference, THEN use in component.
2. No inline `style={{ color: '#...' }}`. Exception: computed values from domain (person avatar colour-hash) use CSS variables set at runtime via inline style on the element, which still reference semantic tokens — OK.
3. shadcn generated UI components source colours from `--color-primary/secondary/destructive/...` which we map from `--theme-accent-*`. Never edit the shadcn source colour values manually after a generation run; changing tokens in styles.css is the single way.
4. Every PR that changes a colour token value must include a contrast report for both themes (auto-checked in build per PART 15 §15.4).

### Constraints
- 8pt grid: every spacing token is a multiple of 4px; odd-pixel spacings between interactive elements = forbidden (values 4,8,12,16,24,32,48,64 only).
- Radius md = 8px CONSTANT. No 6px or 10px radius anywhere (IDN-DS-001 radius constraint).
- Motion durations: 150 / 200 / 300 ms bucketed. No 120, 250, 400ms custom values (one of 3 buckets + 0 on reduced).

### Acceptance Criteria
1. Grep entire `src/` for `#[0-9a-fA-F]{6}` in className or inline style → 0 matches.
2. Grep `src/` for `px` values inside className `w-[123px]` / `h-[45px]` / `rounded-[6px]` → 0 matches (except for explicit 1px border widths `border-[1px]` which is a token-level `border` utility already).
3. Build step runs `postcss` contrast audit: `--theme-fg-primary` on `--theme-bg-canvas` light theme = 15.2:1 (passes 4.5), dark theme = 13.4:1 (passes 4.5). Report in PART 24 build artifacts.
4. `<FootballId code="FID-AB12-34CD-XY" />` renders with `font-football-id`, `tracking-wide`, `fw-semibold` (Roboto Mono, 0.06em tracking, 600 weight — ADR-0002 display code legibility constraint).

### Risks
- R-18-01. Token-naming drift between design tokens document (IDN-DS-001) and styles.css. Mitigation: build step imports IDN-DS-001 token JSON and diffs against CSS custom property names; build fails on missing/extra.
- R-18-02. shadcn `npx shadcn@latest add button` regenerates CSS vars and clobbers existing token layout. Mitigation: (1) components.json `cssVariables: true` + `tailwind.config.cjs` absent (Tailwind v4 CSS-driven); (2) any shadcn add operation is followed by a lint-grep to ensure tokens are mapped, not overwritten.

### Anti-patterns
- AP-18-01. `className="bg-blue-700"` — literal colour (use `bg-accent-primary`).
- AP-18-02. `gap-3 gap-[10px]` — 10px breaks 8pt grid.
- AP-18-03. `rounded-[10px]` — non-standard radius (md=8px, lg=12px — pick nearest).
- AP-18-04. `transition-all duration-500` — custom 500ms not in 150/200/300 buckets.

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| Navy/Green/Red palette + Semantic 6 + Gray scale | IDN-DS-001 PART 2 Colour System | full palette |
| Typography stack: Oswald / Inter / Roboto Mono | IDN-DS-001 PART 3 Typography | heading/body/mono |
| 8pt spacing grid | IDN-DS-001 PART 4 Spacing | 8px base unit |
| Radius constant = 8px default | IDN-DS-001 PART 5 Radius | md = 8px |
| Shadow 3 levels | IDN-DS-001 PART 5 Elevation | 3-tier |
| Motion 150/200/300ms + prefers-reduced-motion | IDN-DS-001 PART 6 Motion | 150–300ms range |
| styles.css single source of truth | existing project styles.css convention | file already structured with @theme inline |
| FootballId font = Roboto Mono | ADR-0002 display code readability | Crockford-Base32 render |

---

## PART 19 — Component Composition Rules

### Purpose
Define the architectural rules for how React components are composed: Container vs Presentation separation, Atomic-level reuse, domain naming, and the 5-Layer strict-one-way import graph (L5 Routes → L4 Features → L3 Containers → L2 UI/Domain Components → L1 Core Infrastructure). Reverse imports L2→L5 PROHIBITED except type-only.

### Scope
All components in `src/components/`, `src/features/*/components/`, `src/routes/`. Covers import rules, naming, responsibilities, test boundaries, and composition patterns (container/presentation, HOC forbidden, hooks preferred).

### Inputs
- PART 02 Application Architecture (5-Layer strict-one-way graph)
- IDN-UIC-001: 17 component families (Foundation UI + Domain Components)
- PART 11 Forms: Container owns form state; Presentation receives props
- PART 15 Accessibility: Presentation components apply aria props; Container never applies aria to Presentation

### Outputs
- Container vs Presentation signature checklists.
- Import-graph violation detection strategy.
- Domain component naming convention (EntityActionNoun).
- Atomic rule: Foundation → Domain → Screen (never Screen defines Foundation).

### Dependencies
- PART 04 Folder Structure (physical files mirror these layers)
- PART 20 Testing (unit = Presentation only; integration = Container + Presentation + hooks)
- PART 15 A11y (aria props are a Presentation concern)

### Architecture Decision

#### 19.1 Atomic Rules (Foundation → Domain → Screen)
Three levels of L2 (Component Layer). Inheritance of composition; no reverse:

| Level | Location | Responsibility | Example |
|---|---|---|---|
| L2-A Foundation (shadcn/ui atoms) | `src/components/ui/*` | Primitive, no domain. Radix-wrapped Button, Input, Card, Badge, Dialog, Table, Form, Toast, Drawer. | `<Button />`, `<Input />` |
| L2-B Domain Pattern Components | `src/components/domain/<entity>/*` | Domain-aware, stateless Presentation, composed from Foundation. Named by entity pattern. Has sibling Skeleton per L2 component. | `<PersonHeader />`, `<ConsentToggle />`, `<MembershipCard />`, `<FootballIdBadge />`, `<JourneyTimelineItem />` |
| L2-C Shared Presentation | `src/features/shared/components/*` | Cross-feature presentational helpers. No domain entity. | `<GuardianChildSwitcherRow />`, `<AreaBreadcrumb />`, `<RoleContextSwitcher />` |

L2-A components are NEVER edited after a shadcn add except to bind aria labels via tokens. If Foundation needs a variant: create L2-B `<DomainButton variant="secondary" />` that wraps `<Button variant="outline">` and applies domain props. Never mutate `components/ui/button.tsx` after generation.

#### 19.2 Container vs Presentation Split
Every domain UI surface (the thing inside a route's main content) splits into exactly two files. **No single file does both.**

Presentation Component (L2):
```
// src/components/domain/consent/ConsentToggles.tsx
interface Props {
  items: ConsentToggleItem[];             // typed value-objects only — never hook return types
  onGrant: (purpose: Purpose) => void;     // callback
  onRevoke: (purpose: Purpose) => void;
  disabledPurposes?: Purpose[];            // structural absences not rendered; this is for "pending" (not "forbidden")
  i18n: Record<string, string>;
}
export const ConsentToggles: React.FC<Props> = memo(props => ...)
```
Rules for Presentation:
1. **Zero calls to hooks** (`useSuspenseQuery`, `useForm`, `useConsentGate`, `useRouter` … forbidden). Only primitive hooks like `useId` (for aria) and `useMemo` for derived view-model transforms allowed.
2. **No network calls.** No TanStack Query. No server function imports.
3. **No import from L3/L4/L5.** Never import a route/feature/container file.
4. **Accepts callbacks, not commands.** Never call a C-xx mutation hook directly.
5. **Applies aria props and accessible labels** (Presentation is where WCAG lives; PART 15 §15.3).

Container Component (L3):
```
// src/features/guardian/containers/GuardianConsentContainer.tsx
export const GuardianConsentContainer: React.FC<{ playerRef: PersonRef }> = ({ playerRef }) => {
  const session = useSession();
  const consentsQuery = useGetConsents({ personRef: playerRef });
  const grantMutation = useGrantConsent();
  const revokeMutation = useRevokeConsent();
  const gate = useConsentGateBatch(playerRef, ALL_PURPOSES);
  // compose view model (items[] list) from domain data + gate decisions (structural absence items removed from list)
  const items = buildViewModel(consentsQuery.data, gate);
  const handleGrant = (p) => grantMutation.mutate(...);
  const handleRevoke = (p) => revokeMutation.mutate(...);
  if (consentsQuery.isLoading) return <ConsentTogglesSkeleton />;
  return <ConsentToggles items={items} onGrant={handleGrant} onRevoke={handleRevoke} i18n={...} />;
};
```
Rules for Container:
1. **Calls all the hooks.** Session, queries, mutations, guards, routers. Container is the "glue".
2. **Applies structural absence rules** (PART 09): if gate returns `AGE_PROHIBITED` for P5 on <13, Container removes that row from the `items[]` list entirely. It does NOT pass it to Presentation with `disabled=true`.
3. **Never applies aria props.** Container sends data; Presentation applies semantics.
4. **Handles loading/error states** → renders sibling Skeleton.
5. **Imports only from L2 (Presentation + Skeleton), L1 (lib), and shared feature sink.** Never imports from a sibling feature module.

#### 19.3 Composition Rules
Compose by nesting components. Three PROHIBITED patterns:
1. **HOC (Higher-Order Components) FORBIDDEN.** Use hooks + container composition instead. `withAuth(Component)` → use `useSession()` in a container and conditionally render/redirect.
2. **Render props FORBIDDEN except Radix primitives.** Render props = inversion of control that breaks testability. Use props-as-data (ReactNode typed props) for slots: `rightSlot?: ReactNode`.
3. **Context Providers at L2 FORBIDDEN.** Context may only be declared in L1 (Core infrastructure: AuthContext, QueryClientProvider, RouterProvider). L2 never creates a Context. L3/L4 may create a narrow-scope form-wizard context only if wizard spans 4+ steps with >10 shared fields — default: URL search param wizard state (PART 11 §11.3).

Allowed composition: `<Container><PresentationA slotRight={<PresentationB {...props}/>}/></Container>`.

#### 19.4 Reuse Rules
1. **Domain components live where they're first used, elevate only on 3rd use.** If `<ConsentToggles />` is used in Guardian area AND Player area (adult self-manage), move from `features/guardian/components/` → `components/domain/consent/ConsentToggles.tsx`. Do NOT pre-emptively create a shared component "just in case".
2. **Copy-paste preferred over premature abstraction.** If two components share 80% but diverge on consent vs transfer user-flow, keep two components. Leaking abstraction is more damaging than 40 lines of duplicated JSX.
3. **Feature modules never import sibling feature modules.** Shared code lives in `features/shared/` OR `components/domain/*`. If Guardian feature code imports Organization feature code → refactor: elevate the shared piece to shared sink.
4. **Foundation UI (L2-A) may be imported by every layer. Foundation (shadcn/ui) is the universal sink.**

#### 19.5 Naming Convention (Domain-Aware)
Files + exports use `Entity[Action][Noun]`:
- GOOD: `PersonHeader`, `ConsentToggle`, `MembershipTransferCard`, `JourneyTimeline`, `VerificationEvidenceUploader`, `GuardianConsentContainer`.
- BAD: `InfoBox`, `CardItem`, `RowStuff`, `WizardPage`, `Shared`.
- File name matches export exactly: `PersonHeader.tsx` exports `PersonHeader`. No default exports in L2/L3 components; named exports only. (Routes use default exports per TanStack Start file-based convention — exception only for route files.)

### Rules
1. **Strict import graph enforced by ESLint `boundaries/element-types`:**
   - Layer 5 Routes (routes/*) → may import L4 Features, L3 Containers, L2 Components, L1 lib.
   - Layer 4 Features (features/*/index.tsx, containers) → may import: peer-container inside own feature, L2, L1. MAY NOT import: peer-feature, any L5 route.
   - Layer 3 Containers → may import: L2 (any), L1. MAY NOT import: L4 other feature, L5, or another Container (compose via children, not import).
   - Layer 2 Components → may import: Foundation UI (shadcn L2-A), L1 types/utils/icons. MAY NOT import: L3/L4/L5. MAY NOT import any hook except `useId`, `useMemo`, `useCallback` (presentation-only hooks).
   - Layer 1 Core (lib/*, hooks/*) → may import: only external deps (react, tanstack, zod, etc.). MAY NOT import: anything from L2/L3/L4/L5.
2. Every Container file has a sibling `__tests__/GuardianConsentContainer.test.tsx` (integration test). Every Presentation file has a sibling `.test.tsx` (unit test) and a sibling `.stories.tsx` Storybook entry.
3. No L2 component may accept `className: string` as a generic override prop. If a variant is needed — define a typed variant prop: `variant: 'default' | 'elevated' | 'outlined'`. Generic `className` allows breaking the token system.

### Constraints
- No cross-feature imports between 8 actor areas (public/player/guardian/organization/association/federation/system/shared). Shared is the sink.
- `React.memo` only on L2 Presentation (per PART 14 §14.5 rule 2). Never on L3 Container.
- All props typed with TypeScript interfaces in the same file; no `@ts-expect-error`, no `any` in component signatures. `unknown` only for network boundary before parsing.

### Acceptance Criteria
1. `eslint-plugin-boundaries` run: 0 import-graph violations.
2. `<ConsentToggles />` Presentation unit test: renders 8 rows, calls onGrant(3) on toggle 3 click — 0 network imports.
3. Open 12yo child's Consent view: GuardianConsentContainer's `items[]` list has 6 rows (P5/P8 absent). The ConsentToggles Presentation receives 6 items; DOM has no evidence that P5/P8 exist anywhere in the code path (snapshot match confirms 6 rows).
4. L2 `PersonHeader.tsx` imports: shadcn/ui Card/Avatar, Lucide icons, utils.ts, types. Zero `useXxxQuery`, zero `useRouter` import. (Verified by static grep.)

### Risks
- R-19-01. Container-bloat: container accumulates 1000+ lines, becomes untestable. Mitigation: >400 LOC in a Container → split into a ViewModel hook `useConsentViewModel(playerRef)` (L1 hook) that Container consumes, with hook carrying its own unit test.
- R-19-02. shadcn `add` drift: regenerating `components/ui/button.tsx` undoes our design-token bindings. Mitigation: PART 18 §18.2 tokens are the binding. Never depend on any literal colour/border-radius value in shadcn source; always derive from `--color-primary` CSS vars which we control in styles.css.

### Anti-patterns
- AP-19-01. `const ConsentToggles = () => { const { data } = useGetConsents(...); ... }` — Presentation fetches data (wrong; split Container/Presentation).
- AP-19-02. `export default withRouter(withConsentGate(withMemo(Component)))` — HOC stack.
- AP-19-03. `features/guardian/components/X.tsx` imports `features/organization/lib/roster.ts` — cross-feature import. Move to `features/shared/` or `@/lib/`.
- AP-19-04. `className="mt-6 mb-8 rounded-[14px] bg-[#0f5faa]"` — inline tokens + literal colours (violates PART 18 rules; use semantic classes).

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| 5-Layer strict-one-way graph | PART 02 Application Architecture | §02.1 Layers |
| Container/Presentation split | PART 11 Forms (Container owns state) + PART 15 A11y (Presentation applies aria) | cross-ref |
| shadcn Foundation never mutated post-generation | IDN-UIC-001 Part 3 Foundation | Component Catalogue |
| No cross-feature imports between areas | PART 03 Feature Module Architecture (8 modules, acyclic graph) | §03.1 module slicing |
| Named exports everywhere except routes | TanStack Start file-based routes convention | default export only for `createFileRoute` |

---

## PART 20 — Testing Strategy

### Purpose
Define the testing pyramid for the frontend implementation. Every rule in this blueprint is verifiable by a test. Every business journey step is verifiable end-to-end. Quality gates G5/G6/G7 (PART 26) cannot pass without minimum coverage thresholds per test category defined here.

### Scope
6 test categories: Unit, Integration, E2E, Accessibility, Visual Regression, Performance. Covers test runners, tools, file colocation, minimum coverage, and the explicit acceptance test scripts that derive from the 21 Business Journeys.

### Inputs
- IDN-JRN-001 21 Journeys JRN-01..JRN-21 with DEC-* decision codes (source for E2E test cases)
- IDN-SCR-001 50 screens × 7 areas (source for accessibility scan coverage)
- CONSENT-001 §13 Acceptance Criteria 1–11 → become E2E script assertions
- PRG-VIS-001 VAP metric (North Star): journey completeness + guardian verification must appear in E2E journeys
- Constitution Art. 7 (Stage-Gate Discipline): testing is G5/G6/G7. Article 11 (No-Silent-Failure): error paths are tested, not happy-path-only.

### Outputs
- Test pyramid: ratios of unit:integration:e2e ≈ 70 : 25 : 5.
- Recommended tooling stack derived from TanStack ecosystem.
- Minimum coverage requirements per category.
- Explicit test scripts mapped from JRN-xx journeys.

### Dependencies
- PART 19 Container/Presentation split (test boundaries align with composition split)
- PART 10 Hook conventions (hook tests = integration)
- PART 15 A11y (axe-core = the automated baseline)
- PART 14 Performance (Lighthouse CI = performance test runner)

### Architecture Decision

#### 20.1 Test Categories & Tools

| Category | Level | Targets | Tooling | Threshold |
|---|---|---|---|---|
| **Unit** | L2 Presentation + L1 hooks | Pure logic, view rendering, props→output. Skeletons, toggles, badges, timelines, header variants, utility functions, view-model selectors. | Vitest + React Testing Library (RTL) + happy-dom | ≥ 85% LOC of L2 components; ≥ 95% of L1 pure utility functions. |
| **Integration** | L3 Containers + hooks | Container fetch-flow: loading→skeleton→data→render; mutation happy/sad path; guard composition; form submit → C-xx mutation → cache invalidation; session refresh retry. | Vitest + RTL + @tanstack/react-query-testing-provider + MSW (mock server functions with IDN-API-001 envelope mocks) | ≥ 70% of L3 Container branches covered (happy + error + structural absence paths). |
| **E2E** | Full user journey (JRN-xx) | Register → Link → Verify → Consent → FID issued → VAP (JRN-01→06→09); Transfer flow (JRN-11); Revoke P1 high-risk (JRN-09); Recovery (JRN-17); Merge (JRN-19); Archive/Restore (JRN-15/16); 21 journeys each = 1 E2E suite. | Playwright (Chromium + WebKit on desktop, mobile emulation for 375px) | 100% of 21 JRN-xx have a passing Playwright spec file. 0 flake: retry = 2 max; any permanently-flaky test is flagged as bug (not ignored). |
| **Accessibility (A11y)** | Screen + Component | axe-core scan of every screen in SCR catalogue; plus keyboard-nav manual script for top-20 flows. | axe-core DevTools + Playwright axe integration (`@axe-core/playwright`) in CI | 100% of 50 screens: zero WCAG 2.1 AA critical violations (15.1 §15.1 critical list); 95% screens: zero AA any. |
| **Visual Regression** | L2 Presentation + Critical Screens | Every Presentation component's 3 variants (default, disabled-when-applicable, error); 12 critical screens (dashboard, register, consent, verification, transfer, audit, journey, person, login, 404, maintenance, errorBoundary). | Chromatic (Storybook snapshots) + Playwright screenshot diff for 12 critical screens | Pixel diff approval required on PR; >2px change on critical screen fails PR. |
| **Performance** | Build-time + Runtime | `vite build --analyze` chunk budgets (PART 14 §14.1); Lighthouse CI mobile run on 5 key screens. | Lighthouse CI + vite bundle-size-gate plugin | Performance ≥ 90 on all 5; no chunk > 45KB gzip (PART 14 budgets). |

#### 20.2 File Colocation
```
src/components/domain/consent/
  ConsentToggles.tsx            L2 Presentation
  ConsentToggles.test.tsx       Unit (Vitest)
  ConsentToggles.stories.tsx    Visual regression input (Storybook)
  ConsentTogglesSkeleton.tsx    (PART 13 skeleton)

src/features/guardian/containers/
  GuardianConsentContainer.tsx   L3 Container
  __tests__/GuardianConsentContainer.test.tsx  Integration (Vitest + MSW)

e2e/
  jrn-01-register-person.spec.ts     JRN-01
  jrn-09-high-risk-revoke.spec.ts    JRN-09
  jrn-11-transfer.spec.ts            JRN-11
  ... 18 more (21 total)
```

#### 20.3 Mock Strategy
MSW intercepts ONLY at the server-function boundary. Do NOT mock TanStack Query. Do NOT mock hooks.

Mock fixture library maps directly to IDN-API-001 response envelopes:
```
tests/fixtures/
  Q-01-get-person-12yo-fid-pending.json    { ok:true, data: {...}, traceId:'fixture-trace' }
  Q-06-get-consents-missing-p1-p2.json     Consent statuses for missing-required test
  C-07-revoke-p1-high-risk-success.json    Event emission payload
  C-07-revoke-p1-verification-level.json   ApiError { code: 'WRONG_VERIFICATION_LEVEL' }
```

Fixture naming convention: `{C|Q}-{NN}-{brief-scenario-slug}.json`. Every fixture MUST include the `traceId` field (validates PART 21 audit flow in tests).

#### 20.4 E2E Script Acceptance (from JRN)
Every `e2e/jrn-*.spec.ts` file mirrors exactly the step structure in IDN-JRN-001 PART 6. Example: JRN-09 High-Risk P1 Revoke → spec steps:
```
Step 1.  Login guardian L2 (fixture: guardian-l2-verified).
Step 2.  Navigate /guardian/players/$playerRef/consent (SCR-GRD-04).
Step 3.  Assert 8 consent rows; P1 toggle ON.
Step 4.  Click Revoke on P1.
Step 5.  Confirmation dialog opens. Asserts typed confirmation "YA SAYA SETUJU"
         input NOT equal to "YA SAYA SETUJU" → Confirm disabled. After input
         matching + audit checkbox ticked → Confirm enabled.
Step 6.  Click Confirm. C-07 fires. Assert server event ConsentRevoked with
         revocation_highRisk_reasonRequired, effectiveImmediately=true.
Step 7.  Assert aria-live="assertive" region announces "Persetujuan P1 dicabut".
Step 8.  Assert VAP status indicator changes from ACTIVE → INACTIVE (CTI decrement
         signal shown on dashboard, toast "Akses dicabut SEKARANG." per CONSENT-001 §10).
Step 9.  Assert Audit log accessible via SCR-FED-08 later contains the traceId.
Step 10. Navigate to Org Directory as Coach (different session): player no longer
         visible in roster (P1 required for SSB roster visibility).
```
Every DEC- decision code from IDN-JRN-001 MUST appear as a Playwright assertion comment in the spec.

#### 20.5 Coverage Enforcement
- CI gates:
  - Unit + Integration combined coverage (vitest --coverage):
    - Statements ≥ 80%
    - Branches ≥ 70%  (to keep structural-absence branch tests required)
    - Functions ≥ 85%
    - Lines ≥ 80%
  - E2E: every JRN-xx spec present in `e2e/` folder; every step from JRN referenced in comments; 100% of them green on main branch.
  - A11y: every screen-id from SCR catalogue has a corresponding axe scan in Playwright global setup.
- PRs that lower coverage by > 0.5% in any category → fail status check, required approval from Architecture Council before merge.

### Rules
1. **No snapshot tests of HTML DOM strings.** Use semantic RTL queries: `screen.getByRole('switch', { name: 'Identitas P1' })`. (Snapshot snapshots are for visual regression only via Chromatic.)
2. **Every structural-absence rule in PART 09 has an integration test.** Example: GuardianConsentContainer with 11yo subject → test assertion `expect(screen.queryByRole('switch', { name: 'P5 Scouting' })).not.toBeInTheDocument()`.
3. **Never mock window.location, router, or sessionStorage. Use TanStack Router TestRouter in integration tests. Never navigate by location.assign.**
4. **Error paths are mandatory test cases, 1:1 with every rule in PART 12.** At minimum: SESSION_STALE refresh flow success/fail, VALIDATION_FAILED field rollup, PERMISSION_DENIED 403→404 unified visual, offline banner.
5. **Test language = Indonesian copy where copy is asserted.** Example: expect toast text = "Pencabutan P1 berhasil — akses dicabut SEKARANG." (Bahasa, per NFR-12). Do not test against English text.

### Constraints
- Visual Regression: Playwright diffs run ONLY on a fixed Linux container image with fixed font rendering stack (4pt font hinting off; OS same as CI). Avoids cross-platform pixel drift.
- No testing on IE11 or Edge-legacy. Browser list: Chrome latest, Firefox latest, Safari latest (desktop + iOS mobile webkit), Chrome Android WebView latest.
- No data ever touches real Lovable Cloud environment in E2E. All E2E runs against a seeded test instance with synthetic data (personRefs in fixtures start with `TST_` prefix — test data namespace).

### Acceptance Criteria
1. CI pipeline: Unit → Integration → Build → Visual Reg → A11y → Lighthouse → E2E, in that order. Any stage fails → pipeline terminates; next stage does not start. (Faster feedback.)
2. E2E JRN-09 run against 11yo subject: attempt P5 revoke UI step → P5 row absent from DOM (structural-absence test; cannot click absent element).
3. Lighthouse on login page (mobile): FCP < 1.8s, LCP < 2.5s, INP < 200ms, A11y = 100.
4. axe-core scan of SCR-GRD-04: zero critical AA; 0 total AA. (Verified in CI artefacts `axe-reports/scrn-grd-04.json`.)

### Risks
- R-20-01. E2E flakiness on slow networks / Cypress-alike network races. Mitigation: Playwright web-first assertions (`await expect(locator).toBeVisible({ timeout: 10000 })` never `page.waitForTimeout`); disable animations on test env.
- R-20-02. Fixture drift from API contract changes. Mitigation: fixtures use typed JSON schemas derived from IDN-API-001 OpenAPI; CI step `pact-like` contract-check: fixture shape vs generated API TypeScript types.

### Anti-patterns
- AP-20-01. `it('renders')` — tests nothing meaningful. Every assertion tests a business requirement traceable to an artefact.
- AP-20-02. Mock `useGetConsents = vi.fn()` — mocks hooks instead of server responses. Wrong layer to mock. Mock server-function envelope only (MSW).
- AP-20-03. `expect(wrapper.find('button').at(3).hasClass('bg-primary')).toBe(true)` — implementation-coupled tests (tied to CSS classes). Test semantics: `toBeEnabled()`, accessible name, aria state.
- AP-20-04. E2E skips 11yo P5 absence case with `// skip because structure absent` — structural absence IS the most critical test.

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| 21 E2E suites (1 per JRN) | IDN-JRN-001 PART 1 Journey list JRN-01..JRN-21 | full list |
| WCAG AA automated baseline | PART 15 Accessibility §15.1 | axe-core |
| VAP lifecycle coverage in E2E | PRG-VIS-001 §1 North Star Metric | VAP definition |
| High-risk revoke script steps | CONSENT-001 §10 High-Risk revocation + §13 AC | rules 0..5 |
| Performance budgets (Lighthouse thresholds) | PART 14 Performance §14.1 budgets | 90/95 targets |
| Stage-Gate Discipline | Constitution Art. 7 | G5/G6/G7 = PART 26 |

---

## PART 21 — Observability

### Purpose
Define the frontend logging, analytics, telemetry, and audit subsystem. Every user action that changes state (C-xx commands), every error (PART 12), and every sensitive access (break-glass, minor record read by Platform roles) is auditable. Analytics are consent-gated behind P7; if P7 not held, analytics events never fire.

### Scope
4 telemetry streams: (1) Audit Log (append-only, server-stored, mandatory), (2) Error Log, (3) Feature Usage Analytics, (4) Performance Telemetry. Covers payload shape, transport, consent gating, and trace-id correlation with server logs.

### Inputs
- CONSENT-001 closed purposes: P7 Analytics (consent-gated). If P7 revoked, no analytics stream. No "essential telemetry" backdoor that fires when P7 not held. Data minimisation: STK-INV-001.
- PART 08 Session: every audit entry carries session personRef.
- PART 12 Error handling: every error calls logger.error(...) before UI renders.
- PRG-STK-001 PART 9 privacy classes: Audit data = Confidential + Federation-Only (AUDITOR role reads, others do not).
- Constitution Art. 6 (Explainability): user may see their own audit entries (SCR-GRD-08 Access Log).

### Outputs
- Logger module `@/lib/observability/logger.ts` with levels trace/info/warn/error/audit.
- Audit payload schema (TraceableAuditEntry).
- Analytics hook `useAnalyticsEvent(name, payload)` → no-op if P7 absent.
- Performance telemetry Web Vitals reporter.

### Dependencies
- PART 09 Consent guard (P7 gate).
- PART 08 Session (personRef, csrfToken for transport).
- PART 23 Offline (audit events queued when offline, retried on reconnect — write queue share).

### Architecture Decision

#### 21.1 Logging
Logger in `@/lib/observability/logger.ts`. Four severity levels:

| Level | Destination | Usage |
|---|---|---|
| `error` | Console + Server audit endpoint | ApiError envelope fails, React boundary catches, SESSION_REVOKED, 403/404/503 displays. |
| `warn` | Console (dev only — dropped in prod) | Deprecated API use, stale snapshot > 10min used, hydration mismatch. |
| `info` | Dropped in prod unless viewer = PLATFORM role (enables verbose session) | Navigation events for support debug. |
| `trace` | Dropped entirely in prod. Dev only. | Component mount/unmount debugging. |
| `audit` | Server audit endpoint ONLY. Never console. | Every C-xx mutation success or failure, every break-glass access, every read of child-sensitive data by non-guardian viewer (Coach reading DOB → audit), every consent grant/revoke/Purpose-PII read. |

Log payload shape for all non-trace levels:
```
{
  level,
  message: string (i18n key preferred, never raw user PII),
  traceId: string,   // from PART 10 ApiError or server loader
  personRef: string, // from session (or null for unauthenticated)
  roles: string[],   // active role contexts at time of event
  path: string,      // current route path (not full URL to avoid ?query leakage)
  timestamp: ISO8601,
  // optional per-level:
  error?: { code, message, stackTraceHash }  // stack is HASHED (not shipped)
  audit?: AuditMetadata { resource, action, subjectRef, dataClass, policyVersion, decisionOutcome }
}
```
Transport: BATCH POST `/audit/ingest` server function. Batching: 5s or 25 entries whichever first. Backend server deduplicates via idempotency key (client-side).

#### 21.2 Analytics (Consent-Gated)
Analytics = P7 Purpose from CONSENT-001 closed list. **Consent-gated architecture.** Hook contract:
```ts
// returns fireFn; fireFn is a no-op if P7 not held
function useAnalytics() : {
  track: (event: AnalyticsEvent, payload?: Record<string, string|number|boolean>) => void
}
type AnalyticsEvent =
  | 'screen_view'            // route mount
  | 'consent_grant_success'  // C-06 success
  | 'consent_revoke_success' // C-07 success
  | 'wizard_step_complete'
  | 'child_switch';
```
Implementation rules:
1. `useAnalytics()` reads `consentHeldPurposes` from PART 08 SessionContext. If P7 ∉ set → `track` = `() => {}` (pure no-op, not even a branch-return to avoid even an any-observable side-channel).
2. Analytics payload NEVER includes person display name, raw Football ID display code, raw DOB, contact details, health fields. Only opaque refs and counters. If payload needs person dimension, use `personRefHash = sha256(salt + personRef)` rotated daily salt (PII decoupling).
3. No third-party analytics SDKs (Google Analytics, Segment, etc.) loaded in the browser. Analytics = first-party POST only to Lovable Cloud.
4. On P7 revocation (C-07): any queued analytics events (in-transit batch) that were captured BEFORE revocation → drain remaining queue, CLOSE the analytics client for remainder of session. No new events from any future user action. (Persistence of already-queued events is allowed since they were captured under consent; new events after revocation = illegal under CONSENT-001 §10 revocation effect-first.)

#### 21.3 Telemetry (Performance — Not Consent-Gated)
Web Vitals (INP, LCP, FCP, CLS, TTFB) are captured via `web-vitals` npm package. **Purpose classification: platform-quality / aggregated de-identified telemetry, not P7 analytics (CONSENT-001 P7 purpose ≠ quality telemetry).**
- Payload: { metric name, value, pagePath, routeId, browserName, os, viewportBucket (PHONE/TABLET/LAPTOP/DESKTOP) }
- No personRef attached. No playerRef. No personRefHash. 100% de-identified aggregated; cannot be joined back to a user.
- Transport: same batched POST, separate `/telemetry/vitals` endpoint. Dropped if batch contains any traceable identifier.

#### 21.4 Audit (Mandatory, Not Consent-Gated — Child-Safety)
Audit entries are required by Indonesian Personal Data Protection Law (UU PDP 27/2022) and by Child Safety framework — they are the sole mechanism for the Child Protection Officer to trace wrongdoing. Audit fires unconditionally regardless of consent.

What is audited (list — anything not on this list is NOT audited):
1. Every C-xx command (mutation) success AND failure — payload: command id, subject, decision outcome, actor, policy version, traceId.
2. Every access to a child-person record by a viewer WHO IS NOT the guardian-of-that-record AND not the person themselves (Coach viewing Player → audit; Federation Officer reviewing Guardian Evidence → audit). Audit data class accessed per PART 09 §09.6 matrix.
3. Every break-glass session (PLATFORM I roles accessing non-public area): persistent banner in UI per PART 09 §Rule4; every API call during break-glass carries `breakGlassSessionId` in audit metadata.
4. Every P1/P2 high-risk revocation per CONSENT-001 §10 (the most consequential state transitions).
5. Session start, session end, session refresh, session step-up (MFA).

Audit destination: Server append-only PostgreSQL table with RLS that only AUDITOR + CHILD_PROTECTION_OFFICER + PRIVACY_OFFICER roles may SELECT. No INSERT except via audit-ingest server function that validates caller session matches the declared actor. Users may see ONLY OWN audit entries via SCR-GRD-08 Access Log (projection: "you revoked P1 on date X"), never entries of other users (Constitution Art. 6 Explainability vs Art. 8 server-authoritative = user sees their own history).

#### 21.5 Trace Correlation
Every request/response carries:
- `X-Trace-Id` (UUID — generated at first hop, passed through server functions, returned in envelope, used in log/audit entries end-to-end).
- User reports of "something went wrong" display last-4 of traceId to non-Platform users (PART 12 §12.1). Platform roles see full 32-char UUID.

### Rules
1. **Audit entries are never edited, never deleted, never soft-removed.** RLS = read-only to read roles; append-only to write role.
2. **No console.log in production.** Development-only. Logger module drops trace/info in prod; warn/error go to logger transport (not native console that a user might sideload-script-exfiltrate).
3. **Never ship raw stack traces to the server.** Ship `stackTraceHash = sha256(stack + secretSalt)` only (salt known by server; client cannot forge matching hashes). Full stacks logged to native console in staging only.
4. **P7 revocation effect → analytics client disabled for session.** Client state machine tracks `analyticsEnabled: boolean`; set false on C-07 P7 revoke success; cannot be re-enabled without full logout+re-login (re-hydrates consent snapshot).

### Constraints
- Audit batch delivery cannot block user-critical mutation path. Audit fire-and-forget; if audit endpoint itself fails → write to PART 23 offline write queue with priority=audit. Retry on reconnect with exponential backoff. Queue cap: 500 audit entries. If queue full (network outage > 3 days) → user sees banner "Akses log lokal penuh. Hubungkan kembali perangkat dalam 24 jam atau data audit lokal akan dihapus." (Never compromise access for failing audit; audit best-effort after queue threshold.)
- No third-party script (analytics, RUM, error tracker) in the `<head>` or deferred scripts. All telemetry = first-party.
- Logs/audit stored server-side never leave Indonesian data jurisdiction (per PRD geo-sovereignty if present; default Lovable Cloud regional pin Singapore or Jakarta when available).

### Acceptance Criteria
1. C-07 (Revoke P7) E2E: track('any') called before revoke → queued before revoke drains ok; after revoke success, 5 subsequent track() calls → 0 network requests, browser queue empty.
2. Break-glass session (PLATFORM_SUPPORT) opens a minor's consent page → audit endpoint POSTed with dataClass=child-sensitive, viewer=SUPPORT-ref, subject=minor-ref, breakGlassSessionId present.
3. SCR-GRD-08 (Guardian Access Log): guardian sees list of 14 "You granted P3" / "You viewed DOB of" entries; cannot see any action taken by Coach of child's team on same child record. (Server RLS.)
4. `console.log` production build: CI grep step scans final bundled output JS for `console.log` strings → 0 matches. Logger wrapper only.

### Risks
- R-21-01. Audit queue overflow on very long offline period → loss of compliance trail. Mitigation: warn banner at 75% full; red banner at 95%; platform alert if a user session reaches 90%.
- R-21-02. Consent P7 gating bug: analytics track() branch still reaches network via a lazy handler. Mitigation: E2E test suite JRN-09 P7 revoke asserts that network tab (Playwright page.route) shows 0 `/analytics` requests after revoke state applied.

### Anti-patterns
- AP-21-01. `if (!consent.P7) { return; } else { sendAnalytics(); }` — visible code branch. Use runtime function replacement: `track = noop` assignment. Avoids observable branch timing side-channels.
- AP-21-02. Audit `DELETE` SQL in migration script — violation of append-only.
- AP-21-03. `import LogRocket from 'logrocket';` — third-party script. Forbidden.
- AP-21-04. console.error('PII here:', person); — prints PII to client console. Logger module masks all fields except ref.

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| P7 gate on analytics | CONSENT-001 closed purposes P1..P8 | P7 purpose |
| Analytics no-op after P7 revoke, effect-first | CONSENT-001 §10 High-Risk revocation general rule | revocation effect before audit/notification |
| Audit mandatory (child-safety + data protection) | UU PDP 27/2022 + Constitution Art. 0 (Child's Interest Prevails) | audit trail |
| User sees own audit entries (explainability) | Constitution Art. 6 (Explainability) | SCR-GRD-08 |
| Break-glass audit + banner | PART 09 Authorization §Rules 4 | break-glass session banner |

---

## PART 22 — Security

### Purpose
Define the frontend security architecture. Prevent XSS, CSRF, session theft, PII leakage to storage, and enforce client+server validation dual-layer. The frontend is the first (insecure) layer; server re-validates everything (Constitution Art. 8). But frontend still defends against injection and exfiltration.

### Scope
7 domains: XSS, CSRF, Session, Storage, Sensitive Data, Client Validation, Server Validation. Covers CSP headers, cookie attributes, HTML sanitization, upload validation, and CORS rules (where applicable to server functions).

### Inputs
- Constitution Art. 8 (Server-Side Authority): "client checks = presentation only"; server re-validates.
- PART 08 Session (httpOnly Secure SameSite=Lax cookie — no localStorage JWT).
- PART 09 Structural Prohibitions STK-INV-004 (architectural absence > permission deny).
- CONSENT-001 storage of consent proof (append-only, never editable client-side).
- IDN-PRD-001 FR-PER-05: no hard delete of Person (archive/restore only; no exposed delete action client-side).

### Outputs
- CSP policy, cookie attribute matrix, HTML sanitization strategy, upload validation flow, CORS origin list.
- CI security gate: `npm audit` high severity fail; eslint-plugin-security scan; dependency review.

### Dependencies
- PART 10 API (CSRF token on mutating calls).
- PART 11 Forms (server-validation rollback).
- PART 21 Audit (log security events: CSP violation, suspected XSS attempt).

### Architecture Decision

#### 22.1 Cross-Site Scripting (XSS)
Defense-in-depth, 4 layers:

1. **React auto-escapes JSX.** Rendering `{userSuppliedString}` in JSX is safe. The THREE unsafe patterns MUST be reviewed and wrapped; never used without sanitization:
   - `dangerouslySetInnerHTML` → FORBIDDEN unless it is Guardian Annotation rendering text + safe formatting (bold/italic only via markdown); then sanitized with DOMPurify with an allow-list of <b><i><ul><ol><li><p>. NO <a href> (no link injection by guardians).
   - `useRef + ref.current.innerHTML = ...` → FORBIDDEN.
   - Rendered attributes like `href={userUrl}` → MUST prepend `https://` if URL scheme not present, and reject javascript:/data: schemes.

2. **Content-Security-Policy (CSP) Response Header (TanStack Start root loader set-cookie header-equivalent — via SSR headers middleware):**
   ```
   Content-Security-Policy:
     default-src 'self';
     script-src 'self' 'sha256-{themeInlineScriptHash}' 'strict-dynamic';
     style-src 'self' 'unsafe-inline';   /* Tailwind injects inline styles; unavoidable */
     img-src 'self' https: data: blob:;  /* user avatars from Lovable Storage https: */
     font-src 'self' data:;
     connect-src 'self';                 /* server functions only; no third-party endpoints */
     frame-ancestors 'none';             /* no iframing (prevents clickjacking) */
     form-action 'self';
     base-uri 'self';
     object-src 'none';
     report-uri /audit/csp-violation     /* PART 21 audit endpoint logs CSP hits */
   ```
   The PART 17 inline theme script's SHA256 hash is computed at build time and injected into CSP. No `'unsafe-inline'` for script-src.

3. **`@typescript-eslint/no-implied-eval` + `eslint-plugin-security`** forbid `setTimeout(string)`, `eval()`, `new Function()`, innerHTML, dangerouslySetInnerHTML without ESLint disable that references a sanitization review.

4. **Autosanitize all server-function HTML/markdown inputs:** If C-18 (Annotation Create) ever emits annotation content back to the UI, the server re-runs sanitization before projecting. Frontend trusts nothing.

#### 22.2 CSRF
1. **Cookie attributes (PART 08 §08.1) enforced:** `httpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800;` (7 days).
2. **CSRF Token pattern (PART 10 §10.1):** Session loader returns `csrfToken` string (per-session, rotated on login/logout). Every mutating server function (C-xx command) reads `X-CSRF-Token` header and matches to session store; mismatch → 403 `CSRF_MISMATCH` audit-logged.
3. **Read-only queries do NOT require CSRF** (Q-xx are safe).
4. **No `application/x-www-form-urlencoded` form posts.** All mutation requests use `Content-Type: application/json` (requires CORS preflight by browser for cross-origin; natural CSRF barrier since cross-site forms cannot force JSON POST with custom CSRF header).

#### 22.3 Session Security
- No JWT in localStorage / sessionStorage / IndexedDB. Sole storage = httpOnly cookie (PART 08 §08.1).
- **Session fixation blocked:** Server rotates session ID after login, after MFA step-up, after privilege elevation (association role invite accepted).
- **Idle timeout:** 30 minutes of no user interaction (no click/scroll/touch/key) → show "Sesi akan habis dalam 2 menit" modal with [Lanjutkan] button. No confirmation within 2 min → PART 08 logout flow with `idleTimeout=true` query.
- **Concurrent session cap:** 5 sessions per person. 6th login → oldest session revoked → oldest tab receives 401 SESSION_REVOKED → PART 08 flow.

#### 22.4 Storage
- **localStorage contents (allowed items only):**
  - `theme-preference` (PART 17)
  - `a11y-preferences` (reduced-motion, high-contrast toggles PART 15)
  - `form:{formId}:{fingerprint}` drafts (PART 11, session-scoped keys; clear on logout)
  - `idempotency-store` (PART 10 idempotency keys LRU)
  - **Nothing else. No personRef, no Football ID, no consent values, no contact details.**
- **sessionStorage** — same whitelist (drafts + idempotency); cleared by browser on tab close; additional explicit `.clear()` on logout.
- **IndexedDB** — ONLY PART 23 offline write queue + PART 21 audit queue. Person data never stored (stale query cache is TanStack Query memory cache only; never persisted between reloads unless explicitly rehydrated by server render with partial SSR transfer state).

#### 22.5 Sensitive Data Handling
- **DOB raw value:** Presented ONLY to Guardian viewer of that child (PART 09 §09.6 matrix). Any coach/org view of roster → show age-band enum (U-10, U-12, U-14, Senior) NEVER raw date. Age computed server-side (PART 09 R-09-02 fix server).
- **Contact details (email, phone, WhatsApp):** Guardian R/W. Other roles never see. SearchPersons Q-02 for a Coach viewer returns contact=null from the server (RLS); client does not need to redact (since it never receives).
- **Football ID display code (FID-XXXX-XXXX-CC):** Shown in identity strip always. Never used as a route param; never used as query key; never used as form identifier. All internal keys = opaque personRef UUID (ADR-0002).
- **Clipboard copy:** Copy-to-clipboard button on FootballIdBadge copies full display code. Never copies personRef UUID (internal ref not user-meaningful).
- **Screen reader: no announce of sensitive data on navigation.** `aria-live` regions only emit "Persetujuan dicabut" / "Tersimpan" style summaries, never raw values.

#### 22.6 Client & Server Validation (Dual Layer)
Per Constitution Art. 8 (Server Authority) — **Both layers mandatory.** Single layer = insufficient.

| Concern | Client Layer | Server Layer |
|---|---|---|
| Required fields | Zod schema in PART 11 Zod schema | Same Zod schema imported from `@/lib/forms/schemas/*` (single source); server applies identical schema before domain logic. |
| DOB in past | Client: `refine(dob => dob < today)` | Server: same refine + SQL constraint `CHECK (dob < CURRENT_DATE)`. |
| Email format | `z.string().email()` | Same + DNS MX check async (stricter) + disposable-domain denylist. |
| Consent P5 <13 structural | Container removes row from items[] (Presentation never sees) | Server applies same AGE_GATE in 6-step guard; returns AGE_PROHIBITED if call made with forged permission. |
| File upload size/types (evidence SCR-GRD-05) | Client: bytes + ext check. | Server: magic-byte check (PNG/JPEG header, PDF %PDF-1.), actual bytes, virus-scan hook (if available) before storing. |

**No client-only validation bypasses server. Ever.**

### Rules
1. Every PR runs `npm audit --production`. Any HIGH or CRITICAL advisory in production deps → PR block. Upgrade or justify. Dev-only HIGH advisories acceptable if dev-only package not shipped in browser bundle.
2. `dangerouslySetInnerHTML` count in entire `src/`: ≤ 1 instance (GuardianAnnotation renderer). CI grep step: count matches. Exceeding count → block PR until review.
3. No third-party CDN imports. All fonts (PART 18.3) = self-hosted /fonts/*.woff2. No Google Fonts <link href> (privacy leak of user IP to Google).
4. CORS origins: Lovable Cloud whitelists production hostname + preview hostnames only. Wildcard `*` CORS FORBIDDEN. Server functions decline `Origin: null` (file://, about:blank origins).

### Constraints
- Lovable Cloud security: Serverless function execution context is untrusted for long-lived secrets; RLS is the true data access gate. Client never accesses DB credentials.
- File upload: single max 10MB (client); server max 10MB. Over → 413 Payload Too Large error envelope PART 10.
- No QR code rendering of any person/consent/membership record (prevents offline replay attacks via QR intercept by non-authorities). If QR needed in future: signed short-token, server-validated, with TTL — not plain data.

### Acceptance Criteria
1. CSP policy served on login page response headers. Chrome DevTools → Security → CSP: script-src = self + strict-dynamic + theme-script hash; no 'unsafe-inline' script.
2. Craft `data:text/html,<iframe src="https://prod/app/player/consent">` → frame blocked (frame-ancestors none).
3. Cross-site form at attacker.com POSTs JSON to /identity/revoke-consent → blocked by SameSite=Lax cookie not sent + CSRF token missing → 403 audit log entry created.
4. Coach role views SCR-ORG-02 roster → open DevTools Network tab → Q-02 SearchPersons response JSON → `contact` property = null on every row; `dob` property = absent (not "null", key missing).
5. `npm audit --production` → 0 HIGH, 0 CRITICAL on release tag.

### Risks
- R-22-01. CSP `strict-dynamic` breaks third-party browser extension injection → user reports "page blank"; mitigation: CSP-report-only mode 2 weeks in staging before enforce; monitor violation report endpoint.
- R-22-02. SameSite=Lax breaks deep-link OAuth flow if Lovable Cloud Auth uses cross-site POST. Mitigation: ensure auth flow uses GET redirects (Lax allows top-level GET cookie); never cross-origin POST.

### Anti-patterns
- AP-22-01. `localStorage.setItem('player', JSON.stringify(person))` — stores PII in localStorage. Forbidden under whitelist.
- AP-22-02. `<a href={userSubmittedLink}>` without scheme validation, permits `javascript:alert(document.cookie)`.
- AP-22-03. Server function skips Zod validation because "client already checked". (Violates Constitution Art. 8.)
- AP-22-04. `Cookie: SameSite=None; Secure` — unnecessary; weaken from Lax to None is regression.

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| Client checks = hint only; server true authority | Constitution Art. 8 (Server-Side Authority) | Art. 8 |
| No hard delete of Person (archive only) | FR-PER-05 No Hard Delete | IDN-PRD-001 §8.1 |
| Absent capability > permission denied (architectural XSS surface) | Constitution Art. 9 Privacy-by-Architecture | Art. 9 + STK-INV-004 |
| Cookie: httpOnly + Secure + SameSite=Lax | PART 08 §08.1 Session Lifecycle | no localStorage token |
| PII minimisation in UI | STK-INV-001 Data-Minimisation-by-Capability | invariant |

---

## PART 23 — Offline Strategy

### Purpose
Define the PWA offline capability. Rural connectivity (PRG-VIS-001 §5 target reach) means intermittent connectivity is common. The application must remain usable as a reader of already-visited pages AND allow a small writer queue (Attendance, Guardian Annotations) to be captured offline and reconciled on reconnect.

### Scope
5 domains: Read cache, Write queue, Conflict resolution, Reconnect detection & UI, Sync (full state reconciliation). Constrained to "low-risk write operations" only; mutations that would change eligibility or consent are NOT queued offline.

### Inputs
- PRG-VIS-001 §5 (rural connectivity / broad device reach)
- PART 07 State: Server-State = TanStack Query cache (in-memory); Offline-Writes = IndexedDB queue
- PART 10 §10.3 (mutation idempotency keys — essential for sync replay)
- PART 12 §12.4 (offline banner)
- IDN-PRD-001 NFR-08: Offline-reconcilable DisplayCode (Football ID display code is determined offline-safe)

### Outputs
- IndexedDB schema for write queue
- `useSyncService()` hook that drives reconnect → drain queue → resolve conflicts → update cache
- Read-cache strategy (SSR transfer state + query cache hydration)
- Conflict resolution matrix

### Dependencies
- PART 14 Performance (service worker = PWA; static asset cache only — never API response)
- PART 10 Idempotency (queued writes carry their key)
- PART 21 Audit (audit queue share)

### Architecture Decision

#### 23.1 Read Offline (Cache-aside from SSR)
Goal: user visits dashboard once online → closes tab, opens offline later → dashboard renders from cache with "Data mungkin tidak terbaru" badge.

Mechanism:
1. **TanStack Query `persister` adapter backed by IndexedDB.** Persister stores only the most recently used 25 queries (LRU). TTL per persisted query entry = 24 hours max (consent status must not be stale).
2. **Whitelist of cacheable queries (all Q-xx):** Q-01 (GetPerson), Q-03 (Journey), Q-04 (Memberships), Q-06 (Consents), Q-07 (Verification), Q-09 (Activities).
3. **Never cache Q-11 GetAuditHistory, Q-08 GetGuardianLinks (partially — up to 5 entries), Q-10 GetPolicies.**
4. On route mount offline: `useQuery(..., { networkMode: 'offlineFirst' })` → returns persisted data immediately if it exists; renders badge.
5. **Never store raw DOB or contact fields in persisted cache.** Persister runs a stripping transform (before write to IndexedDB): removes `dobRaw`, `contact.email`, `contact.phone`, `health.medicalNotes` keys from cached DTO. If user is offline and navigates to a view that needs stripped fields → placeholder "Hubungkan kembali untuk melihat data lengkap".

#### 23.2 Write Queue (IndexedDB)
Low-risk writes ONLY. The following C-xx commands are eligible for offline queue capture:

| Eligible C-xx | Operation | Risk |
|---|---|---|
| C-20 RecordActivity | Training attendance check-in. | Low. Data-append only. |
| C-05 Guardian Annotation Create | Note append. | Low. Append-only; reviewed later. |
| Audit & Telemetry events (PART 21) | Logging. | Low. Best-effort. |

**INELIGIBLE commands (always require online; if offline → trigger disabled with tooltip):**
- All consent mutations C-06/C-07 (cannot defer a high-risk revocation — effect-first; offline = cannot apply effect).
- All Membership C-12 to C-16 (eligibility, transfers, promotions) — domain rules require fresh server state.
- All Policy C-21/C-22, Merge C-19, Archive C-17.
- Person register C-01, FID issue C-02, Guardian link C-03/C-04/C-05 (identity-authoritative writes).

Queue storage: IndexedDB database `idn_write_queue_v1`, object store `pending_writes` keyed by `idempotencyKey` (PART 10).
Row shape:
```
{
  idempotencyKey: string,   // UUID (deterministic per offline operation session + timestamp + actor + payload)
  createdAt: ISO8601,
  command: 'C-20' | 'C-05' | 'AUDIT' | 'TELEMETRY',
  payload: object,          // typed per C-xx
  sessionFingerprint: string,
  retries: number,
  lastError?: string,
  priority: 'NORMAL' | 'AUDIT'
}
```
Queue cap: 500 rows total. Audit priority rows dequeued before normal priority on drain.

#### 23.3 Conflict Resolution
Sync drain on reconnect applies:
1. Idempotency (PART 10 §10.3) — each row's key is sent. If server has already processed identical idempotencyKey → server returns stored result; queue row acked; UI state updated. No double-apply.
2. **Last-Write-Wins (LWW) on RecordActivity C-20 attendance toggle** — if same player X session already has conflicting mark (present vs absent) set by a Coach B while Coach A was offline: the LATER write wins. Conflict payload written to Audit under `CONFLICT_RESOLVED` metadata; viewer can see diff.
3. **Guardian Annotation C-05: never conflicts.** Annotations are append-only; ordering by timestamp; concurrent writes = both stored in order (no overwrite semantics in IDN-API-001 C-05 — append never replaces).
4. **Hard conflicts (server now returns CONSENT_REQUIRED or AGE_PROHIBITED on what was valid offline)** → queued row moved to `dead_letter` object store; user notified banner "X aksi gagal karena izin berubah saat offline. Tinjau ulang." with [Tinjau] link back to the relevant context screen. Manual resolution only. Never silent drop.

#### 23.4 Reconnect Detection & UI
Detection (PART 12 §12.4 already uses online/offline events). Additional state machine:

```
ONLINE → (offline event) → OFFLINE:
  - Dock banner top, non-dismissing.
  - Ineligible mutation buttons disable with tooltip.
  - Eligible mutation buttons enabled; submit writes to queue.
  - Badge "Data mungkin tidak terbaru" on data cards.

OFFLINE → (online event) → RECONNECTING:
  - Banner state: "Menghubungkan kembali. Mengirim perubahan tersimpan..."
  - Service drain queue: AUDIT first, normal after, oldest first.
  - Progress bar if queue > 20 rows.

RECONNECTING → ONLINE-SYNCED:
  - After queue drain + refetch of dirty queries (C-20 writes invalidate Q-09 Activities).
  - Banner disappears.
  - Toast: "X perubahan tersinkron." (if > 0 queued).
```

#### 23.5 Sync Strategy
Drain order:
1. Session refresh (PART 08 §08.2) — ensure session still valid before sending queue. If 401 → stop drain; user redirected to login.
2. Audit queue rows (priority AUDIT) — FIFO by createdAt.
3. C-05 Annotation writes (FIFO).
4. C-20 Activity writes (FIFO, max 20 concurrent to avoid stampede).
5. Telemetry rows, last.

After drain success, `queryClient.refetchQueries({ stale: true })` of all stale-time expired queries. Prefetch next-step data per PART 14 §14.3 idle tier.

### Rules
1. **No cached Person DOB/contact/health in IndexedDB.** Persister transform filter runs in L1 layer; CI tests ensure stripped by comparing storage snapshot to raw DTO.
2. **Eligible commands only.** Queue throws (caught → banner "Tindakan ini membutuhkan koneksi") if any non-whitelisted C-xx is enqueued.
3. **Dead letters are never cleaned up automatically.** User must explicitly [Buang] after review; or after 30 days → banner reminders.
4. **Idempotency keys generated at offline-enqueue time, NOT regenerated on drain.** If key regenerated on sync → double-apply risk. Keys stable.

### Constraints
- Service Worker: TypeScript-generated via Vite PWA plugin `@vitejs/plugin-pwa`. Scope = `/`. Precache manifest for static assets only; runtime caching: only static assets, fonts, images (same-origin). Never `/identity/*` server function responses.
- IndexedDB quota: Browser-enforced ~50MB (varies). Queue + persister combined target < 5 MB. If LRU evicts queries, old dropped silently; only 25 newest kept.
- Offline Registration (JRN-01) NOT supported. Register requires identity-authoritative writes (email confirmation, guardian evidence). Offline user sees "Sambungkan kembali untuk mendaftar."

### Acceptance Criteria
1. E2E Playwright: Set offline (context.setOffline(true)) → navigate SCR-GRD-01 dashboard → renders with data from previous online run, shows "Data mungkin tidak terbaru" badge. Coach role taps on 3 attendance marks in roster → queued in IndexedDB pending_writes = 3 rows. Back online → 3 C-20 sent; banner cleared.
2. IndexedDB cache persisted GetPerson row: open DevTools Application → IndexedDB → cache_store → object → `dobRaw` key absent; `contact.email` absent.
3. Offline attempt: tap P1 Revoke (ineligile) → disabled + tooltip "Sambungkan kembali untuk mencabut persetujuan.".
4. Conflict scenario: Coach A offline check-in present player X; Coach B online marks absent → A reconnects → LWW A (later timestamp) wins; Audit trail contains `CONFLICT_RESOLVED` entry with both values, winner=A.

### Risks
- R-23-01. Query persister IndexedDB write quota exceed → unhandled rejection → blank app. Mitigation: try/catch around persister.write; on QuotaExceededError → drop half of LRU entries silently; do not crash UI.
- R-23-02. Service Worker stale cache of critical JS causes broken build after deploy. Mitigation: `skipWaiting()` on activate; SW version hash changed every build; user banner "Versi baru tersedia — Muat ulang" toast with reload action.

### Anti-patterns
- AP-23-01. SW `runtimeCaching` of `/identity/*` responses → caches live PII in SW storage outside persister-strip filter. Forbidden.
- AP-23-02. C-07 Revoke added to eligible list for "better UX". Regressive. Consent revocation = authoritative; cannot defer effect.
- AP-23-03. Dead letter queue rows silently archived after 7 days. Violates Constitution Art. 11 (No-Silent-Failure).

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| Rural/broad-device offline support | PRG-VIS-001 §5 Target stakeholders | rural + low-end device |
| Offline-reconcilable DisplayCode | IDN-PRD-001 NFR-08 | PART 9 NFR-08 |
| Idempotency prevents double-apply on replay | PART 10 §10.3 Mutation idempotency keys | shared infra |
| SW caches only static assets (never API data) | PART 14 §Constraints | tailwind/css/font/assets only |
| Structural absence of sensitive fields in storage | Constitution Art. 9 + STK-INV-001 | privacy-by-architecture |

---

## PART 24 — Build Strategy

### Purpose
Define the build pipeline, environment configuration, secret handling, and feature-flag system. The build must be deterministic: same commit + same environment = byte-identical output. The frontend never reads secrets at runtime; build-time injection only (if any env-conditional).

### Scope
4 domains: Environment (dev/test/staging/prod), Configuration (Vite + TanStack Start nitro), Secrets, Feature Flags.

### Inputs
- ADR-0001 TanStack Start + Vite + Nitro/Lovable stack.
- PART 14 §14.1 build budgets + chunk config.
- PART 22 Security CI gates.
- IDN-FE-001 stack declaration: Vite.

### Outputs
- `vite.config.ts` rules.
- 4 environment files (`.env.development`, `.env.test`, `.env.staging`, `.env.production`), each with public `VITE_PUBLIC_*` prefix only.
- Feature flag SDK rules.
- CI pipeline stage breakdown (lint → typecheck → test → build → audit → artefact upload).

### Dependencies
- PART 14 Performance (budgets, chunk manualChunks, analyze).
- PART 26 Quality Gates (G5 = CI green; gates within the build pipeline).

### Architecture Decision

#### 24.1 Environment Matrix
4 environments; each maps to a Lovable Cloud project/instance:

| Env | Branch | Lovable Instance | URL Pattern | Purpose |
|---|---|---|---|---|
| development | local dev machine | local | localhost:3000 | Developer localhost, MSW mockable, HMR on. |
| test | PR branches (feature/*) | test-instance-idn | `<pr-num>.preview.lovable.app` | Runs PART 20 full test suite; seeded synthetic data TST_ refs. |
| staging | main (after merge) | staging-idn | `staging-idn.lovable.app` | UAT by Guardian/SSB pilot users; seeded pilot data subset; mirrors production config; last stop before PROD. |
| production | release tags (vX.Y.Z) | prod-idn | `footballid-nation.id` (example) | Live, real data, RLS strict, audit enabled. |

Environment variables:
- `VITE_PUBLIC_APP_ENV` = `dev | test | staging | prod` (injected at build, exposed via `import.meta.env.VITE_PUBLIC_APP_ENV` — available client-side, non-sensitive).
- `VITE_PUBLIC_APP_VERSION` = `git describe --tags --always` (commit hash + tag — shows in About page and error screens).
- All other env vars must NOT have VITE_PUBLIC_ prefix if they contain URLs, keys, or secrets. Non-VITE vars are server-only (read by server functions, never sent to browser).

Public-only list of VITE_PUBLIC_ vars (complete — no new public vars without adding here):
```
VITE_PUBLIC_APP_ENV
VITE_PUBLIC_APP_VERSION
VITE_PUBLIC_APP_NAME="Football ID Nation"
VITE_PUBLIC_I18N_DEFAULT_LOCALE="id"
VITE_PUBLIC_SUPPORT_EMAIL="support@football-id.nation"  (contact-only; not secret)
```

#### 24.2 Configuration (vite.config.ts)
Wrapper around `@lovable.dev/vite-tanstack-config`. Mandatory configuration items:
```
- server.entry = "server" (ADR-0001).
- TanStack Start SSR streaming = true (PART 13 §13.5).
- build.sourcemap = "hidden" (PART 14 §14.1).
- build.target = "es2022" (drops IE11/legacy-Edge).
- build.rollupOptions.output.manualChunks = PART 14 vendor chunk map (react, router, query, forms, ui, charts, date).
- PWA plugin @vitejs/plugin-pwa:
    registerType: 'promptUpdate'  (user-confirm reload; no auto-replace mid-session)
    workbox: { globPatterns for static; no runtimeCaching of /identity/* }
    manifest PWA: name, short_name, theme_color (--theme-accent-primary), icons 192/512, display: standalone, orientation: portrait-primary, start_url: "/", scope: "/", lang: "id".
- Plugins in order:
    1. @lovable/dev/vite-tanstack-config base.
    2. @tailwindcss/vite (Tailwind v4, styles.css @theme inline parsed).
    3. @vitejs/plugin-pwa.
    4. Bundle size gate (rollup-plugin-visualizer; build fails if any route chunk > 45KB).
```

#### 24.3 Secrets
Frontend (browser code) MUST NOT have access to any secret. All secrets are server-side:
- Lovable Cloud Auth private keys,
- Storage signed-URL signing keys,
- Audit database writer credentials,
- Outbound SMTP / SMS credentials (if any).

Secrets handled:
1. Local developer: `.env.local` (gitignored) — never committed.
2. CI (GitHub Actions / Lovable): secrets stored in repository Secrets, injected as environment variables during build + runtime.
3. Server functions access via `process.env.SECRET_NAME` only.
4. Hardcode grep: CI scans `src/` for strings matching `sk-`, `pk_`, `BEGIN PRIVATE KEY`, `AKIA`, long base64 strings > 40 chars. Match → fail build.

#### 24.4 Feature Flags
Purpose: Decouple deploy from release. Ship incomplete UI behind a flag; enable for pilot users only. **Flags are NOT a substitution for proper user-role authz (PART 09). Flags only control progressive rollout of approved features.**

Provider: Simple in-house flag store backed by Q-10 GetPolicies response `policy_flags` field (server-issued per session; per-person overrides exist for pilot). NOT LaunchDarkly/third-party — flag evaluation is server-authoritative; client never evaluates flags locally.

Contract:
```
// SessionContextShape (PART 08 loader) exposes:
featureFlags: {
  'ui.activity-v2': boolean,
  'ui.dark-mode-default': boolean,
  'ux.mobile-swipe-nav': boolean,
  'pilot.guardian-multi-child': boolean,
}
```
Flag lifecycle: create → 5% rollout → 25% → 50% → 100% → REMOVE flag code (no permanent flag debt; 60-day SLA from 100% to code removal). If flag is older than 90 days → CI warning; older than 120 days → CI fail.

Rules:
1. NO flag that "bypasses a PART 09 guard" — e.g., `skip_age_gate_u13_p5=true` → structural prohibition cannot be toggled (STK-INV-004). Flags can only show/hide approved UI for users already eligible by role/consent/age.
2. Flags evaluated in Container (L3), never in Presentation (L2). Presentation receives data.
3. All flag names listed in `feature-flags-registry.ts` with owner, rationale, and removal date.

### Rules
1. **Deterministic builds.** Reproducible builds (npm lock file committed; `package-lock.json` version pinned via `npm ci` in CI — never `npm install` with floating semver ranges resolved anew).
2. **`.env.*` files (except `.env.local`) committed to repo.** No `.env` (the ambiguous default). Explicit `.env.development`, `.env.test`, `.env.staging`. No secrets inside committed files.
3. **Never import `process.env` in client-side code (`src/components`, `src/routes` browser code paths).** Only `import.meta.env.VITE_PUBLIC_*`. Server function code may use either (server side).
4. **CI must pass before merge.** Lint, typecheck (tsc --noEmit), unit+integration tests, npm audit (high/critical), visual diff approval, A11y axe core baseline, Lighthouse CI, E2E (on main — PRs run E2E only if route or hooks changed).

### Constraints
- TanStack Start / Lovable: no custom server entry. Cannot swap Nitro for Express. Use TanStack Start middleware hooks if custom headers (CSP, HSTS) needed.
- All response headers:
  ```
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY      (redundant with CSP frame-ancestors; defense-in-depth)
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  ```
  Applied on all non-static responses.
- Feature flag max count: ≤ 15 concurrent flags. Exceeding count → architectural review required.

### Acceptance Criteria
1. `npm run build` (staging): `build-info.json` artefact contains git hash, npm-sha, timestamp. Re-running same commit on same machine = identical build-info hash.
2. Browser DevTools → Sources: no `process.env.*` string present in any bundled JS. Only `import.meta.env.VITE_PUBLIC_*`.
3. CI PR: 1 new env var added with `VITE_PUBLIC_SUPABASE_URL=https://...` — fails hardcode-grep step? No (it's a URL, not a secret). If value is `VITE_PUBLIC_JWT_SECRET="top-secret..."` → detected as long-ish secret-looking string → build fails.
4. Feature flag older than 121 days present in registry → CI fails with "Flag `ux.mobile-swipe-nav` overdue for removal by 1 day. Remove flag logic."

### Risks
- R-24-01. PWA update prompt "New version available" fires mid-journey wizard (user filling Register step 2). Mitigation: PWA prompt only displayed if user idle > 60 seconds and not inside a form. Disabled during wizards.
- R-24-02. Hidden source maps accessible via URL guess on static host. Mitigation: upload source maps separately to error-reporting service only; never deployed to static CDN. `hidden` sourcemap type writes .map files to build output folder that is excluded from static deploy.

### Anti-patterns
- AP-24-01. `if (import.meta.env.VITE_PUBLIC_APP_ENV === 'dev') { // test credentials in bundle }` — leaks dev-only info into production bundle. Use server functions; dev mock via MSW not env branch.
- AP-24-02. "Flag permanent." 180-day-old flag still in code.
- AP-24-03. `process.env` in `components/ui/button.tsx` (client-side code).
- AP-24-04. `.env` at repo root; ambiguous environment; not allowed.

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| TanStack Start + Vite + Lovable stack | ADR-0001 | Stack Deviation |
| Vendor chunk map, budgets, hidden sourcemaps | PART 14 §14.1 build budgets | 45KB route cap |
| CSP, HSTS, Referrer-Policy headers | PART 22 Security | XSS/CSRF/Session defenses |
| Strict-origin-when-cross-origin referrer | STK-INV-001 data minimisation cross-origin | no referrer leak |
| Deterministic builds + npm ci | Engineering Principle 12 (Determinism of Governance) | Constitution Art. 13 |
| Flags never override structural prohibitions | STK-INV-004 Structural Prohibition | invariant |

---

## PART 25 — Deployment Strategy

### Purpose
Define deployment stages (Preview / Staging / Production), rollback mechanism, and migration-compatibility rules for safe releases. The release process must be reversible in < 10 minutes to satisfy Constitution Art. 9 Reversible Principle (Engineering Principle 8).

### Scope
4 stages: Preview, Staging, Production, Rollback. Covers triggers, approval gates, smoke tests post-deploy, and database-schema migration compatibility contract with frontend.

### Inputs
- Constitution Art. 7 (Stage-Gate Discipline).
- Engineering Principle 9 (Least-Change — small, frequent releases > large big-bang).
- IDN-API-001 versioning scheme (URL v1 prefix + schema additive-compatible).
- PART 26 Quality Gates (G5 passes for Release Candidate to Staging; G6 passes for Production; G7 acceptance after production smoke).

### Outputs
- Release process flow.
- Rollback steps with RTO < 10 min.
- Schema additivity rules (no breaking API changes between frontend and backend releases).

### Dependencies
- PART 24 Build (produces artefacts per env).
- Lovable Cloud deployment capabilities (ADR-0001).

### Architecture Decision

#### 25.1 Preview Deployment (per-PR)
Trigger: every push to feature branch (every commit).
Target: Lovable Preview environment `<pr-num>.preview.lovable.app`.
Automatic, no approvals.
Smoke tests after deploy: 5 critical E2E tests (login blank render, register render, consent layout, 404 screen, dark mode) — not full 21 JRN suites.
Lifetime: 14 days after PR merge/close → auto-delete.
If smoke fails → GitHub status check red; author notified; cannot merge before fix.

#### 25.2 Staging Deployment
Trigger: every merge to `main` branch.
Target: `staging-idn.lovable.app` (Lovable staging instance, staging database seeded with pilot data).
Automatic (no manual approval needed for merge → staging auto-deploy).
Smoke tests after deploy:
- Full PART 20 A11y axe scan of 50 screens (staging data may differ slightly, but structural accessibility same).
- Full Playwright E2E suite (21 JRN specs) against synthetic TST_ data set (TST_ prefix refs — test-only rows in staging DB).
- Lighthouse CI on 5 critical screens (performance budgets).
- Health check endpoints: `/healthz` returns `{ ok:true, version: <tag>, db: ok, auth: ok, storage: ok }`.
Duration before promote-to-prod: minimum 24 hours soak time on staging; mandatory UAT sign-off from 2 pilot guardians + 1 pilot SSB admin.

#### 25.3 Production Deployment
Trigger: only from a SemVer tag `vX.Y.Z` on main (after staging soak + sign-off). NEVER deploy arbitrary main commits.
Tagging rules (SemVer 2.0):
- X = MAJOR: breaking change (new PART 05 routes that drop backward compat; API shape break).
- Y = MINOR: new feature, routes added additive (existing routes untouched).
- Z = PATCH: bug fix, accessibility correction, content copy change, performance fix.

Approval flow:
1. Release Manager creates Release Issue in GitHub.
2. Release Issue references: G6-passed build number, staging soak duration, UAT sign-off names, rollback plan link, change-log (auto-generated from conventional commits since last tag).
3. 2 approvals required: (a) Frontend Architecture Council sign-off, (b) Product Owner sign-off.
4. After 2 approvals → workflow dispatches production deploy.

Post-deploy smoke (Production):
- Same 5 critical E2E as Preview; plus full PART 26 G7 checklist automated checks.
- Smoke runs against production with a dedicated smoke-test session account (role: PLATFORM_SUPPORT) — never touches real user data.
- Error rate monitoring: if error rate > 0.5% in first 5 min → automatic rollback (see §25.4).

#### 25.4 Rollback
Goal: RTO (Recovery Time Objective) < 10 minutes from detect of bug.
Mechanism:
1. Previous production build artefact is retained in Lovable Cloud release archive (last 10 production tags retained).
2. "Redeploy Previous Tag" GitHub workflow — 1 click. No DB rollback required if rule below is followed.
3. After rollback, invalidate CDN cache for static assets. If Service Worker cached old SW-version: `skipWaiting` forced on next client reload cycle.

Schema-Additivity Contract (enables zero-downtime, rollback-safe releases):
```
FRONTEND CODE N, SERVER CODE N are compatible.
FRONTEND CODE N, SERVER CODE N-1 MUST be compatible. (Roll forward: server deploy first then frontend.)
FRONTEND CODE N-1, SERVER CODE N MUST be compatible. (Roll backward: frontend deploy first then server OR server rollback.)
```
Practical rules for additivity:
1. New field in API response → OPTIONAL; frontend N tolerates absence of field (fallback to undefined → default). Backend N-1 does not send it; frontend N handles.
2. Removed field → DEPRECATE first, keep for 2 MINOR versions, then remove. Frontend first stops using; backend later stops emitting.
3. Route removal: first return 410 GONE (not 404) for 1 minor version → monitor if clients still calling. Only after 0 traffic for 7 days → actually delete route code.
4. New Zod form schema field must be optional with default. Server N-1 tolerates it missing in request.

Violation of additivity = rollback risk block.

### Rules
1. **EVERY production deployment MUST be reversible in < 10 minutes.** If the change requires a data migration that cannot be rolled back forward-compatibly → split into a multi-phase release (Phase 1 add column nullable + dual-write; Phase 2 read from new; Phase 3 drop old).
2. **No Friday deployments.** No deployments < 2 hours before national holiday, large scheduled football event (registrations spike on transfer-window open/close day), or outside 09:00–16:00 Jakarta working window unless emergency hotfix with explicit Council emergency approval.
3. **Conventional Commits enforced** on main (semantic PR titles: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `a11y:`, `perf:`, `sec:`). Changelog auto-generated.

### Constraints
- Lovable Cloud deploys = atomic (no in-between traffic). Blue/green is the default within Lovable — if not available, enforce N/N-1 compatibility (always).
- No manual FTP, no manual DB edit. Every change via migration + deploy workflow.
- Emergency hotfix: cherry-pick from main → hotfix branch `hotfix/vX.Y.Z+1` → preview → staging smoke → deploy production with 1 emergency approval (not 2; Council one approval sufficient).

### Acceptance Criteria
1. `v1.2.3` → production bug found 1 minute after deploy → rollback workflow triggered → `v1.2.2` live in 6 minutes (under 10-minute RTO).
2. Staging server upgraded to add new `preferredLocale` field in Q-01 GetPerson response. Frontend N-1 still renders correctly (field not present → no crash). Forward compatibility verified.
3. Release `v2.0.0` MAJOR produced only after a 30-day deprecation window of old routes; every removed route in v2 returns 410 during v1 last MINOR release.

### Risks
- R-25-01. Emergency hotfix rushed; bypasses staging soak → regression. Mitigation: hotfix still requires Preview smoke E2E pass; cannot skip automated gates.
- R-25-02. SW update + rollback double-reload causes confusion. Mitigation: rollback workflow triggers SW update notification on all clients with "Pembaruan dibatalkan. Muat ulang untuk kembali ke versi stabil." copy.

### Anti-patterns
- AP-25-01. `git push origin main:deploy` manual deployment outside workflow.
- AP-25-02. Breaking API change in MINOR version (violates SemVer + additivity).
- AP-25-03. Friday 17:00 deploy → nobody to triage weekend.
- AP-25-04. "Migration cannot be rolled back. Just proceed." (Violates Engineering Principle 8 Reversible.)

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| Stage-Gate G5/G6/G7 mapped to envs | Constitution Art. 7 Stage-Gate Discipline | Art. 7 → PART 26 |
| Reversible in < 10 minutes | Engineering Principle 8 (Reversible) | principle 8 |
| SemVer tags vX.Y.Z triggers production only | release governance convention | PR workflow rules |
| Additivity N/N-1 compat | IDN-API-001 versioning contract + Constitution Art. 12 Versioning | PART 2 versioning |
| Least-change small frequent releases | Engineering Principle 9 Least-Change | principle 9 |

---

## PART 26 — Quality Gates

### Purpose
Define the concrete G5, G6, G7 quality gates plus the Acceptance Checklist. The 50-screen Identity frontend does NOT advance past a gate unless every check in that gate is explicitly passed with evidence.

### Scope
- G5: Code-quality & functional gate (CI — before merge to main).
- G6: Architecture-conformance & readiness gate (before staging → production promotion).
- G7: User-acceptance & production-smoke gate (before release is declared "complete").
- Universal acceptance checklist (cross-gate; always on).

### Inputs
- `docs/quality-gates.md` (UPSTREAM QUALITY GATES: G0–G7 universal definitions).
- Constitution Art. 7 (Stage-Gate Discipline) + Art. 0 (Child's Interest resolved-stated explicitly at every gate).
- PART 20 Testing Strategy (thresholds become check-list rows).
- PART 15 Accessibility (WCAG AA = gate blocking).
- PRG-VIS-001 §North Star Metric VAP verification trace (G7: pilot users reach VAP state in product).

### Outputs
Concrete checklists with evidence, owner, and pass/fail for G5, G6, G7, and Universal Acceptance.

### Dependencies
- PART 24 Build (G5 runs inside CI).
- PART 25 Deployment (G5 = PR gate; G6 pre-prod; G7 post-prod).
- Artefact Registry (docs/artefact-registry.md): every gate APPROVED → row updated in registry.

### Architecture Decision

#### 26.1 Universal Gate (Applied at G5 / G6 / G7 — every gate)
The 4 non-negotiable Universal checks from `docs/quality-gates.md` Part 2. If any FAIL → entire gate FAIL, cannot proceed, no override except a formal Constitution Amendment.

| Check ID | Criterion | Owner | Evidence | Pass Requirement |
|---|---|---|---|---|
| U-01 | **The Child's Interest Prevails is resolved & explicitly stated.** A written paragraph stating "For GX of IDN-FE-001 Identity Frontend, we have verified the following Child's Interest considerations: (a) U13 structural absence of scouting paths — verified per PART 09 traceability tests; (b) Consent P1 high-risk revocations are effect-immediate per CONSENT-001 §10 — covered by E2E JRN-09; (c) DOB raw is not stored client-side per PART 22 §22.5; (d) No silent failures (Constitution Art. 11) — PART 12 boundary tested." | Frontend Architecture Council | Gate summary document section 1. | Explicit paragraph present; no open child-safety tickets. |
| U-02 | **No separate role account per role context. One Person → one session → Football ID header constant across role switch.** | QA Lead | PART 08 §08.5 flow + E2E JRN-01→JRN-12 multi-role test. | Single Football ID display value unchanged across Player/Guardian/Coach role switcher in identity strip. |
| U-03 | **Traceability complete.** Every check in this gate links to an artefact clause. No "because we said so" checks. | Frontend Architecture Council | This document PART 26 — every row has a Source column. | 0 rows with Source = "N/A" or "Council Decision". |
| U-04 | **Refusal Duty (Art. 14) uncompromised.** AI assistant cannot generate code outside this blueprint → ESLint boundaries + token lint + structural route absence tests enforce. | Engineering Lead | Build output + PART 19 §Rules import-graph scan. | 0 graph violations; 0 structural routes for U13×scout. |

#### 26.2 G5 — Code Quality & Functional Gate (CI — per PR, before merge to main)
**Purpose: "The code is safe, correct, and adheres to this blueprint."**

| Check ID | Criterion | Threshold | Owner | Evidence Source |
|---|---|---|---|---|
| G5-01 | Lint | `eslint --max-warnings 0` — 0 warnings. Include boundaries, security, jsx-a11y strict. | Dev | CI artefact eslint-report.json |
| G5-02 | TypeScript Strict | `tsc --noEmit` 0 errors. `strict:true`, `noUncheckedIndexedAccess:true`, `exactOptionalPropertyTypes:true` all on. | Dev | CI tsc output |
| G5-03 | Unit Tests | Statements ≥ 80%; Branches ≥ 70%; Functions ≥ 85%; Lines ≥ 80%; 0 tests skipped without justification link. | Dev | Vitest coverage/coverage-summary.json |
| G5-04 | Integration Tests (Containers) | L3 Container branch coverage ≥ 70%; all structural-absence tests pass (PART 20 §Rule2). | Dev | Vitest coverage; grep for structural absence test IDs |
| G5-05 | Visual Regression | Chromatic diffs reviewed & approved by design owner; 0 unapproved >2px diffs on critical screens. | Design | Chromatic approval link |
| G5-06 | Security Dependencies | `npm audit --production` → 0 HIGH, 0 CRITICAL. `npm audit dev` → 0 CRITICAL. | DevOps | CI npm-audit.json |
| G5-07 | Accessibility Baseline (axe-core) | 0 WCAG 2.1 AA critical violations on changed screens; < 1% non-critical AA on full suite. | QA | axe-core-report.json |
| G5-08 | Token Literal Scan | 0 hex literals in className/style; 0 odd-pixel spacing 10px; 0 non-bucket motion durations. | QA | grep artefact output |
| G5-09 | Import Graph | 0 cross-feature imports; 0 L2→L3/L4/L5 reverse imports. | Architecture | boundaries lint report |
| G5-10 | Build Size | Initial critical < 90KB gzip; any route chunk < 45KB gzip. | DevOps | PART 14 §14.1 budget check (rollup visualizer) |
| G5-11 | No Hardcoded Secrets | Hardcode grep (PART 24 §24.3): 0 matches in src/ or config/. | DevOps | CI security-scan.json |
| Pass gate | All 11 items above PASS + U-01..U-04 PASS | → Merge to main enabled | | |

#### 26.3 G6 — Architecture Conformance & Release Readiness Gate (Pre-Production, on staging, before vX.Y.Z tag)
**Purpose: "The release conforms to the architecture blueprint; it is ready to be promoted to production."**

| Check ID | Criterion | Threshold | Owner | Evidence |
|---|---|---|---|---|
| G6-01 | Full A11y Scan of all 50 screens | axe-core on every screen in IDN-SCR-001 catalogue. 0 AA violations (any class critical/minor). | QA Lead | full-axe-report.json with 50 entries; each PASS |
| G6-02 | E2E 21 JRN suites | 21/21 passing; < 1% flake rate (reruns). JRN-09 high-risk revoke passes including VAP-status transition. | QA Lead | Playwright report + video traces |
| G6-03 | Performance Lighthouse (mobile) | 5 critical screens each: Performance ≥ 90; A11y ≥ 95; CLS < 0.05; INP < 200ms; LCP < 2.5s. | DevOps | lighthouse-ci-report.json |
| G6-04 | Observability in Staging | Audit endpoint receives C-06/C-07 events from E2E run; error log captures injected boundary error; analytics P7-gate test (revoke P7 → 0 analytics network calls after). | Architecture Council | Staging audit log query screenshot |
| G6-05 | Offline Scenario Playback | E2E offline: Coach A offline check-in 3; online C-20 drain sync; LWW conflict resolved; dead-letter banner on ineligible attempt. | QA Lead | Playwright offline test spec PASS |
| G6-06 | Theme Contrast Validation | Light + Dark theme: 8 colour pairs (body, danger-on-canvas, accent-primary-on-surface) all meet 4.5:1 (body text). Build step auto-check. | Design Lead | contrast-report.csv (auto) |
| G6-07 | Changelog + Release Notes Complete | Conventional-commit auto-changelog reviewed; known-issues section lists any open ≥ medium bugs with ETA; architecture deviations signed off (0 deviations allowed unless approved ADR present). | Product Owner | CHANGELOG.md + GitHub Release Draft |
| G6-08 | Rollback Plan Written | Rollback to previous N-1 validated on staging. Staging ← last prod tag rollback workflow runs; smoke tests PASS on downgrade. | DevOps + QA | Rollback runbook document + staging rollback test run ID |
| G6-09 | Feature Flag Debt Check | No flag > 90 days old. Max concurrent flags ≤ 15. | Architecture | feature-flags-registry.ts audit |
| G6-10 | 24h Staging Soak + Pilot UAT Sign-off | 24 hours staging production-like (synthetic load 2× peak expected); 2 guardian pilot + 1 SSB admin pilot sign-off that VAP flow works end-to-end (register→verify→consent→FID issued→roster shows player). | Product + Pilot Users | UAT forms (signed PDF attachments to release) |
| Pass gate | All 10 items above PASS + Universal U-01..U-04 PASS | → Council approves promotion; Product Owner tag vX.Y.Z | | |

#### 26.4 G7 — User Acceptance & Production-Smoke Gate (After production deploy, before release is declared formally complete)
**Purpose: "Release works in production for real users; VAP metric path verified live."**

| Check ID | Criterion | Threshold | Owner | Evidence |
|---|---|---|---|---|
| G7-01 | Production Smoke E2E (limited) | 5/5 critical flows (login→dashboard, consent-toggles render, register wizard start, 404, theme switch) with dedicated smoke session (PLATFORM_SUPPORT). | QA Lead | Playwright production-smoke suite |
| G7-02 | Error Rate Monitoring (5 min window) | 5xx error rate < 0.5%; no CSP violations; no SESSION_REVOKED spikes. | DevOps | Observability dash screenshot |
| G7-03 | VAP Pilot End-to-End | 2 real pilot users (not synthetic) reach VAP state (Football ID + Guardian Verified + Active Activity) within app; audit trail records VAP-achieved event; CTI ≥ 90% floor for those pilots. | Product Owner | Pilot VAP dashboard screenshot |
| G7-04 | Lighthouse Production (mobile) | 5 critical performance thresholds maintained on production (not staging) — no regression vs staging Lighthouse. | DevOps | lighthouse-prod-report.json |
| G7-05 | Accessibility Production Smoke | SCR-GRD-04 + SCR-PUB-03 (top 2 flows) axe-core on production URL: 0 AA violations. | QA Lead | A11y smoke report |
| G7-06 | Rollback Armed & Ready | Rollback workflow button present; RTO < 10 min verified by "mock rollback click" dry run that confirms previous artefact exists. | DevOps | Dry-run workflow success |
| G7-07 | Pilot Satisfaction Survey | 2 guardian pilot + 1 SSB pilot: "I trust this system with my child's/my player's data." Likert score ≥ 4/5 each; qualitative feedback collected; top 3 concerns triaged. | Product Owner | Survey results tabulated |
| G7-08 | Security Smoke | Attempt POST C-07 forged request cross-site → 403 audit log present; CSP report-uri receives test injection attempt logged. | Security | Audit log of test attacks |
| Pass gate | 8/8 PASS + Universal U-01..U-04 PASS → Release status = COMPLETE in Artefact Registry; IDN-IMP-001 Identity Implementation status advances; release announced internally. | Architecture Council formal sign-off. | | |

### Rules
1. **Universal Gate U-01 is a showstopper.** If U-01 (Child's Interest) is judged FAIL by a single Council member → no override; go back to fix.
2. Every G5/G6/G7 check result recorded as PASSED / FAILED / WAIVED in the Artefact Registry row. WAIVED requires: a written ADR-style waiver with Council vote, risk-assessment, and expiry date (waived checks cannot stay permanent; max 30 days).
3. No "Pass with minor comments" aggregate gate. Every check row is binary Pass / Fail. If 1 check fails → gate fails.

### Constraints
- G6 → G7 minimum 24 hours. No same-day release without 24h staging soak.
- G7 mandatory survey feedback: top 3 concerns are logged as prioritized tickets in backlog for next MINOR release (within 30 days).

### Acceptance Criteria
1. G6 gate review meeting: 10 + 4 Universal items. 10 PASSED, 1 FAILED (G6-05 Offline conflict LWW test broken). Council votes FAIL G6; cannot tag production.
2. G7 VAP pilot 2/2 reach VAP; 1 CTI drops to 88% (below 90% floor per PRG-VIS-001 §North Star Metric halt-semantics). → G7 fails due to CTI.
3. G5-09 Import graph 1 cross-feature import found (Guardian→Organization); merge blocked until refactored to features/shared sink per PART 19.

### Risks
- R-26-01. Council sign-off becomes bottleneck (people unavailable → release slipped). Mitigation: written delegation authority per Council role (one delegate per Council seat).
- R-26-02. UAT sign-off is a rubber stamp. Mitigation: pilot UAT feedback includes a negative-item prompt "list one thing broken or confusing"; blank negative response = UAT sign-off rejected as invalid.

### Anti-patterns
- AP-26-01. "We waive G6-02 E2E this one time due to timeline pressure." (Waive must have ADR-style expiry and vote; cannot waive E2E on a consent-flow release ever.)
- AP-26-02. U-01 paragraph is generic "We take child safety seriously." (Not acceptable. Must cite 4 concrete evidence-links per the 4 sub-criteria.)
- AP-26-03. G7 declared PASS after 1 minute smoke without the 5-min error rate window.

### Traceability
| Decision | Source Artefact | Clause |
|---|---|---|
| G0–G7 universal structure | docs/quality-gates.md (UPSTREAM) Part 1 & 2 | PART 1 table + PART 2 U-01..U-04 |
| VAP metric CTI ≥ 90% floor at G7 | PRG-VIS-001 §9 CTI KPI halt semantics | CTI floor |
| 21 JRN E2E at G6 | IDN-JRN-001 PART 1 (21 journeys) | each = 1 spec |
| WCAG AA 100% 50 screens at G6 | PART 15 §15.1 critical gate block | G6-01 |
| Rollback < 10 min reversible | Engineering Principle 8 (Reversible) | PART 25 §25.4 |
| Stage-Gate Discipline | Constitution Art. 7 | gate-by-gate enforcement |

---

## PART 27 — Implementation Checklists

### Purpose
Provide the 4 actionable checklists used at every stage of implementation: Developer (per code change), QA (per test cycle), Accessibility (per screen), Release (per production deploy). These checklists operationalise Parts 01–26 for day-to-day engineering.

### Scope
4 checklists: (1) Developer Checklist per PR; (2) QA Checklist per release cycle; (3) Accessibility Checklist per screen; (4) Release Checklist per production deploy. Each item traces back to a Part/Section/Rule of this blueprint.

### Inputs
- PARTS 01–26 (every rule/constraint/AC herein is a candidate checklist item).
- PART 26 G5/G6/G7 (Developer Checklist = G5 inputs; QA Checklist = G6 inputs; Release Checklist = G7 + PART 25).
- PART 15 §WCAG 2.1 AA (Accessibility Checklist based on critical + AA list).

### Outputs
4 numbered checklists with Trace column referencing specific Part/Section/Rule of this architecture. Each checklist item has: ID, Item, Evidence, Trace, Pass/Fail box.

### Dependencies
- All preceding 26 Parts (this is the "operationalise" summary).
- IDN-SCR-001 50 screen IDs: Accessibility checklist applies to each SCR-xxx screen.

### Architecture Decision

#### 27.1 Developer Checklist (Per Pull Request) — 20 Items
Apply to every PR before requesting review. If any item FAIL → self-fix before assign reviewer.

| ID | Item (Developer self-check) | Evidence | Trace | ✅Pass / ❌Fail |
|---|---|---|---|---|
| D-01 | I did not create any screen, route, or API call not in IDN-SCR-001 + PART 05 routing + IDN-API-001. Zero invention. | PR diff summary + trace comments link to SCR-xxx / C-xx / Q-xx | Parts 05/10 strict rules header | ▢ |
| D-02 | Container (L3) / Presentation (L2) split applied for any new UI. L2 = zero hooks except `useId/useMemo/useCallback`. | New file structure: `XxxContainer.tsx` + `/domain/Xxx.tsx` (Presentation + test + skeleton) | PART 19 §19.1/19.2 | ▢ |
| D-03 | Import graph review: no cross-feature imports; no reverse imports L2→L3+; Foundation (shadcn) only imports from L1/external. | `npx eslint src/ --rule 'boundaries/*:error'` output 0 errors | PART 19 §19.5 Rule1 | ▢ |
| D-04 | For any C-xx mutation call: hook carries idempotency key; `retry:0`; permissionKey in meta if applicable. | Hook source grep for idempotencyKey/retry/permissionKey | PART 10 §10.3/10.7 | ▢ |
| D-05 | Any new form: Zod schema exported to `@/lib/forms/schemas/`; server imports it; submit follows RHF flow (PART 11 §11.2); no uncontrolled inputs. | Schema file location + server-function schema import line | PART 11 §11.1/11.2 | ▢ |
| D-06 | Wizard steps use URL search param step=; draft sessionStorage keyed formId + session fingerprint; TTL 1h. | URL on step navigation; sessionStorage in DevTools | PART 11 §11.3/11.5 | ▢ |
| D-07 | Structural absence (U13 × P5/P8) enforced at Container by removing items from list — NOT by disabled=true in Presentation. | Container items[] filter removes purpose rows; unit test asserts absence of row DOM | PART 09 §09.5 + PART 19 Rule 2 in containers | ▢ |
| D-08 | No literal hex #abcdef colours, no odd-px (10px) spacings, no non-150/200/300ms motion values in classNames/styles. | Grep src/ for forbidden patterns; 0 matches | PART 18 §18.5 Rules + Constraints | ▢ |
| D-09 | All interactive elements have accessible labels; icon-only buttons have aria-label via i18n key (not literal string); headings h1→h6 no skips. | JSX review for aria-* props on `<Button><Icon/></Button>` | PART 15 §15.2/15.3 | ▢ |
| D-10 | No dangerous patterns: `dangerouslySetInnerHTML` (0 except GuardianAnnotation if reviewed), `eval`, `innerHTML`, inline `javascript:` hrefs, `localStorage.setItem` of any person PII. | ESLint security + grep results | PART 22 §22.1/22.4 | ▢ |
| D-11 | Unit test added for new L2 Presentation; Integration test added for new L3 Container with at least: loading→data→error branches + structural absence test (if applicable). | `__tests__/` file present; coverage delta > 0 | PART 20 §20.1 thresholds | ▢ |
| D-12 | New screen added: skeleton matches layout shape (CLS ≈ 0); responsive 375 renders 1-column; no horizontal scroll @375. | DevTools 375 emulator screenshot + skeleton overlay | PART 13 §13.1 + PART 16 Constraints | ▢ |
| D-13 | If analytics event added: event fire wrapped in P7 consent gate from PART 21 §21.2; no event after P7 revoke. | Playwright/E2E test added | PART 21 §21.2 Rule 4 | ▢ |
| D-14 | Offline behaviour: ineligible mutations disabled when `navigator.onLine === false`; eligible C-20/C-05 only queued to IndexedDB. | Hook uses `useIsOnline()` from PART 12 §12.4 | PART 23 §23.2 eligibility list | ▢ |
| D-15 | Error boundary / toast behaviour: mutation errors surface as specified in PART 12 §12.3/12.5; 403 screen shares template with 404. | Manual test: inject PERMISSION_DENIED envelope → visual 404/403 diff = 0 pixels | PART 12 §12.5 visual identity | ▢ |
| D-16 | Typed variant props (not generic `className?: string`) on any new L2 components. | Component Props interface review | PART 19 §19.5 Rule 3 | ▢ |
| D-17 | Any new env var added is VITE_PUBLIC_ only for truly non-sensitive; no secrets in src/ accessible paths. | .env files diff + CI scan | PART 24 §24.1/24.3 | ▢ |
| D-18 | New route follows PART 05 tree conventions; dynamic route param uses `$playerRef` opaque ref, not display code. | File path + param usage grep | ADR-0002 + PART 05 dynamic routes | ▢ |
| D-19 | i18n copy in Bahasa Indonesia; no hardcoded English UI copy; copy for consent toggles from single CONSENT-001 i18n source (not reworded). | i18n dictionary key grep vs ui labels | PART 15 §15.3 Bahasa default + CONSENT-001 §12 | ▢ |
| D-20 | Self-review: I have attached traceability comments to every new function/class/component/route file: 1-line header "Implements PART 05 §4.3 / SCR-GRD-01 card 3." — not standalone but trace is readable. | Files touched in PR each contain 1-sentence docstring header | IDN-FE-001 constitution-wide TRACEABILITY rule | ▢ |

#### 27.2 QA Checklist (Per Release Cycle — before G6 sign-off) — 18 Items
Applied by QA Lead on staging before G6. This overlaps G6 checks; provides the granular step QA executes.

| ID | QA Step | Evidence | Trace | ✅Pass / ❌Fail |
|---|---|---|---|---|
| Q-01 | 50 screens × 4 breakpoints (375/768/1024/1440) smoke walked; screenshot set saved per screen per breakpoint. No horizontal scroll. | 200 screenshots attached to QA Report. | PART 16 breakpoints + constraints | ▢ |
| Q-02 | 7 Sidebar areas rendered + bottom-nav @375: role-context switcher works without Football ID change; breadcrumb correct; deep-link to child page works. | Video recording role-switch + copy Football ID before/after | PART 06 Nav + Universal U-02 | ▢ |
| Q-03 | 11yo child data set: Consent view has 6 (not 8) rows (P5/P8 absent); attempt URL-hack `/consent?forcePurpose=p5` → row absent from DOM; cannot click. | Playwright test video + DOM inspection | STK-INV-004 (Part 09 §09.5) | ▢ |
| Q-04 | 21 JRN flows executed manually in staging; each DEC-decision from JRN catalogue recorded; audit log traceId entries cross-checked to server audit table. | JRN test matrix spreadsheet with 21 traceId links | PART 20 §20.4 E2E scripts + JRN-001 DEC codes | ▢ |
| Q-05 | JRN-09 High-risk revoke: confirm typed-text YA SAYA SETUJU + audit checkbox required; after submit VAP badge turns INACTIVE within 3 seconds; aria-live assertive region announces; toast effect-immediate copy. | Video + DevTools aria-live output | CONSENT-001 §10 + PART 11 §11.6 | ▢ |
| Q-06 | Consent toggles independent; no "Accept All" button visible anywhere; P8 toggle row ABSENT for L1 guardian (not disabled). | Visual walkthrough | CONSENT-001 §12 rules | ▢ |
| Q-07 | Offline scenario: Browser offline → dashboard renders from cache with badge; 3 attendance check-ins → queued count = 3; online → banner syncing → toast "3 perubahan tersinkron" after success. | Playwright offline test spec result video | PART 23 §23.4 | ▢ |
| Q-08 | 404 vs 403 visual identity: 2 screenshots side-by-side. Pixel diff (excluding URL bar) < 1%. Non-existent ref → 404 visual. Existing ref no permission → same visual. | Image diff tool output % | PART 12 §12.5 | ▢ |
| Q-09 | Coach views roster: JSON network response Q-02 rows have `contact = null`; DOM shows "Kontak: —" (not phone). | DevTools Network + rendered row screenshot | PART 09 §09.6 data class visibility + RLS server | ▢ |
| Q-10 | Guardian switches 3 children (0.8 ratio default). Child-switcher is top-level UI element; consent/verification routes correctly update $playerRef in URL. | Video of 3-child household flow | PRG-VIS-001 §10.2 0.80 ratio design | ▢ |
| Q-11 | Session stale → automatic refresh; hard 401 → redirects to /errors/401. DevTools shows exactly 1 refresh call per 401. | Network filter SESSION_STALE calls count | PART 08 §08.2 refresh max 1 attempt | ▢ |
| Q-12 | MFA step-up on PLATFORM_SUPER_ADMIN accessing /federation on staging account with MFA enforced → redirects to /mfa-challenge; after success → redirects back to intended $return URL. | Screenshot flow | PART 08 Constraints MFA_REQUIRED | ▢ |
| Q-13 | Break-glass session banner: PLATFORM_SUPPORT accesses minor record → banner "Break-glass session in progress — access logged" persistent; log audit entry present. | Banner screenshot + audit row link | PART 09 §Rules 4 + PART 21 §21.4 #3 | ▢ |
| Q-14 | Light/Dark theme switch: no FOUC on hard refresh; both themes axe-core 0 AA contrast violations at end. | Video + axe report per theme | PART 17 §17.4 + PART 18 §Contrast Validation | ▢ |
| Q-15 | PWA install prompt available on Chrome Android; installed as standalone app → offline dashboard OK (reuse Q-07). | Lighthouse PWA installability check | PART 14/PART 23 PWA capability | ▢ |
| Q-16 | File upload verification evidence: 15MB file rejected client-side; EXE renamed to PDF rejected server (magic-byte); JPEG < 10MB succeeds. | Network + error messages | PART 11 Constraints file upload | ▢ |
| Q-17 | Merge identity C-19 flow: confirmation string = random 4-word (not static YA SAYA SETUJU); user must type exactly before submit enabled. | Screenshot of random phrase | PART 11 §11.6 typed-text confirmation rules | ▢ |
| Q-18 | Accessibility (full checklist Q-A per 50 screens) run; Q-A Passes per screen recorded in QA report. 0 critical AA fails across all 50. | Q-A checklist items output (see §27.3) | PART 15 WCAG 2.1 AA baseline | ▢ |

#### 27.3 Accessibility Checklist (Per Screen — apply once per SCR-xxx screen) — 18 Items
QA A11y specialist runs this against EVERY SCR-PUB-01..SCR-SYS-06 screen. Output per screen: Pass/Fail + screenshots.

| ID | Criterion | How to test | WCAG Ref / Trace | ✅Pass / ❌Fail |
|---|---|---|---|---|
| A-01 | `<h1>` present; heading order h1→h2→h3 logical; no h1→h3 skips. | axe-core + DOM outline | 1.3.1 Info & Relationships, 2.4.6 Headings | ▢ |
| A-02 | Lang `<html lang="id">` set; any English copy wrapped `<span lang="en">` if present. | Inspect DOM | 3.1.1 Language of Page | ▢ |
| A-03 | All `<img>` have alt; decorative images alt="" (empty); avatar alt generic "Foto profil" not person name PII. | axe-core + review alt text | 1.1.1 Non-text Content, STK-INV-001 | ▢ |
| A-04 | Form fields: every `<input>` has associated `<label>`; error messages linked to field via `aria-describedby`; `aria-invalid=true` on error; focus moves to first error on submit. | Keyboard submit + DOM review | 3.3.1 Error Identification, 3.3.2 Labels | ▢ |
| A-05 | Keyboard-only: Tab/Shift-Tab visits every interactive in reading order; no keyboard trap; Esc closes modals/drawers; Enter/Space activates buttons/toggles. | Manual keyboard walkthrough | 2.1.1 Keyboard, 2.1.2 No Keyboard Trap | ▢ |
| A-06 | Skip-link: Tab once on page → "Lewati ke konten utama" visible focused; activate → focus moves to `<main id=main-content>`. | Manual | 2.4.1 Bypass Blocks | ▢ |
| A-07 | Focus indicator visible always on interactive; never `outline:none`; focus ring 2px+ with offset. | Manual visual | 2.4.7 Focus Visible, PART 15 Constraints | ▢ |
| A-08 | Colour only never conveys meaning. Danger red + AlertTriangle icon + text. Success green + "Tersimpan" text. | Screenshot inspection | 1.4.1 Use of Color | ▢ |
| A-09 | Normal text contrast ≥ 4.5:1; large text ≥ 3:1; UI components (focus ring, input borders, icons) ≥ 3:1. Light + Dark themes both. | axe-core + DevTools colour picker | 1.4.3 Contrast Minimum, 1.4.11 Non-text Contrast | ▢ |
| A-10 | Reflow 1280×1024: no horizontal scroll; content still readable when zoomed 200% text only (not page zoom). | Firefox text-only zoom 200% | 1.4.4 Resize Text, 1.4.10 Reflow | ▢ |
| A-11 | Text spacing: line-height 1.5, letter spacing 0.12em, word spacing 0.16em, paragraph space 2× line height — NO content clipping. | Stylus browser plugin | 1.4.12 Text Spacing | ▢ |
| A-12 | Icons-only buttons: explicit aria-label in Bahasa Indonesia via i18n. `<Button aria-label={t('revoke_consent')}><Icon /></Button>`. | axe-core "buttons must have accessible name" | 4.1.2 Name, Role, Value | ▢ |
| A-13 | Dialog/drawer/confirmation: focus trap; focus returned on close to trigger; title + description linked. | Radix default; manual verify | 2.4.3 Focus Order, 4.1.2 | ▢ |
| A-14 | Error prevention on legal/financial/child-risk actions (P1 revoke, Merge, Archive): reversible OR confirm + typed text required. (Matches PART 11 §11.6 high-risk.) | Manual submit flow | 3.3.4 Error Prevention (Legal, Financial, Data) | ▢ |
| A-15 | `prefers-reduced-motion: reduce`: skeleton shimmer off, toast no-slide, chart animation off, dialog CSS transition off (only fade). | Chrome DevTools Emulate CSS media feature reduced-motion | PART 15 §15.6 | ▢ |
| A-16 | Live regions: toast aria-live="polite"; consent revoke announce assertive; form busy aria-busy=true; auto-save polite. | Screen reader (NVDA/TalkBack) manual test | PART 15 §15.3 Live Regions | ▢ |
| A-17 | Table rosters: `<th scope=col>` headers; `<caption>` hidden-sr-only describes table content; arrow key nav inside works (if grid). | axe-core + manual | 1.3.1 Info & Relationships | ▢ |
| A-18 | Consistent navigation: sidebar order across screens same; bottom nav 5 items constant; back button location consistent on all sub-screens. | Screenshots comparison | WCAG 3.2.3 Consistent Navigation (AAA-aspirational-but-applied) | ▢ |

Apply A-01..A-18 to EACH of 50 screens. Report: 50 × 18 = 900 checks total. 0 critical → G6-01 pass.

#### 27.4 Release Checklist (Per Production Deploy — Day-of) — 15 Items
Used by Release Manager for every vX.Y.Z tag deploy. Blocks rollout until all Pre-deploy items Pass; post-deploy items verify success within 10 minutes after deploy.

| Step | ID | Action (Release Manager) | Evidence | Trace | ✅Done / ❌Hold |
|---|---|---|---|---|---|
| Pre-deploy | R-01 | G6 gate result: G6 PASSED, Universal U-01..U-04 ALL Pass. Attach the G6 gate document PDF link to Release. | G6 PDF | PART 26 §26.3 | ▢ |
| Pre-deploy | R-02 | Changelog + Release Notes reviewed; conventional-commits auto-generated; Known-Issues section lists open ≥ medium bugs with ETA. | CHANGELOG.md + GitHub Release Draft | PART 26 G6-07 | ▢ |
| Pre-deploy | R-03 | Rollback plan reviewed: Previous tag vX.Y-1.Z exists in Lovable archive; rollback workflow dry-run "simulate" clicked; confirms artefact available. | Dry run workflow run output | PART 25 §25.4 + G6-08 | ▢ |
| Pre-deploy | R-04 | Database additivity verified: Frontend N + Backend N-1 tested on staging smoke; Frontend N-1 + Backend N smoke also passing. | N-1 compatibility smoke test output links | PART 25 Schema-Additivity | ▢ |
| Pre-deploy | R-05 | Deployment window rule: 09:00–16:00 Jakarta time; NOT a Friday; NOT a holiday; NOT a transfer window open/close day; NOT < 2 hours before close of business. | Calendar check + day-of-week check | PART 25 §Rules 2 | ▢ |
| Pre-deploy | R-06 | Two approvals present in Release Issue: (1) Frontend Architecture Council sign-off, (2) Product Owner sign-off. | Issue comments (two ✅) | PART 25 §25.3 Approval flow | ▢ |
| Pre-deploy | R-07 | Communication sent: Pilot guardians + SSB admins via email → "Maintenance window 10:00–10:20. Brief downtime expected." | Email audit trail | Release comms SOP | ▢ |
| Pre-deploy | R-08 | Health check staging `/healthz` returns ok. | Curl staging output JSON | PART 25 §25.2 | ▢ |
| Deploy | R-09 | Trigger production deploy workflow on tag vX.Y.Z. | Workflow started link | PART 25 §25.3 | ▢ |
| Deploy | R-10 | Wait for workflow success; validate deploy complete timestamp; new `VITE_PUBLIC_APP_VERSION` visible on About footer. | About page screenshot version | PART 24 §24.1 | ▢ |
| Post-deploy (5 min) | R-11 | 5/5 Critical Production Smoke E2E PASS. | Playwright report URL | G7-01 | ▢ |
| Post-deploy (5 min) | R-12 | Error rate < 0.5%; no CSP violations; no SESSION_REVOKED spikes. | Dashboards screenshot | G7-02 + PART 22 §CSP report-uri | ▢ |
| Post-deploy (10 min) | R-13 | Lighthouse prod mobile run: performance ≥ 90 (no regression > 3 pts vs staging). | Lighthouse CI prod output | G7-04 | ▢ |
| Post-deploy (10 min) | R-14 | Security smoke cross-site POST attempt to C-07 → 403 (CSRF + SameSite); audit log entry present. | Curl command result + audit row | G7-08 + PART 22 CSRF/XSS | ▢ |
| Post-deploy (10 min) | R-15 | Communication "Deploy vX.Y.Z successful; summary [top 3 user-facing changes]" sent to pilot group + support team. | Email audit trail | Release comms SOP | ▢ |
| Post-deploy (24h later) | R-16 | G7 acceptance meeting held; all G7 items signed off; Artefact Registry updated: IDN-IMP-001 row = APPROVED (or APPROVED-with-waivers). | Registry commit | PART 26 §26.4 | ▢ |

### Rules
1. **No item skipped with "N/A".** If an item is legitimately not applicable (e.g., Offline Q-07 on a pure marketing public screen), annotate with justification "Not applicable: public screen SCR-PUB-01 has no write operations; offline eligibility is a no-op". Still mark Pass; justification required.
2. **Checklists versioned with this blueprint.** If an item changes → v1.1 of IDN-FE-001, and the change is recorded in the Traceability Change-Log section appended below this Part (not in this document; external changelog).
3. Completed checklists stored as release artefacts alongside every vX.Y.Z tag. If regulators request evidence of a release's validation, we produce the completed D/Q/A/R checklists of that tag.

### Constraints
- **Developer checklist D-01 is absolute.** If a PR introduces a new screen not listed in IDN-SCR-001 → review must reject, no discussion. Constitution Article 14 Refusal Duty.
- Accessibility checklist A-09 (contrast) failure on either theme (light or dark) → screen cannot ship.
- Release checklist R-05 (deployment window rule): if emergency hotfix needed outside window → requires Council emergency approval, which must be a written issue reference, not verbal.

### Acceptance Criteria
1. Random PR #1234: Checklist D-03 shows 3 cross-feature imports → Developer self-check fails #D-03; PR fixed before review assigned. Self-discipline enforced by checklists not by reviewer.
2. QA on SCR-GRD-04 screen Q-A-09 colour contrast on dark theme detects `text-fg-primary` on `bg-accent-success` only 3.8:1 (below 4.5). QA blocks G6-01; Design Council re-tunes `--theme-fg-on-accent` in dark tokens to oklch darker value.
3. v1.3.0 release candidate scheduled on Friday 17:15 Jakarta. Release checklist R-05=FAIL. Deploy shifted Monday morning.

### Risks
- R-27-01. Checklist fatigue: teams tick boxes without verification. Mitigation: QA spot-checks 20% of Developer checklist items by actually running eslint/coverage on every PR; dishonesty = review process escalation.
- R-27-02. 50 screens × 18 a11y checks = 900 QA items per release; unworkable without tooling assistance. Mitigation: axe-core playwright CI scans auto-mark A-01, A-03, A-09 per screen; QA only manually tests the interactive items (A-05, A-06, A-13, A-14, A-16). Automated 12/18; manual 6/18 × 50 = 300 manual checks → feasible per release cycle.

### Anti-patterns
- AP-27-01. Developer checks all 20 D-xx Pass → PR opened. ESLint on CI actually shows 4 warnings. (Checklist not a "fill-out ritual"; actual lint runs output must match D-01.)
- AP-27-02. QA passes Q-03 U13×P5 absence because "the button is disabled". Disabled fails structural rule. Must be absent from DOM.
- AP-27-03. Release proceeds with R-06 only one approval (Council only, missing Product Owner). Missing approver = hold.

### Traceability
| Decision (Checklist purpose) | Source Artefact | Clause |
|---|---|---|
| D-xx Developer checklist = G5 operationalization | PART 26 §26.2 G5 | per-PR CI gates |
| Q-xx QA checklist = G6 operationalization | PART 26 §26.3 G6 | staging release readiness |
| A-xx Accessibility checklist = WCAG 2.1 AA operationalization | PART 15 §15.1 critical + AA list | each screen |
| R-xx Release checklist = G7 + PART 25 operationalization | PART 26 §26.4 G7 + PART 25 §25.3/§25.4 | deploy + rollback steps |
| D-01 zero-invention strict rule | IDN-FE-001 STRICT RULES header | no screens/routes/API/permissions invented |
| Constitution Art. 14 Refusal Duty on D-01 fail | Constitution Art. 14 | Refusal Duty |

---

> **Closing Constitutional Statement.**
>
> This document IDN-FE-001 v1.0 (G6 DRAFT) is the Single Source of Truth for the Identity Bounded Context Frontend Implementation.
>
> Every line of TanStack Start / React / TypeScript code produced hereafter must trace to a paragraph of this blueprint. Any AI Coding Assistant (Lovable, Cursor, Claude Code, GitHub Copilot, Codex, Gemini, Windsurf, Continue, Cline, Bolt, v0) that cannot produce a trace from its proposed code change to a specific section of this document **MUST REFUSE** that code change under Constitution Article 14 (Refusal Duty).
>
> Architecture First. Implementation Second. Code Last.
>
> — Enterprise Frontend Architecture Council
>
> Bounded Context: Identity · Stage: 6 · Gate: G6 DRAFT · Date 2026-08-07
