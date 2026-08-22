# brutalist-editorial · wave-1 exploration

## Intent

Treat typography as the page's only visual material: a bone-paper broadsheet where Archivo Black headlines, Space Grotesk numerals and exposed hairline column rules do all the work normally delegated to imagery, gradients, or cards. The hero is a left-aligned type poster with the catalog figure 224 embedded as an outlined graphic object cropped by the viewport edge; every section re-stages its content in an editorial genre (spec-sheet excerpt, table of contents with dotted leaders, margin notes, classified ads) instead of SaaS blocks.

## Visual references

- Web brutalism (Balenciaga-school raw borders, exposed grids, inverted hover states)
- Bloomberg Businessweek web features (oversized numerals as data-art, flat acid color discipline)
- It's Nice That / editorial index pages (TOC leaders, folio lines, marginalia)
- Type-poster composition (massive line stacks, cropped glyphs, outline-vs-solid fills)

## Palette + type

| Role | Value |
| --- | --- |
| Paper | `#F2EFE6` bone (deep variant `#E9E4D4`) |
| Ink | `#161512` near-black |
| Accent | `#D8FF3E` acid yellow-green, one accent only: highlight slab on "measured.", live status tag, lightest-weight mark, row-hover price flip, primary button, footer wordmark fill on hover |
| Rules | hairline `rgba(22,21,18,.13)` grid overlay, 2-3px solid ink section borders |

Type: **Archivo Black** display, **Space Grotesk** 500/700 for all oversized numerals and tabular data, **Archivo** 400-700 body. Caps restricted to micro labels/eyebrows at .18-.22em tracking.

## Deliberate departures from AI-generic patterns

- Hero grammar: full-bleed stacked headline with embedded poster numeral, no centered title, no stats trio under it - proof figures sit in an asymmetric ruled ledger of unequal cell widths.
- No icon cards anywhere: roadmap is a contents-page index with dotted leaders and giant phase numerals; benefits are staggered margin notes with hanging digits; partnership is a two-ad classified column beside the intro.
- Data is the decoration: price and weight render larger than surrounding prose; row hover inverts to ink with the price flipping acid.
- Exposed structure: six full-height viewport rules pass through every section; indents snap to whole columns.
- Ticker carries real facts only; annotations are honest italics (sourcing date, pair-weight summation rule).

## Known tradeoffs

- Acid on bone is low-contrast for text, so it is used strictly as a surface (behind ink), never as text color on paper.
- Outline numerals rely on `-webkit-text-stroke`; browsers without it show solid fallback shapes (fill stays transparent, so worst case is invisible decoration, never lost content).
- The fixed grid overlay crosses text at very low alpha by design; readers sensitive to texture may find the comparator densest section busy at small sizes.
- Marquee ticker is motion; disabled under prefers-reduced-motion.
- Full-bleed layout means very wide monitors get long headline measures; scales are clamp-capped but not re-composed per breakpoint beyond 1080px/720px collapses.
