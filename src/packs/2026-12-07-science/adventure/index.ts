// The Biology Adventure for the science test: six game worlds, built only from the three decks
// attached to the test. Names and jobs of the parts are the slides' wording in easy English.
import type { Adventure } from '../../../content/adventure';
import { build } from './build';
import { detective } from './detective';
import { escape } from './escape';
import { factory } from './factory';
import { hospital } from './hospital';
import { membrane } from './membrane';

export const adventure: Adventure = {
  // In the order of the plan: organelles, cell as a system, microscopes, stem cells, then the two mixed worlds.
  worlds: [build, membrane, escape, hospital, factory, detective],
  parts: {
    membrane: { name: 'Cell membrane', job: 'It surrounds the cell and controls what goes in and out.' },
    cytoplasm: { name: 'Cytoplasm', job: 'A jelly-like liquid. It holds the organelles, and chemical reactions happen in it.' },
    nucleus: { name: 'Nucleus', job: 'It holds the DNA and controls the cell.' },
    nucleolus: { name: 'Nucleolus', job: 'It is inside the nucleus. It makes ribosomes.' },
    mitochondria: { name: 'Mitochondria', job: 'Respiration happens here. They make the cell\'s energy.' },
    ribosomes: { name: 'Ribosomes', job: 'They make proteins.' },
    wall: { name: 'Cell wall', job: 'A tough layer of cellulose. It gives a plant cell a stiff shape.' },
    chloroplasts: { name: 'Chloroplasts', job: 'They are green. Photosynthesis happens here.' },
    vacuole: { name: 'Large permanent vacuole', job: 'A bag of cell sap. It keeps a plant cell firm.' },
    eyepiece: { name: 'Eyepiece', job: 'You look through it. It makes the image bigger, usually 10×.' },
    nosepiece: { name: 'Revolving nosepiece', job: 'It holds the objective lenses. You turn it to change lens.' },
    objectives: { name: 'Objective lenses', job: 'They do the main magnifying: 4×, 10× or 40×.' },
    stage: { name: 'Stage', job: 'The flat platform that holds the slide.' },
    clips: { name: 'Stage clips', job: 'They hold the slide still.' },
    coarse: { name: 'Coarse knob', job: 'It focuses the image fast.' },
    fine: { name: 'Fine knob', job: 'It focuses the image slowly and exactly.' },
    light: { name: 'Light source', job: 'It gives light. The diaphragm controls how bright it is.' },
  },
};
