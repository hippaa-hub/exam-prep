import { describe, expect, it } from 'vitest';
import { packs } from '../packs';
import { readyVerdict } from './verdict';
import { learnTaskId } from './tasks';
import { conceptsOf, itemsOf } from '../content/types';

const algebra = packs.find((p) => p.id === '2026-11-27-algebra')!;

describe('the parent "Ready?" card', () => {
  it('starts with the missed lesson and the mock still to do', () => {
    const v = readyVerdict(algebra, {}, [], 0, 0, {});
    expect(v.level).toBe('not-yet');
    expect(v.todo[0]).toMatch(/lesson she missed/);
    expect(v.todo.some((t) => /Mock Test/.test(t))).toBe(true);
  });

  it('says ready once every lesson, topic and the mock are done', () => {
    const full = Object.fromEntries(conceptsOf(itemsOf(algebra)).map((c) => [c, { level: 3 as const, correctDays: ['a', 'b', 'c'], seen: 3, recent: [] }]));
    const sessions = (algebra.lessons ?? []).map((l) => ({ date: '2026-11-24', kind: 'practice' as const, topics: [], asked: 1, firstTimeRight: 1, task: learnTaskId(l.topic) }));
    const mock = { date: '2026-11-26', seconds: 1, part1: [], inv: { table: [], describe: '', rule: '', test: null, which: null, justify: '' }, describeTicks: [], justifyTicks: [], bTicks: [], cTicks: [], b: '7–8', c: '7–8' };
    const v = readyVerdict(algebra, full, sessions, 95, 0, { 'mock-1': mock });
    expect(v.level).toBe('ready');
    expect(v.todo).toEqual([]);
  });
});
