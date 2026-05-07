export function roundToStep(value, step) {
  if (!Number.isFinite(value) || !Number.isFinite(step) || step <= 0) return value;
  const decimals = (String(step).split('.')[1] || '').length;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function clampLow({ raw, min, valueHigh, step, minDiff }) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return min;
  const upper = roundToStep(valueHigh - minDiff, step);
  return roundToStep(Math.max(min, Math.min(n, upper)), step);
}

export function clampHigh({ raw, max, valueLow, step, minDiff }) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return max;
  const lower = roundToStep(valueLow + minDiff, step);
  return roundToStep(Math.min(max, Math.max(n, lower)), step);
}
