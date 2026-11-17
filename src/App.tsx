import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DateKey, Item, ItemId, Pack, TopicId } from './content/types';
import { ARGUMENT_CHECKLIST } from './content/types';
import { allItemsOf, conceptOf, gameOf, glossaryOf, itemsOf } from './content/types';
import { addDays, dateKeyOf } from './engine/dates';
import { isTopic, RESUME_MS, startNote, stopNote, testNote } from './engine/notify';
import { isSprint, occasionFor, pickPack, planFor, type SessionKind } from './engine/plan';
import { applyAnswer, applyLook, mistakeIds, type ConceptProgress, type Outcome } from './engine/progress';
import { packRing } from './engine/ring';
import { dayReports, reportMessage } from './engine/report';
import { POINTS_FIXED_MISTAKE, POINTS_SESSION } from './engine/rewards';
import { buildFixSession, buildGlossarySession, buildLateSession, buildPracticeSession, buildTodaySession, dueToday, GLOSSARY_IN_MIX, LAST_DAY_SIZE, TODAY_SIZE, type RunSummary } from './engine/session';
import { badgesFor } from './engine/rewards';
import { ARGUMENT_TASK, GLOSSARY_TASK, LATE_TASK, dayFinished, gameTaskId, mockTaskId, nextTask, tableTaskId, tasksFor, type Task } from './engine/tasks';
import { addStudyTime, creditSeconds, QUESTION_CAP_SECONDS, secondsOn, TABLE_CAP_SECONDS, WRITTEN_CAP_SECONDS } from './engine/time';
import { mockScore, nextArgument, outcomeOfMockAnswer, type MockResult } from './engine/writing';
import { packs as allPacks } from './packs';
import { emptyPackSave, emptySaved, idbStore, type PackSave, type Saved, type Store } from './storage/db';
import { ntfyPublish, type Publish } from './storage/notify';
import { ArgumentList } from './ui/ArgumentList';
import { ArgumentScreen } from './ui/ArgumentScreen';
import { Guide } from './ui/Guide';
import { Home } from './ui/Home';
import { Mistakes } from './ui/Mistakes';
import { MockScreen } from './ui/MockScreen';
import { Parent } from './ui/Parent';
import { ParentGate } from './ui/ParentGate';
import { Practise } from './ui/Practise';
import { SessionScreen } from './ui/SessionScreen';
import { setMuted } from './ui/sound';
import { TabBar, type Tab } from './ui/TabBar';
import { TableScreen } from './ui/TableScreen';

export interface SessionSpec {
  kind: SessionKind;
  title: string;
  topics: TopicId[];
  ids: ItemId[];
  /** Offer "Another round" at the end. */
  again?: () => void;
  /** Which of today's tasks this is, if any. */
  task?: string;
  /** Started from today's task list: the summary then offers the next task. */
  guided?: boolean;
  /** An extra round started from Home: "Done" goes back to Home, not to the More practice page. */
  fromHome?: boolean;
}

type View =
  | { name: 'tab'; tab: Tab }
  | { name: 'parent'; key: number }
  | { name: 'session'; spec: SessionSpec; key: number }
  | { name: 'table'; group: string; key: number; guided: boolean }
  | { name: 'arguments' }
  | { name: 'argument'; id: string; key: number; guided: boolean }
  | { name: 'mock'; id: string; key: number; guided: boolean };

/** For looking at another day without waiting for it: add ?today=2026-11-17 to the address. */
function previewDay(): string | null {
  const d = new URLSearchParams(window.location.search).get('today');
  return d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null;
}

interface AppProps {
  store?: Store;
  packs?: Pack[];
  now?: () => Date;
  /** Sends a notification to the parent's phone. Only used once a parent has turned notifications on. */
  publish?: Publish;
}

export function App({ store = idbStore, packs = allPacks, now = () => new Date(), publish = ntfyPublish }: AppProps) {
  const [saved, setSaved] = useState<Saved | null>(null);
  const [preview] = useState(previewDay);
  const [today, setToday] = useState(() => preview ?? dateKeyOf(now()));
  const [view, setView] = useState<View>({ name: 'tab', tab: 'home' });
  const savedRef = useRef<Saved | null>(null);
  const nextKey = useRef(1);
  /** When the current question came up, for the study-time counter. */
  const lastTick = useRef(0);
  /** One stretch of studying, from opening a task until she finishes the day or leaves the app. */
  const sitting = useRef<{ day: DateKey; startSeconds: number; hiddenAt?: number } | null>(null);
  /** The day's report as of the last render, for the notification sent when the app is left. */
  const reportRef = useRef('');

  // Load saved progress once. Opening the app with ?reset at the end of the address wipes it.
  useEffect(() => {
    let alive = true;
    (async () => {
      if (new URLSearchParams(window.location.search).has('reset')) {
        await store.clear();
        window.history.replaceState(null, '', window.location.pathname);
      }
      let loaded = (await store.load()) ?? emptySaved();
      // Opening the app with ?parent-reset at the end of the address forgets the parent code (and nothing else).
      if (new URLSearchParams(window.location.search).has('parent-reset')) {
        const { parentPin: _forgotten, ...settings } = loaded.settings;
        loaded = { ...loaded, settings };
        await store.save(loaded);
        window.history.replaceState(null, '', window.location.pathname);
      }
      if (!alive) return;
      savedRef.current = loaded;
      setSaved(loaded);
    })();
    return () => { alive = false; };
  }, [store]);

  // If the app is left open overnight, notice the new day when she comes back to it.
  useEffect(() => {
    if (preview) return; // a previewed day stays put
    const refresh = () => setToday(dateKeyOf(now()));
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [now, preview]);

  const commit = useCallback((next: Saved) => {
    savedRef.current = next;
    setSaved(next);
    void store.save(next);
  }, [store]);

  const pack = useMemo(() => pickPack(packs, today), [packs, today]);

  // The sound switch is saved with her settings.
  const soundsOff = saved?.settings.muted ?? false;
  useEffect(() => setMuted(soundsOff), [soundsOff]);

  const updatePack = useCallback((packId: string, change: (p: PackSave) => PackSave) => {
    const cur = savedRef.current;
    if (!cur) return;
    const before = cur.packs[packId] ?? emptyPackSave();
    commit({ ...cur, packs: { ...cur.packs, [packId]: change(before) } });
  }, [commit]);

  // ---- Notifications for a parent's phone (off unless a channel is set in the parent view) ----
  const topic = saved?.settings.notifyTopic;
  const studying = view.name === 'session' || view.name === 'table' || view.name === 'argument' || view.name === 'mock';
  const viewKey = 'key' in view ? view.key : 0;
  const packId = pack?.id;
  /** What the listeners below need, as it is right now. */
  const live = useRef<{ topic?: string; studying: boolean; today: DateKey; what?: string; seconds: () => number }>({ studying, today, seconds: () => 0 });
  live.current = {
    topic,
    studying,
    today,
    what: view.name === 'session' ? view.spec.title
      : view.name === 'table' ? `Table: ${view.group}`
      : view.name === 'argument' ? 'Argument Builder'
      : view.name === 'mock' ? 'Mock exam' : undefined,
    seconds: () => secondsOn(savedRef.current?.packs[packId ?? '']?.studyTime, today),
  };

  /** She opened a task: tell the parent once, and remember where the study clock stood. */
  const beginSitting = useCallback(() => {
    const l = live.current;
    if (!isTopic(l.topic) || sitting.current) return;
    sitting.current = { day: l.today, startSeconds: l.seconds() };
    void publish(l.topic, startNote(now(), l.today, l.what));
  }, [publish, now]);

  /** Send the report for the sitting that is open, if any. */
  const reportSitting = useCallback((kind: 'finished' | 'stopped') => {
    const l = live.current;
    const s = sitting.current;
    if (!isTopic(l.topic) || !s) return;
    const sat = s.day === l.today ? l.seconds() - s.startSeconds : 0;
    void publish(l.topic, stopNote(kind, now(), l.today, sat, reportRef.current));
  }, [publish, now]);

  // A task was opened.
  useEffect(() => {
    if (studying) beginSitting();
  }, [studying, viewKey, topic, beginSitting]);

  // The last task of the day was finished: send the report straight away.
  const dayDone = !!packId && (saved?.packs[packId]?.daysDone ?? []).includes(today);
  const wasDone = useRef<boolean | null>(null);
  useEffect(() => {
    if (!saved) return;
    if (wasDone.current === false && dayDone && sitting.current) {
      reportSitting('finished');
      sitting.current = null;
    }
    wasDone.current = dayDone;
  }, [saved, dayDone, reportSitting]);

  // She left the app (closed it, switched away, or the screen locked): send the report.
  // Coming back within a few minutes continues the same sitting quietly.
  useEffect(() => {
    const onHide = () => {
      const s = sitting.current;
      if (!s || s.hiddenAt !== undefined) return;
      reportSitting('stopped');
      s.hiddenAt = now().getTime();
    };
    const onShow = () => {
      const s = sitting.current;
      if (!s || s.hiddenAt === undefined) return;
      if (now().getTime() - s.hiddenAt < RESUME_MS) {
        s.hiddenAt = undefined;
        return;
      }
      sitting.current = null;
      if (live.current.studying) beginSitting();
    };
    const onVisibility = () => (document.visibilityState === 'hidden' ? onHide() : onShow());
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onHide);
    window.addEventListener('pageshow', onShow);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onHide);
      window.removeEventListener('pageshow', onShow);
    };
  }, [now, beginSitting, reportSitting]);

  const go = useCallback((v: View) => {
    if (v.name === 'session' || v.name === 'table') lastTick.current = now().getTime(); // start the clock
    setView(v);
    window.scrollTo(0, 0);
  }, [now]);
  const goTab = useCallback((tab: Tab) => {
    go({ name: 'tab', tab });
    // Opening the Guide once is enough for Home to stop pointing at it.
    const cur = savedRef.current;
    if (tab === 'guide' && cur && !cur.settings.guideSeen) commit({ ...cur, settings: { ...cur.settings, guideSeen: true } });
  }, [go, commit]);

  if (!saved || !pack) {
    return <div className="loading" role="status">{pack ? 'Loading…' : 'No exam packs yet.'}</div>;
  }

  const save = saved.packs[pack.id] ?? emptyPackSave();
  const progress = save.progress;
  const plan = planFor(pack, save.sessions, today);
  const mistakes = mistakeIds(pack, progress);
  const byId = new Map<ItemId, Item>(allItemsOf(pack).map((it) => [it.id, it]));
  /** The stamp right answers are recorded under: the day, or on the last day the round (see occasionFor). */
  const stamp = () => occasionFor(plan, (savedRef.current?.packs[pack.id] ?? emptyPackSave()).sessions, today);
  const when = occasionFor(plan, save.sessions, today);

  /** Save one answer straight away, so nothing is lost if the app is closed mid-session. */
  const answer = (
    id: ItemId, outcome: Outcome, credit = true, countTime = true, dontKnow = false,
  ): { progress: ConceptProgress; fixed: boolean } => {
    const concept = conceptOf(byId.get(id)!);
    const before = (savedRef.current?.packs[pack.id] ?? emptyPackSave()).progress[concept];
    // "I don't know yet" about something she has never met is a first look, not a mistake:
    // it is recorded as seen, stays at level 0 and does not go to Fix My Mistakes.
    const firstLook = dontKnow && (before?.seen ?? 0) === 0;
    // On exam morning a miss takes nothing away: there is no time left to win a level back.
    const after = plan.phase === 'exam-day' && outcome !== 'right'
      ? applyLook(before, stamp(), id)
      : applyAnswer(before, firstLook ? 'almost' : outcome, stamp(), id, credit, isSprint(plan));
    const fixed = before?.fix !== undefined && after.fix === undefined;
    // Study time: the time since the last answer, ignoring long pauses.
    const tick = now().getTime();
    const cap = view.name === 'table' ? TABLE_CAP_SECONDS : byId.get(id)?.type === 'short' ? WRITTEN_CAP_SECONDS : QUESTION_CAP_SECONDS;
    const studied = countTime ? creditSeconds(tick - lastTick.current, cap) : 0;
    lastTick.current = tick;
    updatePack(pack.id, (p) => ({
      ...p,
      studyTime: addStudyTime(p.studyTime, today, studied),
      progress: { ...p.progress, [concept]: after },
      points: p.points + (fixed ? POINTS_FIXED_MISTAKE : 0),
    }));
    return { progress: after, fixed };
  };

  const all = itemsOf(pack);
  const due = dueToday(pack, progress, plan, when);
  const glossary = glossaryOf(pack);
  const wordsInMix = glossary.length ? GLOSSARY_IN_MIX : 0;
  const lateLeft = buildLateSession(pack, progress).length;
  const mockMinutes = (pack.mocks ?? []).find((m) => m.id === plan.mock)?.minutes ?? 35;
  const tasks = tasksFor(plan, save.sessions, today, due, mistakes.length, wordsInMix, lateLeft, mockMinutes);
  const upcoming = nextTask(tasks);
  const finished = dayFinished(tasks);
  // The day's report, kept ready for the notification to a parent's phone.
  reportRef.current = reportMessage({
    today,
    reports: dayReports(pack, save.sessions, save.studyTime, save.daysDone ?? [], today),
    tasksDone: tasks.filter((t) => t.done).length,
    tasksTotal: tasks.length,
    ready: packRing(pack, progress, save.sessions),
    daysToGo: plan.daysToGo,
  });

  const finish = (spec: Pick<SessionSpec, 'kind' | 'topics' | 'task'>, summary: RunSummary) => {
    updatePack(pack.id, (p) => {
      const sessions = [...p.sessions, {
        date: today, kind: spec.kind, topics: spec.topics, asked: summary.asked, firstTimeRight: summary.firstTimeRight,
        task: spec.task,
      }];
      // Was that the last task of the day? Then today's preparation is finished.
      const planNow = planFor(pack, sessions, today);
      const tasksNow = tasksFor(planNow, sessions, today, dueToday(pack, p.progress, planNow, occasionFor(planNow, sessions, today)), mistakeIds(pack, p.progress).length, wordsInMix, buildLateSession(pack, p.progress).length, mockMinutes);
      const daysDone = p.daysDone ?? [];
      return {
        ...p,
        sessions,
        points: p.points + POINTS_SESSION,
        daysDone: dayFinished(tasksNow) && !daysDone.includes(today) ? [...daysDone, today] : daysDone,
      };
    });
  };

  /** She left the app while a question was waiting: counted per day, for the parent view. */
  const noteLeft = () => updatePack(pack.id, (p) => ({
    ...p, leftDuring: { ...(p.leftDuring ?? {}), [today]: (p.leftDuring?.[today] ?? 0) + 1 },
  }));

  const open = (spec: SessionSpec) => go({ name: 'session', spec, key: nextKey.current++ });
  const currentSave = () => savedRef.current?.packs[pack.id] ?? emptyPackSave();

  /** A round of today's questions. With `guided`, it is one of today's tasks; without, it is extra practice. */
  const startToday = (guided = false) => {
    const rounds = currentSave().sessions.filter((s) => s.kind === 'today' && s.date === today).length;
    // On the last day the rounds after the first ask what is not full yet: more questions, and no new glossary words.
    const later = isSprint(plan) && rounds >= 1;
    const ids = buildTodaySession(pack, currentSave().progress, plan, stamp(), Math.random, later ? LAST_DAY_SIZE : TODAY_SIZE, !later);
    const number = Math.min(rounds + 1, isSprint(plan) ? 3 : 2);
    const title = plan.phase === 'exam-day' ? 'Warm-up' : guided ? `Round ${number}` : 'Extra practice';
    const task = plan.phase === 'exam-day' ? 'warm-up' : `round-${number}`;
    open({ kind: 'today', title, topics: plan.topics, ids, task, guided, again: guided ? undefined : () => startToday(false) });
  };
  /** The last day's first task: the questions added after the slide-by-slide check. */
  const startLate = () => {
    const ids = buildLateSession(pack, currentSave().progress);
    if (ids.length > 0) open({ kind: 'practice', title: 'New questions', topics: [], ids, task: LATE_TASK, guided: true });
  };
  const startFix = (guided = false) => {
    const ids = buildFixSession(pack, currentSave().progress);
    if (ids.length > 0) open({ kind: 'fix', title: 'Fix My Mistakes', topics: [], ids, task: 'fix', guided });
  };
  const startPractice = (title: string, pool: Item[], task?: string, guided = false) => {
    const start = () => {
      const ids = buildPracticeSession(pool, currentSave().progress, stamp());
      if (ids.length > 0) open({ kind: 'practice', title, topics: [], ids, task, guided, again: guided ? undefined : start });
    };
    start();
  };
  /** An optional round of glossary words (Part 2): half words she has met before, half new ones. */
  const startGlossary = (fromHome = false) => {
    const start = () => {
      const ids = buildGlossarySession(glossary, currentSave().progress, stamp(), Math.random, undefined, pack.glossaryLast);
      if (ids.length > 0) open({ kind: 'practice', title: 'Glossary words', topics: [], ids, task: GLOSSARY_TASK, fromHome, again: start });
    };
    start();
  };
  const openTable = (group: string, guided = false) => go({ name: 'table', group, key: nextKey.current++, guided });

  /** Time spent on long writing (arguments, the mock exam), counted by the screen's own clock. */
  const addTime = (seconds: number) => updatePack(pack.id, (p) => ({ ...p, studyTime: addStudyTime(p.studyTime, today, seconds) }));
  const saveDraft = (key: string, text: string[]) => updatePack(pack.id, (p) => ({ ...p, drafts: { ...p.drafts, [key]: text } }));
  const dropDraft = (p: PackSave, key: string): PackSave['drafts'] => {
    const { [key]: _done, ...rest } = p.drafts ?? {};
    return rest;
  };

  const openArgument = (id: string, guided = false) => go({ name: 'argument', id, key: nextKey.current++, guided });
  const openMock = (id: string, guided = false) => go({ name: 'mock', id, key: nextKey.current++, guided });

  const finishArgument = (id: string, boxes: string[], ticks: boolean[]) => {
    updatePack(pack.id, (p) => ({ ...p, writing: { ...p.writing, [id]: { date: today, boxes, ticks } }, drafts: dropDraft(p, id) }));
    const all = ticks.filter(Boolean).length === ARGUMENT_CHECKLIST.length;
    finish({ kind: 'practice', topics: [], task: ARGUMENT_TASK }, { asked: 1, firstTimeRight: all ? 1 : 0, missed: [] });
  };

  const finishMock = (id: string, result: MockResult) => {
    // Part A answers count like any other answer: right ones earn a level, missed ones go to Fix My Mistakes.
    for (const a of result.partA) answer(a.id, outcomeOfMockAnswer(byId, a), true, false);
    updatePack(pack.id, (p) => ({ ...p, mockResults: { ...p.mockResults, [id]: result }, drafts: dropDraft(p, id) }));
    const score = mockScore(result, byId);
    finish({ kind: 'practice', topics: [], task: mockTaskId(id) }, {
      asked: score.partATotal + result.partB.length, firstTimeRight: score.partARight, missed: [],
    });
  };

  const startTask = (task: Task) => {
    if (task.id === LATE_TASK) startLate();
    else if (task.kind === 'round' || task.kind === 'warm-up') startToday(true);
    else if (task.kind === 'game') startPractice(task.title, all.filter((it) => gameOf(it) === task.game), task.id, true);
    else if (task.kind === 'table' && task.group) openTable(task.group, true);
    else if (task.kind === 'fix') startFix(true);
    else if (task.kind === 'argument') {
      const q = nextArgument(pack, currentSave().writing);
      if (q) openArgument(q.id, true);
    } else if (task.kind === 'mock' && plan.mock) openMock(plan.mock, true);
  };
  const next = upcoming ? { title: upcoming.title, start: () => startTask(upcoming) } : undefined;

  if (view.name === 'argument') {
    const item = pack.arguments?.find((a) => a.id === view.id);
    if (item) {
      return (
        <ArgumentScreen
          key={view.key}
          item={item}
          draft={save.drafts?.[item.id]}
          onDraft={(boxes) => saveDraft(item.id, boxes)}
          onDone={(boxes, ticks) => finishArgument(item.id, boxes, ticks)}
          onTime={addTime}
          onExit={() => (view.guided ? goTab('home') : go({ name: 'arguments' }))}
          next={view.guided ? next : undefined}
          dayDone={view.guided && finished}
        />
      );
    }
  }

  if (view.name === 'arguments') {
    return (
      <ArgumentList questions={pack.arguments ?? []} writing={save.writing ?? {}} drafts={save.drafts ?? {}}
        onOpen={(id) => openArgument(id)} onExit={() => goTab('practise')} />
    );
  }

  if (view.name === 'mock') {
    const mock = pack.mocks?.find((m) => m.id === view.id);
    if (mock) {
      return (
        <MockScreen
          key={view.key}
          mock={mock}
          pack={pack}
          items={byId}
          draft={save.drafts?.[mock.id]}
          onDraft={(answers) => saveDraft(mock.id, answers)}
          onLeft={noteLeft}
          onDone={(partA, partB, seconds) => {
            const result: MockResult = { date: today, seconds, partA, partB };
            finishMock(mock.id, result);
            return result;
          }}
          onTime={addTime}
          onExit={() => goTab(view.guided ? 'home' : 'practise')}
          next={view.guided ? next : undefined}
          dayDone={view.guided && finished}
        />
      );
    }
  }

  if (view.name === 'session') {
    return (
      <SessionScreen
        key={view.key}
        spec={view.spec}
        items={byId}
        pack={pack}
        onAnswer={(id, outcome, credit, firstLook) => answer(id, outcome, credit, true, firstLook)}
        isNew={(id) => (currentSave().progress[conceptOf(byId.get(id)!)]?.seen ?? 0) === 0}
        onFinish={(summary) => finish(view.spec, summary)}
        onExit={() => goTab(view.spec.kind === 'practice' && !view.spec.guided && !view.spec.fromHome ? 'practise' : 'home')}
        onFix={() => startFix(false)}
        onLeft={noteLeft}
        mistakeCount={mistakes.length}
        next={next}
        dayDone={finished}
        examDay={plan.phase === 'exam-day'}
      />
    );
  }

  if (view.name === 'table') {
    return (
      <TableScreen
        key={view.key}
        group={view.group}
        pack={pack}
        onAnswer={answer}
        onLeft={noteLeft}
        onFinish={(summary) => finish({ kind: 'practice', topics: [], task: tableTaskId(view.group) }, summary)}
        onExit={() => goTab(view.guided ? 'home' : 'practise')}
        next={view.guided ? next : undefined}
        dayDone={view.guided && finished}
      />
    );
  }

  if (view.name === 'parent') {
    return (
      <ParentGate
        key={view.key}
        savedPin={saved.settings.parentPin}
        onSetPin={(parentPin) => commit({ ...savedRef.current!, settings: { ...savedRef.current!.settings, parentPin } })}
        onClose={() => goTab('home')}
      >
        {(changeCode) => (
          <Parent
            pack={pack}
            plan={plan}
            progress={progress}
            sessions={save.sessions}
            daysDone={save.daysDone ?? []}
            studyTime={save.studyTime}
            mockResults={save.mockResults ?? {}}
            writing={save.writing ?? {}}
            items={byId}
            today={today}
            tasks={tasks}
            mistakeCount={mistakes.length}
            leftDuring={save.leftDuring ?? {}}
            name={saved.settings.name}
            notifyTopic={isTopic(saved.settings.notifyTopic) ? saved.settings.notifyTopic : undefined}
            onNotifyTopic={(notifyTopic) => {
              const { notifyTopic: _old, ...settings } = savedRef.current!.settings;
              commit({ ...savedRef.current!, settings: notifyTopic ? { ...settings, notifyTopic } : settings });
            }}
            onTestNotify={(t) => publish(t, testNote(now()))}
            saved={saved}
            onRestore={(backup) => {
              // The code just typed on this phone stays, so restoring never locks the parent out.
              const parentPin = savedRef.current?.settings.parentPin ?? backup.settings.parentPin;
              commit({ ...backup, settings: { ...backup.settings, ...(parentPin ? { parentPin } : {}) } });
            }}
            onClose={() => goTab('home')}
            onChangeCode={changeCode}
          />
        )}
      </ParentGate>
    );
  }

  // Any other view (for example a question that no longer exists) falls back to Home.
  const tab: Tab = view.name === 'tab' ? view.tab : 'home';

  return (
    <div className="app">
      <main className="page">
        {tab === 'home' && (
          <Home
            pack={pack}
            plan={plan}
            progress={progress}
            points={save.points}
            today={today}
            when={when}
            ring={packRing(pack, progress, save.sessions)}
            name={saved.settings.name}
            tasks={tasks}
            finished={finished}
            onDayDone={() => updatePack(pack.id, (p) => (
              (p.daysDone ?? []).includes(today) ? p : { ...p, daysDone: [...(p.daysDone ?? []), today] }
            ))}
            badges={plan.phase === 'past' ? [] : badgesFor(pack, save)}
            badgesSeen={save.badgesSeen}
            onBadgesSeen={(ids) => updatePack(pack.id, (p) => ({ ...p, badgesSeen: ids }))}
            muted={soundsOff}
            onMute={(muted) => commit({ ...savedRef.current!, settings: { ...savedRef.current!.settings, muted } })}
            glossaryWords={glossary.length}
            glossaryDone={save.sessions.some((x) => x.date === today && x.task === GLOSSARY_TASK)}
            onGlossary={() => startGlossary(true)}
            daysDone={save.daysDone ?? []}
            tomorrow={plan.daysToGo > 0 ? planFor(pack, save.sessions, addDays(today, 1)).label : undefined}
            showGuideHint={!saved.settings.guideSeen}
            preview={preview !== null}
            onTask={startTask}
            onExtra={() => startToday(false)}
            onPractise={() => goTab('practise')}
            onGuide={() => goTab('guide')}
            onParent={() => go({ name: 'parent', key: nextKey.current++ })}
          />
        )}
        {tab === 'practise' && (
          <Practise
            pack={pack}
            progress={progress}
            mockResults={save.mockResults ?? {}}
            writing={save.writing ?? {}}
            items={byId}
            onStart={(title, pool, game) => startPractice(title, pool, game ? gameTaskId(game) : undefined)}
            onTable={(group) => openTable(group)}
            onGlossary={() => startGlossary()}
            onArguments={() => go({ name: 'arguments' })}
            onMock={(id) => openMock(id)}
            onBack={() => goTab('home')}
          />
        )}
        {tab === 'guide' && <Guide pack={pack} today={today} onParent={() => go({ name: 'parent', key: nextKey.current++ })} />}
        {tab === 'mistakes' && (
          <Mistakes pack={pack} progress={progress} ids={mistakes} items={byId} onStart={() => startFix(false)} />
        )}
      </main>
      <TabBar tab={tab} onChange={goTab} mistakeCount={mistakes.length} />
    </div>
  );
}
