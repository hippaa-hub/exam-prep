// Memory for each "thing to know" (PLAN.md section 5).
// Level 0 = new or wrong, 1 = right once, 2 = right on two different days, 3 = right on three different days.
//
// Levels are kept per concept, not per question: a concept (one key term, one country, one confusing pair)
// has several question wordings, and Adele meets a different wording each time.
import type { ConceptId, DateKey, Item, ItemId, Pack, Topic } from '../content/types';
import { conceptOf, conceptsOf, itemsOf } from '../content/types';

export type Level = 0 | 1 | 2 | 3;

/** 'almost' is only used by flashcards, where Adele rates herself. */
export type Outcome = 'right' | 'almost' | 'wrong';

export interface ConceptProgress {
  level: Level;
  /** The different days on which she got it right (at most three are kept). */
  correctDays: DateKey[];
  /** How many times she has answered a question about it. */
  seen: number;
  lastSeen?: DateKey;
  /** The wordings asked most recently (newest last), so the next one can be different. */
  recent: ItemId[];
  /** Present while it is on the Fix My Mistakes list: right answers since the mistake. */
  fix?: number;
  /** The exact question she missed, which Fix My Mistakes asks again. */
  fixItem?: ItemId;
}

export type ProgressMap = Record<ConceptId, ConceptProgress>;

/** A mistake leaves the Fix My Mistakes list once it has been right this many times. */
export const FIX_TARGET = 1;
/** A topic is "ready" at this readiness percentage. */
export const READY_AT = 80;
const RECENT_KEPT = 8;

export function newProgress(): ConceptProgress {
  return { level: 0, correctDays: [], seen: 0, recent: [] };
}

/**
 * `credit: false` is for a question repeated in the same session straight after a miss: she has just seen
 * the answer, so getting it right is good practice but is not evidence that she knows it. It earns no level
 * and does not count towards clearing the mistake. (A miss on a repeat still counts as a miss.)
 */
export function applyAnswer(
  prev: ConceptProgress | undefined, outcome: Outcome, today: DateKey, itemId?: ItemId, credit = true,
): ConceptProgress {
  const p = prev ?? newProgress();
  const next: ConceptProgress = { ...p, correctDays: [...p.correctDays], seen: p.seen + 1, lastSeen: today };
  next.recent = p.recent ?? [];
  if (itemId !== undefined) next.recent = [...next.recent.filter((id) => id !== itemId), itemId].slice(-RECENT_KEPT);

  if (outcome === 'right' && !credit) return next;

  if (outcome === 'right') {
    if (!next.correctDays.includes(today)) next.correctDays.push(today);
    next.correctDays = next.correctDays.slice(-3);
    next.level = next.correctDays.length as Level;
    if (next.fix !== undefined) {
      next.fix += 1;
      if (next.fix >= FIX_TARGET) {
        delete next.fix;
        delete next.fixItem;
      }
    }
  } else if (outcome === 'almost') {
    // Nearly there: one step back, and it stays off the mistakes list.
    const earlier = p.correctDays.filter((d) => d !== today);
    const keep = Math.min(Math.max(0, p.level - 1), earlier.length);
    next.correctDays = earlier.slice(earlier.length - keep);
    next.level = keep as Level;
  } else {
    // Wrong: back to level 0, and onto the Fix My Mistakes list. Never a penalty beyond that.
    next.correctDays = [];
    next.level = 0;
    next.fix = 0;
    if (itemId !== undefined) next.fixItem = itemId;
  }
  return next;
}

export function progressOf(progress: ProgressMap, item: Item): ConceptProgress | undefined {
  return progress[conceptOf(item)];
}

/** Still to do today: not yet at the top level, and not yet right today. */
export function isDue(p: ConceptProgress | undefined, today: DateKey): boolean {
  return (p?.level ?? 0) < 3 && !(p?.correctDays.includes(today) ?? false);
}

/** Readiness = the average level of the things to know, as a percentage of the top level. */
export function readiness(items: readonly Item[], progress: ProgressMap): number {
  const concepts = conceptsOf(items);
  if (concepts.length === 0) return 0;
  const sum = concepts.reduce((s, c) => s + (progress[c]?.level ?? 0), 0);
  return Math.round((sum / (concepts.length * 3)) * 100);
}

export function packReadiness(pack: Pack, progress: ProgressMap): number {
  return readiness(itemsOf(pack), progress);
}

/** How many things to know can still gain a level today: not yet at the top, not yet right today. */
export function dueCount(items: readonly Item[], progress: ProgressMap, today: DateKey): number {
  return conceptsOf(items).filter((c) => isDue(progress[c], today)).length;
}

/**
 * The highest readiness reachable today: what she has now, plus one level for every thing to know
 * that is still due. A level is "right on a different day", so today cannot add more than this.
 */
export function ceilingToday(items: readonly Item[], progress: ProgressMap, today: DateKey): number {
  const concepts = conceptsOf(items);
  if (concepts.length === 0) return 0;
  const sum = concepts.reduce((s, c) => s + Math.min(3, (progress[c]?.level ?? 0) + (isDue(progress[c], today) ? 1 : 0)), 0);
  return Math.round((sum / (concepts.length * 3)) * 100);
}


export function packCeilingToday(pack: Pack, progress: ProgressMap, today: DateKey): number {
  return ceilingToday(itemsOf(pack), progress, today);
}

export function topicReadiness(topic: Topic, progress: ProgressMap): number {
  return readiness(topic.items, progress);
}

export function isTopicReady(topic: Topic, progress: ProgressMap): boolean {
  return topicReadiness(topic, progress) >= READY_AT;
}

/** How many of the things to know she has tried at least once. */
export function seenCount(items: readonly Item[], progress: ProgressMap): number {
  return conceptsOf(items).filter((c) => (progress[c]?.seen ?? 0) > 0).length;
}

/** The questions on the Fix My Mistakes list (the exact ones she missed), in pack order. */
export function mistakeIds(pack: Pack, progress: ProgressMap): ItemId[] {
  const all = itemsOf(pack);
  const out: ItemId[] = [];
  for (const c of conceptsOf(all)) {
    const p = progress[c];
    if (p?.fix === undefined) continue;
    const missed = all.find((it) => it.id === p.fixItem && conceptOf(it) === c) ?? all.find((it) => conceptOf(it) === c);
    if (missed) out.push(missed.id);
  }
  return out;
}

/** Her weakest things to know, for the exam-morning warm-up: open mistakes first, then the lowest levels she has met. */
export function weakest(pack: Pack, progress: ProgressMap, n: number): ItemId[] {
  const all = itemsOf(pack);
  const rank = (c: ConceptId) => {
    const p = progress[c];
    return (p?.level ?? 0) * 4 + (p?.fix !== undefined ? 0 : 1) + ((p?.seen ?? 0) > 0 ? 0 : 2);
  };
  return conceptsOf(all)
    .map((c, i) => ({ c, i, r: rank(c) }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .slice(0, n)
    .map(({ c }) => {
      const p = progress[c];
      const variants = all.filter((it) => conceptOf(it) === c);
      // The warm-up is quick taps only: no tables and no written answers.
      const quick = variants.filter((it) => it.type !== 'table' && it.type !== 'short');
      const pick = quick.find((it) => it.id === p?.fixItem)
        ?? quick.find((it) => !(p?.recent ?? []).includes(it.id))
        ?? quick[0]
        ?? variants[0];
      return pick.id;
    });
}
