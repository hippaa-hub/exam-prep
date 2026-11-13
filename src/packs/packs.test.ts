// Checks every exam pack for slips: duplicate ids, answers that are not an option, plans that point nowhere.
import { describe, expect, it } from 'vitest';
import { conceptOf, conceptsOf, gameOf, itemsOf } from '../content/types';
import { packs } from './index';

describe.each(packs.map((p) => [p.id, p] as const))('pack %s', (_id, pack) => {
  const items = itemsOf(pack);

  it('has unique item ids and topic ids', () => {
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
    expect(new Set(pack.topics.map((t) => t.id)).size).toBe(pack.topics.length);
  });

  it('has a valid exam date', () => {
    expect(pack.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('has answers that are among the options', () => {
    for (const it of items) {
      if (it.type === 'choice') {
        expect(it.options.length, it.id).toBeGreaterThanOrEqual(2);
        expect(it.answer, it.id).toBeGreaterThanOrEqual(0);
        expect(it.answer, it.id).toBeLessThan(it.options.length);
        expect(new Set(it.options).size, it.id).toBe(it.options.length);
      }
      if (it.type === 'pair') expect([0, 1], it.id).toContain(it.answer);
      if (it.type === 'match') expect(new Set(it.pairs.map((p) => p.right)).size, it.id).toBe(it.pairs.length);
      if (it.type === 'order') expect(new Set(it.steps).size, it.id).toBe(it.steps.length);
      if (it.type === 'table') {
        expect(it.cells.length, it.id).toBe(it.columns.length);
        for (const c of it.cells) expect(c.options[c.answer], it.id).toBeTruthy();
      }
      expect(it.prompt.trim().length, it.id).toBeGreaterThan(0);
    }
  });

  it('has every plan day on or before the exam, in order', () => {
    const days = pack.plan.map((d) => d.day);
    expect([...days].sort((a, b) => a - b)).toEqual(days);
    expect(Math.max(...days)).toBeLessThan(0);
  });

  it('schedules every topic that has questions', () => {
    const planned = new Set(pack.plan.flatMap((d) => d.topics ?? []));
    for (const t of pack.topics) expect(planned.has(t.id), t.id).toBe(true);
  });

  it('groups its questions into a number of things to know that fits a few days of revision', () => {
    const concepts = conceptsOf(items);
    expect(concepts.length).toBeGreaterThanOrEqual(30);
    expect(concepts.length).toBeLessThanOrEqual(50);
    // Every thing to know has more than one wording, and stays inside one topic.
    for (const c of concepts) {
      expect(items.filter((i) => conceptOf(i) === c).length, c).toBeGreaterThanOrEqual(2);
      expect(pack.topics.filter((t) => t.items.some((i) => conceptOf(i) === c)).length, c).toBe(1);
    }
  });

  it('has enough questions for each game', () => {
    const count = (g: string) => items.filter((i) => gameOf(i) === g).length;
    expect(count('key-terms')).toBeGreaterThanOrEqual(10);
    expect(count('this-or-that')).toBeGreaterThanOrEqual(20);
    expect(count('which-system')).toBeGreaterThanOrEqual(12);
    expect(count('which-responsibility')).toBeGreaterThanOrEqual(9);
    expect(count('tables')).toBeGreaterThanOrEqual(8);
  });
});
