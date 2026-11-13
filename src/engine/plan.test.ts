import { describe, expect, it } from 'vitest';
import { choice } from '../content/build';
import type { Pack } from '../content/types';
import { daysToGo, pastPacks, pickPack, planFor, type SessionRecord } from './plan';

const topic = (id: string) => ({ id, title: id, short: id, items: [choice(`${id}-1`, 'q', 'yes', ['no'])] });
const pack: Pack = {
  id: 'p', subject: 's', title: 't', date: '2026-11-18', criteria: [],
  topics: ['G1', 'G4', 'S1', 'S2', 'S3', 'S4', 'G2', 'S5'].map(topic),
  plan: [
    { day: -4, label: 'Key terms', topics: ['G1', 'G4'] },
    { day: -3, label: 'Systems', topics: ['S1', 'S2', 'S3', 'S4'] },
    { day: -2, label: 'Pairs', topics: ['G2', 'S5', 'D1'] },
    { day: -1, label: 'Mock', mock: 'mock-1' },
  ],
};
const done = (date: string, topics: string[]): SessionRecord => ({ date, kind: 'today', topics, asked: 14, firstTimeRight: 10 });

describe('countdown', () => {
  it('counts the days to the exam', () => {
    expect(daysToGo(pack, '2026-11-13')).toBe(5);
    expect(daysToGo(pack, '2026-11-18')).toBe(0);
    expect(daysToGo(pack, '2026-11-20')).toBe(-2);
  });
});

describe('plan for today', () => {
  it('follows the plan when no day is missed', () => {
    const sat = planFor(pack, [], '2026-11-14');
    expect(sat.phase).toBe('study');
    expect(sat.topics).toEqual(['G1', 'G4']);
    expect(sat.daysToGo).toBe(4);

    const sun = planFor(pack, [done('2026-11-14', ['G1', 'G4'])], '2026-11-15');
    expect(sun.topics).toEqual(['S1', 'S2', 'S3', 'S4']);
    expect(sun.catchUp).toEqual([]);
  });

  it('leaves out topics the pack does not have yet', () => {
    const mon = planFor(pack, [done('2026-11-14', ['G1', 'G4']), done('2026-11-15', ['S1', 'S2', 'S3', 'S4'])], '2026-11-16');
    expect(mon.topics).toEqual(['G2', 'S5']);
  });

  it('gives a head start before the plan begins', () => {
    const fri = planFor(pack, [], '2026-11-13');
    expect(fri.phase).toBe('early');
    expect(fri.topics).toEqual(['G1', 'G4']);
  });

  it('repeats the first day on its own date after a head start', () => {
    const sat = planFor(pack, [done('2026-11-13', ['G1', 'G4'])], '2026-11-14');
    expect(sat.topics).toEqual(['G1', 'G4']);
    expect(sat.catchUp).toEqual([]);
  });

  it('re-spreads the topics over the days left when a day is missed', () => {
    // Saturday missed. Sunday and Monday are left for study; Tuesday is the mock exam.
    const sun = planFor(pack, [], '2026-11-15');
    expect(sun.topics).toEqual(['G1', 'G4', 'S1', 'S2']);
    expect(sun.catchUp).toEqual(['G1', 'G4']);

    const mon = planFor(pack, [done('2026-11-15', sun.topics)], '2026-11-16');
    expect(mon.topics).toEqual(['S3', 'S4', 'G2', 'S5']);
    expect(mon.catchUp).toEqual(['S3', 'S4']);
  });

  it('puts everything on the last study day if two days are missed', () => {
    const mon = planFor(pack, [], '2026-11-16');
    expect(mon.topics).toEqual(['G1', 'G4', 'S1', 'S2', 'S3', 'S4', 'G2', 'S5']);
  });

  it('keeps today stable after the session is finished', () => {
    const before = planFor(pack, [], '2026-11-15');
    const after = planFor(pack, [done('2026-11-15', before.topics)], '2026-11-15');
    expect(after.topics).toEqual(before.topics);
    expect(after.doneToday).toBe(true);
    expect(before.doneToday).toBe(false);
  });

  it('goes straight to a mixed quiz and the mock exam with fewer than two days left', () => {
    const tue = planFor(pack, [], '2026-11-17');
    expect(tue.phase).toBe('last-day');
    expect(tue.topics).toEqual([]);
    expect(tue.mock).toBe('mock-1');
  });

  it('is a warm-up on exam day and a past exam afterwards', () => {
    expect(planFor(pack, [], '2026-11-18').phase).toBe('exam-day');
    expect(planFor(pack, [], '2026-11-19').phase).toBe('past');
  });

  it('ignores practice sessions when deciding what is covered', () => {
    const sun = planFor(pack, [{ date: '2026-11-14', kind: 'practice', topics: ['G1', 'G4'], asked: 5, firstTimeRight: 5 }], '2026-11-15');
    expect(sun.catchUp).toEqual(['G1', 'G4']);
  });
});

describe('choosing the exam pack', () => {
  const later: Pack = { ...pack, id: 'later', date: '2026-12-10' };
  it('shows the nearest upcoming exam', () => {
    expect(pickPack([later, pack], '2026-11-13')?.id).toBe('p');
    expect(pickPack([later, pack], '2026-11-18')?.id).toBe('p');
    expect(pickPack([later, pack], '2026-11-19')?.id).toBe('later');
  });
  it('falls back to the most recent past exam', () => {
    expect(pickPack([later, pack], '2027-01-01')?.id).toBe('later');
    expect(pastPacks([later, pack], '2026-11-19').map((p) => p.id)).toEqual(['p']);
  });
});
