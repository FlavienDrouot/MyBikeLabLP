export const collectRangeBoundValues = (property, item, ctx) => {
  const rawValue = property.filterAccessor
    ? property.filterAccessor(item, ctx)
    : property.accessor(item, ctx);

  if (Number.isFinite(rawValue)) return [rawValue];

  if (Array.isArray(rawValue)) {
    return rawValue.filter(Number.isFinite);
  }

  if (rawValue != null && typeof rawValue === 'object') {
    return [rawValue.min, rawValue.max].filter(Number.isFinite);
  }

  return [];
};

export const collectRangeBoundValuesForItems = (property, items, ctx) =>
  items.flatMap((item) => collectRangeBoundValues(property, item, ctx));
