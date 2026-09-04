import { describe, it, expect } from 'vitest';
import { resolveSpec } from '../wheelUtils';

describe('resolveSpec', () => {
  it('returns symmetric single-value result for a scalar number', () => {
    expect(resolveSpec(45)).toEqual({ front: 45, rear: 45, total: 45, isSingle: true });
  });

  it('returns divergent result for a valid pair with different front and rear', () => {
    expect(resolveSpec({ front: 50, rear: 60 })).toEqual({ front: 50, rear: 60, total: 110, isSingle: false });
  });

  it('returns isSingle true when front and rear are equal in a pair', () => {
    expect(resolveSpec({ front: 60, rear: 60 })).toEqual({ front: 60, rear: 60, total: 120, isSingle: true });
  });

  it('normalizes an incomplete pair with front only to single-value', () => {
    expect(resolveSpec({ front: 50 })).toEqual({ front: 50, rear: 50, total: 50, isSingle: true });
  });

  it('normalizes an incomplete pair with rear only to single-value', () => {
    expect(resolveSpec({ rear: 60 })).toEqual({ front: 60, rear: 60, total: 60, isSingle: true });
  });

  it('returns all-null result for null', () => {
    expect(resolveSpec(null)).toEqual({ front: null, rear: null, total: null, isSingle: true });
  });

  it('returns all-null result for undefined', () => {
    expect(resolveSpec(undefined)).toEqual({ front: null, rear: null, total: null, isSingle: true });
  });
});
