import { useEffect, useState } from 'react';
import type { DateKey, Pack } from '../content/types';
import { conceptsOf, itemsOf } from '../content/types';
import { addDays, formatLong, formatShort } from '../engine/dates';
import type { TodayPlan } from '../engine/plan';
import { READY_AT, dueCount, packCeilingToday, packReadiness, seenCount, topicReadiness, type ProgressMap } from '../engine/progress';
import { newBadges, type Badge } from '../engine/rewards';
import { nextTask, type Task } from '../engine/tasks';
import { Mascot, type Mood } from './Mascot';
import { Ring } from './Ring';
import { play } from './sound';

interface Props {
  pack: Pack;
  plan: TodayPlan;
  progress: ProgressMap;
  points: number;
  today: DateKey;
  name: string;
  /** Today's tasks, in order. When all are done, the preparation for today is finished. */
  tasks: Task[];
  finished: boolean;
  /** The days on which every task was finished. */
  daysDone: DateKey[];
  /** What tomorrow is for, if there is a tomorrow before the exam. */
  tomorrow?: string;
  /** True until the Guide has been opened once. */
  showGuideHint: boolean;
  /** True when another day is being previewed with ?today= in the address. */
  preview?: boolean;
  onTask: (task: Task) => void;
  /** Called when today's tasks are all done but today is not yet among `daysDone`, so the day gets its tick. */
  onDayDone?: () => void;
  /** Her badges, earned or not, and the ones she has already been shown. */
  badges?: Badge[];
  badgesSeen?: string[];
  /** Called once the new badges have been shown, with every badge earned so far. */
  onBadgesSeen?: (ids: string[]) => void;
  /** True when the sounds are switched off. */
  muted?: boolean;
  onMute?: (muted: boolean) => void;
  /** How many glossary words the pack has. With any, Home offers Part 2 once the day's tasks are finished. */
  glossaryWords?: number;
  /** True once a round of glossary words has been done today. */
  glossaryDone?: boolean;
  onGlossary?: () => void;
  /** A free round, once the tasks are done (or after the exam). */
  onExtra: () => void;
  /** Opens the extra practice page. Offered only when the day's tasks are finished (or there are none). */
  onPractise: () => void;
  onGuide: () => void;
  /** Opens the parent's view (study time and the day-by-day tracker). */
  onParent: () => void;
}

function countdown(daysToGo: number): { big: string; small: string } {
  if (daysToGo > 1) return { big: String(daysToGo), small: 'days to go' };
  if (daysToGo === 1) return { big: '1', small: 'day to go' };
  if (daysToGo === 0) return { big: 'Today', small: 'is exam day' };
  return { big: 'Done', small: 'past exam' };
}

/**
 * The line under the ring. A thing to know only gains a level on a day it is answered right, so there is a
 * limit to what today can add: this says what that limit is and how much of it is still to go.
 */
function trackText(plan: TodayPlan, ceiling: number, leftToday: number): string {
  if (plan.phase === 'exam-day') return 'Nothing new counts today. Just the warm-up, then go and show what you know.';
  if (leftToday === 0) return 'You have added everything today can add. Each thing counts fully only after three different days, so the rest comes on the days left.';
  return `Today you can reach ${ceiling}%. ${leftToday} ${leftToday === 1 ? 'thing is' : 'things are'} still waiting for a right answer today. Each one counts fully after three different days, so the ring finishes on exam morning.`;
}

/** What Lola says on Home: always the one next thing to do, and how to do it well. */
function lolaSays(plan: TodayPlan, tasks: Task[], finished: boolean, name: string): { text: string; mood: Mood } {
  const next = nextTask(tasks);
  const doneCount = tasks.filter((t) => t.done).length;
  if (plan.phase === 'past') return { text: `The exam is done. Well done, ${name}! You can still practise here.`, mood: 'happy' };
  if (plan.phase === 'exam-day') {
    return finished
      ? { text: `Warm-up done. You are ready, ${name}. Go and show what you know. Good luck!`, mood: 'cheer' }
      : { text: `Today is the day, ${name}! One quick warm-up of your weakest questions. Nothing new.`, mood: 'wave' };
  }
  if (finished) {
    return { text: "Today's preparation is finished! Close the app and rest. Your brain keeps working on it while you sleep.", mood: 'cheer' };
  }
  if (!next) return { text: `Hi ${name}!`, mood: 'wave' };
  if (doneCount === 0) {
    return { text: `Hi ${name}! ${tasks.length} tasks for today. They open one at a time. ${next.tip}`, mood: 'wave' };
  }
  return { text: `Task ${doneCount + 1} of ${tasks.length}. ${next.tip}`, mood: next.kind === 'fix' ? 'think' : 'happy' };
}

export function Home({
  pack, plan, progress, points, today, name, tasks, finished, daysDone, tomorrow, showGuideHint, preview = false, glossaryWords = 0, glossaryDone = false, onGlossary,
  badges = [], badgesSeen, onBadgesSeen, muted = false, onMute, onDayDone, onTask, onExtra, onPractise, onGuide, onParent,
}: Props) {
  const ready = packReadiness(pack, progress);
  const cd = countdown(plan.daysToGo);
  const ceiling = packCeilingToday(pack, progress, today);
  const leftToday = dueCount(itemsOf(pack), progress, today);
  // Keeping up with the countdown: a day is only "behind" when its topics had to be moved onto today.
  const onTrack = plan.catchUp.length === 0;
  const topicName = (id: string) => pack.topics.find((t) => t.id === id)?.short ?? id;
  const all = itemsOf(pack);
  const things = conceptsOf(all).length;
  const lola = lolaSays(plan, tasks, finished, name);
  const next = nextTask(tasks);
  const doneCount = tasks.filter((t) => t.done).length;

  // A finished day is normally recorded when its last task ends. This catches the days that were finished
  // another way (for example, the task list got shorter after an update), so the tick and the badges are right.
  const dayRecorded = daysDone.includes(today);
  useEffect(() => {
    if (finished && !dayRecorded) onDayDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, dayRecorded]);

  // Badges earned since she last looked are announced once: a sound, a banner and a "New" mark.
  const [fresh] = useState(() => newBadges(badges, badgesSeen).map((b) => b.id));
  useEffect(() => {
    if (fresh.length === 0) return;
    play('badge');
    onBadgesSeen?.(badges.filter((b) => b.earned).map((b) => b.id));
    // Only when Home opens: the list is fixed for this visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const earnedCount = badges.filter((b) => b.earned).length;
  const nextBadge = badges.find((b) => !b.earned);

  return (
    <>
      <header className="home-head">
        <div>
          <div className="eyebrow">{pack.subject}</div>
          <h1>{pack.title}</h1>
        </div>
        <div className="head-right">
          {onMute && (
            <button type="button" className="sound-btn" onClick={() => onMute(!muted)} aria-pressed={!muted}
              aria-label={muted ? 'Sounds are off. Turn sounds on' : 'Sounds are on. Turn sounds off'}>
              {muted ? '🔇' : '🔊'}
            </button>
          )}
          <span className="points" aria-label={`${points} points`}>⭐ {points}</span>
        </div>
      </header>

      {preview && <p className="preview-note" role="note">Preview: showing {formatLong(today)}. Remove "?today=…" from the address to go back to the real day.</p>}

      <section className="card countdown-card" aria-label="Countdown and readiness">
        <div className="countdown-row">
          <div className="countdown">
            <div className="countdown-main"><strong>{cd.big}</strong><span>{cd.small}</span></div>
            <small>Exam: {formatLong(pack.date)}</small>
          </div>
          <Ring value={ready} size={84} />
        </div>
        {plan.phase !== 'past' && (
          <p className="track-note">
            <strong className={onTrack ? 'track-ok' : 'track-warn'}>{onTrack ? 'On track' : 'Catching up'}</strong>
            {' '}
            {trackText(plan, ceiling, leftToday)}
          </p>
        )}
      </section>

      <div className="hero">
        <Mascot mood={lola.mood} size={104} />
        <div className="bubble" role="status">{lola.text}</div>
      </div>

      <section className={finished ? 'card today-card tint-good' : 'card today-card'} aria-labelledby="today-h">
        <div className="card-top">
          <span className="card-kicker">Today · {formatShort(today)}</span>
          {tasks.length > 0 && <span className="count-chip">{doneCount} of {tasks.length} done</span>}
        </div>
        <h2 id="today-h">{plan.label}</h2>
        {plan.catchUp.length > 0 && (
          <ul className="chip-list">
            {plan.topics.map((t) => (
              <li key={t} className={plan.catchUp.includes(t) ? 'catch-up' : undefined}>{topicName(t)}</li>
            ))}
          </ul>
        )}
        {plan.catchUp.length > 0 && <p className="muted small">A day was missed, so the plan is spread over the days left.</p>}

        {tasks.length > 0 && (
          <ol className="tasks" aria-label="Today's tasks">
            {tasks.map((t, i) => (
              <li key={t.id}>
                {t.done ? (
                  <div className="task done">
                    <span className="task-num" aria-hidden="true">✓</span>
                    <span className="task-text"><strong>{t.title}</strong><small>Done</small></span>
                  </div>
                ) : t === next ? (
                  <button type="button" className="task next" onClick={() => onTask(t)}>
                    <span className="task-num" aria-hidden="true">{i + 1}</span>
                    <span className="task-text"><strong>{t.title}</strong><small>{t.detail}</small></span>
                    <span className="chev" aria-hidden="true">›</span>
                  </button>
                ) : (
                  // Later tasks stay locked until the one before is finished, so she does them in order.
                  <div className="task locked" aria-disabled="true">
                    <span className="task-num" aria-hidden="true">{i + 1}</span>
                    <span className="task-text">
                      <strong>{t.title}</strong>
                      <small>Opens when you finish task {tasks.indexOf(next!) + 1}</small>
                    </span>
                    <span className="lock" aria-hidden="true">🔒</span>
                    <span className="sr-only">Locked</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}

        {finished ? (
          <>
            <p className="done-today">{plan.phase === 'exam-day' ? '✓ Warm-up done. Good luck in your exam!' : "✓ Today's preparation is finished. Well done!"}</p>
            {tomorrow && <p className="muted">Tomorrow: {tomorrow.charAt(0).toLowerCase() + tomorrow.slice(1)}.</p>}
            {/* Part 2 is optional: the test covers the slides, and the tasks above cover those. */}
            {glossaryWords > 0 && onGlossary && plan.phase !== 'exam-day' && (
              <button type="button" className="btn ghost extra" onClick={onGlossary}>
                {glossaryDone ? 'Glossary words: another round' : 'Part 2: Glossary words'}
                <small>{glossaryDone ? '✓ Done today · 12 more words' : 'Optional · 12 words · about 10 min'}</small>
              </button>
            )}
            <button type="button" className="btn ghost" onClick={onPractise}>More practice</button>
          </>
        ) : next ? (
          <button type="button" className="btn primary big" onClick={() => onTask(next)}>
            {doneCount === 0 ? 'Start' : 'Next task'}
            <small>{next.title}</small>
          </button>
        ) : (
          <>
            <button type="button" className="btn primary big" onClick={onExtra}>
              Mixed quiz
              <small>A mixed quiz of everything</small>
            </button>
            <button type="button" className="btn ghost" onClick={onPractise}>More practice</button>
          </>
        )}
      </section>

      {badges.length > 0 && (
        <section className="card" aria-labelledby="badges-h">
          <div className="card-top">
            <h2 id="badges-h">My badges</h2>
            <span className="count-chip">{earnedCount} of {badges.length}</span>
          </div>
          {fresh.length > 0 && (
            <p className="badge-new" role="status">
              🎉 {fresh.length === 1 ? 'New badge' : `${fresh.length} new badges`}: {badges.filter((b) => fresh.includes(b.id)).map((b) => b.title).join(', ')}
            </p>
          )}
          <ul className="badges">
            {badges.map((b) => (
              <li key={b.id} className={b.earned ? (fresh.includes(b.id) ? 'badge-item earned fresh' : 'badge-item earned') : 'badge-item'}>
                <span className="badge-icon" aria-hidden="true">{b.earned ? b.icon : '🔒'}</span>
                <span className="badge-title">{b.title}</span>
                <span className="sr-only">{b.earned ? 'Earned' : `Not yet. ${b.how}`}</span>
              </li>
            ))}
          </ul>
          {nextBadge
            ? <p className="muted small"><strong>Next badge: {nextBadge.title}.</strong> {nextBadge.how}</p>
            : <p className="muted small"><strong>You have every badge.</strong> Well done!</p>}
        </section>
      )}

      {showGuideHint && (
        <button type="button" className="card link-card tint-accent" onClick={onGuide}>
          <span className="link-icon" aria-hidden="true">📖</span>
          <span>
            <strong>New here? How to get ready</strong>
            <span className="muted">Eight steps to use these days well. One minute to read.</span>
          </span>
          <span className="chev" aria-hidden="true">›</span>
        </button>
      )}

      <section className="card" aria-labelledby="plan-h">
        <h2 id="plan-h">The plan</h2>
        <ol className="plan">
          {pack.plan.map((d) => {
            const date = addDays(pack.date, d.day);
            const state = date === today ? 'now' : date < today ? 'past' : 'next';
            const done = daysDone.includes(date);
            return (
              <li key={d.day} className={done ? `${state} finished` : state}>
                <span className="plan-date">{formatShort(date)}</span>
                <span className="plan-label">{d.label}{done && <span className="plan-tick"> ✓<span className="sr-only"> finished</span></span>}</span>
              </li>
            );
          })}
          <li className={pack.date === today ? 'now' : pack.date < today ? 'past' : 'next'}>
            <span className="plan-date">{formatShort(pack.date)}</span>
            <span className="plan-label">Exam day: a three-minute warm-up</span>
          </li>
        </ol>
      </section>

      <section className="card" aria-labelledby="ready-h">
        <h2 id="ready-h">How ready am I?</h2>
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
        <p className="muted small">
          {seenCount(all, progress)} of {things} things to know tried. Each one counts as fully learned once it has been
          right on three different days, so the ring grows day by day. A topic is ready at {READY_AT}%.
        </p>
      </section>

      <p className="muted small center">Your progress is saved on this phone only.</p>
      <button type="button" className="text-link" onClick={onParent}>For parents</button>
    </>
  );
}
