// S5: comparing the three systems; how power flows.
import { cell, choice, order, sys, tableRow, withConcepts } from '../../content/build';
import type { Topic } from '../../content/types';

const GROUP = 'The three systems';
const COLS = ['Monarchy', 'Democracy', 'Dictatorship'];
const row = (id: string, feature: string, values: [string, string, string]) =>
  tableRow(id, GROUP, feature, COLS, values.map((v) => cell(v, values)));

const both = 'Monarchy describes the head-of-state position; democracy describes how power is organised. A country can be both.';
const warning = "A system does not automatically guarantee good government. Outcomes also depend on institutions, leadership, laws, accountability and respect for citizens' rights.";
const flow = 'Power flow: absolute monarchy = top down (monarch → institutions → citizens). Democracy = from the people (citizens → elections → representatives → decisions). Dictatorship = concentrated and controlled.';

export const s5: Topic = {
  id: 'S5',
  title: 'Comparing the three systems',
  short: 'Comparing systems',
  items: withConcepts([
    row('s5-t-source', 'Source of authority', ['Usually hereditary', 'The people', 'One leader or ruling group']),
    row('s5-t-gain', 'How leaders gain power', ['Inheritance', 'Free, competitive elections', 'Force, control or manipulated process']),
    row('s5-t-decides', 'Who decides', ['Monarch, elected government, or both', 'Citizens directly or via representatives', 'Ruling leader or group']),
    row('s5-t-part', 'Citizen participation', ['Depends on the type', 'Meaningful', 'Severely restricted']),
    row('s5-t-opp', 'Opposition', ['Depends on the system', 'Generally permitted', 'Usually restricted']),
    row('s5-t-account', 'Accountability', ['Depends on the constitution', 'Elections, laws, institutions', 'Often limited']),

    order('s5-flow-mon', 'Absolute monarchy: put the power flow in order, from the top down.',
      ['Monarch', 'Institutions', 'Citizens'], flow),
    order('s5-flow-dem', 'Democracy: put the power flow in order, starting from the people.',
      ['Citizens', 'Elections', 'Representatives', 'Decisions'], flow),

    sys('s5-sys-top', 'Power flows from the top down: monarch → institutions → citizens.', 'Absolute monarchy', flow),
    sys('s5-sys-people', 'Power flows from the people: citizens → elections → representatives → decisions.', 'Representative democracy', flow),
    sys('s5-sys-conc', 'Power is concentrated and controlled by one leader or ruling group.', 'Dictatorship', flow),
    sys('s5-sys-adv-cm', 'Possible advantage: stability plus democratic representation.', 'Constitutional monarchy',
      'Constitutional monarchy: stability plus democratic representation. Possible disadvantage: a hereditary head of state, which some question.'),
    sys('s5-sys-adv-am', 'Possible advantages: continuity and quick decisions. Possible disadvantages: concentrated power and little accountability.', 'Absolute monarchy',
      'Absolute monarchy: continuity and quick decisions; but concentrated power and little accountability.'),
    sys('s5-sys-adv-dic', 'Possible advantage: quick decisions without opposition. Possible disadvantages: abuse of power, repression, limited freedoms.', 'Dictatorship',
      'Dictatorship: quick decisions without opposition; but abuse of power, repression and limited freedoms.'),

    choice('s5-q-def', 'What is a "system of governance"?',
      'The way political power and authority are organised and exercised in a country',
      ['The people and institutions that govern', 'Services organised for society\'s benefit', 'Agreed instructions that guide behaviour'],
      'System of governance: the way political power and authority are organised and exercised in a country.'),
    choice('s5-q-both', 'Can a country be both a monarchy and a democracy?',
      'Yes. Monarchy describes the head-of-state position; democracy describes how power is organised',
      ['No. A country with a monarch cannot hold elections', 'No. Monarchy and democracy are opposites', 'Yes, but only if the monarch is elected'], both),
    choice('s5-q-warning', 'Does a system of governance automatically guarantee good government?',
      "No. Outcomes also depend on institutions, leadership, laws, accountability and respect for citizens' rights",
      ['Yes. Democracy always gives good government', 'Yes. The system decides everything', 'No. The system makes no difference at all'], warning),
    choice('s5-q-questions', 'Every system of governance answers the same questions. Which of these is one of them?',
      'Are leaders accountable?',
      ['How large is the country?', 'How old is the capital city?', 'Which language is spoken?'],
      'Every system answers: Who holds power? How are leaders chosen? Who makes laws? How can citizens take part? Are leaders accountable? What rights do citizens have?'),
    choice('s5-q-dem-dis', 'What are possible disadvantages of democracy?', 'Slow decisions; disagreement and division',
      ['Abuse of power and repression', 'A hereditary head of state', 'Little accountability'],
      'Democracy: participation, accountability and protected rights; but slow decisions, disagreement and division.'),
    choice('s5-q-most', 'In which system is citizen participation "meaningful"?', 'Democracy',
      ['Dictatorship', 'Absolute monarchy', 'A one-party state'],
      'Citizen participation: monarchy depends on the type; democracy meaningful; dictatorship severely restricted.'),
    choice('s5-q-cm-dis', 'What is a possible disadvantage of constitutional monarchy?',
      'The head of state is hereditary, and some question it',
      ['Opposition is not allowed', 'There are no elections', 'The media are controlled'],
      'Constitutional monarchy: stability plus democratic representation; but a hereditary head of state, which some question.'),
    // Slide 26 vocabulary and the Lesson 2 unit framework.
    choice('s5-q-opposition', 'What is "political opposition"?',
      'Parties or groups that disagree with the government and try to challenge its policies',
      ['The police and the armed forces', 'The head of state and the head of government', 'Citizens who do not vote'],
      'Political opposition means parties or groups that disagree with the government and try to change or challenge its policies. Democracies generally permit it; dictatorships usually restrict it.'),
    choice('s5-q-shape', 'Different societies organise political power in different ways. What do these arrangements shape?',
      'Who makes decisions, how leaders are selected, how citizens participate and how rights are protected',
      ['Only the name of the country', 'Only the size of the army', 'Only how much tax people pay'],
      'How a society organises power shapes who makes decisions, how leaders are selected, how citizens participate, and how individual rights are protected.'),
  ], [
    ['s5-authority-and-leaders', /^s5-t-(source|gain)$/],
    ['s5-decisions-and-participation', /^s5-(t-decides|t-part|q-most)$/],
    ['s5-opposition-and-accountability', /^s5-(t-(opp|account)|q-opposition)$/],
    ['s5-power-flow', /^s5-(flow-|sys-(top|people|conc))/],
    ['s5-big-ideas', /^s5-(q-(def|both|warning|questions|dem-dis|cm-dis|shape)|sys-adv-)/],
  ]),
};
