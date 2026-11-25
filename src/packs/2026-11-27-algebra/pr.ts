// PR: Visual patterns and rules (Parts D2 and D3): matchsticks, tile cross, toothpicks, dot patterns;
// from a pattern to the nth-term rule; the value of a far term; which term equals N.
import { nums, rule } from '../../content/maths';
import type { ChoiceItem, Item, MatchItem, Picture, Topic } from '../../content/types';

const pic = (kind: Picture['kind'], figures = [1, 2, 3]): Picture => ({ kind, figures });

const items: Item[] = [
  // Matchstick squares: m = 3n + 1
  nums('pr-m-1', 'pr-matchsticks', 'Matchstick squares in a row. How many matchsticks in figure 5 and in figure 8?',
    [{ label: 'Figure 5', answer: 16, calc: '3*5+1' }, { label: 'Figure 8', answer: 25, calc: '3*8+1' }],
    ['Count: 4, 7, 10… Each new square shares one side, so it needs only 3 new sticks.', 'Rule: m = 3n + 1.', 'Figure 5: 3 × 5 + 1 = 16. Figure 8: 3 × 8 + 1 = 25.', '16 and 25.'],
    { picture: pic('matchsticks'), slips: [{ answer: 20, say: '4 × 5 counts the shared sides twice. Each new square needs only 3 new sticks: 3 × 5 + 1 = 16.' }] }),
  nums('pr-m-2', 'pr-matchsticks', 'Matchstick squares in a row. How many matchsticks in figure 12 and in figure 20?',
    [{ label: 'Figure 12', answer: 37, calc: '3*12+1' }, { label: 'Figure 20', answer: 61, calc: '3*20+1' }],
    ['The rule is m = 3n + 1 (first square 4, then +3 for each new square).', 'Figure 12: 3 × 12 + 1 = 37.', 'Figure 20: 3 × 20 + 1 = 61.', '37 and 61.'],
    { picture: pic('matchsticks'), slips: [{ answer: 48, say: '4 × 12 counts the shared sides twice. Use m = 3n + 1: 3 × 12 + 1 = 37.' }] }),
  nums('pr-m-3', 'pr-matchsticks', 'Matchstick squares in a row. Which figure uses 31 matchsticks?',
    [{ label: 'Figure', answer: 10, calc: '(31-1)/3' }],
    ['The rule is m = 3n + 1.', 'Solve 3n + 1 = 31: take 1 away, 3n = 30.', 'Divide by 3: n = 10.', 'Figure 10.'], { picture: pic('matchsticks') }),
  nums('pr-m-4', 'pr-matchsticks', 'Matchstick squares in a row. Which figure uses 40 matchsticks?',
    [{ label: 'Figure', answer: 13, calc: '(40-1)/3' }],
    ['The rule is m = 3n + 1.', 'Solve 3n + 1 = 40: take 1 away, 3n = 39.', 'Divide by 3: n = 13.', 'Figure 13.'], { picture: pic('matchsticks') }),
  {
    id: 'pr-m-q1', concept: 'pr-matchsticks', type: 'choice', picture: pic('matchsticks'),
    prompt: 'Matchstick debate. A says m = 4n "because every square has four sides". B says m = 3n + 1. Who is right?',
    options: ['B: squares share a side, and 3n + 1 gives 4, 7, 16 for n = 1, 2, 5', 'A: every square has four sides', 'Both are right'], answer: 0,
    explain: 'Test both: A gives 4, 8, 20 but the pictures have 4, 7, 16. Only B matches. 4n counts each shared side twice.',
    whyNot: { 'A: every square has four sides': 'Test it on figure 2: 4n gives 8, but the picture has 7, because the squares share a side.', 'Both are right': 'They give different numbers for figure 2 (8 and 7). Only one matches the picture: 7.' },
  } satisfies ChoiceItem,

  // Tile cross: t = 4n + 1
  nums('pr-t-1', 'pr-tiles', 'A tile cross: one centre tile and four arms that each grow by one tile. How many tiles at stage 6 and stage 8?',
    [{ label: 'Stage 6', answer: 25, calc: '4*6+1' }, { label: 'Stage 8', answer: 33, calc: '4*8+1' }],
    ['Count: 5, 9, 13… four new tiles each stage (one on each arm).', 'Rule: t = 4n + 1 (the 1 is the centre tile).', 'Stage 6: 4 × 6 + 1 = 25. Stage 8: 4 × 8 + 1 = 33.', '25 and 33.'], { picture: pic('tile-cross') }),
  nums('pr-t-2', 'pr-tiles', 'A tile cross: t = 4n + 1. How many tiles at stage 12?',
    [{ label: 'Stage 12', answer: 49, calc: '4*12+1' }],
    ['Use the rule t = 4n + 1.', 'Substitute n = 12: 4 × 12 + 1.', '48 + 1 = 49.', '49 tiles.'], { picture: pic('tile-cross') }),
  nums('pr-t-3', 'pr-tiles', 'A tile cross: t = 4n + 1. Which stage has 41 tiles?',
    [{ label: 'Stage', answer: 10, calc: '(41-1)/4' }],
    ['Solve 4n + 1 = 41.', 'Take away the centre tile: 4n = 40.', 'Divide by 4: n = 10.', 'Stage 10.'], { picture: pic('tile-cross') }),
  nums('pr-t-4', 'pr-tiles', 'Matchsticks: m = 3n + 1. Tile cross: t = 4n + 1. At n = 20, how many more tiles than matchsticks?',
    [{ label: 'More tiles', answer: 20, calc: '(4*20+1)-(3*20+1)' }],
    ['Work out both: m = 3 × 20 + 1 = 61; t = 4 × 20 + 1 = 81.', 'Subtract: 81 − 61 = 20.', 'The difference is always n: the cross adds 4 each step, the sticks add 3.', '20 more.']),
  {
    id: 'pr-t-q1', concept: 'pr-tiles', type: 'choice', picture: pic('tile-cross'),
    prompt: 'In the tile cross rule t = 4n + 1, what do the 4 and the 1 mean?',
    options: ['4: the four arms each grow by one tile. 1: the centre tile that stays', '4: the first stage. 1: one new tile each time', '4: four stages. 1: the first arm'], answer: 0,
    explain: 'Each stage adds one tile to each of the 4 arms (+4), and the centre tile is always there (+1).',
    whyNot: { '4: the first stage. 1: one new tile each time': 'Each stage adds FOUR tiles, one per arm. That is why n is multiplied by 4.', '4: four stages. 1: the first arm': 'The 4 is how many tiles are added each stage; the 1 is the centre tile.' },
  } satisfies ChoiceItem,

  // Toothpick triangles: t = 2n + 1
  nums('pr-p-1', 'pr-toothpicks', 'Toothpick triangles in a row (each new one shares a side). How many toothpicks in figures 5 and 6?',
    [{ label: 'Figure 5', answer: 11, calc: '2*5+1' }, { label: 'Figure 6', answer: 13, calc: '2*6+1' }],
    ['Count: 3, 5, 7… each new triangle needs only 2 new toothpicks.', 'Rule: t = 2n + 1.', 'Figure 5: 11. Figure 6: 13.', '11 and 13.'], { picture: pic('toothpicks') }),
  nums('pr-p-2', 'pr-toothpicks', 'Toothpick triangles: t = 2n + 1. How many toothpicks in figure 15?',
    [{ label: 'Figure 15', answer: 31, calc: '2*15+1' }],
    ['Use the rule t = 2n + 1.', '2 × 15 + 1 = 31.', 'Check with a small figure: figure 1 = 3 ✓.', '31.'], { picture: pic('toothpicks') }),
  nums('pr-p-3', 'pr-toothpicks', 'Triangles t = 2n + 1, squares m = 3n + 1. At n = 8, how many more sticks do the squares need?',
    [{ label: 'More sticks', answer: 8, calc: '(3*8+1)-(2*8+1)' }],
    ['Triangles: 2 × 8 + 1 = 17.', 'Squares: 3 × 8 + 1 = 25.', '25 − 17 = 8.', '8 more.']),
  nums('pr-p-4', 'pr-toothpicks', 'Toothpick triangles: t = 2n + 1. Which figure uses 21 toothpicks?',
    [{ label: 'Figure', answer: 10, calc: '(21-1)/2' }],
    ['Solve 2n + 1 = 21.', '2n = 20.', 'n = 10.', 'Figure 10.'], { picture: pic('toothpicks') }),

  // Dot patterns (not arithmetic)
  nums('pr-d-1', 'pr-dots', 'Dot triangles: 1, 3, 6, 10. How many dots in figures 5 and 6?',
    [{ label: 'Figure 5', answer: 15, calc: '10+5' }, { label: 'Figure 6', answer: 21, calc: '10+5+6' }],
    ['The increases are +2, +3, +4.', 'Each figure adds a new row with one more dot.', 'Figure 5 adds 5: 10 + 5 = 15. Figure 6 adds 6: 21.', '15 and 21.'], { picture: pic('dot-triangles', [1, 2, 3, 4]) }),
  nums('pr-d-3', 'pr-dots', 'Dot triangles: 1, 3, 6, 10, 15, 21. How many dots in figures 7 and 8?',
    [{ label: 'Figure 7', answer: 28, calc: '21+7' }, { label: 'Figure 8', answer: 36, calc: '21+7+8' }],
    ['The increases are +2, +3, +4, +5, +6.', 'The next increases are +7 and +8.', 'Figure 7: 21 + 7 = 28. Figure 8: 28 + 8 = 36.', '28 and 36.'], { picture: pic('dot-triangles', [1, 2, 3, 4]) }),
  {
    id: 'pr-d-q1', concept: 'pr-dots', type: 'choice', picture: pic('dot-triangles', [1, 2, 3, 4]),
    prompt: 'Why is the dot triangle pattern 1, 3, 6, 10 NOT arithmetic?',
    options: ['The increase is not fixed: +2, +3, +4', 'Because the dots make triangles', 'Because it starts at 1', 'It is arithmetic'], answer: 0,
    explain: 'Arithmetic needs the same difference every time. Here each figure adds one more dot than the last: +2, +3, +4, +5.',
    whyNot: { 'Because the dots make triangles': 'The shape is not the reason: check the differences between the numbers.', 'Because it starts at 1': 'Where it starts does not matter. The differences change, so it is not arithmetic.', 'It is arithmetic': 'The differences are +2, +3, +4: not the same, so not arithmetic.' },
  } satisfies ChoiceItem,

  // From a sequence to a rule
  rule('pr-r-1', 'pr-rule', [3, 7, 11, 15], '4n − 1', 'Write the nth-term rule for this sequence.'),
  rule('pr-r-2', 'pr-rule', [6, 10, 14, 18], '4n + 2', 'Write the nth-term rule for this sequence.'),
  rule('pr-r-3', 'pr-rule', [5, 8, 11, 14], '3n + 2', 'Write the nth-term rule for this sequence.'),
  rule('pr-r-4', 'pr-rule', [2, 5, 8, 11], '3n − 1', 'Write the nth-term rule for this sequence.'),
  rule('pr-r-5', 'pr-rule', [1, 3, 5, 7], '2n − 1', 'Write the nth-term rule for this sequence (the odd numbers).'),

  // From a picture to a rule
  rule('pr-g-1', 'pr-rule-picture', [4, 7, 10], '3n + 1', 'Matchstick squares: write the rule for the number of sticks in figure n.', pic('matchsticks')),
  rule('pr-g-2', 'pr-rule-picture', [5, 9, 13], '4n + 1', 'Tile cross: write the rule for the number of tiles at stage n.', pic('tile-cross')),
  rule('pr-g-3', 'pr-rule-picture', [3, 5, 7], '2n + 1', 'Toothpick triangles: write the rule for the number of toothpicks in figure n.', pic('toothpicks')),
  rule('pr-g-4', 'pr-rule-picture', [6, 10, 14], '4n + 2', 'Mosaic: 4 new blue tiles each stage and 2 orange tiles that stay. Write the rule for stage n.', pic('mosaic')),

  // A far term: use the rule, do not list
  nums('pr-n-1', 'pr-use-rule', 'Find the 20th term of 3, 7, 11, 15, … without listing all the terms.',
    [{ label: '20th term', answer: 79, calc: '4*20-1' }],
    ['The rule is 4n − 1 (common difference 4).', 'Substitute n = 20: 4 × 20 − 1.', '80 − 1 = 79. (Or: start 3, add 4 nineteen times: 3 + 19 × 4.)', '79.'],
    { slips: [{ answer: 83, say: 'From term 1 to term 20 you add 4 nineteen times, not twenty: 3 + 19 × 4 = 79.' }] }),
  nums('pr-n-2', 'pr-use-rule', 'Number machine y = 3x − 1. What is y when x = 12?',
    [{ label: 'y', answer: 35, calc: '3*12-1' }], ['Substitute x = 12.', '3 × 12 = 36.', '36 − 1 = 35.', '35.']),
  nums('pr-n-3', 'pr-use-rule', 'y = 4x + 2. What is term 15?', [{ label: 'Term 15', answer: 62, calc: '4*15+2' }],
    ['Substitute x = 15.', '4 × 15 = 60.', '60 + 2 = 62.', '62.']),
  nums('pr-n-4', 'pr-use-rule', 'Find the 30th term of 5, 8, 11, 14, …', [{ label: '30th term', answer: 92, calc: '3*30+2' }],
    ['Common difference 3, so the rule is 3n + 2 (check: n = 1 gives 5 ✓).', 'Substitute n = 30: 3 × 30 + 2.', '90 + 2 = 92.', '92.']),

  // Which term equals N?
  nums('pr-w-1', 'pr-use-rule', 'The rule is 4n + 2. Which term equals 62?', [{ label: 'n', answer: 15, calc: '(62-2)/4' }],
    ['Solve 4n + 2 = 62.', 'Take away 2: 4n = 60.', 'Divide by 4: n = 15.', 'Term 15.']),
  nums('pr-w-2', 'pr-use-rule', 'The rule is 5n + 4. Which term equals 104?', [{ label: 'n', answer: 20, calc: '(104-4)/5' }],
    ['Solve 5n + 4 = 104.', 'Take away 4: 5n = 100.', 'Divide by 5: n = 20.', 'Term 20.']),
  nums('pr-w-3', 'pr-use-rule', 'The rule is 2n − 1. Which term equals 39?', [{ label: 'n', answer: 20, calc: '(39+1)/2' }],
    ['Solve 2n − 1 = 39.', 'Add 1: 2n = 40.', 'Divide by 2: n = 20.', 'Term 20.']),
  nums('pr-w-4', 'pr-use-rule', 'The rule is 3n + 5. Which term equals 50?', [{ label: 'n', answer: 15, calc: '(50-5)/3' }],
    ['Solve 3n + 5 = 50.', 'Take away 5: 3n = 45.', 'Divide by 3: n = 15.', 'Term 15.']),

  // What the numbers in a rule mean
  {
    id: 'pr-c-q1', concept: 'pr-meaning', type: 'choice', prompt: 'In y = 4x + 2, what does the 4 tell you?',
    options: ['Add 4 each time (the common difference)', 'The first term is 4', 'There are 4 terms', 'Multiply by 4 each time'], answer: 0,
    explain: 'The number in front of x is the common difference: y = 4x + 2 gives 6, 10, 14, 18 (+4 each time).',
    whyNot: { 'The first term is 4': 'The first term is 4 × 1 + 2 = 6.', 'There are 4 terms': 'A rule works for every term. The 4 is how much is added each time.', 'Multiply by 4 each time': 'That would be geometric. Here each term is 4 MORE than the last.' },
  } satisfies ChoiceItem,
  {
    id: 'pr-c-q2', concept: 'pr-meaning', type: 'choice', prompt: 'y = 4 − 2x gives 2, 0, −2, −4. Why does it go down?',
    options: ['The number in front of x is negative (−2)', 'Because it starts at 4', 'Because x gets smaller', 'It goes up'], answer: 0,
    explain: 'A negative coefficient makes the sequence decrease: −2 each time.',
    whyNot: { 'Because it starts at 4': 'The start does not decide the direction. The −2 in front of x does.', 'Because x gets smaller': 'x goes 1, 2, 3, 4 (bigger). It is the −2 that makes y fall.', 'It goes up': '2, 0, −2, −4 goes down by 2 each time.' },
  } satisfies ChoiceItem,
  {
    id: 'pr-c-q3', concept: 'pr-meaning', type: 'choice', prompt: 'Which formula fits 6, 10, 14, 18?',
    options: ['y = 4n + 2', 'y = 2n + 4', 'y = 6n'], answer: 0,
    explain: 'Check n = 1 AND n = 4: 4(1) + 2 = 6 ✓ and 4(4) + 2 = 18 ✓.',
    whyNot: { 'y = 2n + 4': 'n = 1 gives 6 ✓ but n = 4 gives 12, not 18. Matching the first term alone is not enough.', 'y = 6n': 'n = 1 gives 6 ✓ but n = 2 gives 12, not 10.' },
  } satisfies ChoiceItem,
  {
    id: 'pr-c-m1', concept: 'pr-meaning', type: 'match', prompt: 'Match each formula to its description. Test x = 1 and x = 4.',
    pairs: [
      { left: 'y = 4x + 2', right: 'Start 6, add 4' },
      { left: 'y = 2x + 5', right: 'Start 7, add 2' },
      { left: 'y = 12 − 3x', right: 'Start 9, subtract 3' },
    ],
    explain: 'y = 4x + 2 → 6, 10, 14, 18. y = 2x + 5 → 7, 9, 11, 13. y = 12 − 3x → 9, 6, 3, 0.',
  } satisfies MatchItem,
];

export const pr: Topic = { id: 'PR', title: 'Visual patterns and nth-term rules', short: 'Patterns and rules', items };
