// Checks the game worlds: every challenge counts for a real thing to know, every answer is possible,
// every picture exists, and every thing to know is played at least twice, in two different kinds of play.
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { challengesOf, type Challenge } from '../content/adventure';
import { conceptsOf, itemsOf } from '../content/types';
import { SPOTS } from '../ui/adventure/diagrams';
import { ChallengeView } from '../ui/adventure/challenges';
import { packs } from './index';
import { planFor } from '../engine/plan';
import { addDays } from '../engine/dates';

/** The pictures in public/img, found by Vite (no Node file access needed). */
const pictures = new Set(Object.keys(import.meta.glob('../../public/img/*.webp')).map((p) => p.replace(/^.*\//, '').replace(/\.webp$/, '')));
const img = (name: string) => pictures.has(name);

describe.each(packs.filter((p) => p.adventure).map((p) => [p.id, p] as const))('game worlds of %s', (_id, pack) => {
  const adv = pack.adventure!;
  const all: Challenge[] = adv.worlds.flatMap(challengesOf);
  const concepts = new Set(conceptsOf(itemsOf(pack)));

  it('has six worlds, each with three levels and a picture', () => {
    expect(adv.worlds).toHaveLength(6);
    expect(new Set(adv.worlds.map((w) => w.id)).size).toBe(6);
    for (const w of adv.worlds) {
      expect(w.levels.map((l) => l.stage), w.id).toEqual([1, 2, 3]);
      expect(img(w.img), w.img).toBe(true);
      expect(new Set(challengesOf(w).map((c) => c.id)).size, w.id).toBe(challengesOf(w).length);
    }
  });

  it('counts every challenge for a real thing to know', () => {
    for (const c of all) expect(concepts.has(c.concept), `${c.id}: ${c.concept}`).toBe(true);
  });

  it('plays every thing to know at least twice, in two different kinds of play', () => {
    const missing: string[] = [];
    for (const concept of concepts) {
      const mine = all.filter((c) => c.concept === concept);
      if (mine.length < 2 || new Set(mine.map((c) => c.kind)).size < 2) missing.push(`${concept}: ${mine.map((c) => c.kind).join(', ')}`);
    }
    expect(missing).toEqual([]);
  });

  it('is mostly hands-on: at least 70% of challenges are not plain multiple choice', () => {
    const picks = all.filter((c) => c.kind === 'pick').length;
    expect(1 - picks / all.length).toBeGreaterThanOrEqual(0.7);
  });

  it('has answers that are possible and explained', () => {
    for (const c of all) {
      expect(c.prompt.length, c.id).toBeGreaterThan(5);
      expect(c.why.length, c.id).toBeGreaterThan(10);
      expect(c.hint.length, c.id).toBeGreaterThan(10);
      if (c.photo) expect(img(c.photo), `${c.id}: ${c.photo}`).toBe(true);
      switch (c.kind) {
        case 'pick':
        case 'clues':
          expect(c.options, c.id).toContain(c.answer);
          for (const o of c.options) if (o !== c.answer) expect(c.whyNot[o], `${c.id}: why not "${o}"`).toBeTruthy();
          for (const k of Object.keys(c.whyNot)) expect(c.options, `${c.id}: reason for a missing option "${k}"`).toContain(k);
          break;
        case 'sort':
          for (const card of c.cards) expect(c.bins, `${c.id}: ${card.text}`).toContain(card.bin);
          expect(new Set(c.cards.map((x) => x.text)).size, c.id).toBe(c.cards.length);
          for (const b of c.bins) expect(c.cards.some((x) => x.bin === b), `${c.id}: empty box ${b}`).toBe(true);
          break;
        case 'order':
          expect(new Set(c.steps).size, c.id).toBe(c.steps.length);
          break;
        case 'match':
          expect(new Set(c.pairs.map((p) => p[0])).size, c.id).toBe(c.pairs.length);
          expect(new Set(c.pairs.map((p) => p[1])).size, c.id).toBe(c.pairs.length);
          break;
        case 'label':
          for (const s of c.spots) { expect(SPOTS[c.diagram][s], `${c.id}: ${s}`).toBeTruthy(); expect(adv.parts[s], s).toBeTruthy(); }
          break;
        case 'tap':
          expect(SPOTS[c.diagram][c.answer], c.id).toBeTruthy();
          break;
        case 'build':
          for (const p of c.offer) expect(adv.parts[p], `${c.id}: ${p}`).toBeTruthy();
          for (const r of Object.keys(c.reject)) expect(c.offer, c.id).toContain(r);
          break;
        case 'gate':
          expect(new Set(c.molecules.map((m) => m.name)).size, c.id).toBe(c.molecules.length);
          break;
        case 'dial':
          expect(c.eyepieces.some((e) => c.objectives.some((o) => e * o === c.target)), c.id).toBe(true);
          break;
        case 'spot':
          expect(c.lines[c.wrong], c.id).toBeTruthy();
          expect(c.fixes, c.id).toContain(c.fix);
          break;
      }
    }
  });

  it('is written in easy English: short sentences', () => {
    const long: string[] = [];
    const texts = all.flatMap((c) => [c.prompt, c.why, c.hint, c.story ?? '']);
    for (const t of [...texts, ...adv.worlds.flatMap((w) => [w.story, ...w.levels.map((l) => l.intro)])]) {
      for (const s of t.split(/(?<=[.!?])\s+/)) if (s.split(/\s+/).length > 22) long.push(s);
    }
    expect(long).toEqual([]);
  });

  it('puts the games in the plan, each world once', () => {
    const played = pack.plan.flatMap((d) => (d.extras ?? []).flatMap((e) => (e.kind === 'play' ? [e.world] : [])));
    expect([...played].sort()).toEqual(adv.worlds.map((w) => w.id).sort());
  });

  it('keeps the game in the tasks on a catch-up day', () => {
    // Nothing was done on the first study day: the next day catches up, and its tasks still include a game.
    const first = Math.min(...pack.plan.map((d) => d.day));
    const plan = planFor(pack, [], addDays(pack.date, first + 1));
    expect(plan.catchUp.length).toBeGreaterThan(0);
    expect(plan.extras.some((e) => e.kind === 'play')).toBe(true);
  });

  it('draws every challenge without an error', () => {
    for (const c of all) {
      const { unmount } = render(<ChallengeView ch={c} parts={adv.parts} onResult={() => {}} />);
      unmount();
    }
  });
});
