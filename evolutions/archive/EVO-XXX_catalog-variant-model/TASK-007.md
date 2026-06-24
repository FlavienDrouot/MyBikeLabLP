# TASK-007: WheelDetailPanel — per-configuration axis surfacing

## Objective

Ensure the expanded wheel detail panel reflects the specific configuration the user opened —
its own price ledger, and the three comparable axis values (spoke material, rim width, brake
type) — so a configuration opened from inside a group is unambiguous.

## Required context

- `WheelDetailPanel.jsx` receives a single `wheel` object and renders its price ledger
  (`affiliateLinks.manufacturer` + `retailers`) and image carousel. Because each configuration
  is its own object (AD-001), the panel is already per-configuration for price/links — verify
  this holds for exploded siblings (which inherit base price where no per-variant price
  exists).
- The panel does not currently surface the three axis values explicitly. For a grouped model,
  the user needs to see which configuration this is (e.g. "Carbon spokes, 37mm").
- Axis display values must use the same i18n resolution as the comparator
  (`spokeMaterial.*`, `brakeType.*`) for the categorical axes; rim width is numeric (mm).
- This is a small, mostly additive change. Keep the existing layout, breakpoint
  (`STACKED_PANEL_BREAKPOINT_PX`), and ledger behavior intact.

### UI-guidelines constraints (embed)

- Em-dash banned in editorial text; use a colon, comma or parentheses for axis labels.
- Reuse existing radius/border tokens; no new card elevation.
- Label above value for any spec line; never a placeholder-as-label.
- Animate only `transform`/`opacity` if anything animates; respect `prefers-reduced-motion`.

## Potentially impacted files

- `frontend/src/components/MiniComparator/WheelDetailPanel.jsx`
- `frontend/src/components/MiniComparator/__tests__/WheelDetailPanel.test.jsx`

## Inputs

- The configuration `wheel` object.
- i18n keys for the axes (from TASK-006).

## Expected outputs

- The detail panel surfaces the three comparable axis values for the open configuration
  (spoke material and brake type localized; rim width in mm), without breaking the existing
  price ledger and image layout.
- A configuration opened from a group shows values matching that exact configuration.

## Constraints

- No change to the price-ledger sorting/best-price logic.
- Keep the stacked/side-by-side breakpoint behavior.
- Do not introduce a sibling-switcher UI in this task (out of scope; the table already lets
  the user pick a sibling row). Surfacing the axis values is sufficient.

## Dependencies

TASK-005

## Validation criteria

- [ ] The detail panel displays the open configuration's spoke material, rim width and brake
      type, localized where categorical.
- [ ] Price ledger and image carousel behavior unchanged.
- [ ] Opening two different siblings of one group shows their respective axis values and
      prices.
- [ ] `npm run lint` clean; full Vitest suite green.

## Tests to implement

### Unit / component
- Render the panel for a configuration; assert the three axis values appear with the correct
  localized labels.
- Assert price-ledger non-regression (existing tests stay green).

### Integration
- Open two siblings of a group in turn; assert distinct axis values and prices render.
