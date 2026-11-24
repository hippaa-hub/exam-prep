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

export const lessonP1: Lesson = {
  topic: 'P1',
  title: 'Sequences',
  blurb: '3 short cards: arithmetic, geometric or neither, and how to prove it.',
  cards: [
    {
      id: 'p1-1', emoji: '➕', title: 'Arithmetic: add the same number',
      intro: 'In an arithmetic sequence the same number is added (or subtracted) every time. That number is the common difference.',
      steps: [
        { show: '5, 9, 13, 17, …', why: 'Look at how it changes from one term to the next.' },
        { show: '9 − 5 = 4,  13 − 9 = 4,  17 − 13 = 4', why: 'Common difference = any term minus the term before it.' },
        { show: 'Next: 21, 25', why: 'Keep adding 4: 17 + 4 = 21, 21 + 4 = 25.' },
        { show: '20, 17, 14, 11 → −3 each time', why: 'A sequence that goes down has a negative common difference.' },
      ],
      tap: { question: 'What is the common difference of 28, 21, 14?', options: ['−7', '+7', '÷2'], answer: 0, why: '21 − 28 = −7: it goes down by 7 each time.' },
      remember: 'Arithmetic: the SAME difference every time (+ or −).',
    },
    {
      id: 'p1-2', emoji: '✖️', title: 'Geometric: multiply by the same number',
      intro: 'In a geometric sequence each term is multiplied by the same number. That number is the common ratio.',
      steps: [
        { show: '3, 6, 12, 24, …', why: 'The differences are +3, +6, +12: they change, so it is not arithmetic.' },
        { show: '6 ÷ 3 = 2,  12 ÷ 6 = 2,  24 ÷ 12 = 2', why: 'Common ratio = any term divided by the term before it.' },
        { show: 'Next: 48, 96', why: 'Keep multiplying by 2.' },
        { show: '81, 27, 9 → ÷3 (×⅓) → 3, 1', why: 'A geometric sequence can also get smaller: divide each time.' },
      ],
      tap: { question: 'Is 4, 12, 36, 108 arithmetic or geometric?', options: ['Geometric: ×3 each time', 'Arithmetic: +8 each time'], answer: 0, why: '12 − 4 = 8 but 36 − 12 = 24, so the difference changes. 12 ÷ 4 = 3 and 36 ÷ 12 = 3: geometric.' },
      remember: 'Geometric: the SAME ratio every time (× or ÷).',
    },
    {
      id: 'p1-3', emoji: '🕵️', title: 'Neither, and giving evidence',
      intro: 'Some sequences are neither. Your teacher wants evidence, not just an answer.',
      steps: [
        { show: '1, 2, 4, 7, 11, 16, …', why: 'Check the differences first.' },
        { show: '+1, +2, +3, +4, +5', why: 'The increase changes each time, so it is not arithmetic.' },
        { show: '2 ÷ 1 = 2, but 7 ÷ 4 is not 2', why: 'No fixed ratio either, so it is not geometric. It is neither.' },
        { show: 'Next: +6 → 22, then +7 → 29', why: 'The pattern in the increases tells you the next terms.' },
      ],
      tap: { question: 'Student A: "It must be arithmetic because it goes up." Is that good evidence?', options: ['No: going up is not a fixed difference', 'Yes: it goes up'], answer: 0, why: 'Arithmetic needs the SAME difference each time. Show the differences as your evidence.' },
      remember: 'Always show your evidence: the differences, or the ratios.',
    },
  ],
};

export const lessonA2: Lesson = {
  topic: 'A2',
  title: 'Brackets',
  blurb: '3 short cards: adding and subtracting expressions in brackets.',
  cards: [
    {
      id: 'a2-1', emoji: '➕', title: 'A plus before a bracket: nothing changes',
      intro: 'Your teacher\'s Example A. With a + before the bracket, just remove the brackets.',
      steps: [
        { show: '(5x + 3y − 7) + (2x − 6y + 4)', why: 'There is a + between the brackets.' },
        { show: '= 5x + 3y − 7 + 2x − 6y + 4', why: 'Remove the brackets. Every sign stays the same.' },
        { show: '= (5x + 2x) + (3y − 6y) + (−7 + 4)', why: 'Group the like terms.' },
        { show: '= 7x − 3y − 3', why: 'Collect: 5 + 2 = 7, 3 − 6 = −3, −7 + 4 = −3.' },
      ],
      remember: 'A + before a bracket changes nothing.',
    },
    {
      id: 'a2-2', emoji: '🔄', title: 'A minus before a bracket: EVERY sign changes',
      intro: 'Your teacher\'s Example B. This is the most important rule of the topic.',
      steps: [
        { show: '(8a − 3b + 5) − (2a + 4b − 6)', why: 'There is a − before the second bracket.' },
        { show: '= 8a − 3b + 5 − 2a − 4b + 6', why: 'Every sign inside the second bracket changes: +2a → −2a, +4b → −4b, −6 → +6.' },
        { show: '= (8a − 2a) + (−3b − 4b) + (5 + 6)', why: 'Group the like terms.' },
        { show: '= 6a − 7b + 11', why: 'Collect each group.' },
      ],
      tap: { question: 'What does −(2x − 7) become?', options: ['−2x + 7', '−2x − 7', '2x − 7'], answer: 0, why: 'Both signs change: +2x → −2x and −7 → +7.' },
      faded: {
        prompt: 'The brackets are removed and grouped. You finish it.',
        expr: '(9x + 5) − (4x + 2)', kind: 'brackets',
        given: [
          { show: '= 9x + 5 − 4x − 2', why: 'The minus changes both signs in the second bracket.' },
          { show: '= (9x − 4x) + (5 − 2)', why: 'Group the like terms.' },
        ],
        answer: '5x + 3', hint: '9 − 4 = 5 and 5 − 2 = 3: 5x + 3.',
      },
      remember: 'A − before a bracket changes the sign of EVERY term inside.',
    },
    {
      id: 'a2-3', emoji: '🔲', title: 'Real life: perimeter',
      intro: 'Brackets appear in real problems. A rectangle is (5x + 3) cm by (2x − 1) cm.',
      steps: [
        { show: 'Perimeter = 2 × length + 2 × width', why: 'Two lengths and two widths go round the rectangle.' },
        { show: '= 2(5x + 3) + 2(2x − 1)', why: 'Put each side in brackets.' },
        { show: '= 10x + 6 + 4x − 2', why: 'Multiply each term in the bracket by 2.' },
        { show: '= 14x + 4 cm', why: 'Collect: 10x + 4x = 14x and 6 − 2 = 4.' },
        { show: 'Check with x = 2: sides 13 and 3, perimeter 32; 14(2) + 4 = 32 ✓', why: 'Your teacher: verify by substituting a number.' },
      ],
      remember: 'Check an answer by putting in a number, for example x = 2.',
    },
  ],
};

export const lessonP4: Lesson = {
  topic: 'P4',
  title: 'Substitution with negative numbers',
  blurb: '3 short cards: brackets for negatives, squares, and the order of operations.',
  cards: [
    {
      id: 'p4-1', emoji: '🧤', title: 'Negative numbers need brackets!',
      intro: 'To substitute, put the number in place of the letter. A negative number always goes in brackets.',
      steps: [
        { show: 'a = −3:  2a + 5', why: 'The letter a will be replaced by (−3).' },
        { show: '= 2(−3) + 5', why: 'Brackets keep the minus sign with the 3.' },
        { show: '= −6 + 5 = −1', why: 'Multiply first (order of operations), then add.' },
        { show: '3(−2) + 1 = −5, but 3 − 2 + 1 = 2', why: 'Without brackets it looks like subtraction, and the answer is wrong.' },
      ],
      tap: { question: 'x = −2. Which line is right for 3x + 1?', options: ['3(−2) + 1 = −5', '3 − 2 + 1 = 2'], answer: 0, why: 'Keep the negative number in brackets: 3 × (−2) = −6, then −6 + 1 = −5.' },
      remember: 'Negative numbers need brackets!',
    },
    {
      id: 'p4-2', emoji: '²', title: 'Squaring a negative number',
      intro: 'The square applies only to what is directly in front of it.',
      steps: [
        { show: '(−3)² = (−3) × (−3) = 9', why: 'Minus times minus is plus.' },
        { show: '−3² = −(3 × 3) = −9', why: 'Without brackets only the 3 is squared.' },
        { show: 'a = −3:  1 − a² = 1 − (−3)²', why: 'Substitute with brackets.' },
        { show: '= 1 − 9 = −8', why: 'Square first: (−3)² = 9. The minus in front stays: 1 − 9.' },
      ],
      tap: { question: 'k = −2. What is 3k²?', options: ['12', '−12', '36'], answer: 0, why: '(−2)² = 4 first, then 3 × 4 = 12.' },
      remember: '(−3)² = 9 but −3² = −9. Square first, then the rest.',
    },
    {
      id: 'p4-3', emoji: '🎰', title: 'Rule machine with negatives',
      intro: 'A rule machine: y = 4 − 2x. Put in each x, one at a time.',
      steps: [
        { show: 'x = −2:  4 − 2(−2) = 4 + 4 = 8', why: '2 × (−2) = −4, and taking away −4 is adding 4.' },
        { show: 'x = −1:  4 − 2(−1) = 6', why: 'Same steps.' },
        { show: 'x = 0, 1, 2:  4, 2, 0', why: 'The values fall by 2 each time.' },
        { show: '8, 6, 4, 2, 0: arithmetic, difference −2', why: 'The −2 in front of x makes it go down by 2.' },
        { show: 'a = −3:  4(8 − a) = 4(8 − (−3)) = 4(11) = 44', why: 'Inside the bracket first: 8 − (−3) = 8 + 3 = 11.' },
      ],
      remember: 'Subtracting a negative is adding: 8 − (−3) = 11.',
    },
  ],
};

export const lessonPR: Lesson = {
  topic: 'PR',
  title: 'Patterns and rules',
  blurb: '4 short cards: from a picture to a rule, and using the rule.',
  cards: [
    {
      id: 'pr-1', emoji: '🔥', title: 'Matchstick squares',
      intro: 'Squares in a row. Count the matchsticks: 4, 7, 10, 13…',
      picture: { kind: 'matchsticks', figures: [1, 2, 3, 4] },
      steps: [
        { show: 'Figure 1: 4 sticks', why: 'One square has four sides.' },
        { show: 'Each new square: +3 sticks', why: 'It SHARES one side with the square before, so it needs only 3 new sticks, not 4.' },
        { show: 'm = 4 + 3(n − 1) = 3n + 1', why: 'First square 4, then 3 more for each of the other (n − 1) squares.' },
        { show: 'Test figure 4: 3(4) + 1 = 13 ✓', why: 'Always check the rule on a figure you can count.' },
      ],
      tap: { question: 'Why is m = 4n wrong?', options: ['It counts each shared side twice', 'It is too short', 'It is right'], answer: 0, why: 'Test n = 2: 4n = 8, but the picture has 7.' },
      remember: 'Count what is NEW in each figure: that is the number in front of n.',
    },
    {
      id: 'pr-2', emoji: '➕', title: 'The tile cross',
      intro: 'One centre tile and four arms that grow by one tile each stage: 5, 9, 13…',
      picture: { kind: 'tile-cross', figures: [1, 2, 3] },
      steps: [
        { show: 'Each stage: +4 tiles', why: 'One new tile on each of the 4 arms.' },
        { show: 't = 4n + 1', why: '4 × n arm tiles, plus 1 centre tile.' },
        { show: 'The 4 = four arms; the 1 = the centre', why: 'Link each number in the rule to the picture: that is justifying.' },
        { show: 'Stage 12: 4(12) + 1 = 49', why: 'Use the rule instead of drawing 12 stages.' },
      ],
      remember: 'Justify: say what each number in the rule means in the picture.',
    },
    {
      id: 'pr-3', emoji: '🧮', title: 'From a sequence to a rule',
      intro: 'Your teacher\'s way to build an arithmetic rule, on 3, 7, 11, 15.',
      steps: [
        { show: 'Common difference: +4', why: '7 − 3 = 4, 11 − 7 = 4.' },
        { show: 'Rule starts 4n', why: 'The number in front of n is the common difference.' },
        { show: 'n = 1: 4 × 1 = 4, but the first term is 3 → subtract 1', why: 'rule = (difference) × n + (first term − difference).' },
        { show: 'Rule: 4n − 1. Test n = 2: 7 ✓', why: 'Always test on another term.' },
        { show: '20th term: 4(20) − 1 = 79', why: 'No need to list all 20 terms: algebra is the shortcut.' },
      ],
      faded: {
        prompt: 'The difference is found. You write the rule.',
        expr: '4n + 2', show: '6, 10, 14, 18, …', kind: 'rule',
        given: [
          { show: 'Common difference: +4 → the rule starts 4n', why: '10 − 6 = 4.' },
          { show: 'n = 1: 4 × 1 = 4, but the first term is 6 → add 2', why: '6 − 4 = 2.' },
        ],
        answer: '4n + 2', hint: '4n, then + 2: 4n + 2.',
      },
      remember: 'Rule = difference × n, then adjust so term 1 is right. Test it!',
    },
    {
      id: 'pr-4', emoji: '🎯', title: 'Which term is N?',
      intro: 'Work backwards: which figure has a certain number?',
      steps: [
        { show: 'Matchsticks m = 3n + 1. Which figure has 31 sticks?', why: 'Set the rule equal to 31.' },
        { show: '3n + 1 = 31', why: 'An equation to solve.' },
        { show: '3n = 30', why: 'Take away 1 from both sides.' },
        { show: 'n = 10', why: 'Divide both sides by 3. Figure 10 has 31 sticks.' },
      ],
      tap: { question: 'The rule is 4n + 2. Which term is 62?', options: ['15', '16', '60'], answer: 0, why: '4n + 2 = 62 → 4n = 60 → n = 15.' },
      remember: 'Which term? Set rule = N, then undo: take away, then divide.',
    },
  ],
};

export const lessonIN: Lesson = {
  topic: 'IN',
  title: 'Investigations and explaining',
  blurb: '3 short cards: the Criterion B steps and how to explain for Criterion C.',
  cards: [
    {
      id: 'in-1', emoji: '🔬', title: 'The 5 investigation steps (Criterion B)',
      intro: 'Your teacher\'s steps, on the concert seating: row 1 has 12 seats, and each row has 3 more.',
      steps: [
        { show: '1. Find what changes: +3 seats each row', why: 'Describe the pattern.' },
        { show: '2. Table: row 1, 2, 3, 4 → 12, 15, 18, 21', why: 'Organise the values.' },
        { show: '3. General rule: s = 3n + 9', why: 'Difference 3, so 3n; 3(1) = 3, and 12 − 3 = 9.' },
        { show: '4. Test: row 4 → 3(4) + 9 = 21 ✓', why: 'Verify on another term.' },
        { show: '5. Justify: 12 seats to start, then 3 more for every new row', why: 'Link the rule to the situation. Row 20: 3(20) + 9 = 69.' },
      ],
      tap: { question: 'Which step gets you from 5–6 marks to 7–8?', options: ['Testing and justifying the rule', 'Drawing more pictures', 'Writing more terms'], answer: 0, why: 'Criterion B 7–8: find, TEST and JUSTIFY the general rule.' },
      remember: 'Find → table → rule → TEST → JUSTIFY.',
    },
    {
      id: 'in-2', emoji: '🎟️', title: 'What each number means',
      intro: 'School fair: tickets cost 3 GEL each, plus a 5 GEL booking fee per order.',
      steps: [
        { show: 'y = 3x + 5', why: 'x = number of tickets, y = total cost in GEL.' },
        { show: '3 = the price of each ticket', why: 'It is multiplied by x: it grows with every ticket.' },
        { show: '5 = the booking fee', why: 'It is added once, whatever the number of tickets.' },
        { show: '15 tickets: 3(15) + 5 = 50 GEL', why: 'Forwards: substitute x.' },
        { show: 'A 50 GEL receipt: 3x + 5 = 50 → x = 15', why: 'Backwards: solve for x.' },
      ],
      remember: 'Say what every number in your rule represents.',
    },
    {
      id: 'in-3', emoji: '🗣️', title: 'Explaining clearly (Criterion C)',
      intro: 'Your teacher\'s sentence frame and checklist for a full explanation.',
      steps: [
        { show: '"My pattern begins with 4 matchsticks."', why: 'Start with what you see.' },
        { show: '"Each new figure adds 3 matchsticks."', why: 'Say what changes, and why (a shared side).' },
        { show: '"Therefore, figure n has 3n + 1 matchsticks."', why: 'State the rule, and say n is the figure number.' },
        { show: '"I checked this using figure 2: 3(2) + 1 = 7 ✓"', why: 'Test it on another figure.' },
        { show: 'Checklist: variable defined · table or diagram · rule explained · tested', why: 'Never only "because that is the rule".' },
      ],
      tap: { question: '"The rule is 4n + 2. It is obvious." What is the biggest problem?', options: ['No reason: "obvious" explains nothing', 'The rule is too short', 'It uses the letter n'], answer: 0, why: 'Say what n means, why 4 and 2, and test it on a new stage.' },
      remember: 'An answer + a mathematical reason.',
    },
  ],
};
