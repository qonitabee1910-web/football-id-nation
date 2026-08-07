---
id: EPOS-ADAPTER-LOVABLE-001
version: 1.0.0
status: ACCEPTED
depends_on: [EPOS-CORE-CON-001]
---

# Lovable Adapter

## Purpose

Translate the EPOS Constitution and core rules into the prompt format, memory
model, and iteration style that Lovable actually honours: chat-driven,
whole-app generation, on the Lovable Cloud backend, with knowledge files as
persistent context and no local shell exposed to the end user.

## Scope

All Lovable projects (web apps, Lovable Cloud backed) built or maintained under
EPOS governance. Excludes any non-Lovable tool; see sibling adapters.

## Inputs

- `core/constitution/CONSTITUTION.md` (Articles 0-14)
- `core/principles/PRINCIPLES.md`, `core/workflow/WORKFLOW.md`
- Project Knowledge Base entries (Lovable's persistent project memory)
- The current chat thread and attached files/images

## Outputs

- Lovable Project Knowledge content (`AGENTS.md` equivalent, pasted into
  Lovable's "Knowledge" panel) enforcing EPOS rules on every generation
- Chat responses that cite the article/rule authorising or blocking a change

## Dependencies

- `core/constitution/CONSTITUTION.md`
- `core/workflow/WORKFLOW.md`
- `core/quality-gates/QUALITY-GATES.md`

## Rules

### Context Window Strategy

Lovable holds a single evolving chat thread plus a fixed Knowledge panel; there
is no file-tree @-mention like an IDE. Put constitution-derived rules in
Knowledge (loaded on every message) — never restate them mid-chat, since
mid-chat instructions decay after several turns of unrelated edits. Keep
Knowledge under ~2,000 words; Lovable truncates or de-prioritises older
knowledge blocks when the project grows, so only the BOOTSTRAP.md content and
links to specs belong there, not full specs.

### Prompt Style

Lovable responds best to outcome-first, single-intent messages ("Add a
password-reset flow using Lovable Cloud auth") rather than multi-step compound
asks. Because Lovable regenerates whole files/components per request, every
message must restate constraints that are easy to regress (e.g., "keep the
existing pricing page layout unchanged" — Article 10, Least Change). State the
gate the work belongs to when known ("this is G6 implementation for
IDN-API-001").

### Iteration Strategy

Lovable iterates by chat turn, each turn producing a diff-like regeneration of
affected files with an in-chat preview and live app reload. There is no plan
mode: request an explicit "describe your plan before generating" turn for
non-trivial work (Article 1/2) to force a specification checkpoint. Use
"Revert" (Lovable's built-in checkpoint restore) as the rollback mechanism
instead of manual git commands, since users have no local shell.

### Memory Strategy

Two memory tiers only: (1) Knowledge panel — durable, project-wide, must carry
the EPOS bootstrap and links to canonical specs/ADRs; (2) chat history — volatile,
subject to summarisation once the thread is long. Never rely on chat history to
carry a governance rule; anything that must always apply belongs in Knowledge.

### File Strategy

Lovable owns the whole repository through its own generation engine and syncs
to GitHub; there is no local shell for the user, so file edits happen only
through Lovable's UI or its GitHub sync. Keep EPOS artefacts (ADRs, contracts)
in the synced repo under `docs/` or `enterprise-prompt-library/` so Lovable's
generation can read them via GitHub-synced context, and reference their paths
explicitly in chat since Lovable does not auto-index arbitrary repo files the
way an IDE agent does.

### Validation Strategy

Lovable Cloud provides build-time and runtime error surfacing in-chat
(the "Try to fix" loop); treat every such error as a No-Silent-Failure
(Article 11) event — do not accept a "fixed" response that hides the error
behind a fallback UI. Run the EPOS `validation/` prompts manually against the
Lovable-generated code by pasting relevant files back if Lovable's own
self-repair loop is insufficient.

### Review Strategy

Every generation is reviewed in the Lovable visual preview plus a manual read
of the GitHub diff after sync (Lovable does not present a native diff view for
all changes). Require a human review of server-side authorization code
(Article 8) before merging, since Lovable Cloud functions/policies are
security-critical and generation quality varies.

## Constraints

- Never paste an entire spec or the full Constitution into a single chat
  message; link and summarise instead (context budget).
- Do not ask Lovable to run shell commands — it has none exposed to the user.
- Knowledge panel content must never contradict `CONSTITUTION.md`; if it does,
  Knowledge is defective and must be corrected, not the Constitution.

## Success Criteria

- Every new Lovable project has the BOOTSTRAP.md content in its Knowledge panel
  before first generation.
- Generated code enforces server-side authorization (Article 8) via Lovable
  Cloud policies/functions, never client-only checks.
- Chat responses cite the blocking article/gate when refusing work.

## Failure Conditions

- A Lovable project with no Knowledge-panel governance content.
- Client-side-only role gating in generated components.
- Repeated "fix" loops that hide errors instead of surfacing them.

## Examples

**Conformant**

> User: "Delete the user's account on button click."
> Lovable: "Blocked (Article 8/G4): no server-side authorization command exists
> for account deletion. I will add a Lovable Cloud edge function with
> server-side checks, then wire the button to it."

## Anti-patterns

- Restating Constitution articles with softened wording inside Knowledge.
- Relying on chat memory alone for a rule that must always apply.
- Accepting a "works now" fix that swallows a runtime error.

## References

- `core/constitution/CONSTITUTION.md`
- `adapters/README.md`
- `adapters/lovable/BOOTSTRAP.md`
