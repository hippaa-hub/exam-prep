import { describe, expect, it } from 'vitest';
import { choice } from '../content/build';
import type { Pack } from '../content/types';
import { conceptsOf, itemsOf } from '../content/types';
import type { SessionRecord } from './plan';
import { newProgress, type ProgressMap } from './progress';
import { packRing, ringValue } from './ring';

const pack: Pack = {
  id: 'p', subject: 's', title: 't', date: '2026-11-19', criteria: [],
  topics: [{ id: 'A', title: 'A', short: 'A', items: [1, 2, 3, 4].map((n) => choice(`q${n}`, `Question ${n}`, 'yes', ['no'])) }],
  plan: [],
};
const full: ProgressMap = Object.fromEntries(conceptsOf(itemsOf(pack)).map((c) => [c, { ...newProgress(), level: 3 as const }]));
const warmUp: SessionRecord = { date: '2026-11-19', kind: 'today', topics: [], asked: 8, firstTimeRight: 8, task: 'warm-up' };

describe('the ring', () => {
  it('keeps the last 5% for the exam-morning warm-up', () => {
    expect(ringValue(100, false)).toBe(95);
    expect(ringValue(97, false)).toBe(95);
    expect(ringValue(100, true)).toBe(100);
    expect(ringValue(96, true)).toBe(100);
    expect(ringValue(90, true)).toBe(95);
  });

  it('shows the plain score while it is below 95%', () => {
    expect(ringValue(0, false)).toBe(0);
    expect(ringValue(70, false)).toBe(70);
    expect(ringValue(94, false)).toBe(94);
  });

  it('is 95% with everything full, and 100% once the warm-up is done on exam day', () => {
    expect(packRing(pack, full, [])).toBe(95);
    expect(packRing(pack, full, [warmUp])).toBe(100);
    // A warm-up round on another day, or another task on exam day, is not the exam-morning warm-up.
    expect(packRing(pack, full, [{ ...warmUp, date: '2026-11-18' }])).toBe(95);
    expect(packRing(pack, full, [{ ...warmUp, task: 'round-1' }])).toBe(95);
    expect(packRing(pack, {}, [warmUp])).toBe(5);
  });
});
