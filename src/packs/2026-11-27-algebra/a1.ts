// A1: Terms, coefficients, like terms and collecting like terms (Operations, Day 1).
// From the teacher's lesson: the anatomy of −4x² + 3xy − 7, "same variable part, same powers", Examples A and B.
// None of these is a question from the homework due 25 Nov (packs.test.ts checks this).
import { collect } from '../../content/maths';
import type { ChoiceItem, Item, PairItem, ShortItem, Topic } from '../../content/types';

const coef = (id: string, term: string, answer: string, wrong: [string, string, string], explain: string, whyNot: Record<string, string>): ChoiceItem => ({
  id, concept: 'a1-parts', type: 'choice', prompt: `What is the coefficient in ${term}?`,
  options: [answer, ...wrong], answer: 0, explain, whyNot,
});

const like = (id: string, a: string, b: string, yes: boolean, explain: string, whyNot: string): PairItem => ({
  id, concept: 'a1-like', type: 'pair', prompt: `${a} and ${b}`,
  options: ['Like terms', 'Unlike terms'], answer: yes ? 0 : 1, explain,
  whyNot: { [yes ? 'Unlike terms' : 'Like terms']: whyNot },
});

const items: Item[] = [
  // Coefficients
  coef('a1-c-1', '−9x', '−9', ['9', 'x', '1'], 'The coefficient is the number in front of the letter, with its sign: −9.', {
    '9': 'The sign belongs to the coefficient. In −9x the coefficient is −9.',
    x: 'x is the variable (the letter). The coefficient is the number in front of it.',
    '1': 'Only a letter with no number in front has coefficient 1. Here the number is −9.',
  }),
  coef('a1-c-2', '6y²', '6', ['2', 'y', '12'], 'The coefficient is the number in front: 6. The small 2 is the exponent.', {
    '2': 'The small 2 is the exponent (the power). The coefficient is the number in front: 6.',
    y: 'y is the variable. The coefficient is the number in front of it.',
    '12': 'Nothing is multiplied here. The coefficient is just the number in front: 6.',
  }),
  coef('a1-c-3', '−m', '−1', ['1', '0', 'm'], 'No number written but a minus sign: −m means −1 × m, so the coefficient is −1.', {
    '1': 'Careful with the sign: −m is −1 × m, so the coefficient is −1.',
    '0': 'If the coefficient were 0 the term would be 0. −m means −1 × m.',
    m: 'm is the variable. The coefficient is the number in front: here an unwritten −1.',
  }),
  coef('a1-c-4', 'p⁴', '1', ['4', '0', 'p'], 'No number written in front means 1: p⁴ is 1 × p⁴.', {
    '4': 'The 4 is the exponent (the power). The coefficient is the number in front: an unwritten 1.',
    '0': 'p⁴ is not zero. With no number written, the coefficient is 1.',
    p: 'p is the variable. The coefficient is the number in front: an unwritten 1.',
  }),
  {
    id: 'a1-c-5', concept: 'a1-parts', type: 'choice', prompt: 'In 5a − 8b + 3, what is the coefficient of b?',
    options: ['−8', '8', '3', '5'], answer: 0,
    explain: 'Each term keeps the sign in front of it: the term is −8b, so the coefficient of b is −8.',
    whyNot: {
      '8': 'The minus sign belongs to the term: −8b. So the coefficient is −8.',
      '3': '3 is the constant (a number with no letter).',
      '5': '5 is the coefficient of a, not of b.',
    },
  },

  // Exponents
  {
    id: 'a1-e-1', concept: 'a1-parts', type: 'choice', prompt: 'What is the exponent (power) of a in 8a³?',
    options: ['3', '8', '1', '24'], answer: 0,
    explain: 'The exponent is the small raised number: a³ means a × a × a, so the exponent is 3.',
    whyNot: { '8': '8 is the coefficient (the number in front).', '1': 'There is a small 3 written, so the exponent is 3.', '24': 'Nothing is multiplied here: the exponent is just the small number, 3.' },
  },
  {
    id: 'a1-e-2', concept: 'a1-parts', type: 'choice', prompt: 'What is the exponent of k in 5k?',
    options: ['1', '5', '0', '2'], answer: 0,
    explain: 'No small number written means the exponent is 1: k is k¹.',
    whyNot: { '5': '5 is the coefficient.', '0': 'k⁰ would be 1, not k. With nothing written, the exponent is 1.', '2': 'That would be k². Here it is just k, so the exponent is 1.' },
  },
  {
    id: 'a1-e-3', concept: 'a1-parts', type: 'choice', prompt: 'What is the exponent of n in −2n⁴?',
    options: ['4', '−2', '2', '1'], answer: 0,
    explain: 'The small raised number is 4: n⁴ = n × n × n × n.',
    whyNot: { '−2': '−2 is the coefficient (the number in front, with its sign).', '2': '2 belongs to the coefficient −2. The exponent is the small 4.', '1': 'A small 4 is written, so the exponent is 4.' },
  },

  // How many terms
  {
    id: 'a1-t-1', concept: 'a1-parts', type: 'choice', prompt: 'How many terms are in 3a − 5b + 2?',
    options: ['3', '2', '1', '5'], answer: 0,
    explain: 'Terms are split by + and − signs: 3a, −5b and +2. That is 3 terms.',
    whyNot: { '2': 'Count the constant too: 3a, −5b and 2 are three terms.', '1': 'Each + or − starts a new term: 3a, −5b, +2.', '5': 'Count terms, not numbers: 3a, −5b and 2.' },
  },
  {
    id: 'a1-t-2', concept: 'a1-parts', type: 'choice', prompt: 'How many terms are in 6m² − 1?',
    options: ['2', '1', '3', '6'], answer: 0,
    explain: 'The − sign splits it into two terms: 6m² and −1.',
    whyNot: { '1': 'The − sign starts a new term: 6m² and −1.', '3': 'There are only two pieces: 6m² and −1.', '6': '6 is the coefficient, not the number of terms.' },
  },
  {
    id: 'a1-t-3', concept: 'a1-parts', type: 'choice', prompt: 'How many terms are in 2p + q − 3r + 4?',
    options: ['4', '3', '2', '6'], answer: 0,
    explain: 'Four terms: 2p, +q, −3r and +4.',
    whyNot: { '3': 'Do not forget the constant +4: 2p, q, −3r, 4.', '2': 'Each + or − starts a new term. There are four.', '6': 'Count terms, not numbers and letters: 2p, q, −3r, 4.' },
  },
  {
    id: 'a1-t-4', concept: 'a1-parts', type: 'choice', prompt: 'In 7x² − 4xy + 9, which term is the constant?',
    options: ['9', '7x²', '−4xy', '7'], answer: 0,
    explain: 'The constant is the term with no letter: +9. Its value never changes.',
    whyNot: { '7x²': '7x² has a letter, so its value changes with x.', '−4xy': '−4xy has letters, so it is not constant.', '7': '7 is the coefficient of x², not a term by itself.' },
  },

  // Like or unlike?
  like('a1-l-1', '6y²', '−2y²', true, 'Same letter, same power (y²). The sign and the number in front do not matter.', 'They are both y². Only the letters and the powers have to match.'),
  like('a1-l-2', '3pq', '5qp', true, 'pq and qp are the same (p × q = q × p), so these are like terms.', 'qp is the same as pq: the order of the letters does not matter.'),
  like('a1-l-3', '4m³', '4m²', false, 'The powers are different (m³ and m²), so they are unlike terms.', 'Same number in front, but the powers differ: m³ is not m².'),
  like('a1-l-4', '−2a²b', '7ab²', false, 'In a²b the a is squared; in ab² the b is squared. Different powers, so unlike.', 'Look at each letter\'s power: a²b has a², but ab² has b².'),
  like('a1-l-5', '5x', '5', false, '5x has a letter; 5 is a constant with no letter. Unlike terms.', 'One has the letter x and the other has no letter at all.'),
  like('a1-l-6', '−k', '9k', true, 'Both are k (power 1). −k is just −1k.', 'Both are plain k: the same letter with the same power.'),

  // Collect like terms: one kind of term
  collect('a1-o-1', 'a1-collect', '6k + 3k − 2k', '7k', '(6 + 3 − 2)k'),
  collect('a1-o-2', 'a1-collect', '9y − 4y − y', '4y', '(9 − 4 − 1)y'),
  collect('a1-o-3', 'a1-collect', '2b − 7b + 3b', '−2b', '(2 − 7 + 3)b'),
  collect('a1-o-4', 'a1-collect', '−4p + 7p + 2', '3p + 2', '(−4p + 7p) + 2'),

  // Collect like terms: two kinds
  collect('a1-w-1', 'a1-collect', '6x + 2y + 3x − 5y', '9x − 3y', '(6x + 3x) + (2y − 5y)'),
  collect('a1-w-2', 'a1-collect', '7a + 4b − 2a + b', '5a + 5b', '(7a − 2a) + (4b + b)'),
  collect('a1-w-3', 'a1-collect', '3m − 2n + m + 6n', '4m + 4n', '(3m + m) + (−2n + 6n)'),
  collect('a1-w-4', 'a1-collect', '8p + 3 − 5p − 7', '3p − 4', '(8p − 5p) + (3 − 7)'),
  collect('a1-w-5', 'a1-collect', '5 − 3d + 2 + 4d', '7 + d', '(5 + 2) + (−3d + 4d)'),

  // Collect like terms with powers
  collect('a1-x-1', 'a1-collect-powers', '5x² + 4x − 2x² − x', '3x² + 3x', '(5x² − 2x²) + (4x − x)', [
    { answer: '6x³', say: 'x² and x are unlike terms (different powers), so they cannot be put together.' },
  ]),
  collect('a1-x-2', 'a1-collect-powers', '2y² − 6y + 5y² + y', '7y² − 5y', '(2y² + 5y²) + (−6y + y)'),
  collect('a1-x-3', 'a1-collect-powers', '9a² + 2a − 4a² − 7a', '5a² − 5a', '(9a² − 4a²) + (2a − 7a)'),
  collect('a1-x-4', 'a1-collect-powers', '−2xy + 5x² + 6xy − 3x²', '2x² + 4xy', '(5x² − 3x²) + (−2xy + 6xy)'),

  // Why only like terms can be combined (Criterion C)
  {
    id: 'a1-why-q1', concept: 'a1-why-like', type: 'choice', prompt: 'Why can 5x² + 2x NOT be written as 7x³?',
    options: ['x² and x are unlike terms', 'Because 5 + 2 is not 7', 'Because you must multiply instead', 'It can: 5x² + 2x = 7x³'], answer: 0,
    explain: 'x² and x have different powers, so they are unlike terms. You can only collect like terms. 5x² + 2x stays as it is.',
    whyNot: {
      'Because 5 + 2 is not 7': '5 + 2 is 7. The problem is that x² and x are different kinds of term.',
      'Because you must multiply instead': 'The sign is +, so this is adding. You just cannot add unlike terms together.',
      'It can: 5x² + 2x = 7x³': 'That is the common mistake. Adding never changes the powers, and unlike terms stay apart.',
    },
  } satisfies ChoiceItem,
  {
    id: 'a1-why-q2', concept: 'a1-why-like', type: 'pair', prompt: '3a² + 4a² = ?',
    options: ['7a²', '7a⁴'], answer: 0,
    explain: 'Like terms: add the numbers in front, 3 + 4 = 7. The power stays a². Adding never changes the power.',
    whyNot: { '7a⁴': 'The powers only add when you MULTIPLY. When you add like terms, the power stays the same: 7a².' },
  } satisfies PairItem,
  {
    id: 'a1-why-w1', concept: 'a1-why-like', type: 'short',
    prompt: 'Why can 3p + 2p be combined, but 3p + 2p² cannot?',
    ideas: [
      { label: '3p and 2p are like terms (same letter, same power)', words: ['like terms', 'same power', 'same letter', 'same variable', 'same exponent', 'both p'] },
      { label: 'p and p² have different powers, so they are unlike', words: ['unlike', 'different power', 'different exponent', 'not the same power', 'different', 'p squared', 'p²', 'p2'] },
    ],
    model: '3p and 2p are like terms: same letter, same power, so 3p + 2p = 5p. 3p and 2p² are unlike terms: p has power 1 but p² has power 2. Unlike terms cannot be collected, so 3p + 2p² stays as it is.',
  } satisfies ShortItem,
];

export const a1: Topic = {
  id: 'A1', title: 'Terms, coefficients and like terms', short: 'Like terms', items,
};
