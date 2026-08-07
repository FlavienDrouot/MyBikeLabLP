# Phase 4 — exception routing

Read `00-shared-contract.md`, the discovery index, all single-family evidence, normalization outputs, and the canonical schema. Route every unresolved, blocked, stale, conflicting, or validation-failing item. Do not silently repair evidence, infer a classification, allocate an ID, drop an observation, or reduce the exception count by inventing a value.

## Required exception coverage

Create an exception whenever any of these occurs:

- classification uncertainty between `variant`, `option`, `cosmetic`, `offer`, and `unknown`;
- missing browser verification, including an unverified selector state, a missing post-selection URL without another sufficient first-party identity, an inaccessible dynamic offer, or a browser failure;
- conflicting source facts, stale or unavailable source evidence, or contradictory profile/observation values;
- an invalid, ambiguous, missing, or cross-file fact reference, duplicate fact ID, duplicate observation ID, or broken stable/profile dereference;
- incomplete evidence, missing material comparison facts, missing provenance, unsupported currency, incomplete observation coverage, or allocation-block exhaustion;
- schema, type, canonical enum, identity, scope, grouping, or fact-accounting validation failure.

An explicitly identified individual front-only or rear-only offer is a deterministic
out-of-scope exclusion, not a blocking exception. Preserve its observation reference,
source provenance, and exclusion reason in the discovery/acquisition artifacts. Create a
scope exception only when the purchase unit remains ambiguous or the source contradicts
the exclusion evidence.

Acquisition classifications are never treated as decisions. A retry may collect evidence, but only normalization may classify an axis. If the new evidence still cannot support a decision, keep the classification `unknown`, do not group the observation, and do not allocate an ID.

## Routing tiers

- **Tier 1 — deterministic repair:** repair a schema, type, unit, or canonical-key issue only when an explicit source fact and `wheel-format.json` make the result deterministic. Preserve the raw value and provenance.
- **Tier 2 — targeted browser retry:** retry the exact selector, dynamic state, pagination, modal, PDF, region/currency, or post-selection URL check. Record the attempted action, browser result, selected state, URL, timestamp, and new fact references. For an in-scope or ambiguous buyable observation, a failed or unavailable browser check remains blocking.
- **Tier 3 — model review:** review identity, scope, grouping, classification, conflicts, stale evidence, ambiguous units, and incomplete profiles using cited evidence. The proposal must cite fully qualified fact references and preserve every affected observation. It does not authorize ID allocation by itself.
- **Human gate:** require a decision for fabricated or contradictory facts, missing primary evidence for a material comparison field, unknown product scope, unresolved classification, invalid provenance, or any requested frontend schema change. The frontend schema remains unchanged in this workflow.

## Retry and unavailable-target protocol

Treat every browser timeout as unknown, never as success. Re-read the current visible
state, re-ground the control, and retry the exact logical action at most once. If the
state remains unverifiable, preserve the observation as `unresolved` and do not restart
the complete acquisition.

Close an overlay only through its current visible safe close control. Never reuse an old
locator, hidden input, coordinate, or page state after a retry. Record
`attempt_count`, `timeout_count`, `last_observed_state`, and `retry_reason` for every
browser exception.

For a 404, generic redirect, unavailable target, or non-product page, preserve the
requested URL, observed URL, status or title, and reason. Route it as `blocked` or
`unavailable_target`; an empty matrix is not successful acquisition. Retry the affected
target or action only, not the complete phase, unless the browser session was lost.

Contradictory facts always require explicit human arbitration before publication or
correction. Preserve every competing `fact_ref` and affected `observation_ref`, including
the source provenance for each candidate. A Luna or Terra proposal is review input only;
neither proposal is a final decision and neither may authorize publication, correction,
ID allocation, or replacement of a captured fact. Record the human outcome in the
referenced resolution artifact before closing the exception.

Use this compact human decision record for each arbitration:

```json
{
  "decision_id": "human-0001",
  "decision": "accept|reject|defer|request_reacquisition|request_normalization",
  "reviewer": "human reviewer identifier",
  "rationale": "concise evidence-based rationale",
  "timestamp": "2026-01-01T00:00:00Z",
  "affected_refs": {
    "fact_refs": ["evidence-id#fact-id"],
    "observation_refs": ["evidence-id#observation-id"]
  },
  "resolution_status": "open|resolved|accepted_unresolved"
}
```

Write the records to `exceptions/human-decisions.json` and reference each record by its
`decision_id` from the corresponding exception's `resolution_refs`.

The same arbitration policy applies to missing or contradictory per-wheel or total
weights, image URL conflicts, and source-vs-source disagreements. Missing values remain
missing until a cited acquisition or normalization step resolves them. A source-vs-source
disagreement is not resolved by source order, recency alone, Luna, or Terra; retain all
source facts and route the exception to `human_gate` when publication or correction is
proposed. For missing or contradictory weights, image URL conflicts, and source-vs-source
disagreements, no publication or correction may proceed until that human gate records its
decision and resolution status.

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
    "attempt_count": 0,
    "timeout_count": 0,
    "last_observed_state": "",
    "retry_reason": "",
    "status": "open|resolved|accepted_unresolved",
    "resolution_refs": [],
    "evidence_refs": []
  }],
  "summary": {"open": 0, "blocking": 0, "accepted_unresolved": 0, "observation_count": 0, "canonical_variant_count": 0}
}
```

`fact_refs` must use `evidence_id#fact_id` and resolve to captured facts. `observation_refs` must use `evidence_id#observation_id` and resolve to preserved raw observations. Do not copy raw values, source URLs, timestamps, selected values, or fact lists into an exception; provenance is recovered through the referenced evidence observation and its `source_id`. `evidence_refs` and `resolution_refs` must point to declared facts, observations, profiles, normalization mappings, classification decisions, accounting records, or `decision_id` values from the human decision artifact. A resolved exception points to the evidence and normalization/accounting change that resolved it. An `accepted_unresolved` exception remains in the final handoff and prevents claiming complete normalization when it affects classification, evidence completeness, browser verification, or validation. Do not use exceptions to introduce temporary batch files, split work into batches, or define a batching strategy.

## Post-publication feedback

Accept post-publication corrections only through the run's
`publication/post-publication-review.json`. Each
feedback item must identify the canonical ID and field, the issue, supporting
evidence/source, reviewer, decision, and status. The artifact shape is:

```json
{
  "schema_version": "mybikelab.post-publication-review.v1",
  "release_id": "release-0001",
  "generated_at": "2026-01-01T00:00:00Z",
  "feedback": [{
    "feedback_id": "feedback-0001",
    "canonical_id": 101,
    "field": "weight_grams",
    "issue": "published value conflicts with first-party source",
    "evidence_refs": ["evidence-id#fact-id"],
    "source_refs": ["source-id"],
    "reviewer": "human reviewer identifier",
    "decision": "accept|reject|defer|request_reacquisition|request_normalization",
    "status": "open|resolved|accepted_unresolved"
  }]
}
```

Accepted feedback creates a new correction, reacquisition, or normalization revision
through the existing evidence and exception workflow. It never becomes a direct frontend
edit. Preserve the prior publication, prior value, prior provenance, feedback artifact,
and human decision record; link the new revision to those records and publish it only
after the applicable validation and human gate are complete. The frontend schema remains
unchanged.

Validate that every exception has a precise type, severity, tier, status, provenance references, and required action; every unresolved or invalid item is routed; every affected observation and fact remains preserved; every observation reference resolves to the family evidence; no exception duplicates evidence data; and `summary.observation_count` is distinct from `summary.canonical_variant_count`. Return valid JSON only.

## Corrections

Route a missing SKU as an unresolved exception with severity `low` or `medium` when selected raw values and buyability were browser-verified and a post-selection URL, variant ID, or another sufficient first-party identity was observed. It is `blocking` only when SKU is the sole reliable identity for an otherwise unidentifiable observation. A missing post-selection URL is blocking only when no sufficient first-party identity exists.

Front-only and rear-only wheels are out of scope for the current wheelset catalog. Raw
`None (Front Wheel Only)` and `None (Rear Wheel Only)` sentinels mean
`axis_applicability: "not_applicable"` and support a non-blocking scope exclusion, not a
missing fact or a missing profile. Exclude them from normalization and in-scope
cardinality; create null-profile or cardinality exceptions only when an applicable axis
of an in-scope pair lacks a reusable profile. Preserve the excluded observation and
browser/static provenance.
