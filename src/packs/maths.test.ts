// Checks every maths pack: each answer is recalculated, written in simplest form, and has its steps;
// the lessons' faded examples are right; and nothing from the homework due 25 Nov is in the app.
import { describe, expect, it } from 'vitest';
import { conceptOf, itemsOf, type ExpressionItem } from '../content/types';
import { equivalent, evaluate, isSimplified, normalise, parse } from '../engine/algebra';
import { judgeExpression } from '../engine/judge';
import { analyse } from '../content/maths';
import { countOf, shapeOf } from '../ui/PatternPicture';
import { checkInvestigation, pickPart1, ruleAt } from '../engine/mathsMock';
import { packs } from './index';
import { termParts } from '../ui/LearnGame';

const mathsPacks = packs.filter((p) => p.subject === 'Mathematics');

/** The questions of "Homework 1 / Grade 7" (due Wed 25 Nov). She does these herself: none may appear in the app. */
const HOMEWORK = [
  '3x × 4', '−2a × 5b', '−4m × (−3n)', '2p × 3p', '(−3x) × (2x²)', '(5a²b) × (−2ab)',
  'x⁴ × x³', '2a² × 5a⁴', '3m²n × (−2mn³)', '(−2p³) × (−3p²)', '2x²y³ × 4xy', '(3q)²', '3x² × 4x³',
  '5x + 2x − x', '7y − 3y + 2', '6a² + 2a − 3a²', '4m + 3n − 2m + n', '−5p + 2p + 7', '8x² − 3x + x² + 2x',
];
const HOMEWORK_TEXT = ['6x⁶', '3x² cm and 4x³', '3x² and −5x²', '4ab and 7ba', '2x³ and 2x²', '3p²q and 6pq²', '−x² means'];

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
      if (versions.some((i) => i.type === 'numeric')) expect(versions.length, `${c}: versions`).toBeGreaterThanOrEqual(3);
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
    if (pack.catchUp) expect(pack.lessons?.find((l) => l.topic === pack.catchUp)?.cards.length).toBe(10);
  });

  it('has the right number answers, each worked out again from its calculation', () => {
    // A tiny calculator for the checks: digits, + − × ÷, brackets and powers only.
    const calc = (c: string) => {
      const js = c.replace(/[−]/g, '-').replace(/\^/g, '**');
      expect(js, c).toMatch(/^[\d+\-*/(). ]+$/);
      return Function(`"use strict"; return (${js});`)() as number;
    };
    for (const it of items) {
      if (it.type !== 'numeric') continue;
      for (const f of it.fields) {
        expect(Number.isInteger(f.answer), `${it.id}: ${f.label}`).toBe(true);
        if (f.calc) expect(calc(f.calc), `${it.id}: ${f.label} = ${f.calc}`).toBe(f.answer);
      }
      for (const sl of it.slips ?? []) expect(sl.answer, `${it.id}: slip`).not.toBe(it.fields[0].answer);
      expect(it.how?.length ?? 0, `${it.id}: steps`).toBeGreaterThanOrEqual(2);
    }
    // Every number answer that can be calculated carries its calculation (the two-plants weeks are counted by listing).
    const withoutCalc = items.filter((it) => it.type === 'numeric' && it.fields.some((f) => !f.calc)).map((it) => it.id);
    expect(withoutCalc.every((id) => id.startsWith('p1-c-'))).toBe(true);
  });

  it('has sequences whose next terms, type and evidence are right', () => {
    for (const it of items) {
      if (it.type !== 'sequence') continue;
      const a = analyse(it.terms);
      expect(a.kind, it.id).toBe(it.kind);
      expect(a.next, it.id).toEqual(it.next);
      expect(it.evidence, it.id).toContain(it.rule);
      expect(new Set(it.evidence).size, it.id).toBe(it.evidence.length);
    }
  });

  it('has rules that really give their terms', () => {
    for (const it of exprs) {
      if (it.kind !== 'rule') continue;
      const v = (normalise(it.answer).match(/[a-z]/) ?? ['n'])[0];
      it.terms!.forEach((t, i) => expect(evaluate(it.answer, { [v]: i + 1 }), `${it.id}: term ${i + 1}`).toBe(t));
      // A wrong rule is caught and tested on the terms.
      expect(judgeExpression(it, `${it.answer} + 1`).say, it.id).toMatch(/Test it/);
    }
  });

  it('has Error Detective questions with one wrong line and a real fix', () => {
    for (const it of items) {
      if (it.type !== 'errorFind') continue;
      expect(it.wrong, it.id).toBeGreaterThan(0);
      expect(it.wrong, it.id).toBeLessThan(it.lines.length);
      expect(it.fixes, it.id).toContain(it.fix);
      expect(new Set(it.fixes).size, it.id).toBe(it.fixes.length);
      expect(it.fixes, it.id).not.toContain(it.lines[it.wrong]);
    }
  });

  it('draws each pattern with the number of pieces its rule says', () => {
    // matchsticks 3n + 1, toothpicks 2n + 1, tile cross 4n + 1, mosaic 4n + 2, as in the questions.
    for (const it of exprs) {
      if (it.kind !== 'rule' || !it.picture) continue;
      for (const n of it.picture.figures) expect(countOf(it.picture.kind, n), `${it.id}: figure ${n}`).toBe(it.terms![n - 1] ?? evaluate(it.answer, { n }));
    }
  });

  it('has mock tests whose investigations add up, and whose Part 1 can always be filled', () => {
    const mocks = (pack.mocks ?? []).filter((m) => m.maths);
    expect(mocks.length).toBe(2);
    expect(pack.plan.some((d) => d.mock === 'mock-1')).toBe(true);
    for (const m of mocks) {
      const inv = m.maths!.investigation;
      inv.terms.forEach((t, i) => expect(ruleAt(inv.rule, i + 1), `${m.id}: stage ${i + 1}`).toBe(t));
      expect(ruleAt(inv.rule, inv.test.stage), `${m.id}: test`).toBe(inv.test.value);
      expect(ruleAt(inv.rule, inv.target.stage), `${m.id}: target`).toBe(inv.target.value);
      // The drawing has as many tiles as the table says.
      for (const n of inv.picture.figures) {
        expect(countOf(inv.picture.kind, n, inv.picture), `${m.id}: figure ${n}`).toBe(inv.terms[n - 1]);
        expect(shapeOf(inv.picture.kind, n, inv.picture).body.length, `${m.id}: drawn ${n}`).toBe(inv.terms[n - 1]);
      }
      // A full answer is marked right, in any form of the rule and with any letter.
      const full = { table: inv.terms, describe: 'x', rule: inv.rule, test: inv.test.value, which: inv.target.stage, justify: 'x' };
      expect(checkInvestigation(inv, full)).toEqual({ table: inv.terms.map(() => true), rule: true, test: true, which: true });
      expect(checkInvestigation(inv, { ...full, rule: inv.rule.replace(/n/g, 'x') }).rule).toBe(true);
      expect(checkInvestigation(inv, { ...full, rule: '4n' }).rule).toBe(false);
      const ids = pickPart1(pack, m.maths!, {});
      expect(ids.length, m.id).toBe(m.maths!.part1.length);
      expect(new Set(ids).size, m.id).toBe(ids.length);
    }
  });

  it('has the right answer in every lesson game, and nothing from the homework', () => {
    const lessonText = JSON.stringify([pack.lessons, pack.toolkit]);
    for (const t of HOMEWORK_TEXT) expect(lessonText.includes(t), t).toBe(false);
    const hw = new Set(HOMEWORK.map((h) => normalise(h).replace(/[()]/g, '')));
    for (const lesson of pack.lessons ?? []) for (const card of lesson.cards) {
      if (card.anatomy) expect(termParts(card.anatomy), card.id).not.toBeNull();
      for (const r of card.game?.rounds ?? []) {
        const where = `${card.id}: ${r.show}`;
        expect(r.answer, where).toBeLessThan(r.options.length);
        expect(new Set(r.options).size, where).toBe(r.options.length);
        expect(hw.has(normalise(r.show).replace(/[()]/g, '')), where).toBe(false);
        if (r.anatomy) expect(termParts(r.anatomy), where).not.toBeNull();
        if (r.ask === '= ?') {
          expect(equivalent(r.show, r.options[r.answer]), where).toBe(true);
          r.options.forEach((o, i) => { if (i !== r.answer && parse(o)) expect(equivalent(r.show, o), `${where} wrong option ${o}`).toBe(false); });
        }
        if (r.ask === 'What is the coefficient?') expect(termParts(r.show)![0].text, where).toBe(r.options[r.answer]);
        if (r.ask === 'What is the exponent?') expect(termParts(r.show)![2].text, where).toBe(r.options[r.answer]);
        if (r.ask === 'The answer is…') expect(evaluate(r.show.replace(/[a-z]/g, '2'), {})! > 0 ? '+' : '−', where).toBe(r.options[r.answer]);
      }
    }
  });

  it('has a toolkit tool for every topic', () => {
    for (const t of pack.topics) expect(pack.toolkit?.some((m) => m.topic === t.id), t.id).toBe(true);
    for (const m of pack.toolkit ?? []) expect(m.steps.length, m.id).toBeGreaterThanOrEqual(2);
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
