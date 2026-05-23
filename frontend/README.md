# MyBikeLab — Frontend

React 19 + Vite application. See [MyBikeLab/README.md](../README.md) for architecture overview and conventions.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |

## Structure

| Path | Role |
| --- | --- |
| `src/config/wheelProperties.jsx` | Central registry — source of truth for all wheel properties (filters, sorts, columns) |
| `src/data/wheelsData.js` | Static wheel dataset (~15 items) |
| `src/store/slices/filtersSlice.js` | Filter + sort global state (keyed by registry property IDs) |
| `src/store/slices/wheelsSlice.js` | Wheel data state |
| `src/store/selectors/wheelsSelectors.js` | `selectFilteredWheels` — memoized, applies active filters + sort |
| `src/store/index.js` | Redux store configuration |
| `src/components/MiniComparator/` | Main feature: `MiniComparator` → `FilterPanel` + `ComparisonTable` + `ColumnSelector` |
| `src/components/` | Other UI components: Navbar, Hero, Footer, RoadmapSection, BenefitsGrid, ContactForm |
| `src/pages/Landing.jsx` | Single-page orchestrator |
| `src/index.css` | Tailwind base + shared utility classes |

## Config Files

| File | Purpose |
| --- | --- |
| `vite.config.js` | Base path set to `/MyBikeLabLP/` for GitHub Pages deployment |
| `tailwind.config.js` | Custom tokens: `brand-*` (blue), `ink-*` (neutral) |
| `eslint.config.js` | ESLint rules |

## Key Conventions

- **New wheel property** → add one entry in `wheelProperties.jsx` only; no other file to update
- **Filter types**: `range` \| `multiSelect` \| `triState` — new type requires a matcher + init in `filtersSlice`
- **Column visibility** = local state in `MiniComparator`; filter/sort = Redux global state
- **Tailwind tokens**: use `brand-*` and `ink-*`; add shared classes to `src/index.css`
