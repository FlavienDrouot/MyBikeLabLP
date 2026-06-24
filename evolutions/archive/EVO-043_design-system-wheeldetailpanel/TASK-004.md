# TASK-004 - Automated Coverage For EVO-043 Contracts

## Objective
Add focused automated tests that verify the EVO-043 design-system migration contracts and functional non-regression states for `WheelImageCarousel`, `WheelDetailPanel`, and the expanded-row integration in `ComparisonTable`.

## Required context
- PRD: `MyBikeLab/evolutions/EVO-043_design-system-wheeldetailpanel/prd.md`
- Existing tests:
  - `MyBikeLab/frontend/src/components/MiniComparator/__tests__/ComparisonTable.test.jsx`
  - `MyBikeLab/frontend/src/components/MiniComparator/__tests__/ComparisonTable.column-widths.test.jsx`
  - `MyBikeLab/frontend/src/components/MiniComparator/__tests__/MiniComparator.viewport-cap.test.jsx`
- Components migrated by TASK-001 through TASK-003
- Test command: run from `MyBikeLab/frontend` with `npm run test`

## Potentially impacted files
- `MyBikeLab/frontend/src/components/MiniComparator/__tests__/WheelImageCarousel.test.jsx`
- `MyBikeLab/frontend/src/components/MiniComparator/__tests__/WheelDetailPanel.test.jsx`
- `MyBikeLab/frontend/src/components/MiniComparator/__tests__/ComparisonTable.test.jsx`
- Existing test helper code may be extended locally inside test files

## Inputs
- Synthetic wheel fixtures with:
  - images plus manufacturer and retailer links
  - images and no links
  - links and no images
  - no images and no links
  - manufacturer-only links
  - retailer-only links
  - multiple retailers with unsorted prices
- Existing test tooling: Vitest, React DOM server or jsdom, Redux synthetic store helpers

## Expected outputs
- Automated tests cover all PRD automated acceptance criteria that are practical in Vitest:
  - no legacy `bg-paper-2/60` panel band
  - schematic fallback without images
  - `.t-eyebrow` headings
  - `.t-numeric` prices
  - no `brand-*` classes in migrated panel scope
  - close or dismiss control visual contract
  - design-system motion token contract
  - empty-state rendering for missing link and image combinations
  - no new localization keys required by the migrated components
  - expanded-row behavior remains unchanged
- Existing MiniComparator tests continue passing.

## Constraints
- Do not add a new test framework.
- Do not add network-dependent tests.
- Do not assert full Tailwind class strings when a narrower design-system contract assertion is sufficient.
- Tests must not require real browser layout beyond existing jsdom-compatible contract assertions.
- Use synthetic fixtures instead of modifying production wheel data.
- Do not change production code only to make tests easier unless the change is part of TASK-001 through TASK-003 behavior.
- Keep manual-only visual requirements documented in test comments or final implementation notes where automation cannot prove them, especially image clipping visual correctness.

## Dependencies
TASK-001, TASK-002, TASK-003

## Validation criteria
- [ ] `npm run test` passes from `MyBikeLab/frontend`.
- [ ] Tests fail if `WheelDetailPanel` contains `bg-paper-2/60`.
- [ ] Tests fail if migrated panel markup contains `brand-` classes.
- [ ] Tests cover no-links, manufacturer-only, retailer-only, all-links, no-images, and no-images-plus-no-links fixtures.
- [ ] Tests assert section heading and numeric typography classes.
- [ ] Tests assert retailer sorting remains ascending by price.
- [ ] Tests assert close or dismiss control contract if a dedicated control is implemented.
- [ ] Tests assert expanded-row behavior still mounts, switches, and collapses as expected.

## Tests to implement
### Unit
- `WheelImageCarousel` tests for images, single image, multiple images, and no images.
- `WheelDetailPanel` tests for all purchase-data combinations, typography classes, forbidden class absence, link attributes, and sorted retailers.

### Integration
- `ComparisonTable` expanded-row test for opening, switching, and collapsing.
- `ComparisonTable` close or dismiss test if TASK-003 adds a dedicated close button.
