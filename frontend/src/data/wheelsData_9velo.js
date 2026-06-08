import wheelPlaceholderUrl from '../assets/wheel-placeholder.svg';

const freehubOptions = ['Shimano HG', 'SRAM XDR', 'Campagnolo N3W'];

const urls = {
  extreme:
  'https://www.9velo.com/products/9velo-2026-ultralight-road-disc-carbon-spoke-extreme-c52-road-wheels-20h-20h-236-mm-inner-wide%2C-sub1000-grams',
  cdWide: 'https://www.9velo.com/products/9velo-2025-road-disc-carbon-spoke-cd-wide-series-20h-20h',
  lvWide: 'https://www.9velo.com/products/9velo-2025-road-disc-lightweight-lv-wide-series-24h-24h-24mm-inner-wide',
  cd20: 'https://www.9velo.com/products/9velo-2024-road-disc-carbon-spoke-cd-20-series',
  lv20: 'https://www.9velo.com/products/9velo-2024-road-disc-lv-20-series',
  rl: 'https://www.9velo.com/products/9velo-2024-road-rim-brake-lightweight-rl-series-20h-24h',
  cv: 'https://www.9velo.com/products/carbon-spoke-rim-brake-cv-series'
};

const makeLinks = (url, priceUsd) => ({
  prices: [{ amount: priceUsd, currency: 'USD', url }],
  image: wheelPlaceholderUrl,
  images: [],
  affiliateLinks: {
    manufacturer: { url, amount: priceUsd, currency: 'USD' },
    retailers: []
  },
  other_specs: {
    source_note: 'Official 9Velo product page.'
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
  brakeType = 'disc',
  category,
  depth,
  externalWidth,
  internalWidth,
  maxWeight = 120,
  spokes,
  hub,
  url,
  priceUsd,
  otherSpecs = {}
}) => ({
  ...(() => {
    const promoted = splitHubSpecs(otherSpecs);
    return {
      id,
      brand: '9Velo',
      model,
      variant,
      weight_grams: weight,
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
      ...makeLinks(url, priceUsd),
      other_specs: {
        ...makeLinks(url, priceUsd).other_specs,
        ...promoted.otherSpecs
      }
    };
  })()
});

const discCarbonSpokeHub = {
  model: 'T17 lightweight carbon-spoke ratchet',
  brand: '9Velo',
  axle_front_mm: '12x100',
  axle_rear_mm: '12x142',
  freehub_options: freehubOptions,
  disc_standard: 'Center Lock'
};

const discSteelSpokeHub = {
  model: 'T16 lightweight ratchet',
  brand: '9Velo',
  axle_front_mm: '12x100',
  axle_rear_mm: '12x142',
  freehub_options: freehubOptions,
  disc_standard: 'Center Lock'
};

const rimBrakeHub = {
  model: 'V262 lightweight ratchet',
  brand: '9Velo',
  axle_front_mm: '9x100',
  axle_rear_mm: '10x130',
  freehub_options: freehubOptions,
  disc_standard: null
};

const carbonSpokes = {
  model: 'Carbon spoke',
  brand: '9Velo',
  material: 'carbon'
};

const sapimCxRaySpokes = {
  model: 'CX-Ray',
  brand: 'Sapim',
  material: 'steel'
};

export const nineVeloWheels = [
makeWheel({
  id: 292,
  model: 'Ultralight Road Disc Carbon Spoke EXTREME C Series',
  variant: 'extreme_c42',
  weight: 992,
  category: 'climbing',
  depth: 42,
  externalWidth: 30,
  internalWidth: 23.6,
  maxWeight: 95,
  spokes: { ...carbonSpokes, count: { front: 20, rear: 20 } },
  hub: {
    ...discCarbonSpokeHub,
    model: 'X21 ultra-lightweight carbon-spoke ratchet'
  },
  url: urls.extreme,
  priceUsd: 1799,
  otherSpecs: {
    hubBearingType: 'Steel bearings',


    spoke_lacing: '1:1 pattern',
    tire_compatibility: 'Tubeless/clincher; 700x28c-700x47c',
    rim_bed: 'Drilled'
  }
}),
makeWheel({
  id: 293,
  model: 'Ultralight Road Disc Carbon Spoke EXTREME C Series',
  variant: 'extreme_c52',
  weight: 999,
  category: 'all-round',
  depth: 52,
  externalWidth: 30,
  internalWidth: 23.6,
  maxWeight: 95,
  spokes: { ...carbonSpokes, count: { front: 20, rear: 20 } },
  hub: {
    ...discCarbonSpokeHub,
    model: 'X21 ultra-lightweight carbon-spoke ratchet'
  },
  url: urls.extreme,
  priceUsd: 1799,
  otherSpecs: {
    hubBearingType: 'Steel bearings',


    spoke_lacing: '1:1 pattern',
    tire_compatibility: 'Tubeless/clincher; 700x28c-700x47c',
    rim_bed: 'Drilled'
  }
}),
makeWheel({
  id: 294,
  model: 'Ultralight Road Disc Carbon Spoke EXTREME C Series',
  variant: 'extreme_c62',
  weight: 1162,
  category: 'aero',
  depth: 62,
  externalWidth: 30,
  internalWidth: 23.6,
  maxWeight: 95,
  spokes: { ...carbonSpokes, count: { front: 20, rear: 20 } },
  hub: {
    ...discCarbonSpokeHub,
    model: 'X21 ultra-lightweight carbon-spoke ratchet'
  },
  url: urls.extreme,
  priceUsd: 1799,
  otherSpecs: {
    hubBearingType: 'Steel bearings',


    spoke_lacing: '1:1 pattern',
    tire_compatibility: 'Tubeless/clincher; 700x28c-700x47c',
    rim_bed: 'Drilled'
  }
}),
makeWheel({
  id: 295,
  model: 'Road Disc Carbon Spoke CD Wide Series',
  variant: 'cd50_wide',
  weight: 1225,
  category: 'all-round',
  depth: 50,
  externalWidth: 30,
  internalWidth: 24,
  spokes: { ...carbonSpokes, count: { front: 20, rear: 20 } },
  hub: discCarbonSpokeHub,
  url: urls.cdWide,
  priceUsd: 1289,
  otherSpecs: {
    hubBearingType: 'Steel bearings, front: 2x6803, rear: 2x15267 + 2x6802',


    spoke_lacing: '1:1 pattern',
    tire_compatibility: 'Tubeless/clincher; 700x28c-700x47c',
    rim_bed: 'Drilled',
    titanium_freehub_upgrade_weight_delta_grams: 18
  }
}),
makeWheel({
  id: 296,
  model: 'Road Disc Carbon Spoke CD Wide Series',
  variant: 'cd58_wide',
  weight: 1323,
  category: 'all-round',
  depth: 58,
  externalWidth: 30,
  internalWidth: 24,
  spokes: { ...carbonSpokes, count: { front: 20, rear: 20 } },
  hub: discCarbonSpokeHub,
  url: urls.cdWide,
  priceUsd: 1289,
  otherSpecs: {
    hubBearingType: 'Steel bearings, front: 2x6803, rear: 2x15267 + 2x6802',


    spoke_lacing: '1:1 pattern',
    tire_compatibility: 'Tubeless/clincher; 700x28c-700x47c',
    rim_bed: 'Drilled',
    titanium_freehub_upgrade_weight_delta_grams: 18
  }
}),
makeWheel({
  id: 297,
  model: 'Road Disc Carbon Spoke CD Wide Series',
  variant: 'cd65_wide',
  weight: 1428,
  category: 'aero',
  depth: 65,
  externalWidth: 30,
  internalWidth: 24,
  spokes: { ...carbonSpokes, count: { front: 20, rear: 20 } },
  hub: discCarbonSpokeHub,
  url: urls.cdWide,
  priceUsd: 1289,
  otherSpecs: {
    hubBearingType: 'Steel bearings, front: 2x6803, rear: 2x15267 + 2x6802',


    spoke_lacing: '1:1 pattern',
    tire_compatibility: 'Tubeless/clincher; 700x28c-700x47c',
    rim_bed: 'Drilled',
    titanium_freehub_upgrade_weight_delta_grams: 18
  }
}),
makeWheel({
  id: 298,
  model: 'Road Disc Lightweight LV Wide Series',
  variant: 'lv50_wide',
  weight: 1315,
  category: 'all-round',
  depth: 50,
  externalWidth: 30,
  internalWidth: 24,
  spokes: { ...sapimCxRaySpokes, count: { front: 24, rear: 24 } },
  hub: discSteelSpokeHub,
  url: urls.lvWide,
  priceUsd: 1039,
  otherSpecs: {
    hubBearingType: 'Steel bearings, front: 2x6802, rear: 1x15267 + 3x6802',


    spoke_lacing: '2X front, 2X rear',
    tire_compatibility: 'Tubeless/clincher; 700x28c-700x47c',
    rim_bed: 'No holes drilled',
    titanium_freehub_upgrade_weight_delta_grams: 18
  }
}),
makeWheel({
  id: 299,
  model: 'Road Disc Lightweight LV Wide Series',
  variant: 'lv58_wide',
  weight: 1409,
  category: 'aero',
  depth: 58,
  externalWidth: 30,
  internalWidth: 24,
  spokes: { ...sapimCxRaySpokes, count: { front: 24, rear: 24 } },
  hub: discSteelSpokeHub,
  url: urls.lvWide,
  priceUsd: 1039,
  otherSpecs: {
    hubBearingType: 'Steel bearings, front: 2x6802, rear: 1x15267 + 3x6802',


    spoke_lacing: '2X front, 2X rear',
    tire_compatibility: 'Tubeless/clincher; 700x28c-700x47c',
    rim_bed: 'No holes drilled',
    titanium_freehub_upgrade_weight_delta_grams: 18
  }
}),
makeWheel({
  id: 300,
  model: 'Road Disc Carbon Spoke CD 2.0 Series',
  variant: 'cd45_2_0',
  weight: 1220,
  category: 'all-round',
  depth: 45,
  externalWidth: 28.3,
  internalWidth: 21,
  spokes: { ...carbonSpokes, count: { front: 20, rear: 20 } },
  hub: discCarbonSpokeHub,
  url: urls.cd20,
  priceUsd: 989,
  otherSpecs: {
    hubBearingType: 'Steel bearings, front: 2x6803, rear: 2x15267 + 2x6802',


    spoke_lacing: '1:1 pattern',
    tire_compatibility: 'Tubeless/clincher; 700x25c-700x47c',
    rim_bed: 'Drilled',
    titanium_freehub_upgrade_weight_delta_grams: 18
  }
}),
makeWheel({
  id: 301,
  model: 'Road Disc Carbon Spoke CD 2.0 Series',
  variant: 'cd58_2_0',
  weight: 1343,
  category: 'aero',
  depth: 58,
  externalWidth: 28.7,
  internalWidth: 21,
  spokes: { ...carbonSpokes, count: { front: 20, rear: 20 } },
  hub: discCarbonSpokeHub,
  url: urls.cd20,
  priceUsd: 989,
  otherSpecs: {
    hubBearingType: 'Steel bearings, front: 2x6803, rear: 2x15267 + 2x6802',


    spoke_lacing: '1:1 pattern',
    tire_compatibility: 'Tubeless/clincher; 700x25c-700x47c',
    rim_bed: 'Drilled',
    titanium_freehub_upgrade_weight_delta_grams: 18
  }
}),
makeWheel({
  id: 302,
  model: 'Road Disc LV 2.0 Series',
  variant: 'lv35_2_0',
  weight: 1224,
  category: 'climbing',
  depth: 35,
  externalWidth: 28,
  internalWidth: 21,
  spokes: { ...sapimCxRaySpokes, count: { front: 24, rear: 24 } },
  hub: discSteelSpokeHub,
  url: urls.lv20,
  priceUsd: 989,
  otherSpecs: {
    hubBearingType: 'Steel bearings, front: 2x6802, rear: 1x15267 + 3x6802',


    spoke_lacing: '2X front, 2X rear',
    tire_compatibility: 'Tubeless/clincher; 700x25c-700x47c',
    rim_bed: 'No holes drilled',
    titanium_freehub_upgrade_weight_delta_grams: 18
  }
}),
makeWheel({
  id: 303,
  model: 'Road Disc LV 2.0 Series',
  variant: 'lv45_2_0',
  weight: 1309,
  category: 'all-round',
  depth: 45,
  externalWidth: 28,
  internalWidth: 21,
  spokes: { ...sapimCxRaySpokes, count: { front: 24, rear: 24 } },
  hub: discSteelSpokeHub,
  url: urls.lv20,
  priceUsd: 989,
  otherSpecs: {
    hubBearingType: 'Steel bearings, front: 2x6802, rear: 1x15267 + 3x6802',


    spoke_lacing: '2X front, 2X rear',
    tire_compatibility: 'Tubeless/clincher; 700x25c-700x47c',
    rim_bed: 'No holes drilled',
    titanium_freehub_upgrade_weight_delta_grams: 18
  }
}),
makeWheel({
  id: 304,
  model: 'Road Disc LV 2.0 Series',
  variant: 'lv55_2_0',
  weight: 1407,
  category: 'aero',
  depth: 55,
  externalWidth: 28,
  internalWidth: 21,
  spokes: { ...sapimCxRaySpokes, count: { front: 24, rear: 24 } },
  hub: discSteelSpokeHub,
  url: urls.lv20,
  priceUsd: 989,
  otherSpecs: {
    hubBearingType: 'Steel bearings, front: 2x6802, rear: 1x15267 + 3x6802',


    spoke_lacing: '2X front, 2X rear',
    tire_compatibility: 'Tubeless/clincher; 700x25c-700x47c',
    rim_bed: 'No holes drilled',
    titanium_freehub_upgrade_weight_delta_grams: 18
  }
}),
makeWheel({
  id: 305,
  model: 'Road Rim Brake Lightweight RL Series',
  variant: 'rl40',
  weight: 1346,
  brakeType: 'rim',
  category: 'all-round',
  depth: 40,
  externalWidth: 26.3,
  internalWidth: 19,
  spokes: { ...sapimCxRaySpokes, count: { front: 20, rear: 24 } },
  hub: rimBrakeHub,
  url: urls.rl,
  priceUsd: 964,
  otherSpecs: {
    hubBearingType: 'Steel bearings, front: 2x6803, rear: 1x15267 + 3x6802',


    tire_compatibility: 'Tubeless/clincher; 700x23c-700x45c',
    rim_bed: 'No holes drilled',
    brake_track: 'Specific heat-resistant rim-brake track; brake pads included'
  }
}),
makeWheel({
  id: 306,
  model: 'Road Rim Brake Lightweight RL Series',
  variant: 'rl55',
  weight: 1469,
  brakeType: 'rim',
  category: 'aero',
  depth: 55,
  externalWidth: 27,
  internalWidth: 19,
  spokes: { ...sapimCxRaySpokes, count: { front: 20, rear: 24 } },
  hub: rimBrakeHub,
  url: urls.rl,
  priceUsd: 964,
  otherSpecs: {
    hubBearingType: 'Steel bearings, front: 2x6803, rear: 1x15267 + 3x6802',


    tire_compatibility: 'Tubeless/clincher; 700x23c-700x45c',
    rim_bed: 'No holes drilled',
    brake_track: 'Specific heat-resistant rim-brake track; brake pads included'
  }
}),
makeWheel({
  id: 307,
  model: 'Carbon Spoke Rim Brake CV Series',
  variant: 'cv40',
  weight: 1300,
  brakeType: 'rim',
  category: 'all-round',
  depth: 40,
  externalWidth: 26,
  internalWidth: 19,
  spokes: { ...carbonSpokes, count: { front: 18, rear: 21 } },
  hub: {
    model: 'V350 straight-pull ratchet',
    brand: '9Velo',
    axle_front_mm: '9x100',
    axle_rear_mm: '10x130',
    freehub_options: ['Shimano HG', 'SRAM XDR'],
    disc_standard: null
  },
  url: urls.cv,
  priceUsd: 899,
  otherSpecs: {
    hubBearingType: 'Steel bearings, front: 2x6802, rear: 3x6802 + 1x15267',


    spoke_lacing: 'Radial front, 2X rear',
    tire_compatibility: 'Tubeless; 700x23c-700x45c',
    brake_track: '9Velo-specific brake pads included'
  }
}),
makeWheel({
  id: 308,
  model: 'Carbon Spoke Rim Brake CV Series',
  variant: 'cv55',
  weight: 1425,
  brakeType: 'rim',
  category: 'aero',
  depth: 55,
  externalWidth: 26,
  internalWidth: 19,
  spokes: { ...carbonSpokes, count: { front: 18, rear: 21 } },
  hub: {
    model: 'V350 straight-pull ratchet',
    brand: '9Velo',
    axle_front_mm: '9x100',
    axle_rear_mm: '10x130',
    freehub_options: ['Shimano HG', 'SRAM XDR'],
    disc_standard: null
  },
  url: urls.cv,
  priceUsd: 899,
  otherSpecs: {
    hubBearingType: 'Steel bearings, front: 2x6802, rear: 3x6802 + 1x15267',


    spoke_lacing: 'Radial front, 2X rear',
    tire_compatibility: 'Tubeless; 700x23c-700x45c',
    brake_track: '9Velo-specific brake pads included'
  }
})];