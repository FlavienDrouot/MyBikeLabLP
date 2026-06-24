# Landing Page UI Kit

Faithful recreation of the **MyBikeLab landing page**, redesigned against the new system. The committed direction is **Notebook** (editorial, premium-minimal, generous air, brass accents). The **Tweaks panel** (top-right toolbar toggle) now explores two independent axes, **base palette** and **accent**:

| Base palette | Feeling |
|---|---|
| **Paper** | Warm original identity |
| **Mist** (default) | Cool neutral grey, instrument-clean |
| **Porcelain** | Crisp cool near-white, maximum air |

| Accent | Feeling |
|---|---|
| **Brass** (default) | Warm gold |
| **Cobalt** | Cool technical blue |
| **Oxblood** | Muted clay-red |
| **Forest** | Desaturated racing green |

The chosen palette and accent are written to `localStorage` (`mbl-palette`, `mbl-accent`) so the comparator and wheel-detail surfaces inherit them.

**Canonical default: Paper + Brass.** Alternate pairings kept on hand as candidates: **Mist + Cobalt** and **Porcelain + Forest**.

## Sections (mirrors original)

- **Navbar** — sticky, with logo mark + nav links
- **Hero** — value prop, stats trio (15 wheels, 13 axes, 3 phases), primary + secondary CTA
- **Comparator preview** — abbreviated 3-row spec table teaser linking to the full tool
- **Roadmap** — three phases as cards
- **Partnership** — manufacturer / reseller blocks + contact CTA
- **Footer** — copyright + nav

## Files

- `index.html` — entry; loads tokens, components, tweaks
- `App.jsx` — composition
- `Navbar.jsx`, `Hero.jsx`, `Comparator.jsx`, `Roadmap.jsx`, `Partnership.jsx`, `Footer.jsx`
- `landing.css` — landing-specific layout (the design tokens come from `../../colors_and_type.css`)
