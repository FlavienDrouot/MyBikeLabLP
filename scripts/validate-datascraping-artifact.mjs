#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const USAGE = `Usage:
  node scripts/validate-datascraping-artifact.mjs --phase acquisition --file <evidence.json>
  node scripts/validate-datascraping-artifact.mjs --phase normalization --file <canonical-products.json> --accounting <fact-accounting.json>
  node scripts/validate-datascraping-artifact.mjs --phase handoff --file <evidence.json> --handoff <handoff.json> --manifest <manifest.json> --family <family-id>
`;

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  process.stdout.write(USAGE);
  process.exit(0);
}

const errors = [];
const phase = args.phase;
if (!phase || !["acquisition", "normalization", "handoff"].includes(phase)) {
  errors.push("--phase must be acquisition, normalization, or handoff");
}
if (!args.file) errors.push("--file is required");
if (phase === "normalization" && !args.accounting) errors.push("--accounting is required for normalization");
if (phase === "handoff" && (!args.handoff || !args.manifest || !args.family)) {
  errors.push("--handoff, --manifest, and --family are required for handoff validation");
}

const file = args.file ? readJson(args.file, errors) : null;
if (phase === "acquisition" && file) validateAcquisition(file, errors);
if (phase === "normalization" && file) {
  const accounting = readJson(args.accounting, errors);
  if (accounting) validateNormalization(file, accounting, errors);
}
if (phase === "handoff" && file) {
  const handoff = readJson(args.handoff, errors);
  const manifest = readJson(args.manifest, errors);
  if (handoff && manifest) validateHandoff(file, handoff, manifest, args.family, errors);
}

if (errors.length > 0) {
  process.stderr.write(`VALIDATION_FAILED\n${errors.map((error) => `- ${error}`).join("\n")}\n`);
  process.exit(1);
}

process.stdout.write(`VALIDATION_PASSED phase=${phase}\n`);

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") {
      result.help = true;
      continue;
    }
    if (!token.startsWith("--")) continue;
    const [key, inlineValue] = token.slice(2).split("=", 2);
    result[key] = inlineValue ?? argv[index + 1];
    if (inlineValue === undefined) index += 1;
  }
  return result;
}

function readJson(filePath, errors) {
  try {
    return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
  } catch (error) {
    errors.push(`${filePath}: cannot read valid JSON (${error.message})`);
    return null;
  }
}

function validateAcquisition(evidence, errors) {
  requireObject(evidence, "evidence", errors);
  if (!String(evidence.schema_version ?? "").startsWith("mybikelab.family-evidence.")) {
    errors.push("evidence.schema_version must use mybikelab.family-evidence.*");
  }

  const sources = Array.isArray(evidence.sources) ? evidence.sources : [];
  const sourceIds = uniqueIds(sources, "source_id", "sources", errors);
  const facts = collectFacts(evidence, errors);
  const observations = Array.isArray(evidence.observations) ? evidence.observations : [];
  const observationIds = uniqueIds(observations, "observation_id", "observations", errors);

  if (!Array.isArray(evidence.observations)) errors.push("observations must be an array");
  if (!evidence.matrix_coverage || typeof evidence.matrix_coverage !== "object") {
    errors.push("matrix_coverage must be an object");
  } else if (evidence.matrix_coverage.observation_count !== observations.length) {
    errors.push("matrix_coverage.observation_count must equal observations.length");
  }

  for (const observation of observations) {
    const prefix = `observation ${observation.observation_id ?? "<missing>"}`;
    if (!observationIds.has(observation.observation_id)) continue;
    const disposition = observation.disposition;
    if (!["settled", "excluded", "unresolved"].includes(disposition)) {
      errors.push(`${prefix}: disposition must be settled, excluded, or unresolved`);
    }

    const actions = Array.isArray(observation.selector_actions) ? observation.selector_actions : null;
    const assertions = Array.isArray(observation.settled_state_assertions) ? observation.settled_state_assertions : null;
    if (!actions || !assertions) {
      errors.push(`${prefix}: selector_actions and settled_state_assertions are required arrays`);
    } else {
      const actionIds = uniqueIds(actions, "action_id", `${prefix}.selector_actions`, errors);
      const assertionIds = uniqueIds(assertions, "assertion_id", `${prefix}.settled_state_assertions`, errors);
      const assertionsByAction = new Map();
      for (const assertion of assertions) {
        assertionsByAction.set(assertion.action_id, (assertionsByAction.get(assertion.action_id) ?? 0) + 1);
      }
      for (const actionId of actionIds) {
        const assertionCount = assertionsByAction.get(actionId) ?? 0;
        if (assertionCount === 0) errors.push(`${prefix}: selector action ${actionId} has no settlement assertion`);
        if (assertionCount > 1) errors.push(`${prefix}: selector action ${actionId} has ${assertionCount} settlement assertions; exactly one is required`);
      }
      for (const assertion of assertions) {
        if (!actionIds.has(assertion.action_id)) errors.push(`${prefix}: assertion ${assertion.assertion_id ?? "<missing>"} references no selector action`);
        if (assertion.status !== "passed") errors.push(`${prefix}: assertion ${assertion.assertion_id ?? "<missing>"} is not passed`);
        if (assertion.requested_value === undefined || assertion.observed_value === undefined) {
          errors.push(`${prefix}: every assertion must contain requested_value and observed_value`);
        }
        if (!assertion.visible_label && !assertion.control_state) {
          errors.push(`${prefix}: every assertion must contain visible_label or control_state`);
        }
      }
      if (disposition === "settled" && assertions.some((assertion) => assertion.status !== "passed")) {
        errors.push(`${prefix}: settled observation requires all assertions to pass`);
      }
    }

    if (disposition === "settled") {
      const source = sources.find((candidate) => candidate.source_id === observation.source_id);
      if (!source || source.method !== "in_app_browser") {
        errors.push(`${prefix}: settled observation requires an in_app_browser source`);
      }
    }
    if (disposition === "excluded" && observation.scope_status !== "excluded_single_wheel") {
      errors.push(`${prefix}: excluded observation must use scope_status=excluded_single_wheel`);
    }
    if (disposition === "unresolved" && !observation.disposition_reason && !observation.unresolved_refs?.length) {
      errors.push(`${prefix}: unresolved observation requires disposition_reason or unresolved_refs`);
    }
    if (observation.base_url && observation.url_after_selection === observation.base_url) {
      errors.push(`${prefix}: url_after_selection must be empty when the base URL is retained`);
    }
  }

  for (const fact of facts) {
    const label = `${fact.label ?? ""} ${fact.source_label ?? ""}`.toLowerCase();
    if (!label.includes("weight")) continue;
    const semantics = fact.weight_semantics;
    if (!semantics || !["front", "rear", "wheelset", "unknown"].includes(semantics.kind)) {
      errors.push(`fact ${fact.fact_id}: weight_semantics.kind must be front, rear, wheelset, or unknown`);
    }
    if (semantics?.tolerance !== null && semantics?.tolerance !== undefined) {
      if (!Number.isFinite(semantics.tolerance.value) || !semantics.tolerance.unit) {
        errors.push(`fact ${fact.fact_id}: weight tolerance must contain numeric value and unit`);
      }
    }
  }

  for (const fact of facts) {
    if (fact.source_id && !sourceIds.has(fact.source_id)) errors.push(`fact ${fact.fact_id}: source_id does not resolve`);
  }
}

function validateNormalization(products, accounting, errors) {
  if (!Array.isArray(products)) errors.push("canonical products must be an array");
  const productsArray = Array.isArray(products) ? products : [];
  uniqueIds(productsArray, "id", "canonical products", errors);

  requireObject(accounting, "fact-accounting", errors);
  if (!Array.isArray(accounting.records)) errors.push("fact-accounting.records must be an array");
  if (!accounting.validation || typeof accounting.validation !== "object") {
    errors.push("fact-accounting.validation is required");
  } else {
    for (const key of ["canonical_schema_valid", "all_fact_refs_resolve", "all_captured_facts_accounted_once", "all_observations_preserved_once"]) {
      if (accounting.validation[key] !== true) errors.push(`fact-accounting.validation.${key} must be true`);
    }
  }

  for (const record of accounting.records ?? []) {
    const prefix = `fact-accounting record ${record.evidence_id ?? "<missing>"}`;
    const decisions = Array.isArray(record.classification_decisions) ? record.classification_decisions : [];
    const mappings = Array.isArray(record.normalized_mappings) ? record.normalized_mappings : [];
    if (!Array.isArray(record.classification_decisions)) errors.push(`${prefix}: classification_decisions must be an array`);
    if (!Array.isArray(record.normalized_mappings)) errors.push(`${prefix}: normalized_mappings must be an array`);
    for (const decision of decisions) {
      if (!["variant", "option", "cosmetic", "offer", "unknown"].includes(decision.classification)) {
        errors.push(`${prefix}: invalid classification ${decision.classification}`);
      }
      if (!Array.isArray(decision.fact_refs) || decision.fact_refs.length === 0) errors.push(`${prefix}: classification lacks fact_refs`);
      if (decision.classification === "unknown" && (decision.canonical_ids?.length ?? 0) > 0) {
        errors.push(`${prefix}: unknown classification cannot map canonical IDs`);
      }
    }
    for (const mapping of mappings) {
      if (!mapping.target_path || !Array.isArray(mapping.fact_refs) || mapping.fact_refs.length === 0) {
        errors.push(`${prefix}: normalized mapping requires target_path and fact_refs`);
      }
    }
    const coverage = record.coverage;
    if (coverage && coverage.commerce_observation_count < coverage.catalog_variant_count) {
      errors.push(`${prefix}: commerce_observation_count cannot be lower than catalog_variant_count`);
    }
  }

  for (const product of productsArray) {
    if (!product || typeof product !== "object") continue;
    if (product.weight_grams === null || product.weight_grams === undefined) continue;
    const hasPair = typeof product.weight_grams === "object" && product.weight_grams.front !== undefined && product.weight_grams.rear !== undefined;
    const hasMapping = (accounting.records ?? []).some((record) => (record.normalized_mappings ?? []).some((mapping) => mapping.target_path === "weight_grams" && mapping.canonical_ids?.includes(product.id)));
    if (!hasMapping) errors.push(`canonical product ${product.id}: weight_grams has no normalized mapping`);
    if (hasPair && (!Number.isFinite(product.weight_grams.front) || !Number.isFinite(product.weight_grams.rear))) {
      errors.push(`canonical product ${product.id}: front/rear weight values must be numeric`);
    }
  }
}

function validateHandoff(evidence, handoff, manifest, family, errors) {
  const evidenceCounts = countDispositions(evidence.observations, errors);
  const handoffCounts = handoff?.counts;
  if (!handoffCounts) errors.push("handoff.counts is required");
  else compareCounts(evidenceCounts, handoffCounts, "handoff.counts", errors);

  const manifestFamily = manifest?.acquisition?.families?.[family];
  if (!manifestFamily) {
    errors.push(`manifest.acquisition.families.${family} is required`);
  } else if (!manifestFamily.counts) {
    errors.push(`manifest.acquisition.families.${family}.counts is required`);
  } else {
    compareCounts(evidenceCounts, manifestFamily.counts, `manifest.acquisition.families.${family}.counts`, errors);
  }

  const revision = handoff?.revision;
  if (!revision?.revision_id || revision.parent_revision_id === undefined) {
    errors.push("handoff.revision must contain revision_id and parent_revision_id");
  }
  if (handoff?.artifact_path && path.resolve(handoff.artifact_path) !== path.resolve(args.file)) {
    errors.push("handoff.artifact_path does not match --file");
  }
}

function countDispositions(observations, errors) {
  const counts = { observations: observations?.length ?? 0, settled: 0, excluded: 0, unresolved: 0 };
  for (const observation of observations ?? []) {
    if (counts[observation.disposition] === undefined) {
      errors.push(`observation ${observation.observation_id ?? "<missing>"}: invalid disposition`);
    } else {
      counts[observation.disposition] += 1;
    }
  }
  return counts;
}

function compareCounts(expected, actual, label, errors) {
  for (const key of Object.keys(expected)) {
    if (actual[key] !== expected[key]) errors.push(`${label}.${key} must equal ${expected[key]}`);
  }
}

function collectFacts(evidence, errors) {
  const facts = [];
  const add = (fact, location) => {
    if (!fact || typeof fact !== "object") return;
    if (!fact.fact_id) errors.push(`${location}: fact_id is required`);
    facts.push(fact);
  };
  for (const fact of evidence.stable_facts ?? []) add(fact, "stable_facts");
  for (const profile of evidence.configuration_profiles ?? []) {
    for (const fact of profile.facts ?? []) add(fact, `profile ${profile.profile_id ?? "<missing>"}`);
  }
  for (const observation of evidence.observations ?? []) {
    for (const fact of observation.facts ?? []) add(fact, `observation ${observation.observation_id ?? "<missing>"}`);
  }
  const seen = new Set();
  for (const fact of facts) {
    if (seen.has(fact.fact_id)) errors.push(`duplicate fact_id ${fact.fact_id}`);
    seen.add(fact.fact_id);
  }
  return facts;
}

function uniqueIds(items, key, label, errors) {
  const ids = new Set();
  for (const item of items ?? []) {
    const id = item?.[key];
    if (!id) errors.push(`${label}: ${key} is required`);
    else if (ids.has(id)) errors.push(`${label}: duplicate ${key} ${id}`);
    else ids.add(id);
  }
  return ids;
}

function requireObject(value, label, errors) {
  if (!value || typeof value !== "object" || Array.isArray(value)) errors.push(`${label} must be an object`);
}
