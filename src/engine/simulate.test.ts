// Plays the real exam pack day by day, to check the plan is reachable in the time Adele has.
import { describe, expect, it } from 'vitest';
import { allItemsOf, conceptOf, conceptsOf, itemsOf, type Pack } from '../content/types';
import { packs } from '../packs';
import { addDays } from './dates';
import { isSprint, occasionFor, planFor, type SessionKind, type SessionRecord } from './plan';
import { applyAnswer, applyLook, packReadiness, topicReadiness, type ProgressMap } from './progress';
import { packRing } from './ring';
import { seeded } from './rng';
import { answerRun, buildFixSession, buildTodaySession, currentId, dueToday, isFinished, lastDaySize, roundSize, startRun, summarise } from './session';

interface Result {
  readiness: number; answersPerDay: number[]; topics: Record<string, number>; untouched: number;
  /** What the ring shows on the evening before the exam, and after the exam-morning warm-up. */
  ringEve: number; ringExam: number;
}

/**
 * A learner who starts `firstDay` days before the exam, does up to `rounds` rounds a day and is right `accuracy`
 * of the time. She follows the task list: one round on a mixed day, three on the last day (every round counts
 * there), Fix My Mistakes after the rounds, and the warm-up on exam morning.
 */
function simulate(pack: Pack, firstDay: number, rounds: number, accuracy: number, seed: number): Result {
  const rng = seeded(seed);
  const byId = new Map(allItemsOf(pack).map((it) => [it.id, it]));
  let progress: ProgressMap = {};
  let sessions: SessionRecord[] = [];
  const answersPerDay: number[] = [];
  let ringEve = 0;

  for (let day = firstDay; day <= 0; day++) {
    const today = addDays(pack.date, day);
    let answers = 0;
    const play = (ids: string[], kind: SessionKind, task: string) => {
      const plan = planFor(pack, sessions, today);
      const when = occasionFor(plan, sessions, today);
      let run = startRun(ids);
      while (!isFinished(run)) {
        const id = currentId(run)!;
        // A repeat straight after seeing the answer is easier than a first try.
        const outcome = rng() < (run.asks[id] ? 0.95 : accuracy) ? 'right' : 'wrong';
        const concept = conceptOf(byId.get(id)!);
        progress = {
          ...progress,
          [concept]: plan.phase === 'exam-day' && outcome !== 'right'
            ? applyLook(progress[concept], when, id)
            : applyAnswer(progress[concept], outcome, when, id, !run.asks[id], isSprint(plan)),
        };
        run = answerRun(run, outcome);
        answers++;
      }
      const s = summarise(run);
      sessions = [...sessions, { date: today, kind, topics: plan.topics, asked: s.asked, firstTimeRight: s.firstTimeRight, task }];
    };

    const first = planFor(pack, sessions, today);
    // A mixed day has one round among its tasks, the last day has three, any other day has two.
    const most = isSprint(first) ? 3 : first.phase === 'mix' || first.phase === 'exam-day' ? 1 : rounds;
    for (let r = 0; r < Math.min(rounds + (isSprint(first) ? 1 : 0), most); r++) {
      const plan = planFor(pack, sessions, today);
      const when = occasionFor(plan, sessions, today);
      if (r > 0 && dueToday(pack, progress, plan, when) === 0) break;
      const later = isSprint(plan) && r >= 1;
      // As in the app: the later rounds of the last day ask everything that is not full yet.
      play(buildTodaySession(pack, progress, later ? { ...plan, topics: [] } : plan, when, rng, later ? lastDaySize(pack) : roundSize(pack), !later), 'today',
        plan.phase === 'exam-day' ? 'warm-up' : `round-${r + 1}`);
    }
    if (first.phase !== 'exam-day' && rounds > 1) {
      const fix = buildFixSession(pack, progress, rng);
      if (fix.length > 0) play(fix, 'fix', 'fix');
    }
    if (day === -1) ringEve = packRing(pack, progress, sessions);
    answersPerDay.push(answers);
  }
  return {
    readiness: packReadiness(pack, progress),
    answersPerDay,
    topics: Object.fromEntries(pack.topics.map((t) => [t.id, topicReadiness(t, progress)])),
    untouched: conceptsOf(itemsOf(pack)).filter((c) => !progress[c]).length,
    ringEve,
    ringExam: packRing(pack, progress, sessions),
  };
}

const average = (xs: number[]) => Math.round(xs.reduce((a, b) => a + b, 0) / xs.length);

// A pack with a daily journey is played by journey.test.ts instead: its days are not rounds of questions.
describe.each(packs.filter((p) => !p.journey).map((p) => [p.id, p] as const))('the countdown for %s', (_id, pack) => {
  const first = Math.min(...pack.plan.map((d) => d.day));
  const runs = (firstDay: number, rounds: number, accuracy: number) =>
    Array.from({ length: 20 }, (_, i) => simulate(pack, firstDay, rounds, accuracy, 100 + i));

  it('gets a steady learner (two rounds a day, 85% right) to ready by exam morning', () => {
    const results = runs(first, 2, 0.85);
    const ready = average(results.map((r) => r.readiness));
    // The last day is the long one (three rounds, every one counts), so it is measured by itself.
    const perDay = average(results.flatMap((r) => r.answersPerDay.slice(0, -2)));
    const lastDay = average(results.map((r) => r.answersPerDay[r.answersPerDay.length - 2]));
    console.log(`two rounds a day: ${ready}% ready, about ${perDay} answers a day and ${lastDay} on the last day; ring ${average(results.map((r) => r.ringEve))}% the evening before, ${average(results.map((r) => r.ringExam))}% after the warm-up`, results[0].topics);
    expect(ready).toBeGreaterThanOrEqual(80);
    expect(perDay).toBeLessThanOrEqual(40); // about 20 minutes
    expect(lastDay).toBeLessThanOrEqual(90); // about an hour, before the Mock Exam
    for (const r of results) expect(r.untouched).toBe(0);
  });

  it('lets a learner who gets everything right fill the ring: 95% the evening before, 100% after the warm-up', () => {
    for (const r of runs(first, 2, 1)) {
      expect(r.ringEve).toBe(95);
      expect(r.ringExam).toBe(100);
    }
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
