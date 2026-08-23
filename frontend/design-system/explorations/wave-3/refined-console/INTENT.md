# Refined console - wave 3

The retained wave-2 direction (light premium console) refined per arbitration
and extended to all three public surfaces, with light/dark theming.

## Files

| File | Role |
|---|---|
| `_system.css` | Shared design core: dual-theme tokens + all shared components |
| `landing.html` | Refined landing (winner + arbitration fixes) |
| `comparator.html` | Comparator workbench: filter sidebar + 10 real wheels |
| `detail.html` | Wheel spec sheet: Zipp 202 NSW, real data |

## Arbitration fixes applied (from wave 2)

- Wordmark without trailing dot (header + giant footer mark).
- Existing logo mark reused: stroke-based registration-frame M inlined as
  `currentColor` SVG, adapts to both themes.
- Header more discreet: lower-opacity backdrop, transparent border until
  scroll.
- Gray monotony broken through legitimate rhythm: gray hero, paper band for
  comparator, gray benefits, paper band for roadmap, deep-ink partnership
  band, ghost wordmark footer.
- Benefits rebuilt from three equal cards into keyline rows plus an
  informative annotated schematic ("what we measure": diameter, spokes, hub
  engagement, weight, rim section with depths/widths/hookless bead).

## Theming

- Light: cool neutral base `#EEF1F4`, white panels `#FFFFFF`, recessed wells,
  steel-blue accent `#35618F` reserved for live/active states.
- Dark: VS Code "Dark Modern" register - deep warm neutrals (`#191A1B` page,
  `#212223` panels, `#161718` wells), hairlines `#303236`, low chroma, soft
  steel accent `#7FA6CB`. Relief comes from surface steps and hairlines
  rather than shadows.
- Toggle: header button, persisted to `localStorage` (`mbl-theme`), applies
  before first paint on load; persists across pages.

## Tradeoffs

- Pages link `_system.css` relatively (still file://-openable); production
  mapping would inline or bundle it.
- Comparator sidebar scrolls internally (content ~1040px in ~700px viewport)
  with a thin token-colored scrollbar; groups collapse to manage density.
- Comparator table compresses paddings/type slightly vs landing table to fit
  8 columns beside the sidebar at 1280px without horizontal scroll.
- Hookless rendered as accent text (not pill) in the comparator table to save
  width; pills remain on landing/detail.
- Detail page omits a few real out-of-scope specs (700 c diameter, max system
  weight, warranty, SKU) to keep the mandated group structure.
