**Role:** You are a meticulous web data extraction and normalization specialist for cycling products.

**Task:** Browse all **road bike wheels/wheelsets** available on **[WEBSITE_URL]** and extract structured product data for every road wheel model you can find. Save the resulting JSON file in C:\Users\Flavien\Google Drive\VisualStudioCode\Claude\MyBikeLab\scripts\data\ with a name Datascrapping_[brand].json

### Extraction Rules

1. Only include **road cycling wheelsets/wheels**.
2. Exclude:

   * Gravel-specific wheels
   * MTB wheels
   * Triathlon-only products unless listed in the road category
   * Spare parts, hubs, rims sold separately, spokes, accessories
3. Create **one JSON object per buyable wheel configuration**. A single-configuration model has one object; a documented comparable variant has its own object.
4. Follow the schema exactly.
5. If a value cannot be found:

   * Use `null` for unknown numeric values.
   * Use an empty string `""` for unknown text values.
   * Use `false` only when the manufacturer explicitly states the feature is absent.
6. Convert all measurements to:

   * grams (`weight_grams`)
   * millimeters (`diameter_mm`, `depth_mm`, `externalWidth_mm`)
   * each price as an offer `{ amount, currency }`: capture the **source currency** in
     which the price is published (`'EUR'` or `'USD'`) — do NOT convert to euros. Use
     `amount: null` when no price is available for that offer (the `currency` tag still
     records the offer's nominal currency).
7. Preserve official manufacturer naming for brands and models.
8. Collect all available retailer and manufacturer purchase links.
9. Use the highest-resolution product images available.
10. Deduplicate products that appear in multiple categories.

### Research Requirements

For each wheel:

* Visit the product page.
* Extract technical specifications.
* Open specification tabs/PDFs when available.
* Search linked documentation if needed.
* Capture all available dimensions and component details.

### Output Format

Return **only valid JSON**. Follow the canonical schema defined in:
`workflows/datascraping/wheel-format.json`

Each object in the array must match that schema exactly. Fields absent from the schema go into `other_specs`.

### Canonical Schema Promotion Rule

Some formerly free-form `other_specs` fields are progressively promoted into canonical fields. When `wheel-format.json` defines a dedicated field, write the value there directly and do not duplicate it in `other_specs`.

If the source page uses synonym labels for a promoted field, normalize them into the canonical field. Keep only genuinely unstructured or not-yet-promoted information in `other_specs`.

For hub bearing and material specs, write source labels such as `bearing_type`, `bearing_models`, and `hub_material` into `hub.bearing_type`, `hub.bearing_models`, and `hub.material`. Do not duplicate those labels in `other_specs`.

For spoke count specs, write source labels such as `spoke_count`, `spoke_count_front`, `spoke_count_rear`, and `spoke_count_disc` into `spokes.count`. Use `{ "front": n, "rear": n }` for a single wheelset count, or map explicit front/rear values to the matching side. Do not duplicate those labels in `other_specs`.

For spoke detail specs, write source labels such as `nipples`, `spoke_nipple`, `spoke_nipples`, `spoke_type`, `spoke_profile`, `spoke_lacing`, `spoke_lacing_front`, `spoke_lacing_rear`, `front_wheel_spoke_lacing`, `rear_wheel_spoke_lacing`, `lacing`, and `rear_lacing` into `spokes.nipple`, `spokes.type`, `spokes.profile`, and `spokes.lacing`. Use `{ "front": value, "rear": value }` for a single wheelset lacing value, or map explicit front/rear values to the matching side. Normalize simple lacing shorthand such as `2x` to `2-cross` when unambiguous. Do not duplicate those labels in `other_specs`.

For maximum tire pressure specs, write source labels such as `max_tire_pressure_psi`, `max_tire_pressure_bar`, `maximum_tire_pressure`, `max_tire_pressure_tubeless_psi`, `max_tire_pressure_tubed_psi`, `max_tire_pressure_psi_28c`, `max_tire_pressure_psi_clincher`, and `max_tire_pressure_psi_tubeless` into `rim.max_tire_pressure`. Store `{ "psi": number|null, "bar": number|null, "note": string|null }`. Convert the missing unit when only one unit is published (`psi = round(bar * 14.5038)`, `bar = round((psi / 14.5038) * 10) / 10`). Preserve conditional wording such as tubeless/tubed or tire-width-specific limits in `note`. Do not duplicate those labels in `other_specs`.

### Data Quality Requirements

* Never invent values.
* Ensure every wheel has a unique sequential `id`.
* Validate that the final JSON is syntactically correct before returning.
* Continue until all road wheel products available on the website have been processed.


### Divergent front/rear specs

Four fields support a front/rear pair form for wheelsets where the front and rear wheels differ:

| Field | Single value | Divergent pair |
|---|---|---|
| `weight_grams` | `1450` | `{ "front": 650, "rear": 800 }` |
| `rim.depth_mm` | `50` | `{ "front": 40, "rear": 60 }` |
| `rim.externalWidth_mm` | `28` | `{ "front": 27, "rear": 30 }` |
| `rim.internalWidth_mm` | `21` | `{ "front": 19, "rear": 23 }` |

Use the pair form only when the manufacturer explicitly states different front and rear values for that spec. Use the scalar form in all other cases.

**Do not put front/rear weight or depth values into `other_specs`** — they belong in the canonical fields above.

---

### Buyable variant configurations (EVO-044 / EVO-045)

Every **buyable configuration** is its own catalog object. When a model is sold in several configurations, emit **one complete object per configuration** — never bury the variants in `other_specs`. Siblings share an identical `brand` + `model` and are distinguished by a unique `variant` key.

**Actively hunt for variants.** Do not record only the default configuration. On every product page, explicitly check the option selectors a buyer can choose (spoke material, rim width, brake type, hub/build tier) and any separate SKU/product pages the model links to. Produce one object per documented purchasable configuration. Never fabricate a configuration the model does not actually offer.

The three comparable (filterable + sortable) axes and their canonical keys:

| Axis | Field | Canonical keys |
|---|---|---|
| Spoke material | `spokes.material` | `carbon`, `carbon_composite`, `steel`, `aluminum`, `titanium` |
| Rim width | `rim.internalWidth_mm` / `rim.externalWidth_mm` | numeric (mm) |
| Brake type | `brake_type` | `disc`, `rim`, `track` |

Rules:

1. **One object per configuration**, each with its own `id`, `weight_grams`, `prices` and field values.
2. **Same `model`, unique `variant`.** Siblings carry an identical clean `model` (no parenthetical suffix) and a unique `variant` snake_case key naming what differs (e.g. `carbon_spokes`, `steel_spokes`, `external_37mm`, `disc_brake`, `cognition_v2_hub`). A single-configuration model carries **no** `variant`.
3. **`variant` is a localized key.** Store the snake_case key only; its display label and translation live in the frontend `variant.*` i18n namespace. Never store free display text.
4. **`variant` ≠ filter axis.** The three comparable axes remain the structured filterable/sortable fields and must still be populated. `variant` is a display differentiator that may name a non-axis difference (e.g. hub/build tier) when that is what makes two same-`model` products distinct buyable configurations.
5. Use **canonical axis keys** exactly as above; one physical option = one key. Do not store Title Case for these axes — the frontend i18n layer handles display.
6. **Never** put spoke material, rim width, brake type, per-variant weight or any price in `other_specs` (no `carbon_spoke_option`, `weight_carbon_spoke_grams`, `external_width_options_mm`, and no `price_eur` / `price_usd` / `price_usd_front` / `price_usd_rear` / `price_usd_wheelset`). Every price is an offer `{ amount, currency }`.
7. New configuration `id`s start at **200+**; never reuse reserved ranges 50–128 or 129–137.
8. Siblings often have **distinct** prices (source each as `{ amount, currency }` in its native currency; `amount: null` if unavailable — never copy a sibling's price). Rim-width siblings that share one price inherit the base model's price.

---

**Capture ALL remaining technical specifications that do not fit into the predefined schema.**

The `other_specs` object must act as a complete repository of any additional product information found on the manufacturer or retailer pages.

Examples include (but are not limited to):

* rider weight limit
* tire compatibility / recommended tire width
* spoke length / tension / replacement part numbers
* rim construction technologies / hub technologies
* aerodynamic claims / stiffness metrics
* certifications / warranty information
* country of manufacture / included accessories
* ETRTO dimensions
* any manufacturer-specific technology names

**Important:** Do not discard any technical information simply because it does not match a predefined field. Preserve it inside `other_specs` using meaningful key names and original values whenever possible.

Example:

```json
"other_specs": {
  "recommended_tire_width_mm": "28-45",
  "aero_technology": "Aero+",
  "warranty_years": 5
}
```

When a specification appears in a table, attempt to preserve the original meaning rather than forcing it into a predefined category.

**Data Completeness Rule**

When a technical specification table is present, extract every row from the table. Any row that cannot be mapped to a dedicated schema field must be added to `other_specs`. The goal is that no technical information available on the source page is lost during extraction.
