import { describe, expect, it } from 'vitest';
import { choice, term } from '../content/build';
import type { Pack } from '../content/types';
import type { PackSave } from '../storage/db';
import { applyAnswer, type ProgressMap } from './progress';
import { badgesFor, newBadges } from './rewards';

const pack: Pack = {
  id: 'p', subject: 's', title: 't', date: '2026-11-18', criteria: [],
  topics: [
    { id: 'A', title: 'A', short: 'A', items: [term('a-1', 'One', 'First.'), term('a-2', 'Two', 'Second.')] },
    { id: 'B', title: 'B', short: 'B', items: [choice('b-1', 'q', 'yes', ['no']), choice('b-2', 'q', 'yes', ['no'])] },
  ],
  plan: [],
  mocks: [{ id: 'mock-1', title: 'Mock', minutes: 30, partA: [], partB: [] }],
  glossary: Array.from({ length: 14 }, (_, i) => term(`v-${i}`, `Word ${i}`, 'A definition.')),
};
const empty: PackSave = { progress: {}, sessions: [], points: 0 };
const earned = (save: PackSave) => badgesFor(pack, save).filter((b) => b.earned).map((b) => b.id);
const rec = (date: string, kind: 'today' | 'fix' | 'practice' = 'today', task?: string, asked = 10, right = 8) =>
  ({ date, kind, topics: [], asked, firstTimeRight: right, task });
const right = (ids: string[], days: string[]): ProgressMap =>
  Object.fromEntries(ids.map((id) => [id, days.reduce<ReturnType<typeof applyAnswer> | undefined>((p, d) => applyAnswer(p, 'right', d, id), undefined)!]));

describe('badges', () => {
  it('start with none earned, and only offer badges the pack can give', () => {
    expect(earned(empty)).toEqual([]);
    const ids = badgesFor(pack, empty).map((b) => b.id);
    expect(ids).toContain('mock');
    expect(ids).toContain('glossary');
    expect(ids).not.toContain('table-perfect'); // this pack has no tables
    expect(ids).not.toContain('argument');      // and no argument questions
    expect(badgesFor(pack, empty).every((b) => b.how.length > 0)).toBe(true);
  });

  it('count progress made before badges existed', () => {
    const save: PackSave = {
      points: 60,
      sessions: [rec('2026-11-14'), rec('2026-11-15'), rec('2026-11-15', 'fix', 'fix'), rec('2026-11-16')],
      daysDone: ['2026-11-14', '2026-11-15'],
      progress: right(['a-1', 'a-2', 'b-1', 'b-2'], ['2026-11-14', '2026-11-15']),
    };
    // Everything right on two days: the ring is at 67%.
    expect(earned(save)).toEqual(['first-round', 'day-done', 'three-days', 'fixer', 'halfway']);
  });

  it('are earned for topics, key terms, glossary words, the mock and the ring', () => {
    const days = ['2026-11-14', '2026-11-15', '2026-11-16'];
    const save: PackSave = {
      points: 0,
      sessions: [rec('2026-11-14')],
      daysDone: days,
      progress: { ...right(['a-1', 'a-2', 'b-1', 'b-2'], days), ...right(Array.from({ length: 12 }, (_, i) => `v-${i}`), ['2026-11-16']) },
      mockResults: { 'mock-1': { date: '2026-11-17', partA: [], partB: [] } as never },
    };
    expect(earned(save)).toEqual(['first-round', 'day-done', 'halfway', 'topic-ready', 'key-terms', 'glossary', 'mock', 'three-done', 'ready']);
  });

  it('give the table badge only for a table with no mistakes', () => {
    const withTable: Pack = { ...pack, topics: [...pack.topics, { id: 'T', title: 'T', short: 'T', items: [
      { id: 't-1', type: 'table', group: 'G', rowHeader: 'r', columns: ['c'], cells: [{ options: ['x', 'y'], answer: 0 }], prompt: 'Fill in the row: r' },
    ] }] };
    const got = (s: PackSave) => badgesFor(withTable, s).find((b) => b.id === 'table-perfect')?.earned;
    expect(got({ ...empty, sessions: [rec('2026-11-15', 'practice', 'table:G', 5, 4)] })).toBe(false);
    expect(got({ ...empty, sessions: [rec('2026-11-15', 'practice', 'table:G', 5, 5)] })).toBe(true);
  });

  it('announce each new badge once', () => {
    const save: PackSave = { ...empty, sessions: [rec('2026-11-14')], daysDone: ['2026-11-14'] };
    const all = badgesFor(pack, save);
    expect(newBadges(all).map((b) => b.id)).toEqual(['first-round', 'day-done']);
    expect(newBadges(all, ['first-round']).map((b) => b.id)).toEqual(['day-done']);
    expect(newBadges(all, ['first-round', 'day-done'])).toEqual([]);
  });
});
