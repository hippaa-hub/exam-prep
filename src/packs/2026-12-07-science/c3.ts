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
      'A group of interdependent components working together to achieve a unified function.', [
        idea('A group of components (parts)', 'group', 'parts', 'components', 'organelles'),
        idea('Interdependent: they depend on each other', 'interdependent', 'depend', 'each other', 'need each other'),
        idea('Working together for one unified function', 'together', 'unified', 'one function', 'one job', 'purpose', 'same goal'),
      ]),
    choice('c3-system-cell', 'Why is a cell a system?',
      'Each organelle has a specific task, and together they keep the cell alive',
      ['Because it is very small', 'Because it has a nucleus', 'Because it is round'],
      'Each organelle has a specific assignment essential for survival. The parts are interdependent and work together.'),
    pair('c3-interdep', '"Interdependent" means…', ['The parts depend on each other', 'Each part works alone'], 'The parts depend on each other',
      'Interdependent parts need each other. That is why a cell is a system, not a pile of separate parts.'),

    // Pancreatic beta-cells
    choice('c3-beta-what', 'What do pancreatic beta-cells specialise in?', 'Producing insulin',
      ['Producing glucose', 'Carrying oxygen', 'Making chlorophyll'],
      'Pancreatic beta-cells specialise in producing insulin. It is their dedicated role.'),
    choice('c3-beta-raw', 'Which raw building blocks must beta-cells absorb to make insulin?',
      'Amino acids, to construct protein chains', ['Oxygen only', 'Cellulose', 'Cell sap'],
      'To produce insulin, beta-cells absorb amino acids and build them into protein chains. Insulin is a protein.'),
    choice('c3-beta-alone', '"No single cell acts alone." What does the slide mean?',
      'Different specialised cells work together to meet the needs of the whole organism',
      ['Every cell does every job', 'Cells never touch each other', 'Only beta-cells matter'],
      'Together, diverse specialised cells fulfil the complex physiological requirements of the entire organism.'),
    pair('c3-pancreas', 'Where are the beta-cells that make insulin?', ['In the pancreas', 'In the liver'], 'In the pancreas',
      'Beta-cells sit in the pancreatic islets, inside the pancreas.'),

    // Type 1 diabetes
    choice('c3-t1-what', 'What happens in Type 1 diabetes?',
      'Beta-cells are destroyed and cannot produce insulin',
      ['The body makes too much insulin', 'The liver stops making glucose', 'The nucleus is destroyed'],
      'Diseases occur when specific cells malfunction. In Type 1 diabetes, pancreatic beta-cells are destroyed and unable to produce insulin.'),
    choice('c3-t1-therapy', 'What is the conventional therapy for Type 1 diabetes?',
      'Daily insulin injections to replace the missing hormone',
      ['Daily glucose injections', 'Eating more sugar', 'Removing the pancreas'],
      'Doctors prescribe daily insulin injections to replenish the missing hormone and regulate blood glucose levels.'),
    choice('c3-t1-future', 'What are researchers developing for the future of diabetes treatment?',
      'Ways to reprogram other body cells to manufacture insulin',
      ['Bigger insulin injections', 'A new kind of microscope', 'A way to live without insulin'],
      'Researchers are developing methods to reprogram other body cells to manufacture insulin, eliminating constant injections.'),
    choice('c3-t1-why', 'Why do the insulin injections help a person with Type 1 diabetes?',
      'They replenish the missing hormone and regulate blood glucose levels',
      ['They repair the destroyed beta-cells', 'They feed the cells with glucose', 'They kill bacteria'],
      'The injections put back the insulin the body can no longer make, so blood glucose stays regulated.'),

    // Cellular respiration
    choice('c3-resp-eq', 'Which is the word equation for cellular respiration?',
      'Glucose + oxygen → carbon dioxide + water + energy',
      ['Carbon dioxide + water → glucose + oxygen', 'Glucose + water → oxygen + energy', 'Oxygen + energy → glucose + carbon dioxide'],
      'Glucose + oxygen → carbon dioxide + water + energy. What goes in is on the left, what comes out is on the right.'),
    choice('c3-resp-in', 'What goes INTO cellular respiration?', 'Glucose and oxygen',
      ['Carbon dioxide and water', 'Water and energy', 'Insulin and amino acids'],
      'Cells must continually absorb glucose (food fuel) and oxygen. Those are the two things that go in.'),
    choice('c3-resp-out', 'What comes OUT of cellular respiration?', 'Carbon dioxide, water and energy',
      ['Glucose and oxygen', 'Only energy', 'Insulin'],
      'Respiration gives carbon dioxide, water and energy. Carbon dioxide is the waste the cell must expel.'),
    pair('c3-resp-where', 'Where does cellular respiration happen?', ['Mitochondria', 'Nucleus'], 'Mitochondria',
      'Mitochondria are the site of cellular respiration. They generate the cell\'s energy.'),

    // What cells need
    choice('c3-needs-intake', 'What must cells continually absorb (take in)?', 'Glucose (food fuel) and oxygen',
      ['Carbon dioxide', 'Cell sap', 'Chlorophyll'],
      'Intake needs: cells must continually absorb glucose and oxygen.'),
    choice('c3-needs-waste', 'Which metabolic waste product must cells expel (get rid of)?', 'Carbon dioxide',
      ['Glucose', 'Oxygen', 'Minerals'],
      'Waste removal: cells must expel metabolic waste products like carbon dioxide.'),
    match('c3-needs-match', 'Match each substance to why the cell needs it, or why it must leave.', [
      ['Water', 'Needed as a solvent'],
      ['Fats', 'Needed for membranes'],
      ['Glucose', 'Food fuel'],
      ['Carbon dioxide', 'Waste to expel'],
    ], 'Water is a solvent, fats build membranes, glucose is fuel, and carbon dioxide is waste.'),
    pair('c3-io-1', 'Oxygen', IO, 'Taken in', 'Oxygen is taken in for respiration, together with glucose.'),
    pair('c3-io-2', 'Carbon dioxide', IO, 'Waste out', 'Carbon dioxide is a metabolic waste product. Cells must expel it.'),
    pair('c3-io-3', 'Minerals', IO, 'Taken in', 'Cells need minerals, along with water as a solvent and fats for membranes.'),
  ], [
    ['c3-system', /^c3-(system-|interdep)/],
    ['c3-beta-cells', /^c3-(beta-|pancreas)/],
    ['c3-diabetes', /^c3-t1-/],
    ['c3-respiration', /^c3-resp-/],
    ['c3-needs', /^c3-(needs-|io-)/],
  ]),
};
