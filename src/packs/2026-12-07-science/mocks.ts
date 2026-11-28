// Two practice tests in the teacher's Criterion A style: open questions, no multiple choice
// (her earlier science tests were "all open questions, 45 min"). The teacher gave no format for this test,
// so each paper takes ten written questions across the three decks. Nothing is read aloud; she writes or speaks.
import type { MockExam } from '../../content/types';

export const mocks: MockExam[] = [
  {
    id: 'mock-1', title: 'Mock Test 1', minutes: 40,
    partA: ['w-cells-common', 'w-stem-define', 'w-medicine', 'w-hooke', 'w-compound', 'w-magnification', 'w-system', 'w-diabetes', 'w-respiration', 'w-plant-only'],
    partB: [],
  },
  {
    id: 'mock-2', title: 'Mock Test 2', minutes: 40,
    partA: ['w-form-function', 'w-stem-types', 'w-ethics', 'w-janssen', 'w-leeuwenhoek', 'w-compare-cells', 'w-beta', 'w-needs', 'w-membrane', 'w-mito'],
    partB: [],
  },
];
