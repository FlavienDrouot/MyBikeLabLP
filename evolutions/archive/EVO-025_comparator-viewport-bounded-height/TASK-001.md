# TASK-001 — Sync `--navbar-height` CSS variable with the live Navbar height

## Objective
Make the `--navbar-height` CSS variable on `:root` reflect the live measured height of the rendered `<header>` produced by `Navbar.jsx`, so any consumer of `calc(... - var(--navbar-height) ...)` is computed against the actual Navbar height rather than against the static design token (currently `5rem` / 80 px, while the Navbar actually renders at ~65 px). The variable must update whenever the Navbar resizes (mobile menu open/close, future content additions).

## Required context
- `src/components/Navbar.jsx` renders `<header className="sticky top-0 z-40 w-full border-b border-ink-3 bg-paper-1/88 backdrop-blur">` with an inner row using `h-16` (64 px) plus a 1 px bottom border. The actual rendered `offsetHeight` is therefore ~65 px, not the 80 px declared by the `--navbar-height` token in `src/design-tokens.css` (`--navbar-height: 5rem;`).
- The variable is already consumed in two places: `src/index.css` (`scroll-padding-top: var(--navbar-height);`) and `src/components/MiniComparator/FilterPanel.jsx` (`style={{ top: 'var(--navbar-height)' }}` on a `lg:sticky` aside — note: `lg:sticky` is removed in TASK-002, but `--navbar-height` consumers still benefit from the accurate value).
- React 19 is in use; functional components only. `useLayoutEffect` is the correct hook here to avoid a one-frame flash before the cap formula in TASK-002 / TASK-003 is computed against an accurate value.

## Potentially impacted files
- `src/components/Navbar.jsx` — add a ref, a `useLayoutEffect`, and a `ResizeObserver` that writes the measured height into `--navbar-height` on `document.documentElement`.
- `src/design-tokens.css` — update the comment next to `--navbar-height` to note that the value is overridden at runtime by `Navbar.jsx`. Keep the `5rem` fallback in place.
- `src/components/__tests__/Navbar.test.jsx` — extend with one new test (see "Tests to implement").

## Inputs
- The existing `Navbar` component, unchanged in markup.

## Expected outputs
- After `Navbar` mounts in a JSDOM environment, `document.documentElement.style.getPropertyValue('--navbar-height')` returns a non-empty `px` string (e.g. `"65px"`) matching `headerRef.current.offsetHeight`.
- After the `<header>` element resizes (programmatically resized in a test), the variable updates within one observer callback.
- On unmount, the observer is disconnected and the inline style is removed from `document.documentElement` so the static token from `design-tokens.css` is restored.

## Constraints
- Use `useLayoutEffect`, not `useEffect`, so the variable is written before the first paint that follows mount.
- Use `ResizeObserver` (already used in `src/components/MiniComparator/ComparisonTable.jsx`). Do not add a `window.addEventListener('resize')`.
- Do not change any visible markup, class, or attribute of `Navbar`.
- Do not introduce a new dependency or a new shared hook (see AD-006).
- All identifiers and comments in English.
- No animation introduced.

## Dependencies
none

## Validation criteria
- [ ] `Navbar` writes `--navbar-height` on `document.documentElement` on mount, with a `px` value equal to its own `offsetHeight`.
- [ ] The variable updates when the header is resized (verified via a mocked `ResizeObserver`).
- [ ] The inline style on `document.documentElement` is cleared on unmount.
- [ ] The static fallback `--navbar-height: 5rem;` in `src/design-tokens.css` is preserved.
- [ ] `npm run test` passes, including the pre-existing `Navbar.test.jsx` ("renders logo as an img element").
- [ ] `npm run lint` passes.

## Tests to implement
### Unit
- In `src/components/__tests__/Navbar.test.jsx`, add a test using `@testing-library/react` if present; otherwise, follow the existing project pattern (`renderToStaticMarkup`) for the existing test and add a JSDOM-based mount test inline. Two cases:
  1. After rendering `<Navbar />` in JSDOM and stubbing `HTMLElement.prototype.offsetHeight` to return `65`, `document.documentElement.style.getPropertyValue('--navbar-height')` equals `'65px'`.
  2. After unmount, `document.documentElement.style.getPropertyValue('--navbar-height')` is the empty string (the inline override is removed; the static token from `design-tokens.css` takes over).
- A minimal `ResizeObserver` shim must be installed in `src/test-setup.js` if not already present (a class that records the callback and exposes a `trigger()` helper). If shimming is non-trivial, the simulated resize case can be covered by directly calling the same effect logic in a follow-up test; record the choice in `spec-notes.md`.

### Integration
- Not applicable for this task in isolation. Integration with the cap formula is covered by TASK-004.
