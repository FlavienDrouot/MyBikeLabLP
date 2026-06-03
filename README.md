# MyBikeLab

## Description

React application for bike wheel comparison. Frontend-only MVP.

## Git Commands

**Repo location:** `C:\Users\Flavien\Google Drive\VisualStudioCode\Claude\MyBikeLab\`

Working directory is `Claude\` — run git from the project root with:
```
git -C "MyBikeLab" <commande>
```

## Navigation

| Folder / File | Role | Read |
|---|---|---|
| `product-overview.md` | Functional product documentation — purpose, users, features, roadmap | `product-overview.md` |
| `frontend/` | Application React (source, config, build) | `frontend/README.md` |
| `scripts/` | Data ingestion scripts — affiliate and product feeds (gitignored) | `scripts/README.md` |
| `evolutions/` | Specs d'évolution (planifiées et archivées) | `evolutions/README.md` |
| `design-system/` | Token source of truth, ui_kits, editorial rules — **read before any UI work** | `design-system/README.md` |
| `.github/workflows/deploy.yml` | Pipeline CI/CD — déploiement GitHub Pages | — |

## Architecture Summary

### Stack
- React 19 + Vite (base path: `/MyBikeLabLP/`) + Redux Toolkit + Tailwind CSS 3
- Frontend-only MVP (no backend)

### Entry Points
- `frontend/index.html` → `src/main.jsx` (Redux Provider) → `App.jsx` → `pages/Landing.jsx`

### Core Modules
- `src/config/wheelProperties.jsx` → **Central registry**: source of truth for all wheel properties (filters, sorts, columns, accessors). Add property here only.
- `src/store/slices/filtersSlice.js` → filter + sort global state (keyed by registry property IDs)
- `src/store/selectors/wheelsSelectors.js` → `selectFilteredWheels` (memoized, applies active filters + sort)
- `src/data/wheelsData.js` → static wheel dataset (~15 items; future: async Redux thunk)
- `src/components/MiniComparator/` → main feature: `FilterPanel` + `ComparisonTable` + `ColumnSelector`
- `src/pages/Landing.jsx` → single page orchestrator: Navbar → Hero → MiniComparator → Roadmap → Benefits → Footer

### Data Flow
User filter → `FilterPanel` dispatches `setFilterValue` → `filtersSlice` → `selectFilteredWheels` recomputes → `ComparisonTable` re-renders

### Design System

All UI work must follow the design system defined in `design-system/`. Before implementing any new component or page surface:

1. Read `design-system/README.md` — visual foundations, editorial hard rules
2. Read `design-system/IMPLEMENTATION-GUIDE.md` — token usage, component checklist, ui_kit mapping protocol
3. Check `design-system/ui_kits/<surface>/` for a reference implementation of the target surface

The full migration of the production codebase to the design system is planned as EVO-039 through EVO-043 (see `evolutions/README.md`). Each evolution's `init.md` describes its scope and acceptance criteria.

### Important Conventions
- **New wheel property** = one entry in `wheelProperties.jsx` only (no changes elsewhere)
- Filter types: `range` | `multiSelect` | `triState` — new type requires matcher + init in slice
- Column visibility = local state in `MiniComparator`; filter/sort = Redux global
- Tailwind tokens: `paper-*`, `ink-*`, `brass-*`, `sage-*`; shared classes in `src/index.css`

### Data Schema Conventions
Any evolution that changes the wheel data schema (adds, renames, restructures, or extends a field in `wheelsData_*.js`) **must include in its scope**:

1. **Data migration** — update all existing `wheelsData_*.js` files to conform to the new schema. No entry may be left in the old format.
2. **Scraping process update** — update `workflows/datascraping/wheel-format.json`, `scripts/DatascrapingPrompt.md`, and `workflows/datascraping/README.md` to reflect the new schema so that future scraping sessions produce conformant data from the start.

These two items are not optional follow-ups — they are part of the evolution's definition of done.
