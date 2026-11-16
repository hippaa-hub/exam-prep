// S2: democracy - direct vs representative; how democracy protects citizens.
import { choice, order, pair, sys, withConcepts } from '../../content/build';
import type { Topic } from '../../content/types';

const DR: [string, string] = ['Direct democracy', 'Representative democracy'];
const SL: [string, string] = ['Strength', 'Limitation'];
const protects = 'How democracy protects citizens: political participation, freedom of speech, rule of law, accountability, protection of rights.';

export const s2: Topic = {
  id: 'S2',
  title: 'Democracy: direct vs representative',
  short: 'Democracy',
  items: withConcepts([
    sys('s2-sys-1', 'Citizens vote on each issue themselves.', 'Direct democracy'),
    sys('s2-sys-2', 'Citizens elect representatives, who make the decisions.', 'Representative democracy'),
    sys('s2-sys-3', 'Its tools are referendums and popular initiatives.', 'Direct democracy'),
    sys('s2-sys-4', 'Its tools are elections and parliament.', 'Representative democracy'),

    pair('s2-dr-1', 'Practical for large populations.', DR, 'Representative democracy',
      'Representative democracy is practical for large populations, and representatives can specialise.'),
    pair('s2-dr-2', 'Direct citizen influence and high participation.', DR, 'Direct democracy'),
    pair('s2-dr-3', 'Complex issues can be hard for voters, and misinformation is a risk.', DR, 'Direct democracy',
      'Limitations of direct democracy: complex issues hard for voters; misinformation; the majority may overlook minorities.'),
    pair('s2-dr-4', 'Promises may be broken, and there is less control between elections.', DR, 'Representative democracy',
      'Limitations of representative democracy: representatives may not reflect everyone; promises may be broken; less control between elections.'),
    pair('s2-dr-5', 'The majority may overlook minorities when everyone votes on an issue.', DR, 'Direct democracy',
      'Limitations of direct democracy: complex issues hard for voters; misinformation; the majority may overlook minorities.'),
    pair('s2-dr-6', 'Example: Switzerland.', DR, 'Direct democracy', 'Switzerland is the example of direct democracy. The UK, Japan, Germany and France are representative democracies.'),
    pair('s2-dr-7', 'Examples: the UK, Japan, Germany and France.', DR, 'Representative democracy', 'Switzerland is the example of direct democracy. The UK, Japan, Germany and France are representative democracies.'),

    pair('s2-sl-1', 'Democracy: citizens can take part.', SL, 'Strength', 'Possible advantages of democracy: participation, accountability, rights protected.'),
    pair('s2-sl-2', 'Democracy: leaders are accountable.', SL, 'Strength', 'Possible advantages of democracy: participation, accountability, rights protected.'),
    pair('s2-sl-3', 'Democracy: decisions can be slow.', SL, 'Limitation', 'Possible disadvantages of democracy: slow decisions; disagreement and division.'),
    pair('s2-sl-4', 'Democracy: disagreement and division.', SL, 'Limitation', 'Possible disadvantages of democracy: slow decisions; disagreement and division.'),

    choice('s2-q-source', 'In a democracy, where does power come from?', 'The people',
      ['Inheritance', 'One leader or ruling group', 'The armed forces'],
      'Power comes from the people, who take part directly or through elected representatives.'),
    choice('s2-q-greek', '"Democracy" comes from two Greek words, demos and kratos. What do they mean?', 'People and power',
      ['King and law', 'Vote and country', 'One and rule'], 'Demos = people, kratos = power / rule.'),
    choice('s2-q-elections', 'In a democracy, elections must be…', 'free, fair and competitive',
      ['held, but with one party only', 'inherited', 'controlled by the security forces'],
      'Features of democracy: citizens participate; elections are free, fair and competitive; choice of parties; leaders are accountable; the law applies to everyone.'),
    choice('s2-q-more', 'Democracy is more than elections. What else does it need?',
      'Participation, protected rights, accountability and the rule of law',
      ['Censorship, propaganda and intimidation', 'A monarch, a palace and succession', 'Quick decisions without opposition'],
      'Democracy is more than elections: it needs participation, protected rights, accountability and the rule of law.'),
    choice('s2-q-law', 'In a democracy, who does the law apply to?', 'Everyone',
      ['Citizens, but not leaders', 'Only the opposition', 'Only people who voted'], 'The law applies to everyone.'),
    choice('s2-q-mix', 'What do most real democracies do?', 'They mix direct and representative democracy',
      ['They use only referendums', 'They never hold elections', 'They have no parliament'], 'Most real democracies mix both.'),
    choice('s2-q-protect', 'Which of these is a way democracy protects citizens?', 'Freedom of speech',
      ['Censorship', 'Propaganda', 'Intimidation'], protects),
    choice('s2-q-account', 'What does "accountability" mean?', 'Leaders must explain and answer for their actions',
      ['Leaders inherit their position', 'Leaders control the media', 'Leaders make quick decisions'],
      'Accountability: leaders must explain and answer for their actions.'),

    order('s2-process', 'Put the steps of representative democracy in order.',
      ['Citizens vote', 'Candidates are elected', 'Parliament debates', 'Laws are passed', 'Government acts'],
      'Citizens vote → candidates elected → parliament debates → laws passed → government acts.'),
  ], [
    ['s2-direct', /^s2-(sys-[13]|dr-[2356])$/],
    ['s2-representative', /^s2-(sys-[24]|dr-[147]|process)$/],
    ['s2-democracy-basics', /^s2-q-(source|greek|elections|more|law|mix)$/],
    ['s2-democracy-value', /^s2-(sl-\d|q-protect|q-account)$/],
  ]),
};
