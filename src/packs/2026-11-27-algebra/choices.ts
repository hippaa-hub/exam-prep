// Choose-the-answer questions (Jenia, 25 Nov: "more questions where you can choose, none where you must speak").
// Every one is a homework type, with different numbers from the homework due 25 Nov.
// The right option is listed first; the app shuffles the options.
import type { ChoiceItem } from '../../content/types';

const ch = (
  id: string, concept: string, prompt: string, options: string[], explain: string, whyNot: Record<string, string>,
): ChoiceItem => ({ id, concept, type: 'choice', prompt, options, answer: 0, explain, whyNot });

/** Multiplying terms and the exponent rules. */
export const choicesA3: ChoiceItem[] = [
  ch('a3-ch-1', 'a3-signs', 'Multiply: −3a × 4b', ['−12ab', '12ab', '−7ab', '−12a'],
    'Signs: one minus, so the answer is negative. Numbers: 3 × 4 = 12. Letters: ab. So −12ab.',
    { '12ab': 'One minus sign makes the answer negative.', '−7ab': 'Multiply the numbers (3 × 4 = 12), do not add them.', '−12a': 'Keep both letters: a and b give ab.' }),
  ch('a3-ch-2', 'a3-signs', 'Multiply: (−5m) × (−2n)', ['10mn', '−10mn', '−7mn', '10m'],
    'Two minus signs make a plus. 5 × 2 = 10. Letters: mn. So 10mn.',
    { '−10mn': 'Minus times minus is PLUS.', '−7mn': 'Multiply the numbers: 5 × 2 = 10.', '10m': 'Keep both letters: mn.' }),
  ch('a3-ch-3', 'a3-same-letter', 'Multiply: 4k × 5k', ['20k²', '9k', '20k', '9k²'],
    '4 × 5 = 20, and k × k = k². So 20k².',
    { '9k': 'That is adding. With × you multiply: 4 × 5 = 20 and k × k = k².', '20k': 'k × k is k², not k.', '9k²': 'Multiply the numbers: 4 × 5 = 20.' }),
  ch('a3-ch-4', 'a3-product-rule', 'y⁵ × y² = ?', ['y⁷', 'y¹⁰', '2y⁷', 'y³'],
    'Same base, so ADD the exponents: 5 + 2 = 7.',
    { 'y¹⁰': 'Do not multiply the exponents. Add them: 5 + 2 = 7.', '2y⁷': 'There is no 2 in front: each y has an invisible 1, and 1 × 1 = 1.', 'y³': 'Add the exponents, do not subtract them.' }),
  ch('a3-ch-5', 'a3-coef-powers', 'Multiply: 3a³ × 4a²', ['12a⁵', '7a⁵', '12a⁶', '12a'],
    'Numbers: 3 × 4 = 12. Letters: a³ × a² = a⁵ (add 3 + 2). So 12a⁵.',
    { '7a⁵': 'Multiply the numbers: 3 × 4 = 12.', '12a⁶': 'Add the exponents (3 + 2 = 5), do not multiply them.', '12a': 'Keep the exponents: a³ × a² = a⁵.' }),
  ch('a3-ch-6', 'a3-coef-powers', 'A student writes 4y³ × 2y² = 8y⁶. What is the mistake?', ['The exponents were multiplied. Add them: 8y⁵', 'The numbers should be added: 6y⁵', 'There is no mistake', 'The exponents should be subtracted: 8y¹'],
    'Same base, so add the exponents: 3 + 2 = 5. The numbers multiply: 4 × 2 = 8. So 8y⁵.',
    { 'The numbers should be added: 6y⁵': 'The numbers multiply: 4 × 2 = 8.', 'There is no mistake': 'y³ × y² = y⁵, not y⁶.', 'The exponents should be subtracted: 8y¹': 'When you multiply, you ADD the exponents.' }),
  ch('a3-ch-7', 'a3-big-terms', 'Multiply: 2m²n × (−3mn²)', ['−6m³n³', '6m³n³', '−6m²n²', '−m³n³'],
    'Signs: one minus, so negative. Numbers: 2 × 3 = 6. m² × m = m³, n × n² = n³. So −6m³n³.',
    { '6m³n³': 'One minus sign makes the answer negative.', '−6m²n²': 'Add the exponents for each letter: m²·m = m³, n·n² = n³.', '−m³n³': 'Multiply the numbers: 2 × 3 = 6.' }),
  ch('a3-ch-8', 'a3-square', '(5p)² = ?', ['25p²', '5p²', '10p²', '25p'],
    'Square everything inside: 5² = 25 and p² . So (5p)² = 5p × 5p = 25p².',
    { '5p²': 'The 5 is inside the bracket, so it is squared too: 5² = 25.', '10p²': '5² is 5 × 5 = 25, not 5 × 2.', '25p': 'The p is squared too: p².' }),
  ch('a3-ch-9', 'a3-area', 'A rectangle has sides 2y³ cm and 5y² cm. What is its area?', ['10y⁵ cm²', '7y⁵ cm²', '10y⁶ cm²', '14y⁵ cm²'],
    'Area = length × width: 2 × 5 = 10, y³ × y² = y⁵. So 10y⁵ cm².',
    { '7y⁵ cm²': 'Area is length TIMES width: 2 × 5 = 10.', '10y⁶ cm²': 'Add the exponents: 3 + 2 = 5.', '14y⁵ cm²': 'That mixes in the perimeter. Area is just length × width.' }),
  ch('a3-ch-10', 'a3-add-vs-mul', 'Why is 2x + 3x = 5x, but 2x × 3x = 6x²?', ['Adding counts the x\'s; multiplying gives x × x = x²', 'Both should be 5x²', 'Multiplying adds the numbers', 'Adding also makes x²'],
    '2x + 3x is 5 lots of x. 2x × 3x = 2 × 3 × x × x = 6x².',
    { 'Both should be 5x²': 'Adding never changes the power: 2x + 3x = 5x.', 'Multiplying adds the numbers': 'Multiplying multiplies the numbers: 2 × 3 = 6.', 'Adding also makes x²': 'Only multiplying x by x makes x².' }),
  ch('a3-ch-11', 'a3-product-rule', 'Why is a⁴ × a³ = a⁷?', ['a·a·a·a × a·a·a is seven a\'s multiplied together', 'Because 4 × 3 = 7', 'Because you multiply the exponents', 'It is wrong: the answer is a¹²'],
    'Write it out: (a·a·a·a)(a·a·a) has 7 a\'s, so a⁷. That is why you add 4 + 3.',
    { 'Because 4 × 3 = 7': '4 × 3 is 12. You ADD: 4 + 3 = 7.', 'Because you multiply the exponents': 'You add the exponents when you multiply the same base.', 'It is wrong: the answer is a¹²': 'Count the a\'s: 4 + 3 = 7, so a⁷.' }),
];

/** Coefficient, exponent and like terms. */
export const choicesA1: ChoiceItem[] = [
  ch('a1-ch-1', 'a1-parts', 'What is the coefficient in 8k²?', ['8', '2', 'k', '16'],
    'The coefficient is the number in front: 8.',
    { '2': '2 is the exponent (the small power).', 'k': 'k is the variable (the letter).', '16': 'Nothing is multiplied here: the number in front is 8.' }),
  ch('a1-ch-2', 'a1-parts', 'What is the exponent of m in −m³?', ['3', '−1', '1', '0'],
    'The exponent is the small number: 3. (The coefficient is −1.)',
    { '−1': '−1 is the coefficient (the invisible 1 with the minus).', '1': 'A small 3 is written, so the exponent is 3.', '0': 'A small 3 is written, so the exponent is 3.' }),
  ch('a1-ch-3', 'a1-parts', 'What is the coefficient in −y⁴?', ['−1', '4', '1', '−4'],
    'Nothing is written in front, so it is an invisible 1, with the minus: −1.',
    { '4': '4 is the exponent.', '1': 'Keep the sign: the coefficient is −1.', '−4': '4 is the exponent, not the coefficient.' }),
  ch('a1-ch-4', 'a1-like', 'Which pair are like terms?', ['5ab and −2ba', '3x² and 3x', '4m²n and 4mn²', '7y and 7'],
    'ab and ba are the same letters with the same powers. The order does not matter.',
    { '3x² and 3x': 'x² and x have different powers.', '4m²n and 4mn²': 'The powers are on different letters: m²n is not mn².', '7y and 7': '7 has no letter.' }),
  ch('a1-ch-5', 'a1-like', 'Which term is NOT like 6t²?', ['6t', '−t²', '2t²', 't²'],
    '6t has power 1, but 6t² has power 2. The number in front does not matter.',
    { '−t²': 'Same letter, same power (t²): like.', '2t²': 'Same letter, same power (t²): like.', 't²': 'Same letter, same power (t²): like.' }),
  ch('a1-ch-6', 'a1-collect', 'Simplify: 6k + 3k − 2k', ['7k', '11k', '7k³', '5k'],
    '6 + 3 − 2 = 7, so 7k.',
    { '11k': 'The 2k is subtracted: 6 + 3 − 2 = 7.', '7k³': 'Adding never changes the power.', '5k': '6 + 3 = 9, then 9 − 2 = 7.' }),
  ch('a1-ch-7', 'a1-collect', 'Simplify: 5m + 2n − 3m + 4n', ['2m + 6n', '8mn', '2m + 2n', '8m + 6n'],
    'm terms: 5m − 3m = 2m. n terms: 2n + 4n = 6n. So 2m + 6n.',
    { '8mn': 'm and n are unlike: keep them apart.', '2m + 2n': 'Add the n terms: 2n + 4n = 6n.', '8m + 6n': 'The 3m is subtracted: 5m − 3m = 2m.' }),
  ch('a1-ch-8', 'a1-collect-powers', 'Simplify: 9a² + 4a − 2a²', ['7a² + 4a', '11a³', '7a² − 4a', '13a²'],
    'a² terms: 9a² − 2a² = 7a². The 4a is unlike, so it stays: 7a² + 4a.',
    { '11a³': 'a² and a are unlike: they cannot be added.', '7a² − 4a': 'The 4a keeps its plus sign.', '13a²': '4a is not an a² term.' }),
  ch('a1-ch-9', 'a1-why-like', 'Why can 3p + 2p be combined, but 3p + 2p² cannot?', ['3p and 2p are like terms; p and p² are not', 'Only small numbers can be added', 'Both can be combined', '3p + 2p² = 5p³'],
    'Like terms have the same letters with the same powers. p and p² have different powers.',
    { 'Only small numbers can be added': 'The numbers do not matter, only the letters and powers.', 'Both can be combined': 'p and p² are unlike, so 3p + 2p² stays as it is.', '3p + 2p² = 5p³': 'Adding never changes the power, and unlike terms cannot be added.' }),
];

/** Sequences. */
export const choicesP1: ChoiceItem[] = [
  ch('p1-ch-1', 'p1-geometric', 'What type is 3, 9, 27, 81?', ['Geometric: ×3 each time', 'Arithmetic: +6 each time', 'Neither', 'Arithmetic: +3 each time'],
    '9 ÷ 3 = 3, 27 ÷ 9 = 3, 81 ÷ 27 = 3: the same ratio, so geometric.',
    { 'Arithmetic: +6 each time': '+6, then +18, then +54: the difference changes.', 'Neither': 'There is a common ratio: ×3.', 'Arithmetic: +3 each time': 'The difference is not the same. Divide instead: ×3.' }),
  ch('p1-ch-2', 'p1-geometric', 'Next two terms of 48, 24, 12, 6?', ['3, 1.5', '0, −6', '4, 2', '2, 1'],
    'Each term is halved (÷2): 6 ÷ 2 = 3, 3 ÷ 2 = 1.5.',
    { '0, −6': 'It is not −6 each time: 48 − 24 = 24, 24 − 12 = 12. It halves.', '4, 2': '6 ÷ 2 = 3, not 4.', '2, 1': 'Halve 6: 6 ÷ 2 = 3, then 1.5.' }),
  ch('p1-ch-3', 'p1-arithmetic', 'Next two terms of 7, 11, 15, 19?', ['23, 27', '21, 23', '38, 76', '20, 21'],
    '+4 each time: 19 + 4 = 23, 23 + 4 = 27.',
    { '21, 23': 'The difference is 4, not 2.', '38, 76': 'It is not doubling: 11 is not 7 × 2.', '20, 21': 'Add 4 each time.' }),
  ch('p1-ch-4', 'p1-evidence', 'Is 4, 12, 36, 108 arithmetic or geometric?', ['Geometric: 12 ÷ 4 = 3 and 36 ÷ 12 = 3', 'Arithmetic: +8 each time', 'Arithmetic: it goes up', 'Neither'],
    'Divide: the ratio is 3 every time, so geometric. The differences (+8, +24, +72) change.',
    { 'Arithmetic: +8 each time': '12 − 4 = 8, but 36 − 12 = 24. The difference changes.', 'Arithmetic: it goes up': '"It goes up" is not evidence. Show the ratios: ×3.', 'Neither': 'There is a common ratio: ×3.' }),
  ch('p1-ch-5', 'p1-arithmetic', 'What is the common difference of 25, 21, 17, 13?', ['−4', '4', '−3', '÷2'],
    '21 − 25 = −4: it goes down by 4 each time.',
    { '4': 'It goes DOWN, so the difference is negative: −4.', '−3': '25 − 21 = 4, so −4.', '÷2': 'It is not halving: 25 ÷ 2 is not 21.' }),
];

/** Substitution with negative numbers. */
export const choicesP4: ChoiceItem[] = [
  ch('p4-ch-1', 'p4-negative', 'x = −2. What is 5 − 3x?', ['11', '−1', '−11', '1'],
    '5 − 3(−2) = 5 + 6 = 11.',
    { '−1': '3 × (−2) = −6, and taking away −6 is adding 6: 5 + 6 = 11.', '−11': '5 − (−6) = 5 + 6 = 11.', '1': 'Put −2 in brackets: 5 − 3(−2) = 5 + 6.' }),
  ch('p4-ch-2', 'p4-negative', 'For x = −4, what is y = 3 − 2x?', ['11', '−5', '5', '−11'],
    '3 − 2(−4) = 3 + 8 = 11.',
    { '−5': '2 × (−4) = −8, and taking away −8 is adding: 3 + 8 = 11.', '5': 'Taking away −8 is adding: 3 + 8 = 11.', '−11': '3 − (−8) = 3 + 8 = 11.' }),
  ch('p4-ch-3', 'p4-square', 'a = −3. What is 2 − a²?', ['−7', '11', '−4', '7'],
    'Square first: (−3)² = 9. Then 2 − 9 = −7.',
    { '11': 'The minus in front stays: 2 − 9 = −7.', '−4': '(−3)² = 9, not 6.', '7': '2 − 9 is negative: −7.' }),
  ch('p4-ch-4', 'p4-square', 'Which is right?', ['(−4)² = 16 and −4² = −16', '(−4)² = −16 and −4² = 16', 'Both are 16', 'Both are −16'],
    '(−4)² = (−4) × (−4) = 16. Without brackets only the 4 is squared: −4² = −(4 × 4) = −16.',
    { '(−4)² = −16 and −4² = 16': 'Minus times minus is plus, so (−4)² = 16.', 'Both are 16': 'Without brackets, only the 4 is squared: −4² = −16.', 'Both are −16': '(−4) × (−4) = +16.' }),
  ch('p4-ch-5', 'p4-why', 'Why is (−2)² different from −2²?', ['(−2)² = (−2) × (−2) = 4, but −2² = −(2 × 2) = −4', 'They are the same: 4', 'They are the same: −4', '(−2)² = −4 and −2² = 4'],
    'The bracket squares the minus too. Without the bracket, only the 2 is squared.',
    { 'They are the same: 4': '−2² means −(2 × 2) = −4.', 'They are the same: −4': '(−2) × (−2) = +4.', '(−2)² = −4 and −2² = 4': 'It is the other way round.' }),
];

/** Patterns, rules and the nth term. */
export const choicesPR: ChoiceItem[] = [
  ch('pr-ch-1', 'pr-rule', 'Which formula fits 5, 8, 11, 14?', ['3n + 2', '2n + 3', '5n', '3n + 5'],
    'The difference is 3, so 3n. For n = 1: 3 + 2 = 5. ✓ Check n = 4: 12 + 2 = 14. ✓',
    { '2n + 3': 'The difference is 3, so the number in front of n is 3.', '5n': '5n gives 5, 10, 15: the difference would be 5.', '3n + 5': 'For n = 1 this gives 8, not 5.' }),
  ch('pr-ch-2', 'pr-rule', 'Which formula fits 9, 14, 19, 24?', ['5n + 4', '4n + 5', '9n', '5n + 9'],
    'The difference is 5, so 5n. For n = 1: 5 + 4 = 9. ✓',
    { '4n + 5': 'The difference is 5, so the number in front of n is 5.', '9n': '9n gives 9, 18, 27: the difference would be 9.', '5n + 9': 'For n = 1 this gives 14, not 9.' }),
  ch('pr-ch-3', 'pr-toothpicks', 'Toothpick triangles: t = 2n + 1. How many toothpicks in figure 10?', ['21', '20', '12', '30'],
    '2(10) + 1 = 20 + 1 = 21.',
    { '20': 'Do not forget the + 1.', '12': '2n means 2 × n: 2 × 10 = 20, then + 1.', '30': 'Each triangle adds 2, not 3.' }),
  ch('pr-ch-4', 'pr-matchsticks', 'Matchstick squares: m = 3n + 1. Can a row have 50 matchsticks?', ['No: 3n + 1 = 50 gives n = 16⅓, not a whole number', 'Yes, figure 16', 'Yes, figure 17', 'Yes, figure 50'],
    '3n = 49, n = 16⅓. A figure number must be a whole number, so no.',
    { 'Yes, figure 16': 'Figure 16 has 3(16) + 1 = 49 sticks.', 'Yes, figure 17': 'Figure 17 has 3(17) + 1 = 52 sticks.', 'Yes, figure 50': 'Figure 50 has 151 sticks.' }),
  ch('pr-ch-5', 'pr-meaning', 'Why is the matchstick rule 3n + 1 and not 4n?', ['Each new square shares a side, so it adds only 3 sticks; the first square needs 1 extra', 'Every square has 4 sides, so 4n is right', 'Because 3 + 1 = 4', 'The first square has 3 sticks'],
    'The squares share sides: each new one adds 3 sticks, and the very first needs one more (4 = 3 + 1).',
    { 'Every square has 4 sides, so 4n is right': 'Shared sides are counted once: 2 squares use 7 sticks, not 8.', 'Because 3 + 1 = 4': 'That only explains figure 1.', 'The first square has 3 sticks': 'The first square has 4 sticks.' }),
  ch('pr-ch-6', 'pr-use-rule', 'Find the 20th term of 6, 10, 14, 18, …', ['82', '80', '86', '78'],
    'The rule is 4n + 2. 4(20) + 2 = 82.',
    { '80': 'Do not forget the + 2: 4(20) + 2 = 82.', '86': 'The rule is 4n + 2, not 4n + 6.', '78': '4 × 20 = 80, then + 2 = 82.' }),
];

/** Real-life rules and investigations. */
export const choicesIN: ChoiceItem[] = [
  ch('in-ch-1', 'in-use-rule', 'Sticker shop: y = 3x + 2. How many stickers in 7 packs?', ['23', '21', '27', '12'],
    '3(7) + 2 = 21 + 2 = 23.',
    { '21': 'Add the 2 bonus stickers: 21 + 2 = 23.', '27': '3 × 7 = 21, not 25.', '12': '3x means 3 × x: 3 × 7 = 21.' }),
  ch('in-ch-2', 'in-use-rule', 'Stepping stones: s = 5n + 4. How many stones in path 10?', ['54', '50', '59', '45'],
    '5(10) + 4 = 50 + 4 = 54.',
    { '50': 'Add the 4: 50 + 4 = 54.', '59': '5 × 10 = 50, then + 4 = 54.', '45': '5 × 10 = 50, then add 4: 54.' }),
  ch('in-ch-3', 'in-meaning', 'Number machine y = 2x + 5. What is the common difference?', ['2', '5', '7', '1'],
    'The number in front of x is the common difference: y goes 7, 9, 11, … (+2).',
    { '5': '5 is the extra amount added once, not the step.', '7': '7 is the first output (x = 1), not the step.', '1': 'Each time x goes up by 1, y goes up by 2.' }),
  ch('in-ch-4', 'in-explain', 'Why does y = 2n − 1 always give odd numbers?', ['2n is always even, and even − 1 is odd', 'Because 2 is odd', 'Because n is always odd', 'Because it starts at 2'],
    '2 × any whole number is even. One less than an even number is odd.',
    { 'Because 2 is odd': '2 is an even number, not odd.', 'Because n is always odd': 'n can be any number: 1, 2, 3, …', 'Because it starts at 2': 'It starts at 1 (2 × 1 − 1).' }),
  ch('in-ch-5', 'in-explain', 'Which explanation of the matchsticks 4, 7, 10, 13 is best?', ['Each new square adds 3 sticks, so m = 3n + 1. Check: figure 2 = 7 ✓. Figure 8 = 25', 'It goes up', 'It adds 4 each time, so figure 8 = 32', 'It doubles, so figure 8 = 512'],
    'A full answer says how it grows, gives the rule, checks it, and predicts.',
    { 'It goes up': 'That is not enough: say by how much, give the rule and check it.', 'It adds 4 each time, so figure 8 = 32': '7 − 4 = 3: it adds 3, not 4.', 'It doubles, so figure 8 = 512': '4 × 2 = 8, not 7: it adds 3.' }),
  ch('in-ch-6', 'in-meaning', 'Tile cross: t = 4n + 1. What does the 1 mean?', ['The centre tile, there at every stage', 'The first stage', 'One arm', 'One new tile each stage'],
    'The 4n is the four arms of length n. The + 1 is the one centre tile.',
    { 'The first stage': 'n is the stage. The 1 is a tile that is always there.', 'One arm': 'There are 4 arms: that is the 4.', 'One new tile each stage': 'Each stage adds 4 tiles (one on each arm).' }),
];
