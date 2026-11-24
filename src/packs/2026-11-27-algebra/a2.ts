// A2: Adding and subtracting expressions with brackets (classwork 20 Nov, Part D8).
// "A minus sign before brackets changes the sign of every term inside."
import { brk } from '../../content/maths';
import type { ErrorFindItem, ExpressionItem, Item, ShortItem, Topic } from '../../content/types';

/** A real-life or missing-expression question, where what is shown is not the calculation itself. */
const shown = (id: string, concept: string, prompt: string, show: string, expr: string, answer: string, how: string[]): ExpressionItem => ({
  id, concept, type: 'expression', kind: 'brackets', prompt, show, expr, answer, how,
});

const err = (id: string, prompt: string, lines: string[], wrong: number, fix: string, others: string[], explain: string): ErrorFindItem => ({
  id, concept: 'a2-error', type: 'errorFind', prompt, lines, wrong, fix, fixes: [fix, ...others], explain,
  how: ['Check each line against the one before.', 'Look at every term after a minus sign before a bracket: did its sign change?'],
});

const items: Item[] = [
  // Adding brackets: a + changes nothing
  brk('a2-p-1', 'a2-add', '(7x + 4) + (3x − 9)', '10x − 5'),
  brk('a2-p-2', 'a2-add', '(4a + 3) + (2a − 8)', '6a − 5'),
  brk('a2-p-3', 'a2-add', '(5m − 2n) + (3n − m)', '4m + n'),
  brk('a2-p-4', 'a2-add', '(9a − 2b) + (4b − 5a + 6)', '4a + 2b + 6'),
  brk('a2-p-5', 'a2-add', '(6p + 1) + (2p − 7q + 5)', '8p − 7q + 6'),

  // Subtracting brackets: a − changes every sign
  brk('a2-s-1', 'a2-subtract', '(12p − 7) − (5p − 11)', '7p + 4'),
  brk('a2-s-2', 'a2-subtract', '(9x + 5) − (4x + 2)', '5x + 3'),
  brk('a2-s-3', 'a2-subtract', '(8y − 3) − (2y − 6)', '6y + 3'),
  brk('a2-s-4', 'a2-subtract', '(7a + 2b) − (3a − 4b)', '4a + 6b'),
  brk('a2-s-5', 'a2-subtract', '(6m + 3n − 8) − (2m − n + 5)', '4m + 4n − 13'),
  brk('a2-s-6', 'a2-subtract', '(10a + 2b − 3) − (4a − 5b + 8)', '6a + 7b − 11'),

  // Three variables, three brackets
  brk('a2-t-1', 'a2-subtract', '(5x − 2y + 3) − (3x + 4y − 8)', '2x − 6y + 11'),
  brk('a2-t-2', 'a2-subtract', '(7a + 2b − 4c) + (3c − 5a + 6b)', '2a + 8b − c'),
  brk('a2-t-3', 'a2-subtract', '(9m − 4n + 2) − (3m − 7n − 5)', '6m + 3n + 7'),
  brk('a2-t-4', 'a2-subtract', '(3x − 5y + 2) + (7x + y − 6) − (2x − 3y + 1)', '8x − y − 5'),
  brk('a2-t-5', 'a2-subtract', '(8a − 3b + 4) − (2a + b − 5) + (a − 2b + 3)', '7a − 6b + 12'),

  // Real situations
  shown('a2-r-1', 'a2-real', 'A rectangle is (5x + 3) cm long and (2x − 1) cm wide. Write its perimeter, simplified.',
    'P = 2(5x + 3) + 2(2x − 1)', '2(5x + 3) + 2(2x − 1)', '14x + 4',
    ['Perimeter = 2 × length + 2 × width.', 'Multiply out: 10x + 6 + 4x − 2.', 'Group: (10x + 4x) + (6 − 2).', '14x + 4 cm.']),
  shown('a2-r-2', 'a2-real', 'A rectangle is (3a + 2) cm long and (a + 4) cm wide. Write its perimeter, simplified.',
    'P = 2(3a + 2) + 2(a + 4)', '2(3a + 2) + 2(a + 4)', '8a + 12',
    ['Perimeter = 2 × length + 2 × width.', 'Multiply out: 6a + 4 + 2a + 8.', 'Group: (6a + 2a) + (4 + 8).', '8a + 12 cm.']),
  shown('a2-r-3', 'a2-real', 'Nino has (5x + 6) stickers. She gives away (x + 2) and then receives (2x + 1). How many does she have now?',
    '(5x + 6) − (x + 2) + (2x + 1)', '(5x + 6) − (x + 2) + (2x + 1)', '6x + 5',
    ['Giving away is −, receiving is +.', 'Remove the brackets: 5x + 6 − x − 2 + 2x + 1.', 'Group: (5x − x + 2x) + (6 − 2 + 1).', '6x + 5 stickers.']),
  shown('a2-r-4', 'a2-real', 'A shop earns (8a + 5b + 10) lari on Monday and (3a + 2b − 4) lari on Tuesday. How much more on Monday?',
    '(8a + 5b + 10) − (3a + 2b − 4)', '(8a + 5b + 10) − (3a + 2b − 4)', '5a + 3b + 14',
    ['"How much more" means subtract: Monday − Tuesday.', 'Remove the brackets, changing every sign in Tuesday\'s: 8a + 5b + 10 − 3a − 2b + 4.', 'Group: (8a − 3a) + (5b − 2b) + (10 + 4).', '5a + 3b + 14 lari.']),

  // The missing expression
  shown('a2-m-1', 'a2-real', 'Find the missing expression E.', '(6x − 2y + 5) + E = 10x + y − 3',
    '(10x + y − 3) − (6x − 2y + 5)', '4x + 3y − 8',
    ['E is what you add, so E = total − what you have.', 'E = (10x + y − 3) − (6x − 2y + 5).', 'Remove brackets: 10x + y − 3 − 6x + 2y − 5.', 'E = 4x + 3y − 8.']),
  shown('a2-m-2', 'a2-real', 'Find the missing expression E.', '(3a + 2b) + E = 7a − b',
    '(7a − b) − (3a + 2b)', '4a − 3b',
    ['E = total − what you have.', 'E = (7a − b) − (3a + 2b).', 'Remove brackets: 7a − b − 3a − 2b.', 'E = 4a − 3b.']),
  shown('a2-m-3', 'a2-real', 'Find the missing expression F.', '(5m + 4) − F = 2m − 3',
    '(5m + 4) − (2m − 3)', '3m + 7',
    ['F is what was taken away, so F = start − result.', 'F = (5m + 4) − (2m − 3).', 'Remove brackets: 5m + 4 − 2m + 3.', 'F = 3m + 7.']),
  shown('a2-m-4', 'a2-real', 'Find the missing expression F.', '(9a + 4b − 2) − F = 3a − b + 7',
    '(9a + 4b − 2) − (3a − b + 7)', '6a + 5b − 9',
    ['F = start − result.', 'F = (9a + 4b − 2) − (3a − b + 7).', 'Remove brackets: 9a + 4b − 2 − 3a + b − 7.', 'F = 6a + 5b − 9.']),

  // Error Detective
  err('a2-e-1', 'A student simplified (6x + 4) − (2x − 7). Which line is wrong?',
    ['(6x + 4) − (2x − 7)', '= 6x + 4 − 2x − 7', '= 4x − 3'], 1, '= 6x + 4 − 2x + 7', ['= 6x + 4 + 2x + 7', '= 6x − 4 − 2x − 7'],
    'The −7 inside the bracket becomes +7. The right answer is 4x + 11.'),
  err('a2-e-2', 'A student simplified (9a + 2) − (3a − 5). Which line is wrong?',
    ['(9a + 2) − (3a − 5)', '= 9a + 2 − 3a − 5', '= 6a − 3'], 1, '= 9a + 2 − 3a + 5', ['= 9a + 2 + 3a − 5', '= 9a − 2 − 3a − 5'],
    'The minus before the bracket changes −5 into +5. The right answer is 6a + 7.'),
  err('a2-e-3', 'A student simplified (5m − 1) − (2m + 6). Which line is wrong?',
    ['(5m − 1) − (2m + 6)', '= 5m − 1 − 2m + 6', '= 3m + 5'], 1, '= 5m − 1 − 2m − 6', ['= 5m + 1 − 2m − 6', '= 5m − 1 + 2m + 6'],
    'Every sign in the second bracket changes: +2m → −2m and +6 → −6. The right answer is 3m − 7.'),
  err('a2-e-4', 'A student simplified (4x + 3y) − (x − 2y). Which line is wrong?',
    ['(4x + 3y) − (x − 2y)', '= 4x + 3y − x + 2y', '= 3x + y'], 2, '= 3x + 5y', ['= 5x + 5y', '= 3x − 5y'],
    'Removing the brackets was right. Then 3y + 2y = 5y, not y. The right answer is 3x + 5y.'),
  {
    id: 'a2-e-w1', concept: 'a2-error', type: 'short',
    prompt: 'A student writes (8p + 3) − (2p − 4) = 6p − 1. Explain the mistake and give the right answer.',
    ideas: [
      { label: 'The −4 should become +4 (a minus before the bracket changes every sign)', words: ['+4', '+ 4', 'every sign', 'all the signs', 'each sign', 'change the sign', 'changes the sign', 'minus minus'] },
      { label: 'The right answer is 6p + 7', words: ['6p + 7', '6p+7', '6p plus 7'] },
    ],
    model: 'The minus sign before the second bracket changes the sign of every term inside, so −4 becomes +4. The student only changed 2p. Correct: 8p + 3 − 2p + 4 = 6p + 7.',
  } satisfies ShortItem,
];

export const a2: Topic = { id: 'A2', title: 'Adding and subtracting expressions with brackets', short: 'Brackets', items };
