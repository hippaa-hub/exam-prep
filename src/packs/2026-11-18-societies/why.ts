// Why an answer is right, and why a wrong choice is wrong, in words a Grade 7 student can follow.
// Everything here comes from the teacher's material; only the sentences are kept short and plain.

/**
 * What each answer option means, in one or two short sentences.
 * Used to explain a wrong choice ("Why not Power?") and, when a question has no explanation of its own,
 * the right answer too.
 */
export const meanings: Record<string, string> = {
  // The five systems
  'Absolute monarchy': 'In an absolute monarchy, a king or queen holds almost all the political power. Parliament is absent or limited.',
  'Constitutional monarchy': 'In a constitutional monarchy there is a king, queen or emperor, but a constitution and laws limit their power. Parliament makes the laws.',
  'Direct democracy': 'In a direct democracy, citizens vote on each issue themselves, for example in a referendum.',
  'Representative democracy': 'In a representative democracy, citizens elect representatives, and the representatives make the decisions in parliament.',
  Dictatorship: 'In a dictatorship, power is concentrated in one leader or a small group. Citizens cannot really change the government in free elections.',
  Democracy: 'In a democracy, power comes from the people. They take part directly or through elected representatives.',

  // The four responsibilities
  'Maintaining public order': 'Maintaining public order means keeping daily life safe and orderly: laws and regulations, preventing crime, resolving disputes. Think of traffic rules.',
  'Protecting citizens': 'Protecting citizens means keeping people safe in emergencies and defending the country. Think of emergency services and the armed forces.',
  'Providing public services': 'Providing public services means giving people education, healthcare, roads and water. Think of public schools and hospitals.',
  'Enforcing laws': 'Enforcing laws means making sure laws are followed: investigating, and giving legal consequences. Think of courts dealing with law-breakers.',

  // The five countries
  'United Kingdom': 'The United Kingdom is a constitutional monarchy and a representative democracy. King Charles III is the ceremonial head of state, and citizens elect MPs to the House of Commons.',
  Japan: 'Japan is a constitutional monarchy and a democracy. The Emperor is a symbol of the state with no governing power, and citizens elect the National Diet.',
  'Saudi Arabia': 'Saudi Arabia is an absolute monarchy. The King is head of state and head of government, and the Consultative Council only advises.',
  Switzerland: 'Switzerland is a democracy with direct participation. Citizens vote in referendums, and the Federal Council is the head of state.',
  'North Korea': "North Korea is a one-party dictatorship led by Kim Jong Un and the Workers' Party. Opposition is not allowed.",

  // The three levels of decisions
  Individual: 'Individual decisions are your own choices, inside the law.',
  Local: 'Local decisions are made by a council for one area: waste collection, parks, repairing a playground.',
  National: 'National decisions are made by the state for the whole country: education policy, laws, healthcare, taxes.',

  // Key terms and confusing pairs
  Government: 'Government is WHO governs: the people and institutions that make decisions and set policies.',
  Governance: 'Governance is HOW governing happens: the process and system for making decisions.',
  Power: 'Power is the ability to influence people, decisions or actions. Having power is not the same as having the right.',
  Authority: 'Authority is the recognised, accepted right to make decisions and give instructions.',
  Rules: 'Rules are agreed instructions that guide behaviour in a group, like a class. They are agreed, not enforced by the state.',
  Laws: 'Laws are official rules. They are established and enforced by a recognised authority.',
  Institutions: 'Institutions are established organisations that do important jobs in society, like parliament, courts and schools.',
  Society: 'A society is a group of people living together in an organised community.',
  'Public services': "Public services are services provided for society's benefit, like schools, hospitals and roads.",
  'Political participation': 'Political participation is the ways citizens influence political decisions, like voting or giving their opinion.',
  'Head of state': 'The head of state officially represents the country. In a monarchy this is the king, queen or emperor.',
  'Head of government': 'The head of government leads the government and its policies. It is usually a prime minister or a president.',
  Strength: 'A strength is a good point: something the system does well.',
  Limitation: 'A limitation is a weak point: a problem the system can have.',
  'Gaining power': 'Gaining power is how a leader first gets power: a military coup, a revolution, manipulated elections or a political crisis.',
  'Keeping power': 'Keeping power is how a leader stays in power: controlling the military, censorship, suppressing opposition, propaganda and fear.',
  Censorship: 'Censorship is controlling information: deciding what people may read, see and say. Dictatorships use it to keep power.',
  Propaganda: "Propaganda is shaping public opinion in a leader's favour. Dictatorships use it to keep power.",
  Intimidation: 'Intimidation means frightening people so that they obey. Dictatorships use it to keep power.',
  'House of Commons': 'The House of Commons is the part of the UK Parliament whose members, the MPs, are elected.',
  'House of Lords': 'The House of Lords is the part of the UK Parliament whose members are mostly appointed.',

  // Institutions
  Parliament: 'Parliament debates and passes laws.',
  Courts: 'Courts interpret laws and resolve disputes.',
  Police: 'The police enforce laws and keep people safe.',
  Hospitals: 'Hospitals are a public service that gives healthcare. They do not make or interpret laws.',
  Schools: 'Schools are a public service that gives education. They do not make or interpret laws.',

  // Other words used as wrong answers
  Referendums: 'A referendum is a vote where citizens decide one issue themselves. It is a tool of direct democracy.',
  Inheritance: 'Inheritance means a position is passed down in a family. That is how monarchs usually get power.',
  'A military coup': 'A military coup is when the army takes power by force. It is one way a dictator gains power.',
};

const DEM = 'Demos means people and kratos means power or rule. Together: the power of the people, or rule by the people.';
const STILL = 'Citizens in a dictatorship still do this. What they cannot really do is change the government by voting.';
const FACT = 'That is a fact about a country. It does not say anything about how the country is governed.';
const DICT_FEATURE = 'That is a feature of dictatorship. A constitutional monarchy has democratic institutions.';
const SERVICES = 'Public schools and hospitals are public services.';

/** Why each wrong answer is wrong, for the questions whose answers are whole sentences. */
export const whyNot: Record<string, Record<string, string>> = {
  'g1-society-depend': {
    'Everyone believes the same thing': 'The opposite is true: members of a society hold different interests and beliefs. That is why it needs organisation.',
    'Nobody needs to cooperate': 'A society needs cooperation and organisation. Without it, people cannot live together.',
    'It must be ruled by a monarch': 'A society is the people living together. It can have any kind of government, or be smaller than a country.',
  },
  'g1-society-size': {
    'No, only a whole country is a society': 'A society can be smaller: a local community or a town is a society too.',
    'No, only a town is a society': 'A society can be bigger as well: a country, or a multicultural society.',
    'Only if it has a government': 'A society is the people living together and sharing rules and institutions. The size is what changes, not the government.',
  },
  'g1-society-interests': {
    'One leader who decides everything': 'That is a dictatorship. A society needs people to cooperate, not one person deciding for all.',
    'Everyone to think the same': 'Different interests and beliefs are normal in a society. It organises itself around them.',
    'No rules at all': 'Shared rules are exactly what lets people with different beliefs live together.',
  },
  'g3-uf-key': {
    'Fairness': 'Fairness is part of the global context (Fairness and Development), not the key concept.',
    'Power': 'Power is a key term in the lesson, but the key concept of the unit is Systems.',
    'Democracy': 'Democracy is one system of governance. The key concept is Systems.',
  },
  'g3-uf-system': {
    'A group of people who share a culture': 'That is closer to a society or a nation. A system is connected parts working together.',
    'A written set of laws': 'That is closer to a constitution. A system is connected parts working together.',
    'A leader and their family': 'That is a royal family. A system is connected parts working together.',
  },
  'g3-uf-related': {
    'Power and Authority': 'Those are two key terms you must not mix up, but they are not the related concepts.',
    'Rules and Laws': 'Another pair of key terms. The related concepts are Governance and Development.',
    'Fairness and Justice': 'Fairness is in the global context. The related concepts are Governance and Development.',
  },
  'g3-uf-context': {
    'Identities and Relationships': 'That is a global context, but it belongs to a different unit.',
    'Peace and Conflict': 'SDG 16 is about peace, but the global context is Fairness and Development.',
    'Systems and Power': 'Systems is the key concept. The global context is Fairness and Development.',
  },
  'g3-uf-soi': {
    'the wealth of the royal family': 'The Statement of Inquiry is about whole societies, not one family.',
    'censorship and propaganda': 'Those are ways a dictatorship keeps power, not the end of the Statement of Inquiry.',
    'the size of a country': 'How power is organised matters whatever the size. The sentence ends "fairness and development in societies".',
  },
  'g3-uf-sdg': {
    'SDG 4: Quality Education': 'Education is a public service governments provide, but this unit is linked to SDG 16.',
    'SDG 13: Climate Action': 'That belongs to a different unit. This one is SDG 16.',
    'SDG 1: No Poverty': 'Development is a related concept, but the goal named in this unit is SDG 16.',
  },
  'g3-why-1': {
    'One person who decides everything': 'That would be a dictatorship. People want different things, so they need a way to decide together.',
    'A society with no rules': 'Without rules there is no order, and conflicts are hard to solve.',
    'A king or queen': 'A monarch is one kind of head of state. What societies need is a system for deciding together, with or without a monarch.',
  },
  'g3-why-2': {
    'To stop citizens taking part': 'Laws are there to keep order and protect people. Keeping people out is what a dictatorship does.',
    'To keep power in one family': 'That describes inheriting power in a monarchy. It is not the reason for laws.',
    'To replace public services': 'Laws do not replace schools and hospitals. Governments make laws and provide services.',
  },
  'g3-why-3': {
    'Censorship and propaganda': 'Those are ways a dictatorship keeps power. They are not services for people.',
    'Referendums and initiatives': 'Those are ways of voting in a direct democracy. They are not services.',
    'Inheritance and succession': 'Those are about how a monarch gets the throne. They are not services.',
  },
  'g3-why-4': {
    'Choosing a monarch': 'A monarch usually inherits the position. That is not what governance is for.',
    'Holding a military coup': 'A coup is taking power by force. Good governance has nothing to do with that.',
    'Agreeing classroom rules': 'A class can agree its own rules. The question is about a whole society.',
  },
  'g3-island': {
    'Real societies do not need rules': 'They do. Even the island class needed rules, and real societies have millions of people.',
    'Only islands need leaders': 'Every society needs a way to make decisions, not only an island.',
    'Real societies never disagree': 'People always have different needs and opinions. That is exactly why they need a system to decide.',
  },
  'g3-inst-check': {
    'Yes, every institution is part of the government': 'Not all of them. Some institutions exist to check the government.',
    'No. Institutions have nothing to do with society': 'Institutions do important jobs in society: think of schools, courts and hospitals.',
    'Yes, and they all make laws': 'Only parliament passes laws. Other institutions have other jobs.',
  },
  'g3-laws-1': {
    'They concentrate power in one leader': 'That is a feature of dictatorship. It is not a reason laws matter.',
    'They restrict opposition': 'That is something dictatorships do. Laws are meant to protect rights.',
    'They replace institutions': 'Laws work together with institutions like courts and police. They do not replace them.',
  },
  'g3-laws-2': {
    'Protect leaders, prevent elections, end debate, set taxes, control media': 'This list is about controlling people, as in a dictatorship. Laws are meant to protect everyone.',
    'Choose monarchs, pass on power, hold referendums, write constitutions, appoint lords': 'This list mixes up monarchies and voting. It is not about why laws matter.',
    'Build roads, run schools, open hospitals, supply water, collect waste': 'These are public services. They are not the reasons laws matter.',
  },
  'g3-fn-1': {
    'Police and courts': 'Police and courts are about order and enforcing laws. "Resources" means money: taxes and spending.',
  },
  'g3-fn-2': {
    'Suppress opposition': 'That is how a dictatorship keeps power. It is not one of the six things governments do.',
    'Inherit power': 'That is how a monarch gets the position. It is not something governments do.',
    'Control the media': 'That is a feature of dictatorship. It is not one of the six things.',
  },
  'g4-list': {
    'Maintaining public order, controlling the media, providing public services, enforcing laws': 'Controlling the media is a feature of dictatorship. The one missing here is protecting citizens.',
    'Holding referendums, protecting citizens, choosing the monarch, enforcing laws': 'Holding referendums and choosing the monarch are not responsibilities of government in the lesson.',
    'Maintaining public order, protecting citizens, suppressing opposition, writing propaganda': 'Suppressing opposition and propaganda are ways a dictatorship keeps power. They are not responsibilities.',
  },
  'g4-judge': {
    'It lets the stronger person win': 'A judge decides by the law, not by who is stronger. That is the whole point.',
    'It replaces the need for laws': 'The judge uses the laws to decide. Laws are still needed.',
    'It gives the judge power without authority': 'A judge has legal authority: the accepted right to decide.',
  },
  'g4-example-order': {
    'Public schools and hospitals': SERVICES,
    'National defence': 'Defence is part of protecting citizens.',
  },
  'g4-example-protect': {
    'Traffic rules': 'Traffic rules are about maintaining public order.',
    'Public schools and hospitals': SERVICES,
    Elections: 'Elections are how citizens choose their leaders. They are not about keeping people safe in an emergency.',
  },
  's1-q-inherit': {
    'By a free, competitive election': 'That is how leaders are chosen in a democracy. A monarch usually inherits the position.',
    'By a referendum': 'A referendum is a vote on one issue. Monarchs are not chosen that way.',
    'By a popular initiative': 'A popular initiative lets citizens ask for a vote, in a direct democracy. Monarchs inherit the position.',
  },
  's1-q-howlong': {
    'Until the next general election': 'Elections change governments, not monarchs. A monarch stays for life, or until abdication.',
    'For one year': 'There is no fixed number of years. It is for life, or until the monarch gives up the throne.',
    'Until parliament debates it': "Parliament debates laws. It does not end a monarch's time.",
  },
  's1-q-same': {
    'The monarch holds all political power': 'That is only true in an absolute monarchy.',
    'Parliament makes the laws': 'That is true in a constitutional monarchy. In an absolute one, parliament is absent or limited.',
    'Citizens vote on every issue': 'That is direct democracy, not monarchy.',
  },
  's1-q-key': {
    'Whether there is a king or queen': 'Both kinds have a monarch. The difference is how much power the monarch holds.',
    'Whether the position is inherited': 'In both kinds the position is usually inherited.',
    'Whether the country has a head of state': 'Both have a head of state: the monarch.',
  },
  's1-q-adv': {
    'Accountability and participation': 'Those are advantages of democracy. An absolute monarchy has little accountability.',
    'Free elections and a choice of parties': 'Those are features of democracy.',
    'Protected rights and free speech': 'Those are things democracy protects.',
  },
  's1-q-dis': {
    'Slow decisions and division': 'Those are possible disadvantages of democracy. An absolute monarchy decides quickly.',
    'Broken election promises': 'That is a limit of representative democracy. An absolute monarch is not elected.',
    'Complex issues are hard for voters': 'That is a limit of direct democracy, where citizens vote on the issues.',
  },
  's1-q-king': {
    '…the country has a head of state': 'A country with a king does have a head of state: the king.',
    '…the position is inherited': 'The position usually is inherited.',
    '…the country is a monarchy': 'A country with a king is a monarchy. The point is that he may not control the government.',
  },
  's2-q-source': {
    'One leader or ruling group': 'That is where power sits in a dictatorship.',
    'The armed forces': 'The army holding power is a military dictatorship, not a democracy.',
  },
  's2-q-greek': { 'King and law': DEM, 'Vote and country': DEM, 'One and rule': 'Rule is half right: kratos means power or rule. But demos means people, not one.' },
  's2-q-elections': {
    'held, but with one party only': 'With one party there is no real choice. That is not a competitive election.',
    inherited: 'Elections are votes. Inheriting is how monarchs get power.',
    'controlled by the security forces': 'Then they are not free or fair. That happens in dictatorships.',
  },
  's2-q-more': {
    'Censorship, propaganda and intimidation': 'Those are how a dictatorship keeps power.',
    'A monarch, a palace and succession': 'Those belong to a monarchy. A democracy does not need them.',
    'Quick decisions without opposition': 'That is a claimed advantage of dictatorship. Democracy allows opposition.',
  },
  's2-q-law': {
    'Citizens, but not leaders': 'In a democracy the law applies to leaders too. That is the rule of law.',
    'Only the opposition': 'The law is for everyone, not for one group.',
    'Only people who voted': 'The law applies whether you voted or not.',
  },
  's2-q-mix': {
    'They use only referendums': 'Even Switzerland also elects representatives. Most democracies mix both.',
    'They never hold elections': 'Elections are a key feature of democracy.',
    'They have no parliament': 'Representative democracies make their laws in parliament.',
  },
  's2-q-account': {
    'Leaders inherit their position': 'That describes a monarchy, not accountability.',
    'Leaders control the media': 'That is a feature of dictatorship. Accountability is the opposite: leaders must answer for what they do.',
    'Leaders make quick decisions': 'Being quick is not the same as having to explain your actions.',
  },
  's3-q-change': { 'Live in the country': STILL, 'Follow the laws': STILL, 'Have a head of state': STILL },
  's3-q-forms': {
    'Absolute and constitutional': 'Those are the two kinds of monarchy.',
    'Direct and representative': 'Those are the two kinds of democracy.',
    'Local and national': 'Those are levels of decisions.',
  },
  's3-q-adv': {
    'Leaders are accountable': 'In a dictatorship accountability is often limited. This is an advantage of democracy.',
    'Rights are protected': 'Dictatorships limit freedoms. Protecting rights is an advantage of democracy.',
    'High citizen participation': 'In a dictatorship participation is severely restricted.',
  },
  's3-q-dis': {
    'Slow decisions and division': 'Those are possible disadvantages of democracy. A dictatorship decides quickly.',
    'A hereditary head of state': 'That is a point about monarchy.',
    'Complex issues are hard for voters': 'That is a limit of direct democracy.',
  },
  's3-q-elections': {
    'Yes. Any election makes a democracy': 'An election only counts if it is free, fair and competitive.',
    'Yes, if the country is called democratic': 'A name does not make a country a democracy. North Korea is called democratic too.',
    'No. Democracies never hold elections': 'Democracies do hold elections. The problem here is that there is no real choice.',
  },
  's4-q-uk-both': {
    'The King chooses all the MPs': 'Citizens elect the MPs, in general elections.',
    'The King and Parliament take turns to rule': 'They do not take turns. The King is ceremonial, and the elected government governs.',
    'It is not really a monarchy': 'It is a monarchy: the King is head of state. It is a constitutional monarchy.',
  },
  's4-q-nk-name': {
    'Yes, because it holds elections': 'Its elections are not competitive: opposition is not allowed.',
    'Yes, because of its official name': 'A name does not make a country a democracy.',
    'Yes, because it has a leader': 'Every country has a leader. What matters is how power is organised.',
  },
  's4-q-saudi-council': {
    'An elected parliament that makes the laws': 'It is not elected, and it only advises.',
    'The head of state': 'The King is the head of state.',
    'A court that resolves disputes': 'It is a council that gives advice. It is not a court.',
  },
  's4-q-japan-inherit': {
    'Citizens elect the Emperor': 'Citizens elect members of the National Diet, not the Emperor.',
    'The National Diet chooses the Emperor': 'The Diet makes the laws. The Emperor\'s position passes down in the family.',
    'The Prime Minister appoints the Emperor': 'The Prime Minister leads the government. The Emperor\'s position is inherited.',
  },
  's4-q-japan-symbol': {
    'The armed forces': 'The Emperor does not control the armed forces. He has no governing power.',
    'The laws made by the National Diet': 'The Diet makes the laws. The Emperor stands for the state and its people.',
    "The Prime Minister's power": 'The Prime Minister leads the government. The Emperor is a symbol, not a ruler.',
  },
  's4-q-japan-both': {
    'A monarch must always control the government': 'In Japan the Emperor does not control the government. The Prime Minister leads it.',
    'A country with an emperor cannot hold elections': 'Japanese citizens elect the National Diet, even though Japan has an Emperor.',
    'A country must choose: a monarchy or a democracy, never both': 'Japan is both: a constitutional monarchy and a parliamentary democracy.',
  },
  's4-q-two-mon': {
    'Saudi Arabia and Japan': 'Japan is right, but Saudi Arabia is an absolute monarchy.',
    'Switzerland and the United Kingdom': 'The UK is right, but Switzerland has no monarch. It is a federal republic.',
    'Saudi Arabia and North Korea': 'Saudi Arabia is an absolute monarchy, and North Korea is a dictatorship.',
  },
  's5-q-def': {
    'The people and institutions that govern': 'That is the definition of government.',
    "Services organised for society's benefit": 'That is the definition of public services.',
    'Agreed instructions that guide behaviour': 'That is the definition of rules.',
  },
  's5-q-both': {
    'No. A country with a monarch cannot hold elections': 'It can. The UK and Japan have monarchs and elections.',
    'No. Monarchy and democracy are opposites': 'They describe different things, so a country can be both.',
    'Yes, but only if the monarch is elected': 'Monarchs usually inherit the position. The UK is both, and its King is not elected.',
  },
  's5-q-warning': {
    'Yes. Democracy always gives good government': 'No system guarantees it. A democracy can still be slow or divided.',
    'Yes. The system decides everything': 'Leaders, laws and institutions matter too.',
    'No. The system makes no difference at all': 'The system does matter. It is just not the only thing that matters.',
  },
  's5-q-questions': { 'How large is the country?': FACT, 'How old is the capital city?': FACT, 'Which language is spoken?': FACT },
  's5-q-dem-dis': {
    'Abuse of power and repression': 'Those are possible disadvantages of dictatorship.',
    'A hereditary head of state': 'That is a point about monarchy.',
    'Little accountability': 'That is a disadvantage of absolute monarchy. Democracy has accountability.',
  },
  's5-q-most': {
    'A one-party state': 'In a one-party state opposition is not allowed, so participation is severely restricted.',
  },
  's5-q-cm-dis': { 'Opposition is not allowed': DICT_FEATURE, 'There are no elections': DICT_FEATURE, 'The media are controlled': DICT_FEATURE },
};

/**
 * "In simple words": a short, everyday explanation shown next to the teacher's wording.
 * Keyed by the thing to know (concept), or by one question's id where that question needs its own.
 * The teacher's wording is what to write in the test; this is to help it make sense.
 */
export const simple: Record<string, string> = {
  'g3-unit-framework': 'This unit asks one big question: how is power organised, and what does that do to fairness in a society?',
  // --- The ten key terms: one plain sentence each (their examples are in the list below) ---
  'g1-society': 'A society is a big group of people who live together and share rules.',
  'g1-government': 'The government is the people and organisations in charge of running a country.',
  'g1-governance': 'Governance is the way a country is run: how decisions are made, how leaders use their power, and how shared things are looked after.',
  'g1-rules': 'Rules are what a group agrees to do.',
  'g1-laws': 'Laws are the official rules of a country, and they are enforced.',
  'g1-institutions': 'Institutions are lasting organisations that do an important job for everyone.',
  'g1-power': 'Power means you can get people to do things, change decisions and make things happen.',
  'g1-authority': 'Authority means you have the accepted right to decide and to tell others what to do.',
  'g1-services': 'Public services are useful things provided for everyone.',
  'g1-participation': 'Political participation means taking part in how your country is run.',

  // --- The confusing pairs ---
  'g2-government-governance': 'Government is the people in charge, like the head and teachers of a school. Governance is how they run it: how they decide, who has a say and how money is spent.',
  'g2-power-authority': 'Power is being ABLE to do something. Authority is being ALLOWED to do it. Someone who forces others has power, but no authority.',
  'g2-rules-laws': 'Rules are agreed by a group, like a class. Laws are made for the whole country, and police and courts make sure they are followed.',
  'g2-head-of-state-government': 'The head of state is the face of the country, like a king or queen. The head of government really runs the government, like a prime minister.',

  // --- Why societies need government ---
  'g3-why-government': 'People want different things, so they need a fair way to decide together. A government makes the laws, keeps people safe and provides things like schools.',
  'g3-institutions': 'Each institution has its own job. Parliament makes laws, courts settle arguments using the law, and the police make sure laws are followed.',
  'g3-levels': 'Some choices are yours alone. Some are made by your local council, like parks and bins. Some are made for the whole country, like laws and taxes.',
  'g3-laws-and-functions': 'Laws keep people safe and settle arguments fairly. Governments make laws, keep order, protect people, provide services and look after public money.',
  'g3-fn-1': "Public resources means the country's money. The government collects it as taxes and decides how to spend it.",
  'g3-part-1': 'In a democracy people help decide by voting, by talking about issues and by choosing representatives.',
  'g3-part-2': 'Giving your opinion on a new law is one way of taking part in politics.',

  // --- The four responsibilities ---
  'g4-public-order': 'Keeping order means making daily life safe and calm, with rules that everyone follows, like traffic rules.',
  'g4-protecting': 'Protecting citizens means keeping people safe when something dangerous happens, like an earthquake, a flood or an attack on the country.',
  'g4-services': 'Public services are useful things the government provides for everyone, like schools, hospitals, roads and water.',
  'g4-enforcing': 'Enforcing laws means making sure people follow them. If someone breaks a law, it is looked into and there are consequences.',
  'g4-all-four': 'Governments have four big jobs: keep order, protect people, provide services and enforce the laws.',
  'g4-judge': "When a judge decides, both sides accept the law's answer. They do not fight it out themselves.",

  // --- Monarchy ---
  's1-absolute': 'In an absolute monarchy the king or queen makes the big decisions alone. No parliament can stop them. Saudi Arabia is the example.',
  's1-constitutional': 'In a constitutional monarchy there is a king or queen, but laws limit their power and an elected parliament governs. The UK and Japan are examples.',
  's1-monarchy-basics': 'A monarchy has a king, queen or emperor as head of state. The job passes down in the family and usually lasts for life.',
  's1-q-key': 'Both kinds have a king or queen. What is different is how much power they really have.',
  's1-q-king': 'A king can be head of state without running the country. In the UK the elected government does that.',
  's1-q-same': 'In both kinds the monarch is head of state, and usually got the job from their family.',
  's1-q-adv': 'With one ruler, decisions are quick, and the same ruler stays for a long time.',
  's1-q-dis': 'If one ruler has all the power, nobody can easily stop them when they do something wrong.',
  'w-abs-const': 'Absolute: the monarch really rules, as in Saudi Arabia. Constitutional: the monarch is limited by laws and parliament governs, as in the UK and Japan.',

  // --- Democracy ---
  's2-direct': 'In a direct democracy people vote on the questions themselves, not just on who will decide. Switzerland does this with referendums.',
  's2-representative': 'In a representative democracy people choose others to decide for them. They vote for representatives, who make the laws in parliament.',
  's2-democracy-basics': 'In a democracy the people are in charge. They choose their leaders in free and fair elections, and the law applies to everyone.',
  's2-q-greek': 'The word democracy comes from Greek. Demos is people and kratos is power or rule, so it means power (or rule) of the people.',
  's2-q-mix': 'Most democracies use both: people elect representatives, and sometimes also vote on a question directly.',
  'w-direct-rep': 'Direct: people vote on the question themselves. Representative: people vote for others, who then decide for them.',
  's2-democracy-value': 'Democracy lets people take part, speak freely and remove leaders they do not like. But deciding together can be slow, and people may disagree.',
  's2-q-account': 'Accountability means leaders have to explain what they did. They can lose their job if people are unhappy.',
  's2-process': 'First people vote. The winners go to parliament, where they discuss and pass laws. Then the government carries them out.',

  // --- Dictatorship ---
  's3-gaining-power': 'A dictator usually takes power instead of being freely chosen: by using the army, a revolution, cheating in an election or using a crisis.',
  's3-keeping-power': 'To stay in power, a dictator controls the army and the news, stops people who disagree, and makes people afraid.',
  's3-cp-1': 'Censorship means blocking news and ideas that the leader does not want people to see.',
  's3-cp-2': 'Propaganda means spreading messages that make the leader look good.',
  's3-dictatorship': 'In a dictatorship one leader or a small group has all the power. People cannot vote them out, and it is hard to disagree openly.',

  // --- The five countries ---
  's4-united-kingdom': 'The UK has a king, but he does not run the country. People elect MPs, and the Prime Minister leads the government.',
  's4-japan': 'Japan has an emperor, but he is only a symbol. People elect the parliament, called the National Diet, and the Prime Minister leads the government.',
  's4-saudi-arabia': 'In Saudi Arabia the King really rules. He is head of state and head of government, and there is no elected parliament.',
  's4-switzerland': 'In Switzerland people often vote on questions themselves, in referendums. A group called the Federal Council leads the country together.',
  's4-north-korea': 'North Korea is ruled by one leader and one party. Other parties are not allowed, and the news is tightly controlled.',

  // --- Comparing the systems ---
  's5-authority-and-leaders': "Where does the right to rule come from? In a monarchy, from the family. In a democracy, from people's votes. In a dictatorship, one leader or group takes control.",
  's5-decisions-and-participation': 'Who decides, and can people take part? In a democracy people really take part. In a dictatorship they hardly can. In a monarchy it depends on the type.',
  's5-opposition-and-accountability': 'Can people disagree, and must leaders answer for what they do? In a democracy, yes. In a dictatorship, usually not. In a monarchy it depends on the type.',
  's5-power-flow': 'Follow the power. In an absolute monarchy it goes down from the monarch. In a democracy it comes up from the people. In a dictatorship it stays with one leader or group.',
  's5-big-ideas': 'No system is perfect. Each has good points and bad points, and a country can be a monarchy and a democracy at the same time.',
  's5-q-def': 'A system of governance is the way a country is set up to be run: who has power, and how they use it.',
  's5-q-both': 'Yes. Having a king or queen is about who the head of state is. Being a democracy is about people choosing who governs. The UK is both.',
  'w-both': 'Yes. Having a king or queen is about who the head of state is. Being a democracy is about people choosing who governs. The UK is both.',
  's5-q-warning': 'A good system helps, but it is not enough. A country also needs fair laws, good leaders and respect for people\'s rights.',
  's5-q-questions': 'To understand any system, ask: who has power, how did they get it, and can people take part?',
  'w-examples': 'Monarchy: Saudi Arabia, the UK or Japan. Democracy: Switzerland, France or Germany. Dictatorship: North Korea.',
};

/**
 * A few short examples for each definition or idea, shown under the simple words.
 * Keyed by the thing to know (concept), or by one question's id.
 */
export const examples: Record<string, string[]> = {
  'g3-unit-framework': [
    'Key concept: Systems',
    'Related concepts: Governance and Development',
    'Global context: Fairness and Development',
    'SDG 16: Peace, Justice and Strong Institutions',
  ],
  // The ten key terms
  'g1-society': ['Everyone living in a country', 'The people of a town or city'],
  'g1-government': ['A prime minister and ministers', 'Parliament', 'A local council'],
  'g1-governance': ['How a new law is discussed and voted on', 'Who is allowed to take part in a decision', 'How tax money is shared out and spent'],
  'g1-rules': ['Class rules', 'The rules of a game', 'House rules at home'],
  'g1-laws': ['Traffic laws', 'Laws against stealing', 'Tax laws'],
  'g1-institutions': ['Parliament', 'Courts', 'Police', 'Schools and hospitals'],
  'g1-power': ['A king who makes the laws', 'A president who leads a country', 'A boss who decides what workers do'],
  'g1-authority': ['A judge in a courtroom', 'A teacher in a classroom', 'A police officer directing traffic'],
  'g1-services': ['Schools', 'Hospitals', 'Roads', 'Clean water'],
  'g1-participation': ['Voting in an election', 'Giving your opinion on a new law', 'Discussing issues in public'],

  // The confusing pairs
  'g2-government-governance': ['Government: the prime minister and ministers', 'Governance: how they decide, and who takes part'],
  'g2-power-authority': ['Power: someone forces others to obey', 'Authority: a judge decides a case'],
  'g2-rules-laws': ['Rule: no phones in class', 'Law: stop at a red light'],
  'g2-head-of-state-government': ['Head of state: King Charles III in the UK', 'Head of government: the UK Prime Minister'],

  // Why societies need government
  'g3-why-government': ['Making laws to keep people safe', 'Running schools and hospitals', 'Deciding how to spend tax money'],
  'g3-institutions': ['Parliament passes a new law', 'A court settles a dispute', 'The police stop a crime'],
  'g3-levels': ['Individual: your own choices', 'Local: repairing a playground', 'National: taxes and laws'],
  'g3-laws-and-functions': ['A law against stealing protects property', 'Courts settle arguments', 'Taxes pay for schools'],

  // The four responsibilities
  'g4-public-order': ['Traffic rules', 'Police preventing crime', 'Courts resolving disputes'],
  'g4-protecting': ['Emergency services after an earthquake', 'The armed forces defending the country', 'Rescue teams in a flood'],
  'g4-services': ['Public schools', 'Hospitals', 'Roads', 'Water'],
  'g4-enforcing': ['Arresting a thief', 'Investigating a crime', 'A court giving legal consequences'],
  'g4-all-four': ['Order: traffic rules', 'Protect: emergency services', 'Services: public schools', 'Enforce: courts'],

  // Monarchy
  's1-absolute': ['Saudi Arabia: the King is head of state and head of government'],
  's1-constitutional': ['United Kingdom: King Charles III, with an elected parliament', 'Japan: the Emperor, with an elected parliament'],
  's1-monarchy-basics': ['King Charles III of the United Kingdom', 'The Emperor of Japan', 'The King of Saudi Arabia'],

  // Democracy
  's2-direct': ['Switzerland: citizens vote in referendums', 'A popular initiative: citizens ask for a vote'],
  's2-representative': ['UK: citizens elect MPs', 'Japan: citizens elect the National Diet', 'Germany and France'],
  's2-democracy-basics': ['Free and fair elections', 'A choice of parties', 'Leaders who can be voted out'],
  's2-democracy-value': ['Freedom of speech', 'The rule of law', 'Leaders who must explain their actions'],

  // Dictatorship
  's3-gaining-power': ['A military coup', 'A revolution', 'Manipulated elections', 'A political crisis'],
  's3-keeping-power': ['Controlling the army', 'Censoring the news', 'Propaganda', 'Fear and intimidation'],
  's3-dictatorship': ['North Korea: one party, no opposition', 'A military dictatorship', 'A one-party state'],

  // Comparing the systems
  's5-authority-and-leaders': ['Monarchy: inheritance', 'Democracy: free elections', 'Dictatorship: force or control'],
  's5-decisions-and-participation': ['Democracy: citizens vote', 'Dictatorship: one leader or group decides'],
  's5-opposition-and-accountability': ['Democracy: opposition is allowed', 'Dictatorship: opposition is restricted'],
  's5-power-flow': ['Absolute monarchy: monarch → institutions → citizens', 'Democracy: citizens → elections → representatives'],
  's5-big-ideas': ['The UK is a monarchy and a democracy', 'Japan is a monarchy and a democracy'],
};
