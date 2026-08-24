# Wave 1 - Five contrasted directions for the landing

Five deliberately differentiated landing mockups, produced to map taste
preferences and run the first elimination round. Each candidate is a single
self-contained `index.html` (embedded CSS, Google Fonts CDN) opening directly
via `file://`, desktop-first at 1280px. All content is real product content
(real copy, real wheel data, sourced prices).

## How to review

Open each folder's `index.html` in a browser (or serve this directory).
For each candidate, fill one row of the verdict grid below with:

- **Reaction**: keep / mixed / eliminate (gut call is fine)
- **Liked**: anything that resonates (typography, grammar, density, color, mood)
- **Disliked**: anything that jars
- **Notes**: free form

Reactions to rejected candidates are equally valuable: they feed the taste
profile used to brief the next wave.

## Candidates

| Folder | Direction | One-line intent |
|---|---|---|
| `brutalist-editorial/` | Brutalist editorial | Bone paper broadsheet poster: Archivo Black display, exposed six-column grid, acid highlight, oversized outlined figures |
| `night-instrument/` | Dark precision instrument | Amber-on-near-black data console: mono numerals everywhere, gauge-cluster hero, delta columns vs reference row |
| `print-magazine/` | Cycling print magazine | Cream broadsheet front page: masthead and dateline, serif display, drop cap, pull quote, Fig. 1 schematic, classifieds B2B |
| `workshop-manual/` | Workshop technical manual | Manila sheet pinned to a dark workbench: title block, exploded-view SVG with REF codes, riveted phase plates, supplier enquiry form |
| `swiss-data/` | Swiss international style | One grotesk, strict modular grid, off-white plus one red: flush-left poster hero, statistical table, footnote benefits |

Each folder carries an `INTENT.md` describing intent, references, palette and
type choices, deliberate departures from AI-generic patterns, and tradeoffs.

## Verdicts

Fill after browser review:

| Candidate | Reaction | Liked | Disliked | Notes |
|---|---|---|---|---|
| brutalist-editorial | Eliminate | Key figures ledger presentation | Overloaded; systematic left alignment odd on wide screens; ticker band; "№ XX" labels add nothing; selected-row contrast too strong | |
| night-instrument | Eliminate | Closer than brutalist | Too dark even for dark mode; far too many ornaments (pseudo-technical micro-labels meaningless) | |
| print-magazine | Eliminate | More sober than previous candidates | Newspaper role-play aspect; still overloaded | |
| workshop-manual | Eliminate | Benefits and roadmap presentations (without filler labels); exploded-view idea showing component detail | Role-play devices bring attention-grabbing ornament text (doc numbers, margin notes, note 0X); paper+orange too close to cream+bronze, an LLM-classic scheme; illustration looked aesthetic-only until analyzed | |
| swiss-data | Mixed (best of wave) | Sober, airy; roadmap timeline presentation; giant footer wordmark (does not encroach on useful content) | Hero title too big; not different enough from current design | |

Full taste synthesis lives in [`../TASTE-PROFILE.md`](../TASTE-PROFILE.md).
