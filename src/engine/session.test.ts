import { describe, expect, it } from 'vitest';
import { choice, term } from '../content/build';
import type { Item, Pack } from '../content/types';
import { planFor } from './plan';
import { applyAnswer, type ProgressMap } from './progress';
import { seeded } from './rng';
import {
  answerRun, buildFixSession, buildGlossarySession, buildPracticeSession, buildTodaySession, currentId, dueToday, isFinished, startRun, summarise,
  GLOSSARY_IN_MIX, MAX_ASKS, TODAY_SIZE, WARM_UP_SIZE, buildLateSession,
} from './session';

const topic = (id: string, n: number) => ({
  id, title: id, short: id, items: Array.from({ length: n }, (_, i) => choice(`${id}-${i + 1}`, 'q', 'yes', ['no'])),
});
const pack: Pack = {
  id: 'p', subject: 's', title: 't', date: '2026-11-18', criteria: [],
  topics: [topic('A', 12), topic('B', 12), topic('C', 12)],
  plan: [{ day: -4, label: 'A and B', topics: ['A', 'B'] }, { day: -3, label: 'C', topics: ['C'] }, { day: -1, label: 'Mock', mock: 'm' }],
};
const sat = '2026-11-14';
const sun = '2026-11-15';
const right = (progress: ProgressMap, ids: string[], day: string) => {
  for (const id of ids) progress[id] = applyAnswer(progress[id], 'right', day, id);
};

describe("today's round", () => {
  it('has 15 questions from the topics of the day', () => {
    const ids = buildTodaySession(pack, {}, planFor(pack, [], sat), sat, seeded(1));
    expect(ids).toHaveLength(TODAY_SIZE);
    expect(new Set(ids).size).toBe(TODAY_SIZE);
    expect(ids.every((id) => id.startsWith('A-') || id.startsWith('B-'))).toBe(true);
  });

  it('picks the lowest levels first', () => {
    const progress: ProgressMap = {};
    const all = pack.topics.slice(0, 2).flatMap((t) => t.items.map((it) => it.id));
    right(progress, all, '2026-11-12');
    right(progress, all, '2026-11-13'); // everything at level 2...
    const weak = ['A-3', 'A-9', 'B-2', 'B-11'];
    for (const id of weak) progress[id] = applyAnswer(progress[id], 'wrong', '2026-11-13', id); // ...except these
    const ids = buildTodaySession(pack, progress, planFor(pack, [], sat), sat, seeded(2));
    for (const id of weak) expect(ids).toContain(id);
  });

  it('mixes in a short review of earlier topics', () => {
    const progress: ProgressMap = {};
    right(progress, pack.topics[0].items.map((it) => it.id), sat);
    const plan = planFor(pack, [{ date: sat, kind: 'today', topics: ['A', 'B'], asked: 15, firstTimeRight: 15 }], sun);
    expect(plan.topics).toEqual(['C']);
    const ids = buildTodaySession(pack, progress, plan, sun, seeded(3));
    expect(ids.filter((id) => id.startsWith('A-'))).toHaveLength(4);
    expect(ids.filter((id) => id.startsWith('C-'))).toHaveLength(11);
    expect(ids.some((id) => id.startsWith('B-'))).toBe(false); // never met, so not "review"
  });

  it('counts down what is left today, and a second round takes only what is still due', () => {
    const plan = planFor(pack, [], sat);
    expect(dueToday(pack, {}, plan, sat)).toBe(24);
    const first = buildTodaySession(pack, {}, plan, sat, seeded(4));
    const progress: ProgressMap = {};
    right(progress, first, sat);
    expect(dueToday(pack, progress, plan, sat)).toBe(9);
    const second = buildTodaySession(pack, progress, plan, sat, seeded(5));
    expect(second).toHaveLength(9);
    expect(second.some((id) => first.includes(id))).toBe(false);
  });

  it('turns into extra practice once nothing is due', () => {
    const plan = planFor(pack, [], sat);
    const progress: ProgressMap = {};
    right(progress, pack.topics.slice(0, 2).flatMap((t) => t.items.map((it) => it.id)), sat);
    expect(dueToday(pack, progress, plan, sat)).toBe(0);
    expect(buildTodaySession(pack, progress, plan, sat, seeded(6))).toHaveLength(TODAY_SIZE);
  });

  it('is a mixed quiz on the last day and a warm-up of the weakest things on exam day', () => {
    const mixed = buildTodaySession(pack, {}, planFor(pack, [], '2026-11-17'), '2026-11-17', seeded(6));
    expect(mixed).toHaveLength(TODAY_SIZE);
    const warm = buildTodaySession(pack, { 'C-5': applyAnswer(undefined, 'wrong', sat, 'C-5') }, planFor(pack, [], '2026-11-18'), '2026-11-18', seeded(7));
    expect(warm).toHaveLength(WARM_UP_SIZE);
    expect(warm[0]).toBe('C-5');
  });
});

describe('several wordings of one thing', () => {
  // Three things to know, each with four wordings.
  const items: Item[] = ['x', 'y', 'z'].flatMap((c) =>
    [1, 2, 3, 4].map((n) => ({ ...choice(`${c}${n}`, 'q', 'yes', ['no']), concept: c })));
  const p2: Pack = { ...pack, topics: [{ id: 'A', title: 'A', short: 'A', items }], plan: [{ day: -4, label: 'A', topics: ['A'] }] };

  it("asks each thing once in today's round", () => {
    const ids = buildTodaySession(p2, {}, planFor(p2, [], sat), sat, seeded(1));
    expect(ids).toHaveLength(3);
    expect(ids.map((id) => id[0]).sort()).toEqual(['x', 'y', 'z']);
  });

  it('chooses a wording she has not just seen', () => {
    let progress: ProgressMap = {};
    const asked = new Set<string>();
    for (let day = 10; day < 14; day++) {
      const today = `2026-11-${day}`;
      const ids = buildTodaySession(p2, progress, planFor(p2, [], today), today, seeded(day));
      const x = ids.find((id) => id.startsWith('x'))!;
      expect(asked.has(x)).toBe(false);
      asked.add(x);
      // She gets it wrong each day, so it stays due.
      progress = { ...progress, x: applyAnswer(progress.x, 'wrong', today, x) };
    }
    expect(asked.size).toBe(4);
  });

  it('lets a practice drill ask several wordings of the same thing', () => {
    const ids = buildPracticeSession(items.filter((it) => it.concept === 'x'), {}, sat, seeded(2));
    expect(ids).toHaveLength(4);
  });
});

describe('practice and fixing', () => {
  it('builds a practice round from any set of questions', () => {
    const ids = buildPracticeSession(pack.topics[2].items, {}, sat, seeded(8), 5);
    expect(ids).toHaveLength(5);
    expect(ids.every((id) => id.startsWith('C-'))).toBe(true);
  });

  it('Fix My Mistakes holds only the questions she got wrong', () => {
    const progress: ProgressMap = {
      'A-1': applyAnswer(undefined, 'wrong', sat, 'A-1'),
      'B-7': applyAnswer(undefined, 'wrong', sat, 'B-7'),
      'C-2': applyAnswer(undefined, 'right', sat, 'C-2'),
    };
    expect(buildFixSession(pack, progress, seeded(9)).sort()).toEqual(['A-1', 'B-7']);
    expect(buildFixSession(pack, {}, seeded(9))).toEqual([]);
  });
});

describe('running a session', () => {
  it('asks a missed question again later in the same session', () => {
    let run = startRun(['a', 'b', 'c', 'd', 'e', 'f']);
    run = answerRun(run, 'wrong');
    expect(run.queue).toEqual(['a', 'b', 'c', 'd', 'a', 'e', 'f']);
    expect(currentId(run)).toBe('b');
  });

  it('adds the repeat at the end when the session is nearly over', () => {
    let run = startRun(['a', 'b']);
    run = answerRun(run, 'right');
    run = answerRun(run, 'wrong');
    expect(run.queue).toEqual(['a', 'b', 'b']);
    expect(isFinished(run)).toBe(false);
  });

  it('never asks the same question more than three times', () => {
    let run = startRun(['a']);
    let asked = 0;
    while (!isFinished(run)) { run = answerRun(run, 'wrong'); asked++; }
    expect(asked).toBe(MAX_ASKS);
  });

  it('scores on the first try only', () => {
    let run = startRun(['a', 'b', 'c']);
    run = answerRun(run, 'right');
    run = answerRun(run, 'wrong');
    run = answerRun(run, 'right');
    run = answerRun(run, 'right'); // b again
    expect(isFinished(run)).toBe(true);
    expect(summarise(run)).toEqual({ asked: 3, firstTimeRight: 2, missed: ['b'] });
  });

  it('can repeat a right answer, for Fix My Mistakes', () => {
    let run = startRun(['a']);
    run = answerRun(run, 'right', true);
    expect(run.queue).toEqual(['a', 'a']);
    run = answerRun(run, 'right', false);
    expect(isFinished(run)).toBe(true);
  });
});

describe('a round of glossary words', () => {
  const words = Array.from({ length: 30 }, (_, i) => term(`v-${i}`, `Word ${i}`, 'A definition.'));
  const mon = '2026-11-16';
  const tue = '2026-11-17';
  const met = (ids: string[], outcome: 'right' | 'almost', day: string): ProgressMap =>
    Object.fromEntries(ids.map((id) => [id, applyAnswer(undefined, outcome, day, id)]));

  it('is all new words the first time', () => {
    const ids = buildGlossarySession(words, {}, mon, seeded(1));
    expect(ids).toHaveLength(12);
    expect(new Set(ids).size).toBe(12);
  });

  it('brings back words met on an earlier day, mixed with new ones', () => {
    const yesterday = words.slice(0, 12).map((w) => w.id);
    const ids = buildGlossarySession(words, met(yesterday, 'almost', mon), tue, seeded(2));
    expect(ids).toHaveLength(12);
    expect(ids.filter((id) => yesterday.includes(id))).toHaveLength(6);
    expect(ids.filter((id) => !yesterday.includes(id))).toHaveLength(6);
  });

  it('repeats words she had right on an earlier day too, but not ones already right today', () => {
    const rightYesterday = words.slice(0, 4).map((w) => w.id);
    const rightToday = words.slice(4, 8).map((w) => w.id);
    const progress = { ...met(rightYesterday, 'right', mon), ...met(rightToday, 'right', tue) };
    const ids = buildGlossarySession(words, progress, tue, seeded(3));
    expect(ids.filter((id) => rightYesterday.includes(id))).toHaveLength(4);
    expect(ids.filter((id) => rightToday.includes(id))).toHaveLength(0);
    expect(ids).toHaveLength(12);
  });

  it('asks the ones she knows least first when there are more than fit', () => {
    const unknown = words.slice(0, 8).map((w) => w.id);
    const known = words.slice(8, 16).map((w) => w.id);
    const progress = { ...met(unknown, 'almost', mon), ...met(known, 'right', mon) };
    const ids = buildGlossarySession(words, progress, tue, seeded(4));
    expect(ids.filter((id) => unknown.includes(id))).toHaveLength(6);
    expect(ids.filter((id) => known.includes(id))).toHaveLength(0);
  });

  it('leaves the words the slides never use until every other word has been met', () => {
    const last = words.slice(0, 8).map((w) => w.id);
    const first = buildGlossarySession(words, {}, mon, seeded(7), 12, last);
    expect(first.filter((id) => last.includes(id))).toHaveLength(0);
    // 22 other words: once they are all met, the late ones start to come.
    const others = words.slice(8).map((w) => w.id);
    const later = buildGlossarySession(words, met(others, 'right', mon), mon, seeded(8), 12, last);
    expect(later.filter((id) => last.includes(id))).toHaveLength(8);
  });

  it('fills the round with review when no new words are left', () => {
    const all = words.slice(0, 10);
    const progress = met(all.map((w) => w.id), 'almost', mon);
    expect(buildGlossarySession(all, progress, tue, seeded(5))).toHaveLength(10);
    // Everything right today already: it still gives a round, for extra practice.
    const done = met(all.map((w) => w.id), 'right', tue);
    expect(buildGlossarySession(all, done, tue, seeded(6))).toHaveLength(10);
  });
});

describe('the last day\'s mixed round', () => {
  const words = Array.from({ length: 20 }, (_, i) => term(`v-${i}`, `Word ${i}`, 'A definition.'));
  const withWords: Pack = { ...pack, glossary: words, glossaryLast: ['v-18', 'v-19'] };
  const tue = '2026-11-17';

  it('brings in glossary words on top of the topic questions, new words first', () => {
    const plan = planFor(withWords, [], tue);
    expect(plan.phase).toBe('last-day');
    const ids = buildTodaySession(withWords, {}, plan, tue, seeded(3));
    const fromWords = ids.filter((id) => id.startsWith('v-'));
    expect(ids).toHaveLength(TODAY_SIZE + GLOSSARY_IN_MIX);
    expect(fromWords).toHaveLength(GLOSSARY_IN_MIX);
    expect(fromWords).not.toContain('v-18'); // never-on-the-slides words come last
    expect(fromWords).not.toContain('v-19');
  });

  it('the late-additions round holds every late question she has not met yet', () => {
    const lateIds = ['A-3', 'B-7', 'C-11'];
    const p: Pack = { ...pack, lateAdditions: lateIds };
    expect([...buildLateSession(p, {}, seeded(4))].sort()).toEqual(lateIds);
    const met: ProgressMap = { 'A-3': applyAnswer(undefined, 'right', tue, 'A-3') };
    expect([...buildLateSession(p, met, seeded(4))].sort()).toEqual(['B-7', 'C-11']);
    expect(buildLateSession(pack, {}, seeded(4))).toEqual([]);
  });

  it('adds no words on an ordinary day, or when the pack has no glossary', () => {
    const ordinary = planFor(withWords, [], sat);
    expect(buildTodaySession(withWords, {}, ordinary, sat, seeded(3)).some((id) => id.startsWith('v-'))).toBe(false);
    const plan = planFor(pack, [], tue);
    expect(buildTodaySession(pack, {}, plan, tue, seeded(3))).toHaveLength(TODAY_SIZE);
  });
});
