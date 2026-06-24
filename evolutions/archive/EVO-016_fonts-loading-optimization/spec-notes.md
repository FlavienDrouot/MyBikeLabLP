# Spec Notes — EVO-016 Fonts Loading Optimization

---

## PRD interpretations

### The PRD does not mention the Content Security Policy

The PRD (Section 9, Constraints) states: "The Google Fonts CDN must remain available in the deployment environment (no CSP restrictions on external font origins)." This is written as a deployment environment constraint, not a task.

However, `frontend/index.html` currently contains `font-src 'self'` and `style-src 'self' 'unsafe-inline'` in its `<meta>` CSP tag. These directives actively block Google Fonts origins (`fonts.googleapis.com` and `fonts.gstatic.com`). The move from CSS `@import` to HTML `<link>` tags cannot succeed without updating this CSP.

Interpretation applied: **the CSP update is a required implementation task** (TASK-001), not a pre-existing external condition. It is scoped to the minimum necessary change: adding `https://fonts.googleapis.com` to `style-src` and `https://fonts.gstatic.com` to `font-src`.

Open question: why does the current deployment seem to render Inter correctly despite the `font-src 'self'` restriction? Possible explanations: (a) the `@import` in CSS is also blocked but fonts are served from cache, (b) the CSP is not enforced at the hosting level (GitHub Pages may ignore `<meta>` CSP in some configurations), or (c) the `@import` bypass was a known issue. Regardless, the correct path is to fix the CSP explicitly.

---

### The PRD lists four impacted files; the codebase has five

Section 7 of the PRD lists:
- `frontend/index.html`
- `frontend/src/index.css`
- `frontend/src/design-system/colors_and_type.css` (note: the actual path is `design-system/colors_and_type.css`, at the project root level, not under `frontend/src/`)
- `FilterPanel` component

The PRD does not mention `frontend/src/design-tokens.css`. Codebase inspection reveals this file is a verbatim copy of `design-system/colors_and_type.css` and contains the same `@import` directive. It is the file actually consumed by the Vite build (imported by `index.css` on line 1). Removing the `@import` only from the source file while leaving it in `design-tokens.css` would fail AC-003.

Decision applied: **TASK-003 covers both files**. The PRD's omission of `design-tokens.css` is treated as a gap discovered during codebase analysis.

---

### The PRD specifies `--navbar-height` in `design-system/colors_and_type.css`; implementation requires adding it to `design-tokens.css` as well

For the same reason as above: `design-tokens.css` is what the build processes. TASK-004 adds the token to both files.

---

## Architecture decision rationale

### AD-001 — Why the CSP update is a separate task (TASK-001)

The CSP change is a security-sensitive configuration edit with its own validation criteria (no unintended directives loosened). Isolating it in TASK-001 makes it independently reviewable and ensures it is not accidentally omitted when the font link tags are added (TASK-002 depends on TASK-001).

### AD-002 — Why `--navbar-height` is `5rem` and not `4rem`

The Navbar renders with `h-16` (4rem = 64px). But both existing offset values in the codebase — `scroll-padding-top: 5rem` in `index.css` and `top-20` (= 5rem) in `FilterPanel` — use 80px. The extra 1rem acts as a breathing gap between the navbar bottom edge and the scroll-target heading. The purpose of `--navbar-height` as defined in the PRD is to be "the single source of truth for any layout value that depends on the navbar height." The token therefore captures the full scroll offset intent (navbar + gap), not the raw nav bar height.

If the token were set to `4rem`:
- `scroll-padding-top: var(--navbar-height)` would change from 80px to 64px — a visible regression (AC-008 failure).
- `FilterPanel` sticky top would change from 80px to 64px — visible overlap with the navbar bottom (AC-008 failure).

A possible future improvement would be to decompose this into `--navbar-height: 4rem` and `--scroll-offset: calc(var(--navbar-height) + 1rem)`, but the PRD explicitly scopes to a single token and prohibits any visual change. That decomposition is out of scope for EVO-016.

### AD-003 — Why inline `style` is preferred over a Tailwind config extension for the FilterPanel offset

Three options were considered:

1. **Tailwind config extension**: Add `spacing: { 'navbar': 'var(--navbar-height)' }` to `tailwind.config.js`, then use `lg:top-navbar`. This works but couples the design token to the build tool configuration — a developer updating `--navbar-height` would also need to know about the Tailwind extension to maintain it.

2. **CSS module rule**: Add `.stickyPanel { top: var(--navbar-height); }` to `FilterPanel.module.css`. Clean from a CSS perspective, but adds a new class definition for a single property that is only meaningful on one element.

3. **Inline `style` attribute**: `style={{ top: 'var(--navbar-height)' }}`. Directly self-documenting at the usage site; no additional files; no coupling to Tailwind config. The tradeoff is that inline styles are not co-located with the other styling (Tailwind classes), but for a single token reference this is acceptable and standard practice in React when consuming CSS custom properties.

Option 3 was selected as the minimum-footprint approach consistent with the rest of the codebase.

---

## Tradeoffs

### Moving fonts to HTML vs. self-hosting (woff2 files)

Self-hosting woff2 files eliminates the DNS lookup, TCP connection, and CDN round-trip entirely, giving the best possible LCP improvement. However, the PRD explicitly places self-hosting out of scope (Section 8). The HTML `<link>` with preconnect approach is the middle ground: it parallelizes the connection to Google Fonts with page parsing, eliminating the render-blocking CSS `@import` penalty while staying within scope.

### Removing weight 900 vs. keeping it

The design system's `--weight-black` token is defined as `800`, not `900`. No type token class in `colors_and_type.css` uses `font-weight: 900`. The PRD specifies exactly the 6 weights in use. Weight 900 is redundant network weight (pun intended) and its removal is the correct minimal request.

### Using `display=swap` vs. `display=optional`

`display=swap` is retained from the existing Google Fonts URL. `display=optional` would give better LCP by not waiting for font files if they are not in cache, but could cause text to render in the fallback font permanently on first load. The existing behavior uses `swap`, and changing font-display behavior would be a functional change outside EVO-016 scope.

---

## Open questions

### OQ-001 — Why does the app currently render Inter despite `font-src 'self'`?

As noted above, the current CSP blocks external font files. Inter renders correctly today, which is unexpected. Before implementing EVO-016, confirm whether: (a) GitHub Pages strips the `<meta>` CSP tag (unlikely), (b) the browser serves Inter from a previous cache entry, or (c) the `@import` in `design-tokens.css` is itself blocked and Inter falls back to `-apple-system` which appears visually similar. This does not block EVO-016 implementation but is worth verifying during the Lighthouse pre/post comparison.

### OQ-002 — Is the `design-tokens.css` sync convention manual or tool-assisted?

The file header says "Update by replacing this file entirely." No build script or npm script was found that automates this sync. If a sync script exists and is run during CI, removing the `@import` from only `design-system/colors_and_type.css` and then running the sync script would correctly update `design-tokens.css`. The TASK-003 specification assumes no automated sync (direct edit of both files). Confirm with the project owner before implementation.

### OQ-003 — Navbar height token naming

The PRD names the token `--navbar-height`. As documented in AD-002, the value `5rem` represents a scroll offset (navbar height + breathing gap), not strictly the navbar height. A more precise name might be `--scroll-offset-top` or `--sticky-top-offset`. However, the PRD explicitly uses `--navbar-height` and changing this name would go against the spec. Flagged here for awareness; do not rename without explicit instruction.
