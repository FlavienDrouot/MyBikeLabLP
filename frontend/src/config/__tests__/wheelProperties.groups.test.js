import { describe, expect, it } from 'vitest';
import { COLUMN_GROUPS, WHEEL_PROPERTIES } from '../wheelProperties';

const declaredGroupIds = COLUMN_GROUPS.map((group) => group.id);

describe('WHEEL_PROPERTIES registry groups', () => {
  it('declares every group used by a property', () => {
    for (const property of WHEEL_PROPERTIES) {
      expect(
        declaredGroupIds,
        `Property "${property.id}" uses undeclared group "${property.group}"`,
      ).toContain(property.group);
    }
  });

  it('does not use the legacy subs group', () => {
    expect(declaredGroupIds).not.toContain('subs');

    for (const property of WHEEL_PROPERTIES) {
      expect(property.group, `Property "${property.id}" still uses subs`).not.toBe('subs');
    }
  });

  it('assigns current hub properties to the hub group', () => {
    const hubPropertyIds = ['hub', 'hubBrand', 'hubModel', 'axle', 'freehubOptions', 'discStandard', 'hubBearingType', 'hubMaterial'];

    for (const id of hubPropertyIds) {
      const property = WHEEL_PROPERTIES.find((candidate) => candidate.id === id);
      expect(property?.group, `${id} should belong to hub`).toBe('hub');
    }
  });

  it('assigns current spoke properties to the spokes group', () => {
    const spokePropertyIds = ['spokes', 'spokesBrand', 'spokesModel', 'spokeMaterial', 'spokeCount', 'spokeNipple', 'spokeType', 'spokeProfile', 'spokeLacing'];

    for (const id of spokePropertyIds) {
      const property = WHEEL_PROPERTIES.find((candidate) => candidate.id === id);
      expect(property?.group, `${id} should belong to spokes`).toBe('spokes');
    }
  });

  it('declares promoted hub fields as multi-select filters', () => {
    const filterableHubPropertyIds = ['hubBearingType', 'hubMaterial'];

    for (const id of filterableHubPropertyIds) {
      const property = WHEEL_PROPERTIES.find((candidate) => candidate.id === id);
      expect(property?.group, `${id} should belong to hub`).toBe('hub');
      expect(property?.filter, `${id} should be filterable`).toEqual({ type: 'multiSelect' });
    }
  });

  it('declares promoted spoke count as a range filter', () => {
    const property = WHEEL_PROPERTIES.find((candidate) => candidate.id === 'spokeCount');

    expect(property?.group).toBe('spokes');
    expect(property?.filter).toEqual({ type: 'range' });
  });

  it('declares promoted spoke detail fields as multi-select filters', () => {
    const filterableSpokeDetailPropertyIds = ['spokeNipple', 'spokeType', 'spokeProfile', 'spokeLacing'];

    for (const id of filterableSpokeDetailPropertyIds) {
      const property = WHEEL_PROPERTIES.find((candidate) => candidate.id === id);
      expect(property?.group, `${id} should belong to spokes`).toBe('spokes');
      expect(property?.filter, `${id} should be filterable`).toEqual({ type: 'multiSelect' });
    }
  });

<<<<<<< HEAD
  it('declares promoted rim construction as a multi-select filter', () => {
    const property = WHEEL_PROPERTIES.find((candidate) => candidate.id === 'rimConstruction');

    expect(property?.group).toBe('rims');
    expect(property?.filter).toEqual({ type: 'multiSelect' });
=======
  it('declares promoted rim max tire pressure as a range filter with sorts', () => {
    const property = WHEEL_PROPERTIES.find((candidate) => candidate.id === 'maxTirePressure');

    expect(property?.group).toBe('rims');
    expect(property?.filter).toEqual({ type: 'range' });
    expect(property?.sorts?.map((sort) => sort.id)).toEqual([
      'maxTirePressure_asc',
      'maxTirePressure_desc',
    ]);
>>>>>>> evo-052-rim-max-tire-pressure
  });
});
