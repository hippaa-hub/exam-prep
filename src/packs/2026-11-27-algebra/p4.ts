// P4: Substitution and evaluation, including negative numbers (Part D4).
// "Negative numbers need brackets!" and the order of operations. Every answer carries its calculation,
// which the tests work out again.
import { nums } from '../../content/maths';
import type { ChoiceItem, ErrorFindItem, Item, NumericItem, Topic } from '../../content/types';

/** Substitute one value: `put` is the line with the value in brackets, `calc` the same in plain maths. */
const sub = (id: string, concept: string, given: string, expr: string, put: string, steps: string[], answer: number, calc: string, slips?: NumericItem['slips']): NumericItem =>
  nums(id, concept, `${given}. Work out ${expr}.`, [{ label: expr, answer, calc }],
    ['Put the number in brackets: ' + put + '.', ...steps, `Answer: ${answer < 0 ? `−${-answer}` : answer}.`], slips ? { slips } : {});

const err = (id: string, prompt: string, lines: string[], wrong: number, fix: string, others: string[], explain: string): ErrorFindItem => ({
  id, concept: 'p4-why', type: 'errorFind', prompt, lines, wrong, fix, fixes: [fix, ...others], explain,
  how: ['Check the brackets: is the negative number in brackets?', 'Square or multiply first, then add or subtract.'],
});

const items: Item[] = [
  // A negative number times a coefficient
  sub('p4-b-1', 'p4-negative', 'a = −3', '2a + 5', '2(−3) + 5', ['Multiply first: 2 × (−3) = −6.', 'Then add: −6 + 5 = −1.'], -1, '2*(-3)+5'),
  sub('p4-b-2', 'p4-negative', 'x = −2', '3x + 7', '3(−2) + 7', ['Multiply first: 3 × (−2) = −6.', 'Then add: −6 + 7 = 1.'], 1, '3*(-2)+7'),
  sub('p4-b-3', 'p4-negative', 'k = −4', '5k + 12', '5(−4) + 12', ['Multiply first: 5 × (−4) = −20.', 'Then add: −20 + 12 = −8.'], -8, '5*(-4)+12'),
  sub('p4-b-4', 'p4-negative', 'm = −5', '2m − 3', '2(−5) − 3', ['Multiply first: 2 × (−5) = −10.', 'Then subtract: −10 − 3 = −13.'], -13, '2*(-5)-3'),
  sub('p4-b-5', 'p4-negative', 'x = −3', '4 − 2x', '4 − 2(−3)', ['Multiply first: 2 × (−3) = −6.', 'Then 4 − (−6) = 4 + 6 = 10.'], 10, '4-2*(-3)',
    [{ answer: -2, say: 'Careful: 4 − 2(−3) is 4 − (−6), and subtracting a negative is adding: 4 + 6 = 10.' }]),

  // Squaring a negative number
  sub('p4-q-1', 'p4-square', 'a = −3', '1 − a²', '1 − (−3)²', ['Square first: (−3)² = 9.', 'Then 1 − 9 = −8.'], -8, '1-(-3)^2',
    [{ answer: 10, say: 'Square first, then subtract: (−3)² = 9, so 1 − 9 = −8. The minus in front stays.' }]),
  sub('p4-q-2', 'p4-square', 'x = −2', '10 − x²', '10 − (−2)²', ['Square first: (−2)² = 4.', 'Then 10 − 4 = 6.'], 6, '10-(-2)^2',
    [{ answer: 14, say: 'Square first: (−2)² = 4. Then subtract it: 10 − 4 = 6.' }]),
  sub('p4-q-3', 'p4-square', 'b = −4', 'b² + 3', '(−4)² + 3', ['Square first: (−4)² = 16 (minus times minus is plus).', 'Then 16 + 3 = 19.'], 19, '(-4)^2+3',
    [{ answer: -13, say: '(−4)² = (−4) × (−4) = +16, not −16. So 16 + 3 = 19.' }]),
  sub('p4-q-4', 'p4-square', 'k = −2', '3k²', '3(−2)²', ['Square first: (−2)² = 4.', 'Then multiply: 3 × 4 = 12.'], 12, '3*(-2)^2',
    [{ answer: -12, say: '(−2)² = +4, so 3 × 4 = 12. Square before you multiply by 3.' }]),
  sub('p4-q-5', 'p4-square', 'a = −2', '1 − a²', '1 − (−2)²', ['Square first: (−2)² = 4.', 'Then 1 − 4 = −3.'], -3, '1-(-2)^2',
    [{ answer: 5, say: 'Square first, then subtract: 1 − 4 = −3.' }]),
  {
    id: 'p4-q-q1', concept: 'p4-square', type: 'pair', prompt: 'Which is 9?', options: ['(−3)²', '−3²'], answer: 0,
    explain: '(−3)² = (−3) × (−3) = 9. But −3² means −(3 × 3) = −9: the square applies only to what is directly in front of it.',
    whyNot: { '−3²': 'Without brackets the square applies only to the 3: −3² = −9.' },
  },


  // Rule Machine: a table of values, including negative x
  nums('p4-t-1', 'p4-table', 'Rule machine: y = 4 − 2x. Fill in y for each x.',
    [-2, -1, 0, 1, 2].map((x) => ({ label: `x = ${x < 0 ? `−${-x}` : x}`, answer: 4 - 2 * x, calc: `4-2*(${x})` })),
    ['Put each x in brackets: y = 4 − 2(−2).', '4 − 2(−2) = 4 + 4 = 8; 4 − 2(−1) = 6; 4 − 2(0) = 4.', 'The values fall by 2 each time: arithmetic, difference −2.', '8, 6, 4, 2, 0.']),
  nums('p4-t-2', 'p4-table', 'Rule machine: y = 3x + 1. Fill in y for each x.',
    [-2, -1, 0, 1, 2].map((x) => ({ label: `x = ${x < 0 ? `−${-x}` : x}`, answer: 3 * x + 1, calc: `3*(${x})+1` })),
    ['Put each x in brackets: y = 3(−2) + 1.', '3(−2) + 1 = −6 + 1 = −5; 3(−1) + 1 = −2.', 'The values go up by 3 each time.', '−5, −2, 1, 4, 7.']),
  nums('p4-t-3', 'p4-table', 'Rule machine: y = 2x − 3. Fill in y for each x.',
    [-2, -1, 0, 1, 2].map((x) => ({ label: `x = ${x < 0 ? `−${-x}` : x}`, answer: 2 * x - 3, calc: `2*(${x})-3` })),
    ['Put each x in brackets: y = 2(−2) − 3.', '2(−2) − 3 = −4 − 3 = −7; 2(−1) − 3 = −5.', 'The values go up by 2 each time.', '−7, −5, −3, −1, 1.']),
  nums('p4-t-4', 'p4-table', 'Rule machine: b = a² + a. Fill in b for each a.',
    [1, 2, 3, 4].map((a) => ({ label: `a = ${a}`, answer: a * a + a, calc: `(${a})^2+(${a})` })),
    ['Square a, then add a.', '1² + 1 = 2; 2² + 2 = 6; 3² + 3 = 12.', 'The differences are +4, +6, +8: not arithmetic.', '2, 6, 12, 20.']),
  nums('p4-t-5', 'p4-table', 'Rule machine: y = 5 − x. Fill in y for each x.',
    [-2, -1, 0, 1, 2].map((x) => ({ label: `x = ${x < 0 ? `−${-x}` : x}`, answer: 5 - x, calc: `5-(${x})` })),
    ['Put each x in brackets: y = 5 − (−2).', '5 − (−2) = 5 + 2 = 7; 5 − (−1) = 6.', 'The values fall by 1 each time.', '7, 6, 5, 4, 3.']),

  // Maths courtroom: find the false step
  err('p4-e-1', 'Maths courtroom. a = −3, work out 1 − a². Which step is false?',
    ['1 − a²', '= 1 − (−3)²', '= 1 + 9', '= 10'], 2, '= 1 − 9', ['= 1 − 6', '= 1 + 6'],
    '(−3)² = 9, and the minus in front stays: 1 − 9 = −8.'),
  err('p4-e-2', 'Maths courtroom. x = −2, work out y = 4 − 2x. Which step is false?',
    ['y = 4 − 2x', '= 4 − 2(−2)', '= 4 − 4', '= 0'], 2, '= 4 + 4', ['= 4 − 2', '= 2 − 4'],
    '2(−2) = −4, and 4 − (−4) = 4 + 4 = 8.'),
  err('p4-e-3', 'Maths courtroom. k = −2, work out 3k². Which step is false?',
    ['3k²', '= 3(−2)²', '= 3(−4)', '= −12'], 2, '= 3(4)', ['= 3(−6)', '= −6²'],
    '(−2)² = (−2) × (−2) = 4, so 3 × 4 = 12.'),
  err('p4-e-4', 'Maths courtroom. a = −4, work out 2 − a². Which step is false?',
    ['2 − a²', '= 2 − (−4)²', '= 2 + 16', '= 18'], 2, '= 2 − 16', ['= 2 − 8', '= 2 + 8'],
    '(−4)² = 16, and the minus in front stays: 2 − 16 = −14.'),

  // Why brackets (Criterion C)
  {
    id: 'p4-w-q1', concept: 'p4-why', type: 'choice', prompt: 'For x = −2, why write y = 3(−2) + 1 and not 3 − 2 + 1?',
    options: ['Without brackets it looks like subtraction and gives the wrong answer', 'Brackets make it look neater', 'Both give the same answer', 'You only need brackets for squares'], answer: 0,
    explain: '3(−2) + 1 = −6 + 1 = −5. But 3 − 2 + 1 reads as subtraction and gives 2. Brackets keep the negative number together.',
    whyNot: {
      'Brackets make it look neater': 'It is not about looks: without brackets the answer changes (2 instead of −5).',
      'Both give the same answer': '3(−2) + 1 = −5, but 3 − 2 + 1 = 2. Different!',
      'You only need brackets for squares': 'Negative numbers ALWAYS need brackets when you substitute.',
    },
  } satisfies ChoiceItem,
];

export const p4: Topic = { id: 'P4', title: 'Substitution, including negative numbers', short: 'Substitution', items };
