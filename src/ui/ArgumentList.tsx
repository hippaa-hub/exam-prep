// The six critical-thinking questions, to pick one for the Argument Builder.
import type { ArgumentItem } from '../content/types';
import { ARGUMENT_CHECKLIST } from '../content/types';
import { formatShort } from '../engine/dates';
import type { WrittenArgument } from '../engine/writing';

interface Props {
  questions: ArgumentItem[];
  writing: Record<string, WrittenArgument>;
  drafts: Record<string, string[]>;
  onOpen: (id: string) => void;
  onExit: () => void;
}

export function ArgumentList({ questions, writing, drafts, onOpen, onExit }: Props) {
  return (
    <div className="session">
      <header className="session-top">
        <button type="button" className="icon-btn" onClick={onExit} aria-label="Close and go back">✕</button>
        <div className="session-title">Argument Builder</div>
      </header>
      <main className="session-body">
        <p className="muted">
          The thinking questions your teacher uses. Pick one and build your argument in four boxes.
          Written ones can be done again.
        </p>
        <ul className="topic-buttons">
          {questions.map((q) => {
            const done = writing[q.id];
            const started = !done && drafts[q.id]?.some((x) => x.trim());
            return (
              <li key={q.id}>
                <button type="button" className="arg-pick" onClick={() => onOpen(q.id)}>
                  <span className="topic-name">{q.prompt}</span>
                  <span className={done ? 'pct ready' : 'pct'}>
                    {done
                      ? `✓ Written ${formatShort(done.date)} · ${done.ticks.filter(Boolean).length} of ${ARGUMENT_CHECKLIST.length} ticked`
                      : started ? 'Started' : 'Not written yet'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
