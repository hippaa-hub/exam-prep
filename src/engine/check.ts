// Checking a written answer for its key ideas (PLAN.md section 5).
// The app only suggests: it pre-ticks the ideas it can find, and Adele's own ticks decide.
// Spelling slips in key terms are accepted, and the correct spelling is shown.
import type { Idea, ShortItem } from '../content/types';
import type { Outcome } from './progress';

export interface SpellingNote {
  typed: string;
  correct: string;
}

export interface CheckResult {
  /** For each idea, whether its signal words were found. */
  found: boolean[];
  /** Words she nearly spelled right. */
  spelling: SpellingNote[];
}

/** An answer needs at least this many words before the teacher's wording is shown. */
export const MIN_WORDS = 3;

export function wordsOf(text: string): string[] {
  return text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s'-]/g, ' ').replace(/['-]/g, '').split(/\s+/).filter(Boolean);
}

export function hasEnoughWords(text: string): boolean {
  return wordsOf(text).length >= MIN_WORDS;
}

function distance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

type Match = 'exact' | 'slip' | null;

/** Does a word she typed stand for the word we are looking for? */
function matchWord(typed: string, target: string): Match {
  if (typed === target) return 'exact';
  // Word endings: institution / institutions, elect / elected, govern / governs.
  if (target.length >= 4 && typed.length >= 4 && (typed.startsWith(target) || target.startsWith(typed)) && Math.abs(typed.length - target.length) <= 3) {
    return 'exact';
  }
  // Spelling slips: one wrong letter in a word of five or more, two in a word of nine or more.
  const allowed = target.length >= 9 ? 2 : target.length >= 5 ? 1 : 0;
  if (allowed > 0 && distance(typed, target) <= allowed) return 'slip';
  return null;
}

/** A signal may be a phrase ("free elections"): every word of it must be somewhere in the answer. */
function findSignal(tokens: string[], signal: string): { ok: boolean; slips: SpellingNote[] } {
  const slips: SpellingNote[] = [];
  for (const target of wordsOf(signal)) {
    let best: Match = null;
    let typed = '';
    for (const t of tokens) {
      const m = matchWord(t, target);
      if (m === 'exact') { best = 'exact'; break; }
      if (m === 'slip' && best === null) { best = 'slip'; typed = t; }
    }
    if (best === null) return { ok: false, slips: [] };
    if (best === 'slip') slips.push({ typed, correct: target });
  }
  return { ok: true, slips };
}

export function checkIdeas(text: string, ideas: readonly Idea[]): CheckResult {
  const tokens = wordsOf(text);
  const spelling: SpellingNote[] = [];
  const found = ideas.map((it) => {
    let slips: SpellingNote[] | null = null;
    for (const signal of it.words) {
      const r = findSignal(tokens, signal);
      if (!r.ok) continue;
      if (r.slips.length === 0) return true; // found with no slips: nothing to note
      slips ??= r.slips;
    }
    if (slips === null) return false;
    for (const note of slips) if (!spelling.some((s) => s.typed === note.typed)) spelling.push(note);
    return true;
  });
  return { found, spelling };
}

/** How many ideas a full answer needs. */
export function ideasNeeded(item: Pick<ShortItem, 'ideas' | 'need'>): number {
  return item.need ?? item.ideas.length;
}

/** Her ticks decide: enough ideas is right, at least half of what is needed is "almost", less is not yet. */
export function outcomeOfTicks(item: Pick<ShortItem, 'ideas' | 'need'>, ticks: readonly boolean[]): Outcome {
  const have = ticks.filter(Boolean).length;
  const need = ideasNeeded(item);
  if (have >= need) return 'right';
  if (have > 0 && have * 2 >= need) return 'almost';
  return 'wrong';
}

/** The three verdicts, as the app writes and says them. */
export const VERDICT_WORDS: Record<Outcome, string> = { right: 'Correct!', almost: 'Almost!', wrong: 'Not yet' };

export interface Closeness {
  /** How many key ideas she had (never more than were needed). */
  have: number;
  need: number;
  /** 0 to 100: how close the answer was. */
  percent: number;
}

/** How close an answer was: the key ideas she had, out of the ones a full answer needs. */
export function closeness(item: Pick<ShortItem, 'ideas' | 'need'>, ticks: readonly boolean[]): Closeness {
  const need = ideasNeeded(item);
  const have = Math.min(ticks.filter(Boolean).length, need);
  return { have, need, percent: need === 0 ? 0 : Math.round((have / need) * 100) };
}

/** The verdict in a sentence, for reading aloud: "Almost! You had 1 of the 2 key ideas." */
export function verdictSentence(item: Pick<ShortItem, 'ideas' | 'need'>, ticks: readonly boolean[]): string {
  const outcome = outcomeOfTicks(item, ticks);
  const c = closeness(item, ticks);
  if (outcome === 'right') return `${VERDICT_WORDS.right} You had the key ideas.`;
  return `${VERDICT_WORDS[outcome]}. You had ${c.have} of the ${c.need} key ideas.`.replace('!.', '!');
}
