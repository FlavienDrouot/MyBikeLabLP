# Light EVO: Variant field per row

- **ID:** EVO-045
- **Date:** 2026-06-04
- **Status:** Done
- **Priority:** High

---

## Context & Need

EVO-044 introduced product variants as flat catalog rows linked by a `model_group` /
`model_group_label` family grouping, with the distinguishing trait embedded in the
`model` string in parentheses (e.g. `deCADENce 35mm Tubeless (carbon spokes)`). After
reviewing the two candidate implementations, the chosen direction drops the family
grouping concept entirely in favor of a simpler, flatter model: **one row per variant,
each carrying an explicit, translatable `variant` field** that names what distinguishes
it. The `model` column then reads `brand` + `model` (identical across siblings) +
`variant`. This is clearer for users (no collapsed groups, no parenthetical noise) and
gives the differentiator a structured, localizable home.

**Base branch:** `Dev-GPT` (the chosen EVO-044 implementation) is the starting point —
its per-row family label and `wheelValidator` extensions are the closest fit and are
adapted here.

---

## Scope

### Included

- Introduce a new optional top-level `variant` field on catalog entries.
- Migrate Caden data: move the clean family name (currently in `model_group_label`) into
  `model`; move the parenthetical differentiator into `variant`; remove `model_group` and
  `model_group_label`.
- Make `variant` translatable (fr/en) following the established categorical-value i18n
  pattern (value = key resolved by a `variant.*` namespace).
- `model` column: render `brand` + `model` + `variant` (variant in place of the former
  family label).
- `WheelDetailPanel`: show `variant` in place of the former model-family block.
- Update `wheelValidator`: remove `model_group` rules; add `variant` rules.
- Update datascraping documentation (`wheel-format.json`, `README.md` Step 4) to reflect
  the `variant` model and **instruct active discovery of offered variants**.
- Update affected tests.

### Excluded

- Any visual grouping / collapse / representative behavior (abandoned).
- Changes to the three comparable axes themselves (spoke material, rim width, brake type
  stay as structured fields and filters).
- Inferring undocumented variant combinations.
- Changing the "one row = front + rear pair" definition or EVO-038 divergent specs.
- Freehub option behavior.

---

## Acceptance Criteria

- [ ] A new optional `variant` field exists on catalog entries; entries without a variant
      omit it.
- [ ] Sibling variants share identical `brand` and `model`; they differ by `variant`.
- [ ] The `model` column displays `brand` + `model` + `variant` (variant shown only when
      present).
- [ ] `WheelDetailPanel` displays the `variant` when present, in place of the family block.
- [ ] `variant` renders in the active language (fr/en); values needing translation
      (e.g. `carbon_spokes` → "Carbon spokes" / "Rayons carbone") resolve correctly.
- [ ] `model_group` and `model_group_label` no longer exist anywhere (data, validator, UI,
      schema, docs).
- [ ] Caden entries are migrated: `model` holds the clean family name, the differentiator
      is in `variant`, no differentiator left in parentheses inside `model`.
- [ ] Standalone wheels (no documented variant) keep a clean `model` and no `variant`.
- [ ] `wheelValidator` flags variant inconsistencies (see Functional Decisions) and no
      longer references `model_group`.
- [ ] Datascraping docs describe the `variant` field and instruct active variant discovery.
- [ ] Vitest suite is green (baseline + regression).

---

## Functional Decisions

- **One row per variant, no grouping.** The collapse/representative concept from
  Dev-Opus is not adopted. Each buyable configuration is an independent, flat row.
- **`model` becomes the clean family name.** The value currently stored in
  `model_group_label` becomes `model`; the parenthetical suffix is removed from `model`.
- **`variant` is a translatable key (slug).** Stored as a canonical snake_case key
  (e.g. `carbon_spokes`, `steel_spokes`, `disc_brake`, `rim_brake`,
  `internal_25mm`/`external_37mm` for width siblings). Display is resolved by the i18n
  layer under a `variant.*` namespace — matching how `spokeMaterial` / `brakeType` values
  are already translated. Values that read the same in both languages (e.g. a width) still
  carry a key and a value in both locale files; nothing free-text is stored in data.
- **Variant content names the differentiator, not the full spec.** Short, human-readable
  (e.g. "Carbon spokes", "37 mm external"), not a structured axis object.
- **Standalone entries carry no `variant`.** A model sold in a single configuration omits
  the field; the UI shows nothing extra.
- **Validator rules for variants:** within a set of entries sharing the same `brand` +
  `model`, (a) every entry must have a non-empty `variant`, (b) variants must be unique,
  (c) a lone `brand`+`model` entry must NOT carry a `variant`. The forbidden-`other_specs`
  rules from EVO-044 are kept; the `model_group`/`model_group_label` rules are removed.
- **Datascraping is instructed to actively search for variants:** the prompt/README must
  direct the scraper to look explicitly on each product page for selectable options
  (spoke material, rim width, brake type) and emit one object per offered configuration,
  populating `variant` — rather than passively recording only the default configuration.

---

## Technical Tasks

### Task 1: Catalog schema + datascraping docs

**Files:** `workflows/datascraping/wheel-format.json`, `workflows/datascraping/README.md`,
`MyBikeLab/scripts/DatascrapingPrompt.md`

**What to do:**
- In `wheel-format.json`: remove `model_group` and `model_group_label`; add
  `variant: "string | null — canonical snake_case key naming what distinguishes this
  buyable configuration from its siblings (same brand+model); resolved to a localized
  label by the frontend variant.* i18n namespace; null/absent = standalone model"`.
- In `README.md` Step 4: rewrite "Explode Comparable Variants" to describe the
  `variant`-per-row model (drop the model-group slug/label rules; siblings now share
  `brand`+`model` and differ by `variant`). Keep the three-axis, no-other_specs,
  no-fabrication, ID-200+ rules.
- Add an explicit instruction (Step 1 prompt and Step 4) to **actively discover offered
  variants**: inspect each product page for option selectors (spoke material, rim width,
  brake type) and produce one object per documented configuration with its `variant` key.

**Validation:** schema and README contain no `model_group*` references; `variant` field
documented; active-discovery instruction present in both the prompt and Step 4.

---

### Task 2: Migrate Caden catalog data

**Files:** `frontend/src/data/wheelsData_caden.js`

**What to do:** For every entry currently carrying `model_group`/`model_group_label`:
- Set `model` to the clean family name (the current `model_group_label` value).
- Add `variant` with the canonical key matching the removed parenthetical
  (`(steel spokes)`→`steel_spokes`, `(carbon spokes)`→`carbon_spokes`,
  `(34 mm external)`→`external_34mm`, `(37 mm external)`→`external_37mm`,
  `(40 mm external)`→`external_40mm`, `(disc brake)`→`disc_brake`,
  `(rim brake)`→`rim_brake`).
- Remove `model_group` and `model_group_label` from all entries.
- Leave standalone entries (ids 133–136) with their clean `model` and no `variant`
  (strip any parenthetical that was only a differentiator; keep genuine model-name text).
- Update the file's factory/helper that destructured `model_group`/`model_group_label`
  (header lines ~25, ~59) to handle `variant` instead.

**Validation:** all sibling sets share identical `brand`+`model`; each variant has a
unique `variant` key; no `model_group*` remains; ids unchanged (129–137 source, 200+
exploded).

---

### Task 3: i18n — variant namespace

**Files:** `frontend/public/locales/en.json`, `frontend/public/locales/fr.json`,
`frontend/public/locales/xx.json`

**What to do:**
- Remove the `table.modelFamily` and `wheelDetail.modelFamily` keys.
- Add a `variant.*` map for every variant key used in data, plus a
  `properties.variant.label` (and a short `table.variant` / `wheelDetail.variant` heading
  if needed by the cell/panel). Example en: `"variant": { "carbon_spokes": "Carbon
  spokes", "steel_spokes": "Steel spokes", "disc_brake": "Disc brake", "rim_brake": "Rim
  brake", "external_34mm": "34 mm external", ... }`; fr equivalents
  (`"Rayons carbone"`, `"Rayons acier"`, `"Frein à disque"`, `"Frein sur jante"`, …).

**Validation:** every `variant` key in data has an en + fr (+ xx) entry; no `modelFamily`
keys remain; i18n test (if present) passes.

---

### Task 4: Frontend rendering (model column + detail panel)

**Files:** `frontend/src/config/wheelProperties.jsx`,
`frontend/src/components/MiniComparator/WheelDetailPanel.jsx`

**What to do:**
- `wheelProperties.jsx` model `renderCell`: replace the `model_group`/`model_group_label`
  family block with a `variant` line. Render `brand`, then `model`, then — when
  `w.variant` is set — `t('variant.' + w.variant)` as the secondary differentiator line
  (keep the existing compact secondary-text styling / left border).
- `WheelDetailPanel.jsx`: replace the model-family block with a `variant` block shown only
  when `w.variant` is present, resolving `t('variant.' + w.variant)`.

**Validation:** model column shows brand + model + localized variant; standalone wheels
show no variant line; detail panel mirrors the same.

---

### Task 5: Validator

**Files:** `frontend/src/data/wheelValidator.js`

**What to do:**
- Remove `model_group` / `model_group_label` validation (per-entry label rule and the
  cross-entry `collectGroupWarnings` brand/label checks).
- Add cross-entry `variant` validation keyed by `brand`+`model`: a set with >1 entry must
  have every member carry a non-empty `variant`, and variants must be unique within the
  set; a single-entry `brand`+`model` must NOT carry a `variant`.
- Keep the forbidden-`other_specs` key/pattern rules from EVO-044 unchanged.

**Validation:** validator unit tests cover the new variant rules and contain no
`model_group` references.

---

### Task 6: Tests

**Files:** `frontend/src/data/__tests__/wheelValidator.test.js`,
`frontend/src/data/__tests__/catalog.integration.test.js`,
`frontend/src/store/selectors/__tests__/wheelsSelectors.test.js`,
`frontend/src/config/__tests__/wheelProperties.*.test.*`,
`frontend/src/components/MiniComparator/__tests__/*.test.jsx`

**What to do:** update assertions that referenced `model_group`/`model_group_label` to the
`variant` model; add tests for: variant rendering in the model column (localized),
standalone-without-variant, validator variant rules, and Caden integration (siblings share
brand+model, unique variant keys, no `model_group*`).

**Validation:** full Vitest suite green.

---

## Test Summary

### Baseline Vitest

- Command: `npm run test:summary` (frontend)
- Result: 17 files passed / 0 failed — 226 tests passed / 0 failed — exit 0
- Failed tests: none
- Notes: Run on branch `EVO-045_variant-field-per-row` (off `Dev-GPT`), 2026-06-04, 4.39s.

### Regression Vitest

- Command: `npm run test:summary` (frontend)
- Result: 17 files passed / 0 failed — 227 tests passed / 0 failed — exit 0
- Failed tests: none
- Notes: +1 test vs baseline (added single-configuration variant rule). No regressions.

---

## Implementation Notes

Implemented on branch `EVO-045_variant-field-per-row` (off `Dev-GPT`).

### Task 1 — Schema + datascraping docs

- `wheel-format.json`: removed `model_group`/`model_group_label`; added `variant`; clarified that `model` is the clean family name identical across siblings.
- `README.md` Step 4 rewritten ("Explode Buyable Variants") around the `variant`-per-row model + an **active variant discovery** instruction.
- `scripts/DatascrapingPrompt.md`: matching rewrite of the variant section + active-hunt instruction.

### Task 2 — Caden migration

- `wheelsData_caden.js`: factory now takes `variant` instead of `model_group`/`model_group_label`. Each grouped entry's `model` set to the clean family name; differentiator moved to a `variant` key (`steel_spokes`, `carbon_spokes`, `external_34mm/37mm/40mm`, `disc_brake`, `rim_brake`). Standalone entries (133–136) keep their `model` and carry no `variant`. IDs unchanged.

### Task 3 — i18n

- Removed `table.modelFamily` and `wheelDetail.modelFamily`; added `wheelDetail.variant`, `properties.variant.label`, and a top-level `variant.*` map in `en.json` and `fr.json` (incl. hub-tier keys from the Zipp decision). `xx.json` is a partial pseudo-locale and needs no value keys.

### Task 4 — Frontend rendering

- `wheelProperties.jsx` model `renderCell`: shows brand + model + `t('variant.' + w.variant)` when present.
- `WheelDetailPanel.jsx`: variant block replaces the model-family block.

### Task 5 — Validator

- `wheelValidator.js`: removed all `model_group` rules; added `collectVariantWarnings` keyed by `brand|model` — siblings (>1) require a non-empty, unique `variant`; a single-config `brand+model` must not carry one. Forbidden-`other_specs` rules kept.

### Task 6 — Tests

- Updated validator, catalog-integration, selector, ComparisonTable and WheelDetailPanel tests from the `model_group` model to the `variant` model; added single-config + duplicate-variant validator cases and a "no model_group metadata remains" Caden assertion.

### Decision: Zipp hub-tier variants

- Pre-existing Zipp pairs (353/454/858 NSW, ids 36/37, 39/40, 42/43) share `brand`+`model` but differ by hub, weight and price. Per user decision, given `variant` keys `cognition_v2_hub` / `zr1_sl_hub` (+ i18n) — they are genuine distinct buyable configurations. Recorded in `domain-vocabulary.md` (variant axes may include non-axis differences like hub tier).
