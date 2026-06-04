import wheelPlaceholderUrl from '../assets/wheel-placeholder.svg';

const urls = {
  ultra: 'https://www.magene.com/en/exar/191-exar-carbon-fiber-wheelset-ultra-series-2025.html',
  ultraDark: 'https://www.magene.com/en/exar/116-exar-carbon-fiber-wheelset-ultradark-series-2024.html',
  pro: 'https://www.magene.com/en/exar/192-exar-carbon-fiber-wheelset-pro-series-2025.html',
};

const freehubOptions = ['Shimano HG', 'Campagnolo N3W', 'SRAM XDR'];

const makeLinks = (url, priceUsd) => ({
  prices: [{ price_eur: null, url }],
  image: wheelPlaceholderUrl,
  images: [],
  affiliateLinks: {
    manufacturer: { url, price_eur: null },
    retailers: [],
  },
  other_specs: {
    price_usd: priceUsd,
  },
});

const ultraShared = {
  brand: 'Magene',
  model: 'EXAR Carbon Fiber Wheelset Ultra Series',
  diameter_mm: 700,
  brake_type: 'disc',
  max_system_weight_kg: null,
  rim: {
    material: 'carbon',
    hookless: false,
    internalWidth_mm: 23,
    tubeless_ready: true,
  },
  spokes: {
    model: 'HI-MOD carbon fiber',
    brand: 'VONOA',
    material: 'carbon',
  },
  hub: {
    model: 'EXAR 36T ratchet',
    brand: 'Magene',
    axle_front_mm: '12x100',
    axle_rear_mm: '12x142',
    freehub_options: freehubOptions,
    disc_standard: null,
  },
};

const ultraOtherSpecs = {
  bearing_type: 'Ceramic',
  spoke_count_front: 21,
  spoke_count_rear: 21,
  front_wheel_spoke_lacing: '21H 2:1, brake side x2, non-brake side radial lacing',
  rear_wheel_spoke_lacing: '21H 2:1, drive side x2, brake side radial lacing',
  front_wheel_spoke_tension: '110kgf +/-10%',
  rear_wheel_spoke_tension: 'Drive side 130kgf +/-10%, non-drive side 110kgf +/-10%',
  ratchet: '36T, compatible with DT system; replaceable with different tooth count',
  tire_compatibility: 'Clincher/tubeless',
  compatible_tire_width: '25c and above; suggested 28c-32c',
  maximum_tire_pressure:
    'Clincher: 110psi for 28c, 100psi for 30c, 90psi for 32c; tubeless: 100psi for 28c, 90psi for 30c, 80psi for 32c',
  package_standard:
    'Carbon fiber front wheel x1, carbon fiber rear wheel x1, tubeless rim tape x2, rim plug x50, tubeless tire valve x2, manual x1',
  source_note: 'Official Magene EXAR Ultra 2025 product page.',
};

const ultraDarkOtherSpecs = {
  ...ultraOtherSpecs,
  bearing_type: 'Steel',
  source_note: 'Official Magene EXAR UltraDark 2024 product page.',
};

const makeUltra = ({ id, model, variant, weight, category, depth, externalWidth, source, otherSpecs }) => ({
  ...ultraShared,
  id,
  model: model ?? ultraShared.model,
  variant,
  weight_grams: weight,
  wheelset_category: category,
  rim: {
    ...ultraShared.rim,
    depth_mm: depth,
    externalWidth_mm: externalWidth,
  },
  ...makeLinks(source.url, source.priceUsd),
  other_specs: {
    ...makeLinks(source.url, source.priceUsd).other_specs,
    ...otherSpecs,
  },
});

const proShared = {
  brand: 'Magene',
  model: 'EXAR Carbon Fiber Wheelset Pro Series',
  diameter_mm: 700,
  max_system_weight_kg: null,
  rim: {
    material: 'carbon',
    hookless: false,
    tubeless_ready: true,
  },
  spokes: {
    model: 'Wing21',
    brand: 'Pillar',
    material: 'stainless_steel',
  },
  hub: {
    model: 'EXAR 36T ratchet',
    brand: 'Magene',
    freehub_options: freehubOptions,
    disc_standard: null,
  },
};

const proOtherSpecs = {
  bearing_type: '',
  ratchet: '36T, compatible with DT system; replaceable with different tooth count',
  rear_wheel_spoke_tension:
    'Rim brake: drive side 120kgf +/-10%, non-drive side 100kgf +/-10%; disc brake: drive side 120kgf +/-10%, non-drive side 110kgf +/-10%',
  tire_compatibility: 'Clincher/tubeless',
  compatible_tire_width: '25c and above; suggested 28c-32c',
  maximum_tire_pressure:
    'Clincher: 110psi for 28c, 100psi for 30c, 90psi for 32c; tubeless: 100psi for 28c, 90psi for 30c, 80psi for 32c',
  source_note: 'Official Magene EXAR Pro 2025 product page.',
};

const makePro = ({
  id,
  variant,
  brakeType,
  weight,
  category,
  depth,
  externalWidth,
  internalWidth,
  axleFront,
  axleRear,
  discStandard,
  otherSpecs,
}) => ({
  ...proShared,
  id,
  variant,
  weight_grams: weight,
  brake_type: brakeType,
  wheelset_category: category,
  rim: {
    ...proShared.rim,
    depth_mm: depth,
    externalWidth_mm: externalWidth,
    internalWidth_mm: internalWidth,
  },
  hub: {
    ...proShared.hub,
    axle_front_mm: axleFront,
    axle_rear_mm: axleRear,
    disc_standard: discStandard,
  },
  ...makeLinks(urls.pro, 649),
  other_specs: {
    ...makeLinks(urls.pro, 649).other_specs,
    ...proOtherSpecs,
    ...otherSpecs,
  },
});

export const mageneWheels = [
  makeUltra({
    id: 255,
    variant: 'db405',
    weight: 1280,
    category: 'climbing',
    depth: { front: 40, rear: 45 },
    externalWidth: 30,
    source: { url: urls.ultra, priceUsd: 1199 },
    otherSpecs: ultraOtherSpecs,
  }),
  makeUltra({
    id: 256,
    variant: 'db508',
    weight: 1350,
    category: 'all-round',
    depth: { front: 50, rear: 58 },
    externalWidth: 30,
    source: { url: urls.ultra, priceUsd: 1199 },
    otherSpecs: ultraOtherSpecs,
  }),
  makeUltra({
    id: 257,
    variant: 'db607',
    weight: 1460,
    category: 'aero',
    depth: { front: 60, rear: 67 },
    externalWidth: { front: 32, rear: 30 },
    source: { url: urls.ultra, priceUsd: 1199 },
    otherSpecs: ultraOtherSpecs,
  }),
  makeUltra({
    id: 258,
    model: 'EXAR Carbon Fiber Wheelset UltraDark Series',
    variant: 'db405',
    weight: 1305,
    category: 'climbing',
    depth: { front: 40, rear: 45 },
    externalWidth: 30,
    source: { url: urls.ultraDark, priceUsd: 999 },
    otherSpecs: ultraDarkOtherSpecs,
  }),
  makeUltra({
    id: 259,
    model: 'EXAR Carbon Fiber Wheelset UltraDark Series',
    variant: 'db508',
    weight: 1390,
    category: 'all-round',
    depth: { front: 50, rear: 58 },
    externalWidth: 30,
    source: { url: urls.ultraDark, priceUsd: 999 },
    otherSpecs: ultraDarkOtherSpecs,
  }),
  makePro({
    id: 260,
    variant: 'rb45_pro',
    brakeType: 'rim',
    weight: 1350,
    category: 'all-round',
    depth: 45,
    externalWidth: { front: 27, rear: 26 },
    internalWidth: { front: 20, rear: 19.5 },
    axleFront: '9x100',
    axleRear: '10x130',
    discStandard: null,
    otherSpecs: {
      brake_track: 'Dewatering line design; carbon fiber composite brake blocks included',
      front_wheel_spoke_lacing: 'Radial lacing, 16H',
      rear_wheel_spoke_lacing: '21H 2:1, drive side x2, non-drive side radial lacing',
      package_standard:
        'Carbon fiber front wheel x1, carbon fiber rear wheel x1, factory-installed tubeless rim tape x2, instruction manual x1, special carbon fiber brake block x4, quick release x2, tubeless valve x2',
    },
  }),
  makePro({
    id: 261,
    variant: 'rb58_pro',
    brakeType: 'rim',
    weight: 1425,
    category: 'aero',
    depth: 58,
    externalWidth: { front: 27, rear: 26 },
    internalWidth: { front: 20, rear: 19.5 },
    axleFront: '9x100',
    axleRear: '10x130',
    discStandard: null,
    otherSpecs: {
      brake_track: 'Dewatering line design; carbon fiber composite brake blocks included',
      front_wheel_spoke_lacing: 'Radial lacing, 16H',
      rear_wheel_spoke_lacing: '21H 2:1, drive side x2, non-drive side radial lacing',
      package_standard:
        'Carbon fiber front wheel x1, carbon fiber rear wheel x1, factory-installed tubeless rim tape x2, instruction manual x1, special carbon fiber brake block x4, quick release x2, tubeless valve x2',
    },
  }),
  makePro({
    id: 262,
    variant: 'db45_pro',
    brakeType: 'disc',
    weight: 1410,
    category: 'all-round',
    depth: 45,
    externalWidth: 27,
    internalWidth: 20,
    axleFront: '12x100',
    axleRear: '12x142',
    discStandard: 'Center Lock',
    otherSpecs: {
      alternate_frame_spacing: '100/135mm quick release available separately',
      front_wheel_spoke_lacing: '21H 2:1, brake side x2, non-brake side radial lacing',
      rear_wheel_spoke_lacing: '24H 2:1, drive side x2, brake side x2',
      package_standard:
        'Carbon fiber front wheel x1, carbon fiber rear wheel x1, factory-installed tubeless rim tape x2, instruction manual x1, tubeless valve x2',
    },
  }),
  makePro({
    id: 263,
    variant: 'db58_pro',
    brakeType: 'disc',
    weight: 1500,
    category: 'aero',
    depth: 58,
    externalWidth: 27,
    internalWidth: 20,
    axleFront: '12x100',
    axleRear: '12x142',
    discStandard: 'Center Lock',
    otherSpecs: {
      alternate_frame_spacing: '100/135mm quick release available separately',
      front_wheel_spoke_lacing: '21H 2:1, brake side x2, non-brake side radial lacing',
      rear_wheel_spoke_lacing: '24H 2:1, drive side x2, brake side x2',
      package_standard:
        'Carbon fiber front wheel x1, carbon fiber rear wheel x1, factory-installed tubeless rim tape x2, instruction manual x1, tubeless valve x2',
    },
  }),
];
