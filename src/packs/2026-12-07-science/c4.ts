// C4: Organelles. From the deck "A Cell is a System" (slides 6 to 12): the cell membrane, nucleus, nucleolus,
// cytoplasm, mitochondria, the three plant-only parts, and the teacher's table of organelles.
import { cell, choice, idea, pair, tableRow, term, withConcepts } from '../../content/build';
import type { Topic } from '../../content/types';

const FOUND: [string, string] = ['Plant and animal', 'Plant only'];
const ORG = 'Organelles';
const LOC = ['Outer surface', 'Inside the membrane', 'In the cytoplasm', 'Surrounds the membrane'];
const FUN = [
  'Controls substance movement in and out',
  'Contains organelles and chemical reactions',
  'Contains DNA; controls activities',
  'Site of cellular respiration and energy',
  'Tough structure supporting the cell',
  'Site of photosynthesis; converts sunlight',
  'Contains cell sap; keeps the cell firm',
];
const COLS = ['Found in', 'Location', 'Primary function'];
const row = (id: string, name: string, found: string, loc: string, fun: string) =>
  tableRow(id, ORG, name, COLS, [cell(found, FOUND), cell(loc, LOC), cell(fun, FUN)]);

export const c4: Topic = {
  id: 'C4',
  title: 'Organelles: the parts of a cell',
  short: 'Organelles',
  items: withConcepts([
    // Cell membrane
    term('c4-membrane-term', 'Cell membrane',
      'Surrounds the cell and controls what enters and leaves. It is selectively permeable: certain chemicals pass through easily while others are blocked.', [
        idea('Surrounds the cell', 'surround', 'outside', 'outer', 'around', 'boundary'),
        idea('Controls what enters and leaves', 'control', 'enters', 'leaves', 'in and out', 'goes in', 'passes'),
        idea('Selectively permeable: some things pass, others are blocked', 'selective', 'permeable', 'some', 'blocked', 'not others'),
      ]),
    choice('c4-membrane-perm', '"Selectively permeable" means…',
      'Some chemicals pass through easily while others are blocked',
      ['Nothing can pass through', 'Everything passes through', 'It is made of cellulose'],
      'Selective permeability: the membrane lets certain chemicals pass through easily while others are blocked.'),
    choice('c4-membrane-channels', 'What do the protein channels in the membrane do?',
      'Open or close to limit what moves into or out of the cytoplasm',
      ['Make proteins', 'Store DNA', 'Give the cell a rigid shape'],
      'Specialised protein channels embedded in the membrane open or close to limit molecular movement into or out of the cytoplasm.'),
    choice('c4-membrane-balance', 'How does the membrane maintain internal balance?',
      'By regulating traffic: it prevents toxins building up and keeps vital nutrients in',
      ['By making energy', 'By letting everything in', 'By photosynthesis'],
      'By regulating molecular traffic, the membrane prevents toxic accumulation while retaining vital cellular nutrients.'),

    // Nucleus
    term('c4-nucleus-term', 'Nucleus',
      'Contains genetic material (DNA) and directs all cell activities. Stained blue under microscope views.', [
        idea('Contains the genetic material, DNA', 'dna', 'genetic', 'instructions', 'genes'),
        idea('Directs (controls) all cell activities', 'direct', 'control', 'activities', 'in charge', 'boss', 'brain'),
      ]),
    choice('c4-nucleus-job', 'Which organelle contains DNA and directs all cell activities?', 'Nucleus',
      ['Mitochondria', 'Cytoplasm', 'Cell membrane'],
      'The nucleus contains the genetic material (DNA) and directs all cell activities.'),
    pair('c4-nucleus-stain', 'Which organelle is stained blue under the microscope?', ['Nucleus', 'Vacuole'], 'Nucleus',
      'The nucleus is stained blue under microscope views, so it is easy to see.'),

    // Nucleolus
    choice('c4-nucleolus-where', 'Where is the nucleolus?', 'Inside the nucleus',
      ['In the cell wall', 'Outside the cell', 'Inside a mitochondrion'],
      'The nucleolus is located inside the nucleus.'),
    choice('c4-nucleolus-job', 'What does the nucleolus manufacture?', 'Ribosomes, which make proteins',
      ['DNA', 'Insulin', 'Chlorophyll'],
      'The nucleolus manufactures ribosomes, the organelles responsible for making proteins.'),
    pair('c4-nucleolus-vs', 'Makes ribosomes.', ['Nucleolus', 'Nucleus'], 'Nucleolus',
      'The nucleolus, inside the nucleus, manufactures ribosomes. The nucleus itself holds DNA and directs the cell.'),

    // Cytoplasm
    term('c4-cytoplasm-term', 'Cytoplasm',
      'Jelly-like fluid suspending the organelles; contains dissolved chemicals for vital metabolic reactions.', [
        idea('A jelly-like fluid', 'jelly', 'fluid', 'liquid', 'gel'),
        idea('It holds (suspends) the organelles', 'organelles', 'suspend', 'holds', 'parts float'),
        idea('Chemical reactions happen in it', 'reaction', 'chemical', 'metabolic'),
      ]),
    choice('c4-cytoplasm-what', 'What is the cytoplasm?',
      'A jelly-like fluid holding the organelles, where chemical reactions happen',
      ['The tough outer layer', 'The control centre', 'A fluid-filled sac of cell sap'],
      'Cytoplasm is the jelly-like fluid suspending the organelles. It contains dissolved chemicals for metabolic reactions.'),

    // Mitochondria
    term('c4-mito-term', 'Mitochondria',
      'The site of cellular respiration: mitochondria generate cellular energy. Their inner membrane has deep folds (cristae), creating a vast surface area for chemical reactions.', [
        idea('Site of cellular respiration: they generate energy', 'respiration', 'energy', 'powerhouse'),
        idea('Inner membrane with deep folds called cristae', 'fold', 'cristae', 'inner membrane'),
        idea('The folds give a vast surface area for reactions', 'surface area', 'surface', 'more space', 'more room'),
      ]),
    choice('c4-mito-folds', 'Why does the inner membrane of a mitochondrion have deep folds (cristae)?',
      'To create a vast surface area for chemical reactions',
      ['To store DNA', 'To hold cell sap', 'To let light in'],
      'The deep folds (cristae) create a vast surface area for the chemical reactions of respiration.'),
    choice('c4-mito-liver', 'Why may a liver cell contain up to 100,000 mitochondria?',
      'The liver is highly active, so its cells need a lot of energy',
      ['It needs to photosynthesise', 'It has no nucleus', 'It stores a lot of water'],
      'Highly active tissues like the liver may contain up to 100,000 mitochondria per cell to meet immense energy demands.'),
    choice('c4-mito-which', 'Which organelle is called the "powerhouse of the cell"?', 'Mitochondria',
      ['Nucleus', 'Ribosomes', 'Vacuole'],
      'Mitochondria generate cellular energy through respiration, so they are called the powerhouse of the cell.'),

    // Cell wall
    term('c4-wall-term', 'Cell wall',
      'Tough outer cellulose layer surrounding the membrane; gives the cell a rigid shape.', [
        idea('A tough outer layer made of cellulose', 'cellulose', 'tough', 'outer', 'strong'),
        idea('It gives the cell a rigid shape', 'rigid', 'shape', 'stiff', 'support', 'firm'),
      ]),
    choice('c4-wall-made', 'What is the plant cell wall made of?', 'Cellulose',
      ['Chlorophyll', 'Cell sap', 'Protein channels'],
      'The cell wall is a tough outer cellulose layer surrounding the membrane.'),
    pair('c4-wall-where', 'The cell wall is…', ['Outside the membrane', 'Inside the nucleus'], 'Outside the membrane',
      'The cell wall surrounds the membrane: it is the outermost layer of a plant cell.'),

    // Chloroplasts
    term('c4-chloro-term', 'Chloroplasts',
      'Contain green chlorophyll; the site of photosynthesis, converting sunlight to glucose.', [
        idea('Contain green chlorophyll', 'chlorophyll', 'green'),
        idea('Site of photosynthesis: sunlight is converted to glucose', 'photosynthesis', 'sunlight', 'light', 'glucose', 'food'),
      ]),
    choice('c4-chloro-job', 'What happens in chloroplasts?', 'Photosynthesis: sunlight is converted to glucose',
      ['Respiration: glucose releases energy', 'Proteins are made', 'DNA is stored'],
      'Chloroplasts are the site of photosynthesis, converting sunlight to glucose.'),
    choice('c4-chloro-green', 'What makes chloroplasts green?', 'Chlorophyll',
      ['Cellulose', 'Cell sap', 'Cristae'],
      'Chloroplasts contain green chlorophyll.'),

    // Large permanent vacuole
    term('c4-vacuole-term', 'Large permanent vacuole',
      'A fluid-filled sac (cell sap) acting like an inflated balloon to keep the cell firm.', [
        idea('A fluid-filled sac containing cell sap', 'sap', 'fluid', 'sac', 'liquid', 'water'),
        idea('Keeps the cell firm, like an inflated balloon', 'firm', 'balloon', 'push', 'support', 'shape', 'rigid'),
      ]),
    choice('c4-vacuole-job', 'What does the large permanent vacuole do?',
      'Holds cell sap and keeps the cell firm, like an inflated balloon',
      ['Makes proteins', 'Controls the cell', 'Releases energy'],
      'The large permanent vacuole is a fluid-filled sac of cell sap, acting like an inflated balloon to keep the cell firm.'),
    pair('c4-vacuole-what', 'What is inside the large permanent vacuole?', ['Cell sap', 'Chlorophyll'], 'Cell sap',
      'The vacuole is a fluid-filled sac of cell sap.'),

    // Found in plant cells only, or in both
    pair('c4-fi-wall', 'Cell wall', FOUND, 'Plant only', 'The cell wall is a plant-exclusive feature.'),
    pair('c4-fi-chloro', 'Chloroplasts', FOUND, 'Plant only', 'Chloroplasts are plant-exclusive: animal cells do not photosynthesise.'),
    pair('c4-fi-vacuole', 'Large permanent vacuole', FOUND, 'Plant only', 'The large permanent vacuole is a plant-exclusive feature.'),
    pair('c4-fi-mito', 'Mitochondria', FOUND, 'Plant and animal', 'Both plant and animal cells respire, so both have mitochondria.'),
    pair('c4-fi-nucleus', 'Nucleus', FOUND, 'Plant and animal', 'Both plant and animal cells have a nucleus with DNA.'),
    pair('c4-fi-membrane', 'Cell membrane', FOUND, 'Plant and animal', 'Every cell has a membrane. Plant cells have a wall outside it as well.'),
    pair('c4-fi-cyto', 'Cytoplasm', FOUND, 'Plant and animal', 'Both plant and animal cells have cytoplasm inside the membrane.'),

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
