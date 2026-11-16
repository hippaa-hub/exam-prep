import type { Game, Item, ItemId, Pack } from '../content/types';
import { gameOf, glossaryOf, itemsOf } from '../content/types';
import { formatShort } from '../engine/dates';
import { READY_AT, readiness, topicReadiness, type ProgressMap } from '../engine/progress';
import { mockScore, type MockResult, type WrittenArgument } from '../engine/writing';

interface Props {
  pack: Pack;
  progress: ProgressMap;
  /** `game` is given when a whole game is started, so it can tick off today's task for that game. */
  onStart: (title: string, pool: Item[], game?: Game) => void;
  onTable: (group: string) => void;
  /** A round of glossary words: half met before, half new. */
  onGlossary: () => void;
  mockResults: Record<string, MockResult>;
  writing: Record<string, WrittenArgument>;
  items: Map<ItemId, Item>;
  onArguments: () => void;
  onMock: (id: string) => void;
  onBack: () => void;
}

const GAMES: { game: Game; title: string; blurb: string; icon: string; tone: string }[] = [
  { game: 'key-terms', title: 'Key Terms', blurb: 'Flashcards: say what it means, and the app checks it', icon: '🗂️', tone: 'blue' },
  { game: 'this-or-that', title: 'This or That', blurb: 'The pairs that are easy to mix up', icon: '⚖️', tone: 'purple' },
  { game: 'which-system', title: 'Which system?', blurb: 'Monarchy, democracy or dictatorship', icon: '🏛️', tone: 'green' },
  { game: 'which-responsibility', title: 'Which responsibility?', blurb: 'What is the government doing here?', icon: '🛡️', tone: 'orange' },
  { game: 'quiz', title: 'Quick Quiz', blurb: 'Why, how and who questions', icon: '💡', tone: 'yellow' },
  { game: 'write', title: 'Say it or write it', blurb: 'Full-sentence answers, checked for the key ideas', icon: '🎤', tone: 'blue' },
];

export function Practise({ pack, progress, onStart, onTable, onGlossary, mockResults, writing, items, onArguments, onMock, onBack }: Props) {
  const all = itemsOf(pack);
  const groups = [...new Set(all.flatMap((it) => (it.type === 'table' ? [it.group] : [])))];
  const glossary = glossaryOf(pack);

  return (
    <>
      <header className="page-head">
        <button type="button" className="back-link" onClick={onBack}>‹ Back to Home</button>
        <h1>More practice</h1>
        <p>Extra, for when today's tasks are done. Pick a game. Each round starts with the questions you know least.</p>
      </header>

      <div className="tiles">
        {GAMES.map((g) => {
          const pool = all.filter((it) => gameOf(it) === g.game);
          if (pool.length === 0) return null;
          return (
            <Tile key={g.game} icon={g.icon} tone={g.tone} title={g.title} blurb={g.blurb} pct={readiness(pool, progress)}
              onClick={() => onStart(g.title, pool, g.game)} />
          );
        })}
        {glossary.length > 0 && (
          <Tile icon="📖" tone="purple" title="Glossary words" blurb={`The ${glossary.length} extra words from your teacher's glossary`}
            pct={readiness(glossary, progress)} onClick={onGlossary} />
        )}
        {groups.map((group) => {
          const pool = all.filter((it) => it.type === 'table' && it.group === group);
          return (
            <Tile key={group} icon="📋" tone="accent" title={`Table: ${group.replace(/^The /, '')}`} blurb="Fill the whole table from memory"
              pct={readiness(pool, progress)} onClick={() => onTable(group)} />
          );
        })}
      </div>

      {((pack.arguments?.length ?? 0) > 0 || (pack.mocks?.length ?? 0) > 0) && (
        <section className="card" aria-labelledby="exam-h">
          <h2 id="exam-h">Exam practice</h2>
          <ul className="topic-buttons">
            {(pack.arguments?.length ?? 0) > 0 && (
              <li>
                <button type="button" onClick={onArguments}>
                  <span className="topic-name">🧩 Argument Builder</span>
                  <span className="pct">{Object.keys(writing).length} of {pack.arguments!.length} written</span>
                </button>
              </li>
            )}
            {(pack.mocks ?? []).map((m) => {
              const r = mockResults[m.id];
              const sc = r ? mockScore(r, items) : null;
              return (
                <li key={m.id}>
                  <button type="button" onClick={() => onMock(m.id)}>
                    <span className="topic-name">📝 {m.title}</span>
                    <span className={r ? 'pct ready' : 'pct'}>
                      {r && sc ? `✓ ${formatShort(r.date)} · Part A ${sc.partARight}/${sc.partATotal}` : `About ${m.minutes} min`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="card" aria-labelledby="topics-h">
        <h2 id="topics-h">By topic</h2>
        <ul className="topic-buttons">
          {pack.topics.map((t) => {
            const pct = topicReadiness(t, progress);
            return (
              <li key={t.id}>
                <button type="button" onClick={() => onStart(t.short, t.items)}>
                  <span className="topic-name">{t.title}</span>
                  <span className={pct >= READY_AT ? 'pct ready' : 'pct'}>{pct}%</span>
                  <span className="meter"><span className={pct >= READY_AT ? 'meter-fill ready' : 'meter-fill'} style={{ width: `${pct}%` }} /></span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

function Tile({ icon, tone, title, blurb, pct, onClick }: { icon: string; tone: string; title: string; blurb: string; pct: number; onClick: () => void }) {
  return (
    <button type="button" className="tile" onClick={onClick}>
      <span className={`tile-icon tone-${tone}`} aria-hidden="true">{icon}</span>
      <span className="tile-title">{title}</span>
      <span className="tile-blurb">{blurb}</span>
      <span className="meter" aria-label={`${pct}% ready`}><span className={pct >= READY_AT ? 'meter-fill ready' : 'meter-fill'} style={{ width: `${pct}%` }} /></span>
    </button>
  );
}
