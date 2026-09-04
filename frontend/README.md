# MyBikeLab â€” Frontend

React 19 + Vite application. See [MyBikeLab/README.md](../README.md) for architecture overview and conventions.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm test` | Vitest summary |
| `npm run test:full` | Full Vitest output |
| `npm run test:e2e` | Chromium Playwright suite, with Vite started automatically |
| `npm run test:e2e:install` | Install the Chromium browser used by Playwright |
| `npm run preview` | Preview production build locally |

## Structure

| Path | Role |
| --- | --- |
| `src/domain/` | Product rules and reusable business logic |
| `src/domain/wheelProperties.js` | Domain registry â€” property metadata, accessors, filters and sorts; independent from UI rendering |
| `src/application/` | Application read APIs coordinating domain rules and catalog data |
| `src/ui/components/MiniComparator/wheelPropertyColumns.jsx` | UI adapter â€” React cell renderers, presentation classes and column composition |
| `src/ui/` | React UI, browser entry points, assets, styles and UI utilities |
| `src/ui/components/` | React components, including the comparator |
| `src/ui/pages/` | Page-level UI composition |
| `src/ui/hooks/` | Reusable React hooks |
| `src/ui/styles/` | Global styles, design tokens and fonts |
| `src/data/wheelsData.js` | Static wheel dataset (~15 items) |
| `src/data/` | Static catalog data and validation |
| `src/store/slices/filtersSlice.js` | Filter + sort global state (keyed by registry property IDs) |
| `src/store/slices/wheelsSlice.js` | Wheel data state |
| `src/store/selectors/wheelsSelectors.js` | `selectFilteredWheels` â€” memoized, applies active filters + sort |
| `src/application/catalogStats.js` | Narrow read API for landing-page catalog statistics |
| `src/store/index.js` | Redux store configuration |
| `src/ui/components/MiniComparator/` | Main feature: `MiniComparator` â†’ `FilterPanel` + `ComparisonTable` + `ColumnSelector` |
| `src/ui/components/` | Other UI components: Navbar, Hero, Footer, RoadmapSection, BenefitsGrid, ContactForm |
| `src/ui/pages/Landing.jsx` | Single-page orchestrator |
| `src/ui/styles/index.css` | Tailwind base + shared utility classes |
| `src/ui/styles/design-tokens.css` | Production design tokens and shared visual primitives |
| `TASTE-PROFILE.md` | Consolidated visual guidance for UI work |
| `prototypes/` | Retained unintegrated UI prototypes |

## Config Files

| File | Purpose |
| --- | --- |
| `vite.config.js` | Base path set to `/MyBikeLabLP/` for GitHub Pages deployment |
| `tailwind.config.js` | Custom tokens: `brand-*` (blue), `ink-*` (neutral) |
| `eslint.config.js` | ESLint rules |

## Key Conventions

- **New wheel property** â†’ add its domain definition to `domain/wheelProperties.js`; add a custom presentation entry to `ui/components/MiniComparator/wheelPropertyColumns.jsx` only when the default column rendering is insufficient
- **UI/domain boundary** â†’ filters, sorts and selectors consume `domain/wheelProperties.js`; comparator column components consume the UI adapter
- **Filter types**: `range` \| `multiSelect` \| `triState` â€” new type requires a matcher + init in `filtersSlice`
- **Column visibility** = local state in `MiniComparator`; filter/sort = Redux global state
- **Design tokens**: use `src/ui/styles/design-tokens.css`; add shared classes to `src/ui/styles/index.css`. Consult `TASTE-PROFILE.md` for visual direction.
- **Browser translation policy**: English remains browser-translatable; non-English locales synchronize the document `lang` and protect the application with the document translation markers in `src/ui/lib/documentLanguage.js`
