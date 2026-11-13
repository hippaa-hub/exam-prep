// Phase 2: saying or writing answers, the Argument Builder and the Mock Exam.
// The rule checked throughout: the teacher's wording and example answers appear only after she has given her own.
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import { choice, idea, short, term } from '../content/build';
import type { Pack } from '../content/types';
import { memoryStore } from '../storage/db';

const MODEL = 'Government is the people and institutions that govern. Governance is the process of governing.';
const EXAMPLE = 'One possible answer about fairness, with Switzerland as the example.';
const pack: Pack = {
  id: 'p2', subject: 'Individuals & Societies', title: 'Test exam', date: '2026-11-18', criteria: [],
  topics: [{
    id: 'T', title: 'Topic', short: 'Topic', items: [
      { ...choice('q1', 'Where does power come from in a democracy?', 'The people', ['Inheritance']), concept: 'c1' },
      short('w1', 'c1', 'Explain the difference between government and governance.', [
        idea('Government is WHO governs: the people and institutions', 'people', 'institutions'),
        idea('Governance is HOW governing happens: the process', 'process', 'how'),
      ], MODEL),
    ],
  }],
  plan: [{ day: -4, label: 'Everything', topics: ['T'] }, { day: -1, label: 'Mock day', mock: 'mock-1' }],
  arguments: [{ id: 'd1', prompt: 'Is democracy the fairest system?', example: EXAMPLE }],
  mocks: [{ id: 'mock-1', title: 'Mock Exam 1', minutes: 35, partA: ['w1'], partB: ['d1'] }],
};
const friday = () => new Date(2026, 10, 13, 17, 0);
const tuesday = () => new Date(2026, 10, 17, 17, 0);

afterEach(() => {
  cleanup();
  delete (window as unknown as Record<string, unknown>).SpeechRecognition;
});

const type = (label: string | RegExp, text: string) => fireEvent.change(screen.getByRole('textbox', { name: label }), { target: { value: text } });

/** Goes to the Practise tab. */
async function openPractise(user: ReturnType<typeof userEvent.setup>) {
  await user.click(within(await screen.findByRole('navigation')).getByRole('button', { name: /Practise/ }));
}

/** Opens the "Say it or write it" game, which asks the written question. */
async function openWritten(user: ReturnType<typeof userEvent.setup>) {
  await openPractise(user);
  await user.click(screen.getByRole('button', { name: /Say it or write it/ }));
  expect(screen.getByText('Explain the difference between government and governance.')).toBeInTheDocument();
}

describe('a written answer', () => {
  it('is checked by the app for its key ideas, after she has written it', async () => {
    const user = userEvent.setup();
    const store = memoryStore();
    render(<App store={store} packs={[pack]} now={friday} />);
    await openWritten(user);

    // Nothing is given away before she answers, and two words are not an answer.
    expect(screen.queryByText(MODEL)).toBeNull();
    type('Your answer', 'dont know');
    expect(screen.getByRole('button', { name: 'Check my answer' })).toBeDisabled();

    type('Your answer', 'Government is the people who rule the country.');
    await user.click(screen.getByRole('button', { name: 'Check my answer' }));
    expect(screen.getByRole('status')).toHaveTextContent('Almost!You had 1 of the 2 key ideas.');
    expect(screen.getByText(MODEL)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(store.current?.packs.p2.progress.c1.level).toBe(0);
    expect(store.current?.packs.p2.progress.c1.fix).toBeUndefined(); // "nearly" is not a mistake
  });

  it('counts as right when every key idea is there, spelling slips included', async () => {
    const user = userEvent.setup();
    const store = memoryStore();
    render(<App store={store} packs={[pack]} now={friday} />);
    await openWritten(user);
    type('Your answer', 'Government is the instutions. Governance is the process of deciding.');
    await user.click(screen.getByRole('button', { name: 'Check my answer' }));
    expect(screen.getByRole('status')).toHaveTextContent('✓ Correct!You had the key ideas.');
    expect(screen.getByText(/instutions → institutions/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(store.current?.packs.p2.progress.c1.level).toBe(1);
  });

  it('lets her correct the app when it missed something she said', async () => {
    const user = userEvent.setup();
    const store = memoryStore();
    render(<App store={store} packs={[pack]} now={friday} />);
    await openWritten(user);
    type('Your answer', 'One is the rulers and the other is the way they rule.');
    await user.click(screen.getByRole('button', { name: 'Check my answer' }));
    expect(screen.getByRole('status')).toHaveTextContent('Not yetYou had 0 of the 2 key ideas.');
    await user.click(screen.getByRole('button', { name: 'The app missed something I said' }));
    await user.click(screen.getByRole('checkbox', { name: /Government is WHO governs/ }));
    await user.click(screen.getByRole('checkbox', { name: /Governance is HOW governing happens/ }));
    expect(screen.getByRole('status')).toHaveTextContent('✓ Correct!You had the key ideas.');
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(store.current?.packs.p2.progress.c1.level).toBe(1);
  });
});

describe('saying the answer', () => {
  /** A stand-in for the phone's speech recognition. */
  class FakeRecognition {
    static last: FakeRecognition | null = null;
    lang = ''; continuous = false; interimResults = false;
    onresult: ((e: unknown) => void) | null = null;
    onerror: ((e: unknown) => void) | null = null;
    onend: (() => void) | null = null;
    start() { FakeRecognition.last = this; }
    stop() { this.onend?.(); }
    abort() { this.onend?.(); }
    hear(...phrases: string[]) {
      this.onresult?.({ results: phrases.map((p) => ({ isFinal: true, 0: { transcript: p } })) });
    }
  }

  it('types what she says into the box, and the app checks it', async () => {
    (window as unknown as Record<string, unknown>).SpeechRecognition = FakeRecognition;
    const user = userEvent.setup();
    render(<App store={memoryStore()} packs={[pack]} now={friday} />);
    await openWritten(user);

    await user.click(screen.getByRole('button', { name: /Say your answer/ }));
    expect(FakeRecognition.last?.lang).toBe('en-GB');
    expect(screen.getByRole('button', { name: /Listening/ })).toBeInTheDocument();
    act(() => FakeRecognition.last!.hear('government is the people and institutions', 'governance is the process'));
    expect(screen.getByRole('textbox', { name: 'Your answer' })).toHaveValue('Government is the people and institutions governance is the process');
    await user.click(screen.getByRole('button', { name: /Listening/ })); // tap to stop
    expect(screen.getByRole('button', { name: /Say more/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Check my answer' }));
    expect(screen.getByRole('status')).toHaveTextContent('✓ Correct!You had the key ideas.');
  });

  it('explains what to do if the microphone is not allowed', async () => {
    (window as unknown as Record<string, unknown>).SpeechRecognition = FakeRecognition;
    const user = userEvent.setup();
    render(<App store={memoryStore()} packs={[pack]} now={friday} />);
    await openWritten(user);
    await user.click(screen.getByRole('button', { name: /Say your answer/ }));
    act(() => { FakeRecognition.last!.onerror?.({ error: 'not-allowed' }); FakeRecognition.last!.onend?.(); });
    expect(screen.getByRole('alert')).toHaveTextContent(/microphone is not allowed/i);
    expect(screen.getByRole('textbox', { name: 'Your answer' })).toBeEnabled(); // she can still type
  });

  it('points to the keyboard microphone on phones without in-app speech', async () => {
    const user = userEvent.setup();
    render(<App store={memoryStore()} packs={[pack]} now={friday} />);
    await openWritten(user);
    expect(screen.queryByRole('button', { name: /Say your answer/ })).toBeNull();
    expect(screen.getByText(/microphone key on your keyboard/)).toBeInTheDocument();
  });
});

describe('the Argument Builder', () => {
  it('shows the example answer only after she has written her own, and saves her answer', async () => {
    const user = userEvent.setup();
    const store = memoryStore();
    render(<App store={store} packs={[pack]} now={friday} />);
    await openPractise(user);
    await user.click(screen.getByRole('button', { name: /Argument Builder/ }));
    await user.click(screen.getByRole('button', { name: /Is democracy the fairest system/ }));

    expect(screen.queryByText(EXAMPLE)).toBeNull();
    expect(screen.getByRole('button', { name: 'I have finished' })).toBeDisabled();
    type('My argument', 'I think democracy is fair because people take part.');
    type('A country example', 'In Switzerland citizens vote in referendums.');
    type('How power is distributed', 'Power comes from the people through elections.');
    type('Another view, then my conclusion', 'It can be slow, but overall it is the fairest.');
    await user.click(screen.getByRole('button', { name: 'I have finished' }));

    expect(screen.getByText(EXAMPLE)).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: 'A clear argument' }));
    await user.click(screen.getByRole('checkbox', { name: 'A country example' }));
    await user.click(screen.getByRole('button', { name: 'Finish' }));
    expect(screen.getByText('Argument written!')).toBeInTheDocument();
    expect(screen.getByText('Considers another view')).toBeInTheDocument(); // listed under "Next time, add"

    const saved = store.current?.packs.p2.writing?.d1;
    expect(saved?.boxes[1]).toBe('In Switzerland citizens vote in referendums.');
    expect(saved?.ticks.filter(Boolean)).toHaveLength(2);
  });
});

describe('the Mock Exam', () => {
  it('is the first task the day before the exam, gives no help until she hands in, then says what to fix', async () => {
    // Even on a phone that can listen and speak, the mock exam offers neither: she has to write.
    const w = window as unknown as Record<string, unknown>;
    const spoken: string[] = [];
    w.SpeechRecognition = class { start() {} stop() {} abort() {} };
    w.SpeechSynthesisUtterance = class { constructor(public text: string) {} };
    w.speechSynthesis = { speak: (u: { text: string }) => spoken.push(u.text), cancel: () => {}, getVoices: () => [] };
    const user = userEvent.setup();
    const store = memoryStore();
    render(<App store={store} packs={[pack]} now={tuesday} />);
    const tasks = await screen.findByRole('list', { name: "Today's tasks" });
    expect(within(tasks).getAllByRole('listitem')[0]).toHaveTextContent('Mock Exam');
    await user.click(screen.getByRole('button', { name: /^Start/ }));
    await user.click(screen.getByRole('button', { name: 'Start the exam' }));

    // Part A, then Part B. No teacher's wording and no example on the way.
    expect(screen.getByText('Part A · Question 1 of 1')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Say your answer|Say more/ })).toBeNull();
    expect(screen.queryByText(/microphone key/)).toBeNull();
    type('Your answer', 'Government is the people who rule.');
    expect(screen.queryByText(MODEL)).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Next question' }));
    expect(screen.getByText('Part B · Question 1 of 1')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Say your answer|Say more/ })).toBeNull();
    type('My argument', 'Democracy is the fairest system I think.');
    expect(screen.queryByText(EXAMPLE)).toBeNull();

    // Handing in with empty boxes asks first.
    await user.click(screen.getByRole('button', { name: 'Hand in' }));
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveTextContent('Hand in your exam?');
    await user.click(within(dialog).getByRole('button', { name: 'Hand in' }));

    // Marking: the app checks Part A; she ticks Part B.
    expect(screen.getByText(MODEL)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Almost!You had 1 of the 2 key ideas.');
    await user.click(screen.getByRole('button', { name: 'Next answer' }));
    expect(screen.getByText(EXAMPLE)).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: 'A clear argument' }));
    await user.click(screen.getByRole('button', { name: 'See my result' }));

    expect(screen.getByText('Mock exam done!')).toBeInTheDocument();
    expect(screen.getByText('What to fix')).toBeInTheDocument();
    expect(screen.getByText('Governance is HOW governing happens: the process')).toBeInTheDocument();
    const result = store.current?.packs.p2.mockResults?.['mock-1'];
    expect(result?.partA[0].text).toBe('Government is the people who rule.');
    expect(result?.partB[0].ticks.filter(Boolean)).toHaveLength(1);
    expect(store.current?.packs.p2.sessions.some((s) => s.task === 'mock:mock-1')).toBe(true);

    // The app then leads on to the next task of the day.
    expect(screen.getByRole('button', { name: /Next task/ })).toHaveTextContent('A mixed round of everything');
    expect(spoken).toEqual([]); // nothing was read aloud at any point
    delete w.SpeechSynthesisUtterance;
    delete w.speechSynthesis;
  });
});

describe('reading a flashcard aloud', () => {
  const DEFINITION = 'Agreed instructions that guide behaviour in a group.';
  const cards: Pack = {
    ...pack, id: 'p3', arguments: [], mocks: [],
    topics: [{ id: 'T', title: 'Topic', short: 'Topic', items: [
      term('t1', 'Rules', DEFINITION, [idea('Agreed instructions', 'agreed'), idea('They guide behaviour in a group', 'group')]),
    ] }],
  };
  /** A stand-in for the phone's voice. */
  function fakeVoice() {
    const spoken: string[] = [];
    let cancelled = 0;
    const w = window as unknown as Record<string, unknown>;
    w.SpeechSynthesisUtterance = class { lang = ''; rate = 1; voice: unknown = null; constructor(public text: string) {} };
    w.speechSynthesis = { speak: (u: { text: string }) => spoken.push(u.text), cancel: () => { cancelled++; }, getVoices: () => [] };
    return { spoken, cancelled: () => cancelled };
  }
  afterEach(() => {
    const w = window as unknown as Record<string, unknown>;
    delete w.SpeechSynthesisUtterance;
    delete w.speechSynthesis;
    window.localStorage.clear();
  });
  const openCards = async (user: ReturnType<typeof userEvent.setup>) => {
    await openPractise(user);
    await user.click(screen.getByRole('button', { name: /Key Terms/ }));
  };

  it('reads the card when she says she does not know it yet, and not before', async () => {
    const voice = fakeVoice();
    const user = userEvent.setup();
    const store = memoryStore();
    render(<App store={store} packs={[cards]} now={friday} />);
    await openCards(user);
    expect(voice.spoken).toEqual([]);
    expect(screen.queryByText(DEFINITION)).toBeNull();
    await user.click(screen.getByRole('button', { name: /I don't know yet/ }));
    expect(voice.spoken).toEqual([`Rules. ${DEFINITION}`]);
    expect(screen.getByRole('status')).toHaveTextContent('Not yet');
    await user.click(screen.getByRole('button', { name: /Hear it again/ }));
    expect(voice.spoken).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(store.current?.packs.p3.progress.t1.fix).toBe(0); // it waits in Fix My Mistakes
  });

  it('judges her definition itself, and says and writes Correct, Almost or Not yet', async () => {
    const voice = fakeVoice();
    const user = userEvent.setup();
    const store = memoryStore();
    render(<App store={store} packs={[cards]} now={friday} />);
    await openCards(user);
    expect(screen.queryByRole('button', { name: 'Knew it' })).toBeNull(); // she does not rate herself

    type('Your definition', 'Things people have agreed to do.');
    await user.click(screen.getByRole('button', { name: 'Check my answer' }));
    expect(screen.getByRole('status')).toHaveTextContent('Almost!You had 1 of the 2 key ideas.');
    expect(screen.getByRole('img', { name: '1 of 2 key ideas' })).toBeInTheDocument();
    expect(voice.spoken).toEqual([`Almost! You had 1 of the 2 key ideas. Rules. ${DEFINITION}`]);
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    // The card comes back; this time she has it.
    type('Your definition', 'Agreed instructions for how a group behaves.');
    await user.click(await screen.findByRole('button', { name: 'Check my answer' }));
    expect(screen.getByRole('status')).toHaveTextContent('✓ Correct!You had the key ideas.');
    expect(voice.spoken[1]).toBe(`Correct! You had the key ideas. Rules. ${DEFINITION}`);
  });

  it('can be switched off, and stays off for the next card', async () => {
    const voice = fakeVoice();
    const user = userEvent.setup();
    render(<App store={memoryStore()} packs={[cards]} now={friday} />);
    await openCards(user);
    await user.click(screen.getByRole('button', { name: /I don't know yet/ }));
    await user.click(screen.getByRole('button', { name: 'Read aloud: on' }));
    expect(screen.getByRole('button', { name: 'Read aloud: off' })).toBeInTheDocument();
    const before = voice.spoken.length;
    await user.click(screen.getByRole('button', { name: 'Continue' })); // the card comes back
    await user.click(await screen.findByRole('button', { name: /I don't know yet/ }));
    expect(voice.spoken).toHaveLength(before);
  });

  it('reads in Nicky\'s voice when the phone has it, with no voice menu', async () => {
    fakeVoice();
    const w = window as unknown as { speechSynthesis: { getVoices: () => unknown[]; speak: (u: { voice?: { name: string } }) => void } };
    const used: (string | undefined)[] = [];
    w.speechSynthesis.getVoices = () => [{ name: 'Daniel', lang: 'en-GB' }, { name: 'Martha', lang: 'en-GB' }, { name: 'Samantha', lang: 'en-US' }, { name: 'Nicky', lang: 'en-US' }];
    w.speechSynthesis.speak = (u) => { used.push(u.voice?.name); };
    const user = userEvent.setup();
    render(<App store={memoryStore()} packs={[cards]} now={friday} />);
    await openCards(user);
    await user.click(screen.getByRole('button', { name: /I don't know yet/ }));
    expect(used).toEqual(['Nicky']);
    expect(screen.queryByRole('button', { name: /Change voice/ })).toBeNull();
  });

  it('works quietly on a phone with no voice', async () => {
    const user = userEvent.setup();
    render(<App store={memoryStore()} packs={[cards]} now={friday} />);
    await openCards(user);
    await user.click(screen.getByRole('button', { name: /I don't know yet/ }));
    expect(screen.getByText(DEFINITION)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Hear it again/ })).toBeNull();
  });
});
