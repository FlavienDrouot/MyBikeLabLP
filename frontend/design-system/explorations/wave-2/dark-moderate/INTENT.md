# Wave 2 candidate - dark-moderate

## Intent

The same structural equation as a premium light console, expressed on moderate
dark surfaces: mid-dark charcoal zones separated by real relief (panel steps,
hairlines, recessed wells), a restrained grotesk identity, and one cool sky
accent used only where it carries state or meaning. The page is a calm product
UI in the register of Linear's dark mode and Vercel's dashboard, never a
cockpit instrument: no phosphor, no terminal costume, no near-black.

## References

- Linear (dark mode quality: surface steps + hairline discipline)
- Vercel dashboard (calm, near-white primary button on dark)
- PNS premium restraint transposed to data via type/spacing/surface (per taste profile)
- Rejected predecessor: night-instrument (#0C0E10 + amber) - explicitly avoided

## Palette

| Token | Value | Role |
|---|---|---|
| Page | #23272E | base |
| Panel | #2C313A | raised sections (ledger, comparator panel, partnership band) |
| Elevated | #353B46 | contact card inside panel band |
| Well | #252A31 | recessed table/filter surfaces inside panels |
| Text | #E8EBEF / #9AA3AF / #7E8794 | primary / secondary / muted |
| Hairline | #414855 (strong #525B69) | all separation |
| Accent | #6CA0D6 soft sky | hero italic word, live status pill, timeline node + active span, USD asterisk, focus |

## Type

- Schibsted Grotesk (400-700 + italic): everything textual. Hierarchy through
  weight and spacing; hero sits at 34-46px, not display scale.
- Fragment Mono (400): every numeral (ledger values, price/weight cells,
  sort state). Quiet, Helvetica-flavored, tabular by nature.
- Caps micro labels (0.15em) only for informative labels: eyebrow, stat
  labels, table headers, phase tags, form labels.

## How it satisfies taste equation v2

1. Premium restraint, zero costume: no counters, tickers, stamps, role-play.
   Every label names real content.
2. Separated zones with moderate relief: page -> panel -> well/elevated steps,
   each with hairline + subtle lift/inset shadows; perceptible in a screenshot.
3. Moderate density, overview first: hero + ledger + full 5-row comparator fit
   at 1280x800 with minimal scrolling; roadmap reads as one strip.
4. Wide-screen use: two-zone hero (copy | stats register), full-width table,
   3-column benefits and timeline, 2-zone partnership (pitch | form).
5. Accents punctual: single cool sky accent, semantic uses only; primary CTA
   stays neutral near-white; no amber/orange/red anywhere.
6. Visuals: none; typography, spacing and surface treatment carry the mood.

Validated structural ideas carried over: roadmap as horizontal timeline strip
(rail + nodes + lit active span), stats as aligned ledger/register rows,
benefits as clean columns without filler labels, large brand moment confined
to the footer where it encroaches on nothing.

## Tradeoffs

- All-caps micro labels appear in several places (headers, tags); kept because
  each one names real content, but they are the densest device on the page.
- Hookless column repeats its header vocabulary ("Hookless"/"Hooked" values);
  chosen to match the product's badge wording over terse Yes/No.
- Mavic model shown as "Cosmic SLR 45 Disc": source data stores an uppercase
  variant string ("COSMIC SLR 45 DISC 23mm"); normalized casing for the
  sentence-case table, value unchanged otherwise.
- ENVE and EXS prices stay in USD from source data; flagged once with a shared
  asterisk note rather than per-cell stamps to avoid clutter.
- Timeline "active span" fades are solid color, not progress data: it marks the
  span belonging to Phase 1, an interpretive reading of "In progress".
- Google Fonts requires network on file:// open; fallback stacks degrade
  gracefully offline.
