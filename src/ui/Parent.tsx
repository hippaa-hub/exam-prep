// The parent's view: how long Adele studied, whether she finished each day, and how ready she is.
// Kept apart from Adele's own screens.
import type { DateKey, Item, ItemId, Pack } from '../content/types';
import { ARGUMENT_BOXES, ARGUMENT_CHECKLIST } from '../content/types';
import { useState } from 'react';
import { formatLong, formatShort } from '../engine/dates';
import { TOPIC_BYTES, topicFrom } from '../engine/notify';
import type { SessionRecord, TodayPlan } from '../engine/plan';
import { READY_AT, topicReadiness, type ProgressMap } from '../engine/progress';
import { RING_BEFORE_WARM_UP, WARM_UP_SHARE, packRing } from '../engine/ring';
import { accuracy, dayReports } from '../engine/report';
import type { Task } from '../engine/tasks';
import { formatDuration, totalSeconds, type StudyTime } from '../engine/time';
import { mockScore, type MockResult, type WrittenArgument } from '../engine/writing';
import type { MathsMockResult } from '../engine/mathsMock';
import { readyVerdict } from '../engine/verdict';
import type { Saved } from '../storage/db';
import { Backup } from './Backup';
import { Ring } from './Ring';
import { ShareText } from './ShareText';

interface Props {
  pack: Pack;
  plan: TodayPlan;
  progress: ProgressMap;
  sessions: SessionRecord[];
  daysDone: DateKey[];
  studyTime?: StudyTime;
  mockResults: Record<string, MockResult>;
  mathsMocks?: Record<string, MathsMockResult>;
  writing: Record<string, WrittenArgument>;
  items: Map<ItemId, Item>;
  today: DateKey;
  tasks: Task[];
  mistakeCount: number;
  /** How many times, per day, she left the app while a question was waiting. */
  leftDuring?: Record<DateKey, number>;
  name: string;
  /** The private channel for notifications to a parent's phone. Unset means they are off. */
  notifyTopic?: string;
  /** Turns notifications on (with a new channel) or off (undefined). */
  onNotifyTopic: (topic: string | undefined) => void;
  /** Sends a test notification. Resolves to true if it went out. */
  onTestNotify: (topic: string) => Promise<boolean>;
  /** Everything saved on this phone, for the backup. */
  saved: Saved;
  /** Replaces everything on this phone with a backup. */
  onRestore: (saved: Saved) => void;
  onClose: () => void;
  onChangeCode: () => void;
}

/** Turning on notifications for a parent's own phone, and the steps to receive them. */
function Notifications({ topic, onTopic, onTest }: { topic?: string; onTopic: Props['onNotifyTopic']; onTest: Props['onTestNotify'] }) {
  const [test, setTest] = useState<'sending' | 'sent' | 'failed' | null>(null);
  const turnOn = () => onTopic(topicFrom(crypto.getRandomValues(new Uint8Array(TOPIC_BYTES))));
  const sendTest = async () => {
    if (!topic) return;
    setTest('sending');
    setTest((await onTest(topic)) ? 'sent' : 'failed');
  };

  return (
    <section className="card" aria-labelledby="p-notify">
      <h2 id="p-notify">Notifications on my phone</h2>
      {topic ? (
        <>
          <p><strong className="good">✓ On.</strong> You get a notification when she starts studying, and a report when she finishes the day's tasks or leaves the app.</p>
          <ol className="notify-steps">
            <li>On <strong>your own</strong> phone, install the free app <strong>ntfy</strong> (App Store or Google Play).</li>
            <li>
              Open ntfy, tap <strong>+</strong> and type this channel name exactly:
              <code className="channel">{topic}</code>
            </li>
            <li>Come back here and tap "Send a test". Your phone should show it within a few seconds.</li>
          </ol>
          <p className="muted small">
            On a computer, open ntfy.sh/{topic} in a browser instead. Keep the channel name private: anyone who knows it
            can see the notifications. They hold study minutes and scores, never a name.
          </p>
          <div className="notify-actions">
            <button type="button" className="btn primary" onClick={sendTest} disabled={test === 'sending'}>Send a test</button>
            {test === 'sent' && <p className="good small center" role="status">✓ Sent. Check your phone.</p>}
            {test === 'failed' && <p className="muted small center" role="status">Could not send it. Is the internet on?</p>}
            <ShareText
              text={`ntfy channel: ${topic}\nhttps://ntfy.sh/${topic}`}
              label="Send the channel name to my phone"
              copiedNote="Copied. Paste it into a message to yourself."
            />
            <button type="button" className="text-link" onClick={() => { setTest(null); onTopic(undefined); }}>Turn notifications off</button>
          </div>
        </>
      ) : (
        <>
          <p className="muted">
            Get a notification on your own phone when she starts studying, and a report when she finishes the day's tasks
            or leaves the app. She does not have to do anything.
          </p>
          <p className="muted small">
            This uses the free ntfy service. While it is on, her study minutes and scores (never her name) are sent over
            the internet to a private channel that only your phone knows. While it is off, nothing leaves this phone.
          </p>
          <button type="button" className="btn primary" onClick={turnOn}>Turn notifications on</button>
        </>
      )}
    </section>
  );
}

export function Parent({ pack, plan, progress, sessions, daysDone, studyTime, mockResults, mathsMocks = {}, writing, items, today, tasks, mistakeCount, leftDuring = {}, name, notifyTopic, onNotifyTopic, onTestNotify, saved, onRestore, onClose, onChangeCode }: Props) {
  const reports = dayReports(pack, sessions, studyTime, daysDone, today);
  const todayReport = reports.find((r) => r.day === today);
  const doneCount = tasks.filter((t) => t.done).length;
  const todayAccuracy = todayReport ? accuracy(todayReport) : null;
  const ready = packRing(pack, progress, sessions);
  const days = plan.daysToGo;
  const verdict = readyVerdict(pack, progress, sessions, ready, mistakeCount, mathsMocks);

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

        <section className={`card verdict-card ${verdict.level}`} aria-labelledby="p-verdict">
          <h2 id="p-verdict">Ready for the test? <strong>{verdict.headline}</strong></h2>
          {verdict.todo.length > 0 && (
            <>
              <p className="label">Still to do</p>
              <ul className="bullets">{verdict.todo.map((t) => <li key={t}>{t}</li>)}</ul>
            </>
          )}
          {verdict.done.length > 0 && (
            <>
              <p className="label">Done</p>
              <ul className="bullets done-list">{verdict.done.map((t) => <li key={t}>✓ {t}</li>)}</ul>
            </>
          )}
        </section>

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
            <li><span>Left the app during a question</span><strong>{leftDuring[today] ?? 0}</strong></li>
          </ul>
          <p className="muted small">
            A phone cannot show a screenshot or notes without leaving the app. When she leaves while a question is waiting,
            the app tells her that the answer will not count, and adds one here. A locked screen or a message counts too,
            so one or two a day is normal.{' '}
            {Object.values(leftDuring).reduce((a, b) => a + b, 0) > (leftDuring[today] ?? 0)
              && `On all days so far: ${Object.values(leftDuring).reduce((a, b) => a + b, 0)}.`}
          </p>
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
              {(pack.mocks ?? []).filter((m) => m.maths).map((m) => {
                const r = mathsMocks[m.id];
                return (
                  <li key={m.id}>
                    <span>{m.title}{r ? ` · ${formatShort(r.date)} · ${formatDuration(r.seconds)}` : ''}</span>
                    <strong>{r ? `B ${r.b} · C ${r.c} · Part 1 ${r.part1.filter((x) => x.outcome === 'right').length}/${r.part1.length}` : 'Not done'}</strong>
                  </li>
                );
              })}
              {(pack.mocks ?? []).filter((m) => !m.maths).map((m) => {
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
            {(pack.mocks ?? []).some((m) => m.maths) ? (
              <p className="muted small">B and C are her own marks out of 8, from the teacher's simplified descriptors. Part 1 is marked by the app. It is practice, not a grade.</p>
            ) : <p className="muted small">
              Part A counts answers with the key ideas. Part B counts her own ticks against a {ARGUMENT_CHECKLIST.length}-point checklist.
              It is her own marking: practice, not a grade.
            </p>}
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
              <p className="muted">A topic is ready at {READY_AT}%. Something counts as learned once it has been right on three different days, so this grows day by day. On the last day before the exam every round counts, so she can fill the ring to {RING_BEFORE_WARM_UP}%. The warm-up on exam morning adds the last {WARM_UP_SHARE}%.</p>
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

        <Notifications topic={notifyTopic} onTopic={onNotifyTopic} onTest={onTestNotify} />

        <p className="muted small center">Her answers and progress are saved on this phone only.</p>
        <Backup saved={saved} today={today} onRestore={onRestore} />
        <StartAgain pack={pack} saved={saved} onRestore={onRestore} />

        <button type="button" className="text-link" onClick={onChangeCode}>Change the parent code</button>
      </main>
    </div>
  );
}

/** Clears this exam's progress only (other exams, the name and the parent code stay), after asking twice. */
function StartAgain({ pack, saved, onRestore }: { pack: Pack; saved: Saved; onRestore: (saved: Saved) => void }) {
  const [ask, setAsk] = useState(false);
  const [done, setDone] = useState(false);
  if (done) return <p className="remember" role="status">Done. "{pack.title}" starts again from zero today.</p>;
  if (!saved.packs[pack.id]) return null;
  return ask ? (
    <section className="start-again">
      <p><strong>Start "{pack.title}" again from zero?</strong> Her answers, points and lesson places for this exam are deleted. Other exams are kept. This cannot be undone.</p>
      <button type="button" className="btn primary" onClick={() => {
        const { [pack.id]: _gone, ...packs } = saved.packs;
        onRestore({ ...saved, packs });
        setDone(true);
      }}>Yes, start again</button>
      <button type="button" className="btn ghost" onClick={() => setAsk(false)}>No, keep it</button>
    </section>
  ) : (
    <button type="button" className="btn ghost" onClick={() => setAsk(true)}>↺ Start this exam again from zero</button>
  );
}
