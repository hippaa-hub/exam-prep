/** The readiness ring: 0 to 100%. */
export function Ring({ value, size = 124, word = 'ready' }: { value: number; size?: number; word?: string }) {
  const stroke = size < 100 ? 10 : 13;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={size < 100 ? 'ring small-ring' : 'ring'} style={{ width: size, height: size }} role="img" aria-label={`${pct}% ${word}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle className={pct >= 80 ? 'ring-value ready' : 'ring-value'} cx={size / 2} cy={size / 2} r={r} fill="none"
          strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div className="ring-text"><strong>{pct}%</strong><span>{word}</span></div>
    </div>
  );
}
