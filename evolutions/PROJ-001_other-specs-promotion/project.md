# Project: Promotion of `other_specs` fields to the canonical schema

- **ID:** PROJ-001
- **Date:** 2026-06-05
- **Status:** Draft
- **Child ID span:** EVO-047 … EVO-058

---

## Context for an agent without history

MyBikeLab keeps a central registry of wheel properties in
`MyBikeLab/frontend/src/config/wheelProperties.jsx` (source of truth for filters, sorts, columns, accessors).

The dataset holds **222 wheels** (`wheelsData.js` aggregates 18 `wheelsData_<brand>.js` files). Each wheel has a
free-form `other_specs` object where **~128 distinct keys** have accumulated, many expressing the **same idea under
different names** (e.g. `spoke_count` / `spoke_count_front` / `spoke_count_rear` / `spoke_count_disc`).

The canonical schema already has structured sub-objects:
- `w.rim`: `material`, `depth_mm`, `tubeless_ready`, `hookless`, `externalWidth_mm`, `internalWidth_mm`
- `w.hub`: `brand`, `model`, `axle_front_mm`, `axle_rear_mm`, `freehub_options`, `disc_standard`
- `w.spokes`: `brand`, `model`, `material`

`wheelProperties.jsx` exposes **column groups** (`COLUMN_GROUPS`): `general`, `rims`, `subs`. Each entry declares
`group`, `accessor`, `filter`, `sorts`, `column`.

This Project **promotes** recurrent `other_specs` properties into these canonical sub-objects plus a
`wheelProperties.jsx` entry, merging synonym spellings — making the fields filterable/sortable/displayable and freezing
a clean vocabulary instead of the current key soup.

> Origin: this plan absorbs the exploratory note formerly at `thinking/other-specs-promotion-candidates.md`
> (analysis of 2026-06-05), now the single source of truth for the migration.

---

## Goal & shared Definition of Done

**Goal:** promote the recurring `other_specs` fields to the canonical schema, merge synonym spellings, and expose them
through the registry.

**Structural decision:** split the `subs` column group into two distinct groups **`Hub`** and **`Spokes`** (add to
`COLUMN_GROUPS`) — the volume of promoted fields in each justifies it. Done once in the foundation child (EVO-047).

**Definition of done — inherited by every child** (cf. `MyBikeLab/README.md` § Data Schema Conventions):

- [ ] The promoted field exists in the canonical sub-object and has a `wheelProperties.jsx` entry (group, accessor, filter, sorts, column).
- [ ] **Data migration**: all 18 `wheelsData_*.js` files are migrated for this field — **no entry left in the old format**, source keys removed from `other_specs`.
- [ ] **Scraping process updated**: `workflows/datascraping/wheel-format.json`, `scripts/DatascrapingPrompt.md`, and `workflows/datascraping/README.md` reflect the new schema so future scraping produces conformant data.
- [ ] Baseline + regression tests pass (see `workflows/ai-dev-process/TEST-PROTOCOL.md`).

These are not optional follow-ups — they are part of every child's definition of done.

---

## Sequencing

Ordered by **(rising risk, rising parsing complexity)** — not by coverage — so the migration chain and tooling are
validated on safe cases first, leaving the traps for last.

| Wave | Child | Concepts | Coverage | Parse | Risk |
| --- | --- | --- | --- | --- | --- |
| 0 — Foundation | EVO-047 `foundation` | split `subs`→`Hub`+`Spokes` in `COLUMN_GROUPS` + codemod harness + scraping protocol | — | — | low |
| 1 — Pilots | EVO-048 `hub-bearing-material` | `hub.bearing_type` (+`bearing_models`) **+** `hub.material` | 73% / low | trivial | low ★ pilot |
| 1 | EVO-049 `spokes-count` | `spokes.count {front, rear}` | 69% | low | low |
| 2 — Standard | EVO-050 `spokes-detail` | `spokes.nipple` + `spokes.type` + `spokes.profile` + `spokes.lacing` *(fused)* | 18–28% | low–med | low |
| 2 | EVO-051 `rim-material-construction` | `rim.material` enriched + `rim.construction` | 34% | low | med |
| 2 | EVO-052 `rim-max-tire-pressure` | `rim.max_tire_pressure {psi, bar}` | 31% | med | low |
| 2 | EVO-053 `warranty` | `warranty {text, years}` | 30% | med | low |
| 2 | EVO-054 `certification` | `certification {uci, astm, ebike}` | 29% | med | low |
| 3 — Traps | EVO-055 `weight-tolerance` | weight-tolerance fused into existing `weight` | 27% | med | **high** (touches prod field) |
| 3 | EVO-056 `tire-compatibility` | `rim.tire_compatibility` ⟵ absorbs `tubeless_ready` + `multiSelectFlat` filter | 51% | med | **high** (replaces prod filter) |
| 3 | EVO-057 `hub-engagement` | `hub.engagement {type, points}` parsing `hub_internals`/`ratchet*` | 17% | high | high |
| 3 | EVO-058 `tire-width-mm` | `rim.tire_width_mm {min, max}` + ETRTO (16 spellings) | 33% | very high | high |

**Every child defaults to Light EVO.** The last three are only the hardest cases: tackle each as a Light EVO, splitting
into several coherent Light EVOs if one document can't hold it. Fall back to Standard EVO **only** if a unit cannot be
expressed as a coherent Light EVO or set of Light EVOs — complexity, risk, or parsing volume alone never warrant Standard.

---

## Shared conventions

- **Codemod-driven migration.** The data migration (step B of the DoD) goes through a Node script that reads
  `other_specs`, applies one concept's fusion/parse rules, writes the canonical sub-object, and removes the source keys —
  run once over the 18 files per child. This makes "touch each file N times" a single execution and isolates the
  error-prone synonym-fusion logic. EVO-047 establishes the harness; each child adds its concept's rules.
- **`COLUMN_GROUPS` split** (`Hub`, `Spokes`) is done once in EVO-047; later Hub/Spokes children only add entries.
- **Synonym fusion is the risky part** — keep it isolated per concept (never mix concepts in one migration pass).
- **Each child references this `project.md`** for context and the shared DoD; the child doc carries only its delta.

---

## Per-unit briefs

> Format per concept: target — coverage — sources — rules — filter. Lifted from the original candidates analysis.

### Unit: foundation (EVO-047)
- **Target:** split `subs` → `Hub` + `Spokes` in `COLUMN_GROUPS`; set up the codemod harness and the scraping-doc update protocol.
- **Sources:** existing hub/spokes columns already in `subs`.
- **Rules:** pure regrouping + tooling — **no data semantics change** yet.
- **Expected child type:** Light EVO.

### Unit: hub-bearing-material (EVO-048) — pilot
- **Target:** `hub.bearing_type` (text) + `hub.bearing_models` (array of refs); plus `hub.material` (text).
- **Sources:** `bearing_type` (`"Mavic Ceramic"`, `"QRM Auto sealed cartridge C3"`), `bearing_models` (`["61803","61903"]`); `hub_material` (`"forged aluminium T7075"`) — the only relevant `hub_*` key.
- **Rules:** `bearing_type` 73% coverage, near-direct. ⚠️ `hub_build` and `hub_internals` are **not** promoted as fields (redundant with `hub.model` / consumed only by engagement).
- **Filter:** multiSelect. **Expected child type:** Light EVO (validates the full chain end-to-end).

### Unit: spokes-count (EVO-049)
- **Target:** `spokes.count {front, rear}` — 69%.
- **Sources:** `spoke_count` (`20`), `spoke_count_front`/`spoke_count_rear` (`20`/`24`/…), `spoke_count_disc` (`"21 front and rear"`).
- **Rules:** if a single global value, duplicate front=rear; parse the `_disc` text.
- **Filter:** range. **Expected child type:** Light EVO.

### Unit: spokes-detail (EVO-050) — fused
- **Target:** `spokes.nipple` (text) + `spokes.type` + `spokes.profile` + `spokes.lacing {front, rear}`.
- **Sources:**
  - nipple (18%): `nipples`, `spoke_nipple`, `spoke_nipples` — 3 spellings of one concept.
  - type/profile (18%): `spoke_type` (`"straight-pull"`, `"j-bend"`), `spoke_profile` (`"straight flat tapered"`) — two distinct fields, **not** merged with existing `spokes.material`.
  - lacing (28%): `spoke_lacing` (`"radial"`, `"2x"`, `"2-cross"`), `spoke_lacing_front`/`_rear`, `front_wheel_spoke_lacing`, `rear_wheel_spoke_lacing`, `lacing`, `rear_lacing`.
- **Rules:** normalize lacing vocabulary (`"2x"` = `"2-cross"`); front/rear may differ.
- **Filter:** multiSelect. **Expected child type:** Light EVO.

### Unit: rim-material-construction (EVO-051)
- **Target:** enrich existing `rim.material` + new free `rim.construction` — 34%.
- **Sources:** `rim_material_name` (`"Maxtal"`), `rim_material_detail` (`"HI-MOD T800 Carbon Fiber"`), `rim_construction`, `rim_technology` (`"Fore Carbon"`).
- **Rules:** enrich `rim.material`; `rim.construction` holds technical detail (layup, process).
- **Filter:** multiSelect (material). **Expected child type:** Light EVO.

### Unit: rim-max-tire-pressure (EVO-052)
- **Target:** `rim.max_tire_pressure {psi, bar}` — 31%.
- **Sources:** `max_tire_pressure_psi` (`73`), `max_tire_pressure_bar` (`5.5`) + tubeless/tubed/28c variants + free text `maximum_tire_pressure`.
- **Rules:** keep one `psi` and one `bar` (convert if only one present: 1 bar ≈ 14.5 psi); conditional cases (per tire width) stay as a free note.
- **Filter:** range. **Expected child type:** Light EVO.

### Unit: warranty (EVO-053)
- **Target:** `warranty {text, years}` — 30%.
- **Sources:** `warranty` (text: `"lifetime (with registration)"`, `"2 years"`) + `warranty_years` (num: `3`, `5`).
- **Rules:** keep original text in `text`; normalize duration into `years`; `"lifetime"` → agreed sentinel (`null`+flag or a large agreed number).
- **Filter:** range on `years`. **Expected child type:** Light EVO.

### Unit: certification (EVO-054)
- **Target:** `certification {uci, astm, ebike}` — 29%.
- **Sources:** `uci_approved` (`true`), `astm_category` (`1`,`2`), `e_bike_approved` (`false`) + free text `certification` (`"UCI approved"`) to parse.
- **Rules:** `uci` bool, `astm` int (ASTM F2043 category), `ebike` bool.
- **Filter:** multiSelect (astm) / triState (uci, ebike). **Expected child type:** Light EVO.

### Unit: weight-tolerance (EVO-055)
- **Target:** standardized weight-tolerance indicator **fused into the existing `weight`** (not a standalone field) — 27%.
- **Sources:** `weight_tolerance` (text `"+/- 5%"`), `weight_tolerance_percent` (num `5`,`3`), `weight_tolerance_grams`, `rim_weight_tolerance_percent`.
- **Rules:** normalize everything to a **numeric percentage**; convert gram values via the reference weight; store next to `weight_grams` (e.g. `weight_tolerance_percent`).
- **Filter:** — . **Expected child type:** Light EVO (risky — touches the prod `weight` field).

### Unit: tire-compatibility (EVO-056)
- **Target:** `rim.tire_compatibility` (set of types) ⟵ **absorbs** `rim.tubeless_ready` — 51%.
- **Sources:** `tire_type` (`"clincher"`/`"tubeless"`/`"tubular"`), `tire_compatibility` (free text), `compatible_tire_type`.
- **Rules:** field = **set** of types, e.g. `["clincher","tubeless"]`. `tubeless_ready` becomes **derived** (`true` if the set contains `"tubeless"`). The old tri-state `tubeless_ready` filter is removed; the column is now `tire_compatibility`.
- **Filter:** **`multiSelectFlat`** (like `freehubOptions`: a wheel matches if its set contains at least one selected type).
- **Expected child type:** Light EVO; fall back to Standard EVO only if it can't be expressed as a coherent Light EVO (or split into several).

### Unit: hub-engagement (EVO-057)
- **Target:** `hub.engagement {type, points}` — 17%.
- **Sources to merge AND parse:** `points_of_engagement` (`66`,`36`); `ratchet_teeth` (`36`), `ratchet` (`"36T, compatible with DT…"`); **`hub_internals`** (`"DT Swiss Ratchet EXP 36T"`) → parse to `{type:"star-ratchet", points:36}`.
- **Rules:** extract `type` (closed vocab below) + points/teeth; for a ratchet, points of engagement = teeth count (36T → 36).
  - Closed `type` vocabulary: `star-ratchet` (DT Swiss Ratchet / Ratchet EXP), `ratchet` (generic/clone), `pawl` (classic pawls, often j-bend), `other` (fallback).
- **Filter:** multiSelect (type) + range (points). **Expected child type:** Light EVO; fall back to Standard EVO only if it can't be expressed as a coherent Light EVO (or split into several).

### Unit: tire-width-mm (EVO-058)
- **Target:** `rim.tire_width_mm {min, max}` — 33%.
- **Sources (very fragmented, 16 spellings):** `min_tire_width_mm`/`max_tire_width_mm`, `tire_width_range_mm` (`"24-38"`), `etrto` (`"622x23TC"`), `*_optimized_*`, `recommended_tire_size*`, etc.
- **Rules:** parse text ranges and ETRTO into numeric `{min, max}` in mm.
- **Filter:** range. **Expected child type:** Light EVO; the strongest fallback candidate — if the 16 spellings + ETRTO can't fit a coherent Light EVO (or a split into several), use Standard EVO.

---

## Stays in `other_specs` (not promoted at this stage)

`bearing_upgrade_option` (`"CeramicSpeed"` — isolated variant), `hub_build`, `hub_internals` (consumed only as a parse
source for engagement, not a field), `freehub_technology`, `rear_speeds`, `weight_note`, plus the whole long tail ≤ 3%
(~110 keys, ~25 single-occurrence: `valve_length_mm`, `rim_impact_test_joules`, etc.).

---

## Child index

Kept in sync as children are created. Each child is also registered in the Evolutions/Fixes master tables of
`evolutions/README.md` with the Project noted.

| ID | Slug | Type | Status |
| --- | --- | --- | --- |
| EVO-047 | foundation | Light | Done |
| EVO-048 | hub-bearing-material | Light | Done |
| EVO-049 | spokes-count | Light | Done |
| EVO-050 | spokes-detail | Light | Done |
| EVO-051 | rim-material-construction | Light | Done |
| EVO-052 | rim-max-tire-pressure | Light | Done |
| EVO-053 | warranty | Light | Done |
| EVO-054 | certification | Light | Done |
| EVO-055 | weight-tolerance | Light | Done |
| EVO-056 | tire-compatibility | Light (Standard fallback) | Done |
| EVO-057 | hub-engagement | Light (Standard fallback) | Done |
| EVO-058 | tire-width-mm | Light (Standard fallback) | Draft |
