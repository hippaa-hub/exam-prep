import { describe, expect, it } from 'vitest';
import { choice } from '../content/build';
import type { Pack } from '../content/types';
import { planFor, type SessionRecord } from './plan';
import { GLOSSARY_TASK, dayFinished, nextTask, tasksFor } from './tasks';

const topic = (id: string) => ({ id, title: id, short: id, items: [choice(`${id}-1`, 'q', 'yes', ['no'])] });
const pack: Pack = {
  id: 'p', subject: 's', title: 't', date: '2026-11-18', criteria: [],
  topics: ['G1', 'G4', 'S1', 'S4', 'G2'].map(topic),
  plan: [
    { day: -4, label: 'Key terms', topics: ['G1', 'G4'], extras: [{ kind: 'game', game: 'key-terms' }] },
    { day: -3, label: 'Systems', topics: ['S1', 'S4'], extras: [{ kind: 'table', group: 'The five countries' }] },
    { day: -2, label: 'Pairs', topics: ['G2'], extras: [{ kind: 'game', game: 'this-or-that' }] },
    { day: -1, label: 'Mixed', mock: 'mock-1', extras: [{ kind: 'table', group: 'The five countries' }] },
  ],
};
const sat = '2026-11-14';
const rec = (kind: SessionRecord['kind'], task?: string, date = sat): SessionRecord =>
  ({ date, kind, topics: [], asked: 10, firstTimeRight: 8, task });
const ids = (sessions: SessionRecord[], due: number, mistakes: number, day = sat) =>
  tasksFor(planFor(pack, sessions, day), sessions, day, due, mistakes);

describe("today's tasks", () => {
  it('lists the flashcards first, then round 1, round 2 and Fix My Mistakes', () => {
    const tasks = ids([], 20, 0);
    expect(tasks.map((t) => t.id)).toEqual(['game:key-terms', 'round-1', 'round-2', 'fix']);
    expect(tasks.every((t) => !t.done)).toBe(true);
    expect(nextTask(tasks)?.id).toBe('game:key-terms');
    expect(dayFinished(tasks)).toBe(false);
  });

  it('ticks each task as it is done and always knows the next one', () => {
    let sessions = [rec('practice', 'game:key-terms')];
    expect(nextTask(ids(sessions, 19, 3))?.id).toBe('round-1');
    sessions = [...sessions, rec('today', 'round-1')];
    expect(nextTask(ids(sessions, 9, 3))?.id).toBe('round-2');
    sessions = [...sessions, rec('today', 'round-2')];
    expect(nextTask(ids(sessions, 2, 3))?.id).toBe('fix');
    sessions = [...sessions, rec('fix', 'fix')];
    const tasks = ids(sessions, 2, 1);
    expect(nextTask(tasks)).toBeUndefined();
    expect(dayFinished(tasks)).toBe(true);
  });

  it('skips round 2 when round 1 left nothing to do, and Fix when there is nothing to fix', () => {
    const tasks = ids([rec('today', 'round-1'), rec('practice', 'game:key-terms')], 0, 0);
    expect(dayFinished(tasks)).toBe(true);
  });

  it('does not tick Fix My Mistakes before the tasks ahead of it are done', () => {
    const tasks = ids([], 20, 0);
    expect(tasks.find((t) => t.id === 'fix')?.done).toBe(false);
  });

  it('counts the finish line as two rounds, even if some things are still shaky', () => {
    const sessions = [rec('today'), rec('practice', 'game:key-terms'), rec('today'), rec('fix')];
    expect(dayFinished(ids(sessions, 5, 4))).toBe(true);
  });

  it("only counts today's sessions", () => {
    const sessions = [rec('today', 'round-1', '2026-11-13'), rec('practice', 'game:key-terms', '2026-11-13')];
    expect(ids(sessions, 20, 0).every((t) => !t.done)).toBe(true);
  });

  it('uses the activity of each plan day', () => {
    const done = [rec('today', 'round-1', '2026-11-14')].map((s) => ({ ...s, topics: ['G1', 'G4'] }));
    expect(ids(done, 5, 0, '2026-11-15').map((t) => t.id)).toEqual(['round-1', 'table:The five countries', 'round-2', 'fix']);
    expect(ids([], 5, 0, '2026-11-17').map((t) => t.id)).toEqual(['round-1', 'table:The five countries', 'round-2', 'fix']);
  });

  it('gives a head start the first day\'s activity', () => {
    expect(ids([], 5, 0, '2026-11-13').map((t) => t.id)).toContain('game:key-terms');
  });

  it('brings the missed day\'s activity along when catching up', () => {
    // Saturday missed: on Sunday the plan carries Saturday's topics and its flashcards too.
    expect(ids([], 5, 0, '2026-11-15').map((t) => t.id))
      .toEqual(['game:key-terms', 'round-1', 'table:The five countries', 'round-2', 'fix']);
  });

  it('is only a warm-up on exam day, and nothing after the exam', () => {
    const exam = ids([], 0, 0, '2026-11-18');
    expect(exam.map((t) => t.id)).toEqual(['warm-up']);
    expect(dayFinished(ids([rec('today', 'warm-up', '2026-11-18')], 0, 0, '2026-11-18'))).toBe(true);
    expect(ids([], 0, 0, '2026-11-19')).toEqual([]);
    expect(dayFinished([])).toBe(false);
  });

  it('on the mock exam day: a mixed round, then Fix My Mistakes, then the Mock Exam last', () => {
    const withMock: Pack = { ...pack, mocks: [{ id: 'mock-1', title: 'Mock Exam 1', minutes: 35, partA: [], partB: [] }],
      plan: pack.plan.map((d) => (d.day === -1 ? { day: -1, label: 'Mock', mock: 'mock-1' } : d)) };
    const tue = '2026-11-17';
    const list = (sessions: SessionRecord[], due: number, mistakes: number) => tasksFor(planFor(withMock, sessions, tue), sessions, tue, due, mistakes);
    expect(list([], 20, 0).map((t) => t.id)).toEqual(['round-1', 'fix', 'mock:mock-1']);
    // With a glossary, the mixed round's size includes the words that join it.
    expect(tasksFor(planFor(withMock, [], tue), [], tue, 20, 0, 10)[0].detail).toMatch(/^25 questions/);
    expect(list([], 20, 0)[0].detail).toMatch(/^15 questions/);
    expect(nextTask(list([], 20, 3))?.id).toBe('round-1');
    const round = [rec('today', 'round-1', tue)];
    expect(nextTask(list(round, 9, 3))?.id).toBe('fix');
    const fixed = [...round, rec('fix', 'fix', tue)];
    expect(nextTask(list(fixed, 9, 1))?.kind).toBe('mock');
    // Nothing to fix: straight from the round to the mock.
    expect(nextTask(list(round, 9, 0))?.kind).toBe('mock');
    // The mock adds new mistakes, but that does not reopen Fix My Mistakes: the day is finished.
    expect(dayFinished(list([...round, rec('practice', 'mock:mock-1', tue)], 9, 4))).toBe(true);
    expect(dayFinished(list([...fixed, rec('practice', 'mock:mock-1', tue)], 9, 2))).toBe(true); // one round is enough
  });

  it('has the Argument Builder as a task on the day the plan asks for it', () => {
    const withArgument: Pack = { ...pack, plan: pack.plan.map((d) => (d.day === -2 ? { ...d, extras: [{ kind: 'argument' as const }] } : d)) };
    const mon = '2026-11-16';
    const before = [rec('today', 'round-1', '2026-11-14'), rec('today', 'round-1', '2026-11-15')].map((s, i) => ({ ...s, topics: i === 0 ? ['G1', 'G4'] : ['S1', 'S4'] }));
    const tasks = tasksFor(planFor(withArgument, before, mon), before, mon, 5, 0);
    expect(tasks.map((t) => t.id)).toEqual(['round-1', 'argument', 'round-2', 'fix']);
    const after = [...before, rec('today', 'round-1', mon), rec('practice', 'argument', mon)];
    expect(nextTask(tasksFor(planFor(withArgument, after, mon), after, mon, 3, 0))?.id).toBe('round-2');
  });

  it('keeps the argument when a missed day squeezes the activities down to two', () => {
    const withArgument: Pack = { ...pack, plan: pack.plan.map((d) => (d.day === -2 ? { ...d, extras: [{ kind: 'game' as const, game: 'this-or-that' as const }, { kind: 'argument' as const }] } : d)) };
    const mon = '2026-11-16';
    // Nothing done on Saturday or Sunday: everything lands on Monday.
    const ids = tasksFor(planFor(withArgument, [], mon), [], mon, 20, 0).map((t) => t.id);
    expect(ids).toEqual(['game:key-terms', 'round-1', 'argument', 'round-2', 'fix']);
  });

  it('gives every task a tip on how to do it well', () => {
    for (const t of ids([], 20, 2)) expect(t.tip.length).toBeGreaterThan(20);
  });
});

describe('Part 2: the glossary words', () => {
  it('is optional, so it is never one of the tasks the day waits for', () => {
    const done = [rec('practice', 'game:key-terms'), rec('today'), rec('today')];
    expect(ids([], 20, 0).map((t) => t.id)).toEqual(['game:key-terms', 'round-1', 'round-2', 'fix']);
    expect(dayFinished(ids(done, 0, 0))).toBe(true);
    // A finished glossary round changes nothing in the list.
    expect(ids([...done, rec('practice', GLOSSARY_TASK)], 0, 0).map((t) => t.id)).toEqual(['game:key-terms', 'round-1', 'round-2', 'fix']);
  });
});
