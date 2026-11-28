// Questions answered in full sentences, as in a Criterion A test (define, describe, outline, explain, compare).
// Each one belongs to a thing to know, so it turns up in the daily rounds as one more wording of that thing.
import { idea, short } from '../../content/build';
import type { ShortItem } from '../../content/types';

export const written: Record<string, ShortItem[]> = {
  C1: [
    short('w-cells-common', 'c1-cells', 'What do all living organisms have in common? Explain, with two examples of living things.', [
      idea('They are all made of cells', 'cell'),
      idea('Two examples: a tree, a snake, bacteria, yeast, humans', 'tree', 'snake', 'bacteri', 'coli', 'yeast', 'human', 'people', 'animal', 'plant'),
      idea('Even though they look and behave completely differently', 'different', 'look', 'behave', 'diversity'),
    ], 'All living organisms are made of cells. A eucalyptus tree, a snake, E. coli bacteria, yeast and humans look and behave completely differently, but every one of them is composed of the same basic microscopic structures: cells.', 2),
    short('w-form-function', 'c1-form-function', 'Explain what "form meets function" means. Give an example.', [
      idea('Form is how a cell is built: its shape and structure', 'form', 'shape', 'built', 'structure'),
      idea('Function is its job, and the way it is built controls how it works', 'function', 'job', 'works', 'role'),
      idea('An example: skin, heart, muscle or blood cells look different', 'skin', 'heart', 'muscle', 'blood', 'nerve'),
    ], 'Form means how a cell is built: its shape and size. Function means the job it does. "Form meets function" means how a cell is built directly controls how it works. For example, skin, heart, muscle and blood cells all look different because each one does a different job.'),
    short('w-stem-define', 'c1-stem-cell', 'Define a stem cell.', [
      idea('A cell capable of dividing', 'divid', 'replicate', 'copy', 'multiply'),
      idea('It can transform into many other specific cell types', 'transform', 'turn into', 'become', 'differentiate', 'many', 'other cell'),
      idea('It is unspecialised, a blank slate', 'unspecialised', 'unspecialized', 'blank', 'no job', 'not special'),
    ], 'A stem cell is a special, unspecialised cell capable of dividing and transforming into many other specific cell types in the body. Stem cells are "blank slates".', 2),
    short('w-stem-types', 'c1-stem-types', 'Name the three main types of stem cell.', [
      idea('Embryonic stem cells', 'embryo'),
      idea('Adult stem cells', 'adult'),
      idea('Artificially induced stem cells, reprogrammed by scientists', 'induced', 'artificial', 'reprogram', 'lab'),
    ], 'The three main types are embryonic stem cells, adult stem cells and artificially induced stem cells, which are reprogrammed by scientists.'),
    short('w-medicine', 'c1-medicine', 'Describe two ways scientists use cells to treat conditions.', [
      idea('Cancer: targeted drugs stop cancer cells multiplying', 'cancer', 'targeted', 'multiply'),
      idea('Engineered bacteria produce human insulin for diabetes', 'bacteria', 'insulin', 'engineer'),
      idea('Stem cells repair damaged spinal, heart or blood tissue', 'stem cell', 'repair', 'replace', 'tissue', 'spin', 'heart', 'blood'),
    ], 'Targeted drugs are designed to stop specific cancer cells from multiplying rapidly. Engineered bacteria produce therapeutic proteins such as human insulin for diabetes. Stem cells are guided to replace damaged spinal, heart or blood tissue in patients.', 2),
    short('w-ethics', 'c1-ethics', 'Should we use stem cells? Give one promise and one reason for careful regulation.', [
      idea('Promise: cure untreatable diseases, repair organs, save lives', 'cure', 'repair', 'save', 'treat', 'heal', 'help'),
      idea('Regulation: strict monitoring, safety checks and ethical guidelines', 'regulat', 'rule', 'safety', 'ethic', 'monitor', 'check', 'control', 'guideline'),
    ], 'Stem cells have immense promise: the ability to cure previously untreatable diseases, repair organs and save human lives. But new biotechnology requires careful regulation: strict monitoring, safety checks and ethical guidelines.'),
  ],
  C2: [
    short('w-janssen', 'c2-janssen', 'Outline what Zacharias and Hans Janssen did in 1590.', [
      idea('They stacked several lenses inside a sliding tube', 'stack', 'lenses', 'tube'),
      idea('This made the first compound microscope', 'compound', 'first microscope', 'microscope'),
      idea('It magnified up to 10×', '10'),
    ], 'In 1590 Zacharias and Hans Janssen stacked multiple lenses inside a sliding tube. This created the first compound microscope, which magnified objects up to 10×.', 2),
    short('w-hooke', 'c2-hooke', 'Outline how cells got their name.', [
      idea('Robert Hooke, in 1665, with a 50× magnifier', 'hooke', '1665', '50'),
      idea('He looked at a thin slice of cork', 'cork', 'bark'),
      idea('He saw tiny, empty, block-like chambers (boxes)', 'empty', 'box', 'chamber', 'room', 'block'),
      idea('They reminded him of cellae, the small rooms where monks lived', 'cellae', 'monk'),
    ], 'In 1665 Robert Hooke examined a thin slice of cork with his 50× magnifier. He saw tiny, empty, block-like chambers. He called them "cells" because they reminded him of cellae, the small rooms where monks lived and prayed.', 3),
    short('w-leeuwenhoek', 'c2-leeuwenhoek', 'Describe what Antonie van Leeuwenhoek discovered, and what he called it.', [
      idea('He built high-precision lenses up to 200×', '200', 'lens', 'precision'),
      idea('He was the first to see living bacteria, yeast and blood cells', 'first', 'living', 'bacteria', 'yeast', 'blood'),
      idea('He nicknamed them "animalcules", tiny animals', 'animalcule', 'tiny animal'),
    ], 'Around 1670 Antonie van Leeuwenhoek built high-precision lenses up to 200×. He became the first human to observe living bacteria, yeast and blood cells. Surprised by the swimming life in water drops, he nicknamed the living single cells "animalcules", tiny animals.'),
    short('w-compound', 'c2-parts', 'Describe a compound light microscope. Name at least three parts and say what each one does.', [
      idea('Eyepiece (ocular lens): magnifies, usually 10×', 'eyepiece', 'ocular'),
      idea('Objective lenses: 4×, 10×, 40×, held on the revolving nosepiece', 'objective', 'nosepiece'),
      idea('Stage and clips hold the slide; coarse and fine knobs focus', 'stage', 'clip', 'knob', 'focus', 'coarse', 'fine'),
      idea('Light source and diaphragm control the brightness', 'light', 'diaphragm', 'bright'),
    ], 'A compound light microscope has an ocular lens (eyepiece) that magnifies the image, usually 10×. The revolving nosepiece holds the objective lenses (4×, 10×, 40×), which give the primary magnification. The stage and stage clips hold the slide. The coarse and fine knobs focus the image rapidly or with precision. The light source and diaphragm control the brightness of the light beam.', 3),
    short('w-magnification', 'c2-magnification', 'Describe how to work out the total magnification of a microscope. Use an example.', [
      idea('Multiply the two magnifications', 'multipl', 'times', '×', ' x '),
      idea('The eyepiece (ocular lens)', 'eyepiece', 'ocular'),
      idea('The objective lens', 'objective'),
      idea('An example, such as 10 × 40 = 400×', '400', '100', '40'),
    ], 'Total magnification = eyepiece × objective. Multiply the magnification of the ocular lens by the magnification of the objective lens. For example, a 10× eyepiece with the 40× objective gives 10 × 40 = 400×.', 3),
    short('w-compare-cells', 'c2-plant-animal', 'Compare plant and animal cells as seen under the microscope. Give three differences.', [
      idea('Shape: plant cells box-like and rigid, animal cells rounded or irregular', 'box', 'rectang', 'rigid', 'round', 'irregular', 'shape'),
      idea('Outer layer: plant cells have a thick cell wall, animal cells only a membrane', 'wall', 'membrane'),
      idea('Colour: plant cells have green chloroplasts; animal cells are stained blue or pink', 'chloroplast', 'green', 'stain', 'blue', 'pink'),
    ], 'Plant cells have a rigid, box-like shape in a rectangular grid, while animal cells are rounded, irregular or varied. Plant cells have a thick cell wall visible under the microscope, but animal cells have only a flexible cell membrane and no cell wall. Plant cells contain green chloroplasts, whereas animal cells are usually stained blue or pink to see the nucleus.'),
  ],
  C3: [
    short('w-system', 'c3-system', 'Define a system. Then explain why a cell is a system.', [
      idea('A group of interdependent components (parts)', 'group', 'parts', 'component', 'interdependent', 'depend'),
      idea('Working together to achieve one unified function', 'together', 'unified', 'function', 'purpose', 'one job'),
      idea('Each organelle has a specific task essential for the cell\'s survival', 'organelle', 'task', 'specific', 'survive', 'survival', 'job'),
    ], 'A system is a group of interdependent components working together to achieve a unified function. A cell is a system because each organelle inside it has a specific assignment essential for the cell\'s survival, and the organelles depend on each other and work together.'),
    short('w-beta', 'c3-beta-cells', 'Explain how pancreatic beta-cells show that cells work together in the body.', [
      idea('Beta-cells specialise in producing insulin', 'insulin', 'produc', 'make'),
      idea('They absorb amino acids to build protein chains', 'amino', 'absorb', 'protein', 'building block'),
      idea('No single cell acts alone: specialised cells together meet the organism\'s needs', 'alone', 'together', 'other cells', 'organism', 'whole body', 'specialised'),
    ], 'Pancreatic beta-cells specialise in producing insulin. To do this they must absorb raw building blocks such as amino acids to construct protein chains. No single cell acts alone: together, diverse specialised cells fulfil the complex requirements of the entire organism.', 2),
    short('w-diabetes', 'c3-diabetes', 'Explain what goes wrong in Type 1 diabetes and how doctors treat it.', [
      idea('The pancreatic beta-cells are destroyed', 'destroy', 'damage', 'killed', 'not working', 'malfunction'),
      idea('So they cannot produce insulin', 'insulin', 'hormone'),
      idea('Doctors prescribe daily insulin injections to regulate blood glucose', 'inject', 'daily', 'replenish', 'replace', 'glucose'),
    ], 'In Type 1 diabetes the pancreatic beta-cells are destroyed and unable to produce insulin. Doctors prescribe daily insulin injections to replenish the missing hormone and regulate blood glucose levels. In the future, researchers hope to reprogram other body cells to manufacture insulin.'),
    short('w-respiration', 'c3-respiration', 'Write the word equation for cellular respiration.', [
      idea('Glucose', 'glucose'),
      idea('Oxygen', 'oxygen', 'o2'),
      idea('Carbon dioxide', 'carbon dioxide', 'co2'),
      idea('Water', 'water', 'h2o'),
      idea('Energy', 'energy'),
    ], 'Glucose + oxygen → carbon dioxide + water + energy.'),
    short('w-needs', 'c3-needs', 'Describe what a cell must take in, and what it must get rid of.', [
      idea('It must absorb glucose (food fuel) and oxygen', 'glucose', 'oxygen', 'fuel'),
      idea('It must expel waste such as carbon dioxide', 'carbon dioxide', 'co2', 'waste'),
      idea('It also needs water as a solvent, fats for membranes, and minerals', 'water', 'solvent', 'fat', 'mineral'),
    ], 'Cells must continually absorb glucose (food fuel) and oxygen. They must expel metabolic waste products such as carbon dioxide. They also need water as a solvent, fats for membranes, and minerals.', 2),
  ],
  C4: [
    short('w-membrane', 'c4-membrane', 'Explain what "selectively permeable" means, and why it matters for the cell.', [
      idea('Some chemicals pass through easily while others are blocked', 'some', 'certain', 'blocked', 'not others', 'pass'),
      idea('Protein channels open or close to limit what moves in or out', 'channel', 'protein', 'open', 'close'),
      idea('It keeps balance: no toxic build-up, nutrients kept in', 'balance', 'toxic', 'toxin', 'nutrient', 'retain', 'keep'),
    ], 'The cell membrane surrounds the cell and controls what enters and leaves. Selectively permeable means certain chemicals pass through easily while others are blocked. Protein channels open or close to limit molecular movement into or out of the cytoplasm. This maintains internal balance: the membrane prevents toxic accumulation while retaining vital nutrients.', 2),
    short('w-nucleus', 'c4-nucleus', 'Describe the nucleus and its job.', [
      idea('It contains the genetic material, DNA', 'dna', 'genetic', 'gene', 'instruction'),
      idea('It directs (controls) all cell activities', 'direct', 'control', 'activit', 'in charge'),
      idea('It is stained blue under the microscope', 'blue', 'stain'),
    ], 'The nucleus contains the genetic material (DNA) and directs all cell activities. Under the microscope it is stained blue.', 2),
    short('w-nucleolus', 'c4-nucleolus', 'Where is the nucleolus, and what does it make?', [
      idea('Inside the nucleus', 'inside the nucleus', 'in the nucleus', 'within the nucleus', 'nucleus'),
      idea('It manufactures ribosomes', 'ribosome'),
      idea('Ribosomes make proteins', 'protein'),
    ], 'The nucleolus is located inside the nucleus. It manufactures ribosomes, the organelles responsible for making proteins.', 2),
    short('w-cytoplasm', 'c4-cytoplasm', 'Describe the cytoplasm.', [
      idea('A jelly-like fluid', 'jelly', 'fluid', 'liquid', 'gel'),
      idea('It suspends (holds) the organelles', 'organelle', 'suspend', 'hold', 'float'),
      idea('It contains dissolved chemicals for metabolic reactions', 'reaction', 'chemical', 'metabolic', 'dissolved'),
    ], 'Cytoplasm is the jelly-like fluid suspending the organelles. It contains dissolved chemicals for vital metabolic reactions.', 2),
    short('w-mito', 'c4-mitochondria', 'Describe the mitochondria. Explain how their form suits their function.', [
      idea('Site of cellular respiration: they generate the cell\'s energy', 'respiration', 'energy', 'powerhouse'),
      idea('The inner membrane has deep folds, the cristae', 'fold', 'cristae'),
      idea('The folds create a vast surface area for chemical reactions', 'surface area', 'surface', 'more space', 'more room'),
    ], 'Mitochondria are the site of cellular respiration: they generate cellular energy. Their inner membrane has deep folds called cristae. The folds create a vast surface area for chemical reactions, so the form suits the function. Highly active cells such as liver cells may contain up to 100,000 mitochondria.'),
    short('w-wall', 'c4-wall', 'Describe the cell wall.', [
      idea('A tough outer layer made of cellulose', 'cellulose', 'tough', 'strong'),
      idea('It surrounds the membrane (plant cells only)', 'surround', 'outside', 'around', 'plant'),
      idea('It gives the cell a rigid shape', 'rigid', 'shape', 'stiff', 'support'),
    ], 'The cell wall is a tough outer cellulose layer surrounding the membrane of a plant cell. It gives the cell a rigid shape.', 2),
    short('w-chloroplast', 'c4-chloroplast', 'Describe chloroplasts and what happens in them.', [
      idea('They contain green chlorophyll', 'chlorophyll', 'green'),
      idea('They are the site of photosynthesis', 'photosynthesis'),
      idea('Photosynthesis converts sunlight to glucose', 'sunlight', 'light', 'glucose', 'sugar', 'food'),
    ], 'Chloroplasts contain green chlorophyll. They are the site of photosynthesis, which converts sunlight to glucose.', 2),
    short('w-vacuole', 'c4-vacuole', 'Explain how the large permanent vacuole keeps a plant cell firm.', [
      idea('It is a fluid-filled sac of cell sap', 'sap', 'fluid', 'sac', 'liquid', 'water'),
      idea('It acts like an inflated balloon, pushing outwards', 'balloon', 'inflat', 'push', 'press'),
      idea('So the cell stays firm', 'firm', 'rigid', 'shape', 'support'),
    ], 'The large permanent vacuole is a fluid-filled sac containing cell sap. It acts like an inflated balloon, pushing outwards, and this keeps the cell firm.', 2),
    short('w-plant-only', 'c4-found-in', 'Name the three parts found only in plant cells, and give the job of each.', [
      idea('Cell wall: tough cellulose, gives a rigid shape', 'wall'),
      idea('Chloroplasts: chlorophyll, photosynthesis', 'chloroplast'),
      idea('Large permanent vacuole: cell sap, keeps the cell firm', 'vacuole'),
    ], 'Only plant cells have a cell wall, a tough outer cellulose layer that gives a rigid shape; chloroplasts, which contain green chlorophyll and are the site of photosynthesis; and a large permanent vacuole, a fluid-filled sac of cell sap that keeps the cell firm.'),
  ],
};
