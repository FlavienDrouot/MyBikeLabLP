# swiss-data - design exploration fiche

## Intent

Apply Swiss International Typographic Style directly to product data: the comparator teaser is typeset as a poster-grade statistical ledger, and every section is built from a visible 12-column modular grid with rules, alignment, and whitespace doing the work that boxes and decoration would otherwise do. One grotesk (Archivo, weights 230-880) carries the whole page through weight and size steps alone, flush-left ragged-right throughout.

## Visual references

- Swiss International Typographic Style; Muller-Brockmann concert posters and grid systems
- Josef Muller's "Grid Systems in Graphic Design"
- Stripe Press book typography
- Teenage Engineering's site restraint (instrument-panel micro labels, zero ornament)

## Palette + type

- Paper `#F4F2EC` (warm off-white), ink `#141310`, one red accent `#E63312`
- Red appears only at: the hero figure 224, section № indices, table reference-row index, phase 1 live node/status, hover/focus/selection states
- Archivo variable (200-900, italic for annotations), tabular numerals on all aligned figures (`font-variant-numeric: tabular-nums`)
- Micro labels: 11px caps, .18em tracking. Hairlines at 16% ink; heavy rules 2px solid ink

## Grid discipline

- Single 12-column modular grid; consistent container margins; sections separated by heavy rules
- The faint column overlay lives in exactly one section: the hero
- Roadmap is a horizontal timeline strip with a ruler-like track (12 tick columns) and nodes on grid columns; benefits are numbered footnotes hanging in a gutter column; partnership is a contract spread split by a vertical rule with § clauses facing a ruled-line form (no boxed inputs)

## Deliberate departures from AI-generic patterns

- Hero is a poster grammar: massive flush-left three-line statement beside an aligned stats ledger, not centered-headline-plus-stats-trio
- Zero cards anywhere: tables, timelines, footnotes, clauses, and underline-only form fields replace boxed content
- No icon row, no gradient, no blur, no rounded corners, no shadows; data itself (huge weight figures) is the visual hero
- Honest annotations in small italics (*Indicative price, sourced 2026-Q2*) and real catalog rows instead of placeholder content

## Known tradeoffs

- Extreme restraint can read as cold or austere for a consumer sports audience; warmth relies entirely on paper tone
- The single-family rule limits expressive range; hierarchy depends on weight steps that may flatten on non-variable font fallbacks
- Dense typographic table needs horizontal scroll under ~1020px; giant footer wordmark trades subtlety for poster impact
- Google Fonts requires network on first load; offline it falls back to Helvetica/Arial and loses weight extremes
