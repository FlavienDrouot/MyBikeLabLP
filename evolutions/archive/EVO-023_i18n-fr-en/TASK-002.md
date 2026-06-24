# TASK-002 — Create `public/locales/en.json` with all English strings

## Objective

Create the English translation file `frontend/public/locales/en.json` by extracting every user-facing string from every component and from the wheel property registry. This file becomes the single authoritative source for all English UI copy. The English content must be textually identical to the current hardcoded strings (AC-011 — no copy regression).

## Required context

- **File to create**: `frontend/public/locales/en.json`
- **Namespace**: `translation` (default i18next namespace — the JSON object itself is the namespace content, no wrapping key needed)
- **Key naming convention**: dot-notation, hierarchical by section — e.g., `comparator.header.title`, `properties.weight.label`
- **Rule**: the value of every key must be exactly the current hardcoded English string from the codebase — no paraphrasing, no rewriting

## Potentially impacted files

- `public/locales/en.json` (new file)

## Inputs

The complete set of hardcoded English strings, component by component:

### Navbar (`src/components/Navbar.jsx`)
- Nav links: `"Tool"`, `"Roadmap"`, `"Partnerships"`
- CTA button: `"Contact"`
- Aria labels: `"Close menu"` (when open), `"Open menu"` (when closed)

### Hero (`src/components/Hero.jsx`)
- Headline: `"Wheels, "` + `"measured."` (em tag) + `" Not marketed."`
  — store as one key: `"Wheels, measured. Not marketed."`
  — note: the `<em>` tag is a rendering concern handled in the component; the translation key holds the plain text
- Subtitle: `"Compare by weight, rim depth, hookless compatibility, hub brand, price and many more. Structured in a single table."`
- CTA primary: `"Open comparator →"`
- CTA secondary: `"See the roadmap →"`
- Stats labels: `"Wheels"`, `"Filter axes"`, `"Phases planned"`

### Comparator section — MiniComparator (`src/components/MiniComparator/MiniComparator.jsx`)
- Section index label: `"COMPARATOR"`
- Section title: `"Road wheels: filter and compare"`
- Section subtitle: `"Filter and sort by brand, weight, rim depth, price, and many more."`
- Mobile filter trigger button: `"Filters"` (also used as drawer label)
- Drawer aria-label: `"Filters"`
- Footer note: `"Sample dataset · Real prices & partners coming soon"`

### FilterPanel (`src/components/MiniComparator/FilterPanel.jsx`)
- Panel heading: `"Filters"`
- Reset button: `"Reset"`
- Sort-by label: `"Sort by"`
- Search placeholder (LargeMultiSelectFilter): `"Search…"`
- No results message (LargeMultiSelectFilter): `"No results"`
- Filter toggle aria prefix: `"Enable"` (used in `ariaLabel={\`Enable ${t(property.label).toLowerCase()} filter\`}`)
  — store as: `"Enable {{label}} filter"` (i18next interpolation)

### ColumnSelector (`src/components/MiniComparator/ColumnSelector.jsx`)
- Button label: `"Columns"`

### ComparisonTable (`src/components/MiniComparator/ComparisonTable.jsx`)
- Table heading: `"Wheels"` (part of `"Wheels — X of Y"` — only the word `"Wheels"` is translated; the count is dynamic)
- Empty state: `"No wheels match your filters. Try resetting them."`

### WheelDetailPanel (`src/components/MiniComparator/WheelDetailPanel.jsx`)
- Section label: `"Manufacturer"`
- Section label: `"Where to buy"`
- Buy link: `"Buy →"`
- No links state: `"No affiliate links available for this wheel."`
- Price annotation: `"indicative price, sourced 2025-Q2"`

### badges.jsx (`src/components/MiniComparator/badges.jsx`)
- `"Hookless"`
- `"Hooked"`

### Roadmap section (`src/components/RoadmapSection.jsx`)
Section index: `"ROADMAP"`, section title: `"Three phases"`, subtitle: `"Comparison first. Impact simulation next. Full bike configurator on the horizon."`

Phase data (stored as a JSON array under `roadmap.phases`):
```json
[
  {
    "tag": "Phase 1",
    "status": "In progress",
    "title": "Components comparison",
    "description": "Wheels first, then drivetrains, brakes, tires. Structured specs, side-by-side decisions.",
    "points": ["Wheels MVP live", "Drivetrains coming", "Brakes & tires next"]
  },
  {
    "tag": "Phase 2",
    "status": "Next",
    "title": "Impact simulator",
    "description": "See how each part changes your ride: weight, aerodynamics, total cost, predicted performance.",
    "points": ["Weight delta", "Aero gains", "Cost-per-watt"]
  },
  {
    "tag": "Phase 3",
    "status": "Vision",
    "title": "Full bike configurator",
    "description": "Build your dream bike from the frame up, simulate the full setup, then go buy it.",
    "points": ["Frame to finish", "Performance preview", "Affiliate-ready"]
  }
]
```

### Benefits section (`src/components/BenefitsGrid.jsx`)
Section index: `"BENEFITS"`, section title: `"Built for serious cyclists"`

Benefits data (stored as a JSON array under `benefits.items`):
```json
[
  {
    "title": "Better decisions",
    "description": "Stop comparing PDFs and forum threads. Filter on the specs that actually matter for your ride."
  },
  {
    "title": "Data-driven",
    "description": "Every spec is sourced and structured. No marketing fluff, just numbers you can cross-check."
  },
  {
    "title": "Community-focused",
    "description": "Built with riders, manufacturers and resellers. Open data, transparent affiliations."
  }
]
```

### Partnership section (`src/components/PartnershipSection.jsx`)
- Section index: `"PARTNERSHIP"`
- Heading: `"Work with us"`
- Intro paragraph: `"MyBikeLab connects cyclists with structured component data. If you supply or sell road bike components, your product data belongs here."`

Audiences array (stored as JSON array under `partnership.audiences`):
```json
[
  {
    "title": "Manufacturers",
    "description": "Showcase your specs in a structured, comparison-ready format."
  },
  {
    "title": "Resellers",
    "description": "Plug into a high-intent comparison funnel built for road cyclists."
  }
]
```

### ContactForm (`src/components/ContactForm.jsx`)
- Field label: `"Name"`
- Field label: `"Email"`
- Field label: `"Company (optional)"`
- Field label: `"Message"`
- Submit button: `"Send message"`
- Validation error: `"Name is required"`
- Validation error: `"Email is required"`
- Validation error: `"Message is required"`
- Success heading: `"Thanks, {{name}}!"` (interpolated)
- Success body: `"We'll get back to you at"` + `"shortly."` — store as `"We'll get back to you at {{email}} shortly."` (single interpolated key)

### Footer (`src/components/Footer.jsx`)
- Copyright: `"© {{year}} MyBikeLab. All rights reserved."` (year is dynamic — use i18next interpolation)
- Nav links: `"Tool"`, `"Roadmap"`, `"Partnerships"`, `"Contact"`

### Wheel property labels (from `src/config/wheelProperties.jsx`)
These are the translation key values for the `label` field of each property. The keys themselves are defined in TASK-004; the values here are the current English strings:

| Property id | Current English label |
|---|---|
| `image` | `"Image"` |
| `model` | `"Model"` |
| `brand` | `"Brand"` |
| `weight` | `"Weight"` |
| `price` | `"Price"` |
| `diameter` | `"Diameter"` |
| `rimMaterial` | `"Rim material"` |
| `hookless` | `"Hookless"` |
| `depth` | `"Depth"` |
| `rimWidth` | `"Rim width"` |
| `hub` | `"Hub"` |
| `hubBrand` | `"Hub brand"` |
| `hubModel` | `"Hub model"` |
| `spokes` | `"Spokes"` |
| `spokesBrand` | `"Spokes brand"` |
| `spokesModel` | `"Spokes model"` |
| `spokeMaterial` | `"Spoke material"` |

Column group labels:

| Group id | Current English label |
|---|---|
| `general` | `"General specs"` |
| `rims` | `"Rims"` |
| `subs` | `"Subcomponents"` |

Sort option labels:

| Sort id | Current English label |
|---|---|
| `name` | `"Name (A → Z)"` |
| `weight_asc` | `"Weight (light → heavy)"` |
| `weight_desc` | `"Weight (heavy → light)"` |
| `price_asc` | `"Price (low → high)"` |
| `price_desc` | `"Price (high → low)"` |
| `depth_asc` | `"Depth (shallow → deep)"` |
| `depth_desc` | `"Depth (deep → shallow)"` |
| `rimWidth_asc` | `"Rim width (narrow → wide)"` |
| `rimWidth_desc` | `"Rim width (wide → narrow)"` |

TriState labels (hookless filter):

| Key | Value |
|---|---|
| `filters.hookless.all` | `"All"` |
| `filters.hookless.hookless` | `"Hookless"` |
| `filters.hookless.hooked` | `"Hooked"` |

Language toggle (LanguageToggle component — created in TASK-005):

| Key | Value |
|---|---|
| `nav.lang.en` | `"EN"` |
| `nav.lang.fr` | `"FR"` |
| `nav.lang.switchTo` | `"Switch to {{lang}}"` (aria-label for toggle buttons) |

## Expected outputs

### `public/locales/en.json`

```json
{
  "nav": {
    "tool": "Tool",
    "roadmap": "Roadmap",
    "partnerships": "Partnerships",
    "contact": "Contact",
    "openMenu": "Open menu",
    "closeMenu": "Close menu",
    "lang": {
      "en": "EN",
      "fr": "FR",
      "switchTo": "Switch to {{lang}}"
    }
  },
  "hero": {
    "title": "Wheels, measured. Not marketed.",
    "subtitle": "Compare by weight, rim depth, hookless compatibility, hub brand, price and many more. Structured in a single table.",
    "ctaPrimary": "Open comparator →",
    "ctaSecondary": "See the roadmap →",
    "stats": {
      "wheels": "Wheels",
      "filterAxes": "Filter axes",
      "phasesPlanned": "Phases planned"
    }
  },
  "comparator": {
    "sectionIndex": "COMPARATOR",
    "title": "Road wheels: filter and compare",
    "subtitle": "Filter and sort by brand, weight, rim depth, price, and many more.",
    "filtersButton": "Filters",
    "filtersDrawerLabel": "Filters",
    "footerNote": "Sample dataset · Real prices & partners coming soon"
  },
  "filterPanel": {
    "heading": "Filters",
    "reset": "Reset",
    "sortBy": "Sort by",
    "searchPlaceholder": "Search…",
    "noResults": "No results",
    "enableFilter": "Enable {{label}} filter"
  },
  "columnSelector": {
    "button": "Columns"
  },
  "table": {
    "heading": "Wheels",
    "emptyState": "No wheels match your filters. Try resetting them."
  },
  "wheelDetail": {
    "manufacturer": "Manufacturer",
    "whereToBuy": "Where to buy",
    "buyLink": "Buy →",
    "noLinks": "No affiliate links available for this wheel.",
    "priceAnnotation": "indicative price, sourced 2025-Q2"
  },
  "badges": {
    "hookless": "Hookless",
    "hooked": "Hooked"
  },
  "roadmap": {
    "sectionIndex": "ROADMAP",
    "title": "Three phases",
    "subtitle": "Comparison first. Impact simulation next. Full bike configurator on the horizon.",
    "phases": [
      {
        "tag": "Phase 1",
        "status": "In progress",
        "title": "Components comparison",
        "description": "Wheels first, then drivetrains, brakes, tires. Structured specs, side-by-side decisions.",
        "points": ["Wheels MVP live", "Drivetrains coming", "Brakes & tires next"]
      },
      {
        "tag": "Phase 2",
        "status": "Next",
        "title": "Impact simulator",
        "description": "See how each part changes your ride: weight, aerodynamics, total cost, predicted performance.",
        "points": ["Weight delta", "Aero gains", "Cost-per-watt"]
      },
      {
        "tag": "Phase 3",
        "status": "Vision",
        "title": "Full bike configurator",
        "description": "Build your dream bike from the frame up, simulate the full setup, then go buy it.",
        "points": ["Frame to finish", "Performance preview", "Affiliate-ready"]
      }
    ]
  },
  "benefits": {
    "sectionIndex": "BENEFITS",
    "title": "Built for serious cyclists",
    "items": [
      {
        "title": "Better decisions",
        "description": "Stop comparing PDFs and forum threads. Filter on the specs that actually matter for your ride."
      },
      {
        "title": "Data-driven",
        "description": "Every spec is sourced and structured. No marketing fluff, just numbers you can cross-check."
      },
      {
        "title": "Community-focused",
        "description": "Built with riders, manufacturers and resellers. Open data, transparent affiliations."
      }
    ]
  },
  "partnership": {
    "sectionIndex": "PARTNERSHIP",
    "title": "Work with us",
    "intro": "MyBikeLab connects cyclists with structured component data. If you supply or sell road bike components, your product data belongs here.",
    "audiences": [
      {
        "title": "Manufacturers",
        "description": "Showcase your specs in a structured, comparison-ready format."
      },
      {
        "title": "Resellers",
        "description": "Plug into a high-intent comparison funnel built for road cyclists."
      }
    ]
  },
  "contact": {
    "namePlaceholder": "Name",
    "emailPlaceholder": "Email",
    "companyPlaceholder": "Company (optional)",
    "messagePlaceholder": "Message",
    "submit": "Send message",
    "errors": {
      "nameRequired": "Name is required",
      "emailRequired": "Email is required",
      "messageRequired": "Message is required"
    },
    "success": {
      "title": "Thanks, {{name}}!",
      "body": "We'll get back to you at {{email}} shortly."
    }
  },
  "footer": {
    "copyright": "© {{year}} MyBikeLab. All rights reserved.",
    "nav": {
      "tool": "Tool",
      "roadmap": "Roadmap",
      "partnerships": "Partnerships",
      "contact": "Contact"
    }
  },
  "properties": {
    "groups": {
      "general": "General specs",
      "rims": "Rims",
      "subs": "Subcomponents"
    },
    "image": { "label": "Image" },
    "model": { "label": "Model" },
    "brand": { "label": "Brand" },
    "weight": { "label": "Weight" },
    "price": { "label": "Price" },
    "diameter": { "label": "Diameter" },
    "rimMaterial": { "label": "Rim material" },
    "hookless": { "label": "Hookless" },
    "depth": { "label": "Depth" },
    "rimWidth": { "label": "Rim width" },
    "hub": { "label": "Hub" },
    "hubBrand": { "label": "Hub brand" },
    "hubModel": { "label": "Hub model" },
    "spokes": { "label": "Spokes" },
    "spokesBrand": { "label": "Spokes brand" },
    "spokesModel": { "label": "Spokes model" },
    "spokeMaterial": { "label": "Spoke material" }
  },
  "sorts": {
    "name": "Name (A → Z)",
    "weight_asc": "Weight (light → heavy)",
    "weight_desc": "Weight (heavy → light)",
    "price_asc": "Price (low → high)",
    "price_desc": "Price (high → low)",
    "depth_asc": "Depth (shallow → deep)",
    "depth_desc": "Depth (deep → shallow)",
    "rimWidth_asc": "Rim width (narrow → wide)",
    "rimWidth_desc": "Rim width (wide → narrow)"
  },
  "filters": {
    "hookless": {
      "all": "All",
      "hookless": "Hookless",
      "hooked": "Hooked"
    }
  }
}
```

## Constraints

- Every value in this file must be the exact current English string from the codebase — no rewrites
- Do not add any key that does not correspond to a translatable string currently in the codebase
- The `roadmap.phases`, `benefits.items`, and `partnership.audiences` arrays must have the same number of items and same ordering as in the current components
- Use `{{interpolation}}` syntax for dynamic values: `{{name}}`, `{{email}}`, `{{year}}`, `{{lang}}`, `{{label}}`
- The file must be valid JSON (no trailing commas, no comments)
- Create the `public/locales/` directory if it does not exist

## Dependencies

TASK-001

## Validation criteria

- [ ] File is valid JSON (validate with `node -e "require('./public/locales/en.json')"`)
- [ ] `roadmap.phases` array has exactly 3 items, each with `tag`, `status`, `title`, `description`, `points` fields
- [ ] `benefits.items` array has exactly 3 items, each with `title` and `description`
- [ ] `partnership.audiences` array has exactly 2 items, each with `title` and `description`
- [ ] All sort option keys match the sort `id` values in `wheelProperties.jsx`: `name`, `weight_asc`, `weight_desc`, `price_asc`, `price_desc`, `depth_asc`, `depth_desc`, `rimWidth_asc`, `rimWidth_desc`
- [ ] All property keys match the property `id` values in `wheelProperties.jsx`
- [ ] After TASK-001 is merged and the app runs, no console error about missing namespace or missing keys is shown for the English locale
- [ ] Every visible string on the site in English mode is present in this file (cross-check against each section)

## Tests to implement

### Unit
- None

### Integration
- Load the app in English mode after TASK-001 through TASK-013 are complete; compare every section visually against the pre-evolution site to confirm no English string changed (AC-011)
