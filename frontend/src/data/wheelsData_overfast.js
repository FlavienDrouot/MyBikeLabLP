
const FREEHUB_OPTIONS = ['Shimano HG', 'SRAM XDR'];

const MANUFACTURER_URL = 'https://www.overfastbike.com/';
const RETAILER_URL =
  'https://underdogscycling.cc/product/overfast-ultralight-carbon-wheelset/';
const PANDA_URL =
  'https://www.pandapodium.cc/product/overfast-50mm-ultralight-wheelset/';

const PRICE_USD = 2250;

const baseHubSpecs = {
  bearing_type: 'TPI ceramic',
  bearing_models: [],
  material: null,
};

const baseOtherSpecs = {
  weight_tolerance_grams: 15,
  max_tire_pressure_psi_28c: 110,
  rim_construction:
    'In-house manufactured carbon (Toray T1100/T800+), laser-guided layup, UV-shaped hooked-bead profile; validated to 100 J impact (UCI requirement 40 J)',
  warranty: '2-year manufacturer warranty',
};

const makeOverfastWheel = ({
  id,
  variant,
  weight_grams,
  depth_mm,
  externalWidth_mm,
  image,
  claimed_pair_weight_grams,
  rim_weight_each_grams,
}) => ({
  id,
  model: 'Ultralight Carbon Wheelset',
  brand: 'OVERFAST',
  variant,
  weight_grams,
  diameter_mm: 700,
  brake_type: 'disc',
  wheelset_category: 'all-round',
  max_system_weight_kg: 100,
  rim: {
    material: 'carbon',
    hookless: false,
    depth_mm,
    externalWidth_mm,
    internalWidth_mm: 23,
    tubeless_ready: true,
  },
  spokes: {
    model: 'Overfast Carbon Spoke (3.5-1.5)',
    brand: 'OVERFAST',
    material: 'carbon',
    count: { front: 20, rear: 20 },
    lacing: { front: '1:1', rear: '1:1' },
  },
  hub: {
    model: 'Overfast Hub',
    brand: 'OVERFAST',
    axle_front_mm: '12x100',
    axle_rear_mm: '12x142',
    freehub_options: FREEHUB_OPTIONS,
    disc_standard: 'Center Lock',
    ...baseHubSpecs,
  },
  prices: [{ amount: PRICE_USD, currency: 'USD', url: RETAILER_URL }],
  image,
  images: [image],
  affiliateLinks: {
    manufacturer: { url: MANUFACTURER_URL, amount: PRICE_USD, currency: 'USD' },
    retailers: [
      { name: 'Underdogs Cycling', amount: PRICE_USD, currency: 'USD', url: RETAILER_URL },
      { name: 'Panda Podium', amount: PRICE_USD, currency: 'USD', url: PANDA_URL },
    ],
  },
  other_specs: {
    ...baseOtherSpecs,
    claimed_pair_weight_grams,
    rim_weight_each_grams,
  },
});

export const overfastWheels = [
  makeOverfastWheel({
    id: 210,
    variant: 'depth_37mm',
    weight_grams: { front: 432, rear: 536 },
    depth_mm: 37,
    externalWidth_mm: 28,
    image:
      'https://underdogscycling.cc/wp-content/uploads/2026/02/overfast-37mm-carbon-road-wheel-front-view.jpg',
    claimed_pair_weight_grams: 968,
    rim_weight_each_grams: 279,
  }),
  makeOverfastWheel({
    id: 211,
    variant: 'depth_50mm',
    weight_grams: { front: 462, rear: 554 },
    depth_mm: 50,
    externalWidth_mm: 29,
    image: 'https://www.pandapodium.cc/wp-content/uploads/2026/02/50mm.png',
    claimed_pair_weight_grams: 1016,
    rim_weight_each_grams: 330,
  }),
];
