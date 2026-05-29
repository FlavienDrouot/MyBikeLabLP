// Shared cell rendering helpers for the comparison table and its hidden
// measuring twin (MeasuringTable). Both must render identical cell content and
// classes so the measured column widths match what the visible table displays.

export const renderCellFor = (property, t) => {
  // Safe fallback for legacy callers that have not yet been updated to pass t
  // (TASK-005 will update them). Returns the translation key as-is rather than
  // crashing when t is undefined.
  const safeT = t ?? ((key) => key);
  if (property.column?.renderCell) {
    return (w) => property.column.renderCell(w, safeT);
  }
  if (property.translatable && t) {
    return (w) => t(property.id + '.' + property.accessor(w));
  }
  return (w) => `${property.accessor(w)}${property.unit ?? ''}`;
};

export const cellClassFor = (property) => {
  const base = property.column?.cellClassName ?? `px-4 py-3 text-ink-11`;
  return property.unit !== undefined ? `${base} font-mono tabular-nums` : base;
};
