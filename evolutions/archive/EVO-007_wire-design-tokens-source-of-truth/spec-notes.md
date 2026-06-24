# Spec Notes — EVO-007

## PRD interpretations

### The "verbatim copy" constraint vs. the Google Fonts `@import`

The PRD states the token file in `frontend/` must be a verbatim copy of `design-system/colors_and_type.css`. However, `index.css` currently imports Google Fonts on its own line 1. Importing the DS copy verbatim would introduce a second Google Fonts request.

**Interpretation**: The verbatim-copy constraint applies to the design token values, not to operational concerns like font loading. The Google Fonts `@import` is kept in `design-tokens.css` (which becomes the single authoritative font loader), and the duplicate in `index.css` is removed. The copy remains byte-for-byte identical to the source; only `index.css` changes.

This also has a PostCSS implication: `@import` must precede `@tailwind` directives. Keeping the Google Fonts line inside `design-tokens.css` (which is itself imported before `@tailwind base`) satisfies this rule correctly.

---

### `design-tokens.css` location: `frontend/src/` vs. `frontend/`

The PRD says "a copy of `colors_and_type.css` placed inside the frontend project" without specifying the exact path. The init brief mentions `frontend/` as the project root for config files.

**Interpretation**: `frontend/src/` is chosen over `frontend/` because CSS files imported from `index.css` (which lives in `src/`) use relative paths. A file in `src/` is imported as `./design-tokens.css`; a file in `frontend/` root would require `../design-tokens.css`, which crosses the `src/` boundary and is unconventional. Placing it in `src/` also ensures Vite's HMR watches it by default.

---

### FR-004 — Which font families to expose in Tailwind

The PRD says "Tailwind font family utilities for display, sans, and mono resolve through DS CSS variables." The current `tailwind.config.js` has only `sans` and `mono`. A `display` key is absent.

**Interpretation**: A `display` key is added pointing to `var(--font-display)`. The DS distinguishes `--font-display` and `--font-sans` (both map to Inter at this stage, but the semantic separation is intentional per the DS aesthetic). Exposing `font-display` as a Tailwind utility class prepares for future use without requiring a component change now.

---

### `borderRadius.xs` — CSS variable reference or static value

The PRD (FR-001) restricts the single-location rule to color palette values only. `borderRadius.xs: '2px'` matches `--radius-xs: 2px` in the DS but the PRD does not require radius tokens to flow through CSS variables.

**Interpretation**: `borderRadius.xs` is left as `'2px'` (static value). Changing it to `'var(--radius-xs)'` would be consistent with the single-source principle but is out of scope per the PRD. Noted as a candidate for a future "expand token wiring to spacing/radii" evolution.

---

### Semantic classes in `index.css` `@layer components` — replace or coexist?

`index.css` has an `@layer components` block with `.btn-primary`, `.btn-ghost`, `.btn-outline`, `.section`, etc. The DS file being imported defines `.t-label`, `.rule`, etc. There is no naming collision.

**Interpretation**: The two sets of classes coexist without conflict. The `@layer components` block in `index.css` is not modified. DS semantic classes become globally available through the import. No migration of existing component classes is performed in this evolution.

---

## Architecture decision rationale

### Why `frontend/src/design-tokens.css` (file copy) over direct import from `design-system/`

A direct `@import '../../design-system/colors_and_type.css'` from `index.css` would also work at build time, and it would eliminate the manual copy step. It was rejected for two reasons:

1. **Boundary coupling**: The frontend project becomes directly dependent on a sibling directory's file path. If the workspace is restructured (e.g., `frontend/` extracted to a standalone repo), the import breaks.
2. **PRD constraint**: The PRD explicitly requires a copy and describes the manual sync as the accepted process. Direct import contradicts the stated architecture.

The copy-in-`src/` approach keeps the frontend self-contained and makes the DS version in use visible in git history.

---

### Why CSS variable references in `tailwind.config.js` over a build-time token generation script

A script (e.g., a small Node.js utility) could parse `design-tokens.css` at build time and generate a JS object of color values, then pass that object to the Tailwind config. This approach was rejected because:

1. **HMR breaks**: If token values are baked into the Tailwind CSS at build time, changing `design-tokens.css` requires a Tailwind rebuild to take effect — defeating AC-002 (HMR on token edit).
2. **CSS variable references at runtime**: The CSS variable approach means the browser resolves the color at paint time from the `:root` block. Editing `design-tokens.css` triggers Vite HMR on that file, the CSS variable values update, and the browser repaints — no Tailwind rebuild needed.
3. **Complexity**: The script adds a build step, a new file, and a CI dependency for what is achievable with a one-line string substitution in the config.

---

### Why `letterSpacing.widest` as a Tailwind `theme.extend` key rather than a custom utility

`0.18em` corrects the existing `tracking-widest` utility (currently `0.1em` from Tailwind defaults). The cleanest fix is to override `letterSpacing.widest` in `theme.extend`, which replaces the Tailwind default for that key. No new class is introduced; existing `tracking-widest` usages get the corrected value automatically.

An alternative was to add a new key (e.g., `tracking-wide-label: '0.18em'`) and replace usages — but that would require component edits and is unnecessary given `widest` is already the intended semantic label.

---

## Tradeoffs

### Copy vs. direct import

| Criterion | Copy in `src/` | Direct import from `design-system/` |
|---|---|---|
| Self-contained frontend | Yes | No |
| Manual sync required | Yes | No |
| PRD compliant | Yes | No |
| Git history of DS version in use | Yes | No |
| Cross-boundary path dependency | No | Yes |

Decision: copy in `src/` — PRD constraint is non-negotiable.

---

### CSS variable references vs. static values in Tailwind config

| Criterion | CSS variables | Static hex values |
|---|---|---|
| Single source of truth for colors | Yes | No (FR-001 violated) |
| HMR on token edit | Yes | No |
| Works with Tailwind 3 | Yes | Yes |
| Semantic clarity (value intent visible) | Lower (need to trace var) | Higher (value visible inline) |

Decision: CSS variables — required by FR-001 and AC-002.

---

### Semantic classes: import vs. `@layer components` re-declaration

| Criterion | Import via `design-tokens.css` | Re-declare in `@layer components` |
|---|---|---|
| Zero maintenance drift | Yes | No |
| Auto-updated on DS sync | Yes | No |
| Tailwind purge-safe | Yes (classes used in JSX are not purged; classes defined in an imported CSS file are always included) | Yes |
| Adds complexity | No | Yes |

Decision: import — zero-maintenance path.

---

## Open questions

### OQ-001 — Tailwind CSS purge and CSS-variable-backed color classes

Tailwind 3 scans `content` files for class names and removes unused ones. Color utility classes like `bg-paper-1` are generated based on the `tailwind.config.js` color map, not by scanning the CSS. As long as a class name appears in a JSX file, it is kept.

**Potential issue**: If a color utility is only used in a CSS `@apply` inside `design-tokens.css` (a file not in Tailwind's `content` list), it might be purged.

**Assessment**: `design-tokens.css` uses raw CSS (no `@apply`), so this is not an issue for this evolution. The `@layer components` in `index.css` uses `@apply` with class names that appear in the config — those are safe. No action needed, but worth monitoring if `content` patterns change.

---

### OQ-002 — `font-variant-numeric: tabular-nums` and JetBrains Mono load

The DS `.t-mono` class uses `font-variant-numeric: tabular-nums` and references `var(--font-mono)` which maps to JetBrains Mono. JetBrains Mono is loaded via the Google Fonts import in `design-tokens.css`. Confirm after TASK-004 that the font actually loads (Network tab shows the JetBrains Mono request) and that tabular figures render correctly in the ComparisonTable.

---

### OQ-003 — `tracking-widest` correction: layout impact on narrow breakpoints

The PRD flags this as an edge case. `0.18em` vs `0.1em` is an 80% wider letter-spacing for all-caps labels. Any element using `tracking-widest` that is width-constrained on mobile may overflow or wrap differently.

**Action required in TASK-004**: Inspect the Landing page at 375px viewport width. Identify all elements using `tracking-widest` and confirm no overflow or unexpected line wrapping occurs.

---

### OQ-004 — The `design-tokens.css` drift warning comment

The risk table in `tech-specs.md` flags the possibility of a developer editing `frontend/src/design-tokens.css` instead of the DS source. The spec recommends adding a comment at the top of the file.

**Constraint**: The file must be a verbatim copy. A header comment would violate that.

**Resolution**: The comment should be placed in `index.css` near the import line instead:
```css
/* design-tokens.css is a verbatim copy of design-system/colors_and_type.css.
   DO NOT edit it directly. Update by replacing the entire file from the DS source. */
@import './design-tokens.css';
```
This keeps `design-tokens.css` truly verbatim while communicating the constraint to future developers. Add this to TASK-002 scope.
