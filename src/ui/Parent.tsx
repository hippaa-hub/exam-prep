// The parent's view: how long Adele studied, whether she finished each day, and how ready she is.
// Kept apart from Adele's own screens.
import type { DateKey, Pack } from '../content/types';
import { formatLong, formatShort } from '../engine/dates';
import type { SessionRecord, TodayPlan } from '../engine/plan';
import { READY_AT, packReadiness, topicReadiness, type ProgressMap } from '../engine/progress';
import { accuracy, dayReports } from '../engine/report';
import type { Task } from '../engine/tasks';
import { formatDuration, totalSeconds, type StudyTime } from '../engine/time';
import { Ring } from './Ring';

interface Props {
  pack: Pack;
  plan: TodayPlan;
  progress: ProgressMap;
  sessions: SessionRecord[];
  daysDone: DateKey[];
  studyTime?: StudyTime;
  today: DateKey;
  tasks: Task[];
  mistakeCount: number;
  name: string;
  onClose: () => void;
  onChangeCode: () => void;
}

export function Parent({ pack, plan, progress, sessions, daysDone, studyTime, today, tasks, mistakeCount, name, onClose, onChangeCode }: Props) {
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
