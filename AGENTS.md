# MyBikeLab Agent Instructions

## Scope

These instructions apply to agent work inside `MyBikeLab/`.

`MyBikeLab/` is the product workspace for a frontend-only React application that compares bicycle wheels. Agents may read and modify product-internal files when the user request concerns MyBikeLab development, fixes, reviews, scraping, documentation, or implementation work.


## Workspace Boundary

- Keep product changes inside `MyBikeLab/` unless the active workflow explicitly requires coordinated changes in `../work-system/workflows/` or `../work-system/shared-knowledge/`.
- Use `../work-system/thinking/` for exploratory or preparatory reasoning that is not yet an approved product implementation.
- Product repositories live next to `work-system/` at `../[Product]/`, not inside it.
- Do not reorganize product or workspace structure without explicit user instruction.
- Before any changes, summarize the intended change and ask for confirmation.

## Work Hierarchy Vocabulary

Development work inside a product is organized in nested levels. Detailed mechanics, ID counters, and creation rules belong in `../work-system/workflows/ai-dev-process/README.md`.

| Level | ID | Definition | Home |
| --- | --- | --- | --- |
| **Product** | - | A deliverable body of work that owns an `evolutions/` folder. | workspace root as `../[Product]/` |
| **Project** | `PROJ-NNN` | A coherent set of evolutions sharing one goal and definition of done. Optional grouping; most work goes straight to an Evolution. | `[product]/evolutions/PROJ-NNN_slug/` |
| **Evolution** | `EVO-NNN` | One feature change, either Light EVO or Standard EVO. | `[product]/evolutions/` or inside a Project |
| **Fix** | `fix-NNN` | A small local correction, usually one to three files and no architecture decision. | `[product]/evolutions/` or inside a Project |

The placeholder `[product]/` used across workflows refers to the active product repository.

## Workflow-First Rule

Before implementation, check whether the request maps to a workflow in `../work-system/workflows/`.

| Task type | Read |
| --- | --- |
| Start or develop a feature, evolution, or improvement | `../work-system/workflows/ai-dev-process/README.md` |
| Start or develop a feature with the experimental V2 process | `../work-system/workflows/ai-dev-process-experimental/ROUTING.md` |
| Fix a small local issue | `../work-system/workflows/ai-dev-process/README.md` |
| Review or audit code | `../work-system/workflows/code-review/CODE-REVIEW.md` |
| Scrape or ingest wheel data | `../work-system/workflows/datascraping/README.md` |
| Review or improve instruction files | `../work-system/workflows/instruction-review/INSTRUCTION-REVIEW.md` |
| Centralize or audit user-level agent rules, skills, specialized agents, or harness adapters | `../work-system/shared-knowledge/AGENT-HARNESS-ARCHITECTURE.md` |
| Modify workspace or product structure | `../work-system/workflows/workspace-governance/GOVERNANCE.md` |

Direct product-file access is appropriate only for explicit file-level requests or tasks that clearly do not map to an existing workflow.

## Product Structure

| Path | Purpose |
| --- | --- |
| `product-overview.md` | Human-facing product purpose, users, features, and roadmap |
| `frontend/` | React application source, configuration, and build setup |
| `scripts/` | Data ingestion scripts and prompts (gitignored) |
| `evolutions/` | Product evolution specs, fixes, and archived work (gitignored) |
| `frontend/design-system/` | Design tokens, UI kits, editorial rules, and implementation guidance (gitignored) |
| `.github/workflows/deploy.yml` | GitHub Pages deployment pipeline |

## Git And Shell

- Product repo is the repository root containing this `AGENTS.md`.
- Use PowerShell, not Bash.

## Technical Context

- Stack: React 19, Vite with base path `/MyBikeLabLP/`, Redux Toolkit, Tailwind CSS 3.
- Frontend-only MVP; no backend.
- Entry flow: `frontend/index.html` -> `src/main.jsx` -> `App.jsx` -> `pages/Landing.jsx`.
- Main feature: `src/components/MiniComparator/`.
- Static wheel data currently lives under `src/data/`.

## Browser Automation

Use built-in web search for current facts and citation-heavy research. Use `agent-browser.cmd` for interactive browsing, UI verification, screenshots, auth, dynamic pages, or workflows; first run `agent-browser.cmd skills get core`.

## Core Product Rules

- New wheel properties must be added through `src/config/wheelProperties.jsx`.
- Filter state and sort state are keyed by registry property IDs.
- Supported filter types are `range`, `multiSelect`, and `triState`; a new filter type requires matcher and slice initialization updates.
- Column visibility is local to `MiniComparator`; filter and sort state are global Redux state.
- Tailwind tokens include `paper-*`, `ink-*`, `brass-*`, and `sage-*`; shared classes live in `src/index.css`.

## UI Work

Before implementing a new component or page surface, read:

1. `frontend/design-system/README.md`
2. `frontend/design-system/IMPLEMENTATION-GUIDE.md`
3. The relevant reference under `frontend/design-system/ui_kits/<surface>/`, when one exists

Follow the local design-system rules over ad hoc styling choices.

## Wheel Data Schema Changes

Any evolution that adds, renames, restructures, or extends a field in `wheelsData_*.js` must include:

1. Data migration: update all existing `wheelsData_*.js` files to the new schema.
2. Scraping process update: update `../work-system/workflows/datascraping/wheel-format.json`, `scripts/DatascrapingPrompt.md`, and `../work-system/workflows/datascraping/README.md`.

These are part of the definition of done, not optional follow-ups.

## Documentation Pass

After meaningful changes, check whether product instructions, workflow files, or human documentation need updates.

A change is meaningful when it affects purpose, scope, ownership, responsibilities, structure, workflow contracts, required inputs or outputs, constraints, generated artifacts, or durable user preferences.

Small implementation edits that do not change behavior, contracts, structure, workflow, or responsibilities do not require documentation churn.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
