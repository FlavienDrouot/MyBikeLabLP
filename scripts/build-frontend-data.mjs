import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ALLOWED_CURRENCIES = new Set(['EUR', 'USD']);

function fail(message) {
  throw new Error(`Invalid catalog: ${message}`);
}

function validateOffer(offer, location) {
  if (!offer || typeof offer !== 'object' || Array.isArray(offer)) {
    fail(`${location} must be an object`);
  }
  if (!(offer.amount === null || typeof offer.amount === 'number')) {
    fail(`${location}.amount must be a number or null`);
  }
  if (!ALLOWED_CURRENCIES.has(offer.currency)) {
    fail(`${location}.currency must be EUR or USD`);
  }
}

export function validateIdFloor(idFloor) {
  if (idFloor === undefined) return;
  if (!Number.isInteger(idFloor) || idFloor < 1) {
    fail('id floor must be a positive integer');
  }
}

function validateWheel(wheel, index, ids, idFloor) {
  const location = `wheel ${index}`;
  if (!wheel || typeof wheel !== 'object' || Array.isArray(wheel)) fail(`${location} must be an object`);
  if (!Number.isInteger(wheel.id) || wheel.id < 1) fail(`${location}.id must be a positive integer`);
  if (ids.has(wheel.id)) fail(`duplicate id ${wheel.id}`);
  ids.add(wheel.id);
  if (typeof wheel.model !== 'string' || wheel.model.trim() === '') fail(`${location}.model must be non-empty`);
  if (typeof wheel.brand !== 'string' || wheel.brand.trim() === '') fail(`${location}.brand must be non-empty`);
  if (wheel.variant !== undefined && wheel.variant !== null && typeof wheel.variant !== 'string') {
    fail(`${location}.variant must be a string or null`);
  }
  if (wheel.variant !== undefined && wheel.variant !== null && idFloor !== undefined && wheel.id < idFloor) {
    fail(`${location}.variant configuration id ${wheel.id} is below allocation floor ${idFloor}`);
  }
  if (!Array.isArray(wheel.prices)) fail(`${location}.prices must be an array`);
  wheel.prices.forEach((offer, offerIndex) => validateOffer(offer, `${location}.prices[${offerIndex}]`));

  const manufacturer = wheel.affiliateLinks?.manufacturer;
  if (manufacturer) validateOffer(manufacturer, `${location}.affiliateLinks.manufacturer`);
  const retailers = wheel.affiliateLinks?.retailers;
  if (retailers !== undefined) {
    if (!Array.isArray(retailers)) fail(`${location}.affiliateLinks.retailers must be an array`);
    retailers.forEach((offer, offerIndex) => validateOffer(offer, `${location}.affiliateLinks.retailers[${offerIndex}]`));
  }
}

export function validateCatalog(catalog, { idFloor } = {}) {
  validateIdFloor(idFloor);
  if (!Array.isArray(catalog) || catalog.length === 0) fail('catalog must be a non-empty array');
  const ids = new Set();
  const identities = new Set();
  catalog.forEach((wheel, index) => {
    validateWheel(wheel, index, ids, idFloor);
    const identity = `${wheel.brand}\u0000${wheel.model}\u0000${wheel.variant ?? ''}`;
    if (identities.has(identity)) {
      fail(`duplicate configuration ${wheel.brand} / ${wheel.model} / ${wheel.variant ?? 'default'}`);
    }
    identities.add(identity);
  });
  return catalog;
}

function brandSlug(brand) {
  const slug = brand.toLowerCase().trim().replace(/[^a-z0-9]+/g, '');
  if (!slug) fail(`brand "${brand}" cannot produce a filename`);
  return slug;
}

export function buildBrandFiles(catalog, options = {}) {
  validateCatalog(catalog, options);
  const byBrand = new Map();
  for (const wheel of catalog) {
    const slug = brandSlug(wheel.brand);
    const existing = byBrand.get(slug);
    if (existing && existing.brand !== wheel.brand) fail(`brand filename collision for "${existing.brand}" and "${wheel.brand}"`);
    byBrand.set(slug, { brand: wheel.brand, wheels: [...(existing?.wheels ?? []), wheel] });
  }

  return [...byBrand.entries()]
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
    .map(([slug, { wheels }]) => [
      `wheelsData_${slug}.json`,
      [...wheels].sort((left, right) => left.id - right.id),
    ]);
}

export async function publishCatalog(inputPath, outputDirectory, options = {}) {
  const catalog = JSON.parse(await readFile(inputPath, 'utf8'));
  const files = buildBrandFiles(catalog, options);
  await mkdir(outputDirectory, { recursive: true });
  await Promise.all(files.map(async ([filename, wheels]) => {
    const target = resolve(outputDirectory, filename);
    await writeFile(target, `${JSON.stringify(wheels, null, 2)}\n`, 'utf8');
  }));
  return files.map(([filename]) => filename);
}

function parseArguments(args) {
  const positional = args.filter((argument) => !argument.startsWith('--'));
  const input = args.find((argument) => argument.startsWith('--input='))?.slice('--input='.length) ?? positional[0];
  const output = args.find((argument) => argument.startsWith('--output-dir='))?.slice('--output-dir='.length) ?? positional[1];
  const idFloorArgument = args.find((argument) => argument.startsWith('--id-floor='))?.slice('--id-floor='.length);
  const idFloor = idFloorArgument === undefined ? undefined : Number(idFloorArgument);
  if (!input || !output) {
    throw new Error('Usage: node scripts/build-frontend-data.mjs <canonical.json> <frontend/src/data>');
  }
  return { input: resolve(input), output: resolve(output), idFloor };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    const { input, output, idFloor } = parseArguments(process.argv.slice(2));
    const files = await publishCatalog(input, output, { idFloor });
    console.log(`Published ${files.length} brand file${files.length === 1 ? '' : 's'} from ${basename(input)}.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
