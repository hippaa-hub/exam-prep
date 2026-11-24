// "My toolkit": the system for every kind of problem on Friday's test, in one place.
// Adele missed lessons, so these are the teacher's methods written as short recipes, each with a worked example
// taken from the teacher's own lessons. Opened from the top of Home, and from More practice.
import type { Method } from '../../content/types';

export const toolkit: Method[] = [
  {
    id: 'tk-multiply', topic: 'A3', emoji: '✖️', title: 'Multiplying terms',
    when: 'Two or more terms with a × between them, like 3x² × (−2xy³).',
    steps: [
      'SIGNS: count the minus signs. Even number → +. Odd number → −.',
      'NUMBERS: multiply the numbers in front.',
      'LETTERS: one letter at a time, in alphabetical order. Same letter: ADD the powers.',
      'Put it together: sign, number, letters.',
    ],
    example: { question: '(3x²y)(−2xy³)', lines: ['One minus sign → −', '3 × 2 = 6', 'x² × x = x³,  y × y³ = y⁴', '= −6x³y⁴'] },
    watch: '2x × 3x = 6x², not 5x (5x is adding). x³ × x² = x⁵, not x⁶ (add the powers, never multiply them).',
  },
  {
    id: 'tk-square', topic: 'A3', emoji: '🟦', title: 'A bracket with a power: (3x)²',
    when: 'A whole term in brackets with a small power outside.',
    steps: [
      'Write it out: (3x)² means 3x × 3x.',
      'Then multiply as usual: signs, numbers, letters.',
    ],
    example: { question: '(−3a)²', lines: ['= (−3a) × (−3a)', 'Two minus signs → +', '3 × 3 = 9,  a × a = a²', '= 9a²'] },
    watch: '3x² is NOT (3x)². In 3x² only the x is squared.',
  },
  {
    id: 'tk-like', topic: 'A1', emoji: '🧺', title: 'Collecting like terms',
    when: 'A long expression with + and − that says "simplify".',
    steps: [
      'Find the like terms: SAME letters with the SAME powers (xy = yx).',
      'Group them. Each term keeps the sign in front of it.',
      'Add or subtract only the numbers in front. Letters and powers stay the same.',
    ],
    example: { question: '4m² + 3m − m² − 5m', lines: ['= (4m² − m²) + (3m − 5m)', '= 3m² − 2m'] },
    watch: 'x² and x are unlike: 4x² + 3x stays as it is. Adding never changes a power.',
  },
  {
    id: 'tk-brackets', topic: 'A2', emoji: '🔄', title: 'Adding and subtracting brackets',
    when: 'Expressions in brackets joined by + or −.',
    steps: [
      'A + before a bracket: just remove the brackets.',
      'A − before a bracket: change the sign of EVERY term inside, then remove the brackets.',
      'Collect like terms.',
      'Check: put in a number (for example x = 2) on both sides.',
    ],
    example: { question: '(8a − 3b + 5) − (2a + 4b − 6)', lines: ['= 8a − 3b + 5 − 2a − 4b + 6', '= (8a − 2a) + (−3b − 4b) + (5 + 6)', '= 6a − 7b + 11'] },
    watch: '(6x + 4) − (2x − 7): the −7 becomes +7, so the answer is 4x + 11.',
  },
  {
    id: 'tk-substitute', topic: 'P4', emoji: '🧤', title: 'Substituting a negative number',
    when: '"a = −3, work out …"',
    steps: [
      'Replace the letter with the number IN BRACKETS.',
      'Order of operations: brackets, then powers, then × and ÷, then + and −.',
      'Square before you subtract: (−3)² = 9.',
    ],
    example: { question: 'a = −3:  1 − a²', lines: ['= 1 − (−3)²', '= 1 − 9', '= −8'] },
    watch: '(−3)² = 9 but −3² = −9. Subtracting a negative is adding: 8 − (−3) = 11.',
  },
  {
    id: 'tk-sequence', topic: 'P1', emoji: '🕵️', title: 'What kind of sequence?',
    when: 'A list of numbers: "find the next terms" or "arithmetic or geometric?"',
    steps: [
      'SUBTRACT each term from the next. Always the same? → ARITHMETIC (common difference).',
      'If not, DIVIDE each term by the one before. Always the same? → GEOMETRIC (common ratio).',
      'Neither? Look at how the increase changes (+2, +3, +4 …).',
      'Write your evidence: the differences or the ratios.',
    ],
    example: { question: '4, 12, 36, 108', lines: ['Differences +8, +24: not the same → not arithmetic', '12 ÷ 4 = 3, 36 ÷ 12 = 3 → geometric, ×3', 'Next: 324, 972'] },
    watch: '"It goes up" is not evidence. Show the numbers.',
  },
  {
    id: 'tk-rule', topic: 'PR', emoji: '🧮', title: 'Finding the nth-term rule',
    when: 'An arithmetic sequence or a growing pattern: "write the general rule".',
    steps: [
      'Find the common difference d. The rule starts d × n.',
      'Check n = 1: what must you add or take away to get the first term?',
      'Write the rule and say what n stands for (the figure or stage number).',
      'TEST it on another term.',
    ],
    example: { question: '3, 7, 11, 15, …', lines: ['d = 4 → 4n', 'n = 1: 4, but the first term is 3 → − 1', 'Rule: 4n − 1', 'Test n = 2: 4(2) − 1 = 7 ✓'] },
    watch: 'Matchsticks: count only what is NEW in each figure (3, because squares share a side), so 3n + 1, not 4n.',
  },
  {
    id: 'tk-use-rule', topic: 'PR', emoji: '🎯', title: 'Using a rule: a far term, or which term?',
    when: '"Find the 20th term" or "Which figure has 31 sticks?"',
    steps: [
      'A far term: put the number into the rule (in brackets) and work it out.',
      'Which term: set the rule EQUAL to the number.',
      'Undo it: take away the number added, then divide by the number in front of n.',
    ],
    example: { question: 'm = 3n + 1. Which figure has 31 sticks?', lines: ['3n + 1 = 31', '3n = 30', 'n = 10 → figure 10'] },
  },
  {
    id: 'tk-investigate', topic: 'IN', emoji: '🔬', title: 'An investigation (Criterion B)',
    when: 'A growing pattern or real situation: "investigate".',
    steps: [
      '1. Find and describe what changes.',
      '2. Organise the values in a table.',
      '3. Form a general rule.',
      '4. TEST the rule on another term.',
      '5. JUSTIFY: say what each number in the rule means in the pattern.',
    ],
    example: { question: 'Concert seats: row 1 has 12, each row has 3 more', lines: ['Table: 12, 15, 18, 21', 'Rule: s = 3n + 9 (n = row number)', 'Test row 4: 3(4) + 9 = 21 ✓', '3 = seats added per row; 12 seats to start'] },
    watch: 'Testing and justifying is what turns 5–6 marks into 7–8.',
  },
  {
    id: 'tk-explain', topic: 'IN', emoji: '🗣️', title: 'Explaining (Criterion C)',
    when: 'Any "explain", "justify" or "how do you know?"',
    steps: [
      '"My pattern begins with …"',
      '"Each new figure adds … because …"',
      '"Therefore, figure n has … (n is the figure number)."',
      '"I checked this using figure …"',
    ],
    example: { question: 'Why is x³ × x² = x⁵ and not x⁶?', lines: ['x³ × x² = (x·x·x)(x·x)', 'That is 5 x\'s multiplied, so x⁵.', 'We ADD the powers (3 + 2); we do not multiply them.'] },
    watch: 'Never only "because that is the rule". An answer + a mathematical reason.',
  },
];
