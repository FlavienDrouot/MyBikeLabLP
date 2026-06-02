import { describe, it, expect, beforeAll } from 'vitest';
import i18n from 'i18next';
import { WHEEL_PROPERTIES } from '../wheelProperties';
import { wheelsData } from '../../data/wheelsData';
import { renderCellFor } from '../../components/MiniComparator/columnCells';
import enTranslations from '../../../public/locales/en.json';
import frTranslations from '../../../public/locales/fr.json';

// The shared test-setup (src/test-setup.js) initializes the real i18next
// instance with the `en` and `xx` resource bundles. The `fr` bundle is not
// registered there, so we add it here (test-local) to be able to switch to
// the `fr` locale via `i18n.t(key, { lng: 'fr' })` without modifying the
// production setup.
beforeAll(() => {
  if (!i18n.hasResourceBundle('fr', 'translation')) {
    i18n.addResourceBundle('fr', 'translation', frTranslations, true, true);
  }
});

const LOCALES = ['en', 'fr', 'xx'];

// A value is "missing" (rendered via the localized fallback at display time,
// per EVO-034) when it is undefined, null or an empty string. The underlying
// wheel data legitimately contains such values and must NOT be modified — the
// renderer (TASK-002) maps them to `common.notAvailable`.
const isMissing = (value) => value === undefined || value === null || value === '';

// A "raw key" is a translatable value that still matches the dotted
// `<propertyId>.<value>` pattern after translation (e.g. `spokeMaterial.steel`),
// meaning no translation was found and the key leaked to the UI.
const isRawKey = (propertyId, rendered) =>
  typeof rendered === 'string' && new RegExp(`^${propertyId}\\.`).test(rendered);

// ---------------------------------------------------------------------------
// Suite 1: Registry completeness (AC-001, AC-002, AC-003)
// ---------------------------------------------------------------------------

describe('WHEEL_PROPERTIES registry — translatable field', () => {
  it('every entry has an explicit boolean translatable field', () => {
    for (const property of WHEEL_PROPERTIES) {
      expect(
        typeof property.translatable,
        `Property "${property.id}" is missing an explicit boolean translatable field`,
      ).toBe('boolean');
    }
  });

  it('rimMaterial, spokeMaterial, hookless are translatable: true', () => {
    const rimMaterial = WHEEL_PROPERTIES.find((p) => p.id === 'rimMaterial');
    const spokeMaterial = WHEEL_PROPERTIES.find((p) => p.id === 'spokeMaterial');
    const hookless = WHEEL_PROPERTIES.find((p) => p.id === 'hookless');

    expect(rimMaterial?.translatable, 'rimMaterial should be translatable: true').toBe(true);
    expect(spokeMaterial?.translatable, 'spokeMaterial should be translatable: true').toBe(true);
    expect(hookless?.translatable, 'hookless should be translatable: true').toBe(true);
  });

  it('brand, model, hubBrand, hubModel, spokesBrand, spokesModel, weight, price, diameter, depth, externalWidth are translatable: false', () => {
    const ids = ['brand', 'model', 'hubBrand', 'hubModel', 'spokesBrand', 'spokesModel', 'weight', 'price', 'diameter', 'depth', 'externalWidth'];
    for (const id of ids) {
      const property = WHEEL_PROPERTIES.find((p) => p.id === id);
      expect(property?.translatable, `"${id}" should be translatable: false`).toBe(false);
    }
  });

  it('image, hub, spokes are translatable: false', () => {
    const ids = ['image', 'hub', 'spokes'];
    for (const id of ids) {
      const property = WHEEL_PROPERTIES.find((p) => p.id === id);
      expect(property?.translatable, `"${id}" should be translatable: false`).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// Suite 2: Translation key coverage via XX locale (AC-004, AC-007)
// ---------------------------------------------------------------------------

describe('XX locale — translatable field value coverage', () => {
  it('all distinct rimMaterial values in the dataset resolve to "XX" under the xx locale', () => {
    const values = [...new Set(wheelsData.map((w) => w.rim.material))].filter((v) => !isMissing(v));
    for (const value of values) {
      const key = `rimMaterial.${value}`;
      const resolved = i18n.t(key, { lng: 'xx' });
      expect(resolved, `Missing translation key: ${key}`).toBe('XX');
    }
  });

  it('all distinct (non-missing) spokeMaterial values in the dataset resolve to "XX" under the xx locale', () => {
    // Missing/empty/null values are not categorical keys: they are handled at
    // display time by the renderer fallback (EVO-034), not by locale keys.
    const values = [...new Set(wheelsData.map((w) => w.spokes.material))].filter((v) => !isMissing(v));
    for (const value of values) {
      const key = `spokeMaterial.${value}`;
      const resolved = i18n.t(key, { lng: 'xx' });
      expect(resolved, `Missing translation key: ${key}`).toBe('XX');
    }
  });

  it('hookless true and false both resolve to "XX" under the xx locale', () => {
    for (const boolStr of ['true', 'false']) {
      const key = `hookless.${boolStr}`;
      const resolved = i18n.t(key, { lng: 'xx' });
      expect(resolved, `Missing translation key: ${key}`).toBe('XX');
    }
  });
});

// ---------------------------------------------------------------------------
// Suite 3: en and fr locale key presence (AC-004)
// ---------------------------------------------------------------------------

describe('en and fr locales — required categorical keys exist', () => {
  it('en locale contains all required rimMaterial keys', () => {
    expect(enTranslations.rimMaterial?.carbon).toBeTruthy();
    expect(enTranslations.rimMaterial?.aluminum).toBeTruthy();
  });

  it('en locale contains all required spokeMaterial keys', () => {
    expect(enTranslations.spokeMaterial?.stainless_steel).toBeTruthy();
    expect(enTranslations.spokeMaterial?.aluminum).toBeTruthy();
  });

  it('en locale contains all required hookless keys', () => {
    expect(enTranslations.hookless?.true).toBeTruthy();
    expect(enTranslations.hookless?.false).toBeTruthy();
  });

  it('fr locale contains all required rimMaterial keys', () => {
    expect(frTranslations.rimMaterial?.carbon).toBeTruthy();
    expect(frTranslations.rimMaterial?.aluminum).toBeTruthy();
  });

  it('fr locale contains all required spokeMaterial keys', () => {
    expect(frTranslations.spokeMaterial?.stainless_steel).toBeTruthy();
    expect(frTranslations.spokeMaterial?.aluminum).toBeTruthy();
  });

  it('fr locale contains all required hookless keys', () => {
    expect(frTranslations.hookless?.true).toBeTruthy();
    expect(frTranslations.hookless?.false).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Suite 4: spokeMaterial full coverage across en / fr / xx (AC-002)
// ---------------------------------------------------------------------------

describe('spokeMaterial — full label coverage per locale (AC-002)', () => {
  // Distinct, non-missing dataset values PLUS the three values explicitly
  // required by EVO-034 (which may not all appear in the dataset today).
  const datasetValues = [...new Set(wheelsData.map((w) => w.spokes.material))].filter((v) => !isMissing(v));
  const requiredValues = ['carbon', 'carbon_composite', 'steel'];
  const values = [...new Set([...datasetValues, ...requiredValues])];

  for (const lng of LOCALES) {
    it(`every distinct spokeMaterial value resolves to a non-empty, non-key label in "${lng}"`, () => {
      for (const value of values) {
        const key = `spokeMaterial.${value}`;
        const resolved = i18n.t(key, { lng });
        expect(typeof resolved, `spokeMaterial.${value} should resolve to a string in ${lng}`).toBe('string');
        expect(resolved.length, `spokeMaterial.${value} resolved to an empty string in ${lng}`).toBeGreaterThan(0);
        expect(resolved, `spokeMaterial.${value} leaked the raw key in ${lng}`).not.toBe(key);
      }
    });
  }

  it('explicitly covers carbon, carbon_composite and steel in every locale', () => {
    for (const lng of LOCALES) {
      for (const value of requiredValues) {
        const key = `spokeMaterial.${value}`;
        const resolved = i18n.t(key, { lng });
        expect(resolved, `${key} missing in ${lng}`).not.toBe(key);
        expect(resolved.length, `${key} empty in ${lng}`).toBeGreaterThan(0);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Suite 5: Missing-value fallback via renderCellFor (AC-003)
// ---------------------------------------------------------------------------

describe('renderCellFor — missing value fallback (AC-003)', () => {
  const spokeMaterial = WHEEL_PROPERTIES.find((p) => p.id === 'spokeMaterial');

  for (const lng of LOCALES) {
    for (const missing of [undefined, null, '']) {
      it(`a ${JSON.stringify(missing)} translatable value yields common.notAvailable in "${lng}"`, () => {
        const t = (key, opts) => i18n.t(key, { lng, ...opts });
        const fakeWheel = { spokes: { material: missing } };
        const rendered = renderCellFor(spokeMaterial, t)(fakeWheel);
        expect(rendered).toBe(i18n.t('common.notAvailable', { lng }));
      });
    }
  }
});

// ---------------------------------------------------------------------------
// Suite 6: Generic, property-agnostic fallback (AC-004)
// ---------------------------------------------------------------------------

describe('renderCellFor — generic fallback (AC-004)', () => {
  for (const lng of LOCALES) {
    it(`a synthetic translatable property with an empty accessor yields the fallback in "${lng}"`, () => {
      const t = (key, opts) => i18n.t(key, { lng, ...opts });
      const syntheticProperty = {
        id: 'totallyMadeUpProperty',
        translatable: true,
        accessor: () => '',
      };
      const rendered = renderCellFor(syntheticProperty, t)({});
      expect(rendered).toBe(i18n.t('common.notAvailable', { lng }));
    });

    it(`a synthetic translatable property with an unknown value falls back (no raw key) in "${lng}"`, () => {
      const t = (key, opts) => i18n.t(key, { lng, ...opts });
      const syntheticProperty = {
        id: 'totallyMadeUpProperty',
        translatable: true,
        accessor: () => 'someUnknownValue',
      };
      const rendered = renderCellFor(syntheticProperty, t)({});
      expect(rendered).toBe(i18n.t('common.notAvailable', { lng }));
      expect(isRawKey('totallyMadeUpProperty', rendered)).toBe(false);
    });
  }
});

// ---------------------------------------------------------------------------
// Suite 7: Dataset-wide raw-key absence scan (AC-001)
// ---------------------------------------------------------------------------

describe('renderCellFor — no raw dotted key across the whole dataset (AC-001)', () => {
  // Translatable properties whose cell is a plain translated string (i.e. no
  // renderCell override, which returns JSX rather than a translated string).
  const scannableProperties = WHEEL_PROPERTIES.filter(
    (p) => p.translatable && !p.column?.renderCell,
  );

  it('there is at least one scannable translatable property', () => {
    expect(scannableProperties.length).toBeGreaterThan(0);
  });

  for (const lng of LOCALES) {
    it(`no comparator cell yields a raw "<id>.<value>" key in "${lng}"`, () => {
      const t = (key, opts) => i18n.t(key, { lng, ...opts });
      for (const property of scannableProperties) {
        const render = renderCellFor(property, t);
        for (const wheel of wheelsData) {
          const rendered = render(wheel);
          expect(
            isRawKey(property.id, rendered),
            `Property "${property.id}" rendered a raw key "${rendered}" in ${lng}`,
          ).toBe(false);
        }
      }
    });
  }
});

// ---------------------------------------------------------------------------
// Suite 8: Boolean non-regression (AC-003 / design constraint)
// ---------------------------------------------------------------------------

describe('renderCellFor — boolean false non-regression', () => {
  // tubelessReady now has a renderCell override (TubelessBadge JSX).
  // A synthetic property reusing its translation keys tests the core
  // translatable-boolean path of renderCellFor without the JSX detour.
  const syntheticBoolProperty = {
    id: 'tubelessReady',
    translatable: true,
    accessor: (w) => w.rim?.tubeless_ready,
  };

  for (const lng of LOCALES) {
    it(`a translatable boolean "false" resolves to its own translation, not the fallback, in "${lng}"`, () => {
      const t = (key, opts) => i18n.t(key, { lng, ...opts });
      const fakeWheel = { rim: { tubeless_ready: false } };
      const rendered = renderCellFor(syntheticBoolProperty, t)(fakeWheel);

      const ownTranslation = i18n.t('tubelessReady.false', { lng });
      const fallback = i18n.t('common.notAvailable', { lng });

      expect(rendered).toBe(ownTranslation);
      // In en/fr the two strings differ, guaranteeing it did not fall back.
      // In xx both are "XX", so we additionally assert the key resolved.
      expect(rendered).not.toBe('tubelessReady.false');
      if (lng !== 'xx') {
        expect(rendered).not.toBe(fallback);
      }
    });
  }
});
