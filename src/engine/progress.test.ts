import { describe, expect, it } from 'vitest';
import { choice } from '../content/build';
import type { Pack } from '../content/types';
import { applyAnswer, isDue, isTopicReady, mistakeIds, packReadiness, readiness, seenCount, topicReadiness, weakest } from './progress';

const items = [1, 2, 3, 4].map((n) => choice(`q${n}`, `Question ${n}`, 'yes', ['no']));
const pack: Pack = {
  id: 'p', subject: 's', title: 't', date: '2026-11-18', criteria: [],
  topics: [{ id: 'A', title: 'A', short: 'A', items: items.slice(0, 2) }, { id: 'B', title: 'B', short: 'B', items: items.slice(2) }],
  plan: [],
};

describe('item levels', () => {
  it('starts at level 0 and reaches level 1 after one right answer', () => {
    const p = applyAnswer(undefined, 'right', '2026-11-14');
    expect(p.level).toBe(1);
    expect(p.seen).toBe(1);
  });

  it('does not go up twice on the same day', () => {
    let p = applyAnswer(undefined, 'right', '2026-11-14');
    p = applyAnswer(p, 'right', '2026-11-14');
    expect(p.level).toBe(1);
  });

  it('needs three different days to reach level 3, and stops there', () => {
    let p = applyAnswer(undefined, 'right', '2026-11-14');
    p = applyAnswer(p, 'right', '2026-11-15');
    expect(p.level).toBe(2);
    p = applyAnswer(p, 'right', '2026-11-16');
    expect(p.level).toBe(3);
    p = applyAnswer(p, 'right', '2026-11-17');
    expect(p.level).toBe(3);
  });

  it('goes back to level 0 after a wrong answer and joins the mistakes list', () => {
    let p = applyAnswer(undefined, 'right', '2026-11-14');
    p = applyAnswer(p, 'right', '2026-11-15');
    p = applyAnswer(p, 'wrong', '2026-11-16');
    expect(p.level).toBe(0);
    expect(p.correctDays).toEqual([]);
    expect(p.fix).toBe(0);
  });

  it('leaves the mistakes list after being right twice', () => {
    let p = applyAnswer(undefined, 'wrong', '2026-11-14');
    p = applyAnswer(p, 'right', '2026-11-14');
    expect(p.fix).toBe(1);
    p = applyAnswer(p, 'right', '2026-11-14');
    expect(p.fix).toBeUndefined();
  });

  it('gives no credit for a repeat straight after a miss', () => {
    let p = applyAnswer(undefined, 'wrong', '2026-11-14', 'q');
    p = applyAnswer(p, 'right', '2026-11-14', 'q', false);
    expect(p.level).toBe(0);
    expect(p.fix).toBe(0);
    expect(p.seen).toBe(2);
    expect(isDue(p, '2026-11-14')).toBe(true);
  });

  it('starts the count again if a mistake is missed again', () => {
    let p = applyAnswer(undefined, 'wrong', '2026-11-14');
    p = applyAnswer(p, 'right', '2026-11-14');
    p = applyAnswer(p, 'wrong', '2026-11-14');
    expect(p.fix).toBe(0);
  });

  it('"almost" on a flashcard steps back one level without counting as a mistake', () => {
    let p = applyAnswer(undefined, 'right', '2026-11-14');
    p = applyAnswer(p, 'right', '2026-11-15');
    p = applyAnswer(p, 'almost', '2026-11-16');
    expect(p.level).toBe(1);
    expect(p.fix).toBeUndefined();
    p = applyAnswer(p, 'almost', '2026-11-16');
    p = applyAnswer(p, 'almost', '2026-11-16');
    expect(p.level).toBe(0);
  });
});

describe('readiness', () => {
  it('is 0% for a new pack', () => {
    expect(packReadiness(pack, {})).toBe(0);
  });

  it('is the average level as a percentage', () => {
    const progress = {
      q1: { level: 3 as const, correctDays: ['a', 'b', 'c'], seen: 3, recent: [] },
      q2: { level: 0 as const, correctDays: [], seen: 1, recent: [] },
    };
    expect(readiness(items.slice(0, 2), progress)).toBe(50);
    expect(packReadiness(pack, progress)).toBe(25);
    expect(topicReadiness(pack.topics[0], progress)).toBe(50);
    expect(topicReadiness(pack.topics[1], progress)).toBe(0);
  });

  it('calls a topic ready at 80%', () => {
    const at = (level: 0 | 1 | 2 | 3) => ({ level, correctDays: [], seen: 1, recent: [] });
    expect(isTopicReady(pack.topics[0], { q1: at(3), q2: at(2) })).toBe(true);   // 83%
    expect(isTopicReady(pack.topics[0], { q1: at(2), q2: at(2) })).toBe(false);  // 67%
  });

  it('lists open mistakes in pack order', () => {
    const progress = {
      q3: applyAnswer(undefined, 'wrong', '2026-11-14', 'q3'),
      q1: applyAnswer(undefined, 'wrong', '2026-11-14', 'q1'),
      q2: applyAnswer(undefined, 'right', '2026-11-14', 'q2'),
    };
    expect(mistakeIds(pack, progress)).toEqual(['q1', 'q3']);
  });

  it('picks the weakest items she has met for the warm-up', () => {
    const progress = {
      q1: applyAnswer(undefined, 'right', '2026-11-14'),
      q2: applyAnswer(undefined, 'wrong', '2026-11-14'),
      q4: applyAnswer(applyAnswer(undefined, 'wrong', '2026-11-14'), 'right', '2026-11-14'),
    };
    expect(weakest(pack, progress, 2)).toEqual(['q2', 'q3']);
    expect(weakest(pack, progress, 4)).toEqual(['q2', 'q3', 'q4', 'q1']);
  });
});

describe('things to know with several wordings', () => {
  // One concept ("power vs authority") asked three different ways, and one single question.
  const shared = ['a', 'b', 'c'].map((n) => ({ ...choice(`pa-${n}`, `Wording ${n}`, 'yes', ['no']), concept: 'pa' }));
  const single = choice('solo', 'On its own', 'yes', ['no']);
  const p2: Pack = { ...pack, topics: [{ id: 'T', title: 'T', short: 'T', items: [...shared, single] }] };

  it('counts readiness per thing to know, not per wording', () => {
    const progress = { pa: applyAnswer(applyAnswer(applyAnswer(undefined, 'right', 'd1', 'pa-a'), 'right', 'd2', 'pa-b'), 'right', 'd3', 'pa-c') };
    expect(progress.pa.level).toBe(3);
    expect(packReadiness(p2, progress)).toBe(50); // two things to know, one of them fully learned
    expect(seenCount(p2.topics[0].items, progress)).toBe(1);
  });

  it('remembers which wordings were asked most recently', () => {
    let p = applyAnswer(undefined, 'right', 'd1', 'pa-a');
    p = applyAnswer(p, 'right', 'd1', 'pa-b');
    p = applyAnswer(p, 'right', 'd2', 'pa-a');
    expect(p.recent).toEqual(['pa-b', 'pa-a']);
  });

  it('puts the exact question she missed on the Fix My Mistakes list', () => {
    const progress = { pa: applyAnswer(applyAnswer(undefined, 'right', 'd1', 'pa-a'), 'wrong', 'd1', 'pa-b') };
    expect(progress.pa.level).toBe(0);
    expect(mistakeIds(p2, progress)).toEqual(['pa-b']);
    const fixed = applyAnswer(applyAnswer(progress.pa, 'right', 'd1', 'pa-b'), 'right', 'd1', 'pa-b');
    expect(mistakeIds(p2, { pa: fixed })).toEqual([]);
    expect(fixed.fixItem).toBeUndefined();
  });

  it('knows what is still due today', () => {
    expect(isDue(undefined, 'd1')).toBe(true);
    const once = applyAnswer(undefined, 'right', 'd1', 'pa-a');
    expect(isDue(once, 'd1')).toBe(false); // right today already
    expect(isDue(once, 'd2')).toBe(true);
    const top = applyAnswer(applyAnswer(once, 'right', 'd2'), 'right', 'd3');
    expect(isDue(top, 'd4')).toBe(false); // fully learned
    expect(isDue(applyAnswer(once, 'wrong', 'd1', 'pa-a'), 'd1')).toBe(true);
  });
});
