// Small visual components reused in comparison table cells.
// Extracted from old columnsConfig.jsx to allow the registry
// (config/wheelProperties.jsx) to import the render without circular dependency.

export const HookBadge = ({ hookless }) => (
  <span
    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
      hookless
        ? 'bg-brand-50 text-brand-700'
        : 'bg-ink-100 text-ink-700'
    }`}
  >
    {hookless ? 'Hookless' : 'Hooked'}
  </span>
);
