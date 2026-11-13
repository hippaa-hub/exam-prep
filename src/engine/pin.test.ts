import { describe, expect, it } from 'vitest';
import { isValidPin, pinMatches, scramblePin } from './pin';

describe('the parent code', () => {
  it('is four digits', () => {
    expect(isValidPin('0412')).toBe(true);
    expect(isValidPin('123')).toBe(false);
    expect(isValidPin('12345')).toBe(false);
    expect(isValidPin('12a4')).toBe(false);
  });

  it('is saved scrambled, and still recognised', () => {
    const saved = scramblePin('0412');
    expect(saved).not.toContain('0412');
    expect(pinMatches('0412', saved)).toBe(true);
    expect(pinMatches('0413', saved)).toBe(false);
    expect(pinMatches('0412', undefined)).toBe(false);
  });

  it('gives every code its own scrambled form', () => {
    const all = new Set(Array.from({ length: 10000 }, (_, i) => scramblePin(String(i).padStart(4, '0'))));
    expect(all.size).toBe(10000);
  });
});
