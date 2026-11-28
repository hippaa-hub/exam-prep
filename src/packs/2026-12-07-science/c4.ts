// C4: Organelles. From the deck "A Cell is a System" (slides 6 to 12): the cell membrane, nucleus, nucleolus,
// cytoplasm, mitochondria, the three plant-only parts, and the teacher's table of organelles.
import { cell, choice, idea, pair, tableRow, term, withConcepts } from '../../content/build';
import type { Topic } from '../../content/types';

const FOUND: [string, string] = ['Plant and animal', 'Plant only'];
const ORG = 'Organelles';
const LOC = ['Outer surface', 'Inside the membrane', 'In the cytoplasm', 'Surrounds the membrane'];
const FUN = [
  'Controls what moves in and out',
  'Holds organelles; chemical reactions happen here',
  'Holds DNA; controls the cell',
  'Site of cellular respiration; makes energy',
  'Tough layer that supports the cell',
  'Site of photosynthesis; uses sunlight',
  'Holds cell sap; keeps the cell firm',
];
const COLS = ['Found in', 'Location', 'Main job'];
const row = (id: string, name: string, found: string, loc: string, fun: string) =>
  tableRow(id, ORG, name, COLS, [cell(found, FOUND), cell(loc, LOC), cell(fun, FUN)]);

export const c4: Topic = {
  id: 'C4',
  title: 'Organelles: the parts of a cell',
  short: 'Organelles',
  items: withConcepts([
    // Cell membrane
    term('c4-membrane-term', 'Cell membrane',
      'The thin layer around the cell. It controls what enters and leaves. It is selectively permeable (it lets some things through, not others): some chemicals pass through easily, others are blocked.', [
        idea('Surrounds the cell', 'surround', 'outside', 'outer', 'around', 'boundary', 'edge'),
        idea('Controls what enters and leaves', 'control', 'enters', 'leaves', 'in and out', 'goes in', 'passes', 'comes in', 'goes out'),
        idea('Selectively permeable: some things pass, others are blocked', 'selective', 'permeable', 'some', 'blocked', 'not others', 'not all'),
      ]),
    choice('c4-membrane-perm', '"Selectively permeable" means…',
      'Some chemicals pass through easily while others are blocked',
      ['Nothing can pass through', 'Everything passes through', 'It is made of cellulose'],
      'Selectively permeable: the membrane lets some chemicals pass through easily. Other chemicals are blocked.'),
    choice('c4-membrane-channels', 'What do the protein channels in the membrane do?',
      'Open or close to limit what moves into or out of the cytoplasm',
      ['Make proteins', 'Store DNA', 'Give the cell a rigid shape'],
      'Protein channels are small doors in the membrane. They open or close. This limits what goes into or out of the cytoplasm.'),
    choice('c4-membrane-balance', 'How does the membrane keep the inside of the cell balanced?',
      'It controls the traffic: it stops toxins building up and keeps useful nutrients in',
      ['By making energy', 'By letting everything in', 'By photosynthesis'],
      'The membrane regulates (controls) the traffic. It stops a build-up of toxins (poisons). It keeps the useful nutrients inside.'),

    // Nucleus
    term('c4-nucleus-term', 'Nucleus',
      'Holds the genetic material (DNA, the instructions for the cell). It directs (controls) all cell activities. Under the microscope it is stained blue.', [
        idea('Contains the genetic material, DNA', 'dna', 'genetic', 'instructions', 'genes'),
        idea('Directs (controls) all cell activities', 'direct', 'control', 'activities', 'in charge', 'boss', 'brain', 'tells'),
      ]),
    choice('c4-nucleus-job', 'Which organelle holds the DNA and controls all cell activities?', 'Nucleus',
      ['Mitochondria', 'Cytoplasm', 'Cell membrane'],
      'The nucleus holds the genetic material (DNA). It directs (controls) everything the cell does.'),
    pair('c4-nucleus-stain', 'Which organelle is stained blue under the microscope?', ['Nucleus', 'Vacuole'], 'Nucleus',
      'The nucleus is stained blue under the microscope. So it is easy to see.'),

    // Nucleolus
    choice('c4-nucleolus-where', 'Where is the nucleolus?', 'Inside the nucleus',
      ['In the cell wall', 'Outside the cell', 'Inside a mitochondrion'],
      'The nucleolus is a small part inside the nucleus.'),
    choice('c4-nucleolus-job', 'What does the nucleolus manufacture (make)?', 'Ribosomes, which make proteins',
      ['DNA', 'Insulin', 'Chlorophyll'],
      'The nucleolus makes ribosomes. Ribosomes are the tiny organelles that make proteins.'),
    pair('c4-nucleolus-vs', 'Makes ribosomes.', ['Nucleolus', 'Nucleus'], 'Nucleolus',
      'The nucleolus is inside the nucleus. It makes ribosomes. The nucleus itself holds the DNA and controls the cell.'),

    // Cytoplasm
    term('c4-cytoplasm-term', 'Cytoplasm',
      'A jelly-like fluid (liquid). It holds the organelles. It has dissolved chemicals for the cell\'s chemical reactions.', [
        idea('A jelly-like fluid', 'jelly', 'fluid', 'liquid', 'gel'),
        idea('It holds (suspends) the organelles', 'organelles', 'suspend', 'holds', 'parts float', 'float', 'inside'),
        idea('Chemical reactions happen in it', 'reaction', 'chemical', 'metabolic', 'changes'),
      ]),
    choice('c4-cytoplasm-what', 'What is the cytoplasm?',
      'A jelly-like fluid that holds the organelles, where chemical reactions happen',
      ['The tough outer layer', 'The control centre', 'A fluid-filled sac of cell sap'],
      'Cytoplasm is a jelly-like fluid. The organelles float in it. It has dissolved chemicals for the cell\'s reactions.'),

    // Mitochondria
    term('c4-mito-term', 'Mitochondria',
      'The site (place) of cellular respiration: mitochondria make the cell\'s energy. Their inner membrane has deep folds called cristae. The folds give a very big surface area for chemical reactions.', [
        idea('Site of cellular respiration: they make energy', 'respiration', 'energy', 'powerhouse', 'power'),
        idea('Inner membrane with deep folds called cristae', 'fold', 'cristae', 'inner membrane'),
        idea('The folds give a very big surface area for reactions', 'surface area', 'surface', 'more space', 'more room', 'bigger area'),
      ]),
    choice('c4-mito-folds', 'Why does the inner membrane of a mitochondrion have deep folds (cristae)?',
      'To make a very big surface area for chemical reactions',
      ['To store DNA', 'To hold cell sap', 'To let light in'],
      'The deep folds (cristae) give a very big surface area. More surface means more room for the reactions of respiration.'),
    choice('c4-mito-liver', 'Why can a liver cell have up to 100,000 mitochondria?',
      'The liver is very active, so its cells need a lot of energy',
      ['It needs to photosynthesise', 'It has no nucleus', 'It stores a lot of water'],
      'The liver works very hard. Its cells need a lot of energy. So one liver cell can have up to 100,000 mitochondria.'),
    choice('c4-mito-which', 'Which organelle is called the "powerhouse of the cell"?', 'Mitochondria',
      ['Nucleus', 'Ribosomes', 'Vacuole'],
      'Mitochondria make the cell\'s energy by respiration. That is why they are called the powerhouse of the cell.'),

    // Cell wall
    term('c4-wall-term', 'Cell wall',
      'A tough outer layer made of cellulose. It surrounds the membrane. It gives the cell a rigid (stiff) shape.', [
        idea('A tough outer layer made of cellulose', 'cellulose', 'tough', 'outer', 'strong', 'hard'),
        idea('It gives the cell a rigid (stiff) shape', 'rigid', 'shape', 'stiff', 'support', 'firm', 'box'),
      ]),
    choice('c4-wall-made', 'What is the plant cell wall made of?', 'Cellulose',
      ['Chlorophyll', 'Cell sap', 'Protein channels'],
      'The cell wall is a tough outer layer. It is made of cellulose. It surrounds the membrane.'),
    pair('c4-wall-where', 'The cell wall is…', ['Outside the membrane', 'Inside the nucleus'], 'Outside the membrane',
      'The cell wall surrounds the membrane. It is the outside layer of a plant cell.'),

    // Chloroplasts
    term('c4-chloro-term', 'Chloroplasts',
      'They contain green chlorophyll. They are the site (place) of photosynthesis: sunlight is turned into glucose (sugar).', [
        idea('Contain green chlorophyll', 'chlorophyll', 'green'),
        idea('Site of photosynthesis: sunlight is turned into glucose', 'photosynthesis', 'sunlight', 'light', 'glucose', 'food', 'sugar'),
      ]),
    choice('c4-chloro-job', 'What happens in chloroplasts?', 'Photosynthesis: sunlight is turned into glucose',
      ['Respiration: glucose releases energy', 'Proteins are made', 'DNA is stored'],
      'Chloroplasts are the place of photosynthesis. They use sunlight to make glucose.'),
    choice('c4-chloro-green', 'What makes chloroplasts green?', 'Chlorophyll',
      ['Cellulose', 'Cell sap', 'Cristae'],
      'Chloroplasts are green because they contain chlorophyll.'),

    // Large permanent vacuole
    term('c4-vacuole-term', 'Large permanent vacuole',
      'A sac (bag) filled with fluid called cell sap. It works like a blown-up balloon and keeps the cell firm.', [
        idea('A fluid-filled sac containing cell sap', 'sap', 'fluid', 'sac', 'liquid', 'water', 'bag'),
        idea('Keeps the cell firm, like a blown-up balloon', 'firm', 'balloon', 'push', 'support', 'shape', 'rigid', 'stiff'),
      ]),
    choice('c4-vacuole-job', 'What does the large permanent vacuole do?',
      'Holds cell sap and keeps the cell firm, like a blown-up balloon',
      ['Makes proteins', 'Controls the cell', 'Releases energy'],
      'The large permanent vacuole is a sac full of cell sap. Like a blown-up balloon, it pushes out and keeps the cell firm.'),
    pair('c4-vacuole-what', 'What is inside the large permanent vacuole?', ['Cell sap', 'Chlorophyll'], 'Cell sap',
      'The vacuole is a sac filled with fluid called cell sap.'),

    // Found in plant cells only, or in both
    pair('c4-fi-wall', 'Cell wall', FOUND, 'Plant only', 'Only plant cells have a cell wall.'),
    pair('c4-fi-chloro', 'Chloroplasts', FOUND, 'Plant only', 'Only plant cells have chloroplasts. Animal cells do not do photosynthesis.'),
    pair('c4-fi-vacuole', 'Large permanent vacuole', FOUND, 'Plant only', 'Only plant cells have a large permanent vacuole.'),
    pair('c4-fi-mito', 'Mitochondria', FOUND, 'Plant and animal', 'Plant and animal cells both respire. So both have mitochondria.'),
    pair('c4-fi-nucleus', 'Nucleus', FOUND, 'Plant and animal', 'Plant and animal cells both have a nucleus with DNA.'),
    pair('c4-fi-membrane', 'Cell membrane', FOUND, 'Plant and animal', 'Every cell has a membrane. Plant cells also have a wall outside it.'),
    pair('c4-fi-cyto', 'Cytoplasm', FOUND, 'Plant and animal', 'Plant and animal cells both have cytoplasm inside the membrane.'),

    // The teacher's table: Organelles of plant and animal cells
    row('c4-tbl-membrane', 'Cell membrane', 'Plant and animal', 'Outer surface', FUN[0]),
    row('c4-tbl-cytoplasm', 'Cytoplasm', 'Plant and animal', 'Inside the membrane', FUN[1]),
    row('c4-tbl-nucleus', 'Nucleus', 'Plant and animal', 'In the cytoplasm', FUN[2]),
    row('c4-tbl-mito', 'Mitochondria', 'Plant and animal', 'In the cytoplasm', FUN[3]),
    row('c4-tbl-wall', 'Cell wall', 'Plant only', 'Surrounds the membrane', FUN[4]),
    row('c4-tbl-chloro', 'Chloroplast', 'Plant only', 'In the cytoplasm', FUN[5]),
    row('c4-tbl-vacuole', 'Vacuole (large, permanent)', 'Plant only', 'In the cytoplasm', FUN[6]),
  ], [
    ['c4-membrane', /^c4-membrane-/],
    ['c4-nucleus', /^c4-nucleus-/],
    ['c4-nucleolus', /^c4-nucleolus-/],
    ['c4-cytoplasm', /^c4-cytoplasm-/],
    ['c4-mitochondria', /^c4-mito-/],
    ['c4-wall', /^c4-wall-/],
    ['c4-chloroplast', /^c4-chloro-/],
    ['c4-vacuole', /^c4-vacuole-/],
    ['c4-found-in', /^c4-fi-/],
    ['c4-table', /^c4-tbl-/],
  ]),
};
