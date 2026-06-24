# Needs Assessment

## 1. General Information

- Evolution ID: EVO-016
- Title: Fonts Loading Optimization
- Author: Flavien Drouot
- Date: 2026-05-27
- Status: Draft
- Priority: Low (code hygiene)

---

## 2. Context

### Current situation

The MyBikeLab frontend loads the Inter font family via a Google Fonts `@import` directive in `frontend/src/index.css`. The current import requests 7 font weights (300 through 900), while only 6 are used in the design system (300, 400, 500, 600, 700, 800). Additionally, `index.css` contains a hardcoded `scroll-padding-top: 5rem` tied to the navbar height with no CSS token.

### Identified problem

Three issues identified in the `2026-05-26_design-system-frontend-audit.md` (points P3-1, P3-2, P3-5):

1. **Unnecessary font weight**: Inter weight 900 is loaded but unused in the design system — wasted network bytes.
2. **`@import` font loading strategy**: `@import` in CSS delays font discovery relative to `<link rel="preconnect">` + `<link rel="stylesheet">` in `<head>`, marginally degrading LCP.
3. **Hardcoded scroll offset**: `scroll-padding-top: 5rem` is not connected to any navbar height token — it will drift silently if the navbar height changes.

### Business motivation

The gain is primarily maintainability and code hygiene. The font loading improvement is marginal in absolute terms but represents good practice for a performance-conscious product. Tokenizing the navbar height prevents silent regressions if the navbar evolves.

---

## 3. Business Objective

- Reduce font download payload by removing the unused Inter 900 weight.
- Improve font discovery timing by migrating from CSS `@import` to HTML `<link rel="preconnect">`.
- Improve codebase maintainability by linking `scroll-padding-top` and sticky offsets to a single navbar height CSS token.

---

## 4. Scope

### Included

- Reduce the Inter Google Fonts URL to 6 weights: 300, 400, 500, 600, 700, 800.
- Migrate font loading from `@import` in `index.css` to `<link rel="preconnect">` + `<link rel="stylesheet">` in `index.html`.
- Add `preconnect` for both `fonts.googleapis.com` and `fonts.gstatic.com` (with `crossorigin`).
- Define `--navbar-height` in `design-system/colors_and_type.css` (EVO-007 is complete) and consume it in `scroll-padding-top` and any sticky offset that depends on the navbar height.
- Verify in DevTools (Network + Lighthouse) that font requests are discovered earlier and LCP is not degraded.

### Excluded

- Self-hosting fonts (woff2 in `fonts/`) — deferred to a future evolution if CSP or performance requires it.
- Reducing character subsets (latin-only, etc.) — default Google Fonts subsets are retained.
- Any visual change.

---

## 5. Constraints

### Business constraints

- No visual regression allowed.
- Lighthouse Performance score must be ≥ current score; LCP must be at least equivalent.

### Known technical constraints

- EVO-007 is complete: `--navbar-height` must be added to `design-system/colors_and_type.css`, not defined locally.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

This evolution is a developer-facing technical optimization with no end-user use case. The user benefit is perceived: marginally faster font rendering on first load, and reduced risk of visual drift if the navbar height changes.

---

## 7. Acceptance Criteria

- [ ] The Google Fonts URL in `index.html` contains `wght@300;400;500;600;700;800` (no weight 900).
- [ ] `index.html` contains `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`.
- [ ] `index.css` no longer contains an `@import` for Google Fonts.
- [ ] `--navbar-height` is defined once in `design-system/colors_and_type.css` and consumed by `scroll-padding-top` and any sticky component that depends on the navbar height.
- [ ] Lighthouse Performance score is ≥ current score; LCP is at least equivalent.
- [ ] No visual regression.

---

## 8. Open Questions

None.

---

## 9. Assumptions

- The sticky offset `sticky top-20` in `FilterPanel.jsx` corresponds to 5rem (80px at Tailwind's default scale) and should be consolidated with `--navbar-height`.
- The Google Fonts CDN is available in the target deployment environment (no CSP restrictions).
