// IN: Real-life rules and investigations (Part D5) and Criterion C, communicating (Part D6).
// The Criterion B steps: find what changes, table, general rule, test it, justify it.
import { nums, rule } from '../../content/maths';
import type { ChoiceItem, Item, OrderItem, ShortItem, Topic } from '../../content/types';

const items: Item[] = [
  // Using a real-life rule
  nums('in-v-1', 'in-use-rule', 'Sticker shop: 3 stickers in each pack, plus 2 bonus stickers per order. y = 3x + 2 (x = packs). How many stickers for 10 packs?',
    [{ label: 'Stickers', answer: 32, calc: '3*10+2' }], ['Substitute x = 10.', '3 × 10 = 30 stickers in the packs.', '30 + 2 bonus = 32.', '32 stickers.']),
  nums('in-v-2', 'in-use-rule', 'School fair: tickets cost 3 GEL each, plus a 5 GEL booking fee per order. y = 3x + 5. What do 15 tickets cost?',
    [{ label: 'GEL', answer: 50, calc: '3*15+5' }], ['Substitute x = 15.', '3 × 15 = 45 GEL for the tickets.', '45 + 5 booking fee = 50.', '50 GEL.']),
  nums('in-v-3', 'in-use-rule', 'Concert seating: row 1 has 12 seats and each row has 3 more. s = 3n + 9. How many seats in row 20?',
    [{ label: 'Seats', answer: 69, calc: '3*20+9' }], ['Substitute n = 20.', '3 × 20 = 60.', '60 + 9 = 69. (Check row 1: 3 + 9 = 12 ✓.)', '69 seats.']),
  nums('in-v-4', 'in-use-rule', 'Garden stepping stones: path 1 has 9 stones and each path has 5 more. s = 5n + 4. How many stones in path 20?',
    [{ label: 'Stones', answer: 104, calc: '5*20+4' }], ['Substitute n = 20.', '5 × 20 = 100.', '100 + 4 = 104. (Check path 1: 5 + 4 = 9 ✓.)', '104 stones.']),
  nums('in-v-5', 'in-use-rule', 'Mosaic: 4 new blue tiles each stage and 2 orange tiles that stay. t = 4n + 2. How many tiles at stage 8 and stage 20?',
    [{ label: 'Stage 8', answer: 34, calc: '4*8+2' }, { label: 'Stage 20', answer: 82, calc: '4*20+2' }],
    ['Substitute each stage number.', 'Stage 8: 4 × 8 + 2 = 34.', 'Stage 20: 4 × 20 + 2 = 82.', '34 and 82.'], { picture: { kind: 'mosaic', figures: [1, 2, 3] } }),

  // Working backwards: which one gives N?
  nums('in-b-1', 'in-use-rule', 'School fair: y = 3x + 5 (GEL). A receipt says 50 GEL. How many tickets were bought?',
    [{ label: 'Tickets', answer: 15, calc: '(50-5)/3' }], ['Solve 3x + 5 = 50.', 'Take away the booking fee: 3x = 45.', 'Divide by 3: x = 15.', '15 tickets.']),
  nums('in-b-2', 'in-use-rule', 'Mosaic: t = 4n + 2. Which stage uses 62 tiles?',
    [{ label: 'Stage', answer: 15, calc: '(62-2)/4' }], ['Solve 4n + 2 = 62.', 'Take away the 2 orange tiles: 4n = 60.', 'Divide by 4: n = 15.', 'Stage 15.'], { picture: { kind: 'mosaic', figures: [1, 2, 3] } }),
  nums('in-b-3', 'in-use-rule', 'Sticker shop: y = 3x + 2. An order has 38 stickers. How many packs?',
    [{ label: 'Packs', answer: 12, calc: '(38-2)/3' }], ['Solve 3x + 2 = 38.', 'Take away the 2 bonus stickers: 3x = 36.', 'Divide by 3: x = 12.', '12 packs.']),
  nums('in-b-4', 'in-use-rule', 'Concert seating: s = 3n + 9. Which row has 45 seats?',
    [{ label: 'Row', answer: 12, calc: '(45-9)/3' }], ['Solve 3n + 9 = 45.', 'Take away 9: 3n = 36.', 'Divide by 3: n = 12.', 'Row 12.']),

  // Finding a real-life rule
  rule('in-r-1', 'in-find-rule', [5, 8, 11, 14], '3x + 2', 'Sticker shop: 1 pack gives 5 stickers, 2 packs give 8, 3 packs give 11. Write the rule for x packs.', undefined, 'x'),
  rule('in-r-2', 'in-find-rule', [8, 11, 14, 17], '3x + 5', 'School fair: 1 ticket costs 8 GEL, 2 cost 11, 3 cost 14 (with the booking fee). Write the rule for x tickets.', undefined, 'x'),
  rule('in-r-3', 'in-find-rule', [12, 15, 18, 21], '3n + 9', 'Concert seating: row 1 has 12 seats, row 2 has 15, row 3 has 18. Write the rule for row n.'),
  rule('in-r-4', 'in-find-rule', [9, 14, 19, 24], '5n + 4', 'Stepping stones: path 1 has 9 stones, path 2 has 14, path 3 has 19. Write the rule for path n.'),

  // What each number in the rule represents
  {
    id: 'in-m-q1', concept: 'in-meaning', type: 'choice', prompt: 'School fair: y = 3x + 5. What does the 5 represent?',
    options: ['The 5 GEL booking fee, paid once per order', 'The price of one ticket', 'The number of tickets', 'The total cost'], answer: 0,
    explain: 'The 5 is added once, whatever the number of tickets: the booking fee. The 3 is the price of each ticket.',
    whyNot: { 'The price of one ticket': 'The price per ticket is multiplied by x: that is the 3.', 'The number of tickets': 'The number of tickets is x, the variable.', 'The total cost': 'The total cost is y.' },
  } satisfies ChoiceItem,
  {
    id: 'in-m-q2', concept: 'in-meaning', type: 'choice', prompt: 'Mosaic: t = 4n + 2. What does the 2 represent?',
    options: ['The 2 orange tiles that are there at every stage', '2 new tiles each stage', 'Stage 2', 'Half the blue tiles'], answer: 0,
    explain: 'The 2 does not change with n: the permanent orange tiles. The 4n is the 4 new blue tiles at each stage.',
    whyNot: { '2 new tiles each stage': 'Each stage adds 4 new tiles: that is the 4 in front of n.', 'Stage 2': 'n is the stage number. The 2 is added at every stage.', 'Half the blue tiles': 'The blue tiles are the 4n part.' },
  } satisfies ChoiceItem,
  {
    id: 'in-m-q3', concept: 'in-meaning', type: 'choice', prompt: 'Concert seating: s = 3n + 9. Which sentence justifies it best?',
    options: [
      'Row 1 has 12 seats, and 3 seats are added for every new row after row 1',
      'It is obvious because the rows go up',
      'Because that is the rule',
      'The 9 is the number of rows',
    ], answer: 0,
    explain: 'This is your teacher\'s justification: it links the numbers in the rule to the real situation. 3n + 9 = 12 + 3(n − 1).',
    whyNot: {
      'It is obvious because the rows go up': '"Obvious" is not a reason. Say what changes and by how much.',
      'Because that is the rule': 'Your teacher says: never only "because that is the rule". Explain where the numbers come from.',
      'The 9 is the number of rows': 'n is the row number. 9 is what is left when you take 3 from the 12 seats of row 1.',
    },
  } satisfies ChoiceItem,

  // The Criterion B steps
  {
    id: 'in-s-o1', concept: 'in-explain', type: 'order', prompt: 'Put your teacher\'s Criterion B steps for an investigation in order.',
    steps: ['Find and describe what changes', 'Organise the values in a table', 'Form a general rule', 'Test the rule on another term', 'Justify the conclusion'],
  } satisfies OrderItem,
  {
    id: 'in-s-q1', concept: 'in-explain', type: 'choice', prompt: 'You found the rule 5n + 4 from the first three paths. What should you do next?',
    options: ['Test it on another term, for example path 4: 5(4) + 4 = 24', 'Stop: the rule is found', 'Make the rule shorter', 'Start a new pattern'], answer: 0,
    explain: 'Criterion B step 4: test (verify) the rule on another term. Path 4 has 24 stones, and 5(4) + 4 = 24 ✓.',
    whyNot: { 'Stop: the rule is found': 'For the top marks you must TEST the rule and justify it.', 'Make the rule shorter': '5n + 4 is already simple. Testing it is the next step.', 'Start a new pattern': 'First finish this one: test the rule, then justify it.' },
  } satisfies ChoiceItem,
  {
    id: 'in-s-q2', concept: 'in-explain', type: 'choice', prompt: 'Which answer gets the most Criterion B marks?',
    options: [
      'Found the rule, tested it on a new term, and explained why it works',
      'Continued the pattern for three more terms',
      'Found the rule',
      'Drew the next picture',
    ], answer: 0,
    explain: 'Criterion B 7–8 marks: find, TEST (verify) and JUSTIFY the general rule.',
    whyNot: { 'Continued the pattern for three more terms': 'Continuing a pattern is 3–4 marks. A tested, justified rule gets 7–8.', 'Found the rule': 'Finding a rule is 5–6 marks. Test it and justify it for 7–8.', 'Drew the next picture': 'That shows the pattern, but a general rule is needed for the higher marks.' },
  } satisfies ChoiceItem,

  // Criterion C: explaining clearly
  {
    id: 'in-c-q1', concept: 'in-explain', type: 'choice', prompt: '"The rule is 4n + 2. It is obvious because the pattern goes up. My answer is correct." What is missing?',
    options: ['What n means, a table, why 4 and 2, and a test on a new stage', 'Nothing, it is a full explanation', 'Only a picture', 'A longer rule'], answer: 0,
    explain: 'Your teacher\'s checklist: define the variable, show a table or diagram, explain the rule (not guess it), and test it on a new stage.',
    whyNot: { 'Nothing, it is a full explanation': '"Obvious" and "correct" are not reasons. It never says what n is or why 4 and 2.', 'Only a picture': 'A picture helps, but it still needs what n means, why 4 and 2, and a test.', 'A longer rule': 'The rule is fine. The explanation is what is missing.' },
  } satisfies ChoiceItem,
  {
    id: 'in-c-q2', concept: 'in-explain', type: 'choice', prompt: 'Which sentence best says what n represents?',
    options: ['n is the figure number (1 for the first figure, 2 for the second…)', 'n is a number', 'n is the answer', 'n is the number of sticks'], answer: 0,
    explain: 'Define the variable clearly: n is the position, the figure or stage number.',
    whyNot: { 'n is a number': 'Too vague: WHICH number? Say it is the figure (position) number.', 'n is the answer': 'The answer (the number of sticks) is m, worked out FROM n.', 'n is the number of sticks': 'The number of sticks is what the rule gives you. n is the figure number.' },
  } satisfies ChoiceItem,
  {
    id: 'in-c-w1', concept: 'in-explain', type: 'short',
    prompt: 'Explain why y = 2n − 1 always gives odd numbers.',
    ideas: [
      { label: '2n is always even (a multiple of 2)', words: ['even', 'multiple of 2', 'times 2', '× 2', 'double'] },
      { label: 'One less than an even number is odd', words: ['one less', '1 less', 'minus 1', '− 1', '- 1', 'take away 1', 'subtract 1', 'odd'] },
    ],
    model: '2n is 2 times a whole number, so it is always even. Taking away 1 from an even number always gives an odd number. So 2n − 1 gives 1, 3, 5, 7, …: the odd numbers.',
  } satisfies ShortItem,
  {
    id: 'in-c-w2', concept: 'in-explain', type: 'short',
    prompt: 'Explain in two sentences how the matchstick pattern grows, then predict figure 8.',
    ideas: [
      { label: 'It starts with 4 sticks, and each figure adds 3 (shared side)', words: ['add 3', 'adds 3', '+3', '3 more', 'three more', '3 new', 'share'] },
      { label: 'Figure 8 has 25 sticks', words: ['25', 'twenty-five', 'twenty five'] },
    ],
    model: 'My pattern begins with 4 matchsticks. Each new figure adds 3 matchsticks, because each new square shares a side. Therefore figure n has 3n + 1 matchsticks, and figure 8 has 3(8) + 1 = 25. I checked this using figure 2: 3(2) + 1 = 7 ✓.',
  } satisfies ShortItem,
  {
    id: 'in-c-w3', concept: 'in-meaning', type: 'short',
    prompt: 'The tile cross rule is t = 4n + 1. Explain what the 4 and the 1 mean in the picture.',
    ideas: [
      { label: 'The 4: each of the four arms grows by one tile each stage', words: ['four arms', '4 arms', 'arms', 'each arm', '4 new', 'four new'] },
      { label: 'The 1: the centre tile, which stays', words: ['centre', 'center', 'middle', 'stays', 'one tile'] },
    ],
    model: 'The 4 means four new tiles at each stage: each of the four arms grows by one tile. The 1 is the centre tile, which is there at every stage and does not grow. So stage n has 4n + 1 tiles.',
  } satisfies ShortItem,
];

export const inv: Topic = { id: 'IN', title: 'Real-life rules, investigations and explaining', short: 'Investigations', items };
