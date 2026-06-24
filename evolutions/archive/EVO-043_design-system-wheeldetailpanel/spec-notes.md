# Spec Notes

## PRD Interpretations

- The phrase "close or dismiss control" is interpreted as preserving the current row-toggle collapse behavior and allowing a dedicated close button if needed for a visible accessible dismiss affordance. If a dedicated button is added, it must be wired through `ComparisonTable` because that component owns `expandedId`.
- "Wheel imagery is constrained by the schematic" is interpreted as a layered composition inside `WheelImageCarousel`: product images are clipped to a circular wheel area, and SVG schematic line art is rendered above them.
- "Schematic remains available without images" is interpreted as schematic-only rendering when `wheel.images` is empty or undefined. The current placeholder-image fallback should not appear as a carousel image in this case.
- "Source ordering, link availability, price display, and call-to-action behavior remain functionally unchanged" is interpreted as preserving the current manufacturer rendering and retailer sorting by ascending `price_eur`.
- "No new localization keys are required" is interpreted as a hard constraint. New visible labels should be avoided; any accessibility labels should reuse an existing key where possible or use non-visible static labels only if no existing key fits.
- The UI kit is a reference for visual language, schematic layering, card borders, numeric typography, and retailer ladder treatment. Full-page UI kit sections such as title block, comparable wheels, and spec sheet groups are out of scope because the PRD preserves the existing inline detail panel content.

## Architecture Decision Rationale

- AD-001 keeps expansion state in `ComparisonTable` because the current local `expandedId` state already matches the inline row behavior required by FR-001 and AC-011.
- AD-002 places the card surface in `WheelDetailPanel` because that component is the migrated surface and can directly remove the legacy `bg-paper-2/60` treatment.
- AD-003 keeps schematic image composition in `WheelImageCarousel` because that component owns image fallback, active slide state, and carousel controls.
- AD-004 keeps affiliate-link derivation in `WheelDetailPanel` to avoid unnecessary data normalization and protect the no-schema-change constraint.
- AD-005 uses focused Vitest coverage because the project already has jsdom and React rendering tests for MiniComparator, and the PRD calls for automated checks on class and rendering contracts.

## Tradeoffs

- A new shared schematic component was considered but discarded for the specs because there is only one production consumer in this evolution. Implementation can extract a small local helper inside `WheelImageCarousel` if it improves readability.
- A dedicated close button was not mandated as a separate task by itself because current behavior already supports dismissal through row reactivation. It is included in TASK-003 so the implementation agent can satisfy AC-007 without changing expansion ownership.
- Full visual regression automation was considered but discarded because the repo currently has no Playwright or visual snapshot setup. Manual verification remains required for the image-clipping visual target.
- Reusing `wheelPlaceholderUrl` as a no-image display was discarded because the PRD specifically says the schematic frame must display by itself when no product imagery is available.
- Adding new localization keys for a close button was discarded because AC-012 says no new localization keys are introduced.
- Moving animation to JavaScript or Motion was discarded because the panel transition is simple, frequent enough to benefit from CSS interruption, and already expressible with existing design-system motion tokens.

## Open Questions

- Confirm whether the existing row reactivation behavior is sufficient as the "current panel interaction model" for dismissing, or whether implementation should add a dedicated close button inside the panel.
- Confirm whether the no-image schematic should include any non-visible accessibility text beyond the existing image alt behavior.
- Confirm whether manual visual validation should be performed against a specific fixture wheel with real remote images, since some current dataset image URLs are remote and may be unavailable during offline development.
