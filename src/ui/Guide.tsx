// How to use the app to prepare well. The steps follow the research in PLAN.md section 3;
// the tips for the test itself come from the teacher's material in the exam pack.
import type { DateKey, Pack } from '../content/types';
import { conceptsOf, itemsOf } from '../content/types';
import { formatLong } from '../engine/dates';
import { daysToGo } from '../engine/plan';
import { READY_AT } from '../engine/progress';
import { TODAY_SIZE } from '../engine/session';
import { Mascot } from './Mascot';

const STEPS: { icon: string; title: string; text: string }[] = [
  {
    icon: '▶️',
    title: "Every day, finish today's tasks",
    text: `Home lists a few tasks for the day: two rounds of up to ${TODAY_SIZE} questions, one special activity, and Fix My Mistakes. They open one at a time, so just press Start. When all are ticked, today's preparation is finished. If you want more, "More practice" appears then.`,
  },
  {
    icon: '🧠',
    title: 'Answer from memory',
    text: 'Close your notes first. Trying to remember is what makes it stick, even when you get it wrong. Reading your notes again feels easier but works much less well.',
  },
  {
    icon: '👀',
    title: 'Read the box after every answer',
    text: "It shows your teacher's own wording. Say it once in your head before you press Continue. That is the sentence to use in the test.",
  },
  {
    icon: '🔧',
    title: 'Then empty the Fix list',
    text: 'A question you miss waits in Fix. It leaves the list when you get it right twice. Missing a question here is useful: it shows you what to practise before the test does.',
  },
  {
    icon: '📅',
    title: 'Come back tomorrow',
    text: 'Something counts as fully learned when you get it right on three different days. A little each day beats one long evening before the exam.',
  },
  {
    icon: '🎤',
    title: 'Say it in full sentences',
    text: 'The test asks for definitions and explanations in sentences. When a question has a microphone, tap it and say your whole answer out loud, or type it. The app checks it for the key ideas and then shows your teacher\'s wording. If it misheard you, tap "The app missed something I said". Flashcards read themselves aloud when you flip them: listen, and say it along with the voice.',
  },
  {
    icon: '🧩',
    title: 'Build an argument, then sit the mock exam',
    text: 'Half the test is thinking critically. The Argument Builder gives you four boxes: your argument, a country example, how power is distributed, and another view. The day before the exam, the Mock Exam lets you practise the whole test and shows you what to fix. In the Mock Exam you write every answer, just like the real test.',
  },
  {
    icon: '📋',
    title: 'Fill the tables from memory',
    text: 'The test asks you to compare systems and countries. When a table is one of your tasks, fill it without looking, check it, and try again until every row is right.',
  },
];

export function Guide({ pack, today, onParent }: { pack: Pack; today: DateKey; onParent: () => void }) {
  const left = daysToGo(pack, today);
  const things = conceptsOf(itemsOf(pack)).length;
  return (
    <>
      <header className="page-head">
        <h1>How to get ready</h1>
      </header>

      <div className="hero">
        <Mascot mood="think" size={96} />
        <div className="bubble">
          {left > 0
            ? `Your exam is on ${formatLong(pack.date)}. Here is how to use these ${left} day${left === 1 ? '' : 's'} well.`
            : 'Here is how to use this app well.'}
        </div>
      </div>

      <section className="card" aria-labelledby="steps-h">
        <h2 id="steps-h">Eight steps</h2>
        <ol className="guide-steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="guide-icon" aria-hidden="true">{s.icon}</span>
              <div>
                <h3>{i + 1}. {s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="card tint-accent" aria-labelledby="ring-h">
        <h2 id="ring-h">What the ring means</h2>
        <p>
          This exam has {things} things to know. The ring shows how much of that is learned.
          It starts low and grows each day you come back. A topic turns green at {READY_AT}%.
        </p>
        <p>Don't worry if it looks small at first. Right once is good. Right on three days is learned.</p>
      </section>

      {pack.examTips && pack.examTips.length > 0 && (
        <section className="card" aria-labelledby="tips-h">
          <h2 id="tips-h">In the test itself</h2>
          {pack.examTips.map((tip) => (
            <div key={tip.title} className="tip">
              <h3>{tip.title}</h3>
              <ul className="bullets">
                {tip.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </section>
      )}

      <section className="card tint-good" aria-labelledby="last-h">
        <h2 id="last-h">The last day and exam morning</h2>
        <ul className="bullets">
          <li>The day before: a mixed quiz of everything, then empty the Fix list. Then stop, and sleep well.</li>
          <li>Exam morning: a three-minute warm-up of your weakest questions. Nothing new.</li>
        </ul>
      </section>

      <section className="card" aria-labelledby="parent-h">
        <h2 id="parent-h">For a parent</h2>
        <ul className="bullets">
          <li>The parent view shows how long she studied each day and whether she finished the day's tasks.</li>
          <li>The most useful help: ask her to explain one confusing pair out loud, without notes.</li>
          <li>Two short rounds a day matter more than one long one. Praise coming back, not scores.</li>
          <li>Everything is saved on this phone only. The one exception is the microphone: speaking an answer uses the phone's own speech service (Apple or Google), which needs the internet. Typed answers never leave the phone.</li>
        </ul>
        <button type="button" className="btn ghost" onClick={onParent}>Open the parent view: study time, day by day</button>
      </section>
    </>
  );
}
