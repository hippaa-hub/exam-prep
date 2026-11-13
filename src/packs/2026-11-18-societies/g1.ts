// G1: the ten key terms ("Know them cold"). Definitions are the teacher's wording.
import { choice, term, withConcepts } from '../../content/build';
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
    term('g1-society', 'Society', D.society),
    term('g1-government', 'Government', D.government),
    term('g1-governance', 'Governance', D.governance),
    term('g1-rules', 'Rules', D.rules),
    term('g1-laws', 'Laws', D.laws),
    term('g1-institutions', 'Institutions', D.institutions),
    term('g1-power', 'Power', D.power),
    term('g1-authority', 'Authority', D.authority),
    term('g1-services', 'Public services', D.services),
    term('g1-participation', 'Political participation', D.participation),

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
  ], [
    // One thing to know per key term: its flashcard and its "which term is this?" question.
    ['g1-society', /^g1-(q-)?society$/],
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
