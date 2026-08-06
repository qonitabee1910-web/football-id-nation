# Bounded Context Artefact Skeleton

Copy this folder to `docs/contexts/<context-name>/` when a context is activated.
Every file must carry the traceability front-matter defined in
[../../lifecycle.md](../../lifecycle.md#traceability).

Required files, in production order:

| File | Stage | Gate |
| --- | --- | --- |
| `01-prd.md` | 1 | G1 |
| `02-journeys.md` | 1 | G1 |
| `03-domain-model.md` | 2 | G2 |
| `04-domain-events.md` | 2 | G2 |
| `05-erd.md` | 3 | G3 |
| `06-rls-design.md` | 3 | G3 |
| `07-api-contract.yaml` | 4 | G4 |
| `08-ui-contract.md` | 5 | G5 |
| `09-acceptance-criteria.md` | 5 | G5 |
| `10-implementation-checklist.md` | 6 | G6 |

A context is not "started" until `01-prd.md` exists in `DRAFT`.
A context is not implementable until files 01–09 are `APPROVED` in the
[artefact registry](../../artefact-registry.md).
