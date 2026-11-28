// World 4: Stem Cell Hospital. From "Cells: The Building Blocks of Life" (stem cells, medicine, ethics)
// and the Type 1 diabetes slide of "A Cell is a System".
import type { World } from '../../../content/adventure';

const TREAT_WHY_NOT = {
  'Targeted drugs': 'Targeted drugs stop cancer cells multiplying. They do not repair tissue.',
  'Engineered bacteria that make insulin': 'Engineered bacteria make insulin for diabetes. They do not repair tissue.',
};

export const hospital: World = {
  id: 'hospital',
  title: 'Stem Cell Hospital',
  emoji: '🏥',
  img: 'w-hospital',
  colour: '#1899d6',
  badge: 'Cell Doctor',
  story: 'Welcome to the Stem Cell Hospital. Patients need your help. Use what you know about cells to choose the right treatment.',
  levels: [
    {
      stage: 1, title: 'Your training',
      intro: 'Every doctor starts with training. What is a stem cell?',
      challenges: [
        {
          id: 'sort-stem', kind: 'sort', concept: 'c1-stem-cell', photo: 'c1-stem-cell',
          bins: ['Stem cell', 'Specialised cell'],
          cards: [
            { text: 'Has no special job yet', bin: 'Stem cell', why: 'Stem cells are unspecialised: "blank slates".' },
            { text: 'Can divide and copy itself', bin: 'Stem cell', why: 'A stem cell can divide (replicate itself).' },
            { text: 'Can become many types of cell', bin: 'Stem cell', why: 'A stem cell can differentiate (change) into many cell types.' },
            { text: 'A nerve cell', bin: 'Specialised cell', why: 'A nerve cell already has its own job.' },
            { text: 'A muscle cell', bin: 'Specialised cell', why: 'A muscle cell already has its own job.' },
            { text: 'A blood cell', bin: 'Specialised cell', why: 'A blood cell already has its own job.' },
          ],
          prompt: 'Is it a stem cell, or a specialised cell (a cell with one job)?',
          hint: 'A stem cell is a "blank slate": no job yet.',
          why: 'Stem cells have no special job yet. They can divide and change into nerve, blood, muscle and other cells.',
        },
        {
          id: 'match-types', kind: 'match', concept: 'c1-stem-types',
          pairs: [
            ['Embryonic stem cells', 'From an embryo'],
            ['Adult stem cells', 'Found in the adult body'],
            ['Artificially induced stem cells', 'Reprogrammed (changed) by scientists'],
          ],
          prompt: 'Match each type of stem cell to where it comes from.',
          hint: '"Artificially" means made by people.',
          why: 'Three types: embryonic, adult, and artificially induced (reprogrammed by scientists).',
        },
        {
          id: 'clue-stem', kind: 'clues', concept: 'c1-stem-cell',
          clues: ['I am a cell.', 'I have no special job yet.', 'I can make copies of myself.', 'I can turn into a nerve cell, a blood cell or a muscle cell.'],
          options: ['A stem cell', 'A nerve cell', 'A muscle cell'],
          answer: 'A stem cell',
          whyNot: {
            'A nerve cell': 'A nerve cell already has a job. It cannot turn into other cells.',
            'A muscle cell': 'A muscle cell already has a job. It cannot turn into other cells.',
          },
          prompt: 'Who am I?',
          hint: 'Which cell is a "blank slate"?',
          why: 'Stem cells are unspecialised. They can divide and become many cell types.',
        },
      ],
    },
    {
      stage: 2, title: 'Patients arrive',
      intro: 'Your first patients are here. Read each story. Choose the treatment from your lesson.',
      challenges: [
        {
          id: 'leo', kind: 'pick', concept: 'c1-medicine', photo: 'p-spine',
          story: 'Leo hurt his spine in an accident. The tissue in his spine is damaged.',
          prompt: 'Which treatment from your lesson can help Leo?',
          options: ['Stem cells that replace the damaged tissue', 'Targeted drugs', 'Engineered bacteria that make insulin'],
          answer: 'Stem cells that replace the damaged tissue',
          whyNot: TREAT_WHY_NOT,
          hint: 'Which cells can turn into new tissue?',
          why: 'Stem cells can be guided to replace damaged spinal, heart or blood tissue.',
        },
        {
          id: 'mia', kind: 'pick', concept: 'c3-diabetes', photo: 'p-diabetes',
          story: 'Mia has Type 1 diabetes. The beta-cells in her pancreas are destroyed.',
          prompt: 'What can her body not make?',
          options: ['Insulin', 'Glucose', 'Oxygen', 'DNA'],
          answer: 'Insulin',
          whyNot: {
            Glucose: 'Glucose comes from food. Beta-cells make insulin.',
            Oxygen: 'Oxygen comes from the air we breathe. Beta-cells make insulin.',
            DNA: 'DNA is in every nucleus. It is not the problem here.',
          },
          hint: 'What do beta-cells make?',
          why: 'Beta-cells make insulin. In Type 1 diabetes they are destroyed, so no insulin is made.',
        },
        {
          id: 'mia-order', kind: 'order', concept: 'c3-diabetes', photo: 'p-diabetes',
          steps: ['Mia\'s beta-cells are destroyed', 'Her body makes no insulin', 'Her blood glucose is not controlled', 'Doctors give her daily insulin injections'],
          prompt: 'Put Mia\'s story in order: what goes wrong, and what doctors do.',
          hint: 'Start with the cells. End with the treatment.',
          why: 'Beta-cells destroyed → no insulin → blood glucose not controlled → daily insulin injections put the hormone back.',
        },
        {
          id: 'novak', kind: 'pick', concept: 'c1-medicine', photo: 'p-cancer',
          story: 'Mr Novak has cancer. Some of his cells multiply (make copies) very fast.',
          prompt: 'Which treatment fits?',
          options: ['Targeted drugs that stop the cancer cells multiplying', 'Engineered bacteria that make insulin', 'Daily insulin injections'],
          answer: 'Targeted drugs that stop the cancer cells multiplying',
          whyNot: {
            'Engineered bacteria that make insulin': 'Insulin is for diabetes, not cancer.',
            'Daily insulin injections': 'Insulin injections are for Type 1 diabetes, not cancer.',
          },
          hint: 'The problem is cells that multiply too fast.',
          why: 'Targeted drugs are designed to stop specific cancer cells from multiplying fast.',
        },
        {
          id: 'sort-treat', kind: 'sort', concept: 'c1-medicine',
          bins: ['Stem cells', 'Engineered bacteria', 'Targeted drugs'],
          cards: [
            { text: 'Damaged heart tissue', bin: 'Stem cells', why: 'Stem cells can replace damaged heart tissue.' },
            { text: 'Damaged blood tissue', bin: 'Stem cells', why: 'Stem cells can replace damaged blood tissue.' },
            { text: 'Needs human insulin', bin: 'Engineered bacteria', why: 'Engineered bacteria make human insulin.' },
            { text: 'Cancer cells multiply fast', bin: 'Targeted drugs', why: 'Targeted drugs stop cancer cells multiplying.' },
          ],
          prompt: 'Send each patient to the right treatment.',
          hint: 'Repair → stem cells. Insulin → bacteria. Cancer → drugs.',
          why: 'Stem cells repair tissue, engineered bacteria make insulin, and targeted drugs fight cancer cells.',
        },
      ],
    },
    {
      stage: 3, title: 'Big decisions',
      intro: 'A good doctor also thinks about what is right. These are harder cases.',
      challenges: [
        {
          id: 'silva', kind: 'pick', concept: 'c1-ethics', photo: 'p-heart',
          story: 'Mr Silva\'s heart tissue is damaged. Scientists want to try a new stem cell treatment on him.',
          prompt: 'What must happen first?',
          options: ['Strict safety checks and ethical guidelines', 'Nothing: new treatments are always safe', 'Give him insulin first', 'Stop all research'],
          answer: 'Strict safety checks and ethical guidelines',
          whyNot: {
            'Nothing: new treatments are always safe': 'New biotechnology needs strict monitoring and safety checks.',
            'Give him insulin first': 'Insulin is for diabetes. It does not help heart tissue.',
            'Stop all research': 'Stem cells could save lives. The lesson says: use them, with careful regulation.',
          },
          hint: 'Think of the slide "Careful regulation".',
          why: 'New biotechnology needs careful regulation: strict monitoring, safety checks and ethical guidelines.',
        },
        {
          id: 'sort-ethics', kind: 'sort', concept: 'c1-ethics',
          bins: ['A promise', 'Careful regulation'],
          cards: [
            { text: 'Cure diseases that had no cure', bin: 'A promise', why: 'This is one of the big promises of stem cells.' },
            { text: 'Repair organs', bin: 'A promise', why: 'Repairing organs is a big promise.' },
            { text: 'Save human lives', bin: 'A promise', why: 'Saving lives is a big promise.' },
            { text: 'Strict monitoring', bin: 'Careful regulation', why: 'Monitoring is part of careful regulation.' },
            { text: 'Safety checks', bin: 'Careful regulation', why: 'Safety checks are part of careful regulation.' },
            { text: 'Ethical guidelines', bin: 'Careful regulation', why: 'Ethical guidelines (rules about right and wrong) are part of regulation.' },
          ],
          prompt: 'Stem cells: a promise, or part of careful regulation?',
          hint: 'Promises are good results. Regulation is rules and checks.',
          why: 'Promises: cures, repaired organs, saved lives. Regulation: monitoring, safety checks, ethical guidelines.',
        },
        {
          id: 'clue-type', kind: 'clues', concept: 'c1-stem-types', photo: 'p-blood',
          story: 'Ana needs new blood tissue. The lab made stem cells for her.',
          clues: ['They are stem cells.', 'They were NOT taken from an embryo.', 'They started as ordinary body cells.', 'Scientists reprogrammed (changed) them in the lab.'],
          options: ['Artificially induced stem cells', 'Embryonic stem cells', 'Adult stem cells'],
          answer: 'Artificially induced stem cells',
          whyNot: {
            'Embryonic stem cells': 'The clues say they were not taken from an embryo.',
            'Adult stem cells': 'Adult stem cells are found in the body. These were reprogrammed by scientists.',
          },
          prompt: 'Which type of stem cell did the lab make?',
          hint: 'Which type is "reprogrammed by scientists"?',
          why: 'Artificially induced stem cells are reprogrammed by scientists.',
        },
        {
          id: 'spot-bot', kind: 'spot', concept: 'c1-stem-types', author: 'Dr Bot',
          lines: ['Stem cells are unspecialised.', 'They can divide.', 'They can turn into many cell types.', 'There are only two types: embryonic and adult.'],
          wrong: 3,
          fix: 'There are three types: embryonic, adult and artificially induced.',
          fixes: ['There are three types: embryonic, adult and artificially induced.', 'There is only one type: embryonic.', 'There are three types: plant, animal and adult.'],
          prompt: 'The robot doctor made a mistake in its notes. Find it.',
          hint: 'Count the types of stem cell from your lesson.',
          why: 'There are three main types: embryonic, adult and artificially induced.',
        },
      ],
    },
  ],
};
