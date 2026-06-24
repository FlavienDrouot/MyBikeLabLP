# Needs Assessment

## 1. General Information

- Evolution ID: EVO-037
- Title: Freehub Options Standardization
- Author: Flavien Drouot
- Date: 2026-06-02
- Status: Validated
- Priority: Medium

---

## 2. Context

### Current situation

The `freehub_options` field in the wheel dataset is an array of strings listing the compatible freehub body standards for each wheel. It powers the `multiSelectFlat` filter in the comparator, allowing users to filter wheels by drivetrain compatibility.

Each brand's data file was scraped and transformed independently. As a result, the same physical standard appears under different labels across files:

| Standard | Values observed in data |
|---|---|
| Shimano HG | `'Shimano HG'`, `'HG'`, `'Shimano HG 11-speed'`, `'Shimano HG 11/12-speed'`, `'Shimano HG Light'` |
| Shimano Micro Spline | `'Shimano MS'`, `'Microspline'` |
| SRAM XDR | `'SRAM XDR'`, `'XDR'`, `'SRAM XD-R'` |
| Campagnolo N3W | `'Campagnolo N3W'`, `'N3W'` |
| Campagnolo ED | `'Campagnolo ED'`, `'Campagnolo'` |
| SRAM XD | `'SRAM XD'` — consistent, no issue |

One value (`'SRAM/Shimano Road'` in Zipp data) bundles two distinct standards into a single string, which is incompatible with the `multiSelectFlat` filter model.

### Identified problem

The `multiSelectFlat` filter treats each string as a distinct value. A user filtering by `'Shimano HG'` will not see wheels labeled `'HG'` or `'Shimano HG 11-speed'`, even though those wheels are fully compatible. The filter silently misses matching wheels, delivering incorrect and incomplete results.

### Business motivation

Freehub compatibility is a key purchasing criterion. A cyclist with a Shimano 11-speed drivetrain must know which wheels are compatible. Silent filter failures on this property undermine the platform's core value proposition: reliable, structured data for better purchasing decisions.

---

## 3. Business Objective

Ensure that filtering by any freehub standard returns all compatible wheels in the catalog, regardless of which brand's data file they originate from.

---

## 4. Scope

### Included

- Normalize all `freehub_options` string values in the 4 existing brand files: Mavic, Roval, Zipp, ENVE
- Split the composite `'SRAM/Shimano Road'` value (Zipp) into two separate array entries
- Document the normalization rule in the datascraping workflow for all future brands

### Excluded

- Changes to the filter UI or `wheelProperties.jsx`
- Adding new freehub standards not currently present in the catalog
- Retroactive correction of the raw JSON scraping output (`scripts/data/`)
- Brands not yet scraped (DT Swiss, Fulcrum, Shimano, Campagnolo)

---

## 5. Constraints

### Business constraints

- The 6 canonical values are fixed by this evolution. Adding a new standard (e.g., Shimano HG-L for 12-speed road) requires a new evolution.

### Known technical constraints

- The `multiSelectFlat` filter relies on exact string matching — normalization in the data files is sufficient; no code change is needed.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

### Nominal case

As a cyclist with a Shimano 11-speed groupset,  
I want to filter wheels by "Shimano HG",  
So that I see all compatible wheels in the catalog, regardless of how each brand labeled the standard during scraping.

### Alternative cases

- A user filtering by "Campagnolo ED" sees all Campagnolo-compatible wheels, including those previously labeled `'Campagnolo'` (generic).
- A user filtering by "SRAM XDR" sees Zipp wheels previously labeled `'SRAM/Shimano Road'`.

### Known error cases

- None anticipated — this is a pure data correction with no logic change.

---

## 7. Acceptance Criteria

- [ ] All `freehub_options` values in `wheelsData_mavic.js`, `wheelsData_roval.js`, `wheelsData_zipp.js`, and `wheelsData_enve.js` use only the 6 canonical values: `'Shimano HG'`, `'Shimano Micro Spline'`, `'SRAM XD'`, `'SRAM XDR'`, `'Campagnolo ED'`, `'Campagnolo N3W'`.
- [ ] No pre-normalization alias remains in any data file: `'HG'`, `'Shimano HG 11-speed'`, `'Shimano HG 11/12-speed'`, `'Shimano HG Light'`, `'Shimano MS'`, `'Microspline'`, `'XDR'`, `'SRAM XD-R'`, `'N3W'`, `'Campagnolo'`.
- [ ] `'SRAM/Shimano Road'` is replaced by `['SRAM XDR', 'Shimano HG']` in all Zipp wheels where it appeared.
- [ ] The canonical values and their aliases are documented in the datascraping workflow as a transformation rule applied to all future brands.
- [ ] Filtering by `'Shimano HG'` in the comparator returns all wheels previously matched by any alias of that standard.

---

## 8. Open Questions

- None — canonical values and alias mapping are fully resolved.

---

## 9. Assumptions

- `'Shimano HG Light'` is a weight-optimized variant of the standard HG freehub body (aluminum construction). Its cassette compatibility is identical to standard HG. It is merged into `'Shimano HG'` for filter purposes.
- `'Campagnolo ED'` is the official Campagnolo freehub standard for 9–12-speed (ref. FH-BUU015). The generic `'Campagnolo'` label is treated as an imprecise reference to the same standard.
- `'SRAM/Shimano Road'` is a commercial presentation (the wheel is sold in both configurations) — it is not a distinct standard and must be modeled as two separate values in the array.
