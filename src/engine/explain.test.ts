import { describe, expect, it } from 'vitest';
import { choice, pair } from '../content/build';
import { explainChoice } from './explain';

const meanings = {
  Power: 'Power is the ability to influence people.',
  Authority: 'Authority is the accepted right to decide.',
};
const pack = { meanings };

describe('explaining a choice', () => {
  const q = pair('p', 'The accepted right to decide.', ['Power', 'Authority'], 'Authority', 'A judge has authority whether or not people agree.');

  it('gives the reason for the right answer', () => {
    expect(explainChoice(pack, q, 'Authority')).toEqual({ correct: 'Authority', whyRight: 'A judge has authority whether or not people agree.' });
    expect(explainChoice(pack, q)).toEqual({ correct: 'Authority', whyRight: 'A judge has authority whether or not people agree.' });
  });

  it('says what a wrong choice really means', () => {
    expect(explainChoice(pack, q, 'Power')).toEqual({
      correct: 'Authority', whyRight: 'A judge has authority whether or not people agree.',
      chosen: 'Power', whyNot: 'Power is the ability to influence people.',
    });
  });

  it("prefers the question's own reason for a wrong answer", () => {
    const c = { ...choice('c', 'q', 'Authority', ['Power']), whyNot: { Power: 'Here it is about the right, not the ability.' } };
    expect(explainChoice(pack, c, 'Power').whyNot).toBe('Here it is about the right, not the ability.');
  });

  it('falls back to the meaning of the right answer when the question has no explanation', () => {
    expect(explainChoice(pack, choice('c', 'q', 'Authority', ['Power']), 'Authority').whyRight).toBe(meanings.Authority);
  });
});
