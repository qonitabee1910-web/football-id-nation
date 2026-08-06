# Mandatory Feature Output Format

Every feature request is answered with this exact 14-section sequence. Code is
produced only after all sections are approved.

Preamble (execution mode) — always first:

```text
Stage:              <0-6>
Bounded Context:    <context>
Prerequisite:       <artefact IDs and their status>
Artefacts produced: <artefact IDs>
Quality Gate:       <G0-G6>
```

Then:

1. **Objective**
2. **Business Problem**
3. **Stakeholders**
4. **Business Rules**
5. **Domain Model**
6. **Entities & Value Objects**
7. **Aggregate**
8. **Domain Events**
9. **API Contract**
10. **Database Impact**
11. **UI Impact**
12. **Security & RLS Impact**
13. **Acceptance Criteria**
14. **Implementation Checklist**

## Section rules

- **4** — rules are numbered, testable, and phrased as invariants.
- **5–8** — DDD terms only; events past tense with payload and publisher.
- **9** — OpenAPI fragment: path, method, request DTO, response DTO, errors, authz.
- **10** — tables, columns, indexes, GRANTs, RLS policies, migration order.
- **12** — who can read/write each field; explicit statement for minors' data.
- **13** — Given/When/Then, each mapped to a business rule number.
- **14** — ordered tasks, each traced to an artefact ID.

If any prerequisite is missing, replace sections 1–14 with the refusal in
[../lifecycle.md](../lifecycle.md#refusal-protocol) plus the gap list.
