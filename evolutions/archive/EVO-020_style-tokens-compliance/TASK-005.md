# TASK-005 — Add prefers-reduced-motion global rule to index.css

## Objective

Add a `@media (prefers-reduced-motion: reduce)` CSS block to the global stylesheet (`src/index.css`) that suppresses perceptible movement animations for users who have enabled the reduced-motion accessibility setting in their operating system.

## Required context

- The file is `MyBikeLab/frontend/src/index.css`.
- The file currently contains `@layer base`, `@layer components`, and Tailwind directives. There is no `prefers-reduced-motion` rule.
- The new rule must be placed **outside** any `@layer` block (at the root level of the file, after the existing layer blocks) so it is not subject to Tailwind's layer ordering and applies unconditionally.
- The rule targets `*`, `*::before`, and `*::after` to cover all elements and pseudo-elements.
- It sets both `transition-duration` and `animation-duration` to `0.01ms`.
  - `0.01ms` — not `0ms` — is required: some CSS animation libraries check for a non-zero duration and behave incorrectly when duration is exactly `0`.
  - At `0.01ms`, all motion is perceptually instant and qualifies as "suppressed" for accessibility purposes.
- Color and opacity transitions are not explicitly excluded from this rule. Setting duration to `0.01ms` makes color and opacity changes effectively instantaneous (they still fire and apply — the state change is not blocked), satisfying the requirement that they "continue to function normally".
- The rule must not be wrapped in a Tailwind `@layer` directive.

**Current end of `src/index.css` (for placement reference):**
```css
@layer components {
  /* ... last rule in the file ... */
  .hero-grid-bg {
    background-image: ...;
    background-size: 32px 32px;
  }
}
```

## Potentially impacted files

- `MyBikeLab/frontend/src/index.css`

## Inputs

The rule to append (after the closing `}` of the last `@layer components` block):
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

## Expected outputs

The rule above is present at the end of `src/index.css`, after all existing `@layer` blocks. No existing rule is modified or removed.

## Constraints

- The rule must be placed outside any `@layer` block.
- Duration value must be `0.01ms`, not `0`, `0s`, or `0ms`.
- `!important` is required to override inline Tailwind-generated `transition-duration` and `animation-duration` values that may have higher specificity.
- No existing CSS rule in `index.css` is modified, reordered, or removed.
- No new CSS custom properties or tokens are introduced.

**UI guideline (Accessibility — prefers-reduced-motion):** Keep opacity and color transitions, remove position and movement animations. Never zero animation — just near-zero (`0.01ms`). Color and opacity transitions are exempt from suppression; they must continue to apply (at instantaneous speed).

## Dependencies

none

## Validation criteria

- [ ] `src/index.css` contains a `@media (prefers-reduced-motion: reduce)` block.
- [ ] The block targets `*`, `*::before`, `*::after`.
- [ ] Inside the block: `transition-duration: 0.01ms !important` and `animation-duration: 0.01ms !important` are present.
- [ ] The block is placed outside any `@layer` directive.
- [ ] No existing rule in `index.css` has been modified or removed.
- [ ] With OS reduced-motion enabled: all movement/position animations on the landing page are imperceptible (chevron rotation, scroll animations, any transitions involving `transform` or `top/left`).
- [ ] With OS reduced-motion enabled: hover states that change color (e.g., `btn-primary` on hover, brass-colored links) still apply — the color change is visible as an instant state change.
- [ ] With OS reduced-motion enabled: opacity transitions (e.g., toggling a filter's disabled state) still apply instantly.
- [ ] With OS reduced-motion disabled: no visual regression — all animations and transitions function as before.

## Tests to implement

### Unit
- None required (CSS-only change, no logic).

### Integration
- Manual (macOS): System Settings → Accessibility → Display → enable "Reduce Motion". Open the landing page. Interact with hover states on buttons — confirm color changes are immediate but no position/scale animation plays.
- Manual (iOS): Settings → Accessibility → Motion → enable "Reduce Motion". Open the landing page on Safari. Confirm same behavior.
- Manual (any OS, reduced-motion enabled): Toggle a filter off and on — confirm the opacity change applies instantly.
- Manual (reduced-motion disabled): Browse the full landing page — confirm all animations play normally and no regression is introduced.
