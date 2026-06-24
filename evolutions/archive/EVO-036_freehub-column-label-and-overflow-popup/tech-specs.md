# Technical Specifications

## 1. General Information

- Evolution ID: EVO-036
- PRD reference: `EVO-036_freehub-column-label-and-overflow-popup/prd.md`
- Author: Flavien Drouot
- Date: 2026-06-02

---

## 2. Technical Context

### Technical objective

Rename the freehub column label from "Freehub" to "FREEHUB OPTIONS" in the comparator table and add a constrained maximum width to the column. When a cell's content is truncated by that maximum width, clicking or tapping the cell must open a dismissible popup listing all freehub options for the corresponding wheel. Non-truncated cells remain non-interactive.

### Affected architecture

- `src/config/wheelProperties.jsx` — central registry: column definition for `freehubOptions` modified (max-width constraint + custom `renderCell`)
- `src/components/MiniComparator/ComparisonTable.jsx` — table rendering: freehub cells need to conditionally enable popup interaction and overflow measurement
- `src/components/MiniComparator/FreehubPopup.jsx` — new component: popup that lists all freehub options
- `public/locales/en.json` and `public/locales/fr.json` — translation keys updated (column label rename + popup title string)

### Impacted modules

- `MiniComparator` feature folder (`ComparisonTable`, new `FreehubPopup`)
- `wheelProperties.jsx` registry (column spec for `freehubOptions`)
- All locale JSON files (label rename + popup strings)

---

## 3. Technical Constraints

- The popup trigger is click/tap only; hover-based interaction is explicitly forbidden (mobile compatibility).
- Truncation detection must be done at render time per cell, not pre-computed globally, because the column width is fixed after measurement (MeasuringTable / colWidths flow).
- The `renderCell` override for `freehubOptions` in `wheelProperties.jsx` must not import React popup state — the registry is data-only. Popup state is managed in `ComparisonTable` or a dedicated cell component.
- The popup must be dismissible by click/tap outside. The outside-click handler must not propagate to the row's `onClick` (which opens WheelDetailPanel), so event propagation must be stopped appropriately.
- The existing MeasuringTable measures column content width to pin column widths. Adding a `max-w` constraint changes what the measured column reports. The max-width must be applied consistently to both the visible table and MeasuringTable so measured widths remain accurate. (See AD-002.)
- The table row click handler (`toggleExpanded`) is on `<tr>`. A click on a freehub cell that triggers the popup must stop propagation to avoid simultaneously expanding the detail panel.
- Tailwind classes used for max-width and truncation must be on the `<td>` element; `whitespace-nowrap overflow-hidden text-ellipsis` are already applied via `cellClassFor` + hardcoded classes in `ComparisonTable` — the max-width must be added at the column level.
- All UI states for the popup interactive cell must be explicitly defined: default, hover (desktop only), active/pressed, popup-open.

---

## 4. Architecture Decisions

### AD-001 — Popup state and truncation detection live in a dedicated `FreehubCell` component

#### Description
The per-row freehub cell is extracted into a small `FreehubCell` component (located alongside `ComparisonTable` in `src/components/MiniComparator/`). This component holds the `isPopupOpen` boolean state, measures its own DOM node with a `ref` to detect truncation (`scrollWidth > clientWidth`), and conditionally renders `FreehubPopup`.

#### Motivation
A per-cell component is the correct granularity for local interaction state (popup open/close, truncation check). Keeping this state in `ComparisonTable` would require one state entry per row — awkward to scale and harder to read. The registry (`wheelProperties.jsx`) must remain data-only and free of React hooks; it cannot own this logic.

#### Rejected alternatives
- **State in `ComparisonTable`** — would require a `Map<wheelId, boolean>` for popup visibility and a separate `Map<wheelId, boolean>` for truncation; adds complexity to an already sizeable component.
- **CSS-only visibility with `::after` pseudo-element tooltip** — not dismissible via outside click on mobile; breaks FR-007 and FR-008.
- **`title` attribute tooltip** — not a popup; does not meet FR-004 or FR-006.

---

### AD-002 — Max-width enforced via a Tailwind class on `cellClassName` in the registry, applied identically in both the visible table and MeasuringTable

#### Description
The maximum column width for `freehubOptions` is set to `max-w-[160px]` (160 px) as a Tailwind class added to the `cellClassName` in `wheelProperties.jsx`. Because `ComparisonTable` uses `colWidths` (measured from MeasuringTable) to set fixed column widths via `<colgroup>`, and because MeasuringTable renders the same `cellClassName`, the 160 px cap propagates to the measurement pass. The measured width for `freehubOptions` will therefore never exceed 160 px, and the `<col>` will be set to at most 160 px.

#### Motivation
- Keeps the constraint declaration in one place (the registry) rather than duplicating it in ComparisonTable and MeasuringTable.
- No new prop or special case is needed; `cellClassName` is already threaded through `cellClassFor()` to both rendering paths.
- 160 px is wide enough to display short option strings (e.g. "XDR / HG") without truncation while preventing runaway expansion for wheels with 5+ options.

#### Rejected alternatives
- **Inline `style={{ maxWidth }}` passed from ComparisonTable** — would bypass the registry and require a parallel data lookup.
- **`max-w-[200px]`** — reviewed against observed freehub option strings; 160 px fits ~2 short options comfortably and truncates at 3+, which is the intended UX.
- **`max-w-[128px]` (Tailwind `max-w-32`)** — too narrow; single options like "Shimano Micro Spline" would already truncate.

---

### AD-003 — Outside-click dismissal via a `useEffect` document listener attached only while the popup is open

#### Description
When `isPopupOpen` is true, `FreehubCell` attaches a `mousedown`/`touchstart` listener to `document`. If the event target is outside the popup and cell container, the popup closes. The listener is cleaned up when the popup closes or the component unmounts.

#### Motivation
This is the standard pattern for outside-click dismissal and is already established in the codebase (ColumnSelector uses a similar approach). It correctly handles both desktop click and mobile tap (FR-007, FR-008) without requiring a full-screen backdrop element.

#### Rejected alternatives
- **Full-screen backdrop `<div>` with `onClick`** — simpler but adds a DOM element that can interfere with scroll and layout; also harder to handle multi-popup scenarios in the future.
- **`onBlur` on the cell** — does not fire on mobile tap; unreliable for this use case.

---

### AD-004 — Truncation detection via `scrollWidth > clientWidth` measured after render

#### Description
`FreehubCell` holds a `ref` on the inner text container. After each render, `useEffect` compares `el.scrollWidth` and `el.clientWidth`. If `scrollWidth > clientWidth`, the cell is truncated and the click handler is armed.

#### Motivation
This is the standard DOM API for detecting text truncation without a secondary measurement pass. It requires no extra layout calculation and works reliably as long as `overflow: hidden` is applied (which it already is via `overflow-hidden` on the `<td>`).

#### Rejected alternatives
- **Pre-computing truncation in MeasuringTable** — MeasuringTable's purpose is to measure natural column widths, not to produce per-cell overflow flags. Adding this concern blurs its responsibility.
- **Comparing string length to a character threshold** — fragile; character widths vary by font, letter, and browser.

---

## 5. Task Breakdown

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Rename freehub column label in all locale files | none |
| TASK-002 | `TASK-002.md` | Add max-width constraint to `freehubOptions` column spec in registry | none |
| TASK-003 | `TASK-003.md` | Create `FreehubPopup` component | none |
| TASK-004 | `TASK-004.md` | Create `FreehubCell` component with truncation detection and popup wiring | TASK-003 |
| TASK-005 | `TASK-005.md` | Integrate `FreehubCell` into `ComparisonTable` | TASK-004 |

---

## 6. Global Validation Strategy

### Unit validation
- No automated unit tests required for this evolution (PRD section 10). All behavior is visual and interaction-based.

### Integration validation
- Load the comparator with a wheel that has many freehub options (3+). Verify column max-width is respected and truncation indicator appears.
- Load the comparator with a wheel that has one freehub option. Verify no truncation and no popup.

### Functional validation
- AC-001 through AC-007 verified manually as specified in the PRD.

### Non-regression validation
- All other columns unaffected in width, label, and behavior.
- Row expand (WheelDetailPanel) still works when clicking non-freehub cells.
- ColumnSelector, FilterPanel, and sort features unaffected.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Popup click stops `<tr>` onClick but user expects row to expand | Minor confusion | Stop propagation only on the freehub cell click when the popup is triggered; row expand still fires on all other cells. Document clearly in TASK-005. |
| MeasuringTable max-width pins column at 160 px even for short content | Minor: column slightly wider than natural width for short strings | Acceptable tradeoff; column will still be correctly sized for its content up to 160 px. Document in spec-notes. |
| `scrollWidth > clientWidth` check returns false in jsdom (no layout) | Test failures if snapshot tests run | Not a risk here — no new automated tests are introduced for this evolution. |

---

## 8. Rollback Plan

- Revert `wheelProperties.jsx` to remove the `max-w-[160px]` class from `freehubOptions.column.cellClassName`.
- Delete `FreehubCell.jsx` and `FreehubPopup.jsx`.
- Revert `ComparisonTable.jsx` to render freehub cells as plain `<td>` elements.
- Revert locale JSON files to restore the original "Freehub" / "Corps de roue libre" labels.
- All changes are isolated to these files; no Redux state, no data schema, no API contract is modified.
