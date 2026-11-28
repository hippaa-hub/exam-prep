// C2: How do we see cells? From the deck "How Do We See Cells?" (6 slides): the history of the microscope,
// the parts of a compound light microscope, and plant vs animal cells under the microscope.
import { cell, choice, match, order, pair, tableRow, withConcepts } from '../../content/build';
import type { Topic } from '../../content/types';

const PA: [string, string] = ['Plant cell', 'Animal cell'];
const HL: [string, string] = ['Hooke', 'Leeuwenhoek'];
const MAGS = ['Up to 10×', 'About 50×', 'Up to 200×', 'About 400×'];
const notMag = (right: string) => MAGS.filter((m) => m !== right);

const JOBS = [
  'Makes the image bigger, usually 10×',
  'Holds the objective lenses',
  'Main magnification: 4×, 10×, 40×',
  'Flat platform that holds the slide',
  'Focus: fast or very careful',
  'Controls how bright the light is',
];
const PARTS = 'Microscope parts';
const PVA = 'Plant vs animal cells';
const SHAPES = ['Box-like, rigid (stiff)', 'Rounded, irregular, flexible'];
const OUTER = ['Thick cell wall', 'Flexible cell membrane only'];
const COLOUR = ['Green chloroplasts', 'Stained blue or pink'];

export const c2: Topic = {
  id: 'C2',
  title: 'How we see cells: microscopes',
  short: 'Microscopes',
  items: withConcepts([
    // Ancient magnifiers
    choice('c2-ancient', 'Before microscopes, how did people make small things look bigger?',
      'Curved glass, drops of water and clear pebbles worked as single lenses',
      ['Mirrors and candles', 'Telescopes', 'They could not'],
      'A piece of curved glass, a drop of water or a clear pebble worked as one simple lens. It made small things look bigger.'),
    pair('c2-single', 'A drop of water used to make a small object look bigger.', ['Single lens', 'Compound microscope'], 'Single lens',
      'A water drop is one simple lens. A compound microscope has several lenses in a tube.'),

    // Janssen, 1590
    choice('c2-janssen-who', 'Who made the first compound microscope (a microscope with several lenses), in 1590?', 'Zacharias and Hans Janssen',
      ['Robert Hooke', 'Antonie van Leeuwenhoek'],
      'In 1590 Zacharias and Hans Janssen put several lenses in a sliding tube. This was the first compound microscope.'),
    choice('c2-janssen-how', 'How did the Janssens make their microscope?',
      'They put several lenses inside a sliding tube',
      ['They used one drop of water', 'They used a mirror and an oil lamp', 'They polished one tiny lens'],
      'They stacked several lenses inside a sliding tube. Several lenses together make a compound microscope.'),
    choice('c2-janssen-mag', "How much did the Janssens' microscope magnify (make things bigger)?", 'Up to 10×', notMag('Up to 10×'),
      'The first compound microscope made things look up to 10 times bigger.'),

    // Hooke, 1665
    choice('c2-hooke-what', 'What did Robert Hooke look at in 1665?', 'A thin slice of cork',
      ['A drop of pond water', 'Blood cells', 'A whole leaf'],
      'Hooke looked at a very thin slice of cork (tree bark). He saw tiny, empty, box-like rooms.'),
    choice('c2-hooke-why', 'Why did Hooke call the little boxes "cells"?',
      'They reminded him of cellae, the small rooms where monks lived',
      ['They looked like phone cells', 'He named them after himself', 'The word means "tiny animals"'],
      'The little boxes looked like cellae. Cellae were the small rooms where monks lived and prayed.'),
    choice('c2-hooke-mag', "About how much did Hooke's magnifier magnify?", 'About 50×', notMag('About 50×'),
      'Hooke built a 50× magnifier. He lit it with an oil lamp and a round glass lens.'),
    choice('c2-hooke-lamp', 'How did Hooke light up the cork he looked at?', 'With an oil lamp and a globe lens',
      ['With the sun only', 'With an electric light bulb', 'He did not use any light'],
      'Hooke\'s 50× magnifier lit up the specimen with an oil lamp and a globe lens.'),
    pair('c2-hl-1', 'Saw tiny, empty, box-like rooms in cork.', HL, 'Hooke',
      'Hooke looked at cork in 1665. He saw the empty boxes and named them cells.'),
    pair('c2-hl-2', 'First to see living bacteria swimming in pond water.', HL, 'Leeuwenhoek',
      'Leeuwenhoek built lenses up to 200×. He saw tiny living things in water drops.'),

    // Leeuwenhoek, 1670
    choice('c2-leeu-first', 'Who was the first person to see living bacteria, yeast and blood cells?',
      'Antonie van Leeuwenhoek', ['Robert Hooke', 'Zacharias Janssen'],
      'Around 1670 Leeuwenhoek built very exact lenses up to 200×. He saw living bacteria, yeast and blood cells.'),
    choice('c2-leeu-name', 'What did Leeuwenhoek call the swimming single cells he saw in water drops?',
      '"Animalcules" (tiny animals)', ['"Cellae"', '"Cells"', '"Microscopes"'],
      'He was very surprised to see tiny swimming life. He called the living single cells "animalcules": tiny animals.'),
    choice('c2-leeu-mag', "How strong were Leeuwenhoek's lenses?", 'Up to 200×', notMag('Up to 200×'),
      'Leeuwenhoek built very exact lenses. They made things look up to 200 times bigger.'),
    order('c2-timeline', 'Put the history of seeing cells in order, oldest first.', [
      'Ancient magnifiers: curved glass and water drops',
      'The Janssens build the first compound microscope (1590)',
      'Robert Hooke names "cells" (1665)',
      'Leeuwenhoek sees living "animalcules" (1670)',
    ], 'First ancient lenses. Then Janssen 1590, Hooke 1665, Leeuwenhoek 1670.'),

    // Parts of the compound light microscope
    match('c2-parts-1', 'Match each part of the microscope to what it does.', [
      ['Ocular lens (eyepiece)', 'Makes the image bigger, usually 10×'],
      ['Revolving nosepiece', 'Holds the objective lenses'],
      ['Objective lenses', 'Main magnification: 4×, 10×, 40×'],
      ['Stage and stage clips', 'Flat platform that holds the slide'],
    ], 'Eyepiece 10×. The nosepiece holds the objectives. Objectives 4×, 10×, 40×. The stage holds the slide.'),
    match('c2-parts-2', 'Match each part of the microscope to what it does.', [
      ['Coarse knob', 'Focuses the image fast'],
      ['Fine knob', 'Focuses very carefully'],
      ['Light source and diaphragm', 'Controls how bright the light is'],
      ['Eyepiece', 'The lens you look through'],
    ], 'Coarse knob: fast focus. Fine knob: careful focus. Light and diaphragm: how bright.'),
    choice('c2-nosepiece', 'Which part do you turn to change from the 4× objective lens to the 40×?',
      'The revolving nosepiece', ['The eyepiece', 'The diaphragm', 'The stage clips'],
      'The revolving (turning) nosepiece holds the objective lenses. You turn it to change the lens over the slide.'),
    choice('c2-diaphragm', 'What do the light source and the diaphragm control?',
      'How bright the light is', ['The magnification', 'The focus', 'How the slide is held'],
      'The light source and the diaphragm control how bright the light is.'),
    tableRow('c2-tbl-eyepiece', PARTS, 'Ocular lens (eyepiece)', ['What it does'], [cell(JOBS[0], JOBS)]),
    tableRow('c2-tbl-nosepiece', PARTS, 'Revolving nosepiece', ['What it does'], [cell(JOBS[1], JOBS)]),
    tableRow('c2-tbl-objective', PARTS, 'Objective lenses', ['What it does'], [cell(JOBS[2], JOBS)]),
    tableRow('c2-tbl-stage', PARTS, 'Stage and stage clips', ['What it does'], [cell(JOBS[3], JOBS)]),
    tableRow('c2-tbl-knobs', PARTS, 'Coarse and fine knobs', ['What it does'], [cell(JOBS[4], JOBS)]),
    tableRow('c2-tbl-light', PARTS, 'Light source and diaphragm', ['What it does'], [cell(JOBS[5], JOBS)]),

    // Total magnification
    choice('c2-formula', 'How do you work out the total magnification of a compound microscope?',
      'Eyepiece × objective', ['Eyepiece + objective', 'Objective − eyepiece', 'Eyepiece ÷ objective'],
      'Total magnification = eyepiece × objective. For example 10 × 40 = 400×.'),
    choice('c2-total-40', 'The eyepiece is 10× and the objective lens is 40×. What is the total magnification?',
      '400×', ['50×', '4×', '30×'], '10 × 40 = 400. The total magnification is 400×.'),
    choice('c2-total-4', 'The eyepiece is 10× and the objective lens is 4×. What is the total magnification?',
      '40×', ['14×', '400×', '6×'], '10 × 4 = 40. The total magnification is 40×.'),
    choice('c2-biggest', 'The eyepiece is 10×. Which objective lens makes the cells look biggest?',
      '40×', ['4×', '10×'], '10 × 40 = 400×. That is the biggest total. 10 × 4 = 40× is the smallest.'),

    // Plant vs animal under the microscope
    pair('c2-pa-1', 'Box-like cells in a neat grid (rows).', PA, 'Plant cell', 'Plant cells have a rigid (stiff), box-like shape.'),
    pair('c2-pa-2', 'Rounded, irregular (not regular) or mixed shapes.', PA, 'Animal cell', 'Animal cells have a flexible shape: rounded, irregular or mixed.'),
    pair('c2-pa-3', 'Thick cell wall you can see under the microscope.', PA, 'Plant cell', 'The thick cell wall is the outer layer of a plant cell.'),
    pair('c2-pa-4', 'Usually stained (coloured) blue or pink to see the nucleus.', PA, 'Animal cell', 'Animal cells are usually stained blue or pink. Then the nucleus is easy to see.'),
    pair('c2-pa-5', 'Has green chloroplast organelles (cell parts).', PA, 'Plant cell', 'Only plant cells have green chloroplasts.'),
    pair('c2-pa-6', 'Flexible cell membrane and no cell wall.', PA, 'Animal cell', 'An animal cell has only a flexible membrane on the outside. It has no cell wall.'),
    tableRow('c2-tbl-plant', PVA, 'Plant cells', ['Shape', 'Outer layer', 'Colour or staining'],
      [cell(SHAPES[0], SHAPES), cell(OUTER[0], OUTER), cell(COLOUR[0], COLOUR)]),
    tableRow('c2-tbl-animal', PVA, 'Animal cells', ['Shape', 'Outer layer', 'Colour or staining'],
      [cell(SHAPES[1], SHAPES), cell(OUTER[1], OUTER), cell(COLOUR[1], COLOUR)]),
  ], [
    ['c2-ancient', /^c2-(ancient|single)$/],
    ['c2-janssen', /^c2-janssen-/],
    ['c2-hooke', /^c2-(hooke-|hl-)/],
    ['c2-leeuwenhoek', /^c2-(leeu-|timeline)/],
    ['c2-parts', /^c2-(parts-|nosepiece|diaphragm|tbl-(eyepiece|nosepiece|objective|stage|knobs|light))/],
    ['c2-magnification', /^c2-(formula|total-|biggest)/],
    ['c2-plant-animal', /^c2-(pa-|tbl-(plant|animal))/],
  ]),
};
