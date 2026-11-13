import { useMemo } from 'react';

const COLOURS = ['#5b5bd6', '#58cc02', '#1cb0f6', '#ff9600', '#ffc800', '#ce82ff'];

/** A short burst of confetti at the end of a session. Hidden for people who ask for less motion. */
export function Confetti({ pieces = 36 }: { pieces?: number }) {
  const bits = useMemo(() => Array.from({ length: pieces }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.8 + Math.random() * 1.4,
    colour: COLOURS[i % COLOURS.length],
    turn: Math.random() * 360,
  })), [pieces]);
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <span key={i} style={{
          left: `${b.left}%`, background: b.colour, animationDelay: `${b.delay}s`,
          animationDuration: `${b.duration}s`, transform: `rotate(${b.turn}deg)`,
        }} />
      ))}
    </div>
  );
}
