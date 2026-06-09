# MyBikeLab - Product Overview

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
| Wheel Comparator | Main interactive tool - see below |
| Roadmap | High-level product direction (comparison -> simulation -> configurator) |
| Benefits | Platform value proposition for cyclists |
| Partnership | Value proposition for brands and retailers |
| Footer | - |

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
| Wheelset category | Multi-select (aero, climbing, etc.) |
| Diameter | Multi-select |
| Max system weight | Range |
| Rim material | Multi-select (Carbon / Aluminum) |
| Rim depth | Range |
| Tire compatibility | Multi-select (Clincher / Tubeless / Tubular) |
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

Front/rear divergent specs (weight, rim depth, widths) are supported, and several specs are filtered with OR semantics across the front and rear values.

**Displayed columns (default visible):** Image, Model/Brand, Price, Weight, Brake type, Wheelset category, Rim material, Hookless, Hub

**Displayed columns (optional):** Diameter, Max system weight, Tire compatibility, External width, Internal width, Axle, Freehub options, Disc standard, Spokes, Spoke material. Additional specs (bearings, lacing, spoke count, tire pressure/width range, UCI / e-bike approval, warranty, etc.) are surfaced in the per-wheel detail panel.

**Dataset:** ~220 road wheel entries (counting variants) across 18 brands, including Roval, Zipp, Enve, Mavic, Shimano, Caden, Arcaris, EXS, Overfast, Yoeleo, No6, Goosynn, Pertual, Scom, Magene, 9Velo, CRW Works, Farsports. Most entries have real product images and manufacturer-sourced specs and prices. Each product can carry several variants (e.g. freehub or axle options) rendered as distinct rows.

---

## Product Direction

MyBikeLab's product direction is to grow from a road wheel comparator into a measurable component decision platform:

1. **Comparison**: structured spec sheets, filtering, sorting, product detail pages, and trustworthy wheel data.
2. **Acquisition and monetization**: SEO-ready product pages, traffic and outbound-click tracking, affiliate links, and partner-ready reporting.
3. **Partner data quality**: direct outreach to manufacturers and retailers to obtain clean product feeds and better affiliate links.
4. **Simulation**: quantify the effect of component changes through weight delta, aerodynamic estimates, and cost/performance indicators.
5. **Configurator**: build toward a full bike component configurator covering weight, price, compatibility, and performance tradeoffs.

The detailed operational roadmap is maintained as a local planning artifact outside version control.

---

## Business Model

- **Affiliate links**: the data model carries an `affiliateLinks` structure (manufacturer + retailers) per wheel, but today links are almost exclusively non-affiliated manufacturer URLs. No affiliate partnership or tracked link has been acquired yet.
- **Brand partnerships**: brands supply structured product data; in return they get qualified traffic and visibility.
- **Landing page as B2B credibility tool**: the current site is partly designed to support outreach to manufacturers and retailers.

---

## Data Acquisition Strategy

The data strategy addresses the cold start problem: a small catalog has limited value, limited value produces little traffic, and limited traffic makes partner outreach harder.

### Volume via scraping *(largely achieved)*

Scrape public specs and prices from brand websites and retailers to build catalog volume. The original target (~150-200 wheels) is essentially met: ~220 entries across 18 brands have been collected with real specs, prices, and (for most) actual product images.

> **Status caveat:** Data comes from one-shot ("unitary") scraping sessions. There is no automated data pipeline and no price/spec refresh. Figures are a point-in-time snapshot and drift over time.

> **Workflow:** See [`workflows/datascraping/README.md`](../workflows/datascraping/README.md) for the full pipeline (scraping prompt -> JSON -> frontend JS), curation rules, transformation rules, and per-brand progress tracker.

> **Note - SEO:** Without organic traffic, affiliate clicks will not come on their own. Improving SEO (structured data, page titles, wheel-specific landing pages) is a prerequisite for monetization to generate meaningful results.

> **Note - Architecture:** The catalog has already moved from a single inline `wheelsData.js` to one file per brand aggregated at build time. Further scaling or live pricing would still require a decision on external data storage or a lightweight backend.

### Self-service affiliate monetization

Sign up for self-service affiliate programs (Awin, Amazon Associates, TradeTracker) and replace direct product links with tracked affiliate links. No partner negotiation required - full control.

> **Source evaluation - Channel3 product-data API (2026-06-05):** A trial fetch of the Channel3 "Bicycle Wheel Parts" category returned 247 products, but only 2 were road wheel pairs in scope (Industry Nine Solix SL AR25, ICAN Alpha 38/52 Disc Pro); the rest were rims, single wheels, or MTB/BMX/e-bike. Conclusion: this feed is a poor fit for the road-wheel-pairs scope (~0.8% relevant) and not worth a recurring pipeline as-is. The two relevant pairs were curated into the catalog data layer. Awin remains the primary affiliate path to evaluate.

### Direct partner outreach and clean feeds

Approach retailer e-commerce managers and premium brands with traffic metrics. Pitch: "Your products are already listed. Affiliate links let you measure and reward the qualified traffic we send." The goal is to unlock better commission rates, direct product data feeds, and cleaner ongoing price/spec updates.

---

## Current Limitations and Known Gaps

- Data comes from one-shot scraping; there is no automated pipeline, no backend, and no price/spec refresh.
- Prices are sourced once at scraping time; no real-time sourcing.
- A minority of wheels still lack real product images (placeholder fallback).
- No user accounts, no saved comparisons, no sharing.
- No simulation features yet.
- No affiliate link acquired yet; links are mostly non-affiliated manufacturer URLs and no tracking is implemented.
- No analytics or click tracking in place; this is required to measure affiliate performance and build the case for direct partnerships.

---

## Out of Scope (current version)

- Mountain bikes, gravel, or other bike categories
- Components other than road wheels
- Performance simulation
- Backend, database, or user authentication
- E-commerce or purchasing flows
