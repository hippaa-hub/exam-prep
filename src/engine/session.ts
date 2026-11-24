// Choosing the questions for a session, and running it.
import type { ConceptId, DateKey, Item, ItemId, Pack, TopicId } from '../content/types';
import { conceptOf, itemsOf, glossaryOf } from '../content/types';
import type { TodayPlan } from './plan';
import type { Outcome, ProgressMap } from './progress';
import { isDue, mistakeIds, weakest } from './progress';
import { shuffle, type Rng } from './rng';

export const TODAY_SIZE = 15;
/** On the last day the rounds after the first ask everything that is not full yet, up to this many. */
export const LAST_DAY_SIZE = 20;
/** On a mixed day the round also brings in this many glossary words she has never met, so they are met inside the app. */
export const GLOSSARY_IN_MIX = 10;
export const PRACTICE_SIZE = 12;
export const WARM_UP_SIZE = 8;
/** Each round keeps a few places for things met on earlier days (a mixed review every day). */
export const REVIEW_SHARE = 4;
/** Table rows are long questions; keep a round from turning into all tables. */
const MAX_TABLE_ROWS = 2;
/** Written answers take a minute or two each, so a round has only a couple of them. */
export const MAX_WRITTEN = 2;
/** A round made only of written answers is kept short. */
export const WRITTEN_ROUND_SIZE = 4;

interface Group {
  concept: ConceptId;
  items: Item[];
}

function groupsOf(pool: readonly Item[]): Group[] {
  const map = new Map<ConceptId, Group>();
  for (const it of pool) {
    const c = conceptOf(it);
    const g = map.get(c) ?? { concept: c, items: [] };
    g.items.push(it);
    map.set(c, g);
  }
  return [...map.values()];
}

/** Lowest level first; among equals, ones not yet seen today come first; the rest is random. */
function ranked(groups: Group[], progress: ProgressMap, today: DateKey, rng: Rng): Group[] {
  const key = (g: Group) => {
    const p = progress[g.concept];
    return (p?.level ?? 0) * 2 + (p?.lastSeen === today ? 1 : 0);
  };
  return shuffle(groups, rng)
    .map((g, i) => ({ g, i, k: key(g) }))
    .sort((a, b) => a.k - b.k || a.i - b.i)
    .map((x) => x.g);
}

/** One wording of a concept: a fresh one if there is one, otherwise the one asked longest ago. */
function variant(g: Group, progress: ProgressMap, rng: Rng, allowTable: boolean, allowWritten: boolean): Item {
  const allowed = g.items.filter((it) => (allowTable || it.type !== 'table') && (allowWritten || it.type !== 'short'));
  const pool = allowed.length > 0 ? allowed : g.items;
  const recent = progress[g.concept]?.recent ?? [];
  const fresh = pool.filter((it) => !recent.includes(it.id));
  if (fresh.length > 0) return fresh[Math.floor(rng() * fresh.length)];
  return [...pool].sort((a, b) => recent.indexOf(a.id) - recent.indexOf(b.id))[0];
}

function pickVariants(groups: Group[], progress: ProgressMap, rng: Rng): Item[] {
  let tables = 0;
  let writtenCount = 0;
  return groups.map((g) => {
    const it = variant(g, progress, rng, tables < MAX_TABLE_ROWS, writtenCount < MAX_WRITTEN);
    if (it.type === 'table') tables++;
    if (it.type === 'short') writtenCount++;
    return it;
  });
}

function todayGroups(pack: Pack, progress: ProgressMap, plan: TodayPlan) {
  if (plan.topics.length === 0) return { focus: groupsOf(itemsOf(pack)), review: [] as Group[] };
  const focusTopics = new Set<TopicId>(plan.topics);
  const focus = groupsOf(pack.topics.filter((t) => focusTopics.has(t.id)).flatMap((t) => t.items));
  // Review = things from other topics that she has already met.
  const review = groupsOf(pack.topics.filter((t) => !focusTopics.has(t.id)).flatMap((t) => t.items))
    .filter((g) => (progress[g.concept]?.seen ?? 0) > 0);
  return { focus, review };
}

/** How many things are still to practise today (today's topics, plus the review of earlier days). */
export function dueToday(pack: Pack, progress: ProgressMap, plan: TodayPlan, today: DateKey): number {
  if (plan.phase === 'exam-day') return 0;
  const { focus, review } = todayGroups(pack, progress, plan);
  return [...focus, ...review].filter((g) => isDue(progress[g.concept], today)).length;
}

/**
 * Today's round: one question for each thing still due from today's topics (weakest first),
 * with a short mixed review of things met on earlier days. Once nothing is due it becomes extra practice.
 */
export function buildTodaySession(
  pack: Pack, progress: ProgressMap, plan: TodayPlan, today: DateKey, rng: Rng = Math.random, size = TODAY_SIZE,
  /** False for the later rounds of the last day: the new glossary words come in the first round only. */
  withWords = true,
): ItemId[] {
  if (plan.phase === 'exam-day') return weakest(pack, progress, WARM_UP_SIZE);

  const { focus, review } = todayGroups(pack, progress, plan);
  const focusDue = ranked(focus.filter((g) => isDue(progress[g.concept], today)), progress, today, rng);
  const reviewDue = ranked(review.filter((g) => isDue(progress[g.concept], today)), progress, today, rng);

  let reviewN = Math.min(REVIEW_SHARE, reviewDue.length, size);
  const focusN = Math.min(size - reviewN, focusDue.length);
  reviewN = Math.min(size - focusN, reviewDue.length);
  let chosen = [...focusDue.slice(0, focusN), ...reviewDue.slice(0, reviewN)];
  if (chosen.length === 0) chosen = ranked([...focus, ...review], progress, today, rng).slice(0, size);

  const ids = pickVariants(chosen, progress, rng).map((it) => it.id);
  // A mixed round covers everything, so glossary words join it: only brand-new ones while any are left
  // (the ones she missed come back in Fix My Mistakes).
  const words = withWords && (plan.phase === 'last-day' || plan.phase === 'mix')
    ? buildGlossarySession(glossaryOf(pack), progress, today, rng, GLOSSARY_IN_MIX, pack.glossaryLast ?? [], 0)
    : [];
  return shuffle([...ids, ...words], rng);
}

/**
 * A practice round from one game or topic: the weakest things first.
 * Unlike today's round it may ask several wordings of the same thing, which is the point of a drill.
 */
export function buildPracticeSession(
  pool: readonly Item[], progress: ProgressMap, today: DateKey, rng: Rng = Math.random, size = PRACTICE_SIZE,
): ItemId[] {
  const key = (it: Item) => {
    const p = progress[conceptOf(it)];
    return (p?.level ?? 0) * 4 + (p?.correctDays.includes(today) ? 2 : 0) + (p?.recent.includes(it.id) ? 1 : 0);
  };
  const order = shuffle(pool, rng)
    .map((it, i) => ({ it, i, k: key(it) }))
    .sort((a, b) => a.k - b.k || a.i - b.i)
    .map((x) => x.it);
  // A drill of written answers only (the "Write it" game) is kept short; elsewhere they are rationed.
  const allWritten = pool.length > 0 && pool.every((it) => it.type === 'short');
  const limit = allWritten ? Math.min(size, WRITTEN_ROUND_SIZE) : size;
  const out: Item[] = [];
  let tables = 0;
  let writtenCount = 0;
  for (const it of order) {
    if (out.length >= limit) break;
    if (it.type === 'table' && tables++ >= MAX_TABLE_ROWS) continue;
    if (it.type === 'short' && !allWritten && writtenCount++ >= MAX_WRITTEN) continue;
    out.push(it);
  }
  return shuffle(out, rng).map((it) => it.id);
}

/** A glossary round keeps this many places for words she has met before, so they come back on later days. */
export const GLOSSARY_REVIEW = 6;

/**
 * A round of glossary words (Part 2): about half are words she has met before and has not yet had right
 * today (the ones she knows least first, and ones from earlier days before ones from today), the rest are new.
 * Meeting a word once is not enough to remember it, so the review half matters more than covering every word.
 * New words in `last` (ones the slides never use) are only asked once every other word has been met.
 * `reviewPlaces` is how many places are kept for words met before; with 0 the round is all new words
 * for as long as there are any.
 */
export function buildGlossarySession(
  pool: readonly Item[], progress: ProgressMap, today: DateKey, rng: Rng = Math.random, size = PRACTICE_SIZE,
  last: readonly ItemId[] = [], reviewPlaces = GLOSSARY_REVIEW,
): ItemId[] {
  const of = (it: Item) => progress[conceptOf(it)];
  const byWeakest = (list: Item[]) => shuffle(list, rng)
    .map((it, i) => ({ it, i, k: (of(it)?.level ?? 0) * 2 + (of(it)?.lastSeen === today ? 1 : 0) }))
    .sort((a, b) => a.k - b.k || a.i - b.i)
    .map((x) => x.it);

  const unmet = shuffle(pool.filter((it) => (of(it)?.seen ?? 0) === 0), rng);
  const fresh = [...unmet.filter((it) => !last.includes(it.id)), ...unmet.filter((it) => last.includes(it.id))];
  const met = pool.filter((it) => (of(it)?.seen ?? 0) > 0);
  const review = byWeakest(met.filter((it) => isDue(of(it), today)));
  const rightToday = byWeakest(met.filter((it) => !isDue(of(it), today)));

  let reviewN = Math.min(reviewPlaces, review.length, size);
  const freshN = Math.min(size - reviewN, fresh.length);
  reviewN = Math.min(size - freshN, review.length);
  const chosen = [...review.slice(0, reviewN), ...fresh.slice(0, freshN)];
  // Nothing new and nothing due is left: go round again with the ones she knows least.
  chosen.push(...rightToday.slice(0, size - chosen.length));
  return shuffle(chosen, rng).map((it) => it.id);
}

/** Fix My Mistakes: only the questions she got wrong. */
export function buildFixSession(pack: Pack, progress: ProgressMap, rng: Rng = Math.random, size = 15): ItemId[] {
  return shuffle(mistakeIds(pack, progress), rng).slice(0, size);
}

// ---- Running a session -------------------------------------------------------

/** A question comes back later in the same session after a miss, this many places further on. */
export const REASK_GAP = 3;
/** ...but no question is asked more than this many times in one session. */
export const MAX_ASKS = 3;

export interface Run {
  queue: ItemId[];
  index: number;
  asks: Record<ItemId, number>;
  /** The outcome of the first time each question was asked. */
  first: Record<ItemId, Outcome>;
  /** A question asked in place of a missed one (same idea, different numbers) → the one it stands for. */
  stand?: Record<ItemId, ItemId>;
}

/** The question a queued one stands for: itself, or the missed question it replaces. */
export function originOf(run: Run, id: ItemId): ItemId {
  return run.stand?.[id] ?? id;
}

export function startRun(ids: readonly ItemId[]): Run {
  return { queue: [...ids], index: 0, asks: {}, first: {} };
}

export function currentId(run: Run): ItemId | undefined {
  return run.queue[run.index];
}

export function isFinished(run: Run): boolean {
  return run.index >= run.queue.length;
}

/**
 * Record an answer and move on. A miss is asked again a little later in the same session.
 * `askAgain` forces a repeat even after a right answer (Fix My Mistakes needs two).
 */
export function answerRun(
  run: Run, outcome: Outcome, askAgain = outcome !== 'right',
  /** Ask this question instead when it comes back (the same idea with different numbers). */
  replacement?: ItemId,
): Run {
  const id = currentId(run);
  if (id === undefined) return run;
  const key = originOf(run, id);
  const asks = { ...run.asks, [key]: (run.asks[key] ?? 0) + 1 };
  const first = run.first[key] === undefined ? { ...run.first, [key]: outcome } : run.first;
  const queue = [...run.queue];
  const alreadyQueued = queue.slice(run.index + 1).some((q) => originOf(run, q) === key);
  let stand = run.stand;
  if (askAgain && asks[key] < MAX_ASKS && !alreadyQueued) {
    const back = replacement ?? id;
    queue.splice(Math.min(queue.length, run.index + 1 + REASK_GAP), 0, back);
    if (back !== key) stand = { ...stand, [back]: key };
  }
  return { queue, index: run.index + 1, asks, first, ...(stand ? { stand } : {}) };
}

export interface RunSummary {
  asked: number;
  firstTimeRight: number;
  /** The questions she missed the first time, in the order they came up. */
  missed: ItemId[];
}

export function summarise(run: Run): RunSummary {
  const ids = Object.keys(run.first);
  const missed = ids.filter((id) => run.first[id] !== 'right');
  return { asked: ids.length, firstTimeRight: ids.length - missed.length, missed };
}

/** Progress through the session as a fraction, for the bar at the top. */
export function runFraction(run: Run): number {
  return run.queue.length === 0 ? 1 : Math.min(1, run.index / run.queue.length);
}

/**
 * The round of questions added late (after a slide-by-slide check): the first task of a mixed day.
 * A wording she has already met is left out, so the round shrinks as she goes.
 */
export function buildLateSession(pack: Pack, progress: ProgressMap, rng: Rng = Math.random): ItemId[] {
  const byId = new Map(itemsOf(pack).map((it) => [it.id, it]));
  const late = (pack.lateAdditions ?? [])
    .map((id) => byId.get(id))
    .filter((it): it is Item => !!it && !(progress[conceptOf(it)]?.recent ?? []).includes(it.id));
  return shuffle(late, rng).map((it) => it.id);
}
