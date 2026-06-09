import wheelPlaceholderUrl from '../assets/wheel-placeholder.svg';

const ULTRA_URL = 'https://www.scomsports.com/scom-ultra/';
const AEROLITE_URL = 'https://www.scomsports.com/scom-aerolite/';

const FREEHUB_OPTIONS = ['Shimano HG', 'SRAM XDR', 'Campagnolo ED'];

const pandaUrl = (slug) => `https://www.pandapodium.cc/product/${slug}/`;

const HUB_SPECS = {
  bearing_type: 'Enduro',
  bearing_models: [],
  material: null
};

const ultraImages = {
  disc_4545: ['https://www.pandapodium.cc/wp-content/uploads/2023/08/4545.jpg'],
  disc_4967: ['https://www.pandapodium.cc/wp-content/uploads/2023/08/4967.jpg'],
  disc_6767: ['https://www.pandapodium.cc/wp-content/uploads/2023/08/6767.jpg']
};

const aeroliteImages = {
  disc_4545: ['https://www.pandapodium.cc/wp-content/uploads/2023/08/4545DW.jpg'],
  disc_4967: [
  'https://www.pandapodium.cc/wp-content/uploads/2023/08/4967DB.jpg',
  'https://www.pandapodium.cc/wp-content/uploads/2023/08/4967DW.jpg'],

  disc_6767: [
  'https://www.pandapodium.cc/wp-content/uploads/2023/08/6767DB.jpg',
  'https://www.pandapodium.cc/wp-content/uploads/2023/08/6767DW.jpg'],

  rim_4967: [
  'https://www.pandapodium.cc/wp-content/uploads/2023/08/4967RW.jpg',
  'https://www.pandapodium.cc/wp-content/uploads/2023/08/4967RB.jpg']

};

const makeScom = ({
  id,
  model,
  weight_grams,
  brake_type,
  wheelset_category,
  depth_mm,
  externalWidth_mm,
  internalWidth_mm,
  spokes,
  hub,
  priceUsd = null,
  productUrl,
  retailerUrl = null,
  images = [],
  source_note
}) => ({
  id,
  model,
  brand: 'Scom',
  weight_grams,
  diameter_mm: 700,
  brake_type,
  wheelset_category,
  max_system_weight_kg: null,
  rim: {
    material: 'carbon',
    hookless: false,
    depth_mm,
    externalWidth_mm,
    internalWidth_mm,
    tubeless_ready: true, construction: "Zero-coating filament-wound carbon rim", tire_compatibility: ["clincher", "tubeless"]
  },
  spokes,
  hub: {
    ...hub,
    ...HUB_SPECS
  },
  prices: [{ amount: priceUsd, currency: priceUsd ? 'USD' : 'EUR', url: productUrl }],
  weight_tolerance_percent: 3,
  image: images.length ? images[0] : wheelPlaceholderUrl,
  images,
  affiliateLinks: {
    manufacturer: { url: productUrl, amount: priceUsd, currency: priceUsd ? 'USD' : 'EUR' },
    retailers: retailerUrl ? [{ name: 'Panda Podium', amount: priceUsd, currency: priceUsd ? 'USD' : 'EUR', url: retailerUrl }] : []
  },
  other_specs: {
    source_note

  }, warranty: { text: null, years: 5 }
});

const ultraDiscHub = {
  model: 'Disc Brake Hubs',
  brand: 'Scom',
  axle_front_mm: '12x100',
  axle_rear_mm: '12x142',
  freehub_options: FREEHUB_OPTIONS,
  disc_standard: null
};

const ultraRimHub = {
  model: 'Rim Brake Hubs',
  brand: 'Scom',
  axle_front_mm: '9mm QR',
  axle_rear_mm: '9mm QR',
  freehub_options: FREEHUB_OPTIONS,
  disc_standard: null
};

const ultraSpokes = {
  model: 'ST-01',
  brand: 'Scom',
  material: 'carbon'
};

const aeroliteSpokes = {
  model: 'CX-Ray',
  brand: 'Sapim',
  material: 'steel'
};

const aeroliteHub = {
  model: '',
  brand: 'Scom',
  axle_front_mm: null,
  axle_rear_mm: null,
  freehub_options: [],
  disc_standard: null
};

export const scomWheels = [
makeScom({
  id: 245,
  model: 'Ultra 45/45 Disc Brake',
  weight_grams: 1350,
  brake_type: 'disc',
  wheelset_category: 'all-round',
  depth_mm: 45,
  externalWidth_mm: 26,
  internalWidth_mm: 19,
  spokes: ultraSpokes,
  hub: ultraDiscHub,
  priceUsd: 1599,
  productUrl: ULTRA_URL,
  retailerUrl: pandaUrl('scom-ultra-45-45-road-disc-brake-wheelset'),
  images: ultraImages.disc_4545,
  source_note: 'Official SCOM Ultra page; USD price and image cross-checked via Panda Podium.'
}),
makeScom({
  id: 246,
  model: 'Ultra 49/67 Disc Brake',
  weight_grams: 1510,
  brake_type: 'disc',
  wheelset_category: 'aero',
  depth_mm: { front: 49, rear: 67 },
  externalWidth_mm: 28,
  internalWidth_mm: 21,
  spokes: ultraSpokes,
  hub: ultraDiscHub,
  priceUsd: 1599,
  productUrl: ULTRA_URL,
  retailerUrl: pandaUrl('scom-ultra-49-67-road-disc-brake-wheelset'),
  images: ultraImages.disc_4967,
  source_note: 'Official SCOM Ultra page; USD price and image cross-checked via Panda Podium.'
}),
makeScom({
  id: 247,
  model: 'Ultra 67/67 Disc Brake',
  weight_grams: 1540,
  brake_type: 'disc',
  wheelset_category: 'aero',
  depth_mm: 67,
  externalWidth_mm: 28,
  internalWidth_mm: 21,
  spokes: ultraSpokes,
  hub: ultraDiscHub,
  priceUsd: 1599,
  productUrl: ULTRA_URL,
  retailerUrl: pandaUrl('scom-ultra-67-67-road-disc-brake-wheelset'),
  images: ultraImages.disc_6767,
  source_note: 'Official SCOM Ultra page; USD price and image cross-checked via Panda Podium.'
}),
makeScom({
  id: 248,
  model: 'Ultra 45/45 Rim Brake',
  weight_grams: 1280,
  brake_type: 'rim',
  wheelset_category: 'climbing',
  depth_mm: 45,
  externalWidth_mm: 26,
  internalWidth_mm: 19,
  spokes: ultraSpokes,
  hub: ultraRimHub,
  productUrl: ULTRA_URL,
  source_note: 'Official SCOM Ultra page; public price not published.'
}),
makeScom({
  id: 249,
  model: 'Ultra 49/67 Rim Brake',
  weight_grams: 1440,
  brake_type: 'rim',
  wheelset_category: 'aero',
  depth_mm: { front: 49, rear: 67 },
  externalWidth_mm: 28,
  internalWidth_mm: 21,
  spokes: ultraSpokes,
  hub: ultraRimHub,
  productUrl: ULTRA_URL,
  source_note: 'Official SCOM Ultra page; public price not published.'
}),
makeScom({
  id: 250,
  model: 'Ultra 67/67 Rim Brake',
  weight_grams: 1480,
  brake_type: 'rim',
  wheelset_category: 'aero',
  depth_mm: 67,
  externalWidth_mm: 28,
  internalWidth_mm: 21,
  spokes: ultraSpokes,
  hub: ultraRimHub,
  productUrl: ULTRA_URL,
  source_note: 'Official SCOM Ultra page; public price not published.'
}),
makeScom({
  id: 251,
  model: 'Aerolite 45/45 Disc Brake',
  weight_grams: 1420,
  brake_type: 'disc',
  wheelset_category: 'all-round',
  depth_mm: 45,
  externalWidth_mm: 26,
  internalWidth_mm: 19,
  spokes: aeroliteSpokes,
  hub: aeroliteHub,
  priceUsd: 1299,
  productUrl: AEROLITE_URL,
  retailerUrl: pandaUrl('scom-aerolite-45-45-road-disc-brake-wheelset'),
  images: aeroliteImages.disc_4545,
  source_note: 'Official SCOM Aerolite page says Coming soon; specs, price and image are from Panda Podium.'
}),
makeScom({
  id: 252,
  model: 'Aerolite 49/67 Disc Brake',
  weight_grams: 1590,
  brake_type: 'disc',
  wheelset_category: 'aero',
  depth_mm: { front: 49, rear: 67 },
  externalWidth_mm: 28,
  internalWidth_mm: 21,
  spokes: aeroliteSpokes,
  hub: aeroliteHub,
  priceUsd: 1299,
  productUrl: AEROLITE_URL,
  retailerUrl: pandaUrl('scom-aerolite-49-67-road-disc-brake-wheelset'),
  images: aeroliteImages.disc_4967,
  source_note: 'Official SCOM Aerolite page says Coming soon; specs, price and image are from Panda Podium.'
}),
makeScom({
  id: 253,
  model: 'Aerolite 67/67 Disc Brake',
  weight_grams: 1620,
  brake_type: 'disc',
  wheelset_category: 'aero',
  depth_mm: 67,
  externalWidth_mm: 28,
  internalWidth_mm: 21,
  spokes: aeroliteSpokes,
  hub: aeroliteHub,
  priceUsd: 1299,
  productUrl: AEROLITE_URL,
  retailerUrl: pandaUrl('scom-aerolite-67-67-road-disc-brake-wheelset'),
  images: aeroliteImages.disc_6767,
  source_note: 'Official SCOM Aerolite page says Coming soon; specs, price and image are from Panda Podium.'
}),
makeScom({
  id: 254,
  model: 'Aerolite 49/67 Rim Brake',
  weight_grams: 1530,
  brake_type: 'rim',
  wheelset_category: 'aero',
  depth_mm: { front: 49, rear: 67 },
  externalWidth_mm: 28,
  internalWidth_mm: 21,
  spokes: aeroliteSpokes,
  hub: aeroliteHub,
  priceUsd: 1299,
  productUrl: AEROLITE_URL,
  retailerUrl: pandaUrl('scom-aerolite-49-67-road-rim-brake-wheelset'),
  images: aeroliteImages.rim_4967,
  source_note: 'Official SCOM Aerolite page says Coming soon; specs, price and image are from Panda Podium.'
})];