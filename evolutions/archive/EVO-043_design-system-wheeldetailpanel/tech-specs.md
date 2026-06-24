# Technical Specifications

## 1. General Information

- Evolution ID: EVO-043
- PRD reference: `MyBikeLab/evolutions/EVO-043_design-system-wheeldetailpanel/prd.md`
- Author: Tech Specs sub-agent
- Date: 2026-06-03

---

## 2. Technical Context

### Technical objective
Migrate the inline `WheelDetailPanel` expanded-row surface to the MyBikeLab design system while preserving comparator expansion behavior, purchase-link data handling, bilingual labels, and missing-data states.

### Affected architecture
- React component composition in `frontend/src/components/MiniComparator/`
- Existing Tailwind design-token utilities and semantic type classes from `frontend/src/index.css`
- Existing static wheel data shape, including `wheel.images` and `wheel.affiliateLinks`
- Existing Redux-driven comparator table flow and local expanded-row state

### Impacted modules
- `frontend/src/components/MiniComparator/WheelDetailPanel.jsx`
- `frontend/src/components/MiniComparator/WheelImageCarousel.jsx`
- `frontend/src/components/MiniComparator/ComparisonTable.jsx`
- `frontend/src/components/MiniComparator/__tests__/`
- Potentially `frontend/src/assets/wheel-placeholder.svg` as an implementation reference only

---

## 3. Technical Constraints

- Do not change the wheel data schema.
- Do not add new localization keys.
- Do not change which row opens, how rows open, how the expanded row is selected, or how `panelWidth` is measured.
- Do not change `WheelImageCarousel` internals beyond what is required to support schematic-framed imagery and no-image fallback.
- Do not introduce legacy `brand-*` styling or raw blue Tailwind classes in the migrated panel scope.
- Use existing design-system tokens and classes where available: `paper-*`, `ink-*`, `brass-*`, `t-eyebrow`, `t-numeric`, `t-annotation`, `rounded-xs`, `duration-base-ds`, and `ease-standard`.
- All visible-surface implementation tasks must embed applicable UI constraints from `shared-knowledge/ui-guidelines.md`.

---

## 4. Architecture Decisions

### AD-001
#### Description
Keep the expanded detail as an inline table-row panel owned by `ComparisonTable`, with `WheelDetailPanel` receiving the current `wheel` and `panelWidth` props.

#### Motivation
The PRD requires existing row expansion, selected-row ownership, and mobile breakpoint behavior to remain unchanged. Keeping the current ownership avoids unnecessary Redux, routing, or overlay changes.

#### Rejected alternatives
- Move detail state into Redux: rejected because it broadens state ownership without a functional requirement.
- Convert the detail into a drawer or modal: rejected because the PRD explicitly requires an inline expanded panel.

### AD-002
#### Description
Model the migrated panel as one design-system card surface in `WheelDetailPanel`, not as the legacy table band.

#### Motivation
The target surface must use a paper card treatment with a strong ink border and no `bg-paper-2/60` band styling. Keeping this responsibility in `WheelDetailPanel` makes the migrated visual scope explicit and testable.

#### Rejected alternatives
- Apply the card surface on the parent `<td>` wrapper only: rejected because it would split visual ownership away from the component under migration.
- Create a new shared card abstraction: rejected because this is a narrow migration and existing `.card` plus Tailwind tokens are sufficient.

### AD-003
#### Description
Implement the schematic frame in `WheelImageCarousel` by layering product imagery inside a clipped circular region and rendering SVG schematic line art above it.

#### Motivation
The PRD requires images to appear only inside the schematic wheel circle while schematic line art remains visible. `WheelImageCarousel` already owns image selection, active index, carousel controls, and image fallback behavior, so it is the narrowest owner for image composition.

#### Rejected alternatives
- Place the schematic in `WheelDetailPanel` around the carousel: rejected because the carousel controls and slide layout would remain unaware of the clipping bounds.
- Use the existing placeholder image as the entire no-image visual: rejected because the PRD requires the schematic frame to remain visible even without product imagery.

### AD-004
#### Description
Preserve manufacturer and retailer data derivation in `WheelDetailPanel`, including retailer sorting by `price_eur`, link targets, and existing empty-state labels.

#### Motivation
The PRD requires functional behavior and source ordering to remain unchanged. The migration should alter presentation only.

#### Rejected alternatives
- Normalize affiliate-link data before rendering: rejected because there is no schema-change requirement.
- Add new empty-state copy or localization keys: rejected because the PRD explicitly forbids new keys.

### AD-005
#### Description
Add focused component and integration tests around the migrated panel scope rather than broad end-to-end coverage.

#### Motivation
Existing tests are Vitest-based and assert DOM/class contracts for MiniComparator behavior. Focused tests can cover design-system classes, missing states, and expansion non-regression without adding new tooling.

#### Rejected alternatives
- Add Playwright visual tests: rejected for this evolution because the current project test strategy uses Vitest and the task must remain independently mergeable.
- Rely on manual verification only: rejected because the PRD marks several acceptance criteria as automated.

---

## 5. Task Breakdown

Each task is described in a dedicated file using `shared-knowledge/templates/TASK-TEMPLATE.md`.

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Rebuild `WheelImageCarousel` as a schematic-framed image surface with no-image fallback | none |
| TASK-002 | `TASK-002.md` | Migrate `WheelDetailPanel` surface and price ledger to design-system card, type, and link treatments | TASK-001 |
| TASK-003 | `TASK-003.md` | Align inline expansion wrapper, close or dismiss affordance, and motion timing without changing row behavior | TASK-002 |
| TASK-004 | `TASK-004.md` | Add automated coverage for migrated panel contracts and non-regression states | TASK-001, TASK-002, TASK-003 |

---

## 6. Global Validation Strategy

### Unit validation
- Render `WheelImageCarousel` with images and without images to assert schematic presence, clipped image region, and absence of broken placeholder artifacts.
- Render `WheelDetailPanel` with manufacturer-only, retailer-only, all-links, and no-links wheel fixtures.
- Assert manufacturer and retailer headings include `t-eyebrow`.
- Assert all displayed prices include `t-numeric`.
- Assert migrated panel markup does not contain `brand-` classes or `bg-paper-2/60`.

### Integration validation
- Render `ComparisonTable` with a fixture wheel and expand the row.
- Assert expanded-row behavior still mounts `WheelDetailPanel` under the selected row.
- Assert parent wrapper preserves sticky left positioning and `panelWidth`-based mobile layout behavior.
- Assert close or dismiss interaction, if exposed by the implementation, collapses the current expanded row without affecting filtering, sorting, or column visibility state.

### Functional validation
- Manually open wheels with images and links, images without links, links without images, and neither images nor links.
- Manually verify French and English labels, calls to action, and empty-state text still render through existing localization keys.
- Manually verify imagery stays inside the schematic circle and the schematic line art remains visible above imagery.
- Manually verify keyboard focus reaches the close or dismiss control and carousel controls where applicable.

### Non-regression validation
- Confirm comparator row expansion, row switching, and collapse behavior match the current model.
- Confirm retailer sorting remains ascending by `price_eur`.
- Confirm existing purchase links still use the same `href`, `target="_blank"`, and `rel="noopener noreferrer"` behavior.
- Confirm no new data fields or i18n keys are introduced.
- Run `npm run test` from `MyBikeLab/frontend`.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Schematic image clipping could hide real product images on narrow viewports | Users may lose visual context | Use responsive fixed-format dimensions and verify mobile plus desktop manually |
| Moving visual styling into `WheelImageCarousel` could accidentally change carousel interaction | Existing image navigation could regress | Keep existing active-index logic and add tests for multiple and single slide cases |
| Existing no-image behavior uses `wheelPlaceholderUrl`, but PRD requires schematic-only | Broken or duplicate visual fallback | Treat an empty `wheel.images` array as no product image and render only schematic frame |
| Close or dismiss control ownership is ambiguous because current panel closes by row toggle | Implementation may add duplicate behavior | Keep row toggle behavior, and if adding a close button, wire it through `ComparisonTable` without changing selected-row semantics |
| Tests may overfit Tailwind class strings | Cosmetic refactors become brittle | Assert required design-system contracts and forbidden legacy classes, not full class lists |

---

## 8. Rollback Plan

- Revert changes to `WheelImageCarousel.jsx` to restore legacy carousel rendering.
- Revert changes to `WheelDetailPanel.jsx` to restore legacy band and ledger markup.
- Revert changes to `ComparisonTable.jsx` if the close or motion changes affect expansion behavior.
- Remove EVO-043-specific tests if rollback restores the pre-migration component contract.
