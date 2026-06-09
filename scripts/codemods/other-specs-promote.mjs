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
  'spokes-detail': {
    description: 'Promote spoke nipple/type/profile/lacing fields from other_specs into spokes for EVO-050.',
    transform(source) {
      return promoteSpokesDetail(source);
    },
  },
  'rim-material-construction': {
    description: 'Promote rim material/construction fields from other_specs into rim for EVO-051.',
    transform(source) {
      return promoteRimMaterialConstruction(source);
    },
  },
  'rim-max-tire-pressure': {
    description: 'Promote max tire pressure fields from other_specs into rim.max_tire_pressure for EVO-052.',
    transform(source) {
      return promoteRimMaxTirePressure(source);
    },
  },
  warranty: {
    description: 'Promote warranty fields from other_specs into warranty for EVO-053.',
    transform(source) {
      return promoteWarranty(source);
    },
  },
  certification: {
    description: 'Promote certification fields from other_specs into certification for EVO-054.',
    transform(source) {
      return promoteCertification(source);
    },
  },
  'weight-tolerance': {
    description: 'Promote weight tolerance fields from other_specs into weight_tolerance_percent for EVO-055.',
    transform(source) {
      return promoteWeightTolerance(source);
    },
  },
  'tire-compatibility': {
    description: 'Promote tire compatibility fields from other_specs into rim.tire_compatibility for EVO-056.',
    transform(source) {
      return promoteTireCompatibility(source);
    },
  },
  'hub-engagement': {
    description: 'Promote hub engagement fields from other_specs into hub.engagement for EVO-057.',
    transform(source) {
      return promoteHubEngagement(source);
    },
  },
  'tire-width-mm': {
    description: 'Promote tire width fields from other_specs into rim.tire_width_mm for EVO-058.',
    transform(source) {
      return promoteTireWidthMm(source);
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

const consumedSpokesDetailOtherSpecKeys = new Set([
  'nipples',
  'spoke_nipple',
  'spoke_nipples',
  'spoke_type',
  'spoke_profile',
  'spoke_lacing',
  'spoke_lacing_front',
  'spoke_lacing_rear',
  'front_wheel_spoke_lacing',
  'rear_wheel_spoke_lacing',
  'lacing',
  'rear_lacing',
]);

const consumedRimMaterialConstructionOtherSpecKeys = new Set([
  'rim_material_name',
  'rim_material_detail',
  'rim_construction',
  'rim_technology',
  'rim_construction_technology',
]);

const consumedRimMaxTirePressureOtherSpecKeys = new Set([
  'max_tire_pressure_psi',
  'max_tire_pressure_bar',
  'maximum_tire_pressure',
  'max_tire_pressure_tubeless_psi',
  'max_tire_pressure_tubed_psi',
  'max_tire_pressure_psi_28c',
  'max_tire_pressure_psi_clincher',
  'max_tire_pressure_psi_tubeless',
]);

const consumedWarrantyOtherSpecKeys = new Set([
  'warranty',
  'warranty_years',
]);

const consumedCertificationOtherSpecKeys = new Set([
  'uci_approved',
  'astm_category',
  'e_bike_approved',
  'certification',
]);

const consumedWeightToleranceOtherSpecKeys = new Set([
  'weight_tolerance',
  'weight_tolerance_percent',
  'weight_tolerance_grams',
  'rim_weight_tolerance_percent',
]);

const consumedTireCompatibilityOtherSpecKeys = new Set([
  'tire_type',
  'tire_compatibility',
  'compatible_tire_type',
]);

const consumedHubEngagementOtherSpecKeys = new Set([
  'points_of_engagement',
  'ratchet_teeth',
  'ratchet',
  'hub_internals',
]);

const consumedTireWidthOtherSpecKeys = new Set([
  'min_tire_width_mm',
  'max_tire_width_mm',
  'tire_width_range_mm',
  'tire_optimized_for_mm',
  'optimized_tire_size_mm',
  'recommended_tire_width_mm',
  'recommended_tire_size',
  'recommended_tire_size_c',
  'compatible_tire_width',
  'compatible_tire_width_mm',
  'suggested_tire_width_mm',
  'tire_width_c',
  'etrto',
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

const cloneTextValue = (value) => {
  const cloned = t.cloneNode(value);
  if (t.isStringLiteral(cloned) && cloned.value.trim() === '') {
    return t.nullLiteral();
  }
  return cloned;
};

const normalizedLacingText = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return '';

  const lower = trimmed.toLowerCase();
  if (lower === 'radial') return 'radial';
  if (/^2x(?:\s+cross)?$/.test(lower)) return '2-cross';
  return trimmed;
};

const lacingValueNode = (value) => {
  if (value === null) return t.nullLiteral();
  if (t.isStringLiteral(value)) {
    const normalized = normalizedLacingText(value.value);
    return normalized ? t.stringLiteral(normalized) : t.nullLiteral();
  }
  return t.cloneNode(value);
};

const lacingObjectProperty = ({ front, rear }) =>
  t.objectProperty(
    t.identifier('lacing'),
    t.objectExpression([
      t.objectProperty(t.identifier('front'), lacingValueNode(front)),
      t.objectProperty(t.identifier('rear'), lacingValueNode(rear)),
    ]),
  );

const pairFromGlobalLacing = (value) => ({ front: value, rear: value });

const getLacingPairFromValue = (value) => {
  if (t.isObjectExpression(value)) {
    const front = getObjectProperty(value, 'front');
    const rear = getObjectProperty(value, 'rear');
    return {
      front: front && t.isObjectProperty(front) ? front.value : null,
      rear: rear && t.isObjectProperty(rear) ? rear.value : null,
    };
  }

  if (t.isStringLiteral(value)) {
    const text = value.value.trim();
    const lower = text.toLowerCase();

    const frontRearMatch = lower.match(/(.+?)\s+front\s*,?\s*(.+?)\s+rear/);
    if (frontRearMatch) {
      return {
        front: t.stringLiteral(frontRearMatch[1].trim()),
        rear: t.stringLiteral(frontRearMatch[2].trim()),
      };
    }

    const radialFrontMatch = lower.match(/radial\s+front\s*,?\s*(.+?)\s+rear/);
    if (radialFrontMatch) {
      return {
        front: t.stringLiteral('radial'),
        rear: t.stringLiteral(radialFrontMatch[1].trim()),
      };
    }
  }

  return pairFromGlobalLacing(value);
};

const mergeLacingPair = (current, next) => ({
  front: next.front ?? current.front,
  rear: next.rear ?? current.rear,
});

const promoteSpokesDetailInObjectExpression = (objectExpression) => {
  const spokesProperty = getObjectProperty(objectExpression, 'spokes');
  const otherSpecsProperty =
    getObjectProperty(objectExpression, 'other_specs') ?? getObjectProperty(objectExpression, 'otherSpecs');

  if (!spokesProperty || !otherSpecsProperty || !t.isObjectProperty(spokesProperty) || !t.isObjectProperty(otherSpecsProperty) || !t.isObjectExpression(otherSpecsProperty.value)) {
    return false;
  }

  const otherSpecsObject = otherSpecsProperty.value;
  const remainingOtherSpecsProperties = [];
  let changed = false;
  let nipple = null;
  let spokeType = null;
  let profile = null;
  let lacing = { front: null, rear: null };

  for (const property of otherSpecsObject.properties) {
    const sourceName = getPropertyName(property);

    if (!consumedSpokesDetailOtherSpecKeys.has(sourceName) || !t.isObjectProperty(property)) {
      remainingOtherSpecsProperties.push(property);
      continue;
    }

    if (sourceName === 'nipples' || sourceName === 'spoke_nipple' || sourceName === 'spoke_nipples') {
      nipple ??= property.value;
    } else if (sourceName === 'spoke_type') {
      spokeType ??= property.value;
    } else if (sourceName === 'spoke_profile') {
      profile ??= property.value;
    } else if (sourceName === 'spoke_lacing' || sourceName === 'lacing') {
      lacing = mergeLacingPair(lacing, getLacingPairFromValue(property.value));
    } else if (sourceName === 'spoke_lacing_front' || sourceName === 'front_wheel_spoke_lacing') {
      lacing.front = property.value;
    } else if (sourceName === 'spoke_lacing_rear' || sourceName === 'rear_wheel_spoke_lacing' || sourceName === 'rear_lacing') {
      lacing.rear = property.value;
    }

    changed = true;
  }

  if (!changed) return false;

  otherSpecsObject.properties = remainingOtherSpecsProperties;

  if (!t.isObjectExpression(spokesProperty.value)) {
    return true;
  }

  const spokesObject = spokesProperty.value;

  if (nipple !== null && !hasProperty(spokesObject, 'nipple')) {
    spokesObject.properties.push(t.objectProperty(t.identifier('nipple'), cloneTextValue(nipple)));
  }
  if (spokeType !== null && !hasProperty(spokesObject, 'type')) {
    spokesObject.properties.push(t.objectProperty(t.identifier('type'), cloneTextValue(spokeType)));
  }
  if (profile !== null && !hasProperty(spokesObject, 'profile')) {
    spokesObject.properties.push(t.objectProperty(t.identifier('profile'), cloneTextValue(profile)));
  }
  if ((lacing.front !== null || lacing.rear !== null) && !hasProperty(spokesObject, 'lacing')) {
    spokesObject.properties.push(lacingObjectProperty(lacing));
  }

  return true;
};

const promoteSpokesDetail = (source) => {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  let changed = false;

  traverse(ast, {
    ObjectExpression(path) {
      if (promoteSpokesDetailInObjectExpression(path.node)) {
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

const normalizedTextFromNode = (value) => {
  if (t.isStringLiteral(value)) return value.value.trim();
  return null;
};

const categoryMaterialFromText = (value) => {
  const text = normalizedTextFromNode(value)?.toLowerCase();
  if (!text) return null;
  if (/\bcarbon\b/.test(text)) return 'carbon';
  if (/\balum(?:inum|inium)?\b/.test(text) || /\bmaxtal\b/.test(text) || /\bs6000\b/.test(text)) {
    return 'aluminum';
  }
  return null;
};

const PSI_PER_BAR = 14.5038;

const parsePressureNumber = (value) => {
  if (t.isNumericLiteral(value)) return value.value;
  if (t.isStringLiteral(value)) {
    const match = value.value.trim().match(/\d+(?:[.,]\d+)?/);
    if (match) return Number(match[0].replace(',', '.'));
  }
  return null;
};

const isEmptyStringLiteral = (value) => t.isStringLiteral(value) && value.value.trim() === '';

const constructionNodeFromValues = (values) => {
  const distinct = [];

  for (const value of values) {
    if (isEmptyStringLiteral(value)) continue;
    if (!t.isStringLiteral(value)) {
      distinct.push(t.cloneNode(value));
      continue;
    }

    const text = value.value.trim();
    if (!text || distinct.some((item) => t.isStringLiteral(item) && item.value === text)) continue;
    distinct.push(t.stringLiteral(text));
  }

  if (distinct.length === 0) return t.nullLiteral();
  if (distinct.length === 1) return distinct[0];

  if (distinct.every((item) => t.isStringLiteral(item))) {
    return t.stringLiteral(distinct.map((item) => item.value).join('; '));
  }

  return t.arrayExpression(distinct);
};

const shouldKeepMaterialNameAsConstruction = (value) => {
  const category = categoryMaterialFromText(value);
  const text = normalizedTextFromNode(value);
  return Boolean(text && text.toLowerCase() !== category);
};

const promoteRimMaterialConstructionInObjectExpression = (objectExpression) => {
  const rimProperty = getObjectProperty(objectExpression, 'rim');
  const otherSpecsProperty =
    getObjectProperty(objectExpression, 'other_specs') ?? getObjectProperty(objectExpression, 'otherSpecs');

  if (!rimProperty || !otherSpecsProperty || !t.isObjectProperty(rimProperty) || !t.isObjectProperty(otherSpecsProperty) || !t.isObjectExpression(otherSpecsProperty.value)) {
    return false;
  }

  const otherSpecsObject = otherSpecsProperty.value;
  const remainingOtherSpecsProperties = [];
  let changed = false;
  let materialName = null;
  const constructionValues = [];

  for (const property of otherSpecsObject.properties) {
    const sourceName = getPropertyName(property);

    if (!consumedRimMaterialConstructionOtherSpecKeys.has(sourceName) || !t.isObjectProperty(property)) {
      remainingOtherSpecsProperties.push(property);
      continue;
    }

    if (sourceName === 'rim_material_name') {
      materialName ??= property.value;
      if (shouldKeepMaterialNameAsConstruction(property.value)) {
        constructionValues.push(property.value);
      }
    } else {
      constructionValues.push(property.value);
    }

    changed = true;
  }

  if (!changed) return false;

  otherSpecsObject.properties = remainingOtherSpecsProperties;

  if (!t.isObjectExpression(rimProperty.value)) {
    return true;
  }

  const rimObject = rimProperty.value;
  const materialProperty = getObjectProperty(rimObject, 'material');
  const materialCategory = materialName ? categoryMaterialFromText(materialName) : null;

  if (materialCategory && (!materialProperty || !t.isObjectProperty(materialProperty) || isEmptyStringLiteral(materialProperty.value))) {
    if (materialProperty && t.isObjectProperty(materialProperty)) {
      materialProperty.value = t.stringLiteral(materialCategory);
    } else {
      rimObject.properties.unshift(t.objectProperty(t.identifier('material'), t.stringLiteral(materialCategory)));
    }
  }

  if (constructionValues.length > 0 && !hasProperty(rimObject, 'construction')) {
    rimObject.properties.push(t.objectProperty(t.identifier('construction'), constructionNodeFromValues(constructionValues)));
  }

  return true;
};

const promoteRimMaterialConstruction = (source) => {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  let changed = false;

  traverse(ast, {
    ObjectExpression(path) {
      if (promoteRimMaterialConstructionInObjectExpression(path.node)) {
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

const roundPsi = (value) => Math.round(value);
const roundBar = (value) => Math.round(value * 10) / 10;

const pressureText = (property) => {
  const key = getPropertyName(property);
  if (!t.isObjectProperty(property)) return null;
  const labels = {
    max_tire_pressure_tubeless_psi: 'tubeless',
    max_tire_pressure_tubed_psi: 'tubed',
    max_tire_pressure_psi_28c: '28c',
    max_tire_pressure_psi_clincher: 'clincher',
    max_tire_pressure_psi_tubeless: 'tubeless',
  };
  const label = labels[key] ?? key;
  if (t.isStringLiteral(property.value)) return `${label}: ${property.value.value} psi`;
  if (t.isNumericLiteral(property.value)) return `${label}: ${property.value.value} psi`;
  return null;
};

const pressureValueNode = (value) => (
  value === null ? t.nullLiteral() : t.numericLiteral(value)
);

const pressureObjectProperty = ({ psi, bar, note }) =>
  t.objectProperty(
    t.identifier('max_tire_pressure'),
    t.objectExpression([
      t.objectProperty(t.identifier('psi'), pressureValueNode(psi)),
      t.objectProperty(t.identifier('bar'), pressureValueNode(bar)),
      t.objectProperty(t.identifier('note'), note ? t.stringLiteral(note) : t.nullLiteral()),
    ]),
  );

const parseFreeTextPressure = (value) => {
  if (!t.isStringLiteral(value)) return { psi: null, bar: null, note: null };
  const text = value.value.trim();
  if (!text) return { psi: null, bar: null, note: null };

  const psiMatch = text.match(/(\d+(?:[.,]\d+)?)\s*psi/i);
  const barMatch = text.match(/(\d+(?:[.,]\d+)?)\s*bar/i);
  const psi = psiMatch ? Number(psiMatch[1].replace(',', '.')) : null;
  const bar = barMatch ? Number(barMatch[1].replace(',', '.')) : null;
  const plain = /^(\d+(?:[.,]\d+)?)\s*(psi|bar)$/i.test(text);

  return {
    psi,
    bar,
    note: plain ? null : text,
  };
};

const normalizePressure = ({ genericPsi, genericBar, conditionalPsiValues, noteParts }) => {
  let psi = genericPsi;
  let bar = genericBar;

  if (psi === null && conditionalPsiValues.length > 0) {
    psi = Math.max(...conditionalPsiValues);
  }

  if (psi === null && bar !== null) {
    psi = roundPsi(bar * PSI_PER_BAR);
  }

  if (bar === null && psi !== null) {
    bar = roundBar(psi / PSI_PER_BAR);
  }

  return {
    psi,
    bar,
    note: noteParts.length > 0 ? noteParts.join('; ') : null,
  };
};

const promoteRimMaxTirePressureInObjectExpression = (objectExpression) => {
  const rimProperty = getObjectProperty(objectExpression, 'rim');
  const otherSpecsProperty =
    getObjectProperty(objectExpression, 'other_specs') ?? getObjectProperty(objectExpression, 'otherSpecs');

  if (!rimProperty || !otherSpecsProperty || !t.isObjectProperty(rimProperty) || !t.isObjectProperty(otherSpecsProperty) || !t.isObjectExpression(rimProperty.value) || !t.isObjectExpression(otherSpecsProperty.value)) {
    return false;
  }

  const rimObject = rimProperty.value;
  const otherSpecsObject = otherSpecsProperty.value;
  const remainingOtherSpecsProperties = [];
  let changed = false;
  let genericPsi = null;
  let genericBar = null;
  const conditionalPsiValues = [];
  const noteParts = [];

  for (const property of otherSpecsObject.properties) {
    const sourceName = getPropertyName(property);

    if (!consumedRimMaxTirePressureOtherSpecKeys.has(sourceName) || !t.isObjectProperty(property)) {
      remainingOtherSpecsProperties.push(property);
      continue;
    }

    if (sourceName === 'max_tire_pressure_psi') {
      genericPsi ??= parsePressureNumber(property.value);
    } else if (sourceName === 'max_tire_pressure_bar') {
      genericBar ??= parsePressureNumber(property.value);
    } else if (sourceName === 'maximum_tire_pressure') {
      const parsed = parseFreeTextPressure(property.value);
      genericPsi ??= parsed.psi;
      genericBar ??= parsed.bar;
      if (parsed.note) noteParts.push(parsed.note);
    } else {
      const conditionalPsi = parsePressureNumber(property.value);
      if (conditionalPsi !== null) conditionalPsiValues.push(conditionalPsi);
      const note = pressureText(property);
      if (note) noteParts.push(note);
    }

    changed = true;
  }

  if (!changed) return false;

  otherSpecsObject.properties = remainingOtherSpecsProperties;

  const pressure = normalizePressure({ genericPsi, genericBar, conditionalPsiValues, noteParts });
  if (pressure.psi === null && pressure.bar === null && pressure.note === null) {
    return true;
  }

  if (!hasProperty(rimObject, 'max_tire_pressure')) {
    rimObject.properties.push(pressureObjectProperty(pressure));
  }

  return true;
};

const promoteRimMaxTirePressure = (source) => {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  let changed = false;

  traverse(ast, {
    ObjectExpression(path) {
      if (promoteRimMaxTirePressureInObjectExpression(path.node)) {
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

const parseWarrantyYears = (value) => {
  if (t.isNumericLiteral(value)) return value.value;
  if (!t.isStringLiteral(value)) return null;

  const text = value.value.trim().toLowerCase();
  if (!text || text.includes('lifetime')) return null;

  const match = text.match(/(\d+(?:[.,]\d+)?)\s*(?:year|yr|ans?)/i);
  if (!match) return null;
  return Number(match[1].replace(',', '.'));
};

const warrantyTextNode = (value) => {
  if (!value) return t.nullLiteral();
  if (t.isStringLiteral(value)) {
    const text = value.value.trim();
    return text ? t.stringLiteral(text) : t.nullLiteral();
  }
  return t.cloneNode(value);
};

const warrantyYearsNode = (years) => (
  years === null ? t.nullLiteral() : t.numericLiteral(years)
);

const warrantyObjectProperty = ({ text, years }) =>
  t.objectProperty(
    t.identifier('warranty'),
    t.objectExpression([
      t.objectProperty(t.identifier('text'), warrantyTextNode(text)),
      t.objectProperty(t.identifier('years'), warrantyYearsNode(years)),
    ]),
  );

const promoteWarrantyInObjectExpression = (objectExpression) => {
  const otherSpecsProperty =
    getObjectProperty(objectExpression, 'other_specs') ?? getObjectProperty(objectExpression, 'otherSpecs');

  if (!otherSpecsProperty || !t.isObjectProperty(otherSpecsProperty) || !t.isObjectExpression(otherSpecsProperty.value)) {
    return false;
  }

  const otherSpecsObject = otherSpecsProperty.value;
  const remainingOtherSpecsProperties = [];
  let changed = false;
  let text = null;
  let years = null;

  for (const property of otherSpecsObject.properties) {
    const sourceName = getPropertyName(property);

    if (!consumedWarrantyOtherSpecKeys.has(sourceName) || !t.isObjectProperty(property)) {
      remainingOtherSpecsProperties.push(property);
      continue;
    }

    if (sourceName === 'warranty') {
      text ??= property.value;
      years ??= parseWarrantyYears(property.value);
    } else if (sourceName === 'warranty_years') {
      years ??= parseWarrantyYears(property.value);
    }

    changed = true;
  }

  if (!changed) return false;

  otherSpecsObject.properties = remainingOtherSpecsProperties;

  if (!hasProperty(objectExpression, 'warranty')) {
    objectExpression.properties.push(warrantyObjectProperty({ text, years }));
  }

  return true;
};

const promoteWarranty = (source) => {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  let changed = false;

  traverse(ast, {
    ObjectExpression(path) {
      if (promoteWarrantyInObjectExpression(path.node)) {
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

const parseBooleanNode = (value) => {
  if (t.isBooleanLiteral(value)) return value.value;
  if (t.isStringLiteral(value)) {
    const text = value.value.trim().toLowerCase();
    if (['true', 'yes', 'approved', 'uci approved', 'e-bike approved', 'ebike approved'].includes(text)) return true;
    if (['false', 'no', 'not approved', 'not uci approved', 'not e-bike approved', 'not ebike approved'].includes(text)) return false;
  }
  return null;
};

const parseAstmCategoryNode = (value) => {
  if (t.isNumericLiteral(value)) return value.value;
  if (t.isStringLiteral(value)) {
    const match = value.value.trim().match(/\b(?:astm(?:\s*f2043)?\s*)?(?:category|cat\.?)?\s*([1-5])\b/i);
    if (match) return Number(match[1]);
  }
  return null;
};

const parseCertificationText = (value) => {
  if (!t.isStringLiteral(value)) return { uci: null, astm: null, ebike: null };
  const text = value.value.trim();
  if (!text) return { uci: null, astm: null, ebike: null };
  const lower = text.toLowerCase();

  const uci =
    /\buci\b/.test(lower) && /\b(approved|certified|compliant)\b/.test(lower)
      ? true
      : /\bnot\s+uci\b|\buci\b.*\b(not approved|not certified)\b/.test(lower)
        ? false
        : null;
  const astm = parseAstmCategoryNode(value);
  const ebike =
    /\be[-\s]?bike\b/.test(lower) && /\b(approved|compatible|certified)\b/.test(lower)
      ? true
      : /\bnot\s+e[-\s]?bike\b|\be[-\s]?bike\b.*\b(not approved|not compatible|not certified)\b/.test(lower)
        ? false
        : null;

  return { uci, astm, ebike };
};

const valueNode = (value) => (
  value === null ? t.nullLiteral() : typeof value === 'boolean' ? t.booleanLiteral(value) : t.numericLiteral(value)
);

const certificationObjectProperty = ({ uci, astm, ebike }) =>
  t.objectProperty(
    t.identifier('certification'),
    t.objectExpression([
      t.objectProperty(t.identifier('uci'), valueNode(uci)),
      t.objectProperty(t.identifier('astm'), valueNode(astm)),
      t.objectProperty(t.identifier('ebike'), valueNode(ebike)),
    ]),
  );

const setCertificationField = (certificationObject, key, value) => {
  if (value === null) return;
  const existing = getObjectProperty(certificationObject, key);
  if (existing && t.isObjectProperty(existing)) {
    existing.value = valueNode(value);
  } else {
    certificationObject.properties.push(t.objectProperty(t.identifier(key), valueNode(value)));
  }
};

const promoteCertificationInObjectExpression = (objectExpression) => {
  const otherSpecsProperty =
    getObjectProperty(objectExpression, 'other_specs') ?? getObjectProperty(objectExpression, 'otherSpecs');

  if (!otherSpecsProperty || !t.isObjectProperty(otherSpecsProperty) || !t.isObjectExpression(otherSpecsProperty.value)) {
    return false;
  }

  const otherSpecsObject = otherSpecsProperty.value;
  const remainingOtherSpecsProperties = [];
  let changed = false;
  const certification = { uci: null, astm: null, ebike: null };

  for (const property of otherSpecsObject.properties) {
    const sourceName = getPropertyName(property);

    if (!consumedCertificationOtherSpecKeys.has(sourceName) || !t.isObjectProperty(property)) {
      remainingOtherSpecsProperties.push(property);
      continue;
    }

    if (sourceName === 'uci_approved') {
      certification.uci ??= parseBooleanNode(property.value);
    } else if (sourceName === 'astm_category') {
      certification.astm ??= parseAstmCategoryNode(property.value);
    } else if (sourceName === 'e_bike_approved') {
      certification.ebike ??= parseBooleanNode(property.value);
    } else if (sourceName === 'certification') {
      const parsed = parseCertificationText(property.value);
      certification.uci ??= parsed.uci;
      certification.astm ??= parsed.astm;
      certification.ebike ??= parsed.ebike;
    }

    changed = true;
  }

  if (!changed) return false;

  otherSpecsObject.properties = remainingOtherSpecsProperties;

  if (certification.uci === null && certification.astm === null && certification.ebike === null) {
    return true;
  }

  const existing = getObjectProperty(objectExpression, 'certification');
  if (existing && t.isObjectProperty(existing) && t.isObjectExpression(existing.value)) {
    setCertificationField(existing.value, 'uci', certification.uci);
    setCertificationField(existing.value, 'astm', certification.astm);
    setCertificationField(existing.value, 'ebike', certification.ebike);
  } else if (!existing) {
    objectExpression.properties.push(certificationObjectProperty(certification));
  }

  return true;
};

const promoteCertification = (source) => {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  let changed = false;

  traverse(ast, {
    ObjectExpression(path) {
      if (promoteCertificationInObjectExpression(path.node)) {
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

const parseSpecTotal = (value) => {
  if (t.isNumericLiteral(value)) return value.value;
  if (!t.isObjectExpression(value)) return null;

  const frontProperty = getObjectProperty(value, 'front');
  const rearProperty = getObjectProperty(value, 'rear');
  if (!frontProperty || !rearProperty) return null;

  const front = parseNumericLiteral(frontProperty.value);
  const rear = parseNumericLiteral(rearProperty.value);
  if (!Number.isFinite(front) || !Number.isFinite(rear)) return null;
  return front + rear;
};

const parseTolerancePercent = (value) => {
  if (t.isNumericLiteral(value)) return value.value;
  if (!t.isStringLiteral(value)) return null;

  const text = value.value.trim().toLowerCase();
  if (!text) return null;
  const match = text.match(/(\d+(?:[.,]\d+)?)\s*%/);
  if (!match) return null;
  return Number(match[1].replace(',', '.'));
};

const parseToleranceGrams = (value) => {
  if (t.isNumericLiteral(value)) return value.value;
  if (!t.isStringLiteral(value)) return null;

  const text = value.value.trim().toLowerCase();
  if (!text) return null;
  const match = text.match(/(\d+(?:[.,]\d+)?)\s*g/);
  if (!match && /^\d+(?:[.,]\d+)?$/.test(text)) return Number(text.replace(',', '.'));
  if (!match) return null;
  return Number(match[1].replace(',', '.'));
};

const roundPercent = (value) => Math.round(value * 10) / 10;

const promoteWeightToleranceInObjectExpression = (objectExpression) => {
  const otherSpecsProperty =
    getObjectProperty(objectExpression, 'other_specs') ?? getObjectProperty(objectExpression, 'otherSpecs');

  if (!otherSpecsProperty || !t.isObjectProperty(otherSpecsProperty) || !t.isObjectExpression(otherSpecsProperty.value)) {
    return false;
  }

  const otherSpecsObject = otherSpecsProperty.value;
  const remainingOtherSpecsProperties = [];
  const weightProperty = getObjectProperty(objectExpression, 'weight_grams');
  const referenceWeight = weightProperty && t.isObjectProperty(weightProperty)
    ? parseSpecTotal(weightProperty.value)
    : null;
  let changed = false;
  let percent = null;
  let grams = null;

  for (const property of otherSpecsObject.properties) {
    const sourceName = getPropertyName(property);

    if (!consumedWeightToleranceOtherSpecKeys.has(sourceName) || !t.isObjectProperty(property)) {
      remainingOtherSpecsProperties.push(property);
      continue;
    }

    if (
      sourceName === 'weight_tolerance_percent' ||
      sourceName === 'rim_weight_tolerance_percent' ||
      sourceName === 'weight_tolerance'
    ) {
      percent ??= parseTolerancePercent(property.value);
    }

    if (sourceName === 'weight_tolerance_grams') {
      grams ??= parseToleranceGrams(property.value);
    }

    changed = true;
  }

  if (!changed) return false;

  if (percent === null && grams !== null && Number.isFinite(referenceWeight) && referenceWeight > 0) {
    percent = roundPercent((grams / referenceWeight) * 100);
  }

  otherSpecsObject.properties = remainingOtherSpecsProperties;

  if (percent !== null && Number.isFinite(percent) && !hasProperty(objectExpression, 'weight_tolerance_percent')) {
    objectExpression.properties.push(
      t.objectProperty(t.identifier('weight_tolerance_percent'), t.numericLiteral(percent)),
    );
  }

  return true;
};

const promoteWeightTolerance = (source) => {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  let changed = false;

  traverse(ast, {
    ObjectExpression(path) {
      if (promoteWeightToleranceInObjectExpression(path.node)) {
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

const TIRE_COMPATIBILITY_ORDER = ['clincher', 'tubeless', 'tubular'];

const addTireCompatibilityType = (types, type) => {
  if (TIRE_COMPATIBILITY_ORDER.includes(type)) types.add(type);
};

const parseTireCompatibilityTypes = (value) => {
  const types = new Set();

  if (t.isArrayExpression(value)) {
    for (const element of value.elements) {
      for (const type of parseTireCompatibilityTypes(element)) {
        addTireCompatibilityType(types, type);
      }
    }
    return types;
  }

  if (!t.isStringLiteral(value)) return types;

  const text = value.value.trim().toLowerCase();
  if (!text) return types;

  if (/\btubeless\b|\btlr\b|\bust\b/.test(text)) {
    addTireCompatibilityType(types, 'tubeless');
  }
  if (/\bclincher\b|\bclinchers\b|\btube(?:d|s)?\b|\binner\s+tube\b|\btubes?\s+also\b|\bpneu\b/.test(text)) {
    addTireCompatibilityType(types, 'clincher');
  }
  if (/\btubular\b|\bboyau\b/.test(text)) {
    addTireCompatibilityType(types, 'tubular');
  }

  return types;
};

const parseExistingTireCompatibilityTypes = (rimObject) => {
  const property = getObjectProperty(rimObject, 'tire_compatibility');
  if (!property || !t.isObjectProperty(property)) return new Set();
  return parseTireCompatibilityTypes(property.value);
};

const orderedTireCompatibilityTypes = (types) =>
  TIRE_COMPATIBILITY_ORDER.filter((type) => types.has(type));

const tireCompatibilityArrayNode = (types) =>
  t.arrayExpression(orderedTireCompatibilityTypes(types).map((type) => t.stringLiteral(type)));

const setRimBooleanField = (rimObject, key, value) => {
  const existing = getObjectProperty(rimObject, key);
  const node = value === null ? t.nullLiteral() : t.booleanLiteral(value);
  if (existing && t.isObjectProperty(existing)) {
    existing.value = node;
  } else {
    rimObject.properties.push(t.objectProperty(t.identifier(key), node));
  }
};

const setRimTireCompatibility = (rimObject, types) => {
  const existing = getObjectProperty(rimObject, 'tire_compatibility');
  const node = tireCompatibilityArrayNode(types);
  if (existing && t.isObjectProperty(existing)) {
    existing.value = node;
  } else {
    rimObject.properties.push(t.objectProperty(t.identifier('tire_compatibility'), node));
  }
};

const promoteTireCompatibilityInObjectExpression = (objectExpression) => {
  const rimProperty = getObjectProperty(objectExpression, 'rim');
  const otherSpecsProperty =
    getObjectProperty(objectExpression, 'other_specs') ?? getObjectProperty(objectExpression, 'otherSpecs');

  if (!rimProperty || !t.isObjectProperty(rimProperty) || !t.isObjectExpression(rimProperty.value)) {
    return false;
  }

  const rimObject = rimProperty.value;
  const types = parseExistingTireCompatibilityTypes(rimObject);
  const tubelessReadyProperty = getObjectProperty(rimObject, 'tubeless_ready');
  const hadTubelessReady = tubelessReadyProperty && t.isObjectProperty(tubelessReadyProperty);

  if (hadTubelessReady && t.isBooleanLiteral(tubelessReadyProperty.value) && tubelessReadyProperty.value.value === true) {
    addTireCompatibilityType(types, 'tubeless');
  }

  let changed = false;

  if (otherSpecsProperty && t.isObjectProperty(otherSpecsProperty) && t.isObjectExpression(otherSpecsProperty.value)) {
    const otherSpecsObject = otherSpecsProperty.value;
    const remainingOtherSpecsProperties = [];

    for (const property of otherSpecsObject.properties) {
      const sourceName = getPropertyName(property);

      if (!consumedTireCompatibilityOtherSpecKeys.has(sourceName) || !t.isObjectProperty(property)) {
        remainingOtherSpecsProperties.push(property);
        continue;
      }

      const parsed = parseTireCompatibilityTypes(property.value);
      if (parsed.size === 0) {
        remainingOtherSpecsProperties.push(property);
        continue;
      }

      for (const type of parsed) addTireCompatibilityType(types, type);
      changed = true;
    }

    if (changed) {
      otherSpecsObject.properties = remainingOtherSpecsProperties;
    }
  }

  if (types.size === 0 && !hadTubelessReady) return changed;

  setRimTireCompatibility(rimObject, types);
  setRimBooleanField(rimObject, 'tubeless_ready', types.size === 0 ? null : types.has('tubeless'));

  return changed || types.size > 0 || hadTubelessReady;
};

const promoteTireCompatibility = (source) => {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  let changed = false;

  traverse(ast, {
    ObjectExpression(path) {
      if (promoteTireCompatibilityInObjectExpression(path.node)) {
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

const ENGAGEMENT_TYPES = ['star-ratchet', 'ratchet', 'pawl', 'other'];

const parsePositiveNumber = (value) => {
  if (t.isNumericLiteral(value) && Number.isFinite(value.value) && value.value > 0) {
    return value.value;
  }

  if (!t.isStringLiteral(value)) return null;
  const text = value.value.trim();
  if (!text) return null;
  const match = text.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return null;
  const parsed = Number(match[1].replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const parseEngagementFromText = (value) => {
  if (!t.isStringLiteral(value)) return { type: null, points: null };

  const text = value.value.trim().toLowerCase();
  if (!text) return { type: null, points: null };

  let type = null;
  if (/\bdt\s*swiss\b.*\bratchet\b|\bratchet\s*exp\b|\bstar[-\s]?ratchet\b/.test(text)) {
    type = 'star-ratchet';
  } else if (/\bratchet\b/.test(text)) {
    type = 'ratchet';
  } else if (/\bpawl(?:s)?\b/.test(text)) {
    type = 'pawl';
  } else if (/\bengagement\b|\bdrive\s*system\b|\bclutch\b/.test(text)) {
    type = 'other';
  }

  const toothMatch = text.match(/(\d+(?:[.,]\d+)?)\s*t\b/);
  const pointsMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:poe|points?\s+of\s+engagement|engagement\s+points?)/);
  const points = toothMatch
    ? Number(toothMatch[1].replace(',', '.'))
    : pointsMatch
      ? Number(pointsMatch[1].replace(',', '.'))
      : null;

  return {
    type,
    points: Number.isFinite(points) && points > 0 ? points : null,
  };
};

const parseExistingHubEngagement = (hubObject) => {
  const existing = getObjectProperty(hubObject, 'engagement');
  const result = { type: null, points: null };
  if (!existing || !t.isObjectProperty(existing) || !t.isObjectExpression(existing.value)) return result;

  const typeProperty = getObjectProperty(existing.value, 'type');
  if (typeProperty && t.isObjectProperty(typeProperty) && t.isStringLiteral(typeProperty.value)) {
    result.type = ENGAGEMENT_TYPES.includes(typeProperty.value.value) ? typeProperty.value.value : null;
  }

  const pointsProperty = getObjectProperty(existing.value, 'points');
  if (pointsProperty && t.isObjectProperty(pointsProperty)) {
    result.points = parsePositiveNumber(pointsProperty.value);
  }

  return result;
};

const setHubEngagement = (hubObject, engagement) => {
  const typeNode = engagement.type ? t.stringLiteral(engagement.type) : t.nullLiteral();
  const pointsNode = engagement.points !== null ? t.numericLiteral(engagement.points) : t.nullLiteral();
  const node = t.objectExpression([
    t.objectProperty(t.identifier('type'), typeNode),
    t.objectProperty(t.identifier('points'), pointsNode),
  ]);
  const existing = getObjectProperty(hubObject, 'engagement');

  if (existing && t.isObjectProperty(existing)) {
    existing.value = node;
  } else {
    hubObject.properties.push(t.objectProperty(t.identifier('engagement'), node));
  }
};

const promoteHubEngagementInObjectExpression = (objectExpression) => {
  const hubProperty = getObjectProperty(objectExpression, 'hub');
  const otherSpecsProperty =
    getObjectProperty(objectExpression, 'other_specs') ?? getObjectProperty(objectExpression, 'otherSpecs');

  if (!hubProperty || !t.isObjectProperty(hubProperty) || !t.isObjectExpression(hubProperty.value)) {
    return false;
  }
  if (!otherSpecsProperty || !t.isObjectProperty(otherSpecsProperty) || !t.isObjectExpression(otherSpecsProperty.value)) {
    return false;
  }

  const hubObject = hubProperty.value;
  const otherSpecsObject = otherSpecsProperty.value;
  const engagement = parseExistingHubEngagement(hubObject);
  const remainingOtherSpecsProperties = [];
  let changed = false;

  for (const property of otherSpecsObject.properties) {
    const sourceName = getPropertyName(property);

    if (!consumedHubEngagementOtherSpecKeys.has(sourceName) || !t.isObjectProperty(property)) {
      remainingOtherSpecsProperties.push(property);
      continue;
    }

    let parsed = { type: null, points: null };
    if (sourceName === 'points_of_engagement' || sourceName === 'ratchet_teeth') {
      parsed.points = parsePositiveNumber(property.value);
      if (sourceName === 'ratchet_teeth' && parsed.points !== null) parsed.type = 'ratchet';
    } else {
      parsed = parseEngagementFromText(property.value);
    }

    if (parsed.type === null && parsed.points === null) {
      remainingOtherSpecsProperties.push(property);
      continue;
    }

    if (sourceName === 'points_of_engagement') {
      engagement.points = parsed.points ?? engagement.points;
    } else {
      engagement.type ??= parsed.type;
      engagement.points ??= parsed.points;
    }
    changed = true;
  }

  if (!changed) return false;

  otherSpecsObject.properties = remainingOtherSpecsProperties;
  setHubEngagement(hubObject, engagement);
  return true;
};

const promoteHubEngagement = (source) => {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  let changed = false;

  traverse(ast, {
    ObjectExpression(path) {
      if (promoteHubEngagementInObjectExpression(path.node)) {
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

const parseTireWidthNumber = (value) => {
  if (t.isNumericLiteral(value) && Number.isFinite(value.value) && value.value > 0) {
    return value.value;
  }

  if (!t.isStringLiteral(value)) return null;
  const text = value.value.trim();
  if (!text) return null;
  const match = text.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return null;
  const parsed = Number(match[1].replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const parseTireWidthRange = (value) => {
  const single = parseTireWidthNumber(value);
  if (t.isNumericLiteral(value)) return { min: single, max: single };
  if (!t.isStringLiteral(value)) return { min: null, max: null };

  const text = value.value.trim().toLowerCase();
  if (!text) return { min: null, max: null };

  const rangeMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:c|mm)?\s*(?:-|–|—|to|à|a)\s*(\d+(?:[.,]\d+)?)\s*(?:c|mm)?/);
  if (rangeMatch) {
    const first = Number(rangeMatch[1].replace(',', '.'));
    const second = Number(rangeMatch[2].replace(',', '.'));
    if (Number.isFinite(first) && Number.isFinite(second) && first > 0 && second > 0) {
      return { min: Math.min(first, second), max: Math.max(first, second) };
    }
  }

  const etrtoRangeMatch = text.match(/\b(\d+(?:[.,]\d+)?)\s*-\s*622\s*-\s*(\d+(?:[.,]\d+)?)\s*-\s*622\b/);
  if (etrtoRangeMatch) {
    const first = Number(etrtoRangeMatch[1].replace(',', '.'));
    const second = Number(etrtoRangeMatch[2].replace(',', '.'));
    if (Number.isFinite(first) && Number.isFinite(second) && first > 0 && second > 0) {
      return { min: Math.min(first, second), max: Math.max(first, second) };
    }
  }

  const etrtoSingleMatch = text.match(/\b(\d+(?:[.,]\d+)?)\s*-\s*622\b/);
  if (etrtoSingleMatch) {
    const width = Number(etrtoSingleMatch[1].replace(',', '.'));
    if (Number.isFinite(width) && width > 0) return { min: width, max: width };
  }

  const etrtoRimMatch = text.match(/\b622\s*x\s*(\d+(?:[.,]\d+)?)/);
  if (etrtoRimMatch) {
    const width = Number(etrtoRimMatch[1].replace(',', '.'));
    if (Number.isFinite(width) && width > 0) return { min: width, max: width };
  }

  const aboveMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:c|mm)?\s*(?:and\s+above|\+|minimum|min\.?|above)/);
  if (aboveMatch) {
    const min = Number(aboveMatch[1].replace(',', '.'));
    if (Number.isFinite(min) && min > 0) return { min, max: null };
  }

  if (/^\d+(?:[.,]\d+)?\s*(?:c|mm)?$/.test(text)) {
    const width = parseTireWidthNumber(value);
    return { min: width, max: width };
  }

  return { min: null, max: null };
};

const parseExistingTireWidth = (rimObject) => {
  const existing = getObjectProperty(rimObject, 'tire_width_mm');
  const result = { min: null, max: null };
  if (!existing || !t.isObjectProperty(existing) || !t.isObjectExpression(existing.value)) return result;

  const minProperty = getObjectProperty(existing.value, 'min');
  const maxProperty = getObjectProperty(existing.value, 'max');
  if (minProperty && t.isObjectProperty(minProperty)) result.min = parseTireWidthNumber(minProperty.value);
  if (maxProperty && t.isObjectProperty(maxProperty)) result.max = parseTireWidthNumber(maxProperty.value);
  return result;
};

const setRimTireWidth = (rimObject, width) => {
  const node = t.objectExpression([
    t.objectProperty(t.identifier('min'), width.min !== null ? t.numericLiteral(width.min) : t.nullLiteral()),
    t.objectProperty(t.identifier('max'), width.max !== null ? t.numericLiteral(width.max) : t.nullLiteral()),
  ]);
  const existing = getObjectProperty(rimObject, 'tire_width_mm');

  if (existing && t.isObjectProperty(existing)) {
    existing.value = node;
  } else {
    rimObject.properties.push(t.objectProperty(t.identifier('tire_width_mm'), node));
  }
};

const promoteTireWidthMmInObjectExpression = (objectExpression) => {
  const rimProperty = getObjectProperty(objectExpression, 'rim');
  const otherSpecsProperty =
    getObjectProperty(objectExpression, 'other_specs') ?? getObjectProperty(objectExpression, 'otherSpecs');

  if (!rimProperty || !t.isObjectProperty(rimProperty) || !t.isObjectExpression(rimProperty.value)) {
    return false;
  }
  if (!otherSpecsProperty || !t.isObjectProperty(otherSpecsProperty) || !t.isObjectExpression(otherSpecsProperty.value)) {
    return false;
  }

  const rimObject = rimProperty.value;
  const otherSpecsObject = otherSpecsProperty.value;
  const width = parseExistingTireWidth(rimObject);
  const remainingOtherSpecsProperties = [];
  let changed = false;

  for (const property of otherSpecsObject.properties) {
    const sourceName = getPropertyName(property);

    if (!consumedTireWidthOtherSpecKeys.has(sourceName) || !t.isObjectProperty(property)) {
      remainingOtherSpecsProperties.push(property);
      continue;
    }

    let parsed = { min: null, max: null };
    if (sourceName === 'min_tire_width_mm') {
      parsed.min = parseTireWidthNumber(property.value);
    } else if (sourceName === 'max_tire_width_mm') {
      parsed.max = parseTireWidthNumber(property.value);
    } else {
      parsed = parseTireWidthRange(property.value);
    }

    if (parsed.min === null && parsed.max === null) {
      remainingOtherSpecsProperties.push(property);
      continue;
    }

    width.min ??= parsed.min;
    width.max ??= parsed.max;
    changed = true;
  }

  if (!changed) return false;

  otherSpecsObject.properties = remainingOtherSpecsProperties;
  setRimTireWidth(rimObject, width);
  return true;
};

const promoteTireWidthMm = (source) => {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  let changed = false;

  traverse(ast, {
    ObjectExpression(path) {
      if (promoteTireWidthMmInObjectExpression(path.node)) {
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
