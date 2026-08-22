# workshop-manual · wave-1 exploration

## Intent

Stage the MyBikeLab landing page as a mechanic's technical publication: the page is a manila sheet pinned to a dark workbench, and every section re-stages its content as workshop paperwork - an engineering drawing title block for the hero, a parts manifest for the comparator, margin notes in the manual's gutter, a bolted step-plate assembly sequence for the roadmap, and a supplier enquiry order form for B2B. The exploded-wheel figure (hand-drawn inline SVG with leader lines, ref codes and a Ø 700 C dimension) sets the rule that the product is documented like hardware, not sold like software.

## Visual references

- Vintage Campagnolo and Shimano exploded parts diagrams (leader lines, ref codes, hatched cut surfaces)
- IKEA-manual clarity crossed with industrial safety signage (stamps, plates, hazard-free rust accent)
- Patagonia workwear catalogs (warm utilitarian palette, matter-of-fact copy)
- Old service manuals and engineering drawings (title blocks, revision strips, registration marks, "FIG. 01" captions)

## Palette + type

| Role | Value |
| --- | --- |
| Charcoal ink | `#26241F` (deep `#1B1915` workbench) |
| Rust / oxide | `#B4552D` - stamps, primary CTA, accents, hover rules |
| Bone / manila paper | `#E8E0CE` (raised `#F2ECDC`, dimmed `#DCD2B9`) |
| Rules | hairlines `rgba(38,36,31,.16-.30)`, 3px double masthead borders, diagonal-hatch section dividers |

Type: **Oswald** 300-600 condensed grotesque for display headings, big numerals and product names; **Courier Prime** 400/700 (+italic) as the typewriter voice for every label, part code, table datum, annotation and button. Caps restricted to micro stamps at .14-.24em tracking.

## Deliberate departures from AI-generic patterns

- Hero grammar is a manual cover: document-code title block top-left, rotated stamp eyebrow, three-line stacked condensed headline, then an unequal spec/revision strip (224 / 36 / 3 plus interface and currency fields) - no centered headline, no stat trio.
- No icon-card rows anywhere: benefits are numbered vertical margin notes hanging off a double-rule spine with cross-reference leaders; roadmap is a three-step plate sequence with riveted corners, rotated status stamps (solid IN PROGRESS, outlined NEXT, dashed VISION) and honest checklists; partnership is a bordered supplier form sheet with aud-code rows and ruled inputs.
- Comparator is styled as a parts manifest: REF codes, brand micro-caps over Oswald models, right-aligned tabular figures, hookless/hooked as stamped tags, sourcing annotation in small italic.
- Texture comes only from borders and rules: double outlines, dotted leaders, diagonal hatch dividers, corner rivet dots drawn with radial gradients, SVG registration marks. No noise images, no shadows except hard offset print-style blocks on CTAs.
- The only illustration is a hand-drawn currentColor exploded wheelset with part codes REF-WHL-001..004 that rhyme with the manifest's REF-WHL-00x rows.

## Known tradeoffs

- Courier Prime body annotations are wide and low-contrast at small sizes; legibility relies on generous line-height and short measures.
- The extreme paper-on-workbench framing reads more editorial than app-like; converting to production would need a lighter treatment of the dark outer frame.
- Rotated stamps and hard-offset shadows are character devices; over-repetition would get noisy, so they are capped (rotation ≤ 1deg, one shadowed device per zone).
- The manifest shows 5 of 224 entries with mixed vintages of source data (EUR prices only); real deployment needs currency normalization and the 2026-Q2 caveat stays mandatory.
- No JS beyond a checkbox toggle; form submit, filters and sorting are intentionally inert in this mockup.
