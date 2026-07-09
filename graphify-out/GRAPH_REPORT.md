# Graph Report - .  (2026-07-09)

## Corpus Check
- Large corpus: 678 files · ~672,170 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 819 nodes · 1235 edges · 84 communities (65 shown, 19 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 51 edges (avg confidence: 0.66)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Design System App
- Product UI Components
- Other Specs Codemod
- Landing Tweaks UI
- Frontend Package Tooling
- Product Entry Strategy
- Comparator Property Tests
- Design Preview Controls
- Wheel Validation
- Agent And Design Rules
- Core Wheel Catalog
- Farsports Catalog Data
- Sort And Selectors
- Comparator Filters
- Wheel Detail Panel
- Magene Catalog Data
- Scom Catalog Data
- Tire Compatibility Codemod
- Detail Panel Mockups
- Navbar Localization
- 9Velo Catalog Data
- Pressure Warranty Codemod
- Awin Feed Fetcher
- Caden Catalog Data
- Vitest Summary Tool
- Comparator UI Kit
- Landing Page Tests
- Filter Store State
- Detail Redesign Rationale
- App Store Wiring
- Detail Panel Tests
- Test Setup Locale
- Spoke Lacing Codemod
- Spoke Count Codemod
- Channel3 Fetcher
- Scripts Package Tooling
- Landing UI Kit
- Wheel Detail UI Kit
- Arcaris Catalog Data
- Certification Codemod
- Color Palette Previews
- Hero Filter Chips
- Image URL Tests
- Pertual Catalog Data
- Shimano Catalog Data
- Yoeleo Catalog Data
- Rim Construction Codemod
- Hub Engagement Codemod
- Detail Redesign Component
- Footer Logo Tests
- Range Filter Math
- Image Carousel
- No6 Catalog Data
- Overfast Catalog Data
- Weight Tolerance Codemod
- Detail Integration Notes
- Property Cell Rendering
- Column Picker Kit
- Landing Comparator Preview
- Design Sample Wheels
- Badge Preview
- Visual Motifs
- Radii System
- Divider Rules
- Spacing Scale
- Display Typography
- Type Families
- Mono Label Typography
- Sans Typography

## God Nodes (most connected - your core abstractions)
1. `getObjectProperty()` - 23 edges
2. `getPropertyName()` - 15 edges
3. `validateWheelEntry()` - 13 edges
4. `getFilterableProperties()` - 11 edges
5. `react` - 10 edges
6. `convert()` - 10 edges
7. `hasProperty()` - 9 edges
8. `promoteRimMaxTirePressureInObjectExpression()` - 9 edges
9. `scripts` - 8 edges
10. `ComparisonTable()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Channel3 Fetch Results 2026-06-05` --semantically_similar_to--> `Channel3 Source Evaluation`  [INFERRED] [semantically similar]
  scripts/README.md → product-overview.md
- `constructionNodeFromValues()` --indirect_call--> `value()`  [INFERRED]
  scripts/codemods/other-specs-promote.mjs → frontend/src/components/MiniComparator/__tests__/ComparisonTable.column-widths.test.jsx
- `Deploy GitHub Pages Workflow` --references--> `MyBikeLab README`  [EXTRACTED]
  .github/workflows/deploy.yml → README.md
- `MyBikeLab Agent Instructions` --references--> `MyBikeLab Design System README`  [EXTRACTED]
  AGENTS.md → frontend/design-system/README.md
- `MyBikeLab README` --references--> `Frontend README`  [EXTRACTED]
  README.md → frontend/README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Design System Preview Specimen Set** — frontend_design_system_preview_badges, frontend_design_system_preview_buttons, frontend_design_system_preview_cards, frontend_design_system_preview_color_accents, frontend_design_system_preview_color_brass, frontend_design_system_preview_color_ink, frontend_design_system_preview_color_palettes, frontend_design_system_preview_color_paper, frontend_design_system_preview_color_sage, frontend_design_system_preview_color_semantic, frontend_design_system_preview_elevation, frontend_design_system_preview_hero_treatment [EXTRACTED 1.00]
- **Frontend Architecture Core Flow** — readme_react_vite_redux_tailwind_frontend, frontend_readme_wheel_properties_registry, readme_minicomparator_feature [EXTRACTED 1.00]
- **Design System Token Family** — domain_vocabulary_design_tokens, frontend_design_system_implementation_guide_token_usage_rules, frontend_design_system_preview_color_palettes_base_palettes, frontend_design_system_preview_color_accents_swappable_accent_axis [INFERRED 0.85]
- **Preview Primitives Form Design System** — frontend_design_system_preview_icons_iconography, frontend_design_system_preview_inputs_input_controls, frontend_design_system_preview_radii_radii_system, frontend_design_system_preview_rules_hairline_divider_system, frontend_design_system_preview_spacing_scale_spacing_scale, frontend_design_system_preview_shared_design_tokens [INFERRED 0.85]
- **Typography Previews Form Type System** — frontend_design_system_preview_type_display_display_typography, frontend_design_system_preview_type_families_type_families, frontend_design_system_preview_type_mono_labels_mono_label_typography, frontend_design_system_preview_type_sans_sans_typography [INFERRED 0.95]
- **Product Surfaces Implement MyBikeLab Experience** — frontend_design_system_ui_kits_landing_readme_landing_ui_kit, frontend_design_system_ui_kits_comparator_readme_comparator_ui_kit, frontend_design_system_ui_kits_wheel_detail_readme_wheel_detail_ui_kit, frontend_design_system_product_overview_mybikelab_product [EXTRACTED 1.00]
- **Wheel Detail Panel Redesign Integration** — frontend_design_system_wheel_detail_panel_redesign_wheeldetailpanel_redesign_panel_final, frontend_design_system_wheel_detail_panel_redesign_repo_integration_wheeldetailpanel_replacement, frontend_design_system_wheel_detail_panel_redesign_repo_integration_price_panel_design, frontend_design_system_wheel_detail_panel_redesign_repo_integration_wheelimagecarousel_resizing [INFERRED 0.95]
- **Road Wheel Catalog Data Pipeline** — product_overview_data_acquisition_strategy, scripts_datascrapingprompt_road_wheel_extraction_rules, scripts_datascrapingprompt_canonical_wheel_schema, product_overview_structured_catalog_data [INFERRED 0.95]
- **Other Specs Schema Promotion Workflow** — scripts_datascrapingprompt_other_specs_promotion_rule, scripts_codemods_readme_other_specs_promote_harness, scripts_codemods_readme_schema_migration_update_contract [INFERRED 0.95]

## Communities (84 total, 19 thin omitted)

### Community 0 - "Design System App"
Cohesion: 0.06
Nodes (27): benefits, BenefitsGrid(), ContactForm(), Footer(), Hero(), HookBadge(), ColumnSelector(), cellClassFor() (+19 more)

### Community 1 - "Product UI Components"
Cohesion: 0.07
Nodes (23): BenefitsGrid(), ICONS, ContactForm(), cellClassFor(), renderCellFor(), ColumnSelector(), ComparisonTable(), FilterPanel() (+15 more)

### Community 2 - "Other Specs Codemod"
Cohesion: 0.06
Nodes (29): consumedCertificationOtherSpecKeys, consumedHubEngagementOtherSpecKeys, consumedHubOtherSpecKeys, consumedRimMaterialConstructionOtherSpecKeys, consumedRimMaxTirePressureOtherSpecKeys, consumedSpokesCountOtherSpecKeys, consumedSpokesDetailOtherSpecKeys, consumedTireCompatibilityOtherSpecKeys (+21 more)

### Community 3 - "Landing Tweaks UI"
Cohesion: 0.07
Nodes (25): TweakColor(), TweakNumber(), TweakRadio(), TweaksPanel(), __twkIsLight(), useTweaks(), DC, DCArtboardFrame() (+17 more)

### Community 4 - "Frontend Package Tooling"
Cohesion: 0.07
Nodes (27): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, jsdom (+19 more)

### Community 5 - "Product Entry Strategy"
Cohesion: 0.08
Nodes (27): Content Security Policy, Frontend HTML Entry Point, React Main JSX Entry, Road Wheel Comparator Metadata, Affiliate Links Business Model, Channel3 Source Evaluation, Data Acquisition Strategy, MyBikeLab Product Overview (+19 more)

### Community 6 - "Comparator Property Tests"
Cohesion: 0.11
Nodes (10): HookBadge(), declaredGroupIds, LOCALES, COLUMN_GROUPS, DIAMETER_LABEL_MAP, minPrice(), minPriceIn(), selectMinOffer() (+2 more)

### Community 7 - "Design Preview Controls"
Cohesion: 0.10
Nodes (19): Iconography, Input Controls, Brand Identity, Shared Design Tokens, Data Stat Components, Spec Table, MyBikeLab Product, Product Roadmap (+11 more)

### Community 8 - "Wheel Validation"
Cohesion: 0.15
Nodes (22): collectHubEngagementWarnings(), collectOffers(), collectOtherSpecWarnings(), collectPriceSchemaWarnings(), collectSpokeDetailWarnings(), collectTireCompatibilityWarnings(), collectTireWidthWarnings(), collectVariantWarnings() (+14 more)

### Community 9 - "Agent And Design Rules"
Cohesion: 0.09
Nodes (24): MyBikeLab Agent Instructions, Domain Vocabulary, Design Tokens, Product Variant, Wheelset Pair Catalog Unit, Design System Implementation Guide, Token Usage Rules, Button Preview Specimen (+16 more)

### Community 10 - "Core Wheel Catalog"
Cohesion: 0.13
Nodes (10): channel3Wheels, crwWorksWheels, enveWheels, exsWheels, IMAGES, FREEHUB_OPTIONS, goosynnWheels, mavicWheels (+2 more)

### Community 11 - "Farsports Catalog Data"
Cohesion: 0.12
Nodes (18): airBuilds, airFreehubs, airModels, airSpokes, cSpokes, discHub(), farsportsWheels, freehubs (+10 more)

### Community 12 - "Sort And Selectors"
Cohesion: 0.14
Nodes (7): getAllSorts(), getDefaultSortId(), mixedCatalog, mockWheels, noFilters, matchers, selectFilteredWheels

### Community 13 - "Comparator Filters"
Cohesion: 0.23
Nodes (9): FILTER_ADAPTERS, LargeMultiSelectFilter(), MultiSelectFilter(), RangeFilter(), TriStateFilter(), getPropertyById(), makeSelectContextualCountsFor(), makeSelectOptionsFor() (+1 more)

### Community 14 - "Wheel Detail Panel"
Cohesion: 0.31
Nodes (10): buildLedgerEntries(), entryPriceIn(), hasKnownPrice(), LedgerRow(), WheelDetailPanel(), convert(), formatPrice(), isSupportedCurrency() (+2 more)

### Community 15 - "Magene Catalog Data"
Cohesion: 0.21
Nodes (13): freehubOptions, mageneWheels, makeLinks(), makePro(), makeUltra(), proOtherSpecs, proShared, splitHubSpecs() (+5 more)

### Community 16 - "Scom Catalog Data"
Cohesion: 0.15
Nodes (10): aeroliteHub, aeroliteImages, aeroliteSpokes, FREEHUB_OPTIONS, HUB_SPECS, scomWheels, ultraDiscHub, ultraImages (+2 more)

### Community 17 - "Tire Compatibility Codemod"
Cohesion: 0.27
Nodes (13): addTireCompatibilityType(), getObjectProperty(), parseExistingTireCompatibilityTypes(), parseExistingTireWidth(), parseTireCompatibilityTypes(), parseTireWidthNumber(), parseTireWidthRange(), promoteTireCompatibilityInObjectExpression() (+5 more)

### Community 18 - "Detail Panel Mockups"
Cohesion: 0.30
Nodes (8): buildEntries(), eur(), LedgerRow(), PanelA(), PanelB(), PanelC(), PanelFinal(), WHEEL

### Community 19 - "Navbar Localization"
Cohesion: 0.20
Nodes (6): CURRENCY_SYMBOLS, CurrencyToggle(), LANGUAGES, Navbar(), wheelsSlice, changeDisplayCurrency()

### Community 20 - "9Velo Catalog Data"
Cohesion: 0.20
Nodes (11): carbonSpokes, discCarbonSpokeHub, discSteelSpokeHub, freehubOptions, makeLinks(), makeWheel(), nineVeloWheels, rimBrakeHub (+3 more)

### Community 21 - "Pressure Warranty Codemod"
Cohesion: 0.23
Nodes (12): clonePromotedValue(), getPropertyName(), hasProperty(), parseFreeTextPressure(), parsePressureNumber(), parseWarrantyYears(), pressureObjectProperty(), pressureText() (+4 more)

### Community 22 - "Awin Feed Fetcher"
Cohesion: 0.24
Nodes (11): extractDownloadUrl(), fetchText(), findFeedRow(), fs, main(), OUTPUT_PATH, { parse }, parseCsv() (+3 more)

### Community 23 - "Caden Catalog Data"
Cohesion: 0.18
Nodes (9): baseHubSpecs, baseOtherSpecs, cadenWheels, carbonSpokeOtherSpecs, carbonSpokes, FREEHUB_OPTIONS, IMG, standardOtherSpecs (+1 more)

### Community 24 - "Vitest Summary Tool"
Cohesion: 0.27
Nodes (10): child, formatMs(), getAssertions(), getDuration(), printFallback(), printSummary(), relativeFile(), rootDir (+2 more)

### Community 25 - "Comparator UI Kit"
Cohesion: 0.27
Nodes (7): App(), applyFilters(), DEFAULTS, sortWheels(), countBy(), FilterPanel(), value()

### Community 26 - "Landing Page Tests"
Cohesion: 0.22
Nodes (6): Landing(), emptyWheelsStore, isNodeAllowed(), isTokenAllowed(), currencySlice, initialState

### Community 27 - "Filter Store State"
Cohesion: 0.31
Nodes (5): collectRangeBoundValues(), collectRangeBoundValuesForItems(), buildInitialFilters(), buildInitialState(), filtersSlice

### Community 28 - "Detail Redesign Rationale"
Cohesion: 0.22
Nodes (9): Affiliate Link Region And Stock Metadata, Manufacturer Retailer Price Panel Design, Babel Standalone JSX Transform, DesignCanvas, WheelDetailPanel Redesign HTML, PanelA Reference Mockup, PanelC Reference Mockup, PanelFinal Wheel Detail Mockup (+1 more)

### Community 30 - "Detail Panel Tests"
Cohesion: 0.25
Nodes (5): baseWheel, manufacturer, manufacturerWithoutPrice, retailers, retailersWithoutPrice

### Community 32 - "Spoke Lacing Codemod"
Cohesion: 0.25
Nodes (8): cloneTextValue(), getLacingPairFromValue(), lacingObjectProperty(), lacingValueNode(), mergeLacingPair(), normalizedLacingText(), pairFromGlobalLacing(), promoteSpokesDetailInObjectExpression()

### Community 33 - "Spoke Count Codemod"
Cohesion: 0.32
Nodes (8): countObjectProperty(), countValueNode(), mergeCountPair(), parseCountPair(), parseCountString(), parseNumericLiteral(), parseSideCount(), promoteSpokesCountInObjectExpression()

### Community 34 - "Channel3 Fetcher"
Cohesion: 0.36
Nodes (7): buildRequestBody(), fetchOnePage(), fs, main(), OUTPUT_PATH, path, writeOutput()

### Community 35 - "Scripts Package Tooling"
Cohesion: 0.25
Nodes (7): dependencies, csv-parse, dotenv, description, name, private, version

### Community 36 - "Landing UI Kit"
Cohesion: 0.38
Nodes (4): ACCENTS, App(), LANDING_TWEAK_DEFAULTS, PALETTES

### Community 38 - "Arcaris Catalog Data"
Cohesion: 0.33
Nodes (6): arcarisWheels, baseOtherSpecs, FREEHUB_OPTIONS, IMAGES, makeArcarisWheel(), splitHubSpecs()

### Community 39 - "Certification Codemod"
Cohesion: 0.38
Nodes (7): certificationObjectProperty(), parseAstmCategoryNode(), parseBooleanNode(), parseCertificationText(), promoteCertificationInObjectExpression(), setCertificationField(), valueNode()

### Community 40 - "Color Palette Previews"
Cohesion: 0.33
Nodes (6): Accent Color Preview Specimen, Swappable Accent Axis, Brass Color Preview Specimen, Base Palette Preview Specimen, Base Palettes, Paper Color Preview Specimen

### Community 42 - "Hero Filter Chips"
Cohesion: 0.47
Nodes (3): Hero(), FilterChips(), getFilterableProperties()

### Community 44 - "Pertual Catalog Data"
Cohesion: 0.33
Nodes (4): pandaImages, pandaUrls, pertualWheels, urls

### Community 45 - "Shimano Catalog Data"
Cohesion: 0.40
Nodes (5): makeLinks(), makeShimanoWheel(), sharedHub, shimanoWheels, urls

### Community 46 - "Yoeleo Catalog Data"
Cohesion: 0.33
Nodes (3): NXT_FREEHUB_OPTIONS, QIANKUN_FREEHUB_OPTIONS, yoeleoWheels

### Community 47 - "Rim Construction Codemod"
Cohesion: 0.53
Nodes (6): categoryMaterialFromText(), constructionNodeFromValues(), isEmptyStringLiteral(), normalizedTextFromNode(), promoteRimMaterialConstructionInObjectExpression(), shouldKeepMaterialNameAsConstruction()

### Community 48 - "Hub Engagement Codemod"
Cohesion: 0.40
Nodes (6): ENGAGEMENT_TYPES, parseEngagementFromText(), parseExistingHubEngagement(), parsePositiveNumber(), promoteHubEngagementInObjectExpression(), setHubEngagement()

### Community 51 - "Range Filter Math"
Cohesion: 0.80
Nodes (4): DualRangeRow(), clampHigh(), clampLow(), roundToStep()

### Community 53 - "No6 Catalog Data"
Cohesion: 0.40
Nodes (3): baseOtherSpecs, FREEHUB_OPTIONS, no6Wheels

### Community 54 - "Overfast Catalog Data"
Cohesion: 0.40
Nodes (3): baseHubSpecs, FREEHUB_OPTIONS, overfastWheels

### Community 55 - "Weight Tolerance Codemod"
Cohesion: 0.40
Nodes (5): parseSpecTotal(), parseToleranceGrams(), parseTolerancePercent(), promoteWeightToleranceInObjectExpression(), roundPercent()

### Community 56 - "Detail Integration Notes"
Cohesion: 0.50
Nodes (4): WheelDetailPanel Integration Notes, wheelDetail i18n Keys, WheelDetailPanel Replacement, WheelImageCarousel Resizing

### Community 57 - "Property Cell Rendering"
Cohesion: 0.83
Nodes (3): property(), render(), t()

## Knowledge Gaps
- **217 isolated node(s):** `benefits`, `FILTER_ADAPTERS`, `audiences`, `phases`, `WHEEL_PROPERTIES` (+212 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `value()` connect `Comparator UI Kit` to `Product UI Components`, `Rim Construction Codemod`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Why does `constructionNodeFromValues()` connect `Rim Construction Codemod` to `Comparator UI Kit`, `Other Specs Codemod`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `selectFilteredWheels` connect `Sort And Selectors` to `Product UI Components`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `benefits`, `FILTER_ADAPTERS`, `audiences` to the rest of the system?**
  _219 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Design System App` be split into smaller, more focused modules?**
  _Cohesion score 0.06219426974143955 - nodes in this community are weakly interconnected._
- **Should `Product UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06676342525399129 - nodes in this community are weakly interconnected._
- **Should `Other Specs Codemod` be split into smaller, more focused modules?**
  _Cohesion score 0.05731707317073171 - nodes in this community are weakly interconnected._