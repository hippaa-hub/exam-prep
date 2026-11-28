// The daily journey (Jenia, 28 Nov): for a pack with `journey`, every day is one short path instead of a list of
// separate activities, and nothing on it repeats the same facts in the same way.
//   1. Yesterday's clues: a few quick questions about earlier days only, with her open mistakes first.
//   2. Learn: a short illustrated lesson on the day's material (she does not know it yet).
//   3. Today's world: the game that practises what she has just learned (plus a world missed on an earlier day).
//   4. Explain it like the test: two or three written answers about today's world.
// The last two days are the mock tests, after a slightly longer set of clues. Exam day is the warm-up.
// Only these tasks exist: Adele does what is on the list and nothing optional (Jenia, 28 Nov).
import { challengesOf, playTaskId, type World } from '../content/adventure';
import { conceptOf, itemsOf, type DateKey, type Item, type ItemId, type Pack, type ShortItem } from '../content/types';
import { daysBetween } from './dates';
import type { SessionRecord, TodayPlan } from './plan';
import { type ProgressMap } from './progress';
import { shuffle, type Rng } from './rng';
import { learnTaskId, mockTaskId, type Task } from './tasks';

export const CLUES_TASK = 'clues';
export const EXPLAIN_TASK = 'explain';
/** Yesterday's clues: how many quick questions, on a normal day and on a mock-test day. */
export const CLUES_SIZE = 10;
export const CLUES_SIZE_MOCK = 12;
/** Explain it like the test: how many written answers. */
export const EXPLAIN_SIZE = 3;

/** The world planned for each plan day (from the day's `play` extra). */
function plannedWorlds(pack: Pack): { day: number; world: string }[] {
  return pack.plan.flatMap((d) => (d.extras ?? []).flatMap((e) => (e.kind === 'play' ? [{ day: d.day, world: e.world }] : [])));
}

/** The worlds due today: today's world and any earlier world not finished yet (at most two, oldest first). */
export function worldsDue(pack: Pack, sessions: readonly SessionRecord[], today: DateKey): string[] {
  const off = -daysBetween(today, pack.date);
  const finishedBefore = new Set(sessions.filter((s) => s.date < today && s.task?.startsWith('play:')).map((s) => s.task!.slice(5)));
  return plannedWorlds(pack)
    .filter((p) => p.day <= off && !finishedBefore.has(p.world))
    .sort((a, b) => a.day - b.day)
    .map((p) => p.world)
    .slice(0, 2);
}

/** The mock test planned for today, if any (each mock day has its own paper). */
export function mockToday(pack: Pack, today: DateKey): string | undefined {
  const off = -daysBetween(today, pack.date);
  return pack.plan.find((d) => d.day === off)?.mock;
}

/** The things to know a world practises. */
export function conceptsOfWorld(world: World): Set<string> {
  return new Set(challengesOf(world).map((c) => c.concept));
}

/** Quick questions (not written answers, not table rows) about things met on an earlier day: mistakes first, then the weakest. */
export function buildCluesSession(pack: Pack, progress: ProgressMap, today: DateKey, size = CLUES_SIZE, rng: Rng = Math.random): ItemId[] {
  const quick = itemsOf(pack).filter((it) => it.type !== 'short' && it.type !== 'table');
  const byConcept = new Map<string, Item[]>();
  for (const it of quick) byConcept.set(conceptOf(it), [...(byConcept.get(conceptOf(it)) ?? []), it]);
  const met = [...byConcept.keys()].filter((c) => {
    const p = progress[c];
    return p && p.seen > 0 && (p.lastSeen ?? '').slice(0, 10) < today;
  });
  const rank = (c: string) => {
    const p = progress[c]!;
    // Open mistakes first, then the lowest level, then the one not seen for longest.
    return (p.fix !== undefined ? 0 : 100) + p.level * 10 - Math.min(9, daysBetween((p.lastSeen ?? today).slice(0, 10), today));
  };
  const chosen = shuffle(met, rng).sort((a, b) => rank(a) - rank(b)).slice(0, size);
  return chosen.map((c) => {
    const items = byConcept.get(c)!;
    const recent = progress[c]?.recent ?? [];
    // The wording she missed comes back first; otherwise a wording she has not met recently.
    const missed = items.find((it) => it.id === progress[c]?.fixItem);
    const fresh = items.filter((it) => !recent.includes(it.id));
    return (missed ?? fresh[Math.floor(rng() * fresh.length)] ?? items[0]).id;
  });
}

/** How many clues there would be today (0 = no clues task, for example on the very first day). */
export function cluesAvailable(pack: Pack, progress: ProgressMap, today: DateKey, size: number): number {
  return buildCluesSession(pack, progress, today, size, () => 0.5).length;
}

/** Written questions about today's worlds: the things she knows least first, one question per thing. */
export function buildExplainSession(pack: Pack, worlds: readonly string[], progress: ProgressMap, rng: Rng = Math.random, size = EXPLAIN_SIZE): ItemId[] {
  const concepts = new Set((pack.adventure?.worlds ?? []).filter((w) => worlds.includes(w.id)).flatMap((w) => [...conceptsOfWorld(w)]));
  const written = itemsOf(pack).filter((it): it is ShortItem => it.type === 'short' && concepts.has(conceptOf(it)));
  const seen = new Set<string>();
  return shuffle(written, rng)
    .sort((a, b) => (progress[conceptOf(a)]?.level ?? 0) - (progress[conceptOf(b)]?.level ?? 0))
    .filter((it) => (seen.has(conceptOf(it)) ? false : (seen.add(conceptOf(it)), true)))
    .slice(0, size)
    .map((it) => it.id);
}

/** Today's journey as a task list. Exam day and the days after the exam are left to the usual tasks. */
export function journeyTasks(pack: Pack, plan: TodayPlan, sessions: readonly SessionRecord[], today: DateKey, progress: ProgressMap): Task[] {
  const todays = sessions.filter((s) => s.date === today);
  const did = (id: string) => todays.some((s) => s.task === id);
  const worlds = worldsDue(pack, sessions, today);
  const mock = mockToday(pack, today);
  const title = (id: string) => pack.adventure?.worlds.find((w) => w.id === id)?.title ?? id;
  const tasks: Task[] = [];

  const clues = did(CLUES_TASK) ? 1 : cluesAvailable(pack, progress, today, mock ? CLUES_SIZE_MOCK : CLUES_SIZE);
  if (clues > 0) {
    tasks.push({
      id: CLUES_TASK, kind: 'clues', title: mock ? 'Warm-up: clues from all week' : 'Yesterday\'s clues',
      detail: did(CLUES_TASK) ? 'Done' : `${clues} quick question${clues === 1 ? '' : 's'} · about ${Math.max(2, Math.round(clues * 0.4))} min`,
      tip: 'Quick questions about what you learned before. Your mistakes come back here until you get them right.',
      done: did(CLUES_TASK),
    });
  }

  const off = -daysBetween(today, pack.date);
  // She learns the material first, then plays it (Jenia, 28 Nov): the world's lesson comes right before the world.
  const learnedBefore = (w: string) => sessions.some((s) => s.date < today && s.task === learnTaskId(w));
  for (const w of worlds) {
    const lesson = pack.lessons?.find((l) => l.topic === w);
    if (lesson && !learnedBefore(w)) {
      tasks.push({
        id: learnTaskId(w), kind: 'learn', topic: w, title: `Learn: ${lesson.title}`,
        detail: did(learnTaskId(w)) ? 'Done' : `${lesson.cards.length} short cards · about ${Math.round(lesson.cards.length * 1.2)} min`,
        tip: `First learn it. ${lesson.blurb} Tap "Next step" to see each idea, then answer the quick check.`,
        done: did(learnTaskId(w)),
      });
    }
    const planned = plannedWorlds(pack).find((p) => p.world === w)?.day ?? off;
    tasks.push({
      id: playTaskId(w), kind: 'play', world: w,
      title: planned < off ? `Catch up: ${title(w)}` : `Today's world: ${title(w)}`,
      detail: 'Three levels · about 8 min',
      tip: 'Now use what you just learned. A wrong move shows you why. Read it, then try again.',
      done: did(playTaskId(w)),
    });
  }
  // A world finished today stays on today's list, ticked.
  for (const s of todays) {
    const w = s.task?.startsWith('play:') ? s.task.slice(5) : undefined;
    if (w && !worlds.includes(w)) tasks.push({ id: playTaskId(w), kind: 'play', world: w, title: `Today's world: ${title(w)}`, detail: 'Done', tip: '', done: true });
  }

  const explainWorlds = [...new Set([...worlds, ...todays.flatMap((s) => (s.task?.startsWith('play:') ? [s.task.slice(5)] : []))])];
  if (explainWorlds.length > 0 && !mock) {
    const n = did(EXPLAIN_TASK) ? EXPLAIN_SIZE : buildExplainSession(pack, explainWorlds, progress, () => 0.5).length;
    if (n > 0) {
      tasks.push({
        id: EXPLAIN_TASK, kind: 'explain', title: 'Explain it like the test',
        detail: did(EXPLAIN_TASK) ? 'Done' : `${n} written answer${n === 1 ? '' : 's'} · about 5 min`,
        tip: 'Answer in full sentences, as in the test. You can say it with the microphone. I check the key ideas.',
        done: did(EXPLAIN_TASK),
      });
    }
  }

  if (mock) {
    const minutes = pack.mocks?.find((m) => m.id === mock)?.minutes ?? 35;
    tasks.push({
      id: mockTaskId(mock), kind: 'mock', title: `Final mission: ${pack.mocks?.find((m) => m.id === mock)?.title ?? 'Mock Test'}`,
      detail: `Like the real test · about ${minutes} min`,
      tip: 'Do it like the real test: notes closed, answer every question yourself. At the end you see what to fix.',
      done: did(mockTaskId(mock)),
    });
  }
  return plan.phase === 'past' ? [] : tasks;
}

/** A short line for Home: what today's journey is about. */
export function journeyLabel(pack: Pack, sessions: readonly SessionRecord[], today: DateKey): string {
  const mock = mockToday(pack, today);
  const worlds = worldsDue(pack, sessions, today);
  const title = (id: string) => pack.adventure?.worlds.find((w) => w.id === id)?.title ?? id;
  if (mock) return worlds.length ? `Catch up on ${worlds.map(title).join(' and ')}, then the final mission` : 'Final mission: a mock test like the real one';
  if (worlds.length) return worlds.map(title).join(', then ');
  return 'Your journey for today';
}
