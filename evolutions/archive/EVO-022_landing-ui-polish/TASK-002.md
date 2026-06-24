# TASK-002 — Hero title "measured" NoteBook typography treatment

## Objective

Apply the NoteBook-direction typography override to the word "measured." in the Hero section's main heading: italic, brass-colored, lighter weight, tighter tracking. No other words in the heading change. No layout, content, or behavior changes.

## Required context

**Current Hero heading markup** (`frontend/src/components/Hero.jsx`, line 12):
```jsx
<h1 className="hero-title text-ink-10">
  Wheels, measured. Not marketed.
</h1>
```

The word "measured." (including the period) is currently plain text with no wrapper element.

**Required output** — the heading must become:
```jsx
<h1 className="hero-title text-ink-10">
  Wheels, <em>measured.</em> Not marketed.
</h1>
```

**Required CSS rule** — add to `frontend/src/index.css`, inside `@layer components`, immediately after the `.hero-title` block (which ends at line 53):

```css
.hero-title em {
  font-style: italic;
  font-weight: 300;
  letter-spacing: -0.05em;
  color: var(--brass-8);
}
```

Source of truth: `design-system/preview/direction-comparison.html`.
- Base `.hero-title em` (lines 131–134): `font-style: normal; font-weight: 300; letter-spacing: -0.05em; color: var(--ink-10);`
- NoteBook override (line 158): `.dir-notebook .hero-title em { font-style: italic; color: var(--brass-8); }`

The NoteBook override replaces `font-style` and `color`; the base values for `font-weight: 300` and `letter-spacing: -0.05em` are inherited. Since the app's CSS does not import the design-system preview file, all four properties must be explicit in the single `.hero-title em` rule.

**Token value**: `--brass-8: #a88846` (deep brass — text on paper). Defined in `frontend/src/design-tokens.css`.

**Existing `.hero-title` rule** in `frontend/src/index.css` (lines 48–53):
```css
.hero-title {
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.045em;
  @apply text-4xl sm:text-5xl lg:text-6xl;
}
```
The new `.hero-title em` rule is placed directly after this block.

## Potentially impacted files

- `frontend/src/components/Hero.jsx`
- `frontend/src/index.css`

No other files are touched.

## Inputs

- `Hero.jsx` line 12: `  Wheels, measured. Not marketed.` (plain text node inside `<h1>`)
- `index.css` lines 48–53: existing `.hero-title` block

## Expected outputs

**`Hero.jsx`** — replace the text node:
```
  Wheels, measured. Not marketed.
```
with:
```
  Wheels, <em>measured.</em> Not marketed.
```

**`index.css`** — insert after the `.hero-title` closing brace (`}`):
```css
  .hero-title em {
    font-style: italic;
    font-weight: 300;
    letter-spacing: -0.05em;
    color: var(--brass-8);
  }
```
(Indented consistently with the surrounding `@layer components` block.)

## Constraints

**UI guidelines (applicable rules):**

- Use `var(--brass-8)` as a CSS custom property — do not substitute a raw hex value.
- Do not add Tailwind utility classes to the `<em>` element. The typography treatment lives entirely in the `.hero-title em` CSS rule.
- The `<em>` element must not carry any `className`, `style`, or other attribute.
- Do not change the `className` on the `<h1>` element. `hero-title text-ink-10` must remain unchanged.
- Do not change any other text, element, or attribute in `Hero.jsx`.
- The four CSS properties (`font-style`, `font-weight`, `letter-spacing`, `color`) must all be explicit in the rule — they cannot be omitted and left to inheritance from the design-system preview file (which is not imported into the app).
- No gradient text on the heading — the color change is a flat token value, not a CSS gradient.

## Dependencies

none

## Validation criteria

- [ ] Open the landing page (`npm run dev`). Read the Hero heading. Confirm "measured." appears italic and visually gold/brass-colored, distinct from the surrounding dark bold text.
- [ ] Confirm all other words in the heading ("Wheels,", "Not marketed.") retain their standard treatment: `font-weight: 800`, color matching `var(--ink-10)`.
- [ ] Open browser DevTools. Inspect the `<em>` element inside `.hero-title`. Confirm:
  - `font-style: italic`
  - `font-weight: 300`
  - `letter-spacing: -0.05em`
  - `color: var(--brass-8)` resolving to approximately `#a88846`
- [ ] Confirm no other heading or text element on the landing page has been unintentionally restyled.
- [ ] Confirm the Hero layout (subtitle paragraph, CTA buttons, stats grid) is unchanged in position and appearance.
- [ ] The `<em>` element carries no `className`, `style`, or other attribute.

## Tests to implement

### Unit
None — purely visual; no logic.

### Integration
None.
