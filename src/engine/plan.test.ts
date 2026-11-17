import { describe, expect, it } from 'vitest';
import { choice } from '../content/build';
import type { Pack } from '../content/types';
import { packs } from '../packs';
import { daysToGo, isSprint, occasionFor, pastPacks, pickPack, planFor, warmUpDone, type SessionRecord } from './plan';

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
  mocks: [{ id: 'mock-1', title: 'Mock Exam 1', minutes: 35, partA: [], partB: [] }],
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

  describe('with a mixed day before the mock exam day', () => {
    // The exam moved one day: the three study days stay where they were, then a mixed day, then the mock.
    const longer: Pack = {
      ...pack, date: '2026-11-19',
      plan: [
        { day: -5, label: 'Key terms', topics: ['G1', 'G4'] },
        { day: -4, label: 'Systems', topics: ['S1', 'S2', 'S3', 'S4'] },
        { day: -3, label: 'Pairs', topics: ['G2', 'S5'] },
        { day: -2, label: 'A mixed round' },
        { day: -1, label: 'A mixed round, then the mock', mock: 'mock-1' },
      ],
    };
    const three = [done('2026-11-14', ['G1', 'G4']), done('2026-11-15', ['S1', 'S2', 'S3', 'S4']), done('2026-11-16', ['G2', 'S5'])];

    it('keeps the study days on their dates', () => {
      expect(planFor(longer, [], '2026-11-14').topics).toEqual(['G1', 'G4']);
      expect(planFor(longer, three.slice(0, 2), '2026-11-16').topics).toEqual(['G2', 'S5']);
    });

    it('is a mixed round of everything, with no mock exam', () => {
      const tue = planFor(longer, three, '2026-11-17');
      expect(tue.phase).toBe('mix');
      expect(tue.label).toBe('A mixed round');
      expect(tue.topics).toEqual([]);
      expect(tue.mock).toBeUndefined();
      expect(tue.daysToGo).toBe(2);
    });

    it('has the mock exam on the day after, the last one before the exam', () => {
      const wed = planFor(longer, three, '2026-11-18');
      expect(wed.phase).toBe('last-day');
      expect(wed.label).toBe('A mixed round, then the mock');
      expect(wed.mock).toBe('mock-1');
      expect(planFor(longer, three, '2026-11-19').phase).toBe('exam-day');
    });

    it('uses the mixed day to catch up when a study day was missed', () => {
      const tue = planFor(longer, three.slice(0, 2), '2026-11-17');
      expect(tue.phase).toBe('study');
      expect(tue.topics).toEqual(['G2', 'S5']);
      expect(tue.catchUp).toEqual(['G2', 'S5']);
    });
  });

  it('the Societies exam is on 19 November: mixed round on the 17th, Mock Exam on the 18th', () => {
    const societies = packs.find((p) => p.id === '2026-11-18-societies')!;
    const before = [
      done('2026-11-14', ['G1', 'G3', 'G4']), done('2026-11-15', ['S1', 'S2', 'S3', 'S4']), done('2026-11-16', ['G2', 'S5']),
    ];
    expect(societies.date).toBe('2026-11-19');
    expect(planFor(societies, [], '2026-11-14').topics).toEqual(['G1', 'G3', 'G4']);
    const tue = planFor(societies, before, '2026-11-17');
    expect([tue.phase, tue.mock, tue.daysToGo]).toEqual(['mix', undefined, 2]);
    const wed = planFor(societies, before, '2026-11-18');
    expect([wed.phase, wed.mock, wed.daysToGo]).toEqual(['last-day', 'mock-1', 1]);
    expect(planFor(societies, before, '2026-11-19').phase).toBe('exam-day');
  });

  it('does not offer a mock exam the pack does not have', () => {
    expect(planFor({ ...pack, mocks: [] }, [], '2026-11-17').mock).toBeUndefined();
  });

  it('is a warm-up on exam day and a past exam afterwards', () => {
    expect(planFor(pack, [], '2026-11-18').phase).toBe('exam-day');
    expect(planFor(pack, [], '2026-11-19').phase).toBe('past');
  });

  it('gives every round of the last day its own stamp, and every other day one stamp', () => {
    const tue = '2026-11-17';
    const last = planFor(pack, [], tue);
    expect(isSprint(last)).toBe(true);
    expect(occasionFor(last, [], tue)).toBe(tue);
    const one = [done(tue, [])];
    expect(occasionFor(last, one, tue)).toBe(`${tue}#2`);
    // Any finished session starts a new stamp: a round, Fix My Mistakes, a drill.
    const two: SessionRecord[] = [...one, { date: tue, kind: 'fix', topics: [], asked: 3, firstTimeRight: 3, task: 'fix' }];
    expect(occasionFor(last, two, tue)).toBe(`${tue}#3`);
    // Sessions of earlier days do not count.
    expect(occasionFor(last, [done('2026-11-16', [])], tue)).toBe(tue);
    // A study day and exam day keep the day as the stamp, however many rounds are done.
    const sat = planFor(pack, [], '2026-11-14');
    expect(isSprint(sat)).toBe(false);
    expect(occasionFor(sat, [done('2026-11-14', ['G1', 'G4'])], '2026-11-14')).toBe('2026-11-14');
    const exam = planFor(pack, [], '2026-11-18');
    expect(isSprint(exam)).toBe(false);
    expect(occasionFor(exam, [done('2026-11-18', [])], '2026-11-18')).toBe('2026-11-18');
  });

  it('knows when the exam-morning warm-up is done', () => {
    const warm: SessionRecord = { date: '2026-11-18', kind: 'today', topics: [], asked: 8, firstTimeRight: 7, task: 'warm-up' };
    expect(warmUpDone(pack, [])).toBe(false);
    expect(warmUpDone(pack, [warm])).toBe(true);
    expect(warmUpDone(pack, [{ ...warm, date: '2026-11-17' }])).toBe(false);
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
