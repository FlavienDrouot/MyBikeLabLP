# MyBikeLab Claude Instructions

## Scope

These instructions apply to Claude work inside `MyBikeLab/`.

`MyBikeLab/` is the product workspace for a frontend-only React application that compares bicycle wheels. Claude may read and modify product-internal files when the user request concerns MyBikeLab development, fixes, reviews, scraping, documentation, or implementation work.

This file is self-sufficient for product work. Do not require `../CLAUDE.md` or `README.md` as mandatory agent instruction files.

## Workspace Boundary

- Keep product changes inside `MyBikeLab/` unless the active workflow explicitly requires coordinated changes in `../workflows/` or `../shared-knowledge/`.
- Use `../thinking/` for exploratory or preparatory reasoning that is not yet an approved product implementation.
- Do not reorganize product or workspace structure without explicit user instruction.
- Before structural changes, summarize the intended change and ask for confirmation.

## Workflow-First Rule

Before implementation, check whether the request maps to a workflow in `../workflows/`.

| Task type | Read |
| --- | --- |
| Start or develop a feature, evolution, or improvement | `../workflows/ai-dev-process/README.md` |
| Fix a small local issue | `../workflows/ai-dev-process/README.md` |
| Review or audit code | `../workflows/code-review/CODE-REVIEW.md` |
| Scrape or ingest wheel data | `../workflows/datascraping/README.md` |
| Review or improve instruction files | `../workflows/instruction-review/INSTRUCTION-REVIEW.md` |
| Modify workspace or product structure | `../workflows/workspace-governance/GOVERNANCE.md` |

Direct product-file access is appropriate only for explicit file-level requests or tasks that clearly do not map to an existing workflow.

## Product Structure

| Path | Purpose |
| --- | --- |
| `product-overview.md` | Human-facing product purpose, users, features, and roadmap |
| `frontend/` | React application source, configuration, and build setup |
| `scripts/` | Data ingestion scripts and prompts |
| `evolutions/` | Product evolution specs, fixes, and archived work |
| `design-system/` | Design tokens, UI kits, editorial rules, and implementation guidance |
| `.github/workflows/deploy.yml` | GitHub Pages deployment pipeline |

## Git And Shell

- Workspace root is normally `C:\Users\Flavien\Google Drive\VisualStudioCode\Claude\`.
- Product repo is `C:\Users\Flavien\Google Drive\VisualStudioCode\Claude\MyBikeLab\`.
- Run Git from the workspace root with `git -C "MyBikeLab" <command>`.
- Before any commit, run `git -C "MyBikeLab" status --short` and verify which files are tracked.
- On Windows, use PowerShell, not Bash.

## Technical Context

- Stack: React 19, Vite with base path `/MyBikeLabLP/`, Redux Toolkit, Tailwind CSS 3.
- Frontend-only MVP; no backend.
- Entry flow: `frontend/index.html` -> `src/main.jsx` -> `App.jsx` -> `pages/Landing.jsx`.
- Main feature: `src/components/MiniComparator/`.
- Static wheel data currently lives under `src/data/`.

## Core Product Rules

- New wheel properties must be added through `src/config/wheelProperties.jsx`.
- Filter state and sort state are keyed by registry property IDs.
- Supported filter types are `range`, `multiSelect`, and `triState`; a new filter type requires matcher and slice initialization updates.
- Column visibility is local to `MiniComparator`; filter and sort state are global Redux state.
- Tailwind tokens include `paper-*`, `ink-*`, `brass-*`, and `sage-*`; shared classes live in `src/index.css`.

## UI Work

Before implementing a new component or page surface, read:

1. `design-system/README.md`
2. `design-system/IMPLEMENTATION-GUIDE.md`
3. The relevant reference under `design-system/ui_kits/<surface>/`, when one exists

Follow the local design-system rules over ad hoc styling choices.

## Wheel Data Schema Changes

Any evolution that adds, renames, restructures, or extends a field in `wheelsData_*.js` must include:

1. Data migration: update all existing `wheelsData_*.js` files to the new schema.
2. Scraping process update: update `../workflows/datascraping/wheel-format.json`, `scripts/DatascrapingPrompt.md`, and `../workflows/datascraping/README.md`.

These are part of the definition of done, not optional follow-ups.

## Documentation Pass

After meaningful changes, check whether product instructions, workflow files, or human documentation need updates.

A change is meaningful when it affects purpose, scope, ownership, responsibilities, structure, workflow contracts, required inputs or outputs, constraints, generated artifacts, or durable user preferences.

Small implementation edits that do not change behavior, contracts, structure, workflow, or responsibilities do not require documentation churn.
