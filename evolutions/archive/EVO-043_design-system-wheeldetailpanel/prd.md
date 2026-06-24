# PRD - Product Requirements Document

## 1. General Information

- Evolution ID: EVO-043
- Title: Design system migration - WheelDetailPanel
- Author: Flavien Drouot
- Date: 2026-06-03
- Version: 1.0
- Needs Assessment reference: `MyBikeLab/evolutions/EVO-043_design-system-wheeldetailpanel/needs-assessment.md`

---

## 2. Functional Objective

The WheelDetailPanel must present expanded wheel details as a design-system-compliant product detail surface while preserving its existing comparator behavior, data handling, language support, and purchase-link workflow.

After the evolution, the panel must visually and functionally align with the MyBikeLab design system surfaces introduced in EVO-039 through EVO-042. The system must display the selected wheel illustration within a schematic frame, present manufacturer and retailer price sources with consistent typographic treatment, support the existing close interaction, and continue to handle missing images or affiliate links without regression.

---

## 3. Target Behavior

### General description

When a user expands a wheel row in the comparator, the application displays an inline detail panel below that row. The panel remains composed of two functional areas:

- A wheel illustration area.
- A price ledger area containing manufacturer and retailer price-link information.

The wheel illustration area must show product imagery only inside the bounds of the schematic wheel frame. The schematic frame remains visible as the primary visual structure. If no product imagery is available for the selected wheel, the schematic frame still displays by itself.

The price ledger must preserve the existing manufacturer and retailer grouping. Each available price source must remain readable, ranked as currently defined by the product behavior, and actionable through its existing link or call to action. When price-link data is missing, the panel must continue to show the existing empty-state content.

The close or dismiss control must remain available through the current panel interaction model. Opening, closing, and dismissing the panel must preserve the existing trigger logic and row expansion behavior.

---

## 4. Functional Rules

### FR-001 - Inline detail panel behavior is preserved

The WheelDetailPanel must remain an inline expanded panel associated with the selected comparator row. The evolution must not change how users open the panel, which row the panel belongs to, or how the expanded state is selected.

### FR-002 - Panel surface follows the design system card model

The expanded panel must read as a design-system card surface, not as a legacy background band. Its visible surface must use the design-system paper fill and ink border treatment specified in the needs assessment.

### FR-003 - Wheel imagery is constrained by the schematic

When wheel images are available, they must appear only inside the schematic wheel circle. The schematic line art must remain visible over the image area so that the wheel detail visual reads as a framed technical schematic rather than standalone product photography.

### FR-004 - Schematic remains available without images

When a wheel has no image data, the illustration area must still render the schematic wheel frame without error, blank broken media, or missing visual structure.

### FR-005 - Price ledger structure is preserved

The panel must continue to separate purchase information into Manufacturer and Retailers sections. Existing source ordering, link availability, price display, and call-to-action behavior must remain functionally unchanged.

### FR-006 - Missing purchase data is handled gracefully

If manufacturer links, retailer links, or all affiliate links are missing, the panel must continue to render the appropriate existing empty-state content without layout failure or interaction errors.

### FR-007 - Section headings use design-system eyebrow treatment

The Manufacturer and Retailers section headings must use the design-system eyebrow text treatment defined in the needs assessment. They must remain visually identifiable as section labels and must continue to reflect the existing localized labels.

### FR-008 - Prices and numeric values use design-system numeric treatment

All price values and other numeric values displayed in the panel must use the design-system numeric text treatment defined in the needs assessment. Numeric values must remain legible, aligned for comparison, and unchanged in meaning.

### FR-009 - Legacy brand-blue treatment is removed from the panel

The panel must not display legacy brand-blue styling for the migrated surface, ledger, illustration integration, close control, or panel animation affordances.

### FR-010 - Close control remains accessible and design-system compliant

The close or dismiss control must remain visible and usable. Its visual treatment must follow the design-system color, radius, and focus requirements from the needs assessment. It must not display colored status-dot decoration.

### FR-011 - Panel animation follows design-system motion

The panel open and close transition must use the design-system motion timing and easing specified in the needs assessment while preserving the existing expanded/collapsed behavior.

### FR-012 - Existing bilingual content remains functional

The panel must continue to work in both French and English using the existing localization keys. No new localization keys are required for this evolution.

---

## 5. Detailed Use Cases

### UC-001 - User expands a wheel with images and affiliate links

#### Preconditions
- The comparator is visible.
- A wheel row is available.
- The wheel has at least one image.
- The wheel has manufacturer and/or retailer affiliate-link data.

#### Steps
1. The user expands the wheel row.
2. The system displays the inline detail panel below the selected row.
3. The system displays the wheel imagery inside the schematic frame.
4. The system displays the Manufacturer and Retailers sections according to available link data.
5. The user reviews prices and available calls to action.

#### Expected result
- The panel opens for the selected wheel.
- Wheel imagery is visible only within the schematic circle.
- The schematic line art remains visible over the imagery.
- Price sources remain grouped and actionable.
- The panel uses the required design-system visual treatment.

#### Error cases
- None beyond the existing missing-data states.

### UC-002 - User expands a wheel with images but no affiliate links

#### Preconditions
- The comparator is visible.
- A wheel row is available.
- The wheel has at least one image.
- The wheel has no affiliate-link data.

#### Steps
1. The user expands the wheel row.
2. The system displays the inline detail panel below the selected row.
3. The system displays the wheel imagery inside the schematic frame.
4. The system displays the existing no-links empty-state content.

#### Expected result
- The schematic-framed imagery renders correctly.
- The price ledger does not display broken or empty purchase rows.
- The existing no-links message is visible.

#### Error cases
- Missing affiliate data must not prevent the panel from rendering.

### UC-003 - User expands a wheel with affiliate links but no images

#### Preconditions
- The comparator is visible.
- A wheel row is available.
- The wheel has no image data.
- The wheel has manufacturer and/or retailer affiliate-link data.

#### Steps
1. The user expands the wheel row.
2. The system displays the inline detail panel below the selected row.
3. The system displays the schematic wheel frame without carousel imagery.
4. The system displays available manufacturer and/or retailer price rows.

#### Expected result
- The schematic renders alone without error.
- Price rows remain visible and actionable.
- No broken image or empty carousel artifact is shown outside the schematic.

#### Error cases
- Missing image data must not prevent the panel from rendering purchase information.

### UC-004 - User expands a wheel with neither images nor affiliate links

#### Preconditions
- The comparator is visible.
- A wheel row is available.
- The wheel has no image data.
- The wheel has no affiliate-link data.

#### Steps
1. The user expands the wheel row.
2. The system displays the inline detail panel below the selected row.
3. The system displays the schematic wheel frame alone.
4. The system displays the existing no-links empty-state content.

#### Expected result
- The panel remains usable.
- The schematic renders without image content.
- The existing empty state communicates that no links are available.

#### Error cases
- Missing images and missing links must not create a rendering error.

### UC-005 - User dismisses the expanded detail panel

#### Preconditions
- A WheelDetailPanel is open.
- The close or dismiss control is visible.

#### Steps
1. The user activates the close or dismiss control.
2. The system closes the expanded panel.

#### Expected result
- The panel closes according to the existing dismiss behavior.
- The close control remains visually consistent with the design system.
- The closing transition uses the required design-system motion behavior.

#### Error cases
- The close control must remain focusable and usable when navigating by keyboard.

### UC-006 - User switches between French and English

#### Preconditions
- The comparator and WheelDetailPanel are available.
- The application supports French and English language switching.

#### Steps
1. The user views the WheelDetailPanel in one supported language.
2. The user switches to the other supported language.
3. The user expands or reviews the WheelDetailPanel again.

#### Expected result
- Existing localized labels and empty-state messages continue to display correctly.
- No untranslated key or missing text appears.
- The visual layout remains functional after language switching.

#### Error cases
- Longer localized labels must not make the panel unusable or hide price information.

---

## 6. Acceptance Criteria

### AC-001
#### Description
The expanded panel surface uses the design-system card treatment specified in the needs assessment.

#### Expected verification
Open a wheel detail panel and verify that the visible panel surface uses `paper-0` fill and a `1px solid ink-10` border, with no remaining `bg-paper-2/60` band treatment.

#### Type
- Automated
- Manual

### AC-002
#### Description
Wheel carousel photos are composited inside the schematic wheel circle.

#### Expected verification
Open a wheel that has image data and verify that product imagery appears only inside the schematic circle and that schematic line art overlays the image area.

#### Type
- Manual

### AC-003
#### Description
The schematic renders alone when no wheel images are available.

#### Expected verification
Open a wheel without image data and verify that the schematic frame appears without broken image output, rendering error, or empty carousel artifact outside the schematic.

#### Type
- Automated
- Manual

### AC-004
#### Description
Manufacturer and Retailers section headings use the design-system eyebrow treatment.

#### Expected verification
Inspect the panel headings and verify that Manufacturer and Retailers use the `.t-eyebrow` treatment: uppercase mono label styling with the ink color and tracking defined in the needs assessment.

#### Type
- Automated
- Manual

### AC-005
#### Description
All panel price values use the design-system numeric treatment.

#### Expected verification
Inspect every displayed price value in manufacturer and retailer rows and verify that each uses the `.t-numeric` treatment.

#### Type
- Automated
- Manual

### AC-006
#### Description
No legacy brand-blue styling remains in the migrated panel scope.

#### Expected verification
Verify that no `brand-*` blue visual class or equivalent legacy brand-blue treatment is present in the WheelDetailPanel migrated scope.

#### Type
- Automated

### AC-007
#### Description
The close or dismiss button follows the design-system visual and focus treatment.

#### Expected verification
Open the panel and verify that the close control uses ink-11 color, radius-xs shape, and a brass-8 focus ring with 2px width and 2px offset. Verify that no colored status-dot decoration is displayed.

#### Type
- Automated
- Manual

### AC-008
#### Description
Panel open and close animation uses design-system motion behavior.

#### Expected verification
Open and close the panel and verify that the transition uses `--duration-base` at 220ms and `--ease-standard`.

#### Type
- Automated
- Manual

### AC-009
#### Description
French and English language switching remains functional.

#### Expected verification
Switch between French and English and verify that section labels, calls to action, and empty-state text display correctly without untranslated keys or functional regression.

#### Type
- Manual

### AC-010
#### Description
Existing empty-state cases still render correctly.

#### Expected verification
Verify all existing empty-state scenarios: no links, no manufacturer links, no retailer links, no images, and neither images nor links. Each state must render without error and with the expected existing empty-state content.

#### Type
- Automated
- Manual

### AC-011
#### Description
Drawer layout, trigger logic, and row expansion behavior are unchanged.

#### Expected verification
Expand, switch, and close wheel detail panels from the comparator table and verify that behavior matches the existing interaction model.

#### Type
- Automated
- Manual

### AC-012
#### Description
No new content sections or localization keys are introduced.

#### Expected verification
Review the panel content and localization behavior and verify that the evolution only migrates the existing panel content and interactions defined in the needs assessment.

#### Type
- Automated

---

## 7. Functional Impacts

### Impacted components
- `WheelDetailPanel`: panel surface, illustration presentation, section heading presentation, price presentation, empty-state rendering.
- `MiniComparator`: close or dismiss control presentation and panel open/close motion behavior.

### Impacted data
- No wheel data schema change is expected.
- Existing wheel image data must continue to drive the carousel when available.
- Existing affiliate-link data must continue to drive manufacturer and retailer price rows.
- Existing missing-data cases must remain supported.

### Impacted APIs
- No external API change is expected.
- No backend API exists in the current frontend-only MVP scope.

### Impacted permissions / roles
- No permission or role change is expected.
- The application has no user account or role-based access behavior in the current MVP.

---

## 8. Out of Scope

- Changing drawer layout, open/close behavior, trigger logic, or selected-row behavior.
- Adding new detail sections such as specification values, comparable wheels, or retailer ranking features.
- Changing the internal implementation of `WheelImageCarousel`.
- Adding new i18n keys.
- Changing wheel data schema.
- Introducing backend, analytics, tracking, or real-time price sourcing.
- Modifying unrelated comparator surfaces outside the scope defined in the needs assessment.

---

## 9. Constraints

- The panel must remain functional with or without affiliate-link data.
- Existing French and English localization must continue to work without regression.
- EVO-039 foundation tokens are a completed prerequisite.
- EVO-042 MiniComparator design-system migration should be confirmed before shipping EVO-043 for visual consistency.
- The schematic and image composition must degrade gracefully when wheel images are unavailable.
- The `panelWidth` behavior that drives the existing mobile breakpoint remains unchanged.

---

## 10. Test Plan

### Automated tests expected
- Verify that the panel surface no longer uses the legacy `bg-paper-2/60` band treatment.
- Verify that section headings use `.t-eyebrow`.
- Verify that price values use `.t-numeric`.
- Verify that no legacy `brand-*` classes remain in the migrated panel scope.
- Verify that the close control uses the required design-system focus and radius treatment.
- Verify that panel motion uses `--duration-base` and `--ease-standard`.
- Verify empty-state rendering for no links, no manufacturer links, no retailer links, no images, and no images plus no links.
- Verify that no new localization keys are required for this evolution.

### Manual tests expected
- Open a wheel with images and links and verify the full target behavior.
- Open a wheel with images but no links and verify schematic-framed imagery plus empty-state content.
- Open a wheel with links but no images and verify schematic-only illustration plus price ledger.
- Open a wheel with neither images nor links and verify schematic-only illustration plus no-links content.
- Use the close or dismiss control with mouse and keyboard.
- Switch between French and English and verify labels, empty-state text, layout, and calls to action.
- Visually confirm that the panel reads as part of the MyBikeLab design-system surface family.

### Edge cases
- Wheel with only manufacturer link data.
- Wheel with only retailer link data.
- Wheel with multiple retailer links.
- Wheel with no image data.
- Wheel with no affiliate-link data.
- Wheel with neither images nor affiliate-link data.
- Long localized text in French or English.

### Non-regression
- Comparator row expansion behavior remains unchanged.
- Existing filter, sort, and column visibility behavior remains unchanged.
- Existing purchase links and calls to action remain actionable.
- Existing manufacturer and retailer grouping remains unchanged.
- Existing responsive behavior driven by `panelWidth` remains unchanged.
