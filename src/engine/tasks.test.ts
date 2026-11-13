import { describe, expect, it } from 'vitest';
import { choice } from '../content/build';
import type { Pack } from '../content/types';
import { planFor, type SessionRecord } from './plan';
import { dayFinished, nextTask, tasksFor } from './tasks';

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
  it('lists round 1, the activity of the day, round 2 and Fix My Mistakes, in that order', () => {
    const tasks = ids([], 20, 0);
    expect(tasks.map((t) => t.id)).toEqual(['round-1', 'game:key-terms', 'round-2', 'fix']);
    expect(tasks.every((t) => !t.done)).toBe(true);
    expect(nextTask(tasks)?.id).toBe('round-1');
    expect(dayFinished(tasks)).toBe(false);
  });

  it('ticks each task as it is done and always knows the next one', () => {
    let sessions = [rec('today', 'round-1')];
    expect(nextTask(ids(sessions, 9, 3))?.id).toBe('game:key-terms');
    sessions = [...sessions, rec('practice', 'game:key-terms')];
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
      .toEqual(['round-1', 'game:key-terms', 'table:The five countries', 'round-2', 'fix']);
  });

  it('is only a warm-up on exam day, and nothing after the exam', () => {
    const exam = ids([], 0, 0, '2026-11-18');
    expect(exam.map((t) => t.id)).toEqual(['warm-up']);
    expect(dayFinished(ids([rec('today', 'warm-up', '2026-11-18')], 0, 0, '2026-11-18'))).toBe(true);
    expect(ids([], 0, 0, '2026-11-19')).toEqual([]);
    expect(dayFinished([])).toBe(false);
  });

  it('gives every task a tip on how to do it well', () => {
    for (const t of ids([], 20, 2)) expect(t.tip.length).toBeGreaterThan(20);
  });
});
