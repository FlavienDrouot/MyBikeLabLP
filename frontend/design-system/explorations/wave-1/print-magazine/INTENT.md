# print-magazine · wave 1 candidate

## Intent

Treat the MyBikeLab landing page as the front page of a cycling print magazine: a masthead with dateline rule, a lead story whose deck carries the platform stats as figures, and every section re-imagined as a page of the paper. The wager is that structured component data is inherently editorial, so the strongest possible frame for it is newsprint typography rather than product-marketing layout.

## Visual references

- Rouleur and old L'Équipe broadsheets: racing coverage as serious print.
- The New Yorker's grid discipline; Monocle's typographic restraint.
- Heritage race programs and technical catalogues (fine-line schematic spot art).

## Palette and type

- Paper cream #F5F0E4, recessed band #ECE5D2, warm ink #211D14, hairlines in translucent ink. Racing red #C8102E appears only on micro labels, the live-phase tag, the lead table row marker, annotations of emphasis, and one red valve stem in Fig. 1.
- Fraunces (optical-size serif) for wordmark, headlines, pull quotes and model names; Newsreader (screen-news serif) for body, decks, captions and labels. All-caps letterspaced micro labels for folios only. Tabular lining numerals in the spec sheet.

## Editorial grammar

- Folio bar, masthead ears ("224 wheels on record"), scotch rule, dateline band ("Issue № 01 · 2026").
- Lead story: headline block spanning columns, deck beneath with stats woven into prose, byline rule with CTAs set as print buttons, three-column article with column rules, drop cap, pull quote from real copy ("No marketing fluff, just numbers you can cross-check").
- Fig. 1: inline-SVG line-art wheel (rings, crosshair, JS-generated radial spokes, leader-line annotations) captioned like magazine art.
- Comparator teaser styled as a printed results sheet: № index column, hairline row rules, tabular figures, first row highlighted, honest italic annotation "* Indicative prices, sourced 2026-Q2".
- Roadmap serialized as "In this issue" features with hanging numerals and status tags; benefits recast as an "Editor's notes" margin rail plus a correction box.
- Partnership section set as classifieds: two bordered notices and a dashed "reply coupon" form.

## Deliberate departures from AI-generic patterns

- No centered hero with stats trio, no icon-card rows anywhere, no dark inverse CTA band.
- Stats never appear as cards; they are bold figures inside running text and folio markers.
- Zero border radius, zero shadows, zero gradients, zero blur; hierarchy comes from rules (3px scotch to hairline), whitespace and type scale alone.
- Identity fonts avoid Inter/JetBrains Mono by design; numerals stay serif with tabular figures instead of switching to a mono face.
- Imagery is one drawn schematic, not stock photography or 3D renders.

## Known tradeoffs

- Justified three-column body text needs hyphenation and tight copy discipline; at narrow widths it collapses to fewer columns and loses some broadsheet drama.
- Cream-on-ink contrast ratios for micro labels sit near accessibility minimums; production would need a darker ink for 10px caps text.
- The newspaper conceit favors reading over scanning; conversion-focused users may find CTAs quieter than in a conventional SaaS layout.
- Fraunces and Newsreader load from Google Fonts, so first paint offline falls back to Georgia.
