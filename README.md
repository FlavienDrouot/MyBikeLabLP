# MyBikeLab

## Description

React application for bike wheel comparison. Frontend-only MVP.


## Navigation

| Folder / File | Role | Read |
|---|---|---|
| `product-overview.md` | Functional product documentation â€” purpose, users, features, roadmap | `product-overview.md` |
| `frontend/` | Application React (source, config, build) | `frontend/README.md` |
| `scripts/` | Data ingestion scripts â€” affiliate and product feeds (gitignored) | `scripts/README.md` |
| `evolutions/` | Evolution specs (planned and archived) | `evolutions/README.md` |
| `frontend/src/design-tokens.css` | Production design tokens and shared visual primitives | `frontend/src/design-tokens.css` |
| `evolutions/archive/design-system/` | Consolidated visual guidance and retained unintegrated product-detail reference | `evolutions/archive/design-system/TASTE-PROFILE.md` |
| `.github/workflows/deploy.yml` | Pipeline CI/CD â€” dÃ©ploiement GitHub Pages | â€” |

## Architecture Summary

### Stack
- React 19 + Vite (base path: `/MyBikeLabLP/`) + Redux Toolkit + Tailwind CSS 3
- Frontend-only MVP (no backend)

### Entry Points
- `frontend/index.html` â†’ `src/main.jsx` (Redux Provider) â†’ `App.jsx` â†’ `pages/Landing.jsx`

### Core Modules
- `src/config/wheelProperties.jsx` â†’ **Central registry**: source of truth for all wheel properties (filters, sorts, columns, accessors). Add property here only.
- `src/store/slices/filtersSlice.js` â†’ filter + sort global state (keyed by registry property IDs)
- `src/store/selectors/wheelsSelectors.js` â†’ `selectFilteredWheels` (memoized, applies active filters + sort)
- `src/data/wheelsData.js` â†’ static wheel dataset (~15 items; future: async Redux thunk)
- `src/components/MiniComparator/` â†’ main feature: `FilterPanel` + `ComparisonTable` + `ColumnSelector`
- `src/pages/Landing.jsx` â†’ single page orchestrator: Navbar â†’ Hero â†’ MiniComparator â†’ Roadmap â†’ Benefits â†’ Footer

### Data Flow
User filter â†’ `FilterPanel` dispatches `setFilterValue` â†’ `filtersSlice` â†’ `selectFilteredWheels` recomputes â†’ `ComparisonTable` re-renders
