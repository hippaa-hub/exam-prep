// G4: the four main responsibilities of government (a test favourite).
import { choice, resp, withConcepts } from '../../content/build';
import type { Topic } from '../../content/types';

const order = 'This is maintaining public order. That means laws and regulations, public safety, preventing crime and resolving disputes.';
const protect = 'This is protecting citizens. That means safety and rights, emergencies and defence.';
const services = 'This is providing public services. That means education, healthcare, roads and water.';
const enforce = 'This is enforcing laws. That means making sure laws are followed, investigating, and legal consequences.';

export const g4: Topic = {
  id: 'G4',
  title: 'The four responsibilities of government',
  short: 'Four responsibilities',
  items: withConcepts([
    // The teacher's own situations
    resp('g4-traffic', 'A city introduces traffic rules.', 'Maintaining public order', order),
    resp('g4-schools', 'The government funds public schools.', 'Providing public services', services),
    resp('g4-earthquake', 'Emergency services respond to an earthquake.', 'Protecting citizens', protect),
    resp('g4-courts', 'Courts deal with people who break the law.', 'Enforcing laws', enforce),
    resp('g4-stealing', 'A person is arrested for stealing.', 'Enforcing laws', 'This is enforcing laws: someone broke the law and faces the consequences. It protects property rights.'),
    resp('g4-hospital', 'The government builds a hospital.', 'Providing public services', 'This is providing public services: a hospital gives people access to healthcare.'),

    // New situations, same four responsibilities
    resp('g4-defence', "The armed forces defend the country.", 'Protecting citizens', protect),
    resp('g4-roads', 'Damaged roads are repaired.', 'Providing public services', services),
    resp('g4-water', 'Clean water is supplied to homes.', 'Providing public services', services),
    resp('g4-investigate', 'Officers investigate who broke the law.', 'Enforcing laws', enforce),
    resp('g4-consequence', 'Someone who broke the law faces legal consequences.', 'Enforcing laws', enforce),
    resp('g4-prevent', 'Police patrol the streets to prevent crime.', 'Maintaining public order', order),
    resp('g4-flood', 'Rescue teams help families during a flood emergency.', 'Protecting citizens', protect),
    resp('g4-newschool', 'A new public school opens in a growing town.', 'Providing public services', services),

    // What each responsibility means
    resp('g4-m-order', 'Laws and regulations, public safety, preventing crime, resolving disputes.', 'Maintaining public order', order),
    resp('g4-m-protect', 'Safety and rights, emergencies, defence.', 'Protecting citizens', protect),
    resp('g4-m-services', 'Education, healthcare, roads, water.', 'Providing public services', services),
    resp('g4-m-enforce', 'Making sure laws are followed, investigating, legal consequences.', 'Enforcing laws', enforce),

    choice('g4-list', 'Which list shows the four main responsibilities of governments?',
      'Maintaining public order, protecting citizens, providing public services, enforcing laws',
      ['Maintaining public order, controlling the media, providing public services, enforcing laws',
        'Holding referendums, protecting citizens, choosing the monarch, enforcing laws',
        'Maintaining public order, protecting citizens, suppressing opposition, writing propaganda'],
      'The four main responsibilities: maintaining public order, protecting citizens, providing public services, enforcing laws.'),
    choice('g4-judge', 'A judge decides a dispute between two people. Why does this matter?',
      'It prevents private revenge and keeps the rule of law',
      ['It lets the stronger person win', 'It replaces the need for laws', 'It gives the judge power without authority'],
      'A judge decides a dispute: judicial authority. It prevents private revenge and keeps the rule of law.'),
    choice('g4-example-order', 'Which example goes with "maintaining public order"?',
      'Police and courts; traffic rules', ['Public schools and hospitals', 'National defence', 'Referendums'], order),
    choice('g4-example-protect', 'Which example goes with "protecting citizens"?',
      'Emergency services and national defence', ['Traffic rules', 'Public schools and hospitals', 'Elections'], protect),
    // Slide 19 answer key: why the responsibility matters.
    choice('g4-why-stealing', 'A person is arrested for stealing. Why does enforcing the law here matter?',
      'It protects property rights and personal safety',
      ['It provides a public service', 'It makes the thief a citizen', 'It gives the police more power'],
      'Enforcing laws protects property rights and personal safety.'),
    choice('g4-why-hospital', 'A government builds a new public hospital. Why does this matter?',
      'It ensures access to healthcare regardless of income',
      ['It enforces the law', 'It protects the country from external threats', 'It keeps the roads safe'],
      'Providing public services such as healthcare ensures access for everyone, regardless of income.'),
  ], [
    ['g4-public-order', /^g4-(traffic|prevent|m-order|example-order)$/],
    ['g4-protecting', /^g4-(earthquake|defence|flood|m-protect|example-protect)$/],
    ['g4-services', /^g4-(schools|hospital|roads|water|newschool|m-services|why-hospital)$/],
    ['g4-enforcing', /^g4-(courts|stealing|investigate|consequence|m-enforce|why-stealing)$/],
    ['g4-all-four', /^g4-(list|judge)$/],
  ]),
};
