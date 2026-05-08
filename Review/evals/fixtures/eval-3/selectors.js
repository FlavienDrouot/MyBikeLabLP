// frontend/src/store/selectors/wheelsSelectors.js

export const selectAllWheels = (state) => state.wheels.byId;

export const selectFilters = (state) => state.filters;

export const selectFilteredWheels = (state) => {
  const wheels = Object.values(state.wheels.byId);
  const filters = state.filters;

  return wheels
    .filter((w) => {
      if (filters.minDiameter && w.diameter < filters.minDiameter) return false;
      if (filters.maxDiameter && w.diameter > filters.maxDiameter) return false;
      if (filters.minPrice && w.price < filters.minPrice) return false;
      if (filters.maxPrice && w.price > filters.maxPrice) return false;
      if (filters.brand && w.brand !== filters.brand) return false;
      return true;
    })
    .map((w) => ({
      id: w.id,
      label: `${w.brand} ${w.name}`,
      diameter: w.diameter,
      price: w.price,
      pricePerInch: w.price / w.diameter,
    }))
    .sort((a, b) => a.price - b.price);
};

export const selectWheelStats = (state) => {
  const wheels = Object.values(state.wheels.byId);
  return {
    count: wheels.length,
    avgPrice: wheels.reduce((s, w) => s + w.price, 0) / wheels.length,
    brands: [...new Set(wheels.map((w) => w.brand))],
  };
};
