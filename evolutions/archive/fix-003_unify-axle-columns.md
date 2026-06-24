# Fix: Unify Front Axle and Rear Axle columns

- **ID:** fix-003
- **Date:** 2026-06-02
- **Status:** Done

---

## Context & Need

The comparator currently exposes two separate optional columns — "Front axle" and "Rear axle" — both sourced from `w.hub.axle_front_mm` and `w.hub.axle_rear_mm`. Road bike wheels almost universally share the same axle standard (12×100 front, 12×142 rear), so splitting them into two columns adds visual clutter without meaningful information gain. Merging them into a single "Axle (F / R)" column reduces column count and presents the information more compactly.

---

## Acceptance Criteria

- [ ] A single column "Axle (F / R)" replaces the two existing "Front axle" / "Rear axle" columns
- [ ] The column displays values in the format `12x100 / 12x142` (front value then rear value, separated by ` / `)
- [ ] If the front value is missing, it is shown as `—`; same for rear
- [ ] The column remains hidden by default (`defaultVisible: false`)
- [ ] The two existing multiSelect filters for `axleFront` and `axleRear` are removed (combined value is not meaningful to filter on)
- [ ] All three locale files (en, fr, xx) reflect the new single key

---

## Technical Tasks

### Task 1 — Merge property definitions in wheelProperties.jsx

**Files:** `frontend/src/config/wheelProperties.jsx`

**What to do:**

Replace the two property objects `axleFront` (lines ~208–220) and `axleRear` (lines ~222–234) with a single property:

```jsx
{
  id: 'axle',
  label: 'properties.axle.label',
  group: 'subs',
  translatable: false,
  accessor: (w) => {
    const f = w.hub?.axle_front_mm ?? '—';
    const r = w.hub?.axle_rear_mm ?? '—';
    return `${f} / ${r}`;
  },
  column: {
    defaultVisible: false,
    headClassName: 'px-4 py-3 font-semibold',
    cellClassName: 'px-4 py-3 text-ink-11',
  },
},
```

No `filter` property — the combined display value (`12x100 / 12x142`) is not meaningful to filter on.

**Validation:** The comparator shows one "Axle (F / R)" column instead of two; column toggle panel lists one entry; values render as `front / rear` (e.g. `12x100 / 12x142`); a wheel with a missing axle value shows `— / 12x142` or `12x100 / —`.

---

### Task 2 — Update locale files

**Files:** `frontend/public/locales/en.json`, `frontend/public/locales/fr.json`, `frontend/public/locales/xx.json`

**What to do:**

In the `properties` section of each file, replace:

```json
"axleFront": { "label": "..." },
"axleRear": { "label": "..." },
```

with:

```json
"axle": { "label": "Axle (F / R)" },      // en.json
"axle": { "label": "Axe (AV / AR)" },     // fr.json
"axle": { "label": "XX" },                // xx.json
```

**Validation:** Column header renders "Axle (F / R)" in English and "Axe (AV / AR)" in French.

---

## Implementation Notes

### Task 1
- Replaced `axleFront` + `axleRear` entries in `wheelProperties.jsx` with a single `axle` property. Accessor formats both values as `${f} / ${r}` with `??` fallback to `—`. Filter removed.

### Task 2
- en.json: `"axle": { "label": "Axle (F / R)" }`
- fr.json: `"axle": { "label": "Axe (AV / AR)" }`
- xx.json: `"axle": { "label": "XX" }`
