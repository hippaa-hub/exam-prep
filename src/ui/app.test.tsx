// The checks from PLAN.md section 9, done by a robot: do a session, get something wrong on purpose,
// close and reopen the app, and confirm the mistake comes back.
import { act, cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import { choice, pair, term } from '../content/build';
import type { Pack } from '../content/types';
import { conceptOf, itemsOf } from '../content/types';
import type { Note } from '../engine/notify';
import { newProgress, type Level, type ProgressMap } from '../engine/progress';
import { emptyPackSave, emptySaved, memoryStore } from '../storage/db';

const pack: Pack = {
  id: 'test-pack', subject: 'Individuals & Societies', title: 'Test exam', date: '2026-11-18', criteria: [],
  topics: [{
    id: 'T', title: 'Topic', short: 'Topic', items: [
      choice('q1', 'Where does power come from in a democracy?', 'The people', ['Inheritance'], 'Power comes from the people.'),
      pair('q2', 'The ability to influence people.', ['Power', 'Authority'], 'Power', 'Power is the ability. Authority is the right.'),
      term('q3', 'Rules', 'Agreed instructions that guide behaviour in a group.'),
    ],
  }],
  plan: [{ day: -4, label: 'Everything', topics: ['T'] }],
};
const friday = () => new Date(2026, 10, 13, 17, 0);

afterEach(cleanup);

/** Answers whatever question is on screen. Returns once the session summary shows. */
async function playSession(user: ReturnType<typeof userEvent.setup>, wrongOn: string | null) {
  for (let guard = 0; guard < 30; guard++) {
    if (screen.queryByText(/right first time/)) return;
    const next = screen.queryByRole('button', { name: 'Continue' });
    if (next) { await user.click(next); continue; }
    if (screen.queryByRole('button', { name: 'Flip the card' })) {
      // The definition must stay hidden until she flips the card.
      expect(screen.queryByText(/Agreed instructions/)).toBeNull();
      await user.click(screen.getByRole('button', { name: 'Flip the card' }));
      expect(screen.getByText(/Agreed instructions/)).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Knew it' }));
      continue;
    }
    if (screen.queryByText('Where does power come from in a democracy?')) {
      const miss = wrongOn === 'q1' && !screen.queryByText(/Back again/);
      await user.click(screen.getByRole('button', { name: miss ? 'Inheritance' : 'The people' }));
      continue;
    }
    await user.click(screen.getByRole('button', { name: 'Power' }));
  }
  throw new Error('The session did not finish');
}

/** A clock the test can move forward, standing in for the phone's clock. */
function clock() {
  let t = new Date(2026, 10, 13, 17, 0).getTime();
  return { now: () => new Date(t), forward: (seconds: number) => { t += seconds * 1000; } };
}

describe('the app', () => {
  it('shows the countdown and the plan for today', async () => {
    render(<App store={memoryStore()} packs={[pack]} now={friday} />);
    expect(await screen.findByText('Test exam')).toBeInTheDocument();
    expect(screen.getByText('days to go')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '0% ready' })).toBeInTheDocument();
    // Home lists today's tasks and Lola says how to do the first one.
    // The bottom bar has no Practise: it is extra, and only offered when the day's tasks are finished.
    const bar = screen.getByRole('navigation');
    expect(within(bar).getAllByRole('button').map((b) => b.textContent)).toEqual(['🏠Home', '🔧Fix', '📖Guide']);
    expect(screen.queryByRole('button', { name: 'More practice' })).toBeNull();
    const list = screen.getByRole('list', { name: "Today's tasks" });
    expect(within(list).getAllByRole('button')).toHaveLength(1); // only the first task can be opened
    expect(within(list).getByRole('button')).toHaveTextContent('Round 1');
    expect(screen.getByRole('status')).toHaveTextContent(/3 tasks for today\. They open one at a time\. Say or type your answers from memory/);
    expect(screen.getByText('Exam: Wednesday 18 November')).toBeInTheDocument();
  });

  it('brings a mistake back after the app is closed and reopened', async () => {
    const user = userEvent.setup();
    const store = memoryStore();
    const first = render(<App store={store} packs={[pack]} now={friday} />);
    await user.click(await screen.findByRole('button', { name: /^Start/ }));
    await playSession(user, 'q1');

    // The teacher's wording was shown after the miss, and the summary lists it without blame.
    expect(document.querySelector('.summary-score')).toHaveTextContent('2 of 3 right first time');
    expect(screen.getByText('These will come back')).toBeInTheDocument();
    first.unmount();

    // Reopen: same saved data, a fresh app. Round 1 is ticked and the mistake is waiting in today's tasks.
    render(<App store={store} packs={[pack]} now={friday} />);
    expect(await screen.findByText('1 of 3 done')).toBeInTheDocument();

    // Tasks open one at a time: Round 2 is next, and Fix My Mistakes stays locked until it is finished.
    const tasks = screen.getByRole('list', { name: "Today's tasks" });
    expect(within(tasks).getByRole('button', { name: /Round 2/ })).toBeInTheDocument();
    expect(within(tasks).queryByRole('button', { name: /Fix My Mistakes/ })).toBeNull();
    expect(within(tasks).getByText('Opens when you finish task 2')).toBeInTheDocument();

    // The Fix tab is always open, so the mistake itself can still be found there.
    await user.click(within(screen.getByRole('navigation')).getByRole('button', { name: /Fix/ }));
    await user.click(screen.getByRole('button', { name: 'Fix 1 question' }));
    expect(screen.getByText('Where does power come from in a democracy?')).toBeInTheDocument();

    // Right once, and it leaves the list.
    await user.click(screen.getByRole('button', { name: 'The people' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('Good fixing!')).toBeInTheDocument();

    // Fixing it left nothing else to practise today, so every task is now done.
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(within(screen.getByRole('main')).getByText('3 of 3 done')).toBeInTheDocument();
    expect(store.current?.packs['test-pack'].daysDone).toEqual(['2026-11-13']);
  });

  it('counts a day as done only after a session, and saves it', async () => {
    const user = userEvent.setup();
    const store = memoryStore();
    render(<App store={store} packs={[pack]} now={friday} />);
    await user.click(await screen.findByRole('button', { name: /^Start/ }));
    await playSession(user, null);
    // Everything right first time: nothing left for round 2 and nothing to fix, so the day is finished.
    expect(screen.getByText(/Today's preparation is finished!/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.getByText(/Today's preparation is finished. Well done!/)).toBeInTheDocument();
    // Now that everything is ticked, extra practice is offered.
    await user.click(screen.getByRole('button', { name: 'More practice' }));
    expect(screen.getByRole('heading', { name: 'More practice' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Back to Home/ }));
    expect(store.current?.packs['test-pack'].sessions).toHaveLength(1);
    expect(store.current?.packs['test-pack'].points).toBe(10);
    expect(screen.getByRole('img', { name: '33% ready' })).toBeInTheDocument(); // right once, on one day
  });
});

/** Taps a code on the parent keypad. */
async function tapCode(user: ReturnType<typeof userEvent.setup>, code: string) {
  for (const d of code) await user.click(within(screen.getByRole('group', { name: 'Number pad' })).getByRole('button', { name: d }));
}

describe('study time', () => {
  it('adds up the time spent answering and shows it to the parent, not on Adele\'s Home', async () => {
    const user = userEvent.setup();
    const store = memoryStore();
    const c = clock();
    render(<App store={store} packs={[pack]} now={c.now} />);
    await user.click(await screen.findByRole('button', { name: /^Start/ }));

    // Three questions: 40 seconds, 50 seconds, then a 20-minute break before the last one.
    for (const seconds of [40, 50, 20 * 60]) {
      c.forward(seconds);
      if (screen.queryByRole('button', { name: 'Flip the card' })) {
        await user.click(screen.getByRole('button', { name: 'Flip the card' }));
        await user.click(screen.getByRole('button', { name: 'Knew it' }));
      } else {
        await user.click(screen.getByRole('button', { name: screen.queryByText(/This or that/i) ? 'Power' : 'The people' }));
        await user.click(screen.getByRole('button', { name: 'Continue' }));
      }
    }
    // 40 + 50 + 90 (the break is capped) = 180 seconds.
    expect(store.current?.packs['test-pack'].studyTime).toEqual({ '2026-11-13': 180 });
    await user.click(screen.getByRole('button', { name: 'Done' }));

    // Adele's Home has no timer on it...
    expect(screen.queryByText('3 min')).toBeNull();
    expect(screen.queryByText(/studied today/i)).toBeNull();

    // ...and no button for sending a report: a parent gets it without her doing anything.
    expect(screen.queryByRole('button', { name: /report/i })).toBeNull();

    // ...the parent view does, with the day's tasks and questions.
    await user.click(screen.getByRole('button', { name: 'For parents' }));
    await tapCode(user, '2468'); // first time: choose a code...
    await screen.findByRole('heading', { name: 'Type the code again' });
    await tapCode(user, '2468'); // ...and type it again
    expect(await screen.findByRole('heading', { name: 'Adele studied today' })).toBeInTheDocument();
    expect(document.querySelector('.time-big')).toHaveTextContent('3 min');
    expect(screen.getByText('✓ All finished')).toBeInTheDocument();
    const today = screen.getByRole('row', { name: /Today/ });
    expect(today).toHaveTextContent('3 min');
    expect(today).toHaveTextContent('✓ Finished');

    await user.click(screen.getByRole('button', { name: 'Close and go back' }));
    expect(screen.getByRole('list', { name: "Today's tasks" })).toBeInTheDocument();
  });
});

describe('the parent code', () => {
  it('is chosen the first time, and asked for every time after that', async () => {
    const user = userEvent.setup();
    const store = memoryStore();
    const first = render(<App store={store} packs={[pack]} now={friday} />);
    await user.click(await screen.findByRole('button', { name: 'For parents' }));

    // Choosing: the two entries must match.
    expect(screen.getByRole('heading', { name: 'Choose a parent code' })).toBeInTheDocument();
    await tapCode(user, '1357');
    expect(await screen.findByRole('heading', { name: 'Type the code again' })).toBeInTheDocument();
    await tapCode(user, '1358');
    expect(await screen.findByText(/did not match/)).toBeInTheDocument();
    await tapCode(user, '1357');
    await screen.findByRole('heading', { name: 'Type the code again' });
    await tapCode(user, '1357');
    expect(await screen.findByRole('heading', { name: 'Adele studied today' })).toBeInTheDocument();
    expect(store.current?.settings.parentPin).toBeTruthy();
    expect(store.current?.settings.parentPin).not.toContain('1357');

    // Closing locks it again.
    await user.click(screen.getByRole('button', { name: 'Close and go back' }));
    await user.click(screen.getByRole('button', { name: 'For parents' }));
    expect(screen.getByRole('heading', { name: 'Enter the parent code' })).toBeInTheDocument();
    expect(screen.queryByText(/studied today/i)).toBeNull();
    await tapCode(user, '0000');
    expect(await screen.findByText(/not the code/)).toBeInTheDocument();
    expect(screen.queryByText(/studied today/i)).toBeNull();
    first.unmount();

    // It is still asked for after the app is closed and reopened, and the right code opens it.
    render(<App store={store} packs={[pack]} now={friday} />);
    await user.click(await screen.findByRole('button', { name: 'For parents' }));
    expect(screen.getByRole('heading', { name: 'Enter the parent code' })).toBeInTheDocument();
    await tapCode(user, '1357');
    expect(await screen.findByRole('heading', { name: 'Adele studied today' })).toBeInTheDocument();
  });
});

describe("notifications for a parent's phone", () => {
  const channel = 'prep-abcd-efgh-jkmn';
  const withChannel = () => memoryStore({ ...emptySaved(), settings: { ...emptySaved().settings, notifyTopic: channel } });
  /** Stands in for the notification service: remembers what was sent. */
  const outbox = () => {
    const sent: { topic: string; note: Note }[] = [];
    return { sent, publish: vi.fn(async (topic: string, note: Note) => { sent.push({ topic, note }); return true; }) };
  };
  /** The phone's screen goes off (or the app is left), or comes back. */
  const setVisible = (visible: boolean) => act(() => {
    Object.defineProperty(document, 'visibilityState', { value: visible ? 'visible' : 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  afterEach(() => { Reflect.deleteProperty(document, 'visibilityState'); });

  it('sends nothing at all until a parent has turned them on', async () => {
    const user = userEvent.setup();
    const box = outbox();
    render(<App store={memoryStore()} packs={[pack]} now={friday} publish={box.publish} />);
    await user.click(await screen.findByRole('button', { name: /^Start/ }));
    await playSession(user, null);
    setVisible(false);
    expect(box.publish).not.toHaveBeenCalled();
  });

  it('tells the parent when she starts, and sends the report when she finishes the day', async () => {
    const user = userEvent.setup();
    const box = outbox();
    const c = clock();
    render(<App store={withChannel()} packs={[pack]} now={c.now} publish={box.publish} />);
    await screen.findByRole('button', { name: /^Start/ });
    expect(box.sent).toHaveLength(0); // opening the app is not studying

    await user.click(screen.getByRole('button', { name: /^Start/ }));
    expect(box.sent).toHaveLength(1);
    expect(box.sent[0].topic).toBe(channel);
    expect(box.sent[0].note.title).toBe('Study started');
    expect(box.sent[0].note.message).toBe('Fri 13 Nov, 17:00 · Round 1');

    c.forward(60);
    await playSession(user, null);
    expect(box.sent).toHaveLength(2);
    const report = box.sent[1].note;
    expect(report.title).toBe("Today's preparation finished");
    expect(report.message).toContain('this sitting: 1 min');
    expect(report.message).toContain('Studied today: 1 min');
    expect(report.message).toMatch(/All \d+ tasks? finished ✓/);
    expect(report.message).toContain('Questions: 3, 100% right first time');
    // No name goes out.
    expect(box.sent.map((m) => `${m.note.title} ${m.note.message}`).join(' ')).not.toMatch(/Adele/);

    // Closing the app afterwards does not send the report a second time.
    setVisible(false);
    expect(box.sent).toHaveLength(2);
  });

  it('sends the report when she leaves the app half-way, and carries on quietly if she comes straight back', async () => {
    const user = userEvent.setup();
    const box = outbox();
    const c = clock();
    render(<App store={withChannel()} packs={[pack]} now={c.now} publish={box.publish} />);
    await user.click(await screen.findByRole('button', { name: /^Start/ }));
    expect(box.sent.map((m) => m.note.title)).toEqual(['Study started']);

    c.forward(120);
    setVisible(false);
    expect(box.sent.map((m) => m.note.title)).toEqual(['Study started', 'Study stopped']);
    expect(box.sent[1].note.message).toContain('Studied today: 0 min');

    // Back after one minute: the same sitting, no new notification.
    c.forward(60);
    setVisible(true);
    expect(box.sent).toHaveLength(2);

    // Away for ten minutes, then back in the middle of the round: a new sitting.
    setVisible(false);
    expect(box.sent.map((m) => m.note.title)).toEqual(['Study started', 'Study stopped', 'Study stopped']);
    c.forward(600);
    setVisible(true);
    expect(box.sent.map((m) => m.note.title)).toEqual(['Study started', 'Study stopped', 'Study stopped', 'Study started']);
  });

  it('is turned on, tested and turned off in the parent view', async () => {
    const user = userEvent.setup();
    const box = outbox();
    const store = memoryStore();
    render(<App store={store} packs={[pack]} now={friday} publish={box.publish} />);
    await user.click(await screen.findByRole('button', { name: 'For parents' }));
    await tapCode(user, '2468');
    await screen.findByRole('heading', { name: 'Type the code again' });
    await tapCode(user, '2468');
    await screen.findByRole('heading', { name: 'Notifications on my phone' });
    expect(store.current?.settings.notifyTopic).toBeUndefined();

    await user.click(screen.getByRole('button', { name: 'Turn notifications on' }));
    const made = store.current?.settings.notifyTopic;
    expect(made).toMatch(/^prep-[a-z2-9]{4}-[a-z2-9]{4}-[a-z2-9]{4}$/);
    expect(screen.getByText(made!)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Send a test' }));
    expect(await screen.findByText(/Sent. Check your phone/)).toBeInTheDocument();
    expect(box.sent).toEqual([{ topic: made, note: expect.objectContaining({ title: 'Test from the exam prep app' }) }]);

    await user.click(screen.getByRole('button', { name: 'Turn notifications off' }));
    expect(store.current?.settings.notifyTopic).toBeUndefined();
    expect(screen.getByRole('button', { name: 'Turn notifications on' })).toBeInTheDocument();
  });
});

describe('Phase 3: sounds, badges and the backup', () => {
  it('has a sound switch on Home that is remembered', async () => {
    const user = userEvent.setup();
    const store = memoryStore();
    const first = render(<App store={store} packs={[pack]} now={friday} />);
    await user.click(await screen.findByRole('button', { name: /Sounds are on/ }));
    expect(screen.getByRole('button', { name: /Sounds are off/ })).toBeInTheDocument();
    expect(store.current?.settings.muted).toBe(true);
    first.unmount();
    render(<App store={store} packs={[pack]} now={friday} />);
    expect(await screen.findByRole('button', { name: /Sounds are off/ })).toBeInTheDocument();
  });

  it('gives badges for progress made before badges existed, and announces them once', async () => {
    const store = memoryStore({
      ...emptySaved(),
      packs: { 'test-pack': { progress: {}, points: 10, sessions: [{ date: '2026-11-12', kind: 'today', topics: ['T'], asked: 3, firstTimeRight: 3 }] } },
    });
    const first = render(<App store={store} packs={[pack]} now={friday} />);
    expect(await screen.findByText(/New badge: First round/)).toBeInTheDocument();
    expect(screen.getByText(/Next badge: Five rounds/)).toBeInTheDocument();
    expect(store.current?.packs['test-pack'].badgesSeen).toEqual(['first-round']);
    first.unmount();
    render(<App store={store} packs={[pack]} now={friday} />);
    expect(await screen.findByRole('heading', { name: 'My badges' })).toBeInTheDocument();
    expect(screen.queryByText(/New badge/)).toBeNull();
  });

  it('restores a backup in the parent view, after asking first', async () => {
    const user = userEvent.setup();
    const store = memoryStore();
    render(<App store={store} packs={[pack]} now={friday} />);
    await user.click(await screen.findByRole('button', { name: 'For parents' }));
    await tapCode(user, '1357');
    await screen.findByRole('heading', { name: 'Type the code again' });
    await tapCode(user, '1357');
    expect(await screen.findByRole('heading', { name: 'Backup' })).toBeInTheDocument();

    // A file that is not a backup is refused, and nothing changes.
    const picker = screen.getByLabelText('Choose a backup file');
    await user.upload(picker, new File(['not a backup'], 'notes.json', { type: 'application/json' }));
    expect(await screen.findByText(/could not be read/)).toBeInTheDocument();

    const backup = {
      app: 'adele-exam-prep', version: 1, exportedOn: '2026-11-12',
      data: {
        ...emptySaved(),
        packs: { 'test-pack': { progress: {}, points: 70, sessions: [{ date: '2026-11-12', kind: 'today', topics: ['T'], asked: 3, firstTimeRight: 2 }] } },
      },
    };
    await user.upload(picker, new File([JSON.stringify(backup)], 'exam-prep-backup-2026-11-12.json', { type: 'application/json' }));
    expect(await screen.findByRole('heading', { name: 'Replace the progress on this phone?' })).toBeInTheDocument();
    expect(store.current?.packs['test-pack']?.points ?? 0).toBe(0); // nothing replaced until she confirms
    await user.click(screen.getByRole('button', { name: 'Replace with the backup' }));
    expect(await screen.findByText(/Backup restored/)).toBeInTheDocument();
    expect(store.current?.packs['test-pack'].points).toBe(70);
    // The code typed on this phone still works.
    expect(store.current?.settings.parentPin).toBeTruthy();
  });
});

describe('a finished day', () => {
  it('gets its tick even if it was not recorded when the last task ended', async () => {
    // Both rounds were done today and nothing is left to fix, but the day was never marked as finished.
    const round = { date: '2026-11-13', kind: 'today' as const, topics: ['T'], asked: 3, firstTimeRight: 3 };
    const store = memoryStore({ ...emptySaved(), packs: { 'test-pack': { progress: {}, points: 20, sessions: [round, round] } } });
    render(<App store={store} packs={[pack]} now={friday} />);
    expect(await screen.findByText(/Today's preparation is finished\. Well done/)).toBeInTheDocument();
    expect(store.current?.packs['test-pack'].daysDone).toEqual(['2026-11-13']);
  });

  it('is not recorded while tasks are still open', async () => {
    const store = memoryStore();
    render(<App store={store} packs={[pack]} now={friday} />);
    expect(await screen.findByText('Test exam')).toBeInTheDocument();
    expect(store.current?.packs['test-pack']?.daysDone ?? []).toEqual([]);
  });
});

describe('leaving the app during a question', () => {
  /** The app is left (to look at a screenshot, say), or she comes back to it. */
  const setVisible = (visible: boolean) => act(() => {
    Object.defineProperty(document, 'visibilityState', { value: visible ? 'visible' : 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  afterEach(() => { Reflect.deleteProperty(document, 'visibilityState'); });
  const levels = (store: ReturnType<typeof memoryStore>) =>
    Object.values(store.current?.packs['test-pack']?.progress ?? {}).map((p) => p.level).sort();

  it('does not count the answer she gives after coming back, and says so', async () => {
    const user = userEvent.setup();
    const store = memoryStore();
    render(<App store={store} packs={[pack]} now={friday} />);
    await user.click(await screen.findByRole('button', { name: /^Start/ }));

    // A question is waiting. She leaves the app and comes back.
    setVisible(false);
    setVisible(true);
    expect(screen.getByText(/You left the app during this question/)).toBeInTheDocument();

    await playSession(user, null);
    // Three things were answered right, but the one she left on earned no level.
    expect(document.querySelector('.summary-score')).toHaveTextContent('3 of 3 right first time');
    expect(levels(store)).toEqual([0, 1, 1]);
    expect(store.current?.packs['test-pack'].leftDuring).toEqual({ '2026-11-13': 1 });
  });

  it('counts normally when she never leaves, or leaves only after answering', async () => {
    const user = userEvent.setup();
    const store = memoryStore();
    render(<App store={store} packs={[pack]} now={friday} />);
    await user.click(await screen.findByRole('button', { name: /^Start/ }));

    // Answer the first question, whatever it is, then leave while the explanation is on screen.
    for (let guard = 0; guard < 4; guard++) {
      if (screen.queryByRole('button', { name: 'Continue' }) || screen.queryByRole('button', { name: 'Knew it' })) break;
      if (screen.queryByRole('button', { name: 'Flip the card' })) await user.click(screen.getByRole('button', { name: 'Flip the card' }));
      else if (screen.queryByText('Where does power come from in a democracy?')) await user.click(screen.getByRole('button', { name: 'The people' }));
      else await user.click(screen.getByRole('button', { name: 'Power' }));
    }
    setVisible(false);
    setVisible(true);
    expect(screen.queryByText(/You left the app/)).toBeNull();
    if (screen.queryByRole('button', { name: 'Knew it' })) await user.click(screen.getByRole('button', { name: 'Knew it' }));

    await playSession(user, null);
    expect(levels(store)).toEqual([1, 1, 1]);
    expect(store.current?.packs['test-pack'].leftDuring).toBeUndefined();
  });

  it('shows the parent how many times it happened today', async () => {
    const user = userEvent.setup();
    const store = memoryStore({ ...emptySaved(), packs: { 'test-pack': { progress: {}, points: 0, sessions: [], leftDuring: { '2026-11-12': 2, '2026-11-13': 3 } } } });
    render(<App store={store} packs={[pack]} now={friday} />);
    await user.click(await screen.findByRole('button', { name: 'For parents' }));
    await tapCode(user, '1357');
    await screen.findByRole('heading', { name: 'Type the code again' });
    await tapCode(user, '1357');
    const row = (await screen.findByText('Left the app during a question')).closest('li')!;
    expect(row).toHaveTextContent('3');
    expect(screen.getByText(/On all days so far: 5/)).toBeInTheDocument();
  });
});

describe('the last day and exam morning', () => {
  const tuesday = () => new Date(2026, 10, 17, 17, 0); // the day before the exam
  const wednesday = () => new Date(2026, 10, 18, 7, 30); // exam morning
  const days = ['2026-11-14', '2026-11-15', '2026-11-16'];
  /** Saved progress with every thing to know at the same level. */
  const startAt = (level: Level) => {
    const progress: ProgressMap = Object.fromEntries(itemsOf(pack).map((it) => [
      conceptOf(it), { ...newProgress(), level, correctDays: days.slice(0, level), seen: level },
    ]));
    const saved = emptySaved();
    saved.packs[pack.id] = { ...emptyPackSave(), progress };
    return memoryStore(saved);
  };

  it('counts every round on the last day, so finishing the tasks fills the ring to 95%', async () => {
    const user = userEvent.setup();
    const store = startAt(1);
    render(<App store={store} packs={[pack]} now={tuesday} />);
    expect(await screen.findByRole('img', { name: '33% ready' })).toBeInTheDocument();
    expect(screen.getByText(/Today every round counts.*3 things are not full yet\. Fill them and you reach 95%/)).toBeInTheDocument();
    const tasks = screen.getByRole('list', { name: "Today's tasks" });
    expect(within(tasks).getAllByRole('listitem').map((li) => li.querySelector('strong')?.textContent))
      .toEqual(['A mixed round of everything', 'Round 2: what is not full yet', 'Round 3: what is not full yet', 'Fix My Mistakes']);

    // Round 1, all right: one step each. On any other day that would be all today can add.
    await user.click(screen.getByRole('button', { name: /^Start/ }));
    await playSession(user, null);
    await user.click(screen.getByRole('button', { name: /^Next task/ }));
    // Round 2 is a new round, so the same things gain another step: everything is full.
    await playSession(user, null);
    expect(screen.getByText(/Today's preparation is finished!/)).toBeInTheDocument(); // round 3 has nothing left to ask
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.getByRole('img', { name: '95% ready' })).toBeInTheDocument();
    expect(screen.getByText(/Everything is full: 95%\. The last 5% comes with the warm-up on exam morning\./)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /One more round/ })).toBeNull();
    expect(Object.values(store.current!.packs[pack.id].progress).map((p) => p.level)).toEqual([3, 3, 3]);
  });

  it('takes one step away for a miss on the last day, and offers one more round to win it back', async () => {
    const user = userEvent.setup();
    const store = startAt(2);
    render(<App store={store} packs={[pack]} now={tuesday} />);
    await user.click(await screen.findByRole('button', { name: /^Start/ }));
    await playSession(user, 'q1');
    // q1 went from 2 to 1 (not to 0); the other two are full.
    expect(store.current!.packs[pack.id].progress[conceptOf(itemsOf(pack)[0])].level).toBe(1);
    await user.click(screen.getByRole('button', { name: /^Next task/ })); // round 2: only q1 is left
    await playSession(user, null);
    await user.click(screen.getByRole('button', { name: /^Next task/ })); // round 3
    await playSession(user, null);
    expect(store.current!.packs[pack.id].progress[conceptOf(itemsOf(pack)[0])].level).toBe(3);
  });

  it('adds the last 5% with the exam-morning warm-up, and a miss there takes nothing away', async () => {
    const user = userEvent.setup();
    const store = startAt(3);
    render(<App store={store} packs={[pack]} now={wednesday} />);
    expect(await screen.findByRole('img', { name: '95% ready' })).toBeInTheDocument();
    expect(screen.getByText(/The warm-up adds the last 5% of your ring\. A miss takes nothing away today\./)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^Start/ }));
    await playSession(user, 'q1');
    expect(screen.getByText('Read these once more')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.getByRole('img', { name: '100% ready' })).toBeInTheDocument();
    expect(screen.getByText(/Warm-up done, so your ring has its last 5%/)).toBeInTheDocument();
    const q1 = store.current!.packs[pack.id].progress[conceptOf(itemsOf(pack)[0])];
    expect(q1.level).toBe(3);
    expect(q1.fix).toBeUndefined(); // nothing goes to Fix My Mistakes on exam morning
  });
});
