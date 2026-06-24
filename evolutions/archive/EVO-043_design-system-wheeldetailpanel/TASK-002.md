# TASK-002 - Design-System WheelDetailPanel Surface And Ledger

## Objective
Migrate `WheelDetailPanel` from the legacy background band into a design-system card surface, while preserving manufacturer and retailer grouping, retailer price ordering, purchase-link behavior, existing empty states, and bilingual labels.

## Required context
- PRD: `MyBikeLab/evolutions/EVO-043_design-system-wheeldetailpanel/prd.md`
- Design system guide: `MyBikeLab/design-system/IMPLEMENTATION-GUIDE.md`
- Design tokens: `MyBikeLab/design-system/colors_and_type.css`
- UI guidelines: `shared-knowledge/ui-guidelines.md`
- Production component: `MyBikeLab/frontend/src/components/MiniComparator/WheelDetailPanel.jsx`
- Schematic image component from TASK-001: `MyBikeLab/frontend/src/components/MiniComparator/WheelImageCarousel.jsx`

## Potentially impacted files
- `MyBikeLab/frontend/src/components/MiniComparator/WheelDetailPanel.jsx`
- `MyBikeLab/frontend/src/components/MiniComparator/__tests__/WheelDetailPanel.test.jsx` or another focused test file in the same test folder

## Inputs
- `wheel.affiliateLinks.manufacturer`
- `wheel.affiliateLinks.retailers`
- `wheel.brand`
- Existing localization keys:
  - `wheelDetail.noLinks`
  - `wheelDetail.manufacturer`
  - `wheelDetail.whereToBuy`
  - `wheelDetail.priceAnnotation`
  - `wheelDetail.buyLink`
- `panelWidth`, which currently drives the mobile breakpoint at `< 870`

## Expected outputs
- The panel root uses design-system card styling: `paper-0` fill, `1px solid ink-10` border treatment, square radius, no shadow.
- The legacy `bg-paper-2/60` band treatment is removed from `WheelDetailPanel`.
- Manufacturer and retailer headings use `.t-eyebrow` while preserving existing localized labels.
- Every displayed price value uses `.t-numeric`.
- Manufacturer and retailer links remain actionable with the same URL, target, and rel behavior.
- Retailers remain sorted ascending by `price_eur`.
- No-links, manufacturer-only, retailer-only, and all-links cases render without layout failure.
- The panel remains responsive through the existing `panelWidth < 870` branch.

## Constraints
- Do not add, remove, or rename localization keys.
- Do not change the affiliate-link data shape.
- Do not change retailer sorting behavior.
- Do not introduce new content sections.
- Do not use `brand-*` classes, raw blue Tailwind utilities, raw hex colors, pure black, neon, glows, gradients, or decorative status dots.
- Cards and panels must be square with design-system borders. Use `rounded-none` for the panel surface.
- Buttons and links that are visually button-like must use `rounded-xs`, not pill radius.
- Numeric values, including all prices, must use `.t-numeric` and tabular figures.
- Section labels must use `.t-eyebrow`; no section-index labels.
- Empty states must be explicit and must not leave a blank ledger area.
- Disabled state patterns, if any are introduced, must use `opacity: 0.4` and `cursor: not-allowed`.
- Hover and focus states must use design-system tokens: hover may darken border or text to ink/brass tokens; focus must use the existing 2px brass focus treatment.
- No new visible prose should use em-dash or en-dash punctuation.
- Text must fit within its parent on mobile and desktop; long French labels must not hide price information.

## Dependencies
TASK-001

## Validation criteria
- [ ] Panel root no longer contains `bg-paper-2/60`.
- [ ] Panel root contains design-system card surface classes or equivalent token styles for `paper-0`, `border`, and `ink-10`.
- [ ] Manufacturer heading uses `t-eyebrow` when manufacturer data exists.
- [ ] Retailer heading uses `t-eyebrow` when retailer data exists.
- [ ] Every manufacturer and retailer price value uses `t-numeric`.
- [ ] No migrated panel element uses `brand-*` classes or legacy brand-blue treatment.
- [ ] No-links empty state still renders `t('wheelDetail.noLinks')`.
- [ ] Manufacturer-only, retailer-only, and all-links fixtures render the expected groups and links.
- [ ] Retailer ordering remains ascending by `price_eur`.
- [ ] Existing `target="_blank"` and `rel="noopener noreferrer"` attributes remain on external purchase links.

## Tests to implement
### Unit
- Add or update a focused `WheelDetailPanel` test that renders all-links, no-links, manufacturer-only, and retailer-only fixtures.
- Assert `.t-eyebrow` on section labels and `.t-numeric` on each price element.
- Assert `bg-paper-2/60` and `brand-` do not appear in rendered markup.
- Assert sorted retailer order by rendered names or prices.

### Integration
- Covered by TASK-004 through expanded-row rendering in `ComparisonTable`.
