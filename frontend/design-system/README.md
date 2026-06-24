# MyBikeLab Design System

> A precision-instrument design system for **MyBikeLab** — a structured-data
> comparison platform for road cycling components, starting with road wheels.

This system replaces the generic Tailwind blue look of the current MVP with
a deliberate **lab-instrument × editorial × engineering-blueprint** aesthetic:
warm paper, deep ink, brass accent, sage neutral. **Inter** (kept from the
current codebase) for everything textual; **JetBrains Mono** for every
numeral. Square cards, hairline dividers, tabular figures.

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
| `fonts/` | Empty — fonts loaded from Google Fonts CDN (see Type Substitutions below) |
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
- **No pure black `#000000`.** Use `--ink-12` (`#0e0f0c`) as the near-black.

## Visual Foundations

### Color

- **Base palette and accent are independent, switchable axes.** **Notebook
  layout + Paper base + Brass accent** is the committed canonical default.
  - Surfaces (`pal-*`): **Paper** `#f6f4ef` warm original (default), **Mist**
    `#eef1f4` cool grey, **Porcelain** `#f3f4f6` crisp near-white.
  - Accents (`acc-*`): **Brass** `#c9a86a` (default), **Cobalt** `#7aa6cf`,
    **Oxblood** `#cc9077`, **Forest** `#7aa37b`.
  - **Candidate pairings worth revisiting** (both verified legible, kept on
    hand as alternates): **Mist + Cobalt** (cool, technical) and
    **Porcelain + Forest** (crisp, heritage green).
  A `pal-*` class redeclares the paper ramp + paper-derived bg tokens; an
  `acc-*` class redeclares the full brass ramp + accent semantic tokens.
  Accent ramps keep brass's luminance structure, so every existing brass
  usage (CTA fill, hero italic, focus ring, badges, row hover) works
  unchanged. The landing page exposes both as Tweaks and mirrors the choice
  to `localStorage` (`mbl-palette`, `mbl-accent`) so the comparator and
  detail pages inherit them.
- **Ink** is the workhorse. `ink-11` for body text, `ink-12` for headings
  and the brand mark. Never pure `#000000`.
- **Brass** (`brass-7` `#c9a86a`) is the *only* accent. Used **sparingly** —
  the primary CTA, focus rings, key numeric highlights, the live-phase
  badge. Brass on paper feels like precision instruments, brass fittings on
  a frame, vintage measurement tools.
- **Sage** (`sage-7` `#6b7361`) is a quiet secondary neutral with a green
  cast. Used for muted dividers, subtle status, and the partnership section.
- **Semantic** colors (`signal-up` desaturated green, `signal-down` burnt
  sienna) appear *only* for status — never for marketing.
- **No gradients.** No "primary-to-secondary" sweep. The system is flat-
  surfaced with hairline keylines.

### Typography

- **Inter** (kept from the existing codebase) is the universal workhorse.
  Display, UI, body, buttons, labels — all Inter, separated by **weight and
  tracking**, not by family. Big display sets at `font-weight: 800` with
  `letter-spacing: -0.045em` for that tight, considered, almost-Apple feel.
  Body sits at 400. UI labels at 500–600.
- **JetBrains Mono** is the system's signature — every numeric value in the
  product runs in mono with `font-variant-numeric: tabular-nums`. Weight,
  price, depth, percentages, indices. **All numbers tabulate.**
- **All-caps micro labels** with `0.18em` letter-spacing are the consistent
  device for column headers, eyebrows, and section indices (`01 / 03 ·
  COMPARATOR`).
- **Marginalia** — small italic Inter — for footnotes, captions, and
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

- **Plain paper** by default.
- **Schematic grid** (16-px or 32-px ruled grid in `ink-2`) is the *one*
  decorative background, used on the hero only. Evokes drafting paper /
  engineering blueprint.
- **No textures, no images, no noise overlays.**

### Layout

- **Square cards, hairline borders.** `border: 1px solid ink-4`. No drop
  shadows on cards. Radius is `0` for cards/panels/tables; `2px` for
  inputs/buttons; `999px` for pill badges only.
- **Keylines do the work.** A `1px solid ink-10` underline beneath headings
  reads as a section break. Table headers get the same treatment.
- **Max page width** `1280px`. Comfortable, not narrow. Generous gutters
  (`24px` default).
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

- **Hover.** Borders darken from `ink-4` → `ink-10`; row backgrounds tint
  to `brass-1` (a barely-perceptible warm wash). Text doesn't shift.
- **Press.** No scale shrink. Background steps one tone darker.
- **Focus.** 2px `brass-8` outline at 2px offset — visible on the warm
  paper without competing with content.
- **Disabled.** `opacity: 0.4`, `cursor: not-allowed`. Never `display:
  none`.
- **Selection.** Brass-5 background, ink-12 text.

### Borders, shadows, transparency

- **Borders.** Always 1px hairline. `ink-4` default, `ink-10` strong.
  Borders communicate hierarchy more than fills do.
- **Shadows.** Almost never. Permitted only for floating menus
  (`shadow-menu` — a 1px ink keyline + 24px soft drop, used on `<select>`
  popovers and the column-selector menu). Never on cards.
- **Transparency / blur.** Only on the sticky navbar
  (`background: rgba(246,244,239,0.88); backdrop-filter: blur(8px)`).
  Nowhere else.

### Cards

A MyBikeLab card is **square, paper-0 fill, hairline ink-4 border, no
shadow, generous padding (`24px`)**. There are three flavors:

1. **Hairline card** — the default panel. Used for filter wells, partnership
   tiles, content blocks.
2. **Keyline card** — no border, just a `1px solid ink-10` top rule and
   editorial serif headline. Used for roadmap phases and editorial blocks.
3. **Ink-inverse card** — `ink-12` background, paper-1 text. Used for the
   partnership / contact section to break visual rhythm without using color.

---

## Iconography

**System: Lucide-style line icons**, drawn at 24px box with `stroke-width:
1.4`, `stroke-linecap: square`, and `stroke-linejoin: miter`. Square caps
and miter joins are deliberate — they read as drafting / technical, not
friendly-rounded.

**Source.** The codebase does **not** ship its own icon library — components
inline single-purpose SVGs as needed (hamburger, chevron, check). We
**substitute Lucide** (`https://unpkg.com/lucide@latest`) as the canonical
icon set, matching the technical stroke style. **⚠️ This is a substitution
flagged for the user** — if the team has an opinion (e.g. they'd rather use
Phosphor or Tabler), swap once and the system inherits.

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
| Display & UI | **Inter** | Google Fonts CDN | Kept from the existing codebase — unified family across display, body, labels. |
| Numerals | **JetBrains Mono** | Google Fonts CDN | All numeric values, code-like UI, technical readouts. |

**Notes for the user:**

- The codebase already uses **Inter** — we've kept it. Display headlines
  use the same family at heaviest weights (`800`) with very tight tracking,
  which gives the precision feel without introducing a second family.
- **JetBrains Mono is new** — added because every numeric value in the
  product (weights, prices, dimensions) reads as tabular data. If you'd
  rather use Inter's tabular figures across the board, set `--font-mono`
  to Inter in `colors_and_type.css` and add `font-feature-settings: 'tnum'`.
- Both load from Google Fonts via `@import`. Self-hosted woff2 can be
  bundled into `fonts/` if performance or CSP requires — flag and we'll do it.

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
