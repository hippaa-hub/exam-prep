import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Item, ItemId, Pack, TopicId } from './content/types';
import { ARGUMENT_CHECKLIST } from './content/types';
import { conceptOf, gameOf, itemsOf } from './content/types';
import { addDays, dateKeyOf } from './engine/dates';
import { pickPack, planFor, type SessionKind } from './engine/plan';
import { applyAnswer, mistakeIds, packReadiness, type ConceptProgress, type Outcome } from './engine/progress';
import { dayReports, reportMessage } from './engine/report';
import { POINTS_FIXED_MISTAKE, POINTS_SESSION } from './engine/rewards';
import { buildFixSession, buildPracticeSession, buildTodaySession, dueToday, type RunSummary } from './engine/session';
import { ARGUMENT_TASK, dayFinished, gameTaskId, mockTaskId, nextTask, tableTaskId, tasksFor, type Task } from './engine/tasks';
import { addStudyTime, creditSeconds, QUESTION_CAP_SECONDS, TABLE_CAP_SECONDS, WRITTEN_CAP_SECONDS } from './engine/time';
import { mockScore, nextArgument, outcomeOfMockAnswer, type MockResult } from './engine/writing';
import { packs as allPacks } from './packs';
import { emptyPackSave, emptySaved, idbStore, type PackSave, type Saved, type Store } from './storage/db';
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
}

export function App({ store = idbStore, packs = allPacks, now = () => new Date() }: AppProps) {
  const [saved, setSaved] = useState<Saved | null>(null);
  const [preview] = useState(previewDay);
  const [today, setToday] = useState(() => preview ?? dateKeyOf(now()));
  const [view, setView] = useState<View>({ name: 'tab', tab: 'home' });
  const savedRef = useRef<Saved | null>(null);
  const nextKey = useRef(1);
  /** When the current question came up, for the study-time counter. */
  const lastTick = useRef(0);

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

  const updatePack = useCallback((packId: string, change: (p: PackSave) => PackSave) => {
    const cur = savedRef.current;
    if (!cur) return;
    const before = cur.packs[packId] ?? emptyPackSave();
    commit({ ...cur, packs: { ...cur.packs, [packId]: change(before) } });
  }, [commit]);

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
  const byId = new Map<ItemId, Item>(itemsOf(pack).map((it) => [it.id, it]));

  /** Save one answer straight away, so nothing is lost if the app is closed mid-session. */
  const answer = (
    id: ItemId, outcome: Outcome, credit = true, countTime = true, dontKnow = false,
  ): { progress: ConceptProgress; fixed: boolean } => {
    const concept = conceptOf(byId.get(id)!);
    const before = (savedRef.current?.packs[pack.id] ?? emptyPackSave()).progress[concept];
    // "I don't know yet" about something she has never met is a first look, not a mistake:
    // it is recorded as seen, stays at level 0 and does not go to Fix My Mistakes.
    const firstLook = dontKnow && (before?.seen ?? 0) === 0;
    const after = applyAnswer(before, firstLook ? 'almost' : outcome, today, id, credit);
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
  const due = dueToday(pack, progress, plan, today);
  const tasks = tasksFor(plan, save.sessions, today, due, mistakes.length);
  const upcoming = nextTask(tasks);
  const finished = dayFinished(tasks);
  /** What a parent gets when she taps "Send my report": today's numbers and the days before. */
  const reportText = reportMessage({
    name: saved.settings.name,
    today,
    reports: dayReports(pack, save.sessions, save.studyTime, save.daysDone ?? [], today),
    tasksDone: tasks.filter((t) => t.done).length,
    tasksTotal: tasks.length,
    ready: packReadiness(pack, progress),
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
      const tasksNow = tasksFor(planNow, sessions, today, dueToday(pack, p.progress, planNow, today), mistakeIds(pack, p.progress).length);
      const daysDone = p.daysDone ?? [];
      return {
        ...p,
        sessions,
        points: p.points + POINTS_SESSION,
        daysDone: dayFinished(tasksNow) && !daysDone.includes(today) ? [...daysDone, today] : daysDone,
      };
    });
  };

  const open = (spec: SessionSpec) => go({ name: 'session', spec, key: nextKey.current++ });
  const currentSave = () => savedRef.current?.packs[pack.id] ?? emptyPackSave();

  /** A round of today's questions. With `guided`, it is one of today's tasks; without, it is extra practice. */
  const startToday = (guided = false) => {
    const rounds = currentSave().sessions.filter((s) => s.kind === 'today' && s.date === today).length;
    const ids = buildTodaySession(pack, currentSave().progress, plan, today);
    const title = plan.phase === 'exam-day' ? 'Warm-up' : guided ? `Round ${Math.min(rounds + 1, 2)}` : 'Extra practice';
    const task = plan.phase === 'exam-day' ? 'warm-up' : rounds === 0 ? 'round-1' : 'round-2';
    open({ kind: 'today', title, topics: plan.topics, ids, task, guided, again: guided ? undefined : () => startToday(false) });
  };
  const startFix = (guided = false) => {
    const ids = buildFixSession(pack, currentSave().progress);
    if (ids.length > 0) open({ kind: 'fix', title: 'Fix My Mistakes', topics: [], ids, task: 'fix', guided });
  };
  const startPractice = (title: string, pool: Item[], task?: string, guided = false) => {
    const start = () => {
      const ids = buildPracticeSession(pool, currentSave().progress, today);
      if (ids.length > 0) open({ kind: 'practice', title, topics: [], ids, task, guided, again: guided ? undefined : start });
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
    if (task.kind === 'round' || task.kind === 'warm-up') startToday(true);
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
        onExit={() => goTab(view.spec.kind === 'practice' && !view.spec.guided ? 'practise' : 'home')}
        onFix={() => startFix(false)}
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
            name={saved.settings.name}
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
            name={saved.settings.name}
            tasks={tasks}
            finished={finished}
            daysDone={save.daysDone ?? []}
            tomorrow={plan.daysToGo > 0 ? planFor(pack, save.sessions, addDays(today, 1)).label : undefined}
            showGuideHint={!saved.settings.guideSeen}
            preview={preview !== null}
            reportText={reportText}
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
