# MyBikeLab Agent Instructions

## Scope

These instructions apply to `MyBikeLab`.

- Canonical repository: `C:\Users\Flavien\Documents\VisualStudioCode\MyBikeLab`.
- Active repository: the Git worktree containing this `AGENTS.md`, or the canonical repository when no worktree is used.
- When working in a worktree, modify only that worktree. The canonical checkout and other worktrees are external to the current task.
- Files outside the active repository may be read when needed.
- Do not create, modify, move, rename, or delete files outside the active repository unless the user explicitly requests or approves the cross-repository change.
- Skills, workflows, and repository instructions may identify cross-repository work, but do not authorize it.

## Product Overview

`MyBikeLab` is a web platform for comparing bicycle equipment. It helps cyclists make informed choices from normalized technical and commercial data.

Its first product scope focuses on road wheelsets.

## Repository Map

| Path | Role |
| --- | --- |
| `product-overview.md` | Product purpose, users, features, and roadmap |
| `frontend/` | React application source and configuration |
| `frontend/src/design-tokens.css` | Production design tokens and shared visual primitives |
| `evolutions/archive/design-system/` | Consolidated visual guidance and retained unintegrated product-detail reference |
| `scripts/` | Product data ingestion, migration, and maintenance tooling |
| `evolutions/` | Product work artifacts |

## Product Rules

- Add wheel properties through `frontend/src/config/wheelProperties.jsx`.
- Key filter and sort state by registry property IDs.
- Supported filter types are `range`, `multiSelect`, and `triState`. Adding a filter type requires corresponding matcher and slice initialization support.
- Keep column visibility local to `MiniComparator`; filter and sort state belong in Redux.
- Before UI work, read `frontend/src/design-tokens.css` and the consolidated visual guidance in `evolutions/archive/design-system/TASTE-PROFILE.md` when relevant. The unintegrated product-detail reference is under `evolutions/archive/design-system/wave-3-product-detail/`.
- Use `frontend/src/design-tokens.css` and shared classes in `frontend/src/index.css` instead of ad hoc styling.
- Wheel data schema changes must update all existing `wheelsData_*.js` files and affected product-owned validation, ingestion, migration, and documentation artifacts.

## graphify

This repository has a knowledge graph at `graphify-out/` with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts.
- Dirty `graphify-out/` files are expected after hooks or incremental updates. Skip graphify only when the task concerns stale or incorrect graph output, or the user explicitly asks not to use it.
- Use `graphify-out/wiki/index.md` for broad navigation when it exists.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture reviews or when query, path, or explain do not provide enough context.
- After modifying code, run `graphify update .` to keep the graph current.
