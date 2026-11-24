// Exam pack: Mathematics, "Patterns and Algebraic Expressions", formative assessment on Friday 27 November 2026.
// 45 minutes, marked on Criterion B (investigating patterns) and Criterion C (communicating).
// Content comes only from the teacher's lessons and homework (MATHS_ALGEBRA_TEST_APP.md, Part D).
// Phase 1 (24 Nov): the lesson Adele missed (A3, multiplying terms) and like terms (A1).
import type { Pack } from '../../content/types';
import { a1 } from './a1';
import { a3 } from './a3';
import { lessonA1, lessonA3 } from './lessons';

/** One plain sentence for each thing to know. */
const simple: Record<string, string> = {
  'a3-number': 'Multiply the numbers and keep the letter: 2x × 3 is 2 × 3 = 6, so 6x.',
  'a3-two-letters': 'Multiply the numbers, then write the letters together in alphabetical order.',
  'a3-signs': 'Count the minus signs: an even number gives +, an odd number gives −.',
  'a3-same-letter': 'The same letter twice makes a square: x × x = x².',
  'a3-product-rule': 'Same letter: add the powers. x³ × x² = x³⁺² = x⁵.',
  'a3-coef-powers': 'Multiply the numbers in front, then add the powers of each letter.',
  'a3-diff-bases': 'Different letters keep their own powers: x² × y³ = x²y³.',
  'a3-big-terms': 'Signs, then numbers, then one letter at a time, adding its powers.',
  'a3-three-factors': 'Three terms work the same way: count all the minus signs, multiply all the numbers.',
  'a3-square': 'A power outside a bracket applies to everything inside: (3x)² = 3x × 3x = 9x².',
  'a3-area': 'Area of a rectangle = length × width, so you multiply the two terms.',
  'a3-add-vs-mul': 'Adding counts how many x\'s (2x + 3x = 5x); multiplying gives x² (2x × 3x = 6x²).',
  'a3-why-add': 'x³ × x² written out is five x\'s multiplied, so the powers add: 3 + 2 = 5.',
  'a3-method': 'The teacher\'s 3 steps: signs, then numbers, then letters.',
  'a1-coefficient': 'The coefficient is the number in front of the letters, with its sign.',
  'a1-exponent': 'The exponent is the small raised number; with none written, it is 1.',
  'a1-terms': 'The + and − signs split an expression into terms; each term keeps its sign.',
  'a1-like': 'Like terms have the same letters with the same powers; the numbers can differ.',
  'a1-collect-one': 'Add or subtract only the numbers in front; the letter stays the same.',
  'a1-collect-two': 'Group each kind of term, then add or subtract the numbers in each group.',
  'a1-collect-powers': 'x² terms and x terms are different kinds: collect each kind on its own.',
  'a1-why-like': 'Only like terms can be added, and adding never changes the power.',
};

/** A few short examples for each thing to know. */
const examples: Record<string, string[]> = {
  'a3-number': ['2x × 3 = 6x', '7x × (−2) = −14x'],
  'a3-two-letters': ['4m × 2n = 8mn', '−3a × 5b = −15ab'],
  'a3-signs': ['(−5x)(−3y) = 15xy', '2p × (−4q) × 3r = −24pqr'],
  'a3-same-letter': ['−2p × −7p = 14p²', '5y × 3y = 15y²'],
  'a3-product-rule': ['x² × x³ = x⁵', 'x⁴ × x = x⁵'],
  'a3-coef-powers': ['3x² × 2x³ = 6x⁵', '(−2a²)(4a³) = −8a⁵'],
  'a3-diff-bases': ['x² × y³ = x²y³', '2a³ × 5b² = 10a³b²'],
  'a3-big-terms': ['(3x²y)(−2xy³) = −6x³y⁴', '(−3mn)(−2m²n³) = 6m³n⁴'],
  'a3-three-factors': ['2p × (−4q) × 3r = −24pqr', '4m × 2m² × (−m) = −8m⁴'],
  'a3-square': ['(3x)² = 9x²', '(−3a)² = 9a²', '3x² = 3 × x × x'],
  'a3-area': ['3x by 4x: area 12x² cm²', '5a by 2a: area 10a²'],
  'a3-add-vs-mul': ['2x + 3x = 5x', '2x × 3x = 6x²'],
  'a3-why-add': ['x³ × x² = (x·x·x)(x·x) = x⁵', 'aᵐ × aⁿ = aᵐ⁺ⁿ'],
  'a3-method': ['Signs → numbers → letters', '2p × (−4q) × 3r = −24pqr'],
  'a1-coefficient': ['−4 in −4x²', '+3 in +3xy', '−1 in −y'],
  'a1-exponent': ['2 in x²', '1 in 5a'],
  'a1-terms': ['2x − 3y + 1 has 3 terms', '−4x² + 3xy − 7: three terms'],
  'a1-like': ['3a and −8a: like', '2x² and 5x: unlike', '4xy and −3yx: like'],
  'a1-collect-one': ['4m − 2m + m = 3m', '3b + b − 6b = −2b'],
  'a1-collect-two': ['5x + 4y + 2x − y = 7x + 3y', '4q − 2 + 3q = 7q − 2'],
  'a1-collect-powers': ['6q² − 2q + 3q² = 9q² − 2q', '4m² + 3m − m² − 5m = 3m² − 2m'],
  'a1-why-like': ['4x² + 3x stays as it is', '3p + 2p = 5p'],
};

export const pack: Pack = {
  id: '2026-11-27-algebra',
  subject: 'Mathematics',
  title: 'Patterns and Algebraic Expressions',
  date: '2026-11-27',
  criteria: ['B: investigating patterns', 'C: communicating'],
  topics: [a3, a1],
  lessons: [lessonA3, lessonA1],
  catchUp: 'A3',
  freshNumbers: true,
  simple,
  examples,
  plan: [
    {
      day: -3, label: 'Catch up on the lesson you missed (multiplying terms), then like terms', topics: ['A3', 'A1'],
      extras: [{ kind: 'learn', topic: 'A3' }, { kind: 'learn', topic: 'A1' }],
    },
    { day: -2, label: 'Sequences, brackets and negative numbers' },
    { day: -1, label: 'Patterns and rules, then the Mock Test' },
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
