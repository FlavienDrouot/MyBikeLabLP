
const FREEHUB_OPTIONS = ['Shimano HG', 'Shimano Micro Spline', 'SRAM XDR', 'Campagnolo N3W'];

const baseOtherSpecs = {
  engagement_ratchet: 'Vapor 45T'
};

const makeNo6Wheel = ({
  id,
  model,
  url,
  image,
  images,
  priceUsd = 2199,
  weight_grams,
  wheelset_category,
  max_system_weight_kg = 110,
  depth_mm,
  externalWidth_mm,
  internalWidth_mm,
  carbon_spoke_diameter_mm,
  hub_model = 'Zero Gravity v.3',
  freehub_options = FREEHUB_OPTIONS,
  hubBearingType = 'Tripeak Ceramic',
  engagement_ratchet = 'Vapor 45T',
  spokeCountFront = 16,
  spokeCountRear = 20,
  recommended_tire_size_c = '28-30 aero optimized; compatible with 28-35'
}) => ({
  id,
  model,
  brand: 'NO.6',
  variant: null,
  weight_grams,
  diameter_mm: 700,
  brake_type: 'disc',
  wheelset_category,
  max_system_weight_kg,
  rim: {
    material: 'carbon',
    construction: 'Toray T700/T800 carbon, UD glossy paintless finish',
    hookless: false,
    depth_mm,
    externalWidth_mm,
    internalWidth_mm,
    tubeless_ready: true,
    max_tire_pressure: { psi: 110, bar: 7.6, note: null },
    tire_compatibility: ['clincher', 'tubeless'],
    tire_width_mm: recommended_tire_size_c === 'Minimum 28' ? { min: 28, max: null } : { min: 28, max: 35 }
  },
  spokes: {
    model: `Carbon aero spoke ${carbon_spoke_diameter_mm}`,
    brand: 'NO.6',
    material: 'carbon',
    count: { front: spokeCountFront, rear: spokeCountRear },
    nipple: 'Aerotitanium Alloy'
  },
  hub: {
    model: hub_model,
    brand: 'NO.6',
    axle_front_mm: '12x100',
    axle_rear_mm: '12x142',
    freehub_options,
    disc_standard: 'Center Lock', bearing_type:










    hubBearingType, bearing_models: [], material: null }, prices: [{ amount: priceUsd, currency: 'USD', url }], image: image ?? null, images, affiliateLinks: { manufacturer: { url, amount: priceUsd, currency: 'USD' }, retailers: [] }, certification: { uci: true, astm: null, ebike: null }, other_specs: { ...baseOtherSpecs,
    engagement_ratchet,


  }
});

export const no6Wheels = [
makeNo6Wheel({
  id: 222,
  model: '28/28 Superlight Climb',
  url: 'https://www.no6.racing/products/28-28',
  image:
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/No6-Wheels-ProjectSpeed-28-Single-Wheel.jpg?v=1773836083',
  images: [
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/No6-Wheels-ProjectSpeed-28-Single-Wheel.jpg?v=1773836083',
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/No6-Wheels-ProjectSpeed-28-28.jpg?v=1773836083',
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/No-6-ProjectSpeed-Carbon-Cycling-Racing-Wheels-28-28-Duo.jpg?v=1773836083'],

  weight_grams: 1043,
  wheelset_category: 'climbing',
  depth_mm: 28,
  externalWidth_mm: 32,
  internalWidth_mm: 24,
  carbon_spoke_diameter_mm: '3.8mm'
}),
makeNo6Wheel({
  id: 231,
  model: '30/30 Superlight Climb',
  url: 'https://www.no6.racing/products/30-30-superlight-climb',
  images: [],
  priceUsd: 1580,
  weight_grams: 1098,
  wheelset_category: 'climbing',
  max_system_weight_kg: 120,
  depth_mm: 30,
  externalWidth_mm: 30,
  internalWidth_mm: 24,
  carbon_spoke_diameter_mm: '3.8mm',
  hub_model: 'Zero Gravity v.2',
  freehub_options: ['Shimano HG', 'SRAM XDR', 'Campagnolo N3W'],
  hubBearingType: 'Enduro steel',
  engagement_ratchet: '36T Ratchet',
  spokeCountFront: 20,
  spokeCountRear: 20,
  recommended_tire_size_c: 'Minimum 28'
}),
makeNo6Wheel({
  id: 223,
  model: '42/48 Superlight All Round',
  url: 'https://www.no6.racing/products/42-48',
  image:
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/No6-Wheels-ProjectSpeed-48-Single-Wheel.jpg?v=1773835705',
  images: [
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/No6-Wheels-ProjectSpeed-48-Single-Wheel.jpg?v=1773835705',
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/No6-Wheels-ProjectSpeed-42-48.jpg?v=1773835705',
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/No-6-ProjectSpeed-Carbon-Cycling-Racing-Wheels-42-48-Duo.jpg?v=1773835705'],

  weight_grams: 1146,
  wheelset_category: 'all-round',
  depth_mm: { front: 42, rear: 48 },
  externalWidth_mm: { front: 33, rear: 31 },
  internalWidth_mm: { front: 26, rear: 24 },
  carbon_spoke_diameter_mm: '3.8mm'
}),
makeNo6Wheel({
  id: 232,
  model: '45/50 Superlight All Round',
  url: 'https://www.no6.racing/products/45-50-superlight-all-round',
  image:
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/011265b610.webp?v=1753184486',
  images: [
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/011265b610.webp?v=1753184486',
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/5a3584b581.webp?v=1762830928',
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/c74e8e5f24.webp?v=1753184486'],

  priceUsd: 1580,
  weight_grams: 1260,
  wheelset_category: 'all-round',
  max_system_weight_kg: 120,
  depth_mm: { front: 45, rear: 50 },
  externalWidth_mm: { front: 34.4, rear: 31.5 },
  internalWidth_mm: { front: 28, rear: 24 },
  carbon_spoke_diameter_mm: '3.8mm',
  hub_model: 'Zero Gravity v.2',
  freehub_options: ['Shimano HG', 'SRAM XDR', 'Campagnolo N3W'],
  hubBearingType: 'Enduro steel',
  engagement_ratchet: '36T Ratchet',
  spokeCountFront: 20,
  spokeCountRear: 20,
  recommended_tire_size_c: 'Minimum 28'
}),
makeNo6Wheel({
  id: 233,
  model: '50/58 Superlight Aero',
  url: 'https://www.no6.racing/products/50-58-superlight-aero-1',
  image:
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/c40d6f82cf.webp?v=1753198698',
  images: [
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/c40d6f82cf.webp?v=1753198698',
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/cb1a8c8475.webp?v=1753198698',
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/2f5a812264.webp?v=1753198698'],

  priceUsd: 1580,
  weight_grams: 1280,
  wheelset_category: 'aero',
  depth_mm: { front: 50, rear: 58 },
  externalWidth_mm: 31.5,
  internalWidth_mm: 24,
  carbon_spoke_diameter_mm: '5.0mm',
  hub_model: 'Zero Gravity v.2',
  freehub_options: ['Shimano HG', 'SRAM XDR', 'Campagnolo N3W'],
  hubBearingType: 'Enduro steel',
  engagement_ratchet: '36T Ratchet',
  spokeCountFront: 20,
  spokeCountRear: 20
}),
makeNo6Wheel({
  id: 224,
  model: '52/58 Superlight Aero',
  url: 'https://www.no6.racing/products/52-58',
  image:
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/No6-Wheels-ProjectSpeed-58-Single-Wheel.jpg?v=1773836202',
  images: [
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/No6-Wheels-ProjectSpeed-58-Single-Wheel.jpg?v=1773836202',
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/No6-Wheels-ProjectSpeed-52-58.jpg?v=1773836202',
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/No-6-ProjectSpeed-Carbon-Cycling-Racing-Wheels-52-58-Duo.jpg?v=1773836202'],

  weight_grams: 1267,
  wheelset_category: 'aero',
  depth_mm: { front: 52, rear: 58 },
  externalWidth_mm: { front: 32, rear: 30 },
  internalWidth_mm: { front: 25, rear: 24 },
  carbon_spoke_diameter_mm: '3.8/5.0mm'
}),
makeNo6Wheel({
  id: 225,
  model: '58/65 Superlight Aero+',
  url: 'https://www.no6.racing/products/58-65-superlight',
  image:
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/No6-Wheels-ProjectSpeed-65-Single-Wheel.jpg?v=1773835225',
  images: [
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/No6-Wheels-ProjectSpeed-65-Single-Wheel.jpg?v=1773835225',
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/No6-Wheels-ProjectSpeed-58-65.jpg?v=1773835225',
  'https://cdn.shopify.com/s/files/1/0949/6202/4783/files/No-6-ProjectSpeed-Carbon-Cycling-Racing-Wheels-58-65-Duo.jpg?v=1773835225'],

  weight_grams: 1349,
  wheelset_category: 'aero',
  depth_mm: { front: 58, rear: 65 },
  externalWidth_mm: 31,
  internalWidth_mm: 24,
  carbon_spoke_diameter_mm: '3.8/5.0mm'
})];
