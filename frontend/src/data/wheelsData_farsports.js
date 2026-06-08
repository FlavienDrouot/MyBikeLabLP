import wheelPlaceholderUrl from '../assets/wheel-placeholder.svg';

const freehubs = ['Shimano HG', 'Shimano Micro Spline', 'SRAM XDR', 'Campagnolo ED', 'Campagnolo N3W'];
const ufoFreehubs = ['Shimano HG', 'SRAM XDR'];
const airFreehubs = ['Shimano HG', 'SRAM XDR', 'Campagnolo ED'];

const urls = {
  evoS: 'https://www.farsports.com/products/farsports-2026-new-evo-s-series',
  evoC: 'https://www.farsports.com/products/farsports-2026-new-evo-c-series',
  s: 'https://www.farsports.com/products/farsports-2026-new-s-series',
  c: 'https://www.farsports.com/products/farsports-2026-new-c-series',
  ufo: 'https://www.farsports.com/products/ufo-aero-series',
  air: 'https://www.farsports.com/products/air-series'
};

const images = {
  evoS: ['https://cdn.shopify.com/s/files/1/0602/5537/1439/files/EVOs5_e40214f2-47f6-461d-b6a6-3f7209c3eadb.jpg?v=1773998008'],
  evoC: ['https://cdn.shopify.com/s/files/1/0602/5537/1439/files/EVOc5_af1acb4c-81cf-494a-93ae-973179e33b94.jpg?v=1773998121'],
  s: ['https://cdn.shopify.com/s/files/1/0602/5537/1439/files/10_ec5acbbd-2b7f-4a2a-9c73-9da9106c301f.jpg?v=1762943920'],
  c: ['https://cdn.shopify.com/s/files/1/0602/5537/1439/files/ecc52a86687f146277cfd2c9741b54ca_683ac6b8-e2c9-4698-a63e-2c74a72f54a5.jpg?v=1763523760'],
  ufo: ['https://cdn.shopify.com/s/files/1/0602/5537/1439/files/8_cc2cb56f-4415-419c-9b5c-52654d7ea0de.jpg?v=1767505622'],
  air: ['https://cdn.shopify.com/s/files/1/0602/5537/1439/products/Air2-1_c1febe57-4760-4423-932e-f93ba5cf3911.png?v=1646431792']
};

const withLinks = (url, priceUsd, productImages, sourceNote) => ({
  prices: [{ amount: priceUsd, currency: 'USD', url }],
  image: productImages.length ? productImages[0] : wheelPlaceholderUrl,
  images: productImages,
  affiliateLinks: {
    manufacturer: { url, amount: priceUsd, currency: 'USD' },
    retailers: []
  },
  other_specs: {
    source_note: sourceNote
  }
});

const splitHubSpecs = (otherSpecs = {}) => {
  const { hubBearingType, hubBearingModels = [], hubMaterial = null, ...rest } = otherSpecs;
  return {
    hubSpecs: {
      bearing_type: hubBearingType ?? null,
      bearing_models: hubBearingModels,
      material: hubMaterial
    },
    otherSpecs: rest
  };
};

const makeWheel = ({
  id,
  model,
  variant,
  weight,
  category,
  depth,
  externalWidth,
  internalWidth,
  spokes,
  hub,
  brakeType = 'disc',
  maxWeight = 120,
  url,
  priceUsd,
  productImages,
  weightTolerancePercent,
  otherSpecs = {}
}) => ({
  ...(() => {
    const promoted = splitHubSpecs(otherSpecs);
    return {
      id,
      brand: 'FARSPORTS',
      model,
      variant,
      weight_grams: weight,
      ...(weightTolerancePercent ? { weight_tolerance_percent: weightTolerancePercent } : {}),
      diameter_mm: 700,
      brake_type: brakeType,
      wheelset_category: category,
      max_system_weight_kg: maxWeight,
      rim: {
        material: 'carbon',
        hookless: false,
        depth_mm: depth,
        externalWidth_mm: externalWidth,
        internalWidth_mm: internalWidth,
        tubeless_ready: true
      },
      spokes,
      hub: {
        ...hub,
        ...promoted.hubSpecs
      },
      ...withLinks(url, priceUsd, productImages, 'Official FARSPORTS Shopify product page.'),
      other_specs: {
        ...withLinks(url, priceUsd, productImages, 'Official FARSPORTS Shopify product page.').other_specs,
        ...promoted.otherSpecs
      }
    };
  })()
});

const cSpokes = { model: 'Alpina Ultralite Aero / Sapim CX-Super', brand: 'Alpina / Sapim', material: 'steel' };
const sSpokes = { model: '3.8 mm T-head carbon spoke', brand: 'FARSPORTS', material: 'carbon' };
const airSpokes = { model: 'CX-Super', brand: 'Sapim', material: 'steel' };

const discHub = (model, freehubOptions = freehubs) => ({
  model,
  brand: 'FARSPORTS',
  axle_front_mm: '12x100',
  axle_rear_mm: '12x142',
  freehub_options: freehubOptions,
  disc_standard: 'Center Lock'
});

const rimHub = (model, freehubOptions = airFreehubs) => ({
  model,
  brand: model.startsWith('DT') ? 'DT Swiss' : 'Extralite',
  axle_front_mm: '9x100',
  axle_rear_mm: '10x130',
  freehub_options: freehubOptions,
  disc_standard: null
});

const seriesDepths = [
{ key: 'depth_45mm', category: 'climbing', depth: 45, weightC: 1290, weightEvoC: 1250, weightS: 1190, weightEvoS: 1150 },
{ key: 'depth_50mm', category: 'all-round', depth: 50, weightC: 1320, weightEvoC: 1280, weightS: 1220, weightEvoS: 1180 },
{ key: 'depth_585mm', category: 'aero', depth: 58.5, weightC: 1420, weightEvoC: 1380, weightS: 1320, weightEvoS: 1280 },
{ key: 'depth_4550', category: 'all-round', depth: { front: 45, rear: 50 }, weightC: null, weightEvoC: null, weightS: null, weightEvoS: null },
{ key: 'depth_50585', category: 'aero', depth: { front: 50, rear: 58.5 }, weightC: null, weightEvoC: null, weightS: null, weightEvoS: null },
{ key: 'depth_45585', category: 'aero', depth: { front: 45, rear: 58.5 }, weightC: null, weightEvoC: null, weightS: null, weightEvoS: null }];


const makeSeries = ({ startId, model, variantPrefix, weightKey, spokes, hubModel, url, priceUsd, productImages, bearingType }) =>
seriesDepths.map((entry, index) =>
makeWheel({
  id: startId + index,
  model,
  variant: `${variantPrefix}_${entry.key}`,
  weight: entry[weightKey],
  weightTolerancePercent: 5,
  category: entry.category,
  depth: entry.depth,
  externalWidth: 31.5,
  internalWidth: 24,
  spokes,
  hub: discHub(hubModel),
  url,
  priceUsd,
  productImages,
  otherSpecs: {
    hubBearingType: bearingType,

  },
  certification: { uci: true, astm: null, ebike: null }
})
);

const ufoEntries = [
{ variant: 'ufo7_disc', brakeType: 'disc', depth: 70, weight: 1080, priceUsd: 1699 },
{ variant: 'ufo8_disc', brakeType: 'disc', depth: 80, weight: 1740, priceUsd: 1699 },
{ variant: 'ufo7_rim', brakeType: 'rim', depth: 70, weight: 1080, priceUsd: 1699 },
{ variant: 'ufo8_rim', brakeType: 'rim', depth: 80, weight: 1740, priceUsd: 1699 },
{ variant: 'ufo7_full_disc_rear', brakeType: 'disc', depth: { front: 70, rear: 0 }, weight: null, priceUsd: 2599 },
{ variant: 'ufo8_full_disc_rear', brakeType: 'disc', depth: { front: 80, rear: 0 }, weight: null, priceUsd: 2599 }];


const airModels = [
{ model: 'FAR Air Series', variant: 'air2_super', depth: 25, weight: 1070, category: 'climbing' },
{ model: 'FAR Air Series', variant: 'air3_super', depth: 35, weight: 1120, category: 'climbing' },
{ model: 'FAR Air Series', variant: 'air4', depth: 45, weight: 1230, category: 'all-round' },
{ model: 'FAR Air Series', variant: 'air6', depth: 58, weight: null, category: 'aero' }];


const airBuilds = [
{ key: 'dt180_rim', brakeType: 'rim', hub: rimHub('DT180 EXP'), priceByModel: { air2_super: 1688, air3_super: 1688, air4: 1688, air6: 1688 } },
{ key: 'dt180_disc', brakeType: 'disc', hub: discHub('DT180 EXP', airFreehubs), priceByModel: { air2_super: 1688, air3_super: 1688, air4: 1688, air6: 1688 } },
{ key: 'extralite_rim', brakeType: 'rim', hub: rimHub('Extralite CyberRear SPD-2'), priceByModel: { air2_super: 1688, air3_super: 1688, air4: 1688, air6: 1688 } },
{ key: 'extralite_disc', brakeType: 'disc', hub: discHub('Extralite CyberRear SPD-3', airFreehubs), priceByModel: { air2_super: 1688, air3_super: 1688, air4: 1688, air6: 1688 } },
{ key: 'dt240_rim', brakeType: 'rim', hub: rimHub('DT240 EXP'), priceByModel: { air2_super: 1288, air3_super: 1288, air4: 1088, air6: 1088 } },
{ key: 'dt240_disc', brakeType: 'disc', hub: discHub('DT240 EXP', airFreehubs), priceByModel: { air2_super: 1488, air3_super: 1488, air4: 1288, air6: 1288 } }];


export const farsportsWheels = [
...makeSeries({
  startId: 309,
  model: '2026 EVO S Series',
  variantPrefix: 'ceramicspeed',
  weightKey: 'weightEvoS',
  spokes: sSpokes,
  hubModel: 'SH01F / SH01R ratchet',
  url: urls.evoS,
  priceUsd: 1759,
  productImages: images.evoS,
  bearingType: 'CeramicSpeed'
}),
...makeSeries({
  startId: 315,
  model: '2026 EVO S Series',
  variantPrefix: 'steel_bearing',
  weightKey: 'weightEvoS',
  spokes: sSpokes,
  hubModel: 'SH01F / SH01R ratchet',
  url: urls.evoS,
  priceUsd: 1559,
  productImages: images.evoS,
  bearingType: 'steel'
}),
...makeSeries({
  startId: 321,
  model: '2026 EVO C Series',
  variantPrefix: 'ceramicspeed',
  weightKey: 'weightEvoC',
  spokes: cSpokes,
  hubModel: 'CH01F / CH01R ratchet',
  url: urls.evoC,
  priceUsd: 1659,
  productImages: images.evoC,
  bearingType: 'CeramicSpeed'
}),
...makeSeries({
  startId: 327,
  model: '2026 EVO C Series',
  variantPrefix: 'steel_bearing',
  weightKey: 'weightEvoC',
  spokes: cSpokes,
  hubModel: 'CH01F / CH01R ratchet',
  url: urls.evoC,
  priceUsd: 1459,
  productImages: images.evoC,
  bearingType: 'steel'
}),
...makeSeries({
  startId: 333,
  model: '2026 S Series',
  variantPrefix: 'standard',
  weightKey: 'weightS',
  spokes: sSpokes,
  hubModel: 'SH01F / SH01R ratchet',
  url: urls.s,
  priceUsd: 1359,
  productImages: images.s,
  bearingType: 'steel'
}),
...makeSeries({
  startId: 339,
  model: '2026 C Series',
  variantPrefix: 'standard',
  weightKey: 'weightC',
  spokes: cSpokes,
  hubModel: 'CH01F / CH01R ratchet',
  url: urls.c,
  priceUsd: 1159,
  productImages: images.c,
  bearingType: 'steel'
}),
...ufoEntries.map((entry, index) =>
makeWheel({
  id: 345 + index,
  model: 'UFO Series',
  variant: entry.variant,
  weight: entry.weight,
  brakeType: entry.brakeType,
  category: 'aero',
  depth: entry.depth,
  externalWidth: null,
  internalWidth: null,
  spokes: { model: '', brand: '', material: 'steel' },
  hub: entry.brakeType === 'disc' ? discHub('DT240 EXP', ufoFreehubs) : rimHub('DT240 EXP', ufoFreehubs),
  url: urls.ufo,
  priceUsd: entry.priceUsd,
  productImages: images.ufo,
  otherSpecs: {
    source_note: 'Official FARSPORTS Shopify product page; UFO full-disc rear combinations retained as triathlon wheelsets.',
    rear_disc_wheel: entry.variant.includes('full_disc_rear')
  }
})
),
...airBuilds.flatMap((build, buildIndex) =>
airModels.map((entry, modelIndex) =>
makeWheel({
  id: 351 + buildIndex * airModels.length + modelIndex,
  model: entry.model,
  variant: `${entry.variant}_${build.key}`,
  weight: entry.weight,
  brakeType: build.brakeType,
  category: entry.category,
  depth: entry.depth,
  externalWidth: null,
  internalWidth: null,
  spokes: airSpokes,
  hub: build.hub,
  url: urls.air,
  priceUsd: build.priceByModel[entry.variant],
  productImages: images.air,
  otherSpecs: {
    hub_build: build.key,
    source_note: 'Official FARSPORTS Shopify product page; model weights recouped with Panda Podium where the official page does not publish the table as text.'
  }
})
)
)];
