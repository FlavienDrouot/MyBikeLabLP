import { describe, it, expect } from 'vitest';
import { wheelsData } from '../wheelsData';

// ---------------------------------------------------------------------------
// Image URL hygiene
//
// Scraped image URLs sometimes carry non-ASCII filenames (e.g. Chinese
// characters) that get stored as mojibake — UTF-8 bytes mis-decoded as
// Windows-1252. The browser then re-encodes those corrupted code points and
// the host returns 404, so the image silently fails to render.
//
// Any non-ASCII character in a stored URL is the tell-tale sign: a correct
// non-ASCII filename must be percent-encoded (pure ASCII) before storage.
// ---------------------------------------------------------------------------

// True when the string contains any character outside printable ASCII (0x20–0x7E).
const hasNonAscii = (str) => {
  for (let i = 0; i < str.length; i += 1) {
    const code = str.charCodeAt(i);
    if (code < 0x20 || code > 0x7e) return true;
  }
  return false;
};

const collectUrls = (wheel) => {
  const urls = [];
  if (typeof wheel.image === 'string') urls.push(wheel.image);
  if (Array.isArray(wheel.images)) {
    for (const url of wheel.images) {
      if (typeof url === 'string') urls.push(url);
    }
  }
  return urls;
};

describe('image URL hygiene', () => {
  it('contains no non-ASCII characters in any image URL (mojibake guard)', () => {
    const offenders = [];

    for (const wheel of wheelsData) {
      for (const url of collectUrls(wheel)) {
        if (hasNonAscii(url)) {
          offenders.push({ id: wheel.id, brand: wheel.brand, model: wheel.model, url });
        }
      }
    }

    expect(
      offenders,
      `Found ${offenders.length} image URL(s) with non-ASCII characters ` +
        `(percent-encode them):\n` +
        offenders.map((o) => `  - id ${o.id} [${o.brand} ${o.model}]: ${o.url}`).join('\n'),
    ).toEqual([]);
  });
});
