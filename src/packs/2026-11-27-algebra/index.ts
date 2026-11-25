// Exam pack: Mathematics, "Patterns and Algebraic Expressions", formative assessment on Friday 27 November 2026.
// 45 minutes, marked on Criterion B (investigating patterns) and Criterion C (communicating).
// Content comes only from the teacher's lessons and homework (MATHS_ALGEBRA_TEST_APP.md, Part D).
// Phase 1 (24 Nov): the lesson Adele missed (A3, multiplying terms) and like terms (A1).
// Phase 2 (24 Nov, evening): sequences (P1), substitution (P4), patterns and rules (PR),
// real-life rules, investigations and explaining (IN).
import type { Pack } from '../../content/types';
import { a1 } from './a1';
import { a3 } from './a3';
import { inv } from './inv';
import { mocks } from './mocks';
import { toolkit } from './toolkit';
import { lessonA1, lessonA3, lessonIN, lessonP1, lessonP4, lessonPR } from './lessons';
import { p1 } from './p1';
import { p4 } from './p4';
import { pr } from './pr';

/** One plain sentence for each thing to know. */
const simple: Record<string, string> = {
  'a3-basic': 'Multiply the numbers, then write the letters together in alphabetical order.',
  'a3-signs': 'Signs, then numbers, then letters: count the minus signs, even gives +, odd gives −.',
  'a3-same-letter': 'The same letter twice makes a square: x × x = x².',
  'a3-product-rule': 'Same letter: add the powers. x³ × x² = x³⁺² = x⁵.',
  'a3-coef-powers': 'Multiply the numbers in front, then add the powers of each letter.',
  'a3-diff-bases': 'Different letters keep their own powers: x² × y³ = x²y³.',
  'a3-big-terms': 'Signs, then numbers, then one letter at a time, adding its powers.',
  'a3-square': 'A power outside a bracket applies to everything inside: (3x)² = 3x × 3x = 9x².',
  'a3-area': 'Area of a rectangle = length × width, so you multiply the two terms.',
  'a3-add-vs-mul': 'Adding counts how many x\'s (2x + 3x = 5x); multiplying gives x² (2x × 3x = 6x²).',
  'a1-parts': 'The coefficient is the number in front (with its sign); the exponent is the small power; signs split the terms.',
  'a1-collect': 'Group each kind of term, then add or subtract only the numbers in front.',
  'a1-like': 'Like terms have the same letters with the same powers; the numbers can differ.',
  'a1-collect-powers': 'x² terms and x terms are different kinds: collect each kind on its own.',
  'a1-why-like': 'Only like terms can be added, and adding never changes the power.',
  'p1-arithmetic': 'Arithmetic: the same number is added (or subtracted) every time.',
  'p1-geometric': 'Geometric: every term is multiplied by the same number.',
  'p1-neither': 'Neither: the difference changes and there is no fixed ratio, so look at how the increase grows.',
  'p1-evidence': 'Common difference: subtract; common ratio: divide. Give evidence: show the differences or the ratios, not just "it goes up".',
  'p4-negative': 'Put a negative number in brackets, then multiply before you add.',
  'p4-square': 'Square first: (−3)² = 9, and a minus in front of the square stays.',
  'p4-table': 'Put each x in brackets into the rule, one at a time.',
  'p4-why': 'Brackets keep the minus sign with its number, so the answer stays right.',
  'pr-matchsticks': 'Each new square shares a side, so it adds only 3 sticks: m = 3n + 1.',
  'pr-tiles': 'Four arms grow by one tile each, around one centre tile: t = 4n + 1.',
  'pr-toothpicks': 'Each new triangle shares a side, so it adds only 2 toothpicks: t = 2n + 1.',
  'pr-dots': 'Dot triangles are not arithmetic: the increase grows each time (+2, +3, +4…).',
  'pr-rule': 'The number in front of n is the common difference; then fix the start.',
  'pr-rule-picture': 'Count what is new in each figure: that number goes in front of n.',
  'pr-use-rule': 'Use the rule to jump to a far term, or set it equal to N to find which term.',
  'pr-meaning': 'In y = 4x + 2, the 4 is the common difference and the 2 is the extra start amount.',
  'in-use-rule': 'Substitute the number into the real-life rule.',
  'in-find-rule': 'The amount added each time goes in front of the letter; then fix the start.',
  'in-meaning': 'Say what every number in the rule represents in the real situation.',
  'in-explain': 'Find, table, rule, test, justify. Then give an answer plus a mathematical reason.',
};

/** A few short examples for each thing to know. */
const examples: Record<string, string[]> = {
  'a3-basic': ['2x × 3 = 6x', '4m × 2n = 8mn'],
  'a3-signs': ['(−5x)(−3y) = 15xy', '2p × (−4q) × 3r = −24pqr'],
  'a3-same-letter': ['−2p × −7p = 14p²', '5y × 3y = 15y²'],
  'a3-product-rule': ['x² × x³ = x⁵', 'x⁴ × x = x⁵'],
  'a3-coef-powers': ['3x² × 2x³ = 6x⁵', '(−2a²)(4a³) = −8a⁵'],
  'a3-diff-bases': ['x² × y³ = x²y³', '2a³ × 5b² = 10a³b²'],
  'a3-big-terms': ['(3x²y)(−2xy³) = −6x³y⁴', '(−3mn)(−2m²n³) = 6m³n⁴'],
  'a3-square': ['(3x)² = 9x²', '(−3a)² = 9a²', '3x² = 3 × x × x'],
  'a3-area': ['3x by 4x: area 12x² cm²', '5a by 2a: area 10a²'],
  'a3-add-vs-mul': ['2x + 3x = 5x', '2x × 3x = 6x²'],
  'a1-parts': ['−4 in −4x²', '2 in x²', '2x − 3y + 1 has 3 terms'],
  'a1-collect': ['4m − 2m + m = 3m', '5x + 4y + 2x − y = 7x + 3y'],
  'a1-like': ['3a and −8a: like', '2x² and 5x: unlike', '4xy and −3yx: like'],
  'a1-collect-powers': ['6q² − 2q + 3q² = 9q² − 2q', '4m² + 3m − m² − 5m = 3m² − 2m'],
  'a1-why-like': ['4x² + 3x stays as it is', '3p + 2p = 5p'],
  'p1-arithmetic': ['5, 9, 13, 17: +4', '20, 17, 14, 11: −3'],
  'p1-geometric': ['3, 6, 12, 24: ×2', '81, 27, 9: ÷3'],
  'p1-neither': ['1, 3, 6, 10: +2, +3, +4', '1, 4, 9, 16: +3, +5, +7'],
  'p1-evidence': ['+1, +2, +3: not arithmetic', '7 ÷ 4 ≠ 2: not geometric'],
  'p4-negative': ['a = −3: 2(−3) + 5 = −1', 'x = −2: 3(−2) + 1 = −5'],
  'p4-square': ['(−3)² = 9', '−3² = −9', '1 − (−3)² = −8'],
  'p4-table': ['y = 4 − 2x: 8, 6, 4, 2, 0 for x = −2 to 2'],
  'p4-why': ['3(−2) + 1 = −5', '3 − 2 + 1 = 2 (wrong)'],
  'pr-matchsticks': ['4, 7, 10, 13', 'Figure 8: 25 sticks'],
  'pr-tiles': ['5, 9, 13', 'Stage 12: 49 tiles'],
  'pr-toothpicks': ['3, 5, 7', 'Figure 15: 31'],
  'pr-dots': ['Triangles: 1, 3, 6, 10, 15, 21', 'Increases: +2, +3, +4, +5, +6'],
  'pr-rule': ['3, 7, 11, 15 → 4n − 1', '6, 10, 14, 18 → 4n + 2'],
  'pr-rule-picture': ['Matchsticks: 3n + 1', 'Tile cross: 4n + 1'],
  'pr-use-rule': ['20th term of 3, 7, 11: 79', '4n + 2 = 62 → n = 15'],
  'pr-meaning': ['y = 4x + 2: start 6, add 4', 'y = 12 − 3x: start 9, subtract 3'],
  'in-use-rule': ['y = 3x + 2, x = 10 → 32', '3x + 5 = 50 → x = 15'],
  'in-find-rule': ['12, 15, 18 seats → 3n + 9'],
  'in-meaning': ['y = 3x + 5: 3 per ticket, 5 booking fee'],
  'in-explain': ['"Each new figure adds 3 sticks…"'],
};

export const pack: Pack = {
  id: '2026-11-27-algebra',
  subject: 'Mathematics',
  title: 'Patterns and Algebraic Expressions',
  date: '2026-11-27',
  criteria: ['B: investigating patterns', 'C: communicating'],
  topics: [a3, a1, p1, p4, pr, inv],
  lessons: [lessonA3, lessonA1, lessonP1, lessonP4, lessonPR, lessonIN],
  catchUp: 'A3',
  freshNumbers: true,
  mocks,
  toolkit,
  examMorning: {
    title: 'Before you go: the investigation steps',
    points: [
      '1. Find and describe what changes.',
      '2. Organise the values in a table.',
      '3. Form a general rule (say what n stands for).',
      '4. Test your rule on another term.',
      '5. Justify it: link each number in the rule to the pattern.',
      'Show every step. An answer + a mathematical reason. Good luck! 🍀',
    ],
  },
  sizes: { round: 20, lastDay: 25 },


  // Things to know that were merged on 24 Nov (evening), so the ring can be filled in three days.
  // Progress saved under the old names carries over.
  conceptAliases: {
    'a3-number': 'a3-basic', 'a3-two-letters': 'a3-basic', 'a3-why-add': 'a3-product-rule', 'a3-three-factors': 'a3-big-terms',
    'a3-method': 'a3-signs', 'a1-coefficient': 'a1-parts', 'a1-exponent': 'a1-parts', 'a1-terms': 'a1-parts',
    'a1-collect-one': 'a1-collect', 'a1-collect-two': 'a1-collect',
  },
  simple,
  examples,
  plan: [
    {
      day: -3, label: 'Catch up on the lesson you missed (multiplying terms), then like terms', topics: ['A3', 'A1'],
      extras: [{ kind: 'learn', topic: 'A3' }, { kind: 'learn', topic: 'A1' }],
    },
    {
      day: -2, label: 'Sequences, negative numbers, and patterns to rules', topics: ['P1', 'P4', 'PR'],
      extras: [{ kind: 'learn', topic: 'P1' }, { kind: 'learn', topic: 'P4' }, { kind: 'learn', topic: 'PR' }],
    },
    {
      day: -1, label: 'Investigations and explaining, then the Mock Test', topics: ['IN'],
      extras: [{ kind: 'learn', topic: 'IN' }], mock: 'mock-1',
    },
  ],
  examTips: [
    {
      title: 'Criterion B: investigating patterns',
      points: [
        'Find and describe what changes, then organise the values in a table.',
        'Form a general rule, then TEST it on another term.',
        'Justify it: say what each number in your rule means in the pattern.',
      ],
    },
    {
      title: 'Criterion C: communicating',
      points: [
        'Show every step, in order. Your teacher wants "an answer + a mathematical reason".',
        'Use the words: term, coefficient, exponent, like terms, common difference, variable.',
        'Write x² with a small 2, and put negative numbers in brackets: 3(−2) + 1.',
        'When multiplying, show the 3 steps: signs, numbers, letters.',
      ],
    },
  ],
};
