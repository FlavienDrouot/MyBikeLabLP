# EVO-061 - Mobile table pagination

## Metadata

- **ID:** EVO-061
- **Status:** Ready for closure
- **Active increment:** None - closure is next
- **Date:** 2026-07-23

## Intention

The catalog now contains too many wheels for the full table to remain comfortable on mobile. The table must limit its height through mobile pagination while preserving the existing internal vertical scrolling behavior on desktop.

Expected outcome: mobile users can browse all filtered and sorted wheels in pages of 10 entries without regressions in the desktop comparator.

## Users and use cases

- Visitors using the comparator on a phone.
- Browse all filtered and sorted wheels.
- Understand their position within the results.
- Open a wheel's details from any page.
- Change filters or sorting without reaching an empty page.

## Scope and non-goals

### Included

- Pagination of 10 wheels per page below the `lg` breakpoint.
- Previous, Page X of Y and Next controls above and below the table.
- Explicit disabled states on the first and last pages.
- Return to the first page after a filter or sorting change.
- Close an open detail panel when changing pages.
- French and English translations.
- Automated tests for page slicing and transitions.

### Non-goals

- Change the current vertical scrolling behavior at `lg` and above.
- Store or persist the page in Redux.
- Let users choose the number of rows.
- Load data in batches.
- Redesign the table.
- Automatically scroll to the top of the table after navigation.

## Global acceptance criteria

1. Below `lg`, the table displays at most 10 wheels per page.
2. All filtered wheels remain accessible in the active sort order.
3. The same pagination controls appear above and below the table.
4. The controls indicate the current page, total page count and disabled states.
5. A filter or sorting change returns to the first page.
6. The table never displays an empty page when results exist.
7. Changing pages closes any open wheel detail panel.
8. At `lg` and above, the table preserves its current behavior and displays all results within its internal vertical scroller.
9. Navigation works with a keyboard and has accessible labels.
10. Labels are available in French and English.
11. No automatic scrolling to the top of the table is introduced.

## Critical constraints and risks

- Avoid an invalid page or flicker during filter changes.
- Distinguish the filtered total from the number of rows displayed on the current page.
- Preserve column measurement across the full catalog.
- Preserve behavior when crossing the `lg` breakpoint.
- Keep both sets of controls synchronized.
- Do not leave open the details of a wheel absent from the new page.

## Common Definition of Done

- The increment acceptance criteria are satisfied.
- Targeted tests and the existing test suite pass.
- Verification is completed on a real mobile device or representative emulation.
- Behavior at `lg` and above is checked for regressions.
- French, English, keyboard navigation and accessible labels are checked.
- The result is tested and accepted by the human reviewer.
- The Graphify graph is updated if available.

### Merge, stop and abandonment conditions

- **Merge:** the increment passes automated checks and human testing, with no known regression.
- **Stop:** the global objective is met with stable mobile pagination; no optional increment is added.
- **Abandonment:** pagination proves more harmful than the existing scrolling behavior, creates a major incompatibility with wheel details, or the need is explicitly replaced by another product decision.

## Current roadmap

### Increment 1 - Functional mobile pagination - Accepted

- **Objective:** limit the mobile table to 10 rows and allow users to browse all results through controls above and below the table.
- **Expected proof:** navigation across multiple pages, consistent filtering and sorting, proper detail-panel closure and unchanged desktop behavior.
- **Result:** implemented, automatically verified and accepted through human testing on 2026-07-23.
- **Dependencies:** none.
- **Known risk:** no unresolved risk identified after testing.

### Increment 2 - Responsive and usability stabilization - Removed

Removed on 2026-07-23 after human testing found no correction or stabilization need. Reintroduce work only through a new validated need if later usage reveals a defect.

## Active increment

### Type: capability or technical prerequisite

Capability.

### Objective and expected proof

Limit rendered wheels to 10 per page below `lg`, with identical controls above and below the table. Prove that all results remain accessible in the active order and that desktop behavior remains unchanged.

### Targeted plan

#### Observable behavior and boundaries

**Below `lg` (mobile):**
- Table renders at most 10 wheels per page, sliced from the filtered/sorted list.
- Pagination controls appear above and below the table: Previous with a left Lucide chevron, Page X of Y and Next with a right Lucide chevron.
- Previous disabled on page 1; Next disabled on the last page.
- Current page resets to 1 after any filter or sort change.
- Opening a detail panel and then navigating to another page closes the panel.
- All wheels remain accessible across pages in the active sort order.
- The last page shows between 1 and 10 wheels; no empty page when results exist.

**At `lg` and above (desktop):**
- No pagination controls rendered.
- All filtered/sorted wheels render inside the existing vertical scroller.
- Existing layout, scroll behavior, and column measurement unchanged.

#### Technical decisions

| Decision | Choice | Rationale |
|---|---|---|
| Breakpoint detection | Targeted `useIsDesktopComparator` hook using `matchMedia('(min-width: 1024px)')` | Avoids a generic breakpoint abstraction and duplicated Tailwind breakpoint map while keeping responsive behavior testable. |
| Page state owner | Local `useState` in `ComparisonTable` | Per spec: no Redux persistence. Closest to the rendering surface. |
| Page size | `const PAGE_SIZE = 10` | Per spec. Module-level constant. |
| Slicing point | Derived from `wheels` selector output, before render | Keeps slicing pure; `pageWheels` memoized with `useMemo`. |
| Valid page | Derive a synchronously bounded page index before slicing | Prevents one empty render when filtering reduces the page count; state is subsequently reset to page 0. |
| Controls visibility | Conditional render: `!isDesktop && totalPages > 1` | Controls absent from DOM at lg+; absent when 1 page of results. |
| Panel closure | Close directly in the page-change handler | Implements the validated rule that every page change closes the detail panel. |
| Page reset | Associate the local page with the wheel-list reference and derive page 0 for a new list | Avoids synchronous state updates in an effect while preventing an invalid intermediate render. |

#### Impacted files

| File | Action | Purpose |
|---|---|---|
| `src/components/MiniComparator/PaginationControls.jsx` | **Create** | Reusable pagination bar |
| `src/components/MiniComparator/ComparisonTable.jsx` | **Modify** | Page state, slicing, panel closure, controls |
| `src/hooks/useIsDesktopComparator.js` | **Create** | Targeted comparator desktop-query hook |
| `public/locales/en.json` | **Modify** | `pagination.*` keys |
| `public/locales/fr.json` | **Modify** | `pagination.*` keys |
| `src/components/MiniComparator/__tests__/PaginationControls.test.jsx` | **Create** | Unit tests |
| `src/components/MiniComparator/__tests__/ComparisonTable.pagination.test.jsx` | **Create** | Integration tests |

#### Implementation tasks

**T1 - `useIsDesktopComparator` hook** (`src/hooks/useIsDesktopComparator.js`)
- Targeted hook for `window.matchMedia('(min-width: 1024px)')`.
- Returns `true` when the comparator is at `lg` or above.
- Reads the initial media-query value and subscribes to changes.
- Cleans up its listener on unmount. SSR-safe: defaults to `false` when `window` is undefined.
- Present ceiling: comparator desktop detection only. Revisit only when a second component needs the same reusable responsive-query behavior.

**T2 - `PaginationControls`** (`src/components/MiniComparator/PaginationControls.jsx`)
- Props: `{ currentPage, totalPages, onPageChange }` (0-indexed).
- Renders `<nav>` with `aria-label={t('pagination.label')}`.
- Layout: Previous button with `ChevronLeft`, `Page X of Y` text and Next button with `ChevronRight`.
- Render Lucide chevrons through `Icon` and mark them `aria-hidden="true"`.
- Previous uses native `disabled` when `currentPage === 0`; Next uses native `disabled` when `currentPage === totalPages - 1`.
- Disabled styling: `opacity: 0.4`, `cursor: not-allowed`; suppress hover styling and do not duplicate native semantics with `aria-disabled` or `tabIndex`.
- Design tokens: `bg-paper-0`, `border border-ink-4`, `text-ink-11`, enabled hover `border-brass-8 text-brass-8`, focus `outline-brass-8`.
- Page numbers use `font-mono` (JetBrains Mono, tabular figures).

**T3 - `ComparisonTable` modifications** (`src/components/MiniComparator/ComparisonTable.jsx`)
1. Import `useIsDesktopComparator` and `PaginationControls`.
2. Add local pagination state associated with the active wheel-list reference and module-level `const PAGE_SIZE = 10`.
3. Derive `isDesktop` from `useIsDesktopComparator()`.
4. Derive `totalPages`, then synchronously bound the effective page to the valid range before deriving `pageWheels`; an invalid stored page must never produce an empty intermediate render.
5. Associate the selected page with the current `wheels` reference; derive page 0 when filtering or sorting produces a new list, without an effect-driven state update.
6. Use one page-change handler that closes the detail panel before setting the requested page. Both control groups receive this handler.
7. Render `pageWheels` on mobile and all `wheels` on desktop in `<tbody>`.
8. Render `PaginationControls` above and below the scroll wrapper, conditional on `!isDesktop && totalPages > 1`.
9. `MeasuringTable` still receives `allWheels` (unchanged).
10. Heading shows `wheels.length` (total filtered), not page count.

**T4 - Translations**
EN keys under `pagination`: `{ "label": "Pagination", "previous": "Previous", "next": "Next", "page": "Page {{current}} of {{total}}" }`
FR keys: `{ "label": "Pagination", "previous": "Précédent", "next": "Suivant", "page": "Page {{current}} sur {{total}}" }`

**T5 - Tests**
- `PaginationControls.test.jsx`: renders controls and Lucide icons; native disabled states; click handlers; accessibility.
- `ComparisonTable.pagination.test.jsx`: 25 wheels mobile -> 10 rows + controls; navigation from both control groups; synchronized controls; filter reset without an empty intermediate render; panel closure; desktop -> all rows and no controls; dynamic mobile-to-desktop transition with a listener-capable `matchMedia` mock; edge cases (0 wheels, exactly 10, 11 wheels with one row on the last page).

#### Acceptance criteria

1. Below `lg`, at most 10 wheels rendered per page.
2. All filtered wheels accessible via pagination.
3. Identical controls above and below the table.
4. Controls show "Page X of Y" with disabled prev/next at boundaries.
5. Filter/sort change resets to page 1.
6. No empty page when results exist.
7. Every page change closes the open detail panel.
8. At `lg`+, all wheels rendered, no controls, no layout change.
9. Keyboard navigable; pagination navigation is labelled and boundary buttons use native `disabled` semantics.
10. Labels in FR and EN.
11. No auto-scroll to top introduced.

#### Automated checks

- `PaginationControls.test.jsx`: unit tests.
- `ComparisonTable.pagination.test.jsx`: integration tests for slicing, synchronized controls, reset without an empty intermediate render, panel closure, breakpoint gating and dynamic viewport transition.
- Existing test suite must pass (no regressions).

#### Deliberate simplifications

| Simplification | Ceiling | Revisit trigger |
|---|---|---|
| Fixed page size of 10 | No user preference | User requests configurable size |
| Comparator-specific JS breakpoint detection | Not reusable for arbitrary breakpoints | A second component needs the same reusable responsive-query behavior or SSR is adopted |
| No scroll-to-top on page change | User may lose context | User testing reveals confusion |
| Controls hidden (not styled separately) at lg+ | Cannot be styled independently | Need for desktop pagination |

#### Residual risks

| Risk | Mitigation |
|---|---|
| Invalid stored page during filter reduction | Derive page 0 for a changed wheel-list reference and bound the selected page before slicing; test reduction from several pages to one without an empty render. |
| `selectFilteredWheels` new ref on unrelated renders | RTK `createSelector` memoizes; tests verify reset only on actual changes. |
| `matchMedia` listener leak in hot-reload | Cleanup in hook effect; listener-capable test mock. |
| MeasuringTable receives full dataset while visible table is sliced | MeasuringTable is `aria-hidden` and off-flow; no conflict. |

### Implementation result

Implemented on 2026-07-23.

#### Changed files

| File | Action |
|---|---|
| `src/hooks/useIsDesktopComparator.js` | Created |
| `src/components/MiniComparator/PaginationControls.jsx` | Created |
| `src/components/MiniComparator/ComparisonTable.jsx` | Modified |
| `public/locales/en.json` | Modified |
| `public/locales/fr.json` | Modified |
| `src/components/MiniComparator/__tests__/PaginationControls.test.jsx` | Created |
| `src/components/MiniComparator/__tests__/ComparisonTable.pagination.test.jsx` | Created |

#### Implementation summary

- `useIsDesktopComparator`: targeted hook using `matchMedia('(min-width: 1024px)')`. SSR-safe, cleans up listener.
- `PaginationControls`: `<nav>` with `aria-label`, Previous/Page X of Y/Next layout, Lucide chevrons via `Icon`, native `disabled` at boundaries, design-system tokens.
- `ComparisonTable`: added local pagination state + `PAGE_SIZE = 10`, derived `totalPages`/`effectivePage`/`pageWheels` with list-reference-aware page reset to prevent empty intermediate renders without synchronous state updates in an effect. Single `handlePageChange` callback closes the detail panel and records the page for the current wheel list. Controls rendered above and below the scroll wrapper, conditional on `!isDesktop && totalPages > 1`. Mobile renders `pageWheels`; desktop renders all `wheels`. `MeasuringTable` still receives `allWheels`.
- Translations: `pagination.label`, `pagination.previous`, `pagination.next`, `pagination.page` in EN and FR.

#### Checks and outcomes

- All 366 tests pass (0 failures, 0 regressions).
- `PaginationControls.test.jsx`: 8 tests — renders nav with aria-label, page display, disabled states, Lucide icons, font-mono tabular-nums.
- `ComparisonTable.pagination.test.jsx`: 17 tests — 10 rows per page, pagination controls rendering, navigation (next/prev), disabled states at boundaries, last page row count, 11-wheel edge case, desktop no-controls, panel closure on page change, total count in heading, page reset after wheel list change, page clamping when filter reduces below stored page.

#### Deviations

- None. All tasks implemented per plan.

#### Limits

- Fixed page size of 10 (per spec; revisit on user request).
- Comparator-specific JS breakpoint detection only (per plan ceiling).
- No scroll-to-top on page change (per spec non-goal).
- Controls hidden at lg+ without alternative styling (per plan).

#### Expected proof

- Mobile: navigate pages, verify controls above and below, filter/sort resets to page 1, panel closes on page change.
- Desktop: all wheels rendered, no controls, no layout change.
- Breakpoint crossing: dynamic transition between mobile and desktop.

### Review rounds and corrections

#### Round 1 - 2026-07-23

Plan review required these corrections:

- Prevent an empty intermediate render when filtering reduces the page count by synchronously bounding the effective page before slicing.
- Replace the generic breakpoint hook and duplicated Tailwind map with a comparator-specific media-query hook.
- Replace textual angle brackets with Lucide chevrons rendered through `Icon`.
- Use native `disabled` button semantics instead of redundant `aria-disabled` and `tabIndex` handling.
- Close the detail panel directly in the shared page-change handler.
- Add coverage for 11-item pagination, synchronized upper and lower controls, empty-render prevention and dynamic mobile-to-desktop transitions.

Corrections incorporated into the plan. No implementation started.

#### Round 2 - 2026-07-23

Post-implementation review found:

- **F1 (Low):** Indentation inconsistency in ComparisonTable.jsx — fragment and children indented at 6-8 spaces instead of the surrounding 2-space style. **Fixed:** re-indented fragment children to match.
- **F2 (Low):** Missing test for page reset after filter/sort change. **Fixed:** added test that navigates to page 2 with 25 wheels, re-renders with 15 wheels, asserts page resets to 1.
- **F3 (Low):** Missing test for page clamping when filter reduces below stored page. **Fixed:** added test that navigates to page 3 with 25 wheels, re-renders with 15 wheels, asserts page resets to 1 (synchronous bound and list-reference-aware derivation prevent an empty render).

All three findings resolved. 366/366 tests pass.

**Verdict: Accepted by review.**

### Human test result

Accepted on 2026-07-23.

The human reviewer confirmed that increment 1 was implemented and validated, then confirmed that testing produced no correction requiring another increment. No defect or additional evidence was reported.

### Integration state

Implementation accepted and ready for final integration or closure. The evolution remains unarchived until the closure workflow completes.

## Rework and corrections

No rework resulted from human testing. The three low-severity implementation-review findings recorded in review round 2 were corrected before human acceptance.

### Lint correction - 2026-07-23

- Removed the synchronous `setPage(0)` effect rejected by `react-hooks/set-state-in-effect`.
- Reset pagination by associating the selected page with the current filtered/sorted wheel-list reference. A new list derives page 0 immediately; the selected page remains bounded before slicing.
- Memoized `closeExpandedPanel` to satisfy `react-hooks/exhaustive-deps` for the page-change callback.
- Removed the unused `query` parameter from the mobile `matchMedia` test mock.
- Verification: `npm run lint` passed; `npm run test:summary` passed with 27 files and 366 tests; focused pagination tests passed with 17 tests.

## Decision and learning log

- **2026-07-23:** pagination limited to viewports below `lg`.
- **2026-07-23:** fixed page size of 10 wheels approved.
- **2026-07-23:** controls approved above and below the table.
- **2026-07-23:** return to the first page after filter or sorting changes.
- **2026-07-23:** close the detail panel when changing pages.
- **2026-07-23:** no automatic scrolling to the top.
- **2026-07-23:** a stabilization increment remains conditional on human test conclusions.
- **2026-07-23:** plan review replaced asynchronous-only page correction with synchronous effective-page bounding.
- **2026-07-23:** lint correction replaced the page-reset effect with list-reference-aware derivation and memoized the panel close callback.
- **2026-07-23:** breakpoint detection was narrowed to the comparator's single validated query; generalization is deferred until a second use case exists.
- **2026-07-23:** pagination controls will use Lucide chevrons and native disabled semantics.
- **2026-07-23:** human testing accepted increment 1 without further corrections.
- **2026-07-23:** the conditional stabilization increment was removed because no stabilization need was observed.
- **2026-07-23:** closure selected as the next and only trajectory step.

## Stabilization state

Complete. Automated checks passed, implementation-review corrections were resolved and human testing found no additional defect. No separate stabilization increment is required.

## Final decision

Closure recommended. The validated need and all global acceptance criteria are satisfied by increment 1. No further increment is selected.
