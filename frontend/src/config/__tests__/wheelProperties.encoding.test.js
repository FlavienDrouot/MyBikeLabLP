import { describe, expect, it } from 'vitest';
import { formatDiameter, WHEEL_PROPERTIES } from '../wheelProperties';

const property = (id) => WHEEL_PROPERTIES.find((candidate) => candidate.id === id);
const character = (codePoint) => String.fromCodePoint(codePoint);

describe('wheel property technical glyphs', () => {
  it('formats diameter with the diameter sign', () => {
    expect(formatDiameter(700)).toBe(`${character(0x00d8)} 700C`);
    expect(formatDiameter(650)).toBe(`${character(0x00d8)} 650B`);
  });

  it('formats missing axle dimensions with an em dash', () => {
    const dash = character(0x2014);
    expect(property('axle').accessor({})).toBe(`${dash} / ${dash}`);
  });

  it('does not return known mojibake markers for the affected values', () => {
    const mojibakeMarkers = [
      character(0x00c3),
      character(0x00c2),
      character(0x00e2),
      character(0x00f0),
      character(0xfffd),
    ];
    const rendered = [
      formatDiameter(700),
      property('axle').accessor({}),
    ].join(' ');

    for (const marker of mojibakeMarkers) {
      expect(rendered).not.toContain(marker);
    }
  });
});
