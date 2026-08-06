import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { publishCatalog, validateCatalog } from '../../../../scripts/build-frontend-data.mjs';
import { aggregateWheelData } from '../wheelsData';

const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

const wheel = (id, brand, currency = 'EUR') => ({
  id,
  brand,
  model: `Model ${id}`,
  prices: [{ amount: 100, currency, url: `https://example.test/${id}` }],
});

describe('frontend JSON publication contract', () => {
  it('rejects invalid catalog invariants and unsupported offer currencies', () => {
    expect(() => validateCatalog([])).toThrow('non-empty array');
    expect(() => validateCatalog([wheel(1, 'Mavic'), wheel(1, 'Zipp')])).toThrow('duplicate id 1');
    expect(() => validateCatalog([wheel(1, 'Mavic', 'GBP')])).toThrow('currency must be EUR or USD');
    expect(() => validateCatalog([wheel(0, 'Mavic')])).toThrow('id must be a positive integer');
    expect(() => validateCatalog([wheel(-1, 'Mavic')])).toThrow('id must be a positive integer');
    expect(() => validateCatalog([wheel(50, 'Mavic'), wheel(137, 'Zipp')])).not.toThrow();
    expect(() => validateCatalog([wheel(1, 'Mavic'), { ...wheel(2, 'Mavic'), model: 'Model 1' }])).toThrow('duplicate configuration Mavic / Model 1 / default');
    expect(() => validateCatalog([{ ...wheel(1, 'Mavic'), model: 'Shared', variant: 'carbon_spokes' }])).not.toThrow();
  });

  it('validates explicit allocation floors without rejecting historical IDs by default', () => {
    expect(() => validateCatalog([{ ...wheel(90001, 'Channel3'), variant: 'legacy_a' }, { ...wheel(90002, 'Channel3'), variant: 'legacy_b' }])).not.toThrow();
    expect(() => validateCatalog([{ ...wheel(90002, 'Channel3'), variant: 'new_variant' }], { idFloor: 90003 })).toThrow('below allocation floor 90003');
    expect(() => validateCatalog([{ ...wheel(90003, 'Channel3'), variant: 'new_variant' }], { idFloor: 90003 })).not.toThrow();
  });

  it('writes deterministic files grouped by brand and sorted by id', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'mybikelab-publication-'));
    temporaryDirectories.push(directory);
    const input = join(directory, 'catalog.json');
    const output = join(directory, 'data');
    await writeFile(input, JSON.stringify([wheel(2, 'Zipp'), wheel(3, 'Mavic'), wheel(1, 'Mavic')]), 'utf8');

    const files = await publishCatalog(input, output);

    expect(files).toEqual(['wheelsData_mavic.json', 'wheelsData_zipp.json']);
    expect(JSON.parse(await readFile(join(output, 'wheelsData_mavic.json'), 'utf8')).map(({ id }) => id)).toEqual([1, 3]);
  });
});

describe('mixed legacy and JSON aggregation', () => {
  it('flattens future JSON modules without changing legacy imports', () => {
    const jsonWheels = aggregateWheelData({
      './wheelsData_zipp.json': [wheel(900, 'Zipp')],
      './wheelsData_mavic.json': [wheel(899, 'Mavic')],
    });

    expect(jsonWheels.map(({ id }) => id)).toEqual([899, 900]);
  });
});
