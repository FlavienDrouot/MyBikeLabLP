# Technical Specifications

## 1. General Information

- Evolution ID: EVO-016
- PRD reference: `evolutions/EVO-016_fonts-loading-optimization/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-27

---

## 2. Technical Context

### Technical objective

Move the Google Fonts request from CSS `@import` directives to HTML `<link>` elements with preconnect hints, trim the requested font weights from 7 to 6 (remove 900), introduce a `--navbar-height` CSS token as the single source of truth for navbar-offset-dependent layout values, and fix the Content Security Policy to permit the Google Fonts CDN origins.

### Affected architecture

- HTML entry point (`frontend/index.html`) — font loading strategy and CSP
- Design system source (`design-system/colors_and_type.css`) — token addition, `@import` removal
- Frontend design token copy (`frontend/src/design-tokens.css`) — synchronized `@import` removal
- Global stylesheet (`frontend/src/index.css`) — `scroll-padding-top` tokenization
- FilterPanel component (`frontend/src/components/MiniComparator/FilterPanel.jsx`) — sticky offset tokenization

### Impacted modules

| File | Change |
|---|---|
| `frontend/index.html` | Add preconnect hints + font stylesheet link; update CSP `font-src` and `style-src` |
| `design-system/colors_and_type.css` | Remove `@import`; add `--navbar-height` token |
| `frontend/src/design-tokens.css` | Remove `@import` (synchronized copy) |
| `frontend/src/index.css` | Replace `scroll-padding-top: 5rem` with `scroll-padding-top: var(--navbar-height)` |
| `frontend/src/components/MiniComparator/FilterPanel.jsx` | Replace Tailwind class `lg:top-20` with inline `style={{ top: 'var(--navbar-height)' }}` |

---

## 3. Technical Constraints

- No visual regression at any breakpoint (375 px, 768 px, 1280 px+).
- Lighthouse Performance score must not decrease; LCP must be equal to or lower than the pre-EVO-016 baseline.
- `--navbar-height` must be defined in `design-system/colors_and_type.css` only — not in any component or page stylesheet.
- The Google Fonts CDN must be reachable from the deployed environment; the CSP must be updated in the same commit as the `<link>` tags.
- `design-tokens.css` is a verbatim copy of `design-system/colors_and_type.css`; both files must be kept in sync (the `@import` must be removed from both).
- No automated tests are applicable for this evolution (pure HTML/CSS/layout change with no business logic). All validation is manual.

---

## 4. Architecture Decisions

### AD-001 — CSP must be updated to permit Google Fonts CDN origins

#### Description
The current CSP in `index.html` sets `font-src 'self'`, which blocks loading of font files from `fonts.gstatic.com`. It also sets `style-src 'self' 'unsafe-inline'`, which blocks the Google Fonts CSS stylesheet served from `fonts.googleapis.com`. Both directives must be extended to include the relevant origins.

Required CSP changes:
- `style-src`: add `https://fonts.googleapis.com`
- `font-src`: add `https://fonts.gstatic.com`

#### Motivation
Without this change, the browser blocks both the font CSS response from `fonts.googleapis.com` and the woff2 files from `fonts.gstatic.com`, rendering the font loading strategy inoperative regardless of the `<link>` tags. The fonts likely loaded from cache or the `@import` was already being blocked silently in the current deployment — this evolution makes the situation explicit and correct.

#### Rejected alternatives
- Removing the CSP entirely: unacceptable security regression.
- Using `font-src *` or `style-src *`: overly permissive; only the two known Google Fonts origins need to be whitelisted.

---

### AD-002 — `--navbar-height` value set to `5rem` (not `4rem`)

#### Description
The actual Navbar component height is `h-16` (4rem / 64px). However, the existing `scroll-padding-top` is `5rem` (80px) and the existing `FilterPanel` sticky offset is `top-20` (also 80px / 5rem). The intended behavior is that anchor-scroll targets and the sticky panel clear the navbar by a small margin. The `--navbar-height` token must reflect the intended offset (`5rem`), not the raw nav bar height (`4rem`), to preserve current visual behavior.

#### Motivation
Changing the value from `5rem` to `4rem` would cause a visible layout regression: anchor scroll targets would land 1rem too high, partially obscured by the navbar, and the sticky FilterPanel would overlap the bottom of the navbar. Both would be detected by the AC-008 visual review.

#### Rejected alternatives
- Setting `--navbar-height` to `4rem` and introducing a separate `--scroll-offset` token: over-engineering for a single component. The PRD specifies one token covering all navbar-height-dependent offsets.
- Setting `--navbar-height` to `4rem` and adding `calc(var(--navbar-height) + 1rem)` at each usage site: defeats the single-source-of-truth goal.

---

### AD-003 — FilterPanel sticky offset implemented via inline `style` attribute

#### Description
The current sticky offset in `FilterPanel` uses the Tailwind utility class `lg:top-20`. Tailwind utility classes are generated at build time from static strings; they cannot reference CSS custom properties. To consume `--navbar-height` at runtime, the sticky top offset must be applied via an inline `style` attribute: `style={{ top: 'var(--navbar-height)' }}`.

The `lg:` responsive prefix must be replicated: the inline style applies the token unconditionally, while `lg:sticky` retains the conditional stickiness. On small screens the element is not sticky, so the `top` value is irrelevant.

#### Motivation
Inline style is the simplest and most direct mechanism for applying a CSS custom property in a JSX component without adding a new CSS module rule or a Tailwind `extend.spacing` entry.

#### Rejected alternatives
- Adding `navbar-height` to `tailwind.config.js` spacing extension: would create a coupling between the design system token and the Tailwind config file; requires keeping them in sync manually.
- Adding a rule to `FilterPanel.module.css`: valid but adds indirection for a single-property override; inline style is more self-documenting in this context.

---

### AD-004 — `@import` removed from both `design-tokens.css` and `design-system/colors_and_type.css`

#### Description
`frontend/src/design-tokens.css` is a verbatim copy of `design-system/colors_and_type.css` (as stated in its header comment). The `@import` directive must be removed from both files. The canonical change is made in `design-system/colors_and_type.css`; the synchronized copy in `design-tokens.css` must receive the identical removal.

#### Motivation
`design-tokens.css` is what the Vite build actually processes. If the `@import` remains there, FR-001 and AC-003 are not met even if the source file is updated.

#### Rejected alternatives
- Updating only `design-system/colors_and_type.css`: would leave the active CSS file (`design-tokens.css`) still importing Google Fonts via CSS, failing AC-003.

---

## 5. Task Breakdown

---

# TASK-001 — Update Content Security Policy in `index.html`

## Objective
Extend the existing CSP `<meta>` tag in `frontend/index.html` to permit Google Fonts origins: add `https://fonts.googleapis.com` to `style-src` and `https://fonts.gstatic.com` to `font-src`. This task is a prerequisite for TASK-002: the font loading link tags will be blocked by the CSP until this change is in place.

## Required context
- The Navbar component uses height class `h-16` (4rem). The current scroll and sticky offsets use `5rem` — this context is informational for this task only; no height-related change is needed here.
- The CSP is declared as a `<meta http-equiv="Content-Security-Policy">` tag, not via a server header.
- Current relevant CSP directives:
  - `style-src 'self' 'unsafe-inline'`
  - `font-src 'self'`

## Potentially impacted files
- `frontend/index.html`

## Inputs
- `frontend/index.html` as it currently exists (single `<meta>` CSP tag on line 5).

## Expected outputs
- `frontend/index.html` with the CSP `<meta>` tag modified:
  - `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
  - `font-src 'self' https://fonts.gstatic.com`
  - All other directives unchanged.

## Constraints
- Do not remove or relax any other CSP directive.
- Do not add wildcard origins (`*`).
- The `<meta>` tag must remain on a single line (no reformatting of the overall structure).

## Dependencies
none

## Validation criteria
- [ ] `index.html` CSP `style-src` contains `https://fonts.googleapis.com`.
- [ ] `index.html` CSP `font-src` contains `https://fonts.gstatic.com`.
- [ ] All other CSP directives are identical to their pre-task values.
- [ ] The HTML file remains valid (no syntax errors).

## Tests to implement
### Unit
None applicable.
### Integration
None applicable. Manual verification only: open browser DevTools Network tab and confirm no CSP violations are reported for fonts.googleapis.com or fonts.gstatic.com after TASK-002 is applied.

---

# TASK-002 — Add font preconnect hints and stylesheet link to `index.html`

## Objective
Add two `<link rel="preconnect">` hints and one `<link rel="stylesheet">` tag to `frontend/index.html` to load Inter and JetBrains Mono from Google Fonts at the HTML level, requesting only the 6 Inter weights used in the design system (300, 400, 500, 600, 700, 800) and the 3 JetBrains Mono weights (400, 500, 600). Weight 900 must not be included.

## Required context
- The three `<link>` elements must appear in `<head>`, after the existing `<meta>` tags and before `</head>`.
- Preconnect to `https://fonts.googleapis.com` (no `crossorigin` attribute).
- Preconnect to `https://fonts.gstatic.com` with `crossorigin` attribute (anonymous CORS — required because font files are fetched cross-origin).
- The font stylesheet `<link>` must come after both preconnect hints.
- The Google Fonts URL to use:
  `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap`
- TASK-001 must be complete before this task is deployed; otherwise the CSP blocks the font requests.

## Potentially impacted files
- `frontend/index.html`

## Inputs
- `frontend/index.html` after TASK-001.

## Expected outputs
`frontend/index.html` `<head>` section containing (in order, before `</head>`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap">
```

## Constraints
- The `href` in the font stylesheet link must contain exactly `wght@300;400;500;600;700;800` for Inter and must not contain `900`.
- The `crossorigin` attribute must be present on the `fonts.gstatic.com` preconnect link and absent on the `fonts.googleapis.com` preconnect link.
- No other `<link>` or `<script>` tags may be added, removed, or reordered.

## Dependencies
TASK-001

## Validation criteria
- [ ] `index.html` contains `<link rel="preconnect" href="https://fonts.googleapis.com">` before the font stylesheet link.
- [ ] `index.html` contains `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` before the font stylesheet link.
- [ ] The font stylesheet `href` contains `wght@300;400;500;600;700;800` for Inter.
- [ ] The font stylesheet `href` does not contain `900`.
- [ ] Both Inter and JetBrains Mono families are present in the URL.
- [ ] `display=swap` is present in the URL.

## Tests to implement
### Unit
None applicable.
### Integration
None applicable. Manual verification: load the app in a browser, open DevTools Network tab filtered on "Font" — confirm Inter and JetBrains Mono woff2 files load from `fonts.gstatic.com` with HTTP 200, and no CSP violations are reported.

---

# TASK-003 — Remove `@import` from `design-system/colors_and_type.css` and `design-tokens.css`

## Objective
Remove the CSS `@import url('https://fonts.googleapis.com/...')` directive from both `design-system/colors_and_type.css` and `frontend/src/design-tokens.css`. After this task, no CSS file in the project imports Google Fonts via CSS.

## Required context
- The `@import` line is identical in both files (line 14 in `design-system/colors_and_type.css`, line 15 in `frontend/src/design-tokens.css`).
- `design-tokens.css` is described in its own header comment as "DO NOT EDIT — verbatim copy of design-system/colors_and_type.css. Update by replacing this file entirely." For this task, the two files are updated in parallel because the verbatim copy mechanism does not apply automated synchronization — the comment is a convention, not a tool.
- The comment block above the `@import` line (lines 10–13 in `design-system/colors_and_type.css`, lines 11–14 in `design-tokens.css`) describes the fonts section. This comment block should also be removed since it references an `@import` that will no longer exist.
- All other content in both files must be preserved exactly.

## Potentially impacted files
- `design-system/colors_and_type.css`
- `frontend/src/design-tokens.css`

## Inputs
- `design-system/colors_and_type.css` as currently exists.
- `frontend/src/design-tokens.css` as currently exists.

## Expected outputs
- Both files with the font comment block (lines beginning with `/* --- Fonts (Google Fonts)`) and the `@import url(...)` line removed.
- All remaining content (`:root` block, global baseline, type tokens, component tokens) preserved without modification.

## Constraints
- Do not alter any CSS custom property declaration, rule, or comment outside the font section.
- The removal must be applied to both files in the same commit.

## Dependencies
TASK-002 (font loading via HTML must be in place before the CSS `@import` is removed, so fonts are never absent during a partial deployment state)

## Validation criteria
- [ ] `design-system/colors_and_type.css` contains no `@import` directive referencing `fonts.googleapis.com`.
- [ ] `frontend/src/design-tokens.css` contains no `@import` directive referencing `fonts.googleapis.com`.
- [ ] A search across all CSS files under `frontend/src/` and `design-system/` returns zero matches for `@import.*fonts\.googleapis\.com`.
- [ ] All CSS custom properties, type token classes, and global baseline rules remain intact in both files.

## Tests to implement
### Unit
None applicable.
### Integration
None applicable. Manual verification: run `grep -r "fonts.googleapis.com" frontend/src design-system` — must return no results.

---

# TASK-004 — Add `--navbar-height` token to `design-system/colors_and_type.css` and `design-tokens.css`

## Objective
Add the CSS custom property `--navbar-height: 5rem` to the `LAYOUT` section of `:root` in both `design-system/colors_and_type.css` and `frontend/src/design-tokens.css`. This token is the single source of truth for all layout values that depend on the navbar height offset.

## Required context
- The value `5rem` (80px) is the intended scroll and sticky offset, not the actual navbar bar height (`h-16` = 4rem). See AD-002 in this spec for the full rationale.
- In `design-system/colors_and_type.css`, the `LAYOUT` section currently ends at line 209 with `--grid-unit: 8px;` (closing `}` on the next line).
- The token must be placed inside the `:root { }` block in the `LAYOUT` section, after the existing layout tokens.
- The identical addition must be made in `frontend/src/design-tokens.css` (same section, same position relative to existing tokens).

## Potentially impacted files
- `design-system/colors_and_type.css`
- `frontend/src/design-tokens.css`

## Inputs
- `design-system/colors_and_type.css` current state (after TASK-003 if run in sequence, or independently since this section is unaffected by the `@import` removal).
- `frontend/src/design-tokens.css` current state (same note).

## Expected outputs
Both files contain the following addition in their `LAYOUT` section, after `--grid-unit: 8px;`:
```css
  --navbar-height: 5rem;  /* sticky top offset for scroll anchors and floating panels */
```

## Constraints
- The token must be declared inside `:root`, in the `LAYOUT` section only — not at the top level or in any selector other than `:root`.
- The value must be `5rem`. Do not use `px`, `em`, or a `calc()` expression.
- The addition must be made in both files in the same commit.
- No other lines in either file may be modified.

## Dependencies
none (this task is independent; TASK-005 and TASK-006 depend on it)

## Validation criteria
- [ ] `design-system/colors_and_type.css` contains `--navbar-height: 5rem` inside `:root`.
- [ ] `frontend/src/design-tokens.css` contains `--navbar-height: 5rem` inside `:root`.
- [ ] The token does not appear in any file other than these two.
- [ ] No other tokens or rules in either file were modified.

## Tests to implement
### Unit
None applicable.
### Integration
None applicable. Manual verification: open browser DevTools, inspect the computed `--navbar-height` value on the `html` element — must resolve to `80px`.

---

# TASK-005 — Replace `scroll-padding-top` hardcoded value in `index.css`

## Objective
Replace the hardcoded `scroll-padding-top: 5rem` on the `html` selector in `frontend/src/index.css` with `scroll-padding-top: var(--navbar-height)`.

## Required context
- The current `html` rule in `frontend/src/index.css` (inside `@layer base`) is:
  ```css
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 5rem;
  }
  ```
- After this task, the rule must be:
  ```css
  html {
    scroll-behavior: smooth;
    scroll-padding-top: var(--navbar-height);
  }
  ```
- `--navbar-height` is defined as `5rem` (see TASK-004), so the computed value is identical to the current hardcoded value. No visual change occurs.
- `index.css` imports `design-tokens.css` on its first line, which exposes all `:root` tokens including `--navbar-height`.

## Potentially impacted files
- `frontend/src/index.css`

## Inputs
- `frontend/src/index.css` as currently exists.

## Expected outputs
- `frontend/src/index.css` with the `html` rule's `scroll-padding-top` property changed to `var(--navbar-height)`.
- All other rules and declarations in the file are unchanged.

## Constraints
- Only the `scroll-padding-top` value changes. `scroll-behavior: smooth` must remain.
- No other lines in the file may be modified.

## Dependencies
TASK-004

## Validation criteria
- [ ] `frontend/src/index.css` contains `scroll-padding-top: var(--navbar-height)` on the `html` selector.
- [ ] `frontend/src/index.css` contains no hardcoded length value for `scroll-padding-top`.
- [ ] `scroll-behavior: smooth` is still present on the `html` rule.
- [ ] All other rules in the file are unchanged.

## Tests to implement
### Unit
None applicable.
### Integration
None applicable. Manual verification: click a nav anchor link (e.g. `#tool`) — the section heading must be fully visible below the navbar without overlap.

---

# TASK-006 — Replace hardcoded sticky offset in `FilterPanel`

## Objective
Replace the Tailwind class `lg:top-20` on the `<aside>` element in `FilterPanel` with an inline `style` attribute referencing `--navbar-height`, so the sticky top offset consumes the design system token.

## Required context
- The current JSX for the `FilterPanel` `<aside>` (line 446 of `frontend/src/components/MiniComparator/FilterPanel.jsx`):
  ```jsx
  <aside className="card p-5 lg:p-6 space-y-6 h-fit lg:sticky lg:top-20">
  ```
- After this task:
  ```jsx
  <aside
    className="card p-5 lg:p-6 space-y-6 h-fit lg:sticky"
    style={{ top: 'var(--navbar-height)' }}
  >
  ```
- The `top` inline style applies unconditionally (regardless of viewport size). This is safe because on small screens the element is not sticky (`lg:sticky` makes it sticky only at `lg` and above), so the `top` value has no visual effect below that breakpoint.
- `--navbar-height` is `5rem` (AD-002), identical to the current `top-20` value (`top-20` = 5rem in Tailwind's default spacing scale). No visual change occurs.

## Potentially impacted files
- `frontend/src/components/MiniComparator/FilterPanel.jsx`

## Inputs
- `frontend/src/components/MiniComparator/FilterPanel.jsx` as currently exists.

## Expected outputs
- The `<aside>` opening tag modified: `lg:top-20` removed from `className`; `style={{ top: 'var(--navbar-height)' }}` added as a prop.
- No other JSX, logic, or import in the file is modified.

## Constraints
- Only the `<aside>` opening tag on line 446 changes. No other lines may be modified.
- `lg:sticky` must be retained in `className`.
- `lg:top-20` must be removed from `className`.
- The inline `style` object must use the exact string `'var(--navbar-height)'` as the value for `top`.

## Dependencies
TASK-004

## Validation criteria
- [ ] The `<aside>` element in `FilterPanel` has no `top-20` or `lg:top-20` class.
- [ ] The `<aside>` element has `style={{ top: 'var(--navbar-height)' }}`.
- [ ] `lg:sticky` remains in `className`.
- [ ] No other code in `FilterPanel.jsx` is modified.
- [ ] At desktop viewport (≥1024 px), the sticky FilterPanel top edge aligns with the bottom of the Navbar with the same spacing as before.

## Tests to implement
### Unit
None applicable.
### Integration
None applicable. Manual verification: at desktop viewport, scroll the page past the FilterPanel top position — it must stick with its top edge clearing the navbar at the same visual position as before the change.

---

## 6. Global Validation Strategy

### Unit validation
Not applicable. This evolution contains no business logic, stateful behavior, or JavaScript changes beyond a JSX attribute swap.

### Integration validation
- Load the application in a browser after all tasks are applied.
- Open DevTools Network tab → confirm Inter and JetBrains Mono woff2 files load from `fonts.gstatic.com` with HTTP 200.
- Confirm no CSP violation errors appear in the DevTools Console.
- Confirm no `@import` for Google Fonts remains by searching across `frontend/src/` and `design-system/`.

### Functional validation
- AC-001: verify the font stylesheet `href` contains `wght@300;400;500;600;700;800` and does not contain `900`.
- AC-002: verify preconnect hints are present and in the correct order in `index.html`.
- AC-003: grep across all CSS files for `@import.*fonts.googleapis.com` — must return zero results.
- AC-004: verify `--navbar-height` is declared exactly once, in `design-system/colors_and_type.css`.
- AC-005: verify `index.css` uses `scroll-padding-top: var(--navbar-height)`.
- AC-006: verify `FilterPanel` `<aside>` uses `style={{ top: 'var(--navbar-height)' }}`.

### Non-regression validation
- AC-007: Run Lighthouse Performance audit on the production build before and after. Record and compare Performance score and LCP.
- AC-008: Visual review at 375 px, 768 px, and 1280 px+ — no typographic, layout, or spacing change relative to the pre-EVO-016 baseline.
- Click anchor links (`#tool`, `#roadmap`, `#partnerships`, `#contact`) and verify the scroll target clears the navbar correctly.
- At desktop viewport, scroll to trigger FilterPanel stickiness and verify the top offset is unchanged.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| CSP blocks fonts if TASK-001 is not deployed before TASK-002 | Fonts fail to load silently; page renders in system fallback font | TASK-002 depends on TASK-001; deploy atomically or in sequence |
| `design-tokens.css` `@import` not removed (TASK-003 applied only to source) | AC-003 fails; font still loaded via CSS `@import` in the deployed build | TASK-003 spec explicitly requires both files; validate with grep |
| Navbar height value drift (`4rem` vs `5rem` confusion) | Visual regression on anchor scrolls and sticky panel | AD-002 documents the rationale; `--navbar-height: 5rem` is specified explicitly |
| Tailwind class `top-20` left in FilterPanel `className` | Tailwind generates an inline `top: 5rem` override that wins over the inline style (same specificity, Tailwind utility class appears in stylesheet — inline style actually wins regardless) | The inline `style` attribute has higher specificity than a stylesheet rule, so even if `top-20` is accidentally left in, the inline style wins. Still: remove `top-20` for correctness. |
| `display=swap` omitted from font URL | FOUT replaced by FOIT; text invisible until fonts load | `display=swap` is included in the specified font URL |

---

## 8. Rollback Plan

- All changes are in static HTML/CSS/JSX files with no data or API side effects.
- Rollback: revert the five modified files to their pre-EVO-016 state via `git revert` or `git checkout -- <file>` and redeploy.
- The Google Fonts CDN URL change (removal of weight 900) is additive-safe: reverting restores the 7-weight URL without any visible regression.
