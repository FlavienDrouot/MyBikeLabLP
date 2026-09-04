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

## Architecture direction

The frontend is progressively organized around four responsibilities. The
folder names describe the responsibility of the code, not simply its file
format:

- **Domain**: product concepts and rules independent of React and of the data
  source. For wheels, this includes property metadata, accessors, filtering,
  sorting and domain calculations.
- **Application**: use cases that coordinate domain rules, data and
  application state to answer a product need, such as catalog statistics.
  Redux slices and selectors are application-state infrastructure.
- **Data**: catalog content and its sources or adapters, currently the
  `wheelsData*.js` files and data validation.
- **UI**: React components, renderers, presentation classes and browser
  interactions. The existing `components/` tree is the UI layer.

The target dependency direction is:

```text
UI -> Application / Store -> Domain
                    \----> Data
```

Domain code must not depend on React, JSX, UI components or presentation
classes. Data code must not depend on UI. Keep the application layer thin: do
not add abstractions unless they isolate a real use case or data-source
boundary.

The physical reorganization is progressive. Until the target folders are
migrated, the current mappings are:

- `config/wheelProperties.js`: domain registry;
- `services/catalogStats.js`: application read API;
- `data/`: catalog data and validation;
- `components/` and `config/wheelPropertyColumns.jsx`: UI and UI adapter;
- `store/`: application state integration.

When moving an affected module, prefer the target responsibility folder and
update its imports and documentation. Do not perform unrelated mass moves only
to rename directories.

## Repository Map

| Path | Role |
| --- | --- |
| `product-overview.md` | Product purpose, users, features, and roadmap |
| `frontend/` | React application source and configuration |
| `frontend/src/design-tokens.css` | Production design tokens and shared visual primitives |
| `frontend/TASTE-PROFILE.md` | Consolidated visual guidance for future UI work |
| `frontend/prototypes/` | Retained unintegrated UI prototypes |
| `scripts/` | Product data ingestion, migration, and maintenance tooling |
| `evolutions/` | Product work artifacts |

## Product Rules

- Define wheel property metadata, accessors, filters and sorts in
  `frontend/src/config/wheelProperties.js`. Keep this registry independent of
  React, JSX, `HookBadge`, renderers and presentation classes. Transitional
  structural column metadata may remain there, but table presentation belongs
  in the UI adapter.
- Keep table renderers, presentation classes and UI-specific column composition
  in `frontend/src/config/wheelPropertyColumns.jsx`, the UI adapter for the
  domain registry.
- Domain consumers such as filters, sorts and selectors import
  `wheelProperties.js`; comparator components that need rendered columns import
  `wheelPropertyColumns.jsx`.
- Adding a standard wheel property normally requires one registry entry only;
  add a corresponding UI-adapter entry when it needs custom presentation.
- Key filter and sort state by registry property IDs.
- Supported filter types are `range`, `multiSelect`, and `triState`. Adding a filter type requires corresponding matcher and slice initialization support.
- Keep column visibility local to `MiniComparator`; filter and sort state belong in Redux.
- Before UI work, read `frontend/src/design-tokens.css` and `frontend/TASTE-PROFILE.md` when relevant. The unintegrated product-detail reference is under `frontend/prototypes/wave-3-product-detail/`.
- Use `frontend/src/design-tokens.css` and shared classes in `frontend/src/index.css` instead of ad hoc styling.
- Wheel data schema changes must update all existing `wheelsData_*.js` files and affected product-owned validation, ingestion, migration, and documentation artifacts.
