// Questions answered in full sentences, as in a Criterion A test (define, describe, outline, explain, compare).
// Each one belongs to a thing to know, so it turns up in the daily rounds as one more wording of that thing.
import { idea, short } from '../../content/build';
import type { ShortItem } from '../../content/types';

export const written: Record<string, ShortItem[]> = {
  C1: [
    short('w-cells-common', 'c1-cells', 'What do all living things have in common? Explain, with two examples of living things.', [
      idea('They are all made of cells', 'cell'),
      idea('Two examples: a tree, a snake, bacteria, yeast, humans', 'tree', 'snake', 'bacteri', 'coli', 'yeast', 'human', 'people', 'animal', 'plant'),
      idea('Even though they look and act very differently', 'different', 'look', 'behave', 'diversity', 'act'),
    ], 'All living organisms are made of cells. A eucalyptus tree, a snake, E. coli bacteria, yeast and humans look and act very differently. But every one of them is made of the same tiny building blocks: cells.', 2),
    short('w-form-function', 'c1-form-function', 'Explain what "form meets function" means. Give an example.', [
      idea('Form is how a cell is built: its shape and structure', 'form', 'shape', 'built', 'structure', 'look'),
      idea('Function is its job, and the way it is built controls how it works', 'function', 'job', 'works', 'role', 'does', 'task'),
      idea('An example: skin, heart, muscle or blood cells look different', 'skin', 'heart', 'muscle', 'blood', 'nerve'),
    ], 'Form means how a cell is built: its shape and size. Function means the job it does. "Form meets function" means the way a cell is built controls how it works. For example, skin, heart, muscle and blood cells all look different. This is because each one does a different job.'),
    short('w-stem-define', 'c1-stem-cell', 'Define a stem cell.', [
      idea('A cell that can divide (make copies of itself)', 'divid', 'replicate', 'copy', 'copies', 'multiply'),
      idea('It can turn into many other cell types', 'transform', 'turn into', 'become', 'differentiate', 'many', 'other cell', 'change into'),
      idea('It is unspecialised, a blank slate (no job yet)', 'unspecialised', 'unspecialized', 'blank', 'no job', 'not special', 'empty'),
    ], 'A stem cell is a special, unspecialised cell. It can divide and transform into many other specific cell types in the body. Stem cells are "blank slates": they have no job yet.', 2),
    short('w-stem-types', 'c1-stem-types', 'Name the three main types of stem cell.', [
      idea('Embryonic stem cells', 'embryo'),
      idea('Adult stem cells', 'adult'),
      idea('Artificially induced stem cells, reprogrammed by scientists', 'induced', 'artificial', 'reprogram', 'lab', 'scientist', 'made'),
    ], 'The three main types are embryonic stem cells, adult stem cells and artificially induced stem cells. Artificially induced stem cells are reprogrammed by scientists.'),
    short('w-medicine', 'c1-medicine', 'Describe two ways scientists use cells to treat illness.', [
      idea('Cancer: targeted drugs stop cancer cells multiplying', 'cancer', 'targeted', 'multiply'),
      idea('Changed (engineered) bacteria make human insulin for diabetes', 'bacteria', 'insulin', 'engineer', 'changed'),
      idea('Stem cells repair damaged spinal, heart or blood tissue', 'stem cell', 'repair', 'replace', 'tissue', 'spin', 'heart', 'blood', 'fix'),
    ], 'Targeted drugs stop specific cancer cells from multiplying rapidly. Engineered bacteria produce medical proteins such as human insulin for diabetes. Stem cells are guided to replace damaged spinal, heart or blood tissue in patients.', 2),
    short('w-ethics', 'c1-ethics', 'Should we use stem cells? Give one promise and one reason for careful regulation (rules).', [
      idea('Promise: cure diseases with no cure, repair organs, save lives', 'cure', 'repair', 'save', 'treat', 'heal', 'help', 'fix'),
      idea('Regulation: strict monitoring, safety checks and ethical guidelines', 'regulat', 'rule', 'safety', 'ethic', 'monitor', 'check', 'control', 'guideline', 'watch'),
    ], 'Stem cells have a very big promise. They could cure diseases that had no cure, repair organs and save human lives. But new biotechnology needs careful regulation: strict monitoring, safety checks and ethical guidelines.'),
  ],
  C2: [
    short('w-janssen', 'c2-janssen', 'Outline what Zacharias and Hans Janssen did in 1590.', [
      idea('They put several lenses inside a sliding tube', 'stack', 'lenses', 'tube', 'several', 'many lens'),
      idea('This made the first compound microscope', 'compound', 'first microscope', 'microscope'),
      idea('It magnified up to 10×', '10'),
    ], 'In 1590 Zacharias and Hans Janssen stacked several lenses inside a sliding tube. This created the first compound microscope. It magnified objects up to 10×.', 2),
    short('w-hooke', 'c2-hooke', 'Outline how cells got their name.', [
      idea('Robert Hooke, in 1665, with a 50× magnifier', 'hooke', '1665', '50'),
      idea('He looked at a thin slice of cork', 'cork', 'bark'),
      idea('He saw tiny, empty, box-like rooms (chambers)', 'empty', 'box', 'chamber', 'room', 'block'),
      idea('They reminded him of cellae, the small rooms where monks lived', 'cellae', 'monk'),
    ], 'In 1665 Robert Hooke looked at a thin slice of cork with his 50× magnifier. He saw tiny, empty, block-like chambers. He called them "cells". They reminded him of cellae, the small rooms where monks lived and prayed.', 3),
    short('w-leeuwenhoek', 'c2-leeuwenhoek', 'Describe what Antonie van Leeuwenhoek discovered, and what he called it.', [
      idea('He built very exact (high-precision) lenses up to 200×', '200', 'lens', 'precision', 'exact'),
      idea('He was the first to see living bacteria, yeast and blood cells', 'first', 'living', 'bacteria', 'yeast', 'blood', 'alive'),
      idea('He called them "animalcules", tiny animals', 'animalcule', 'tiny animal', 'small animal'),
    ], 'Around 1670 Antonie van Leeuwenhoek built high-precision lenses up to 200×. He was the first human to observe living bacteria, yeast and blood cells. He was surprised by the swimming life in water drops. He nicknamed the living single cells "animalcules", tiny animals.'),
    short('w-compound', 'c2-parts', 'Describe a compound light microscope. Name at least three parts and say what each one does.', [
      idea('Eyepiece (ocular lens): makes the image bigger, usually 10×', 'eyepiece', 'ocular'),
      idea('Objective lenses: 4×, 10×, 40×, held on the revolving nosepiece', 'objective', 'nosepiece'),
      idea('Stage and clips hold the slide; coarse and fine knobs focus', 'stage', 'clip', 'knob', 'focus', 'coarse', 'fine'),
      idea('Light source and diaphragm control how bright the light is', 'light', 'diaphragm', 'bright'),
    ], 'A compound light microscope has an ocular lens (eyepiece). It magnifies the image, usually 10×. The revolving nosepiece holds the objective lenses (4×, 10×, 40×). They give the main magnification. The stage and stage clips hold the slide. The coarse knob focuses fast and the fine knob focuses with precision. The light source and diaphragm control the brightness of the light.', 3),
    short('w-magnification', 'c2-magnification', 'Describe how to work out the total magnification of a microscope. Use an example.', [
      idea('Multiply the two magnifications', 'multipl', 'times', '×', ' x '),
      idea('The eyepiece (ocular lens)', 'eyepiece', 'ocular'),
      idea('The objective lens', 'objective'),
      idea('An example, such as 10 × 40 = 400×', '400', '100', '40'),
    ], 'Total magnification = eyepiece × objective. You multiply the magnification of the ocular lens by the magnification of the objective lens. For example, a 10× eyepiece with the 40× objective gives 10 × 40 = 400×.', 3),
    short('w-compare-cells', 'c2-plant-animal', 'Compare plant and animal cells as seen under the microscope. Give three differences.', [
      idea('Shape: plant cells box-like and rigid (stiff), animal cells rounded or irregular', 'box', 'rectang', 'rigid', 'round', 'irregular', 'shape', 'stiff'),
      idea('Outer layer: plant cells have a thick cell wall, animal cells only a membrane', 'wall', 'membrane'),
      idea('Colour: plant cells have green chloroplasts; animal cells are stained blue or pink', 'chloroplast', 'green', 'stain', 'blue', 'pink', 'colour'),
    ], 'Plant cells have a rigid, box-like shape in a neat grid. Animal cells are rounded, irregular or varied. Plant cells have a thick cell wall that you can see under the microscope. Animal cells have only a flexible cell membrane and no cell wall. Plant cells contain green chloroplasts. Animal cells are usually stained blue or pink to see the nucleus.'),
  ],
  C3: [
    short('w-system', 'c3-system', 'Define a system. Then explain why a cell is a system.', [
      idea('A group of interdependent components (parts that need each other)', 'group', 'parts', 'component', 'interdependent', 'depend', 'need each other', 'rely'),
      idea('Working together for one unified (shared) function', 'together', 'unified', 'function', 'purpose', 'one job', 'shared', 'same job', 'goal'),
      idea('Each organelle has its own task that the cell needs to survive', 'organelle', 'task', 'specific', 'survive', 'survival', 'job', 'alive', 'own'),
    ], 'A system is a group of interdependent components working together to achieve a unified function. A cell is a system because each organelle has a specific task. The cell needs every task to survive. The organelles depend on each other and work together.'),
    short('w-beta', 'c3-beta-cells', 'Explain how pancreatic beta-cells show that cells work together in the body.', [
      idea('Beta-cells have one special job: producing insulin', 'insulin', 'produc', 'make'),
      idea('They absorb (take in) amino acids to build protein chains', 'amino', 'absorb', 'protein', 'building block', 'take in'),
      idea('No single cell acts alone: specialised cells together give the body what it needs', 'alone', 'together', 'other cells', 'organism', 'whole body', 'specialised', 'help each other'),
    ], 'Pancreatic beta-cells specialise in producing insulin. To do this they must absorb raw building blocks such as amino acids. They join them into protein chains. No single cell acts alone. Together, diverse specialised cells meet the needs of the entire organism.', 2),
    short('w-diabetes', 'c3-diabetes', 'Explain what goes wrong in Type 1 diabetes and how doctors treat it.', [
      idea('The pancreatic beta-cells are destroyed', 'destroy', 'damage', 'killed', 'not working', 'malfunction', 'die', 'broken'),
      idea('So they cannot produce insulin', 'insulin', 'hormone'),
      idea('Doctors give daily insulin injections to regulate (control) blood glucose', 'inject', 'daily', 'replenish', 'replace', 'glucose', 'put back', 'every day'),
    ], 'In Type 1 diabetes the pancreatic beta-cells are destroyed. So they are unable to produce insulin. Doctors prescribe daily insulin injections. The injections replenish the missing hormone and regulate blood glucose levels. In the future, researchers hope to reprogram other body cells to manufacture insulin.'),
    short('w-respiration', 'c3-respiration', 'Write the word equation for cellular respiration.', [
      idea('Glucose', 'glucose'),
      idea('Oxygen', 'oxygen', 'o2'),
      idea('Carbon dioxide', 'carbon dioxide', 'co2'),
      idea('Water', 'water', 'h2o'),
      idea('Energy', 'energy'),
    ], 'Glucose + oxygen → carbon dioxide + water + energy.'),
    short('w-needs', 'c3-needs', 'Describe what a cell must take in, and what it must get rid of.', [
      idea('It must absorb (take in) glucose (food fuel) and oxygen', 'glucose', 'oxygen', 'fuel'),
      idea('It must expel (push out) waste such as carbon dioxide', 'carbon dioxide', 'co2', 'waste', 'push out', 'get rid'),
      idea('It also needs water as a solvent, fats for membranes, and minerals', 'water', 'solvent', 'fat', 'mineral', 'dissolve'),
    ], 'Cells must continually absorb glucose (food fuel) and oxygen. They must expel metabolic waste products such as carbon dioxide. They also need water as a solvent, fats for membranes, and minerals.', 2),
  ],
  C4: [
    short('w-membrane', 'c4-membrane', 'Explain what "selectively permeable" means, and why it matters for the cell.', [
      idea('Some chemicals pass through easily while others are blocked', 'some', 'certain', 'blocked', 'not others', 'pass', 'not all', 'through'),
      idea('Protein channels open or close to limit what moves in or out', 'channel', 'protein', 'open', 'close', 'door'),
      idea('It keeps balance: no build-up of toxins, nutrients kept in', 'balance', 'toxic', 'toxin', 'nutrient', 'retain', 'keep', 'poison', 'build'),
    ], 'The cell membrane surrounds the cell and controls what enters and leaves. Selectively permeable means certain chemicals pass through easily while others are blocked. Protein channels open or close. This limits what moves into or out of the cytoplasm. This keeps the inside of the cell balanced: the membrane prevents a toxic build-up and keeps vital nutrients in.', 2),
    short('w-nucleus', 'c4-nucleus', 'Describe the nucleus and its job.', [
      idea('It contains the genetic material, DNA', 'dna', 'genetic', 'gene', 'instruction'),
      idea('It directs (controls) all cell activities', 'direct', 'control', 'activit', 'in charge', 'boss', 'tells'),
      idea('It is stained blue under the microscope', 'blue', 'stain'),
    ], 'The nucleus contains the genetic material (DNA). It directs all cell activities. Under the microscope it is stained blue.', 2),
    short('w-nucleolus', 'c4-nucleolus', 'Where is the nucleolus, and what does it make?', [
      idea('Inside the nucleus', 'inside the nucleus', 'in the nucleus', 'within the nucleus', 'nucleus', 'inside'),
      idea('It manufactures (makes) ribosomes', 'ribosome'),
      idea('Ribosomes make proteins', 'protein'),
    ], 'The nucleolus is located inside the nucleus. It manufactures ribosomes. Ribosomes are the organelles that make proteins.', 2),
    short('w-cytoplasm', 'c4-cytoplasm', 'Describe the cytoplasm.', [
      idea('A jelly-like fluid', 'jelly', 'fluid', 'liquid', 'gel'),
      idea('It holds (suspends) the organelles', 'organelle', 'suspend', 'hold', 'float', 'inside'),
      idea('It has dissolved chemicals for chemical reactions', 'reaction', 'chemical', 'metabolic', 'dissolved', 'changes'),
    ], 'Cytoplasm is the jelly-like fluid suspending (holding) the organelles. It contains dissolved chemicals for vital metabolic reactions (the chemical changes the cell needs).', 2),
    short('w-mito', 'c4-mitochondria', 'Describe the mitochondria. Explain how their form suits their function.', [
      idea('Site of cellular respiration: they make the cell\'s energy', 'respiration', 'energy', 'powerhouse', 'power'),
      idea('The inner membrane has deep folds, the cristae', 'fold', 'cristae'),
      idea('The folds give a very big surface area for chemical reactions', 'surface area', 'surface', 'more space', 'more room', 'bigger area'),
    ], 'Mitochondria are the site of cellular respiration: they generate cellular energy. Their inner membrane has deep folds called cristae. The folds create a vast (very big) surface area for chemical reactions. So the form suits the function. Very active cells such as liver cells may contain up to 100,000 mitochondria.'),
    short('w-wall', 'c4-wall', 'Describe the cell wall.', [
      idea('A tough outer layer made of cellulose', 'cellulose', 'tough', 'strong', 'hard'),
      idea('It surrounds the membrane (plant cells only)', 'surround', 'outside', 'around', 'plant'),
      idea('It gives the cell a rigid (stiff) shape', 'rigid', 'shape', 'stiff', 'support', 'firm'),
    ], 'The cell wall is a tough outer cellulose layer. It surrounds the membrane of a plant cell. It gives the cell a rigid shape.', 2),
    short('w-chloroplast', 'c4-chloroplast', 'Describe chloroplasts and what happens in them.', [
      idea('They contain green chlorophyll', 'chlorophyll', 'green'),
      idea('They are the site (place) of photosynthesis', 'photosynthesis'),
      idea('Photosynthesis turns sunlight into glucose', 'sunlight', 'light', 'glucose', 'sugar', 'food'),
    ], 'Chloroplasts contain green chlorophyll. They are the site of photosynthesis. Photosynthesis converts sunlight to glucose.', 2),
    short('w-vacuole', 'c4-vacuole', 'Explain how the large permanent vacuole keeps a plant cell firm.', [
      idea('It is a fluid-filled sac (bag) of cell sap', 'sap', 'fluid', 'sac', 'liquid', 'water', 'bag'),
      idea('It acts like a blown-up balloon, pushing out', 'balloon', 'inflat', 'push', 'press', 'blown'),
      idea('So the cell stays firm', 'firm', 'rigid', 'shape', 'support', 'stiff'),
    ], 'The large permanent vacuole is a fluid-filled sac containing cell sap. It acts like an inflated balloon and pushes outwards. This keeps the cell firm.', 2),
    short('w-plant-only', 'c4-found-in', 'Name the three parts found only in plant cells, and give the job of each.', [
      idea('Cell wall: tough cellulose, gives a rigid (stiff) shape', 'wall'),
      idea('Chloroplasts: chlorophyll, photosynthesis', 'chloroplast'),
      idea('Large permanent vacuole: cell sap, keeps the cell firm', 'vacuole'),
    ], 'Only plant cells have three parts. The cell wall is a tough outer cellulose layer that gives a rigid shape. Chloroplasts contain green chlorophyll and are the site of photosynthesis. The large permanent vacuole is a fluid-filled sac of cell sap that keeps the cell firm.'),
  ],
};
