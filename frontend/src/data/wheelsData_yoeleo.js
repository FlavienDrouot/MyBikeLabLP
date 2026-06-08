import wheelPlaceholderUrl from '../assets/wheel-placeholder.svg';

const NXT_FREEHUB_OPTIONS = ['Shimano HG', 'Campagnolo N3W', 'SRAM XDR'];
const QIANKUN_FREEHUB_OPTIONS = ['Shimano HG', 'SRAM XDR', 'Campagnolo N3W'];

const makeNxTWheel = ({ id, model, weight_grams, depth_mm, priceUsd, url, wheelset_category }) => ({
  id,
  model,
  brand: 'YOELEO',
  weight_grams,
  diameter_mm: 700,
  brake_type: 'disc',
  wheelset_category,
  max_system_weight_kg: 125,
  rim: {
    material: 'carbon',
    hookless: false,
    depth_mm,
    externalWidth_mm: 32,
    internalWidth_mm: 23,
    tubeless_ready: true, max_tire_pressure: { psi: 120, bar: 8.3, note: "clincher: 120 psi; tubeless: 90 psi" }
  },
  spokes: {
    model: 'Pillar WING 2.0 Aero',
    brand: 'Pillar',
    material: 'steel', count: { front: 24, rear: 24 }
  },
  hub: {
    model: 'NxT Ratchet System',
    brand: 'YOELEO',
    axle_front_mm: '12x100',
    axle_rear_mm: '12x142',
    freehub_options: NXT_FREEHUB_OPTIONS,
    disc_standard: null
  },
  prices: [{ amount: priceUsd, currency: 'USD', url }],
  image: wheelPlaceholderUrl,
  images: [],
  affiliateLinks: {
    manufacturer: { url, amount: priceUsd, currency: 'USD' },
    retailers: []
  },
  other_specs: {
    weight_tolerance_percent: 5,
    range_of_use: 'Road & Gravel',
    rim_shape: 'Offset/U-Shaped',
    rim_construction: 'Carbon with SAT Tech',
    rim_bed: 'No spoke holes (tubeless-ready, no rim tape required)',
    rim_material_detail: 'HI-MOD T800 Carbon Fiber',
    ratchet_teeth: 36,
    compatible_cassette: 'Shimano HG / SRAM / Campagnolo',
    compatible_tire_type: 'Clincher Tire, Tubeless Tire',


    compatible_tire_width_mm: '25c and above',
    suggested_tire_width_mm: '28c-47c',


    warranty_years: 3
  }
});

const makeQianKunWheel = ({
  id,
  model,
  weight_grams,
  depth_mm,
  url,
  wheelset_category,
  range_of_use = 'Road & TT'
}) => ({
  id,
  model,
  brand: 'YOELEO',
  weight_grams,
  diameter_mm: 700,
  brake_type: 'disc',
  wheelset_category,
  max_system_weight_kg: null,
  rim: {
    material: 'carbon',
    hookless: false,
    depth_mm,
    externalWidth_mm: 32,
    internalWidth_mm: 23,
    tubeless_ready: true
  },
  spokes: {
    model: 'Aero variable-section T-Head carbon',
    brand: 'YOELEO',
    material: 'carbon', count: { front: 21, rear: 24 }
  },
  hub: {
    model: 'QianKun Pro-PreLock Ratchet System',
    brand: 'YOELEO',
    axle_front_mm: '12x100',
    axle_rear_mm: '12x142',
    freehub_options: QIANKUN_FREEHUB_OPTIONS,
    disc_standard: null, bearing_type:















    'Ceramic-sealed bearings' }, prices: [{ amount: 1650, currency: 'USD', url }], image: wheelPlaceholderUrl, images: [], affiliateLinks: { manufacturer: { url, amount: 1650, currency: 'USD' }, retailers: [] }, other_specs: { weight_tolerance_percent: 3, range_of_use, rim_material_detail: 'HI-MOD T1000 Carbon Fiber', ratchet_teeth: 36,
    rim_weight_each_grams: 420,
    rim_weight_tolerance_percent: 3,
    compatible_tire_type: 'Clincher Tire, Tubeless Tire',
    compatible_tire_width_mm: '25c-45c',
    recommended_tire_width_mm: 28,
    rim_impact_test_joules: 120,
    spoke_pull_test_kgf: 600,
    hub_torque_test_nm: 230,
    hub_torque_test_cycles: 52000,
    warranty_years: 3,
    crash_replacement_discount_percent: 30
  }
});

export const yoeleoWheels = [
makeNxTWheel({
  id: 212,
  model: 'SAT C35 DB PRO NxT SL2',
  weight_grams: 1260,
  depth_mm: 35,
  priceUsd: 999,
  url: 'https://www.yoeleo.com/products/sat-c35-db-pro-nxt-sl2',
  wheelset_category: 'climbing'
}),
makeNxTWheel({
  id: 213,
  model: 'SAT C50 DB PRO NxT SL2',
  weight_grams: 1320,
  depth_mm: 50,
  priceUsd: 999,
  url: 'https://www.yoeleo.com/products/sat-c50-db-pro-nxt-sl2',
  wheelset_category: 'all-round'
}),
makeNxTWheel({
  id: 214,
  model: 'SAT C60 DB PRO NxT SL2',
  weight_grams: 1340,
  depth_mm: 60,
  priceUsd: 1049,
  url: 'https://www.yoeleo.com/products/sat-c60-db-pro-nxt-sl2',
  wheelset_category: 'aero'
}),
makeNxTWheel({
  id: 215,
  model: 'SAT C88 DB PRO NxT SL2',
  weight_grams: 1720,
  depth_mm: 88,
  priceUsd: 1099,
  url: 'https://www.yoeleo.com/products/disc-brake-carbon-tubeless-wheelset-c88-road-db',
  wheelset_category: 'aero'
}),
makeQianKunWheel({
  id: 216,
  model: 'QianKun CS50',
  weight_grams: 1185,
  depth_mm: 50,
  url: 'https://www.yoeleo.com/products/qiankun-cs50-carbon-spokes-wheels',
  wheelset_category: 'all-round'
}),
makeQianKunWheel({
  id: 217,
  model: 'QianKun CS50|60',
  weight_grams: 1285,
  depth_mm: { front: 50, rear: 60 },
  url: 'https://www.yoeleo.com/products/qiankun-cs60-mixed-depth-wheelset',
  wheelset_category: 'aero'
}),
makeQianKunWheel({
  id: 218,
  model: 'QianKun CS60',
  weight_grams: 1285,
  depth_mm: 60,
  url: 'https://www.yoeleo.com/products/qiankun-cs60',
  wheelset_category: 'aero'
})];