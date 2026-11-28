// Extra cards (Part 2 of a mixed day): the lesson of 26 November on specialised cells, and the textbook page
// on diffusion and osmosis posted for the lesson of 3 December. These are in the same unit but NOT among the
// three files the teacher attached to the test, so they are extra and do not count in the readiness ring.
import { idea, term } from '../../content/build';
import type { TermItem } from '../../content/types';

export const extra: TermItem[] = [
  term('x-specialisation', 'Cellular specialisation',
    'Modifying shapes and internal tools to do one specific job perfectly. Core principle: form follows function.', [
      idea('A cell changes its shape and internal tools', 'shape', 'tool', 'modif', 'change', 'adapt'),
      idea('To do one specific job perfectly', 'one job', 'specific', 'perfect', 'function'),
    ]),
  term('x-red-blood', 'Red blood cell',
    'The oxygen supercarrier: a biconcave shape with no nucleus gives more room for haemoglobin and a large surface area. It carries oxygen from the lungs to the body tissues and is flexible enough to pass through capillaries.', [
      idea('Carries oxygen from the lungs to the tissues', 'oxygen', 'carr', 'transport'),
      idea('Biconcave, no nucleus: room for haemoglobin, large surface area', 'biconcave', 'no nucleus', 'haemoglobin', 'hemoglobin', 'surface'),
    ]),
  term('x-sperm', 'Sperm cell',
    'The long-distance swimmer: a whip-like tail (flagellum) for rapid movement, and many mitochondria in the midpiece for constant energy.', [
      idea('A tail (flagellum) to swim', 'tail', 'flagell', 'swim', 'move'),
      idea('Many mitochondria for energy', 'mitochondria', 'energy'),
    ]),
  term('x-muscle', 'Muscle cell',
    'The engine: it generates mechanical force, so it is packed with an increased number of mitochondria. High energy requires high mitochondrial concentration.', [
      idea('Generates force (contracts)', 'force', 'contract', 'move', 'pull'),
      idea('Packed with mitochondria for energy', 'mitochondria', 'energy'),
    ]),
  term('x-ciliated', 'Ciliated cell',
    'The cellular broom of the respiratory tract: its cilia wave mucus and particles away from the lungs, like broom bristles sweeping dirt away.', [
      idea('Has cilia, tiny hairs that wave', 'cilia', 'hair', 'wave', 'sweep', 'broom'),
      idea('Moves mucus and particles away from the lungs', 'mucus', 'dust', 'particle', 'lung', 'away'),
    ]),
  term('x-neuron', 'Neuron (nerve cell)',
    'The high-speed communication network: dendrites receive signals from neighbours, and the long axon carries the signals across the body.', [
      idea('Dendrites receive signals', 'dendrite', 'receive'),
      idea('The axon carries signals across the body', 'axon', 'carr', 'send', 'signal', 'message'),
    ]),
  term('x-root-hair', 'Root hair cell',
    'The sponge: a long, finger-like projection into the soil gives a massive surface area to absorb water and minerals. It has a large central vacuole and zero chloroplasts.', [
      idea('Absorbs water and minerals from the soil', 'water', 'mineral', 'absorb', 'soil'),
      idea('Long projection for a massive surface area; no chloroplasts', 'projection', 'finger', 'surface', 'long', 'no chloroplast'),
    ]),
  term('x-xylem', 'Xylem vessel',
    'The indestructible pipes: dead cells grouped into a continuous pipe that carries water upward from the roots to the leaves. Lignin makes the walls super-thick so the pipe does not collapse.', [
      idea('Carries water up from roots to leaves', 'water', 'up', 'root', 'leaf', 'leaves', 'transport'),
      idea('Dead cells forming a pipe, strengthened with lignin', 'dead', 'pipe', 'tube', 'lignin', 'thick wall'),
    ]),
  term('x-semi-permeable', 'Semi-permeable membrane',
    'A membrane full of tiny holes, like a sieve. Small substances such as water pass freely; larger ones cannot, so the cell can control whether they cross.', [
      idea('Like a sieve with tiny holes', 'sieve', 'hole', 'tiny'),
      idea('Small things like water pass; large ones are controlled', 'water', 'small', 'large', 'big', 'pass', 'control'),
    ]),
  term('x-diffusion', 'Diffusion',
    'When a substance is able to move freely and spread out evenly: it moves from an area of high concentration to an area of low concentration, until the concentration is equal everywhere.', [
      idea('Moves from high concentration to low concentration', 'high', 'low', 'concentrat', 'lot', 'little'),
      idea('Spreads out until it is even (equal) everywhere', 'even', 'equal', 'spread', 'same'),
    ]),
  term('x-osmosis', 'Osmosis',
    'The movement of water through a semi-permeable membrane. Water moves from where the substance is less concentrated to where it is more concentrated, until the two concentrations are equal.', [
      idea('Water moving through a semi-permeable membrane', 'water', 'membrane'),
      idea('From low to high concentration of the substance, until equal', 'low', 'high', 'concentrat', 'equal', 'even', 'dilute'),
    ]),
];

export const extraSimple: Record<string, string> = {
  'x-specialisation': 'A specialised cell is shaped and equipped for one job.',
  'x-red-blood': 'A red blood cell is a flexible disc with no nucleus, so it is full of haemoglobin to carry oxygen.',
  'x-sperm': 'A sperm cell has a tail to swim and lots of mitochondria to power it.',
  'x-muscle': 'A muscle cell pulls, so it is packed with mitochondria for energy.',
  'x-ciliated': 'A ciliated cell has tiny waving hairs that sweep mucus and dust away from the lungs.',
  'x-neuron': 'A neuron receives signals through its dendrites and sends them down its long axon.',
  'x-root-hair': 'A root hair cell is a long finger in the soil that soaks up water and minerals.',
  'x-xylem': 'Xylem vessels are dead cells joined into a stiff pipe that carries water up the plant.',
  'x-semi-permeable': 'A semi-permeable membrane lets small things like water through its tiny holes but not big things.',
  'x-diffusion': 'Diffusion is a substance spreading out from where there is a lot of it to where there is little, until even.',
  'x-osmosis': 'Osmosis is water moving through a membrane towards the side with more dissolved stuff, until both sides match.',
};

export const extraExamples: Record<string, string[]> = {
  'x-specialisation': ['One apple: jam, pie, juice', 'Form follows function'],
  'x-red-blood': ['Biconcave disc', 'No nucleus', 'Lives about 120 days'],
  'x-sperm': ['Tail = flagellum', 'Mitochondria in the midpiece'],
  'x-muscle': ['Generates mechanical force', 'Many mitochondria'],
  'x-ciliated': ['In the respiratory tract', 'Like broom bristles'],
  'x-neuron': ['Dendrites receive', 'Axon carries', 'Myelin sheath around the axon'],
  'x-root-hair': ['Massive surface area', 'Large central vacuole', 'Zero chloroplasts'],
  'x-xylem': ['Dead cells', 'Lignin walls', 'Water goes upwards'],
  'x-semi-permeable': ['Water passes', 'Sucrose is too big', 'Like a sieve'],
  'x-diffusion': ['Perfume spreading in a room', 'High to low concentration'],
  'x-osmosis': ['Water moves through the membrane', 'Towards the sucrose side', 'Until equal'],
};
