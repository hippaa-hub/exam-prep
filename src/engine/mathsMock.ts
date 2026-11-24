// The maths mock test (45 minutes, Criteria B and C). Part 1: short questions, one from each of the teacher's
// topics, in a version she has not met recently. Part 2: an investigation of a growing pattern.
// Part 1 and the number parts of Part 2 are checked by the app; she marks the rest herself with the checklists.
import type { DateKey, Item, ItemId, MathsMock, Investigation, Pack } from '../content/types';
import { conceptOf, fmtNum, itemsOf } from '../content/types';
import { equivalent, evaluate, normalise, pretty } from './algebra';
import { answerText } from '../content/types';
import type { Outcome, ProgressMap } from './progress';

/** Part 1 asks only questions with a typed answer: no tapping between options. */
const PART1_TYPES = new Set<Item['type']>(['expression', 'numeric', 'sequence']);

/** One question per thing to know: a typed one she has met least recently (never met first). */
export function pickPart1(pack: Pack, mock: MathsMock, progress: ProgressMap): ItemId[] {
  const all = itemsOf(pack);
  return mock.part1.flatMap((c) => {
    const options = all.filter((it) => conceptOf(it) === c && PART1_TYPES.has(it.type));
    if (options.length === 0) return [];
    const recent = progress[c]?.recent ?? [];
    const unseen = options.find((it) => !recent.includes(it.id));
    return [(unseen ?? [...options].sort((a, b) => recent.indexOf(a.id) - recent.indexOf(b.id))[0]).id];
  });
}

/** Her answers to Part 2. Numbers are null while blank. */
export interface InvestigationAnswers {
  table: (number | null)[];
  describe: string;
  rule: string;
  test: number | null;
  which: number | null;
  justify: string;
}

export function emptyInvestigation(inv: Investigation): InvestigationAnswers {
  return { table: inv.terms.map(() => null), describe: '', rule: '', test: null, which: null, justify: '' };
}

/** What the app can check in Part 2 by itself. */
export function checkInvestigation(inv: Investigation, a: InvestigationAnswers) {
  const v = (normalise(inv.rule).match(/[a-z]/) ?? ['n'])[0];
  // Her rule counts if it is equal to the teacher's rule, written in any form, in n (or x).
  const theirs = normalise(a.rule).match(/[a-z]/)?.[0];
  const rule = !!a.rule.trim() && (equivalent(a.rule, inv.rule) || (!!theirs && equivalent(a.rule.replace(new RegExp(theirs, 'g'), v), inv.rule)));
  return {
    table: inv.terms.map((t, i) => a.table[i] === t),
    rule,
    test: a.test === inv.test.value,
    which: a.which === inv.target.stage,
  };
}

/** Criterion B, simplified from the teacher's task: each level needs the one before it. */
export const B_LEVELS: { band: string; label: string }[] = [
  { band: '1–2', label: 'I found a pattern: I said what changes' },
  { band: '3–4', label: 'I described the pattern and continued it in a table' },
  { band: '5–6', label: 'I found a general rule and used it' },
  { band: '7–8', label: 'I tested (verified) the rule on a new stage and justified why it works' },
];

/** Criterion C, simplified: the more of these, the higher the band. */
export const C_CHECKS: string[] = [
  'I wrote every step, in order (on paper too)',
  'Correct notation: x², − signs, brackets around negative numbers',
  'I used a table to organise the values',
  'I wrote the rule and said what n stands for',
  'I explained in full sentences and justified my conclusion',
];

/** The B band her ticks give: the highest level whose levels below are all ticked too. */
export function bBand(ticks: boolean[]): string {
  let n = 0;
  while (n < B_LEVELS.length && ticks[n]) n++;
  return n === 0 ? '0' : B_LEVELS[n - 1].band;
}

/** The C band her ticks give. */
export function cBand(ticks: boolean[]): string {
  const n = ticks.filter(Boolean).length;
  return ['0', '1–2', '3–4', '5–6', '5–6', '7–8'][n];
}

/** The top of a band, for comparing ("7–8" → 8). */
export const bandTop = (band: string) => Number(band.split('–').pop());

export interface MathsMockResult {
  date: DateKey;
  seconds: number;
  part1: { id: ItemId; outcome: Outcome; steps: boolean }[];
  inv: InvestigationAnswers;
  /** Her ticks for the written parts (b and f), against each part's ideas. */
  describeTicks: boolean[];
  justifyTicks: boolean[];
  bTicks: boolean[];
  cTicks: boolean[];
  b: string;
  c: string;
}

/** What to fix, in plain words, from a marked mock test. */
export function mathsWhatToFix(mock: MathsMock, r: MathsMockResult, items: Map<ItemId, Item>): string[] {
  const inv = mock.investigation;
  const auto = checkInvestigation(inv, r.inv);
  const out: string[] = [];
  for (const p of r.part1) {
    const it = items.get(p.id);
    if (!it || p.outcome === 'right') continue;
    const q = it.type === 'expression' ? `${it.prompt} ${pretty(it.show ?? it.expr)}` : it.type === 'sequence' ? `${it.terms.map(fmtNum).join(', ')}, …` : it.prompt;
    out.push(`${q} → ${answerText(it).replace(/\n/g, '; ')}. It is in Fix My Mistakes now.`);
  }
  if (auto.table.some((ok) => !ok)) out.push(`The table: the values are ${inv.terms.map(fmtNum).join(', ')}. Count each stage carefully, then check the difference stays the same.`);
  if (!auto.rule) out.push(`The general rule is ${pretty(inv.rule)}. The number in front of n is the common difference; then fix the start so stage 1 is right.`);
  if (!auto.test) out.push(`Testing the rule: stage ${inv.test.stage} has ${inv.test.value}. Put the stage number into the rule, with brackets.`);
  if (!auto.which) out.push(`Which stage has ${inv.target.value}? Stage ${inv.target.stage}: set the rule equal to ${inv.target.value}, take away, then divide.`);
  inv.describe.ideas.forEach((idea, i) => { if (!r.describeTicks[i]) out.push(`Describing the pattern: ${idea.label.toLowerCase()}.`); });
  inv.justify.ideas.forEach((idea, i) => { if (!r.justifyTicks[i]) out.push(`Justifying the rule: ${idea.label.toLowerCase()}.`); });
  C_CHECKS.forEach((c, i) => { if (!r.cTicks[i]) out.push(`Criterion C: ${c.replace(/^I /, '').toLowerCase()}.`); });
  return out;
}

/** The value of a rule at a stage (for the tests). */
export function ruleAt(rule: string, stage: number): number | null {
  const v = (normalise(rule).match(/[a-z]/) ?? ['n'])[0];
  return evaluate(rule, { [v]: stage });
}
