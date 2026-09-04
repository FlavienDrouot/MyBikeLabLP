import { describe, it, expect } from 'vitest';
import { WHEEL_PROPERTIES } from '../wheelProperties';

const property = (id) => WHEEL_PROPERTIES.find((p) => p.id === id);

// ── depth ─────────────────────────────────────────────────────────────────────

describe('depth — accessor', () => {
  it('returns the scalar directly for a scalar input', () => {
    expect(property('depth').accessor({ rim: { depth_mm: 45 } })).toBe(45);
  });

  it('returns Math.max(front, rear) for a divergent pair', () => {
    expect(property('depth').accessor({ rim: { depth_mm: { front: 50, rear: 60 } } })).toBe(60);
  });

  it('returns Math.max(front, rear) for a pair where front > rear', () => {
    expect(property('depth').accessor({ rim: { depth_mm: { front: 65, rear: 55 } } })).toBe(65);
  });

  it('returns the scalar for an equal pair (isSingle: true)', () => {
    expect(property('depth').accessor({ rim: { depth_mm: { front: 50, rear: 50 } } })).toBe(50);
  });

  it('returns null for null', () => {
    expect(property('depth').accessor({ rim: { depth_mm: null } })).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(property('depth').accessor({ rim: { depth_mm: undefined } })).toBeNull();
  });
});

describe('tireCompatibility accessor', () => {
  it('returns the rim tire compatibility set', () => {
    expect(property('tireCompatibility').accessor({
      rim: { tire_compatibility: ['clincher', 'tubeless'] },
    })).toEqual(['clincher', 'tubeless']);
  });

  it('returns undefined when the rim is missing', () => {
    expect(property('tireCompatibility').accessor({})).toBeUndefined();
  });
});

describe('hub engagement accessors', () => {
  it('returns the hub engagement type', () => {
    expect(property('hubEngagementType').accessor({
      hub: { engagement: { type: 'star-ratchet', points: 36 } },
    })).toBe('star-ratchet');
  });

  it('returns the hub engagement points', () => {
    expect(property('hubEngagementPoints').accessor({
      hub: { engagement: { type: 'star-ratchet', points: 36 } },
    })).toBe(36);
  });

  it('returns null for missing hub engagement points', () => {
    expect(property('hubEngagementPoints').accessor({ hub: {} })).toBeNull();
  });
});

describe('depth — filterAccessor', () => {
  it('returns the scalar for a scalar input (not wrapped in array)', () => {
    expect(property('depth').filterAccessor({ rim: { depth_mm: 45 } })).toBe(45);
  });

  it('returns [front, rear] for a divergent pair', () => {
    expect(property('depth').filterAccessor({ rim: { depth_mm: { front: 50, rear: 60 } } })).toEqual([50, 60]);
  });

  it('returns the scalar for an equal pair (isSingle: true)', () => {
    expect(property('depth').filterAccessor({ rim: { depth_mm: { front: 50, rear: 50 } } })).toBe(50);
  });

  it('returns null for null', () => {
    expect(property('depth').filterAccessor({ rim: { depth_mm: null } })).toBeNull();
  });
});

// ── externalWidth ─────────────────────────────────────────────────────────────

describe('externalWidth — accessor', () => {
  it('returns the scalar directly for a scalar input', () => {
    expect(property('externalWidth').accessor({ rim: { externalWidth_mm: 28 } })).toBe(28);
  });

  it('returns Math.max(front, rear) for a divergent pair', () => {
    expect(property('externalWidth').accessor({ rim: { externalWidth_mm: { front: 26, rear: 30 } } })).toBe(30);
  });

  it('returns the scalar for an equal pair (isSingle: true)', () => {
    expect(property('externalWidth').accessor({ rim: { externalWidth_mm: { front: 28, rear: 28 } } })).toBe(28);
  });

  it('returns null for null', () => {
    expect(property('externalWidth').accessor({ rim: { externalWidth_mm: null } })).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(property('externalWidth').accessor({ rim: { externalWidth_mm: undefined } })).toBeNull();
  });
});

describe('externalWidth — filterAccessor', () => {
  it('returns the scalar for a scalar input', () => {
    expect(property('externalWidth').filterAccessor({ rim: { externalWidth_mm: 28 } })).toBe(28);
  });

  it('returns [front, rear] for a divergent pair', () => {
    expect(property('externalWidth').filterAccessor({ rim: { externalWidth_mm: { front: 26, rear: 30 } } })).toEqual([26, 30]);
  });

  it('returns the scalar for an equal pair (isSingle: true)', () => {
    expect(property('externalWidth').filterAccessor({ rim: { externalWidth_mm: { front: 28, rear: 28 } } })).toBe(28);
  });

  it('returns null for null', () => {
    expect(property('externalWidth').filterAccessor({ rim: { externalWidth_mm: null } })).toBeNull();
  });
});

// ── internalWidth ─────────────────────────────────────────────────────────────

describe('internalWidth — accessor', () => {
  it('returns the scalar directly for a scalar input', () => {
    expect(property('internalWidth').accessor({ rim: { internalWidth_mm: 21 } })).toBe(21);
  });

  it('returns Math.max(front, rear) for a divergent pair', () => {
    expect(property('internalWidth').accessor({ rim: { internalWidth_mm: { front: 19, rear: 23 } } })).toBe(23);
  });

  it('returns the scalar for an equal pair (isSingle: true)', () => {
    expect(property('internalWidth').accessor({ rim: { internalWidth_mm: { front: 21, rear: 21 } } })).toBe(21);
  });

  it('returns null for null', () => {
    expect(property('internalWidth').accessor({ rim: { internalWidth_mm: null } })).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(property('internalWidth').accessor({ rim: {} })).toBeNull();
  });
});

describe('internalWidth — filterAccessor', () => {
  it('returns the scalar for a scalar input', () => {
    expect(property('internalWidth').filterAccessor({ rim: { internalWidth_mm: 21 } })).toBe(21);
  });

  it('returns [front, rear] for a divergent pair', () => {
    expect(property('internalWidth').filterAccessor({ rim: { internalWidth_mm: { front: 19, rear: 23 } } })).toEqual([19, 23]);
  });

  it('returns the scalar for an equal pair (isSingle: true)', () => {
    expect(property('internalWidth').filterAccessor({ rim: { internalWidth_mm: { front: 21, rear: 21 } } })).toBe(21);
  });

  it('returns null for null', () => {
    expect(property('internalWidth').filterAccessor({ rim: { internalWidth_mm: null } })).toBeNull();
  });
});

// ── weight ────────────────────────────────────────────────────────────────────

describe('tireWidth accessors', () => {
  it('returns max as the sortable scalar when a range is available', () => {
    expect(property('tireWidth').accessor({ rim: { tire_width_mm: { min: 25, max: 32 } } })).toBe(32);
  });

  it('returns min as the sortable scalar when max is missing', () => {
    expect(property('tireWidth').accessor({ rim: { tire_width_mm: { min: 25, max: null } } })).toBe(25);
  });

  it('returns the canonical interval for range filtering', () => {
    expect(property('tireWidth').filterAccessor({ rim: { tire_width_mm: { min: 28, max: 32 } } })).toEqual({ min: 28, max: 32 });
  });

  it('preserves open intervals for range filtering', () => {
    expect(property('tireWidth').filterAccessor({ rim: { tire_width_mm: { min: 28, max: null } } })).toEqual({ min: 28, max: null });
  });

  it('returns null when tire width is missing', () => {
    expect(property('tireWidth').accessor({ rim: {} })).toBeNull();
    expect(property('tireWidth').filterAccessor({ rim: {} })).toBeNull();
  });
});

describe('weight — accessor', () => {
  it('returns the scalar directly for a scalar input', () => {
    expect(property('weight').accessor({ weight_grams: 1492 })).toBe(1492);
  });

  it('returns front + rear for a divergent pair', () => {
    expect(property('weight').accessor({ weight_grams: { front: 720, rear: 850 } })).toBe(1570);
  });

  it('returns front + rear for an equal pair', () => {
    expect(property('weight').accessor({ weight_grams: { front: 700, rear: 700 } })).toBe(1400);
  });

  it('returns null for null', () => {
    expect(property('weight').accessor({ weight_grams: null })).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(property('weight').accessor({ weight_grams: undefined })).toBeNull();
  });
});

describe('weight — filterAccessor', () => {
  it('has no filterAccessor property', () => {
    expect(property('weight').filterAccessor).toBeUndefined();
  });
});
