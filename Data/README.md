# MyBikeLab data pipeline

The user-invocable `$mybikelab-datascraping` skill is the sole coordinator entrypoint.

- `../.agents/skills/mybikelab-datascraping/SKILL.md`: coordinator instructions.
- `prompts/00-shared-contract.md`: rules shared by all workers.
- `prompts/01-discovery.md` to `prompts/04-exceptions.md`: phase instructions.
- `wheel-format.json`: canonical product schema.
- `../scripts/build-frontend-data.mjs`: deterministic frontend publisher.
- `../scripts/validate-datascraping-artifact.mjs`: deterministic handoff validator.

Invoke the skill with a scope URL. It runs in an isolated worktree, keeps artifacts under
`Data/runs/<run_id>/`, excludes individual wheels, and requires human approval before publication.
