# Sprint 2 Public Surface — UI/UX Polish

Stage 5 (UX Architecture) · Bounded Context: Identity, public surface only · Quality Gate G5. No new screens, no backend, no business logic.

## Scope

Only the four approved public screens plus their shared shell:

- `/` Landing (SCR-PUB-01)
- `/login` (SCR-PUB-02)
- `/register` (SCR-PUB-03)
- `/forgot-password` (SCR-PUB-04)
- `/legal` placeholder, `PublicLayout`, `AuthLayout`

Every screen keeps documented empty / "backend pending" states. No sample records, no fabricated statistics, no new fields beyond IDN-SCR-001 and IDN-API-001.

## What gets improved

**1. Visual direction (IDN-DS-001 tokens only)**
- Tighten the landing hierarchy: hero, value proposition, capability cards, statistics placeholders, partners placeholder, FAQ, closing CTA — consistent vertical rhythm and section spacing scale.
- Replace ad-hoc spacing and one-off styling with the shared section/container primitives already in `PublicPrimitives.tsx`.
- Statistics and partner blocks render as explicit "Data belum tersedia" placeholders with an explanatory line, never zeros or invented numbers.

**2. Responsive behaviour**
- Verify and correct all declared breakpoints (375 / 768 / 1024 / 1440 / 1920) for the four screens.
- Landing hero and card grids reflow from single column to multi-column without overflow; register stepper stays usable at 375px.

**3. Accessibility (WCAG 2.1 AA)**
- Remaining `min-h-screen` in shared shells (`AppShell`, `EmptyLayout`, `ProtectedLayout`, `AreaSidebar`, `GlobalErrorBoundary`) moved to `min-h-dvh` for consistency with the already-fixed public layouts.
- Audit every interactive control on the public surface for a 44px hit area and a visible focus ring.
- Confirm one `<main>` per page, one `<h1>`, ordered heading levels, and accessible names on all icon-only buttons.
- Form errors: in-context, specific, announced via `aria-live`, never colour-only — pair each error with an icon and text.
- Register stepper announces step changes and current position to screen readers.

**4. Motion**
- Any entrance or hover motion added is gated behind the existing `prefers-reduced-motion` block in `src/styles.css`; no motion is required to understand state.

**5. Copy**
- Remove placeholder/lorem wording from user-facing public flows; keep Indonesian copy consistent in tone and terminology with the glossary.

**6. SEO / head metadata**
- Unique `title`, `description`, `og:title`, `og:description` per public route; `/legal` stays `noindex, follow`.

## Technical notes

- Presentation layer only: `src/routes/{index,login,register,forgot-password,legal}.tsx`, `src/features/public/**`, `src/features/shared/layouts/{PublicLayout,AuthLayout}.tsx`, shared shells for the `dvh` change, plus token additions in `src/styles.css`.
- No changes to `usePublicAuth.ts` behaviour — submissions continue to surface the documented "backend pending" state.
- No changes to `auth.schemas.ts` role set or validation rules.
- No new dependencies.

## Verification

- Typecheck clean; all five public routes return 200.
- Playwright pass over the four screens at 375 / 768 / 1440 capturing screenshots, plus a keyboard-only traversal of login and the three register steps.
- No console errors on any public route.

## Out of scope

Player, Guardian, Organization, Association and Federation areas; any dashboard; any data fetching; any auth implementation. Those remain blocked until Sprint 3.
