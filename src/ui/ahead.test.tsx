// Tomorrow's work can be started early (Jenia, 25 Nov).
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import { pack } from '../packs/2026-11-27-algebra';
import { memoryStore } from '../storage/db';

afterEach(cleanup);

describe("tomorrow's tasks", () => {
  it('lists tomorrow\'s lessons, a practice round and the mock test, all open today', async () => {
    const user = userEvent.setup();
    render(<App store={memoryStore()} packs={[pack]} now={() => new Date(2026, 10, 25, 17, 0)} />);
    const list = await screen.findByRole('list', { name: "Tomorrow's tasks" });
    const buttons = within(list).getAllByRole('button');
    expect(buttons.map((b) => b.querySelector('strong')?.textContent)).toEqual([
      'Learn: Substitution with negative numbers', 'Learn: Patterns and rules', 'Learn: Investigations and explaining',
      "Practice: tomorrow's topics", 'Mock Test 1',
    ]);
    await user.click(buttons[2]);
    expect(screen.getByText(/The 5 investigation steps/)).toBeInTheDocument();
  });

  it('is not shown on the last day before the exam', async () => {
    render(<App store={memoryStore()} packs={[pack]} now={() => new Date(2026, 10, 26, 17, 0)} />);
    await screen.findByRole('list', { name: "Today's tasks" });
    expect(screen.queryByRole('list', { name: "Tomorrow's tasks" })).toBeNull();
  });
});
