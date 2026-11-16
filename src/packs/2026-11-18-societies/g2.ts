// G2: the confusing pairs. The teacher says these lose marks.
import { choice, pair, withConcepts } from '../../content/build';
import type { Topic } from '../../content/types';

const GG: [string, string] = ['Government', 'Governance'];
const PA: [string, string] = ['Power', 'Authority'];
const RL: [string, string] = ['Rules', 'Laws'];
const HH: [string, string] = ['Head of state', 'Head of government'];

const gg = 'Government = WHO governs (people and institutions). Governance = HOW governing happens (processes, participation, accountability).';
const pa = 'Power is the ability. Authority is the right. Authority comes from laws, constitutions, traditions and accepted rules.';
const rl = 'Rules are agreed. Laws are enforced.';
const hh = 'The head of state officially represents the country. The head of government leads the government and its policies.';

export const g2: Topic = {
  id: 'G2',
  title: 'The confusing pairs',
  short: 'Confusing pairs',
  items: withConcepts([
    pair('g2-gg-1', 'The people and institutions responsible for making decisions and setting policies.', GG, 'Government', gg),
    pair('g2-gg-2', 'The process and system through which decisions are made and public affairs are managed.', GG, 'Governance', gg),
    pair('g2-gg-3', 'WHO governs.', GG, 'Government', gg),
    pair('g2-gg-4', 'HOW governing happens.', GG, 'Governance', gg),
    pair('g2-gg-5', 'It decides to improve education.', GG, 'Government',
      'A government decides to improve education. Governance is how the decision was made, who took part, how money was shared out and how it was carried out.'),
    pair('g2-gg-6', 'How the decision was made, who took part and how the money was shared out.', GG, 'Governance',
      'A government decides to improve education. Governance is how the decision was made, who took part, how money was shared out and how it was carried out.'),
    pair('g2-gg-7', 'Processes, participation and accountability.', GG, 'Governance', gg),

    pair('g2-pa-1', 'The ability to influence people, decisions or actions.', PA, 'Power', pa),
    pair('g2-pa-2', 'The recognised, accepted right to make decisions and give instructions.', PA, 'Authority', pa),
    pair('g2-pa-3', 'What a judge has in a courtroom, whether or not people agree.', PA, 'Authority',
      'A judge has legal authority in a courtroom whether or not people agree.'),
    pair('g2-pa-4', 'It comes from laws, constitutions, traditions and accepted rules.', PA, 'Authority', pa),
    pair('g2-pa-5', 'Someone can have this without having any legal right to it.', PA, 'Power',
      'Someone can have power without legal authority.'),
    pair('g2-pa-6', 'The ability, not the right.', PA, 'Power', pa),

    pair('g2-rl-1', 'Agreed instructions that guide behaviour in a group.', RL, 'Rules', rl),
    pair('g2-rl-2', 'Official, and enforced by a recognised authority.', RL, 'Laws', rl),
    pair('g2-rl-3', 'They are agreed.', RL, 'Rules', rl),
    pair('g2-rl-4', 'They are enforced.', RL, 'Laws', rl),
    pair('g2-rl-5', 'A class agrees how to behave in its own classroom.', RL, 'Rules',
      'Rules are agreed inside a group, such as a classroom. Laws are enforced for a whole nation.'),
    pair('g2-rl-6', 'They apply to the whole nation, and courts deal with people who break them.', RL, 'Laws',
      'Laws are official rules established and enforced by a recognised authority.'),

    pair('g2-hh-1', 'Officially represents the country.', HH, 'Head of state', hh),
    pair('g2-hh-2', 'Leads the government and its policies.', HH, 'Head of government', hh),
    pair('g2-hh-3', 'King Charles III in the United Kingdom.', HH, 'Head of state',
      'In the UK the King is the ceremonial head of state. The Prime Minister is head of government.'),
    pair('g2-hh-4', 'The Prime Minister of Japan.', HH, 'Head of government',
      "In Japan the Emperor is head of state (a symbol of the state). The Prime Minister is head of government."),
    pair('g2-hh-5', 'The Emperor of Japan, the symbol of the state.', HH, 'Head of state',
      'The Emperor is the symbol of the state and has no governing power.'),
    pair('g2-hh-6', 'Usually a prime minister or a president.', HH, 'Head of government', hh),
    pair('g2-hh-7', 'In a monarchy, this is the monarch.', HH, 'Head of state',
      'A monarch (king, queen or emperor) is head of state.'),
    // Slide 13: power is the ability, whoever has the right; a judge's authority does not depend on agreement.
    choice('g2-pa-q-judge', 'A judge has legal authority to decide cases. Does that depend on whether people personally agree with the judge?',
      'No. The authority comes from the law, whether or not anyone agrees',
      ['Yes. A judge only has authority when everyone agrees', 'Yes. People can cancel the decision by disagreeing', 'No. A judge has power, not authority'],
      'A judge has legal authority to decide cases in a courtroom, whether or not anyone personally agrees.'),
    choice('g2-pa-q-fear', 'Someone influences a group because the others respect their knowledge, or fear them. What do they have?',
      'Power: the ability to influence, which is not the same as authority',
      ['Authority: the recognised right to decide', 'Both power and authority, always', 'Neither power nor authority'],
      'Power is the ability to influence people. It can come from respect or fear, with no legal right at all.'),
    // Slide 11: three levels of shared rules.
    choice('g2-rl-q-levels', 'Shared rules exist at three levels. Which three does the lesson give?',
      'Classroom, community and nation',
      ['Family, school and world', 'Village, city and continent', 'Local, national and international'],
      'Classroom rules help students learn safely; community rules help people live together; national laws regulate behaviour across a whole country.'),
  ], [
    ['g2-government-governance', /^g2-gg-/],
    ['g2-power-authority', /^g2-pa-/],
    ['g2-rules-laws', /^g2-rl-/],
    ['g2-head-of-state-government', /^g2-hh-/],
  ]),
};
