import { describe, it, expect } from 'vitest';
import i18n from 'i18next';
import { WHEEL_PROPERTIES } from '../wheelProperties';
import { wheelsData } from '../../data/wheelsData';
import enTranslations from '../../../public/locales/en.json';
import frTranslations from '../../../public/locales/fr.json';

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

  it('brand, model, hubBrand, hubModel, spokesBrand, spokesModel, weight, price, diameter, depth, rimWidth are translatable: false', () => {
    const ids = ['brand', 'model', 'hubBrand', 'hubModel', 'spokesBrand', 'spokesModel', 'weight', 'price', 'diameter', 'depth', 'rimWidth'];
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
    const values = [...new Set(wheelsData.map((w) => w.rim.material))];
    for (const value of values) {
      const key = `rimMaterial.${value}`;
      const resolved = i18n.t(key, { lng: 'xx' });
      expect(resolved, `Missing translation key: ${key}`).toBe('XX');
    }
  });

  it('all distinct spokeMaterial values in the dataset resolve to "XX" under the xx locale', () => {
    const values = [...new Set(wheelsData.map((w) => w.spokes.material))];
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
