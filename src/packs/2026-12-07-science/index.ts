// Exam pack: Science, "From Cells to Organ Systems", formative assessment (type: Exam) on Monday 7 December 2026, 10:00.
// The teacher attached three decks to the test on 25 Nov: "Cells: The Building Blocks of Life",
// "How Do We See Cells?" and "A Cell is a System" (organelles). Every question here comes from those slides
// (notes in adele-science/SCIENCE_STUDIED.md). The lesson on specialised cells (26 Nov) and the textbook page on
// diffusion and osmosis (for 3 Dec) are in the same unit but were NOT attached to the test, so they are not in the app
// (Jenia, 28 Nov: only the teacher's test material). Cards for them are kept in extra.ts, unused, in case she adds them.
import type { Item, Pack, Topic } from '../../content/types';
import { c1 } from './c1';
import { c2 } from './c2';
import { c3 } from './c3';
import { c4 } from './c4';
import { mocks } from './mocks';
import { examples, meanings, simple, whyNot } from './why';
import { written } from './written';

/** The picture for each thing to know: the science app's illustrations (public/img), shown after she answers. */
const photoOf: Record<string, string> = {
  'c1-cells': 'c1-living-things', 'c1-form-function': 'c1-cell-shapes', 'c1-system': 'c3-system',
  'c1-stem-cell': 'c1-stem-cell', 'c1-stem-types': 'c1-stem-cell', 'c1-medicine': 'c1-medicine', 'c1-ethics': 'c1-ethics',
  'c2-ancient': 'c2-water-drop-lens', 'c2-janssen': 'c2-janssen', 'c2-hooke': 'c2-hooke-cork', 'c2-leeuwenhoek': 'c2-leeuwenhoek',
  'c2-parts': 'c2-student-microscope', 'c2-magnification': 'c2-student-microscope', 'c2-plant-animal': 'c2-plant-animal-view',
  'c3-system': 'c3-system', 'c3-beta-cells': 'c3-beta-cells', 'c3-diabetes': 'c3-insulin-pen',
  'c3-respiration': 'c3-respiration', 'c3-needs': 'c3-respiration',
  'c4-membrane': 'c3-membrane', 'c4-nucleus': 'c3-nucleus', 'c4-nucleolus': 'c3-nucleus', 'c4-cytoplasm': 'c3-animal-cell',
  'c4-mitochondria': 'c3-mitochondrion', 'c4-wall': 'c3-plant-cell', 'c4-chloroplast': 'c3-chloroplast', 'c4-vacuole': 'c3-vacuole',
  'c4-found-in': 'c3-plant-cell', 'c4-table': 'c3-animal-cell',
};
const photoOfItem: Record<string, string> = { 'c2-hooke-why': 'c2-monk-rooms', 'c4-mito-liver': 'c3-liver-cell', 'w-mito': 'c3-mitochondrion' };

/** Adds a topic's written questions, the reasons why wrong answers are wrong, and the pictures. */
const complete = (t: Topic): Topic => ({
  ...t,
  items: [...t.items, ...(written[t.id] ?? [])].map((it): Item => {
    const photo = photoOfItem[it.id] ?? (it.concept ? photoOf[it.concept] : undefined);
    const withPhoto = photo ? { ...it, photo } : it;
    return (withPhoto.type === 'choice' || withPhoto.type === 'pair') && whyNot[it.id] ? { ...withPhoto, whyNot: whyNot[it.id] } : withPhoto;
  }),
});

export const pack: Pack = {
  id: '2026-12-07-science',
  subject: 'Science',
  title: 'From Cells to Organ Systems',
  date: '2026-12-07',
  criteria: ['A: knowing and understanding'],
  topics: [c1, c2, c3, c4].map(complete),
  meanings,
  simple,
  examples,
  mocks,
  plan: [
    {
      day: -8, label: 'Organelles: the parts of a cell and their jobs', topics: ['C4'],
      extras: [{ kind: 'game', game: 'key-terms' }, { kind: 'table', group: 'Organelles' }],
    },
    {
      day: -7, label: 'A cell is a system: beta-cells, diabetes and respiration', topics: ['C3'],
      extras: [{ kind: 'game', game: 'this-or-that' }],
    },
    {
      day: -6, label: 'How we see cells: the microscope and its history', topics: ['C2'],
      extras: [{ kind: 'table', group: 'Microscope parts' }, { kind: 'table', group: 'Plant vs animal cells' }],
    },
    {
      day: -5, label: 'Cells and stem cells', topics: ['C1'],
      extras: [{ kind: 'game', game: 'key-terms' }],
    },
    { day: -4, label: 'A mixed round of everything' },
    { day: -3, label: 'Another mixed round of everything' },
    { day: -2, label: 'A mixed round, then Mock Test 1', mock: 'mock-1' },
    { day: -1, label: 'One more mixed round, then Mock Test 2', mock: 'mock-2' },
  ],
  examTips: [
    {
      title: 'Criterion A: knowing and understanding',
      points: [
        'Read the command word first. Define = say exactly what it is. Describe = say what it is like. Explain = give the reason. Compare = say both sides.',
        'Use the science words: selectively permeable, cristae, cellulose, photosynthesis, respiration, animalcules.',
        'For "explain", link cause and effect: beta-cells destroyed → no insulin → injections.',
        'Add numbers when you know them: 1590, 1665, 1670; 10×, 50×, 200×; 10 × 40 = 400×.',
        'When you compare plant and animal cells, write both sides in every sentence: "Plant cells have…, but animal cells…".',
      ],
    },
  ],
  examMorning: {
    title: 'Before you go: the last things to remember',
    points: [
      'Glucose + oxygen → carbon dioxide + water + energy.',
      'Total magnification = eyepiece × objective (10 × 40 = 400×).',
      'Janssen 1590 (first compound microscope), Hooke 1665 (cork, "cells"), Leeuwenhoek 1670 ("animalcules").',
      'Plant only: cell wall, chloroplasts, large permanent vacuole.',
      'Nucleus = DNA and control. Mitochondria = respiration and energy. Membrane = selectively permeable (some things pass, not others).',
      'Three types of stem cell: embryonic, adult, artificially induced. Good luck! 🍀',
    ],
  },
};
