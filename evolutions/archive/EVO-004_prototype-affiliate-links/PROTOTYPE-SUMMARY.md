# EVO-004 — Affiliate Links Integration — Prototype Summary

**Date:** 2026-05-26
**Phase:** Prototype (pre-PRD)
**Status:** Done — ready for needs assessment / PRD

---

## Context

MyBikeLab is a frontend-only wheel comparator. The business model relies on affiliate links and brand partnerships, but no implementation existed. This prototype validates the UX pattern before committing to a full spec.

Two partner types need to be served:

| Partner type | Goal |
|---|---|
| Manufacturers / brands | Brand visibility + qualified traffic |
| Marketplaces / retailers | Clicks → tracked sales |

Core constraint: the comparator must remain **neutral**. Perceived neutrality is the foundation of the affiliate model's value.

---

## UX Pattern Validated

**Expandable row (accordion) in the comparison table.**

- Trigger: click anywhere on the row (name cell or chevron at end of row)
- Chevron animates (rotates 180°) to signal state
- Expanded content inserts a full-width panel below the row — no navigation break, table stays visible above
- One row open at a time (opening a new row closes the previous)

---

## Panel Layout (fiche allégée)

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌────────────┐   MANUFACTURER                                  │
│  │            │   Zipp          1 799 €   Buy →                 │
│  │  140×140   │                                                  │
│  │   IMAGE    │   WHERE TO BUY                                   │
│  │  (scroll)  │   ProBikeKit    1 750 €   Buy →                 │
│  │            │   CRC           1 800 €   Buy →                 │
│  └────────────┘                                                  │
└─────────────────────────────────────────────────────────────────┘
```

- **Image zone:** 140×140px fixed square, `object-contain`, `overflow-x-auto` (ready for multiple angles)
- **Manufacturer block:** brand name + optional price + "Buy →" link to official site
- **Where to buy block:** retailer list sorted by price, each with price + "Buy →" link
- **Panel height:** fixed by image (140px + `py-3` padding) — consistent across all rows
- **Content:** `overflow-y-auto` within `max-h-[140px]` — handles up to ~5 links cleanly

### Edge cases handled

| Case | Behaviour |
|---|---|
| Manufacturer + retailers | Both blocks shown, manufacturer above retailers |
| Manufacturer only | Only manufacturer block |
| Retailers only (no manufacturer URL) | Only where-to-buy block |
| No links at all | Single italic message: "No affiliate links available for this wheel." |
| Manufacturer with no direct price | Price omitted, "Buy →" link still shown |

---

## Data Model Changes

Added `affiliateLinks` field to each wheel in `wheelsData.js`. Kept existing `prices[]` array untouched (used by filters/sorts).

```js
affiliateLinks: {
  manufacturer: {
    url: 'https://...',   // string or null
    price_eur: 1799,      // number or null (null = brand link only, no direct sale)
  } | null,
  retailers: [
    { name: 'Wiggle', price_eur: 1299, url: 'https://...' },
    // ...
  ],
}
```

All 15 wheels covered, with deliberate variation across the 4 cases above.

---

## Components

| File | Change |
|---|---|
| `src/data/wheelsData.js` | Added `affiliateLinks` to all 15 wheels |
| `src/components/MiniComparator/WheelDetailPanel.jsx` | New component — renders the expanded panel |
| `src/components/MiniComparator/ComparisonTable.jsx` | Added `expandedId` local state, chevron column, accordion rows |

No changes to Redux, `wheelProperties.jsx`, or any other component.

---

## Open Questions for PRD / Needs Assessment

1. **Image source** — placeholder used throughout. How are real wheel images sourced and stored? (CDN, per-brand uploads, scraping?)
2. **Retailer data** — currently hardcoded mock data. What is the feed format? (affiliate network API, manual CSV, partner webhook?)
3. **Manufacturer price** — is this MSRP, direct sale price, or a reference price? Who maintains it?
4. **Link tracking** — affiliate tracking parameters (UTM, network IDs) are not yet in the URL structure. Where do they get injected?
5. **Disclosure** — "affiliate link" labelling (legal/UX) is deferred. Needs a decision before production.
6. **Max retailers** — no cap enforced. If a wheel has 10+ retailers, the list scrolls. Is a display cap needed?
7. **"No links" policy** — should wheels with no affiliate links still be visible in the comparator? (Currently: yes, panel just shows the empty state message.)
