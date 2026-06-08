#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productRoot = path.resolve(__dirname, '..', '..');
const dataDir = path.join(productRoot, 'frontend', 'src', 'data');

const parseArgs = (argv) => {
  const options = {
    concept: 'foundation',
    dryRun: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--concept') {
      options.concept = argv[index + 1];
      index += 1;
    } else if (arg === '--write') {
      options.dryRun = false;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
};

const migrations = {
  foundation: {
    description: 'Foundation no-op migration for EVO-047.',
    transform(source) {
      return source;
    },
  },
};

const listWheelDataFiles = async () => {
  const entries = await readdir(dataDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /^wheelsData_.*\.js$/.test(name))
    .sort()
    .map((name) => path.join(dataDir, name));
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const migration = migrations[options.concept];
  if (!migration) {
    throw new Error(`Unknown concept migration: ${options.concept}`);
  }

  const files = await listWheelDataFiles();
  let changed = 0;

  console.log(`Concept: ${options.concept}`);
  console.log(`Mode: ${options.dryRun ? 'dry-run' : 'write'}`);
  console.log(`Description: ${migration.description}`);
  console.log(`Files scanned: ${files.length}`);

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const next = migration.transform(source, { file });
    const didChange = next !== source;
    if (didChange) changed += 1;

    if (didChange && !options.dryRun) {
      await writeFile(file, next, 'utf8');
    }

    console.log(`${didChange ? 'changed' : 'unchanged'} ${path.relative(productRoot, file)}`);
  }

  console.log(`Changed files: ${changed}`);
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
