# Review — Sprint 2, Governance, Accessibility, EPOS

**Stage 6 (under review) · Bounded Context: Identity — Public Experience · Prerequisites: IDN-SCR-001 / IDN-DS-001 / IDN-UIC-001 (all still IN_REVIEW) · Artefacts produced: review findings + remediation plan · Quality Gate: G5 not passed, G6 entry contested**

Four review streams completed. Headline: the code is in good shape technically, but it was built ahead of its own gate, and the registry no longer matches disk.

---

## 1. Governance — the blocking issue

- `docs/artefact-registry.md` marks `IDN-IMP-001 | Implementation | Stage 6 | BLOCKED | G6`, yet `src/routes/{index,login,register,forgot-password,legal}.tsx` and `src/features/public/**` are fully built (~2,310 lines).
- The artefacts that implementation depends on — `08-screen-catalogue.md` (IDN-SCR-001), `09-design-system.md` (IDN-DS-001), `10-components-contract.md` (IDN-UIC-001), `11-screen-specifications-all.md` — are all `IN_REVIEW`, not `APPROVED`. Lifecycle stage-entry rule is therefore breached.
- `11-screen-specifications-all.md` carries its own id `IDN-SCR-DETAILS-001` but has **no row at all** in the registry.
- `docs/contexts/identity/README.md` "Produced so far" stops at artefact 08 and still describes IDN-DS-001 / IDN-UIC-001 as future work.
- Gate label mismatch: registry and 08/09/10/11 front-matter cite **G7**, but `docs/lifecycle.md` only defines **G0–G6**.
- Scope drift in code: `register.tsx` + `auth.schemas.ts` offer `ORGANIZATION` and `ASSOCIATION` **self-registration** with an `organizationName` field. C-01 in `07-api-contract.md` authorises an Organization/Association *Officer* registering a Person — there is no approved command for self-service creation of an Organization or Association. No `CreateOrganization` exists in C-01..C-22.
- `legal.tsx` implements SCR-PUB-06, outside the SCR-PUB-01..04 sprint scope (it is in the approved catalogue and is honestly self-labelled a placeholder, but it is still extra scope).
- Route trace blocks record `screen` and `journey` but never `adrs`, so code→ADR traceability is implicit only.

## 2. Accessibility (WCAG 2.1 AA)

**Critical**
- `src/routes/__root.tsx:84-87` — viewport meta sets `user-scalable=no`, blocking pinch-zoom. Fails SC 1.4.4.

**Warning**
- `ThemeToggle` `size="sm"` renders 32×32 (`ThemeToggle.tsx:32`), used as the only theme control on every public and auth page (`PublicLayout.tsx:140`, `AuthLayout.tsx:76`). Below the 44px target the rest of the codebase honours.
- `min-h-screen` used everywhere instead of `min-h-dvh` (`__root.tsx:141,155`; `AuthLayout.tsx:50`; `PublicLayout.tsx:39`). Zero `dvh` usages in the project.
- `CardTitle` renders a `<div>`, so the auth card title is not a heading. No duplicate `h1` (good), but the card heading is invisible to heading navigation.

**Passing** — no hardcoded colour utilities anywhere; one `<main>` per route with working skip links; single `h1` per page; correct heading order; `role="alert"` + `aria-describedby` + `aria-invalid` on all form errors; live regions on async state; every icon-only button labelled; every decorative icon `aria-hidden`.

## 3. Public screens — code and SEO

- Internal navigation uses raw `<a href>` instead of TanStack `<Link>`, causing full page reloads and losing prefetch: `PublicLayout.tsx:111-128` and `176-197`, `AuthLayout.tsx:126-131`. Other files already do this correctly.
- `legal.tsx:19-31` sets `robots: "index, follow"` on a page whose body says the content awaits Council approval — thin-content SEO risk.
- Two independently hand-rolled arbitrary-value gradients (`AuthLayout.tsx:51`, `PublicPrimitives.tsx:120-123`) instead of one shared token utility.
- Public header reuses the brand `Shield` icon for the unrelated command-palette trigger (`PublicLayout.tsx:99-101` vs `132-139`).
- `head()` metadata is otherwise complete and correct on all five leaf routes; `__root.tsx` correctly carries no canonical and no `og:image`.

## 4. EPOS prompt library

`core/` is complete and coherent. The rest under-delivers against its own stated 1.0.0 exit criteria (`ROADMAP.md:37` claims 26 templates / 18 validators / 14 assistants):

- Actual: 15 templates, 12 validators, 13 adapters.
- Missing whole trees referenced by README: `docs/`, `assets/`, `examples/`.
- Missing `validation/quality-gate/G0-G7.md` — the gate runner README and CONTRIBUTING both instruct users to run. The Constitution's central gate mechanism has no enforcement artefact.
- Missing `templates/ui/`, `templates/testing/`, `templates/devops/`.
- Missing validators: migration, testing, specification, traceability, constitution-compliance.
- Missing `adapters/replit/` although README and Constitution list Replit AI.
- Broken path in the Constitution itself: `CONSTITUTION.md:37,173` and `adapters/lovable/ADAPTER.md:25` link `core/principles/PRINCIPLES.md`; the file is at `core/constitution/PRINCIPLES.md`.
- No stub files — everything present is fully written.

---

## Proposed remediation

**Step A — Governance reconciliation (docs only, no code).**
1. Add the missing `IDN-SCR-DETAILS-001` row to `docs/artefact-registry.md`.
2. Update `docs/contexts/identity/README.md` "Produced so far" to include artefacts 09, 10, 11.
3. Resolve the G7 label: either add G7 to `docs/lifecycle.md` or correct the four front-matters to G6.
4. Record the reality that Sprint 2 code exists ahead of G5 — either an explicit Council waiver entry ("prototype, presentation-only, no business logic") or downgrade the registry status to reflect it. This needs your decision; the plan does not fabricate an approval.

**Step B — Scope correction on Register.** Remove `ORGANIZATION` / `ASSOCIATION` from `REGISTRATION_ROLES` and drop the `organizationName` field, leaving PLAYER and GUARDIAN which C-01 supports. Alternative if you prefer keeping them: raise a contract amendment for a `CreateOrganization` command first. Awaiting your choice.

**Step C — Accessibility fixes.**
1. Remove `user-scalable=no` and `maximum-scale` from the root viewport meta.
2. Give `ThemeToggle` `sm` a 44px hit area (`min-h-11 min-w-11`, icon stays visually small).
3. Swap `min-h-screen` → `min-h-dvh` in the four shell locations.
4. Render the auth card title as a real heading element.

**Step D — Routing and SEO fixes.** Replace the eight `<a href>` internal links in `PublicLayout.tsx` / `AuthLayout.tsx` with `<Link to>`; set `legal.tsx` robots to `noindex, follow` until final copy lands; give the command-palette trigger a distinct icon.

**Step E — EPOS gap closure (optional, larger).** Fix the broken `PRINCIPLES.md` path (3 occurrences), then either build the missing trees or amend README/ROADMAP/CHANGELOG so the stated 1.0.0 criteria match what actually ships. Recommend amending the docs now and deferring the missing artefacts to 1.1.0.

Steps A–D are small and safe. Step E is a separate work package.
