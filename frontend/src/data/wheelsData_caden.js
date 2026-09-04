
const FREEHUB_OPTIONS = ['Shimano HG', 'Campagnolo ED', 'SRAM XD', 'SRAM XDR'];

const IMG = {
  d35: 'https://carbonbikewheels.com.au/cdn/images/2024%20images/35mm%20Tubeless%20Profile%20Newest-1000x1000.jpg',
  d45: 'https://carbonbikewheels.com.au/cdn/images/2024%20images/45mm%20Tubeless%20Profile%20Newest-1000x1000.jpg',
  d50: 'https://carbonbikewheels.com.au/cdn/images/2025%20Images/Caden%20Tiles%20(50mm)%20Feb%202025-1000x1000.png',
  d60: 'https://carbonbikewheels.com.au/cdn/images/2025%20Images/Caden%20Tiles%20(60mm)%20Feb%202025-01-1000x1000.png',
  cda55: 'https://carbonbikewheels.com.au/cdn/images/2026%20Images/55_cda_200by200_website-1000x1000.png',
  cda65: 'https://carbonbikewheels.com.au/cdn/images/2026%20Images/65mm%202026%20Profile-1000x1000.png',
  d75: 'https://carbonbikewheels.com.au/cdn/images/2025%20Images/Caden%20Tiles%20(75mm)-01-1000x1000.jpg',
  d105: 'https://carbonbikewheels.com.au/cdn/images/2026%20Images/105mm%20profile%202026-1000x1000.jpg'
};

const baseHubSpecs = {
  bearing_type: 'ABEC 5 stainless steel cartridge',
  bearing_models: [],
  material: 'forged aluminium T7075'
};

const baseOtherSpecs = {
  discount_pct: 35,
  shipping: 'free worldwide'
};

const makeCadenWheel = ({
  id,
  model,
  weight_grams,
  wheelset_category,
  rim,
  spokes,
  hubModel = 'deCADENce CENTRIST',
  priceEur,
  url,
  variant,
  imageUrl,
  other_specs = {}
}) => ({
  id,
  model,
  brand: 'Caden',
  weight_grams,
  diameter_mm: 700,
  brake_type: 'disc',
  wheelset_category,
  max_system_weight_kg: 120,
  rim: {
    material: 'carbon',
    construction: 'UCI-approved high-temperature mould, High TG heat-resistant resin, reinforced nipple bed, formed (enveloped) rim hook',
    hookless: false,
    ...rim,
    tire_compatibility: rim.tire_compatibility ?? ['clincher', 'tubeless'],
    tubeless_ready: (rim.tire_compatibility ?? ['clincher', 'tubeless']).includes('tubeless')
  },
  spokes,
  hub: {
    model: hubModel,
    brand: 'Caden',
    axle_front_mm: null,
    axle_rear_mm: null,
    freehub_options: FREEHUB_OPTIONS,
    disc_standard: null,
    ...baseHubSpecs
  },
  prices: Number.isFinite(priceEur) ? [{ amount: priceEur, currency: 'EUR', url }] : [],
  image: imageUrl || null,
  images: imageUrl ? [imageUrl] : [],
  affiliateLinks: {
    manufacturer: { url, amount: Number.isFinite(priceEur) ? priceEur : null, currency: 'EUR' },
    retailers: []
  },
  ...(variant ? { variant } : {}),
  other_specs: {
    ...baseOtherSpecs,
    ...other_specs
  }
});

const steelSpokes = {
  model: 'Aero straight-pull',
  brand: 'Caden',
  material: 'steel',
  count: { front: 16, rear: 21 },
  nipple: 'SAPIM Secure Lock external',
  type: 'straight-pull',
  profile: 'aero'
};

const carbonSpokes = {
  model: 'Captured carbon straight-pull',
  brand: 'Caden',
  material: 'carbon',
  count: { front: 16, rear: 21 },
  nipple: 'SAPIM Secure Lock external',
  type: 'straight-pull',
  profile: 'aero'
};

const standardOtherSpecs = {
  brake_note: 'Disc brake only, no rim brake model'
};

const carbonSpokeOtherSpecs = {
  brake_note: 'Disc brake only, no rim brake model',
  captured_spoke_safety_note: 'Custom captured-spoke carbon hub (not open flange) for added safety'
};

export const cadenWheels = [
makeCadenWheel({
  id: 129,
  model: 'deCADENce 35mm Tubeless',
  weight_grams: 1140,
  wheelset_category: 'all-round',
  rim: { depth_mm: 35, externalWidth_mm: 32.8, internalWidth_mm: 24.5 },
  spokes: steelSpokes,
  priceEur: 1445.00,
  url: 'https://carbonbikewheels.com.au/eu/product/35mm-carbon-tubeless-wheelset',
  variant: 'steel_spokes',
  imageUrl: IMG.d35,
  other_specs: { ...standardOtherSpecs, price_before_discount_eur: 2223.00 }
}),
makeCadenWheel({
  id: 200,
  model: 'deCADENce 35mm Tubeless',
  weight_grams: 1030,
  wheelset_category: 'all-round',
  rim: { depth_mm: 35, externalWidth_mm: 32.8, internalWidth_mm: 24.5 },
  spokes: carbonSpokes,
  hubModel: 'deCADENce CENTRIST ratchet drive',
  priceEur: 1686.00,
  url: 'https://carbonbikewheels.com.au/eu/product/35mm-carbon-tubeless-wheelset',
  variant: 'carbon_spokes',
  imageUrl: IMG.d35,
  other_specs: { ...carbonSpokeOtherSpecs, price_before_discount_eur: 2594.00 }
}),
makeCadenWheel({
  id: 130,
  model: 'deCADENce 45mm Tubeless',
  weight_grams: 1215,
  wheelset_category: 'all-round',
  rim: { depth_mm: 45, externalWidth_mm: 34, internalWidth_mm: 24.5 },
  spokes: steelSpokes,
  priceEur: 1455.00,
  url: 'https://carbonbikewheels.com.au/eu/product/45mm-carbon-tubeless-wheelset',
  variant: 'steel_spokes',
  imageUrl: IMG.d45,
  other_specs: { ...standardOtherSpecs, usage: 'road and gravel', price_before_discount_eur: 2238.00 }
}),
makeCadenWheel({
  id: 201,
  model: 'deCADENce 45mm Tubeless',
  weight_grams: 1120,
  wheelset_category: 'all-round',
  rim: { depth_mm: 45, externalWidth_mm: 34, internalWidth_mm: 24.5 },
  spokes: carbonSpokes,
  hubModel: 'deCADENce CENTRIST ratchet drive',
  priceEur: 1696.00,
  url: 'https://carbonbikewheels.com.au/eu/product/45mm-carbon-tubeless-wheelset',
  variant: 'carbon_spokes',
  imageUrl: IMG.d45,
  other_specs: { ...carbonSpokeOtherSpecs, usage: 'road and gravel', price_before_discount_eur: 2609.00 }
}),
makeCadenWheel({
  id: 131,
  model: 'deCADENce 50mm Tubeless',
  weight_grams: 1270,
  wheelset_category: 'all-round',
  rim: { depth_mm: 50, externalWidth_mm: 34, internalWidth_mm: 25 },
  spokes: steelSpokes,
  priceEur: 1459.00,
  url: 'https://carbonbikewheels.com.au/eu/product/50mm-carbon-tubeless-wheelset',
  variant: 'external_34mm',
  imageUrl: IMG.d50,
  other_specs: { ...standardOtherSpecs, usage: 'road and gravel', price_before_discount_eur: 2244.00 }
}),
makeCadenWheel({
  id: 202,
  model: 'deCADENce 50mm Tubeless',
  weight_grams: 1310,
  wheelset_category: 'all-round',
  rim: { depth_mm: 50, externalWidth_mm: 37, internalWidth_mm: null },
  spokes: steelSpokes,
  priceEur: 1459.00,
  url: 'https://carbonbikewheels.com.au/eu/product/50mm-carbon-tubeless-wheelset',
  variant: 'external_37mm',
  imageUrl: IMG.d50,
  other_specs: { ...standardOtherSpecs, usage: 'road and gravel', price_before_discount_eur: 2244.00 }
}),
makeCadenWheel({
  id: 203,
  model: 'deCADENce 50mm Tubeless',
  weight_grams: 1370,
  wheelset_category: 'all-round',
  rim: { depth_mm: 50, externalWidth_mm: 40, internalWidth_mm: null },
  spokes: steelSpokes,
  priceEur: 1459.00,
  url: 'https://carbonbikewheels.com.au/eu/product/50mm-carbon-tubeless-wheelset',
  variant: 'external_40mm',
  imageUrl: IMG.d50,
  other_specs: { ...standardOtherSpecs, usage: 'road and gravel', price_before_discount_eur: 2244.00 }
}),
makeCadenWheel({
  id: 132,
  model: 'deCADENce 60mm Tubeless',
  weight_grams: 1360,
  wheelset_category: 'aero',
  rim: { depth_mm: 60, externalWidth_mm: 34.2, internalWidth_mm: 25 },
  spokes: steelSpokes,
  priceEur: 1468.00,
  url: 'https://carbonbikewheels.com.au/eu/product/60mm-carbon-tubeless-wheelset',
  variant: 'steel_spokes',
  imageUrl: IMG.d60,
  other_specs: { ...standardOtherSpecs, price_before_discount_eur: 2259.00 }
}),
makeCadenWheel({
  id: 204,
  model: 'deCADENce 60mm Tubeless',
  weight_grams: 1285,
  wheelset_category: 'aero',
  rim: { depth_mm: 60, externalWidth_mm: 34.2, internalWidth_mm: 25 },
  spokes: carbonSpokes,
  hubModel: 'deCADENce CENTRIST ratchet drive',
  priceEur: 1710.00,
  url: 'https://carbonbikewheels.com.au/eu/product/60mm-carbon-tubeless-wheelset',
  variant: 'carbon_spokes',
  imageUrl: IMG.d60,
  other_specs: { ...carbonSpokeOtherSpecs, price_before_discount_eur: 2630.00 }
}),
makeCadenWheel({
  id: 133,
  model: 'deCADENce CDA 55mm Tubeless',
  weight_grams: 1265,
  wheelset_category: 'aero',
  rim: { depth_mm: 55, externalWidth_mm: 34.2, internalWidth_mm: 25.2 },
  spokes: steelSpokes,
  hubModel: 'deCADENce CENTRIST ratchet drive',
  priceEur: 1606.00,
  url: 'https://carbonbikewheels.com.au/eu/product/60mm-carbon-spoke-tubeless-wheelset',
  variant: 'steel_spokes',
  imageUrl: IMG.cda55,
  other_specs: {
    ...standardOtherSpecs,
    model_line: 'deCADENce premium CDA',
    availability_note: 'approx. 4 weeks back order',
    price_before_discount_eur: 2471.00
  }
}),
makeCadenWheel({
  id: 206,
  model: 'deCADENce CDA 55mm Tubeless',
  weight_grams: 1205,
  wheelset_category: 'aero',
  rim: { depth_mm: 55, externalWidth_mm: 34.2, internalWidth_mm: 25.2 },
  spokes: carbonSpokes,
  hubModel: 'deCADENce CENTRIST ratchet drive',
  priceEur: 1848.00,
  url: 'https://carbonbikewheels.com.au/eu/product/60mm-carbon-spoke-tubeless-wheelset',
  variant: 'carbon_spokes',
  imageUrl: IMG.cda55,
  other_specs: {
    ...carbonSpokeOtherSpecs,
    model_line: 'deCADENce premium CDA',
    availability_note: 'approx. 4 weeks back order',
    price_before_discount_eur: 2843.00
  }
}),
makeCadenWheel({
  id: 134,
  model: 'deCADENce CDA 65mm Tubeless',
  weight_grams: 1330,
  wheelset_category: 'aero',
  rim: { depth_mm: 65, externalWidth_mm: 34.4, internalWidth_mm: 25.2 },
  spokes: steelSpokes,
  hubModel: 'deCADENce CENTRIST ratchet drive',
  priceEur: 1613.00,
  url: 'https://carbonbikewheels.com.au/eu/product/65mm-carbon-spoke-tubeless-wheelset',
  variant: 'steel_spokes',
  imageUrl: IMG.cda65,
  other_specs: {
    ...standardOtherSpecs,
    model_line: 'deCADENce premium CDA',
    availability_note: 'approx. 4 weeks back order',
    price_before_discount_eur: 2482.00
  }
}),
makeCadenWheel({
  id: 207,
  model: 'deCADENce CDA 65mm Tubeless',
  weight_grams: 1270,
  wheelset_category: 'aero',
  rim: { depth_mm: 65, externalWidth_mm: 34.4, internalWidth_mm: 25.2 },
  spokes: carbonSpokes,
  hubModel: 'deCADENce CENTRIST ratchet drive',
  priceEur: 1855.00,
  url: 'https://carbonbikewheels.com.au/eu/product/65mm-carbon-spoke-tubeless-wheelset',
  variant: 'carbon_spokes',
  imageUrl: IMG.cda65,
  other_specs: {
    ...carbonSpokeOtherSpecs,
    model_line: 'deCADENce premium CDA',
    availability_note: 'approx. 4 weeks back order',
    price_before_discount_eur: 2853.00
  }
}),
makeCadenWheel({
  id: 135,
  model: 'deCADENce 75mm Tubeless',
  weight_grams: 1520,
  wheelset_category: 'aero',
  rim: { depth_mm: 75, externalWidth_mm: 33.6, internalWidth_mm: 24.4 },
  spokes: steelSpokes,
  priceEur: 1475.00,
  url: 'https://carbonbikewheels.com.au/eu/product/75mm-carbon-tubeless-wheelset',
  imageUrl: IMG.d75,
  other_specs: { ...standardOtherSpecs, price_before_discount_eur: 2270.00 }
}),
makeCadenWheel({
  id: 136,
  model: 'deCADENce 105mm Tubeless',
  weight_grams: { front: 810, rear: 905 },
  wheelset_category: 'aero',
  rim: { depth_mm: 105, externalWidth_mm: 37.5, internalWidth_mm: 25 },
  spokes: steelSpokes,
  priceEur: 1835.00,
  url: 'https://carbonbikewheels.com.au/eu/product/105mm-tubeless-wheelset',
  imageUrl: IMG.d105,
  other_specs: {
    ...standardOtherSpecs,
    weight_pair_grams: 1715,
    usage: 'time trial / triathlon (listed in road/tubeless category)',
    price_before_discount_eur: 2824.00
  }
})];
