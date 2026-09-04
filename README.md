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
| `frontend/TASTE-PROFILE.md` | Consolidated visual guidance for future UI work | `frontend/TASTE-PROFILE.md` |
| `frontend/prototypes/` | Retained unintegrated UI prototypes | `frontend/prototypes/wave-3-product-detail/` |
| `.github/workflows/deploy.yml` | Pipeline CI/CD â€” dÃ©ploiement GitHub Pages | â€” |

## Architecture Summary

### Stack
- React 19 + Vite (base path: `/MyBikeLabLP/`) + Redux Toolkit + Tailwind CSS 3
- Frontend-only MVP (no backend)

### Entry Points
- `frontend/index.html` â†’ `src/main.jsx` (Redux Provider) â†’ `App.jsx` â†’ `pages/Landing.jsx`

### Core Modules
- `src/config/wheelProperties.js` â†’ **Domain registry**: source of truth for wheel property IDs, metadata, accessors, filters and sorts. It stays independent from UI rendering.
- `src/config/wheelPropertyColumns.jsx` â†’ **UI adapter**: composes the domain registry with React cell renderers, presentation classes and column behavior.
- `src/store/slices/filtersSlice.js` â†’ filter + sort global state (keyed by registry property IDs)
- `src/store/selectors/wheelsSelectors.js` â†’ `selectFilteredWheels` (memoized, applies active filters + sort)
- `src/services/catalogStats.js` â†’ narrow domain read API used by landing-page statistics
- `src/data/wheelsData.js` â†’ static wheel dataset (~15 items; future: async Redux thunk)
- `src/components/MiniComparator/` â†’ main feature: `FilterPanel` + `ComparisonTable` + `ColumnSelector`
- `src/pages/Landing.jsx` â†’ single page orchestrator: Navbar â†’ Hero â†’ MiniComparator â†’ Roadmap â†’ Benefits â†’ Footer

### Data Flow
UI â†’ domain registry/selectors/services â†’ catalog data. For example: `FilterPanel` dispatches `setFilterValue` â†’ `filtersSlice` â†’ `selectFilteredWheels` recomputes â†’ `ComparisonTable` re-renders. Column presentation is added at the UI boundary by `wheelPropertyColumns.jsx`.
