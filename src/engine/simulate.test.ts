// Plays the real exam pack day by day, to check the plan is reachable in the time Adele has.
import { describe, expect, it } from 'vitest';
import { conceptOf, conceptsOf, itemsOf, type Pack } from '../content/types';
import { packs } from '../packs';
import { addDays } from './dates';
import { planFor, type SessionRecord } from './plan';
import { applyAnswer, packReadiness, topicReadiness, type ProgressMap } from './progress';
import { seeded } from './rng';
import { answerRun, buildTodaySession, currentId, dueToday, isFinished, startRun, summarise } from './session';

interface Result { readiness: number; answersPerDay: number[]; topics: Record<string, number>; untouched: number }

/** A learner who starts `firstDay` days before the exam, does up to `rounds` rounds a day and is right `accuracy` of the time. */
function simulate(pack: Pack, firstDay: number, rounds: number, accuracy: number, seed: number): Result {
  const rng = seeded(seed);
  const byId = new Map(itemsOf(pack).map((it) => [it.id, it]));
  let progress: ProgressMap = {};
  const sessions: SessionRecord[] = [];
  const answersPerDay: number[] = [];

  for (let day = firstDay; day <= 0; day++) {
    const today = addDays(pack.date, day);
    let answers = 0;
    for (let r = 0; r < rounds; r++) {
      const plan = planFor(pack, sessions, today);
      if (r > 0 && dueToday(pack, progress, plan, today) === 0) break;
      let run = startRun(buildTodaySession(pack, progress, plan, today, rng));
      while (!isFinished(run)) {
        const id = currentId(run)!;
        // A repeat straight after seeing the answer is easier than a first try.
        const outcome = rng() < (run.asks[id] ? 0.95 : accuracy) ? 'right' : 'wrong';
        const concept = conceptOf(byId.get(id)!);
        progress = { ...progress, [concept]: applyAnswer(progress[concept], outcome, today, id, !run.asks[id]) };
        run = answerRun(run, outcome);
        answers++;
      }
      const s = summarise(run);
      sessions.push({ date: today, kind: 'today', topics: plan.topics, asked: s.asked, firstTimeRight: s.firstTimeRight });
    }
    answersPerDay.push(answers);
  }
  return {
    readiness: packReadiness(pack, progress),
    answersPerDay,
    topics: Object.fromEntries(pack.topics.map((t) => [t.id, topicReadiness(t, progress)])),
    untouched: conceptsOf(itemsOf(pack)).filter((c) => !progress[c]).length,
  };
}

const average = (xs: number[]) => Math.round(xs.reduce((a, b) => a + b, 0) / xs.length);

describe.each(packs.map((p) => [p.id, p] as const))('the countdown for %s', (_id, pack) => {
  const first = Math.min(...pack.plan.map((d) => d.day));
  const runs = (firstDay: number, rounds: number, accuracy: number) =>
    Array.from({ length: 20 }, (_, i) => simulate(pack, firstDay, rounds, accuracy, 100 + i));

  it('gets a steady learner (two rounds a day, 85% right) to ready by exam morning', () => {
    const results = runs(first, 2, 0.85);
    const ready = average(results.map((r) => r.readiness));
    const perDay = average(results.flatMap((r) => r.answersPerDay.slice(0, -1)));
    console.log(`two rounds a day: ${ready}% ready, about ${perDay} answers a day`, results[0].topics);
    expect(ready).toBeGreaterThanOrEqual(65);
    expect(perDay).toBeLessThanOrEqual(40); // about 20 minutes
    for (const r of results) expect(r.untouched).toBe(0);
  });

  it('still covers everything with one round a day', () => {
    const results = runs(first, 1, 0.85);
    console.log(`one round a day: ${average(results.map((r) => r.readiness))}% ready`, results[0].topics);
    for (const r of results) expect(r.untouched).toBeLessThanOrEqual(2);
  });

  it('copes with a late start two days before the exam', () => {
    const results = runs(-2, 2, 0.85);
    console.log(`late start: ${average(results.map((r) => r.readiness))}% ready, untouched ${average(results.map((r) => r.untouched))}`);
    for (const r of results) expect(r.untouched).toBeLessThanOrEqual(15);
  });
});
