export const minPrice = (wheel) =>
  Math.min(...wheel.prices.map((p) => p.price_eur));

export const selectFilteredWheels = (state) => {
  const { wheels, filters } = state;
  return wheels.items
    .filter((wheel) => {
      // Each filter is bypassed when its corresponding *Enabled flag is false,
      // so the user can pause a filter without losing its current values.
      const brandMatch =
        !filters.brandsEnabled ||
        filters.brands.length === 0 ||
        filters.brands.includes(wheel.brand);
      const matMatch =
        !filters.rimMaterialsEnabled ||
        filters.rimMaterials.length === 0 ||
        filters.rimMaterials.includes(wheel.rim.material);
      const hooklessMatch =
        !filters.hooklessEnabled ||
        filters.hookless === null ||
        wheel.rim.hookless === filters.hookless;
      const weightMatch =
        !filters.weightEnabled ||
        (wheel.weight_grams >= filters.minWeight &&
          wheel.weight_grams <= filters.maxWeight);
      const depthMatch =
        !filters.depthEnabled ||
        (wheel.rim.depth_mm >= filters.minDepth &&
          wheel.rim.depth_mm <= filters.maxDepth);
      const wheelMin = minPrice(wheel);
      const priceMatch =
        !filters.priceEnabled ||
        (wheelMin >= filters.minPrice && wheelMin <= filters.maxPrice);
      return (
        brandMatch &&
        matMatch &&
        hooklessMatch &&
        weightMatch &&
        depthMatch &&
        priceMatch
      );
    })
    .slice()
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'weight_asc':
          return a.weight_grams - b.weight_grams;
        case 'weight_desc':
          return b.weight_grams - a.weight_grams;
        case 'price_asc':
          return minPrice(a) - minPrice(b);
        case 'price_desc':
          return minPrice(b) - minPrice(a);
        case 'depth_asc':
          return a.rim.depth_mm - b.rim.depth_mm;
        case 'depth_desc':
          return b.rim.depth_mm - a.rim.depth_mm;
        default:
          return a.model.localeCompare(b.model);
      }
    });
};

export const selectAllBrands = (state) =>
  [...new Set(state.wheels.items.map((w) => w.brand))].sort();

export const selectAllRimMaterials = (state) =>
  [...new Set(state.wheels.items.map((w) => w.rim.material))].sort();
