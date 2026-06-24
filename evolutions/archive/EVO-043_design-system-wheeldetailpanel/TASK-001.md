# TASK-001 - Schematic-Framed Wheel Image Surface

## Objective
Update `WheelImageCarousel` so wheel product images render only inside a schematic wheel circle, with schematic line art visible above the image area. When a wheel has no images, render the schematic frame alone without showing a broken image, placeholder carousel artifact, or media outside the schematic.

## Required context
- PRD: `MyBikeLab/evolutions/EVO-043_design-system-wheeldetailpanel/prd.md`
- Design system guide: `MyBikeLab/design-system/IMPLEMENTATION-GUIDE.md`
- Design tokens: `MyBikeLab/design-system/colors_and_type.css`
- UI kit reference: `MyBikeLab/design-system/ui_kits/wheel-detail/App.jsx` and `detail.css`
- Production component: `MyBikeLab/frontend/src/components/MiniComparator/WheelImageCarousel.jsx`
- Existing asset reference: `MyBikeLab/frontend/src/assets/wheel-placeholder.svg`

## Potentially impacted files
- `MyBikeLab/frontend/src/components/MiniComparator/WheelImageCarousel.jsx`
- `MyBikeLab/frontend/src/components/MiniComparator/__tests__/WheelImageCarousel.test.jsx` or another focused test file in the same test folder

## Inputs
- `wheel.images`, which may be an array of image URLs, an empty array, or undefined
- `wheel.brand` and `wheel.model` for existing image alt text
- Current carousel active-index behavior and previous/next controls

## Expected outputs
- Product imagery is clipped to the schematic wheel circle.
- SVG schematic line art overlays the product image area and remains visible.
- Empty or missing `wheel.images` renders the schematic alone.
- Multiple image navigation remains available when more than one product image exists.
- Single image and no-image cases do not render unnecessary carousel controls.

## Constraints
- Do not change the `WheelImageCarousel` public prop shape.
- Do not change the wheel data schema.
- Do not use raw hex values or legacy `brand-*` styling.
- Use design-system color tokens through Tailwind utilities or CSS variables, especially `ink-*`, `paper-*`, and `brass-*`.
- Use square technical visual language: no rounded card frame around the schematic except controls that use `rounded-xs`.
- Use fixed-format responsive dimensions for the schematic area so hover states, images, buttons, and labels cannot resize or shift the panel layout.
- Images must be inside a clipped circular region. The schematic SVG must be above the image layer.
- If there are no images, do not fall back to `wheelPlaceholderUrl` as a visible product image inside the carousel. The schematic frame itself is the fallback.
- Carousel controls, if present, must be accessible buttons with disabled states using `opacity: 0.4` and `cursor: not-allowed`.
- Motion must use project-defined timing and easing. Use `var(--duration-base)` with `var(--ease-standard)` for slide movement and opacity; no bounce, spring, or stagger.
- Respect `prefers-reduced-motion`: keep opacity transitions if useful, remove or reduce transform movement.
- Animate only `transform` and `opacity`.
- No decorative colored status dots.
- No em-dash or en-dash in newly introduced visible text. Avoid new visible text unless needed for accessibility labels.

## Dependencies
none

## Validation criteria
- [ ] Rendering a wheel with image URLs shows at least one `<img>` clipped within the schematic circle.
- [ ] Rendering a wheel without images shows the schematic SVG and no `<img>` element for a placeholder fallback.
- [ ] Schematic line art is visually layered above the image region.
- [ ] Multiple image controls still advance and reverse the active image without leaving the schematic bounds.
- [ ] Disabled carousel controls use the required opacity and cursor behavior.
- [ ] The component contains no `brand-*`, raw blue Tailwind classes, raw hex colors, or `rounded-full` control styling in the migrated scope.

## Tests to implement
### Unit
- Add or update a Vitest component test that renders `WheelImageCarousel` with `images: ['a.png', 'b.png']` and asserts image count, schematic marker, and navigation controls.
- Add a no-image test that renders `images: []` and asserts the schematic is present while no fallback `<img>` is rendered.
- Add a single-image test that asserts no previous/next controls are rendered.

### Integration
- Covered by TASK-004 through expanded `ComparisonTable` or `WheelDetailPanel` tests.
