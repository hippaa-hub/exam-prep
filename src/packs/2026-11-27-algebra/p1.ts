// P1: Sequences: arithmetic, geometric or neither; common difference and ratio; next terms (Part D1).
// The teacher's sequences, plus new ones with different numbers so a miss comes back fresh.
import { nums, seq } from '../../content/maths';
import type { ChoiceItem, Item, Topic } from '../../content/types';

const A = (d: number) => (d < 0 ? `−${-d} each time` : `+${d} each time`);

const items: Item[] = [
  // Arithmetic: the same number added (or subtracted)
  seq('p1-a-1', 'p1-arithmetic', [5, 9, 13, 17], [21, 25], 'arithmetic', A(4), ['×2 each time', 'The increase grows each time'], 'The same number, +4, is added each time: common difference +4.'),
  seq('p1-a-2', 'p1-arithmetic', [20, 17, 14, 11], [8, 5], 'arithmetic', A(-3), ['+3 each time', '÷2 each time'], 'Subtract 3 each time: common difference −3. A decreasing arithmetic sequence.'),
  seq('p1-a-3', 'p1-arithmetic', [7, 12, 17, 22], [27, 32], 'arithmetic', A(5), ['×2 each time', 'The increase grows each time'], '+5 every time: common difference +5.'),
  seq('p1-a-4', 'p1-arithmetic', [28, 21, 14], [7, 0], 'arithmetic', A(-7), ['÷2 each time', '−6 each time'], 'Subtract 7 each time: 28, 21, 14, 7, 0. Common difference −7.'),
  seq('p1-a-5', 'p1-arithmetic', [6, 11, 16, 21], [26, 31], 'arithmetic', A(5), ['+6 each time', '×2 each time'], '11 − 6 = 5, 16 − 11 = 5, 21 − 16 = 5: common difference +5.'),
  seq('p1-a-6', 'p1-arithmetic', [40, 34, 28, 22], [16, 10], 'arithmetic', A(-6), ['+6 each time', '÷2 each time'], '34 − 40 = −6 each time: common difference −6.'),

  // Geometric: the same number multiplied
  seq('p1-g-1', 'p1-geometric', [3, 6, 12, 24], [48, 96], 'geometric', '×2 each time', ['+3 each time', 'The increase grows by 3'], 'Each term is double the one before: common ratio ×2.'),
  seq('p1-g-2', 'p1-geometric', [81, 27, 9], [3, 1], 'geometric', '÷3 (×⅓) each time', ['−54 each time', '−18 each time'], '81 ÷ 3 = 27, 27 ÷ 3 = 9: common ratio ÷3, which is ×⅓.'),
  seq('p1-g-3', 'p1-geometric', [64, 32, 16, 8], [4, 2], 'geometric', '÷2 (×½) each time', ['−32 each time', '−16 each time'], 'Halve each time: common ratio ÷2, which is ×½.'),
  seq('p1-g-4', 'p1-geometric', [4, 12, 36, 108], [324, 972], 'geometric', '×3 each time', ['+8 each time', '+24 each time'], '12 ÷ 4 = 3, 36 ÷ 12 = 3: common ratio ×3.'),
  seq('p1-g-5', 'p1-geometric', [5, 10, 20, 40], [80, 160], 'geometric', '×2 each time', ['+5 each time', '+10 each time'], 'Each term doubles: common ratio ×2.'),
  seq('p1-g-6', 'p1-geometric', [1, 4, 16, 64], [256, 1024], 'geometric', '×4 each time', ['+3 each time', 'The increase grows by 3'], '4 ÷ 1 = 4, 16 ÷ 4 = 4: common ratio ×4.'),

  // Neither: the increase changes
  seq('p1-n-1', 'p1-neither', [2, 5, 9, 14], [20, 27], 'neither', 'The increase grows by 1: +3, +4, +5…', ['+3 each time', '×2 each time'], 'The increases are +3, +4, +5, so next +6 and +7. Not a fixed difference, not a fixed ratio.'),
  seq('p1-n-2', 'p1-neither', [1, 2, 4, 7, 11, 16], [22, 29], 'neither', 'The increase grows by 1: +1, +2, +3…', ['×2 each time', '+1 each time'], 'The increases are +1, +2, +3, +4, +5, so next +6 and +7. 2 ÷ 1 = 2 but 7 ÷ 4 is not 2, so not geometric.'),
  seq('p1-n-3', 'p1-neither', [1, 3, 6, 10], [15, 21], 'neither', 'The increase grows by 1: +2, +3, +4…', ['+2 each time', '×3 each time'], 'Triangular numbers: +2, +3, +4, then +5 and +6.'),
  seq('p1-n-4', 'p1-neither', [1, 4, 9, 16], [25, 36], 'neither', 'The increase grows by 2: +3, +5, +7…', ['+3 each time', '×4 each time'], 'Square numbers: 1², 2², 3², 4². The increases are the odd numbers +3, +5, +7, then +9 and +11.'),
  seq('p1-n-5', 'p1-neither', [3, 4, 6, 9, 13], [18, 24], 'neither', 'The increase grows by 1: +1, +2, +3…', ['+1 each time', '×2 each time'], 'The increases are +1, +2, +3, +4, so next +5 and +6.'),

  // The words: common difference, common ratio
  {
    id: 'p1-w-1', concept: 'p1-evidence', type: 'choice', prompt: 'A sequence where you multiply by the same number each time is called…',
    options: ['geometric', 'arithmetic', 'neither'], answer: 0,
    explain: 'Geometric: a fixed ratio. Each term is the one before times the same number.',
    whyNot: { arithmetic: 'Arithmetic means the same number is ADDED (or subtracted) each time.', neither: '"Neither" is for sequences with no fixed difference and no fixed ratio.' },
  } satisfies ChoiceItem,
  {
    id: 'p1-w-2', concept: 'p1-evidence', type: 'choice', prompt: 'How do you find the common difference of an arithmetic sequence?',
    options: ['Any term minus the term before it', 'Any term divided by the term before it', 'The first term plus the last term', 'Count the terms'], answer: 0,
    explain: 'Common difference = any term − the term before it. For 20, 17, 14: 17 − 20 = −3.',
    whyNot: {
      'Any term divided by the term before it': 'Dividing gives the common RATIO, for geometric sequences.',
      'The first term plus the last term': 'The difference is between two terms next to each other.',
      'Count the terms': 'Counting tells you how many terms there are, not how they change.',
    },
  } satisfies ChoiceItem,
  nums('p1-w-3', 'p1-evidence', 'What is the common difference of 31, 27, 23, 19?', [{ label: 'Common difference', answer: -4, calc: '27 - 31' }],
    ['Take any term minus the one before it.', '27 − 31 = −4.'], { slips: [{ answer: 4, say: 'The terms go DOWN, so the difference is negative: 27 − 31 = −4.' }] }),
  nums('p1-w-4', 'p1-evidence', 'What is the common ratio of 2, 6, 18, 54? (What do you multiply by?)', [{ label: 'Multiply by', answer: 3, calc: '6 / 2' }],
    ['Divide any term by the one before it.', '6 ÷ 2 = 3, 18 ÷ 6 = 3.'], { slips: [{ answer: 4, say: '4 is the first difference (6 − 2). For a ratio, divide: 6 ÷ 2 = 3.' }] }),
  {
    id: 'p1-w-5', concept: 'p1-evidence', type: 'choice', prompt: 'Which one does NOT belong? A: 2, 4, 8, 16 · B: 1, 4, 9, 16 · C: 3, 7, 11, 15 · D: 1, 3, 6, 10',
    options: ['C: it is the only arithmetic one', 'A: it has an 8', 'B: it ends in 16', 'D: it starts with 1'], answer: 0,
    explain: 'C adds 4 each time: the only arithmetic one. (A is the only geometric one, so "A" can be defended too, with that reason.)',
    whyNot: {
      'A: it has an 8': 'Give a mathematical reason: A is the only geometric one (×2), not "it has an 8".',
      'B: it ends in 16': 'A ends in 16 too. Look at how each sequence grows instead.',
      'D: it starts with 1': 'B starts with 1 too. Look at how each sequence grows instead.',
    },
  } satisfies ChoiceItem,

  // Evidence, not just an answer (Criterion C)
  {
    id: 'p1-e-q1', concept: 'p1-evidence', type: 'choice', prompt: 'Pattern battle: 1, 2, 4, 7, 11, 16. Who has better evidence?',
    options: ['B: "The increase changes each time"', 'A: "It must be arithmetic because it goes up"'], answer: 0,
    explain: 'B checks the differences: +1, +2, +3, +4, +5. They change, so it is not arithmetic. Going up is not evidence.',
    whyNot: { 'A: "It must be arithmetic because it goes up"': 'Going up is not enough: arithmetic needs the SAME difference every time. Here it is +1, +2, +3…' },
  } satisfies ChoiceItem,
  {
    id: 'p1-e-q2', concept: 'p1-evidence', type: 'choice', prompt: 'Why is 1, 3, 6, 10, 15 neither arithmetic nor geometric?',
    options: [
      'The differences change (+2, +3, +4, +5) and the ratios change too',
      'Because it has odd and even numbers',
      'Because it goes up',
      'Because 15 is the last term',
    ], answer: 0,
    explain: 'Arithmetic needs one fixed difference; geometric needs one fixed ratio (3 ÷ 1 = 3 but 6 ÷ 3 = 2). This has neither.',
    whyNot: {
      'Because it has odd and even numbers': 'Arithmetic sequences can mix odd and even (2, 5, 8, 11). Check the differences instead.',
      'Because it goes up': 'Arithmetic and geometric sequences can go up too. Check the differences and ratios.',
      'Because 15 is the last term': 'Where it stops does not matter. Look at how it grows.',
    },
  } satisfies ChoiceItem,
];

export const p1: Topic = { id: 'P1', title: 'Sequences: arithmetic, geometric or neither', short: 'Sequences', items };
