// Her longer written work: Argument Builder answers and mock exams.
// None of it is marked automatically; she ticks her own checklist.
import type { ArgumentItem, DateKey, Item, ItemId, MockExam, Pack, ShortItem } from '../content/types';
import { ARGUMENT_CHECKLIST } from '../content/types';
import { ideasNeeded, outcomeOfTicks } from './check';
import type { Outcome } from './progress';

/** One finished Argument Builder answer (the latest one for each question is kept). */
export interface WrittenArgument {
  date: DateKey;
  boxes: string[];
  /** Her ticks against the six-point checklist. */
  ticks: boolean[];
}

export interface MockAnswerA {
  id: ItemId;
  text: string;
  /** Her ticks against the question's key ideas. */
  ticks: boolean[];
}

export interface MockAnswerB {
  id: string;
  boxes: string[];
  ticks: boolean[];
}

export interface MockResult {
  date: DateKey;
  /** Time spent writing, in seconds. */
  seconds: number;
  partA: MockAnswerA[];
  partB: MockAnswerB[];
}

/** The next question for the Argument Builder: one she has not written yet, else the one written longest ago. */
export function nextArgument(pack: Pack, writing: Record<string, WrittenArgument> | undefined): ArgumentItem | undefined {
  const all = pack.arguments ?? [];
  const fresh = all.find((a) => !writing?.[a.id]);
  if (fresh) return fresh;
  return [...all].sort((a, b) => (writing![a.id].date).localeCompare(writing![b.id].date))[0];
}

export interface MockScore {
  /** Part A: questions with enough key ideas, out of all Part A questions. */
  partARight: number;
  partATotal: number;
  /** Part B: checklist ticks, out of all possible ticks. */
  partBTicks: number;
  partBTotal: number;
}

function shortItem(items: Map<ItemId, Item>, id: ItemId): ShortItem | undefined {
  const it = items.get(id);
  return it?.type === 'short' ? it : undefined;
}

export function outcomeOfMockAnswer(items: Map<ItemId, Item>, a: MockAnswerA): Outcome {
  const it = shortItem(items, a.id);
  return it ? outcomeOfTicks(it, a.ticks) : 'wrong';
}

export function mockScore(result: MockResult, items: Map<ItemId, Item>): MockScore {
  return {
    partARight: result.partA.filter((a) => outcomeOfMockAnswer(items, a) === 'right').length,
    partATotal: result.partA.length,
    partBTicks: result.partB.reduce((n, b) => n + b.ticks.filter(Boolean).length, 0),
    partBTotal: result.partB.length * ARGUMENT_CHECKLIST.length,
  };
}

export interface FixNote {
  /** The question, shortened. */
  question: string;
  /** What was missing from her answer. */
  missing: string[];
}

/** "What to fix": for each answer that fell short, the ideas or checklist points she did not tick. */
export function whatToFix(result: MockResult, mock: MockExam, pack: Pack, items: Map<ItemId, Item>): FixNote[] {
  const notes: FixNote[] = [];
  for (const a of result.partA) {
    const it = shortItem(items, a.id);
    if (!it || outcomeOfTicks(it, a.ticks) === 'right') continue;
    const missing = it.ideas.filter((_, i) => !a.ticks[i]).map((idea) => idea.label);
    const still = ideasNeeded(it) - a.ticks.filter(Boolean).length;
    notes.push({ question: it.prompt, missing: it.need ? [`${still} more of: ${missing.join('; ')}`] : missing });
  }
  for (const b of result.partB) {
    const q = pack.arguments?.find((x) => x.id === b.id);
    const missing = ARGUMENT_CHECKLIST.filter((_, i) => !b.ticks[i]);
    if (q && missing.length > 0) notes.push({ question: q.prompt, missing });
  }
  void mock;
  return notes;
}
