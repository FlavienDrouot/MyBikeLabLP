# light-premium-console

## Intent

A premium light console for measured data: cool gray workbench, white instrument panels, recessed wells for anything tabular. Hierarchy comes from weight, spacing, and relief rather than scale, so the hero stays editorial while the comparator table reads as the product's centerpiece. One steel-blue accent marks what is live or active; everything else stays ink on neutral.

## References

- Pas Normal Studios: restraint and quiet confidence, transposed to data without photography.
- DXOMark: clean data hierarchy, numbers first, honest annotations.
- Framework: product clarity and modular panel structure, minus the scroll cost.

## Palette

- Page base: #EEF1F4 (cool neutral, no cream)
- Panels: #FFFFFF, hairline #D7DDE4, subtle low-alpha elevation shadows
- Recessed wells: #E9EDF1 / #EFF2F6 with inset shadows (filters, table region)
- Ink text: #171B21, secondary #454E59, muted #69737F
- Accent: steel blue #35618f, punctual only (key figure 224, active filters, hookless tag, status, links)

## Type

- Schibsted Grotesk for all display and UI, hierarchy through weights (400 to 800) and spacing; hero restrained at about 46 px.
- Fragment Mono reserved for figures and data cells (224 / 36 / 3 ledger, table numerics), giving the register feel without a full mono identity.

## How it satisfies taste equation v2

- Cool neutral light base, zero cream/bronze.
- Perceptible relief everywhere: white panels on gray page, hairlines, soft shadows, recessed wells for filter strip and table.
- No giant display type; brand wordmark oversized only in footer, tone-on-tone, encroaching on nothing.
- Overview first: hero, stats ledger, and the top of the real data table land above the fold at 1280x800.
- Wide multi-zone layouts with balanced asymmetric composition (7/5 hero, 5/6 partnership).
- Stats as an aligned ledger/register; roadmap as a horizontal timeline strip with progress track; benefits as clean cards with no filler labels.
- Zero non-informative decoration: every chip states a true fact (sort state matches row order, "5 of 224", disc brake and weight cap match shown rows).

## Data fidelity

All five table rows are real catalog entries from `frontend/src/data/wheelsData_*.js`: Zipp 202 NSW (fixed), ENVE SES 2.3, Roval Rapide CLX III, Mavic Cosmic SLR 45 Disc, Mavic Ksyrium SL Disc. ENVE price kept in USD with the italic source-currency annotation; prices carry the platform's own 2026-Q2 sourcing note.

## Tradeoffs

- Mono used only for figures keeps identity grotesk-led but makes numeric columns optically quieter than brand/model names; accepted as the console register signal.
- Filter chips are static and illustrative; they were constrained to states that truthfully describe the five visible rows.
- Single accent means category and rim material stay plain text; only hookless gets a tinted tag, which slightly privileges that axis visually.
