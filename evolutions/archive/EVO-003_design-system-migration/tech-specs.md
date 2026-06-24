# Technical Specifications

## 1. General Information

- **Evolution ID:** EVO-003
- **PRD reference:** `EVO-003_design-system-migration/prd.md`
- **Author:** Flavien Drouot
- **Date:** 2026-05-26

---

## 2. Technical Context

### Technical objective

Replace the legacy blue-on-white token vocabulary (`brand-*`, slate-based `ink-*`) with the Notebook design direction defined in `MyBikeLab/design-system/colors_and_type.css`. All color, typography, and border-radius values must be registered as named tokens in `tailwind.config.js` before use. Shared utility classes in `index.css` are the primary propagation mechanism — updating them propagates style changes to all components that use them.

### Affected architecture

- **Token layer:** `tailwind.config.js` — complete redefinition of `ink-*`; addition of `paper-*`, `brass-*`, `sage-*`, `font-mono`, `rounded-xs`
- **Shared utilities:** `src/index.css` — `body`, `btn-primary`, `btn-ghost`, `btn-outline`, `card`, `section-title`, `section-subtitle`
- **Component layer:** 11 component files across Navbar, Hero, MiniComparator, and all landing sections
- **CSS module:** `FilterPanel.module.css` — raw hex values for range slider pseudo-elements

### Impacted modules

- `tailwind.config.js`
- `src/index.css`
- `src/pages/Landing.jsx` — no changes required (composition only)
- `src/components/Navbar.jsx`
- `src/components/Hero.jsx`
- `src/components/MiniComparator/MiniComparator.jsx`
- `src/components/MiniComparator/FilterPanel.jsx`
- `src/components/MiniComparator/FilterPanel.module.css`
- `src/components/MiniComparator/ComparisonTable.jsx`
- `src/components/MiniComparator/WheelDetailPanel.jsx`
- `src/components/MiniComparator/ColumnSelector.jsx`
- `src/components/RoadmapSection.jsx`
- `src/components/BenefitsGrid.jsx`
- `src/components/PartnershipSection.jsx`
- `src/components/ContactForm.jsx`
- `src/components/Footer.jsx`
- `MyBikeLab/evolutions/archive/EVO-002_design-token-refactoring/token-convention.md`

---

## 3. Technical Constraints

- All new values must be named tokens under `theme.extend` in `tailwind.config.js`. No arbitrary Tailwind values (`[...]` syntax) for color, typography, or border-radius.
- The three accepted layout arbitrary values from EVO-002 (`lg:grid-cols-[320px_1fr]`, `max-w-[85vw]`, `max-w-[calc(100vw-1rem)]`) remain permitted as documented exceptions.
- `src/config/wheelProperties.jsx` and `src/data/wheelsData.js` must not be modified.
- Hex values in `tailwind.config.js` must match `MyBikeLab/design-system/colors_and_type.css` exactly. Cross-reference before writing.
- `brand-*` tokens remain defined in `tailwind.config.js` (to avoid build warnings during transition) but must not appear in any component file after migration.
- JetBrains Mono must be loaded via Google Fonts CDN, not bundled.
- Focus rings on all interactive elements must use brass, not blue.
- Cards, panels, and the comparator table: `rounded-none`, `border border-ink-4`, no `box-shadow` drop shadows. `bg-white` and `shadow-sm` on card surfaces are prohibited after migration.

---

## 4. Architecture Decisions

### AD-001 — ink-* scale full replacement
#### Description
The `ink` family in `tailwind.config.js` is fully replaced: the existing slate-based steps (100, 200, 300, 400, 500, 700, 900) are removed and replaced by the new warm-neutral 12-step scale (1–12). Both families cannot coexist under the same key.
#### Motivation
The PRD mandates that the `ink-*` family is redefined — prior slate values are replaced by the new warm-neutral scale. Keeping the old steps alongside new ones would confuse the naming convention and allow stale usages to compile silently.
#### Rejected alternatives
Aliasing old steps (e.g., `ink-900: '#0e0f0c'`) to new equivalents was rejected because it hides migration gaps: stale class names would remain "valid" and escape the AC-001 audit.

---

### AD-002 — brand-* retained in tailwind.config.js, not in components
#### Description
The `brand-*` color family remains defined in `tailwind.config.js` after migration but is never used in any component file.
#### Motivation
AC-001 explicitly excludes `tailwind.config.js` from the `brand-` search. Removing `brand-*` from the config during this EVO is not required by the PRD and adds risk during transition. A future cleanup EVO will remove it after production merge.
#### Rejected alternatives
Removing `brand-*` immediately was rejected: during the transition phase, some components are migrated and others are not. Keeping the token defined prevents silent class-not-found failures for partially migrated components.

---

### AD-003 — card utility class as propagation mechanism
#### Description
The `card` utility class in `index.css` is updated once (`rounded-none border border-ink-4 bg-paper-0`) and all components using `.card` inherit the new surface style without per-file edits to their card wrapper.
#### Motivation
Six components use `card`: ComparisonTable, FilterPanel, ContactForm (×2 states), RoadmapSection, and BenefitsGrid. Centralizing the change reduces the migration surface and ensures consistency.
#### Rejected alternatives
Removing the `card` utility and inlining classes into each component was rejected: it multiplies the migration surface and risks divergence.

---

### AD-004 — JetBrains Mono loaded via @import in index.css
#### Description
The Google Fonts import for JetBrains Mono is added at the top of `src/index.css` via `@import url(...)`. The `font-mono` token is registered in `tailwind.config.js`.
#### Motivation
The existing Inter is already declared in `tailwind.config.js` `fontFamily.sans` and is assumed available. Adding the CDN import in `index.css` follows the same pattern as the design system file (`colors_and_type.css`) and keeps font configuration in the CSS layer.
#### Rejected alternatives
Adding a `<link>` in `index.html` works but splits font loading configuration across HTML and CSS, making it harder for future contributors to locate.

---

### AD-005 — Numeric cell identification via property.unit
#### Description
In `ComparisonTable.jsx`, numeric columns are identified by checking `property.unit !== undefined`. Cells for properties with a unit receive `font-mono tabular-nums`; cells without a unit (e.g., the Wheel name column) remain in Inter.
#### Motivation
`wheelProperties.jsx` cannot be modified. Checking `property.unit` is the only intrinsic signal available in the property registry without reading the config file.
#### Rejected alternatives
Applying `font-mono` to all cells globally was rejected: the brand/model name column would render in monospace, which conflicts with the editorial direction. A hardcoded list of numeric property IDs would require modifying the spec whenever the dataset changes.

---

### AD-006 — Column header micro label applied universally in ComparisonTable
#### Description
The micro label style (`text-xs font-medium uppercase tracking-widest text-ink-7`) is applied directly on the `<th>` elements in `ComparisonTable.jsx`, bypassing the `headClassFor(p)` helper. The helper is removed from header rendering.
#### Motivation
`wheelProperties.jsx` cannot be modified. The `headClassName` defined per-property may contain legacy color classes that cannot be updated. Bypassing `headClassFor` ensures the micro label style is applied universally without conflict.
#### Rejected alternatives
Merging the micro label classes with `headClassFor(p)` output was rejected: Tailwind resolves class conflicts by definition order, not usage order, making the merge unreliable when `headClassName` contains conflicting color or typography classes.

---

## 5. Task Breakdown

---

# TASK-001 — Register new token vocabulary in tailwind.config.js

## Objective

Replace the `ink-*` color family with the new 12-step warm-neutral scale and add `paper-*`, `brass-*`, `sage-*` color families, `font-mono` typography token, and `rounded-xs` border-radius token. All hex values must match `MyBikeLab/design-system/colors_and_type.css`.

## Required context

- **AD-001, AD-002:** ink redefined entirely; brand retained.
- `tailwind.config.js` currently defines `brand-*` (7 steps) and `ink-*` (7 slate steps) under `theme.extend.colors`, and `font-sans` under `fontFamily`.
- `design-system/colors_and_type.css` is the authoritative hex source. Cross-reference before writing any value.

## Potentially impacted files

- `tailwind.config.js`

## Inputs

Current `theme.extend` in `tailwind.config.js`:
```js
colors: {
  brand: { 50, 100, 200, 500, 600, 700, 900 },
  ink: { 100, 200, 300, 400, 500, 700, 900 }  // slate-based, to be replaced
},
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
}
```

## Expected outputs

```js
theme: {
  extend: {
    colors: {
      brand: {
        // RETIRED — kept to avoid build warnings; do not use in components
        50:  '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        900: '#0b1d3a',
      },
      paper: {
        0: '#fbfaf6',
        1: '#f6f4ef',
        2: '#efebe2',
        3: '#e6e0d2',
      },
      ink: {
        1:  '#efede2',
        2:  '#e4e2d6',
        3:  '#d6d4c7',
        4:  '#c2c0b3',
        5:  '#a7a69b',
        6:  '#8a8980',
        7:  '#6e6d65',
        8:  '#555550',
        9:  '#3a3a35',
        10: '#2a2a26',
        11: '#1a1a17',
        12: '#0e0f0c',
      },
      brass: {
        1:  '#fcf8ef',
        2:  '#f8f1e4',
        3:  '#f3ead8',
        4:  '#ecdec2',
        5:  '#e2cea4',
        6:  '#d6bb87',
        7:  '#c9a86a',
        8:  '#a88846',
        9:  '#8c6e35',
        10: '#6b5328',
        11: '#4a3a1f',
        12: '#2a2014',
      },
      sage: {
        1:  '#eef0ea',
        2:  '#e2e5dc',
        3:  '#d2d6cb',
        4:  '#bbc1b4',
        5:  '#a0a797',
        6:  '#858d7c',
        7:  '#6b7361',
        8:  '#525c54',
        9:  '#3e4742',
        10: '#2d3530',
        11: '#1f2522',
        12: '#14181a',
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'IBM Plex Mono', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
    },
    borderRadius: {
      xs: '2px',
    },
  },
}
```

## Constraints

- All hex values must be verified against `design-system/colors_and_type.css` before writing.
- The `brand-*` block must include a comment `// RETIRED — kept to avoid build warnings; do not use in components`.
- The `rounded-xs` key is added under `theme.extend.borderRadius`, not under `theme.borderRadius`, to preserve Tailwind's defaults (`rounded`, `rounded-sm`, `rounded-full`, etc.).
- Do not add `rounded-pill` — use Tailwind's built-in `rounded-full` for pill/badge elements.

## Dependencies

None. This task is the prerequisite for all others.

## Validation criteria

- [ ] `tailwind.config.js` compiles without errors after change (`npm run build` or `npm run dev`)
- [ ] `bg-paper-1`, `text-ink-11`, `bg-brass-7`, `text-brass-8`, `font-mono`, `rounded-xs` are valid Tailwind utilities (verifiable by using them in a test element and inspecting the compiled CSS)
- [ ] All hex values match `design-system/colors_and_type.css` (manual cross-reference)
- [ ] Old `ink-100` through `ink-900` are no longer generated by Tailwind

## Tests to implement

### Unit
None — this task is configuration, not logic.

### Integration
- After saving `tailwind.config.js`, run `npm run dev` and verify the dev server compiles without errors.
- Add a temporary `className="bg-paper-1 text-ink-11 font-mono rounded-xs"` to any component, inspect in browser devtools, confirm the computed styles match the expected hex values and font stack, then remove the test class.

---

# TASK-002 — Update index.css: Google Fonts import and shared utility classes

## Objective

Load JetBrains Mono via Google Fonts CDN. Update the five shared utility classes (`btn-primary`, `btn-ghost`, `btn-outline`, `card`, `body`) and two semantic helpers (`section-title`, `section-subtitle`) to use the new token vocabulary.

## Required context

- **AD-003, AD-004:** card is the propagation mechanism; JetBrains Mono loaded via @import.
- TASK-001 must be complete — these classes use `@apply` with the new tokens.
- Current `index.css` loads no external fonts; Inter is assumed available from the project.

## Potentially impacted files

- `src/index.css`

## Inputs

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { @apply bg-white text-ink-900 font-sans antialiased; }
}

@layer components {
  .btn-primary { @apply ... rounded-lg bg-brand-600 text-white shadow-sm hover:bg-brand-700 ... }
  .btn-ghost   { @apply ... rounded-lg text-ink-700 hover:text-brand-600 ... }
  .btn-outline { @apply ... rounded-lg border border-ink-300 text-ink-700 hover:border-brand-600 hover:text-brand-600 ... }
  .section-title    { @apply ... text-ink-900; }
  .section-subtitle { @apply ... text-ink-500 ... }
  .card { @apply rounded-2xl border border-ink-100 bg-white shadow-sm; }
}
```

## Expected outputs

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 5rem;
  }
  body {
    @apply bg-paper-1 text-ink-11 font-sans antialiased;
  }
}

@layer components {
  .container-page  { /* unchanged */ }
  .container-fluid { /* unchanged */ }
  .btn-primary {
    @apply inline-flex items-center justify-center rounded-xs bg-brass-7 px-5 py-2.5 text-sm font-semibold text-ink-12 hover:bg-brass-8 transition-colors;
  }
  .btn-ghost {
    @apply inline-flex items-center justify-center rounded-xs px-5 py-2.5 text-sm font-semibold text-ink-11 hover:text-brass-8 transition-colors;
  }
  .btn-outline {
    @apply inline-flex items-center justify-center rounded-xs border border-ink-4 px-5 py-2.5 text-sm font-semibold text-ink-11 hover:border-brass-8 hover:text-brass-8 transition-colors;
  }
  .section       { /* unchanged */ }
  .section-title {
    @apply text-3xl sm:text-4xl font-bold tracking-tight text-ink-10;
  }
  .section-subtitle {
    @apply mt-3 text-lg text-ink-8 max-w-2xl;
  }
  .card {
    @apply rounded-none border border-ink-4 bg-paper-0;
  }
}
```

## Constraints

- The `@import` line must appear before `@tailwind base` — CSS imports must precede other rules.
- `shadow-sm` is removed from `btn-primary` and `card`. No drop shadows on cards or primary CTA.
- `rounded-lg` → `rounded-xs` on all three button utilities (2px radius per FR-005).
- `rounded-2xl` → `rounded-none` on `card` (square corners per FR-005).
- `bg-white` → `bg-paper-0` on `card` (no `bg-white` permitted per FR-002).
- The `font-mono` class (from TASK-001) is now available but not applied to shared utilities — it is applied per-component where numeric data appears.

## Dependencies

- TASK-001 (tokens must be registered before `@apply` references them)

## Validation criteria

- [ ] `@import url(...)` appears as the first line, before `@tailwind base`
- [ ] `body` background resolves to `#f6f4ef` (paper-1) in browser devtools
- [ ] `btn-primary` renders with brass fill (`#c9a86a`) and dark ink text (`#0e0f0c`)
- [ ] `btn-primary` has no visible drop shadow
- [ ] `card` has square corners, `1px solid #c2c0b3` border, `#fbfaf6` background, no shadow
- [ ] JetBrains Mono appears in the browser's Fonts panel (network tab should show the Google Fonts request)
- [ ] No `bg-white`, `brand-*`, or old `ink-*` classes remain in this file

## Tests to implement

### Unit
None — shared utility changes propagate visually, not through logic tests.

### Integration
- `npm run dev`, open the landing page — verify: body background is warm paper, nav CTA button is brass, cards have square corners and no shadows.
- Verify JetBrains Mono is loaded via the browser Network panel (filter by "fonts").

---

# TASK-003 — Migrate Navbar.jsx

## Objective

Replace all `brand-*` and legacy `ink-*` references in `Navbar.jsx` with Notebook palette tokens. Apply brass to the logo mark and hover states. Apply paper backgrounds to the nav bar and mobile menu drawer.

## Required context

- TASK-001 (tokens) and TASK-002 (shared utilities including `btn-ghost` and `btn-primary`) must be complete.
- The mobile menu drawer is a separate `<div>` rendered conditionally; it has its own `bg-white` that must be replaced.
- Nav links use the `.btn-ghost` utility class — their color is handled by TASK-002.

## Potentially impacted files

- `src/components/Navbar.jsx`

## Inputs → Expected outputs (class-level mapping)

| Element | Current classes | New classes |
|---|---|---|
| `<header>` | `border-ink-100 bg-white/80` | `border-ink-3 bg-paper-0/80` |
| Logo mark `<div>` | `rounded-lg bg-brand-600 text-white` | `rounded-xs bg-brass-7 text-ink-12` |
| Logo `<span>` inner span | `text-brand-600` | `text-brass-8` |
| Mobile burger button | `text-ink-700 hover:text-brand-600` | `text-ink-11 hover:text-brass-8` |
| Mobile menu `<div>` | `border-ink-100 bg-white` | `border-ink-3 bg-paper-0` |

## Constraints

- `btn-ghost` class on nav links is updated globally in TASK-002 — do not add inline color overrides here.
- `backdrop-blur` on the header remains unchanged.
- Mobile menu `rounded-lg` on the burger button: change to `rounded-xs`.
- Focus rings on the burger button: add `focus-visible:ring-2 focus-visible:ring-brass-8` if not already present.

## Dependencies

- TASK-001, TASK-002

## Validation criteria

- [ ] Navbar bar background is warm paper (not white)
- [ ] Logo mark is brass, not blue
- [ ] "Bike" text in the logo is brass-8 colored
- [ ] Mobile menu drawer opens with paper-0 background
- [ ] Hover state on the burger icon button is brass-8
- [ ] No `brand-*` or `bg-white` remains in this file

## Tests to implement

### Unit
None.

### Integration
- Visual inspection at desktop and mobile viewports.
- Tab to each nav element and verify brass focus ring.

---

# TASK-004 — Migrate Hero.jsx

## Objective

Replace the blue-gradient hero background with `paper-0`. Migrate the badge, heading accent, description, stat values, and CTA layout to the Notebook palette. Apply JetBrains Mono to the three numeric stat values.

## Required context

- The hero section currently uses a three-stop gradient (`from-brand-50 via-white to-white`). After migration, the section uses flat `bg-paper-0` (largest surface token, per FR-002).
- The three stat values (15+, dynamic count, 3) are displayed in `text-2xl font-bold text-brand-600`. After migration they render in JetBrains Mono with brass accent (tabular-nums, brass-8).
- `btn-primary` and `btn-outline` classes are handled by TASK-002.

## Potentially impacted files

- `src/components/Hero.jsx`

## Inputs → Expected outputs

| Element | Current classes | New classes |
|---|---|---|
| `<section>` | `bg-gradient-to-b from-brand-50 via-white to-white` | `bg-paper-0` |
| Badge | `border-brand-100 bg-white text-brand-700 rounded-full` | `border-brass-4 bg-paper-0 text-brass-9 rounded-full` |
| `<h1>` | `text-ink-900` | `text-ink-10` |
| `<h1>` accent `<span>` | `text-brand-600` | `text-brass-8` |
| `<p>` description | `text-ink-500` | `text-ink-8` |
| Stat value `<div>` | `text-2xl font-bold text-brand-600` | `text-2xl font-bold text-brass-8 font-mono tabular-nums` |
| Stat label `<div>` | `text-ink-500` | `text-ink-7` |

## Constraints

- The `font-mono` class is now available from TASK-001.
- `tabular-nums` is a Tailwind utility class (`font-variant-numeric: tabular-nums`) — use `tabular-nums` directly as a class.
- The CTA buttons (`btn-primary`, `btn-outline`) are not modified here; their migration is in TASK-002.
- No arbitrary values. The badge uses `rounded-full` (pill) as permitted by FR-005.

## Dependencies

- TASK-001, TASK-002

## Validation criteria

- [ ] Hero section background is warm paper-0, no blue gradient
- [ ] Badge has brass border and text, paper-0 background
- [ ] Heading "Bike Component" span is brass-8 colored
- [ ] Stat values (15+, N, 3) render in JetBrains Mono, brass color
- [ ] CTA "Try the Comparator" button is brass-filled (inherited from TASK-002)
- [ ] No `brand-*` or `bg-white` remains in this file

## Tests to implement

### Unit
None.

### Integration
- Visual inspection: confirm no blue visible in Hero, stat numbers align with JetBrains Mono tabular rendering.

---

# TASK-005 — Migrate MiniComparator.jsx

## Objective

Replace all `brand-*` and legacy `ink-*` references in the section wrapper, eyebrow label, mobile filter trigger, mobile drawer container, and mobile drawer header.

## Required context

- The section background `bg-brand-50` becomes `bg-paper-2` (recessed panel tone to differentiate the comparator section from the page background `paper-1`).
- The mobile drawer overlay (`bg-black/40`) is not a first-party color — it stays unchanged.
- The mobile drawer container has its own `bg-brand-50` that must be changed to `bg-paper-2`.

## Potentially impacted files

- `src/components/MiniComparator/MiniComparator.jsx`

## Inputs → Expected outputs

| Element | Current classes | New classes |
|---|---|---|
| `<section>` | `bg-brand-50` | `bg-paper-2` |
| Eyebrow `<span>` | `text-brand-600` | `text-brass-8` |
| Mobile filter trigger button | `border-ink-300 bg-white text-ink-700 hover:border-brand-600 hover:text-brand-600 focus:ring-brand-600 focus:ring-offset-1 rounded-lg` | `border-ink-4 bg-paper-0 text-ink-11 hover:border-brass-8 hover:text-brass-8 focus:ring-brass-8 focus:ring-offset-1 rounded-xs` |
| Mobile drawer container | `bg-brand-50` | `bg-paper-2` |
| Mobile drawer header | `border-ink-100` | `border-ink-3` |
| Drawer header title `<span>` | `text-ink-900` | `text-ink-11` |
| Drawer close button | `text-ink-500 hover:bg-ink-100 hover:text-ink-700 focus:ring-brand-600 rounded-full` | `text-ink-8 hover:bg-ink-2 hover:text-ink-11 focus:ring-brass-8 rounded-full` |
| Footer caption `<p>` | `text-ink-500` | `text-ink-7` |

## Constraints

- `section-title` and `section-subtitle` utility classes are updated in TASK-002 — they need no direct changes here.
- The mobile overlay (`bg-black/40`) is intentionally kept as-is (it is a pure utility overlay, not a design token).
- The `lg:grid-cols-[320px_1fr]` and `max-w-[85vw]` arbitrary values are accepted EVO-002 exceptions — do not change them.

## Dependencies

- TASK-001, TASK-002

## Validation criteria

- [ ] Comparator section background is warm paper-2 (recessed tone)
- [ ] "Live Demo" eyebrow is brass-8
- [ ] Mobile filter trigger button is paper-0 background, brass hover/focus
- [ ] Mobile drawer opens with paper-2 background
- [ ] Close button has brass focus ring
- [ ] No `brand-*` or `bg-white` remains in this file

## Tests to implement

### Unit
None.

### Integration
- Resize to mobile viewport (< 768px), open filter drawer, verify paper background and brass focus rings on the close button.

---

# TASK-006 — Migrate FilterPanel.jsx

## Objective

Replace all `brand-*` and legacy `ink-*` references in `FilterPanel.jsx`. Apply the Notebook palette to the toggle switch, dual range inputs, section accordion headers, pills, multiselect checkboxes, and the sort select. Apply the all-caps micro label treatment to filter axis labels and section group titles.

## Required context

- **FilterToggle:** The active state background changes from `brand-600` (blue) to `brass-7` (core brass). The inactive state changes from `ink-300` to `ink-4`.
- **Pill:** Active state changes from `bg-brand-600 text-white` to `bg-brass-7 text-ink-12`. Inactive state border changes from `ink-300` to `ink-4`, hover from `brand-600` to `brass-8`.
- **Checkboxes** (`text-brand-600 focus:ring-brand-500`): Change to `accent-brass-7 focus:ring-brass-8`. `accent-*` is a Tailwind utility for native input accent color.
- **Section group title** (accordion `<span>`, e.g., "Wheel Specs"): Currently `text-sm font-semibold text-ink-900`. Change to `text-xs font-semibold uppercase tracking-widest text-ink-7` (micro label treatment, per FR-008).
- **Filter axis labels** inside `DualRangeRow` and `MultiSelectFilter` `<span>` labels: Currently `font-medium text-ink-700`. Change to `text-xs font-medium uppercase tracking-widest text-ink-7`.
- **`FilterPanel` outer container** uses the `card` utility class — visual update inherited from TASK-002.

## Potentially impacted files

- `src/components/MiniComparator/FilterPanel.jsx`

## Inputs → Expected outputs

**FilterToggle component:**

| Element | Current | New |
|---|---|---|
| Active state | `bg-brand-600 justify-end` | `bg-brass-7 justify-end` |
| Inactive state | `bg-ink-300 justify-start` | `bg-ink-4 justify-start` |
| Focus ring | `focus:ring-brand-600 focus:ring-offset-1` | `focus:ring-brass-8 focus:ring-offset-1` |
| Thumb `<span>` | `bg-white shadow-sm` | `bg-paper-0` |

**DualRangeRow component:**

| Element | Current | New |
|---|---|---|
| Filter axis label `<span>` | `font-medium text-ink-700` | `text-xs font-medium uppercase tracking-widest text-ink-7` |
| Range value display `<span>` | `text-ink-500 tabular-nums` | `text-ink-7 tabular-nums font-mono` |
| Range separator `<span>` | `text-ink-400` | `text-ink-5` |
| Number inputs | `rounded-lg border-ink-300 focus:border-brand-600` | `rounded-xs border-ink-4 focus:border-brass-8` |

**Section accordion:**

| Element | Current | New |
|---|---|---|
| Top border | `border-ink-100` | `border-ink-3` |
| Title `<span>` | `text-sm font-semibold text-ink-900` | `text-xs font-semibold uppercase tracking-widest text-ink-7` |
| Chevron icon | `text-ink-500` | `text-ink-6` |

**Pill component:**

| State | Current | New |
|---|---|---|
| Active | `bg-brand-600 text-white border-brand-600` | `bg-brass-7 text-ink-12 border-brass-7` |
| Inactive | `bg-white text-ink-700 border-ink-300 hover:border-brand-600 hover:text-brand-600` | `bg-paper-0 text-ink-11 border-ink-4 hover:border-brass-8 hover:text-brass-8` |

**LargeMultiSelectFilter:**

| Element | Current | New |
|---|---|---|
| Active tag chips | `bg-brand-600 text-white hover:bg-brand-700` | `bg-brass-7 text-ink-12 hover:bg-brass-8` |
| Tag dismiss `<span>` | `text-brand-200` | `text-ink-12/60` |
| Search input | `rounded-lg border-ink-300 focus:border-brand-600` | `rounded-xs border-ink-4 focus:border-brass-8` |
| Option list border | `border-ink-200` | `border-ink-3` |
| Option row hover | `hover:bg-ink-100/60` | `hover:bg-ink-2/60` |
| Checkbox | `text-brand-600 focus:ring-brand-500` | `accent-brass-7 focus:ring-brass-8` |
| Muted option | `text-ink-300` | `text-ink-4` |
| Normal option | `text-ink-700` | `text-ink-11` |
| Label filter `<span>` | `font-medium text-ink-700` | `text-xs font-medium uppercase tracking-widest text-ink-7` |

**FilterPanel main:**

| Element | Current | New |
|---|---|---|
| Header title | `text-ink-900` | `text-ink-11` |
| Reset button | `text-brand-600 hover:text-brand-700` | `text-brass-8 hover:text-brass-9` |
| Sort label | `text-ink-700` | `text-ink-11` |
| Sort select | `rounded-lg border-ink-300 bg-white focus:border-brand-600` | `rounded-xs border-ink-4 bg-paper-0 focus:border-brass-8` |

**MultiSelectFilter (small variant) label:**

| Element | Current | New |
|---|---|---|
| Label `<span>` | `font-medium text-ink-700` | `text-xs font-medium uppercase tracking-widest text-ink-7` |

**TriStateFilter label:**

| Element | Current | New |
|---|---|---|
| Label `<span>` | `font-medium text-ink-700` | `text-xs font-medium uppercase tracking-widest text-ink-7` |

## Constraints

- The `card` class on FilterPanel's `<aside>` is updated globally in TASK-002 — do not override it here.
- Apply `font-mono` to the range value display (low–high values) per FR-007 context (numeric values, even outside the table).
- `accent-brass-7` is a Tailwind utility for the native checkbox/radio accent color (Tailwind v3 support). Verify it generates correctly before using; fallback if not supported is to leave checkbox accent as-is and note in spec-notes.

## Dependencies

- TASK-001, TASK-002

## Validation criteria

- [ ] Toggle switch renders brass when active, ink-4 when inactive
- [ ] Pill chips are brass when active, paper-0 border when inactive with brass hover
- [ ] All filter axis labels (Weight, Price, Brand, etc.) render as uppercase micro labels
- [ ] Accordion section titles render as uppercase micro labels
- [ ] Sort select is paper-0 background with brass focus border
- [ ] Checkboxes have brass accent color
- [ ] No `brand-*` or `bg-white` remains in this file

## Tests to implement

### Unit
None.

### Integration
- Open the comparator, activate each filter type (range, multiSelect, triState) — verify brass toggle, brass pills, brass checkboxes.
- Tab through all filter fields — verify brass focus rings.
- Test that filtering still works correctly (FR-012 non-regression).

---

# TASK-007 — Update FilterPanel.module.css: slider raw hex values

## Objective

Update the four raw hex values in `FilterPanel.module.css` to reflect the new brass/ink palette. Update the token annotation comment on each declaration.

## Required context

- This file exists because Tailwind cannot target CSS pseudo-elements (`::-webkit-slider-thumb`, `::-moz-range-thumb`). It is the sole permitted raw hex file per the EVO-002 token convention.
- Cross-reference hex values with `design-system/colors_and_type.css`:
  - **Thumb color (brass-8):** `--brass-8: #a88846`
  - **Thumb border (paper-0):** `--paper-0: #fbfaf6`
  - **Track fill (ink-4):** `--ink-4: #c2c0b3`
  - **Range fill (brass-8):** `--brass-8: #a88846`

## Potentially impacted files

- `src/components/MiniComparator/FilterPanel.module.css`

## Inputs → Expected outputs

| Declaration | Current hex | Current comment | New hex | New comment |
|---|---|---|---|---|
| `.thumb::-webkit-slider-thumb background` | `#2563eb` | `/* brand-600 */` | `#a88846` | `/* brass-8 */` |
| `.thumb::-webkit-slider-thumb border` | `white` | (none) | `#fbfaf6` | `/* paper-0 */` |
| `.thumb::-moz-range-thumb background` | `#2563eb` | `/* brand-600 */` | `#a88846` | `/* brass-8 */` |
| `.track background` | `#e2e8f0` | `/* ink-200 */` | `#c2c0b3` | `/* ink-4 */` |
| `.range background` | `#2563eb` | `/* brand-600 */` | `#a88846` | `/* brass-8 */` |

The `.thumb::-webkit-slider-thumb` currently has `border: 2px solid white` without a comment. Add `/* paper-0 */` after `#fbfaf6`. The `box-shadow` on the thumb remains unchanged (it is on the interactive thumb control, not a card surface — FR-006 does not apply).

## Constraints

- Only raw hex values and their token annotations change. No selector, property, or structural change.
- Each raw hex value must be annotated with its token equivalent comment on the same line.
- The `box-shadow` on the thumb (`0 1px 3px rgba(0,0,0,0.25)`) is an accepted exception for interactive control affordance — do not remove it.

## Dependencies

- TASK-001 (defines the new token values to reference in comments)

## Validation criteria

- [ ] Slider track renders as warm gray (ink-4)
- [ ] Slider range fill renders as brass (brass-8)
- [ ] Slider thumb renders as brass (brass-8) with paper-0 border ring
- [ ] Each hex value has a comment identifying its token equivalent
- [ ] No `#2563eb` or `#e2e8f0` remains in this file

## Tests to implement

### Unit
None.

### Integration
- Open a range filter (e.g., Weight or Price), verify the track, range fill, and thumb all render in the brass/ink palette.

---

# TASK-008 — Migrate ComparisonTable.jsx and WheelDetailPanel.jsx

## Objective

Replace all legacy color references in `ComparisonTable.jsx`. Apply JetBrains Mono with tabular numerals to numeric data cells. Apply the all-caps micro label treatment to column headers. Migrate `WheelDetailPanel.jsx` to the new palette.

## Required context

- **AD-005, AD-006:** Column headers use the universal micro label style applied directly on `<th>`; `headClassFor(p)` is no longer used for header rendering. Numeric cells are identified by `property.unit !== undefined`.
- **ComparisonTable** uses the `card` utility class (updated in TASK-002) — `rounded-none`, `border-ink-4`, `bg-paper-0`, no shadow.
- **WheelDetailPanel** uses `bg-ink-50/60` — this is an existing invalid token (ink-50 was never defined). Replace with `bg-paper-2/60`.
- **WheelDetailPanel** uses `text-[10px]` — an arbitrary font size that violates the token convention. Replace with `text-xs` (closest named Tailwind size).
- **WheelDetailPanel** prices are numeric and should render in `font-mono tabular-nums`.
- **WheelDetailPanel** "Buy →" links use `text-brand-600 hover:underline`. Replace with `text-brass-8`.

## Potentially impacted files

- `src/components/MiniComparator/ComparisonTable.jsx`
- `src/components/MiniComparator/WheelDetailPanel.jsx`

## Inputs → Expected outputs: ComparisonTable

| Element | Current classes | New classes |
|---|---|---|
| Card wrapper | `card overflow-hidden` (card updated in TASK-002) | no change needed |
| Header bar | `border-ink-100` | `border-ink-3` |
| Title `<h3>` | `text-ink-900` | `text-ink-11` |
| Count `<span>` | `text-ink-500 font-normal` | `text-ink-7 font-normal` |
| Empty state `<div>` | `text-ink-500 text-sm` | `text-ink-7 text-sm` |
| `<thead>` | `bg-ink-100/60 text-ink-700` | `bg-paper-2 text-ink-7` |
| `<th>` element | uses `headClassFor(p)` | replace with `px-4 py-3 text-xs font-medium uppercase tracking-widest text-ink-7` (hardcoded, per AD-006) |
| `<tbody>` | `divide-ink-100` | `divide-ink-3` |
| Row hover | `hover:bg-brand-50/40` | `hover:bg-paper-2` |
| Chevron `<td>` | `text-ink-400` | `text-ink-6` |

**cellClassFor modification** (for numeric font):

```jsx
const cellClassFor = (property) => {
  const base = property.column?.cellClassName ?? `px-4 py-3 text-ink-11`;
  return property.unit !== undefined ? `${base} font-mono tabular-nums` : base;
};
```

**Note:** If `property.column?.cellClassName` is explicitly set in `wheelProperties.jsx` and contains legacy `ink-*` tokens (e.g., `text-ink-700`), those will not be updated since that file cannot be modified. At implementation time, inspect the output of `getColumnProperties()` and note any `cellClassName` with legacy tokens — document them in `spec-notes.md` as a known gap.

## Inputs → Expected outputs: WheelDetailPanel

| Element | Current classes | New classes |
|---|---|---|
| Outer `<div>` background | `bg-ink-50/60` (invalid token) | `bg-paper-2/60` |
| Outer `<div>` border | `border-ink-100` | `border-ink-3` |
| "No links" text | `text-ink-400 italic` | `text-ink-6 italic` |
| Section heading `<p>` | `text-[10px] font-semibold text-ink-400 uppercase tracking-wide` | `text-xs font-medium uppercase tracking-widest text-ink-6` |
| Brand/model name `<span>` | `font-medium text-ink-900` | `font-medium text-ink-11` |
| Price `<span>` | `font-semibold text-ink-900 tabular-nums` | `font-semibold text-ink-11 font-mono tabular-nums` |
| "Buy →" link | `text-brand-600 hover:underline` | `text-brass-8 hover:underline` |
| Retailer name `<span>` | `text-ink-700` | `text-ink-11` |
| Image element | `rounded` (arbitrary radius) | `rounded-xs` |

## Constraints

- `property.unit !== undefined` check: `unit` is `undefined` if not set in the property config. Test against at least one property with and one without a unit to confirm the heuristic works.
- `text-[10px]` in WheelDetailPanel: removed, replaced by `text-xs` (Tailwind default is 0.75rem / 12px — close enough to the 10px design spec). Do not introduce a custom `text-2xs` token unless explicitly added to `tailwind.config.js` in a future EVO.
- The `rounded` class on the wheel image is changed to `rounded-xs`. An image is not a card/panel so this is a judgment call — `rounded-xs` (2px) adds a minimal softening without violating FR-005.

## Dependencies

- TASK-001, TASK-002

## Validation criteria

- [ ] Column headers render as uppercase micro labels (ink-7, tracking-widest)
- [ ] Numeric cells (Weight, Price, etc.) render in JetBrains Mono with tabular alignment
- [ ] Non-numeric cells (Wheel name) render in Inter
- [ ] Table has paper-2 header background, ink-3 dividers, paper-2 row hover
- [ ] Expanding a row shows WheelDetailPanel with paper-2/60 background and ink-3 border
- [ ] Price values in WheelDetailPanel render in JetBrains Mono
- [ ] "Buy →" links are brass-8 colored
- [ ] No `brand-*`, `bg-white`, or `bg-ink-50` remains in these files
- [ ] No `text-[10px]` remains in WheelDetailPanel

## Tests to implement

### Unit
None.

### Integration
- Open the comparator table — verify column header micro label style, mono numeric columns, Inter name column.
- Click a row to expand WheelDetailPanel — verify colors and mono prices.
- Test sorting and column visibility (FR-012 non-regression).

---

# TASK-009 — Migrate ColumnSelector.jsx

## Objective

Replace all `brand-*`, `bg-white`, and legacy `ink-*` references in `ColumnSelector.jsx`. Update the trigger button and dropdown panel to the Notebook palette. Resolve checkbox styling.

## Required context

- The ColumnSelector dropdown is a floating menu. Per AD-003 interpretation and the design system, a minimal `shadow-sm` is kept on floating menus (not a card or panel, so FR-006 does not prohibit it).
- The trigger button currently uses `rounded-lg` — change to `rounded-xs`.

## Potentially impacted files

- `src/components/MiniComparator/ColumnSelector.jsx`

## Inputs → Expected outputs

| Element | Current classes | New classes |
|---|---|---|
| Trigger button | `border-ink-200 bg-white text-ink-700 hover:bg-ink-100/60 rounded-lg` | `border-ink-4 bg-paper-0 text-ink-11 hover:bg-ink-2/60 rounded-xs` |
| Icon in button | `text-ink-500` | `text-ink-7` |
| Dropdown panel | `border-ink-200 bg-white shadow-lg rounded-lg` | `border-ink-4 bg-paper-0 shadow-sm rounded-none` |
| Group label `<div>` | `text-xs font-semibold uppercase tracking-wide text-ink-500` | `text-xs font-semibold uppercase tracking-widest text-ink-7` |
| Item label hover | `hover:bg-ink-100/60 text-ink-700 rounded` | `hover:bg-ink-2/60 text-ink-11 rounded-none` |
| Checkbox | `border-ink-300 text-brand-600 focus:ring-brand-500` | `border-ink-4 accent-brass-7 focus:ring-brass-8` |

## Constraints

- `shadow-lg` on the dropdown is reduced to `shadow-sm` (not removed). The dropdown is a floating menu, not a card/panel — FR-006 applies to cards and panels, not floating menus.
- `rounded-lg` on the dropdown panel changes to `rounded-none` (panel/card rule from FR-005).
- The `max-w-[calc(100vw-1rem)]` arbitrary value on the dropdown panel is an accepted EVO-002 exception — do not change it.
- `rounded` on individual item labels: change to `rounded-none` to comply with FR-005.

## Dependencies

- TASK-001, TASK-002

## Validation criteria

- [ ] Trigger button is paper-0 background, ink-4 border, brass hover
- [ ] Dropdown panel has square corners, ink-4 border, paper-0 background, no `shadow-lg`
- [ ] Group labels use `tracking-widest` and `text-ink-7`
- [ ] Checkboxes have brass accent
- [ ] Column show/hide still works correctly (FR-012 non-regression)
- [ ] No `brand-*` or `bg-white` remains in this file

## Tests to implement

### Unit
None.

### Integration
- Open ColumnSelector, toggle several columns — verify functionality is preserved.
- Tab into the dropdown and verify brass focus rings on checkboxes.

---

# TASK-010 — Migrate RoadmapSection.jsx

## Objective

Replace all `brand-*` and legacy `ink-*` references in `RoadmapSection.jsx`. Apply the Notebook palette to the section background, cards, phase tags, status badges, body text, and bullet points.

## Required context

- Section background `bg-ink-100/40` becomes `bg-paper-2` — the warm recessed surface tone.
- Cards use the `card` utility class (updated in TASK-002 to `rounded-none border border-ink-4 bg-paper-0 no shadow`).
- Status badges: active badge ("In progress") changes from `bg-brand-600 text-white` to `bg-brass-7 text-ink-12`. Inactive badges change from `bg-ink-100 text-ink-700` to `bg-ink-2 text-ink-11`. Both keep `rounded-full` (pill shape per FR-005).

## Potentially impacted files

- `src/components/RoadmapSection.jsx`

## Inputs → Expected outputs

| Element | Current classes | New classes |
|---|---|---|
| `<section>` | `bg-ink-100/40` | `bg-paper-2` |
| Eyebrow `<span>` | `text-brand-600` | `text-brass-8` |
| Phase tag | `text-brand-600` | `text-brass-8` |
| Active badge | `bg-brand-600 text-white` + `rounded-full` | `bg-brass-7 text-ink-12` + `rounded-full` |
| Inactive badge | `bg-ink-100 text-ink-700` + `rounded-full` | `bg-ink-2 text-ink-11` + `rounded-full` |
| Card `<h3>` | `text-ink-900` | `text-ink-11` |
| Card description `<p>` | `text-ink-500` | `text-ink-8` |
| Points list `<ul>` | `text-ink-700` | `text-ink-11` |
| Bullet `<span>` | `bg-brand-600 rounded-full` | `bg-brass-7 rounded-full` |

## Constraints

- `section-title` and `section-subtitle` classes are updated globally in TASK-002.
- Badge `rounded-full` is the correct radius for pill badges (FR-005) — do not change it.
- Phase tag `text-xs font-semibold uppercase tracking-wider` is already close to the micro label treatment — keep it but verify `tracking-wider` vs `tracking-widest`. If the difference matters visually, use `tracking-widest`.

## Dependencies

- TASK-001, TASK-002

## Validation criteria

- [ ] Section background is warm paper-2 (recessed, slightly warmer than page background)
- [ ] "Roadmap" eyebrow is brass-8
- [ ] Active badge ("In progress") is brass-7 with ink-12 text
- [ ] Cards have square corners, ink-4 border, no shadow
- [ ] Bullet points are brass-7 colored
- [ ] No `brand-*` or `bg-ink-100` remains in this file

## Tests to implement

### Unit
None.

### Integration
- Visual inspection of the Roadmap section at desktop viewport.

---

# TASK-011 — Migrate BenefitsGrid.jsx

## Objective

Replace all `brand-*` and legacy `ink-*` references in `BenefitsGrid.jsx`. Apply the Notebook palette to the eyebrow label, icon containers, card body text.

## Required context

- Section has no explicit background — it inherits `paper-1` from the body (set in TASK-002).
- Cards use the `card` utility class (updated in TASK-002).
- Icon containers currently use `bg-brand-50 text-brand-700`. After migration: `bg-brass-3 text-brass-9`.

## Potentially impacted files

- `src/components/BenefitsGrid.jsx`

## Inputs → Expected outputs

| Element | Current classes | New classes |
|---|---|---|
| Eyebrow `<span>` | `text-brand-600` | `text-brass-8` |
| Icon container `<div>` | `bg-brand-50 text-brand-700 rounded-lg` | `bg-brass-3 text-brass-9 rounded-none` |
| Card `<h3>` | `text-ink-900` | `text-ink-11` |
| Card `<p>` | `text-ink-500` | `text-ink-8` |

## Constraints

- `section-title` and `section-subtitle` updated in TASK-002 — no change needed here.
- Icon container: `rounded-lg` changes to `rounded-none` (no rounded corners on panels per FR-005). The icon container is a small colored panel within the card — it is not a button or badge.

## Dependencies

- TASK-001, TASK-002

## Validation criteria

- [ ] "Why MyBikeLab" eyebrow is brass-8
- [ ] Icon containers render in brass-3 background, brass-9 icon color, square corners
- [ ] Cards have square corners, ink-4 border (inherited from TASK-002)
- [ ] No `brand-*` remains in this file

## Tests to implement

### Unit
None.

### Integration
- Visual inspection at desktop viewport.

---

# TASK-012 — Migrate PartnershipSection.jsx and ContactForm.jsx

## Objective

Replace the blue-dark (`bg-brand-900`) Partnership section background with `bg-ink-12` (near-black Notebook tone). Update all text, border, and accent colors for the dark section. Migrate `ContactForm.jsx` to use paper backgrounds and brass interactions.

## Required context

- **PartnershipSection** is a dark section (`ink-12` background). After migration, text uses `paper-1` instead of `white`. Border accents use `paper-1/10` for subtle definition.
- **ContactForm** is rendered inside PartnershipSection. It uses the `card` utility (updated in TASK-002 to `bg-paper-0`) which creates a light card on the dark section background — this contrast is intentional. The form fields must also use paper backgrounds.
- `PartnershipSection` wraps ContactForm in `<div id="contact" className="text-ink-900">` — change `text-ink-900` to `text-ink-11` (light text inherited from the light form card context).

## Potentially impacted files

- `src/components/PartnershipSection.jsx`
- `src/components/ContactForm.jsx`

## Inputs → Expected outputs: PartnershipSection

| Element | Current classes | New classes |
|---|---|---|
| `<section>` | `bg-brand-900 text-white` | `bg-ink-12 text-paper-1` |
| Eyebrow | `text-brand-100` | `text-paper-3` |
| Lead `<p>` | `text-brand-100/90` | `text-paper-2` |
| Audience cards | `border-white/10 bg-white/5 rounded-xl` | `border-paper-1/10 bg-paper-1/5 rounded-none` |
| Audience `<h3>` | implicit `text-white` from `text-white` on `<section>` | no change (inherited from `text-paper-1` on section) |
| Audience `<p>` | `text-brand-100/80` | `text-paper-2/80` |
| ContactForm wrapper | `text-ink-900` | `text-ink-11` |

## Inputs → Expected outputs: ContactForm

| Element | Current classes | New classes |
|---|---|---|
| Form `card` | `card p-6` (updated in TASK-002) | no change needed |
| Form inputs | `rounded-lg border-ink-300 bg-white focus:border-brand-600` | `rounded-xs border-ink-4 bg-paper-0 focus:border-brass-8` |
| `<textarea>` | same as inputs | same migration as inputs |
| Form labels | `text-ink-700` | `text-ink-11` |
| Submit button | `btn-primary` (updated in TASK-002) | no change needed |
| Success icon container | `bg-brand-50 text-brand-700 rounded-full` | `bg-brass-3 text-brass-9 rounded-full` |
| Success `<h3>` | `text-ink-900` | `text-ink-11` |
| Success `<p>` | `text-ink-500` | `text-ink-8` |

## Constraints

- `bg-brand-900` → `bg-ink-12`: confirm that `#0e0f0c` (ink-12) matches the intended deep dark tone.
- Audience card `rounded-xl` → `rounded-none` (square corners on panels per FR-005).
- `text-white` on the section is replaced by `text-paper-1`. This propagates to all child text that relies on color inheritance — verify legibility of all text nodes in the dark section.
- ContactForm's `card` class background (`paper-0`) on the dark section creates deliberate contrast — this is the intended layout (light form on dark background). The ContactForm wrapper's `text-ink-11` provides dark text for use within the light card.

## Dependencies

- TASK-001, TASK-002

## Validation criteria

- [ ] Partnership section has ink-12 (near-black) background
- [ ] "B2B Partnerships" eyebrow renders in paper-3
- [ ] Audience cards have square corners and paper-1/10 border
- [ ] ContactForm card appears as a light panel on the dark section background
- [ ] Form inputs have paper-0 background, ink-4 border, brass focus ring
- [ ] Submit button is brass (inherited from TASK-002)
- [ ] Success state icon container is brass-3 background
- [ ] No `brand-*`, `bg-white`, or `text-white` remains in these files

## Tests to implement

### Unit
None.

### Integration
- Visual inspection at desktop and mobile — Partnership section must render correctly in dark tones.
- Submit the contact form (or simulate send) — verify the success card renders correctly on the dark background.

---

# TASK-013 — Migrate Footer.jsx

## Objective

Migrate the Footer from a white surface to the dark `ink-12` section background. Update logo, copyright, and navigation link colors for legibility on a dark background.

## Required context

- The Footer is specified as a dark section (`ink-12` background) in the PRD. Currently it uses `bg-white` (light).
- Text on the dark footer uses paper tones for legibility.
- Navigation links use `paper-2` with a `brass-7` hover state.

## Potentially impacted files

- `src/components/Footer.jsx`

## Inputs → Expected outputs

| Element | Current classes | New classes |
|---|---|---|
| `<footer>` | `border-ink-100 bg-white` | `border-ink-10 bg-ink-12` |
| Logo mark `<div>` | `bg-brand-600 text-white rounded-md` | `bg-brass-7 text-ink-12 rounded-xs` |
| Copyright `<span>` | `text-ink-500` | `text-paper-2` |
| Nav links `<a>` | `text-ink-500 hover:text-brand-600` | `text-paper-2 hover:text-brass-7` |

## Constraints

- `border-ink-100` (legacy) on the top border of the footer becomes `border-ink-10` — a strong ink line between the section above and the dark footer.
- `rounded-md` on the logo mark becomes `rounded-xs` (FR-005: buttons/inputs use 2px radius; the logo mark is a small interactive-adjacent element).

## Dependencies

- TASK-001, TASK-002

## Validation criteria

- [ ] Footer background is near-black (ink-12)
- [ ] Logo mark is brass-7 on ink-12 background with ink-12 text (correct contrast)
- [ ] Copyright and nav links are paper-2 (off-white, warm) — not pure white
- [ ] Nav link hover is brass-7
- [ ] No `brand-*` or `bg-white` remains in this file

## Tests to implement

### Unit
None.

### Integration
- Visual inspection at desktop and mobile. Verify legibility of all footer text on the dark background.

---

# TASK-014 — Update token-convention.md

## Objective

Update the EVO-002 token convention document to reflect the new token vocabulary introduced by EVO-003. The document remains the single authoritative reference for all design token decisions.

## Required context

- File location: `MyBikeLab/evolutions/archive/EVO-002_design-token-refactoring/token-convention.md`
- This is the file pointed to by the comment in `tailwind.config.js` (`// Token naming convention: evolutions/EVO-002_design-token-refactoring/token-convention.md`). This comment must remain accurate.
- The document has 8 sections. Sections 2 (Colors), 3 (Typography), 6 (CSS module exception), and 8 (Compliance audit commands) require updates. Sections 4 (Spacing), 5 (Layout exceptions), and 7 (Rules for new components) require no substantive change except updating the three-exception list if file paths changed.

## Potentially impacted files

- `MyBikeLab/evolutions/archive/EVO-002_design-token-refactoring/token-convention.md`

## Expected outputs (section-by-section)

**Section 2 — Colors:**
- Remove `brand-*` semantic guidance. Add a "Retired" notice: "`brand-*` is retained in `tailwind.config.js` to avoid build warnings but must not be used in any component file."
- Replace the `ink-*` table with the new 12-step warm-neutral scale. Update semantic guidance.
- Add tables for `paper-*`, `brass-*`, `sage-*` with all token steps and their hex values and semantic roles.

**Section 3 — Typography:**
- Add `font-mono` to section 3.1: `{ token: 'Custom mono', class: 'font-mono', resolved: 'JetBrains Mono, IBM Plex Mono, SF Mono, Menlo, Consolas, monospace' }`.
- Add note: "Numeric data in `ComparisonTable` and key metric values in `Hero` use `font-mono tabular-nums`."

**Section 5 — Layout arbitrary values:**
- No change to the three entries. Verify file paths are still accurate (MiniComparator.jsx, ColumnSelector.jsx).

**Section 6 — CSS module exception:**
- Update the declarations table with the new hex values and token annotations:

| CSS declaration location | Raw hex value | Token equivalent |
|---|---|---|
| `.track` | `#c2c0b3` | `ink-4` |
| `.range` | `#a88846` | `brass-8` |
| `::-webkit-slider-thumb background` | `#a88846` | `brass-8` |
| `::-webkit-slider-thumb border` | `#fbfaf6` | `paper-0` |
| `::-moz-range-thumb` | `#a88846` | `brass-8` |

**Section 8 — Compliance audit commands:**
- Add two new checks after the existing three:
```powershell
# AC-004: legacy brand- classes in components (zero matches expected)
Select-String -Path "src/**/*.jsx","src/**/*.tsx","src/**/*.css" -Pattern "brand-" -Recurse

# AC-005: bg-white in components (zero matches expected)
Select-String -Path "src/**/*.jsx","src/**/*.tsx","src/**/*.css" -Pattern "bg-white" -Recurse
```
- Update "Interpreting results" to note that `FilterPanel.module.css` is the sole file permitted to have raw hex values, and that `tailwind.config.js` is excluded from the `brand-` search.

## Constraints

- This document is the authoritative reference. The update must be accurate — do not add tokens that do not exist in `tailwind.config.js`.
- Add a change log entry at the top of the document noting "EVO-003 — Design System Migration" and the date.

## Dependencies

- TASK-001 through TASK-013 should be complete before writing this document, since the audit commands in Section 8 validate a fully migrated codebase.

## Validation criteria

- [ ] `paper-*`, `ink-*` (new), `brass-*`, `sage-*` tables are accurate (cross-referenced with tailwind.config.js)
- [ ] `font-mono` added to typography section
- [ ] `brand-*` marked as retired with a clear prohibition on component usage
- [ ] Section 6 CSS module table shows the new hex values matching FilterPanel.module.css
- [ ] AC-004 and AC-005 audit commands added to Section 8
- [ ] Change log entry added

## Tests to implement

### Unit
None.

### Integration
- Run all five compliance audit commands from Section 8 against `src/`. Verify zero matches for AC-001 through AC-005 (except the accepted exceptions in FilterPanel.module.css and the three layout exceptions).

---

## 6. Global Validation Strategy

### Unit validation

No logic changes are made in this evolution. All validation is visual or structural.

### Integration validation

After all tasks are complete, run the full compliance audit from the updated `token-convention.md` Section 8:

```powershell
# Run from frontend/ directory
# AC-001: arbitrary colors
Select-String -Path "src/**/*.jsx","src/**/*.tsx","src/**/*.css" -Pattern "(bg|text|border|fill|stroke|ring)-\[" -Recurse

# AC-002: arbitrary typography
Select-String -Path "src/**/*.jsx","src/**/*.tsx","src/**/*.css" -Pattern "(text|leading|tracking|font)-\[" -Recurse

# AC-003: arbitrary spacing
Select-String -Path "src/**/*.jsx","src/**/*.tsx","src/**/*.css" -Pattern "(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space-x|space-y)-\[" -Recurse

# AC-004: brand- classes (zero matches)
Select-String -Path "src/**/*.jsx","src/**/*.tsx","src/**/*.css" -Pattern "brand-" -Recurse

# AC-005: bg-white (zero matches)
Select-String -Path "src/**/*.jsx","src/**/*.tsx","src/**/*.css" -Pattern "bg-white" -Recurse
```

Accepted matches (not violations):
- AC-001/002/003: `FilterPanel.module.css` — cross-reference Section 6 of `token-convention.md`
- AC-001/002/003: `MiniComparator.jsx` and `ColumnSelector.jsx` for the three layout exceptions in Section 5

### Functional validation

- FR-012 (comparator functionality): Test all filter types (range, multiSelect, triState), sort, and column visibility after migration.
- FR-013 (responsive): Visual inspection at desktop (≥ 1024px) and mobile (< 768px).

### Non-regression validation

- All comparator interactions must work identically after migration (no behavioral change, only visual).
- No new arbitrary Tailwind values introduced beyond the three accepted exceptions.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `wheelProperties.jsx` defines `cellClassName` or `headClassName` with legacy `ink-*` tokens | Some table cells or headers retain legacy slate colors | At TASK-008 implementation, call `getColumnProperties()` and inspect each property's `cellClassName` / `headClassName`. Document any legacy values in spec-notes as a known gap for a follow-up EVO. |
| `accent-brass-7` utility not supported in the project's Tailwind v3 version | Checkbox accent color is not updated | Verify Tailwind version supports `accent-*`. If not, add a `[accent-color:#a88846]` arbitrary value as an explicit exception and document it in `token-convention.md` Section 6. |
| Dark Footer and dark Partnership section adjacent layout | Visual separation between the two dark sections may be unclear | Inspect rendered output after both TASK-012 and TASK-013 are complete. If separation is insufficient, add a `border-t border-ink-10` to the Footer's `<footer>` element (already specified in TASK-013). |
| Paper-0 on `card` class makes cards invisible on paper-0 sections | Zero contrast between card and section background | Hero uses `bg-paper-0` as section bg; no card elements are placed in Hero — this risk is not triggered. MiniComparator uses `bg-paper-2` as section bg with `bg-paper-0` cards — adequate contrast. |
| JetBrains Mono CDN request blocked or slow | Numeric cells fall back to next font in the `font-mono` stack | The fallback stack (`IBM Plex Mono`, `SF Mono`, `Menlo`, `Consolas`) provides a monospace font in all cases. Functionality is unaffected; only the specific typeface differs. |

---

## 8. Rollback Plan

Since this is a purely visual migration with no logic changes:

- All changes are in `.jsx`, `.css`, `.js` (config), and `.md` files.
- A `git revert` of the EVO-003 commits restores the full previous state.
- Because the migration spans multiple files and tasks, the recommended approach is to merge all tasks in a single PR rather than task-by-task. The app is expected to be visually inconsistent between TASK-001 completion and the final task — do not deploy to production mid-migration.
