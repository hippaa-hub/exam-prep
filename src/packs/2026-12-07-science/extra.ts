// Extra cards (Part 2 of a mixed day): the lesson of 26 November on specialised cells, and the textbook page
// on diffusion and osmosis posted for the lesson of 3 December. These are in the same unit but NOT among the
// three files the teacher attached to the test, so they are extra and do not count in the readiness ring.
import { idea, term } from '../../content/build';
import type { TermItem } from '../../content/types';

export const extra: TermItem[] = [
  term('x-specialisation', 'Cellular specialisation',
    'A cell changes its shape and its inside tools. Then it can do one special job very well. The main idea: form follows function (the shape fits the job).', [
      idea('A cell changes its shape and inside tools', 'shape', 'tool', 'modif', 'change', 'adapt', 'built'),
      idea('To do one special job very well', 'one job', 'specific', 'perfect', 'function', 'special', 'well'),
    ]),
  term('x-red-blood', 'Red blood cell',
    'The oxygen carrier. It is shaped like a disc that is thin in the middle (biconcave). It has no nucleus. So it has more room for haemoglobin and a big surface area. It carries oxygen from the lungs to the body. It is flexible, so it fits through tiny blood vessels (capillaries).', [
      idea('Carries oxygen from the lungs to the body', 'oxygen', 'carr', 'transport', 'take'),
      idea('Biconcave, no nucleus: room for haemoglobin, big surface area', 'biconcave', 'no nucleus', 'haemoglobin', 'hemoglobin', 'surface', 'disc', 'thin'),
    ]),
  term('x-sperm', 'Sperm cell',
    'The long-distance swimmer. It has a tail like a whip (flagellum) to move fast. It has many mitochondria in the middle part for energy all the time.', [
      idea('A tail (flagellum) to swim', 'tail', 'flagell', 'swim', 'move'),
      idea('Many mitochondria for energy', 'mitochondria', 'energy', 'power'),
    ]),
  term('x-muscle', 'Muscle cell',
    'The engine. It makes force (it pulls). So it is packed with many mitochondria. A lot of energy needs a high concentration (a lot in one place) of mitochondria.', [
      idea('Makes force (contracts, pulls)', 'force', 'contract', 'move', 'pull', 'squeeze'),
      idea('Packed with mitochondria for energy', 'mitochondria', 'energy', 'power'),
    ]),
  term('x-ciliated', 'Ciliated cell',
    'The broom of the airways (the tubes to the lungs). Its cilia (tiny hairs) wave. They move mucus and dust away from the lungs, like a broom sweeping dirt away.', [
      idea('Has cilia, tiny hairs that wave', 'cilia', 'hair', 'wave', 'sweep', 'broom', 'brush'),
      idea('Moves mucus and dust away from the lungs', 'mucus', 'dust', 'particle', 'lung', 'away', 'dirt'),
    ]),
  term('x-neuron', 'Neuron (nerve cell)',
    'The fast message network. Dendrites (short branches) receive signals from other cells. The long axon carries the signals across the body.', [
      idea('Dendrites receive signals', 'dendrite', 'receive', 'get', 'branch'),
      idea('The axon carries signals across the body', 'axon', 'carr', 'send', 'signal', 'message', 'long'),
    ]),
  term('x-root-hair', 'Root hair cell',
    'The sponge. A long, finger-like part goes into the soil. This gives a very big surface area to absorb (take in) water and minerals. It has a large central vacuole and no chloroplasts.', [
      idea('Absorbs (takes in) water and minerals from the soil', 'water', 'mineral', 'absorb', 'soil', 'take in', 'soak'),
      idea('Long finger for a very big surface area; no chloroplasts', 'projection', 'finger', 'surface', 'long', 'no chloroplast', 'big area'),
    ]),
  term('x-xylem', 'Xylem vessel',
    'The strong pipes. Dead cells join into one long pipe. The pipe carries water up from the roots to the leaves. Lignin makes the walls very thick, so the pipe does not fall in.', [
      idea('Carries water up from roots to leaves', 'water', 'up', 'root', 'leaf', 'leaves', 'transport'),
      idea('Dead cells that make a pipe, made strong with lignin', 'dead', 'pipe', 'tube', 'lignin', 'thick wall', 'strong'),
    ]),
  term('x-semi-permeable', 'Semi-permeable membrane',
    'A membrane with many tiny holes, like a sieve (a kitchen strainer). Small things like water pass through freely. Big things cannot. So the cell can control what crosses.', [
      idea('Like a sieve with tiny holes', 'sieve', 'hole', 'tiny', 'strainer', 'net'),
      idea('Small things like water pass; big ones are controlled', 'water', 'small', 'large', 'big', 'pass', 'control', 'through'),
    ]),
  term('x-diffusion', 'Diffusion',
    'A substance (a chemical or gas) moves freely and spreads out evenly. It moves from a place of high concentration (a lot of it) to a place of low concentration (little of it). It stops when the concentration is equal everywhere.', [
      idea('Moves from high concentration to low concentration', 'high', 'low', 'concentrat', 'lot', 'little', 'more', 'less'),
      idea('Spreads out until it is even (equal) everywhere', 'even', 'equal', 'spread', 'same', 'everywhere'),
    ]),
  term('x-osmosis', 'Osmosis',
    'The movement of water through a semi-permeable membrane. Water moves from the side with less dissolved substance to the side with more. It stops when the two concentrations are equal.', [
      idea('Water moving through a semi-permeable membrane', 'water', 'membrane'),
      idea('From low to high concentration of the substance, until equal', 'low', 'high', 'concentrat', 'equal', 'even', 'dilute', 'more', 'less', 'same'),
    ]),
];

export const extraSimple: Record<string, string> = {
  'x-specialisation': 'A specialised cell has the shape and tools for one job.',
  'x-red-blood': 'A red blood cell is a bendy disc with no nucleus, so it is full of haemoglobin to carry oxygen.',
  'x-sperm': 'A sperm cell has a tail to swim and many mitochondria for energy.',
  'x-muscle': 'A muscle cell pulls, so it is full of mitochondria for energy.',
  'x-ciliated': 'A ciliated cell has tiny waving hairs that sweep mucus and dust away from the lungs.',
  'x-neuron': 'A neuron gets signals through its dendrites and sends them down its long axon.',
  'x-root-hair': 'A root hair cell is a long finger in the soil that takes in water and minerals.',
  'x-xylem': 'Xylem vessels are dead cells joined into a stiff pipe that carries water up the plant.',
  'x-semi-permeable': 'A semi-permeable membrane has tiny holes that let small things like water through, but not big things.',
  'x-diffusion': 'Diffusion is a substance spreading out from where there is a lot of it to where there is little, until it is even.',
  'x-osmosis': 'Osmosis is water moving through a membrane to the side with more dissolved substance, until both sides are equal.',
};

export const extraExamples: Record<string, string[]> = {
  'x-specialisation': ['One apple: jam, pie, juice', 'Form follows function'],
  'x-red-blood': ['Biconcave disc (thin in the middle)', 'No nucleus', 'Lives about 120 days'],
  'x-sperm': ['Tail = flagellum', 'Mitochondria in the middle part'],
  'x-muscle': ['Makes force (pulls)', 'Many mitochondria'],
  'x-ciliated': ['In the airways to the lungs', 'Like broom bristles'],
  'x-neuron': ['Dendrites receive', 'Axon carries', 'Myelin sheath around the axon'],
  'x-root-hair': ['Very big surface area', 'Large central vacuole', 'No chloroplasts'],
  'x-xylem': ['Dead cells', 'Lignin walls', 'Water goes up'],
  'x-semi-permeable': ['Water passes', 'Sucrose (sugar) is too big', 'Like a sieve'],
  'x-diffusion': ['Perfume spreading in a room', 'High to low concentration'],
  'x-osmosis': ['Water moves through the membrane', 'Towards the sucrose (sugar) side', 'Until equal'],
};
