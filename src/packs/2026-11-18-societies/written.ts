// Questions answered in full sentences, as in the test (Criterion A).
// They follow the teacher's exit tickets and revision list. Each one belongs to a thing to know,
// so it turns up in the daily rounds as one more wording of that thing.
import { idea, short } from '../../content/build';
import type { ShortItem } from '../../content/types';

export const written: Record<string, ShortItem[]> = {
  G1: [
    short('w-government', 'g1-government', 'Define government in your own words.', [
      idea('It is the people and institutions', 'people', 'institutions'),
      idea('They make decisions, set policies and govern', 'decisions', 'decide', 'policies', 'govern', 'rule', 'run'),
    ], 'Government is the people and institutions responsible for making decisions, setting policies and governing a country or community.'),
  ],
  G2: [
    short('w-gov-governance', 'g2-government-governance', 'Explain the difference between government and governance.', [
      idea('Government is WHO governs: the people and institutions', 'people', 'institutions', 'who'),
      idea('Governance is HOW governing happens: the process and system', 'process', 'how', 'system', 'way'),
    ], 'Government is the people and institutions that govern: it is WHO governs. Governance is the process and system through which decisions are made, power is exercised and public affairs are managed: it is HOW governing happens.'),
    short('w-power-authority', 'g2-power-authority', 'What is the difference between power and authority?', [
      idea('Power is the ability to influence people, decisions or actions', 'ability', 'able', 'influence'),
      idea('Authority is the recognised, accepted right to decide', 'right', 'recognised', 'accepted', 'legal'),
    ], 'Power is the ability to influence people, decisions or actions. Authority is the recognised, accepted right to make decisions and give instructions. Someone can have power without legal authority.'),
    short('w-rules-laws', 'g2-rules-laws', 'What is the difference between rules and laws?', [
      idea('Rules are agreed instructions inside a group', 'agreed', 'agree', 'group'),
      idea('Laws are official, and enforced by a recognised authority', 'enforced', 'enforce', 'official', 'authority'),
    ], 'Rules are agreed instructions that guide behaviour in a group. Laws are official rules established and enforced by a recognised authority. Rules are agreed; laws are enforced.'),
    short('w-heads', 'g2-head-of-state-government', 'What is the difference between a head of state and a head of government? Use the United Kingdom as your example.', [
      idea('The head of state officially represents the country', 'represents', 'represent', 'ceremonial', 'symbol'),
      idea('The head of government leads the government and its policies', 'leads', 'lead', 'policies', 'runs'),
      idea('In the UK: the King is head of state, the Prime Minister is head of government', 'king', 'charles', 'prime minister'),
    ], 'The head of state officially represents the country. The head of government leads the government and its policies. In the United Kingdom, King Charles III is the ceremonial head of state and the Prime Minister is the head of government.'),
  ],
  G3: [
    short('w-why-government', 'g3-why-government', 'Explain three reasons why societies need governments.', [
      idea('People have different needs and opinions, so they need a system to make collective decisions', 'decisions', 'opinions', 'different needs', 'collective'),
      idea('Laws maintain public order and protect citizens', 'order', 'protect', 'laws', 'safe'),
      idea('Governments provide services such as education, healthcare and transport', 'services', 'education', 'healthcare', 'schools', 'hospitals', 'transport'),
    ], 'Societies need governments because people have different needs, interests and opinions, and they need an organised system to make collective decisions. Governments establish and enforce laws to maintain public order and protect citizens. They also provide services such as education, healthcare and transport. Without effective governance it is harder to resolve conflicts, protect rights and organise shared resources.'),
    short('w-no-government', 'g3-why-government', 'Can a society function successfully without a government? Explain your opinion using at least two reasons.', [
      idea('People have different needs and opinions, so they need an organised way to make collective decisions', 'decisions', 'decide', 'opinions', 'different', 'collective', 'organised'),
      idea('Without laws it is harder to keep order, protect rights and resolve conflicts', 'order', 'protect', 'laws', 'safe', 'conflict', 'rights'),
      idea('Without a government, services such as schools and hospitals are not organised', 'services', 'schools', 'hospitals', 'education', 'healthcare', 'roads'),
    ], 'In my opinion a society cannot function successfully without a government. First, people have different needs, interests and opinions, so they need an organised system to make collective decisions. Second, without laws it becomes harder to maintain public order, protect rights and resolve conflicts. Third, nobody would organise public services such as schools, hospitals and roads.', 2),
    short('w-institution', 'g3-institutions', 'Give one example of a government institution and explain its function.', [
      idea('I named an institution (parliament, courts, police, local government)', 'parliament', 'court', 'police', 'local government', 'council'),
      idea('I explained what it does', 'laws', 'disputes', 'enforce', 'safe', 'services', 'debates', 'passes', 'interpret'),
    ], 'Parliament debates and passes laws. Courts interpret laws and resolve disputes. The police enforce laws and keep people safe. Local government provides local services.'),
  ],
  G4: [
    short('w-four', 'g4-all-four', 'Identify the four main responsibilities of governments.', [
      idea('Maintaining public order', 'order'),
      idea('Protecting citizens', 'protect', 'protecting', 'protection'),
      idea('Providing public services', 'services'),
      idea('Enforcing laws', 'enforce', 'enforcing', 'enforcement'),
    ], 'The four main responsibilities are: maintaining public order, protecting citizens, providing public services, and enforcing laws.'),
  ],
  S1: [
    short('w-monarchy', 's1-monarchy-basics', 'Define monarchy.', [
      idea('A monarch (king, queen or emperor) is head of state', 'monarch', 'king', 'queen', 'emperor', 'head of state'),
      idea('The position is usually inherited', 'inherited', 'inherit', 'inheritance', 'hereditary', 'family'),
    ], 'In a monarchy a monarch (a king, queen or emperor) is head of state. The position is usually inherited and held for life or until abdication.'),
    short('w-abs-const', 's1-monarchy-basics', 'Explain the difference between an absolute and a constitutional monarchy. Give a country example of each.', [
      idea('Absolute: the monarch holds extensive political power', 'extensive', 'all the power', 'full power', 'total power', 'most power', 'holds the power'),
      idea("Constitutional: the monarch's power is limited by a constitution and laws", 'limited', 'constitution', 'limit'),
      idea('Examples: Saudi Arabia (absolute); the UK or Japan (constitutional)', 'saudi', 'uk', 'united kingdom', 'britain', 'japan'),
    ], "In an absolute monarchy the monarch holds extensive political power and parliament is absent or limited, for example Saudi Arabia. In a constitutional monarchy the monarch's power is limited by a constitution and laws, and parliament has an important law-making role, for example the United Kingdom and Japan. The difference is how much political power the monarch holds."),
  ],
  S2: [
    short('w-democracy', 's2-democracy-basics', 'Define democracy.', [
      idea('Power comes from the people', 'people', 'citizens'),
      idea('They take part directly or through elected representatives', 'elect', 'elections', 'representatives', 'vote', 'directly'),
    ], 'In a democracy power comes from the people, who take part directly or through elected representatives.'),
    short('w-direct-rep', 's2-democracy-basics', 'Explain the difference between direct and representative democracy. Give a country example.', [
      idea('Direct: citizens vote on each issue themselves', 'referendum', 'each issue', 'themselves', 'directly'),
      idea('Representative: citizens elect representatives who decide', 'elect', 'representatives', 'parliament'),
      idea('An example: Switzerland (direct), or the UK, Japan, Germany or France (representative)', 'switzerland', 'swiss', 'uk', 'united kingdom', 'japan', 'germany', 'france'),
    ], 'In a direct democracy citizens vote on each issue themselves, using referendums and popular initiatives, as in Switzerland. In a representative democracy citizens elect representatives who make the decisions in parliament, as in the UK, Japan, Germany and France. Most real democracies mix both.'),
    short('w-protects', 's2-democracy-value', 'Explain two ways democracy protects citizens.', [
      idea('Political participation', 'participation', 'participate', 'vote', 'take part'),
      idea('Freedom of speech', 'speech', 'expression'),
      idea('The rule of law', 'rule of law', 'law applies'),
      idea('Accountability', 'accountability', 'accountable', 'answer for'),
      idea('Protection of rights', 'rights'),
    ], 'Democracy protects citizens through political participation, freedom of speech, the rule of law, accountability and the protection of rights.', 2),
  ],
  S3: [
    short('w-dictatorship', 's3-dictatorship', 'Define dictatorship.', [
      idea('Power is concentrated in one leader or a small group', 'concentrated', 'one leader', 'small group', 'one person', 'single'),
      idea('Citizens cannot really change the government through free, competitive elections', 'elections', 'vote', 'change the government', 'opposition'),
    ], 'In a dictatorship power is concentrated in one leader or a small group, and citizens have little real ability to change the government through free, competitive elections.'),
    short('w-dem-dict', 's3-dictatorship', 'Explain two differences between democracy and dictatorship.', [
      idea('How power is distributed: from the people through free elections, or concentrated in one leader or group', 'elections', 'people', 'concentrated', 'one leader'),
      idea('Political freedom: free expression and opposition protected, or criticism restricted', 'freedom', 'expression', 'speech', 'opposition', 'criticism', 'restrict', 'suppress'),
    ], 'One difference is how power is distributed: in a democracy authority comes from the people through free elections, while in a dictatorship it is concentrated in one leader or group. Another is political freedom: democracies generally protect free expression and opposition, whereas dictatorships often restrict criticism and suppress opponents.'),
    short('w-gain', 's3-gaining-power', 'Explain two ways a leader can gain power in a dictatorship.', [
      idea('A military coup', 'coup', 'military'),
      idea('A revolution', 'revolution'),
      idea('Manipulated elections', 'manipulated', 'rigged', 'elections'),
      idea('A political crisis', 'crisis'),
    ], 'Power can be gained through a military coup, a revolution, manipulated elections or a political crisis.', 2),
    short('w-keep', 's3-keeping-power', 'Explain three ways a dictatorship keeps power.', [
      idea('Control of the military and security forces', 'military', 'security', 'army'),
      idea('Censorship', 'censorship', 'censor'),
      idea('Suppression of opposition', 'opposition', 'suppress', 'suppression'),
      idea('Propaganda', 'propaganda'),
      idea('Fear and intimidation', 'fear', 'intimidation', 'intimidate'),
    ], 'Power is kept through control of the military and security forces, censorship, suppression of opposition, propaganda, and fear and intimidation.', 3),
  ],
  S4: [
    short('w-uk-both', 's4-united-kingdom', 'The UK has a king, yet citizens elect representatives. Explain why it is both a monarchy and a democracy.', [
      idea('The King is head of state, but ceremonial: his power is limited', 'ceremonial', 'limited', 'head of state', 'symbol', 'constitution'),
      idea('Citizens elect MPs to the House of Commons; elected representatives hold political power', 'elect', 'mps', 'commons', 'parliament', 'prime minister', 'representatives'),
      idea('Monarchy describes the head of state; democracy describes how power is organised', 'organised', 'describes', 'how power'),
    ], 'The UK is a constitutional monarchy and a parliamentary democracy. King Charles III is the ceremonial head of state, and his power is limited. Citizens elect MPs to the House of Commons, and the Prime Minister leads the government. Monarchy describes the head-of-state position; democracy describes how power is organised. A country can be both.', 2),
    short('w-nk', 's4-north-korea', 'North Korea holds elections but is not a genuine democracy. Explain why.', [
      idea('Elections are not genuinely competitive: one party rules and opposition is not allowed', 'competitive', 'one party', 'opposition', 'no choice', 'workers party'),
      idea('Power is concentrated in one leader and party', 'concentrated', 'kim', 'one leader'),
      idea('The media are severely restricted', 'media', 'censorship', 'restricted', 'freedom'),
    ], "North Korea is an authoritarian one-party dictatorship. Power is concentrated in Kim Jong Un and the Workers' Party, opposition is not allowed and the media are severely restricted. Holding elections, or having \"democratic\" in the name, does not make a country a democracy: elections must be free, fair and competitive.", 2),
  ],
  S5: [
    short('w-examples', 's5-big-ideas', 'Give one country example for each system: monarchy, democracy and dictatorship.', [
      idea('Monarchy: Saudi Arabia, the UK or Japan', 'saudi', 'uk', 'united kingdom', 'britain', 'japan'),
      idea('Democracy: Switzerland, France or Germany', 'switzerland', 'swiss', 'france', 'germany'),
      idea('Dictatorship: North Korea', 'north korea', 'korea'),
    ], 'Monarchy: Saudi Arabia, the United Kingdom or Japan. Democracy: Switzerland, France or Germany. Dictatorship: North Korea.'),
    short('w-both', 's5-big-ideas', 'Can a country be both a monarchy and a democracy? Explain, with an example.', [
      idea('Yes, it can', 'yes', 'can be both', 'it can'),
      idea('Monarchy describes the head of state; democracy describes how power is organised', 'head of state', 'organised', 'how power'),
      idea('An example: the United Kingdom or Japan', 'uk', 'united kingdom', 'britain', 'japan'),
    ], 'Yes. Monarchy describes the head-of-state position; democracy describes how power is organised. A country can be both: the United Kingdom and Japan are constitutional monarchies and parliamentary democracies.'),
  ],
};
