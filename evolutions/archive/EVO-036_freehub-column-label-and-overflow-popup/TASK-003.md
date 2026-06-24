# TASK-003 — Create `FreehubPopup` component

## Objective

Create a new presentational React component `FreehubPopup` that displays the complete list of freehub options for a single wheel inside a small popup panel. The component is purely presentational: it receives data as props and calls a callback to signal dismissal. It owns no state.

## Required context

- Location: `MyBikeLab/frontend/src/components/MiniComparator/FreehubPopup.jsx`
- The component is rendered by `FreehubCell` (TASK-004) when `isPopupOpen` is true.
- Freehub options are stored on each wheel as `w.hub.freehub_options`, an array of strings (e.g. `["XDR", "HG", "Micro Spline"]`). The `FreehubCell` parent passes the already-resolved array as a prop.
- The popup must list all options without truncation (FR-006).
- Dismissal is handled by an outside-click listener in `FreehubCell` (TASK-004). `FreehubPopup` itself receives an `onClose` prop it can also use if a close button is added, but no close button is required.
- The popup title string comes from the i18n key `properties.freehubOptions.popupTitle`. Add this key to all locale files (see below).
- The popup is a positioned overlay attached near its triggering cell, not a full-screen modal.

### Locale keys to add

In `en.json`, inside `properties.freehubOptions`:
```json
"popupTitle": "Freehub options"
```

In `fr.json`, inside `properties.freehubOptions`:
```json
"popupTitle": "Options de corps de roue libre"
```

In `xx.json`: add equivalent.

### Design system tokens (from `src/index.css` and project conventions)

- Background: `bg-paper-0` (card background)
- Border: `border border-ink-4`
- Text: `text-ink-11` for content, `text-ink-7` for the title
- Rounded corners: `rounded-xs` (consistent with `.card` and `.btn-outline`)
- Shadow: `shadow-md` for elevation over the table
- Padding: `p-3` for inner content; `px-3 py-2` for each option item
- Typography: `text-xs` for the title (matching `<th>` convention), `text-sm` for option values
- List items: use a simple vertical list; lists of 5 or fewer items can use a plain `divide-y divide-ink-2` list. If more than 5 items are possible, use a scrollable container with `max-h-[200px] overflow-y-auto`.

### UI guidelines applicable to this component

**Interactive states:** The popup has no interactive elements (read-only list). No hover/focus states required on list items.

**Layout:** Use a vertical list. If the freehub options list could exceed 5 items, render a scrollable container (`max-h-[200px] overflow-y-auto`) rather than a plain `<ul>` with `divide-y`. Freehub options for a single wheel are unlikely to exceed 5, but the component must handle the edge case gracefully without overflowing the viewport.

**Animation:** The popup is an occasional interaction (a few times per session). Apply a CSS entry/exit transition using `@starting-style` or a short opacity fade (`duration-150 ease-out` on enter). Duration: 125-200 ms (small popover range). Do not animate position (no `transform` entrance) — only opacity, to avoid layout jank in the table context.

**Accessibility:** Add `role="dialog"` and `aria-label` (value: the popup title string). The popup is non-modal and does not trap focus. No `aria-modal` attribute.

**Forbidden patterns:** No em-dash in UI text. No decorative status dots.

## Potentially impacted files

- `MyBikeLab/frontend/src/components/MiniComparator/FreehubPopup.jsx` (new file)
- `MyBikeLab/frontend/public/locales/en.json` (add `popupTitle` key)
- `MyBikeLab/frontend/public/locales/fr.json` (add `popupTitle` key)
- `MyBikeLab/frontend/public/locales/xx.json` (add `popupTitle` key)

## Inputs

- `options`: `string[]` — the freehub options to display (passed by `FreehubCell`).
- `onClose`: `() => void` — optional callback; the parent `FreehubCell` handles outside-click dismissal but a close trigger prop is useful for future extensibility.
- `t`: the `react-i18next` translation function (passed by `FreehubCell`).

## Expected outputs

A file `FreehubPopup.jsx` containing a functional React component with the following interface:

```jsx
// Props
// options: string[]   — list of freehub option strings
// onClose: () => void — called when the user activates an explicit close action (optional; outside-click is handled by parent)
// t: TFunction        — react-i18next translation function

const FreehubPopup = ({ options, onClose, t }) => { ... };
export default FreehubPopup;
```

Rendered structure (approximate):
```
<div role="dialog" aria-label={t('properties.freehubOptions.popupTitle')}
     className="absolute z-20 ... bg-paper-0 border border-ink-4 rounded-xs shadow-md p-3">
  <p className="text-xs text-ink-7 uppercase tracking-widest mb-2">
    {t('properties.freehubOptions.popupTitle')}
  </p>
  <ul className="...">
    {options.map((opt) => (
      <li key={opt} className="text-sm text-ink-11 px-1 py-1">{opt}</li>
    ))}
  </ul>
</div>
```

Exact class names and structure may vary; the constraints section governs what must be respected.

## Constraints

- The component must be purely presentational (no useState, no useEffect, no Redux).
- Use `absolute` positioning; the parent `FreehubCell` wrapper sets `position: relative` (see TASK-004).
- Use `z-20` to appear above the sticky table header (`z-10`).
- Popup width: `w-max min-w-[140px] max-w-[240px]` — wide enough to show full option strings, narrow enough to stay within table viewport on mobile.
- Popup vertical position: place below the triggering cell by default (`top-full mt-1`). If the cell is near the bottom of the viewport, the parent may need to flip it (this is a future concern; for this evolution, always render below).
- Do not render a full-screen backdrop. Outside-click is handled by the document listener in `FreehubCell`.
- No em-dash in UI text.
- The component must call `useTranslation()` internally OR accept `t` as a prop; use prop to keep the component testable in isolation without i18n setup. Accept `t` as a prop.
- Apply a CSS opacity transition on mount: `transition-opacity duration-150`.

## Dependencies

none

## Validation criteria

- [ ] `FreehubPopup.jsx` exists in `src/components/MiniComparator/`.
- [ ] The component renders a list of all provided `options` strings.
- [ ] The popup title uses the i18n key `properties.freehubOptions.popupTitle`.
- [ ] The popup has `role="dialog"` and `aria-label`.
- [ ] The popup does not overflow vertically for a list of 8+ options (max-height + scroll applied).
- [ ] The popup sits above the sticky header (`z-20`).
- [ ] The `popupTitle` key has been added to `en.json`, `fr.json`, and `xx.json`.
- [ ] No em-dash appears in any string value.

## Tests to implement

### Unit
- None required (PRD section 10).

### Integration
- None required.
