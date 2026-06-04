# MyBikeLab — Domain Vocabulary

Canonical definitions for terms used across evolutions. Updated whenever an ambiguous term is resolved during Needs Assessment.

---

## Catalog Model

| Term | Definition |
|---|---|
| Wheelset (paire) | The fundamental catalog unit. One catalog entry represents a **front + rear pair sold together**, not an individual wheel. Per-wheel attributes are sub-values of a single wheelset entry. (Resolved EVO-038.) |
| Divergent spec (av./arr.) | A numeric spec whose **front value may differ from its rear value** within the same wheelset (e.g. aero combos with front 50 mm / rear 60 mm rim depth, or differing per-wheel weights). Specs eligible for divergence: rim depth, external width, internal width, weight. When front = rear (the common case), the spec carries a single value. (Resolved EVO-038.) |
| Weight (paire) | Always expressed as the **pair total (sum)** for filtering and primary display. The per-wheel front/rear breakdown is shown as detail *when available*, but is never the filtered value. Distinct from dimensional divergent specs. (Resolved EVO-038.) |
| Product variant | A documented purchasable configuration of a wheelset model family that should be compared as its own row/card when it differs on a comparable axis such as spoke material, rim width, or brake type. Variants must not be inferred from undocumented option combinations. (Resolved EVO-044.) |
| Model family | A group of related wheelset product variants that share the same commercial model identity. The comparator may show each variant as a separate row/card while visually indicating their shared model family. (Resolved EVO-044.) |

---

## Data Conventions

| Term | Definition |
|---|---|
| Categorical value casing | Categorical data values (e.g. `disc_standard`, `freehub_options`) use **Title Case** as their canonical form: `Center Lock`, `Shimano HG`, `SRAM XDR`, `Campagnolo N3W`. Casing variants (`centerlock`, `center lock`) are non-canonical and must be normalized on ingestion, otherwise they produce duplicate filter options. Current catalog (Roval, Zipp, DT Swiss/Fulcrum, Mavic, ENVE) already conforms. (Resolved fix-013.) |

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
