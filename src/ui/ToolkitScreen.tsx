// "My toolkit": the system for every kind of problem on the test. Tap a tool to open it:
// when to use it, the steps, then a worked example revealed one line at a time.
import { useState } from 'react';
import type { Method, Pack } from '../content/types';
import { Mascot } from './Mascot';

export function ToolkitScreen({ pack, onPractise, onExit }: { pack: Pack; onPractise: (topic: string, title: string) => void; onExit: () => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const tools = pack.toolkit ?? [];
  return (
    <div className="session">
      <header className="session-top">
        <button type="button" className="icon-btn" onClick={onExit} aria-label="Close and go back">✕</button>
        <div className="session-title">🧰 My toolkit</div>
      </header>
      <main className="session-body">
        <div className="hero">
          <Mascot mood="happy" size={88} />
          <div className="bubble">Every kind of problem has a system. Here they all are, step by step. Tap one to open it.</div>
        </div>
        <ol className="tools">
          {tools.map((m, i) => (
            <li key={m.id}>
              <button type="button" className={`tool-head${open === m.id ? ' open' : ''}`} aria-expanded={open === m.id}
                onClick={() => setOpen(open === m.id ? null : m.id)}>
                <span className="tool-emoji" aria-hidden="true">{m.emoji}</span>
                <span className="tool-title"><small>Tool {i + 1}</small>{m.title}</span>
                <span className="chev" aria-hidden="true">{open === m.id ? '▾' : '›'}</span>
              </button>
              {open === m.id && <Tool method={m} onPractise={() => onPractise(m.topic, m.title)} />}
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}

function Tool({ method: m, onPractise }: { method: Method; onPractise: () => void }) {
  const [lines, setLines] = useState(0);
  return (
    <div className="tool-body">
      <p className="tool-when"><strong>When:</strong> {m.when}</p>
      <ol className="tool-steps">{m.steps.map((s) => <li key={s}>{s}</li>)}</ol>
      <div className="tool-example">
        <span>Example</span>
        <div className="maths-big small">{m.example.question}</div>
        {m.example.lines.slice(0, lines).map((l) => <div key={l} className="learn-show">{l}</div>)}
        {lines < m.example.lines.length
          ? <button type="button" className="btn ghost small" onClick={() => setLines(lines + 1)}>Next line ▶ ({lines}/{m.example.lines.length})</button>
          : <p className="muted small">That is the whole example.</p>}
      </div>
      {m.watch && <p className="tool-watch"><strong>⚠️ Watch out:</strong> {m.watch}</p>}
      <button type="button" className="btn primary" onClick={onPractise}>Practise this topic</button>
    </div>
  );
}
