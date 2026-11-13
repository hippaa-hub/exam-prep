import { describe, expect, it } from 'vitest';
import { idea } from '../content/build';
import { checkIdeas, closeness, hasEnoughWords, outcomeOfTicks, verdictSentence, wordsOf } from './check';

const gg = [
  idea('Government is WHO governs: the people and institutions', 'people', 'institutions', 'who'),
  idea('Governance is HOW governing happens: the process', 'process', 'how'),
];

describe('finding key ideas in a written answer', () => {
  it('finds ideas by their signal words', () => {
    const r = checkIdeas('Government is the people and institutions. Governance is the process of deciding.', gg);
    expect(r.found).toEqual([true, true]);
    expect(r.spelling).toEqual([]);
  });

  it('notices when an idea is missing', () => {
    expect(checkIdeas('Government is the people who rule the country.', gg).found).toEqual([true, false]);
    expect(checkIdeas('I do not know this one', gg).found).toEqual([false, false]);
  });

  it('ignores capitals and punctuation', () => {
    expect(checkIdeas('GOVERNMENT: People! Governance = Process.', gg).found).toEqual([true, true]);
    expect(wordsOf("It's the King's role.")).toEqual(['its', 'the', 'kings', 'role']);
  });

  it('accepts word endings', () => {
    const ideas = [idea('Citizens elect representatives', 'elect'), idea('It is inherited', 'inherit')];
    expect(checkIdeas('People elected them. The throne is inherited.', ideas).found).toEqual([true, true]);
  });

  it('accepts a spelling slip in a key term and shows the correct spelling', () => {
    const ideas = [idea('Institutions', 'institutions'), idea('Propaganda', 'propaganda')];
    const r = checkIdeas('The instutions use propoganda.', ideas);
    expect(r.found).toEqual([true, true]);
    expect(r.spelling).toEqual([{ typed: 'instutions', correct: 'institutions' }, { typed: 'propoganda', correct: 'propaganda' }]);
  });

  it('does not stretch short words into other words', () => {
    const ideas = [idea('A coup', 'coup'), idea('Laws', 'laws')];
    expect(checkIdeas('The soup was cold and the lads laughed.', ideas).found).toEqual([false, false]);
  });

  it('needs every word of a phrase', () => {
    const ideas = [idea('Free elections', 'free elections'), idea('Head of state', 'head of state')];
    expect(checkIdeas('They hold elections.', ideas).found).toEqual([false, false]);
    expect(checkIdeas('Elections that are free. The king is the head of the state.', ideas).found).toEqual([true, true]);
  });

  it('asks for a real attempt before anything is shown', () => {
    expect(hasEnoughWords('')).toBe(false);
    expect(hasEnoughWords('dont know')).toBe(false);
    expect(hasEnoughWords('It is the people')).toBe(true);
  });
});

describe('marking with her own ticks', () => {
  const two = { ideas: gg };
  const pickTwo = { ideas: [idea('a', 'a'), idea('b', 'b'), idea('c', 'c'), idea('d', 'd')], need: 2 };

  it('is right when every idea is ticked', () => {
    expect(outcomeOfTicks(two, [true, true])).toBe('right');
  });
  it('is "almost" with at least half, and not yet with less', () => {
    expect(outcomeOfTicks(two, [true, false])).toBe('almost');
    expect(outcomeOfTicks(two, [false, false])).toBe('wrong');
  });
  it('can need only some of a longer list of ideas', () => {
    expect(outcomeOfTicks(pickTwo, [true, false, true, false])).toBe('right');
    expect(outcomeOfTicks(pickTwo, [false, false, false, true])).toBe('almost');
    expect(outcomeOfTicks(pickTwo, [false, false, false, false])).toBe('wrong');
  });
});

describe('how close she was', () => {
  const two = { ideas: gg };
  const pickTwo = { ideas: [idea('a', 'a'), idea('b', 'b'), idea('c', 'c'), idea('d', 'd')], need: 2 };

  it('counts the key ideas she had out of the ones needed', () => {
    expect(closeness(two, [true, false])).toEqual({ have: 1, need: 2, percent: 50 });
    expect(closeness(two, [true, true])).toEqual({ have: 2, need: 2, percent: 100 });
    expect(closeness(two, [false, false])).toEqual({ have: 0, need: 2, percent: 0 });
    expect(closeness(pickTwo, [true, true, true, false])).toEqual({ have: 2, need: 2, percent: 100 }); // extra ideas do not go over
  });

  it('says the verdict in one of three ways', () => {
    expect(verdictSentence(two, [true, true])).toBe('Correct! You had the key ideas.');
    expect(verdictSentence(two, [true, false])).toBe('Almost! You had 1 of the 2 key ideas.');
    expect(verdictSentence(two, [false, false])).toBe('Not yet. You had 0 of the 2 key ideas.');
  });
});
