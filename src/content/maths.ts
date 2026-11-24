// Helpers for maths packs: algebra questions with their "Show me how" steps written by the app,
// following the teacher's 3-step method (signs, then numbers, then letters).
import { factorsOf, normalise, parse, polyText, pretty, samePoly, type Mono } from '../engine/algebra';
import { fmtNum, type ExpressionItem, type NumericItem, type Picture, type SequenceItem, type Slip } from './types';

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

// ---- Brackets: adding and subtracting expressions ----------------------------

/** Splits "5x−3y+7" into signed terms: ["+5x", "−3y", "+7"]. */
function signedTerms(inner: string): string[] {
  return inner.split(/(?=[+-])/).filter(Boolean).map((t) => (/^[+-]/.test(t) ? t : `+${t}`));
}

const flip = (t: string) => (t[0] === '-' ? `+${t.slice(1)}` : `-${t.slice(1)}`);

/**
 * Removes the brackets of a sum like "(8a − 3b + 5) − (2a + 4b − 6)": a + keeps every sign inside,
 * a − changes every sign inside. With `slip`, a − changes only the FIRST term (the usual mistake).
 * Returns the signed terms in order.
 */
export function openBrackets(expr: string, slip = false): string[] {
  const s = normalise(expr);
  const out: string[] = [];
  let i = 0;
  let sign = '+';
  while (i < s.length) {
    const c = s[i];
    if (c === '+' || c === '-') { sign = c; i++; continue; }
    if (c === '(') {
      let depth = 1;
      let j = i + 1;
      while (depth > 0) { if (s[j] === '(') depth++; if (s[j] === ')') depth--; j++; }
      const terms = signedTerms(s.slice(i + 1, j - 1));
      out.push(...terms.map((t, k) => (sign === '-' && (!slip || k === 0) ? flip(t) : t)));
      i = j;
      sign = '+';
      continue;
    }
    const m = s.slice(i).match(/^[^+\-()]+/)!;
    out.push(`${sign}${m[0]}`);
    i += m[0].length;
    sign = '+';
  }
  return out;
}

const termsText = (terms: string[]) => pretty(terms.join('').replace(/^\+/, ''));

/** "(5x + 2x) + (4y − y)": the like terms side by side, in brackets. */
export function groupText(terms: string[]): string {
  const keyOf = (t: string) => [...(parse(t)?.keys() ?? [''])][0];
  const groups = new Map<string, string[]>();
  for (const t of terms) groups.set(keyOf(t), [...(groups.get(keyOf(t)) ?? []), t]);
  return [...groups.values()].map((g, i) => {
    const text = termsText(g);
    const body = g.length > 1 ? `(${text})` : text;
    return i === 0 ? body : g.length > 1 || g[0][0] === '+' ? ` + ${g.length > 1 ? body : text}` : ` ${pretty(g[0]).replace(/^−/, '− ')}`;
  }).join('');
}

/** The steps for adding or subtracting expressions in brackets. */
export function bracketSteps(expr: string): string[] {
  const minus = /\)\s*[-−]\s*\(/.test(expr) || /^[-−]\s*\(/.test(expr.trim());
  const opened = openBrackets(expr);
  return [
    minus
      ? 'A minus sign before a bracket changes the sign of EVERY term inside. A plus sign changes nothing.'
      : 'A plus sign before a bracket changes nothing: just remove the brackets.',
    `Remove the brackets: ${termsText(opened)}.`,
    `Group the like terms: ${groupText(opened)}.`,
    `Collect them: ${polyText(parse(expr)!)}.`,
  ];
}

/** Adding or subtracting expressions in brackets, with the steps and the usual sign slip worked out by the app. */
export function brk(id: string, concept: string, expr: string, answer: string, prompt = 'Simplify. Remove the brackets first, then collect like terms.'): ExpressionItem {
  const slipped = openBrackets(expr, true).join('');
  const slip = !samePoly(parse(slipped)!, parse(expr)!)
    ? [{ answer: slipped, say: 'You changed the sign of only the first term. A minus before a bracket changes EVERY sign inside.' }]
    : undefined;
  return { id, concept, type: 'expression', kind: 'brackets', prompt, expr, answer, how: bracketSteps(expr), ...(slip ? { slips: slip } : {}) };
}

// ---- Rules (nth term) -------------------------------------------------------------

/** The teacher's way to build an arithmetic rule: (difference) × n, then fix the start. */
export function ruleHow(terms: number[], v = 'n'): string[] {
  const d = terms[1] - terms[0];
  const c = terms[0] - d;
  const rule = `${d}${v}${c === 0 ? '' : c > 0 ? ` + ${c}` : ` − ${-c}`}`;
  return [
    `Find the common difference: ${terms.slice(1).map((t, i) => `${fmtNum(t)} − ${fmtNum(terms[i])}`).slice(0, 2).join(', ')}… = ${fmtNum(d)} each time.`,
    `So the rule starts ${d}${v}: the number in front of ${v} is the common difference.`,
    `Check ${v} = 1: ${d} × 1 = ${d}, but the first term is ${terms[0]}, so ${c >= 0 ? `add ${c}` : `subtract ${-c}`}.`,
    `Rule: ${rule}. Test it: ${v} = 2 gives ${d * 2 + c} ✓.`,
  ];
}

/** An nth-term rule: any equal form is accepted, and a wrong rule is tested on the terms. */
export function rule(id: string, concept: string, terms: number[], answer: string, prompt: string, picture?: Picture, v = 'n'): ExpressionItem {
  return {
    id, concept, type: 'expression', kind: 'rule', prompt, expr: answer, show: `${terms.map((t) => fmtNum(t)).join(', ')}, …`,
    answer, simplest: false, terms, letters: [v], how: ruleHow(terms, v), ...(picture ? { picture } : {}),
  };
}

// ---- Sequences -------------------------------------------------------------------

/** What kind of sequence the terms are, and the next two terms. Used by the tests to check every sequence. */
export function analyse(terms: number[]): { kind: 'arithmetic' | 'geometric' | 'neither'; next: [number, number] } {
  const d = terms.slice(1).map((t, i) => t - terms[i]);
  if (d.every((x) => x === d[0])) return { kind: 'arithmetic', next: [terms.at(-1)! + d[0], terms.at(-1)! + 2 * d[0]] };
  const r = terms.slice(1).map((t, i) => t / terms[i]);
  if (r.every((x) => Math.abs(x - r[0]) < 1e-12)) return { kind: 'geometric', next: [terms.at(-1)! * r[0], terms.at(-1)! * r[0] * r[0]] };
  // Neither: the increase changes by the same amount each time (+2, +3, +4…).
  const dd = d.slice(1).map((x, i) => x - d[i]);
  const step = dd[0];
  const nextD = d.at(-1)! + step;
  return { kind: 'neither', next: [terms.at(-1)! + nextD, terms.at(-1)! + nextD + nextD + step] };
}

/** A Sequence Detective question. `rule` is the right evidence; `others` are wrong ones to choose from. */
export function seq(id: string, concept: string, terms: number[], next: [number, number], kind: SequenceItem['kind'], rule: string, others: string[], explain: string): SequenceItem {
  const diffs = terms.slice(1).map((t, i) => t - terms[i]);
  const how = kind === 'geometric'
    ? ['Divide each term by the one before it.', `${terms[1]} ÷ ${terms[0]}, ${terms[2]} ÷ ${terms[1]}… is it the same every time?`, 'The same number each time: geometric.', `Next: ${next.map(fmtNum).join(', ')}.`]
    : ['Subtract each term from the next one.', `The differences: ${diffs.map((d) => (d < 0 ? `−${-d}` : `+${d}`)).join(', ')}.`,
      kind === 'arithmetic' ? 'The same difference every time: arithmetic.' : 'The difference changes, and it is not a fixed ratio either: neither.',
      `Next: ${next.map(fmtNum).join(', ')}.`];
  return {
    id, concept, type: 'sequence', prompt: 'Find the next two terms. What kind of sequence is it, and how do you know?',
    terms, next, kind, rule, evidence: [rule, ...others], explain, how,
  };
}

/** A question with number answers. Each field can carry the calculation that gives it, which the tests redo. */
export function nums(id: string, concept: string, prompt: string, fields: NumericItem['fields'], how: string[], extra: Partial<NumericItem> = {}): NumericItem {
  return { id, concept, type: 'numeric', prompt, fields, how, ...extra };
}
