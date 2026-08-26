# MyBikeLab Design System

> A precision-instrument design system for **MyBikeLab** — a structured-data
> comparison platform for road cycling components, starting with road wheels.

This system replaces the generic Tailwind blue look of the current MVP with
the validated Wave 5 **lab-instrument × editorial × engineering** direction:
cool technical light surfaces, deep ink, a restrained blue accent.
**Schibsted Grotesk** carries the interface; **Fragment Mono** carries every
measured value. Rounded panels, controlled shadows, hairline dividers and
tabular figures.

## Sources

- **Codebase** &nbsp;`https://github.com/FlavienDrouot/MyBikeLabLP` (main)
  - Imported under `frontend/` — components, Tailwind config, wheel data
  - Existing tokens: `frontend/tailwind.config.js` (`brand-*` blue scale, `ink-*` slate)
  - Hub component: `frontend/src/components/MiniComparator/`
  - Property registry: `frontend/src/config/wheelProperties.jsx`
- **Product spec** &nbsp;`product-overview.md` (also at repo root)
- **No Figma file provided** — visual direction inferred from product brief
  and confirmed via questionnaire (mood swatch #2 + technical/blueprint/minimal)

## Index

| File | Role |
|---|---|
| `README.md` | This file. Product context, content & visual foundations, iconography |
| `colors_and_type.css` | Token source of truth — colors, type, spacing, motion |
| `IMPLEMENTATION-GUIDE.md` | **Read this before implementing any new UI component.** Token usage rules, component checklist, ui_kit mapping protocol |
| `SKILL.md` | Cross-compatible skill manifest |
| `assets/` | Logos, wheel schematic, favicon, raw imported SVGs |
| `frontend/src/assets/fonts/` | Bundled Schibsted Grotesk and Fragment Mono files used by production |
| `preview/` | Atomic design-system specimen cards (rendered in Design System tab) |
| `ui_kits/landing/` | Marketing landing page recreation with 3 direction tweaks |
| `ui_kits/comparator/` | Wheel comparator surface (filter panel + spec table) |
| `ui_kits/wheel-detail/` | Single-wheel spec sheet |
| `frontend/` | Imported source from the live codebase (read-only reference) |

> **Implementing a new UI design?** Start with [`IMPLEMENTATION-GUIDE.md`](IMPLEMENTATION-GUIDE.md) — it contains the token usage rules, component checklist, and ui_kit-to-production mapping protocol to apply before writing any production code.

---

## Product Context

MyBikeLab helps technically-curious road cyclists make better component
purchasing decisions through **structured, comparable data**. The MVP is a
single-page landing site with one interactive feature: the **wheel
comparator** — 15 wheels, 13 filter axes, sortable columns, side-by-side.

**Roadmap.** Phase 1 (Components Comparison, current) → Phase 2 (Impact
Simulator) → Phase 3 (Full Bike Configurator). Affiliate links + brand
partnerships power the business.

**Audience.** International, English-speaking road cyclists who care about
grams, watts, and rim depth. The brand should speak their language without
shouting.

---

## Content Fundamentals

### Voice

**Neutral, technical, slightly nerdy.** Wirecutter-meets-DPReview, not
energy-drink ad. The product is the data; the copy stays out of its way.

- **First person** is rare. The platform talks about *the data*, not about
  itself.
- **Second person** ("you") used only on CTAs and direct invitations.
- **No marketing fluff.** No "revolutionary," "blazingly fast," "game-changer."
- **Specifics over adjectives.** Prefer `1,225 g` over "lightweight." Prefer
  `33 mm rim depth, hooked` over "fast-feeling."
- **Confidence without superlatives.** "Wheels, measured." not "The world's
  best wheel comparison."
- **Honest about limits.** When data is indicative, say so in plain italic
  annotation: *indicative price, sourced 2025-Q2.*

### Casing & punctuation

- **Sentence case** for body, lead paragraphs, headings, button labels:
  "Try the comparator", not "Try The Comparator".
- **ALL CAPS** with `0.18em` letter-spacing for **micro labels only** —
  eyebrows, table column headers, axis labels. Never for headlines.
- **Em dash** (—) for editorial pauses. Not hyphens.
- **No oxford comma** in tight UI lists; oxford in editorial copy.
- **Numerals are always digits** — `15 wheels`, `13 axes`, not "fifteen."
- **Units** are spaced and lowercase — `1,225 g`, `33 mm`, `€1,299`,
  `45 km/h`. Currency before the number (€/$) per common UI convention.
- **Decimals** use a period; thousands use comma — `1,225` (English locale).

### Examples

Good (in voice):

> Wheels, measured. Not marketed.
>
> Filter 15 road wheels across 13 specification axes. Sort by weight, price,
> or rim depth. See the cheapest known retailer for each model.
>
> *indicative price, sourced 2025-Q2*

Off-voice (avoid):

> 🚴 The ULTIMATE wheel comparison tool! Find your perfect ride with our
> AI-powered recommendations. ⚡ Lightning fast. ✨ Beautiful design.

### Emoji & informal devices

- **No emoji.** Anywhere. The brand uses **typographic devices**
  (`→` `·` `—` `№` `Ø`) and **caps labels** instead.
- **Unicode for technical glyphs** is encouraged: `Ø33 mm`, `№ 02`, `±2 g`,
  `≈45 km/h`.
- **No exclamation marks** in product surfaces. Period.

---

## Editorial & UI Rules

These are hard constraints. They keep the brand from drifting into generic
AI-template territory. Apply them to every product surface.

### Punctuation

- **No em-dash (—) in prose.** Banned in body copy, headings, captions,
  leads, buttons, labels, eyebrows, quotes, attribution, alt text. Use a
  period, comma, colon, line break, or parentheses instead.
- **No en-dash (–) as a text separator** either.
- **The only dash permitted in prose is the hyphen** (`-`), for compound
  words and numeric ranges (`25-28c`, `1,200-1,620 g`).
- **Exception, non-prose UI:** a dash may act as a *visual* separator in
  range displays, table-cell separators, or counter displays, where it is a
  graphic element, not punctuation. Even there we standardize on the hyphen
  for numeric ranges to avoid ambiguity.

### UI patterns

- **No section-index labels.** No `01 / 03`, `№ 02`, `Step 01/02`,
  `Phase 01/02/03`. Name the section with a verb-noun eyebrow instead
  (`Compare road wheels`, `Roadmap`, `Partnerships`). Use the `.t-eyebrow`
  token. (A row-number column in a data table is a *counter display* and is
  fine.)
- **No version labels on marketing surfaces** (`v1.4.2`, `BETA`,
  `Build 0048`, `MVP v0.1`). Data-provenance stamps like `2025-Q2` are fine,
  they describe the dataset, not a build.
- **No div-based fake UI in hero sections** (fake task lists, terminals,
  dashboards). Real product stats and schematic illustrations are fine.
- **No vertical / rotated decorative text.**
- **No scroll cues** (`Scroll`, `↓ scroll`, animated mouse-wheel icons).
- **No decorative colored status dots.** A colored dot is permitted *only*
  for real semantic state: stock availability, server status, live/offline.

### Visual

- **No neon or outer glows.** Use inner borders or tinted shadows.
- **No gradient text** on large headers.
- **No custom mouse cursors.**
- **No pure black `#000000`.** Use the Wave 5 primary ink token.

## Visual Foundations

### Color

- **Wave 5 Light is the current canonical surface.** The semantic token layer
  maps the reference values directly: page `#f4f7fa`, panel `#ffffff`, soft
  panel `#f8fafc`, recessed well `#edf2f7`, table header `#e7edf4`, primary
  ink `#101722`, secondary ink `#4d5b6d`, muted ink `#718096`, default line
  `#d8e1eb`, subtle line `#e8edf3`, accent `#2f64a9`, accent wash `#edf4fb`.
- Use `--surface-*`, `--content-*`, `--border-*`, `--accent*` and
  `--shadow-*` in new production code. The old `paper-*`, `ink-*` and
  `brass-*` names remain aliases while sections are migrated sequentially.
- Status colors remain separate from the visual accent and must not be used as
  decoration. No gradients, textures or noise overlays.

### Typography

- **Schibsted Grotesk** is the universal workhorse. Display, UI, body, buttons
  and labels are separated by weight and tracking. Body sits at 400. UI labels
  sit at 500–600.
- **Fragment Mono** is the system's signature. Every numeric value in the
  product runs in mono with `font-variant-numeric: tabular-nums`: weight,
  price, depth, percentages and indices.
- **All-caps micro labels** with `0.18em` letter-spacing are the consistent
  device for column headers, eyebrows, and section indices (`01 / 03 ·
  COMPARATOR`).
- **Marginalia** uses small italic Schibsted Grotesk for footnotes, captions and
  disclaimer text. A lab-notebook detail without needing a second family.

### Imagery

- **Almost none.** Type and data carry the system. When imagery is needed,
  it's **schematic** — single-stroke line drawings of wheels, hubs, frames,
  rendered in `currentColor` so they pick up the surrounding type color.
- **No photography in the MVP.** When a wheel image is needed, use the
  technical schematic in `assets/wheel-schematic.svg`.
- **No stock photography. No riders in action.** Possibly later — kept off
  by default.

### Backgrounds & patterns

- **Continuous cool light surface** by default. Wave 5 removed the former
  hero grid.
- **Exact cycling object outlines** from `explorations/wave-5/background-refinement/assets/`
  are the shared decorative vocabulary. They stay low contrast and sit behind
  content. No textures, no noise overlays, no stock photography.

### Layout

- **Rounded panels, hairline borders.** Panels use `border: 1px solid
  var(--border-default)`, `var(--radius-panel)` and `var(--shadow-surface)`.
  Inputs use `var(--radius-input)`, buttons use `var(--radius-button)` and
  status controls use `var(--radius-pill)`.
- **Keylines do the work.** A `1px solid ink-10` underline beneath headings
  reads as a section break. Table headers get the same treatment.
- **Max page width** `1360px`. Comfortable, not narrow. Gutters use
  `clamp(20px, 3.5vw, 52px)`.
- **The grid is 8px**, but spacing tokens cascade in 4px increments.

### Motion

- **Restrained.** The product is a precision instrument; it doesn't bounce.
- **Durations:** 80ms instant, 140ms quick, 220ms base, 400ms slow.
- **Easing:** `cubic-bezier(0.2, 0, 0, 1)` — sharp out, no spring.
- **Allowed:** color/border transitions on hover, opacity fades, panel
  slide-ins (200ms), filter chip tap (instant).
- **Disallowed:** bounces, springs, sequenced "stagger" entrances on body
  copy, parallax.

### States

- **Hover.** Borders darken from `--border-default` to `--border-strong`;
  row backgrounds tint to `--accent-wash`. Text does not shift.
- **Press.** No scale shrink. Background steps one tone darker.
- **Focus.** 2px `--border-focus` outline at 2px offset, with
  `--shadow-focus` available for form controls.
- **Disabled.** `opacity: 0.4`, `cursor: not-allowed`. Never `display:
  none`.
- **Selection.** `--accent-wash` background, primary ink text.

### Borders, shadows, transparency

- **Borders.** Always 1px hairline. `--border-default` is the default and
  `--border-strong` is the keyline.
- **Shadows.** Panels use the restrained Wave 5 `--shadow-surface`; raised
  controls and menus use `--shadow-raised` or `--shadow-menu`.
- **Transparency / blur.** The sticky navbar uses `--header` with backdrop
  blur. Surface translucency is limited to Wave 5 panels.

### Cards

A MyBikeLab card is a **panel fill, hairline border, controlled shadow and
generous padding (`24px`)**. There are three flavors:

1. **Surface card** — the default panel. Used for filter wells, partnership
   tiles and content blocks.
2. **Keyline card** — no border, just a `1px solid var(--border-strong)` top
   rule and a strong grotesk headline. Used for roadmap phases and editorial
   blocks.
3. **Ink-inverse card** — primary ink background, page text. Used for the
   partnership / contact section to break visual rhythm without using color.

---

## Iconography

**System: Lucide-style line icons**, drawn at 24px box with `stroke-width:
1.4`, `stroke-linecap: square`, and `stroke-linejoin: miter`. Square caps
and miter joins are deliberate — they read as drafting / technical, not
friendly-rounded.

**Source.** Production uses the installed `lucide-react` package as the
canonical icon set, matching the technical stroke style.

**Usage rules.**

- Color icons via `color: currentColor` and `stroke: currentColor`. Never
  hardcode hex.
- 14px in dense UI (table action buttons, chips), 16px standard (nav, input
  affixes), 20px in primary CTAs.
- **Never paired with emoji.** No 🚴 anywhere.
- **Brand icons** (X, GitHub, etc., if needed in footer) come from
  Lucide-Static or their official SVG — preserve their brand stroke
  conventions.
- **Wheel/component illustrations** are *not icons* — they're schematics in
  `assets/wheel-schematic.svg` and similar.

**Typographic glyphs preferred over icons** for compact UI: `→` for
"go to", `↓ / ↑` for delta direction, `·` as a separator, `№` for index,
`Ø` for diameter.

---

## Type & Font Substitutions

| Role | Font | Source | Notes |
|---|---|---|---|
| Display & UI | **Schibsted Grotesk** | Bundled woff2 | Wave 5 interface, display, body and labels. |
| Numerals | **Fragment Mono** | Bundled woff2 | All numeric values, code-like UI and technical readouts. |

**Notes for the user:**

- **Schibsted Grotesk** and **Fragment Mono** are bundled in
  `frontend/src/assets/fonts/`, keeping the production font policy
  self-contained and compatible with the existing CSP.

---

## Next: UI Kits

The following surfaces have been rebuilt against this system:

- `ui_kits/landing/index.html` — full marketing page. Includes a **Tweaks
  panel** to switch between three direction treatments: *Notebook*
  (editorial), *Blueprint* (schematic grid), *Instrument* (Bloomberg-dense).
- `ui_kits/comparator/index.html` — the wheel comparator tool, redesigned
  as a spec-sheet-precise lab table.
- `ui_kits/wheel-detail/index.html` — single-wheel detail page, treating
  one wheelset like a vintage technical drawing.

Each UI kit's folder contains its own `README.md`, an `index.html`
walkthrough, and modular JSX components.
