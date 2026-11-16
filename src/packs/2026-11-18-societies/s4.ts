// S4: the five countries - United Kingdom, Japan, Saudi Arabia, Switzerland, North Korea.
import { cell, choice, country, pair, sys, tableRow, withConcepts } from '../../content/build';
import type { Topic } from '../../content/types';

const CL: [string, string] = ['House of Commons', 'House of Lords'];
const GROUP = 'The five countries';
const COLS = ['System', 'Head of state', 'Head of government', 'How citizens take part'];

const SYSTEM = [
  'Constitutional monarchy + parliamentary democracy',
  'Absolute monarchy',
  'Democracy with direct participation',
  'Authoritarian one-party dictatorship',
];
const STATE = [
  'King Charles III (ceremonial)',
  'Emperor (symbol of the state)',
  'King (extensive executive authority)',
  'Federal Council (collective)',
  'Kim Jong Un',
];
const GOV = ['Prime Minister', 'King', 'Federal Council', "Kim Jong Un and the Workers' Party"];
const PART = [
  'Elect MPs to the House of Commons',
  'Elect members of the National Diet',
  'Limited; a Consultative Council advises',
  'Vote in referendums; launch popular initiatives',
  'Opposition not allowed; media severely restricted',
];

const row = (id: string, name: string, a: string, b: string, c: string, d: string) =>
  tableRow(id, GROUP, name, COLS, [cell(a, SYSTEM), cell(b, STATE), cell(c, GOV), cell(d, PART)]);

const uk = 'United Kingdom: a constitutional monarchy and a parliamentary (representative) democracy. King Charles III is the ceremonial head of state; the Prime Minister is head of government. Citizens elect MPs to the House of Commons.';
const japan = 'Japan: a constitutional monarchy and a parliamentary democracy. The Emperor is the symbol of the state with no governing power; the Prime Minister is head of government. Citizens elect members of the National Diet.';
const saudi = 'Saudi Arabia: an absolute monarchy. The King is head of state and head of government, with extensive executive authority. A Consultative Council advises but is not an elected parliament.';
const swiss = 'Switzerland: a democracy with direct participation (a federal republic). The Federal Council is the collective head of state and government. Citizens vote in referendums and launch popular initiatives.';
const nk = "North Korea: an authoritarian one-party dictatorship led by Kim Jong Un and the Workers' Party. Opposition is not allowed and the media are severely restricted.";

export const s4: Topic = {
  id: 'S4',
  title: 'The five countries',
  short: 'Five countries',
  items: withConcepts([
    row('s4-t-uk', 'United Kingdom', SYSTEM[0], STATE[0], GOV[0], PART[0]),
    row('s4-t-japan', 'Japan', SYSTEM[0], STATE[1], GOV[0], PART[1]),
    row('s4-t-saudi', 'Saudi Arabia', SYSTEM[1], STATE[2], GOV[1], PART[2]),
    row('s4-t-swiss', 'Switzerland', SYSTEM[2], STATE[3], GOV[2], PART[3]),
    row('s4-t-nk', 'North Korea', SYSTEM[3], STATE[4], GOV[3], PART[4]),

    country('s4-c-1', 'Citizens vote in referendums and can launch popular initiatives.', 'Switzerland', swiss),
    country('s4-c-2', 'The head of state is the Federal Council, a collective.', 'Switzerland', swiss),
    country('s4-c-3', 'Citizens elect members of the National Diet.', 'Japan', japan),
    country('s4-c-4', 'The Emperor is the symbol of the state and has no governing power.', 'Japan', japan),
    country('s4-c-5', 'A Consultative Council advises, but it is not an elected parliament.', 'Saudi Arabia', saudi),
    country('s4-c-6', 'The King is both head of state and head of government.', 'Saudi Arabia', saudi),
    country('s4-c-7', 'Citizens elect MPs to the House of Commons in general elections.', 'United Kingdom', uk),
    country('s4-c-8', 'King Charles III is the ceremonial head of state.', 'United Kingdom', uk),
    country('s4-c-9', "Its official name is the Democratic People's Republic of Korea.", 'North Korea', nk),
    country('s4-c-10', 'Opposition is not allowed and the media are severely restricted.', 'North Korea', nk),
    country('s4-c-11', "It is led by one leader and the Workers' Party.", 'North Korea', nk),

    sys('s4-sys-saudi', 'Saudi Arabia: the King has extensive executive authority.', 'Absolute monarchy', saudi),
    sys('s4-sys-nk', "North Korea: one party rules and opposition is not allowed.", 'Dictatorship', nk),
    sys('s4-sys-swiss', 'Switzerland: citizens vote in referendums and launch popular initiatives.', 'Direct democracy', swiss),
    sys('s4-sys-uk-m', 'The United Kingdom has a king, but he is a ceremonial head of state. Which kind of monarchy?', 'Constitutional monarchy', uk),
    sys('s4-sys-uk-d', 'UK citizens elect MPs to the House of Commons. Which kind of democracy?', 'Representative democracy', uk),
    sys('s4-sys-japan-m', 'Japan has an emperor with no governing power. Which kind of monarchy?', 'Constitutional monarchy', japan),
    sys('s4-sys-japan-d', 'Japanese citizens elect members of the National Diet. Which kind of democracy?', 'Representative democracy', japan),

    pair('s4-cl-1', 'Its members are elected.', CL, 'House of Commons', 'UK Parliament = House of Commons (elected) + House of Lords (mostly appointed).'),
    pair('s4-cl-2', 'Its members are mostly appointed.', CL, 'House of Lords', 'UK Parliament = House of Commons (elected) + House of Lords (mostly appointed).'),

    choice('s4-q-uk-both', 'The UK has a king, yet citizens elect representatives. How can it be both a monarchy and a democracy?',
      'The King is the ceremonial head of state, and elected representatives hold political power',
      ['The King chooses all the MPs', 'The King and Parliament take turns to rule', 'It is not really a monarchy'],
      'Monarchy describes the head-of-state position; democracy describes how power is organised. A country can be both.'),
    choice('s4-q-nk-name', 'North Korea holds elections and has "Democratic" in its official name. Is it a genuine democracy?',
      'No. Holding elections or having "democratic" in the name does not make a country a democracy',
      ['Yes, because it holds elections', 'Yes, because of its official name', 'Yes, because it has a leader'], nk),
    choice('s4-q-saudi-council', "What is Saudi Arabia's Consultative Council?",
      'A council that advises, but is not an elected parliament',
      ['An elected parliament that makes the laws', 'The head of state', 'A court that resolves disputes'], saudi),
    // The Japan case-study slide: inherited, a symbol of the state and the unity of the people, a monarchy that runs as a democracy.
    choice('s4-q-japan-inherit', 'How does someone become the Emperor of Japan?',
      'The position is inherited',
      ['Citizens elect the Emperor', 'The National Diet chooses the Emperor', 'The Prime Minister appoints the Emperor'],
      "The Emperor's position is inherited, but the Emperor does not exercise governing power."),
    choice('s4-q-japan-symbol', 'The Emperor of Japan is a symbol, not a ruler. A symbol of what?',
      'The state and the unity of the people',
      ['The armed forces', 'The laws made by the National Diet', "The Prime Minister's power"],
      'The Emperor is a symbol of the state and the unity of the people, not a ruler.'),
    choice('s4-q-japan-both', 'What does Japan show about monarchy and democracy?',
      'A country can preserve a monarchy while operating entirely through democratic institutions',
      ['A monarch must always control the government', 'A country with an emperor cannot hold elections', 'A country must choose: a monarchy or a democracy, never both'],
      'Japan is a monarchy that runs as a democracy: the Emperor is a symbol, citizens elect the National Diet, and the Prime Minister leads the government.'),
    choice('s4-q-two-mon', 'Which two of the five countries are constitutional monarchies and democracies?',
      'The United Kingdom and Japan',
      ['Saudi Arabia and Japan', 'Switzerland and the United Kingdom', 'Saudi Arabia and North Korea'],
      'The UK and Japan are constitutional monarchies with parliamentary democracy.'),
  ], [
    ['s4-united-kingdom', /^s4-(t-uk|c-[78]|sys-uk-[md]|cl-\d|q-uk-both|q-two-mon)$/],
    ['s4-japan', /^s4-(t-japan|c-[34]|sys-japan-[md]|q-japan-(inherit|symbol|both))$/],
    ['s4-saudi-arabia', /^s4-(t-saudi|c-[56]|sys-saudi|q-saudi-council)$/],
    ['s4-switzerland', /^s4-(t-swiss|c-[12]|sys-swiss)$/],
    ['s4-north-korea', /^s4-(t-nk|c-9|c-10|c-11|sys-nk|q-nk-name)$/],
  ]),
};
