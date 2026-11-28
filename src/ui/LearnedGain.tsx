// "How much have I learned?" at the end of every task (Jenia, 28 Nov: the % is the most important thing she sees).
import { Ring } from './Ring';

export function LearnedGain({ before, after }: { before: number; after: number }) {
  const gain = Math.max(0, after - before);
  return (
    <section className="card learned-gain" role="status" aria-label={`You have learned ${after}% of the test material`}>
      <Ring value={after} size={92} word="learned" />
      <div>
        <h2>{gain > 0 ? `+${gain}% from this task` : 'Every answer counts'}</h2>
        <p>You have learned <strong>{after}%</strong> of the test material{gain > 0 ? ` (it was ${before}%)` : ''}.</p>
        <p className="muted small">Each thing counts fully once you get it right on three different days.</p>
      </div>
    </section>
  );
}
