# MyBikeLab — Product Overview

## Purpose

MyBikeLab is a web platform that helps road cyclists make better component purchasing decisions through structured data and comparison tools. The product starts with road bike wheels and is designed to grow progressively toward a full bike configurator.

---

## Target Users

Road cyclists who:
- are considering a wheel upgrade and want to compare options objectively
- want to understand the real impact of a component change (weight, aerodynamics, cost)
- are overwhelmed by the number of products and conflicting marketing claims

Primary audience: international, technically curious cyclists. The interface is bilingual (English / French).

---

## Problem Being Solved

The current market for bike components offers poor decision support:
- products and specifications are scattered across many sources
- marketing claims are difficult to objectify
- there is no neutral, structured way to compare wheels across brands
- the real gain of an upgrade (weight, aero, price/performance ratio) is hard to quantify before buying

MyBikeLab addresses this by providing a single place with structured, comparable data and filtering tools.

---

## Current Product

The current product is a single-page landing site built on a shared design system, with one fully developed interactive feature: a road wheel comparator backed by a ~220-entry catalog and a per-wheel detail panel. It is bilingual (EN / FR) and supports multi-currency price display.

### Landing Page Structure

| Section | Content |
|---|---|
| Hero | Value proposition, key stats (200+ wheels, 20 filter axes), CTAs |
| Wheel Comparator | Main interactive tool — see below |
| Roadmap | 3-phase vision (comparison → simulation → configurator) |
| Benefits | Platform value proposition for cyclists |
| Partnership | Value proposition for brands and retailers |
| Footer | — |

### Wheel Comparator

The comparator lets users browse, filter, sort, and compare road bike wheels side by side, and open a detail panel for any wheel.

**What users can do:**
- Filter wheels by multiple criteria simultaneously (20 filter axes)
- Sort the list by a chosen criterion
- Show or hide columns to focus on what matters to them
- Open a per-wheel detail panel with the full spec sheet
- See the minimum available price per wheel, converted to the selected display currency
- Switch interface language (EN / FR) and display currency

**Filterable properties (20 axes):**

| Property | Filter type |
|---|---|
| Brand | Multi-select |
| Price | Range |
| Weight | Range |
| Brake type | Multi-select (Disc / Rim) |
| Wheelset category | Multi-select (aero, climbing, …) |
| Diameter | Multi-select |
| Max system weight | Range |
| Rim material | Multi-select (Carbon / Aluminum) |
| Rim depth | Range |
| Tubeless ready | Yes / No / All |
| Hookless | Yes / No / All |
| External width | Range |
| Internal width | Range |
| Hub brand | Multi-select |
| Hub model | Multi-select |
| Freehub options | Multi-select (flat) |
| Disc standard | Multi-select |
| Spokes brand | Multi-select |
| Spokes model | Multi-select |
| Spoke material | Multi-select |

Front/rear divergent specs (weight, rim depth, widths) are supported, and several specs are filtered with OR-semantics across the front and rear values.

**Displayed columns (default visible):** Image, Model/Brand, Price, Weight, Brake type, Wheelset category, Rim material, Tubeless, Hookless, Hub

**Displayed columns (optional):** Diameter, Max system weight, External width, Internal width, Axle, Freehub options, Disc standard, Spokes, Spoke material. Additional specs (bearings, lacing, spoke count, tire pressure/width range, UCI / e-bike approval, warranty, …) are surfaced in the per-wheel detail panel.

**Dataset:** ~220 road wheel entries (counting variants) across 18 brands — including Roval, Zipp, Enve, Mavic, Shimano, Caden, Arcaris, EXS, Overfast, Yoeleo, No6, Goosynn, Pertual, Scom, Magene, 9Velo, CRW Works, Farsports. Most entries have real product images and manufacturer-sourced specs and prices. Each product can carry several **variants** (e.g. freehub or axle options) rendered as distinct rows.

---

## Product Roadmap

### Phase 1 — Components Comparison *(current)*
Structured spec sheets and side-by-side comparison, starting with road wheels. Planned extensions: drivetrains, brakes, tires.

### Phase 2 — Impact Simulator *(next)*
Quantify the effect of a component change: weight delta, aerodynamic gain, cost-per-watt. Help users understand what they actually gain before buying.

### Phase 3 — Full Bike Configurator *(vision)*
Build a complete bike component by component, simulate different setups, compare total weight/price/performance, then buy through affiliate links.

---

## Business Model

- **Affiliate links**: the data model carries an `affiliateLinks` structure (manufacturer + retailers) per wheel, but today links are almost exclusively non-affiliated manufacturer URLs — no affiliate partnership or tracked link has been acquired yet.
- **Brand partnerships**: brands supply structured product data; in return they get qualified traffic and visibility.
- **Landing page as B2B credibility tool**: the current site is partly designed to support outreach to manufacturers and retailers.

---

## Data Acquisition Strategy

Three sequential phases addressing the cold start problem (small catalog → low value → no partners).

### Phase A — Volume via scraping *(largely achieved)*

Scrape public specs and prices from brand websites and retailers to build catalog volume. The original target (~150–200 wheels) is essentially met: ~220 entries across 18 brands have been collected with real specs, prices, and (for most) actual product images.

> **Status caveat:** Data comes from one-shot ("unitary") scraping sessions — there is **no automated data pipeline and no price/spec refresh**. Figures are a point-in-time snapshot and drift over time.

> **Workflow:** See [`workflows/datascraping/README.md`](../workflows/datascraping/README.md) for the full pipeline (scraping prompt → JSON → frontend JS), curation rules, transformation rules, and per-brand progress tracker.

> **Note — SEO:** Without organic traffic, affiliate clicks will not come on their own. Improving SEO (structured data, page titles, wheel-specific landing pages) is a prerequisite for Phase B to generate meaningful results.

> **Note — Architecture:** The catalog has already moved from a single inline `wheelsData.js` to one file per brand aggregated at build time. Further scaling or live pricing would still require a decision on external data storage or a lightweight backend.

### Phase B — Self-service affiliate monetization *(requires: Phase A catalog)*

Sign up for self-service affiliate programs (Awin, Amazon Associates, TradeTracker) and replace direct product links with tracked affiliate links. No partner negotiation required — full control.

### Phase C — Direct partner outreach *(requires: measurable traffic)*

Approach retailer e-commerce managers and premium brands with traffic metrics. Pitch: "Your products are already listed. Affiliate links let you measure and reward the qualified traffic we send." Unlocks better commission rates and direct product data feeds.

### Sequence summary

| Step | Action | Dependency | Output | Status |
|---|---|---|---|---|
| A | Scraping specs + prices | none | 150+ wheels in catalog | ~220 entries collected (no auto-refresh) |
| A+ | SEO improvements | Phase A catalog | organic traffic | Not started |
| B | Self-service affiliate sign-up | existing catalog | active monetization | Not started — no affiliate link yet |
| C | Direct partner outreach | measurable traffic | better rates + data feeds | Not started |

---

## Current Limitations and Known Gaps

- Data comes from one-shot scraping — no automated pipeline, no backend, no price/spec refresh (point-in-time snapshot)
- Prices are sourced once at scraping time; no real-time sourcing
- A minority of wheels still lack real product images (placeholder fallback)
- No user accounts, no saved comparisons, no sharing
- No simulation features yet (Phase 2 is not built)
- No affiliate link acquired yet — links are mostly non-affiliated manufacturer URLs; no tracking implemented
- No analytics or click tracking in place — required to measure affiliate performance and build the case for direct partnerships (Phase C)

---

## Out of Scope (current version)

- Mountain bikes, gravel, or other bike categories
- Components other than road wheels
- Performance simulation
- Backend, database, or user authentication
- E-commerce or purchasing flows
