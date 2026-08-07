# MyBikeLab acquisition pipeline

Start with [`PipelineCoordinatorPrompt.md`](PipelineCoordinatorPrompt.md). It is the
agent-driven entrypoint: before any phase work, the coordinator must create the required
child worker/thread. It then waits for and supervises phase workers, passes artifacts,
applies gates, and requests human approval before publication.

Discovery, normalization, and independent verification use exactly one separate Luna
worker each at `reasoning_effort: medium`. After discovery, acquisition uses exactly one
Luna child worker at `reasoning_effort: medium` per included product family; each worker
owns one family only. Complex exception review starts explicitly with Luna
(`gpt-5.6-luna`, `reasoning_effort: xhigh`). Exceptional escalation uses Terra
(`gpt-5.6-terra`, `reasoning_effort: xhigh`) only after Luna xhigh fails or cannot
resolve a material issue. The deterministic Node publisher uses no model. If worker/thread
creation or a required model is unavailable, stop with a blocking orchestration exception;
never do worker work in the coordinator.

The coordinator itself uses `gpt-5.6-luna` at `reasoning_effort: medium`. It only creates
and waits for workers, validates explicit handoffs, advances
gates, and invokes the publisher after approval. It does not browse, extract, normalize,
verify, resolve exceptions, write worker artifacts, or create helper generation or
orchestration scripts. Keep every intermediate artifact; do not replace an earlier
artifact with a normalized result.

Each worker launch includes this authorization statement: `Authorized: create and write
only the assigned artifact(s), plus any revision or recovery checkpoint for those
artifacts, inside the assigned run folder. Not authorized: schema changes, frontend
changes, publication, helper scripts, orchestration scripts, or work belonging to
another phase or family.` The authorization applies only to exact assigned artifact
paths; workers must not write other files or artifact families.

Acquisition uses two steps. First, WebFetch performs a static preparatory pass that may
prefill stable facts and locate relevant source material. Second, the Codex integrated
in-app browser must verify every in-scope or ambiguous buyable configuration and every
dynamic commerce state, including selected options, SKU, stock, price, currency, and
displayed offer. A configuration deterministically identified as an out-of-scope
individual wheel during the preparatory pass needs only exclusion evidence. Static fetch
is preparatory only and never replaces browser verification for an in-scope or ambiguous
configuration. If browser verification is unavailable or fails, block acquisition and
route the case through `prompts/04-exceptions.md`.

Acquisition writes one logical evidence JSON file per product family. The coordinator
records `acquisition_worker_ids` in the run manifest as a family-to-worker mapping and
waits for every mapped worker before normalization. Every worker handoff and the run
manifest must expose the exact `model` and `reasoning_effort` settings. It contains
`stable_facts`, reusable axis-value `configuration_profiles`, and compact raw
observations. Repeated observations reference those profiles instead of repeating full
records. Do not create temporary small-batch files or add a batching strategy. Acquisition
records evidence only: it does not classify variants or options and does not assign IDs.
Normalization owns that business logic and uses reference-only fact accounting. Compact
profiles plus reference-only accounting prevent the former 7400-line style outcome.

Each acquisition family processes no more than six configurations in one operational
browser-traversal checkpoint. Use as many sequential checkpoints as the complete matrix
requires; checkpoint numbering has no artificial upper bound. Checkpoints are revisions of
the assigned evidence artifact in the assigned run folder, not temporary batch files. Do
not create extra workers or batch files to implement the checkpoints. Handoffs include
exact input, output, checkpoint, and recovery paths, checkpoint expectations, and the
authorization statement.

1. Create the discovery worker, then read [`scripts/prompts/00-shared-contract.md`](prompts/00-shared-contract.md) — rules shared by every phase.
2. [`scripts/prompts/01-discovery.md`](prompts/01-discovery.md) — create `catalog-index.json`.
3. [`scripts/prompts/02-acquisition.md`](prompts/02-acquisition.md) — create one family-level evidence JSON with stable facts, configuration profiles, and compact raw observations.
4. [`scripts/prompts/03-normalization.md`](prompts/03-normalization.md) — create canonical product JSON and a fact-accounting report.
5. [`scripts/prompts/04-exceptions.md`](prompts/04-exceptions.md) — route blocked, ambiguous, stale, or conflicting records.

The coordinator creates each next worker only after validating the previous worker's
explicit handoff and artifacts. No phase may run out of sequence. Missing optional SKU
data does not block a run when required evidence is complete for an in-scope wheelset.
Individual front-only or rear-only wheels are outside the current catalog scope. Record
their deterministic exclusion with provenance and continue; do not create canonical
products or blocking exceptions merely because they appear on the source page. An
ambiguous purchase unit remains an exception.

On timeout, preserve the latest checkpoint, mark the worker timed out in the run manifest,
and request one recovery revision from the same worker in the same assigned run folder.
The recovery handoff identifies the parent artifact, exact revision path, completed and
missing matrix coverage, and remaining timeout risk. Do not replace the worker, split the
family, add a batch file, or advance the phase. A second timeout or absent checkpoint is a
blocking orchestration exception.

Before human approval, validate the final acquisition matrix against the discovery index
and family assignments. It must cover every in-scope front-plus-rear pair, required dynamic
commerce state, exclusion, and required fact, with optional SKU absence explicitly accounted
for. Validate every final JSON artifact and handoff for schema conformity, exact paths,
source traceability, fact accounting, unresolved values, IDs, and verifier status before
publication can proceed.

The final canonical product objects must conform exactly to [`workflows/datascraping/wheel-format.json`](C:/Users/Flavien/Documents/VisualStudioCode/work-system/workflows/datascraping/wheel-format.json). The current scope is road wheelsets, meaning front + rear pairs sold together, including triathlon wheelsets listed in a road category; exclude individual front-only/rear-only wheels, gravel-specific, MTB, track-only, spare-part, hub-only, rim-only, spoke-only, and accessory products. A buyable configuration is first recorded as a commerce observation; only a classified real catalog variant becomes a canonical object. Preserve the official brand and model names and use the canonical `variant` rules. Before normalization, the orchestrator scans the complete current catalog, reserves a contiguous allocation block beginning at `max(existing IDs) + 1`, and passes that block to normalization. Historical IDs and historical reserved ranges remain valid and are never reused for new records.

The pipeline must return explicit unresolved values and never fabricate facts. Preserve exhaustive technical capture in acquisition evidence and `other_specs` when no canonical field applies. Capture source currency as published (`EUR` or `USD`) without conversion. Use WebFetch for the static preparatory pass, then use the Codex integrated in-app browser to verify every in-scope or ambiguous buyable configuration and dynamic commerce state; record selected options, SKU, stock state, price, currency, and displayed offer. Acquisition does not classify commerce axes or assign IDs. Commerce observations remain evidence; normalization classifies them as `variant`, `option`, `cosmetic`, `offer`, or `unknown` and assigns IDs only to canonical products. Validate every JSON artifact before handoff.
