import { describe, expect, it } from 'vitest';
import { termParts } from './LearnGame';

describe('termParts', () => {
  it('names the parts and fills in invisible 1s', () => {
    expect(termParts('5y³')).toEqual([{ kind: 'coef', text: '5', invisible: false }, { kind: 'letter', text: 'y' }, { kind: 'exp', text: '3', invisible: false }]);
    expect(termParts('−k²')![0]).toEqual({ kind: 'coef', text: '−1', invisible: true });
    expect(termParts('m')![2]).toEqual({ kind: 'exp', text: '1', invisible: true });
    expect(termParts('2 + x')).toBeNull();
  });
});
