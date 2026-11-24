// The two Mock Tests (45 minutes, Criteria B and C), from the teacher's task and the build plan.
// Part 1: one short question from each of the teacher's topics (a version she has not met recently).
// Part 2: an investigation of a new growing pattern, in the Criterion B steps.
import type { MockExam } from '../../content/types';

export const mocks: MockExam[] = [
  {
    id: 'mock-1', title: 'Mock Test 1', minutes: 45, partA: [], partB: [],
    maths: {
      part1: ['p1-arithmetic', 'a1-collect', 'a2-subtract', 'a3-coef-powers', 'a3-square', 'p4-square', 'a2-real', 'pr-rule'],
      investigation: {
        intro: 'A tile pattern: 2 orange tiles stay at every stage, and each new stage adds a column of blue tiles.',
        picture: { kind: 'columns', figures: [1, 2, 3], per: 5, base: 2 },
        terms: [7, 12, 17, 22, 27, 32],
        rule: '5n + 2',
        test: { stage: 10, value: 52 },
        target: { value: 77, stage: 15 },
        describe: {
          ideas: [
            { label: 'Each stage adds 5 tiles (one new column of 5)', words: ['5', 'five', 'column'] },
            { label: 'It starts with 7 tiles at stage 1', words: ['7', 'seven', 'start', 'begin'] },
            { label: 'Used the words "each stage" or "common difference"', words: ['each stage', 'common difference', 'difference'] },
          ],
          model: 'The pattern begins with 7 tiles at stage 1. Each new stage adds a column of 5 blue tiles, so the number of tiles goes up by 5 every time: the common difference is 5.',
        },
        justify: {
          ideas: [
            { label: 'The 5 (in 5n) is the 5 new blue tiles at each stage', words: ['5n', 'five', 'column'] },
            { label: 'The 2 is the two orange tiles that stay at every stage', words: ['2', 'two', 'orange'] },
            { label: 'Tested the rule on a stage (for example stage 3: 5(3) + 2 = 17)', words: ['check', 'test', '17'] },
          ],
          model: 'Each stage adds a column of 5 blue tiles, so stage n has 5n blue tiles. The 2 orange tiles are there at every stage, so we add 2: t = 5n + 2, where n is the stage number. I checked it with stage 3: 5(3) + 2 = 17, and the picture has 17 tiles.',
        },
      },
    },
  },
  {
    id: 'mock-2', title: 'Mock Test 2', minutes: 45, partA: [], partB: [],
    maths: {
      part1: ['p1-geometric', 'a1-collect-powers', 'a2-subtract', 'a3-big-terms', 'a3-square', 'p4-brackets', 'a3-area', 'in-find-rule'],
      investigation: {
        intro: 'A tile pattern: 4 orange tiles stay at every stage, and each new stage adds a column of 3 blue tiles.',
        picture: { kind: 'columns', figures: [1, 2, 3], per: 3, base: 4 },
        terms: [7, 10, 13, 16, 19, 22],
        rule: '3n + 4',
        test: { stage: 12, value: 40 },
        target: { value: 64, stage: 20 },
        describe: {
          ideas: [
            { label: 'Each stage adds 3 tiles (one new column of 3)', words: ['3', 'three', 'column'] },
            { label: 'It starts with 7 tiles at stage 1', words: ['7', 'seven', 'start', 'begin'] },
            { label: 'Used the words "each stage" or "common difference"', words: ['each stage', 'common difference', 'difference'] },
          ],
          model: 'The pattern begins with 7 tiles at stage 1. Each new stage adds a column of 3 blue tiles, so the number of tiles goes up by 3 every time: the common difference is 3.',
        },
        justify: {
          ideas: [
            { label: 'The 3 (in 3n) is the 3 new blue tiles at each stage', words: ['3n', 'three', 'column'] },
            { label: 'The 4 is the four orange tiles that stay at every stage', words: ['4', 'four', 'orange'] },
            { label: 'Tested the rule on a stage (for example stage 2: 3(2) + 4 = 10)', words: ['check', 'test', '10'] },
          ],
          model: 'Each stage adds a column of 3 blue tiles, so stage n has 3n blue tiles. The 4 orange tiles are there at every stage, so we add 4: t = 3n + 4, where n is the stage number. I checked it with stage 2: 3(2) + 4 = 10, and the picture has 10 tiles.',
        },
      },
    },
  },
];
