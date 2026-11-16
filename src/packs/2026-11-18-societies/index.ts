// Exam pack: Individuals & Societies, "How Are Societies Governed?", 18 November 2026.
// Every question comes from IS_STUDIED.md (the teacher's slides, glossary and revision list).
import type { Pack, Topic } from '../../content/types';
import { argumentQuestions, mocks } from './arguments';
import { g1 } from './g1';
import { g2 } from './g2';
import { g3 } from './g3';
import { g4 } from './g4';
import { glossary, glossaryExamples, glossaryLast, glossarySimple } from './glossary';
import { s1 } from './s1';
import { s2 } from './s2';
import { s3 } from './s3';
import { s4 } from './s4';
import { s5 } from './s5';
import { examples, meanings, simple, whyNot } from './why';
import { written } from './written';

/** Adds a topic's written questions to its other questions, and the reasons why wrong answers are wrong. */
const withWritten = (t: Topic): Topic => ({
  ...t,
  items: [...t.items, ...(written[t.id] ?? [])].map((it) =>
    ((it.type === 'choice' || it.type === 'pair') && whyNot[it.id] ? { ...it, whyNot: whyNot[it.id] } : it)),
});

export const pack: Pack = {
  id: '2026-11-18-societies',
  subject: 'Individuals & Societies',
  title: 'How Are Societies Governed?',
  date: '2026-11-18',
  criteria: ['A: knowing and understanding', 'D: thinking critically'],
  topics: [g1, g2, g3, g4, s1, s2, s3, s4, s5].map(withWritten),
  meanings,
  simple: { ...simple, ...glossarySimple },
  examples: { ...examples, ...glossaryExamples },
  glossary,
  glossaryLast,
  // Added on 17 Nov after checking both decks slide by slide: the last day's round asks these first.
  lateAdditions: [
    'g2-pa-q-judge', 'g2-pa-q-fear', 'g2-rl-q-levels',
    'g3-fn-six', 'g3-fn-laws', 'g3-fn-systems', 'g3-part-ways', 'g3-part-legit', 'g3-uf-fairness', 'g3-uf-made-of',
    'g4-why-stealing', 'g4-why-hospital',
    's1-q-succession', 's1-q-control',
    's2-q-referendum', 's2-q-initiative', 's2-q-rep-adv', 's2-q-rep-when', 's2-q-ruleoflaw', 's2-q-equal',
    's3-gk-why', 's4-q-japan-inherit', 's4-q-japan-symbol', 's4-q-japan-both', 's5-q-opposition', 's5-q-shape',
    'w-no-government',
  ],
  arguments: argumentQuestions,
  mocks,
  plan: [
    {
      day: -4, label: 'Key terms, why we need government, the four responsibilities', topics: ['G1', 'G3', 'G4'],
      extras: [{ kind: 'game', game: 'key-terms' }],
    },
    {
      day: -3, label: 'Monarchy, democracy, dictatorship and the five countries', topics: ['S1', 'S2', 'S3', 'S4'],
      extras: [{ kind: 'table', group: 'The five countries' }],
    },
    {
      day: -2, label: 'Confusing pairs, comparing the systems, and one argument', topics: ['G2', 'S5'],
      extras: [{ kind: 'game', game: 'this-or-that' }, { kind: 'argument' }],
    },
    {
      day: -1, label: 'Mock exam, then a mixed quiz of everything', mock: 'mock-1',
    },
  ],
  examTips: [
    {
      title: 'Part A: knowing and understanding',
      points: [
        'Write definitions in full sentences, and use the key terms accurately.',
        'When a question says "explain", give more than one reason.',
        'Add an example: an institution, a responsibility, or one of the five countries.',
        'Watch the confusing pairs: government and governance, power and authority, rules and laws.',
      ],
    },
    {
      title: 'Part B: thinking critically',
      points: [
        'Your teacher wants four things in an argument: one clear argument, one country example, one explanation of how power is distributed, and one alternative perspective.',
        'Take your evidence from the five countries: United Kingdom, Japan, Saudi Arabia, Switzerland, North Korea.',
        'Finish with a clear, logical conclusion.',
        "Remember your teacher's warning: a system does not automatically guarantee good government.",
      ],
    },
  ],
};
