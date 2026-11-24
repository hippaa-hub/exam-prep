import { describe, expect, it } from 'vitest';
import { equivalent, evaluate, factorsOf, isSimplified, multiplySlip, parse, polyText, pretty } from './algebra';

describe('reading algebra', () => {
  it('accepts any equal way of writing an answer', () => {
    expect(equivalent('7x + 3y', '3y + 7x')).toBe(true);
    expect(equivalent('pqr', 'rqp')).toBe(true);
    expect(equivalent('-24pqr', '−24pqr')).toBe(true);
    expect(equivalent('x^2', 'x²')).toBe(true);
    expect(equivalent('6x^5', '3x² × 2x³')).toBe(true);
    expect(equivalent('2p × (−4q) × 3r', '−24pqr')).toBe(true);
    expect(equivalent('(−5x)(−3y)', '15xy')).toBe(true);
    expect(equivalent('(3x)²', '9x²')).toBe(true);
    expect(equivalent('−3²', '−9')).toBe(true);
    expect(equivalent('(−3)²', '9')).toBe(true);
    expect(equivalent('(8a − 3b + 5) − (2a + 4b − 6)', '6a − 7b + 11')).toBe(true);
    expect(equivalent('x³ × x²', 'x⁶')).toBe(false);
  });
  it('agrees with working the value out', () => {
    expect(evaluate('(3x²y)(−2xy³)', { x: 2, y: 3 })).toBe(-6 * 8 * 81);
    expect(evaluate('1 − a²', { a: -3 })).toBe(-8);
  });
  it('rejects text it cannot read', () => {
    expect(parse('3x +')).toBeNull();
    expect(parse('(2x')).toBeNull();
    expect(parse('')).toBeNull();
  });
});

describe('simplest form', () => {
  it.each(['7x + 3y', '−24pqr', '6x⁵', '3m² − 2m', '−3a − 4a²', '10t − 1', '9x²', '0', '−x³'])('%s is simplified', (s) => {
    expect(isSimplified(s)).toBe(true);
  });
  it.each(['5x + 2x', '2x × 3x', '(3x)²', '1x', 'xx', '3 + 4', '2(x + 1)', '4x²+3x−x²'])('%s is not', (s) => {
    expect(isSimplified(s)).toBe(false);
  });
});

describe('showing maths', () => {
  it('writes powers and minus signs properly', () => {
    expect(pretty('-6x^3y^4')).toBe('−6x³y⁴');
    expect(pretty('2x-3')).toBe('2x − 3');
    expect(pretty('2p×(-4q)')).toBe('2p × (−4q)');
    expect(polyText(parse('4m² + 3m − m² − 5m')!)).toBe('3m² − 2m');
  });
});

describe('known slips', () => {
  it('spots the usual multiplication slips', () => {
    expect(factorsOf('2p × (−4q) × 3r')).toHaveLength(3);
    expect(multiplySlip('x⁴ × x', 'x⁵', 'x⁴')).toMatch(/count the letters/i);
    expect(multiplySlip('5x² × 2x³', '10x⁵', '10x⁶')).toMatch(/multiplied the powers/);
    expect(multiplySlip('4y × 2y', '8y²', '6y')).toMatch(/adding/);
    expect(multiplySlip('−5m × (−2n)', '10mn', '−10mn')).toMatch(/minus signs/);
    expect(multiplySlip('(4c)²', '16c²', '4c²')).toMatch(/number too/);
    expect(multiplySlip('4y × 2y', '8y²', '8y')).toMatch(/count the letters/i);
  });
});
