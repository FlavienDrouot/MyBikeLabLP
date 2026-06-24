# MyBikeLab Agent Instructions

## Scope

These instructions apply to agent work inside `MyBikeLab/`.

`MyBikeLab/` is the product workspace for a frontend-only React application that compares bicycle wheels. Agents may read and modify product-internal files when the user request concerns MyBikeLab development, fixes, reviews, scraping, documentation, or implementation work.

This file is self-sufficient for product-specific work. Shared workflows and standards live in `../work-system/`.

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
| Modify workspace or product structure | `../work-system/workflows/workspace-governance/GOVERNANCE.md` |

Direct product-file access is appropriate only for explicit file-level requests or tasks that clearly do not map to an existing workflow.

## Product Structure

| Path | Purpose |
| --- | --- |
| `product-overview.md` | Human-facing product purpose, users, features, and roadmap |
| `frontend/` | React application source, configuration, and build setup |
| `scripts/` | Data ingestion scripts and prompts (gitignored) |
| `evolutions/` | Product evolution specs, fixes, and archived work (gitignored) |
| `design-system/` | Design tokens, UI kits, editorial rules, and implementation guidance (gitignored) |
| `.github/workflows/deploy.yml` | GitHub Pages deployment pipeline |

## Git And Shell

- Product repo is `C:\Users\Flavien\Documents\VisualStudioCode\MyBikeLab\`.
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

1. `design-system/README.md`
2. `design-system/IMPLEMENTATION-GUIDE.md`
3. The relevant reference under `design-system/ui_kits/<surface>/`, when one exists

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

## Agent Rules

- Write in plain, clear language; ask clarifying questions before risky assumptions; say so when unsure.
- When a structured user-question tool is available, prefer it for concise clarification before risky or irreversible decisions. Do not use it for questions that can be answered by reading the repository.
- Confirm before acting on structural changes: summarize the intended change and ask for permission before execution.
- If the path or structure of a file is already inferable from context, read it directly instead of searching first.
- When the user gives durable behavioral feedback, integrate it into the appropriate `AGENTS.md` or `README.md` instead of relying on memory.
- Before editing files, identify the files or folders expected to change and read the applicable instruction chain from this root file through the relevant instruction or navigation file.
- Local rules specialize parent rules but may not weaken global workspace rules.
- After a meaningful change, check whether the nearest README or instruction file and any parent navigation table must be updated.
- Every durable structural folder or instruction file must remain reachable through the navigation chain.

