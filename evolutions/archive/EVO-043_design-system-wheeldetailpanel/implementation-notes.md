# Implementation Notes

## General Information

- Evolution ID: EVO-043
- Title: Design system migration - WheelDetailPanel
- Date: 2026-06-03
- Mode: Orchestrated

---

## Task Results

### TASK-001 - Schematic-framed image surface

Implemented `WheelImageCarousel` as a schematic-framed image surface.

Changed files:
- `frontend/src/components/MiniComparator/WheelImageCarousel.jsx`
- `frontend/src/components/MiniComparator/__tests__/WheelImageCarousel.test.jsx`

Validation:
- `npm.cmd test -- WheelImageCarousel.test.jsx` passed: 4 tests.
- Scoped scan found no `brand-*`, raw hex colors, raw blue Tailwind classes, `rounded-full`, old timing literals, or placeholder fallback import in the migrated carousel scope.

Notes:
- Design decision: kept the schematic inline in the component so the implementation stayed within the carousel scope.
- Tradeoff: carousel controls use ASCII `<` and `>` glyphs instead of adding an icon dependency or new asset.
- Bug fix: guarded `window.matchMedia` so jsdom and non-browser environments do not crash.
- Deviations: none.
- Open questions: none.

### TASK-002 - Design-system panel and price ledger

Migrated `WheelDetailPanel` to the design-system card surface and price ledger treatment.

Changed files:
- `frontend/src/components/MiniComparator/WheelDetailPanel.jsx`
- `frontend/src/components/MiniComparator/__tests__/WheelDetailPanel.test.jsx`

Validation:
- `npm.cmd test -- --run src/components/MiniComparator/__tests__/WheelDetailPanel.test.jsx` passed: 5 tests during the task.
- `npm.cmd test -- --run src/components/MiniComparator/__tests__/WheelImageCarousel.test.jsx` passed: 4 tests during the task.

Notes:
- Design decision: kept the existing `panelWidth < 870` responsive branch and affiliate-link rendering logic intact.
- Tradeoff: no new content sections or empty-state prose were added, preserving existing localization.
- Bug fix: improved long-label and price resilience with `gap`, `min-w-0`, and `min-w-fit`.
- Deviations: none.
- Open questions: none.

### TASK-003 - Expansion motion and dismiss affordance

Aligned the expanded-row wrapper, close affordance, and motion timing.

Changed files:
- `frontend/src/components/MiniComparator/ComparisonTable.jsx`
- `frontend/src/components/MiniComparator/__tests__/ComparisonTable.test.jsx`
- `frontend/src/components/MiniComparator/__tests__/MiniComparator.viewport-cap.test.jsx`

Validation:
- `npm.cmd run lint` passed.
- `npm.cmd test -- --run src/components/MiniComparator/__tests__/ComparisonTable.test.jsx src/components/MiniComparator/__tests__/MiniComparator.viewport-cap.test.jsx` passed: 16 tests.

Notes:
- Design decision: reused existing `nav.closeMenu` for the close button `aria-label` to avoid adding a new localization key.
- Tradeoff: collapse keeps the panel mounted for 220ms so opacity and transform can animate before unmount.
- Bug fix: fixed stale viewport-cap selectors that still expected `.card`; current markup uses token classes directly.
- Deviations: none.
- Open questions: viewport tests still emit pre-existing empty `src` image warnings unrelated to this task.

### TASK-004 - Automated coverage

Completed focused automated coverage for the migrated panel contracts.

Changed files:
- `frontend/src/components/MiniComparator/__tests__/WheelDetailPanel.test.jsx`

Validation:
- `npm.cmd run test -- WheelDetailPanel WheelImageCarousel ComparisonTable` passed: 23 tests.
- `npm.cmd run test` failed outside EVO-043 scope:
  - `FilterPanel.test.jsx` expects legacy `card` / `lg:p-6` classes on `FilterPanel`.
  - `Landing.xx.test.jsx` flags `MyBikeLab` and `Compare road wheels` as hardcoded strings.

Notes:
- No production source changes were made in TASK-004.
- Manual-only visual image clipping remains covered by jsdom contract assertions for schematic presence, circular clipping, and hidden overflow, but true clipping correctness still needs visual review.

---

## Final Validation Summary

Passed:
- Focused carousel tests.
- Focused detail panel tests.
- Focused comparison table tests.
- Focused EVO-043 suite: 23 tests.
- Lint during TASK-003.

Not fully passed:
- Full `npm.cmd run test` currently fails in tests outside EVO-043 scope.

Remaining manual validation:
- Open panel on desktop and mobile widths.
- Verify product imagery remains visually clipped inside the schematic circle.
- Verify FR and EN language switching in the expanded panel.
- Verify no-image and no-link states visually.

---

## Changes Compared To Initial Plan

After visual review, the implementation diverged from the original task plan in the following ways:

- Reference source corrected: the first implementation used the broader `design-system/ui_kits/wheel-detail/` page as visual guidance. The correct reference is `design-system/wheel-detail-panel-redesign/`, specifically the retained `PanelFinal` direction in `panels.jsx` and `.F` styles in `panel.css`.
- Panel structure revised: the panel was rebuilt from the stretched early layout into the `PanelFinal` pattern: `paper-2` expanded band, centered `max-w-[1100px]`, `380px / 1fr` two-column body, framed plate, and split Manufacturer / Retailers ledger.
- Schematic behavior changed: the initial plan composited product photos with SVG schematic line art. Visual review rejected this. The schematic now renders only when there are no product images; real wheel photos render without the SVG behind them.
- Carousel state added: the initial plan did not include visible image position feedback. The carousel now shows a `current / total` marker and clickable image markers.
- Carousel marker placement changed: markers were first placed over the image and clipped the visual. They now sit below the image area inside the plate.
- Close behavior changed: the initial implementation used a 220 ms delayed unmount to allow fade-out motion, but this produced a blank-panel pause. The panel now unmounts immediately when closed.
- Unknown-price links are preserved: the first ledger implementation filtered out entries with `price_eur: null`, which hid valid links such as Roval Rapide C 38's manufacturer and Excel Sports URLs. The ledger now treats URL presence as the link criterion, displays known-price entries first, keeps unknown-price entries visible with a `-` price placeholder, and only applies the best-price marker when a finite price exists.
- Responsive breakpoint increased: the panel originally switched from the two-column `380px / 1fr` layout to stacked layout at 870 px. Visual review showed this switched too late, so the stacked breakpoint is now 1040 px.
- Tests updated to match the corrected contract: focused tests now assert the `PanelFinal` layout, schematic-only fallback behavior, real-image behavior without SVG overlay, carousel markers, and immediate close behavior.

Current validation after these corrections:
- `npm.cmd run test -- WheelImageCarousel`: passed, 5 tests.
- `npm.cmd run test -- WheelImageCarousel WheelDetailPanel ComparisonTable`: passed, 25 tests after carousel marker and close changes.
- `npm.cmd run test -- WheelDetailPanel`: passed, 9 tests after preserving unknown-price links.
- `npm.cmd run test -- WheelDetailPanel`: passed, 10 tests after increasing the stacked-layout breakpoint.
- `npm.cmd run lint`: passed.
