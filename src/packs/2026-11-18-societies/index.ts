// Exam pack: Individuals & Societies, "How Are Societies Governed?", 18 November 2026.
// Every question comes from IS_STUDIED.md (the teacher's slides, glossary and revision list).
import type { Pack } from '../../content/types';
import { g1 } from './g1';
import { g2 } from './g2';
import { g3 } from './g3';
import { g4 } from './g4';
import { s1 } from './s1';
import { s2 } from './s2';
import { s3 } from './s3';
import { s4 } from './s4';
import { s5 } from './s5';

export const pack: Pack = {
  id: '2026-11-18-societies',
  subject: 'Individuals & Societies',
  title: 'How Are Societies Governed?',
  date: '2026-11-18',
  criteria: ['A: knowing and understanding', 'D: thinking critically'],
  topics: [g1, g2, g3, g4, s1, s2, s3, s4, s5],
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
      day: -2, label: 'Confusing pairs and comparing the systems', topics: ['G2', 'S5', 'D1'],
      extras: [{ kind: 'game', game: 'this-or-that' }, { kind: 'table', group: 'The three systems' }],
    },
    {
      day: -1, label: 'Mixed quiz of everything', mock: 'mock-1',
      extras: [{ kind: 'table', group: 'The five countries' }],
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
