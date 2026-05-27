import { forwardRef } from 'react';

const DS_PROPS = {
  strokeWidth: 1.4,
  strokeLinecap: 'square',
  strokeLinejoin: 'miter',
  color: 'currentColor',
};

const Icon = forwardRef(({ as: LucideIcon, size = 16, ...rest }, ref) => (
  <LucideIcon ref={ref} size={size} {...DS_PROPS} {...rest} />
));

Icon.displayName = 'Icon';
export default Icon;
