// G1: the ten key terms ("Know them cold"). Definitions are the teacher's wording.
import { choice, idea, term, withConcepts } from '../../content/build';
import type { Topic } from '../../content/types';

const D = {
  society: 'A group of people living together in an organised community, sharing institutions, rules, relationships and responsibilities.',
  government: 'The people and institutions responsible for making decisions, setting policies and governing a country or community.',
  governance: 'The process and system through which decisions are made, power is exercised and public affairs are managed.',
  rules: 'Agreed instructions that guide behaviour in a group.',
  laws: 'Official rules established and enforced by a recognised authority.',
  institutions: 'Established organisations that perform important functions in society.',
  power: 'The ability to influence people, decisions or actions.',
  authority: 'The recognised, accepted right to make decisions and give instructions.',
  services: "Services provided or organised for society's benefit.",
  participation: 'The ways citizens influence political decisions.',
};

const which = 'Which key term is this?';

export const g1: Topic = {
  id: 'G1',
  title: 'The ten key terms',
  short: 'Key terms',
  items: withConcepts([
    term('g1-society', 'Society', D.society, [
      idea('A group of people living together in an organised community', 'group', 'people', 'community', 'together'),
      idea('They share institutions, rules, relationships and responsibilities', 'share', 'institutions', 'rules', 'relationships', 'responsibilities'),
    ]),
    term('g1-government', 'Government', D.government, [
      idea('The people and institutions', 'people', 'institutions'),
      idea('They make decisions, set policies and govern', 'decisions', 'decide', 'policies', 'govern', 'rule', 'run'),
    ]),
    term('g1-governance', 'Governance', D.governance, [
      idea('The process and system', 'process', 'system', 'how', 'way'),
      idea('Decisions are made, power is exercised, public affairs are managed', 'decisions', 'power', 'public affairs', 'managed'),
    ]),
    term('g1-rules', 'Rules', D.rules, [
      idea('Agreed instructions', 'agreed', 'agree', 'instructions'),
      idea('They guide behaviour in a group', 'behaviour', 'behave', 'group', 'guide'),
    ]),
    term('g1-laws', 'Laws', D.laws, [
      idea('Official rules', 'official', 'rules'),
      idea('Established and enforced by a recognised authority', 'enforced', 'enforce', 'authority', 'established'),
    ]),
    term('g1-institutions', 'Institutions', D.institutions, [
      idea('Established organisations', 'organisations', 'organisation'),
      idea('They perform important functions in society', 'functions', 'function', 'important', 'society', 'jobs'),
    ]),
    term('g1-power', 'Power', D.power, [
      idea('The ability', 'ability', 'able'),
      idea('To influence people, decisions or actions', 'influence', 'decisions', 'actions', 'control'),
    ]),
    term('g1-authority', 'Authority', D.authority, [
      idea('The recognised, accepted right', 'right', 'recognised', 'accepted'),
      idea('To make decisions and give instructions', 'decisions', 'decide', 'instructions', 'orders'),
    ]),
    term('g1-services', 'Public services', D.services, [
      idea('Services that are provided or organised', 'services', 'provided', 'provide', 'organised'),
      idea("For society's benefit", 'society', 'benefit', 'everyone', 'public', 'people'),
    ]),
    term('g1-participation', 'Political participation', D.participation, [
      idea('The ways citizens take part', 'citizens', 'people', 'ways', 'take part'),
      idea('They influence political decisions', 'influence', 'decisions', 'vote', 'voting'),
    ]),

    choice('g1-q-society', `${which}\n"${D.society}"`, 'Society', ['Government', 'Institutions', 'Governance']),
    choice('g1-q-government', `${which}\n"${D.government}"`, 'Government', ['Governance', 'Society', 'Authority'],
      'Government is WHO governs: the people and institutions.'),
    choice('g1-q-governance', `${which}\n"${D.governance}"`, 'Governance', ['Government', 'Institutions', 'Political participation'],
      'Governance is HOW governing happens: the process and system.'),
    choice('g1-q-rules', `${which}\n"${D.rules}"`, 'Rules', ['Laws', 'Institutions', 'Authority'],
      'Rules are agreed. Laws are enforced.'),
    choice('g1-q-laws', `${which}\n"${D.laws}"`, 'Laws', ['Rules', 'Power', 'Public services'],
      'Rules are agreed. Laws are enforced.'),
    choice('g1-q-institutions', `${which}\n"${D.institutions}"`, 'Institutions', ['Public services', 'Society', 'Government']),
    choice('g1-q-power', `${which}\n"${D.power}"`, 'Power', ['Authority', 'Laws', 'Governance'],
      'Power is the ability. Authority is the right.'),
    choice('g1-q-authority', `${which}\n"${D.authority}"`, 'Authority', ['Power', 'Rules', 'Political participation'],
      'Power is the ability. Authority is the right.'),
    choice('g1-q-services', `${which}\n"${D.services}"`, 'Public services', ['Institutions', 'Laws', 'Political participation']),
    choice('g1-q-participation', `${which}\n"${D.participation}"`, 'Political participation', ['Governance', 'Public services', 'Authority']),
    // The four characteristics of a society (Lesson 1, "Key Concept 01"). Same thing to know as the term itself.
    choice('g1-society-depend', 'Which of these is a characteristic of a society?',
      'People depend on one another',
      ['Everyone believes the same thing', 'Nobody needs to cooperate', 'It must be ruled by a monarch'],
      'A society can be small or large, people depend on one another, it needs cooperation and organisation, and its members hold different interests and beliefs.'),
    choice('g1-society-size', 'Can a society be small as well as large?',
      'Yes: from a local community or a town to a whole country',
      ['No, only a whole country is a society', 'No, only a town is a society', 'Only if it has a government'],
      'A society can be small or large: a local community, a town, a country, a multicultural society.'),
    choice('g1-society-interests', 'Members of a society hold different interests and beliefs. What does the society therefore need?',
      'Cooperation and organisation',
      ['One leader who decides everything', 'Everyone to think the same', 'No rules at all'],
      'Because members hold different interests and beliefs, a society needs cooperation and organisation.'),
  ], [
    // One thing to know per key term: its flashcard and its "which term is this?" question.
    ['g1-society', /^g1-(q-)?society(-[a-z]+)?$/],
    ['g1-government', /^g1-(q-)?government$/],
    ['g1-governance', /^g1-(q-)?governance$/],
    ['g1-rules', /^g1-(q-)?rules$/],
    ['g1-laws', /^g1-(q-)?laws$/],
    ['g1-institutions', /^g1-(q-)?institutions$/],
    ['g1-power', /^g1-(q-)?power$/],
    ['g1-authority', /^g1-(q-)?authority$/],
    ['g1-services', /^g1-(q-)?services$/],
    ['g1-participation', /^g1-(q-)?participation$/],
  ]),
};
