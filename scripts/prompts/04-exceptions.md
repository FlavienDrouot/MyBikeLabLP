# Phase 4 — exception routing

Read `00-shared-contract.md`, the discovery index, all single-family evidence, normalization outputs, and the canonical schema. Route every unresolved, blocked, stale, conflicting, or validation-failing item. Do not silently repair evidence, infer a classification, allocate an ID, drop an observation, or reduce the exception count by inventing a value.

## Required exception coverage

Create an exception whenever any of these occurs:

- classification uncertainty between `variant`, `option`, `cosmetic`, `offer`, and `unknown`;
- missing browser verification, including an unverified selector state, missing post-selection URL, inaccessible dynamic offer, or browser failure;
- conflicting source facts, stale or unavailable source evidence, or contradictory profile/observation values;
- an invalid, ambiguous, missing, or cross-file fact reference, duplicate fact ID, duplicate observation ID, or broken stable/profile dereference;
- incomplete evidence, missing material comparison facts, missing provenance, unsupported currency, incomplete observation coverage, or allocation-block exhaustion;
- schema, type, canonical enum, identity, scope, grouping, or fact-accounting validation failure.

Acquisition classifications are never treated as decisions. A retry may collect evidence, but only normalization may classify an axis. If the new evidence still cannot support a decision, keep the classification `unknown`, do not group the observation, and do not allocate an ID.

## Routing tiers

- **Tier 1 — deterministic repair:** repair a schema, type, unit, or canonical-key issue only when an explicit source fact and `wheel-format.json` make the result deterministic. Preserve the raw value and provenance.
- **Tier 2 — targeted browser retry:** retry the exact selector, dynamic state, pagination, modal, PDF, region/currency, or post-selection URL check. Record the attempted action, browser result, selected state, URL, timestamp, and new fact references. A failed or unavailable browser check remains blocking.
- **Tier 3 — model review:** review identity, scope, grouping, classification, conflicts, stale evidence, ambiguous units, and incomplete profiles using cited evidence. The proposal must cite fully qualified fact references and preserve every affected observation. It does not authorize ID allocation by itself.
- **Human gate:** require a decision for fabricated or contradictory facts, missing primary evidence for a material comparison field, unknown product scope, unresolved classification, invalid provenance, or any requested frontend schema change. The frontend schema remains unchanged in this workflow.

## Output

Write `exceptions.json`:

```json
{
  "schema_version": "mybikelab.exceptions.v2",
  "generated_at": "2026-01-01T00:00:00Z",
  "exceptions": [{
    "exception_id": "ex-0001",
    "evidence_id": "scope-artech-6",
    "canonical_id": null,
    "observation_refs": ["scope-artech-6#obs-0001"],
    "fact_refs": ["scope-artech-6#stable-0007"],
    "field": "axis_classification.bearing",
    "type": "classification|browser_verification|conflict|invalid_reference|incomplete_evidence|stale|validation|scope|identity|blocked",
    "severity": "low|medium|high|blocking",
    "tier": "deterministic|browser_retry|model_review|human_gate",
    "attempted_resolution": "",
    "required_action": "",
    "status": "open|resolved|accepted_unresolved",
    "resolution_refs": [],
    "evidence_refs": []
  }],
  "summary": {"open": 0, "blocking": 0, "accepted_unresolved": 0, "observation_count": 0, "canonical_variant_count": 0}
}
```

`fact_refs` must use `evidence_id#fact_id` and resolve to captured facts. `observation_refs` must use `evidence_id#observation_id` and resolve to preserved raw observations. Do not copy raw values, source URLs, timestamps, selected values, or fact lists into an exception; provenance is recovered through the referenced evidence observation and its `source_id`. `evidence_refs` and `resolution_refs` must point to declared facts, observations, profiles, normalization mappings, classification decisions, or accounting records. A resolved exception points to the evidence and normalization/accounting change that resolved it. An `accepted_unresolved` exception remains in the final handoff and prevents claiming complete normalization when it affects classification, evidence completeness, browser verification, or validation. Do not use exceptions to introduce temporary batch files, split work into batches, or define a batching strategy.

Validate that every exception has a precise type, severity, tier, status, provenance references, and required action; every unresolved or invalid item is routed; every affected observation and fact remains preserved; every observation reference resolves to the family evidence; no exception duplicates evidence data; and `summary.observation_count` is distinct from `summary.canonical_variant_count`. Return valid JSON only.
