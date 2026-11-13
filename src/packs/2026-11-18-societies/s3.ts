// S3: dictatorship - features; how power is gained and kept.
import { choice, pair, sys, withConcepts } from '../../content/build';
import type { Topic } from '../../content/types';

const GK: [string, string] = ['Gaining power', 'Keeping power'];
const DD: [string, string] = ['Democracy', 'Dictatorship'];
const CP: [string, string] = ['Censorship', 'Propaganda'];
const gained = 'This is a way of gaining power. Power is gained by a military coup, a revolution, manipulated elections or a political crisis.';
const kept = 'This is a way of keeping power. Power is kept by controlling the military and security forces, censorship, suppressing opposition, propaganda, and fear and intimidation.';
const features = 'This is a dictatorship. Power is concentrated, opposition is restricted, elections are absent or not really competitive, and the media are controlled.';
const cp = 'Censorship is controlling information. Propaganda is shaping public opinion in a leader\'s favour.';

export const s3: Topic = {
  id: 'S3',
  title: 'Dictatorship: how power is gained and kept',
  short: 'Dictatorship',
  items: withConcepts([
    sys('s3-sys-1', 'Power is concentrated in one leader or a small group.', 'Dictatorship', features),
    sys('s3-sys-2', 'Elections are absent, or not genuinely competitive. Opposition is restricted.', 'Dictatorship', features),
    sys('s3-sys-3', 'The media are controlled, and security forces, censorship and intimidation are used.', 'Dictatorship', features),

    pair('s3-gk-1', 'A military coup.', GK, 'Gaining power', gained),
    pair('s3-gk-2', 'A revolution.', GK, 'Gaining power', gained),
    pair('s3-gk-3', 'Manipulated elections.', GK, 'Gaining power', gained),
    pair('s3-gk-4', 'A political crisis.', GK, 'Gaining power', gained),
    pair('s3-gk-5', 'Control of the military and security forces.', GK, 'Keeping power', kept),
    pair('s3-gk-6', 'Censorship.', GK, 'Keeping power', kept),
    pair('s3-gk-7', 'Suppression of opposition.', GK, 'Keeping power', kept),
    pair('s3-gk-8', 'Propaganda.', GK, 'Keeping power', kept),
    pair('s3-gk-9', 'Fear and intimidation.', GK, 'Keeping power', kept),

    pair('s3-cp-1', 'Controlling information.', CP, 'Censorship', cp),
    pair('s3-cp-2', "Shaping public opinion in a leader's favour.", CP, 'Propaganda', cp),

    pair('s3-dd-1', 'Authority comes from the people through free elections.', DD, 'Democracy',
      'In a democracy authority comes from the people through free elections, while in a dictatorship it is concentrated in one leader or group.'),
    pair('s3-dd-2', 'Authority is concentrated in one leader or group.', DD, 'Dictatorship',
      'In a democracy authority comes from the people through free elections, while in a dictatorship it is concentrated in one leader or group.'),
    pair('s3-dd-3', 'Free expression and opposition are generally protected.', DD, 'Democracy',
      'Democracies generally protect free expression and opposition, whereas dictatorships often restrict criticism and suppress opponents.'),
    pair('s3-dd-4', 'Criticism is often restricted and opponents are suppressed.', DD, 'Dictatorship',
      'Democracies generally protect free expression and opposition, whereas dictatorships often restrict criticism and suppress opponents.'),

    choice('s3-q-change', 'In a dictatorship, what can citizens NOT really do?',
      'Change the government through free, competitive elections',
      ['Live in the country', 'Follow the laws', 'Have a head of state'],
      'Citizens have little real ability to change the government through free, competitive elections.'),
    choice('s3-q-forms', 'What are the two forms of dictatorship in the lesson?',
      'Military dictatorships and one-party authoritarian states',
      ['Absolute and constitutional', 'Direct and representative', 'Local and national'],
      'Forms: military dictatorships and one-party authoritarian states.'),
    choice('s3-q-adv', 'What is a possible advantage claimed for dictatorship?', 'Quick decisions without opposition',
      ['Leaders are accountable', 'Rights are protected', 'High citizen participation'],
      'Dictatorship: possible advantage is quick decisions without opposition.'),
    choice('s3-q-dis', 'What are possible disadvantages of dictatorship?', 'Abuse of power, repression and limited freedoms',
      ['Slow decisions and division', 'A hereditary head of state', 'Complex issues are hard for voters'],
      'Dictatorship: possible disadvantages are abuse of power, repression and limited freedoms.'),
    choice('s3-q-elections', 'A country holds elections, but only one party may stand and opposition is not allowed. Is it a genuine democracy?',
      'No. The elections are not genuinely competitive',
      ['Yes. Any election makes a democracy', 'Yes, if the country is called democratic', 'No. Democracies never hold elections'],
      'Holding elections or having "democratic" in the name does not make a country a democracy.'),
  ], [
    ['s3-gaining-power', /^s3-gk-[1-4]$/],
    ['s3-keeping-power', /^s3-(gk-[5-9]|cp-\d)$/],
    ['s3-dictatorship', /^s3-(sys-|dd-|q-)/],
  ]),
};
