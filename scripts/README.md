# scripts/

The retained entry point for manual collection is
[`DatascrapingPrompt.md`](DatascrapingPrompt.md). No active API ingestion
workflow or current collection schema is maintained in this repository.

## Archived experiments

The former Awin and Channel3 scripts, their package metadata, sanitized
configuration example, and historical exports are preserved in the
[work-vault archive](https://github.com/FlavienDrouot/work-vault/tree/main/products/mybikelab/archives/scripts).

The Channel3 experiment found that the tested feed was a poor fit for
road-wheel pairs: only two relevant pairs were identified among the returned
products. The exports are historical provenance, not a backup of the current
catalog, and the archived scripts do not promise current API compatibility.

To revisit an experiment, copy the archived scripts to an isolated working
folder, create a local configuration from the sanitized example, and keep
outputs outside this repository. The collection schema and a recurring
ingestion workflow would require a separate product decision.
