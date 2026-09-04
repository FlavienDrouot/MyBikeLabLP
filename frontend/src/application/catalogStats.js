import { getFilterableProperties } from '../domain/wheelProperties';
import { wheelsData } from '../data/wheelsData';

// Narrow read API for landing-page catalog figures. Components do not need to
// know how the catalog is assembled or how these figures are calculated.
export const getCatalogStats = (items = wheelsData) => ({
  wheelCount: items.length,
  filterAxisCount: getFilterableProperties().length,
  brandCount: new Set(items.map((wheel) => wheel.brand)).size,
});
