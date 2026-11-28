// C1: Cells and stem cells. From the deck "Cells: The Building Blocks of Life" (9 slides).
import { choice, idea, match, pair, term, withConcepts } from '../../content/build';
import type { Topic } from '../../content/types';

const FF: [string, string] = ['Form', 'Function'];
const SS: [string, string] = ['Stem cell', 'Specialised cell'];
const PR: [string, string] = ['A promise', 'A reason for regulation'];

export const c1: Topic = {
  id: 'C1',
  title: 'Cells and stem cells',
  short: 'Stem cells',
  items: withConcepts([
    // All living things are made of cells
    choice('c1-made-of', 'What do all living organisms have in common?', 'They are all made of cells',
      ['They all have a brain', 'They are all green', 'They can all move'],
      'Every single organism is composed of the same basic microscopic structures: cells.'),
    choice('c1-diversity', 'A eucalyptus tree, a snake, E. coli bacteria, yeast and a human look completely different. What do they share?',
      'The same basic building blocks: cells',
      ['The same body shape', 'The same food', 'The same size'],
      'The slide calls it the single universal truth: despite their differences, every organism is composed of cells.'),
    pair('c1-ecoli', 'E. coli bacteria and yeast.', ['Made of cells', 'Not made of cells'], 'Made of cells',
      'The slide lists E. coli bacteria and yeast among the living things made of cells. A bacterium is one single cell.'),

    // Form meets function
    term('c1-ff-term', 'Form meets function',
      'How a cell is built (its form) directly controls how it works (its function). Cells vary in shape and size depending on their job.', [
        idea('Form is how the cell is built: its shape and structure', 'form', 'shape', 'built', 'structure'),
        idea('Function is the job it does, and the shape suits the job', 'function', 'job', 'works', 'role', 'does'),
      ]),
    choice('c1-ff-why', 'Why do skin, heart, muscle and blood cells all look different?',
      'Each has a different job, so each has a different shape',
      ['They come from different animals', 'They are different ages', 'Some of them are plant cells'],
      'Cells vary dramatically in shape and size depending on their job. How a cell is built controls how it works.'),
    pair('c1-ff-1', 'The job a cell does.', FF, 'Function', 'Function is the job: the specific purpose of the cell.'),
    pair('c1-ff-2', 'The shape and structure of a cell.', FF, 'Form', 'Form is the structure: how the cell is built, its shape and size.'),

    // A coordinated system
    choice('c1-coord', 'The slide calls a cell a "coordinated system". What does that mean?',
      'Its parts work together to provide energy, nutrients and what the cell needs to survive',
      ['It has only one part', 'It works alone and needs nothing', 'All its parts do the same job'],
      'Different parts of a cell work together as a system to provide energy, nutrients and survival requirements.'),
    choice('c1-specialised', 'What do specialised cells do?',
      'They perform dedicated roles to keep the organism alive',
      ['They can turn into any other kind of cell', 'They have no job yet', 'They only store water'],
      'Specialised cells perform dedicated roles to keep the organism alive. Each one has its own job.'),

    // Stem cells
    term('c1-stem-term', 'Stem cell',
      'Special cells capable of dividing and transforming into many other specific cell types in the body. They are unspecialised "blank slates".', [
        idea('They can divide (replicate themselves)', 'divid', 'replicate', 'copy', 'multiply'),
        idea('They can transform into many other cell types', 'transform', 'turn into', 'become', 'differentiate', 'many', 'other cell'),
        idea('They are unspecialised: no special job yet', 'unspecialised', 'unspecialized', 'blank', 'no job', 'not special'),
      ]),
    choice('c1-stem-what', 'What is a stem cell?',
      'An unspecialised cell that can divide and turn into many other cell types',
      ['A cell found only in plant stems', 'A cell that has already become a muscle cell', 'A dead cell'],
      'Stem cells are unspecialised blank slates. They can divide and transform into many specific cell types.'),
    pair('c1-ss-1', 'It can still become a nerve cell, a blood cell or a muscle cell.', SS, 'Stem cell',
      'A stem cell can differentiate into many cell types. That is what makes it a stem cell.'),
    pair('c1-ss-2', 'A red blood cell carrying oxygen round the body.', SS, 'Specialised cell',
      'A red blood cell already has its dedicated role. It is specialised, not a blank slate.'),

    // The three types
    choice('c1-types', 'Which list gives the three main types of stem cell?',
      'Embryonic, adult, artificially induced',
      ['Plant, animal, bacterial', 'Skin, blood, nerve', 'Big, medium, small'],
      'The three main types are embryonic stem cells, adult stem cells and artificially induced stem cells.'),
    match('c1-types-match', 'Match each type of stem cell to where it comes from.', [
      ['Embryonic stem cells', 'From an embryo'],
      ['Adult stem cells', 'Found in the adult body'],
      ['Artificially induced stem cells', 'Reprogrammed by scientists'],
    ], 'Embryonic: from an embryo. Adult: in the adult body. Artificially induced: reprogrammed by scientists.'),
    choice('c1-induced', 'Which type of stem cell is "reprogrammed by scientists"?',
      'Artificially induced stem cells',
      ['Embryonic stem cells', 'Adult stem cells', 'Red blood cells'],
      'Artificially induced stem cells are ordinary cells that scientists reprogram into stem cells.'),

    // Cells in medicine
    match('c1-medicine-match', 'Match each way scientists use cells to what it does.', [
      ['Cancer treatments', 'Targeted drugs stop cancer cells multiplying'],
      ['Bacterial engineering', 'Engineered bacteria make human insulin'],
      ['Tissue repair', 'Stem cells replace damaged spinal, heart or blood tissue'],
    ], 'Three uses: targeted cancer drugs, engineered bacteria that make insulin, and stem cells that repair tissue.'),
    choice('c1-insulin', 'How do scientists make human insulin for people with diabetes?',
      'Engineered bacteria produce it',
      ['Stem cells are injected into the pancreas', 'It is taken from plants', 'Targeted drugs make it'],
      'Engineered bacteria produce essential therapeutic proteins like human insulin for diabetes.'),
    choice('c1-repair', 'Which damaged tissues can stem cells be guided to replace?',
      'Spinal, heart or blood tissue',
      ['Hair and nails', 'Teeth only', 'None: stem cells cannot repair tissue'],
      'Stem cells are guided to replace damaged spinal, heart or blood tissue in patients.'),
    choice('c1-cancer', 'What do targeted cancer drugs do?',
      'Stop specific cancer cells from multiplying rapidly',
      ['Turn cancer cells into stem cells', 'Make the body produce insulin', 'Magnify cells so doctors can see them'],
      'Targeted drugs are designed to stop specific cancer cells from multiplying rapidly.'),

    // Ethics and regulation
    choice('c1-promise', 'What is the "immense promise" of stem cells?',
      'Curing untreatable diseases, repairing organs and saving lives',
      ['Making microscopes cheaper', 'Making plants grow faster', 'Replacing all other medicines'],
      'The promise: the ability to cure previously untreatable diseases, repair organs and save human lives.'),
    choice('c1-regulation', 'Why does new biotechnology such as stem cell therapy need careful regulation?',
      'It needs strict monitoring, safety checks and ethical guidelines',
      ['Because stem cells are dangerous animals', 'Because it is too cheap', 'Because nobody understands cells'],
      'New biotechnology requires strict monitoring, safety checks and ethical guidelines.'),
    pair('c1-pr-1', 'The ability to cure previously untreatable diseases.', PR, 'A promise',
      'Curing untreatable diseases is one of the immense promises of stem cells.'),
    pair('c1-pr-2', 'Strict monitoring, safety checks and ethical guidelines.', PR, 'A reason for regulation',
      'These are what careful regulation means: new biotechnology must be checked and controlled.'),
  ], [
    ['c1-cells', /^c1-(made-of|diversity|ecoli)$/],
    ['c1-form-function', /^c1-ff-/],
    ['c1-system', /^c1-(coord|specialised)$/],
    ['c1-stem-cell', /^c1-(stem-|ss-)/],
    ['c1-stem-types', /^c1-(types|induced)/],
    ['c1-medicine', /^c1-(medicine|insulin|repair|cancer)/],
    ['c1-ethics', /^c1-(promise|regulation|pr-)/],
  ]),
};
