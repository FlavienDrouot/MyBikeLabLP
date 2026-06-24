# Technical Specifications

## 1. General Information

- Evolution ID: EVO-007
- PRD reference: `evolutions/EVO-007_wire-design-tokens-source-of-truth/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-26

---

## 2. Technical Context

### Technical objective

Make `design-system/colors_and_type.css` the single source of truth for all design tokens by placing a verbatim copy of it inside the frontend project, importing it early in the CSS pipeline, and replacing every hardcoded hex value in `tailwind.config.js` with `var(--token-name)` references. Additionally fix the `tracking-widest` value, expose the DS font-family variables to Tailwind, and remove the retired `brand-*` palette.

### Affected architecture

- CSS pipeline: `frontend/src/index.css` imports the token file before Tailwind directives.
- Tailwind configuration: `frontend/tailwind.config.js` — all color and font-family values replaced with CSS variable references; `letterSpacing.widest` corrected.
- New file: `frontend/src/design-tokens.css` — verbatim copy of `design-system/colors_and_type.css`.
- No changes to `vite.config.js` or `postcss.config.js` — the token file resides inside `frontend/src/`, making it a standard local import that Vite handles without path aliases.

### Impacted modules

- `frontend/src/index.css`
- `frontend/tailwind.config.js`
- `frontend/src/design-tokens.css` (new file)

No React component files are modified by this evolution.

---

## 3. Technical Constraints

- `design-system/` is read-only; the only permitted operation is reading it to produce the copy.
- The token CSS file in `frontend/src/` must be a verbatim copy of `design-system/colors_and_type.css` — no edits, no additions.
- The Google Fonts `@import` in `design-system/colors_and_type.css` will be duplicated by the copy; the duplicate import in `index.css` must be removed to avoid double-loading fonts.
- Tailwind CSS 3 supports CSS variable references in `theme.extend` using the string form `'var(--token)'`. No plugin or PostCSS transform is required.
- The DS file uses `@import url(...)` at line 1. When copied into `frontend/src/design-tokens.css`, this import must be removed because `index.css` already loads the Google Fonts URL and the token file is imported after the Tailwind directives (where `@import` is not allowed by PostCSS). The verbatim-copy constraint applies to the token values, not the font import line.
- No automated sync mechanism is in scope; the copy is updated manually.
- No component JSX or class names are modified, except to remove `brand-*` entries from `tailwind.config.js`.
- No automated tests exist or are required for this evolution.

---

## 4. Architecture Decisions

### AD-001 — Token file placed inside `frontend/src/` as a static import

#### Description
`design-system/colors_and_type.css` is copied to `frontend/src/design-tokens.css`. It is imported in `frontend/src/index.css` using a relative `@import './design-tokens.css'` statement placed before the `@tailwind base` directive.

#### Motivation
Vite resolves CSS `@import` statements for files within the project source without any configuration change. Placing the file inside `src/` avoids the need for a Vite path alias or `resolve.alias` configuration and keeps the approach consistent with how `index.css` already works. The file is tracked in git alongside the frontend; its update path is explicit (manual copy) and auditable in version history.

#### Rejected alternatives
- **Import directly from `design-system/` via a relative path (`../../design-system/...`)**: Works at build time but the path crosses the project boundary and depends on the repository layout. Fragile if the project is ever moved or deployed standalone.
- **Vite alias (`@design-system`)**: Adds configuration complexity for a problem that does not require it once the file is inside `src/`.
- **PostCSS plugin to inline the file at build time**: Overly complex; no build-time transform is needed since CSS variables resolve at runtime.
- **Tailwind plugin to inject tokens as JS values**: Breaks the "CSS variables at runtime" model required by FR-002 and UC-001 (HMR on token edit).

---

### AD-002 — `@import` placement in `index.css`: before `@tailwind base`

#### Description
The import of `design-tokens.css` is placed as the first statement in `index.css`, before `@tailwind base`. The existing Google Fonts `@import url(...)` is removed from `index.css` because `design-tokens.css` already contains it.

#### Motivation
PostCSS / Tailwind requires all `@import` statements to precede `@tailwind` directives. The DS file's Google Fonts `@import` is stripped from the copy (see TASK-001 constraint) to satisfy this rule cleanly, and the one already in `index.css` is also removed to avoid double font loading. A single Google Fonts load lives inside `design-tokens.css`.

#### Rejected alternatives
- **Keep Google Fonts import in `index.css` and strip it from `design-tokens.css`**: Equivalent result, but keeping the font import in `design-tokens.css` means the DS file remains the authoritative source for fonts, which is consistent with the design-system-as-source-of-truth goal. The font import is part of the DS file's intent.

---

### AD-003 — Tailwind color values replaced with `var(--token)` strings

#### Description
Each hardcoded hex value in `tailwind.config.js` under `colors.paper`, `colors.ink`, `colors.brass`, and `colors.sage` is replaced with the corresponding CSS variable reference string (e.g., `'var(--paper-1)'`). The structure (palette name, numeric stops) is preserved unchanged so all existing utility classes (`bg-paper-1`, `text-ink-11`, etc.) continue to work.

#### Motivation
Tailwind 3 emits the color value verbatim into the generated CSS. Using `var(--paper-1)` as the value means the Tailwind-generated rule `background-color: var(--paper-1)` resolves to whatever the CSS variable is set to at runtime — satisfying FR-001, FR-002, and UC-001.

#### Rejected alternatives
- **Remove color entries from `tailwind.config.js` entirely and write CSS directly**: Breaks all existing `bg-*` / `text-*` / `border-*` utility classes used across components; requires a full component refactor.
- **Generate a JS token object from the CSS file at build time**: Adds a build script dependency; the CSS variable approach achieves the same goal without it.

---

### AD-004 — `brand-*` palette removed directly from `tailwind.config.js`

#### Description
The `brand` block in `tailwind.config.js` is deleted. No component in `frontend/src/` references any `brand-*` utility class (confirmed by grep — zero matches).

#### Motivation
The `brand-*` palette has no corresponding DS token and was already marked "RETIRED" in the config comment. Removing it eliminates a false entry in the design token surface and satisfies FR-006.

#### Rejected alternatives
- **Leave the block with a deprecation comment**: The PRD explicitly requires removal. The grep confirms no risk of silent breakage.

---

### AD-005 — DS semantic classes exposed via `@import` of `design-tokens.css`

#### Description
The DS semantic type classes (`.t-display-1`, `.t-h1`, `.t-label`, etc.) and rule classes (`.rule`, `.rule-strong`, `.rule-double`) are defined inside `design-tokens.css`. Importing that file in `index.css` makes them globally available to the Tailwind stylesheet and therefore to all React components.

#### Motivation
No duplication or re-declaration is needed. The classes already exist in the DS file with full definitions. A straight import is the zero-maintenance path: when the DS file is copied to update tokens, the semantic classes are updated automatically.

#### Rejected alternatives
- **Port the classes into `index.css` under `@layer components`**: Creates a duplicate that drifts from the DS source.
- **Tailwind plugin that reads the DS file and generates utility classes**: Unnecessary complexity; the classes are not utilities, they are component-level classes.

---

## 5. Task Breakdown

---

# TASK-001 — Create `frontend/src/design-tokens.css`

## Objective
Produce the token CSS file that will be the runtime source of truth for all design variable values in the frontend.

## Required context
- `design-system/colors_and_type.css` is the authoritative source; it must be copied verbatim with one exception: the `@import url(...)` Google Fonts line at line 1 must be retained in this copy (it is the single surviving font import — see TASK-002 which removes the duplicate from `index.css`).
- Architecture decision AD-001 explains why the file lives in `frontend/src/`.
- Architecture decision AD-002 explains the font import strategy.

## Potentially impacted files
- `frontend/src/design-tokens.css` (new file — created by this task)

## Inputs
- `design-system/colors_and_type.css` (read-only source)

## Expected outputs
- `frontend/src/design-tokens.css`: a verbatim copy of `design-system/colors_and_type.css`, including the Google Fonts `@import url(...)` on line 1 and all `:root` variable declarations, global baseline rules, semantic type classes, component token classes, `::selection`, and `:focus-visible` rules.

## Constraints
- The file content must match `design-system/colors_and_type.css` character-for-character, with no additions, deletions, or reformatting.
- Do not modify `design-system/colors_and_type.css`.

## Dependencies
- None. This task has no predecessor.

## Validation criteria
- [ ] `frontend/src/design-tokens.css` exists.
- [ ] Its content is identical to `design-system/colors_and_type.css` (diff produces no output).
- [ ] The file is tracked in git.

## Tests to implement
### Unit
- None.
### Integration
- None.

---

# TASK-002 — Update `frontend/src/index.css` to import the token file

## Objective
Wire `design-tokens.css` into the CSS pipeline so that all CSS variables and DS semantic classes are available to the Tailwind stylesheet and all React components.

## Required context
- Architecture decision AD-002: the import must be placed before `@tailwind base`.
- The Google Fonts `@import url(...)` currently on line 1 of `index.css` must be removed because `design-tokens.css` (imported here) already contains it, and a double font load wastes bandwidth. Only one Google Fonts request should fire on page load.
- The existing `@layer base` body styles in `index.css` use Tailwind utility classes (`@apply bg-paper-1 text-ink-11 font-sans antialiased`). These continue to work because the Tailwind color utilities are still present in `tailwind.config.js` (now backed by CSS variables after TASK-003).
- The DS file also declares a `body` rule with raw CSS (not Tailwind). Both rules will apply; the `@layer base` rule from `index.css` takes precedence for Tailwind-managed properties. No conflict is expected because the DS body rule uses CSS variable references that resolve to the same values.

## Potentially impacted files
- `frontend/src/index.css`

## Inputs
- Current `frontend/src/index.css` (read before editing)
- `frontend/src/design-tokens.css` (must exist — depends on TASK-001)

## Expected outputs
`frontend/src/index.css` modified as follows:
1. Line 1 (`@import url('https://fonts.googleapis.com/...')`) is removed.
2. A new line `@import './design-tokens.css';` is inserted as the new first line.
3. All other content (`@tailwind base`, `@tailwind components`, `@tailwind utilities`, `@layer base`, `@layer components`) remains unchanged.

## Constraints
- The `@import './design-tokens.css';` statement must appear before all `@tailwind` directives.
- No `@layer` rules in `index.css` are modified.
- No component utility classes in `@layer components` are changed.

## Dependencies
- TASK-001 must be complete (the imported file must exist).

## Validation criteria
- [ ] `index.css` begins with `@import './design-tokens.css';`.
- [ ] The Google Fonts `@import url(...)` line is absent from `index.css`.
- [ ] `@tailwind base` still follows immediately after the import.
- [ ] The dev server starts without errors after the change.
- [ ] The browser makes exactly one Google Fonts network request on page load (verify in DevTools Network tab).

## Tests to implement
### Unit
- None.
### Integration
- None.

---

# TASK-003 — Refactor `tailwind.config.js`: replace hex values with CSS variable references

## Objective
Eliminate all hardcoded hex color values for the paper / ink / brass / sage palettes from Tailwind configuration, replacing them with CSS variable references so that FR-001 and FR-002 are satisfied.

## Required context
- Tailwind CSS 3 accepts CSS variable strings as color values. The generated utility class will contain `color: var(--paper-1)` instead of `color: #f6f4ef`. The browser resolves the variable at runtime from the `design-tokens.css` `:root` block.
- The palette structure (keys `paper`, `ink`, `brass`, `sage` with their numeric stops) must not change. All existing utility classes (`bg-paper-1`, `text-ink-11`, `border-brass-7`, etc.) must continue to generate correctly.
- The `brand` block must be deleted entirely (AD-004). No component references `brand-*` (confirmed by grep).
- `fontFamily.sans` and `fontFamily.mono` must be updated to reference DS CSS variables (FR-004): `['var(--font-display)', 'sans-serif']` and `['var(--font-mono)', 'monospace']`. A `display` key should also be added pointing to `var(--font-display)`.
- `letterSpacing.widest` must be added (or extended) with the value `'0.18em'` to match `--tracking-widest` (FR-003).
- `borderRadius.xs: '2px'` is already present and correct; it does not need to change (its value matches `--radius-xs` in the DS but is a static value, not a CSS variable — acceptable since it is not a color token and the PRD does not require variable references for radii).

## Potentially impacted files
- `frontend/tailwind.config.js`

## Inputs
- Current `frontend/tailwind.config.js` (read before editing)
- `design-system/colors_and_type.css` — reference for variable names

## Expected outputs
`frontend/tailwind.config.js` with:

1. `colors.brand` block — deleted.
2. `colors.paper` — each stop value replaced with the corresponding CSS variable reference:
   - `0: 'var(--paper-0)'`, `1: 'var(--paper-1)'`, `2: 'var(--paper-2)'`, `3: 'var(--paper-3)'`
3. `colors.ink` — all 12 stops replaced: `1: 'var(--ink-1)'` … `12: 'var(--ink-12)'`
4. `colors.brass` — all 12 stops replaced: `1: 'var(--brass-1)'` … `12: 'var(--brass-12)'`
5. `colors.sage` — all 12 stops replaced: `1: 'var(--sage-1)'` … `12: 'var(--sage-12)'`
6. `fontFamily` block updated to:
   ```js
   fontFamily: {
     display: ['var(--font-display)', 'sans-serif'],
     sans:    ['var(--font-sans)',    'sans-serif'],
     mono:    ['var(--font-mono)',    'monospace'],
   }
   ```
7. `letterSpacing` block added:
   ```js
   letterSpacing: {
     widest: '0.18em',
   }
   ```
8. `borderRadius.xs: '2px'` — unchanged.

## Constraints
- Palette key names and stop numbers must remain identical to their current values.
- No new palette entries are introduced.
- No component files are modified.
- The resulting config must pass `tailwind` build without warnings about missing color values.

## Dependencies
- TASK-001 and TASK-002 must be complete so that the CSS variables are defined in the loaded stylesheet when Tailwind-generated classes are used.

## Validation criteria
- [ ] `tailwind.config.js` contains no hex literals for the paper / ink / brass / sage palettes (AC-001).
- [ ] `tailwind.config.js` contains no `brand` block (AC-005 partial).
- [ ] `grep -r "brand-" frontend/src/` returns no matches (AC-005 full).
- [ ] The dev server starts and the Landing page renders without visual regression (AC-006).
- [ ] Inspecting `bg-paper-1` in DevTools shows `background-color: var(--paper-1)` resolving to the correct warm off-white.
- [ ] `font-display` Tailwind utility resolves via `var(--font-display)`.

## Tests to implement
### Unit
- None.
### Integration
- None.

---

# TASK-004 — Manual verification pass

## Objective
Confirm all acceptance criteria defined in the PRD are met after TASK-001 through TASK-003 are complete.

## Required context
- This task is a structured manual verification, not a code change.
- AC-001 through AC-006 from the PRD define the exact checks to perform.
- The dev server must be running (`npm run dev` from `frontend/`).

## Potentially impacted files
- None (read-only verification).

## Inputs
- Running dev server at `localhost:5173/MyBikeLabLP/` (or equivalent).
- Browser DevTools (Elements + Computed styles + Network tabs).

## Expected outputs
- All six acceptance criteria confirmed.
- Any discrepancy identified and fed back as a bug to the relevant task.

## Constraints
- Do not modify code during this task. If a fix is needed, create a separate task.

## Dependencies
- TASK-001, TASK-002, TASK-003 must all be complete.

## Validation criteria
- [ ] **AC-001**: Search repo for hex color literals matching paper/ink/brass/sage. Only location: `frontend/src/design-tokens.css`.
- [ ] **AC-002**: Change `--brass-7` in `frontend/src/design-tokens.css`, save, confirm CTA background updates in browser via HMR without full reload.
- [ ] **AC-003**: Apply `tracking-widest` to a test element; DevTools Computed tab shows `letter-spacing: 0.18em` (or pixel equivalent).
- [ ] **AC-004**: Apply `className="t-label"` to an element in a component; DevTools confirms correct font family, size (10px), weight (500), `text-transform: uppercase`, `letter-spacing: var(--tracking-widest)`.
- [ ] **AC-005**: `tailwind.config.js` has no `brand` block; `grep -r "brand-" frontend/src/` returns no output.
- [ ] **AC-006**: Full-page screenshot of Landing page matches pre-evolution state except for any `tracking-widest` corrected elements.

## Tests to implement
### Unit
- None.
### Integration
- None.

---

## 6. Global Validation Strategy

### Unit validation
- Not applicable. This evolution modifies CSS infrastructure only; no logic or data structures are introduced.

### Integration validation
- Dev server starts without errors after all three file changes.
- Tailwind generates utility classes that reference CSS variables; the variables resolve correctly at runtime (visible via DevTools Computed styles).
- HMR triggers on save of `frontend/src/design-tokens.css` and the change propagates to the browser.

### Functional validation
- All six acceptance criteria from the PRD (AC-001 through AC-006) are verified manually per TASK-004.
- The Landing page is visually equivalent to its pre-evolution state, with the sole expected difference being elements using `tracking-widest` (corrected from 0.1em to 0.18em).

### Non-regression validation
- The `grep -r "brand-" frontend/src/` check confirms no component relies on the removed palette.
- All existing Tailwind utility classes (`bg-paper-1`, `text-ink-11`, `border-brass-7`, etc.) continue to work because palette key names and stop numbers are preserved.
- The `@layer components` block in `index.css` (button and layout classes) is unchanged and continues to resolve correctly against the refactored Tailwind config.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| PostCSS rejects `@import` after `@tailwind` directives | Build fails | AD-002: the import is placed before all `@tailwind` directives |
| DS body rule conflicts with `@layer base` body rule in `index.css` | Unexpected style override | Both rules use compatible declarations; `@layer base` takes Tailwind-cascade precedence. Verified visually in TASK-004. |
| Tailwind treats `var(--color)` as invalid color and generates empty rules | Utilities silently produce no style | Tailwind 3 passes string values through verbatim; validated by DevTools inspection in AC-002 |
| `tracking-widest` correction changes rendered width of all-caps labels | Layout overflow in narrow containers | PRD edge case noted; verify Landing page narrow-breakpoint layout in TASK-004 (AC-006) |
| Google Fonts loads twice if the removal of the `index.css` import is missed | Extra network request, no functional breakage | AC verification in TASK-002: check Network tab for a single Fonts request |
| Future developer edits `design-tokens.css` instead of `design-system/colors_and_type.css` | DS and frontend copy drift silently | A comment at the top of `design-tokens.css` should state: "DO NOT EDIT — verbatim copy of design-system/colors_and_type.css. Update by replacing this file entirely." |

---

## 8. Rollback Plan

- All changes are limited to three files: `frontend/src/design-tokens.css` (new), `frontend/src/index.css` (two-line edit), and `frontend/tailwind.config.js` (hex values and font family).
- To roll back: delete `frontend/src/design-tokens.css`, restore `frontend/src/index.css` to its pre-evolution state (reinstate the Google Fonts import, remove the `design-tokens.css` import), and restore `frontend/tailwind.config.js` from git.
- A git tag or branch snapshot before the first task is the cleanest rollback mechanism.
- No database migrations, API changes, or component refactors are involved; rollback has zero risk of data loss.
