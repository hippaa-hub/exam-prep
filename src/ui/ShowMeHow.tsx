// "Show me how": the method for the question on screen, opened one step at a time before she answers.
export function ShowMeHow({ steps, shown, onMore }: { steps: string[]; shown: number; onMore: () => void }) {
  if (shown === 0) {
    return (
      <button type="button" className="btn ghost how-btn" onClick={onMore}>💡 Show me how</button>
    );
  }
  return (
    <section className="how-box" aria-label="Show me how">
      <h3>💡 How to do it</h3>
      <ol>{steps.slice(0, shown).map((s) => <li key={s}>{s}</li>)}</ol>
      {shown < steps.length
        ? <button type="button" className="btn ghost small" onClick={onMore}>Next step ({shown}/{steps.length})</button>
        : <p className="muted">That is the whole method. Now try it!</p>}
    </section>
  );
}
