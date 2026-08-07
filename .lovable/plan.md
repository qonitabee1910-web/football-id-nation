# IDN-SCR-001 Screen Catalogue + Stage 5 UX Prototype

Stage 5 (UX Architecture) · Bounded Context: Identity · Gate G5/G7

Two things are requested at once: the governed screen contract, and a visible UI.
The lifecycle allows both only in this order — contract first, then a
presentation-only prototype bound to it. No database, no API, no server function,
no business rule is created. Mock fixtures only.

## Part A — IDN-SCR-001 Enterprise Screen Catalogue

New artefact `docs/contexts/identity/08-screen-catalogue.md`, 18 parts exactly as
specified: executive summary, navigation architecture, screen catalogue grouped by
area, per-screen definition, layout structure, component composition, interaction
summary, data dependency, authorization matrix, privacy & child protection,
accessibility, responsive behaviour, navigation flow, screen states, error &
recovery, analytics mapping, acceptance criteria, traceability matrix.

Coverage rules enforced against the locked artefacts:

- Every one of the 21 journeys (JRN-01..21) maps to at least one screen.
- Every one of the 22 commands (C-01..C-22) is invoked from at least one screen.
- Every one of the 12 queries (Q-01..Q-12) backs at least one screen.
- No orphan screen, no screen without a business goal.
- Under-13 scouting surfaces are structurally absent (STK-INV-004), not disabled.
- Journey screens are read-only projections (EDEC-01 — Journey never a producer).

Screen areas: PUBLIC, PLAYER, GUARDIAN, ORGANIZATION, ASSOCIATION, FEDERATION,
SYSTEM — approximately 45 screens, each with `SCR-<AREA>-nn` IDs.

## Part B — IDN-UIC-001 UI Component Catalogue (condensed)

`docs/contexts/identity/09-ui-component-catalogue.md`: the component vocabulary
referenced by the catalogue (Table, Timeline, QR Card, Wizard, Status Banner,
Consent Toggle, Masked Field, Empty State, …), each with purpose, states,
accessibility contract, and the screens that use it. No code in this document.

## Part C — Stage 5 UX Prototype (visible UI)

A navigable, non-functional prototype that renders the catalogue. Explicitly
labelled as a UX prototype, and it does not create backend capability.

- Design system tokens in `src/styles.css` — Indonesian football identity
  direction (deep pitch green + gold accent, no default purple/Inter look),
  light + dark, WCAG 2.2 AA contrast.
- App shell in `src/routes/__root.tsx`: role-switchable sidebar navigation
  (Player / Guardian / Organization / Association / Federation), header, single
  `<main>` landmark, Bahasa Indonesia primary.
- Routes mirroring the catalogue's navigation architecture:
  - `/` landing (replaces the placeholder index), `/masuk`, `/daftar`, `/lupa-sandi`
  - `/pemain/*` — dashboard, profil, football identity, journey timeline,
    membership, aktivitas, consent, verifikasi, notifikasi, pengaturan
  - `/wali/*` — dashboard, anak terhubung, consent, verifikasi
  - `/klub/*` — dashboard, direktori pemain, membership, aktivitas, antrean verifikasi
  - `/asosiasi/*` — dashboard, football ID, verifikasi, transfer, monitoring kebijakan
  - `/federasi/*` — dashboard, direktori nasional, kebijakan, analitik, audit, pencarian
  - system screens: akses ditolak, sesi berakhir, pemeliharaan, error
- All data comes from typed fixtures in `src/lib/fixtures/` shaped exactly like the
  Q-01..Q-12 query contracts, so a later Stage 6 swaps fixtures for real reads
  without changing screens.
- Every screen renders its documented states (loading / empty / error variants
  shown where meaningful) and masks child-sensitive fields per CONSENT-001.
- Each route gets its own `head()` metadata.

## Technical notes

- TanStack Start file routing, shadcn/ui, Tailwind v4 tokens (ADR-0001).
- Read-only prototype: no Lovable Cloud enablement, no tables, no server
  functions, no auth. Login screens are visual only.
- Registry and context README updated: IDN-SCR-001 and IDN-UIC-001 IN_REVIEW,
  IDN-IMP-001 remains BLOCKED until G5 is recorded PASSED.

## Open point for the Council

Part C is presentation-only and therefore does not breach the "no production
code" rule, but it does precede a recorded G5 PASS. It is delivered as a
reviewable prototype, not as Stage 6 implementation.
