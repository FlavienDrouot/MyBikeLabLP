// Small visual components reused in comparison table cells.
// Extracted from old columnsConfig.jsx to allow the registry
// (config/wheelProperties.jsx) to import the render without circular dependency.

export const HookBadge = ({ hookless }) => (
  <span
    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
      hookless
        ? 'bg-brass-3 text-brass-10'
        : 'bg-ink-2 text-ink-8'
    }`}
  >
    {hookless ? 'Hookless' : 'Hooked'}
  </span>
);
