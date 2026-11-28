// The lessons: Adele does not know the material yet, so each day starts by learning it (Jenia, 28 Nov),
// and only then plays the day's world. One lesson per world, keyed by the world's id.
// Every fact comes from the three decks attached to the test, in easy English for a child who is not
// a native speaker and has just started biology. The teacher's science words stay, with a plain word in brackets.
import type { LearnCard, Lesson } from '../../content/types';

type Step = [show: string, why: string];
type Tap = [question: string, options: string[], answer: number, why: string];

/** The quick check's options in a fixed but mixed order (from the card id), so the right one is not always first. */
function mixed(id: string, options: string[], answer: number): { options: string[]; answer: number } {
  const seed = [...id].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const shift = seed % options.length;
  const out = options.map((_, i) => options[(i + shift) % options.length]);
  return { options: out, answer: out.indexOf(options[answer]) };
}

function card(id: string, emoji: string, title: string, intro: string, photo: string, steps: Step[], tap: Tap, remember: string): LearnCard {
  const { options, answer } = mixed(id, tap[1], tap[2]);
  return {
    id, emoji, title, intro, photo,
    steps: steps.map(([show, why]) => ({ show, why })),
    tap: { question: tap[0], options, answer, why: tap[3] },
    remember,
  };
}

// ---------- Sunday: the parts of a cell (before Build-a-Cell) ----------
const build: Lesson = {
  topic: 'build',
  title: 'The parts of a cell',
  blurb: 'Meet the parts of animal and plant cells, and where they are.',
  cards: [
    card('b-organelle', '🧩', 'A cell has parts', 'A cell is not empty. It has small parts inside, called organelles.', 'c3-animal-cell', [
      ['An organelle is a small part inside a cell.', 'Each organelle has its own specific job.'],
      ['Plant cells and animal cells share many parts.', 'Cells look different, but they have the same basic structure.'],
    ], ['What is an organelle?', ['A small part inside a cell, with its own job', 'A kind of plant', 'A whole cell'], 0,
      'Organelles are the small parts inside a cell. Each one has a job.'], 'Organelle = a small part of a cell with its own job.'),
    card('b-animal', '🔴', 'The animal cell: four main parts', 'Look at the picture. These four parts are in every animal cell.', 'c3-animal-cell', [
      ['Cell membrane: on the outside.', 'It controls what goes in and out of the cell.'],
      ['Cytoplasm: the jelly-like liquid inside.', 'The other parts float in it. Chemical reactions happen in it.'],
      ['Nucleus: the big round part.', 'It holds the DNA and controls the cell.'],
      ['Mitochondria: small parts with folds inside.', 'They make the cell\'s energy.'],
    ], ['Which part holds the DNA and controls the cell?', ['Nucleus', 'Cytoplasm', 'Cell membrane'], 0,
      'The nucleus is the control centre. The DNA is inside it.'], 'Membrane outside, cytoplasm inside, nucleus in charge, mitochondria for energy.'),
    card('b-tiny', '🔵', 'Two tiny helpers', 'Two more parts are very small.', 'c3-ribosomes', [
      ['The nucleolus is inside the nucleus.', 'It makes ribosomes.'],
      ['Ribosomes are tiny dots in the cytoplasm.', 'They make proteins.'],
    ], ['What do ribosomes make?', ['Proteins', 'DNA', 'Energy'], 0, 'Ribosomes make proteins. The nucleolus makes the ribosomes.'],
    'Nucleolus → makes ribosomes → ribosomes make proteins.'),
    card('b-plant', '🌿', 'Plant cells have three extra parts', 'A plant cell has everything an animal cell has. It also has three more parts.', 'c3-plant-cell', [
      ['1. A cell wall', 'A tough layer around the outside.'],
      ['2. Chloroplasts', 'Small green parts.'],
      ['3. A large permanent vacuole', 'A big bag of liquid in the middle.'],
      ['Animal cells do not have these three parts.', 'This is the easiest way to tell plant and animal cells apart.'],
    ], ['Which part is only in plant cells?', ['Chloroplasts', 'Nucleus', 'Mitochondria'], 0,
      'Chloroplasts are plant only. The nucleus and mitochondria are in both kinds of cell.'], 'Plant only: cell wall, chloroplasts, large permanent vacuole.'),
    card('b-wall', '🧱', 'The cell wall', 'The cell wall is the outside of a plant cell.', 'c3-plant-cell', [
      ['It is a tough layer of cellulose.', 'Cellulose is the strong material the wall is made of.'],
      ['It surrounds (goes around) the membrane.', 'So in a plant cell the wall is outside the membrane.'],
      ['It gives the cell a rigid (stiff) shape.', 'That is why plant cells look like boxes.'],
    ], ['What is the cell wall made of?', ['Cellulose', 'Chlorophyll', 'Cell sap'], 0, 'The cell wall is made of cellulose.'],
    'Cell wall: cellulose, around the membrane, stiff shape.'),
    card('b-chloro', '🍃', 'Chloroplasts', 'Chloroplasts make a plant green.', 'c3-chloroplast', [
      ['They contain green chlorophyll.', 'Chlorophyll is the green substance (stuff).'],
      ['Photosynthesis happens in them.', 'Photosynthesis turns sunlight into glucose (sugar, the plant\'s food).'],
    ], ['What happens in chloroplasts?', ['Photosynthesis', 'Respiration', 'Making proteins'], 0,
      'Chloroplasts do photosynthesis: sunlight → glucose.'], 'Chloroplasts: green chlorophyll, photosynthesis.'),
    card('b-vacuole', '🎈', 'The large permanent vacuole', 'The vacuole is the big bag in the middle of a plant cell.', 'c3-vacuole', [
      ['It is filled with a liquid called cell sap.', 'Sap is the liquid inside.'],
      ['It works like an inflated (blown-up) balloon.', 'It pushes outwards and keeps the cell firm.'],
    ], ['What does the vacuole do?', ['Keeps the cell firm', 'Makes energy', 'Controls the cell'], 0,
      'Full of cell sap, it pushes like a balloon and keeps the cell firm.'], 'Vacuole: cell sap, like a balloon, keeps the cell firm.'),
    card('b-where', '🗺️', 'Where is each part?', 'Your teacher\'s table says where each part is.', 'c3-plant-cell', [
      ['Cell membrane: on the outer surface.', 'In a plant cell, the wall is outside it.'],
      ['Cell wall: surrounds the membrane (plant only).', 'It is the outermost layer.'],
      ['Cytoplasm: inside the membrane.', 'It fills the cell.'],
      ['Nucleus, mitochondria, chloroplasts, vacuole: in the cytoplasm.', 'They sit in the jelly.'],
      ['The big plant cell picture also shows the Golgi body and the endoplasmic reticulum.', 'Your slides only name these two. Just know their names.'],
    ], ['Where is the cell wall?', ['It surrounds the membrane', 'Inside the nucleus', 'In the cytoplasm'], 0,
      'The wall surrounds the membrane. It is the outer layer of a plant cell.'], 'Outside to inside: wall → membrane → cytoplasm → the organelles.'),
  ],
};

// ---------- Monday: what the parts do, and a cell as a system (before Organelle Factory) ----------
const factory: Lesson = {
  topic: 'factory',
  title: 'A cell is a system',
  blurb: 'What each part does, and how the parts work together.',
  cards: [
    card('f-system', '⚙️', 'A cell is a system', 'A system is a group of parts that work together.', 'c3-system', [
      ['A system is a group of interdependent components working together to achieve a unified function.', 'Interdependent = they need each other. Unified function = one shared job.'],
      ['Each organelle has a specific task.', 'The cell needs every task to survive.'],
      ['Cells are very different in size and shape.', 'But plant and animal cells share the same basic parts.'],
    ], ['What does "interdependent" mean?', ['The parts need each other', 'Each part works alone', 'All parts do the same job'], 0,
      'Interdependent parts need each other. If one stops, the others have a problem.'], 'System = interdependent parts + one shared function.'),
    card('f-coord', '🤝', 'A coordinated system', 'Your first slides say it too.', 'c1-cell-shapes', [
      ['Different parts of a cell work together as a system.', 'Coordinated = working together.'],
      ['Together they give the cell energy, nutrients and what it needs to survive.', 'No part could keep the cell alive alone.'],
    ], ['Why do the parts of a cell work together?', ['To give energy, nutrients and what the cell needs to survive', 'To make the cell bigger', 'They do not work together'], 0,
      'The parts work together to provide energy, nutrients and survival requirements.'], 'The parts of a cell work together to keep it alive.'),
    card('f-nucleus', '🧠', 'The nucleus', 'The nucleus is the control centre.', 'c3-nucleus', [
      ['It contains the genetic material, DNA.', 'DNA holds the instructions for the cell.'],
      ['It directs (controls) all cell activities.', 'Like a boss who gives orders.'],
      ['It is stained blue under the microscope.', 'The stain makes it easy to see.'],
    ], ['What colour is the nucleus on a stained slide?', ['Blue', 'Green', 'Red'], 0, 'The nucleus is stained blue so you can see it.'],
    'Nucleus: DNA, controls the cell, stained blue.'),
    card('f-nucleolus', '🔵', 'The nucleolus', 'A small part inside the nucleus.', 'c3-nucleus', [
      ['The nucleolus is located inside the nucleus.', 'It is the dark spot in the nucleus.'],
      ['It manufactures (makes) ribosomes.', 'Ribosomes are the organelles that make proteins.'],
    ], ['What does the nucleolus make?', ['Ribosomes', 'DNA', 'Cell sap'], 0, 'The nucleolus makes ribosomes. Ribosomes make proteins.'],
    'Nucleolus: inside the nucleus, makes ribosomes.'),
    card('f-cyto', '🫙', 'The cytoplasm', 'Everything inside the membrane floats in the cytoplasm.', 'c3-animal-cell', [
      ['Cytoplasm is a jelly-like fluid.', 'Fluid = a liquid.'],
      ['It suspends (holds) the organelles.', 'The organelles float in it.'],
      ['It contains dissolved chemicals for vital reactions.', 'Chemical reactions (changes) happen here.'],
    ], ['Where do the organelles float?', ['In the cytoplasm', 'In the cell wall', 'In the nucleus'], 0, 'The organelles are held in the jelly-like cytoplasm.'],
    'Cytoplasm: jelly-like, holds the organelles, reactions happen in it.'),
    card('f-mito', '⚡', 'Mitochondria: the powerhouse', 'Mitochondria make the cell\'s energy.', 'c3-mitochondrion', [
      ['Cellular respiration happens in the mitochondria.', 'Respiration releases energy from glucose.'],
      ['The inner membrane has deep folds, called cristae.', 'The folds give a very big surface area for the chemical reactions.'],
      ['Very active cells, like liver cells, can have up to 100,000 mitochondria.', 'A busy cell needs a lot of energy.'],
    ], ['Why does the inner membrane have folds (cristae)?', ['To make a very big surface area', 'To store DNA', 'To let light in'], 0,
      'More folds = more surface = more room for the reactions.'], 'Mitochondria: respiration, energy, cristae, liver up to 100,000.'),
    card('f-beta', '💉', 'Beta-cells make insulin', 'Some cells have one special job.', 'c3-beta-cells', [
      ['Pancreatic beta-cells (in the pancreas) specialise in producing insulin.', 'Insulin is a hormone the body needs.'],
      ['To make insulin, they absorb (take in) amino acids.', 'They build the amino acids into protein chains.'],
      ['No single cell acts alone.', 'Many different special cells work together for the whole body.'],
    ], ['What do beta-cells take in to make insulin?', ['Amino acids', 'Cellulose', 'Oxygen only'], 0,
      'Insulin is a protein. Beta-cells build it from amino acids.'], 'Beta-cells: in the pancreas, amino acids → insulin.'),
  ],
};

// ---------- Tuesday: the membrane, what cells need, respiration (before Membrane Security) ----------
const membrane: Lesson = {
  topic: 'membrane',
  title: 'What goes in and out',
  blurb: 'The membrane is the gatekeeper. Learn what cells need and what they throw out.',
  cards: [
    card('m-membrane', '🚪', 'The cell membrane: a gatekeeper', 'The membrane surrounds the cell.', 'c3-membrane', [
      ['It controls what enters (goes in) and what leaves (goes out).', 'Like a guard at a gate.'],
      ['It is selectively permeable.', 'Some chemicals pass through easily. Others are blocked.'],
    ], ['"Selectively permeable" means…', ['Some things pass, others are blocked', 'Everything passes', 'Nothing passes'], 0,
      'The membrane chooses: some things through, others blocked.'], 'Membrane: around the cell, selectively permeable.'),
    card('m-channels', '🔐', 'Protein channels', 'The membrane has little doors.', 'c3-membrane', [
      ['Protein channels sit in the membrane.', 'They are like doors.'],
      ['They open or close to limit what moves in or out of the cytoplasm.', 'They control the traffic.'],
      ['This keeps the inside of the cell balanced.', 'It stops toxins (poisons) building up and keeps the good nutrients in.'],
    ], ['What do protein channels do?', ['Open or close to control what moves in or out', 'Make proteins', 'Store DNA'], 0,
      'Protein channels open or close, like doors.'], 'Protein channels = doors that open or close.'),
    card('m-needs', '🍽️', 'What cells need', 'Cells must keep taking things in.', 'c3-respiration', [
      ['Glucose: food fuel.', 'Cells use it to get energy.'],
      ['Oxygen.', 'Cells need it for respiration.'],
      ['Water as a solvent, fats for membranes, and minerals.', 'A solvent is a liquid that other things dissolve in.'],
      ['The plant picture on the slide: a plant takes in light, carbon dioxide, water and minerals, and gives out oxygen.', 'That picture shows a whole plant, not one cell.'],
    ], ['What are fats needed for?', ['Building membranes', 'Making DNA', 'Seeing colours'], 0, 'Cells need fats for their membranes.'],
    'Cells need: glucose, oxygen, water, fats, minerals.'),
    card('m-waste', '🗑️', 'Waste must go out', 'Cells also make waste.', 'c3-respiration', [
      ['Cells must expel (push out) metabolic waste.', 'Metabolic waste = waste from the cell\'s chemical reactions.'],
      ['Carbon dioxide is a waste product.', 'It must leave the cell.'],
    ], ['Which of these is waste that leaves the cell?', ['Carbon dioxide', 'Glucose', 'Oxygen'], 0,
      'Carbon dioxide is waste. Glucose and oxygen come in.'], 'Carbon dioxide = waste → out.'),
    card('m-resp', '🔥', 'Cellular respiration', 'This is how cells get energy.', 'c3-respiration', [
      ['Glucose + oxygen → carbon dioxide + water + energy', 'What goes in is before the arrow. What comes out is after it.'],
      ['It happens in the mitochondria.', 'The mitochondria are the cell\'s powerhouse.'],
    ], ['What comes out of respiration?', ['Carbon dioxide, water and energy', 'Glucose and oxygen', 'Only glucose'], 0,
      'Glucose + oxygen → carbon dioxide + water + energy.'], 'Glucose + oxygen → carbon dioxide + water + energy.'),
  ],
};

// ---------- Wednesday: how we see cells (before the Escape Room) ----------
const escape: Lesson = {
  topic: 'escape',
  title: 'How we see cells',
  blurb: 'The people who first saw cells, and how a microscope works.',
  cards: [
    card('e-ancient', '💧', 'Before microscopes', 'Long ago there were no microscopes.', 'c2-water-drop-lens', [
      ['People used pieces of curved glass, drops of water and clear pebbles.', 'They worked as simple single lenses.'],
      ['These made small things look bigger.', 'To enlarge = to make bigger.'],
    ], ['What did people use before microscopes?', ['Curved glass and water drops', 'Telescopes', 'Mirrors'], 0,
      'Curved glass, water drops and clear pebbles were the first lenses.'], 'First lenses: curved glass, water drops, clear pebbles.'),
    card('e-janssen', '🔭', 'Janssen, 1590', 'The first compound microscope.', 'c2-janssen', [
      ['Zacharias and Hans Janssen stacked several lenses inside a sliding tube.', 'Compound = it uses more than one lens.'],
      ['It made things up to 10× bigger.', '× means "times": 10× = ten times bigger.'],
    ], ['What did the Janssens make in 1590?', ['The first compound microscope', 'The first camera', 'The word "cell"'], 0,
      'They stacked lenses in a tube: the first compound microscope.'], 'Janssen 1590: lenses in a tube, up to 10×.'),
    card('e-hooke', '🪵', 'Hooke, 1665', 'Robert Hooke gave cells their name.', 'c2-hooke-cork', [
      ['He built a 50× magnifier. An oil lamp and a globe lens lit up the specimen (the thing he looked at).', 'More light helps you see.'],
      ['He looked at a thin slice of cork (tree bark).', 'He saw tiny, empty, box-like chambers (rooms).'],
      ['He called them "cells" after cellae: the small rooms where monks lived and prayed.', 'The boxes looked like those little rooms.'],
    ], ['Why did Hooke call them "cells"?', ['They looked like the small rooms of monks', 'They were alive', 'They were tiny animals'], 0,
      'Cellae were the small rooms where monks lived.'], 'Hooke 1665: cork, 50×, "cells" from cellae.'),
    card('e-leeu', '🦠', 'Leeuwenhoek, 1670', 'The first person to see living cells.', 'c2-leeuwenhoek', [
      ['Antonie van Leeuwenhoek made very good lenses, up to 200×.', 'Much stronger than before.'],
      ['He looked at pond water.', 'He was the first to see living bacteria, yeast and blood cells.'],
      ['He was surprised by the swimming life. He called the cells "animalcules".', 'Animalcules = tiny animals.'],
    ], ['What did Leeuwenhoek call the tiny living things?', ['Animalcules', 'Cellae', 'Organelles'], 0,
      'Animalcules means tiny animals.'], 'Leeuwenhoek 1670: 200×, living bacteria, "animalcules".'),
    card('e-parts', '🔬', 'Parts of the microscope', 'A modern compound light microscope.', 'c2-student-microscope', [
      ['Eyepiece (ocular lens): you look through it. It magnifies, usually 10×.', 'Magnify = make bigger.'],
      ['Revolving nosepiece: holds the objective lenses. You turn it.', 'Revolving = turning.'],
      ['Objective lenses: the main magnification, 4×, 10× or 40×.', 'They are close to the slide.'],
      ['Stage and stage clips: the flat platform that holds the slide.', 'The clips keep the slide still.'],
      ['Coarse knob: focuses fast. Fine knob: focuses with precision (exactly).', 'Use coarse first, then fine.'],
      ['Light source and diaphragm: control how bright the light is.', 'The diagram also names the body tube, the condenser and the base.'],
    ], ['Which part holds the objective lenses?', ['The revolving nosepiece', 'The stage', 'The eyepiece'], 0,
      'The nosepiece turns, so you can change lens.'], 'Eyepiece 10×, objectives 4×/10×/40×, stage, knobs, light.'),
    card('e-total', '✖️', 'Total magnification', 'How many times bigger is the cell?', 'c2-student-microscope', [
      ['Total magnification = eyepiece × objective', 'You multiply the two lenses.'],
      ['10 × 4 = 40×,   10 × 10 = 100×,   10 × 40 = 400×', 'The 40× objective makes cells look biggest.'],
    ], ['Eyepiece 10×, objective 40×. Total?', ['400×', '50×', '4×'], 0, '10 × 40 = 400×. Multiply, never add.'],
    'Total = eyepiece × objective.'),
    card('e-view', '🌱', 'Plant and animal cells under the microscope', 'They look very different.', 'c2-plant-animal-view', [
      ['Plant cells: a rigid, box-like shape, like a grid.', 'Rigid = stiff.'],
      ['Plant cells: a thick cell wall, and green chloroplasts.', 'You can see the wall and the green.'],
      ['Animal cells: rounded or irregular shapes, a flexible membrane, no cell wall.', 'Irregular = not a neat shape.'],
      ['Animal cells are usually stained blue or pink to see the nucleus.', 'Stain = a colour added to the slide.'],
    ], ['Why are animal cells stained?', ['To see the nucleus', 'To keep them alive', 'To make them grow'], 0,
      'The stain makes the nucleus easy to see.'], 'Plant: boxes, wall, green. Animal: round, no wall, stained.'),
  ],
};

// ---------- Thursday: cells, stem cells and medicine (before the Stem Cell Hospital) ----------
const hospital: Lesson = {
  topic: 'hospital',
  title: 'Cells, stem cells and medicine',
  blurb: 'Every living thing is made of cells. Stem cells can become many kinds of cell.',
  cards: [
    card('h-cells', '🌳', 'All living things are made of cells', 'Living things look very different.', 'c1-living-things', [
      ['A tall eucalyptus tree, a snake, E. coli bacteria, yeast and humans look and behave very differently.', 'But they share one thing.'],
      ['Every single organism (living thing) is made of cells.', 'Cells are the building blocks of life.'],
    ], ['What do all living things have in common?', ['They are made of cells', 'They can all walk', 'They are all green'], 0,
      'Every organism is made of cells.'], 'Every living thing is made of cells.'),
    card('h-form', '📐', 'Form meets function', 'A cell\'s shape matches its job.', 'c1-cell-shapes', [
      ['Form = structure: the shape and size of a cell.', 'Skin, heart, muscle and blood cells all look different.'],
      ['Function = the job of the cell.', 'How a cell is built controls how it works.'],
      ['Specialised cells do one special job to keep the organism alive.', 'The slide shows nerve cells, blood cells, liver cells and heart muscle cells.'],
    ], ['"Function" means…', ['The job of a cell', 'The shape of a cell', 'The size of a cell'], 0, 'Function = job. Form = shape and structure.'],
    'Form = shape. Function = job. The shape fits the job.'),
    card('h-model', '📦', 'The cardboard cell model', 'Your teacher showed a 3D cardboard cell.', 'c3-animal-cell', [
      ['The outer boundary (edge) is the cell membrane.', 'It holds the cell together and controls what goes in and out.'],
      ['The control centre with the instructions is the nucleus.', 'The instructions are the DNA.'],
      ['The smaller parts inside work together as a system.', 'Each part helps the others.'],
    ], ['In the model, which part holds the instructions?', ['The nucleus', 'The membrane', 'The cytoplasm'], 0,
      'The nucleus is the control centre. It holds the DNA.'], 'Outer boundary = membrane. Control centre = nucleus.'),
    card('h-stem', '🌱', 'Stem cells', 'Stem cells are special.', 'c1-stem-cell', [
      ['Stem cells are unspecialised: "blank slates".', 'They have no special job yet.'],
      ['They can divide and make copies of themselves.', 'To divide = to split into two cells.'],
      ['Or they can differentiate (change) into many cell types.', 'For example skin, blood, nerve, muscle, fat and immune cells.'],
    ], ['What is a stem cell?', ['A cell with no special job yet, that can become many cell types', 'A cell in a plant stem', 'A dead cell'], 0,
      'Stem cells are unspecialised. They can become many kinds of cell.'], 'Stem cell = blank slate, can become many cell types.'),
    card('h-types', '3️⃣', 'Three types of stem cell', 'Learn the three names.', 'c1-stem-cell', [
      ['1. Embryonic stem cells', 'From an embryo.'],
      ['2. Adult stem cells', 'Found in the body.'],
      ['3. Artificially induced stem cells', 'Reprogrammed (changed) by scientists.'],
    ], ['Which type is reprogrammed by scientists?', ['Artificially induced', 'Embryonic', 'Adult'], 0,
      'Artificially induced stem cells are made by scientists.'], 'Embryonic, adult, artificially induced.'),
    card('h-medicine', '💊', 'How scientists use cells', 'Three ways to treat illness.', 'c1-medicine', [
      ['Cancer: targeted drugs stop cancer cells from multiplying fast.', 'Multiply = make many copies.'],
      ['Diabetes: engineered (changed) bacteria make human insulin.', 'Bacteria become tiny insulin factories.'],
      ['Tissue repair: stem cells replace damaged spinal, heart or blood tissue.', 'The stem cell therapy picture: nerve, heart, muscle, gut and liver cells.'],
    ], ['What makes human insulin for people with diabetes?', ['Engineered bacteria', 'Targeted drugs', 'Cork'], 0,
      'Engineered bacteria make human insulin.'], 'Cancer → targeted drugs. Insulin → bacteria. Repair → stem cells.'),
    card('h-diabetes', '🩺', 'Type 1 diabetes', 'When cells do not work, people get ill.', 'c3-insulin-pen', [
      ['In Type 1 diabetes, the beta-cells in the pancreas are destroyed.', 'So the body cannot make insulin.'],
      ['Doctors give daily insulin injections.', 'They put back the missing hormone and control blood glucose (sugar).'],
      ['In the future, scientists may reprogram other body cells to make insulin.', 'Then people would not need injections.'],
    ], ['Why do people with Type 1 diabetes need insulin injections?', ['Their beta-cells are destroyed, so no insulin is made', 'They eat too much', 'Their cell walls broke'], 0,
      'Destroyed beta-cells → no insulin → injections put it back.'], 'Beta-cells destroyed → no insulin → daily injections.'),
    card('h-ethics', '⚖️', 'Should we use stem cells?', 'There are two sides.', 'c1-ethics', [
      ['The promise: cure diseases that had no cure, repair organs, save lives.', 'This is why scientists are excited.'],
      ['Careful regulation: strict monitoring, safety checks and ethical guidelines.', 'New biotechnology must be safe and fair.'],
    ], ['Which is part of careful regulation?', ['Safety checks', 'Curing diseases', 'Repairing organs'], 0,
      'Safety checks are regulation. Curing and repairing are the promise.'], 'Promise + careful regulation.'),
  ],
};

export const lessons: Lesson[] = [build, factory, membrane, escape, hospital];
