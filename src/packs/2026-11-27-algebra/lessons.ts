// The lessons: Learn cards that teach before the questions. Worked examples are the teacher's own
// (Operations Day 1 and Day 2, textbook Explore 3.4 / Worked example 3.5), revealed one step at a time.
import type { Lesson } from '../../content/types';

export const lessonA3: Lesson = {
  topic: 'A3',
  title: 'Multiplying terms',
  blurb: '8 short cards: the teacher\'s worked examples, one step at a time.',
  cards: [
    {
      id: 'a3-1', emoji: '➕✖️', title: 'Adding is not multiplying',
      intro: 'In algebra, + and × do very different things. This is the most important idea of the lesson.',
      steps: [
        { show: '2x + 3x = 5x', why: 'Adding: 2 lots of x and 3 more lots of x make 5 lots of x. The power stays 1.' },
        { show: '2x × 3x = 2 × 3 × x × x', why: 'Multiplying: write out every factor. A term like 2x means 2 × x.' },
        { show: '= 6x²', why: 'Multiply the numbers (2 × 3 = 6) and the letters (x × x = x²).' },
      ],
      tap: {
        question: 'Why is 2x × 3x not 5x?',
        options: ['5x would be adding; multiplying gives 6x²', 'Because 2 × 3 = 5', 'It is 5x'],
        answer: 0,
        why: 'When you multiply, the numbers multiply (2 × 3 = 6) and x × x makes x². 5x is what you get when you ADD.',
      },
      remember: '+ counts how many x\'s. × multiplies the numbers AND the letters.',
    },
    {
      id: 'a3-2', emoji: '🔢', title: 'What x² and x³ mean',
      intro: 'The small raised number is the exponent (or power). It counts how many times the letter is multiplied.',
      steps: [
        { show: 'x² = x × x', why: 'Two x\'s multiplied together. We say "x squared".' },
        { show: 'x³ = x × x × x', why: 'Three x\'s multiplied together. We say "x cubed".' },
        { show: 'x = x¹', why: 'A letter on its own has exponent 1. We just do not write the 1.' },
      ],
      tap: {
        question: 'How many x\'s are multiplied in x⁴?',
        options: ['4', '1', '8'],
        answer: 0,
        why: 'x⁴ = x × x × x × x: the exponent 4 counts the x\'s.',
      },
      remember: 'The exponent counts how many of the letter are multiplied.',
    },
    {
      id: 'a3-3', emoji: '➖', title: 'The sign rules',
      intro: 'Before the numbers, decide the sign of the answer. These four rules are all you need.',
      steps: [
        { show: '(+) × (+) = +', why: 'Two positives make a positive: 3 × 2 = 6.' },
        { show: '(−) × (−) = +', why: 'Two negatives make a positive: (−3) × (−2) = 6.' },
        { show: '(+) × (−) = −   and   (−) × (+) = −', why: 'One negative makes the answer negative: 3 × (−2) = −6.' },
        { show: 'Three or more: count the minus signs', why: 'Even number of minus signs → +. Odd number → −.' },
      ],
      tap: {
        question: 'What is the sign of (−2) × (−3) × (−1)?',
        options: ['− (three minus signs: odd)', '+ (minus times minus is plus)'],
        answer: 0,
        why: 'Count them: 3 minus signs. Three is odd, so the answer is −6.',
      },
      remember: 'Count the minus signs: even → +, odd → −.',
    },
    {
      id: 'a3-4', emoji: '1️⃣2️⃣3️⃣', title: 'The 3-step method',
      intro: 'Your teacher\'s method for any multiplication: signs, then numbers, then letters. Watch it on 2p × (−4q) × 3r.',
      steps: [
        { show: 'Step 1, signs: one minus sign → −', why: 'Only −4q is negative. One is odd, so the answer is negative.' },
        { show: 'Step 2, numbers: 2 × 4 × 3 = 24', why: 'Multiply the numbers in front. The sign is already done.' },
        { show: 'Step 3, letters: p × q × r = pqr', why: 'Put the letters together, in alphabetical order.' },
        { show: '2p × (−4q) × 3r = −24pqr', why: 'Sign, number, letters: put the three steps together.' },
        { show: 'Another one: (−5x)(−3y) = 15xy', why: 'Two minus signs (even) → +. 5 × 3 = 15. x × y = xy.' },
      ],
      faded: {
        prompt: 'The first steps are done. You write the answer.',
        expr: '−3a × 5b',
        given: [
          { show: 'Signs: one minus sign → −', why: 'Only −3a is negative.' },
          { show: 'Numbers: 3 × 5 = 15', why: 'Multiply the numbers in front.' },
          { show: 'Letters: a × b = ab', why: 'Alphabetical order.' },
        ],
        answer: '−15ab',
        hint: 'Sign −, number 15, letters ab: −15ab.',
      },
      remember: 'Signs → numbers → letters (in alphabetical order).',
    },
    {
      id: 'a3-5', emoji: '🚀', title: 'The product rule: add the powers',
      intro: 'When you multiply the same letter, the powers ADD. Here is why.',
      steps: [
        { show: 'x² × x³ = (x × x) × (x × x × x)', why: 'Write each power out as x\'s.' },
        { show: '= x × x × x × x × x = x⁵', why: 'Count them: 2 + 3 = 5 x\'s.' },
        { show: 'aᵐ × aⁿ = aᵐ⁺ⁿ', why: 'This is the product rule. It works only when the base (the letter) is the same.' },
        { show: '3x² × 2x³ = 6x⁵', why: 'Numbers: 3 × 2 = 6. Letters: x² × x³ = x²⁺³ = x⁵.' },
        { show: 'x² × y³ = x²y³', why: 'Different letters: you cannot add 2 and 3. Write them side by side.' },
      ],
      tap: {
        question: 'Why is x² × x³ = x⁵ and not x⁶?',
        options: ['Count the x\'s: 2 + 3 = 5', 'Because 2 × 3 = 5', 'The bigger power wins'],
        answer: 0,
        why: 'Written out there are five x\'s. We ADD the powers; we do not multiply them (2 × 3 = 6 is the common mistake).',
      },
      faded: {
        prompt: 'Numbers and letters are done. You put them together.',
        expr: '2p² × 3p³',
        given: [
          { show: 'Signs: no minus signs → +', why: 'Both terms are positive.' },
          { show: 'Numbers: 2 × 3 = 6', why: 'Multiply the numbers in front.' },
          { show: 'Letters: p² × p³ = p²⁺³ = p⁵', why: 'Same letter: add the powers.' },
        ],
        answer: '6p⁵',
        hint: 'Number 6, letters p⁵: 6p⁵.',
      },
      remember: 'Same letter: ADD the powers. Different letters: write them side by side.',
    },
    {
      id: 'a3-6', emoji: '🧩', title: 'Bigger terms: one letter at a time',
      intro: 'Big terms use the same 3 steps. Just do the letters one at a time. Watch (3x²y)(−2xy³).',
      steps: [
        { show: 'Signs: one minus sign → −', why: 'Only −2xy³ is negative.' },
        { show: 'Numbers: 3 × 2 = 6', why: 'Multiply the numbers in front.' },
        { show: 'x: x² × x = x²⁺¹ = x³', why: 'x on its own is x¹, so add 2 + 1.' },
        { show: 'y: y × y³ = y¹⁺³ = y⁴', why: 'Same again for y: 1 + 3 = 4.' },
        { show: '(3x²y)(−2xy³) = −6x³y⁴', why: 'Sign, number, then each letter with its new power.' },
      ],
      faded: {
        prompt: 'Signs, numbers and m are done. You finish it.',
        expr: '(−3mn)(−2m²n³)',
        given: [
          { show: 'Signs: two minus signs → +', why: 'Two is even.' },
          { show: 'Numbers: 3 × 2 = 6', why: 'Multiply the numbers in front.' },
          { show: 'm: m × m² = m³', why: '1 + 2 = 3.' },
          { show: 'n: n × n³ = n⁴', why: '1 + 3 = 4.' },
        ],
        answer: '6m³n⁴',
        hint: 'Put together: 6, then m³, then n⁴: 6m³n⁴.',
      },
      remember: 'Take one letter at a time and add its powers.',
    },
    {
      id: 'a3-7', emoji: '🟦', title: 'Squaring a whole term',
      intro: 'A bracket with a power on the outside squares EVERYTHING inside, the number too.',
      steps: [
        { show: '(3x)² = 3x × 3x', why: 'Squared means "times itself". Write it out.' },
        { show: '= 9x²', why: '3 × 3 = 9 and x × x = x².' },
        { show: 'but 3x² = 3 × x × x', why: 'Without a bracket, only the x is squared. The 3 is not.' },
        { show: '(−3a)² = (−3a) × (−3a) = 9a²', why: 'Two minus signs → +. 3 × 3 = 9. a × a = a².' },
      ],
      tap: {
        question: 'Is 2x² the same as (2x)²?',
        options: ['No: (2x)² = 4x²', 'Yes, they are the same'],
        answer: 0,
        why: '2x² = 2 × x × x. (2x)² = 2x × 2x = 4x². The bracket squares the 2 too.',
      },
      remember: '(3x)² = 9x², but 3x² is just 3 × x × x.',
    },
    {
      id: 'a3-8', emoji: '📐', title: 'Area of a rectangle',
      intro: 'Multiplying terms is how you find an area when the sides are written with letters.',
      steps: [
        { show: 'Area = length × width', why: 'The same rule as with numbers.' },
        { show: 'A rectangle is 3x cm by 4x cm', why: 'The sides are terms, so we multiply terms.' },
        { show: 'Area = 3x × 4x = 12x² cm²', why: '3 × 4 = 12 and x × x = x². Area is in square units: cm².' },
      ],
      tap: {
        question: 'Why is the area 12x² and not 7x?',
        options: ['Area multiplies the sides; 7x would be adding them', 'Because 3 + 4 = 12'],
        answer: 0,
        why: 'Area = length × width, so we multiply: 3x × 4x = 12x². Adding the sides is part of the perimeter, not the area.',
      },
      remember: 'Area = length × width: multiply the terms.',
    },
  ],
};

export const lessonA1: Lesson = {
  topic: 'A1',
  title: 'Like terms',
  blurb: '3 short cards: a quick refresher before the homework.',
  cards: [
    {
      id: 'a1-1', emoji: '🔍', title: 'The parts of an expression',
      intro: 'Your teacher\'s example: −4x² + 3xy − 7. Let\'s name every part.',
      steps: [
        { show: 'Terms: −4x², +3xy, −7', why: 'The + and − signs split an expression into terms. Each term keeps the sign in front of it.' },
        { show: 'Coefficient of x²: −4', why: 'The coefficient is the number in front of the letters, with its sign.' },
        { show: 'Exponent in x²: 2', why: 'The small raised number is the exponent (or index).' },
        { show: 'Constant: −7', why: 'A term with no letter. Its value never changes.' },
        { show: 'x means 1x¹  and  −x² means −1x²', why: 'With no number written, the coefficient is 1 (or −1). With no power written, the exponent is 1.' },
      ],
      tap: {
        question: 'What is the coefficient of −y?',
        options: ['−1', '1', 'y'],
        answer: 0,
        why: '−y means −1 × y, so the coefficient is −1.',
      },
      remember: 'Coefficient = the number in front (with its sign). Exponent = the small power.',
    },
    {
      id: 'a1-2', emoji: '👯', title: 'Like terms',
      intro: 'Like terms have the same variable part: the same letters with the same powers.',
      steps: [
        { show: '3a and −8a: like', why: 'Both are a. The numbers in front can be different.' },
        { show: '2x² and 5x: unlike', why: 'The powers are different: x² is not x.' },
        { show: '4xy and −3yx: like', why: 'xy = yx: the order of the letters does not matter.' },
        { show: '−3p²q and 6pq²: unlike', why: 'In p²q the p is squared; in pq² the q is squared.' },
      ],
      tap: {
        question: 'Are 5p² and −p² like terms?',
        options: ['Yes: both are p²', 'No: 5 and −1 are different'],
        answer: 0,
        why: 'Only the letters and powers must match. Both are p², so they are like terms.',
      },
      remember: 'Like terms: same letters AND same powers. Check both.',
    },
    {
      id: 'a1-3', emoji: '🧺', title: 'Collecting like terms',
      intro: 'To simplify, put the like terms together and add or subtract only their numbers.',
      steps: [
        { show: '5x + 4y + 2x − y', why: 'Find the like terms: the x terms and the y terms.' },
        { show: '= (5x + 2x) + (4y − y)', why: 'Group them. Each term keeps its own sign.' },
        { show: '= 7x + 3y', why: '5 + 2 = 7 and 4 − 1 = 3. The letters do not change.' },
        { show: '2a − 4a² − 5a = (2a − 5a) − 4a² = −3a − 4a²', why: 'Example B: a and a² are unlike, so −4a² stays on its own.' },
      ],
      faded: {
        prompt: 'The terms are grouped. You finish it.',
        expr: '6q² − 2q + 3q²',
        kind: 'collect',
        given: [
          { show: '= (6q² + 3q²) − 2q', why: 'q² terms together; −2q is unlike, so it stays apart.' },
        ],
        answer: '9q² − 2q',
        hint: '6 + 3 = 9, so 9q², and −2q stays: 9q² − 2q.',
      },
      remember: 'Add or subtract only the numbers in front. Letters and powers stay the same.',
    },
  ],
};
