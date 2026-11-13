// The checks from PLAN.md section 9, done by a robot: do a session, get something wrong on purpose,
// close and reopen the app, and confirm the mistake comes back.
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import { choice, pair, term } from '../content/build';
import type { Pack } from '../content/types';
import { memoryStore } from '../storage/db';

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
    expect(screen.getByRole('list', { name: "Today's tasks" })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/3 tasks for today\. Close your notes and answer from memory/);
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
    await user.click(screen.getByRole('button', { name: /Fix My Mistakes.*1 question waiting/ }));
    expect(screen.getByText('Where does power come from in a democracy?')).toBeInTheDocument();

    // Right twice, and it leaves the list.
    await user.click(screen.getByRole('button', { name: 'The people' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'The people' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('Good fixing!')).toBeInTheDocument();

    // Fixing it left nothing else to practise today, so that was the last task: the day is finished.
    expect(screen.getByText(/Today's preparation is finished!/)).toBeInTheDocument();
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
