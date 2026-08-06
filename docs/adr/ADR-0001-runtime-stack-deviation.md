---
id: ADR-0001
title: Runtime stack deviation — TanStack Start + Lovable Cloud
status: ACCEPTED
date: 2026-08-06
deciders: [Chief Enterprise Architect, Principal Frontend Architect, Principal Backend Architect, Principal DevOps Architect]
context_scope: [programme]
stage: 0
supersedes: []
---

# ADR-0001 — Runtime stack deviation: TanStack Start + Lovable Cloud

## Context

The Master Prompt specifies Next.js 15 on Vercel with Supabase. The delivery
environment for this repository is fixed: **TanStack Start v1 (React 19,
Vite 7, TypeScript, Tailwind v4, shadcn/ui, TanStack Query)** with **Lovable
Cloud** (managed PostgreSQL, authentication, storage, server functions) as the
backend. Next.js, React Router, and alternative frameworks cannot be installed
here. The constitution's substantive requirements — API-first, contract-first,
server-side authorization, RLS, event readiness — are framework-agnostic.

## Decision

Adopt TanStack Start + Lovable Cloud as the reference implementation runtime.
Retain every other stack element: React, TypeScript, Tailwind, shadcn/ui,
TanStack Query, PostgreSQL, Storage, Realtime, React Native (Expo) for mobile,
GitHub Actions for CI.

Server-side capability is implemented with **TanStack server functions** for
app-internal logic and **server routes under `/api/public/*`** for external
callers (federation integrations, webhooks, scheduled jobs). Supabase Edge
Functions are not used.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| A. Next.js 15 as written | Matches prompt literally | Not installable in this environment; blocks all delivery |
| B. TanStack Start + Lovable Cloud | Ships today; same DB, auth, storage, RLS guarantees; API-first preserved | Deviates from the written stack; team must learn file-based TanStack routing |
| C. Split: spec here, build elsewhere | Literal compliance | Two sources of truth; traceability breaks |

## Decision-rule evaluation

| Rule | A | B | Winner |
| --- | --- | --- | --- |
| 1. Nationally scalable | equal | equal (edge-deployed) | tie |
| 2. Federation-integrable | equal | equal (`/api/public/*` HTTP contracts) | tie |
| 3. Safe for child data | equal | equal (PostgreSQL RLS in both) | tie |
| 4. Auditable | equal | equal | tie |
| 5. Football ID as single source of truth | unaffected | unaffected | tie |
| Deliverability (tie-break) | blocked | ships | **B** |

## Consequences

- Repository structure adapts: the monorepo layout in the Master Prompt maps to
  `src/routes` (web), `src/lib/*.functions.ts` (API layer), `docs/`, and a
  future `mobile/` Expo workspace. The intent — separated packages per bounded
  context — is preserved through module boundaries under `src/contexts/<name>/`.
- The OpenAPI contract remains the authority; TanStack server functions and
  `/api/public/*` routes are generated to match it, not the reverse.
- Event-driven readiness is achieved with a transactional outbox table plus
  PostgreSQL triggers, not Edge Functions.
- Mobile (Expo) consumes the same `/api/public/*` and authenticated HTTP
  contracts — no framework coupling.

## Compliance impact

No impact on TOGAF/ArchiMate/ISO 42010 conformance; this is a technology-layer
decision only. Application and business layers are unchanged.

## North Star impact

Neutral on measurement, strongly positive on time-to-first Verified Active
Player by unblocking delivery.
