import wheelPlaceholderUrl from '../assets/wheel-placeholder.svg';

const PRODUCT_URL = 'https://exs-cycling.com/products/granfondo-43';
const RETAILER_URL =
  'https://www.pandapodium.cc/product/exs-granfondo-43-road-disc-brake-wheelset/';

const IMAGES = [
  'https://ueeshop.ly200-cdn.com/u_file/UPBA/UPBA896/2312/27/photo/GF43PC.jpg',
  'https://ueeshop.ly200-cdn.com/u_file/UPBA/UPBA896/2312/27/photo/GF431.jpg',
  'https://ueeshop.ly200-cdn.com/u_file/UPBA/UPBA896/2312/27/photo/GF43.png',
];

export const exsWheels = [
  {
    id: 209,
    model: 'Granfondo 43',
    brand: 'EXS',
    weight_grams: 1390,
    diameter_mm: 700,
    brake_type: 'disc',
    wheelset_category: 'all-round',
    max_system_weight_kg: null,
    rim: {
      material: 'carbon',
      hookless: false,
      depth_mm: 42.5,
      externalWidth_mm: 30,
      internalWidth_mm: 24,
      tubeless_ready: true,
    },
    spokes: {
      model: 'CX-Ray',
      brand: 'Sapim',
      material: 'steel',
    },
    hub: {
      model: 'AR-24',
      brand: 'EXS',
      axle_front_mm: null,
      axle_rear_mm: null,
      freehub_options: ['Shimano HG', 'SRAM XDR'],
      disc_standard: 'Center Lock',
    },
    prices: [{ price_eur: null, url: PRODUCT_URL }],
    image: IMAGES[0],
    images: IMAGES,
    affiliateLinks: {
      manufacturer: { url: PRODUCT_URL, price_eur: null },
      retailers: [{ name: 'Panda Podium', price_eur: null, url: RETAILER_URL }],
    },
    other_specs: {
      price_usd: 1000,
      bearing_type: 'SKF',
      tire_compatibility: 'Clincher/Tubeless',
      recommended_max_tire_size_c: 32,
      rim_construction:
        'Hooked tubeless-ready carbon rim (avoids hookless 73psi pressure limit); wind-tunnel-tested profile',
      warranty: '2-year (crash replacement covered)',
    },
  },
];
