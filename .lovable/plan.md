# IDN-SCR-001 — Enterprise Screen Catalogue (Identity)

Stage 5 · Bounded Context: Identity · Gate G7 · Document-only artefact

Deliverable: one new file, `docs/contexts/identity/08-screen-catalogue.md`,
plus status updates in the registry and the context README. No React, TanStack,
CSS, HTML, wireframe, mockup, database, API, or business rule is produced.

## Structure — 18 parts exactly as specified

1. Executive Summary — purpose, scope, bounded context, position in the artefact chain
2. Navigation Architecture — public, authenticated, role-based, dashboard, context navigation, deep-link rules, breadcrumb strategy
3. Screen Catalogue — grouped by area (PUBLIC, PLAYER, GUARDIAN, ORGANIZATION, ASSOCIATION, FEDERATION, SYSTEM)
4. Screen Definition — per screen: ID, name, business goal, primary/supporting actors, entry/exit conditions, primary journey, related commands, related queries, produced events, related policies, related ADR, traceability
5. Screen Layout Structure — header, navigation, sidebar, toolbar, main content, detail panel, action panel, footer (structural only, no visual design)
6. Component Composition — referenced component names per screen
7. Interaction Summary — primary/secondary actions, confirmation, cancellation, recovery, read-only areas
8. Data Dependency — required queries, commands, projections, reference data
9. Authorization Matrix — Actor → visible screens → allowed actions (no RBAC implementation)
10. Privacy & Child Protection — personal/child data exposure, consent requirement, masking, visibility
11. Accessibility Requirements — keyboard, screen reader, focus order, contrast, responsive
12. Responsive Behaviour — mobile, tablet, desktop, large display
13. Navigation Flow — Screen → Journey → Destination, narrative form
14. Screen State Catalogue — initial, loading, empty, success, error, offline, forbidden, archived
15. Error & Recovery — validation, authorization, network failure, retry, recovery flow
16. Analytics Mapping — screen contribution to VAP, NDI, JCS, CTI
17. Acceptance Criteria — coverage checks
18. Traceability Matrix — Vision → … → API Contract → Screen → future component → future page

## Screen set (approx. 48 screens, IDs `SCR-<AREA>-nn`)

- PUBLIC: Landing, Login, Register, Forgot Password, Football ID Lookup (authenticated-gated entry), Public Legal/Consent Information
- PLAYER: Dashboard, Profile, Football Identity, Journey Timeline, Membership, Activities, Consent, Verification, Notifications, Settings, Identity Recovery
- GUARDIAN: Dashboard, Linked Players, Guardian Link Request, Consent Management, Verification, Guardian Annotation, Notifications
- ORGANIZATION: Dashboard, Player Directory, Membership, Membership Request/Transfer Initiation, Activity Management, Verification Queue
- ASSOCIATION: Dashboard, Football ID Administration, Verification Adjudication, Membership Transfer Review, Duplicate/Merge Resolution, Policy Monitoring
- FEDERATION: Dashboard, National Directory, Policy Administration, Analytics, Audit, Search, Event Ledger, High-Risk Revocation Review (Child Protection Officer)
- SYSTEM: Error, Access Denied, Maintenance, Session Expired, Offline, Archived Record

## Coverage rules enforced while writing

- Every journey JRN-01..JRN-21 maps to at least one screen; coverage table included.
- Every command C-01..C-22 is invoked from at least one screen; coverage table included.
- Every query Q-01..Q-12 backs at least one screen; coverage table included.
- Journey screens are read-only projections — no screen produces `JourneyUpdated` (EDEC-01).
- Under-13 scouting has no screen at all (STK-INV-004, structural absence, not a disabled control).
- Guardian annotation screens attach, never mutate (STK-INV-003).
- Screens surface only what the capability requires (STK-INV-001) and separate consent authority from evidence authority (STK-INV-002).
- Every conflict-bearing screen states the Rule 0 resolution (The Child's Interest Prevails).
- Open policy values OQ-02 and OQ-05 are carried as policy references, never restated as screen rules.

## Registry updates

- `docs/artefact-registry.md`: add IDN-SCR-001 — Stage 5 — IN_REVIEW — G7.
- `docs/contexts/identity/README.md`: list the artefact and name IDN-UIC-001 as the next artefact; IDN-IMP-001 stays BLOCKED.
