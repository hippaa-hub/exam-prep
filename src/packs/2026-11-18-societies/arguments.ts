// D1: the teacher's six Criterion D questions, for the Argument Builder.
// Each example is ONE possible answer, built only from the teacher's notes, and is shown
// only after Adele has written her own. Other well-argued answers are just as good.
import type { ArgumentItem, MockExam } from '../../content/types';

export const argumentQuestions: ArgumentItem[] = [
  {
    id: 'd-fairest',
    prompt: '"Democracy is the fairest system because it gives citizens the opportunity to participate." Do you agree or disagree?',
    example: 'I mostly agree. Democracy is fair because power comes from the people, who can take part and hold leaders accountable. In Switzerland, for example, citizens vote in referendums and can launch popular initiatives. In a democracy power flows from citizens, through elections, to representatives; in a dictatorship such as North Korea it is concentrated in one leader and party, and opposition is not allowed. However, democracy can be slow, and a majority may overlook minorities. A system also does not automatically guarantee good government. So democracy is the fairest of the three systems, but only when rights, accountability and the rule of law are protected as well.',
  },
  {
    id: 'd-monarch-democratic',
    prompt: 'Can a country have a monarch and still be democratic? Use evidence from two countries.',
    example: 'Yes. Monarchy describes the head-of-state position, while democracy describes how power is organised, so a country can be both. In the United Kingdom, King Charles III is a ceremonial head of state and citizens elect MPs to the House of Commons. In Japan, the Emperor is a symbol of the state with no governing power, and citizens elect the National Diet. In both, political power comes from the people through elections, and the monarch\'s power is limited by a constitution and laws. On the other hand, in Saudi Arabia the King holds extensive power, so having a monarch does not always go with democracy. It depends on how much power the monarch holds.',
  },
  {
    id: 'd-uk-both',
    prompt: 'The UK has a king, yet it elects representatives. Why is it both a monarchy and a democracy?',
    example: 'The UK is both because the King is head of state while elected representatives hold political power. King Charles III is a ceremonial head of state: his position is inherited, but his power is limited by a constitution and laws. Citizens elect MPs to the House of Commons in general elections, and the Prime Minister, the head of government, leads the government. So power flows from citizens, through elections, to representatives. Some people question having a hereditary head of state in a democracy. Even so, "having a king does not mean the king controls the government", so the UK is a constitutional monarchy and a representative democracy at once.',
  },
  {
    id: 'd-north-korea',
    prompt: 'North Korea holds elections but is not a genuine democracy. Explain why.',
    example: "North Korea is not a genuine democracy because its elections are not free, fair and competitive. It is an authoritarian one-party state led by Kim Jong Un and the Workers' Party; opposition is not allowed and the media are severely restricted. Power is concentrated in one leader and party instead of coming from the people. Someone might point out that the country holds elections and is called the Democratic People's Republic of Korea. But holding elections, or having \"democratic\" in the name, does not make a country a democracy. Democracy needs real choice, protected rights, accountability and the rule of law.",
  },
  {
    id: 'd-most-power',
    prompt: 'Which system gives citizens the most power? Give two reasons and one example.',
    example: 'Democracy gives citizens the most power, and direct democracy most of all. First, power comes from the people: citizens choose their leaders in free, competitive elections. Second, leaders are accountable, so citizens can change the government. In Switzerland citizens even vote on issues themselves in referendums and can launch popular initiatives. In an absolute monarchy such as Saudi Arabia power is held by the monarch, and in a dictatorship it is concentrated in one leader or group. However, direct democracy has limits: complex issues can be hard for voters, and the majority may overlook minorities. Overall, citizens have the most power where they can vote freely and hold leaders to account.',
  },
  {
    id: 'd-no-government',
    prompt: 'Can a society function successfully without a government? Explain your opinion using at least two reasons.',
    example: 'In my opinion a society cannot function successfully without a government. First, people have different needs, interests and opinions, so they need an organised system to make collective decisions. Second, governments establish and enforce laws to maintain public order and protect citizens; without them it becomes harder to resolve conflicts and protect rights. Third, nobody would provide public services such as education, healthcare and transport. Someone might say a small group, like our Shipwrecked island, can organise itself without a government. But even there the group chose leaders, made rules and settled disagreements, which is governance on a small scale, and a real country has millions of people. So a society needs organised governance to work.',
  },
  {
    id: 'd-why-power-matters',
    prompt: 'Why does understanding how power is distributed matter for citizens? Link your answer to fairness, accountability and participation.',
    example: 'Understanding how power is distributed matters because it shows citizens who decides, and whether they can take part. Where power comes from the people, as in the United Kingdom, citizens can participate by electing MPs, and leaders are accountable: they must explain and answer for their actions. Where power is concentrated, as in North Korea, opposition is not allowed, so decisions are harder to challenge and may be less fair. Some might say the system matters less than good leaders, and it is true that a system does not automatically guarantee good government. Still, citizens who understand where power lies can judge whether it is used fairly and how to take part.',
  },
];

export const mocks: MockExam[] = [
  // Mock Exam 1 is the teacher's own two exit tickets, which she says map directly to Criteria A and D:
  // Lesson 1 questions 1 to 6 and its final reflection, then Lesson 2 Part A 1 to 4 and Part B 5 to 7.
  {
    id: 'mock-1',
    title: 'Mock Exam 1: the teacher\'s exit tickets',
    minutes: 50,
    partA: [
      'w-government', 'w-gov-governance', 'w-power-authority', 'w-four', 'w-why-government', 'w-institution',
      'w-monarchy', 'w-democracy', 'w-dictatorship', 'w-abs-const', 'w-direct-rep', 'w-examples',
    ],
    partB: ['d-no-government', 'd-uk-both', 'd-north-korea', 'd-most-power'],
  },
  // Mock Exam 2: the rest of the teacher's written and critical-thinking questions.
  {
    id: 'mock-2',
    title: 'Mock Exam 2',
    minutes: 40,
    partA: ['w-dem-dict', 'w-rules-laws', 'w-heads', 'w-protects', 'w-gain', 'w-keep'],
    partB: ['d-fairest', 'd-monarch-democratic', 'd-why-power-matters'],
  },
];
