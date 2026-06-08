
const FREEHUB_OPTIONS = ['Shimano HG', 'SRAM XDR'];

const PRODUCT_URL = 'https://www.pandapodium.cc/product/arcaris-8848-climbers-wheelset/';

const IMAGES = [
'https://www.pandapodium.cc/wp-content/uploads/2025/10/8848_Pro_Final_web-scaled.jpg',
'https://www.pandapodium.cc/wp-content/uploads/2025/10/8848_White_Final_web-scaled.jpg',
'https://www.pandapodium.cc/wp-content/uploads/2025/10/Arcaris8848_Square01-1.jpg',
'https://www.pandapodium.cc/wp-content/uploads/2025/10/Arcaris8848_Square02-1.jpg',
'https://www.pandapodium.cc/wp-content/uploads/2025/10/Arcaris8848_Square03-1.jpg'];


const baseOtherSpecs = {
  min_tire_size_c: 25,
  max_tire_size_c: 38,
  max_tire_pressure_psi_28c: 110,
  rim_construction:
  'VAMspeed wind-tunnel-tested rim profile, Optiply high-modulus layup, hidden nipples, DSR-Lock patent-pending captive spokes, hooked (clincher & tubeless ready)',
  uci_approved: true,
  warranty: '2-year limited (manufacturing defects)'
};

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

const makeArcarisWheel = ({
  id,
  variant,
  weight_grams,
  max_system_weight_kg,
  spokes,
  hubModel,
  hubBrand,
  priceUsd,
  other_specs = {}
}) => ({
  ...(() => {
    const promoted = splitHubSpecs(other_specs);
    return {
      id,
      model: '8848 Climbers Wheelset',
      brand: 'Arcaris',
      variant,
      weight_grams,
      diameter_mm: 700,
      brake_type: 'disc',
      wheelset_category: 'climbing',
      max_system_weight_kg,
      rim: {
        material: 'carbon',
        hookless: false,
        depth_mm: 27,
        externalWidth_mm: 28.3,
        internalWidth_mm: 23,
        tubeless_ready: true
      },
      spokes,
      hub: {
        model: hubModel,
        brand: hubBrand,
        axle_front_mm: null,
        axle_rear_mm: null,
        freehub_options: FREEHUB_OPTIONS,
        disc_standard: null,
        ...promoted.hubSpecs
      },
      prices: [{ amount: priceUsd, currency: 'USD', url: PRODUCT_URL }],
      image: IMAGES[0],
      images: IMAGES,
      affiliateLinks: {
        manufacturer: { url: PRODUCT_URL, amount: priceUsd, currency: 'USD' },
        retailers: [{ name: 'Panda Podium', amount: priceUsd, currency: 'USD', url: PRODUCT_URL }]
      },
      other_specs: {
        ...baseOtherSpecs,
        ...promoted.otherSpecs
      }
    };
  })()
});

export const arcarisWheels = [
makeArcarisWheel({
  id: 219,
  variant: 'base',
  weight_grams: 948.3,
  max_system_weight_kg: 90,
  spokes: { model: 'VONOA Carbon', brand: 'VONOA', material: 'carbon', count: { front: 16, rear: 18 }, lacing: { front: null, rear: "2:1" } },
  hubModel: '8848 H-WORKS',
  hubBrand: 'H-WORKS',
  priceUsd: 1599,
  other_specs: {
    hubBearingType: 'Steel (TPI)',


    recommended_rider_weight_kg: 75

  }
}),
makeArcarisWheel({
  id: 220,
  variant: 'pro',
  weight_grams: 884.8,
  max_system_weight_kg: 90,
  spokes: { model: 'VONOA Carbon w/ Titanium Fittings', brand: 'VONOA', material: 'carbon', count: { front: 16, rear: 18 }, lacing: { front: null, rear: "2:1" } },
  hubModel: '8848 H-WORKS',
  hubBrand: 'H-WORKS',
  priceUsd: 1899,
  other_specs: {
    hubBearingType: 'Hybrid Ceramic (TPI)',


    recommended_rider_weight_kg: 75

  }
}),
makeArcarisWheel({
  id: 221,
  variant: 'max',
  weight_grams: 934.6,
  max_system_weight_kg: 100,
  spokes: { model: 'Sapim CX-Super', brand: 'Sapim', material: 'steel', count: { front: 24, rear: 24 } },
  hubModel: 'NONPLUS',
  hubBrand: 'NONPLUS',
  priceUsd: 2499,
  other_specs: {
    hubBearingType: 'Steel (Enduro)',


    recommended_rider_weight_kg: 90,
    hub_origin: 'NONPLUS hubs made in Germany, Sapim CX-Super spokes made in Europe'
  }
})];