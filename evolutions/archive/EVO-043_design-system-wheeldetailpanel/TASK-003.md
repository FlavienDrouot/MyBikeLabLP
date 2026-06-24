# TASK-003 - Inline Expansion Motion And Dismiss Affordance

## Objective
Align the inline detail panel wrapper, close or dismiss affordance, and expansion motion with the design system while preserving existing comparator row expansion behavior and `panelWidth` measurement.

## Required context
- PRD: `MyBikeLab/evolutions/EVO-043_design-system-wheeldetailpanel/prd.md`
- Production table owner: `MyBikeLab/frontend/src/components/MiniComparator/ComparisonTable.jsx`
- Migrated panel from TASK-002: `MyBikeLab/frontend/src/components/MiniComparator/WheelDetailPanel.jsx`
- Design tokens: `MyBikeLab/design-system/colors_and_type.css`
- UI guidelines: `shared-knowledge/ui-guidelines.md`

## Potentially impacted files
- `MyBikeLab/frontend/src/components/MiniComparator/ComparisonTable.jsx`
- `MyBikeLab/frontend/src/components/MiniComparator/WheelDetailPanel.jsx`
- `MyBikeLab/frontend/src/components/MiniComparator/__tests__/ComparisonTable.test.jsx`
- `MyBikeLab/frontend/src/components/MiniComparator/__tests__/MiniComparator.viewport-cap.test.jsx` if existing assertions need class-contract updates

## Inputs
- Current `expandedId` state and `toggleExpanded` logic in `ComparisonTable`
- Current `setPanelRef` behavior and sticky-left wrapper
- Current `panelWidth` measurement behavior
- Existing row click behavior

## Expected outputs
- Existing row click expansion and collapse behavior remains unchanged.
- The expanded panel still mounts in the table row under the selected wheel.
- `panelWidth` still reflects the scroll container width and continues to drive the mobile layout in `WheelDetailPanel`.
- Panel open/close transition uses `var(--duration-base)` at 220ms and `var(--ease-standard)`.
- A visible and keyboard-focusable close or dismiss control is available through the current panel interaction model.
- If a dedicated close button is added, it collapses the current panel by setting `expandedId` to `null` without changing filters, sorting, column visibility, or row switching behavior.
- Close or dismiss control uses design-system visual treatment: `text-ink-11`, `rounded-xs`, and the global brass focus ring. It does not display colored status-dot decoration.

## Constraints
- Do not replace the inline expanded-row model with a drawer, modal, portal, or route.
- Do not change how rows are selected for expansion.
- Do not remove the existing ability to collapse by activating the expanded row trigger.
- Do not change `panelWidth < 870` semantics.
- Use CSS transitions for the panel motion; do not introduce new animation libraries.
- Motion must use `var(--duration-base)` and `var(--ease-standard)`.
- Respect `prefers-reduced-motion`: keep opacity/color transitions, remove or reduce movement.
- Animate only `transform` and `opacity`.
- Focus state must use the existing design-system 2px brass outline at 2px offset.
- Close or dismiss control must be an accessible button with a localized or meaningful `aria-label`. Reuse an existing localization key if available; do not add a new key for EVO-043.
- Use Lucide icons through the existing `Icon` wrapper if an icon is needed.
- No `rounded-full`, colored status dot, `brand-*`, raw hex, raw blue utility, bounce, spring, or stagger.
- No new visible prose should use em-dash or en-dash punctuation.

## Dependencies
TASK-002

## Validation criteria
- [ ] Expanding a row still renders one detail panel below that row.
- [ ] Clicking the same row still collapses the panel.
- [ ] Switching to another row still moves the panel to the newly selected row.
- [ ] `setPanelRef` and sticky-left wrapper behavior remain in place.
- [ ] The panel motion uses `var(--duration-base)` or Tailwind's `duration-base-ds` and `var(--ease-standard)` or `ease-standard`.
- [ ] The close or dismiss control is visible, keyboard focusable, and collapses the current panel.
- [ ] Close or dismiss control includes `rounded-xs` and `text-ink-11` or equivalent token styling.
- [ ] No colored status-dot decoration is present in the close or dismiss control.

## Tests to implement
### Unit
- Update `ComparisonTable` tests to assert expanded panel mount and collapse behavior using a fixture wheel.
- Add an assertion that the panel wrapper or panel root includes the required motion class or inline transition token.
- If a dedicated close button is added, assert it collapses the panel when activated.

### Integration
- Re-run existing viewport-cap tests and update only class-contract expectations directly affected by the migrated surface, not the tested behavior.
