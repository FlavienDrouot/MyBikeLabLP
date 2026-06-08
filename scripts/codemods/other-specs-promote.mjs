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
  'spokes-count': {
    description: 'Promote spoke count fields from other_specs into spokes.count for EVO-049.',
    transform(source) {
      return promoteSpokesCount(source);
    },
  },
};

const consumedHubOtherSpecKeys = new Map([
  ['bearing_type', 'bearing_type'],
  ['bearing_models', 'bearing_models'],
  ['hub_material', 'material'],
]);

const consumedSpokesCountOtherSpecKeys = new Set([
  'spoke_count',
  'spoke_count_front',
  'spoke_count_rear',
  'spoke_count_disc',
]);

const getPropertyName = (property) => {
  if (!t.isObjectProperty(property)) return null;
  if (t.isIdentifier(property.key)) return property.key.name;
  if (t.isStringLiteral(property.key)) return property.key.value;
  return null;
};

const hasProperty = (objectExpression, propertyName) =>
  objectExpression.properties.some((property) => getPropertyName(property) === propertyName);

const getObjectProperty = (objectExpression, propertyName) =>
  objectExpression.properties.find((property) => getPropertyName(property) === propertyName);

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

const parseNumericLiteral = (value) => {
  if (t.isNumericLiteral(value)) return value.value;
  if (t.isStringLiteral(value)) {
    const trimmed = value.value.trim();
    if (/^\d+$/.test(trimmed)) return Number(trimmed);
  }
  return null;
};

const parseCountString = (raw) => {
  const text = raw.trim().toLowerCase();
  if (!text) return { front: null, rear: null };

  const slashMatch = text.match(/(\d+)\s*\/\s*(\d+)/);
  if (slashMatch) {
    return { front: Number(slashMatch[1]), rear: Number(slashMatch[2]) };
  }

  const frontRearMatch = text.match(/front\D*(\d+).*rear\D*(\d+)/);
  if (frontRearMatch) {
    return { front: Number(frontRearMatch[1]), rear: Number(frontRearMatch[2]) };
  }

  const rearFrontMatch = text.match(/rear\D*(\d+).*front\D*(\d+)/);
  if (rearFrontMatch) {
    return { front: Number(rearFrontMatch[2]), rear: Number(rearFrontMatch[1]) };
  }

  const frontAndRearMatch = text.match(/(\d+)\D*front\D*and\D*rear/);
  if (frontAndRearMatch) {
    const count = Number(frontAndRearMatch[1]);
    return { front: count, rear: count };
  }

  const singleMatch = text.match(/\d+/);
  if (singleMatch) {
    const count = Number(singleMatch[0]);
    return { front: count, rear: count };
  }

  return { front: null, rear: null };
};

const parseCountPair = (value) => {
  if (t.isNumericLiteral(value)) {
    return { front: value.value, rear: value.value };
  }

  if (t.isStringLiteral(value)) {
    return parseCountString(value.value);
  }

  if (t.isObjectExpression(value)) {
    const front = getObjectProperty(value, 'front');
    const rear = getObjectProperty(value, 'rear');
    return {
      front: front && t.isObjectProperty(front) ? parseNumericLiteral(front.value) : null,
      rear: rear && t.isObjectProperty(rear) ? parseNumericLiteral(rear.value) : null,
    };
  }

  return { front: null, rear: null };
};

const parseSideCount = (value) => {
  if (t.isStringLiteral(value)) {
    const pair = parseCountString(value.value);
    return pair.front ?? pair.rear;
  }
  return parseNumericLiteral(value);
};

const countValueNode = (count) => (
  count === null ? t.nullLiteral() : t.numericLiteral(count)
);

const countObjectProperty = ({ front, rear }) =>
  t.objectProperty(
    t.identifier('count'),
    t.objectExpression([
      t.objectProperty(t.identifier('front'), countValueNode(front)),
      t.objectProperty(t.identifier('rear'), countValueNode(rear)),
    ]),
  );

const mergeCountPair = (current, next) => ({
  front: next.front ?? current.front,
  rear: next.rear ?? current.rear,
});

const promoteSpokesCountInObjectExpression = (objectExpression) => {
  const spokesProperty = getObjectProperty(objectExpression, 'spokes');
  const otherSpecsProperty =
    getObjectProperty(objectExpression, 'other_specs') ?? getObjectProperty(objectExpression, 'otherSpecs');

  if (!spokesProperty || !otherSpecsProperty || !t.isObjectProperty(spokesProperty) || !t.isObjectProperty(otherSpecsProperty) || !t.isObjectExpression(otherSpecsProperty.value)) {
    return false;
  }

  const otherSpecsObject = otherSpecsProperty.value;
  let changed = false;
  let count = { front: null, rear: null };
  const remainingOtherSpecsProperties = [];

  for (const property of otherSpecsObject.properties) {
    const sourceName = getPropertyName(property);

    if (!consumedSpokesCountOtherSpecKeys.has(sourceName) || !t.isObjectProperty(property)) {
      remainingOtherSpecsProperties.push(property);
      continue;
    }

    if (sourceName === 'spoke_count' || sourceName === 'spoke_count_disc') {
      count = mergeCountPair(count, parseCountPair(property.value));
    } else if (sourceName === 'spoke_count_front') {
      count.front = parseSideCount(property.value) ?? count.front;
    } else if (sourceName === 'spoke_count_rear') {
      count.rear = parseSideCount(property.value) ?? count.rear;
    }

    changed = true;
  }

  if (!changed) return false;

  otherSpecsObject.properties = remainingOtherSpecsProperties;

  if (count.front === null && count.rear === null) {
    return true;
  }

  if (t.isObjectExpression(spokesProperty.value)) {
    if (!hasProperty(spokesProperty.value, 'count')) {
      spokesProperty.value.properties.push(countObjectProperty(count));
    }
    return true;
  }

  spokesProperty.value = t.objectExpression([
    t.spreadElement(t.cloneNode(spokesProperty.value)),
    countObjectProperty(count),
  ]);

  return true;
};

const promoteSpokesCount = (source) => {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  let changed = false;

  traverse(ast, {
    ObjectExpression(path) {
      if (promoteSpokesCountInObjectExpression(path.node)) {
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
