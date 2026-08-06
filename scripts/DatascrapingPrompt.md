# MyBikeLab acquisition pipeline

Start with [`PipelineCoordinatorPrompt.md`](PipelineCoordinatorPrompt.md). It is the
agent-driven entrypoint: the coordinator launches and supervises the phase workers,
passes artifacts, applies gates, and requests human approval before publication.

The coordinator, discovery, acquisition, normalization, and separate verifier use
`gpt-5.6-luna` at medium reasoning. Complex exception review uses `gpt-5.6-luna` at
very-high reasoning; final escalation uses `gpt-5.6-terra` at very-high reasoning. The Node
publisher uses no model. Keep every intermediate artifact; do not replace an earlier
artifact with a normalized result.

Acquisition uses two steps. First, WebFetch performs a static preparatory pass that may
prefill stable facts and locate relevant source material. Second, the Codex integrated
in-app browser must verify every buyable configuration and every dynamic commerce state,
including selected options, SKU, stock, price, currency, and displayed offer. Static
fetch is preparatory only and never replaces browser verification. If browser
verification is unavailable or fails, block acquisition and route the case through
`prompts/04-exceptions.md`.

Acquisition writes one logical evidence JSON file per product family. It contains
`stable_facts`, `configuration_profiles`, and compact raw observations. Do not create
temporary small-batch files or add a batching strategy. Acquisition records evidence
only: it does not classify variants or options and does not assign IDs. Normalization
owns that business logic.

1. [`scripts/prompts/00-shared-contract.md`](prompts/00-shared-contract.md) — rules shared by every phase.
2. [`scripts/prompts/01-discovery.md`](prompts/01-discovery.md) — create `catalog-index.json`.
3. [`scripts/prompts/02-acquisition.md`](prompts/02-acquisition.md) — create one family-level evidence JSON with stable facts, configuration profiles, and compact raw observations.
4. [`scripts/prompts/03-normalization.md`](prompts/03-normalization.md) — create canonical product JSON and a fact-accounting report.
5. [`scripts/prompts/04-exceptions.md`](prompts/04-exceptions.md) — route blocked, ambiguous, stale, or conflicting records.

The final canonical product objects must conform exactly to [`workflows/datascraping/wheel-format.json`](C:/Users/Flavien/Documents/VisualStudioCode/work-system/workflows/datascraping/wheel-format.json). The current scope is road bicycle wheels and wheelsets, including triathlon products listed in a road category; exclude gravel-specific, MTB, track-only, spare-part, hub-only, rim-only, spoke-only, and accessory products. A buyable configuration is first recorded as a commerce observation; only a classified real catalog variant becomes a canonical object. Preserve the official brand and model names and use the canonical `variant` rules. Before normalization, the orchestrator scans the complete current catalog, reserves a contiguous allocation block beginning at `max(existing IDs) + 1`, and passes that block to normalization. Historical IDs and historical reserved ranges remain valid and are never reused for new records.

The pipeline must return explicit unresolved values and never fabricate facts. Preserve exhaustive technical capture in acquisition evidence and `other_specs` when no canonical field applies. Capture source currency as published (`EUR` or `USD`) without conversion. Use WebFetch for the static preparatory pass, then use the Codex integrated in-app browser to verify every buyable configuration and dynamic commerce state; record selected options, SKU, stock state, price, currency, and displayed offer. Acquisition does not classify commerce axes or assign IDs. Commerce observations remain evidence; normalization classifies them as `variant`, `option`, `cosmetic`, `offer`, or `unknown` and assigns IDs only to canonical products. Validate every JSON artifact before handoff.
