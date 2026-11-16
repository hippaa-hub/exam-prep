// S1: monarchy - absolute vs constitutional.
import { choice, pair, sys, withConcepts } from '../../content/build';
import type { Topic } from '../../content/types';

const AC: [string, string] = ['Absolute monarchy', 'Constitutional monarchy'];
const key = 'The difference is not whether there is a king or queen, but how much political power the monarch holds.';

export const s1: Topic = {
  id: 'S1',
  title: 'Monarchy: absolute vs constitutional',
  short: 'Monarchy',
  items: withConcepts([
    sys('s1-sys-1', 'The monarch holds extensive political power, and parliament is absent or limited.', 'Absolute monarchy', key),
    sys('s1-sys-2', "The monarch is head of state, but the monarch's power is limited by a constitution and laws.", 'Constitutional monarchy', key),
    sys('s1-sys-3', 'A monarch inherits the throne, and parliament has an important law-making role.', 'Constitutional monarchy',
      'In a constitutional monarchy parliament has an important law-making role and citizens take part through democratic institutions.'),
    sys('s1-sys-4', 'Power is inherited and held by one ruler. Citizen participation is generally limited.', 'Absolute monarchy',
      'In an absolute monarchy the monarch holds extensive power and citizen participation is generally limited.'),

    pair('s1-ac-1', 'Political power is extensive and held by the monarch.', AC, 'Absolute monarchy', key),
    pair('s1-ac-2', 'Political power is limited by a constitution and laws.', AC, 'Constitutional monarchy', key),
    pair('s1-ac-3', 'Parliament is absent or limited.', AC, 'Absolute monarchy'),
    pair('s1-ac-4', 'Citizens take part through democratic institutions.', AC, 'Constitutional monarchy'),
    pair('s1-ac-5', 'Example: Saudi Arabia.', AC, 'Absolute monarchy', 'Saudi Arabia is an absolute monarchy. The UK and Japan are constitutional monarchies.'),
    pair('s1-ac-6', 'Examples: the United Kingdom and Japan.', AC, 'Constitutional monarchy', 'Saudi Arabia is an absolute monarchy. The UK and Japan are constitutional monarchies.'),

    choice('s1-q-inherit', 'How does a monarch usually obtain the position?', 'By inheritance',
      ['By a free, competitive election', 'By a referendum', 'By a popular initiative'],
      'The position is usually inherited and held for life or until abdication. Succession follows royal rules.'),
    choice('s1-q-howlong', 'How long does a monarch usually hold the position?', 'For life, or until abdication',
      ['Until the next general election', 'For one year', 'Until parliament debates it'],
      'The position is usually inherited and held for life or until abdication.'),
    choice('s1-q-same', 'What is the same in an absolute and a constitutional monarchy?',
      'The monarch is head of state, usually by inheritance',
      ['The monarch holds all political power', 'Parliament makes the laws', 'Citizens vote on every issue'],
      'In both, the monarch is head of state and power is usually obtained by inheritance.'),
    choice('s1-q-key', 'What is the key difference between an absolute and a constitutional monarchy?',
      'How much political power the monarch holds',
      ['Whether there is a king or queen', 'Whether the position is inherited', 'Whether the country has a head of state'], key),
    choice('s1-q-adv', 'Which advantages are claimed for absolute monarchy?', 'Quick decisions and continuity',
      ['Accountability and participation', 'Free elections and a choice of parties', 'Protected rights and free speech'],
      'Absolute monarchy: claimed advantages are quick decisions and continuity.'),
    choice('s1-q-dis', 'Which are disadvantages of absolute monarchy?',
      'Power in one ruler, little accountability, abuse hard to challenge',
      ['Slow decisions and division', 'Broken election promises', 'Complex issues are hard for voters'],
      'Absolute monarchy: disadvantages are power in one ruler, little accountability, abuse hard to challenge.'),
    choice('s1-q-king', 'Finish the teacher\'s sentence: "Having a king does not mean…"',
      '…the king controls the government',
      ['…the country has a head of state', '…the position is inherited', '…the country is a monarchy'],
      '"Having a king does not mean the king controls the government."'),
    // Slide 7: succession; slide 8: what an absolute monarch may control.
    choice('s1-q-succession', 'In a monarchy, who becomes the next monarch?',
      'Succession follows established royal rules',
      ['Citizens elect the next monarch', 'The prime minister chooses the next monarch', 'The strongest member of the family takes over'],
      'The position is inherited, and succession follows established royal rules.'),
    choice('s1-q-control', 'Which of these is a characteristic of an absolute monarchy?',
      'The monarch may control the government and the armed forces',
      ['Parliament checks the monarch', 'Citizens elect the monarch', 'The monarch has only ceremonial duties'],
      'In an absolute monarchy political power is concentrated in the monarch, who may control the government and the armed forces.'),
  ], [
    ['s1-absolute', /^s1-(sys-[14]|ac-[135]|q-adv|q-dis|q-control)$/],
    ['s1-constitutional', /^s1-(sys-[23]|ac-[246])$/],
    ['s1-monarchy-basics', /^s1-q-(inherit|howlong|same|key|king|succession)$/],
  ]),
};
