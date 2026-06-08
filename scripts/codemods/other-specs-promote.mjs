#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productRoot = path.resolve(__dirname, '..', '..');
const dataDir = path.join(productRoot, 'frontend', 'src', 'data');
const require = createRequire(import.meta.url);
const parser = require(path.join(productRoot, 'frontend', 'node_modules', '@babel', 'parser'));
const generator = require(path.join(productRoot, 'frontend', 'node_modules', '@babel', 'generator')).default;
const traverse = require(path.join(productRoot, 'frontend', 'node_modules', '@babel', 'traverse')).default;
const t = require(path.join(productRoot, 'frontend', 'node_modules', '@babel', 'types'));

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
  'hub-bearing-material': {
    description: 'Promote hub bearing/material fields from other_specs into hub for EVO-048.',
    transform(source) {
      return promoteHubBearingMaterial(source);
    },
  },
};

const consumedHubOtherSpecKeys = new Map([
  ['bearing_type', 'bearing_type'],
  ['bearing_models', 'bearing_models'],
  ['hub_material', 'material'],
]);

const getPropertyName = (property) => {
  if (!t.isObjectProperty(property)) return null;
  if (t.isIdentifier(property.key)) return property.key.name;
  if (t.isStringLiteral(property.key)) return property.key.value;
  return null;
};

const hasProperty = (objectExpression, propertyName) =>
  objectExpression.properties.some((property) => getPropertyName(property) === propertyName);

const clonePromotedValue = (property, targetName) => {
  const value = t.cloneNode(property.value);
  if (t.isStringLiteral(value) && value.value.trim() === '') {
    return t.objectProperty(t.identifier(targetName), t.nullLiteral());
  }

  if (targetName === 'bearing_models' && t.isStringLiteral(value)) {
    return t.objectProperty(t.identifier(targetName), t.arrayExpression([value]));
  }

  return t.objectProperty(t.identifier(targetName), value);
};

const promoteInObjectExpression = (objectExpression) => {
  const hubProperty = objectExpression.properties.find(
    (property) => getPropertyName(property) === 'hub' && t.isObjectExpression(property.value),
  );
  const otherSpecsProperty = objectExpression.properties.find(
    (property) => getPropertyName(property) === 'other_specs' && t.isObjectExpression(property.value),
  );

  if (!hubProperty || !otherSpecsProperty) return false;

  const hubObject = hubProperty.value;
  const otherSpecsObject = otherSpecsProperty.value;
  let changed = false;
  const remainingOtherSpecsProperties = [];

  for (const property of otherSpecsObject.properties) {
    const sourceName = getPropertyName(property);
    const targetName = consumedHubOtherSpecKeys.get(sourceName);

    if (!targetName || !t.isObjectProperty(property)) {
      remainingOtherSpecsProperties.push(property);
      continue;
    }

    if (!hasProperty(hubObject, targetName)) {
      hubObject.properties.push(clonePromotedValue(property, targetName));
    }
    changed = true;
  }

  if (changed) {
    otherSpecsObject.properties = remainingOtherSpecsProperties;
  }

  return changed;
};

const promoteHubBearingMaterial = (source) => {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  let changed = false;

  traverse(ast, {
    ObjectExpression(path) {
      if (promoteInObjectExpression(path.node)) {
        changed = true;
      }
    },
  });

  if (!changed) return source;
  return generator(ast, {
    retainLines: true,
    jsescOption: { minimal: true },
  }, source).code;
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
