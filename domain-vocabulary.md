# MyBikeLab — Domain Vocabulary

Canonical definitions for terms used across evolutions. Updated whenever an ambiguous term is resolved during Needs Assessment.

---

## Design System — Surfaces

| Term | Definition |
|---|---|
| `paper-0` | Elevated surface token. Used for cards and panels that sit above the page background. Lighter than `paper-1`. |
| `paper-1` | Page background surface token. The base layer of the page. Applied to `--bg-page` and inherited by all full-page sections (Hero, etc.) unless explicitly overridden. |
| `paper-2` | Recessed surface token. Used for wells that appear inset below the page level (table headers, filter wells). |
| `--bg-page` | CSS custom property set to `paper-1`. The authoritative page background. |
| `--bg-elevated` | CSS custom property set to `paper-0`. Used by card-level components. |

---

## Design System — Radii

| Term | Definition |
|---|---|
| `radius-xs` | 2px border radius. Applied to inputs and buttons. The default corner for interactive UI elements. |
| `radius-pill` | 999px border radius (fully rounded). Reserved exclusively for **status pill badges**. Must not be used for filter pills, decorative badges, or icon buttons. |
| Status pill / status badge | A pill-shaped badge that communicates a binary or categorical status (e.g., Hookless vs. Hooked on a wheel). The only element type that legitimately uses `radius-pill`. |
| Filter pill | A rounded button-like element representing an active filter selection in multi-select mode. Uses `radius-xs`, not `radius-pill`. |

---

## Design System — Navbar

| Term | Definition |
|---|---|
| Navbar surface | `paper-1` at 88% opacity (`rgba(246,244,239,0.88)`) with 8px backdrop blur. This is the canonical Navbar background. |

---

## Design System — Backgrounds & Patterns

| Term | Definition |
|---|---|
| Schematic grid | The single decorative background pattern in the design system. A 32 px ruled grid rendered in `ink-2` via CSS `background-image: linear-gradient(...)`. Used exclusively on the Hero section. Evokes drafting paper / engineering blueprint. Must not appear on any other section. |

---

## Design System — Typographic Glyphs

| Term | Definition |
|---|---|
| Typographic glyphs | Unicode characters (`→`, `↓`, `↑`, `·`, `№`, `Ø`, `±`, `≈`) used in place of icon components in compact or data-dense UI contexts. Rendered in Inter (full coverage confirmed). |
| `→` (CTA arrow) | Trailing directional glyph appended to primary CTA link text (e.g., "Open comparator →"). Signals navigation intent. Applied at the component level, not in data. |
| `Ø` (diameter prefix) | Diameter symbol. Applied as a prefix to wheel diameter values only (e.g., `Ø 700C`). Must **not** be used for rim depth, which is a linear measurement rendered as `33 mm`. |
