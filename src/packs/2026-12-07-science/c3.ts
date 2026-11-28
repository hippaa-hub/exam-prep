// C3: A cell is a system. From the deck "A Cell is a System" (slides 2 to 5): what a system is,
// pancreatic beta-cells and insulin, Type 1 diabetes, cellular respiration and what cells need.
import { choice, idea, match, pair, term, withConcepts } from '../../content/build';
import type { Topic } from '../../content/types';

const IO: [string, string] = ['Taken in', 'Waste out'];

export const c3: Topic = {
  id: 'C3',
  title: 'A cell is a system',
  short: 'Cell as a system',
  items: withConcepts([
    // A biological system
    term('c3-system-term', 'System',
      'A group of interdependent (they need each other) components (parts). They work together to do one unified (shared) function (job).', [
        idea('A group of components (parts)', 'group', 'parts', 'components', 'organelles', 'pieces'),
        idea('Interdependent: they need each other', 'interdependent', 'depend', 'each other', 'need each other', 'rely'),
        idea('Working together for one unified function (job)', 'together', 'unified', 'one function', 'one job', 'purpose', 'same goal', 'shared', 'same job'),
      ]),
    choice('c3-system-cell', 'Why is a cell a system?',
      'Each organelle has its own task, and together they keep the cell alive',
      ['Because it is very small', 'Because it has a nucleus', 'Because it is round'],
      'Each organelle (cell part) has its own task. The parts need each other and work together. That is a system.'),
    pair('c3-interdep', '"Interdependent" means…', ['The parts depend on each other', 'Each part works alone'], 'The parts depend on each other',
      'Interdependent parts need each other. That is why a cell is a system, not a pile of separate parts.'),

    // Pancreatic beta-cells
    choice('c3-beta-what', 'What is the special job of pancreatic beta-cells?', 'Producing insulin',
      ['Producing glucose', 'Carrying oxygen', 'Making chlorophyll'],
      'Pancreatic beta-cells make insulin. That is their one special job.'),
    choice('c3-beta-raw', 'Which building blocks must beta-cells absorb (take in) to make insulin?',
      'Amino acids, to build protein chains', ['Oxygen only', 'Cellulose', 'Cell sap'],
      'Insulin is a protein. To make it, beta-cells take in amino acids and join them into protein chains.'),
    choice('c3-beta-alone', '"No single cell acts alone." What does this mean?',
      'Different specialised cells work together to give the whole body what it needs',
      ['Every cell does every job', 'Cells never touch each other', 'Only beta-cells matter'],
      'Many different specialised cells work together. Together they give the whole body what it needs.'),
    pair('c3-pancreas', 'Where are the beta-cells that make insulin?', ['In the pancreas', 'In the liver'], 'In the pancreas',
      'Beta-cells sit in small groups (islets) inside the pancreas.'),

    // Type 1 diabetes
    choice('c3-t1-what', 'What happens in Type 1 diabetes?',
      'Beta-cells are destroyed and cannot produce insulin',
      ['The body makes too much insulin', 'The liver stops making glucose', 'The nucleus is destroyed'],
      'A disease happens when some cells stop working. In Type 1 diabetes the beta-cells are destroyed. So they cannot make insulin.'),
    choice('c3-t1-therapy', 'What is the usual treatment for Type 1 diabetes?',
      'Daily insulin injections to replace the missing hormone',
      ['Daily glucose injections', 'Eating more sugar', 'Removing the pancreas'],
      'Doctors give daily insulin injections. They replenish (put back) the missing hormone and regulate (control) blood glucose.'),
    choice('c3-t1-future', 'What are researchers working on for the future of diabetes treatment?',
      'Ways to reprogram other body cells to manufacture (make) insulin',
      ['Bigger insulin injections', 'A new kind of microscope', 'A way to live without insulin'],
      'Researchers want to reprogram (change) other body cells so they make insulin. Then the daily injections could end.'),
    choice('c3-t1-why', 'Why do the insulin injections help a person with Type 1 diabetes?',
      'They put back the missing hormone and regulate (control) blood glucose',
      ['They repair the destroyed beta-cells', 'They feed the cells with glucose', 'They kill bacteria'],
      'The body cannot make insulin any more. The injections put it back. Then the blood glucose stays under control.'),

    // Cellular respiration
    choice('c3-resp-eq', 'Which is the word equation for cellular respiration?',
      'Glucose + oxygen → carbon dioxide + water + energy',
      ['Carbon dioxide + water → glucose + oxygen', 'Glucose + water → oxygen + energy', 'Oxygen + energy → glucose + carbon dioxide'],
      'Glucose + oxygen → carbon dioxide + water + energy. What goes in is on the left. What comes out is on the right.'),
    choice('c3-resp-in', 'What goes INTO cellular respiration?', 'Glucose and oxygen',
      ['Carbon dioxide and water', 'Water and energy', 'Insulin and amino acids'],
      'Cells must always take in glucose (food fuel) and oxygen. These two things go in.'),
    choice('c3-resp-out', 'What comes OUT of cellular respiration?', 'Carbon dioxide, water and energy',
      ['Glucose and oxygen', 'Only energy', 'Insulin'],
      'Respiration gives carbon dioxide, water and energy. Carbon dioxide is waste. The cell must expel it (push it out).'),
    pair('c3-resp-where', 'Where does cellular respiration happen?', ['Mitochondria', 'Nucleus'], 'Mitochondria',
      'Cellular respiration happens in the mitochondria. They make the cell\'s energy.'),

    // What cells need
    choice('c3-needs-intake', 'What must cells always absorb (take in)?', 'Glucose (food fuel) and oxygen',
      ['Carbon dioxide', 'Cell sap', 'Chlorophyll'],
      'Cells must always take in glucose and oxygen.'),
    choice('c3-needs-waste', 'Which waste product must cells expel (push out)?', 'Carbon dioxide',
      ['Glucose', 'Oxygen', 'Minerals'],
      'Cells must push out waste. Carbon dioxide is the waste from respiration.'),
    match('c3-needs-match', 'Match each substance to why the cell needs it, or why it must leave.', [
      ['Water', 'Needed as a solvent (to dissolve things)'],
      ['Fats', 'Needed for membranes'],
      ['Glucose', 'Food fuel'],
      ['Carbon dioxide', 'Waste to expel (push out)'],
    ], 'Water dissolves things. Fats build membranes. Glucose is fuel. Carbon dioxide is waste.'),
    pair('c3-io-1', 'Oxygen', IO, 'Taken in', 'Oxygen is taken in for respiration, together with glucose.'),
    pair('c3-io-2', 'Carbon dioxide', IO, 'Waste out', 'Carbon dioxide is a waste product. Cells must expel it (push it out).'),
    pair('c3-io-3', 'Minerals', IO, 'Taken in', 'Cells need minerals. They also need water as a solvent and fats for membranes.'),
  ], [
    ['c3-system', /^c3-(system-|interdep)/],
    ['c3-beta-cells', /^c3-(beta-|pancreas)/],
    ['c3-diabetes', /^c3-t1-/],
    ['c3-respiration', /^c3-resp-/],
    ['c3-needs', /^c3-(needs-|io-)/],
  ]),
};
