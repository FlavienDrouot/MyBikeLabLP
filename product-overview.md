# MyBikeLab — Product Overview

## Purpose

MyBikeLab is a web platform that helps road cyclists make better component purchasing decisions through structured data and comparison tools. The product starts with road bike wheels and is designed to grow progressively toward a full bike configurator.

---

## Target Users

Road cyclists who:
- are considering a wheel upgrade and want to compare options objectively
- want to understand the real impact of a component change (weight, aerodynamics, cost)
- are overwhelmed by the number of products and conflicting marketing claims

Primary audience: international, English-speaking, technically curious cyclists.

---

## Problem Being Solved

The current market for bike components offers poor decision support:
- products and specifications are scattered across many sources
- marketing claims are difficult to objectify
- there is no neutral, structured way to compare wheels across brands
- the real gain of an upgrade (weight, aero, price/performance ratio) is hard to quantify before buying

MyBikeLab addresses this by providing a single place with structured, comparable data and filtering tools.

---

## Current Product — MVP v0.1

The current product is a single-page landing site with one interactive feature: a road wheel comparator.

### Landing Page Structure

| Section | Content |
|---|---|
| Hero | Value proposition, key stats (15+ wheels, 13 filter axes), CTAs |
| Wheel Comparator | Main interactive tool — see below |
| Roadmap | 3-phase vision (comparison → simulation → configurator) |
| Benefits | Platform value proposition for cyclists |
| Partnership | Value proposition for brands and retailers |
| Footer | — |

### Wheel Comparator

The comparator lets users browse, filter, sort, and compare road bike wheels side by side.

**What users can do:**
- Filter wheels by multiple criteria simultaneously
- Sort the list by a chosen criterion
- Show or hide columns to focus on what matters to them
- See the minimum available price per wheel across known retailers

**Filterable properties:**

| Property | Filter type |
|---|---|
| Brand | Multi-select |
| Weight | Range (700–2000 g) |
| Price | Range (200–5000 €) |
| Diameter | Multi-select |
| Rim material | Multi-select (Carbon / Aluminum) |
| Hookless | Yes / No / All |
| Rim depth | Range (20–80 mm) |
| Rim width | Range (20–40 mm) |
| Hub brand | Multi-select |
| Hub model | Multi-select |
| Spokes brand | Multi-select |
| Spokes model | Multi-select |
| Spoke material | Multi-select |

**Displayed columns (default visible):** Model/Brand, Weight, Price, Rim material, Hookless, Rim depth, Hub

**Displayed columns (optional):** Diameter, Rim width, Spokes, Spoke material

**Dataset:** ~15 road bike wheels from premium brands (Roval, Zipp, DT Swiss, Fulcrum, etc.), with placeholder images and indicative prices.

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

- **Affiliate links**: each wheel price entry links to a retailer; these links are intended to be affiliate-tracked.
- **Brand partnerships**: brands supply structured product data; in return they get qualified traffic and visibility.
- **Landing page as B2B credibility tool**: the current site is partly designed to support outreach to manufacturers and retailers.

---

## Data Acquisition Strategy

Three sequential phases addressing the cold start problem (small catalog → low value → no partners).

### Phase A — Volume via scraping *(no dependency)*

Scrape public specs and prices from brand websites (Roval, Zipp, DT Swiss, Fulcrum, Shimano, Mavic…) and major retailers (Alltricks, Probikeshop, Canyon, Wiggle). Target: ~150–200 wheels with real specs, current prices, and actual product images.

> **Note — SEO:** Without organic traffic, affiliate clicks will not come on their own. After Phase A, improving SEO (structured data, page titles, wheel-specific landing pages) is a prerequisite for Phase B to generate meaningful results.

> **Note — Architecture:** Scaling from ~15 to ~200 wheels requires a decision on data management. The current inline `wheelsData.js` approach may need to migrate to an external JSON file or a lightweight backend before scraping begins.

### Phase B — Self-service affiliate monetization *(requires: Phase A catalog)*

Sign up for self-service affiliate programs (Awin, Amazon Associates, TradeTracker) and replace direct product links with tracked affiliate links. No partner negotiation required — full control.

### Phase C — Direct partner outreach *(requires: measurable traffic)*

Approach retailer e-commerce managers and premium brands with traffic metrics. Pitch: "Your products are already listed. Affiliate links let you measure and reward the qualified traffic we send." Unlocks better commission rates and direct product data feeds.

### Sequence summary

| Step | Action | Dependency | Output |
|---|---|---|---|
| A | Scraping specs + prices | none | 150+ wheels in catalog |
| A+ | SEO improvements | Phase A catalog | organic traffic |
| B | Self-service affiliate sign-up | existing catalog | active monetization |
| C | Direct partner outreach | measurable traffic | better rates + data feeds |

---

## Current Limitations and Known Gaps

- Dataset is small (~15 wheels) and manually maintained — no backend, no data pipeline
- Prices are indicative only; no real-time sourcing
- Wheel images are placeholders — no actual product photos
- No user accounts, no saved comparisons, no sharing
- No simulation features yet (Phase 2 is not built)
- No real affiliate tracking implemented yet
- No analytics or click tracking in place — required to measure affiliate performance and build the case for direct partnerships (Phase C)

---

## Out of Scope (current version)

- Mountain bikes, gravel, or other bike categories
- Components other than road wheels
- Performance simulation
- Backend, database, or user authentication
- E-commerce or purchasing flows
