# Fix: Rename rimWidth → externalWidth

- **ID:** fix-002
- **Date:** 2026-06-02
- **Status:** Done

---

## Context & Need

The property currently identified as `rimWidth` is ambiguous — it does not distinguish internal from external measurement. The underlying data already uses `externalWidth_mm`, making the config key inconsistent. Renaming the property ID and all i18n keys to `externalWidth` aligns the full stack and the UI label ("External width" / "Largeur externe") with the actual data semantics.

---

## Acceptance Criteria

- [ ] The column header and filter label display "External width" (EN) and "Largeur externe" (FR)
- [ ] Sort options display "External width (narrow → wide)" / "External width (wide → narrow)" in EN
- [ ] Sort options display "Largeur externe (étroite → large)" / "Largeur externe (large → étroite)" in FR
- [ ] No occurrence of `rimWidth` remains anywhere in the frontend source or locales
- [ ] The accessor `(w) => w.rim.externalWidth_mm` is unchanged (data key is already correct)

---

## Technical Tasks

### Task 1 — Rename property ID and i18n key references in wheelProperties.jsx

**File:** `frontend/src/config/wheelProperties.jsx`
**What to do:**
- Line 356: `id: 'rimWidth'` → `id: 'externalWidth'`
- Line 357: `label: 'properties.rimWidth.label'` → `label: 'properties.externalWidth.label'`
- Line 364: `{ id: 'rimWidth_asc', label: 'sorts.rimWidth_asc', ... }` → `{ id: 'externalWidth_asc', label: 'sorts.externalWidth_asc', ... }`
- Line 365: `{ id: 'rimWidth_desc', label: 'sorts.rimWidth_desc', ... }` → `{ id: 'externalWidth_desc', label: 'sorts.externalWidth_desc', ... }`

**Validation:** `rimWidth` has zero occurrences in the file.

---

### Task 2 — Update English i18n keys and labels

**File:** `frontend/public/locales/en.json`
**What to do:**
- In `properties`: rename key `rimWidth` → `externalWidth`; set `"label": "External width"`
- In `sorts`: rename key `rimWidth_asc` → `externalWidth_asc`; set value `"External width (narrow → wide)"`
- In `sorts`: rename key `rimWidth_desc` → `externalWidth_desc`; set value `"External width (wide → narrow)"`

**Validation:** `rimWidth` has zero occurrences in the file.

---

### Task 3 — Update French i18n keys and labels

**File:** `frontend/public/locales/fr.json`
**What to do:**
- In `properties`: rename key `rimWidth` → `externalWidth`; set `"label": "Largeur externe"`
- In `sorts`: rename key `rimWidth_asc` → `externalWidth_asc`; set value `"Largeur externe (étroite → large)"`
- In `sorts`: rename key `rimWidth_desc` → `externalWidth_desc`; set value `"Largeur externe (large → étroite)"`

**Validation:** `rimWidth` has zero occurrences in the file.

---

### Task 4 — Update pseudo-locale i18n keys

**File:** `frontend/public/locales/xx.json`
**What to do:**
- In `properties`: rename key `rimWidth` → `externalWidth` (value stays `{ "label": "XX" }`)
- In `sorts`: rename key `rimWidth_asc` → `externalWidth_asc` (value stays `"XX"`)
- In `sorts`: rename key `rimWidth_desc` → `externalWidth_desc` (value stays `"XX"`)

**Validation:** `rimWidth` has zero occurrences in the file.

---

### Task 5 — Update test

**File:** `frontend/src/config/__tests__/wheelProperties.i18n.test.js`
**What to do:**
- Line 58–59: replace `rimWidth` → `externalWidth` in the test description string and in the `ids` array

**Validation:** `rimWidth` has zero occurrences in the file.

---

### Task 6 — Update product-overview.md

**File:** `product-overview.md`
**What to do:**
- Line 68: `| Rim width | Range (20–40 mm) |` → `| External width | Range (20–40 mm) |`
- Line 77: `Rim width` → `External width` in the optional columns list

**Validation:** `Rim width` has zero occurrences in the file.

---

## Implementation Notes

<!-- Filled in during implementation, one block per task. -->

### Task 1
- ...

### Task 2
- ...

### Task 3
- ...

### Task 4
- ...

### Task 5
- ...

### Task 6
- ...
