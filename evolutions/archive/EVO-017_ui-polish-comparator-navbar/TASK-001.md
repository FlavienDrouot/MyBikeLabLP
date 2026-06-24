# TASK-001 — Audit Hero stat line and add non-regression test

## Objective

Verify that the Hero section renders the stat-line content exactly once, then add an automated Vitest test that guards against future duplication. If a duplicate is found in the source, remove it.

## Required context

### What the stat line is

The "stat line" referenced in FR-001 and AC-001 is the three-column numeric metrics grid rendered at the bottom of the Hero section. It is defined in `Hero.jsx` starting at the `div.mt-16.grid.grid-cols-3` element (lines 24–37). It contains the values "15" (Road wheels), `getFilterableProperties().length` (Filter axes), and "3" (Phases planned).

The prose paragraph above the CTAs (`<p className="mt-6 text-lg…">`) also contains the text "15 road wheels, 13 filter axes" in prose form. This is a separate element. The PRD refers to the structured stat line, not the prose text.

The acceptance criterion (AC-001) requires that the DOM contain exactly one instance of the numeric stat block. The current `Hero.jsx` source shows only one such block — if this is confirmed at audit time, no deletion is needed. The task is still required for the non-regression test.

### Codebase context

- File: `frontend/src/components/Hero.jsx`
- Test framework: **Vitest** (`vitest run`) in `node` environment. No `@testing-library/react` available.
- Existing test example: `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js` — plain Vitest, no DOM renderer.
- The project has `react-dom` as a dependency. `react-dom/server`'s `renderToStaticMarkup` can be used to produce an HTML string for assertion in the node environment.
- SVG/image imports in tests resolve to `''` via `frontend/src/__mocks__/fileMock.js` (configured in `vite.config.js` test aliases).

### Design system tokens used in Hero

No changes to visual tokens are made in this task. This task is audit + test only.

## Potentially impacted files

- `frontend/src/components/Hero.jsx` — may require removing a duplicate block if one is found during audit
- `frontend/src/__tests__/Hero.test.jsx` (new file to create) — or an equivalent path following the project's test file location pattern

## Inputs

- `frontend/src/components/Hero.jsx` (current source — read before acting)
- Existing test for reference: `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js`

## Expected outputs

1. **Audit result:** Confirm (by reading `Hero.jsx` and, if necessary, `Landing.jsx`) that the stat grid block appears exactly once in the rendered Hero section. If a duplicate is found, remove it.
2. **New test file** at `frontend/src/components/__tests__/Hero.test.jsx` (create the `__tests__` directory if it does not exist) containing:
   - A test that renders `<Hero />` to a static HTML string using `renderToStaticMarkup` from `react-dom/server`
   - An assertion that the rendered string contains the text "Road wheels" exactly once
   - An assertion that the rendered string contains the text "Filter axes" exactly once
   - An assertion that the rendered string contains the text "Phases planned" exactly once
   - These three assertions together confirm the stat grid is rendered once and not duplicated

## Constraints

- Do not modify the prose paragraph in Hero (the `<p>` element containing "15 road wheels, 13 filter axes"). Only remove actual duplicate stat-grid blocks if found.
- Do not add `@testing-library/react` as a dependency. Use `react-dom/server` only.
- The test must not import from `Landing.jsx` — it must test `Hero` in isolation.
- The test file must be compatible with `vitest run` (no browser-specific APIs).
- Vitest config in `vite.config.js` maps SVG imports to `fileMock.js`. The Hero component does not use SVG imports, so no mock concern arises here.

## Dependencies

none

## Validation criteria

- [ ] `Hero.jsx` is read and confirmed to contain exactly one stat-grid block (or a duplicate is removed)
- [ ] A new test file exists at `frontend/src/components/__tests__/Hero.test.jsx`
- [ ] `npm run test` passes with the new tests included
- [ ] The new tests assert "Road wheels", "Filter axes", and "Phases planned" each appear exactly once in the Hero rendered output
- [ ] No existing tests are broken

## Tests to implement

### Unit

- `Hero renders the stat metrics grid exactly once` — render `<Hero />` via `renderToStaticMarkup`, count occurrences of "Road wheels", "Filter axes", "Phases planned"; each must equal 1.

### Integration

- None required for this task.
