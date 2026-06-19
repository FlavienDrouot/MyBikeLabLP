import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { execPath } from 'node:process';
import { describe, expect, it } from 'vitest';

describe('other-specs-promote tire-width codemod', () => {
  it('parses ETRTO tire-width ranges before generic numeric ranges', () => {
    const source = `
export const wheels = [
  {
    rim: {},
    other_specs: {
      recommended_tire_size: '25-622 - 32-622',
    },
  },
];
`;
    const productRoot = fileURLToPath(new URL('../../../../', import.meta.url));
    const code = `
import('./scripts/codemods/other-specs-promote.mjs')
  .then(({ promoteTireWidthMm }) => {
    process.stdout.write(promoteTireWidthMm(${JSON.stringify(source)}));
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
`;

    const next = execFileSync(execPath, ['-e', code], {
      cwd: productRoot,
      encoding: 'utf8',
    });

    expect(next).toContain('tire_width_mm: { min: 25, max: 32 }');
    expect(next).not.toContain('max: 622');
    expect(next).not.toContain('recommended_tire_size');
  });
});
