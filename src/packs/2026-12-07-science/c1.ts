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
    choice('c1-made-of', 'What do all living things have in common?', 'They are all made of cells',
      ['They all have a brain', 'They are all green', 'They can all move'],
      'Every living thing is made of cells. Cells are the tiny building blocks of life.'),
    choice('c1-diversity', 'A tree, a snake, E. coli bacteria, yeast and a human look very different. What do they share?',
      'The same basic building blocks: cells',
      ['The same body shape', 'The same food', 'The same size'],
      'They look very different. But every one of them is made of cells.'),
    pair('c1-ecoli', 'E. coli bacteria and yeast.', ['Made of cells', 'Not made of cells'], 'Made of cells',
      'E. coli bacteria and yeast are living things. So they are made of cells. One bacterium is one single cell.'),

    // Form meets function
    term('c1-ff-term', 'Form meets function',
      'Form is how a cell is built. Function is the job it does. The way a cell is built controls how it works. Cells have different shapes and sizes for different jobs.', [
        idea('Form is how the cell is built: its shape and structure', 'form', 'shape', 'built', 'structure', 'look'),
        idea('Function is the job it does, and the shape suits the job', 'function', 'job', 'works', 'role', 'does', 'task'),
      ]),
    choice('c1-ff-why', 'Why do skin, heart, muscle and blood cells all look different?',
      'Each has a different job, so each has a different shape',
      ['They come from different animals', 'They are different ages', 'Some of them are plant cells'],
      'Each cell has a different job. So each cell has a different shape. Form meets function.'),
    pair('c1-ff-1', 'The job a cell does.', FF, 'Function', 'Function means the job. It is what the cell does.'),
    pair('c1-ff-2', 'The shape and structure of a cell.', FF, 'Form', 'Form means the structure: how the cell is built, its shape and size.'),

    // A coordinated system
    choice('c1-coord', 'A cell is called a "coordinated system" (its parts work together). What does that mean?',
      'Its parts work together to give the cell energy, food and what it needs to live',
      ['It has only one part', 'It works alone and needs nothing', 'All its parts do the same job'],
      'The parts of a cell work together, like a team. Together they give the cell energy, food and what it needs to live.'),
    choice('c1-model', 'In the teacher\'s cardboard cell model, which part is the control centre that holds the instructions?', 'The nucleus',
      ['The outer boundary (membrane)', 'The cytoplasm', 'A small part near the edge'],
      'The nucleus is the control centre. It holds the instructions (DNA).'),
    choice('c1-specialised', 'What do specialised cells do?',
      'Each one does one special job to keep the organism alive',
      ['They can turn into any other kind of cell', 'They have no job yet', 'They only store water'],
      'A specialised cell has one special job. All the special jobs together keep the organism (living thing) alive.'),

    // Stem cells
    term('c1-stem-term', 'Stem cell',
      'A special cell that can divide (make copies of itself) and turn into many other cell types in the body. It is unspecialised: it has no job yet, like a "blank slate" (an empty page).', [
        idea('They can divide (make copies of themselves)', 'divid', 'replicate', 'copy', 'copies', 'multiply'),
        idea('They can turn into many other cell types', 'transform', 'turn into', 'become', 'differentiate', 'many', 'other cell', 'change into'),
        idea('They are unspecialised: no special job yet', 'unspecialised', 'unspecialized', 'blank', 'no job', 'not special', 'empty'),
      ]),
    choice('c1-stem-what', 'What is a stem cell?',
      'A cell with no job yet, which can divide and turn into many other cell types',
      ['A cell found only in plant stems', 'A cell that has already become a muscle cell', 'A dead cell'],
      'A stem cell has no job yet. It can divide and turn into many kinds of cell.'),
    pair('c1-ss-1', 'It can still become a nerve cell, a blood cell or a muscle cell.', SS, 'Stem cell',
      'A stem cell can still turn into many cell types. That is what makes it a stem cell.'),
    pair('c1-ss-2', 'A red blood cell carrying oxygen round the body.', SS, 'Specialised cell',
      'A red blood cell already has one special job. It is specialised. It is not a blank slate.'),

    // The three types
    choice('c1-types', 'Which list gives the three main types of stem cell?',
      'Embryonic, adult, artificially induced',
      ['Plant, animal, bacterial', 'Skin, blood, nerve', 'Big, medium, small'],
      'The three types are embryonic (from an embryo), adult (from the adult body) and artificially induced (made by scientists).'),
    match('c1-types-match', 'Match each type of stem cell to where it comes from.', [
      ['Embryonic stem cells', 'From an embryo'],
      ['Adult stem cells', 'Found in the adult body'],
      ['Artificially induced stem cells', 'Reprogrammed by scientists'],
    ], 'Embryonic: from an embryo. Adult: in the adult body. Artificially induced: reprogrammed (changed) by scientists.'),
    choice('c1-induced', 'Which type of stem cell is "reprogrammed by scientists"?',
      'Artificially induced stem cells',
      ['Embryonic stem cells', 'Adult stem cells', 'Red blood cells'],
      'Artificially induced stem cells are normal cells. Scientists reprogram (change) them into stem cells.'),

    // Cells in medicine
    match('c1-medicine-match', 'Match each way scientists use cells to what it does.', [
      ['Cancer treatments', 'Targeted drugs stop cancer cells multiplying'],
      ['Bacterial engineering', 'Changed bacteria make human insulin'],
      ['Tissue repair', 'Stem cells replace damaged spinal, heart or blood tissue'],
    ], 'Three uses: targeted cancer drugs, changed bacteria that make insulin, and stem cells that repair tissue.'),
    choice('c1-insulin', 'How do scientists make human insulin for people with diabetes?',
      'Changed (engineered) bacteria make it',
      ['Stem cells are injected into the pancreas', 'It is taken from plants', 'Targeted drugs make it'],
      'Scientists change bacteria so the bacteria make human insulin. People with diabetes need this insulin.'),
    choice('c1-repair', 'Which damaged tissues can stem cells be guided to replace?',
      'Spinal, heart or blood tissue',
      ['Hair and nails', 'Teeth only', 'None: stem cells cannot repair tissue'],
      'Stem cells can replace damaged spinal (back), heart or blood tissue in patients.'),
    choice('c1-cancer', 'What do targeted cancer drugs do?',
      'Stop cancer cells from multiplying (making more of themselves) fast',
      ['Turn cancer cells into stem cells', 'Make the body produce insulin', 'Magnify cells so doctors can see them'],
      'Targeted drugs stop cancer cells from multiplying fast. Multiplying means making more and more copies.'),

    // Ethics and regulation
    choice('c1-promise', 'What is the "very big promise" of stem cells?',
      'Curing diseases that had no cure, repairing organs and saving lives',
      ['Making microscopes cheaper', 'Making plants grow faster', 'Replacing all other medicines'],
      'The promise: stem cells could cure diseases that had no cure, repair organs and save lives.'),
    choice('c1-regulation', 'Why does new biotechnology, such as stem cell therapy, need careful regulation (rules)?',
      'It needs strict monitoring, safety checks and ethical guidelines',
      ['Because stem cells are dangerous animals', 'Because it is too cheap', 'Because nobody understands cells'],
      'New biotechnology needs strict monitoring (watching), safety checks and ethical guidelines (rules about right and wrong).'),
    pair('c1-pr-1', 'The ability to cure diseases that had no cure before.', PR, 'A promise',
      'Curing diseases that had no cure is one of the very big promises of stem cells.'),
    pair('c1-pr-2', 'Strict monitoring, safety checks and ethical guidelines.', PR, 'A reason for regulation',
      'This is what careful regulation means. New biotechnology must be checked and controlled.'),
  ], [
    ['c1-cells', /^c1-(made-of|diversity|ecoli)$/],
    ['c1-form-function', /^c1-ff-/],
    ['c1-system', /^c1-(coord|specialised|model)$/],
    ['c1-stem-cell', /^c1-(stem-|ss-)/],
    ['c1-stem-types', /^c1-(types|induced)/],
    ['c1-medicine', /^c1-(medicine|insulin|repair|cancer)/],
    ['c1-ethics', /^c1-(promise|regulation|pr-)/],
  ]),
};
