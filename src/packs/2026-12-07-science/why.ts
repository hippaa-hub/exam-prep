// Why an answer is right, and why a wrong choice is wrong, in words a Grade 7 student can follow.
// Everything here comes from the teacher's three decks; only the sentences are kept short and plain.

/** What each answer option means. Used to explain a wrong choice that turns up in several questions. */
export const meanings: Record<string, string> = {
  // The scientists
  'Robert Hooke': 'Hooke looked at cork in 1665 and named the "cells". He did not build the first compound microscope or see living bacteria.',
  Hooke: 'Hooke looked at cork in 1665 and named the "cells". He did not see living bacteria.',
  'Antonie van Leeuwenhoek': 'Leeuwenhoek built 200× lenses around 1670 and was the first to see living bacteria. He did not make the first compound microscope.',
  Leeuwenhoek: 'Leeuwenhoek built 200× lenses around 1670 and saw living bacteria. He did not look at cork or name cells.',
  'Zacharias Janssen': 'The Janssens made the first compound microscope in 1590, at only 10×. They did not see living cells with it.',
  'Zacharias and Hans Janssen': 'The Janssens made the first compound microscope in 1590, at only 10×. They did not see living cells with it.',

  // Magnifications
  'Up to 10×': "Up to 10× was the Janssens' first compound microscope of 1590.",
  'About 50×': "About 50× was Hooke's magnifier of 1665, the one he used on cork.",
  'Up to 200×': "Up to 200× were Leeuwenhoek's lenses, strong enough to see living bacteria.",
  'About 400×': '400× is a modern compound microscope: a 10× eyepiece times a 40× objective. The early scientists had nothing that strong.',
  '4×': '4× is the weakest objective lens: with a 10× eyepiece the total is only 10 × 4 = 40×.',
  '10×': 'With the 10× objective and the 10× eyepiece the total is 10 × 10 = 100×: bigger than 40×, smaller than 400×.',
  '40×': '40× is the strongest objective lens: with a 10× eyepiece the total is 10 × 40 = 400×.',
  'Single lens': 'A single lens is one piece of curved glass, one clear pebble or one drop of water.',
  'Compound microscope': 'A compound microscope stacks several lenses inside a tube, as the Janssens did in 1590.',

  // Organelles and substances
  Nucleus: 'The nucleus contains the DNA and directs all cell activities. It is stained blue under the microscope.',
  Nucleolus: 'The nucleolus sits inside the nucleus and manufactures ribosomes.',
  Mitochondria: 'Mitochondria are the site of cellular respiration: they generate the cell\'s energy.',
  Cytoplasm: 'Cytoplasm is the jelly-like fluid that holds the organelles. Chemical reactions happen in it.',
  'Cell membrane': 'The cell membrane surrounds the cell and controls what enters and leaves.',
  'Cell wall': 'The cell wall is a tough cellulose layer around the membrane. Only plant cells have one.',
  Ribosomes: 'Ribosomes make proteins. The nucleolus manufactures them.',
  Vacuole: 'The large permanent vacuole is a sac of cell sap that keeps a plant cell firm.',
  'Large permanent vacuole': 'The large permanent vacuole is a sac of cell sap that keeps a plant cell firm.',
  Chloroplasts: 'Chloroplasts contain green chlorophyll. Photosynthesis happens in them.',
  Chlorophyll: 'Chlorophyll is the green substance inside chloroplasts, used for photosynthesis.',
  Cellulose: 'Cellulose is the tough material the plant cell wall is made of.',
  'Cell sap': 'Cell sap is the fluid inside the large permanent vacuole.',
  Cristae: 'Cristae are the deep folds of the inner membrane of a mitochondrion.',
  'Protein channels': 'Protein channels sit in the membrane and open or close to control what passes through.',
  Glucose: 'Glucose is the food fuel the cell takes in for respiration.',
  Oxygen: 'Oxygen is taken in for respiration, together with glucose.',
  'Oxygen only': 'Oxygen is for respiration. To build insulin, a protein, beta-cells need amino acids.',
  'Carbon dioxide': 'Carbon dioxide is the metabolic waste product the cell must expel.',
  Minerals: 'Minerals are something the cell needs and takes in, not a waste product.',
  Insulin: 'Insulin is the hormone made by pancreatic beta-cells. It is not part of respiration.',
  DNA: 'DNA is the genetic material. It is kept in the nucleus, not made by the nucleolus.',

  // Pairs
  'Plant cell': 'Plant cells are box-like with a thick cell wall and green chloroplasts.',
  'Animal cell': 'Animal cells are rounded or irregular, with only a flexible membrane and no cell wall. They are stained blue or pink.',
  'Plant only': 'Plant only: the cell wall, chloroplasts and the large permanent vacuole are plant-exclusive.',
  'Plant and animal': 'Plant and animal cells both have a cell membrane, cytoplasm, a nucleus and mitochondria.',
  'Taken in': 'Taken in: glucose, oxygen, water, fats and minerals come into the cell.',
  'Waste out': 'Waste out: carbon dioxide is the metabolic waste the cell must expel.',
  'Stem cell': 'A stem cell is unspecialised: it can still divide and become many cell types.',
  'Specialised cell': 'A specialised cell already has one dedicated job, like a red blood cell carrying oxygen.',
  Form: 'Form is how the cell is built: its shape and structure.',
  Function: 'Function is the job the cell does.',
  'Made of cells': 'Every living organism is made of cells, even a single bacterium.',
  'Not made of cells': 'Only things that were never alive, like a rock or glass, are not made of cells.',
  'A promise': 'A promise is a good thing stem cells could do: cure diseases, repair organs, save lives.',
  'A reason for regulation': 'Regulation means strict monitoring, safety checks and ethical guidelines for new biotechnology.',
  'In the pancreas': 'Beta-cells sit in the pancreatic islets, inside the pancreas.',
  'In the liver': 'The liver is a very active organ with many mitochondria, but insulin comes from the pancreas.',
  'The parts depend on each other': 'Interdependent means the parts need each other to do the job.',
  'Each part works alone': 'That is the opposite of interdependent. In a system the parts rely on each other.',
  'Outside the membrane': 'The cell wall surrounds the membrane, so it is the outermost layer.',
  'Inside the nucleus': 'Inside the nucleus you find DNA and the nucleolus, not the cell wall.',
};

/** Why each wrong answer is wrong, for the questions whose answers are whole sentences. */
export const whyNot: Record<string, Record<string, string>> = {
  // C1
  'c1-made-of': {
    'They all have a brain': 'A tree, yeast and bacteria have no brain. What every organism shares is cells.',
    'They are all green': 'Only plants and some microbes are green. All of them are made of cells.',
    'They can all move': 'A tree does not move about. Being made of cells is the universal truth.',
  },
  'c1-diversity': {
    'The same body shape': 'Their shapes are completely different. Their building blocks are the same: cells.',
    'The same food': 'A tree makes its own food and a snake eats mice. Cells are what they share.',
    'The same size': 'A bacterium is microscopic and a eucalyptus towers. Cells are what they share.',
  },
  'c1-ff-why': {
    'They come from different animals': 'Skin, heart, muscle and blood cells can all be in one body. Their jobs differ, so their shapes differ.',
    'They are different ages': 'Age does not change a cell\'s type. Its job decides its shape: form meets function.',
    'Some of them are plant cells': 'Skin, heart, muscle and blood cells are all animal cells. Their jobs make them different.',
  },
  'c1-coord': {
    'It has only one part': 'A cell has many parts (organelles). A system means they work together.',
    'It works alone and needs nothing': 'A cell needs energy and nutrients. Its parts work together to provide them.',
    'All its parts do the same job': 'Each organelle has its own specific task. Together they make a system.',
  },
  'c1-specialised': {
    'They can turn into any other kind of cell': 'That is a stem cell. A specialised cell already has its dedicated role.',
    'They have no job yet': 'That is a stem cell, an unspecialised blank slate. Specialised cells have a job.',
    'They only store water': 'Specialised cells do many roles: carry oxygen, send signals, contract. Not only water.',
  },
  'c1-stem-what': {
    'A cell found only in plant stems': 'Stem does not mean plant stem here. Stem cells are in animals and humans too.',
    'A cell that has already become a muscle cell': 'A muscle cell is already specialised. A stem cell has not chosen a job yet.',
    'A dead cell': 'Stem cells are very much alive: they divide and transform into other cell types.',
  },
  'c1-types': {
    'Plant, animal, bacterial': 'Those are kinds of organism, not types of stem cell.',
    'Skin, blood, nerve': 'Those are specialised cells that stem cells can become, not types of stem cell.',
    'Big, medium, small': 'Stem cells are not sorted by size. The types are embryonic, adult and artificially induced.',
  },
  'c1-induced': {
    'Embryonic stem cells': 'Embryonic stem cells come from an embryo. Nobody reprograms them.',
    'Adult stem cells': 'Adult stem cells are found naturally in the adult body. They are not reprogrammed.',
    'Red blood cells': 'A red blood cell is a specialised cell, not a stem cell at all.',
  },
  'c1-insulin': {
    'Stem cells are injected into the pancreas': 'Stem cells are used for tissue repair. Insulin is made by engineered bacteria.',
    'It is taken from plants': 'Insulin is a human protein. Engineered bacteria produce it.',
    'Targeted drugs make it': 'Targeted drugs stop cancer cells multiplying. They do not make insulin.',
  },
  'c1-repair': {
    'Hair and nails': 'The slide names spinal, heart and blood tissue, not hair or nails.',
    'Teeth only': 'The slide names spinal, heart and blood tissue. Teeth are not mentioned.',
    'None: stem cells cannot repair tissue': 'Tissue repair is one of the three uses on the slide: stem cells replace damaged tissue.',
  },
  'c1-cancer': {
    'Turn cancer cells into stem cells': 'Targeted drugs stop cancer cells multiplying. They do not turn them into anything.',
    'Make the body produce insulin': 'Insulin comes from engineered bacteria, a different use of cells.',
    'Magnify cells so doctors can see them': 'That is a microscope. Targeted drugs stop cancer cells multiplying rapidly.',
  },
  'c1-promise': {
    'Making microscopes cheaper': 'Stem cells are about medicine, not microscopes.',
    'Making plants grow faster': 'The promise is about curing diseases and repairing organs in people.',
    'Replacing all other medicines': 'Stem cells could cure some untreatable diseases. Nobody says they replace all medicine.',
  },
  'c1-regulation': {
    'Because stem cells are dangerous animals': 'Stem cells are human cells, not animals. Regulation is about safety and ethics.',
    'Because it is too cheap': 'Cost is not the reason. New biotechnology needs safety checks and ethical guidelines.',
    'Because nobody understands cells': 'Scientists understand cells well. Regulation is needed because the technology is new and powerful.',
  },

  // C2
  'c2-ancient': {
    'Mirrors and candles': 'Mirrors reflect, they do not enlarge. People used curved glass, water drops and clear pebbles.',
    Telescopes: 'Telescopes are for far-away things. Early magnifiers were curved glass and water drops.',
    'They could not': 'They could: curved glass, drops of water and clear pebbles acted as basic single lenses.',
  },
  'c2-janssen-how': {
    'They used one drop of water': 'A water drop is an ancient single lens. The Janssens stacked several lenses in a tube.',
    'They used a mirror and an oil lamp': 'The oil lamp was Hooke, in 1665. The Janssens stacked lenses in a sliding tube.',
    'They polished one tiny lens': 'Tiny high-precision lenses were Leeuwenhoek\'s. The Janssens stacked several lenses.',
  },
  'c2-hooke-what': {
    'A drop of pond water': 'Pond water was Leeuwenhoek, around 1670. Hooke examined a thin slice of cork.',
    'Blood cells': 'Blood cells were first seen by Leeuwenhoek. Hooke looked at cork.',
    'A whole leaf': 'Hooke used a thin wafer of tree bark (cork), thin enough for light to pass through.',
  },
  'c2-hooke-why': {
    'They looked like phone cells': 'There were no phones in 1665. The boxes reminded him of monks\' rooms, cellae.',
    'He named them after himself': 'He named them after cellae, the small rooms where monks lived, not after himself.',
    'The word means "tiny animals"': '"Tiny animals" is animalcules, Leeuwenhoek\'s word. Cells comes from cellae, monks\' rooms.',
  },
  'c2-leeu-name': {
    '"Cellae"': 'Cellae were the monks\' rooms that gave Hooke the word cells. Leeuwenhoek said animalcules.',
    '"Cells"': 'Cells was Hooke\'s word for the empty boxes in cork. Leeuwenhoek called living ones animalcules.',
    '"Microscopes"': 'A microscope is the instrument. The swimming cells were nicknamed animalcules.',
  },
  'c2-nosepiece': {
    'The eyepiece': 'The eyepiece is the lens you look through. The nosepiece holds and turns the objectives.',
    'The diaphragm': 'The diaphragm controls the light. The revolving nosepiece changes the objective lens.',
    'The stage clips': 'Stage clips hold the slide still. The revolving nosepiece changes the objective lens.',
  },
  'c2-diaphragm': {
    'The magnification': 'Magnification comes from the eyepiece and objective lenses, not the light.',
    'The focus': 'Focus is the coarse and fine knobs. The light source and diaphragm control brightness.',
    'How the slide is held': 'The stage clips hold the slide. The light and diaphragm control brightness.',
  },
  'c2-formula': {
    'Eyepiece + objective': 'You multiply, not add: 10× and 40× give 400×, not 50×.',
    'Objective − eyepiece': 'Magnifications multiply. 10× and 40× give 10 × 40 = 400×.',
    'Eyepiece ÷ objective': 'Magnifications multiply. 10× and 40× give 10 × 40 = 400×.',
  },
  'c2-total-40': {
    '50×': 'That is 10 + 40. Magnifications multiply: 10 × 40 = 400×.',
    '4×': 'That is 40 ÷ 10. Magnifications multiply: 10 × 40 = 400×.',
    '30×': 'That is 40 − 10. Magnifications multiply: 10 × 40 = 400×.',
  },
  'c2-total-4': {
    '14×': 'That is 10 + 4. Magnifications multiply: 10 × 4 = 40×.',
    '400×': '400× needs the 40× objective. With the 4× objective: 10 × 4 = 40×.',
    '6×': 'That is 10 − 4. Magnifications multiply: 10 × 4 = 40×.',
  },

  // C3
  'c3-system-cell': {
    'Because it is very small': 'Size has nothing to do with it. A system is parts working together.',
    'Because it has a nucleus': 'The nucleus is one part. A system is all the parts depending on each other.',
    'Because it is round': 'Shape is not the point. A system is interdependent parts with one shared function.',
  },
  'c3-beta-what': {
    'Producing glucose': 'Glucose is the fuel cells take in. Beta-cells make insulin.',
    'Carrying oxygen': 'Carrying oxygen is the job of red blood cells. Beta-cells make insulin.',
    'Making chlorophyll': 'Chlorophyll is in plant chloroplasts. Beta-cells are human cells that make insulin.',
  },
  'c3-beta-raw': {
    Cellulose: 'Cellulose is the plant cell wall material. Insulin is a protein, built from amino acids.',
    'Cell sap': 'Cell sap is in a plant vacuole. Insulin is a protein, built from amino acids.',
  },
  'c3-beta-alone': {
    'Every cell does every job': 'The opposite: each specialised cell has its own role, and together they meet the body\'s needs.',
    'Cells never touch each other': 'The slide is about working together, not about touching.',
    'Only beta-cells matter': 'Beta-cells are one example. Diverse specialised cells together fulfil the organism\'s needs.',
  },
  'c3-t1-what': {
    'The body makes too much insulin': 'It is the opposite: the beta-cells are destroyed, so no insulin is produced.',
    'The liver stops making glucose': 'Type 1 diabetes is about the pancreas and insulin, not the liver.',
    'The nucleus is destroyed': 'It is the beta-cells themselves that are destroyed, so they cannot make insulin.',
  },
  'c3-t1-therapy': {
    'Daily glucose injections': 'The problem is missing insulin, not missing glucose. Doctors prescribe insulin injections.',
    'Eating more sugar': 'Sugar would raise blood glucose further. The missing hormone, insulin, must be replaced.',
    'Removing the pancreas': 'The therapy replaces the missing insulin with daily injections.',
  },
  'c3-t1-future': {
    'Bigger insulin injections': 'The aim is to eliminate constant injections by reprogramming other cells to make insulin.',
    'A new kind of microscope': 'The research is bio-engineering: reprogramming body cells to manufacture insulin.',
    'A way to live without insulin': 'The body needs insulin. The idea is to get other cells to make it.',
  },
  'c3-t1-why': {
    'They repair the destroyed beta-cells': 'Injections do not repair cells. They replace the hormone the cells can no longer make.',
    'They feed the cells with glucose': 'Insulin is a hormone that regulates blood glucose. It is not food.',
    'They kill bacteria': 'Insulin is not a medicine against bacteria. It replaces the missing hormone.',
  },
  'c3-resp-eq': {
    'Carbon dioxide + water → glucose + oxygen': 'That is backwards. Respiration starts with glucose and oxygen.',
    'Glucose + water → oxygen + energy': 'Water is a product, not an input, and oxygen goes in, not out.',
    'Oxygen + energy → glucose + carbon dioxide': 'Energy is released at the end, not used at the start.',
  },
  'c3-resp-in': {
    'Carbon dioxide and water': 'Those come OUT of respiration, with the energy.',
    'Water and energy': 'Water and energy are products. Glucose and oxygen go in.',
    'Insulin and amino acids': 'Those belong to beta-cells making insulin, not to respiration.',
  },
  'c3-resp-out': {
    'Glucose and oxygen': 'Glucose and oxygen go IN. Out come carbon dioxide, water and energy.',
    'Only energy': 'Energy is released, but carbon dioxide and water come out too.',
  },
  'c3-needs-intake': {
    'Cell sap': 'Cell sap is inside a plant vacuole. Cells take in glucose and oxygen.',
    Chlorophyll: 'Chlorophyll is inside chloroplasts. Cells take in glucose and oxygen.',
  },

  // C4
  'c4-membrane-perm': {
    'Nothing can pass through': 'Then the cell would starve. Some chemicals pass through easily.',
    'Everything passes through': 'Then toxins would build up. Some chemicals are blocked.',
    'It is made of cellulose': 'Cellulose is the cell wall. Selectively permeable is about what passes the membrane.',
  },
  'c4-membrane-channels': {
    'Make proteins': 'Proteins are made by ribosomes. Protein channels control what passes through the membrane.',
    'Store DNA': 'DNA is stored in the nucleus. Protein channels open or close to control traffic.',
    'Give the cell a rigid shape': 'A rigid shape comes from the plant cell wall. Channels control what passes.',
  },
  'c4-membrane-balance': {
    'By making energy': 'Energy is made by mitochondria. The membrane regulates what goes in and out.',
    'By letting everything in': 'Letting everything in would cause toxic accumulation. The membrane is selective.',
    'By photosynthesis': 'Photosynthesis happens in chloroplasts. The membrane regulates molecular traffic.',
  },
  'c4-nucleolus-where': {
    'In the cell wall': 'The cell wall is the outer layer of a plant cell. The nucleolus is inside the nucleus.',
    'Outside the cell': 'The nucleolus is deep inside: inside the nucleus, inside the cell.',
    'Inside a mitochondrion': 'A mitochondrion has cristae inside, not a nucleolus. The nucleolus is inside the nucleus.',
  },
  'c4-cytoplasm-what': {
    'The tough outer layer': 'The tough outer layer is the cell wall. Cytoplasm is the jelly-like fluid inside.',
    'The control centre': 'The control centre is the nucleus. Cytoplasm is the jelly-like fluid around it.',
    'A fluid-filled sac of cell sap': 'That is the large permanent vacuole. Cytoplasm is the jelly that holds the organelles.',
  },
  'c4-mito-folds': {
    'To store DNA': 'DNA is stored in the nucleus. The folds give a vast surface area for reactions.',
    'To hold cell sap': 'Cell sap is in the vacuole. The folds give a vast surface area for reactions.',
    'To let light in': 'Light is for chloroplasts. The folds give a vast surface area for reactions.',
  },
  'c4-mito-liver': {
    'It needs to photosynthesise': 'Only plant cells photosynthesise. Liver cells need many mitochondria for energy.',
    'It has no nucleus': 'Liver cells have a nucleus. They have many mitochondria because they are highly active.',
    'It stores a lot of water': 'Water storage is a vacuole job. Mitochondria are about energy demand.',
  },
  'c4-wall-made': {
    'Protein channels': 'Protein channels are in the cell membrane. The cell wall is made of cellulose.',
  },
  'c4-chloro-job': {
    'Respiration: glucose releases energy': 'Respiration happens in mitochondria. Chloroplasts do photosynthesis.',
    'Proteins are made': 'Proteins are made by ribosomes. Chloroplasts do photosynthesis.',
    'DNA is stored': 'DNA is stored in the nucleus. Chloroplasts do photosynthesis.',
  },
  'c4-vacuole-job': {
    'Makes proteins': 'Proteins are made by ribosomes. The vacuole holds cell sap and keeps the cell firm.',
    'Controls the cell': 'The nucleus controls the cell. The vacuole holds cell sap and keeps the cell firm.',
    'Releases energy': 'Mitochondria release energy. The vacuole holds cell sap and keeps the cell firm.',
  },
};

/** One plain sentence for each thing to know. */
export const simple: Record<string, string> = {
  'c1-cells': 'Every living thing, from a bacterium to a tree to you, is built from cells.',
  'c1-form-function': 'A cell is shaped for its job: how it is built decides how it works.',
  'c1-system': 'The parts of a cell work together like a team, so the cell gets energy and what it needs.',
  'c1-stem-cell': 'A stem cell has no special job yet, so it can divide and become many kinds of cell.',
  'c1-stem-types': 'Three types: from an embryo, from an adult body, or made in a lab by reprogramming.',
  'c1-medicine': 'Cells treat illness in three ways: targeted cancer drugs, bacteria that make insulin, and stem cells that repair tissue.',
  'c1-ethics': 'Stem cells promise big cures, so they need strict rules, safety checks and ethics.',
  'c2-ancient': 'Long before microscopes, curved glass, water drops and clear pebbles worked as single lenses.',
  'c2-janssen': 'In 1590 the Janssens stacked lenses in a sliding tube: the first compound microscope, up to 10×.',
  'c2-hooke': 'In 1665 Hooke saw empty boxes in cork at 50× and named them cells after monks\' rooms, cellae.',
  'c2-leeuwenhoek': 'Around 1670 Leeuwenhoek made 200× lenses and was the first to see living cells, his animalcules.',
  'c2-parts': 'Eyepiece 10×, objectives 4×, 10×, 40× on a turning nosepiece, a stage for the slide, knobs to focus, light below.',
  'c2-magnification': 'Multiply the eyepiece by the objective: 10 × 40 = 400×.',
  'c2-plant-animal': 'Plant cells: boxes with a thick wall and green chloroplasts; animal cells: rounded, membrane only, stained blue or pink.',
  'c3-system': 'A system is a group of parts that depend on each other and work together for one job.',
  'c3-beta-cells': 'Beta-cells in the pancreas take in amino acids and build insulin; no cell works alone.',
  'c3-diabetes': 'In Type 1 diabetes the beta-cells are destroyed, so no insulin is made and injections replace it.',
  'c3-respiration': 'Glucose and oxygen go in; carbon dioxide, water and energy come out.',
  'c3-needs': 'A cell takes in glucose, oxygen, water, fats and minerals, and pushes out carbon dioxide.',
  'c4-membrane': 'The membrane is the gatekeeper: it lets some things in and out and blocks others.',
  'c4-nucleus': 'The nucleus holds the DNA and is the boss of the cell.',
  'c4-nucleolus': 'The nucleolus is inside the nucleus and makes ribosomes, which make proteins.',
  'c4-cytoplasm': 'Cytoplasm is the jelly the organelles float in, where the chemical reactions happen.',
  'c4-mitochondria': 'Mitochondria make the cell\'s energy by respiration, and their folds give more room for it.',
  'c4-wall': 'The cell wall is a tough cellulose layer outside the membrane that keeps a plant cell stiff.',
  'c4-chloroplast': 'Chloroplasts are green with chlorophyll and turn sunlight into glucose by photosynthesis.',
  'c4-vacuole': 'The big vacuole is a bag of cell sap that pushes outwards and keeps the plant cell firm.',
  'c4-found-in': 'Wall, chloroplasts and large vacuole are plant only; membrane, cytoplasm, nucleus and mitochondria are in both.',
  'c4-table': 'Each organelle has a place in the cell and one main job; the teacher\'s table lists them.',
};

/** A few short examples for each thing to know. */
export const examples: Record<string, string[]> = {
  'c1-cells': ['A eucalyptus tree', 'A snake', 'E. coli bacteria and yeast', 'Humans'],
  'c1-form-function': ['A muscle cell is long, to pull', 'A blood cell is small and round', 'Skin cells are flat'],
  'c1-system': ['Nucleus + mitochondria + membrane', 'Parts give energy and nutrients'],
  'c1-stem-cell': ['Can become a nerve cell', 'Can become a blood cell', 'Can copy itself'],
  'c1-stem-types': ['Embryonic', 'Adult', 'Artificially induced'],
  'c1-medicine': ['Targeted cancer drugs', 'Bacteria making human insulin', 'Stem cells repairing spinal tissue'],
  'c1-ethics': ['Promise: cure untreatable diseases', 'Rule: strict monitoring', 'Rule: ethical guidelines'],
  'c2-ancient': ['A drop of water', 'A curved piece of glass', 'A clear pebble'],
  'c2-janssen': ['1590', 'Lenses stacked in a sliding tube', 'Up to 10×'],
  'c2-hooke': ['1665, a slice of cork', 'About 50×', 'Cellae = monks\' rooms'],
  'c2-leeuwenhoek': ['About 1670, up to 200×', 'Bacteria, yeast, blood cells', '"Animalcules" = tiny animals'],
  'c2-parts': ['Eyepiece: usually 10×', 'Objectives: 4×, 10×, 40×', 'Coarse knob fast, fine knob precise'],
  'c2-magnification': ['10 × 4 = 40×', '10 × 10 = 100×', '10 × 40 = 400×'],
  'c2-plant-animal': ['Plant: box shape, thick wall', 'Plant: green chloroplasts', 'Animal: stained blue or pink'],
  'c3-system': ['A cell: organelles working together', 'Each organelle has its own task'],
  'c3-beta-cells': ['Beta-cells make insulin', 'They take in amino acids', 'Muscle cells use the insulin'],
  'c3-diabetes': ['Beta-cells destroyed', 'Daily insulin injections', 'Future: reprogram other cells'],
  'c3-respiration': ['In: glucose + oxygen', 'Out: carbon dioxide + water', 'Energy is released'],
  'c3-needs': ['Glucose: food fuel', 'Water: a solvent', 'Fats: for membranes', 'Carbon dioxide: waste out'],
  'c4-membrane': ['Lets nutrients in', 'Blocks toxins', 'Protein channels open and close'],
  'c4-nucleus': ['Holds the DNA', 'Directs all activities', 'Stained blue'],
  'c4-nucleolus': ['Inside the nucleus', 'Makes ribosomes', 'Ribosomes make proteins'],
  'c4-cytoplasm': ['Jelly-like fluid', 'Organelles float in it', 'Reactions happen here'],
  'c4-mitochondria': ['Site of respiration', 'Cristae = deep folds', 'Liver cell: up to 100,000'],
  'c4-wall': ['Made of cellulose', 'Outside the membrane', 'Gives a rigid shape'],
  'c4-chloroplast': ['Green chlorophyll', 'Photosynthesis', 'Sunlight to glucose'],
  'c4-vacuole': ['Full of cell sap', 'Like an inflated balloon', 'Keeps the cell firm'],
  'c4-found-in': ['Plant only: cell wall', 'Plant only: chloroplasts', 'Both: nucleus, mitochondria'],
  'c4-table': ['Nucleus: in cytoplasm, holds DNA', 'Cell wall: surrounds membrane', 'Chloroplast: photosynthesis'],
};
