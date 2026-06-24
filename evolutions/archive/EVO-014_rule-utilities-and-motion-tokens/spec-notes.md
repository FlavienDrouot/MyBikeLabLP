# Spec Notes — EVO-014

## PRD interpretations

**FR-001 — Navbar `border-b border-ink-3` is out of scope**
The PRD lists Navbar only under FR-002 (motion tokens). The `border-b border-ink-3` on the sticky `<header>` element is a structural chrome divider integral to the Navbar's identity (it anchors the sticky bar visually). The PRD text "at least the following three components" for FR-001 names Footer, RoadmapSection, and ComparisonTable header — not Navbar. Treating the Navbar header border as out of scope for FR-001 is consistent with the explicit enumeration and with the constraint that no component restructuring is permitted.

**FR-001 — Mobile menu drawer `border-t border-ink-3` in Navbar**
Same reasoning: this is a structural divider within the mobile menu, not a semantic page-section separator. Not in scope for FR-001.

**FR-001 — RoadmapSection has no existing separator**
The PRD says "divider(s) replaced with rule class" for RoadmapSection, but inspection of the component reveals no existing horizontal divider element. The interpretation is: introduce a rule-class `<hr>` where one was absent but where a separator is architecturally meaningful (between the section header and the content grid). This satisfies FR-001's intent (the component uses a DS rule class for its divider) without restructuring the component.

**FR-002 — Scope of "existing hover transitions"**
The chevron icon in ComparisonTable uses `transition-transform duration-150` to animate the expand/collapse affordance. This is a rotate-on-click state change, not a hover transition in the FR-002 sense. FR-002 says "applies exclusively to transitions that already exist today" on hover. The chevron is excluded.

The mobile filter drawer in `MiniComparator.jsx` uses `transition-transform duration-200 ease-out` for its slide-in animation. This is a panel reveal animation triggered by state change, not a hover transition. It is excluded.

**FR-003 — "Below or immediately adjacent to the price value"**
The PRD gives flexibility: below or adjacent. "Below" is chosen for both surfaces because the price cells in the ComparisonTable and the price spans in WheelDetailPanel are right-aligned text blocks. A sub-line annotation in a `flex-col items-end` wrapper gives the cleanest reading order and avoids horizontal overflow at narrow viewports.

**FR-003 — Annotation for retailer prices vs. manufacturer price in WheelDetailPanel**
The PRD says "any price value displayed in ... WheelDetailPanel." Both manufacturer and retailer prices are displayed, so both receive the annotation. The annotation must not appear when `price_eur` is null (already guarded in the manufacturer section; applied defensively to retailers too).

**AC-001 — "ComparisonTable header" interpretation**
AC-001 names "ComparisonTable header" as one of the three mandatory rule-class locations. Inspection confirms the header is the `<div className="... border-b border-ink-3">` container above the `<table>`. The `divide-y divide-ink-3` on `<tbody>` is an additional separator concern also addressed in TASK-005.

---

## Architecture decision rationale

**AD-001 — Why inline style props over Tailwind config extensions**
The DS tokens are already available as CSS custom properties at runtime (via `design-tokens.css`). Extending Tailwind's config with `transitionDuration: { quick: 'var(--duration-quick)' }` would work, but it duplicates the value in a second configuration layer and creates a risk of divergence if the DS file is updated. The inline style approach (`style={{ transition: 'color var(--duration-quick) var(--ease-standard)' }}`) references the DS custom properties directly, so any change to the DS propagates automatically. For classes defined in `index.css` (`.btn-*`), the same principle is applied: plain CSS `transition` property with custom property references, removing the `@apply transition-colors` call.

**AD-002 — Why `<hr>` rather than a `<div>` with rule class**
The `.rule*` classes apply `border-top` which works correctly on any block-level element. However, `<hr>` is the semantically correct HTML element for a thematic break/separator. Using `<hr>` also avoids the need to set height or clear any default display. The browser resets applied by `.rule` (`border: 0`) override the `<hr>` default 1px border, making the result fully controlled by the DS class.

**AD-002 — Why per-row `style` for tbody row separators instead of a separator `<tr>`**
`<hr>` elements are not valid inside `<tbody>` in HTML. A separator `<tr><td colSpan={n}><hr /></td></tr>` would be valid but breaks the semantic row structure: it changes the visual row count, affects any striped or nth-child styling, complicates colSpan management (must know the total column count), and adds non-data rows that could confuse screen readers. The `style={{ borderBottom: '1px solid var(--rule-faint)' }}` on each `<tr>` is semantically clean, directly references the DS custom property, and requires no structural change.

**AD-003 — Why `renderCell` in `wheelProperties.jsx` rather than modifying `ComparisonTable.jsx` directly**
The registry pattern is the established architectural convention for this codebase: all column rendering logic lives in `wheelProperties.jsx`. Adding a special-case price annotation directly in `ComparisonTable.jsx` would break this convention (it would require the table to know which column needs an annotation, hard-coding price column identity into generic table rendering logic). The `renderCell` override keeps the annotation co-located with the price column definition, which is the correct place under this architecture.

---

## Tradeoffs

**Tailwind config extension vs. inline style for motion tokens**
Extending the config is more ergonomic for developers (class names instead of style props) but adds a second source of truth. Inline styles are slightly more verbose but self-contained. Given that motion tokens are only used in a handful of locations (three button classes, one Navbar element, one table row), the verbosity cost is low and the single-source benefit outweighs it. Decision: inline style / explicit CSS custom property references.

**`<hr className="rule rule-strong">` vs. `<hr className="rule-strong">` alone**
The `.rule-strong` class only sets `border-top: 1px solid var(--rule-strong)`. It does not reset `border: 0` like `.rule` does. Without the reset, `<hr>` elements retain their browser default 2px inset border, which would produce a double-line artifact in some browsers. Using both classes in order (`rule` first resets, `rule-strong` then sets color) is safer than relying on the UA stylesheet. Alternative: inline style `border: 0; border-top: 1px solid var(--rule-strong)` — rejected in favor of the class combination because it avoids inline style drift from the DS.

**`block` utility on annotation span in ComparisonTable vs. `<div>`**
The `renderCell` return value is placed inside a `<td>`. Using `<div>` inside a `<td>` is valid HTML and would force block layout naturally. Using `<span className="t-annotation block">` is also valid and keeps the annotation inline-level in the source while forcing block rendering via the `block` class. The `<span>` approach is chosen because `renderCell` in other columns also uses `<span>` elements (e.g., the model column uses `<span className="text-ink-500 ...">`) — this maintains consistency.

---

## Open questions

**OQ-001 — `--rule-faint` definition**
The `design-tokens.css` file was read from line 180 onward (where motion tokens begin). The `--rule-faint` custom property is referenced in the `.rule-faint` CSS class but its value definition (in the `:root` block) was not confirmed in the lines read. Before TASK-005 is implemented, verify that `--rule-faint` is defined in `design-tokens.css` `:root`. If it is absent, use `var(--rule-default)` as fallback for the row separator.

**OQ-002 — WheelDetailPanel overflow with annotation**
The WheelDetailPanel content area has `max-h-[140px] overflow-y-auto`. Adding annotation spans below each price will increase the rendered height of each price row in the panel. For wheels with 2+ retailers (e.g., Roval Alpinist CLX II, Bontrager Aeolus RSL 37), the panel content may now exceed `140px` and trigger the scroll. This is not a bug — the `overflow-y-auto` is there for this purpose — but it should be visually confirmed during TASK-007 integration testing to ensure the scrollable area is not disorienting.

**OQ-003 — Annotation font size in small price columns**
The `.t-annotation` class uses `--text-sm` as font size. In ComparisonTable, the cell already uses `text-sm` (13–14px). The annotation at the same size adds a full line of text below the price. If the product owner considers this too visually heavy, the annotation could use `t-label` instead (smaller, all-caps). This would require a PRD change. For now, implementing exactly as specified: `.t-annotation`.
