# Spec Notes — EVO-022 Landing UI Polish

## PRD Interpretations

### FR-001 — Section background alternation

The page currently renders six sections in this order: Hero, MiniComparator, RoadmapSection, BenefitsGrid, PartnershipSection, Footer.

Current background state:
- Hero: no explicit `bg-*` class; inherits page default (`--paper-1` / `bg-paper-1` set on `<body>`). Has the `hero-grid-bg` utility which applies a grid pattern — it does not set a background color.
- MiniComparator: `bg-paper-2`
- RoadmapSection: `bg-paper-2`
- BenefitsGrid: no explicit `bg-*` class (inherits body default, effectively `paper-1`)
- PartnershipSection: `bg-ink-12`
- Footer: `bg-ink-12`

Two collisions exist:
1. MiniComparator (`bg-paper-2`) is immediately followed by RoadmapSection (`bg-paper-2`) — same color, no visual break.
2. PartnershipSection (`bg-ink-12`) is immediately followed by Footer (`bg-ink-12`) — same color. However a `<hr class="rule rule-strong">` renders at the top of the footer, which provides a hairline visual separator. The PRD's AC-001 refers to background color change specifically. Decision: treat this as a collision to fix.

Chosen alternation sequence (all tokens from the palette):
- Hero: `paper-1` (effective default, no change needed)
- MiniComparator: `paper-2` (keep existing)
- RoadmapSection: `paper-1` (changed from `paper-2`)
- BenefitsGrid: `paper-2` (added, was implicit `paper-1`)
- PartnershipSection: `ink-12` (keep existing)
- Footer: `ink-11` (changed from `ink-12`)

Rationale for RoadmapSection: switching to `paper-1` is the minimal change; it stays within the warm paper family and contrasts clearly with `paper-2`.

Rationale for BenefitsGrid: adding `bg-paper-2` restores the alternation after Roadmap switches to `paper-1`.

Rationale for Footer: `ink-11` (`#1a1a17`) is the next step in the ink scale, very close to `ink-12` but technically distinct. This preserves the dark footer aesthetic while satisfying the no-same-adjacent-color rule. Alternative was `paper-1` footer — rejected because it would break brand consistency (the project consistently uses a dark footer). Another alternative was keeping Partnership as `ink-12` and changing Footer to something lighter — rejected because the footer's dark treatment is established brand convention.

### FR-002 — Hero title "measured" typography

The current Hero heading in `Hero.jsx` is:
```
Wheels, measured. Not marketed.
```
The word "measured" is not wrapped in any element. The NoteBook spec requires the `<em>` element to receive the italic/brass treatment.

Decision: wrap "measured." (including the period) in `<em>` to match the NoteBook reference in `direction-comparison.html` (line 360: `Wheels, <em>measured.</em>`). The `.hero-title em` CSS rule in `index.css` will receive the four typography overrides.

The PRD specifies `font-weight: 300` and `letter-spacing: -0.05em` in addition to `font-style: italic` and `color: var(--brass-8)`. The direction-comparison.html NoteBook override only explicitly states `font-style: italic; color: var(--brass-8)` (line 158) — but the base `.hero-title em` rule (line 132) already defines `font-weight: 300; letter-spacing: -0.05em`. The PRD section 9 repeats all four values as the required treatment. All four must be set in the `.hero-title em` rule to be explicit and avoid dependency on the design-system preview file's base styles (which are not imported into the app).

### FR-003 — Brand favicon

The current `index.html` has:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```
And `public/favicon.svg` exists but is a generic purple bolt icon — it is NOT the MyBikeLab brand icon. This is effectively the same as having no brand favicon.

The MyBikeLab brand icon is `logo-mark.svg` in `src/assets/`. This file uses `currentColor` (no hardcoded fill), which means it would render as black in a browser tab (where the default painting color is black). This is acceptable and standard for SVG favicons.

Decision: replace `public/favicon.svg` with the content of `src/assets/logo-mark.svg`, with `currentColor` replaced by a fixed hex value (`#0e0f0c`, the `--ink-12` near-black) so it renders correctly as a standalone favicon without relying on CSS context. The `<link rel="icon">` declaration in `index.html` already exists with the correct `type="image/svg+xml"` and points to `/favicon.svg` — no change needed to `index.html`.

Alternative considered: change `href` in `index.html` to point to a different file (e.g., `logo-mark.svg` copied to `public/`). Rejected because it would require creating a new file in `public/` — instead, replacing the content of the existing `public/favicon.svg` is cleaner.

Note on base path: Vite base is `/MyBikeLabLP/`. The favicon `href="/favicon.svg"` is an absolute path from origin root, not from the Vite base. This is standard browser behavior — browsers always resolve favicons from origin root. The existing reference is already correct.

---

## Architecture Decisions

### AD-001 — Section backgrounds via Tailwind utility classes only

All background color changes are applied as Tailwind `bg-*` utility classes on the `<section>` elements, consistent with the existing pattern in the codebase (see `MiniComparator`, `RoadmapSection`, `PartnershipSection`). No new CSS classes, no inline styles.

Rejected: CSS classes in `index.css`. Unnecessary abstraction for a change this simple.

### AD-002 — Hero title `<em>` + CSS rule in `index.css`

The `<em>` wrapper is added in `Hero.jsx` markup. The typography override is added as a CSS rule for `.hero-title em` in `src/index.css` under the `@layer components` block, where `.hero-title` is already defined. This keeps the styling co-located with its parent rule.

Rejected: Tailwind utility classes directly on the `<em>` in JSX. `letter-spacing: -0.05em` is not a standard Tailwind step (closest is `tracking-tight: -0.025em`). Would require an arbitrary value `tracking-[-0.05em]` and additional style props — less readable and less aligned with the existing pattern of component-level CSS for the hero.

Rejected: Inline `style` prop on `<em>`. Works but bypasses the design system's CSS layer and is harder to audit.

### AD-003 — Favicon replaced in-place

The content of `public/favicon.svg` is replaced with the logo-mark shape, with `currentColor` resolved to `#0e0f0c`. No new files are created.

---

## Tradeoffs

- Footer color change (`ink-12` → `ink-11`): The visual difference is very subtle (near-black to near-black). The alternation rule is satisfied, but the perceptual impact is minimal. If the team later decides the footer should read as a clearly distinct dark zone from Partnership, switching to a lighter token (e.g., `ink-10` or `paper-3`) is a trivial follow-up. For now, preserving the dark footer aesthetic takes priority.
- Wrapping "measured." including the period: Consistent with the NoteBook reference in `direction-comparison.html`. The period inherits the brass color, which is intentional per the reference.

---

## Open Questions

1. **Footer `ink-11` vs a lighter alternative**: Is `ink-11` sufficient for AC-001, or does the team want a more perceptible contrast at the Partnership/Footer boundary? If the latter, `paper-2` or `paper-3` would work for the footer background — but this would be a design departure from the established dark footer.
2. **"measured." vs "measured"**: The NoteBook preview wraps "measured." with the period inside `<em>`. The PRD says "the word measured". Spec decision is to include the period (matching the reference), but this should be confirmed if there is a preference.
3. **Favicon color**: `#0e0f0c` (`--ink-12`) for the standalone SVG favicon. In dark-mode browser UI, this near-black icon may be hard to see. A light variant via `<link rel="icon" media="(prefers-color-scheme: dark)">` is out of scope per the PRD but may be worth noting.
