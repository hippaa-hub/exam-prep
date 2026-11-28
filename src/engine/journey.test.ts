// Plays a daily-journey pack day by day, the way Adele will: Yesterday's clues, the lesson, today's world,
// Explain it, the mocks on the last two days, and the warm-up on exam morning. Nothing optional.
import { describe, expect, it } from 'vitest';
import { challengesOf } from '../content/adventure';
import { conceptOf, conceptsOf, itemsOf, type Pack } from '../content/types';
import { packs } from '../packs';
import { addDays } from './dates';
import { buildCluesSession, buildExplainSession, CLUES_SIZE, CLUES_SIZE_MOCK, journeyTasks, mockToday } from './journey';
import { isSprint, occasionFor, planFor, type SessionRecord } from './plan';
import { applyAnswer, packReadiness, type ProgressMap } from './progress';
import { packRing } from './ring';
import { seeded } from './rng';
import { buildTodaySession } from './session';

function simulate(pack: Pack, firstDay: number, accuracy: number, seed: number) {
  const rng = seeded(seed);
  const byId = new Map(itemsOf(pack).map((it) => [it.id, it]));
  let progress: ProgressMap = {};
  let sessions: SessionRecord[] = [];
  const perDay: number[] = [];
  let ringEve = 0;

  for (let day = firstDay; day <= 0; day++) {
    const today = addDays(pack.date, day);
    let answers = 0;
    const answer = (concept: string, id: string) => {
      const plan = planFor(pack, sessions, today);
      const right = rng() < accuracy;
      progress = { ...progress, [concept]: applyAnswer(progress[concept], right ? 'right' : 'wrong', occasionFor(plan, sessions, today), id, true, isSprint(plan)) };
      answers++;
    };
    const done = (task: string, n: number) => { sessions = [...sessions, { date: today, kind: 'practice', topics: [], asked: n, firstTimeRight: n, task }]; };

    const plan = planFor(pack, sessions, today);
    if (plan.phase === 'exam-day') {
      const ids = buildTodaySession(pack, progress, plan, occasionFor(plan, sessions, today), rng);
      ids.forEach((id) => answer(conceptOf(byId.get(id)!), id));
      sessions = [...sessions, { date: today, kind: 'today', topics: [], asked: ids.length, firstTimeRight: ids.length, task: 'warm-up' }];
    } else {
      for (const task of journeyTasks(pack, plan, sessions, today, progress)) {
        if (task.kind === 'clues') {
          const ids = buildCluesSession(pack, progress, today, mockToday(pack, today) ? CLUES_SIZE_MOCK : CLUES_SIZE, rng);
          ids.forEach((id) => answer(conceptOf(byId.get(id)!), id));
          done(task.id, ids.length);
        } else if (task.kind === 'learn') {
          done(task.id, 0);
        } else if (task.kind === 'play' && task.world) {
          const world = pack.adventure!.worlds.find((w) => w.id === task.world)!;
          challengesOf(world).forEach((c) => answer(c.concept, `play:${world.id}:${c.id}`));
          done(task.id, challengesOf(world).length);
        } else if (task.kind === 'explain') {
          const worlds = sessions.filter((s) => s.date === today && s.task?.startsWith('play:')).map((s) => s.task!.slice(5));
          const ids = buildExplainSession(pack, worlds, progress, rng);
          ids.forEach((id) => answer(conceptOf(byId.get(id)!), id));
          done(task.id, ids.length);
        } else if (task.kind === 'mock') {
          const mock = pack.mocks!.find((m) => `mock:${m.id}` === task.id)!;
          mock.partA.forEach((id) => answer(conceptOf(byId.get(id)!), id));
          done(task.id, mock.partA.length);
        }
      }
    }
    perDay.push(answers);
    if (day === -1) ringEve = packRing(pack, progress, sessions);
  }
  return {
    ready: packReadiness(pack, progress),
    ring: packRing(pack, progress, sessions),
    ringEve,
    perDay,
    untouched: conceptsOf(itemsOf(pack)).filter((c) => !progress[c]).length,
  };
}

describe.each(packs.filter((p) => p.journey).map((p) => [p.id, p] as const))('the daily journey of %s', (_id, pack) => {
  const first = Math.min(...pack.plan.map((d) => d.day));

  it('gets a learner who is right 85% of the time ready by exam morning, in short days', () => {
    const runs = Array.from({ length: 20 }, (_, i) => simulate(pack, first, 0.85, 200 + i));
    const ready = Math.min(...runs.map((r) => r.ready));
    const longest = Math.max(...runs.flatMap((r) => r.perDay));
    console.log(`journey: ready ${ready}%, ring ${Math.min(...runs.map((r) => r.ring))}%, eve ${Math.min(...runs.map((r) => r.ringEve))}%, answers per day ${runs[0].perDay.join(' ')}`);
    expect(ready).toBeGreaterThanOrEqual(80);
    expect(longest).toBeLessThanOrEqual(40);
    for (const r of runs) expect(r.untouched).toBe(0);
  });

  it('copes with a late start: two days missed', () => {
    const runs = Array.from({ length: 10 }, (_, i) => simulate(pack, first + 2, 0.85, 300 + i));
    const ready = Math.min(...runs.map((r) => r.ready));
    console.log(`journey, late start: ready ${ready}%`);
    expect(ready).toBeGreaterThanOrEqual(60);
    for (const r of runs) expect(r.untouched).toBe(0);
  });

  it('has a lesson before every world except the review world, and each world on one day', () => {
    const worlds = pack.adventure!.worlds.map((w) => w.id);
    const withLesson = (pack.lessons ?? []).map((l) => l.topic);
    expect(worlds.filter((w) => !withLesson.includes(w))).toEqual(['detective']);
    for (const l of pack.lessons ?? []) for (const c of l.cards) {
      expect(c.tap, c.id).toBeTruthy();
      expect(c.tap!.options[c.tap!.answer], c.id).toBeTruthy();
    }
  });

  it('starts the first day with the lesson, then the world, then Explain it (no clues yet)', () => {
    const today = addDays(pack.date, first);
    const tasks = journeyTasks(pack, planFor(pack, [], today), [], today, {});
    expect(tasks.map((t) => t.kind)).toEqual(['learn', 'play', 'explain']);
  });
});
