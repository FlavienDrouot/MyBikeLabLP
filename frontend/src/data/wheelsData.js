import { mavicWheels } from './wheelsData_mavic';
import { rovalWheels } from './wheelsData_roval';
import { zippWheels } from './wheelsData_zipp';
import { enveWheels } from './wheelsData_enve';

export const wheelsData = [
  ...mavicWheels,
  ...rovalWheels,
  ...zippWheels,
  ...enveWheels,
];

/* Legacy placeholder data — remove once all brands are scraped.
const _unused = [
  {
    id: 1,
    model: 'Alpinist CLX II',
    brand: 'Roval',
    weight_grams: 1225,
    diameter_mm: 700,
    rim: { material: 'carbon', hookless: false, depth_mm: 33, externalWidth_mm: 25.5 },
    spokes: { model: 'Sapim CX-Ray', brand: 'Sapim', material: 'stainless_steel' },
    hub: { model: 'DT 240', brand: 'DT Swiss' },
    prices: [
      { price_eur: 1299, url: 'https://example-shop.com/roval-alpinist-clx' },
      { price_eur: 1349, url: 'https://another-shop.com/roval-alpinist-clx' },
    ],
    images: [wheelPlaceholderUrl, wheelPlaceholderUrl, wheelPlaceholderUrl],
    affiliateLinks: {
      manufacturer: { url: 'https://www.roval.com/alpinist-clx-ii', price_eur: 1399 },
      retailers: [
        { name: 'Wiggle', price_eur: 1299, url: 'https://example-shop.com/roval-alpinist-clx' },
        { name: 'Chain Reaction Cycles', price_eur: 1349, url: 'https://another-shop.com/roval-alpinist-clx' },
      ],
    },
  },
  {
    id: 2,
    model: '303 Firecrest',
    brand: 'Zipp',
    weight_grams: 1510,
    diameter_mm: 700,
    rim: { material: 'carbon', hookless: true, depth_mm: 45, externalWidth_mm: 30 },
    spokes: { model: 'Sapim CX-Sprint', brand: 'Sapim', material: 'stainless_steel' },
    hub: { model: 'ZR1', brand: 'Zipp' },
    prices: [
      { price_eur: 1750, url: 'https://example-shop.com/zipp-303-firecrest' },
    ],
    images: [wheelPlaceholderUrl, wheelPlaceholderUrl],
    affiliateLinks: {
      manufacturer: { url: 'https://www.sram.com/zipp/303-firecrest', price_eur: 1799 },
      retailers: [
        { name: 'ProBikeKit', price_eur: 1750, url: 'https://example-shop.com/zipp-303-firecrest' },
      ],
    },
  },
  {
    id: 3,
    model: 'ARC 1100 Dicut 62',
    brand: 'DT Swiss',
    weight_grams: 1510,
    diameter_mm: 700,
    rim: { material: 'carbon', hookless: false, depth_mm: 62, externalWidth_mm: 27 },
    spokes: { model: 'Aerolite', brand: 'DT Swiss', material: 'stainless_steel' },
    hub: { model: '180', brand: 'DT Swiss' },
    prices: [
      { price_eur: 1990, url: 'https://example-shop.com/dt-swiss-arc-1100-62' },
      { price_eur: 2050, url: 'https://another-shop.com/dt-swiss-arc-1100-62' },
    ],
    affiliateLinks: {
      manufacturer: { url: 'https://www.dtswiss.com/arc-1100-dicut-62', price_eur: null },
      retailers: [
        { name: 'Competitive Cyclist', price_eur: 1990, url: 'https://example-shop.com/dt-swiss-arc-1100-62' },
        { name: 'Rutland Cycling', price_eur: 2050, url: 'https://another-shop.com/dt-swiss-arc-1100-62' },
      ],
    },
  },
  {
    id: 4,
    model: 'Racing Zero Carbon',
    brand: 'Fulcrum',
    weight_grams: 1390,
    diameter_mm: 700,
    rim: { material: 'carbon', hookless: false, depth_mm: 40, externalWidth_mm: 26 },
    spokes: { model: 'Aero Bladed', brand: 'Fulcrum', material: 'aluminum' },
    hub: { model: 'USB Ceramic', brand: 'Fulcrum' },
    prices: [
      { price_eur: 1200, url: 'https://example-shop.com/fulcrum-racing-zero-carbon' },
    ],
    affiliateLinks: {
      manufacturer: { url: 'https://www.fulcrumwheels.com/racing-zero-carbon', price_eur: 1299 },
      retailers: [],
    },
  },
  {
    id: 5,
    model: 'Dura-Ace WH-R9270 C50',
    brand: 'Shimano',
    weight_grams: 1492,
    diameter_mm: 700,
    rim: { material: 'carbon', hookless: false, depth_mm: 50, externalWidth_mm: 28 },
    spokes: { model: 'Bladed', brand: 'Shimano', material: 'stainless_steel' },
    hub: { model: 'Dura-Ace', brand: 'Shimano' },
    prices: [
      { price_eur: 1600, url: 'https://example-shop.com/shimano-dura-ace-c50' },
      { price_eur: 1690, url: 'https://another-shop.com/shimano-dura-ace-c50' },
    ],
    images: [wheelPlaceholderUrl, wheelPlaceholderUrl, wheelPlaceholderUrl],
    affiliateLinks: {
      manufacturer: { url: 'https://bike.shimano.com/dura-ace-wh-r9270-c50', price_eur: null },
      retailers: [
        { name: 'Wiggle', price_eur: 1600, url: 'https://example-shop.com/shimano-dura-ace-c50' },
        { name: 'ProBikeKit', price_eur: 1690, url: 'https://another-shop.com/shimano-dura-ace-c50' },
      ],
    },
  },
  {
    id: 6,
    model: '60 Limitless',
    brand: 'Hunt',
    weight_grams: 1620,
    diameter_mm: 700,
    rim: { material: 'carbon', hookless: true, depth_mm: 60, externalWidth_mm: 34 },
    spokes: { model: 'Pillar Wing 20', brand: 'Pillar', material: 'stainless_steel' },
    hub: { model: 'Hunt SPRINT', brand: 'Hunt' },
    prices: [
      { price_eur: 899, url: 'https://example-shop.com/hunt-60-limitless' },
    ],
    affiliateLinks: {
      manufacturer: { url: 'https://www.huntwheels.com/60-limitless', price_eur: 899 },
      retailers: [
        { name: 'Hunt (direct)', price_eur: 899, url: 'https://example-shop.com/hunt-60-limitless' },
      ],
    },
  },
  {
    id: 7,
    model: 'Bora Ultra WTO 45',
    brand: 'Campagnolo',
    weight_grams: 1349,
    diameter_mm: 700,
    rim: { material: 'carbon', hookless: false, depth_mm: 45, externalWidth_mm: 26 },
    spokes: { model: 'Aero', brand: 'Campagnolo', material: 'stainless_steel' },
    hub: { model: 'Bora Ultra', brand: 'Campagnolo' },
    prices: [
      { price_eur: 2200, url: 'https://example-shop.com/campagnolo-bora-ultra-45' },
    ],
    affiliateLinks: {
      manufacturer: null,
      retailers: [
        { name: 'Chain Reaction Cycles', price_eur: 2200, url: 'https://example-shop.com/campagnolo-bora-ultra-45' },
      ],
    },
  },
  {
    id: 8,
    model: 'Cosmic Pro Carbon SL',
    brand: 'Mavic',
    weight_grams: 1610,
    diameter_mm: 700,
    rim: { material: 'carbon', hookless: false, depth_mm: 40, externalWidth_mm: 25 },
    spokes: { model: 'Bladed', brand: 'Mavic', material: 'stainless_steel' },
    hub: { model: 'Instant Drive 360', brand: 'Mavic' },
    prices: [
      { price_eur: 1099, url: 'https://example-shop.com/mavic-cosmic-pro-carbon-sl' },
    ],
    affiliateLinks: {
      manufacturer: { url: 'https://www.mavic.com/cosmic-pro-carbon-sl', price_eur: 1199 },
      retailers: [
        { name: 'Decathlon Pro', price_eur: 1099, url: 'https://example-shop.com/mavic-cosmic-pro-carbon-sl' },
      ],
    },
  },
  {
    id: 9,
    model: 'Aeolus RSL 37',
    brand: 'Bontrager',
    weight_grams: 1314,
    diameter_mm: 700,
    rim: { material: 'carbon', hookless: true, depth_mm: 37, externalWidth_mm: 28 },
    spokes: { model: 'DT Swiss Aerolite', brand: 'DT Swiss', material: 'stainless_steel' },
    hub: { model: 'DT 240 EXP', brand: 'DT Swiss' },
    prices: [
      { price_eur: 2000, url: 'https://example-shop.com/bontrager-aeolus-rsl-37' },
      { price_eur: 2100, url: 'https://another-shop.com/bontrager-aeolus-rsl-37' },
    ],
    affiliateLinks: {
      manufacturer: { url: 'https://www.trekbikes.com/bontrager-aeolus-rsl-37', price_eur: 2199 },
      retailers: [
        { name: 'Competitive Cyclist', price_eur: 2000, url: 'https://example-shop.com/bontrager-aeolus-rsl-37' },
        { name: 'Rutland Cycling', price_eur: 2100, url: 'https://another-shop.com/bontrager-aeolus-rsl-37' },
      ],
    },
  },
  {
    id: 10,
    model: 'SLR 0 36',
    brand: 'Giant',
    weight_grams: 1375,
    diameter_mm: 700,
    rim: { material: 'carbon', hookless: true, depth_mm: 36, externalWidth_mm: 28 },
    spokes: { model: 'Aero', brand: 'DT Swiss', material: 'stainless_steel' },
    hub: { model: 'CADEX R36', brand: 'CADEX' },
    prices: [
      { price_eur: 1800, url: 'https://example-shop.com/giant-slr-0-36' },
    ],
    affiliateLinks: {
      manufacturer: null,
      retailers: [
        { name: 'Wiggle', price_eur: 1800, url: 'https://example-shop.com/giant-slr-0-36' },
      ],
    },
  },
  {
    id: 11,
    model: 'SES 4.5 AR',
    brand: 'Enve',
    weight_grams: 1470,
    diameter_mm: 700,
    rim: { material: 'carbon', hookless: true, depth_mm: 45, externalWidth_mm: 32 },
    spokes: { model: 'Sapim CX-Ray', brand: 'Sapim', material: 'stainless_steel' },
    hub: { model: 'Alloy Centerlock', brand: 'Enve' },
    prices: [
      { price_eur: 2800, url: 'https://example-shop.com/enve-ses-4-5-ar' },
    ],
    affiliateLinks: {
      manufacturer: { url: 'https://www.enve.com/ses-4-5-ar', price_eur: 2999 },
      retailers: [
        { name: 'Enve (direct)', price_eur: 2800, url: 'https://example-shop.com/enve-ses-4-5-ar' },
      ],
    },
  },
  {
    id: 12,
    model: 'Elusion 45',
    brand: 'Vittoria',
    weight_grams: 1580,
    diameter_mm: 700,
    rim: { material: 'carbon', hookless: true, depth_mm: 45, externalWidth_mm: 26 },
    spokes: { model: 'Bladed', brand: 'Pillar', material: 'stainless_steel' },
    hub: { model: 'Elusion', brand: 'Vittoria' },
    prices: [
      { price_eur: 750, url: 'https://example-shop.com/vittoria-elusion-45' },
    ],
    affiliateLinks: {
      manufacturer: null,
      retailers: [],
    },
  },
  {
    id: 13,
    model: 'AR 58',
    brand: 'Reynolds',
    weight_grams: 1520,
    diameter_mm: 700,
    rim: { material: 'carbon', hookless: true, depth_mm: 58, externalWidth_mm: 28 },
    spokes: { model: 'Sapim CX-Ray', brand: 'Sapim', material: 'stainless_steel' },
    hub: { model: 'Industry Nine', brand: 'Industry Nine' },
    prices: [
      { price_eur: 1650, url: 'https://example-shop.com/reynolds-ar-58' },
    ],
    affiliateLinks: {
      manufacturer: { url: 'https://www.reynoldscycling.com/ar-58', price_eur: 1699 },
      retailers: [
        { name: 'ProBikeKit', price_eur: 1650, url: 'https://example-shop.com/reynolds-ar-58' },
      ],
    },
  },
  {
    id: 14,
    model: 'Altamont 60',
    brand: 'Boyd',
    weight_grams: 1620,
    diameter_mm: 700,
    rim: { material: 'carbon', hookless: true, depth_mm: 60, externalWidth_mm: 28 },
    spokes: { model: 'Sapim CX-Ray', brand: 'Sapim', material: 'stainless_steel' },
    hub: { model: 'Boyd Altamont', brand: 'Boyd' },
    prices: [
      { price_eur: 850, url: 'https://example-shop.com/boyd-altamont-60' },
    ],
    affiliateLinks: {
      manufacturer: null,
      retailers: [
        { name: 'Chain Reaction Cycles', price_eur: 850, url: 'https://example-shop.com/boyd-altamont-60' },
      ],
    },
  },
  {
    id: 15,
    model: 'CarbonWorks GRIT 4540',
    brand: 'Princeton',
    weight_grams: 1480,
    diameter_mm: 700,
    rim: { material: 'carbon', hookless: true, depth_mm: 45, externalWidth_mm: 30 },
    spokes: { model: 'Sapim CX-Ray', brand: 'Sapim', material: 'stainless_steel' },
    hub: { model: 'White Industries CLD', brand: 'White Industries' },
    prices: [
      { price_eur: 2300, url: 'https://example-shop.com/princeton-grit-4540' },
    ],
    affiliateLinks: {
      manufacturer: { url: 'https://www.princetoncarbon.com/grit-4540', price_eur: 2399 },
      retailers: [
        { name: 'Competitive Cyclist', price_eur: 2300, url: 'https://example-shop.com/princeton-grit-4540' },
      ],
    },
  },
];
*/
