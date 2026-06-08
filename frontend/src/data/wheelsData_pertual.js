import wheelPlaceholderUrl from '../assets/wheel-placeholder.svg';

const PRODUCT_BASE = 'https://tavelo.cc/products/';

const urls = {
  acme: `${PRODUCT_BASE}pertual-sharp-adv-47-58-disc`,
  sharpAdv4758: `${PRODUCT_BASE}pertual-sharp-adv-47-58-disc-1`,
  sharpPro3641: `${PRODUCT_BASE}pertual-sharp-pro-36-41-disc`,
  sharpPro4758: `${PRODUCT_BASE}pertual-sharp-pro-47-58-disc`,
  sharpPro6270: `${PRODUCT_BASE}pertual-sharp-pro-62-70-disc`,
  sharp3641: `${PRODUCT_BASE}pertual-sharp-36-41`,
  sharp5258Rim: `${PRODUCT_BASE}pertual-sharp-52-58-rim-brake`,
  sharp5258Disc: `${PRODUCT_BASE}pertual-sharp-52-58`,
  sharp6270: `${PRODUCT_BASE}pertual-sharp-62-70`,
  speed47: `${PRODUCT_BASE}pertual-speed-47-disc-brake`
};

const pandaUrls = {
  sharp4758: 'https://www.pandapodium.cc/product/pertual-sharp-47-58-disc-brake-wheelset/',
  acme: 'https://www.pandapodium.cc/product/pertual-acme-45-62-road-disc-brake-wheelset/',
  sharp5258Rim: 'https://www.pandapodium.cc/product/pertual-sharp-52-58-rim-brake-wheelset/',
  sharp6270: 'https://www.pandapodium.cc/product/pertual-sharp-62-70-disc-brake-wheelset/',
  sharp3641: 'https://www.pandapodium.cc/product/pertual-sharp-36-41-disc-brake-wheelset/'
};

const pandaImages = {
  sharp4758: [
  'https://www.pandapodium.cc/wp-content/uploads/2024/05/1-1.png',
  'https://www.pandapodium.cc/wp-content/uploads/2024/05/2-3.png',
  'https://www.pandapodium.cc/wp-content/uploads/2024/05/3-2.png',
  'https://www.pandapodium.cc/wp-content/uploads/2024/05/4-2.png'],

  acme: [
  'https://www.pandapodium.cc/wp-content/uploads/2025/07/1.png',
  'https://www.pandapodium.cc/wp-content/uploads/2025/07/2.png',
  'https://www.pandapodium.cc/wp-content/uploads/2025/07/3.png',
  'https://www.pandapodium.cc/wp-content/uploads/2025/07/4.png'],

  sharp5258Rim: [
  'https://www.pandapodium.cc/wp-content/uploads/2024/06/5258-rim-brake-1.jpg',
  'https://www.pandapodium.cc/wp-content/uploads/2024/06/5258-rim-brake-2.jpg'],

  sharp6270: [
  'https://www.pandapodium.cc/wp-content/uploads/2024/05/shar6270_main.jpg',
  'https://www.pandapodium.cc/wp-content/uploads/2024/05/sharp6270_02-copy.png'],

  sharp3641: [
  'https://www.pandapodium.cc/wp-content/uploads/2024/05/sharp_3641_main-copy.jpg',
  'https://www.pandapodium.cc/wp-content/uploads/2024/05/sharp3641_02-copy.png']

};

const baseWheel = ({
  id,
  model,
  variant = null,
  weight,
  brakeType = 'disc',
  category,
  rim,
  spokes,
  hub,
  url,
  priceUsd,
  images = [],
  retailers = [],
  otherSpecs = {}
}) => ({
  id,
  model,
  brand: 'PERTUAL',
  ...(variant ? { variant } : {}),
  weight_grams: weight,
  diameter_mm: 700,
  brake_type: brakeType,
  wheelset_category: category,
  max_system_weight_kg: null,
  rim: {
    material: 'carbon',
    hookless: false,
    tubeless_ready: true,
    ...rim
  },
  spokes,
  hub: {
    axle_front_mm: null,
    axle_rear_mm: null,
    freehub_options: ['Shimano HG', 'SRAM XDR', 'Campagnolo N3W'],
    disc_standard: brakeType === 'disc' ? null : null,
    ...hub, bearing_type:










    'Ceramic' }, prices: [{ amount: priceUsd, currency: 'USD', url }], image: images[0] || wheelPlaceholderUrl, images, affiliateLinks: { manufacturer: { url, amount: priceUsd, currency: 'USD' }, retailers }, other_specs: { tire_compatibility: 'Clincher/Tubeless',
    ...otherSpecs
  }
});

export const pertualWheels = [
baseWheel({
  id: 234,
  model: 'ACME 45/62 Disc Brake Wheelset',
  weight: 1190,
  category: 'aero',
  rim: { depth_mm: { front: 45, rear: 62 }, externalWidth_mm: 31, internalWidth_mm: 23 },
  spokes: { model: 'Integrated Carbon Spoke', brand: 'PERTUAL', material: 'carbon', count: { front: 16, rear: 16 } },
  hub: { model: 'Premium Road Disc', brand: 'PERTUAL' },
  url: urls.acme,
  priceUsd: 2000,
  images: pandaImages.acme,
  retailers: [{ name: 'Panda Podium', amount: null, currency: 'EUR', url: pandaUrls.acme }],
  otherSpecs: {
    bearing_upgrade_option: 'CeramicSpeed'

  }
}),
baseWheel({
  id: 235,
  model: 'Sharp 36/41 Disc Brake Wheelset',
  variant: 'steel_spokes',
  weight: 1295,
  category: 'all-round',
  rim: { depth_mm: { front: 36, rear: 41 }, externalWidth_mm: 28, internalWidth_mm: 21 },
  spokes: { model: '', brand: 'Sapim', material: 'steel', count: { front: 21, rear: 21 } },
  hub: { model: 'Premium Road Disc', brand: 'PERTUAL' },
  url: urls.sharpPro3641,
  priceUsd: 1000,
  otherSpecs: {}
}),
baseWheel({
  id: 236,
  model: 'Sharp 36/41 Disc Brake Wheelset',
  variant: 'carbon_spokes',
  weight: 1280,
  category: 'all-round',
  rim: { depth_mm: { front: 36, rear: 41 }, externalWidth_mm: 28, internalWidth_mm: 21 },
  spokes: { model: 'Carbon Spoke', brand: 'PERTUAL', material: 'carbon', count: { front: 21, rear: 21 } },
  hub: { model: 'Premium Road Disc', brand: 'PERTUAL' },
  url: urls.sharp3641,
  priceUsd: 1300,
  images: pandaImages.sharp3641,
  retailers: [{ name: 'Panda Podium', amount: null, currency: 'EUR', url: pandaUrls.sharp3641 }],
  otherSpecs: {}
}),
baseWheel({
  id: 237,
  model: 'Sharp 47/58 Disc Brake Wheelset',
  variant: 'steel_spokes',
  weight: 1335,
  category: 'all-round',
  rim: {
    depth_mm: { front: 47, rear: 58 },
    externalWidth_mm: { front: 31, rear: 28 },
    internalWidth_mm: { front: 23, rear: 22 }
  },
  spokes: { model: '', brand: 'Sapim', material: 'steel', count: { front: 21, rear: 21 } },
  hub: { model: 'Premium Road Disc', brand: 'PERTUAL' },
  url: urls.sharpPro4758,
  priceUsd: 1000,
  otherSpecs: {
    wave_depth_mm: { front: '47/53', rear: '52/58' }

  }
}),
baseWheel({
  id: 238,
  model: 'Sharp 47/58 Disc Brake Wheelset',
  variant: 'carbon_spokes',
  weight: 1245,
  category: 'all-round',
  rim: {
    depth_mm: { front: 47, rear: 58 },
    externalWidth_mm: { front: 31, rear: 28 },
    internalWidth_mm: { front: 23, rear: 22 }
  },
  spokes: { model: 'Integrated Carbon Spoke', brand: 'PERTUAL', material: 'carbon', count: { front: 21, rear: 21 } },
  hub: { model: 'Premium Road Disc', brand: 'PERTUAL' },
  url: urls.sharpAdv4758,
  priceUsd: 1600,
  images: pandaImages.sharp4758,
  retailers: [{ name: 'Panda Podium', amount: null, currency: 'EUR', url: pandaUrls.sharp4758 }],
  otherSpecs: {
    wave_depth_mm: { front: '47/53', rear: '52/58' }

  }
}),
baseWheel({
  id: 239,
  model: 'Sharp 52/58 Rim Brake Wheelset',
  weight: 1440,
  brakeType: 'rim',
  category: 'aero',
  rim: { depth_mm: { front: 52, rear: 58 }, externalWidth_mm: 28, internalWidth_mm: 21 },
  spokes: { model: 'Carbon Spoke', brand: 'PERTUAL', material: 'carbon', count: { front: 18, rear: 21 } },
  hub: { model: 'Premium Road Rim', brand: 'PERTUAL', disc_standard: null },
  url: urls.sharp5258Rim,
  priceUsd: 1350,
  images: pandaImages.sharp5258Rim,
  retailers: [{ name: 'Panda Podium', amount: null, currency: 'EUR', url: pandaUrls.sharp5258Rim }],
  otherSpecs: {}
}),
baseWheel({
  id: 240,
  model: 'Sharp 52/58 Disc Brake Wheelset',
  weight: 1380,
  category: 'aero',
  rim: { depth_mm: { front: 52, rear: 58 }, externalWidth_mm: 28, internalWidth_mm: 21 },
  spokes: { model: 'Carbon Spoke', brand: 'PERTUAL', material: 'carbon', count: { front: 21, rear: 21 } },
  hub: { model: 'Premium Road Disc', brand: 'PERTUAL' },
  url: urls.sharp5258Disc,
  priceUsd: 1350,
  otherSpecs: {}
}),
baseWheel({
  id: 241,
  model: 'Sharp 62/70 Disc Brake Wheelset',
  variant: 'steel_spokes',
  weight: 1475,
  category: 'aero',
  rim: { depth_mm: { front: 62, rear: 70 }, externalWidth_mm: 30, internalWidth_mm: 23 },
  spokes: { model: '', brand: 'Sapim', material: 'steel', count: { front: 21, rear: 21 } },
  hub: { model: 'Premium Road Disc', brand: 'PERTUAL' },
  url: urls.sharpPro6270,
  priceUsd: 1000,
  otherSpecs: {}
}),
baseWheel({
  id: 242,
  model: 'Sharp 62/70 Disc Brake Wheelset',
  variant: 'carbon_spokes',
  weight: 1480,
  category: 'aero',
  rim: { depth_mm: { front: 62, rear: 70 }, externalWidth_mm: 30, internalWidth_mm: 21 },
  spokes: { model: 'Carbon Spoke', brand: 'PERTUAL', material: 'carbon', count: { front: 21, rear: 21 } },
  hub: { model: 'Premium Road Disc', brand: 'PERTUAL' },
  url: urls.sharp6270,
  priceUsd: 1500,
  images: pandaImages.sharp6270,
  retailers: [{ name: 'Panda Podium', amount: null, currency: 'EUR', url: pandaUrls.sharp6270 }],
  otherSpecs: {}
}),
baseWheel({
  id: 243,
  model: 'Speed 47 Disc Brake Wheelset',
  weight: 1430,
  category: 'all-round',
  rim: { depth_mm: 47, externalWidth_mm: 28, internalWidth_mm: 22.5 },
  spokes: { model: '', brand: '', material: 'steel', count: { front: 24, rear: 24 } },
  hub: { model: 'Classic Road Disc', brand: 'PERTUAL' },
  url: urls.speed47,
  priceUsd: 800,
  otherSpecs: {
    hubBearingType: 'Steel'

  }
})];