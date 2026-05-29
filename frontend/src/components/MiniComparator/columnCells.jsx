// Shared cell rendering helpers for the comparison table and its hidden
// measuring twin (MeasuringTable). Both must render identical cell content and
// classes so the measured column widths match what the visible table displays.

export const renderCellFor = (property) =>
  property.column?.renderCell ??
  ((w) => `${property.accessor(w)}${property.unit ?? ''}`);

export const cellClassFor = (property) => {
  const base = property.column?.cellClassName ?? `px-4 py-3 text-ink-11`;
  return property.unit !== undefined ? `${base} font-mono tabular-nums` : base;
};
