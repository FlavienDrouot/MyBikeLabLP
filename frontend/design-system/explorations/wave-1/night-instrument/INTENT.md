# night-instrument · wave 1 candidate

## Intent

Present MyBikeLab as a precision instrument rather than a marketing site: a dark,
layered near-black console where every number reads like a live measurement and
every section behaves like a panel of a flight deck. Typography does the
branding: mono numerals everywhere, hairline structure instead of cards, one
phosphor amber accent reserved for values that matter (reference row, active
phase, deltas toward lighter/cheaper).

## Visual references

- Bloomberg terminal information density and readout grammar
- Porsche cockpit UI: aligned gauge clusters, restrained single accent
- Teenage Engineering OP-1 dark mode: flat panels, micro labels, functional charm
- Flight-deck MFDs / test-bench software: tick rulers, registration marks,
  status glyphs (▲▼●○), channel indices

## Palette + type

- Surfaces: #0C0E10 base, #12151A panels, #171B21 hover; hairlines #2A2F36
  (+ dimmer #1D2127 internal rules); no shadows, no blur, zero border radius.
- Text: #E8EAED high / #9BA3AD mid / #5F6873 dim.
- Single accent: instrument amber #FFB000 (chosen over radar green).
- Type: IBM Plex Mono for all numerals, data, labels and UI (identity font);
  Schibsted Grotesk for prose and headlines.

## Deliberate departures from AI-generic patterns

- Hero is an instrument panel: system readout top-left with status line and
  blinking cursor; stats are an aligned three-gauge cluster on a right rail,
  each with tick ruler and unit label. No centered headline over a stat trio.
- Comparator teaser is a data console: row indices №01…№05, reference row with
  amber inset marker, Δ price and Δ weight columns vs №01, column hairlines,
  console status bar ("SORT WEIGHT ASC ▲ / FILTERS NONE ACTIVE").
- Roadmap is a mission-phase sequencer: shared tick-rail with progress fill to
  PH-01, node glyphs ●/○/◌, phase columns as checklist registers.
- Benefits are full-width capability register rows (B-01…B-03) with right-aligned
  state readouts, not icon cards.
- Partnership is a transmission console: channels CH-A/CH-B plus a TX.CONSOLE
  form rack with mono fields and amber focus.
- Registration crosses at section corners, vertical ruler rail on the page edge,
  horizontal tick rulers under gauges and section heads.
- Honest annotations: "* indicative price, sourced 2026-Q2 · shown in source
  currency", "n/a" where currencies differ.

## Known tradeoffs

- Extreme density and small type sizes trade warmth and approachability for
  authority; the amber-on-near-black voice may feel austere to casual buyers.
- IBM Plex Mono at 12.5px keeps the 11-column table legible but caps comfortable
  reading length; below ~1120px the table scrolls horizontally by design.
- The mixed source currency in the teaser ($2,850 Enve) is real data but adds a
  footnote; production would convert via the platform's currency switcher.
- Blinking cursor and hover states hint at "live" behavior the static mockup
  cannot honor; all controls are non-functional by intent.
