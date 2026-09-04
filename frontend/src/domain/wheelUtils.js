/**
 * Resolves a divergent-eligible spec field value into a normalized object.
 *
 * Accepts:
 *   - A plain number (single-value form): front = rear = total = value
 *   - An object { front, rear } (pair form): total = front + rear
 *   - An incomplete pair { front } or { rear }: normalized to single-value, caller should warn
 *   - null / undefined: all fields return null
 *
 * Pure function — no side effects.
 *
 * @param {number | { front?: number, rear?: number } | null | undefined} value
 * @returns {{ front: number|null, rear: number|null, total: number|null, isSingle: boolean }}
 */
export function resolveSpec(value) {
  if (value === null || value === undefined) {
    return { front: null, rear: null, total: null, isSingle: true };
  }

  if (typeof value === 'number') {
    return { front: value, rear: value, total: value, isSingle: true };
  }

  const hasFront = 'front' in value && value.front !== undefined;
  const hasRear = 'rear' in value && value.rear !== undefined;

  if (hasFront && hasRear) {
    const front = value.front;
    const rear = value.rear;
    const isSingle = front === rear;
    return { front, rear, total: front + rear, isSingle };
  }

  if (hasFront) {
    return { front: value.front, rear: value.front, total: value.front, isSingle: true };
  }

  if (hasRear) {
    return { front: value.rear, rear: value.rear, total: value.rear, isSingle: true };
  }

  return { front: null, rear: null, total: null, isSingle: true };
}
