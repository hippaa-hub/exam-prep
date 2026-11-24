// Helpers for maths packs: algebra questions with their "Show me how" steps written by the app,
// following the teacher's 3-step method (signs, then numbers, then letters).
import { factorsOf, normalise, parse, polyText, pretty, type Mono } from '../engine/algebra';
import type { ExpressionItem, Slip } from './types';

const sup = (n: number) => pretty(`^${n}`);
const letterPow = (v: string, e: number) => (e === 1 ? v : `${v}${sup(e)}`);

/** The teacher's 3 steps for a product of terms: signs, numbers, letters. Null if the expression is not a product. */
export function multiplySteps(expr: string): string[] | null {
  const s = normalise(expr);
  const steps: string[] = [];
  let factors: Mono[] | null;
  // (3x)² is 3x × 3x: write it out first.
  const sq = s.match(/^\((.+)\)\^(\d+)$/);
  if (sq) {
    const n = Number(sq[2]);
    const inner = pretty(sq[1]);
    const written = Array(n).fill(inner.startsWith('−') ? `(${inner})` : inner).join(' × ');
    steps.push(`Write it out: the power applies to everything in the bracket, so it is ${written}.`);
    factors = factorsOf(Array(n).fill(`(${sq[1]})`).join('*'));
  } else {
    factors = factorsOf(expr);
  }
  if (!factors) return null;

  const minus = factors.filter((f) => f.coef < 0).length;
  steps.push(minus === 0
    ? 'Signs: no minus signs, so the answer is positive.'
    : `Signs: ${minus} minus sign${minus === 1 ? '' : 's'}, ${minus % 2 === 0 ? 'an even number, so the answer is +' : 'an odd number, so the answer is −'}.`);

  const coefs = factors.map((f) => Math.abs(f.coef));
  const product = coefs.reduce((a, b) => a * b, 1);
  if (coefs.every((c) => c === 1)) steps.push('Numbers: there are no numbers in front (each is 1), so the number is 1.');
  else steps.push(`Numbers: multiply them. ${coefs.join(' × ')} = ${product}.`);

  const letters = [...new Set(factors.flatMap((f) => Object.keys(f.powers)))].sort();
  const parts = letters.map((v) => {
    const es = factors!.map((f) => f.powers[v]).filter((e): e is number => e !== undefined);
    const total = es.reduce((a, b) => a + b, 0);
    if (es.length === 1) return `${letterPow(v, total)} stays ${letterPow(v, total)}`;
    return `${es.map((e) => letterPow(v, e)).join(' × ')} = ${v}${es.map((e) => sup(e)).join('⁺')} = ${letterPow(v, total)}`;
  });
  if (letters.length > 0) {
    steps.push(`Letters, in alphabetical order: ${parts.join('; ')}.${letters.some((v) => factors!.filter((f) => f.powers[v] !== undefined).length > 1) ? ' Same letter: ADD the powers.' : ''}`);
  }
  const answer = polyText(parse(expr)!);
  steps.push(`Put it together: ${answer}.`);
  return steps;
}

/** The steps for collecting like terms: group them, then add or subtract only the numbers in front. */
export function collectSteps(expr: string, groups: string): string[] {
  const answer = polyText(parse(expr)!);
  return [
    'Find the like terms: the same letters with the same powers. Each term keeps the sign in front of it.',
    `Group them: ${groups}.`,
    'Add or subtract only the numbers in front. The letters and powers stay the same.',
    `Answer: ${answer}.`,
  ];
}

/** A multiplication question. The answer is written by hand; the tests recalculate every one. */
export function mul(id: string, concept: string, expr: string, answer: string, prompt = 'Multiply. Show your steps: signs, numbers, letters.', slips?: Slip[]): ExpressionItem {
  return { id, concept, type: 'expression', kind: 'multiply', prompt, expr, answer, how: multiplySteps(expr) ?? undefined, ...(slips ? { slips } : {}) };
}

/** A "collect like terms" question. `groups` shows how the like terms go together, for "Show me how". */
export function collect(id: string, concept: string, expr: string, answer: string, groups: string, slips?: Slip[]): ExpressionItem {
  return {
    id, concept, type: 'expression', kind: 'collect', prompt: 'Simplify by collecting like terms.', expr, answer,
    how: collectSteps(expr, groups), ...(slips ? { slips } : {}),
  };
}
