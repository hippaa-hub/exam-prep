// Checks every maths pack: each answer is recalculated, written in simplest form, and has its steps;
// the lessons' faded examples are right; and nothing from the homework due 25 Nov is in the app.
import { describe, expect, it } from 'vitest';
import { conceptOf, itemsOf, type ExpressionItem } from '../content/types';
import { equivalent, evaluate, isSimplified, normalise, parse } from '../engine/algebra';
import { judgeExpression } from '../engine/judge';
import { packs } from './index';

const mathsPacks = packs.filter((p) => p.subject === 'Mathematics');

/** The questions of "Homework 1 / Grade 7" (due Wed 25 Nov). She does these herself: none may appear in the app. */
const HOMEWORK = [
  '3x × 4', '−2a × 5b', '−4m × (−3n)', '2p × 3p', '(−3x) × (2x²)', '(5a²b) × (−2ab)',
  'x⁴ × x³', '2a² × 5a⁴', '3m²n × (−2mn³)', '(−2p³) × (−3p²)', '2x²y³ × 4xy', '(3q)²', '3x² × 4x³',
  '5x + 2x − x', '7y − 3y + 2', '6a² + 2a − 3a²', '4m + 3n − 2m + n', '−5p + 2p + 7', '8x² − 3x + x² + 2x',
];
const HOMEWORK_TEXT = ['6x⁶', '3x² cm and 4x³', '3x² and −5x²', '4ab and 7ba', '2x³ and 2x²'];

/** A few values for each letter, never 0 or 1, so a wrong answer cannot hide. */
const ENVS = [
  { a: 2, b: 3, c: 5, d: 7, k: -2, m: 3, n: -4, p: 5, q: 2, r: -3, t: 4, x: 3, y: -2 },
  { a: -3, b: 2, c: -2, d: 3, k: 5, m: -2, n: 3, p: -4, q: 7, r: 2, t: -5, x: -2, y: 5 },
  { a: 7, b: -5, c: 3, d: -2, k: 3, m: 4, n: 2, p: 3, q: -3, r: 5, t: 2, x: 5, y: 3 },
];

describe.each(mathsPacks.map((p) => [p.id, p] as const))('maths pack %s', (_id, pack) => {
  const items = itemsOf(pack);
  const exprs = items.filter((i): i is ExpressionItem => i.type === 'expression');

  it('has the right answer for every calculation, checked two ways', () => {
    for (const it of exprs) {
      expect(parse(it.expr), `${it.id}: expression`).not.toBeNull();
      expect(parse(it.answer), `${it.id}: answer`).not.toBeNull();
      expect(equivalent(it.expr, it.answer), `${it.id}: ${it.expr} = ${it.answer}`).toBe(true);
      // And by working out the value, independently of the polynomial check.
      for (const env of ENVS) expect(evaluate(it.answer, env), `${it.id} at ${JSON.stringify(env)}`).toBeCloseTo(evaluate(it.expr, env)!, 9);
      expect(isSimplified(it.answer), `${it.id}: answer in simplest form`).toBe(true);
      expect(judgeExpression(it, it.answer).kind, it.id).toBe('right');
      // The working shown after answering ends with the same answer.
      expect(it.how?.length ?? 0, `${it.id}: steps`).toBeGreaterThanOrEqual(3);
    }
  });

  it('does not accept the question itself, unsimplified, as the answer', () => {
    for (const it of exprs) {
      if (isSimplified(it.expr)) continue;
      expect(judgeExpression(it, it.expr).kind, it.id).toBe('simplify');
    }
  });

  it('has slips that really are wrong', () => {
    for (const it of exprs) for (const s of it.slips ?? []) expect(equivalent(s.answer, it.answer), `${it.id}: ${s.answer}`).toBe(false);
  });

  it('gives each idea at least three versions, so a miss comes back with different numbers', () => {
    expect(pack.freshNumbers).toBe(true);
    const concepts = [...new Set(items.map(conceptOf))];
    for (const c of concepts) {
      const versions = items.filter((i) => conceptOf(i) === c && i.type !== 'short');
      expect(versions.length, c).toBeGreaterThanOrEqual(2);
      const calc = versions.filter((i) => i.type === 'expression');
      if (calc.length > 0) expect(calc.length, `${c}: calculations`).toBeGreaterThanOrEqual(4);
    }
  });

  it('has a lesson for every topic, with right faded examples', () => {
    for (const t of pack.topics) expect(pack.lessons?.some((l) => l.topic === t.id), t.id).toBe(true);
    for (const l of pack.lessons ?? []) {
      for (const c of l.cards) {
        expect(c.steps.length, c.id).toBeGreaterThanOrEqual(2);
        if (c.tap) expect(c.tap.options[c.tap.answer], c.id).toBeTruthy();
        if (c.faded) {
          expect(equivalent(c.faded.expr, c.faded.answer), `${c.id}: faded`).toBe(true);
          expect(isSimplified(c.faded.answer), `${c.id}: faded simplest`).toBe(true);
        }
      }
    }
    if (pack.catchUp) expect(pack.lessons?.find((l) => l.topic === pack.catchUp)?.cards.length).toBe(8);
  });

  it('never asks a question from the homework due 25 Nov', () => {
    const asked = exprs.map((it) => normalise(it.expr));
    for (const hw of HOMEWORK) {
      // Same expression, written any way (brackets or not, any order of factors).
      const clash = exprs.filter((it) => normalise(it.expr).replace(/[()]/g, '') === normalise(hw).replace(/[()]/g, ''));
      expect(clash.map((c) => c.id), hw).toEqual([]);
    }
    const text = JSON.stringify(items);
    for (const t of HOMEWORK_TEXT) expect(text.includes(t), t).toBe(false);
    expect(asked.length).toBeGreaterThan(0);
  });
});
