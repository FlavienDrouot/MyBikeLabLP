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
| `frontend/src/domain/` | Product rules, wheel properties, accessors, and currency logic |
| `frontend/src/application/` | Application read APIs that coordinate domain rules and catalog data |
| `frontend/src/data/` | Static wheel catalog and validation |
| `frontend/src/store/` | Redux store, slices, selectors, and derived application state |
| `frontend/src/ui/` | React application UI, entry points, presentation, and browser concerns |
| `frontend/src/ui/components/` | React UI components and component-level presentation |
| `frontend/src/ui/pages/` | Page-level UI composition |
| `frontend/src/ui/hooks/` | Reusable React hooks |
| `frontend/src/ui/assets/` | Static UI assets, illustrations, icons, fonts, and placeholders |
| `frontend/src/ui/styles/` | Global styles, design tokens, and font declarations |
| `frontend/src/ui/lib/` | UI utilities such as theme and document language handling |
| `frontend/TASTE-PROFILE.md` | Consolidated visual guidance for UI work |
| `frontend/prototypes/` | Retained unintegrated UI prototypes |
| `scripts/` | Product data ingestion, migration, and maintenance tooling |
| `evolutions/` | Product work artifacts |
| `reviews/` | Historical codebase review artifacts |

## Product Rules

- Define wheel property metadata, accessors, filters and sorts in
  `frontend/src/domain/wheelProperties.js`. Keep domain modules independent of
  React, JSX, UI components, assets, renderers and presentation classes. Table
  presentation belongs in the UI layer.
- Keep table renderers, presentation classes and UI-specific column composition
  in `frontend/src/ui/components/MiniComparator/wheelPropertyColumns.jsx`, the
  UI adapter for the domain registry.
- Domain consumers such as filters, sorts and selectors import
  `frontend/src/domain/wheelProperties.js`; comparator components that need
  rendered columns import the UI adapter.
- Adding a standard wheel property normally requires one registry entry only;
  add a corresponding UI-adapter entry when it needs custom presentation.
- Key filter and sort state by registry property IDs.
- Supported filter types are `range`, `multiSelect`, and `triState`. Adding a filter type requires corresponding matcher and slice initialization support.
- Keep column visibility local to `MiniComparator`; filter and sort state belong in Redux.
- Before UI work, read `frontend/src/ui/styles/design-tokens.css` and
  `frontend/TASTE-PROFILE.md` when relevant. The unintegrated product-detail
  reference is under `frontend/prototypes/wave-3-product-detail/`.
- Use `frontend/src/ui/styles/design-tokens.css` and shared classes in
  `frontend/src/ui/styles/index.css` instead of ad hoc styling.
- Wheel data schema changes must update all existing `wheelsData_*.js` files and affected product-owned validation, ingestion, migration, and documentation artifacts.
