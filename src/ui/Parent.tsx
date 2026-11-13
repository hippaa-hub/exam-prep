// The parent's view: how long Adele studied, whether she finished each day, and how ready she is.
// Kept apart from Adele's own screens.
import type { DateKey, Item, ItemId, Pack } from '../content/types';
import { ARGUMENT_BOXES, ARGUMENT_CHECKLIST } from '../content/types';
import { formatLong, formatShort } from '../engine/dates';
import type { SessionRecord, TodayPlan } from '../engine/plan';
import { READY_AT, packReadiness, topicReadiness, type ProgressMap } from '../engine/progress';
import { accuracy, dayReports } from '../engine/report';
import type { Task } from '../engine/tasks';
import { formatDuration, totalSeconds, type StudyTime } from '../engine/time';
import { mockScore, type MockResult, type WrittenArgument } from '../engine/writing';
import { Ring } from './Ring';

interface Props {
  pack: Pack;
  plan: TodayPlan;
  progress: ProgressMap;
  sessions: SessionRecord[];
  daysDone: DateKey[];
  studyTime?: StudyTime;
  mockResults: Record<string, MockResult>;
  writing: Record<string, WrittenArgument>;
  items: Map<ItemId, Item>;
  today: DateKey;
  tasks: Task[];
  mistakeCount: number;
  name: string;
  onClose: () => void;
  onChangeCode: () => void;
}

export function Parent({ pack, plan, progress, sessions, daysDone, studyTime, mockResults, writing, items, today, tasks, mistakeCount, name, onClose, onChangeCode }: Props) {
  const reports = dayReports(pack, sessions, studyTime, daysDone, today);
  const todayReport = reports.find((r) => r.day === today);
  const doneCount = tasks.filter((t) => t.done).length;
  const todayAccuracy = todayReport ? accuracy(todayReport) : null;
  const ready = packReadiness(pack, progress);
  const days = plan.daysToGo;

  return (
    <div className="session">
      <header className="session-top">
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close and go back">✕</button>
        <div className="session-title">For parents</div>
      </header>

      <main className="session-body parent">
        <p className="muted">
          {pack.subject} · {pack.title}<br />
          Exam on {formatLong(pack.date)}
          {days > 0 ? ` (${days} day${days === 1 ? '' : 's'} to go)` : days === 0 ? ' (today)' : ''}
        </p>

        <section className="card" aria-labelledby="p-today">
          <div className="time-today">
            <span className="time-icon" aria-hidden="true">⏱️</span>
            <div>
              <h2 id="p-today" className="label">{name} studied today</h2>
              <p className="time-big">{formatDuration(todayReport?.seconds ?? 0)}</p>
            </div>
          </div>
          <ul className="facts">
            {tasks.length > 0 && (
              <li>
                <span>Today's tasks</span>
                <strong className={doneCount === tasks.length ? 'good' : undefined}>
                  {doneCount === tasks.length ? '✓ All finished' : `${doneCount} of ${tasks.length} done`}
                </strong>
              </li>
            )}
            <li><span>Questions answered</span><strong>{todayReport?.asked ?? 0}</strong></li>
            <li><span>Right first time</span><strong>{todayAccuracy === null ? '–' : `${todayAccuracy}%`}</strong></li>
            <li><span>Waiting in Fix My Mistakes</span><strong>{mistakeCount}</strong></li>
          </ul>
        </section>

        <section className="card" aria-labelledby="p-days">
          <h2 id="p-days">Day by day</h2>
          <table className="days">
            <thead>
              <tr><th scope="col">Day</th><th scope="col">Time</th><th scope="col">Questions</th><th scope="col">Tasks</th></tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.day} className={r.day === today ? 'is-today' : undefined}>
                  <th scope="row">{r.day === today ? 'Today' : formatShort(r.day)}</th>
                  <td>{formatDuration(r.seconds)}</td>
                  <td>{r.asked}</td>
                  <td className={r.finished ? 'good' : undefined}>
                    {r.finished ? '✓ Finished' : r.sessions > 0 || r.seconds > 0 ? 'Part done' : r.day === today ? 'Not yet' : 'No practice'}
                  </td>
                </tr>
              ))}
            </tbody>
            {reports.length > 1 && (
              <tfoot>
                <tr><th scope="row">All days</th><td>{formatDuration(totalSeconds(studyTime))}</td><td>{reports.reduce((n, r) => n + r.asked, 0)}</td><td /></tr>
              </tfoot>
            )}
          </table>
          <p className="muted small">
            Time is the time spent answering questions. Breaks longer than a minute and a half are left out, so a phone
            left open does not add to it. "Questions" counts finished rounds only.
          </p>
        </section>

        {((pack.mocks?.length ?? 0) > 0 || (pack.arguments?.length ?? 0) > 0) && (
          <section className="card" aria-labelledby="p-exam">
            <h2 id="p-exam">Exam practice</h2>
            <ul className="facts">
              {(pack.mocks ?? []).map((m) => {
                const r = mockResults[m.id];
                const sc = r ? mockScore(r, items) : null;
                return (
                  <li key={m.id}>
                    <span>{m.title}{r ? ` · ${formatShort(r.date)} · ${formatDuration(r.seconds)}` : ''}</span>
                    <strong>{r && sc ? `A ${sc.partARight}/${sc.partATotal} · B ${sc.partBTicks}/${sc.partBTotal}` : 'Not done'}</strong>
                  </li>
                );
              })}
              {(pack.arguments?.length ?? 0) > 0 && (
                <li><span>Arguments written</span><strong>{Object.keys(writing).length} of {pack.arguments!.length}</strong></li>
              )}
            </ul>
            <p className="muted small">
              Part A counts answers with the key ideas. Part B counts her own ticks against a {ARGUMENT_CHECKLIST.length}-point checklist.
              It is her own marking: practice, not a grade.
            </p>
            {(pack.arguments ?? []).filter((q) => writing[q.id]).map((q) => (
              <details key={q.id} className="written">
                <summary>{q.prompt}</summary>
                <p className="muted small">
                  Written {formatShort(writing[q.id].date)} · she ticked {writing[q.id].ticks.filter(Boolean).length} of {ARGUMENT_CHECKLIST.length}
                </p>
                {ARGUMENT_BOXES.map((b, i) => <p key={b.label}><em>{b.label}:</em> {writing[q.id].boxes[i]?.trim() || '(nothing written)'}</p>)}
              </details>
            ))}
            {(pack.mocks ?? []).filter((m) => mockResults[m.id]).map((m) => (
              <details key={m.id} className="written">
                <summary>Her answers in {m.title}</summary>
                {mockResults[m.id].partA.map((a) => (
                  <p key={a.id}><em>{items.get(a.id)?.prompt}</em><br />{a.text.trim() || '(nothing written)'}</p>
                ))}
                {mockResults[m.id].partB.map((b) => (
                  <p key={b.id}><em>{pack.arguments?.find((q) => q.id === b.id)?.prompt}</em><br />{b.boxes.map((x) => x.trim()).filter(Boolean).join(' ') || '(nothing written)'}</p>
                ))}
              </details>
            ))}
          </section>
        )}

        <section className="card" aria-labelledby="p-ready">
          <div className="ready-head">
            <div>
              <h2 id="p-ready">How ready is she?</h2>
              <p className="muted">A topic is ready at {READY_AT}%. Something counts as learned once it has been right on three different days, so this grows day by day.</p>
            </div>
            <Ring value={ready} size={84} />
          </div>
          <ul className="topics">
            {pack.topics.map((t) => {
              const pct = topicReadiness(t, progress);
              return (
                <li key={t.id}>
                  <div className="topic-line">
                    <span>{t.short}</span>
                    <span className={pct >= READY_AT ? 'pct ready' : 'pct'}>{pct >= READY_AT ? '✓ ' : ''}{pct}%</span>
                  </div>
                  <div className="meter"><div className={pct >= READY_AT ? 'meter-fill ready' : 'meter-fill'} style={{ width: `${pct}%` }} /></div>
                </li>
              );
            })}
          </ul>
        </section>

        <p className="muted small center">Everything here is saved on this phone only.</p>
        <button type="button" className="text-link" onClick={onChangeCode}>Change the parent code</button>
      </main>
    </div>
  );
}
