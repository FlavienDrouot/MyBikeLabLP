# MyBikeLab

## Description

React application for bike wheel comparison. Frontend-only MVP.


## Navigation

| Folder / File | Role | Read |
|---|---|---|
| `product-overview.md` | Functional product documentation — purpose, users, features, roadmap | `product-overview.md` |
| `frontend/` | Application React (source, config, build) | `frontend/README.md` |
| `scripts/` | Data ingestion scripts — affiliate and product feeds (gitignored) | `scripts/README.md` |
| `evolutions/` | Evolution specs (planned and archived) | `evolutions/README.md` |
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
