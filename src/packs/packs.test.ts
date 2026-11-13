// Checks every exam pack for slips: duplicate ids, answers that are not an option, plans that point nowhere.
import { describe, expect, it } from 'vitest';
import { conceptOf, conceptsOf, examplesFor, gameOf, itemsOf, simpleWords } from '../content/types';
import { explainChoice } from '../engine/explain';
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

  it('can say why every right answer is right and why every wrong choice is wrong', () => {
    const missing: string[] = [];
    for (const it of items) {
      if (it.type !== 'choice' && it.type !== 'pair') continue;
      const right = explainChoice(pack, it);
      if (right.whyRight.length < 15) missing.push(`${it.id}: no reason for the right answer "${right.correct}"`);
      it.options.forEach((option, i) => {
        if (i === it.answer) return;
        const e = explainChoice(pack, it, option);
        if (!e.whyNot || e.whyNot.length < 15) missing.push(`${it.id}: no reason why not "${option}"`);
      });
      // A reason must be attached to an option that exists.
      for (const key of Object.keys(it.whyNot ?? {})) {
        if (!it.options.includes(key) || key === it.options[it.answer]) missing.push(`${it.id}: reason for an option that is not a wrong answer: "${key}"`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('has an explanation in simple words for every question', () => {
    const without = items.filter((it) => !simpleWords(pack, it)).map((it) => it.id);
    expect(without).toEqual([]);
    // Every key points at a real question or thing to know.
    const known = new Set([...items.map((i) => i.id), ...conceptsOf(items)]);
    expect(Object.keys(pack.simple ?? {}).filter((k) => !known.has(k))).toEqual([]);
  });

  it('gives a few short examples for every definition', () => {
    // Every key term has one plain sentence and two to four short examples.
    for (const it of items) {
      if (it.type !== 'term') continue;
      expect(simpleWords(pack, it)?.split(/(?<=[.!?])\s+/).length, it.id).toBe(1);
      expect(examplesFor(pack, it)?.length ?? 0, it.id).toBeGreaterThanOrEqual(2);
    }
    // So does every other thing to know, except the five countries, which are examples themselves.
    const topicOf = (c: string) => pack.topics.find((t) => t.items.some((i) => conceptOf(i) === c))!.id;
    for (const c of conceptsOf(items)) {
      if (topicOf(c) === 'S4') continue;
      expect(pack.examples?.[c]?.length ?? 0, c).toBeGreaterThanOrEqual(1);
    }
    for (const [key, list] of Object.entries(pack.examples ?? {})) {
      expect(list.length, key).toBeLessThanOrEqual(4);
      for (const e of list) expect(e.length, e).toBeLessThanOrEqual(64);
    }
    const known = new Set([...items.map((i) => i.id), ...conceptsOf(items)]);
    expect(Object.keys(pack.examples ?? {}).filter((k) => !known.has(k))).toEqual([]);
  });

  it('keeps explanations short enough for a Grade 7 reader', () => {
    const texts = [...Object.values(pack.meanings ?? {}), ...Object.values(pack.simple ?? {}), ...items.flatMap((it) => (it.type === 'choice' || it.type === 'pair' ? Object.values(it.whyNot ?? {}) : []))];
    for (const t of texts) {
      expect(t.length, t).toBeLessThanOrEqual(190);
      // No sentence longer than 26 words.
      for (const sentence of t.split(/(?<=[.!?])\s+/)) expect(sentence.split(/\s+/).length, sentence).toBeLessThanOrEqual(26);
    }
  });

  it('has written questions with key ideas the app can look for', () => {
    const shorts = items.filter((i) => i.type === 'short');
    expect(shorts.length).toBeGreaterThanOrEqual(15);
    for (const it of shorts) {
      if (it.type !== 'short') continue;
      expect(it.ideas.length, it.id).toBeGreaterThanOrEqual(2);
      for (const idea of it.ideas) expect(idea.words.length, `${it.id}: ${idea.label}`).toBeGreaterThanOrEqual(1);
      if (it.need !== undefined) expect(it.need, it.id).toBeLessThan(it.ideas.length);
      expect(it.model.length, it.id).toBeGreaterThan(30);
      // A written question is one more wording of a thing she also meets in quick questions.
      expect(items.some((o) => o.type !== 'short' && conceptOf(o) === conceptOf(it)), it.id).toBe(true);
    }
    for (const it of items) if (it.type === 'term') expect(it.ideas?.length ?? 0, it.id).toBeGreaterThanOrEqual(2);
  });

  it('has mock exams and arguments that point at real questions', () => {
    const ids = new Set(items.filter((i) => i.type === 'short').map((i) => i.id));
    const args = new Set((pack.arguments ?? []).map((a) => a.id));
    expect(pack.arguments?.length).toBe(6);
    expect(pack.mocks?.length).toBe(2);
    for (const m of pack.mocks ?? []) {
      expect(m.partA.length, m.id).toBe(6);
      expect(m.partB.length, m.id).toBe(2);
      for (const id of m.partA) expect(ids.has(id), `${m.id}: ${id}`).toBe(true);
      for (const id of m.partB) expect(args.has(id), `${m.id}: ${id}`).toBe(true);
    }
    // The two papers do not repeat each other.
    const [a, b] = pack.mocks ?? [];
    expect([...a.partA, ...a.partB].filter((id) => [...b.partA, ...b.partB].includes(id))).toEqual([]);
    const planned = pack.plan.find((d) => d.mock)?.mock;
    expect(pack.mocks?.some((m) => m.id === planned)).toBe(true);
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
