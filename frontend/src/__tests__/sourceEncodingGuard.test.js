import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_EXTENSIONS = new Set(['.css', '.js', '.jsx', '.json']);
const MOJIBAKE_MARKERS = [0x00c3, 0x00c2, 0x00e2, 0x00f0, 0xfffd]
  .map((codePoint) => String.fromCodePoint(codePoint));

const sourceFilesUnder = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return sourceFilesUnder(path);
    return SOURCE_EXTENSIONS.has(extname(entry.name)) ? [path] : [];
  });

describe('frontend source encoding', () => {
  it('contains no detectable mojibake markers', () => {
    const findings = [];

    for (const path of sourceFilesUnder(SOURCE_ROOT)) {
      const content = readFileSync(path, 'utf8');
      for (const marker of MOJIBAKE_MARKERS) {
        if (content.includes(marker)) {
          findings.push(`${path}: ${JSON.stringify(marker)}`);
        }
      }
    }

    expect(findings).toEqual([]);
  });
});
