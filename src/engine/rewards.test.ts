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
      sessions: [rec('2026-11-14'), rec('2026-11-15'), rec('2026-11-15', 'fix', 'fix'), rec('2026-11-16'), rec('2026-11-16', 'practice', 'game:key-terms')],
      daysDone: ['2026-11-14', '2026-11-15'],
      studyTime: { '2026-11-14': 900, '2026-11-15': 1000 },
      progress: right(['a-1', 'a-2', 'b-1', 'b-2'], ['2026-11-14', '2026-11-15']),
    };
    // Everything right on two days: the ring is at 67%, and nothing is fully learned yet.
    expect(earned(save)).toEqual([
      'first-round', 'five-rounds', 'time-30', 'day-done', 'two-done', 'three-days', 'flashcards', 'fixer', 'tried-half', 'tried-all', 'halfway',
    ]);
  });

  it('are earned for rounds, points, time, perfect rounds and what she has learned', () => {
    const days = ['2026-11-14', '2026-11-15', '2026-11-16'];
    const save: PackSave = {
      points: 240,
      sessions: Array.from({ length: 20 }, (_, i) => rec(days[i % 3], 'today', undefined, 10, i === 0 ? 10 : 8)),
      daysDone: days,
      studyTime: { '2026-11-14': 1300, '2026-11-15': 1300, '2026-11-16': 1300 },
      progress: { ...right(['a-1', 'a-2', 'b-1', 'b-2'], days), ...right(Array.from({ length: 12 }, (_, i) => `v-${i}`), ['2026-11-16']) },
      mockResults: { 'mock-1': { date: '2026-11-17', partA: [], partB: [] } as never },
    };
    expect(earned(save)).toEqual([
      'first-round', 'five-rounds', 'ten-rounds', 'twenty-rounds', 'points-100', 'time-30', 'time-60',
      'day-done', 'two-done', 'three-done', 'three-days',
      'perfect-round', 'glossary', 'mock',
      'tried-half', 'tried-all', 'first-learned', 'halfway', 'topic-ready', 'key-terms', 'ready',
    ]);
    // Four things in this small pack, so "Ten learned" is still ahead; a short round is not a perfect round.
    expect(earned(save)).not.toContain('ten-learned');
    expect(earned({ ...empty, sessions: [rec('2026-11-14', 'today', undefined, 3, 3)] })).not.toContain('perfect-round');
  });

  it('give the table badge only for a table with no mistakes', () => {
    const withTable: Pack = { ...pack, topics: [...pack.topics, { id: 'T', title: 'T', short: 'T', items: [
      { id: 't-1', type: 'table', group: 'G', rowHeader: 'r', columns: ['c'], cells: [{ options: ['x', 'y'], answer: 0 }], prompt: 'Fill in the row: r' },
    ] }] };
    const got = (s: PackSave, id = 'table-perfect') => badgesFor(withTable, s).find((b) => b.id === id)?.earned;
    const withMistake = { ...empty, sessions: [rec('2026-11-15', 'practice', 'table:G', 5, 4)] };
    expect(got(withMistake)).toBe(false);
    expect(got(withMistake, 'table')).toBe(true); // filling it at all earns the first table badge
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
