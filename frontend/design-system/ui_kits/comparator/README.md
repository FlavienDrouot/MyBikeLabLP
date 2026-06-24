# Comparator UI Kit

Faithful recreation of the **MyBikeLab wheel comparator** — the main interactive feature of the product. Redesigned as a precision spec-sheet rather than a SaaS table.

## What's here

- **Sticky filter panel** (left): brand multi-select, weight & price ranges (dual-thumb sliders), rim material, hookless tri-state, depth range, hub brand
- **Spec table** (right): tabular figures, hairline rows, hover-tint, brass focus on the active sort column
- **Sort & column controls**: dropdown sort, popover column picker
- **Active filter row**: shows applied filter chips up top, click-to-remove
- **15 wheels** from the imported dataset

## Files

- `index.html` — entry; loads tokens + components
- `App.jsx` — top-level state (filters, sort, visibility) — drives the whole surface
- `FilterPanel.jsx`, `WheelTable.jsx`, `ColumnPicker.jsx`, `RangeSlider.jsx`, `FilterChips.jsx`
- `wheelsData.js` — the 15-wheel dataset (copied from the codebase)
- `comparator.css` — surface-specific layout

## Interactive behavior

- Filters apply immediately (no apply button)
- Sort dropdown changes table order
- Column picker hides/shows optional columns
- Reset all filters button
- Each row click → toast "Would open wheel detail" (links to wheel-detail kit)
