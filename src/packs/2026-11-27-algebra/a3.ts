// A3: Multiplying terms and the product rule for exponents (Operations, Day 2: the lesson Adele missed, 24 Nov).
// From the teacher's lesson: the 3-step method (signs, numbers, letters), "why exponents ADD", 2x² ≠ (2x)².
// Every idea has several versions with different numbers, so a miss comes back with new numbers.
// None of these is a question from the homework due 25 Nov (packs.test.ts checks this).
import { mul } from '../../content/maths';
import type { ChoiceItem, Item, PairItem, ShortItem, Topic } from '../../content/types';

const items: Item[] = [
  // A number times a term
  mul('a3-n-1', 'a3-basic', '2x × 3', '6x'),
  mul('a3-n-2', 'a3-basic', '5 × 4y', '20y'),
  mul('a3-n-3', 'a3-basic', '7x × (−2)', '−14x'),
  mul('a3-n-4', 'a3-basic', '−3 × 6k', '−18k'),
  mul('a3-n-5', 'a3-basic', '9m × 4', '36m'),

  // Two different letters
  mul('a3-t-1', 'a3-basic', '4m × 2n', '8mn'),
  mul('a3-t-2', 'a3-basic', '6a × 3b', '18ab'),
  mul('a3-t-3', 'a3-basic', '5p × 7q', '35pq'),
  mul('a3-t-4', 'a3-basic', '2c × 9d', '18cd'),
  mul('a3-t-5', 'a3-basic', '3y × 8x', '24xy', 'Multiply. Remember: letters go in alphabetical order.'),

  // Signs
  mul('a3-s-1', 'a3-signs', '−3a × 5b', '−15ab'),
  mul('a3-s-2', 'a3-signs', '−5m × (−2n)', '10mn'),
  mul('a3-s-3', 'a3-signs', '6x × (−4y)', '−24xy'),
  mul('a3-s-4', 'a3-signs', '(−7p)(−3q)', '21pq'),
  mul('a3-s-5', 'a3-signs', '(−8c)(2d)', '−16cd'),
  {
    id: 'a3-s-q1', concept: 'a3-signs', type: 'choice', prompt: 'What sign does (−4) × (−6) × (−2) have?',
    options: ['+ (positive)', '− (negative)'], answer: 1,
    explain: 'Count the minus signs: there are 3. Three is odd, so the answer is negative (−48).',
    whyNot: { '+ (positive)': 'Two minus signs would make +. Here there are three: the third one makes it − again.' },
  } satisfies ChoiceItem,
  {
    id: 'a3-s-q2', concept: 'a3-signs', type: 'choice', prompt: 'What sign does (−5x) × (−3y) have?',
    options: ['+ (positive)', '− (negative)'], answer: 0,
    explain: 'Two minus signs: an even number, so the answer is positive. (−5x)(−3y) = 15xy.',
    whyNot: { '− (negative)': 'A minus times a minus makes a plus. With two minus signs the answer is +.' },
  } satisfies ChoiceItem,

  // The same letter twice: x × x = x²
  mul('a3-l-1', 'a3-same-letter', '5y × 3y', '15y²'),
  mul('a3-l-2', 'a3-same-letter', '4k × 6k', '24k²'),
  mul('a3-l-3', 'a3-same-letter', '9a × (−2a)', '−18a²'),
  mul('a3-l-4', 'a3-same-letter', '(−3t)(−5t)', '15t²'),
  {
    id: 'a3-l-q1', concept: 'a3-same-letter', type: 'pair', prompt: '4y × 2y = ?',
    options: ['6y', '8y²'], answer: 1,
    explain: 'Multiply the numbers: 4 × 2 = 8. Then y × y = y². So 4y × 2y = 8y².',
    whyNot: { '6y': 'That is adding (4y + 2y). When multiplying, multiply the numbers and y × y = y².' },
  } satisfies PairItem,

  // The product rule: same base, ADD the powers
  mul('a3-p-1', 'a3-product-rule', 'x⁴ × x', 'x⁵', 'Multiply. Use the product rule.'),
  mul('a3-p-2', 'a3-product-rule', 'a³ × a⁵', 'a⁸', 'Multiply. Use the product rule.'),
  mul('a3-p-3', 'a3-product-rule', 'm² × m⁶', 'm⁸', 'Multiply. Use the product rule.'),
  mul('a3-p-4', 'a3-product-rule', 'y × y⁷', 'y⁸', 'Multiply. Use the product rule.'),
  mul('a3-p-5', 'a3-product-rule', 'k³ × k³', 'k⁶', 'Multiply. Use the product rule.'),
  {
    id: 'a3-p-q1', concept: 'a3-product-rule', type: 'choice', prompt: 'n⁵ × n² = ?',
    options: ['n⁷', 'n¹⁰', '2n⁷', 'n³'], answer: 0,
    explain: 'Same base, so add the powers: 5 + 2 = 7. n⁵ × n² = n⁷.',
    whyNot: {
      'n¹⁰': 'That multiplies the powers (5 × 2). Count the n\'s instead: 5 of them, then 2 more, makes 7.',
      '2n⁷': 'There is no 2 in front. Each n just counts as one factor; there is no number to multiply.',
      'n³': 'That subtracts the powers. When you multiply, the powers ADD.',
    },
  } satisfies ChoiceItem,

  // Numbers and powers together
  mul('a3-c-1', 'a3-coef-powers', '2p² × 3p³', '6p⁵'),
  mul('a3-c-2', 'a3-coef-powers', '4x³ × 5x²', '20x⁵'),
  mul('a3-c-3', 'a3-coef-powers', '(−2a²)(4a³)', '−8a⁵'),
  mul('a3-c-4', 'a3-coef-powers', '3k⁴ × (−2k)', '−6k⁵'),
  mul('a3-c-5', 'a3-coef-powers', '6m² × 2m⁵', '12m⁷'),
  {
    id: 'a3-c-w1', concept: 'a3-coef-powers', type: 'short',
    prompt: 'A student writes 4y³ × 2y² = 8y⁶. Explain the mistake, and give the right answer.',
    ideas: [
      { label: 'The powers were multiplied, but they should be added', words: ['add', 'added', 'adding', 'plus', '3 + 2', '3+2'] },
      { label: 'The right answer is 8y⁵', words: ['8y5', '8y⁵', 'y5', 'y⁵', '8 y5', 'y to the power 5', 'power of 5', 'power 5'] },
    ],
    model: 'The student multiplied the powers (3 × 2 = 6). When you multiply terms with the same base, you add the powers: y³ × y² = y³⁺² = y⁵. The numbers are right: 4 × 2 = 8. So 4y³ × 2y² = 8y⁵.',
  } satisfies ShortItem,

  // Different letters: the powers cannot be added
  mul('a3-d-1', 'a3-diff-bases', 'x² × y³', 'x²y³'),
  mul('a3-d-2', 'a3-diff-bases', '2a³ × 5b²', '10a³b²'),
  mul('a3-d-3', 'a3-diff-bases', 'm⁴ × n', 'm⁴n'),
  mul('a3-d-4', 'a3-diff-bases', '(−3p²)(4q³)', '−12p²q³'),
  {
    id: 'a3-d-q1', concept: 'a3-diff-bases', type: 'choice', prompt: 'a² × b⁴ = ?',
    options: ['a²b⁴', 'ab⁶', '(ab)⁶', 'a²b⁴ cannot be written'], answer: 0,
    explain: 'Different letters (bases), so you cannot add 2 and 4. Just write them side by side: a²b⁴.',
    whyNot: {
      'ab⁶': 'You can only add powers of the SAME letter. a and b are different, so each keeps its own power.',
      '(ab)⁶': 'You can only add powers of the same letter. a² and b⁴ stay as they are.',
      'a²b⁴ cannot be written': 'It can! Multiplying different letters is fine: just put them together, a²b⁴.',
    },
  } satisfies ChoiceItem,

  // Bigger terms, one letter at a time
  mul('a3-b-1', 'a3-big-terms', '−2x²y × 4xy²', '−8x³y³'),
  mul('a3-b-2', 'a3-big-terms', '6a²b × 2ab³', '12a³b⁴'),
  mul('a3-b-3', 'a3-big-terms', '5x³y × (−3xy²)', '−15x⁴y³'),
  mul('a3-b-4', 'a3-big-terms', '4a²b³ × 2ab', '8a³b⁴'),
  mul('a3-b-5', 'a3-big-terms', '(−2mn²)(−5m³n)', '10m⁴n³'),


  // Squaring (or cubing) a whole term
  mul('a3-q-1', 'a3-square', '(−3a)²', '9a²', 'Work it out. The power applies to everything in the bracket.'),
  mul('a3-q-2', 'a3-square', '(4c)²', '16c²', 'Work it out. The power applies to everything in the bracket.'),
  mul('a3-q-3', 'a3-square', '(5y)²', '25y²', 'Work it out. The power applies to everything in the bracket.'),
  mul('a3-q-4', 'a3-square', '(−2n)²', '4n²', 'Work it out. The power applies to everything in the bracket.'),
  mul('a3-q-5', 'a3-square', '(6m)²', '36m²', 'Work it out. The power applies to everything in the bracket.'),
  {
    id: 'a3-q-q1', concept: 'a3-square', type: 'pair', prompt: 'Is 2x² the same as (2x)²?',
    options: ['Yes, the same', 'No, different'], answer: 1,
    explain: '2x² = 2 × x × x, but (2x)² = 2x × 2x = 4x². Only the bracket squares the 2 as well.',
    whyNot: { 'Yes, the same': 'Try x = 3: 2x² = 2 × 9 = 18, but (2x)² = 6² = 36. Different!' },
  } satisfies PairItem,

  // Area of a rectangle = length × width
  mul('a3-a-1', 'a3-area', '6y × 2y', '12y²', 'A rectangle is 6y cm long and 2y cm wide. Area = length × width. Write the area (in cm²).'),
  mul('a3-a-2', 'a3-area', '2m² × 5m', '10m³', 'A rectangle has sides 2m² cm and 5m cm. Area = length × width. Write the area (in cm²).'),
  mul('a3-a-3', 'a3-area', '(3k)²', '9k²', 'A square has sides of 3k cm. Area = side × side. Write the area (in cm²).'),
  mul('a3-a-4', 'a3-area', '7p × 3q', '21pq', 'A rectangle is 7p m long and 3q m wide. Area = length × width. Write the area (in m²).'),
  mul('a3-a-5', 'a3-area', '5a × 2a', '10a²', 'A rectangle is 5a cm by 2a cm. Area = length × width. Write the area (in cm²).'),

  // Adding is not multiplying (the big idea of the lesson)
  {
    id: 'a3-am-q1', concept: 'a3-add-vs-mul', type: 'pair', prompt: '3x + 4x = ?',
    options: ['7x', '12x²'], answer: 0,
    explain: 'This is adding: 3 lots of x plus 4 lots of x is 7 lots of x. The power stays 1: 7x.',
    whyNot: { '12x²': 'That would be 3x × 4x. Here there is a + sign, so you add: 3x + 4x = 7x.' },
  } satisfies PairItem,
  {
    id: 'a3-am-q2', concept: 'a3-add-vs-mul', type: 'pair', prompt: '3x × 4x = ?',
    options: ['7x', '12x²'], answer: 1,
    explain: 'This is multiplying: 3 × 4 = 12 and x × x = x². So 3x × 4x = 12x².',
    whyNot: { '7x': 'That is adding (3x + 4x). With a × sign, multiply the numbers and x × x = x².' },
  } satisfies PairItem,
  {
    id: 'a3-am-q3', concept: 'a3-add-vs-mul', type: 'choice', prompt: 'Which one equals 10y²?',
    options: ['5y × 2y', '5y + 2y', '5y + 5y', '10 × y × 2'], answer: 0,
    explain: '5y × 2y = 5 × 2 × y × y = 10y².',
    whyNot: {
      '5y + 2y': 'That is adding: 5y + 2y = 7y. No y² appears when you add.',
      '5y + 5y': 'Adding gives 10y, not 10y². Adding never changes the power.',
      '10 × y × 2': 'That is 20y: there is only one y, so no y².',
    },
  } satisfies ChoiceItem,
  {
    id: 'a3-am-w1', concept: 'a3-add-vs-mul', type: 'short',
    prompt: 'Explain why 2x + 3x = 5x, but 2x × 3x = 6x².',
    ideas: [
      { label: 'Adding: count how many x\'s (2 + 3 = 5 lots of x)', words: ['lots of', 'add', 'adding', 'copies', 'count', 'plus'] },
      { label: 'Multiplying: multiply the numbers and x × x = x²', words: ['multiply', 'multiplying', 'x × x', 'x times x', 'x x x', 'times', '2 × 3', '2x3', 'squared'] },
    ],
    model: '2x + 3x is adding: 2 lots of x and 3 more lots of x make 5 lots of x, so 5x (the power stays 1). 2x × 3x is multiplying: multiply the numbers, 2 × 3 = 6, and multiply the letters, x × x = x². So 2x × 3x = 6x².',
  } satisfies ShortItem,

  // Why the powers add (Criterion C)
  {
    id: 'a3-why-q1', concept: 'a3-product-rule', type: 'choice', prompt: 'Why is x³ × x² = x⁵ and not x⁶?',
    options: [
      'Write it out: (x × x × x) × (x × x) has five x\'s',
      'Because 3 × 2 = 5',
      'Because you always add numbers in algebra',
      'Because the bigger power wins',
    ], answer: 0,
    explain: 'x³ is three x\'s and x² is two x\'s. Together that is 3 + 2 = 5 x\'s multiplied: x⁵. We add powers, not multiply them.',
    whyNot: {
      'Because 3 × 2 = 5': '3 × 2 is 6, and that is exactly the mistake! We ADD the powers: 3 + 2 = 5.',
      'Because you always add numbers in algebra': 'Not always: the numbers in front are multiplied. Only the powers of the same letter add.',
      'Because the bigger power wins': 'No power "wins". Count all the x\'s: three and two make five.',
    },
  } satisfies ChoiceItem,
  {
    id: 'a3-why-q2', concept: 'a3-product-rule', type: 'choice', prompt: 'When can you add the powers?',
    options: ['When you multiply terms with the same letter', 'Whenever you see two powers', 'When you add two terms', 'When the letters are different'],
    answer: 0,
    explain: 'The product rule: aᵐ × aⁿ = aᵐ⁺ⁿ. It works only when you MULTIPLY and the base (letter) is the SAME.',
    whyNot: {
      'Whenever you see two powers': 'Only for the same letter: x² × y³ stays x²y³.',
      'When you add two terms': 'When you add, the powers never change: x² + x² = 2x², not x⁴.',
      'When the letters are different': 'Different letters keep their own powers: a² × b³ = a²b³.',
    },
  } satisfies ChoiceItem,
  {
    id: 'a3-why-w1', concept: 'a3-product-rule', type: 'short',
    prompt: 'Explain in your own words why a⁴ × a³ = a⁷. Write it out to show it.',
    ideas: [
      { label: 'Write out the a\'s: four a\'s times three a\'s', words: ['a × a', 'a x a', 'axa', 'a times a', 'four a', '4 a', 'three a', '3 a', 'write it out', 'written out'] },
      { label: 'Add the powers: 4 + 3 = 7', words: ['4 + 3', '4+3', 'add', 'added', 'adding', 'plus', 'seven', '7'] },
    ],
    model: 'a⁴ means a × a × a × a and a³ means a × a × a. Multiplied together that is 4 + 3 = 7 a\'s: a × a × a × a × a × a × a = a⁷. So when we multiply the same base, we add the powers.',
  } satisfies ShortItem,

  // The 3-step method, in order
  {
    id: 'a3-o-1', concept: 'a3-signs', type: 'order', prompt: 'Put the teacher\'s 3 steps for multiplying terms in order.',
    steps: ['Signs: count the minus signs', 'Numbers: multiply the coefficients', 'Letters: multiply them, in alphabetical order'],
  },
  {
    id: 'a3-o-2', concept: 'a3-signs', type: 'order', prompt: 'Put the working for 3x²y × (−2xy³) in order.',
    steps: ['One minus sign, so the answer is −', '3 × 2 = 6', 'x² × x = x³', 'y × y³ = y⁴', '−6x³y⁴'],
  },
];

export const a3: Topic = {
  id: 'A3', title: 'Multiplying terms and the product rule', short: 'Multiplying terms', items,
};
