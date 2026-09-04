
/**
 * Road wheel pairs surfaced by the Channel3 fetch (scripts/fetch-channel3.js).
 *
 * Context: the Channel3 "Bicycle Wheel Parts" feed returned 247 products, but
 * only TWO were genuine road-bike wheel *pairs* in scope for MyBikeLab. The
 * other ~245 entries were rims, single (front/rear) wheels, or MTB/BMX/fat/
 * e-bike products. These two entries are kept here, separate from the
 * hand-curated per-brand catalog files, until validated for integration.
 *
 * Specs are manufacturer-sourced (official Industry Nine / ICAN pages),
 * cross-checked against the Channel3 record. Prices are the live Channel3
 * affiliate-candidate offers (USD) captured on 2026-06-05 — point-in-time.
 *
 * Wired into the catalog aggregator (wheelsData.js) on 2026-06-05.
 */

export const channel3Wheels = [
// ---------------------------------------------------------------------------
// Industry Nine — Solix SL AR25 (alloy, shallow all-road)
// ---------------------------------------------------------------------------
{
  id: 90001,
  model: 'Solix SL AR25',
  brand: 'Industry Nine',
  weight_grams: 1520, // official I9 page; some retailers list 1470g
  diameter_mm: 700,
  brake_type: 'disc',
  wheelset_category: 'all-round',
  max_system_weight_kg: 113, // 250 lb rider weight limit
  rim: {
    material: 'aluminum',
    hookless: false, // bead hook for added tire security
    depth_mm: 25,
    externalWidth_mm: 25,
    internalWidth_mm: 21.5,
    tubeless_ready: true, tire_compatibility: ["clincher", "tubeless"]
  },
  spokes: {
    model: 'CX-Ray',
    brand: 'Sapim',
    material: 'steel' // straight-pull, bladed
    , count: { front: 24, rear: 24 } },
  hub: {
    model: 'Solix SL',
    brand: 'Industry Nine',
    axle_front_mm: '12x100',
    axle_rear_mm: '12x142',
    freehub_options: ['SRAM XDR'], // Channel3 offer is XDR; other bodies available from I9
    disc_standard: 'Center Lock', engagement: { type: null, points: 605 }
  },
  prices: [{ amount: 1265, currency: 'USD', url: 'https://garagecycles.cc/products/industry-nine-solix-sl-ar25-700c-disc-wheels' }],
  image: 'https://cdn.shopify.com/s/files/1/0685/5147/5487/files/industry-nine-solix-sl-ar25-700c-disc-wheels-6851786.jpg?v=1751668842',
  images: ['https://cdn.shopify.com/s/files/1/0685/5147/5487/files/industry-nine-solix-sl-ar25-700c-disc-wheels-6851786.jpg?v=1751668842'],
  affiliateLinks: {
    manufacturer: { url: 'https://industrynine.com/wheels/road/solix-sl-ar25', amount: null, currency: 'USD' },
    retailers: [{ name: 'Garage Cycles', amount: 1265, currency: 'USD', url: 'https://garagecycles.cc/products/industry-nine-solix-sl-ar25-700c-disc-wheels' }]
  },
  other_specs: {
    source_note: 'Specs from official Industry Nine Solix SL AR25 page (1520g, 25mm depth, 21.5mm internal, 25-55mm tire range); USD price/image from Channel3 offer (Garage Cycles), captured 2026-06-05. Some retailers list 1470g.'




  }, warranty: { text: null, years: 2 }
},

// ---------------------------------------------------------------------------
// ICAN — Alpha 38/52 Disc Pro (carbon, mixed-depth aero)
// ---------------------------------------------------------------------------
{
  id: 90002,
  model: 'Alpha 38/52 Disc Pro',
  brand: 'ICAN',
  weight_grams: 1480, // ±20g per Channel3/ICAN for 38mm build; mixed 38/52 build slightly higher
  diameter_mm: 700,
  brake_type: 'disc',
  wheelset_category: 'aero',
  max_system_weight_kg: 110,
  rim: {
    material: 'carbon',
    hookless: false,
    depth_mm: { front: 38, rear: 52 },
    externalWidth_mm: { front: 27.3, rear: 30 },
    internalWidth_mm: 21,
    tubeless_ready: true, tire_compatibility: ["clincher", "tubeless"]
  },
  spokes: {
    model: 'SA1423',
    brand: 'Pillar',
    material: 'steel', count: { front: 24, rear: 24 }, lacing: { front: "2-cross", rear: "2-cross" }
  },
  hub: {
    model: 'D21',
    brand: 'ICAN',
    axle_front_mm: '12x100',
    axle_rear_mm: '12x142',
    freehub_options: ['Shimano HG', 'SRAM XDR', 'Shimano Micro Spline'],
    disc_standard: 'Center Lock'
  },
  prices: [{ amount: 580, currency: 'USD', url: 'https://icancycling.com/products/alpha-38-52-disc-pro-us' }],
  image: null,
  images: [],
  affiliateLinks: {
    manufacturer: { url: 'https://icancycling.com/products/alpha-38-52-disc-pro-us', amount: 580, currency: 'USD' },
    retailers: []
  },
  other_specs: {
    source_note: 'Specs from official ICAN Alpha Disc Pro pages (Toray T700/T800, 21mm internal, D21 hub 6-pawl/72 engagements, Pillar SA1423 24/24, Center Lock, 12x100/142) cross-checked with Channel3 record; USD price from Channel3 offer (icancycling.com), captured 2026-06-05. Depth is mixed 38mm front / 52mm rear; external widths approximate (38mm rim ~27.3mm, 52mm rim ~30mm). No clean manufacturer image captured — placeholder used.',
    construction: 'Carbon Fiber Toray T700 & T800',
    pawls: 6,
    engagements: 72




  }, warranty: { text: null, years: 2 }
}];