import { describe, expect, it } from 'vitest';
import { choice, idea, short } from '../content/build';
import type { Item, MockExam, Pack } from '../content/types';
import { ARGUMENT_CHECKLIST } from '../content/types';
import { mockScore, nextArgument, outcomeOfMockAnswer, whatToFix, type MockResult } from './writing';

const q1 = short('w1', 'c1', 'Explain the difference between government and governance.',
  [idea('Government is who governs', 'people'), idea('Governance is how', 'process')], 'Model one, long enough to read.');
const q2 = short('w2', 'c2', 'Explain two ways a leader gains power.',
  [idea('Coup', 'coup'), idea('Revolution', 'revolution'), idea('Crisis', 'crisis')], 'Model two, long enough to read.', 2);
const items = new Map<string, Item>([q1, q2, choice('x', 'q', 'yes', ['no'])].map((it) => [it.id, it]));
const mock: MockExam = { id: 'm', title: 'Mock', minutes: 35, partA: ['w1', 'w2'], partB: ['d1'] };
const pack: Pack = {
  id: 'p', subject: 's', title: 't', date: '2026-11-18', criteria: [], plan: [],
  topics: [{ id: 'T', title: 'T', short: 'T', items: [...items.values()] }],
  arguments: [{ id: 'd1', prompt: 'Which system is fairest?', example: 'e' }, { id: 'd2', prompt: 'Second', example: 'e' }],
  mocks: [mock],
};
const all = ARGUMENT_CHECKLIST.map(() => true);

describe('the mock exam result', () => {
  const result: MockResult = {
    date: '2026-11-17', seconds: 1500,
    partA: [{ id: 'w1', text: 'people', ticks: [true, false] }, { id: 'w2', text: 'coup and crisis', ticks: [true, false, true] }],
    partB: [{ id: 'd1', boxes: ['a', 'b', 'c', 'd'], ticks: all.map((_, i) => i < 4) }],
  };

  it('marks Part A by her ticks against the key ideas', () => {
    expect(outcomeOfMockAnswer(items, result.partA[0])).toBe('almost');
    expect(outcomeOfMockAnswer(items, result.partA[1])).toBe('right'); // needs two of three
    expect(mockScore(result, items)).toEqual({ partARight: 1, partATotal: 2, partBTicks: 4, partBTotal: 6 });
  });

  it('says what to fix: the ideas and checklist points she did not tick', () => {
    const fixes = whatToFix(result, mock, pack, items);
    expect(fixes).toEqual([
      { question: q1.prompt, missing: ['Governance is how'] },
      { question: 'Which system is fairest?', missing: ARGUMENT_CHECKLIST.slice(4) },
    ]);
  });

  it('has nothing to fix after a full paper', () => {
    const full: MockResult = { ...result, partA: [{ id: 'w1', text: '', ticks: [true, true] }, result.partA[1]], partB: [{ ...result.partB[0], ticks: all }] };
    expect(whatToFix(full, mock, pack, items)).toEqual([]);
  });

  it('treats an empty answer as not yet', () => {
    expect(outcomeOfMockAnswer(items, { id: 'w1', text: '', ticks: [false, false] })).toBe('wrong');
  });
});

describe('the next Argument Builder question', () => {
  it('is one she has not written yet', () => {
    expect(nextArgument(pack, undefined)?.id).toBe('d1');
    expect(nextArgument(pack, { d1: { date: '2026-11-16', boxes: [], ticks: [] } })?.id).toBe('d2');
  });
  it('is the one written longest ago once all are written', () => {
    const writing = { d1: { date: '2026-11-17', boxes: [], ticks: [] }, d2: { date: '2026-11-16', boxes: [], ticks: [] } };
    expect(nextArgument(pack, writing)?.id).toBe('d2');
  });
});
