// A maths pack never repeats the exact question she missed: it comes back as the same idea with new numbers.
import { describe, expect, it } from 'vitest';
import { conceptOf, itemsOf } from '../content/types';
import { packs } from '../packs';
import { applyAnswer, mistakeIds } from './progress';
import { answerRun, currentId, originOf, startRun, summarise } from './session';
import { learnTaskId, tasksFor } from './tasks';
import { planFor } from './plan';

const algebra = packs.find((p) => p.id === '2026-11-27-algebra')!;

describe('different numbers after a miss', () => {
  it('re-asks a replacement in the same session, counted as the same question', () => {
    let run = startRun(['a3-p-1', 'a3-n-1', 'a3-t-1', 'a3-s-1', 'a3-l-1']);
    run = answerRun(run, 'wrong', true, 'a3-p-2');
    expect(run.queue).toContain('a3-p-2');
    expect(run.queue.filter((id) => id === 'a3-p-1')).toHaveLength(1);
    while (currentId(run) !== 'a3-p-2') run = answerRun(run, 'right');
    expect(originOf(run, 'a3-p-2')).toBe('a3-p-1');
    while (currentId(run) !== undefined) run = answerRun(run, 'right');
    const s = summarise(run);
    expect(s.asked).toBe(5);
    expect(s.missed).toEqual(['a3-p-1']);
  });

  it('puts a different version of a missed question in Fix My Mistakes', () => {
    const p = applyAnswer(undefined, 'wrong', '2026-11-24', 'a3-p-1');
    const ids = mistakeIds(algebra, { 'a3-product-rule': { ...p, recent: ['a3-p-1'] } });
    expect(ids).toHaveLength(1);
    expect(ids[0]).not.toBe('a3-p-1');
    expect(conceptOf(itemsOf(algebra).find((i) => i.id === ids[0])!)).toBe('a3-product-rule');
  });
});

describe('Show me how', () => {
  it('counts a right answer with help as level 1 at most, and does not clear a mistake', () => {
    const once = applyAnswer(undefined, 'right', '2026-11-24', 'a3-p-1', true, false, true);
    expect(once.level).toBe(1);
    const later = applyAnswer(once, 'right', '2026-11-25', 'a3-p-2', true, false, true);
    expect(later.level).toBe(1);
    const missed = applyAnswer(undefined, 'wrong', '2026-11-24', 'a3-p-1');
    expect(applyAnswer(missed, 'right', '2026-11-24', 'a3-p-2', true, false, true).fix).toBe(0);
  });
});

describe('the catch-up day', () => {
  it('starts with the missed lesson, then like terms, then the rounds', () => {
    const plan = planFor(algebra, [], '2026-11-24');
    const tasks = tasksFor(plan, [], '2026-11-24', 20, 0, 0, 0, 35, (t) => ({ title: `Learn ${t}`, detail: '', tip: '' }));
    expect(tasks.map((t) => t.id)).toEqual([learnTaskId('A3'), learnTaskId('A1'), 'round-1', 'round-2', 'fix']);
    const after = tasksFor(plan, [{ date: '2026-11-24', kind: 'practice', topics: [], asked: 8, firstTimeRight: 5, task: learnTaskId('A3') }],
      '2026-11-24', 20, 0, 0, 0, 35, (t) => ({ title: t, detail: '', tip: '' }));
    expect(after[0].done).toBe(true);
    expect(after[1].done).toBe(false);
  });
});
