# Inline Task

## Status
Done

## Request

Fix the extra blank space that appears after the page end on desktop and to the right of the page on mobile. The blank area matches the comparator table width when it is rendered without horizontal scroll.

## Mini Plan

1. Remove the shrink-wrapped layout behavior from the MiniComparator grid wrapper.
2. Constrain the comparison table scroll wrapper so the wide table cannot expand the page.
3. Keep the hidden measuring table out of document overflow calculations.
4. Block page-level horizontal overflow while preserving the table's internal horizontal scroll.
5. Add regression tests that assert the wrappers span the available width and keep scroll confinement.
6. Run the summary test suite and record the result.

## Requirement And Validation

- Requirement: the comparator section must not widen the page beyond the viewport while the table still keeps its internal horizontal scroll.
- Acceptance criteria:
  - The MiniComparator grid wrapper no longer uses `w-fit`.
  - The wrapper spans the available width on mobile and desktop.
  - The comparison table scroll wrapper is width-constrained and does not expand the page.
  - The hidden measuring table does not create page-level horizontal overflow.
  - The page itself cannot scroll horizontally.
  - The comparison table still scrolls horizontally inside its own scroll container.
  - The change does not affect the existing viewport cap or sticky header behavior.
- Test strategy:
  - Add a structural regression assertion on the MiniComparator wrapper classes.
  - Run the frontend Vitest summary suite after the change.
- Edge cases:
  - Mobile drawer open/closed states must keep working.
  - Wide comparator content must stay inside the scroll container instead of forcing page overflow.

## Technical Steps

- Update `frontend/src/components/MiniComparator/MiniComparator.jsx` so the grid container fills the available width instead of shrink-wrapping to its content.
- Update `frontend/src/components/MiniComparator/ComparisonTable.jsx` so the table scroll wrapper cannot widen the page.
- Update `frontend/src/components/MiniComparator/MeasuringTable.jsx` so the hidden measuring table uses fixed positioning.
- Update `frontend/src/index.css` so page-level horizontal overflow is clipped.
- Extend the MiniComparator tests with regression assertions for the wrapper width classes and scroll confinement.
- Run the frontend summary tests and confirm the layout regression is covered.

## Validation

- Baseline: not run separately before implementation.
- Checks run: `npm.cmd run test:summary`
- Regression: passed, 25 files passed, 341 tests passed, 0 failed, exit code 0.
- Manual checks: browser verification passed at 390x844 mobile and 1280x720 desktop; page-level `scrollX` stayed at 0 while the comparator table remained wider than its scroll wrapper.

## Final Notes

- Changes: the comparator grid wrapper now fills the available width instead of shrink-wrapping, the comparison-table scroll wrapper is width-constrained, the hidden measuring table uses fixed positioning, page-level horizontal overflow is blocked, and the tests guard against the layout regressions.
- Risks: low; the fix is limited to the comparator wrapper layout and one regression test.
