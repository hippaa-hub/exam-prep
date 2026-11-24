// The lessons: Learn cards that teach before the questions. Worked examples are the teacher's own
// (Operations Day 1 and Day 2, textbook Explore 3.4 / Worked example 3.5), revealed one step at a time.
import type { Lesson } from '../../content/types';

export const lessonA3: Lesson = {
  topic: 'A3',
  title: 'Terms and multiplying',
  blurb: '10 short cards with games: the parts of a term, like terms, signs, and multiplying.',
  cards: [
    {
      id: 'a3-term', emoji: '🔎', title: 'Meet a term',
      intro: 'A term is one "word" of algebra, like 5y³. Every term has the same parts. Let\'s name them.',
      anatomy: '5y³',
      steps: [
        { show: '5  →  the coefficient', why: 'The big number in FRONT. It says HOW MANY. 5y³ means 5 lots of y³.' },
        { show: 'y  →  the variable', why: 'A letter that stands for a number we do not know yet.' },
        { show: '³  →  the exponent', why: 'The tiny number up on the roof. It says how many y\'s are multiplied: y³ = y × y × y.' },
        { show: 'So 5y³ = 5 × y × y × y', why: 'The coefficient multiplies. The exponent counts the letters.' },
        { show: 'm  =  1m¹', why: 'Nothing written? There is an invisible 1. The coefficient is 1 and the exponent is 1.' },
        { show: '−k²  →  coefficient −1', why: 'The minus sign belongs to the coefficient. The invisible 1 becomes −1.' },
      ],
      game: {
        title: 'Name the part',
        intro: 'Look at the term and tap the right answer. Watch out for invisible 1s!',
        rounds: [
          { show: '6a⁴', ask: 'What is the coefficient?', options: ['4', '6', 'a'], answer: 1, why: 'The number in front is 6.', anatomy: '6a⁴' },
          { show: '6a⁴', ask: 'What is the exponent?', options: ['4', '6', '1'], answer: 0, why: 'The tiny number on the roof is 4: a × a × a × a.', anatomy: '6a⁴' },
          { show: '−3p', ask: 'What is the coefficient?', options: ['3', 'p', '−3'], answer: 2, why: 'The minus sign belongs to the coefficient: −3.', anatomy: '−3p' },
          { show: '−3p', ask: 'What is the exponent?', options: ['0', '1', '−3'], answer: 1, why: 'Nothing on the roof means an invisible 1: p = p¹.', anatomy: '−3p' },
          { show: 'n⁵', ask: 'What is the coefficient?', options: ['1', '0', '5'], answer: 0, why: 'No number in front means an invisible 1: n⁵ = 1n⁵.', anatomy: 'n⁵' },
          { show: '−b²', ask: 'What is the coefficient?', options: ['1', '−1', '2'], answer: 1, why: 'Only a minus sign in front: −b² = −1b².', anatomy: '−b²' },
          { show: '2c³', ask: 'What does it mean?', options: ['2 × 3 × c', '2 × c × c × c', '2c + 3'], answer: 1, why: 'The coefficient 2 multiplies, and the exponent 3 means three c\'s.', anatomy: '2c³' },
        ],
      },
      remember: 'Coefficient = the number in front (how many). Exponent = the tiny number on the roof (how many times multiplied).',
    },
    {
      id: 'a3-like', emoji: '👯', title: 'Like terms: the twins test',
      intro: 'Like terms are twins. They must have exactly the same letters with exactly the same exponents. The order of the letters does not matter. The coefficients can be anything.',
      steps: [
        { show: '3y² and −8y²  →  LIKE ✓', why: 'Both are y². Same letter, same exponent. The 3 and −8 do not matter.' },
        { show: '5a and 5a²  →  NOT like ✗', why: 'a and a² are different: the exponents are 1 and 2. Same coefficient does not help!' },
        { show: '2mn and 9nm  →  LIKE ✓', why: 'mn and nm are the same: m × n = n × m. Order does not matter.' },
        { show: '4c and 4d  →  NOT like ✗', why: 'Different letters.' },
        { show: 'Why care?', why: 'You can only add or subtract LIKE terms: 3y² + 2y² = 5y². But 5a + 5a² cannot be joined: it stays as it is.' },
      ],
      game: {
        title: 'Twins or not?',
        intro: 'Check the letters, then check the exponents. Ignore the numbers in front!',
        rounds: [
          { show: '7k   and   −2k', ask: 'Like terms?', options: ['Like ✓', 'Not like ✗'], answer: 0, why: 'Both are just k. The coefficients 7 and −2 do not matter.' },
          { show: '3a²   and   3a', ask: 'Like terms?', options: ['Like ✓', 'Not like ✗'], answer: 1, why: 'a² and a have different exponents (2 and 1).' },
          { show: '6mn   and   −nm', ask: 'Like terms?', options: ['Like ✓', 'Not like ✗'], answer: 0, why: 'mn = nm. The order of the letters does not matter.' },
          { show: '2y³   and   2z³', ask: 'Like terms?', options: ['Like ✓', 'Not like ✗'], answer: 1, why: 'Different letters: y and z.' },
          { show: '−c²d   and   8c²d', ask: 'Like terms?', options: ['Like ✓', 'Not like ✗'], answer: 0, why: 'Both are c²d: same letters, same exponents.' },
          { show: '9ab²   and   9a²b', ask: 'Like terms?', options: ['Like ✓', 'Not like ✗'], answer: 1, why: 'Tricky! In ab² the b is squared; in a²b the a is squared.' },
          { show: '12   and   −5', ask: 'Like terms?', options: ['Like ✓', 'Not like ✗'], answer: 0, why: 'Both are plain numbers with no letters (constants). They are like terms: 12 − 5 = 7.' },
        ],
      },
      remember: 'Like terms: same letters AND same exponents. Order of letters does not matter. Numbers in front do not matter.',
    },
    {
      id: 'a3-1', emoji: '➕✖️', title: 'Adding is not multiplying',
      intro: '+ and × do very different things in algebra. Think of x as a banana 🍌.',
      steps: [
        { show: '2x + 3x = 5x', why: 'ADDING: 2 bananas and 3 more bananas make 5 bananas. Still bananas: the exponent stays 1.' },
        { show: '2x × 3x = 2 × x × 3 × x', why: 'MULTIPLYING: write out every piece. 2x means 2 × x.' },
        { show: '= 6x²', why: 'Numbers: 2 × 3 = 6. Letters: x × x = x².' },
      ],
      tap: {
        question: 'Why is 2x × 3x not 5x?',
        options: ['5x is adding; multiplying gives 6x²', 'Because 2 × 3 = 5', 'It is 5x'],
        answer: 0,
        why: 'Multiplying multiplies the numbers (2 × 3 = 6) and the letters (x × x = x²). 5x is what ADDING gives.',
      },
      remember: '+ just counts the terms. × multiplies the numbers AND the letters.',
    },
    {
      id: 'a3-3', emoji: '➖', title: 'The sign rules',
      intro: 'When you multiply, first decide: will the answer be + or −? Here are the 4 rules, and a story to remember them.',
      steps: [
        { show: 'Positive × Positive = Positive', why: '3 × 2 = 6. A friend of a friend is a friend 😊.' },
        { show: 'Negative × Negative = Positive', why: '(−3) × (−2) = 6. An enemy of an enemy is a friend 😊.' },
        { show: 'Positive × Negative = Negative', why: '3 × (−2) = −6. A friend of an enemy is an enemy 😠.' },
        { show: 'Negative × Positive = Negative', why: '(−3) × 2 = −6. An enemy of a friend is an enemy 😠.' },
        { show: 'Many numbers? Count the minus signs', why: 'Even number of minus signs (2, 4…) → +. Odd number (1, 3…) → −.' },
      ],
      game: {
        title: 'Sign quick-fire',
        intro: 'Only the sign! Tap + or − as fast as you can.',
        rounds: [
          { show: '(−4) × 3', ask: 'The answer is…', options: ['+', '−'], answer: 1, why: 'Negative × positive = negative: −12.' },
          { show: '(−2) × (−6)', ask: 'The answer is…', options: ['+', '−'], answer: 0, why: 'Negative × negative = positive: 12.' },
          { show: '5 × (−1)', ask: 'The answer is…', options: ['+', '−'], answer: 1, why: 'Positive × negative = negative: −5.' },
          { show: '(−1) × (−1) × (−1)', ask: 'The answer is…', options: ['+', '−'], answer: 1, why: '3 minus signs. 3 is odd → −1.' },
          { show: '(−3a) × (−b)', ask: 'The answer is…', options: ['+', '−'], answer: 0, why: '2 minus signs. 2 is even → +3ab.' },
          { show: '2 × (−3) × (−4) × (−1)', ask: 'The answer is…', options: ['+', '−'], answer: 1, why: '3 minus signs → odd → −24.' },
        ],
      },
      remember: 'Same signs → +. Different signs → −. Many numbers: count the minus signs.',
    },
    {
      id: 'a3-4', emoji: '1️⃣2️⃣3️⃣', title: 'Multiplying terms: 3 easy steps',
      intro: 'Every multiplication is done the same way: 1 sign, 2 numbers, 3 letters. Watch 2p × (−4q).',
      steps: [
        { show: '1. Sign: one minus → −', why: 'Only −4q has a minus. One is odd, so the answer is negative.' },
        { show: '2. Numbers: 2 × 4 = 8', why: 'Multiply the coefficients. (The sign is already done.)' },
        { show: '3. Letters: p × q = pq', why: 'Put the letters side by side, in ABC order.' },
        { show: '2p × (−4q) = −8pq', why: 'Sign, number, letters. Done!' },
      ],
      faded: {
        prompt: 'Steps 1–3 are done. You write the answer.',
        expr: '−3a × 5b',
        given: [
          { show: '1. Sign: one minus → −', why: 'Only −3a is negative.' },
          { show: '2. Numbers: 3 × 5 = 15', why: 'Multiply the coefficients.' },
          { show: '3. Letters: a × b = ab', why: 'ABC order.' },
        ],
        answer: '−15ab',
        hint: 'Sign −, number 15, letters ab: −15ab.',
      },
      remember: '1 sign → 2 numbers → 3 letters (in ABC order).',
    },
    {
      id: 'a3-5', emoji: '🚀', title: 'Same letter? ADD the exponents',
      intro: 'When the same letter is multiplied, just count how many there are altogether.',
      steps: [
        { show: 'y² × y³ = (y × y) × (y × y × y)', why: 'Write each one out as y\'s.' },
        { show: '= y⁵', why: 'Count them: 2 + 3 = 5 y\'s. So we ADD the exponents.' },
        { show: '3y² × 2y³ = 6y⁵', why: 'Numbers multiply: 3 × 2 = 6. Exponents add: 2 + 3 = 5.' },
        { show: 'y² × z³ = y²z³', why: 'Different letters cannot be joined. Just write them side by side.' },
      ],
      game: {
        title: 'Count the letters',
        intro: 'Same letter → add the exponents. Numbers in front → multiply.',
        rounds: [
          { show: 'y³ × y⁴', ask: '= ?', options: ['y¹²', 'y⁷', '2y⁷'], answer: 1, why: '3 + 4 = 7. Add the exponents, never multiply them.' },
          { show: 'a × a⁵', ask: '= ?', options: ['a⁵', '2a⁵', 'a⁶'], answer: 2, why: 'a on its own is a¹: 1 + 5 = 6.' },
          { show: '3m² × 2m', ask: '= ?', options: ['6m³', '5m³', '6m²'], answer: 0, why: 'Numbers: 3 × 2 = 6. Letters: 2 + 1 = 3.' },
          { show: 'k² × k²', ask: '= ?', options: ['2k²', 'k⁴', 'k²'], answer: 1, why: '2 + 2 = 4: k × k × k × k.' },
          { show: 'c² × d³', ask: '= ?', options: ['cd⁵', 'c²d³', '(cd)⁵'], answer: 1, why: 'Different letters: they just sit side by side.' },
          { show: '4b³ × (−2b⁴)', ask: '= ?', options: ['−8b⁷', '8b⁷', '−8b¹²'], answer: 0, why: 'Sign: one minus → −. Numbers: 4 × 2 = 8. Letters: 3 + 4 = 7.' },
        ],
      },
      faded: {
        prompt: 'Numbers and letters are done. You put them together.',
        expr: '2r² × 3r³',
        given: [
          { show: 'Sign: no minus → +', why: 'Both are positive.' },
          { show: 'Numbers: 2 × 3 = 6', why: 'Multiply the coefficients.' },
          { show: 'Letters: r² × r³ = r⁵', why: 'Same letter: 2 + 3 = 5.' },
        ],
        answer: '6r⁵',
        hint: 'Number 6, letters r⁵: 6r⁵.',
      },
      remember: 'Same letter: ADD the exponents. Numbers: MULTIPLY.',
    },
    {
      id: 'a3-6', emoji: '🧩', title: 'Bigger terms: one letter at a time',
      intro: 'Long terms are not harder. Same 3 steps, and then each letter on its own. Watch (3y²z)(−2yz³).',
      steps: [
        { show: '1. Sign: one minus → −', why: 'Only −2yz³ has a minus.' },
        { show: '2. Numbers: 3 × 2 = 6', why: 'Multiply the coefficients.' },
        { show: '3a. y: y² × y = y³', why: 'y on its own is y¹: 2 + 1 = 3.' },
        { show: '3b. z: z × z³ = z⁴', why: 'Same for z: 1 + 3 = 4.' },
        { show: '= −6y³z⁴', why: 'Sign, number, then each letter with its new exponent.' },
      ],
      faded: {
        prompt: 'Everything is worked out. You put it together.',
        expr: '(−3mn)(−2m²n³)',
        given: [
          { show: 'Sign: two minus → +', why: 'Two is even.' },
          { show: 'Numbers: 3 × 2 = 6', why: 'Multiply the coefficients.' },
          { show: 'm: m × m² = m³', why: '1 + 2 = 3.' },
          { show: 'n: n × n³ = n⁴', why: '1 + 3 = 4.' },
        ],
        answer: '6m³n⁴',
        hint: 'Put together: 6, then m³, then n⁴: 6m³n⁴.',
      },
      remember: 'Take one letter at a time and add its exponents.',
    },
    {
      id: 'a3-7', emoji: '🟦', title: 'Squaring a bracket',
      intro: 'A power outside a bracket squares EVERYTHING inside: the number too!',
      steps: [
        { show: '(5y)² = 5y × 5y', why: 'Squared means "times itself". Write it out.' },
        { show: '= 25y²', why: 'Numbers: 5 × 5 = 25. Letters: y × y = y².' },
        { show: 'But 5y² = 5 × y × y', why: 'No bracket: only the y is squared. The 5 is not.' },
        { show: '(−2m)² = 4m²', why: '(−2m) × (−2m): two minus signs → +. 2 × 2 = 4.' },
      ],
      game: {
        title: 'Square everything',
        intro: 'Square the number AND the letters inside the bracket.',
        rounds: [
          { show: '(4k)²', ask: '= ?', options: ['4k²', '16k²', '8k'], answer: 1, why: '4 × 4 = 16 and k × k = k².' },
          { show: '(−3y)²', ask: '= ?', options: ['9y²', '−9y²', '−3y²'], answer: 0, why: 'Two minus signs → +. 3 × 3 = 9.' },
          { show: '(2ab)²', ask: '= ?', options: ['2a²b²', '4ab', '4a²b²'], answer: 2, why: 'Square everything: 2² = 4, a², b².' },
          { show: 'Which one is 36p²?', ask: 'Tap it', options: ['6p²', '(6p)²'], answer: 1, why: '(6p)² = 6p × 6p = 36p². 6p² is only 6 × p × p.' },
        ],
      },
      remember: '(5y)² = 25y², but 5y² is just 5 × y × y.',
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
    {
      id: 'a3-rules', emoji: '📋', title: 'Your cheat sheet: 4 rules',
      intro: 'That is the whole missed lesson! Here it is on one card. Then the boss round. 👑',
      steps: [
        { show: '1. Multiply the numbers:  3a × 4b = 12ab', why: 'Coefficients multiply. Letters go side by side.' },
        { show: '2. Same letter: add the exponents:  m² × m⁶ = m⁸', why: '2 + 6 = 8.' },
        { show: '3. Like terms only:  5y + 2y = 7y', why: 'You can only add or subtract terms with exactly the same letters and exponents. 5y + 2y² stays as it is.' },
        { show: '4. Squaring brackets:  (7n)² = 49n²', why: 'Square everything inside.' },
      ],
      game: {
        title: 'Boss round 👑',
        intro: 'All the rules mixed together. You can do it!',
        rounds: [
          { show: '−5d', ask: 'What is the coefficient?', options: ['5', '−5', 'd'], answer: 1, why: 'The number in front, with its sign: −5.', anatomy: '−5d' },
          { show: '4t + 3t²', ask: 'Can you join these?', options: ['Yes: 7t³', 'No: unlike terms', 'Yes: 7t²'], answer: 1, why: 't and t² have different exponents, so it stays 4t + 3t².' },
          { show: '(−6) × (−2)', ask: '= ?', options: ['12', '−12', '−8'], answer: 0, why: 'Negative × negative = positive.' },
          { show: '2g³ × 5g²', ask: '= ?', options: ['7g⁵', '10g⁶', '10g⁵'], answer: 2, why: '2 × 5 = 10. 3 + 2 = 5.' },
          { show: '8h − 3h + h', ask: '= ?', options: ['6h', '5h', '4h'], answer: 0, why: 'Like terms: 8 − 3 + 1 = 6. (h is 1h!)' },
          { show: '(3w)²', ask: '= ?', options: ['3w²', '9w²', '6w'], answer: 1, why: 'Square everything: 3 × 3 = 9, w × w = w².' },
        ],
      },
      remember: 'Multiply numbers. Add exponents (same letter). Add only like terms. Square everything in the bracket.',
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
        { show: 'y means 1y¹  and  −y² means −1y²', why: 'With no number written, the coefficient is 1 (or −1). With no power written, the exponent is 1.' },
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
        { show: '4xz and −3zx: like', why: 'xz = zx: the order of the letters does not matter.' },
        { show: '−2a²b and 5ab²: unlike', why: 'In a²b the a is squared; in ab² the b is squared.' },
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
