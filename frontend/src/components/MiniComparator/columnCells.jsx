// Shared cell rendering helpers for the comparison table and its hidden
// measuring twin (MeasuringTable). Both must render identical cell content and
// classes so the measured column widths match what the visible table displays.

export const renderCellFor = (property, t, ctx) => {
  if (property.column?.renderCell) {
    return (w) => property.column.renderCell(w, t, ctx);
  }
  if (property.translatable && t) {
    return (w) => {
      const value = property.accessor(w, ctx);
      // Missing/empty value → localized fallback. Note: boolean false and
      // numeric 0 are real values and must keep resolving to their own keys.
      if (value === undefined || value === null || value === '') {
        return t('common.notAvailable');
      }
      // Present value: resolve its key, falling back to the localized label
      // when no translation exists (so a raw dotted key never leaks to the UI).
      return t(`${property.id}.${value}`, {
        defaultValue: t('common.notAvailable'),
      });
    };
  }
  return (w) => {
    const value = property.accessor(w, ctx);
    if (value === undefined || value === null || value === '') return t('common.notAvailable');
    return `${value}${property.unit ?? ''}`;
  };
};

export const cellClassFor = (property) => {
  const base = property.column?.cellClassName ?? `px-4 py-3 text-content-primary`;
  return property.unit !== undefined ? `${base} font-mono tabular-nums` : base;
};
